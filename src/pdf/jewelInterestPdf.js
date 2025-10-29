import React from "react";
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

// 📅 Format Date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

// 🔤 Register Tamil Fonts
Font.register({
  family: "fontBold",
  fonts: [{ src: fontBold, fontStyle: "normal", fontWeight: "bold" }],
});
Font.register({
  family: "fontRegular",
  fonts: [{ src: fontRegular, fontStyle: "normal", fontWeight: "normal" }],
});

// 🎨 Styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 10,
  },
  dupe: {
    border: 1,
    borderColor: "#4535C1",
    color: "#4535C1",
    borderBottomWidth: 1,
    minHeight: "50%",
  },
  normalText: {
    fontFamily: "fontRegular",
    fontSize: 8,
    margin: 8,
  },
  boldText: {
    fontFamily: "fontBold",
    fontSize: 10,
    textAlign: "left",
  },
  boldTextCenter: {
    fontFamily: "fontBold",
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
  tableRowRight: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingRight: 8,
  },
  company: {
    width: "100%",
    textAlign: "center",
    alignItems: "center",
    paddingVertical: 5,
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
  },
  logoImage: {
    width: 80,
    maxHeight: 60,
  },
  addressText: {
    marginTop: 3,
    fontSize: 8,
  },
  headerNote: {
    fontFamily: "fontBold",
    fontSize: 8,
  },
  dateCell: {
    width: "100%",
    padding: 5,
    fontSize: 8,
  },
  pad: {
    paddingVertical: 3,
  },
  headRight: {
    fontSize: 8,
    textAlign: "right",
  },
  customerDetail: {
    paddingTop: 8,
    paddingHorizontal: 8,
    fontSize: 8,
  },
  detailsRow: {
    paddingVertical: 4,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  detailLabel: {
    width: "40%",
    fontFamily: "fontBold",
    fontSize: 8,
  },

  tamilTable: {
    margin: 15,
    border: "0.8pt solid #3A5ACB",
    backgroundColor: "#FFFFFF",
  },
  tamilHeader: {
    flexDirection: "row",
    backgroundColor: "#BBD6FF",
    borderBottom: "0.8pt solid #3A5ACB",
    paddingVertical: 5,
  },
  tamilHeaderLeft: {
    width: "50%",
    fontFamily: "fontBold",
    fontSize: 9,
    paddingLeft: 5,
    color: "#3A5ACB",
  },
  tamilHeaderRight: {
    width: "50%",
    fontFamily: "fontBold",
    fontSize: 9,
    textAlign: "right",
    paddingRight: 5,
    color: "#3A5ACB",
  },
  tamilRow: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderBottom: "0.5pt solid #BBD6FF",
    paddingVertical: 5,
  },
  tamilRowAlt: {
    flexDirection: "row",
    backgroundColor: "#F2F7FF",
    borderBottom: "0.5pt solid #BBD6FF",
    paddingVertical: 5,
  },
  tamilCellLeft: {
    width: "50%",
    fontFamily: "fontRegular",
    fontSize: 8,
    paddingLeft: 5,
  },
  tamilCellRight: {
    width: "50%",
    fontFamily: "fontRegular",
    fontSize: 8,
    textAlign: "right",
    paddingRight: 5,
  },
  tamilTotal: {
    flexDirection: "row",
    borderTop: "0.8pt solid #3A5ACB",
    backgroundColor: "#E6EEFF",
    paddingVertical: 5,
  },
  tamilTotalLeft: {
    width: "50%",
    fontFamily: "fontBold",
    fontSize: 9,
    paddingLeft: 5,
    color: "#3A5ACB",
  },
  tamilTotalRight: {
    width: "50%",
    fontFamily: "fontBold",
    fontSize: 9,
    textAlign: "right",
    paddingRight: 5,
    color: "#3A5ACB",
  },
  tableCell: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  footer: {
    flexDirection: "row",
    color: "#4535C1",
    marginTop: "auto",
    padding: 10,
  },
  time: {
    width: "50%",
    alignItems: "flex-start",
    fontSize: 8,
  },
  phone: {
    width: "50%",
    alignItems: "flex-end",
    fontSize: 8,
  },
  termpoint: {
    paddingVertical: 8,
  },
  headdivright: {
    fontSize: 8,
    textAlign: "right",
  },
  headright: {
    paddingLeft: 15,
  },
});

// 📄 Main Receipt Component
const Receipt = ({ data }) => {
  const formattedDate = formatDate(data.interest_receive_date);

  return (
    <View style={styles.dupe}>
      {/* Header Section */}
      <View style={styles.table}>
        <View style={styles.tableCell}>
          <Text style={styles.pad}>
            <Text style={styles.normalText}>
              {" "}
              உரிமம் எண் : FR Madhurai South/50/2004
            </Text>
          </Text>
          <View style={styles.headdivright}>
            <Text>Ph: 9600628220 </Text>
          </View>
        </View>

        <View style={styles.tableRow}>
          <View style={styles.company}>
            <View style={styles.logoContainer}>
              <Image src="/logo192.png" style={styles.logoImage} />
            </View>
            <Text style={styles.addressText}>
              ஹாஜியார் காம்ப்லெஸ் ,உசிலை ரோடு ,பேரையூர் -625703.
            </Text>
            <Text style={styles.headerNote}>
              (அலுவலகம் திறந்திருக்கும் நேரம் காலை 9.00 மணி முதல் மாலை 6.00 மணி
              வரை)
            </Text>
            <Text style={styles.boldTextCenter}>வட்டி கட்டிய ரசீது</Text>
          </View>
        </View>
      </View>

      {/* Customer Details */}
      <View style={styles.customerDetail}>
        {[
          `1.அடகு எண்: ${data.customer_no}`,
          "2.அடகு வைத்த தேதி:",
          "3.வட்டி பெறும் தேதி:",
          "4.பெயர்:",
          "5.அடகு தொகை:",
          "6.வட்டி விகிதம்:",
          "7.ஒரு மாத வட்டி தொகை:",
          "8.வட்டி நிலுவை காலம்:",
          "9.வட்டி வரவு தொகை:",
        ].map((text, i) => (
          <View key={i} style={styles.detailsRow}>
            <Text style={styles.detailLabel}>{text}</Text>
          </View>
        ))}
      </View>

      {/* Tamil Table */}
      <View style={styles.tamilTable}>
        <View style={styles.tamilHeader}>
          <Text style={styles.tamilHeaderLeft}>விவரங்கள்</Text>
          <Text style={styles.tamilHeaderRight}>தொகை</Text>
        </View>

        <View style={styles.tamilRow}>
          <Text style={styles.tamilCellLeft}>வட்டி கட்டிய தொகை</Text>
          <Text style={styles.tamilCellRight}>600.00</Text>
        </View>

        <View style={styles.tamilRowAlt}>
          <Text style={styles.tamilCellLeft}>Closing Charges</Text>
          <Text style={styles.tamilCellRight}>0.00</Text>
        </View>

        <View style={styles.tamilTotal}>
          <Text style={styles.tamilTotalLeft}>மொத்த தொகை</Text>
          <Text style={styles.tamilTotalRight}>600.00</Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.time}>
          <Text style={styles.boldText}>Payer's Signature</Text>
        </View>
        <View style={styles.phone}>
          <Text style={styles.boldText}>For</Text>
        </View>
      </View>
    </View>
  );
};

// 📘 Document Wrapper
const ReceiptPDF = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Receipt data={data} />
    </Page>
  </Document>
);

export default ReceiptPDF;
