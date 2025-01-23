// react-router-dom components
import { Link } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";

// Soft UI Dashboard React components
import SoftBox from "../../../components/SoftBox";
import SoftTypography from "../../../components/SoftTypography";
import SoftInput from "../../../components/SoftInput";
import SoftButton from "../../../components/SoftButton";

// Authentication layout components
import BasicLayout from "../components/BasicLayout";

// Images
import curved6 from "../../../assets/images/curved-images/curved14.jpg";
import { Grid } from "@mui/material";
import { useForm } from "react-hook-form"
import { call_api } from "../../../util/api";
import { useSnackbar } from 'react-simple-snackbar'
import { error, success } from "../../../util/snackbar";
import { useNavigate } from "react-router-dom";
import { useSoftUIController, setLoader } from "../../../context";

function SignUp() {
  const [openErrorSnackbar, closeErrorSnackbar] = useSnackbar(error)
  const [openSuccessSnackbar, closeSuccessSnackbar] = useSnackbar(success)
  const [controller, dispatch] = useSoftUIController();
  const navigate = useNavigate();
  const {register, handleSubmit, watch, formState: { errors }} = useForm()
  const onSubmit = async(data) => {
    setLoader(dispatch, true);
    try {
      let response = await call_api("POST","organization/signup",{},data)
      if(response.data?.success){
        openSuccessSnackbar("Organization Created Successfully")
        navigate("/authentication/sign-in");
      }else openErrorSnackbar(response.data?.error)
    } catch (error) {
      const response = error.response?.data
      if(!response?.success) openErrorSnackbar(response?.error)
      else openErrorSnackbar("Something went wrong, Please try after sometime.")
    }finally{
      setLoader(dispatch, false);
    }
  }

  return (
    <BasicLayout
      title="Welcome !"
      description="Register with us to manage your stocks efficiently"
      image={curved6}
    >
      <Card>
        <SoftBox py={3} px={3}>
          <SoftBox component="form" role="form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2} sx={{ textAlign: "center" }}>
              <Grid item xs={12} lg={6}>
                <SoftBox>
                  <SoftInput placeholder="Name" 
                    {...register("name", { required: "Name is required", maxLength: { value: 200, message: "Max allowed characters is 200" } })} 
                    error={!!errors.name}/>
                  <SoftTypography color="error" fontSize={10} mt={1}>
                    <span>{errors.name?.message}</span>
                  </SoftTypography>
                </SoftBox>
              </Grid>
              <Grid item xs={12} lg={6}>
                <SoftBox>
                  <SoftInput type="email" placeholder="Email" 
                    {...register("email", { required: "Email is required" })} 
                    error={!!errors.email}/>
                  <SoftTypography color="error" fontSize={10} mt={1}>
                    <span>{errors.email?.message}</span>
                  </SoftTypography>
                </SoftBox>
              </Grid>
              <Grid item xs={12} lg={6}>
                <SoftBox>
                  <SoftInput type="text" placeholder="Bill Id Prefix" 
                    {...register("bill_prefix", { required: "Bill Id Prefix is required", maxLength: { value: 6, message: "Max allowed characters is 6" }, pattern: { value: /^[A-Za-z0-9]+$/i, message: "Only Alphabets and Numbers are allowed" } })} 
                    error={!!errors.bill_prefix}/>
                  <SoftTypography color="error" fontSize={10} mt={1}>
                    <span>{errors.bill_prefix?.message}</span>
                  </SoftTypography>
                </SoftBox>
              </Grid>
              <Grid item xs={12} lg={6}>
                <SoftBox>
                  <SoftInput type="text" placeholder="Gstin" 
                    {...register("gstin", { required: "Gstin is required", pattern: { value: /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/, message: "Please enter a valid Gstin" } })} 
                    error={!!errors.gstin}/>
                  <SoftTypography color="error" fontSize={10} mt={1}>
                    <span>{errors.gstin?.message}</span>
                  </SoftTypography>
                </SoftBox>
              </Grid>
              <Grid item xs={12} lg={6}>
                <SoftBox>
                  <SoftInput type="text" placeholder="Drug License No" 
                    {...register("drug_license_no", { required: "Drug License No is required", pattern: { value: /^[a-zA-Z0-9]{11,14}$/, message: "Please enter a valid Drug License No" } })} 
                    error={!!errors.drug_license_no}/>
                  <SoftTypography color="error" fontSize={10} mt={1}>
                    <span>{errors.drug_license_no?.message}</span>
                  </SoftTypography>
                </SoftBox>
              </Grid>
              <Grid item xs={12} lg={6}>
                <SoftBox>
                  <SoftInput type="text" placeholder="Food License No" 
                    {...register("food_license_no", { required: "Food License No is required", pattern: { value: /^[a-zA-Z0-9]{14}$/, message: "Please enter a valid Food License No" } })} 
                    error={!!errors.food_license_no}/>
                  <SoftTypography color="error" fontSize={10} mt={1}>
                    <span>{errors.food_license_no?.message}</span>
                  </SoftTypography>
                </SoftBox>
              </Grid>
              <Grid item xs={12} lg={6}>
                <SoftBox>
                  <SoftInput type="number" placeholder="Contact" 
                    {...register("contact", { required: "Contact No is required", maxLength: { value: 10, message: "Only 10 digits allowed" }, minLength: { value: 10, message: "Only 10 digits allowed" }, min: {value:0,message:"Min value allowed is 0"} })} 
                    error={!!errors.contact}/>
                  <SoftTypography color="error" fontSize={10} mt={1}>
                    <span>{errors.contact?.message}</span>
                  </SoftTypography>
                </SoftBox>
              </Grid>
              <Grid item xs={12} lg={6}>
                <SoftBox>
                  <SoftInput type="password" placeholder="Password" 
                    {...register("password", { required: "Password is required", pattern: {value:/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z!@#$%^&*()~_+-/.,"'|;\d]{8,}$/, message:"Password should contain minimum eight characters, at least one letter & one number"} })} 
                    error={!!errors.password}/>
                  <SoftTypography color="error" fontSize={10} mt={1}>
                    <span>{errors.password?.message}</span>
                  </SoftTypography>
                </SoftBox>
              </Grid>
              <Grid item xs={12} lg={12}>
                <SoftBox>
                  <SoftInput type="text" placeholder="Address" multiline rows={3}
                    {...register("address", { required: "Address is required" })} 
                    error={!!errors.address}/>
                  <SoftTypography color="error" fontSize={10} mt={1}>
                    <span>{errors.address?.message}</span>
                  </SoftTypography>
                </SoftBox>
              </Grid>
            </Grid>
            <SoftBox mt={4} mb={1}>
              <SoftButton variant="gradient" color="dark" fullWidth type="submit">
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
