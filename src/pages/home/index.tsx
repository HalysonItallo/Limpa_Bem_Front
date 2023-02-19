import { AppBar, Button, Grid, Toolbar, Typography } from "@mui/material";
import { Box } from "@mui/system";

export default function Home() {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
      }}
    >
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Limpa Bem
          </Typography>
          <Button color="inherit">Login</Button>
          <Button color="inherit">Cadastre-se</Button>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          backgroundColor: "#f5f5f5",
          height: "calc(100% - 64px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography m={6} variant="h5">
          Escolha o serviço desejado
        </Typography>

        <Grid container spacing={2} columns={12} padding={2}>
          <Grid item xs={12} sm={4}>
            <Box
              sx={{
                display: "flex",
                width: "100%",
                height: 200,
                minWidth: 150,
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                borderRadius: "8px",
                padding: "28px",
                backgroundColor: "#F3F3F3",
                boxShadow: "6px 8px 25px 8px rgba(43, 41, 41, 0.21)",
              }}
            >
              <Typography variant="h5"> Limpeza Profunda </Typography>
              <Typography variant="subtitle1">
                Clique aqui para agendar o seu atendimento
              </Typography>
              <Typography>Valor: 120,00 R$</Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Box
              sx={{
                display: "flex",
                width: "100%",
                height: 200,
                minWidth: 150,
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                borderRadius: "8px",
                padding: "28px",
                backgroundColor: "#F3F3F3",
                boxShadow: "6px 8px 25px 8px rgba(43, 41, 41, 0.21)",
              }}
            >
              <Typography variant="h5"> Limpeza Profunda </Typography>
              <Typography variant="subtitle1">
                Clique aqui para agendar o seu atendimento               
              </Typography>
              <Typography>Valor: 120,00 R$</Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
