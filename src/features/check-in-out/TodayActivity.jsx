import styled from "styled-components";

import Heading from "../../ui/Heading";
import Row from "../../ui/Row";
import { useTodayActivity } from "./useTodayActivity";
import Spinner from "../../ui/Spinner";
import TodayItem from "./TodayItem";

const StyledToday = styled.div`
  /* Box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);

  padding: 3.2rem;
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
  grid-column: 1 / -1;
  padding-top: 2.4rem;

  @media (min-width: 1470px) {
    grid-column: 1 / span 2;
  }
`;

const TodayList = styled.ul`
  overflow-y: auto;
  overflow-x: hidden;

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-track {
    background-color: var(--color-blue-100);
    border-radius: var(--border-radius-sm);
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--color-blue-700);
    border-radius: var(--border-radius-sm);
    width: 1px;
  }

  /* Removing scrollbars for webkit, firefox, and ms, respectively */
  /* &::-webkit-scrollbar {
    width: 0 !important;
  }
  scrollbar-width: none;
  -ms-overflow-style: none; */
`;

const NoActivity = styled.p`
  text-align: center;
  font-size: 1.8rem;
  font-weight: 500;
  margin-top: 0.8rem;
`;

function sortFunction(a, b, field) {
  if (a[field] < b[field]) {
    return -1;
  } else if (a[field] > b[field]) {
    return 1;
  }
  // a must be equal to b
  return 0;
}

function TodayActivity() {
  const { activities, isLoading } = useTodayActivity();

  const checkInActivities = activities
    ?.filter((activity) => activity.status === "unconfirmed")
    .sort((a, b) => sortFunction(a, b, "checkInTime"));
  const checkOutActivities = activities
    ?.filter((activity) => activity.status === "checked-in")
    .sort((a, b) => sortFunction(a, b, "checkOutTime"));

  const sortedActivities = checkOutActivities?.concat(checkInActivities);

  return (
    <StyledToday>
      <Row type="horizontal">
        <Heading as="h2">Today</Heading>
      </Row>

      {!isLoading ? (
        sortedActivities.length > 0 ? (
          <TodayList>
            {sortedActivities.map((activity) => (
              <TodayItem key={activity.id} activity={activity} />
            ))}
          </TodayList>
        ) : (
          <NoActivity>No activity today</NoActivity>
        )
      ) : (
        <Spinner />
      )}
    </StyledToday>
  );
}

export default TodayActivity;
