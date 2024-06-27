"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import parse from "html-react-parser";
import Popup from "../Popup/Popup";
import { IWorkItem } from "./MyWorkInterfaces";
import { Div } from "../ui/MovingBorder";

const API_BASE_URL = "https://dev.azure.com/uhaul/U-Haul%20IT/_apis/wit";
const API_VERSION = "api-version=7.1-preview.2";
const AUTH_HEADER =
  "Basic am9zZXBoX2pvcmRlbkB1aGF1bC5jb206aGNpd2tydTJ3d2Uybnhycnh5aDZ3Y2p2bTdobHhsd2VqdXFhbHUyZmhsM2psZmpkNGV2YQ==";

const headers = {
  Authorization: AUTH_HEADER,
  Accept: "application/json",
  "Content-Type": "application/json; charset=UTF-8",
};

const MyWorkWidget: React.FC = () => {
  const [workItems, setWorkItems] = useState<IWorkItem[]>([]);

  const fetchWorkItem = useCallback(async (id: string): Promise<IWorkItem> => {
    const response = await fetch(
      `${API_BASE_URL}/workitems/${id}?${API_VERSION}`,
      { headers }
    );
    const data = await response.json();

    return {
      id: data.id,
      title: data.fields["System.Title"],
      url: data._links.html.href,
      description: data.fields["Microsoft.VSTS.Common.ItemDescription"],
      color: data.fields["System.State"] === "Active" ? "#00A36C" : "#4682B4",
    };
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/wiql/{3772faaa-ed72-44d9-90ac-2067d20937e5}?${API_VERSION}`,
        { headers }
      );
      const data = await response.json();

      const newWorkItems = await Promise.all(
        data.workItems.map((workItem: { id: string }) =>
          fetchWorkItem(workItem.id)
        )
      );

      setWorkItems(newWorkItems);
    } catch (error) {
      console.error("Error fetching work items:", error);
    }
  }, [fetchWorkItem]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const renderedWorkItems = useMemo(
    () =>
      workItems.map((wi) => (
        <Div
          key={wi.id}
          borderRadius="7px"
          className="bg-white dark:bg-[var(--dark-blue)] text-black dark:text-white border-neutral-200 dark:border-slate-800 w-full"
        >
          <Popup
            popupKey={wi.id.toString()}
            popupTitle={`Details for ${wi.title}`}
            color={wi.color}
            icon=""
          >
            {parse(wi.description)}
          </Popup>
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="mx-2.5"
            style={{ color: wi.color }}
            href={wi.url}
          >
            {wi.title}
          </a>
        </Div>
      )),
    [workItems]
  );

  return <div className="p-2.5">{renderedWorkItems}</div>;
};

export default React.memo(MyWorkWidget);
