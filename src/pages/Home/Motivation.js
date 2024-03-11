import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faQuran, faTrash, faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { Breadcrumb, Col, Row, Form, Button, InputGroup, Container, Card, Table, Modal } from '@themesberg/react-bootstrap';

export default () => {
  const [attribbute, setAttribbute] = useState('');
  const [image, setImage] = useState(null);
  const [heading, setHeading] = useState('');
  const [data, setData] = useState([]);
  const [content, setContent] = useState('');
  const [bullet, setBullet] = useState('');
  const [isActive, setIsActive] = useState('false');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(4); // Changed to 4 items per page
  const [showModal, setShowModal] = useState(false);
  const [clickedImage, setClickedImage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const pageData = new FormData();
    pageData.append('Attribbute', attribbute);
    pageData.append('file', image);
    pageData.append('Heading', heading);
    pageData.append('content', content);
    pageData.append('bullet', bullet);
    pageData.append('isActive', isActive);
    
    try {
      const response = await axios.post('http://localhost:8000/api/create/motivation', pageData, {});
      console.log(response);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  }

  const handleImageUpload = (event) => {
    const image = event.target.files[0];
    setImage(image);
  }

  useEffect(() => {
    axios.get(`http://localhost:8000/api/get/motivations?page=${currentPage}&perPage=${itemsPerPage}`)
      .then(response => {
        console.log(response.data);
        setData(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, [currentPage, itemsPerPage]);

  const handleDelete = (id) => {
    axios.delete(`http://localhost:8000/api/delete/motivation/${id}`)
      .then(response => {
        console.log('Record deleted successfully:', response.data);
        setData(prevData => prevData.filter(item => item.id !== id));
      })
      .catch(error => {
        console.error('Error deleting record:', error);
      });
  }

  const handleCloseModal = () => {
    setShowModal(false);
  }

  const handleImageClick = (imageUrl) => {
    setClickedImage(imageUrl);
    setShowModal(true);
  }

  // Calculate the index of the first item to display based on the current page and items per page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <>
      <div className="d-xl-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-2">
        <div className="d-block mb-4 mb-xl-0">
          <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
            <Breadcrumb.Item><FontAwesomeIcon icon={faHome} /></Breadcrumb.Item>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item active>Motivation</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
      <section className="d-flex align-items-center my-2 mt-lg-3 mb-lg-5">
        <Container>
          <Row>
            <Col xs={12} lg={12} className="mb-4 mb-lg-0">
              <div className="bg-white shadow-soft border rounded border-light p-4 p-lg-5 w-100">
                <div className="text-center text-md-center mb-4 mt-md-0">
                  <h3 className="mb-0">Motivation</h3>
                </div>
                <Form className="mt-4" onSubmit={handleSubmit}>
                  <Row>
                    {/* Form fields */}
                  </Row>
                  <Button variant="primary" type="submit" className="w-100 mt-3">
                    Submit
                  </Button>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <section>
        <Container>
          <Row>
            <Col xs={12} lg={12}>
              <Card border="light" className="shadow-sm">
                <Card.Header>
                  <Row className="align-items-center">
                    <Col>
                      <h5>Motivation Banner</h5>
                    </Col>
                  </Row>
                </Card.Header>
                <Table responsive className="align-items-center table-flush">
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Attribbute</th>
                      <th scope="col">Image</th>
                      <th scope="col">Heading</th>
                      <th scope="col">Content</th>
                      <th scope="col">Bullet</th>
                      <th scope="col">isActive</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((row, index) => (
                      <tr key={index}>
                        <td>{indexOfFirstItem + index + 1}</td>
                        <td>{row.Attribbute}</td>
                        <td>
                          {row.Image && (
                            <img
                              src={row.Image}
                              alt="Image"
                              style={{ maxWidth: "100px", cursor: "pointer" }}
                              onClick={() => handleImageClick(row.Image)}
                            />
                          )}
                        </td>
                        <td>{row.Heading}</td>
                        <td>{row.content}</td>
                        <td>{row.bullet}</td>
                        <td>{row.isActive ? "True" : "False"}</td>
                        <td>
                          <Button variant="danger" size="sm" onClick={() => handleDelete(row.id)}>
                            <FontAwesomeIcon icon={faTrash} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="8">
                        <div className="d-flex justify-content-center mt-3">
                          <Button
                            variant="light"
                            disabled={currentPage === 1}
                            onClick={() => handlePageChange(currentPage - 1)}
                            className="me-2"
                          >
                            <FontAwesomeIcon icon={faAngleLeft} />
                          </Button>
                          <Button
                            variant="light"
                            disabled={currentItems.length < itemsPerPage}
                            onClick={() => handlePageChange(currentPage + 1)}
                            className="ms-2"
                          >
                            <FontAwesomeIcon icon={faAngleRight} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  </tfoot>
                </Table>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{data.name}</Modal.Title>
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
