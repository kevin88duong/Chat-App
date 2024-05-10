import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import {WebhookEvent} from "@clerk/nextjs/dist/types/server"
import { Webhook } from "svix";
import {internal} from "./_generated/api"

const validatePayload = async (req: Request): Promise<WebhookEvent | undefined> =>{
    const payload = await req.text()
    const headerPayload  = req.headers

    const svixHeaders = {
        "svix-id": headerPayload.get("svix-id")!,
        "svix-timestamp": headerPayload.get("svix-timestamp")!,
        "svix-signature": headerPayload.get("svix-signature")!,
    }

    const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET as string)

    try {
        const event = webhook.verify(payload, svixHeaders) as WebhookEvent
        console.log(event);
        return event
        
    } catch (error) {
        console.error("Clerk Webhook could not be verified .....")
        return
    }
}

const handleClerkWebhook = httpAction(async(ctx, req)=>{
    const event = await validatePayload(req)

    if(!event){
        return new Response("Could not validate payload", {
            status: 400
        })
    }
    switch(event.type){
        case "user.created":
            const user = await ctx.runQuery(internal.user.get, {clerkId: event.data.id})

            if (user){
                console.log(`Updating user ${event.data.id} with: ${event.data}`)
            }
        
        case "user.updated":
           { console.log("Creating/Updating user", event.data.id)
            await ctx.runMutation(internal.user.create, {
                username: `${event.data.first_name} ${event.data.last_name}`,
                imageUrl: event.data.image_url,
                clerkId: event.data.id,
                email: event.data.email_addresses[0].email_address,

            })
            break
        }
        default: {
            console.log("Error", event.type)
        }
    }
    return new Response(null, {status:200})

    
})

const http = httpRouter()

http.route({
    path: "/clerk-users-webhook",
    method: "POST",
    handler: handleClerkWebhook,
})


export default http;