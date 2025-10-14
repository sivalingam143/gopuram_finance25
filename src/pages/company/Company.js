import React, { useState, useEffect } from "react";
import { Container, Col, Row } from "react-bootstrap";
import TableUI from "../../components/Table";
import MobileView from "../../components/MobileView";
import Pagnation from "../../components/Pagnation";
import { useNavigate } from "react-router-dom";
import API_DOMAIN from "../../config/config";
import LoadingOverlay from "../../components/LoadingOverlay";
const Company = () => {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const isAdmin = user.role === "Admin";

  const UserTablehead = [
    "No",
    "CompanyName",
    "Mobile Number",
    "Location",
    ...(isAdmin ? ["Action"] : []),
  ];

  const navigate = useNavigate();
  const [userData, setUserData] = useState([]);
  console.log("userData", userData);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_DOMAIN}/company.php`, {
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
      
        if (responseData.head.code === 200) {
          //setUserData(responseData.body.company);
          setUserData(
            Array.isArray(responseData.body.company)
              ? responseData.body.company
              : [responseData.body.company]
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

    fetchData();
  }, [searchText]);
  const handleSearch = (value) => {
    setSearchText(value);
  };

  return (
    <div>
      <Container fluid>
        <Row>
          <Col lg="7" md="4" xs="6">
            <div className="page-nav py-3">
              <span class="nav-list">Company</span>
            </div>
          </Col>
          <Col
            lg="5"
            md="3"
            xs="6"
            className="align-self-center text-end"
          ></Col>
          <Col lg="3" md="12" xs="12" className="py-1"></Col>
          <Col lg={6} md={12} xs={12} className="py-2 text-end"></Col>
          <Col lg={3} md={12} xs={12} className="py-2"></Col>
           {loading ? (
<LoadingOverlay isLoading={loading} />
) : (
  <>
          <Col lg="12" md="12" xs="12" className="px-0">
            <div className="py-1">
              {userData &&
                userData.map((user, index) => (
                  <MobileView
                    key={index}
                    sno={user.id}
                    name={user.company_name}
                    subname={user.mobile_number}
                  />
                ))}
              <TableUI
                headers={UserTablehead}
                body={userData}
                type="company"
                style={{ borderRadius: "5px" }}
              />
            </div>
          </Col>
          </>
)}
          <Col lg={12} md={12} xs={12} className="py-2"></Col>
        </Row>
      </Container>
    </div>
  );
};

export default Company;
