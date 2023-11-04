import styled from "styled-components";
import { getTheme } from "../../utils/utils";

const StyledAppLayout = styled.div`
  width: 100%;
  height: 100%;
  .header-container {
    box-shadow: ${getTheme("shadows.regular")};
  }
	
`;

export default StyledAppLayout;
