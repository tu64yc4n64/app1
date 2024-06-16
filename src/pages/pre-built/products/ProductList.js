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
import { Card, DropdownItem, UncontrolledDropdown, DropdownMenu, DropdownToggle, ButtonGroup, Modal, ModalBody, Badge, Label, Input } from "reactstrap";

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


const BASE_URL = "https://tiosone.com/products/api/"

const UserListRegularPage = () => {

  let accessToken = localStorage.getItem('accessToken');

  const getAllCategories = async () => {
    try {
      const response = await axios.get(BASE_URL + "categories?type=person", {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        }
      });;
      setCategories(response.data);
    } catch (error) {
      console.error("There was an error fetching the data!", error);
    }
  };
  const getAllTags = async () => {
    try {
      const response = await axios.get(BASE_URL + "tags?type=person", {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        }
      });;
      setTags(response.data);
    } catch (error) {
      console.error("There was an error fetching the data!", error);
    }
  };

  const [data, setData] = useState([]);
  console.log(data)
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

  const getAllProducts = async () => {
    let accessToken = localStorage.getItem('accessToken');


    try {
      const response = await axios.get(BASE_URL + "products/", {
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
            const response = await axios.get(BASE_URL + "products/", {
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
    getAllProducts()

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
  const handleCategoryChange = (selectedOption) => {
    setSelectedCategory(selectedOption);
  };
  const handleTagChange = (selectedOption) => {
    setSelectedTag(selectedOption);
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
    added_by: "",
    category: [],
    created_at: "",
    description: "",
    name: "",
    product_type: "",
    purchase_price: "",
    sale_price: "",
    tags: [],
    tax_rate: "",
    updated_at: "",
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

    const { description, name, product_type, purchase_price, sale_price } = form;

    let submittedData = {
      // Eklenen gerekli alanlar
      added_by: "admin64",
      category: 5,
      description: description,
      name: name,
      purchase_price: purchase_price,
      sale_price: sale_price,
      tags: [1],
      tax_rate: "20.00",
    };

    try {
      const response = await axios.post(BASE_URL + "products/", submittedData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });
      setData([response.data, ...data]);
      setView({ open: false });

      resetForm();
    } catch (error) {
      if (error.response) {
        // Sunucudan dönen hata
        console.error('Response error data:', error.response.data);
        console.error('Response error status:', error.response.status);
        console.error('Response error headers:', error.response.headers);
      } else if (error.request) {
        // İstek yapıldı ama cevap alınamadı
        console.error('Request error:', error.request);
      } else {
        // İstek yapılmadan önce oluşan hata
        console.error('Error', error.message);
      }
      console.error('Error config:', error.config);
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
          added_by: "admin64",
          category: [],
          created_at: formData.created_at,
          description: formData.description,
          name: formData.name,
          product_type: formData.product_type,
          purchase_price: formData.purchase_price,
          sale_price: formData.sale_price,
          tags: [],
          tax_rate: formData.tax_rate,
          updated_at: formData.updated_at,
        };
      }
    });

    try {
      const response = await axios.put(`${BASE_URL}products/${editId}`, submittedData, {
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
          added_by: "admin64",
          category: [],
          created_at: item.created_at,
          description: item.description,
          name: item.name,
          product_type: item.product_type,
          purchase_price: item.purchase_price,
          sale_price: item.sale_price,
          tags: [],
          tax_rate: item.tax_rate,
          updated_at: item.updated_at,

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
      await axios.delete(`${BASE_URL}products/${id}`, {
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
              <BlockTitle>Ürünler</BlockTitle>
              <div className="nk-block-des text-soft"><p>Toplam {currentItems.length} ürün</p></div>

            </BlockHeadContent>

            <BlockHeadContent>
              <div className="toggle-wrap nk-block-tools-toggle">
                <a
                  href="#more"
                  className="btn btn-icon btn-trigger toggle-expand me-n1"
                  onClick={(ev) => {
                    ev.preventDefault();
                    updateSm(!sm);
                  }}
                >
                  <Icon name="more-v"></Icon>
                </a>
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
                        Yeni Ürün Ekle
                      </Button>
                      <Button
                        className="toggle d-none d-md-inline-flex"
                        color="primary"
                        onClick={() => {
                          toggle("add");
                        }}
                      >

                        <span>Yeni Ürün Ekle</span>
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
                placeholder="Ürünlerde ara..."
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
                        <span>Türü</span>
                      </DataTableRow>
                      <DataTableRow size="md">
                        <span>Ürün Adı</span>
                      </DataTableRow>
                      <DataTableRow>
                        <span>Açıklama</span>
                      </DataTableRow>
                      <DataTableRow size="md">
                        <span>Kategori</span>
                      </DataTableRow>
                      <DataTableRow size="md">
                        <span>Etiket</span>
                      </DataTableRow>
                      <DataTableRow size="md">
                        <span>Alış Fiyatı</span>
                      </DataTableRow>
                      <DataTableRow size="md">
                        <span>Satış Fiyatı</span>
                      </DataTableRow>
                      <DataTableRow size="md">
                        <span>O. Tarihi</span>
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

                              <span className="badge bg-outline-secondary me-1">
                                {item.product_type}
                              </span>

                            </DataTableRow>
                            <DataTableRow>
                              <Link to={`${process.env.PUBLIC_URL}/user-details-regular/${item.id}`}>
                                <span className="tb-product" style={{ flexDirection: "column", display: "flex", alignItems: "start" }}>

                                  <span className="title">{item.name}</span>

                                </span>
                              </Link>
                            </DataTableRow>

                            <DataTableRow size="md">
                              <span className="tb-sub">{item.description}</span>
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
                              <span className="tb-sub">{item.purchase_price}</span>
                            </DataTableRow>
                            <DataTableRow size="md">
                              <span className="tb-sub">{item.sale_price}</span>
                            </DataTableRow>
                            <DataTableRow size="md">
                              <span className="tb-sub">Oluşturma Tarihi</span>
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
                                            <span>Ürünü Düzenle</span>
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
                                            <span>Ürünü Görüntüle</span>
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
                                            <span>Ürünü Sil</span>
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
                        <label className="form-label" htmlFor="regular-price">
                          Türü
                        </label>
                        <div className="form-control-wrap">
                          <input
                            type="text"
                            className="form-control"

                            value={formData.product_type}
                            onChange={(e) => setFormData({ ...formData, product_type: e.target.value })} />

                        </div>
                      </div>
                    </Col>
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="regular-price">
                          Ürün Adı
                        </label>
                        <div className="form-control-wrap">
                          <input
                            type="text"
                            className="form-control"
                            {...register('name', {
                              required: "Lütfen alanları boş bırakmayınız",
                            })}
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                          {errors.name && <span className="invalid">{errors.name.message}</span>}
                        </div>
                      </div>
                    </Col>
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="regular-price">
                          Açıklama
                        </label>
                        <div className="form-control-wrap">
                          <input
                            type="text"
                            className="form-control"

                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })} />

                        </div>
                      </div>
                    </Col>
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="regular-price">
                          Alış Fiyatı
                        </label>
                        <div className="form-control-wrap">
                          <input
                            type="text"
                            className="form-control"

                            value={formData.purchase_price}
                            onChange={(e) => setFormData({ ...formData, purchase_price: e.target.value })} />

                        </div>
                      </div>
                    </Col>
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="regular-price">
                          Satış Fiyatı
                        </label>
                        <div className="form-control-wrap">
                          <input
                            type="text"
                            className="form-control"

                            value={formData.sale_price}
                            onChange={(e) => setFormData({ ...formData, sale_price: e.target.value })} />

                        </div>
                      </div>
                    </Col>


                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="category">
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
                        <label className="form-label" htmlFor="category">
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




                    <Col size="12">
                      <Button color="primary" type="submit">

                        <span>Ürünü Güncelle</span>
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
                Ürün Bilgileri <small className="text-primary"></small>
              </h4>

            </div>
            <div className="nk-tnx-details mt-sm-3">
              <Row className="gy-3">
                <Col lg={4}>
                  <span className="sub-text">Türü</span>
                  <span className="caption-text">{formData.product_type}</span>
                </Col>
                <Col lg={4}>
                  <span className="sub-text">Ürün Adı</span>
                  <span className="caption-text">{formData.name}</span>
                </Col>
                <Col lg={4}>
                  <span className="sub-text">Açıklama</span>
                  <span className="caption-text">{formData.description}</span>
                </Col>
                <Col lg={4}>
                  <span className="sub-text">Kategori</span>
                  <span className="caption-text"></span>
                </Col>
                <Col lg={4}>
                  <span className="sub-text">Etiket</span>
                  <span className="caption-text"></span>
                </Col>
                <Col lg={4}>
                  <span className="sub-text">Alış Fiyatı</span>
                  <span className="caption-text">{formData.purchase_price}</span>
                </Col>
                <Col lg={4}>
                  <span className="sub-text">Satış Fiyatı</span>
                  <span className="caption-text">{formData.sale_price}</span>
                </Col>
                <Col lg={4}>
                  <span className="sub-text">Vergi</span>
                  <span className="caption-text">{formData.tax_rate}</span>
                </Col>
                <Col lg={4}>
                  <span className="sub-text">Oluşturulma Tarihi</span>
                  <span className="caption-text">{formData.created_at}</span>
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
              <BlockTitle tag="h5">Yeni Ürün Ekle</BlockTitle>
              <BlockDes>
                <p>Envanterinize Yeni Ürün Ekleyin</p>
              </BlockDes>
            </BlockHeadContent>
          </BlockHead>
          <Block>
            <form onSubmit={handleSubmit(onFormSubmit)}>
              <Row className="g-3">
                <Col size="12">
                  <div className="form-group">
                    <label htmlFor="urun-adi" className="form-label text-soft">

                      Ürün Adı

                    </label>
                    <div className="form-control-wrap">
                      <Input
                        type="text"
                        id="urun-adi"
                        className="form-control"
                        {...register('name', {
                          required: "Lütfen boş bıraklın alanları doldurunuz.",
                        })}
                        placeholder="Ürün Adı"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                      {errors.name && <span className="invalid">{errors.name.message}</span>}
                    </div>
                  </div>
                </Col>
                <Col size="12">
                  <div className="form-group">
                    <label htmlFor="aciklama" className="form-label text-soft">

                      Açıklama

                    </label>
                    <div className="form-control-wrap">
                      <textarea
                        type="text"
                        id="aciklama"
                        className="form-control"

                        placeholder="Açıklama"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })} />

                    </div>
                  </div>
                </Col>
                <Col size="6">
                  <div className="form-group">
                    <label className="form-label text-soft">

                      Kategori

                    </label>
                    <div className="form-control-wrap">
                      <RSelect
                        name="category"
                        isMulti
                        placeholder="Kategori"
                        options={formattedCategories}
                        onChange={(selectedOption) => handleCategoryChange(selectedOption)}
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
                        onChange={(selectedOption) => handleTagChange(selectedOption)}
                        value={selectedTag} />
                    </div>
                  </div>
                </Col>
                <BlockDes>
                  <h6 className="mt-3">

                    Fiyatlandırma
                  </h6>
                </BlockDes>



                <Col size="6">
                  <div className="form-group">
                    <label htmlFor="alis" className="form-label text-soft">

                      Alış Fiyatı (KDV Dahil)

                    </label>
                    <div className="form-control-wrap">
                      <input
                        type="text"
                        className="form-control"
                        id="alis"
                        {...register('purchase_price', {
                          required: "Lütfen boş bıraklın alanları doldurunuz.",
                        })}
                        placeholder="Alış Fiyatı (KDV Dahil)"
                        value={formData.purchase_price}
                        onChange={(e) => setFormData({ ...formData, purchase_price: e.target.value })} />
                      {errors.purchase_price && <span className="invalid">{errors.purchase_price.message}</span>}
                    </div>
                  </div>
                </Col>
                <Col size="6">
                  <div className="form-group">
                    <label htmlFor="satis" className="form-label text-soft">

                      Satış Fiyatı (KDV Dahil)

                    </label>
                    <div className="form-control-wrap">
                      <input
                        type="text"
                        className="form-control"
                        id="satis"
                        {...register('sale_price', {
                          required: "Lütfen boş bıraklın alanları doldurunuz.",
                        })}
                        placeholder="Satış Fiyatı (KDV Dahil)"
                        value={formData.sale_price}
                        onChange={(e) => setFormData({ ...formData, sale_price: e.target.value })} />
                      {errors.sale_price && <span className="invalid">{errors.sale_price.message}</span>}
                    </div>
                  </div>
                </Col>
                <Col size="6">
                  <div className="form-group">
                    <label className="form-label text-soft">

                      KDV Oranı

                    </label>
                    <div className="form-control-wrap">
                      <RSelect
                        name="category"
                        isMulti
                        placeholder="KDV Oranı"
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
