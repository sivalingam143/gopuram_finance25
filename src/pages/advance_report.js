import React, { useState, useEffect, useMemo } from "react";
import API_DOMAIN from "../config/config";
import "./advance_report.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { PDFDownloadLink } from "@react-pdf/renderer";
import AdvanceReportPDF from "./AdvanceReportPDF";
import { useLanguage } from "../components/LanguageContext";

// ⬇️ Material React Table Imports
import { MaterialReactTable } from 'material-react-table';
import { Box, Typography, TableFooter, TableRow, TableCell } from '@mui/material';

const AdvanceReport = () => {
  const { t } = useLanguage();
  const todayStr = new Date().toISOString().split("T")[0];
  const [reportType, setReportType] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  const formatDate = (date) => {
    if (!date) return "—";
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const fetchInterestData = async () => {
    try {
      const response = await fetch(`${API_DOMAIN}/interest.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ search_text: "" }),
      });

      const responseData = await response.json();
      if (responseData.head.code === 200) {
        let result = responseData.body.interest.map((item) => ({
          loanNo: item.receipt_no,
          name: item.name,
          interestAmount: parseFloat(item.interest_income || 0),
          interest_receive_date: item.interest_receive_date,
          status: "Interest Paid",
        }));

        // Filter by date if both fromDate and toDate are provided
        if (fromDate && toDate) {
          const from = new Date(fromDate + "T00:00:00");
          const to = new Date(toDate + "T23:59:59.999");

          result = result.filter((item) => {
            const recordDate = new Date(item.interest_receive_date);
            return recordDate >= from && recordDate <= to;
          });
        }

        return result;
      } else {
        throw new Error(responseData.head.msg);
      }
    } catch (error) {
      console.error("Error fetching interest data:", error.message);
      alert("Failed to fetch interest data.");
      return [];
    }
  };

  const fetchClosingData = async () => {
    try {
      const response = await fetch(`${API_DOMAIN}/pawnrecovery.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          search_text: "",
        }),
      });

      const responseData = await response.json();
      console.log("responseData", responseData);
      setLoading(false);
      if (responseData.head.code === 200) {
        const interestRateLabels = {
          1.5: "18%",
          1.67: "20%",
          1.83: "22%",
          2: "24%",
        };

        // Assign to the outer `result` variable instead of redeclaring
        let result = responseData.body.pawn_recovery.map((item) => {
          // Parse jewel_product
          const jewelProducts = JSON.parse(item.jewel_product);

          // Sum total weight
          const totalWeight = jewelProducts.reduce((sum, jewel) => {
            return sum + parseFloat(jewel.weight || 0);
          }, 0);
          const totalnetWeight = jewelProducts.reduce((sum, jewel) => {
            return sum + parseFloat(jewel.net || 0);
          }, 0);

          // Map interest rate to label
          const interestRateDecimal = item.interest_rate?.toString();
          const interestRateLabel =
            interestRateLabels[interestRateDecimal] || `${item.interest_rate}%`;

          return {
            loanNo: item.receipt_no,
            name: item.name,
            totalWeight: totalWeight.toFixed(2),
            totalnetWeight: totalnetWeight.toFixed(2),
            interestRate: item.interest_rate,
            interestRateLabel: interestRateLabel,
            totalAmount:
              parseFloat(item.refund_amount) + parseFloat(item.other_amount),
            pawnjewelry_recovery_date: item.pawnjewelry_recovery_date,
            status: "Closing",
          };
        });

        // Filter by date if both fromDate and toDate are provided
        if (fromDate && toDate) {
          const from = new Date(fromDate + "T00:00:00");
          const to = new Date(toDate + "T23:59:59.999");

          result = result.filter((item) => {
            const recordDate = new Date(item.pawnjewelry_recovery_date);
            return recordDate >= from && recordDate <= to;
          });
        }

        return result;
      } else {
        throw new Error(responseData.head.msg);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error.message);
    }
  };

  useEffect(() => {
    handleSubmit();
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      let result = [];

      if (reportType === "interest") {
        result = await fetchInterestData();
      } else if (reportType === "closing") {
        result = await fetchClosingData();
      } else {
        const response = await fetch(`${API_DOMAIN}/pawnjewelry.php`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ search_text: "" }),
        });

        const responseData = await response.json();
        console.log(responseData);
        if (responseData.head.code === 200) {
          const interestRateLabels = {
            1.5: "18%",
            1.67: "20%",
            1.83: "22%",
            2: "24%",
          };

          // Assign to the outer `result` variable instead of redeclaring
          result = responseData.body.pawnjewelry.map((item) => {
            // Parse jewel_product
            const jewelProducts = JSON.parse(item.jewel_product);

            // Sum total weight
            const totalWeight = jewelProducts.reduce((sum, jewel) => {
              return sum + parseFloat(jewel.weight || 0);
            }, 0);
            const totalnetWeight = jewelProducts.reduce((sum, jewel) => {
              return sum + parseFloat(jewel.net || 0);
            }, 0);

            // Map interest rate to label
            const interestRateDecimal = item.interest_rate?.toString();
            const interestRateLabel =
              interestRateLabels[interestRateDecimal] ||
              `${item.interest_rate}%`;

            return {
              loanNo: item.receipt_no,
              name: item.name,
              totalWeight: totalWeight.toFixed(2),
              totalnetWeight: totalnetWeight.toFixed(2),
              totalAmount: item.original_amount,
              interestRate: item.interest_rate,
              interestRateLabel: interestRateLabel,
              pawnjewelry_date: item.pawnjewelry_date,
              status: item.status,
            };
          });

          if (fromDate && toDate) {
            const from = new Date(fromDate + "T00:00:00");
            const to = new Date(toDate + "T23:59:59.999");
            result = result.filter((item) => {
              const recordDate = new Date(item.pawnjewelry_date);
              return recordDate >= from && recordDate <= to;
            });
          }

          if (reportType === "outstanding") {
            result = result.filter(
              (item) => item.status === "நகை மீட்கபடவில்லை"
            );
          } else if (reportType === "closing") {
            result = result.filter((item) => item.status === "நகை மீட்கபட்டது");
          }
        } else {
          throw new Error(responseData.head.msg);
        }
      }
      console.log(result);
      setReportData(result);
    } catch (error) {
      console.error("Data fetch failed:", error);
      alert("Something went wrong while fetching the report.");
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = (reportType) => {
    if (reportData.length === 0) {
      alert("No data to export");
      return;
    }

    // Step 1: Prepare data rows dynamically
    let worksheetData = reportData.map((item, index) => {
      const baseRow = {
        "Serial No": index + 1,
        Date:
          reportType === "interest"
            ? formatDate(item.interest_receive_date)
            : reportType === "closing"
            ? formatDate(item.pawnjewelry_recovery_date)
            : formatDate(item.pawnjewelry_date),
        "Loan No": item.loanNo,
        Name: item.name,
      };

      if (reportType === "interest") {
        baseRow["Interest Amount (₹)"] = parseFloat(
          item.interestAmount || 0
        ).toFixed(2);
      } else {
        baseRow["Total Weight (g)"] = parseFloat(item.totalWeight || 0).toFixed(
          2
        );
        baseRow["Net Weight (g)"] = parseFloat(
          item.totalnetWeight || 0
        ).toFixed(2);
        baseRow["Interest"] = item.interestRateLabel || "";
        baseRow["Amount (₹)"] = parseFloat(item.totalAmount || 0).toFixed(2);
      }

      baseRow["Status"] = item.status;
      return baseRow;
    });

    // Step 2: Calculate totals
    let totalInterest = 0;
    let totalWeight = 0;
    let totalAmount = 0;
    let totalnetWeight = 0;

    reportData.forEach((item) => {
      if (reportType === "interest") {
        totalInterest += parseFloat(item.interestAmount || 0);
      } else {
        totalWeight += parseFloat(item.totalWeight || 0);
        totalnetWeight += parseFloat(item.totalnetWeight || 0);
        totalAmount += parseFloat(item.totalAmount || 0);
      }
    });

    // Step 3: Add total row
    const totalRow = {
      "Serial No": "",
      Date: "",
      "Loan No": "",
      Name: "Total",
    };

    if (reportType === "interest") {
      totalRow["Interest Amount (₹)"] = totalInterest.toFixed(2);
    } else {
      totalRow["Total Weight (g)"] = totalWeight.toFixed(2);
      totalRow["Net Weight (g)"] = totalnetWeight.toFixed(2);
      totalRow["Interest"] = "";
      totalRow["Amount (₹)"] = totalAmount.toFixed(2);
    }

    totalRow["Status"] = "";
    worksheetData.push(totalRow);

    // Step 4: Generate and save Excel
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Advance Report");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const dataBlob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(
      dataBlob,
      `AdvanceReport_${reportType}_${
        new Date().toISOString().split("T")[0]
      }.xlsx`
    );
  };
  
  // Styles for the container and buttons (retained from original component for layout)
  const containerStyle = {
    maxWidth: "1500px",
    margin: "auto",
    padding: "10px",
    fontFamily: "Segoe UI, sans-serif",
    backgroundColor: "#f9f9fb",
    borderRadius: "10px",
    boxShadow: "0 0 20px rgba(0,0,0,0.05)",
  };

  const filterContainerStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: "15px",
    marginBottom: "25px",
    alignItems: "center",
  };

  const labelStyle = {
    display: "flex",
    flexDirection: "column",
    fontSize: "14px",
    color: "#333",
    paddingTop: "15px",
  };

  const selectStyle = {
    padding: "8px 12px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    backgroundColor: "#fff",
    fontSize: "14px",
  };

  const buttonStyle = {
    padding: "10px 18px",
    backgroundColor: "#4CAF50 !important",
    color: "#fff !important",
    border: "none !important",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  };

  const buttonHoverStyle = {
    backgroundColor: "#45a049",
  };

  // ⬇️ Material React Table Columns Definition
  const columns = useMemo(() => {
    // Base columns that are always present
    const baseColumns = [
      {
        accessorFn: (row, index) => index + 1, // Custom function for serial number
        id: 'serialNo',
        header: t('Serial No'),
        size: 20,
        enableSorting: false,
        enableColumnFilter: false,
        // muiTableBodyCellProps: { align: 'center' },
        // muiTableHeadCellProps: { align: 'center' },
        Cell: ({ row }) => (
            // MRT indexing starts from 0, so we use row.index + 1
            <Typography variant="body2">{row.index + 1}</Typography>
        ),
      },
      {
        // Dynamic date accessor based on reportType
        accessorFn: (row) => {
          if (reportType === "interest") return row.interest_receive_date;
          if (reportType === "closing") return row.pawnjewelry_recovery_date;
          return row.pawnjewelry_date;
        },
        id: 'date',
        header: t('Date'),
        size: 100,
        Cell: ({ cell }) => (
            <Typography variant="body2">{formatDate(cell.getValue())}</Typography>
        ),
      },
      {
        accessorKey: 'loanNo',
        header: t('Loan No'),
        size: 80,
      },
      {
        accessorKey: 'name',
        header: t('Name'),
        size: 100,
      },
    ];

    // Report-specific columns
    if (reportType === "interest") {
      baseColumns.push(
        {
          accessorKey: 'interestAmount',
          header: `${t('Interest Amount')} (₹)`,
          size: 150,
          muiTableBodyCellProps: { align: 'right' },
          muiTableHeadCellProps: { align: 'right' },
          Cell: ({ cell }) => (
            <Typography variant="body2">
              {typeof cell.getValue() === "number"
                ? parseFloat(cell.getValue()).toFixed(2)
                : "0.00"}
            </Typography>
          ),
        },
      );
    } else {
      baseColumns.push(
        {
          accessorKey: 'totalWeight',
          header: `${t('Total Weight')} (g)`,
          size: 50,
          muiTableBodyCellProps: { align: 'center' },
          muiTableHeadCellProps: { align: 'left' },
          Cell: ({ cell }) => cell.getValue() ?? '—',
        },
        {
          accessorKey: 'totalnetWeight',
          header: `${t('Net Weight')} (g)`,
          size: 50,
          muiTableBodyCellProps: { align: 'center' },
          muiTableHeadCellProps: { align: 'left' },
          Cell: ({ cell }) => cell.getValue() ?? '—',
        },
        {
          accessorKey: 'interestRateLabel',
          header: t('Interest Rate'),
          size: 50,
          muiTableBodyCellProps: { align: 'center' },
          muiTableHeadCellProps: { align: 'left' },
          Cell: ({ cell }) => cell.getValue() ?? '—',
        },
        {
          accessorKey: 'totalAmount',
          header: `${t('Amount')} (₹)`,
          size: 50,
          muiTableBodyCellProps: { align: 'center' },
          muiTableHeadCellProps: { align: 'left' },
          Cell: ({ cell }) => (
            <Typography variant="body2">
              {cell.getValue() != null
                ? parseFloat(cell.getValue()).toLocaleString()
                : "—"}
            </Typography>
          ),
        },
      );
    }

    // Status column, always last
    baseColumns.push({
      accessorKey: 'status',
      header: t('Status'),
      size: 120,
    });

    return baseColumns;
  }, [reportType, t]); // Recalculate columns when reportType changes


  // Calculate Totals for the custom footer (retaining original logic)
  const totalInterest = reportData.reduce(
    (sum, item) => sum + parseFloat(item.interestAmount || 0),
    0
  );
  const totalWeight = reportData.reduce(
    (sum, item) => sum + parseFloat(item.totalWeight || 0),
    0
  );
  const totalnetWeight = reportData.reduce(
    (sum, item) => sum + parseFloat(item.totalnetWeight || 0),
    0
  );
  const totalAmount = reportData.reduce(
    (sum, item) => sum + parseFloat(item.totalAmount || 0),
    0
  );

  return (
    <div style={containerStyle}>
      <h1
        style={{
          fontSize: "24px",
          marginBottom: "10px",
          color: "#222",
          paddingTop: "15px",
        }}
      >
        {t("Advance Report")}
      </h1>

      {/* Filters (Unchanged) */}
      <div style={filterContainerStyle}>
        <label style={labelStyle}>
          {t("Report Type")}

          <select
            value={reportType}
            onChange={(e) => {
              setReportType(e.target.value);
              setReportData([]);
              setFromDate("");
              setToDate("");
            }}
            style={selectStyle}
          >
            <option value="outstanding">{t("Outstanding")}</option>
            <option value="closing">{t("Closing")}</option>
            <option value="interest">{t("Interest")}</option>
            <option value="all">{t("All")}</option>
          </select>
        </label>

        <label style={labelStyle}>
          {t("From Date")}
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            style={selectStyle}
          />
        </label>

        <label style={labelStyle}>
          {t("To Date")}
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            style={selectStyle}
          />
        </label>

        <div>
          <button
            className="btn-cus"
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor =
                buttonHoverStyle.backgroundColor)
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor =
                buttonStyle.backgroundColor)
            }
            onClick={handleSubmit}
          >
            {loading ? t("Loading...") : t("Generate Report")}
          </button>
        </div>
        <div>
          {reportData.length > 0 && (
            <PDFDownloadLink
              document={
                <AdvanceReportPDF data={reportData} reportType={reportType} />
              }
              fileName={`AdvanceReport_${reportType}_${
                new Date().toISOString().split("T")[0]
              }.pdf`}
              className="btn-cus"
              style={{ marginLeft: "10px" }}
            >
              {({ loading }) =>
                loading ? t("Preparing PDF...") : t("Download PDF")
              }
            </PDFDownloadLink>
          )}
        </div>
        <div>
          {reportData.length > 0 && (
            <button
              className="btn-cus"
              onClick={() => exportToExcel(reportType)}
              disabled={reportData.length === 0}
            >
              {t("Export to Excel")}
            </button>
          )}
        </div>
      </div>

      {/* ⬇️ Material React Table Component */}
      <MaterialReactTable
        columns={columns}
        data={reportData}
        enableColumnActions={true}
        enableColumnFilterModes={false}
        enableGlobalFilter={true}
        enableDensityToggle={true}
        enableFullScreenToggle={false}
        enableSorting={false}
        enableHiding={false}
        initialState={{ density: 'compact' }}
        state={{
          isLoading: loading,
        
        }}
        localization={{
            noRecordsFound: t('No data available'),
        }}
        muiTableHeadCellProps={{
          sx: {
            backgroundColor: '#343a40', // table-dark
            color: 'white',
          },
        }}
        
        // Custom Footer to display Totals
        renderBottomToolbarCustomActions={({ table }) => {
    if (reportData.length === 0) return null;

    let totalCells = [];

    // ... (reportType logic remains the same for totalCells)
    if (reportType === "interest") {
        totalCells = [
            <TableCell key="interest" sx={{ textAlign: 'right', fontWeight: 'bold' }}>
                {totalInterest.toFixed(2)}
            </TableCell>,
            <TableCell key="status" sx={{ textAlign: 'left', minWidth: '120px' }}></TableCell> 
        ];
    } else {
        totalCells = [
            <TableCell key="totalWeight" sx={{ textAlign: 'right', fontWeight: 'bold' }}>
                {totalWeight.toFixed(2)}
            </TableCell>,
            <TableCell key="netWeight" sx={{ textAlign: 'right', fontWeight: 'bold' }}>
                {totalnetWeight.toFixed(2)}
            </TableCell>,
            <TableCell key="interestRate" sx={{ textAlign: 'center', minWidth: '100px' }}></TableCell>, 
            <TableCell key="amount" sx={{ textAlign: 'right', fontWeight: 'bold' }}>
                {totalAmount.toLocaleString()}
            </TableCell>,
            <TableCell key="status" sx={{ textAlign: 'left', minWidth: '120px' }}></TableCell> 
        ];
    }

    // Determine the number of control/prefixed columns (e.g., selection/expansion)
    // You may need to adjust this number based on your MRT configuration.
    // Assuming 'mrt-row-select' is enabled.
    const controlColumns = 10; // Change to 0, 1, or 2 based on your table setup

    // The data columns are S.No, Date, Loan No, Name
    // We want the total to appear in the 'Name' column's position (4th data column).

    return (
        <TableFooter sx={{ backgroundColor: '#f0f0f0' }}>
            <TableRow>
                {/* 1. Spacer for Control Columns (if any) */}
                {Array.from({ length: controlColumns }).map((_, index) => (
                    <TableCell key={`spacer-control-${index}`}></TableCell>
                ))}

                {/* 2. Spacer for S.No, Date, Loan No */}
                <TableCell></TableCell> {/* S.No */}
                <TableCell></TableCell> {/* Date */}
                <TableCell></TableCell> {/* Loan No */}
                
                {/* 3. The "Total" label goes into the Name column's position */}
                <TableCell 
                    key="total-label"
                    sx={{ 
                        // Align Total to the right side of the Name column
                        textAlign: 'right', 
                        fontWeight: 'bold',
                        paddingRight: '50px' 
                    }}
                >
                    {t("Total")}
                </TableCell>
                
                {/* 4. The actual total values */}
                {totalCells}
            </TableRow>
        </TableFooter>
    );
}}
        // renderBottomToolbarCustomActions={({ table }) => {
        //     if (reportData.length === 0) return null;

        //     const baseColSpan = 6; // Serial No, Date, Loan No, Name
        //     let totalCells = [];

        //     if (reportType === "interest") {
        //         // Interest report has 1 dynamic column + Status
        //         totalCells = [
        //             <TableCell key="interest" sx={{ textAlign: 'right', fontWeight: 'bold' }}>
        //                 {totalInterest.toFixed(2)}
        //             </TableCell>,
        //             <TableCell key="status" sx={{ textAlign: 'left', minWidth: '120px' }}></TableCell> // Status column spacer
        //         ];
        //     } else {
        //         // Other reports have 4 dynamic columns + Status
        //         totalCells = [
        //             <TableCell key="totalWeight" sx={{ textAlign: 'right', fontWeight: 'bold' }}>
        //                 {totalWeight.toFixed(2)}
        //             </TableCell>,
        //             <TableCell key="netWeight" sx={{ textAlign: 'right', fontWeight: 'bold' }}>
        //                 {totalnetWeight.toFixed(2)}
        //             </TableCell>,
        //             <TableCell key="interestRate" sx={{ textAlign: 'center', minWidth: '100px' }}></TableCell>, // Interest Rate spacer
        //             <TableCell key="amount" sx={{ textAlign: 'right', fontWeight: 'bold' }}>
        //                 {totalAmount.toLocaleString()}
        //             </TableCell>,
        //             <TableCell key="status" sx={{ textAlign: 'left', minWidth: '120px' }}></TableCell> // Status column spacer
        //         ];
        //     }

        //     return (
        //         <TableFooter sx={{ backgroundColor: '#f0f0f0' }}>
        //             <TableRow>
        //                 <TableCell colSpan={baseColSpan} sx={{ textAlign: 'right', fontWeight: 'bold',paddingRight:'20px' }}>
        //                     {t("Total")}
        //                 </TableCell>
        //                 {totalCells}
        //             </TableRow>
        //         </TableFooter>
        //     );
        // }}
      />
      {/* ⬆️ End Material React Table Component */}
    </div>
  );
};

export default AdvanceReport;