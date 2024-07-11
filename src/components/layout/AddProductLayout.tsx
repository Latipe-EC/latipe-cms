import Topbar from "../topbar/Topbar";
import React from "react";
import styled from "styled-components";
import { Outlet } from "react-router-dom";

const AddProductLayout: React.FC = () => (
	<div>
		<StyledAppLayout>
			<Topbar />
			<div className="section-after-sticky"
				style={{ paddingLeft: "10%", paddingRight: "10%", marginBottom: "20px" }}><Outlet /></div>
		</StyledAppLayout>
	</div>

);

const StyledAppLayout = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;
export default AddProductLayout;
