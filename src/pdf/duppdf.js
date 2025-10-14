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
  section: {
    margin: 8,
    flexGrow: 1, border:1, padding:0,
    letterSpacing:1,
    borderColor:'#000',
    marginVertical:"25px",
  },

  font:{
    fontFamily: 'fontRegular',
  },

tablehead:{
  fontSize: 9,
    fontFamily: 'Times-Roman',
    display: 'flex',
    flexDirection: 'row',
    width: "100%",
    borderBottom: 1,
},
tablebody:{
  fontSize: 8,
  fontFamily: 'Times-Roman',
  display: 'flex',
  flexDirection: 'row',
  borderBottom:0.8

},
dateTitle:{
  width:"8%",
  borderRight:0.8,padding:5,
  fontSize:10, 
},
date:{
  width:"8%",
  borderRight:0.8,padding:5,
  fontSize:9,
},
csDetailsTitle:{
  width:"25%",
  borderRight:0.8,
  padding:5,
  fontSize:10
},
csDetails:{
  width:"25%",
  borderRight:0.8,
  padding:8,
  fontSize:9
},
receiptNoTitle:{
  width:"9%",
  padding:5,
  borderRight:0.8,
  fontSize:10
},
receiptNo:{
  width:"9%",
  padding:5,
  borderRight:0.8,
  fontSize:9
},
amountTitle:{
  width:"6%",
  padding:5,
  borderRight:0.8,
  fontSize:10
},
amount:{
  width:"6%",
  padding:8,
  borderRight:0.8,
  fontSize:9
},
interstTitle:{
  width:"6%",
  padding:5,
  borderRight:0.8,
  fontSize:10
},
interst:{
  width:"6%",
  padding:8,
  borderRight:0.8,
  fontSize:9
},
podTitle:{
  width:"20%",
  padding:5,
  borderRight:0.8,
  fontSize:10
},
pod:{
  width:"20%",
  padding:5,
  borderRight:0.8,
  fontSize:9
},
countTitle:{
  width:"5%",
  padding:5,
  borderRight:0.8,
},
count:{
  width:"5%",
  padding:8,
  borderRight:0.8,
  fontSize:10
},
weightTitle:{
  width:"5%",
paddingVertical:5, paddingHorizontal:2,
  borderRight:0.8,
},
weight:{
  width:"5%",
  padding:8,
  borderRight:0.8,
  fontSize:9
},
costTitle:{
  width:"6%",
  padding:5,
  borderRight:0.8,

},
cost:{  width:"6 %",
padding:8,
borderRight:0.8,},
recoverdateTitle:{
  padding:5,
},
reddate:{
  padding:8,
}




//  table view end
});
const Report = () => (
  <Document>
    <Page size="A4" orientation='landscape'  style={styles.page}>
      <View style={styles.section}>
        <View  style={styles.font}>
            <View style={styles.tablehead}>
                <Text style={styles.dateTitle}>Date</Text>
                <Text style={styles.csDetailsTitle}>customer Details</Text>
                <Text  style={styles.receiptNoTitle}>Receipt No.</Text>
                <Text  style={styles.amountTitle}>Amount</Text>
                <Text style={styles.interstTitle}>Interst </Text>
                <Text style={styles.podTitle}>Products</Text>
                <Text style={styles.countTitle}>Count</Text>
                <Text style={styles.weightTitle}> Weight</Text>
                <Text style={styles.costTitle}>Cost</Text>
                <Text style={styles.recoverdateTitle}>Recovery Date</Text>
            </View>
            <View style={styles.tablebody}>
                <Text style={styles.date}>22/05/2025</Text>
                <View style={styles.csDetails}>
                  <Text>Vetrivel,</Text>  {/*name */}
                  <Text>Arul Murugan</Text> {/*Father Name or Husband Name */}
                  <Text>1234567890</Text>{/*Mobile Number */}
                  <Text>2/209-19,Kurukku thurai, Sivagangai</Text>{/*address */}
                </View>
                <Text  style={styles.receiptNo}>1425</Text>
                <Text  style={styles.amount}>56790</Text>
                <Text style={styles.interst}>2456</Text>
                <Text style={styles.pod}>Kadhani, kai Chain</Text>
                <Text style={styles.count}>12</Text>
                <Text style={styles.weight}>150</Text>
                <Text style={styles.cost}>120000</Text>
                <Text style={styles.reddate}>22-06-2025</Text>
            </View>
            <View style={styles.tablebody}>
                <Text style={styles.date}>22/05/2025</Text>
                <View style={styles.csDetails}>
                  <Text>Vetrivel,</Text>  {/*name */}
                  <Text>Arul Murugan</Text> {/*Father Name or Husband Name */}
                  <Text>1234567890</Text>{/*Mobile Number */}
                  <Text>2/209-19,Kurukku thurai, Sivagangai</Text>{/*address */}
                </View>
                <Text  style={styles.receiptNo}>1425</Text>
                <Text  style={styles.amount}>56790</Text>
                <Text style={styles.interst}>2456</Text>
                <Text style={styles.pod}>Kadhani, kai Chain</Text>
                <Text style={styles.count}>12</Text>
                <Text style={styles.weight}>150</Text>
                <Text style={styles.cost}>120000</Text>
                <Text style={styles.reddate}>22-06-2025</Text>
            </View>
            <View style={styles.tablebody}>
                <Text style={styles.date}>22/05/2025</Text>
                <View style={styles.csDetails}>
                  <Text>Vetrivel,</Text>  {/*name */}
                  <Text>Arul Murugan</Text> {/*Father Name or Husband Name */}
                  <Text>1234567890</Text>{/*Mobile Number */}
                  <Text>2/209-19,Kurukku thurai, Sivagangai</Text>{/*address */}
                </View>
                <Text  style={styles.receiptNo}>1425</Text>
                <Text  style={styles.amount}>56790</Text>
                <Text style={styles.interst}>2456</Text>
                <Text style={styles.pod}>Kadhani, kai Chain</Text>
                <Text style={styles.count}>12</Text>
                <Text style={styles.weight}>150</Text>
                <Text style={styles.cost}>120000</Text>
                <Text style={styles.reddate}>22-06-2025</Text>
            </View>
            <View style={styles.tablebody}>
                <Text style={styles.date}>22/05/2025</Text>
                <View style={styles.csDetails}>
                  <Text>Vetrivel,</Text>  {/*name */}
                  <Text>Arul Murugan</Text> {/*Father Name or Husband Name */}
                  <Text>1234567890</Text>{/*Mobile Number */}
                  <Text>2/209-19,Kurukku thurai, Sivagangai</Text>{/*address */}
                </View>
                <Text  style={styles.receiptNo}>1425</Text>
                <Text  style={styles.amount}>56790</Text>
                <Text style={styles.interst}>2456</Text>
                <Text style={styles.pod}>Kadhani, kai Chain</Text>
                <Text style={styles.count}>12</Text>
                <Text style={styles.weight}>150</Text>
                <Text style={styles.cost}>120000</Text>
                <Text style={styles.reddate}>22-06-2025</Text>
            </View>
            <View style={styles.tablebody}>
                <Text style={styles.date}>22/05/2025</Text>
                <View style={styles.csDetails}>
                  <Text>Vetrivel,</Text>  {/*name */}
                  <Text>Arul Murugan</Text> {/*Father Name or Husband Name */}
                  <Text>1234567890</Text>{/*Mobile Number */}
                  <Text>2/209-19,Kurukku thurai, Sivagangai</Text>{/*address */}
                </View>
                <Text  style={styles.receiptNo}>1425</Text>
                <Text  style={styles.amount}>56790</Text>
                <Text style={styles.interst}>2456</Text>
                <Text style={styles.pod}>Kadhani, kai Chain</Text>
                <Text style={styles.count}>12</Text>
                <Text style={styles.weight}>150</Text>
                <Text style={styles.cost}>120000</Text>
                <Text style={styles.reddate}>22-06-2025</Text>
            </View>
            <View style={styles.tablebody}>
                <Text style={styles.date}>22/05/2025</Text>
                <View style={styles.csDetails}>
                  <Text>Vetrivel,</Text>  {/*name */}
                  <Text>Arul Murugan</Text> {/*Father Name or Husband Name */}
                  <Text>1234567890</Text>{/*Mobile Number */}
                  <Text>2/209-19,Kurukku thurai, Sivagangai</Text>{/*address */}
                </View>
                <Text  style={styles.receiptNo}>1425</Text>
                <Text  style={styles.amount}>56790</Text>
                <Text style={styles.interst}>2456</Text>
                <Text style={styles.pod}>Kadhani, kai Chain</Text>
                <Text style={styles.count}>12</Text>
                <Text style={styles.weight}>150</Text>
                <Text style={styles.cost}>120000</Text>
                <Text style={styles.reddate}>22-06-2025</Text>
            </View>
            <View style={styles.tablebody}>
                <Text style={styles.date}>22/05/2025</Text>
                <View style={styles.csDetails}>
                  <Text>Vetrivel,</Text>  {/*name */}
                  <Text>Arul Murugan</Text> {/*Father Name or Husband Name */}
                  <Text>1234567890</Text>{/*Mobile Number */}
                  <Text>2/209-19,Kurukku thurai, Sivagangai</Text>{/*address */}
                </View>
                <Text  style={styles.receiptNo}>1425</Text>
                <Text  style={styles.amount}>56790</Text>
                <Text style={styles.interst}>2456</Text>
                <Text style={styles.pod}>Kadhani, kai Chain</Text>
                <Text style={styles.count}>12</Text>
                <Text style={styles.weight}>150</Text>
                <Text style={styles.cost}>120000</Text>
                <Text style={styles.reddate}>22-06-2025</Text>
            </View>
            <View style={styles.tablebody}>
                <Text style={styles.date}>22/05/2025</Text>
                <View style={styles.csDetails}>
                  <Text>Vetrivel,</Text>  {/*name */}
                  <Text>Arul Murugan</Text> {/*Father Name or Husband Name */}
                  <Text>1234567890</Text>{/*Mobile Number */}
                  <Text>2/209-19,Kurukku thurai, Sivagangai</Text>{/*address */}
                </View>
                <Text  style={styles.receiptNo}>1425</Text>
                <Text  style={styles.amount}>56790</Text>
                <Text style={styles.interst}>2456</Text>
                <Text style={styles.pod}>Kadhani, kai Chain</Text>
                <Text style={styles.count}>12</Text>
                <Text style={styles.weight}>150</Text>
                <Text style={styles.cost}>120000</Text>
                <Text style={styles.reddate}>22-06-2025</Text>
            </View>
            <View style={styles.tablebody}>
                <Text style={styles.date}>22/05/2025</Text>
                <View style={styles.csDetails}>
                  <Text>Vetrivel,</Text>  {/*name */}
                  <Text>Arul Murugan</Text> {/*Father Name or Husband Name */}
                  <Text>1234567890</Text>{/*Mobile Number */}
                  <Text>2/209-19,Kurukku thurai, Sivagangai</Text>{/*address */}
                </View>
                <Text  style={styles.receiptNo}>1425</Text>
                <Text  style={styles.amount}>56790</Text>
                <Text style={styles.interst}>2456</Text>
                <Text style={styles.pod}>Kadhani, kai Chain</Text>
                <Text style={styles.count}>12</Text>
                <Text style={styles.weight}>150</Text>
                <Text style={styles.cost}>120000</Text>
                <Text style={styles.reddate}>22-06-2025</Text>
            </View>
            <View style={styles.tablebody}>
                <Text style={styles.date}>22/05/2025</Text>
                <View style={styles.csDetails}>
                  <Text>Vetrivel,</Text>  {/*name */}
                  <Text>Arul Murugan</Text> {/*Father Name or Husband Name */}
                  <Text>1234567890</Text>{/*Mobile Number */}
                  <Text>2/209-19,Kurukku thurai, Sivagangai</Text>{/*address */}
                </View>
                <Text  style={styles.receiptNo}>1425</Text>
                <Text  style={styles.amount}>56790</Text>
                <Text style={styles.interst}>2456</Text>
                <Text style={styles.pod}>Kadhani, kai Chain</Text>
                <Text style={styles.count}>12</Text>
                <Text style={styles.weight}>150</Text>
                <Text style={styles.cost}>120000</Text>
                <Text style={styles.reddate}>22-06-2025</Text>
            </View>
            <View style={styles.tablebody}>
                <Text style={styles.date}>22/05/2025</Text>
                <View style={styles.csDetails}>
                  <Text>Vetrivel,</Text>  {/*name */}
                  <Text>Arul Murugan</Text> {/*Father Name or Husband Name */}
                  <Text>1234567890</Text>{/*Mobile Number */}
                  <Text>2/209-19,Kurukku thurai, Sivagangai</Text>{/*address */}
                </View>
                <Text  style={styles.receiptNo}>1425</Text>
                <Text  style={styles.amount}>56790</Text>
                <Text style={styles.interst}>2456</Text>
                <Text style={styles.pod}>Kadhani, kai Chain</Text>
                <Text style={styles.count}>12</Text>
                <Text style={styles.weight}>150</Text>
                <Text style={styles.cost}>120000</Text>
                <Text style={styles.reddate}>22-06-2025</Text>
            </View>  <View style={styles.tablebody}>
                <Text style={styles.date}>22/05/2025</Text>
                <View style={styles.csDetails}>
                  <Text>Vetrivel,</Text>  {/*name */}
                  <Text>Arul Murugan</Text> {/*Father Name or Husband Name */}
                  <Text>1234567890</Text>{/*Mobile Number */}
                  <Text>2/209-19,Kurukku thurai, Sivagangai</Text>{/*address */}
                </View>
                <Text  style={styles.receiptNo}>1425</Text>
                <Text  style={styles.amount}>56790</Text>
                <Text style={styles.interst}>2456</Text>
                <Text style={styles.pod}>Kadhani, kai Chain</Text>
                <Text style={styles.count}>12</Text>
                <Text style={styles.weight}>150</Text>
                <Text style={styles.cost}>120000</Text>
                <Text style={styles.reddate}>22-06-2025</Text>
            </View>
            <View style={styles.tablebody}>
                <Text style={styles.date}>22/05/2025</Text>
                <View style={styles.csDetails}>
                  <Text>Vetrivel,</Text>  {/*name */}
                  <Text>Arul Murugan</Text> {/*Father Name or Husband Name */}
                  <Text>1234567890</Text>{/*Mobile Number */}
                  <Text>2/209-19,Kurukku thurai, Sivagangai</Text>{/*address */}
                </View>
                <Text  style={styles.receiptNo}>1425</Text>
                <Text  style={styles.amount}>56790</Text>
                <Text style={styles.interst}>2456</Text>
                <Text style={styles.pod}>Kadhani, kai Chain</Text>
                <Text style={styles.count}>12</Text>
                <Text style={styles.weight}>150</Text>
                <Text style={styles.cost}>120000</Text>
                <Text style={styles.reddate}>22-06-2025</Text>
            </View>
            <View style={styles.tablebody}>
                <Text style={styles.date}>22/05/2025</Text>
                <View style={styles.csDetails}>
                  <Text>Vetrivel,</Text>  {/*name */}
                  <Text>Arul Murugan</Text> {/*Father Name or Husband Name */}
                  <Text>1234567890</Text>{/*Mobile Number */}
                  <Text>2/209-19,Kurukku thurai, Sivagangai</Text>{/*address */}
                </View>
                <Text  style={styles.receiptNo}>1425</Text>
                <Text  style={styles.amount}>56790</Text>
                <Text style={styles.interst}>2456</Text>
                <Text style={styles.pod}>Kadhani, kai Chain</Text>
                <Text style={styles.count}>12</Text>
                <Text style={styles.weight}>150</Text>
                <Text style={styles.cost}>120000</Text>
                <Text style={styles.reddate}>22-06-2025</Text>
            </View>
            <View style={styles.tablebody}>
                <Text style={styles.date}>22/05/2025</Text>
                <View style={styles.csDetails}>
                  <Text>Vetrivel,</Text>  {/*name */}
                  <Text>Arul Murugan</Text> {/*Father Name or Husband Name */}
                  <Text>1234567890</Text>{/*Mobile Number */}
                  <Text>2/209-19,Kurukku thurai, Sivagangai</Text>{/*address */}
                </View>
                <Text  style={styles.receiptNo}>1425</Text>
                <Text  style={styles.amount}>56790</Text>
                <Text style={styles.interst}>2456</Text>
                <Text style={styles.pod}>Kadhani, kai Chain</Text>
                <Text style={styles.count}>12</Text>
                <Text style={styles.weight}>150</Text>
                <Text style={styles.cost}>120000</Text>
                <Text style={styles.reddate}>22-06-2025</Text>
            </View>
            <View style={styles.tablebody}>
                <Text style={styles.date}>22/05/2025</Text>
                <View style={styles.csDetails}>
                  <Text>Vetrivel,</Text>  {/*name */}
                  <Text>Arul Murugan</Text> {/*Father Name or Husband Name */}
                  <Text>1234567890</Text>{/*Mobile Number */}
                  <Text>2/209-19,Kurukku thurai, Sivagangai</Text>{/*address */}
                </View>
                <Text  style={styles.receiptNo}>1425</Text>
                <Text  style={styles.amount}>56790</Text>
                <Text style={styles.interst}>2456</Text>
                <Text style={styles.pod}>Kadhani, kai Chain</Text>
                <Text style={styles.count}>12</Text>
                <Text style={styles.weight}>150</Text>
                <Text style={styles.cost}>120000</Text>
                <Text style={styles.reddate}>22-06-2025</Text>
            </View>
            <View style={styles.tablebody}>
                <Text style={styles.date}>22/05/2025</Text>
                <View style={styles.csDetails}>
                  <Text>Vetrivel,</Text>  {/*name */}
                  <Text>Arul Murugan</Text> {/*Father Name or Husband Name */}
                  <Text>1234567890</Text>{/*Mobile Number */}
                  <Text>2/209-19,Kurukku thurai, Sivagangai</Text>{/*address */}
                </View>
                <Text  style={styles.receiptNo}>1425</Text>
                <Text  style={styles.amount}>56790</Text>
                <Text style={styles.interst}>2456</Text>
                <Text style={styles.pod}>Kadhani, kai Chain</Text>
                <Text style={styles.count}>12</Text>
                <Text style={styles.weight}>150</Text>
                <Text style={styles.cost}>120000</Text>
                <Text style={styles.reddate}>22-06-2025</Text>
            </View>
            <View style={styles.tablebody}>
                <Text style={styles.date}>22/05/2025</Text>
                <View style={styles.csDetails}>
                  <Text>Vetrivel,</Text>  {/*name */}
                  <Text>Arul Murugan</Text> {/*Father Name or Husband Name */}
                  <Text>1234567890</Text>{/*Mobile Number */}
                  <Text>2/209-19,Kurukku thurai, Sivagangai</Text>{/*address */}
                </View>
                <Text  style={styles.receiptNo}>1425</Text>
                <Text  style={styles.amount}>56790</Text>
                <Text style={styles.interst}>2456</Text>
                <Text style={styles.pod}>Kadhani, kai Chain</Text>
                <Text style={styles.count}>12</Text>
                <Text style={styles.weight}>150</Text>
                <Text style={styles.cost}>120000</Text>
                <Text style={styles.reddate}>22-06-2025</Text>
            </View>
            <View style={styles.tablebody}>
                <Text style={styles.date}>22/05/2025</Text>
                <View style={styles.csDetails}>
                  <Text>Vetrivel,</Text>  {/*name */}
                  <Text>Arul Murugan</Text> {/*Father Name or Husband Name */}
                  <Text>1234567890</Text>{/*Mobile Number */}
                  <Text>2/209-19,Kurukku thurai, Sivagangai</Text>{/*address */}
                </View>
                <Text  style={styles.receiptNo}>1425</Text>
                <Text  style={styles.amount}>56790</Text>
                <Text style={styles.interst}>2456</Text>
                <Text style={styles.pod}>Kadhani, kai Chain</Text>
                <Text style={styles.count}>12</Text>
                <Text style={styles.weight}>150</Text>
                <Text style={styles.cost}>120000</Text>
                <Text style={styles.reddate}>22-06-2025</Text>
            </View>
        </View>
      </View>
    </Page>
  </Document>
)

export default Report