import React, { useState, useEffect } from "react";
import { Col, Container, Row, Alert } from "react-bootstrap";
import { TextInputForm, Calender } from "../../components/Forms";
import { ClickButton } from "../../components/ClickButton";
import PageNav from "../../components/PageNav";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API_DOMAIN from "../../config/config";

import TableUI from "../../components/Table";

const UserTablehead = [
  "No",
  "Interest Receive Date",
  "Name",
  "Loan Number",
  "Mobile Number",
  "Interest Amount",
  "Action",
];

const InterestPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { rowData } = location.state || {};
  const today = new Date();
  const [loading, setLoading] = useState(false);
  const [productList, setProductList] = useState([]);
  const [error, setError] = useState("");
  const [interestHistory, setInterestHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const initialState = {
    customer_no: rowData?.customer_no || "",
    receipt_no: rowData?.receipt_no || "",
    interest_receive_date: today.toISOString().substr(0, 10),
    name: rowData?.name || "",
    customer_details: rowData?.customer_details || "",
    place: rowData?.place || "",
    mobile_number: rowData?.mobile_number || "",
    original_amount: rowData?.original_amount || "",
    interest_rate: rowData?.interest_rate || "",
    jewel_product: Array.isArray(rowData?.jewel_product)
      ? rowData.jewel_product
      : JSON.parse(rowData?.jewel_product || "[]"),
    outstanding_period: rowData?.interest_payment_period || "",
    outstanding_amount: rowData?.interest_payment_amount || "",
    interest_income: "", // Editable input
  };

  const [formData, setFormData] = useState(initialState);

  const fetchInterestHistory = async () => {
    if (!rowData?.receipt_no) return;
    setHistoryLoading(true);
    try {
      const response = await fetch(`${API_DOMAIN}/interest.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          search_text: rowData.receipt_no,
        }),
      });

      const responseData = await response.json();
      console.log(responseData);
      if (responseData.head.code === 200) {
        const filteredHistory = responseData.body.interest.filter(
          (item) => item.receipt_no === rowData.receipt_no
        );
        setInterestHistory(filteredHistory);
      } else {
        console.error(
          "Error fetching interest history:",
          responseData.head.msg
        );
      }
    } catch (error) {
      console.error("Error fetching interest history:", error.message);
    } finally {
      setHistoryLoading(false);
    }
  };

  const fetchDataproduct = async () => {
    try {
      const response = await fetch(`${API_DOMAIN}/product.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ search_text: "" }),
      });

      const responseData = await response.json();
      if (responseData.head.code === 200) {
        setProductList(responseData.body.product);
      }
    } catch (error) {
      console.error("Error fetching product data:", error.message);
    }
  };

  useEffect(() => {
    fetchInterestHistory();
    fetchDataproduct();
  }, []);

  const handleChange = (e, fieldName, rowIndex) => {
    const value = e.target ? e.target.value : e.value;

    let updatedFormData = { ...formData };

    if (rowIndex !== undefined) {
      updatedFormData.jewel_product = formData.jewel_product.map((row, index) =>
        index === rowIndex ? { ...row, [fieldName]: value } : row
      );
    } else {
      updatedFormData = {
        ...formData,
        [fieldName]: value,
      };
    }

    setFormData(updatedFormData);
  };

  const setLabel = (date, label) => {
    let dateString =
      date instanceof Date ? date.toISOString().substr(0, 10) : date;
    setFormData((prevData) => ({
      ...prevData,
      [label]: dateString,
    }));
  };

  const handleSubmit = async () => {
    if (
      parseFloat(formData.outstanding_amount) !==
      parseFloat(formData.interest_income)
    ) {
      toast.error("Interest Amount should be equal to Outstanding Amount!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_DOMAIN}/interest.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, edit_interest_id: "" }),
      });

      const responseData = await response.json();
      console.log(responseData);
      if (responseData.head.code === 200) {
        toast.success(responseData.head.msg);
        setTimeout(() => {
          navigate(-1); // Back to CustomerDetails
        }, 1000);
      } else {
        toast.error(responseData.head.msg);
        setError(responseData.head.msg);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1); // Back to CustomerDetails
  };

  return (
    <div>
      <Container>
        <Row className="regular">
          <Col lg="12" md="12" xs="12" className="py-3">
            <PageNav pagetitle={"Interest Payment"}></PageNav>
          </Col>

          {/* Read-only Customer Info Container */}
          <Col lg={4}>
            <div className="customer-card bg-light border rounded p-3 h-100">
              <h5 className="mb-3">Customer Information</h5>
              <ul className="list-unstyled">
                <li className="mb-2 d-flex justify-content-between">
                  <strong>Customer No:</strong>
                  <span>{formData.customer_no}</span>
                </li>
                <li className="mb-2 d-flex justify-content-between">
                  <strong>Loan No:</strong>
                  <span>{formData.receipt_no}</span>
                </li>
                <li className="mb-2 d-flex justify-content-between">
                  <strong>Name:</strong>
                  <span>{formData.name}</span>
                </li>
                <li className="mb-2 d-flex justify-content-between">
                  <strong>Address:</strong>
                  <span>{formData.customer_details}</span>
                </li>
                <li className="mb-2 d-flex justify-content-between">
                  <strong>Place:</strong>
                  <span>{formData.place}</span>
                </li>
                <li className="mb-2 d-flex justify-content-between">
                  <strong>Mobile Number:</strong>
                  <span>{formData.mobile_number}</span>
                </li>
              </ul>
            </div>
          </Col>

          {/* Read-only Loan Info Container */}
          <Col lg={4}>
            <div className="customer-card bg-light border rounded p-3 h-100">
              <h5 className="mb-3">Loan Information</h5>
              <ul className="list-unstyled">
                <li className="mb-2 d-flex justify-content-between">
                  <strong>Principal Amount:</strong>
                  <span>₹{formData.original_amount}</span>
                </li>
                <li className="mb-2 d-flex justify-content-between">
                  <strong>Interest Rate:</strong>
                  <span>{formData.interest_rate}</span>
                </li>
                <li className="mb-2 d-flex justify-content-between">
                  <strong>Outstanding Period:</strong>
                  <span>{formData.outstanding_period}</span>
                </li>
                <li className="mb-2 d-flex justify-content-between">
                  <strong>Outstanding Amount:</strong>
                  <span>₹{formData.outstanding_amount}</span>
                </li>
              </ul>
            </div>
          </Col>

          {/* Jewel Product List Container*/}
          <Col lg={4}>
            <div className="customer-card bg-light border rounded p-3 h-100">
              <h5 className="mb-3">Pledge Items</h5>
              <ul className="list-unstyled small">
                {formData.jewel_product.map((row, index) => (
                  <li key={index} className="mb-2 p-2 border rounded bg-white">
                    <strong>S.No {index + 1}:</strong> {row.JewelName} -{" "}
                    {row.count} pcs, {row.weight} gm ({row.remark})
                  </li>
                ))}
              </ul>
            </div>
          </Col>

          {/* Editable Inputs */}
          <Col lg={12} className="py-3">
            <div className="customer-card bg-light border rounded p-3">
              <h5 className="mb-3">Payment Details</h5>
              <Row>
                <Col lg={3}>
                  <Calender
                    setLabel={(date) => setLabel(date, "interest_receive_date")}
                    initialDate={formData.interest_receive_date}
                    calenderlabel="Payment Date"
                  />
                </Col>
                <Col lg={3}>
                  <TextInputForm
                    placeholder={"Interest Amount"}
                    labelname={"Interest Amount"}
                    name="interest_income"
                    value={formData.interest_income}
                    onChange={(e) => handleChange(e, "interest_income")}
                  />
                </Col>
              </Row>
            </div>
          </Col>

          {/* Buttons */}
          <Col lg={12}>
            <div className="text-center mb-3">
              <ToastContainer
                position="top-center"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
              />
              <span className="mx-2">
                <ClickButton
                  label={loading ? <>Submitting...</> : <>Submit</>}
                  onClick={handleSubmit}
                  disabled={loading}
                />
              </span>
              <span className="mx-2">
                <ClickButton label={<>Cancel</>} onClick={handleCancel} />
              </span>
            </div>
          </Col>

          {error && (
            <Col lg={12}>
              <Alert variant="danger" className="error-alert">
                {error}
              </Alert>
            </Col>
          )}

          <Col lg={12} className="py-3">
            <div className="customer-card bg-light border rounded p-3">
              <h5 className="mb-3">Interest Payment History</h5>

              {interestHistory.length > 0 ? (
                <TableUI
                  headers={UserTablehead}
                  body={interestHistory}
                  type="interest"
                  pageview="no"
                  style={{ borderRadius: "5px" }}
                />
              ) : (
                <div className="text-center text-muted py-3">
                  No interest payments recorded yet.
                </div>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default InterestPayment;
