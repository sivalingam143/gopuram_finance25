import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// Register a clean English font
Font.register({
  family: "Helvetica",
  fonts: [
    { src: "https://fonts.gstatic.com/s/helvetica.ttf", fontWeight: "normal" },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 25,
    fontSize: 10,
    fontFamily: "Helvetica",
    lineHeight: 1.3,
  },
  title: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
    textDecoration: "underline",
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 11,
    marginBottom: 6,
    textDecoration: "underline",
  },
  section: {
    marginBottom: 18,
  },
  table: {
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
  },
  row: {
    flexDirection: "row",
    borderBottomStyle: "solid",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  cell: {
    borderRightStyle: "solid",
    borderRightWidth: 1,
    borderRightColor: "#000",
    padding: 6,
    flex: 1,
  },
  lastCell: {
    borderRightWidth: 0,
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#f2f2f2",
    borderBottomStyle: "solid",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    fontWeight: "bold",
  },
  headerCell: {
    flex: 1,
    padding: 6,
    fontWeight: "bold",
    borderRightStyle: "solid",
    borderRightWidth: 1,
    borderRightColor: "#000",
  },
  headerLastCell: {
    borderRightWidth: 0,
  },
  textCenter: {
    textAlign: "center",
  },
  textRight: {
    textAlign: "right",
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
      value: `Rs${principal?.toLocaleString() || 0}`,
    },
    { label: "Base Rate (%)", value: base_rate || "N/A" },
    { label: "Recovery Period", value: recovery_period || "N/A" },
    {
      label: "Total Interest",
      value: `Rs${total_interest?.toLocaleString() || 0}`,
    },
    {
      label: "Paid Interest",
      value: `Rs${paid_interest?.toLocaleString() || 0}`,
    },
    { label: "Total Due", value: `Rs${total_due?.toLocaleString() || 0}` },
  ];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Main Title */}
        <Text style={styles.title}>Pledge Interest Statement</Text>

        {/* Receipt Info */}
        <View style={styles.section}>
          <Text>Receipt No: {receipt_no}</Text>
          <Text>
            Effective Start Date: {formatDateForPDF(effective_start_date)}
          </Text>
        </View>

        {/* Customer Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer & Pledge Details</Text>
          <View style={styles.table}>
            {customerFields.map((field, idx) => (
              <View
                key={idx}
                style={[
                  styles.row,
                  idx === customerFields.length - 1 && { borderBottomWidth: 0 },
                ]}
              >
                <View style={[styles.cell, { flex: 1 }]}>
                  <Text>{field.label}</Text>
                </View>
                <View style={[styles.cell, { flex: 1.5 }, styles.lastCell]}>
                  <Text>{field.value}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Breakdown Table */}
        <View style={styles.section} wrap={true}>
          <Text style={styles.sectionTitle}>
            Installment / Interest Breakdown
          </Text>
          <View style={styles.table}>
            {/* Header */}
            <View style={styles.headerRow}>
              <View style={[styles.headerCell, { flex: 0.5 }]}>
                <Text style={styles.textCenter}>No</Text>
              </View>
              <View style={[styles.headerCell, { flex: 1.5 }]}>
                <Text style={styles.textCenter}>Period (From-To)</Text>
              </View>
              <View style={[styles.headerCell, { flex: 0.7 }]}>
                <Text style={styles.textCenter}>Rate %</Text>
              </View>
              <View style={[styles.headerCell, { flex: 1 }]}>
                <Text style={styles.textCenter}>Interest</Text>
              </View>
              <View style={[styles.headerCell, { flex: 1 }]}>
                <Text style={styles.textCenter}>Total</Text>
              </View>
              <View style={[styles.headerCell, { flex: 1 }]}>
                <Text style={styles.textCenter}>Balance</Text>
              </View>
              <View
                style={[
                  styles.headerCell,
                  { flex: 0.8 },
                  styles.headerLastCell,
                ]}
              >
                <Text style={styles.textCenter}>Paid</Text>
              </View>
            </View>

            {/* Data Rows */}
            {breakdown.map((item, idx) => (
              <View
                key={idx}
                style={[
                  styles.row,
                  idx === breakdown.length - 1 && { borderBottomWidth: 0 },
                ]}
              >
                <View style={[styles.cell, { flex: 0.5 }]}>
                  <Text style={styles.textCenter}>{idx + 1}</Text>
                </View>
                <View style={[styles.cell, { flex: 1.5 }]}>
                  <Text>{item.from_to || item.paid_date || ""}</Text>
                </View>
                <View style={[styles.cell, { flex: 0.7 }]}>
                  <Text style={styles.textCenter}>{item.rate || ""}</Text>
                </View>
                <View style={[styles.cell, { flex: 1, textAlign: "right" }]}>
                  <Text style={styles.textRight}>
                    Rs{(item.interest || 0).toLocaleString()}
                  </Text>
                </View>
                <View style={[styles.cell, { flex: 1 }]}>
                  <Text style={styles.textRight}>
                    Rs{(item.total || 0).toLocaleString()}
                  </Text>
                </View>
                <View style={[styles.cell, { flex: 1 }]}>
                  <Text style={styles.textRight}>
                    Rs{(item.balance || 0).toLocaleString()}
                  </Text>
                </View>
                <View style={[styles.cell, { flex: 0.8 }, styles.lastCell]}>
                  <Text style={styles.textCenter}>
                    {item.paid ? "Yes" : "No"}
                  </Text>
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
