"use client";
import dynamic from "next/dynamic";
import React, { useState, useCallback, memo } from "react";
import { IWeatherCard, IAlert, IDaily } from "./WeatherInterfaces";
import { Spinner } from "@nextui-org/react";
import { convertUnixToLocalDateTime, handleTemp } from "@/utils/MiscHelpers";
import { iconMappings } from "@/utils/WeatherIconMappings";
import useSWR, { useSWRConfig } from "swr";
import ExpandableSection from "./ExpandableSection";

const Daily = dynamic(() => import("./Daily"));
const Alerts = dynamic(() => import("./Alerts"));

const API_URL =
  "https://api.openweathermap.org/data/3.0/onecall?lat=33.4936&lon=-111.9167&units=imperial&appid=f79df586960e6ddbb36be5b6b2d57b5d";

const WeatherCard = memo(
  ({
    name,
    leftContent,
    icon,
    title,
  }: {
    name: string;
    leftContent: React.ReactNode;
    icon: string;
    title: string;
  }) => (
    <div className="relative h-36 w-40 rounded-3xl bg-gradient-to-br from-dark-blue from-25% to-accent-blue p-3 border border-[#282828]">
      <div className="flex justify-items-start text-sm opacity-70 pl-1 text-[var(--primary-fuchsia)]">
        <i className={`wi ${icon} pr-2 pb-2`}></i>
        {name}
      </div>
      <div className="text-xs text-[var(--primary-dark)] pb-2">
        {title}
      </div>
      <div>{leftContent}</div>
    </div>
  )
);

WeatherCard.displayName = "WeatherCard";

const WeatherCardContent = memo(
  ({ label, value }: { label: string; value: string }) => (
    <p className="lg:self-end text-1xl flex items-center">
      <span className="text-sm w-full">{label}:</span>&nbsp;
      {value}
      <span className="text-sm">°F</span>
    </p>
  )
);

WeatherCardContent.displayName = "WeatherCardContent";

function getLocalData() {
  const day = new Date().getDate();

  if (typeof window === "undefined") {
    return null;
  }

  if (localStorage.getItem((day - 1).toString())) {
    localStorage.removeItem((day - 1).toString());
  }

  return localStorage.getItem(day.toString());
}

function setLocalData(data: any) {
  const day = new Date().getDate();

  if (typeof window === "undefined") {
    return null;
  }

  localStorage.setItem(day.toString(), data);
}

function useWeather() {
  const weatherData = getLocalData();

  const config = useSWRConfig();

  const { data, error, isLoading } = useSWR(
    weatherData ? null : API_URL,
    config
  );

  if (isLoading) {
    return { cards: new Array(), isLoading: true };
  }

  if (error) {
    return {
      cards: new Array(),
      isError: true,
      errorMessage: data.message.message,
      isLoading: false,
    };
  }

  const { current, daily, alerts } = weatherData
    ? JSON.parse(weatherData)
    : data;

  if (!weatherData) {
    setLocalData(JSON.stringify(data));
  }

  if (current) {
    const icon =
      iconMappings[current.weather[0].icon as keyof typeof iconMappings] ||
      iconMappings.default;
    const description = current.weather[0].description;
    const feelsLike = handleTemp(current.feels_like);

    const unixSunrise: number = current.sunrise;

    // Convert to milliseconds (JavaScript uses milliseconds)
    const millisecondsSunrise: number = unixSunrise * 1000;

    // Create a new Date object
    const sunrise: Date = new Date(millisecondsSunrise);

    const unixSunset: number = current.sunset;

    // Convert to milliseconds (JavaScript uses milliseconds)
    const millisecondsSunset: number = unixSunset * 1000;

    // Create a new Date object
    const sunset: Date = new Date(millisecondsSunset);

    const cards = [
      {
        id: 1,
        name: "Temp",
        icon: "wi-thermometer-exterior",
        title: "The daily temperature",
        leftContent: (
          <>
            <WeatherCardContent
              label="Feels Like"
              value={handleTemp(current.feels_like)}
            />
            <WeatherCardContent
              label="Min"
              value={handleTemp(daily[0].temp.min)}
            />
            <WeatherCardContent
              label="Max"
              value={handleTemp(daily[0].temp.max)}
            />
          </>
        ),
      },
      {
        id: 2,
        name: "Humidity",
        icon: "wi-raindrop",
        title: `Dew point is ${current.dew_point}°`,
        leftContent: (
          <p className="lg:self-end text-1xl flex items-end">{`${current.humidity}%`}</p>
        ),
      },
      {
        id: 3,
        name: "Wind Speed",
        icon: "wi-windy",
        title: "Air movement velocity.",
        leftContent: (
          <p className="lg:self-end text-1xl flex items-end">
            {current.wind_speed}m/s
          </p>
        ),
      },
      {
        id: 4,
        name: "Visibility",
        icon: "wi-horizon",
        title: "The distance you can see clearly.",
        leftContent: (
          <p className="lg:self-end text-1xl flex items-end">
            {current.visibility}m/s
          </p>
        ),
      },
      {
        id: 5,
        name: "Clouds",
        icon: "wi-cloudy",
        title: "The percentage of cloud cover.",
        leftContent: (
          <p className="lg:self-end text-1xl flex items-end">
            {current.clouds}%
          </p>
        ),
      },
      {
        id: 6,
        name: "Sun",
        icon: "wi-sunrise",
        title: "Sunrise/Sunset",
        leftContent: (
          <>
          <p className="lg:self-end text-1xl flex items-end">
            {sunrise.toLocaleTimeString()}
          </p>
          <p className="lg:self-end text-1xl flex items-end">
            {sunset.toLocaleTimeString()}
          </p>
          </>
        ),
      },
    ] as IWeatherCard[];

    const allAlerts =
      alerts.map((alert: IAlert) => ({
        title: alert.event,
        description: alert.description,
        start: convertUnixToLocalDateTime(alert.start, true),
        end: convertUnixToLocalDateTime(alert.end, true),
        event: alert.event,
      })) || [];

    const allDaily =
      daily.map((day: IDaily) => ({
        date: convertUnixToLocalDateTime(day.dt, false),
        temp_max: handleTemp(day.temp.max),
        icon: day.weather[0].icon,
        summary: day.summary,
        fullSummary: day.summary,
        sunrise: convertUnixToLocalDateTime(day.sunrise, true),
        sunset: convertUnixToLocalDateTime(day.sunset, true),
        feels_like: handleTemp(day.feels_like.day),
        humidity: day.humidity,
        clouds: day.clouds,
        wind_speed: day.wind_speed,
      })) || [];

    return {
      cards: cards,
      icon,
      description,
      feelsLike,
      alerts: allAlerts,
      daily: allDaily,
      isLoading: false,
      isError: false,
      errorMessage: "",
    };
  }

  return {
    cards: new Array(),
    icon: iconMappings.default,
    description: "",
    feelsLike: 0,
    alerts: new Array(),
    daily: new Array(),
    isLoading: false,
    isError: true,
    errorMessage: "Unable to load",
  };
}

export const WeatherWidget: React.FC = () => {
  const {
    cards,
    alerts,
    daily,
    icon,
    description,
    feelsLike,
    isLoading,
    isError,
    errorMessage,
  } = useWeather();

  const [dailyExpanded, setDailyExpanded] = useState(false);
  const [alertsExpanded, setAlertsExpanded] = useState(false);

  const toggleDailyExpanded = useCallback(
    () => setDailyExpanded((prev) => !prev),
    []
  );
  const toggleAlertsExpanded = useCallback(
    () => setAlertsExpanded((prev) => !prev),
    []
  );

  if (isLoading) return <Spinner label="Loading" />;

  if (isError)
    return <div className="px-5 text-red-900">Error: {errorMessage}</div>;

  return (
    <div className="pb-2.5 relative">
      <div className="flex pb-2.5">
        <div className="w-24 mr-2">
          <div className="relative z-10 flex flex-col left-0 top-[10%] lg:top-[calc(6.5rem-6rem)] w-24 shadow-2xl rounded-e-[2.5rem] h-40 lg:h-48 bg-[var(--accent-blue)]">
            <div className="flex-1 p-2 shadow-md shadow-slate-950 bg-[var(--dark-blue)] grid place-content-center rounded-e-[2.5rem] rounded-bl-lg">
              <div className="flex items-center flex-col text-[var(--primary-fuchsia)]">
                <div className="text-2xl text-[2.5rem]">
                  <i
                    className={`wi wi-primary-color wi-main ${icon}`}
                    aria-hidden="true"
                  ></i>
                </div>
                {description}
              </div>
            </div>
            <div className="flex-1 flex justify-center items-center text-[var(--primary-fuchsia)]">
              <div className="flex text-3xl">
                {feelsLike}
                <span className="text-sm">°F</span>
              </div>
            </div>
          </div>
        </div>
        <div className="relative w-full mt-2">
          <div className="grid grid-cols-3 grid-rows-2 gap-2">
            {cards.map((card: IWeatherCard) => (
              <WeatherCard
                key={card.id}
                name={card.name}
                leftContent={card.leftContent}
                icon={card.icon}
                title={card.title}
              />
            ))}
          </div>
        </div>
      </div>

      <ExpandableSection
        title="Daily"
        isExpanded={dailyExpanded}
        displayTable={true}
        onToggle={toggleDailyExpanded}
      >
        <Daily daily={daily} />
      </ExpandableSection>

      <ExpandableSection
        title="Alerts"
        count={alerts.length}
        displayTable={alerts.length > 0}
        isExpanded={alertsExpanded}
        onToggle={toggleAlertsExpanded}
      >
        <Alerts alerts={alerts} />
      </ExpandableSection>
    </div>
  );
};

export default memo(WeatherWidget);
