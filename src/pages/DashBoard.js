import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Spinner,
  Table,
  Button,
  Form,
} from "react-bootstrap";
import { MdOutlinePerson } from "react-icons/md";
import { AiFillGolden } from "react-icons/ai";
import { RiDeviceRecoverLine } from "react-icons/ri";
import API_DOMAIN from "../config/config";
import dayjs from "dayjs";
import "./tablecus.css";
import "bootstrap/dist/css/bootstrap.min.css";
import LoadingOverlay from "../components/LoadingOverlay";

const DashBoard = () => {
  const [userecoveryData, setUserrecoveryData] = useState([]);
  const [jewelpawnData, setUserjewlpawnData] = useState([]);
  const [customerData, setcustomerData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [interestData, setInterestData] = useState([]);
  const [actionData, setActionData] = useState([]);
  const [bankPledgeData, setBankPledgeData] = useState([]);
  const [customerHistory, setCustomerHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [placeSearchTerm, setPlaceSearchTerm] = useState("");
  const [noticeSearchTerm, setNoticeSearchTerm] = useState("");
  const [actionSearchTerm, setActionSearchTerm] = useState("");
  const [selectedCustomerNo, setSelectedCustomerNo] = useState("");
  const [fromDate, setFromDate] = useState(
    dayjs().startOf("month").format("YYYY-MM-DD")
  );
  const [toDate, setToDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [filteredData, setFilteredData] = useState([]);
  const [loadingPawn, setLoadingPawn] = useState(true);
  const [loadingRecovery, setLoadingRecovery] = useState(true);
  const [loadingCustomer, setLoadingCustomer] = useState(true);
  const [loadingInterest, setLoadingInterest] = useState(true);
  const [loadingAction, setLoadingAction] = useState(true);
  const [loadingBank, setLoadingBank] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);

  const parsePeriod = (periodStr) => {
    const monthsMatch = periodStr.match(/(\d+)\s*month/);
    return {
      months: monthsMatch ? parseInt(monthsMatch[1]) : 0,
    };
  };

  // Aggregate interest data by receipt_no
  const aggregateInterestData = (interestData) => {
    const aggregated = interestData.reduce((acc, item) => {
      const receiptNo = item.receipt_no;

      if (!acc[receiptNo]) {
        acc[receiptNo] = {
          total_interest_income: 0,
          total_paid_months: 0,
        };
      }

      acc[receiptNo].total_interest_income += parseFloat(
        item.interest_income || 0
      );

      const { months } = parsePeriod(item.interest_payment_periods);
      acc[receiptNo].total_paid_months += months;

      return acc;
    }, {});

    Object.keys(aggregated).forEach((receiptNo) => {
      aggregated[receiptNo].interest_payment_periods =
        aggregated[receiptNo].total_paid_months +
        " month" +
        (aggregated[receiptNo].total_paid_months !== 1 ? "s" : "");
    });

    return aggregated;
  };

  const getValueDisplay = (val) => {
    if (!val || (Array.isArray(val) && val.length === 0)) {
      return <span className="text-muted">N/A</span>;
    }

    // Blacklist of fields to skip
    const skipFields = [
      "id",
      "interest_id",
      "pawnjewelry_id",
      "customer_id",
      "pawnjewelry_recovery_id",
      "create_at",
      "delete_at",
      "created_by_id",
      "create_by_id",
      "updated_by_id",
      "deleted_by_id",
    ];

    const formatJewelProduct = (jewelStr) => {
      if (!jewelStr) return "No items";
      try {
        // Clean extra escapes (e.g., \\\" -> ")
        let cleanStr = jewelStr.replace(/\\\\/g, "\\").replace(/\\"/g, '"');
        const jewels = JSON.parse(cleanStr);
        return (
          jewels
            .filter((j) => j.JewelName && j.JewelName.trim())
            .map(
              (j) =>
                `${j.JewelName} (${j.count || 1} pcs, ${j.weight || 0}g, ${
                  j.carrat || ""
                })`
            )
            .join(", ") || "No items"
        );
      } catch (e) {
        console.error("Parse error:", e, jewelStr);
        return "Invalid format";
      }
    };

    const formatField = (key, value) => {
      if (value === null || value === undefined || value === "") return null;
      switch (key) {
        case "pawnjewelry_date":
        case "interest_receive_date":
        case "pawnjewelry_recovery_date":
        case "created_at":
          return dayjs(value).format("DD-MM-YYYY");
        case "original_amount":
        case "outstanding_amount":
        case "interest_income":
        case "topup_amount":
        case "deduction_amount":
        case "interest_payment_amount":
        case "refund_amount":
        case "other_amount":
        case "interest_paid":
          return `₹${parseFloat(value || 0).toLocaleString("en-IN")}`;
        case "jewel_product":
          return formatJewelProduct(value);
        case "interest_rate":
          return `${value}%`;
        case "status":
          return value; // Keep as is (e.g., Tamil text)
        case "proof":
        case "aadharproof":
          return Array.isArray(value) ? "Uploaded files" : value || "None";
        default:
          return value;
      }
    };

    return (
      <div
        style={{
          fontSize: "0.75em",
          lineHeight: "1.2",
          textAlign: "left",
          wordBreak: "break-word",
        }}
      >
        {Object.entries(val).map(([key, value]) => {
          if (skipFields.includes(key)) return null;
          const formattedValue = formatField(key, value);
          if (formattedValue === null) return null;
          return (
            <div key={key}>
              <strong>{key.replace(/_/g, " ").toUpperCase()}:</strong>{" "}
              {formattedValue}
            </div>
          );
        })}
      </div>
    );
  };

  const fetchCustomerHistory = async (customerNo) => {
    if (!customerNo) {
      setCustomerHistory([]);
      return;
    }
    setLoadingHistory(true);
    try {
      const response = await fetch(`${API_DOMAIN}/customer.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          list_history: true,
          customer_no: customerNo,
          fromdate: fromDate,
          todate: toDate,
        }),
      });
      const responseData = await response.json();
      if (responseData.head.code === 200) {
        setCustomerHistory(responseData.body.history || []);
      } else {
        throw new Error(responseData.head.msg);
      }
    } catch (error) {
      console.error("Error fetching history:", error.message);
      setCustomerHistory([]);
    } finally {
      setLoadingHistory(false);
    }
  };

  const fetchDatajewelpawncustomer = async () => {
    setLoadingCustomer(true);
    try {
      const response = await fetch(`${API_DOMAIN}/customer.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ search_text: "" }),
      });
      const responseData = await response.json();
      if (responseData.head.code === 200) {
        setcustomerData(responseData.body.customer);
        setLoadingCustomer(false);
      } else {
        throw new Error(responseData.head.msg);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
      setLoadingCustomer(false);
    }
  };

  const fetchDatarecovery = async () => {
    setLoadingRecovery(true);
    try {
      const response = await fetch(`${API_DOMAIN}/pawnrecovery.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ search_text: "" }),
      });
      const responseData = await response.json();
      if (responseData.head.code === 200) {
        let sortedData = responseData.body.pawn_recovery.map((user) => ({
          ...user,
          jewel_product: JSON.parse(user.jewel_product || "[]"),
        }));
        setUserrecoveryData(sortedData);
        setLoadingRecovery(false);
      } else {
        throw new Error(responseData.head.msg);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
      setLoadingRecovery(false);
    }
  };

  const fetchDatajewelpawn = async () => {
    setLoadingPawn(true);
    try {
      const response = await fetch(`${API_DOMAIN}/pawnjewelry.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ search_text: "" }),
      });
      const responseData = await response.json();
      if (responseData.head.code === 200) {
        const sortedData = responseData.body.pawnjewelry.map((user) => ({
          ...user,
          jewel_product: JSON.parse(user.jewel_product || "[]"),
        }));
        setUserjewlpawnData(sortedData);
        setUserData(sortedData);
        setFilteredData(sortedData);
        setLoadingPawn(false);
      } else {
        throw new Error(responseData.head.msg);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    } finally {
      setLoadingPawn(false);
    }
  };

  const fetchinterestData = async () => {
    setLoadingInterest(true);
    try {
      const response = await fetch(`${API_DOMAIN}/interest.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ search_text: "" }),
      });
      const responseData = await response.json();

      if (responseData.head.code === 200) {
        setInterestData(responseData.body.interest);
        setLoadingInterest(false);
      } else {
        throw new Error(responseData.head.msg);
      }
    } catch (error) {
      setLoadingInterest(false);
      console.error("Error fetching data:", error.message);
    }
  };

  const fetchActionData = async () => {
    setLoadingAction(true);
    try {
      const response = await fetch(`${API_DOMAIN}/action.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ search_text: "" }),
      });
      const responseData = await response.json();
      if (responseData.head.code === 200) {
        const sortedData = responseData.body.action.map((action) => ({
          ...action,
          jewel_product: JSON.parse(action.jewel_product || "[]"),
        }));
        setActionData(sortedData);
        setLoadingAction(false);
      } else {
        throw new Error(responseData.head.msg);
      }
    } catch (error) {
      console.error("Error fetching action data:", error.message);
      setLoadingAction(false);
    }
  };

  const fetchBankPledgeData = async () => {
    setLoadingBank(true);
    try {
      const response = await fetch(`${API_DOMAIN}/bank_pledge_details.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ search_text: "" }),
      });
      const responseData = await response.json();
      if (responseData.head.code === 200) {
        setBankPledgeData(responseData.body.bank_pledge_details || []);
      } else {
        throw new Error(responseData.head.msg);
      }
    } catch (error) {
      console.error("Error fetching bank pledge data:", error.message);
    } finally {
      setLoadingBank(false);
    }
  };

  const handleSearch = () => {
    let filtered = userData;
    if (searchTerm || placeSearchTerm) {
      filtered = userData.filter((item) => {
        const matchesMobile = searchTerm
          ? item.mobile_number.toString().includes(searchTerm)
          : true;
        const matchesReceipt = searchTerm
          ? item.receipt_no.toString().includes(searchTerm)
          : true;
        const matchesCustomerno = searchTerm
          ? item.customer_no.toString().includes(searchTerm)
          : true;
        const matchesCustomerName = searchTerm
          ? (typeof item.name === "string"
              ? item.name.toLowerCase()
              : ""
            ).includes(searchTerm.toLowerCase())
          : true;
        const matchesPlace = placeSearchTerm
          ? (item.place || "")
              .toLowerCase()
              .includes(placeSearchTerm.toLowerCase())
          : true;
        return (
          (matchesMobile ||
            matchesReceipt ||
            matchesCustomerName ||
            matchesCustomerno) &&
          matchesPlace
        );
      });
    }
    setFilteredData(filtered);
  };

  //  search handler for Notice Alert Summary
  const handleNoticeSearch = () => {
    const notices = generateNoticeAlerts();
    if (noticeSearchTerm) {
      return notices.filter((notice) => {
        const matchesReceipt = notice.receipt_no
          .toString()
          .toLowerCase()
          .includes(noticeSearchTerm.toLowerCase());
        const matchesName = notice.name
          .toLowerCase()
          .includes(noticeSearchTerm.toLowerCase());
        const matchesMobile = notice.mobile_number
          ? notice.mobile_number
              .toString()
              .toLowerCase()
              .includes(noticeSearchTerm.toLowerCase())
          : false;
        return matchesReceipt || matchesName || matchesMobile;
      });
    }
    return notices;
  };

  //  search handler for Action Alert Summary
  const handleActionSearch = () => {
    if (actionSearchTerm) {
      return actionData.filter((action) => {
        const matchesReceipt = action.receipt_no
          .toString()
          .toLowerCase()
          .includes(actionSearchTerm.toLowerCase());
        const matchesName = action.name
          .toLowerCase()
          .includes(actionSearchTerm.toLowerCase());
        const matchesMobile = action.mobile_number
          ? action.mobile_number
              .toString()
              .toLowerCase()
              .includes(actionSearchTerm.toLowerCase())
          : false;
        return matchesReceipt || matchesName || matchesMobile;
      });
    }
    return actionData;
  };

  const handleClear = () => {
    setSearchTerm("");
    setPlaceSearchTerm("");
    setFilteredData(userData);
  };

  const handleNoticeClear = () => {
    setNoticeSearchTerm("");
  };

  const handleActionClear = () => {
    setActionSearchTerm("");
  };

  const handleHistoryClear = () => {
    setSelectedCustomerNo("");
    setFromDate(dayjs().startOf("month").format("YYYY-MM-DD"));
    setToDate(dayjs().format("YYYY-MM-DD"));
    setCustomerHistory([]);
  };

  useEffect(() => {
    handleSearch();
  }, [searchTerm, placeSearchTerm, userData]);

  useEffect(() => {
    fetchDatajewelpawn();
    fetchDatarecovery();
    fetchDatajewelpawncustomer();
    fetchinterestData();
    fetchActionData();
    fetchBankPledgeData();
  }, []);

  const aggregatedInterestData = aggregateInterestData(interestData);

  const isPageLoading =
    loadingPawn ||
    loadingRecovery ||
    loadingCustomer ||
    loadingInterest ||
    loadingAction ||
    loadingBank;

  function getTamilAlertMessage(name, receiptNo, date, months) {
    if (months >= 12) {
      return `அபிநயா அடகு கடை
திரு / திருமதி ${name}, உங்கள் அடகு எண் ${receiptNo} அன்று அடகு வைக்கப்பட்ட நகையானது 12 மாதங்களை கடந்த நிலையில் அசல் மற்றும் வட்டி செலுத்தி திருப்பிக்கொள்ளுமாறு அல்லது வட்டி செலுத்தி கடனை புதுப்பிக்குமாறு கேட்டுக்கொள்ளப்படுகிறது.`;
    } else if (months >= 9) {
      return `அபிநயா அடகு கடை
திரு / திருமதி ${name}, உங்கள் அடகு எண் ${receiptNo} அன்று அடகு வைக்கப்பட்ட நகையானது 9 மாதங்களை கடந்த நிலையில் வட்டி செலுத்தி கடனை புதுப்பிக்குமாறு அறிவுறுத்தப்படுகிறது.`;
    } else if (months >= 6) {
      return `அபிநயா அடகு கடை
திரு / திருமதி ${name}, உங்கள் அடகு எண் ${receiptNo} அன்று அடகு வைக்கப்பட்ட நகையானது 6 மாதங்களை கடந்த நிலையில் வட்டி கட்டுமாறு அறிவுறுத்தப்படுகிறது.`;
    } else {
      return "";
    }
  }

  function getRowClass(months) {
    if (months >= 12) return "row-red";
    if (months >= 9) return "row-orange";
    if (months >= 6) return "row-yellow";
    if (months < 5) return "row-yellowtest";
    return "";
  }

  function getMonthsDifference(startDate) {
    const now = dayjs();
    const start = dayjs(startDate);
    return now.diff(start, "month");
  }

  function generateWhatsAppURL(number, message) {
    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  }

  const getEligibleNotices = (pawnDate) => {
    const now = dayjs();
    const baseDate = dayjs(pawnDate);
    const notices = [];

    if (now.diff(baseDate.add(1, "year").add(1, "week"), "day") >= 0) {
      notices.push({
        noticeNo: 1,
        date: baseDate.add(1, "year").add(1, "week").format("DD-MM-YYYY"),
      });
    }
    if (now.diff(baseDate.add(1, "year").add(3, "month"), "day") >= 0) {
      notices.push({
        noticeNo: 2,
        date: baseDate.add(1, "year").add(3, "month").format("DD-MM-YYYY"),
      });
    }
    if (now.diff(baseDate.add(1, "year").add(6, "month"), "day") >= 0) {
      notices.push({
        noticeNo: 3,
        date: baseDate.add(1, "year").add(6, "month").format("DD-MM-YYYY"),
      });
    }

    return notices;
  };

  const generateNoticeAlerts = () => {
    let notices = [];

    userData.forEach((item) => {
      const eligibleNotices = getEligibleNotices(item.pawnjewelry_date);

      eligibleNotices.forEach((notice) => {
        notices.push({
          receipt_no: item.receipt_no,
          name: item.name,
          mobile_number: item.mobile_number,
          jewel_product: Array.isArray(item.jewel_product)
            ? item.jewel_product.map((j) => j.JewelName).join(", ")
            : "",
          notice_date: notice.date,
          notice_no: notice.noticeNo,
          pawnjewelry_date: item.pawnjewelry_date,
        });
      });
    });

    return notices;
  };

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const displayValue = (
    value,
    isDate = false,
    isCurrency = false,
    isPercentage = false
  ) => {
    if (value === null || value === undefined || value === "") {
      return "-";
    }
    if (isDate && value) {
      return dayjs(value).isValid() ? dayjs(value).format("DD-MM-YYYY") : "-";
    }
    if (isCurrency && value !== null && value !== undefined) {
      return `₹${Number(value).toLocaleString("en-IN")}`;
    }
    if (isPercentage && value !== null && value !== undefined) {
      return `${value}%`;
    }
    return value || "-";
  };

  useEffect(() => {
    if (selectedCustomerNo) {
      fetchCustomerHistory(selectedCustomerNo);
    }
  }, [fromDate, toDate]);

  return (
    <>
      <LoadingOverlay isLoading={isPageLoading} />
      <Container>
        <>
          <Row>
            <Col lg="3" md="6" xs="12" className="py-3">
              <div className="counter-card cyan">
                <span>
                  <MdOutlinePerson />
                </span>
                <span className="count-numbers plus bold">
                  {customerData.length}
                </span>
                <span className="count-name regular">Customer</span>
              </div>
            </Col>
            <Col lg="3" md="6" xs="12" className="py-3">
              <div className="counter-card blue">
                <span>
                  <AiFillGolden />
                </span>
                <span className="count-numbers plus bold">
                  {jewelpawnData.length}
                </span>
                <span className="count-name regular">Jewelry Pawn</span>
              </div>
            </Col>
            <Col lg="3" md="6" xs="12" className="py-3">
              <div className="counter-card green">
                <span>
                  <RiDeviceRecoverLine />
                </span>
                <span className="count-numbers plus bold">
                  {userecoveryData.length}
                </span>
                <span className="count-name regular">Jewelry Recovery</span>
              </div>
            </Col>
          </Row>

          <Row className="mt-4">
            <Col lg="12">
              <h5 className="mb-3"> 📌 Jewelry Pawn Details</h5>
              <Row className="mb-3">
                <Col lg="3" md="6" xs="12" className="mb-2">
                  <Form.Control
                    type="text"
                    placeholder="Mobile number, pawn number or customer name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </Col>
                <Col lg="3" md="6" xs="12" className="mb-2">
                  <Form.Control
                    type="text"
                    placeholder="Place"
                    value={placeSearchTerm}
                    onChange={(e) => setPlaceSearchTerm(e.target.value)}
                  />
                </Col>
                <Col lg="3" md="6" xs="12">
                  <Button variant="secondary" onClick={handleClear}>
                    Clear
                  </Button>
                </Col>
              </Row>
              <div className="balance-table-wrapper">
                <Table bordered hover responsive className="table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Loan Number</th>
                      <th>Customer Number</th>
                      <th>Customer Name</th>
                      <th>Location</th>
                      <th>Mobile Number</th>
                      <th>Principal Amount</th>
                      <th>Interest Rate</th>
                      <th>Pawned Items</th>
                      <th>Bank Pledge Details</th>
                      <th>Jewelry Weight</th>
                      <th>Net Weight</th>
                      <th>Jewelry Value (Pawned)</th>
                      <th>Interest Outstanding</th>
                      <th>Interest Paid</th>
                      <th>Total Appraisal</th>
                      <th>Status</th>
                      <th>Interest Overdue Months</th>
                      <th>Alert</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.length > 0 ? (
                      filteredData.map((item) => {
                        const matchingBank = bankPledgeData.find(
                          (bp) =>
                            bp.customer_no === item.customer_no &&
                            bp.receipt_no === item.receipt_no
                        );
                        const hasBankDetails =
                          matchingBank &&
                          (matchingBank.bank_assessor_name ||
                            matchingBank.bank_name ||
                            parseFloat(matchingBank.bank_pawn_value || 0) > 0 ||
                            parseFloat(matchingBank.bank_interest || 0) > 0 ||
                            matchingBank.bank_due_date ||
                            matchingBank.closing_date ||
                            parseFloat(matchingBank.closing_amount || 0) > 0);
                        const jewelList = Array.isArray(item.jewel_product)
                          ? item.jewel_product
                          : typeof item.jewel_product === "string"
                          ? JSON.parse(item.jewel_product)
                          : [];

                        const totalWeight = jewelList.reduce(
                          (sum, jewel) => sum + parseFloat(jewel.weight || 0),
                          0
                        );
                        const totalNetWeight = jewelList.reduce(
                          (sum, jewel) => sum + parseFloat(jewel.net || 0),
                          0
                        );
                        const pledgedItems = jewelList
                          .map((jewel) => jewel.JewelName)
                          .join(", ");

                        const months = getMonthsDifference(
                          item.pawnjewelry_date
                        );
                        const bgColor = getRowClass(months);
                        const alertContent = getTamilAlertMessage(
                          item.name,
                          item.receipt_no,
                          item.pawnjewelry_date,
                          months
                        );

                        return (
                          <>
                            <tr key={item.id} className={getRowClass(months)}>
                              <td>
                                {dayjs(item.pawnjewelry_date).format(
                                  "DD-MM-YYYY"
                                )}
                              </td>
                              <td>{item.receipt_no}</td>
                              <td>{item.customer_no}</td>
                              <td>{item.name}</td>
                              <td>{item.place}</td>
                              <td>{item.mobile_number}</td>
                              <td>{item.original_amount}</td>
                              <td>{item.interest_rate}</td>
                              <td>{pledgedItems}</td>
                              <td>
                                <Button
                                  size="sm"
                                  className={`text-${
                                    hasBankDetails ? "danger" : "primary"
                                  }`}
                                  onClick={() => toggleRow(item.id)}
                                >
                                  {expandedRow === item.id
                                    ? "Hide Details"
                                    : "View Details"}
                                </Button>
                              </td>
                              <td>{totalWeight.toFixed(2)}</td>
                              <td>{totalNetWeight.toFixed(2)}</td>
                              <td>
                                {Math.round(
                                  item.original_amount / totalNetWeight
                                )}
                              </td>
                              <td>
                                <div className="dashboard">
                                  <span>{item.interest_payment_period}</span>
                                  <span style={{ color: "green" }}>
                                    ₹{Math.round(item.interest_payment_amount)}
                                  </span>
                                </div>
                              </td>
                              <td>
                                <div className="dashboard">
                                  <span>
                                    {aggregatedInterestData[item.receipt_no]
                                      ?.interest_payment_periods || "N/A"}
                                  </span>
                                  <span style={{ color: "green" }}>
                                    ₹
                                    {Math.round(
                                      aggregatedInterestData[item.receipt_no]
                                        ?.total_interest_income || 0
                                    ).toLocaleString("en-IN")}
                                  </span>
                                </div>
                              </td>
                              <td>
                                ₹
                                {Math.round(
                                  parseFloat(item.original_amount || 0) +
                                    parseFloat(
                                      item.interest_payment_amount || 0
                                    )
                                ).toLocaleString("en-IN")}
                              </td>
                              <td style={{ textAlign: "center" }}>
                                <span
                                  className={`badge ${
                                    item.status === "நகை மீட்கபட்டது"
                                      ? "bg-danger"
                                      : "bg-success"
                                  }`}
                                  style={{
                                    minWidth: "20px",
                                    minHeight: "20px",
                                    display: "inline-block",
                                  }}
                                ></span>
                              </td>
                              <td>{months}</td>
                              <td>
                                {item.status !== "நகை மீட்கபட்டது" &&
                                  alertContent && (
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "5px",
                                        alignItems: "center",
                                      }}
                                    >
                                      <button
                                        onClick={() => {
                                          const url = generateWhatsAppURL(
                                            item.mobile_number,
                                            alertContent
                                          );
                                          window.open(url, "_blank");
                                        }}
                                        className="whatsapp-btn"
                                      >
                                        WhatsApp
                                      </button>
                                      <a
                                        href={`sms:${
                                          item.mobile_number
                                        }?body=${encodeURIComponent(
                                          alertContent
                                        )}`}
                                        style={{
                                          backgroundColor: "#007BFF",
                                          color: "#fff",
                                          padding: "5px",
                                          borderRadius: "5px",
                                          textDecoration: "none",
                                          display: "inline-block",
                                        }}
                                      >
                                        SMS
                                      </a>
                                    </div>
                                  )}
                              </td>
                            </tr>
                            {expandedRow === item.id && (
                              <tr>
                                <td
                                  colSpan="19"
                                  style={{ backgroundColor: "#f8f9fa" }}
                                >
                                  <div style={{ padding: "10px" }}>
                                    <Table bordered hover size="sm">
                                      <thead className="table-dark">
                                        <tr>
                                          <th>Bank Pledge Date</th>
                                          <th>Bank Loan No</th>
                                          <th>Bank Assessor Name</th>
                                          <th>Bank Name</th>
                                          <th>Bank Pawn Value</th>
                                          <th>Bank Interest</th>
                                          <th>Bank Due Date</th>
                                          <th>Closing Date</th>
                                          <th>Closing Amount</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr>
                                          <td>
                                            {displayValue(
                                              matchingBank?.bank_pledge_date,
                                              true
                                            )}
                                          </td>
                                          <td>
                                            {displayValue(
                                              matchingBank?.bank_loan_no
                                            )}
                                          </td>
                                          <td>
                                            {displayValue(
                                              matchingBank?.bank_assessor_name
                                            )}
                                          </td>
                                          <td>
                                            {displayValue(
                                              matchingBank?.bank_name
                                            )}
                                          </td>
                                          <td>
                                            {displayValue(
                                              matchingBank?.bank_pawn_value,
                                              false,
                                              true
                                            )}
                                          </td>
                                          <td>
                                            {displayValue(
                                              matchingBank?.bank_interest,
                                              false,
                                              false,
                                              true
                                            )}
                                          </td>
                                          <td>
                                            {displayValue(
                                              matchingBank?.bank_due_date,
                                              true
                                            )}
                                          </td>
                                          <td>
                                            {displayValue(
                                              matchingBank?.closing_date,
                                              true
                                            )}
                                          </td>
                                          <td>
                                            {displayValue(
                                              matchingBank?.closing_amount,
                                              false,
                                              true
                                            )}
                                          </td>
                                        </tr>
                                      </tbody>
                                    </Table>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="19" className="text-center">
                          No records found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
              <Row className="mt-5">
                <Col lg="12">
                  <h5 className="mb-3">📌 Notice Alert Summary</h5>
                  <Row className="mb-3">
                    <Col lg="3" md="6" xs="12" className="mb-2">
                      <Form.Control
                        type="text"
                        placeholder="Search by Loan Number, Customer Name, or Mobile Number"
                        value={noticeSearchTerm}
                        onChange={(e) => setNoticeSearchTerm(e.target.value)}
                      />
                    </Col>
                    <Col lg="3" md="6" xs="12">
                      <Button variant="secondary" onClick={handleNoticeClear}>
                        Clear
                      </Button>
                    </Col>
                  </Row>
                  <div className="notice-table-wrapper table-responsive shadow-sm rounded border">
                    <Table
                      bordered
                      hover
                      className="table table-striped align-middle mb-0"
                    >
                      <thead className="table-dark text-center">
                        <tr>
                          <th style={{ width: "5%" }}>S.No</th>
                          <th style={{ width: "12%" }}>Loan Date</th>
                          <th style={{ width: "15%" }}>Loan Number</th>
                          <th style={{ width: "20%" }}>Customer Name</th>
                          <th style={{ width: "25%" }}>Ornaments</th>
                          <th style={{ width: "20%" }}>Notice Date</th>
                          <th style={{ width: "15%" }}>Notice No</th>
                        </tr>
                      </thead>
                      <tbody>
                        {handleNoticeSearch().length > 0 ? (
                          handleNoticeSearch().map((notice, index) => (
                            <tr key={index} className="text-center">
                              <td>{index + 1}</td>
                              <td>
                                {dayjs(notice.pawnjewelry_date).format(
                                  "DD-MM-YYYY"
                                )}
                              </td>
                              <td>{notice.receipt_no}</td>
                              <td className="text-capitalize">{notice.name}</td>
                              <td>{notice.jewel_product}</td>
                              <td>
                                <span className="badge bg-light text-dark">
                                  {notice.notice_date}
                                </span>
                              </td>
                              <td>
                                <span
                                  className="badge text-dark"
                                  style={{
                                    minWidth: "90px",
                                    backgroundColor:
                                      notice.notice_no === 1
                                        ? "#fbff12" // Lemon color
                                        : notice.notice_no === 2
                                        ? "#fc8319" // Orange color
                                        : "#f20707", // Red color
                                  }}
                                >
                                  Notice {notice.notice_no}
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="6"
                              className="text-center text-muted py-4"
                            >
                              No notice alerts found at this time.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </div>
                </Col>
              </Row>
              <Row className="mt-5">
                <Col lg="12">
                  <h5 className="mb-3">📌 Action Alert Summary</h5>
                  <Row className="mb-3">
                    <Col lg="3" md="6" xs="12" className="mb-2">
                      <Form.Control
                        type="text"
                        placeholder="Search by Loan Number, Customer Name, or Mobile Number"
                        value={actionSearchTerm}
                        onChange={(e) => setActionSearchTerm(e.target.value)}
                      />
                    </Col>
                    <Col lg="3" md="6" xs="12">
                      <Button variant="secondary" onClick={handleActionClear}>
                        Clear
                      </Button>
                    </Col>
                  </Row>
                  <div className="notice-table-wrapper table-responsive shadow-sm rounded border">
                    <Table
                      bordered
                      hover
                      className="table table-striped align-middle mb-0"
                    >
                      <thead className="table-dark text-center">
                        <tr>
                          <th style={{ width: "5%" }}>S.No</th>
                          <th style={{ width: "15%" }}>Loan Number</th>
                          <th style={{ width: "20%" }}>Customer Name</th>
                          <th style={{ width: "25%" }}>Ornaments</th>
                          <th style={{ width: "15%" }}>Loan Amount</th>
                          <th style={{ width: "20%" }}>Action Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {handleActionSearch().length > 0 ? (
                          handleActionSearch().map((action, index) => (
                            <tr key={action.id} className="text-center">
                              <td>{index + 1}</td>
                              <td>{action.receipt_no}</td>

                              <td className="text-capitalize">{action.name}</td>
                              <td>
                                {Array.isArray(action.jewel_product)
                                  ? action.jewel_product
                                      .map((j) => j.JewelName)
                                      .join(", ")
                                  : ""}
                              </td>
                              <td>{action.original_amount}</td>
                              <td>
                                <span className="badge bg-light text-dark">
                                  {dayjs(action.action_date).format(
                                    "DD-MM-YYYY"
                                  )}
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="5"
                              className="text-center text-muted py-4"
                            >
                              No action alerts found at this time.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </div>
                </Col>
              </Row>
              <Row className="mt-5">
                <Col lg="12">
                  <h5 className="mb-3">📌 Customer History</h5>
                  <Row className="mb-3">
                    <Col lg={3} className="mb-2">
                      <Form.Control
                        type="text"
                        placeholder="Customer Number"
                        value={selectedCustomerNo}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSelectedCustomerNo(val);
                          if (val) {
                            fetchCustomerHistory(val);
                          } else {
                            setCustomerHistory([]);
                          }
                        }}
                      />
                    </Col>
                    <Col lg={3} className="mb-2">
                      <Form.Control
                        type="date"
                        value={fromDate}
                        onChange={(e) => {
                          setFromDate(e.target.value);
                        }}
                      />
                    </Col>
                    <Col lg={3} className="mb-2">
                      <Form.Control
                        type="date"
                        value={toDate}
                        onChange={(e) => {
                          setToDate(e.target.value);
                        }}
                      />
                    </Col>
                    <Col lg={3} className="mb-2">
                      <Button
                        variant="primary"
                        onClick={() =>
                          selectedCustomerNo &&
                          fetchCustomerHistory(selectedCustomerNo)
                        }
                      >
                        Search
                      </Button>
                      <Button
                        variant="secondary"
                        className="ms-2"
                        onClick={handleHistoryClear}
                      >
                        Clear
                      </Button>
                    </Col>
                  </Row>
                  <div
                    className="notice-table-wrapper table-responsive shadow-sm rounded border"
                    style={{ maxHeight: "400px", overflowY: "auto" }}
                  >
                    <Table
                      bordered
                      hover
                      className="table table-striped align-middle mb-0"
                      style={{ tableLayout: "fixed", width: "100%" }}
                    >
                      <thead className="table-dark text-center">
                        <tr>
                          <th style={{ width: "5%" }}>S.No</th>
                          <th style={{ width: "15%" }}>Date</th>
                          <th style={{ width: "15%" }}>Receipt No</th>
                          <th style={{ width: "25%" }}>Old Value</th>
                          <th style={{ width: "25%" }}>New Value</th>
                          <th style={{ width: "15%" }}>Remarks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loadingHistory ? (
                          <tr>
                            <td colSpan="6" className="text-center">
                              Loading...
                            </td>
                          </tr>
                        ) : customerHistory.length > 0 ? (
                          customerHistory.map((hist, index) => (
                            <tr key={hist.id}>
                              <td
                                className="text-center"
                                style={{ verticalAlign: "top" }}
                              >
                                {index + 1}
                              </td>
                              <td
                                className="text-center"
                                style={{ verticalAlign: "top" }}
                              >
                                {dayjs(hist.created_at).format(
                                  "DD-MM-YYYY HH:mm"
                                )}
                              </td>
                              <td
                                className="text-center"
                                style={{ verticalAlign: "top" }}
                              >
                                {hist.old_value?.receipt_no ||
                                  hist.new_value?.receipt_no ||
                                  "-"}
                              </td>
                              <td
                                style={{
                                  verticalAlign: "top",
                                  wordBreak: "break-word",
                                  maxHeight: "100px",
                                  overflow: "auto",
                                  padding: "8px",
                                }}
                              >
                                {getValueDisplay(hist.old_value)}
                              </td>
                              <td
                                style={{
                                  verticalAlign: "top",
                                  wordBreak: "break-word",
                                  maxHeight: "100px",
                                  overflow: "auto",
                                  padding: "8px",
                                }}
                              >
                                {getValueDisplay(hist.new_value)}
                              </td>
                              <td
                                className="text-center"
                                style={{
                                  verticalAlign: "top",
                                  wordBreak: "break-word",
                                }}
                              >
                                {hist.remarks}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="6"
                              className="text-center text-muted py-4"
                            >
                              {selectedCustomerNo
                                ? "No history found."
                                : "Enter customer number to view history."}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </>
      </Container>
    </>
  );
};

export default DashBoard;
