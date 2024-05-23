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
  const [minTemp, setMinTemp] = useState("");
  const [maxTemp, setMaxTemp] = useState("");
  const [feelsLike, setFeelsLike] = useState("");
  const [humidity, setHumidity] = useState("");
  const [wind, setWind] = useState("");
  const [clouds, setClouds] = useState("");

  const handleTemp = useCallback((temp: number) => {
    return `${Math.round(temp)}${"°F"}`;
  }, []);

  useEffect(() => {
    axios
      .get(widgetApiEndpoints.weather)
      .then((response) => {
        let data = response.data;
        //TODO: use codes from https://openweathermap.org/weather-conditions#Weather-Condition-Codes-2
        switch (data.list[0].weather[0].icon) {
          case "01d":
            //sunny
            setIcon("wi-day-sunny");
            break;
          case "01n":
            //moon stars
            setIcon("wi-night-clear");
            break;
          case "02d":
            //few clouds
            setIcon("wi-day-cloudy-high");
            break;
          case "02n":
            //few clouds
            setIcon("wi-night-alt-cloudy");
            break;
          case "03d":
            //SCATTERED cloudy
            setIcon("wi-day-cloudy-high");
            break;
          case "03n":
            //SCATTERED cloudy
            setIcon("wi-night-alt-cloudy");
            break;
          case "04d":
            //broken clouds
            setIcon("wi-day-cloudy-high");
            break;
          case "04n":
            //broken clouds
            setIcon("wi-night-alt-cloudy");
            break;
          case "09d":
            //showers
            setIcon("wi-day-showers");
            break;
          case "09n":
            //showers
            setIcon("wi-night-alt-showers");
            break;
          case "10d":
            //light rain
            setIcon("wi-day-rain-mix");
            break;
          case "10n":
            //showers
            setIcon("wi-night-alt-rain-mix");
            break;
          case "11d":
            //thunder showers lightening
            setIcon("wi-day-thunderstorm");
            break;
          case "11n":
            //thunder showers lightening
            setIcon("wi-night-thunderstorm");
            break;
          case "13d":
            //snow
            setIcon("wi-day-snow");
            break;
          case "13n":
            //snow
            setIcon("wi-night-snow");
            break;
          case "50d":
            //mist
            setIcon("wi-day-haze");
            break;
          case "50n":
            //mist
            setIcon("wi-night-haze");
            break;
          default:
            //unknown
            setIcon("wi-meteor");
            break;
        }
        setDescription(data.list[0].weather[0].description);
        setTemp(handleTemp(data.list[0].main.temp));
        setMinTemp(handleTemp(data.list[0].main.temp_min));
        setMaxTemp(handleTemp(data.list[0].main.temp_max));
        setFeelsLike(handleTemp(data.list[0].main.feels_like));
        setHumidity(`${data.list[0].main.humidity}${"%"}`);
        setWind(`${data.list[0].wind.speed}${"mph"}`);
        setClouds(`${data.list[0].clouds.all}${"%"}`);
      })
      .catch((dataFetchError) => {
        console.error(
          "Unable to fetch data from openweatherapi. Error: ",
          dataFetchError
        );
      });
  }, [handleTemp]);

  return (
    <div className="weather">
      <div className="intro">
        <p className="temp">{temp}</p>
        <i className={`wi wi-main ${icon}`}></i>
        <p className="description">{description}</p>
      </div>
      <div className="grid grid-cols-3 gap-4 grid-rows-1">
        <div className="info-line">
          <i className="wi wi-thermometer-exterior"></i>
          <span className="lbl">Min Temp</span>
          <span className="val">{minTemp}</span>
        </div>
        <div className="info-line">
          <i className="wi wi-thermometer"></i>
          <span className="lbl">Max Temp</span>
          <span className="val">{maxTemp}</span>
        </div>
        <div className="info-line">
          <i className="wi wi-thermometer-internal"></i>
          <span className="lbl">Feels Like</span>
          <span className="val">{feelsLike}</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 grid-rows-1">
        <div className="info-line">
          <i className="wi wi-cloudy"></i>
          <span className="lbl">Clouds</span>
          <span className="val">{clouds}</span>
        </div>
        <div className="info-line">
          <i className="wi wi-humidity"></i>
          <span className="lbl">Humidity</span>
          <span className="val">{humidity}</span>
        </div>
        <div className="info-line">
          <i className="wi wi-day-windy"></i>
          <span className="lbl">Wind</span>
          <span className="val">{wind}</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
