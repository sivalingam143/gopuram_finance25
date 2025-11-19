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
import { LiaEditSolid } from "react-icons/lia";
 import { MdOutlineDelete } from "react-icons/md";

const Transaction = () => {
 const { t,cacheVersion } = useLanguage(); 
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. Handlers for view Actions
   const handleExpenseEditClick = (rowData) => {
    navigate("/console/transaction/create", {
      state: { type: "edit", rowData: rowData },
    });
  };

   const handleExpenseDeleteClick = async (expense_id) => {
    setLoading(true);
    console.log("Deleting expense ID:", expense_id); // Debug
    try {
      const response = await fetch(`${API_DOMAIN}/expense.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "delete", expense_id }),
      });
      const responseData = await response.json();
      console.log(responseData);
      if (responseData.head.code === 200) {
        navigate("/console/transaction");
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
  
 
  // 2. Data Fetching Logic
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_DOMAIN}/expense.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "list", search_text: searchText }),
      });
      const responseData = await response.json();
      console.log(responseData,'siva');
      
      if (responseData.head.code === 200) {
        console.log('siva');
        setExpenseData(responseData.body.expenses || []);
        setLoading(false);
      } else {
        console.error("Error fetching data:", responseData.head.msg);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchText]);

  // 3. Define Material React Table Columns
 const columns = useMemo(
    () => [
      {
        accessorKey: "s_no_key", // Add a unique, stable accessorKey
        header: t("S.No"),
        size: 50,
        enableColumnFilter: false,
        Cell: ({ row }) => row.index + 1,
      },
      {
        accessorKey: "date",
        header: t("Date"),
        size: 50,
      },
      {
        accessorKey: "expense_name",
        header: t("Transaction Name"),
        size: 50,
      },
      {
        accessorKey: "expense_type",
        header: t("Transaction Type"),
        size: 50,
      },
      {
        accessorKey: "amount",
        header: t("Amount"),
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
            {/* Edit Icon */}
            <Tooltip title={t("Edit")}>
              <IconButton
               onClick={() => handleExpenseEditClick(row.original)}
                sx={{ color: "#0d6efd", padding: 0 }}
              >
                <LiaEditSolid />
              </IconButton>
            </Tooltip>

            {/* Delete Icon */}
            <Tooltip title={t("Delete")}>
              <IconButton
               onClick={() =>  handleExpenseDeleteClick(row.original.expense_id)}
                sx={{ color: "#dc3545", padding: 0 }}
              >
                <MdOutlineDelete />
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },
    ],
    [t, cacheVersion]
  );
 

  // 4. Update JSX to render MaterialReactTable
  return (
    <div>
      <Container fluid>
        <Row>
          
          <Col lg="7" md="6" xs="6">
            <div className="page-nav py-3">
              <span class="nav-list">{t("Transaction")}</span> 
            </div>
          </Col>
          <Col lg="5" md="6" xs="6" className="align-self-center text-end">
            <ClickButton
              label={<>{t("Add Transaction")}</>} 
              onClick={() => navigate("/console/transaction/create")}
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
                    data={expenseData}
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
                        backgroundColor: "black", 
                         color:"white",
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

export default Transaction;
