import Footer from "../footer/Footer";
import Header from "../header/Header";
import MobileNavigationBar from "../mobile-navigation/MobileNavigationBar";
import Sticky from "../sticky/Sticky";
import Topbar from "../topbar/Topbar";
import React, { useEffect } from "react";
import StyledAppLayout from "./AppLayoutStyle";
import { Helmet } from "react-helmet";
import { Outlet, useLocation } from "react-router-dom";
import { LoginResponse } from "@interfaces/auth";

type Props = {
	title?: string;
	navbar?: React.ReactNode;
	children?: React.ReactNode;
};
const AppLayout: React.FC<Props> = ({
	navbar,
	title = "Latipe",
}) => {
	const location = useLocation();
	const authRoute = ["checkout", "payment", "withdraw"];

	useEffect(() => {
		const path = location.pathname.substring(1); // remove the leading slash

		const REACT_STARTER_AUTH: LoginResponse = JSON.parse(localStorage.getItem("REACT_STARTER_AUTH"));

		if (!REACT_STARTER_AUTH && authRoute.includes(path)) {
			window.location.href = "/login";
			return;
		}
		return () => {
		};
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

			{navbar && <div className="section-after-sticky">{navbar}</div>}
			{!navbar ? (
				<div className="section-after-sticky" style={{ minHeight: "60vh" }}><Outlet /></div>
			) : (
				<Outlet />
			)
			}
			<MobileNavigationBar />
			<Footer></Footer>
		</StyledAppLayout>
	)
};

export default AppLayout;
