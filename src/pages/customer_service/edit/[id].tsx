import Loading from "@/components/Loading";
import withAuth, { Permissions, CommonAuthProps } from "@/components/WithAuth";
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
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { getAllServices, Service } from "server/services";
import {
  getCustomerServiceById,
  CustomerService,
  CreateCustomerServiceDTO,
} from "../../../../server/customer_services";
import { format } from "date-fns";
import { Status, getAllStatus } from "server/status";
import { getAllHelpers, Helper } from "server/users";
import { updateCustomerService } from "server/customer_services/update";

const CustomerServiceEditPage = ({ userGroupName }: CommonAuthProps) => {
  const { register, control, handleSubmit } =
    useForm<CreateCustomerServiceDTO>();
  const [services, setServices] = useState<Array<Service>>([]);
  const [status, setStatus] = useState<Array<Status>>([]);
  const [helpers, setHelpers] = useState<Array<Helper>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();
  const { id } = router.query;
  const [customerService, setCustomerService] =
    useState<CustomerService | null>(null);

  useEffect(() => {
    getCustomerServiceById(Number(id))
      .then(setCustomerService)
      .catch(console.error);

    getAllServices()
      .then((response) => {
        setIsLoading(true);
        setServices(response);
        setIsLoading(false);
      })
      .catch(console.error);

    getAllStatus().then(setStatus).catch(console.error);
    getAllHelpers().then(setHelpers).catch(console.error);
  }, [id]);

  const onSubmit: SubmitHandler<CreateCustomerServiceDTO> = async (
    customerServiceData
  ) => {
    try {
      setIsLoading(true);

      const wasCustomerServiceUpdated = await updateCustomerService({
        ...customerServiceData,
        id: Number(id),
        client: Number(customerService?.client.id),
        will_carried_at: new Date(
          String(customerService?.will_carried_at)
        ).toISOString(),
      });

      if (wasCustomerServiceUpdated) {
        router.push("/attendant");
      }

      console.log(customerService);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userGroupName != Permissions.Atendente) {
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

          <Link href="/attendant">
            <Button variant="contained" color="secondary">
              Voltar
            </Button>
          </Link>
        </Toolbar>
      </AppBar>

      {customerService != null ? (
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
          {helpers.length > 0 ? (
            <FormControl
              variant="outlined"
              sx={{ width: ["100%", "70%", "40%"], marginBottom: 4 }}
            >
              <InputLabel shrink>Helper</InputLabel>
              <Controller
                name="helper"
                control={control}
                defaultValue={Number(customerService.helper?.id)}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select label="Helper" {...field}>
                    {helpers.map(({ id, first_name, username }) => {
                      return (
                        <MenuItem key={id} value={id}>
                          {first_name || username}
                        </MenuItem>
                      );
                    })}
                  </Select>
                )}
              />
              <FormHelperText>Qual o serviço?</FormHelperText>
            </FormControl>
          ) : null}

          {status.length > 0 ? (
            <FormControl
              variant="outlined"
              sx={{ width: ["100%", "70%", "40%"], marginBottom: 4 }}
            >
              <InputLabel shrink>Status</InputLabel>
              <Controller
                name="status"
                control={control}
                defaultValue={customerService?.status.id}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select label="Status" {...field}>
                    {status.map(({ id, name }) => {
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

          {services.length > 0 ? (
            <FormControl
              variant="outlined"
              sx={{ width: ["100%", "70%", "40%"], marginBottom: 4 }}
            >
              <InputLabel shrink>Serviço</InputLabel>
              <Controller
                name="service"
                control={control}
                defaultValue={customerService?.service.id}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select label="Serviço" {...field} disabled>
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
              defaultValue={customerService?.type_payment}
              rules={{ required: true }}
              render={({ field }) => (
                <Select label="Pagamento" {...field} disabled>
                  <MenuItem value={"Cartão de Crédito"}>
                    Cartão de crédito
                  </MenuItem>
                  <MenuItem value={"PIX"}>PIX</MenuItem>
                  <MenuItem value={"Cartão de Débito"}>
                    Cartão de débito
                  </MenuItem>
                  <MenuItem value={"Boleto"}>Boleto</MenuItem>
                </Select>
              )}
            />
            <FormHelperText>Qual o tipo de pagamento?</FormHelperText>
          </FormControl>

          <TextField
            sx={{ width: ["100%", "70%", "40%"], mb: 4 }}
            type={"date"}
            defaultValue={format(
              new Date(customerService.will_carried_at),
              "yyyy-MM-dd"
            )}
            {...register("will_carried_at")}
            disabled
          />
          <Button type="submit" variant="contained">
            Atualizar Pedido
          </Button>
        </Box>
      ) : null}
    </Box>
  );
};

export default withAuth(CustomerServiceEditPage);
