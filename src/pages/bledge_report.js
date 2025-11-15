import React, { useState, useEffect } from "react";
import API_DOMAIN from "../config/config";
import Papa from "papaparse";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "bootstrap/dist/css/bootstrap.min.css";
import "./BankPledgeReport.css";
import dayjs from "dayjs";
import { useLanguage } from "../components/LanguageContext";

const BankPledgeReport = () => {
  const { t } = useLanguage();
  const [reportData, setReportData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  // Fetch data from API
  const fetchReportData = async () => {
    try {
      const response = await fetch(`${API_DOMAIN}/pawnjewelry.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ search_text: "" }),
      });
      const responseData = await response.json();

      if (responseData.head.code === 200) {
        const data = responseData.body.pawnjewelry.map((item, index) => ({
          sNo: index + 1,
          date: item.pawnjewelry_date
            ? item.pawnjewelry_date.split(" ")[0]
            : "-",
          loanNo: item.receipt_no || "-",
          name: item.name || "-",
          bankPledgeDate: item.bank_pledge_date || "-",
          bankAssessorName: item.bank_assessor_name || "-",
          bankName: item.bank_name || "-",
          interest: item.bank_interest || "-",
          loanAmount: item.bank_pawn_value || "-",
          duedate: item.bank_duration ? item.bank_duration.split(" ")[0] : "-",
          additionalCharges: item.bank_additional_charges || "-",
          location: item.location || "-",
          status: item.status || "-",
        }));
        setReportData(data);
        applyFilters(data, fromDate, toDate, statusFilter);
      } else {
        console.error("API Error:", responseData.head.message);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  };

  // Apply filters and sorting
  const applyFilters = (data, from, to, status) => {
    let filtered = [...data];

    // Date range filter
    if (from && to) {
      const startDate = new Date(from + "T00:00:00");
      const endDate = new Date(to + "T23:59:59.999");
      filtered = filtered.filter((item) => {
        const recordDate = new Date(item.date);
        return recordDate >= startDate && recordDate <= endDate;
      });
    }

    // Status filter
    if (status !== "All") {
      filtered = filtered.filter((item) =>
        status === "Outstanding"
          ? item.status === "நகை மீட்கபடவில்லை"
          : item.status === "நகை மீட்கபட்டது"
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key] || "";
        const bValue = b[sortConfig.key] || "";
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    setFilteredData(filtered);
    setCurrentPage(1); // Reset to first page after filtering
  };

  // Handle sorting
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    applyFilters(reportData, fromDate, toDate, statusFilter);
  };

  // Handle filter changes
  const handleFilterChange = () => {
    applyFilters(reportData, fromDate, toDate, statusFilter);
  };

  // Export to CSV
  const exportToCSV = () => {
    const csvData = filteredData.map((row) => ({
      "S.No": row.sNo,
      Date: row.date,
      "Loan No": row.loanNo,
      Name: row.name,
      "Bank Pledge Date": row.bankPledgeDate,
      "Bank Assessor Name": row.bankAssessorName,
      "Bank Name": row.bankName,
      Interest: row.interest,
      "Loan Amount": row.loanAmount,
      duedate: row.duedate,
      "Additional Charges": row.additionalCharges,
      Location: row.location,
    }));
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "bank_pledge_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF({ orientation: "landscape" }); // Landscape orientation
    doc.setFontSize(16);
    doc.text("Bank Pledge Report", 14, 20);
    doc.autoTable({
      startY: 30,
      head: [
        [
          "S.No",
          "Date",
          "Loan No",
          "Name",
          "Bank Pledge Date",
          "Bank Assessor Name",
          "Bank Name",
          "Interest",
          "Loan Amount",
          "Due Date",
          "Additional Charges",
          "Location",
        ],
      ],
      body: filteredData.map((row) => [
        row.sNo,
        row.date,
        row.loanNo,
        row.name,
        row.bankPledgeDate,
        row.bankAssessorName,
        row.bankName,
        row.interest,
        row.loanAmount,
        row.duedate,
        row.additionalCharges,
        row.location,
      ]),
      theme: "grid",
      styles: {
        fontSize: 10,
        cellPadding: 3,
        textColor: [33, 37, 41],
        lineColor: [200, 200, 200],
      },
      headStyles: {
        fillColor: [108, 117, 125],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });
    doc.save("bank_pledge_report.pdf");
  };

  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredData.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const totalPages = Math.ceil(filteredData.length / recordsPerPage);

  // Fetch data on mount
  useEffect(() => {
    fetchReportData();
  }, []);

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4 text-3xl font-bold text-dark">
        {t("Bank Pledge Report")}
      </h2>

      {/* Filters */}
      <div className="filter-card mb-4 row g-3 align-items-end">
        <div className="col-md-3">
          <label className="form-label fw-semibold">{t("From Date")}</label>
          <input
            type="date"
            className="form-control"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <label className="form-label fw-semibold">{t("To Date")}</label>
          <input
            type="date"
            className="form-control"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <label className="form-label fw-semibold">{t("Status")}</label>
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">{t("All")}</option>
            <option value="Outstanding">{t("Outstanding")}</option>
            <option value="Closed">{t("Closed")}</option>
          </select>
        </div>
        <div className="col-md-3">
          <button className="btn-cus" onClick={handleFilterChange}>
            {t("Apply Filters")}
          </button>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="mb-3 d-flex gap-2">
        <button onClick={exportToCSV} className="btn-cus">
          {t("Export to CSV")}
        </button>
        <button onClick={exportToPDF} className="btn-cus">
          {t("Export to PDF")}
        </button>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover table-striped">
          <thead className="table-dark">
            <tr>
              {[
                "sNo",
                "date",
                "loanNo",
                "name",
                "bankPledgeDate",
                "bankAssessorName",
                "bankName",
                "interest",
                "loanAmount",
                "duedate",
                "additionalCharges",
                "location",
              ].map((key) => (
                <th
                  key={key}
                  onClick={() => handleSort(key)}
                  className="p-3 text-left cursor-pointer sort-header"
                >
                  {key === "sNo"
                    ? t("S.No")
                    : key === "date"
                    ? t("Date")
                    : key === "loanNo"
                    ? t("Loan No")
                    : key === "name"
                    ? t("Name")
                    : key === "bankPledgeDate"
                    ? t("Bank Pledge Date")
                    : key === "bankAssessorName"
                    ? t("Bank Assessor Name")
                    : key === "bankName"
                    ? t("Bank Name")
                    : key === "interest"
                    ? t("Interest")
                    : key === "loanAmount"
                    ? t("Loan Amount")
                    : key === "duedate"
                    ? t("Due date")
                    : key === "location"
                    ? t("Loan No") // Note: This key seems to map to "Loan No" again.
                    : t("Additional Charges")}
                  {sortConfig.key === key ? (
                    <span className="ms-2">
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  ) : null}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentRecords.length > 0 ? (
              currentRecords.map((row) => (
                <tr key={row.sNo}>
                  <td className="p-3">{row.sNo}</td>
                  <td className="p-3">{row.date}</td>
                  <td className="p-3">{row.loanNo}</td>
                  <td className="p-3">{row.name}</td>
                  <td className="p-3">
                    {dayjs(row.bankPledgeDate).format("DD-MM-YYYY")}
                  </td>
                  <td className="p-3">{row.bankAssessorName}</td>
                  <td className="p-3">{row.bankName}</td>
                  <td className="p-3">{row.interest}</td>
                  <td className="p-3">{row.loanAmount}</td>
                  <td className="p-3">{row.duedate}</td>
                  <td className="p-3">{row.additionalCharges}</td>
                  <td className="p-3">{row.location}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="p-3 text-center text-muted">
                  {t("No data available")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="d-flex justify-content-between align-items-center mt-4">
        <span className="text-muted">
          {t("Showing")} {indexOfFirstRecord + 1} {t("to")}{" "}
          {Math.min(indexOfLastRecord, filteredData.length)} of{" "}
          {filteredData.length} {t("records")}
        </span>
        <nav>
          <ul className="pagination mb-0">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="btn-cus"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              >
               {t("Previous")}
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => (
              <li
                key={i + 1}
                className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
              >
                <button
                  className="btn-cus"
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              </li>
            ))}
            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <button
                className="btn-cus"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
              >
              {t("Next")}
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default BankPledgeReport;
