import React, { useState, useEffect } from "react";
import Logo from "../../images/logo.png";
import LogoDark from "../../images/logo-dark.png";
import Head from "../../layout/head/Head";
import AuthFooter from "./AuthFooter";
import {
    Block,
    BlockContent,
    BlockDes,
    BlockHead,
    BlockTitle,
    Button,
    Icon,
    PreviewCard,
} from "../../components/Component";
import { Form, Spinner, Alert } from "reactstrap";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import axios from "axios";
const BASE_URL = "https://tiosone.com/users/api/users/login/";

const Login = () => {
    const [loading, setLoading] = useState(false);
    const [passState, setPassState] = useState(false);
    const [errorVal, setError] = useState("");

    const onFormSubmit = async (formData) => {
        setLoading(true);
        try {
            const response = await axios.post(BASE_URL, {
                email: formData.name,
                password: formData.passcode
            }, {
                headers: {
                    Authorization: `Bearer 72ba3c48d87b3d820c790d1e69367636be28f822`
                }
            });

            if (response.data && response.data.token) {
                localStorage.setItem("accessToken", response.data.token);
                setTimeout(() => {
                    window.history.pushState(
                        `${process.env.PUBLIC_URL ? process.env.PUBLIC_URL : "/"}`,
                        "auth-login",
                        `${process.env.PUBLIC_URL ? process.env.PUBLIC_URL : "/"}`
                    );
                    window.location.reload();
                }, 1000);
            } else {
                throw new Error("Invalid credentials");
            }
        } catch (error) {
            setError("Cannot login with credentials");
            setLoading(false);
        }
    };

    const { register, handleSubmit, formState: { errors } } = useForm();

    return (
        <>
            <Head title="Login" />
            <Block className="nk-block-middle nk-auth-body wide-xs">
                <div className="brand-logo pb-4 text-center">
                    <Link to={process.env.PUBLIC_URL + "/"} className="logo-link">
                        <img className="logo-light logo-img logo-img-lg" src={Logo} alt="logo" />
                        <img className="logo-dark logo-img logo-img-lg" src={LogoDark} alt="logo-dark" />
                    </Link>
                </div>

                <PreviewCard className="card-bordered" bodyClass="card-inner-lg">
                    <BlockHead>
                        <BlockContent>
                            <BlockTitle tag="h4">Sign-In</BlockTitle>
                            <BlockDes>
                                <p>Access Dashlite using your email and passcode.</p>
                            </BlockDes>
                        </BlockContent>
                    </BlockHead>
                    {errorVal && (
                        <div className="mb-3">
                            <Alert color="danger" className="alert-icon">
                                <Icon name="alert-circle" /> {errorVal}
                            </Alert>
                        </div>
                    )}
                    <Form className="is-alter" onSubmit={handleSubmit(onFormSubmit)}>
                        <div className="form-group">
                            <div className="form-label-group">
                                <label className="form-label" htmlFor="default-01">
                                    Email or Username
                                </label>
                            </div>
                            <div className="form-control-wrap">
                                <input
                                    type="text"
                                    id="default-01"
                                    {...register('name', { required: "This field is required" })}
                                    defaultValue="admin64"
                                    placeholder="Enter your email address or username"
                                    className="form-control-lg form-control"
                                />
                                {errors.name && <span className="invalid">{errors.name.message}</span>}
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="form-label-group">
                                <label className="form-label" htmlFor="password">
                                    Passcode
                                </label>
                                <Link className="link link-primary link-sm" to={`${process.env.PUBLIC_URL}/auth-reset`}>
                                    Forgot Code?
                                </Link>
                            </div>
                            <div className="form-control-wrap">
                                <a
                                    href="#password"
                                    onClick={(ev) => {
                                        ev.preventDefault();
                                        setPassState(!passState);
                                    }}
                                    className={`form-icon lg form-icon-right passcode-switch ${passState ? "is-hidden" : "is-shown"}`}
                                >
                                    <Icon name="eye" className="passcode-icon icon-show"></Icon>
                                    <Icon name="eye-off" className="passcode-icon icon-hide"></Icon>
                                </a>
                                <input
                                    type={passState ? "text" : "password"}
                                    id="password"
                                    {...register('passcode', { required: "This field is required" })}
                                    defaultValue="Tiosnet456**"
                                    placeholder="Enter your passcode"
                                    className={`form-control-lg form-control ${passState ? "is-hidden" : "is-shown"}`}
                                />
                                {errors.passcode && <span className="invalid">{errors.passcode.message}</span>}
                            </div>
                        </div>
                        <div className="form-group">
                            <Button size="lg" className="btn-block" type="submit" color="primary">
                                {loading ? <Spinner size="sm" color="light" /> : "Sign in"}
                            </Button>
                        </div>
                    </Form>
                    <div className="form-note-s2 text-center pt-4">
                        New on our platform? <Link to={`${process.env.PUBLIC_URL}/auth-register`}>Create an account</Link>
                    </div>
                    <div className="text-center pt-4 pb-3">
                        <h6 className="overline-title overline-title-sap">
                            <span>OR</span>
                        </h6>
                    </div>
                    <ul className="nav justify-center gx-4">
                        <li className="nav-item">
                            <a
                                className="nav-link"
                                href="#socials"
                                onClick={(ev) => {
                                    ev.preventDefault();
                                }}
                            >
                                Facebook
                            </a>
                        </li>
                        <li className="nav-item">
                            <a
                                className="nav-link"
                                href="#socials"
                                onClick={(ev) => {
                                    ev.preventDefault();
                                }}
                            >
                                Google
                            </a>
                        </li>
                    </ul>
                </PreviewCard>
            </Block>
            <AuthFooter />
        </>
    );
};

export default Login;
