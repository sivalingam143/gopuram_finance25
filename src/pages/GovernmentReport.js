import React, { useState, useEffect } from "react";
import API_DOMAIN from "../config/config";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { PDFDownloadLink } from "@react-pdf/renderer";
import GovernmentReportPDF from "./GovernmentReportPDF";

const GovernmentReport = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allData, setAllData] = useState([]);
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
        const result = responseData.body.reports || [responseData.body];
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

  const exportToExcel = () => {
    if (reportData.length === 0) {
      alert("No data to export");
      return;
    }

    // Prepare data rows
    let worksheetData = reportData.map((item, index) => ({
      "Serial No": index + 1,
      "Period Start Date": formatDate(item.period_start_date),
      "Receipt No": item.receipt_no,
      "Customer No": item.customer_no,
      Name: item.name,
      "Customer Details": item.customer_details,
      Place: item.place,
      "Mobile Number": item.mobile_number,
      "Date of Birth": item.dateofbirth ? formatDate(item.dateofbirth) : "—",
      "Principal (₹)": parseFloat(item.principal || 0).toLocaleString(),
      "Monthly Interest (₹)": parseFloat(item.monthly_interest || 0).toFixed(2),
      "Total Interest (₹)": parseFloat(item.total_interest || 0).toFixed(2),
      "Total Due (₹)": parseFloat(item.total_due || 0).toLocaleString(),
    }));

    // Calculate totals
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

    // Add total row
    const totalRow = {
      "Serial No": "",
      "Period Start Date": "",
      "Receipt No": "",
      "Customer No": "",
      Name: "Total",
      "Customer Details": "",
      Place: "",
      "Mobile Number": "",
      "Date of Birth": "",
      "Principal (₹)": totalPrincipal.toLocaleString(),
      "Monthly Interest (₹)": totalMonthlyInterest.toFixed(2),
      "Total Interest (₹)": totalInterest.toFixed(2),
      "Total Due (₹)": totalDue.toLocaleString(),
    };
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
  };

  const inputStyle = {
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

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "#fff",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  };

  const thStyle = {
    backgroundColor: "#f0f0f0",
    color: "#333",
    fontWeight: "bold",
    padding: "12px",
    borderBottom: "1px solid #ddd",
    textAlign: "left",
  };

  const tdStyle = {
    padding: "12px",
    borderBottom: "1px solid #eee",
  };

  // Calculate totals
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

  return (
    <div>
      <h1 style={{ fontSize: "24px", marginBottom: "10px", color: "#222" }}>
        Government Report
      </h1>

      {/* Search Filter */}
      <div style={filterContainerStyle}>
        <label style={labelStyle}>
          Search (Receipt No / Customer No)
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter Receipt No or Customer No..."
            style={inputStyle}
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
            onClick={fetchGovernmentData}
            disabled={loading}
          >
            {loading ? "Loading..." : "Refresh Data"}
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
                pdfLoading ? "Preparing PDF..." : "Download PDF"
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
              Export to Excel
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Serial No</th>
            <th style={thStyle}>Period Start Date</th>
            <th style={thStyle}>Receipt No</th>
            <th style={thStyle}>Customer No</th>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Customer Details</th>
            <th style={thStyle}>Place</th>
            <th style={thStyle}>Mobile Number</th>
            <th style={thStyle}>Date of Birth</th>
            <th style={thStyle}>Principal (₹)</th>
            <th style={thStyle}>Monthly Interest (₹)</th>
            <th style={thStyle}>Total Interest (₹)</th>
            <th style={thStyle}>Total Due (₹)</th>
          </tr>
        </thead>
        <tbody>
          {reportData.length === 0 ? (
            <tr>
              <td colSpan="13" style={{ ...tdStyle, textAlign: "center" }}>
                No data available
              </td>
            </tr>
          ) : (
            reportData.map((item, index) => (
              <tr key={index}>
                <td style={tdStyle}>{index + 1}</td>
                <td style={tdStyle}>{formatDate(item.period_start_date)}</td>
                <td style={tdStyle}>{item.receipt_no}</td>
                <td style={tdStyle}>{item.customer_no}</td>
                <td style={tdStyle}>{item.name}</td>
                <td style={tdStyle}>{item.customer_details}</td>
                <td style={tdStyle}>{item.place}</td>
                <td style={tdStyle}>{item.mobile_number}</td>
                <td style={tdStyle}>
                  {item.dateofbirth ? formatDate(item.dateofbirth) : "—"}
                </td>
                <td style={tdStyle}>
                  {parseFloat(item.principal || 0).toLocaleString()}
                </td>
                <td style={tdStyle}>
                  {parseFloat(item.monthly_interest || 0).toFixed(2)}
                </td>
                <td style={tdStyle}>
                  {parseFloat(item.total_interest || 0).toFixed(2)}
                </td>
                <td style={tdStyle}>
                  {parseFloat(item.total_due || 0).toLocaleString()}
                </td>
              </tr>
            ))
          )}
        </tbody>
        {reportData.length > 0 && (
          <tfoot>
            <tr>
              <td
                colSpan="9"
                style={{ ...tdStyle, fontWeight: "bold", textAlign: "right" }}
              >
                Total
              </td>
              <td style={{ ...tdStyle, fontWeight: "bold" }}>
                {totalPrincipal.toLocaleString()}
              </td>
              <td style={{ ...tdStyle, fontWeight: "bold" }}>
                {totalMonthlyInterest.toFixed(2)}
              </td>
              <td style={{ ...tdStyle, fontWeight: "bold" }}>
                {totalInterest.toFixed(2)}
              </td>
              <td style={{ ...tdStyle, fontWeight: "bold" }}>
                {totalDue.toLocaleString()}
              </td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
};

export default GovernmentReport;
