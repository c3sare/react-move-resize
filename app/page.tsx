"use client";

import dynamic from "next/dynamic";
const Konva = dynamic(() => import("./Konva"), { ssr: false });

export default function Home() {
  return <Konva />;
}
