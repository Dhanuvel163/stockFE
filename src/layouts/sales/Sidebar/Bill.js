import { Divider, Grid, Icon } from "@mui/material";
import SoftBox from "../../../components/SoftBox";
import SoftTypography from "../../../components/SoftTypography";
import Table from "../../../examples/Tables/Table/PrintTable";
import SoftButton from "../../../components/SoftButton";
import { useReactToPrint } from "react-to-print";
import { useEffect, useRef, useState } from "react";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";

function Bill({data,onClose}) {
    const contentRef = useRef(null);
    const [isPrinting, setIsPrinting] = useState(false);
    const promiseResolveRef = useRef(null);
    const reactToPrintFn = useReactToPrint({ 
        contentRef: contentRef,
        onBeforePrint: () => new Promise((resolve) => { promiseResolveRef.current = resolve; setIsPrinting(true) }),
        onAfterPrint: () => { promiseResolveRef.current = null; setIsPrinting(false) }
     });
    const [productSplit,setProductSplit] = useState([])
    const [indexMap,setIndexMap] = useState({})

    useEffect(() => {
        if (isPrinting && promiseResolveRef.current) promiseResolveRef.current();
    }, [isPrinting]);

    useEffect(()=>{
        const chunkSize = 8;
        const split = []
        for (let i = 0; i < data?.products?.length; i += chunkSize) {
            const chunk = data?.products?.slice(i, i + chunkSize);
            split.push(chunk)
        }
        setProductSplit(split)
        setIndexMap(()=>{
            console.log({data})
            const map = {}
            data?.products.forEach((product,i) => {
                map[product?._id] = i+1
            });
            setIndexMap(map)
        })
    },[data])

    return(
        <SoftBox alignItems="center" justifyContent="center" display="flex" height="100vh">
            <SoftBox width="80vw" maxHeight="80vh" overflow="auto" bgColor="white" borderRadius="8px">
                <SoftBox display="flex" justifyContent="space-between" alignItems="baseline" pb={0.8} px={5} pt={2}>
                    <SoftBox><SoftTypography variant="h5">Bill</SoftTypography></SoftBox>
                    <Icon sx={({ typography: { size, fontWeightBold }, palette: { dark } }) => ({ fontSize: `${size.md} !important`, fontWeight: `${fontWeightBold} !important`, stroke: dark.main, strokeWidth: "2px", cursor: "pointer", mt: 2})}
                        onClick={onClose}>
                        close
                    </Icon>
                </SoftBox>
                <Divider/>
                <SoftBox p={2}>
                    <BillHeader data={data}/>
                    <BillTable products={data?.products} indexMap={indexMap} isPrintTable={false}/>
                    <BillFooter data={data} isLastBill={true}/>
                </SoftBox>
                <SoftBox display="none">
                    <SoftBox ref={contentRef}>
                        {
                            productSplit.map((products,index)=>(
                                <SoftBox key={uuidv4()} style={{pageBreakInside:'avoid'}} p={2}>
                                    <BillHeader data={data}/>
                                    <BillTable products={products} indexMap={indexMap}/>
                                    <BillFooter data={data} isLastBill={index==(productSplit.length-1)}/>
                                </SoftBox>
                            ))
                        }
                    </SoftBox>
                </SoftBox>
                <SoftBox mt={2} display="flex" justifyContent="end" p={2}>
                    <SoftButton shadow={"true"} color="info" variant="gradient" onClick={() => reactToPrintFn()}>
                        Print
                    </SoftButton>
                </SoftBox>
            </SoftBox>
        </SoftBox>
    )
}

const BillHeader = ({data}) => {
    return (
        <div style={{display:'grid', gridTemplateColumns:'repeat(3, minmax(0, 1fr))',border:'1px solid black', borderBottom:0}}>
            <div style={{borderRight:'1px solid black', padding:8}}>
                <h3 className="tableTitle">{data.organization?.name}</h3>
                <p variant="p" className="tableText">{data.organization?.address}</p>
                <p variant="p" className="tableText">
                    <span style={{width:92, display:'inline-block'}}>GSTIN</span>: {data.organization?.gstin}
                </p>
                <p variant="p" className="tableText">
                    <span style={{width:92, display:'inline-block'}}>Mobile No</span>: {data.organization?.contact}
                </p>
                <p variant="p" className="tableText">
                    <span style={{width:92, display:'inline-block'}}>Drug License</span>: {data.organization?.food_license_no} {data.organization?.drug_license_no ? `& ${data.organization?.drug_license_no}` : ''}
                </p>
            </div>
            <div style={{borderRight:'1px solid black', padding:8}}>
                <p variant="p" className="tableText">Buyer Details</p>
                <h3 className="tableTitle">{data.shop?.name}</h3>
                <p variant="p" className="tableText">{data.shop?.address}</p>
                <p variant="p" className="tableText">
                    <span style={{width:72, display:'inline-block'}}>GSTIN</span>: {data.shop?.gstin}
                </p>
                <p variant="p" className="tableText">
                    <span style={{width:72, display:'inline-block'}}>Mobile No</span>: {data.shop?.contact}
                </p>
            </div>
            <div style={{padding:8}}>
                <h3 className="tableTitle">TAX INVOICE</h3>
                <p variant="p" className="tableText">{data.organization?.address}</p>
                <p variant="p" className="tableText">
                    <span style={{width:34, display:'inline-block'}}>No</span>: {data.invoice}
                </p>
                <p variant="p" className="tableText">
                    <span style={{width:34, display:'inline-block'}}>Date</span>: {moment(data.sales_date).format("DD-MM-YYYY")}
                </p>
            </div>
        </div>
    )
}

const BillFooter = ({data,isLastBill}) => {
    return (
        <div style={{display:'grid', gridTemplateColumns:'repeat(3, minmax(0, 1fr))',border:'1px solid black'}}>
            <div style={{borderRight:'1px solid black', padding:8}}>
            {
                isLastBill &&
                <p variant="p" className="tableText">
                    <span className="tableLabel">Total Qty</span>: {data.products?.reduce((prev,prod)=>prev+(prod.sell_units || 0)+(prod.sell_free_units || 0),0)}
                </p>
            }
            </div>
            <div style={{borderRight:'1px solid black', padding:8}}>
            </div>
            <div style={{padding:8}}>
                <SoftBox style={{height:67}}>
                    {
                        isLastBill &&
                        <>
                            <p variant="p" className="tableText">
                                <span className="tableLabel">Amount</span>: {data.total_sell_rate}
                            </p>
                            <p variant="p" className="tableText">
                                <span className="tableLabel">Discount</span>: {data.total_discount || 0}
                            </p>
                            <p variant="p" className="tableText">
                                <span className="tableLabel">Grand Total</span>: {data.net_total_sell_rate}
                            </p>
                        </>
                    }
                </SoftBox>
            </div>
        </div>
    )
}

const BillTable = ({products,indexMap,isPrintTable=true}) => {
    const productArray = [...Array(8).keys()]
    return (
        <Table
            columns={[
                { name: "s no", align: "center" },
                { name: "product", align: "center" },
                { name: "hsn code", align: "center" },
                { name: "mrp", align: "center" },
                { name: "qty", align: "center" },
                { name: "f qty", align: "center" },
                { name: "rate", align: "center" },
                { name: "dis%", align: "center" },
                { name: "c.dis", align: "center" },
                { name: "gst%", align: "center" },
                { name: "net rate", align: "center" },
                { name: "amount", align: "center" },
            ]} 
            rows={(isPrintTable ? productArray : products)?.map((_,i)=>{
                const product = products?.[i] || {};
                return {
                    "s no": (product?.product) ? (indexMap[product?.product?._id]) : "",
                    product: product?.product?.name || "",
                    "hsn code": product?.product?.hsn_code || "",
                    mrp: product?.sell_mrp || "",
                    qty: product?.sell_units || "",
                    "f qty": product?.sell_free_units || "",
                    rate: (product?.sell_rate) ? (parseFloat(product?.sell_rate).toFixed(2)) : "",
                    "dis%": (""),
                    "c.dis": (""),
                    "gst%": (product?.sell_cgst_percent + product?.sell_sgst_percent) || "",
                    "net rate": (product?.sell_rate_with_gst) ? (parseFloat(product?.sell_rate_with_gst).toFixed(2)) : "",
                    amount: (product?.total_sell_rate) ? (parseFloat(product?.total_sell_rate).toFixed(2)) : "",
                    hasBorder: true
                }
            })} 
        />
    )
}

export default Bill;
