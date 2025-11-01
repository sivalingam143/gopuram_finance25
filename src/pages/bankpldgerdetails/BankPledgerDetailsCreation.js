import React, { useState, useEffect } from "react";
import {
  Col,
  Container,
  Row,
  Alert,
  Modal,
  Table,
  Button,
} from "react-bootstrap";
import { TextInputForm } from "../../components/Forms";
import { ClickButton } from "../../components/ClickButton";
import PageNav from "../../components/PageNav";
import Select from "react-select";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import API_DOMAIN from "../../config/config";
import "react-toastify/dist/ReactToastify.css";
import { BsTrash } from "react-icons/bs";

const BankPledgerDetailsCreation = () => {
  const location = useLocation();
  const { type, rowData } = location.state || {};
  const initialState =
    type === "edit"
      ? { ...rowData }
      : {
          name: "",
          mobile_no: "",
          address: "",
        };
  const [formData, setFormData] = useState(initialState);
  const [banks, setBanks] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedBanks, setSelectedBanks] = useState(
    type === "edit" && rowData.bank_details
      ? JSON.parse(rowData.bank_details)
      : []
  );

  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();

  const redirectModal = () => {
    navigate("/console/master/bankpledgerdetails");
  };

  const handleChange = (e, fieldName) => {
    const value = e.target ? e.target.value : e.value;

    setFormData({
      ...formData,
      [fieldName]: value,
    });
  };

  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBanks();
  }, []);

  const fetchBanks = async () => {
    try {
      const response = await fetch(`${API_DOMAIN}/bank_details.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          search_text: "",
        }),
      });
      const responseData = await response.json();

      if (responseData.head.code === 200) {
        setBanks(
          Array.isArray(responseData.body.bank)
            ? responseData.body.bank
            : [responseData.body.bank]
        );
      }
    } catch (error) {
      console.error("Error fetching banks:", error);
    }
  };

  const options = banks.map((bank) => ({
    value: bank.bank_id,
    label: bank.bank_name,
  }));

  const handleSelectChange = (option) => {
    setSelectedOption(option);
  };

  const addBank = () => {
    if (selectedOption) {
      const bankObj = banks.find((b) => b.bank_id === selectedOption.value);
      if (
        bankObj &&
        !selectedBanks.some((sb) => sb.bank_id === bankObj.bank_id)
      ) {
        setSelectedBanks([...selectedBanks, bankObj]);
        setSelectedOption(null);
      } else if (selectedBanks.some((sb) => sb.bank_id === bankObj.bank_id)) {
        toast.error("Bank already added!", {
          position: "top-center",
          autoClose: 2000,
          theme: "colored",
        });
      }
    }
  };

  const removeBank = (bankId) => {
    setSelectedBanks(selectedBanks.filter((sb) => sb.bank_id !== bankId));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_DOMAIN}/bank_pledger_details.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          bank_details: JSON.stringify(selectedBanks),
        }),
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
          navigate("/console/master/bankpledgerdetails");
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
      const response = await fetch(`${API_DOMAIN}/bank_pledger_details.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          edit_name: rowData.bank_pledger_details_id,
          name: formData.name,
          mobile_no: formData.mobile_no,
          address: formData.address,
          bank_details: JSON.stringify(selectedBanks),
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
          navigate("/console/master/bankpledgerdetails");
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
      console.error("Error updating pledger:", error.message);
    }

    setLoading(false);
  };

  return (
    <div>
      <Container>
        <Row className="regular ">
          <Col lg="12" md="12" xs="12" className="py-3">
            <PageNav
              pagetitle={`Bank Pledger Details${
                type === "view"
                  ? " view "
                  : type === "edit"
                  ? "  Edit "
                  : " Creation "
              }`}
            ></PageNav>
          </Col>

          <Col lg="4" md="6" xs="12" className="py-3">
            {type === "edit" || type === "view" ? (
              <TextInputForm
                placeholder={"Pledger Name"}
                labelname={"Pledger Name"}
                name="name"
                value={formData.name}
                onChange={(e) => handleChange(e, "name")}
                disabled={type === "view"}
              ></TextInputForm>
            ) : (
              <TextInputForm
                placeholder={"Pledger Name"}
                labelname={"Pledger Name"}
                name="name"
                value={formData.name}
                onChange={(e) => handleChange(e, "name")}
              ></TextInputForm>
            )}
          </Col>
          <Col lg="4" md="6" xs="12" className="py-3">
            {type === "edit" || type === "view" ? (
              <TextInputForm
                placeholder={"Mobile No"}
                labelname={"Mobile No"}
                name="mobile_no"
                value={formData.mobile_no}
                onChange={(e) => handleChange(e, "mobile_no")}
                disabled={type === "view"}
              ></TextInputForm>
            ) : (
              <TextInputForm
                placeholder={"Mobile No"}
                labelname={"Mobile No"}
                name="mobile_no"
                value={formData.mobile_no}
                onChange={(e) => handleChange(e, "mobile_no")}
              ></TextInputForm>
            )}
          </Col>
          <Col lg="4" md="6" xs="12" className="py-3">
            {type === "edit" || type === "view" ? (
              <TextInputForm
                placeholder={"Address"}
                labelname={"Address"}
                name="address"
                value={formData.address}
                onChange={(e) => handleChange(e, "address")}
                disabled={type === "view"}
              ></TextInputForm>
            ) : (
              <TextInputForm
                placeholder={"Address"}
                labelname={"Address"}
                name="address"
                value={formData.address}
                onChange={(e) => handleChange(e, "address")}
              ></TextInputForm>
            )}
          </Col>

          {type !== "view" && (
            <>
              <Col lg="3" md="6" xs="12" className="py-3">
                <label htmlFor="bank-select">Select Bank</label>
                <Select
                  id="bank-select"
                  value={selectedOption}
                  onChange={handleSelectChange}
                  options={options}
                  placeholder="Select Bank"
                  isSearchable
                />
              </Col>
              <Col lg="3 " md="6" xs="12" className="py-3 ">
                <ClickButton
                  label={<>Add</>}
                  onClick={addBank}
                  disabled={!selectedOption}
                />
              </Col>
            </>
          )}

          <Col lg="12" md="12" xs="12" className="py-3">
            <Table responsive bordered>
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Bank Name</th>
                  <th>Account Limit</th>
                  <th>Pledge Count Limit</th>
                  {type !== "view" && <th>Action</th>}
                </tr>
              </thead>
              <tbody>
                {selectedBanks.length === 0 ? (
                  <tr>
                    <td
                      colSpan={type !== "view" ? 5 : 4}
                      className="text-center"
                    >
                      No banks added
                    </td>
                  </tr>
                ) : (
                  selectedBanks.map((bank, idx) => (
                    <tr key={bank.bank_id || idx}>
                      <td>{idx + 1}</td>
                      <td>{bank.bank_name}</td>
                      <td>{bank.account_limit}</td>
                      <td>{bank.pledge_count_limit}</td>
                      {type !== "view" && (
                        <td>
                          <Button
                            size="sm"
                            className="d-flex align-items-center justify-content-center delete-icon"
                            onClick={() => removeBank(bank.bank_id)}
                            style={{
                              borderRadius: "50%",
                              width: "35px",
                              height: "35px",
                              padding: 0,
                            }}
                          >
                            <BsTrash size={18} />
                          </Button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </Col>

          <Col lg="12" md="12" xs="12" className="py-5 align-self-center">
            <div className="text-center">
              {type === "view" ? (
                <ClickButton
                  label={<>Back</>}
                  onClick={() => navigate("/console/master/bankpledgerdetails")}
                ></ClickButton>
              ) : (
                <>
                  {type === "edit" ? (
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
                          disabled={loading}
                        ></ClickButton>
                      </span>

                      <span className="mx-2">
                        <ClickButton
                          label={<>Cancel</>}
                          onClick={() =>
                            navigate("/console/master/bankpledgerdetails")
                          }
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
                          label={loading ? <>Submitting...</> : <>Submit</>}
                          onClick={handleSubmit}
                          disabled={loading}
                        ></ClickButton>
                      </span>
                      <span className="mx-2">
                        <ClickButton
                          label={<>Cancel</>}
                          onClick={() =>
                            navigate("/console/master/bankpledgerdetails")
                          }
                        ></ClickButton>
                      </span>
                    </>
                  )}
                </>
              )}
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
          <p>Pledger saved successfully!</p>
        </Modal.Body>
        <Modal.Footer>
          <ClickButton
            variant="secondary"
            label={<>Close</>}
            onClick={() => redirectModal()}
          >
            Close
          </ClickButton>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BankPledgerDetailsCreation;
