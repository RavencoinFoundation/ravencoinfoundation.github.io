import React from "react";
import styled from "styled-components";
import { Container } from "../components/common/Container";
import meetupimg from "../images/RavencoinMeetupAtSea2024.png";
import Layout from "../components/common/Layout";
import theme from "../utils/theme";

const StyledMeetup = styled.div`
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

function Meetup() {
  return (
    <Layout>
      <StyledMeetup>
        <Container>
          <h2>
            Ravencoin Meetup 2024
          </h2>

            <p>
            I don&apos;t know <strong>WHY</strong> Ravencoin attracts the best people in the world.  I only know that it <strong>DOES</strong>.
            </p>

            <p>
            It&apos;s time to get together to discuss, collaborate, and celebrate Ravencoin.
            </p>

            <p>
            <strong>Where:</strong> Aboard the <a href='https://www.royalcaribbean.com/icon-of-the-seas'>Royal Caribbean Icon of the Seas</a><br />
            <strong>When:</strong> Nov 9, 2024 - Nov 16, 2024<br />
            <strong>Who:</strong> The Ravencoin community.  That is you.<br />
            <strong>How:</strong> Book directly with <a href='https://www.royalcaribbean.com/booking/landing?groupId=IC07MIA-1694717396&sailDate=2024-11-09&shipCode=IC&packageCode=IC07W565&destinationCode=CARIB&selectedCurrencyCode=USD&country=USA'>Royal Caribbean</a>.  Optional: Check the discount price through <a href='https://www.vacationstogo.com/fastdeal.cfm?deal=27901'>Vacations To Go</a>.<br />
            </p>    

            <p>
            These massive cruise ships have <a href='https://www.royalcaribbean.com/booked/cruise-ship-wifi'>internet available</a> and are perfect for remote work, or just relax and join the on-board activities.  This is aboard the newest and largest cruise ship on the ocean. It may even be the second largest ship of any type on any ocean. 
            </p>

            
            <p>
            <img src={meetupimg}></img>
            </p>



        </Container>
      </StyledMeetup>
    </Layout>
  );
}

export default Meetup;
