import axios from "axios";
import useGeolocation from "hooks/useGeolocation";
import React, { useEffect, useState } from "react";

import cls from "./YandexMap.module.scss";
const OPEN_STREET_MAP_API_MAP_PATH = "https://nominatim.openstreetmap.org/";
let timer;
let myMap;
let isLoadedMap = false;

export default function YandexMap({
  height,
  location,
  setLocation,
  setMapInfo,
  setConfirm,
  setIsClear,
  isClear,
}) {
  const markerBox = <i className={cls.markerIcon} />;
  // const geoLocation = useGeolocation()
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.document &&
      window.document.createElement
    ) {
      timer = setInterval(() => {
        if (isLoadedMap) {
          clearInterval(timer);
        } else {
          initYandexMap();
        }
      }, 500);
    }
    return () => {
      myMap = null;
      isLoadedMap = false;
    };
  }, []);

  function getAddress() {
    window.ymaps.geocode([location.lat, location.long]).then(function (res) {
      var firstGeoObject = res.geoObjects.get(0);
      if (!isClear) {
        setMapInfo(firstGeoObject.properties._data.name);
        setConfirm(true);
        setIsClear(false);
      }
    });
  }

  useEffect(() => {
    if (myMap) {
      myMap.setCenter([location.lat, location.long], location.zoom);
    }
    if (window.ymaps) {
      getAddress();
    }
  }, [location, window.ymaps]);

  const initYandexMap = () => {
    if (typeof window.ymaps !== "undefined" && !myMap) {
      isLoadedMap = true;
      clearInterval(timer);
      window.ymaps.ready(() => {
        const controls = ["smallMapDefaultSet"];
        myMap = new window.ymaps.Map(
          "yaMap",
          {
            center: [location.lat, location.long],
            zoom: 15,
            controls: controls,
          },
          {
            searchControlProvider: "yandex#search",
          }
        );

        myMap.controls.remove("searchControl");
        myMap.controls.remove("fullscreenControl");

        myMap.events.add("boundschange", (event) => {
          const oldCenter = event.get("oldCenter");
          const newCenter = event.get("newCenter");

          if (
            oldCenter.length !== newCenter.length ||
            (oldCenter[0] !== newCenter[0] && oldCenter[1] !== newCenter[1])
          ) {
            setLocation((old) => ({
              ...old,
              lat: newCenter[0],
              long: newCenter[1],
              zoom: myMap.getZoom(),
            }));
          } else {
            setLocation((old) => ({
              ...old,
              lat: oldCenter[0],
              long: oldCenter[1],
              zoom: myMap.getZoom(),
            }));
          }
        });

        myMap.events.add("mousedown", function (e) {
          setIsClear(false);
        });

        myMap.events.add("actiontick", (e) => {
          setLoading(true);
        });

        myMap.events.add("actionend", (e) => {
          setLoading(false);
        });
      });
    }
  };

  return (
    <div className={cls.mapBox} style={{ height }}>
      <div id="yaMap" style={{ height }}>
        {markerBox}
      </div>
    </div>
  );
}
