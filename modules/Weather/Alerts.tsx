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
import { IShowAlert } from "./WeatherInterfaces";

const Popup = dynamic(() => import("../Popup/Popup"));

type Props = {
  alerts: IShowAlert[];
  [x: string]: any;
};

export const Alerts: React.FC<Props> = (props: Props) => {
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
          {props.alerts.map(({ event, description, start, end }, key) => {
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

export default Alerts;
