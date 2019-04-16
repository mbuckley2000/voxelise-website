import React, {useContext} from 'react'
import {Responsive} from 'semantic-ui-react'
import {navigate} from 'gatsby'

import DesktopMenu from './DesktopMenu'
import MobileMenu from './MobileMenu'

const Header = ({location}) => {
  const token = localStorage.getItem('jwt')
  const signOut = () => {
    localStorage.clear()
    navigate('/')
  }

  return (
    <>
      <Responsive maxWidth={Responsive.onlyMobile.maxWidth}>
        <MobileMenu location={location} token={token} signout={signOut} />
      </Responsive>
      <Responsive minWidth={Responsive.onlyTablet.minWidth}>
        <DesktopMenu location={location} token={token} signout={signOut} />
      </Responsive>
    </>
  )
}

export default Header
