import React from "react";
import styled from "styled-components";
import { Container } from "../components/common/Container";
import Layout from "../components/common/Layout";
import theme from "../utils/theme";

const StyledCommunity = styled.div`
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
      <StyledCommunity>
        <Container>
          <h2>
            Privacy Policy
          </h2>
            <p>
            Ravencoin Foundation does not collect personally identifiable information except for an opt-in newsletter about Ravencoin which collects name and e-mail address.  Cookies may be used for session info only.</p>
            <p>
            </p>
            Neither the Ravencoin core wallet nor the mobile wallets (iOS/Android) collect personal information.   From time to time, app diagnostics may be sent to a cloud provider to help guide development and improve user experience.  The wallet software obtains a price feed from an API which would allow the IP address to be stored in server logs.  Wallets may obtain balance and UTXO information via API calls to publicly available explorers.
            <p>
            <strong>WARNING:</strong> Because the Ravencoin Foundation does not store passwords or account e-mail information, it is unable to recover your private keys in the event you lose them.  Be sure to back up your wallet&apos;s private key and store it safely and securely.  This is ordinarily 12 or 24 words you will write down.  The private key seed is your ability to transfer funds on the Ravencoin blockchain, and loss of these words may result in the loss of your funds.
            </p>

        </Container>
      </StyledCommunity>
    </Layout>
  );
}

export default Community;
