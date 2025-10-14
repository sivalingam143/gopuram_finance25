import React, { useState, useEffect } from "react";
import { Col, Container, Row, Alert, Modal, Table } from "react-bootstrap";
import { TextInputForm, DropDownUI, Calender } from "../../components/Forms";
import { ClickButton, Delete } from "../../components/ClickButton";
import PageNav from "../../components/PageNav";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API_DOMAIN from "../../config/config";
import { MdDeleteForever } from "react-icons/md";

const UserCreation = () => {
  const location = useLocation();
  const { type, rowData } = location.state || {};

  const today = new Date();
  const defaultDate = today.toISOString().substr(0, 10);
  const isValidDate = (date) => {
    return !isNaN(new Date(date).getTime());
  };
  const initialState =
    type === "edit"
      ? {
          ...rowData,
          pawnjewelry_date: isValidDate(rowData.pawnjewelry_date)
            ? new Date(rowData.pawnjewelry_date)
            : new Date(),
          pawnjewelry_recovery_date: isValidDate(
            rowData.pawnjewelry_recovery_date
          )
            ? new Date(rowData.pawnjewelry_recovery_date)
            : new Date(),
          pawnjewelry_recovery_finshed_date: isValidDate(
            rowData.pawnjewelry_recovery_finshed_date
          )
            ? new Date(rowData.pawnjewelry_recovery_finshed_date)
            : new Date(),
          receipt_no: rowData.recipt_no,
        }
      : {
          pawnjewelryg_id: "",
          customer_name: "",
          name_of_guardians: "",
          mobile_number: "",
          address: "",
          group: "",
          jewel_original_rate: "",
          pawn_rate: "",
          pawn_interest: "",
          pawn_interest_amount: "",
          pawnjewelry_date: defaultDate,
          pawnjewelry_recovery_date: defaultDate,
          pawnjewelry_recovery_finshed_date: defaultDate,
          receipt_no: "",
          customer_no: "",
          remark_jewel_pawn: "",
          createdby: "",
          paidby: "",
          jewel_product: [
            { JewelName: "", weight: "", count: "", remark: "", qlty: "" },
          ],
        };
  const [formData, setFormData] = useState(initialState);

  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [userData, setuserData] = useState([]);
  const [grupData, setgrupData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  const redirectModal = () => {
    navigate("/console/pawn/jewelpawng");
  };

  const handleChange = (e, fieldName, rowIndex) => {
    const value = e.target ? e.target.value : e.value;

    let updatedFormData = { ...formData };

    if (rowIndex !== undefined) {
      updatedFormData = {
        ...formData,
        jewel_product: formData.jewel_product.map((row, index) =>
          index === rowIndex ? { ...row, [fieldName]: value } : row
        ),
      };
    } else {
      updatedFormData = {
        ...formData,
        [fieldName]: value,
      };
    }

    let pawn_interest_amount = formData.pawn_interest_amount;
    if (fieldName === "pawn_rate" || fieldName === "pawn_interest") {
      const pawn_rate = parseFloat(
        fieldName === "pawn_rate" ? value : formData.pawn_rate
      );
      const interestRate = parseFloat(
        fieldName === "pawn_interest" ? value : formData.pawn_interest
      );
      pawn_interest_amount = (pawn_rate * interestRate) / 100;
    }

    setFormData({
      ...updatedFormData,
      pawn_interest_amount: isNaN(pawn_interest_amount)
        ? ""
        : String(pawn_interest_amount),
    });
  };
  const handleAddRow = () => {
    setFormData({
      ...formData,
      jewel_product: [...formData.jewel_product, { JewelName: "", weight: "" }],
    });
  };

  const handleDeleteRow = (index) => {
    if (formData.jewel_product.length === 1) {
      return;
    }
    const updatedRows = formData.jewel_product.filter(
      (row, rowIndex) => rowIndex !== index
    );
    setFormData({
      ...formData,
      jewel_product: updatedRows,
    });
  };

  const handleKeyPress = (event, index) => {
    if (event.key === "Enter") {
      if (
        formData.jewel_product[index].JewelName &&
        formData.jewel_product[index].weight
      ) {
        handleAddRow();
      } else {
        toast.error(
          "Please fill in both JewelName and weight before adding a new row"
        );
      }
    }
  };
  const setLabel = (date, label) => {
    const dateString = date instanceof Date ? date.toISOString() : date;
    handleChange(dateString, label);

    if (
      label === "pawnjewelry_date" ||
      label === "pawnjewelry_recovery_date" ||
      label === "pawnjewelry_recovery_finshed_date"
    ) {
      setFormData((prevData) => ({
        ...prevData,
        [label]: dateString,
      }));
    }
  };

  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const requestData = {
        pawnjewelryg_id: "",
        customer_no: formData.customer_no,
        receipt_no: formData.receipt_no,
        jewel_product: formData.jewel_product,
        customer_name: formData.customer_name,
        name_of_guardians: formData.name_of_guardians,
        mobile_number: formData.mobile_number,
        address: formData.address,
        group_id: formData.group,
        jewel_original_rate: formData.jewel_original_rate,
        pawn_rate: formData.pawn_rate,
        pawn_interest: formData.pawn_interest,
        pawn_interest_amount: formData.pawn_interest_amount,
        pawnjewelry_date: formData.pawnjewelry_date,
        remark_jewel_pawn: formData.remark_jewel_pawn,
        pawnjewelry_recovery_date: formData.pawnjewelry_recovery_date,
        //pawnjewelry_recovery_finshed_date:
        // formData.pawnjewelry_recovery_finshed_date,
        //paidby: formData.paidby,
        createdby: formData.createdby,
      };

      console.log("Request Data:", JSON.stringify(requestData, null, 2));

      const response = await fetch(`${API_DOMAIN}/pawnjewelryg.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const responseText = await response.text();
      console.log("Raw Response Text:", responseText);
      let responseData;
      if (responseText) {
        responseData = JSON.parse(responseText);
      } else {
        throw new Error("Empty response from server");
        setLoading(false);
      }

      console.log("Parsed Response Data:", responseData);
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
          //navigate("/console/pawn/jewelpawng");
          window.location.reload();
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
      toast.error("An error occurred. Please try again later.", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };
  const handleUpdateSubmit = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${API_DOMAIN}/pawnjewelryg.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pawnjewelryg_id: rowData.pawnjewelryg_id,
          customer_no: formData.customer_no,
          receipt_no: formData.receipt_no,
          jewel_product: formData.jewel_product,
          customer_name: formData.customer_name,
          name_of_guardians: formData.name_of_guardians,
          mobile_number: formData.mobile_number,
          address: formData.address,
          group_id: formData.group,
          jewel_original_rate: formData.jewel_original_rate,
          pawn_rate: formData.pawn_rate,
          pawn_interest: formData.pawn_interest,
          pawn_interest_amount: formData.pawn_interest_amount,
          pawnjewelry_date: formData.pawnjewelry_date,
          remark_jewel_pawn: formData.remark_jewel_pawn,
          pawnjewelry_recovery_date: formData.pawnjewelry_recovery_date,
          // pawnjewelry_recovery_finshed_date:
          //  formData.pawnjewelry_recovery_finshed_date,
          createdby: formData.createdby,
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
          //window.location.reload();
          navigate("/console/pawn/jewelpawng");
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
      }
    } catch (error) {
      console.error("Error updating product:", error.message);
    }

    setLoading(false);
  };
  const fetchDatacategory = async () => {
    try {
      const response = await fetch(`${API_DOMAIN}/category.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          search_text: "",
        }),
      });

      const responseData = await response.json();
      setLoading(false);
      if (responseData.head.code === 200) {
        setCategoryData(responseData.body.category);
      } else {
        throw new Error(responseData.head.msg);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error.message);
    }
  };
  const fetchgroup = async () => {
    try {
      const response = await fetch(`${API_DOMAIN}/group.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          search_text: "",
        }),
      });

      const responseData = await response.json();

      setLoading(false);
      if (responseData.head.code === 200) {
        let sortedData = responseData.body.group;

        setgrupData(Array.isArray(sortedData) ? sortedData : [sortedData]);
      } else {
        throw new Error(responseData.head.msg);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error.message);
    }
  };
  const fetchuser = async () => {
    try {
      const response = await fetch(`${API_DOMAIN}/users.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          search_text: "",
        }),
      });

      const responseData = await response.json();

      setLoading(false);
      if (responseData.head.code === 200) {
        const user = JSON.parse(localStorage.getItem("user"));

        let sortedData = responseData.body.user;
        if (user && user.role === "பணியாளர்") {
          sortedData = Array.isArray(sortedData)
            ? sortedData.filter((user) => user.RoleSelection === "பணியாளர்")
            : sortedData.RoleSelection === "பணியாளர்"
            ? [sortedData]
            : [];
        }
        setuserData(Array.isArray(sortedData) ? sortedData : [sortedData]);
      } else {
        throw new Error(responseData.head.msg);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error.message);
    }
  };
  useEffect(() => {
    fetchuser();
    fetchgroup();
    fetchDatacategory();
  }, []);

  const handleGroupChange = (updatedFormData) => {
    const selectedGroup = grupData.find(
      (group) => group.Group_id === updatedFormData.group
    );
    const selectedInterest = selectedGroup ? selectedGroup.interest : "";

    setFormData({
      ...formData,
      group: updatedFormData.group,
      pawn_interest: selectedInterest,
    });
  };

  return (
    <div>
      <Container fluid>
        <Row className="regular">
          <Col lg="12" md="6" xs="12" className="py-3">
            <PageNav
              pagetitle={`நகை அடகு - G${
                type === "view"
                  ? " வியூ "
                  : type === "edit"
                  ? "  எடிட் "
                  : "உருவாக்கம்"
              }`}
            ></PageNav>
          </Col>
          <Col lg="3" md="4" xs="12" className="py-3">
            <Calender
              setLabel={(date) => setLabel(date, "pawnjewelry_date")}
              initialDate={
                type === "edit" ? formData.pawnjewelry_date : undefined
              }
              calenderlabel="தேதி"
            />
          </Col>
          <Col lg="3" md="4" xs="12" className="py-3">
            <TextInputForm
              placeholder={"ரசீது எண்"}
              labelname={"ரசீது எண்"}
              name="receipt_no"
              value={formData.receipt_no}
              onChange={(e) => handleChange(e, "receipt_no")}
            ></TextInputForm>
          </Col>
          <Col lg="3" md="4" xs="12" className="py-3">
            <TextInputForm
              placeholder={"வாடிக்கையாளர் எண்"}
              labelname={"வாடிக்கையாளர் எண்"}
              name="customer_no"
              value={formData.customer_no}
              onChange={(e) => handleChange(e, "customer_no")}
            />
          </Col>
          <Col lg="3" md="4" xs="12" className="py-3">
            <TextInputForm
              placeholder={"வாடிக்கையாளர் பெயர்"}
              labelname={"வாடிக்கையாளர் பெயர்"}
              name="customer_name"
              value={formData.customer_name}
              onChange={(e) => handleChange(e, "customer_name")}
            ></TextInputForm>
          </Col>

          <Col lg="3" md="4" xs="12" className="py-3">
            <TextInputForm
              placeholder={"தந்தை அல்லது கணவர் பெயர்"}
              labelname={"தந்தை அல்லது கணவர் பெயர்"}
              name="name_of_guardians"
              value={formData.name_of_guardians}
              onChange={(e) => handleChange(e, "name_of_guardians")}
            ></TextInputForm>
          </Col>
          <Col lg="3" md="4" xs="12" className="py-3">
            <TextInputForm
              placeholder={"கைபேசி எண்"}
              labelname={"கைபேசி எண்"}
              name="mobile_number"
              value={formData.mobile_number}
              onChange={(e) => handleChange(e, "mobile_number")}
            />
          </Col>

          <Col lg="3" md="4" xs="12" className="py-3">
            <TextInputForm
              placeholder={"முகவரி"}
              labelname={"முகவரி"}
              name="address"
              value={formData.address}
              onChange={(e) => handleChange(e, "address")}
            ></TextInputForm>
          </Col>
          <Col lg="3" md="4" xs="12" className="py-3">
            <DropDownUI
              optionlist={grupData.map((user) => ({
                value: user.Group_id,
                label: user.Group_type,
              }))}
              placeholder="குரூப்"
              labelname="குரூப்"
              name="group"
              value={formData.group}
              onChange={handleGroupChange}
            />
          </Col>
          <Col lg="3" md="4" xs="12" className="py-3">
            <TextInputForm
              placeholder={"சுமார் மதிப்பு"}
              labelname={"சுமார் மதிப்பு"}
              name="jewel_original_rate"
              value={formData.jewel_original_rate}
              onChange={(e) => handleChange(e, "jewel_original_rate")}
            ></TextInputForm>
          </Col>
          <Col lg="3" md="4" xs="12" className="py-3">
            <TextInputForm
              placeholder={"அடகு ரூபாய்"}
              labelname={"அடகு ரூபாய்"}
              name="Pawning Price"
              value={formData.pawn_rate}
              onChange={(e) => handleChange(e, "pawn_rate")}
            ></TextInputForm>
          </Col>
          <Col lg="3" md="4" xs="12" className="py-3">
            <TextInputForm
              placeholder={"வட்டி விகிதம்"}
              labelname={"வட்டி விகிதம்"}
              name="pawn_interest"
              value={formData.pawn_interest}
              onChange={(e) => handleChange(e, "pawn_interest")}
            ></TextInputForm>
          </Col>
          <Col lg="3" md="4" xs="12" className="py-3">
            <TextInputForm
              placeholder={"வட்டி தொகை"}
              labelname={"வட்டி தொகை"}
              name="pawn_interest_amount"
              value={formData.pawn_interest_amount}
              onChange={(e) => handleChange(e, "pawn_interest_amount")}
            ></TextInputForm>
          </Col>
          <Col lg="3" md="4" xs="12" className="py-3">
            <Calender
              setLabel={(date) => setLabel(date, "pawnjewelry_recovery_date")}
              initialDate={
                type === "edit" ? formData.pawnjewelry_recovery_date : undefined
              }
              calenderlabel="நகை மீட்க ஒப்பு தேதி"
            />
          </Col>
          {/* <Col lg='3' md='4' xs="12" className='py-3'>
                        <Calender setLabel={(date) => setLabel(date, 'pawnjewelry_recovery_finshed_date')} initialDate={type === 'edit' ? formData.pawnjewelry_recovery_finshed_date : undefined} calenderlabel="நகை மீட்ட தேதி "/>
                    </Col> */}
          <Col lg="3" md="4" xs="12" className="py-3">
            <DropDownUI
              optionlist={userData.map((user) => ({
                value: user.nickname,
                label: user.nickname,
              }))}
              placeholder={"Created By"}
              labelname={"Created By"}
              name="createdby"
              value={formData.createdby}
              onChange={(updatedFormData) =>
                setFormData({
                  ...formData,
                  createdby: updatedFormData.createdby,
                })
              }
            ></DropDownUI>
          </Col>
          {/* <Col lg='3' md='4' xs='12' className='py-3'>
                        <DropDownUI
                            optionlist={userData.map(user => ({
                                value: user.nickname,
                                label: user.nickname
                            }))}
                            placeholder={'Paid By'}
                            labelname={'Paid By'}
                            name='paidby'
                            value={formData.paidby}

                            onChange={(updatedFormData) => setFormData({ ...formData, paidby: updatedFormData.paidby })}
                        ></DropDownUI>
                    </Col> */}
          <Col lg="12" className="align-self-center py-3">
            <label>Remark</label>
            <div>
              <textarea
                className="form-cntrl w-100"
                placeholder="Remark"
                value={formData.remark_jewel_pawn}
                onChange={(e) => handleChange(e, "remark_jewel_pawn")}
              ></textarea>
            </div>
          </Col>
          <Col lg="12" md="6" xs="12">
            <table className="table  mx-auto">
              <thead>
                <tr>
                  <th>S.no</th>
                  <th className="w-50">நகை பெயர்</th>
                  <th>எண்ணிக்கை</th>
                  <th>தரம்</th>
                  <th>எடை</th>
                  <th>குறிப்பு</th>
                  <th></th>
                  <th>நீக்கு</th>
                </tr>
              </thead>
              <tbody>
                {formData.jewel_product &&
                  formData.jewel_product.length > 0 &&
                  formData.jewel_product.map((row, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td className="w-50">
                        <textarea
                          className="form-cntrl w-100 "
                          value={row.JewelName}
                          onChange={(e) => handleChange(e, "JewelName", index)}
                          onKeyDown={(e) => handleKeyPress(e, index)}
                          autoFocus={
                            index === formData.jewel_product.length - 1
                          }
                        />
                      </td>
                      <td>
                        <textarea
                          className="form-cntrl w-75 "
                          value={row.count}
                          onChange={(e) => handleChange(e, "count", index)}
                          onKeyDown={(e) => handleKeyPress(e, index)}
                        />
                      </td>
                      <td className="w-8">
                        <textarea
                          className="form-cntrl w-100 "
                          value={row.qlty}
                          onChange={(e) => handleChange(e, "qlty", index)}
                          onKeyDown={(e) => handleKeyPress(e, index)}
                        />
                      </td>
                      <td className="w-8">
                        <textarea
                          className="form-cntrl w-100 "
                          value={row.weight}
                          onChange={(e) => handleChange(e, "weight", index)}
                          onKeyDown={(e) => handleKeyPress(e, index)}
                        />
                      </td>
                      <td className="w-50">
                        <textarea
                          className="form-cntrl w-100 "
                          value={row.remark}
                          onChange={(e) => handleChange(e, "remark", index)}
                          onKeyDown={(e) => handleKeyPress(e, index)}
                        />
                      </td>
                      <td>
                        <div className="d-none">
                          {index === formData.jewel_product.length - 1 && (
                            <ClickButton
                              label={<>Add More</>}
                              onClick={handleAddRow}
                            />
                          )}
                        </div>
                      </td>
                      <td>
                        <Delete
                          onClick={() => handleDeleteRow(index)}
                          label={<MdDeleteForever />}
                        ></Delete>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </Col>
          <Col lg="12">
            <div className="text-center mb-3">
              {type === "view" ? (
                <span className="mx-2">
                  <ClickButton
                    label={<>back</>}
                    onClick={() => navigate("/console/pawn/jewelpawng")}
                  />
                </span>
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
                        />
                      </span>
                      <span className="mx-2">
                        <ClickButton
                          label={<>cancle</>}
                          onClick={() => navigate("/console/pawn/jewelpawng")}
                        />
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
                      <span className="px-2">
                        <ClickButton
                          label={loading ? <>Submitting...</> : <> Submit</>}
                          onClick={handleSubmit}
                          disabled={loading}
                        ></ClickButton>
                      </span>
                      <span className="px-2">
                        <ClickButton
                          label={<> Cancel</>}
                          onClick={() => navigate("/console/pawn/jewelpawng")}
                          disabled={loading}
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
          <p>User saved successfully!</p>
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

export default UserCreation;
