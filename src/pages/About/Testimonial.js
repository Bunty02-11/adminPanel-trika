import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faQuran, faTrash, faAngleLeft, faAngleRight, faEdit, faEye } from "@fortawesome/free-solid-svg-icons";
import { Breadcrumb, Modal } from '@themesberg/react-bootstrap';
import { Col, Row, Form, Card, Button, Table, Container, InputGroup, Nav, Tab } from '@themesberg/react-bootstrap';
import { ToastContainer, toast } from 'react-toastify/dist/react-toastify.cjs.development';
import 'react-toastify/dist/ReactToastify.css';

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
  const [editMode, setEditMode] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [clickedItem, setClickedItem] = useState(null);

  const itemsPerPage = 3;

  const [editName, setEditName] = useState('');
  const [editMessage, setEditMessage] = useState('');
  const [editRating, setEditRating] = useState('');
  const [editIsActive, setEditIsActive] = useState(false);
  const [editItemId, setEditItemId] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const pageData = new FormData();
    pageData.append('name', name);
    pageData.append('message', message);
    pageData.append('rating', rating);
    pageData.append('file', image);
    pageData.append('isActive', isActive);

    const token = localStorage.getItem('token');

    try {
      const response = await axios.post('https://r8bkfpncj3.execute-api.ap-south-1.amazonaws.com/production/api/uploadtestimonal', pageData, {
        headers: {
          Authorization: `${token}`
        }
      });
      console.log(response);
      toast.success('Image added successfully'); // Call toast.success after successful addition

      // Reload page after successful submission
      window.location.reload();

      // Clear form data after submission
      setName('');
      setMessage('');
      setRating('');
      setImage(null);
      setIsActive('false');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to add image'); // Display error toast if addition fails
    }
  }


  const handleImageUpload = (event) => {
    const image = event.target.files[0];
    setImage(image);
  }

  const handleDelete = (id) => {
    const token = localStorage.getItem('token');

    axios.delete(`https://r8bkfpncj3.execute-api.ap-south-1.amazonaws.com/production/api/delete/testimonal/${id}`, {
      headers: {
        Authorization: `${token}`
      }
    })
      .then(response => {
        console.log('Record deleted successfully:', response.data);
        setData(prevData => prevData.filter(item => item.id !== id));
        toast.success('Record deleted successfully'); // Display success toast

        // Reload the page
        window.location.reload();
      })
      .catch(error => {
        console.error('Error deleting record:', error);
        toast.error('Failed to delete record'); // Display error toast
      });
  }


  useEffect(() => {
    axios.get('https://r8bkfpncj3.execute-api.ap-south-1.amazonaws.com/production/api/get/testimonal')
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

  const handleEditModal = (item) => {
    setEditItemId(item._id);
    setEditName(item.name);
    setEditMessage(item.message);
    setEditRating(item.rating);
    setEditIsActive(item.isActive);
    setShowModal(true);
    setEditMode(true); // Set editMode to true when opening the edit modal
  }

  const handleEditSubmit = async () => {
    const token = localStorage.getItem('token');
    const editData = {
      name: editName,
      message: editMessage,
      rating: editRating,
      isActive: editIsActive
    };

    try {
      const response = await axios.put(`https://r8bkfpncj3.execute-api.ap-south-1.amazonaws.com/production/api/update/testimonal/${editItemId}`, editData, {
        headers: {
          Authorization: `${token}`
        }
      });
      console.log('Updated data:', response.data);
      toast.success('Data updated successfully');
      setShowModal(false);
      setData(prevData => prevData.map(item => item._id === editItemId ? { ...item, ...editData } : item));
    } catch (error) {
      console.error('Error updating record:', error);
      toast.error('Failed to update record');
    }
  }

  const handleViewDetails = (row) => {
    setClickedItem(row);
    setShowDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setClickedItem(null);
  };


  // Calculate the index of the first item to display based on the current page and items per page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <>
      <ToastContainer />
      <div className="d-xl-flex justify-content-between flex-wrap flex-md-nowrap align-items-center ">
        <div className="d-block mb-4 mb-xl-0">
          <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
            <Breadcrumb.Item><FontAwesomeIcon icon={faHome} /></Breadcrumb.Item>
            <Breadcrumb.Item>About</Breadcrumb.Item>
            <Breadcrumb.Item active>Testimonials</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
      <Tab.Container defaultActiveKey="home">
        <Nav fill variant="pills" className="flex-column flex-sm-row">
          <Nav.Item>
            <Nav.Link eventKey="home" className="mb-sm-3 mb-md-0">
              Form
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="profile" className="mb-sm-3 mb-md-0">
              Table
            </Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content>
          <Tab.Pane eventKey="home" className="py-4">

            <section className="d-flex align-items-center my-2 mt-lg-3 mb-lg-5">
              <Container>
                <Row>
                  <Col xs={12} lg={12} className="mb-4 mb-lg-0">
                    <div className="bg-white shadow-soft border rounded border-light p-4 p-lg-5 w-100">
                      <div className="text-center text-md-center mb-4 mt-md-0">
                        <h3 className="mb-0">Testimonials</h3>
                      </div>
                      <Form className="mt-4" onSubmit={handleSubmit}>
                        <Row>
                          <Col xs={12} md={6}>
                            <Form.Group id="serviceName" className="mb-4">
                              <Form.Label>Name</Form.Label>
                              <InputGroup>
                                <InputGroup.Text>
                                </InputGroup.Text>
                                <Form.Control autoFocus required type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                              </InputGroup>
                            </Form.Group>
                          </Col>
                          <Col xs={12} md={6}>
                            <Form.Group id="serviceDescription" className="mb-4">
                              <Form.Label>Message</Form.Label>
                              <InputGroup>
                                <InputGroup.Text>
                                </InputGroup.Text>
                                <Form.Control as="textarea" placeholder="Message" value={message} onChange={(e) => setMessage(e.target.value)} />
                              </InputGroup>
                            </Form.Group>
                          </Col>
                          <Col xs={12} md={6}>
                            <Form.Group id="serviceImage" className="mb-4">
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
                          <Col xs={12} md={6} >
                            <Form.Group id="rating" className="mb-4">
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
                          <Col xs={12} >
                            <Form.Group id="isActive" className="mb-4">
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
              </Container>
            </section>
          </Tab.Pane>
          <Tab.Pane eventKey="profile" className="py-4">

            <section>
              <Container>
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
                              {/* <td>{row.message}</td>
                              <td>{row.rating}</td> */}
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
                                <Button variant="info" size="sm" onClick={() => handleViewDetails(row)}>
                                  <FontAwesomeIcon icon={faEye} />
                                  view
                                </Button>
                                <br/>
                                <br/>
                                <Button variant="info" size="sm" onClick={() => handleEditModal(row)}>
                                  <FontAwesomeIcon icon={faEdit} />
                                  Edit
                                </Button>
                                <br/>
                                <br/>
                                <Button variant="danger" size="sm" onClick={() => handleDelete(row._id)}>
                                  <FontAwesomeIcon icon={faTrash} />
                                  Delete
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
                      <Modal show={showModal && editMode} onHide={() => setEditMode(false)}>
                        <Modal.Header>
                          <Modal.Title>Edit Blog</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <Form>
                            <Form.Group className="mb-3" controlId="editHeading">
                              <Form.Label>Name</Form.Label>
                              <Form.Control type="text" value={editName} onChange={(e) => setEditName(e.target.value)} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="editDate">
                              <Form.Label>Message</Form.Label>
                              <Form.Control type="text" value={editMessage} onChange={(e) => setEditMessage(e.target.value)} />
                            </Form.Group>
                            <Form.Group id="rating">
                              <Form.Label>Rating</Form.Label>
                              <InputGroup>
                                <InputGroup.Text>

                                </InputGroup.Text>
                                <Form.Select required value={editRating} onChange={(e) => setEditRating(e.target.value)}>
                                  <option value="">Select Option</option>
                                  <option value="1">1</option>
                                  <option value="2">2</option>
                                  <option value="3">3</option>
                                  <option value="4">4</option>
                                  <option value="5">5</option>
                                </Form.Select>
                              </InputGroup>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="editIsActive">
                              <Form.Check type="checkbox" label="Is Active" checked={editIsActive} onChange={(e) => setEditIsActive(e.target.checked)} />
                            </Form.Group>
                          </Form>
                        </Modal.Body>
                        <Modal.Footer>
                          <Button variant="secondary" onClick={() => setEditMode(false)}>
                            Cancel
                          </Button>
                          <Button variant="primary" onClick={handleEditSubmit}>
                            Save Changes
                          </Button>
                        </Modal.Footer>
                      </Modal>
                    </Card>
                  </Col>
                </Row>
              </Container>
              <Modal show={showDetailsModal} onHide={handleCloseDetailsModal}>
                <Modal.Header>
                  <Modal.Title>Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {clickedItem && (
                    <>
                      <p><strong>Name:</strong> {clickedItem.name}</p>
                      <p><strong>Message:</strong> {clickedItem.message}</p>
                      <p><strong>Rating:</strong> {clickedItem.rating}</p>
                      <p><strong>Active:</strong> {clickedItem.isActive ? "Yes" : "No"}</p>
                    </>
                  )}
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseDetailsModal}>
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>
            </section>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
      <Modal show={showModal && !editMode} onHide={handleCloseModal}>
        <Modal.Header>
          <Modal.Title>{data.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img src={clickedImage} alt="Zoomed Image" style={{ maxWidth: "100%" }} onClick={() => setEditMode(true)} />
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
