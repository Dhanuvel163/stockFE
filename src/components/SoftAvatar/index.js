import { forwardRef } from "react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// Custom styles for SoftAvatar
import SoftAvatarRoot from "./SoftAvatarRoot";

const SoftAvatar = forwardRef(({ bgColor="transparent", size="md", shadow="none", ...rest }, ref) => (
  <SoftAvatarRoot ref={ref} ownerState={{ shadow, bgColor, size }} {...rest} />
));

// Typechecking props for the SoftAvatar
SoftAvatar.propTypes = {
  bgColor: PropTypes.oneOf([
    "transparent",
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "light",
    "dark",
  ]),
  size: PropTypes.oneOf(["xs", "sm", "md", "lg", "xl", "xxl"]),
  shadow: PropTypes.oneOf(["none", "xs", "sm", "md", "lg", "xl", "xxl", "inset"]),
};

export default SoftAvatar;
