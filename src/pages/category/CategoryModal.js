import React, { useState } from 'react'
import Modal from 'react-bootstrap/Modal';
import '../App.css'
import { TextInputForm } from '../../components/Forms';
import { ClickButton } from '../../components/ClickButton';
import { Col } from 'react-bootstrap';
import { DropDownUI } from '../../components/Forms';
const DropList = [
    {
        value: 'Admin',
        label: 'Admin'
    },
    {
        value: 'சூப்பர் அட்மின்',
        label: 'சூப்பர் அட்மின்'
    },
    {
        value: 'Staff',
        label: 'Staff'
    }
];
const GroupModal = () => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        CategoryName: '',
        GroupName:''
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
            <Modal show={show} onHide={handleClose}>
                <Modal.Header>
                    <Modal.Title>வகை உருவாக்கம்</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Col lg='12' md='12' xs='12' className='py-3'>
                        <TextInputForm
                        placeholder={'வகை பெயர்'}
                        labelname={'வகை பெயர்'}
                        name='CategoryName'
                        value={formData.CategoryName}
                        onChange={(e) => handleChange(e, 'CategoryName')}
                        ></TextInputForm>
                     </Col>
                        <Col lg='12' md='12' xs='12' className='py-3'>
                        <DropDownUI
                            optionlist={DropList}
                            placeholder='குரூப் பெயர்'
                            labelname='குரூப் பெயர்'
                            name='GroupName'
                            value={formData.GroupName}
                            onChange={(updatedFormData) => setFormData({ ...formData, GroupName: updatedFormData.GroupName })}
                        />
                    </Col>
                </Modal.Body>
                <Modal.Footer>
                    <ClickButton label={<>Close</>} onClick={handleClose}></ClickButton>
                    <ClickButton label={<> Submit</>} onClick={handleSubmit} disabled={loading}></ClickButton>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default GroupModal