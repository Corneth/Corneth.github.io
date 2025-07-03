import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export default function Terminal({ onClose, isOverlay = false, onNavigate }) {
    const [terminalOutput, setTerminalOutput] = useState([]);
    const [currentCommand, setCurrentCommand] = useState('');
    const [commandHistory, setCommandHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const inputRef = useRef(null);
    const outputRef = useRef(null);

    useEffect(() => {
        const bootSequence = [
            { text: "NEURAL TERMINAL v3.7.1 ONLINE", delay: 300, color: "text-green-400" },
            { text: "Type 'help' for available commands", delay: 500, color: "text-gray-400" }
        ];

        let index = 0;
        let timeouts = [];
        let isMounted = true;

        const executeBootSequence = () => {
            if (index < bootSequence.length && isMounted) {
                const line = bootSequence[index];
                setTerminalOutput(prev => {
                    // Check if this line already exists to prevent duplicates
                    const exists = prev.some(item => item.text === line.text);
                    if (!exists) {
                        return [...prev, { ...line, id: Date.now() + index }];
                    }
                    return prev;
                });
                index++;

                if (index < bootSequence.length) {
                    const timeout = setTimeout(executeBootSequence, line.delay);
                    timeouts.push(timeout);
                }
            }
        };

        // Only start boot sequence if terminal is empty
        if (terminalOutput.length === 0) {
            executeBootSequence();
        }

        return () => {
            isMounted = false;
            timeouts.forEach(timeout => clearTimeout(timeout));
        };
    }, []); // Keep empty dependency array but add proper cleanup

    // Auto-scroll to bottom when new output is added
    useEffect(() => {
        if (outputRef.current) {
            outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }
    }, [terminalOutput]);

    const commands = {
        help: () => [
            "AVAILABLE NEURAL PATHWAYS:",
            "─────────────────────────",
            "home       - Return to main interface",
            "web        - Web development projects",
            "ai         - AI and machine learning lab",
            "mobile     - Mobile development cluster",
            "blog       - Latest articles and insights",
            "about      - Personal information",
            "contact    - Contact information",
            "projects   - All projects overview",
            "clear      - Clear terminal output",
            "exit       - Close terminal"
        ],
        home: () => {
            if (onNavigate) onNavigate('/');
            if (isOverlay) onClose();
            return ["NAVIGATING TO HOME...", "NEURAL LINK ESTABLISHED"];
        },
        web: () => {
            if (onNavigate) onNavigate('/web');
            if (isOverlay) onClose();
            return ["ACCESSING WEB DEVELOPMENT...", "FRONTEND SYSTEMS ONLINE"];
        },
        ai: () => {
            if (onNavigate) onNavigate('/ai');
            if (isOverlay) onClose();
            return ["ENTERING AI RESEARCH LAB...", "NEURAL NETWORKS ACTIVATED"];
        },
        mobile: () => {
            if (onNavigate) onNavigate('/mobile');
            if (isOverlay) onClose();
            return ["CONNECTING TO MOBILE CLUSTER...", "DEVICES SYNCHRONIZED"];
        },
        blog: () => {
            if (onNavigate) onNavigate('/blog');
            if (isOverlay) onClose();
            return ["LOADING BLOG INTERFACE...", "ARTICLES RETRIEVED"];
        },
        about: () => {
            if (onNavigate) onNavigate('/about');
            if (isOverlay) onClose();
            return ["ACCESSING PERSONAL DATABASE...", "PROFILE LOADED"];
        },
        contact: () => {
            if (onNavigate) onNavigate('/contact');
            if (isOverlay) onClose();
            return ["OPENING COMMUNICATION CHANNELS...", "READY TO CONNECT"];
        },
        projects: () => {
            if (onNavigate) onNavigate('/projects');
            if (isOverlay) onClose();
            return ["LOADING ALL PROJECTS...", "DATABASE ACCESSED"];
        },
        clear: () => {
            setTerminalOutput([]);
            return [];
        },
        exit: () => {
            if (isOverlay && onClose) {
                onClose();
            }
            return ["CLOSING NEURAL TERMINAL..."];
        }
    };

    const handleCommand = (cmd) => {
        const result = commands[cmd.toLowerCase()];
        if (result) {
            const output = result();
            output.forEach((line, index) => {
                setTimeout(() => {
                    setTerminalOutput(prev => [...prev, {
                        text: line,
                        color: "text-green-400",
                        id: Date.now() + index
                    }]);
                }, index * 100);
            });
        } else {
            setTerminalOutput(prev => [...prev, {
                text: `ERROR: Command '${cmd}' not recognized. Type 'help' for available commands.`,
                color: "text-red-400",
                id: Date.now()
            }]);
        }
    };

    const executeCommand = () => {
        if (!currentCommand.trim()) return;

        // Add to history
        setCommandHistory(prev => [currentCommand, ...prev].slice(0, 50)); // Keep last 50 commands
        setHistoryIndex(-1);

        setTerminalOutput(prev => [...prev, {
            text: `> ${currentCommand}`,
            color: "text-cyan-400",
            id: Date.now()
        }]);

        handleCommand(currentCommand);
        setCurrentCommand('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            executeCommand();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
                const newIndex = historyIndex + 1;
                setHistoryIndex(newIndex);
                setCurrentCommand(commandHistory[newIndex]);
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex > 0) {
                const newIndex = historyIndex - 1;
                setHistoryIndex(newIndex);
                setCurrentCommand(commandHistory[newIndex]);
            } else if (historyIndex === 0) {
                setHistoryIndex(-1);
                setCurrentCommand('');
            }
        } else if (e.key === 'Tab') {
            e.preventDefault();
            // Basic tab completion
            if (currentCommand) {
                const availableCommands = Object.keys(commands);
                const matches = availableCommands.filter(cmd =>
                    cmd.startsWith(currentCommand.toLowerCase())
                );
                if (matches.length === 1) {
                    setCurrentCommand(matches[0]);
                }
            }
        }
    };

    const terminalClasses = isOverlay
        ? "fixed inset-4 z-50 bg-black/95 backdrop-blur-sm flex flex-col"
        : "w-full h-full flex flex-col";

    return (
        <div className={`${terminalClasses} border border-green-500/50 rounded-lg overflow-hidden shadow-2xl shadow-green-500/20`}>
            {/* Terminal Header */}
            <div className="bg-gray-900/90 px-4 py-2 border-b border-green-500/30 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <span className="text-green-400 font-mono text-sm">NEURAL_TERMINAL</span>
                </div>
                {isOverlay && (
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-red-400 transition-colors"
                        aria-label="Close terminal"
                    >
                        <X size={20} />
                    </button>
                )}
            </div>

            {/* Terminal Content - This will now fill the remaining space */}
            <div className="flex flex-col flex-1 min-h-0">
                {/* Output Area */}
                <div
                    ref={outputRef}
                    className="flex-1 p-4 font-mono text-sm overflow-y-auto"
                    onClick={() => inputRef.current?.focus()}
                >
                    {terminalOutput.map((line) => (
                        <div key={line.id} className={`${line.color} mb-1 whitespace-pre-wrap`}>
                            {line.text}
                        </div>
                    ))}
                </div>

                {/* Input Area */}
                <div className="p-4 pt-0 flex-shrink-0">
                    <div className="flex items-center">
                        <span className="text-green-400 mr-2 flex-shrink-0">root@portfolio:~$</span>
                        <input
                            ref={inputRef}
                            type="text"
                            value={currentCommand}
                            onChange={(e) => setCurrentCommand(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="bg-transparent text-green-400 outline-none flex-1 min-w-0"
                            placeholder="Type a command..."
                            autoFocus
                        />
                        <div className="w-2 h-4 bg-green-400 animate-pulse ml-1 flex-shrink-0"></div>
                    </div>
                </div>
            </div>

            {/* CRT Effect Overlay */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,transparent_50%,rgba(0,255,0,0.03)_50%,transparent_100%)]"
                     style={{ backgroundSize: '100% 4px' }}>
                </div>
                <div className="absolute inset-0 bg-green-500/5 animate-pulse"
                     style={{ animation: 'flicker 10s infinite' }}>
                </div>
            </div>

            <style>{`
                @keyframes flicker {
                    0%, 100% { opacity: 0.05; }
                    50% { opacity: 0.02; }
                }
            `}</style>
        </div>
    );
}