"use client";

import dynamic from "next/dynamic";

const MiamiScene = dynamic(() => import("./MiamiScene"), { ssr: false });

export default function MiamiSceneLoader() {
  return <MiamiScene />;
}
