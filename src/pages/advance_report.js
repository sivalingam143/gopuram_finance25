import React, { useState, useEffect } from "react";
import API_DOMAIN from "../config/config";
import "./advance_report.css"; // Assuming you have a CSS file for additional styles
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { PDFDownloadLink } from "@react-pdf/renderer";
import AdvanceReportPDF from "./AdvanceReportPDF";
import { useLanguage } from "../components/LanguageContext";

const AdvanceReport = () => {
  const { t } = useLanguage();
  const todayStr = new Date().toISOString().split("T")[0];
  const [reportType, setReportType] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
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
            status: "closing",
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
        baseRow["Interest"] = parseFloat(item.interestRateLabel || 0).toFixed(
          2
        );
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

  const formatDate = (date) => {
    if (!date) return "—"; // Return a placeholder if no date is provided
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Styles
  const containerStyle = {
    maxWidth: "1000px",
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

      {/* Filters */}
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

      {/* Table */}
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>{t("Serial No")}</th>
            <th style={thStyle}>{t("Date")}</th>
            <th style={thStyle}>{t("Loan No")}</th>
            <th style={thStyle}>{t("Name")}</th>
            {reportType === "interest" ? (
              <>
                <th style={thStyle}>{t("Interest Amount")} (₹)</th>
              </>
            ) : (
              <>
                <th style={thStyle}>{t("Total Weight")} (g)</th>
                <th style={thStyle}>{t("Net Weight")} (g)</th>
                <th style={thStyle}>{t("Interest Rate")}</th>
                <th style={thStyle}>{t("Amount")} (₹)</th>
              </>
            )}
            <th style={thStyle}>{t("Status")}</th>
          </tr>
        </thead>
        <tbody>
          {reportData.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ ...tdStyle, textAlign: "center" }}>
               {t("No data available")}
              </td>
            </tr>
          ) : (
            reportData.map((item, index) => (
              <tr key={index}>
                <td style={tdStyle}>{index + 1}</td>
                <td style={tdStyle}>
                  {reportType === "interest"
                    ? formatDate(item.interest_receive_date)
                    : reportType === "closing"
                    ? formatDate(item.pawnjewelry_recovery_date)
                    : formatDate(item.pawnjewelry_date)}
                </td>
                <td style={tdStyle}>{item.loanNo}</td>
                <td style={tdStyle}>{item.name}</td>
                {reportType === "interest" ? (
                  <>
                    <td style={tdStyle}>
                      {typeof item.interestAmount === "number"
                        ? item.interestAmount.toFixed(2)
                        : "0.00"}
                    </td>
                  </>
                ) : (
                  <>
                    {reportType !== "interest" && (
                      <>
                        <td style={tdStyle}>{item.totalWeight ?? "—"}</td>
                        <td style={tdStyle}>{item.totalnetWeight ?? "—"}</td>
                        <td style={tdStyle}>{item.interestRateLabel ?? "—"}</td>
                        <td style={tdStyle}>
                          {item.totalAmount != null
                            ? parseFloat(item.totalAmount).toLocaleString()
                            : "—"}
                        </td>
                      </>
                    )}
                  </>
                )}
                <td style={tdStyle}>{item.status}</td>
              </tr>
            ))
          )}
        </tbody>
        {reportData.length > 0 && (
          <tfoot>
            <tr>
              <td
                colSpan="4"
                style={{ ...tdStyle, fontWeight: "bold", textAlign: "right" }}
              >
                {t("Total")}
              </td>
              {reportType === "interest" ? (
                <>
                  <td style={{ ...tdStyle, fontWeight: "bold" }}>
                    {reportData
                      .reduce(
                        (sum, item) =>
                          sum + parseFloat(item.interestAmount || 0),
                        0
                      )
                      .toFixed(2)}
                  </td>
                </>
              ) : (
                <>
                  <td style={{ ...tdStyle, fontWeight: "bold" }}>
                    {totalWeight.toFixed(2)}
                  </td>
                  <td style={{ ...tdStyle, fontWeight: "bold" }}>
                    {totalnetWeight.toFixed(2)}
                  </td>
                  <td style={{ ...tdStyle, fontWeight: "bold" }}></td>
                  <td style={{ ...tdStyle, fontWeight: "bold" }}>
                    {totalAmount.toLocaleString()}
                  </td>
                </>
              )}
              <td></td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
};

export default AdvanceReport;
