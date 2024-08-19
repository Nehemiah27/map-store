import { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InfoIcon from "@mui/icons-material/Info";
import { post } from "../../services/ApiRequest";
import API_ROUTES from "../../constants/apiRoutes";
import { useNavigate } from "react-router-dom";
import { useLoader } from "../../contexts/LoaderContext";
import { useSnackbar } from "../../contexts/SnackbarContext";
import { userRegex } from "../../constants/Variables";

const LoginPage = () => {
  const [email, setEmail] = useState(""),
    { setLoading } = useLoader(),
    { showSnackbar } = useSnackbar(),
    [password, setPassword] = useState(""),
    [showPassword, setShowPassword] = useState(false),
    navigate = useNavigate(),
    token = localStorage.getItem("authToken");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!userRegex.EMAIL_REGEX.test(email)) {
      showSnackbar("Invalid email format", "error");
      return;
    }
    if (!userRegex.PASSWORD_REGEX.test(password)) {
      showSnackbar("Password does not meet the requirements", "error");
      return;
    }
    setLoading(true);
    try {
      const response = await post(API_ROUTES.LOGIN, {
        email,
        password,
      });
      if (response.success) {
        showSnackbar(response.message, "success");
        localStorage.setItem("authToken", response.data.accessToken);
        localStorage.setItem("authUser", response.data.fullName);
        localStorage.setItem("authEmail", response.data.email);
        localStorage.setItem("authID", response.data.userID);
        navigate("/home");
      }
    } catch (error) {
      showSnackbar(error.response?.data?.message, "error");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (String(token).length > 12) navigate("/home");
  }, [token, navigate]);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        flexDirection: "column",
        padding: 4,
        width: "100%",
      }}
    >
      <Typography variant="h4">Login</Typography>
      <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: 400 }}>
        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
          fullWidth
          error={email !== "" && !userRegex.EMAIL_REGEX.test(email)}
          helperText={
            email !== "" && !userRegex.EMAIL_REGEX.test(email)
              ? "Invalid email format"
              : ""
          }
          required
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
          required
          error={password !== "" && !userRegex.PASSWORD_REGEX.test(password)}
          helperText={
            password !== "" && !userRegex.PASSWORD_REGEX.test(password)
              ? "Password must contain at least 8 characters, including an uppercase letter, a lowercase letter, a number, and a special character"
              : ""
          }
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
                <Tooltip title="Password must contain at least 8 characters, including an uppercase letter, a lowercase letter, a number, and a special character">
                  <InfoIcon style={{ marginLeft: 8 }} />
                </Tooltip>
              </InputAdornment>
            ),
          }}
          sx={{ marginBottom: 2 }}
        />
        <Typography sx={{ width: "100%", textAlign: "center" }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{
              padding: "0.75em 1.5em",
              marginTop: 2,
            }}
          >
            Login
          </Button>
        </Typography>
      </form>
    </Box>
  );
};

export default LoginPage;
