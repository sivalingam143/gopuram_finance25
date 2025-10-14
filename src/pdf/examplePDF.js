import React from "react";
import {
  Image,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import fontBold from "./fonts/NotoSansTamil-Bold.ttf";
import fontRegular from "./fonts/NotoSansTamil-Regular.ttf";

Font.register({
  family: "fontBold",
  fonts: [{ src: fontBold, fontStyle: "normal", fontWeight: "bold" }],
});
Font.register({
  family: "fontRegular",
  fonts: [{ src: fontRegular, fontStyle: "normal", fontWeight: "normal" }],
});
// Create styles for exact alignment and layout
const styles = StyleSheet.create({
  topheading: {
    fontFamily : "fontBold",
    fontWeight: "bold",
    fontSize: 10,
    textAlign: "center",
  },
  bold :{
    fontWeight: "bold",
    fontSize: 10,
    textAlign: "center",
  },
  page: {
    padding: 10,
    fontSize: 10,
    fontFamily: "Helvetica",
    border: "2 solid black",
  },
  container: {
    padding: 8,
    marginTop: 8,
  },
  headerContainer: {
    borderBottom: "1 solid black",
    border: "1 solid black",
    padding: 0,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerLeft: {
    width: "30%",
    paddingRight: 0,
    textAlign: "left",
    paddingLeft: 3,
  },
  headerRight: {
    width: "40%",
    padding: 0,
    textAlign: "right",
    paddingRight: 3,
  },
  headerImgLeft: {
    width: "10%",
    paddingRight: 0,
    marginBottom: 8,
  },
  headerImgRight: {
    width: "10%",
    padding: 0,
    marginRight: 8,
    marginBottom: 8,
  },
  headerCenter: {
    width: "80%",
    textAlign: "center",
    paddingBottom: 2,
  },
  centerContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingBottom: 0,
    borderBottom: "1 solid black",
  },
  paddingBottom: {
    paddingBottom: 2,
    marginLeft: 20,
   fontSize : 10,
    fontFamily : "fontBold",

    textAlign: "left",
  },

  partyName: {
    fontSize: 17,
    fontWeight: "bold",
  },
  partyadd: {
    fontSize: 14,
  },
  sectionRightFourFirstOne: {
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 2,
    width: 130,
    fontSize: 10,
    fontWeight: "bold",
  },
  sectionRightFoursecOne: {
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 2,
    alignSelf: "center",
    fontSize: 10,
    fontWeight: "bold",
    textAlign :"center",
   
  },
  sectionRightFourSecondOne: {
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 2,
    textAlign: "left",
    fontSize: 10,
    fontWeight: "bold",
    borderBottom: "1 solid black",
  },
  sectionRightFourThird: {
    borderBottom: "1 solid black",
    flexDirection: "row",
  },
  sectionRightFourThirdOne: {
    paddingTop: 1,
    paddingBottom: 25,
    paddingRight: 10,
    paddingLeft: 2,
    marginVertical: 5,
    fontSize: 10,
  },
  sectionRightFourLine: {
    borderLeft: "1 solid black ",
    marginLeft: 70,
  },
  sectionRightFirstOne: {
    borderBottom: "1 solid black",
    flexDirection: "row",
  },
  sectionRightFourThirdOneRight: {
    paddingTop: 1,
    paddingBottom: 25,
    paddingLeft: 2,
    marginVertical: 5,
    fontSize: 10,
  },
  sectionRightFourLastone: {
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 5,
    fontSize: 10,
    fontWeight: "bold",
  },

  marginLeft: {
    marginLeft: 2,
    marginBottom: 2,
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "left",
  },
  image: {
    width: "60px",
    height: "70px",
  },
  invoiceSpace: {
    paddingLeft: 2,
    marginTop: 0,
    marginBottom: 0,
  },
  dateSpace: {
    paddingLeft: 2,
    marginTop: 8,
  },
  companyTitle: {
    fontSize: 18,
     fontFamily : "fontBold",
    fontWeight: "bold",
    letterSpacing : 1,
    textAlign: "center",
    letterSpacing: 0,
    textTransform: "uppercase",
    color: "black",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
  },

  companyMargin: {
    textAlign: "center",
    paddingTop: 3,
     fontSize: 13,
     fontWeight : "demibold"
  },
  GstCompanyMargin: {
    textAlign: "center",
    paddingTop: 3,
    fontSize: 14,
    fontWeight: "extrabold",
    fontFamily : "fontBold"
  },
  companyHeadMargin: {
    textAlign: "center",
    marginBottom: 0,
    paddingRight: 30,
  },
  contactInfo: {
    fontSize: 10,
  },
  gstNumber: {
    fontSize: 10,
    marginTop: 2,
  },
  invoiceDetailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sectionLeft: {
    width: "50%",
  },
  invoiceno: {
    fontSize : 10,
    fontFamily : "fontBold",
    borderBottom: "1 solid black",
    paddingTop: 3,
    paddingBottom: 3,
  },
  billto: {
    paddingLeft: 3,
    paddingTop: 3,
  },
  marginBottom: {
    marginTop: 3,
    marginBottom: 3,
    marginLeft: 3,
    fontSize: 13,
  },
  marginBottomTwo: {
    marginLeft: 5,
    fontSize: 13,
  },
  marginBottomThree: {
    marginLeft: 5,
    fontSize: 13,
  },
  sectionRight: {
    width: "50%",
    textAlign: "left",
    borderLeft: "1 solid black",
   
    fontFamily : "fontBold"
  },
  bold: {
    fontSize: 13,
    fontWeight: "bold",
  },
  tableBottom: {
    borderBottom: "1 solid black",
    borderLeft: "1 solid black",
    borderRight: "1 solid black",
    width: "100%",
  },
  tableBottomLine: {
    borderRight: " 1 solid black",
  },
  tableBottomLineTwo: {
    borderRight: " 1 solid black",
    width: 200,
  },
  tableBottomLineTwoList: {
    paddingLeft: 1,
    paddingTop: 1,
    paddingBottom: 1,
  },
  tableBottomLineThree: {
    borderRight: " 1 solid black",
    width: 200,
  },
  tableBottomLineThreeList: {
    paddingTop: 4,
    paddingLeft: 3,
  },
  tableBottomLineFour: {
    width: 200,
  },
  tableBottomLineFourList: {
    textAlign: "center",
    paddingTop: 4,
  },
  tableBottomFirst: {
    flexDirection: "row",
    borderBottom: "1 solid black",
  },
  tableBottomSecond: {
    flexDirection: "row",
    borderBottom: "1 solid black",
  },
  tableBottomThird: {
    flexDirection: "row",
  },
  tableBottomDesign: {
    paddingTop: 3,
    paddingBottom: 5,
    paddingLeft: 3,
    width: 110,
    fontSize: 10,
    fontWeight: "bold",
    fontFamily : "fontBold"
  },
  tableBottomDesignTwo: {
    paddingTop: 3,
    paddingBottom: 5,
    paddingLeft: 3,
    width: 110,
    fontSize: 10,
    fontWeight: "bold",
    fontFamily : "fontBold"
  },
  tableBottomDesignThreeFirst: {
    paddingTop: 3,
    paddingBottom: 5,
    paddingLeft: 3,
    width: 471,
    fontSize: 10,
    fontWeight: "bold",
    fontFamily : "fontBold"
  },
  tableBottomDesignThreeSecond: {
    paddingTop: 3,
    paddingLeft: 3,
    paddingBottom: 5,
    fontSize: 10,
    fontWeight: "bold",
    fontFamily : "fontBold"
  },
  tableBottomValue: {
    paddingBottom: 5,
    paddingRight: 2,
    alignSelf: "flex-end",
   
  },
  tableBottomValuetot: {
    paddingBottom: 5,
    paddingRight: 2,
    alignSelf: "flex-end",
    fontFamily : "fontBold"
  },
  tableBottomValueTwo: {
    paddingBottom: 5,
    paddingRight: 2,
    alignSelf: "flex-start",
    fontWeight: "extrabold",
    paddingLeft: 2,
    fontSize: 10,
    fontFamily : "fontBold"
  },
  tableBottomDesignThreeSecondNoteOne: {
    paddingTop: 2,
    fontSize: 8,
  },
  tableBottomDesignThreeSecondNoteTwo: {
    paddingTop: 10,
    paddingLeft: 5,
    paddingRight: 2,
    fontSize: 10,
    fontWeight: "bold",
    
  },
  tableBottomNote: {
    paddingLeft: 5,
    paddingBottom: 3,
    paddingRight: 2,
    fontSize: 10,
    fontWeight: "bold",
  },
  tableHeader: {
    flexDirection: "row",
    borderBottom: "1 solid black",
    backgroundColor: "#f0f0f0",
    paddingVertical: 0,
    width: "100%",
    fontWeight: "bold",
    fontFamily : "fontBold"
  },

  tableRow: {
    flexDirection: "row",
    borderBottom: "1 solid black",
    Height: 30,
     width: "100%",
  },
  tableCol: {
    display: "flex",
    width: "10%",
    borderRight: "1 solid black",
    textAlign: "center",
    alignItems: "center",
    paddingVertical: 9,
  },

quantity: {
  width: "10%",
  borderRight: "1 solid black",
  textAlign: "center",
  paddingVertical: 5,
  fontSize: 10,
  fontWeight: "bold",
  fontFamily : "fontBold"
},
  rate: {
    width: "10%",
    borderRight: "1 solid black",
    textAlign: "center",
    paddingVertical: 5,
    fontSize: 10,
    fontWeight: "bold",
  },

  valueTableCol: {
    width: "12%",
    borderRight: "1 solid black",
    textAlign: "center",
     paddingVertical: 8,
  },
  tableRightBorder: {
    display: "flex",
    flexDirection: "column",
    width: "10%",
    borderRight: "1 solid black",
    textAlign: "center",
    paddingVertical: 3,
    paddingTop   : 5
  },
  tableeRate: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    textAlign: "center",
    fontSize: 13,
    fontWeight: "bold",
  },
  tableeAmount: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    textAlign: "center",
    fontSize: 13,
    fontWeight: "bold",
  },
  tableRate: {
  width: "10%",
    borderRight: "1 solid black",
    textAlign: "center",
     paddingVertical: 8,
  },
  tableAmount: {
 width: "10%",
    borderRight: "1 solid black",
    textAlign: "center",
     paddingVertical: 8,
  },
  tableRsValue: {
    width: "70%",
    borderRight: "1 solid black",
    textAlign: "center",
    paddingVertical: 10,
  },
  tablePsValue: {
    width: "30%",
    textAlign: "center",
    paddingVertical: 10,
  },
  tableRs: {
    width: "70%",
    textAlign: "center",
  },
  tablePs: {
    width: "30%",
    textAlign: "center",
  },
  tableColFirst: {
    width: "15%",
    paddingBottom: 270,
    borderLeft: "1 solid black",
    borderRight: "1 solid black",
    textAlign: "center",
    display: "flex",
    paddingTop: 9,
    alignItems: "center",
    
  },
casenos: { 
  width: "15%",
  borderLeft: "1 solid black",
  borderRight: "1 solid black",
  textAlign: "center",
  paddingVertical: 5,
  fontSize: 10,
  fontWeight: "bold",
},
  casesRow: {
    width: "10%",
    borderRight: "1 solid black",
    textAlign: "center",
    paddingVertical: 8,
    fontSize: 10,
    fontWeight: "bold",
  },
  tableColLarge: {
    width: "25%",
    borderRight: "1 solid black",
    textAlign: "center",
      paddingVertical: 8,
    paddingTop: 9,
  },
  Particulars: {
    width: "25%",
    borderRight: "1 solid black",
    textAlign: "center",
    paddingVertical: 5,
    fontSize: 10,
    fontWeight: "bold",
  },
  footerContainer: {
    marginTop: 5,
    paddingTop: 0,
    borderTop: "1 solid black",
    border: "1 solid black",
  },
  borderTop: {
    borderTop: "1 solid black",
    paddingVertical: 6,
  },
  footerLeft: {
    width: "70%",
    borderRight: "1 solid black",
    padding: 0,
  },
  footerRight: {
    width: "15%",
    padding: 0,
  },
  footerRightt: {
    width: "15%",
    borderLeft: "1 solid black",
    padding: 0,
  },
  firstFooterOne: {
    borderRight: "1 solid black",
    width: "45%",
    textAlign: "right",
  },
  firstFooterTwo: {
    paddingVertical: 7,
    fontSize: 10,
  },
  secondFooterOne: {
    borderRight: "1 solid black",
    width: "35%",
    textAlign: "center",
  },
  secondFooterTwo: {
    paddingVertical: 9,
  },
  thirdFooterOne: {
    width: "20%",
    textAlign: "center",
  },
  thirdFooterTwo: {
    paddingVertical: 9,
  },
  footerSign: {
    marginBottom: 20,
    fontFamily: "Helvetica",
  },
  footerRightSign: {
    alignSelf: "flex-end",
    float: "right",
  },
  footerBottom: {
    flexDirection: "column",
    borderTop: "1 solid black",
    marginTop: 3,
    marginBottom: 3,
    justifyContent: "space-between",
    border: "1 solid black",
  },
  footerLeftOne: {
    paddingTop: 5,
  },
  footerLeftTwo: {
    borderTop: "1 solid black",
    paddingTop: 5,
  },
  footerRightOne: {
    paddingTop: 51,
  },
  footerRightTwo: {
    borderTop: "1 solid black",
    paddingTop: 50,
  },
  footerStartNote: {
    fontSize: 8,
    textAlign: "left",
    fontFamily : "fontBold"
  },
  footerEndNote: {
    fontSize: 8,
    textAlign: "right",
    color : "grey"
  },
  topHead: {
    fontFamily: "NotoSansTamil",
    paddingRight: 10,
    marginTop: -10,
    marginBottom: 5,
  },
  row: {
    flexDirection: "row",
    fontSize: 10,
    borderTop: "1 solid black",
    fontFamily : "fontBold"
  },
  row1: {
    flexDirection: "row",
    fontSize: 10,
    borderTop: "1 solid black",
    
  },
  label: {
    width: 180,
    fontSize: 13,
  },
  value: {
    fontSize: 13,
  },
});

// Create Document Component
const ExamplePDF = ({ data, type, previousInvoices }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          <Text style={[styles.topheading]}>TAX INVOICE</Text>
          <View style={styles.headerContainer}>
            <View style={styles.centerContainer}>
              <View style={styles.headerImgLeft}>
                {/* <Image
                  src="https://t4.ftcdn.net/jpg/01/25/63/07/360_F_125630792_Y7FBQO4f779brbK3kw87iIihK7GE0aAO.jpg"
                  style={styles.image}
                /> */}
              </View>
              <View style={styles.headerCenter}>
                <Text style={styles.companyTitle}>
                  JAISHRI MEENATCHIES SPARKLERS FACTORY
                </Text>
                <Text style={styles.companyMargin}>
                  D.No.2/261,Keelanmarai Nadu,
                </Text>
                <Text style={styles.companyMargin}>
                  Vembakottai,Sivakasi - 626 140.
                </Text>
                <Text style={styles.companyMargin}>
                  State : Tamilnadu, State Code : 33.
                </Text>
                <Text style={styles.GstCompanyMargin}>
                  GSTIN : 33AAOFJ7435L1ZW
                </Text>
              </View>
              <View style={styles.headerImgRight}>
                {/* <Image
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHSN-BemaprtWLPemWtPu1eaqXRnIjBlhsxWbbTNFjc6TEQTOCZAnVoKaVpNwImW3qWsc&usqp=CAU"
                  style={styles.image}
                /> */}
              </View>
            </View>
            <View style={styles.invoiceDetailsContainer}>
              <View style={styles.sectionLeft}>
                <View>
                  <Text style={styles.invoiceno}>
                    {" "}Invoice No:MK-S /155/2024
                  </Text>
                </View>
                <View>
                  <Text style={styles.billto}>Bill To:</Text>
                  <Text style={styles.paddingBottom}>MRP CRACKERS</Text>
                  <Text style={styles.paddingBottom}>
                    116/15,PANDIAN COMPLEX,
                  </Text>
                  <Text style={styles.paddingBottom}>
                    NEAR SIVAKASI BUS STAND,
                  </Text>
                  <Text style={styles.paddingBottom}>SIVAKASI-626123</Text>
                  <Text style={styles.paddingBottom}>
                    GSTIN No/PAN/Aadhar : 33ASIPM1944R1Z7
                  </Text>
                </View>
              </View>
              <View style={styles.sectionRight}>
                <View style={styles.sectionRightFirstOne}>
                  <View style={styles.tableBottomLine}>
                    <Text style={styles.sectionRightFourFirstOne}>
                      Date : 17-07-25
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.sectionRightFoursecOne}>ORIGINAL</Text>
                  </View>
                </View>
                <View>
                  <Text style={styles.sectionRightFourSecondOne}>
                    Place Of Supply : SIVAKASI TO : SHOP
                  </Text>
                </View>
                <View style={styles.sectionRightFourThird}>
                  {" "}
                  <Text style={styles.sectionRightFourThirdOne}>
                    Agent Name:
                  </Text>
                  <View style={styles.sectionRightFourLine}>
                    <Text style={styles.sectionRightFourThirdOneRight}>
                      TOTAL CASES :
                    </Text>
                  </View>
                </View>
                <View>
                  {" "}
                  <Text style={styles.sectionRightFourLastone}>
                    HSN CODE : 3604
                  </Text>
                </View>
              </View>
            </View>
          </View>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={styles.casenos}>Case Nos</Text>
            <Text style={styles.quantity}>Cases</Text>
            <Text style={styles.Particulars}>Particulars</Text>
            <Text style={styles.quantity}>Contents</Text>
            <Text style={styles.quantity}>Quantity</Text>
            <Text style={styles.tableRightBorder}>Rate</Text>
            <Text style={styles.rate}>Unit</Text>
            <Text style={styles.tableRightBorder}>Amount</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableColFirst}></Text>
            <Text style={styles.casesRow}></Text>
            <Text style={styles.tableColLarge}></Text>
            <Text style={styles.tableCol}></Text>
            <Text style={styles.tableCol}></Text>
            <Text style={styles.tableRate} ></Text>
            {/* <View style={styles.valueTableCol}>
              <View style={styles.tableRate}></View>
            </View> */}
            <Text style={styles.tableCol}></Text>
            <Text style={styles.tableAmount}></Text>
            {/* <View style={styles.valueTableCol}>
              <View style={styles.tableAmount}></View>
            </View> */}
          </View>
          <View style={styles.tableBottom}>
            <View style={styles.tableBottomFirst}>
              <View style={styles.tableBottomLine}>
                <Text style={styles.tableBottomDesign}>Good value</Text>
                <Text style={styles.tableBottomValue}>40000.00</Text>
              </View>
              <View style={styles.tableBottomLine}>
                <Text style={styles.tableBottomDesign}>Discount %</Text>
                <Text style={styles.tableBottomValue}>%</Text>
              </View>
              <View style={styles.tableBottomLine}>
                <Text style={styles.tableBottomDesign}>Discount</Text>
                <Text style={styles.tableBottomValue}>0.00</Text>
              </View>
              <View style={styles.tableBottomLine}>
                <Text style={styles.tableBottomDesign}>Sub Total</Text>
                <Text style={styles.tableBottomValue}>40000.00</Text>
              </View>
              <View style={styles.tableBottomLine}>
                <Text style={styles.tableBottomDesign}>Packing @ %</Text>
                <Text style={styles.tableBottomValue}>0.00</Text>
              </View>
              <View style={styles.tableBottomLine}>
                <Text style={styles.tableBottomDesign}>Mahamai @ %</Text>
                <Text style={styles.tableBottomValue}>0.00</Text>
              </View>
              <View>
                <Text style={styles.tableBottomDesign}>Insurance @ %</Text>
                <Text style={styles.tableBottomValue}>0.00</Text>
              </View>
            </View>
            <View style={styles.tableBottomSecond}>
              <View style={styles.tableBottomLine}>
                <Text style={styles.tableBottomDesignTwo}>Taxable value</Text>
                <Text style={styles.tableBottomValue}>40000.00</Text>
              </View>
              <View style={styles.tableBottomLine}>
                <Text style={styles.tableBottomDesignTwo}>SGST @ %</Text>
                <Text style={styles.tableBottomValue}>3600.00%</Text>
              </View>
              <View style={styles.tableBottomLine}>
                <Text style={styles.tableBottomDesignTwo}>CGST @ %</Text>
                <Text style={styles.tableBottomValue}>3600.00</Text>
              </View>
              <View style={styles.tableBottomLine}>
                <Text style={styles.tableBottomDesignTwo}>IGST @ %</Text>
                <Text style={styles.tableBottomValue}>0.00</Text>
              </View>
              <View style={styles.tableBottomLine}>
                <Text style={styles.tableBottomDesignTwo}>Total(GST)</Text>
                <Text style={styles.tableBottomValue}>7200.00</Text>
              </View>
              <View style={styles.tableBottomLine}>
                <Text style={styles.tableBottomDesignTwo}>Total</Text>
                <Text style={styles.tableBottomValue}>47200.00</Text>
              </View>
              <View>
                <Text style={styles.tableBottomDesignTwo}>Round off</Text>
                <Text style={styles.tableBottomValue}>0.00</Text>
              </View>
            </View>
            <View style={styles.tableBottomThird}>
              <View style={styles.tableBottomLine}>
                <Text style={styles.tableBottomDesignThreeFirst}>
                  Amount in words:
                </Text>
                <Text style={styles.tableBottomValueTwo}>
                  Forty Seven Thousand Two Hundread and only
                </Text>
              </View>
              <View>
                <Text style={styles.tableBottomDesignThreeSecond}>
                  Net Amount
                </Text>
                <Text style={styles.tableBottomValuetot}>47200.00</Text>
              </View>
            </View>
            <View style={styles.row1}>
              <View style={styles.tableBottomLine}>
                <View
                  style={{
                    paddingTop: 3,
                    paddingLeft: 3,
                    paddingBottom: 3,
                    width: 380,
                  }}
                >
                  <Text style={styles.tableBottomDesignThreeSecondNoteOne}>
                    Note:
                  </Text>
                  <Text style={styles.tableBottomDesignThreeSecondNoteOne}>
                    1. We are not responsible for any loss, damage, shortage or
                    pilferage during transit. In case of any such loss, the
                    buyers have to obtain proper certificates from carriers
                    within 21 days from the date of invoice and forward the same
                    to us to enable us to lodge a claim with the insurance
                    company.
                  </Text>
                  <Text style={styles.tableBottomDesignThreeSecondNoteOne}>
                    2. All disputes are subject to SIVAKASI jurisdiction.
                  </Text>
                </View>
              </View>
              <View>
                <Text style={styles.tableBottomDesignThreeSecondNoteTwo}>
                  Certified that the particulars given
                </Text>
                <Text style={styles.tableBottomNote}>
                  above are true and correct
                </Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.tableBottomLineTwo}>
                <Text style={styles.tableBottomLineTwoList}>
                  Banking Name: MK HI - TECH PYRO
                </Text>
                <Text style={styles.tableBottomLineTwoList}>
                  Bank Name : Axis Bank ,Sivakasi
                </Text>
                <Text style={styles.tableBottomLineTwoList}>
                  Account No : 987487458965
                </Text>
                <Text style={styles.tableBottomLineTwoList}>
                  IFSC code : UTI7851565
                </Text>
              </View>
              <View style={styles.tableBottomLineThree}>
                <Text style={styles.tableBottomLineThreeList}>Transport :</Text>
                <Text style={styles.tableBottomLineThreeList}>
                  Vechicle No :TN-67 bY-0057{" "}
                </Text>
                <Text style={styles.tableBottomLineThreeList}>
                  Document :Direct
                </Text>
              </View>
              <View style={styles.tableBottomLineFour}>
                <Text style={styles.tableBottomLineFourList}>
                  For MK HI - TECH PYRO
                </Text>
                <Text style={styles.tableBottomLineFourList}>Siva</Text>
                <Text style={styles.tableBottomLineFourList}>
                  Authorised Signature
                </Text>
              </View>
            </View>
          </View>

         
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={styles.footerStartNote}>E. & O.E</Text>
            <Text style={styles.footerEndNote}>www.zentexus.com</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default ExamplePDF;
