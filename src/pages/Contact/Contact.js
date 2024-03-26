import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faTrash, faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { Breadcrumb, Col, Row, Button, Container, Card, Table, Modal } from '@themesberg/react-bootstrap';

export default () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4); // Changed to 4 items per page
  const [showModal, setShowModal] = useState(false);
  const [clickedImage, setClickedImage] = useState(null);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  }

  useEffect(() => {
    axios.get(`http://65.1.14.171:8000/api/getcontact`)
      .then(response => {
        console.log(response.data);
        setData(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, [currentPage]);

  const handleDelete = (id) => {
    axios.delete(`http://65.1.14.171:8000/api/delete/motivation/${id}`)
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
            <Breadcrumb.Item>Contact</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
      <section>
        <Container>
          <Row>
            <Col xs={12} lg={12}>
              <Card border="light" className="shadow-sm">
                <Card.Header>
                  <Row className="align-items-center">
                    <Col>
                      <h5>Details</h5>
                    </Col>
                  </Row>
                </Card.Header>
                <Table responsive className="align-items-center table-flush">
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Name</th>
                      <th scope="col">Email</th>
                      <th scope="col">Number</th>
                      <th scope="col">Subject</th>
                      <th scope="col">Messages</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((row, index) => (
                      <tr key={index}>
                        <td>{indexOfFirstItem + index + 1}</td>
                        <td>{row.name}</td>
                        <td>{row.email}</td>
                        <td>{row.phone}</td>
                        <td>{row.subject}</td>
                        <td>{row.message}</td>
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
