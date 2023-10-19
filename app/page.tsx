"use client";

import dynamic from "next/dynamic";
const Canvas = dynamic(() => import("./Canvas"), { ssr: false });

export default function Home() {
  return (
    <div className="w-full h-[600px] bg-[url(/shirt.png)] bg-no-repeat bg-center">
      <Canvas />
    </div>
  );
}
