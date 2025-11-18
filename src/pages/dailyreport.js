import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import API_DOMAIN from "../config/config";
import "./DailyReport.css";
import ReportPDF from "./dailyreportPdf";
import { PDFDownloadLink } from "@react-pdf/renderer";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useLanguage } from "../components/LanguageContext";

// ⬇️ Material React Table Imports
import { MaterialReactTable } from 'material-react-table';
import { Typography, TableFooter, TableRow, TableCell } from '@mui/material';

// Helper function to format numeric values for display
const formatValue = (value) => {
  const num = parseFloat(value);
  if (isNaN(num) || value === null) return value;
  // Format large numbers with commas, and ensure two decimal places
  return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const DailyReport = () => {
  const { t } = useLanguage();
  const [selectedView, setSelectedView] = useState("FINAL SHEET");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reportData, setReportData] = useState([]);
  const [totals, setTotals] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- Configuration Table (Updated with 'keys' for MRT) ---
  const tableConfig = {
    "FINAL SHEET": {
      title: t("Financial Report"),
      action: "daily_final_sheet",
      columns: [
        t("Date"), t("GOLD C"), t("GOLD D"), t("GOLD I"), t("SLIVER C"), t("SLIVER D"),
        t("SLIVER I"), t("RP GOLD C"), t("RP GOLD D"), t("RP GOLD I"), t("EXPENSE"),
        t("CASH"), t("START BAL"), t("END BAL"), t("RESULT"),
      ],
      keys: [ 
        "date", "gold_c", "gold_d", "gold_i", "silver_c", "silver_d", 
        "silver_i", "rp_gold_c", "rp_gold_d", "rp_gold_i", "expense", 
        "cash", "start_bal", "end_bal", "result" 
      ],
      numericColumns: [
        "gold_c", "gold_d", "gold_i", "silver_c", "silver_d", "silver_i", 
        "rp_gold_c", "rp_gold_d", "rp_gold_i", "expense", "cash", "start_bal", 
        "end_bal", "result",
      ],
      rowMapper: (row) => [
        row.date, row.gold_c, row.gold_d, row.gold_i, row.silver_c, row.silver_d, 
        row.silver_i, row.rp_gold_c, row.rp_gold_d, row.rp_gold_i, row.expense, 
        row.cash, row.start_bal, row.end_bal, row.result,
      ],
    },
    "GOLD LEDGER": {
      title: "GOLD LEDGER",
      action: "gold_ledger",
      columns: [
        t("S.NO"), t("GOLD TYPE"), t("GOLD PLEDG NO"), t("GOLD C"), t("GC I"), 
        t("G D"), t("MONTHS"), t("GD INTEREST"),
      ],
      keys: [
        "sno", "gold_type", "pledge_no", "gold_c", "gc_interest", "gold_d", "months", "gd_interest"
      ],
      numericColumns: [
        "gold_c", "gc_interest", "gold_d", "months", "gd_interest",
      ],
      rowMapper: (row, index) => [
        index + 1, row.gold_type, row.pledge_no, row.gold_c, row.gc_interest, 
        row.gold_d, row.months, row.gd_interest,
      ],
    },
    "RP GOLD LEDGER": {
      title: "RP GOLD LEDGER",
      action: "rp_gold_ledger",
      columns: [
        t("S.NO"), t("PLEDG NO"), t("Bank Name"), t("RP PLEDG NO"), 
        t("RP GOLD C"), t("RP GOLD D"), t("INTEREST"),
      ],
      keys: [
        "sno", "pledge_no", "bank_name", "rp_pledge_no", "rp_gold_c", "rp_gold_d", "rp_gold_i"
      ],
      numericColumns: ["rp_gold_c", "rp_gold_d", "rp_gold_i"],
      rowMapper: (row, index) => [
        index + 1, row.pledge_no, row.bank_name, row.rp_pledge_no, 
        row.rp_gold_c, row.rp_gold_d, row.rp_gold_i,
      ],
    },
    "SLIVER LEDGER": {
      title: "SLIVER LEDGER",
      action: "sliver_ledger",
      columns: [
        t("S.NO"), t("PLEDG NO"), t("SLIVER C"), t("SLIVER C I"), 
        t("SLIVER D"), t("MONTHS"), t("SD I"),
      ],
      keys: [
        "sno", "pledge_no", "silver_c", "sc_interest", "silver_d", "months", "sd_interest"
      ],
      numericColumns: [
        "silver_c", "sc_interest", "silver_d", "months", "sd_interest",
      ],
      rowMapper: (row, index) => [
        index + 1, row.pledge_no, row.silver_c, row.sc_interest, 
        row.silver_d, row.months, row.sd_interest,
      ],
    },
    "EXPENSE LEDGER": {
      title: "EXPENSE LEDGER",
      action: "expense_ledger",
      columns: [t("EXPENSE TYPE"), t("EXPENSE VALUE")],
      keys: ["expense_name", "expense"],
      numericColumns: ["expense"],
      rowMapper: (row) => [row.expense_name, row.expense],
    },
    "CASH LEDGER": {
      title: "CASH LEDGER",
      action: "cash_ledger",
      columns: [t("CASH TYPE"), t("CASH VALUE")],
      keys: ["expense_name", "cash"],
      numericColumns: ["cash"],
      rowMapper: (row) => [row.expense_name, row.cash], 
    },
  };

  const currentConfig = tableConfig[selectedView] || {};
  const currentKeys = currentConfig.keys || [];
  
  // --- MRT Column Definition ---
  const columns = useMemo(() => {
    if (!currentConfig.columns || currentConfig.columns.length === 0) return [];

    return currentConfig.columns.map((header, index) => {
      const accessorKey = currentKeys[index];
      const isNumeric = currentConfig.numericColumns && currentConfig.numericColumns.includes(accessorKey);
      
      return {
        accessorKey: accessorKey,
        header: header,
        size: isNumeric ? 120 : (accessorKey === 'expense_name' || accessorKey === 'pledge_no' ? 200 : 100),
        
        Cell: ({ row, cell }) => {
          const rawValue = cell.getValue();
          
          if (accessorKey === 'sno') {
              return row.index + 1;
          }

          const displayValue = isNumeric ? formatValue(rawValue) : rawValue;

          return (
            <Typography 
              variant="body2" 
              sx={{ textAlign: isNumeric ? 'right' : 'left' }}
            >
              {displayValue}
            </Typography>
          );
        },
        enableSorting: accessorKey !== 'sno' && accessorKey !== 'date',
        enableColumnFilter: accessorKey !== 'sno',
        
        muiTableBodyCellProps: {
          align: isNumeric ? 'right' : (accessorKey === 'sno' ? 'center' : 'left'),
        },
        muiTableHeadCellProps: {
          align: isNumeric ? 'right' : (accessorKey === 'sno' ? 'center' : 'left'),
          minWidth: isNumeric ? 120 : (accessorKey === 'expense_name' || accessorKey === 'pledge_no' ? 200 : 100),
        },
      };
    });
  }, [selectedView, t, currentConfig, currentKeys]);


  const fetchReportData = async () => {
    setLoading(true);
    setError(null);
    if (!tableConfig[selectedView]) {
        setLoading(false);
        return;
    }
    try {
      const response = await axios.post(`${API_DOMAIN}/account_report.php`, {
        action: tableConfig[selectedView].action,
        fromDate: fromDate || null,
        toDate: toDate || null,
      });
      if (response.data.head.code === 200) {
        setReportData(response.data.body.data || []);
        setTotals(response.data.body.totals || {});
      } else {
        setError(response.data.head.msg);
        setReportData([]);
        setTotals({});
      }
    } catch (err) {
      setError("Failed to fetch data from server");
      setReportData([]);
      setTotals({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [selectedView, fromDate, toDate]);

  const clearFilter = () => {
    setFromDate("");
    setToDate("");
  };

  const exportToExcel = () => {
    if (reportData.length === 0) {
        alert(t("No data available to export."));
        return;
    }
    const config = tableConfig[selectedView];
    const headerRow = config.columns;
    
    // Prepare data rows
    let worksheetData = reportData.map((row, index) => {
        const rowObject = {};
        const mappedRow = config.rowMapper(row, index); 
        headerRow.forEach((header, i) => {
            const accessorKey = config.keys[i];
            const isNumeric = config.numericColumns.includes(accessorKey);
            let value = mappedRow[i];
            
            if (isNumeric && typeof value !== 'string') {
                value = formatValue(value);
            }
            rowObject[header] = value;
        });
        return rowObject;
    });

    // Add totals row
    const totalsRow = {
        ...totals,
        date: "Total",
        gold_type: "Total",
        expense_name: "Total",
        pledge_no: "Total",
        sno: "Total",
    };
    
    const totalRowObject = {};
    
    headerRow.forEach((header, i) => {
        const accessorKey = config.keys[i];
        const isNumeric = config.numericColumns.includes(accessorKey);
        let totalValue;

        if (isNumeric) {
           totalValue = formatValue(totals[accessorKey] || 0); 
        } else if (i === 0) {
           totalValue = t("Total"); 
        } else {
           totalValue = "";
        }
        
        totalRowObject[header] = totalValue;
    });
    
    worksheetData.push(totalRowObject);

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, config.title);

    const excelBuffer = XLSX.write(workbook, {
      type: "array",
      bookType: "xlsx",
    });
    const dataBlob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(dataBlob, `${config.title}.xlsx`);
  };

  const config = tableConfig[selectedView];
  const handleViewChange = (newView) => {
    setLoading(true);
    setReportData([]);
    setTotals({});
    setSelectedView(newView);
  };

  // --- Custom Footer for Material React Table (Totals Row) ---
  const renderTotalsFooter = ({ table }) => {
    if (reportData.length === 0 || !currentConfig.rowMapper) return null;

    return (
        <TableFooter sx={{ backgroundColor: '#f0f0f0', borderTop: '2px solid #ccc' }}>
            <TableRow>
                {currentConfig.keys.map((accessorKey, i) => {
                    const isNumeric = currentConfig.numericColumns.includes(accessorKey);
                    
                    let textAlign = 'left';
                    if (isNumeric) textAlign = 'right';
                    if (i === 0) textAlign = 'center'; 

                    let displayValue = '';
                    if (isNumeric) {
                        displayValue = formatValue(totals[accessorKey] || 0);
                    } else if (i === 0) {
                        displayValue = t("Total");
                    }
                    
                    return (
                        <TableCell 
                            key={`total-${i}`} 
                            sx={{ 
                                fontWeight: 'bold', 
                                textAlign: textAlign,
                                minWidth: columns[i] ? columns[i].size : '100px', 
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


  return (
    <div className="daily-report-container">
      <h2>
        {config?.title === "" ? " " : config?.title ?? t("Default Title")}
      </h2>

      <div className="filter-container">
        {/* Date Filters (Simplified: FINAL REPORT check removed) */}
        <div className="filter-group mb-3">
          <label htmlFor="fromDate" className="form-label">{t("From Date")}:</label>
          <input
            type="date"
            id="fromDate"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="filter-group mb-3">
          <label htmlFor="toDate" className="form-label">{t("To Date")}:</label>
          <input
            type="date"
            id="toDate"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="form-control"
          />
        </div>
        <button className="clear-button" onClick={clearFilter}>
          {t("Clear Filter")}
        </button>
      </div>

      <select
        className="form-select mb-4"
        onChange={(e) => handleViewChange(e.target.value)}
        value={selectedView}
      >
        {/* Dropdown now only contains keys from tableConfig */}
        {Object.keys(tableConfig).map((key) => (
          <option key={key} value={key}>
           {t(key)}
          </option>
        ))}
      </select>

      {reportData.length > 0 && (
        <div className="export-buttons">
          <PDFDownloadLink
            document={
              <ReportPDF config={config} data={reportData} totals={totals} />
            }
            fileName={`${config.title}.pdf`}
            className="pdf-download-link"
          >
            {({ loading }) => (loading ? "Generating PDF..." : "Download PDF")}
          </PDFDownloadLink>

          <button onClick={exportToExcel} className="excel-button">
            {t("Download Excel")}
          </button>
        </div>
      )}

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      {/* --- Material React Table (Unconditional for the remaining views) --- */}
      <MaterialReactTable
        columns={columns}
        data={reportData}
        state={{ isLoading: loading }}
        enableSorting
        enableColumnFilters
        enableGlobalFilter
        enablePagination
        enableDensityToggle={false}
        enableFullScreenToggle={false}
        enableHiding={false}
        initialState={{ density: 'compact' }}
        localization={{
            noRecordsFound: t('No data available for the selected date range'),
        }}
        muiTablePaperProps={{
          elevation: 0,
          sx: {
            border: '1px solid #dee2e6',
          },
        }}
        muiTableHeadCellProps={{
          sx: {
            backgroundColor: '#343a40',
            color: 'white',
            fontWeight: 'bold',
          },
        }}
        renderBottomToolbarCustomActions={renderTotalsFooter}
      />
    </div>
  );
};

export default DailyReport;