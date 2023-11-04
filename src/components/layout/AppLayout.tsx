import Footer from "../footer/Footer";
import Header from "../header/Header";
import MobileNavigationBar from "../mobile-navigation/MobileNavigationBar";
import Sticky from "../sticky/Sticky";
import Topbar from "../topbar/Topbar";
import React from "react";
import StyledAppLayout from "./AppLayoutStyle";
import { Helmet } from "react-helmet";
import { Outlet } from "react-router-dom";
import styled from "styled-components";

type Props = {
	title?: string;
	navbar?: React.ReactNode;
	children?: React.ReactNode;
};
const MainContent = styled.div`
  margin-top: 5rem; /* Add some initial margin */
  min-height: calc(100vh - 10rem); /* Set a minimum height for the content */
  margin-bottom: 5rem;
`;
const AppLayout: React.FC<Props> = ({
	navbar,
	title = "Latipe",
}) => {

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
			<MainContent>
				{navbar && <div className="section-after-sticky">{navbar}</div>}
				{!navbar ? (
					<div className="section-after-sticky"> <Outlet /></div>
				) : (
					<Outlet />
				)}
			</MainContent>
			<MobileNavigationBar />
			<Footer></Footer>
		</StyledAppLayout>
	)
};

export default AppLayout;
