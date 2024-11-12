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
            <iframe
              className="pl-2 pt-2 rounded-xl"
              width="610"
              height="590"
              src="https://kasm.codequake.local/#/session/4d9d7d02e1e64aee93e1e60c45db0270"
              allow="autoplay; microphone; camera; clipboard-read; clipboard-write; window-management;"
            ></iframe>
            {/* <GithubStats /> */}
          </div>
          <div className="mainTile">
            <iframe
              className="pl-2 pt-2 rounded-xl"
              width="610"
              height="590"
              src="https://kasm.codequake.local/#/session/4caf7e29-267e-4bdd-b829-697b61c6f19e"
              allow="autoplay; microphone; camera; clipboard-read; clipboard-write; window-management;"
            ></iframe>
          </div>
          <div className="mainTile">
            <MyWorkWidget />
            {/* <CodeStatsWidget /> */}
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
