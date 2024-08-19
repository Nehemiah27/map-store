import { useState, useEffect, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Tooltip,
  Paper,
  Box,
  TextField,
  Typography,
} from "@mui/material";
import {
  Edit as EditIcon,
  Visibility as ViewIcon,
  CloudUpload as LoadIcon,
} from "@mui/icons-material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import AnnotationDialog from "../Annotation";
import DeleteIcon from "@mui/icons-material/Delete";
import { post } from "../../services/ApiRequest";
import { useLoader } from "../../contexts/LoaderContext";
import API_ROUTES from "../../constants/apiRoutes";
import { useSnackbar } from "../../contexts/SnackbarContext";
import DataPopup from "../CuboidPopUp";
import { useNavigate } from "react-router-dom";

const columns = [
  { id: "no", label: "No.", width: 50 },
  { id: "title", label: "Title" },
  { id: "actions", label: "Actions", width: 250 },
];

const SavedMaps = () => {
  const [page, setPage] = useState(0),
    [rows, setRows] = useState([]),
    navigate = useNavigate(),
    { setLoading } = useLoader(),
    { showSnackbar } = useSnackbar(),
    [rowsPerPage, setRowsPerPage] = useState(10),
    [totalRecords, setTotalRecords] = useState(0),
    [searchQuery, setSearchQuery] = useState(""),
    [openPopup, setOpenPopup] = useState({
      popUp: false,
      notes: "",
      title: "",
      mapID: "",
    }),
    [cuboid, setCuboid] = useState({ open: false, mapID: "", title: "" });

  const fetchData = useCallback(
    async (query, page, rowsPerPage) => {
      setLoading(true);
      try {
        const response = await post(API_ROUTES.SEARCH_MAPS, {
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

  const handleAnnotationSubmit = async () => {
      editAnnotation(openPopup.mapID, openPopup.title, openPopup.notes);
    },
    handleAnnotationChange = (event) => {
      setOpenPopup((prevState) => ({
        ...prevState,
        [event.target.id]: event.target.value,
      }));
    },
    handleEditClick = (notes, title, mapID) => {
      setOpenPopup((prevState) => ({
        ...prevState,
        popUp: true,
        notes,
        title,
        mapID,
      }));
    },
    handleChangePage = (event, newPage) => {
      setPage(newPage);
    },
    handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    },
    handleSearchChange = (event) => {
      setSearchQuery(event.target.value);
      setPage(0);
    },
    handleDelete = async (mapID) => {
      await deleteRow(mapID);
    },
    handleDownload = async (mapID) => {
      await downloadImage(mapID);
    },
    handleViewClick = (mapID, title) => {
      setCuboid((prevState) => ({
        ...prevState,
        open: true,
        mapID,
        title,
      }));
    },
    handleLoad = (mapID, lat, lng, mLat, mLng, zoom) => {
      const marker =
        mLat !== null && mLng !== null ? `&mLat=${mLat}&mLng=${mLng}` : "";
      navigate(
        `/home?mapID=${mapID}&lat=${lat}&lng=${lng}&zoom=${zoom}${marker}`
      );
    };

  const editAnnotation = async (mapID, title, notes) => {
    setLoading(true);
    try {
      const response = await post(API_ROUTES.EDIT_ANNOTATION, {
        mapID,
        title,
        notes,
      });
      if (response.success) {
        setOpenPopup((prevState) => ({
          ...prevState,
          popUp: false,
        }));
        showSnackbar(response.message, "success");
        fetchData(searchQuery, page, rowsPerPage);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      showSnackbar(error.response?.data?.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const deleteRow = async (mapID) => {
    setLoading(true);
    try {
      const response = await post(API_ROUTES.DELETE_MAP, { mapID });
      if (response.success) {
        setPage(0);
        showSnackbar(response.message, "success");
        fetchData(searchQuery, page, rowsPerPage);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      showSnackbar(error.response?.data?.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = async (mapID) => {
    setLoading(true);
    try {
      const response = await post(API_ROUTES.VIEW_MAP, { mapID });
      if (response.success) {
        const link = document.createElement("a");
        link.href = response.data;
        link.download = "map-screenshot.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showSnackbar(response.message, "success");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      showSnackbar(error.response?.data?.message, "error");
    } finally {
      setLoading(false);
    }
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
        <Typography variant="h6">Saved Maps Data:-</Typography>
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
        className="saved-map-table"
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
                <TableCell sx={{ padding: "0.5em 1em" }}>
                  {page * rowsPerPage + index + 1}
                </TableCell>
                <TableCell sx={{ padding: "0.5em 1em" }}>{row.title}</TableCell>
                <TableCell sx={{ padding: "0.5em 1em" }}>
                  <Tooltip title="Edit" arrow>
                    <IconButton
                      onClick={() => {
                        handleEditClick(row.notes, row.title, row.mapID);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="View" arrow>
                    <IconButton
                      onClick={() => handleViewClick(row.mapID, row.title)}
                    >
                      <ViewIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Load" arrow>
                    <IconButton
                      onClick={() =>
                        handleLoad(
                          row.mapID,
                          row.lat,
                          row.lng,
                          row.mLat,
                          row.mLng,
                          row.zoom
                        )
                      }
                    >
                      <LoadIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Download" arrow>
                    <IconButton
                      aria-label="Download"
                      onClick={() => handleDownload(row.mapID)}
                    >
                      <FileDownloadIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete" arrow>
                    <IconButton
                      aria-label="Delete"
                      onClick={() => handleDelete(row.mapID)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
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
      <AnnotationDialog
        openPopup={openPopup.popUp}
        handleAnnotationSubmit={handleAnnotationSubmit}
        annotation={openPopup}
        handleAnnotationChange={handleAnnotationChange}
      />
      <DataPopup
        open={cuboid.open}
        onClose={() =>
          setCuboid((prevState) => ({
            ...prevState,
            open: false,
            mapID: "",
          }))
        }
        mapID={cuboid.mapID}
        title={cuboid.title}
      />
    </Paper>
  );
};

export default SavedMaps;
