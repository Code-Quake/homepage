"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronCircleUp,
  faChevronCircleDown,
} from "@fortawesome/free-solid-svg-icons";
import { IWeatherData, IShowAlert, IShowDaily } from "./WeatherInterfaces";
import Collapse from "../Collapsable/Collabsable";
import Popup from "../Popup/Popup";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Card,
  CardBody,
  Spinner
} from "@nextui-org/react";
import { WeatherStack } from "./WeatherStack";
import {
  convertUnixToLocalDateTime,
  handleTemp,
  limit,
  subtractHours,
} from "@/utils/MiscHelpers";
import { iconMappings } from "@/utils/WeatherIconMappings";

type WeatherCard = {
  id: number;
  name: string;
  rightContent: React.ReactNode;
  leftContent: React.ReactNode;
};

export const WeatherWidget = () => {
  const [icon, setIcon] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [feelsLike, setFeelsLike] = useState<string>("");
  const [cards, setCards] = useState<WeatherCard[]>([]);
  const [alerts, setAlerts] = useState<IShowAlert[]>([]);
  const [daily, setDaily] = useState<IShowDaily[]>([]);
  const [dailyExpanded, setDailyExpanded] = useState<boolean>(false);
  const [alertsExpanded, setAlertsExpanded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const processData = useCallback(
    (data: IWeatherData) => {
      const icon =
        iconMappings[
          data.current.weather[0].icon as keyof typeof iconMappings
        ] || iconMappings.default;

      setIcon(icon);
      setDescription(data.current.weather[0].description);
      setFeelsLike(handleTemp(data.current.feels_like));

      const Cards = [
        {
          id: 1,
          name: "Temp",
          rightContent: (
            <>
              <p className="lg:self-end text-1xl flex items-center">
                <span className="text-sm">Feels Like:</span>&nbsp;
                {handleTemp(data.current.feels_like)}
                <span className="text-sm">°F</span>
              </p>
              <p className="lg:self-end text-1xl flex items-center">
                <span className="text-sm">Min:</span>&nbsp;
                {handleTemp(data.daily[0].temp.min)}
                <span className="text-sm">°F</span>
              </p>
              <p className="lg:self-end text-1xl flex items-center">
                <span className="text-sm">Max:</span>&nbsp;
                {handleTemp(data.daily[0].temp.max)}
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
          id: 2,
          name: "Humidity",
          rightContent: (
            <p className="lg:self-end text-1xl flex items-end">{`${
              data.current.humidity
            }${"%"}`}</p>
          ),
          leftContent: (
            <p className=" text-sm lg:w-1/2 opacity-40">
              <i className="wi wi-raindrop"></i>
              <br />
              The dew point is {data.current.dew_point}° right now
            </p>
          ),
        },
        {
          id: 3,
          name: "Wind Speed",
          rightContent: (
            <p className="lg:self-end text-1xl flex items-end">
              {data.current.wind_speed}m/s
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
          id: 4,
          name: "Visibility",
          rightContent: (
            <p className="lg:self-end text-1xl flex items-end">
              {data.current.visibility}m/s
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
        {
          id: 5,
          name: "Clouds",
          rightContent: (
            <p className="lg:self-end text-1xl flex items-end">
              {data.current.clouds}%
            </p>
          ),
          leftContent: (
            <p className="text-sm lg:w-1/2 opacity-40">
              <i className="wi wi-strong-wind"></i>
              <br />
              The current percentage of cloud cover.
            </p>
          ),
        },
      ];

      setCards(Cards);

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
    },
    [setIcon, setDescription, setFeelsLike, setCards, setAlerts, setDaily]
  );

  const API_URL =
    "https://api.openweathermap.org/data/3.0/onecall?lat=33.4936&lon=-111.9167&units=imperial&appid=f79df586960e6ddbb36be5b6b2d57b5d";

  useEffect(() => {
    let refresh = false;
    const value = localStorage.getItem("weatherDate");

    if (!value) {
      localStorage.setItem("weatherDate", new Date().toString());
      refresh = true;
    } else {
      const oldDate = new Date(value);
      if (oldDate <= subtractHours(new Date(), 1)) {
        refresh = true;
      }
    }

    if (refresh) {
      axios
        .get<IWeatherData>(API_URL)
        .then((response) => {
          processData(response.data);

          localStorage.setItem("newsDate", new Date().toString());
          localStorage.setItem("newsData", JSON.stringify(response.data));

          setLoading(false);
        })
        .catch((dataFetchError) => {
          console.error(
            "Unable to fetch data from openweatherapi. Error: ",
            dataFetchError
          );
        });
    } else {
      const value = localStorage.getItem("newsData") as string;

      const data = JSON.parse(value) as IWeatherData;

      data ?? processData(data);

      data ?? setLoading(false);
    }
  }, [processData]);

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
    return (
      <div className="flex relative top-1/4 justify-center items-center">
        <Spinner label="Loading" size="lg" classNames={{ label: "spinnerLabel pt-3" }} />
      </div>
    );
  } else if (!loading) {
    return (
      <div style={{ paddingBottom: "10px" }}>
        <div
          className="grid grid-cols-2 gap-x-2 gap-y-2"
          style={{ paddingBottom: "10px" }}
        >
          <div>
            <div className="relative z-10 flex flex-col left-0 top-[10%] lg:top-[calc(6.5rem-6rem)] w-24 shadow-2xl rounded-e-[2.5rem] h-40 lg:h-48 currentLight text-light">
              <div className="flex-1 p-2 shadow-md currentDark grid place-content-center rounded-e-[2.5rem] rounded-bl-lg">
                <div className="flex items-center flex-col currentHighlights">
                  <div className="text-2xl text-[2.5rem]">
                    <i className={`wi wi-main ${icon}`}></i>
                  </div>
                  {description}
                </div>
              </div>
              <div className="flex-1 flex justify-center items-center currentHighlights">
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
              top: "50px",
              position: "relative",
            }}
          >
            <div className="flex-1 md:px-16 flex flex-col text-light">
              <div className="flex-1 grid grid-cols-2 gap-3">
                <WeatherStack
                  items={cards}
                  offset={10}
                  scaleFactor={0.06}
                  duration={10000}
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
            backgroundColor: "var(--dark-blue)",
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
            backgroundColor: "var(--dark-blue)",
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
  }
};

export default WeatherWidget;
