import AppStore from "../AppStore";
import Image from "../Image";
import React, { } from "react";
import styled from "styled-components";
import { getTheme } from "../../utils/utils";
import Box from "../Box";
import Container from "../Container";
import FlexBox from "../FlexBox";
import Grid from "../grid/Grid";
import Icon from "../icon/Icon";
import Typography, { Paragraph } from "../Typography";
import './Footer.css';

const StyledLink = styled.a`
position: relative;
display: block;
padding: 0.3rem 0rem;
color: ${getTheme("colors.gray.500")};
cursor: pointer;
border-radius: 4px;
:hover {
	color: ${getTheme("colors.gray.100")};
}
`;

const FooterContainer = styled.footer`

`;
const Footer: React.FC = () => {


	return (
		<FooterContainer >
			<Box bg="#0F3460">
				<Container p="1rem" color="white">
					<Box py="5rem" overflow="hidden">
						<Grid container spacing={6}>
							<Grid item lg={4} md={6} sm={6} xs={12}>
								<a href="/">
									<Image
										mb="1.25rem"
										src="/assets/images/logo.svg"
										alt="logo"
									/>
								</a>

								<Paragraph mb="1.25rem" color="gray.500">
									Lorem ipsum dolor sit amet, consectetur adipiscing elit.
									Auctor libero id et, in gravida. Sit diam duis mauris nulla
									cursus. Erat et lectus vel ut sollicitudin elit at amet.
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

								<div>
									{aboutLinks.map((item, ind) => (
										<a href="/" key={ind}>
											<StyledLink>{item}</StyledLink>
										</a>
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
										<a href="/" key={ind}>
											<StyledLink>{item}</StyledLink>
										</a>
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
