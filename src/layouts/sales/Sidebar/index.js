import { Box, Divider, Icon, Modal } from "@mui/material";
import SoftBox from "../../../components/SoftBox";
import SoftTypography from "../../../components/SoftTypography";
import ConfiguratorRoot from "../../purchase/Sidebar/ConfiguratorRoot";
import SoftInput from "../../../components/SoftInput";
import { useForm, Controller } from "react-hook-form"
import SoftButton from "../../../components/SoftButton";
import { useEffect, useState } from "react";
import { useUserController } from "../../../context/user";
import Select from 'react-select'
import AddProducts from "./AddProducts";
import moment from "moment";
import bigDecimal from 'js-big-decimal';
import { useSnackbar } from "react-simple-snackbar";
import { error } from "../../../util/snackbar";

function SalesConfigurator({isOpen,handleClose,onSubmit, drawerData:{isEdit,data}}) {
  const {register, handleSubmit, watch, formState: { errors }, setValue, reset, control, getValues} = useForm()
  const [userController, userDispatch] = useUserController();
  const {brands,shops,products,salesman} = userController
  const [productModal,setProductModal] = useState(false)
  const [selectedProducts,setselectedProducts] = useState([])
  const [totalRate,setTotalRate] = useState({})
  const [total,setTotal] = useState(null)
  const [discount,setDiscount] = useState(null)
  const [openErrorSnackbar, closeErrorSnackbar] = useSnackbar(error)

  useEffect(()=>{
    if(isEdit && data){
      if(data?.sales_date) setValue('sales_date',data?.sales_date)
      if(data?.shop) setValue('shop',{label:data?.shop.name,value:data?.shop._id})
      if(data?.salesman) setValue('salesman',{label:data?.salesman.name,value:data?.salesman._id})
    }
  },[data])

  useEffect(()=>{
    if(!isOpen) {
      reset({shop:'',sales_date:'',products: {},salesman:'',total_discount:'',total_sell_rate:'',net_total_sell_rate:''})
      setselectedProducts([])
      setTotal(null)
      setDiscount(null)
      setTotalRate({})
    }
  },[isOpen])

  useEffect(() => {
    const { unsubscribe } = watch((value) => {
      console.log(value)
      if(value.total_discount) setDiscount(value.total_discount)
    })
    return () => unsubscribe()
  }, [watch])
  
  useEffect(()=>{
    let total = 0
    selectedProducts.forEach((selectedProduct)=>{
      total = bigDecimal.add(total,parseFloat(totalRate[selectedProduct._id])) 
    })
    if(!!total) total = parseFloat(total).toFixed(4)
    setTotal(total)
  },[totalRate])  

  const apply_profit = (rate,profit_percent) => {
    return rate*(1+profit_percent/100)
  }

  useEffect(()=>{
    selectedProducts.forEach((product)=>{
      if(product.mrp) setValue(`products.${product._id}.sell_mrp`,product?.mrp)
      if(product.rate) setValue(`products.${product._id}.sell_rate`,apply_profit(product?.rate,product?.profit_percent))
      if(product.profit_percent) setValue(`products.${product._id}.profit_percent`,product?.profit_percent)
      if(product.cgst_percent) setValue(`products.${product._id}.sell_cgst_percent`,product?.cgst_percent)
      if(product.sgst_percent) setValue(`products.${product._id}.sell_sgst_percent`,product?.sgst_percent)
      setValue(`products.${product._id}.sell_units`,"1")
      setValue(`products.${product._id}.sell_free_units`,"0")
      if(product.rate_with_gst) setValue(`products.${product._id}.sell_rate_with_gst`,apply_profit(product?.rate_with_gst,product?.profit_percent))
      setTotalRate((prev)=>{ return {...prev,[product._id]:apply_profit(product?.rate_with_gst,product?.profit_percent)} })
    })
  },[selectedProducts])

  const handleProductModalSubmit = (products) => {
    setselectedProducts(products)
    setProductModal(false)
  }

  const handleCreate = (data) => {
    try {
      let is_stock_error = "";
      if(data.products){
        if(selectedProducts.length == 0) throw {is_error:true, message:"Atleast one product should be selected"}
        const updatedProducts = selectedProducts.map((product)=>{
          const productData = data.products?.[product._id]
          if(
            ((parseInt(productData.sell_units) || 0) + (parseInt(productData.sell_free_units) || 0)) > parseInt(product.stock)
          ) is_stock_error+=`Units is more than the available stock for ${product?.name}. `
          return {
            ...product,
            sell_mrp: productData.sell_mrp,
            profit_percent: productData.profit_percent,
            sell_rate: productData.sell_rate,
            sell_cgst_percent: productData.sell_cgst_percent,
            sell_sgst_percent: productData.sell_sgst_percent,
            sell_units: productData.sell_units,
            sell_free_units: productData.sell_free_units,
            sell_rate_with_gst: productData.sell_rate_with_gst,
            total_sell_rate: totalRate?.[product._id],
            product: product._id
          }
        })
        data.products = updatedProducts
      }
      if(!!is_stock_error) throw {is_error:true, message:is_stock_error}
      if(data.shop){
        data.shop = data.shop?.value
      }
      if(data.salesman){
        data.salesman = data.salesman?.value
      }
      if(total) data.total_sell_rate = total
      if(total) data.net_total_sell_rate = bigDecimal.subtract(total,(discount || 0))
      onSubmit(data)
    } catch (error) {
      if(error.is_error) openErrorSnackbar(error.message)
      else console.log({error})
    }

  }

  return (
    <ConfiguratorRoot variant="permanent" ownerState={{ openConfigurator:isOpen }}>
      <SoftBox display="flex" justifyContent="space-between" alignItems="baseline" pt={3} pb={0.8} px={3}>
        <SoftBox>
          <SoftTypography variant="h5">{isEdit ? "Edit" : "Add"} Sale</SoftTypography>
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
              <SoftTypography component="label" variant="caption" fontWeight="bold">Sale Date</SoftTypography>
            </SoftBox>
            <SoftInput type="date" placeholder="Sale Date" inputProps={{min:moment().subtract(5,"days").format("YYYY-MM-DD"),max:moment().add(1,"days").format("YYYY-MM-DD")}}
              {...register("sales_date", { required: "Sale Date is required" })} 
              error={!!errors.sales_date}/>
            <SoftTypography color="error" fontSize={10} mt={1}>
              <span>{errors.sales_date?.message}</span>
            </SoftTypography>
          </SoftBox>
          <SoftBox mb={1}>
            <SoftBox mb={1} ml={0.5}>
              <SoftTypography component="label" variant="caption" fontWeight="bold">Shop</SoftTypography>
            </SoftBox>
            <Controller name="shop" control={control}
              render={({ field }) => (
                <Select placeholder="Shop"
                  styles={{
                    control: (baseStyles, state) => ({...baseStyles, borderRadius: '0.5rem', border: `0.0625rem solid ${!!errors.shop ? '#fd5c70' :'#d2d6da'}`, fontSize: '0.875rem', fontWeight: '400', color: '#495057'}),
                    option: (baseStyles, state) => ({...baseStyles, fontSize: '0.875rem', fontWeight: '400'}),
                  }}
                  options={shops.map((shop)=>({value: shop._id, label: shop.name}))} 
                  {...field}/>
              )}
              rules={{required: {value:true, message: "Shop is required"}}}
            />
            <SoftTypography color="error" fontSize={10} mt={1}>
              <span>{errors.shop?.message}</span>
            </SoftTypography>
          </SoftBox>
          <SoftBox mb={1}>
            <SoftBox mb={1} ml={0.5}>
              <SoftTypography component="label" variant="caption" fontWeight="bold">Salesman</SoftTypography>
            </SoftBox>
            <Controller name="salesman" control={control}
              render={({ field }) => (
                <Select placeholder="Salesman"
                  styles={{
                    control: (baseStyles, state) => ({...baseStyles, borderRadius: '0.5rem', border: `0.0625rem solid ${!!errors.salesman ? '#fd5c70' :'#d2d6da'}`, fontSize: '0.875rem', fontWeight: '400', color: '#495057'}),
                    option: (baseStyles, state) => ({...baseStyles, fontSize: '0.875rem', fontWeight: '400'}),
                  }}
                  options={salesman.map((sm)=>({value: sm._id, label: sm.name}))} 
                  {...field}/>
              )}
              rules={{required: {value:true, message: "Salesman is required"}}}
            />
            <SoftTypography color="error" fontSize={10} mt={1}>
              <span>{errors.salesman?.message}</span>
            </SoftTypography>
          </SoftBox>
          {
            selectedProducts.map((selectedProduct)=>(
              <SoftBox mb={1} mt={1} display="flex" justifyContent="space-between" key={selectedProduct._id} gap={1}>
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
                    {...register(`products.${selectedProduct._id}.sell_mrp`, { required: "MRP is required", min: {value:0, message: "Min value allowed is 0"} })} 
                    error={!!errors?.products?.[selectedProduct._id]?.sell_mrp}/>
                  <SoftTypography color="error" fontSize={10} mt={1}>
                    <span>{errors?.products?.[selectedProduct._id]?.sell_mrp?.message}</span>
                  </SoftTypography>
                </SoftBox>
                <SoftBox mb={1}>
                  <SoftBox mb={1} ml={0.5}>
                    <SoftTypography component="label" variant="caption" fontWeight="bold">Profit Percent</SoftTypography>
                  </SoftBox>
                  <Controller control={control} name={`products.${selectedProduct._id}.profit_percent`}
                    rules={{ required: "Profit Percent is required", min: {value:0, message: "Min value allowed is 0"},max: {value:100, message: "Max value allowed is 100"} }}
                    render={({ field }) => (
                      <SoftInput {...field} type="number" placeholder="Profit Percent" inputProps={{step: "any"}} error={!!errors?.products?.[selectedProduct._id]?.profit_percent}
                        value={field.value || ''}
                        onChange={(e)=>{
                          const value = parseFloat(e.target.value)
                          const rate = parseFloat(selectedProduct.rate)
                          const product_rate_with_gst = parseFloat(selectedProduct.rate_with_gst)
                          let {products} = getValues()
                          const units = products[selectedProduct._id]?.sell_units
                          if(rate && product_rate_with_gst && value){
                            setValue(`products.${selectedProduct._id}.sell_rate`,apply_profit(rate,value))
                            const product_rate_with_gst_with_profit = apply_profit(product_rate_with_gst,value)
                            setValue(`products.${selectedProduct._id}.sell_rate_with_gst`,product_rate_with_gst_with_profit)
                            if(units){
                              setTotalRate((prev)=>{ return {...prev,[selectedProduct._id]:(units*product_rate_with_gst_with_profit)} })
                            }
                          }
                          field.onChange(e)
                        }}/>
                    )}
                  />
                  <SoftTypography color="error" fontSize={10} mt={1}>
                    <span>{errors?.products?.[selectedProduct._id]?.sell_cgst_percent?.message}</span>
                  </SoftTypography>
                </SoftBox>
                <SoftBox mb={1}>
                  <SoftBox mb={1} ml={0.5}>
                    <SoftTypography component="label" variant="caption" fontWeight="bold">Rate</SoftTypography>
                  </SoftBox>
                  <Controller control={control} name={`products.${selectedProduct._id}.sell_rate`}
                    rules={{ required: "Rate is required", min: {value:0, message: "Min value allowed is 0"} }}
                    render={({ field }) => (
                      <SoftInput {...field} type="number" placeholder="Rate" inputProps={{step: "any"}} error={!!errors?.products?.[selectedProduct._id]?.sell_rate}
                        value={field.value || ''}
                        onChange={(e)=>{
                          const value = parseFloat(e.target.value)
                          let {products} = getValues()
                          const sgst_percent = products[selectedProduct._id]?.sell_sgst_percent
                          const cgst_percent = products[selectedProduct._id]?.sell_cgst_percent
                          const product_rate = selectedProduct.rate
                          const units = products[selectedProduct._id]?.sell_units
                          if(cgst_percent && sgst_percent && value){
                            const sell_rate_with_gst = bigDecimal.add(
                              (bigDecimal.add(value,(value*(bigDecimal.divide(cgst_percent,100))))),
                              (value*(bigDecimal.divide(sgst_percent,100)))
                            )
                            setValue(`products.${selectedProduct._id}.sell_rate_with_gst`,sell_rate_with_gst)
                            if(units){
                              setTotalRate((prev)=>{ return {...prev,[selectedProduct._id]:(units*sell_rate_with_gst)} })
                            }
                          }
                          if(product_rate && value){
                            setValue(`products.${selectedProduct._id}.profit_percent`,bigDecimal.divide((value-product_rate),(bigDecimal.divide(product_rate,100))))
                          }
                          field.onChange(e)
                        }}/>
                    )}
                  />
                  <SoftTypography color="error" fontSize={10} mt={1}>
                    <span>{errors?.products?.[selectedProduct._id]?.sell_rate?.message}</span>
                  </SoftTypography>
                </SoftBox>
                <SoftBox mb={1}>
                  <SoftBox mb={1} ml={0.5}>
                    <SoftTypography component="label" variant="caption" fontWeight="bold">CGST Percent</SoftTypography>
                  </SoftBox>
                  <Controller control={control} name={`products.${selectedProduct._id}.sell_cgst_percent`}
                    rules={{ required: "CGST Percent is required", min: {value:0, message: "Min value allowed is 0"},max: {value:100, message: "Max value allowed is 100"} }}
                    render={({ field }) => (
                      <SoftInput {...field} type="number" placeholder="CGST Percent" inputProps={{step: "any"}} error={!!errors?.products?.[selectedProduct._id]?.sell_cgst_percent}
                        value={field.value || ''}
                        onChange={(e)=>{
                          const value = parseFloat(e.target.value)
                          let {products} = getValues()
                          const sgst_percent = products[selectedProduct._id]?.sell_sgst_percent
                          const rate = products[selectedProduct._id]?.sell_rate
                          const units = products[selectedProduct._id]?.sell_units
                          if(sgst_percent && rate && value){
                            const sell_rate_with_gst = bigDecimal.add(
                              (bigDecimal.add(parseFloat(rate),(rate*(bigDecimal.divide(value,100))))),
                              (rate*(bigDecimal.divide(sgst_percent,100)))
                            )
                            setValue(`products.${selectedProduct._id}.sell_rate_with_gst`,sell_rate_with_gst)
                            if(units){
                              setTotalRate((prev)=>{ return {...prev,[selectedProduct._id]:(units*sell_rate_with_gst)} })
                            }
                          }
                          field.onChange(e)
                        }}/>
                    )}
                  />
                  <SoftTypography color="error" fontSize={10} mt={1}>
                    <span>{errors?.products?.[selectedProduct._id]?.sell_cgst_percent?.message}</span>
                  </SoftTypography>
                </SoftBox>
                <SoftBox mb={1}>
                  <SoftBox mb={1} ml={0.5}>
                    <SoftTypography component="label" variant="caption" fontWeight="bold">SGST Percent</SoftTypography>
                  </SoftBox>
                  <Controller control={control} name={`products.${selectedProduct._id}.sell_sgst_percent`}
                    rules={{ required: "SGST Percent is required", min: {value:0, message: "Min value allowed is 0"},max: {value:100, message: "Max value allowed is 100"} }}
                    render={({ field }) => (
                      <SoftInput {...field} type="number" placeholder="SGST Percent" inputProps={{step: "any"}} error={!!errors?.products?.[selectedProduct._id]?.sell_sgst_percent}
                        value={field.value || ''}
                        onChange={(e)=>{
                          const value = parseFloat(e.target.value)
                          let {products} = getValues()
                          const cgst_percent = products[selectedProduct._id]?.sell_cgst_percent
                          const rate = products[selectedProduct._id]?.sell_rate
                          const units = products[selectedProduct._id]?.sell_units
                          if(cgst_percent && rate && value){
                            const sell_rate_with_gst = bigDecimal.add(
                              (bigDecimal.add(parseFloat(rate), (rate*(bigDecimal.divide(cgst_percent,100))))),
                              (rate*(bigDecimal.divide(value,100)))
                            )
                            setValue(`products.${selectedProduct._id}.sell_rate_with_gst`,sell_rate_with_gst)
                            if(units){
                              setTotalRate((prev)=>{ return {...prev,[selectedProduct._id]:(units*sell_rate_with_gst)} })
                            }
                          }
                          field.onChange(e)
                        }}/>
                    )}
                  />
                  <SoftTypography color="error" fontSize={10} mt={1}>
                    <span>{errors?.products?.[selectedProduct._id]?.sell_sgst_percent?.message}</span>
                  </SoftTypography>
                </SoftBox>
                <SoftBox mb={1}>
                  <SoftBox mb={1} ml={0.5}>
                    <SoftTypography component="label" variant="caption" fontWeight="bold">Rate With Gst</SoftTypography>
                  </SoftBox>
                  <Controller control={control} name={`products.${selectedProduct._id}.sell_rate_with_gst`}
                    rules={{ required: "Rate With Gst is required", min: {value:0, message: "Min value allowed is 0"} }}
                    render={({ field }) => (
                      <SoftInput {...field} type="number" placeholder="Rate With Gst" inputProps={{step: "any"}} error={!!errors?.products?.[selectedProduct._id]?.sell_rate_with_gst}
                        value={field.value || ''}
                        onChange={(e)=>{
                          const value = parseFloat(e.target.value)
                          let {products} = getValues()
                          const cgst_percent = products[selectedProduct._id]?.sell_cgst_percent
                          const sgst_percent = products[selectedProduct._id]?.sell_sgst_percent
                          const units = products[selectedProduct._id]?.sell_units
                          const product_rate = selectedProduct.rate
                          if(cgst_percent && sgst_percent && value){
                            const sell_rate = bigDecimal.divide(
                              value,
                              (bigDecimal.add(1,(bigDecimal.add(
                                  (bigDecimal.divide(cgst_percent,100)),
                                  (bigDecimal.divide(sgst_percent,100))
                                ))
                              ))
                            )
                            setValue(`products.${selectedProduct._id}.sell_rate`,sell_rate)
                            if(product_rate && sell_rate){
                              setValue(`products.${selectedProduct._id}.profit_percent`,bigDecimal.divide((sell_rate-product_rate),(bigDecimal.divide(product_rate,100))))
                            }
                          }
                          if(units && value){
                            setTotalRate((prev)=>{ return {...prev,[selectedProduct._id]:(units*value)} })
                          }
                          field.onChange(e)
                        }}/>
                    )}
                  />
                  <SoftTypography color="error" fontSize={10} mt={1}>
                    <span>{errors?.products?.[selectedProduct._id]?.sell_rate_with_gst?.message}</span>
                  </SoftTypography>
                </SoftBox>
                <SoftBox mb={1}>
                  <SoftBox mb={1} ml={0.5}>
                    <SoftTypography component="label" variant="caption" fontWeight="bold">Units</SoftTypography>
                  </SoftBox>
                  <Controller control={control} name={`products.${selectedProduct._id}.sell_units`}
                    rules={{ required: "Units is required", min: {value:0, message: "Min value allowed is 0"} }}
                    render={({ field }) => (
                      <SoftInput {...field} type="number" placeholder="Units" inputProps={{step: "any"}} error={!!errors?.products?.[selectedProduct._id]?.sell_units}
                        value={field.value || ''}
                        onChange={(e)=>{
                          const value = parseFloat(e.target.value)
                          let {products} = getValues()
                          const sell_rate_with_gst = products[selectedProduct._id]?.sell_rate_with_gst
                          if(sell_rate_with_gst && value){
                            setTotalRate((prev)=>{ return {...prev,[selectedProduct._id]:(sell_rate_with_gst*value)} })
                          }
                          field.onChange(e)
                        }}/>
                    )}
                  />
                  <SoftTypography color="error" fontSize={10} mt={1}>
                    <span>{errors?.products?.[selectedProduct._id]?.sell_units?.message}</span>
                  </SoftTypography>
                </SoftBox>
                <SoftBox mb={1}>
                  <SoftBox mb={1} ml={0.5}>
                    <SoftTypography component="label" variant="caption" fontWeight="bold">Free Units</SoftTypography>
                  </SoftBox>
                  <Controller control={control} name={`products.${selectedProduct._id}.sell_free_units`}
                    rules={{ min: {value:0, message: "Min value allowed is 0"} }}
                    render={({ field }) => (
                      <SoftInput {...field} type="number" placeholder="Units" inputProps={{step: "any"}} error={!!errors?.products?.[selectedProduct._id]?.sell_free_units}
                        value={field.value || ''} onChange={(e)=>{field.onChange(e)}}/>
                    )}/>
                  <SoftTypography color="error" fontSize={10} mt={1}>
                    <span>{errors?.products?.[selectedProduct._id]?.sell_free_units?.message}</span>
                  </SoftTypography>
                </SoftBox>
                <SoftBox mb={1} display="flex" flexDirection="column">
                  <SoftBox mb={1} ml={0.5}>
                    <SoftTypography component="label" variant="caption" fontWeight="bold">Total Rate</SoftTypography>
                  </SoftBox>
                  <SoftBox mb={1} flex={1} ml={0.5} display="flex" alignItems="center" width={80}>
                    <SoftTypography component="p" variant="caption" align="center">
                      {parseFloat(totalRate?.[selectedProduct._id]).toFixed(4) || ''}
                    </SoftTypography>
                  </SoftBox>
                </SoftBox>
              </SoftBox>
            ))
          }
          {
            !!total && (
              <>
                <SoftBox mb={1} mt={2} ml="auto" width={110}>
                  <SoftBox mb={1} ml={0.5}>
                    <SoftTypography component="label" variant="caption" fontWeight="bold">Total</SoftTypography>
                  </SoftBox>
                  <SoftBox mb={1} flex={1} ml={0.5} display="flex" alignItems="center">
                    <SoftTypography component="p" variant="caption" align="center">
                      {total}
                    </SoftTypography>
                  </SoftBox>
                </SoftBox>
                <SoftBox mb={1} ml="auto" width={110}>
                  <SoftBox mb={1} ml={0.5}>
                    <SoftTypography component="label" variant="caption" fontWeight="bold">Discount</SoftTypography>
                  </SoftBox>
                  <SoftInput type="number" placeholder="Discount" inputProps={{step: "any"}}
                    {...register(`total_discount`, { min: {value:0, message: "Min value allowed is 0"} })} 
                    error={!!errors?.total_discount}/>
                  <SoftTypography color="error" fontSize={10} mt={1}>
                    <span>{errors?.total_discount?.message}</span>
                  </SoftTypography>
                </SoftBox>
                <SoftBox mb={1} mt={2} ml="auto" width={110}>
                  <SoftBox mb={1} ml={0.5}>
                    <SoftTypography component="label" variant="caption" fontWeight="bold">Grand Total</SoftTypography>
                  </SoftBox>
                  <SoftBox mb={1} flex={1} ml={0.5} display="flex" alignItems="center">
                    <SoftTypography component="p" variant="caption" align="center">
                      {bigDecimal.subtract(total,(discount || 0))}
                    </SoftTypography>
                  </SoftBox>
                </SoftBox>
              </>
            )
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
          <SoftButton variant="gradient" color="info" type="submit" fullWidth>{isEdit ? "Edit" : "Add"} Sale</SoftButton>
        </SoftBox>
      </SoftBox>
    </ConfiguratorRoot>
  );
}

export default SalesConfigurator;
