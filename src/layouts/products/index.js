import Card from "@mui/material/Card";
import SoftBox from "../../components/SoftBox";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Table from "../../examples/Tables/Table";
import SoftButton from "../../components/SoftButton";
import { useEffect, useState } from "react";
import { setLoader, useSoftUIController } from "../../context";
import { call_api } from "../../util/api";
import { useSnackbar } from 'react-simple-snackbar'
import { error, success } from "../../util/snackbar";
import { listProducts, useUserController, listBrands } from "../../context/user";
import SoftTypography from "../../components/SoftTypography";
import { Icon } from "@mui/material";
import ProductConfigurator from "./Sidebar";

function Products() {
  const [drawer,setDrawer] = useState(false)
  const [drawerData,setDrawerData] = useState({isEdit:false,data:null})
  const [controller, dispatch] = useSoftUIController();
  const [userController, userDispatch] = useUserController();
  const {products} = userController
  const [openErrorSnackbar, closeErrorSnackbar] = useSnackbar(error)
  const [openSuccessSnackbar, closeSuccessSnackbar] = useSnackbar(success)

  const onSubmit = async(data) => {
    if(data.brand){
      data.brand = data.brand?.value
    }
    setLoader(dispatch, true);
    try {
      if(!drawerData.isEdit){
        let response = await call_api("POST","product/",{},data)
        if(response.data?.success){
          openSuccessSnackbar("Products Added Successfully")
          setDrawer(false)
          await getProducts()
        }else openErrorSnackbar(response.data?.error)
      }else{
        let response = await call_api("PUT",`product/${drawerData?.data?._id}`,{},data)
        if(response.data?.success){
          openSuccessSnackbar("Products updated Successfully")
          setDrawer(false)
          await getProducts()
        }else openErrorSnackbar(response.data?.error)
      }
    } catch (error) {
      const response = error.response?.data
      if(!response?.success) openErrorSnackbar(response?.error)
      else openErrorSnackbar("Something went wrong, Please try after sometime.")
    }finally{
      setLoader(dispatch, false);
    }
  }

  const getProducts = async() => {
    setLoader(dispatch, true);
    try {
      let response = await call_api("POST","getProducts/",{},{})
      if(response.data?.success){
        listProducts(userDispatch, response.data?.data);
      }else openErrorSnackbar(response.data?.error)
    } catch (error) {
      const response = error.response?.data
      if(!response?.success) openErrorSnackbar(response?.error)
      else openErrorSnackbar("Something went wrong, Please try after sometime.")
    }finally{
      setLoader(dispatch, false);
    }
  }

  const getBrands = async() => {
    setLoader(dispatch, true);
    try {
      let response = await call_api("GET","brand/",{},{})
      if(response.data?.success){
        listBrands(userDispatch, response.data?.data);
      }else openErrorSnackbar(response.data?.error)
    } catch (error) {
      const response = error.response?.data
      if(!response?.success) openErrorSnackbar(response?.error)
      else openErrorSnackbar("Something went wrong, Please try after sometime.")
    }finally{
      setLoader(dispatch, false);
    }
  }

  const handleEditClick = (product) => {
    setDrawerData({isEdit:true,data:product})
    setDrawer(true)
  }

  useEffect(()=>{
    (async()=>{
      await getProducts()
      await getBrands()
    })()
  },[])

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftButton shadow={"true"} color="info" mt={1} variant="gradient" onClick={()=>{setDrawerData({isEdit:false,data:null});setDrawer(true)}}>
        Add Products
      </SoftButton>
      <SoftBox py={3}>
      
      </SoftBox>
      <SoftBox py={3}>
        <SoftBox mb={3}>
          <Card>
            <SoftBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
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
                  { name: "edit", align: "center" },
                  // { name: "delete", align: "center" },
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
                    edit: (
                      <SoftButton variant="outlined" color="info" fontWeight="medium" size="small" onClick={()=>handleEditClick(ss)}>
                        <Icon>edit</Icon>&nbsp;Edit
                      </SoftButton>
                    ),
                    // delete: (
                    //   <SoftButton variant="outlined" color="error" fontWeight="medium" size="small">
                    //     <Icon>delete</Icon>&nbsp;Delete
                    //   </SoftButton>
                    // ),
                  }
                })} 
              />
            </SoftBox>
          </Card>
        </SoftBox>
      </SoftBox>
      <ProductConfigurator isOpen={drawer} handleClose={()=>setDrawer(false)} onSubmit={onSubmit} drawerData={drawerData}/>
    </DashboardLayout>
  );
}

export default Products;
