import styled from "styled-components";
import Card from "../Card";
interface ShopIntroWrapperProps {
	imageSrc: string;
}
export const ShopIntroWrapper = styled(Card) <ShopIntroWrapperProps>`
  .cover-image {
    background-image: url(${props => props.imageSrc});
    background-size: cover;
    background-position: center;
  }

  .description-holder {
    min-width: 250px;

    @media only screen and (max-width: 500px) {
      margin-left: 0px;
    }
  }
`;
