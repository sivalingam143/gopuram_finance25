import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { TextInputForm, TextArea, Calender } from "../../components/Forms";
import { ClickButton } from "../../components/ClickButton";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API_DOMAIN from "../../config/config";
import Dialog from "../../components/Dialog";

const OldRecordCreation = () => {
  const [formData, setFormData] = useState({
    oldrecord_date: "",
    bill_no: "",
    customer_details: "",
    pawn_amount: "",
    interest_amount: "",
    jewel_details: "",
    count: "",
    weight: "",
    amount: "",
    recovery_date: "",
  });
  console.log(formData);

  const [loading, setLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleShowDialog = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmSubmit = (confirm) => {
    setShowConfirmDialog(false);
    if (confirm) {
      handleSubmit(); // Trigger form submission if confirmed
    }
  };

  const handleChange = (e, fieldName) => {
    const value = e.target ? e.target.value : e;
    setFormData({
      ...formData,
      [fieldName]: value,
    });
  };

  const handleSubmit = async () => {
    // Validate formData to ensure required fields are filled
    for (const key in formData) {
      if (!formData[key]) {
        toast.error(`${key} cannot be empty!`, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
        return;
      }
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_DOMAIN}/oldrecord.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          oldrecord_date: formData.oldrecord_date,
          bill_no: formData.bill_no,
          customer_details: formData.customer_details,
          pawn_amount: formData.pawn_amount,
          interest_amount: formData.interest_amount,
          jewel_details: formData.jewel_details, // Ensure jewel details are serialized
          count: formData.count,
          weight: formData.weight,
          amount: formData.amount,
          recovery_date: formData.recovery_date,
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
          theme: "colored",
        });

        // Reset form data or navigate to another page if required
        setFormData({
          oldrecord_date: "",
          bill_no: "",
          customer_details: "",
          pawn_amount: "",
          interest_amount: "",
          jewel_details: "",
          count: "",
          weight: "",
          amount: "",
          recovery_date: "",
        });
      } else {
        toast.error(responseData.head.msg, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
      }
    } catch (error) {
      console.error("Error during record creation:", error.message);
      toast.error("An error occurred. Please try again.", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Container fluid>
        <ToastContainer />
        <Row>
          <Col lg="12" className="py-3">
            <h3 className="text-center">Old Record</h3>
          </Col>
          <Col lg="4" className="py-3">
            <Calender
              calenderlabel="Old Record Date"
              value={formData.oldrecord_date} // Add this line
              setLabel={(date) => handleChange(date, "oldrecord_date")}
            />
          </Col>
          <Col lg="4" className="py-3">
            <TextInputForm
              labelname="Bill No."
              placeholder="Enter Bill Number"
              value={formData.bill_no}
              onChange={(e) => handleChange(e, "bill_no")}
            />
          </Col>
          <Col lg="4" className="py-3">
            <TextArea
              label="Customer Details"
              placeholder="Enter Customer Details"
              value={formData.customer_details}
              onChange={(e) => handleChange(e, "customer_details")}
            />
          </Col>
          <Col lg="4" className="py-3">
            <TextInputForm
              labelname="Pawn Amount"
              placeholder="Enter Pawn Amount"
              value={formData.pawn_amount}
              onChange={(e) => handleChange(e, "pawn_amount")}
            />
          </Col>
          <Col lg="4" className="py-3">
            <TextInputForm
              labelname="Interest Amount"
              placeholder="Enter Interest Amount"
              value={formData.interest_amount}
              onChange={(e) => handleChange(e, "interest_amount")}
            />
          </Col>
          <Col lg="4" className="py-3">
            <TextArea
              label="Jewel Details"
              placeholder="Enter Jewel Details"
              value={formData.jewel_details}
              onChange={(e) => handleChange(e, "jewel_details")}
            />
          </Col>
          <Col lg="4" className="py-3">
            <TextInputForm
              labelname="Count"
              placeholder="Enter Count"
              value={formData.count}
              onChange={(e) => handleChange(e, "count")}
            />
          </Col>
          <Col lg="4" className="py-3">
            <TextInputForm
              labelname="Weight"
              placeholder="Enter Weight"
              value={formData.weight}
              onChange={(e) => handleChange(e, "weight")}
            />
          </Col>
          <Col lg="4" className="py-3">
            <TextInputForm
              labelname="Amount"
              placeholder="Enter Amount"
              value={formData.amount}
              onChange={(e) => handleChange(e, "amount")}
            />
          </Col>
          <Col lg="4" className="py-3">
            <Calender
              calenderlabel="Recovery Date"
              value={formData.recovery_date} // Add this line
              setLabel={(date) => handleChange(date, "recovery_date")}
            />
          </Col>
          <Col lg="12" className="py-3">
            <div className="text-center">
              <ClickButton label="Submit" onClick={handleShowDialog} />
            </div>
          </Col>
        </Row>
      </Container>

      <Dialog
        DialogTitle="Do You Want to Submit the Form?"
        isVisible={showConfirmDialog}
        onConfirm={() => handleConfirmSubmit(true)} // Trigger form submission here
        onCancel={() => handleConfirmSubmit(false)} // Close dialog without submitting
      />
    </div>
  );
};

export default OldRecordCreation;
