import SoftBox from "../../../components/SoftBox";
import SoftTypography from "../../../components/SoftTypography";
import { Divider, Icon } from "@mui/material";
import { useUserController, listProducts } from "../../../context/user";
import { useEffect, useState } from "react";
import Table from "../../../examples/Tables/Table";
import SoftInput from "../../../components/SoftInput";
import SoftButton from "../../../components/SoftButton";
import Select from "react-select";
import { call_api } from "../../../util/api";
import { setLoader, useSoftUIController } from "../../../context";

function AddProducts({setProductModal,handleSubmit=()=>{}}) {
    const [userController, userDispatch] = useUserController();
    const {brands,products} = userController
    const [selectedProducts,setSelectedProducts] = useState([])
    const [productSearch,setProductSearch] = useState({name:null,brand:null})
    const [controller, dispatch] = useSoftUIController();

    const handleProductCheck = (product) => {
        setSelectedProducts((prev)=>{
            let prevCpy = [...prev]
            const isProductPresent = prev.find((prod)=>prod._id===product._id)
            if(isProductPresent) prevCpy = prevCpy.filter((prod)=>prod._id!=product._id)
            else prevCpy.push(product)
            return prevCpy
        })
    }

    const getProducts = async() => {
        setLoader(dispatch, true);
        try {
          let response = await call_api("POST","getProducts/",{},productSearch)
          if(response.data?.success){
            listProducts(userDispatch, response.data?.data);
          }
          console.log({response:response.data})
        } catch (error) {
            console.log({error})
        }finally{
          setLoader(dispatch, false);
        }
    }

    const handleAddProduct = () => {
        handleSubmit(JSON.parse(JSON.stringify(selectedProducts)))
        setSelectedProducts([])
    }

    useEffect(()=>{
        getProducts()
    },[])

    return(
        <SoftBox alignItems="center" justifyContent="center" display="flex" height="100vh">
            <SoftBox p={2} width="80vw" maxHeight="80vw" overflow="auto" bgColor="white" borderRadius="8px">
                <SoftBox display="flex" justifyContent="space-between" alignItems="baseline" pb={0.8} px={3}>
                    <SoftBox><SoftTypography variant="h5">Add Products</SoftTypography></SoftBox>
                    <Icon sx={({ typography: { size, fontWeightBold }, palette: { dark } }) => ({ fontSize: `${size.md} !important`, fontWeight: `${fontWeightBold} !important`, stroke: dark.main, strokeWidth: "2px", cursor: "pointer", mt: 2})}
                        onClick={()=>setProductModal(false)}>
                        close
                    </Icon>
                </SoftBox>
                <Divider/>
                <SoftBox pb={3} display="flex" alignItems="center" gap={1}>
                    <SoftInput placeholder="Search by name..." icon={{ component: "search", direction: "left" }}
                        onChange={(e)=>{setProductSearch((prev)=>({...prev,name:e.target.value}))}}/>
                    <Select placeholder="Brand"
                        styles={{
                            control: (baseStyles, state) => ({...baseStyles, borderRadius: '0.5rem', border: '0.0625rem solid #d2d6da', fontSize: '0.875rem', fontWeight: '400', color: '#495057', minWidth:200}),
                            option: (baseStyles, state) => ({...baseStyles, fontSize: '0.875rem', fontWeight: '400'}),
                        }}
                        options={[{value:null,label:'-- All --'},...brands.map((brand)=>({value: brand._id, label: brand.name}))]} 
                        onChange={(e)=>{setProductSearch((prev)=>({...prev,brand:e.value}))}}/>
                    <SoftButton shadow={"true"} color="dark" mt={1} variant="gradient" onClick={()=>{getProducts()}}>
                        Search
                    </SoftButton>
                </SoftBox>
                <SoftBox sx={{"& .MuiTableRow-root:not(:last-child)": {"& td": {borderBottom: ({ borders: { borderWidth, borderColor } }) => `${borderWidth[1]} solid ${borderColor}`}}}}>
                    <Table
                        columns={[
                            { name: "name", align: "center" },
                            { name: "brand", align: "center" },
                            { name: "hsn code", align: "center" },
                            { name: "mrp", align: "center" },
                            { name: "rate", align: "center" },
                            { name: "cgst percent", align: "center" },
                            { name: "sgst percent", align: "center" },
                            { name: "profit percent", align: "center" },
                            { name: "rate with gst", align: "center" },
                            { name: "add", align: "center" },
                        ]} 
                        rows={products.map((ss)=>{
                            return {
                                name: (
                                <SoftTypography variant="caption" color="secondary" fontWeight="bold">
                                    {ss.name}
                                </SoftTypography>
                                ),
                                brand: (
                                <SoftTypography variant="caption" color="secondary" fontWeight="bold">
                                    {ss.brand?.name}
                                </SoftTypography>
                                ),
                                "hsn code": (
                                <SoftTypography variant="caption" color="secondary" fontWeight="bold">
                                    {ss.hsn_code}
                                </SoftTypography>
                                ),
                                mrp: (
                                <SoftTypography variant="caption" color="secondary" fontWeight="bold">
                                    {ss.mrp}
                                </SoftTypography>
                                ),
                                rate: (
                                <SoftTypography variant="caption" color="secondary" fontWeight="bold">
                                    {ss.rate}
                                </SoftTypography>
                                ),
                                "cgst percent": (
                                <SoftTypography variant="caption" color="secondary" fontWeight="bold">
                                    {ss.cgst_percent}
                                </SoftTypography>
                                ),
                                "sgst percent": (
                                <SoftTypography variant="caption" color="secondary" fontWeight="bold">
                                    {ss.sgst_percent}
                                </SoftTypography>
                                ),
                                "profit percent": (
                                <SoftTypography variant="caption" color="secondary" fontWeight="bold">
                                    {ss.profit_percent}
                                </SoftTypography>
                                ),
                                "rate with gst": (
                                <SoftTypography variant="caption" color="secondary" fontWeight="bold">
                                    {ss.rate_with_gst}
                                </SoftTypography>
                                ),
                                add: (
                                    <SoftInput type="checkbox" placeholder="Add" 
                                        inputProps={{checked:!!selectedProducts.find((prod)=>prod._id==ss._id)}}
                                        checked={!!selectedProducts.find((prod)=>prod._id==ss._id)}
                                        onChange={()=>handleProductCheck(ss)}/>
                                ),
                            }
                        })}
                    />
                </SoftBox>
                <SoftBox mt={2}>
                    <SoftButton variant="gradient" color="dark" fullWidth onClick={handleAddProduct}>
                        <Icon>add</Icon>&nbsp;
                        Add Product
                    </SoftButton>
                </SoftBox>
            </SoftBox>
        </SoftBox>
    )
}

export default AddProducts;
