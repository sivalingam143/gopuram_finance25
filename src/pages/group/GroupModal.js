import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import "../App.css";
import { TextInputForm } from "../../components/Forms";
import { ClickButton } from "../../components/ClickButton";
import { useLanguage } from "../../components/LanguageContext"; 
const GroupModal = () => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    Group: "",
  });
  const handleChange = (e, fieldName) => {
    const value = e.target ? e.target.value : e.value;

    setFormData({
      ...formData,
      [fieldName]: value,
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    console.log(formData);
    // ... (rest of the handleSubmit logic)
    setLoading(false);
  };
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <div>
      
      <ClickButton label={<>{t("Add New")}</>} onClick={handleShow}>
        {" "}
      </ClickButton>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>{t("Group Creation")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TextInputForm
            placeholder={t("Group Name")}
            labelname={t("Group Name")}
            value={formData.Group}
            onChange={(e) => handleChange(e, "Group")}
          />
        </Modal.Body>
        <Modal.Footer>
          <ClickButton label={<>{t("Close")}</>} onClick={handleClose}></ClickButton>
          <ClickButton
            label={<> {t("Submit")}</>}
            onClick={handleSubmit}
            disabled={loading}
          ></ClickButton>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default GroupModal;