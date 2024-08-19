import { useEffect, useState } from "react";
import {
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Tooltip,
  Typography,
  Paper,
} from "@mui/material";
import { Visibility, VisibilityOff, Info } from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { userRegex } from "../../constants/Variables";
import { useNavigate } from "react-router-dom";
import { useLoader } from "../../contexts/LoaderContext";
import { useSnackbar } from "../../contexts/SnackbarContext";
import { post } from "../../services/ApiRequest";
import API_ROUTES from "../../constants/apiRoutes";

const ChangePasswordForm = () => {
  const [showOldPassword, setShowOldPassword] = useState(false),
    [showNewPassword, setShowNewPassword] = useState(false),
    userID = localStorage.getItem("authID"),
    { setLoading } = useLoader(),
    { showSnackbar } = useSnackbar(),
    navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
    },
    validationSchema: Yup.object({
      oldPassword: Yup.string()
        .required("Old Password is required")
        .matches(
          userRegex.PASSWORD_REGEX,
          "Password must be at least 8 characters long, and include an uppercase letter, a number, and a special character"
        ),
      newPassword: Yup.string()
        .required("New Password is required")
        .matches(
          userRegex.PASSWORD_REGEX,
          "Password must be at least 8 characters long, and include an uppercase letter, a number, and a special character"
        ),
    }),
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      try {
        const response = await post(API_ROUTES.CHANGE_PASSWORD, {
          ...values,
          userID,
        });
        showSnackbar(response.message, "success");
        resetForm();
      } catch (error) {
        console.error("Error fetching data:", error);
        showSnackbar(error.response?.data?.message, "error");
      } finally {
        setLoading(false);
      }
    },
  });

  const handleClickShowOldPassword = () => setShowOldPassword(!showOldPassword),
    handleClickShowNewPassword = () => setShowNewPassword(!showNewPassword);

  useEffect(() => {
    const currentUser = localStorage.getItem("authID");
    if (currentUser === null || currentUser === undefined) {
      localStorage.removeItem("authUser");
      localStorage.removeItem("authToken");
      localStorage.removeItem("authEmail");
      localStorage.removeItem("authID");
      navigate("/login");
      return;
    }
  }, [navigate]);

  return (
    <Paper
      elevation={3}
      sx={{
        padding: "2em",
        maxWidth: "25em",
        margin: "auto",
        marginTop: "1em",
      }}
    >
      <Typography variant="h6" sx={{ marginBottom: "1em" }}>
        Change Password
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          id="oldPassword"
          name="oldPassword"
          label="Old Password"
          type={showOldPassword ? "text" : "password"}
          value={formik.values.oldPassword}
          onChange={formik.handleChange}
          error={
            formik.touched.oldPassword && Boolean(formik.errors.oldPassword)
          }
          helperText={formik.touched.oldPassword && formik.errors.oldPassword}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title="Minimum 8 characters, including uppercase, number, and special character">
                  <Info fontSize="small" />
                </Tooltip>
                <IconButton
                  aria-label="toggle old password visibility"
                  onClick={handleClickShowOldPassword}
                  edge="end"
                >
                  {showOldPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ marginBottom: "1.5em" }}
        />
        <TextField
          fullWidth
          id="newPassword"
          name="newPassword"
          label="New Password"
          type={showNewPassword ? "text" : "password"}
          value={formik.values.newPassword}
          onChange={formik.handleChange}
          error={
            formik.touched.newPassword && Boolean(formik.errors.newPassword)
          }
          helperText={formik.touched.newPassword && formik.errors.newPassword}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title="Minimum 8 characters, including uppercase, number, and special character">
                  <Info fontSize="small" />
                </Tooltip>
                <IconButton
                  aria-label="toggle new password visibility"
                  onClick={handleClickShowNewPassword}
                  edge="end"
                >
                  {showNewPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ marginBottom: "1.5em" }}
        />
        <Button color="primary" variant="contained" fullWidth type="submit">
          Change Password
        </Button>
      </form>
    </Paper>
  );
};

export default ChangePasswordForm;
