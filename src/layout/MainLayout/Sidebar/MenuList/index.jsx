import React from 'react';
import { Typography } from '@mui/material';
import { useLocation } from 'react-router-dom'; // 👈 import this

import NavGroup from './NavGroup';
import menuItem from 'menu-items';

const MenuList = () => {
  const location = useLocation(); // 👈 get current path
  const currentPath = location.pathname;

  const navItems = menuItem.items.map((item) => {
    switch (item.type) {
      case 'group':
        return <NavGroup key={item.id} item={item} currentPath={currentPath} />; // 👈 pass path
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Menu Items Error
          </Typography>
        );
    }
  });

  return navItems;
};

export default MenuList;
