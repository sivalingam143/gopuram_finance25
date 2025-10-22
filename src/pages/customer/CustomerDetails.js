import React, { useState, useEffect } from "react";
import { Col, Container, Row, Table } from "react-bootstrap";
import PageNav from "../../components/PageNav";
import { TextInputForm } from "../../components/Forms";
import { FaAngleDown } from "react-icons/fa6";
import { useLocation } from "react-router-dom";
import API_DOMAIN from "../../config/config";
import { ClickButton } from "../../components/Buttons";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const CustomerDetails = () => {
  const location = useLocation();
  const { type, rowData } = location.state || {};
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = useState(false);
  const [showDetails1, setShowDetails1] = useState(false);
  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };
  const toggleDetails1 = () => {
    setShowDetails1(!showDetails1);
  };

  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    CustomerName: "",
    Address: "",
    Place: "",
    MobileNo: "",
    customer_no: "",
    name_of_guardians: "",
  });
  console.log("formData", formData);
  const [pawnData, setpawnData] = useState([]);
  const [pawngData, setpawngData] = useState([]);

  const handleUpdateSubmit = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${API_DOMAIN}/customer.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          edit_customer_id: rowData.customer_id, // Include the company ID in the request
          customer_no: formData.customer_no,
          customer_name: formData.CustomerName,
          gurdian_name: formData.name_of_guardians,
          address: formData.Address,
          mobile_number: formData.MobileNo,
        }),
      });
      console.log(
        JSON.stringify({
          edit_customer_id: rowData.Group_id, // Include the company ID in the request
          customer_no: formData.customer_no,
          customer_name: formData.CustomerName,
          gurdian_name: formData.name_of_guardians,
          address: formData.Address,
          mobile_number: formData.MobileNo,
        })
      );
      const responseData = await response.json();

      if (responseData.head.code === 200) {
        toast.success(responseData.head.msg, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });

        setTimeout(() => {
          navigate("/console/master/customer");
        }, 2000);
      } else {
        toast.error(responseData.head.msg, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        console.error(
          responseData.message || "Unknown error occurred during update"
        );
      }
    } catch (error) {
      console.error("Error updating product:", error.message);
    }

    setLoading(false);
  };

  const fetchDatapawng = async () => {
    try {
      const response = await fetch(`${API_DOMAIN}/pawnjewelryg.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer_id: rowData.customer_id,
        }),
      });

      const responseData = await response.json();
      setLoading(false);
      if (responseData.head.code === 200) {
        let sortedData = responseData.body.pawnjewelryg.map((user) => ({
          ...user,
          jewel_product: JSON.parse(user.jewel_product || "[]"), // Ensure jewel_product is an array
        }));

        setpawngData(sortedData);
      } else {
        throw new Error(responseData.head.msg);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error.message);
    }
  };

  const fetchDatapawn = async () => {
    try {
      const response = await fetch(`${API_DOMAIN}/pawnjewelry.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer_id: rowData.customer_id,
        }),
      });

      const responseData = await response.json();
      setLoading(false);
      if (responseData.head.code === 200) {
        let sortedData = responseData.body.pawnjewelry.map((user) => ({
          ...user,
          jewel_product: JSON.parse(user.jewel_product || "[]"), // Ensure jewel_product is an array
        }));

        setpawnData(sortedData);
      } else {
        throw new Error(responseData.head.msg);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error.message);
    }
  };
  useEffect(() => {
    if (rowData) {
      setFormData({
        CustomerName: rowData.customer_name || "",
        Address: rowData.address || "",
        Place: "",
        MobileNo: rowData.mobile_number || "",
        customer_no: rowData.customer_no || "",
        name_of_guardians: rowData.name_of_guardians || "",
      });

      fetchDatapawn();
      fetchDatapawng();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowData]);
  const handleChange = (e, fieldName) => {
    const value = e.target ? e.target.value : e.value;

    setFormData({
      ...formData,
      [fieldName]: value,
    });
  };

  return (
    <div>
      {type == "edit" ? (
        <>
          <Container>
            <Row className="regular">
              <Col lg="12" md="12" xs="12" className="py-3">
                <PageNav pagetitle={"Customer Details"}></PageNav>
              </Col>

              <Col lg="3" md="4" xs="12" className="py-3">
                <TextInputForm
                  placeholder={"வாடிக்கையாளர் எண்."}
                  labelname={"வாடிக்கையாளர் எண்."}
                  value={formData.customer_no}
                  onChange={(e) => handleChange(e, "customer_no")}
                ></TextInputForm>
              </Col>
              <Col lg="3" md="4" xs="12" className="py-3">
                <TextInputForm
                  placeholder={"வாடிக்கையாளர் பெயர்"}
                  labelname={"வாடிக்கையாளர் பெயர்"}
                  value={formData.CustomerName}
                  onChange={(e) => handleChange(e, "CustomerName")}
                ></TextInputForm>
              </Col>
              <Col lg="3" md="4" xs="12" className="py-3">
                <TextInputForm
                  placeholder={"தந்தை அல்லது கணவர் பெயர்"}
                  labelname={"தந்தை அல்லது கணவர் பெயர்"}
                  value={formData.name_of_guardians}
                  onChange={(e) => handleChange(e, "name_of_guardians")}
                ></TextInputForm>
              </Col>
              <Col lg="3" md="4" xs="12" className="py-3">
                <TextInputForm
                  placeholder={"முகவரி"}
                  labelname={"முகவரி"}
                  value={formData.Address}
                  onChange={(e) => handleChange(e, "Address")}
                ></TextInputForm>
              </Col>
              <Col lg="3" md="4" xs="12" className="py-3">
                <TextInputForm
                  placeholder={"தொலைபேசி எண்."}
                  labelname={"தொலைபேசி எண்."}
                  value={formData.MobileNo}
                  onChange={(e) => handleChange(e, "MobileNo")}
                ></TextInputForm>
              </Col>
              <Col lg="12">
                <div className="text-center mb-3">
                  {type === "view" ? (
                    <span className="mx-2">
                      <ClickButton
                        label={<>back</>}
                        onClick={() => navigate("/console/master/customer")}
                      />
                    </span>
                  ) : (
                    <>
                      {type === "edit" && (
                        <>
                          <ToastContainer
                            position="top-center"
                            autoClose={2000}
                            hideProgressBar={false}
                            newestOnTop={false}
                            closeOnClick
                            rtl={false}
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover
                            theme="colored"
                          />
                          <span className="mx-2">
                            <ClickButton
                              label={<>Update</>}
                              onClick={handleUpdateSubmit}
                            />
                          </span>
                          <span className="mx-2">
                            <ClickButton
                              label={<>cancle</>}
                              onClick={() =>
                                navigate("/console/master/customer")
                              }
                            />
                          </span>
                        </>
                      )}
                    </>
                  )}
                </div>
              </Col>
            </Row>
          </Container>
        </>
      ) : (
        <>
          <Container>
            <Row className="regular">
              <Col lg="12" md="12" xs="12" className="py-3">
                <PageNav pagetitle={"Customer Details"}></PageNav>
              </Col>

              <Col lg="3" md="4" xs="12" className="py-3">
                <TextInputForm
                  placeholder={"வாடிக்கையாளர் எண்."}
                  labelname={"வாடிக்கையாளர் எண்."}
                  value={formData.customer_no}
                  onChange={(e) => handleChange(e, "customer_no")}
                ></TextInputForm>
              </Col>
              <Col lg="3" md="4" xs="12" className="py-3">
                <TextInputForm
                  placeholder={"வாடிக்கையாளர் பெயர்"}
                  labelname={"வாடிக்கையாளர் பெயர்"}
                  value={formData.CustomerName}
                  onChange={(e) => handleChange(e, "CustomerName")}
                ></TextInputForm>
              </Col>
              <Col lg="3" md="4" xs="12" className="py-3">
                <TextInputForm
                  placeholder={"தந்தை அல்லது கணவர் பெயர்"}
                  labelname={"தந்தை அல்லது கணவர் பெயர்"}
                  value={formData.name_of_guardians}
                  onChange={(e) => handleChange(e, "name_of_guardians")}
                ></TextInputForm>
              </Col>
              <Col lg="3" md="4" xs="12" className="py-3">
                <TextInputForm
                  placeholder={"முகவரி"}
                  labelname={"முகவரி"}
                  value={formData.Address}
                  onChange={(e) => handleChange(e, "Address")}
                ></TextInputForm>
              </Col>
              <Col lg="3" md="4" xs="12" className="py-3">
                <TextInputForm
                  placeholder={"தொலைபேசி எண்."}
                  labelname={"தொலைபேசி எண்."}
                  value={formData.MobileNo}
                  onChange={(e) => handleChange(e, "MobileNo")}
                ></TextInputForm>
              </Col>

              <Col lg="12">
                {pawnData.length > 0 && (
                  <>
                    <Col lg="7" md="6" xs="6">
                      <div className="page-nav py-3">
                        <span class="nav-list">நகை அடகு</span>
                      </div>
                    </Col>
                    <Table>
                      <thead>
                        <tr>
                          <td>No</td>
                          <td>ரசீது எண்</td>
                          <td>அடகு ரூபாய் (ரூ)</td>
                          <td>வட்டி விகிதம் (%)</td>
                          <td>வட்டி ரூபாய் (ரூ)</td>
                          <td>சுமார் மதிப்பு (ரூ)</td>
                          <td>நகை மீட்ட தேதி</td>
                          <td>Action</td>
                        </tr>
                      </thead>
                      <tbody>
                        {pawnData.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.recipt_no}</td>
                            <td>{item.pawn_rate}</td>
                            <td>{item.pawn_interest}</td>
                            <td>{item.pawn_interest_amount}</td>
                            <td>{item.jewel_original_rate}</td>
                            <td>{item.pawnjewelry_recovery_finshed_date}</td>
                            <td>
                              <button onClick={toggleDetails}>
                                <FaAngleDown />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </>
                )}
                <div
                  className={`jewel-details ${showDetails ? "open" : "close"}`}
                >
                  <Table>
                    <thead>
                      <tr>
                        <td>No</td>
                        <td>நகை பெயர்</td>
                        <td>எண்ணிக்கை</td>
                        <td>தரம்</td>
                        <td>எடை</td>
                        <td>குறிப்பு</td>
                      </tr>
                    </thead>
                    <tbody>
                      {pawnData.length > 0 &&
                        pawnData[0].jewel_product.map((product, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{product.JewelName}</td>
                            <td>{product.count}</td>
                            <td>{product.qlty}</td>
                            <td>{product.weight}</td>
                            <td>{product.remark}</td>
                          </tr>
                        ))}
                    </tbody>
                  </Table>
                </div>
              </Col>
              <Col lg="12">
                {pawngData.length > 0 && (
                  <>
                    <Col lg="7" md="6" xs="6">
                      <div className="page-nav py-3">
                        <span class="nav-list">நகை அடகு - G</span>
                      </div>
                    </Col>
                    <Table>
                      <thead>
                        <tr>
                          <td>No</td>
                          <td>ரசீது எண்</td>
                          <td>அடகு ரூபாய் (ரூ)</td>
                          <td>வட்டி விகிதம் (%)</td>
                          <td>வட்டி ரூபாய் (ரூ)</td>
                          <td>சுமார் மதிப்பு (ரூ)</td>
                          <td>நகை மீட்ட தேதி</td>
                          <td>Action</td>
                        </tr>
                      </thead>
                      <tbody>
                        {pawngData.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.recipt_no}</td>
                            <td>{item.pawn_rate}</td>
                            <td>{item.pawn_interest}</td>
                            <td>{item.pawn_interest_amount}</td>
                            <td>{item.jewel_original_rate}</td>
                            <td>{item.pawnjewelryg_recovery_finshed_date}</td>
                            <td>
                              <button onClick={toggleDetails1}>
                                <FaAngleDown />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </>
                )}
                <div
                  className={`jewel-details ${showDetails1 ? "open" : "close"}`}
                >
                  <Table>
                    <thead>
                      <tr>
                        <td>No</td>
                        <td>நகை பெயர்</td>
                        <td>எண்ணிக்கை</td>
                        <td>தரம்</td>
                        <td>எடை</td>
                        <td>குறிப்பு</td>
                      </tr>
                    </thead>
                    <tbody>
                      {pawngData.length > 0 &&
                        pawngData[0].jewel_product.map((product, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{product.JewelName}</td>
                            <td>{product.count}</td>
                            <td>{product.qlty}</td>
                            <td>{product.weight}</td>
                            <td>{product.remark}</td>
                          </tr>
                        ))}
                    </tbody>
                  </Table>
                </div>
              </Col>
            </Row>
          </Container>
        </>
      )}
    </div>
  );
};

export default CustomerDetails;
