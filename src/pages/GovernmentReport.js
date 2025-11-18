import React, { useState, useEffect, useMemo } from "react";
import API_DOMAIN from "../config/config";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { PDFDownloadLink } from "@react-pdf/renderer";
import GovernmentReportPDF from "./GovernmentReportPDF";
import { useLanguage } from "../components/LanguageContext";

// ⬇️ Material React Table Imports
import { MaterialReactTable } from 'material-react-table';
import { Typography, TableFooter, TableRow, TableCell } from '@mui/material';

// Helper function to format numeric values for display
const formatNumericValue = (value, fixedDecimals = 0) => {
  const num = parseFloat(value);
  if (isNaN(num) || value === null) return '';

  if (fixedDecimals > 0) {
    // Format with commas and a fixed number of decimal places (e.g., for Interest)
    return num.toLocaleString(undefined, { 
      minimumFractionDigits: fixedDecimals, 
      maximumFractionDigits: fixedDecimals 
    });
  } else {
    // Format with commas, no fixed decimal places (e.g., for Principal/Total Due)
    return num.toLocaleString();
  }
};

const GovernmentReport = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allData, setAllData] = useState([]);

  // --- Column Configuration for MRT ---
  const columnConfig = useMemo(() => [
    { header: t("Serial No"), accessorKey: "sno", numeric: false, size: 80, align: 'center' },
    { header: t("Period Start Date"), accessorKey: "period_start_date", numeric: false, size: 150 },
    { header: t("Receipt No"), accessorKey: "receipt_no", numeric: false, size: 120 },
    { header: t("Customer No"), accessorKey: "customer_no", numeric: false, size: 120 },
    { header: t("Name"), accessorKey: "name", numeric: false, size: 200 },
    { header: t("Customer Details"), accessorKey: "customer_details", numeric: false, size: 200 },
    { header: t("Place"), accessorKey: "place", numeric: false, size: 150 },
    { header: t("Mobile Number"), accessorKey: "mobile_number", numeric: false, size: 130 },
    { header: t("Date of Birth"), accessorKey: "dateofbirth", numeric: false, size: 130 },
    { header: t("Principal (₹)"), accessorKey: "principal", numeric: true, decimals: 0, size: 150 },
    { header: t("Monthly Interest (₹)"), accessorKey: "monthly_interest", numeric: true, decimals: 2, size: 150 },
    { header: t("Total Interest (₹)"), accessorKey: "total_interest", numeric: true, decimals: 2, size: 150 },
    { header: t("Total Due (₹)"), accessorKey: "total_due", numeric: true, decimals: 0, size: 150 },
  ], [t]);

  // --- MRT Columns Definition ---
  const columns = useMemo(() => {
    return columnConfig.map((col) => ({
      accessorKey: col.accessorKey,
      header: col.header,
      size: col.size,
      enableColumnFilter: col.accessorKey !== 'sno', // Disable filter on Serial No
      enableSorting: col.accessorKey !== 'sno',      // Disable sort on Serial No
      
      Cell: ({ row, cell }) => {
        const rawValue = cell.getValue();

        let displayValue;
        
        // Handle Serial No (calculated based on row index)
        if (col.accessorKey === 'sno') {
            displayValue = row.index + 1;
        } 
        // Handle Date columns (using the existing formatDate helper)
        else if (col.accessorKey === 'period_start_date' || col.accessorKey === 'dateofbirth') {
            displayValue = formatDate(rawValue);
        } 
        // Handle Numeric columns
        else if (col.numeric) {
            displayValue = formatNumericValue(rawValue, col.decimals);
        } 
        // Handle all other text columns
        else {
            displayValue = rawValue;
        }

        return (
          <Typography 
            variant="body2" 
            sx={{ 
              textAlign: col.numeric ? 'right' : (col.align === 'center' ? 'center' : 'left'),
              // Ensure date columns that are formatted with '—' are centered if defined that way
              minWidth: col.size,
            }}
          >
            {displayValue}
          </Typography>
        );
      },
      // Apply alignment for MRT
      muiTableBodyCellProps: {
        align: col.numeric ? 'right' : (col.align === 'center' ? 'center' : 'left'),
      },
      muiTableHeadCellProps: {
        align: col.numeric ? 'right' : (col.align === 'center' ? 'center' : 'left'),
        sx: { minWidth: col.size },
      },
    }));
  }, [columnConfig]);


  const fetchGovernmentData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_DOMAIN}/pawnjewelry.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          receipt_no: "",
          report_type: "interest_report",
        }),
      });

      const responseData = await response.json();
      if (responseData.head.code === 200) {
        // Ensure data is always an array
        const result = responseData.body.reports || (responseData.body ? [responseData.body] : []);
        setAllData(result);
        setReportData(result);
      } else {
        throw new Error(responseData.head.msg);
      }
    } catch (error) {
      console.error("Error fetching government data:", error.message);
      alert("Failed to fetch government data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGovernmentData();
  }, []);

  // Filter data based on search term (receipt_no or customer_no)
  // NOTE: This manual filtering is kept for consistency with the original code, 
  // but MRT's built-in global filter could also handle this.
  useEffect(() => {
    if (searchTerm === "") {
      setReportData(allData);
    } else {
      const filtered = allData.filter(
        (item) =>
          item.receipt_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.customer_no.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setReportData(filtered);
    }
  }, [searchTerm, allData]);

  // Calculate totals (used in Excel export and Footer)
  const totalPrincipal = reportData.reduce(
    (sum, item) => sum + parseFloat(item.principal || 0),
    0
  );
  const totalMonthlyInterest = reportData.reduce(
    (sum, item) => sum + parseFloat(item.monthly_interest || 0),
    0
  );
  const totalInterest = reportData.reduce(
    (sum, item) => sum + parseFloat(item.total_interest || 0),
    0
  );
  const totalDue = reportData.reduce(
    (sum, item) => sum + parseFloat(item.total_due || 0),
    0
  );

  const exportToExcel = () => {
    if (reportData.length === 0) {
      alert("No data to export");
      return;
    }

    const headers = columnConfig.map(col => col.header);
    
    // Prepare data rows
    let worksheetData = reportData.map((item, index) => {
        const rowObject = {};
        columnConfig.forEach((col, i) => {
            let value;
            if (col.accessorKey === 'sno') {
                value = index + 1;
            } else if (col.accessorKey === 'period_start_date' || col.accessorKey === 'dateofbirth') {
                value = formatDate(item[col.accessorKey]);
            } else if (col.numeric) {
                // Use the formatting logic for Excel display
                value = formatNumericValue(item[col.accessorKey], col.decimals);
            } else {
                value = item[col.accessorKey] || '';
            }
            rowObject[headers[i]] = value;
        });
        return rowObject;
    });

    // Add total row
    const totalRow = {};
    columnConfig.forEach((col, i) => {
        let totalValue = "";
        if (i === 4) { // Name column is where "Total" label goes
             totalValue = t("Total");
        } else if (col.accessorKey === 'principal') {
            totalValue = formatNumericValue(totalPrincipal, col.decimals);
        } else if (col.accessorKey === 'monthly_interest') {
            totalValue = formatNumericValue(totalMonthlyInterest, col.decimals);
        } else if (col.accessorKey === 'total_interest') {
            totalValue = formatNumericValue(totalInterest, col.decimals);
        } else if (col.accessorKey === 'total_due') {
            totalValue = formatNumericValue(totalDue, col.decimals);
        }
        totalRow[headers[i]] = totalValue;
    });
    worksheetData.push(totalRow);

    // Generate and save Excel
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Government Report");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const dataBlob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(
      dataBlob,
      `GovernmentReport_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  const formatDate = (date) => {
    if (!date) return "—";
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // --- Custom Footer for Material React Table (Totals Row) ---
  const renderTotalsFooter = ({ table }) => {
    if (reportData.length === 0) return null;

    return (
        <TableFooter sx={{ backgroundColor: '#f0f0f0', borderTop: '2px solid #ccc' }}>
            <TableRow>
                {columnConfig.map((col, i) => {
                    let textAlign = col.numeric ? 'right' : (col.align === 'center' ? 'center' : 'left');
                    
                    let displayValue = '';
                    if (i === 4) { // Name column index
                        displayValue = t("Total");
                        // Right align the Total label to match the column below it.
                        textAlign = 'right'; 
                    } else if (col.accessorKey === 'principal') {
                        displayValue = formatNumericValue(totalPrincipal, col.decimals);
                    } else if (col.accessorKey === 'monthly_interest') {
                        displayValue = formatNumericValue(totalMonthlyInterest, col.decimals);
                    } else if (col.accessorKey === 'total_interest') {
                        displayValue = formatNumericValue(totalInterest, col.decimals);
                    } else if (col.accessorKey === 'total_due') {
                        displayValue = formatNumericValue(totalDue, col.decimals);
                    }

                    return (
                        <TableCell 
                            key={`total-${i}`} 
                            sx={{ 
                                fontWeight: 'bold', 
                                textAlign: textAlign,
                                minWidth: col.size, 
                                padding: '12px',
                            }}
                        >
                            <Typography fontWeight="bold" variant="body2">{displayValue}</Typography>
                        </TableCell>
                    );
                })}
            </TableRow>
        </TableFooter>
    );
  };
  // --- End Custom Footer ---

  // Removed all unused inline style objects (filterContainerStyle, labelStyle, inputStyle, etc.)
  // and applied standard utility classes/inline styles where necessary for control elements.

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ fontSize: "24px", marginBottom: "10px", color: "#222" }}>
        {t("Government Report")}
      </h1>

      {/* Search Filter and Action Buttons */}
      <div style={{ 
          display: "flex", 
          flexWrap: "wrap", 
          gap: "15px", 
          marginBottom: "25px", 
          alignItems: "center" 
      }}>
        <label style={{ display: "flex", flexDirection: "column", fontSize: "14px", color: "#333" }}>
          {t("Search (Receipt No / Customer No)")}
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t("Enter Receipt No or Customer No...")}
            style={{ 
                padding: "8px 12px", 
                borderRadius: "5px", 
                border: "1px solid #ccc", 
                backgroundColor: "#fff", 
                fontSize: "14px" 
            }}
          />
        </label>
        <div>
          <button
            className="btn-cus"
            onClick={fetchGovernmentData}
            disabled={loading}
          >
            {loading ? t("Loading...") : t("Refresh Data")}
          </button>
        </div>
        <div>
          {reportData.length > 0 && (
            <PDFDownloadLink
              document={<GovernmentReportPDF data={reportData} />}
              fileName={`GovernmentReport_${
                new Date().toISOString().split("T")[0]
              }.pdf`}
              className="btn-cus"
              style={{ marginLeft: "10px" }}
            >
              {({ loading: pdfLoading }) =>
                pdfLoading ? t("Preparing PDF...") : t("Download PDF")
              }
            </PDFDownloadLink>
          )}
        </div>
        <div>
          {reportData.length > 0 && (
            <button
              className="btn-cus"
              onClick={exportToExcel}
              disabled={reportData.length === 0}
            >
              {t("Export to Excel")}
            </button>
          )}
        </div>
      </div>

      {/* --- Material React Table --- */}
      <MaterialReactTable
        columns={columns}
        data={reportData}
        state={{ isLoading: loading }}
        enableSorting
        enableColumnFilters
        enableGlobalFilter={false} // Global search is handled manually via the input above
        enablePagination
        enableDensityToggle={false}
        enableFullScreenToggle={false}
        enableHiding={false}
        initialState={{ density: 'compact' }}
        localization={{
            noRecordsFound: t('No data available'),
        }}
        // Custom style for a bordered table
        muiTablePaperProps={{
          elevation: 0,
          sx: {
            border: '1px solid #dee2e6',
          },
        }}
        // Custom style for a dark/bold header
        muiTableHeadCellProps={{
          sx: {
            backgroundColor: '#343a40',
            color: 'white',
            fontWeight: 'bold',
          },
        }}
        // Totals row implemented as a custom bottom toolbar
        renderBottomToolbarCustomActions={renderTotalsFooter}
      />
    </div>
  );
};

export default GovernmentReport;