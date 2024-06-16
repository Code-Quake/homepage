/* eslint-disable @next/next/no-img-element */
import Links from "../modules/Links/Links";
import ClientComponent from "../modules/CodeStats/CodeStats";
import Image from "next/image";
import SystemInfoWidget from "../modules/SystemInfo/SystemInfo";
import Clock from "../modules/Clock/Clock";
import MyWorkComponent from "../modules/MyWork/MyWorkSSR";
import WeatherComponent from "../modules/Weather/WeatherSSR";
import { Div } from "@/modules/ui/MovingBorder";
import { cn } from "@/utils/cn";

export default function Home() {
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
          <Div
            borderRadius="1.75rem"
            className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800"
            style={{
              height: "195px",
              width: "467px",
            }}
          >
            <img
              src="https://github-readme-stats.vercel.app/api?username=code-quake&amp;theme=holi&amp;show_icons=true&amp;locale=en"
              alt="Profile Card"
            />
          </Div>
          <Div
            borderRadius="1.75rem"
            className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800"
            style={{
              height: "165px",
              width: "300px",
            }}
          >
            <img
              src="https://github-readme-stats.vercel.app/api/top-langs/?username=code-quake&amp;theme=holi&amp;show_icons=true&amp;locale=en&amp;layout=compact"
              alt="Languages Card"
            />
          </Div>
          <Div
            borderRadius="1.75rem"
            className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800"
            style={{
              height: "240px",
              width: "495px",
            }}
          >
            <img
              src="https://github-readme-stats.vercel.app/api/wakatime?username=codequake&amp;theme=holi&amp;show_icons=true&amp;locale=en&amp;layout=compact"
              alt="Languages Card"
            />
          </Div>
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
        style={{ marginTop: "10px" }}
      >
        <div className="mainTile">
          <iframe
            className="openspeeedtestframe"
            title="OpenSpeedTest"
            src="//openspeedtest.com/speedtest"
          ></iframe>
        </div>
        <div className="mainTile">
          <Clock />
          <WeatherComponent />
        </div>
        <div className="mainTile">
          <img
            src="https://codeium.com/profile/codequake/card.png"
            alt="Codeium Card"
            className="stats-card"
          />
        </div>
        <div className="mainTile">
          <SystemInfoWidget />
        </div>
      </div>
    </main>
  );
}
