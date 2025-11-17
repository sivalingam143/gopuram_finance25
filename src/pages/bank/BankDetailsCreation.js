import React, { useState } from "react";
import { Col, Container, Row, Alert, Modal } from "react-bootstrap";
import { TextInputForm, DropDownUI } from "../../components/Forms";
import { ClickButton, Delete } from "../../components/ClickButton";
import PageNav from "../../components/PageNav";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import API_DOMAIN from "../../config/config";
import "react-toastify/dist/ReactToastify.css";
import { useLanguage } from "../../components/LanguageContext";

const BankDetailsCreation = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const { type, rowData } = location.state || {};
  const initialState =
    type === "edit"
      ? { ...rowData }
      : {
          bank_name: "",
          account_limit: "",
          pledge_count_limit: "",
        };
  const [formData, setFormData] = useState(initialState);

  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();

  const redirectModal = () => {
    navigate("/console/master/bank");
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
      const response = await fetch(`${API_DOMAIN}/bank_details.php`, {
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
          navigate("/console/master/bank");
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
      const response = await fetch(`${API_DOMAIN}/bank_details.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          edit_bank_id: rowData.bank_id, // Include the bank ID in the request
          bank_name: formData.bank_name,
          account_limit: formData.account_limit,
          pledge_count_limit: formData.pledge_count_limit,
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

        // Navigate to the bank list page after a delay
        setTimeout(() => {
          navigate("/console/master/bank");
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
          responseData.message || t("Unknown error occurred during update")
        );
      }
    } catch (error) {
      console.error(t("Error updating bank:"), error.message);
    }

    setLoading(false);
  };

  return (
    <div>
      <Container>
        <Row className="regular justify-content-center">
          <Col lg="12" md="12" xs="12" className="py-3">
            <PageNav
              pagetitle={
                type === "view"
                  ? t("Bank View")
                  : type === "edit"
                  ? t("Bank Edit")
                  : t("Bank Creation")
              }
            ></PageNav>
          </Col>

          <Col lg="4" md="6" xs="12" className="py-3">
            {type === "edit" ? (
              <TextInputForm
                placeholder={t("Bank Name")}
                labelname={t("Bank Name")}
                name="bank_name"
                value={formData.bank_name}
                onChange={(e) => handleChange(e, "bank_name")}
              ></TextInputForm>
            ) : (
              <TextInputForm
                placeholder={t("Bank Name")}
                labelname={t("Bank Name")}
                name="bank_name"
                value={type === "view" ? rowData.bank_name : formData.bank_name}
                onChange={(e) => handleChange(e, "bank_name")}
              ></TextInputForm>
            )}
          </Col>
          <Col lg="4" md="6" xs="12" className="py-3">
            {type === "edit" ? (
              <TextInputForm
                placeholder={t("Account Limit")}
                labelname={t("Account Limit")}
                name="account_limit"
                value={formData.account_limit}
                onChange={(e) => handleChange(e, "account_limit")}
              ></TextInputForm>
            ) : (
              <TextInputForm
                placeholder={t("Account Limit")}
                labelname={t("Account Limit")}
                name="account_limit"
                value={
                  type === "view"
                    ? rowData.account_limit
                    : formData.account_limit
                }
                onChange={(e) => handleChange(e, "account_limit")}
              ></TextInputForm>
            )}
          </Col>
          <Col lg="4" md="6" xs="12" className="py-3">
            {type === "edit" ? (
              <TextInputForm
                placeholder={t("Pledge Count Limit")}
                labelname={t("Pledge Count Limit")}
                name="pledge_count_limit"
                value={formData.pledge_count_limit}
                onChange={(e) => handleChange(e, "pledge_count_limit")}
              ></TextInputForm>
            ) : (
              <TextInputForm
                placeholder={t("Pledge Count Limit")}
                labelname={t("Pledge Count Limit")}
                name="pledge_count_limit"
                value={
                  type === "view"
                    ? rowData.pledge_count_limit
                    : formData.pledge_count_limit
                }
                onChange={(e) => handleChange(e, "pledge_count_limit")}
              ></TextInputForm>
            )}
          </Col>
          <Col lg="12" md="12" xs="12" className="py-5 align-self-center">
            <div style={{ textAlign: "right", paddingRight: "5px" }}>
              {type === "view" ? (
                <ClickButton
                  label={<>{t("Back")}</>}
                  onClick={() => navigate("/console/master/bank")}
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
                          label={<>{t("Update")}</>}
                          onClick={handleUpdateSubmit}
                          disabled={loading}
                        ></ClickButton>
                      </span>

                      <span className="mx-2">
                        <ClickButton
                          label={<>{t("Cancel")}</>}
                          onClick={() => navigate("/console/master/bank")}
                          disabled={loading}
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
                          label={
                            loading ? <>{t("Submitting...")}</> : <>{t("Submit")}</>
                          }
                          onClick={handleSubmit}
                          disabled={loading}
                        ></ClickButton>
                      </span>
                      <span className="mx-2">
                        <Delete
                          label={<>{t("Cancel")}</>}
                          onClick={() => navigate("/console/master/bank")}
                          disabled={loading}
                        ></Delete>
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
            alt={t("Success GIF")}
          />
          <p>{t("Bank saved successfully!")}</p>
        </Modal.Body>
        <Modal.Footer>
          <ClickButton
            variant="secondary"
            label={<> {t("Close")}</>}
            onClick={() => redirectModal()}
          ></ClickButton>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BankDetailsCreation;