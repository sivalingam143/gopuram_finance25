import React, { useState, useEffect } from 'react'
import { Container, Col, Row, Form } from 'react-bootstrap'
import { FaMagnifyingGlass } from "react-icons/fa6";
import TableUI from '../../components/Table';
import { TextInputForm } from '../../components/Forms';
import Pagnation from '../../components/Pagnation';
import UnitModal from './UnitModal';
import MobileView from '../../components/MobileView'
import { ClickButton } from '../../components/ClickButton';
import { useNavigate } from 'react-router-dom';
import API_DOMAIN from '../../config/config';
const UserTablehead = ["No", "யூனிட் வகை", "செயல்",]

const user = [
  {
    "id": "1",
    "Unit_Name": "யூனிட்"
  }
]
const Unit = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_DOMAIN}/unit.php`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            search_text: searchText
          })
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const responseData = await response.json();
        setLoading(false);
        if (responseData.head.code === 200) {
          setUserData(responseData.body.unit);
        } else {
          throw new Error(responseData.head.msg);
        }
      } catch (error) {
        setLoading(false);
        console.error('Error fetching data:', error.message);
      }
    };

    fetchData(); // Call fetchData directly in useEffect

  }, [searchText]);
  const handleSearch = (value) => {
    setSearchText(value);
  };
  return (
    <div>
      <Container fluid>
        <Row>
          <Col lg='7' md='4' xs='6'>
            <div className='page-nav py-3'>
              <span class="nav-list"> யூனிட்</span>
            </div>
          </Col>
          <Col lg='5' md='6' xs='6' className='align-self-center text-end'>
            <ClickButton label={<>AddNew</>} onClick={() => navigate("/console/master/unit/create")}></ClickButton>
          </Col>
          <Col lg='3' md='5' xs='12' className='py-1'>
            <Form className='form page-nav'>
              <TextInputForm placeholder={"Search Unit"} prefix_icon={<FaMagnifyingGlass />}
                onChange={(e) => handleSearch(e.target.value)} labelname={"Search"}> </TextInputForm>
            </Form>
          </Col>
          <Col lg={9} md={12} xs={12} className='py-2'>
            <Pagnation></Pagnation>
          </Col>
          <Col lg='12' md='12' xs='12' className='px-0'>
            <div className='py-1'>
              {userData && userData.map((user, index) => (
                <MobileView key={index} sno={user.id} name={user.name} subname={user.role} />
              ))}
              <TableUI headers={UserTablehead} body={userData} type="jewelUnit" style={{ 'borderRadius': '5px' }} />
            </div>
          </Col>

          <Col lg={12} md={12} xs={12}>
            <Pagnation></Pagnation>
          </Col>
        </Row>
      </Container>
    </div>

  )
}

export default Unit