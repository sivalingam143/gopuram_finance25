import React, { useState } from "react";
import { Container, Col, Row, Nav, Tab } from "react-bootstrap";
import CategoryTwo from "../categorytwo/CategoryTwo";
import ExpenseTwo from "../expensetwo/ExpenseTwo";
import ExpenseReport from "../expensetwo/ExpenseReport";

const ExpensePage = () => {
  const [activeTab, setActiveTab] = useState("category");

  return (
    <div>
      <Container fluid>
        <Row>
          <Col lg="12">
            <div className="page-nav py-3">
              <span className="nav-list">Expense Management</span>
            </div>
          </Col>
          <Col lg="12">
            <Tab.Container
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k)}
            >
              <Row>
                <Col lg="12">
                  <Nav variant="tabs" className="flex-row">
                    <Nav.Item>
                      <Nav.Link eventKey="category">Category</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="expense">Expense</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="report">Expense Report</Nav.Link>
                    </Nav.Item>
                  </Nav>
                </Col>
                <Col lg="12">
                  <Tab.Content>
                    <Tab.Pane eventKey="category">
                      <CategoryTwo />
                    </Tab.Pane>
                    <Tab.Pane eventKey="expense">
                      <ExpenseTwo />
                    </Tab.Pane>
                    <Tab.Pane eventKey="report">
                      <ExpenseReport />
                    </Tab.Pane>
                  </Tab.Content>
                </Col>
              </Row>
            </Tab.Container>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ExpensePage;
