
import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCashRegister, faChartLine, faCloudUploadAlt, faPlus, faRocket, faTasks, faUserShield } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Button, Dropdown, ButtonGroup } from '@themesberg/react-bootstrap';

import { CounterWidget, CircleChartWidget, BarChartWidget, TeamMembersWidget, ProgressTrackWidget, RankingWidget, SalesValueWidget, SalesValueWidgetPhone, AcquisitionWidget } from "../../components/Widgets";
import { PageVisitsTable } from "../../components/Tables";
import { trafficShares, totalOrders } from "../../data/charts";

export default () => {

  const [customers, setCustomers] = React.useState([]);

  React.useEffect(() => {
    fetch('https://r8bkfpncj3.execute-api.ap-south-1.amazonaws.com/production/api/get/work')
      .then(response => response.json())
      .then(data => setCustomers(data))
      .catch(error => console.error(error));
  }, []);

  // ...
  const [contacts, setContacts] = React.useState([]);

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: ` ${token}` } : {};

    fetch('https://r8bkfpncj3.execute-api.ap-south-1.amazonaws.com/production/api/getcontact', { headers })
      .then(response => response.json())
      .then(data => setContacts(data))
      .catch(error => console.error(error));
  }, []);



  return (
    <>

      <Row className="justify-content-md-center">
        <Col xs={12} className="mb-4 d-none d-sm-block">
          <SalesValueWidget
            title="Sales Value"
            value="10,567"
            percentage={10.57}
          />
        </Col>
        <Col xs={12} className="mb-4 d-sm-none">
          <SalesValueWidgetPhone
            title="Sales Value"
            value="10,567"
            percentage={10.57}
          />
        </Col>
        <Col xs={12} sm={6} xl={4} className="mb-4">
          <CounterWidget
            category=" Total Services "
            title={customers.length.toString()}
            icon={faChartLine}
            iconColor="shape-secondary"
          />
        </Col>
        <Col xs={12} sm={6} xl={4} className="mb-4">
          <CounterWidget
            category="Total  Customers"
            title={contacts.length.toString()}
            icon={faCashRegister}
            iconColor="shape-tertiary"
          />
        </Col>

        <Col xs={12} sm={6} xl={4} className="mb-4">
          <CircleChartWidget
            title="Traffic Share"
            data={trafficShares} />
        </Col>
      </Row>

      {/* <Row>
        <Col xs={12} xl={12} className="mb-4">
          <Row>
            <Col xs={12} xl={8} className="mb-4">
              <Row>
                <Col xs={12} className="mb-4">
                  <PageVisitsTable />
                </Col>
              </Row>
            </Col>

            <Col xs={12} xl={4}>
              <Row>
                <Col xs={12} className="mb-4">
                  <BarChartWidget
                    title="Total orders"
                    value={452}
                    percentage={18.2}
                    data={totalOrders} />
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row> */}
    </>
  );
};
