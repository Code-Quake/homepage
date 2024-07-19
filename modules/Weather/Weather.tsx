import dynamic from "next/dynamic";
import React, { useState, useCallback, memo } from "react";
import { IAlert, IDaily } from "./WeatherInterfaces";
import { Spinner } from "@nextui-org/react";
import { WeatherStack } from "./WeatherStack";
import {
  convertUnixToLocalDateTime,
  handleTemp,
  limit,
  fetcher,
} from "@/utils/MiscHelpers";
import { iconMappings } from "@/utils/WeatherIconMappings";
import useSWR from "swr";
import ExpandableSection from "./ExpandableSection";

const Daily = dynamic(() => import("./Daily"));
const Alerts = dynamic(() => import("./Alerts"));

const API_URL = "/api/Weather";

function useWeather() {
  const { data, error, isLoading } = useSWR(API_URL, fetcher);

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

  const current = data.message.current;
  const daily = data.message.daily;

  const icon = iconMappings[current.weather[0].icon as keyof typeof iconMappings] || iconMappings.default;
  const description = current.weather[0].description;
  const feelsLike = handleTemp(current.feels_like);

  const weathercards = [
    {
      id: 1,
      name: "Temp",
      rightContent: (
        <>
          <TempItem label="Feels Like" value={handleTemp(current.feels_like)} />
          <TempItem label="Min" value={handleTemp(daily[0].temp.min)} />
          <TempItem label="Max" value={handleTemp(daily[0].temp.max)} />
        </>
      ),
      leftContent: (
        <WeatherCardLeft
          icon="wi-thermometer-exterior"
          text="The daily temperature"
        />
      ),
    },
    {
      id: 2,
      name: "Humidity",
      rightContent: (
        <p className="lg:self-end text-1xl flex items-end">{`${current.humidity}%`}</p>
      ),
      leftContent: (
        <WeatherCardLeft
          icon="wi-raindrop"
          text={`The dew point is ${current.dew_point}° right now`}
        />
      ),
    },
    {
      id: 3,
      name: "Wind Speed",
      rightContent: (
        <p className="lg:self-end text-1xl flex items-end">
          {current.wind_speed}m/s
        </p>
      ),
      leftContent: (
        <WeatherCardLeft icon="wi-windy" text="Air movement velocity." />
      ),
    },
    {
      id: 4,
      name: "Visibility",
      rightContent: (
        <p className="lg:self-end text-1xl flex items-end">
          {current.visibility}m/s
        </p>
      ),
      leftContent: (
        <WeatherCardLeft
          icon="wi-horizon"
          text="The distance you can see clearly."
        />
      ),
    },
    {
      id: 5,
      name: "Clouds",
      rightContent: (
        <p className="lg:self-end text-1xl flex items-end">{current.clouds}%</p>
      ),
      leftContent: (
        <WeatherCardLeft
          icon="wi-strong-wind"
          text="The current percentage of cloud cover."
        />
      ),
    },
  ];

  const allAlerts =
    data.message.alerts?.map((alert: IAlert) => ({
      title: alert.event,
      description: alert.description,
      start: convertUnixToLocalDateTime(alert.start, true),
      end: convertUnixToLocalDateTime(alert.end, true),
      event: alert.event,
    })) || [];

  const allDaily = daily.map((day: IDaily) => ({
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
    wind_speed: day.wind_speed,
  }));

  return {
    cards: weathercards,
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

// Helper components
const TempItem = ({ label, value }: { label: string; value: string }) => (
  <p className="lg:self-end text-1xl flex items-center">
    <span className="text-sm">{label}:</span>&nbsp;
    {value}
    <span className="text-sm">°F</span>
  </p>
);

const WeatherCardLeft = ({ icon, text }: { icon: string; text: string }) => (
  <p className="text-sm lg:w-1/2 opacity-40" style={{ paddingLeft: "3px" }}>
    <i className={`wi wi-primary-color ${icon}`}></i>
    <br />
    {text}
  </p>
);

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
    <div className="pb-2.5">
      <div className="grid grid-cols-2 gap-2 pb-2.5">
        <div>
          <div className="relative z-10 flex flex-col left-0 top-[10%] lg:top-[calc(6.5rem-6rem)] w-24 shadow-2xl rounded-e-[2.5rem] h-40 lg:h-48 currentLight text-light">
            <div className="flex-1 p-2 shadow-md currentDark grid place-content-center rounded-e-[2.5rem] rounded-bl-lg">
              <div className="flex items-center flex-col currentHighlights">
                <div className="text-2xl text-[2.5rem]">
                  <i
                    className={`wi wi-primary-color wi-main ${icon}`}
                    aria-hidden="true"
                  ></i>
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
        <div className="relative w-[47vh] -left-[210px] top-[50px]">
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

      <ExpandableSection
        title="Daily"
        isExpanded={dailyExpanded}
        onToggle={toggleDailyExpanded}
      >
        <Daily daily={daily} />
      </ExpandableSection>

      <ExpandableSection
        title="Alerts"
        count={alerts.length}
        isExpanded={alertsExpanded}
        onToggle={toggleAlertsExpanded}
      >
        <Alerts alerts={alerts} />
      </ExpandableSection>
    </div>
  );
};

export default memo(WeatherWidget);