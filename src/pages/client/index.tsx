import withAuth, { Permissions, CommonAuthProps } from "@/components/WithAuth";
import { AppBar, Box, Toolbar, Button, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import {
  getCustomerServicesById,
  CustomerService,
} from "server/customer_services";
import { useRouter } from "next/router";
import { CustomStatusDataGridCell } from "@/components/CustomStatusDataGridCell";
import Link from "next/link";

const customerServiceColumns: GridColDef[] = [
  {
    field: "service",
    headerName: "Serviço",
    valueGetter: (params: GridValueGetterParams) => {
      return `${params.row.service.name || "-"}`;
    },
    flex: 1,
  },
  { field: "amount", headerName: "Valor" },
  {
    field: "helper",
    headerName: "Helper",
    valueGetter: (params: GridValueGetterParams) => {
      return `${params.row.helper?.first_name || "-"}`;
    },
    flex: 1,
  },
  {
    field: "status",
    headerName: "Status",
    valueGetter: (params: GridValueGetterParams) => {
      return `${params.row.status.name || "-"}`;
    },
    flex: 1,
    renderCell: CustomStatusDataGridCell,
  },
  { field: "type_payment", headerName: "Tipo de pagamento", flex: 1 },
  { field: "created_at", headerName: "Criado em", flex: 1 },
  { field: "will_carried_at", headerName: "Data para realização", flex: 1 },
];

const ClientPage = ({ userGroupName, userId }: CommonAuthProps) => {
  const router = useRouter();
  const [customerServices, setCustomerServices] = useState<
    Array<CustomerService>
  >([]);

  useEffect(() => {
    if (userId != null) {
      getCustomerServicesById(Number(userId))
        .then((data) => {
          setCustomerServices(data);
        })
        .catch(console.error);
    } else {
      localStorage.clear();
      router.push("/login");
    }
  }, [router, userId]);

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
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Limpa Bem
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              sx={{
                marginRight: 4,
              }}
              variant="inherit"
            >
              Bem vindo
            </Typography>

            <Link href="/client/create">
              <Button
                variant="contained"
                color="secondary"
                sx={{
                  marginRight: 4,
                }}
              >
                Fazer pedido
              </Button>
            </Link>

            <Link href="/logout">
              <Button variant="contained" color="secondary">
                Logout
              </Button>
            </Link>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          backgroundColor: "#f5f5f5",
          height: "calc(100% - 64px)",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 8,
        }}
      >
        <DataGrid
          sx={{
            width: "100%",
          }}
          rows={customerServices}
          columns={customerServiceColumns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          autoPageSize
        />
      </Box>
    </Box>
  );
};

export default withAuth(ClientPage);
