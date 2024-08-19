import { Snackbar, Alert } from "@mui/material";
import { useSnackbar } from "../../contexts/SnackbarContext";

const SnackbarComponent = () => {
  const { snackbar, handleClose } = useSnackbar();

  return (
    <Snackbar
      open={snackbar.open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
    >
      <Alert onClose={handleClose} severity={snackbar.type}>
        {snackbar.message}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarComponent;
