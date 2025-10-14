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
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { MdDeleteForever } from "react-icons/md";
import { Delete } from "../../components/ClickButton";
dayjs.extend(duration);

const UserCreation = () => {
  const location = useLocation();
  const { type, rowData } = location.state || {};
  const today = new Date();
  const defaultDate = today.toISOString().substr(0, 10);
  console.log("type", type);
  const initialState =
    type === "edit"
      ? {
          ...rowData,
          total_pawn_interest_amount: rowData.pawn_interest_total_amount,
          total_income_amount: rowData.extra_total_amount,
          total_bal_amount: rowData.extra_balance_amount,
          group: rowData.group,
        }
      : {
          pawnjewelry_recovery_id: "",
          pawnjewelry_date: "",
          pawnjewelry_id: "",
          recipt_no: "",
          customer_name: "",
          name_of_guardians: "",
          mobile_number: "",
          address: "",
          group: "",
          jewel_original_rate: "",
          pawn_rate: "",
          pawn_interest: "",
          pawn_interest_amount: "",
          total_pawn_interest_amount: "",
          total_income_amount: "",
          total_bal_amount: "",
          pawnjewelry_recovery_date: defaultDate,
          remark_pawn_recovery: "",
          jewel_product: [{ JewelName: "", weight: "", count: "" }],
          paidby: "",
        };
  const [formData, setFormData] = useState(initialState);
  const [grupData, setGroupData] = useState([]);
  const [userData, setuserData] = useState([]);

  console.log("formData", formData);

  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();
  const fetchuser = async () => {
    try {
      const response = await fetch(`${API_DOMAIN}/users.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          search_text: "",
        }),
      });

      const responseData = await response.json();

      setLoading(false);
      if (responseData.head.code === 200) {
        const user = JSON.parse(localStorage.getItem("user"));

        let sortedData = responseData.body.user;
        if (user && user.role === "பணியாளர்") {
          sortedData = Array.isArray(sortedData)
            ? sortedData.filter((user) => user.RoleSelection === "பணியாளர்")
            : sortedData.RoleSelection === "பணியாளர்"
            ? [sortedData]
            : [];
        }
        setuserData(Array.isArray(sortedData) ? sortedData : [sortedData]);
      } else {
        throw new Error(responseData.head.msg);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error.message);
    }
  };
  useEffect(() => {
    if (formData.recipt_no) {
      fetchDatapawnjewelry(formData.recipt_no);
    }
  }, [formData.recipt_no]);
  useEffect(() => {
    fetchuser();
  }, []);
  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const response = await fetch(`${API_DOMAIN}/group.php`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ search_text: "" }),
        });
        const responseData = await response.json();
        if (responseData.head.code === 200) {
          const sortedData = Array.isArray(responseData.body.group)
            ? responseData.body.group
            : [responseData.body.group];
          setGroupData(sortedData);
        } else {
          throw new Error(responseData.head.msg);
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchGroupData();
  }, []);

  useEffect(() => {
    if (formData.recipt_no) {
      fetchPawnJewelryRecoveryData(formData.recipt_no);
    }
  }, [formData.recipt_no]);
  const parseDate = (dateString) => {
    const [datePart, timePart] = dateString.split(" ");
    const [year, month, day] = datePart.split("-").map(Number);
    return new Date(year, month - 1, day);
  };
  const calculateMonthDifference = (startDate, endDate) => {
    const start = parseDate(startDate);
    const end = parseDate(endDate);

    const yearsDifference = end.getFullYear() - start.getFullYear();
    const monthsDifference = end.getMonth() - start.getMonth();
    const totalMonths = yearsDifference * 12 + monthsDifference;

    return totalMonths;
  };
  const [monthDifference, setMonthDifference] = useState(0);
  const fetchPawnJewelryRecoveryData = async (receiptNo) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_DOMAIN}/pawnrecovery.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recipt_no: receiptNo }),
      });

      const responseData = await response.json();
      if (responseData.head.code === 200) {
        const sortedData = responseData.body.pawnjewelry;

        console.log("sortedData", sortedData);

        const monthDiff = calculateMonthDifference(
          sortedData.pawnjewelry_date,
          sortedData.pawnjewelry_recovery_finshed_date
        );
        console.log("monthDiff", monthDiff);
        const totaldiff = monthDiff - 1;
        const totalinterestamt = totaldiff * sortedData.pawn_interest_amount;
        console.log("totalinterestamt", totalinterestamt);

        if (sortedData) {
          setFormData({
            ...formData,
            ...sortedData,
            pawn_interest_amount: sortedData.pawn_interest_amount,
            pawnjewelry_date: sortedData.pawnjewelry_date,
            // total_pawn_interest_amount: sortedData.interest_totals && sortedData.interest_totals.total_pawn_interest_amount !== undefined
            //     ? sortedData.interest_totals.total_pawn_interest_amount
            //     : sortedData.pawn_interest_total_amount,
            total_pawn_interest_amount: totalinterestamt,
            total_income_amount:
              sortedData.interest_totals &&
              sortedData.interest_totals.total_extra_amount !== undefined
                ? sortedData.interest_totals.total_extra_amount
                : sortedData.extra_total_amount,
            total_bal_amount:
              sortedData.interest_totals &&
              sortedData.interest_totals.extra_balance_amount !== undefined
                ? sortedData.interest_totals.extra_balance_amount
                : sortedData.extra_balance_amount,
            jewel_product: Array.isArray(sortedData.jewel_product)
              ? sortedData.jewel_product
              : JSON.parse(sortedData.jewel_product),
          });
        }
      } else {
        throw new Error(responseData.head.msg);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    } finally {
      setLoading(false);
    }
  };
  const redirectModal = () => {
    navigate("/console/master/jewelrecoveryg");
  };

  const handleChange = (e, fieldName, rowIndex) => {
    const value = e.target ? e.target.value : e.value;

    let updatedFormData = { ...formData };

    if (rowIndex !== undefined) {
      // If rowIndex is defined, it means we are updating a table row
      updatedFormData = {
        ...formData,
        jewel_product: formData.jewel_product.map((row, index) =>
          index === rowIndex ? { ...row, [fieldName]: value } : row
        ),
      };
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

    if (label === "pawnjewelry_recovery_date" || label === "ToDate") {
      setFormData((prevData) => ({
        ...prevData,
        [label]: dateString, // Set the 'pawnjewelry_recovery_date' or 'ToDate' field in formData
      }));
    }
  };
  const handleKeyPress = (event, index) => {
    if (event.key === "Enter") {
      if (
        formData.jewel_product[index].JewelName &&
        formData.jewel_product[index].weight
      ) {
        handleAddRow();
      } else {
        toast.error(
          "Please fill in both JewelName and weight before adding a new row"
        );
      }
    }
  };

  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleSubmit = async () => {
    setLoading(true);
    try {
      console.log("FormData being submitted:", formData);

      const response = await fetch(`${API_DOMAIN}/pawnrecovery.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pawnjewelry_recovery_id: formData.pawnjewelry_recovery_id || "",
          pawnjewelry_id: formData.pawnjewelry_id,
          pawnjewelry_recovery_date: formData.pawnjewelry_recovery_date,
          jewel_product: formData.jewel_product,
          customer_name: formData.customer_name,
          name_of_guardians: formData.name_of_guardians,
          mobile_number: formData.mobile_number,
          address: formData.address,
          group_id: formData.group,
          jewel_original_rate: formData.jewel_original_rate,
          pawn_rate: formData.pawn_rate,
          pawn_interest: formData.pawn_interest,
          total_pawn_interest_amount: formData.total_pawn_interest_amount,
          total_income_amount: formData.total_income_amount,
          total_bal_amount: formData.total_bal_amount,
          remark_pawn_recovery: formData.remark_pawn_recovery,
          recipt_no: formData.recipt_no,
          pawnjewelry_recovery_finshed_date:
            formData.pawnjewelry_recovery_finshed_date,
          paidby: formData.paidby,
        }),
      });

      console.log(
        "Request body:",
        JSON.stringify({
          pawnjewelry_recovery_id: formData.pawnjewelry_recovery_id || "",
          pawnjewelry_id: formData.pawnjewelry_id,
          pawnjewelry_recovery_date: formData.pawnjewelry_recovery_date,
          jewel_product: formData.jewel_product,
          customer_name: formData.customer_name,
          name_of_guardians: formData.name_of_guardians,
          mobile_number: formData.mobile_number,
          address: formData.address,
          group_id: formData.group,
          jewel_original_rate: formData.jewel_original_rate,
          pawn_rate: formData.pawn_rate,
          pawn_interest: formData.pawn_interest,
          total_pawn_interest_amount: formData.total_pawn_interest_amount,
          total_income_amount: formData.total_income_amount,
          total_bal_amount: formData.total_bal_amount,
          remark_pawn_recovery: formData.remark_pawn_recovery,
          recipt_no: formData.recipt_no,
        })
      );

      console.log("Response status:", response.status);
      const responseData = await response.json();

      console.log("Response data:", responseData);

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
          navigate("/console/master/jewelrecoveryg");
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
      setError("An error occurred while submitting the form.");
      setLoading(false);
    }
  };
  const fetchDatapawnjewelry = async (receiptNo) => {
    try {
      const response = await fetch(`${API_DOMAIN}/pawnjewelry.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          search_text: receiptNo,
        }),
      });

      const responseData = await response.json();
      console.log("responseDatapawn", responseData);
      setLoading(false);
      if (responseData.head.code === 200) {
        let sortedData = responseData.body.pawnjewelry.map((user) => ({
          ...user,
          jewel_product: JSON.parse(user.jewel_product || "[]"), // Ensure jewel_product is an array
        }));
        if (sortedData.length > 0) {
          console.log("sortedData", sortedData);
          setFormData({
            ...formData,
            pawnjewelry_id: sortedData[0].pawnjewelry_id,
            customer_name: sortedData[0].customer_name,
            name_of_guardians: sortedData[0].name_of_guardians,
            mobile_number: sortedData[0].mobile_number,
            address: sortedData[0].address,
            group: sortedData[0].group,
            jewel_original_rate: sortedData[0].jewel_original_rate,
            pawn_rate: sortedData[0].pawn_rate,
            pawn_interest: sortedData[0].pawn_interest,
            pawn_interest_amount: sortedData[0].pawn_interest_amount,
            jewel_product: sortedData[0].jewel_product,
            pawnjewelry_date: sortedData[0].pawnjewelry_date,
          });
        }
      } else {
        alert("Receipt number does not match the fetched data.");
        // Optionally clear formData or set default values
        setFormData({
          pawnjewelry_id: "",
          customer_name: "",
          name_of_guardians: "",
          mobile_number: "",
          address: "",
          group: "",
          jewel_original_rate: "",
          pawn_rate: "",
          pawn_interest: "",
          pawn_interest_amount: "",
          pawnjewelry_date: "",
          remark_pawn_recovery: "",
          jewel_product: [{ JewelName: "", weight: "", count: "" }],
        });
        throw new Error(responseData.head.msg);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error.message);
    }
  };

  const handleUpdateSubmit = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${API_DOMAIN}/pawnrecovery.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pawnjewelry_recovery_id: formData.pawnjewelry_recovery_id || "",
          pawnjewelry_id: formData.pawnjewelry_id,
          pawnjewelry_recovery_date: formData.pawnjewelry_recovery_date,
          jewel_product: formData.jewel_product,
          customer_name: formData.customer_name,
          name_of_guardians: formData.name_of_guardians,
          mobile_number: formData.mobile_number,
          address: formData.address,
          group_id: formData.group,
          jewel_original_rate: formData.jewel_original_rate,
          pawn_rate: formData.pawn_rate,
          pawn_interest: formData.pawn_interest,
          total_pawn_interest_amount: formData.total_pawn_interest_amount,
          total_income_amount: formData.total_income_amount,
          total_bal_amount: formData.total_bal_amount,
          remark_pawn_recovery: formData.remark_pawn_recovery,
          recipt_no: formData.recipt_no,
          paidby: formData.paidby,
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
          navigate("/console/master/jewelrecoveryg");
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
  const [formDataList, setFormDataList] = useState([]);

  //   useEffect(() => {
  //     const monthDiff = calculateMonthDifference(formData.pawnjewelry_date, formData.pawnjewelry_recovery_date);
  //     setMonthDifference(monthDiff);
  //     console.log('monthDiff',monthDiff);
  //     var totaldiff = monthDiff - 1;
  //     var totalinterestamt = totaldiff * formData.pawn_interest_amount;
  //     console.log('totalinterestamt',totalinterestamt);
  //     setFormData({
  //         ...formData,
  //         total_pawn_interest_amount: totalinterestamt,
  //     });
  //   }, [formData]);

  console.log("monthDifference", monthDifference);
  return (
    <div>
      <Container>
        <Row className="regular">
          <Col lg="12" md="12" xs="12" className="py-3">
            <PageNav
              pagetitle={`நகை மீட்பு${
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
              setLabel={(date) => setLabel(date, "pawnjewelry_date")}
              initialDate={formData.pawnjewelry_date}
              calenderlabel="நகை அடகு வைத்த தேதி"
              disabled
            />
          </Col>

          <Col lg="4" md="6" xs="12" className="py-3">
            <TextInputForm
              placeholder={"ரசீது எண்"}
              labelname={"ரசீது எண்"}
              name="recipt_no"
              value={formData.recipt_no}
              onChange={(e) => handleChange(e, "recipt_no")}
            ></TextInputForm>
          </Col>
          <Col lg="4" md="6" xs="12" className="py-3">
            <TextInputForm
              placeholder={"வாடிக்கையாளர் பெயர்"}
              labelname={"வாடிக்கையாளர் பெயர்"}
              name="customer_name"
              value={formData.customer_name}
              onChange={(e) => handleChange(e, "customer_name")}
              disabled={true}
            ></TextInputForm>
          </Col>
          <Col lg="4" md="6" xs="12" className="py-3">
            <TextInputForm
              placeholder={"தந்தை அல்லது கணவர் பெயர்"}
              labelname={"தந்தை அல்லது கணவர் பெயர்"}
              name="name_of_guardians"
              value={formData.name_of_guardians}
              onChange={(e) => handleChange(e, "name_of_guardians")}
              disabled={true}
            ></TextInputForm>
          </Col>
          <Col lg="4" md="6" xs="12" className="py-3">
            <TextInputForm
              placeholder={"கைபேசி எண்"}
              labelname={"கைபேசி எண்"}
              name="mobile_number"
              value={formData.mobile_number}
              onChange={(e) => handleChange(e, "mobile_number")}
              disabled={true}
            />
          </Col>
          <Col lg="4" md="6" xs="12" className="py-3">
            <TextInputForm
              placeholder={"முகவரி"}
              labelname={"முகவரி"}
              name="address"
              value={formData.address}
              onChange={(e) => handleChange(e, "address")}
              disabled={true}
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
              disabled={true}
            ></TextInputForm>
          </Col>
          <Col lg="4" md="6" xs="12" className="py-3">
            <TextInputForm
              placeholder={"அடகு விலை"}
              labelname={"அடகு விலை"}
              name="Pawning Price"
              value={formData.pawn_rate}
              onChange={(e) => handleChange(e, "pawn_rate")}
              disabled={true}
            ></TextInputForm>
          </Col>
          <Col lg="4" md="6" xs="12" className="py-3">
            <TextInputForm
              placeholder={"வட்டி விகிதம்"}
              labelname={"வட்டி விகிதம்"}
              name="pawn_interest"
              value={formData.pawn_interest}
              onChange={(e) => handleChange(e, "pawn_interest")}
              disabled={true}
            ></TextInputForm>
          </Col>
          <Col lg="4" md="6" xs="12" className="py-3">
            <TextInputForm
              placeholder={"மொத்த வட்டி தொகை"}
              labelname={"மொத்த வட்டி தொகை"}
              name="total_pawn_interest_amount"
              value={formData.total_pawn_interest_amount}
              onChange={(e) => handleChange(e, "total_pawn_interest_amount")}
              disabled={true}
            ></TextInputForm>
          </Col>
          <Col lg="4" md="6" xs="12" className="py-3">
            <TextInputForm
              placeholder={"வரவு தொகை"}
              labelname={"வரவு  தொகை"}
              name="total_income_amount"
              value={formData.total_income_amount}
              onChange={(e) => handleChange(e, "total_income_amount")}
              disabled={true}
            ></TextInputForm>
          </Col>
          <Col lg="4" md="6" xs="12" className="py-3">
            <TextInputForm
              placeholder={"மீதி தொகை"}
              labelname={"மீதி  தொகை"}
              name="total_bal_amount"
              value={formData.total_bal_amount}
              onChange={(e) => handleChange(e, "total_bal_amount")}
              disabled={true}
            ></TextInputForm>
          </Col>
          {/* <Col lg="3" md="4" xs="12" className="py-3">
            <Calender
              setLabel={(date) =>
                setLabel(date, "pawnjewelry_recovery_finshed_date")
              }
              initialDate={
                type === "edit"
                  ? formData.pawnjewelry_recovery_finshed_date
                  : undefined
              }
              calenderlabel="நகை மீட்ட தேதி "
            />
          </Col> */}
          <Col lg="3" md="4" xs="12" className="py-3">
            <DropDownUI
              optionlist={userData.map((user) => ({
                value: user.nickname,
                label: user.nickname,
              }))}
              placeholder={"Paid By"}
              labelname={"Paid By"}
              name="paidby"
              value={formData.paidby}
              onChange={(updatedFormData) =>
                setFormData({ ...formData, paidby: updatedFormData.paidby })
              }
            ></DropDownUI>
          </Col>
          <Col lg="4" md="6" xs="12" className="py-3">
            <Calender
              setLabel={(date) => setLabel(date, "pawnjewelry_recovery_date")}
              initialDate={
                type === "edit" ? formData.pawnjewelry_recovery_date : undefined
              }
              calenderlabel="நகை மீட்பு தேதி"
              disabled={type === "view" || type === "edit"}
            />
          </Col>

          <Col lg="12" className="align-self-center py-3">
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

          <Col lg="12">
            <div className="text-center">
              {type === "view" ? (
                <span className="mx-2">
                  <ClickButton
                    label={<>back</>}
                    onClick={() => navigate("/console/master/JewelRecoveryg")}
                  />
                </span>
              ) : (
                <>
                  <Col lg="12" md="6" xs="12">
                    <table className="table  mx-auto">
                      <thead>
                        <tr>
                          <th>S.no</th>
                          <th className="w-50">நகை பெயர்</th>
                          <th className="w-8">எண்ணிக்கை</th>
                          <th className="w-8">தரம்</th>
                          <th>எடை</th>
                          <th>குறிப்பு</th>
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
                              <td className="w-50">
                                <textarea
                                  className="form-cntrl w-100 "
                                  value={row.JewelName}
                                  onChange={(e) =>
                                    handleChange(e, "JewelName", index)
                                  }
                                  onKeyDown={(e) => handleKeyPress(e, index)}
                                  autoFocus={
                                    index === formData.jewel_product.length - 1
                                  }
                                  disabled
                                />
                              </td>
                              <td className="w-8">
                                <textarea
                                  className="form-cntrl w-75 "
                                  value={row.count}
                                  onChange={(e) =>
                                    handleChange(e, "count", index)
                                  }
                                  onKeyDown={(e) => handleKeyPress(e, index)}
                                  disabled
                                />
                              </td>
                              <td className="w-8">
                                <textarea
                                  className="form-cntrl w-100 "
                                  value={row.qlty}
                                  onChange={(e) =>
                                    handleChange(e, "qlty", index)
                                  }
                                  onKeyDown={(e) => handleKeyPress(e, index)}
                                  disabled
                                />
                              </td>
                              <td className="w-8">
                                <textarea
                                  className="form-cntrl w-100 "
                                  value={row.weight}
                                  onChange={(e) =>
                                    handleChange(e, "weight", index)
                                  }
                                  onKeyDown={(e) => handleKeyPress(e, index)}
                                  disabled
                                />
                              </td>
                              <td className="w-50">
                                <textarea
                                  className="form-cntrl w-100"
                                  value={row.remark}
                                  onChange={(e) =>
                                    handleChange(e, "remark", index)
                                  }
                                  onKeyDown={(e) => handleKeyPress(e, index)}
                                  disabled
                                />
                              </td>
                              <td>
                                <div className="d-none">
                                  {index ===
                                    formData.jewel_product.length - 1 && (
                                    <ClickButton
                                      label={<>Add More</>}
                                      onClick={handleAddRow}
                                    />
                                  )}
                                </div>
                              </td>
                              <td>
                                <Delete
                                  onClick={() => handleDeleteRow(index)}
                                  label={<MdDeleteForever />}
                                ></Delete>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </Col>
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
                          label={<>cancle</>}
                          onClick={() =>
                            navigate("/console/master/JewelRecoveryg")
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
                        ></ClickButton>
                      </span>
                      <span className="px-2">
                        <ClickButton
                          label={<> Cancle</>}
                          onClick={() =>
                            navigate("/console/master/JewelRecoveryg")
                          }
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
        {formDataList.length > 0 && (
          <Row className="regular mt-5">
            <Col>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Receipt No</th>
                    <th>customer_name</th>
                    <th> address</th>
                    <th> PhoneNo</th>
                    <th>pawnjewelry_recovery_date</th>
                    <th>ToDate</th>
                  </tr>
                </thead>
                <tbody>
                  {formDataList.map((data, index) => (
                    <tr key={index}>
                      <td>{data.recipt_no}</td>
                      <td>{data.customer_name}</td>
                      <td>{data.address}</td>
                      <td>{data.PhoneNo}</td>
                      <td>{data.pawnjewelry_recovery_date}</td>
                      <td>{data.ToDate}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          </Row>
        )}
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
            src={require("../components/sidebar/images/output-onlinegiftools.gif")}
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
