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
    borderColor: "#3396D3",
    color: "black",
    borderBottomWidth: 1,
    minHeight: "50%",
  },
  normalText: {
    fontFamily: "fontRegular",
    fontSize: 8,
    margin: 8,
  },
  boldText: {
    fontFamily: "fontRegular",
    fontSize: 10,
    textAlign: "left",
  },
  boldTextCenter: {
    fontFamily: "fontRegular",
    fontSize: 12,
    textAlign: "center",
    marginTop: 8,
  },
  table: {
    display: "table",
    fontFamily: "fontRegular",
    flexDirection: "column",
    width: "100%",
    borderBottom: 1,

    fontSize: 8,
    borderColor: "#3396D3",
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
    width: 100,
    maxHeight: 80,
  },
  addressText: {
    marginTop: 8,
    fontSize: 8,
  },
  headerNote: {
    fontFamily: "fontRegular",
    marginTop: 8,
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
    fontFamily: "fontRegular",
    fontSize: 8,
  },

  tamilTable: {
    margin: 15,
    border: "1pt solid #3396D3",
    backgroundColor: "#FFFFFF",
  },
  tamilHeader: {
    flexDirection: "row",
    backgroundColor: "#BBD6FF",
    borderBottom: "1pt solid #3396D3",
    paddingVertical: 5,
  },
  tamilHeaderLeft: {
    width: "50%",
    fontFamily: "fontRegular",
    fontSize: 9,
    paddingLeft: 5,
    color: "black",
  },
  tamilHeaderRight: {
    width: "50%",
    fontFamily: "fontRegular",
    fontSize: 9,
    textAlign: "right",
    paddingRight: 5,
    color: "black",
  },
  tamilRow: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderBottom: "1pt solid #3396D3",
    paddingVertical: 5,
  },
  tamilRowAlt: {
    flexDirection: "row",
    backgroundColor: "#F2F7FF",
    borderBottom: "1pt solid #3396D3",
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

    backgroundColor: "#E6EEFF",
    paddingVertical: 5,
  },
  tamilTotalLeft: {
    width: "50%",
    fontFamily: "fontRegular",
    fontSize: 9,
    paddingLeft: 5,
    color: "black",
  },
  tamilTotalRight: {
    width: "50%",
    fontFamily: "fontRegular",
    fontSize: 9,
    textAlign: "right",
    paddingRight: 5,
    color: "black",
  },
  tableCell: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  footer: {
    flexDirection: "row",
    color: "black",
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
            <Text>Ph: 9600628220{"\n"} 7903847979</Text>
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
            <Text style={styles.boldTextCenter}>வட்டி மீட்பு ரசீது</Text>
          </View>
        </View>
      </View>

      {/* Customer Details */}
      <View style={styles.customerDetail}>
        {[
          `1.அடகு எண்: ${data.receipt_no} `,
          `2.அடகு வைத்த தேதி: ${data.pawnjewelry_date} `,
          `3.நகை மீட்பு தேதி ${data.pawnjewelry_recovery_date} `,
          `4.பெயர்:${data.name} `,
          `5.அடகு தொகை:${data.original_amount} `,
          `6.வட்டி வரவு தொகை:${data.interest_paid} `,
          `7.வட்டி நிலுவை  தொகை: 0.00 `,
        ].map((text, i) => (
          <View key={i} style={styles.detailsRow}>
            <Text style={styles.detailLabel}>{text}</Text>
          </View>
        ))}
      </View>

      {/* Tamil Table */}
      <View style={styles.tamilTable}>
        <View style={styles.tamilHeader}>
          <Text style={styles.tamilHeaderLeft}>விவரங்கள் </Text>
          <Text style={styles.tamilHeaderRight}>தொகை </Text>
        </View>

        <View style={styles.tamilRow}>
          <Text style={styles.tamilCellLeft}>நகை மீட்பு வாபஸ் தொகை </Text>
          <Text style={styles.tamilCellRight}>
            {data.original_amount + data.interest_paid}
          </Text>
        </View>

        <View style={styles.tamilRow}>
          <Text style={styles.tamilCellLeft}>வட்டி நிலுவை தொகை </Text>
          <Text style={styles.tamilCellRight}>0.00</Text>
        </View>

        <View style={styles.tamilTotal}>
          <Text style={styles.tamilTotalLeft}>மொத்த தொகை .</Text>
          <Text style={styles.tamilTotalRight}>
            {data.original_amount + data.interest_paid}
          </Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.time}>
          <Text style={styles.boldText}>கையொப்பம் (வாடிக்கையாளர்) </Text>
        </View>
        <View style={styles.phone}>
          <Text style={styles.boldText}>கையொப்பம் (கிளை அலுவலர்) </Text>
        </View>
      </View>
    </View>
  );
};

// 📘 Document Wrapper
const JewelryRecoveryPDF = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Receipt data={data} />
    </Page>
  </Document>
);

export default JewelryRecoveryPDF;
