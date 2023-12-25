import React, { useEffect } from "react";
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
import { Outlet, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { LoginResponse } from "api/interface/auth";

const MainContent = styled.div`
	margin-top: 5rem; /* Add some initial margin */
	height: 60vh;
	margin-bottom: 5rem;
`;

const VendorDashboardLayout: React.FC = () => {
	const navigate = useNavigate();
	useEffect(() => {
		const REACT_STARTER_AUTH: LoginResponse = JSON.parse(localStorage.getItem("REACT_STARTER_AUTH"));
		if (!REACT_STARTER_AUTH) {
			navigate("/login");
			return;
		}
		console.log(REACT_STARTER_AUTH);
		if (REACT_STARTER_AUTH.role !== "VENDOR") {
			navigate("/register-store");
			return;
		}
		return () => {
		};
	}, []);
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
			<div className="section-after-sticky">
				<Navbar />
			</div>
			<MainContent>
				<Container my="2rem" minHeight={"600px"}>
					<Grid container spacing={6}>
						<Hidden as={Grid} item lg={3} xs={12} down={1024}>
							<VendorDashboardNavigation />
						</Hidden>
						<Grid item lg={9} xs={12}>
							<Outlet />
						</Grid>
					</Grid>
				</Container>
				<Footer />
				<MobileNavigationBar />
			</MainContent>
		</StyledAppLayout>
	)
};

export default VendorDashboardLayout;
