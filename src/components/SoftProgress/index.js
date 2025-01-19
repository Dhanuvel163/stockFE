import { forwardRef } from "react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// Soft UI Dashboard React components
import SoftTypography from "../SoftTypography";

// Custom styles for SoftProgress
import SoftProgressRoot from "./SoftProgressRoot";

const SoftProgress = forwardRef(({ variant="contained", color="info", value=0, label=false, ...rest }, ref) => (
  <>
    {label && (
      <SoftTypography variant="button" fontWeight="medium" color="text">
        {value}%
      </SoftTypography>
    )}
    <SoftProgressRoot
      {...rest}
      ref={ref}
      variant="determinate"
      value={value}
      ownerState={{ color, value, variant }}
    />
  </>
));

// Typechecking props for the SoftProgress
SoftProgress.propTypes = {
  variant: PropTypes.oneOf(["contained", "gradient"]),
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "light",
    "dark",
  ]),
  value: PropTypes.number,
  label: PropTypes.bool,
};

export default SoftProgress;
