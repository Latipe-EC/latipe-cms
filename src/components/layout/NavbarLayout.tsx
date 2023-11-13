import React from "react";
import Container from "../Container";
import Footer from "../footer/Footer";
import Header from "../header/Header";
import MobileNavigationBar from "../mobile-navigation/MobileNavigationBar";
import Sticky from "../sticky/Sticky";
import Topbar from "../topbar/Topbar";
import StyledAppLayout from "./AppLayoutStyle";
import { Helmet } from "react-helmet";
import styled from "styled-components";
import { Outlet } from "react-router-dom";
import Navbar from "../navbar/Navbar";

const MainContent = styled.div`
  margin-top: 5rem; /* Add some initial margin */
  min-height: calc(100vh - 10rem); /* Set a minimum height for the content */
  margin-bottom: 5rem;
`;

const NavbarLayout: React.FC = () => {
	return (

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
			<MainContent>
				<div className="section-after-sticky"><Navbar /></div>
				<Container my="2rem"><Outlet /></Container>
			</MainContent>
			<MobileNavigationBar />
			<Footer></Footer>
		</StyledAppLayout>
	);
};

export default NavbarLayout;
