import withAuth, { CommonAuthProps, Permissions } from "@/components/WithAuth";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import {
  getPendingCustomerServices,
  CustomerService,
} from "server/customer_services";
import { useRouter } from "next/router";
import { CustomStatusDataGridCell } from "@/components/CustomStatusDataGridCell";
import Link from "next/link";
import EditIcon from "@mui/icons-material/Edit";

const customerServiceColumns: GridColDef[] = [
  {
    field: "service",
    headerName: "Serviço",
    valueGetter: (params: GridValueGetterParams) => {
      return `${params.row.service.name || "-"}`;
    },
    flex: 1,
  },
  {
    field: "attendant",
    headerName: "Atendente",
    valueGetter: (params: GridValueGetterParams) => {
      return `${params.row.attendant?.first_name || "-"}`;
    },
    flex: 1,
  },
  {
    field: "client",
    headerName: "Cliente",
    valueGetter: (params: GridValueGetterParams) => {
      return `${params.row.client?.first_name || "-"}`;
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
  {
    field: "edit",
    headerName: "",
    flex: 1,
    renderCell: (params: GridRenderCellParams<any, any, any>) => {
      return (
        <Link href={`/customer_service/edit/${params.row.id}`}>
          <EditIcon />
        </Link>
      );
    },
  },
];

const AttendantPage = ({ userId, userGroupName }: CommonAuthProps) => {
  const router = useRouter();
  const [customerServices, setCustomerServices] = useState<
    Array<CustomerService>
  >([]);

  useEffect(() => {
    getPendingCustomerServices()
      .then((data) => {
        setCustomerServices(data);
      })
      .catch(console.error);
  }, []);

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
          pageSize={10}
          rowsPerPageOptions={[5]}
          autoPageSize
        />
      </Box>
    </Box>
  );
};

export default withAuth(AttendantPage);
