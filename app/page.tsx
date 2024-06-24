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
          <GithubStats/>
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
          <DailyText />
        </div>
        <div className="mainTile">
          <Clock />
          <WeatherComponent />
        </div>
        <div className="mainTile">
          <NewsWidget />
        </div>
        <div className="mainTile">
          <SystemInfoWidget />
        </div>
      </div>
    </main>
  );
}
