import React from "react";
import styled from "styled-components";
import { Container } from "../components/common/Container";
import Layout from "../components/common/Layout";
import theme from "../utils/theme";

const StyledNotFoundPage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  min-height: 50vh;
  font-size: 3vh;
  @media (min-width: ${theme.screens.tablet}) {
  }
  @media (min-width: ${theme.screens.laptop}) {
    .not-found {
      font-size: 4vh;
    }
  }
`;

function NotFoundPage() {
  return (
    <Layout>
      <StyledNotFoundPage>
        <Container>
          <h2 className="not-found">
            The Page You Were Looking For Does Not Exist.
          </h2>
        </Container>
      </StyledNotFoundPage>
    </Layout>
  );
}

export default NotFoundPage;
