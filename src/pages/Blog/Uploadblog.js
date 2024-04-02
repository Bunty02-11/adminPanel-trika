import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faTrash, faEdit, faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { Breadcrumb, Col, Row, Form, Button, InputGroup, Container, Card, Table, Modal, Tab, Nav } from '@themesberg/react-bootstrap';
import { ToastContainer, toast } from 'react-toastify/dist/react-toastify.cjs.development';
import 'react-toastify/dist/ReactToastify.css';

export default () => {
    const [heading, setHeading] = useState('');
    const [image, setImage] = useState(null);
    const [description, setDescription] = useState('');
    const [data, setData] = useState([]);
    const [tagline, setTagline] = useState('');
    const [date, setDate] = useState('');
    const [isActive, setIsActive] = useState('false');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(4);
    const [showModal, setShowModal] = useState(false);
    const [clickedImage, setClickedImage] = useState(null);
    const [editMode, setEditMode] = useState(false);

    // State variables for edit modal
    const [editHeading, setEditHeading] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [editTagline, setEditTagline] = useState('');
    const [editDate, setEditDate] = useState('');
    const [editIsActive, setEditIsActive] = useState(false);
    const [editItemId, setEditItemId] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        // Form data for creating a new blog post
        const pageData = new FormData();
        pageData.append('heading', heading);
        pageData.append('file', image);
        pageData.append('description', description);
        pageData.append('date', date);
        pageData.append('tagline', tagline);
        pageData.append('isActive', isActive);

        const token = localStorage.getItem('token');

        try {
            const response = await axios.post('https://r8bkfpncj3.execute-api.ap-south-1.amazonaws.com/production/api/createblog', pageData, {
                headers: {
                    Authorization: `${token}`
                }
            });
            console.log(response);
            toast.success('Data added successfully');
            // Clear form data after submission
            clearFormData();
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to add data');
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
        axios.get(`https://r8bkfpncj3.execute-api.ap-south-1.amazonaws.com/production/api/blog?page=${currentPage}&perPage=${itemsPerPage}`)
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
        axios.delete(`https://r8bkfpncj3.execute-api.ap-south-1.amazonaws.com/production/api/blog/${id}`, {
            headers: {
                Authorization: `${token}`
            }
        })
            .then(response => {
                console.log('Record deleted successfully:', response.data);
                setData(prevData => prevData.filter(item => item.id !== id));
                toast.success('Record deleted successfully');
            })
            .catch(error => {
                console.error('Error deleting record:', error);
                toast.error('Failed to delete record');
            });
    }

    const handleImageClick = (imageUrl) => {
        setClickedImage(imageUrl);
        setShowModal(true);
    }

    const handleCloseModal = () => {
        setShowModal(false);
    }

    const handleEditModal = (item) => {
        setEditItemId(item._id);
        setEditHeading(item.heading);
        setEditDescription(item.description);
        setEditTagline(item.tagline);
        setEditDate(item.date);
        setEditIsActive(item.isActive);
        setShowModal(true);
        setEditMode(true); // Set editMode to true when opening the edit modal
    }

    const handleEditSubmit = async () => {
        const token = localStorage.getItem('token');
        const editData = {
            heading: editHeading,
            description: editDescription,
            tagline: editTagline,
            date: editDate,
            isActive: editIsActive
        };

        try {
            const response = await axios.put(`https://r8bkfpncj3.execute-api.ap-south-1.amazonaws.com/production/api/blog/${editItemId}`, editData, {
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

    const clearFormData = () => {
        setHeading('');
        setImage(null);
        setDescription('');
        setDate('');
        setTagline('');
        setIsActive(false);
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
                        <Breadcrumb.Item>Blog</Breadcrumb.Item>
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
                                                <h3 className="mb-0">Blog</h3>
                                            </div>
                                            <Form className="mt-4" onSubmit={handleSubmit}>
                                                <Row>
                                                    <Col xs={12} md={6}>
                                                        <Form.Group id="serviceName" className="mb-4">
                                                            <Form.Label>heading</Form.Label>
                                                            <InputGroup>
                                                                <InputGroup.Text>
                                                                </InputGroup.Text>
                                                                <Form.Control autoFocus required type="text" placeholder="heading" value={heading} onChange={(e) => setHeading(e.target.value)} />
                                                            </InputGroup>
                                                        </Form.Group>
                                                    </Col>
                                                    <Col xs={12} md={6}>
                                                        <Form.Group id="serviceDate" className="mb-4">
                                                            <Form.Label>Date</Form.Label>
                                                            <InputGroup>
                                                                <InputGroup.Text>
                                                                </InputGroup.Text>
                                                                <Form.Control autoFocus required type="text" placeholder="date" value={date} onChange={(e) => setDate(e.target.value)} />
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
                                                                    accept="image/*"
                                                                    onChange={handleImageUpload}
                                                                    placeholder="Upload Image"
                                                                />
                                                            </InputGroup>
                                                        </Form.Group>
                                                    </Col>
                                                    <Col xs={12} md={6}>
                                                        <Form.Group id="serviceDescription" className="mb-4">
                                                            <Form.Label>Description</Form.Label>
                                                            <InputGroup>
                                                                <InputGroup.Text>
                                                                </InputGroup.Text>
                                                                <Form.Control as="textarea" placeholder="description" value={description} onChange={(e) => setDescription(e.target.value)} />
                                                            </InputGroup>
                                                        </Form.Group>
                                                    </Col>
                                                    <Col xs={12} md={6}>
                                                        <Form.Group id="serviceTagline" className="mb-4">
                                                            <Form.Label>Tagline</Form.Label>
                                                            <InputGroup>
                                                                <InputGroup.Text>
                                                                </InputGroup.Text>
                                                                <Form.Control autoFocus required type="text" placeholder="Tagline" value={tagline} onChange={(e) => setTagline(e.target.value)} />
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
                                                        <h5>Blog Banner</h5>
                                                    </Col>
                                                </Row>
                                            </Card.Header>
                                            <Table responsive className="align-items-center table-flush">
                                                <thead className="thead-light">
                                                    <tr>
                                                        <th scope="col">#</th>
                                                        <th scope="col">Heading</th>
                                                        <th scope="col">Image</th>
                                                        <th scope="col">Description</th>
                                                        <th scope="col">Date</th>
                                                        <th scope="col">Tagline</th>
                                                        <th scope="col">isActive</th>
                                                        <th scope="col">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {currentItems.map((row, index) => (
                                                        <tr key={index}>
                                                            <td>{indexOfFirstItem + index + 1}</td>
                                                            <td>{row.heading}</td>
                                                            <td>
                                                                {row.image && (
                                                                    <img
                                                                        src={row.image}
                                                                        alt="Image"
                                                                        style={{ maxWidth: "100px", cursor: "pointer" }}
                                                                        onClick={() => handleImageClick(row.image)}
                                                                    />
                                                                )}
                                                            </td>
                                                            <td>{row.description}</td>
                                                            <td>{row.date}</td>
                                                            <td>{row.tagline}</td>
                                                            <td>{row.isActive ? "True" : "False"}</td>
                                                            <td>
                                                                <Button variant="info" size="sm" onClick={() => handleEditModal(row)}>
                                                                    <FontAwesomeIcon icon={faEdit} />
                                                                </Button>
                                                                <Button variant="danger" size="sm" onClick={() => handleDelete(row._id)}>
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
                                            <Modal show={showModal && editMode} onHide={() => setEditMode(false)}>
                                                <Modal.Header>
                                                    <Modal.Title>Edit Blog</Modal.Title>
                                                </Modal.Header>
                                                <Modal.Body>
                                                    <Form>
                                                        <Form.Group className="mb-3" controlId="editHeading">
                                                            <Form.Label>Heading</Form.Label>
                                                            <Form.Control type="text" value={editHeading} onChange={(e) => setEditHeading(e.target.value)} />
                                                        </Form.Group>
                                                        <Form.Group className="mb-3" controlId="editDate">
                                                            <Form.Label>Date</Form.Label>
                                                            <Form.Control type="text" value={editDate} onChange={(e) => setEditDate(e.target.value)} />
                                                        </Form.Group>
                                                        <Form.Group className="mb-3" controlId="editDescription">
                                                            <Form.Label>Description</Form.Label>
                                                            <Form.Control as="textarea" rows={3} value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
                                                        </Form.Group>
                                                        <Form.Group className="mb-3" controlId="editTagline">
                                                            <Form.Label>Tagline</Form.Label>
                                                            <Form.Control type="text" value={editTagline} onChange={(e) => setEditTagline(e.target.value)} />
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
