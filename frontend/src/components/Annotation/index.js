import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

const AnnotationDialog = ({
  openPopup,
  handleAnnotationSubmit,
  annotation,
  handleAnnotationChange,
}) => {
  return (
    <Dialog
      open={openPopup}
      onClose={() => {}}
      sx={{
        "& .MuiTextField-root": {
          minWidth: "100%",
        },
      }}
    >
      <DialogTitle>Annotate Map</DialogTitle>
      <DialogContent
        sx={{
          paddingBottom: 0,
        }}
      >
        <TextField
          autoFocus
          margin="dense"
          id="title"
          label="Title"
          type="text"
          sx={{
            width: "100%",
          }}
          value={annotation.title}
          onChange={handleAnnotationChange}
        />
      </DialogContent>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="notes"
          label="Annotation"
          type="text"
          multiline
          sx={{
            "& textarea": {
              resize: "both",
              minHeight: "6.25em",
              overflow: "auto",
            },
          }}
          value={annotation.notes}
          onChange={handleAnnotationChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleAnnotationSubmit} color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AnnotationDialog;
