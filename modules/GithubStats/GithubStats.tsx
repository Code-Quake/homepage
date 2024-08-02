/* eslint-disable @next/next/no-img-element */
import { memo } from "react";

const GithubStats = (): JSX.Element => {
  return (
    <div className="p-3">
      <div className="githubCard">
        <img
          src="https://github-readme-stats.vercel.app/api?username=code-quake&amp;theme=holi&amp;show_icons=true&amp;locale=en&amp;hide_border=true"
          alt="Profile Card"
        />
      </div>
      <div className="githubCard">
        <img
          src="https://github-readme-stats.vercel.app/api/top-langs/?username=code-quake&amp;theme=holi&amp;show_icons=true&amp;locale=en&amp;layout=compact&amp;hide_border=true"
          alt="Languages Card"
        />
      </div>
      <div className="githubCard">
        <img
          src="https://github-readme-stats.vercel.app/api/wakatime?username=codequake&amp;theme=holi&amp;show_icons=true&amp;locale=en&amp;layout=compact&amp;hide_border=true"
          alt="Languages Card"
        />
      </div>
    </div>
  );
};

export default memo(GithubStats);
