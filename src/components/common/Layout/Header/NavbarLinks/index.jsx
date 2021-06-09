import React from "react";
import PropTypes from "prop-types";
import { Link } from "gatsby";
import { Wrapper } from "./styles";

const NavbarLinks = ({ desktop }) => {
  return (
    <Wrapper desktop={desktop}>
      <Link to="/">Home</Link>
      <Link to="/downloads">Downloads</Link>
      <Link to="/community">Community</Link>
      <Link to="/whitepaper">Whitepaper</Link>
      <Link to="/getupdates">Updates</Link>
      <Link to="/meetup">Meetup 2021</Link>
    </Wrapper>
  );
};

NavbarLinks.propTypes = {
  desktop: PropTypes.bool,
};

export default NavbarLinks;
