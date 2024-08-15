import React from "react";
import { IShowDaily } from "./WeatherInterfaces";
import { iconMappings } from "@/utils/WeatherIconMappings";

const DailyPopupContent: React.FC<{ daily: IShowDaily }> = React.memo(
  ({ daily }) => (
    <div>
      <i
        className={`wi wi-main ${
          iconMappings[daily.icon as keyof typeof iconMappings] ||
          iconMappings.default
        } text-[var(--primary-fuchsia)]`}
      ></i>
      <span className="wi-primary-color"> {daily.fullSummary}</span>
      <div className="grid mt-5 grid-cols-2 gap-x-2 gap-y-2">
        <InfoItem label="Feels like" value={daily.feels_like} />
        <InfoItem label="Max Temp" value={daily.temp_max} />
        <InfoItem label="Sunrise" value={daily.sunrise} />
        <InfoItem label="Sunset" value={daily.sunset} />
        <InfoItem label="Humidity" value={`${daily.humidity}%`} />
        <InfoItem label="Clouds" value={daily.clouds} />
        <InfoItem label="Wind" value={daily.wind_speed} />
      </div>
    </div>
  )
);

DailyPopupContent.displayName = "PopupContent";

const InfoItem: React.FC<{ label: string; value: string | number }> =
  React.memo(({ label, value }) => (
    <div>
      <span className="text-[var(--primary-fuchsia)]">{label}: </span>
      <span className="wi-primary-color">{value}</span>
    </div>
  ));

InfoItem.displayName = "InfoItem";

export default DailyPopupContent;
