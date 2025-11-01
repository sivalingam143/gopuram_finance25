import React, { useState, useEffect } from "react";
import { Col, Container, Row, Alert } from "react-bootstrap";
import { TextInputForm, Calender } from "../../components/Forms";
import { ClickButton } from "../../components/ClickButton";
import PageNav from "../../components/PageNav";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API_DOMAIN from "../../config/config";
import dayjs from "dayjs";

import TableUI from "../../components/Table";

const UserTablehead = [
  "No",
  "Pawn Date",
  "Recovery Date",
  "Loan Number",
  "Name",
  "Mobile Number",
  "Action",
];

const RecoveryPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { type, rowData } = location.state || {};
  const today = new Date();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [recoveryHistory, setRecoveryHistory] = useState([]);
  const [interestHistory, setInterestHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [pawnData, setPawnData] = useState(null);
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const getInitialState = () => {
    let jewelProduct = [];
    try {
      if (Array.isArray(rowData?.jewel_product)) {
        jewelProduct = rowData.jewel_product;
      } else if (
        typeof rowData?.jewel_product === "string" &&
        rowData.jewel_product.trim() !== ""
      ) {
        const unescapedString = rowData.jewel_product.replace(/\\"/g, '"');
        const parsed = JSON.parse(unescapedString);
        if (Array.isArray(parsed)) {
          jewelProduct = parsed;
        }
      }
    } catch (parseError) {
      console.error(
        "Failed to parse jewel_product:",
        rowData?.jewel_product,
        parseError
      );
      // Default to empty array
    }

    if (type === "edit" && rowData && rowData.pawnjewelry_recovery_id) {
      return {
        edit_pawnrecovery_id: rowData.pawnjewelry_recovery_id || "",
        customer_no: rowData.customer_no || "",
        receipt_no: rowData.receipt_no || "",
        pawnjewelry_date: rowData.pawnjewelry_date || "",
        name: rowData.name || "",
        customer_details: rowData.customer_details || "",
        place: rowData.place || "",
        mobile_number: rowData.mobile_number || "",
        original_amount: rowData.original_amount || "",
        interest_rate: rowData.interest_rate || "",
        jewel_product: jewelProduct,
        interest_payment_periods: rowData.interest_payment_periods || "",
        interest_paid: rowData.interest_paid || "",
        pawnjewelry_recovery_date:
          rowData.pawnjewelry_recovery_date ||
          today.toISOString().substr(0, 10),
        refund_amount: rowData.refund_amount || "",
        other_amount: rowData.other_amount || "",
        unpaid_interest_amount: 0,
        unpaid_interest_period: 0,
      };
    } else {
      return {
        customer_no: rowData?.customer_no || "",
        receipt_no: rowData?.receipt_no || "",
        pawnjewelry_date: rowData?.pawnjewelry_date || "",
        name: rowData?.name || "",
        customer_details: rowData?.customer_details || "",
        place: rowData?.place || "",
        mobile_number: rowData?.mobile_number || "",
        original_amount: rowData?.original_amount || "",
        interest_rate: rowData?.interest_rate || "",
        jewel_product: jewelProduct,
        interest_payment_periods: 0,
        interest_paid: 0,
        pawnjewelry_recovery_date: today.toISOString().substr(0, 10),
        refund_amount: 0,
        other_amount: "",
        unpaid_interest_amount: rowData?.interest_payment_amount || 0,
        unpaid_interest_period: rowData?.interest_payment_period || 0,
      };
    }
  };

  const [formData, setFormData] = useState(getInitialState());

  useEffect(() => {
    setFormData(getInitialState());
  }, [location.state, type, rowData]);

  // For edit mode, fetch pawn data to get unpaid
  useEffect(() => {
    if (type === "edit" && rowData?.receipt_no && !pawnData) {
      const fetchPawnDetails = async () => {
        try {
          const response = await fetch(`${API_DOMAIN}/pawnjewelry.php`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              search_text: rowData.receipt_no,
            }),
          });
          const responseData = await response.json();
          if (
            responseData.head.code === 200 &&
            responseData.body.pawnjewelry.length > 0
          ) {
            const pawn = responseData.body.pawnjewelry[0];
            setPawnData(pawn);
          }
        } catch (error) {
          console.error("Error fetching pawn details:", error);
        }
      };
      fetchPawnDetails();
    }
  }, [type, rowData]);

  const fetchRecoveryHistory = async () => {
    if (!rowData?.receipt_no) return;
    setHistoryLoading(true);
    try {
      const response = await fetch(`${API_DOMAIN}/pawnrecovery.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          search_text: rowData.receipt_no,
        }),
      });

      const responseData = await response.json();
      if (responseData.head.code === 200) {
        const filteredHistory = responseData.body.pawnrecovery.filter(
          (item) => item.receipt_no === rowData.receipt_no
        );
        setRecoveryHistory(filteredHistory);
      } else {
        console.error(
          "Error fetching recovery history:",
          responseData.head.msg
        );
      }
    } catch (error) {
      console.error("Error fetching recovery history:", error.message);
    } finally {
      setHistoryLoading(false);
    }
  };

  // Fetch Interest History
  const fetchInterestHistory = async () => {
    if (!rowData?.receipt_no) return;
    setLoading(true);
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
      setLoading(false);
    }
  };

  // Calculate totals from interest history and update formData
  useEffect(() => {
    if (!rowData?.receipt_no) return;

    // Get principal and unpaid from pawn data (rowData for new, pawnData for edit)
    const principal = parseFloat(
      (type === "edit"
        ? pawnData?.original_amount
        : rowData?.original_amount) || 0
    );
    const unpaidInterestAmount = parseFloat(
      (type === "edit"
        ? pawnData?.interest_payment_amount
        : rowData?.interest_payment_amount) || 0
    );
    const unpaidInterestPeriod = parseFloat(
      (type === "edit"
        ? pawnData?.interest_payment_period
        : rowData?.interest_payment_period) || 0
    );

    // Paid from history
    let totalPaidInterest = 0;
    let totalPaidPeriods = 0;
    if (interestHistory.length > 0) {
      totalPaidInterest = interestHistory.reduce(
        (sum, item) => sum + parseFloat(item.interest_income || 0),
        0
      );
      totalPaidPeriods = interestHistory.reduce(
        (sum, item) =>
          sum +
          parseFloat(
            item.interest_payment_periods || item.outstanding_period || 0
          ),
        0
      );
    }

    // Refund = Principal + Unpaid Interest (always calculate)
    const calculatedRefund = (principal + unpaidInterestAmount).toFixed(2);

    setFormData((prev) => {
      const updated = { ...prev };
      updated.interest_paid = totalPaidInterest.toFixed(2);
      updated.interest_payment_periods = totalPaidPeriods.toFixed(1);
      updated.unpaid_interest_amount = unpaidInterestAmount;
      updated.unpaid_interest_period = unpaidInterestPeriod;
      // Set refund, but for edit, only if not already set (preserve manual changes)
      if (
        type !== "edit" ||
        !prev.refund_amount ||
        prev.refund_amount === "0"
      ) {
        updated.refund_amount = calculatedRefund;
      }
      return updated;
    });
  }, [interestHistory, rowData, type, pawnData]);

  useEffect(() => {
    fetchRecoveryHistory();
    fetchInterestHistory();
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
          interest_paid: formData.interest_paid,
          refund_amount: parseFloat(formData.refund_amount),
          login_id: user.id,
          user_name: user.user_name,
        }),
      });

      const responseData = await response.json();

      if (responseData.head.code === 200) {
        toast.success(responseData.head.msg);
        setTimeout(() => {
          navigate("/console/master/customer");
          window.location.reload();
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

  const handleUpdateSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_DOMAIN}/pawnrecovery.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          edit_pawnrecovery_id: rowData.pawnjewelry_recovery_id,
          interest_paid: formData.interest_paid,
          refund_amount: parseFloat(formData.refund_amount),
          login_id: user.id,
          user_name: user.user_name,
        }),
      });

      const responseData = await response.json();

      if (responseData.head.code === 200) {
        toast.success(responseData.head.msg);
        setTimeout(() => {
          navigate("/console/master/customer");
          window.location.reload();
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

  const pageTitle =
    type === "edit" ? "Edit Recovery Payment" : "Recovery Payment";

  const handleAction = (action, recoveryRow) => {
    if (action === "edit") {
      navigate("/console/customer/jewelrecovery", {
        state: { type: "edit", rowData: recoveryRow },
      });
    } else if (action === "delete") {
      // Handle delete if needed, but since TableUI handles it, perhaps not here
    }
  };

  return (
    <div>
      <Container>
        <Row className="regular">
          <Col lg="12" md="12" xs="12" className="py-3">
            <PageNav pagetitle={pageTitle}></PageNav>
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
                  <strong>Pawn Date:</strong>
                  <span>{formData.pawnjewelry_date}</span>
                </li>
                <li className="mb-2 d-flex justify-content-between">
                  <strong>Principal Amount:</strong>
                  <span>
                    ₹
                    {parseFloat(formData.original_amount || 0).toLocaleString()}
                  </span>
                </li>
                <li className="mb-2 d-flex justify-content-between">
                  <strong>Interest Rate:</strong>
                  <span>{formData.interest_rate}</span>
                </li>
                <li className="mb-2 d-flex justify-content-between">
                  <strong>Interest Paid:</strong>
                  <span>
                    ₹{parseFloat(formData.interest_paid || 0).toLocaleString()}
                  </span>
                </li>
                <li className="mb-2 d-flex justify-content-between">
                  <strong>Payment Periods:</strong>
                  <span>{formData.interest_payment_periods} months</span>
                </li>
                {/* Unpaid Interest Amount */}
                <li className="mb-2 d-flex justify-content-between">
                  <strong>Unpaid Interest Amount:</strong>
                  <span>
                    ₹
                    {parseFloat(
                      formData.unpaid_interest_amount || 0
                    ).toLocaleString()}
                  </span>
                </li>
                {/* Unpaid Interest Period */}
                <li className="mb-2 d-flex justify-content-between">
                  <strong>Unpaid Interest Period:</strong>
                  <span>{formData.unpaid_interest_period} months</span>
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
          <Col lg={12} className="py-3">
            <div className="customer-card bg-light border rounded p-3">
              <h5 className="mb-3">Recovery Details</h5>
              <Row>
                <Col lg={3}>
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
                    disabled
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

          {(type === "edit" || recoveryHistory.length === 0) && (
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
                    label={
                      loading ? (
                        <>Submitting...</>
                      ) : type === "edit" ? (
                        <>Update</>
                      ) : (
                        <>Submit</>
                      )
                    }
                    onClick={
                      type === "edit" ? handleUpdateSubmit : handleSubmit
                    }
                    disabled={loading}
                  />
                </span>
                <span className="mx-2">
                  <ClickButton label={<>Cancel</>} onClick={handleCancel} />
                </span>
              </div>
            </Col>
          )}

          {error && (
            <Col lg={12}>
              <Alert variant="danger" className="error-alert">
                {error}
              </Alert>
            </Col>
          )}

          {/* Recovery History Listing */}
          {recoveryHistory.length > 0 && (
            <Col lg={12} className="py-3">
              <div className="customer-card bg-light border rounded p-3">
                <h5 className="mb-3">Recovery Payment History</h5>

                <TableUI
                  headers={UserTablehead}
                  body={recoveryHistory}
                  type="jewelRecovery"
                  pageview="no"
                  style={{ borderRadius: "5px" }}
                  customActions={{
                    edit: handleAction,
                  }}
                />
              </div>
            </Col>
          )}
        </Row>
      </Container>
    </div>
  );
};

export default RecoveryPayment;
