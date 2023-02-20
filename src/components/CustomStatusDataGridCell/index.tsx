import {
  GridRenderCellParams,
} from "@mui/x-data-grid";
import { ReactNode } from "react";
import {Box } from "@mui/material";

export type Status = "pendente" | "cancelado" | "realizado";

const statusColors: Record<Status, string> = {
  pendente: "yellow",
  cancelado: "red",
  realizado: "green",
};

function getStatusColor(status?: Status): string {
  if (!status) return "gray";

  return statusColors[status] ?? "gray";
}

export const CustomStatusDataGridCell = (
  params: GridRenderCellParams<any, any, any>
): ReactNode => {
  const status = params.value;

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: getStatusColor(status as Status),
      }}
    >
      {status}
    </Box>
  );
};
