"use client"
import LoadingLogo from '@/components/shared/LoadingLogo'
import { ClerkProvider, useAuth } from '@clerk/nextjs'
import { AuthLoading, Authenticated, ConvexReactClient } from 'convex/react'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import React from 'react'

type Props = {
  children: React.ReactNode
}

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || ""
const convex = new ConvexReactClient
(CONVEX_URL)

const ConvexClientProvider = ({children}: Props) => {
  return (
  <ClerkProvider publishableKey='pk_test_dXNhYmxlLW1vbmtleS0zNS5jbGVyay5hY2NvdW50cy5kZXYk'>
      <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
        <Authenticated>{children}</Authenticated>
        <AuthLoading><LoadingLogo/></AuthLoading>
      </ConvexProviderWithClerk>
  </ClerkProvider>
  )
}

export default ConvexClientProvider