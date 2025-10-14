import React, { useEffect, useState } from "react";
import { Container, Col, Row, Table } from "react-bootstrap";
import { Calender, TextInputForm } from "../../components/Forms";
import { ClickButton } from "../../components/ClickButton";
import API_DOMAIN from "../../config/config";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import Report from "../../pdf/Report";

const PawnGReport = () => {
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState([]);
  const [formData, setFormData] = useState({
    from_date: "",
    to_date: "",
  });

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Function to handle date changes and update form data
  const handleChange = (dateString, label) => {
    const formattedDate = formatDate(dateString);
    setFormData((prevData) => ({
      ...prevData,
      [label]: formattedDate,
    }));
    console.log(`Label: ${label}, Date: ${formattedDate}`);
  };
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_DOMAIN}/pawnReport.php`, {
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
        console.log("responseData", responseData);
        setLoading(false);
        if (responseData.head.code === 200) {
          let sortedData = responseData.body.pawnjewelry_report.map((user) => ({
            ...user,
            jewel_product: JSON.parse(user.jewel_product || "[]"),
          }));

          setUserData(sortedData);
        } else {
          throw new Error(responseData.head.msg);
        }
      } catch (error) {
        setLoading(false);
        console.error("Error fetching data:", error.message);
      }
    };
    fetchData();
  }, [API_DOMAIN, searchText, formData]);

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

  return (
    <div className="p-2">
      <Container fluid>
        <Row>
          <Col lg="6" className="align-self-center py-3">
            <div>Pawn Report - G </div>
          </Col>
          <Col lg="6" className="align-self-center py-3 text-end">
            <PDFDownloadLink
              document={<Report data={userData} />}
              fileName="pawn_report.pdf"
            >
              {({ blob, url, loading, error }) => (
                <a
                  className="dropdown-item"
                  role="button"
                  tabIndex="0"
                  href={url}
                  download="pawn_report.pdf"
                >
                  <ClickButton label={<>PDF</>} />
                </a>
              )}
            </PDFDownloadLink>
          </Col>
          <Col lg="4" className="align-self-center py-3">
            <div>
              <TextInputForm
                placeholder={"தேடு ,பெயர் ,மொபைல் எண்."}
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
                  <td> Date</td>
                  <td> Receipt No.</td>
                  <td> Customer Details</td>
                  <td> Amount</td>
                  <td> Interest</td>
                  <td> Product Details</td>
                  <td> Count</td>
                  <td>Weight</td>
                  <td> Total Amount</td>
                  <td> Recovery Date</td>
                </thead>
                <tbody>
                  {userData.length > 0 ? (
                    userData.map((item, index) => (
                      <tr key={index}>
                        <td>{item.pawnjewelry_date}</td>
                        <td>{item.recipt_no}</td>
                        <td className="w-25">
                          <div>{item.customer_name}</div>
                          <div>{item.name_of_guardians}</div>
                          <div>{item.address}</div>
                          <div>{item.mobile_number}</div>
                        </td>
                        <td>{item.pawn_rate}</td>
                        <td>{item.pawn_interest_amount}</td>
                        <td className="w-25">
                          {item.products.map((product, idx) => (
                            <div key={idx}>{product.JewelName}</div>
                          ))}
                        </td>
                        <td>
                          {item.products.reduce(
                            (total, product) => total + product.count,
                            0
                          )}
                        </td>
                        <td>
                          {item.products.reduce(
                            (total, product) => total + product.weight,
                            0
                          )}
                        </td>
                        <td>{item.jewel_original_rate}</td>
                        <td>{item.pawnjewelry_recovery_finshed_date}</td>
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

export default PawnGReport;
