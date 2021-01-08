import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Container } from "../components/common/Container";
import Layout from "../components/common/Layout";
import getFileExtension from "../utils/getFileExtension";
import theme from "../utils/theme";

const StyledCodeSecurityAudit = styled.div`
  min-height: 50vh;
  @media (min-width: ${theme.screens.tablet}) {
  }
  @media (min-width: ${theme.screens.laptop}) {
  }
`;

function CodeSecurityAudit() {
  const [auditData, setAuditData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(
        "https://api.github.com/repos/RavencoinFoundation/ravencoinfoundation.github.io/contents/CodeSecurityAudit"
      );
      const responseData = await response.json();
      setIsLoading(false);
      const cleanAuditData = responseData.filter(
        (file) => getFileExtension(file.name) === "pdf"
      );
      setAuditData(cleanAuditData);
    }
    fetchData();
  }, []);

  return (
    <Layout>
      <StyledCodeSecurityAudit>
        <Container>
          <h2>Code Security Audit</h2>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <ul>
              {auditData.map((file) => (
                <li key={file.sha}>
                  <a href={file.download_url}>{file.name}</a>
                </li>
              ))}
            </ul>
          )}
        </Container>
      </StyledCodeSecurityAudit>
    </Layout>
  );
}

export default CodeSecurityAudit;
