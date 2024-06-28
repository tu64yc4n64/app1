import React, { useState, useEffect } from "react";
import Head from "../../../layout/head/Head";
import Content from "../../../layout/content/Content";

import SimpleBar from "simplebar-react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { RSelect } from "../../../components/Component";

import api from '../../../api/api';
import "./style.css"

import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import { Card, DropdownItem, UncontrolledDropdown, DropdownMenu, DropdownToggle, Modal, ModalBody, Alert } from "reactstrap";

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


  const [user, setUser] = useState([]);

  const [regions, setRegions] = useState([]);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);

  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');

    if (!refreshToken) {
      console.error('No refresh token found in local storage.');
      window.location.href = '/auth-login'; // Refresh token yoksa login sayfasına yönlendir
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
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        console.error("Refresh token is invalid or expired. User needs to re-login.");
        window.location.href = '/auth-login'; // Hata durumunda login sayfasına yönlendir
      } else {
        console.error("Error refreshing access token", error);
      }
      return null;
    }
  };

  const getAllRegions = async () => {
    let accessToken = localStorage.getItem('accessToken');

    try {
      const response = await axios.get("https://tiosone.com/hub/api/regions/", {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });
      setRegions(response.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        accessToken = await refreshAccessToken();
        if (accessToken) {
          try {
            const response = await axios.get("https://tiosone.com/hub/api/regions/", {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
              }
            });
            setRegions(response.data);
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

  const getAllCountries = async () => {
    let accessToken = localStorage.getItem('accessToken');

    try {
      const response = await axios.get("https://tiosone.com/hub/api/countries/", {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });
      setCountries(response.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        accessToken = await refreshAccessToken();
        if (accessToken) {
          try {
            const response = await axios.get("https://tiosone.com/hub/api/countries/", {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
              }
            });
            setCountries(response.data);
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
          window.location.href = '/auth-login'; // Hata durumunda login sayfasına yönlendir
        }
      } else {
        console.error("There was an error fetching the data!", error);
      }
    }
  };


  const getAllPersons = async () => {
    let accessToken = localStorage.getItem('accessToken');

    try {
      let url = "persons/";
      let query = [];

      if (selectedFiltreCategory && selectedFiltreCategory.length > 0) {
        const categories = selectedFiltreCategory.map(item => item.label).join(',');
        query.push(`categories=${categories}`);
      }

      if (selectedFiltreTag && selectedFiltreTag.length > 0) {
        const tags = selectedFiltreTag.map(item => item.label).join(',');
        query.push(`tags=${tags}`);
      }

      if (query.length > 0) {
        url += '?' + query.join('&');
      }

      const response = await axios.get(BASE_URL + url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (response.data.length === 0) {
        toast.warning("Herhangi bir müşteri bulunamadı", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: false,
        });
      }

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
        } else {
          window.location.href = '/auth-login'; // Hata durumunda login sayfasına yönlendir
        }
      } else {
        if (error.response) {
          // Sunucudan bir yanıt alındı ve 2xx aralığında değil
          console.error("Response Error Data:", error.response.data);
          console.error("Response Status:", error.response.status);
          console.error("Response Headers:", error.response.headers);
        } else if (error.request) {
          // İstek yapıldı, ancak herhangi bir yanıt alınmadı
          console.error("Request Error:", error.request);
        } else {
          // İstek yapılandırırken bir şeyler ters gitti
          console.error('Error', error.message);
        }
        console.error("Config:", error.config);
      }
    }
  };

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
  useEffect(() => {
    getAllCategories()
    getAllTags()
    getAllRegions()
    getAllCountries()
    getAllUsers()

  }, [])


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
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const formattedCategories = formatDataForSelect(categories, "name", "id");
  const formattedTags = formatDataForSelect(tags, "name", "id");
  const formattedRegions = formatDataForSelect(regions, "display_name", "id");

  const formattedCities = formatDataForSelect(cities, "display_name", "id");
  const formattedCountries = formatDataForSelect(countries, "name", "id");
  const formattedUser = formatDataForSelect(user, "username", "id");




  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedFiltreCategory, setSelectedFiltreCategory] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(null);

  const [selectedCity, setSelectedCity] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState([]);
  const [selectedRepresentative, setSelectedRepresentative] = useState([]);


  const [selectedTag, setSelectedTag] = useState([]);
  const [selectedFiltreTag, setSelectedFiltreTag] = useState([]);
  const handleCategoryChange = (selectedOptions) => {
    setSelectedCategory(selectedOptions);
  };
  const handleFiltreCategoryChange = (selectedOptions) => {
    setSelectedFiltreCategory(selectedOptions);
    getAllPersons(); // Filtre değiştiğinde verileri yeniden getir
  };

  const handleFiltreTagChange = (selectedOptions) => {
    setSelectedFiltreTag(selectedOptions);
    getAllPersons(); // Filtre değiştiğinde verileri yeniden getir
  };
  useEffect(() => {
    getAllPersons();
  }, [selectedFiltreCategory, selectedFiltreTag]);
  const handleUserChange = (selectedOptions) => {
    setSelectedRepresentative(selectedOptions);
  };

  const handleTagChange = (selectedOptions) => {
    setSelectedTag(selectedOptions);
  };
  const handleRegionChange = async (selectedOption) => {
    setFormData({ ...formData, city: selectedOption.value });
    setSelectedRegion(selectedOption);
    const selectedOptionValue = selectedOption.value


    // İlçe API isteği
    let accessToken = localStorage.getItem('accessToken');
    try {
      const response = await axios.get(`https://tiosone.com/hub/api/cities/?region=${selectedOptionValue}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });
      setCities(response.data); // İlçeleri güncelle
      setSelectedCity(null); // İlçe seçimini sıfırla
    } catch (error) {
      if (error.response && error.response.status === 401) {
        accessToken = await refreshAccessToken();
        if (accessToken) {
          try {
            const response = await axios.get(`https://tiosone.com/hub/api/cities/?region=${selectedOptionValue}`, {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
              }
            });
            setCities(response.data);
            setSelectedCity(null);
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

  const handleCityChange = (selectedOptions) => {
    setSelectedCity(selectedOptions);
  };
  const handleCountryChange = (selectedOptions) => {
    setSelectedCountry(selectedOptions);
  };



  const [sm, updateSm] = useState(false);
  const [startDate, setStartDate] = useState();
  const [itemPerPage, setItemPerPage] = useState(10);
  const [onSearch, setonSearch] = useState(true);
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
    categories: [],
    tags: [],
    country: null,
    city: null,
    district: null,
    address_line: "",
    phone: "",
    email: "",
    website: "",
    is_active: null,
    customer_representatives: [],

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
    setSelectedRegion([])
    setSelectedCity([])
    setSelectedCountry([])
    setSelectedCategory([])
    setSelectedTag([])
    setStartDate()
    setFormData({
      first_name: "",
      last_name: "",
      company: "",
      department: "",
      job_title: "",
      categories: [],
      tags: [],
      country: null,
      city: null,
      district: null,
      address_line: "",
      phone: "",
      email: "",
      website: "",
      is_active: null,
      customer_representatives: []
    });

    reset({});
  };


  const onFormSubmit = async (form) => {
    let accessToken = localStorage.getItem('accessToken');

    const { first_name, last_name, job_title, email, phone, address_line } = form;

    let submittedData = {
      first_name: first_name,
      last_name: last_name,
      job_title: job_title,
      categories: selectedCategory.map((category) => category.value),
      tags: selectedTag.map((tag) => tag.value),
      country: selectedCountry ? selectedCountry.value : null,
      city: selectedRegion ? selectedRegion.value : null,
      district: selectedCity ? selectedCity.value : null,
      address_line: address_line,
      phone: phone,
      email: email,
      website: "",
      is_active: true,
      added_by: [1],
      customer_representatives: selectedRepresentative.map((representative) => representative.value),
    };


    try {
      const response = await axios.post(BASE_URL + "persons/", submittedData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });
      setData([response.data, ...data]);
      setOriginalData([response.data, ...data]);
      setView({ open: false });

      toast.success("Kişi Başarıyla Eklendi", {
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
      if (error.response && error.response.status === 401) {
        accessToken = await refreshAccessToken();
        if (accessToken) {
          try {
            const response = await axios.post(BASE_URL + "persons/", submittedData, {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
              }
            });
            setData([response.data, ...data]);
            setOriginalData([response.data, ...data]);
            setView({ open: false });

            toast.success("Kişi Başarıyla Eklendi", {
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: false,
            });

            resetForm();
          } catch (retryError) {
            console.error("Retry error after refreshing token", retryError);
          }
        } else {
          window.location.href = '/auth-login'; // Hata durumunda login sayfasına yönlendir
        }
      } else {
        console.error("Response Error:", error.response.data);
        console.error("Response Status:", error.response.status);
        console.error("Response Headers:", error.response.headers);
        toast.error("Kişi Eklenirken Bir Hata Oluştu.", {
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
          company: formData.company,
          department: formData.department,
          job_title: formData.job_title,
          categories: formData.categories.map(category => category.value || category), // ID'leri alıyoruz
          tags: formData.tags.map(tag => tag.value || tag), // ID'leri alıyoruz
          country: formData.country,
          city: formData.city,
          district: formData.district,
          address_line: formData.address_line,
          phone: formData.phone,
          email: formData.email,
          website: formData.website,
          is_active: formData.is_active,
          customer_representatives: formData.customer_representatives.map(representative => representative.value || representative),
          added_by: [1],
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

      toast.success("Kişi Başarıyla Güncellendi", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: false,
      });
      newItems[index] = response.data;
      setData(newItems);
      setOriginalData(newItems);
      resetForm();
      setView({ edit: false, add: false });
    } catch (error) {
      console.error('Veritabanını güncelleme sırasında hata oluştu:', error);
      toast.error("Kişi Güncellenirken Bir Hata Oluştu.", {
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



  const onEditClick = (id) => {
    data.forEach((item) => {
      if (item.id === id) {
        setFormData({
          first_name: item.first_name,
          last_name: item.last_name,
          company: item.company,
          department: item.department,
          job_title: item.job_title,
          categories: item.categories,
          tags: item.tags,
          country: item.country,
          city: item.city,
          district: item.district,
          address_line: item.address_line,
          phone: item.phone,
          email: item.email,
          website: item.website,
          is_active: item.is_active,
          customer_representatives: item.customer_representatives,

        });

        // Yeni eklenen kodlar
        setSelectedRegion(formattedRegions.find(region => region.value === item.city));
        setSelectedCity(formattedCities.find(city => city.value === item.district));
        setSelectedCountry(formattedCountries.find(country => country.value === item.country));
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
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertColor, setAlertColor] = useState("");
  // function to delete a product

  const deletePersons = async (id) => {
    let accessToken = localStorage.getItem('accessToken');

    const deletePersonRequest = async (token) => {
      await axios.delete(`${BASE_URL}persons/${id}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    };

    try {
      await deletePersonRequest(accessToken);
      let updatedData = data.filter((item) => item.id !== id);
      setData([...updatedData]);
      setOriginalData([...updatedData]);
      toast.warning("Kişi Başarıyla Silindi", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: false,
      });
    } catch (error) {
      if (error.response && error.response.status === 401) {
        accessToken = await refreshAccessToken();
        if (accessToken) {
          try {
            await deletePersonRequest(accessToken);
            let updatedData = data.filter((item) => item.id !== id);
            setData([...updatedData]);
            setOriginalData([...updatedData]);
            toast.warning("Kişi Başarıyla Silindi", {
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: false,
            });
          } catch (retryError) {
            console.error("Retry error after refreshing token", retryError);
            toast.error("Ürün Silinirken Bir Hata Oluştu.", {
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: false,
            });
          }
        } else {
          window.location.href = '/auth-login'; // Hata durumunda login sayfasına yönlendir
        }
      } else {
        console.error("There was an error deleting the product!", error);
        toast.error("Ürün Silinirken Bir Hata Oluştu.", {
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



  // function to delete the seletected item
  const selectordeletePersons = () => {
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
      <Head title="PersonPage"></Head>
      <Content>


        <ToastContainer />
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle>Kişiler</BlockTitle>
              <div className="nk-block-des text-soft"><p>Toplam {currentItems.length} kişi</p></div>

            </BlockHeadContent>

            <BlockHeadContent>
              <div className="toggle-wrap nk-block-tools-toggle">

                <div className="">
                  <Button
                    className="toggle d-inline-flex"
                    color="primary"
                    onClick={() => {
                      toggle("add");
                    }}
                  >

                    <span>Yeni Kişi Ekle</span>
                  </Button>




                </div>
              </div>
            </BlockHeadContent>

          </BlockBetween>

        </BlockHead>
        <ul className="nk-block-tools persons-tools-ul d-md-flex d-inline-block" style={{ paddingBottom: "1.75rem" }}>
          <li>
            <div className="form-control-wrap">
              <div className="form-icon form-icon-left">
                <Icon name="search"></Icon>
              </div>
              <input
                type="text"
                className="form-control "
                id="default-04"
                placeholder="Kişilerde Ara..."
                onChange={(e) => onFilterChange(e)}
              />
            </div>
          </li>

          <li>
            <div className="form-group">

              <RSelect
                name="category"
                isMulti
                placeholder="Kategori"
                options={formattedCategories}
                onChange={(selectedOptions) => handleFiltreCategoryChange(selectedOptions)}
                value={selectedFiltreCategory}
              />
            </div>
          </li>
          <li className="d-md-inline-block d-none">
            <div className="form-group">

              <RSelect
                name="tag"
                isMulti
                placeholder="Etiket"
                options={formattedTags}
                onChange={(selectedOptions) => handleFiltreTagChange(selectedOptions)}
                value={selectedFiltreTag}
              />
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
                      <DataTableRow size="sm">
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
                          <li className="me-n1 d-none">
                            <UncontrolledDropdown>
                              <DropdownToggle
                                tag="a"
                                href="#toggle"
                                onClick={(ev) => ev.preventDefault()}
                                className="dropdown-toggle btn btn-icon btn-trigger"
                              >
                                <Icon name="more-h"></Icon>
                              </DropdownToggle>
                              <DropdownMenu className="" end>
                                <ul className="link-list-opt no-bdr ">
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
                                        selectordeletePersons();
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
                                <span className="tb-product" style={{ flexDirection: "column", display: "flex", alignItems: "start" }}>

                                  <span className="title">{item.first_name} {item.last_name}</span>
                                  <small className="text-soft">{item.email}</small>
                                </span>
                              </Link>

                            </DataTableRow>

                            <DataTableRow size="md">
                              <span className="tb-sub">{item.phone}</span>
                            </DataTableRow>
                            <DataTableRow>
                              {item.categories && item.categories.length > 0 && item.categories.map((categoryId, index) => {
                                const category = categories.find(cat => cat.id === categoryId);
                                return category ? (
                                  <span key={index} className="badge bg-outline-secondary me-1">
                                    {category.name}
                                  </span>
                                ) : null;
                              })}
                            </DataTableRow>
                            <DataTableRow size="sm">
                              {item.tags && item.tags.length > 0 && item.tags.map((tagId, index) => {
                                const tag = tags.find(tag => tag.id === tagId);
                                return tag ? (
                                  <span key={index} className="badge bg-outline-secondary me-1">
                                    {tag.name}
                                  </span>
                                ) : null;
                              })}
                            </DataTableRow>
                            <DataTableRow size="md">
                              {(() => {
                                const region = regions.find(reg => reg.id === item.city);
                                return (
                                  <span className="tb-sub"> {region ? region.name : ''}</span>

                                );
                              })()}
                            </DataTableRow>
                            <DataTableRow size="md">
                              {item.customer_representatives && item.customer_representatives.length > 0 && item.customer_representatives.map((representativeId, index) => {
                                const representative = user.find(cat => cat.id === representativeId);
                                return representative ? (
                                  <span key={index} className="badge bg-outline-secondary me-1">
                                    {representative.username}
                                  </span>
                                ) : null;
                              })}
                            </DataTableRow>
                            <DataTableRow size="md">
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
                                              deletePersons(item.id);
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
              <h5 className="title">Kişiyi Düzenle</h5>
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
                        <label className="form-label">
                          Kategori
                        </label>
                        <div className="form-control-wrap">
                          <RSelect
                            placeholder="Kategori"
                            isMulti
                            options={formattedCategories}
                            value={formData.categories.map(categoryId => formattedCategories.find(category => category.value === categoryId))}
                            onChange={(selectedOptions) => setFormData({
                              ...formData,
                              categories: selectedOptions.map(option => option.value)
                            })}
                          />
                        </div>
                      </div>
                    </Col>
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label">
                          Etiket
                        </label>
                        <div className="form-control-wrap">
                          <RSelect
                            placeholder="Etiket"
                            isMulti
                            options={formattedTags}
                            value={formData.tags.length > 0 ? formData.tags.map(tagId => formattedTags.find(tag => tag.value === tagId)) : []}
                            onChange={(selectedOptions) => setFormData({
                              ...formData,
                              tags: selectedOptions ? selectedOptions.map(option => option.value) : []
                            })}
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
                          <RSelect
                            placeholder="Ülke"
                            options={formattedCountries}
                            value={formattedCountries.find(option => option.value === formData.country)}
                            onChange={(selectedOption) => {
                              setFormData({ ...formData, country: selectedOption.value });
                              setSelectedCountry(selectedOption);
                            }}
                          />
                        </div>
                      </div>
                    </Col>
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="sehir">
                          Şehir
                        </label>
                        <div className="form-control-wrap">
                          <RSelect
                            placeholder="Şehir"
                            options={formattedRegions}
                            value={formattedRegions.find(option => option.value === formData.city)}
                            onChange={(selectedOption) => {
                              setFormData({ ...formData, city: selectedOption.value });
                              setSelectedRegion(selectedOption);
                            }}
                          />
                        </div>
                      </div>
                    </Col>
                    <Col lg="4">
                      <div className="form-group">
                        <label className="form-label" htmlFor="ilce">
                          İlçe
                        </label>
                        <div className="form-control-wrap">
                          <RSelect
                            placeholder="İlçe"
                            options={formattedCities}
                            value={formattedCities.find(option => option.value === formData.district)}
                            onChange={(selectedOption) => {
                              setFormData({ ...formData, district: selectedOption.value });
                              setSelectedCity(selectedOption);
                            }}
                          />
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
                            placeholder="Durum"
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
                            placeholder="Temsilci"
                            isMulti
                            options={formattedUser}
                            value={formData.customer_representatives.map(representativeId => formattedUser.find(representative => representative.value === representativeId))}
                            onChange={(selectedOptions) => setFormData({
                              ...formData,
                              customer_representatives: selectedOptions.map(option => option.value)
                            })}
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
                  <span className="sub-text">Ünvan</span>
                  <span className="caption-text">{formData.job_title}</span>
                </Col>

                <Col lg={4}>
                  <span className="sub-text">Kategori</span>
                  <span className="caption-text">
                    {formData.categories.map((categoryId, index) => {
                      const category = categories.find(cat => cat.id === categoryId);
                      return category ? (
                        <span key={index} className="badge bg-outline-secondary me-1">
                          {category.name}
                        </span>
                      ) : null;
                    })}
                  </span>
                </Col>
                <Col lg={4}>
                  <span className="sub-text">Etiket</span>
                  <span className="caption-text">
                    {formData.tags.map((tagId, index) => {
                      const tag = tags.find(cat => cat.id === tagId);
                      return tag ? (
                        <span key={index} className="badge bg-outline-secondary me-1">
                          {tag.name}
                        </span>
                      ) : null;
                    })}
                  </span>
                </Col>
                <Col lg={4}>
                  <span className="sub-text">Ülke</span>
                  {(() => {
                    const country = countries.find(reg => reg.id === formData.country);
                    return (
                      <span className="caption-text"> {country ? country.name : ''}</span>

                    );
                  })()}



                </Col>
                <Col lg={4}>
                  <span className="sub-text">Şehir</span>
                  {(() => {
                    const region = regions.find(reg => reg.id === formData.city);
                    return (
                      <span className="caption-text"> {region ? region.name : ''}</span>

                    );
                  })()}



                </Col>
                <Col lg={4}>
                  <span className="sub-text">İlçe</span>
                  {(() => {
                    const city = cities.find(reg => reg.id === formData.district);
                    return (
                      <span className="caption-text"> {city ? city.name : ''}</span>

                    );
                  })()}



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
                    {formData.customer_representatives.map((representativeId, index) => {
                      const representative = user.find(rep => rep.id === representativeId);
                      return representative ? (
                        <span key={index} className="badge bg-outline-secondary me-1">
                          {representative.username}
                        </span>
                      ) : null;
                    })}
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

                      Adı*

                    </label>
                    <div className="form-control-wrap">
                      <input
                        type="text"
                        className="form-control"
                        {...register('first_name', {
                          required: "Lütfen boş bırakılan alanları doldurunuz.",
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

                      Soyadı*

                    </label>
                    <div className="form-control-wrap">
                      <input
                        id="soyadi"
                        type="text"
                        className="form-control"
                        {...register('last_name', {
                          required: "Lütfen boş bırakılan alanları doldurunuz.",
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

                      Email Adresi*

                    </label>
                    <div className="form-control-wrap">
                      <input
                        id="mail"
                        type="text"
                        className="form-control"
                        {...register('email', {
                          required: "Lütfen boş bırakılan alanları doldurunuz.",
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
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />

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
                        value={formData.website}
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

                      Temsilci

                    </label>

                    <div className="form-control-wrap">
                      <RSelect
                        name="representative"
                        isMulti
                        placeholder="Temsilci"
                        options={formattedUser}
                        onChange={(selectedOptions) => handleUserChange(selectedOptions)}
                        value={selectedRepresentative}
                      />
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
                <Col size="12">
                  <div className="form-group">
                    <label className="form-label text-soft">

                      Ülke

                    </label>

                    <div className="form-control-wrap">
                      <RSelect
                        name="ulke"
                        placeholder="Ülke"
                        options={formattedCountries}
                        onChange={(selectedOptions) => handleCountryChange(selectedOptions)}
                        value={selectedCountry}
                      />

                    </div>
                  </div>
                </Col>
                <Col size="12">
                  <div className="form-group">
                    <label className="form-label text-soft">

                      Şehir

                    </label>

                    <div className="form-control-wrap">
                      <RSelect
                        name="sehir"

                        placeholder="Şehir"
                        options={formattedRegions}
                        onChange={(selectedOptions) => handleRegionChange(selectedOptions)}
                        value={selectedRegion}
                      />

                    </div>
                  </div>
                </Col>
                <Col size="12">
                  <div className="form-group">
                    <label className="form-label text-soft">

                      İlçe

                    </label>

                    <div className="form-control-wrap">
                      <RSelect
                        name="ilce"
                        placeholder="İlçe"
                        options={formattedCities}
                        onChange={(selectedOptions) => handleCityChange(selectedOptions)}
                        value={selectedCity}
                        isDisabled={selectedRegion ? false : true}
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
