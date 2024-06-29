import React, { useState } from "react";
import axios from "axios";
import Logo from "../../images/logo.png";
import LogoDark from "../../images/logo-dark.png";
import LogoReact from "../../images/logo-react.png";
import LogoReactDark from "../../images/logo-react-dark.png";
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

const BASE_URL = "https://tiosone.com/api/token/";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [passState, setPassState] = useState(false);
  const [errorVal, setError] = useState("");

  const onFormSubmit = async (formData) => {
    setLoading(true);
    try {
      const response = await axios.post(
        BASE_URL,
        {
          username: formData.name,
          password: formData.passcode,
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const token = response.data;
      if (token) {
        localStorage.setItem("accessToken", token.access);
        localStorage.setItem("refreshToken", token.refresh);
        setTimeout(() => {
          const baseUrl = process.env.PUBLIC_URL ? process.env.PUBLIC_URL : "/";
          window.history.pushState(baseUrl, "auth-login", baseUrl);
          window.location.reload();
        }, 1000);
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      setError("Cannot login with credentials");
    } finally {
      setLoading(false);
    }
  };


  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <>
      <Head title="Login" />
      <Block className="nk-block-middle nk-auth-body  wide-xs">
        <div className="brand-logo pb-4 text-center">
          <Link to={process.env.PUBLIC_URL + "/"} className="logo-link">
            <img className="logo-light logo-img logo-img-lg" src={LogoReact} alt="logo" />
            <img className="logo-dark logo-img logo-img-lg" src={LogoReactDark} alt="logo-dark" />
          </Link>
        </div>

        <PreviewCard className="card-bordered" bodyClass="card-inner-lg">
          <BlockHead>
            <BlockContent>
              <BlockTitle tag="h4">Giriş Yap</BlockTitle>
              <BlockDes>
                <p>E-mail ve Parolanızla Sisteme Giriş Yapabilirsiniz.</p>
              </BlockDes>
            </BlockContent>
          </BlockHead>
          {errorVal && (
            <div className="mb-3">
              <Alert color="danger" className="alert-icon">
                <Icon name="alert-circle" /> Kullanıcı adı veya şifre hatalı..{" "}
              </Alert>
            </div>
          )}
          <Form className="is-alter" onSubmit={handleSubmit(onFormSubmit)}>
            <div className="form-group">
              <div className="form-label-group">
                <label className="form-label" htmlFor="default-01">
                  E-mail ve Kullanıcı Adı
                </label>
              </div>
              <div className="form-control-wrap">
                <input
                  type="text"
                  id="default-01"
                  {...register('name', { required: "This field is required" })}
                  placeholder="E-mail veya kullanıcı adınızı giriniz"
                  className="form-control-lg form-control" />
                {errors.name && <span className="invalid">{errors.name.message}</span>}
              </div>
            </div>
            <div className="form-group">
              <div className="form-label-group">
                <label className="form-label" htmlFor="password">
                  Parola
                </label>
                <Link className="link link-primary link-sm" to="#">
                  Parolamı Unuttum
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
                  placeholder="Parolanızı Giriniz"
                  className={`form-control-lg form-control ${passState ? "is-hidden" : "is-shown"}`} />
                {errors.passcode && <span className="invalid">{errors.passcode.message}</span>}
              </div>
            </div>
            <div className="form-group">
              <Button size="lg" className="btn-block" type="submit" color="primary">
                {loading ? <Spinner size="sm" color="light" /> : "Giriş Yap"}
              </Button>
            </div>
          </Form>
          <div className="form-note-s2 text-center pt-4">
            Üyeliğiniz yok mu ? <Link to={`${process.env.PUBLIC_URL}/auth-register`}>Hesap oluştur</Link>
          </div>


        </PreviewCard>
      </Block>
      <AuthFooter />
    </>
  );
};

export default Login;
