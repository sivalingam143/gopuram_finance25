// RecoveryPayment.js - New component for Recovery payment page
import React, { useState, useEffect } from "react";
import { Col, Container, Row, Alert, Modal, Form } from "react-bootstrap";
import { TextInputForm, Calender } from "../../components/Forms";
import { ClickButton } from "../../components/ClickButton";
import PageNav from "../../components/PageNav";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API_DOMAIN from "../../config/config";
import dayjs from "dayjs";

const RecoveryPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { rowData } = location.state || {}; // Passed from CustomerDetails
  const today = new Date();
  const [loading, setLoading] = useState(false);
  const [productList, setProductList] = useState([]);
  const [error, setError] = useState("");

  const initialState = {
    receipt_no: rowData?.receipt_no || "",
    pawnjewelry_date: rowData?.pawnjewelry_date || "",
    name: rowData?.name || "",
    customer_details: rowData?.customer_details || "",
    place: rowData?.place || "",
    mobile_number: rowData?.mobile_number || "",
    original_amount: rowData?.original_amount || "",
    interest_rate: rowData?.interest_rate || "",
    jewel_product: Array.isArray(rowData?.jewel_product)
      ? rowData.jewel_product
      : JSON.parse(rowData?.jewel_product || "[]"),
    interest_payment_periods: rowData?.interest_payment_period || "",
    interest_paid: rowData?.interest_payment_amount || "", // From pawn
    pawnjewelry_recovery_date: today.toISOString().substr(0, 10), // Editable
    refund_amount: "", // Editable, pre-calculate as original + interest
    other_amount: "", // Editable
  };

  const [formData, setFormData] = useState(initialState);

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
    fetchDataproduct();
    // Pre-calculate refund_amount
    const principal = parseFloat(rowData?.original_amount || 0);
    const interest = parseFloat(rowData?.interest_payment_amount || 0);
    setFormData((prev) => ({
      ...prev,
      refund_amount: (principal + interest).toFixed(2),
    }));
  }, [rowData]);

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
    const formattedDate = dayjs(date).format("YYYY-MM-DD");
    setFormData((prevData) => ({
      ...prevData,
      [label]: formattedDate,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_DOMAIN}/pawnrecovery.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          edit_pawnrecovery_id: "",
          interest_paid: formData.interest_paid, // From pawn
          refund_amount: parseFloat(formData.refund_amount),
        }),
      });

      const responseData = await response.json();

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
            <PageNav pagetitle={"Recovery Payment"}></PageNav>
          </Col>

          {/* Read-only Customer Info Container */}
          <Col lg={4}>
            <div className="customer-card bg-light border rounded p-3 h-100">
              <h5 className="mb-3">Customer Information</h5>
              <ul className="list-unstyled">
                <li className="mb-2 d-flex justify-content-between">
                  <strong>Customer No:</strong>
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
                  <strong>Pawn Date:</strong>
                  <span>{formData.pawnjewelry_date}</span>
                </li>
                <li className="mb-2 d-flex justify-content-between">
                  <strong>Principal Amount:</strong>
                  <span>₹{formData.original_amount}</span>
                </li>
                <li className="mb-2 d-flex justify-content-between">
                  <strong>Interest Rate:</strong>
                  <span>{formData.interest_rate}</span>
                </li>
                <li className="mb-2 d-flex justify-content-between">
                  <strong>Interest Paid:</strong>
                  <span>₹{formData.interest_paid}</span>
                </li>
                <li className="mb-2 d-flex justify-content-between">
                  <strong>Payment Periods:</strong>
                  <span>{formData.interest_payment_periods}</span>
                </li>
              </ul>
            </div>
          </Col>

          {/* Jewel Product List Container (Read-only Table) */}
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
          <Col lg={6}>
            <div className="customer-card bg-light border rounded p-3">
              <h5 className="mb-3">Recovery Details</h5>
              <Row>
                <Col lg={6}>
                  <Calender
                    setLabel={(date) =>
                      setLabel(date, "pawnjewelry_recovery_date")
                    }
                    initialDate={formData.pawnjewelry_recovery_date}
                    calenderlabel="Recovery Date"
                  />
                </Col>
                <Col lg={3}>
                  <TextInputForm
                    placeholder={"Refund Amount"}
                    labelname={"Refund Amount"}
                    name="refund_amount"
                    value={formData.refund_amount}
                    onChange={(e) => handleChange(e, "refund_amount")}
                  />
                </Col>
                <Col lg={3}>
                  <TextInputForm
                    placeholder={"Other Amount"}
                    labelname={"Other Amount"}
                    name="other_amount"
                    value={formData.other_amount}
                    onChange={(e) => handleChange(e, "other_amount")}
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
        </Row>
      </Container>
    </div>
  );
};

export default RecoveryPayment;
