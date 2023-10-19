"use client";

import bgImage from "@/public/bg.png";

import dynamic from "next/dynamic";
const Canvas = dynamic(() => import("./Canvas"), { ssr: false });

export default function Home() {
  return (
    <div
      className="w-full h-[600px] bg-no-repeat bg-center"
      style={{ backgroundImage: `url(${bgImage.src})` }}
    >
      <Canvas />
    </div>
  );
}
