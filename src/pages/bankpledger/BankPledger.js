import React, { useState, useEffect } from "react";
import { Container, Col, Row } from "react-bootstrap";
import TableUI from "../../components/Table";
import { TextInputForm } from "../../components/Forms";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { ClickButton } from "../../components/ClickButton";
import { useNavigate } from "react-router-dom";
import API_DOMAIN from "../../config/config";
import { useMediaQuery } from "react-responsive";
import LoadingOverlay from "../../components/LoadingOverlay";

const BankPledger = () => {
  const navigate = useNavigate();
  const [loanSearchText, setLoanSearchText] = useState("");
  const [allGroupedData, setAllGroupedData] = useState([]);
  const [groupedData, setGroupedData] = useState([]);
  const [loading, setLoading] = useState(false);

  const summaryHeaders = ["S.No", "Bank Loan No", "Action"];

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_DOMAIN}/bank_pledger.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          search_text: "",
        }),
      });
      const responseData = await response.json();

      if (responseData.head.code === 200) {
        const grouped = responseData.body.grouped_pledger || [];
        setAllGroupedData(grouped);
        updateGroupedData(grouped);
        setLoading(false);
      } else {
        throw new Error(responseData.head.msg);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error.message);
    }
  };

  const updateGroupedData = (data) => {
    let filtered = data;
    if (loanSearchText) {
      filtered = data.filter((group) =>
        String(group.loan_no || "")
          .toLowerCase()
          .includes(loanSearchText.toLowerCase())
      );
    }
    setGroupedData(filtered);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    updateGroupedData(allGroupedData);
  }, [loanSearchText]);

  const handleLoanSearch = (value) => {
    setLoanSearchText(value);
  };

  const handleViewDetails = (records, loanNo) => {
    navigate("/console/master/bankpledger/viewdetails", {
      state: { records, loanNo },
    });
  };

  const customActions = {
    viewDetails: handleViewDetails,
  };

  return (
    <div>
      <LoadingOverlay isLoading={loading} />
      <Container fluid>
        <Row>
          <Col lg="7" md="6" xs="6">
            <div className="page-nav py-3">
              <span className="nav-list">Bank Pledger</span>
            </div>
          </Col>
          <Col lg="5" md="6" xs="6" className="align-self-center text-end">
            <ClickButton
              label={<>AddNew</>}
              onClick={() => navigate("/console/master/bankpledger/create")}
            />
          </Col>
          <Col lg="3" md="5" xs="12" className="py-1">
            <TextInputForm
              placeholder={"Search by Loan No"}
              prefix_icon={<FaMagnifyingGlass />}
              onChange={(e) => handleLoanSearch(e.target.value)}
              labelname={"Search Loan"}
              value={loanSearchText}
            />
          </Col>
          <Col lg={9} md={12} xs={12} className="py-2" />
          <Col lg="12" md="12" xs="12" className="px-0">
            <div className="py-1">
              {groupedData.length === 0 ? (
                <p>No loan records found.</p>
              ) : (
                <TableUI
                  headers={summaryHeaders}
                  body={groupedData}
                  type="bankPledgerSummary"
                  style={{ borderRadius: "5px" }}
                  pageview="no"
                  customActions={customActions}
                />
              )}
            </div>
          </Col>
          <Col lg="4" />
        </Row>
      </Container>
    </div>
  );
};

export default BankPledger;
