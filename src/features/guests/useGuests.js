import { useQuery } from "@tanstack/react-query";
import { getGuests } from "../../services/apiGuest";

export function useGuests() {
  const {
    isLoading,
    data: guests,
    error,
  } = useQuery({
    queryKey: ["guests"],
    queryFn: getGuests,
    retry: false,
  });

  return {
    isLoading,
    guests,
    error,
  };
}
