import { Divider, Icon } from "@mui/material";
import SoftBox from "../../../components/SoftBox";
import SoftTypography from "../../../components/SoftTypography";
import ConfiguratorRoot from "../../../examples/Configurator/ConfiguratorRoot";
import SoftInput from "../../../components/SoftInput";
import { useForm, Controller } from "react-hook-form"
import SoftButton from "../../../components/SoftButton";
import { useEffect, useState } from "react";
import { useUserController } from "../../../context/user";
import Select from 'react-select'
import bigDecimal from 'js-big-decimal';

function ProductConfigurator({isOpen,handleClose,onSubmit, drawerData:{isEdit,data}}) {
  const {register, handleSubmit, watch, formState: { errors }, setValue, reset, control, getValues} = useForm()
  const [userController, userDispatch] = useUserController();
  const {brands} = userController
  const [sellRate,setSellRate] = useState(null)
  useEffect(()=>{
    if(isEdit && data){
      if(data?.name) setValue('name',data?.name)
      if(data?.hsn_code) setValue('hsn_code',data?.hsn_code)
      if(data?.mrp) setValue('mrp',data?.mrp)
      if(data?.rate) setValue('rate',data?.rate)
      if(data?.cgst_percent) setValue('cgst_percent',data?.cgst_percent)
      if(data?.sgst_percent) setValue('sgst_percent',data?.sgst_percent)
      if(data?.profit_percent) setValue('profit_percent',data?.profit_percent)
      if(data?.rate_with_gst) setValue('rate_with_gst',data?.rate_with_gst)
      if(data?.brand) setValue('brand',{label:data?.brand.name,value:data?.brand._id})
      if(data?.profit_percent && data?.rate_with_gst) {
        const rate_with_gst = parseFloat(data?.rate_with_gst)
        const sell_rate = bigDecimal.add(rate_with_gst,(rate_with_gst*(bigDecimal.divide(data?.profit_percent,100))))
        setSellRate(sell_rate)
      }
    }
  },[data])
  useEffect(()=>{
    if(!isOpen) reset({name:'',hsn_code:'',mrp:'',rate:'',cgst_percent:'',sgst_percent:'',profit_percent:'',rate_with_gst:'',brand:''})
  },[isOpen])
  return (
    <ConfiguratorRoot variant="permanent" ownerState={{ openConfigurator:isOpen }}>
      <SoftBox display="flex" justifyContent="space-between" alignItems="baseline" pt={3} pb={0.8} px={3}>
        <SoftBox>
          <SoftTypography variant="h5">{isEdit ? "Edit" : "Add"} Product</SoftTypography>
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
            <SoftTypography component="label" variant="caption" fontWeight="bold">Brand</SoftTypography>
          </SoftBox>
          <Controller name="brand" control={control}
            render={({ field }) => (
              <Select placeholder="Brand"
                styles={{
                  control: (baseStyles, state) => ({...baseStyles, borderRadius: '0.5rem', border: `0.0625rem solid ${!!errors.brand ? '#fd5c70' :'#d2d6da'}`, fontSize: '0.875rem', fontWeight: '400', color: '#495057'}),
                  option: (baseStyles, state) => ({...baseStyles, fontSize: '0.875rem', fontWeight: '400'}),
                }}
                options={brands.map((brand)=>({value: brand._id, label: brand.name}))} 
                {...field}/>
            )}
            rules={{required: {value:true, message: "Brand is required"}}}
          />
          <SoftTypography color="error" fontSize={10} mt={1}>
            <span>{errors.brand?.message}</span>
          </SoftTypography>
        </SoftBox>
        <SoftBox mb={1}>
          <SoftBox mb={1} ml={0.5}>
            <SoftTypography component="label" variant="caption" fontWeight="bold">HSN Code</SoftTypography>
          </SoftBox>
          <SoftInput type="text" placeholder="HSN Code"
            {...register("hsn_code", { required: "HSN Code is required" })} 
            error={!!errors.hsn_code}/>
          <SoftTypography color="error" fontSize={10} mt={1}>
            <span>{errors.hsn_code?.message}</span>
          </SoftTypography>
        </SoftBox>
        <SoftBox mb={1}>
          <SoftBox mb={1} ml={0.5}>
            <SoftTypography component="label" variant="caption" fontWeight="bold">MRP</SoftTypography>
          </SoftBox>
          <SoftInput type="number" placeholder="MRP" inputProps={{step: "any"}}
            {...register("mrp", { required: "MRP is required", min: {value:0, message: "Min value allowed is 0"} })} 
            error={!!errors.mrp}/>
          <SoftTypography color="error" fontSize={10} mt={1}>
            <span>{errors.mrp?.message}</span>
          </SoftTypography>
        </SoftBox>
        <SoftBox mb={1}>
          <SoftBox mb={1} ml={0.5}>
            <SoftTypography component="label" variant="caption" fontWeight="bold">Rate</SoftTypography>
          </SoftBox>
          <Controller control={control} name="rate"
            rules={{ required: "Rate is required", min: {value:0, message: "Min value allowed is 0"} }}
            render={({ field }) => (
              <SoftInput {...field} type="number" placeholder="Rate" inputProps={{step: "any"}} error={!!errors.rate}
                value={field.value || ''}
                onChange={(e)=>{
                  const value = parseFloat(e.target.value)
                  let {cgst_percent,sgst_percent,rate_with_gst} = getValues()
                  if(cgst_percent && sgst_percent && value){
                    rate_with_gst = bigDecimal.add(
                      (bigDecimal.add(value,(value*(bigDecimal.divide(cgst_percent,100))))),
                      (value*(bigDecimal.divide(sgst_percent,100)))
                    )
                    setValue('rate_with_gst',rate_with_gst)
                  }
                  field.onChange(e)
                }}/>
            )}
          />
          <SoftTypography color="error" fontSize={10} mt={1}>
            <span>{errors.rate?.message}</span>
          </SoftTypography>
        </SoftBox>
        <SoftBox mb={1}>
          <SoftBox mb={1} ml={0.5}>
            <SoftTypography component="label" variant="caption" fontWeight="bold">CGST Percent</SoftTypography>
          </SoftBox>
          <Controller control={control} name="cgst_percent"
            rules={{ required: "CGST Percent is required", min: {value:0, message: "Min value allowed is 0"}, max: {value:9, message: "Max value allowed is 9"} }}
            render={({ field }) => (
              <SoftInput {...field} type="number" placeholder="CGST Percent" inputProps={{step: "any"}} error={!!errors.cgst_percent}
                value={field.value || ''}
                onChange={(e)=>{
                  const value = parseFloat(e.target.value)
                  let {sgst_percent,rate_with_gst,rate} = getValues()
                  if(sgst_percent && rate && (value || value==0)){
                    rate_with_gst = bigDecimal.add(
                      (bigDecimal.add(parseFloat(rate),(rate*(bigDecimal.divide(value,100))))),
                      (rate*(bigDecimal.divide(sgst_percent,100)))
                    )
                    setValue('rate_with_gst',rate_with_gst)
                  }
                  field.onChange(e)
                }}/>
            )}
          />
          <SoftTypography color="error" fontSize={10} mt={1}>
            <span>{errors.cgst_percent?.message}</span>
          </SoftTypography>
        </SoftBox>
        <SoftBox mb={1}>
          <SoftBox mb={1} ml={0.5}>
            <SoftTypography component="label" variant="caption" fontWeight="bold">SGST Percent</SoftTypography>
          </SoftBox>
          <Controller control={control} name="sgst_percent"
            rules={{ required: "SGST Percent is required", min: {value:0, message: "Min value allowed is 0"}, max: {value:9, message: "Max value allowed is 9"} }}
            render={({ field }) => (
              <SoftInput {...field} type="number" placeholder="SGST Percent" inputProps={{step: "any"}} error={!!errors.sgst_percent}
                value={field.value || ''}
                onChange={(e)=>{
                  const value = parseFloat(e.target.value)
                  let {cgst_percent,rate_with_gst,rate} = getValues()
                  if(cgst_percent && rate && (value || value==0)){
                    rate_with_gst = bigDecimal.add(
                      (bigDecimal.add(parseFloat(rate), (rate*(bigDecimal.divide(cgst_percent,100))))),
                      (rate*(bigDecimal.divide(value,100)))
                    )
                    setValue('rate_with_gst',rate_with_gst)
                  }
                  field.onChange(e)
                }}/>
            )}
          />
          <SoftTypography color="error" fontSize={10} mt={1}>
            <span>{errors.sgst_percent?.message}</span>
          </SoftTypography>
        </SoftBox>
        <SoftBox mb={1}>
          <SoftBox mb={1} ml={0.5}>
            <SoftTypography component="label" variant="caption" fontWeight="bold">Rate With Gst</SoftTypography>
          </SoftBox>
          <Controller control={control} name="rate_with_gst"
            rules={{ required: "Rate With Gst is required", min: {value:0, message: "Min value allowed is 0"} }}
            render={({ field }) => (
              <SoftInput {...field} type="number" placeholder="Rate With Gst" inputProps={{step: "any"}} error={!!errors.rate_with_gst}
                value={field.value || ''}
                onChange={(e)=>{
                  const value = parseFloat(e.target.value)
                  let {cgst_percent,sgst_percent,rate} = getValues()
                  if(cgst_percent && sgst_percent && value){
                    rate = bigDecimal.divide(
                      value,
                      (bigDecimal.add(1,(bigDecimal.add(
                          (bigDecimal.divide(cgst_percent,100)),
                          (bigDecimal.divide(sgst_percent,100))
                        ))
                      ))
                    )
                    setValue('rate',rate)
                  }
                  field.onChange(e)
                }}/>
            )}
          />
          <SoftTypography color="error" fontSize={10} mt={1}>
            <span>{errors.rate_with_gst?.message}</span>
          </SoftTypography>
        </SoftBox>
        <SoftBox mb={1}>
          <SoftBox mb={1} ml={0.5}>
            <SoftTypography component="label" variant="caption" fontWeight="bold">Profit Percent</SoftTypography>
          </SoftBox>
          <Controller control={control} name="profit_percent"
            rules={{ required: "Profit Percent is required", min: {value:0, message: "Min value allowed is 0"}, max: {value:100, message: "Max value allowed is 100"} }}
            render={({ field }) => (
              <SoftInput {...field} type="number" placeholder="Profit Percent" inputProps={{step: "any"}} error={!!errors.profit_percent}
                value={field.value || ''}
                onChange={(e)=>{
                  const value = parseFloat(e.target.value)
                  let {rate_with_gst} = getValues()
                  if(rate_with_gst && value){
                    const sell_rate = bigDecimal.add(parseFloat(rate_with_gst),(rate_with_gst*(bigDecimal.divide(value,100))))
                    setSellRate(sell_rate)
                  }
                  field.onChange(e)
                }}/>
            )}
          />
          <SoftTypography color="error" fontSize={10} mt={1}>
            <span>{errors.profit_percent?.message}</span>
          </SoftTypography>
        </SoftBox>
        {
          sellRate &&
          <SoftBox mb={1}>
            <SoftBox mb={1} ml={0.5}>
              <SoftTypography component="label" variant="caption" fontWeight="bold">Sell Rate : {sellRate}</SoftTypography>
            </SoftBox>
          </SoftBox>
        }
        <SoftBox mt={2} mb={1}>
          <SoftButton variant="gradient" color="info" type="submit" fullWidth>{isEdit ? "Edit" : "Add"}</SoftButton>
        </SoftBox>
      </SoftBox>
    </ConfiguratorRoot>
  );
}

export default ProductConfigurator;
