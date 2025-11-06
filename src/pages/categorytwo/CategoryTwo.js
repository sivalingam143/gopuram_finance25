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

const CategoryTwoTablehead = ["No", "Category Name", "Action"];

const CategoryTwo = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_DOMAIN}/category_two.php`, {
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
          setUserData(responseData.body.category_two);
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
              <span className="nav-list">Category</span>
            </div>
          </Col>
          <Col lg="5" md="6" xs="6" className="align-self-center text-end">
            <ClickButton
              label={<>Add New</>}
              onClick={() => navigate("/console/expense/category/create")}
            ></ClickButton>
          </Col>
          <Col lg="3" md="5" xs="12" className="py-1" style={{ marginLeft: "-11px" }}>
            <TextInputForm
              placeholder={"Search Category Name"}
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
                headers={CategoryTwoTablehead}
                body={userData}
                type="categoryTwo"
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

export default CategoryTwo;
