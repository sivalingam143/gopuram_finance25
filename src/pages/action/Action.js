import React, { useState, useEffect, useMemo } from "react";
import { Container, Col, Row } from "react-bootstrap";
import { ClickButton } from "../../components/ClickButton";
import { useNavigate } from "react-router-dom";
import API_DOMAIN from "../../config/config";
import LoadingOverlay from "../../components/LoadingOverlay";
import { useLanguage } from "../../components/LanguageContext";

// 💡 NEW IMPORTS FOR MATERIAL REACT TABLE
import { MaterialReactTable } from "material-react-table";
import { Box, Tooltip, IconButton } from "@mui/material";
import { LiaEditSolid } from "react-icons/lia";
import { MdOutlineDelete } from "react-icons/md";

const Action = () => {
  const navigate = useNavigate();
  const { t, cacheVersion } = useLanguage();
  const [searchText, setSearchText] = useState("");
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. Handlers for Edit and Delete Actions
  const handleActionEditClick = (rowData) => {
    console.log("Edit Group3344443:", rowData);
    console.log("Edit Group:", rowData);
    navigate("/console/master/action/create", {
      state: {
        type: "edit",

        rowData: rowData,
      },
    });
  };
  const handleActionDeleteClick = async (actionId) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_DOMAIN}/action.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          delete_action_id: actionId,
        }),
      });
      const responseData = await response.json();
      console.log(responseData);
      if (responseData.head.code === 200) {
        navigate("/console/master/action");
        window.location.reload();
        setLoading(false);
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
      const response = await fetch(`${API_DOMAIN}/action.php`, {
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
      if (responseData.head.code === 200) {
        const actionArray = Array.isArray(responseData.body.action)
          ? responseData.body.action
          : responseData.body.action
          ? [responseData.body.action]
          : [];
        setUserData(actionArray);
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
        accessorKey: "receipt_no",
        header: t("Customer No"),
        size: 50,
      },
      {
        accessorKey: "name",
        header: t("Customer Name"),
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
                onClick={() => handleActionEditClick(row.original)}
                sx={{ color: "#0d6efd", padding: 0 }}
              >
                <LiaEditSolid />
              </IconButton>
            </Tooltip>

            {/* Delete Icon */}
            <Tooltip title={t("Delete")}>
              <IconButton
                onClick={() => handleActionDeleteClick(row.original.action_id)}
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
              <span className="nav-list">{t("Action")}</span>
            </div>
          </Col>
          <Col lg="5" md="6" xs="6" className="align-self-center text-end">
            <ClickButton
              label={<>{t("Add Action")}</>}
              onClick={() => navigate("/console/master/action/create")}
            ></ClickButton>
          </Col>
          {/* ... (Search Bar - Left Commented Out as per original code) ... */}
          {/* If the search bar is uncommented, the labels/placeholders should be translated:
          <TextInputForm
            placeholder={t("Search Action")}
            prefix_icon={<FaMagnifyingGlass />}
            onChange={(e) => setSearchText(e.target.value)}
            labelname={t("Search")}
          >
          </TextInputForm> */}

          <Col lg={9} md={12} xs={12} className="py-2"></Col>

          {/* 5. MaterialReactTable */}
          {loading ? (
            <LoadingOverlay isLoading={loading} />
          ) : (
            <>
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
            </>
          )}
          <Col lg="4"></Col>
        </Row>
      </Container>
    </div>
  );
};

export default Action;
