import { useState } from "react";

// react-router-dom components
import { Link } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";

// Soft UI Dashboard React components
import SoftBox from "../../../components/SoftBox";
import SoftTypography from "../../../components/SoftTypography";
import SoftInput from "../../../components/SoftInput";
import SoftButton from "../../../components/SoftButton";

// Authentication layout components
import BasicLayout from "../components/BasicLayout";
import Socials from "../components/Socials";
import Separator from "../components/Separator";

// Images
import curved6 from "../../../assets/images/curved-images/curved14.jpg";
import { Grid } from "@mui/material";

function SignUp() {
  return (
    <BasicLayout
      title="Welcome!"
      description="Register with us to manage your stocks efficiently"
      image={curved6}
    >
      <Card>
        <SoftBox py={3} px={3}>
          <SoftBox component="form" role="form">
            <Grid container spacing={3} sx={{ textAlign: "center" }}>
              <Grid item xs={12} lg={6}>
                <SoftBox>
                  <SoftInput placeholder="Name"/>
                </SoftBox>
              </Grid>
              <Grid item xs={12} lg={6}>
                <SoftBox>
                  <SoftInput type="email" placeholder="Email" />
                </SoftBox>
              </Grid>
              <Grid item xs={12} lg={6}>
                <SoftBox>
                  <SoftInput type="text" placeholder="Bill Id Prefix" />
                </SoftBox>
              </Grid>
              <Grid item xs={12} lg={6}>
                <SoftBox>
                  <SoftInput type="text" placeholder="Gstin" />
                </SoftBox>
              </Grid>
              <Grid item xs={12} lg={6}>
                <SoftBox>
                  <SoftInput type="text" placeholder="Drug License No" />
                </SoftBox>
              </Grid>
              <Grid item xs={12} lg={6}>
                <SoftBox>
                  <SoftInput type="text" placeholder="Food License No" />
                </SoftBox>
              </Grid>
              <Grid item xs={12} lg={6}>
                <SoftBox>
                  <SoftInput type="number" placeholder="Contact" />
                </SoftBox>
              </Grid>
              <Grid item xs={12} lg={6}>
                <SoftBox>
                  <SoftInput type="text" placeholder="Address" />
                </SoftBox>
              </Grid>
              <Grid item xs={10} lg={12}>
                <SoftBox>
                  <SoftInput type="password" placeholder="Password" />
                </SoftBox>
              </Grid>
            </Grid>
            <SoftBox mt={4} mb={1}>
              <SoftButton variant="gradient" color="dark" fullWidth>
                sign up
              </SoftButton>
            </SoftBox>
            <SoftBox mt={3} textAlign="center">
              <SoftTypography variant="button" color="text" fontWeight="regular">
                Already have an account?&nbsp;
                <SoftTypography component={Link} to="/authentication/sign-in" variant="button" color="dark" fontWeight="bold" textGradient>
                  Sign in
                </SoftTypography>
              </SoftTypography>
            </SoftBox>
          </SoftBox>
        </SoftBox>
      </Card>
    </BasicLayout>
  );
}

export default SignUp;
