import React from 'react';
import { Modal, ModalBody, Row, Col } from 'reactstrap';
import { Icon } from '../../../components/Component';

const ContactDetailsModal = ({ view, onFormCancel, formData }) => {
    return (
        <Modal isOpen={view.details} toggle={() => onFormCancel()} className="modal-dialog-centered" size="lg">
            <ModalBody>
                <a href="#cancel" className="close">
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
                        Görüşme Bilgileri <small className="text-primary"></small>
                    </h4>
                </div>
                <div className="nk-tnx-details mt-sm-3">
                    <Row className="gy-3">
                        <Col lg={4}>
                            <span className="sub-text">Tarih</span>
                            <span className="caption-text">{formData.date}</span>
                        </Col>
                        <Col lg={4}>
                            <span className="sub-text">Görüşme Türü</span>
                            <span className="caption-text">{formData.contact_type}</span>
                        </Col>
                        <Col lg={4}>
                            <span className="sub-text">Notlar</span>
                            <span className="caption-text">{formData.content}</span>
                        </Col>
                    </Row>
                </div>
            </ModalBody>
        </Modal>
    );
};

export default ContactDetailsModal;
