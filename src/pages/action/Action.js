import React, { useState, useEffect } from "react";
import { Container, Col, Row } from "react-bootstrap";
import { FaMagnifyingGlass } from "react-icons/fa6";
import TableUI from "../../components/Table";
import { TextInputForm } from "../../components/Forms";
import { useMediaQuery } from "react-responsive";
import { ClickButton } from "../../components/ClickButton";
import { useNavigate } from "react-router-dom";
import MobileView from "../../components/MobileView";
import API_DOMAIN from "../../config/config";

const UserTablehead = ["S.No", "Customer No", "Customer Name", "Action"];

const Action = () => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_DOMAIN}/action.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          search_text: searchText,
        }),
      });

      const responseData = await response.json();
      setLoading(false);
      if (responseData.head.code === 200) {
        setUserData(responseData.body.action || []);
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
              <span className="nav-list">Actions</span>
            </div>
          </Col>
          <Col lg="5" md="6" xs="6" className="align-self-center text-end">
            <span className="px-1">
              <ClickButton
                label={<>Add New</>}
                onClick={() => navigate("/console/master/action/create")}
              ></ClickButton>
            </span>
          </Col>
          <Col lg="3" md="12" xs="12" className="py-1">
            <TextInputForm
              placeholder={"Search"}
              onChange={(e) => handleSearch(e.target.value)}
              prefix_icon={<FaMagnifyingGlass />}
            />
          </Col>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <Col lg="12" md="12" xs="12" className="px-0">
              <div className="py-1">
                {isMobile &&
                  userData.map((action, index) => (
                    <MobileView
                      key={index}
                      sno={action.id}
                      name={action.action_id}
                      subname={action.name}
                    />
                  ))}
                <TableUI
                  headers={UserTablehead}
                  body={userData}
                  type="action"
                  style={{ borderRadius: "5px" }}
                />
              </div>
            </Col>
          )}
        </Row>
      </Container>
    </div>
  );
};

export default Action;
