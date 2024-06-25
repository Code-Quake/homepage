"use server";
import { IWeatherData } from "@/modules/Weather/WeatherInterfaces";

const API_URL =
  "https://api.openweathermap.org/data/3.0/onecall?lat=33.4936&lon=-111.9167&units=imperial&appid=f79df586960e6ddbb36be5b6b2d57b5d";

export default async function GetWeather() {
  const res = await fetch(API_URL, { next: { revalidate: 3600 } });

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}
