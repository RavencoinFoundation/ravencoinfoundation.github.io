import React from "react";
import styled from "styled-components";
import Layout from "../components/common/Layout";
import theme from "../utils/theme";

const StyledGetUpdates = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: left;
  min-height: 50vh;
  font-size: 3vh;
  @media (min-width: ${theme.screens.tablet}) {
  }
  @media (min-width: ${theme.screens.laptop}) {
    .under-construction {
      font-size: 4vh;
    }
  }
`;

function Community() {
  return (
    <Layout>
      <StyledGetUpdates>
          <iframe height="400" width="100%" src="https://cdn.forms-content.sg-form.com/8ec7a872-d599-11e9-ada2-7a44cc589a29"></iframe>
      </StyledGetUpdates>
    </Layout>
  );
}

export default Community;
