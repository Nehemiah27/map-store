import { useState, useEffect, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Box,
  TextField,
  Typography,
} from "@mui/material";
import { post } from "../../services/ApiRequest";
import { useLoader } from "../../contexts/LoaderContext";
import API_ROUTES from "../../constants/apiRoutes";
import { useSnackbar } from "../../contexts/SnackbarContext";

const columns = [
  { id: "no", label: "No.", width: 50 },
  { id: "name", label: "Name" },
  { id: "email", label: "Email" },
];

const ViewUsers = () => {
  const [page, setPage] = useState(0),
    [rows, setRows] = useState([]),
    { setLoading } = useLoader(),
    { showSnackbar } = useSnackbar(),
    [rowsPerPage, setRowsPerPage] = useState(10),
    [totalRecords, setTotalRecords] = useState(0),
    [searchQuery, setSearchQuery] = useState("");

  const fetchData = useCallback(
    async (query, page, rowsPerPage) => {
      setLoading(true);
      try {
        const response = await post(API_ROUTES.VIEW_USERS, {
          currentPage: page + 1,
          totalRecordsPerPage: rowsPerPage,
          searchText: query,
        });
        setTotalRecords(response.data.totalRecords);
        setRows(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        showSnackbar(error.response?.data?.message, "error");
      } finally {
        setLoading(false);
      }
    },
    [setLoading, showSnackbar]
  );

  useEffect(() => {
    fetchData(searchQuery, page, rowsPerPage);
  }, [searchQuery, page, rowsPerPage, fetchData]);

  const handleChangePage = (event, newPage) => {
      setPage(newPage);
    },
    handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    },
    handleSearchChange = (event) => {
      setSearchQuery(event.target.value);
      setPage(0);
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
        <Typography variant="h6">Users Data:-</Typography>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{ width: "18.75em" }}
        />
      </Box>
      <TableContainer
        className="view-users-table"
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
                    width:
                      column.id === "name"
                        ? "auto"
                        : column.id === "email"
                        ? "100px"
                        : column.width ?? "auto",
                    flex: column.id === "email" ? 1 : column.width ? "none" : 1,
                    whiteSpace: column.id === "name" ? "nowrap" : "normal",
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
                <TableCell sx={{ padding: "0.5em 1em" }}>
                  {page * rowsPerPage + index + 1}
                </TableCell>
                <TableCell sx={{ padding: "0.5em 1em" }}>
                  {row.fullName}
                </TableCell>
                <TableCell sx={{ padding: "0.5em 1em" }}>{row.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box
        sx={{
          padding: 2,
          backgroundColor: "#f5f5f5",
          borderTop: "0.063em solid #a8a8a8",
        }}
      >
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalRecords}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ display: "flex", justifyContent: "flex-end" }}
        />
      </Box>
    </Paper>
  );
};

export default ViewUsers;
