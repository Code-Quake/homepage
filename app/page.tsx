/* eslint-disable @next/next/no-img-element */
import Links from "./Links";
import {ClientComponent} from "./CodeStats";
import Image from "next/image";

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
      <div className="grid grid-cols-4 gap-4 grid-rows-2">
        <div className="box box_purple_first">
          <img
            src="https://github-readme-stats.vercel.app/api?username=code-quake&amp;title_color=ff00ff&amp;text_color=5cabca&amp;icon_color=ff00ff&amp;bg_color=151B54&amp;border_radius=5&amp;locale=en&amp;count_private=true&amp;show_icons=true&amp;hide_border=true"
            alt="Profile Card"
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
        <div className="box box_purple_first">
          <iframe
            className="openspeeedtestframe"
            title="OpenSpeedTest"
            src="//openspeedtest.com/speedtest"
          ></iframe>
        </div>
      </div>
    </main>
  );
}
