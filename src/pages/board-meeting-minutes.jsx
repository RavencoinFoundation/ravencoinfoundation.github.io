import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Container } from "../components/common/Container";
import Layout from "../components/common/Layout";
import getFileExtension from "../utils/getFileExtension";
import theme from "../utils/theme";

const StyledBoardMeetingMinutes = styled.div`
  min-height: 50vh;
  @media (min-width: ${theme.screens.tablet}) {
  }
  @media (min-width: ${theme.screens.laptop}) {
  }
`;

function BoardMeetingMinutes() {
  const [minutesData, setMinutesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(
        "https://api.github.com/repos/RavencoinFoundation/ravencoinfoundation.github.io/contents/BoardMeetingMinutes"
      );
      const responseData = await response.json();
      setIsLoading(false);

      const cleanedMinutesData = responseData.filter(
        (file) => getFileExtension(file.name) === "pdf"
      );

      setMinutesData(cleanedMinutesData);
    }

    fetchData();
  }, []);

  return (
    <Layout>
      <StyledBoardMeetingMinutes>
        <Container>
          <h2>Board Meeting Minutes</h2>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <ul>
              {minutesData.map((file) => (
                <li key={file.sha}>
                  <a href={file.download_url}>{file.name}</a>
                </li>
              ))}
            </ul>
          )}
        </Container>
      </StyledBoardMeetingMinutes>
    </Layout>
  );
}

export default BoardMeetingMinutes;
