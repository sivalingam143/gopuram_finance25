// LoanCreation.js - New component for Loan creation page
import React, { useState, useEffect } from "react";
import { Col, Container, Row, Alert, Modal, Form } from "react-bootstrap";
import { TextInputForm, DropDownUI, Calender } from "../../components/Forms";
import { ClickButton, Delete } from "../../components/ClickButton";
import PageNav from "../../components/PageNav";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API_DOMAIN from "../../config/config";
import { MdDeleteForever } from "react-icons/md";

const LoanCreation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { rowData } = location.state || {}; // Passed from CustomerDetails
  const today = new Date();
  const [searchText, setSearchText] = useState("");
  const [userData, setUserData] = useState([]); // For search if needed
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const initialState = {
    pawnjewelry_date: today.toISOString().substr(0, 10),
    customer_no: rowData?.customer_no || "",
    receipt_no: "", // Generate or user input
    name: rowData?.name || "",
    customer_details: rowData?.customer_details || "",
    place: rowData?.place || "",
    mobile_number: rowData?.mobile_number || "",
    original_amount: "", // Editable
    jewel_product: [
      {
        JewelName: "",
        count: "",
        weight: "",
        deduction_weight: "",
        net: "",
        remark: "",
        carrat: "",
      },
    ], // Editable table
    Jewelry_recovery_agreed_period: "", // Editable
    interest_rate: "", // Editable dropdown
    group_type: "", // Editable
    upload_type: "", // Editable
    // Bank pledge fields (if needed, editable)
    bank_pledge_date: "",
    bank_assessor_name: "",
    bank_name: "",
    bank_pawn_value: "",
    bank_interest: "",
    bank_duration: "",
    bank_additional_charges: "",
    location: "",
  };

  const [formData, setFormData] = useState(initialState);

  const fetchData = async () => {
    try {
      const response = await fetch(`${API_DOMAIN}/pawnjewelry.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          search_text: searchText,
        }),
      });

      const responseData = await response.json();
      if (responseData.head.code === 200) {
        setUserData(responseData.body.pawnjewelry);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  const fetchDataproduct = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_DOMAIN}/product.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ search_text: "" }),
      });

      const responseData = await response.json();
      setLoading(false);

      if (responseData.head.code === 200) {
        setProductList(responseData.body.product); // Jewel names
      } else {
        throw new Error(responseData.head.msg);
      }
    } catch (error) {
      console.error("Error fetching product data:", error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataproduct();
    fetchData();
  }, [searchText]);

  const handleSearchChange = (e, searchType) => {
    const value = e.target.value;
    setSearchText(value);

    // Auto-fill if searching matches (optional, based on old code)
    const matchedData = userData.find((item) => {
      if (searchType === "receipt_no")
        return item.receipt_no.toString() === value;
      if (searchType === "mobile_number")
        return item.mobile_number.toString() === value;
      if (searchType === "customer_details")
        return item.customer_details === value;
      return false;
    });

    if (matchedData) {
      // Pre-fill from matched if needed, but since customer is fixed, skip or warn
      toast.info("Record found, but customer is pre-filled.");
    }
  };

  const handleChange = (e, fieldName, rowIndex) => {
    const value = e.target ? e.target.value : e.value;

    let updatedFormData = { ...formData };

    if (rowIndex !== undefined) {
      // Update table row
      updatedFormData.jewel_product = formData.jewel_product.map((row, index) =>
        index === rowIndex ? { ...row, [fieldName]: value } : row
      );
    } else {
      // Update top-level
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

  const handleAddRow = () => {
    setFormData({
      ...formData,
      jewel_product: [
        ...formData.jewel_product,
        {
          JewelName: "",
          count: "",
          weight: "",
          deduction_weight: "",
          net: "",
          remark: "",
          carrat: "",
        },
      ],
    });
  };

  const handleDeleteRow = (index) => {
    if (formData.jewel_product.length === 1) return;
    const updatedRows = formData.jewel_product.filter(
      (row, rowIndex) => rowIndex !== index
    );
    setFormData({
      ...formData,
      jewel_product: updatedRows,
    });
  };

  const handleKeyPress = (event, index) => {
    if (event.key === "Enter") {
      if (
        formData.jewel_product[index].JewelName &&
        formData.jewel_product[index].weight &&
        formData.jewel_product[index].deduction_weight &&
        formData.jewel_product[index].count
      ) {
        handleAddRow();
      } else {
        toast.error(
          "Please fill in JewelName, weight, deduction_weight, and count before adding a new row"
        );
      }
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_DOMAIN}/pawnjewelry.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData }),
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
            <PageNav pagetitle={"Loan Creation"}></PageNav>
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

          {/* Editable Loan Details Container */}
          <Col lg={4}>
            <div className="customer-card bg-light border rounded p-3 h-100">
              <h5 className="mb-3">Loan Details</h5>
              <Row>
                <Col lg={12} className="py-2">
                  <Calender
                    setLabel={(date) => setLabel(date, "pawnjewelry_date")}
                    initialDate={formData.pawnjewelry_date}
                    calenderlabel="Pawn Date"
                  />
                </Col>
                <Col lg={12} className="py-2">
                  <TextInputForm
                    placeholder={"Receipt No"}
                    labelname={"Receipt No"}
                    name="receipt_no"
                    value={formData.receipt_no}
                    onChange={(e) => handleChange(e, "receipt_no")}
                  />
                </Col>
                <Col lg={12} className="py-2">
                  <TextInputForm
                    placeholder={"Original Amount"}
                    labelname={"Original Amount"}
                    name="original_amount"
                    value={formData.original_amount}
                    onChange={(e) => handleChange(e, "original_amount")}
                  />
                </Col>
                <Col lg={12} className="py-2">
                  <Form.Group controlId="interestRate">
                    <Form.Label>Interest Rate</Form.Label>
                    <Form.Select
                      name="interest_rate"
                      value={formData.interest_rate}
                      onChange={(e) => handleChange(e, "interest_rate")}
                    >
                      <option value="">-- Select Interest Rate --</option>
                      {[1, 1.5, 2, 2.5, 3, 3.5, 4].map((percentage) => (
                        <option key={percentage} value={percentage}>
                          {percentage} பைசா
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col lg={12} className="py-2">
                  <TextInputForm
                    placeholder={"Recovery Period"}
                    labelname={"Recovery Period"}
                    name="Jewelry_recovery_agreed_period"
                    value={formData.Jewelry_recovery_agreed_period}
                    onChange={(e) =>
                      handleChange(e, "Jewelry_recovery_agreed_period")
                    }
                  />
                </Col>
              </Row>
            </div>
          </Col>

          {/* Jewel Product Editable Table */}
          <Col lg={4}>
            <div className="customer-card bg-light border rounded p-3 h-100">
              <h5 className="mb-3">Pledge Items</h5>
              <table className="table table-bordered w-100">
                <thead>
                  <tr>
                    <th style={{ width: "5%" }}>S.No</th>
                    <th style={{ width: "20%" }}>நகை பெயர்</th>
                    <th style={{ width: "10%" }}>தரம்</th>
                    <th style={{ width: "8%" }}>எண்ணிக்கை</th>
                    <th style={{ width: "10%" }}>மொத்த எடை(gm)</th>
                    <th style={{ width: "10%" }}>கழிவு எடை(gm)</th>
                    <th style={{ width: "10%" }}>நிகர எடை(gm)</th>
                    <th style={{ width: "20%" }}>குறிப்பு</th>
                    <th style={{ width: "7%" }}>நீக்கு</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.jewel_product.map((row, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        <select
                          className="form-cntrl w-100"
                          value={row.JewelName}
                          onChange={(e) => handleChange(e, "JewelName", index)}
                          autoFocus={
                            index === formData.jewel_product.length - 1
                          }
                        >
                          <option value="">தேர்வு செய்க</option>
                          {productList.map((item, idx) => (
                            <option key={idx} value={item.product_eng}>
                              {item.product_eng}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <select
                          className="form-cntrl w-100"
                          value={row.carrat}
                          onChange={(e) => handleChange(e, "carrat", index)}
                        >
                          <option value="">தேர்வு செய்க</option>
                          <option value="20 Carat">20 Carat</option>
                          <option value="22 Carat">22 Carat</option>
                          <option value="916">916</option>
                          <option value="916 KDM">916 KDM</option>
                          <option value="BIS Hall Mark">BIS Hall Mark</option>
                        </select>
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-cntrl w-100"
                          value={row.count}
                          onChange={(e) => handleChange(e, "count", index)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-cntrl w-100"
                          value={row.weight}
                          onChange={(e) => handleChange(e, "weight", index)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-cntrl w-100"
                          value={row.deduction_weight}
                          onChange={(e) =>
                            handleChange(e, "deduction_weight", index)
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-cntrl w-100"
                          value={(
                            parseFloat(row.weight || 0) -
                            parseFloat(row.deduction_weight || 0)
                          ).toFixed(2)}
                          readOnly
                        />
                      </td>
                      <td>
                        <textarea
                          rows={1}
                          className="form-cntrl w-100"
                          value={row.remark}
                          onChange={(e) => handleChange(e, "remark", index)}
                        />
                      </td>
                      <td>
                        <Delete
                          onClick={() => handleDeleteRow(index)}
                          label={<MdDeleteForever />}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <ClickButton label={<>Add Row</>} onClick={handleAddRow} />
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

export default LoanCreation;
