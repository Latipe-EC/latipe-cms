import React from "react";
import Footer from "../footer/Footer";
import Header from "../header/Header";
import MobileNavigationBar from "../mobile-navigation/MobileNavigationBar";
import Navbar from "../navbar/Navbar";
import Topbar from "../topbar/Topbar";
import StyledAppLayout from "./AppLayoutStyle";

type Props = {
  title?: string;
  children: React.ReactNode;
};

const SaleLayout1: React.FC<Props> = ({
  children,
  title = "Multivendor Ecommerce | Sale",
}) => (
  <StyledAppLayout>
    <header>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </header>
    <Topbar />
    <Header />
    <Navbar />
    {children}
    <MobileNavigationBar />
    <Footer />
  </StyledAppLayout>
);

export default SaleLayout1;
