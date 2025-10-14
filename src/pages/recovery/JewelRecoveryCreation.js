import React, { useState, useEffect } from "react";
import { Col, Container, Row, Alert, Modal, Form } from "react-bootstrap";
import { TextInputForm, Calender } from "../../components/Forms";
import { ClickButton, Delete } from "../../components/ClickButton";
import PageNav from "../../components/PageNav";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API_DOMAIN from "../../config/config";
import dayjs from "dayjs";
import debounce from "lodash.debounce";
import { MdDeleteForever } from "react-icons/md";

const UserCreation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { type, rowData } = location.state || {};
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [PawnData, setPawnUserData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [productList, setProductList] = useState([]);

  const redirectModal = () => {
    navigate("/console/master/jewelrecovery");
  };

  const initialState =
    type === "edit"
      ? {
          ...rowData,
          pawnjewelry_date: rowData.pawnjewelry_date,
          pawnjewelry_recovery_date: rowData.pawnjewelry_recovery_date,
          jewel_product: Array.isArray(rowData.jewel_product)
            ? rowData.jewel_product
            : JSON.parse(rowData.jewel_product || "[]"),
        }
      : {
          receipt_no: "",
          pawnjewelry_date: "",
          name: "",
          customer_details: "",
          place: "",
          mobile_number: "",
          original_amount: "",
          interest_rate: "",
          interest_income: 0,
          interest_payment_periods: "",
          refund_amount: "",
          other_amount: "",
          pawnjewelry_recovery_date: new Date().toISOString().substr(0, 10),
          jewel_product: [
            {
              JewelName: "",
              count: "",
              weight: "",
              net: "",
              remark: "",
              carrat: "",
            },
          ],
          bank_pledge_date: new Date().toISOString().substr(0, 10),
          bank_assessor_name: "",
          bank_name: "",
          bank_pawn_value: "",
          bank_interest: "",
          bank_duration: "",
          bank_additional_charges: "",
          location: "",
          bank_paid_interest_amount: "",
          bank_recovery_pawn_amount: "",
        };

  const [formData, setFormData] = useState(initialState);
  console.log("formData", formData);
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
    const formattedDate = dayjs(date).format("YYYY-MM-DD");
    setFormData((prevData) => ({
      ...prevData,
      [label]: formattedDate,
    }));
  };

  // Function to parse interest_payment_periods (e.g., "1 month 23 days") to total days
  const parseInterestPaymentPeriods = (period) => {
    if (!period || period === "0 days") return 0;
    let totalDays = 0;
    const parts = period.split(" ");
    for (let i = 0; i < parts.length; i++) {
      if (parts[i].includes("month")) {
        totalDays += parseInt(parts[i - 1]) * 30; // 1 month = 30 days
      } else if (parts[i].includes("day")) {
        totalDays += parseInt(parts[i - 1]);
      }
    }
    return totalDays;
  };

  // Function to format total days to "months and days"
  const formatInterestPaymentPeriods = (totalDays) => {
    if (totalDays === 0) return "0 days";
    const months = Math.floor(totalDays / 30);
    const days = totalDays % 30;
    let periodString = "";
    if (months > 0) {
      periodString += `${months} month${months > 1 ? "s" : ""}`;
    }
    if (days > 0) {
      periodString += `${months > 0 ? " " : ""}${days} day${
        days > 1 ? "s" : ""
      }`;
    }
    return periodString || "0 days";
  };

  const handleSearchChange = (e, searchType) => {
    const value = e.target.value;
    setSearchText(value);

    const matchedPawnData = PawnData.find((item) => {
      if (searchType === "receipt_no")
        return item.receipt_no?.toString().trim() === value.trim();
      if (searchType === "mobile_number")
        return item.mobile_number?.toString().trim() === value.trim();
      if (searchType === "customer_details")
        return (
          item.customer_details?.toLowerCase().trim() ===
          value.toLowerCase().trim()
        );
      return false;
    });

    console.log(matchedPawnData);

    if (matchedPawnData) {
      const matchedInterestData = userData.filter((item) => {
        if (searchType === "receipt_no")
          return item.receipt_no.toString() === value;
        if (searchType === "mobile_number")
          return item.mobile_number.toString() === value;
        if (searchType === "customer_details")
          return item.customer_details.toLowerCase() === value.toLowerCase();
        return false;
      });

      // Calculate total interest_income
      let totalInterestIncome = matchedInterestData.reduce(
        (total, item) => total + (parseFloat(item.interest_income) || 0),
        0
      );

      // Calculate total interest_payment_periods
      let totalDays = matchedInterestData.reduce((total, item) => {
        return (
          total + parseInterestPaymentPeriods(item.interest_payment_periods)
        );
      }, 0);

      // Format total interest_payment_periods
      const formattedPeriod = formatInterestPaymentPeriods(totalDays);

      setFormData((prevFormData) => ({
        ...prevFormData,
        receipt_no: matchedPawnData?.receipt_no || "",
        name: matchedPawnData?.name || "",
        customer_details: matchedPawnData?.customer_details || "",
        place: matchedPawnData?.place || "",
        mobile_number: matchedPawnData?.mobile_number || "",
        original_amount: matchedPawnData?.original_amount || "",
        interest_rate: matchedPawnData?.interest_rate || "",
        jewel_product: Array.isArray(matchedPawnData.jewel_product)
          ? matchedPawnData.jewel_product
          : JSON.parse(matchedPawnData.jewel_product || "[]"),
        pawnjewelry_date: matchedPawnData?.pawnjewelry_date || "",
        interest_income: totalInterestIncome,
        interest_payment_periods: formattedPeriod,
        outstanding_amount: matchedPawnData.interest_payment_amount,
        outstanding_period: matchedPawnData.interest_payment_period,
        refund_amount:
          parseFloat(matchedPawnData?.original_amount) +
          parseFloat(matchedPawnData.interest_payment_amount),

        bank_pledge_date: matchedPawnData?.bank_pledge_date || "",
        bank_assessor_name: matchedPawnData?.bank_assessor_name || "",
        bank_name: matchedPawnData?.bank_name || "",
        bank_pawn_value: matchedPawnData?.bank_pawn_value || "",
        bank_interest: matchedPawnData?.bank_interest || "",
        bank_duration: matchedPawnData?.bank_duration || "",
        bank_additional_charges: matchedPawnData?.bank_additional_charges || "",
        location: matchedPawnData?.location || "",
      }));
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
        pawnjewelry_date: new Date().toISOString().substr(0, 10),
        interest_income: 0,
        interest_payment_periods: "",
      });
    }
  };

  const fetchJewelPawnData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_DOMAIN}/pawnjewelry.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ search_text: searchText }),
      });

      const responseData = await response.json();
      setLoading(false);
      if (responseData.head.code === 200) {
        setPawnUserData(responseData.body.pawnjewelry || []);
      } else {
        throw new Error(responseData.head.msg);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error.message);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_DOMAIN}/interest.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ search_text: searchText }),
      });

      const responseData = await response.json();
      setLoading(false);
      if (responseData.head.code === 200) {
        setUserData(responseData.body.interest);
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
    // if (searchText.length > 0) {
    fetchData();
    fetchJewelPawnData();
    // }
  }, [searchText]);

  const handleSubmit = async () => {
    const refundAmount = parseFloat(formData.refund_amount) || 0;
    const outstandingInterest = parseFloat(formData.outstanding_amount) || 0;
    const interestIncome = parseFloat(formData.interest_income) || 0;
    setLoading(true);
    try {
      if (refundAmount > 0 && outstandingInterest > 0) {
        const currentDate = new Date().toISOString().split("T")[0];
        const interestRes = await fetch(`${API_DOMAIN}/interest.php`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            edit_interest_id: "",
            receipt_no: formData.receipt_no,
            interest_receive_date: currentDate,
            name: formData.name,
            customer_details: formData.customer_details,
            place: formData.place,
            mobile_number: formData.mobile_number,
            original_amount: formData.original_amount,
            interest_rate: formData.interest_rate,
            jewel_product: formData.jewel_product,
            interest_income: outstandingInterest ?? 0,
            outstanding_period: formData.outstanding_period,
            outstanding_amount: formData.outstanding_amount,
            topup_amount: 0,
            deduction_amount: 0,
          }),
        });

        const interestData = await interestRes.json();
        if (interestData.head.code !== 200) {
          toast.error("Interest entry failed: " + interestData.head.msg);
          return;
          setLoading(false);
        }
      }

      // Step 2: Submit recovery
      const recoveryRes = await fetch(`${API_DOMAIN}/pawnrecovery.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          refund_amount: parseFloat(formData.original_amount),
          interest_paid: outstandingInterest,
          edit_pawnrecovery_id: "",
        }),
      });

      const recoveryData = await recoveryRes.json();

      if (recoveryData.head.code === 200) {
        toast.success(recoveryData.head.msg);
        setTimeout(() => navigate("/console/master/jewelrecovery"), 1000);
      } else {
        toast.error(recoveryData.head.msg);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Unexpected error occurred.");
      setLoading(false);
    }
  };

  const handleUpdateSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_DOMAIN}/pawnrecovery.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          edit_pawnrecovery_id: formData.pawnjewelry_recovery_id,
        }),
      });

      const responseData = await response.json();
      setLoading(false);

      if (responseData.head.code === 200) {
        toast.success(responseData.head.msg);
        setTimeout(() => navigate("/console/master/jewelrecovery"), 1000);
      } else {
        toast.error(responseData.head.msg);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error:", error);
    }
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
              pagetitle={`Loan Closing${
                type === "view"
                  ? " view "
                  : type === "edit"
                  ? " edit "
                  : " Creation"
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
              setLabel={(date) => setLabel(date, "pawnjewelry_date")}
              calenderlabel="Date of pawning the jewelry"
              disabled={type === "view" || type === "edit"}
              initialDate={formData.pawnjewelry_date}
            />
          </Col>
          <Col lg="3" md="4" xs="12" className="py-3">
            <TextInputForm
              placeholder={"Name"}
              labelname={"Name"}
              name="name"
              value={formData.name}
              onChange={(e) => handleSearchChange(e, "name")}
            />
          </Col>
          <Col lg="3" md="4" xs="12" className="py-4">
            <label htmlFor="customer_details" className="form-label">
              Address
            </label>
            <textarea
              className="form-cntrl-bt w-100"
              placeholder={"Name, address"}
              labelname={"Name, address"}
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
              labelname={"prinicipal Amount"}
              name="original_amount"
              value={formData.original_amount}
              onChange={(e) => handleChange(e, "original_amount")}
            />
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
              placeholder={"Interest Income"}
              labelname={"Interest Income"}
              name="interest_income"
              value={formData.interest_income}
              onChange={(e) => handleChange(e, "interest_income")}
            />
          </Col>
          <Col lg="3" md="4" xs="12" className="py-3">
            <TextInputForm
              placeholder={"Interest Payment Periods"}
              labelname={"Interest Payment Periods"}
              name="interest_payment_periods"
              value={formData.interest_payment_periods}
              onChange={(e) => handleChange(e, "interest_payment_periods")}
            />
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
              placeholder={"interest Outstanding Amount"}
              labelname={"interest Outstanding Amount"}
              name="outstanding_amount"
              value={formData.outstanding_amount}
              onChange={(e) => handleChange(e, "outstanding_amount")}
            ></TextInputForm>
          </Col>
          <Col lg="3" md="4" xs="12" className="py-3">
            <TextInputForm
              placeholder={"loan closeing Amount"}
              labelname={"loan closeing Amount"}
              name="refund_amount"
              value={formData.refund_amount}
              onChange={(e) => handleChange(e, "refund_amount")}
            />
          </Col>
          <Col lg="3" md="4" xs="12" className="py-3">
            <TextInputForm
              placeholder={"Other Charges"}
              labelname={"Other Charges"}
              name="other_amount"
              value={formData.other_amount}
              onChange={(e) => handleChange(e, "other_amount")}
            />
          </Col>
          <Col lg="3" md="6" xs="12" className="py-3">
            <Calender
              setLabel={(date) => setLabel(date, "pawnjewelry_recovery_date")}
              initialDate={
                type === "edit" ? formData.pawnjewelry_recovery_date : undefined
              }
              calenderlabel="Jewelry pawn redemption date"
              disabled={type === "view" || type === "edit"}
            />
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

                      {/* Net Weight  */}
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
          {/* <Col lg="12" className="py-3">
            <h4 className="mb-3">Bank Pledge Details</h4>
          </Col>
          <Col lg="3" md="4" xs="12" className="py-3">
            <Calender
              setLabel={(date) => setLabel(date, "bank_pledge_date")}
              initialDate={
                type === "edit" ? formData.bank_pledge_date : undefined
              }
              calenderlabel="Pledge Date"
              disabled={type === "view"}
            />
          </Col>
          <Col lg="3" md="4" xs="12" className="py-3">
            <TextInputForm
              placeholder={"Bank Assessor Name"}
              labelname={"Bank Assessor Name"}
              name="bank_assessor_name"
              value={formData.bank_assessor_name}
              onChange={(e) => handleChange(e, "bank_assessor_name")}
              disabled={type === "view"}
            />
          </Col>
          <Col lg="3" md="4" xs="12" className="py-3">
            <TextInputForm
              placeholder={"Bank Name"}
              labelname={"Bank Name"}
              name="bank_name"
              value={formData.bank_name}
              onChange={(e) => handleChange(e, "bank_name")}
              disabled={type === "view"}
            />
          </Col>
          <Col lg="3" md="4" xs="12" className="py-3">
            <TextInputForm
              placeholder={"Bank Loan Value"}
              labelname={"Bank Loan Value"}
              name="bank_pawn_value"
              value={formData.bank_pawn_value}
              onChange={(e) => handleChange(e, "bank_pawn_value")}
              disabled={type === "view"}
            />
          </Col>
          <Col lg="3" md="4" xs="12" className="py-3">
            <TextInputForm
              placeholder={"Bank Interest"}
              labelname={"Bank Interest"}
              name="bank_interest"
              value={formData.bank_interest}
              onChange={(e) => handleChange(e, "bank_interest")}
              disabled={type === "view"}
            />
          </Col>
          <Col lg="3" md="4" xs="12" className="py-3">
            <Calender
              setLabel={(date) => setLabel(date, "bank_duration")}
              initialDate={type === "edit" ? formData.bank_duration : undefined}
              calenderlabel="Due Date"
              disabled={type === "view"}
            />
          </Col>
          <Col lg="3" md="4" xs="12" className="py-3">
            <TextInputForm
              placeholder={"Additional Charges"}
              labelname={"Additional Charges"}
              name="bank_additional_charges"
              value={formData.bank_additional_charges}
              onChange={(e) => handleChange(e, "bank_additional_charges")}
              disabled={type === "view"}
            />
          </Col>
          <Col lg="3" md="4" xs="12" className="py-3">
            <TextInputForm
              placeholder={"Bank Loan No"}
              labelname={"Bank Loan No"}
              name="location"
              value={formData.location}
              onChange={(e) => handleChange(e, "location")}
              disabled={type === "view"}
            />
          </Col>
          <Col lg="3" md="4" xs="12" className="py-3">
            <TextInputForm
              placeholder={"Bank Paid Interest Amount"}
              labelname={"Bank Paid Interest Amount"}
              name="bank_paid_interest_amount"
              value={formData.bank_paid_interest_amount}
              onChange={(e) => handleChange(e, "bank_paid_interest_amount")}
              disabled={type === "view"}
            />
          </Col>
          <Col lg="3" md="4" xs="12" className="py-3">
            <TextInputForm
              placeholder={"Bank pawn recovery Amount"}
              labelname={"Bank pawn recovery Amount"}
              name="bank_recovery_pawn_amount"
              value={formData.bank_recovery_pawn_amount}
              onChange={(e) => handleChange(e, "bank_recovery_pawn_amount")}
              disabled={type === "view"}
            />
          </Col> */}
          <Col lg="12">
            <div className="text-center">
              {type === "view" ? (
                <span className="mx-2">
                  <ClickButton
                    label={<>back</>}
                    onClick={() => navigate("/console/master/JewelRecovery")}
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
                        />
                      </span>
                      <span className="mx-2">
                        <ClickButton
                          label={<>cancel</>}
                          onClick={() =>
                            navigate("/console/master/JewelRecovery")
                          }
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
                        />
                      </span>
                      <span className="px-2">
                        <ClickButton
                          label={<> cancel</>}
                          onClick={() =>
                            navigate("/console/master/JewelRecovery")
                          }
                          disabled={loading}
                        />
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
          />
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserCreation;
