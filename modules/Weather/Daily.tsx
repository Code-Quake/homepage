import dynamic from "next/dynamic";
import React, { useMemo } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { iconMappings } from "@/utils/WeatherIconMappings";
import { DailyProps } from "./WeatherInterfaces";
import DailyPopupContent from "./DailyPopupContent";

const Popup = dynamic(() => import("../Popup/Popup"), { ssr: false });

export const Daily: React.FC<DailyProps> = ({ daily }) => {
  const tableRows = useMemo(
    () =>
      daily.map((dailyItem, key) => {
        const dailyKey = `daily${key}`;
        return (
          <TableRow key={dailyKey}>
            <TableCell>
              <Popup
                popupKey={dailyKey}
                popupTitle={`Daily for ${dailyItem.date}`}
                color="#990066"
                icon={`wi wi-main ${
                  iconMappings[dailyItem.icon as keyof typeof iconMappings] ||
                  iconMappings.default
                }`}
              >
                <DailyPopupContent daily={dailyItem} />
              </Popup>
            </TableCell>
            <TableCell>{dailyItem.date}</TableCell>
            <TableCell>{dailyItem.temp_max}</TableCell>
            <TableCell>{dailyItem.summary}</TableCell>
          </TableRow>
        );
      }),
    [daily]
  );

  return (
    <div className="px-2.5">
      <Table
        classNames={{
          wrapper: "bg-content-cq",
        }}
        color="primary"
        selectionMode="single"
        defaultSelectedKeys={["2"]}
        aria-label="Daily weather forecast table"
      >
        <TableHeader>
          <TableColumn>Type</TableColumn>
          <TableColumn>Date</TableColumn>
          <TableColumn>Max Temp</TableColumn>
          <TableColumn>Summary</TableColumn>
        </TableHeader>
        <TableBody>{tableRows}</TableBody>
      </Table>
    </div>
  );
};

export default React.memo(Daily);
