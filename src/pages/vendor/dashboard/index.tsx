import { LoginResponse } from "@interfaces/auth";
import Avatar from "@components/avatar/Avatar";
import Card from "@components/Card";
// import VendorAnalyticsChart from "@components/dashboard/VendorAnalyticsChart";
import FlexBox from "@components/FlexBox";
import Grid from "@components/grid/Grid";
import DashboardPageHeader from "@components/layout/DashboardPageHeader";
import VendorDashboardLayout from "@components/layout/VendorDashboardLayout";
import Typography, { H1, H5, Paragraph } from "@components/Typography";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const VendorDashboard = () => {
	const navigate = useNavigate();
	useEffect(() => {
		console.log(localStorage.getItem("REACT_STARTER_AUTH"));

		const REACT_STARTER_AUTH: LoginResponse = JSON.parse(localStorage.getItem("REACT_STARTER_AUTH"));
		if (!REACT_STARTER_AUTH) {
			navigate("/login");
			return;
		}
		if (REACT_STARTER_AUTH.role !== "VENDOR") {
			navigate("/require-register-vendor");
			return;
		}
		return () => {
		};
	}, []);

	return (
		<div>
			<DashboardPageHeader title="Dashboard" iconName="bag_filled" />
			<Grid container spacing={6}>
				{cardList.map((item, ind) => (
					<Grid item lg={4} md={4} sm={6} xs={12} key={ind}>
						<Typography as={Card} textAlign="center" py="1.5rem" height="100%">
							<H5 color="text.muted" mb="8px">
								{item.title}
							</H5>
							<H1 color="gray.700" mb="4px" lineHeight="1.3">
								{item.amount}
							</H1>
							<Paragraph color="text.muted">{item.subtitle}</Paragraph>
						</Typography>
					</Grid>
				))}

				<Grid item lg={8} xs={12}>
					<Card p="20px 30px">
						<H5 mb="1.5rem">Sales</H5>
						{/* d<VendorAnalyticsChart /> */}
					</Card>
				</Grid>

				<Grid item lg={4} xs={12}>
					<Card p="20px 30px">
						<H5>Top Countries</H5>
						{topCountryList.map((item, ind) => (
							<FlexBox
								alignItems="center"
								justifyContent="space-between"
								my="1rem"
								key={ind}
							>
								<FlexBox alignItems="center">
									<Avatar src={item.flagUrl} size={30} mr="8px" />
									<span>{item.name}</span>
								</FlexBox>
								<H5>${item.amount}</H5>
							</FlexBox>
						))}
					</Card>
				</Grid>
			</Grid>
		</div>
	);
};

const cardList = [
	{
		title: "Earnings (before taxes)",
		amount: "$30450.00",
		subtitle: "after associated vendor fees",
	},
	{
		title: "Your balance",
		amount: "$4000.00",
		subtitle: "Will be processed on Feb 15, 2021",
	},
	{
		title: "Pending Orders",
		amount: "08",
		subtitle: "7/3/2020 - 8/1/2020",
	},
];

// USE COUNTRY CODE TO FETCH FLAG
const topCountryList = [
	{
		name: "United States",
		amount: 130,
		flagUrl:
			"http://purecatamphetamine.github.io/country-flag-icons/3x2/US.svg",
	},
	{
		name: "United Kingdom",
		amount: 110,
		flagUrl:
			"http://purecatamphetamine.github.io/country-flag-icons/3x2/GB.svg",
	},
	{
		name: "Canada",
		amount: 100,
		flagUrl:
			"http://purecatamphetamine.github.io/country-flag-icons/3x2/CA.svg",
	},
	{
		name: "India",
		amount: 80,
		flagUrl:
			"http://purecatamphetamine.github.io/country-flag-icons/3x2/IN.svg",
	},
	{
		name: "Jordan",
		amount: 80,
		flagUrl:
			"http://purecatamphetamine.github.io/country-flag-icons/3x2/JO.svg",
	},
	{
		name: "Brazil",
		amount: 70,
		flagUrl:
			"http://purecatamphetamine.github.io/country-flag-icons/3x2/BR.svg",
	},
];

VendorDashboard.layout = VendorDashboardLayout;

export default VendorDashboard;
