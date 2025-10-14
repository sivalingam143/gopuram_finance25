import React, { useState } from 'react';
import { Col, Container, Row, Alert, Modal } from 'react-bootstrap';
import { TextInputForm } from '../../components/Forms';
import { ClickButton } from '../../components/ClickButton';
import PageNav from '../../components/PageNav';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import API_DOMAIN from '../../config/config';
import 'react-toastify/dist/ReactToastify.css';
const DropList = [
    {
        value: 'அட்மின்',
        label: 'அட்மின்'
    },
    {
        value: 'சூப்பர் அட்மின்',
        label: 'சூப்பர் அட்மின்'
    },
    {
        value: 'பணியாளர்',
        label: 'பணியாளர்'
    }
];
const UnitCreation = () => {
    
    const location = useLocation();
    const { type, rowData } = location.state || {};
    const initialState = type === 'edit' ? { ...rowData } : {
        unit_type: '',
      };
    const [formData, setFormData] = useState(initialState);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const navigate = useNavigate();

    const handleSaveUserSuccess = () => {
        setShowSuccessModal(true);
    };

    const redirectModal = () => {
        navigate('/console/master/unit');
    };

    const handleChange = (e, fieldName) => {
        const value = e.target ? e.target.value : e.value;

        setFormData({
            ...formData,
            [fieldName]: value
        });
    };

    const [showAlert, setShowAlert] = useState(false);
    const [loading, setLoading] = useState(false);
    const handleSubmit = async () => {
        for (const key in formData) {
            if (formData[key] === '') {
                toast.error(`${key} cannot be empty!`, {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
                return;
            }
        }
        setLoading(true);
        try {
            const response = await fetch(`${API_DOMAIN}/unit.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
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
                    navigate("/console/master/unit");
                }, 1000)
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
            console.error('Error:', error);
            setLoading(false);
        }
    };
    const handleUpdateSubmit = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_DOMAIN}/unit.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    edit_unit_type: rowData.unit_id, // Include the company ID in the request
                    unit_type: formData.unit_type,       
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
                    navigate("/console/master/unit");
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
                console.error(responseData.message || 'Unknown error occurred during update');
            }
        } catch (error) {
            console.error('Error updating product:', error.message);
        }

        setLoading(false);
    };

    return (
        <div>
            <Container>
                <Row className='regular justify-content-center'>
                    <Col lg='12' md='12' xs='12' className='py-3'>
                        <PageNav pagetitle={`யூனிட்${type === 'view' ? ' வியூ ' : type === 'edit' ? '  எடிட் ' : 'உருவாக்கம்'}`}></PageNav>
                    </Col>

                    <Col lg='4' md='6' xs='12' className='py-3'>
                        {type === 'edit' ? (
                            <TextInputForm
                                placeholder={'யூனிட் பெயர்'}
                                labelname={'யூனிட் பெயர்'}
                                name='Name'
                                value={formData.unit_type}
                                onChange={(e) => handleChange(e, 'unit_type')}
                            ></TextInputForm>
                        ) : (
                            <TextInputForm
                                placeholder={'யூனிட் பெயர்'}
                                labelname={'யூனிட் பெயர்'}
                                name='unit_type'
                                value={type === "view" ? rowData.unit_type : formData.unit_type}
                                onChange={(e) => handleChange(e, 'unit_type')}
                            ></TextInputForm>
                        )}
                    </Col>
                    <Col lg='12' md='12' xs='12' className='py-5 align-self-center'>
                        <div className='text-center'>
                            {type === "view" ? (
                                <ClickButton label={<>back</>} onClick={() => navigate("/console/master/unit")}></ClickButton>
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
                                            <span className='mx-2'>
                                                <ClickButton label={<>Update</>} onClick={handleUpdateSubmit}></ClickButton>

                                            </span>

                                            <span className='mx-2'>
                                                <ClickButton label={<>Cancel</>} onClick={() => navigate("/console/user")}></ClickButton>
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
                                            <span className='mx-2'>
                                                <ClickButton 
                                                label={loading ? <>Submitting...</> : <> Submit</>} 
                                                onClick={handleSubmit} 
                                                disabled={loading}></ClickButton>
                                            </span>
                                            <span className='mx-2'>
                                                <ClickButton label={<>Cancel</>} onClick={() => navigate("/console/user")}></ClickButton>
                                            </span>
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    </Col>
                </Row>
                {error && <Alert variant='danger' className='error-alert'>{error}</Alert>}
            </Container>
            <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} centered>
                <Modal.Body className='text-center'>
                    <img src={require('../components/sidebar/images/output-onlinegiftools.gif')} alt='Success GIF' />
                    <p>User saved successfully!</p>
                </Modal.Body>
                <Modal.Footer>
                    <ClickButton variant='secondary' label={<> Close</>} onClick={() => redirectModal()}>
                        Close
                    </ClickButton>
                </Modal.Footer>
            </Modal>
        </div >
    );
};

export default UnitCreation;