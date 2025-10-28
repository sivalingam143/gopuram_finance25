import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  section: {
    marginBottom: 20,
  },
  table: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 2,
  },
  row: {
    display: "flex",
    flexDirection: "row",
    borderBottomStyle: "solid",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  headerRow: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
  },
  cell: {
    borderRightStyle: "solid",
    borderRightWidth: 1,
    borderRightColor: "#000",
    padding: 4,
    fontSize: 8,
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  headerCell: {
    borderRightStyle: "solid",
    borderRightWidth: 1,
    borderRightColor: "#000",
    padding: 5,
    fontSize: 10,
    fontWeight: "bold",
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f0f0",
  },
  lastCell: {
    borderRightWidth: 0,
  },
  lastRow: {
    borderBottomWidth: 0,
  },
});

const InterestStatementPDF = ({ data }) => {
  const { statement, customer } = data;
  const {
    receipt_no,
    effective_start_date,
    principal,
    base_rate,
    recovery_period,
    total_interest,
    paid_interest,
    total_due,
    breakdown = [],
  } = statement;

  const formatDateForPDF = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const customerFields = [
    { label: "Customer Name", value: customer.name || "N/A" },
    { label: "Mobile Number", value: customer.mobile_number || "N/A" },
    { label: "Address", value: customer.customer_details || "N/A" },
    { label: "Place", value: customer.place || "N/A" },
    { label: "Loan Date", value: formatDateForPDF(customer.pawnjewelry_date) },
    {
      label: "Principal Amount",
      value: `₹${principal?.toLocaleString() || 0}`,
    },
    { label: "Base Rate", value: base_rate || "N/A" },
    { label: "Recovery Period", value: recovery_period || "N/A" },
    {
      label: "Total Interest",
      value: `₹${total_interest?.toLocaleString() || 0}`,
    },
    {
      label: "Paid Interest",
      value: `₹${paid_interest?.toLocaleString() || 0}`,
    },
    { label: "Total Due", value: `₹${total_due?.toLocaleString() || 0}` },
  ];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Interest Statement Report</Text>
        <View style={styles.section}>
          <Text>Receipt No: {receipt_no}</Text>
          <Text>
            Effective Start Date: {formatDateForPDF(effective_start_date)}
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
            Customer Details:
          </Text>
          <View style={styles.table}>
            <View style={styles.headerRow}>
              <View style={[styles.headerCell, styles.lastCell]}>
                <Text>Field</Text>
              </View>
              <View style={styles.headerCell}>
                <Text>Value</Text>
              </View>
            </View>
            {customerFields.map((field, idx) => (
              <View
                key={idx}
                style={[
                  styles.row,
                  idx === customerFields.length - 1 && styles.lastRow,
                ]}
              >
                <View style={[styles.cell, styles.lastCell]}>
                  <Text>{field.label}</Text>
                </View>
                <View style={styles.cell}>
                  <Text>{field.value}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.section}>
          <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
            Breakdown:
          </Text>
          <View style={styles.table}>
            <View style={styles.headerRow}>
              <View style={styles.headerCell}>
                <Text>Period</Text>
              </View>
              <View style={styles.headerCell}>
                <Text>From-To / Paid Date</Text>
              </View>
              <View style={styles.headerCell}>
                <Text>Rate</Text>
              </View>
              <View style={styles.headerCell}>
                <Text>Interest</Text>
              </View>
              <View style={styles.headerCell}>
                <Text>Total</Text>
              </View>
              <View style={styles.headerCell}>
                <Text>Balance</Text>
              </View>
              <View style={[styles.headerCell, styles.lastCell]}>
                <Text>Paid</Text>
              </View>
            </View>
            {breakdown.map((item, idx) => (
              <View
                key={idx}
                style={[
                  styles.row,
                  idx === breakdown.length - 1 && styles.lastRow,
                ]}
              >
                <View style={styles.cell}>
                  <Text>{item.period || ""}</Text>
                </View>
                <View style={styles.cell}>
                  <Text>{item.from_to || item.paid_date || ""}</Text>
                </View>
                <View style={styles.cell}>
                  <Text>{item.rate || ""}</Text>
                </View>
                <View style={styles.cell}>
                  <Text>₹{(item.interest || 0).toLocaleString()}</Text>
                </View>
                <View style={styles.cell}>
                  <Text>₹{(item.total || 0).toLocaleString()}</Text>
                </View>
                <View style={styles.cell}>
                  <Text>₹{(item.balance || 0).toLocaleString()}</Text>
                </View>
                <View style={[styles.cell, styles.lastCell]}>
                  <Text>{item.paid ? "Yes" : "No"}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default InterestStatementPDF;
