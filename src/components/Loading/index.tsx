import { Box, Backdrop, CircularProgress } from "@mui/material";

const Loading = ({ isLoading }: { isLoading: boolean }) => {
  return (
    <Backdrop
      sx={{
        zIndex: 9,
      }}
      open={isLoading}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default Loading;
