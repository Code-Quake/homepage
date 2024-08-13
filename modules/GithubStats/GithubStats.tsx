/* eslint-disable @next/next/no-img-element */
import { memo } from "react";

const GithubStats = (): JSX.Element => {
  return (
    <div className="p-3 relative">
      <div className="border-gray-800 border-solid border-1 box-border h-max w-max mb-2 rounded-md">
        <img
          src="https://github-readme-stats.vercel.app/api?username=code-quake&amp;theme=holi&amp;show_icons=true&amp;locale=en&amp;hide_border=true"
          alt="Profile Card"
        />
      </div>
      <div className="border-gray-800 border-solid border-1 box-border h-max w-max mb-2 rounded-md">
        <img
          src="https://github-readme-stats.vercel.app/api/top-langs/?username=code-quake&amp;theme=holi&amp;show_icons=true&amp;locale=en&amp;layout=compact&amp;hide_border=true"
          alt="Languages Card"
        />
      </div>
      <div className="border-gray-800 border-solid border-1 box-border h-max w-max rounded-md">
        <img
          src="https://github-readme-stats.vercel.app/api/wakatime?username=codequake&amp;theme=holi&amp;show_icons=true&amp;locale=en&amp;layout=compact&amp;hide_border=true"
          alt="Languages Card"
        />
      </div>
    </div>
  );
};

export default memo(GithubStats);
