import React from "react";
import Container from "../Container";
import Grid from "../grid/Grid";
import Hidden from "../hidden/Hidden";
import Navbar from "../navbar/Navbar";
import VendorDashboardNavigation from "./VendorDashboardNavigation";
import StyledAppLayout from "../layout/AppLayoutStyle";
import Topbar from "../topbar/Topbar";
import Header from "../header/Header";
import Sticky from "../sticky/Sticky";
import MobileNavigationBar from "../mobile-navigation/MobileNavigationBar";
import Footer from "../footer/Footer";
import { Helmet } from "react-helmet";
import { Outlet } from "react-router-dom";

const VendorDashboardLayout: React.FC = ({ children }: any) => (
  <StyledAppLayout>
    <Helmet>
      <title>Latipe</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Helmet>
    <Topbar />
    <Sticky fixedOn={0}>
      <Header />
    </Sticky>
    <div className="section-after-sticky">
      <Navbar />
    </div>
    (
    <Container my="2rem">
      <Grid container spacing={6}>
        <Hidden as={Grid} item lg={3} xs={12} down={1024}>
          <VendorDashboardNavigation />
        </Hidden>
        <Grid item lg={9} xs={12}>
          <Outlet />
        </Grid>
      </Grid>
    </Container>
    )

    <MobileNavigationBar />
    <Footer />
  </StyledAppLayout>


);

export default VendorDashboardLayout;
