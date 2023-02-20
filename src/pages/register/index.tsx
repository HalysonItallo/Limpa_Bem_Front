import { Button, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useRouter } from "next/router";
import { useCallback } from "react";
import Loading from "@/components/Loading";
import { useState } from "react";
import { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Link from 'next/link'
import { UserRegisterDTO, registerUser } from "../../../server/users";

export default function Register() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { register, handleSubmit } = useForm<UserRegisterDTO>();

  const redirectToHome = useCallback(() => {
    router.push("/");
  }, [router]);

  const redirectToLogin = useCallback(() => {
    router.push("/login");
  }, [router]);

  const onSubmit: SubmitHandler<UserRegisterDTO> = async (userData) => {
    try {
      console.log({ userData });
      setIsLoading(true);
      const registerAttempt = await registerUser(userData);

      if (registerAttempt) {
        redirectToLogin();
      }
      // warning: não foi possível registrar
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
          Bem vindo ao Limpa-Bem, Registre-se para continuar
        </Typography>

        <Box
          onSubmit={handleSubmit(onSubmit)}
          component="form"
          sx={{
            display: "flex",
            width: ["90%", "40%", "30%"],
            minWidth: 280,
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
            sx={{ width: "100%", mb: 3 }}
            label="Nome"
            {...register("first_name")}
          />
          <TextField
            sx={{ width: "100%", mb: 3 }}
            label="Usuário"
            {...register("username")}
          />
          <TextField
            sx={{ width: "100%", mb: 3 }}
            label="Senha"
            type={"password"}
            {...register("password")}
          />
          <TextField
            sx={{ width: "100%", mb: 3 }}
            label="Endereço"
            {...register("adress")}
          />
          <TextField
            sx={{ width: "100%", mb: 3 }}
            label="Telefone"
            {...register("cellphone")}
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
            <Link href="/login">Já tem registro? Faça login</Link>
            <Button type="submit" variant="contained">Registrar</Button>
          </Box>
        </Box>
      </Box>
    </>
  );
}
