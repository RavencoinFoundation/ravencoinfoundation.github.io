import React from "react";
import styled from "styled-components";
import { Container } from "../components/common/Container";
import meetupimg from "../images/meetup2021.png";
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
            Ravencoin Meetup 2021
          </h2>

            <p>
            I don&apos;t know <strong>WHY</strong> Ravencoin attracts the best people in the world.  I only know that it <strong>DOES</strong>.
            </p>

            <p>
            It&apos;s time to get together to discuss, collaborate, and celebrate Ravencoin.
            </p>

            <p>
            <strong>Where:</strong> Aboard the Carnival Horizon
            <strong>When:</strong> Nov 13, 2021 - Nov 21, 2021
            <strong>Who:</strong> The Ravencoin community.  That is you.
            <a href='https://www.carnival.com/booking/review?currency=USD&durDays=8&embkCode=MIA&isMilitary=N&isOver55=N&isPastGuest=N&itinCode=SCW&locality=1&numGuests=2&qbMetaCode=IS&qbPrice=654&qbRateCode=PSV&sailDate=11132021&sailingID=91434&shipCode=HZ&subRegionCode=CS&country=US'>Book Now</a>
            </p>    

            <p>
            These massive cruise ships have <a href='https://www.carnival.com/internet-plans'>internet available</a> and are perfect for remote work, or just relax and join the on-board activities.  If our event is large enough, we can get <a href='https://www.carnivalmeetings.com/plan/corporate-events/'>additional support</a> from the cruise line.
            </p>

            
            <p>
            <a href='https://www.carnival.com/booking/review?currency=USD&durDays=8&embkCode=MIA&isMilitary=N&isOver55=N&isPastGuest=N&itinCode=SCW&locality=1&numGuests=2&qbMetaCode=IS&qbPrice=654&qbRateCode=PSV&sailDate=11132021&sailingID=91434&shipCode=HZ&subRegionCode=CS&country=US'><img src={meetupimg}></img></a>
            </p>                    

        </Container>
      </StyledMeetup>
    </Layout>
  );
}

export default Meetup;
