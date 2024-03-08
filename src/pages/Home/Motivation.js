
import React, { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faQuran } from "@fortawesome/free-solid-svg-icons";
import { Breadcrumb } from '@themesberg/react-bootstrap';
import { faAngleLeft, faEnvelope, faUnlockAlt } from "@fortawesome/free-solid-svg-icons";
import { faFacebookF, faGithub, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { Col, Row, Form, Card, Button, FormCheck, Table, Container, InputGroup } from '@themesberg/react-bootstrap';
import { Link } from 'react-router-dom';

import { Routes } from "../../routes";
import BgImage from "../../assets/img/illustrations/signin.svg";

import { PageTrafficTable, RankingTable } from "../../components/Tables";


export default () => {

  const [attribbute, setAttribbute] = useState('');
  const [image, setImage] = useState(null);
  const [heading, setHeading] = useState('');
  const [content, setContent] = useState('');
  const [bullet, setBullet] = useState('');
  const [isActive, setIsActive] = useState('false');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const pageData = new FormData();
    pageData.append('attribbute', attribbute);
    pageData.append('file', image);
    pageData.append('heading', heading);
    pageData.append('content', content);
    pageData.append('bullet', bullet)
    pageData.append('isActive', isActive);

  try {
    const response = await axios.post('http://localhost:8000/api/create/motivation', pageData, {});
    console.log(response); // Logging the response for debugging purposes
  } catch (error) {
    console.error('Error:', error); // Log any errors
  }
}

const handleImageUpload = (event) => {
  const image = event.target.files[0];
  setImage(image);
}

  

  return (
    <>
      <div className="d-xl-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-2"> {/* Reduced top margin here */}
        <div className="d-block mb-4 mb-xl-0">
          <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
            <Breadcrumb.Item><FontAwesomeIcon icon={faHome} /></Breadcrumb.Item>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item active>Motivation</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
      <section className="d-flex align-items-center my-2 mt-lg-3 mb-lg-5"> {/* Reduced top margin here */}
        <Container>
          <Row>
            <Col xs={12} lg={6} className="mb-4 mb-lg-0">
              <div className="bg-white shadow-soft border rounded border-light p-4 p-lg-5 w-100 fmxw-500">
                <div className="text-center text-md-center mb-4 mt-md-0">
                  <h3 className="mb-0">Motivation</h3>
                </div>
                <Form className="mt-4"onSubmit={handleSubmit}>
                  <Form.Group id="name" className="mb-4">
                    <Form.Label>Attribbute</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faQuran} />
                      </InputGroup.Text>
                      <Form.Control autoFocus required type="Name" placeholder="Your attribbute" value={attribbute} onChange={(e) => setAttribbute(e.target.value)}/>
                    </InputGroup>
                  </Form.Group>
                  <Form.Group id="image" className="mb-4">
                    <Form.Label>Image</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faQuran} />
                      </InputGroup.Text>
                      <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        placeholder="Upload Image"
                      />
                    </InputGroup>
                  </Form.Group>
                  <Form.Group id="name" className="mb-4">
                    <Form.Label>Heading</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faQuran} />
                      </InputGroup.Text>
                      <Form.Control autoFocus required type="Name" placeholder="Your Name" value={heading} onChange={(e) => setHeading(e.target.value)} />
                    </InputGroup>
                  </Form.Group>
                  <Form.Group id="name" className="mb-4">
                    <Form.Label>Content</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faQuran} />
                      </InputGroup.Text>
                      <Form.Control autoFocus required type="Name" placeholder="Your Content" value={content} onChange={(e) => setContent(e.target.value)}/>
                    </InputGroup>
                  </Form.Group>
                  <Form.Group id="name" className="mb-4">
                    <Form.Label>Bullet</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faQuran} />
                      </InputGroup.Text>
                      <Form.Control autoFocus required type="Name" placeholder="Your Bullet" value={bullet} onChange={(e) => setBullet(e.target.value)} />
                    </InputGroup>
                  </Form.Group>
                  <Form.Group id="confirmPassword" className="mb-4">
                    <Form.Label>isActive</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faQuran} />
                      </InputGroup.Text>
                      <Form.Select  required value={isActive} onChange={(e) => setIsActive(e.target.value)}>
                        <option value="">Select Option</option>
                        <option value="true">True</option>
                        <option value="false">False</option>
                      </Form.Select>
                    </InputGroup>
                  </Form.Group>
                  <Button variant="primary" type="submit" className="w-100">
                    Submit
                  </Button>
                </Form>
              </div>
            </Col>
            <Col xs={12} lg={6}>
              <Card border="light" className="shadow-sm">
                <Card.Header>
                  <Row className="align-items-center">
                    <Col>
                      <h5>Page visits</h5>
                    </Col>
                    <Col className="text-end">
                      <Button variant="secondary" size="sm">See all</Button>
                    </Col>
                  </Row>
                </Card.Header>
                <Table responsive className="align-items-center table-flush">
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Page name</th>
                      <th scope="col">Page Views</th>
                      <th scope="col">Page Value</th>
                      <th scope="col">Bounce rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* {pageVisits.map(pv => <TableRow key={`page-visit-${pv.id}`} {...pv} />)} */}
                  </tbody>
                </Table>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </>


  );
};
