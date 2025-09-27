import React from 'react';
import { Outlet, useLocation  } from 'react-router-dom';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { useMediaQuery, AppBar, Box, Toolbar } from '@mui/material';

// project import
import { drawerWidth } from 'config.js';
import Header from './Header';
import Sidebar from './Sidebar';
import { useEffect, useState } from 'react';

// custom style
const Main = styled((props) => <main {...props} />)(({ theme }) => ({
  width: '100%',
  minHeight: '100vh',
  flexGrow: 1,
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  [theme.breakpoints.up('md')]: {
    marginLeft: -drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`
  }
}));

const OutletDiv = styled((props) => <div {...props} />)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(3)
  },
  padding: theme.spacing(5)
}));

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = () => {
  const theme = useTheme();
  const matchUpLg = useMediaQuery(theme.breakpoints.up('lg'));
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  useEffect(() => {
    setDrawerOpen(matchUpLg);
  }, [matchUpLg]);

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <AppBar position="fixed" sx={{ zIndex: 1200 }}>
        <Toolbar>
          <Header drawerOpen={drawerOpen} drawerToggle={handleDrawerToggle} />
        </Toolbar>
      </AppBar>
      <Sidebar drawerOpen={drawerOpen} drawerToggle={handleDrawerToggle} />
      <Main
        style={{
          ...(drawerOpen && {
            transition: theme.transitions.create('margin', {
              easing: theme.transitions.easing.easeOut,
              duration: theme.transitions.duration.enteringScreen
            }),
            marginLeft: 0,
            marginRight: 'inherit'
          })
        }}
      >
        <Box sx={theme.mixins.toolbar} />
        <OutletDiv>
          <Outlet key={location.pathname} />
        </OutletDiv>
      </Main>
    </Box>
  );
};

export default MainLayout;
