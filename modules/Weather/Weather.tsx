"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import Collapse from "../Collapsable/Collabsable";
import Popup from "../Popup/Popup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronCircleUp,
  faChevronCircleDown,
} from "@fortawesome/free-solid-svg-icons";
import { IWeatherData, IShowAlert, IShowDaily } from "./WeatherInterfaces";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { WeatherStack } from "../ui/WeatherStack";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";

type WeatherCard = {
  id: number;
  name: string;
  rightContent: React.ReactNode;
  leftContent: React.ReactNode;
};

export const WeatherWidget = () => {
  const [icon, setIcon] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [temp, setTemp] = useState<string>("");
  const [minTemp, setMinTemp] = useState<string>("");
  const [maxTemp, setMaxTemp] = useState<string>("");
  const [feelsLike, setFeelsLike] = useState<string>("");
  const [humidity, setHumidity] = useState<string>("");
  const [cards, setCards] = useState<WeatherCard[]>([]);
  const [wind, setWind] = useState<string>("");
  const [windSpeed, setWindSpeed] = useState<string>("");
  const [clouds, setClouds] = useState<string>("");
  const [dewPoint, setDewPoint] = useState<string>("");
  const [visibility, setVisibility] = useState<string>("");
  const [alerts, setAlerts] = useState<IShowAlert[]>([]);
  const [daily, setDaily] = useState<IShowDaily[]>([]);
  const [dailyExpanded, setDailyExpanded] = useState<boolean>(false);
  const [alertsExpanded, setAlertsExpanded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

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
        setLoading(false);
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

  const renderAlerts = (): JSX.Element => {
    return (
      <div style={{ paddingLeft: "10px", paddingRight: "10px" }}>
        <Table
          classNames={{
            wrapper: "bg-content-cq",
          }}
          color="primary"
          selectionMode="single"
          defaultSelectedKeys={["2"]}
          aria-label="Example static collection table"
        >
          <TableHeader>
            <TableColumn>Type</TableColumn>
            <TableColumn>Eevnt</TableColumn>
            <TableColumn>Starts On</TableColumn>
            <TableColumn>Ends On</TableColumn>
          </TableHeader>
          <TableBody>
            {alerts.map(({ event, description, start, end }, key) => {
              const dailyKey = "daily" + key;
              return (
                <TableRow key={dailyKey}>
                  <TableCell>
                    <Popup
                      popupKey={`alert${event}`}
                      popupTitle={`Alert for ${event}`}
                      color={"#990066"}
                      icon="wi wi-main wi-volcano"
                    >
                      {description}
                    </Popup>
                  </TableCell>
                  <TableCell>{event}</TableCell>
                  <TableCell>{start}</TableCell>
                  <TableCell>{end}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    );
  };

  const renderDaily = (): JSX.Element => {
    return (
      <div style={{ paddingLeft: "10px", paddingRight: "10px" }}>
        <Table
          classNames={{
            wrapper: "bg-content-cq",
          }}
          color="primary"
          selectionMode="single"
          defaultSelectedKeys={["2"]}
          aria-label="Example static collection table"
        >
          <TableHeader>
            <TableColumn>Type</TableColumn>
            <TableColumn>Date</TableColumn>
            <TableColumn>Max Temp</TableColumn>
            <TableColumn>Summary</TableColumn>
          </TableHeader>
          <TableBody>
            {daily.map((daily, key) => {
              const dailyKey = "daily" + key;
              return (
                <TableRow key={dailyKey}>
                  <TableCell>
                    <Popup
                      popupKey={dailyKey}
                      popupTitle={`Daily for ${daily.date}`}
                      color={"#990066"}
                      icon={`wi wi-main ${icon}`}
                    >
                      {daily.fullSummary}
                    </Popup>
                  </TableCell>
                  <TableCell>{daily.date}</TableCell>
                  <TableCell>{daily.temp_max}</TableCell>
                  <TableCell>{daily.summary}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    );
  };

  if (loading) {
    return <h1>Loading...</h1>;
  } else if (!loading) {
    return (
      <div style={{ paddingBottom: "10px" }}>
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
          <div
            style={{
              width: "47vh",
              left: "-210px",
              top: "40px",
              position: "relative",
            }}
          >
            <div className="flex-1 md:px-16 flex flex-col text-light">
              <div className="flex-1 grid grid-cols-2 gap-3">
                <WeatherStack
                  items={[
                    {
                      id: 0,
                      name: "Temp",
                      rightContent: (
                        <>
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
                        </>
                      ),
                      leftContent: (
                        <p
                          className="text-sm lg:w-1/2 opacity-40"
                          style={{ paddingLeft: "3px" }}
                        >
                          <i className="wi wi-thermometer-exterior"></i>
                          <br />
                          The daily temperature
                        </p>
                      ),
                    },
                    {
                      id: 0,
                      name: "Humidity",
                      rightContent: (
                        <p className="lg:self-end text-1xl flex items-end">
                          {humidity}
                        </p>
                      ),
                      leftContent: (
                        <p className=" text-sm lg:w-1/2 opacity-40">
                          <i className="wi wi-raindrop"></i>
                          <br />
                          The dew point is {dewPoint}° right now
                        </p>
                      ),
                    },
                    {
                      id: 0,
                      name: "Wind Speed",
                      rightContent: (
                        <p className="lg:self-end text-1xl flex items-end">
                          {windSpeed}m/s
                        </p>
                      ),
                      leftContent: (
                        <p className="text-sm lg:w-1/2 opacity-40">
                          <i className="wi wi-windy"></i>
                          <br />
                          Air movement velocity.
                        </p>
                      ),
                    },
                    {
                      id: 0,
                      name: "Visibility",
                      rightContent: (
                        <p className="lg:self-end text-1xl flex items-end">
                          {visibility}m/s
                        </p>
                      ),
                      leftContent: (
                        <p className="text-sm lg:w-1/2 opacity-40">
                          <i className="wi wi-horizon"></i>
                          <br />
                          The distance you can see clearly.
                        </p>
                      ),
                    },
                  ]}
                  offset={10}
                  scaleFactor={0.06}
                />
              </div>
            </div>
          </div>
        </div>
        <Card
          style={{
            marginLeft: "10px",
            marginRight: "10px",
            marginBottom: "5px",
          }}
        >
          <CardBody>
            <div className="alerts-header">
              <span style={{ paddingRight: "10px" }} className="alerts-header">
                Daily
              </span>
              <button onClick={toggleDaily}>
                <FontAwesomeIcon
                  icon={dailyExpanded ? faChevronCircleUp : faChevronCircleDown}
                  id="dailyUpDown"
                />
              </button>
            </div>
          </CardBody>
        </Card>
        <Collapse isExpanded={dailyExpanded}>{renderDaily()}</Collapse>
        <Card
          style={{
            marginTop: "10px",
            marginLeft: "10px",
            marginRight: "10px",
            marginBottom: "5px",
          }}
        >
          <CardBody>
            <div className="alerts-header">
              <span style={{ paddingRight: "10px" }} className="alerts-header">
                Alerts ({alerts.length})
              </span>
              <button onClick={toggleAlerts}>
                <FontAwesomeIcon
                  icon={
                    alertsExpanded ? faChevronCircleUp : faChevronCircleDown
                  }
                  id="alertsUpDown"
                />
              </button>
            </div>
          </CardBody>
        </Card>
        <Collapse isExpanded={alertsExpanded}>{renderAlerts()}</Collapse>
      </div>
    );
  };
};

export default WeatherWidget;
