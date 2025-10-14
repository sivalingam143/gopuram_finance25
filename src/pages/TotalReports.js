import React, { useState } from 'react';
import { Col, Container, Row, Alert, Modal } from 'react-bootstrap';
import { TextInputForm, DropDownUI, Calender } from '../components/Forms';
import { ClickButton } from '../../src/components/ClickButton';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { differenceInCalendarMonths } from 'date-fns';
import TableUI from '../components/Table';
import Table from 'react-bootstrap/Table';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const UserTablehead = ["No", "நிறுவனத்தின் பெயர்", " கைபேசி எண்", " இடம்", "செயல்",]
const userData = [
  {
    "id": "1",
    "company_name": 'கண்ணன் பைனான்ஸ்',
    "phoneno": '9876355678',
    "designation": "விருதுநகர்"
  }
]
const DropList = [
  {
    value: 'நகை அடகு அறிக்கைகள்',
    label: 'நகை அடகு அறிக்கைகள்'
  },
  {
    value: 'நகை மீட்பு அறிக்கைகள்',
    label: 'நகை மீட்பு அறிக்கைகள்'
  },
  {
    value: 'மதிப்பீடு அறிக்கைகள்',
    label: 'மதிப்பீடு அறிக்கைகள்'
  }
];
const TotalReports = () => {
  const [formData, setFormData] = useState({

    ReceiptNo: '',
    TotalReports: '',
    FromDate: '',
    ToDate: '',
    CustomerName: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const location = useLocation();
  const [showTable, setShowTable] = useState(false);
  const { type, rowData } = location.state || {};
  const navigate = useNavigate();

  const handleSaveUserSuccess = () => {
    setShowSuccessModal(true);
  };

  const redirectModal = () => {
    navigate('/console/user');
  };

  const handleChange = (e, fieldName) => {
    const value = e.target ? e.target.value : e.value;

    setFormData({
      ...formData,
      [fieldName]: value
    });
  };
  const setLabel = (date, label) => {
    const dateString = date instanceof Date ? date.toISOString() : date; // Convert date object to string
    handleChange(dateString, label); // Pass the string value to handleChange

    // Removed the specific handling of 'fromDate' and 'toDate' differences
    // since it's now handled by handleChange

    // Handle date separately
    if (label === 'FromDate' || label === 'ToDate') {
      setFormData(prevData => ({
        ...prevData,
        [label]: dateString, // Set the 'FromDate' or 'ToDate' field in formData
      }));
    }
  };

  const [formDataList, setFormDataList] = useState([]);
  const handleAddMore = () => {
    if (formData.ReceiptNo.trim() === '' || formData.TotalReports.trim() === '' || formData.CustomerName.trim() === ''
      || formData.FromDate.trim() === '' || formData.ToDate.trim() === '') {
      // Display an error message or toast indicating that these fields are required
      toast.error('Please fill are required!', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return; // Exit the function if any required field is empty
    }

    setFormDataList(prevList => [...prevList, formData]); // Add current form data to the list
    setFormData({ // Reset form data
      ReceiptNo: '',
      TotalReports: '',
      FromDate: '',
      ToDate: '',
      CustomerName: '',
    });
  };
  return (
    <div>
      <Container className='mb-3'>
        <Row className='regular'>
          <Col lg='12' md='12' xs='6'>
            <div className='page-nav py-3'>
              <span class="nav-list">Total Reports </span>
            </div>
          </Col>
          <Col lg='4' md='6' xs='12' className='py-3'>
            <DropDownUI
              optionlist={DropList}
              placeholder='மொத்த அறிக்கைகள்'
              labelname='மொத்த அறிக்கைகள்'
              name='TotalReports'
              value={formData.TotalReports}
              onChange={(updatedFormData) => setFormData({ ...formData, TotalReports: updatedFormData.TotalReports })}
            />
          </Col>


          <Col lg='4' md='6' xs='12' className='py-3'>
            <TextInputForm
              placeholder={'பயனர் பெயர்'}
              labelname={'பயனர் பெயர்'}
              name='CustomerName'
              value={formData.CustomerName}
              onChange={(e) => handleChange(e, 'CustomerName')}
            ></TextInputForm>
          </Col>
          <Col lg='3' md='6' xs='12' className='py-3'>
            <TextInputForm
              placeholder={'ரசீது எண்'}
              labelname={'ரசீது எண்'}
              name='ReceiptNo'
              value={formData.ReceiptNo}
              onChange={(e) => handleChange(e, 'ReceiptNo')}
            ></TextInputForm>
          </Col>
          <Col lg='4' md='6' xs="12" className='py-3'>
            <Calender setLabel={(date) => setLabel(date, 'FromDate')} calenderlabel="தேதி" disabled={type === 'view' || type === 'edit'} />
          </Col>
          <Col lg='4' md='6' xs="12" className='py-3'>
            <Calender setLabel={(date) => setLabel(date, 'ToDate')} calenderlabel="நகை மீட்பு தேதி" disabled={type === 'view' || type === 'edit'} />
          </Col>
          <Col lg='6' md='6' xs='6' className=' text-end'>
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
            <ClickButton label={<>Add More</>} onClick={handleAddMore}></ClickButton>
          </Col>
          {/* <Col lg='12'>
            <div className='pt-5  mb-3 text-center'>
              <ClickButton label={<> Submit</>} onClick={handleSubmit} disabled={loading}></ClickButton>
            </div>
          </Col> */}
        </Row>
        {formDataList.length > 0 && (
          <Row className='regular mt-5'>
            <Col>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Receipt No</th>
                    <th>TotalReports</th>
                    <th>CustomerName</th>
                    <th>FromDate</th>
                    <th>ToDate</th>
                    {/* Add more table headers as needed */}
                  </tr>
                </thead>
                <tbody>
                  {formDataList.map((data, index) => (
                    <tr key={index}>
                      <td>{data.ReceiptNo}</td>
                      <td>{data.TotalReports}</td>
                      <td>{data.CustomerName}</td>
                      <td>{data.FromDate}</td>
                      <td>{data.ToDate}</td>
                      {/* Add more table cells as needed */}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          </Row>
        )}
        {error && <Alert variant='danger' className='error-alert'>{error}</Alert>}
      </Container>

    </div>
  );
};

export default TotalReports;