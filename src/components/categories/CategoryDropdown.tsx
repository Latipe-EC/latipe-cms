import React from "react";
import CategoryMenuItem from "./category-menu-item/CategoryMenuItem";
import { StyledCategoryDropdown } from "./CategoryDropdownStyle";
import MegaMenu1 from "./mega-menu/MegaMenu1";
import MegaMenu2 from "./mega-menu/MegaMenu2";
import { RootState, useAppSelector } from "../../store/store";
import { CategoryResponse } from "api/interface/product";

export interface CategoryDropdownProps {
	open: boolean;
	position?: "absolute" | "relative";
}

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
	open,
	position,
}) => {

	const categories = useAppSelector((state: RootState) => state.categories);

	const megaMenu = {
		MegaMenu1,
		MegaMenu2,
	};

	return (
		<StyledCategoryDropdown open={open} position={position}>
			{categories.children.length > 0 && categories.children.slice(0, 10).map((item: CategoryResponse) => {
				// const MegaMenu = megaMenu[item.menuComponent];
				return (
					<CategoryMenuItem
						title={item.name}
						href={`/search?category=${encodeURIComponent(item.name)}`}
						// icon={item.image}
						caret={!!item.menuData}
						key={item.id}
					>
						{/* <MegaMenu data={item.menuData || {}} /> */}
					</CategoryMenuItem>
				);
			})}
		</StyledCategoryDropdown>
	);
};

CategoryDropdown.defaultProps = {
	position: "absolute",
};

export default CategoryDropdown;
