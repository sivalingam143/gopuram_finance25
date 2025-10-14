import React from 'react'
import {  PDFViewer } from '@react-pdf/renderer';
import { useLocation } from 'react-router-dom';
import OfficeCopyDocument from './jewelpawnoffice';

const JewelPawngPreview = () => {
  const location = useLocation();
  const { type, rowData } = location.state || {};
  return(
    <PDFViewer width="100%" height="1000">
      <OfficeCopyDocument data={rowData} />
    </PDFViewer>
  )
}
export default JewelPawngPreview