import MapCapture from "./components/MapCapture";
import SavedMaps from "./components/SavedMaps";
import { CssBaseline } from "@mui/material";
import { useEffect } from "react";
import Header from "./components/Header";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import NotFound from "./components/NotFound";
import { LoaderProvider, useLoader } from "./contexts/LoaderContext";
import Loader from "./components/Loader";
import SnackbarComponent from "./components/SnackBar";
import { SnackbarProvider } from "./contexts/SnackbarContext";
import LoginPage from "./components/Login";
import TopThree from "./components/TopThree";
import ViewUsers from "./components/ViewUsers";
import AddUserForm from "./components/AddUser";
import ChangePasswordForm from "./components/ChangePassword";

function App() {
  useEffect(() => {
    const preventZoom = (event) => {
      if (event.ctrlKey && event.deltaY !== 0) event.preventDefault();
    };
    window.addEventListener("wheel", preventZoom, { passive: false });
    return () => {
      window.removeEventListener("wheel", preventZoom);
    };
  }, []);
  return (
    <>
      <Router>
        <LoaderProvider>
          <SnackbarProvider>
            <CssBaseline />
            <Header />
            <div className="dashboard-content">
              <Routes>
                <Route path="/" element={<Navigate to="/home" />} />
                <Route
                  path="/admin"
                  element={<Navigate to="/admin/view-users" />}
                />
                <Route path="/home" element={<MapCapture />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/saved-maps" element={<SavedMaps />} />
                <Route path="/top-three-captures" element={<TopThree />} />
                <Route path="/admin/view-users" element={<ViewUsers />} />
                <Route path="/admin/add-user" element={<AddUserForm />} />
                <Route
                  path="/change-password"
                  element={<ChangePasswordForm />}
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <GlobalLoader />
            <SnackbarComponent />
          </SnackbarProvider>
        </LoaderProvider>
      </Router>
    </>
  );
}

const GlobalLoader = () => {
  const { loading } = useLoader();
  return loading ? <Loader /> : null;
};

export default App;
