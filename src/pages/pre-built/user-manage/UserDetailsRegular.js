import React, { useEffect, useState } from "react";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import { DropdownItem, UncontrolledDropdown, DropdownMenu, DropdownToggle, CardBody, CardTitle } from "reactstrap";
import DatePicker from "react-datepicker";
import { useForm } from "react-hook-form";
import AddMeetModal from "./AddMeetModal";
import EditMeetModal from "./EditMeetModal"; // Yeni bileşeni ekle
import ContactDetailsModal from './ContactDetailsModal';


import {
  Block,
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
  RSelect
} from "../../../components/Component";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const BASE_URL = "https://tiosone.com/customers/api/";

const PersonDetailsPage = () => {
  let { userId } = useParams();

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

  const getPerson = async () => {
    let accessToken = localStorage.getItem('accessToken');

    try {
      const response = await axios.get(BASE_URL + `persons/${userId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });
      setData(response.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        accessToken = await refreshAccessToken();
        if (accessToken) {
          try {
            const response = await axios.get(BASE_URL + `persons/${userId}`, {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
              }
            });
            setData(response.data);
          } catch (retryError) {
            console.error("Retry error after refreshing token", retryError);
          }
        }
      } else {
        console.error("There was an error fetching the data!", error);
      }
    }
  };

  const getPersonContactHistory = async () => {
    let accessToken = localStorage.getItem('accessToken');

    try {
      const response = await axios.get(BASE_URL + `contact_histories?person=${userId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });
      setConversation(response.data);
      setOriginalContactHistory(response.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        accessToken = await refreshAccessToken();
        if (accessToken) {
          try {
            const response = await axios.get(BASE_URL + `contact_histories?person=${userId}`, {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
              }
            });
            setConversation(response.data);
            setOriginalContactHistory(response.data);
          } catch (retryError) {
            console.error("Retry error after refreshing token", retryError);
          }
        }
      } else {
        console.error("There was an error fetching the data!", error);
      }
    }
  };

  const contactType = [
    { value: "phone", label: "Telefon" },
    { value: "email", label: "Email" },
    { value: "face", label: "Yüz Yüze" },
    { value: "social_media", label: "Sosyal Medya" },
    { value: "other", label: "Diğer" },
  ];

  useEffect(() => {
    getPerson();
    getPersonContactHistory();
  }, [userId]);

  const getAllUsers = async () => {
    let accessToken = localStorage.getItem('accessToken');

    try {
      const response = await axios.get("https://tiosone.com/users/api/users/", {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });
      setUser(response.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        accessToken = await refreshAccessToken();
        if (accessToken) {
          try {
            const response = await axios.get("https://tiosone.com/users/api/users/", {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
              }
            });
            setUser(response.data);
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
        } else {
          window.location.href = '/auth-login';
        }
      } else {
        console.error("There was an error fetching the data!", error);
      }
    }
  };

  useEffect(() => {
    getAllUsers();
    getAllTags();
  }, []);

  const [data, setData] = useState([]);
  const [user, setUser] = useState([]);
  const [tags, setTags] = useState([]);
  const [originalContactHistory, setOriginalContactHistory] = useState([]);
  const [conversation, setConversation] = useState([]);
  const currentItems = conversation;
  console.log(conversation);

  const [sideBar, setSidebar] = useState(false);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [person, setPerson] = useState();
  console.log(person);

  const [modal, setModal] = useState({
    edit: false,
    add: false,
  });
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    date: "",
    type: "",
    notice: 0,
  });
  const [editId, setEditedId] = useState();
  const [view, setView] = useState({
    edit: false,
    add: false,
    details: false,
  });
  const resetForm = () => {
    setFormData({
      date: "",
      contact_type: "",
      content: "",
    });
  };
  const closeModal = () => {
    setModal({ add: false, edit: false });
    resetForm();
  };

  const onEditClick = (id) => {
    conversation.forEach((item) => {
      if (item.id === id) {
        setFormData({
          date: item.date,
          contact_type: item.contact_type,
          content: item.content,
        });
      }
    });
    setEditedId(id);
    setView({ add: false, edit: true });
  };

  useEffect(() => {
    const id = userId;
    if (id !== undefined || null || "") {
      let spUser = data;
      setPerson(spUser);
    } else {
      setPerson(data[0]);
    }
  }, [data]);

  useEffect(() => {
    sideBar ? document.body.classList.add("toggle-shown") : document.body.classList.remove("toggle-shown");
  }, [sideBar]);

  const [onSearchText, setSearchText] = useState("");
  useEffect(() => {
    if (onSearchText !== "") {
      const filteredObject = conversation.filter((item) => {
        return item.content.toLowerCase().includes(onSearchText.toLowerCase());
      });
      setConversation([...filteredObject]);
    } else {
      setConversation([...originalContactHistory]);
    }
  }, [onSearchText]);

  const onFilterChange = (e) => {
    setSearchText(e.target.value);
  };

  const deleteContactHistory = async (id) => {
    let accessToken = localStorage.getItem('accessToken');

    try {
      await axios.delete(BASE_URL + `contact_histories/${id}`, {
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      let updatedData = conversation.filter((item) => item.id !== id);
      setConversation(updatedData);
      setOriginalContactHistory(updatedData);
    } catch (error) {
      console.error("There was an error deleting the product!", error);
    }
  };

  const onFormCancel = () => {
    setView({ edit: false, add: false, details: false });
    resetForm();
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const [onSearch, setonSearch] = useState(true);
  const toggle = (type) => {
    setView({
      edit: type === "edit" ? true : false,
      add: type === "add" ? true : false,
      details: type === "details" ? true : false,
    });
    setonSearch(!onSearch);
  };

  const addContactHistory = (newContact) => {
    setConversation(prevConversation => [newContact, ...prevConversation]);
    setOriginalContactHistory(prevOriginalContactHistory => [newContact, ...prevOriginalContactHistory]);
  };

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  return (
    <>
      <Head title="User Details - Regular"></Head>
      {person && (
        <Content>
          <BlockHead size="sm">
            <BlockBetween>
              <BlockHeadContent>
                <BlockTitle tag="h3" page>
                  Kişiler / <strong className=" small">{person.first_name} {person.last_name}</strong>
                </BlockTitle>
                <span className="badge bg-outline-secondary">{person.category}</span>
              </BlockHeadContent>
              <BlockHeadContent>
                <Button
                  color="light"
                  outline
                  className="bg-white d-none d-sm-inline-flex"
                  onClick={() => navigate(-1)}
                >
                  <Icon name="arrow-left"></Icon>
                  <span>Geri</span>
                </Button>
                <a
                  href="#back"
                  onClick={(ev) => {
                    ev.preventDefault();
                    navigate(-1);
                  }}
                  className="btn btn-icon btn-outline-light bg-white d-inline-flex d-sm-none"
                >
                  <Icon name="arrow-left"></Icon>
                </a>
              </BlockHeadContent>
            </BlockBetween>
          </BlockHead>
          <Block>
            <div>
              <div id="user-detail-block">
                <div className="row">
                  <div className="col-md-4">
                    <div className="card-bordered card" >
                      <CardBody className="card-inner">
                        <CardTitle tag="h6">Kişi Bilgileri</CardTitle>
                        <div>
                          <ul className="user-detail-info-list">
                            <li>
                              <Icon name="call-alt-fill"></Icon>
                              <strong className="ps-3">{person.phone}</strong>
                            </li>
                            <li>
                              <Icon name="mail-fill"></Icon>
                              <strong className="ps-3">{person.email}</strong>
                            </li>
                            <li>
                              <Icon name="user-fill"></Icon>
                              {person.customer_representatives && person.customer_representatives.length > 0 && person.customer_representatives.map((representativeId, index) => {
                                const representative = user.find(u => u.id === representativeId);
                                return representative ? (
                                  <strong key={index} className="ps-3">
                                    {representative.username}
                                  </strong>
                                ) : null;
                              })}
                            </li>
                            <li>
                              <Icon name="ticket-fill"></Icon>
                              {person.tags && person.tags.length > 0 && person.tags.map((tagId, index) => {
                                const tag = tags.find(per => per.id === tagId);
                                return tag ? (
                                  <strong key={index} className="ps-3">
                                    {tag.name}
                                  </strong>
                                ) : null;
                              })}
                            </li>
                            <li>
                              <Icon name="calender-date-fill"></Icon>
                              <strong className="ps-3">{person.created_at} tarihinde oluşturuldu.</strong>
                            </li>
                            <li>
                              <Icon name="calender-date-fill"></Icon>
                              <strong className="ps-3">{person.updated_at} tarihinde düzenlendi.</strong>
                            </li>
                          </ul>
                        </div>
                      </CardBody>
                    </div>
                    <div className="card-bordered card" style={{ marginBottom: "28px" }} >
                      <CardBody className="card-inner">
                        <CardTitle tag="h6">Adres</CardTitle>
                        <div className="d-flex">
                          <Icon style={{ position: "relative", top: "4px" }} name="map-pin-fill"></Icon>
                          {person.address_line ? <span>{person.address_line}</span> : <span>Adres Bilgisi Girilmemiş</span>}
                        </div>
                      </CardBody>
                    </div>
                  </div>
                  {sideBar && <div className="toggle-overlay" onClick={() => toggle()}></div>}
                  <div className="col-md-8">
                    <div className="card-bordered card" >
                      <ul className="nav nav-tabs nav-tabs-mb-icon nav-tabs-card">
                        <li className="nav-item">
                          <a
                            className="nav-link active"
                            href="#personal"
                            onClick={(ev) => {
                              ev.preventDefault();
                            }}
                          >
                            <Icon name="user-circle"></Icon>
                            <span>Görüşmeler</span>
                          </a>
                        </li>
                        <li className="nav-item">
                          <a
                            className="nav-link disabled"
                            href="#transactions"
                            onClick={(ev) => {
                              ev.preventDefault();
                            }}
                          >
                            <Icon name="repeat"></Icon>
                            <span>Teklifler</span>
                          </a>
                        </li>
                        <li className="nav-item">
                          <a
                            className="nav-link disabled"
                            href="#documents"
                            onClick={(ev) => {
                              ev.preventDefault();
                            }}
                          >
                            <Icon name="file-text"></Icon>
                            <span>Notlar</span>
                          </a>
                        </li>
                        <li className="nav-item">
                          <a
                            className="nav-link disabled"
                            href="#notifications"
                            onClick={(ev) => {
                              ev.preventDefault();
                            }}
                          >
                            <Icon name="file-text"></Icon>
                            <span>Dökümanlar</span>
                          </a>
                        </li>
                        <li className="nav-item">
                          <a
                            className="nav-link disabled"
                            href="#activities"
                            onClick={(ev) => {
                              ev.preventDefault();
                            }}
                          >
                            <Icon name="bell"></Icon>
                            <span>Hatırlatıcılar</span>
                          </a>
                        </li>
                      </ul>
                      <div className="card-inner">
                        <BlockHeadContent>
                          <div className="toggle-wrap nk-block-tools-toggle">
                            <div className="pb-4 d-md-flex" style={{ "justifyContent": "space-between" }}>
                              <ul className="nk-block-tools g-3">
                                <li>
                                  <div className="form-control-wrap">
                                    <div className="form-icon form-icon-left">
                                      <Icon name="search"></Icon>
                                    </div>
                                    <input
                                      type="text"
                                      className="form-control"
                                      id="default-04"
                                      placeholder="Görüşmelerde Ara"
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
                                      Tür
                                    </DropdownToggle>
                                    <DropdownMenu>
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
                                      Tarih
                                    </DropdownToggle>
                                    <DropdownMenu>
                                      <ul className="link-list-opt no-bdr">
                                      </ul>
                                    </DropdownMenu>
                                  </UncontrolledDropdown>
                                </li>
                              </ul>
                              <div className="nk-block-tools-opt d-md-block d-flex justify-content-end">
                                <Button
                                  className="toggle d-md-none"
                                  color="primary"
                                  onClick={() => setModal({ add: true })}
                                >
                                  <Icon name="plus"></Icon>
                                  <span>Görüşme Ekle</span>
                                </Button>
                                <Button
                                  className="toggle d-none d-md-inline-flex"
                                  color="primary"
                                  onClick={() => setModal({ add: true })}
                                >
                                  <Icon name="plus"></Icon>
                                  <span>Görüşme Ekle</span>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </BlockHeadContent>
                        <DataTableBody>
                          <DataTableHead>
                            <DataTableRow className="nk-tb-col-check">
                              <div className="custom-control custom-control-sm custom-checkbox notext">
                                <input
                                  type="checkbox"
                                  className="custom-control-input"
                                  id="uid_1"
                                />
                                <label className="custom-control-label" htmlFor="uid_1"></label>
                              </div>
                            </DataTableRow>
                            <DataTableRow >
                              <span>Tarih</span>
                            </DataTableRow>
                            <DataTableRow size="md">
                              <span>Görüşme Türü</span>
                            </DataTableRow>
                            <DataTableRow>
                              <span>Notlar</span>
                            </DataTableRow>
                            <DataTableRow size="md">
                              <span>Temsilci</span>
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
                            ? currentItems.map((item) => {
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
                                      />
                                      <label className="custom-control-label" htmlFor={item.id + "uid1"}></label>
                                    </div>
                                  </DataTableRow>
                                  <DataTableRow>
                                    <span className="tb-sub">{item.date}</span>
                                  </DataTableRow>
                                  <DataTableRow size="md">
                                    {item.contact_type && (
                                      <span className="badge bg-outline-secondary me-1">
                                        {contactType.find(cat => cat.value === item.contact_type)?.label}
                                      </span>
                                    )}
                                  </DataTableRow>

                                  <DataTableRow>
                                    <span className="tb-sub">{item.content}</span>
                                  </DataTableRow>
                                  <DataTableRow size="md">
                                    <span style={{ paddingLeft: "5px" }} className="tb-sub">{item.added_by}</span>
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
                                                  <span>Görüşmeyi Düzenle</span>
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
                                                  <span>Görüşmeyi Görüntüle</span>
                                                </DropdownItem>
                                              </li>
                                              <li>
                                                <DropdownItem
                                                  tag="a"
                                                  href="#remove"
                                                  onClick={(ev) => {
                                                    ev.preventDefault();
                                                    deleteContactHistory(item.id);
                                                  }}
                                                >
                                                  <Icon name="trash"></Icon>
                                                  <span>Görüşmeyi Sil</span>
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
                          {conversation.length > 0 ? (
                            <PaginationComponent
                              itemPerPage={itemPerPage}
                              totalItems={conversation.length}
                              paginate={paginate}
                              currentPage={currentPage}
                            />
                          ) : (
                            <div className="text-center">
                              <span className="text-silent">Herhangi bir görüşme bulunamadı.</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Block>
          <ContactDetailsModal
            view={view}
            onFormCancel={onFormCancel}
            formData={formData}
          />
          <EditMeetModal
            modal={view.edit}
            closeModal={onFormCancel}
            editId={editId}
            formData={formData}
            setFormData={setFormData}
            conversation={conversation}
            setConversation={setConversation}
            setOriginalContactHistory={setOriginalContactHistory}
          />
          <AddMeetModal
            modal={modal.add}
            closeModal={() => setModal({ ...modal, add: false })}
            onSubmit={addContactHistory}
            userId={userId}
          />
        </Content>
      )}
    </>
  );
};
export default PersonDetailsPage;
