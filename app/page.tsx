/* eslint-disable @next/next/no-img-element */
import Links from "./Links";
import {ClientComponent} from "./CodeStats";
import Image from "next/image";
import WeatherWidget from "./Weather";
import SystemInfoWidget from "./SystemInfo";
import Clock from "./Clock";
import {MyWorkComponent}  from "./MyWorkSSR";

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
      <div className="grid grid-cols-4 gap-4 grid-rows-1">
        <div style={{background: "#000000", padding: "10px"}}>
          <img
            src="https://github-readme-stats.vercel.app/api?username=code-quake&amp;theme=holi&amp;show_icons=true&amp;locale=en"
            alt="Profile Card"
            className="stats-card"
          />
          <img
            src="https://github-readme-stats.vercel.app/api/top-langs/?username=code-quake&amp;theme=holi&amp;show_icons=true&amp;locale=en&amp;layout=compact"
            alt="Languages Card"
            className="stats-card"
          />
          <img
            src="https://github-readme-stats.vercel.app/api/wakatime?username=codequake&amp;theme=holi&amp;show_icons=true&amp;locale=en&amp;layout=compact"
            alt="Languages Card"
            className="stats-card"
          />
        </div>
        <div style={{background: "#000000", padding: "10px"}}>
          <MyWorkComponent />
        </div>
        <div style={{background: "#000000", padding: "10px"}}>
          <ClientComponent />
        </div>
        <div style={{background: "#000000", padding: "10px"}}>
          <Links />
        </div>
      </div>
      <br />
      <div className="grid grid-cols-4 gap-4 grid-rows-1">
        <div style={{background: "#000000", padding: "10px"}}>
          <iframe
            className="openspeeedtestframe"
            title="OpenSpeedTest"
            src="//openspeedtest.com/speedtest"
          ></iframe>
        </div>
        <div style={{background: "#000000", padding: "10px"}}>
          <Clock />
          <WeatherWidget />
        </div>
        <div style={{background: "#000000", padding: "10px"}}>
          <img
            src="https://codeium.com/profile/codequake/card.png"
            alt="Codeium Card"
            className="stats-card"
          />
        </div>
        <div style={{background: "#000000", padding: "10px"}}>
          <SystemInfoWidget />
        </div>
      </div>
    </main>
  );
}
