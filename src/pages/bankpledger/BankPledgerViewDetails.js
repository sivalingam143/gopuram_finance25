import React, { useState, useEffect } from "react";
import { Container, Col, Row } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import TableUI from "../../components/Table";
import { TextInputForm } from "../../components/Forms";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { ClickButton } from "../../components/ClickButton";
import LoadingOverlay from "../../components/LoadingOverlay";

const BankPledgerViewDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { records = [], loanNo } = location.state || {};
  const [filteredRecords, setFilteredRecords] = useState(records);
  const [detailsSearchText, setDetailsSearchText] = useState("");
  const [loading, setLoading] = useState(false); // If needed for future

  const UserTablehead = [
    "No",
    "Name",
    "Mobile No",
    "Bank Loan No",
    "Pawn Value",
    "Status",
    "Due Days",
    "Action",
  ];

  useEffect(() => {
    // Filter by name on search change
    if (detailsSearchText) {
      const filtered = records.filter((record) =>
        String(record.name || "")
          .toLowerCase()
          .includes(detailsSearchText.toLowerCase())
      );
      setFilteredRecords(filtered);
    } else {
      setFilteredRecords([...records]);
    }
  }, [detailsSearchText, records]);

  const handleDetailsSearch = (value) => {
    setDetailsSearchText(value);
  };

  const handleBack = () => {
    navigate("/console/master/bankpledger");
  };

  if (!records || records.length === 0) {
    return (
      <div>
        <Container fluid>
          <Row>
            <Col lg="12">
              <div className="page-nav py-3">
                <span className="nav-list">Bank Pledger Details</span>
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg="12" className="text-center py-4">
              <p>No details available for this loan.</p>
              <ClickButton label={<>Back</>} onClick={handleBack} />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  return (
    <div>
      <LoadingOverlay isLoading={loading} />
      <Container fluid>
        <Row>
          <Col lg="7" md="6" xs="6">
            <div className="page-nav py-3">
              <span className="nav-list">Bank Pledger Details</span>
            </div>
          </Col>
          <Col lg="5" md="6" xs="6" className="align-self-center text-end">
            <ClickButton label={<>Back</>} onClick={handleBack} />
          </Col>
        </Row>
        <Row>
          <Col lg="12" md="12" xs="12" className="py-2">
            <h4>Details for Loan No: {loanNo}</h4>
            <Row className="py-1">
              <Col lg="4" md="6" xs="12">
                <TextInputForm
                  placeholder={"Search by Name"}
                  prefix_icon={<FaMagnifyingGlass />}
                  onChange={(e) => handleDetailsSearch(e.target.value)}
                  labelname={"Search Details"}
                  value={detailsSearchText}
                />
              </Col>
            </Row>
            <div className="py-1">
              {filteredRecords.length === 0 ? (
                <p>No records found for the search criteria.</p>
              ) : (
                <TableUI
                  headers={UserTablehead}
                  body={filteredRecords}
                  type="bankPledger"
                  style={{ borderRadius: "5px" }}
                  pageview="no"
                />
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default BankPledgerViewDetails;
