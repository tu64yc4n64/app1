import React, { useEffect, useState } from "react";
import {
    Modal,
    ModalBody,
    Form,
    Input
} from "reactstrap";
import { Controller } from 'react-hook-form';
import {
    Icon,
    Col,
    Button,
    RSelect,
    Row,
    BlockDes
} from "../../../components/Component";
import { useForm } from "react-hook-form";
import axios from "axios";
import { NumericFormat } from 'react-number-format';
import { ToastContainer, toast } from 'react-toastify';
const BASE_URL = "https://tiosone.com/products/api/"

const AddMeetModal = ({ modal, closeModal, onSubmit, filterStatus }) => {
    const [tax, setTax] = useState([]);
    const [selectedTag, setSelectedTag] = useState([]);
    const [selectedProductType, setSelectedProductType] = useState();

    const [selectedCategory, setSelectedCategory] = useState();
    const [selectedTax, setSelectedTax] = useState();
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);

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
    const getAllTax = async () => {
        let accessToken = localStorage.getItem('accessToken');

        try {
            const response = await axios.get("https://tiosone.com/hub/api/taxrates/", {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            setTax(response.data);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                accessToken = await refreshAccessToken();
                if (accessToken) {
                    try {
                        const response = await axios.get("https://tiosone.com/hub/api/taxrates/", {
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${accessToken}`
                            }
                        });
                        setTax(response.data);
                    } catch (retryError) {
                        console.error("Retry error after refreshing token", retryError);
                    }
                } else {
                    window.location.href = '/auth-login'; // Hata durumunda login sayfasına yönlendir
                }
            } else {
                console.error("There was an error fetching the data!", error);
            }
        }
    };
    const getAllCategories = async () => {
        let accessToken = localStorage.getItem('accessToken');
        try {
            const response = await axios.get(BASE_URL + "categories?type=company", {
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
                        const response = await axios.get(BASE_URL + "categories?type=company", {
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${accessToken}`
                            }
                        });
                        setCategories(response.data);
                    } catch (retryError) {
                        console.error("Retry error after refreshing token", retryError);
                    }
                } else {
                    window.location.href = '/auth-login'; // Hata durumunda login sayfasına yönlendir
                }
            } else {
                console.error("There was an error fetching the data!", error);
            }
        }
    };
    const getAllTags = async () => {
        let accessToken = localStorage.getItem('accessToken');

        try {
            const response = await axios.get(BASE_URL + "tags?type=company", {
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
                        const response = await axios.get(BASE_URL + "tags?type=company", {
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
                    window.location.href = '/auth-login'; // Hata durumunda login sayfasına yönlendir
                }
            } else {
                console.error("There was an error fetching the data!", error);
            }
        }
    };
    const product_type = [{
        value: 1,
        label: "Servis",
        name: "service"

    },
    {
        value: 2,
        label: "Ürün",
        name: "product"
    }]
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
    useEffect(() => {
        getAllTax();
        getAllCategories();
        getAllTags();
    }, []);
    const formatDataForSelect = (data, labelKey, valueKey) => {
        return data.map(item => ({
            value: item[valueKey],
            label: item[labelKey]
        }));
    };
    const formattedCategories = formatDataForSelect(categories, "name", "id");
    const formattedTaxes = formatDataForSelect(tax, "rate", "id");


    const formattedTags = formatDataForSelect(tags, "name", "id");
    const handleCategoryChange = (selectedOption) => {
        setSelectedCategory(selectedOption);
    };
    const handleProductTypeChange = (selectedOption) => {
        setSelectedProductType(selectedOption);
    };
    const handleTagChange = (selectedOption) => {
        setSelectedTag(selectedOption);
    };
    const handleTaxChange = (selectedOption) => {
        setSelectedTax(selectedOption);
    };
    useEffect(() => {
        reset(formData)
    }, [formData]);

    const [startDate, setStartDate] = useState(null);
    const [view, setView] = useState({
        edit: false,
        add: false,
        details: false,
    });
    const onFormCancel = () => {
        setView({ edit: false, add: false, details: false });
        resetForm();
    };

    const resetForm = () => {
        setSelectedCategory()
        setSelectedTag([])
        setStartDate()
        setSelectedProductType("")
        setFormData({
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

        reset({});
    };

    const handleFormSubmit = async (form) => {
        let accessToken = localStorage.getItem('accessToken');
        const { description, name, purchase_price, sale_price } = form;

        let submittedData = {
            // Eklenen gerekli alanlar
            added_by: "admin64",
            category: selectedCategory ? selectedCategory.value : null,
            description: description,
            name: name,
            purchase_price: purchase_price,
            sale_price: sale_price,
            tags: selectedTag.map((tag) => tag.value),
            tax_rate: selectedTax ? selectedTax.value : null,
            product_type: selectedProductType ? selectedProductType.name : null,
        };



        try {
            const response = await axios.post(BASE_URL + "products/", submittedData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });


            resetForm();
            closeModal();
            toast.success("Ürün Başarıyla Eklendi", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: false,
            });

            // Yeni veriyi ana componente geri gönder
            onSubmit(response.data);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                accessToken = await refreshAccessToken();
                if (accessToken) {
                    try {
                        const response = await axios.post(BASE_URL + "products/", submittedData, {
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${accessToken}`
                            }
                        });

                        resetForm();
                        closeModal();
                        toast.success("Ürün Başarıyla Eklendi", {
                            position: "top-right",
                            autoClose: 2000,
                            hideProgressBar: true,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: false,
                        });

                        // Yeni veriyi ana componente geri gönder
                        onSubmit(response.data);
                    } catch (retryError) {
                        console.error("Retry error after refreshing token", retryError);
                    }
                } else {
                    window.location.href = '/auth-login';
                }
            } else {
                console.error("Response Error:", error.response.data);
                console.error("Response Status:", error.response.status);
                console.error("Response Headers:", error.response.headers);
                toast.error("Ürün Eklenirken Bir Hata Oluştu.", {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: false,
                });
            }
        }
    };
    const { control, reset, register, handleSubmit, formState: { errors } } = useForm();
    return (
        <Modal isOpen={modal} toggle={() => closeModal()} className="modal-dialog-centered" size="lg">
            <ModalBody>
                <a
                    href="#cancel"
                    onClick={(ev) => {
                        ev.preventDefault();
                        closeModal()
                    }}
                    className="close"
                >
                    <Icon name="cross-sm"></Icon>
                </a>
                <div className="p-2">
                    <h5 className="title">Ürün Ekle</h5>
                    <div className="mt-4">
                        <form onSubmit={handleSubmit(handleFormSubmit)}>
                            <Row className="g-3">

                                <Col size="6">
                                    <div className="form-group">
                                        <label className="form-label text-soft">

                                            Türü

                                        </label>
                                        <div className="form-control-wrap">
                                            <RSelect
                                                name="tur"

                                                placeholder="Türü"
                                                options={product_type}
                                                onChange={(selectedOption) => handleProductTypeChange(selectedOption)}
                                                value={selectedProductType}

                                            />

                                        </div>
                                    </div>
                                </Col>
                                <Col size="6">
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
                                                    required: "Lütfen boş bırakılan alanları doldurunuz.",
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
                                            <NumericFormat
                                                className="form-control"
                                                id="alis"
                                                thousandSeparator="."
                                                decimalSeparator=","
                                                value={formData.purchase_price}
                                                onValueChange={(values) => {
                                                    const { formattedValue, value } = values;
                                                    setFormData({ ...formData, purchase_price: value });
                                                }}
                                                placeholder="Alış Fiyatı (KDV Dahil)"
                                            />
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
                                            <NumericFormat
                                                className="form-control"
                                                id="satis"
                                                thousandSeparator="."
                                                decimalSeparator=","
                                                value={formData.sale_price}
                                                onValueChange={(values) => {
                                                    const { formattedValue, value } = values;
                                                    setFormData({ ...formData, sale_price: value });
                                                }}
                                                placeholder="Satış Fiyatı (KDV Dahil)"
                                            />
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

                                                placeholder="KDV Oranı"
                                                options={formattedTaxes}
                                                onChange={(selectedOption) => handleTaxChange(selectedOption)}
                                                value={selectedTax}
                                            />
                                        </div>
                                    </div>
                                </Col>

                                <Col size="12">
                                    <ul className="align-center justify-end flex-wrap flex-sm-nowrap gx-2 gy-2">

                                        <li>
                                            <a
                                                href="#cancel"
                                                onClick={(ev) => {
                                                    ev.preventDefault();
                                                    closeModal();
                                                }}
                                                className="btn btn-outline-primary"
                                            >
                                                Vazgeç
                                            </a>
                                        </li>
                                        <li>
                                            <Button color="primary" size="md" type="submit">
                                                Kaydet
                                            </Button>
                                        </li>
                                    </ul>
                                </Col>
                            </Row>
                        </form>
                    </div>
                </div>
            </ModalBody>
        </Modal>
    );
};
export default AddMeetModal;
