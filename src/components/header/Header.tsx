import IconButton from "../buttons/IconButton";
import Image from "../Image";
import React, { useEffect, useState } from "react";
import Box from "../Box";
import Categories from "../categories/Categories";
import Container from "../Container";
import FlexBox from "../FlexBox";
import Icon from "../icon/Icon";
import MiniCart from "../mini-cart/MiniCart";
import SearchBox from "../search-box/SearchBox";
import Login from "../sessions/Login";
import Sidenav from "../sidenav/Sidenav";
import { H6, Paragraph } from "../Typography";
import StyledHeader from "./HeaderStyle";
import UserLoginDialog from "./UserLoginDialog";
import MenuItem from "../MenuItem";
import Menu from "../Menu";
import { useNavigate } from "react-router-dom";
import { AppThunkDispatch, RootState, useAppSelector } from "@stores/store";
import { Button, useToast } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { getNotificationCount, getNotifications, markAllRead } from "@/stores/slices/notification-slice";
import { generateUUID, removeTagHtml } from "@/utils/utils";
import { NotificationModal } from "@/components/notification/NotificationModal";
import { CampaignDetail } from "@/api/interface/notification";

type HeaderProps = {
	isFixed?: boolean;
	className?: string;
};

const Header: React.FC<HeaderProps> = ({ isFixed, className }) => {
	const [open, setOpen] = useState(false);
	const navigate = useNavigate();
	const dispatch = useDispatch<AppThunkDispatch>();
	const notifications = useAppSelector((state: RootState) => state.notifications);
	const [showNotificationModal, setShowNotificationModal] = useState(false);
	const REACT_STARTER_AUTH = JSON.parse(localStorage.getItem("REACT_STARTER_AUTH"));
	const [selectNotification, setSelectNotification] = useState<CampaignDetail>();

	const toast = useToast();

	const toggleSidenav = () => {
		if (!REACT_STARTER_AUTH || !REACT_STARTER_AUTH.isAuthenticated) {
			navigate('/login');
			return;
		}
		setOpen(!open)
	};


	const logout = () => {
		localStorage.clear();
		window.location.href = '/';
	}
	const carts = useAppSelector((state: RootState) => state.carts);

	const redirect = (path: string) => {
		navigate(path);
	}

	const handleMarkAllAsRead = () => {
		dispatch(markAllRead())
			.unwrap()
			.then(res => {
				if (res.status !== 200) {
					toast({
						title: "Có lỗi xảy ra",
						description: "Vui lòng thử lại",
						status: "error",
						duration: 3000,
						isClosable: true,
					});
				}
			});
	};

	const cartHandle = (
		<IconButton ml="1rem" bg="gray.200" p="8px" style={{ position: 'relative' }}> {/* Ensure IconButton has position: 'relative' */}
			<Icon size="28px">bag</Icon>
			{carts.count > 0 && (
				<Box
					className="cart-count"
					position="absolute" // Change this to 'absolute'
					top="-2px"
					right="-2px"
					bg="primary.main"
					color="white"
					borderRadius="50%"
					width="20px"
					height="20px"
					display="flex"
					alignItems="center"
					justifyContent="center"
					fontSize="12px"
					fontWeight="600"
				>
					{carts.count > 100 ? '100+' : carts.count}
				</Box>
			)}
		</IconButton>
	);

	const notificationHandler = (<IconButton ml="1rem" bg="gray.200" p="8px">
		<Icon size="28px">notification</Icon>
		{notifications.count > 0 && (
			<Box
				className="notification-count"
				position="absolute"
				top="-2px"
				right="-2px"
				bg="primary.main"
				color="white"
				borderRadius="50%"
				width="20px"
				height="20px"
				display="flex"
				alignItems="center"
				justifyContent="center"
				fontSize="12px"
				fontWeight="600"
			>
				{notifications.count > 10 ? '10+' : notifications.count}
			</Box>
		)}
	</IconButton>)

	useEffect(() => {
		dispatch((getNotifications({
			page: '1',
			size: '4'
		})))

		dispatch(getNotificationCount())
	}, []);

	return (
		<StyledHeader className={className}>
			<Container
				display="flex"
				alignItems="center"
				justifyContent="space-between"
				height="100%"
			>
				<FlexBox className="logo" alignItems="center" mr="1rem">
					<a href="/">
						<Image src="/assets/images/latipe_logo.jpeg" alt="logo" />
					</a>

					{isFixed && (
						<div className="category-holder">
							<Categories>
								<FlexBox color="text.hint" alignItems="center" ml="1rem">
									<Icon>categories</Icon>
									<Icon>arrow-down-filled</Icon>
								</FlexBox>
							</Categories>
						</div>
					)}
				</FlexBox>

				<FlexBox justifyContent="center" flex="1 1 0">
					<SearchBox />
				</FlexBox>

				<FlexBox className="header-right" alignItems="center">
					{REACT_STARTER_AUTH && REACT_STARTER_AUTH.isAuthenticated ?
						<Menu
							className="category-dropdown"
							direction="right"
							handler={
								<IconButton ml="1rem" bg="gray.200" p="8px">
									<Icon size="28px">user</Icon>
								</IconButton>
							}
						>
							<MenuItem key="1" onClick={() => redirect("/profile")}>
								Tài khoản của tôi
							</MenuItem>
							<MenuItem key="2" onClick={() => redirect("/orders")}>
								Đơn hàng
							</MenuItem>
							<MenuItem key="3" onClick={logout}>
								Đăng xuất
							</MenuItem>
						</Menu>
						:
						<UserLoginDialog
							handle={
								<IconButton ml="1rem" bg="gray.200" p="8px">
									<Icon size="28px">user</Icon>
								</IconButton>
							}
						>
							<Box>
								<Login />
							</Box>
						</UserLoginDialog>

					}
					{REACT_STARTER_AUTH && REACT_STARTER_AUTH.isAuthenticated &&
						<Menu
							className="notification-dropdown"
							direction="right"
							handler={notificationHandler}
						>
							{notifications.items && notifications.items.length !== 0
								&& notifications.items.slice(0, 10).map((notification, index) => (<MenuItem key={generateUUID()} >
									<Box maxHeight="400px" overflow="auto">
										<Box
											key={index}
											p="1rem"
											borderBottom="1px solid"
											borderColor="gray.200"
											width="100%"
											bg={!notification.unread ? 'gray.100' : 'white'}
											_hover={{
												bg: 'gray.100',
											}}
											cursor="pointer"
											onClick={() => {
												setShowNotificationModal(true);
												setSelectNotification(notification);
											}}
										>
											<FlexBox width="300px" alignItems="center" mb="0.5rem">
												<Image src={notification.image} alt={notification.title} width="40px" height="40px" mr="1rem" />
												<Box flexGrow={1}>
													<H6 fontSize="14px" mb="0.25rem" fontWeight={!notification.readAt ? 'bold' : 'normal'}>
														{notification.title}
													</H6>
													<Paragraph fontSize="12px" color={!notification.unread ? 'gray.600' : 'text.muted'}>
														{removeTagHtml(notification.body).length > 40
															? `${removeTagHtml(notification.body).slice(0, 40)}...`
															: removeTagHtml(notification.body)}
													</Paragraph>
												</Box>
											</FlexBox>
										</Box>
									</Box>
								</MenuItem>))}
							<FlexBox justifyContent="space-between" alignItems="center" p="1rem">
								<Button
									variant="solid"
									colorScheme="blue"
									_hover={{
										bg: 'blue.600',
									}}
									onClick={(() => navigate('/notifications'))}
									mr="1rem"
								>
									Xem tất cả
								</Button>
								<Button
									variant="outline"
									colorScheme="blue"
									onClick={handleMarkAllAsRead}
									isDisabled={!notifications.items || notifications.items.length === 0}
									_hover={{
										bg: 'blue.50',
									}}
								>
									Đánh dấu đã đọc
								</Button>
							</FlexBox>
						</Menu>}

					<NotificationModal isOpen={showNotificationModal} onClose={() => setShowNotificationModal(false)} notification={selectNotification} />

					<Sidenav
						handle={cartHandle}
						position="right"
						open={open}
						width={380}
						toggleSidenav={toggleSidenav}
					>
						<MiniCart toggleSidenav={toggleSidenav} />
					</Sidenav>
				</FlexBox>
			</Container>
		</StyledHeader>
	);
};

export default Header;
