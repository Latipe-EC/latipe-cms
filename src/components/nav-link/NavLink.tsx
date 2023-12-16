import React, {AnchorHTMLAttributes} from "react";
import {CSSProperties} from "styled-components";
import {ColorProps, SpaceProps} from "styled-system";
import StyledNavLink from "./NavLinkStyle";

export interface NavLinkProps extends SpaceProps, ColorProps {
  href: string;
  style?: CSSProperties;
  className?: string;
}

const NavLink: React.FC<
    NavLinkProps & AnchorHTMLAttributes<HTMLAnchorElement>
> = ({href, children, style, className, ...props}) => {
  const pathname = window.location.pathname;
  const checkRouteMatch = () => {
    if (href === "/") return pathname === href;
    return pathname.includes(href);
  };

  return (
      <a href={href}>
        <StyledNavLink
            className={className}
            href={href}
            isCurrentRoute={checkRouteMatch()}
            style={style}
            {...props}
        >
          {children}
        </StyledNavLink>
      </a>
  );
};

export default NavLink;
