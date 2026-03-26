import React, {
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useState,
} from 'react';
import {
    ChatPanel as SharedChatPanel,
    type ChatPanelMessage,
} from '@kingly/ui/components';

type StudioSidebar = 'chat' | 'components' | 'files' | 'layers';

export interface ChatPanelRef {
    handleEditElement: (element: Element | { tagName?: string; className?: string }, instruction?: string) => void;
}

export interface ChatPanelProps {
    isBridgeReady?: boolean;
    isDaemonConnected?: boolean;
    workspacePath?: string | null;
    onGetCanvasState?: () => unknown;
    onWorkspaceChange?: (path: string | null) => void;
    onToggleSidebar?: (sidebar: StudioSidebar) => void;
    activeSidebar?: StudioSidebar;
    className?: string;
}

function makeMessage(role: ChatPanelMessage['role'], content: string): ChatPanelMessage {
    return {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        role,
        content,
        timestamp: new Date(),
    };
}

function buildEditPrompt(
    element: Element | { tagName?: string; className?: string },
    instruction?: string,
): string {
    const tagName = 'tagName' in element ? element.tagName?.toLowerCase() ?? 'element' : 'element';
    const className = 'className' in element
        ? typeof element.className === 'string'
            ? element.className
            : ''
        : '';

    const baseInstruction = instruction?.trim() || 'Modify this component.';

    return className
        ? `Edit request for <${tagName}> with class "${className}". ${baseInstruction}`
        : `Edit request for <${tagName}>. ${baseInstruction}`;
}

export const ChatPanel = forwardRef<ChatPanelRef, ChatPanelProps>(function ChatPanel(
    {
        isBridgeReady = false,
        isDaemonConnected = false,
        workspacePath,
        onWorkspaceChange,
        className,
    },
    ref,
) {
    const [messages, setMessages] = useState<ChatPanelMessage[]>([]);
    const [isResponding, setIsResponding] = useState(false);
    const [resolvedWorkspacePath, setResolvedWorkspacePath] = useState<string | undefined>(
        workspacePath ?? undefined,
    );

    useEffect(() => {
        setResolvedWorkspacePath(workspacePath ?? undefined);
    }, [workspacePath]);

    useEffect(() => {
        if (resolvedWorkspacePath || !window.fileSystem) return;

        let cancelled = false;

        window.fileSystem.getWorkspace().then((result) => {
            if (cancelled || !result.success || !result.path) return;
            setResolvedWorkspacePath(result.path);
            onWorkspaceChange?.(result.path);
        }).catch(() => {
            // Browser shell often lacks the file-system bridge. Degrade quietly.
        });

        return () => {
            cancelled = true;
        };
    }, [onWorkspaceChange, resolvedWorkspacePath]);

    const appendMessage = useCallback((message: ChatPanelMessage) => {
        setMessages((current) => [...current, message]);
    }, []);

    const dispatchPrompt = useCallback(async (content: string) => {
        const prompt = content.trim();
        if (!prompt) return;

        appendMessage(makeMessage('user', prompt));

        if (!isBridgeReady || !window.coordinator) {
            appendMessage(
                makeMessage(
                    'assistant',
                    isDaemonConnected
                        ? 'Prompt captured locally. The daemon is live, but the Claude/Electron bridge is unavailable in the browser shell.'
                        : 'Prompt captured locally. Studio is running without its Claude/Electron bridge.',
                ),
            );
            return;
        }

        setIsResponding(true);

        try {
            const result = await window.coordinator.createTask(prompt, []);
            appendMessage(
                makeMessage(
                    'assistant',
                    result.success
                        ? 'Queued request in the Studio coordinator. Full Claude session streaming still needs to be reconnected in the migrated shell.'
                        : 'Failed to queue the request in the Studio coordinator.',
                ),
            );
        } catch (error) {
            appendMessage(
                makeMessage(
                    'assistant',
                    `Failed to queue the request: ${error instanceof Error ? error.message : 'unknown error'}`,
                ),
            );
        } finally {
            setIsResponding(false);
        }
    }, [appendMessage, isBridgeReady, isDaemonConnected]);

    useImperativeHandle(ref, () => ({
        handleEditElement: (element, instruction) => {
            void dispatchPrompt(buildEditPrompt(element, instruction));
        },
    }), [dispatchPrompt]);

    return (
        <SharedChatPanel
            className={className}
            messages={messages}
            isConnected={isBridgeReady || isDaemonConnected}
            workspacePath={resolvedWorkspacePath}
            isResponding={isResponding}
            onSendMessage={(content) => {
                void dispatchPrompt(content);
            }}
        />
    );
});

export type { ChatPanelMessage };
