import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Table } from "react-bootstrap";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
import API_DOMAIN from "../../config/config";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { ClickButton } from "../../components/ClickButton";

const PawnJewelryUpload = () => {
  const [excelData, setExcelData] = useState([]);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [excelFile, setExcelFile] = useState(null);
  const { type, rowData } = location.state || {};
  const today = new Date();
  const defaultDate = today.toISOString().substr(0, 10);

  const initialState = {
    recipt_no: "",
    customer_name: "",
    name_of_guardians: "",
    mobile_number: "",
    address: "",
    group: "",
    jewel_original_rate: "",
    pawn_rate: "",
    pawn_interest: "",
    pawn_interest_amount: "",
    pawnjewelry_date: defaultDate,
    pawnjewelry_recovery_date: defaultDate,
    pawnjewelry_recovery_finshed_date: "",
    receipt_no: "",
    customer_no: "",
    remark_jewel_pawn: "",
    createdby: "",
    paidby: "",
    jewel_product: [
      { Jewel_name: "", weight: "", count: "", remark: "", qlty: "" },
    ],
  };

  const [formData, setFormData] = useState(initialState);
  console.log(formData);
  const convertExcelDate = (serialNumber) => {
    if (serialNumber) {
      const date = new Date(Math.round((serialNumber - 25569) * 86400 * 1000));
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      const dd = String(date.getDate()).padStart(2, "0");
      return `${yyyy}/${mm}/${dd}`;
    } else {
      return "";
    }
  };

  // Function to handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setExcelFile(file); // Store the selected file
      const reader = new FileReader();
      reader.onload = (evt) => {
        const binaryStr = evt.target.result;
        const wb = XLSX.read(binaryStr, { type: "binary" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(ws);
        setExcelData(data); 

        if (data.length > 0) {
          const updatedFormData = data.map((row) => ({
            recipt_no: row["recipt_no"] || "",
            customer_no: row["customer_no"] || "",
            customer_name: row["customer_name"] || "",
            name_of_guardians: row["name_of_guardians"] || "",
            mobile_number: row["mobile_number"] || "",
            address: row["address"] || "",
            group: row["group"] || "",
            jewel_product: [
              {
                Jewel_name: row["Jewel_name"] || "",
                weight: row["weight"] || "",
                count: row["count"] || "",
                remark: row["remark"] || "",
                qlty: row["qlty"] || "",
              },
            ],
            jewel_original_rate: row["jewel_original_rate"] || "",
            pawn_rate: row["pawn_rate"] || "",
            pawn_interest: row["pawn_interest"] || "",
            pawn_interest_amount: row["pawn_interest_amount"] || "",
            pawnjewelry_date:
              convertExcelDate(row["pawnjewelry_date"]) || defaultDate,
            pawnjewelry_recovery_date:
              convertExcelDate(row["pawnjewelry_recovery_date"]) || defaultDate,
            pawnjewelry_recovery_finshed_date:
              convertExcelDate(row["pawnjewelry_recovery_finshed_date"]) ||
              defaultDate,
            remark_jewel_pawn: row["remark_jewel_pawn"] || "",
            createdby: row["createdby"] || "",
            paidby: row["paidby"] || "",
          }));

          setFormData(updatedFormData); // Update the formData state
        }
      };
      reader.readAsBinaryString(file);
    }
  };

  const renderTableRows = () => {
    return formData.map((row, index) => (
      <tr key={index}>
        {Object.keys(row).map((key, idx) => {
          if (key === "jewel_product") {
            return (
              <td key={idx}>
                <table>
                  <thead>
                    <tr>
                      <th>Jewel Name</th>
                      <th>Weight</th>
                      <th>Count</th>
                      <th>Remark</th>
                      <th>Quality</th>
                    </tr>
                  </thead>
                  <tbody>
                    {row[key].map((product, pIdx) => (
                      <tr key={pIdx}>
                        <td>{product.Jewel_name}</td>
                        <td>{product.weight}</td>
                        <td>{product.count}</td>
                        <td>{product.remark}</td>
                        <td>{product.qlty}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </td>
            );
          } else {
            return <td key={idx}>{row[key] ? row[key] : ""}</td>;
          }
        })}
      </tr>
    ));
  };

  const renderTableHeader = () => {
    const headerKeys = formData.length > 0 ? Object.keys(formData[0]) : []; // Use the first row for header keys
    return headerKeys.map((key, index) => <th key={index}>{key}</th>);
  };

  const handleSubmit = async () => {
    setLoading(true);

    // Prepare the data in the correct format
    const dataToSend = {
      pawnjewelry_data: formData.map((item) => ({
        recipt_no: item.recipt_no || "", // Corrected key name
        customer_no: item.customer_no || "",
        customer_name: item.customer_name || "",
        name_of_guardians: item.name_of_guardians || "",
        mobile_number: item.mobile_number || "",
        address: item.address || "",
        group: item.group || "",
        jewel_original_rate: item.jewel_original_rate || "",
        pawn_rate: item.pawn_rate || "",
        pawn_interest: item.pawn_interest || "",
        pawn_interest_amount: item.pawn_interest_amount || "",
        pawnjewelry_date: item.pawnjewelry_date || defaultDate,
        pawnjewelry_recovery_date:
          item.pawnjewelry_recovery_date || defaultDate,
        pawnjewelry_recovery_finshed_date:
          item.pawnjewelry_recovery_finshed_date || defaultDate,
        remark_jewel_pawn: item.remark_jewel_pawn || "",
        createdby: item.createdby || "",
        paidby: item.paidby || "",
        jewel_product: item.jewel_product.map((jewel) => ({
          Jewel_name: jewel.Jewel_name || "",
          weight: jewel.weight || "",
          count: jewel.count || "",
          remark: jewel.remark || "",
          qlty: jewel.qlty || "",
        })),
      })),
    };

    console.log("Formatted Data:", JSON.stringify(dataToSend, null, 2)); // Debugging

    try {
      const response = await fetch(`${API_DOMAIN}/uploadexcel.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });
      console.log("body", JSON.stringify(dataToSend));

      const responseData = await response.json();
      console.log("response", response);
      console.log("responsedata", responseData);

      if (responseData.head.code === 200) {
        toast.success(responseData.head.msg, {
          position: "top-center",
          autoClose: 2000,
        });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast.error(responseData.head.msg, {
          position: "top-center",
          autoClose: 2000,
        });
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.", {
        position: "top-center",
        autoClose: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Row className="py-3">
        <Col>
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </Col>
      </Row>
      <Row className="py-3">
        <Col>
          <input type="file" accept=".xlsx,.xls" onChange={handleFileChange} />
        </Col>
      </Row>
      <Row className="py-3">
        <Col>
          {excelData.length > 0 && (
            <p className="mt-2">Number of Rows: {excelData.length}</p>
          )}
        </Col>
      </Row>
      <Row>
        <Col>
          {fileName && <h5>Selected File: {fileName}</h5>}
          {excelData.length > 0 && (
            <div className="table-responsive">
              <Table striped bordered hover>
                <thead>
                  <tr>{renderTableHeader()}</tr>
                </thead>
                <tbody>{renderTableRows()}</tbody>
              </Table>
            </div>
          )}
        </Col>
        <Col lg="12">
          <span className="px-1">
            <ClickButton
              label={<> Submit</>}
              onClick={handleSubmit}
              disabled={loading}
            />
          </span>
          <span className="px-1">
            <ClickButton
              label={<> Cancel</>}
              onClick={() => navigate("/console/pawn/jewelpawning")}
              disabled={loading}
            />
          </span>
        </Col>
      </Row>
    </Container>
  );
};

export default PawnJewelryUpload;
