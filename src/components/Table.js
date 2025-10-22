import React, { useState, useEffect } from "react";
import { Table, Button, Dropdown } from "react-bootstrap";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import API_DOMAIN from "../config/config";
import { Buttons } from "./Buttons";
import { MdChevronRight, MdChevronLeft } from "react-icons/md";
import JewelPawnPdfG from "../pdf/JewelPawnPdfg";
import { PDFDownloadLink } from "@react-pdf/renderer";
import LoadingOverlay from "./LoadingOverlay";

const TableUI = ({
  headers,
  body,
  style,
  type,
  rowData,
  planViewAction,
  pageview,
  customActions,
}) => {
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(body.length / itemsPerPage);
  const [loading, setLoading] = useState(false);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, body.length);
  const currentItems = body.slice(startIndex, endIndex);

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const isAdmin = user.role === "Admin";

  const nextPage = () => {
    if (currentPage < totalPages) {
      setLoading(true);
      setTimeout(() => {
        setCurrentPage(currentPage + 1);
        setLoading(false);
      }, 500); // simulate delay
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setLoading(true);
      setTimeout(() => {
        setCurrentPage(currentPage - 1);
        setLoading(false);
      }, 500); // simulate delay
    }
  };

  // useEffect(() => {
  //   setLoading(true);
  //   setTimeout(() => {
  //     setLoading(false);
  //   }, 1000);
  // }, []);
  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() returns month from 0-11
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  const navigate = useNavigate();

  const handleEditClick = (rowData) => {
    navigate("/console/user/create", {
      state: { type: "edit", rowData: rowData },
    });
  };
  const handleDeleteClick = async (user_id) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_DOMAIN}/users.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          delete_user_id: user_id,
        }),
      });

      const responseData = await response.json();
      if (responseData.head.code === 200) {
        navigate("/console/user");
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
  const handleCompanyEditClick = (rowData) => {
    navigate("/console/company/create", {
      state: { type: "edit", rowData: rowData },
    });
  };

  const handleJewelPawningEditClick = (rowData) => {
    navigate("/console/pawn/jewelpawning/create", {
      state: { type: "edit", rowData: rowData },
    });
  };

  const handleJewelPawningprintviewClick = (rowData) => {
    navigate("/console/jewelpawn", {
      state: { type: "pdfview", rowData: rowData },
    });
  };
  const handleJewelPawningofficeprintviewClick = (rowData) => {
    navigate("/console/jewelpawnoffice", {
      state: { type: "pdfview", rowData: rowData },
    });
  };

  const handleJewelRecoveryprintviewClick = (rowData) => {
    navigate("/console/jewelpawnrevery", {
      state: { type: "pdfview", rowData: rowData },
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
        }),
      });

      const responseData = await response.json();

      if (responseData.head.code === 200) {
        navigate("/console/pawn/jewelpawning");
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
  const handleJewelPawngEditClick = (rowData) => {
    navigate("/console/pawn/jewelpawng/create", {
      state: { type: "edit", rowData: rowData },
    });
  };

  const handleJewelPawngprintviewClick = (rowData) => {
    navigate("/console/jewelpawng", {
      state: { type: "pdfview", rowData: rowData },
    });
  };
  const handleJewelInterestprintviewClick = (rowData) => {
    navigate("/console/interest/preview", {
      state: { type: "pdfview", rowData: rowData },
    });
  };

  const handleJewelPawngDeleteClick = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_DOMAIN}/pawnjewelryg.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          delete_pawnjewelry_id: id,
        }),
      });

      const responseData = await response.json();

      if (responseData.head.code === 200) {
        navigate("/console/pawn/jewelpawng");
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
  const handleinterestEditClick = (rowData) => {
    navigate("/console/interest/create", {
      state: { type: "edit", rowData: rowData },
    });
  };
  const handleinterestDeleteClick = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_DOMAIN}/interest.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          delete_interest_id: id,
        }),
      });

      const responseData = await response.json();

      if (responseData.head.code === 200) {
        navigate("/console/interest");
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

  const handleJewelEstimateEditClick = (rowData) => {
    navigate("/console/master/jewelestimate/create", {
      state: { type: "edit", rowData: rowData },
    });
  };
  const handleJewelEstimateDeleteClick = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_DOMAIN}/pawnestimate.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          delete_pawnjewelry_estimate_id: id,
        }),
      });

      const responseData = await response.json();

      if (responseData.head.code === 200) {
        navigate("/console/master/jewelestimate");
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

  const handleJewelUnitEditClick = (rowData) => {
    navigate("/console/master/unit/create", {
      state: { type: "edit", rowData: rowData },
    });
  };
  const handleJewelUnitDeleteClick = async (unit_id) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_DOMAIN}/unit.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          delete_unit_id: unit_id,
        }),
      });

      const responseData = await response.json();

      if (responseData.head.code === 200) {
        navigate("/console/master/unit");
        //  window.location.reload();
      } else {
        console.log(responseData.head.msg);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };

  const handleJewelGroupEditClick = (rowData) => {
    navigate("/console/master/group/create", {
      state: { type: "edit", rowData: rowData },
    });
  };
  const handleJewelGroupDeleteClick = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_DOMAIN}/group.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          delete_Group_id: id,
        }),
      });

      const responseData = await response.json();

      if (responseData.head.code === 200) {
        navigate("/console/master/group");
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

  // const handleJewelcustomerViewClick = (rowData) => {
  //   navigate("/console/master/customer/create", {
  //     state: { type: "view", rowData: rowData },
  //   });
  // };
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

  const handleJewelCategoryEditClick = (rowData) => {
    navigate("/console/master/category/create", {
      state: { type: "edit", rowData: rowData },
    });
  };
  const handleJewelCategoryDeleteClick = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_DOMAIN}/category.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          delete_category_id: id,
        }),
      });

      const responseData = await response.json();

      if (responseData.head.code === 200) {
        navigate("/console/master/category");
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
  const handleBankPledgeEditClick = (rowData) => {
    navigate("/console/pawn/bankpledge/create", {
      state: { type: "edit", rowData: rowData },
    });
  };
  const handleBankPledgeDeleteClick = async (id) => {
    console.log("Deleting bank pledge ID:", id);
    setLoading(true);
    try {
      const response = await fetch(`${API_DOMAIN}/bank_pledge_details.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          delete_bank_pledge_id: id,
        }),
      });

      const responseData = await response.json();

      if (responseData.head.code === 200) {
        navigate("/console/pawn/bankpledge");
      } else {
        console.log(responseData.head.msg);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };

  const handlecategoryTwoEditClick = (rowData) => {
    navigate("/console/expense/category/create", {
      state: { type: "edit", rowData: rowData },
    });
  };
  const handlecategoryTwoDeleteClick = async (id) => {
    console.log("Deleting category two:", id);
    setLoading(true);
    try {
      const response = await fetch(`${API_DOMAIN}/category_two.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          delete_category_id: id,
        }),
      });

      const responseData = await response.json();
      console.log(responseData);
      if (responseData.head.code === 200) {
        navigate("/console/expense");
      } else {
        console.log(responseData.head.msg);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };

  const handleexpenseTwoEditClick = (rowData) => {
    navigate("/console/expense/create", {
      state: { type: "edit", rowData: rowData },
    });
  };
  const handleexpenseTwoDeleteClick = async (id) => {
    console.log("Deleting bank pledge ID:", id);
    setLoading(true);
    try {
      const response = await fetch(`${API_DOMAIN}/expense_two.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          delete_expense_id: id,
        }),
      });

      const responseData = await response.json();

      if (responseData.head.code === 200) {
        navigate("/console/expense");
      } else {
        console.log(responseData.head.msg);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };
  const handleJewelRecoveryEditClick = (rowData) => {
    navigate("/console/master/jewelrecovery/create", {
      state: { type: "edit", rowData: rowData },
    });
  };
  const handleJewelRecoveryDeleteClick = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_DOMAIN}/pawnrecovery.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          delete_pawn_recovery_id: id,
        }),
      });

      const responseData = await response.json();

      if (responseData.head.code === 200) {
        navigate("/console/master/jewelrecovery");
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

  const handleProductEditClick = (rowData) => {
    navigate("/console/master/products/create", {
      state: { type: "edit", rowData: rowData },
    });
  };
  const handleProductDeleteClick = async (product_id) => {
    setLoading(true);
    console.log("Deleting Product ID:", product_id); // Debug
    try {
      const response = await fetch(`${API_DOMAIN}/product.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          delete_product_id: product_id,
        }),
      });
      const responseData = await response.json();
      console.log(responseData);
      if (responseData.head.code === 200) {
        navigate("/console/master/products");
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
  const handleActionEditClick = (rowData) => {
    navigate("/console/master/action/create", {
      state: { type: "edit", rowData: rowData },
    });
  };
  const handleActionDeleteClick = async (action_id) => {
    setLoading(true);

    try {
      const response = await fetch(`${API_DOMAIN}/action.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          delete_action_id: action_id,
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
  const handleStreetEditClick = (rowData) => {
    navigate("/console/master/Street/create", {
      state: { type: "edit", rowData: rowData },
    });
  };
  const handleStreetDeleteClick = async (street_id) => {
    setLoading(true);
    console.log("Deleting street ID:", street_id); // Debug
    try {
      const response = await fetch(`${API_DOMAIN}/street.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          delete_street_id: street_id,
        }),
      });
      const responseData = await response.json();
      console.log(responseData);
      if (responseData.head.code === 200) {
        navigate("/console/master/Street");
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

  return (
    <>
      <LoadingOverlay isLoading={loading} />
      {pageview === "yes" && (
        <div className="text-end">
          <span className="mx-1">
            Page {currentPage} of {totalPages}
          </span>
          <span className="mx-1">
            <Buttons
              lable={<MdChevronLeft />}
              onClick={prevPage}
              disabled={currentPage === 1}
            />
          </span>
          <span className="mx-1">
            <Buttons
              lable={<MdChevronRight />}
              onClick={nextPage}
              disabled={currentPage === totalPages}
            />
          </span>
        </div>
      )}
      <Table responsive="md" style={style}>
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentItems.map((rowData, rowIndex) => (
            <tr key={rowIndex}>
              {type === "USER" && ( // Checking if type is "USER"
                <>
                  {" "}
                  {/* Fragment shorthand */}
                  <td>{rowIndex + 1}</td>
                  <td>{rowData.Name}</td>
                  <td>{rowData.RoleSelection}</td>
                  <td>{rowData.Mobile_Number}</td>
                  {/* <td>{rowData.User_Name}</td>
                <td>{rowData.Password}</td> */}
                  <td>
                    <Dropdown>
                      <Dropdown.Toggle>
                        <Button className="action">
                          <BiDotsVerticalRounded />
                        </Button>
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        {/* <Dropdown.Item onClick={() => handleViewClick(rowData)}>View</Dropdown.Item> */}

                        {isAdmin && ( // Show Edit option only if user is Admin
                          <Dropdown.Item
                            onClick={() => handleEditClick(rowData)}
                          >
                            Edit
                          </Dropdown.Item>
                        )}
                        <Dropdown.Item
                          onClick={() => handleDeleteClick(rowData.user_id)}
                        >
                          Delete
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </>
              )}
              {type === "company" && (
                <>
                  {" "}
                  {/* Fragment shorthand */}
                  <td>{rowIndex + 1}</td>
                  <td>{rowData.company_name}</td>
                  <td>{rowData.mobile_number}</td>
                  <td>{rowData.place}</td>
                  {isAdmin && ( // Show Edit option only if user is Admin
                    <td>
                      <Dropdown>
                        <Dropdown.Toggle>
                          <Button className="action">
                            <BiDotsVerticalRounded />
                          </Button>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item
                            onClick={() => handleCompanyEditClick(rowData)}
                          >
                            Edit
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  )}
                </>
              )}
              {type === "interest" && (
                <>
                  <td>{rowIndex + 1}</td>
                  <td>
                    {(() => {
                      const date = new Date(rowData.interest_receive_date);
                      const yyyy = date.getFullYear();
                      const mm = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
                      const dd = String(date.getDate()).padStart(2, "0");
                      return `${dd}-${mm}-${yyyy}`;
                    })()}
                  </td>

                  <td>{rowData.name}</td>
                  <td>{rowData.receipt_no}</td>
                  <td>{rowData.mobile_number}</td>
                  <td>{rowData.interest_income}</td>
                  <td>
                    <Dropdown>
                      <Dropdown.Toggle>
                        <Button className="action">
                          <BiDotsVerticalRounded />
                        </Button>
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item
                          onClick={() =>
                            handleJewelInterestprintviewClick(rowData)
                          }
                        >
                          print View
                        </Dropdown.Item>
                        {/* <PDFDownloadLink
                          document={<ReceiptPDF data={rowData} />}
                          fileName={`${rowData.receipt_no}.pdf`}
                        >
                          {({ blob, url, loading, error }) => (
                            <a
                              className="dropdown-item"
                              role="button"
                              tabIndex="0"
                              href={url}
                              download={`${rowData.receipt_no}.pdf`}
                            >
                              Download Pdf
                            </a>
                          )}
                        </PDFDownloadLink> */}

                        {isAdmin && ( // Show Edit option only if user is Admin
                          <Dropdown.Item
                            onClick={() => handleinterestEditClick(rowData)}
                          >
                            Edit
                          </Dropdown.Item>
                        )}
                        <Dropdown.Item
                          onClick={() =>
                            handleinterestDeleteClick(rowData.interest_id)
                          }
                        >
                          Delete
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </>
              )}
              {type === "jewelPawning" &&
                (() => {
                  const jewelList = Array.isArray(rowData.jewel_product)
                    ? rowData.jewel_product
                    : typeof rowData.jewel_product === "string"
                    ? JSON.parse(rowData.jewel_product)
                    : [];

                  const totalWeight = jewelList.reduce(
                    (sum, jewel) => sum + parseFloat(jewel.weight || 0),
                    0
                  );
                  const totalNetWeight = jewelList.reduce(
                    (sum, jewel) => sum + parseFloat(jewel.net || 0),
                    0
                  );
                  const jewelNames = jewelList
                    .map(
                      (item) =>
                        `${item.JewelName.replace(/ /g, "\u00A0")} - ${
                          item.count
                        }`
                    )
                    .join(", ");

                  return (
                    <>
                      <td>{rowIndex + 1}</td>
                      <td>{formatDate(rowData.pawnjewelry_date)}</td>
                      <td>{rowData.receipt_no}</td>

                      <td>{rowData.original_amount}</td>
                      <td>{rowData.interest_rate}</td>
                      <td>{totalWeight.toFixed(2)}</td>
                      <td>{jewelNames}</td>
                      <td>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "4px 10px",
                            borderRadius: "5px",
                            fontWeight: "600",
                            fontSize: "0.6rem",
                            backgroundColor:
                              rowData.status === "நகை மீட்கபட்டது"
                                ? "#f21111"
                                : rowData.status === "நகை மீட்கபடவில்லை"
                                ? "#0bb53b"
                                : "#f0f0f0",
                            color:
                              rowData.status === "நகை மீட்கபட்டது" ||
                              rowData.status === "நகை மீட்கபடவில்லை"
                                ? "white"
                                : "#333",
                          }}
                        >
                          {rowData.status}
                        </span>
                      </td>
                      <td>
                        <Dropdown>
                          <Dropdown.Toggle as="div">
                            <Button className="action">
                              <BiDotsVerticalRounded />
                            </Button>
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            {/* <Dropdown.Item
                              onClick={() =>
                                handleJewelPawningprintviewClick(rowData)
                              }
                            >
                              CustomerCopy View
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() =>
                                handleJewelPawningofficeprintviewClick(rowData)
                              }
                            >
                              OfficeCopy View
                            </Dropdown.Item> */}
                            <Dropdown.Item
                              onClick={() => customActions?.interest?.(rowData)}
                              t
                            >
                              Interest
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() => customActions?.recovery?.(rowData)}
                            >
                              Recovery
                            </Dropdown.Item>
                            {isAdmin && (
                              <Dropdown.Item
                                onClick={() =>
                                  handleJewelPawningEditClick(rowData)
                                }
                              >
                                Edit
                              </Dropdown.Item>
                            )}
                            <Dropdown.Item
                              onClick={() =>
                                handleJewelPawningDeleteClick(
                                  rowData.pawnjewelry_id
                                )
                              }
                            >
                              Delete
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </td>
                    </>
                  );
                })()}

              {type === "jewelPawng" && (
                <>
                  {" "}
                  {/* Fragment shorthand */}
                  <td>{rowIndex + 1}</td>
                  <td>{rowData.recipt_no}</td>
                  <td>{rowData.customer_name}</td>
                  <td>{rowData.mobile_number}</td>
                  <td>{rowData.address}</td>
                  <td>
                    <Dropdown>
                      <Dropdown.Toggle>
                        <Button className="action">
                          <BiDotsVerticalRounded />
                        </Button>
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <PDFDownloadLink
                          document={<JewelPawnPdfG data={rowData} />}
                          fileName={`${rowData.recipt_no}.pdf`}
                        >
                          {({ blob, url, loading, error }) => (
                            <a
                              className="dropdown-item"
                              role="button"
                              tabIndex="0"
                              href={url}
                              download={`${rowData.recipt_no}.pdf`}
                            >
                              Download Pdf
                            </a>
                          )}
                        </PDFDownloadLink>
                        <Dropdown.Item
                          onClick={() =>
                            handleJewelPawngprintviewClick(rowData)
                          }
                        >
                          print View
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => handleJewelPawngEditClick(rowData)}
                        >
                          Edit
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() =>
                            handleJewelPawngDeleteClick(rowData.pawnjewelryg_id)
                          }
                        >
                          Delete
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </>
              )}
              {type === "jewelRecovery" && (
                <>
                  {" "}
                  {/* Fragment shorthand */}
                  <td>{rowIndex + 1}</td>
                  <td>{formatDate(rowData.pawnjewelry_date)}</td>
                  <td>{formatDate(rowData.pawnjewelry_recovery_date)}</td>
                  <td>{rowData.receipt_no}</td>
                  <td>{rowData.name}</td>
                  <td>{rowData.mobile_number}</td>
                  <td>
                    <Dropdown>
                      <Dropdown.Toggle>
                        <Button className="action">
                          <BiDotsVerticalRounded />
                        </Button>
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item
                          onClick={() =>
                            handleJewelRecoveryprintviewClick(rowData)
                          }
                        >
                          print View
                        </Dropdown.Item>

                        {/* <PDFDownloadLink
                            document={<JewelPawnRecoverPdf data={rowData} />}
                            fileName={`${rowData.receipt_no}.pdf`}
                          >
                            {({ blob, url, loading, error }) => (
                              <a
                                className="dropdown-item"
                                role="button"
                                tabIndex="0"
                                href={url}
                                download={`${rowData.receipt_no}.pdf`}
                              >
                                Download Pdf
                              </a>
                            )}
                          </PDFDownloadLink> */}

                        {/* <Dropdown.Item onClick={() => handleJewelRecoveryViewClick(rowData)}>View</Dropdown.Item> */}

                        {isAdmin && ( // Show Edit option only if user is Admin
                          <Dropdown.Item
                            onClick={() =>
                              handleJewelRecoveryEditClick(rowData)
                            }
                          >
                            Edit
                          </Dropdown.Item>
                        )}
                        <Dropdown.Item
                          onClick={() =>
                            handleJewelRecoveryDeleteClick(
                              rowData.pawnjewelry_recovery_id
                            )
                          }
                        >
                          Delete
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </>
              )}
              {type === "jewelEstimate" && (
                <>
                  {" "}
                  {/* Fragment shorthand */}
                  <td>{rowIndex + 1}</td>
                  <td>{rowData.recipt_no}</td>
                  <td>{rowData.customer_name}</td>
                  <td>{rowData.mobile_number}</td>
                  <td>{rowData.address}</td>
                  <td>
                    <Dropdown>
                      <Dropdown.Toggle>
                        <Button className="action">
                          <BiDotsVerticalRounded />
                        </Button>
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        {/* <Dropdown.Item onClick={() => handleJewelEstimateViewClick(rowData)}>View</Dropdown.Item> */}
                        <Dropdown.Item
                          onClick={() => handleJewelEstimateEditClick(rowData)}
                        >
                          Edit
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() =>
                            handleJewelEstimateDeleteClick(
                              rowData.pawnjewelry_estimate_id
                            )
                          }
                        >
                          Delete
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </>
              )}
              {type === "jewelUnit" && (
                <>
                  {" "}
                  {/* Fragment shorthand */}
                  <td>{rowIndex + 1}</td>
                  <td>{rowData.unit_type}</td>
                  <td>
                    <Dropdown>
                      <Dropdown.Toggle>
                        <Button className="action">
                          <BiDotsVerticalRounded />
                        </Button>
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        {/* <Dropdown.Item onClick={() => handleJewelUnitViewClick(rowData)}>View</Dropdown.Item> */}
                        <Dropdown.Item
                          onClick={() => handleJewelUnitEditClick(rowData)}
                        >
                          Edit
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() =>
                            handleJewelUnitDeleteClick(rowData.unit_id)
                          }
                        >
                          Delete
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </>
              )}
              {type === "jewelGroup" && (
                <>
                  {" "}
                  {/* Fragment shorthand */}
                  <td>{rowIndex + 1}</td>
                  <td>{rowData.Group_type}</td>
                  <td>
                    <Dropdown>
                      <Dropdown.Toggle>
                        <Button className="action">
                          <BiDotsVerticalRounded />
                        </Button>
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        {/* <Dropdown.Item onClick={() => handleJewelGroupViewClick(rowData)}>View</Dropdown.Item> */}

                        {isAdmin && ( // Show Edit option only if user is Admin
                          <Dropdown.Item
                            onClick={() => handleJewelGroupEditClick(rowData)}
                          >
                            Edit
                          </Dropdown.Item>
                        )}
                        <Dropdown.Item
                          onClick={() =>
                            handleJewelGroupDeleteClick(rowData.Group_id)
                          }
                        >
                          Delete
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </>
              )}
              {type === "jewelCategory" && (
                <>
                  {" "}
                  {/* Fragment shorthand */}
                  <td>{rowIndex + 1}</td>
                  <td>{rowData.Group_type}</td>
                  <td>{rowData.Category_type}</td>
                  <td>
                    <Dropdown>
                      <Dropdown.Toggle>
                        <Button className="action">
                          <BiDotsVerticalRounded />
                        </Button>
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        {/* <Dropdown.Item onClick={() => handleJewelCategoryViewClick(rowData)}>View</Dropdown.Item> */}
                        <Dropdown.Item
                          onClick={() => handleJewelCategoryEditClick(rowData)}
                        >
                          Edit
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() =>
                            handleJewelCategoryDeleteClick(rowData.category_id)
                          }
                        >
                          Delete
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </>
              )}
              {type === "customer" && (
                <>
                  <td>{rowIndex + 1}</td>
                  <td>
                    {rowData.proof && rowData.proof.length > 0 ? (
                      <img
                        src={rowData.proof[0]}
                        alt="Proof"
                        className="customer-listing-img"
                      />
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>{rowData.customer_no}</td>
                  <td>{rowData.name}</td>
                  <td>{rowData.mobile_number}</td>
                  <td>{rowData.customer_details}</td>
                  <td>{rowData.place}</td>
                  <td>
                    <Dropdown>
                      <Dropdown.Toggle>
                        <Button className="action">
                          <BiDotsVerticalRounded />
                        </Button>
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        {/* <Dropdown.Item
                          onClick={() => handleJewelcustomerViewClick(rowData)}
                        >
                          View
                        </Dropdown.Item> */}
                        <Dropdown.Item
                          onClick={() => handleJewelcustomerViewClick(rowData)}
                        >
                          Customer Details
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => handleJewelcustomerEditClick(rowData)}
                        >
                          Edit
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() =>
                            handleJewelcustomerDeleteClick(rowData.customer_id)
                          }
                        >
                          Delete
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </>
              )}
              {type === "product" && (
                <>
                  <td>{rowIndex + 1}</td>
                  <td>{rowData.product_eng}</td>
                  <td>{rowData.product_tam}</td>

                  <td>
                    <Dropdown>
                      <Dropdown.Toggle>
                        <Button className="action">
                          <BiDotsVerticalRounded />
                        </Button>
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item
                          onClick={() => handleProductEditClick(rowData)}
                        >
                          Edit
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() =>
                            handleProductDeleteClick(rowData.product_id)
                          }
                        >
                          Delete
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </>
              )}
              {type === "action" && (
                <>
                  <td>{rowIndex + 1}</td>
                  <td>{rowData.receipt_no}</td>
                  <td>{rowData.name}</td>

                  <td>
                    <Dropdown>
                      <Dropdown.Toggle>
                        <Button className="action">
                          <BiDotsVerticalRounded />
                        </Button>
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item
                          onClick={() => handleActionEditClick(rowData)}
                        >
                          Edit
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() =>
                            handleActionDeleteClick(rowData.action_id)
                          }
                        >
                          Delete
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </>
              )}
              {type === "expenseTable" && (
                <>
                  <td>{rowIndex + 1}</td>
                  <td>{rowData.date}</td>
                  <td>{rowData.expense_name}</td>
                  <td>{rowData.expense_type}</td>
                  <td>{rowData.amount}</td>

                  <td>
                    <Dropdown>
                      <Dropdown.Toggle>
                        <Button className="action">
                          <BiDotsVerticalRounded />
                        </Button>
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        {isAdmin && ( // Show Edit option only if user is Admin
                          <Dropdown.Item
                            onClick={() => handleExpenseEditClick(rowData)}
                          >
                            Edit
                          </Dropdown.Item>
                        )}

                        <Dropdown.Item
                          onClick={() =>
                            handleExpenseDeleteClick(rowData.expense_id)
                          }
                        >
                          Delete
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </>
              )}

              {type === "street" && (
                <>
                  <td>{rowIndex + 1}</td>
                  <td>{rowData.street_eng}</td>
                  <td>{rowData.street_tam}</td>

                  <td>
                    <Dropdown>
                      <Dropdown.Toggle>
                        <Button className="action">
                          <BiDotsVerticalRounded />
                        </Button>
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item
                          onClick={() => handleStreetEditClick(rowData)}
                        >
                          Edit
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() =>
                            handleStreetDeleteClick(rowData.street_id)
                          }
                        >
                          Delete
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </>
              )}
              {type === "bankPledge" && (
                <>
                  <td>{rowIndex + 1}</td>
                  <td>{formatDate(rowData.bank_pledge_date)}</td>
                  <td>{rowData.customer_no}</td>

                  <td>{rowData.receipt_no}</td>
                  <td>{rowData.bank_loan_no}</td>
                  <td>
                    <Dropdown>
                      <Dropdown.Toggle>
                        <Button className="action">
                          <BiDotsVerticalRounded />
                        </Button>
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item
                          onClick={() => handleBankPledgeEditClick(rowData)}
                        >
                          Edit
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() =>
                            handleBankPledgeDeleteClick(
                              rowData.bank_pledge_details_id
                            )
                          }
                        >
                          Delete
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </>
              )}
              {type === "categoryTwo" && (
                <>
                  <td>{rowIndex + 1}</td>
                  <td>{rowData.category_name}</td>
                  <td>
                    <Dropdown>
                      <Dropdown.Toggle>
                        <Button className="action">
                          <BiDotsVerticalRounded />
                        </Button>
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item
                          onClick={() => handlecategoryTwoEditClick(rowData)}
                        >
                          Edit
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() =>
                            handlecategoryTwoDeleteClick(rowData.category_id)
                          }
                        >
                          Delete
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </>
              )}
              {type === "expenseTwo" && (
                <>
                  <td>{rowIndex + 1}</td>
                  <td>{formatDate(rowData.expense_date)}</td>
                  <td>
                    <Dropdown>
                      <Dropdown.Toggle>
                        <Button className="action">
                          <BiDotsVerticalRounded />
                        </Button>
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item
                          onClick={() => handleexpenseTwoEditClick(rowData)}
                        >
                          Edit
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() =>
                            handleexpenseTwoDeleteClick(rowData.expense_id)
                          }
                        >
                          Delete
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </Table>
      {pageview === "yes" && (
        <div className="text-end">
          <span className="mx-1">
            Page {currentPage} of {totalPages}
          </span>
          <span className="mx-1">
            <Buttons
              lable={<MdChevronLeft />}
              onClick={prevPage}
              disabled={currentPage === 1}
            />
          </span>
          <span className="mx-1">
            <Buttons
              lable={<MdChevronRight />}
              onClick={nextPage}
              disabled={currentPage === totalPages}
            />
          </span>
        </div>
      )}
    </>
  );
};

export default TableUI;
