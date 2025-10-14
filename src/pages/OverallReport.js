import React from 'react'
import { Container,Col, Row, Table } from 'react-bootstrap'

const OverallReport = () => {
  return (
    < >
    <Container>
        <Row>
            <Col lg="12">
                <div className='wire-table'>
                    <Table>
                        <thead>
                            <td> Date</td>
                            <td> Receipt No.</td>
                            <td>Type</td>
                            <td> Customer Details</td>
                        </thead>
                    </Table>
                </div>
                
            </Col>
        </Row>
    </Container>
    </>
  )
}

export default OverallReport