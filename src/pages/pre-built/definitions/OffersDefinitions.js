import React, { useState, useEffect } from "react";
import Head from "../../../layout/head/Head";
import Content from "../../../layout/content/Content";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { RSelect } from "../../../components/Component";
import { Card, Modal, ModalBody } from "reactstrap";
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
    DataTable
} from "../../../components/Component";
import axios from "axios";

const BASE_URL = "https://tiosone.com/sales/api/";

const OffersDefinitions = () => {
    const [data, setCategoryData] = useState([]);
    const [dataTags, setCategoryDataTags] = useState([]);
    console.log(dataTags)
    const [formData, setFormData] = useState({
        id: "",
        name: "",
        parent: "",
        description: "",
        type: ""
    });

    const [selectedCategory, setSelectedCategory] = useState([]);
    const [formattedCategories, setFormattedCategories] = useState([]);


    useEffect(() => {
        if (data.length > 0) {
            const formatted = data.map(category => ({
                value: category.id,
                label: category.name,
                description: category.description,
                parent: category.parent
            }));
            setFormattedCategories(formatted);
        }
    }, [data]);

    const handleCategoryChange = (selectedOptions) => {
        setSelectedCategory(selectedOptions);
    };

    const getAllCategories = async () => {
        let accessToken = localStorage.getItem('accessToken');

        try {
            const response = await axios.get(BASE_URL + "categories?type=offer", {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            setCategoryData(response.data);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                accessToken = await refreshAccessToken();
                if (accessToken) {
                    try {
                        const response = await axios.get(BASE_URL + "categories?type=offer", {
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${accessToken}`
                            }
                        });
                        setCategoryData(response.data);
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
            const response = await axios.get(BASE_URL + "tags?type=offer", {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            setCategoryDataTags(response.data);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                accessToken = await refreshAccessToken();
                if (accessToken) {
                    try {
                        const response = await axios.get(BASE_URL + "tags?type=offer", {
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${accessToken}`
                            }
                        });
                        setCategoryDataTags(response.data);
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

    useEffect(() => {
        getAllCategories();
        getAllTags();
    }, []);

    const type = [{
        value: "offer",
        label: "Teklif"
    },
    {
        value: "sales",
        label: "Satış"
    }]

    const onFormCategorySubmit = async (form) => {
        let accessToken = localStorage.getItem('accessToken');

        const { name, description } = form;

        let submittedData = {
            name: name,
            description: description,
            type: "offer",
            parent: selectedCategory.value,
        };
        try {
            const response = await axios.post(BASE_URL + "categories/", submittedData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            setCategoryData([response.data, ...data]);
            setView({ open: false });
            toast.success("Kategori Başarıyla Eklendi.", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: false,
            });
            resetForm();
        } catch (error) {
            console.error("An error occurred:", error);
            toast.error("Kategori Eklenirken Hata Oluştu.", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: false,
            });
        }
    };

    const onFormTagSubmit = async (form) => {
        let accessToken = localStorage.getItem('accessToken');

        const { name, description } = form;

        let submittedData = {
            name: name,
            description: description,
            type: "offer",
        };

        try {
            const response = await axios.post(BASE_URL + "tags/", submittedData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            setCategoryDataTags([response.data, ...dataTags]);
            setTagView({ open: false });
            toast.success("Etiket Başarıyla Eklendi.", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: false,
            });
            resetForm();
        } catch (error) {
            console.error("An error occurred:", error);
            toast.error("Etiket Eklenirken Hata Oluştu.", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: false,
            });
        }
    };

    const deleteDefinition = async (id) => {
        let accessToken = localStorage.getItem('accessToken');

        try {
            await axios.delete(`${BASE_URL}categories/${id}`, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            let updatedData = data.filter((item) => item.id !== id);
            setCategoryData([...updatedData]);
            toast.warning("Kategori Başarıyla Silindi", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: false,
            });
        } catch (error) {
            console.error("There was an error deleting the product!", error);
            toast.error("Kategori Silinirken Hata Oluştu", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: false,
            });
        }
    };
    const deleteTagDefinition = async (id) => {
        let accessToken = localStorage.getItem('accessToken');

        try {
            await axios.delete(`${BASE_URL}tags/${id}`, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            let updatedData = dataTags.filter((item) => item.id !== id);
            setCategoryDataTags([...updatedData]);
            toast.warning("Etiket Başarıyla Silindi", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: false,
            });
        } catch (error) {
            console.error("There was an error deleting the product!", error);
            toast.error("Etiket Silinirken Hata Oluştu", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: false,
            });
        }
    };

    const [editId, setEditedId] = useState();
    const [view, setView] = useState({
        edit: false,
        add: false,
        details: false,
    });
    const [tagView, setTagView] = useState({
        edit: false,
        add: false,
        details: false,
    });

    const onEditCategorySubmit = async () => {
        let accessToken = localStorage.getItem('accessToken');

        let submittedData;
        let newItems = data;
        let index = newItems.findIndex((item) => item.id === editId);

        newItems.forEach((item) => {
            if (item.id === editId) {
                submittedData = {
                    id: formData.id,
                    name: formData.name,
                    parent: formData.parent,
                    description: formData.description,
                    type: formData.type
                };
            }
        });

        try {
            const response = await axios.put(`${BASE_URL}categories/${editId}`, submittedData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            newItems[index] = response.data;
            setCategoryData(newItems);
            resetForm();
            setView({ edit: false, add: false });
            toast.info("Kategori Başarıyla Güncellendi.", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: false,
            });
        } catch (error) {
            console.error('Veritabanını güncelleme sırasında hata oluştu:', error);
            toast.error("Kategori Güncellenirken Bir Hata Oluştu.", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: false,
            });
        }
    };

    const onEditTagSubmit = async () => {
        let accessToken = localStorage.getItem('accessToken');

        let submittedData;
        let newItems = dataTags;
        let index = newItems.findIndex((item) => item.id === editId);

        newItems.forEach((item) => {
            if (item.id === editId) {
                submittedData = {
                    id: formData.id,
                    name: formData.name,

                    description: formData.description,
                    type: formData.type
                };
            }
        });

        try {
            const response = await axios.put(`${BASE_URL}tags/${editId}`, submittedData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            newItems[index] = response.data;
            setCategoryDataTags(newItems);
            resetForm();
            setTagView({ edit: false, add: false });
            toast.info("Etiket Başarıyla Güncellendi.", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: false,
            });
        } catch (error) {
            console.error('Veritabanını güncelleme sırasında hata oluştu:', error);
            toast.error("Etiket Güncellenirken Bir Hata Oluştu.", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: false,
            });
        }
    };

    const onEditCategoryClick = (id) => {
        data.forEach((item) => {
            if (item.id === id) {
                setFormData({
                    id: item.id,
                    name: item.name,
                    parent: item.parent,
                    description: item.description,
                    type: item.type
                });
            }
        });
        setEditedId(id);
        setView({ add: false, edit: true });
    };

    const onEditTagClick = (id) => {
        dataTags.forEach((item) => {
            if (item.id === id) {
                setFormData({
                    id: item.id,
                    name: item.name,
                    description: item.description,
                    type: item.type
                });
            }
        });
        setEditedId(id);
        setTagView({ add: false, edit: true });
    };

    useEffect(() => {
        reset(formData);
    }, [formData]);

    const resetForm = () => {
        setSelectedCategory(null); // Reset selected category
        setFormData({
            id: "",
            name: "",
            parent: "",
            type: "",
            description: ""
        });
        reset({});
    };

    const onFormCancel = () => {
        setView({ edit: false, add: false, details: false });
        setTagView({ edit: false, add: false, details: false });
        resetForm();
    };

    const toggle = (type) => {
        setView({
            edit: type === "edit" ? true : false,
            add: type === "add" ? true : false,
            details: type === "details" ? true : false,
        });
    };

    const togglee = (type) => {
        setTagView({
            edit: type === "edit" ? true : false,
            add: type === "add" ? true : false,
            details: type === "details" ? true : false,
        });
    };

    const currentItems = data;
    const currentTagItems = dataTags;

    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    return (
        <>
            <Head title="PersonPage"></Head>
            <Content>
                <BlockHead size="sm">
                    <BlockBetween>
                        <BlockHeadContent>
                            <BlockTitle>Teklif Tanımlamaları</BlockTitle>
                            <div className="nk-block-des text-soft"><p>Teklif uygulamanızdaki tanımlamaları ayarlayın.</p></div>
                        </BlockHeadContent>
                    </BlockBetween>
                </BlockHead>

                <Block>
                    <Row>
                        <Col lg={6}>
                            <Row className="pb-3">
                                <Col lg={6}>
                                    <div className="d-flex align-items-center h-100">
                                        <h5>Kategoriler</h5>
                                    </div>
                                </Col>
                                <Col lg={6}>
                                    <div className="d-flex justify-content-end w-100">
                                        <Button
                                            className="toggle btn btn-primary"
                                            color="primary"
                                            size="sm"
                                            onClick={() => toggle("add")}
                                        >
                                            Kategori Ekle
                                        </Button>
                                    </div>
                                </Col>
                            </Row>
                            <DataTable className="card-stretch">
                                <Card className="card-bordered">
                                    <div className="card-inner-group">
                                        <div className="card-inner p-0">
                                            <DataTableBody>
                                                <DataTableHead>
                                                    <DataTableRow>
                                                        <span>Kategori Adı</span>
                                                    </DataTableRow>
                                                    <DataTableRow>
                                                        <span>Üst Kategori</span>
                                                    </DataTableRow>
                                                    <DataTableRow></DataTableRow>
                                                </DataTableHead>
                                                {currentItems.length > 0
                                                    ? currentItems.map((item) => {
                                                        return (
                                                            <DataTableItem key={item.id}>
                                                                <DataTableRow size="md">
                                                                    <span className="tb-product" style={{ flexDirection: "column", display: "flex", alignItems: "start" }}>

                                                                        <span className="title">{item.name} </span>

                                                                    </span>
                                                                </DataTableRow>
                                                                <DataTableRow>
                                                                    {item.parent && (
                                                                        <span className="badge bg-outline-secondary me-1">
                                                                            {data.find(cat => cat.id === item.parent)?.name || "Üst kategori bulunamadı"}
                                                                        </span>
                                                                    )}
                                                                </DataTableRow>
                                                                <DataTableRow className="nk-tb-col-tools">
                                                                    <ul className="nk-tb-actions gx-1 my-n1">
                                                                        <li tag="a"
                                                                            href="#edit"
                                                                            onClick={(ev) => {
                                                                                ev.preventDefault();
                                                                                onEditCategoryClick(item.id);
                                                                                toggle("edit");
                                                                            }}
                                                                        >
                                                                            <Icon name="edit"></Icon>
                                                                        </li>
                                                                        <li tag="a"
                                                                            href="#remove"
                                                                            onClick={(ev) => {
                                                                                ev.preventDefault();
                                                                                deleteDefinition(item.id);
                                                                            }}>
                                                                            <Icon name="trash"></Icon>
                                                                        </li>
                                                                    </ul>
                                                                </DataTableRow>
                                                            </DataTableItem>
                                                        );
                                                    })
                                                    : null}
                                            </DataTableBody>
                                        </div>
                                    </div>
                                </Card>
                            </DataTable>
                        </Col>
                        <Col lg={6}>
                            <Row className="pb-3">
                                <Col lg={6}>
                                    <div className="d-flex align-items-center h-100">
                                        <h5>Etiketler</h5>
                                    </div>
                                </Col>
                                <Col lg={6}>
                                    <div className="d-flex justify-content-end w-100">
                                        <Button
                                            className="toggle btn btn-primary"
                                            color="primary"
                                            size="sm"
                                            onClick={() => togglee("add")}
                                        >
                                            Etiket Ekle
                                        </Button>
                                    </div>
                                </Col>
                            </Row>
                            <DataTable className="card-stretch">
                                <Card className="card-bordered">
                                    <div className="card-inner-group">
                                        <div className="card-inner p-0">
                                            <DataTableBody>
                                                <DataTableHead>
                                                    <DataTableRow>
                                                        <span>Etiket Adı</span>
                                                    </DataTableRow>
                                                    <DataTableRow>
                                                        <span>Üst Kategori</span>
                                                    </DataTableRow>
                                                    <DataTableRow>

                                                    </DataTableRow>


                                                </DataTableHead>
                                                {currentTagItems.length > 0
                                                    ? currentTagItems.map((item) => {
                                                        return (
                                                            <DataTableItem key={item.id}>
                                                                <DataTableRow size="md">
                                                                    <span className="tb-product" style={{ flexDirection: "column", display: "flex", alignItems: "start" }}>

                                                                        <span className="title">{item.name} </span>

                                                                    </span>
                                                                </DataTableRow>
                                                                <DataTableRow size="md">
                                                                    <span className="tb-sub"></span>
                                                                </DataTableRow>
                                                                <DataTableRow className="nk-tb-col-tools">
                                                                    <ul className="nk-tb-actions gx-1 my-n1">
                                                                        <li tag="a"
                                                                            href="#edit"
                                                                            onClick={(ev) => {
                                                                                ev.preventDefault();
                                                                                onEditTagClick(item.id);
                                                                                togglee("edit");
                                                                            }}
                                                                        >
                                                                            <Icon name="edit"></Icon>
                                                                        </li>
                                                                        <li tag="a"
                                                                            href="#remove"
                                                                            onClick={(ev) => {
                                                                                ev.preventDefault();
                                                                                deleteTagDefinition(item.id);
                                                                            }}>
                                                                            <Icon name="trash"></Icon>
                                                                        </li>
                                                                    </ul>
                                                                </DataTableRow>
                                                            </DataTableItem>
                                                        );
                                                    })
                                                    : null}
                                            </DataTableBody>
                                        </div>
                                    </div>
                                </Card>
                            </DataTable>
                        </Col>
                    </Row>
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
                            <h5 className="title">Kategoriyi Düzenle</h5>
                            <div className="mt-4">
                                <form noValidate onSubmit={handleSubmit(onEditCategorySubmit)}>
                                    <Row className="g-3">
                                        <Col lg="6">
                                            <div className="form-group">
                                                <label className="form-label" htmlFor="name">
                                                    Kategori Adı
                                                </label>
                                                <div className="form-control-wrap">
                                                    <input
                                                        id="name"
                                                        type="text"
                                                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                                        {...register('name', {
                                                            required: "Lütfen alanları boş bırakmayınız",
                                                        })}
                                                        value={formData.name}
                                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                                    {errors.name && <span className="invalid">{errors.name.message}</span>}
                                                </div>
                                            </div>
                                        </Col>
                                        <Col lg="6">
                                            <div className="form-group">
                                                <label className="form-label" htmlFor="parent">
                                                    Üst Kategori
                                                </label>
                                                <div className="form-control-wrap">
                                                    <RSelect
                                                        name="parent"
                                                        id="parent"
                                                        placeholder="Üst Kategori Seçin"
                                                        options={formattedCategories}
                                                        onChange={(selectedOption) => setFormData({ ...formData, parent: selectedOption.value })}
                                                        value={formattedCategories.find(option => option.value === formData.parent)}
                                                    />
                                                </div>
                                            </div>
                                        </Col>

                                        <Col lg="6">
                                            <div className="form-group">
                                                <label className="form-label" htmlFor="description">
                                                    Açıklama
                                                </label>
                                                <div className="form-control-wrap">
                                                    <input
                                                        id="description"
                                                        type="text"
                                                        className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                                                        value={formData.description}
                                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        </Col>
                                        <Col size="12">
                                            <Button color="primary" type="submit">
                                                <span>Kategoriyi Güncelle</span>
                                            </Button>
                                        </Col>
                                    </Row>
                                </form>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>


                <Modal isOpen={view.add} toggle={() => onFormCancel()} className="modal-dialog-centered" size="lg">
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
                            <h5 className="title">Kategori Ekle</h5>
                            <div className="mt-4">
                                <form noValidate onSubmit={handleSubmit(onFormCategorySubmit)}>
                                    <Row className="g-3">
                                        <Col lg="6">
                                            <div className="form-group">
                                                <label className="form-label" htmlFor="name">
                                                    Kategori Adı
                                                </label>
                                                <div className="form-control-wrap">
                                                    <input
                                                        id="name"
                                                        type="text"
                                                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                                        {...register('name', {
                                                            required: "Lütfen alanları boş bırakmayınız",
                                                        })}
                                                        value={formData.name}
                                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                                    {errors.name && <span className="invalid">{errors.name.message}</span>}
                                                </div>
                                            </div>
                                        </Col>
                                        <Col lg="6">
                                            <div className="form-group">
                                                <label className="form-label" htmlFor="parent">
                                                    Üst Kategori
                                                </label>
                                                <div className="form-control-wrap">
                                                    <RSelect
                                                        name="category"

                                                        placeholder="Kategori"
                                                        options={formattedCategories}
                                                        onChange={(selectedOptions) => handleCategoryChange(selectedOptions)}
                                                        value={selectedCategory}

                                                    />
                                                </div>
                                            </div>
                                        </Col>

                                        <Col lg="6">
                                            <div className="form-group">
                                                <label className="form-label" htmlFor="description">
                                                    Açıklama
                                                </label>
                                                <div className="form-control-wrap">
                                                    <input
                                                        id="description"
                                                        type="text"
                                                        className={`form-control ${errors.description ? 'is-invalid' : ''}`}

                                                        value={formData.description}
                                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })} />

                                                </div>
                                            </div>
                                        </Col>


                                        <Col size="12">
                                            <Button color="primary" type="submit">
                                                <span>Kategoriyi Ekle</span>
                                            </Button>
                                        </Col>
                                    </Row>
                                </form>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>

                <Modal isOpen={tagView.edit} toggle={() => onFormCancel()} className="modal-dialog-centered" size="lg">
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
                            <h5 className="title">Etiketi Düzenle</h5>
                            <div className="mt-4">
                                <form noValidate onSubmit={handleSubmit(onEditTagSubmit)}>
                                    <Row className="g-3">
                                        <Col lg="6">
                                            <div className="form-group">
                                                <label className="form-label" htmlFor="name">
                                                    Kategori Adı
                                                </label>
                                                <div className="form-control-wrap">
                                                    <input
                                                        id="name"
                                                        type="text"
                                                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                                        {...register('name', {
                                                            required: "Lütfen alanları boş bırakmayınız",
                                                        })}
                                                        value={formData.name}
                                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                                    {errors.name && <span className="invalid">{errors.name.message}</span>}
                                                </div>
                                            </div>
                                        </Col>


                                        <Col lg="6">
                                            <div className="form-group">
                                                <label className="form-label" htmlFor="description">
                                                    Açıklama
                                                </label>
                                                <div className="form-control-wrap">
                                                    <input
                                                        id="description"
                                                        type="text"
                                                        className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                                                        value={formData.description}
                                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        </Col>
                                        <Col size="12">
                                            <Button color="primary" type="submit">
                                                <span>Etiketi Güncelle</span>
                                            </Button>
                                        </Col>
                                    </Row>
                                </form>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>

                <Modal isOpen={tagView.add} toggle={() => onFormCancel()} className="modal-dialog-centered" size="lg">
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
                            <h5 className="title">Etiket Ekle</h5>
                            <div className="mt-4">
                                <form noValidate onSubmit={handleSubmit(onFormTagSubmit)}>
                                    <Row className="g-3">
                                        <Col lg="6">
                                            <div className="form-group">
                                                <label className="form-label" htmlFor="name">
                                                    Etiket Adı
                                                </label>
                                                <div className="form-control-wrap">
                                                    <input
                                                        id="name"
                                                        type="text"
                                                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                                        {...register('name', {
                                                            required: "Lütfen alanları boş bırakmayınız",
                                                        })}
                                                        value={formData.name}
                                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                                    {errors.name && <span className="invalid">{errors.name.message}</span>}
                                                </div>
                                            </div>
                                        </Col>


                                        <Col lg="6">
                                            <div className="form-group">
                                                <label className="form-label" htmlFor="description">
                                                    Açıklama
                                                </label>
                                                <div className="form-control-wrap">
                                                    <input
                                                        id="description"
                                                        type="text"
                                                        className={`form-control ${errors.description ? 'is-invalid' : ''}`}

                                                        value={formData.description}
                                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })} />

                                                </div>
                                            </div>
                                        </Col>


                                        <Col size="12">
                                            <Button color="primary" type="submit">
                                                <span>Etiket Ekle</span>
                                            </Button>
                                        </Col>
                                    </Row>
                                </form>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>

                <ToastContainer />
            </Content>
        </>
    );
};
export default OffersDefinitions;
