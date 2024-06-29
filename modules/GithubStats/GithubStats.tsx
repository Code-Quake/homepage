/* eslint-disable @next/next/no-img-element */
import { Div } from "@/modules/ui/MovingBorder";
import { memo } from "react";

const GithubStats = (): JSX.Element => {
  return (
    <div className="githubGrid">
      <Div
        borderRadius="5px"
        className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800"
        style={{
          height: "fit-content",
          width: "fit-content",
        }}
      >
        <img
          src="https://github-readme-stats.vercel.app/api?username=code-quake&amp;theme=holi&amp;show_icons=true&amp;locale=en&amp;hide_border=true"
          alt="Profile Card"
        />
      </Div>
      <Div
        borderRadius="5px"
        className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800"
        style={{
          height: "fit-content",
          width: "fit-content",
        }}
      >
        <img
          src="https://github-readme-stats.vercel.app/api/top-langs/?username=code-quake&amp;theme=holi&amp;show_icons=true&amp;locale=en&amp;layout=compact&amp;hide_border=true"
          alt="Languages Card"
        />
      </Div>
      <Div
        borderRadius="5px"
        className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800"
        style={{
          height: "fit-content",
          width: "fit-content",
        }}
      >
        <img
          src="https://github-readme-stats.vercel.app/api/wakatime?username=codequake&amp;theme=holi&amp;show_icons=true&amp;locale=en&amp;layout=compact&amp;hide_border=true"
          alt="Languages Card"
        />
      </Div>
    </div>
  );
};

export default memo(GithubStats);
