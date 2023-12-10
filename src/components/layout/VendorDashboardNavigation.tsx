import { Icon, Text } from "@chakra-ui/react";
import Box from "../Box";
import FlexBox from "../FlexBox";
import {
	DashboardNavigationWrapper,
	StyledDashboardNav,
} from "./DashboardStyle";
import { FaCartArrowDown, FaChevronDown, FaChevronLeft, FaDatabase, FaDollarSign, FaPaperPlane, FaShopify } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const VendorDashboardNavigation = () => {

	const [isOrdersOpen, setIsOrdersOpen] = useState(true);
	const [isProductsOpen, setIsProductsOpen] = useState(true);
	const [isFinanceOpen, setIsFinanceOpen] = useState(false);
	const [isDataOpen, setIsDataOpen] = useState(false);
	const [isShopOpen, setIsShopOpen] = useState(true);
	const navigate = useNavigate();

	const toggleOrders = () => {
		setIsOrdersOpen(!isOrdersOpen);
	};

	const toggleProducts = () => {
		setIsProductsOpen(!isProductsOpen);
	}

	const toggleFinance = () => {
		setIsFinanceOpen(!isFinanceOpen);
	}

	const toggleData = () => {
		setIsDataOpen(!isDataOpen);
	}

	const toggleShop = () => {
		setIsShopOpen(!isShopOpen);
	}

	return (
		<DashboardNavigationWrapper px="0px" py="1.5rem" color="gray.900">
			<Box>
				<Box mb={3}>
					<StyledDashboardNav
						key='orders'
						px="1.5rem"
						mb="0.5rem"
					>
						<FlexBox alignItems="center" onClick={toggleOrders}>
							<Box className="dashboard-nav-icon-holder" >
								<Icon as={FaPaperPlane} mr="10px" />
							</Box>
							<Text _hover={{ cursor: "pointer" }} >Quản lý đơn hàng</Text>
						</FlexBox>
						<Box ml="auto" onClick={toggleOrders} _hover={{ cursor: "pointer" }}>
							<Icon as={isOrdersOpen ? FaChevronDown : FaChevronLeft} />
						</Box>
					</StyledDashboardNav>
					{isOrdersOpen && (
						<>
							<Text _hover={{ cursor: "pointer", color: "red" }} mb={2} ml={12} onClick={() => { navigate("/vendor/orders") }}>Tất cả</Text>
							{/* <Text _hover={{ cursor: "pointer", color: "red" }} mb={2} ml={12} onClick={() => { navigate("/vendor/orders/cancel") }}>
								Đơn hủy</Text> */}
						</>
					)}
				</Box>

				<Box mb={3}>
					<StyledDashboardNav
						key='orders'
						px="1.5rem"
						mb="0.5rem"
					>
						<FlexBox alignItems="center" onClick={toggleProducts}>
							<Box className="dashboard-nav-icon-holder" >
								<Icon as={FaCartArrowDown} mr="10px" />
							</Box>
							<Text _hover={{ cursor: "pointer" }} >Quản lý sản phẩm</Text>
						</FlexBox>
						<Box ml="auto" onClick={toggleProducts} _hover={{ cursor: "pointer" }}>
							<Icon as={isProductsOpen ? FaChevronDown : FaChevronLeft} />
						</Box>
					</StyledDashboardNav>
					{isProductsOpen && (
						<>
							<Text _hover={{ cursor: "pointer", color: "red" }} mb={2} ml={12} onClick={() => { navigate("/vendor/products") }}>Tất cả sản phẩm</Text>
							<Text _hover={{ cursor: "pointer", color: "red" }} mb={2} ml={12} onClick={() => { navigate("/vendor/products/add") }}>
								Thêm sản phẩm</Text>
							<Text _hover={{ cursor: "pointer", color: "red" }} mb={2} ml={12} onClick={() => { navigate("/vendor/products/ban") }} >
								Sản phẩm vi phạm</Text>
						</>
					)}
				</Box>

				<Box mb={3}>
					<StyledDashboardNav
						key='orders'
						px="1.5rem"
						mb="0.5rem"
					>
						<FlexBox alignItems="center" onClick={toggleFinance}>
							<Box className="dashboard-nav-icon-holder" >
								<Icon as={FaDollarSign} mr="10px" />
							</Box>
							<Text _hover={{ cursor: "pointer" }} >Tài chính</Text>
						</FlexBox>
						<Box ml="auto" onClick={toggleFinance} _hover={{ cursor: "pointer" }}>
							<Icon as={isFinanceOpen ? FaChevronDown : FaChevronLeft} />
						</Box>
					</StyledDashboardNav>
					{isFinanceOpen && (
						<>
							<Text _hover={{ cursor: "pointer", color: "red" }} mb={2} ml={12} onClick={() => { navigate("/vendor/revenues") }}>Doanh thu</Text>
							<Text _hover={{ cursor: "pointer", color: "red" }} mb={2} ml={12} onClick={() => { navigate("/vendor/bank") }}>Tài khoản ngân hàng</Text>
						</>
					)}
				</Box>
				<Box mb={3}>
					<StyledDashboardNav
						key='orders'
						px="1.5rem"
						mb="0.5rem"
					>
						<FlexBox alignItems="center" onClick={toggleData}>
							<Box className="dashboard-nav-icon-holder" >
								<Icon as={FaDatabase} mr="10px" />
							</Box>
							<Text _hover={{ cursor: "pointer" }} >Dữ liệu</Text>
						</FlexBox>
						<Box ml="auto" onClick={toggleData} _hover={{ cursor: "pointer" }}>
							<Icon as={isDataOpen ? FaChevronDown : FaChevronLeft} />
						</Box>
					</StyledDashboardNav>
					{isDataOpen && (
						<>
							<Text _hover={{ cursor: "pointer", color: "red" }} mb={2} ml={12}
								onClick={() => { navigate("/vendor/analysis") }}
							>Phân tích bán hàng</Text>
						</>
					)}
				</Box>
				<Box mb={3}>
					<StyledDashboardNav
						key='orders'
						px="1.5rem"
						mb="0.5rem"
					>
						<FlexBox alignItems="center" onClick={toggleShop}>
							<Box className="dashboard-nav-icon-holder" >
								<Icon as={FaShopify} mr="10px" />
							</Box>
							<Text _hover={{ cursor: "pointer" }}
								onClick={() => { navigate("/vendor/manage") }}
							>Quản lý shop</Text>
						</FlexBox>
						<Box ml="auto" onClick={toggleShop} _hover={{ cursor: "pointer" }}>
							<Icon as={isOrdersOpen ? FaChevronDown : FaChevronLeft} />
						</Box>
					</StyledDashboardNav>
					{isShopOpen && (
						<>
							<Text _hover={{ cursor: "pointer", color: "red" }} mb={2} ml={12}
								onClick={() => { navigate("/vendor/ratings") }}
							>Đánh giá shop</Text>
							<Text _hover={{ cursor: "pointer", color: "red" }} mb={2} ml={12}
								onClick={() => { navigate("/vendor/profile") }}
							>Hồ sơ shop</Text>
						</>
					)}
				</Box>

			</Box>
		</DashboardNavigationWrapper>
	);
};

export default VendorDashboardNavigation;
