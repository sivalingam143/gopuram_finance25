import React, { useState, useEffect, useMemo } from "react";
import API_DOMAIN from "../config/config";
import Papa from "papaparse";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "bootstrap/dist/css/bootstrap.min.css";
import "./BankPledgeReport.css";
import dayjs from "dayjs";
import { useLanguage } from "../components/LanguageContext";
// ⬇️ Material React Table Imports
import { MaterialReactTable } from 'material-react-table';
import { Box, Typography } from '@mui/material';


const BankPledgeReport = () => {
  const { t } = useLanguage();
  const [reportData, setReportData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  // Custom sorting and pagination states removed, as MRT handles them
  // const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  // const [currentPage, setCurrentPage] = useState(1);
  // const recordsPerPage = 10;

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

  // Apply filters (No longer applies sorting or pagination)
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

    setFilteredData(filtered);
    // Removed: setCurrentPage(1); // MRT handles page reset
  };

  // Removed: handleSort function, MRT handles sorting.

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
      Status: row.status,
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
          "Status"
        ],
      ],
      body: filteredData.map((row) => [
        row.sNo,
        row.date,
        row.loanNo,
        row.name,
        dayjs(row.bankPledgeDate).format("DD-MM-YYYY"), // Apply formatting
        row.bankAssessorName,
        row.bankName,
        row.interest,
        row.loanAmount,
        row.duedate,
        row.additionalCharges,
        row.location,
        row.status
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

  // Removed: Pagination logic

  // Fetch data on mount
  useEffect(() => {
    fetchReportData();
  }, []);
  
  // ⬇️ Material React Table Columns Definition
  const columns = useMemo(() => [
    {
      accessorKey: 'sNo',
      header: t('S.No'),
      size: 50,
      enableColumnFilter: false,
    },
    {
      accessorKey: 'date',
      header: t('Date'),
       muiTableBodyCellProps: { align: 'center' },
          muiTableHeadCellProps: { align: 'left' },
      size: 100,
       Cell: ({ cell }) =>
              cell.getValue() ? dayjs(cell.getValue()).format("DD-MM-YYYY") : "-", // YYYY-MM-DD is ISO, so no change needed
        
    },
    {
      accessorKey: 'loanNo',
      header: t('Loan No'),
       muiTableBodyCellProps: { align: 'center' },
          muiTableHeadCellProps: { align: 'left' },
      size: 100,
    },
    {
      accessorKey: 'name',
      header: t('Name'),
       muiTableBodyCellProps: { align: 'center' },
          muiTableHeadCellProps: { align: 'left' },
      size: 150,
    },
    {
      accessorKey: 'bankPledgeDate',
      header: t('Bank Pledge Date'),
       muiTableBodyCellProps: { align: 'center' },
          muiTableHeadCellProps: { align: 'left' },
      size: 120,
      Cell: ({ cell }) => (
        // Uses dayjs to format the date
        cell.getValue() !== '-' ? dayjs(cell.getValue()).format("DD-MM-YYYY") : 'Invalid Date'
      ),
    },
    {
      accessorKey: 'bankAssessorName',
      header: t('Bank Assessor Name'),
       muiTableBodyCellProps: { align: 'center' },
          muiTableHeadCellProps: { align: 'left' },
      size: 150,
    },
    {
      accessorKey: 'bankName',
      header: t('Bank Name'),
       muiTableBodyCellProps: { align: 'center' },
          muiTableHeadCellProps: { align: 'left' },
      size: 150,
    },
    {
      accessorKey: 'interest',
      header: t('Interest'),
       muiTableBodyCellProps: { align: 'center' },
          muiTableHeadCellProps: { align: 'left' },
      size: 80,
    },
    {
      accessorKey: 'loanAmount',
      header: t('Loan Amount'),
       muiTableBodyCellProps: { align: 'center' },
          muiTableHeadCellProps: { align: 'center' },
      size: 50,
     
    },
    {
      accessorKey: 'duedate',
      header: t('Due date'),
       muiTableBodyCellProps: { align: 'center' },
          muiTableHeadCellProps: { align: 'center' },
      size: 10,
      Cell: ({ cell }) => (
        // Uses dayjs to format the date
        cell.getValue() !== '-' ? dayjs(cell.getValue()).format("DD-MM-YYYY") : 'Invalid Date'
      ),
    },
    {
      accessorKey: 'additionalCharges',
      header: t('Additional Charges'),
       muiTableBodyCellProps: { align: 'center' },
          muiTableHeadCellProps: { align: 'center' },
      size: 20,
    },
    {
      accessorKey: 'location',
      header: t('Location'), 
      size: 100,
    },
    {
      accessorKey: 'status',
      header: t('Status'),
      size: 100,
    },
  ], [t]);


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

      {/* ⬇️ Material React Table */}
      <MaterialReactTable
        columns={columns}
        data={filteredData} // MRT automatically handles sorting and pagination on this data
        enableColumnActions={true}
        enableSorting={true}
        enableGlobalFilter={true}
        enableDensityToggle={false}
        enableFullScreenToggle={false}
        enableHiding={false}
        initialState={{ density: 'compact' }}
        localization={{
            noRecordsFound: t('No data available'),
            // Other localization settings can be added here
        }}
        // Adding styles to simulate Bootstrap's table-dark header and bordered table
        muiTablePaperProps={{
          elevation: 0,
          sx: {
            border: '1px solid #dee2e6', // table-bordered
          },
        }}
        muiTableHeadCellProps={{
          sx: {
            backgroundColor: '#343a40', // table-dark
            color: 'white',
          },
        }}
        
      />
      {/* ⬆️ End Material React Table */}

      {/* Custom pagination removed */}
    </div>
  );
};

export default BankPledgeReport;