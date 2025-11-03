"use client";
import Terminal from "@/components/Terminal";
import { banner } from "@/lib/utils";
import { useEffect, useState } from "react";
import "../styles/index.css";

export default function Home() {
    const [hostname, setHostname] = useState("");
    const getBanner = banner();

    useEffect(() => {
        setHostname(window.location.hostname);
    }, []);

    const prompt = `guest@${hostname}:$~`;

    return (
        <Terminal
            banner={getBanner}
            welcomeMessage={"Type 'help' to see list of available commands. You can type a few letters and press [tab] to autocomplete."}
            terminalPrompt={prompt}
        />
    );
}
