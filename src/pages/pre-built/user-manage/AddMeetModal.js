import React, { useEffect, useState, forwardRef } from "react";
import { Modal, ModalBody, Form } from "reactstrap";
import DatePicker from "react-datepicker";
import { Icon, Col, Button, RSelect as OriginalRSelect } from "../../../components/Component";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BASE_URL = "https://tiosone.com/customers/api/";

const RSelect = forwardRef((props, ref) => <OriginalRSelect innerRef={ref} {...props} />);

const AddMeetModal = ({ modal, closeModal, userId, onSubmit }) => {
    const contactType = [
        { value: "phone", label: "Telefon" },
        { value: "email", label: "Email" },
        { value: "face", label: "Yüz Yüze" },
        { value: "social_media", label: "Sosyal Medya" },
        { value: "other", label: "Diğer" },
    ];

    const { register, handleSubmit, reset, control, formState: { errors } } = useForm();
    const [startDate, setStartDate] = useState(null);

    useEffect(() => {
        reset();
    }, [modal, reset]);

    const refreshAccessToken = async () => {
        const refreshToken = localStorage.getItem('refreshToken');

        if (!refreshToken) {
            console.error('No refresh token found in local storage.');
            window.location.href = '/auth-login';
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
                window.location.href = '/auth-login';
            } else {
                console.error("Error refreshing access token", error);
            }
            return null;
        }
    };

    const formatDate = (date, time) => {
        const pad = (n) => (n < 10 ? '0' : '') + n;
        const day = pad(date.getDate());
        const month = pad(date.getMonth() + 1);
        const year = date.getFullYear();
        const hours = pad(time.getHours());
        const minutes = pad(time.getMinutes());
        const seconds = pad(time.getSeconds());
        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    };



    const handleFormSubmit = async (form) => {
        let accessToken = localStorage.getItem('accessToken');
        const { contact_type, content } = form;
        const currentTime = new Date();

        let submittedData = {
            date: startDate ? formatDate(startDate, currentTime) : null,
            contact_type: contact_type.value,
            content: content,
            person: userId,
        };

        console.log("Submitted Data:", submittedData);

        try {
            const response = await axios.post(BASE_URL + `contact_histories/`, submittedData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            console.log("API Response:", response.data);
            resetForm();
            closeModal();
            toast.success("Görüşme Kaydı Başarıyla Eklendi", {
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
                        const response = await axios.post(BASE_URL + `contact_histories/`, submittedData, {
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${accessToken}`
                            }
                        });
                        console.log("API Response:", response.data);
                        resetForm();
                        closeModal();
                        toast.success("Görüşme Kaydı Başarıyla Eklendi", {
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
                toast.error("Görüşme Kaydı Eklenirken Bir Hata Oluştu.", {
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



    const resetForm = () => {
        setStartDate(null);
        reset();
    };

    return (
        <Modal isOpen={modal} toggle={() => closeModal()} className="modal-dialog-centered" size="lg">
            <ModalBody>
                <a
                    href="#cancel"
                    onClick={(ev) => {
                        ev.preventDefault();
                        closeModal();
                    }}
                    className="close"
                >
                    <Icon name="cross-sm"></Icon>
                </a>
                <div className="p-2">
                    <h5 className="title">Görüşme Kaydı Ekle</h5>
                    <div className="mt-4">
                        <Form className="row gy-4" noValidate onSubmit={handleSubmit(handleFormSubmit)}>
                            <Col md="6">
                                <div className="form-group">
                                    <label htmlFor="contact_date" className="form-label text-soft">
                                        Görüşme Tarihi
                                    </label>
                                    <div className="form-control-wrap">
                                        <Controller
                                            name="date"
                                            control={control}
                                            render={({ field }) => (
                                                <DatePicker
                                                    selected={startDate}
                                                    onChange={(date) => {
                                                        setStartDate(date);
                                                        field.onChange(date);
                                                    }}
                                                    className="form-control"
                                                    placeholderText="Görüşme Tarihi"
                                                    dateFormat="dd/MM/yyyy"
                                                />
                                            )}
                                            rules={{ required: "Görüşme tarihi gereklidir." }}
                                        />
                                        {errors.date && <span className="text-danger">{errors.date.message}</span>}
                                    </div>
                                </div>
                            </Col>
                            <Col md="6">
                                <div className="form-group">
                                    <label htmlFor="contact_type" className="form-label text-soft">
                                        Görüşme Türü
                                    </label>
                                    <div className="form-control-wrap">
                                        <Controller
                                            name="contact_type"
                                            control={control}
                                            render={({ field }) => (
                                                <RSelect
                                                    {...field}
                                                    options={contactType}
                                                    placeholder="Görüşme Türü"
                                                />
                                            )}
                                            rules={{ required: "Görüşme türü gereklidir." }}
                                        />
                                        {errors.contact_type && <span className="text-danger">{errors.contact_type.message}</span>}
                                    </div>
                                </div>
                            </Col>
                            <Col md="12">
                                <div className="form-group">
                                    <label htmlFor="content" className="form-label text-soft">
                                        Görüşme Notları
                                    </label>
                                    <textarea
                                        {...register("content", { required: "Görüşme notları gereklidir." })}
                                        className="form-control"
                                        placeholder="Görüşme Notları..."
                                    />
                                    {errors.content && <span className="text-danger">{errors.content.message}</span>}
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
                        </Form>
                    </div>
                </div>
            </ModalBody>
        </Modal>
    );
};

export default AddMeetModal;
