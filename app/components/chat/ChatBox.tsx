import React, { useState } from 'react';
import { ClientOnly } from 'remix-utils/client-only';
import { classNames } from '~/utils/classNames';
import { SendButton } from './SendButton.client';
import type { ProviderInfo } from '~/types/model';
import type { DesignScheme } from '~/types/design-scheme';
import type { ElementInfo } from '~/components/workbench/Inspector';

interface ChatBoxProps {
  isModelSettingsCollapsed: boolean;
  setIsModelSettingsCollapsed: (collapsed: boolean) => void;
  provider: any;
  providerList: any[];
  modelList: any[];
  apiKeys: Record<string, string>;
  isModelLoading: string | undefined;
  onApiKeysChange: (providerName: string, apiKey: string) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement> | undefined;
  input: string;
  handlePaste: (e: React.ClipboardEvent) => void;
  TEXTAREA_MIN_HEIGHT: number;
  TEXTAREA_MAX_HEIGHT: number;
  isStreaming: boolean;
  handleSendMessage: (event: React.UIEvent, messageInput?: string) => void;

  chatStarted: boolean;
  exportChat?: () => void;
  setProvider?: ((provider: ProviderInfo) => void) | undefined;
  model?: string | undefined;
  setModel?: ((model: string) => void) | undefined;
  handleInputChange?: ((event: React.ChangeEvent<HTMLTextAreaElement>) => void) | undefined;
  handleStop?: (() => void) | undefined;
  chatMode?: 'discuss' | 'build';
  setChatMode?: (mode: 'discuss' | 'build') => void;
  designScheme?: DesignScheme;
  setDesignScheme?: (scheme: DesignScheme) => void;
  selectedElement?: ElementInfo | null;
  setSelectedElement?: ((element: ElementInfo | null) => void) | undefined;
}

export const ChatBox: React.FC<ChatBoxProps> = (props) => {
  const [isInputFocused, setIsInputFocused] = useState(false);

  return (
    <div className="relative w-full max-w-4xl mx-auto p-4 z-50">
      {/* Selected Element Inspector */}
      {props.selectedElement && (
        <div className="mb-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-3 shadow-sm animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Element Inspector</span>
              </div>
              <code className="bg-blue-500 text-white px-2 py-1 rounded-md text-xs font-mono font-semibold">
                {props?.selectedElement?.tagName}
              </code>
              <span className="text-xs text-gray-500 dark:text-gray-400">selected for inspection</span>
            </div>
            <button
              className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm transition-all duration-200 hover:bg-blue-100 dark:hover:bg-blue-900/30 px-2 py-1 rounded-md hover:scale-105 active:scale-95"
              onClick={() => props.setSelectedElement?.(null)}
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Main Chat Container */}
      <div
        className={classNames(
          'bg-white dark:bg-gray-900 backdrop-blur-xl rounded-2xl shadow-md border overflow-hidden transition-all duration-300 ease-in-out',
          isInputFocused
            ? 'border-blue-300 dark:border-blue-600 shadow-blue-500/10 shadow-md scale-[1.02]'
            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600',
        )}
      >
        {/* Chat Input Area */}
        <div className="relative p-6">
          <textarea
            ref={props.textareaRef}
            className={classNames(
              'w-full pl-6 pt-6 pr-16 pb-6 outline-none resize-none bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 text-base',
              'transition-all duration-300 ease-in-out',
              'focus:ring-2 focus:ring-blue-500/20 focus:border-transparent rounded-xl border border-transparent',
              'hover:bg-gray-50/50 dark:hover:bg-gray-800/50',
            )}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                if (event.shiftKey) {
                  return;
                }

                event.preventDefault();

                if (props.isStreaming) {
                  props.handleStop?.();
                  return;
                }

                // ignore if using input method engine
                if (event.nativeEvent.isComposing) {
                  return;
                }

                props.handleSendMessage?.(event);
              }
            }}
            value={props.input}
            onChange={(event) => {
              props.handleInputChange?.(event);
            }}
            onPaste={props.handlePaste}
            style={{
              minHeight: props.TEXTAREA_MIN_HEIGHT,
              maxHeight: props.TEXTAREA_MAX_HEIGHT,
            }}
            placeholder={
              props.chatMode === 'build'
                ? "Ask cosmiq anything or describe what you'd like to build..."
                : 'Start a conversation or ask any question...'
            }
            translate="no"
          />

          {/* Send Button */}
          <ClientOnly>
            {() => (
              <div className="absolute bottom-4 right-4">
                <SendButton
                  show={props.input.length > 0 || props.isStreaming}
                  isStreaming={props.isStreaming}
                  disabled={!props.providerList || props.providerList.length === 0}
                  onClick={(event) => {
                    if (props.isStreaming) {
                      props.handleStop?.();
                      return;
                    }

                    if (props.input.length > 0) {
                      props.handleSendMessage?.(event);
                    }
                  }}
                />
              </div>
            )}
          </ClientOnly>
        </div>

        {/* Footer with shortcuts and indicators */}
        <div className="flex justify-between items-center px-6 py-4 bg-gray-50/50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
          <div className="flex gap-3 items-center">
            {/* Chat Mode Indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full border border-purple-200 dark:border-purple-800">
              <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-purple-700 dark:text-purple-300 capitalize">
                {props.chatMode || 'build'} mode
              </span>
            </div>

            {/* Streaming Indicator */}
            {props.isStreaming && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-full border border-yellow-200 dark:border-yellow-800 animate-in slide-in-from-right duration-300">
                <div className="flex gap-1">
                  <div className="w-1 h-1 bg-yellow-500 rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-yellow-500 rounded-full animate-bounce delay-100"></div>
                  <div className="w-1 h-1 bg-yellow-500 rounded-full animate-bounce delay-200"></div>
                </div>
                <span className="text-xs font-medium text-yellow-700 dark:text-yellow-300">AI is thinking...</span>
              </div>
            )}
          </div>

          {/* Keyboard Shortcuts */}
          {props.input.length > 3 && (
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <span>Press</span>
              <kbd className="px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md font-mono text-xs shadow-sm">
                ⇧
              </kbd>
              <span>+</span>
              <kbd className="px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md font-mono text-xs shadow-sm">
                ↵
              </kbd>
              <span>for new line</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
