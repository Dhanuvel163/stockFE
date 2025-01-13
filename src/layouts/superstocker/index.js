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
import { listSuperStockers, useUserController } from "../../context/user";
import SoftTypography from "../../components/SoftTypography";
import { Icon } from "@mui/material";
import SuperStockerConfigurator from "./Sidebar";

function SuperStocker() {
  const [drawer,setDrawer] = useState(false)
  const [drawerData,setDrawerData] = useState({isEdit:false,data:null})
  const [controller, dispatch] = useSoftUIController();
  const [userController, userDispatch] = useUserController();
  const {super_stockers} = userController
  const [openErrorSnackbar, closeErrorSnackbar] = useSnackbar(error)
  const [openSuccessSnackbar, closeSuccessSnackbar] = useSnackbar(success)

  const onSubmit = async(data) => {
    setLoader(dispatch, true);
    try {
      if(!drawerData.isEdit){
        let response = await call_api("POST","superstocker/",{},data)
        if(response.data?.success){
          openSuccessSnackbar("Super Stocker Added Successfully")
          setDrawer(false)
          await getSuperStocker()
        }else openErrorSnackbar(response.data?.error)
      }else{
        let response = await call_api("PUT",`updateSuperstocker/${drawerData?.data?._id}`,{},data)
        if(response.data?.success){
          openSuccessSnackbar("Super Stocker updated Successfully")
          setDrawer(false)
          await getSuperStocker()
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

  const getSuperStocker = async() => {
    setLoader(dispatch, true);
    try {
      let response = await call_api("GET","superstocker/",{},{})
      if(response.data?.success){
        listSuperStockers(userDispatch, response.data?.data);
      }else openErrorSnackbar(response.data?.error)
    } catch (error) {
      const response = error.response?.data
      if(!response?.success) openErrorSnackbar(response?.error)
      else openErrorSnackbar("Something went wrong, Please try after sometime.")
    }finally{
      setLoader(dispatch, false);
    }
  }

  const handleEditClick = (ss) => {
    setDrawerData({isEdit:true,data:ss})
    setDrawer(true)
  }

  useEffect(()=>{
    (async()=>{
      await getSuperStocker()
    })()
  },[])

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftButton shadow={"true"} color="info" mt={1} variant="gradient" onClick={()=>{setDrawerData({isEdit:false,data:null});setDrawer(true)}}>
        Add Super Stocker
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
                  { name: "address", align: "center" },
                  { name: "edit", align: "center" },
                  // { name: "delete", align: "center" },
                ]} 
                rows={super_stockers.map((ss)=>{
                  return {
                    name: (
                      <SoftTypography variant="caption" color="secondary" fontWeight="bold">
                        {ss.name}
                      </SoftTypography>
                    ),
                    address: (
                      <SoftTypography variant="caption" color="secondary" fontWeight="bold">
                        {ss.address}
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
      <SuperStockerConfigurator isOpen={drawer} handleClose={()=>setDrawer(false)} onSubmit={onSubmit} drawerData={drawerData}/>
    </DashboardLayout>
  );
}

export default SuperStocker;
