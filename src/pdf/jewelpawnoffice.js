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
import logo from ".././components/sidebar/images/pngegg.png";
import watermark from ".././components/sidebar/images/pngegg.png";
import customerPhoto from "./images/customer.png";
import jewelPhoto from "./images/jewel.png";
import tamilRegular from "./fonts/NotoSansTamil-Regular.ttf";
import tamilBold from "./fonts/NotoSansTamil-Bold.ttf";

Font.register({ family: "NotoTamil", src: tamilRegular });
Font.register({ family: "NotoTamil-Bold", src: tamilBold });

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 8,
    fontFamily: "NotoTamil",
    backgroundColor: "#F9FAFB",
    position: "relative",
  },
  watermark: {
    position: "absolute",
    top: "20%",
    left: "6%",
    width: 550,
    opacity: 0.08,
  },
  header: {
    alignItems: "center",
    marginBottom: 15,
    borderBottom: "1px solid #E5E7EB",
    paddingBottom: 10,
  },
  headerLogo: {
    width: 100,
    marginBottom: 5,
  },
  title: {
    fontSize: 16,
    fontFamily: "NotoTamil-Bold",
    color: "#dd2b1c",
    marginBottom: 3,
  },
  subText: {
    fontSize: 8,
    color: "#4B5563",
  },
  officeCopy: {
    fontSize: 10,
    fontFamily: "NotoTamil-Bold",
    color: "#DC2626",
    textAlign: "right",
    marginBottom: 10,
  },
  section: {
    marginBottom: 15,
    //backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 5,
    border: "1px solid #E5E7EB",
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  infoItem: {
    flexDirection: "row",
    width: "35%",
    marginBottom: 6,
  },

  label: {
    fontFamily: "NotoTamil-Bold",
    fontSize: 8,
    color: "#111827",
    minWidth: 40,
  },

  value: {
    fontSize: 8,
    color: "#1F2937",
    flexShrink: 1,
  },

  imageRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  imageBox: {
    width: 80,
    height: 80,
    border: "1px solid #D1D5DB",
    borderRadius: 5,
    overflow: "hidden",
    backgroundColor: "#F3F4F6",
  },
  boxedText: {
    // backgroundColor: '#FFFFFF',
    border: "1px solid #E5E7EB",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    lineHeight: 1.4,
    fontSize: 8,
    color: "#1F2937",
  },
  signatureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    paddingTop: 10,
    //borderTop: '1px solid #E5E7EB',
  },
  signatureText: {
    fontSize: 8,
    fontFamily: "NotoTamil-Bold",
    color: "#374151",
  },
  loanParagraph: {
    fontSize: 8,
    fontFamily: "NotoTamil",
    lineHeight: 1.5,
    textAlign: "justify",
  },
  sectionTitle: {
    fontFamily: "NotoTamil-Bold",
    padding: 10,
  },
  inlineText: {
    fontSize: 8,
    fontFamily: "NotoTamil-Bold",
    color: "#111827",
  },
});

const OfficeCopyDocument = ({ data }) => {
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };
  const totdays = data.Jewelry_recovery_agreed_period * 30;
  let totalWeight = 0;
  let totalNet = 0;

  data.jewel_product.forEach((item) => {
    totalWeight += parseFloat(item.weight) || 0;
    totalNet += parseFloat(item.net) || 0;
  });

  const jewelNames = data.jewel_product
    .map((item) => {
      const jewelName = item.JewelName.replace(/ /g, "\u00A0");
      const remarkText = item.remark ? ` (${item.remark})` : "";
      return `${jewelName}${remarkText} - ${item.count}`;
    })
    .join(", ");

  function numberToWords(num) {
    if (!Number.isFinite(num)) return "Zero Only";

    const a = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    const b = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];

    function inWords(n) {
      if ((n = n.toString()).length > 9) return "Overflow";
      const nStr = ("000000000" + n)
        .substr(-9)
        .match(/(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})/);
      if (!nStr) return "";
      let str = "";
      str += +nStr[1] ? a[+nStr[1]] + " Crore " : "";
      str += +nStr[2] ? a[+nStr[2]] + " Lakh " : "";
      str += +nStr[3]
        ? (+nStr[3] < 20 ? a[+nStr[3]] : b[nStr[3][0]] + a[nStr[3][1]]) +
          " Thousand "
        : "";
      str += +nStr[4] ? a[+nStr[4]] + " Hundred " : "";
      str += +nStr[5]
        ? (str !== "" ? "and " : "") +
          (nStr[5] < 20 ? a[+nStr[5]] : b[nStr[5][0]] + " " + a[nStr[5][1]])
        : "";
      return str.trim();
    }

    return inWords(num) + " Only";
  }

  const loanAmount = parseFloat(data.original_amount) || 0;
  const loanAmountInWords = numberToWords(loanAmount);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Image src={watermark} style={styles.watermark} />

        <View style={styles.header}>
          <Image src={logo} style={styles.headerLogo} />
          <Text style={styles.title}> அபிநயா பைனான்ஸ் </Text>
          <Text style={styles.subText}> (அரசு அங்கீகாரம் பெற்ற நிறுவனம்) </Text>
          <Text style={[styles.subText]}> BBL NO : 04/2019 - 20120</Text>
          <Text style={styles.subText}>
            "அபிநயா அடகுக்கடை" மார்க்கெட் ரோடு, அரசு மருத்துவமனை எதிரில்,
            சோழவந்தான், மதுரை மாவட்டம் – 625214 .
          </Text>
        </View>

        <Text style={styles.officeCopy}>OFFICE COPY</Text>

        <View style={styles.section}>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.label}>தேதி : </Text>
              <Text style={styles.value}>
                {formatDate(data.pawnjewelry_date)}{" "}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.label}>கடன் எண் : </Text>
              <Text style={styles.value}>{data.receipt_no} </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.label}>கடன் காலம் : </Text>
              <Text style={styles.value}>
                {data.Jewelry_recovery_agreed_period} MONTHS{" "}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.inlineText}>வாடிக்கையாளர் எண் :</Text>
              <Text style={styles.value}> {data.customer_no} </Text>
            </View>
            <View style={[styles.infoItem, { opacity: 0 }]}>
              <Text style={styles.label}> filler </Text>
              <Text style={styles.value}> filler </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.label}> கடன் தொகை : </Text>
              <Text style={styles.value}> {data.original_amount}/- </Text>
            </View>
          </View>
        </View>
        <View style={styles.imageRow}>
          {data.proof?.[1] && (
            <Image src={data.proof[1]} style={styles.imageBox} />
          )}
          {data.proof?.[0] && (
            <Image src={data.proof[0]} style={styles.imageBox} />
          )}
        </View>
        <View>
          <Text style={styles.sectionTitle}>வாடிக்கையாளர் விபரம் :</Text>
          <Text>{""}</Text>
          <View style={styles.boxedText}>
            <Text>
              பெயர்: {data.name ?? "N/A"}
              {"\n"}
              முகவரி: {data.customer_details ?? "N/A"}, {data.place ?? "N/A"}
              {"\n"}
              பிறந்த தேதி : {data.dateofbirth}
              {"\n"}
              தொலைபேசி எண்: {data.mobile_number ?? "N/A"}
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", marginTop: 8, gap: 8 }}>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontFamily: "NotoTamil-Bold",
                marginBottom: 4,
                padding: 5,
              }}
            >
              ஐயா,
            </Text>
            <Text style={styles.loanParagraph}>
              எனக்கு {""}சொந்தமான {totalNet} கிராம் தங்க நகையின் மீது{" "}
              {data.original_amount}/- ({loanAmountInWords}) கடனாக வழங்கும்படி
              கேட்டுக்கொள்கிறேன். நகையில் கற்கல் பதிக்கபட்டு இருந்தால் அதற்க்கு
              மதிப்பு கிடையாது. .இந்த கடன் தொகையை இன்றைய தேதியில் இருந்து{" "}
              {totdays} நாட்களுக்குள் அல்லது நிறுவனம் கேட்டுக்கொள்ளும்
              நாட்களுக்கு முன்பாக செலுத்தி விடுகிறேன் என உறுதி கூறுகிறேன்.
            </Text>
          </View>

          <View
            style={{
              width: 60,
              height: "100%",
              border: "1px solid black",
            }}
          />
        </View>

        <View style={{ marginTop: 4 }}>
          <Text style={{ fontFamily: "NotoTamil-Bold", marginBottom: 4 }}>
            நகை பற்றிய விபரம் :
          </Text>

          <View
            style={{
              borderWidth: 1,
              borderColor: "black",
              padding: 6,
            }}
          >
            <Text
              style={{
                fontFamily: "NotoTamil-Bold",
                marginBottom: 4,
                whiteSpace: "nowrap",
                lineHeight: 1.5,
              }}
            >
              {jewelNames}
            </Text>

            <Text>
              மொத்த எடை : {totalWeight} நிகர எடை : {totalNet}
            </Text>
          </View>
        </View>

        <Text>{"  "}</Text>
        <Text>
          {" "}
          மேலே இருக்கும் அனைத்து நகைகளையும் சரியாக திரும்பபெற்றுக்கொண்டேன்.{" "}
        </Text>

        <View style={styles.signatureRow}>
          <Text style={styles.signatureText}> கடன்தாரர் கையொப்பம் </Text>
        </View>
      </Page>
    </Document>
  );
};

export default OfficeCopyDocument;
