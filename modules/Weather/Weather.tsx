import dynamic from 'next/dynamic'
import React, { useState } from "react";
import Collapse from "../Collapsable/Collabsable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronCircleUp,
  faChevronCircleDown,
} from "@fortawesome/free-solid-svg-icons";
import { IShowAlert, IShowDaily, IWeatherCard } from "./WeatherInterfaces";
import {
  Card,
  CardBody,
  Spinner,
} from "@nextui-org/react";
import { WeatherStack } from "./WeatherStack";
import {
  convertUnixToLocalDateTime,
  handleTemp,
  limit,
  fetcher,
} from "@/utils/MiscHelpers";
import { iconMappings } from "@/utils/WeatherIconMappings";
import useSWR from "swr";
const Daily = dynamic(() => import("./Daily"));
const Alerts = dynamic(() => import("./Alerts"));

const API_URL = "/api/Weather";

function useWeather() {
  const { data, error, isLoading } = useSWR(API_URL, fetcher);

  let weathercards: IWeatherCard[] = new Array<IWeatherCard>();
  let allDaily: IShowDaily[] = new Array<IShowDaily>();
  let allAlerts: IShowAlert[] = new Array<IShowAlert>();
  let icon: string | null = null;
  let description: string | null = null;
  let feelsLike: string | null = null;

  if (!isLoading) {
    icon =
      iconMappings[data.message.current.weather[0].icon as keyof typeof iconMappings] ||
      iconMappings.default;

    description = data.message.current.weather[0].description;
    feelsLike = handleTemp(data.message.current.feels_like);

    weathercards = [
      {
        id: 1,
        name: "Temp",
        rightContent: (
          <>
            <p className="lg:self-end text-1xl flex items-center">
              <span className="text-sm">Feels Like:</span>&nbsp;
              {handleTemp(data.message.current.feels_like)}
              <span className="text-sm">°F</span>
            </p>
            <p className="lg:self-end text-1xl flex items-center">
              <span className="text-sm">Min:</span>&nbsp;
              {handleTemp(data.message.daily[0].temp.min)}
              <span className="text-sm">°F</span>
            </p>
            <p className="lg:self-end text-1xl flex items-center">
              <span className="text-sm">Max:</span>&nbsp;
              {handleTemp(data.message.daily[0].temp.max)}
              <span className="text-sm">°F</span>
            </p>
          </>
        ),
        leftContent: (
          <p
            className="text-sm lg:w-1/2 opacity-40"
            style={{ paddingLeft: "3px" }}
          >
            <i className="wi wi-primary-color wi-thermometer-exterior"></i>
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
            data.message.current.humidity
          }${"%"}`}</p>
        ),
        leftContent: (
          <p className=" text-sm lg:w-1/2 opacity-40">
            <i className="wi wi-primary-color wi-raindrop"></i>
            <br />
            The dew point is {data.message.current.dew_point}° right now
          </p>
        ),
      },
      {
        id: 3,
        name: "Wind Speed",
        rightContent: (
          <p className="lg:self-end text-1xl flex items-end">
            {data.message.current.wind_speed}m/s
          </p>
        ),
        leftContent: (
          <p className="text-sm lg:w-1/2 opacity-40">
            <i className="wi wi-primary-color wi-windy"></i>
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
            {data.message.current.visibility}m/s
          </p>
        ),
        leftContent: (
          <p className="text-sm lg:w-1/2 opacity-40">
            <i className="wi wi-primary-color wi-horizon"></i>
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
            {data.message.current.clouds}%
          </p>
        ),
        leftContent: (
          <p className="text-sm lg:w-1/2 opacity-40">
            <i className="wi wi-primary-color wi-strong-wind"></i>
            <br />
            The current percentage of cloud cover.
          </p>
        ),
      },
    ];

    if (data.message.alerts) {
      allAlerts = data.message.alerts.map((alert: any) => ({
        title: alert.event,
        description: alert.description,
        start: convertUnixToLocalDateTime(alert.start, true),
        end: convertUnixToLocalDateTime(alert.end, true),
        event: alert.event,
      }));
    }

    if (data.message.daily) {
      allDaily = data.message.daily.map((day: any) => ({
        date: convertUnixToLocalDateTime(day.dt, false),
        temp_max: handleTemp(day.temp.max),
        icon: day.weather[0].icon,
        summary: limit(day.summary, 50),
        fullSummary: day.summary,
        sunrise: convertUnixToLocalDateTime(day.sunrise, true),
        sunset: convertUnixToLocalDateTime(day.sunset, true),
        feels_like: handleTemp(day.feels_like.day),
        humidity: day.humidity,
        clouds: day.clouds,
        wind_speed: day.wind_speed
      }));
    }
  }

  return {
    cards: weathercards,
    icon: icon,
    description: description,
    feelsLike: feelsLike,
    alerts: allAlerts,
    daily: allDaily,
    isLoading,
    isError: error,
  };
}

export const WeatherWidget = (): JSX.Element => {
  const {
    cards,
    alerts,
    daily,
    icon,
    description,
    feelsLike,
    isLoading,
    isError,
  } = useWeather();

  const [dailyExpanded, setDailyExpanded] = useState<boolean>(false);
  const [alertsExpanded, setAlertsExpanded] = useState<boolean>(false);

  if (isLoading) return <Spinner />;
  if (isError) return <div>Error</div>;

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
                  <i className={`wi wi-primary-color wi-main ${icon}`}></i>
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
              {cards.length > 0 && (
                <WeatherStack
                  items={cards}
                  offset={10}
                  scaleFactor={0.06}
                  duration={10000}
                />
              )}
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
            <button onClick={() => setDailyExpanded(!dailyExpanded)}>
              <FontAwesomeIcon
                icon={dailyExpanded ? faChevronCircleUp : faChevronCircleDown}
                id="dailyUpDown"
              />
            </button>
          </div>
        </CardBody>
      </Card>
      <Collapse isExpanded={dailyExpanded}>
        <Daily daily={daily} />
      </Collapse>
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
            <button onClick={() => setAlertsExpanded(!alertsExpanded)}>
              <FontAwesomeIcon
                icon={alertsExpanded ? faChevronCircleUp : faChevronCircleDown}
                id="alertsUpDown"
              />
            </button>
          </div>
        </CardBody>
      </Card>
      <Collapse isExpanded={alertsExpanded}>
        <Alerts alerts={alerts} />
      </Collapse>
    </div>
  );
};

export default WeatherWidget;
