import { useEffect, useState } from "react";
import CheckoutNavLayout from "@components/layout/CheckoutNavLayout";
import { AppThunkDispatch, RootState, useAppSelector } from "@stores/store";
import { useDispatch } from "react-redux";
import { Box, Text, Stack, Heading } from "@chakra-ui/react";
import { getNotifications } from "@/stores/slices/notification-slice";
import FlexBox from "@/components/FlexBox";
import Pagination from "@/components/pagination/Pagination";
import Typography, { H6 } from "@/components/Typography";
import Avatar from "@/components/avatar/Avatar";
import { removeTagHtml } from "@/utils/utils";
import { NotificationModal } from "@/components/notification/NotificationModal";
import { CampaignDetail } from "@/api/interface/notification";

const Notificaions = () => {
	const dispatch = useDispatch<AppThunkDispatch>();
	const [currentPage, setCurrentPage] = useState(1);
	const notifications = useAppSelector((state: RootState) => state.notifications);
	const size = 10;
	const [showNotificationModal, setShowNotificationModal] = useState(false);
	const [selectNotification, setSelectNotification] = useState<CampaignDetail>();

	useEffect(() => {
		dispatch((getNotifications({
			page: currentPage,
			size: size
		})))
	}, []);

	return (
		<Box px={12} py={4}>
			<Stack spacing={8} mt={8}>
				<Box>
					<Heading as="h2" size="lg" mb={4} transition="color 0.3s ease" color="black" _hover={{ color: "blue.500" }}>
						Thông báo
					</Heading>
					<Box mt="1rem" flexWrap="wrap">
						{notifications.items && notifications.items.length > 0 ? (
							<>
								{notifications.items.map((item) => (
									<Box
										px="1rem"
										py="0.5rem"
										flexWrap="wrap"
										alignItems="center"
										key={item}
										mb="1rem" // Add some spacing between items
										border="1px solid" // Add a border
										borderColor={item.read ? "gray.300" : "green.500"} // Change the border color based on read status
										borderRadius="10px" // Add border radius for rounded corners
										transition="all 0.3s ease" // Add transition for smooth hover effect
										_hover={{ boxShadow: "0 0 10px rgba(0,0,0,0.1)", transform: "scale(1.05)" }}
										cursor="pointer" // Change cursor to pointer on hover
										width="50%" // Make each card take up half the width of the row
										maxWidth="800px" // Limit the maximum width
										margin="0 auto 20px auto" // Add margin to the bottom of each card
										onClick={() => {
											setSelectNotification(item);
											setShowNotificationModal(true);
										}}
									>
										<FlexBox flex="2 2 260px" m="6px" alignItems="center">
											<Avatar
												src={item.image ? item.image : "/assets/images/products/default.png"} // Use a more descriptive placeholder image
												alt={item.image ? `Avatar for ${item.title}` : "Default Avatar"} // Add alt text for accessibility
												size={64}
											/>
											<Box ml="20px">
												<H6 my="0px">{item.title}</H6>
												<FlexBox alignItems="center" justifyContent="space-between">
													<Typography fontSize="14px" color="text.muted">
														{removeTagHtml(item.body).length > 40
															? `${removeTagHtml(item.body).slice(0, 40)}...`
															: removeTagHtml(item.body)}
													</Typography>
												</FlexBox>
											</Box>
										</FlexBox>
									</Box>))}
								<FlexBox justifyContent="center" mt="2.5rem">
									<Pagination
										pageCount={Math.ceil(notifications.total / size)}
										onChange={(data) => {
											window.scrollTo(0, 0);
											dispatch((getNotifications({
												page: +data + 1,
												size: size
											})))
											setCurrentPage(+data + 1);
										}}
									/>
								</FlexBox>
							</>
						) : (
							<FlexBox justifyContent="center" alignItems="center" mt="2.5rem" height={"xl"}>
								<Text fontSize="x-large" textAlign="center" fontWeight="bold">
									Không có thông báo nào
								</Text>
							</FlexBox>
						)}
					</Box>
				</Box>
				<NotificationModal isOpen={showNotificationModal} onClose={() => setShowNotificationModal(false)} notification={selectNotification} />
			</Stack>
		</Box>
	);
};

Notificaions.layout = CheckoutNavLayout;

export default Notificaions;