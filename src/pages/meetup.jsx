import React from "react";
import styled from "styled-components";
import { Container } from "../components/common/Container";
import meetupimg from "../images/RavencoinMeetupAtSea2023.png";
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
            Ravencoin Meetup 2023
          </h2>

            <p>
            I don&apos;t know <strong>WHY</strong> Ravencoin attracts the best people in the world.  I only know that it <strong>DOES</strong>.
            </p>

            <p>
            It&apos;s time to get together to discuss, collaborate, and celebrate Ravencoin.
            </p>

            <p>
            <strong>Where:</strong> Aboard the <a href='https://www.royalcaribbean.com/cruise-ships/oasis-of-the-seas'>Royal Caribbean Oasis of the Seas</a><br />
            <strong>When:</strong> Nov 12, 2023 - Nov 19, 2023<br />
            <strong>Who:</strong> The Ravencoin community.  That is you.<br />
            <strong>How:</strong> Book directly with <a href='https://www.royalcaribbean.com/booking/stateroom?country=USA&destinationCode=CARIB&groupId=OA07MIA-2746578895&packageCode=OA07W528&sailDate=2023-11-12&selectedCurrencyCode=USD&shipCode=OA'>Royal Caribbean</a>.  Optional: Check the discount price through <a href='https://www.vacationstogo.com/fastdeal.cfm?deal=24057'>Vacations To Go</a>.<br />
            </p>    

            <p>
            These massive cruise ships have <a href='https://www.royalcaribbean.com/booked/cruise-ship-wifi'>internet available</a> and are perfect for remote work, or just relax and join the on-board activities.  This is aboard an <a href='https://www.royalcaribbean.com/cruise-ships/largest-ships-oasis-class'>Oasis Class Ship</a> and is one of the largest cruise ships. If our event is large enough, we can get additional support from the cruise line. 
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
