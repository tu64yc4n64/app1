const menu = [
  {
    heading: "Menü",
  },
  {
    icon: "dashlite",
    text: "Anasayfa",
    link: "/",
  },
  {
    icon: "users",
    text: "Kişiler",
    link: "/kisiler",
    active: false,

  },
  {
    icon: "users",
    text: "Firmalar",
    link: "/firmalar",
    active: false,

  },
  {
    icon: "card-view",
    text: "Ürünler",
    active: false,
    link: "/urunler",

  },
  {
    icon: "card-view",
    text: "Teklifler",
    active: false,
    link: "/teklifler",

  },
  {
    icon: "card-view",
    text: "Satışlar",
    active: false,
    link: "/satislar",

  },
  {
    icon: "card-view",
    text: "Raporlar",
    active: false,
    link: "/",

  },

  {
    heading: "Sistem",
  },
  {
    icon: "file-docs",
    text: "Tanımlamalar",
    active: false,

    subMenu: [
      {
        text: "Kişiler",
        link: "/kisi-tanimlamalari",
      },
      {
        text: "Firmalar",
        link: "/firma-tanimlamalari",
      },
      {
        text: "Ürünler",
        link: "/urun-tanimlamalari",
      },
      {
        text: "Teklifler",
        link: "/teklif-tanimlamalari",
      },
      {
        text: "Satışlar",
        link: "/satis-tanimlamalari",
      },
    ],

  },
  {
    icon: "file-docs",
    text: "Kullanıcılar",
    active: false,
    link: "/kullanicilar",

  },
  {
    icon: "file-docs",
    text: "Ayarlar",
    active: false,
    link: "/",

  },



];
export default menu;
