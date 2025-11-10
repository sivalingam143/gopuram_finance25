import React, { useState, useEffect, useCallback } from "react";
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
  "Existing Pledge Value",
  "Pending Interest",
  "Total Pledge Value",
  "Jewel Pawn Value",
  "Jewelry recovery period",
  "Status",
  "Action",
];

const CustomerDetails = () => {
  const location = useLocation();
  const { rowData } = location.state || {};
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [companyRates, setCompanyRates] = useState({});
  console.log("companyRates:", companyRates);
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

  // const fetchDatapawn = async () => {
  //   try {
  //     const response = await fetch(`${API_DOMAIN}/pawnjewelry.php`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         customer_no: rowData.customer_no,
  //       }),
  //     });

  //     const responseData = await response.json();
  //     console.log(responseData);
  //     setLoading(false);
  //     if (responseData.head.code === 200) {
  //       let sortedData = responseData.body.pawnjewelry.map((user) => ({
  //         ...user,
  //         jewel_product: JSON.parse(user.jewel_product || "[]"),
  //       }));

  //       setpawnData(sortedData);
  //     } else {
  //       throw new Error(responseData.head.msg);
  //     }
  //   } catch (error) {
  //     setLoading(false);
  //     console.error("Error fetching data:", error.message);
  //   }
  // };
  // Add this before fetchDatapawn()

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await fetch(`${API_DOMAIN}/company.php`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ search_text: "" }),
        });
        const responseData = await response.json();
        if (responseData.head.code === 200) {
          const company = responseData.body.company;
          if (company && company.jewel_price_details) {
            try {
              const rates = JSON.parse(company.jewel_price_details);
              setCompanyRates(rates);
            } catch (e) {
              console.error("Error parsing rates:", e);
              setCompanyRates({});
            }
          }
        }
      } catch (error) {
        console.error("Error fetching company:", error);
      }
    };

    fetchCompany();
  }, []);

const getRate = useCallback(
    (carrat) => {
      if (!carrat) return 0;
      const caratNum = carrat.split(" ")[0];
      const key = `${caratNum}_carat_price`;
      return parseFloat(companyRates[key]) || 0;
    },
    [companyRates])
  const fetchDatapawn = async () => {
    try {
      const response = await fetch(`${API_DOMAIN}/pawnjewelry.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_no: rowData.customer_no,
        }),
      });

      const responseData = await response.json();
      console.log(responseData, "📦 Raw Pawn Data");
      setLoading(false);

      if (responseData.head.code === 200) {
        let sortedData = responseData.body.pawnjewelry.map((user) => {
          const jewelProduct = Array.isArray(user.jewel_product)
            ? user.jewel_product // already array ✅
            : JSON.parse(user.jewel_product || "[]"); // fallback if string

          const totalValue = jewelProduct.reduce((sum, row) => {
            const net =
              parseFloat(row.weight || 0) -
              parseFloat(row.deduction_weight || 0);
            const rate = getRate(row.carrat);
            return sum + net * rate;
          }, 0);

          return {
            ...user,
            jewel_product: jewelProduct,
            jewel_pawn_value: totalValue.toFixed(2),
          };
        });

        setpawnData(sortedData);
        console.log(
          "✅ Processed Pawn Data with Jewel Pawn Value:",
          sortedData
        );
      } else {
        throw new Error(responseData.head.msg);
      }
    } catch (error) {
      setLoading(false);
      console.error("❌ Error fetching data:", error.message);
    }
  };


  // New handlers for dropdown clicks
  const handleInterestClick = (pawnRow) => {
    navigate("/console/customer/interest", { state: { rowData: pawnRow } });
  };

  const handleRecoveryClick = (pawnRow) => {
    navigate("/console/customer/jewelrecovery", {
      state: { rowData: pawnRow },
    });
  };

  const handleRePledgeClick = (pawnRow) => {
    navigate("/console/customer/loancreation", {
      state: { type: "repledge", rowData: pawnRow },
    });
  };
  // ✅ Run these only after companyRates are loaded
  useEffect(() => {
    if (rowData && Object.keys(companyRates).length > 0) {
      fetchCustomerDetails();
      fetchDatapawn();
    }
  }, [rowData, companyRates]);

  // useEffect(() => {
  //   if (rowData) {
  //     fetchCustomerDetails();
  //     fetchDatapawn();
  //   }
  // }, [rowData]);

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

          <Row>
            <Col lg="12" md="12" xs="12" className="text-end py-3">
              <span className="px-1">
                <ClickButton
                  label={<>Add New</>}
                  onClick={() =>
                    navigate("/console/customer/loancreation", {
                      state: { type: "create", rowData: rowData },
                    })
                  }
                ></ClickButton>
              </span>
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
                    repledge: handleRePledgeClick,
                  }}
                />
              </Col>
            </Row>
          )}

          {/* Bank Details Container */}
          <Row className="mb-4">
            <Col lg={4}>
              <div className="customer-card bg-light border rounded p-3 h-100">
                <h5 className="mb-3">Bank Details</h5>
                <ul className="list-unstyled">
                  <li className="mb-2 d-flex justify-content-between">
                    <strong>Account Holder Name:</strong>
                    <span>
                      {customerDetailsData?.customer_info
                        ?.account_holder_name || "N/A"}
                    </span>
                  </li>
                  <li className="mb-2 d-flex justify-content-between">
                    <strong>Bank Name:</strong>
                    <span>
                      {customerDetailsData?.customer_info?.bank_name || "N/A"}
                    </span>
                  </li>
                  <li className="mb-2 d-flex justify-content-between">
                    <strong>Account Number:</strong>
                    <span>
                      {customerDetailsData?.customer_info?.account_number ||
                        "N/A"}
                    </span>
                  </li>
                  <li className="mb-2 d-flex justify-content-between">
                    <strong>IFSC Code:</strong>
                    <span>
                      {customerDetailsData?.customer_info?.ifsc_code || "N/A"}
                    </span>
                  </li>
                  <li className="mb-2 d-flex justify-content-between">
                    <strong>Branch Name:</strong>
                    <span>
                      {customerDetailsData?.customer_info?.branch_name || "N/A"}
                    </span>
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
    </div>
  );
};

export default CustomerDetails;
