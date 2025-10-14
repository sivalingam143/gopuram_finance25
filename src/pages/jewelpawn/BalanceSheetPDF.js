import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 11,
    fontFamily: "Helvetica",
    backgroundColor: "#fff",
  },
  section: { marginBottom: 25 },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
    color: "#333",
  },
  subtitle: {
    fontSize: 13,
    fontWeight: "bold",
    textAlign: "center",
    color: "#444",
    marginBottom: 5,
  },
  transactionText: {
    fontSize: 11,
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
  },
  table: {
    display: "table",
    width: "100%",
    border: "1px solid #bbb",
    borderRadius: 4,
    overflow: "hidden",
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1px solid #ddd",
  },
  tableHeader: {
    backgroundColor: "#007bff",
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
  },
  tableCell: {
    flex: 1,
    padding: 8,
    textAlign: "center",
    fontSize: 11,
    borderRight: "1px solid #ddd",
    color: "#333",
  },
  tableCellLeft: {
    flex: 1,
    padding: 8,
    textAlign: "left",
    fontSize: 11,
    borderRight: "1px solid #ddd",
    color: "#333",
  },
  tableRowAlternate: { backgroundColor: "#f9f9f9" },
  totalsRow: {
    backgroundColor: "#e0e0e0",
    fontWeight: "bold",
  },
  footer: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 13,
    fontWeight: "bold",
    borderTop: "1px solid #ccc",
    paddingTop: 10,
    color: "#222",
  },
});

const BalanceSheetPDF = ({
  allEntries = [],
  startDate,
  endDate,
  balance = 0,
}) => {
  console.log(allEntries, "em");

  // Group by Date and Calculate Daily Summary
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

    const summaryMap = new Map();

    filteredEntries.forEach((entry) => {
      const date = entry.transaction_date.slice(0, 10);
      if (!summaryMap.has(date)) {
        summaryMap.set(date, { date, varavu: 0, patru: 0, transactions: [] });
      }

      const summary = summaryMap.get(date);
      const amount = parseFloat(entry.amount || 0);
      if (entry.type === "varavu") summary.varavu += amount;
      else if (entry.type === "patru") summary.patru += amount;

      summary.transactions.push({
        description: entry.description,
        type: entry.type,
        amount: amount,
      });
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
          transactions: summary.transactions,
        };
      });

    return result;
  };

  // Generate the summary data based on provided startDate and endDate
  let summaryData = generateDaybookSummary(allEntries, startDate, endDate);

  // Ensure summaryData is always an array, even if empty
  summaryData = Array.isArray(summaryData) ? summaryData : [];

  console.log("siva", summaryData);

  const formatDate = (d) => {
    const date = new Date(d);
    return `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>📘 Day-wise Balance Sheet Report</Text>

        {summaryData.map((row, idx) => (
          <View key={idx} style={styles.section}>
            <Text style={styles.subtitle}>Date: {formatDate(row.date)}</Text>
            <Text style={styles.transactionText}>
              Opening: {row.opening.toLocaleString()} | 
              Varavu: {row.varavu.toLocaleString()} | Patru:{" "}
              {row.patru.toLocaleString()}
              | Closing:{" "}
               {row.closing.toLocaleString()} 
            </Text>

            <View style={styles.table}>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={styles.tableCell}>Description</Text>
                <Text style={styles.tableCell}>Varavu</Text>
                <Text style={styles.tableCell}>Patru</Text>
              </View>

              {row.transactions.map((txn, i) => (
                <View
                  style={[
                    styles.tableRow,
                    i % 2 === 0 ? styles.tableRowAlternate : null,
                  ]}
                  key={i}
                >
                  <Text style={styles.tableCell}>{txn.description}</Text>
                  <Text style={styles.tableCell}>
                    {txn.type === "varavu" ? txn.amount.toLocaleString() : "-"}
                  </Text>
                  <Text style={styles.tableCell}>
                    {txn.type === "patru" ? txn.amount.toLocaleString() : "-"}
                  </Text>
                </View>
              ))}

              <View style={[styles.tableRow, styles.totalsRow]}>
                <Text style={[styles.tableCell, styles.totalsText]}>Total</Text>
                <Text style={[styles.tableCell, styles.totalsText]}>
                  {row.varavu.toLocaleString()}
                </Text>
                <Text style={[styles.tableCell, styles.totalsText]}>
                  {row.patru.toLocaleString()}
                </Text>
              </View>
            </View>
          </View>
        ))}

        <Text style={styles.footer}>Final Closing Balance: {balance.toLocaleString()}</Text>
      </Page>
    </Document>
  );
};

export default BalanceSheetPDF;
