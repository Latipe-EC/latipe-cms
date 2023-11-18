import Box from "../Box";
import { Fragment } from "react";
import FlexBox from "../FlexBox";
import Icon from "../icon/Icon";
import Typography from "../Typography";
import {
	DashboardNavigationWrapper,
	StyledDashboardNav,
} from "./DashboardStyle";
import { useDispatch } from "react-redux";
import { countMyAddress } from "../../store/slices/user-slice";
import { AppThunkDispatch, RootState, useAppSelector } from "../../store/store";

const CustomerDashboardNavigation = () => {
	const pathname = window.location.pathname;
	const dispatch = useDispatch<AppThunkDispatch>();

	dispatch(countMyAddress());

	const user = useAppSelector((state: RootState) => state.user);

	const getCount = (title: string) => {
		switch (title) {
			case "Addresses":
				{
					return user.countAddress;
				}
			default:
				return 5;
		}
	};
	return (
		<DashboardNavigationWrapper px="0px" pb="1.5rem" color="gray.900">
			{linkList.map((item) => (
				<Fragment key={item.title}>
					<Typography p="26px 30px 1rem" color="text.muted" fontSize="12px">
						{item.title}
					</Typography>
					{item.list.map((item) => (
						<StyledDashboardNav
							isCurrentPath={pathname.includes(item.href)}
							href={item.href}
							key={item.title}
							px="1.5rem"
							mb="1.25rem"
						>
							<FlexBox alignItems="center">
								<Box className="dashboard-nav-icon-holder">
									<Icon variant="small" defaultcolor="currentColor" mr="10px">
										{item.iconName}
									</Icon>
								</Box>
								<span>{item.title}</span>
							</FlexBox>
							<span>{getCount(item.title)}</span>
						</StyledDashboardNav>
					))}
				</Fragment>
			))}
		</DashboardNavigationWrapper>
	);
};

const linkList = [
	{
		title: "DASHBOARD",
		list: [
			{
				href: "/orders",
				title: "Orders",
				iconName: "bag",
			},
			{
				href: "/wish-list",
				title: "Wishlist",
				iconName: "heart",
			},
			{
				href: "/support-tickets",
				title: "Support Tickets",
				iconName: "customer-service",
			},
		],
	},
	{
		title: "ACCOUNT SETTINGS",
		list: [
			{
				href: "/profile",
				title: "Profile Info",
				iconName: "user",
			},
			{
				href: "/address",
				title: "Addresses",
				iconName: "pin",
			},
			{
				href: "/payment-methods",
				title: "Payment Methods",
				iconName: "credit-card",
			},
		],
	},
];

export default CustomerDashboardNavigation;
