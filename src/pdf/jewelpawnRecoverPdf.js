import React, { useState, useEffect } from "react";
import {
  Document,
  Page,
  Text,
  Image,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { Font } from "@react-pdf/renderer";
import fontBold from "./fonts/NotoSansTamil-Bold.ttf";
import fontRegular from "./fonts/NotoSansTamil-Regular.ttf";
import { BsTransparency } from "react-icons/bs";

const formatDate = (dateString) => {
  const date = new Date(dateString);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() returns month from 0-11
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

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
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: "#fff",
    padding: 10,
  },
  quarterPage: {
    width: "50%", // Half width
    height: "50%", // Half height
    padding: 5,
  },
  dupe: {
    //flexGrow: 1,
    border: 1,
    borderColor: "#4535C1",
    letterSpacing: 0.5,
    color: "#4535C1",
    borderBottomWidth: 1,
    minHeight: "50%",
  },
  normalText: {
    fontFamily: "fontRegular",
    fontWeight: "normal",
    fontSize: 8,
    margin: 8,
  },
  boldText: {
    fontFamily: "fontBold",
    fontWeight: "bold",
    fontSize: 10,
    textAlign: "left",
  },
  boldTextone: {
    fontFamily: "fontBold",
    fontWeight: "bold",
    fontSize: 12,
    textAlign: "center",
    marginTop: 5,
  },
  table: {
    display: "table",
    fontFamily: "fontRegular",
    flexDirection: "column",
    width: "100%",
    borderBottom: 1,
    borderTop: 1,
    fontSize: 8,
    borderColor: "#4535C1",
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "center",
  },
  tableRow1: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingRight: 8,
  },
  company: {
    width: "100%",
    fontFamily: "fontRegular",
    textAlign: "center",
    alignItems: "center",
    paddingVertical: 5,
  },
  dateCell: {
    width: "100%",
    padding: 5,
    fontSize: 8,
  },
  pad: {
    paddingVertical: 3,
  },
  customerdetail: {
    paddingTop: 8,
    paddingHorizontal: 8,
    display: "flex",
    fontSize: 8,
  },
  details: {
    paddingVertical: 4,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  state: {
    width: "40%",
    fontFamily: "fontBold",
    fontWeight: "bold",
    fontSize: 8,
  },
  storename: {
    textAlign: "center",
    fontFamily: "fontBold",
    fontSize: 12,
    letterSpacing: 0.5,
    fontWeight: "bold",
  },
  tamilTable: {
    margin: 15,
    border: "1pt solid #4535C1",
  },
  tamilTableRowHeader: {
    flexDirection: "row",
    borderBottom: "1pt solid #4535C1",
    paddingVertical: 5,
  },
  tamilTableRow: {
    flexDirection: "row",
    paddingVertical: 5,
  },
  tamilTableRowTotal: {
    flexDirection: "row",
    borderTop: "1pt solid #4535C1",
    paddingVertical: 5,
    marginTop: 4,
    paddingTop: 3,
  },
  tamilCellLeft: {
    width: "50%",
    fontSize: 8,
    paddingLeft: 5,
    textAlign: "left",
  },
  tamilCellRight: {
    width: "50%",
    textAlign: "right",
    fontSize: 8,
    paddingRight: 5,
  },
  tamilCellLeftBold: {
    width: "50%",
    fontSize: 8,
    fontWeight: "bold",
    paddingLeft: 5,
    textAlign: "left",
  },
  tamilCellRightBold: {
    width: "50%",
    textAlign: "right",
    fontSize: 8,
    fontWeight: "bold",
    paddingRight: 5,
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
  },
  logoImage: {
    width: 60,
    maxHeight: 50,
  },
  tableCell: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#4535C1",
  },
  footer: {
    display: "flex",
    fontFamily: "fontRegular",
    flexDirection: "row",
    color: "#4535C1",
    marginTop: "auto",
    padding: 10,
  },
  time: {
    width: "50%",
    alignItems: "flex-start",
    fontSize: 8,
    fontFamily: "fontRegular",
  },
  phone: {
    width: "50%",
    alignItems: "flex-end",
    fontSize: 8,
    fontFamily: "fontRegular",
  },
  termpoint: {
    paddingVertical: 8,
  },
  headdivright: {
    fontSize: 8,
    textAlign: "right",
  },
  headright: {
    paddingLeft: 22,
  },
});
const Receipt = ({ data }) => {
  console.log("data", data);

  const formattedDate = formatDate(data.pawnjewelry_recovery_date);

  return (
    <View style={styles.dupe}>
      <View style={styles.font}>
        <View style={styles.table}>
          <View style={styles.tableCell}>
            <Text style={styles.pad}>
              <Text style={styles.normalText}> BBL NO : 04/2019 - 20120 </Text>
            </Text>
            <View style={styles.headdivright}>
              <Text> Ph : 9080909996 </Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.company}>
              <View style={styles.logoContainer}>
                <Image src="/logo192.png" style={styles.logoImage} />
              </View>
              <Text style={styles.storename}> அபிநயா பைனான்ஸ் </Text>
              <Text style={{ marginTop: 3, fontSize: 8 }}>
                "அபிநயா அடகுக்கடை" மார்க்கெட் ரோடு, அரசு மருத்துவமனை எதிரில்,
                சோழவந்தான், மதுரை மாவட்டம் – 625214 .
              </Text>
              <Text></Text>
              <Text></Text>
              <Text style={styles.boldText}>
                (அரசு அங்கீகாரம் பெற்ற நிறுவனம்)
              </Text>
              <Text style={styles.boldTextone}>Loan Closure receipt</Text>
            </View>
          </View>
        </View>
        <View style={styles.customerdetail}>
          <View style={styles.details}>
            <Text style={styles.state}>1.customer number: </Text>
            <Text> {data.customer_no} </Text>
          </View>
          <View style={styles.details}>
            <Text style={styles.state}>2.loan number: </Text>
            <Text> {data.receipt_no} </Text>
          </View>
          <View style={styles.details}>
            <Text style={styles.state}>3.Name : </Text>
            <Text> {data.name} </Text>
          </View>
          <View style={styles.details}>
            <Text style={styles.state}>4.Loan Closing Date :</Text>
            <Text> {formattedDate} </Text>
          </View>
        </View>
        <View style={styles.tamilTable}>
          <View style={styles.tamilTableRowHeader}>
            <Text style={[styles.tamilCellLeft, styles.boldText]}>
              Particulars
            </Text>
            <Text style={[styles.tamilCellRight, styles.boldText]}>Amount</Text>
          </View>
          <View style={styles.tamilTableRow}>
            <Text style={styles.tamilCellLeft}>Principal Receive</Text>
            <Text style={styles.tamilCellRight}>{data.refund_amount}</Text>
          </View>
          <View style={styles.tamilTableRow}>
            <Text style={styles.tamilCellLeft}>Interest Receive</Text>
            <Text style={styles.tamilCellRight}>
              {parseFloat(data.interest_income) +
                parseFloat(data.interest_paid)}
            </Text>
          </View>
          <View style={styles.tamilTableRow}>
            <Text style={styles.tamilCellLeft}>Others Charges</Text>
            <Text style={styles.tamilCellRight}>{data.other_amount}</Text>
          </View>

          <View style={styles.tamilTableRowTotal}>
            <Text style={[styles.tamilCellLeftBold, styles.boldText]}>
              Total Amount
            </Text>
            <Text style={[styles.tamilCellRightBold, styles.boldText]}>
              {parseFloat(data.refund_amount) +
                parseFloat(data.interest_income) +
                parseFloat(data.interest_paid) +
                parseFloat(data.other_amount)}
            </Text>
          </View>
        </View>
        <View style={styles.footer}>
          <View style={styles.time}>
            <View style={styles.termpoint}>
              <Text style={styles.boldText}>Payer's signature </Text>
            </View>
          </View>
          <View style={styles.phone}>
            <View style={styles.termpoint}>
              <Text style={styles.boldText}>For அபிநயா பைனான்ஸ் </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const JewelryRecoveryPDF = ({ data }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.quarterPage}>
          <Receipt data={data} />
        </View>
        <View style={styles.quarterPage}>
          <Receipt data={data} />
        </View>
        {/* <View style={styles.quarterPage}>
          <Receipt data={data} />
        </View>
        <View style={styles.quarterPage}>
          <Receipt data={data} />
        </View> */}
      </Page>
    </Document>
  );
};

export default JewelryRecoveryPDF;
