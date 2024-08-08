import React from "react";
import Links from "../modules/Links/Links";
import ClientComponent from "../modules/CodeStats/CodeStats";
import Image from "next/image";
import Clock from "../modules/Clock/Clock";
import MyWorkComponent from "../modules/MyWork/MyWorkSSR";
import WeatherComponent from "../modules/Weather/WeatherSSR";
import DailyText from "@/modules/DailyText/DailyText";
import GithubStats from "@/modules/GithubStats/GithubStats";
import Meetings from "@/modules/Meetings/Meetings";
import { News } from "@/modules/News/News";
import WavyBackground from "@/modules/ui/WavyBackground";

export default function Home() {
  return (
    <>
      <WavyBackground count={60} />
      <main style={{ zIndex: 1, position: "relative", paddingRight: "8px", paddingLeft: "8px" }}>
        <header>
          <div className="page-titles">
            <Image
              src="https://avatars.githubusercontent.com/u/5692870?v=4"
              alt="Logo"
              className="site-logo relative"
              height={325}
              width={325}
            />
            <div>
              <h1 className="gradientHeader">CodeQuake</h1>
              <span className="subtitle">Good morrow, oh chosen one</span>
            </div>
          </div>
        </header>
        <div
          className="grid grid-cols-4 grid-rows-1 gap-x-2 gap-y-2"
        >
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
          className="grid grid-cols-4 grid-rows-1 gap-x-2 gap-y-2"
          style={{
            minHeight: "525px",
            marginTop: "10px",
          }}
        >
          <div className="mainTile">
            <DailyText />
            {/* <Tabs tabs={tabs} /> */}
          </div>
          <div className="mainTile">
            <Meetings />
          </div>
          <div className="mainTile">
            <Clock />
            <WeatherComponent />
          </div>
          <div className="mainTile">
            <News />
          </div>
        </div>
      </main>
    </>
  );
}
