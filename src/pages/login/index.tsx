import { Button, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { UserLoginDTO, makeLogin } from "../../../server/users";
import { useRouter } from "next/router";
import { useCallback } from "react";
import Loading from "@/components/Loading";
import { useState } from "react";
import apiClient from "server/client";
import Link from "next/link";

export type Permissions = "cliente" | "gerente" | "helper" | "atendente";

export default function Login() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { register, handleSubmit } = useForm<UserLoginDTO>();

  const redirectToHome = useCallback(() => {
    router.push("/");
  }, [router]);

  const onSubmit: SubmitHandler<UserLoginDTO> = async (loginCredentials) => {
    try {
      setIsLoading(true);
      const loginAttempt = await makeLogin(loginCredentials);
      const userToken = loginAttempt?.token;
      const groupName = loginAttempt?.group_name;
      const userIdFromToken = loginAttempt?.user_id;

      console.log({ loginAttempt });

      if (loginAttempt?.token !== undefined) {
        localStorage.setItem("token", String(userToken));
        localStorage.setItem("userId", String(userIdFromToken));

        switch (groupName) {
          case "cliente":
            router.push("/client");
            break;
          case "gerente":
            router.push("/manager");
            break;
          case "gerente":
            router.push("/helper");
            break;
          case "atendente":
            router.push("/attendant");
            break;
          default:
            router.push("/client");
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token !== null) {
      redirectToHome();
    }

    setIsLoading(false);
  }, [redirectToHome]);

  return (
    <>
      <Loading isLoading={isLoading} />
      <Box
        sx={{
          width: "100%",
          height: "100vh",
          backgroundColor: "#f5f5f5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Typography variant="h4" sx={{ mb: 4 }}>
          Bem vindo ao Limpa-Bem
        </Typography>

        <Box
          onSubmit={handleSubmit(onSubmit)}
          component="form"
          sx={{
            display: "flex",
            width: ["90%", "40%", "30%"],
            minWidth: 280,
            height: 300,
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            borderRadius: "8px",
            padding: "28px",
            backgroundColor: "#F3F3F3",
            boxShadow: "6px 8px 25px 8px rgba(43, 41, 41, 0.21)",
          }}
        >
          <TextField
            sx={{ width: "100%" }}
            label="Usuário"
            {...register("username")}
          />
          <TextField
            sx={{ width: "100%" }}
            label="Senha"
            type={"password"}
            {...register("password")}
          />

          <Box
            sx={{
              mt: 5,
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Link href="/register">Não tem login? Registre-se</Link>
            <Button type="submit" variant="contained" disabled={isLoading}>
              Entrar
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
}
