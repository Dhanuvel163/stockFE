import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Icon from "@mui/material/Icon";
import SoftBox from "../../../components/SoftBox";
import SoftTypography from "../../../components/SoftTypography";
import Breadcrumbs from "../../../examples/Breadcrumbs";
import { navbar, navbarContainer, navbarRow, navbarIconButton, navbarMobileMenu } from "../../../examples/Navbars/DashboardNavbar/styles";
import { useSoftUIController, setTransparentNavbar, setMiniSidenav } from "../../../context";
import { useUserController } from "../../../context/user";

function DashboardNavbar({ absolute=false, light=false, isMini=false }) {
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useSoftUIController();
  const [userController, userDispatch] = useUserController();
  const { isLoggedIn } = userController;
  const { miniSidenav, transparentNavbar, fixedNavbar } = controller;
  const route = useLocation().pathname.split("/").slice(1);

  useEffect(() => {
    if (fixedNavbar) setNavbarType("sticky");
    else setNavbarType("static");
    function handleTransparentNavbar() {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
    }
    window.addEventListener("scroll", handleTransparentNavbar);
    handleTransparentNavbar();
    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);

  return (
    <AppBar position={absolute ? "absolute" : navbarType} color="inherit" sx={(theme) => navbar(theme, { transparentNavbar, absolute, light })}>
      <Toolbar sx={(theme) => navbarContainer(theme)}>
        <SoftBox color="inherit" mb={{ xs: 1, md: 0 }} sx={(theme) => navbarRow(theme, { isMini })}>
          <Breadcrumbs icon="home" title={route[route.length - 1]} route={route} light={light} />
        </SoftBox>
        {isMini ? null : (
          <SoftBox sx={(theme) => navbarRow(theme, { isMini })}>
            <SoftBox color={light ? "white" : "inherit"}>
              {
                !isLoggedIn &&
                <Link to="/authentication/sign-in">
                  <IconButton sx={navbarIconButton} size="small">
                    <Icon sx={({ palette: { dark, white } }) => ({color: light ? white.main : dark.main})}>
                      account_circle
                    </Icon>
                    <SoftTypography variant="button" fontWeight="medium" color={light ? "white" : "dark"}>
                      Sign in
                    </SoftTypography>
                  </IconButton>
                </Link>
              }
              <IconButton size="small" color="inherit" sx={navbarMobileMenu} onClick={handleMiniSidenav}>
                <Icon className={light ? "text-white" : "text-dark"}>
                  {miniSidenav ? "menu_open" : "menu"}
                </Icon>
              </IconButton>
            </SoftBox>
          </SoftBox>
        )}
      </Toolbar>
    </AppBar>
  );
}

// Typechecking props for the DashboardNavbar
DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

export default DashboardNavbar;
