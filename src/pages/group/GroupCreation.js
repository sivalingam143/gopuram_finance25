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
import { useLanguage } from "../../components/LanguageContext"; // 1. Import the hook

const GroupCreation = () => {
  const { t } = useLanguage(); // 2. Use the hook to get the translation function
  const location = useLocation();
  const { type, rowData } = location.state || {};
  const initialState =
    type === "edit"
      ? { ...rowData }
      : {
          Group_type: "",
          interest: "",
        };
  const [formData, setFormData] = useState(initialState);

  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();

  // 3. Translate DropList labels
  const DropList = [
    {
      value: "Admin",
      label: t("Admin"),
    },
    {
      value: "Super Admin",
      label: t("Super Admin"),
    },
    {
      value: "Employee",
      label: t("Employee"),
    },
  ];

  const redirectModal = () => {
    navigate("/console/master/group");
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
    // The commented out code uses strings that should also be wrapped in t() if uncommented.
    /*
    // for (const key in formData) {
    // 	if (formData[key] === "") {
    // 		toast.error(t(`${key} cannot be empty!`), {
    // 			position: "top-center",
    // 			autoClose: 2000,
    // 			hideProgressBar: false,
    // 			closeOnClick: true,
    // 			pauseOnHover: true,
    // 			draggable: true,
    // 			progress: undefined,
    // 			theme: "colored",
    // 		});
    // 		return;
    // 	}
    // }
    */
    setLoading(true);
    try {
      const response = await fetch(`${API_DOMAIN}/group.php`, {
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
          navigate("/console/master/group");
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
      const response = await fetch(`${API_DOMAIN}/group.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          edit_Group_type: rowData.Group_id, // Include the company ID in the request
          Group_type: formData.Group_type,
          interest: formData.interest,
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

        // Navigate to the user list page after a delay
        setTimeout(() => {
          navigate("/console/master/group");
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
        ); // Wrapped error message
      }
    } catch (error) {
      console.error("Error updating product:", error.message);
    }

    setLoading(false);
  };

  return (
    <div>
      <Container>
        <Row className="regular justify-content-center">
          <Col lg="12" md="12" xs="12" className="py-3">
            {/* 4. Translate PageNav title */}
            <PageNav
              pagetitle={`${t("Group")}${
                type === "view"
                  ? t(" view ")
                  : type === "edit"
                  ? t(" Edit ")
                  : t(" Creation ")
              }`}
            ></PageNav>
          </Col>

          <Col lg="4" md="6" xs="12" className="py-3">
            {/* 5. Translate TextInputForm for Group name */}
            {type === "edit" ? (
              <TextInputForm
                placeholder={t("Group name")}
                labelname={t("Group name")}
                name="Group_type"
                value={formData.Group_type}
                onChange={(e) => handleChange(e, "Group_type")}
              ></TextInputForm>
            ) : (
              <TextInputForm
                placeholder={t("Group name")}
                labelname={t("Group name")}
                name="Group_type"
                value={
                  type === "view" ? rowData.Group_type : formData.Group_type
                }
                onChange={(e) => handleChange(e, "Group_type")}
              ></TextInputForm>
            )}
          </Col>
          {/* 6. Translate commented-out TextInputForm for Interest */}
          {/* <Col lg="4" md="6" xs="12" className="py-3">
            {type === "edit" ? (
              <TextInputForm
                placeholder={t("Interest")}
                labelname={t("Interest")}
                name="interest"
                value={formData.interest}
                onChange={(e) => handleChange(e, "interest")}
              ></TextInputForm>
            ) : (
              <TextInputForm
                placeholder={t("Interest")}
                labelname={t("Interest")}
                name="interest"
                value={type === "view" ? rowData.interest : formData.interest}
                onChange={(e) => handleChange(e, "interest")}
              ></TextInputForm>
            )}
          </Col> */}
          <Col lg="12" md="12" xs="12" className="py-5 align-self-center">
            <div className="text-center">
              {type === "view" ? (
                // 7. Translate 'back' button
                <ClickButton
                  label={<>{t("back")}</>}
                  onClick={() => navigate("/console/user")}
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
                        {/* 8. Translate 'Update' button */}
                        <ClickButton
                          label={<>{t("Update")}</>}
                          onClick={handleUpdateSubmit}
                        ></ClickButton>
                      </span>

                      <span className="mx-2">
                        {/* 9. Translate 'Cancel' button */}
                        <Delete
                          label={<>{t("Cancel")}</>}
                          onClick={() => navigate("/console/master/group")}
                        ></Delete>
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
                        {/* 10. Translate 'Submit' and 'Submitting...' button */}
                        <ClickButton
                          label={
                            loading ? <>{t("Submitting...")}</> : <>{t("Submit")}</>
                          }
                          onClick={handleSubmit}
                          disabled={loading}
                        ></ClickButton>
                      </span>
                      <span className="mx-2">
                        {/* 11. Translate 'Cancel' button */}
                        <Delete
                          label={<>{t("Cancel")}</>}
                          onClick={() => navigate("/console/user")}
                        ></Delete>
                      </span>
                    </>
                  )}
                </>
              )}
            </div>
          </Col>
        </Row>
        {/* The error string is a variable `error`, which will contain the message from the API or an empty string. The API message is already handled with `toast`, so no translation needed here. */}
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
          {/* 12. Translate Modal success message */}
          <p>{t("User saved successfully!")}</p>
        </Modal.Body>
        <Modal.Footer>
          {/* 13. Translate Modal 'Close' button */}
          <ClickButton
            variant="secondary"
            label={<> {t("Close")}</>}
            onClick={() => redirectModal()}
          >
            {t("Close")}
          </ClickButton>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default GroupCreation;