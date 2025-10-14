// AdvanceReportPDF.js
import React from 'react';
import {
    Page, Text, View, Document, StyleSheet, Font,
} from '@react-pdf/renderer';
import fontBold from "../pdf/fonts/NotoSansTamil-Bold.ttf";
import fontRegular from "../pdf/fonts/NotoSansTamil-Regular.ttf";

Font.register({
    family: "fontBold",
    fonts: [{ src: fontBold, fontStyle: "normal", fontWeight: "bold" }],
});
Font.register({
    family: "fontRegular",
    fonts: [{ src: fontRegular, fontStyle: "normal", fontWeight: "normal" }],
});

const styles = StyleSheet.create({
    page: {
        padding: 20,
        fontSize: 10,
        fontFamily: 'fontBold',
    },
    section: {
        marginBottom: 10,
    },
    table: {
        display: 'table',
        width: '100%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#000',
        borderRightWidth: 0,
        borderBottomWidth: 0,
    },
    tableRow: {
        flexDirection: 'row',
    },
    tableCell: {
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderStyle: 'solid',
        borderColor: '#000',
        padding: 4,
        fontSize: 9,
    },
    headerCell: {
        backgroundColor: '#e0e0e0',
        fontWeight: 'bold',
    },
    totalCell: {
        backgroundColor: '#f5f5f5',
        fontWeight: 'bold',
    },
    head: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 10,
        fontWeight: 'bold',
    },
});
const formatDate = (date) => {
    if (!date) return '—';  // Return a placeholder if no date is provided
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
};

const AdvanceReportPDF = ({ data, reportType }) => {
    const totalWeight = data.reduce((acc, item) => acc + parseFloat(item.totalWeight || 0), 0);
    const totalnetWeight = data.reduce((acc, item) => acc + parseFloat(item.totalnetWeight || 0), 0);
    const totalAmount = data.reduce((acc, item) => acc + parseFloat(item.totalAmount || 0), 0);
    const totalInterest = data.reduce((acc, item) => acc + parseFloat(item.interestAmount || 0), 0);

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                    <Text style={styles.head}>Advance {reportType} Report</Text>
                </View>

                <View style={styles.table}>
                    <View style={[styles.tableRow, styles.headerCell]}>
                        <Text style={[styles.tableCell, { flex: 0.5 }]}>#</Text>
                        <Text style={[styles.tableCell, { flex: 1.2 }]}>Date</Text>
                        <Text style={[styles.tableCell, { flex: 1.2 }]}>Loan No</Text>
                        <Text style={[styles.tableCell, { flex: 2 }]}>Name</Text>

                        {reportType === 'interest' ? (
                            <>
                                <Text style={[styles.tableCell, { flex: 1.5 }]}>Interest Amount (₹)</Text>
                            </>
                        ) : (
                            <>
                                <Text style={[styles.tableCell, { flex: 1 }]}>Total Weight (g)</Text>
                                <Text style={[styles.tableCell, { flex: 1 }]}>Net Weight (g)</Text>
                                <Text style={[styles.tableCell, { flex: 1 }]}>Interest</Text>
                                <Text style={[styles.tableCell, { flex: 1.5 }]}>Amount (₹)</Text>
                            </>
                        )}

                        <Text style={[styles.tableCell, { flex: 1 }]}>Status</Text>
                    </View>

                    {data.length === 0 ? (
                        <View style={styles.tableRow}>
                            <Text style={[styles.tableCell, { textAlign: 'center', flex: 6 }]}>No data available</Text>
                        </View>
                    ) : (
                        data.map((item, index) => (
                            <View key={index} style={styles.tableRow}>
                                <Text style={[styles.tableCell, { flex: 0.5 }]}>{index + 1}</Text>
                                <Text style={[styles.tableCell, { flex: 1.2 }]}>{reportType === "interest"
                                    ? formatDate(item.interest_receive_date)
                                    : reportType === "closing"
                                        ? formatDate(item.pawnjewelry_recovery_date)
                                        : formatDate(item.pawnjewelry_date)}</Text>
                                <Text style={[styles.tableCell, { flex: 1.2 }]}>{item.loanNo}</Text>
                                <Text style={[styles.tableCell, { flex: 2 }]}>{item.name}</Text>

                                {reportType === 'interest' ? (
                                    <>
                                        <Text style={[styles.tableCell, { flex: 1.5 }]}>
                                            {item.interestAmount ? item.interestAmount.toFixed(2) : '0.00'}
                                        </Text>
                                    </>
                                ) : (
                                    <>
                                        <Text style={[styles.tableCell, { flex: 1 }]}>
                                            {item.totalWeight || '—'}
                                        </Text>
                                        <Text style={[styles.tableCell, { flex: 1 }]}>
                                            {item.totalnetWeight || '—'}
                                        </Text>
                                        <Text style={[styles.tableCell, { flex: 1 }]}>
                                            {item.interestRateLabel || '—'}
                                        </Text>
                                        <Text style={[styles.tableCell, { flex: 1.5 }]}>
                                            {item.totalAmount != null ? parseFloat(item.totalAmount).toLocaleString() : '—'}
                                        </Text>
                                    </>
                                )}

                                <Text style={[styles.tableCell, { flex: 1 }]}>
                                    {item.status === "நகை மீட்கபடவில்லை" ? "OutStanding" : item.status === "Interest Paid" ? "Interest paid" : "Closing"}
                                </Text>
                            </View>
                        ))
                    )}

                    <View style={[styles.tableRow, styles.totalCell]}>
                        <Text style={[styles.tableCell, { flex: 1.05 }]}></Text>
                        <Text style={[styles.tableCell, { flex: 2 }]}></Text>
                        <Text style={[styles.tableCell, { flex: 2 }]}>Total</Text>

                        {reportType === 'interest' ? (
                            <>
                                <Text style={[styles.tableCell, { flex: 1.5 }]}>{totalInterest.toFixed(2)}</Text>
                            </>
                        ) : (
                            <>
                                <Text style={[styles.tableCell, { flex: 1 }]}>{totalWeight.toFixed(2)}</Text>
                                 <Text style={[styles.tableCell, { flex: 1 }]}>{totalnetWeight.toFixed(2)}</Text>
                                 <Text style={[styles.tableCell, { flex: 1 }]}></Text>
                                <Text style={[styles.tableCell, { flex: 1.5 }]}>{totalAmount.toLocaleString()}</Text>
                            </>
                        )}

                        <Text style={[styles.tableCell, { flex: 1 }]}></Text>
                    </View>
                </View>
            </Page>
        </Document>
    );
};

export default AdvanceReportPDF;
