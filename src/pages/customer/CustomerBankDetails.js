import React from "react";
import { Col, Container, Row, Table, Card, Button } from "react-bootstrap";
import PageNav from "../../components/PageNav";
import { useLocation, useNavigate } from "react-router-dom";
import { ClickButton } from "../../components/Buttons";
import { BiArrowBack } from "react-icons/bi";

const CustomerBankDetails = () => {
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();
  const { bankData = [], receiptNo = "", customerNo = "" } = state || {};

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const formatCurrency = (amount) => {
    return amount ? `₹${parseFloat(amount).toLocaleString("en-IN")}` : "₹0";
  };

  if (bankData.length === 0) {
    return (
      <Container>
        <Row className="justify-content-center mt-5">
          <Col md={6}>
            <Card className="text-center professional-card">
              <Card.Body>
                <Card.Title className="mb-3">
                  No Bank Details Available
                </Card.Title>
                <Card.Text className="mb-4">
                  No bank pledge records found for Receipt No: {receiptNo}.
                </Card.Text>
                <Button
                  variant="secondary"
                  onClick={() => navigate(-1)}
                  className="professional-btn"
                >
                  <BiArrowBack className="me-2" /> Back to Customer Details
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4 professional-container">
      <Row className="mb-4">
        <Col lg={12}>
          <PageNav pagetitle={`Bank Details for Receipt No: ${receiptNo}`} />
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <Card className="shadow-sm border-0 professional-card">
            <Card.Header>
              <h5 className="mb-0 fw-bold">
                Bank Pledge Summary - Customer No: {customerNo}
              </h5>
            </Card.Header>
            <Card.Body className="py-3">
              <div className="table-responsive">
                <Table
                  striped
                  bordered
                  hover
                  className="mb-0 professional-table"
                >
                  <thead className="table-dark">
                    <tr>
                      <th className="text-center fw-bold">S.No</th>
                      <th className="fw-bold">Bank Name</th>
                      <th className="fw-bold">Pledge Date</th>
                      <th className="fw-bold">Bank Loan No</th>
                      <th className="fw-bold text-success">Pawn Value</th>
                      <th className="fw-bold text-warning">
                        Interest Rate (%)
                      </th>
                      <th className="fw-bold">Duration (Months)</th>
                      <th className="fw-bold text-info">Interest Amount</th>
                      <th className="fw-bold">Pledge Due Date</th>
                      <th className="fw-bold">Additional Charges</th>
                      <th className="fw-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bankData.map((bank, idx) => {
                      const bankInfo =
                        JSON.parse(bank.bank_details || "[]")[0] || {};
                      const isOverdue =
                        bank.status === "Active" &&
                        new Date(bank.pledge_due_date) < new Date();
                      return (
                        <tr
                          key={idx}
                          className={
                            bank.status === "Closed"
                              ? "table-danger"
                              : isOverdue
                              ? "table-warning"
                              : "table-success"
                          }
                        >
                          <td className="text-center fw-bold professional-cell">
                            {idx + 1}
                          </td>
                          <td className="fw-semibold professional-cell">
                            {bankInfo.bank_name || "N/A"}
                          </td>
                          <td className="professional-cell">
                            {formatDate(bank.pledge_date)}
                          </td>
                          <td className="professional-cell">
                            {bank.bank_loan_no || "N/A"}
                          </td>
                          <td className="text-success fw-bold professional-cell">
                            {formatCurrency(bank.pawn_value)}
                          </td>
                          <td className="text-warning professional-cell">
                            {bank.interest_rate || "N/A"}%
                          </td>
                          <td className="professional-cell">
                            {bank.duration_month || "N/A"}
                          </td>
                          <td className="text-info professional-cell">
                            {formatCurrency(bank.interest_amount)}
                          </td>
                          <td
                            className={`professional-cell ${
                              isOverdue ? "text-danger fw-bold" : ""
                            }`}
                          >
                            {formatDate(bank.pledge_due_date)}
                          </td>
                          <td className="professional-cell">
                            {formatCurrency(bank.additional_charges)}
                          </td>
                          <td className="professional-cell">
                            <span
                              className={`badge fw-semibold ${
                                bank.status === "Closed"
                                  ? "bg-danger"
                                  : "bg-success"
                              }`}
                              style={{ fontSize: "0.85rem" }}
                            >
                              {bank.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
            <Card.Footer className="bg-light text-center professional-footer">
              <small className="text-muted fw-medium">
                Total Records: {bankData.length} | Showing all bank pledges for
                this receipt.
              </small>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col lg={12} className="text-center">
          <ClickButton
            label={
              <>
                <BiArrowBack className="me-2" /> Back to Customer Details
              </>
            }
            onClick={() => navigate(-1)}
            className="professional-btn"
          />
        </Col>
      </Row>
    </Container>
  );
};

export default CustomerBankDetails;
