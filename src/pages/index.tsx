import { AppBar, Button, Grid, Toolbar, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { getAllServices, Service } from "server/services";
import Loading from "@/components/Loading";
import Link from "next/link";

export default function Home() {
  const [services, setServices] = useState<Array<Service>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    getAllServices()
      .then((response) => {
        setIsLoading(true)
        setServices(response);
        setIsLoading(false)
      })
      .catch((e) => {});
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
      }}
    >
      <Loading isLoading={isLoading} />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Limpa Bem
          </Typography>
          <Link href="/login">
            <Button color="inherit">Login</Button>
          </Link>

          <Link href="/register">
            <Button color="inherit">Cadastre-se</Button>
          </Link>
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
          {services.map(({ id, name, value }) => {
            return (
              <Grid item xs={12} sm={4} key={id}>
                <Box
                  sx={{
                    cursor: "pointer",
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
                  <Typography variant="h5">{name}</Typography>
                  <Typography variant="subtitle1">
                    Clique aqui para agendar o seu atendimento
                  </Typography>
                  <Typography>Valor: R$ {value}</Typography>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Box>
  );
}
