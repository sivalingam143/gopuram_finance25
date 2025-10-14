// src/components/ReportPDF.js
import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// Define styles
const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 8,
    fontFamily: "Helvetica",
    flexDirection: "column",
  },
  titleContainer: {
    textAlign: "center",
    marginBottom: 8,
    borderBottom: "1 solid #333",
    paddingBottom: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableHeader: {
    backgroundColor: "#f0f0f0",
    fontWeight: "bold",
  },
  tableCol: {
    flex: 1,
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 3,
    textAlign: "center",
  },
  alternateRow: {
    backgroundColor: "#fafafa",
  },
  totalRow: {
    backgroundColor: "#e6f2ff",
    fontWeight: "bold",
  },
});

const ReportPDF = ({ config, data, totals }) => (
  <Document>
    <Page size="A4" orientation="landscape" style={styles.page}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{config.title}</Text>
      </View>

      <View style={styles.table}>
        {/* Header row */}
        <View style={[styles.tableRow, styles.tableHeader]}>
          {config.columns.map((col, i) => (
            <Text key={i} style={styles.tableCol}>{col}</Text>
          ))}
        </View>

        {/* Data rows */}
        {data.map((row, index) => (
          <View
            key={index}
            style={[
              styles.tableRow,
              index % 2 === 0 ? styles.alternateRow : null,
            ]}
          >
            {config.rowMapper(row, index).map((cell, i) => (
              <Text key={i} style={styles.tableCol}>{String(cell)}</Text>
            ))}
          </View>
        ))}

        {/* Total row */}
        <View style={[styles.tableRow, styles.totalRow]}>
          {config.rowMapper(
            { ...totals, date: "Total", expense_type: "Total", cash_type: "Total" },
            -1
          ).map((cell, i) => (
            <Text key={i} style={styles.tableCol}>{String(cell)}</Text>
          ))}
        </View>
      </View>
    </Page>
  </Document>
);

export default ReportPDF;
