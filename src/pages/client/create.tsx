import Loading from "@/components/Loading";
import withAuth, { CommonAuthProps, Permissions} from "@/components/WithAuth";
import {
  AppBar,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { CreateCustomerServiceDTO } from "server/customer_services";
import { createCustomerService } from "server/customer_services/create";
import { getAllServices, Service } from "server/services";
import { useRouter } from "next/router";

const CreateCustomerService = ({ userId, userGroupName }: CommonAuthProps) => {
  const router = useRouter();
  const { register, control, handleSubmit } =
    useForm<CreateCustomerServiceDTO>();
  const [services, setServices] = useState<Array<Service>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    getAllServices()
      .then((response) => {
        setIsLoading(true);
        setServices(response);
        setIsLoading(false);
      })
      .catch(console.error);
  }, []);

  const onSubmit: SubmitHandler<CreateCustomerServiceDTO> = async (
    customerServiceData
  ) => {
    try {
      setIsLoading(true);

      const wasCustomerServiceCreated = await createCustomerService({
        ...customerServiceData,
        will_carried_at: new Date(customerServiceData.will_carried_at).toISOString(),
        client: Number(userId),
      });

      if (wasCustomerServiceCreated) {
        router.push("/client");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userGroupName != Permissions.Cliente) {
      router.push("/");
    }
  }, [router, userGroupName]);

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

          <Link href="/client">
            <Button variant="contained" color="secondary">
              Voltar
            </Button>
          </Link>
        </Toolbar>
      </AppBar>

      <Box
        onSubmit={handleSubmit(onSubmit)}
        component="form"
        sx={{
          backgroundColor: "#f5f5f5",
          height: "calc(100% - 64px)",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 8,
        }}
      >
        {services.length > 0 ? (
          <FormControl
            variant="outlined"
            sx={{ width: ["100%", "70%", "40%"], marginBottom: 4 }}
          >
            <InputLabel shrink>Serviço</InputLabel>
            <Controller
              name="service"
              control={control}
              defaultValue={1}
              rules={{ required: true }}
              render={({ field }) => (
                <Select label="Serviço" {...field}>
                  {services.map(({ id, name }) => {
                    return (
                      <MenuItem key={id} value={id}>
                        {name}
                      </MenuItem>
                    );
                  })}
                </Select>
              )}
            />
            <FormHelperText>Qual o serviço?</FormHelperText>
          </FormControl>
        ) : null}

        <FormControl
          variant="outlined"
          sx={{ width: ["100%", "70%", "40%"], marginBottom: 4 }}
        >
          <InputLabel>Pagamento</InputLabel>
          <Controller
            name="type_payment"
            control={control}
            defaultValue="PIX"
            rules={{ required: true }}
            render={({ field }) => (
              <Select label="Pagamento" {...field}>
                <MenuItem value={"Cartão de Crédito"}>
                  Cartão de crédito
                </MenuItem>
                <MenuItem value={"PIX"}>PIX</MenuItem>
                <MenuItem value={"Cartão de Débito"}>Cartão de débito</MenuItem>
                <MenuItem value={"Boleto"}>Boleto</MenuItem>
              </Select>
            )}
          />
          <FormHelperText>Qual o tipo de pagamento?</FormHelperText>
        </FormControl>

        <TextField
          sx={{ width: ["100%", "70%", "40%"], mb: 4 }}
          type={"date"}
          {...register("will_carried_at")}
        />
        <Button type="submit" variant="contained">
          Enviar Pedido
        </Button>
      </Box>
    </Box>
  );
};

export default withAuth(CreateCustomerService);
