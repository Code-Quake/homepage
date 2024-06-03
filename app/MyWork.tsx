"use client";
import React, { useEffect, useState } from "react";
import parse from "html-react-parser";

interface IWorkItem {
  id: number;
  title: string;
  url: string;
  description: string;
  color: string;
}

const allWorkItems: IWorkItem[] = [];

export const MyWorkWidget = () => {
  const [workItems, setWorkItems] = useState<IWorkItem[]>([]);

  const overlay = document.getElementById("overlay");
  function closePopup(id: any) {
    overlay!.style.display = "none";
    document.getElementById(id)!.style.display = "none";
  }

  function popupDialog(id: any) {
    overlay!.style.display = "block";
    document.getElementById(id)!.style.display = "block";
  }

  const apiUrl = "https://dev.azure.com/uhaul/U-Haul%20IT/_apis/wit/wiql/%7B3772faaa-ed72-44d9-90ac-2067d20937e5%7D?api-version=7.1-preview.2";
  
  useEffect(() => {
    async function fetchData() {
      const rawResponse = await fetch(apiUrl, {
        headers: {
          Authorization:
            "Basic am9zZXBoX2pvcmRlbkB1aGF1bC5jb206aGNpd2tydTJ3d2Uybnhycnh5aDZ3Y2p2bTdobHhsd2VqdXFhbHUyZmhsM2psZmpkNGV2YQ==",
          Accept: "application/json, text/plain, */*",
          "Content-type": "application/json; charset=UTF-8",
        },
      });

      const content = await rawResponse.json();

      let html = "";

      for (let workItem of content.workItems) {
        let workitemUrl =
          "https://dev.azure.com/uhaul/U-Haul%20IT/_apis/wit/workitems/" +
          workItem.id +
          "?api-version=7.1-preview.3";

        const wiResponse = await fetch(workitemUrl, {
          headers: {
            Authorization:
              "Basic am9zZXBoX2pvcmRlbkB1aGF1bC5jb206aGNpd2tydTJ3d2Uybnhycnh5aDZ3Y2p2bTdobHhsd2VqdXFhbHUyZmhsM2psZmpkNGV2YQ==",
            Accept: "application/json, text/plain, */*",
            "Content-type": "application/json; charset=UTF-8",
          },
        });

        const wiContent = await wiResponse.json();

        let color = "#4682B4";
        if (wiContent.fields["System.State"] == "Active") color = "#00A36C";

        let wi: IWorkItem = {
          id: workItem.id,
          title: wiContent.fields["System.Title"],
          url: wiContent._links["html"]["href"],
          description:
            wiContent.fields["Microsoft.VSTS.Common.ItemDescription"],
          color: color,
        };

        allWorkItems.find((item) => item.id === wi.id)
          ? undefined
          : allWorkItems.push(wi);
      }
      setWorkItems(allWorkItems);
    }
    fetchData();
  }, [workItems])

  return (
    <>
      {workItems.map((wi) => {
        return (
          <div key={wi.id}>
            <div className="workItem">
              <a target="new" style={{ color: wi.color }} href={wi.url}>
                {wi.title}
              </a>
              &nbsp;
              <button
                onClick={() => popupDialog(wi.id)}
                id={"btn" + wi.id.toString()}
              >
                ...
              </button>
            </div>
            <div className="popup" id={wi.id.toString()}>
              <div className="popupcontrols">
                <button
                  className="popupclose"
                  onClick={() => closePopup(wi.id)}
                >
                  X
                </button>
              </div>
              <div className="popupcontent">
                <h1>{wi.id}</h1>
                {parse(wi.description)}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default MyWorkWidget;
