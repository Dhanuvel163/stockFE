import { useMemo } from "react";
import PropTypes from "prop-types";
import { v4 as uuidv4 } from "uuid";
import { Table as MuiTable } from "@mui/material";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import SoftBox from "../../../components/SoftBox";
import SoftAvatar from "../../../components/SoftAvatar";
import SoftTypography from "../../../components/SoftTypography";
import colors from "../../../assets/theme/base/colors";
import typography from "../../../assets/theme/base/typography";
import borders from "../../../assets/theme/base/borders";

function Table({ columns=[], rows=[{}] }) {
  const { light } = colors;
  const { size, fontWeightBold } = typography;
  const { borderWidth } = borders;

  const renderColumns = columns.map(({ name, align, width }, key) => {
    let pl;
    let pr;
    if(key === 0){pl = 3; pr = 3;}
    else if(key === columns.length - 1){pl = 3;  pr = 3;}
    else{pl = 1; pr = 1;}
    return (
      <SoftBox
        key={name} component="th" width={width || "auto"} pt={"5px"} pb={"5px"} 
        // pl={align === "left" ? pl : 3} 
        // pr={align === "right" ? pr : 3} 
        textAlign={align} fontSize={size.xxs} fontWeight={fontWeightBold}
        color="dark" border={`${borderWidth[1]} solid black`}>
        {name.toUpperCase()}
      </SoftBox>
    );
  });

  const renderRows = rows.map((row, key) => {
    const rowKey = `row-${key}`;
    const tableRow = columns.map(({ name, align }) => {
      let template;
      if (Array.isArray(row[name])) {
        template = (
          <SoftBox key={uuidv4()} component="td"
            // borderBottom={row.hasBorder ? `${borderWidth[1]} solid black` : null}
            borderLeft={row.hasBorder ? `${borderWidth[1]} solid black` : null}
            borderRight={row.hasBorder ? `${borderWidth[1]} solid black` : null}>
            <SoftBox display="flex" alignItems="center" py={0.5} px={1}>
              <SoftBox mr={2}>
                <SoftAvatar src={row[name][0]} name={row[name][1]} variant="rounded" size="sm" />
              </SoftBox>
              <SoftTypography variant="button" fontWeight="medium" sx={{ width: "max-content" }}>
                {row[name][1]}
              </SoftTypography>
            </SoftBox>
          </SoftBox>
        );
      } else {
        template = (
          <SoftBox key={uuidv4()} component="td" textAlign={align} 
            // borderBottom={row.hasBorder ? `${borderWidth[1]} solid black` : null}
            borderLeft={row.hasBorder ? `${borderWidth[1]} solid black` : null}
            borderRight={row.hasBorder ? `${borderWidth[1]} solid black` : null}>
            <SoftTypography variant="caption" fontWeight="regular" color="dark" 
              lineHeight="0.2px"
              sx={{ display: "inline-block", width: "max-content" }}
            >
              {row[name]}
            </SoftTypography>
          </SoftBox>
        );
      }
      return template;
    });
    return <TableRow key={rowKey}>{tableRow}</TableRow>;
  });

  return useMemo(
    () => (
      <TableContainer style={{borderRadius:0,boxShadow:'none'}}>
        <MuiTable>
          <SoftBox component="thead">
            <TableRow>{renderColumns}</TableRow>
          </SoftBox>
          <TableBody>{renderRows}</TableBody>
        </MuiTable>
      </TableContainer>
    ),
    [columns, rows]
  );
}

// Typechecking props for the Table
Table.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.object),
  rows: PropTypes.arrayOf(PropTypes.object),
};

export default Table;
