// react-router-dom components
import { Link } from "react-router-dom";

// Soft UI Dashboard React components
import SoftBox from "../../../components/SoftBox";
import SoftTypography from "../../../components/SoftTypography";
import SoftInput from "../../../components/SoftInput";
import SoftButton from "../../../components/SoftButton";

// Authentication layout components
import CoverLayout from "../components/CoverLayout";

// Images
import curved9 from "../../../assets/images/curved-images/curved-6.jpg";
import { useForm } from "react-hook-form"
import { call_api } from "../../../util/api";
import { useSnackbar } from 'react-simple-snackbar'
import { error, success } from "../../../util/snackbar";
import { useNavigate } from "react-router-dom";
import { useSoftUIController, setLoader } from "../../../context";
import { useUserController, setLogin } from "../../../context/user";

function SignIn() {
  const [openErrorSnackbar, closeErrorSnackbar] = useSnackbar(error)
  const [openSuccessSnackbar, closeSuccessSnackbar] = useSnackbar(success)
  const [controller, dispatch] = useSoftUIController();
  const [userController, userDispatch] = useUserController();
  const navigate = useNavigate();
  const {register, handleSubmit, watch, formState: { errors }} = useForm()

  const onSubmit = async(data) => {
    setLoader(dispatch, true);
    try {
      let response = await call_api("POST","organization/login",{},data)
      if(response.data?.success){
        setLogin(userDispatch, response.data?.organization);
        openSuccessSnackbar("Logged In Successfully")
        navigate("/dashboard");
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
    <CoverLayout color="info" top={20} title="Welcome back" description="Enter your email and password to sign in" image={curved9}>
      <SoftBox component="form" role="form" onSubmit={handleSubmit(onSubmit)}>
        <SoftBox mb={1}>
          <SoftBox mb={1} ml={0.5}>
            <SoftTypography component="label" variant="caption" fontWeight="bold">Email</SoftTypography>
          </SoftBox>
          <SoftInput type="email" placeholder="Email" 
            {...register("email", { required: "Email is required" })} 
            error={!!errors.email}/>
          <SoftTypography color="error" fontSize={10} mt={1}>
            <span>{errors.email?.message}</span>
          </SoftTypography>
        </SoftBox>
        <SoftBox mb={1}>
          <SoftBox mb={1} ml={0.5}>
            <SoftTypography component="label" variant="caption" fontWeight="bold">Password</SoftTypography>
          </SoftBox>
          <SoftInput type="password" placeholder="Password" 
            {...register("password", { required: "Password is required" })} 
            error={!!errors.password}/>
          <SoftTypography color="error" fontSize={10} mt={1}>
            <span>{errors.password?.message}</span>
          </SoftTypography>
        </SoftBox>
        <SoftBox mt={4} mb={1}>
          <SoftButton variant="gradient" color="info" type="submit" fullWidth>sign in</SoftButton>
        </SoftBox>
        <SoftBox mt={3} textAlign="center">
          <SoftTypography variant="button" color="text" fontWeight="regular">
            Don&apos;t have an account?{" "}
            <SoftTypography component={Link} to="/authentication/sign-up" variant="button" color="info" fontWeight="medium" textGradient>
              Sign up
            </SoftTypography>
          </SoftTypography>
        </SoftBox>
      </SoftBox>
    </CoverLayout>
  );
}

export default SignIn;
