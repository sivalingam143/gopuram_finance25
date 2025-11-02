import React, { useState, useEffect } from "react";
import { Col, Container, Row, Alert, Modal, Table } from "react-bootstrap";
import Select from "react-select";
import { TextInputForm, DropDownUI } from "../../components/Forms";
import { ClickButton } from "../../components/ClickButton";
import PageNav from "../../components/PageNav";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import API_DOMAIN from "../../config/config";
import "react-toastify/dist/ReactToastify.css";

const BankPledgerCreation = () => {
  const location = useLocation();
  const { type, rowData } = location.state || {};
  const initialState =
    type === "edit"
      ? { ...rowData }
      : {
          bank_pledger_details_id: "",
          name: "",
          mobile_no: "",
          address: "",
          bank_details: "",
          pledge_date: "",
          bank_loan_no: "",
          pawn_value: "",
          interest_rate: "",
          duration_month: "",
          interest_amount: "",
          pledge_due_date: "",
          additional_charges: "",
        };
  const [formData, setFormData] = useState(initialState);
  console.log(formData);
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pledgerData, setPledgerData] = useState([]);
  const [selectedPledger, setSelectedPledger] = useState(null);
  const [bankList, setBankList] = useState([]);
  const [selectedBankId, setSelectedBankId] = useState(null);
  const navigate = useNavigate();
  const isEdit = type === "edit";

  const redirectModal = () => {
    navigate("/console/master/bankpledger");
  };

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
    if (isEdit && rowData) {
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
  }, [rowData, isEdit]);

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

  return (
    <div>
      <Container>
        <Row className="regular justify-content-center">
          <Col lg="12" md="12" xs="12" className="py-3">
            <PageNav
              pagetitle={`Bank Pledger ${
                type === "edit" ? " Edit " : " Creation "
              }`}
            ></PageNav>
          </Col>

          <Col lg="12" md="12" xs="12" className="py-3">
            <label htmlFor="pledger-select">Select Bank Pledger Details</label>
            <Select
              id="pledger-select"
              value={selectedPledger}
              onChange={handlePledgerSelect}
              options={options}
              isDisabled={isEdit}
              placeholder="Search and select Pledger"
              isSearchable={true}
            />
          </Col>

          {bankList.length > 0 && (
            <Col lg="12" md="12" xs="12" className="py-3">
              <Table bordered responsive>
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Bank Name</th>
                    <th>Account Limit</th>
                    <th>Pledge Count Limit</th>
                    <th>Select</th>
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

          <Col lg="4" md="6" xs="12" className="py-3">
            <TextInputForm
              placeholder={"Name"}
              labelname={"Name"}
              name="name"
              value={formData.name}
              onChange={(e) => handleChange(e, "name")}
              disabled={true}
            ></TextInputForm>
          </Col>
          <Col lg="4" md="6" xs="12" className="py-3">
            <TextInputForm
              placeholder={"Mobile No"}
              labelname={"Mobile No"}
              name="mobile_no"
              value={formData.mobile_no}
              onChange={(e) => handleChange(e, "mobile_no")}
              disabled={true}
            ></TextInputForm>
          </Col>
          <Col lg="4" md="6" xs="12" className="py-3">
            <TextInputForm
              placeholder={"Address"}
              labelname={"Address"}
              name="address"
              value={formData.address}
              onChange={(e) => handleChange(e, "address")}
              disabled={true}
            ></TextInputForm>
          </Col>
          <Col lg="4" md="6" xs="12" className="py-3">
            {isEdit ? (
              <TextInputForm
                placeholder={"Pledge Date"}
                labelname={"Pledge Date"}
                name="pledge_date"
                type="date"
                value={formData.pledge_date}
                onChange={(e) => handleChange(e, "pledge_date")}
              ></TextInputForm>
            ) : (
              <TextInputForm
                placeholder={"Pledge Date"}
                labelname={"Pledge Date"}
                name="pledge_date"
                type="date"
                value={formData.pledge_date}
                onChange={(e) => handleChange(e, "pledge_date")}
              ></TextInputForm>
            )}
          </Col>
          <Col lg="4" md="6" xs="12" className="py-3">
            {isEdit ? (
              <TextInputForm
                placeholder={"Bank Loan No"}
                labelname={"Bank Loan No"}
                name="bank_loan_no"
                value={formData.bank_loan_no}
                onChange={(e) => handleChange(e, "bank_loan_no")}
              ></TextInputForm>
            ) : (
              <TextInputForm
                placeholder={"Bank Loan No"}
                labelname={"Bank Loan No"}
                name="bank_loan_no"
                value={formData.bank_loan_no}
                onChange={(e) => handleChange(e, "bank_loan_no")}
              ></TextInputForm>
            )}
          </Col>
          <Col lg="4" md="6" xs="12" className="py-3">
            {isEdit ? (
              <TextInputForm
                placeholder={"Pawn Value"}
                labelname={"Pawn Value"}
                name="pawn_value"
                value={formData.pawn_value}
                onChange={(e) => handleChange(e, "pawn_value")}
              ></TextInputForm>
            ) : (
              <TextInputForm
                placeholder={"Pawn Value"}
                labelname={"Pawn Value"}
                name="pawn_value"
                value={formData.pawn_value}
                onChange={(e) => handleChange(e, "pawn_value")}
              ></TextInputForm>
            )}
          </Col>
          <Col lg="4" md="6" xs="12" className="py-3">
            {isEdit ? (
              <TextInputForm
                placeholder={"Interest Rate"}
                labelname={"Interest Rate"}
                name="interest_rate"
                value={formData.interest_rate}
                onChange={(e) => handleChange(e, "interest_rate")}
              ></TextInputForm>
            ) : (
              <TextInputForm
                placeholder={"Interest Rate"}
                labelname={"Interest Rate"}
                name="interest_rate"
                value={formData.interest_rate}
                onChange={(e) => handleChange(e, "interest_rate")}
              ></TextInputForm>
            )}
          </Col>
          <Col lg="4" md="6" xs="12" className="py-3">
            {isEdit ? (
              <TextInputForm
                placeholder={"Duration Month"}
                labelname={"Duration Month"}
                name="duration_month"
                value={formData.duration_month}
                onChange={(e) => handleChange(e, "duration_month")}
              ></TextInputForm>
            ) : (
              <TextInputForm
                placeholder={"Duration Month"}
                labelname={"Duration Month"}
                name="duration_month"
                value={formData.duration_month}
                onChange={(e) => handleChange(e, "duration_month")}
              ></TextInputForm>
            )}
          </Col>
          <Col lg="4" md="6" xs="12" className="py-3">
            {isEdit ? (
              <TextInputForm
                placeholder={"Interest Amount"}
                labelname={"Interest Amount"}
                name="interest_amount"
                value={formData.interest_amount}
                onChange={(e) => handleChange(e, "interest_amount")}
              ></TextInputForm>
            ) : (
              <TextInputForm
                placeholder={"Interest Amount"}
                labelname={"Interest Amount"}
                name="interest_amount"
                value={formData.interest_amount}
                onChange={(e) => handleChange(e, "interest_amount")}
              ></TextInputForm>
            )}
          </Col>
          <Col lg="4" md="6" xs="12" className="py-3">
            {isEdit ? (
              <TextInputForm
                placeholder={"Pledge Due Date"}
                labelname={"Pledge Due Date"}
                name="pledge_due_date"
                type="date"
                value={formData.pledge_due_date}
                onChange={(e) => handleChange(e, "pledge_due_date")}
              ></TextInputForm>
            ) : (
              <TextInputForm
                placeholder={"Pledge Due Date"}
                labelname={"Pledge Due Date"}
                name="pledge_due_date"
                type="date"
                value={formData.pledge_due_date}
                onChange={(e) => handleChange(e, "pledge_due_date")}
              ></TextInputForm>
            )}
          </Col>
          <Col lg="4" md="6" xs="12" className="py-3">
            {isEdit ? (
              <TextInputForm
                placeholder={"Additional Charges"}
                labelname={"Additional Charges"}
                name="additional_charges"
                value={formData.additional_charges}
                onChange={(e) => handleChange(e, "additional_charges")}
              ></TextInputForm>
            ) : (
              <TextInputForm
                placeholder={"Additional Charges"}
                labelname={"Additional Charges"}
                name="additional_charges"
                value={formData.additional_charges}
                onChange={(e) => handleChange(e, "additional_charges")}
              ></TextInputForm>
            )}
          </Col>
          <Col lg="12" md="12" xs="12" className="py-5 align-self-center">
            <div className="text-center">
              <>
                {isEdit ? (
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
                    <span className="mx-2">
                      <ClickButton
                        label={<>Update</>}
                        onClick={handleUpdateSubmit}
                      ></ClickButton>
                    </span>

                    <span className="mx-2">
                      <ClickButton
                        label={<>Cancel</>}
                        onClick={() => navigate("/console/master/bankpledger")}
                      ></ClickButton>
                    </span>
                  </>
                ) : (
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
                    <span className="mx-2">
                      <ClickButton
                        label={loading ? <>Submitting...</> : <> Submit</>}
                        onClick={handleSubmit}
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
      <Modal
        show={showSuccessModal}
        onHide={() => setShowSuccessModal(false)}
        centered
      >
        <Modal.Body className="text-center">
          <img
            src={require("../../components/sidebar/images/output-onlinegiftools.gif")}
            alt="Success GIF"
          />
          <p>Bank Pledger saved successfully!</p>
        </Modal.Body>
        <Modal.Footer>
          <ClickButton
            variant="secondary"
            label={<> Close</>}
            onClick={() => redirectModal()}
          >
            Close
          </ClickButton>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BankPledgerCreation;
