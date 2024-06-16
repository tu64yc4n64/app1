
import React, { useState, useEffect } from "react";
import Content from "../../../layout/content/Content";
import { Label, Input, Row, Col, UncontrolledDropdown, DropdownToggle, DropdownMenu, ButtonGroup, ButtonToolbar } from "reactstrap";
import DatePicker from "react-datepicker";
import {
    Block,
    BlockDes,
    BlockHead,
    BlockHeadContent,
    BlockTitle,
    Icon,
    Button,
    BlockBetween,
    PreviewCard,
    OverlineTitle,
    RSelect


} from "../../../components/Component";
import axios from "axios";
import { useForm } from "react-hook-form";
import "./style.css"
const BASE_URL = "https://tiosone.com/sales/api/"
const NewOffersPage = () => {
    const getAllCategories = async () => {
        try {
            const response = await axios.get(BASE_URL + "categories?type=offer");
            setCategories(response.data);
        } catch (error) {
            console.error("There was an error fetching the data!", error);
        }
    };
    const getAllTags = async () => {
        try {
            const response = await axios.get(BASE_URL + "tags?type=offer");
            setTags(response.data);
        } catch (error) {
            console.error("There was an error fetching the data!", error);
        }
    };


    const [data, setData] = useState([]);
    console.log(data)
    const formattedOfferItems = data.map(item => ({
        value: item.id,
        label: item.product_name,
        description: item.description,
        quantity: item.quantity,
        tax: item.tax,
        total: item.total,
        unit_price: item.unit_price,

    }));
    const [selectedOfferItem, setSelectedOfferItem] = useState([]);
    console.log(selectedOfferItem)
    const handleOfferItemChange = (selectedOptions) => {
        setSelectedOfferItem(selectedOptions);
    };

    const handleAddItemOffer = () => {
        const newOfferItem = {
            description: selectedOfferItem.description,
            product: formData.title,
            product_name: selectedOfferItem.label,
            quantity: selectedOfferItem.quantity,
            tax: selectedOfferItem.tax,
            total: selectedOfferItem.total,
            unit_price: selectedOfferItem.unit_price,
        };

        setOffer((prevOffer) => [...prevOffer, newOfferItem]);

        setSelectedTax(null);

        setNewOfferData({
            description: "",
            product: "",
            product_name: "",
            quantity: "",
            tax: "",
            total: "",
            unit_price: "",
        });
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

    const getAllOfferItems = async () => {
        let accessToken = localStorage.getItem('accessToken');
        try {
            const response = await axios.get(BASE_URL + "offer-items/", {
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
                        const response = await axios.get(BASE_URL + "offer-items/", {
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
        getAllOfferItems()

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
    useEffect(() => {
        getAllCategories()

    }, [])
    useEffect(() => {
        getAllTags()

    }, [])
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
        items: [],
        offer_date: "",
        phone: "",
        postal_code: "",
        status: "",
        tags: [],
        title: "",
        total: "",
        updated_at: "",
        valid_until: "",

    });

    const onFormSubmit = async (form) => {
        let accessToken = localStorage.getItem('accessToken');
        const { title, total, email, phone, address_line, status, description, product, product_name, quantity, tax, unit_price } = form;

        let submittedData = {
            added_by: 1,
            address: address_line,
            category: 2,
            city: "Uşak",
            company: 1,
            country: "Türkiye",
            created_at: "",
            created_by: 1,
            customer: "",
            customer_name: "",
            discount: "",
            discount_type: "",
            district: "Merkez",
            email: email,
            items: [{
                description: description,
                product: product,
                product_name: product_name,
                quantity: quantity,
                tax: tax,
                total: total,
                unit_price: unit_price
            }],
            offer_date: "",
            phone: phone,
            postal_code: "64000",
            status: status,
            tags: [],
            title: title,
            total: total,
            updated_at: "",
            valid_until: "",
        };


        try {
            const response = await axios.post(BASE_URL + "offers/", submittedData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            setData([response.data, ...data]);

            resetForm();
        } catch (error) {
            console.error("An error occurred:", error);
        }
    };
    const resetForm = () => {
        setSelectedCategory([])
        setSelectedTag([])
        setStartDate()
        setFormData({
            added_by: "",
            address: "",
            category: "",
            city: "",
            company: "",
            country: "",
            created_at: "",
            created_by: 1,
            customer: "",
            customer_name: "",
            discount: "",
            discount_type: "",
            district: "",
            email: "",
            items: [],
            offer_date: "",
            phone: "",
            postal_code: "",
            status: "",
            tags: [],
            title: "",
            total: "",
            updated_at: "",
            valid_until: "",

        });

        reset({});
    };


    const [startDate, setStartDate] = useState(null);
    const [finishDate, setFinishDate] = useState(null);
    const [offer, setOffer] = useState([])
    console.log(offer)
    const [selectedTax, setSelectedTax] = useState(null);
    console.log(selectedTax)
    const [discount, setDiscount] = useState({
        label: "0%",
        value: "0"
    });


    const [newOfferData, setNewOfferData] = useState({
        description: "",
        product: "",
        product_name: "",
        quantity: "",
        tax: "",
        total: "",
        unit_price: ""
    });
    const handleTaxChange = (selectedOption) => {
        setSelectedTax(selectedOption);
    };
    const handleDiscountChange = (selectedOption) => {
        setDiscount(selectedOption);
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewOfferData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    }
    const handleAddOffer = () => {
        const newOfferItem = {
            description: newOfferData.description,
            product: newOfferData.product,
            product_name: newOfferData.product_name,
            quantity: newOfferData.quantity,
            tax: selectedTax.label.replace("%", ""),
            total: newOfferData.total,
            unit_price: newOfferData.unit_price,
        };

        setOffer((prevOffer) => [...prevOffer, newOfferItem]);

        setSelectedTax(null);

        setNewOfferData({
            description: "",
            product: "",
            product_name: "",
            quantity: "",
            tax: "",
            total: "",
            unit_price: "",
        });
    };
    const calculateSubtotal = () => {
        let subtotal = 0;
        offer.forEach(item => {

            const totalItemPrice = parseFloat(item.quantity) * parseFloat(item.unit_price) * parseFloat(item.tax);
            subtotal += totalItemPrice;
        });
        return subtotal.toFixed(2);
    };
    const calculateDiscountSubtotal = () => {
        let discountSubtotal = 0;
        discountSubtotal = calculateSubtotal() * discount.value
        return discountSubtotal.toFixed(2);
    };
    const handleDeleteOffer = (id) => {
        setOffer(offer.filter(item => item.id !== id))
    }

    const taxData = [
        {
            label: "20%",
            value: "1.2"
        },
        {
            label: "15%",
            value: "1.15"
        }
    ];
    const discountData = [
        {
            label: "0%",
            value: "0"
        },
        {
            label: "5%",
            value: "0.05"
        },
        {
            label: "10%",
            value: "0.1"
        },
        {
            label: "15%",
            value: "0.15"
        }
    ];


    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    return (
        <Content>
            <BlockHead size="sm">
                <BlockBetween>
                    <BlockHeadContent>
                        <BlockTitle>Teklif Oluştur</BlockTitle>
                        <div className="nk-block-des text-soft"><p>Yeni Teklif Oluşturun</p></div>
                    </BlockHeadContent>
                </BlockBetween>
            </BlockHead>
            <Block size="lg">

                <PreviewCard>
                    <form onSubmit={handleSubmit(onFormSubmit)}>
                        <Row className="gy-4">
                            <Col lg="6">
                                <Row className="gy-4">
                                    <Col sm="12">
                                        <div className="form-group">

                                            <div className="form-control-wrap">
                                                <Input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Teklif Başlığı"
                                                    value={formData.title}
                                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </Col>

                                    <Col md="6">
                                        <div className="form-group">

                                            <div className="form-control-wrap">
                                                <DatePicker
                                                    selected={startDate}
                                                    onChange={(date) => setStartDate(date)}
                                                    className="form-control"
                                                    placeholderText="Tarih"
                                                />
                                            </div>
                                        </div>
                                    </Col>
                                    <Col md="6">
                                        <div className="form-group">

                                            <div className="form-control-wrap">
                                                <DatePicker
                                                    selected={finishDate}
                                                    onChange={(date) => setFinishDate(date)}
                                                    className="form-control"
                                                    placeholderText="Geçerlilik Tarihi"
                                                />
                                            </div>
                                        </div>
                                    </Col>
                                    <Col sm="12">
                                        <div className="form-group">

                                            <div className="form-control-wrap">
                                                <RSelect
                                                    isMulti
                                                    options={formattedCategories}

                                                    placeholder="Kategori"
                                                    onChange={(value) => setFormData({ ...formData, categories: value })}
                                                />
                                            </div>
                                        </div>
                                    </Col>
                                    <Col sm="12">
                                        <div className="form-group">

                                            <div className="form-control-wrap">
                                                <RSelect
                                                    isMulti
                                                    options={formattedTags}

                                                    placeholder="Etiket"
                                                    onChange={(value) => setFormData({ ...formData, tags: value })}
                                                />
                                            </div>
                                        </div>
                                    </Col>



                                </Row>
                            </Col>
                            <Col lg="6">
                                <Row className="gy-4">
                                    <Col md="6">
                                        <div className="form-group">

                                            <div className="form-control-wrap">
                                                <Input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Durum"
                                                    value={formData.status}
                                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </Col>
                                    <Col md="6">
                                        <div className="form-group">

                                            <RSelect placeholder="Oluşturan" />
                                        </div>
                                    </Col>
                                    <Col sm="12">
                                        <div className="form-group">

                                            <div className="form-control-wrap">
                                                <Input id="default-0" placeholder="Kime" type="text" />
                                            </div>
                                        </div>
                                    </Col>
                                    <Col sm="12">
                                        <div className="form-group">

                                            <div className="form-control-wrap">
                                                <Input
                                                    type="textarea"
                                                    className="form-control"
                                                    placeholder="Adres"
                                                    value={formData.address}
                                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </Col>
                                    <Col md="6">
                                        <div className="form-group">

                                            <RSelect placeholder="Şehir" />
                                        </div>
                                    </Col>
                                    <Col md="6">
                                        <div className="form-group">

                                            <RSelect placeholder="İlçe" />
                                        </div>
                                    </Col>
                                    <Col md="6">
                                        <div className="form-group">

                                            <RSelect placeholder="Ülke" />
                                        </div>
                                    </Col>
                                    <Col md="6">
                                        <div className="form-group">

                                            <div className="form-control-wrap">
                                                <Input type="text" id="default-0" placeholder="Posta Kodu" />
                                            </div>
                                        </div>
                                    </Col>
                                    <Col md="6">
                                        <div className="form-group">

                                            <div className="form-control-wrap">
                                                <Input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Email"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </Col>
                                    <Col md="6">
                                        <div className="form-group">

                                            <div className="form-control-wrap">
                                                <Input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Telefon"
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                            <hr className="preview-hr"></hr>
                            <Col md="6">
                                <Row>
                                    <Col>
                                        <div className="form-group">

                                            <RSelect
                                                placeholder="Ürünlerden Ekle"
                                                options={formattedOfferItems}
                                                onChange={(selectedOptions) => handleOfferItemChange(selectedOptions)}
                                            />

                                        </div>
                                    </Col>
                                    <Col>
                                        <button onClick={handleAddItemOffer} className="btn btn-primary btn-icon"><Icon name="plus"></Icon></button>
                                    </Col>
                                </Row>
                            </Col>
                            <div className="bg-lighter py-3 new-offer-create">
                                <Row>
                                    <Col md="12">
                                        <Row>
                                            <Col xl="2" lg="6" className="pb-xl-0 pb-3">
                                                <strong className="text-dark">Ürün Adı</strong>
                                                <hr className="d-xl-block d-none"></hr>
                                                <div className="form-group">
                                                    <div className="form-control-wrap">
                                                        <textarea
                                                            name="product_name"
                                                            value={newOfferData.product_name}
                                                            onChange={handleInputChange}
                                                            style={{ minHeight: "80px" }}
                                                            id="default-textarea"
                                                            className="no-resize form-control"
                                                            placeholder="Ürün Adı"
                                                        />
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col xl="3" lg="6" className="pb-xl-0 pb-3">
                                                <strong className="text-dark">Açıklama</strong>
                                                <hr className="d-xl-block d-none"></hr>
                                                <div className="form-group">
                                                    <div className="form-control-wrap">
                                                        <textarea
                                                            name="description"
                                                            value={newOfferData.description}
                                                            onChange={handleInputChange}
                                                            style={{ minHeight: "80px" }}
                                                            id="default-textarea"
                                                            className="no-resize form-control"
                                                            placeholder="Açıklama"
                                                        />
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col xl="1" lg="6" className="pb-xl-0 pb-3">
                                                <strong className="text-dark">Adet</strong>
                                                <hr className="d-xl-block d-none"></hr>
                                                <div className="form-group">

                                                    <div className="form-control-wrap">
                                                        <input name="quantity" value={newOfferData.quantity} onChange={handleInputChange} id="default-0" placeholder="Adet" type="text" className="form-control" />
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col xl="2" lg="6" className="pb-xl-0 pb-3">
                                                <strong className="text-dark">Birim Fiyat (Vergi Dahil)</strong>
                                                <hr className="d-xl-block d-none"></hr>
                                                <div className="form-group">

                                                    <div className="form-control-wrap">
                                                        <input name="unit_price" value={newOfferData.unit_price} onChange={handleInputChange} id="default-0" placeholder="Tutar" type="text" className="form-control" />
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col xl="2" lg="6" className="pb-xl-0 pb-3">
                                                <strong className="text-dark">Vergi</strong>
                                                <hr className="d-xl-block d-none"></hr>
                                                <div className="form-group">

                                                    <div className="form-control-wrap">
                                                        <RSelect value={selectedTax} options={taxData}
                                                            onChange={(selectedOption) => handleTaxChange(selectedOption)} placeholder="Vergi" />
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col xl="1" lg="6" className="pb-xl-0 pb-3">
                                                <strong className="text-dark">Tutar</strong>
                                                <hr className="d-xl-block d-none"></hr>

                                            </Col>
                                            <Col xl="1" lg="6" className="pb-xl-0 pb-3">
                                                <strong className="text-dark"></strong>
                                                <hr className="d-xl-block d-none"></hr>

                                                <button onClick={handleAddOffer} className="btn btn-primary btn-icon d-xl-flex d-none"><Icon name="check"></Icon></button>
                                                <button onClick={handleAddOffer} className="btn btn-primary d-xl-none d-block">Yeni Fatura Ekle</button>
                                            </Col>
                                        </Row>

                                    </Col>
                                </Row>
                            </div>
                            {offer.map((item, i) => (
                                <div key={i} className=" py-3 new-offer-create">
                                    <Row>
                                        <Col md="12">
                                            <Row>
                                                <Col xl="2" lg="6" className="pb-xl-0 pb-3">
                                                    <strong className="text-dark">Ürün Adı</strong>
                                                    <hr className="d-xl-block d-none"></hr>
                                                    <div className="form-group">

                                                        <div className="form-control-wrap">
                                                            <textarea readOnly value={item.product_name} name="productName" style={{ minHeight: "80px" }} id="default-textarea" className="no-resize form-control"
                                                                placeholder="Ürün Adı">
                                                            </textarea>
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col xl="3" lg="6" className="pb-xl-0 pb-3">
                                                    <strong className="text-dark">Açıklama</strong>
                                                    <hr className="d-xl-block d-none"></hr>
                                                    <div className="form-group ">

                                                        <div className="form-control-wrap">
                                                            <textarea readOnly value={item.description} name="comment" style={{ minHeight: "80px" }} id="default-textarea" className="no-resize form-control"
                                                                placeholder="Açıklama">
                                                            </textarea>
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col xl="1" lg="6" className="pb-xl-0 pb-3">
                                                    <strong className="text-dark">Adet</strong>
                                                    <hr className="d-xl-block d-none"></hr>
                                                    <div className="form-group">

                                                        <div className="form-control-wrap">
                                                            <input readOnly value={item.quantity} name="piece" id="default-0" placeholder="Adet" type="text" className="form-control" />
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col xl="2" lg="6" className="pb-xl-0 pb-3">
                                                    <strong className="text-dark">Birim Fiyat (Vergi Dahil)</strong>
                                                    <hr className="d-xl-block d-none"></hr>
                                                    <div className="form-group">

                                                        <div className="form-control-wrap">
                                                            <input readOnly value={item.unit_price} name="price" id="default-0" placeholder="Tutar" type="text" className="form-control" />
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col xl="2" lg="6" className="pb-xl-0 pb-3">
                                                    <strong className="text-dark">Vergi</strong>
                                                    <hr className="d-xl-block d-none"></hr>
                                                    <div className="form-group">

                                                        <div className="form-control-wrap">
                                                            <input className="form-control" readOnly value={item.tax} placeholder="Vergi" />
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col xl="1" lg="6" className="pb-xl-0 pb-3">
                                                    <strong className="text-dark">Tutar</strong>
                                                    <hr className="d-xl-block d-none"></hr>

                                                    <p>{(parseFloat(item.quantity) * parseFloat(item.unit_price) * ((parseFloat(item.tax) + 100) / 100)).toFixed(2)}₺</p>
                                                </Col>
                                                <Col xl="1" lg="6" className="pb-xl-0 pb-3">
                                                    <strong className="text-dark"></strong>
                                                    <hr className="d-xl-block d-none"></hr>
                                                    <button onClick={() => handleDeleteOffer(item.id)} className="btn btn-primary btn-icon d-xl-flex d-none"><Icon name="trash-fill"></Icon></button>
                                                    <Button onClick={() => handleDeleteOffer(item.id)} className="d-xl-none d-block" color="danger">Faturayı Sil</Button>
                                                </Col>
                                            </Row>

                                        </Col>
                                    </Row>
                                </div>
                            ))}
                            {offer.length > 0 && (
                                <Row>

                                    <Col xl="6" className="d-xl-block d-none">
                                    </Col>
                                    <Col xl="6" className="mt-0">
                                        <hr className=""></hr>
                                        <div className="d-flex justify-content-xl-end justify-content-between">
                                            <strong className="px-2">
                                                Ara Toplam</strong>
                                            <strong className="px-2">{calculateSubtotal()}₺</strong>
                                        </div>
                                    </Col>
                                    <Col xl="6" className="d-xl-block d-none">
                                    </Col>
                                    <Col xl="6" className="mt-0">
                                        <hr className=""></hr>
                                        <div className="d-flex justify-content-xl-end justify-content-between align-items-center">

                                            <div className="form-group mb-0" style={{ width: "105px" }}>

                                                <div className="form-control-wrap">
                                                    <RSelect value={discount} options={discountData}
                                                        onChange={(selectedOption) => handleDiscountChange(selectedOption)} placeholder="İndirim" />
                                                </div>
                                            </div>
                                            <strong className="px-2">-{calculateDiscountSubtotal()}₺</strong>
                                        </div>
                                    </Col>
                                    <Col xl="6" className="d-xl-block d-none">
                                    </Col>
                                    <Col xl="6" className="mt-0">
                                        <hr className=""></hr>
                                        <div className="d-flex justify-content-xl-end justify-content-between" >
                                            <strong className="px-2">
                                                Toplam</strong>
                                            <strong className="px-2">{(calculateSubtotal() - calculateDiscountSubtotal()).toFixed(2)}₺</strong>
                                        </div>
                                    </Col>
                                    <Col sm="12" className="mt-0">

                                        <hr className=""></hr>
                                        <div className="d-flex justify-content-xl-end justify-content-between">
                                            <ButtonToolbar className="g-2">
                                                <ButtonGroup>
                                                    <Button outline color="secondary">Vazgeç</Button>
                                                </ButtonGroup>
                                                <ButtonGroup>
                                                    <Button color="primary">Kaydet</Button>
                                                </ButtonGroup>
                                            </ButtonToolbar>
                                        </div>
                                    </Col>

                                </Row>
                            )}

                        </Row>
                    </form>


                </PreviewCard>
            </Block>

        </Content>
    )
}

export default NewOffersPage
