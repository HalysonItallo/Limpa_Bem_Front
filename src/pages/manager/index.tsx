import withAuth, { CommonAuthProps, Permissions } from "@/components/WithAuth";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import {
  getCustomerServices,
  getFinishedCustomerServices,
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
];

enum ManagerVisualization {
  Report,
  Normal,
}

const ManagerPage = ({ userId, userGroupName }: CommonAuthProps) => {
  const router = useRouter();
  const [visualization, setVisualization] = useState<ManagerVisualization>(
    ManagerVisualization.Normal
  );
  const [customerServices, setCustomerServices] = useState<
    Array<CustomerService>
  >([]);

  useEffect(() => {
    if (visualization === ManagerVisualization.Normal) {
      getCustomerServices()
        .then((data) => {
          setCustomerServices(data);
        })
        .catch(console.error);
    } else {
      getFinishedCustomerServices()
        .then((data) => {
          setCustomerServices(data);
        })
        .catch(console.error);
    }
  }, [router, visualization]);

  const getTotalAmount = (customerServices: Array<CustomerService>) => {
    let amount = 0;

    customerServices.forEach((customerService) => {
      if (customerService.amount) {
        const amountParsed = parseFloat(customerService.amount);
        amount += amountParsed;
      }
    });

    return amount;
  };

  const toggleVisualization = () => {
    setVisualization((actual) =>
      actual == ManagerVisualization.Normal
        ? ManagerVisualization.Report
        : ManagerVisualization.Normal
    );
  };

  useEffect(() => {
    if (userGroupName != Permissions.Gerente) {
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

            <Button
              onClick={toggleVisualization}
              variant="contained"
              color="secondary"
              sx={{
                marginRight: 4,
              }}
            >
              {visualization == ManagerVisualization.Normal
                ? "Ver relatório"
                : "Ver todos"}
            </Button>

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
        <Typography display={"flex"} alignSelf={"end"}>
          Valor total: R${getTotalAmount(customerServices)}
        </Typography>
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

export default withAuth(ManagerPage);
