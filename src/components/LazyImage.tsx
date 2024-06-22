import React from 'react';
import { Image } from 'react-bootstrap';
import styled from 'styled-components';
import {
	layout,
	border,
	BorderProps,
	color,
	ColorProps,
	LayoutProps,
	space,
	SpaceProps,
} from 'styled-system';

type LazyImageProps =
	React.ImgHTMLAttributes<HTMLImageElement>
	& BorderProps
	& SpaceProps
	& ColorProps
	& LayoutProps


const LazyImage = styled(({ borderRadius, ...props }: LazyImageProps) => {
	return <Image style={{
		borderRadius: borderRadius ? borderRadius.toString() : undefined,
		objectFit: 'cover',
	}} {...props} />;
}) <React.ImgHTMLAttributes<HTMLImageElement>>`
		display: block;
		${color}
		${space}
		${border}
		${layout} // Add this line

	`;

export default LazyImage;