import React, { useEffect } from "react";
import Container from "../Container";
import Grid from "../grid/Grid";
import Hidden from "../hidden/Hidden";
import CustomerDashboardNavigation from "./CustomerDashboardNavigation";
import { Outlet } from "react-router-dom";
import MobileNavigationBar from "../mobile-navigation/MobileNavigationBar";
import Footer from "../footer/Footer";
import StyledAppLayout from "../layout/AppLayoutStyle";
import { Navbar } from "react-bootstrap";
import Header from "../header/Header";
import Sticky from "../sticky/Sticky";
import Topbar from "../topbar/Topbar";
import { Helmet } from "react-helmet";
import styled from "styled-components";
import { LoginResponse } from "@interfaces/auth";


type Props = {
	title?: string;
};
const MainContent = styled.div`
  margin-top: 5rem; /* Add some initial margin */
  height: 60vh;
  margin-bottom: 5rem;
`;

const CustomerDashboardLayout: React.FC<Props> = ({
	title = "Latipe",
}) => {

	const [isLoading, setIsLoading] = React.useState(false);
	useEffect(() => {
		const REACT_STARTER_AUTH: LoginResponse = JSON.parse(localStorage.getItem("REACT_STARTER_AUTH"));
		if (!REACT_STARTER_AUTH) {
			window.location.href = "/login";
			return;
		} else {
			setIsLoading(true);
		}

	}, []);


	return (
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

			<div className="section-after-sticky">
				<Navbar />
			</div>
			<MainContent>
				<Container my="2rem" minHeight={"52vh"}>
					<Grid container spacing={6}>
						<Hidden as={Grid} item lg={3} xs={12} down={1024}>
							<CustomerDashboardNavigation />
						</Hidden>
						<Grid item lg={9} xs={12}>
							{isLoading && <Outlet />}
						</Grid>
					</Grid>
				</Container>
				<Footer />
				<MobileNavigationBar />
			</MainContent>
		</StyledAppLayout>
	)
};

export default CustomerDashboardLayout;
