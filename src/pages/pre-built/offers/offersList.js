import React, { useState, useEffect } from "react";
import Head from "../../../layout/head/Head";
import Content from "../../../layout/content/Content";
import ProductH from "../../../images/avatar/a-sm.jpg"
import SimpleBar from "simplebar-react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { RSelect } from "../../../components/Component";

import DatePicker from "react-datepicker";
import "./style.css"
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
const BASE_URL = "https://tiosone.com/sales/api/"

const OfferListPage = () => {
    const [data, setData] = useState([]);
    const [originalData, setOriginalData] = useState([]);
    console.log(data);

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

    const getAllOffers = async () => {
        let accessToken = localStorage.getItem('accessToken');
        try {
            const response = await axios.get(BASE_URL + "offers/", {
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
                        const response = await axios.get(BASE_URL + "offers/", {
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
        getAllOffers();
    }, []);

    const [sm, updateSm] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [itemPerPage, setItemPerPage] = useState(10);
    const [onSearch, setonSearch] = useState(true);

    const [formData, setFormData] = useState({
        added_by: 1,
        address: "",
        category: 2,
        city: "",
        company: 1,
        country: "",
        created_at: "",
        created_by: 1,
        customer: "",
        customer_name: "",
        discount: "",
        discount_type: "",
        district: "",
        email: "",
        id: 1,
        items: [],
        offer_date: "",
        phone: "",
        postal_code: "",
        status: "",
        tags: [],
        title: "",
        total: "",
        updated_at: "",
        valid_until: ""
    });
    const [editId, setEditedId] = useState();
    const [view, setView] = useState({
        edit: false,
        add: false,
        details: false,
    });
    const [onSearchText, setSearchText] = useState("");
    const [currentPage, setCurrentPage] = useState(1);


    useEffect(() => {
        view.add ? document.body.classList.add("toggle-shown") : document.body.classList.remove("toggle-shown");
    }, [view.add]);

    useEffect(() => {
        if (onSearchText !== "") {
            const filteredObject = data.filter((item) => {
                return item.title.toLowerCase().includes(onSearchText.toLowerCase());
            });
            setData([...filteredObject]);
        } else {
            setData([...originalData]);
        }
    }, [onSearchText]);

    const onFormCancel = () => {
        setView({ edit: false, add: false, details: false });
        resetForm();
    };

    const resetForm = () => {
        setFormData({
            added_by: 1,
            address: "",
            category: 2,
            city: "",
            company: 1,
            country: "",
            created_at: "",
            created_by: 1,
            customer: "",
            customer_name: "",
            discount: "",
            discount_type: "",
            district: "",
            email: "",
            id: 1,
            items: [],
            offer_date: "",
            phone: "",
            postal_code: "",
            status: "",
            tags: [],
            title: "",
            total: "",
            updated_at: "",
            valid_until: ""
        });
        reset({});
    };

    const onEditSubmit = async () => {
        let accessToken = localStorage.getItem('accessToken');
        let submittedData;
        let newItems = data;
        let index = newItems.findIndex((item) => item.id === editId);

        newItems.forEach((item) => {
            if (item.id === editId) {
                submittedData = {
                    added_by: 1,
                    address: formData.address,
                    category: 2,
                    city: formData.city,
                    company: 1,
                    country: formData.country,
                    created_at: formData.created_at,
                    created_by: 1,
                    customer: "",
                    customer_name: "",
                    discount: formData.discount,
                    discount_type: "",
                    district: formData.district,
                    email: formData.email,
                    id: 1,
                    items: formData.items,
                    offer_date: formData.offer_date,
                    phone: formData.phone,
                    postal_code: formData.postal_code,
                    status: formData.status,
                    tags: [],
                    title: formData.title,
                    total: formData.total,
                    updated_at: formData.updated_at,
                    valid_until: formData.valid_until
                };
            }
        });

        try {
            const response = await axios.put(`${BASE_URL}offers/${editId}`, submittedData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            newItems[index] = response.data;
            setData(newItems);
            resetForm();
            setView({ edit: false, add: false });
        } catch (error) {
            console.error('Veritabanını güncelleme sırasında hata oluştu:', error);
        }
        newItems[index] = submittedData;
        resetForm();
        setView({ edit: false, add: false });
    };

    const onEditClick = (id) => {
        data.forEach((item) => {
            if (item.id === id) {
                setFormData({
                    added_by: 1,
                    address: item.address || "",
                    category: 2,
                    city: item.city || "",
                    company: 1,
                    country: item.country || "",
                    created_at: item.created_at || "",
                    created_by: 1,
                    customer: "",
                    customer_name: "",
                    discount: item.discount || "",
                    discount_type: "",
                    district: item.district || "",
                    email: item.email || "",
                    id: 1,
                    items: item.items.map((item) => item) || [],
                    offer_date: item.offer_date || "",
                    phone: item.phone || "",
                    postal_code: item.postal_code || "",
                    status: item.status || "",
                    tags: [],
                    title: item.title || "",
                    total: item.total || "",
                    updated_at: item.updated_at || "",
                    valid_until: item.valid_until || ""
                });
            }
        });
        setEditedId(id);
        setView({ add: false, edit: true });
    };

    useEffect(() => {
        reset(formData);
    }, [formData]);

    const selectorCheck = (e) => {
        let newData = data.map((item) => {
            item.check = e.currentTarget.checked;
            return item;
        });
        setData([...newData]);
    };

    const onSelectChange = (e, id) => {
        let newData = data;
        let index = newData.findIndex((item) => item.id === id);
        newData[index].check = e.currentTarget.checked;
        setData([...newData]);
    };

    const onFilterChange = (e) => {
        setSearchText(e.target.value);
    };

    const deleteOffer = async (id) => {
        let accessToken = localStorage.getItem('accessToken');

        try {
            await axios.delete(`${BASE_URL}offers/${id}`, {
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

    const selectorDeleteProduct = () => {
        let newData = data.filter((item) => item.check !== true);
        setData([...newData]);
    };

    const toggle = (type) => {
        setView({
            edit: type === "edit" ? true : false,
            add: type === "add" ? true : false,
            details: type === "details" ? true : false,
        });
        setonSearch(!onSearch);
    };



    const indexOfLastItem = currentPage * itemPerPage;
    const indexOfFirstItem = indexOfLastItem - itemPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    return (
        <>
            <Head title="Teklif Sayfası"></Head>
            <Content>
                <BlockHead size="sm">
                    <BlockBetween>
                        <BlockHeadContent>
                            <BlockTitle>Teklifler</BlockTitle>
                            <div className="nk-block-des text-soft"><p>Toplam 450 teklif</p></div>

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

                                            >
                                                <Link style={{ color: "white" }} to={`${process.env.PUBLIC_URL}/teklif-olustur`}>
                                                    Yeni Teklif Oluştur
                                                </Link>

                                            </Button>
                                            <Button
                                                className="toggle d-none d-md-inline-flex"
                                                color="primary"

                                            >


                                                <Link style={{ color: "white" }} to={`${process.env.PUBLIC_URL}/teklif-olustur`}>
                                                    Yeni Teklif Oluştur
                                                </Link>

                                            </Button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </BlockHeadContent>

                    </BlockBetween>

                </BlockHead>
                <ul className="nk-block-tools offers-tools-ul gx-3 d-md-flex d-inline-block" style={{ paddingBottom: "1.75rem" }}>
                    <li>
                        <div className="form-control-wrap">
                            <div className="form-icon form-icon-left">
                                <Icon name="search"></Icon>
                            </div>
                            <input
                                type="text"
                                className="form-control "
                                id="default-04"
                                placeholder="Tekliflerde Ara..."
                                onChange={(e) => onFilterChange(e)}
                            />
                        </div>
                    </li>
                    <li>
                        <div className="form-group">

                            <RSelect placeholder="Tarih" />
                        </div>
                    </li>
                    <li>
                        <div className="form-group">

                            <RSelect placeholder="Kategori" />
                        </div>
                    </li>
                    <li>
                        <div className="form-group">

                            <RSelect placeholder="Etiket" />
                        </div>
                    </li>


                </ul>
                <Block>
                    <DataTable className="card-stretch">
                        <Card className="card-bordered">

                            <div className="card-inner-group">
                                <div className="card-inner p-0">
                                    <DataTableBody>
                                        <DataTableHead>

                                            <DataTableRow >
                                                <span>Teklif No</span>
                                            </DataTableRow>
                                            <DataTableRow>
                                                <span>Başlık</span>
                                            </DataTableRow>
                                            <DataTableRow>
                                                <span>Kime</span>
                                            </DataTableRow>
                                            <DataTableRow size="md">
                                                <span>Toplam</span>
                                            </DataTableRow>
                                            <DataTableRow size="md">
                                                <span>Tarih</span>
                                            </DataTableRow>
                                            <DataTableRow size="md">
                                                <span>Geçerlilik Tarihi</span>
                                            </DataTableRow>
                                            <DataTableRow size="md">
                                                <span>Etiket</span>
                                            </DataTableRow>
                                            <DataTableRow size="md">
                                                <span>Oluşturulma</span>
                                            </DataTableRow>
                                            <DataTableRow size="md">
                                                <span>Durum</span>
                                            </DataTableRow>
                                            <DataTableRow size="md">
                                                <span>Oluşturan</span>
                                            </DataTableRow>

                                            <DataTableRow className="nk-tb-col-tools">
                                                <ul className="nk-tb-actions gx-1 my-n1">
                                                    <li className="me-n1">

                                                    </li>
                                                </ul>
                                            </DataTableRow>
                                        </DataTableHead>
                                        {currentItems.length > 0
                                            ? currentItems.map((item) => {
                                                return (
                                                    <DataTableItem key={item.id}>
                                                        <DataTableRow>
                                                            <Link to={`${process.env.PUBLIC_URL}/teklif-detay/${item.id}`}>
                                                                <span className="tb-product" style={{ flexDirection: "column", display: "flex" }}>
                                                                    <span className="title">{item.id}</span>
                                                                </span>
                                                            </Link>
                                                        </DataTableRow>
                                                        <DataTableRow>
                                                            <span className="tb-product" style={{ flexDirection: "column", display: "flex" }}>
                                                                <span className="title">{item.title}</span>
                                                            </span>
                                                        </DataTableRow>
                                                        <DataTableRow>
                                                            <span className="tb-product" style={{ flexDirection: "column", display: "flex" }}>
                                                                <span className="title">{item.customer_name}</span>
                                                            </span>
                                                        </DataTableRow>
                                                        <DataTableRow size="md">
                                                            <span className="tb-sub">{item.total}</span>
                                                        </DataTableRow>
                                                        <DataTableRow size="md">
                                                            <span className="tb-sub">{item.offer_date}</span>
                                                        </DataTableRow>
                                                        <DataTableRow size="md">
                                                            <span className="tb-sub">{item.valid_until}</span>
                                                        </DataTableRow>
                                                        <DataTableRow size="md">
                                                            {item.tags.map((tag, id) => (
                                                                <span key={id} className="badge text-center bg-outline-secondary">{tag}</span>
                                                            ))}

                                                        </DataTableRow>
                                                        <DataTableRow size="md">
                                                            <span className="tb-sub">{item.created_at}</span>
                                                        </DataTableRow>
                                                        <DataTableRow size="md">
                                                            <span className="badge bg-outline-secondary">{item.status}</span>
                                                        </DataTableRow>
                                                        <DataTableRow size="md">

                                                            <span style={{ paddingLeft: "5px" }} className="tb-sub">{item.created_by}</span>
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
                                                                                        <span>Teklifi Düzenle</span>
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
                                                                                        <span>Teklifi Görüntüle</span>
                                                                                    </DropdownItem>
                                                                                </li>
                                                                                <li>
                                                                                    <DropdownItem
                                                                                        tag="a"
                                                                                        href="#remove"
                                                                                        onClick={(ev) => {
                                                                                            ev.preventDefault();
                                                                                            deleteOffer(item.id);
                                                                                        }}
                                                                                    >
                                                                                        <Icon name="trash"></Icon>
                                                                                        <span>Teklifi Sil</span>
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
                                                <span className="text-silent">Herhangi bir teklif bulunamadı</span>
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
                            <h5 className="title">Teklifi Düzenle</h5>
                            <div className="mt-4">
                                <form noValidate onSubmit={handleSubmit(onEditSubmit)}>
                                    <Row className="g-3">
                                        <Col lg="4">
                                            <div className="form-group">
                                                <label className="form-label text-soft" htmlFor="title">
                                                    Başlık
                                                </label>
                                                <div className="form-control-wrap">
                                                    <input
                                                        id="title"
                                                        type="text"
                                                        className="form-control"
                                                        {...register('title', {
                                                            required: "Lütfen alanları boş bırakmayınız",
                                                        })}
                                                        value={formData.title}
                                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                                                    {errors.title && <span className="invalid">{errors.title.message}</span>}
                                                </div>
                                            </div>
                                        </Col>
                                        <Col lg="4">
                                            <div className="form-group">
                                                <label className="form-label text-soft" htmlFor="discount">
                                                    İndirim
                                                </label>
                                                <div className="form-control-wrap">
                                                    <input
                                                        id="discount"
                                                        type="text"
                                                        className="form-control"

                                                        value={formData.discount}
                                                        onChange={(e) => setFormData({ ...formData, discount: e.target.value })} />

                                                </div>
                                            </div>
                                        </Col>
                                        <Col lg="4">
                                            <div className="form-group">
                                                <label className="form-label text-soft" htmlFor="total">
                                                    Toplam
                                                </label>
                                                <div className="form-control-wrap">
                                                    <input
                                                        id="total"
                                                        type="text"
                                                        className="form-control"

                                                        value={formData.total}
                                                        onChange={(e) => setFormData({ ...formData, total: e.target.value })} />

                                                </div>
                                            </div>
                                        </Col>
                                        <Col lg="4">
                                            <div className="form-group">
                                                <label className="form-label text-soft" htmlFor="offer_date">
                                                    Tarih
                                                </label>
                                                <div className="form-control-wrap">
                                                    <input
                                                        id="offer_date"
                                                        type="text"
                                                        className="form-control"

                                                        value={formData.offer_date}
                                                        onChange={(e) => setFormData({ ...formData, offer_date: e.target.value })} />

                                                </div>
                                            </div>
                                        </Col>
                                        <Col lg="4">
                                            <div className="form-group">
                                                <label className="form-label text-soft" htmlFor="valid_until">
                                                    Geçerlilik Tarihi
                                                </label>
                                                <div className="form-control-wrap">
                                                    <input
                                                        id="valid_until"
                                                        type="text"
                                                        className="form-control"

                                                        value={formData.valid_until}
                                                        onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })} />

                                                </div>
                                            </div>
                                        </Col>
                                        <Col lg="4">
                                            <div className="form-group">
                                                <label className="form-label text-soft" htmlFor="tags">
                                                    Etiket
                                                </label>
                                                <div className="form-control-wrap">
                                                    <input
                                                        id="tags"
                                                        type="text"
                                                        className="form-control"

                                                        value={formData.tags}
                                                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })} />

                                                </div>
                                            </div>
                                        </Col>
                                        <Col lg="4">
                                            <div className="form-group">
                                                <label className="form-label text-soft" htmlFor="status">
                                                    Durum
                                                </label>
                                                <div className="form-control-wrap">
                                                    <input
                                                        id="status"
                                                        type="text"
                                                        className="form-control"

                                                        value={formData.status}
                                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })} />

                                                </div>
                                            </div>
                                        </Col>
                                        <Col lg="4">
                                            <div className="form-group">
                                                <label className="form-label text-soft" htmlFor="created_by">
                                                    Oluşturan
                                                </label>
                                                <div className="form-control-wrap">
                                                    <input
                                                        id="created_by"
                                                        type="text"
                                                        className="form-control"

                                                        value={formData.created_by}
                                                        onChange={(e) => setFormData({ ...formData, created_by: e.target.value })} />

                                                </div>
                                            </div>
                                        </Col>
                                        <Col lg="4">
                                            <div className="form-group">
                                                <label className="form-label text-soft" htmlFor="country">
                                                    Ülke
                                                </label>
                                                <div className="form-control-wrap">
                                                    <input
                                                        id="country"
                                                        type="text"
                                                        className="form-control"

                                                        value={formData.country}
                                                        onChange={(e) => setFormData({ ...formData, country: e.target.value })} />

                                                </div>
                                            </div>
                                        </Col>
                                        <Col lg="4">
                                            <div className="form-group">
                                                <label className="form-label text-soft" htmlFor="city">
                                                    Şehir
                                                </label>
                                                <div className="form-control-wrap">
                                                    <input
                                                        id="city"
                                                        type="text"
                                                        className="form-control"

                                                        value={formData.city}
                                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })} />

                                                </div>
                                            </div>
                                        </Col>
                                        <Col lg="4">
                                            <div className="form-group">
                                                <label className="form-label text-soft" htmlFor="district">
                                                    İlçe
                                                </label>
                                                <div className="form-control-wrap">
                                                    <input
                                                        id="district"
                                                        type="text"
                                                        className="form-control"

                                                        value={formData.district}
                                                        onChange={(e) => setFormData({ ...formData, district: e.target.value })} />

                                                </div>
                                            </div>
                                        </Col>
                                        <Col lg="4">
                                            <div className="form-group">
                                                <label className="form-label text-soft" htmlFor="postal_code">
                                                    Posta Kodu
                                                </label>
                                                <div className="form-control-wrap">
                                                    <input
                                                        id="postal_code"
                                                        type="text"
                                                        className="form-control"

                                                        value={formData.postal_code}
                                                        onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })} />

                                                </div>
                                            </div>
                                        </Col>
                                        <Col lg="4">
                                            <div className="form-group">
                                                <label className="form-label text-soft" htmlFor="address">
                                                    Adres
                                                </label>
                                                <div className="form-control-wrap">
                                                    <input
                                                        id="address"
                                                        type="text"
                                                        className="form-control"

                                                        value={formData.address}
                                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })} />

                                                </div>
                                            </div>
                                        </Col>
                                        <Col lg="4">
                                            <div className="form-group">
                                                <label className="form-label text-soft" htmlFor="telefon1">
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
                                                <label className="form-label text-soft" htmlFor="mail1">
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
                                        <Col size="12">
                                            <Button color="primary" type="submit">

                                                <span>Teklifi Güncelle</span>
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
                                Teklif Bilgileri <small className="text-primary"></small>
                            </h4>

                        </div>
                        <div className="nk-tnx-details mt-sm-3">
                            <Row className="gy-3">
                                <Col lg={4}>
                                    <span className="sub-text">Başlık</span>
                                    <span className="caption-text">{formData.title}</span>
                                </Col>
                                <Col lg={4}>
                                    <span className="sub-text">İndirim</span>
                                    <span className="caption-text">{formData.discount}%</span>
                                </Col>

                                <Col lg={4}>
                                    <span className="sub-text">Toplam</span>
                                    <span className="caption-text">{formData.total}</span>
                                </Col>
                                <Col lg={4}>
                                    <span className="sub-text">Tarih</span>
                                    <span className="caption-text">{formData.offer_date}</span>
                                </Col>
                                <Col lg={4}>
                                    <span className="sub-text">Geçerlilik Tarihi</span>
                                    <span className="caption-text">{formData.valid_until}</span>
                                </Col>
                                <Col lg={4}>
                                    <span className="sub-text">Etiket</span>
                                    {formData.tags.map((tag, id) => (
                                        <span key={id} className="caption-text"></span>
                                    ))}

                                </Col>
                                <Col lg={4}>
                                    <span className="sub-text">Oluşturulma</span>
                                    <span className="caption-text">{formData.created_at}</span>
                                </Col>
                                <Col lg={4}>
                                    <span className="sub-text">Durum</span>
                                    <span className="caption-text">{formData.status}</span>
                                </Col>
                                <Col lg={4}>
                                    <span className="sub-text">Oluşturan</span>
                                    <span className="caption-text">{formData.created_by}</span>
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
                                    <span className="sub-text">Posta Kodu</span>
                                    <span className="caption-text">{formData.postal_code}</span>
                                </Col>
                                <Col lg={4}>
                                    <span className="sub-text">Adres</span>
                                    <span className="caption-text">{formData.address}</span>
                                </Col>
                                <Col lg={4}>
                                    <span className="sub-text">Telefon</span>
                                    <span className="caption-text">{formData.phone}</span>
                                </Col>
                                <Col lg={4}>
                                    <span className="sub-text">Email</span>
                                    <span className="caption-text">{formData.email}</span>
                                </Col>
                            </Row>
                        </div>
                    </ModalBody>
                </Modal>



                {view.add && <div className="toggle-overlay" onClick={toggle}></div>}
            </Content>
        </>
    );
};
export default OfferListPage;
