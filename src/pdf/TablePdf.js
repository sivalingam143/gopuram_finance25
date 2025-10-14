
import React from 'react'
import { Document, Page, Text, View, StyleSheet} from '@react-pdf/renderer';
import { Font } from '@react-pdf/renderer';
import fontBold from './fonts/NotoSansTamil-Bold.ttf';
import fontRegular from './fonts/NotoSansTamil-Regular.ttf';
// Define custom dimensions in points (19 x 14 inches)
// const customPaperSize = [19 * 72, 14 * 72]; // [width, height] in points

Font.register({
    family: 'fontBold',
    fonts: [
        { src: fontBold, fontStyle: 'normal', fontWeight: 'bold' },
    ],
});
Font.register({
    family: 'fontRegular',
    fonts: [
        { src: fontRegular, fontStyle: 'normal', fontWeight: 'normal' },
        ],
        });
        const styles = StyleSheet.create({
            page: {
                flexDirection: 'column',
                backgroundColor: '#fff', 
                padding:0
              },
            tableContent:{
                margin:8,
                border:1,
                fontSize:7
            },
            font:{
                fontFamily: 'fontRegular',
              },
              godtitle:{
                fontSize:7,
                textAlign:"center", 
                padding:5, borderBottom:1
              }
        })
const TablePdf = () => 
    <Document>
        <Page size="A5" orientation="landscape" style={styles.page}>
            {/* table view */}
                <View  style={styles.tableContent}>
                    <View  style={styles.font}>
                        <View style={styles.godtitle}>
                            <Text>ஸ்ரீஅய்யனார் துணை  </Text>
                        </View> 
                        <View style={styles.table}>
                            <View style={styles.tableRow}>
                                <View style={styles.tableCell}>
                                    <Text style={styles.pad}>ரசீது எண்: <Text style={styles.red}> 1452</Text>  </Text>
                                    <Text style={styles.pad}>உரிம எண்: 13/97-98 </Text>
                                </View>
                            </View>
                            <View style={styles.tableRow}>
                                <View style={styles.company}>
                                    <Text style={styles.storename}>அபிநயா பைனான்ஸ்</Text>
                                    <Text>5-E , பவுண்டுத் தெரு , திருநாகேஸ்வரம்</Text>
                                </View>
                            </View>
                            <View style={styles.tableRow}>
                                <View style={styles.dateCell}>
                                    <Text style={styles.pad}>அடகு ரூ : 6700</Text>
                                    <Text style={styles.pad}>அடகு தேதி :16/05/2024 </Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.tab}>
                            <Text>அடியிற்கண்ட பொருட்கள் எங்களிடம் அடகு  வைக்கப்பட்டு உள்ளது   <View style={styles.none}>உள்ளது உள்ளது</View> </Text>
                        </View>
                        <View style={styles.customerdetail}>
                            <View style={styles.details}>
                            <Text style={styles.state}>அடகு வைப்பவர் பெயர் : </Text> 
                            <Text >ரஞ்சித்</Text> 
                            </View>
                            <View style={styles.details}>
                            <Text style={styles.state} >தகப்பனார்/ கணவர் :</Text>
                            <Text >சுபரமணியன்</Text> 
                            </View>
                            <View style={styles.details}>
                            <Text style={styles.state}>விலாசம் :</Text>
                            <Text >2 / 2209 தேவி நகர் , சிவகாசி</Text> 
                            </View>
                            <View style={styles.details}>
                            <Text style={styles.state}>தொலைபேசி எண்:</Text>
                            <Text >9994307256</Text> 
                            </View>
                            <View style={styles.details}>
                            <Text style={styles.state}>அசல் ரூபாய் :</Text>
                            <Text >18000</Text> 
                            </View>
                            <View style={styles.details}>
                            <Text style={styles.state}>அடகு பொருளின் விபரம் <View style={styles.none}>ம்</View> : </Text>
                            <Text>காதணி - 2 - 5G ,  காதணி - 2 - 5G , காதணி - 2 - 5G , காதணி - 2 - 5G </Text> 
                            </View>
                            <View style={styles.details}>
                            <Text style={styles.state}>நகை மொத்த எடை  : </Text>
                            <Text>20G  </Text> 
                            </View>
                            <View style={styles.details}>
                                <Text style={styles.state}>சுமார் மதிப்பு ரூ. :</Text>
                                <Text>45000 </Text> 
                            </View>
                            <View style={styles.details}>
                                <Text style={styles.state}>அடகு மீட்பு தேதி :</Text>
                                <Text>20/12/2025 </Text> 
                            </View>
                            <View>
                            <Text style={styles.pad}>அடகு வைப்பவரின்  கையெழுத்து அல்லது
                                அவருடைய ஏஜென்ட் கையெழுத்து : </Text>
                            </View>
                        </View>
                        <View style={styles.footer}>
                            <View style={styles.origialdesc}>
                                <Text>மேற்கண்ட  பொருட்களை  அசல் ரூ .________________   <Text style={styles.state}>ம் <View style={styles.none}>ம்</View></Text> வட்டி ரூ. _____________________________<Text style={styles.state}>ம் <View style={styles.none}>ம்</View></Text> கொடுத்து சாமான்களை நல்ல நிலையில் சரிபார்த்துக் பெற்றுக்கொண்டேன் <Text style={styles.state}> <View style={styles.none}>ம்</View></Text></Text>
                            </View>
                        </View>
                        <View style={styles.billcreate}>
                            <Text style={styles.details}> Bill Create : Aravind </Text>
                            <Text> Orginal</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.tableContent}>
                    <View  style={styles.font}>
                    <View style={styles.godtitle}>
                        <Text>ஸ்ரீஅய்யனார் துணை  </Text>
                    </View> 
                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                        <View style={styles.tableCell}>
                            <Text style={styles.pad}>ரசீது எண்: <Text style={styles.red}> 1452</Text> </Text>
                            <Text style={styles.pad}>உரிம எண்: 13/97-98 </Text>
                        </View>
                        </View>
                        <View style={styles.tableRow}>
                        <View style={styles.company}>
                            <Text style={styles.storename}>அபிநயா பைனான்ஸ்</Text>
                            <Text>5-E , பவுண்டுத் தெரு , திருநாகேஸ்வரம்</Text>
                        </View>
                        </View>
                        <View style={styles.tableRow}>
                            <View style={styles.dateCell}>
                            <Text style={styles.pad}>அடகு ரூ : 6700</Text>
                            <Text style={styles.pad}>அடகு தேதி :16/05/2024 </Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.tab}>
                        <View>
                        <Text>அடியிற்கண்ட பொருட்கள் எங்களிடம் அடகு  வைக்கப்பட்டு உள்ளது   <View style={styles.none}>உள்ளது உள்ளது</View> </Text>
                        </View>
                    </View>
                    <View style={styles.customerdetail}>
                        <View style={styles.details}>
                        <Text style={styles.state}>அடகு வைப்பவர் பெயர் : </Text> 
                        <Text >ரஞ்சித்</Text> 
                        </View>
                        <View style={styles.details}>
                        <Text style={styles.state} >தகப்பனார்/ கணவர் :</Text>
                        <Text >சுபரமணியன்</Text> 
                        </View>
                        <View style={styles.details}>
                        <Text style={styles.state}>விலாசம் :</Text>
                        <Text >2 / 2209 தேவி நகர் , சிவகாசி</Text> 
                        </View>
                        <View style={styles.details}>
                        <Text style={styles.state}>தொலைபேசி எண்:</Text>
                        <Text >9994307256</Text> 
                        </View>
                        <View style={styles.details}>
                        <Text style={styles.state}>அசல் ரூபாய் :</Text>
                        <Text >18000</Text> 
                        </View>
                        <View style={styles.details}>
                        <Text style={styles.state}>அடகு பொருளின் விபரம் <View style={styles.none}>ம்</View> : </Text>
                        <Text>காதணி - 2 - 5G ,  காதணி - 2 - 5G , காதணி - 2 - 5G , காதணி - 2 - 5G </Text> 
                        </View>
                        <View style={styles.details}>
                        <Text style={styles.state}>நகை மொத்த எடை  : </Text>
                        <Text>20G  </Text> 
                        </View>
                        <View style={styles.details}>
                            <Text style={styles.state}>சுமார் மதிப்பு ரூ. :</Text>
                            <Text>45000 </Text> 
                        </View>
                        <View style={styles.details}>
                            <Text style={styles.state}>அடகு மீட்பு தேதி :</Text>
                            <Text>20/12/2025 </Text> 
                        </View>
                        <View>
                        <Text style={styles.pad}>அடகு வைப்பவரின்  கையெழுத்து அல்லது
                            அவருடைய ஏஜென்ட் கையெழுத்து : </Text>
                        </View>
                    </View>
                    <View style={styles.footer}>
                        <View style={styles.footerdesc}>
                        <Text>மேற்கண்ட  பொருட்களை இந்த ரசீது கொண்டுவரும்  <Text style={styles.line}>   ______________________________</Text> </Text>
                            <Text>வசம் ஒப்படைக்கவும் <View style={styles.none}>ம்</View></Text>
                            <View style={styles.line}>
                            <Text >அடகு வைத்தவர் கையெழுத்து</Text>
                            </View>
                        </View>
                        
                    </View>
                        <View style={styles.footer}>
                        <View style={styles.time}>
                            <View>
                            <Text>வேலை நேரம்</Text>
                            <Text style={styles.termpoint}>காலை: 9.00 to 1.30</Text>
                            <Text>மாலை:4.00 to 8.30</Text>
                            </View>
                        </View>
                        <View style={styles.phone}>
                            <View style={styles.termpoint}>
                                <Text >தொடர்புக்கு </Text>
                                <Text style={styles.pad}> கடை : 0435 - 2463106</Text>
                                <Text> செல் :  94425 63364 </Text>
                            </View>
                            </View>
                        </View>
                        <View style={styles.billcreate}>
                        <Text style={styles.details}> Bill Create : Aravind </Text>
                        <Text> Customer Copy</Text>
                        </View>
                    </View>
                </View>
            {/* table view */}
        </Page>
    </Document>


export default TablePdf