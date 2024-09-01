import { useForm } from "react-hook-form";
import { DayPicker } from "react-day-picker";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { addDays, compareAsc, differenceInCalendarDays } from "date-fns";

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
  const [selectedCabin, setSelectedCabin] = useState("select");
  const [selectedBookingDates, setSelectedBookingDates] = useState();
  const [inputNumGests, setInputNumGests] = useState(1);
  const [hasBreakfast, setHasBreakfast] = useState(false);

  const { createBooking, isCreating } = useCreateBooking();

  const numNights =
    selectedBookingDates &&
    differenceInCalendarDays(
      selectedBookingDates.to,
      selectedBookingDates.from
    );

  const extrasPrice = hasBreakfast
    ? settings.breakfastPrice * +getValues().numGuests * numNights
    : 0;

  const totalPrice =
    selectedCabin !== "select"
      ? JSON.parse(selectedCabin).regularPrice * numNights + extrasPrice
      : null;
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

  const selectedCabinBookings =
    selectedCabin !== "select"
      ? bookings.filter(
          (booking) => booking.cabins.id === JSON.parse(selectedCabin).id
        )
      : [];

  const disabledDates = selectedCabinBookings?.map((booking) => ({
    after: addDays(booking.startDate, 1),
    before: addDays(booking.endDate, 1),
  }));

  function onSubmit(data) {
    const {
      hasBreakfast,
      cabinInfo,
      observations,
      guestID,
      checkInTime,
      checkOutTime,
      numGuests,
    } = data;

    const { id: cabinID, regularPrice } = JSON.parse(cabinInfo);

    if (!selectedBookingDates || selectedCabin == "select") return;
    console.log("received data", data);
    console.log("selected cabin", selectedCabin);
    console.log("cabinInfo", cabinID, regularPrice);

    // const numNights = differenceInCalendarDays(
    //   selectedBookingDates.to,
    //   selectedBookingDates.from
    // );

    // const extrasPrice = hasBreakfast
    //   ? settings.breakfastPrice * +numGuests * numNights
    //   : 0;

    // const totalPrice = regularPrice * numNights;

    const newBooking = {
      startDate: selectedBookingDates.from,
      endDate: selectedBookingDates.to,
      numNights,
      numGuests: Number(numGuests),
      totalPrice,
      status: "unconfirmed",
      hasBreakfast,
      isPaid: false,
      observations,
      cabinID: Number(cabinID),
      guestID: Number(guestID),
      cabinPrice: regularPrice,
      extrasPrice,
      checkInTime,
      checkOutTime,
    };

    console.log("new booking obj", newBooking);
    createBooking(newBooking);
    reset();
    // createCabin({ ...data, image: image }, { onSuccess: (data) => reset() });
  }

  function onError(errors) {
    // console.log(errors);
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit, onError)}>
      <FormRow label="Search guest by email">
        <Input
          type="text"
          id="search-email"
          value={sortString}
          onChange={(e) => setSortString(e.target.value)}
        />
      </FormRow>

      <FormRow
        label="Select the guest from the list"
        error={errors?.guestID?.message}
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
          value={inputNumGests}
          {...register("numGuests", {
            onChange: (e) => setInputNumGests(e.target.value),
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
        error={errors?.cabinInfo?.message}
      >
        {cabins?.length > 0 ? (
          <Select
            value={selectedCabin}
            name="cabinInfo"
            id="cabinInfo"
            {...register("cabinInfo", {
              required: "This field is required",
              onChange: (e) => setSelectedCabin(e.target.value),
              validate: (value) => {
                if (selectedCabin === "select") return "This field is required";
                if (JSON.parse(value).maxCapacity < inputNumGests)
                  return `This cabin can't fit more than ${
                    JSON.parse(value).maxCapacity
                  } guests`;
              },
            })}
          >
            <option disabled value="select">
              -- select an option --
            </option>
            {cabins.map((cabin) => (
              <option
                value={JSON.stringify({
                  id: cabin.id,
                  regularPrice: cabin.regularPrice,
                  maxCapacity: cabin.maxCapacity,
                })}
                key={cabin.id}
                disabled={inputNumGests > cabin.maxCapacity}
              >
                {`Cabin ${cabin.name} for ${
                  cabin.maxCapacity
                } - ${formatCurrency(cabin.regularPrice)} per night`}
              </option>
            ))}
          </Select>
        ) : (
          <p>Unable to find any cabins</p>
        )}
      </FormRow>

      <FormRow label="Select booking days">
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

      <FormRow label="Include breakfast">
        <input
          type="checkbox"
          {...register("hasBreakfast", {
            onChange: (e) => {
              setHasBreakfast((breakfast) => (breakfast = !breakfast));
            },
          })}
          value={hasBreakfast}
        />
      </FormRow>

      <FormRow label="Observations">
        <Textarea
          id="observations"
          defaultValue=""
          {...register("observations")}
        />
      </FormRow>
      <FormRow>
        <p>
          {totalPrice
            ? `Total price: ${formatCurrency(totalPrice)} ${
                hasBreakfast
                  ? `including ${formatCurrency(
                      extrasPrice
                    )} for breakfast for ${numNights} days for ${inputNumGests} guest${
                      inputNumGests > 1 ? "s" : ""
                    }`
                  : ""
              } `
            : "Continue entering details about the booking..."}
        </p>
        <Button disabled={isCreating}>Create booking</Button>
      </FormRow>
    </Form>
  );
}

export default CreateBookingForm;
