import React, { useEffect, useState } from "react";
import { Container, Col, Row, Table } from "react-bootstrap";
import { Calender, TextInputForm } from "../../components/Forms";
import { ClickButton } from "../../components/ClickButton";
import API_DOMAIN from "../../config/config";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import Report from "../../pdf/Report";

const OldRecord = () => {
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState([]);
  const [formData, setFormData] = useState({
    from_date: "",
    to_date: "",
  });

  // Function to handle date changes and update form data
  const handleChange = (dateString, label) => {
    const formattedDate = formatDate(dateString);
    setFormData((prevData) => ({
      ...prevData,
      [label]: formattedDate,
    }));
  };
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_DOMAIN}/oldrecord.php`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            search_text: searchText,
            from_date: formData.from_date,
            to_date: formData.to_date,
          }),
        });

        const responseData = await response.json();
        setLoading(false);
        console.log("response", responseData);
        if (responseData.head.code === 200) {
          setUserData(responseData.body.records);
        } else {
          setUserData([]);
          console.error("Error:", responseData.head.msg);
        }
      } catch (error) {
        setLoading(false);
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, [searchText, formData.from_date, formData.to_date]); // Re-fetch data when filters change

  const handleSearch = (value) => {
    setSearchText(value);
  };
  const setLabel = (date, label) => {
    const dateString = date instanceof Date ? date.toISOString() : date;
    handleChange(dateString, label);

    if (label === "from_date" || label === "to_date") {
      setFormData((prevData) => ({
        ...prevData,
        [label]: dateString,
      }));
    }
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString); // Convert string to Date object
    const day = String(date.getDate()).padStart(2, "0"); // Ensure 2 digits
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = String(date.getFullYear()).slice(-2); // Get last 2 digits of the year
    return `${day}/${month}/${year}`; // Return in dd/mm/yy format
  };

  return (
    <div className="p-2">
      <Container fluid>
        <Row>
          <Col lg="6" className="align-self-center py-3">
            <div>Old Report</div>
          </Col>
          <Col lg="6" className="align-self-center py-3 text-end">
            <PDFDownloadLink
              document={<Report data={userData} />}
              fileName="old_record.pdf"
            >
              {({ blob, url, loading, error }) => (
                <a
                  className="dropdown-item"
                  role="button"
                  tabIndex="0"
                  href={url}
                  download="old_record.pdf"
                >
                  <ClickButton label={<>PDF</>} />
                </a>
              )}
            </PDFDownloadLink>
          </Col>
          <Col lg="4" className="align-self-center py-3">
            <div>
              <TextInputForm
                placeholder={"பெயர்,ரசீது எண்"}
                labelname={"தேடு"}
                onChange={(e) => handleSearch(e.target.value)}
                name="search"
              ></TextInputForm>
            </div>
          </Col>
          <Col lg="4" className="align-self-center py-3">
            <Calender
              calenderlabel={<>From</>}
              setLabel={(date) => setLabel(date, "from_date")}
            />
          </Col>
          <Col lg="4" className="align-self-center py-3">
            <Calender
              calenderlabel={<>To</>}
              setLabel={(date) => setLabel(date, "to_date")}
            />
          </Col>
          <Col lg="12" className="align-self-center py-3">
            <div className="wire-table">
              <Table>
                <thead>
                  <tr>
                    <td>Date</td>
                    <td>Receipt No.</td>
                    <td>Customer Details</td>
                    <td>Amount</td>
                    <td>Interest</td>
                    <td>Product Details</td>
                    <td>Count</td>
                    <td>Weight</td>
                    <td>Total Amount</td>
                    <td>Recovery Date</td>
                  </tr>
                </thead>
                <tbody>
                  {userData.length > 0 ? (
                    userData.map((item, index) => (
                      <tr key={index}>
                        <td>{formatDate(item.oldrecord_date)}</td>
                        <td>{item.bill_no}</td>
                        <td>{item.customer_details}</td>
                        <td>{item.pawn_amount}</td>
                        <td>{item.interest_amount}</td>
                        <td>{item.jewel_details}</td>
                        <td>{item.count}</td>
                        <td>{item.weight}</td>
                        <td>{item.amount}</td>
                        <td>{formatDate(item.recovery_date)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="10">No data available</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default OldRecord;
