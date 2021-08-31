import React from "react";
import styled from "styled-components";
import { Container } from "../components/common/Container";
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
      <StyledProposals>
        <Container>
          <h2>
            Stablecoin Proposals (require community support and funding)
          </h2>

            <p>
            There are two stablecoin proposals.  They are different and both would be valuable to have in the Ravencoin ecosystem.
            </p>

            <p>
            <h3>OpenDAO - USDO</h3>
            <p>This proposal is ready to go.  It requires $25,000 worth of RVN for the OpenDAO project to incentivize people to use pRVN as collateral to back USDO which uses an algorithmically stablized smart contract on the Binance Smart Chain.  This will create a USDO token backed by pRVN.</p>
            <p>This project will allow borrowing a USDO stablecoin from your RVN.</p>
            <p>Required: $25,000 in RVN.</p>
            <p>Details: OpenDAO Proposal (soon)</p>
            <p>RVN Contribution Address: RJzkp2xcXkEQYXYfZzdBTrvCNxy2GKqjLn</p>
            </p>

            <br></br>
            <p>
            <h3>Stably - USDS</h3>
            <p>This proposal requires development from Stably to interact with Ravencoin.  The intermediate code will be released as open-source code.  This USDS token will be minted on the Ravencoin blockchain and will be backed 1:1 with USD in Prime Trust.</p>
            <p>This project put a stablecoin directly on the Ravencoin blockchain which can be used in on-chain atomic swaps.</p>
            <p>Required: $125,000.</p>
            <p>Details - <a href='/Stably_RavenCoin_Proposal_v2.pdf'>Stably Proposal as PDF</a></p>
            <p>RVN Contribution Address: RBzm8wmbEcdFxAWAZ2stkxSN615uDgvqCd</p>
            </p>
 
        </Container>
      </StyledProposals>
    </Layout>
  );
}



export default Proposals;
