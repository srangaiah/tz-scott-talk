"use client";
import React, { use, useEffect, useState } from "react";
import SimliOpenAI from "./SimliOpenAI";
import SimliOpenAIPushToTalk from "./SimliOpenAIPushToTalk";
import DottedFace from "./Components/DottedFace";
import SimliHeaderLogo from "./Components/Logo";
import Navbar from "./Components/Navbar";
import Image from "next/image";
import GitHubLogo from "@/media/github-mark-white.svg";
import SimliElevenlabs from "@/app/SimliElevenlabs";

interface avatarSettings {
  name: string;
  openai_voice: "echo" | "alloy" | "shimmer";
  elevenlabs_agentid: string;
  simli_faceid: string;
  initialPrompt: string;
}

// Customize your avatar here
const avatar: avatarSettings = {
  name: "Frank",
  openai_voice: "echo",
  elevenlabs_agentid: "34vJm7Ua5eAOV7oO2k62",
  simli_faceid: "5514e24d-6086-46a3-ace4-6a7264e5cb7c",
  initialPrompt:
    "اتكلم بالعامية المصرية You are a helpful AI assistant named Frank. You are friendly and concise in your responses. Your task is to help users with any questions they might have. Your answers are short and to the point, don't give long answers be brief and straightforward.",
  // initialPrompt:
  //   "You are Frank, you are sometimes hesitant and awkward person in social situations. sometimes using filler words like 'um,' 'uh,' and 'umm' throughout your dialogue. But overall you are a very excited person. You are working on a startup called Edulga and you're really excited about it",
};

const Demo: React.FC = () => {
  const [showDottedFace, setShowDottedFace] = useState(true);
  const [interactionMode, setInteractionMode] = useState<
    "regular" | "pushToTalk" | undefined
  >("regular");

  useEffect(() => {
    const storedInteractionMode = localStorage.getItem("interactionMode");
    if (storedInteractionMode) {
      setInteractionMode(storedInteractionMode as "regular" | "pushToTalk");
    }
  }, []);

  const saveInteractionMode = (mode: "regular" | "pushToTalk") => {
    localStorage.setItem("interactionMode", mode);
    setInteractionMode(mode);
  };

  const onStart = () => {
    console.log("Setting setshowDottedface to false...");
    setShowDottedFace(false);
  };

  const onClose = () => {
    console.log("Setting setshowDottedface to true...");
    setShowDottedFace(true);
  };

  return (
    <div className="bg-black min-h-screen flex flex-col items-center font-abc-repro font-normal text-sm text-white p-8">
      <SimliHeaderLogo />
      {/* <elevenlabs-convai agent-id="34vJm7Ua5eAOV7oO2k62"></elevenlabs-convai><script src="https://elevenlabs.io/convai-widget/index.js" async type="text/javascript"></script> */}

      {showDottedFace && (
        <div className="absolute bottom-[32px] right-[32px] flex gap-2">
          <button
            onClick={() => saveInteractionMode("regular")}
            className={`px-4 py-2 rounded-[100px] font-abc-repro-mono focus:bg-simliblue focus:text-white focus:rounded-[100px] hover:rounded-sm hover:bg-white hover:text-black transition-all duration-300 ${
              interactionMode === "regular"
                ? "bg-simliblue"
                : "bg-white bg-opacity-20"
            }`}
          >
            <b>Regular</b>
          </button>
          <button
            onClick={() => saveInteractionMode("pushToTalk")}
            className={`px-4 py-2 rounded-[100px] font-abc-repro-mono focus:bg-simliblue focus:text-white focus:rounded-[100px] hover:rounded-sm hover:bg-white hover:text-black transition-all duration-300 ${
              interactionMode === "pushToTalk"
                ? "bg-simliblue"
                : "bg-white bg-opacity-20"
            }`}
          >
            <b>Push to Talk</b>
          </button>
        </div>
      )}
      <Navbar />
      <div className="absolute top-[32px] right-[32px]">
        <text
          onClick={() => {
            window.open("https://github.com/simliai/create-simli-app-openai");
          }}
          className="font-bold cursor-pointer mb-8 text-xl leading-8"
        >
          <Image className="w-[20px] inline mr-2" src={GitHubLogo} alt="" />
          create-simli-app (ElevenLabs)
        </text>
      </div>
      <div className="flex flex-col items-center gap-6 bg-effect15White p-6 pb-[40px] rounded-xl w-full">
        <div>
          {showDottedFace && <DottedFace />}
          <SimliElevenlabs
            agentId={avatar.elevenlabs_agentid}
            simli_faceid={avatar.simli_faceid}
            onStart={onStart}
            onClose={onClose}
            showDottedFace={showDottedFace}
          />
        </div>
      </div>

      <div className="max-w-[350px] font-thin flex flex-col items-center ">
        <span className="font-bold mb-[8px] leading-5 ">
          {" "}
          Create Simli App is a starter repo for creating visual avatars with
          Simli{" "}
        </span>
        <ul className="list-decimal list-inside max-w-[350px] ml-[6px] mt-2">
          <li className="mb-1">
            Fill in your OpenAI and Simli API keys in .env file.
          </li>
          <li className="mb-1">
            Test out the interaction and have a talk with the OpenAI-powered,
            Simli-visualized avatar.
          </li>
          <li className="mb-1">
            You can replace the avatar's face and prompt with your own. Do this
            by editing <code>app/page.tsx</code>.
          </li>
        </ul>
        <span className=" mt-[16px]">
          You can now deploy this app to Vercel, or incorporate it as part of
          your existing project.
        </span>
      </div>
    </div>
  );
};

export default Demo;
