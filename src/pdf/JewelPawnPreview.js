import React from 'react'
import {  PDFViewer } from '@react-pdf/renderer';
import { useLocation } from 'react-router-dom';
import LoanReceiptPDF from './JewelPawnPdf';
// import OfficeCopyDocument from './jewelpawnoffice';

const JewelPawnPreview = () => {
  const location = useLocation();
  const { type, rowData } = location.state || {};
 console.log(rowData);
  return(
    <PDFViewer width="100%" height="1000">
      <LoanReceiptPDF data={rowData} />
      {/* <OfficeCopyDocument/> */}
    </PDFViewer>
  )
}
export default JewelPawnPreview