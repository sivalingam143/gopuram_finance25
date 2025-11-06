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

// Note: Pagnation and TableUI are no longer needed
// Note: MobileView is not strictly needed as MRT handles responsiveness

const Group = () => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const [searchText, setSearchText] = useState("");
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);
  // UserTablehead array is no longer strictly needed for MRT

  // 1. Placeholder Handlers (Replace with your actual logic)
  const handleJewelGroupEditClick = (rowData) => {
      console.log("Edit Group3344443:", rowData);
    console.log("Edit Group:", rowData);
    navigate("/console/master/group/create", { state: { 
            type: "edit", 
           
            rowData: rowData 
        } });
  };

  const handleJewelGroupDeleteClick = (groupId) => {
    console.log("Delete Group ID:", groupId);
    // Your delete confirmation and API call logic goes here
  };

  // 2. Data Fetching Logic (Unchanged)
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_DOMAIN}/group.php`, {
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
          Array.isArray(responseData.body.group)
            ? responseData.body.group
            : [responseData.body.group]
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
  
  const handleSearch = (value) => {
    setSearchText(value);
  };

  // 3. Define Material React Table Columns
  const columns = useMemo(
    () => [
      {
        accessorFn: (originalRow) => originalRow.id,
        header: "No",
        size: 50,
        enableColumnFilter: false,
        Cell: ({ row }) => row.index + 1, // Uses row index for sequential numbering
      },
      {
        accessorKey: "Group_type",
        header: "Group",
        size: 200,
      },
      {
        // Action Column Definition
        accessorKey: "Action",
        header: "Action",
        size: 100,
        enableColumnFilter: false,
        enableColumnOrdering: false,
        enableSorting: false,
        Cell: ({ row }) => (
          <Box sx={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
            {/* Edit Icon (isAdmin check removed for simplicity, re-add if needed) */}
            <Tooltip title="Edit">
              <IconButton
                onClick={() => handleJewelGroupEditClick(row.original)}
                sx={{ color: '#0d6efd' }} // Blue
              >
                <LiaEditSolid />
              </IconButton>
            </Tooltip>

            {/* Delete Icon */}
            <Tooltip title="Delete">
              <IconButton
                onClick={() => handleJewelGroupDeleteClick(row.original.Group_id)}
                sx={{ color: '#dc3545' }} // Red
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
          {/* ... (Navigation and Add Group button remain the same) ... */}
          <Col lg="7" md="6" xs="6">
            <div className="page-nav py-3">
              <span class="nav-list">Group</span>
            </div>
          </Col>
          <Col lg="5" md="6" xs="6" className="align-self-center text-end">
            <ClickButton
              label={<>Add Group</>}
              onClick={() => navigate("/console/master/group/create")}
            ></ClickButton>
          </Col>
          {/* ... (Search Bar remains the same) ... */}
          <Col lg="3" md="5" xs="12" className="py-1" style={{ marginLeft: "-10px" }}>
            <TextInputForm
              placeholder={"Search Group"}
              prefix_icon={<FaMagnifyingGlass />}
              onChange={(e) => handleSearch(e.target.value)}
              labelname={"Search"}
            >
              {" "}
            </TextInputForm>
          </Col>
          <Col lg={9} md={12} xs={12} className="py-2"></Col>
          
          {/* 5. Replace TableUI with MaterialReactTable */}
          {loading ? (
            <LoadingOverlay isLoading={loading} />
          ) : (
            <>
              <Col lg="12" md="12" xs="12" className="px-0">
                <div className="py-1">
                  {/* Note: MobileView rendering is typically replaced by MRT's built-in responsiveness */}
                  
                  <MaterialReactTable
                    columns={columns}
                    data={userData}
                    enableColumnActions={false}
                    enableColumnFilters={true} // Enable filters for searchability
                    enablePagination={true}
                    enableSorting={true}
                    initialState={{ density: 'compact' }}
                    muiTablePaperProps={{
                      sx: {
                        borderRadius: "5px",
                        // Keep the existing style property for the table container
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      }
                    }}
                    muiTableHeadCellProps={{
                      sx: {
                        fontWeight: 'bold',
                        backgroundColor: '#f8f9fa', // Light gray header background
                      }
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

export default Group;