import React, { useState, useEffect } from "react";
import { Col, Container, Row, Alert, Table } from "react-bootstrap";
import Select from "react-select";
import { TextInputForm, DropDownUI } from "../../components/Forms";
import { ClickButton } from "../../components/ClickButton";
import PageNav from "../../components/PageNav";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import API_DOMAIN from "../../config/config";
import "react-toastify/dist/ReactToastify.css";
import { useLanguage } from "../../components/LanguageContext";

const BankPledgerCreation = () => {
  const location = useLocation();
  const { t } = useLanguage();
  const { type, rowData } = location.state || {};
  const mode =
    type === "closing"
      ? "closing"
      : type === "edit"
      ? "edit"
      : type === "view"
      ? "view"
      : "create";
  const isEdit = type === "edit";
  const isClosing = type === "closing";
  const isView = type === "view";
  let initialState =
    mode !== "create"
      ? { ...rowData }
      : {
          bank_pledger_details_id: "",
          name: "",
          mobile_no: "",
          address: "",
          bank_details: "",
          pledge_date: "",
          bank_loan_no: "",
          pawn_loan_no: "",
          pawn_value: "",
          interest_rate: "",
          duration_month: "",
          interest_amount: "",
          pledge_due_date: "",
          additional_charges: "",
        };
  if (isClosing) {
    initialState = {
      ...initialState,
      closing_date: "",
      closing_amount: "",
      closing_interest_amount: "",
      extra_charges: "",
    };
  }
  const [formData, setFormData] = useState(initialState);
  console.log(formData);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [pledgerData, setPledgerData] = useState([]);
  const [selectedPledger, setSelectedPledger] = useState(null);
  const [bankList, setBankList] = useState([]);
  const [selectedBankId, setSelectedBankId] = useState(null);
  const navigate = useNavigate();
  const handleChange = (e, fieldName) => {
    const value = e.target ? e.target.value : e.value;
    setFormData({
      ...formData,
      [fieldName]: value,
    });
  };
  const [showAlert, setShowAlert] = useState(false);
  const fetchPledgers = async () => {
    try {
      const response = await fetch(`${API_DOMAIN}/bank_pledger_details.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          search_text: "",
        }),
      });
      const res = await response.json();
      if (res.head.code === 200) {
        const data = Array.isArray(res.body.pledger) ? res.body.pledger : [];
        setPledgerData(data);
      }
    } catch (error) {
      console.error("Error fetching pledgers:", error);
    }
  };
  useEffect(() => {
    fetchPledgers();
  }, []);
  useEffect(() => {
    if ((isEdit || isClosing || isView) && rowData) {
      const fakeOption = {
        value: rowData.bank_pledger_details_id,
        label: rowData.name,
        data: rowData,
      };
      setSelectedPledger(fakeOption);
      const banks = JSON.parse(rowData.bank_details || "[]");
      setBankList(banks);
      const selId = banks.length > 0 ? banks[0].id : null;
      setSelectedBankId(selId);
    }
  }, [rowData, isEdit, isClosing, isView]);
  const options = pledgerData.map((p) => ({
    value: p.bank_pledger_details_id,
    label: p.name,
    data: p,
  }));
  const handlePledgerSelect = (option) => {
    setSelectedPledger(option);
    if (option) {
      const full = option.data;
      setFormData((prev) => ({
        ...prev,
        bank_pledger_details_id: full.bank_pledger_details_id,
        name: full.name,
        mobile_no: full.mobile_no,
        address: full.address,
      }));
      const banks = JSON.parse(full.bank_details || "[]");
      setBankList(banks);
      setSelectedBankId(null);
    } else {
      setBankList([]);
      setSelectedBankId(null);
      setFormData((prev) => ({
        ...prev,
        bank_pledger_details_id: "",
        name: "",
        mobile_no: "",
        address: "",
        bank_details: "",
      }));
    }
  };
  useEffect(() => {
    if (selectedBankId !== null && bankList.length > 0) {
      const bank = bankList.find((b) => b.id === selectedBankId);
      if (bank) {
        setFormData((prev) => ({
          ...prev,
          bank_details: JSON.stringify([bank]),
        }));
      }
    } else if (selectedBankId === null) {
      setFormData((prev) => ({
        ...prev,
        bank_details: "",
      }));
    }
  }, [selectedBankId, bankList]);
  // Auto-calculate interest_amount
  useEffect(() => {
    if (mode === "create" || mode === "edit") {
      const pv = parseFloat(formData.pawn_value) || 0;
      const ir = parseFloat(formData.interest_rate) || 0;
      const dm = parseInt(formData.duration_month) || 0;
      const interest = (pv * (ir / 100) * dm).toFixed(2);
      setFormData((prev) => ({ ...prev, interest_amount: interest }));
    }
  }, [
    formData.pawn_value,
    formData.interest_rate,
    formData.duration_month,
    mode,
  ]);
  // Auto-calculate pledge_due_date
  useEffect(() => {
    if (
      (mode === "create" || mode === "edit") &&
      formData.pledge_date &&
      formData.duration_month
    ) {
      const pd = new Date(formData.pledge_date);
      if (!isNaN(pd.getTime())) {
        const due = new Date(pd);
        due.setMonth(due.getMonth() + parseInt(formData.duration_month));
        const dueStr = due.toISOString().split("T")[0];
        setFormData((prev) => ({ ...prev, pledge_due_date: dueStr }));
      }
    }
  }, [formData.pledge_date, formData.duration_month, mode]);
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_DOMAIN}/bank_pledger.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const responseData = await response.json();
      console.log("responseData", responseData);
      if (responseData.head.code === 200) {
        toast.success(responseData.head.msg, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        setTimeout(() => {
          navigate("/console/master/bankpledger");
        }, 1000);
        setLoading(false);
      } else {
        toast.error(responseData.head.msg, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        setShowAlert(true);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };
  // Existing handleUpdateSubmit remains unchanged
  const handleUpdateSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_DOMAIN}/bank_pledger.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          edit_bank_pledger_id: rowData.bank_pledge_id,
          bank_pledger_details_id: formData.bank_pledger_details_id,
          name: formData.name,
          mobile_no: formData.mobile_no,
          address: formData.address,
          bank_details: formData.bank_details,
          pledge_date: formData.pledge_date,
          bank_loan_no: formData.bank_loan_no,
          pawn_loan_no: formData.pawn_loan_no,
          pawn_value: formData.pawn_value,
          interest_rate: formData.interest_rate,
          duration_month: formData.duration_month,
          interest_amount: formData.interest_amount,
          pledge_due_date: formData.pledge_due_date,
          additional_charges: formData.additional_charges,
        }),
      });
      const responseData = await response.json();
      if (responseData.head.code === 200) {
        toast.success(responseData.head.msg, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        setTimeout(() => {
          navigate("/console/master/bankpledger");
        }, 2000);
      } else {
        toast.error(responseData.head.msg, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        console.error(
          responseData.message || "Unknown error occurred during update"
        );
      }
    } catch (error) {
      console.error("Error updating bank_pledger:", error.message);
    }
    setLoading(false);
  };
  // New handler for closing
  const handleClosingSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_DOMAIN}/bank_pledger.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          edit_bank_pledger_id: rowData.bank_pledge_id,
          closing_date: formData.closing_date,
          closing_amount: formData.closing_amount,
          closing_interest_amount: formData.closing_interest_amount,
          extra_charges: formData.extra_charges,
          status: "Closed",
        }),
      });
      const responseData = await response.json();
      if (responseData.head.code === 200) {
        toast.success(responseData.head.msg, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        setTimeout(() => {
          navigate("/console/master/bankpledger");
        }, 2000);
      } else {
        toast.error(responseData.head.msg, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        console.error(
          responseData.message || "Unknown error occurred during closing"
        );
      }
    } catch (error) {
      console.error("Error closing bank_pledger:", error.message);
    }
    setLoading(false);
  };
  // Unified submit handler
  const handleFormSubmit = () => {
    if (isClosing) {
      handleClosingSubmit();
    } else if (isEdit) {
      handleUpdateSubmit();
    } else {
      handleSubmit();
    }
  };
  // Get selected bank for display in closing mode
  const selectedBank =
    bankList.find((b) => b.id === selectedBankId) || bankList[0];
  return (
    <div>
      <Container>
        <Row className="regular ">
          <Col lg="12" md="12" xs="12" className="py-3">
            <PageNav
              pagetitle={`Bank Pledger ${
                isView
                  ? "View"
                  : isClosing
                  ? "Closing"
                  : isEdit
                  ? "Edit"
                  : "Creation"
              }`}
            ></PageNav>
          </Col>
          {isClosing || isView ? (
            <>
              {/* Cards for static info in closing/view mode */}

              <Row className="mb-4">
                <Col lg={4}>
                  <div className="customer-card bg-light border rounded p-3 h-100">
                    <h5 className="mb-3">{t("Pledger Information")}</h5>{" "}
                    <ul className="list-unstyled">
                      <li className="mb-2 d-flex justify-content-between">
                        <strong>{t("Name")}:</strong>
                        <span>{formData.name || t("N/A")}</span>{" "}
                      </li>
                      <li className="mb-2 d-flex justify-content-between">
                        <strong>{t("Mobile No")}:</strong>
                        <span>{formData.mobile_no || t("N/A")}</span>{" "}
                      </li>
                      <li className="mb-2 d-flex justify-content-between">
                        <strong>{t("Address")}:</strong>
                        <span>{formData.address || t("N/A")}</span>{" "}
                      </li>
                    </ul>
                  </div>
                </Col>
                {/* ------------------------------------------------------------------ */}
                <Col lg={4}>
                  <div className="customer-card bg-light border rounded p-3 h-100">
                    <h5 className="mb-3">{t("Bank Details")}</h5>{" "}
                    <ul className="list-unstyled">
                      <li className="mb-2 d-flex justify-content-between">
                        <strong>{t("Bank Name")}:</strong>
                        <span>{selectedBank?.bank_name || t("N/A")}</span>{" "}
                      </li>
                      <li className="mb-2 d-flex justify-content-between">
                        <strong>{t("Account Limit")}:</strong>{" "}
                        <span>{selectedBank?.account_limit || t("N/A")}</span>{" "}
                      </li>
                      <li className="mb-2 d-flex justify-content-between">
                        <strong>{t("Pledge Count Limit")}:</strong>{" "}
                        <span>
                          {selectedBank?.pledge_count_limit || t("N/A")}
                        </span>{" "}
                      </li>
                    </ul>
                  </div>
                </Col>
                {/* ------------------------------------------------------------------ */}
                <Col lg={4}>
                  <div className="customer-card bg-light border rounded p-3 h-100">
                    <h5 className="mb-3">{t("Pledge Summary")}</h5>{" "}
                    <ul className="list-unstyled">
                      <li className="mb-2 d-flex justify-content-between">
                        <strong>{t("Bank Loan No")}:</strong>{" "}
                        <span>{formData.bank_loan_no || t("N/A")}</span>{" "}
                      </li>
                      <li className="mb-2 d-flex justify-content-between">
                        <strong>{t("Pawn Loan No")}:</strong>{" "}
                        <span>{formData.pawn_loan_no || t("N/A")}</span>{" "}
                      </li>
                      <li className="mb-2 d-flex justify-content-between">
                        <strong>{t("Pawn Value")}:</strong>{" "}
                        <span>
                          ₹
                          {parseFloat(
                            formData.pawn_value || 0
                          ).toLocaleString()}
                        </span>
                      </li>
                      <li className="mb-2 d-flex justify-content-between">
                        <strong>{t("Interest Rate")}:</strong>{" "}
                        <span>{formData.interest_rate || t("N/A")}%</span>{" "}
                      </li>
                      <li className="mb-2 d-flex justify-content-between">
                        <strong>{t("Duration Month")}:</strong>{" "}
                        <span>
                          {formData.duration_month || t("N/A")} {t("months")}
                        </span>{" "}
                      </li>
                      <li className="mb-2 d-flex justify-content-between">
                        <strong>{t("Interest Amount")}:</strong>{" "}
                        <span>
                          ₹
                          {parseFloat(
                            formData.interest_amount || 0
                          ).toLocaleString()}
                        </span>
                      </li>
                      <li className="mb-2 d-flex justify-content-between">
                        <strong>{t("Pledge Due Date")}:</strong>{" "}
                        <span>{formData.pledge_due_date || t("N/A")}</span>{" "}
                      </li>
                      <li className="mb-2 d-flex justify-content-between">
                        <strong>{t("Additional Charges")}:</strong>{" "}
                        <span>
                          ₹
                          {parseFloat(
                            formData.additional_charges || 0
                          ).toLocaleString()}
                        </span>
                      </li>
                    </ul>
                  </div>
                </Col>
              </Row>
              <Row className="mb-4">
                // NOTE: This assumes you have imported the useLanguage hook and
                destructured 't'. // e.g., const {t} = useLanguage();
                <Col lg={4}>
                  <div className="customer-card bg-light border rounded p-3 h-100">
                    <h5 className="mb-3">{t("Closing Details")}</h5>{" "}
                    {/* ✅ Translated Heading */}
                    <ul className="list-unstyled">
                      {isClosing ? (
                        <>
                          <li className="mb-2">
                            <TextInputForm
                              placeholder={t("Closing Date")} // ✅ Translated Placeholder
                              labelname={t("Closing Date")} // ✅ Translated Label
                              name="closing_date"
                              type="date"
                              value={formData.closing_date}
                              onChange={(e) => handleChange(e, "closing_date")}
                            />
                          </li>
                          <li className="mb-2">
                            <TextInputForm
                              placeholder={t("Closing Amount")} // ✅ Translated Placeholder
                              labelname={t("Closing Amount")} // ✅ Translated Label
                              name="closing_amount"
                              value={formData.closing_amount}
                              onChange={(e) =>
                                handleChange(e, "closing_amount")
                              }
                            />
                          </li>
                          <li className="mb-2">
                            <TextInputForm
                              placeholder={t("Closing Interest Amount")} // ✅ Translated Placeholder
                              labelname={t("Closing Interest Amount")} // ✅ Translated Label
                              name="closing_interest_amount"
                              value={formData.closing_interest_amount}
                              onChange={(e) =>
                                handleChange(e, "closing_interest_amount")
                              }
                            />
                          </li>
                          <li className="mb-2">
                            <TextInputForm
                              placeholder={t("Extra Charges")} // ✅ Translated Placeholder
                              labelname={t("Extra Charges")} // ✅ Translated Label
                              name="extra_charges"
                              value={formData.extra_charges}
                              onChange={(e) => handleChange(e, "extra_charges")}
                            />
                          </li>
                        </>
                      ) : (
                        <>
                          <li className="mb-2 d-flex justify-content-between">
                            <strong>{t("Closing Date")}:</strong>{" "}
                            {/* ✅ Translated Display Label */}
                            <span>
                              {formData.closing_date || t("N/A")}
                            </span>{" "}
                            {/* ✅ Translated Fallback */}
                          </li>
                          <li className="mb-2 d-flex justify-content-between">
                            <strong>{t("Closing Amount")}:</strong>{" "}
                            {/* ✅ Translated Display Label */}
                            <span>
                              ₹
                              {parseFloat(
                                formData.closing_amount || 0
                              ).toLocaleString()}
                            </span>
                          </li>
                          <li className="mb-2 d-flex justify-content-between">
                            <strong>{t("Closing Interest Amount")}:</strong>{" "}
                            {/* ✅ Translated Display Label */}
                            <span>
                              ₹
                              {parseFloat(
                                formData.closing_interest_amount || 0
                              ).toLocaleString()}
                            </span>
                          </li>
                          <li className="mb-2 d-flex justify-content-between">
                            <strong>{t("Extra Charges")}:</strong>{" "}
                            {/* ✅ Translated Display Label */}
                            <span>
                              ₹
                              {parseFloat(
                                formData.extra_charges || 0
                              ).toLocaleString()}
                            </span>
                          </li>
                        </>
                      )}
                    </ul>
                  </div>
                </Col>
              </Row>
            </>
          ) : (
            <>
              {/* Original form for create/edit modes */}

              <Col lg="4" md="12" xs="12" className="py-3">
                <label htmlFor="pledger-select">
                  {t("Select Bank Pledger Details")} {/* ✅ Translated Label */}
                </label>
                <Select
                  id="pledger-select"
                  value={selectedPledger}
                  onChange={handlePledgerSelect}
                  options={options}
                  isDisabled={isEdit}
                  placeholder={t("Search and select Pledger")}
                  isSearchable={true}
                />
              </Col>
              <Col lg="4" className="py-3"></Col>
              <Col lg="4" className="py-3"></Col>
              {bankList.length > 0 && (
                // NOTE: This assumes you have access to the 't' function, e.g., 
// import { useLanguage } from "../../components/LanguageContext";
// const { t } = useLanguage();

<Col lg="12" md="12" xs="12" className="py-3">
  <Table bordered responsive>
    <thead>
      <tr>
        <th>{t("S.No")}</th>                     {/* ✅ Translated Header */}
        <th>{t("Bank Name")}</th>                {/* ✅ Translated Header */}
        <th>{t("Account Limit")}</th>            {/* ✅ Translated Header */}
        <th>{t("Pledge Count Limit")}</th>       {/* ✅ Translated Header */}
        <th>{t("Select")}</th>                   {/* ✅ Translated Header */}
      </tr>
    </thead>
    <tbody>
      {bankList.map((bank, index) => (
        <tr key={bank.id}>
          <td>{index + 1}</td>
          <td>{bank.bank_name}</td>
          <td>{bank.account_limit}</td>
          <td>{bank.pledge_count_limit}</td>
          <td>
            <input
              type="checkbox"
              checked={selectedBankId === bank.id}
              onChange={(e) => {
                setSelectedBankId(
                  e.target.checked ? bank.id : null
                );
              }}
              disabled={isEdit}
            />
          </td>
        </tr>
      ))}
    </tbody>
  </Table>
</Col>
              )}
              {/* Existing fields with updated disabled logic */}
              <Col lg="4" md="6" xs="12" className="py-3">
                <TextInputForm
                  placeholder={"Pledge Date"}
                  labelname={"Pledge Date"}
                  name="pledge_date"
                  type="date"
                  value={formData.pledge_date}
                  onChange={(e) => handleChange(e, "pledge_date")}
                  disabled={isEdit && false}
                ></TextInputForm>
              </Col>
              <Col lg="4" md="6" xs="12" className="py-3">
                <TextInputForm
                  placeholder={"Bank Loan No"}
                  labelname={"Bank Loan No"}
                  name="bank_loan_no"
                  value={formData.bank_loan_no}
                  onChange={(e) => handleChange(e, "bank_loan_no")}
                  disabled={isEdit && true}
                ></TextInputForm>
              </Col>
              <Col lg="4" md="6" xs="12" className="py-3">
                <TextInputForm
                  placeholder={"Pawn Loan No"}
                  labelname={"Pawn Loan No"}
                  name="pawn_loan_no"
                  value={formData.pawn_loan_no}
                  onChange={(e) => handleChange(e, "pawn_loan_no")}
                  disabled={isEdit && true}
                ></TextInputForm>
              </Col>
              <Col lg="4" md="6" xs="12" className="py-3">
                <TextInputForm
                  placeholder={"Pawn Value"}
                  labelname={"Pawn Value"}
                  name="pawn_value"
                  value={formData.pawn_value}
                  onChange={(e) => handleChange(e, "pawn_value")}
                  disabled={isEdit && true}
                ></TextInputForm>
              </Col>
              <Col lg="4" md="6" xs="12" className="py-3">
                <TextInputForm
                  placeholder={"Interest Rate"}
                  labelname={"Interest Rate"}
                  name="interest_rate"
                  value={formData.interest_rate}
                  onChange={(e) => handleChange(e, "interest_rate")}
                  disabled={isEdit && false}
                ></TextInputForm>
              </Col>
              <Col lg="4" md="6" xs="12" className="py-3">
                <TextInputForm
                  placeholder={"Duration Month"}
                  labelname={"Duration Month"}
                  name="duration_month"
                  value={formData.duration_month}
                  onChange={(e) => handleChange(e, "duration_month")}
                  disabled={isEdit && false}
                ></TextInputForm>
              </Col>
              <Col lg="4" md="6" xs="12" className="py-3">
                <TextInputForm
                  placeholder={"Interest Amount"}
                  labelname={"Interest Amount"}
                  name="interest_amount"
                  value={formData.interest_amount}
                  onChange={(e) => handleChange(e, "interest_amount")}
                  disabled={isEdit && true}
                ></TextInputForm>
              </Col>
              <Col lg="4" md="6" xs="12" className="py-3">
                <TextInputForm
                  placeholder={"Pledge Due Date"}
                  labelname={"Pledge Due Date"}
                  name="pledge_due_date"
                  type="date"
                  value={formData.pledge_due_date}
                  onChange={(e) => handleChange(e, "pledge_due_date")}
                  disabled={isEdit && true}
                ></TextInputForm>
              </Col>
              <Col lg="4" md="6" xs="12" className="py-3">
                <TextInputForm
                  placeholder={"Additional Charges"}
                  labelname={"Additional Charges"}
                  name="additional_charges"
                  value={formData.additional_charges}
                  onChange={(e) => handleChange(e, "additional_charges")}
                  disabled={isEdit && false}
                ></TextInputForm>
              </Col>
            </>
          )}
          <Col lg="12" md="12" xs="12" className="py-5 align-self-center">
            <div className="text-center">
              <>
                <ToastContainer
                  position="top-center"
                  autoClose={2000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme="colored"
                />
                {isView ? (
                  <span className="mx-2">
                    <ClickButton
                      label={<>Back</>}
                      onClick={() => navigate("/console/master/bankpledger")}
                    ></ClickButton>
                  </span>
                ) : (
                  <>
                    <span className="mx-2">
                      <ClickButton
                        label={
                          loading ? (
                            <>Processing...</>
                          ) : isClosing ? (
                            <>Closing</>
                          ) : isEdit ? (
                            <>Update</>
                          ) : (
                            <>Submit</>
                          )
                        }
                        onClick={handleFormSubmit}
                        disabled={loading}
                      ></ClickButton>
                    </span>
                    <span className="mx-2">
                      <ClickButton
                        label={<>Cancel</>}
                        onClick={() => navigate("/console/master/bankpledger")}
                      ></ClickButton>
                    </span>
                  </>
                )}
              </>
            </div>
          </Col>
        </Row>
        {error && (
          <Alert variant="danger" className="error-alert">
            {error}
          </Alert>
        )}
      </Container>
    </div>
  );
};
export default BankPledgerCreation;
