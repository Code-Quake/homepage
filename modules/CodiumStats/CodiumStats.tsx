/* eslint-disable @next/next/no-img-element */
import { Div } from "@/modules/ui/MovingBorder";

const CodiumStats = (): JSX.Element => {
  return (
    <div className="githubGrid">
      <Div
        borderRadius="1.75rem"
        className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800"
        style={{
          height: "fit-content",
          width: "fit-content",
        }}
      >
        <img
          src="https://codeium.com/profile/codequake/card.png"
          alt="Codeium Card"
        />
      </Div>
    </div>
  );
};

export default CodiumStats;
