import React from "react";
import { Outlet, Link } from "react-router-dom"; // Importa Link
import { AppBar, Toolbar, Typography, Box, Container, Button } from "@mui/material";

function Layout() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Dashboard Comorbidity
          </Typography>
          {/* Pulsante per tornare alla Home/Dashboard */}
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          {/* Potresti aggiungere altri link di navigazione qui */}
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Outlet />
      </Container>
      <Box component="footer" sx={{ p: 2, mt: 'auto', backgroundColor: (theme) => theme.palette.grey[200] }}>
        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} Dashboard Comorbidity. Tutti i diritti riservati.
        </Typography>
      </Box>
    </Box>
  );
}

export default Layout;