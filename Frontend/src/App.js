import { useState, useEffect, useMemo } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import rtlPlugin from "stylis-plugin-rtl";

// Components
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import ProtectedRoute from "layouts/tables/components/ProtectedRoute";

// Routes
import routes from "routes";
import Login from "layouts/authentication/Login";

// Themes
import theme from "assets/theme";
import themeRTL from "assets/theme/theme-rtl";
import themeDark from "assets/theme-dark";
import themeDarkRTL from "assets/theme-dark/theme-rtl";

// Context
import { useMaterialUIController, setMiniSidenav, setOpenConfigurator } from "context";

// Images
import brandWhite from "assets/images/logo-ct.png";
import brandDark from "assets/images/logo-ct-dark.png";

export default function App() {
  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    direction,
    layout,
    openConfigurator,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;

  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [rtlCache, setRtlCache] = useState(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // check token
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, [pathname]);

  // auto redirect
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token && pathname !== "/login") navigate("/login", { replace: true });
    if (token && pathname === "/login") navigate("/dashboard", { replace: true });
  }, [pathname, navigate]);

  // RTL cache
  useMemo(() => {
    const cacheRtl = createCache({ key: "rtl", stylisPlugins: [rtlPlugin] });
    setRtlCache(cacheRtl);
  }, []);

  // sidenav hover
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  const configsButton = (
    <div
      style={{
        width: "3.25rem",
        height: "3.25rem",
        background: "white",
        borderRadius: "50%",
        boxShadow: "0px 4px 12px rgba(0,0,0,0.15)",
        position: "fixed",
        right: "2rem",
        bottom: "2rem",
        zIndex: 99,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
      }}
      onClick={() => setOpenConfigurator(dispatch, !openConfigurator)}
    >
      <Icon fontSize="small">settings</Icon>
    </div>
  );

  // convert routes.js to element list
  const getRoutes = (allRoutes) =>
    allRoutes.flatMap((route) => {
      if (route.collapse) return getRoutes(route.collapse);
      if (route.route)
        return <Route key={route.key} path={route.route} element={route.component} />;
      return [];
    });

  return direction === "rtl" ? (
    <CacheProvider value={rtlCache}>
      <ThemeProvider theme={darkMode ? themeDark : theme}>
        <CssBaseline />
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <>
                  <Sidenav
                    color={sidenavColor}
                    brand={
                      (transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite
                    }
                    brandName="Manage Company"
                    routes={routes}
                    onMouseEnter={handleOnMouseEnter}
                    onMouseLeave={handleOnMouseLeave}
                  />

                  <Configurator />
                  {configsButton}

                  {/* ✅ Layout di luar Routes */}
                  <DashboardLayout>{/* empty, UI only */}</DashboardLayout>

                  {/* ✅ Routes DITARUH DI LUAR DashboardLayout */}
                  <Routes>{getRoutes(routes)}</Routes>
                </>
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </ThemeProvider>
    </CacheProvider>
  ) : (
    <ThemeProvider theme={darkMode ? themeDark : theme}>
      <CssBaseline />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <>
                <Sidenav
                  color={sidenavColor}
                  brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
                  brandName="Manage Company"
                  routes={routes}
                  onMouseEnter={handleOnMouseEnter}
                  onMouseLeave={handleOnMouseLeave}
                />

                <Configurator />
                {configsButton}

                {/* ✅ Route wrapper tetap disini */}
                <DashboardLayout>
                  <Routes>{getRoutes(routes)}</Routes>
                </DashboardLayout>
              </>
            </ProtectedRoute>
          }
        />

        <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </ThemeProvider>
  );
}
