import React, { useState, useEffect } from "react";
import { Col, Container, Row, Alert, Modal, Form } from "react-bootstrap";
import { TextInputForm, DropDownUI, Calender } from "../../components/Forms";
import { ClickButton, Delete } from "../../components/ClickButton";
import PageNav from "../../components/PageNav";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API_DOMAIN from "../../config/config";
import { MdDeleteForever } from "react-icons/md";

const UserCreation = () => {
  const location = useLocation();
  const { type, rowData } = location.state || {};
  const today = new Date();
  const [searchText, setSearchText] = useState("");
  const [userData, setUserData] = useState([]);
  const defaultDate = today.toISOString().substr(0, 10);
  const [productList, setProductList] = useState([]);
  const initialState =
    type === "edit"
      ? {
          ...rowData,
          interest_receive_date: rowData.interest_receive_date,
          outstanding_period: rowData.outstanding_period || "",
          outstanding_amount: rowData.outstanding_amount || "",
          jewel_product: Array.isArray(rowData.jewel_product)
            ? rowData.jewel_product
            : JSON.parse(rowData.jewel_product || "[]"),
        }
      : {
          receipt_no: "",
          interest_receive_date: new Date().toISOString().substr(0, 10),
          name: "",
          customer_details: "",
          place: "",
          mobile_number: "",
          original_amount: "",
          interest_rate: "",

          item_location: "",
          interest_income: "",
          outstanding_period: "",
          outstanding_amount: "",
          topup_amount: "",
          deduction_amount: "",
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
          ],
        };
  const [formData, setFormData] = useState(initialState);
  console.log("formData", formData);

  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();

  const redirectModal = () => {
    navigate("/console/interest");
  };

  const handleSearchChange = (e, searchType) => {
    const value = e.target.value;
    setSearchText(value);

    const matchedData = userData.find((item) => {
      if (searchType === "receipt_no")
        return item.receipt_no.toString() === value;
      if (searchType === "mobile_number")
        return item.mobile_number.toString() === value;
      if (searchType === "customer_details")
        return item.customer_details === value;
      return false;
    });
    console.log(matchedData, "matchedData");

    if (matchedData) {
      setFormData({
        ...formData,
        receipt_no: matchedData.receipt_no || "",
        name: matchedData.name || "",
        customer_details: matchedData.customer_details || "",
        place: matchedData.place || "",
        mobile_number: matchedData.mobile_number || "",
        original_amount: matchedData.original_amount || "",
        interest_rate: matchedData.interest_rate || "",
        jewel_product: Array.isArray(matchedData.jewel_product)
          ? matchedData.jewel_product
          : JSON.parse(matchedData.jewel_product || "[]"),
        outstanding_period: matchedData.interest_payment_period || "",
        outstanding_amount: matchedData.interest_payment_amount || "",
      });
    } else {
      setFormData({
        ...formData,
        [searchType]: value,
        name: searchType === "name" ? value : "",
        customer_details: searchType === "customer_details" ? value : "",
        place: searchType === "place" ? value : "",
        mobile_number: searchType === "mobile_number" ? value : "",
        receipt_no: searchType === "receipt_no" ? value : "",
        original_amount: "",
        interest_rate: "",
        jewel_product: [],
        outstanding_period: "",
        outstanding_amount: "",
      });
    }
  };

  const handleChange = (e, fieldName, rowIndex) => {
    const value = e.target ? e.target.value : e.value;

    let updatedFormData = { ...formData };

    if (rowIndex !== undefined) {
      // If rowIndex is defined, it means we are updating a table row
      updatedFormData.jewel_product = formData.jewel_product.map((row, index) =>
        index === rowIndex ? { ...row, [fieldName]: value } : row
      );
    } else {
      // If rowIndex is undefined, update the top-level formData
      updatedFormData = {
        ...formData,
        [fieldName]: value,
      };
    }

    setFormData({
      ...updatedFormData,
      [fieldName]: value,
    });
  };

  const setLabel = (date, label) => {
    let dateString =
      date instanceof Date ? date.toISOString().substr(0, 10) : date;

    if (!dateString || isNaN(new Date(dateString))) {
      console.error("Invalid date:", date);
      return;
    }

    setFormData((prevData) => ({
      ...prevData,
      [label]: dateString,
    }));
  };

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
      console.log("responseData", responseData);
      setLoading(false);
      if (responseData.head.code === 200) {
        setUserData(responseData.body.pawnjewelry);
        console.log(setUserData);
      } else {
        throw new Error(responseData.head.msg);
      }
    } catch (error) {
      setLoading(false);
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
        setProductList(responseData.body.product); // <- Jewel names
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

  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const interestIncome = parseFloat(formData.interest_income) || 0;
      const outstandingAmount = parseFloat(formData.outstanding_amount) || 0;
      const topupAmount = parseFloat(formData.topup_amount) || 0;
      const deductionAmount = parseFloat(formData.deduction_amount) || 0;

      const isTopupOnly = topupAmount > 0 && deductionAmount <= 0;
      const isDeductionOnly = deductionAmount > 0 && topupAmount <= 0;
      const isBothEmptyOrZero = topupAmount <= 0 && deductionAmount <= 0;

      if (!isTopupOnly && !isDeductionOnly && !isBothEmptyOrZero) {
        toast.error(
          "Please enter either Top-up or Deduction amount, not both."
        );
        setLoading(false);
        return;
      }

      if (topupAmount > 0 || deductionAmount > 0) {
        if (interestIncome !== outstandingAmount) {
          toast.error(
            "Please pay all outstanding interest before adding a top-up."
          );
          setLoading(false);
          return;
        }
      }

      const response = await fetch(`${API_DOMAIN}/interest.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, edit_interest_id: "" }),
      });

      const responseData = await response.json();

      if (responseData.head.code === 200) {
        toast.success(responseData.head.msg);
        setTimeout(() => {
          navigate("/console/interest");
        }, 1000);
      } else {
        toast.error(responseData.head.msg);
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
      const response = await fetch(`${API_DOMAIN}/interest.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          edit_interest_id: rowData.interest_id,
          receipt_no: formData.receipt_no,
          interest_receive_date: formData.interest_receive_date,
          name: formData.name,
          customer_details: formData.customer_details,
          place: formData.place,
          mobile_number: formData.mobile_number,
          original_amount: formData.original_amount,
          interest_rate: formData.interest_rate,
          jewel_product: formData.jewel_product,
          interest_income: formData.interest_income ?? 0,
          outstanding_period: formData.outstanding_period,
          outstanding_amount: formData.outstanding_amount,
          topup_amount: formData.topup_amount,
          deduction_amount: formData.deduction_amount,
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
          navigate("/console/interest");
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
  return (
    <div>
      <Container>
        <Row className="regular">
          <Col lg="12" md="12" xs="12" className="py-3">
            <PageNav
              pagetitle={`Interest ${
                type === "view"
                  ? " view "
                  : type === "edit"
                  ? " edit "
                  : "Creation"
              }`}
            ></PageNav>
          </Col>
          <Col lg="3" md="6" xs="12" className="py-3">
            <TextInputForm
              placeholder={"Loan No"}
              labelname={"Loan No"}
              name="receipt_no"
              value={formData.receipt_no}
              onChange={(e) => handleSearchChange(e, "receipt_no")}
            />
          </Col>
          <Col lg="3" md="6" xs="12" className="py-3">
            <Calender
              setLabel={(date) => setLabel(date, "interest_receive_date")}
              initialDate={
                type === "edit" ? formData.interest_receive_date : undefined
              }
              calenderlabel="Date"
              disabled={type === "view" || type === "edit"}
            />
          </Col>
          <Col lg="3" md="4" xs="12" className="py-3">
            <TextInputForm
              placeholder={"Name"}
              labelname={"Name"}
              name="name"
              value={formData.name}
              onChange={(e) => handleChange(e, "name")}
            />
          </Col>
          <Col lg="3" md="4" xs="12" className="py-4">
            <label htmlFor="customer_details" className="form-label">
              Address
            </label>
            <textarea
              className="form-cntrl-bt w-100 "
              placeholder={"Address"}
              labelname={"Address"}
              name="customer_details"
              value={formData.customer_details}
              onChange={(e) => handleSearchChange(e, "customer_details")}
            />
          </Col>
          <Col lg="3" md="4" xs="12" className="py-3">
            <TextInputForm
              placeholder={"Place"}
              labelname={"Place"}
              name="place"
              value={formData.place}
              onChange={(e) => handleChange(e, "place")}
            />
          </Col>
          <Col lg="3" md="4" xs="12" className="py-3">
            <TextInputForm
              placeholder={"Mobile Number"}
              labelname={"Mobile Number"}
              name="mobile_number"
              value={formData.mobile_number}
              onChange={(e) => handleSearchChange(e, "mobile_number")}
            />
          </Col>

          <Col lg="3" md="4" xs="12" className="py-3">
            <TextInputForm
              placeholder={"principal amount"}
              labelname={"principal amount"}
              name="original_amount"
              value={formData.original_amount}
              onChange={(e) => handleChange(e, "original_amount")}
            ></TextInputForm>
          </Col>
          <Col lg="3" md="4" xs="12" className="py-3">
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

          <Col lg="3" md="4" xs="12" className="py-3">
            <TextInputForm
              placeholder={"Outstanding Period"}
              labelname={"Outstanding Period"}
              name="outstanding_period"
              value={formData.outstanding_period}
              onChange={(e) => handleChange(e, "outstanding_period")}
            ></TextInputForm>
          </Col>
          <Col lg="3" md="4" xs="12" className="py-3">
            <TextInputForm
              placeholder={" interest Outstanding Amount"}
              labelname={" interest Outstanding Amount"}
              name="outstanding_amount"
              value={formData.outstanding_amount}
              onChange={(e) => handleChange(e, "outstanding_amount")}
            ></TextInputForm>
          </Col>
          <Col lg="3" md="4" xs="12" className="py-3">
            <TextInputForm
              placeholder={"Interest Income"}
              labelname={"Interest Income"}
              name="interest_income"
              value={formData.interest_income}
              onChange={(e) => handleChange(e, "interest_income")}
            ></TextInputForm>
          </Col>
          {/* <Col lg="3" md="4" xs="12" className="py-3">
            <TextInputForm
              placeholder={"Topup Amount"}
              labelname={"Topup Amount"}
              name="interest_income"
              value={formData.topup_amount}
              onChange={(e) => handleChange(e, "topup_amount")}
            ></TextInputForm>
          </Col> */}
          <Col lg="3" md="4" xs="12" className="py-3">
            <TextInputForm
              placeholder={"Deduction Amount"}
              labelname={"Deduction Amount"}
              name="deduction_amount"
              value={formData.deduction_amount}
              onChange={(e) => handleChange(e, "deduction_amount")}
            ></TextInputForm>
          </Col>
          <Col lg="12" md="6" xs="12">
            <table className="table table-bordered mx-auto">
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
                  <th style={{ width: "5%" }}></th>
                  <th style={{ width: "7%" }}>நீக்கு</th>
                </tr>
              </thead>
              <tbody>
                {formData.jewel_product &&
                  formData.jewel_product.length > 0 &&
                  formData.jewel_product.map((row, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>

                      {/* Jewel Name Dropdown */}
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

                      {/* Carat Dropdown */}
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

                      {/* Count */}
                      <td>
                        <input
                          type="text"
                          className="form-cntrl w-100"
                          value={row.count}
                          onChange={(e) => handleChange(e, "count", index)}
                        />
                      </td>

                      {/* Gross Weight */}
                      <td>
                        <input
                          type="text"
                          className="form-cntrl w-100"
                          value={row.weight}
                          onChange={(e) => handleChange(e, "weight", index)}
                        />
                      </td>

                      {/* Deduction Weight */}
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

                      {/* Net Weight */}
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

                      {/* Remark */}
                      <td>
                        <textarea
                          rows={1}
                          className="form-cntrl w-100"
                          value={row.remark}
                          onChange={(e) => handleChange(e, "remark", index)}
                        />
                      </td>

                      {/* Add More (hidden) */}
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

                      {/* Delete */}
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
          </Col>
          <Col lg="12" md="12" xs="12" className="py-5 align-self-center">
            <div className="text-center">
              {type === "view" ? (
                <ClickButton
                  label={<>back</>}
                  onClick={() => navigate("/console/interest")}
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
                          onClick={() => navigate("/console/interest")}
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
                        />
                      </span>
                      <span className="mx-2">
                        <ClickButton
                          label={<>Cancel</>}
                          onClick={() => navigate("/console/interest")}
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
