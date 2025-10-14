import React, { useState, useEffect } from "react";
import { Container, Col, Row, Modal } from "react-bootstrap";
import { FaMagnifyingGlass } from "react-icons/fa6";
import TableUI from "../../components/Table"; // Assume this is a table component to display the data
import { TextInputForm } from "../../components/Forms"; // Assume this is a custom input component
import { useMediaQuery } from "react-responsive";
import { ClickButton } from "../../components/ClickButton"; // Assume this is a button component
import MobileView from "../../components/MobileView"; // Assume this is for mobile display
import { useLocation } from "react-router-dom"; // For route location
import API_DOMAIN from "../../config/config"; // Your API domain
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const Street = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const location = useLocation();
  const { type, rowData } = location.state || {};
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [streetModal, setStreetModal] = useState(false);
  const closeModal = () => setStreetModal(false);
  const showModal = () => setStreetModal(true);
  const [searchText, setSearchText] = useState("");

  const UserTablehead = ["No", "Street Name", "தெரு  பெயர் ", "Action"];
  // Function to fetch data from the API
  const fetchData = async () => {
    setLoading(true); // Show loading indicator
    try {
      const response = await fetch(`${API_DOMAIN}/street.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          search_text: searchText,
        }),
      });

      const responseData = await response.json();
      setLoading(false); // Hide loading indicator
      console.log(response);
      if (responseData.head.code === 200) {
        console.log(responseData);
        setUserData(responseData.body.street);
      } else {
        throw new Error(responseData.head.msg);
      }
    } catch (error) {
      setLoading(false); // Hide loading indicator on error
      console.error("Error fetching data:", error.message);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchData(); // Fetch data after debouncing
    }, 300); // Adjust debounce time as needed

    return () => clearTimeout(delayDebounceFn); // Cleanup timeout
  }, [searchText]);

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
              <span className="nav-list"></span>
            </div>
          </Col>
          <Col lg="5" md="6" xs="6" className="align-self-center text-end">
            <ClickButton
              label={<>Add New</>}
              onClick={() => navigate("/console/master/Street/create")}
            />
          </Col>
          <Col lg="3" md="12" xs="12" className="py-1">
            <TextInputForm
              placeholder={t("Street Name")}
              prefix_icon={<FaMagnifyingGlass />}
              onChange={(e) => handleSearch(e.target.value)} // Pass input value
            />
          </Col>
          <Col lg="12" md="12" xs="12" className="px-0">
            <div className="py-1">
              {isMobile &&
                userData.map((user, index) => (
                  <MobileView
                    key={index}
                    sno={user.id}
                    name={user.street_eng}
                    subname={user.street_tam}
                  />
                ))}
              <TableUI
                headers={UserTablehead}
                body={userData.length > 0 ? userData : []} // Ensure userData is not undefined
                type="street"
                pageview="yes"
                style={{ borderRadius: "5px" }}
              />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Street;
