import React, { useEffect, useState } from "react";
import { PDFViewer } from "@react-pdf/renderer";
import { useLocation } from "react-router-dom";
import JewelPawnrecoveryPdf from "./jewelpawnRecoverPdf";
import API_DOMAIN from "../config/config";

const JewelPawnRecoverPreview = () => {
  const location = useLocation();
  const { type, rowData } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [proofData, setProofData] = useState([]);
  const [pdfData, setPdfData] = useState(rowData);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_DOMAIN}/pawnjewelry.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          search_text: searchText,
        }),
      });

      const responseData = await response.json();
      setLoading(false);
      console.log("responseData", responseData);
      if (responseData.head.code === 200) {
        setProofData(responseData.body.pawnjewelry);
      } else {
        throw new Error(responseData.head.msg);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchText]);

  useEffect(() => {
    if (proofData.length > 0 && rowData?.receipt_no) {
      const matchingData = proofData.find(
        (item) => String(item.receipt_no) === String(rowData.receipt_no)
      );
      if (matchingData) {
        setPdfData({
          ...rowData,
          proof_base64code: matchingData.proof_base64code || [],
        });
      } else {
        setPdfData({
          ...rowData,
          proof_base64code: [],
        });
      }
    } else {
      setPdfData({
        ...rowData,
        proof_base64code: rowData?.proof_base64code || [],
      });
    }
  }, [proofData, rowData]);

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <PDFViewer width="100%" height="1000">
          <JewelPawnrecoveryPdf data={pdfData} />
        </PDFViewer>
      )}
    </div>
  );
};

export default JewelPawnRecoverPreview;
