import React from "react";
import styled from "styled-components";
import Layout from "../components/common/Layout";
import theme from "../utils/theme";


const StyledProposals = styled.div`
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


function Proposals() {
  return (
    <Layout>
      <p>If you work on these, please email tron@ravencoin.foundation so the status can be changed to <strong>in-progress</strong> so we can avoid race-conditions and wasted efforts if two developers tackle the same code.</p>
      <StyledProposals>
          <iframe src='https://docs.google.com/spreadsheets/d/1f1RTweLM8DbsmzUKVU_gub7ifvRIefy_M6pZqOaqcas/edit?usp=sharing' width='100%' height='700'></iframe>
      </StyledProposals>
    </Layout>
  );
}


export default Proposals;
