import { useState, useEffect } from "react";
import Divider from "@mui/material/Divider";
import Switch from "@mui/material/Switch";
import IconButton from "@mui/material/IconButton";
import Icon from "@mui/material/Icon";
import SoftBox from "../../components/SoftBox";
import SoftTypography from "../../components/SoftTypography";
import SoftButton from "../../components/SoftButton";
import ConfiguratorRoot from "../../examples/Configurator/ConfiguratorRoot";
import { useSoftUIController, setOpenConfigurator, setTransparentSidenav, setFixedNavbar, setSidenavColor } from "../../context";

function Configurator() {
  const [controller, dispatch] = useSoftUIController();
  const { openConfigurator, transparentSidenav, fixedNavbar, sidenavColor } = controller;
  const [disabled, setDisabled] = useState(false);
  const sidenavColors = ["primary", "dark", "info", "success", "warning", "error"];

  useEffect(() => {
    function handleDisabled() {
      return window.innerWidth > 1200 ? setDisabled(false) : setDisabled(true);
    }
    window.addEventListener("resize", handleDisabled);
    handleDisabled();
    return () => window.removeEventListener("resize", handleDisabled);
  }, []);

  const handleCloseConfigurator = () => setOpenConfigurator(dispatch, false);
  const handleTransparentSidenav = () => setTransparentSidenav(dispatch, true);
  const handleWhiteSidenav = () => setTransparentSidenav(dispatch, false);
  const handleFixedNavbar = () => setFixedNavbar(dispatch, !fixedNavbar);

  const sidenavTypeButtonsStyles = ({
    functions: { pxToRem },
    boxShadows: { buttonBoxShadow },
  }) => ({
    height: pxToRem(42),
    boxShadow: buttonBoxShadow.main,
    "&:hover, &:focus": {opacity: 1}
  });

  return (
    <ConfiguratorRoot variant="permanent" ownerState={{ openConfigurator }}>
      <SoftBox display="flex" justifyContent="space-between" alignItems="baseline" pt={3} pb={0.8} px={3}>
        <SoftBox>
          <SoftTypography variant="h5">Soft UI Configurator</SoftTypography>
          <SoftTypography variant="body2" color="text">
            See our dashboard options.
          </SoftTypography>
        </SoftBox>
        <Icon
          sx={({ typography: { size, fontWeightBold }, palette: { dark } }) => ({
            fontSize: `${size.md} !important`, fontWeight: `${fontWeightBold} !important`, stroke: dark.main, 
            strokeWidth: "2px", cursor: "pointer", mt: 2
          })}
          onClick={handleCloseConfigurator}>
          close
        </Icon>
      </SoftBox>

      <Divider />

      <SoftBox pt={1.25} pb={3} px={3}>
        <SoftBox>
          <SoftTypography variant="h6">Sidenav Colors</SoftTypography>
          <SoftBox mb={0.5}>
            {sidenavColors.map((color) => (
              <IconButton
                key={color}
                sx={({ borders: { borderWidth }, palette: { white, dark }, transitions }) => ({
                  width: "24px", height: "24px", padding: 0, border: `${borderWidth[1]} solid ${white.main}`,
                  borderColor: sidenavColor === color && dark.main,
                  transition: transitions.create("border-color", {
                    easing: transitions.easing.sharp,
                    duration: transitions.duration.shorter,
                  }),
                  backgroundImage: ({ functions: { linearGradient }, palette: { gradients } }) =>
                    linearGradient(gradients[color].main, gradients[color].state),
                    "&:not(:last-child)": {mr: 1},
                    "&:hover, &:focus, &:active": {borderColor: dark.main},
                })}
                onClick={() => setSidenavColor(dispatch, color)}
              />
            ))}
          </SoftBox>
        </SoftBox>

        <SoftBox mt={3} lineHeight={1}>
          <SoftTypography variant="h6">Sidenav Type</SoftTypography>
          <SoftTypography variant="button" color="text" fontWeight="regular">
            Choose between 2 different sidenav types.
          </SoftTypography>
          <SoftBox sx={{display: "flex", mt: 2}}>
            <SoftButton
              color="info" variant={transparentSidenav ? "gradient" : "outlined"} onClick={handleTransparentSidenav} 
              disabled={disabled} fullWidth sx={{mr: 1, ...sidenavTypeButtonsStyles}}>
              Transparent
            </SoftButton>
            <SoftButton
              color="info" variant={transparentSidenav ? "outlined" : "gradient"} onClick={handleWhiteSidenav} 
              disabled={disabled} fullWidth sx={sidenavTypeButtonsStyles}>
              White
            </SoftButton>
          </SoftBox>
        </SoftBox>
        <SoftBox mt={3} mb={2} lineHeight={1}>
          <SoftTypography variant="h6">Navbar Fixed</SoftTypography>
          <Switch checked={fixedNavbar} onChange={handleFixedNavbar} />
        </SoftBox>
        <Divider />
      </SoftBox>
    </ConfiguratorRoot>
  );
}

export default Configurator;
