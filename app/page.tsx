import React, { useMemo } from "react";
import Links from "../modules/Links/Links";
import ClientComponent from "../modules/CodeStats/CodeStats";
import Image from "next/image";
import SystemInfoWidget from "../modules/SystemInfo/SystemInfo";
import Clock from "../modules/Clock/Clock";
import MyWorkComponent from "../modules/MyWork/MyWorkSSR";
import WeatherComponent from "../modules/Weather/WeatherSSR";
import DailyText from "@/modules/DailyText/DailyText";
import GithubStats from "@/modules/GithubStats/GithubStats";
import NewsWidget from "@/modules/News/News";
import Meetings from "@/Meetings/Meetings";
import { Tabs } from "@/modules/ui/AnimatedTabs";
import { News2 } from "@/modules/News/News2";

interface TabData {
  title: string;
  value: string;
  content: React.ReactElement
}

const tabData: TabData[] = [
  { title: "Daily Text", value: "text", content: <DailyText /> },
  { title: "Meetings", value: "meetings", content: <Meetings/> },
];


export default function Home() {
const tabs = useMemo(
  () =>
    tabData.map((tab) => ({
      title: tab.title,
      value: tab.value,
      content: tab.content,
    })),
  []
);

return (
    <main>
      <div id="overlay"></div>
      <header>
        <div className="page-titles">
          <Image
            src="https://avatars.githubusercontent.com/u/5692870?v=4"
            alt="Logo"
            className="site-logo"
            height={325}
            width={325}
          />
          <div className="text">
            <h1>CodeQuake</h1>
            <span className="subtitle">Good morrow, oh chosen one</span>
          </div>
        </div>
      </header>
      <div className="grid grid-cols-4 grid-rows-1 gap-x-2 gap-y-2">
        <div className="mainTile">
          <GithubStats />
        </div>
        <div className="mainTile">
          <MyWorkComponent />
        </div>
        <div className="mainTile">
          <ClientComponent />
        </div>
        <div className="mainTile">
          <Links />
        </div>
      </div>
      <div
        className="grid grid-cols-4 grid-rows-1 gap-x-2 gap-y-2" style={{minHeight: "525px", marginTop: "10px"}}
      >
        <div className="mainTileBottom">
          <Tabs tabs={tabs} />
        </div>
        <div className="mainTile">
          <Clock />
          <WeatherComponent />
        </div>
        <div className="mainTile">
          <News2 />
          {/* <NewsWidget /> */}
        </div>
        <div className="mainTile">
          <SystemInfoWidget />
        </div>
      </div>
    </main>
  );
}
