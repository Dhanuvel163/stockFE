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
import { listProducts, useUserController, listBrands, listPurchases, listSuperStockers } from "../../context/user";
import SoftTypography from "../../components/SoftTypography";
import { Icon } from "@mui/material";
import PurchaseConfigurator from "./Sidebar";
import SoftInput from "../../components/SoftInput";
import Select from 'react-select'
import moment from 'moment'


function Purchase() {
  const [drawer,setDrawer] = useState(false)
  const [drawerData,setDrawerData] = useState({isEdit:false,data:null})
  const [controller, dispatch] = useSoftUIController();
  const [userController, userDispatch] = useUserController();
  const {products,brands,purchases,super_stockers} = userController
  const [openErrorSnackbar, closeErrorSnackbar] = useSnackbar(error)
  const [openSuccessSnackbar, closeSuccessSnackbar] = useSnackbar(success)
  const [purchaseSearch,setPurchaseSearch] = useState({super_stocker:null,purchase_date:null})

  const onSubmit = async(data) => {
    setLoader(dispatch, true);
    try {
      if(!drawerData.isEdit){
        let response = await call_api("POST","purchase/",{},data)
        if(response.data?.success){
          openSuccessSnackbar("Purchase Added Successfully")
          setDrawer(false)
          await getPurchases()
        }else openErrorSnackbar(response.data?.error)
      }else{
        let response = await call_api("PUT",`updatePurchase/${drawerData?.data?._id}`,{},data)
        if(response.data?.success){
          openSuccessSnackbar("Purchase updated Successfully")
          setDrawer(false)
          await getPurchases()
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

  const getPurchases = async() => {
    setLoader(dispatch, true);
    try {
      let response = await call_api("POST","getPurchases/",{},purchaseSearch)
      if(response.data?.success){
        listPurchases(userDispatch, response.data?.data);
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

  const handleEditClick = (purchase) => {
    setDrawerData({isEdit:true,data:purchase})
    setDrawer(true)
  }

  useEffect(()=>{
    (async()=>{
      await Promise.all([getBrands(), getPurchases(), getSuperStocker()])
    })()
  },[])

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftButton shadow={"true"} color="info" mt={1} variant="gradient" onClick={()=>{setDrawerData({isEdit:false,data:null});setDrawer(true)}}>
        Add Purchase
      </SoftButton>
      <SoftBox py={3} display="flex" alignItems="center" gap={1}>
        <div style={{width:200}}>
          <SoftInput type="date" placeholder="Purchase Date"
            onChange={(e)=>{setPurchaseSearch((prev)=>({...prev,purchase_date:e.target.value}))}}/>
        </div>
        <Select placeholder="Super Stocker"
          styles={{
            control: (baseStyles, state) => ({...baseStyles, borderRadius: '0.5rem', border: '0.0625rem solid #d2d6da', fontSize: '0.875rem', fontWeight: '400', color: '#495057', minWidth:200}),
            option: (baseStyles, state) => ({...baseStyles, fontSize: '0.875rem', fontWeight: '400'}),
          }}
          options={[{value:null,label:'-- All --'},...super_stockers.map((super_stocker)=>({value: super_stocker._id, label: super_stocker.name}))]} 
          onChange={(e)=>{setPurchaseSearch((prev)=>({...prev,super_stocker:e.value}))}}
        />
        <SoftButton shadow={"true"} color="dark" mt={1} variant="gradient" onClick={()=>{getPurchases()}}>
          Search
        </SoftButton>
      </SoftBox>
      <SoftBox pb={3}>
        <SoftBox mb={3}>
          <Card>
            <SoftBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
            </SoftBox>
            <SoftBox sx={{"& .MuiTableRow-root:not(:last-child)": {"& td": {borderBottom: ({ borders: { borderWidth, borderColor } }) => `${borderWidth[1]} solid ${borderColor}`}}}}>
              <Table 
                columns={[
                  { name: "purchase date", align: "center" },
                  { name: "superstocker", align: "center" },
                  { name: "products", align: "center" },
                  // { name: "edit", align: "center" },
                  // { name: "delete", align: "center" },
                ]} 
                rows={purchases.map((purchase)=>{
                  return {
                    "purchase date": (
                      <SoftTypography variant="caption" color="secondary" fontWeight="bold">
                        {moment(purchase.purchase_date).format("DD-MM-YYYY")}
                      </SoftTypography>
                    ),
                    superstocker: (
                      <SoftTypography variant="caption" color="secondary" fontWeight="bold">
                        {purchase.super_stocker?.name}
                      </SoftTypography>
                    ),
                    products: (
                      <SoftTypography variant="caption" color="secondary" fontWeight="bold">
                        {purchase.products?.map((product)=>product?.product?.name)?.join(", ")}
                      </SoftTypography>
                    ),
                    // edit: (
                    //   <SoftButton variant="outlined" color="info" fontWeight="medium" size="small" onClick={()=>handleEditClick(ss)}>
                    //     <Icon>edit</Icon>&nbsp;Edit
                    //   </SoftButton>
                    // ),
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
      <PurchaseConfigurator isOpen={drawer} handleClose={()=>setDrawer(false)} onSubmit={onSubmit} drawerData={drawerData}/>
    </DashboardLayout>
  );
}

export default Purchase;
