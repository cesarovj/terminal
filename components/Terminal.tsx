"use client";
import React, { useState, useEffect, JSX } from "react";
import Output from "./Output";
import Input from "./Input";
import Message from "./Message";
import config from "../config.json";
import Ps1 from "./Prompt";
import { downloadFile, email } from "@/lib/utils";

type TerminalProps = {
    banner?: string;
};
const Terminal = (props: TerminalProps) => {
    const { banner } = props;
    const [output, setOutput] = useState<(string | JSX.Element)[]>([]);
    const [history, setHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(3);
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const scrollRef = React.useRef<HTMLDivElement | null>(null);

    const scrollLastCommandTop = () => {
        scrollRef.current?.scrollIntoView();
    };

    useEffect(scrollLastCommandTop, [output]);

    const echoCommands = [
        "help",
        "about",
        // "projects",
        "socials",
        "skills",
    ] as const;
    type EchoCommand = (typeof echoCommands)[number];
    const utilityCommands = ["clear", "email", "resume"] as const;
    type UtilityCommand = (typeof utilityCommands)[number];
    const allCommands = [...echoCommands, ...utilityCommands] as const;
    type Command = (typeof allCommands)[number];

    function isEchoCommand(arg: string): arg is EchoCommand {
        return (echoCommands as ReadonlyArray<string>).includes(arg);
    }

    function isUtilityCommand(arg: string): arg is UtilityCommand {
        return (utilityCommands as ReadonlyArray<string>).includes(arg);
    }

    function isValidCommand(arg: string): arg is Command {
        return isEchoCommand(arg) || isUtilityCommand(arg);
    }

    const commands: { [key in EchoCommand]: JSX.Element } = {
        help: (
            <>
                <ul>
                    <li>
                        <span>about</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; About
                        me
                    </li>
                    {/* <li>
                        <span>projects</span>&nbsp;&nbsp; Some cool stuff ive
                        worked on
                    </li> */}
                    <li>
                        <span>skills</span>&nbsp;&nbsp;&nbsp;&nbsp; Attributes
                        ive unlocked
                    </li>
                    <li>
                        <span>socials</span>&nbsp;&nbsp;&nbsp; Dont stalk me
                    </li>
                    <li>
                        <span>resume</span>&nbsp;&nbsp;&nbsp;&nbsp; Check out my
                        resume
                    </li>
                    <li>
                        <span>email</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Here
                        comes the spam
                    </li>
                    <li>
                        <span>clear</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Clear
                        terminal
                    </li>
                </ul>
            </>
        ),
        about: (
            <>
                <div className="terminal-glow">Intro</div>
                <p>Hello there! (Star Wars - iykyk) I thrive in fast-paced environments and am known for being adaptable, proactive, and collaborative. Whether I’m debugging complex issues, working alongside designers, or mentoring peers, I bring patience, curiosity, and a positive attitude to every challenge. Outside of work, I enjoy staying active through soccer and boxing, exploring new places through travel, and indulging my passion as a food connoisseur. These interests keep me energized, open-minded, and always ready for the next adventure—both in life and in my career.</p>

                <div className="terminal-glow">Motivation</div>
                <p>
                    I’m driven by the process — learning new technologies, optimizing code for performance, and understanding how small details can elevate the user experience. Not having a computer science degree has motivated me to demonstrate that strong technical skills and impactful product development come from dedication and continuous learning, not just formal education.
                </p>

                <div className="terminal-glow">Experience</div>
                <p>
                    I have worked across diverse domains including gaming,
                    blockchain, and developer tooling. I am proficient across
                    the full stack, with primary expertise in frontend
                    development, API integration, and scalable system design.
                    Most recently, I contributed to the development of a digital
                    gaming platform at Pixel Vault, where I built systems that
                    supported over $10M in token exchanges and daily
                    transactional volumes exceeding $250K.
                    <br /><br />
                    My experience spans both agile, fast-paced startup
                    environments and structured product teams, where I’ve
                    collaborated closely with engineers, designers, and product
                    managers to deliver impactful user experiences. I have
                    played a key role in modernizing codebases, implementing
                    decentralized applications, and driving improvements in
                    maintainability and performance. Having worked on
                    early-stage projects, I understand how to balance technical
                    excellence with rapid iteration to support growth and
                    evolving business goals.
                </p>
            </>
        ),
        // projects: <></>,
        socials: (
            <>
                <ul>
                    <li>
                        <span>GitHub</span>&nbsp;&nbsp;&nbsp;&nbsp;
                        <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href={`https://github.com/${config.social.github}`}
                        >
                            {config.social.github}
                        </a>
                    </li>
                    <li>
                        <span>Linkedin</span>&nbsp;&nbsp;
                        <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href={`https://www.linkedin.com/in/${config.social.linkedin}/`}
                        >
                            {config.social.linkedin}
                        </a>
                    </li>
                    <li>
                        <span>MySpace</span>&nbsp;&nbsp; lol imagine
                    </li>
                </ul>
            </>
        ),
        skills: (
            <ul>
                <li>
                    <span>Programming Languages:</span>
                    &nbsp;&nbsp; JavaScript, TypeScript
                </li>
                <li>
                    <span>Frontend:</span>&nbsp;&nbsp; React, Next.js, HTML5,
                    CSS3
                </li>
                <li>
                    <span>Backend:</span>&nbsp;&nbsp; Node.js, MongoDB, Express,
                    GraphQL, NestJS
                </li>
                <li>
                    <span>Tools & Technologies:</span>&nbsp;&nbsp; Git, WAGMI,
                    RESTful APIs, Agile
                </li>
                <li>
                    <span>Additional:</span>&nbsp;&nbsp; Microsoft Office Suite,
                    Bilingual (English/Spanish)
                </li>
            </ul>
        ),
    };

    const processCommand = (input: string) => {
        // Store a record of this command with a ref to allow us to scroll it into view.
        // Note: We use a ref callback here because setting the ref directly, then clearing output seems to set the ref to null.
        const commandRecord = (
            <div
                ref={(el) => {
                    scrollRef.current = el;
                }}
                className="terminal-command-record"
            >
                <Ps1 /> <span className="">{input}</span>
            </div>
        );

        // Add command to to history if the command is not empty
        if (input.trim()) {
            setHistory([...history, input]);
            setHistoryIndex(history.length + 1);
        }

        // Now process command, ignoring case
        const inputCommand = input.toLowerCase();
        if (!isValidCommand(inputCommand)) {
            setOutput([
                ...output,
                commandRecord,
                <div className="terminal-command-output">
                    <div className="terminal-error-group">
                        <span className="terminal-error">
                            {`command not found: ${inputCommand}.`}
                        </span>
                        <span>
                            Type <span className="terminal-glow">'help'</span>{" "}
                            to view a list of available commands
                        </span>
                    </div>
                </div>,
            ]);
        } else if (isEchoCommand(inputCommand)) {
            setOutput([
                ...output,
                commandRecord,
                <div className="terminal-command-output">
                    {commands[inputCommand]}
                </div>,
            ]);
        } else if (isUtilityCommand(inputCommand)) {
            switch (inputCommand) {
                case "clear": {
                    setOutput([]);
                    break;
                }
                case "resume": {
                    setOutput([
                        ...output,
                        commandRecord,
                        <ul style={{ padding: "10px 10px 10px 0px" }}>
                            <li>
                                Downloading:
                                <a
                                    onClick={() =>
                                        downloadFile(
                                            "resume.pdf",
                                            "Cesar Villalvir - Resume.pdf"
                                        )
                                    }
                                >
                                    Cesar Villalvir - Resume.pdf
                                </a>
                                ...
                            </li>
                        </ul>,
                    ]);
                    downloadFile("resume.pdf", "Cesar Villalvir - Resume.pdf");
                    break;
                }
                case "email": {
                    setOutput([
                        ...output,
                        commandRecord,
                        <ul style={{ padding: "10px 10px 10px 0px" }}>
                            <li>
                                Opening mailto:
                                <a href={`mailto:${config.social.email}`}>
                                    {config.social.email}
                                </a>
                                ...
                            </li>
                        </ul>,
                    ]);
                    email(config.social.email);
                    break;
                }
            }
        }
    };

    const getHistory = (direction: "up" | "down") => {
        let updatedIndex;
        if (direction === "up") {
            updatedIndex = historyIndex === 0 ? 0 : historyIndex - 1;
        } else {
            updatedIndex =
                historyIndex === history.length
                    ? history.length
                    : historyIndex + 1;
        }
        setHistoryIndex(updatedIndex);
        return updatedIndex === history.length ? "" : history[updatedIndex];
    };

    const getAutocomplete = (input: string) => {
        const matchingCommands = allCommands.filter((c) => c.startsWith(input));
        if (matchingCommands.length === 1) {
            return matchingCommands[0];
        } else {
            const commandRecord = (
                <div
                    ref={(el) => {
                        scrollRef.current = el;
                    }}
                    className="terminal-command-record"
                >
                    <Ps1 /> <span>{input}</span>
                </div>
            );
            setOutput([
                ...output,
                commandRecord,
                matchingCommands.join("    "),
            ]);
            return input;
        }
    };

    const focusOnInput = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "Tab") {
            // Prevent tab from moving focus
            event.preventDefault();
        }
        inputRef.current?.focus();
    };

    return (
        <div
            className="terminal-container"
            tabIndex={-1}
            onKeyDown={focusOnInput}
        >
            <div className="terminal-content">
                {banner && output && (
                    <>
                        <div className="terminal-banner">{banner}</div>
                        <Message inputRef={inputRef} />
                    </>
                )}
                <Output outputs={output} />
                <Input
                    setOutput={setOutput}
                    processCommand={processCommand}
                    getHistory={getHistory}
                    getAutocomplete={getAutocomplete}
                    inputRef={inputRef}
                />
            </div>
        </div>
    );
};

export default Terminal;
