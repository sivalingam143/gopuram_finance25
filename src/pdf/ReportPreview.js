import React from 'react'
import {  PDFViewer } from '@react-pdf/renderer';

import Report from './Report';
const ReportPreview = () => (
    <PDFViewer width="100%" height="1000">
      <Report />
    </PDFViewer>
  )

export default ReportPreview