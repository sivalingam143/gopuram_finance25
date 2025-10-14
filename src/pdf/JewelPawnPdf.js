import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";

import fontRegular from "./fonts/NotoSansTamil-Regular.ttf";
import fontBold from "./fonts/NotoSansTamil-Bold.ttf";

import logo from "./images/logo.png"; // red logo top center
import watermark from "./images/back.png"; // background watermark

// Register Tamil font
Font.register({
  family: "NotoSansTamil",
  src: fontRegular,
});
Font.register({
  family: "fontBold",
  fonts: [{ src: fontBold, fontStyle: "normal", fontWeight: "bold" }],
});

const styles = StyleSheet.create({
  page: {
    fontFamily: "NotoSansTamil",
    fontSize: 8,
    padding: 30,
  },
  borderWrapper: {
    border: "1 solid #000080",
    padding: 4,
    position: "relative",
    marginBottom: 20,
  },
  headerContainer: {
    alignItems: "center",
    borderBottom: "1 solid #000080",
    paddingBottom: 8,
    marginBottom: 8,
    position: "relative",
  },

  phoneWrapper: {
    position: "absolute",
    right: 0,
    top: 0,
    padding: 4,
  },

  phoneText: {
    fontSize: 8,
    color: "#dd2b1c",
  },

  logoCentered: {
    width: 70,
    maxHeight: 70,
    objectFit: "contain",
    marginBottom: 4,
  },
  heading: {
    fontFamily: "fontBold",
    textAlign: "center",
    fontWeight: "bold",
    color: "#000080",
    marginBottom: 10,
    fontSize: 10,
    border: "1 solid #000080",
    borderRadius: 10,
    padding: 5,
    alignSelf: "center",
  },
  item: {
    marginBottom: 8,
    lineHeight: 1.5,
    color: "#000080",
    fontSize: 8,
  },
  borderBox: {
    border: "1 solid #000080",
    padding: 15,
    marginBottom: 20,
  },
  brandName: {
    fontSize: 18,
    fontWeight: 900, // closest to your image-bold
    color: "#dd2b1c",
    fontFamily: "fontBold", // Make sure it's applied
  },

  subHeader: {
    fontSize: 8,
    color: "#000080",
    marginTop: 2,
  },

  watermark: {
    position: "absolute",
    top: "5%",
    left: "17%",
    width: 350,
    maxHeight: 350,
    opacity: 0.2,
  },
  detailsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
    borderBottom: "1 solid #000080",
    paddingBottom: 6,
  },
  detailsCol: {
    width: "65%",
    paddingLeft: 20,
  },
  detailsCol1: {
    width: "35%",
  },
  pad: {
    marginTop: 10,
  },
  label: {
    fontWeight: "bold",
    color: "#000080",
  },
  tableHeader: {
    flexDirection: "row",

    border: "1 solid #000080",
    marginTop: 10,
  },
  th: {
    padding: 4,
    borderRight: "1 solid #000080",
    fontFamily: "fontBold",
    fontSize: 8,
    color: "#dd2b1c",
    textAlign: "center",
  },
  td: {
    padding: 3,
    borderRight: "1 solid #000080",
    textAlign: "center",
  },
  colWidths: {
    col0: { width: "10%" },
    col1: { width: "40%" },
    col2: { width: "15%" },
    col3: { width: "15%" },
    col4: { width: "20%", borderRight: "none" },
  },
  row: {
    flexDirection: "row",
    borderLeft: "1 solid #000080",
    borderRight: "1 solid #000080",
    borderBottom: "1 solid #000080",
  },
  note: {
    fontSize: 8,
    marginTop: 10,
    textAlign: "left",
    padding: 5,

    color: "#000080",
  },
  signature: {
    marginTop: 15,
    textAlign: "right",
    paddingRight: 20,

    fontSize: 8,
    color: "#000080",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 10,
    marginBottom: 5,
  },
  leftText: {
    width: "50%",
    textAlign: "left",
  },
  rightPhoneWrapper: {
    width: "50%",
    flexDirection: "column",
    textAlign: "right",
    alignItems: "flex-end",
  },
});

const LoanReceiptPDF = ({ data }) => {
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };
  const totdays = data.Jewelry_recovery_agreed_period * 30;
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.borderWrapper}>
          {/* <Image src={watermark} style={styles.watermark} /> */}

          <View style={styles.headerContainer}>
            <View style={styles.topRow}>
              <Text style={[styles.leftText, styles.phoneText]}>
                BBL NO : 04/2019 - 20120
              </Text>

              <View style={styles.rightPhoneWrapper}>
                <Text style={styles.phoneText}> போன் நம்பர் : 9080909996 </Text>
              </View>
            </View>

            {/* Centered Logo and Titles */}
            {/* <Image src={logo} style={styles.logoCentered} /> */}

            <Text style={styles.brandName}> அபிநயா பைனான்ஸ் </Text>
            <Text style={styles.subHeader}>
              {" "}
              (அரசு அங்கீகாரம் பெற்ற நிறுவனம்){" "}
            </Text>
            <Text style={styles.subHeader}>
              {" "}
              "அபிநயா அடகுக்கடை" மார்க்கெட் ரோடு, அரசு மருத்துவமனை எதிரில்,
              சோழவந்தான், மதுரை மாவட்டம் – 625214 .
            </Text>
          </View>

          <View style={styles.detailsRow}>
            <View style={styles.detailsCol}>
              <Text style={styles.pad}>
                <Text style={styles.label}> கடன் தேதி :</Text>{" "}
                {formatDate(data.pawnjewelry_date)}{" "}
              </Text>
              <Text style={styles.pad}>
                <Text style={styles.label}> வாடிக்கையாளர் பெயர் :</Text>{" "}
                {data.name}{" "}
              </Text>
              <Text style={styles.pad}>
                <Text style={styles.label}> வாடிக்கையாளர் முகவரி :</Text>{" "}
                {data.customer_details}{" "}
              </Text>
            </View>
            <View style={styles.detailsCol1}>
              <Text style={styles.pad}>
                <Text style={styles.label}> வாடிக்கையாளர் எண் :</Text>{" "}
                {data.customer_no}{" "}
              </Text>
              <Text style={styles.pad}>
                <Text style={styles.label}> கடன் எண் :</Text> {data.receipt_no}{" "}
              </Text>
              <Text style={styles.pad}>
                <Text style={styles.label}> கடன் தொகை :</Text> ₹
                {data.original_amount}{" "}
              </Text>
              <Text style={styles.pad}>
                <Text style={styles.label}> கடன் காலம் :</Text>{" "}
                {data.Jewelry_recovery_agreed_period}{" "}
              </Text>
            </View>
          </View>

          <View style={styles.tableHeader}>
            <Text style={[styles.th, styles.colWidths.col0]}> வ.எண். </Text>
            <Text style={[styles.th, styles.colWidths.col1]}>
              {" "}
              அடகு பொருளின் விவரம்{" "}
            </Text>
            <Text style={[styles.th, styles.colWidths.col2]}> எண்ணிக்கை </Text>
            <Text style={[styles.th, styles.colWidths.col3]}> மொத்த எடை </Text>
            <Text style={[styles.th, styles.colWidths.col4]}> குறிப்பு </Text>
          </View>

          {(data.jewel_product || []).map((item, idx) => (
            <View style={styles.row} key={idx}>
              <Text style={[styles.td, styles.colWidths.col0]}>
                {" "}
                {idx + 1}{" "}
              </Text>
              <Text style={[styles.td, styles.colWidths.col1]}>
                {" "}
                {item.JewelName}{" "}
              </Text>
              <Text style={[styles.td, styles.colWidths.col2]}>
                {" "}
                {item.count}{" "}
              </Text>
              <Text style={[styles.td, styles.colWidths.col3]}>
                {" "}
                {item.net}{" "}
              </Text>
              <Text style={[styles.td, styles.colWidths.col4]}>
                {" "}
                {item.remark}{" "}
              </Text>
            </View>
          ))}

          <Text style={styles.note}>
            இந்த கடன் தொகை இன்றைய தேதியில் இருந்து {totdays} நாட்களுக்கு அல்லது
            நிறுவனம் கேட்டு கொள்ளும் நாட்களுக்கு முன்பாக செலுத்தி விடுகிறேன் என
            உறுதி கூறுகிறேன்.
          </Text>

          <Text style={styles.signature}> கடன்தாரர் கையொப்பம் </Text>
        </View>
        {/* <View style={styles.borderBox}>
          <Text style={styles.heading}> விதிமுறைகள் மற்றும் நிபந்தனைகள் </Text>

          <Text style={styles.item}>1. குறைந்த பட்சமாக 15 நாட்களுக்கான வட்டி அல்லது ரூ.₹100 இதில் எது அதிகமோ அது வசூலிக்கப்படும். </Text>
          <Text style={styles.item}>2. சட்ட விரோத காரியங்களுக்கு இந்த கடன் தொகை உபயோகப்படுத்தப்படமாட்டாது என்பதை கடன்தாரர் உறுதி செய்கிறார். {" "} </Text>
          <Text style={styles.item}>3. முகவரி மாற்றத்தை எழுத்து மூலம் கொடுத்து ஒப்புகை பெற்றுக்கொள்ள வேண்டும். இல்லாத பட்சத்தில்  {" "} வாடிக்கையாளர்கள் {" "} விண்ணப்பபடிவத்தில் தெரிவித்துள்ள முகவரி மாத்திரமே அனைத்து காரியங்களுக்கும் பயன்படுத்தி கொள்ளப்படும். </Text>
          <Text style={styles.item}>4. கடனில் பகுதி தொகை மட்டும் செலுத்தும் பட்சத்தில் முதலாவது வட்டி கழிக்கப்பட்டு எஞ்சிய தொகை மாத்திரமே {" "} அசலில் {" "} வரவு வைக்கப்படும். </Text>
          <Text style={styles.item}>5. கடன் காலம் காலாவதியாவதற்குள் அல்லது நிறுவனம் சொன்ன தேதியிலே கடன் பெற்றவர் முழுத் தொகையும் {" "}  செலுத்த {" "} தவறினால் {" "} அடமானம் வைக்கப்ட்ட நகைகளை நிறுவனம் கடன்தாரர்க்கு 2 வார கால நோட்டீஸ் கொடுத்தபிறகு {" "} நிறுவனம் {" "} ஏலத்தில் விடும். நகை ஏலம் விட்டபின் பற்றாக்குறை இருக்குமாயின் கடன்தாரரிடமிருந்து {" "} வசூலிக்கப்டும்.{" "} </Text>
          <Text style={styles.item}>6. தங்கநகை அதிகபட்ச விற்பனை தொகை நகைக்கடனுக்கு வரவேண்டிய அசல் வட்டி இதர தொகையை விட {" "} குறைவாக {" "} இருக்கும் பட்சத்தில் கடனுக்கு வழங்கப்பட்ட அவகாசத்திற்கு முன்னதாகவே நகைகளை ஏலத்தில் விட {" "} நிர்வாகத்திற்கு {" "} முழு அதிகாரம் உண்டு. இது சம்பந்தமாக கடன்தார்களுக்கு 10 நாட்களுக்குள் அசல் மற்றும் வட்டியினை {" "} செலுத்தும்படி {" "} அறிவுறுத்தும் கடிதம் பதிவு தபால் மூலம் அனுப்பி வைக்கப்படும். </Text>
          <Text style={styles.item}>7. கடன்தாரர் தெரிவிக்கும் தங்கத்தின் தரத்தினைஅப்படியே ஏற்றுக் கொண்டு கடன் வழங்கப்படுகின்றது. பின்நாளில் மேற்படி நகை தரம் குறைந்தது அல்லது போலியானது என்று கண்டுபிடிக்கபட்டால் கடன்தாரர் மீது சிவில் மற்றும் கிரிமினல் {" "} வழக்கு {" "} தொடரப்பட்டு கடன் வசூலிக்கப்படும. இதற்காகும் செலவுகளுக்கெல்லாம் கடன்தாரர் பொறுப்பாவார். {" "} </Text>
          <Text style={styles.item}>8. மேலே உள்ள அனைத்து விதி முறைகளையும் மற்றும் நிபந்தனைகளையும் நன்கு அறிந்து கொண்டேன். </Text>

          <Text style={styles.signature}> கடன்தாரர் கையொப்பம் </Text>
        </View> */}
      </Page>
    </Document>
  );
};

export default LoanReceiptPDF;
