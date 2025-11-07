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

const User = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    RoleSelection: "",
    Username: "",
  });

  // 1. Handlers for Edit and Delete Actions
  const handleEditClick = (rowData) => {
    navigate("/console/user/create", {
      state: {
        type: "edit",

        rowData: rowData,
      },
    });
  };
  const handleDeleteClick = async (userId) => {
    console.log("Delete Group ID:", userId);
    setLoading(true);
    try {
      const response = await fetch(`${API_DOMAIN}/users.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
         delete_user_id: userId,
        }),
      });
      const responseData = await response.json();
      if (responseData.head.code === 200) {
        navigate("/console/user");
        window.location.reload();
        //setLoading(false);
      } else {
        console.log(responseData.head.msg);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);
      setLoading(true);
    }
  };

  const user = JSON.parse(localStorage.getItem("user")) || {};
 const isAdmin = user.role === "Admin";

  // 2. Data Fetching Logic (Unchanged)
     useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_DOMAIN}/users.php`, {
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
          let sortedData = responseData.body.user;

          if (formData.RoleSelection) {
            sortedData = sortedData.filter(
              (user) => user.RoleSelection === formData.RoleSelection
            );
          }

          if (formData.Username) {
            sortedData = sortedData.filter(
              (user) => user.Name === formData.Username
            );
          }

          setUserData(sortedData);
          setLoading(false);
        } else {
          throw new Error(responseData.head.msg);
        }
      } catch (error) {
        setLoading(false);
        console.error("Error fetching data:", error.message);
      }
    };
    fetchData();
  }, [searchText, formData]);
  // const fetchData = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await fetch(`${API_DOMAIN}/users.php`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         search_text: searchText,
  //       }),
  //     });
  //     const responseData = await response.json();

  //     if (responseData.head.code === 200) {
  //       setUserData(
  //         Array.isArray(responseData.body.group)
  //           ? responseData.body.group
  //           : [responseData.body.group]
  //       );
  //       setLoading(false);
  //     } else {
  //       throw new Error(responseData.head.msg);
  //     }
  //   } catch (error) {
  //     setLoading(false);
  //     console.error("Error fetching data:", error.message);
  //   }
  // };

  // useEffect(() => {
  //   fetchData();
  // }, [searchText]);


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
        accessorKey: "Name",
        header: "Name",
        size: 50,
      },
      {
        accessorKey: "RoleSelection",
        header: "Share",
        size: 50,
      },
      {
        accessorKey: "Mobile_Number",
        header: "Mobile Number",
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
                onClick={() => handleEditClick(row.original)}
                sx={{ color: "#0d6efd", padding: 0 }}
              >
                <LiaEditSolid />
              </IconButton>
            </Tooltip>

            {/* Delete Icon */}
            <Tooltip title="Delete">
              <IconButton
                onClick={() =>
                  handleDeleteClick(row.original.Group_id)
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
          {/* ... (Navigation and Add Group button remain the same) ... */}
          <Col lg="7" md="6" xs="6">
            <div className="page-nav py-3">
              <span class="nav-list">User$Access</span>
            </div>
          </Col>
          <Col lg="5" md="6" xs="6" className="align-self-center text-end">
           {isAdmin &&(
            <ClickButton
              label={<>Add User</>}
              onClick={() => navigate("/console/user/create")}
            >
              
            </ClickButton>
             )}
            
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
                  {/* Note: MobileView rendering is typically replaced by MRT's built-in responsiveness */}

                  <MaterialReactTable
                    columns={columns}
                    data={userData}
                    enableColumnActions={false}
                    enableColumnFilters={true} // Enable filters for searchability
                    enablePagination={true}
                    enableSorting={true}
                    initialState={{ density: "compact" }}
                    muiTablePaperProps={{
                      sx: {
                        borderRadius: "5px",
                        // Keep the existing style property for the table container
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

export default User;
