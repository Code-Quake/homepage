import React from "react";
import Links from "../modules/Links/Links";
import Image from "next/image";
import Clock from "../modules/Clock/Clock";
import MyWorkWidget from "@/modules/MyWork/MyWork";
import DailyText from "@/modules/DailyText/DailyText";
import GithubStats from "@/modules/GithubStats/GithubStats";
import Meetings from "@/modules/Meetings/Meetings";
import { News } from "@/modules/News/News";
import WavyBackground from "@/modules/ui/WavyBackground";
import CodeStatsWidget from "@/modules/CodeStats/CodeStatsChart";
//import Weather from "@/modules/Weather/Weather";
import dynamic from "next/dynamic";
import Greeting from "@/modules/Greeting/Greeting";

import RandomScripture from "@/modules/RandomScripture/RandomScripture";

const Weather = dynamic(() => import("@/modules/Weather/Weather"), {
  ssr: false,
});

export default function Home() {
  return (
    <>
      <WavyBackground count={60} />
      <main className="z-[1] relative pr-2 pl-2 mt-0 pt-0">
        <header className="flex justify-between items-center content-start">
          <Greeting />
          <RandomScripture />
        </header>
        <div className="grid grid-cols-4 grid-rows-1 gap-x-2 gap-y-2">
          <div className="mainTile">
            <GithubStats />
          </div>
          <div className="mainTile">
            <MyWorkWidget />
          </div>
          <div className="mainTile">
            <CodeStatsWidget />
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
          </div>
          <div className="mainTile">
            <Meetings />
          </div>
          <div className="mainTile" suppressHydrationWarning>
            <Clock />
            <Weather />
          </div>
          <div className="mainTile">
            <News />
          </div>
        </div>
      </main>
    </>
  );
}
