import dynamic from "next/dynamic";
import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { IShowDaily } from "./WeatherInterfaces";
import { iconMappings } from "@/utils/WeatherIconMappings";

const Popup = dynamic(() => import("../Popup/Popup"));

type Props = {
  daily: IShowDaily[];
  [x: string]: any;
};

export const Daily: React.FC<Props> = (props: Props) => {
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
          {props.daily.map((daily, key) => {
            const dailyKey = "daily" + key;
            return (
              <TableRow key={dailyKey}>
                <TableCell>
                  <Popup
                    popupKey={dailyKey}
                    popupTitle={`Daily for ${daily.date}`}
                    color={"#990066"}
                    icon={`wi wi-main ${
                      iconMappings[daily.icon as keyof typeof iconMappings] ||
                      iconMappings.default
                    }`}
                  >
                    {
                      <div>
                        <i
                          className={`wi wi-main ${
                            iconMappings[
                              daily.icon as keyof typeof iconMappings
                            ] || iconMappings.default
                          } todayDescription`}
                        ></i>
                        <span className="wi-primary-color">
                          {" "}
                          {daily.fullSummary}
                        </span>
                        <div className="grid mt-5 grid-cols-2 gap-x-2 gap-y-2">
                          <div>
                            <span className="todayDescription">
                              Feels like:{" "}
                            </span>
                            <span className="wi-primary-color">
                              {daily.feels_like}
                            </span>
                          </div>
                          <div>
                            <span className="todayDescription">Max Temp: </span>
                            <span className="wi-primary-color">
                              {daily.temp_max}
                            </span>
                          </div>
                          <div>
                            <span className="todayDescription">Sunrise: </span>
                            <span className="wi-primary-color">
                              {daily.sunrise}
                            </span>
                          </div>
                          <div>
                            <span className="todayDescription">Sunset: </span>
                            <span className="wi-primary-color">
                              {daily.sunset}
                            </span>
                          </div>
                          <div>
                            <span className="todayDescription">Humidity: </span>
                            <span className="wi-primary-color">
                              {daily.humidity}%
                            </span>
                          </div>
                          <div>
                            <span className="todayDescription">Clouds: </span>
                            <span className="wi-primary-color">
                              {daily.clouds}
                            </span>
                          </div>
                          <div>
                            <span className="todayDescription">Wind: </span>
                            <span className="wi-primary-color">
                              {daily.wind_speed}
                            </span>
                          </div>
                          <div></div>
                        </div>
                      </div>
                    }
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

export default Daily;
