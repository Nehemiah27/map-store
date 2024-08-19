import { useState, useEffect } from "react";
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
import { useLoader } from "../../contexts/LoaderContext";
import { useSnackbar } from "../../contexts/SnackbarContext";
import API_ROUTES from "../../constants/apiRoutes";
import { useNavigate } from "react-router-dom";
import { post } from "../../services/ApiRequest";

const AddUserForm = () => {
  const [showPassword, setShowPassword] = useState(false),
    { setLoading } = useLoader(),
    navigate = useNavigate(),
    { showSnackbar } = useSnackbar();

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .required("First Name is required")
        .min(1, "First Name must contain at least one letter"),
      lastName: Yup.string(),
      email: Yup.string()
        .required("Email is required")
        .matches(userRegex.EMAIL_REGEX, "Invalid email format"),
      password: Yup.string()
        .required("Password is required")
        .matches(
          userRegex.PASSWORD_REGEX,
          "Password must be at least 8 characters long with atleast 1 uppercase letter, atleast 1 numeric character and atleast 1 special character"
        ),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await post(API_ROUTES.CREATE_USER, values);
        navigate("/admin/view-users");
        showSnackbar(response.message, "success");
      } catch (error) {
        console.error("Error fetching data:", error);
        showSnackbar(error.response?.data?.message, "error");
      } finally {
        setLoading(false);
      }
    },
  });

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  useEffect(() => {
    const userID = localStorage.getItem("authID");
    if (userID === null || userID === undefined) {
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
        Add User
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          id="firstName"
          name="firstName"
          label="First Name"
          value={formik.values.firstName}
          onChange={formik.handleChange}
          error={formik.touched.firstName && Boolean(formik.errors.firstName)}
          helperText={formik.touched.firstName && formik.errors.firstName}
          sx={{ marginBottom: "1em" }}
        />
        <TextField
          fullWidth
          id="lastName"
          name="lastName"
          label="Last Name"
          value={formik.values.lastName}
          onChange={formik.handleChange}
          error={formik.touched.lastName && Boolean(formik.errors.lastName)}
          helperText={formik.touched.lastName && formik.errors.lastName}
          sx={{ marginBottom: "1em" }}
        />
        <TextField
          fullWidth
          id="email"
          name="email"
          label="Email"
          value={formik.values.email}
          onChange={formik.handleChange}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
          sx={{ marginBottom: "1em" }}
        />
        <TextField
          fullWidth
          id="password"
          name="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          value={formik.values.password}
          onChange={formik.handleChange}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title="Minimum 8 characters, including uppercase, number, and special character">
                  <Info fontSize="small" />
                </Tooltip>
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ marginBottom: "1.5em" }}
        />
        <Button color="primary" variant="contained" fullWidth type="submit">
          Submit
        </Button>
      </form>
    </Paper>
  );
};

export default AddUserForm;
