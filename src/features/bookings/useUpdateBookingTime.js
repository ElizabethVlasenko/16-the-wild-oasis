import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBooking } from "../../services/apiBookings";
import toast from "react-hot-toast";

export function useUpdateBookingTime() {
  const queryClient = useQueryClient();

  const { isLoading: isUpdating, mutate: updateBookingTime } = useMutation({
    mutationFn: ({ bookingId, updatedCell }) =>
      updateBooking(bookingId, { ...updatedCell }),
    onSuccess: (data) => {
      toast.success("Booking time was successfully updated");

      queryClient.invalidateQueries({ queryKey: ["booking", data.id] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { isUpdating, updateBookingTime };
}
