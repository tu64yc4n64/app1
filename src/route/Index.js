import React, { useLayoutEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { ProductContextProvider } from "../pages/pre-built/products/ProductContext";
import { PersonContextProvider } from "../pages/pre-built/user-manage/PersonContext";

import Homepage from "../pages/Homepage";
import OfferListPage from "../pages/pre-built/offers/offersList";
import OfferDetailPage from "../pages/pre-built/offers/offerDetail";
import CompanyDetail from "../pages/pre-built/company/CompanyDetail"
import PersonsDefinitions from "../pages/pre-built/definitions/PersonsDefinitions"
import CompaniesDefinitions from "../pages/pre-built/definitions/CompaniesDefinitions"
import ProductsDefinitions from "../pages/pre-built/definitions/ProductsDefinitions"
import OffersDefinitions from "../pages/pre-built/definitions/OffersDefinitions"
import SalesDefinitions from "../pages/pre-built/definitions/SalesDefinitions"

import SalesListPage from "../pages/pre-built/sales/salesList";
import NewOffersPage from "../pages/pre-built/offers/newOffersPage";
import NewSalesPage from "../pages/pre-built/sales/newSalesPage";
import NewUserPage from "../pages/pre-built/users/UserListPage";

import UserListRegular from "../pages/pre-built/user-manage/UserListRegular";
import UserContactCard from "../pages/pre-built/user-manage/UserContactCard";
import UserDetails from "../pages/pre-built/user-manage/UserDetailsRegular";
import UserListCompact from "../pages/pre-built/user-manage/UserListCompact";
import UserProfileRegular from "../pages/pre-built/user-manage/UserProfileRegular";
import UserProfileSetting from "../pages/pre-built/user-manage/UserProfileSetting";
import UserProfileNotification from "../pages/pre-built/user-manage/UserProfileNotification";
import UserProfileActivity from "../pages/pre-built/user-manage/UserProfileActivity";
import KycListRegular from "../pages/pre-built/kyc-list-regular/KycListRegular";
import KycDetailsRegular from "../pages/pre-built/kyc-list-regular/kycDetailsRegular";
import TransListBasic from "../pages/pre-built/trans-list/TransListBasic";
import TransListCrypto from "../pages/pre-built/trans-list/TransListCrypto";
import ProductCard from "../pages/pre-built/products/ProductCard";
import ProductList from "../pages/pre-built/products/ProductList";
import ProductDetails from "../pages/pre-built/products/ProductDetails";

import Layout from "../layout/Index";

import CompanyList from "../pages/pre-built/company/CompanyList";

const Router = () => {
  const location = useLocation();
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <Routes>
      <Route path={`${process.env.PUBLIC_URL}`} element={<Layout />}>

        <Route index element={<Homepage />}></Route>
        <Route path="firmalar" element={<CompanyList />}></Route>
        <Route path="teklifler" element={<OfferListPage />}></Route>
        <Route path="teklif-detay/:teklifId" element={<OfferDetailPage />}></Route>

        <Route path="kisi-tanimlamalari" element={<PersonsDefinitions />}></Route>
        <Route path="firma-tanimlamalari" element={<CompaniesDefinitions />}></Route>
        <Route path="urun-tanimlamalari" element={<ProductsDefinitions />}></Route>
        <Route path="teklif-tanimlamalari" element={<OffersDefinitions />}></Route>
        <Route path="satis-tanimlamalari" element={<SalesDefinitions />}></Route>


        <Route path="satislar" element={<SalesListPage />}></Route>
        <Route path="kullanicilar" element={<NewUserPage />}></Route>



        <Route element={<PersonContextProvider />} >
          <Route path="kisiler" element={<UserListRegular />}></Route>
          <Route path="teklif-olustur" element={<NewOffersPage />}></Route>
          <Route path="satis-olustur" element={<NewSalesPage />}></Route>
          <Route path="user-list-compact" element={<UserListCompact />}></Route>
          <Route path="user-contact-card" element={<UserContactCard />}></Route>
          <Route path="kisi-detay/:userId" element={<UserDetails />}></Route>
          <Route path="sirket-detay/:companyId" element={<CompanyDetail />}></Route>

        </Route>

        <Route >
          <Route path="user-profile-notification" element={<UserProfileNotification />} ></Route>
          <Route path="user-profile-regular" element={<UserProfileRegular />}></Route>
          <Route path="user-profile-activity" element={<UserProfileActivity />}></Route>
          <Route path="user-profile-setting" element={<UserProfileSetting />}></Route>
        </Route>

        <Route path="kyc-list-regular" element={<KycListRegular />}></Route>
        <Route path="kyc-details-regular/:kycId" element={<KycDetailsRegular />}></Route>
        <Route path="transaction-basic" element={<TransListBasic />}></Route>
        <Route path="transaction-crypto" element={<TransListCrypto />}></Route>
        <Route element={<ProductContextProvider />}>
          <Route path="urunler" element={<ProductList />}></Route>
          <Route path="product-card" element={<ProductCard />}></Route>
          <Route path="product-details/:productId" element={<ProductDetails />}></Route>
        </Route>


      </Route>
    </Routes>
  );
};
export default Router;
