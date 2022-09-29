import { useEffect, useState } from "react";
import { useGetUser } from "./useGetUser";

export function useDistance() {
  const user = useGetUser();
  const [isVisible, setVisible] = useState(false);
  useEffect(() => {
    if (user && user.id && user.address) {
      navigator.geolocation.getCurrentPosition((position) => {
        let la1 = (position.coords.latitude * Math.PI) / 180;
        let lo1 = (position.coords.longitude * Math.PI) / 180;
        let la2 = (user.address.location.lat * Math.PI) / 180;
        let lo2 = (user.address.location.long * Math.PI) / 180;
        var R = 6378137; // Earth’s mean radius in meter
        var dLat = rad(la2 - la1);
        var dLong = rad(lo2 - lo1);
        var a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(rad(la1)) *
            Math.cos(rad(la2)) *
            Math.sin(dLong / 2) *
            Math.sin(dLong / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        setVisible(d > 100);
      });
    }
  }, [user]);

  return isVisible;
}

var rad = function (x) {
  return (x * Math.PI) / 180;
};
