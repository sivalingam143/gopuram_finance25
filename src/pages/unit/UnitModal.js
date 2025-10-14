import React, { useState } from 'react'
import Modal from 'react-bootstrap/Modal';
import '../App.css'
import { TextInputForm } from '../../components/Forms';
import { ClickButton } from '../../components/ClickButton';
const UnitModal = () => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        Unit: ''
    });
    const handleChange = (e, fieldName) => {
        const value = e.target ? e.target.value : e.value;

        setFormData({
            ...formData,
            [fieldName]: value
        });
    };

    const handleSubmit = async () => {
        setLoading(true);
        console.log(formData);
        // ... (rest of the handleSubmit logic)
    };
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
        <div>
            <ClickButton label={<>Add New</>} onClick={handleShow}>  </ClickButton>
            <Modal show={show} onHide={handleClose} className='mt-3'>
                <Modal.Header>
                    <Modal.Title>யூனிட் உருவாக்கம்</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <TextInputForm placeholder={"யூனிட் பெயர்"} labelname={"யூனிட் பெயர்"} value={formData.Unit}
                        onChange={(e) => handleChange(e, 'Unit')} />
                </Modal.Body>
                <Modal.Footer>
                    <ClickButton label={<>Close</>} onClick={handleClose}></ClickButton>
                    <ClickButton label={<> Submit</>} onClick={handleSubmit} disabled={loading}></ClickButton>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default UnitModal