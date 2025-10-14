import React, { useState, useEffect } from "react";
import { Col, Container, Row, Alert, Modal, Table } from "react-bootstrap";
import { TextInputForm, DropDownUI, Calender } from "../../components/Forms";
import { ClickButton } from "../../components/ClickButton";
import PageNav from "../../components/PageNav";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API_DOMAIN from "../../config/config";

const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
const UserCreation = () => {
  const location = useLocation();
  const { type, rowData } = location.state || {};
  const today = new Date();
  const defaultDate = today.toISOString().substr(0, 10);

  console.log("type", rowData);
  const initialState =
    type === "edit"
      ? { ...rowData }
      : {
          pawnjewelry_estimate_id: "",
          customer_name: "",
          name_of_guardians: "",
          mobile_number: "",
          address: "",
          group: "",
          jewel_original_rate: "",
          pawn_rate: "",
          pawn_interest: "",
          pawn_interest_amount: "",
          pawnjewelry_estimate_date: defaultDate,
          remark_jewel_pawn: "",
          jewel_product: [{ JewelName: "", weight: "", count: "" }],
        };
  const [formData, setFormData] = useState(initialState);
  console.log("formData", rowData);

  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();
  const [grupData, setgrupData] = useState([]);

  const redirectModal = () => {
    navigate("/console/master/jewelestimate");
  };

  const handleChange = (e, fieldName, rowIndex) => {
    const value = e.target ? e.target.value : e.value;

    let updatedFormData = { ...formData };

    if (rowIndex !== undefined) {
      updatedFormData = {
        ...formData,
        jewel_product: formData.jewel_product.map((row, index) =>
          index === rowIndex ? { ...row, [fieldName]: value } : row
        ),
      };
    } else {
      updatedFormData = {
        ...formData,
        [fieldName]: value,
      };
    }

    let pawn_interest_amount = formData.pawn_interest_amount;
    if (fieldName === "pawn_rate" || fieldName === "pawn_interest") {
      const pawn_rate = parseFloat(
        fieldName === "pawn_rate" ? value : formData.pawn_rate
      );
      const interestRate = parseFloat(
        fieldName === "pawn_interest" ? value : formData.pawn_interest
      );
      pawn_interest_amount = (pawn_rate * interestRate) / 100;
    }

    setFormData({
      ...updatedFormData,
      pawn_interest_amount: isNaN(pawn_interest_amount)
        ? ""
        : String(pawn_interest_amount),
    });
  };
  const handleAddRow = () => {
    setFormData({
      ...formData,
      jewel_product: [...formData.jewel_product, { JewelName: "", weight: "" }],
    });
  };

  const handleDeleteRow = (index) => {
    if (formData.jewel_product.length === 1) {
      return;
    }
    const updatedRows = formData.jewel_product.filter(
      (row, rowIndex) => rowIndex !== index
    );
    setFormData({
      ...formData,
      jewel_product: updatedRows,
    });
  };

  const setLabel = (date, label) => {
    const dateString = date instanceof Date ? date.toISOString() : date;
    handleChange(dateString, label);

    if (label === "pawnjewelry_estimate_date") {
      setFormData((prevData) => ({
        ...prevData,
        [label]: dateString,
      }));
    }
  };
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleSubmit = async () => {
    for (const key in formData) {
      if (key !== "pawnjewelry_estimate_id" && formData[key] === "") {
        toast.error(`${key} cannot be empty!`, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        return; // Exit the function early if any field is empty
      }
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_DOMAIN}/pawnestimate.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pawnjewelry_estimate_id: "",
          jewel_product: formData.jewel_product,
          customer_name: formData.customer_name,
          name_of_guardians: formData.name_of_guardians,
          mobile_number: formData.mobile_number,
          address: formData.address,
          group_id: formData.group,
          jewel_original_rate: formData.jewel_original_rate,
          pawn_rate: formData.pawn_rate,
          pawn_interest: formData.pawn_interest,
          pawn_interest_amount: formData.pawn_interest_amount,
          pawnjewelry_estimate_date: formData.pawnjewelry_estimate_date,
          remark_jewel_pawn: formData.remark_jewel_pawn,
        }),
      });

      const responseData = await response.json();

      console.log(responseData);

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
          navigate("/console/master/jewelestimate");
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
      const response = await fetch(`${API_DOMAIN}/pawnestimate.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pawnjewelry_estimate_id: rowData.pawnjewelry_estimate_id,
          jewel_product: formData.jewel_product,
          customer_name: formData.customer_name,
          name_of_guardians: formData.name_of_guardians,
          mobile_number: formData.mobile_number,
          address: formData.address,
          group_id: formData.group,
          jewel_original_rate: formData.jewel_original_rate,
          pawn_rate: formData.pawn_rate,
          pawn_interest: formData.pawn_interest,
          pawn_interest_amount: formData.pawn_interest_amount,
          pawnjewelry_estimate_date: formData.pawnjewelry_estimate_date,
          remark_jewel_pawn: formData.remark_jewel_pawn,
        }),
      });

      const responseData = await response.json();
      console.log(responseData);

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
          navigate("/console/master/jewelestimate");
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
  const fetchgroup = async () => {
    try {
      const response = await fetch(`${API_DOMAIN}/group.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          search_text: "",
        }),
      });

      const responseData = await response.json();
      console.log("responseData", responseData);
      setLoading(false);
      if (responseData.head.code === 200) {
        let sortedData = responseData.body.group;

        setgrupData(Array.isArray(sortedData) ? sortedData : [sortedData]);
      } else {
        throw new Error(responseData.head.msg);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error.message);
    }
  };
  useEffect(() => {
    fetchgroup();
  }, []);

  return (
    <div>
      <Container>
        <Row className="regular">
          <Col lg="12" md="12" xs="12" className="py-3">
            <PageNav
              pagetitle={`எஸ்டிமேட்${
                type === "view"
                  ? " வியூ "
                  : type === "edit"
                  ? "  எடிட் "
                  : "உருவாக்கம்"
              }`}
            ></PageNav>
          </Col>
          <Col lg="4" md="6" xs="12" className="py-3">
            <Calender
              setLabel={(date) => setLabel(date, "pawnjewelry_estimate_date")}
              initialDate={
                type === "edit" ? formData.pawnjewelry_estimate_date : undefined
              }
              calenderlabel="தேதி"
              disabled={type === "view" || type === "edit"}
            />
          </Col>

          <Col lg="4" md="6" xs="12" className="py-3">
            <TextInputForm
              placeholder={"வாடிக்கையாளர் பெயர்"}
              labelname={"வாடிக்கையாளர் பெயர்"}
              name="customer_name"
              value={formData.customer_name}
              onChange={(e) => handleChange(e, "customer_name")}
            ></TextInputForm>
          </Col>
          <Col lg="4" md="6" xs="12" className="py-3">
            <TextInputForm
              placeholder={"தந்தை அல்லது கணவர் பெயர்"}
              labelname={"தந்தை அல்லது கணவர் பெயர்"}
              name="name_of_guardians"
              value={formData.name_of_guardians}
              onChange={(e) => handleChange(e, "name_of_guardians")}
            ></TextInputForm>
          </Col>
          <Col lg="3" md="4" xs="12" className="py-3">
            <TextInputForm
              placeholder={"கைபேசி எண்"}
              labelname={"கைபேசி எண்"}
              name="mobile_number"
              value={formData.mobile_number}
              onChange={(e) => handleChange(e, "mobile_number")}
            />
          </Col>
          <Col lg="4" md="6" xs="12" className="py-3">
            <TextInputForm
              placeholder={"முகவரி"}
              labelname={"முகவரி"}
              name="address"
              value={formData.address}
              onChange={(e) => handleChange(e, "address")}
            ></TextInputForm>
          </Col>
          <Col lg="4" md="6" xs="12" className="py-3">
            <DropDownUI
              optionlist={grupData.map((user) => ({
                value: user.Group_id,
                label: user.Group_type,
              }))}
              placeholder="குரூப்"
              labelname="குரூப்"
              name="group"
              value={formData.group}
              onChange={(updatedFormData) =>
                setFormData({ ...formData, group: updatedFormData.group })
              }
            />
          </Col>

          <Col lg="4" md="6" xs="12" className="py-3">
            <TextInputForm
              placeholder={"நகை அசல் மதிப்பு"}
              labelname={"நகை அசல் மதிப்பு"}
              name="jewel_original_rate"
              value={formData.jewel_original_rate}
              onChange={(e) => handleChange(e, "jewel_original_rate")}
            ></TextInputForm>
          </Col>
          <Col lg="4" md="6" xs="12" className="py-3">
            <TextInputForm
              placeholder={"அடகு விலை"}
              labelname={"அடகு விலை"}
              name="Pawning Price"
              value={formData.pawn_rate}
              onChange={(e) => handleChange(e, "pawn_rate")}
            ></TextInputForm>
          </Col>
          <Col lg="4" md="6" xs="12" className="py-3">
            <TextInputForm
              placeholder={"வட்டி விகிதம்"}
              labelname={"வட்டி விகிதம்"}
              name="pawn_interest"
              value={formData.pawn_interest}
              onChange={(e) => handleChange(e, "pawn_interest")}
            ></TextInputForm>
          </Col>
          <Col lg="4" md="6" xs="12" className="py-3">
            <TextInputForm
              placeholder={"வட்டி தொகை"}
              labelname={"வட்டி தொகை"}
              name="pawn_interest_amount"
              value={formData.pawn_interest_amount}
              onChange={(e) => handleChange(e, "pawn_interest_amount")}
            ></TextInputForm>
          </Col>
          <Col lg="6" className="align-self-center py-3">
            <label>Remark</label>
            <div>
              <textarea
                className="form-cntrl w-100"
                placeholder="Remark"
                value={formData.remark_jewel_pawn}
                onChange={(e) => handleChange(e, "remark_jewel_pawn")}
              ></textarea>
            </div>
          </Col>
          <Col lg="12" md="6" xs="12">
            <table className="table">
              <thead>
                <tr>
                  <th>S.no</th>
                  <th>நகை பெயர்</th>
                  <th>எண்ணிக்கை</th>
                  <th>எடை</th>
                  <th></th>
                  <th>நீக்கு</th>
                </tr>
              </thead>
              <tbody>
                {formData.jewel_product &&
                  formData.jewel_product.length > 0 &&
                  formData.jewel_product.map((row, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        <TextInputForm
                          placeholder={"நகை பெயர்"}
                          value={row.JewelName}
                          onChange={(e) => handleChange(e, "JewelName", index)}
                        />
                      </td>
                      <td>
                        <TextInputForm
                          placeholder={"எண்ணிக்கை"}
                          value={row.count}
                          onChange={(e) => handleChange(e, "count", index)}
                        />
                      </td>
                      <td>
                        <TextInputForm
                          placeholder={"எடை"}
                          value={row.weight}
                          onChange={(e) => handleChange(e, "weight", index)}
                        />
                      </td>
                      <td>
                        <div className="d-none">
                          {index === formData.jewel_product.length - 1 && (
                            <ClickButton
                              label={<>Add More</>}
                              onClick={handleAddRow}
                            />
                          )}
                        </div>
                      </td>
                      <td>
                        <button onClick={() => handleDeleteRow(index)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </Col>
          <Col lg="12">
            <div className="text-center">
              {type === "view" ? (
                <span className="mx-2">
                  <ClickButton
                    label={<>back</>}
                    onClick={() => navigate("/console/master/estimate")}
                  />
                </span>
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
                          disabled={loading}
                        />
                      </span>
                      <span className="mx-2">
                        <ClickButton
                          label={<>cancle</>}
                          onClick={() => navigate("/console/master/estimate")}
                        />
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
                      <span className="px-2">
                        <ClickButton
                          label={loading ? <>Submitting...</> : <> Submit</>}
                          onClick={handleSubmit}
                          disabled={loading}
                        ></ClickButton>
                      </span>
                      <span className="px-2">
                        <ClickButton
                          label={<> Cancle</>}
                          onClick={() => navigate("/console/master/estimate")}
                          disabled={loading}
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

export default UserCreation;
