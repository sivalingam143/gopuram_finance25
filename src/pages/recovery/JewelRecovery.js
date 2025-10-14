import React, { useState, useEffect } from "react";
import { Container, Col, Row } from "react-bootstrap";
import { FaMagnifyingGlass } from "react-icons/fa6";
import TableUI from "../../components/Table";
import { TextInputForm, DropDownUI } from "../../components/Forms";
import Pagnation from "../../components/Pagnation";
import { ClickButton } from "../../components/ClickButton";
import { useNavigate } from "react-router-dom";
import MobileView from "../../components/MobileView";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import { IoMdCloseCircle } from "react-icons/io";
import { IoFilter } from "react-icons/io5";
import PageNav from "../../components/PageNav";
import API_DOMAIN from "../../config/config";
import { isMobile } from "react-device-detect";
import LoadingOverlay from "../../components/LoadingOverlay";
const UserTablehead = [
  "No",
  "Loan Date",
  "Loan Closing Date",
  "Loan Number",
  "Customer Name",
  "Mobile Number",
  "Action",
];

const User = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    CustomerName: "",
    ReceiptNo: "",
  });
  console.log("formData", formData);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleLoad = () => {
    setFormData({
      CustomerName: "",
      ReceiptNo: "",
    });
  };
  const [searchText, setSearchText] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_DOMAIN}/pawnrecovery.php`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            search_text: searchText,
          }),
        });

        const responseData = await response.json();
        console.log("responseData", responseData);
       
        if (responseData.head.code === 200) {
          let sortedData = responseData.body.pawn_recovery.map((user) => ({
            ...user,
            jewel_product: JSON.parse(user.jewel_product || "[]"), // Ensure jewel_product is an array
          }));

          if (formData.CustomerName) {
            console.log("formData.CustomerName", formData.CustomerName);
            sortedData = sortedData.filter(
              (user) => user.customer_name === formData.CustomerName
            );
          }

          if (formData.ReceiptNo) {
            console.log("formData.ReceiptNo", formData.ReceiptNo);
            sortedData = sortedData.filter(
              (user) => user.recipt_no === formData.ReceiptNo
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
            {/* <PageNav pagetitle={"Jewelry recovery"}></PageNav> */}
            <div className="page-nav py-3">
            <span className="nav-list">Loan Closing</span>
          </div>
          </Col>
          <Col lg="5" md="6" xs="6" className="align-self-center text-end">
            <ClickButton
              label={<>Add New</>}
              onClick={() => navigate("/console/master/jewelrecovery/create")}
            ></ClickButton>
          </Col>

          <Col lg="3" md="12" xs="12" className="py-1">
            <TextInputForm
              placeholder={"Name, mobile number"}
              onChange={(e) => handleSearch(e.target.value)}
              prefix_icon={<FaMagnifyingGlass />}
            >
              {" "}
            </TextInputForm>
          </Col>
          {/* <Col lg={6} md={12} xs={12} className="py-2 text-end">
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
                        optionlist={userData.map((user) => ({
                          value: user.recipt_no,
                          label: user.recipt_no,
                        }))}
                        placeholder="Receipt No"
                        labelname="Receipt No"
                        name="ReceiptNo"
                        value={formData.ReceiptNo}
                        onChange={(updatedFormData) =>
                          setFormData({
                            ...formData,
                            ReceiptNo: updatedFormData.ReceiptNo,
                          })
                        }
                      />
                    </Col>
                    <Col lg="12" md="12" xs="12" className="py-3">
                      <DropDownUI
                        optionlist={userData.map((user) => ({
                          value: user.customer_name,
                          label: user.customer_name,
                        }))}
                        labelname={"Customer Name"}
                        placeholder="Customer Name"
                        name="CustomerName"
                        value={formData.CustomerName}
                        onChange={(updatedFormData) =>
                          setFormData({
                            ...formData,
                            CustomerName: updatedFormData.CustomerName,
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
              {isMobile &&
              userData &&
                userData.map((user, index) => (
                  <MobileView
                    key={index}
                    sno={user.id}
                    name={user.recipt_no}
                    subname={user.customer_name}
                  />
                ))}
              <TableUI
                headers={UserTablehead}
                body={userData}
                type="jewelRecovery"
                pageview={"yes"}
                style={{ borderRadius: "5px" }}
              />
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
