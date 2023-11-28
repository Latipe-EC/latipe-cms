import LazyImage from '../LazyImage';
import React, { useCallback, useState } from 'react';
import { CSSProperties } from 'styled-components';
import Box from '../Box';
import Card, { CardProps } from '../Card';
import FlexBox from '../FlexBox';
import Icon from '../icon/Icon';
import Modal from '../modal/Modal';
import ProductIntro from '../products/ProductIntro';
import Rating from '../rating/Rating';
import { SemiSpan } from '../Typography';
import { StyledProductCard1 } from './ProductCardStyle';
import { Center, Spinner, Text, Tooltip } from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { AppThunkDispatch } from '../../store/store';
import { getProductById } from '../../store/slices/products-slice';
import { useNavigate } from 'react-router-dom';
import { ProductDetailResponse } from 'api/interface/product';

export interface ProductCard1Props extends CardProps {
	className?: string;
	style?: CSSProperties;
	images?: unknown[];
	name?: string;
	price?: number;
	ratings?: number;
	id?: string;

}

const ProductCard1: React.FC<ProductCard1Props> = ({
	id,
	images,
	name,
	price,
	ratings,
	...props
}) => {
	const dispatch = useDispatch<AppThunkDispatch>();
	const navigate = useNavigate();


	const [product, setProduct] = useState<ProductDetailResponse>();
	const [open, setOpen] = useState(false);
	const [loadingProduct, setLoadingProduct] = useState(false);

	const toggleDialog = useCallback(() => {
		setLoadingProduct(true);
		dispatch(getProductById(id)).unwrap().then((res) => {
			setProduct(res.data);
			setOpen((open) => !open);
			setLoadingProduct(false);
			return res.data;
		});
	}, []);


	return (
		<StyledProductCard1 {...props}>
			<div className="image-holder">
				{/* {!!off && (
					<Chip
						position="absolute"
						bg="primary.main"
						color="primary.text"
						fontSize="10px"
						fontWeight="600"
						p="5px 10px"
						top="10px"
						left="10px"
					>
						{off}% off
					</Chip>
				)} */}

				<FlexBox className="extra-icons">
					<Icon
						color="secondary"
						variant="small"
						mb="0.5rem"
						onClick={toggleDialog}
					>
						eye-alt
					</Icon>

					<Icon className="favorite-icon outlined-icon" variant="small">
						heart
					</Icon>
					{/* <Icon className="favorite-icon" color="primary" variant="small">
              heart-filled
            </Icon> */}
				</FlexBox>

				<a href={`/products/${id}`}>
					<LazyImage
						src={images[0]}
						width="100%"
						height="auto"
						layout="responsive"
						alt={name}
					/>
				</a>
			</div>
			<div className="details">
				<FlexBox>
					<Box flex="1 1 0" minWidth="0px" mr="0.5rem">
						<a href={`/products/${id}`}>
							<Tooltip label={name} placement="top">
								<Text isTruncated fontWeight="600" fontSize="14px" mb="0.25rem">
									{name}
								</Text>
							</Tooltip>
						</a>

						<Rating value={ratings || 0} outof={5} color="warn" readonly />

						<FlexBox alignItems="center" mt="10px">
							<SemiSpan pr="0.5rem" fontWeight="600" color="primary.main">
								₫{(price).toLocaleString('vi-VN')}
							</SemiSpan>
						</FlexBox>
					</Box>
				</FlexBox>
			</div>
			{loadingProduct ? (
				<Center position="fixed" top="0" right="0" bottom="0" left="0" zIndex="9999">
					<Spinner size="xl" />
				</Center>
			) : (
				<Modal open={open} onClose={toggleDialog}>
					<Card p="1rem" position="relative"
						onClick={() => navigate(`/products/${id}`)}
					>
						<ProductIntro
							product={product} />
						<Box
							position="absolute"
							top="0.75rem"
							right="0.75rem"
							cursor="pointer"
						>
							<Icon
								className="close"
								color="primary"
								variant="small"
								onClick={toggleDialog}
							>
								close
							</Icon>
						</Box>
					</Card>
				</Modal>)
			}
		</StyledProductCard1>
	);
};

export default ProductCard1;
