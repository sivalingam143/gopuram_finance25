import React, { useState } from "react";
import { Col, Container, Row, Alert, Modal } from "react-bootstrap";
import { TextInputForm } from "../../components/Forms";
import { ClickButton } from "../../components/ClickButton";
import PageNav from "../../components/PageNav";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API_DOMAIN from "../../config/config";

const CompanyCreation = () => {
  const location = useLocation();
  const { type, rowData } = location.state || {};
  console.log("rowData", rowData);
  const initialState =
    type === "edit"
      ? { ...rowData }
      : {
          company_name: "",
          mobile_number: "",
          gst: "",
          place: "",
          pincode: "",
        };
  const [formData, setFormData] = useState(initialState);

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const navigate = useNavigate();

  const redirectModal = () => {
    navigate("/console/company");
  };

  const handleChange = (e, fieldName) => {
    const value = e.target ? e.target.value : e.value;

    setFormData({
      ...formData,
      [fieldName]: value,
    });
  };
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdateSubmit = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${API_DOMAIN}/company.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          edit_company_id: rowData.user_id,
          company_name: formData.company_name,
          mobile_number: formData.mobile_number,
          gst: formData.gst,
          place: formData.place,
          pincode: formData.pincode,
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

        setTimeout(() => {
          navigate("/console/company");
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
      console.error("Error updating product:", error.message);
    }

    setLoading(false);
  };

  return (
    <div>
      <Container>
        <Row className="regular">
          <Col lg="12" md="12" xs="12" className="py-3">
            <PageNav
              pagetitle={`Company ${
                type === "view" ? "view" : type === "edit" ? "Edit" : "Creation"
              }`}
            ></PageNav>
          </Col>

          <Col lg="4" md="6" xs="12" className="py-3">
            {type === "edit" ? (
              <TextInputForm
                placeholder={"Company Name"}
                labelname={"Company Name"}
                name="company_name"
                value={formData.company_name}
                onChange={(e) => handleChange(e, "company_name")}
              ></TextInputForm>
            ) : (
              <TextInputForm
                placeholder={"Company Name"}
                labelname={"Company Name"}
                name="company_name"
                value={
                  type === "view" ? rowData.company_name : formData.company_name
                }
                onChange={(e) => handleChange(e, "company_name")}
              ></TextInputForm>
            )}
          </Col>
          <Col lg="4" md="6" xs="12" className="py-3">
            {type === "edit" ? (
              <TextInputForm
                placeholder={"Mobile Number"}
                type={"number"}
                labelname={"Mobile Number"}
                name="mobile_number"
                value={formData.mobile_number}
                onChange={(e) => handleChange(e, "mobile_number")}
              ></TextInputForm>
            ) : (
              <TextInputForm
                placeholder={"Mobile Number"}
                type={"number"}
                labelname={"Mobile Number"}
                name="mobile_number"
                value={
                  type === "view"
                    ? rowData.mobile_number
                    : formData.mobile_number
                }
                onChange={(e) => handleChange(e, "mobile_number")}
              ></TextInputForm>
            )}
          </Col>
          <Col lg="4" md="6" xs="12" className="py-3">
            {type === "edit" ? (
              <TextInputForm
                placeholder={"License number"}
                labelname={"License number"}
                name="gst"
                value={formData.gst}
                onChange={(e) => handleChange(e, "gst")}
              ></TextInputForm>
            ) : (
              <TextInputForm
                placeholder={"License number"}
                labelname={"License number"}
                name="gst"
                value={type === "view" ? rowData.gst : formData.gst}
                onChange={(e) => handleChange(e, "gst")}
              ></TextInputForm>
            )}
          </Col>
          <Col lg="4" md="6" xs="12" className="py-3">
            {type === "edit" ? (
              <TextInputForm
                placeholder={"Place"}
                labelname={"Place"}
                name="place"
                value={formData.place}
                onChange={(e) => handleChange(e, "place")}
              ></TextInputForm>
            ) : (
              <TextInputForm
                placeholder={"Place"}
                labelname={"Place"}
                name="place"
                value={type === "view" ? rowData.place : formData.place}
                onChange={(e) => handleChange(e, "place")}
              ></TextInputForm>
            )}
          </Col>
          <Col lg="4" md="6" xs="12" className="py-3">
            {type === "edit" ? (
              <TextInputForm
                placeholder={"Pincode"}
                labelname={"Pincode"}
                name="pincode"
                value={formData.pincode}
                onChange={(e) => handleChange(e, "pincode")}
              ></TextInputForm>
            ) : (
              <TextInputForm
                placeholder={"Pincode"}
                labelname={"Pincode"}
                name="pincode"
                value={type === "view" ? rowData.pincode : formData.pincode}
                onChange={(e) => handleChange(e, "pincode")}
              ></TextInputForm>
            )}
          </Col>
          <Col lg="12" md="12" xs="12" className="py-5 align-self-center">
            <div className="text-center">
              {type === "view" ? (
                <ClickButton
                  label={<>back</>}
                  onClick={() => navigate("/console/company")}
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
                          label={<>Update </>}
                          onClick={() => handleUpdateSubmit()}
                        ></ClickButton>
                      </span>
                      <span className="mx-2">
                        <ClickButton
                          label={<>Cancel</>}
                          onClick={() => navigate("/console/company")}
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
                        <ClickButton label={<>Submit</>}></ClickButton>
                      </span>
                      <span className="mx-2">
                        <ClickButton
                          label={<>Cancel</>}
                          onClick={() => navigate("/console/company")}
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
          <p>User saved successfully!</p>
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
export default CompanyCreation;
