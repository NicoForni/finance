import React from 'react';
import MeanLogo from 'assets/svgs/mean-logo.svg';
import SvgIcon from '@mui/material/SvgIcon';
import Container from '@mui/material/Container';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';

const Layout = () => (
  <Box>
    <AppBar position="static">
      <Toolbar>
        <SvgIcon viewBox='0 0 315 140'>
          <MeanLogo />
        </SvgIcon>
        <Typography variant="h6" component="div" sx={{ marginLeft: '5px',flexGrow: 1 }}>
          Mean Finance FE Challenge
        </Typography>
      </Toolbar>
    </AppBar>
    <Container sx={{ flexGrow: 1 }}>
      <Outlet />
    </Container>
  </Box>
)

export default Layout;
