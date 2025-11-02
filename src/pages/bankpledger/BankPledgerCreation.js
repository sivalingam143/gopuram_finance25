// BankPledgerCreation.js
import React, { useState } from "react";
import { Col, Container, Row, Alert, Modal } from "react-bootstrap";
import { TextInputForm, DropDownUI } from "../../components/Forms";
import { ClickButton } from "../../components/ClickButton";
import PageNav from "../../components/PageNav";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import API_DOMAIN from "../../config/config";
import "react-toastify/dist/ReactToastify.css";

const BankPledgerCreation = () => {
  const location = useLocation();
  const { type, rowData } = location.state || {};
  const initialState =
    type === "edit"
      ? { ...rowData }
      : {
          bank_pledger_details_id: "",
          name: "",
          mobile_no: "",
          address: "",
          bank_details: "",
          pledge_date: "",
          bank_loan_no: "",
          pawn_value: "",
          interest_rate: "",
          duration_month: "",
          interest_amount: "",
          pledge_due_date: "",
          additional_charges: "",
        };
  const [formData, setFormData] = useState(initialState);

  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();

  const redirectModal = () => {
    navigate("/console/master/bankpledger");
  };

  const handleChange = (e, fieldName) => {
    const value = e.target ? e.target.value : e.value;

    setFormData({
      ...formData,
      [fieldName]: value,
    });
  };

  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_DOMAIN}/bank_pledger.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const responseData = await response.json();
      console.log("responseData", responseData);

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
          navigate("/console/master/bankpledger");
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
        setShowAlert(true);
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
      const response = await fetch(`${API_DOMAIN}/bank_pledger.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          edit_bank_pledger_id: rowData.bank_pledge_id, // Include the bank_pledger ID in the request
          bank_pledger_details_id: formData.bank_pledger_details_id,
          name: formData.name,
          mobile_no: formData.mobile_no,
          address: formData.address,
          bank_details: formData.bank_details,
          pledge_date: formData.pledge_date,
          bank_loan_no: formData.bank_loan_no,
          pawn_value: formData.pawn_value,
          interest_rate: formData.interest_rate,
          duration_month: formData.duration_month,
          interest_amount: formData.interest_amount,
          pledge_due_date: formData.pledge_due_date,
          additional_charges: formData.additional_charges,
        }),
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

        // Navigate to the bank_pledger list page after a delay
        setTimeout(() => {
          navigate("/console/master/bankpledger");
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
      console.error("Error updating bank_pledger:", error.message);
    }

    setLoading(false);
  };

  return (
    <div>
      <Container>
        <Row className="regular justify-content-center">
          <Col lg="12" md="12" xs="12" className="py-3">
            <PageNav
              pagetitle={`Bank Pledger ${
                type === "view"
                  ? " view "
                  : type === "edit"
                  ? "  Edit "
                  : " Creation "
              }`}
            ></PageNav>
          </Col>

          <Col lg="4" md="6" xs="12" className="py-3">
            {type === "edit" ? (
              <TextInputForm
                placeholder={"Bank Pledger Details ID"}
                labelname={"Bank Pledger Details ID"}
                name="bank_pledger_details_id"
                value={formData.bank_pledger_details_id}
                onChange={(e) => handleChange(e, "bank_pledger_details_id")}
              ></TextInputForm>
            ) : (
              <TextInputForm
                placeholder={"Bank Pledger Details ID"}
                labelname={"Bank Pledger Details ID"}
                name="bank_pledger_details_id"
                value={
                  type === "view"
                    ? rowData.bank_pledger_details_id
                    : formData.bank_pledger_details_id
                }
                onChange={(e) => handleChange(e, "bank_pledger_details_id")}
              ></TextInputForm>
            )}
          </Col>
          <Col lg="4" md="6" xs="12" className="py-3">
            {type === "edit" ? (
              <TextInputForm
                placeholder={"Name"}
                labelname={"Name"}
                name="name"
                value={formData.name}
                onChange={(e) => handleChange(e, "name")}
              ></TextInputForm>
            ) : (
              <TextInputForm
                placeholder={"Name"}
                labelname={"Name"}
                name="name"
                value={type === "view" ? rowData.name : formData.name}
                onChange={(e) => handleChange(e, "name")}
              ></TextInputForm>
            )}
          </Col>
          <Col lg="4" md="6" xs="12" className="py-3">
            {type === "edit" ? (
              <TextInputForm
                placeholder={"Mobile No"}
                labelname={"Mobile No"}
                name="mobile_no"
                value={formData.mobile_no}
                onChange={(e) => handleChange(e, "mobile_no")}
              ></TextInputForm>
            ) : (
              <TextInputForm
                placeholder={"Mobile No"}
                labelname={"Mobile No"}
                name="mobile_no"
                value={type === "view" ? rowData.mobile_no : formData.mobile_no}
                onChange={(e) => handleChange(e, "mobile_no")}
              ></TextInputForm>
            )}
          </Col>
          <Col lg="4" md="6" xs="12" className="py-3">
            {type === "edit" ? (
              <TextInputForm
                placeholder={"Address"}
                labelname={"Address"}
                name="address"
                value={formData.address}
                onChange={(e) => handleChange(e, "address")}
              ></TextInputForm>
            ) : (
              <TextInputForm
                placeholder={"Address"}
                labelname={"Address"}
                name="address"
                value={type === "view" ? rowData.address : formData.address}
                onChange={(e) => handleChange(e, "address")}
              ></TextInputForm>
            )}
          </Col>
          <Col lg="4" md="6" xs="12" className="py-3">
            {type === "edit" ? (
              <TextInputForm
                placeholder={"Bank Details"}
                labelname={"Bank Details"}
                name="bank_details"
                value={formData.bank_details}
                onChange={(e) => handleChange(e, "bank_details")}
              ></TextInputForm>
            ) : (
              <TextInputForm
                placeholder={"Bank Details"}
                labelname={"Bank Details"}
                name="bank_details"
                value={
                  type === "view" ? rowData.bank_details : formData.bank_details
                }
                onChange={(e) => handleChange(e, "bank_details")}
              ></TextInputForm>
            )}
          </Col>
          <Col lg="4" md="6" xs="12" className="py-3">
            {type === "edit" ? (
              <TextInputForm
                placeholder={"Pledge Date"}
                labelname={"Pledge Date"}
                name="pledge_date"
                type="date"
                value={formData.pledge_date}
                onChange={(e) => handleChange(e, "pledge_date")}
              ></TextInputForm>
            ) : (
              <TextInputForm
                placeholder={"Pledge Date"}
                labelname={"Pledge Date"}
                name="pledge_date"
                type="date"
                value={
                  type === "view" ? rowData.pledge_date : formData.pledge_date
                }
                onChange={(e) => handleChange(e, "pledge_date")}
              ></TextInputForm>
            )}
          </Col>
          <Col lg="4" md="6" xs="12" className="py-3">
            {type === "edit" ? (
              <TextInputForm
                placeholder={"Bank Loan No"}
                labelname={"Bank Loan No"}
                name="bank_loan_no"
                value={formData.bank_loan_no}
                onChange={(e) => handleChange(e, "bank_loan_no")}
              ></TextInputForm>
            ) : (
              <TextInputForm
                placeholder={"Bank Loan No"}
                labelname={"Bank Loan No"}
                name="bank_loan_no"
                value={
                  type === "view" ? rowData.bank_loan_no : formData.bank_loan_no
                }
                onChange={(e) => handleChange(e, "bank_loan_no")}
              ></TextInputForm>
            )}
          </Col>
          <Col lg="4" md="6" xs="12" className="py-3">
            {type === "edit" ? (
              <TextInputForm
                placeholder={"Pawn Value"}
                labelname={"Pawn Value"}
                name="pawn_value"
                value={formData.pawn_value}
                onChange={(e) => handleChange(e, "pawn_value")}
              ></TextInputForm>
            ) : (
              <TextInputForm
                placeholder={"Pawn Value"}
                labelname={"Pawn Value"}
                name="pawn_value"
                value={
                  type === "view" ? rowData.pawn_value : formData.pawn_value
                }
                onChange={(e) => handleChange(e, "pawn_value")}
              ></TextInputForm>
            )}
          </Col>
          <Col lg="4" md="6" xs="12" className="py-3">
            {type === "edit" ? (
              <TextInputForm
                placeholder={"Interest Rate"}
                labelname={"Interest Rate"}
                name="interest_rate"
                value={formData.interest_rate}
                onChange={(e) => handleChange(e, "interest_rate")}
              ></TextInputForm>
            ) : (
              <TextInputForm
                placeholder={"Interest Rate"}
                labelname={"Interest Rate"}
                name="interest_rate"
                value={
                  type === "view"
                    ? rowData.interest_rate
                    : formData.interest_rate
                }
                onChange={(e) => handleChange(e, "interest_rate")}
              ></TextInputForm>
            )}
          </Col>
          <Col lg="4" md="6" xs="12" className="py-3">
            {type === "edit" ? (
              <TextInputForm
                placeholder={"Duration Month"}
                labelname={"Duration Month"}
                name="duration_month"
                value={formData.duration_month}
                onChange={(e) => handleChange(e, "duration_month")}
              ></TextInputForm>
            ) : (
              <TextInputForm
                placeholder={"Duration Month"}
                labelname={"Duration Month"}
                name="duration_month"
                value={
                  type === "view"
                    ? rowData.duration_month
                    : formData.duration_month
                }
                onChange={(e) => handleChange(e, "duration_month")}
              ></TextInputForm>
            )}
          </Col>
          <Col lg="4" md="6" xs="12" className="py-3">
            {type === "edit" ? (
              <TextInputForm
                placeholder={"Interest Amount"}
                labelname={"Interest Amount"}
                name="interest_amount"
                value={formData.interest_amount}
                onChange={(e) => handleChange(e, "interest_amount")}
              ></TextInputForm>
            ) : (
              <TextInputForm
                placeholder={"Interest Amount"}
                labelname={"Interest Amount"}
                name="interest_amount"
                value={
                  type === "view"
                    ? rowData.interest_amount
                    : formData.interest_amount
                }
                onChange={(e) => handleChange(e, "interest_amount")}
              ></TextInputForm>
            )}
          </Col>
          <Col lg="4" md="6" xs="12" className="py-3">
            {type === "edit" ? (
              <TextInputForm
                placeholder={"Pledge Due Date"}
                labelname={"Pledge Due Date"}
                name="pledge_due_date"
                type="date"
                value={formData.pledge_due_date}
                onChange={(e) => handleChange(e, "pledge_due_date")}
              ></TextInputForm>
            ) : (
              <TextInputForm
                placeholder={"Pledge Due Date"}
                labelname={"Pledge Due Date"}
                name="pledge_due_date"
                type="date"
                value={
                  type === "view"
                    ? rowData.pledge_due_date
                    : formData.pledge_due_date
                }
                onChange={(e) => handleChange(e, "pledge_due_date")}
              ></TextInputForm>
            )}
          </Col>
          <Col lg="4" md="6" xs="12" className="py-3">
            {type === "edit" ? (
              <TextInputForm
                placeholder={"Additional Charges"}
                labelname={"Additional Charges"}
                name="additional_charges"
                value={formData.additional_charges}
                onChange={(e) => handleChange(e, "additional_charges")}
              ></TextInputForm>
            ) : (
              <TextInputForm
                placeholder={"Additional Charges"}
                labelname={"Additional Charges"}
                name="additional_charges"
                value={
                  type === "view"
                    ? rowData.additional_charges
                    : formData.additional_charges
                }
                onChange={(e) => handleChange(e, "additional_charges")}
              ></TextInputForm>
            )}
          </Col>
          <Col lg="12" md="12" xs="12" className="py-5 align-self-center">
            <div className="text-center">
              {type === "view" ? (
                <ClickButton
                  label={<>back</>}
                  onClick={() => navigate("/console/master/bankpledger")}
                ></ClickButton>
              ) : (
                <>
                  {type === "edit" ? (
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
                          label={<>Update</>}
                          onClick={handleUpdateSubmit}
                        ></ClickButton>
                      </span>

                      <span className="mx-2">
                        <ClickButton
                          label={<>Cancel</>}
                          onClick={() =>
                            navigate("/console/master/bankpledger")
                          }
                        ></ClickButton>
                      </span>
                    </>
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
                          label={loading ? <>Submitting...</> : <> Submit</>}
                          onClick={handleSubmit}
                          disabled={loading}
                        ></ClickButton>
                      </span>
                      <span className="mx-2">
                        <ClickButton
                          label={<>Cancel</>}
                          onClick={() =>
                            navigate("/console/master/bankpledger")
                          }
                        ></ClickButton>
                      </span>
                    </>
                  )}
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
      <Modal
        show={showSuccessModal}
        onHide={() => setShowSuccessModal(false)}
        centered
      >
        <Modal.Body className="text-center">
          <img
            src={require("../../components/sidebar/images/output-onlinegiftools.gif")}
            alt="Success GIF"
          />
          <p>Bank Pledger saved successfully!</p>
        </Modal.Body>
        <Modal.Footer>
          <ClickButton
            variant="secondary"
            label={<> Close</>}
            onClick={() => redirectModal()}
          >
            Close
          </ClickButton>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BankPledgerCreation;
