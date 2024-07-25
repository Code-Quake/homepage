"use client";
import parse from "html-react-parser";
import { IWorkItem } from "./MyWorkInterfaces";
import React, { useEffect, useId, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/hooks/useOutsideClick";

const API_BASE_URL = "https://dev.azure.com/uhaul/U-Haul%20IT/_apis/wit";
const API_VERSION = "api-version=7.1-preview.2";
const AUTH_HEADER =
  "Basic am9zZXBoX2pvcmRlbkB1aGF1bC5jb206aGNpd2tydTJ3d2Uybnhycnh5aDZ3Y2p2bTdobHhsd2VqdXFhbHUyZmhsM2psZmpkNGV2YQ==";

const headers = {
  Authorization: AUTH_HEADER,
  Accept: "application/json",
  "Content-Type": "application/json; charset=UTF-8",
};

const MyWorkWidget: React.FC = () => {
  const [workItems, setWorkItems] = useState<IWorkItem[]>([]);

  const fetchWorkItem = useCallback(async (id: string): Promise<IWorkItem> => {
    const response = await fetch(
      `${API_BASE_URL}/workitems/${id}?${API_VERSION}`,
      { headers }
    );
    const data = await response.json();

    return {
      id: data.id,
      title: data.fields["System.Title"],
      description: data.fields["Microsoft.VSTS.Common.ItemDescription"],
      content: data.fields["Microsoft.VSTS.Common.ItemDescription"],
      src: data._links.html.href,
      state: data.fields["System.State"],
      remainingWork: data.fields["Microsoft.VSTS.Scheduling.RemainingWork"] ?? "unknown",
      ctaText: "Azure",
      ctaLink: data._links.html.href,
    };
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

      setWorkItems(newWorkItems);
    } catch (error) {
      console.error("Error fetching work items:", error);
    }
  }, [fetchWorkItem]);

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
    <div
      style={{ height: "600px", overflow: "scroll" }}
      className="border border-slate-800 m-2 rounded-lg newsscroll"
    >
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
          <div className="fixed inset-0  grid place-items-center z-[100]">
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
              className="w-[42rem] max-w-[42rem]  h-full md:h-fit md:max-h-[90%]  flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl z-10"
            >
              <div className="grid grid-rows-1 grid-cols-3">
                <div className="flex justify-between items-start p-4">
                  <motion.a
                    layoutId={`button-${active.id}-${id}`}
                    href={active.ctaLink}
                    target="_blank"
                    className="px-1 py-1 text-sm rounded-full relative bg-gradient-to-r from-indigo-500 to-purple-500 mt-4 md:mt-0 ml-1"
                  >
                    <div className="px-8 py-2 bg-black rounded-full relative group transition duration-200 text-white hover:bg-transparent w-[80px] flex justify-center">
                      {active.id}
                    </div>
                  </motion.a>
                </div>
                <div className=" flex justify-center items-center text-blue-700">
                  State: {active.state}
                </div>
                <div className=" flex justify-center items-center text-blue-700">
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
                    className="text-neutral-600 text-xs md:text-sm lg:text-base pb-10 flex flex-col items-start gap-4 overflow-auto dark:text-neutral-400 [mask:linear-gradient(to_bottom,white,white,transparent)] h-[50rem] w-[40rem] [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]"
                  >
                    {parse(active.content)}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      <ul className="max-w-2xl mx-auto w-full gap-4">
        {workItems.map((card, index) => (
          <motion.div
            layoutId={`card-${card.id}-${id}`}
            key={`card-${card.id}-${id}`}
            onClick={() => setActive(card)}
            className="p-4 flex flex-col md:flex-row justify-between items-center hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer"
          >
            <div className="flex gap-4 flex-col md:flex-row ">
              <div className="">
                <motion.h3
                  layoutId={`title-${card.id}-${id}`}
                  className="font-medium text-neutral-800 dark:text-neutral-200 text-center md:text-left text-sm"
                >
                  {card.title}
                </motion.h3>
                <motion.div
                  layoutId={`description-${card.description}-${id}`}
                  className="text-sm text-blue-700"
                >
                  <div>State: {card.state}</div>
                  <div> Remaining Work: {card.remainingWork}</div>
                </motion.div>
              </div>
            </div>
            <motion.button
              layoutId={`button-${card.id}-${id}`}
              className="px-1 py-1 text-sm rounded-full relative bg-gradient-to-r from-indigo-500 to-purple-500  mt-4 md:mt-0"
            >
              <div className="px-8 py-2 bg-black rounded-full relative group transition duration-200 text-white hover:bg-transparent w-[80px] flex justify-center">
                {card.id}
              </div>
            </motion.button>
          </motion.div>
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

