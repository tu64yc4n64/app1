import React, { useEffect, useState } from "react";
import Icon from "../../../icon/Icon";
import UserAvatar from "../../../user/UserAvatar";
import { transactionData } from "./TransactionData";
import { CardTitle, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Badge } from "reactstrap";
import { DataTableBody, DataTableHead, DataTableItem, DataTableRow } from "../../../table/DataTable";


const TransactionTable = () => {
  const [data, setData] = useState(transactionData);
  const [trans, setTrans] = useState("");
  useEffect(() => {
    let filteredData;
    if (trans === "Due") {
      filteredData = transactionData.filter((item) => item.status === "Vadesi Dolmuş");
    } else if (trans === "Paid") {
      filteredData = transactionData.filter((item) => item.status === "Ödendi");
    } else {
      filteredData = transactionData;
    }
    setData(filteredData);
  }, [trans]);

  const DropdownTrans = () => {
    return (
      <UncontrolledDropdown>
        <DropdownToggle tag="a" className="text-soft dropdown-toggle btn btn-icon btn-trigger">
          <Icon name="more-h"></Icon>
        </DropdownToggle>
        <DropdownMenu end>
          <ul className="link-list-plain">
            <li>
              <DropdownItem
                tag="a"
                href="#view"
                onClick={(ev) => {
                  ev.preventDefault();
                }}
              >
                View
              </DropdownItem>
            </li>
            <li>
              <DropdownItem
                tag="a"
                href="#invoice"
                onClick={(ev) => {
                  ev.preventDefault();
                }}
              >
                Invoice
              </DropdownItem>
            </li>
            <li>
              <DropdownItem
                tag="a"
                href="#print"
                onClick={(ev) => {
                  ev.preventDefault();
                }}
              >
                Print
              </DropdownItem>
            </li>
          </ul>
        </DropdownMenu>
      </UncontrolledDropdown>
    );
  };
  return (
    <React.Fragment>
      <div className="card-inner">
        <div className="card-title-group">
          <CardTitle>
            <h6 className="title">
              <span className="me-2">Son Teklifler</span>{" "}

            </h6>
          </CardTitle>
          <div className="card-tools">
            <ul className="card-tools-nav">
              <li className={trans === "Paid" ? "active" : ""} onClick={() => setTrans("Paid")}>
                <a
                  href="#paid"
                  onClick={(ev) => {
                    ev.preventDefault();
                  }}
                >
                  <span>Ödenenler</span>
                </a>
              </li>
              <li className={trans === "Due" ? "active" : ""} onClick={() => setTrans("Due")}>
                <a
                  href="#pending"
                  onClick={(ev) => {
                    ev.preventDefault();
                  }}
                >
                  <span>Beklemede Olanlar</span>
                </a>
              </li>
              <li className={trans === "" ? "active" : ""} onClick={() => setTrans("")}>
                <a
                  href="#all"
                  onClick={(ev) => {
                    ev.preventDefault();
                  }}
                >
                  <span>Hepsi</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <DataTableBody className="border-top" bodyclass="nk-tb-orders">
        <DataTableHead>
          <DataTableRow>
            <span>Teklif No</span>
          </DataTableRow>
          <DataTableRow size="sm">
            <span>Müşteri</span>
          </DataTableRow>
          <DataTableRow size="md">
            <span>Tarih</span>
          </DataTableRow>
          <DataTableRow size="lg">
            <span>Temsilci</span>
          </DataTableRow>
          <DataTableRow>
            <span>Tutar</span>
          </DataTableRow>
          <DataTableRow>
            <span className="d-none d-sm-inline">Durum</span>
          </DataTableRow>
          <DataTableRow>
            <span>&nbsp;</span>
          </DataTableRow>
        </DataTableHead>
        {data.map((item, idx) => {
          return (
            <DataTableItem key={idx}>
              <DataTableRow>
                <span className="tb-lead">
                  <a href="#order">{item.order}</a>
                </span>
              </DataTableRow>
              <DataTableRow size="sm">
                <div className="user-card">
                  <UserAvatar size="sm" theme={item.theme} text={item.initial} image={item.img}></UserAvatar>
                  <div className="user-name">
                    <span className="tb-lead">{item.name}</span>
                  </div>
                </div>
              </DataTableRow>
              <DataTableRow size="md">
                <span className="tb-sub">{item.date}</span>
              </DataTableRow>
              <DataTableRow size="lg">
                <span className="tb-sub text-primary">{item.ref}</span>
              </DataTableRow>
              <DataTableRow>
                <span className="tb-sub tb-amount">
                  {item.amount} <span>USD</span>
                </span>
              </DataTableRow>
              <DataTableRow>
                <Badge className="badge-dot badge-dot-xs" color={item.status === "Ödendi" ? "success" : item.status === "Vadesi Dolmuş" ? "warning" : "danger"} >{item.status}</Badge>
              </DataTableRow>
              <DataTableRow className="nk-tb-col-action">
                <DropdownTrans />
              </DataTableRow>
            </DataTableItem>
          );
        })}
      </DataTableBody>
    </React.Fragment>
  );
};
export default TransactionTable;
