/* eslint-disable @next/next/no-img-element */
import Links from "./Links";
import {ClientComponent} from "./CodeStats";
import Image from "next/image";
import WeatherWidget from "./Weather";
import SystemInfoWidget from "./SystemInfo";

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
        <div className="box box_purple_first">
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
        <div className="box box_purple_first" id="content"></div>
        <div className="box box_purple_first">
          <ClientComponent />
        </div>
        <div className="box box_purple_first">
          <Links />
        </div>
      </div>
      <br />
      <div className="grid grid-cols-4 gap-4 grid-rows-1">
        <div className="box box_purple_first">
          <iframe
            className="openspeeedtestframe"
            title="OpenSpeedTest"
            src="//openspeedtest.com/speedtest"
          ></iframe>
        </div>
        <div className="box box_purple_first">
          <WeatherWidget />
        </div>
        <div className="box box_purple_first">
          <img
            src="https://codeium.com/profile/codequake/card.png"
            alt="Codeium Card"
            className="stats-card"
          />
        </div>
        <div className="box box_purple_first">
          <SystemInfoWidget/>
        </div>
      </div>
    </main>
  );
}
