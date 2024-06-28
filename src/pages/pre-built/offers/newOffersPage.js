
import React, { useState, useEffect } from "react";
import Content from "../../../layout/content/Content";
import { Input, Row, Col, ButtonGroup, ButtonToolbar } from "reactstrap";
import DatePicker from "react-datepicker";
import {
    Block,
    BlockHead,
    BlockHeadContent,
    BlockTitle,
    Icon,
    Button,
    BlockBetween,
    PreviewCard,
    RSelect
} from "../../../components/Component";
import { ToastContainer, toast } from 'react-toastify';
import AddProductModal from "./AddProductModal"
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import { useForm } from "react-hook-form";
import "./style.css"
import { NumericFormat } from 'react-number-format';
const BASE_URL = "https://tiosone.com/sales/api/"


const NewOffersPage = () => {
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [data, setData] = useState([]);
    const [tax, setTax] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([])

    const axiosInstance = axios.create();
    axiosInstance.interceptors.response.use(
        response => response,
        async error => {
            if (error.response && error.response.status === 401) {
                // Token'ı yenile
                let accessToken = await refreshAccessToken();
                if (accessToken) {
                    error.config.headers['Authorization'] = `Bearer ${accessToken}`;
                    return axios(error.config);
                } else {
                    window.location.href = '/auth-login'; // Hata durumunda login sayfasına yönlendir
                }
            }
            return Promise.reject(error);
        }
    );
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
            const response = await axiosInstance.get("https://tiosone.com/hub/api/taxrates/", {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            setTax(response.data);
        } catch (error) {
            console.error("There was an error fetching the data!", error);
        }
    };
    const getAllProducts = async () => {
        let accessToken = localStorage.getItem('accessToken');

        try {
            const response = await axiosInstance.get("https://tiosone.com/products/api/products/", {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            setProducts(response.data);
        } catch (error) {
            console.error("There was an error fetching the data!", error);
        }
    };
    const getAllCustomers = async () => {
        let accessToken = localStorage.getItem('accessToken');

        try {
            const response = await axiosInstance.get("https://tiosone.com/customers/api/customers/", {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            setCustomers(response.data);
        } catch (error) {
            console.error("There was an error fetching the data!", error);
        }
    };
    const getAllCategories = async () => {
        let accessToken = localStorage.getItem('accessToken');

        try {
            const response = await axiosInstance.get(BASE_URL + "categories?type=offer", {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            setCategories(response.data);
        } catch (error) {
            console.error("There was an error fetching the data!", error);
        }
    };
    const getAllTags = async () => {
        let accessToken = localStorage.getItem('accessToken');

        try {
            const response = await axiosInstance.get(BASE_URL + "tags?type=offer", {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            setTags(response.data);
        } catch (error) {
            console.error("There was an error fetching the data!", error);
        }
    };
    const getAllOfferItems = async () => {
        let accessToken = localStorage.getItem('accessToken');
        try {
            const response = await axiosInstance.get(BASE_URL + "offer-items/", {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            setData(response.data);
        } catch (error) {
            console.error("There was an error fetching the data!", error);
        }
    };
    const getAllUSers = async () => {
        let accessToken = localStorage.getItem('accessToken');
        try {
            const response = await axiosInstance.get("https://tiosone.com/users/api/users/", {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            setUsers(response.data);
        } catch (error) {
            console.error("There was an error fetching the data!", error);
        }
    };
    useEffect(() => {
        getAllOfferItems();
        getAllUSers();
        getAllTax();
        getAllCustomers()
        getAllCategories();
        getAllTags();
        getAllProducts();
    }, []);
    const handleEditChange = (values, id, fieldName) => {
        if (values && values.value !== undefined) {
            const value = values.value;
            setOffer(prevOffer => {
                const newOffer = prevOffer.map(item =>
                    item.id === id ? { ...item, [fieldName]: value } : item
                );

                return newOffer.map(item => {
                    if (item.id === id) {
                        const quantity = parseFloat(item.quantity) || 0;
                        const unit_price = parseFloat(item.unit_price) || 0;
                        const tax = parseFloat(item.tax.value) || 0; // Değeri buradan al
                        item.total = (quantity * unit_price * ((tax + 100) / 100)).toFixed(2);
                    }
                    return item;
                });
            });
        } else if (values && values.target) {
            const { name, value } = values.target;
            setOffer(prevOffer => {
                const newOffer = prevOffer.map(item =>
                    item.id === id ? { ...item, [name]: value } : item
                );

                return newOffer.map(item => {
                    if (item.id === id) {
                        const quantity = parseFloat(item.quantity) || 0;
                        const unit_price = parseFloat(item.unit_price) || 0;
                        const tax = parseFloat(item.tax.value) || 0; // Değeri buradan al
                        item.total = (quantity * unit_price * ((tax + 100) / 100)).toFixed(2);
                    }
                    return item;
                });
            });
        }
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
    const formatDate = (date) => {
        if (!date) return '';
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Aylar 0'dan başlar, bu yüzden +1 eklenir
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };
    const formatDataForSelect = (data, labelKey, valueKey) => {
        return data.map(item => ({
            value: item[valueKey],
            label: item[labelKey]
        }));
    };
    const formattedPersons = customers?.people?.map(person => ({
        value: person.id,
        label: person.first_name + ' ' + person.last_name, // Added space between first and last name
        address_line: person.address_line,
        city: person.city,
        country: person.country,
        district: person.district,
        email: person.email,
        phone: person.phone,
    })) || []; // Return an empty array if customers.people is undefined
    const formattedOfferItems = products.map(item => ({
        value: item.id,
        label: item.name,
        description: item.description,
        quantity: item.quantity,
        tax: item.tax_rate,
        total: item.total,
        unit_price: item.sale_price,

    }));
    const [selectedOfferItem, setSelectedOfferItem] = useState([]);

    const handleOfferItemChange = (selectedOption) => {
        if (selectedOption) {
            const selectedTaxRate = tax.find(taxRate => taxRate.id === selectedOption.tax);
            const formattedTaxRate = formattedTaxes.find(t => t.value === selectedTaxRate.multiplier);

            setNewOfferData({
                description: selectedOption.description,
                product: selectedOption.value,
                product_name: selectedOption.label,
                tax: selectedTaxRate,
                unit_price: selectedOption.unit_price,
            });
            setSelectedTax(formattedTaxRate); // Vergi değerini state'e atama
        }
        setSelectedOfferItem(selectedOption); // Seçilen değeri ayarla
    };


    const [users, setUsers] = useState([])
    const formattedUsers = formatDataForSelect(users, "username", "id");
    const [selectedCategory, setSelectedCategory] = useState(null);

    const [selectedTag, setSelectedTag] = useState([]);
    const formattedCategories = formatDataForSelect(categories, "name", "id");

    const formattedTags = formatDataForSelect(tags, "name", "id");
    const formattedTaxes = formatDataForSelect(tax, "rate", "multiplier");

    const formattedCustomer = formatDataForSelect(customers.companies || [], "name", "id");
    const formattedCustomers = [...formattedPersons, ...formattedCustomer];

    const handleCategoryChange = (selectedOptions) => {
        setSelectedCategory(selectedOptions);
    };
    const handleTagChange = (selectedOptions) => {
        setSelectedTag(selectedOptions);
    };
    const [modal, setModal] = useState({
        edit: false,
        add: false,
    });
    const [formData, setFormData] = useState({
        added_by: "",
        address: "",
        category: 2,
        city: "",
        company: 1,
        country: "",
        created_at: "",
        created_by: "",
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

    const handleCustomerChange = (selectedOption) => {
        if (selectedOption) {
            const customer = formattedCustomers.find(c => c.value === selectedOption.value);
            if (customer) {
                setFormData({
                    ...formData,
                    customer: selectedOption.value,
                    address: customer.address_line,
                    customer_name: customer.label,
                    city: customer.city,
                    district: customer.district,
                    country: customer.country,
                    postal_code: customer.postal_code,  // Bu kısmı müşteri verilerinden almak yerine sabit bir değer olarak bıraktım.
                    email: customer.email,
                    phone: customer.phone,
                });
            }
        } else {
            setFormData({
                ...formData,
                customer: null,
                address: "",
                city: "",
                district: "",
                country: "",
                postal_code: "",
                email: "",
                phone: "",
            });
        }
    };
    const onFormSubmit = async (form) => {
        let accessToken = localStorage.getItem('accessToken');
        const { title, email, phone, address, status } = formData; // formData'dan gerekli verileri alın

        // Toplam değeri hesaplayın
        const total = calculateTotal();

        // Verilerin doğru formatta olduğundan emin olun
        let submittedData = {
            added_by: formData.added_by,
            address: formData.address, // formData'dan alınan adres
            category: selectedCategory ? selectedCategory.value : null, // Değiştirilen kısım
            city: formData.city, // formData'dan alınan şehir
            company: "",
            country: formData.country, // formData'dan alınan ülke
            created_at: formatDate(new Date()), // Mevcut tarihi formatla
            created_by: formData.added_by,
            customer: formData.customer, // formData'dan alınan müşteri
            customer_name: formData.customer_name,
            discount: discountValue,
            discount_type: discountType,
            district: formData.district, // formData'dan alınan ilçe
            email: formData.email, // formData'dan alınan email
            items: offer.map(item => ({
                description: item.description,
                product: item.product,
                product_name: item.product_name,
                quantity: item.quantity,
                tax: item.tax,
                total: item.total,
                unit_price: item.unit_price
            })), // offer state'ini items olarak ekle
            offer_date: formatDate(formData.offer_date), // formData'dan alınan tarihi formatla
            phone: formData.phone, // formData'dan alınan telefon
            postal_code: formData.postal_code, // formData'dan alınan posta kodu
            status: formData.status,
            tags: selectedTag.map((tag) => tag.value),
            title: formData.title, // formData'dan alınan başlık
            total: "", // Hesaplanan toplam değeri buraya ekle
            updated_at: formatDate(new Date()), // Mevcut tarihi formatla
            valid_until: formatDate(formData.valid_until), // formData'dan alınan tarihi formatla
        };

        try {
            const response = await axios.post(BASE_URL + "offers/", submittedData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            setData([response.data, ...data]);
            window.location.href = '/teklifler';
            resetForm();
        } catch (error) {
            if (error.response) {
                console.error("Response Error:", error.response.data);
                console.error("Response Status:", error.response.status);
                console.error("Response Headers:", error.response.headers);
            } else if (error.request) {
                console.error("Request Error:", error.request);
            } else {
                console.error("Error Message:", error.message);
            }
            console.error("Error Config:", error.config);
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

    const [selectedTax, setSelectedTax] = useState(null);

    const [discount, setDiscount] = useState({
        label: "0%",
        value: "0"
    });
    const [newOfferData, setNewOfferData] = useState({
        description: "",
        product: "",
        product_name: "",
        tax: "",
        unit_price: "",
        total: "",
        quantity: ""

    });
    const handleTaxChange = (selectedOption, id) => {
        setOffer(prevOffer => {
            const newOffer = prevOffer.map(item =>
                item.id === id ? { ...item, tax: { value: selectedOption.value, label: selectedOption.label } } : item
            );

            return newOffer.map(item => {
                if (item.id === id) {
                    const quantity = parseFloat(item.quantity) || 0;
                    const unit_price = parseFloat(item.unit_price) || 0;
                    const tax = parseFloat(selectedOption.value) || 0;
                    item.total = (quantity * unit_price * ((tax + 100) / 100)).toFixed(2);
                }
                return item;
            });
        });
    };

    const handleDiscountChange = (selectedOption) => {
        setDiscount(selectedOption);
    };
    const handleInputChange = (e) => {
        if (e && e.target) {
            // Standart inputlar için
            const { name, value } = e.target;
            setNewOfferData((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        } else if (e && e.value) {
            // NumericFormat için
            setNewOfferData((prevState) => ({
                ...prevState,
                unit_price: e.value,
            }));
        }
    };

    const handleAddOffer = (event) => {
        event.preventDefault();
        // Inputların boş olup olmadığını kontrol edin
        if (!newOfferData.description || !newOfferData.product_name || !newOfferData.quantity || !newOfferData.unit_price || !selectedTax) {
            toast.error("Ürün Eklenirken Bir Hata Oluştu.", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: false,
            });
            return;
        }
        const newOfferItem = {
            id: offer.length + 1, // Basit bir benzersiz id oluşturma
            description: newOfferData.description,
            product: newOfferData.product,
            product_name: newOfferData.product_name,
            tax: selectedTax,
            unit_price: newOfferData.unit_price,
            total: newOfferData.total,
            quantity: newOfferData.quantity
        };
        setOffer((prevOffer) => [...prevOffer, newOfferItem]);
        setSelectedTax(null);
        setSelectedOfferItem(null); // RSelect bileşeninin seçimini temizle
        setNewOfferData({
            description: "",
            product: "",
            product_name: "",
            tax: "",
            unit_price: "",
            total: "",
            quantity: "",
        });
    };
    const [discountValue, setDiscountValue] = useState(0);
    const [discountType, setDiscountType] = useState("percentage");
    const calculateSubtotal = () => {
        let subtotal = 0;
        offer.forEach(item => {
            const totalItemPrice = parseFloat(item.quantity) * parseFloat(item.unit_price) * (parseFloat(item.tax.value));
            subtotal += totalItemPrice;
        });
        return subtotal.toFixed(2);
    };
    const calculateDiscount = (subtotal) => {
        if (discountType === "percentage") {
            return (subtotal * (discountValue / 100)).toFixed(2);
        } else if (discountType === "amount") {
            return parseFloat(discountValue).toFixed(2);
        }
        return 0;
    };
    const calculateTotal = () => {
        const subtotal = parseFloat(calculateSubtotal());
        const discount = parseFloat(calculateDiscount(subtotal));
        return (subtotal - discount).toFixed(2);
    };
    const handleDeleteOffer = (id) => {
        setOffer(prevOffer => prevOffer.filter(item => item.id !== id));
    };
    console.log(offer)
    const addContactHistory = (newProduct) => {
        setProducts(prevProduct => [newProduct, ...prevProduct]);
    };
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    return (
        <Content>
            <ToastContainer />
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
                                            <label htmlFor="title" className="form-label text-soft">
                                                Teklif Başlığı
                                            </label>
                                            <div className="form-control-wrap">
                                                <Input
                                                    id="title"
                                                    type="text"
                                                    name="title"
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
                                            <label className="form-label text-soft">
                                                Tarih
                                            </label>
                                            <div className="form-control-wrap">
                                                <DatePicker
                                                    selected={formData.offer_date}
                                                    onChange={(date) => setFormData({ ...formData, offer_date: date })}
                                                    className="form-control"
                                                    placeholderText="Tarih"
                                                />
                                            </div>
                                        </div>
                                    </Col>
                                    <Col md="6">
                                        <div className="form-group">
                                            <label className="form-label text-soft">
                                                Geçerlilik Tarihi
                                            </label>
                                            <div className="form-control-wrap">
                                                <DatePicker
                                                    selected={formData.valid_until}
                                                    onChange={(date) => setFormData({ ...formData, valid_until: date })}
                                                    className="form-control"
                                                    placeholderText="Geçerlilik Tarihi"
                                                />
                                            </div>
                                        </div>
                                    </Col>
                                    <Col sm="12">
                                        <div className="form-group">
                                            <label className="form-label text-soft">
                                                Kategori
                                            </label>
                                            <div className="form-control-wrap">
                                                <RSelect
                                                    options={formattedCategories}
                                                    value={selectedCategory}
                                                    placeholder="Kategori"
                                                    onChange={(selectedOptions) => handleCategoryChange(selectedOptions)}
                                                />
                                            </div>
                                        </div>
                                    </Col>
                                    <Col sm="12">
                                        <div className="form-group">
                                            <label className="form-label text-soft">
                                                Etiket
                                            </label>
                                            <div className="form-control-wrap">
                                                <RSelect
                                                    isMulti
                                                    options={formattedTags}
                                                    value={selectedTag}
                                                    placeholder="Etiket"
                                                    onChange={(selectedOptions) => handleTagChange(selectedOptions)}
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
                                            <label htmlFor="status" className="form-label text-soft">
                                                Durum
                                            </label>
                                            <div className="form-control-wrap">
                                                <RSelect
                                                    name="status"
                                                    placeholder="Durum"
                                                    options={status}
                                                    onChange={(selectedOption) => setFormData({ ...formData, status: selectedOption ? selectedOption.value : null })}
                                                    value={formattedUsers.find(user => user.value === formData.status)}
                                                />
                                            </div>
                                        </div>
                                    </Col>
                                    <Col md="6">
                                        <div className="form-group">
                                            <label htmlFor="durum" className="form-label text-soft">
                                                Oluşturan
                                            </label>
                                            <div className="form-control-wrap">
                                                <RSelect
                                                    name="olusturan"
                                                    placeholder="Oluşturan"
                                                    options={formattedUsers}
                                                    onChange={(selectedOption) => setFormData({ ...formData, added_by: selectedOption ? selectedOption.value : null })}
                                                    value={formattedUsers.find(user => user.value === formData.added_by)}
                                                />
                                            </div>
                                        </div>
                                    </Col>
                                    <Col sm="12">
                                        <div className="form-group">
                                            <label htmlFor="status" className="form-label text-soft">
                                                Kime
                                            </label>
                                            <div className="form-control-wrap">
                                                <RSelect
                                                    name="status"
                                                    placeholder="Kime"
                                                    options={formattedCustomers}
                                                    onChange={handleCustomerChange}
                                                    value={formattedCustomers.find(customer => customer.value === formData.customer)}
                                                />
                                            </div>
                                        </div>
                                    </Col>
                                    <Col sm="12">
                                        <div className="form-group">
                                            <label htmlFor="adres" className="form-label text-soft">
                                                Adres
                                            </label>
                                            <div className="form-control-wrap">
                                                <Input
                                                    id="adres"
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
                                            <label className="form-label text-soft">
                                                Şehir
                                            </label>
                                            <RSelect
                                                placeholder="Şehir"
                                                value={{ label: formData.city, value: formData.city }}
                                                isDisabled
                                            />
                                        </div>
                                    </Col>
                                    <Col md="6">
                                        <div className="form-group">
                                            <label className="form-label text-soft">
                                                İlçe
                                            </label>
                                            <RSelect
                                                placeholder="İlçe"
                                                value={{ label: formData.district, value: formData.district }}
                                                isDisabled
                                            />
                                        </div>
                                    </Col>
                                    <Col md="6">
                                        <div className="form-group">
                                            <label className="form-label text-soft">
                                                Ülke
                                            </label>
                                            <RSelect
                                                placeholder="Ülke"
                                                value={{ label: formData.country, value: formData.country }}
                                                isDisabled
                                            />
                                        </div>
                                    </Col>
                                    <Col md="6">
                                        <div className="form-group">
                                            <label htmlFor="posta" className="form-label text-soft">
                                                Posta Kodu
                                            </label>
                                            <div className="form-control-wrap">
                                                <Input
                                                    type="text"
                                                    id="posta"
                                                    placeholder="Posta Kodu"
                                                    value={formData.postal_code}
                                                    onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                    </Col>
                                    <Col md="6">
                                        <div className="form-group">
                                            <label htmlFor="email" className="form-label text-soft">
                                                Email
                                            </label>
                                            <div className="form-control-wrap">
                                                <Input
                                                    id="email"
                                                    readOnly
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
                                            <label htmlFor="telefon" className="form-label text-soft">
                                                Telefon
                                            </label>
                                            <div className="form-control-wrap">
                                                <Input
                                                    id="telefon"
                                                    readOnly
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
                                                value={selectedOfferItem} // value prop'u ekledik
                                                placeholder="Ürünlerden Ekle"
                                                options={formattedOfferItems}
                                                onChange={(selectedOptions) => handleOfferItemChange(selectedOptions)}
                                            />
                                        </div>
                                    </Col>
                                    <Col>
                                        <button onClick={() => setModal({ add: true })} className="btn btn-primary btn-icon"><Icon name="plus"></Icon></button>
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
                                                        <input
                                                            name="product_name"
                                                            value={newOfferData.product_name}
                                                            onChange={handleInputChange}

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
                                                        <input
                                                            name="description"
                                                            value={newOfferData.description}
                                                            onChange={handleInputChange}
                                                            type="text"
                                                            id="description"
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
                                                        <input
                                                            name="quantity"
                                                            value={newOfferData.quantity}
                                                            onChange={handleInputChange}
                                                            id="quantity"
                                                            placeholder="Adet"
                                                            type="text"
                                                            className="form-control"
                                                        />
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col xl="2" lg="6" className="pb-xl-0 pb-3">
                                                <strong className="text-dark">Birim Fiyat (Vergi Dahil)</strong>
                                                <hr className="d-xl-block d-none"></hr>
                                                <div className="form-group">
                                                    <div className="form-control-wrap">
                                                        <NumericFormat
                                                            className="form-control"
                                                            id="alis"
                                                            thousandSeparator="."
                                                            decimalSeparator=","
                                                            value={newOfferData.unit_price}
                                                            onValueChange={handleInputChange}
                                                            placeholder="Alış Fiyatı (KDV Dahil)"
                                                        />

                                                    </div>
                                                </div>
                                            </Col>
                                            <Col xl="2" lg="6" className="pb-xl-0 pb-3">
                                                <strong className="text-dark">Vergi</strong>
                                                <hr className="d-xl-block d-none"></hr>
                                                <div className="form-group">
                                                    <div className="form-control-wrap">
                                                        <RSelect
                                                            value={selectedTax} // Seçilen vergi değerini buraya atıyoruz
                                                            options={formattedTaxes}
                                                            onChange={(selectedOption) => handleTaxChange(selectedOption)}
                                                            placeholder="Vergi"
                                                        />

                                                    </div>
                                                </div>
                                            </Col>
                                            <Col xl="1" lg="6" className="pb-xl-0 pb-3">
                                                <strong className="text-dark"></strong>
                                                <hr className="d-xl-block d-none"></hr>
                                                <button type="button" onClick={handleAddOffer} className="btn btn-primary btn-icon d-xl-flex d-none"><Icon name="check"></Icon></button>
                                                <button type="button" onClick={handleAddOffer} className="btn btn-primary d-xl-none d-block">Yeni Fatura Ekle</button>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </div>
                            {offer.map((item) => (
                                <div key={item.id} className="py-3 new-offer-create">
                                    <Row>
                                        <Col md="12">
                                            <Row>
                                                <Col xl="2" lg="6" className="pb-xl-0 pb-3">
                                                    <div className="d-xl-none d-block">
                                                        <strong className="text-dark">Ürün Adı</strong>
                                                        <hr className="d-xl-block d-none"></hr>
                                                    </div>
                                                    <div className="form-group">
                                                        <div className="form-control-wrap">
                                                            <input
                                                                name="product_name"
                                                                value={item.product_name}
                                                                onChange={(e) => handleEditChange(e, item.id)}

                                                                id="default-textarea"
                                                                className="no-resize form-control"
                                                                placeholder="Ürün Adı"
                                                            />
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col xl="3" lg="6" className="pb-xl-0 pb-3">
                                                    <div className="d-xl-none d-block">
                                                        <strong className="text-dark">Açıklama</strong>
                                                        <hr className="d-xl-block d-none"></hr>
                                                    </div>
                                                    <div className="form-group">
                                                        <div className="form-control-wrap">
                                                            <input
                                                                name="description"
                                                                value={item.description}
                                                                onChange={(e) => handleEditChange(e, item.id)}
                                                                id="default-textarea"
                                                                className="no-resize form-control"
                                                                placeholder="Açıklama"
                                                            />
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col xl="1" lg="6" className="pb-xl-0 pb-3">
                                                    <div className="d-xl-none d-block">
                                                        <strong className="text-dark">Adet</strong>
                                                        <hr className="d-xl-block d-none"></hr>
                                                    </div>
                                                    <div className="form-group">
                                                        <div className="form-control-wrap">
                                                            <input
                                                                name="quantity"
                                                                value={item.quantity}
                                                                onChange={(e) => handleEditChange(e, item.id)}
                                                                id="default-0"
                                                                placeholder="Adet"
                                                                type="text"
                                                                className="form-control"
                                                            />
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col xl="2" lg="6" className="pb-xl-0 pb-3">
                                                    <div className="d-xl-none d-block">
                                                        <strong className="text-dark">Birim Fiyat (Vergi Dahil)</strong>
                                                        <hr className="d-xl-block d-none"></hr>
                                                    </div>
                                                    <div className="form-group">
                                                        <div className="form-control-wrap">
                                                            <NumericFormat
                                                                className="form-control"
                                                                id="default-0"
                                                                thousandSeparator="."
                                                                decimalSeparator=","
                                                                value={item.unit_price}
                                                                onValueChange={(values) => handleEditChange(values, item.id, 'unit_price')}
                                                                placeholder="Tutar"
                                                            />
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col xl="2" lg="6" className="pb-xl-0 pb-3">
                                                    <div className="d-xl-none d-block">
                                                        <strong className="text-dark">Vergi</strong>
                                                        <hr className="d-xl-block d-none"></hr>
                                                    </div>
                                                    <div className="form-group">
                                                        <div className="form-control-wrap">
                                                            <RSelect
                                                                value={item.tax && { label: item.tax.label, value: item.tax.value }}
                                                                options={formattedTaxes}
                                                                onChange={(selectedOption) => handleTaxChange(selectedOption, item.id)}
                                                                placeholder="Vergi"
                                                            />

                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col xl="1" lg="6" className="pb-xl-0 pb-3">
                                                    <div className="d-xl-none d-block">
                                                        <strong className="text-dark">Tutar</strong>
                                                        <hr className="d-xl-block d-none"></hr>
                                                    </div>
                                                    <div className="form-group">
                                                        <div className="form-control-wrap">
                                                            <input
                                                                readOnly
                                                                value={item.unit_price * item.tax.value * item.quantity}
                                                                className="form-control"
                                                                placeholder="Tutar"
                                                            />
                                                        </div>
                                                    </div>
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
                                                    <Input
                                                        type="number"
                                                        value={discountValue}
                                                        onChange={(e) => setDiscountValue(e.target.value)}
                                                        placeholder="İndirim"
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group mb-0" style={{ width: "105px" }}>
                                                <div className="form-control-wrap">
                                                    <select
                                                        className="form-control"
                                                        value={discountType}
                                                        onChange={(e) => setDiscountType(e.target.value)}
                                                    >
                                                        <option value="percentage">%</option>
                                                        <option value="amount">₺</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <strong className="px-2">-{calculateDiscount(calculateSubtotal())}₺</strong>
                                        </div>
                                    </Col>
                                    <Col xl="6" className="d-xl-block d-none">
                                    </Col>
                                    <Col xl="6" className="mt-0">
                                        <hr className=""></hr>
                                        <div className="d-flex justify-content-xl-end justify-content-between" >
                                            <strong className="px-2">
                                                Toplam</strong>
                                            <strong className="px-2">{calculateTotal()}₺</strong>
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
            <AddProductModal
                modal={modal.add}
                closeModal={() => setModal({ ...modal, add: false })}
                onSubmit={addContactHistory}
            />
        </Content>
    )
}

export default NewOffersPage
