import { HiOutlineBriefcase, HiOutlineChartBar } from "react-icons/hi";
import { HiOutlineBanknotes, HiOutlineCalendarDays } from "react-icons/hi2";

import { formatCurrency } from "../../utils/helpers";
import Stat from "./Stat";

function Stats({ bookings, confirmedStays, numDays, cabinCount }) {
  //number of bookings
  const numBookings = bookings.length;

  //total sales
  const sales = bookings.reduce((acc, curr) => acc + curr.totalPrice, 0);

  //total check ins
  const checkins = confirmedStays.length;

  //Occupancy rate (num of checked in nights / all available nights(num of days * num of cabins))
  const occupation =
    (confirmedStays.reduce((acc, curr) => acc + curr.numNights, 0) /
      (numDays * cabinCount)) *
    100;
  return (
    <>
      <Stat
        title="Bookings"
        color="blue"
        icon={<HiOutlineBriefcase />}
        value={numBookings}
      />
      <Stat
        title="Sales"
        color="green"
        icon={<HiOutlineBanknotes />}
        value={formatCurrency(sales)}
      />
      <Stat
        title="Check ins"
        color="indigo"
        icon={<HiOutlineCalendarDays />}
        value={checkins}
      />
      <Stat
        title="Occupancy rate"
        color="yellow"
        icon={<HiOutlineChartBar />}
        value={Math.round(occupation) + "%"}
      />
    </>
  );
}

export default Stats;
