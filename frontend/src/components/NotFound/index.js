import HomeIcon from "@mui/icons-material/Home";
import { Typography, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate(),
    handleHomeClick = () => {
      navigate("/home");
    };

  return (
    <Container>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ marginTop: "1.25em" }}
      >
        404 - Page Not Found
      </Typography>
      <HomeIcon
        sx={{
          fontSize: 100,
          color: "blue",
          margin: "1.25em auto",
          display: "block",
          cursor: "pointer",
        }}
        onClick={handleHomeClick}
      />
      <Typography variant="body1" align="center">
        Sorry, the page you are looking for does not exist.
      </Typography>
    </Container>
  );
};

export default NotFound;
