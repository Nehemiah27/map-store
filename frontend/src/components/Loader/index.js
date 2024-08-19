import { CircularProgress, Box } from "@mui/material";

const Loader = () => (
  <Box
    sx={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(0, 0, 0, 0.3)",
      zIndex: 9999,
    }}
  >
    <CircularProgress />
  </Box>
);

export default Loader;
