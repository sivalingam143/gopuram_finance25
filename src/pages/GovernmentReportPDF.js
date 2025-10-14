import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 30,
  },
  header: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
    fontFamily: "Helvetica-Bold",
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    textAlign: "center",
    fontFamily: "Helvetica-Bold",
  },
  subTitle: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: "center",
    color: "#666",
  },
  table: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomStyle: "solid",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    borderBottomStyle: "solid",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  tableCol: {
    width: "41pt", // Approx 13 cols * 41pt = ~533pt (fits A4 ~595pt with padding)
    borderRightStyle: "solid",
    borderRightWidth: 1,
    borderRightColor: "#000",
    padding: 4,
    fontSize: 7,
    flexDirection: "column",
    justifyContent: "center",
  },
  tableHeaderCol: {
    width: "41pt",
    borderRightStyle: "solid",
    borderRightWidth: 1,
    borderRightColor: "#000",
    padding: 4,
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    flexDirection: "column",
    justifyContent: "center",
  },
  totalRow: {
    flexDirection: "row",
    backgroundColor: "#e0e0e0",
    borderBottomStyle: "solid",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  totalCol: {
    width: "41pt",
    borderRightStyle: "solid",
    borderRightWidth: 1,
    borderRightColor: "#000",
    padding: 4,
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    textAlign: "right",
    flexDirection: "column",
    justifyContent: "center",
  },
  totalHeaderCol: {
    width: "41pt",
    borderRightStyle: "solid",
    borderRightWidth: 1,
    borderRightColor: "#000",
    padding: 4,
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    textAlign: "right",
    flexDirection: "column",
    justifyContent: "center",
  },
  lastCol: {
    borderRightWidth: 0, // No right border on last column
  },
});

const formatDate = (date) => {
  if (!date) return "—";
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

const GovernmentReportPDF = ({ data }) => {
  // Calculate totals
  const totalPrincipal = data.reduce(
    (sum, item) => sum + parseFloat(item.principal || 0),
    0
  );
  const totalMonthlyInterest = data.reduce(
    (sum, item) => sum + parseFloat(item.monthly_interest || 0),
    0
  );
  const totalInterest = data.reduce(
    (sum, item) => sum + parseFloat(item.total_interest || 0),
    0
  );
  const totalDue = data.reduce(
    (sum, item) => sum + parseFloat(item.total_due || 0),
    0
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Government Report</Text>
          <Text style={styles.subTitle}>
            Generated on {new Date().toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.table}>
          {/* Header Row */}
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.tableHeaderCol, styles.lastCol]}>
              Serial No
            </Text>
            <Text style={styles.tableHeaderCol}>Period Start Date</Text>
            <Text style={styles.tableHeaderCol}>Receipt No</Text>
            <Text style={styles.tableHeaderCol}>Customer No</Text>
            <Text style={styles.tableHeaderCol}>Name</Text>
            <Text style={styles.tableHeaderCol}>Customer Details</Text>
            <Text style={styles.tableHeaderCol}>Place</Text>
            <Text style={styles.tableHeaderCol}>Mobile Number</Text>
            <Text style={styles.tableHeaderCol}>Date of Birth</Text>
            <Text style={styles.tableHeaderCol}>Principal (₹)</Text>
            <Text style={styles.tableHeaderCol}>Monthly Interest (₹)</Text>
            <Text style={styles.tableHeaderCol}>Total Interest (₹)</Text>
            <Text style={[styles.tableHeaderCol, styles.lastCol]}>
              Total Due (₹)
            </Text>
          </View>

          {/* Data Rows */}
          {data.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCol, styles.lastCol]}>{index + 1}</Text>
              <Text style={styles.tableCol}>
                {formatDate(item.period_start_date)}
              </Text>
              <Text style={styles.tableCol}>{item.receipt_no}</Text>
              <Text style={styles.tableCol}>{item.customer_no}</Text>
              <Text style={styles.tableCol}>{item.name}</Text>
              <Text style={styles.tableCol}>{item.customer_details}</Text>
              <Text style={styles.tableCol}>{item.place}</Text>
              <Text style={styles.tableCol}>{item.mobile_number}</Text>
              <Text style={styles.tableCol}>
                {item.dateofbirth ? formatDate(item.dateofbirth) : "—"}
              </Text>
              <Text style={styles.tableCol}>
                {parseFloat(item.principal || 0).toLocaleString()}
              </Text>
              <Text style={styles.tableCol}>
                {parseFloat(item.monthly_interest || 0).toFixed(2)}
              </Text>
              <Text style={styles.tableCol}>
                {parseFloat(item.total_interest || 0).toFixed(2)}
              </Text>
              <Text style={[styles.tableCol, styles.lastCol]}>
                {parseFloat(item.total_due || 0).toLocaleString()}
              </Text>
            </View>
          ))}

          {/* Total Row */}
          <View style={styles.totalRow}>
            <Text style={[styles.totalHeaderCol, styles.lastCol]}>Total</Text>
            <Text style={styles.totalCol} />
            <Text style={styles.totalCol} />
            <Text style={styles.totalCol} />
            <Text style={styles.totalCol} />
            <Text style={styles.totalCol} />
            <Text style={styles.totalCol} />
            <Text style={styles.totalCol} />
            <Text style={styles.totalCol} />
            <Text style={styles.totalCol}>
              {totalPrincipal.toLocaleString()}
            </Text>
            <Text style={styles.totalCol}>
              {totalMonthlyInterest.toFixed(2)}
            </Text>
            <Text style={styles.totalCol}>{totalInterest.toFixed(2)}</Text>
            <Text style={[styles.totalCol, styles.lastCol]}>
              {totalDue.toLocaleString()}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default GovernmentReportPDF;
