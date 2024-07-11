import GroceryHeader from "../header/GroceryHeader";
import MobileNavigationBar from "../mobile-navigation/MobileNavigationBar";
import Navbar2 from "../navbar/Navbar2";
import Sticky from "../sticky/Sticky";
import React from "react";
import StyledAppLayout from "./AppLayoutStyle";
import { Helmet } from "react-helmet";
import { Outlet } from "react-router-dom";

type Props = {
	title?: string;
	navbar?: React.ReactChild;
};

const GroceryLayout: React.FC<Props> = ({
	title = "Latipe",
}) => (
	<StyledAppLayout>
		<Helmet>
			<title>{title}</title>
			<meta charSet="utf-8" />
			<meta name="viewport" content="initial-scale=1.0, width=device-width" />
		</Helmet>

		<Sticky fixedOn={0}>
			<GroceryHeader />
		</Sticky>

		<div className="section-after-sticky">
			<Navbar2 />
		</div>

		<Outlet />

		<MobileNavigationBar />
	</StyledAppLayout>
);

export default GroceryLayout;
