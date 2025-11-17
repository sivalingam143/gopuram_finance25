import React, { useState, useEffect,useMemo } from "react";
import { Container, Col, Row } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import TableUI from "../../components/Table";
import { TextInputForm } from "../../components/Forms";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { ClickButton } from "../../components/ClickButton";
import LoadingOverlay from "../../components/LoadingOverlay";
import { useLanguage } from "../../components/LanguageContext";
import dayjs from "dayjs";
import API_DOMAIN from "../../config/config";
import { MaterialReactTable } from "material-react-table";
import { IconButton, Menu, MenuItem,Chip } from '@mui/material';
import { BiDotsVerticalRounded } from "react-icons/bi";
import { MdCheckCircle, MdClose } from "react-icons/md";


const BankPledgerViewDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage(); 
  
  const { records = [], loanNo } = location.state || {};
  const [filteredRecords, setFilteredRecords] = useState(records);
  console.log(filteredRecords);
  const [detailsSearchText, setDetailsSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const isAdmin = user.role === "Admin";
  
  
  useEffect(() => {
    // Filter by name on search change
    if (detailsSearchText) {
      const filtered = records.filter((record) =>
        String(record.name || "")
          .toLowerCase()
          .includes(detailsSearchText.toLowerCase())
      );
      setFilteredRecords(filtered);
    } else {
      setFilteredRecords([...records]);
    }
  }, [detailsSearchText, records]);

 

 
 
  const handleBankPledgerViewClick = (rowData) => {
    navigate("/console/master/bankpledger/create", {
      state: { type: "view", rowData: rowData },
    });
  };
  const handleBankPledgerDeleteClick = async (bank_pledge_id) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_DOMAIN}/bank_pledger.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          delete_bank_pledger_id: bank_pledge_id,
        }),
      });
      const responseData = await response.json();
      if (responseData.head.code === 200) {
        navigate("/console/master/bankpledger");
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
  const handleBankPledgerEditClick = (rowData) => {
    navigate("/console/master/bankpledger/create", {
      state: { type: "edit", rowData: rowData },
    });
  };
   const handleBankPledgerClosingClick = (rowData) => {
    navigate("/console/master/bankpledger/create", {
      state: { type: "closing", rowData: rowData },
    });
  };


const calculateDueDays = (pledgeDate, pledgeDueDate) => {
    const dueDate = new Date(pledgeDueDate + "T00:00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return String(Math.max(0, diffDays)).trim();
};


  const columns = useMemo(
  () => [
    {
      accessorKey: "s_no_key", // Use an ID if no direct data key exists
      header: t("S.No"),
      size: 50,
      enableColumnFilter: false,
      Cell: ({ row }) => row.index + 1, // Correctly handles pagination index
    },
    {
      header: t("Name"),
      accessorKey: "name",
    },
    {
      header: t("Pawn Loan No"),
      accessorKey: "pawn_loan_no",
    },
    {
      header: t("Pawn Value"),
      accessorKey: "pawn_value",
    },
    {
      header: t("Pledge Date"),
      accessorKey: "pledge_date",
    },
    {
      header: t("Pledge Due Date"),
      accessorKey: "pledge_due_date",
    },
   {
      header: t("Status"),
      accessorKey: "status", 
      size: 100, 
      Cell: ({ cell }) => {
        const status = cell.getValue();
        const isClosed = status === "Closed";
        
        return (
          <Chip
            label={t(status)} 
            size="small"
            icon={isClosed ? <MdClose /> : <MdCheckCircle />}
            sx={{
              fontWeight: 'bold',
              ...(isClosed && {
                backgroundColor: '#dc3545', // Your red color
                color: 'white',
                '& .MuiChip-icon': { 
                  color: 'white',
                },
              }),
              ...(!isClosed && {
                backgroundColor: '#e2f0e3',
                color: '#28a745', 
                '& .MuiChip-icon': { 
                  color: '#28a745',
                },
              }),
            }}
          />
        );
      },
    },
 

{
      header: t("Due Days"),
      id: "due_days", 
      size: 100,
      enableColumnFilter: false,
      muiTableHeadCellProps: {
        sx: {
          textAlign: "left", 
          paddingLeft: '8px', 
          paddingRight: '0px',
        },
      },
      muiTableBodyCellProps: {
        sx: {
          // 💥 Fix: Collapse injected whitespace
          paddingLeft: '8px', // Keep your desired left padding
          paddingRight: '0px', // Keep your desired right padding
          fontSize: '0', // Sets font size of &nbsp; to zero
        },
      },
     Cell: ({ row }) => {
        const rowData = row.original;
        
        if (rowData.status === "Closed") {
          return <span className="due-days-closed" style={{fontSize: '1rem'}}>—</span>;
        }

        // Cleaning logic remains the same (it was already correct)
        const daysLeft = calculateDueDays(
          rowData.pledge_date,
          rowData.pledge_due_date
        );
        const isUrgent = daysLeft <= 10;
        let daysTranslation = t("days")
          .replace(/&nbsp;/g, '')
          .replace(/[\s\xA0]/g, ' ') 
          .trim()
          .replace(/\s{2,}/g, ' ');

        const dueDaysText = `${daysLeft} ${daysTranslation}`;
        
        return (
          <span
            className={`due-days-text ${isUrgent ? "blink-text" : ""}`}
            style={{ 
              color: isUrgent ? "red" : "green", 
              fontWeight: 'bold', 
              display: 'block',
              // ⚠️ Reset font size
              fontSize: '1rem', 
              textAlign: 'left',
            }}
          >{dueDaysText}</span>
        );
      },
    },
{
      header: t("Action"),
      id: "actions",
      size: 100,
      enableColumnFilter: false,
      enableSorting: false,
      muiTableBodyCellProps: {
        sx: {
          // Centering fix: ensures the <td> has no padding and uses Flexbox to center the content
          padding: '0', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          height: '100%',
        },
      },
      Cell: ({ row }) => {
        const rowData = row.original;
        const [anchorEl, setAnchorEl] = React.useState(null);
        const open = Boolean(anchorEl);
        
        const handleClick = (event) => {
          setAnchorEl(event.currentTarget);
        };

        const handleClose = () => {
          setAnchorEl(null);
        };

        return (
    <div
            // Removed inline styles (padding/width) for proper centering by the <td>
          >
        
            <IconButton onClick={handleClick} size="small" >
              <BiDotsVerticalRounded />
            </IconButton>

            <Menu
              // 1. Pass the anchor and state control props
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
slotProps={{ 
            paper: { 
              sx: {
                width: 120,
               
              },
            },
            
          }}
          
            >
                {rowData.status === "Closed" ? (
                    <React.Fragment> 
                    <MenuItem onClick={() => { handleBankPledgerViewClick(rowData); handleClose(); }}> {t("View")}</MenuItem>
                    <MenuItem onClick={() => { handleBankPledgerDeleteClick(rowData.bank_pledge_id); handleClose(); }}> {t("Delete")}</MenuItem>
                    </React.Fragment>
                ) : (
                    <React.Fragment> 
                    {isAdmin && (<MenuItem onClick={() => { handleBankPledgerEditClick(rowData); handleClose(); }}> {t("Edit")}</MenuItem>)}
                    <MenuItem onClick={() => { handleBankPledgerClosingClick(rowData); handleClose(); }}> {t("Closing")}</MenuItem>
                    <MenuItem onClick={() => { handleBankPledgerDeleteClick(rowData.bank_pledge_id); handleClose(); }}> {t("Delete")}</MenuItem>
                    </React.Fragment> 
                )}
            </Menu>
</div>
        );
      },
    },

  ],
  [
    t,
    isAdmin,
    handleBankPledgerViewClick,
    handleBankPledgerDeleteClick,
    handleBankPledgerEditClick,
    handleBankPledgerClosingClick,
  ] // Include all dependencies for correct memoization
);

 const handleBack = () => {
    navigate("/console/master/bankpledger");
  };

//   if (!records || records.length === 0) {
//     return (
//       <div>
//         <Container fluid>
//           <Row>
//             <Col lg="12">
//               <div className="page-nav py-3">
//                 <span className="nav-list">{t("Bank Pledger Details")}</span> 
//               </div>
//             </Col>
//           </Row>
//           <Row>
//             <Col lg="12" className="text-center py-4">
//               <p>{t("No details available for this loan.")}</p> 
//               <ClickButton label={<>{t("Back")}</>} onClick={handleBack} /> 
//             </Col>
//           </Row>
//         </Container>
//       </div>
//     );
//   }
  return (
    <div>
      <LoadingOverlay isLoading={loading} />
      <Container fluid>
        <Row>
          <Col lg="7" md="6" xs="6">
            <div className="page-nav py-3">
              <span className="nav-list">{t("Bank Pledger Details")}</span>
            </div>
          </Col>
          <Col lg="5" md="6" xs="6" className="align-self-center text-end">
            <ClickButton label={<>{t("Back")}</>} onClick={handleBack} /> 
          </Col>
        </Row>
        <Row>
          
            <div className="py-1">
              {filteredRecords.length === 0 ? (
             
                <p>{t("No records found for the search criteria.")}</p> 
              ) : (
                <MaterialReactTable
                                  columns={columns}
                                  data={filteredRecords}
                                  enableColumnActions={true}
                                  enableColumnFilters={true}
                                  enableDensityToggle={true}
                                  enableFullScreenToggle={false}
                                  enableHiding={true}
                                  enableGlobalFilter={true}
                                  initialState={{ density: "compact" }}
                                  muiTableContainerProps={{
                                    sx: {
                                      borderRadius: "5px",
                                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                    },
                                  }}
                                  muiTableHeadCellProps={{
                                    sx: {
                                      fontWeight: "bold",
                                      color: "black",
                                    },
                                  }}
                                />
              )}
            </div>
        
        </Row>
      </Container>
    </div>
  );
};

export default BankPledgerViewDetails;