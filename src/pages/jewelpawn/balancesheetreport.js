import React, { useEffect, useState } from "react";
import {
  Container,
  Table,
  Button,
  Form,
  Row,
  Col,
  Modal,
} from "react-bootstrap";
import axios from "axios";
import { PDFDownloadLink } from "@react-pdf/renderer";
import BalanceSheetPDF from "./BalanceSheetPDF";
import API_DOMAIN from "../../config/config";
import "./BalanceSheet.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLanguage } from "../../components/LanguageContext";

const API_URL = `${API_DOMAIN}/balance.php`;

const BalanceSheet = () => {
  const { t } = useLanguage();
  const [balance, setBalance] = useState(0);
  const [entries, setEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");

  console.log(filteredEntries);
  // Date Filter States

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [expandedDate, setExpandedDate] = useState(null);
  console.log(expandedDate);

  const toggleDate = (date) => {
    console.log(date);
    setExpandedDate((prev) => (prev === date ? null : date));
  };

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
        console.log(response.data.body.transactions);
        setFilteredEntries(response.data.body.transactions); // Default to all entries
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  // Filter function
  const filterEntries = () => {
    if (!startDate || !endDate) return;

    const filtered = entries.filter((entry) => {
      const entryDateStr = entry.transaction_date.split(" ")[0];
      return entryDateStr >= startDate && entryDateStr <= endDate;
    });

    setFilteredEntries(filtered);
  };
  const undofilter = () => {
    setEndDate("");
    setStartDate("");
  };

  // Add Balance Function
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
        type: "varavu", // Adding balance (Income)
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

    // Step 0: Sort entries by date
    const sortedEntries = [...allEntries].sort(
      (a, b) => new Date(a.transaction_date) - new Date(b.transaction_date)
    );

    // Step 1: Determine full range if dates are missing
    const allDates = sortedEntries.map((entry) =>
      entry.transaction_date.slice(0, 10)
    );
    const minDate = allDates[0];
    const maxDate = allDates[allDates.length - 1];

    const start = startDate || minDate;
    const end = endDate || maxDate;

    // Step 2: Calculate Opening Balance before start date
    let openingBalance = 0;

    sortedEntries.forEach((entry) => {
      const entryDate = entry.transaction_date.slice(0, 10);
      if (entryDate < start) {
        const amount = parseFloat(entry.amount || 0);
        if (entry.type === "varavu") openingBalance += amount;
        else if (entry.type === "patru") openingBalance -= amount;
      }
    });

    // Step 3: Filter entries within start-end range
    const filteredEntries = sortedEntries.filter((entry) => {
      const date = entry.transaction_date.slice(0, 10);
      return date >= start && date <= end;
    });

    // Step 4: Group by date
    const summaryMap = new Map();

    filteredEntries.forEach((entry) => {
      const date = entry.transaction_date.slice(0, 10);
      if (!summaryMap.has(date)) {
        summaryMap.set(date, { date, varavu: 0, patru: 0 });
      }

      const summary = summaryMap.get(date);
      const amount = parseFloat(entry.amount || 0);
      if (entry.type === "varavu") summary.varavu += amount;
      else if (entry.type === "patru") summary.patru += amount;
    });

    // Step 5: Generate result with balances
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

  let summaryData = [];
  if (Array.isArray(entries) && entries.length) {
    summaryData = generateDaybookSummary(entries, startDate, endDate);
  } else {
    summaryData = [];
  }

  console.table(summaryData);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <Container className="balance-sheet-container">
      <h5 className="mt-5 mb-3 text-center">📘 {t("Day-wise Summary")}</h5>

      {/* Balance Display */}
      <div className="balance-container text-center mb-4">
        <h5>
          {t("Current Balance")}: ₹{balance}
        </h5>
      </div>

      {/* Add Balance Button */}
      {/* <Button className="custom-btn mb-4" onClick={() => setShowModal(true)}>
        Add Balance
      </Button> */}

      {/* Add Balance Modal */}
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
        {/* 1. From Date (Reduced to md=2) */}
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

        {/* 2. To Date (Reduced to md=2) */}
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

      <Table striped bordered hover responsive className="custom-table mt-3">
        <thead className="table-header">
          <tr>
            <th className="table-header1">{t("Date")}</th>
            <th className="table-header1">{t("Day Opening Balance")}</th>
            <th className="table-header1">{t("Total Credit (Varavu)")}</th>
            <th className="table-header1">{t("Total Debit (Patru)")}</th>
            <th className="table-header1">{t("Day Closing Balance")}</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(summaryData) &&
            summaryData.map((row, index) => (
              <React.Fragment key={index}>
                <tr>
                  <td>{new Date(row.date).toLocaleDateString("en-GB")}</td>

                  <td>₹{row.opening.toLocaleString()}</td>
                  <td>₹{row.varavu.toLocaleString()}</td>
                  <td>₹{row.patru.toLocaleString()}</td>
                  <td>₹{row.closing.toLocaleString()}</td>
                  <td>
                    <button onClick={() => toggleDate(row.date)}>
                      {expandedDate === row.date ? t("Hide") : t("View")}
                      {t("Details")}
                    </button>
                  </td>
                </tr>

                {/* ✅ Conditional breakdown row */}
                {expandedDate === row.date &&
                  (() => {
                    const entriesForDate = filteredEntries.filter(
                      (entry) =>
                        entry.transaction_date.slice(0, 10) === row.date
                    );

                    const totalVaravu = entriesForDate
                      .filter((entry) => entry.type === "varavu")
                      .reduce(
                        (sum, entry) => sum + parseFloat(entry.amount),
                        0
                      );

                    const totalPatru = entriesForDate
                      .filter((entry) => entry.type === "patru")
                      .reduce(
                        (sum, entry) => sum + parseFloat(entry.amount),
                        0
                      );

                    return (
                      <tr>
                        <td colSpan={6}>
                          <Table
                            striped
                            bordered
                            hover
                            responsive
                            className="custom-table mt-3"
                          >
                            <thead className="table-header">
                              <tr>
                                <th className="table-header1">{t("Date")}</th>
                                <th className="table-header1">{t("Description")}</th>
                                <th className="table-header1">{t("Credit (Varavu)")}</th>
                                <th className="table-header1">{t("Debit (Patru)")}</th>
                              </tr>
                            </thead>
                            <tbody>
                              {entriesForDate.map((entry, idx) => (
                                <tr key={idx}>
                                  <td>{formatDate(entry.transaction_date)}</td>
                                  <td>
                                    {entry.description}{" "}
                                    {entry.type === "patru"
                                      ? "(பற்று)"
                                      : "(வரவு)"}
                                  </td>
                                  <td>
                                    {entry.type === "varavu"
                                      ? `₹${parseFloat(
                                          entry.amount
                                        ).toLocaleString()}`
                                      : "-"}
                                  </td>
                                  <td>
                                    {entry.type === "patru"
                                      ? `₹${parseFloat(
                                          entry.amount
                                        ).toLocaleString()}`
                                      : "-"}
                                  </td>
                                </tr>
                              ))}

                              {/* 🔽 Totals Row */}
                              <tr className="font-weight-bold bg-light">
                                <td colSpan={2} className="text-end">
                                  <strong>{t("Total Credit Debit")}</strong>
                                </td>
                                <td>
                                  <strong>
                                    ₹{totalVaravu.toLocaleString()}
                                  </strong>
                                </td>
                                <td>
                                  <strong>
                                    ₹{totalPatru.toLocaleString()}
                                  </strong>
                                </td>
                              </tr>
                              <tr className="font-weight-bold bg-light">
                                <td colSpan={3} className="text-end">
                                  <strong>{t("Day Opening Balance")}</strong>
                                </td>
                                <td>
                                  <strong>
                                    ₹{row.opening.toLocaleString()}
                                  </strong>
                                </td>
                              </tr>
                              <tr className="font-weight-bold bg-light">
                                <td colSpan={3} className="text-end">
                                 <strong>{t("Day Closing Balance")}</strong>
                                </td>
                                <td>
                                  <strong>
                                    ₹{row.closing.toLocaleString()}
                                  </strong>
                                </td>
                              </tr>
                            </tbody>
                          </Table>
                        </td>
                      </tr>
                    );
                  })()}
              </React.Fragment>
            ))}
        </tbody>
      </Table>

      <ToastContainer />
    </Container>
  );
};

export default BalanceSheet;
