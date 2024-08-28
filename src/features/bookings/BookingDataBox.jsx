import styled from "styled-components";
import { compareAsc, format, isToday } from "date-fns";
import {
  HiOutlineChatBubbleBottomCenterText,
  HiOutlineCheckCircle,
  HiOutlineCurrencyDollar,
  HiOutlineHomeModern,
} from "react-icons/hi2";

import DataItem from "../../ui/DataItem";
import Flag from "../../ui/Flag";
import Input from "../../ui/Input";
import Button from "../../ui/Button";

import { formatDistanceFromNow, formatCurrency } from "../../utils/helpers";
import { useUpdateBookingTime } from "./useUpdateBookingTime";
import Spinner from "../../ui/Spinner";
import { useSettings } from "../settings/useSettings";
import toast from "react-hot-toast";

const StyledBookingDataBox = styled.section`
  /* Box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);

  overflow: hidden;
`;

const Header = styled.header`
  background-color: var(--color-brand-500);
  padding: 2rem 4rem;
  color: #e0e7ff;
  font-size: 1.8rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: space-between;

  svg {
    height: 3.2rem;
    width: 3.2rem;
  }

  & div:first-child {
    display: flex;
    align-items: center;
    gap: 1.6rem;
    font-weight: 600;
    font-size: 1.8rem;
  }

  & span {
    font-family: "Sono";
    font-size: 2rem;
    margin-left: 4px;
  }
`;

const CheckInOutSection = styled.form`
  background: var(--color-grey-200);
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 1.2rem 4rem 1.2rem;
  & button {
    margin-left: auto;
  }
`;

const Section = styled.section`
  padding: 3.2rem 4rem 1.2rem;
`;

const Guest = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  margin-bottom: 1.6rem;
  color: var(--color-grey-500);

  & p:first-of-type {
    font-weight: 500;
    color: var(--color-grey-700);
  }
`;

const Price = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.6rem 3.2rem;
  border-radius: var(--border-radius-sm);
  margin-top: 2.4rem;

  background-color: ${(props) =>
    props.$isPaid ? "var(--color-green-100)" : "var(--color-yellow-100)"};
  color: ${(props) =>
    props.$isPaid ? "var(--color-green-700)" : "var(--color-yellow-700)"};

  & p:last-child {
    text-transform: uppercase;
    font-size: 1.4rem;
    font-weight: 600;
  }

  svg {
    height: 2.4rem;
    width: 2.4rem;
    color: currentColor !important;
  }
`;

const Footer = styled.footer`
  padding: 1.6rem 4rem;
  font-size: 1.2rem;
  color: var(--color-grey-500);
  text-align: right;
`;

// A purely presentational component
function BookingDataBox({ booking, settings }) {
  const { isUpdating, updateBookingTime } = useUpdateBookingTime();
  const { maxCheckOutTime, minCheckInTime } = settings;

  const {
    id: bookingId,
    created_at,
    startDate,
    endDate,
    numNights,
    numGuests,
    cabinPrice,
    extrasPrice,
    totalPrice,
    hasBreakfast,
    checkInTime,
    checkOutTime,
    observations,
    status,
    isPaid,
    guests: { fullName: guestName, email, country, countryFlag, nationalID },
    cabins: { name: cabinName },
  } = booking;

  function handleUpdate(e, field) {
    const { value } = e.target;
    if (!value) return;
    //Compare the two dates and return 1 if the first date is after the second, -1 if the first date is before the second or 0 if dates are equal.

    if (
      field === "checkInTime" &&
      compareAsc(
        new Date(`1/1/1999 ${value}`),
        new Date(`1/1/1999 ${minCheckInTime}`)
      ) === -1
    ) {
      toast.error(
        `The check in time can't be earlier than ${minCheckInTime} - check in time that was set in settings.`
      );
      document.getElementById("checkInTime").value = minCheckInTime;
      return;
    }

    if (
      field === "checkOutTime" &&
      compareAsc(
        new Date(`1/1/1999 ${value}`),
        new Date(`1/1/1999 ${maxCheckOutTime}`)
      ) === 1
    ) {
      toast.error(
        `The check in time can't be later than ${maxCheckOutTime} - check out time that was set in settings.`
      );
      document.getElementById("checkOutTime").value = maxCheckOutTime;
      return;
    }

    updateBookingTime({ bookingId, updatedCell: { [field]: value } });
  }

  function handleResetToDefaultTime() {
    if (status === "checked-in") {
      document.getElementById("checkOutTime").value = maxCheckOutTime;
    }
    if (status === "unconfirmed") {
      document.getElementById("checkOutTime").value = maxCheckOutTime;
      document.getElementById("checkInTime").value = minCheckInTime;
    }
  }

  return (
    <StyledBookingDataBox>
      <Header>
        <div>
          <HiOutlineHomeModern />
          <p>
            {numNights} nights in Cabin <span>{cabinName}</span>
          </p>
        </div>

        <p>
          {format(new Date(startDate), "EEE, MMM dd yyyy")} (
          {isToday(new Date(startDate))
            ? "Today"
            : formatDistanceFromNow(startDate)}
          ) &mdash; {format(new Date(endDate), "EEE, MMM dd yyyy")}
        </p>
      </Header>

      <CheckInOutSection onSubmit={(e) => e.preventDefault()}>
        <p>Planned check in:</p>
        <Input
          disabled={!(status === "unconfirmed")}
          type="time"
          id="checkInTime"
          defaultValue={checkInTime}
          onBlur={(e) => handleUpdate(e, "checkInTime")}
        />

        <p>Planned check out:</p>
        <Input
          disabled={status === "checked-out"}
          type="time"
          id="checkOutTime"
          defaultValue={checkOutTime}
          onBlur={(e) => handleUpdate(e, "checkOutTime")}
        />

        {(status === "unconfirmed" || status === "checked-in") && (
          <Button onClick={handleResetToDefaultTime}>Reset to default</Button>
        )}
      </CheckInOutSection>

      <Section>
        <Guest>
          {countryFlag && <Flag src={countryFlag} alt={`Flag of ${country}`} />}
          <p>
            {guestName} {numGuests > 1 ? `+ ${numGuests - 1} guests` : ""}
          </p>
          <span>&bull;</span>
          <p>{email}</p>
          <span>&bull;</span>
          <p>National ID {nationalID}</p>
        </Guest>

        {observations && (
          <DataItem
            icon={<HiOutlineChatBubbleBottomCenterText />}
            label="Observations"
          >
            {observations}
          </DataItem>
        )}

        <DataItem icon={<HiOutlineCheckCircle />} label="Breakfast included?">
          {hasBreakfast ? "Yes" : "No"}
        </DataItem>

        <Price $isPaid={isPaid}>
          <DataItem icon={<HiOutlineCurrencyDollar />} label={`Total price`}>
            {formatCurrency(totalPrice)}

            {hasBreakfast &&
              ` (${formatCurrency(cabinPrice)} cabin + ${formatCurrency(
                extrasPrice
              )} breakfast)`}
          </DataItem>

          <p>{isPaid ? "Paid" : "Will pay at property"}</p>
        </Price>
      </Section>

      <Footer>
        <p>Booked {format(new Date(created_at), "EEE, MMM dd yyyy, p")}</p>
      </Footer>
    </StyledBookingDataBox>
  );
}

export default BookingDataBox;
