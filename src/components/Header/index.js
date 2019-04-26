import React from 'react';
import { navigate } from 'gatsby';

import DesktopMenu from './DesktopMenu';

const Header = ({ location }) => {
  let token;
  let signOut;
  if (typeof localStorage !== 'undefined') {
    token = localStorage.getItem('jwt');
    signOut = () => {
      localStorage.clear();
      navigate('/');
    };
  }

  return <DesktopMenu location={location} token={token} signout={signOut} />;
};

export default Header;
