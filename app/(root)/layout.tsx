import SidebarWarpper from '@/components/shared/sidebar/SidebarWarpper'
import React from 'react'

type Props = React.PropsWithChildren<{}>

const Layout = ({children}: Props) => {
  return (
    <SidebarWarpper>{children}</SidebarWarpper>
  )
}

export default Layout