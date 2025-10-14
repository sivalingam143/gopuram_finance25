import React, { useState,useEffect } from 'react';
import { Col, Container, Row, Alert, Modal } from 'react-bootstrap';
import { TextInputForm, DropDownUI } from '../../components/Forms';
import { ClickButton } from '../../components/ClickButton';
import PageNav from '../../components/PageNav';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import API_DOMAIN from '../../config/config';
import 'react-toastify/dist/ReactToastify.css';
const CategoryCreation = () => {
   
    const location = useLocation();
    const { type, rowData } = location.state || {};
    const initialState = type === 'edit' ? { ...rowData } : {
        group_id: '',
        Category_type: ''
      };
    const [formData, setFormData] = useState(initialState);

    console.log('formData',formData);

    const [error, setError] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [grupData,setgrupData] = useState([]);
    console.log('grupData',grupData)
    const navigate = useNavigate();


    const redirectModal = () => {
        navigate('/console/master/category');
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

            const response = await fetch(`${API_DOMAIN}/category.php`, {
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
                    navigate("/console/master/category");
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
            const response = await fetch(`${API_DOMAIN}/category.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    edit_Category_id: rowData.category_id, // Include the company ID in the request
                    group_id: formData.group_id,
                    Category_type: formData.Category_type,
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

                // Navigate to the user list page after a delay
                setTimeout(() => {
                    navigate("/console/master/category");
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
    const fetchgroup = async () => {
        try {
          const response = await fetch(`${API_DOMAIN}/group.php`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              search_text: ''
            })
          });
    
    
          const responseData = await response.json();
          console.log('responseData',responseData)
          setLoading(false);
          if (responseData.head.code === 200) {
            let sortedData = responseData.body.group;

            setgrupData(Array.isArray(sortedData) ? sortedData : [sortedData]);
          } else {
            throw new Error(responseData.head.msg);
          }
        } catch (error) {
          setLoading(false);
          console.error('Error fetching data:', error.message);
        }
      };

    useEffect(() => {
      
    fetchgroup();
      
    }, [])
    

    return (
        <div>
            <Container>
                <Row className='regular justify-content-center'>
                    <Col lg='12' md='12' xs='12' className='py-3'>
                        <PageNav pagetitle={`வகை${type === 'view' ? ' வியூ ' : type === 'edit' ? '  எடிட் ' : 'உருவாக்கம்'}`}></PageNav>
                    </Col>

                    <Col lg='4' md='6' xs='12' className='py-3'>
                        {type === 'edit' ? (
                            <DropDownUI
                            optionlist={grupData.map(user => ({
                                value: user.Group_id,
                                label: user.Group_type
                            }))}
                            placeholder='குரூப்'
                            labelname='குரூப்'
                            name='group_id'
                            value={formData.group_id}
                            onChange={(updatedFormData) => setFormData({ ...formData, group_id: updatedFormData.group_id })}
                        />
                        ) : (
                            <DropDownUI
                            optionlist={grupData.map(user => ({
                                value: user.Group_id,
                                label: user.Group_type
                            }))}
                            placeholder='குரூப்'
                            labelname='குரூப்'
                            name='group_id'
                            value={type === "view" ? rowData.group_id : formData.group_id}
                            onChange={(updatedFormData) => setFormData({ ...formData, group_id: updatedFormData.group_id })}
                        />
                        )}
                    </Col>
                    <Col lg='4' md='6' xs='12' className='py-3'>
                        {type === 'edit' ? (
                            <TextInputForm
                                placeholder={'வகை'}
                                labelname={'வகை'}
                                name='Category_type'
                                value={formData.Category_type}
                                onChange={(e) => handleChange(e, 'Category_type')}
                            ></TextInputForm>
                        ) : (
                            <TextInputForm
                                placeholder={' வகை'}
                                labelname={'வகை'}
                                name='Category_type'
                                value={type === "view" ? rowData.Category_type : formData.Category_type}
                                onChange={(e) => handleChange(e, 'Category_type')}
                            ></TextInputForm>
                        )}
                    </Col>
                    <Col lg='12' md='12' xs='12' className='py-5 align-self-center'>
                        <div className='text-center'>
                            {type === "view" ? (
                                <ClickButton label={<>back</>} onClick={() => navigate("/console/master/category")}></ClickButton>
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
                                                <ClickButton label={<>Cancel</>} onClick={() => navigate("/console/master/category")}></ClickButton>
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
                                                <ClickButton label={<>Cancel</>} onClick={() => navigate("/console/master/category")}></ClickButton>
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

export default CategoryCreation;