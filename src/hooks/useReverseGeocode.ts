import { useEffect, useState } from "react";
import { reverseGeocode } from "../services/mapboxService";

export function useReverseGeocode(lat: number, lng: number) {
  const [address, setAddress] = useState<string>("");
  useEffect(() => {
    let ignore = false;
    if (isNaN(lat) || isNaN(lng)) return setAddress("");
    reverseGeocode(lat, lng).then((addr) => {
      if (!ignore) setAddress(addr);
    });
    return () => { ignore = true; };
  }, [lat, lng]);
  return address;
}
