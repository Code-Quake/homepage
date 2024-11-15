import React from "react";
import Links from "../modules/Links/Links";
import Clock from "../modules/Clock/Clock";
import MyWorkWidget from "@/modules/MyWork/MyWork";
import DailyText from "@/modules/DailyText/DailyText";
import GithubStats from "@/modules/GithubStats/GithubStats";
import Meetings from "@/modules/Meetings/Meetings";
import { News } from "@/modules/News/News";
import WavyBackground from "@/modules/ui/WavyBackground";
import CodeStatsWidget from "@/modules/CodeStats/CodeStatsChart";
import dynamic from "next/dynamic";
import Greeting from "@/modules/Greeting/Greeting";
import RandomScripture from "@/modules/RandomScripture/RandomScripture";
import FullscreenIframe from "@/modules/KASM/kasm";

const Weather = dynamic(() => import("@/modules/Weather/Weather"), {
  ssr: false,
});

export default function Home() {
  return (
    <>
      <WavyBackground count={60} />
      <main className="z-[1] relative pr-2 pl-2 mt-0 pt-0">
        <header className="flex justify-between items-center content-start mb-[0.2rem] mt-[0.1rem] ml-2 mr-2">
          <Greeting />
          <span className="hidden md:block">
            <RandomScripture />
          </span>
        </header>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(600px,1fr))] gap-1 justify-center">
          <div className="mainTile">
            <FullscreenIframe
              src="https://kasm.codequake.local/#/session/1d0c27e71cda4e8a98576fec348dfba4"
              width="610"
              height="590"
            />
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
          <div className="mainTile">
            <DailyText />
            <span className="md:hidden block mb-1 ml-1">
              <RandomScripture />
            </span>
          </div>
          <div className="mainTile">
            <Meetings />
          </div>
          <div className="mainTile">
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
