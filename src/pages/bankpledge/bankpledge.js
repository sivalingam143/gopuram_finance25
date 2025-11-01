import React, { useState, useEffect } from "react";
import { Container, Col, Row } from "react-bootstrap";
import TableUI from "../../components/Table";
import MobileView from "../../components/MobileView";
import { TextInputForm } from "../../components/Forms";
import { FaMagnifyingGlass } from "react-icons/fa6";
import Pagnation from "../../components/Pagnation";
import { ClickButton } from "../../components/ClickButton";
import { useNavigate } from "react-router-dom";
import API_DOMAIN from "../../config/config";

const BankPledgeTablehead = [
  "No",
  "Pledge Date",
  "Customer No",
  "Receipt No",
  "Bank Loan No",
  "Action",
];

const BankPledge = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_DOMAIN}/bank_pledge_details.php`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            search_text: searchText,
          }),
        });

        const responseData = await response.json();
        console.log(responseData);
        setLoading(false);
        if (responseData.head.code === 200) {
          setUserData(responseData.body.bank_pledge_details);
        } else {
          throw new Error(responseData.head.msg);
        }
      } catch (error) {
        setLoading(false);
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, [searchText]);

  const handleSearch = (value) => {
    setSearchText(value);
  };

  return (
    <div>
      <Container fluid>
        <Row>
          <Col lg="7" md="6" xs="6">
            <div className="page-nav py-3">
              <span className="nav-list">Bank Pledge Details</span>
            </div>
          </Col>
          <Col lg="5" md="6" xs="6" className="align-self-center text-end">
            <ClickButton
              label={<>Add New</>}
              onClick={() => navigate("/console/pawn/bankpledge/create")}
            ></ClickButton>
          </Col>
          <Col lg="3" md="5" xs="12" className="py-1">
            <TextInputForm
              placeholder={"Search..."}
              prefix_icon={<FaMagnifyingGlass />}
              onChange={(e) => handleSearch(e.target.value)}
              labelname={"Search"}
            >
              {" "}
            </TextInputForm>
          </Col>

          <Col lg="12" md="12" xs="12" className="px-0">
            <div className="py-1">
              <TableUI
                headers={BankPledgeTablehead}
                body={userData}
                type="bankPledge"
                pageview={"yes"}
                style={{ borderRadius: "5px" }}
              />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default BankPledge;
