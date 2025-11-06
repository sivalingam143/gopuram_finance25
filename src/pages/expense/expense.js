import React, { useState, useEffect } from "react";
import { Container, Col, Row } from "react-bootstrap";
import TableUI from "../../components/Table";
import { TextInputForm } from "../../components/Forms";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { ClickButton } from "../../components/ClickButton";
import { useNavigate } from "react-router-dom";
import API_DOMAIN from "../../config/config";
import LoadingOverlay from "../../components/LoadingOverlay";

const ExpenseEntry = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(false);

  const TableHeaders = ["No", "Date", "Transaction Name","Transaction Type", "Amount", "Action"];

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_DOMAIN}/expense.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "list", search_text: searchText }),
      });
      const responseData = await response.json();
      console.log(responseData,'siva');
      
      if (responseData.head.code === 200) {
        console.log('siva');
        setExpenseData(responseData.body.expenses || []);
        setLoading(false);
      } else {
        console.error("Error fetching data:", responseData.head.msg);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchText]);

  const handleDelete = async (expense_id) => {
    try {
      const response = await fetch(`${API_DOMAIN}/expense.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", expense_id }),
      });
      const responseData = await response.json();
      if (responseData.head.code === 200) {
        fetchData();
      } else {
        console.error("Error:", responseData.head.msg);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Container fluid>
      <Row>
        <Col lg="7" md="6" xs="6">
          <div className="page-nav py-3">
            <span className="nav-list">Transaction Entries</span>
          </div>
        </Col>
        <Col lg="5" md="6" xs="6" className="align-self-center text-end">
  <ClickButton
    label="Add Transaction"
    onClick={() => navigate("/console/transaction/create")}
    style={{
      backgroundColor: "#041a3b",
      color: "white",
      border: "none",
      borderRadius: "8px",
      padding: "8px 18px",
      fontWeight: "500",
      boxShadow: "0px 2px 6px rgba(0,0,0,0.2)",
    }}
  />
</Col>

        <Col lg="3" md="5" xs="12" className="py-1" style={{ marginLeft: "-10px" }}>
          <TextInputForm
            placeholder={"Search Transaction"}
            onChange={(e) => setSearchText(e.target.value)}
            prefix_icon={<FaMagnifyingGlass />}
          />
        </Col>
            {loading ? (
        <LoadingOverlay isLoading={loading} />
        ) : (
          <>
        <Col lg="12" md="12" xs="12" className="px-0">
          <TableUI
            headers={TableHeaders}
            body={expenseData}
            type ="expenseTable"
            pageview={"yes"}
          />
        </Col>
        </>
        )}
      </Row>
    </Container>
  );
};

export default ExpenseEntry;
