import React from 'react';
import Container from '../Container';
import FlexBox from '../FlexBox';
import Icon from '../icon/Icon';
import NavLink from '../nav-link/NavLink';
import StyledTopbar from './Topbar.style';
import { useNavigate } from 'react-router-dom';

const Topbar: React.FC = () => {
	const navigate = useNavigate();


	return (
		<StyledTopbar>
			<Container
				display="flex"
				justifyContent="space-between"
				alignItems="center"
				height="100%"
			>
				<FlexBox className="topbar-left">
					<div className="logo">
						<img src="/assets/images/latipe_logo.jpeg" alt="logo" />
					</div>
					<FlexBox alignItems="center">
						<Icon size="14px">phone-call</Icon>
						<span>+82 232 232 323</span>
					</FlexBox>
					<FlexBox alignItems="center" ml="20px">
						<Icon size="14px">mail</Icon>
						<span>support@latipe.com</span>
					</FlexBox>
					<FlexBox alignItems="center" ml="20px" style={{ cursor: "pointer" }}
						onClick={() => {
							navigate("/vendor")
						}}>
						<Icon size="14px">user</Icon>
						<span>Kênh người bán</span>
					</FlexBox>
				</FlexBox>
				<FlexBox className="topbar-right" alignItems="center">
					<NavLink className="link" href="/help">
						Need Help?
					</NavLink>
					{/* <Menu
						direction="right"
						handler={
							<FlexBox
								className="dropdown-handler"
								alignItems="center"
								height="40px"
								mr="1.25rem"
							>
								<Image src={language.imgUrl} alt={language.title} />
								<Small fontWeight="600">{language.title}</Small>
								<Icon size="1rem">chevron-down</Icon>
							</FlexBox>
						}
					>
						{languageList.map((item) => (
							<MenuItem key={item.title} onClick={handleLanguageClick(item)}>
								<Image
									src={item.imgUrl}
									borderRadius="2px"
									mr="0.5rem"
									alt={item.title}
								/>
								<Small fontWeight="600">{item.title}</Small>
							</MenuItem>
						))}
					</Menu>
					<Menu
						direction="right"
						handler={
							<FlexBox
								className="dropdown-handler"
								alignItems="center"
								height="40px"
							>
								<Image src={currency.imgUrl} alt={currency.title} />
								<Small fontWeight="600">{currency.title}</Small>
								<Icon size="1rem">chevron-down</Icon>
							</FlexBox>
						}
					>
						{currencyList.map((item) => (
							<MenuItem key={item.title} onClick={handleCurrencyClick(item)}>
								<Image
									src={item.imgUrl}
									borderRadius="2px"
									mr="0.5rem"
									alt={item.title}
								/>
								<Small fontWeight="600">{item.title}</Small>
							</MenuItem>
						))}
					</Menu> */}
				</FlexBox>
			</Container>
		</StyledTopbar>
	);
};

export default Topbar;
