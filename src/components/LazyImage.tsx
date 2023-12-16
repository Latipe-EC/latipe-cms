import React from 'react';
import {Image} from 'react-bootstrap';
import styled from 'styled-components';
import {
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
    & LayoutProps;

const LazyImage = styled(({...props}: LazyImageProps) => {
  return <Image {...props} />;
})<React.ImgHTMLAttributes<HTMLImageElement>>`
  display: block;

  ${color}
  ${space}
  ${border}
`;

export default LazyImage;