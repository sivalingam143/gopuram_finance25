import React, { useState, useEffect, useMemo } from "react"; // ADD useMemo
import { Container, Col, Row } from "react-bootstrap";
import { TextInputForm } from "../../components/Forms";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { ClickButton, Delete } from "../../components/ClickButton";
import { useNavigate } from "react-router-dom";
import API_DOMAIN from "../../config/config";
import { useMediaQuery } from "react-responsive";
import LoadingOverlay from "../../components/LoadingOverlay";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

// 💡 NEW IMPORTS FOR MATERIAL REACT TABLE
import { MaterialReactTable } from "material-react-table";
import {
  Box,
  Tooltip,
  IconButton,
  Dialog,
  DialogContent,
  Button,
} from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { LiaEditSolid } from "react-icons/lia";
import { MdOutlineDelete } from "react-icons/md";

const Customer = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [customerData, setcustomerData] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  // Handler functions for the preview modal
  const handlePreviewOpen = (imageUrl) => {
    setPreviewImage(imageUrl);
    setPreviewOpen(true);
  };

  const handlePreviewClose = () => {
    setPreviewOpen(false);
    setPreviewImage("");
  };

  // 1. Handlers for View  Edit and Delete Actions

  const handleJewelcustomerViewClick = (rowData) => {
    navigate("/console/master/customerdetails", {
      state: { type: "view", rowData: rowData },
    });
  }; 
  const handleJewelcustomerEditClick = (rowData) => {
    navigate("/console/master/customer/create", {
      state: { type: "edit", rowData: rowData },
    });
  };
  const handleJewelcustomerDeleteClick = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_DOMAIN}/customer.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          delete_customer_id: id,
          login_id: user.id,
          user_name: user.user_name,
        }),
      });
      const responseData = await response.json();
      if (responseData.head.code === 200) {
        navigate("/console/master/customer");
        // window.location.reload();
      } else {
        console.log(responseData.head.msg);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };
  // 2. Data Fetching Logic (Unchanged)
  const fetchDatajewelpawncustomer = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_DOMAIN}/customer.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          search_text: searchText,
        }),
      });

      const responseData = await response.json();
      console.log(responseData);
      setLoading(false);
      if (responseData.head.code === 200) {
        setcustomerData(responseData.body.customer);
        setLoading(false);
      } else {
        throw new Error(responseData.head.msg);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error.message);
    }
  };
  useEffect(() => {
    fetchDatajewelpawncustomer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);

  ///for pdf and excel download
  const handleDownloadPDF = () => {
    const doc = new jsPDF({
      orientation: "landscape", // landscape mode
      unit: "mm",
      format: "a4",
    });

    doc.setFontSize(16);
    doc.text("Customer List", 14, 15); // title at top

    doc.autoTable({
      startY: 25, // start table below title
      head: [
        [
          "NO",
          "CUSTOMER NO",
          "NAME",
          "ADDRESS",
          "PLACE",
          "PINCODE",
          "PHONE NO",
          "ADDITIONAL NO",
          "REFERENCE",
          "PROOF TYPE",
          "PROOF NO",
        ],
      ],
      body: customerData.map((item, index) => [
        index + 1,
        item.customer_no,
        item.name,
        item.customer_details,
        item.place,
        item.pincode,
        item.mobile_number,
        item.addtionsonal_mobile_number,
        item.reference,
        item.upload_type,
        item.proof_number,
      ]),
      styles: {
        fontSize: 10, // reduce font to fit more columns
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [22, 160, 133], // optional: header color
        textColor: 255,
        fontStyle: "bold",
      },
      columnStyles: {
        3: { cellWidth: 40 }, // ADDRESS column wider
        4: { cellWidth: 25 }, // PLACE column
        8: { cellWidth: 30 }, // REFERENCE column
      },
      theme: "grid",
      didDrawPage: (data) => {
        // optional: page numbers
        const pageCount = doc.getNumberOfPages();
        doc.setFontSize(10);
        doc.text(
          `Page ${pageCount}`,
          doc.internal.pageSize.getWidth() - 20,
          doc.internal.pageSize.getHeight() - 10
        );
      },
    });

    doc.save("Customer_List.pdf");
  };

  const handleDownloadExcel = () => {
    const wb = XLSX.utils.book_new();
    const wsData = [
      [
        "NO",
        "CUSTOMER NO",
        "NAME",
        "ADDRESS",
        "PLACE",
        "PINCODE",
        "PHONE NO",
        "ADDITIONAL NO",
        "REFERENCE",
        "PROOF TYPE",
        "PROOF NO",
      ],
      ...customerData.map((item, index) => [
        index + 1,
        item.customer_no,
        item.name,
        item.customer_details,
        item.place,
        item.pincode,
        item.mobile_number,
        item.addtionsonal_mobile_number,
        item.reference,
        item.upload_type,
        item.proof_number,
      ]),
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, "Customers");
    XLSX.writeFile(wb, "Customer_List.xlsx");
  };
  // 3. Define Material React Table Columns
  const columns = useMemo(
    () => [
      {
        accessorFn: (originalRow) => originalRow.id,
        header: "S.No",
        size: 50,
        enableColumnFilter: false,
        Cell: ({ row }) => row.index + 1, // Uses row index for sequential numbering
      },

      {
        accessorKey: "proof",
        header: "Customer Image",
        size:30,
        Cell: ({ cell }) => {
          const proofArray = cell.getValue();
          const imageUrl =
            proofArray && proofArray.length > 0 ? proofArray[0] : null;

          return (
            <Box
              sx={{
                alignItems: "center",
                height: "100%",
                width: "100%",
              }}
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Customer Proof"
                  className="customer-listing-img"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                  onClick={() => handlePreviewOpen(imageUrl)}
                />
              ) : (
                <span>-</span>
              )}
            </Box>
          );
        },
      },
      {
        accessorKey: "customer_no",
        header: "Customer No",
        size: 70,
      },
      {
        accessorKey: "name",
        header: "Customer Name",
        size: 70,
      },
      {
        accessorKey: "mobile_number",
        header: "Mobile No.",
        size: 70,
      },
      {
        accessorKey: "customer_details",
        header: "Address",
        size: 70,
      },
      {
        accessorKey: "place",
        header: " Place",
        size: 70,
      },
      {
        id: "action",
        header: "Action",
        size: 100,
        enableColumnFilter: false,
        enableColumnOrdering: false,
        enableSorting: false,
        
        Cell: ({ row }) => (
          <Box
            sx={{
          justifyContent: "center",
          gap: "4rem",
            }}
          >
             {/* View Icon */}
            <Tooltip title="Edit">
              <IconButton
                onClick={() => handleJewelcustomerViewClick(row.original)}
                sx={{ padding: 0 }}
              >
                <VisibilityIcon/>
              </IconButton>
                 </Tooltip>
            {/* Edit Icon */}
            <Tooltip title="Edit">
              <IconButton
                onClick={() => handleJewelcustomerEditClick(row.original)}
                sx={{ color: "#0d6efd", padding: 0 }}
              >
                <LiaEditSolid />
              </IconButton>
            </Tooltip>

            {/* Delete Icon */}
            <Tooltip title="Delete">
              <IconButton
                onClick={() =>
                  handleJewelcustomerDeleteClick(row.original.customer_id)
                }
                sx={{ color: "#dc3545", padding: 0 }}
              >
                <MdOutlineDelete />
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },
    ],
    []
  );

  // 4. Update JSX to render MaterialReactTable
  return (
    <div>
      <Container fluid>
        <Row>
          <Col lg="7" md="6" xs="6">
            <div className="page-nav py-3">
              <span class="nav-list">Customer</span>
            </div>
          </Col>
          <Col lg="5" md="6" xs="6" className="align-self-center text-end">
            <ClickButton
              label={<>Add Customer </>}
              onClick={() => navigate("/console/master/customer/create")}
            ></ClickButton>
          </Col>
          {/* ... (Search Bar remains the same) ... */}
          {/* <Col
            lg="3"
            md="5"
            xs="12"
            className="py-1"
            style={{ marginLeft: "-10px" }}
          >
            <TextInputForm
              placeholder={"Search Group"}
              prefix_icon={<FaMagnifyingGlass />}
              onChange={(e) => handleSearch(e.target.value)}
              labelname={"Search"}
            >
              {" "}
            </TextInputForm>
          </Col> */}
          <Col lg={9} md={12} xs={12} className="py-2"></Col>

          {/* 5. Replace TableUI with MaterialReactTable */}
          {loading ? (
            <LoadingOverlay isLoading={loading} />
          ) : (
            <>
              <Col lg="12" md="12" xs="12" className="px-0">
                <div className="py-1">
                  <MaterialReactTable
                    columns={columns}
                    data={customerData}
                    enableColumnActions={false}
                    enableColumnFilters={true} 
                    enablePagination={true}
                    enableSorting={true}
                    initialState={{ density: "compact" }}
                    muiTablePaperProps={{
                      sx: {
                        borderRadius: "5px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        //textAlign: "center",
                      },
                    }}
                    muiTableHeadCellProps={{
                      sx: {
                        fontWeight: "bold",
                        backgroundColor: "#f8f9fa", // Light gray header background
                      },
                    }}
                  />
                </div>
              </Col>
            </>
          )}
          <Col lg="4"></Col>
        </Row>
      </Container>
      <Dialog
        open={previewOpen}
        onClose={handlePreviewClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent sx={{ padding: 0 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              p: 2,
            }}
          >
            {/* The full-size image */}
            <img
              src={previewImage}
              alt="Customer Proof Preview"
              style={{
                maxWidth: " 80%",
                maxHeight: "80vh",
                objectFit: "contain",
              }}
            />

            {/* Close Button */}
            <Delete
              label="Close"
              onClick={handlePreviewClose}
              style={{ marginTop: "16px" }}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Customer;
