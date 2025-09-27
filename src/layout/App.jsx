import React, { useEffect, useState } from 'react';

// material-ui
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';


// third-party
import { useSelector } from 'react-redux';

// project import
import theme from 'themes';
import Routes from 'routes/index';
import NavigationScroll from './NavigationScroll';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ==============================|| APP ||============================== //

const App = () => {
  const customization = useSelector((state) => state.customization);

  return (
    <>
      {
        <NavigationScroll>
          <StyledEngineProvider injectFirst>  
            <ThemeProvider theme={theme(customization)}>  
              <CssBaseline />
              <Routes />
            </ThemeProvider>
          </StyledEngineProvider>
          <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick pauseOnFocusLoss draggable pauseOnHover theme="light" />
        </NavigationScroll>
      }
    </>
  );
};

export default App;
