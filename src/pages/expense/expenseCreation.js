import React, { useState, useEffect } from "react";
import { Container, Col, Row, Form } from "react-bootstrap";
import { TextInputForm } from "../../components/Forms";
import { ClickButton ,Delete} from "../../components/ClickButton";
import { useNavigate, useLocation } from "react-router-dom";
import API_DOMAIN from "../../config/config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PageNav from "../../components/PageNav";

const ExpenseCreation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { type, rowData } = location.state || {};
  const[loading,setLoading] = useState(false);

  const [formData, setFormData] = useState({
    expense_name: "",
    amount: "",
    date: "",
    expense_type: "",
  });
  console.log(formData);
  useEffect(() => {
    if (type === "edit" && rowData) {
      setFormData(rowData);
    }
  }, [type, rowData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.expense_type) {
      toast.error("Please select a transaction type");
      return;
    }
   setLoading(true);
    try {
      const response = await fetch(`${API_DOMAIN}/expense.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: type === "edit" ? "update" : "create",
          ...formData,
        }),
      });
      console.log(
        JSON.stringify({
          action: type === "edit" ? "update" : "create",
          ...formData,
        })
      );
      const responseData = await response.json();
      if (responseData.head.code === 200) {
        toast.success(responseData.head.msg);
        setTimeout(() => navigate("/console/transaction"), 1000);
      } else {
        toast.error(responseData.head.msg);
        setLoading(false);
      }
    } catch (error) {
      toast.error("Something went wrong!");
      setLoading(false);
    }
  };

  return (
    <Container fluid>
      <Row>
        <Col lg="12" className="py-3">
          <PageNav
            pagetitle={
              type === "edit" ? "Edit Transaction" : "Create Transaction"
            }
          ></PageNav>
        </Col>
        <Col lg="3" md="12" xs="12" className="py-3">
          <TextInputForm
            placeholder="Transaction Name"
            name="Transaction Name"
            value={formData.expense_name}
            onChange={(e) =>
              setFormData({ ...formData, expense_name: e.target.value })
            }
          />
        </Col>
        <Col lg="3" md="12" xs="12" className="py-4 ">
          <Form.Group controlId="transactionType">
            {/* <Form.Label>Transaction Type</Form.Label> */}
            <Form.Select
              value={formData.expense_type}
              onChange={(e) =>
                setFormData({ ...formData, expense_type: e.target.value })
              }
            >
              <option value="">Select Transaction Type</option>
              <option value="credit">Credit</option>
              <option value="debit">Debit</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col lg="3" md="12" xs="12" className="py-3">
          <TextInputForm
            placeholder="Amount"
            name="amount"
            type="number"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
          />
        </Col>
        <Col lg="3" md="12" xs="12" className="py-3">
          <TextInputForm
            type="date"
            name="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
        </Col>
        <Col
          lg="12"
          className="py-3 text-center d-flex flex-row justify-content-end
           gap-3" // Added gap-3
        >
          <div className="d-flex justify-content-center">
            <ClickButton
              label={type === "edit" ?" Update" : "Submit"}
              onClick={handleSubmit}
              disabled = {loading}
            />
          </div>
          <div className="d-flex justify-content-center">
            <Delete
              label="Cancel"
              onClick={() => navigate("/console/transaction")}
            />
          </div>
        </Col>
      </Row>
      <ToastContainer />
    </Container>
  );
};

export default ExpenseCreation;
