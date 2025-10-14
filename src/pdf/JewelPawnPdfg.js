import React, { useState, useEffect } from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { Font } from "@react-pdf/renderer";
import fontBold from "./fonts/NotoSansTamil-Bold.ttf";
import fontRegular from "./fonts/NotoSansTamil-Regular.ttf";

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
  normalText: {
    fontFamily: "fontRegular",
    fontWeight: "normal",
  },
  boldText: {
    fontFamily: "fontBold",
    fontWeight: "bold",
  },
  page: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 0,
  },

  header: {
    fontFamily: "fontRegular",
    fontSize: 8,
  },
  section: {
    margin: 15,
    flexGrow: 1,
    border: 1,
    padding: 0,
    letterSpacing: 1,
    borderColor: "#4535C1",
    marginBottom: 500,
    color: "#4535C1",
  },
  dupe: {
    margin: 15,
    flexGrow: 1,
    border: 1,
    padding: 0,
    borderColor: "#4535C1",
    letterSpacing: 1,
    marginBottom: 500,
    color: "#4535C1",
  },
  godtitle: {
    fontSize: 8,
    padding: 5,
    textAlign: "center",
  },
  font: {
    fontFamily: "fontRegular",
  },
  red: {
    color: "red",
  },
  storename: {
    textAlign: "center",
    fontFamily: "fontBold",
    fontSize: 11,
    letterSpacing: 1,
    fontWeight: "bold",
  },
  table: {
    display: "table",
    fontFamily: "fontRegular",
    flexDirection: "row",
    width: "100%",
    borderBottom: 1,
    borderTop: 1,
    fontSize: 9,
    borderColor: "#4535C1",
  },
  tableRow: {
    flexDirection: "row",
  },
  tableRow1: {
    flexDirection: "row",
    paddingLeft: "90px",
  },
  company: {
    width: "50%",
    padding: 6,
    fontFamily: "fontRegular",
    textAlign: "center",
    fontSize: 9,
  },
  tableCell: {
    width: "30%",
    padding: 7,
    fontSize: 8.5,
  },
  dateCell: {
    width: "50%",
    padding: 7,
    fontSize: 8.5,
  },
  pad: {
    paddingVertical: 3,
  },
  tab: {
    display: "table",
    fontFamily: "fontRegular",
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 8,
  },
  pawnAmt: {
    textAlign: "right",
  },
  customerdetail: {
    paddingHorizontal: 7,
    display: "flex",
    fontSize: 7.5,
  },
  details1: {
    paddingVertical: 6,
    display: "flex",
    flexDirection: "row",
  },
  details: {
    paddingVertical: 6,
    flexDirection: "row",
  },
  details2: {
    flexDirection: "row",
    fontSize: 7.6,
  },
  state: {
    width: "29.5%",
    fontFamily: "fontBold",
    fontWeight: "bold",
  },
  customtab: {
    display: "flex",
    fontFamily: "fontRegular",
    flexDirection: "row",
    paddingVertical: 4,
  },
  jewelprice: {
    paddingVertical: 10,
  },
  row: {
    flexDirection: "row",
    marginBottom: 5,
  },
  footer: {
    display: "table",
    fontFamily: "fontRegular",
    flexDirection: "row",
    padding: 6,
    color: "#4535C1",
  },
  time: {
    width: "30%",
    padding: 10,
    border: 1,
    marginHorizontal: 2,
    borderRadius: 8,
    fontSize: 8,
    borderColor: "#4535C1",
  },
  footerdesc: {
    padding: 12,
    border: 1,
    marginHorizontal: 3,
    borderRadius: 8,
    fontSize: 8,
    paddingHorizontal: 10,
    width: "70%",
    borderColor: "#4535C1",
  },
  origialdesc: {
    width: "100%",
    padding: 12,
    border: 1,
    marginHorizontal: 2,
    borderRadius: 8,
    fontSize: 8,
    borderColor: "#4535C1",
  },
  phone: {
    width: "30%",
    padding: 8,
    border: 1,
    margin: "0 auto",
    marginHorizontal: 2,
    fontSize: 8,
    fontFamily: "fontRegular",
    borderRadius: 8,
    borderColor: "#4535C1",
  },
  ph: {
    marginVertical: 10,
  },
  none: {
    display: "none",
  },
  line: {
    textDecorationLine: "underline",
    textDecorationStyle: "solid",
    color: "#4535C1",
    marginTop: 0,
  },
  termsTitle: {
    fontSize: 10,
    fontFamily: "fontRegular",
  },
  termlist: {
    fontSize: 9,
    paddingHorizontal: 22,
  },
  termpoint: {
    paddingVertical: 4,
  },
  billcreate: {
    fontSize: 8,
  },
  padmac: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    right: 40,
    bottom: 15,
    padding: 15,
    fontSize: 12,
    fontWeight: "bold",
  },
  paidStamp: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    right: 15,
    bottom: 50,
    padding: 10,
    borderWidth: 2,
    borderColor: "#4535C1",
    borderRadius: 5,
    color: "#4535C1",
    fontSize: 20,
    fontWeight: "bold",
  },
  paidText: {
    color: "#4535C1",
    fontSize: 20,
    fontWeight: "bold",
    justifyContent: "center",
  },
  divider: {
    width: "100%",
    height: 1.5,
    backgroundColor: "#4535C1",
    marginVertical: 5,
  },
  dateText: {
    color: "#C40C0C",
    fontSize: 14,
    fontWeight: "bold",
  },

  tableContent: {
    marginVertical: "500px",
    margin: 8,
    flexGrow: 1,
    border: 1,
    padding: 0,
    letterSpacing: 1,
    borderColor: "#4535C1",
  },
});
const JewelPawnPdfG = ({ data }) => {
  const [user, setUser] = useState([]);
  console.log("data", data);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const units = [
    "",
    "ஒன்று",
    "இரண்டு",
    "மூன்று",
    "நான்கு",
    "ஐந்து",
    "ஆறு",
    "ஏழு",
    "எட்டு",
    "ஒன்பது",
  ];

  const tens = [
    "",
    "பத்து",
    "இருபது",
    "முப்பது",
    "நாப்பது",
    "ஐம்பது",
    "அறுபது",
    "எழுபது",
    "எண்பது",
    "தொன்னூறு",
  ];

  const hundreds = ["", "நூறு", "இருநூறு", "முன்னூறு", "நாநூறு", "அயிரம்"];

  const scales = ["", "ஆயிரம்", "லட்சம்", "கோடி"];
  const numberToWords = (num) => {
    if (num === 0) return "பூஜ்ஜியம்";

    let words = "";

    // Convert crores
    if (Math.floor(num / 10000000) > 0) {
      words += numberToWords(Math.floor(num / 10000000)) + " கோடி ";
      num %= 10000000;
    }

    // Convert lakhs
    if (Math.floor(num / 100000) > 0) {
      words += numberToWords(Math.floor(num / 100000)) + " லட்சம் ";
      num %= 100000;
    }

    // Convert thousands
    if (Math.floor(num / 1000) > 0) {
      words += numberToWords(Math.floor(num / 1000)) + " ஆயிரம் ";
      num %= 1000;
    }

    // Convert hundreds
    if (Math.floor(num / 100) > 0) {
      words += numberToWords(Math.floor(num / 100)) + " நூறு ";
      num %= 100;
    }

    if (num > 0) {
      if (words !== "") words += "ஆண்டு ";

      if (num < 10) {
        words += units[num];
      } else if (num < 20) {
        words += tens[Math.floor(num / 10)];
        if (num % 10 > 0) words += " " + units[num % 10];
      } else {
        words += tens[Math.floor(num / 10)];
        if (num % 10 > 0) words += " " + units[num % 10];
      }
    }

    return words.trim();
  };

  const numberToRupees = (num) => {
    const wholePart = Math.floor(num);
    const decimalPart = Math.round((num - wholePart) * 100);

    let result = `${numberToWords(wholePart)} ரூபாய்`;

    if (decimalPart > 0) {
      result += ` மற்றும் ${numberToWords(decimalPart)} பைசா`;
    }

    return result;
  };

  const formattedDate = formatDate(data.pawnjewelryg_date);
  const formattedDaterecovery = formatDate(data.pawnjewelryg_recovery_date);
  return (
    <Document>
      <Page size="A4" orientation="potrait" style={styles.page}>
        <View style={styles.dupe}>
          <View style={styles.font}>
            <View style={styles.godtitle}>
              <Text>ஸ்ரீஅய்யனார் துணை </Text>
            </View>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <View style={styles.tableCell}>
                  <Text style={styles.pad}>
                    <Text style={styles.boldText}>ரசீது எண்: </Text>
                    <Text style={styles.red}>{data.recipt_no}</Text>
                  </Text>
                  <Text style={styles.pad}>
                    <Text style={styles.boldText}>உரிம எண்: </Text>
                    <Text style={styles.normalText}>13/97-98</Text>
                  </Text>
                </View>
              </View>
              <View style={styles.tableRow}>
                <View style={styles.company}>
                  <Text style={styles.storename}>
                    {" "}
                    திருமலை திருப்பதி அடகு கடை
                  </Text>
                  {/* <Text>5-E , பவுண்டுத் தெரு , திருநாகேஸ்வரம்</Text> */}
                </View>
              </View>
              <View style={styles.tableRow1}>
                <View style={styles.dateCell}>
                  <Text style={styles.pad}>
                    <Text style={styles.boldText}>அடகு ரூ : </Text>
                    <Text style={styles.normalText}>{data.pawn_rate}</Text>
                  </Text>
                  <Text style={styles.pad}>
                    <Text style={styles.boldText}>அடகு தேதி : </Text>
                    <Text style={styles.normalText}>{formattedDate}</Text>
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.tab}>
              <View>
                <Text>
                  அடியிற்கண்ட பொருட்கள் எங்களிடம் அடகு வைக்கப்பட்டு உள்ளது{" "}
                  <View style={styles.none}>உள்ளது உள்ளது</View>{" "}
                </Text>
              </View>
            </View>
            <View style={styles.customerdetail}>
              <View style={styles.details}>
                <Text style={styles.state}>1.அடகு வைப்பவர் பெயர் : </Text>
                <Text> {data.customer_name} </Text>
              </View>
              <View style={styles.details}>
                <Text style={styles.state}>2.தகப்பனார்/ கணவர் :</Text>
                <Text> {data.name_of_guardians} </Text>
              </View>
              <View style={styles.details}>
                <Text style={styles.state}>3.விலாசம் :</Text>
                <Text> {data.address} </Text>
              </View>
              {data.mobile_number != "" ? (
                <View style={styles.details}>
                  <Text style={styles.state}>4.தொலைபேசி எண்:</Text>
                  <Text> {data.mobile_number} </Text>
                </View>
              ) : (
                ""
              )}

              <View style={styles.details}>
                <Text style={styles.state}>
                  {data.mobile_number != "" ? "5" : "4"}.அசல் ரூபாய் :
                </Text>
                <Text> {numberToRupees(data.pawn_rate)} </Text>
              </View>

              <View style={styles.details}>
                <Text style={styles.state}>
                  {data.mobile_number != "" ? "6" : "5"}.அடகு பொருளின் விபரம்{" "}
                  <View style={styles.none}>ம்</View> :{" "}
                </Text>
                {data.jewel_product.map((item, index) => (
                  <Text key={index}>
                    {data.group === "தங்கம்"
                      ? "ம.பெ"
                      : data.group === "வெள்ளி"
                      ? "இ. வெள்ளி"
                      : data.group === "பித்தளை"
                      ? "பித்தளை"
                      : ""}{" "}
                    {item.JewelName}{" "}
                  </Text>
                ))}
              </View>

              <View style={styles.details}>
                <Text style={styles.state}>
                  {data.mobile_number != "" ? "7" : "6"}.நகை மொத்த எடை :{" "}
                </Text>
                <Text>
                  {data.jewel_product.reduce((totalWeight, item) => {
                    return totalWeight + parseFloat(item.weight);
                  }, 0)}{" "}
                  கிராம் மட்டும்
                </Text>
              </View>
              <View style={styles.details}>
                <Text style={styles.boldText}>
                  {data.mobile_number !== "" ? "8" : "7"}.
                  <Text style={styles.boldText}>சுமார் மதிப்பு ரூ. :</Text>
                </Text>
                <Text style={styles.normalText}>
                  {" "}
                  {data.jewel_original_rate} ,{"       "}
                </Text>
                <Text style={styles.boldText}>
                  {data.mobile_number !== "" ? "9" : "8"}.
                  <Text style={styles.boldText}>
                    நகை மீட்க ஒப்புகொண்ட தேதி{" "}
                  </Text>
                </Text>
                <Text style={styles.normalText}>
                  {" "}
                  : {formattedDaterecovery}{" "}
                </Text>
              </View>
              <View>
                <View style={styles.details}>
                  <Text style={styles.boldText}>
                    {data.mobile_number !== "" ? "10" : "9"}. அடகு வைப்பவரின்
                    கையெழுத்து அல்லது அவருடைய ஏஜென்ட் கையெழுத்து :
                  </Text>
                  <Text style={styles.normalText}>
                    {"  "}
                    {data.createdby !== "" && data.createdby !== null
                      ? data.createdby
                      : "A.R"}
                  </Text>
                </View>
              </View>

              {data.paidby ?? (
                <View style={styles.paidStamp}>
                  <Text style={styles.paidText}>PAID</Text>
                  <View style={styles.divider} />
                  <Text style={styles.dateText}>{formattedDaterecovery}</Text>
                </View>
              )}
              {data.paidby ?? (
                <View style={styles.padmac}>
                  <Text style={styles.dateText}>
                    {data.createdby !== "" && data.createdby !== null
                      ? data.createdby
                      : "A.R"}
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.footer}>
              <View style={styles.time}>
                <Text style={styles.boldText}>வேலை நேரம்</Text>
                <Text style={styles.termpoint}>
                  <Text style={styles.boldText}>காலை:</Text> 9.00 to 2.00
                </Text>
                <Text>
                  <Text style={styles.boldText}>மாலை:</Text>4.00 to 8.30
                </Text>
              </View>
              <View style={styles.footerdesc}>
                <Text>மேற்கண்ட பொருட்களை இந்த ரசீது கொண்டுவரும் </Text>
                <Text>
                  {" "}
                  <Text style={styles.line}>
                    {" "}
                    ______________________________
                  </Text>{" "}
                  வசம் ஒப்படைக்கவும் <View style={styles.none}>ம்</View>
                </Text>
                <View style={styles.line}>
                  <Text>அடகு வைத்தவர் கையெழுத்து</Text>
                </View>
              </View>
              <View style={styles.phone}>
                <View style={styles.termpoint}>
                  <Text style={styles.boldText}>தொடர்புக்கு </Text>
                  <Text style={styles.termpoint}>
                    <Text style={styles.boldText}>கடை :</Text> 0435 - 2463106
                  </Text>
                  <Text>
                    <Text style={styles.boldText}>செல் :</Text>75399 00757
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.details2}>
              <Text style={styles.boldText}> Bill Create : </Text>
              <Text style={styles.normalText}>
                {"  "}
                {data.createdby !== "" && data.createdby !== null
                  ? data.createdby
                  : "A.R"}
              </Text>
            </View>
          </View>
        </View>
      </Page>

      <Page size="A4" orientation="portrait" style={styles.page}>
        <View style={styles.section}>
          <View style={styles.font}>
            <View style={styles.godtitle}>
              <Text>ஸ்ரீஅய்யனார் துணை </Text>
            </View>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <View style={styles.tableCell}>
                  <Text style={styles.pad}>
                    <Text style={styles.boldText}>ரசீது எண்: </Text>
                    <Text style={styles.red}>{data.recipt_no}</Text>
                  </Text>
                  <Text style={styles.pad}>
                    <Text style={styles.boldText}>உரிம எண்: </Text>
                    <Text style={styles.normalText}>13/97-98</Text>
                  </Text>
                </View>
              </View>
              <View style={styles.tableRow}>
                <View style={styles.company}>
                  <Text style={styles.storename}>அபிநயா பைனான்ஸ்</Text>
                  <Text>5-E , பவுண்டுத் தெரு , திருநாகேஸ்வரம்</Text>
                </View>
              </View>
              <View style={styles.tableRow1}>
                <View style={styles.dateCell}>
                  <Text style={styles.pad}>
                    <Text style={styles.boldText}>அடகு ரூ : </Text>
                    <Text style={styles.normalText}>{data.pawn_rate}</Text>
                  </Text>
                  <Text style={styles.pad}>
                    <Text style={styles.boldText}>அடகு தேதி : </Text>
                    <Text style={styles.normalText}>{formattedDate}</Text>
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.tab}>
              <Text>
                அடியிற்கண்ட பொருட்கள் எங்களிடம் அடகு வைக்கப்பட்டு உள்ளது{" "}
                <View style={styles.none}>உள்ளது உள்ளது</View>{" "}
              </Text>
            </View>
            <View style={styles.customerdetail}>
              <View style={styles.details}>
                <Text style={styles.state}>1.அடகு வைப்பவர் பெயர் : </Text>
                <Text> {data.customer_name} </Text>
              </View>
              <View style={styles.details}>
                <Text style={styles.state}>2.தகப்பனார்/ கணவர் :</Text>
                <Text> {data.name_of_guardians} </Text>
              </View>
              <View style={styles.details}>
                <Text style={styles.state}>3.விலாசம் :</Text>
                <Text> {data.address} </Text>
              </View>
              {data.mobile_number != "" ? (
                <View style={styles.details}>
                  <Text style={styles.state}>4.தொலைபேசி எண்:</Text>
                  <Text> {data.mobile_number} </Text>
                </View>
              ) : (
                ""
              )}
              <View style={styles.details}>
                <Text style={styles.state}>
                  {data.mobile_number != "" ? "5" : "4"}.அசல் ரூபாய் :
                </Text>
                <Text> {numberToRupees(data.pawn_rate)} </Text>
              </View>

              <View style={styles.details}>
                <Text style={styles.state}>
                  {data.mobile_number != "" ? "6" : "5"}.அடகு பொருளின் விபரம்{" "}
                  <View style={styles.none}>ம்</View> :{" "}
                </Text>
                {data.jewel_product.map((item, index) => (
                  <Text key={index}>
                    {data.group === "தங்கம்"
                      ? "ம.பெ"
                      : data.group === "வெள்ளி"
                      ? "இ. வெள்ளி"
                      : data.group === "பித்தளை"
                      ? "பித்தளை"
                      : ""}{" "}
                    {item.JewelName}{" "}
                  </Text>
                ))}
              </View>

              <View style={styles.details}>
                <Text style={styles.state}>
                  {data.mobile_number != "" ? "7" : "6"}.நகை மொத்த எடை :{" "}
                </Text>
                <Text>
                  {data.jewel_product.reduce((totalWeight, item) => {
                    return totalWeight + parseFloat(item.weight);
                  }, 0)}{" "}
                  கிராம் மட்டும்
                </Text>
              </View>
              <View style={styles.details}>
                <Text style={styles.boldText}>
                  {data.mobile_number !== "" ? "8" : "7"}.
                  <Text style={styles.boldText}>சுமார் மதிப்பு ரூ. :</Text>
                </Text>
                <Text style={styles.normalText}>
                  {" "}
                  {data.jewel_original_rate} ,{"       "}
                </Text>
                <Text style={styles.boldText}>
                  {data.mobile_number !== "" ? "9" : "8"}.
                  <Text style={styles.boldText}>
                    நகை மீட்க ஒப்புகொண்ட தேதி{" "}
                  </Text>
                </Text>
                <Text style={styles.normalText}>
                  {" "}
                  : {formattedDaterecovery}{" "}
                </Text>
              </View>
              <View>
                <View style={styles.details}>
                  <Text style={styles.boldText}>
                    {data.mobile_number !== "" ? "10" : "9"}. அடகு வைப்பவரின்
                    கையெழுத்து அல்லது அவருடைய ஏஜென்ட் கையெழுத்து :
                  </Text>
                  <Text style={styles.normalText}>
                    {"  "}
                    {data.createdby !== "" && data.createdby !== null
                      ? data.createdby
                      : "A.R"}
                  </Text>
                </View>
              </View>
              {data.paidby ?? (
                <View style={styles.paidStamp}>
                  <Text style={styles.paidText}>PAID</Text>
                  <View style={styles.divider} />
                  <Text style={styles.dateText}>{formattedDaterecovery}</Text>
                </View>
              )}
              {data.paidby ?? (
                <View style={styles.padmac}>
                  <Text style={styles.dateText}>
                    {data.createdby !== "" && data.createdby !== null
                      ? data.createdby
                      : "A.R"}
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.footer}>
              <View style={styles.origialdesc}>
                <Text>
                  மேற்கண்ட பொருட்களை அசல் ரூ.
                  <Text style={styles.line}>
                    ______________________________
                  </Text>
                  ம் வட்டி ரூ.
                  <Text style={styles.line}>
                    ______________________________
                  </Text>
                  ம் கொடுத்து சாமான்களை நல்ல நிலையில் சரிபார்த்துக்
                  பெற்றுக்கொண்டேன்
                </Text>
              </View>
            </View>
            <View style={styles.details2}>
              <Text style={styles.boldText}> Bill Create : </Text>
              <Text style={styles.normalText}>
                {"  "}
                {data.createdby !== "" && data.createdby !== null
                  ? data.createdby
                  : "A.R"}
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default JewelPawnPdfG;
