import React, { useEffect, useState } from "react";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import ProductH from "../../../images/avatar/a-sm.jpg"
import { DropdownItem, UncontrolledDropdown, DropdownMenu, DropdownToggle, CardBody, CardTitle } from "reactstrap";
import AddMeetModal from "./AddMeetModal";
import { meetings } from "./meetingData";
import {
    Button,
    Block,
    BlockBetween,

    BlockHead,
    BlockHeadContent,
    BlockTitle,
    Icon,
    DataTableBody,
    DataTableHead,
    DataTableRow,
    DataTableItem, PaginationComponent

} from "../../../components/Component";

import { useNavigate, useParams } from "react-router-dom";

import axios from "axios";

const BASE_URL = "https://tiosone.com/customers/api/"

const OfferDetailPage = () => {
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

    const getAllUsers = async () => {
        let accessToken = localStorage.getItem('accessToken');


        try {
            const response = await axios.get(BASE_URL + `persons/${offerId}`, {
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
                        const response = await axios.get(BASE_URL + "persons/", {
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
        getAllUsers()

    }, [offerId])

    const [conversation, setConversation] = useState(meetings);
    const currentItems = conversation
    const [data, setData] = useState();
    console.log(data)

    const [sideBar, setSidebar] = useState(false);
    const [itemPerPage, setItemPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [user, setUser] = useState();


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
    const resetForm = () => {
        setFormData({
            name: "",
            email: "",
            balance: 0,
            phone: "",
            status: "Active",
        });
    };
    const closeModal = () => {
        setModal({ add: false })
        resetForm();
    };




    // grabs the id of the url and loads the corresponding data
    useEffect(() => {
        const id = offerId;
        if (id !== undefined || null || "") {
            let spUser = data;
            setUser(spUser);
        } else {
            setUser(data[0]);
        }
    }, [data]);

    // function to toggle sidebar
    const toggle = () => {
        setSidebar(!sideBar);
    };

    useEffect(() => {
        sideBar ? document.body.classList.add("toggle-shown") : document.body.classList.remove("toggle-shown");
    }, [sideBar])

    const [onSearchText, setSearchText] = useState("");
    useEffect(() => {
        if (onSearchText !== "") {
            const filteredObject = meetings.filter((item) => {
                return item.date.toLowerCase().includes(onSearchText.toLowerCase());
            });
            setConversation([...filteredObject]);
        } else {
            setConversation([...meetings]);
        }
    }, [onSearchText]);
    const onFilterChange = (e) => {
        setSearchText(e.target.value);
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);



    return (
        <>
            <Head title="User Details - Regular"></Head>
            {user && (
                <Content>
                    <BlockHead size="sm">
                        <BlockBetween>
                            <BlockHeadContent>
                                <BlockTitle tag="h3" page>
                                    Kişiler / <strong className=" small">{user.first_name} {user.last_name}</strong>

                                </BlockTitle>
                                <span className="badge bg-outline-secondary">{user.category}</span>

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
                                                            <strong className="ps-3">{user.phone}</strong>
                                                        </li>
                                                        <li>
                                                            <Icon name="mail-fill"></Icon>
                                                            <strong className="ps-3">{user.email}</strong>
                                                        </li>
                                                        <li>
                                                            <Icon name="user-fill"></Icon>
                                                            {user.customer_representatives.map((representative, id) => (
                                                                <strong key={id

                                                                } className="ps-3" >{representative.name}</strong>
                                                            ))}
                                                        </li>
                                                        <li>
                                                            <Icon name="ticket-fill"></Icon>
                                                            {user.tags.map((tag, id) => (
                                                                <strong key={id} className="ps-3">
                                                                    <span className="badge bg-outline-secondary">
                                                                        {tag.value}
                                                                    </span>
                                                                </strong>
                                                            ))}
                                                        </li>
                                                        <li>
                                                            <Icon name="calender-date-fill"></Icon>
                                                            <strong className="ps-3"> tarihinde oluşturuldu.</strong>
                                                        </li>
                                                        <li>
                                                            <Icon name="calender-date-fill"></Icon>
                                                            <strong className="ps-3"> tarihinde düzenlendi.</strong>
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
                                                    <span>{user.address_line}</span>
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

                                                                        <span className="tb-product" style={{ flexDirection: "column", display: "flex", alignItems: "start" }}>

                                                                            <span className="title">{item.date}</span>

                                                                        </span>

                                                                    </DataTableRow>

                                                                    <DataTableRow size="md">
                                                                        <span className="badge bg-outline-secondary">{item.type}</span>
                                                                    </DataTableRow>
                                                                    <DataTableRow>
                                                                        <span className="tb-sub">{item.notice}</span>
                                                                    </DataTableRow>
                                                                    <DataTableRow size="md">
                                                                        <img style={{ borderRadius: "50%", width: "25px" }} src={ProductH} alt="product" className="thumb" />
                                                                        <span style={{ paddingLeft: "5px" }} className="tb-sub">{item.representative.name}</span>
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

                                                                                                >
                                                                                                    <Icon name="edit"></Icon>
                                                                                                    <span>Görüşmeyi Düzenle</span>
                                                                                                </DropdownItem>
                                                                                            </li>
                                                                                            <li>
                                                                                                <DropdownItem
                                                                                                    tag="a"
                                                                                                    href="#view"

                                                                                                >
                                                                                                    <Icon name="eye"></Icon>
                                                                                                    <span>Görüşmeyi Görüntüle</span>
                                                                                                </DropdownItem>
                                                                                            </li>
                                                                                            <li>
                                                                                                <DropdownItem
                                                                                                    tag="a"
                                                                                                    href="#remove"

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

                                    </div>




                                </div>
                            </div>
                        </div>

                    </Block >
                    <AddMeetModal modal={modal.add} closeModal={closeModal} />
                </Content >

            )}
        </>
    );
};
export default OfferDetailPage;
