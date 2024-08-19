import { useState, useEffect, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Paper,
  Box,
  Typography,
} from "@mui/material";
import { CloudUpload as LoadIcon } from "@mui/icons-material";
import { post } from "../../services/ApiRequest";
import { useLoader } from "../../contexts/LoaderContext";
import API_ROUTES from "../../constants/apiRoutes";
import { useSnackbar } from "../../contexts/SnackbarContext";
import { useNavigate } from "react-router-dom";

const columns = [
  { id: "no", label: "No.", width: 50 },
  { id: "title", label: "Title" },
  { id: "stat", label: "Stat", width: 50 },
  { id: "actions", label: "Actions", width: 50 },
];

const TopThree = () => {
  const [rows, setRows] = useState([]),
    navigate = useNavigate(),
    { setLoading } = useLoader(),
    { showSnackbar } = useSnackbar();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await post(API_ROUTES.TOP_CAPTURES);
      setRows(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      showSnackbar(error.response?.data?.message, "error");
    } finally {
      setLoading(false);
    }
  }, [setLoading, showSnackbar]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLoad = (lat, lng, zoom) => {
    navigate(`/home?lat=${lat}&lng=${lng}&zoom=${zoom}&mLat=null&mLng=null`);
  };

  return (
    <Paper
      sx={{
        height: "calc(100vh - 64px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          padding: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingRight: "0.25em",
          paddingLeft: "0.25em",
          width: "100%",
          maxWidth: "50em",
        }}
      >
        <Typography variant="h6">Top Three Captures:-</Typography>
      </Box>
      <TableContainer
        className="top-three-table"
        component={Paper}
        sx={{
          flex: 1,
          overflow: "auto",
          maxWidth: "50em",
        }}
      >
        <Table
          stickyHeader
          aria-label="sticky table"
          sx={{
            minWidth: "31.25em",
          }}
        >
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  sx={{
                    backgroundColor: "#f5f5f5",
                    width: column.width ?? "auto",
                    flex: column.width ? "none" : 1,
                    whiteSpace: "nowrap",
                    padding: "0.5em 1em",
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {!rows.length && (
              <TableRow key={"no-data"}>
                <TableCell>-</TableCell>
                <TableCell>No Data Available</TableCell>
                <TableCell>-</TableCell>
              </TableRow>
            )}
            {rows.map((row, index) => (
              <TableRow key={index}>
                <TableCell sx={{ padding: "0.5em 1em" }}>{index + 1}</TableCell>
                <TableCell sx={{ padding: "0.5em 1em" }}>{`Top ${
                  index + 1
                } Capture`}</TableCell>
                <TableCell sx={{ padding: "0.5em 1em" }}>{row.count}</TableCell>
                <TableCell sx={{ padding: "0.5em 1em" }}>
                  <Tooltip title="Load" arrow>
                    <IconButton
                      onClick={() =>
                        handleLoad(row._id.lat, row._id.lng, row._id.zoom)
                      }
                    >
                      <LoadIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default TopThree;
