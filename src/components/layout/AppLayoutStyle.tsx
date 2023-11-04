import styled from "styled-components";
import { getTheme } from "../../utils/utils";

const StyledAppLayout = styled.div`
  width: 100%;
  height: 100%;
	min-height: 100vh;
  .header-container {
    box-shadow: ${getTheme("shadows.regular")};
  }
	.section-after-sticky {
    padding-top: 4rem; /* Add some padding to make room for the sticky header */
  }

`;

export default StyledAppLayout;
