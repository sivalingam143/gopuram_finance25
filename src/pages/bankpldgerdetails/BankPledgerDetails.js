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
import { useMediaQuery } from "react-responsive";
import LoadingOverlay from "../../components/LoadingOverlay";

const BankPledgerDetails = () => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const [searchText, setSearchText] = useState("");
  const [userData, setUserData] = useState([]);
  console.log("userData", userData);
  const [loading, setLoading] = useState(false);
  const UserTablehead = ["No", "Pledger Name", "Mobile No", "Action"];
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_DOMAIN}/bank_pledger_details.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          search_text: searchText,
        }),
      });
      const responseData = await response.json();

      if (responseData.head.code === 200) {
        setUserData(
          Array.isArray(responseData.body.pledger)
            ? responseData.body.pledger
            : [responseData.body.pledger]
        );
        setLoading(false);
      } else {
        throw new Error(responseData.head.msg);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error.message);
    }
  };
  useEffect(() => {
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
              <span class="nav-list">Bank Pledger Details</span>
            </div>
          </Col>
          <Col lg="5" md="6" xs="6" className="align-self-center text-end">
            <ClickButton
              label={<>AddNew</>}
              onClick={() =>
                navigate("/console/master/bankpledgerdetails/create")
              }
            ></ClickButton>
          </Col>
          <Col lg="3" md="5" xs="12" className="py-1">
            <TextInputForm
              placeholder={"Search Pledger"}
              prefix_icon={<FaMagnifyingGlass />}
              onChange={(e) => handleSearch(e.target.value)}
              labelname={"Search"}
            >
              {" "}
            </TextInputForm>
          </Col>
          <Col lg={9} md={12} xs={12} className="py-2"></Col>
          {loading ? (
            <LoadingOverlay isLoading={loading} />
          ) : (
            <>
              <Col lg="12" md="12" xs="12" className="px-0">
                <div className="py-1">
                  {isMobile &&
                    userData.map((user, index) => (
                      <MobileView
                        key={index}
                        sno={user.id}
                        name={user.name}
                        subname={user.name}
                      />
                    ))}
                  <TableUI
                    headers={UserTablehead}
                    body={userData}
                    type="bankPledgerDetails"
                    style={{ borderRadius: "5px" }}
                  />
                </div>
              </Col>
            </>
          )}
          <Col lg="4"></Col>
        </Row>
      </Container>
    </div>
  );
};

export default BankPledgerDetails;
