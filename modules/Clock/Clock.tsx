"use client";
import React, { useEffect, useCallback, useState } from "react";
import styles from "./Clock.module.css";

interface GeocodingResponse {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  display_name: string;
  address: {
    house_number: string;
    road: string;
    neighbourhood: string;
    suburb: string;
    county: string;
    city: string;
    state: string;
    "ISO3166-2-lvl4": string;
    postcode: string;
    country: string;
    country_code: string;
  };
  boundingbox: string[];
}

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface GeocodingResponse {
  addressGeo?: {
    city?: string;
  };
}

const currentDateTime = new Date();

const Clock = () => {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    function getLocalCoordinates(): Promise<Coordinates> {
      return new Promise((resolve, reject) => {
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
            (position: GeolocationPosition) => {
              const latitude: number = position.coords.latitude;
              const longitude: number = position.coords.longitude;
              resolve({ latitude, longitude });
            },
            (error: GeolocationPositionError) => {
              reject(`Error getting location: ${error.message}`);
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
          );
        } else {
          reject("Geolocation is not supported by this browser.");
        }
      });
    }

    function getCityName(latitude: number, longitude: number): Promise<string> {
      const apiKey = "66bfd7d6d9df5605652766hbo34c89a";
      const url = `https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}&api_key=${apiKey}`;

      return fetch(url)
        .then((response) => response.json())
        .then((data: GeocodingResponse) => {
          if (data.address) {
            return data.address.city ?? "City not found";
          } else {
            return "Location not found";
          }
        })
        .catch((error) => {
          console.error("Error fetching city name:", error);
          return "Error fetching city name";
        });
    }

    getLocalCoordinates()
      .then((coords) => {
        setCoordinates(coords);
        return getCityName(coords.latitude, coords.longitude);
      })
      .then((cityName) => {
        setCity(cityName);
      })
      .catch((err) => {
        setError(err.toString());
      });
  }, []); // Empty dependency array means this effect runs once on mount

  const formatTime = useCallback(() => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      hourCycle: "h12",
    }).format(currentDateTime);
  }, []);

  const formatDate = useCallback(() => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      day: "numeric",
      year: "numeric",
      month: "short",
    }).format(currentDateTime);
  }, []);

  return (
    <div
      className={`${styles.clockCard} bg-gradient-to-t from-[var(--dark-blue)] to-[var(--accent-blue)] mr-2 ml-1 mt-2`}
    >
      <div className={styles.upper}>
        <p className={styles.value}>{city}</p>
        <time
          className={styles.value}
          dateTime={formatTime()}
          suppressHydrationWarning
        >
          {formatTime()}
        </time>
        <time
          className={styles.value}
          dateTime={formatDate()}
          suppressHydrationWarning
        >
          {formatDate()}
        </time>
      </div>
    </div>
  );
};

export default Clock;