/* eslint-disable @next/next/no-img-element */
import { memo } from "react";
import ImageDisplay from "../ui/ImageDisplay";

const GithubStats = (): JSX.Element => {
  return (
    <div className="p-3 relative">
      <ImageDisplay
        imgSrc="https://github-readme-stats.vercel.app/api?username=code-quake&amp;theme=holi&amp;show_icons=true&amp;locale=en&amp;hide_border=true&amp;card_width=467"
        title="Profile Card"
        width="w-[467px]"
        height="h-[195px]"
        divClasses="border-gray-800 border-solid border-1 box-border mb-2 rounded-lg"
        imgClasses="object-cover"
        unoptimized={true}
      />
      <ImageDisplay
        imgSrc="https://github-readme-stats.vercel.app/api/top-langs/?username=code-quake&amp;theme=holi&amp;show_icons=true&amp;locale=en&amp;layout=compact&amp;hide_border=true"
        title="Profile Card"
        width="w-[350px]"
        height="h-[165px]"
        divClasses="border-gray-800 border-solid border-1 box-border mb-2 rounded-lg"
        imgClasses="object-cover"
        unoptimized={true}
      />
      <ImageDisplay
        imgSrc="https://github-readme-stats.vercel.app/api/wakatime?username=codequake&amp;theme=holi&amp;show_icons=true&amp;locale=en&amp;layout=compact&amp;hide_border=true"
        title="Profile Card"
        width="w-[495px]"
        height="h-[165px]"
        divClasses="border-gray-800 border-solid border-1 box-border mb-2 rounded-lg"
        imgClasses="object-cover"
        unoptimized={true}
      />
    </div>
  );
};

export default memo(GithubStats);
