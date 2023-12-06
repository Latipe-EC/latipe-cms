import { useEffect, useState } from "react";
import Avatar from "../../../src/components/avatar/Avatar";
import Box from "../../../src/components/Box";
import Button from "../../../src/components/buttons/Button";
import Card from "../../../src/components/Card";
import FlexBox from "../../../src/components/FlexBox";
import Grid from "../../../src/components/grid/Grid";
import DashboardPageHeader from "../../../src/components/layout/DashboardPageHeader";
import TableRow from "../../../src/components/TableRow";
import Typography, { H3, H5, Small } from "../../../src/components/Typography";
import { format } from "date-fns";
import { UserResponse } from "api/interface/user";
import { useDispatch } from "react-redux";
import { AppThunkDispatch } from "store/store";
import { getMyProfile } from "../../store/slices/user-slice";

const Profile = () => {

	const dispatch = useDispatch<AppThunkDispatch>();


	const [profile, setProfile] = useState<UserResponse>();

	useEffect(() => {
		dispatch(getMyProfile()).unwrap().then((res) => {
			setProfile(res.data);
		});
	}, []);

	return (
		<div>
			<DashboardPageHeader
				iconName="user_filled"
				title="My Profile"
				button={
					<a href="/profile/edit">
						<Button color="primary" bg="primary.light" px="2rem">
							Chỉnh sửa
						</Button>
					</a>
				}
			/>

			<Box mb="30px">
				<Grid container spacing={6}>
					<Grid item lg={6} md={6} sm={12} xs={12}>
						<FlexBox as={Card} p="14px 32px" height="100%" alignItems="center">
							<Avatar src="/assets/images/faces/ralph.png" size={64} />
							<Box ml="12px" flex="1 1 0">
								<FlexBox
									flexWrap="wrap"
									justifyContent="space-between"
									alignItems="center"
								>
									<div>
										<H5 my="0px">{profile.displayName}</H5>
										<FlexBox alignItems="center">
											<Typography fontSize="14px" color="text.hint">
												Balance:
											</Typography>
											<Typography ml="4px" fontSize="14px" color="primary.main">
												$500
											</Typography>
										</FlexBox>
									</div>

								</FlexBox>
							</Box>
						</FlexBox>
					</Grid>

					<Grid item lg={6} md={6} sm={12} xs={12}>
						<Grid container spacing={4}>
							{infoList.map((item) => (
								<Grid item lg={3} sm={6} xs={6} key={item.subtitle}>
									<FlexBox
										as={Card}
										flexDirection="column"
										alignItems="center"
										height="100%"
										p="1rem 1.25rem"
									>
										<H3 color="primary.main" my="0px" fontWeight="600">
											{item.title}
										</H3>
										<Small color="text.muted" textAlign="center">
											{item.subtitle}
										</Small>
									</FlexBox>
								</Grid>
							))}
						</Grid>
					</Grid>
				</Grid>
			</Box>

			<TableRow p="0.75rem 1.5rem">
				<FlexBox flexDirection="column" p="0.5rem">
					<Small color="text.muted" mb="4px" textAlign="left">
						First Name
					</Small>
					<span>Ralph</span>
				</FlexBox>
				<FlexBox flexDirection="column" p="0.5rem">
					<Small color="text.muted" mb="4px" textAlign="left">
						Last Name
					</Small>
					<span>Edwards</span>
				</FlexBox>
				<FlexBox flexDirection="column" p="0.5rem">
					<Small color="text.muted" mb="4px" textAlign="left">
						Email
					</Small>
					<span>ralfedwards@email.com</span>
				</FlexBox>
				<FlexBox flexDirection="column" p="0.5rem">
					<Small color="text.muted" mb="4px" textAlign="left">
						Phone
					</Small>
					<span>+1983649392983</span>
				</FlexBox>
				<FlexBox flexDirection="column" p="0.5rem">
					<Small color="text.muted" mb="4px">
						Birth date
					</Small>
					<span className="pre">
						{format(new Date(1996 / 11 / 16), "dd MMM, yyyy")}
					</span>
				</FlexBox>
			</TableRow>
		</div>
	);
};

const infoList = [
	{
		title: "16",
		subtitle: "All Orders",
	},
	{
		title: "02",
		subtitle: "Awaiting Payments",
	},
	{
		title: "00",
		subtitle: "Awaiting Shipment",
	},
	{
		title: "01",
		subtitle: "Awaiting Delivery",
	},
];


export default Profile;
