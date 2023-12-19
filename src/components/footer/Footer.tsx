import AppStore from "../AppStore";
import Image from "../Image";
import React from "react";
import styled from "styled-components";
import Box from "../Box";
import Container from "../Container";
import FlexBox from "../FlexBox";
import Grid from "../grid/Grid";
import Icon from "../icon/Icon";
import Typography, { Paragraph } from "../Typography";
import './Footer.css';
import { useNavigate } from "react-router-dom";

const FooterContainer = styled.footer`

`;
const Footer: React.FC = () => {
	const navigate = useNavigate();
	return (
		<FooterContainer>
			<Box bg="#0F3460">
				<Container p="1rem" color="white">
					<Box py="5rem" overflow="hidden">
						<Grid container spacing={6}>
							<Grid item lg={4} md={6} sm={6} xs={12}>
								<a href="/">
									<Image
										mb="1.25rem"
										src="/assets/images/latipe_logo.jpeg"
										alt="logo"
									/>
								</a>

								<Paragraph mb="1.25rem" color="gray.500">
									Với hàng triệu sản phẩm từ các thương hiệu, cửa hàng uy tín, hàng nghìn loại mặt hàng từ Điện thoại smartphone tới Rau củ quả tươi, kèm theo dịch vụ giao hàng siêu tốc TikiNOW, Tiki mang đến cho bạn một trải nghiệm mua sắm online bắt đầu bằng chữ tín. Thêm vào đó, ở Tiki bạn có thể dễ dàng sử dụng vô vàn các tiện ích khác như mua thẻ cào, thanh toán hoá đơn điện nước, các dịch vụ bảo hiểm.
								</Paragraph>

								<AppStore />
							</Grid>

							<Grid item lg={2} md={6} sm={6} xs={12}>
								<Typography
									fontSize="25px"
									fontWeight="600"
									mb="1.25rem"
									lineHeight="1"
								>
									About Us
								</Typography>

								<div style={{ display: 'flex', flexDirection: 'column', minHeight: '100px' }}>
									{aboutLinks.map((item, ind) => (
										<Typography key={ind} onClick={() => navigate("/")} py="0.3rem"
											color="gray.500">
											{item}
										</Typography>
									))}
								</div>
							</Grid>

							<Grid item lg={3} md={6} sm={6} xs={12}>
								<Typography
									fontSize="25px"
									fontWeight="600"
									mb="1.25rem"
									lineHeight="1"
								>
									Customer Care
								</Typography>

								<div>
									{customerCareLinks.map((item, ind) => (
										<Typography key={ind} onClick={() => navigate("/")} py="0.3rem"
											color="gray.500">
											{item}
										</Typography>
									))}
								</div>
							</Grid>

							<Grid item lg={3} md={6} sm={6} xs={12}>
								<Typography
									fontSize="25px"
									fontWeight="600"
									mb="1.25rem"
									lineHeight="1"
								>
									Contact Us
								</Typography>
								<Typography py="0.3rem" color="gray.500">
									NUMBER 1 VVN, THU DUC CITY, HO CHI MINH CITY, VIETNAM
								</Typography>
								<Typography py="0.3rem" color="gray.500">
									Email: support.help@latipe.com
								</Typography>
								<Typography py="0.3rem" mb="1rem" color="gray.500">
									Phone: +84 123 456 789
								</Typography>

								<FlexBox className="flex" mx="-5px">
									{iconList.map((item) => (
										<a
											href={item.url}
											target="_blank"
											rel="noreferrer noopenner"
											key={item.iconName}
										>
											<Box
												m="5px"
												size="small"
												p="10px"
												bg="rgba(0,0,0,0.2)"
												borderRadius="50%"
											>
												<Icon size="12px" defaultcolor="auto">
													{item.iconName}
												</Icon>
											</Box>
										</a>
									))}
								</FlexBox>
							</Grid>
						</Grid>
					</Box>
				</Container>
			</Box>
		</FooterContainer>
	);
};

const aboutLinks = [
	"Careers",
	"Our Stores",
	"Our Cares",
	"Terms & Conditions",
	"Privacy Policy",
];

const customerCareLinks = [
	"Help Center",
	"How to Buy",
	"Track Your Order",
	"Corporate & Bulk Purchasing",
	"Returns & Refunds",
];

const iconList = [
	{ iconName: "facebook", url: "https://www.facebook.com/UILibOfficial" },
	{ iconName: "twitter", url: "/" },
	{
		iconName: "youtube",
		url: "https://www.youtube.com/channel/UCsIyD-TSO1wQFz-n2Y4i3Rg",
	},
	{ iconName: "google", url: "/" },
	{ iconName: "instagram", url: "/" },
];

export default Footer;
