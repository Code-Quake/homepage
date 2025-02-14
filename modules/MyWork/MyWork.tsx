"use client";
import parse from "html-react-parser";
import { IWorkItem } from "./MyWorkInterfaces";
import React, { useEffect, useId, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import styles from "./MyWork.module.css";
import nextBase64 from "next-base64";

const API_BASE_URL = "https://dev.azure.com/uhaul/U-Haul%20IT/_apis/wit";
const API_VERSION = "api-version=7.1";

const API_BASE_URL_PR =
  "https://dev.azure.com/uhaul/PaymentSystem/_apis/git/pullrequests";

const AUTH_HEADER = `Basic ${base64Encode(
  "joseph_jorden@uhaul.com:1ze3qEIBydgqCd2lIGQCtSwYmSZWjznKCJ2iPaZxQrJ0MFNVrI27JQQJ99BAACAAAAAShJ9yAAASAZDOh1Km"
)}`;

const headers = {
  Authorization: AUTH_HEADER,
  Accept: "application/json",
  "Content-Type": "application/json; charset=UTF-8",
};

function base64Encode(input: string): string {
  // Check if we're in a browser environment
  if (typeof window !== "undefined" && window.btoa) {
    // Use the built-in btoa function if available
    return window.btoa(input);
  } else {
    // For Node.js or environments without btoa
    return Buffer.from(input).toString("base64");
  }
}

const MyWorkWidget: React.FC = () => {
  const [workItems, setWorkItems] = useState<IWorkItem[]>([]);

  const removeBackgroundColorStyles = (input: string): string => {
    // Regular expression to match background-color styles
    const backgroundColorRegex = /background-color\s*:\s*[^;]+;?/gi;
    // Replace matched background-color styles with an empty string
    return input.replaceAll(backgroundColorRegex, "");
  };

  const fetchWorkItem = useCallback(async (id: string): Promise<IWorkItem> => {
    const response = await fetch(
      `${API_BASE_URL}/workitems/${id}?${API_VERSION}`,
      { headers }
    );
    const data = await response.json();

    const content = data.fields?.["Microsoft.VSTS.Common.ItemDescription"]
      ? removeBackgroundColorStyles(
          data.fields["Microsoft.VSTS.Common.ItemDescription"]
        )
      : removeBackgroundColorStyles(
          data.fields["Microsoft.VSTS.Release.ReleaseInstructions"]
        );

    return {
      id: data.id,
      title: data.fields["System.Title"],
      description: content,
      content: content,
      src: data._links.html.href,
      state: data.fields["System.State"],
      remainingWork:
        data.fields["Microsoft.VSTS.Scheduling.RemainingWork"] ?? "unknown",
      ctaText: "Azure",
      ctaLink: data._links.html.href,
      workItemType: data.fields["System.WorkItemType"],
    };
  }, []);

  //TODO: add who is left to approve
  const fetchPR = useCallback(async (): Promise<IWorkItem[]> => {
    const response = await fetch(
      `${API_BASE_URL_PR}/?${API_VERSION}&searchCriteria.creatorId=308cf943-2f3b-63af-a732-5d99027a8627&searchCriteria.status=active`,
      { headers }
    );
    const data = await response.json();

    const newWorkItems = data.value.map((pr: any) => {
      return {
        id: pr.pullRequestId,
        title: pr.title,
        description: pr.description,
        content: pr.description,
        src: pr.url
          .replace("apis/", "")
          .replace("repositories/", "")
          .replace("git", "_git")
          .replace("pullRequests", "pullRequest"),
        state: pr.status,
        remainingWork: "unknown",
        ctaText: "Azure",
        ctaLink: pr.url
          .replace("_apis/", "")
          .replace("repositories/", "")
          .replace("git", "_git")
          .replace("pullRequests", "pullRequest"),
        workItemType: "Pull Request",
      };
    });

    return newWorkItems;
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/wiql/{3772faaa-ed72-44d9-90ac-2067d20937e5}?${API_VERSION}`,
        { headers }
      );
      const data = await response.json();

      const newWorkItems = await Promise.all(
        data.workItems.map((workItem: { id: string }) =>
          fetchWorkItem(workItem.id)
        )
      );

      const prItems = await fetchPR();

      setWorkItems([...newWorkItems,...prItems]);
    } catch (error) {
      console.error("Error fetching work items:", error);
    }
  }, [fetchWorkItem, fetchPR]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  const [active, setActive] = useState<
    (typeof workItems)[number] | boolean | null
  >(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  return (
    <div className="displayWorkItems myWorkState relative h-[600px] pt-2 overflow-auto [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]">
      <input
        className="tgl tgl-skewed"
        id="cbActive"
        type="checkbox"
        defaultChecked
      />
      <label
        className="tgl-btn"
        data-tg-off="Active"
        data-tg-on="Active"
        htmlFor="cbActive"
      ></label>
      <input className="tgl tgl-skewed" id="cbNotStarted" type="checkbox" />
      <label
        className="tgl-btn"
        data-tg-off="Not Started"
        data-tg-on="Not Started"
        htmlFor="cbNotStarted"
      ></label>
      <input className="tgl tgl-skewed" id="cbUnknown" type="checkbox" />
      <label
        className="tgl-btn"
        data-tg-off="Unknown"
        data-tg-on="Unknown"
        htmlFor="cbUnknown"
      ></label>
      <input className="tgl tgl-skewed" id="cbOnHold" type="checkbox" />
      <label
        className="tgl-btn"
        data-tg-off="On Hold"
        data-tg-on="On Hold"
        htmlFor="cbOnHold"
      ></label>
      <input className="tgl tgl-skewed" id="cbTesting" type="checkbox" />
      <label
        className="tgl-btn"
        data-tg-off="Testing"
        data-tg-on="Testing"
        htmlFor="cbTesting"
      ></label>
      <input
        className="switch"
        type="checkbox"
        id="cbWorkItems"
        name="cbWorkItems"
        value="private"
      />
      <label htmlFor="cbWorkItems">
        <span className="switch-x-text">Work Items </span>
        <span className="switch-x-toggletext">
          <span className="switch-x-unchecked">
            <span className="switch-x-hiddenlabel">Unchecked: </span>👎
          </span>
          <span className="switch-x-checked">
            <span className="switch-x-hiddenlabel">Checked: </span>👍
          </span>
        </span>
      </label>

      <div
        className="ml-4 mt-5 text-lg text-[var(--primary-fuchsia)] hidden"
        id="stateNotSelected"
      >
        Select a state above
      </div>
      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && typeof active === "object" ? (
          <div className="fixed inset-0 grid place-items-center z-[100]">
            <motion.button
              key={`button-${active.id}-${id}`}
              layout
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
                transition: {
                  duration: 0.05,
                },
              }}
              className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              layoutId={`card-${active.id}-${id}`}
              ref={ref}
              className={`w-[42rem] max-w-[42rem] h-full md:h-fit md:max-h-[90%] flex flex-col sm:rounded-3xl z-10 ${styles.glassWork}`}
            >
              <div className="grid grid-rows-1 grid-cols-3">
                <div className="flex justify-between items-start p-4">
                  <motion.a
                    layoutId={`button-${active.id}-${id}`}
                    href={active.ctaLink}
                    target="_blank"
                    className="px-[0.1rem] py-[0.1rem] text-sm rounded-full relative bg-gradient-to-r from-[var(--primary-dark)] to-[var(--primary-fuchsia)] mt-4 md:mt-0 ml-1"
                  >
                    <div className="px-8 py-2 bg-black rounded-full relative group transition duration-200 text-white hover:bg-transparent w-[80px] flex justify-center">
                      {active.id}
                    </div>
                  </motion.a>
                </div>
                <div className="flex justify-center items-center text-[var(--primary-dark)]">
                  State: {active.state}
                </div>
                <div className="flex justify-center items-center text-[var(--primary-dark)]">
                  Remaining Work: {active.remainingWork}
                </div>
              </div>
              <div>
                <div className="pt-4 relative px-4">
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-[var(--primary-dark)] text-xs md:text-sm lg:text-base pb-2 flex flex-col items-start gap-4 overflow-auto dark:text-[var(--primary-dark)] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]"
                  >
                    {parse(active.title)}
                  </motion.div>
                </div>
                <div className="pt-4 relative px-4">
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-neutral-600 text-xs md:text-sm lg:text-base pb-10 flex flex-col items-start gap-4 overflow-auto dark:text-neutral-400  h-[50rem] w-[40rem] [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]"
                  >
                    {parse(active.content)}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      <ul className="mx-auto w-full pr-2 pl-2">
        {workItems.map((card, index) => (
          <React.Fragment key={index}>
            <motion.div
              layoutId={`card-${card.id}-${id}`}
              key={`card-${card.id}-${id}`}
              onClick={() => setActive(card)}
              className={`p-4 mr-3 flex flex-col md:flex-row justify-between items-center hover:bg-neutral-50 dark:hover:bg-gray-950 dark:hover:bg-opacity-20 cursor-pointer w-full  dark:hover:brightness-150 ${
                "state" + card.state.replaceAll(" ", "")
              } ${"type" + card.workItemType.replaceAll(" ", "")}`}
            >
              <div className="flex gap-4 flex-col md:flex-row">
                <div>
                  <motion.h3
                    layoutId={`title-${card.id}-${id}`}
                    className="font-medium text-neutral-800 dark:text-[var(--primary-dark)] text-center md:text-left text-sm"
                  >
                    {card.title}
                  </motion.h3>
                  <motion.div
                    layoutId={`description-${card.description}-${id}`}
                    className="text-sm text-[var(--primary)]"
                  >
                    <div className="flex flex-row">
                      <div>State: {card.state}</div>
                      <div className="pl-2">
                        {card.workItemType === "Pull Request" && "🚂"}
                        {card.workItemType === "Work Request" && "📋"}
                        {card.workItemType === "Task" && "💻"}
                        {card.workItemType === "Bug" && "🐞"}
                      </div>
                    </div>
                    <div> Remaining Work: {card.remainingWork}</div>
                  </motion.div>
                </div>
              </div>
              <motion.a
                href={card.ctaLink}
                target="_blank"
                rel="noopener noreferrer"
                layoutId={`button-${card.id}-${id}`}
                className="px-[0.1rem] py-[0.1rem] text-sm rounded-full relative bg-gradient-to-r from-[var(--primary-dark)] to-[var(--primary-fuchsia)]  mt-4 md:mt-0 inline-block"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <div className="px-8 py-2 bg-black rounded-full relative group transition duration-200 text-white hover:bg-transparent w-[80px] flex justify-center">
                  {card.id}
                </div>
              </motion.a>
            </motion.div>
            <hr
              className={`h-px bg-gray-200 border-0 dark:bg-gray-800 ${
                "state" + card.state.replaceAll(" ", "")
              } ${"type" + card.workItemType.replaceAll(" ", "")}`}
              key={index}
            />
          </React.Fragment>
        ))}
      </ul>
    </div>
  );
};

export default React.memo(MyWorkWidget);

const CloseIcon = () => {
  return (
    <motion.svg
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.05,
        },
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};
