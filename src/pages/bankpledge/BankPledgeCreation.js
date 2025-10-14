import React, { useState, useEffect } from "react";
import { Col, Container, Row, Alert } from "react-bootstrap";
import { TextInputForm } from "../../components/Forms";
import { ClickButton } from "../../components/ClickButton";
import PageNav from "../../components/PageNav";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import API_DOMAIN from "../../config/config";
import "react-toastify/dist/ReactToastify.css";

const BankPledgeCreation = () => {
  const location = useLocation();
  const { type, rowData } = location.state || {};
  const initialState =
    type === "edit"
      ? { ...rowData }
      : {
          customer_no: "",
          receipt_no: "",
          bank_pledge_date: "",
          bank_loan_no: "",
          bank_assessor_name: "",
          bank_name: "",
          bank_pawn_value: "",
          bank_interest: "",
          bank_due_date: "",
          closing_date: "",
          closing_amount: "",
        };
  const [formData, setFormData] = useState(initialState);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e, fieldName) => {
    const value = e.target ? e.target.value : e.value;
    setFormData({
      ...formData,
      [fieldName]: value,
    });
  };

  const handleSubmit = async () => {
    // Basic validation for required fields
    if (
      !formData.customer_no ||
      !formData.receipt_no ||
      !formData.bank_pledge_date
    ) {
      toast.error(
        "Customer No, Receipt No, and Bank Pledge Date are required!",
        {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }
      );
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_DOMAIN}/bank_pledge_details.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const responseData = await response.json();

      if (responseData.head.code === 200) {
        toast.success(responseData.head.msg, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        setTimeout(() => {
          navigate("/console/pawn/bankpledge");
        }, 1000);
        setLoading(false);
      } else {
        toast.error(responseData.head.msg, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
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
      const updateData = {
        ...formData,
        edit_bank_pledge_id: rowData.bank_pledge_details_id,
      };
      const response = await fetch(`${API_DOMAIN}/bank_pledge_details.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      const responseData = await response.json();

      if (responseData.head.code === 200) {
        toast.success(responseData.head.msg, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        setTimeout(() => {
          navigate("/console/pawn/bankpledge");
        }, 2000);
      } else {
        toast.error(responseData.head.msg, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        console.error(
          responseData.message || "Unknown error occurred during update"
        );
      }
    } catch (error) {
      console.error("Error updating bank pledge details:", error.message);
    }
    setLoading(false);
  };

  const isView = type === "view";
  const isEdit = type === "edit";

  return (
    <div>
      <Container>
        <Row className="regular">
          <Col lg="12" md="12" xs="12" className="py-3">
            <PageNav
              pagetitle={`Bank Pledge Details${
                type === "view"
                  ? " View "
                  : type === "edit"
                  ? " Edit "
                  : " Creation"
              }`}
            ></PageNav>
          </Col>

          <Col lg="4" md="6" xs="12" className="py-3">
            <TextInputForm
              placeholder="Customer No"
              labelname="Customer No"
              name="customer_no"
              value={isView ? rowData.customer_no : formData.customer_no}
              onChange={(e) => handleChange(e, "customer_no")}
              disabled={isView}
            />
          </Col>

          <Col lg="4" md="6" xs="12" className="py-3">
            <TextInputForm
              placeholder="Receipt No"
              labelname="Receipt No"
              name="receipt_no"
              value={isView ? rowData.receipt_no : formData.receipt_no}
              onChange={(e) => handleChange(e, "receipt_no")}
              disabled={isView}
            />
          </Col>

          <Col lg="4" md="6" xs="12" className="py-3">
            <TextInputForm
              type="date"
              placeholder={"Bank Pledge Date"}
              labelname={"Bank Pledge Date"}
              name="bank_pledge_date"
              value={
                isView ? rowData.bank_pledge_date : formData.bank_pledge_date
              }
              onChange={(e) => handleChange(e, "bank_pledge_date")}
              disabled={isView}
            />
          </Col>

          <Col lg="4" md="6" xs="12" className="py-3">
            <TextInputForm
              placeholder={"Bank Loan No"}
              labelname={"Bank Loan No"}
              name="bank_loan_no"
              value={isView ? rowData.bank_loan_no : formData.bank_loan_no}
              onChange={(e) => handleChange(e, "bank_loan_no")}
              disabled={isView}
            />
          </Col>

          <Col lg="4" md="6" xs="12" className="py-3">
            <TextInputForm
              placeholder={"Bank Assessor Name"}
              labelname={"Bank Assessor Name"}
              name="bank_assessor_name"
              value={
                isView
                  ? rowData.bank_assessor_name
                  : formData.bank_assessor_name
              }
              onChange={(e) => handleChange(e, "bank_assessor_name")}
              disabled={isView}
            />
          </Col>

          <Col lg="4" md="6" xs="12" className="py-3">
            <TextInputForm
              placeholder={"Bank Name"}
              labelname={"Bank Name"}
              name="bank_name"
              value={isView ? rowData.bank_name : formData.bank_name}
              onChange={(e) => handleChange(e, "bank_name")}
              disabled={isView}
            />
          </Col>

          <Col lg="4" md="6" xs="12" className="py-3">
            <TextInputForm
              type="number"
              placeholder={"Bank Pawn Value"}
              labelname={"Bank Pawn Value"}
              name="bank_pawn_value"
              value={
                isView ? rowData.bank_pawn_value : formData.bank_pawn_value
              }
              onChange={(e) => handleChange(e, "bank_pawn_value")}
              disabled={isView}
            />
          </Col>

          <Col lg="4" md="6" xs="12" className="py-3">
            <TextInputForm
              type="number"
              step="0.01"
              placeholder={"Bank Interest"}
              labelname={"Bank Interest"}
              name="bank_interest"
              value={isView ? rowData.bank_interest : formData.bank_interest}
              onChange={(e) => handleChange(e, "bank_interest")}
              disabled={isView}
            />
          </Col>

          <Col lg="4" md="6" xs="12" className="py-3">
            <TextInputForm
              type="date"
              placeholder={"Bank Due Date"}
              labelname={"Bank Due Date"}
              name="bank_due_date"
              value={isView ? rowData.bank_due_date : formData.bank_due_date}
              onChange={(e) => handleChange(e, "bank_due_date")}
              disabled={isView}
            />
          </Col>

          <Col lg="4" md="6" xs="12" className="py-3">
            <TextInputForm
              type="date"
              placeholder={"Closing Date"}
              labelname={"Closing Date"}
              name="closing_date"
              value={isView ? rowData.closing_date : formData.closing_date}
              onChange={(e) => handleChange(e, "closing_date")}
              disabled={isView}
            />
          </Col>

          <Col lg="4" md="6" xs="12" className="py-3">
            <TextInputForm
              type="number"
              placeholder={"Closing Amount"}
              labelname={"Closing Amount"}
              name="closing_amount"
              value={isView ? rowData.closing_amount : formData.closing_amount}
              onChange={(e) => handleChange(e, "closing_amount")}
              disabled={isView}
            />
          </Col>

          <Col lg="12" md="12" xs="12" className="py-5 align-self-center">
            <div className="text-center">
              {isView ? (
                <ClickButton
                  label={<>Back</>}
                  onClick={() => navigate("/console/pawn/bankpledge")}
                ></ClickButton>
              ) : (
                <>
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
                        ) : isEdit ? (
                          <>Update</>
                        ) : (
                          <>Submit</>
                        )
                      }
                      onClick={isEdit ? handleUpdateSubmit : handleSubmit}
                      disabled={loading}
                    ></ClickButton>
                  </span>
                  <span className="mx-2">
                    <ClickButton
                      label={<>Cancel</>}
                      onClick={() => navigate("/console/pawn/bankpledge")}
                    ></ClickButton>
                  </span>
                </>
              )}
            </div>
          </Col>
        </Row>
        {error && (
          <Alert variant="danger" className="error-alert">
            {error}
          </Alert>
        )}
      </Container>
    </div>
  );
};

export default BankPledgeCreation;
