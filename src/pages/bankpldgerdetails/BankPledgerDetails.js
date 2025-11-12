import React, { useState, useEffect, useMemo } from "react";
import { Container, Col, Row } from "react-bootstrap";
import { TextInputForm } from "../../components/Forms";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { ClickButton } from "../../components/ClickButton";
import { useNavigate } from "react-router-dom";
import API_DOMAIN from "../../config/config";
import { useMediaQuery } from "react-responsive";
import LoadingOverlay from "../../components/LoadingOverlay";

// 💡 NEW IMPORTS FOR MATERIAL REACT TABLE
import { MaterialReactTable } from "material-react-table";
import { Box, Tooltip, IconButton } from "@mui/material";
import { LiaEditSolid } from "react-icons/lia";
import { MdOutlineDelete } from "react-icons/md";
import { useLanguage } from "../../components/LanguageContext";

const BankPledgerDetails = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { t, cacheVersion } = useLanguage();

  // 1. Handlers for Edit and Delete Actions
  const handleBankPledgerDetailsEditClick = (rowData) => {
    console.log("Edit Group3344443:", rowData);
    console.log("Edit Group:", rowData);
    navigate("/console/master/bankpledgerdetails/create", {
      state: {
        type: "edit",
        rowData: rowData,
      },
    });
  };

  const handleBankPledgerDetailsDeleteClick = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_DOMAIN}/bank_pledger_details.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          delete_bank_pledger_details_id: id,
        }),
      });
      const responseData = await response.json();
      if (responseData.head.code === 200) {
        navigate("/console/master/bankpledgerdetails");
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

  // 2. Data Fetching Logic (Unchanged)
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_DOMAIN}/bank_pledger_details.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          search_text: searchText,
        }),
      });
      const responseData = await response.json();

      if (responseData.head.code === 200) {
        setUserData(
          Array.isArray(responseData.body.pledger)
            ? responseData.body.pledger
            : [responseData.body.pledger]
        );
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
    fetchData();
  }, [searchText]);

  // 3. Define Material React Table Columns (UPDATED for translation)
  const columns = useMemo(
    () => [
      {
        accessorKey: "s_no_key", 
        header: t("S.No"),
        size: 50,
        enableColumnFilter: false,
        Cell: ({ row }) => row.index + 1,
      },
      {
        accessorKey: "name",
        header: t("Pleger Name"), 
        size: 50,
      },
      {
        accessorKey: "mobile_no",
        header: t("Mobile No"),
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
                onClick={() => handleBankPledgerDetailsEditClick(row.original)}
                sx={{ color: "#0d6efd", padding: 0 }}
              >
                <LiaEditSolid />
              </IconButton>
            </Tooltip>

            {/* Delete Icon */}
            <Tooltip title={t("Delete")}>
              <IconButton
                onClick={() =>
                  handleBankPledgerDetailsDeleteClick(
                    row.original.bank_pledger_details_id
                  )
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
    [t, cacheVersion] 
  );

  // 4. Update JSX to render MaterialReactTable
  return (
    <div>
      {loading && <LoadingOverlay isLoading={loading} />}
      <Container fluid>
        <Row>
          <Col lg="7" md="6" xs="6">
            <div className="page-nav py-3">
              <span class="nav-list">{t("Bank Pledger")}</span>{" "}
              {/* ✅ Translated */}
            </div>
          </Col>
          <Col lg="5" md="6" xs="6" className="align-self-center text-end">
            <ClickButton
              label={<>{t("Add Bank Pledger")}</>}
              onClick={() =>
                navigate("/console/master/bankpledgerdetails/create")
              }
            ></ClickButton>
          </Col>
          
          {/* <Col lg={3} md={12} xs={12} className="py-2">
            <TextInputForm
              type="text"
              placeholder={t("Search")} 
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              icon={<FaMagnifyingGlass />}
            />
          </Col> */}

          <Col lg={9} md={12} xs={12} className="py-2"></Col>
          
          <Col lg="12" md="12" xs="12" className="px-0">
            <div className="py-1">
              <MaterialReactTable
                columns={columns}
                data={userData}
                enableColumnActions={false}
                enableColumnFilters={false}
                enablePagination={true}
                enableSorting={true}
                initialState={{ density: "compact" }}
                // Pass translation to internal text strings
                localization={{
                    noRecordsToDisplay: t('No records to display'), 
                    // Add other strings like 'Show' for pagination if needed
                }}
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
                    backgroundColor: "#f8f9fa",
                  },
                }}
              />
            </div>
          </Col>
          <Col lg="4"></Col>
        </Row>
      </Container>
    </div>
  );
};

export default BankPledgerDetails;