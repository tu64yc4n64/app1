import React, { useState, useEffect } from "react";
import Head from "../../../layout/head/Head";
import Content from "../../../layout/content/Content";
import ProductH from "../../../images/avatar/a-sm.jpg"
import SimpleBar from "simplebar-react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { RSelect } from "../../../components/Component";
import DatePicker from "react-datepicker";
import api from '../../../api/api';
import Swal from "sweetalert2";
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

const PersonsDefinitions = () => {

    return (
        <>
            <Head title="PersonPage"></Head>
            <Content>
                <BlockHead size="sm">
                    <BlockBetween>
                        <BlockHeadContent>
                            <BlockTitle>Kişi Tanımlamaları</BlockTitle>
                            <div className="nk-block-des text-soft"><p>Kişiler uygulamanızdaki tanımlamaları ayarlayın.</p></div>

                        </BlockHeadContent>
                    </BlockBetween>
                </BlockHead>
                <Block>
                    <Row>
                        <Col lg={6}>
                            <Row>
                                <Col lg={6}>
                                    <h5>Kategoriler</h5>
                                </Col>
                                <Col lg={6}>
                                    <Button
                                        className="toggle btn btn-primary"
                                        color="primary"
                                        size="sm"
                                    >
                                        Kategori Ekle
                                    </Button>
                                </Col>
                            </Row>
                        </Col>
                        <Col lg={6}>
                            <Row>
                                <Col lg={6}>
                                    <h5>Etiketler</h5>
                                </Col>
                                <Col lg={6}>
                                    <Button
                                        className="toggle btn btn-primary"
                                        color="primary"
                                        size="sm"
                                    >
                                        Etiket Ekle
                                    </Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Block>
            </Content>
        </>
    );
};
export default PersonsDefinitions;
