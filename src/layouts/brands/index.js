import Card from "@mui/material/Card";
import SoftBox from "../../components/SoftBox";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Table from "../../examples/Tables/Table";
import SoftButton from "../../components/SoftButton";
import BrandConfigurator from "./Sidebar";
import { useEffect, useState } from "react";
import { setLoader, useSoftUIController } from "../../context";
import { call_api } from "../../util/api";
import { useSnackbar } from 'react-simple-snackbar'
import { error, success } from "../../util/snackbar";
import { listBrands, useUserController } from "../../context/user";
import SoftTypography from "../../components/SoftTypography";
import { Icon } from "@mui/material";

function Brands() {
  const [drawer,setDrawer] = useState(false)
  const [drawerData,setDrawerData] = useState({isEdit:false,data:null})
  const [controller, dispatch] = useSoftUIController();
  const [userController, userDispatch] = useUserController();
  const {brands} = userController
  const [openErrorSnackbar, closeErrorSnackbar] = useSnackbar(error)
  const [openSuccessSnackbar, closeSuccessSnackbar] = useSnackbar(success)

  const onSubmit = async(data) => {
    setLoader(dispatch, true);
    try {
      if(!drawerData.isEdit){
        let response = await call_api("POST","brand/",{},data)
        if(response.data?.success){
          openSuccessSnackbar("Brand Added Successfully")
          setDrawer(false)
          await getBrands()
        }else openErrorSnackbar(response.data?.error)
      }else{
        let response = await call_api("PUT",`brand/${drawerData?.data?._id}`,{},data)
        if(response.data?.success){
          openSuccessSnackbar("Brand updated Successfully")
          setDrawer(false)
          await getBrands()
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

  const handleEditClick = (brand) => {
    setDrawerData({isEdit:true,data:brand})
    setDrawer(true)
  }

  useEffect(()=>{
    (async()=>{
      await getBrands()
    })()
  },[])

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftButton shadow={"true"} color="info" mt={1} variant="gradient" onClick={()=>{setDrawerData({isEdit:false,data:null});setDrawer(true)}}>
        Add Brand
      </SoftButton>
      <SoftBox py={3}>
        <SoftBox mb={3}>
          <Card>
            <SoftBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
            </SoftBox>
            <SoftBox sx={{"& .MuiTableRow-root:not(:last-child)": {"& td": {borderBottom: ({ borders: { borderWidth, borderColor } }) => `${borderWidth[1]} solid ${borderColor}`}}}}>
              <Table 
                columns={[
                  { name: "name", align: "center" },
                  { name: "edit", align: "center" },
                  // { name: "delete", align: "center" },
                ]} 
                rows={brands.map((brand)=>{
                  return {
                    name: (
                      <SoftTypography variant="caption" color="secondary" fontWeight="bold">
                        {brand.name}
                      </SoftTypography>
                    ),
                    edit: (
                      <SoftButton variant="outlined" color="info" fontWeight="medium" size="small" onClick={()=>handleEditClick(brand)}>
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
      <BrandConfigurator isOpen={drawer} onSubmit={onSubmit} drawerData={drawerData}
        handleClose={()=>{ setDrawer(false); setDrawerData({isEdit:false,data:null}); }}/>
    </DashboardLayout>
  );
}

export default Brands;
