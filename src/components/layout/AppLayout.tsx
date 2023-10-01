import Footer from "../footer/Footer";
import Header from "../header/Header";
import MobileNavigationBar from "../mobile-navigation/MobileNavigationBar";
import Sticky from "../sticky/Sticky";
import Topbar from "../topbar/Topbar";
import React from "react";
import StyledAppLayout from "./AppLayoutStyle";
import { Helmet } from "react-helmet";

type Props = {
  title?: string;
  navbar?: React.ReactNode;
  children?: React.ReactNode;
};

const AppLayout: React.FC<Props> = ({
  children,
  navbar,
  title = "Latipe",
}) => (
  <StyledAppLayout>
    <Helmet>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Helmet>

    <Topbar />

    <Sticky fixedOn={0}>
      <Header />
    </Sticky>

    {navbar && <div className="section-after-sticky">{navbar}</div>}
    {!navbar ? (
      <div className="section-after-sticky">{children}</div>
    ) : (
      children
    )}

    <MobileNavigationBar />
    <Footer />
  </StyledAppLayout>
);

export default AppLayout;
