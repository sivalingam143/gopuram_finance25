import React, { useState } from "react";
import { Col, Container, Row, Alert } from "react-bootstrap";
import { TextInputForm, Calender } from "../../components/Forms";
import { ClickButton,Delete } from "../../components/ClickButton";
import PageNav from "../../components/PageNav";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API_DOMAIN from "../../config/config";


const ActionCreation = () => {
  const location = useLocation();
  const { type, rowData } = location.state || {};
  const navigate = useNavigate();
  const [formData, setFormData] = useState(
    type === "edit"
      ? {
          action_id: rowData.action_id || "",
          action_date:
            rowData.action_date || new Date().toISOString().substr(0, 10),
          receipt_no: rowData.receipt_no || "",
          name: rowData.name || "",
          mobile_number: rowData.mobile_number || "",
          customer_details: rowData.customer_details || "",
          place: rowData.place || "",
          original_amount: rowData.original_amount || "",
          jewel_product: Array.isArray(rowData.jewel_product)
            ? rowData.jewel_product
            : JSON.parse(rowData.jewel_product || "[]"),
        }
      : {
          action_date: new Date().toISOString().substr(0, 10),
          receipt_no: "",
          name: "",
          mobile_number: "",
          customer_details: "",
          place: "",
          original_amount: "",
          jewel_product: [],
        }
  );
  console.log(formData);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [pawnSuggestions, setPawnSuggestions] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchMobile, setSearchMobile] = useState("");
  const [searchReceiptNo, setSearchReceiptNo] = useState("");

  const handleChange = (e, field) => {
    const { value } = e.target;
    let updatedFormData = { ...formData, [field]: value };

    if (["name", "mobile_number"].includes(field)) {
      if (field === "name") setSearchName(value);
      if (field === "mobile_number") setSearchMobile(value);

      if (value.length >= 2) {
        fetchPawnJewelry(value, field).then((pawnJewelry) => {
          setPawnSuggestions(pawnJewelry);
        });
      } else {
        setPawnSuggestions([]);
      }
    }

    setFormData(updatedFormData);
  };

  const handleSearchReceiptNo = (e) => {
    const value = e.target.value;
    setSearchReceiptNo(value);

    setFormData({ ...formData, receipt_no: value });

    if (value.length === 0) {
      setFormData({
        ...formData,
        receipt_no: "",
        name: "",
        mobile_number: "",
        customer_details: "",
        place: "",
        original_amount: "",
        jewel_product: [],
      });
      setPawnSuggestions([]);
    } else if (value.length >= 2) {
      fetchPawnJewelry(value, "receipt_no").then((pawnJewelry) => {
        const matchedData = pawnJewelry.find(
          (item) => item.receipt_no.toString() === value
        );
        if (matchedData) {
          setFormData({
            ...formData,
            receipt_no: matchedData.receipt_no || "",
            name: matchedData.name || "",
            mobile_number: matchedData.mobile_number || "",
            customer_details: matchedData.customer_details || "",
            place: matchedData.place || "",
            original_amount: matchedData.original_amount || "",
            jewel_product: Array.isArray(matchedData.jewel_product)
              ? matchedData.jewel_product
              : JSON.parse(matchedData.jewel_product || "[]"),
          });
        } else {
          setFormData({
            ...formData,
            receipt_no: value,
            name: "",
            mobile_number: "",
            customer_details: "",
            place: "",
            original_amount: "",
            jewel_product: [],
          });
          setPawnSuggestions([]);
        }
      });
    } else {
      setFormData({
        ...formData,
        receipt_no: value,
        name: "",
        mobile_number: "",
        customer_details: "",
        place: "",
        original_amount: "",
        jewel_product: [],
      });
      setPawnSuggestions([]);
    }
  };

  const handlePawnSelect = (pawn) => {
    setFormData({
      ...formData,
      receipt_no: pawn.receipt_no || "",
      name: pawn.name || "",
      mobile_number: pawn.mobile_number || "",
      customer_details: pawn.customer_details || "",
      place: pawn.place || "",
      original_amount: pawn.original_amount || "",
      jewel_product: Array.isArray(pawn.jewel_product)
        ? pawn.jewel_product
        : JSON.parse(pawn.jewel_product || "[]"),
    });
    setSearchName("");
    setSearchMobile("");
    setPawnSuggestions([]);
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

  const fetchPawnJewelry = async (searchText, searchField = "receipt_no") => {
    try {
      const response = await fetch(`${API_DOMAIN}/pawnjewelry.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          search_text: searchText,
          search_field: searchField,
        }),
      });

      const responseData = await response.json();
      if (responseData.head.code === 200) {
        const pawnJewelry = responseData.body.pawnjewelry || [];
        setPawnSuggestions(pawnJewelry);
        return pawnJewelry;
      } else {
        throw new Error(responseData.head.msg);
      }
    } catch (error) {
      console.error("Error fetching pawn jewelry data:", error.message);
      return [];
    }
  };

  const handleSubmit = async () => {
    if (
      !formData.action_date ||
      !formData.receipt_no ||
      !formData.name ||
      !formData.mobile_number
    ) {
      toast.error("Please fill in all required fields.", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_DOMAIN}/action.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action_date: formData.action_date,
          receipt_no: formData.receipt_no,
          name: formData.name,
          customer_details: formData.customer_details || "",
          place: formData.place || "",
          original_amount: formData.original_amount || "",
          mobile_number: formData.mobile_number,
          jewel_product: JSON.stringify(formData.jewel_product || []),
        }),
      });

      const responseData = await response.json();
      console.log(responseData);
      setLoading(false);
      if (responseData.head.code === 200) {
        toast.success(responseData.head.msg, {
          position: "top-center",
          autoClose: 2000,
        });
        setTimeout(() => {
          navigate("/console/master/action");
        }, 1000);
      } else {
        toast.error(responseData.head.msg, {
          position: "top-center",
          autoClose: 2000,
        });
      }
    } catch (error) {
      setLoading(false);
      console.error("Error submitting data:", error);
      toast.error("Failed to submit data. Please try again.", {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };

  const handleUpdateSubmit = async () => {
    if (
      !formData.action_date ||
      !formData.receipt_no ||
      !formData.name ||
      !formData.mobile_number
    ) {
      toast.error("Please fill in all required fields.", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_DOMAIN}/action.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          edit_action_id: formData.action_id,
          action_date: formData.action_date,
          receipt_no: formData.receipt_no,
          name: formData.name,
          customer_details: formData.customer_details || "",
          place: formData.place || "",
          original_amount: formData.original_amount || "",
          mobile_number: formData.mobile_number,
          jewel_product: JSON.stringify(formData.jewel_product || []),
        }),
      });

      const responseData = await response.json();
      setLoading(false);
      if (responseData.head.code === 200) {
        toast.success(responseData.head.msg, {
          position: "top-center",
          autoClose: 2000,
        });
        setTimeout(() => {
          navigate("/console/master/action");
        }, 2000);
      } else {
        toast.error(responseData.head.msg, {
          position: "top-center",
          autoClose: 2000,
        });
      }
    } catch (error) {
      setLoading(false);
      console.error("Error updating data:", error);
      toast.error("Failed to update data. Please try again.", {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };

  return (
    <div>
      <Container fluid>
        <Row className="regular">
          <Col lg="12" md="6" xs="12" className="py-3">
            <PageNav
              pagetitle={`Action${type === "edit" ? " Edit" : " Creation"}`}
            />
          </Col>
          <Col lg="3" md="4" xs="12" className="py-3">
            <Calender
              setLabel={(date) => setLabel(date, "action_date")}
              initialDate={type === "edit" ? formData.action_date : undefined}
              calenderlabel="Action Date"
              disabled={type === "view"}
            />
          </Col>
          <Col lg="3" md="4" xs="12" className="py-3">
            <TextInputForm
              placeholder={"Receipt No"}
              labelname={"Receipt No"}
              name="receipt_no"
              value={formData.receipt_no}
              onChange={handleSearchReceiptNo}
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
            {pawnSuggestions.length > 0 && searchName && (
              <ul
                style={{
                  position: "absolute",
                  zIndex: 1000,
                  backgroundColor: "#fff",
                  border: "1px solid #ccc",
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  maxHeight: "200px",
                  overflowY: "auto",
                  width: "100%",
                }}
              >
                {pawnSuggestions.map((pawn) => (
                  <li
                    key={pawn.receipt_no}
                    onClick={() => handlePawnSelect(pawn)}
                    style={{
                      padding: "8px",
                      cursor: "pointer",
                      borderBottom: "1px solid #eee",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = "#f0f0f0")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "#fff")
                    }
                  >
                    {pawn.name} ({pawn.mobile_number})
                  </li>
                ))}
              </ul>
            )}
          </Col>
          <Col lg="3" md="4" xs="12" className="py-3">
            <TextInputForm
              placeholder={"Mobile Number"}
              labelname={"Mobile Number"}
              name="mobile_number"
              value={formData.mobile_number}
              onChange={(e) => handleChange(e, "mobile_number")}
            />
            {pawnSuggestions.length > 0 && searchMobile && (
              <ul
                style={{
                  position: "absolute",
                  zIndex: 1000,
                  backgroundColor: "#fff",
                  border: "1px solid #ccc",
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  maxHeight: "200px",
                  overflowY: "auto",
                  width: "100%",
                }}
              >
                {pawnSuggestions.map((pawn) => (
                  <li
                    key={pawn.receipt_no}
                    onClick={() => handlePawnSelect(pawn)}
                    style={{
                      padding: "8px",
                      cursor: "pointer",
                      borderBottom: "1px solid #eee",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = "#f0f0f0")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "#fff")
                    }
                  >
                    {pawn.name} ({pawn.mobile_number})
                  </li>
                ))}
              </ul>
            )}
          </Col>
          {formData.jewel_product && formData.jewel_product.length > 0 && (
            <Col lg="12" md="12" xs="12" className="py-3">
              <table className="table table-bordered mx-auto">
                <thead>
                  <tr>
                    <th style={{ width: "10%" }}>S.No</th>
                    <th style={{ width: "20%" }}>நகை பெயர்</th>
                    <th style={{ width: "10%" }}>தரம்</th>
                    <th style={{ width: "10%" }}>எண்ணிக்கை</th>
                    <th style={{ width: "10%" }}>மொத்த எடை</th>
                    <th style={{ width: "10%" }}>நிகர எடை</th>
                    <th style={{ width: "20%" }}>குறிப்பு</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.jewel_product.map((row, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{row.JewelName || ""}</td>
                      <td>{row.carrat || ""}</td>
                      <td>{row.count || ""}</td>
                      <td>{row.weight || ""}</td>
                      <td>{row.net || ""}</td>
                      <td>{row.remark || ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Col>
          )}
          <Col lg="12">
           <div style={{ textAlign: "right", paddingRight: "5px" }}>
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
                    <Delete
                      label={<>Cancel</>}
                      onClick={() => navigate("/console/master/action")}
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
                      label={loading ? <>Submitting...</> : <>Submit</>}
                      onClick={handleSubmit}
                      disabled={loading}
                    />
                  </span>
                  <span className="px-2">
                    <Delete
                      label={<>Cancel</>}
                      onClick={() => navigate("/console/master/action")}
                      disabled={loading}
                    />
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
    </div>
  );
};

export default ActionCreation;
