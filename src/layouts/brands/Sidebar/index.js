import { Divider, Icon } from "@mui/material";
import SoftBox from "../../../components/SoftBox";
import SoftTypography from "../../../components/SoftTypography";
import ConfiguratorRoot from "../../../examples/Configurator/ConfiguratorRoot";
import SoftInput from "../../../components/SoftInput";
import { useForm } from "react-hook-form"
import SoftButton from "../../../components/SoftButton";
import { useEffect } from "react";

function BrandConfigurator({isOpen,handleClose,onSubmit, drawerData:{isEdit,data}}) {
  const {register, handleSubmit, watch, formState: { errors }, setValue, reset} = useForm()
  useEffect(()=>{
    if(isEdit && data){
      if(data?.name) setValue('name',data?.name)
    }
  },[data])
  useEffect(()=>{
    if(!isOpen) reset({name:''})
  },[isOpen])
  return (
    <ConfiguratorRoot variant="permanent" ownerState={{ openConfigurator:isOpen }}>
      <SoftBox display="flex" justifyContent="space-between" alignItems="baseline" pt={3} pb={0.8} px={3}>
        <SoftBox>
          <SoftTypography variant="h5">{isEdit ? "Edit" : "Add"} Brand</SoftTypography>
        </SoftBox>
        <Icon
          sx={({ typography: { size, fontWeightBold }, palette: { dark } }) => ({ fontSize: `${size.md} !important`, fontWeight: `${fontWeightBold} !important`, stroke: dark.main, strokeWidth: "2px", cursor: "pointer", mt: 2})}
          onClick={handleClose}>
          close
        </Icon>
      </SoftBox>
      <Divider/>
      <SoftBox component="form" role="form" onSubmit={handleSubmit(onSubmit)} mt={1}>
        <SoftBox mb={1}>
          <SoftInput type="name" placeholder="Brand Name"
            {...register("name", { required: "Brand name is required" })} 
            error={!!errors.email}/>
          <SoftTypography color="error" fontSize={10} mt={1}>
            <span>{errors.name?.message}</span>
          </SoftTypography>
        </SoftBox>
        <SoftBox mt={2} mb={1}>
          <SoftButton variant="gradient" color="info" type="submit" fullWidth>{isEdit ? "Edit" : "Add"}</SoftButton>
        </SoftBox>
      </SoftBox>

    </ConfiguratorRoot>
  );
}

export default BrandConfigurator;
