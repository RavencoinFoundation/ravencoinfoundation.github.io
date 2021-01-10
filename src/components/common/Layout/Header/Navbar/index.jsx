import React from "react";
import { Link } from "gatsby";
import { Container } from "../../../Container";
import NavbarLinks from "../NavbarLinks";
import { Wrapper } from "./styles";
import ravencoin from "../../../../../images/ravencoin.png";
import styled from "styled-components";

const LocalContainer = styled(Container)`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Navbar = () => {
  return (
    <Wrapper>
      <LocalContainer>
        <Link to="/">
          <img src={ravencoin} alt="Ravencoin spelled" />
        </Link>
        <NavbarLinks desktop />
      </LocalContainer>
    </Wrapper>
  );
};

export default Navbar;
