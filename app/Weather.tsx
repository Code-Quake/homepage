"use client";
import React, { useState, useEffect, useCallback } from "react";
import widgetApiEndpoints from "@/utils/defaults";
import axios from "axios";

interface City {
  id: number;
  name: string;
  coord: {
    lat: number;
    lon: number;
  };
  country: string;
  population: number;
  timezone: number;
  sunrise: number;
  sunset: number;
}

interface Weather {
  id: number;
  main: string;
  description: string;
  icon: string;
}

interface Clouds {
  all: number;
}

interface Wind {
  speed: number;
  deg: number;
  gust: number;
}

interface Main {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  sea_level: number;
  grnd_level: number;
  humidity: number;
  temp_kf: number;
}

interface Sys {
  pod: string;
}

interface ListItem {
  dt: number;
  main: Main;
  weather: Weather[];
  clouds: Clouds;
  wind: Wind;
  visibility: number;
  pop: number;
  sys: Sys;
  dt_txt: string;
}

interface RootObject {
  cod: string;
  message: number;
  cnt: number;
  list: ListItem[];
  city: City;
}

const WeatherWidget = () => {
  const [icon, setIcon] = useState("");
  const [description, setDescription] = useState("");
  const [temp, setTemp] = useState("");
  const [weatherDetails, setWeatherDetails] = useState([] as any[]);
  const [data, setData] = useState<RootObject>({} as RootObject);

  const handleTemp = useCallback((temp: number) => {
    return `${Math.round(temp)}${"°F"}`;
  }, []);

  const handleWeatherData = useCallback(
    (data: RootObject) => {
        setWeatherDetails([
          [
            {
              label: "Min Temp",
              value: handleTemp(data.list[0].main.temp_min),
            },
            {
              label: "Max Temp",
              value: handleTemp(data.list[0].main.temp_max),
            },
            {
              label: "Feels Like",
              value: handleTemp(data.list[0].main.feels_like),
            },
          ],
          [
            { label: "Pressure", value: `${data.list[0].main.pressure}hPa` },
            { label: "Humidity", value: `${data.list[0].main.humidity}%` },
            {
              label: "wind",
              value: `${data.list[0].wind.speed}${"mph"}`,
            },
            { label: "clouds", value: `${data.list[0].clouds.all.toString()}%` },
          ],
        ]);
    },
    [handleTemp]
  );

  const handleData = useCallback(() => {
    setIcon(data.list[0].weather[0].icon);
    setDescription(data.list[0].weather[0].description);
    setTemp(handleTemp(data.list[0].main.temp));
    handleWeatherData(data);
  }, [data, handleWeatherData, handleTemp]);

  useEffect(() => {
    axios
      .get(`${widgetApiEndpoints.weather}`)
      .then((response) => {
        setData(response.data);
        handleData();
      })
      .catch((dataFetchError) => {
        console.error(
          "Unable to fetch data from openweatherapi. Error: ",
          dataFetchError
        );
      });
  }, [handleData, data]);

  return (
    <div className="weather">
      <i className={`owi owi-03d`}></i>
      <div className="intro">
        <p className="temp">{temp}</p>
        <i className={`owi owi-${icon}`}></i>
      </div>
      <p className="description">{description}</p>
      <div className="details">
        {weatherDetails.map((weather) => (
          <p className="info-line" key={weather.label}>
            <span className="lbl">{weather.label}</span>
            <span className="val">{weather.value}</span>
          </p>
        ))}
      </div>
    </div>
  );
};

export default WeatherWidget;
