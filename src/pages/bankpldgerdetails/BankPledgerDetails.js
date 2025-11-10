import React, { useState, useEffect, useMemo } from "react"; // ADD useMemo
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

const BankPledgerDetails = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);

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
        accessorKey: "name",
        header: "Pleger Name",
        size: 50,
      },
      {
        accessorKey: "mobile_no",
        header: "Mobile No",
        size: 50,
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
              gap: "2 rem",
            }}
          >
            {/* Edit Icon */}
            <Tooltip title="Edit">
              <IconButton
                onClick={() => handleBankPledgerDetailsEditClick(row.original)}
                sx={{ color: "#0d6efd", padding: 0 }}
              >
                <LiaEditSolid />
              </IconButton>
            </Tooltip>

            {/* Delete Icon */}
            <Tooltip title="Delete">
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
    []
  );

  // 4. Update JSX to render MaterialReactTable
  return (
    <div>
      <Container fluid>
        <Row>
          <Col lg="7" md="6" xs="6">
            <div className="page-nav py-3">
              <span class="nav-list">Bank Pledger</span>
            </div>
          </Col>
          <Col lg="5" md="6" xs="6" className="align-self-center text-end">
            <ClickButton
              label={<>Add Bank Pledger</>}
              onClick={() =>
                navigate("/console/master/bankpledgerdetails/create")
              }
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

export default BankPledgerDetails;
