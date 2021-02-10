import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Container } from "../components/common/Container";
import Layout from "../components/common/Layout";
import getFileExtension from "../utils/getFileExtension";
import theme from "../utils/theme";

const StyledProposals = styled.div`
  min-height: 50vh;
  @media (min-width: ${theme.screens.tablet}) {
  }
  @media (min-width: ${theme.screens.laptop}) {
  }
`;

function Proposals() {
  const [minutesData, setMinutesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const ipfsURL = "https://gateway.ravencoinipfs.com/ipfs/";

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(
        "https://api.github.com/repos/RavencoinFoundation/ravencoinfoundation.github.io/contents/Proposals"
      );
      const responseData = await response.json();
      setIsLoading(false);

      const cleanedMinutesData = responseData.filter(
        (file) => getFileExtension(file.name) === "txt"
      );

      setMinutesData(cleanedMinutesData);
    }

    fetchData();
  }, []);

  return (
    <Layout>
      <StyledProposals>
        <Container>
          <h2>Proposals</h2>
          <p>
          If you&apos;re interested in taking on a proposal, e-mail <a href='mailto:contact@ravencoin.foundation'>contact@ravencoin.foundation</a> so it can be coordinated and we can avoid race conditions for the bounty.
          </p>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <ul>
              {minutesData.map((file) => (
                <li key={file.sha}>
                  <a href={ipfsURL + file.name.split('.')[1]}>{file.name.split('.')[0]}</a>
                </li>
              ))}
            </ul>
          )}
        </Container>
      </StyledProposals>
    </Layout>
  );
}

export default Proposals;
