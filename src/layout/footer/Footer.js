import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="nk-footer">
      <div className="container-fluid">
        <div className="nk-footer-wrap">
          <div className="nk-footer-copyright">
            {" "}
            &copy; 2024 TIOS. Create by <a href="https://zenmira.com">Zenmira.</a>
          </div>
          <div className="nk-footer-links">
            <ul className="nav nav-sm">

              <li className="nav-item">
                <Link to="#" className="nav-link">
                  Yardım
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Footer;
