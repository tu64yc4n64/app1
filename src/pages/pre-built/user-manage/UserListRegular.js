import React, { useState, useEffect } from "react";
import Head from "../../../layout/head/Head";
import Content from "../../../layout/content/Content";
import ProductH from "../../../images/avatar/a-sm.jpg"
import SimpleBar from "simplebar-react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { RSelect } from "../../../components/Component";
import DatePicker from "react-datepicker";
import api from '../../../api/api';
import { Card, DropdownItem, UncontrolledDropdown, DropdownMenu, DropdownToggle, Modal, ModalBody } from "reactstrap";

import {
  Block,
  BlockDes,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Icon,
  Button,
  Col,
  BlockBetween,
  DataTableBody,
  DataTableHead,
  DataTableRow,
  DataTableItem,
  Row,
  PaginationComponent,
  DataTable

} from "../../../components/Component";

import axios from "axios";


const BASE_URL = "https://tiosone.com/customers/api/"

const UserListRegularPage = () => {


  const [data, setData] = useState([]);
  console.log(data)

  const getAllCategories = async () => {
    let accessToken = localStorage.getItem('accessToken');

    try {
      const response = await axios.get(BASE_URL + "categories?type=person", {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });
      setCategories(response.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        accessToken = await refreshAccessToken();
        if (accessToken) {
          try {
            const response = await axios.get(BASE_URL + "categories?type=person", {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
              }
            });
            setCategories(response.data);
          } catch (retryError) {
            console.error("Retry error after refreshing token", retryError);
          }
        }
      } else {
        console.error("There was an error fetching the data!", error);
      }
    }
  };

  const getAllTags = async () => {
    let accessToken = localStorage.getItem('accessToken');

    try {
      const response = await axios.get(BASE_URL + "tags?type=person", {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });
      setTags(response.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        accessToken = await refreshAccessToken();
        if (accessToken) {
          try {
            const response = await axios.get(BASE_URL + "tags?type=person", {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
              }
            });
            setTags(response.data);
          } catch (retryError) {
            console.error("Retry error after refreshing token", retryError);
          }
        }
      } else {
        console.error("There was an error fetching the data!", error);
      }
    }
  };

  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');


    if (!refreshToken) {
      console.error('No refresh token found in local storage.');
      return null;
    }

    try {
      const response = await axios.post("https://tiosone.com/api/token/refresh/", {
        refresh: refreshToken
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const newAccessToken = response.data.access;
      localStorage.setItem('accessToken', newAccessToken);
      return newAccessToken;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error("Refresh token is invalid or expired. User needs to re-login.");
        window.location.href = '/auth-login';
      } else {
        console.error("Error refreshing access token", error);
      }
      return null;
    }
  };

  const getAllUsers = async () => {
    let accessToken = localStorage.getItem('accessToken');


    try {
      const response = await axios.get(BASE_URL + "persons/", {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });
      setData(response.data);
      setOriginalData(response.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {

        accessToken = await refreshAccessToken();
        if (accessToken) {

          try {
            const response = await axios.get(BASE_URL + "persons/", {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
              }
            });
            setData(response.data);
            setOriginalData(response.data);
          } catch (retryError) {
            console.error("Retry error after refreshing token", retryError);
          }
        }
      } else {
        console.error("There was an error fetching the data!", error);
      }
    }
  };
  useEffect(() => {
    getAllUsers()

  }, [])
  const [categories, setCategories] = useState([]);

  const [tags, setTags] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);

  const [selectedTag, setSelectedTag] = useState([]);
  const formattedCategories = categories.map(category => ({
    value: category.id,
    label: category.name
  }));
  const formattedTags = tags.map(tag => ({
    value: tag.id,
    label: tag.name
  }));
  const handleCategoryChange = (selectedOptions) => {
    setSelectedCategory(selectedOptions);
  };

  const handleTagChange = (selectedOptions) => {
    setSelectedTag(selectedOptions);
  };
  useEffect(() => {
    getAllCategories()

  }, [])
  useEffect(() => {
    getAllTags()

  }, [])
  const [sm, updateSm] = useState(false);
  const [tablesm, updateTableSm] = useState(false);
  const [startDate, setStartDate] = useState();
  const [itemPerPage, setItemPerPage] = useState(10);
  const [sort, setSortState] = useState("");
  const [onSearch, setonSearch] = useState(true);
  const sortFunc = (params) => {
    let defaultData = data;
    if (params === "asc") {
      let sortedData = defaultData.sort((a, b) => a.name.localeCompare(b.name));
      setData([...sortedData]);
    } else if (params === "dsc") {
      let sortedData = defaultData.sort((a, b) => b.name.localeCompare(a.name));
      setData([...sortedData]);
    }
  };
  const durum = [
    { value: true, label: 'Aktif' },
    { value: false, label: 'Pasif' },
  ];
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    company: "",
    department: "",
    job_title: "",
    birthday: "",
    categories: [],
    tags: [],
    country: "",
    city: "",
    district: "",
    address_line: "",
    phone: "",
    email: "",
    website: "",
    is_active: true,
    customer_representatives: []
  });
  const [editId, setEditedId] = useState();
  const [view, setView] = useState({
    edit: false,
    add: false,
    details: false,
  });
  const [onSearchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);



  //scroll off when sidebar shows
  useEffect(() => {
    view.add ? document.body.classList.add("toggle-shown") : document.body.classList.remove("toggle-shown");
  }, [view.add])

  const [originalData, setOriginalData] = useState([]);
  useEffect(() => {
    if (onSearchText !== "") {
      const filteredObject = data.filter((item) => {
        return item.first_name.toLowerCase().includes(onSearchText.toLowerCase());
      });
      setData([...filteredObject]);
    } else {
      setData([...originalData]);
    }
  }, [onSearchText]);

  // function to close the form modal
  const onFormCancel = () => {
    setView({ edit: false, add: false, details: false });
    resetForm();
  };

  const resetForm = () => {
    setSelectedCategory([])
    setSelectedTag([])
    setStartDate()
    setFormData({
      first_name: "",
      last_name: "",
      company: "",
      department: "",
      job_title: "",
      birthday: "",
      categories: [],
      tags: [],
      country: "",
      city: "",
      district: "",
      address_line: "",
      phone: "",
      email: "",
      website: "",
      is_active: true,
      customer_representatives: []
    });

    reset({});
  };

  const onFormSubmit = async (form) => {
    let accessToken = localStorage.getItem('accessToken');

    const { first_name, last_name, job_title, email, phone, address_line, birthday } = form;

    let submittedData = {
      first_name: first_name,
      last_name: last_name,
      //  company: "",
      //  department: "",
      job_title: job_title,
      // birthday: birthday,
      categories: [{
        "id": 1,
        "name": "Logistics",
        "parent": null,
        "type": "company"
      },],
      tags: [],
      country: "Türkiye",
      city: "Uşak",
      district: "Merkez",
      address_line: address_line,
      phone: phone,
      email: email,
      website: "",
      is_active: true,
      //customer_representatives: [],
      added_by: [1]
    };

    try {
      const response = await axios.post(BASE_URL + "persons/", submittedData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });
      setData([response.data, ...data]);
      setView({ open: false });

      resetForm();
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };



  const onEditSubmit = async () => {
    let accessToken = localStorage.getItem('accessToken');

    let submittedData;
    let newItems = data;
    let index = newItems.findIndex((item) => item.id === editId);

    newItems.forEach((item) => {
      if (item.id === editId) {
        submittedData = {
          first_name: formData.first_name,
          last_name: formData.last_name,
          // company: formData.company,
          // department: formData.department,
          // job_title: formData.job_title,
          //birthday: new Date(formData.birthday),
          // categories: formData.categories,
          //  tags: formData.tags,
          // country: formData.country,
          //  city: formData.city,
          // district: formData.district,
          // address_line: formData.address_line,
          // phone: formData.phone,
          email: formData.email,
          //  website: formData.website,
          is_active: formData.is_active,
          // customer_representatives: formData.customer_representatives,
          added_by: [1]
        };
      }
    });

    try {
      const response = await axios.put(`${BASE_URL}persons/${editId}`, submittedData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });

      // Veritabanı güncelleme başarılı olursa yerel veriyi güncelle
      newItems[index] = response.data;
      setData(newItems);
      resetForm();
      setView({ edit: false, add: false });
    } catch (error) {
      console.error('Veritabanını güncelleme sırasında hata oluştu:', error);
    }
  };


  const onEditClick = (id) => {
    data.forEach((item) => {
      if (item.id === id) {

        setFormData({
          first_name: item.first_name,
          last_name: item.last_name,
          company: item.company,
          department: item.department,
          job_title: item.job_title,
          birthday: new Date(item.birthday),
          categories: item.categories,
          tags: item.tags,
          country: item.country,
          city: item.city,
          district: item.district,
          address_line: item.address_line,
          phone: item.phone,
          email: item.email,
          website: item.website,
          is_active: true,
          customer_representatives: item.customer_representatives,

        });
      }

    });
    setEditedId(id);

    setView({ add: false, edit: true });
  };

  useEffect(() => {
    reset(formData)
  }, [formData]);

  // selects all the products
  const selectorCheck = (e) => {
    let newData;
    newData = data.map((item) => {
      item.check = e.currentTarget.checked;
      return item;
    });
    setData([...newData]);
  };

  // selects one product
  const onSelectChange = (e, id) => {
    let newData = data;
    let index = newData.findIndex((item) => item.id === id);
    newData[index].check = e.currentTarget.checked;
    setData([...newData]);
  };

  // onChange function for searching name
  const onFilterChange = (e) => {
    setSearchText(e.target.value);
  };

  // function to delete a product
  const deleteProduct = async (id) => {
    let accessToken = localStorage.getItem('accessToken');

    try {
      await axios.delete(`${BASE_URL}persons/${id}`, {
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      let updatedData = data.filter((item) => item.id !== id);
      setData([...updatedData]);
    } catch (error) {
      console.error("There was an error deleting the product!", error);
    }
  };


  // function to delete the seletected item
  const selectorDeleteProduct = () => {
    let newData;
    newData = data.filter((item) => item.check !== true);
    setData([...newData]);
  };

  // toggle function to view product details

  const toggle = (type) => {
    setView({
      edit: type === "edit" ? true : false,
      add: type === "add" ? true : false,
      details: type === "details" ? true : false,
    });
    setonSearch(!onSearch)
  };


  // Get current list, pagination
  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);


  // Change Page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  return (
    <>
      <Head title="Homepage"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle>Kişiler</BlockTitle>
              <div className="nk-block-des text-soft"><p>Toplam {currentItems.length} kişi</p></div>

            </BlockHeadContent>

            <BlockHeadContent>
              <div className="toggle-wrap nk-block-tools-toggle">

                <div className="toggle-expand-content" style={{ display: sm ? "block" : "none" }}>
                  <ul className="nk-block-tools g-3">


                    <li className="nk-block-tools-opt">
                      <Button
                        className="toggle btn btn-primary d-md-none"
                        color="primary"
                        onClick={() => {
                          toggle("add");
                        }}
                      >
                        Yeni Kişi Ekle
                      </Button>
                      <Button
                        className="toggle d-none d-md-inline-flex"
                        color="primary"
                        onClick={() => {
                          toggle("add");
                        }}
                      >

                        <span>Yeni Kişi Ekle</span>
                      </Button>
                    </li>
                  </ul>
                </div>
              </div>
            </BlockHeadContent>

          </BlockBetween>

        </BlockHead>
        <ul className="nk-block-tools gx-3" style={{ paddingBottom: "1.75rem" }}>
          <li>
            <div className="form-control-wrap">
              <div className="form-icon form-icon-left">
                <Icon name="search"></Icon>
              </div>
              <input
                type="text"
                className="form-control"
                id="default-04"
                placeholder="Kişilerde ara..."
                onChange={(e) => onFilterChange(e)}
              />
            </div>
          </li>
          <li>
            <UncontrolledDropdown>
              <DropdownToggle
                color="transparent"
                className="dropdown-toggle dropdown-indicator btn btn-outline-light btn-white"
              >
                Kategori
              </DropdownToggle>
              <DropdownMenu end>
                <ul className="link-list-opt no-bdr">

                </ul>
              </DropdownMenu>
            </UncontrolledDropdown>
          </li>
          <li>
            <UncontrolledDropdown>
              <DropdownToggle
                color="transparent"
                className="dropdown-toggle dropdown-indicator btn btn-outline-light btn-white"
              >
                Etiket
              </DropdownToggle>
              <DropdownMenu end>
                <ul className="link-list-opt no-bdr">

                </ul>
              </DropdownMenu>
            </UncontrolledDropdown>
          </li>


        </ul>
        <Block>
          <DataTable className="card-stretch">
            <Card className="card-bordered">

              <div className="card-inner-group">
                <div className="card-inner p-0">
                  <DataTableBody>
                    <DataTableHead>
                      <DataTableRow className="nk-tb-col-check">
                        <div className="custom-control custom-control-sm custom-checkbox notext">
                          <input
                            type="checkbox"
                            className="custom-control-input"
                            id="uid_1"
                            onChange={(e) => selectorCheck(e)}
                          />
                          <label className="custom-control-label" htmlFor="uid_1"></label>
                        </div>
                      </DataTableRow>
                      <DataTableRow >
                        <span>Müşteri</span>
                      </DataTableRow>
                      <DataTableRow size="md">
                        <span>Telefon</span>
                      </DataTableRow>
                      <DataTableRow>
                        <span>Kategori</span>
                      </DataTableRow>
                      <DataTableRow size="md">
                        <span>Etiket</span>
                      </DataTableRow>
                      <DataTableRow size="md">
                        <span>Şehir</span>
                      </DataTableRow>
                      <DataTableRow size="md">
                        <span>Temsilci</span>
                      </DataTableRow>
                      <DataTableRow size="md">
                        <span>Durum</span>
                      </DataTableRow>

                      <DataTableRow className="nk-tb-col-tools">
                        <ul className="nk-tb-actions gx-1 my-n1">
                          <li className="me-n1">
                            <UncontrolledDropdown>
                              <DropdownToggle
                                tag="a"
                                href="#toggle"
                                onClick={(ev) => ev.preventDefault()}
                                className="dropdown-toggle btn btn-icon btn-trigger"
                              >
                                <Icon name="more-h"></Icon>
                              </DropdownToggle>
                              <DropdownMenu end>
                                <ul className="link-list-opt no-bdr">
                                  <li>
                                    <DropdownItem tag="a" href="#edit" onClick={(ev) => ev.preventDefault()}>
                                      <Icon name="edit"></Icon>
                                      <span>Edit Selected</span>
                                    </DropdownItem>
                                  </li>
                                  <li>
                                    <DropdownItem
                                      tag="a"
                                      href="#remove"
                                      onClick={(ev) => {
                                        ev.preventDefault();
                                        selectorDeleteProduct();
                                      }}
                                    >
                                      <Icon name="trash"></Icon>
                                      <span>Remove Selected</span>
                                    </DropdownItem>
                                  </li>
                                  <li>
                                    <DropdownItem tag="a" href="#stock" onClick={(ev) => ev.preventDefault()}>
                                      <Icon name="bar-c"></Icon>
                                      <span>Update Stock</span>
                                    </DropdownItem>
                                  </li>
                                  <li>
                                    <DropdownItem tag="a" href="#price" onClick={(ev) => ev.preventDefault()}>
                                      <Icon name="invest"></Icon>
                                      <span>Update Price</span>
                                    </DropdownItem>
                                  </li>
                                </ul>
                              </DropdownMenu>
                            </UncontrolledDropdown>
                          </li>
                        </ul>
                      </DataTableRow>
                    </DataTableHead>
                    {currentItems.length > 0
                      ? currentItems.reverse().map((item) => {

                        return (
                          <DataTableItem key={item.id}>
                            <DataTableRow className="nk-tb-col-check">
                              <div className="custom-control custom-control-sm custom-checkbox notext">
                                <input
                                  type="checkbox"
                                  className="custom-control-input"
                                  defaultChecked={item.check}
                                  id={item.id + "uid1"}
                                  key={Math.random()}
                                  onChange={(e) => onSelectChange(e, item.id)}
                                />
                                <label className="custom-control-label" htmlFor={item.id + "uid1"}></label>
                              </div>
                            </DataTableRow>
                            <DataTableRow>
                              <Link to={`${process.env.PUBLIC_URL}/kisi-detay/${item.id}`}>
                                <span className="tb-product" style={{ flexDirection: "column", display: "flex", alignItems: "center" }}>

                                  <span className="title">{item.first_name} {item.last_name}</span>
                                  <small className="text-soft">{item.email}</small>
                                </span>
                              </Link>
                            </DataTableRow>

                            <DataTableRow size="md">
                              <span className="tb-sub">{item.phone}</span>
                            </DataTableRow>
                            <DataTableRow>
                              {item.categories && item.categories.length > 0 && item.categories.map((category, index) => (
                                <span key={index} className="badge bg-outline-secondary me-1">
                                  {category.label}
                                </span>
                              ))}
                            </DataTableRow>
                            <DataTableRow>
                              {item.tags && item.tags.length > 0 && item.tags.map((tag, index) => (
                                <span key={index} className="badge bg-outline-secondary me-1">
                                  {tag.label}
                                </span>
                              ))}
                            </DataTableRow>
                            <DataTableRow size="md">
                              <span className="tb-sub">{item.city}</span>
                            </DataTableRow>
                            <DataTableRow size="md">
                              <img style={{ borderRadius: "50%", width: "25px" }} src={ProductH} alt="product" className="thumb" />
                              <span style={{ paddingLeft: "5px" }} className="tb-sub"></span>
                            </DataTableRow>
                            <DataTableRow>
                              <span className={`tb-status text-${item.is_active ? "success" : "danger"}`}>
                                {item.is_active ? "Aktif" : "Pasif"}
                              </span>
                            </DataTableRow>
                            <DataTableRow className="nk-tb-col-tools">
                              <ul className="nk-tb-actions gx-1 my-n1">
                                <li className="me-n1">
                                  <UncontrolledDropdown>
                                    <DropdownToggle
                                      tag="a"
                                      href="#more"
                                      onClick={(ev) => ev.preventDefault()}
                                      className="dropdown-toggle btn btn-icon btn-trigger"
                                    >
                                      <Icon name="more-h"></Icon>
                                    </DropdownToggle>
                                    <DropdownMenu end>
                                      <ul className="link-list-opt no-bdr">
                                        <li>
                                          <DropdownItem
                                            tag="a"
                                            href="#edit"
                                            onClick={(ev) => {
                                              ev.preventDefault();
                                              onEditClick(item.id);
                                              toggle("edit");
                                            }}
                                          >
                                            <Icon name="edit"></Icon>
                                            <span>Kişiyi Düzenle</span>
                                          </DropdownItem>
                                        </li>
                                        <li>
                                          <DropdownItem
                                            tag="a"
                                            href="#view"
                                            onClick={(ev) => {
                                              ev.preventDefault();
                                              onEditClick(item.id);
                                              toggle("details");
                                            }}
                                          >
                                            <Icon name="eye"></Icon>
                                            <span>Kişiyi Görüntüle</span>
                                          </DropdownItem>
                                        </li>
                                        <li>
                                          <DropdownItem
                                            tag="a"
                                            href="#remove"
                                            onClick={(ev) => {
                                              ev.preventDefault();
                                              deleteProduct(item.id);
                                            }}
                                          >
                                            <Icon name="trash"></Icon>
                                            <span>Kişiyi Sil</span>
                                          </DropdownItem>
                                        </li>
                                      </ul>
                                    </DropdownMenu>
                                  </UncontrolledDropdown>
                                </li>
                              </ul>
                            </DataTableRow>
                          </DataTableItem>
                        );
                      })
                      : null}
                  </DataTableBody>
                  <div className="card-inner">
                    {data.length > 0 ? (
                      <PaginationComponent
                        itemPerPage={itemPerPage}
                        totalItems={data.length}
                        paginate={paginate}
                        currentPage={currentPage}
                      />
                    ) : (
                      <div className="text-center">
                        <span className="text-silent">Herhangi bir müşteri bulunamadı</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </DataTable>
        </Block>
        <Modal isOpen={view.edit} toggle={() => onFormCancel()} className="modal-dialog-centered" size="lg">
          <ModalBody>
            <a href="#cancel" className="close">
              {" "}
              <Icon
                name="cross-sm"
                onClick={(ev) => {
                  ev.preventDefault();
                  onFormCancel();
                }}
              ></Icon>
            </a>
            <div className="p-2">
              <h5 className="title">Update Product</h5>
              <div className="mt-4">
                <form noValidate onSubmit={handleSubmit(onEditSubmit)}>
                  <Row className="g-3">
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="firstName">
                          Adı
                        </label>
                        <div className="form-control-wrap">
                          <input
                            id="firstName"
                            type="text"
                            className="form-control"
                            {...register('first_name', {
                              required: "Lütfen alanları boş bırakmayınız",
                            })}
                            value={formData.first_name}
                            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })} />
                          {errors.first_name && <span className="invalid">{errors.first_name.message}</span>}
                        </div>
                      </div>
                    </Col>
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="lastName">
                          Soyadı
                        </label>
                        <div className="form-control-wrap">
                          <input
                            id="lastName"
                            type="text"
                            className="form-control"
                            {...register('last_name', {
                              required: "Lütfen alanları boş bırakmayınız",
                            })}
                            value={formData.last_name}
                            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })} />
                          {errors.last_name && <span className="invalid">{errors.last_name.message}</span>}
                        </div>
                      </div>
                    </Col>
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="sirket">
                          Şirket
                        </label>
                        <div className="form-control-wrap">
                          <input
                            id="sirket"
                            type="text"
                            className="form-control"

                            value={formData.company}
                            onChange={(e) => setFormData({ ...formData, company: e.target.value })} />

                        </div>
                      </div>
                    </Col>
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="bolum">
                          Bölüm
                        </label>
                        <div className="form-control-wrap">
                          <input
                            id="bolum"
                            type="text"
                            className="form-control"

                            value={formData.department}
                            onChange={(e) => setFormData({ ...formData, department: e.target.value })} />

                        </div>
                      </div>
                    </Col>
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="unvan1">
                          Ünvan
                        </label>
                        <div className="form-control-wrap">
                          <input
                            id="unvan1"
                            type="text"
                            className="form-control"

                            value={formData.job_title}
                            onChange={(e) => setFormData({ ...formData, job_title: e.target.value })} />

                        </div>
                      </div>
                    </Col>
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="dogumGunu">
                          Doğum Günü
                        </label>
                        <div className="form-control-wrap">
                          <DatePicker
                            id="dogumGunu"
                            selected={formData.birthday}
                            onChange={(e) => setFormData({ ...formData, birthday: e })}
                            className="form-control"
                            placeholderText="Doğum Tarihi"

                          />
                        </div>
                      </div>
                    </Col>

                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label">
                          Kategori
                        </label>
                        <div className="form-control-wrap">
                          <RSelect

                            isMulti
                            options={formattedCategories}
                            value={formData.categories}
                            onChange={(value) => setFormData({ ...formData, categories: value })}
                          />
                        </div>
                      </div>
                    </Col>
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label">
                          Etiketler
                        </label>
                        <div className="form-control-wrap">
                          <RSelect
                            isMulti
                            options={formattedTags}
                            value={formData.tags}
                            onChange={(value) => setFormData({ ...formData, tags: value })}
                          />
                        </div>
                      </div>
                    </Col>
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="ulke">
                          Ülke
                        </label>
                        <div className="form-control-wrap">
                          <input
                            id="ulke"
                            type="text"
                            className="form-control"

                            value={formData.country}
                            onChange={(e) => setFormData({ ...formData, country: e.target.value })} />

                        </div>
                      </div>
                    </Col>
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="sehir">
                          Şehir
                        </label>
                        <div className="form-control-wrap">
                          <input
                            id="sehir"
                            type="text"
                            className="form-control"

                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })} />

                        </div>
                      </div>
                    </Col>
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="ilce">
                          İlçe
                        </label>
                        <div className="form-control-wrap">
                          <input
                            id="ilce"
                            type="text"
                            className="form-control"

                            value={formData.district}
                            onChange={(e) => setFormData({ ...formData, district: e.target.value })} />

                        </div>
                      </div>
                    </Col>
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="adress">
                          Adres
                        </label>
                        <div className="form-control-wrap">
                          <input
                            id="adress"
                            type="text"
                            className="form-control"

                            value={formData.address_line}
                            onChange={(e) => setFormData({ ...formData, address_line: e.target.value })} />

                        </div>
                      </div>
                    </Col>
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="telefon1">
                          Telefon
                        </label>
                        <div className="form-control-wrap">
                          <input
                            id="telefon1"
                            type="text"
                            className="form-control"

                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />

                        </div>
                      </div>
                    </Col>
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="mail1">
                          Email
                        </label>
                        <div className="form-control-wrap">
                          <input
                            id="mail1"
                            type="text"
                            className="form-control"

                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })} />

                        </div>
                      </div>
                    </Col>
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="website1">
                          Website
                        </label>
                        <div className="form-control-wrap">
                          <input
                            id="website1"
                            type="text"
                            className="form-control"

                            value={formData.website}
                            onChange={(e) => setFormData({ ...formData, website: e.target.value })} />

                        </div>
                      </div>
                    </Col>
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label">
                          Durum
                        </label>
                        <div className="form-control-wrap">
                          <RSelect

                            options={durum}
                            value={durum.find(option => option.value === formData.is_active)}
                            onChange={(selectedOptions) => setFormData({ ...formData, is_active: selectedOptions.value })}

                          />
                        </div>
                      </div>
                    </Col>
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label">
                          Temsilci
                        </label>
                        <div className="form-control-wrap">
                          <RSelect
                          />
                        </div>
                      </div>
                    </Col>



                    <Col size="12">
                      <Button color="primary" type="submit">

                        <span>Kişiyi Güncelle</span>
                      </Button>
                    </Col>
                  </Row>
                </form>
              </div>
            </div>
          </ModalBody>
        </Modal>

        <Modal isOpen={view.details} toggle={() => onFormCancel()} className="modal-dialog-centered" size="lg">
          <ModalBody>
            <a href="#cancel" className="close">
              {" "}
              <Icon
                name="cross-sm"
                onClick={(ev) => {
                  ev.preventDefault();
                  onFormCancel();
                }}
              ></Icon>
            </a>
            <div className="nk-modal-head">
              <h4 className="nk-modal-title title">
                Kişi Bilgileri <small className="text-primary"></small>
              </h4>

            </div>
            <div className="nk-tnx-details mt-sm-3">
              <Row className="gy-3">
                <Col lg={4}>
                  <span className="sub-text">Adı</span>
                  <span className="caption-text">{formData.first_name}</span>
                </Col>
                <Col lg={4}>
                  <span className="sub-text">Soyadı</span>
                  <span className="caption-text">{formData.last_name}</span>
                </Col>
                <Col lg={4}>
                  <span className="sub-text">Şirket</span>
                  <span className="caption-text">{formData.company}</span>
                </Col>
                <Col lg={4}>
                  <span className="sub-text">Departman</span>
                  <span className="caption-text">{formData.department}</span>
                </Col>
                <Col lg={4}>
                  <span className="sub-text">Ünvan</span>
                  <span className="caption-text">{formData.job_title}</span>
                </Col>
                <Col lg={4}>
                  <span className="sub-text">Doğum Günü</span>
                  <span className="caption-text">{new Date(formData.birthday).toLocaleDateString('tr-TR')}</span>
                </Col>
                <Col lg={4}>
                  <span className="sub-text">Kategori</span>
                  <span className="caption-text">
                    {formData.categories.map((item, index) => (
                      <span key={index} className="badge bg-outline-secondary me-1">
                        {item.label}
                      </span>
                    ))}
                  </span>
                </Col>
                <Col lg={4}>
                  <span className="sub-text">Etiket</span>
                  <span className="caption-text">
                    {formData.tags.map((item, index) => (
                      <span key={index} className="badge bg-outline-secondary me-1">
                        {item.label}
                      </span>
                    ))}
                  </span>
                </Col>
                <Col lg={4}>
                  <span className="sub-text">Ülke</span>
                  <span className="caption-text">{formData.country}</span>
                </Col>
                <Col lg={4}>
                  <span className="sub-text">Şehir</span>
                  <span className="caption-text">{formData.city}</span>
                </Col>
                <Col lg={4}>
                  <span className="sub-text">İlçe</span>
                  <span className="caption-text">{formData.district}</span>
                </Col>
                <Col lg={4}>
                  <span className="sub-text">Adres</span>
                  <span className="caption-text">{formData.address_line}</span>
                </Col>
                <Col lg={4}>
                  <span className="sub-text">Telefon</span>
                  <span className="caption-text">{formData.phone}</span>
                </Col>
                <Col lg={4}>
                  <span className="sub-text">E-mail</span>
                  <span className="caption-text">{formData.email}</span>
                </Col>
                <Col lg={4}>
                  <span className="sub-text">Website</span>
                  <span className="caption-text">{formData.website}</span>
                </Col>
                <Col lg={4}>
                  <span className="sub-text">Durum</span>
                  <span className="caption-text">{formData.is_active ? "Aktif" : "Pasif"}</span>
                </Col>
                <Col lg={4}>
                  <span className="sub-text">Temsilci</span>
                  <span className="caption-text">
                    {formData.customer_representatives.map((item, index) => (
                      <span key={index} className="badge bg-outline-secondary me-1">
                        {item}
                      </span>
                    ))}
                  </span>
                </Col>

              </Row>
            </div>
          </ModalBody>
        </Modal>

        <SimpleBar
          className={`nk-add-product toggle-slide toggle-slide-right toggle-screen-any ${view.add ? "content-active" : ""
            }`}
        >
          <BlockHead>
            <BlockHeadContent>
              <BlockTitle tag="h5">Yeni Kişi Ekle</BlockTitle>
              <BlockDes>
                <p>Müşteri Listenize Yeni Kişi Ekleyin</p>
              </BlockDes>
            </BlockHeadContent>
          </BlockHead>
          <Block>
            <form onSubmit={handleSubmit(onFormSubmit)}>
              <Row className="g-3">
                <Col size="6">
                  <div className="form-group">
                    <label htmlFor="kullanici-adi" className="form-label text-soft">

                      Adı

                    </label>
                    <div className="form-control-wrap">
                      <input
                        type="text"
                        className="form-control"
                        {...register('first_name', {
                          required: "Lütfen boş bıraklın alanları doldurunuz.",
                        })}
                        placeholder="Adı"
                        value={formData.first_name}
                        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })} />
                      {errors.first_name && <span className="invalid">{errors.first_name.message}</span>}
                    </div>
                  </div>
                </Col>
                <Col size="6">
                  <div className="form-group">
                    <label htmlFor="soyadi" className="form-label text-soft">

                      Soyadı

                    </label>
                    <div className="form-control-wrap">
                      <input
                        id="soyadi"
                        type="text"
                        className="form-control"
                        {...register('last_name', {
                          required: "Lütfen boş bıraklın alanları doldurunuz.",
                        })}
                        placeholder="Soyadı"
                        value={formData.last_name}
                        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })} />
                      {errors.last_name && <span className="invalid">{errors.last_name.message}</span>}
                    </div>
                  </div>
                </Col>
                <Col size="6">
                  <div className="form-group">
                    <label htmlFor="unvan" className="form-label text-soft">

                      Ünvan

                    </label>
                    <div className="form-control-wrap">
                      <input
                        id="unvan"
                        type="text"
                        className="form-control"
                        placeholder="Ünvan"
                        value={formData.job_title}
                        onChange={(e) => setFormData({ ...formData, job_title: e.target.value })} />


                    </div>
                  </div>
                </Col>
                <Col size="6">
                  <div className="form-group">
                    <label htmlFor="mail" className="form-label text-soft">

                      Email Adresi

                    </label>
                    <div className="form-control-wrap">
                      <input
                        id="mail"
                        type="text"
                        className="form-control"
                        {...register('email', {
                          required: "Lütfen boş bıraklın alanları doldurunuz.",
                        })}
                        placeholder="Email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                      {errors.email && <span className="invalid">{errors.email.message}</span>}
                    </div>
                  </div>
                </Col>
                <Col size="6">
                  <div className="form-group">
                    <label htmlFor="telefon" className="form-label text-soft">

                      Telefon No

                    </label>

                    <div className="form-control-wrap">
                      <input
                        type="text"
                        className="form-control"
                        id="telefon"

                        placeholder="Telefon No"

                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />

                    </div>
                  </div>
                </Col>
                <Col size="6">
                  <div className="form-group">
                    <label htmlFor="dogumTarihi" className="form-label text-soft">

                      Doğum Tarihi

                    </label>

                    <div className="form-control-wrap">
                      <DatePicker
                        id="dogumTarihi"
                        onChange={(e) => setFormData({ ...formData, birthday: e })}
                        selected={formData.birthday}
                        className="form-control"
                        placeholderText="Doğum Tarihi"

                      />
                    </div>
                  </div>
                </Col>
                <Col size="6">
                  <div className="form-group">
                    <label htmlFor="website" className="form-label text-soft">

                      Website

                    </label>

                    <div className="form-control-wrap">
                      <input
                        type="text"
                        className="form-control"
                        id="website"

                        placeholder="Website"

                        onChange={(e) => setFormData({ ...formData, website: e.target.value })} />

                    </div>
                  </div>
                </Col>
                <BlockDes>
                  <h6 className="mt-3">

                    Kategorilendirme
                  </h6>
                </BlockDes>
                <Col size="6">
                  <div className="form-group">
                    <label className="form-label text-soft">

                      Departman

                    </label>

                    <div className="form-control-wrap">
                      <RSelect
                        name="tag"
                        isMulti
                        placeholder="Departman"
                      />
                    </div>
                  </div>
                </Col>
                <Col size="6">
                  <div className="form-group">
                    <label className="form-label text-soft">

                      Temsilci

                    </label>

                    <div className="form-control-wrap">

                      <RSelect
                        name="representative"
                        isMulti
                        placeholder="Temsilci"
                      />

                    </div>
                  </div>
                </Col>
                <Col size="6">
                  <div className="form-group">
                    <label className="form-label text-soft">

                      Kategorii

                    </label>

                    <div className="form-control-wrap">
                      <RSelect
                        name="category"
                        isMulti
                        placeholder="Kategori"
                        options={formattedCategories}
                        onChange={(selectedOptions) => handleCategoryChange(selectedOptions)}
                        value={selectedCategory}

                      />

                    </div>
                  </div>
                </Col>
                <Col size="6">
                  <div className="form-group">
                    <label className="form-label text-soft">

                      Etiket

                    </label>

                    <div className="form-control-wrap">
                      <RSelect
                        name="tag"
                        isMulti
                        placeholder="Etiket"
                        options={formattedTags}
                        onChange={(selectedOptions) => handleTagChange(selectedOptions)}
                        value={selectedTag} />
                    </div>
                  </div>
                </Col>
                <BlockDes>
                  <h6 className="mt-3">

                    Adres Bilgileri
                  </h6>
                </BlockDes>
                <Col size="12">
                  <div className="form-group">
                    <label htmlFor="adres" className="form-label text-soft">

                      Adres

                    </label>

                    <div className="form-control-wrap">
                      <input
                        id="adres"
                        type="text"
                        className="form-control"

                        placeholder="Adres"
                        value={formData.address_line}
                        onChange={(e) => setFormData({ ...formData, address_line: e.target.value })} />

                    </div>
                  </div>
                </Col>
                <Col size="6">
                  <div className="form-group">
                    <label className="form-label text-soft">

                      Şehir

                    </label>

                    <div className="form-control-wrap">
                      <RSelect
                        name="category"
                        isMulti
                        placeholder="Şehir"

                      />

                    </div>
                  </div>
                </Col>
                <Col size="6">
                  <div className="form-group">
                    <label className="form-label text-soft">

                      İlçe

                    </label>

                    <div className="form-control-wrap">
                      <RSelect
                        name="category"
                        isMulti
                        placeholder="İlçe"

                      />

                    </div>
                  </div>
                </Col>
                <Col size="6">
                  <div className="form-group">
                    <label className="form-label text-soft">

                      Ülke

                    </label>

                    <div className="form-control-wrap">
                      <RSelect
                        name="category"
                        isMulti
                        placeholder="Ülke"

                      />

                    </div>
                  </div>
                </Col>
                <Col size="12">
                  <div className="flex justify-end">

                    <Button type="button" onClick={() => onFormCancel()} className="btn btn-outline-primary me-2">

                      <span>Vazgeç</span>
                    </Button>
                    <Button color="primary" type="submit">
                      <span>Kaydet</span>
                    </Button>

                  </div>
                </Col>
              </Row>
            </form>
          </Block>
        </SimpleBar>

        {view.add && <div className="toggle-overlay" onClick={toggle}></div>}
      </Content>
    </>
  );
};
export default UserListRegularPage;
