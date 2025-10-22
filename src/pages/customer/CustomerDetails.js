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
import "./Customer.css";
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
          edit_customer_id: rowData.customer_id, // Include the company ID in the request
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
        CustomerName: rowData.name || "",
        Address: rowData.customer_details || "",
        Place: rowData.place || "",
        MobileNo: rowData.mobile_number || "",
        customer_no: rowData.customer_no || "",
        name_of_guardians: rowData.name_of_guardians || "",
      });

      fetchDatapawn();
      fetchDatapawng();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowData]);

  return (
    <div>
      <>
        <Container>
          <Row className="regular">
            <Col lg="12" md="12" xs="12" className="py-3">
              <PageNav pagetitle={"Customer Details"}></PageNav>
            </Col>
            <Row className="mb-4">
              <Col lg={4}>
                <div className="customer-card bg-dard border rounded p-3 h-100 d-flex flex-column align-items-center justify-content-center">
                  <h5 className="mb-3 text-center">Customer Image</h5>
                  {rowData.proof && rowData.proof.length > 0 ? (
                    <img
                      src={rowData.proof[0]}
                      alt="Customer Proof"
                      className="img-fluid rounded"
                    />
                  ) : (
                    <div className="text-center text-muted">
                      No Image Available
                    </div>
                  )}
                </div>
              </Col>
              <Col lg={4}>
                <div className="customer-card bg-light border rounded p-3 h-100">
                  <h5 className="mb-3">Customer Information</h5>
                  <ul className="list-unstyled">
                    <li className="mb-2 d-flex justify-content-between">
                      <strong>Customer No:</strong>
                      <span>{rowData.customer_no}</span>
                    </li>
                    <li className="mb-2 d-flex justify-content-between">
                      <strong>Name:</strong>
                      <span>{rowData.name}</span>
                    </li>
                    <li className="mb-2 d-flex justify-content-between">
                      <strong>Address:</strong>
                      <span>{rowData.customer_details}</span>
                    </li>
                    <li className="mb-2 d-flex justify-content-between">
                      <strong>Place:</strong>
                      <span>{rowData.place}</span>
                    </li>
                    <li className="mb-2 d-flex justify-content-between">
                      <strong>Mobile Number:</strong>
                      <span>{rowData.mobile_number}</span>
                    </li>
                  </ul>
                </div>
              </Col>
              <Col lg={4}>
                <div className="customer-card bg-light border rounded p-3 h-100">
                  <h5 className="mb-3">Additional Details</h5>
                  <ul className="list-unstyled">
                    <li className="mb-2 d-flex justify-content-between">
                      <strong>Proof Number:</strong>
                      <span>{rowData.proof_number}</span>
                    </li>
                    <li className="mb-2 d-flex justify-content-between">
                      <strong>Additional Mobile:</strong>
                      <span>{rowData.addtionsonal_mobile_number}</span>
                    </li>
                    <li className="mb-2 d-flex justify-content-between">
                      <strong>Reference:</strong>
                      <span>{rowData.reference}</span>
                    </li>
                    <li className="mb-2 d-flex justify-content-between">
                      <strong>Pincode:</strong>
                      <span>{rowData.pincode}</span>
                    </li>
                  </ul>
                </div>
              </Col>
            </Row>

            <Col lg="12">
              <div className="text-center mb-3">
                <ClickButton
                  label={<>Back</>}
                  onClick={() => navigate("/console/master/customer")}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </>
    </div>
  );
};

export default CustomerDetails;
