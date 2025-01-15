import { Box, Divider, Icon, Modal } from "@mui/material";
import SoftBox from "../../../components/SoftBox";
import SoftTypography from "../../../components/SoftTypography";
import ConfiguratorRoot from "./ConfiguratorRoot";
import SoftInput from "../../../components/SoftInput";
import { useForm, Controller } from "react-hook-form"
import SoftButton from "../../../components/SoftButton";
import { useEffect, useState } from "react";
import { useUserController } from "../../../context/user";
import Select from 'react-select'
import AddProducts from "./AddProducts";

function PurchaseConfigurator({isOpen,handleClose,onSubmit, drawerData:{isEdit,data}}) {
  const {register, handleSubmit, watch, formState: { errors }, setValue, reset, control, } = useForm()
  const [userController, userDispatch] = useUserController();
  const {brands,super_stockers,products} = userController
  const [productModal,setProductModal] = useState(false)
  const [selectedProducts,setselectedProducts] = useState([])

  useEffect(()=>{
    if(isEdit && data){
      if(data?.purchase_date) setValue('purchase_date',data?.purchase_date)
      if(data?.super_stocker) setValue('super_stocker',{label:data?.super_stocker.name,value:data?.super_stocker._id})
    }
  },[data])

  useEffect(()=>{
    if(!isOpen) reset({super_stocker:'',purchase_date:'',products: {}})
  },[isOpen])

  useEffect(() => {
    const { unsubscribe } = watch((value) => {
      console.log(value)
    })
    return () => unsubscribe()
  }, [watch])

  useEffect(()=>{
    selectedProducts.forEach((product)=>{
      if(product.mrp) setValue(`products.${product._id}.mrp`,product?.mrp)
      if(product.rate) setValue(`products.${product._id}.rate`,product?.rate)
      if(product.cgst_percent) setValue(`products.${product._id}.cgst_percent`,product?.cgst_percent)
      if(product.sgst_percent) setValue(`products.${product._id}.sgst_percent`,product?.sgst_percent)
      setValue(`products.${product._id}.units`,"1")
      if(product.rate_with_gst) setValue(`products.${product._id}.rate_with_gst`,product?.rate_with_gst)
    })
  },[selectedProducts])

  const handleProductModalSubmit = (products) => {
    setselectedProducts(products)
    setProductModal(false)
  }

  const handleCreate = (data) => {
    if(data.products){
      const updatedProducts = selectedProducts.map((product)=>{
        const productData = data.products?.[product._id]
        return {
          ...product,
          mrp: productData.mrp,
          rate: productData.rate,
          cgst_percent: productData.cgst_percent,
          sgst_percent: productData.sgst_percent,
          units: productData.units,
          rate_with_gst: productData.rate_with_gst,
          product: product._id
        }
      })
      data.products = updatedProducts
    }
    if(data.super_stocker){
      data.super_stocker = data.super_stocker?.value
    }
    onSubmit(data)
  }

  return (
    <ConfiguratorRoot variant="permanent" ownerState={{ openConfigurator:isOpen }}>
      <SoftBox display="flex" justifyContent="space-between" alignItems="baseline" pt={3} pb={0.8} px={3}>
        <SoftBox>
          <SoftTypography variant="h5">{isEdit ? "Edit" : "Add"} Purchase</SoftTypography>
        </SoftBox>
        <Icon
          sx={({ typography: { size, fontWeightBold }, palette: { dark } }) => ({ fontSize: `${size.md} !important`, fontWeight: `${fontWeightBold} !important`, stroke: dark.main, strokeWidth: "2px", cursor: "pointer", mt: 2})}
          onClick={handleClose}>
          close
        </Icon>
      </SoftBox>
      <Divider/>
      <SoftBox component="form" role="form" onSubmit={handleSubmit(handleCreate)}>
        <SoftBox mb={1}>
          <SoftBox mb={1}>
            <SoftBox mb={1} ml={0.5}>
              <SoftTypography component="label" variant="caption" fontWeight="bold">Purchase Date</SoftTypography>
            </SoftBox>
            <SoftInput type="date" placeholder="Purchase Date"
              {...register("purchase_date", { required: "Purchase Date is required" })} 
              error={!!errors.purchase_date}/>
            <SoftTypography color="error" fontSize={10} mt={1}>
              <span>{errors.purchase_date?.message}</span>
            </SoftTypography>
          </SoftBox>
          <SoftBox mb={1}>
            <SoftBox mb={1} ml={0.5}>
              <SoftTypography component="label" variant="caption" fontWeight="bold">Super Stockers</SoftTypography>
            </SoftBox>
            <Controller name="super_stocker" control={control}
              render={({ field }) => (
                <Select placeholder="Super Stocker"
                  styles={{
                    control: (baseStyles, state) => ({...baseStyles, borderRadius: '0.5rem', border: `0.0625rem solid ${!!errors.super_stocker ? '#fd5c70' :'#d2d6da'}`, fontSize: '0.875rem', fontWeight: '400', color: '#495057'}),
                    option: (baseStyles, state) => ({...baseStyles, fontSize: '0.875rem', fontWeight: '400'}),
                  }}
                  options={super_stockers.map((super_stocker)=>({value: super_stocker._id, label: super_stocker.name}))} 
                  {...field}/>
              )}
              rules={{required: {value:true, message: "Super Stocker is required"}}}
            />
            <SoftTypography color="error" fontSize={10} mt={1}>
              <span>{errors.super_stocker?.message}</span>
            </SoftTypography>
          </SoftBox>
          {
            selectedProducts.map((selectedProduct)=>(
              <SoftBox mb={1} mt={1} display="flex" justifyContent="space-between" key={selectedProduct._id}>
                <SoftBox mb={1} width={70}>
                  <SoftBox mb={1} ml={0.5}>
                    <SoftTypography component="label" variant="caption" fontWeight="bold">Name</SoftTypography>
                  </SoftBox>
                  <SoftTypography component="label" variant="caption" fontWeight="bold">{selectedProduct.name}</SoftTypography>
                </SoftBox>
                <SoftBox mb={1}>
                  <SoftBox mb={1} ml={0.5}>
                    <SoftTypography component="label" variant="caption" fontWeight="bold">MRP</SoftTypography>
                  </SoftBox>
                  <SoftInput type="number" placeholder="MRP" inputProps={{step: "any"}}
                    {...register(`products.${selectedProduct._id}.mrp`, { required: "MRP is required", min: {value:0, message: "Min value allowed is 0"} })} 
                    error={!!errors?.products?.[selectedProduct._id]?.mrp}/>
                  <SoftTypography color="error" fontSize={10} mt={1}>
                    <span>{errors?.products?.[selectedProduct._id]?.mrp?.message}</span>
                  </SoftTypography>
                </SoftBox>
                <SoftBox mb={1}>
                  <SoftBox mb={1} ml={0.5}>
                    <SoftTypography component="label" variant="caption" fontWeight="bold">Rate</SoftTypography>
                  </SoftBox>
                  <SoftInput type="number" placeholder="Rate" inputProps={{step: "any"}}
                    {...register(`products.${selectedProduct._id}.rate`, { required: "Rate is required", min: {value:0, message: "Min value allowed is 0"} })} 
                    error={!!errors?.products?.[selectedProduct._id]?.rate}/>
                  <SoftTypography color="error" fontSize={10} mt={1}>
                    <span>{errors?.products?.[selectedProduct._id]?.rate?.message}</span>
                  </SoftTypography>
                </SoftBox>
                <SoftBox mb={1}>
                  <SoftBox mb={1} ml={0.5}>
                    <SoftTypography component="label" variant="caption" fontWeight="bold">CGST Percent</SoftTypography>
                  </SoftBox>
                  <SoftInput type="number" placeholder="CGST Percent" inputProps={{step: "any"}}
                    {...register(`products.${selectedProduct._id}.cgst_percent`, { required: "CGST Percent is required", min: {value:0, message: "Min value allowed is 0"},max: {value:100, message: "Max value allowed is 100"} })} 
                    error={!!errors?.products?.[selectedProduct._id]?.cgst_percent}/>
                  <SoftTypography color="error" fontSize={10} mt={1}>
                    <span>{errors?.products?.[selectedProduct._id]?.cgst_percent?.message}</span>
                  </SoftTypography>
                </SoftBox>
                <SoftBox mb={1}>
                  <SoftBox mb={1} ml={0.5}>
                    <SoftTypography component="label" variant="caption" fontWeight="bold">SGST Percent</SoftTypography>
                  </SoftBox>
                  <SoftInput type="number" placeholder="SGST Percent" inputProps={{step: "any"}}
                    {...register(`products.${selectedProduct._id}.sgst_percent`, { required: "SGST Percent is required", min: {value:0, message: "Min value allowed is 0"},max: {value:100, message: "Max value allowed is 100"} })} 
                    error={!!errors?.products?.[selectedProduct._id]?.sgst_percent}/>
                  <SoftTypography color="error" fontSize={10} mt={1}>
                    <span>{errors?.products?.[selectedProduct._id]?.sgst_percent?.message}</span>
                  </SoftTypography>
                </SoftBox>
                <SoftBox mb={1}>
                  <SoftBox mb={1} ml={0.5}>
                    <SoftTypography component="label" variant="caption" fontWeight="bold">Units</SoftTypography>
                  </SoftBox>
                  <SoftInput type="number" placeholder="Units" inputProps={{step: "any"}}
                    {...register(`products.${selectedProduct._id}.units`, { required: "Units is required", min: {value:0, message: "Min value allowed is 0"} })} 
                    error={!!errors?.products?.[selectedProduct._id]?.units}/>
                  <SoftTypography color="error" fontSize={10} mt={1}>
                    <span>{errors?.products?.[selectedProduct._id]?.units?.message}</span>
                  </SoftTypography>
                </SoftBox>
                <SoftBox mb={1}>
                  <SoftBox mb={1} ml={0.5}>
                    <SoftTypography component="label" variant="caption" fontWeight="bold">Rate With Gst</SoftTypography>
                  </SoftBox>
                  <SoftInput type="number" placeholder="Rate With Gst" inputProps={{step: "any"}}
                    {...register(`products.${selectedProduct._id}.rate_with_gst`, { required: "Rate With Gst is required", min: {value:0, message: "Min value allowed is 0"} })} 
                    error={!!errors?.products?.[selectedProduct._id]?.rate_with_gst}/>
                  <SoftTypography color="error" fontSize={10} mt={1}>
                    <span>{errors?.products?.[selectedProduct._id]?.rate_with_gst?.message}</span>
                  </SoftTypography>
                </SoftBox>
              </SoftBox>
            ))
          }
          <SoftBox mb={1} mt={2}>
            <Modal open={productModal} onClose={()=>setProductModal(false)}>
              <SoftBox>
                <AddProducts setProductModal={setProductModal} handleSubmit={handleProductModalSubmit}/>
              </SoftBox>
            </Modal>
            <SoftButton variant="gradient" color="dark" fullWidth onClick={()=>setProductModal(true)}>
              <Icon>add</Icon>&nbsp;
              Add Product
            </SoftButton>
          </SoftBox>
        </SoftBox>
        <SoftBox mt={2} mb={1}>
          <SoftButton variant="gradient" color="info" type="submit" fullWidth>{isEdit ? "Edit" : "Add"} Purchase</SoftButton>
        </SoftBox>
      </SoftBox>
    </ConfiguratorRoot>
  );
}

export default PurchaseConfigurator;
