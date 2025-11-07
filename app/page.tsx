"use client";
import Terminal from "@/components/Terminal";
import { banner } from "@/lib/utils";
import "../styles/index.css";

export default function Home() {
    const getBanner = banner();

    return <Terminal banner={getBanner} />;
}
