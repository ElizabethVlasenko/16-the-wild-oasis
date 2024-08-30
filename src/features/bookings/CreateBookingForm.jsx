import { useForm } from "react-hook-form";
import { DayPicker } from "react-day-picker";
import { useState } from "react";
import styled from "styled-components";
import { compareAsc, differenceInCalendarDays } from "date-fns";

import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import Textarea from "../../ui/Textarea";
import FormRow from "../../ui/FormRow";
import Checkbox from "../../ui/Checkbox";
import Spinner from "../../ui/Spinner";
import { useGuests } from "../guests/useGuests";
import { useSettings } from "../settings/useSettings";
import { useCabins } from "../cabins/useCabins";
import { useBookings } from "../bookings/useBookings";
import { formatCurrency } from "../../utils/helpers";
import { useCreateBooking } from "./useCreateBooking";

const Select = styled.select`
  font-size: 1.4rem;
  padding: 0.8rem 1.2rem;
  border: 1px solid
    ${(props) =>
      props.type === "white"
        ? "var(--color-grey-100)"
        : "var(--color-grey-300)"};
  border-radius: var(--border-radius-sm);
  background-color: var(--color-grey-0);
  font-weight: 500;
  box-shadow: var(--shadow-sm);
`;

function CreateBookingForm() {
  const { register, handleSubmit, reset, getValues, formState } = useForm({
    defaultValues: {},
  });
  const { isLoading: isLoadingBookings, bookings } = useBookings();
  const { isLoading: isLoadingCabins, cabins } = useCabins();
  const { isLoading: isLoadingSettings, settings } = useSettings();
  const { isLoading: isLoadingGuests, guests } = useGuests();
  const { errors } = formState;
  const [sortString, setSortString] = useState("");
  const [selectedCabin, setSelectedCabin] = useState();
  const [selectedBookingDates, setSelectedBookingDates] = useState();

  const { createBooking, isCreating } = useCreateBooking();

  if (
    isLoadingCabins ||
    isLoadingSettings ||
    isLoadingGuests ||
    isLoadingBookings
  )
    return <Spinner />;

  const sortedGuests = guests?.filter((guest) =>
    guest.email.includes(sortString)
  );

  const selectedCabinBookings = bookings.filter(
    (booking) => booking.cabins.id === +selectedCabin
  );
  const disabledDates = selectedCabinBookings?.map((booking) => ({
    after: booking.startDate,
    before: booking.endDate,
  }));

  function onSubmit(data) {
    const {
      hasBreakfast,
      cabinID,
      observations,
      guestID,
      checkInTime,
      checkOutTime,
      numGuests,
    } = data;

    console.log(selectedBookingDates);
    if (!selectedBookingDates) return;
    console.log("received data", data);
    console.log("selected cabin", selectedCabin);
    console.log("cabins", cabins);

    const cabinPrice = cabins.find(
      (cabin) => cabin.id === +cabinID
    ).regularPrice;

    const numNights = differenceInCalendarDays(
      selectedBookingDates.to,
      selectedBookingDates.from
    );

    const extrasPrice = hasBreakfast
      ? settings.breakfastPrice * +numGuests * numNights
      : 0;

    const newBooking = {
      startDate: selectedBookingDates.from,
      endDate: selectedBookingDates.to,
      numNights,
      numGuests: Number(numGuests),
      totalPrice: cabinPrice * numNights,
      status: "unconfirmed",
      hasBreakfast,
      isPaid: false,
      observations,
      cabinID: Number(cabinID),
      guestID: Number(guestID),
      cabinPrice,
      extrasPrice,
      checkInTime,
      checkOutTime,
    };

    console.log("new booking obj", newBooking);
    createBooking(newBooking);
    // createCabin({ ...data, image: image }, { onSuccess: (data) => reset() });
  }

  function onError(errors) {
    // console.log(errors);
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit, onError)}>
      <FormRow label="Search guest by email" error={errors?.name?.message}>
        <Input
          type="text"
          id="search-email"
          value={sortString}
          onChange={(e) => setSortString(e.target.value)}
        />
      </FormRow>
      <FormRow
        label="Select the guest from the list"
        error={errors?.name?.message}
      >
        {sortedGuests?.length > 0 ? (
          <Select
            id="guestID"
            {...register("guestID", {
              required: "This field is required",
            })}
          >
            {sortedGuests.map((guest) => (
              <option value={guest.id} key={guest.id}>
                {guest.email + " - " + guest.fullName}
              </option>
            ))}
          </Select>
        ) : (
          <p>Unable to find any guest with the provided email</p>
        )}
      </FormRow>

      <FormRow label="Number of guests" error={errors?.numGuests?.message}>
        <Input
          type="text"
          id="numGuests"
          {...register("numGuests", {
            required: "This field is required",
            min: {
              value: 1,
              message: "The capacity should be at least one",
            },
            max: {
              value: settings.maxGuestsPerBooking,
              message: `The capacity should not be grater than ${settings?.maxGuestsPerBooking}`,
            },
          })}
        />
      </FormRow>

      <FormRow
        label="Select the cabin from the list"
        error={errors?.cabinID?.message}
      >
        {cabins?.length > 0 ? (
          <Select
            value={selectedCabin}
            name="cabinID"
            id="cabinID"
            {...register("cabinID", {
              required: "This field is required",
              onChange: (e) => setSelectedCabin(e.target.value),
            })}
          >
            {cabins.map((cabin) => (
              <option
                value={cabin.id}
                key={cabin.id}
                disabled={getValues()?.numGuests > cabin.maxCapacity}
              >
                {`Cabin ${cabin.name} for ${
                  cabin.maxCapacity
                } - ${formatCurrency(cabin.regularPrice)} per night`}
              </option>
            ))}
          </Select>
        ) : (
          <p>Unable to find any cabin</p>
        )}
      </FormRow>

      <FormRow label="Select booking days" error={errors?.name?.message}>
        <DayPicker
          mode="range"
          id="date"
          showOutsideDays
          excludeDisabled
          disabled={[{ before: new Date() }, ...disabledDates]}
          min={settings?.minBookingLength}
          max={settings?.maxBookingLength}
          selected={selectedBookingDates}
          onSelect={setSelectedBookingDates}
          weekStartsOn={1}
          numberOfMonths={3}
          firstWeekContainsDate={0}
        />
      </FormRow>

      <FormRow label="Check in time" error={errors?.checkInTime?.message}>
        <Input
          type="time"
          id="checkInTime"
          defaultValue={settings.minCheckInTime}
          {...register("checkInTime", {
            required: "This field is required",
            validate: (value) => {
              if (
                compareAsc(
                  new Date(`1/1/1999 ${value}`),
                  new Date(`1/1/1999 ${settings.minCheckInTime}`)
                ) === -1
              )
                return `The check in time shouldn't be earlier than ${settings.minCheckInTime.slice(
                  0,
                  -3
                )}`;
            },
          })}
        />
      </FormRow>

      <FormRow label="Check out time" error={errors?.checkOutTime?.message}>
        <Input
          type="time"
          id="checkOutTime"
          defaultValue={settings.maxCheckOutTime}
          {...register("checkOutTime", {
            required: "This field is required",
            validate: (value) => {
              if (
                compareAsc(
                  new Date(`1/1/1999 ${value}`),
                  new Date(`1/1/1999 ${settings.maxCheckOutTime}`)
                ) === 1
              )
                return `The check out time shouldn't be later than ${settings.maxCheckOutTime.slice(
                  0,
                  -3
                )}`;
            },
          })}
        />
      </FormRow>

      <FormRow label="Include breakfast" error={errors?.checkOutTime?.message}>
        <input type="checkbox" {...register("hasBreakfast")} />
      </FormRow>

      <FormRow label="Observations">
        <Textarea
          id="observations"
          defaultValue=""
          {...register("observations")}
        />
      </FormRow>
      <FormRow>
        <Button disabled={isCreating}>Create booking</Button>
      </FormRow>
    </Form>
  );
}

export default CreateBookingForm;
