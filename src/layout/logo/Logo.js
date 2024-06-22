import React from "react";
import LogoLight2x from "../../images/logo2x.png";
import LogoReact from "../../images/logo-react.png";
import LogoReactDark from "../../images/logo-react-dark.png";
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to={`${process.env.PUBLIC_URL}/`} className="logo-link">
      <img className="logo-light logo-img" src={LogoReact} />
      <img className="logo-dark logo-img" src={LogoReactDark} />




    </Link>
  );
};

export default Logo;
