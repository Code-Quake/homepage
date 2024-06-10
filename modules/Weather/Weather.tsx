"use client";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Collapse from "../Collapsable/Collabsable";
import Popup from "../Popup/Popup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronCircleUp,
  faChevronCircleDown,
} from "@fortawesome/free-solid-svg-icons";
import { IWeatherData, IShowAlert, IShowDaily } from "./WeatherInterfaces";

/**
 * WeatherWidget Component
 *
 * @returns JSX.Element
 */
export const WeatherWidget = (): JSX.Element => {
  const [icon, setIcon] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [temp, setTemp] = useState<string>("");
  const [minTemp, setMinTemp] = useState<string>("");
  const [maxTemp, setMaxTemp] = useState<string>("");
  const [feelsLike, setFeelsLike] = useState<string>("");
  const [humidity, setHumidity] = useState<string>("");
  const [wind, setWind] = useState<string>("");
  const [clouds, setClouds] = useState<string>("");
  const [alerts, setAlerts] = useState<IShowAlert[]>([]);
  const [daily, setDaily] = useState<IShowDaily[]>([]);
  const [dailyExpanded, setDailyExpanded] = useState<boolean>(false);
  const [alertsExpanded, setAlertsExpanded] = useState<boolean>(false);

  const handleTemp = useCallback((temp: number): string => {
    return `${Math.round(temp)}${"°F"}`;
  }, []);

  const overlay = document.getElementById("overlay");

  function popupDialog(id: string): void {
    overlay!.style.display = "block";
    document.getElementById(id)!.style.display = "block";
  }

  const API_URL =
    "https://api.openweathermap.org/data/3.0/onecall?lat=33.4936&lon=-111.9167&units=imperial&appid=f79df586960e6ddbb36be5b6b2d57b5d";

  useEffect(() => {
    axios
      .get<IWeatherData>(API_URL)
      .then((response) => {
        const data = response.data;

        const iconMappings: { [key: string]: string } = {
          "01d": "wi-day-sunny",
          "01n": "wi-night-clear",
          "02d": "wi-day-cloudy-high",
          "02n": "wi-night-alt-cloudy",
          "03d": "wi-day-cloudy-high",
          "03n": "wi-night-alt-cloudy",
          "04d": "wi-day-cloudy-high",
          "04n": "wi-night-alt-cloudy",
          "09d": "wi-day-showers",
          "09n": "wi-night-alt-showers",
          "10d": "wi-day-rain-mix",
          "10n": "wi-night-alt-rain-mix",
          "11d": "wi-day-thunderstorm",
          "11n": "wi-night-thunderstorm",
          "13d": "wi-day-snow",
          "13n": "wi-night-snow",
          "50d": "wi-day-haze",
          "50n": "wi-night-haze",
          default: "wi-meteor",
        };

        const icon =
          iconMappings[data.current.weather[0].icon] || iconMappings.default;

        setIcon(icon);
        setDescription(data.current.weather[0].description);
        setTemp(handleTemp(data.current.temp));
        setMinTemp(handleTemp(data.daily[0].temp.min));
        setMaxTemp(handleTemp(data.daily[0].temp.max));
        setFeelsLike(handleTemp(data.daily[0].feels_like.day));
        setHumidity(`${data.daily[0].humidity}${"%"}`);
        setWind(`${data.daily[0].wind_speed}${"mph"}`);
        setClouds(`${data.daily[0].clouds}${"%"}`);

        const allAlerts = data.alerts.map((alert) => ({
          title: alert.event,
          description: alert.description,
          start: convertUnixToLocalDateTime(alert.start, true),
          end: convertUnixToLocalDateTime(alert.end, true),
          event: alert.event,
        }));

        setAlerts(allAlerts);

        const allDaily = data.daily.map((day) => ({
          date: convertUnixToLocalDateTime(day.dt, false),
          temp_max: handleTemp(day.temp.max),
          icon: day.weather[0].icon,
          summary: limit(day.summary, 50),
          fullSummary: day.summary,
        }));

        setDaily(allDaily);
      })
      .catch((dataFetchError) => {
        console.error(
          "Unable to fetch data from openweatherapi. Error: ",
          dataFetchError
        );
      });
  }, [handleTemp]);

  const limit = (string: string, length: number, end = "..."): string => {
    return string.length < length ? string : string.substring(0, length) + end;
  };

  const convertUnixToLocalDateTime = (
    unixTimestamp: number,
    showTime: boolean
  ): string => {
    const date = new Date(unixTimestamp * 1000);
    const dateTimeFormat = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: showTime ? "2-digit" : undefined,
      minute: showTime ? "2-digit" : undefined,
    });

    return dateTimeFormat.format(date);
  };

  function toggleDaily(): void {
    setDailyExpanded(!dailyExpanded);
  }

  function toggleAlerts(): void {
    setAlertsExpanded(!alertsExpanded);
  }

  const renderAlerts = (): JSX.Element[] =>
    alerts.map(({ event, description, start, end }) => (
      <div className="info-line-daily" key={event}>
        <button
          onClick={() => popupDialog(`alert${event}`)}
          id={`btnalert${event}`}
        >
          <i className="wi wi-volcano"></i>
        </button>
        <span className="val">{event}</span>
        <span className="val">{start}</span>
        <span className="val">{end}</span>
        <Popup popupKey={`alert${event}`} popupTitle={`Alert for ${event}`}>
          {description}
        </Popup>
      </div>
    ));

  const renderDaily = (): JSX.Element[] =>
    daily.map((daily, key) => {
      const dailyKey = "daily" + key;
      return (
        <div className="info-line-daily" key={dailyKey}>
          <button onClick={() => popupDialog(dailyKey)} id={"btn" + dailyKey}>
            <i className={`wi wi-main ${icon}`}></i>
          </button>
          <span className="val">{daily.date}</span>
          <span className="val">{daily.temp_max}</span>
          <span className="val">{daily.summary}</span>
          <Popup popupKey={dailyKey} popupTitle={`Daily for ${daily.date}`}>
            {daily.fullSummary}
          </Popup>
        </div>
      );
    });

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
      <div className="alerts-header">
        <span className="alerts-header">Daily</span>
        <button onClick={toggleDaily}>
          <FontAwesomeIcon
            icon={dailyExpanded ? faChevronCircleUp : faChevronCircleDown}
            id="dailyUpDown"
          />
        </button>
      </div>
      <Collapse isExpanded={dailyExpanded}>{renderDaily()}</Collapse>
      <div className="alerts-header">
        <span className="alerts-header">Alerts ({alerts.length})</span>
        <button onClick={toggleAlerts}>
          <FontAwesomeIcon
            icon={alertsExpanded ? faChevronCircleUp : faChevronCircleDown}
            id="alertsUpDown"
          />
        </button>
      </div>
      <Collapse isExpanded={alertsExpanded}>{renderAlerts()}</Collapse>
    </div>
  );
};

export default WeatherWidget;
