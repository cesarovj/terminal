"use client";
import React, { useState, useEffect, JSX } from "react";
import Output from "./Output";
import Input from "./Input";
import Message from "./Message";
import config from "../config.json";

const downloadFile = (uri: string, downloadName: string) => {
    const link = document.createElement("a");
    link.download = downloadName;
    link.href = uri;
    link.click();
    link.remove();
};

type TerminalProps = {
    terminalPrompt?: string;
    banner?: string;
    welcomeMessage?: string;
};
const Terminal = (props: TerminalProps) => {
    const { terminalPrompt = ">", banner, welcomeMessage } = props;
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
        "projects",
        "contact",
        "socials",
        "skills",
    ] as const;
    type EchoCommand = (typeof echoCommands)[number];
    const utilityCommands = ["clear", "all", "resume"] as const;
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

    const glow = (text: string) => {
        return <span className="terminal-glow">{text}</span>;
    };

    const commands: { [key in EchoCommand]: JSX.Element } = {
        help: (
            <>
                <ul>
                    <li>
                        <span>about</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        about me
                    </li>
                    <li>
                        <span>projects</span>&nbsp;&nbsp;
                        Some cool stuff ive made
                    </li>
                    <li>
                        <span>skills</span>&nbsp;&nbsp;&nbsp;&nbsp;
                        Attributes ive unlocked
                    </li>
                    <li>
                        <span>socials</span>&nbsp;&nbsp;&nbsp;
                        Dont stalk me
                    </li>
                    <li>
                        <span>resume</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                       Check out my resume
                    </li>
                    <li>
                        <span>contact</span>&nbsp;&nbsp;&nbsp;
                        Spam is yummy
                    </li>
                    <li>
                        <span>clear</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        Clear terminal
                    </li>
                </ul>

            </>
        ),
        about: (
            <>
                <div className="terminal-heading">Intro</div>
                <p>
                    Hey there!
                </p>

                <div className="terminal-heading">Motivation</div>
                <p>

                </p>

                <div className="terminal-heading">Education</div>
                <p>

                </p>

                <div className="terminal-heading">Experience</div>
                <p>

                </p>

                <span>
                    My previous formal work experience includes:
                    <ul>
                        <li>

                        </li>


                    </ul>
                </span>
            </>
        ),
        projects: (
            <>
            </>
        ),
        contact: (
            <>
                <ul>
                    <li>
                        Email{" "}
                        <a href={`mailto:${config.social.email}`}>
                            {config.social.email}
                        </a>
                    </li>
                </ul>
            </>
        ),

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
            <>
            </>
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
                <span className="terminal-prompt">{terminalPrompt}</span>{" "}
                <span>{input}</span>
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
                    {/* <ErrorMessage command={inputCommand} /> */}
                    <div className="terminal-error-group">
                        <span className="terminal-error">
                            {`command not found: ${inputCommand}.`}
                        </span>
                        <span>{`Type 'help' to view a list of available commands`}</span>
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
                    setOutput([...output, commandRecord]);
                    downloadFile(
                        "resume.pdf",
                        "Cesar Villalvir - Resume.pdf"
                    );
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
                    <span className="terminal-prompt">{terminalPrompt}</span>{" "}
                    <span>{input}</span>
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
                {banner && <div className="terminal-banner">{banner}</div>}
                {welcomeMessage && (
                    <Message message={welcomeMessage} inputRef={inputRef} />
                )}
                <Output outputs={output} />
                <Input
                    setOutput={setOutput}
                    processCommand={processCommand}
                    getHistory={getHistory}
                    getAutocomplete={getAutocomplete}
                    inputRef={inputRef}
                    terminalPrompt={terminalPrompt}
                />
            </div>
        </div>
    );
};

export default Terminal;
