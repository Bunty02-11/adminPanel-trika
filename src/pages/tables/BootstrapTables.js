
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { Breadcrumb } from '@themesberg/react-bootstrap';
import { faAngleLeft, faEnvelope, faUnlockAlt } from "@fortawesome/free-solid-svg-icons";
import { faFacebookF, faGithub, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { Col, Row, Form, Card, Button, FormCheck, Container, InputGroup } from '@themesberg/react-bootstrap';
import { Link } from 'react-router-dom';

import { Routes } from "../../routes";
import BgImage from "../../assets/img/illustrations/signin.svg";

import { PageTrafficTable, RankingTable } from "../../components/Tables";


export default () => {
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [isActive, setIsActive] = useState(false);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleIsActiveChange = (e) => {
    setIsActive(e.target.value === 'true');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here, including sending the data to the server
    console.log('Name:', name);
    console.log('Image:', image);
    console.log('isActive:', isActive);
    // Reset form fields after submission
    setName('');
    setImage(null);
    setIsActive(false);
  };

  return (
    <>
      <div className="d-xl-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <div className="d-block mb-4 mb-xl-0">
          <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
            <Breadcrumb.Item><FontAwesomeIcon icon={faHome} /></Breadcrumb.Item>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item active>Carousel</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
      <div className="d-flex align-items-center my-5 mt-lg-6 mb-lg-5">
        {/* <Container> */}

        {/* <Row className="justify-content-center form-bg-image" style={{ backgroundImage: `url(${BgImage})` }}> */}
        <Col xs={12} className="d-flex align-items-center justify-content-center">
          <div className="mb-4 mb-lg-0 bg-white shadow-soft border rounded border-light p-4 p-lg-5 w-100 fmxw-500">
            <div className="text-center text-md-center mb-4 mt-md-0">
              <h3 className="mb-0">Carousel</h3>
            </div>
            <div className="d-flex align-items-center justify-content-center">
              <form onSubmit={handleSubmit}>
                <label htmlFor="name">Name:</label><br />
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={handleNameChange}
                  required
                /><br /><br />

                <label htmlFor="image">Image:</label><br />
                <input
                  type="file"
                  id="image"
                  onChange={handleImageChange}
                  accept="image/*"
                  required
                /><br /><br />

                <label htmlFor="isActive">Is Active:</label><br />
                <select id="isActive" value={isActive} onChange={handleIsActiveChange}>
                  <option value="true">True</option>
                  <option value="false">False</option>
                </select><br /><br />
                <div className="d-flex align-items-center justify-content-center">
                <button type="submit ">Submit</button>
                </div>
              </form>
            </div>

           
            {/* <div className="d-flex justify-content-center my-4">
                  <Button variant="outline-light" className="btn-icon-only btn-pill text-facebook me-2">
                    <FontAwesomeIcon icon={faFacebookF} />
                  </Button>
                  <Button variant="outline-light" className="btn-icon-only btn-pill text-twitter me-2">
                    <FontAwesomeIcon icon={faTwitter} />
                  </Button>
                  <Button variant="outline-light" className="btn-icon-only btn-pil text-dark">
                    <FontAwesomeIcon icon={faGithub} />
                  </Button>
                </div> */}

          </div>
        </Col>
        {/* </Row> */}
        {/* </Container> */}
      </div>

    </>
  );
};
