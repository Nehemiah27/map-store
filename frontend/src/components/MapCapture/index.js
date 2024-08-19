import { useState, useRef, useCallback, useEffect } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import { Box, Button, Container, Typography } from "@mui/material";
import html2canvas from "html2canvas";
import {
  libraries,
  defaultCenter,
  defaultZoom,
} from "../../constants/Variables";
import Cuboid from "../Cuboid";
import AnnotationDialog from "../Annotation";
import { useLoader } from "../../contexts/LoaderContext";
import { useSnackbar } from "../../contexts/SnackbarContext";
import API_ROUTES from "../../constants/apiRoutes";
import { useNavigate, useLocation } from "react-router-dom";
import { post } from "../../services/ApiRequest";

const MapCapture = () => {
  const location = useLocation(),
    [mapParams, setMapParams] = useState({
      ...defaultCenter,
      zoom: defaultZoom,
    }),
    navigate = useNavigate(),
    { isLoaded, loadError } = useLoadScript({
      googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
      libraries,
    }),
    { showSnackbar } = useSnackbar(),
    { setLoading } = useLoader(),
    [selectedPosition, setSelectedPosition] = useState(null),
    [annotation, setAnnotation] = useState({ title: "", notes: "" }),
    [displayNotes, setDisplayNotes] = useState({ title: "", notes: "" }),
    [openPopup, setOpenPopup] = useState({ popUp: false, newChart: false }),
    [isImageCaptured, setIsImageCaptured] = useState(false),
    mapRef = useRef(),
    fetchHomeCalled = useRef(false),
    defaultLive = useRef(false),
    defaultMarker = useRef(false),
    onMapClick = useCallback((e) => {
      const currentView = {
          lat: e.latLng.lat(),
          lng: e.latLng.lng(),
        },
        { lat, lng } = mapRef.current.getCenter().toJSON(),
        zoom = mapRef.current.getZoom();
      setSelectedPosition({ ...currentView });
      setMapParams((prevState) => ({
        ...prevState,
        lat,
        lng,
        zoom,
      }));
    }, []),
    onLoad = useCallback((map) => {
      mapRef.current = map;
      map.setOptions({
        streetViewControl: false,
        mapTypeControl: false,
      });
      map.addListener("dragend", () => {
        const { lat, lng } = map.getCenter().toJSON(),
          zoom = map.getZoom();
        setMapParams((prevState) => ({
          ...prevState,
          lat,
          lng,
          zoom,
        }));
      });
      map.addListener("zoom_changed", () => {
        const { lat, lng } = map.getCenter().toJSON(),
          zoom = map.getZoom();
        setMapParams((prevState) => ({
          ...prevState,
          lat,
          lng,
          zoom,
        }));
      });
    }, []);

  const handleAnnotationChange = (event) => {
      setAnnotation((prevState) => ({
        ...prevState,
        [event.target.id]: event.target.value,
      }));
    },
    handleAnnotationSubmit = async () => {
      const uniqueCheck = await titleCheck();
      if (!uniqueCheck) return;
      setOpenPopup((prevState) => ({
        ...prevState,
        popUp: false,
      }));
      openPopup.newChart && (await captureMapImage());
      const newNotes = JSON.parse(JSON.stringify(annotation));
      setDisplayNotes(newNotes);
      setAnnotation((prevState) => ({ ...prevState, title: "", notes: "" }));
    },
    handleOpenPopup = () => {
      setOpenPopup((prevState) => ({
        ...prevState,
        popUp: true,
        newChart: true,
      }));
    },
    captureMapImage = async () => {
      try {
        const mapDiv = mapRef.current.getDiv(),
          controls = [
            mapDiv.querySelector(".gm-control-active"),
            mapDiv.querySelector(".gmnoprint"),
            mapDiv.querySelector(".gm-bundled-control-on-bottom"),
          ];
        controls.forEach((control) => (control.style.display = "none"));
        const canvas = await html2canvas(mapDiv, {
          useCORS: true,
          logging: true,
          allowTaint: true,
        });
        const imageURL = canvas.toDataURL("image/png");
        controls.forEach((control) => (control.style.display = ""));
        setIsImageCaptured(true);
        const canvasWrapper = document.getElementById("saved-view");
        while (canvasWrapper.firstChild) {
          canvasWrapper.removeChild(canvasWrapper.firstChild);
        }
        Cuboid(imageURL);
        await storeMap(imageURL);
      } catch (error) {
        console.error("Error capturing map image:", error);
      }
    };

  const storeMap = async (imageURL) => {
    setLoading(true);
    const { lat, lng } = mapRef.current.getCenter().toJSON(),
      zoom = mapRef.current.getZoom(),
      payload = {
        userID: localStorage.getItem("authID"),
        lat: String(lat),
        lng: String(lng),
        zoom: String(zoom),
        title: annotation.title,
        notes: annotation.notes,
        mapImage: imageURL,
        mLat: selectedPosition ? `${selectedPosition.lat}` : null,
        mLng: selectedPosition ? `${selectedPosition.lng}` : null,
      };
    try {
      const response = await post(API_ROUTES.MAP_CAPTURE, payload);
      showSnackbar(response.message, "success");
    } catch (error) {
      showSnackbar(error.response?.data?.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const mapIDView = useCallback(
    async (mapID) => {
      try {
        const response = await post(API_ROUTES.FULL_MAP, { mapID });
        if (response.data === null) return;
        Cuboid(response.data.mapImage);
        setIsImageCaptured(true);
        setDisplayNotes((prevState) => ({
          ...prevState,
          title: response.data.title,
          notes: response.data.notes,
        }));
        showSnackbar(response.message, "success");
      } catch (error) {
        console.error("Error fetching data:", error);
        showSnackbar(error.response?.data?.message, "error");
      } finally {
        setLoading(false);
      }
    },
    [setLoading, showSnackbar]
  );

  const homeViewMap = useCallback(
    async (userID) => {
      try {
        const response = await post(API_ROUTES.HOME_VIEW, { userID }),
          mapImage = Object.keys(response.data);
        if (!mapImage.length) return;
        Cuboid(response.data.mapImage);
        setIsImageCaptured(true);
        setDisplayNotes((prevState) => ({
          ...prevState,
          title: response.data.title,
          notes: response.data.notes,
        }));
        showSnackbar(response.message, "success");
      } catch (error) {
        console.error("Error fetching data:", error);
        showSnackbar(error.response?.data?.message, "error");
      } finally {
        setLoading(false);
      }
    },
    [setLoading, showSnackbar]
  );

  const fetchHome = useCallback(async () => {
    setLoading(true);
    const userID = localStorage.getItem("authID");
    if (userID === null) {
      localStorage.removeItem("authUser");
      localStorage.removeItem("authToken");
      localStorage.removeItem("authEmail");
      localStorage.removeItem("authID");
      navigate("/login");
      return;
    }
    const searchParams = new URLSearchParams(location.search),
      mapID = searchParams.get("mapID");
    if ((mapID === null) | !mapID) await homeViewMap(userID);
    else await mapIDView(mapID);
  }, [homeViewMap, location.search, mapIDView, navigate, setLoading]);

  const titleCheck = async () => {
    setLoading(true);
    const userID = localStorage.getItem("authID");
    try {
      const response = await post(API_ROUTES.TITLE_CHECK, {
        userID,
        title: annotation.title,
      });
      if (response.success) {
        showSnackbar(response.message, "success");
        return true;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      showSnackbar(error.response?.data?.message, "error");
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded && !fetchHomeCalled.current) {
      fetchHomeCalled.current = true;
      fetchHome();
    }
  }, [isLoaded, fetchHome]);

  useEffect(() => {
    const userID = localStorage.getItem("authID");
    if (userID === null || userID === undefined) {
      localStorage.removeItem("authUser");
      localStorage.removeItem("authToken");
      localStorage.removeItem("authEmail");
      localStorage.removeItem("authID");
      navigate("/login");
      return;
    }
  }, [navigate]);

  useEffect(() => {
    if (isLoaded && !defaultLive.current) {
      defaultLive.current = true;
      const searchParams = new URLSearchParams(location.search),
        lat = parseFloat(searchParams.get("lat")) || mapParams.lat,
        lng = parseFloat(searchParams.get("lng")) || mapParams.lng,
        zoom = parseInt(searchParams.get("zoom")) || mapParams.zoom;
      setMapParams((prevState) => ({ ...prevState, lat, lng, zoom }));
    }
    if (isLoaded & !defaultMarker.current) {
      defaultMarker.current = true;
      const searchParams = new URLSearchParams(location.search),
        mLat = parseFloat(searchParams.get("mLat")) || null,
        mLng = parseFloat(searchParams.get("mLng")) || null;
      setTimeout(() => {
        if (mLat !== null && mLng !== null && mapRef.current)
          setSelectedPosition({ lat: mLat, lng: mLng });
      }, 0);
    }
  }, [location.search, mapParams.lat, mapParams.lng, mapParams.zoom, isLoaded]);

  if (loadError) return <Typography>Error loading maps</Typography>;
  if (!isLoaded) return <Typography>Loading Maps...</Typography>;

  return (
    <Container>
      <Box my={2}>
        <Typography variant="h6">Map Capture and 3D Rendering</Typography>
      </Box>
      <GoogleMap
        mapContainerClassName="resizable-map-container"
        zoom={mapParams.zoom}
        center={{ lat: mapParams.lat, lng: mapParams.lng }}
        onClick={onMapClick}
        onLoad={onLoad}
      >
        {selectedPosition && <Marker position={selectedPosition} />}
      </GoogleMap>
      <Box my={2}>
        <Button variant="contained" color="primary" onClick={handleOpenPopup}>
          Capture Map & Apply to 3D
        </Button>
      </Box>
      {!isImageCaptured && (
        <Typography variant="body1" color="textSecondary">
          Captured images will be shown here.
        </Typography>
      )}
      <Box
        my={2}
        id="saved-view"
        sx={{
          overflow: isImageCaptured ? "hidden" : "auto",
          resize: "both",
          height: "25em",
          width: "100%",
          border: isImageCaptured ? "0.063em solid #ccc" : "none",
        }}
      ></Box>
      {isImageCaptured && (
        <>
          <Typography variant="h6" component={"div"}>
            {displayNotes.title}
          </Typography>
          <Box my={2} display="flex" alignItems="center" sx={{ marginTop: 0 }}>
            <Typography variant="body1">{displayNotes.notes}</Typography>
          </Box>
        </>
      )}
      <AnnotationDialog
        openPopup={openPopup.popUp}
        handleAnnotationSubmit={handleAnnotationSubmit}
        annotation={annotation}
        handleAnnotationChange={handleAnnotationChange}
      />
    </Container>
  );
};

export default MapCapture;
