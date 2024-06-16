import React, { useEffect, useState } from "react";
import {
    Modal,
    ModalBody,
    Form,
} from "reactstrap";
import DatePicker from "react-datepicker";
import {
    Icon,
    Col,
    Button,
    RSelect,
} from "../../../components/Component";
import { useForm } from "react-hook-form";


const AddMeetModal = ({ modal, closeModal, onSubmit, formData, setFormData, filterStatus }) => {
    useEffect(() => {
        reset(formData)
    }, [formData]);
    const { reset, register, handleSubmit, formState: { errors } } = useForm();
    const [startDate, setStartDate] = useState(null);
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
                    <h5 className="title">Görüşme Kaydı Ekle</h5>
                    <div className="mt-4">
                        <Form className="row gy-4" noValidate onSubmit={handleSubmit(onSubmit)}>
                            <Col md="6">
                                <div className="form-group">

                                    <div className="form-control-wrap">
                                        <DatePicker
                                            selected={startDate}
                                            onChange={(date) => setStartDate(date)}
                                            className="form-control"
                                            placeholderText="Görüşme Tarihi"
                                        />
                                    </div>
                                </div>
                            </Col>
                            <Col md="6">
                                <div className="form-group">

                                    <div className="form-control-wrap">
                                        <RSelect


                                        />
                                    </div>
                                </div>
                            </Col>

                            <Col md="12">
                                <div className="form-group">

                                    <textarea
                                        className="form-control"
                                        type="text"
                                        {...register('name', { required: "Lütfen boş alanları doldurun." })}


                                        placeholder="Görüşme Notları..." />
                                    {errors.name && <span className="invalid">{errors.name.message}</span>}
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
