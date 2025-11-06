import React, { useState, useEffect } from "react";
import { Col, Container, Row, Alert, Form } from "react-bootstrap";
import { TextInputForm } from "../../components/Forms";
import { ClickButton,Delete } from "../../components/ClickButton";
import PageNav from "../../components/PageNav";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import API_DOMAIN from "../../config/config";
import "react-toastify/dist/ReactToastify.css";

const ProductsCreation = () => {
  const location = useLocation();
  const { type, rowData } = location.state || {};
  const navigate = useNavigate();

  const initialState =
    type === "edit"
      ? { ...rowData, group_id: rowData.group_id || "" }
      : { product_eng: "", product_tam: "", group_id: "" };

  const [formData, setFormData] = useState(initialState);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchGroupData();
  }, []);

  const fetchGroupData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_DOMAIN}/group.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ search_text: "" }), // Fetch all groups by default
      });
      const responseData = await response.json();
      if (responseData.head.code === 200) {
        const groupArray = Array.isArray(responseData.body.group)
          ? responseData.body.group
          : [responseData.body.group];
        setGroups(groupArray);
      } else {
        toast.error(responseData.head.msg, {
          position: "top-center",
          autoClose: 2000,
          theme: "colored",
        });
      }
    } catch (err) {
      console.error("Error fetching groups:", err);
      setError("Failed to fetch group data.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e, fieldName) => {
    const value = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));

    if (fieldName === "product_eng") {
      fetchTamilTranslation(value);
    }
  };

  const fetchTamilTranslation = async (text) => {
    try {
      const response = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ta&dt=t&q=${encodeURIComponent(text)}`
      );
      const result = await response.json();
      const translatedText = result[0][0][0];
      setFormData((prevData) => ({
        ...prevData,
        product_tam: translatedText,
      }));
    } catch (error) {
      console.error("Error in translation:", error);
    }
  };

  const validateForm = () => {
    for (const key in formData) {
      if (formData[key] === "") {
        toast.error(`${key.replace("_", " ")} cannot be empty!`, {
          position: "top-center",
          autoClose: 2000,
          theme: "colored",
        });
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {

    if (!validateForm()) return;
setLoading(true);
    try {
      const response = await fetch(`${API_DOMAIN}/product.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();
      if (responseData.head.code === 200) {
        toast.success(responseData.head.msg, {
          position: "top-center",
          autoClose: 2000,
          theme: "colored",
        });
        setTimeout(() => navigate("/console/master/products"), 1000);
        setLoading(false);
      } else {
        toast.error(responseData.head.msg, {
          position: "top-center",
          autoClose: 2000,
          theme: "colored",
        });
        setLoading(false);
      }
    } catch (error) {
      console.error("Submission error:", error);
      setError("An error occurred while submitting the form.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);

    try {
      const response = await fetch(`${API_DOMAIN}/product.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          edit_product_id: rowData.product_id,
          ...formData,
        }),
      });

      const responseData = await response.json();
      if (responseData.head.code === 200) {
        toast.success(responseData.head.msg, {
          position: "top-center",
          autoClose: 2000,
          theme: "colored",
        });
        setTimeout(() => navigate("/console/master/products"), 1000);
      } else {
        toast.error(responseData.head.msg, {
          position: "top-center",
          autoClose: 2000,
          theme: "colored",
        });
      }
    } catch (error) {
      console.error("Update error:", error);
      setError("An error occurred while updating the form.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col lg="12" className="py-3">
          <PageNav
            pagetitle={`${type === "edit" ? "Edit Product" : "Create Product"}`}
          />
        </Col>

        <Col lg="4" md="6" xs="12" className="py-3">
          <TextInputForm
            placeholder="Product Name (English)"
            labelname="Product Name (English)"
            name="product_eng"
            value={formData.product_eng}
            onChange={(e) => handleChange(e, "product_eng")}
          />
        </Col>

        <Col lg="4" md="6" xs="12" className="py-3">
          <TextInputForm
            placeholder="Product Name (Tamil)"
            labelname="Product Name (Tamil)"
            name="product_tam"
            value={formData.product_tam}
            onChange={(e) => handleChange(e, "product_tam")}
            readOnly
          />
        </Col>

        <Col lg="4" md="6" xs="12" className="py-3">
          <Form.Group>
            <Form.Label>Group</Form.Label>
            <Form.Select
              value={formData.group_id}
              onChange={(e) => handleChange(e, "group_id")}
            >
              <option value="">Select Group</option>
              {groups.map((group) => (
                <option key={group.Group_id} value={group.Group_id}>
                  {group.Group_type}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
<Col
  lg="12"
  className="py-3 d-flex flex-row justify-content-end align-items-center"
  style={{ paddingRight: "50px", gap: "15px" }}
>

        {/* <Col
          lg="12"
          className="py-3 text-center d-flex flex-row justify-content-center gap-3"
        > */}
          {type === "edit" ? (
            <ClickButton label="Update" onClick={handleUpdateSubmit} disabled={loading} />
          ) : (
            <ClickButton 
            label={loading ? <>Submitting...</> : <> Submit</>}
            onClick={handleSubmit} 
            disabled={loading} />
          )}
          <Delete
            label="Cancel"
            onClick={() => navigate("/console/master/products")}
          />
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}
      <ToastContainer />
    </Container>
  );
};

export default ProductsCreation;
