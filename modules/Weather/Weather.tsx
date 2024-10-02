"use client";
import dynamic from "next/dynamic";
import React, { useState, useCallback, memo } from "react";
import {
  IWeatherCard,
  IAlert,
  IDaily,
  IShowDaily,
  IShowAlert,
} from "./WeatherInterfaces";
import { Spinner } from "@nextui-org/react";
import { convertUnixToLocalDateTime, handleTemp } from "@/utils/MiscHelpers";
import { iconMappings } from "@/utils/WeatherIconMappings";
import useSWR from "swr";
import ExpandableSection from "./ExpandableSection";
import keys from "../../keys.json";

const Daily = dynamic(() => import("./Daily"), { ssr: false });
const Alerts = dynamic(() => import("./Alerts"), { ssr: false });

const API_URL = `https://api.openweathermap.org/data/3.0/onecall?lat=33.4936&lon=-111.9167&units=imperial&appid=${keys.keys.weather}`;

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
    <div className="relative z-10 flex flex-col w-40 shadow-2xl rounded-t-lg rounded-b-lg bg-[var(--accent-blue)] border border-[#282828]">
      <div className="flex-1 p-2 shadow-md shadow-slate-950 bg-gradient-to-t from-dark-blue to-accent-blue grid place-content-center rounded-t-lg h-14">
        <div className="flex justify-items-start text-[var(--primary-fuchsia)] text-sm">
          <i
            className={`wi wi-primary-color wi-main ${icon} mr-2`}
            aria-hidden="true"
          ></i>
          <span className=" font-semibold">{name}</span>
        </div>
      </div>
      <div className="text-[var(--primary-fuchsia)] h-28 p-2">
        <div className="text-xs text-[var(--primary-dark)] pb-2 font-semibold">
          {title}
        </div>
        <div>{leftContent}</div>
      </div>
    </div>
  )
);

WeatherCard.displayName = "WeatherCard";

const WeatherCardContent = memo(
  ({ label, value }: { label: string; value: string }) => (
    <p className="flex align-top">
      <span className="text-[0.9rem] w-full">{label}:</span>
      {value}
      <span className="mt-1 text-[0.6rem]">°F</span>
    </p>
  )
);

WeatherCardContent.displayName = "WeatherCardContent";

function manageLocalData(data?: any) {
  const day = new Date().getDate();

  if (typeof window === "undefined") {
    return null;
  }

  if (data) {
    localStorage.setItem(day.toString(), JSON.stringify(data));
    return;
  }

  if (localStorage.getItem((day - 1).toString())) {
    localStorage.removeItem((day - 1).toString());
  }

  return JSON.parse(localStorage.getItem(day.toString()) ?? "null");
}

function useWeather() {
  const weatherData = manageLocalData();

  const { data, error, isLoading } = useSWR(weatherData ? null : API_URL, {
    fallbackData: weatherData,
  });

  if (isLoading) {
    return {
      cards: [] as IWeatherCard[],
      icon: iconMappings.default,
      description: "",
      feelsLike: 0,
      alerts: [] as IShowAlert[],
      daily: [] as IShowDaily[],
      isLoading: true,
      isError: false,
      errorMessage: "",
    };
  }

  if (error) {
    return {
      cards: [] as IWeatherCard[],
      icon: iconMappings.default,
      description: "",
      feelsLike: 0,
      alerts: [] as IShowAlert[],
      daily: [] as IShowDaily[],
      isLoading: false,
      isError: true,
      errorMessage: data.message.message,
    };
  }

  const { current, daily, alerts } = weatherData
    ? JSON.parse(weatherData)
    : data;

  if (!weatherData) {
    manageLocalData(JSON.stringify(data));
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
          <p className="lg:self-end text-[0.9rem] flex items-end">{`${current.humidity}%`}</p>
        ),
      },
      {
        id: 3,
        name: "Wind Speed",
        icon: "wi-windy",
        title: "Air movement velocity.",
        leftContent: (
          <p className="lg:self-end text-[0.9rem] flex items-end">
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
          <p className="lg:self-end text-[0.9rem] flex items-end">
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
          <p className="lg:self-end text-[0.9rem] flex items-end">
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
            <p className="lg:self-end text-[0.9rem] flex items-end">
              {sunrise.toLocaleTimeString()}
            </p>
            <p className="lg:self-end text-1xl flex items-end">
              {sunset.toLocaleTimeString()}
            </p>
          </>
        ),
      },
    ] as IWeatherCard[];

    let allAlerts: IShowAlert[] = [];

    if (alerts) {
      allAlerts = alerts.map((alert: IAlert) => ({
        title: alert.event,
        description: alert.description,
        start: convertUnixToLocalDateTime(alert.start, true),
        end: convertUnixToLocalDateTime(alert.end, true),
        event: alert.event,
      })) as IShowAlert[];
    }

    const allDaily = daily.map((day: IDaily) => ({
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
    })) as IShowDaily[];

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
    cards: [] as IWeatherCard[],
    icon: iconMappings.default,
    description: "",
    feelsLike: 0,
    alerts: [] as IShowAlert[],
    daily: [] as IShowDaily[],
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
        <div className="w-24 mr-2 pl-[2px]">
          <div className="relative z-10 flex flex-col left-0 top-[10%] lg:top-[calc(6.5rem-6rem)] w-24 shadow-2xl rounded-e-[2.5rem] h-40 lg:h-48 bg-[var(--accent-blue)]">
            <div className="flex-1 p-2 shadow-md shadow-slate-950 bg-[var(--dark-blue)] grid place-content-center rounded-e-[2.5rem]">
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
          <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-1 justify-center">
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
