"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import ImageDisplay from "../ui/ImageDisplay";

const greetings = {
  morning: [
    "A blessed forenoon my liege",
    "Good morrow, oh chosen one",
    "I bid thee good morning",
    "Morning! Did the bed monster hold you hostage again?",
    "Morning! Remember, your bed will miss you all day.",
    "Wake up! Your teddy bear said you were snoring too loud.",
    "Good morning! Just a reminder: napping is a sport.",
    "Your Majesty, I wish you a splendid and prosperous morning.",
    "Esteemed sovereign, may the morning sun shine favorably upon your reign.",
    "Your Royal Highness I humbly extend good morning tidings.",
  ],
  afternoon: [
    "Look who survived the morning!",
    "Rise and shine… Oh wait, you already did.",
    "Noontide salutations my liege.",
    "Did someone say, nap time?",
    "The hour or greatness is upon you.",
    "Glory to you, and your house.",
    "You're halfway there, don't implode yet.",
  ],
  evening: [
    "Another day done, so why are you here reading this?",
    "Go to bed already.",
    "Nothing good comes of being at the computer this late.",
    "Morning! Did the bed monster hold you hostage again?",
    "Rest in peace. I mean, rest peacefully.",
    "Don't let the bedbugs bite, there are literally thousands of them.",
  ],
};

const getRandomGreeting = (greetings: string[]) => 
  greetings[Math.floor(Math.random() * greetings.length)];

const Greeting: React.FC = () => {
  const [greeting, setGreeting] = useState<string>("");

  useEffect(() => {
    const currentHour = new Date().getHours();
    if (currentHour >= 5 && currentHour < 12) {
      setGreeting(getRandomGreeting(greetings.morning));
    } else if (currentHour >= 12 && currentHour < 18) {
      setGreeting(getRandomGreeting(greetings.afternoon));
    } else {
      setGreeting(getRandomGreeting(greetings.evening));
    }
  }, []);

  return (
    <div className="z-1 flex flex-wrap flex-row items-center">
      <ImageDisplay
        imgSrc="/Logo.png"
        title="logo"
        width="w-[3.5rem]"
        height="h-14"
        imgClasses="object-cover object-top"
        divClasses="my-0.5 mr-2 ml-0"
      />
      <div>
        <div className="bg-gradient-to-b from-[var(--primary-dark)] to-[var(--primary-fuchsia)] font-verdana bg-clip-text text-transparent font-medium text-[2.4rem]">
          CodeQuake
        </div>
        <span className="bg-gradient-to-b from-[var(--primary-dark)] to-[var(--primary-fuchsia)] font-verdana bg-clip-text text-transparent text-lg italic">
          {greeting}
        </span>
      </div>
    </div>
  );
};

export default Greeting;