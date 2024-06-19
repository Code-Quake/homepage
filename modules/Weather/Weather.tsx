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
  const [windSpeed, setWindSpeed] = useState<string>("");
  const [clouds, setClouds] = useState<string>("");
  const [dewPoint, setDewPoint] = useState<string>("");
  const [visibility, setVisibility] = useState<string>("");
  const [alerts, setAlerts] = useState<IShowAlert[]>([]);
  const [daily, setDaily] = useState<IShowDaily[]>([]);
  const [dailyExpanded, setDailyExpanded] = useState<boolean>(false);
  const [alertsExpanded, setAlertsExpanded] = useState<boolean>(false);

  const handleTemp = useCallback((temp: number): string => {
    return `${Math.round(temp)}`;
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
        setFeelsLike(handleTemp(data.current.feels_like));
        setHumidity(`${data.current.humidity}${"%"}`);
        setWind(`${data.current.wind_speed}${"mph"}`);
        setClouds(`${data.current.clouds}${"%"}`);
        setDewPoint(`${data.current.dew_point}`);
        setWindSpeed(`${data.current.wind_speed}`);
        setVisibility(`${data.current.visibility}`);

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
        <Popup
          popupKey={`alert${event}`}
          popupTitle={`Alert for ${event}`}
          color={"#990066"}
          icon="wi wi-main wi-volcano"
        >
          {description}
        </Popup>
        <span className="val">{event}</span>
        <span className="val">{start}</span>
        <span className="val">{end}</span>
      </div>
    ));

  const renderDaily = (): JSX.Element[] =>
    daily.map((daily, key) => {
      const dailyKey = "daily" + key;
      return (
        <div className="info-line-daily" key={dailyKey}>
          <Popup
            popupKey={dailyKey}
            popupTitle={`Daily for ${daily.date}`}
            color={"#990066"}
            icon={`wi wi-main ${icon}`}
          >
            {daily.fullSummary}
          </Popup>
          <span className="val">{daily.date}</span>
          <span className="val">{daily.temp_max}</span>
          <span className="val">{daily.summary}</span>
        </div>
      );
    });

  return (
    <div style={{paddingBottom: "10px"}}>
      <div
        className="grid grid-cols-2 gap-x-2 gap-y-2"
        style={{ paddingBottom: "10px" }}
      >
        <div>
          <div className="relative z-10 flex flex-col left-0 top-[10%] lg:top-[calc(6.5rem-6rem)] w-24 shadow-2xl rounded-e-[2.5rem] h-40 lg:h-48 bg-indigo-400 text-light">
            <div className="flex-1 p-2 shadow-md bg-indigo-600 grid place-content-center rounded-e-[2.5rem] rounded-bl-lg">
              <div className="flex items-center flex-col">
                <div className="text-2xl text-[2.5rem]">
                  <i className={`wi wi-main ${icon}`}></i>
                </div>
                {description}
              </div>
            </div>
            <div className="flex-1 flex justify-center items-center">
              <div className="flex text-3xl">
                {feelsLike}
                <span className="text-sm">°F</span>
              </div>
            </div>
          </div>
        </div>
        <div style={{ width: "47vh", left: "-260px", position: "relative" }}>
          <div className="flex-1 md:px-16 flex flex-col text-light">
            <div className="flex-1 grid grid-cols-2 gap-3">
              <div className="weather-data-card p-4 flex flex-col justify-between rounded-3xl">
                <h2 className="font-medium todayDescription mb-4">Temp</h2>
                <div className="flex gap-4 lg:gap-0 flex-col lg:flex-row justify-between ">
                  <div className="grid grid-cols-1 grid-rows-3">
                    <p className="lg:self-end text-1xl flex items-center">
                      <span className="text-sm">Feels Like:</span>&nbsp;
                      {feelsLike}
                      <span className="text-sm">°F</span>
                    </p>
                    <p className="lg:self-end text-1xl flex items-center">
                      <span className="text-sm">Min:</span>&nbsp;
                      {minTemp}
                      <span className="text-sm">°F</span>
                    </p>
                    <p className="lg:self-end text-1xl flex items-center">
                      <span className="text-sm">Max:</span>&nbsp;
                      {maxTemp}
                      <span className="text-sm">°F</span>
                    </p>
                  </div>
                  <p
                    className="text-sm lg:w-1/2 opacity-40"
                    style={{ paddingLeft: "3px" }}
                  >
                    <i className="wi wi-thermometer-exterior"></i>
                    <br />
                    The daily temperature
                  </p>
                </div>
              </div>
              <div className="weather-data-card p-4 flex flex-col justify-between rounded-3xl">
                <h2 className="font-medium todayDescription mb-4">Humidity</h2>
                <div className="flex gap-4 lg:gap-0 flex-col lg:flex-row justify-between ">
                  <p className="lg:self-end text-1xl flex items-end">
                    {humidity}
                  </p>
                  <p className=" text-sm lg:w-1/2 opacity-40">
                    <i className="wi wi-raindrop"></i>
                    <br />
                    The dew point is {dewPoint}° right now
                  </p>
                </div>
              </div>
              <div className="weather-data-card p-4 flex flex-col justify-between rounded-3xl">
                <h2 className="font-medium mb-4 todayDescription">
                  Wind Speed
                </h2>
                <div className="flex gap-4 lg:gap-0 flex-col lg:flex-row justify-between ">
                  <p className="lg:self-end text-1xl flex items-end">
                    {windSpeed}m/s
                  </p>
                  <p className="text-sm lg:w-1/2 opacity-40">
                    <i className="wi wi-windy"></i>
                    <br />
                    Air movement velocity.
                  </p>
                </div>
              </div>
              <div className="weather-data-card p-4 flex flex-col justify-between rounded-3xl">
                <h2 className="font-medium todayDescription mb-4">
                  Visibility
                </h2>
                <div className="flex gap-4 lg:gap-0 flex-col lg:flex-row justify-between ">
                  <p className="lg:self-end text-1xl flex items-end">
                    {visibility}m/s
                  </p>
                  <p className="text-sm lg:w-1/2 opacity-40">
                    <i className="wi wi-horizon"></i>
                    <br />
                    The distance you can see clearly.
                  </p>
                </div>
              </div>
            </div>
          </div>
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
    // <div className="weather">
    //   <div className="intro">
    //     <p className="temp">{temp}</p>
    //     <i className={`wi wi-main ${icon}`}></i>
    //     <p className="description">{description}</p>
    //   </div>
    //   <div className="grid grid-cols-3 gap-4 grid-rows-1">
    //     <div className="info-line">
    //       <i className="wi wi-thermometer-exterior"></i>
    //       <span className="lbl">Min Temp</span>
    //       <span className="val">{minTemp}</span>
    //     </div>
    //     <div className="info-line">
    //       <i className="wi wi-thermometer"></i>
    //       <span className="lbl">Max Temp</span>
    //       <span className="val">{maxTemp}</span>
    //     </div>
    //     <div className="info-line">
    //       <i className="wi wi-thermometer-internal"></i>
    //       <span className="lbl">Feels Like</span>
    //       <span className="val">{feelsLike}</span>
    //     </div>
    //   </div>
    //   <div className="grid grid-cols-3 gap-4 grid-rows-1">
    //     <div className="info-line">
    //       <i className="wi wi-cloudy"></i>
    //       <span className="lbl">Clouds</span>
    //       <span className="val">{clouds}</span>
    //     </div>
    //     <div className="info-line">
    //       <i className="wi wi-humidity"></i>
    //       <span className="lbl">Humidity</span>
    //       <span className="val">{humidity}</span>
    //     </div>
    //     <div className="info-line">
    //       <i className="wi wi-day-windy"></i>
    //       <span className="lbl">Wind</span>
    //       <span className="val">{wind}</span>
    //     </div>
    //   </div>
    //   <div className="alerts-header">
    //     <span className="alerts-header">Daily</span>
    //     <button onClick={toggleDaily}>
    //       <FontAwesomeIcon
    //         icon={dailyExpanded ? faChevronCircleUp : faChevronCircleDown}
    //         id="dailyUpDown"
    //       />
    //     </button>
    //   </div>
    //   <Collapse isExpanded={dailyExpanded}>{renderDaily()}</Collapse>
    //   <div className="alerts-header">
    //     <span className="alerts-header">Alerts ({alerts.length})</span>
    //     <button onClick={toggleAlerts}>
    //       <FontAwesomeIcon
    //         icon={alertsExpanded ? faChevronCircleUp : faChevronCircleDown}
    //         id="alertsUpDown"
    //       />
    //     </button>
    //   </div>
    //   <Collapse isExpanded={alertsExpanded}>{renderAlerts()}</Collapse>
    // </div>
  );
};

export default WeatherWidget;
