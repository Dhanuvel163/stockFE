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
import { useUserController, listBrands, listSales, listShops, listSalesman } from "../../context/user";
import SoftTypography from "../../components/SoftTypography";
import SalesConfigurator from "./Sidebar";
import SoftInput from "../../components/SoftInput";
import Select from 'react-select'
import moment from 'moment'


function Sales() {
  const [drawer,setDrawer] = useState(false)
  const [drawerData,setDrawerData] = useState({isEdit:false,data:null})
  const [controller, dispatch] = useSoftUIController();
  const [userController, userDispatch] = useUserController();
  const {sales,shops} = userController
  const [openErrorSnackbar, closeErrorSnackbar] = useSnackbar(error)
  const [openSuccessSnackbar, closeSuccessSnackbar] = useSnackbar(success)
  const [salesSearch,setSalesSearch] = useState({shop:null,sales_date:null,salesman:null})

  const onSubmit = async(data) => {
    setLoader(dispatch, true);
    try {
      if(!drawerData.isEdit){
        let response = await call_api("POST","sale/",{},data)
        if(response.data?.success){
          openSuccessSnackbar("Sale Added Successfully")
          setDrawer(false)
          await getSales()
        }else openErrorSnackbar(response.data?.error)
      }else{
        let response = await call_api("PUT",`updateSale/${drawerData?.data?._id}`,{},data)
        if(response.data?.success){
          openSuccessSnackbar("Sale updated Successfully")
          setDrawer(false)
          await getSales()
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

  const getSales = async() => {
    setLoader(dispatch, true);
    try {
      let response = await call_api("POST","getSales/",{},salesSearch)
      if(response.data?.success){
        listSales(userDispatch, response.data?.data);
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

  const getShops = async() => {
    setLoader(dispatch, true);
    try {
      let response = await call_api("GET","shop/",{},{})
      if(response.data?.success){
        listShops(userDispatch, response.data?.data);
      }else openErrorSnackbar(response.data?.error)
    } catch (error) {
      const response = error.response?.data
      if(!response?.success) openErrorSnackbar(response?.error)
      else openErrorSnackbar("Something went wrong, Please try after sometime.")
    }finally{
      setLoader(dispatch, false);
    }
  }

  const getSalesman = async() => {
    setLoader(dispatch, true);
    try {
      let response = await call_api("GET","salesman/",{},{})
      if(response.data?.success){
        listSalesman(userDispatch, response.data?.data);
      }else openErrorSnackbar(response.data?.error)
    } catch (error) {
      const response = error.response?.data
      if(!response?.success) openErrorSnackbar(response?.error)
      else openErrorSnackbar("Something went wrong, Please try after sometime.")
    }finally{
      setLoader(dispatch, false);
    }
  }

  const handleEditClick = (sale) => {
    setDrawerData({isEdit:true,data:sale})
    setDrawer(true)
  }

  useEffect(()=>{
    (async()=>{
      await Promise.all([getBrands(), getSales(), getShops(), getSalesman()])
    })()
  },[])

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftButton shadow={"true"} color="info" mt={1} variant="gradient" onClick={()=>{setDrawerData({isEdit:false,data:null});setDrawer(true)}}>
        Add Sales
      </SoftButton>
      <SoftBox py={3} display="flex" alignItems="center" gap={1}>
        <div style={{width:200}}>
          <SoftInput type="date" placeholder="Sale Date"
            onChange={(e)=>{setSalesSearch((prev)=>({...prev,sales_date:e.target.value}))}}/>
        </div>
        <Select placeholder="Shop"
          styles={{
            control: (baseStyles, state) => ({...baseStyles, borderRadius: '0.5rem', border: '0.0625rem solid #d2d6da', fontSize: '0.875rem', fontWeight: '400', color: '#495057', minWidth:200}),
            option: (baseStyles, state) => ({...baseStyles, fontSize: '0.875rem', fontWeight: '400'}),
          }}
          options={[{value:null,label:'-- All --'},...shops.map((shop)=>({value: shop._id, label: shop.name}))]} 
          onChange={(e)=>{setSalesSearch((prev)=>({...prev,shop:e.value}))}}
        />
        <SoftButton shadow={"true"} color="dark" mt={1} variant="gradient" onClick={()=>{getSales()}}>
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
                  { name: "sale date", align: "center" },
                  { name: "shop", align: "center" },
                  { name: "salesman", align: "center" },
                  { name: "products(count)", align: "center" },
                  { name: "total amount", align: "center" },
                  // { name: "edit", align: "center" },
                  // { name: "delete", align: "center" },
                ]} 
                rows={sales.map((sale)=>{
                  return {
                    "sale date": (
                      <SoftTypography variant="caption" color="secondary" fontWeight="bold">
                        {moment(sale.sales_date).format("DD-MM-YYYY")}
                      </SoftTypography>
                    ),
                    shop: (
                      <SoftTypography variant="caption" color="secondary" fontWeight="bold">
                        {sale.shop?.name}
                      </SoftTypography>
                    ),
                    salesman: (
                      <SoftTypography variant="caption" color="secondary" fontWeight="bold">
                        {sale.salesman?.name}
                      </SoftTypography>
                    ),
                    "products(count)": (
                      <SoftTypography variant="caption" color="secondary" fontWeight="bold">
                        {sale.products?.map((product)=>`${product?.product?.name}(${(product?.sell_units + (product?.sell_free_units || 0))})`)?.join(", ")}
                      </SoftTypography>
                    ),
                    "total amount": (
                      <SoftTypography variant="caption" color="secondary" fontWeight="bold">
                        {sale.net_total_sell_rate}
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
      <SalesConfigurator isOpen={drawer} onSubmit={onSubmit} drawerData={drawerData}
        handleClose={()=>{setDrawer(false);setDrawerData({isEdit:false,data:null})}}/>
    </DashboardLayout>
  );
}

export default Sales;
