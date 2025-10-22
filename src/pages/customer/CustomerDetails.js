import React, { useState, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import PageNav from "../../components/PageNav";
import { ClickButton } from "../../components/Buttons";
import { useLocation } from "react-router-dom";
import API_DOMAIN from "../../config/config";
import { useNavigate } from "react-router-dom";
import TableUI from "../../components/Table";
import "./Customer.css";

const UserTablehead = [
  "S.No",
  "Loan Date",
  "Loan No",

  "Principal Amount",
  "Interest Rate",
  "Total Weight",
  "Pledge Items",
  "Status",
  "Action",
];

const CustomerDetails = () => {
  const location = useLocation();
  const { rowData } = location.state || {};
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [customerDetailsData, setCustomerDetailsData] = useState(null);
  const [pawnData, setpawnData] = useState([]);

  const fetchCustomerDetails = async () => {
    if (!rowData.customer_no) return;
    try {
      setLoading(true);
      const response = await fetch(`${API_DOMAIN}/customer_details.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer_no: rowData.customer_no,
        }),
      });

      const responseData = await response.json();
      if (responseData.head.code === 200) {
        setCustomerDetailsData(responseData.body);
      } else {
        console.error(
          "Error fetching customer details:",
          responseData.head.msg
        );
      }
    } catch (error) {
      console.error("Error fetching customer details:", error.message);
    } finally {
      setLoading(false);
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
          customer_no: rowData.customer_no,
        }),
      });

      const responseData = await response.json();
      setLoading(false);
      if (responseData.head.code === 200) {
        let sortedData = responseData.body.pawnjewelry.map((user) => ({
          ...user,
          jewel_product: JSON.parse(user.jewel_product || "[]"),
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

  // New handlers for dropdown clicks
  const handleInterestClick = (pawnRow) => {
    navigate("/console/interest/pay", { state: { rowData: pawnRow } });
  };

  const handleRecoveryClick = (pawnRow) => {
    navigate("/console/master/jewelrecovery/pay", {
      state: { rowData: pawnRow },
    });
  };

  useEffect(() => {
    if (rowData) {
      fetchCustomerDetails();
      fetchDatapawn();
    }
  }, [rowData]);

  return (
    <div>
      <Container>
        <Row className="regular">
          <Col lg="12" md="12" xs="12" className="py-3">
            <PageNav pagetitle={"Customer Details"}></PageNav>
          </Col>
          <Row className="mb-4">
            <Col lg={4}>
              <div className="customer-card bg-light border rounded p-3 h-100 d-flex flex-column align-items-center justify-content-center">
                <h5 className="mb-3 text-center">Customer Image</h5>
                {customerDetailsData?.customer_info?.proof &&
                customerDetailsData.customer_info.proof.length > 0 ? (
                  <img
                    src={customerDetailsData.customer_info.proof[0]}
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
                    <span>
                      {customerDetailsData?.customer_info?.customer_no ||
                        rowData.customer_no}
                    </span>
                  </li>
                  <li className="mb-2 d-flex justify-content-between">
                    <strong>Name:</strong>
                    <span>
                      {customerDetailsData?.customer_info?.name || rowData.name}
                    </span>
                  </li>
                  <li className="mb-2 d-flex justify-content-between">
                    <strong>Address:</strong>
                    <span>
                      {customerDetailsData?.customer_info?.customer_details ||
                        rowData.customer_details}
                    </span>
                  </li>
                  <li className="mb-2 d-flex justify-content-between">
                    <strong>Place:</strong>
                    <span>
                      {customerDetailsData?.customer_info?.place ||
                        rowData.place}
                    </span>
                  </li>
                  <li className="mb-2 d-flex justify-content-between">
                    <strong>Mobile Number:</strong>
                    <span>
                      {customerDetailsData?.customer_info?.mobile_number ||
                        rowData.mobile_number}
                    </span>
                  </li>
                </ul>
              </div>
            </Col>
            <Col lg={4}>
              <div className="customer-card bg-light border rounded p-3 h-100">
                <h5 className="mb-3">Summary Details</h5>
                <ul className="list-unstyled">
                  <li className="mb-2 d-flex justify-content-between">
                    <strong>Total Original Amount:</strong>
                    <span>
                      ₹
                      {customerDetailsData?.pledges?.total_original_amount?.toLocaleString() ||
                        0}
                    </span>
                  </li>
                  <li className="mb-2 d-flex justify-content-between">
                    <strong>Total Pledges:</strong>
                    <span>
                      {customerDetailsData?.pledges?.total_pledges || 0}
                    </span>
                  </li>
                  <li className="mb-2 d-flex justify-content-between">
                    <strong>Total Paid:</strong>
                    <span>
                      ₹
                      {customerDetailsData?.interests?.total_paid?.toLocaleString() ||
                        0}
                    </span>
                  </li>
                  <li className="mb-2 d-flex justify-content-between">
                    <strong>Total Due:</strong>
                    <span>
                      ₹
                      {customerDetailsData?.interests?.total_due?.toLocaleString() ||
                        0}
                    </span>
                  </li>
                  <li className="mb-2 d-flex justify-content-between">
                    <strong>Total Recoveries:</strong>
                    <span>
                      {customerDetailsData?.recoveries?.total_recoveries || 0}
                    </span>
                  </li>
                </ul>
              </div>
            </Col>
          </Row>

          {/* Jewel Pawning Listing for this Customer */}
          {pawnData.length > 0 && (
            <Row className="mb-4">
              <Col lg={12}>
                <TableUI
                  headers={UserTablehead}
                  body={pawnData}
                  type="jewelPawning"
                  pageview="no"
                  // Pass handlers for custom actions
                  customActions={{
                    interest: handleInterestClick,
                    recovery: handleRecoveryClick,
                  }}
                />
              </Col>
            </Row>
          )}

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
    </div>
  );
};

export default CustomerDetails;
