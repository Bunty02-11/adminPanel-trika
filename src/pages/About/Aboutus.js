import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faQuran, faTrash, faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { Breadcrumb, Modal } from '@themesberg/react-bootstrap';
import { Col, Row, Form, Card, Button, Table, Container, InputGroup } from '@themesberg/react-bootstrap';
import { ToastContainer, toast } from 'react-toastify/dist/react-toastify.cjs.development';
import 'react-toastify/dist/ReactToastify.css';

export default () => {
  const [mediaFile, setMediaFile] = useState(null);
  const [heading, setHeading] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [clickedMedia, setClickedMedia] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const itemsPerPage = 3;

  const handleSubmit = async (event) => {
    event.preventDefault();
    const pageData = new FormData();
    pageData.append('heading', heading);
    pageData.append('file', mediaFile);
    pageData.append('description', description);
  
    try {
      const response = await axios.post('http://65.1.14.171:8000/api/createabout', pageData, {});
      console.log(response);
      toast.success('Data added successfully'); // Call toast.success after successful addition
  
      // Reload page after successful submission
      window.location.reload();
  
      // Clear form data after submission
      setHeading('');
      setMediaFile(null);
      setDescription('');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to add data'); // Display error toast if addition fails
    }
  }  

  const handleMediaUpload = (event) => {
    const file = event.target.files[0];
    setMediaFile(file);
  }

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://65.1.14.171:8000/api/deleteMedia/${id}`);
      console.log(response);
      setData(data.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error:', error);
    }
  }

  useEffect(() => {
    axios.get('http://65.1.14.171:8000/api/get/about')
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

  const handleMediaClick = (media) => {
    setClickedMedia(media);
    setShowModal(true);
  }

  const handleCloseModal = () => {
    setShowModal(false);
    setClickedMedia(null);
  }

  return (
    <>
    <ToastContainer/>
      <div className="d-xl-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-2">
        <div className="d-block mb-4 mb-xl-0">
          <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
            <Breadcrumb.Item><FontAwesomeIcon icon={faHome} /></Breadcrumb.Item>
            <Breadcrumb.Item>About</Breadcrumb.Item>
            <Breadcrumb.Item active>About</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
      <section className="d-flex align-items-center my-2 mt-lg-3 mb-lg-5">
        <Container>
          <Row>
            <Col xs={12} lg={6} className="mb-4 mb-lg-0">
              <div className="bg-white shadow-soft border rounded border-light p-4 p-lg-5 w-100 fmxw-500">
                <div className="text-center text-md-center mb-4 mt-md-0">
                  <h3 className="mb-0">About</h3>
                </div>
                <Form className="mt-4" onSubmit={handleSubmit}>
                  <Form.Group id="heading" className="mb-4">
                    <Form.Label>Heading</Form.Label>
                    <InputGroup>
                      <InputGroup.Text></InputGroup.Text>
                      <Form.Control autoFocus required type="text" placeholder="Heading" value={heading} onChange={(e) => setHeading(e.target.value)} />
                    </InputGroup>
                  </Form.Group>
                  <Form.Group id="description" className="mb-4">
                    <Form.Label>Description</Form.Label>
                    <InputGroup>
                      <InputGroup.Text></InputGroup.Text>
                      <Form.Control as="textarea" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                    </InputGroup>
                  </Form.Group>
                  <Form.Group id="media" className="mb-4">
                    <Form.Label>Media (Image/Video)</Form.Label>
                    <InputGroup>
                      <InputGroup.Text></InputGroup.Text>
                      <Form.Control type="file" accept="image/*, video/*" onChange={handleMediaUpload} />
                    </InputGroup>
                  </Form.Group>
                  <Form.Group id="isActive" className="mb-4">
                    <Form.Label>Is Active</Form.Label>
                    <InputGroup>
                      <InputGroup.Text></InputGroup.Text>
                      <Form.Select required value={isActive} onChange={(e) => setIsActive(e.target.value)}>
                        <option value="">Select Option</option>
                        <option value={true}>True</option>
                        <option value={false}>False</option>
                      </Form.Select>
                    </InputGroup>
                  </Form.Group>
                  <Button variant="primary" type="submit" className="w-100">Submit</Button>
                </Form>
              </div>
            </Col>
            <Col xs={12} lg={6}>
              <Card border="light" className="shadow-sm">
                <Card.Header>
                  <h5>About us</h5>
                </Card.Header>
                <Table responsive className="align-items-center table-flush">
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Heading</th>
                      <th scope="col">Description</th>
                      <th scope="col">Media</th>
                      <th scope="col">Active</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.slice(startIndex, endIndex).map((row, index) => (
                      <tr key={index}>
                        <td>{startIndex + index + 1}</td>
                        <td>{row.heading}</td>
                        <td>{row.description}</td>
                        <td>
                          {row.image && (
                            <div>
                              {row.image.startsWith('http') ? (
                                <img src={row.image} alt="Media" style={{ maxWidth: "100px", cursor: "pointer" }} onClick={() => handleMediaClick(row.image)} />
                              ) : (
                                <video controls style={{ maxWidth: "100%" }} onClick={() => handleMediaClick(row.image)}>
                                  <source src={row.image} type="video/mp4" />
                                </video>
                              )}
                            </div>
                          )}
                        </td>
                        <td>{row.isActive ? "True" : "False"}</td>
                        <td>
                        <Button variant="danger" size="sm" onClick={() => handleDelete(row.id)}>
                            <FontAwesomeIcon icon={faTrash} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <div className="d-flex justify-content-center mt-3">
                  <Button variant="light" disabled={currentPage === 0} onClick={() => handlePageChange(currentPage - 1)} className="me-2"><FontAwesomeIcon icon={faAngleLeft} /></Button>
                  <Button variant="light" disabled={(currentPage + 1) * itemsPerPage >= data.length} onClick={() => handlePageChange(currentPage + 1)} className="ms-2"><FontAwesomeIcon icon={faAngleRight} /></Button>
                </div>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Media Zoom</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {clickedMedia && (clickedMedia.startsWith('http') ? (
            <img src={clickedMedia} alt="Zoomed Media" style={{ maxWidth: "100%" }} />
          ) : (
            <video controls style={{ maxWidth: "100%" }}>
              <source src={clickedMedia} type="video/mp4" />
            </video>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
