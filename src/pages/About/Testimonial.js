import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faQuran, faTrash, faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { Breadcrumb, Modal } from '@themesberg/react-bootstrap';
import { Col, Row, Form, Card, Button, Table, Container, InputGroup } from '@themesberg/react-bootstrap';

export default () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState('');
  const [image, setImage] = useState(null);
  const [isActive, setIsActive] = useState('false');
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [clickedImage, setClickedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const itemsPerPage = 3;

  const handleSubmit = async (event) => {
    event.preventDefault();
    const pageData = new FormData();
    pageData.append('name', name);
    pageData.append('message', message);
    pageData.append('rating', rating);
    pageData.append('file', image);
    pageData.append('isActive', isActive);

    try {
      const response = await axios.post('http://localhost:8000/api/uploadtestimonal', pageData, {});
      console.log(response);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const handleImageUpload = (event) => {
    const image = event.target.files[0];
    setImage(image);
  }

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:8000/api/deleteimage/${id}`);
      console.log(response);
      setData(data.filter(item => item._id !== id));
    } catch (error) {
      console.error('Error:', error);
    }
  }

  useEffect(() => {
    axios.get('http://localhost:8000/api/get/testimonal')
      .then(response => {
        console.log(response.data);
        setData(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  }

  const startIndex = currentPage * itemsPerPage;
  const endIndex = (currentPage + 1) * itemsPerPage;

  const handleImageClick = (image) => {
    setClickedImage(image);
    setShowModal(true);
  }

  const handleCloseModal = () => {
    setShowModal(false);
    setClickedImage(null);
  }

  return (
    <>
      <div className="d-xl-flex justify-content-between flex-wrap flex-md-nowrap align-items-center ">
        <div className="d-block mb-4 mb-xl-0">
          <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
            <Breadcrumb.Item><FontAwesomeIcon icon={faHome} /></Breadcrumb.Item>
            <Breadcrumb.Item>About</Breadcrumb.Item>
            <Breadcrumb.Item active>Testimonials</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
      <Container>
        <Row>
          <Col xs={12} className="mb-4">
            <div className="bg-white shadow-soft border rounded border-light p-4 p-lg-5 w-100 fmxw-500">
              <div className="text-center text-md-center mb-4 mt-md-0">
                <h3 className="mb-0">Testimonials</h3>
              </div>
              <Form className="mt-4" onSubmit={handleSubmit}>
                <Row>
                  <Col  className="mb-4">
                    <Form.Group id="serviceName">
                      <Form.Label>Name</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                         
                        </InputGroup.Text>
                        <Form.Control autoFocus required type="text" placeholder="Attribute" value={name} onChange={(e) => setName(e.target.value)} />
                      </InputGroup>
                    </Form.Group>
                  </Col>
                  <Col xs={12} className="mb-4">
                    <Form.Group id="serviceDescription">
                      <Form.Label>Message</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                         
                        </InputGroup.Text>
                        <Form.Control autoFocus required type="text" placeholder="Heading" value={message} onChange={(e) => setMessage(e.target.value)} />
                      </InputGroup>
                    </Form.Group>
                  </Col>
                  <Col xs={12} className="mb-4">
                    <Form.Group id="serviceImage">
                      <Form.Label>Image</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                         
                        </InputGroup.Text>
                        <Form.Control
                          type="file"
                          accept="images/*"
                          onChange={handleImageUpload}
                          placeholder="Upload Image"
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>
                  <Col xs={12}  className="mb-4">
                    <Form.Group id="rating">
                      <Form.Label>Rating</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                         
                        </InputGroup.Text>
                        <Form.Select required value={rating} onChange={(e) => setRating(e.target.value)}>
                          <option value="">Select Option</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                        </Form.Select>
                      </InputGroup>
                    </Form.Group>
                  </Col>
                  <Col xs={12}  className="mb-4">
                    <Form.Group id="isActive">
                      <Form.Label>Is Active</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                         
                        </InputGroup.Text>
                        <Form.Select required value={isActive} onChange={(e) => setIsActive(e.target.value)}>
                          <option value="">Select Option</option>
                          <option value="true">True</option>
                          <option value="false">False</option>
                        </Form.Select>
                      </InputGroup>
                    </Form.Group>
                  </Col>
                </Row>
                <Button variant="primary" type="submit" className="w-100 mt-3">
                  Submit
                </Button>
              </Form>
            </div>
          </Col>
        </Row>

        <Row>
          <Col xs={12}>
            <Card border="light" className="shadow-sm mt-4">
              <Card.Header>
                <Row className="align-items-center">
                  <Col>
                    <h5>Testimonials</h5>
                  </Col>
                </Row>
              </Card.Header>
              <Table responsive className="align-items-center table-flush">
                <thead className="thead-light">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    <th scope="col">Message</th>
                    <th scope="col">Rating</th>
                    <th scope="col">Image</th>
                    <th scope="col">Active</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.slice(startIndex, endIndex).map((row, index) => (
                    <tr key={index}>
                      <td>{startIndex + index + 1}</td>
                      <td>{row.name}</td>
                      <td>{row.message}</td>
                      <td>{row.rating}</td>
                      <td>
                        {row.image && (
                          <img
                            src={row.image}
                            alt="Carousel Image"
                            style={{ maxWidth: "100px", cursor: "pointer" }}
                            onClick={() => handleImageClick(row.image)}
                          />
                        )}
                      </td>
                      <td>{row.isActive ? "True" : "False"}</td>
                      <td>
                        <Button variant="danger" size="sm" onClick={() => handleDelete(row._id)}>
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <div className="d-flex justify-content-center mt-3">
                <Button
                  variant="light"
                  disabled={currentPage === 0}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="me-2"
                >
                  <FontAwesomeIcon icon={faAngleLeft} />
                </Button>
                <Button
                  variant="light"
                  disabled={(currentPage + 1) * itemsPerPage >= data.length}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="ms-2"
                >
                  <FontAwesomeIcon icon={faAngleRight} />
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Zoomed Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {clickedImage && <img src={clickedImage} alt="Zoomed Image" style={{ maxWidth: "100%" }} />}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
