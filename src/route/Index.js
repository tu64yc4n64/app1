import React, { useLayoutEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";



import Homepage from "../pages/Homepage";
import OfferListPage from "../pages/pre-built/offers/offersList";
import OfferDetailPage from "../pages/pre-built/offers/offerDetail";
import CompanyDetail from "../pages/pre-built/company/CompanyDetail"

import SalesListPage from "../pages/pre-built/sales/salesList";
import NewOffersPage from "../pages/pre-built/offers/newOffersPage";
import NewSalesPage from "../pages/pre-built/sales/newSalesPage";
import NewUserPage from "../pages/pre-built/users/UserListPage";


import UserListRegular from "../pages/pre-built/user-manage/UserListRegular";

import UserDetails from "../pages/pre-built/user-manage/UserDetailsRegular";




import ProductList from "../pages/pre-built/products/ProductList";




import PersonsDefinitions from "../pages/pre-built/definitions/PersonsDefinitions"
import CompaniesDefinitions from "../pages/pre-built/definitions/CompaniesDefinitions"
import ProductsDefinitions from "../pages/pre-built/definitions/ProductsDefinitions"
import OffersDefinitions from "../pages/pre-built/definitions/OffersDefinitions"
import SalesDefinitions from "../pages/pre-built/definitions/SalesDefinitions"



import FileManager from "../pages/app/file-manager/FileManager";
import FileManagerFiles from "../pages/app/file-manager/FileManagerFiles";
import FileManagerShared from "../pages/app/file-manager/FileManagerShared";
import FileManagerStarred from "../pages/app/file-manager/FileManagerStarred";
import FileManagerRecovery from "../pages/app/file-manager/FileManagerRecovery";
import FileManagerSettings from "../pages/app/file-manager/FileManagerSettings";


import Error404Classic from "../pages/error/404-classic";
import Error404Modern from "../pages/error/404-modern";
import Error504Modern from "../pages/error/504-modern";
import Error504Classic from "../pages/error/504-classic";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import Success from "../pages/auth/Success";

import Layout from "../layout/Index";
import LayoutNoSidebar from "../layout/Index-nosidebar";
import CompanyList from "../pages/pre-built/company/CompanyList";

const Router = () => {
  const location = useLocation();
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <Routes>
      <Route path={`${process.env.PUBLIC_URL}`} element={<Layout />}>

        <Route path="/" element={<Homepage />}></Route>
        <Route path="firmalar" element={<CompanyList />}></Route>

        <Route path="teklifler" element={<OfferListPage />}></Route>
        <Route path="teklif-detay/:offerId" element={<OfferDetailPage />}></Route>

        <Route path="kisi-tanimlamalari" element={<PersonsDefinitions />}></Route>
        <Route path="firma-tanimlamalari" element={<CompaniesDefinitions />}></Route>
        <Route path="urun-tanimlamalari" element={<ProductsDefinitions />}></Route>
        <Route path="teklif-tanimlamalari" element={<OffersDefinitions />}></Route>
        <Route path="satis-tanimlamalari" element={<SalesDefinitions />}></Route>

        <Route path="satislar" element={<SalesListPage />}></Route>
        <Route path="kullanicilar" element={<NewUserPage />}></Route>

        <Route path="kisiler" element={<UserListRegular />}></Route>
        <Route path="teklif-olustur" element={<NewOffersPage />}></Route>
        <Route path="satis-olustur" element={<NewSalesPage />}></Route>


        <Route path="kisi-detay/:userId" element={<UserDetails />}></Route>
        <Route path="sirket-detay/:companyId" element={<CompanyDetail />}></Route>



        <Route path="urunler" element={<ProductList />}></Route>



        <Route path="app-file-manager">
          <Route index element={<FileManager />}></Route>
          <Route path="files" element={<FileManagerFiles />}></Route>
          <Route path="starred" element={<FileManagerStarred />}></Route>
          <Route path="shared" element={<FileManagerShared />}></Route>
          <Route path="recovery" element={<FileManagerRecovery />}></Route>
          <Route path="settings" element={<FileManagerSettings />}></Route>
        </Route>

      </Route>
      <Route path={`${process.env.PUBLIC_URL}`} element={<LayoutNoSidebar />}>
        <Route path="auth-success" element={<Success />}></Route>
        <Route path="auth-reset" element={<ForgotPassword />}></Route>
        <Route path="auth-register" element={<Register />}></Route>
        <Route index path="auth-login" element={<Login />}></Route>

        <Route path="errors">
          <Route path="404-modern" element={<Error404Modern />}></Route>
          <Route path="404-classic" element={<Error404Classic />}></Route>
          <Route path="504-modern" element={<Error504Modern />}></Route>
          <Route path="504-classic" element={<Error504Classic />}></Route>
        </Route>
        <Route path="*" element={<Error404Modern />}></Route>

      </Route>
    </Routes>
  );
};
export default Router;
