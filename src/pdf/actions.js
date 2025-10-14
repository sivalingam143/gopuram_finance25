import React from "react";
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Image,
    Font,
} from "@react-pdf/renderer";
import logo from '.././components/sidebar/images/logo.png';
import watermark from './images/back.png';
import fontRegular from './fonts/NotoSansTamil-Regular.ttf';
import fontBold from "./fonts/NotoSansTamil-Bold.ttf";
import dayjs from "dayjs";

// Register Tamil Unicode Fonts
Font.register({
    family: 'NotoSansTamil',
    src: fontRegular,
});
Font.register({
    family: "fontBold",
    fonts: [{ src: fontBold, fontStyle: "normal", fontWeight: "bold" }],
});

// Styles
const styles = StyleSheet.create({
    page: {
        padding: 50,
        fontSize: 10,
        fontFamily: "NotoSansTamil",
        position: "relative",
    },
    watermark: {
        position: "absolute",
        opacity: 0.2,
        width: 400,          // Adjust according to your desired size
        height: 400,         // Adjust according to your desired size
        top: "50%",
        left: "60%",
        transform: "translate(-200px, -200px)", // half of width and height
        zIndex: -1,
    },

    header: {
        alignItems: "center",
        textAlign: "center",
        marginBottom: 15,
        borderBottom: "2px solid #000",
        paddingBottom: 10,
    },
    logo: {
        width: 210,
        height: 80,
        marginBottom: 5,
    },
    companyInfo: {
        fontSize: 10,
        marginBottom: 2,
        fontWeight: "bold",
    },
    section: {
        marginBottom: 10,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    label: {
        fontWeight: "bold",
        fontSize: 9,
    },
    table: {
        border: "1px solid #000",
        marginVertical: 10,
    },
    tableHeader: {
        backgroundColor: "#e0e0e0",
        flexDirection: "row",
        borderBottom: "1px solid #000",
    },
    tableCell: {
        flex: 1,
        borderRight: "1px solid #000",
        padding: 6,
        fontSize: 9,
    },
    tableRow: {
        flexDirection: "row",
        borderBottom: "1px solid #000",
    },
    tableRowAlternate: {
        backgroundColor: "#f5f5f5",
    },
    paragraph: {
        marginTop: 10,
        fontSize: 9,
        lineHeight: 1.6,
        textAlign: "justify",
    },
    footer: {
        marginTop: 20,
        alignItems: "flex-start",
        fontSize: 9,
        paddingTop: 10,
    },
    signatureLine: {
        marginTop: 5,
        borderTop: "1px dashed #000",
        width: 150,
    },
    headlable: {
        marginTop: 10,
        fontWeight: "bold",
    }
});

const actionNoticePDF = ({ date, customerName, address, loanNumber, pawnDate, loanAmount, interest }) => {
    const pawnDateFormatted = dayjs(date).format("DD-MM-YYYY");
    const currentDatePlus7 = dayjs().add(7, "day").format("DD-MM-YYYY");


    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Watermark */}
                <Image src={watermark} style={styles.watermark} />

                {/* Header */}
                <View style={styles.header}>
                    <Image src={logo} style={styles.logo} />
                    <Text style={{ fontWeight: "bold", fontSize: 14 }}>
                        மினி மெர்க்கன்டைல் பேங்கர்ஸ்
                    </Text>
                    <Text style={styles.companyInfo}>
                        12 E-P.S.R, Road (Old DR. ANIL KUMAR HOSPITAL) WATER TANK STOP, Sivakasi-626123,
                    </Text>
                    <Text style={styles.companyInfo}>
                        Phone No: 04562-221465, 8489020465
                    </Text>
                </View>

                {/* Meta Info */}
                <View style={styles.section}>
                    <View style={styles.row}>
                        <Text>
                            <Text style={styles.label}>தேதி: </Text> {date}
                        </Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text>
                        <Text style={styles.label}>வாடிக்கையாளர் பெயர்:</Text> {customerName}
                    </Text>

                </View>
                <View style={styles.section}>
                    <Text>
                        <Text style={styles.label}>முகவரி:</Text> {address}
                    </Text>
                </View>
                <View style={styles.section}>
                    <Text>
                        <Text style={styles.label}>{"        "}</Text>
                    </Text>
                </View>
                <View style={styles.section}>
                    <View style={styles.row}>
                        <Text>
                            <Text style={styles.label}> ஐயா/ அம்மா,,  </Text>
                        </Text>
                        <Text>
                            <Text style={styles.headlable}>நகை ஏல நோட்டீஸ் </Text>
                        </Text>
                    </View>

                </View>
                {/* Table */}
                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <Text style={styles.tableCell}> கடன் கணக்கு எண்: </Text>
                        <Text style={styles.tableCell}> கடன் தேதி </Text>
                        <Text style={[styles.tableCell]}>
                            கடன் தொகை (ரூ)
                        </Text>
                        {interest != 0 && (
                            <Text style={[styles.tableCell]}>
                                வட்டி தொகை (ரூ)
                            </Text>
                        )}

                    </View>
                    <View style={[styles.tableRow, styles.tableRowAlternate]}>
                        <Text style={styles.tableCell}>{loanNumber}</Text>
                        <Text style={styles.tableCell}>{pawnDate}</Text>
                        <Text style={[styles.tableCell]}>{loanAmount}</Text>
                        {interest != 0 && (
                            <Text style={[styles.tableCell]}>{interest}</Text>
                        )
                        }
                    </View>
                </View>

             
                <Text style={styles.paragraph}>
                    எங்கள் நிறுவன தங்க நகை கடன் கணக்குகள் சரிபார்ப்பு செய்ததில், மேற்கண்ட தாங்கள் வாங்கிய நகை கடன், தாங்கள் கையொப்பம் இட்டுள்ள கடன் ஒப்பந்த பத்திரத்தின் விதிமுறைகளின் படி, தாங்கள் {" "} கடன் தொகையோ அதற்கு உண்டான வட்டி தொகையையோ திரும்ப செலுத்தாததால் காலாவதி {" "} ஆகிவிட்டது. நாங்கள் {" "} எங்கள் நிறுவனத்திலிருந்து பல நினைவூட்டல்கள் மற்றும் அறிவிப்புகள் தங்களுக்கு அனுப்பிய பிறகும் இன்றைய நாள் வரை நகைகளை திருப்பி எடுக்கவோ அல்லது புதுப்பித்து வைக்கவோ செய்யவில்லை. {""}
                    எனவே நீங்கள் இதன்முலம் இந்த அறிவித்தல் நோட்டீஸ் கிடைத்த {currentDatePlus7}  தேதிக்குள், அசல், வட்டி மற்றும் தபால் கட்டணங்கள் செலுத்தி மேற்காணும் தங்க நகை கடன் கணக்கை முடித்து தருமாறு அறிவிக்கிறோம்.{" "} நீங்கள் {" "} இந்த கோரிக்கைகளை ஏற்க தவறினால், இந்த கடனை தங்களிடமிருந்து வசூலிக்க, கடன் தொகைக்கு {" "} அடமானமாக வைக்கப்பட்ட தங்க நகை ஆபரணங்களை தங்களுடைய செலவிலும், பொறுப்பிலும் ஏலம் மூலமாக விற்கப்படும் என்று இந்த நோட்டீஸ் மூலமாக தெரிவித்து கொள்கிறோம். {" "} அதனால் ஏற்படுகின்ற குறைவான தொகைக்கு நீங்களே கடன் பத்திரம் மூலம் பொறுப்பு என்பதை அறிந்து கொள்ளவும். {" "}
                    இது {" "} தவிர  அடகு நகைகள் சம்மந்தப்பட்ட எந்த தகவல்களும் இனிமேல் கொடுக்கப்படமாட்டாது. {" "}
                    இந்த அறிவிப்பினை கடைசி தகவலாக ஏற்று, தங்களுடைய நகை கடன் தொகையை செலுத்தி கணக்கை முடித்து, நகையை திரும்ப பெற்று கொள்ளுமாறு கோருகிறோம். இந்த ஏலத்தில் கிடைத்த தொகையை தங்கள் கணக்கில் வரவு வைத்த பின்னரும் பாக்கி பணம் கட்ட வேண்டிய அவசியம் ஏற்படும் என்றால் அந்த {" "} பற்றாகுறை தொகையை உங்களிடமிருந்து வசூலிக்க {" "} எங்கள் நிறுவனத்திற்கு பரிபூரண உரிமை உண்டு என்பதை தெரிவித்து கொள்கிறோம். {" "}
                    தங்களுக்கு {" "} ஏதேனும் சந்தேகம் இருந்தால் அல்லது மேலும் விளக்கம் வேண்டுமானால் எங்களுடைய கிளையை அணுகவும். {" "}

                </Text>

               
                <View style={styles.footer}>
                    <Text>தங்கள் உண்மையுள்ள,</Text>
                </View>
            </Page>
        </Document>
    );
};

export default actionNoticePDF;