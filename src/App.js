import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";
import SoftBox from "./components/SoftBox";
import Sidenav from "./examples/Sidenav";
import Configurator from "./examples/Configurator";
import theme from "./assets/theme";
import routes from "./routes";
import { useSoftUIController, setMiniSidenav, setOpenConfigurator, setLoader } from "./context";
import { useUserController } from "./context/user";
import brand from "./assets/images/logo-ct.png";
import { Backdrop, CircularProgress } from "@mui/material";

export default function App() {
  const [controller, dispatch] = useSoftUIController();
  const [userController, userDispatch] = useUserController();
  const { miniSidenav, layout, openConfigurator, sidenavColor, loader } = controller;
  const { isLoggedIn, organization } = userController;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const { pathname } = useLocation();

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  // Change the openConfigurator state
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if(route.collapse) return getRoutes(route.collapse);
      if(route.route) return <Route exact path={route.route} element={route.component} key={route.key} />;
      if(route.privateroute){
        return (
          <Route exact path={route.privateroute} key={route.key} element={isLoggedIn ? route.component : <Navigate to="/authentication/sign-in"/>}></Route>
        );
      }
      if(route.authprivateroute){
        return (
          <Route exact path={route.authprivateroute} key={route.key} element={!isLoggedIn ? route.component : <Navigate to="/brands"/>}></Route>
        );
      }
      return null;
    });

  const configsButton = (
    <SoftBox
      display="flex" justifyContent="center" alignItems="center" zIndex={99}
      width="3.5rem" height="3.5rem" bgColor="white" bottom="2rem" color="dark"
      shadow="sm" borderRadius="50%" position="fixed" right="2rem" sx={{ cursor: "pointer" }}
      onClick={handleConfiguratorOpen}>
      <Icon fontSize="default" color="inherit">settings</Icon>
    </SoftBox>
  );

  return <>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {layout === "dashboard" && (
        <>
          <Sidenav
            color={sidenavColor} brand={brand} brandName={organization?.name || "StockM"} routes={routes}
            onMouseEnter={handleOnMouseEnter} onMouseLeave={handleOnMouseLeave}/>
          <Configurator />
          {/* {configsButton} */}
        </>
      )}
      {layout === "vr" && <Configurator />}
      <Routes>
        {getRoutes(routes)} 
        <Route path="*" element={<Navigate to="/authentication/sign-in" />} />
      </Routes>
    </ThemeProvider>
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={loader} onClick={()=>{setLoader(dispatch, false);}}>
      <CircularProgress color="inherit" />
    </Backdrop>
  </>
}
