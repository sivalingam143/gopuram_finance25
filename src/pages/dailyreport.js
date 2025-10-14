import React, { useState, useEffect } from "react";
import axios from "axios";
import API_DOMAIN from "../config/config";
import "./DailyReport.css";
import ReportPDF from "./dailyreportPdf";
import { PDFDownloadLink } from "@react-pdf/renderer";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const DailyReport = () => {
  const [selectedView, setSelectedView] = useState("FINAL SHEET");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reportData, setReportData] = useState([]);
  const [totals, setTotals] = useState({});
  console.log(reportData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const tableConfig = {
    "FINAL SHEET": {
      title: "Financial Report",
      action: "daily_final_sheet",
      columns: [
        "Date",
        "GOLD C",
        "GOLD D",
        "GOLD I",
        "SLIVER C",
        "SLIVER D",
        "SLIVER I",
        "RP GOLD C",
        "RP GOLD D",
        "RP GOLD I",
        "EXPENSE",
        "CASH",
        "START BAL",
        "END BAL",
        "RESULT",
      ],
      numericColumns: [
        "gold_c",
        "gold_d",
        "gold_i",
        "sliver_c",
        "sliver_d",
        "sliver_i",
        "rp_gold_c",
        "rp_gold_d",
        "rp_gold_i",
        "expense",
        "cash",
        "start_bal",
        "end_bal",
        "result",
      ],
      rowMapper: (row) => [
        row.date,
        row.gold_c,
        row.gold_d,
        row.gold_i,
        row.silver_c,
        row.silver_d,
        row.silver_i,
        row.rp_gold_c,
        row.rp_gold_d,
        row.rp_gold_i,
        row.expense,
        row.cash,
        row.start_bal,
        row.end_bal,
        row.result,
      ],
    },
  //   "FINAL REPORT": {
  //   title: "MONTH FINAL REPORT",
  //   action: "final_report",
  //   columns: [
  //     "Month",
  //     "GOLD C",
  //     "GOLD D",
  //     "GOLD I",
  //     "SLIVER C",
  //     "SLIVER D",
  //     "SLIVER I",
  //     "RP GOLD C",
  //     "RP GOLD D",
  //     "RP GOLD I",
  //     "EXPENSE",
  //     "CASH",
  //     "START BAL",
  //     "END BAL",
  //     "RESULT",
  //     "TOTAL CREDIT",
  //     "TOTAL DEBIT",
  //   ],
  //   numericColumns: [
  //     "gold_c",
  //     "gold_d",
  //     "gold_i",
  //     "silver_c",
  //     "silver_d",
  //     "silver_i",
  //     "rp_gold_c",
  //     "rp_gold_d",
  //     "rp_gold_i",
  //     "expense",
  //     "cash",
  //     "start_bal",
  //     "end_bal",
  //     "result",
  //     "total_credit",
  //     "total_debit",
  //   ],
  //   rowMapper: (row) => [
  //     row.month || `${fromDate} ${toDate}`, // Use fromDate and toDate for display
  //     row.gold_c,
  //     row.gold_d,
  //     row.gold_i,
  //     row.silver_c,
  //     row.silver_d,
  //     row.silver_i,
  //     row.rp_gold_c,
  //     row.rp_gold_d,
  //     row.rp_gold_i,
  //     row.expense,
  //     row.cash,
  //     row.start_bal,
  //     row.end_bal,
  //     row.result,
  //     row.total_credit,
  //     row.total_debit,
  //   ],
  // },
    "GOLD LEDGER": {
      title: "GOLD LEDGER",
      action: "gold_ledger",
      columns: [
        "S.NO",
        "GOLD TYPE",
        "GOLD PLEDG NO",
        "GOLD C",
        "GC I",
        "G D",
        "MONTHS",
        "GD INTEREST",
      ],
      numericColumns: [
        "gold_c",
        "gc_interest",
        "gold_d",
        "months",
        "gd_interest",
      ],
      rowMapper: (row, index) => [
        index + 1,
        row.gold_type,
        row.pledge_no,
        row.gold_c,
        row.gc_interest,
        row.gold_d,
        row.months,
        row.gd_interest,
      ],
    },
    "RP GOLD LEDGER": {
      title: "RP GOLD LEDGER",
      action: "rp_gold_ledger",
      columns: [
        "S.NO",
        "PLEDG NO",
        "Bank Name",
        "RP PLEDG NO",
        "RP GOLD C",
        "RP GOLD D",
        "INTEREST",
      ],
      numericColumns: ["rp_gold_c", "rp_gold_d", "rp_gold_i"],
      rowMapper: (row, index) => [
        index + 1,
        row.pledge_no,
        row.bank_name,
        row.rp_pledge_no,
        row.rp_gold_c,
        row.rp_gold_d,
        row.rp_gold_i,
      ],
    },
    "SLIVER LEDGER": {
      title: "SLIVER LEDGER",
      action: "sliver_ledger",
      columns: [
        "S.NO",
        "PLEDG NO",
        "SLIVER C",
        "SLIVER C I",
        "SLIVER D",
        "MONTHS",
        "SD I",
      ],
      numericColumns: [
        "sliver_c",
        "sliver_i",
        "sliver_d",
        "sliver_ledger_month",
        "sliver_debit_interest",
      ],
      rowMapper: (row, index) => [
        index + 1,
        row.pledge_no,
        row.silver_c,
        row.sc_interest,
        row.silver_d,
        row.months,
        row.sd_interest,
      ],
    },
    "EXPENSE LEDGER": {
      title: "EXPENSE LEDGER",
      action: "expense_ledger",
      columns: ["EXPENSE TYPE", "EXPENSE VALUE"],
      numericColumns: ["expense"],
      rowMapper: (row) => [row.expense_name, row.expense],
    },
    "CASH LEDGER": {
      title: "CASH LEDGER",
      action: "cash_ledger",
      columns: ["CASH TYPE", "CASH VALUE"],
      numericColumns: ["cash"],
      rowMapper: (row) => [row.expense_name, row.expense],
    },
  };

  const fetchReportData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_DOMAIN}/account_report.php`, {
        action: tableConfig[selectedView].action,
        fromDate: fromDate ? formatDateToYYYYMMDD(fromDate) : null,
        toDate: toDate ? formatDateToYYYYMMDD(toDate) : null,
      });
      if (response.data.head.code === 200) {
        setReportData(response.data.body.data);
        setTotals(response.data.body.totals);
      } else {
        setError(response.data.head.msg);
      }
    } catch (err) {
      setError("Failed to fetch data from server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [selectedView, fromDate, toDate]);

  const formatDateToYYYYMMDD = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${year}-${month}-${day}`;
  };

  const clearFilter = () => {
    setFromDate("");
    setToDate("");
  };

  const exportToExcel = () => {
    const config = tableConfig[selectedView];
    const worksheetData = reportData.map((row, index) => {
      const mappedRow = config.rowMapper(row, index);
      const rowObj = {};
      config.columns.forEach((col, i) => {
        rowObj[col] = mappedRow[i];
      });
      return rowObj;
    });

    const totalRow = {};
    const mappedTotals = config.rowMapper(
      { ...totals, date: "Total", expense_type: "Total", cash_type: "Total" },
      -1
    );
    config.columns.forEach((col, i) => {
      totalRow[col] = mappedTotals[i];
    });
    worksheetData.push(totalRow);

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
  setLoading(true);           // Immediately show loader
  setReportData([]);          // Clear old data
  setTotals({});              // Clear old totals
  setSelectedView(newView);   // Update view, which triggers useEffect
};

  return (
    <div className="daily-report-container">
   <h2>{config?.title === "" ? " " : config?.title ?? "Default Title"}</h2>


      <div className="filter-container">
        {selectedView === "FINAL REPORT" ? (
          <>
            <div className="filter-group">
              <label>Month:</label>
              <select
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="form-select"
              >
                <option value="">Select Month</option>
                {[
                  "January",
                  "February",
                  "March",
                  "April",
                  "May",
                  "June",
                  "July",
                  "August",
                  "September",
                  "October",
                  "November",
                  "December",
                ].map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>Year:</label>
              <input
                type="number"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="date-input"
                placeholder="Enter Year"
              />
            </div>
            <button className="clear-button" onClick={clearFilter}>
              Clear Filter
            </button>
          </>
        ) : (
          <>
            <div className="filter-group">
              <label htmlFor="fromDate">From Date:</label>
              <input
                type="date"
                id="fromDate"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="date-input"
              />
            </div>
            <div className="filter-group">
              <label htmlFor="toDate">To Date:</label>
              <input
                type="date"
                id="toDate"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="date-input"
              />
            </div>
            <button className="clear-button" onClick={clearFilter}>
              Clear Filter
            </button>
          </>
        )}
      </div>

     <select
  className="form-select"
  onChange={(e) => handleViewChange(e.target.value)}
  value={selectedView}
>
  {Object.keys(tableConfig).map((key) => (
    <option key={key} value={key}>
      {key}
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
            Download Excel
          </button>
        </div>
      )}

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      {selectedView === "FINAL REPORT" && (
        <div className="final-report-table mt-30">
          <h3 className="report-heading">
            MONTH FINAL SHEET {fromDate?.toUpperCase()} {toDate}
          </h3>
          {reportData.length > 0 ? (
            <>
              <table className="financial-table">
                <tbody>
                  <tr>
                    <td>
                      <strong>START BALANCE</strong>
                    </td>
                    <td className="text-red">
                      <strong>{totals.start_bal}</strong>
                    </td>
                    <td>
                      <strong>END BALANCE</strong>
                    </td>
                    <td className="text-red">
                      <strong>{totals.end_bal}</strong>
                    </td>
                    <td>
                      <strong>DAY RESULT</strong>
                    </td>
                    <td className="text-red">
                      <strong>{totals.result}</strong>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="report-flex">
                <div className="credit-section">
                  <h4 className="text-red">CREDIT</h4>
                  <table className="financial-table">
                    <tbody>
                      <tr>
                        <td>GOLD CREDIT</td>
                        <td className="text-red">{totals.gold_c}</td>
                      </tr>
                      <tr>
                        <td>SILVER CREDIT</td>
                        <td className="text-red">{totals.silver_c}</td>
                      </tr>
                      <tr>
                        <td>RP GOLD DEBIT</td>
                        <td className="text-red">{totals.rp_gold_d}</td>
                      </tr>
                      <tr>
                        <td>RP GOLD INTEREST</td>
                        <td className="text-red">{totals.rp_gold_i}</td>
                      </tr>
                      <tr>
                        <td>EXPENSE</td>
                        <td className="text-red">{totals.cash}</td>
                      </tr>
                      <tr>
                        <td className="bg-yellow">
                          <strong>MONTH CREDIT</strong>
                        </td>
                        <td className="bg-yellow">
                          <strong>{totals.total_credit}</strong>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="debit-section">
                  <h4 className="text-green">DEBIT</h4>
                  <table className="financial-table">
                    <tbody>
                      <tr>
                        <td>GOLD DEBIT</td>
                        <td className="text-red">{totals.gold_d}</td>
                      </tr>
                      <tr>
                        <td>GOLD INTEREST</td>
                        <td className="text-red">{totals.gold_i}</td>
                      </tr>
                      <tr>
                        <td>SILVER DEBIT</td>
                        <td className="text-red">{totals.silver_d}</td>
                      </tr>
                      <tr>
                        <td>SILVER INTEREST</td>
                        <td className="text-red">{totals.silver_i}</td>
                      </tr>
                      <tr>
                        <td>RP GOLD CREDIT</td>
                        <td className="text-red">{totals.rp_gold_c}</td>
                      </tr>
                      <tr>
                        <td>ADD ON</td>
                        <td className="text-red">{totals.expense}</td>
                      </tr>
                      <tr>
                        <td className="bg-yellow">
                          <strong>MONTH DEBIT</strong>
                        </td>
                        <td className="bg-yellow">
                          <strong>{totals.total_debit}</strong>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <p>No data available for the selected month and year</p>
          )}
        </div>
      )}

      {selectedView !== "FINAL REPORT" && (
        <table className="financial-table">
          <thead>
           <tr>
  {config?.columns && Array.isArray(config.columns)
    ? config.columns.map((col, i) => <th key={i}>{col}</th>)
    : null}
</tr>

          </thead>
          <tbody>
            {reportData.length > 0 ? (
              reportData.map((row, index) => (
                <tr key={index}>
                  {config.rowMapper(row, index).map((cell, i) => (
                    <td key={i}>{cell}</td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={config?.columns.length} className="no-data">
                  No data available for the selected date range
                </td>
              </tr>
            )}
          </tbody>
          {reportData.length > 0 && (
            <tfoot>
              <tr className="total-row">
                {config
                  .rowMapper(
                    {
                      ...totals,
                      date: "Total",
                      expense_type: "Total",
                      cash_type: "Total",
                    },
                    -1
                  )
                  .map((total, i) => (
                    <td key={i}>
                      {config.columns[i] === "S.NO" && total === 0
                        ? "Total"
                        : total}
                    </td>
                  ))}
              </tr>
            </tfoot>
          )}
        </table>
      )}
    </div>
  );
};

export default DailyReport;
