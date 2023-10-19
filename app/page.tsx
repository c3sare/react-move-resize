"use client";

import dynamic from "next/dynamic";
const Konva = dynamic(() => import("./Canvas"), { ssr: false });

export default function Home() {
  return <Konva />;
}
