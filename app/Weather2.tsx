"use client";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

interface ShowAlert {
  description: string;
  end: string;
  event: string;
  start: string;
}

interface Alert {
  description: string;
  end: number;
  event: string;
  sender_name: string;
  start: number;
  tags: string[];
}

interface Weather {
  description: string;
  icon: string;
  id: number;
  main: string;
}

interface Current {
  clouds: number;
  dew_point: number;
  dt: number;
  feels_like: number;
  humidity: number;
  pressure: number;
  sunrise: number;
  sunset: number;
  temp: number;
  uvi: number;
  visibility: number;
  weather: Weather[];
  wind_deg: number;
  wind_speed: number;
}

interface FeelsLike {
  day: number;
  eve: number;
  morn: number;
  night: number;
}

interface Temp {
  day: number;
  eve: number;
  max: number;
  min: number;
  morn: number;
  night: number;
}

interface Daily {
  clouds: number;
  dew_point: number;
  dt: number;
  feels_like: FeelsLike;
  humidity: number;
  moon_phase: number;
  moonrise: number;
  moonset: number;
  pop: number;
  pressure: number;
  summary: string;
  sunrise: number;
  sunset: number;
  temp: Temp;
  uvi: number;
  weather: Weather[];
  wind_deg: number;
  wind_gust: number;
  wind_speed: number;
}

interface Hourly {
  clouds: number;
  dew_point: number;
  dt: number;
  feels_like: number;
  humidity: number;
  pop: number;
  pressure: number;
  temp: number;
  uvi: number;
  visibility: number;
  weather: Weather[];
  wind_deg: number;
  wind_gust: number;
  wind_speed: number;
}

interface Minutely {
  dt: number;
  precipitation: number;
}

interface WeatherData {
  alerts: Alert[];
  current: Current;
  daily: Daily[];
  hourly: Hourly[];
  lat: number;
  lon: number;
  minutely: Minutely[];
  timezone: string;
  timezone_offset: number;
}

const WeatherWidget2 = () => {
  const [icon, setIcon] = useState("");
  const [description, setDescription] = useState("");
  const [temp, setTemp] = useState("");
  const [minTemp, setMinTemp] = useState("");
  const [maxTemp, setMaxTemp] = useState("");
  const [feelsLike, setFeelsLike] = useState("");
  const [humidity, setHumidity] = useState("");
  const [wind, setWind] = useState("");
  const [clouds, setClouds] = useState("");
  const [alerts, setAlerts] = useState([] as ShowAlert[]);

  const handleTemp = useCallback((temp: number) => {
    return `${Math.round(temp)}${"°F"}`;
  }, []);

  useEffect(() => {
    axios
      .get(
        "https://api.openweathermap.org/data/3.0/onecall?lat=33.4936&lon=-111.9167&units=imperial&appid=f79df586960e6ddbb36be5b6b2d57b5d"
      )
      .then((response) => {
        let data = response.data as WeatherData;
        //TODO: use codes from https://openweathermap.org/weather-conditions#Weather-Condition-Codes-2
        switch (data.current.weather[0].icon) {
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
        setDescription(data.current.weather[0].description);
        setTemp(handleTemp(data.current.temp));
        setMinTemp(handleTemp(data.daily[0].temp.min));
        setMaxTemp(handleTemp(data.daily[0].temp.max));
        setFeelsLike(handleTemp(data.daily[0].feels_like.day));
        setHumidity(`${data.daily[0].humidity}${"%"}`);
        setWind(`${data.daily[0].wind_speed}${"mph"}`);
        setClouds(`${data.daily[0].clouds}${"%"}`);

        let allAlerts = [] as ShowAlert[];

        data.alerts.forEach((alert) => {
            let alert1 = {
              title: alert.event,
              description: alert.description,
              start: convertUnixToLocalDateTime(alert.start),
              end: convertUnixToLocalDateTime(alert.end),
              event: alert.event
            } as ShowAlert;

            allAlerts.push(alert1);
        });

        setAlerts(allAlerts);
      })
      .catch((dataFetchError) => {
        console.error(
          "Unable to fetch data from openweatherapi. Error: ",
          dataFetchError
        );
      });
  }, [handleTemp]);

  function convertUnixToLocalDateTime(unixTimestamp: number) {
    const date = new Date(unixTimestamp * 1000); // Convert Unix timestamp (in seconds) to milliseconds
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    const localDateTimeString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return localDateTimeString;
  }

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
      <p className="alerts-header">Alerts</p>
      {alerts.map((alert, key) => {
        return (
          <>
            <div className="info-line" key={key}>
              <i className="wi wi-volcano"></i>
              <span className="lbl">{alert.event}</span>
              <span className="lbl">{alert.start}</span>
              <span className="val">{alert.end}</span>
            </div>
            <div className="info-line" key={key}>
              <span className="val">{alert.description}</span>
            </div>
          </>
        );
      })}      
    </div>
  );
};

export default WeatherWidget2;
