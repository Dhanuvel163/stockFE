import { forwardRef } from "react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// Custom styles for SoftInput
import SoftInputRoot from "./SoftInputRoot";
import SoftInputWithIconRoot from "./SoftInputWithIconRoot";
import SoftInputIconBoxRoot from "./SoftInputIconBoxRoot";
import SoftInputIconRoot from "./SoftInputIconRoot";

// Soft UI Dashboard React contexts
import { useSoftUIController } from "../../context";

const SoftInput = forwardRef(({ size="medium", icon={component: false,direction: "none"}, error=false, success=false, disabled=false, ...rest }, ref) => {
  let template;
  const [controller] = useSoftUIController();
  const { direction } = controller;
  const iconDirection = icon?.direction;

  if (icon?.component && icon?.direction === "left") {
    template = (
      <SoftInputWithIconRoot ref={ref} ownerState={{ error, success, disabled }}>
        <SoftInputIconBoxRoot ownerState={{ size }}>
          <SoftInputIconRoot fontSize="small" ownerState={{ size }}>
            {icon?.component}
          </SoftInputIconRoot>
        </SoftInputIconBoxRoot>
        <SoftInputRoot
          {...rest}
          ownerState={{ size, error, success, iconDirection, direction, disabled }}
        />
      </SoftInputWithIconRoot>
    );
  } else if (icon?.component && icon?.direction === "right") {
    template = (
      <SoftInputWithIconRoot ref={ref} ownerState={{ error, success, disabled }}>
        <SoftInputRoot
          {...rest}
          ownerState={{ size, error, success, iconDirection, direction, disabled }}
        />
        <SoftInputIconBoxRoot ownerState={{ size }}>
          <SoftInputIconRoot fontSize="small" ownerState={{ size }}>
            {icon?.component}
          </SoftInputIconRoot>
        </SoftInputIconBoxRoot>
      </SoftInputWithIconRoot>
    );
  } else {
    template = (
      <SoftInputRoot {...rest} ref={ref} ownerState={{ size, error, success, disabled }} />
    );
  }

  return template;
});

// Typechecking props for the SoftInput
SoftInput.propTypes = {
  size: PropTypes.oneOf(["small", "medium", "large"]),
  icon: PropTypes.shape({
    component: PropTypes.oneOfType([PropTypes.node, PropTypes.bool]),
    direction: PropTypes.oneOf(["none", "left", "right"]),
  }),
  error: PropTypes.bool,
  success: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default SoftInput;
