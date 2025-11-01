import React, { useState, useEffect, useRef } from "react";
import { Col, Container, Row, Alert } from "react-bootstrap";
import { TextInputForm } from "../../components/Forms";
import { ClickButton, ChooseButton } from "../../components/ClickButton";
import PageNav from "../../components/PageNav";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import API_DOMAIN from "../../config/config";
import "react-toastify/dist/ReactToastify.css";

const BankPledgeCreation = () => {
  const location = useLocation();
  const { type, rowData } = location.state || {};
  const navigate = useNavigate();
  const proofInputRef = useRef(null);
  const [previewFile, setPreviewFile] = useState(null);

  const initialState =
    type === "edit"
      ? {
          ...rowData,
          proof: rowData.proof
            ? rowData.proof.map((url, index) => {
                const extension = url.split(".").pop()?.toLowerCase();
                const isImage = /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(url);
                return {
                  name: `file_${index + 1}.${extension}`,
                  data: url,
                  type: isImage ? "image" : "file",
                };
              })
            : [],
        }
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
          proof: [],
        };
  const [formData, setFormData] = useState(initialState);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user")) || {};

  useEffect(() => {
    if (type === "edit" && rowData) {
      setIsLoading(false);
    }
  }, [type, rowData]);

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
        body: JSON.stringify({
          ...formData,
          proof: formData.proof.map((file) => ({ data: file.data })),
          login_id: user.id,
          user_name: user.user_name,
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
        proof: formData.proof.map((file) => ({ data: file.data })),
        login_id: user.id,
        user_name: user.user_name,
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

  const handlePreview = (file) => {
    setPreviewFile(file);
  };

  const closePreview = () => {
    setPreviewFile(null);
  };

  const handleFileChange = (files, field) => {
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      const maxSize = 5 * 1024 * 1024;

      fileArray.forEach((file) => {
        if (file.size > maxSize) {
          toast.error(`${file.name} exceeds 5MB limit.`, {
            position: "top-center",
            autoClose: 2000,
            theme: "colored",
          });
          return;
        }

        const reader = new FileReader();

        reader.onloadend = () => {
          if (file.type.startsWith("image/")) {
            setFormData((prevData) => ({
              ...prevData,
              [field]: [
                ...prevData[field],
                { type: "image", data: reader.result, name: file.name },
              ],
            }));
          } else if (file.type === "application/pdf") {
            setFormData((prevData) => ({
              ...prevData,
              [field]: [
                ...prevData[field],
                { type: "pdf", data: reader.result, name: file.name },
              ],
            }));
          } else {
            toast.error(`${file.name}: Only images and PDFs are allowed.`, {
              position: "top-center",
              autoClose: 2000,
              theme: "colored",
            });
          }
        };

        reader.onerror = () => {
          toast.error(`Failed to read ${file.name}.`, {
            position: "top-center",
            autoClose: 2000,
            theme: "colored",
          });
        };

        reader.readAsDataURL(file);
      });

      toast.success("File(s) uploaded successfully!", {
        position: "top-center",
        autoClose: 2000,
        theme: "colored",
      });
    } else {
      toast.error("Please select valid files.", {
        position: "top-center",
        autoClose: 2000,
        theme: "colored",
      });
    }
  };

  const handleImageDelete = (index, field) => {
    const newFiles = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newFiles });

    if (newFiles.length === 0 && proofInputRef.current) {
      proofInputRef.current.value = "";
    }

    toast.info("File removed successfully!", {
      position: "top-center",
      autoClose: 2000,
      theme: "colored",
    });
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

          <Col lg="12" className="py-3">
            <div className="file-upload">
              <label>
                {isView ? "View Bank Detail Proof" : "Upload Bank Detail Proof"}
              </label>
              {!isView && (
                <input
                  type="file"
                  id="proof"
                  accept="image/*,application/pdf"
                  ref={proofInputRef}
                  multiple
                  onChange={(e) => handleFileChange(e.target.files, "proof")}
                  style={{ display: "none" }}
                />
              )}
              {!isView && (
                <ChooseButton
                  label="Choose File"
                  onClick={() => proofInputRef.current.click()}
                  className="choosefilebtn"
                />
              )}
              {formData.proof && formData.proof.length > 0 && (
                <div className="file-preview mt-2">
                  {formData.proof.map((file, index) => (
                    <div
                      key={index}
                      className="file-item d-flex align-items-center mb-2"
                    >
                      {file.type === "image" ? (
                        <img
                          src={file.data}
                          alt={`Preview ${file.name}`}
                          onError={(e) => {
                            e.target.src = "/assets/fallback-image.png";
                            toast.error(`Failed to load image: ${file.name}`, {
                              position: "top-center",
                              autoClose: 2000,
                              theme: "colored",
                            });
                          }}
                          style={{
                            width: "100px",
                            height: "100px",
                            marginRight: "10px",
                            objectFit: "cover",
                            borderRadius: "5px",
                          }}
                        />
                      ) : (
                        <div
                          className="file-info"
                          style={{ marginRight: "10px" }}
                        >
                          <p>
                            <a
                              href={file.data}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {file.name}
                            </a>{" "}
                            ({file.type ? file.type.toUpperCase() : "UNKNOWN"})
                          </p>
                        </div>
                      )}

                      {!isView && (
                        <>
                          <ChooseButton
                            label="Preview"
                            className="btn btn-primary btn-sm me-2"
                            onClick={() => handlePreview(file)}
                          />
                          <ChooseButton
                            label="Delete"
                            className="btn btn-danger btn-sm"
                            onClick={() => handleImageDelete(index, "proof")}
                          />
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
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
      {previewFile && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              position: "relative",
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "8px",
              maxWidth: "100%",
              maxHeight: "100%",
              overflow: "auto",
            }}
          >
            <button
              onClick={closePreview}
              style={{
                position: "absolute",
                top: "1px",
                right: "1px",
                background: "black",
                border: "none",
                fontSize: "24px",
                cursor: "pointer",
                color: "#333",
              }}
            >
              ×
            </button>
            {previewFile.type === "image" ? (
              <img
                src={previewFile.data}
                alt={`Preview ${previewFile.name}`}
                style={{
                  maxWidth: "100%",
                  maxHeight: "80vh",
                  objectFit: "contain",
                }}
                onError={() =>
                  toast.error(`Failed to load image: ${previewFile.name}`, {
                    position: "top-center",
                    autoClose: 2000,
                    theme: "colored",
                  })
                }
              />
            ) : (
              <iframe
                src={previewFile.data}
                title={`Preview ${previewFile.name}`}
                style={{
                  width: "100%",
                  height: "80vh",
                  border: "none",
                }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BankPledgeCreation;
