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

export default Daily;
