import React, { useEffect, useState } from "react";
import { Container, Col, Row } from "react-bootstrap";
import { FaMagnifyingGlass } from "react-icons/fa6";
import MobileView from "../../components/MobileView";
import TableUI from "../../components/Table";
import { TextInputForm } from "../../components/Forms";
import { ClickButton } from "../../components/ClickButton";
import API_DOMAIN from "../../config/config";
import { useMediaQuery } from "react-responsive";
// import { useNavigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import LoadingOverlay from "../../components/LoadingOverlay";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { BorderAll } from "@mui/icons-material";

const Customer = () => {
  const navigate = useNavigate();
  const CustomerTablehead = [
    "No",
    "customer img",
    "customer No",
    "Customer Name",
    "Mobile No.",
    "Address",
    "Place",
    "Action",
  ];
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const [customerData, setcustomerData] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const fetchDatajewelpawncustomer = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_DOMAIN}/customer.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          search_text: searchText,
        }),
      });

      const responseData = await response.json();
      console.log(responseData);
      setLoading(false);
      if (responseData.head.code === 200) {
        setcustomerData(responseData.body.customer);
        setLoading(false);
      } else {
        throw new Error(responseData.head.msg);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error.message);
    }
  };
  useEffect(() => {
    fetchDatajewelpawncustomer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);
  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleDownloadPDF = () => {
    // Create jsPDF instance in landscape mode (A4)
    const doc = new jsPDF({
      orientation: "landscape", // landscape mode
      unit: "mm",
      format: "a4",
    });

    doc.setFontSize(16);
    doc.text("Customer List", 14, 15); // title at top

    doc.autoTable({
      startY: 25, // start table below title
      head: [
        [
          "NO",
          "CUSTOMER NO",
          "NAME",
          "ADDRESS",
          "PLACE",
          "PINCODE",
          "PHONE NO",
          "ADDITIONAL NO",
          "REFERENCE",
          "PROOF TYPE",
          "PROOF NO",
        ],
      ],
      body: customerData.map((item, index) => [
        index + 1,
        item.customer_no,
        item.name,
        item.customer_details,
        item.place,
        item.pincode,
        item.mobile_number,
        item.addtionsonal_mobile_number,
        item.reference,
        item.upload_type,
        item.proof_number,
      ]),
      styles: {
        fontSize: 10, // reduce font to fit more columns
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [22, 160, 133], // optional: header color
        textColor: 255,
        fontStyle: "bold",
      },
      columnStyles: {
        3: { cellWidth: 40 }, // ADDRESS column wider
        4: { cellWidth: 25 }, // PLACE column
        8: { cellWidth: 30 }, // REFERENCE column
      },
      theme: "grid",
      didDrawPage: (data) => {
        // optional: page numbers
        const pageCount = doc.getNumberOfPages();
        doc.setFontSize(10);
        doc.text(
          `Page ${pageCount}`,
          doc.internal.pageSize.getWidth() - 20,
          doc.internal.pageSize.getHeight() - 10
        );
      },
    });

    doc.save("Customer_List.pdf");
  };

  const handleDownloadExcel = () => {
    const wb = XLSX.utils.book_new();
    const wsData = [
      [
        "NO",
        "CUSTOMER NO",
        "NAME",
        "ADDRESS",
        "PLACE",
        "PINCODE",
        "PHONE NO",
        "ADDITIONAL NO",
        "REFERENCE",
        "PROOF TYPE",
        "PROOF NO",
      ],
      ...customerData.map((item, index) => [
        index + 1,
        item.customer_no,
        item.name,
        item.customer_details,
        item.place,
        item.pincode,
        item.mobile_number,
        item.addtionsonal_mobile_number,
        item.reference,
        item.upload_type,
        item.proof_number,
      ]),
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, "Customers");
    XLSX.writeFile(wb, "Customer_List.xlsx");
  };

  return (
    <div>
      <Container fluid>
        <Row>
          <Col lg="6" md="6" xs="12">
            <div className="page-nav py-3">
              <span class="nav-list">Customer</span>
            </div>
          </Col>
          <Col lg="6" md="6" xs="12" className="align-self-center text-end">
            <span className="mx-2">
              <ClickButton
                label={<>Add New</>}
                onClick={() => navigate("/console/master/customer/create")}
              />
            </span>
            <span className="mx-2">
              <ClickButton label={<> PDF</>} onClick={handleDownloadPDF} />
            </span>
            <span className="mx-2">
              <ClickButton label={<> Excel</>} onClick={handleDownloadExcel} />
            </span>
          </Col>

          <Col lg="3" md="5" xs="12" className="py-1">
            <TextInputForm
              placeholder={"Name, mobile number"}
              onChange={(e) => handleSearch(e.target.value)}
              prefix_icon={<FaMagnifyingGlass />}
            >
              {" "}
            </TextInputForm>
          </Col>

          {loading ? (
            <LoadingOverlay isLoading={loading} />
          ) : (
            <>
              <Col lg="12" md="12" xs="12" className="px-0">
                <div className="py-1">
                  {isMobile &&
                    customerData.map((user, index) => (
                      <MobileView
                        key={index}
                        sno={user.id}
                        name={user.customer_name}
                        subname={user.mobile_number}
                      />
                    ))}
                  <TableUI
                    headers={CustomerTablehead}
                    body={customerData}
                    type="customer"
                    pageview={"yes"}
                  />
                </div>
              </Col>
            </>
          )}
        </Row>
      </Container>
    </div>
  );
};

export default Customer;
