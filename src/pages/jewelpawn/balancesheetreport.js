import React, { useEffect, useState, useMemo } from "react";
import { Container, Button, Form, Row, Col, Modal } from "react-bootstrap";
import axios from "axios";
import { PDFDownloadLink } from "@react-pdf/renderer";
import BalanceSheetPDF from "./BalanceSheetPDF";
import API_DOMAIN from "../../config/config";
import "./BalanceSheet.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLanguage } from "../../components/LanguageContext";

// ⬇️ Material React Table Imports
import { MaterialReactTable } from "material-react-table";
import {
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
} from "@mui/material";
import { CalendarToday } from "@mui/icons-material";

const API_URL = `${API_DOMAIN}/balance.php`;

const BalanceSheet = () => {
  const { t } = useLanguage();
  const [balance, setBalance] = useState(0);
  const [entries, setEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");

  // Date Filter States
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  // Removed: const [expandedDate, setExpandedDate] = useState(null);

  useEffect(() => {
    fetchBalance();
    fetchEntries();
  }, []);

  const fetchBalance = async () => {
    try {
      const response = await axios.post(API_URL, { action: "get_balance" });
      if (response.data.head.code === 200) {
        setBalance(response.data.body.balance);
      }
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  const fetchEntries = async () => {
    try {
      const response = await axios.post(API_URL, {
        action: "list_transactions",
      });
      if (response.data.head.code === 200) {
        setEntries(response.data.body.transactions);
        setFilteredEntries(response.data.body.transactions); // Default to all entries
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  // Filter function
  const filterEntries = () => {
    if (!startDate || !endDate) {
      if (!startDate && !endDate) {
        setFilteredEntries(entries);
      }
      return;
    }

    const filtered = entries.filter((entry) => {
      const entryDateStr = entry.transaction_date.split(" ")[0];
      return entryDateStr >= startDate && entryDateStr <= endDate;
    });

    setFilteredEntries(filtered);
  };

  useEffect(() => {
    filterEntries();
  }, [startDate, endDate, entries]); // Depend on entries too in case they are fetched later

  const undofilter = () => {
    setEndDate("");
    setStartDate("");
  };

  // Add Balance Function (remains the same)
  const addBalance = async () => {
    if (!description || !amount) {
      alert("Please enter description and amount");
      return;
    }

    try {
      const response = await axios.post(API_URL, {
        action: "add_transaction",
        description: description,
        amount: parseFloat(amount),
        type: "varavu",
      });

      if (response.data.head.code === 200) {
        toast.success("Transaction added successfully");
        setShowModal(false);
        setDescription("");
        setAmount("");
        fetchBalance();
        fetchEntries();
      } else {
        alert("Failed to add transaction");
      }
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  const generateDaybookSummary = (allEntries, startDate, endDate) => {
    if (!allEntries || allEntries.length === 0) return [];
    const sortedEntries = [...allEntries].sort(
      (a, b) => new Date(a.transaction_date) - new Date(b.transaction_date)
    );

    const filteredForRange = sortedEntries.filter((entry) => {
      const date = entry.transaction_date.slice(0, 10);
      return (!startDate || date >= startDate) && (!endDate || date <= endDate);
    });

    const allDates = sortedEntries.map((entry) =>
      entry.transaction_date.slice(0, 10)
    );
    const minDate = allDates.length > 0 ? allDates[0] : "";
    const maxDate = allDates.length > 0 ? allDates[allDates.length - 1] : "";
    const start = startDate || minDate;

    let openingBalance = 0;

    sortedEntries.forEach((entry) => {
      const entryDate = entry.transaction_date.slice(0, 10);
      if (entryDate < start) {
        const amount = parseFloat(entry.amount || 0);
        if (entry.type === "varavu") openingBalance += amount;
        else if (entry.type === "patru") openingBalance -= amount;
      }
    });

    const entriesInDateRange = filteredEntries.filter((entry) => {
      const date = entry.transaction_date.slice(0, 10);
      return date >= start && date <= (endDate || maxDate);
    });

    const summaryMap = new Map();

    entriesInDateRange.forEach((entry) => {
      const date = entry.transaction_date.slice(0, 10);
      if (!summaryMap.has(date)) {
        summaryMap.set(date, { date, varavu: 0, patru: 0 });
      }

      const summary = summaryMap.get(date);
      const amount = parseFloat(entry.amount || 0);
      if (entry.type === "varavu") summary.varavu += amount;
      else if (entry.type === "patru") summary.patru += amount;
    });

    let previousClosing = openingBalance;

    const result = Array.from(summaryMap.entries())
      .sort(([a], [b]) => new Date(a) - new Date(b))
      .map(([date, summary]) => {
        const opening = previousClosing;
        const closing = opening + summary.varavu - summary.patru;
        previousClosing = closing;

        return {
          date,
          opening,
          varavu: summary.varavu,
          patru: summary.patru,
          closing,
        };
      });

    return result;
  };

  // ⬇️ summaryData calculation
  let summaryData = [];
  if (Array.isArray(entries) && entries.length) {
    summaryData = generateDaybookSummary(entries, startDate, endDate);
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // ⬇️ Material React Table Columns
  const columns = useMemo(
    () => [
      {
        accessorKey: "date",
        header: t("Date"),
        size: 150,
        enableGrouping: true,
        Cell: ({ cell }) => (
          <Box display="flex" alignItems="center">
            <CalendarToday fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="body2">
              {new Date(cell.getValue()).toLocaleDateString("en-GB")}
            </Typography>
          </Box>
        ),
      },
      {
        accessorKey: "opening",
        header: t("Day Opening Balance"),
        size: 200,
        muiTableBodyCellProps: { align: "right" },
        muiTableHeadCellProps: { align: "right" },
        Cell: ({ cell }) => (
          <Typography variant="body2">
            ₹{cell.getValue().toLocaleString()}
          </Typography>
        ),
      },
      {
        accessorKey: "varavu",
        header: t("Total Credit (Varavu)"),
        size: 200,
        muiTableBodyCellProps: { align: "right", sx: { color: "green" } },
        muiTableHeadCellProps: { align: "right" },
        Cell: ({ cell }) => (
          <Typography variant="body2">
            ₹{cell.getValue().toLocaleString()}
          </Typography>
        ),
      },
      {
        accessorKey: "patru",
        header: t("Total Debit (Patru)"),
        size: 200,
        muiTableBodyCellProps: { align: "right", sx: { color: "red" } },
        muiTableHeadCellProps: { align: "right" },
        Cell: ({ cell }) => (
          <Typography variant="body2">
            ₹{cell.getValue().toLocaleString()}
          </Typography>
        ),
      },
      {
        accessorKey: "closing",
        header: t("Day Closing Balance"),
        size: 200,
        muiTableBodyCellProps: { align: "right" },
        muiTableHeadCellProps: { align: "right" },
        Cell: ({ cell }) => (
          <Typography variant="body2" sx={{ fontWeight: "bold" }}>
            ₹{cell.getValue().toLocaleString()}
          </Typography>
        ),
      },
    ],
    [t]
  );

  return (
    <Container className="balance-sheet-container">
      <h5 className="mt-5 mb-3 text-center">📘 {t("Day-wise Summary")}</h5>

      {/* Balance Display */}
      <div className="balance-container text-center mb-4">
        <h5 sx={{ verticalAlign: "middle", mr: 0.5 }}>
          {t("Current Balance")}: ₹{balance}
        </h5>
      </div>

      {/* Add Balance Modal (Unchanged) */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{t("Add Balance")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>{t("Description")}</Form.Label>
              <Form.Control
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{t("Amount")}</Form.Label>
              <Form.Control
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button className="close-btn " onClick={() => setShowModal(false)}>
            {t("Close")}
          </Button>
          <Button className="custom-btn" onClick={addBalance}>
            {t("Add")}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Date Filter Section */}
      <Row className="mb-3 d-flex align-items-end">
        {/* 1. From Date */}
        <Col md={2} sm={6} xs={12}>
          <Form.Group>
            <Form.Label>{t("From Date")}</Form.Label>
            <Form.Control
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </Form.Group>
        </Col>

        {/* 2. To Date */}
        <Col md={2} sm={6} xs={12}>
          <Form.Group>
            <Form.Label>{t("To Date")}</Form.Label>
            <Form.Control
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col
          md={4}
          sm={12}
          xs={12}
          className="d-flex align-items-end"
          style={{ gap: "8px" }}
        >
          {/* 3. Undo Filter Button */}
          <Button className="custom-btn" onClick={undofilter}>
            {t("Undo Filter")}
          </Button>

          {/* 4. Download PDF Button */}
          <PDFDownloadLink
            document={
              <BalanceSheetPDF
                allEntries={entries}
                startDate={startDate}
                endDate={endDate}
                balance={balance}
              />
            }
            fileName="BalanceSheet.pdf"
          >
            {({ loading }) =>
              loading ? (
                <Button className="custom-btn" disabled>
                  {t("Generating PDF...")}
                </Button>
              ) : (
                <Button className="custom-btn">{t("Download PDF")}</Button>
              )
            }
          </PDFDownloadLink>
        </Col>
      </Row>

      {/* ⬇️ Material React Table Component */}
      <MaterialReactTable
        columns={columns}
        data={summaryData}
        enableExpanding
        enableExpandAll={false}
        enablePagination={true}
        enableSorting={true}
        enableColumnActions={false}
        enableBottomToolbar={true}
        initialState={{ density: "compact" }}
        displayColumnDefOptions={{
          "mrt-row-expand": { header: "", size: 0 }, // removes "Expand" text
        }}
         muiTableHeadCellProps={{
          sx: {
            backgroundColor: '#343a40', // table-dark
            color: 'white',
          },
        }}
        renderDetailPanel={({ row }) => {
          const rowData = row.original;

          // Filter transactions for the selected date
          const entriesForDate = filteredEntries.filter(
            (entry) => entry.transaction_date.slice(0, 10) === rowData.date
          );

          // Calculate totals for the nested table
          const totalVaravu = entriesForDate
            .filter((entry) => entry.type === "varavu")
            .reduce((sum, entry) => sum + parseFloat(entry.amount), 0);

          const totalPatru = entriesForDate
            .filter((entry) => entry.type === "patru")
            .reduce((sum, entry) => sum + parseFloat(entry.amount), 0);

          return (
            <Box
              sx={{
                margin: "10px 0",
                padding: "15px",
                background: "#f8f8f8",
                borderRadius: "4px",
              }}
            >
              <Typography variant="h6" gutterBottom component="div">
                {t("Transaction Details for")}:{" "}
                {new Date(rowData.date).toLocaleDateString("en-GB")}
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ background: "#e0e0e0" }}>
                    <TableCell>{t("Date")}</TableCell>
                    <TableCell>{t("Description")}</TableCell>
                    <TableCell align="right">{t("Credit (Varavu)")}</TableCell>
                    <TableCell align="right">{t("Debit (Patru)")}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {entriesForDate.map((entry, idx) => (
                    <TableRow key={idx}>
                      <TableCell>
                        {formatDate(entry.transaction_date)}
                      </TableCell>
                      <TableCell>
                        {entry.description}{" "}
                        <Box
                          component="span"
                          sx={{
                            fontSize: "0.8em",
                            color: entry.type === "patru" ? "red" : "green",
                          }}
                        >
                          {entry.type === "patru" ? "(பற்று)" : "(வரவு)"}
                        </Box>
                      </TableCell>
                      <TableCell align="right" sx={{ color: "green" }}>
                        {entry.type === "varavu"
                          ? `₹${parseFloat(entry.amount).toLocaleString()}`
                          : "-"}
                      </TableCell>
                      <TableCell align="right" sx={{ color: "red" }}>
                        {entry.type === "patru"
                          ? `₹${parseFloat(entry.amount).toLocaleString()}`
                          : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                  {/* Totals Row */}
                  <TableRow
                    sx={{ fontWeight: "bold", backgroundColor: "#e8e8e8" }}
                  >
                    <TableCell colSpan={2} align="right">
                      <strong>{t("Total Credit Debit")}</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>₹{totalVaravu.toLocaleString()}</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>₹{totalPatru.toLocaleString()}</strong>
                    </TableCell>
                  </TableRow>
                  {/* Opening Balance Row */}
                  <TableRow
                    sx={{ fontWeight: "bold", backgroundColor: "#e8e8e8" }}
                  >
                    <TableCell colSpan={3} align="right">
                      <strong>{t("Day Opening Balance")}</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>₹{rowData.opening.toLocaleString()}</strong>
                    </TableCell>
                  </TableRow>
                  {/* Closing Balance Row */}
                  <TableRow
                    sx={{ fontWeight: "bold", backgroundColor: "#d0d0d0" }}
                  >
                    <TableCell colSpan={3} align="right">
                      <strong>{t("Day Closing Balance")}</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>₹{rowData.closing.toLocaleString()}</strong>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          );
        }}
      />
      {/* ⬆️ End Material React Table Component */}

      <ToastContainer />
    </Container>
  );
};

export default BalanceSheet;
