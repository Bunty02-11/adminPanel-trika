import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faQuran, faTrash, faAngleLeft, faAngleRight, faEdit, faStreetView, faEye } from "@fortawesome/free-solid-svg-icons";
import { Breadcrumb, Col, Row, Form, Button, InputGroup, Container, Card, Table, Modal, Nav, Tab } from '@themesberg/react-bootstrap';
import { ToastContainer, toast } from 'react-toastify/dist/react-toastify.cjs.development';
import 'react-toastify/dist/ReactToastify.css';


export default () => {
  const [attribbute, setAttribbute] = useState('');
  const [image, setImage] = useState(null);
  const [heading, setHeading] = useState('');
  const [data, setData] = useState([]);
  const [content, setContent] = useState('');
  const [bullet_one, setBullet_one] = useState('');
  const [bullet_two, setBullet_two] = useState('');
  const [bullet_three, setBullet_three] = useState('');
  const [isActive, setIsActive] = useState('false');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(4); // Changed to 4 items per page
  const [showModal, setShowModal] = useState(false);
  const [clickedImage, setClickedImage] = useState(null);
  const [editMode, setEditMode] = useState(false);

  // State variables for edit modal
  const [editAttribbute, setEditAttribbute] = useState('');
  const [editHeading, setEditHeading] = useState('');
  const [editBullet_one, setEditBullet_one] = useState('');
  const [editBullet_two, setEditBullet_two] = useState('');
  const [editBullet_three, setEditBullet_three] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editIsActive, setEditIsActive] = useState(false);
  const [editItemId, setEditItemId] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [clickedItem, setClickedItem] = useState(null);
  const handleSubmit = async (event) => {
    event.preventDefault();

    const pageData = new FormData();
    pageData.append('Attribbute', attribbute);
    pageData.append('file', image);
    pageData.append('Heading', heading);
    pageData.append('content', content);
    pageData.append('bullet_one', bullet_one);
    pageData.append('bullet_two', bullet_two);
    pageData.append('bullet_three', bullet_three);
    pageData.append('isActive', isActive);

    const token = localStorage.getItem('token');

    try {
      const response = await axios.post('https://r8bkfpncj3.execute-api.ap-south-1.amazonaws.com/production/api/create/motivation', pageData, {
        headers: {
          Authorization: `${token}`
        }
      });
      console.log(response);
      toast.success('Data added successfully'); // Call toast.success after successful addition

      // Reload page after successful submission
      window.location.reload();

      // Clear form data after submission
      setAttribbute('');
      setImage(null);
      setHeading('');
      setContent('');
      setBullet_one('');
      setBullet_two('');
      setBullet_three('');
      setIsActive(false);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to add data'); // Display error toast if addition fails
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
    axios.get(`https://r8bkfpncj3.execute-api.ap-south-1.amazonaws.com/production/api/get/motivations?page=${currentPage}&perPage=${itemsPerPage}`)
      .then(response => {
        console.log(response.data);
        setData(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, [currentPage, itemsPerPage]);

  const handleDelete = (id) => {
    const token = localStorage.getItem('token');

    axios.delete(`https://r8bkfpncj3.execute-api.ap-south-1.amazonaws.com/production/api/delete/motivation/${id}`, {
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

  const handleCloseModal = () => {
    setShowModal(false);
  }

  const handleImageClick = (imageUrl) => {
    setClickedImage(imageUrl);
    setShowModal(true);
  }

  const handleEditModal = (item) => {
    setEditItemId(item._id);
    setEditAttribbute(item._id);
    setEditHeading(item.Heading);
    setEditContent(item.content);
    setEditBullet_one(item.bullet_one);
    setEditBullet_two(item.bullet_two);
    setEditBullet_three(item.bullet_three);
    setEditIsActive(item.isActive);
    setShowModal(true);
    setEditMode(true); // Set editMode to true when opening the edit modal
  }

  const handleEditSubmit = async () => {
    const token = localStorage.getItem('token');
    const editData = {
      Heading: editHeading,
      attribbute: editAttribbute,
      content: editContent,
      bullet_one: editBullet_one,
      bullet_two: editBullet_two,
      bullet_three: editBullet_three,
      isActive: editIsActive
    };

    try {
      const response = await axios.put(`https://r8bkfpncj3.execute-api.ap-south-1.amazonaws.com/production/api/update/motivation/${editItemId}`, editData, {
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
      <div className="d-xl-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-2">
        <div className="d-block mb-4 mb-xl-0">
          <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
            <Breadcrumb.Item><FontAwesomeIcon icon={faHome} /></Breadcrumb.Item>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item active>Motivation</Breadcrumb.Item>
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
                        <h3 className="mb-0">Motivation</h3>
                      </div>
                      <Form className="mt-4" onSubmit={handleSubmit}>
                        <Row>
                          <Col xs={12} md={6}>
                            <Form.Group id="serviceName" className="mb-4">
                              <Form.Label>Attribbute</Form.Label>
                              <InputGroup>
                                <InputGroup.Text>
                                </InputGroup.Text>
                                <Form.Control autoFocus required type="text" placeholder="Attribbute" value={attribbute} onChange={(e) => setAttribbute(e.target.value)} />
                              </InputGroup>
                            </Form.Group>
                          </Col>
                          <Col xs={12} md={6}>
                            <Form.Group id="serviceDescription" className="mb-4">
                              <Form.Label>Heading</Form.Label>
                              <InputGroup>
                                <InputGroup.Text>
                                </InputGroup.Text>
                                <Form.Control autoFocus required type="text" placeholder="Heading" value={heading} onChange={(e) => setHeading(e.target.value)} />
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
                          <Col xs={12} md={6}>
                            <Form.Group id="serviceDescription" className="mb-4">
                              <Form.Label>Bullet</Form.Label>
                              <InputGroup>
                                <InputGroup.Text>
                                </InputGroup.Text>
                                <Form.Control autoFocus required type="text" placeholder="Bullet" value={bullet_one} onChange={(e) => setBullet_one(e.target.value)} />
                              </InputGroup>
                            </Form.Group>
                          </Col>
                          <Col xs={12} md={6}>
                            <Form.Group id="serviceDescription" className="mb-4">
                              <Form.Label>Bullet</Form.Label>
                              <InputGroup>
                                <InputGroup.Text>
                                </InputGroup.Text>
                                <Form.Control autoFocus required type="text" placeholder="Bullet" value={bullet_two} onChange={(e) => setBullet_two(e.target.value)} />
                              </InputGroup>
                            </Form.Group>
                          </Col>
                          <Col xs={12} md={6}>
                            <Form.Group id="serviceDescription" className="mb-4">
                              <Form.Label>Bullet</Form.Label>
                              <InputGroup>
                                <InputGroup.Text>
                                </InputGroup.Text>
                                <Form.Control autoFocus required type="text" placeholder="Bullet" value={bullet_three} onChange={(e) => setBullet_three(e.target.value)} />
                              </InputGroup>
                            </Form.Group>
                          </Col>
                          <Col xs={12} md={6}>
                            <Form.Group id="serviceDescription" className="mb-4">
                              <Form.Label>Content</Form.Label>
                              <InputGroup>
                                <InputGroup.Text>
                                </InputGroup.Text>
                                <Form.Control as="textarea" placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} />
                              </InputGroup>
                            </Form.Group>
                          </Col>
                          <Col xs={12} md={6}>
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
                            <th scope="col">Attribute</th>
                            <th scope="col">Image</th>
                            <th scope="col" >Actions</th>
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
                              {/* <td>{row.Heading}</td>
                               <td>{row.content}</td>
                              <td>{row.bullet_one}</td>
                              <td>{row.bullet_two}</td>
                              <td>{row.bullet_three}</td>
                              <td>{row.isActive ? "True" : "False"}</td> */}
                              <td>
                                <Button variant="info" size="sm" onClick={() => handleViewDetails(row)}>
                                  <FontAwesomeIcon icon={faEye} />
                                  view
                                </Button>
                                <br />
                                <br />
                                <Button variant="info" size="sm" onClick={() => handleEditModal(row)}>
                                  <FontAwesomeIcon icon={faEdit} />
                                  Edit
                                </Button>
                                <br />
                                <br />
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
                              <Form.Label>Attribbute</Form.Label>
                              <Form.Control type="text" value={editAttribbute} onChange={(e) => setEditAttribbute(e.target.value)} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="editHeading">
                              <Form.Label>Heading</Form.Label>
                              <Form.Control type="text" value={editHeading} onChange={(e) => setEditHeading(e.target.value)} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="editDate">
                              <Form.Label>Content</Form.Label>
                              <Form.Control type="text" value={editContent} onChange={(e) => setEditContent(e.target.value)} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="editDescription">
                              <Form.Label>Bullet_one</Form.Label>
                              <Form.Control as="textarea" rows={3} value={editBullet_one} onChange={(e) => setEditBullet_one(e.target.value)} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="editTagline">
                              <Form.Label>Bullet_two</Form.Label>
                              <Form.Control type="text" value={editBullet_two} onChange={(e) => setEditBullet_two(e.target.value)} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="editTagline">
                              <Form.Label>Bullet_three</Form.Label>
                              <Form.Control type="text" value={editBullet_three} onChange={(e) => setEditBullet_three(e.target.value)} />
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
                      <p><strong>Attribute:</strong> {clickedItem.Attribbute}</p>
                      <p><strong>Heading:</strong> {clickedItem.Heading}</p>
                      <p><strong>Content:</strong> {clickedItem.content}</p>
                      <p><strong>Bullet One:</strong> {clickedItem.bullet_one}</p>
                      <p><strong>Bullet Two:</strong> {clickedItem.bullet_two}</p>
                      <p><strong>Bullet Three:</strong> {clickedItem.bullet_three}</p>
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
