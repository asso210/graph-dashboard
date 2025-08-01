import React from "react";
import { Typography, Box, Card, CardContent, CardActionArea } from "@mui/material";
import { Link } from "react-router-dom"; // Importa Link

function Dashboard() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <Link to="/analytics" style={{ textDecoration: 'none' }}> {/* Link alla pagina Analytics */}
        <Card sx={{ minWidth: 275, maxWidth: 400, m: 2 }} raised>
          <CardActionArea> {/* Rende l'area della card cliccabile */}
            <CardContent>
              <Typography variant="h5" component="div" gutterBottom>
                Visualizza la Dashboard Grafici
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Clicca qui per accedere alla dashboard con le statistiche e i grafici dettagliati.
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Link>
    </Box>
  );
}

export default Dashboard;
