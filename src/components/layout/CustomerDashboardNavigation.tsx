import Box from "../Box";
import { Fragment, useEffect } from "react";
import FlexBox from "../FlexBox";
import Icon from "../icon/Icon";
import Typography from "../Typography";
import { DashboardNavigationWrapper, StyledDashboardNav, } from "./DashboardStyle";
import { useDispatch } from "react-redux";
import { countMyAddress } from "@stores/slices/user-slice";
import { countMyOrder } from "@stores/slices/orders-slice";
import { AppThunkDispatch, RootState, useAppSelector } from "@stores/store";
import { generateUUID } from "@/utils/utils";

const CustomerDashboardNavigation = () => {
	const pathname = window.location.pathname;
	const dispatch = useDispatch<AppThunkDispatch>();
	const user = useAppSelector((state: RootState) => state.user);
	const order = useAppSelector((state: RootState) => state.order);
	let loading = false;

	useEffect(() => {
		if (loading) return;
		dispatch(countMyAddress());
		dispatch(countMyOrder());
		loading = true;
	}, [dispatch]);


	const getCount = (title: string) => {
		switch (title) {
			case "Địa chỉ": {
				return user.countAddress;
			}
			case "Đơn mua": {
				return order.count;
			}
			default:
				return "";
		}
	};

	return (
		<DashboardNavigationWrapper px="0px" pb="1.5rem" color="gray.900">
			{linkList.map((item) => (
				<Fragment key={generateUUID()}>
					<Typography p="26px 30px 1rem" color="text.muted" fontSize="12px">
						{item.title}
					</Typography>
					{item.list.map((item) => (
						<StyledDashboardNav
							isCurrentPath={pathname.includes(item.href)}
							href={item.href}
							px="1.5rem"
							mb="1.25rem"
							key={generateUUID()}
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
		title: "Sửa Hồ Sơ",
		list: [
			{
				href: "/orders",
				title: "Đơn mua",
				iconName: "bag",
			},
			{
				href: "/support-tickets",
				title: "Hỗ trợ",
				iconName: "customer-service",
			},
		],
	},
	{
		title: "CÀI ĐẶT TÀI KHOẢN",
		list: [
			{
				href: "/profile",
				title: "Thông tin cá nhân",
				iconName: "user",
			},
			{
				href: "/address",
				title: "Địa chỉ",
				iconName: "pin",
			},

		],
	},
];

export default CustomerDashboardNavigation;
