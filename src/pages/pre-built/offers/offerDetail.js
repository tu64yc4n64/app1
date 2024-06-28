import React, { useEffect, useState } from "react";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import {
    DropdownItem,
    UncontrolledDropdown,
    DropdownMenu,
    DropdownToggle,
    CardBody,
    CardTitle,
    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane,
    Card,
    CardSubtitle,
    CardText,
    ButtonGroup
} from "reactstrap";
import classnames from 'classnames';
import DatePicker from "react-datepicker";
import { useForm } from "react-hook-form";
import AddMeetModal from "./AddMeetModal";
import EditMeetModal from "./EditMeetModal";
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
const BASE_URL = "https://tiosone.com/sales/api/";

const OfferDetailsPage = () => {
    const [activeTab, setActiveTab] = useState('1');

    const toggleTab = (tab) => {
        if (activeTab !== tab) setActiveTab(tab);
    };
    let { offerId } = useParams();

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

    const getOffer = async () => {
        let accessToken = localStorage.getItem('accessToken');

        try {
            const response = await axios.get(BASE_URL + `offers/${offerId}`, {
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
                        const response = await axios.get(BASE_URL + `offers/${offerId}`, {
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


    useEffect(() => {
        getOffer();
    }, [offerId]);

    const getAllTags = async () => {
        let accessToken = localStorage.getItem('accessToken');
        try {
            const response = await axios.get(BASE_URL + "tags/?type=offer", {
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
                        const response = await axios.get(BASE_URL + "tags/?type=offer", {
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
    const getAllCategories = async () => {
        let accessToken = localStorage.getItem('accessToken');
        try {
            const response = await axios.get(BASE_URL + "categories/?type=offer", {
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
                        const response = await axios.get(BASE_URL + "categories/?type=offer", {
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${accessToken}`
                            }
                        });
                        setCategories(response.data); // Yeni token ile başarıyla istek yapılırsa state güncellenir.
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
        getAllTags();
        getAllCategories();
    }, []);

    const [data, setData] = useState([]);
    const [user, setUser] = useState([]);
    const [tags, setTags] = useState([]);
    const [categories, setCategories] = useState([]);
    const [originalContactHistory, setOriginalContactHistory] = useState([]);
    const [conversation, setConversation] = useState([]);
    const currentItems = conversation;
    console.log(categories);

    const [sideBar, setSidebar] = useState(false);
    const [itemPerPage, setItemPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [offer, setOffer] = useState();
    console.log(offer);

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
        const id = offerId;
        if (id !== undefined || null || "") {
            let spUser = data;
            setOffer(spUser);
        } else {
            setOffer(data[0]);
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

    const status = [
        {
            label: "Taslak",
            value: "draft"
        },
        {
            label: "Gönderildi",
            value: "sent"
        },
        {
            label: "Kabul Edildi",
            value: "accepted"
        },
        {
            label: "Reddedildi",
            value: "rejected"
        },
        {
            label: "Süresi Doldu",
            value: "expired"
        }]

    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    return (
        <>
            <Head title="User Details - Regular"></Head>
            {offer && (
                <Content>
                    <BlockHead size="sm">
                        <BlockBetween>
                            <BlockHeadContent>
                                <BlockTitle tag="h3" page>
                                    Teklif Başlığı <br />
                                    <div className="d-flex pt-1">
                                        {(() => {
                                            const category = categories.find(cat => cat.id === offer.category);
                                            return (
                                                category ? <span className="badge bg-outline-secondary me-1">{category.name}</span> : <span className="badge bg-outline-secondary me-1">Kategori bulunamadı</span>
                                            );

                                        })()}
                                        <h6 className="">#{offer.id}</h6>
                                    </div>

                                </BlockTitle>
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
                                                <CardTitle tag="h6">Firma Bilgileri</CardTitle>
                                                <div>
                                                    <ul className="user-detail-info-list">
                                                        <li>
                                                            <Icon name="call-alt-fill"></Icon>
                                                            <strong className="ps-3">{offer.phone}</strong>
                                                        </li>
                                                        <li>
                                                            <Icon name="mail-fill"></Icon>
                                                            <strong className="ps-3">{offer.email}</strong>
                                                        </li>
                                                        <li>
                                                            <Icon name="map-pin-fill"></Icon>
                                                            {offer.address_line ? <strong className="ps-3">{offer.address_line}</strong> : <strong className="ps-3">Adres Bilgisi Girilmemiş</strong>}
                                                        </li>


                                                    </ul>
                                                </div>
                                            </CardBody>
                                        </div>
                                        <div className="card-bordered card" style={{ marginBottom: "28px" }} >
                                            <CardBody className="card-inner">
                                                <CardTitle tag="h6">Teklif Hakkında</CardTitle>
                                                <div className="d-flex pb-1">
                                                    <Icon style={{ position: "relative", top: "4px" }} name="user-fill"></Icon>
                                                    <span className="ps-3">{offer.customer_name}</span>
                                                </div>
                                                <div className="d-flex pb-1">
                                                    <Icon style={{ position: "relative", top: "4px" }} name="ticket-fill"></Icon>
                                                    {offer.tags && offer.tags.length > 0 && offer.tags.map((tagId, index) => {
                                                        const tag = tags.find(per => per.id === tagId);
                                                        return tag ? (
                                                            <span style={{ marginLeft: "20px" }} className="badge bg-outline-secondary me-1" key={index}>
                                                                {tag.name}
                                                            </span>
                                                        ) : null;
                                                    })}
                                                </div>
                                                <div className="d-flex pb-1">
                                                    <Icon style={{ position: "relative", top: "4px" }} name="calender-date-fill"></Icon>
                                                    <span className="ps-3">{offer.created_at} tarihinde oluşturuldu.</span>
                                                </div>
                                                <div className="d-flex pb-1">
                                                    <Icon style={{ position: "relative", top: "4px" }} name="calender-date-fill"></Icon>
                                                    <span className="ps-3">{offer.updated_at} tarihinde oluşturuldu.</span>
                                                </div>
                                            </CardBody>
                                        </div>
                                    </div>
                                    {sideBar && <div className="toggle-overlay" onClick={() => toggle()}></div>}
                                    <div className="col-md-8">
                                        <div className="card-bordered card">
                                            <ul className="nav nav-tabs nav-tabs-mb-icon nav-tabs-card">
                                                <li className="nav-item">
                                                    <a
                                                        className={`nav-link ${activeTab === '1' ? 'active' : ''}`}
                                                        href="#offers"
                                                        onClick={(ev) => {
                                                            ev.preventDefault();
                                                            toggleTab('1');
                                                        }}
                                                    >
                                                        <Icon name="repeat"></Icon>
                                                        <span>Teklifler</span>
                                                    </a>
                                                </li>
                                                <li className="nav-item">
                                                    <a
                                                        className={`nav-link ${activeTab === '2' ? 'active' : ''}`}
                                                        href="#meetings"
                                                        onClick={(ev) => {
                                                            ev.preventDefault();
                                                            toggleTab('2');
                                                        }}
                                                    >
                                                        <Icon name="user-circle"></Icon>
                                                        <span>Görüşmeler</span>
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

                                            <div className="">
                                                <TabContent activeTab={activeTab}>
                                                    <TabPane tabId="1">
                                                        <Card>
                                                            <CardBody className="card-inner py-2">
                                                                <div className="d-flex justify-content-between align-items-center">

                                                                    <CardTitle className="mb-0" tag="h5">
                                                                        {(() => {
                                                                            const durum = status.find(st => st.value === offer.status);
                                                                            return (
                                                                                <button
                                                                                    className="btn btn-outline-light"
                                                                                    style={{ pointerEvents: 'none', color: 'inherit', backgroundColor: 'inherit' }}
                                                                                >
                                                                                    {durum ? durum.label : ''}
                                                                                </button>
                                                                            );
                                                                        })()}
                                                                    </CardTitle>
                                                                    <CardTitle tag="h5">

                                                                        <Button outline color="secondary">Düzenle</Button>

                                                                        <button
                                                                            className="btn btn-outline-light"
                                                                            style={{ pointerEvents: 'none', color: 'inherit', backgroundColor: 'inherit', paddingLeft: "5px", paddingRight: "5px", marginLeft: "10px" }}
                                                                        >
                                                                            <Icon name="file-pdf"></Icon>

                                                                        </button>
                                                                        <Button style={{ marginLeft: "10px" }} color="dark">İşlemler</Button>
                                                                    </CardTitle>
                                                                </div>

                                                            </CardBody>
                                                            <Card style={{ borderLeft: "none", borderRight: "none" }} className="card-bordered">
                                                                <CardBody className="card-inner d-flex justify-content-between">
                                                                    <div className="w-100">

                                                                        <CardTitle tag="h6">Zenmira AS</CardTitle>

                                                                        <p style={{ width: "50%" }} className="text-muted">
                                                                            Uşak
                                                                        </p>
                                                                    </div>
                                                                    <div className="d-flex flex-column align-items-end w-100">
                                                                        <span className="fw-bold">Kime</span>
                                                                        <CardTitle tag="h6">Sinan Bakış</CardTitle>

                                                                        <p style={{ width: "50%", textAlign: "end" }} className="text-muted">
                                                                            Uşak
                                                                        </p>
                                                                    </div>

                                                                </CardBody>
                                                            </Card>

                                                        </Card>

                                                        <table class="table table-bordered">

                                                            <tbody>
                                                                {currentItems && currentItems.items && currentItems.items.length > 0 ? (
                                                                    currentItems.items.map((item) => (
                                                                        <tr key={item.id}>
                                                                            <th scope="row">{item.name}</th>
                                                                            <td>Mark</td>
                                                                            <td>Otto</td>
                                                                            <td>@mdo</td>
                                                                        </tr>
                                                                    ))
                                                                ) : null}
                                                            </tbody>
                                                        </table>
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
                                                                    <span className="text-silent">Herhangi bir teklif bulunamadı.</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </TabPane>
                                                    <TabPane tabId="2">

                                                        <BlockHeadContent>
                                                            <div className="toggle-wrap nk-block-tools-toggle card-inner">
                                                                <div className="d-md-flex" style={{ "justifyContent": "space-between" }}>
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
                                                                    <span>Oluşturulma T.</span>
                                                                </DataTableRow>
                                                                <DataTableRow size="md">
                                                                    <span>Görüşme Tarihi</span>
                                                                </DataTableRow>
                                                                <DataTableRow>
                                                                    <span>Görüşme Türü</span>
                                                                </DataTableRow>
                                                                <DataTableRow size="md">
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
                                                                    <span className="text-silent">Herhangi bir teklif bulunamadı.</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </TabPane>

                                                </TabContent>
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
                        offerId={offerId}
                    />
                </Content>
            )}
        </>
    );
};
export default OfferDetailsPage;
