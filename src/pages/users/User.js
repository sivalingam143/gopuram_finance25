import React, { useState, useEffect } from "react";
import { Container, Col, Row } from "react-bootstrap";
import { FaMagnifyingGlass } from "react-icons/fa6";
import TableUI from "../../components/Table";
import { TextInputForm } from "../../components/Forms";
import { DropDownUI } from "../../components/Forms";
import { ClickButton } from "../../components/ClickButton";
import { useNavigate } from "react-router-dom";
import MobileView from "../../components/MobileView";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import { IoMdCloseCircle } from "react-icons/io";
import { IoFilter } from "react-icons/io5";
import API_DOMAIN from "../../config/config";
import LoadingOverlay from "../../components/LoadingOverlay";

const UserTablehead = ["No", "Name", "Share", "Mobile Number", "Action"];

const DropListe = [
  {
    value: "Admin",
    label: "Admin",
  },
  {
    value: "Super admin",
    label: "Super admin",
  },
  {
    value: "Employee",
    label: "Employee",
  },
];

const User = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    RoleSelection: "",
    Username: "",
  });
  console.log(formData);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleLoad = () => {
    setFormData({
      RoleSelection: "",
      Username: "",
    });
  };
  const [searchText, setSearchText] = useState("");

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const isAdmin = user.role === "Admin";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_DOMAIN}/users.php`, {
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
          let sortedData = responseData.body.user;

          if (formData.RoleSelection) {
            sortedData = sortedData.filter(
              (user) => user.RoleSelection === formData.RoleSelection
            );
          }

          if (formData.Username) {
            sortedData = sortedData.filter(
              (user) => user.Name === formData.Username
            );
          }

          setUserData(sortedData);
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
  }, [searchText, formData]);
  const handleSearch = (value) => {
    setSearchText(value);
  };
  return (
    <div>
      <Container fluid>
        <Row>
          <Col lg="7" md="6" xs="6">
            <div className="page-nav py-3">
              <span class="nav-list"> User & Access</span>
            </div>
          </Col>
          <Col lg="5" md="6" xs="6" className="align-self-center text-end">
            {isAdmin && ( // Show Edit option only if user is Admin
              <ClickButton
                label={<>Add User</>}
                onClick={() => navigate("/console/user/create")}
              />
            )}
          </Col>

          <Col lg="3" md="12" xs="12"  className="py-2"
          style={{ marginLeft: "-10px" }}
>
            <TextInputForm
              placeholder={"Name, mobile number"}
              onChange={(e) => handleSearch(e.target.value)}
              prefix_icon={<FaMagnifyingGlass />}
            >
              {" "}
            </TextInputForm>
          </Col>
          {/* <Col lg={6} md={6} xs={12} className="py-2 text-end md-mt-1">
            <span>
              <Button onClick={handleShow} className="filter my-2">
                <span className="me-2">
                  <IoFilter />
                </span>
                Filter
              </Button>

              <Button onClick={handleLoad} className="filter mx-2">
                <span className="me-2">
                  <IoFilter />
                </span>
                Undo Filter
              </Button>
            </span>
            <Offcanvas
              show={show}
              onHide={handleClose}
              placement="end"
              backdrop={true}
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title>Title of Our</Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Button onClick={handleLoad} className="filter mx-2">
                  <span className="me-2">
                    <IoFilter />
                  </span>
                  Undo Filter
                </Button>
                <div className="text-end">
                  <Button onClick={handleClose}>
                    <IoMdCloseCircle className="close-btn" />
                  </Button>
                </div>
                <div className="mt-3">
                  <Row>
                    <Col lg="12" md="12" xs="12" className="py-3">
                      <DropDownUI
                        optionlist={DropListe}
                        placeholder="Stock selection"
                        labelname="Stock selection"
                        name="RoleSelection"
                        value={formData.RoleSelection}
                        onChange={(updatedFormData) =>
                          setFormData({
                            ...formData,
                            RoleSelection: updatedFormData.RoleSelection,
                          })
                        }
                      />
                    </Col>
                    <Col lg="12" md="12" xs="12" className="py-3">
                      <DropDownUI
                        optionlist={userData.map((user) => ({
                          value: user.Name,
                          label: user.Name,
                        }))}
                        labelname={"Username"}
                        placeholder="Username"
                        name="Username"
                        value={formData.Username}
                        onChange={(updatedFormData) =>
                          setFormData({
                            ...formData,
                            Username: updatedFormData.Username,
                          })
                        }
                      />
                    </Col>
                  </Row>
                </div>
              </Offcanvas.Body>
            </Offcanvas>
          </Col> */}
          <Col lg={3} md={12} xs={12} className="py-2"></Col>

          {loading ? (
            <LoadingOverlay isLoading={loading} />
          ) : (
            <>
              <Col lg="12" md="12" xs="12" className="px-0">
                <div className="py-1">
                  {loading ? (
                    <center>
                      <Spinner animation="border" variant="dark" />{" "}
                    </center>
                  ) : (
                    <TableUI
                      headers={UserTablehead}
                      body={userData}
                      type="USER"
                      pageview={"yes"}
                      style={{ borderRadius: "5px" }}
                    />
                  )}
                </div>
              </Col>
            </>
          )}
          <Col lg={12} md={12} xs={12}></Col>
        </Row>
      </Container>
    </div>
  );
};

export default User;
