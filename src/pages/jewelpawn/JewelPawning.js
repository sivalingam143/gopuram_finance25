import React, { useState, useEffect } from "react";
import { Container, Col, Row } from "react-bootstrap";
import { FaMagnifyingGlass } from "react-icons/fa6";
import TableUI from "../../components/Table";
import { TextInputForm } from "../../components/Forms";
import { useMediaQuery } from "react-responsive";
import { ClickButton } from "../../components/ClickButton";
import { useNavigate } from "react-router-dom";
import MobileView from "../../components/MobileView";

import { useLocation } from "react-router-dom";
import API_DOMAIN from "../../config/config";
import LoadingOverlay from "../../components/LoadingOverlay";

const UserTablehead = [
  "Loan Date",
  "Loan No",
  "Customer No",
  "Customer Name",
  "Mobile Number",
  "Principal Amount",
  "Interest Rate",
  "Total Weight",
  "Pledge Items",
  "Status",
  "Action",
];

const User = () => {
  const location = useLocation();
  // eslint-disable-next-line no-unused-vars
  const { type, rowData } = location.state || {};
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const [userData, setUserData] = useState([]);
  console.log("userData", userData);

  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    CustomerName: "",
    ReceiptNo: "",
  });

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
  // const fetchBase64Proof = async (pawnId) => {
   
  //   try {
  //     const response = await fetch(`${API_DOMAIN}/get_proof_base64code.php`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ pawn_id: pawnId }),
  //     });
  
  //     const result = await response.json();
  
  //     if (result.head.code === 200) {
  //       setUserData((prevData) =>
  //         prevData.map((user) =>
  //           user.id === pawnId
  //             ? { ...user, proof_base64code: result.body.proof_base64code }
  //             : user
  //         )
  //       );
  //     } else {
  //       console.warn("Proof not found:", result.head.msg);
  //     }
  //   } catch (error) {
  //     console.error("Error loading proof_base64code:", error.message);
  //   }
  // };
  
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_DOMAIN}/pawnjewelry.php`, {
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
      console.log("responseData", responseData);
      if (responseData.head.code === 200) {
        let sortedData = responseData.body.pawnjewelry.map((user) => ({
          ...user,
          jewel_product: JSON.parse(user.jewel_product || "[]"),
        }));

        if (formData.CustomerName) {
          sortedData = sortedData.filter(
            (user) => user.customer_address === formData.CustomerName
          );
        }

        if (formData.ReceiptNo) {
          sortedData = sortedData.filter(
            (user) => user.receipt_no === formData.ReceiptNo
          );
        }
        sortedData.sort(
          (a, b) => parseInt(a.recipt_no) - parseInt(b.recipt_no)
        );
        setUserData(sortedData);
        // sortedData.forEach((item, index) => {
        //   setTimeout(() => {
        //     fetchBase64Proof(item.id);
        //   }, index * 150); // stagger requests by 150ms
        //   setLoading(false);
        // });
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
  }, [formData, searchText]);
  const handleSearch = (value) => {
    setSearchText(value);
  };
  const handleUploadNavigation = () => {
    navigate("/console/pawn/jewelpawning/create/excel");
  };

  return (
    <div>
      <Container fluid>
        <Row>
          <Col lg="7" md="6" xs="6">
            <div className="page-nav py-3">
              <span class="nav-list">Loan</span>
            </div>
          </Col>
          <Col lg="5" md="6" xs="6" className="align-self-center text-end">
            <span className="px-1">
              <ClickButton
                label={<>Add New</>}
                onClick={() => navigate("/console/pawn/jewelpawning/create")}
              ></ClickButton>
            </span>

            {/* <span className="px-1">
              <ClickButton
                label={<>Interest</>}
                onClick={() => navigate("/console/interest")}
              ></ClickButton>
            </span>
            <span className="px-1">
              <ClickButton
                label={<>Recovery</>}
                onClick={() => navigate("/console/master/jewelrecovery")}
              ></ClickButton>
            </span> */}
          </Col>
          <Col lg="3" md="12" xs="12" className="py-1">
            <TextInputForm
              placeholder={"Jewelry pawn, mobile number"}
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
                    name={user.recipt_no}
                    subname={user.customer_name}
                  />
                ))}
              <TableUI
                headers={UserTablehead}
                body={userData}
                type="jewelPawning"
                pageview="yes"
                style={{ borderRadius: "5px" }}
              />
            </div>
          </Col>
          </>
          )}
        </Row>
      </Container>
    </div>
  );
};

export default User;
