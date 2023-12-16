import React from "react";
import Icon from "../../icon/Icon";
import {StyledCategoryMenuItem} from "./CategoryMenuItemStyle";

interface CategoryMenuItemProps {
  href: string;
  icon?: string;
  title: string;
  caret?: boolean;
  children?: any;
}

const CategoryMenuItem: React.FC<CategoryMenuItemProps> = ({
                                                             href,
                                                             icon,
                                                             title,
                                                             caret,
                                                             children,
                                                           }) => {
  return (
      <StyledCategoryMenuItem>
        <a href={href}>
          <div className="category-dropdown-link">
            {icon && <Icon variant="small">{icon}</Icon>}
            <span className="title">{title}</span>
            {caret && <Icon variant="small">chevron-right</Icon>}
          </div>
        </a>
        {children}
      </StyledCategoryMenuItem>
  );
};

CategoryMenuItem.defaultProps = {
  caret: true,
};

export default CategoryMenuItem;
