import React from "react";
import { PDFViewer } from "@react-pdf/renderer";
import { useLocation } from "react-router-dom";
import ExamplePDF from "./examplePDF";
import ReceiptPDF from "./jewelInterestPdf";

const JewelInterestPreview = () => {
  const location = useLocation();
  const { type, rowData } = location.state || {};
  console.log({ type, rowData });
  return (
    <PDFViewer width="100%" height="1000">
      <ReceiptPDF data={rowData} />
      {/* <ExamplePDF data={rowData} /> */}
    </PDFViewer>
  );
};

export default JewelInterestPreview;
