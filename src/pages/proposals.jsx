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
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <ul>
              {minutesData.map((file) => (
                <li key={file.sha}>
                  var fnameparts = var response = file.name.split(".");
                  <a href="https://gateway.ravencoinipfs.com/ipfs/${fnameparts[1]}">{fnameparts[0]}</a>
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
