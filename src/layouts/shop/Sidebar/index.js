import { Divider, Icon } from "@mui/material";
import SoftBox from "../../../components/SoftBox";
import SoftTypography from "../../../components/SoftTypography";
import ConfiguratorRoot from "../../../examples/Configurator/ConfiguratorRoot";
import SoftInput from "../../../components/SoftInput";
import { useForm } from "react-hook-form"
import SoftButton from "../../../components/SoftButton";
import { useEffect } from "react";

function ShopConfigurator({isOpen,handleClose,onSubmit, drawerData:{isEdit,data}}) {
  const {register, handleSubmit, watch, formState: { errors }, setValue, reset} = useForm()
  useEffect(()=>{
    if(isEdit && data){
      if(data?.name) setValue('name',data?.name)
      if(data?.gstin) setValue('gstin',data?.gstin)
      if(data?.drug_license_no) setValue('drug_license_no',data?.drug_license_no)
      if(data?.food_license_no) setValue('food_license_no',data?.food_license_no)
      if(data?.contact) setValue('contact',data?.contact)
      if(data?.address) setValue('address',data?.address)
    }
  },[data])
  useEffect(()=>{
    if(!isOpen) reset({name:'',gstin:'',drug_license_no:'',food_license_no:'',contact:'',address:''})
  },[isOpen])
  return (
    <ConfiguratorRoot variant="permanent" ownerState={{ openConfigurator:isOpen }}>
      <SoftBox display="flex" justifyContent="space-between" alignItems="baseline" pt={3} pb={0.8} px={3}>
        <SoftBox>
          <SoftTypography variant="h5">{isEdit ? "Edit" : "Add"} Shop</SoftTypography>
        </SoftBox>
        <Icon
          sx={({ typography: { size, fontWeightBold }, palette: { dark } }) => ({ fontSize: `${size.md} !important`, fontWeight: `${fontWeightBold} !important`, stroke: dark.main, strokeWidth: "2px", cursor: "pointer", mt: 2})}
          onClick={handleClose}>
          close
        </Icon>
      </SoftBox>
      <Divider/>
      <SoftBox component="form" role="form" onSubmit={handleSubmit(onSubmit)}>
        <SoftBox mb={1}>
          <SoftBox mb={1} ml={0.5}>
            <SoftTypography component="label" variant="caption" fontWeight="bold">Name</SoftTypography>
          </SoftBox>
          <SoftInput type="text" placeholder="Name"
            {...register("name", { required: "Name is required", maxLength: { value: 200, message: "Max allowed characters is 200" } })} 
            error={!!errors.name}/>
          <SoftTypography color="error" fontSize={10} mt={1}>
            <span>{errors.name?.message}</span>
          </SoftTypography>
        </SoftBox>
        <SoftBox mb={1}>
          <SoftBox mb={1} ml={0.5}>
            <SoftTypography component="label" variant="caption" fontWeight="bold">Gstin</SoftTypography>
          </SoftBox>
          <SoftInput type="text" placeholder="Gstin"
            {...register("gstin", { pattern: { value: /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/, message: "Please enter a valid Gstin" } })} 
            error={!!errors.gstin}/>
          <SoftTypography color="error" fontSize={10} mt={1}>
            <span>{errors.gstin?.message}</span>
          </SoftTypography>
        </SoftBox>
        <SoftBox mb={1}>
          <SoftBox mb={1} ml={0.5}>
            <SoftTypography component="label" variant="caption" fontWeight="bold">Drug License Number</SoftTypography>
          </SoftBox>
          <SoftInput type="text" placeholder="Drug License Number"
            {...register("drug_license_no", { pattern: { value: /^[a-zA-Z0-9]{11,14}$/, message: "Please enter a valid Drug License No" } })} 
            error={!!errors.drug_license_no}/>
          <SoftTypography color="error" fontSize={10} mt={1}>
            <span>{errors.drug_license_no?.message}</span>
          </SoftTypography>
        </SoftBox>
        <SoftBox mb={1}>
          <SoftBox mb={1} ml={0.5}>
            <SoftTypography component="label" variant="caption" fontWeight="bold">Food License Number</SoftTypography>
          </SoftBox>
          <SoftInput type="text" placeholder="Food License Number"
            {...register("food_license_no", { pattern: { value: /^[a-zA-Z0-9]{14}$/, message: "Please enter a valid Food License No" } })} 
            error={!!errors.food_license_no}/>
          <SoftTypography color="error" fontSize={10} mt={1}>
            <span>{errors.food_license_no?.message}</span>
          </SoftTypography>
        </SoftBox>
        <SoftBox mb={1}>
          <SoftBox mb={1} ml={0.5}>
            <SoftTypography component="label" variant="caption" fontWeight="bold">Contact</SoftTypography>
          </SoftBox>
          <SoftInput type="number" placeholder="Contact"
            {...register("contact", { maxLength: { value: 10, message: "Only 10 digits allowed" }, minLength: { value: 10, message: "Only 10 digits allowed" }, min: {value:0,message:"Min value allowed is 0"} })} 
            error={!!errors.contact}/>
          <SoftTypography color="error" fontSize={10} mt={1}>
            <span>{errors.contact?.message}</span>
          </SoftTypography>
        </SoftBox>
        <SoftBox mb={1}>
          <SoftBox mb={1} ml={0.5}>
            <SoftTypography component="label" variant="caption" fontWeight="bold">Address</SoftTypography>
          </SoftBox>
          <SoftInput type="text" placeholder="Address" multiline rows={3}
            {...register("address", { required: "Address is required" })} 
            error={!!errors.address}/>
          <SoftTypography color="error" fontSize={10} mt={1}>
            <span>{errors.address?.message}</span>
          </SoftTypography>
        </SoftBox>
        <SoftBox mt={2} mb={1}>
          <SoftButton variant="gradient" color="info" type="submit" fullWidth>{isEdit ? "Edit" : "Add"}</SoftButton>
        </SoftBox>
      </SoftBox>

    </ConfiguratorRoot>
  );
}

export default ShopConfigurator;
