import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Col, Container, Row } from "react-bootstrap";
import PageNav from "../../components/PageNav";
import { ClickButton } from "../../components/Buttons";
import { useLocation, useNavigate } from "react-router-dom";
import API_DOMAIN from "../../config/config";
import "./Customer.css";
import { MaterialReactTable } from "material-react-table";
import { Chip, IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import dayjs from "dayjs";
import { PDFDownloadLink } from "@react-pdf/renderer";
import InterestStatementPDF from "../../pdf/InterestStatementPDF";

// ✅ MUI Action Menu Component
// In src/pages/customer/CustomerDetails.js
// Remember to update the props in the ActionMenu signature as well!
// const ActionMenu = ({ row, navigate, onInterest, onRecovery, onRePledge, onDownloadPawnAgreement, isAdmin, handleJewelPawningEditClick, handleJewelPawningDeleteClick }) => {
// Note: You'll need to pass isAdmin, handleJewelPawningEditClick, and handleJewelPawningDeleteClick from the parent CustomerDetails component to the ActionMenu component, and from the pawnColumns Cell property.

const ActionMenu = ({
  row,
  navigate,
  onInterest,
  onRecovery,
  onRePledge,
  onDownloadPawnAgreement,
  onBankDetails,
  // Assuming these are passed as props from the parent:
  isAdmin,
  handleJewelPawningEditClick,
  handleJewelPawningDeleteClick,
}) => {
  // 1. HOOKS MUST BE FIRST
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  // 2. CRITICAL SAFETY CHECK
  if (!row) {
    return null;
  }

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  // 3. Conditional rendering checks based on your old logic
  // "நகை மீட்கபட்டது" (Item Recovered) - Prevents Interest/Repledge options
  const isRecovered = row.status === "நகை மீட்கபட்டது";

  // "நகை மீட்கபடவில்லை" (Item Not Recovered) - Prevents Re-pledge option
  const isNotRecovered = row.status === "நகை மீட்கபடவில்லை";

  return (
    <>
      <IconButton size="small" onClick={handleOpen}>
        <MoreVertIcon fontSize="small" />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{ paper: { sx: { zIndex: 1100 } } }}
      >
        {/* 1. Interest Payment (Conditional: NOT recovered) 
            Maps to: {rowData?.status !== "நகை மீட்கபட்டது" && (...) onClick={() => customActions?.interest?.(rowData)} */}
        {!isRecovered && (
          <MenuItem
            onClick={() => {
              handleClose();
              onInterest(row); // Use onInterest handler
            }}
          >
            Interest
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            handleClose();
            onDownloadPawnAgreement(row);
          }}
        >
          Download Statement PDF
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleClose();
            onBankDetails(row);
          }}
        >
          Bank Details
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleClose();
            onRecovery(row);
          }}
        >
          Recovery
        </MenuItem>

        {!isNotRecovered && (
          <MenuItem
            onClick={() => {
              handleClose();
              onRePledge(row);
            }}
          >
            Re-pledge
          </MenuItem>
        )}

        {isAdmin && handleJewelPawningEditClick && (
          <MenuItem
            onClick={() => {
              handleClose();
              handleJewelPawningEditClick(row);
            }}
          >
            Edit
          </MenuItem>
        )}
        {handleJewelPawningDeleteClick && (
          <MenuItem
            onClick={() => {
              handleClose();
              handleJewelPawningDeleteClick(row.pawnjewelry_id); // Assuming pawnjewelry_id is on the row object
            }}
          >
            Delete
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

const CustomerDetails = () => {
  const location = useLocation();
  const { rowData } = location.state || {};
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [companyRates, setCompanyRates] = useState({});
  const [customerDetailsData, setCustomerDetailsData] = useState(null);
  const [pawnData, setpawnData] = useState([]);
  const [tempData, setTempData] = useState(null);
  const [pendingDownload, setPendingDownload] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const isAdmin = user.role === "Admin";

  const fetchCustomerDetails = async () => {
    if (!rowData.customer_no) return;
    try {
      setLoading(true);
      const response = await fetch(`${API_DOMAIN}/customer_details.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer_no: rowData.customer_no }),
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
    [companyRates]
  );

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
      setLoading(false);

      if (responseData.head.code === 200) {
        let sortedData = responseData.body.pawnjewelry.map((user) => {
          const jewelProduct = Array.isArray(user.jewel_product)
            ? user.jewel_product
            : JSON.parse(user.jewel_product || "[]");

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
      } else {
        throw new Error(responseData.head.msg);
      }
    } catch (error) {
      setLoading(false);
      console.error("❌ Error fetching data:", error.message);
    }
  };

  const handleInterestClick = (pawnRow) => {
    navigate("/console/customer/interest", { state: { rowData: pawnRow } });
  };

  const handleRecoveryClick = (pawnRow) => {
    navigate("/console/customer/jewelrecovery", {
      state: { rowData: pawnRow },
    });
  };

  const handleBankDetailsClick = (pawnRow) => {
    navigate("/console/customer/customerbankdetails", {
      state: {
        bankData: pawnRow.bank_pledger || [],
        receiptNo: pawnRow.receipt_no,
        customerNo: rowData.customer_no,
      },
    });
  };

  const handleRePledgeClick = (pawnRow) => {
    navigate("/console/customer/loancreation", {
      state: { type: "repledge", rowData: pawnRow },
    });
  };

  const handleJewelPawningEditClick = (rowData) => {
    navigate("/console/customer/loancreation", {
      state: { type: "edit", rowData: rowData },
    });
  };
  const handleJewelPawningDeleteClick = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_DOMAIN}/pawnjewelry.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          delete_pawnjewelry_id: id,
          login_id: user.id,
          user_name: user.user_name,
        }),
      });
      const responseData = await response.json();
      if (responseData.head.code === 200) {
        navigate("/console/master/customer");
        window.location.reload();
      } else {
        console.log(responseData.head.msg);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (rowData && Object.keys(companyRates).length > 0) {
      fetchCustomerDetails();
      fetchDatapawn();
    }
  }, [rowData, companyRates]);

  // Inside CustomerDetails component:

  // 1. The Async Handler to fetch data and trigger PDF generation
  const handleDownloadStatement = useCallback(
    async (pawnRow) => {
      setLoading(true);
      try {
        const response = await fetch(
          `${API_DOMAIN}/getintereststatementreport.php`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              receipt_no: pawnRow.receipt_no,
            }),
          }
        );
        const responseData = await response.json();
        if (responseData.head.code === 200) {
          setTempData({
            statement: responseData.body,
            customer: pawnRow,
          });

          setPendingDownload(pawnRow.receipt_no);
        } else {
          console.error("Error fetching statement:", responseData.head.msg);
        }
      } catch (error) {
        console.error("Error fetching statement:", error.message);
      } finally {
        setLoading(false);
      }
    },
    [setLoading]
  );

  // 2. The useEffect to trigger the final browser download
  useEffect(() => {
    if (downloadUrl && pendingDownload) {
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${pendingDownload}_statement.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(null);
      setPendingDownload(null);
      setTempData(null);
    }
  }, [downloadUrl, pendingDownload]);

  // ✅ MUI Menu-based Action column
  const pawnColumns = useMemo(
    () => [
      {
        header: "S.No",
        id: "sno",
        Cell: ({ row }) => row.index + 1,
        size: 50,
      },
      {
        header: "Loan Date",
        accessorKey: "pawnjewelry_date",
        Cell: ({ cell }) => dayjs(cell.getValue()).format("DD-MM-YYYY"),
        size: 100,
      },
      {
        header: "Loan No",
        accessorKey: "receipt_no",
        size: 100,
      },
      {
        header: "Principal Amount",
        accessorKey: "original_amount",
        Cell: ({ cell }) =>
          ` ${parseFloat(cell.getValue()).toLocaleString("en-IN")}`,
        size:80,
      },
      {
        header: "Interest Rate",
        accessorKey: "interest_rate",
        Cell: ({ cell }) => `${cell.getValue()}%`,
        size: 100,
      },
      {
        header: "Total Weight",
        id: "total_weight",
        accessorFn: (row) =>
          row.jewel_product
            .reduce((sum, item) => sum + parseFloat(item.weight || 0), 0)
            .toFixed(2),
        Cell: ({ cell }) => `${cell.getValue()} `,
        size: 100,
      },
      {
        header: "Existing Pledge Value",
        accessorKey: "original_amount",
        Cell: ({ cell }) =>
          ` ${parseFloat(cell.getValue()).toLocaleString("en-IN")}`,
        size: 240,
      },
      {
        header: "Pledge Items",
        id: "pledge_items",
        accessorFn: (row) =>
          row.jewel_product.map((p) => p.JewelName?.trim()).join(", "),
        size: 200,
      },
      {
        header: "Pending Interest",
        accessorKey: "interest_payment_amount",
        Cell: ({ cell }) =>
          `${parseFloat(cell.getValue() || 0).toLocaleString("en-IN")}`,
        size: 140,
      },
      {
        header: "Total Pledge Value",
        id: "total_pledge_value",
        accessorFn: (row) => {
          const principal = parseFloat(row.original_amount || 0);
          const interest = parseFloat(row.interest_payment_amount || 0);
          return (principal + interest).toFixed(2);
        },
        Cell: ({ cell }) =>
          ` ${parseFloat(cell.getValue()).toLocaleString("en-IN")}`,
        size: 160,
      },
      {
        header: "Jewel Pawn Value",
        accessorKey: "jewel_pawn_value",
        Cell: ({ cell }) =>
          `${parseFloat(cell.getValue() || 0).toLocaleString("en-IN")}`,
        size: 140,
      },

      {
        header: "Status",
        accessorKey: "status",
        Cell: ({ cell }) => {
          const statusValue = cell.getValue();
          let color;
          if (statusValue === "நகை மீட்கபட்டது") {
            color = "success"; // Green color
          } else if (statusValue === "நகை மீட்கபடவில்லை") {
            color = "error";
          } else {
            color = "warning";
          }

          return (
            <Chip
              label={statusValue}
              color={color}
              sx={{ fontWeight: "bold" }}
            />
          );
        },
        size: 150,
      },
      {
        header: "Action",
        id: "action",
        // ...
        Cell: ({ row }) => (
          <ActionMenu
            row={row.original}
            navigate={navigate}
            onInterest={handleInterestClick} // your handleInterestClick
            onRecovery={handleRecoveryClick} // your handleRecoveryClick
            onBankDetails={handleBankDetailsClick} // your handleBankDetailsClick
            onRePledge={handleRePledgeClick} // your handleRePledgeClick
            onDownloadPawnAgreement={handleDownloadStatement} // your handleDownloadStatement
            isAdmin={isAdmin}
            handleJewelPawningEditClick={handleJewelPawningEditClick}
            handleJewelPawningDeleteClick={handleJewelPawningDeleteClick}
          />
        ),
      },
    ],
    [navigate]
  );

  return (
    <div>
      <Container>
        <Row className="regular">
          <Col lg="12" md="12" xs="12" className="py-3">
            <PageNav pagetitle={"Customer Details"} />
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
          {pawnData.length > 0 && (
            <Row className="mb-4">
              <Col lg={12}>
                <MaterialReactTable
                  columns={pawnColumns}
                  data={pawnData}
                  enableColumnActions={false}
                  enableColumnFilters={false}
                  muiTableBodyCellProps={{
                    sx: { fontSize: "13px", overflow: "visible",alignItems:"center" },
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
          {pendingDownload && tempData && (
            <PDFDownloadLink
              document={<InterestStatementPDF data={tempData} />}
              fileName={`${pendingDownload}_statement.pdf`}
            >
              {({ blob, url, loading: pdfLoading, error }) => {
                if (!pdfLoading && url && !error) {
                  setDownloadUrl(url);
                }
                return <div style={{ display: "none" }} />;
              }}
            </PDFDownloadLink>
          )}
        </Row>
      </Container>
    </div>
  );
};

export default CustomerDetails;
