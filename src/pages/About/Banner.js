import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faQuran, faTrash, faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { Breadcrumb, Modal } from '@themesberg/react-bootstrap';
import { Col, Row, Form, Card, Button, Table, Container, InputGroup } from '@themesberg/react-bootstrap';

export default () => {
  const [imageUrl, setImageUrl] = useState('');
  const [heading, setHeading] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState('');
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [clickedImage, setClickedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const itemsPerPage = 3;

  const handleSubmit = async (event) => {
    event.preventDefault();
    const pageData = new FormData();
    pageData.append('heading', heading);
    pageData.append('file', imageUrl);
    pageData.append('description', description);

    try {
      const response = await axios.post('http://localhost:8000/api/uploadBanner', pageData, {});
      console.log(response);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const handleImageUpload = (event) => {
    const imageUrl = event.target.files[0];
    setImageUrl(imageUrl);
  }

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:8000/api/deleteimage/${id}`);
      console.log(response);
      setData(data.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error:', error);
    }
  }

  useEffect(() => {
    axios.get('http://localhost:8000/api/banner')
      .then(response => {
        console.log(response.data.banner);
        setData(response.data.banner);
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
      <div className="d-xl-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-2">
        <div className="d-block mb-4 mb-xl-0">
          <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
            <Breadcrumb.Item><FontAwesomeIcon icon={faHome} /></Breadcrumb.Item>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item active>Carousel</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
      <section className="d-flex align-items-center my-2 mt-lg-3 mb-lg-5">
        <Container>
          <Row>
            <Col xs={12} lg={6} className="mb-4 mb-lg-0">
              <div className="bg-white shadow-soft border rounded border-light p-4 p-lg-5 w-100 fmxw-500">
                <div className="text-center text-md-center mb-4 mt-md-0">
                  <h3 className="mb-0">Banner</h3>
                </div>
                <Form className="mt-4" onSubmit={handleSubmit}>
                  <Form.Group id="image" className="mb-4">
                    <Form.Label>Image</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                      </InputGroup.Text>
                      <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        placeholder="Upload Image"
                      />
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
                      <h5>Banner</h5>
                    </Col>
                  </Row>
                </Card.Header>
                <Table responsive className="align-items-center table-flush">
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Images</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(Array.isArray(data) && data.length > 0) ? data.slice(startIndex, endIndex).map((row, index) => (
                      <tr key={index}>
                        <td>{startIndex + index + 1}</td>
                        <td>
                          {row.imageUrl && (
                            <img
                              src={row.imageUrl}
                              alt="Carousel Image"
                              style={{ maxWidth: "100px", cursor: "pointer" }}
                              onClick={() => handleImageClick(row.imageUrl)}
                            />
                          )}
                        </td>
                        <td>
                          <Button variant="danger" size="sm" onClick={() => handleDelete(row.id)}>
                            <FontAwesomeIcon icon={faTrash} />
                          </Button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="5">No data available</td>
                      </tr>
                    )}
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
                    disabled={(currentPage + 1) * itemsPerPage >= (Array.isArray(data) ? data.length : 0)}
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
      </section>
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
