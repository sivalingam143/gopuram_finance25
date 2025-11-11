import React, { useState, useEffect, useMemo } from "react";
import { Container, Col, Row } from "react-bootstrap";
import { TextInputForm } from "../../components/Forms";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { ClickButton } from "../../components/ClickButton";
import { useNavigate } from "react-router-dom";
import API_DOMAIN from "../../config/config";
import LoadingOverlay from "../../components/LoadingOverlay";

// 💡 NEW IMPORTS FOR MATERIAL REACT TABLE
import { MaterialReactTable } from "material-react-table";
import { Box, Tooltip, IconButton } from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility'
import { useLanguage } from '../../components/LanguageContext'; 

const BankPledger = () => {
  const navigate = useNavigate();
  const { t } = useLanguage(); 
  const [loanSearchText, setLoanSearchText] = useState("");
  const [allGroupedData, setAllGroupedData] = useState([]);
  const [groupedData, setGroupedData] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. Handlers for view Actions
  const handleViewDetails = (records, loanNo) => {
    navigate("/console/master/bankpledger/viewdetails", {
      state: { records, loanNo },
    });
  };

  // 2. Data Fetching Logic (Unchanged)
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_DOMAIN}/bank_pledger.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          search_text: "",
        }),
      });
      const responseData = await response.json();
      if (responseData.head.code === 200) {
        const grouped = responseData.body.grouped_pledger || [];
        setAllGroupedData(grouped);
        updateGroupedData(grouped);
        setLoading(false);
      } else {
        throw new Error(responseData.head.msg);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error.message);
    }
  };

const updateGroupedData = (data) => {
    let filtered = data;
    if (loanSearchText) {
      filtered = data.filter((group) =>
        String(group.loan_no || "")
          .toLowerCase()
          .includes(loanSearchText.toLowerCase())
      );
    }
    setGroupedData(filtered);
  };
  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    updateGroupedData(allGroupedData);
  }, [loanSearchText]);
  const handleLoanSearch = (value) => {
    setLoanSearchText(value);
  }

  // 3. Define Material React Table Columns
  const columns = useMemo(
    () => [
      {
        accessorFn: (originalRow) => originalRow.id,
        header: t("S.No"), // ✅ Translated
        size: 50,
        enableColumnFilter: false,
        Cell: ({ row }) => row.index + 1, // Uses row index for sequential numbering
      },
      {
        accessorKey: "bank_loan_no",
        header: t("Pawn Loan No."), 
        size: 50,
      },
      {
        id: "action",
        header: t("Action"),
        size: 100,
        enableColumnFilter: false,
        enableColumnOrdering: false,
        enableSorting: false,
        Cell: ({ row }) => (
          <Box
            sx={{
              justifyContent: "center",
              gap: "2 rem",
            }}
          >
            {/* View Icon */}
            <Tooltip title={t("Customer Details")}> 
              <IconButton
                onClick={() => handleViewDetails(row.original, row.original.pawn_loan_no)} // Pass loanNo or equivalent if needed in details page
                sx={{ padding: 0 }}
              >
                <VisibilityIcon/>
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },
    ],
    [t] 
  );

  // 4. Update JSX to render MaterialReactTable
  return (
    <div>
      <Container fluid>
        <Row>
          
          <Col lg="7" md="6" xs="6">
            <div className="page-nav py-3">
              <span class="nav-list">{t("Bank Pledger")}</span> 
            </div>
          </Col>
          <Col lg="5" md="6" xs="6" className="align-self-center text-end">
            <ClickButton
              label={<>{t("Add Bank Pledger")}</>} 
              onClick={() => navigate("/console/master/bankpledger/create")}
            ></ClickButton>
          </Col>
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
                    data={groupedData}
                    enableColumnActions={false}
                    enableColumnFilters={false}
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
    </div>
  );
};

export default BankPledger;