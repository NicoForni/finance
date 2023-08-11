import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from 'components/layout';
import Dashboard from 'pages/dashboard';
import PositionServiceContext from 'contexts/positionServiceContext';
import PositionPage from 'pages/position';
import Home from 'pages/home';
import PositionService from 'services/position-service';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function bootstrapApplication() {
  const container = document.getElementById('root');
  const root = createRoot(container!);

  root.render(
    <PositionServiceContext.Provider value={{ positionService: new PositionService() }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="position/:positionId" element={<PositionPage />} />
              <Route path="dashboard" element={<Dashboard />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </PositionServiceContext.Provider>
  );
}

bootstrapApplication();

if (module.hot) {
  module.hot.accept();
}
