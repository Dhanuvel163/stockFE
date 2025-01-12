import { useEffect } from "react";
import { useLocation, NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import Icon from "@mui/material/Icon";
import SoftBox from "../../components/SoftBox";
import SoftTypography from "../../components/SoftTypography";
import SidenavCollapse from "../../examples/Sidenav/SidenavCollapse";
import SidenavRoot from "../../examples/Sidenav/SidenavRoot";
import sidenavLogoLabel from "../../examples/Sidenav/styles/sidenav";
import { useSoftUIController, setMiniSidenav } from "../../context";
import { useUserController } from "../../context/user";

function Sidenav({ color="info", brand="", brandName, routes, ...rest }) {
  const [controller, dispatch] = useSoftUIController();
  const [userController, userDispatch] = useUserController();
  const { miniSidenav, transparentSidenav } = controller;
  const { isLoggedIn } = userController;
  const location = useLocation();
  const { pathname } = location;
  const collapseName = pathname.split("/").slice(1)[0];

  const closeSidenav = () => setMiniSidenav(dispatch, true);

  useEffect(() => {
    function handleMiniSidenav() {
      setMiniSidenav(dispatch, window.innerWidth < 1200);
    }
    window.addEventListener("resize", handleMiniSidenav);
    handleMiniSidenav();
    return () => window.removeEventListener("resize", handleMiniSidenav);
  }, [dispatch, location]);

  const renderRoutes = routes.map(({ type, name, icon, title, noCollapse, key, route, authprivateroute, privateroute, href }) => {
    let returnValue;
    if (type === "collapse") {
      if(authprivateroute && isLoggedIn) return
      if(privateroute && !isLoggedIn) return
      returnValue = href ? (
        <Link href={href} key={key} target="_blank" rel="noreferrer" sx={{ textDecoration: "none" }}>
          <SidenavCollapse
            color={color} name={name} icon={icon} active={key === collapseName} noCollapse={noCollapse}/>
        </Link>
      ) : (
        <NavLink to={route || authprivateroute || privateroute} key={key}>
          <SidenavCollapse
            color={color} key={key} name={name} icon={icon} active={key === collapseName} noCollapse={noCollapse}
          />
        </NavLink>
      );
    } else if (type === "title") {
      returnValue = (
        <SoftTypography
          key={key} display="block" variant="caption" fontWeight="bold" textTransform="uppercase" opacity={0.6} 
          pl={3} mt={2} mb={1} ml={1}>
          {title}
        </SoftTypography>
      );
    } else if (type === "divider") {
      returnValue = <Divider key={key} />;
    }
    return returnValue;
  });

  return (
    <SidenavRoot {...rest} variant="permanent" ownerState={{ transparentSidenav, miniSidenav }}>
      <SoftBox pt={3} pb={1} px={4} textAlign="center">
        <SoftBox
          display={{ xs: "block", xl: "none" }} position="absolute" top={0} right={0} p={1.625} onClick={closeSidenav}
          sx={{ cursor: "pointer" }}>
          <SoftTypography variant="h6" color="secondary">
            <Icon sx={{ fontWeight: "bold" }}>close</Icon>
          </SoftTypography>
        </SoftBox>
        <SoftBox component={NavLink} to="/" display="flex" alignItems="center">
          {brand && <SoftBox component="img" src={brand} alt="Soft UI Logo" width="2rem" />}
          <SoftBox width={!brandName && "100%"} sx={(theme) => sidenavLogoLabel(theme, { miniSidenav })}>
            <SoftTypography component="h6" variant="button" fontWeight="medium" ml={1}>
              {brandName}
            </SoftTypography>
          </SoftBox>
        </SoftBox>
      </SoftBox>
      <Divider />
      <List>{renderRoutes}</List>
    </SidenavRoot>
  );
}

Sidenav.propTypes = {
  color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
  brand: PropTypes.string,
  brandName: PropTypes.string.isRequired,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Sidenav;
