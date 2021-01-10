import React from "react";
import PropTypes from "prop-types";
import NavbarLinks from "../NavbarLinks";
import { Wrapper } from "./styles";

const Sidebar = ({ sidebar }) => {
  return (
    <Wrapper active={sidebar}>
      <NavbarLinks />
    </Wrapper>
  );
};

Sidebar.propTypes = {
  sidebar: PropTypes.bool.isRequired,
};

export default Sidebar;
