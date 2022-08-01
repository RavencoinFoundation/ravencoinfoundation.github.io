import React from "react";
import styled from "styled-components";
import Layout from "../components/common/Layout";
import theme from "../utils/theme";

const StyledProposalDesc = styled.div`
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

function ProposalDesc() {
  return (
    <Layout>
      <StyledProposalDesc>
          <iframe src='https://docs.google.com/document/d/1mMCQToxEaN4luX_CbShwte2owpDU9MQHF-AC4mu8Kxc' width='100%' height='700'></iframe>
      </StyledProposalDesc>
    </Layout>
  );
}

export default ProposalDesc;
