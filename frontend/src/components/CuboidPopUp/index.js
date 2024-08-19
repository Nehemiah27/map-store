import React, { useCallback, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, Box } from "@mui/material";
import Cuboid from "../Cuboid";
import API_ROUTES from "../../constants/apiRoutes";
import { post } from "../../services/ApiRequest";
import { useLoader } from "../../contexts/LoaderContext";

const DataPopup = ({ open, onClose, mapID, title }) => {
  const { setLoading } = useLoader(),
    fetchImage = useCallback(
      async (mapID) => {
        setLoading(true);
        try {
          const response = await post(API_ROUTES.VIEW_MAP, { mapID });
          if (response.success) {
            const canvasWrapper = document.getElementById("saved-view");
            while (canvasWrapper.firstChild) {
              canvasWrapper.removeChild(canvasWrapper.firstChild);
            }
            Cuboid(response.data);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      },
      [setLoading]
    );

  useEffect(() => {
    if (open && mapID) fetchImage(mapID);
  }, [open, mapID, fetchImage]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      PaperProps={{
        style: {
          maxWidth: "71.25em",
          height: "auto",
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box
          my={2}
          id="saved-view"
          sx={{
            overflow: "hidden",
            resize: "both",
            height: "25em",
            width: "100%",
            maxWidth: "71.25em",
            border: "0.063em solid #ccc",
          }}
        ></Box>
      </DialogContent>
    </Dialog>
  );
};

export default DataPopup;
