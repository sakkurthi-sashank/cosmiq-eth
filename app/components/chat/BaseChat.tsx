/*
 * @ts-nocheck
 * Preventing TS checks with files presented in the video for a better presentation.
 */
import type { JSONValue, Message } from 'ai';
import React, { type RefCallback, useEffect, useState } from 'react';
import { ClientOnly } from 'remix-utils/client-only';
import { Menu } from '~/components/sidebar/Menu.client';
import { Workbench } from '~/components/workbench/Workbench.client';
import { classNames } from '~/utils/classNames';
import { PROVIDER_LIST } from '~/utils/constants';
import { Messages } from './Messages.client';
import Cookies from 'js-cookie';
import * as Tooltip from '@radix-ui/react-tooltip';
import styles from './BaseChat.module.scss';
import type { ProviderInfo } from '~/types/model';
import type { ActionAlert } from '~/types/actions';
import ChatAlert from './ChatAlert';
import type { ModelInfo } from '~/lib/modules/llm/types';
import ProgressCompilation from './ProgressCompilation';
import type { ProgressAnnotation } from '~/types/context';
import type { ActionRunner } from '~/lib/runtime/action-runner';
import { StickToBottom, useStickToBottomContext } from '~/lib/hooks';
import { ChatBox } from './ChatBox';
import type { DesignScheme } from '~/types/design-scheme';
import type { ElementInfo } from '~/components/workbench/Inspector';
import { ImportButtons } from '~/components/chat/chatExportAndImport/ImportButtons';

// Inline getApiKeysFromCookies function
function getApiKeysFromCookies() {
  try {
    const cookies = document.cookie.split(';').reduce(
      (acc, cookie) => {
        const [key, value] = cookie.split('=');
        acc[key.trim()] = decodeURIComponent(value);

        return acc;
      },
      {} as Record<string, string>,
    );
    return cookies.apiKeys ? JSON.parse(cookies.apiKeys) : {};
  } catch {
    return {};
  }
}

const TEXTAREA_MIN_HEIGHT = 76;

interface BaseChatProps {
  textareaRef?: React.RefObject<HTMLTextAreaElement> | undefined;
  messageRef?: RefCallback<HTMLDivElement> | undefined;
  scrollRef?: RefCallback<HTMLDivElement> | undefined;
  showChat?: boolean;
  chatStarted?: boolean;
  isStreaming?: boolean;
  onStreamingChange?: (streaming: boolean) => void;
  messages?: Message[];
  description?: string;
  input?: string;
  model?: string;
  setModel?: (model: string) => void;
  provider?: ProviderInfo;
  setProvider?: (provider: ProviderInfo) => void;
  providerList?: ProviderInfo[];
  handleStop?: () => void;
  sendMessage?: (event: React.UIEvent, messageInput?: string) => void;
  handleInputChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  importChat?: (description: string, messages: Message[]) => Promise<void>;
  exportChat?: () => void;
  actionAlert?: ActionAlert;
  clearAlert?: () => void;
  data?: JSONValue[] | undefined;
  actionRunner?: ActionRunner;
  chatMode?: 'discuss' | 'build';
  setChatMode?: (mode: 'discuss' | 'build') => void;
  append?: (message: Message) => void;
  designScheme?: DesignScheme;
  setDesignScheme?: (scheme: DesignScheme) => void;
  selectedElement?: ElementInfo | null;
  setSelectedElement?: (element: ElementInfo | null) => void;
}

export const BaseChat = React.forwardRef<HTMLDivElement, BaseChatProps>(
  (
    {
      textareaRef,
      showChat = true,
      chatStarted = false,
      isStreaming = false,
      onStreamingChange,
      model,
      setModel,
      provider,
      setProvider,
      providerList,
      input = '',
      handleInputChange,
      sendMessage,
      handleStop,
      importChat,
      exportChat,
      messages,
      actionAlert,
      clearAlert,
      data,
      actionRunner,
      chatMode,
      setChatMode,
      append,
      designScheme,
      setDesignScheme,
      selectedElement,
      setSelectedElement,
    },
    ref,
  ) => {
    const TEXTAREA_MAX_HEIGHT = chatStarted ? 400 : 200;
    const [apiKeys, setApiKeys] = useState<Record<string, string>>(getApiKeysFromCookies());
    const [modelList, setModelList] = useState<ModelInfo[]>([]);
    const [isModelSettingsCollapsed, setIsModelSettingsCollapsed] = useState(false);
    const [isModelLoading, setIsModelLoading] = useState<string | undefined>('all');
    const [progressAnnotations, setProgressAnnotations] = useState<ProgressAnnotation[]>([]);

    useEffect(() => {
      if (data) {
        const progressList = data.filter(
          (x) => typeof x === 'object' && (x as any).type === 'progress',
        ) as ProgressAnnotation[];
        setProgressAnnotations(progressList);
      }
    }, [data]);

    useEffect(() => {
      onStreamingChange?.(isStreaming);
    }, [isStreaming, onStreamingChange]);

    useEffect(() => {
      if (typeof window !== 'undefined') {
        let parsedApiKeys: Record<string, string> | undefined = {};

        try {
          parsedApiKeys = getApiKeysFromCookies();
          setApiKeys(parsedApiKeys || {});
        } catch (error) {
          console.error('Error loading API keys from cookies:', error);
          Cookies.remove('apiKeys');
        }

        setIsModelLoading('all');
        fetch('/api/models')
          .then((response) => response.json())
          .then((data) => {
            const typedData = data as { modelList: ModelInfo[] };
            setModelList(typedData.modelList);
          })
          .catch((error) => {
            console.error('Error fetching model list:', error);
          })
          .finally(() => {
            setIsModelLoading(undefined);
          });
      }
    }, [providerList, provider]);

    const onApiKeysChange = async (providerName: string, apiKey: string) => {
      const newApiKeys = { ...apiKeys, [providerName]: apiKey };
      setApiKeys(newApiKeys);
      Cookies.set('apiKeys', JSON.stringify(newApiKeys));

      setIsModelLoading(providerName);

      let providerModels: ModelInfo[] = [];

      try {
        const response = await fetch(`/api/models/${encodeURIComponent(providerName)}`);
        const data = await response.json();
        providerModels = (data as { modelList: ModelInfo[] }).modelList;
      } catch (error) {
        console.error('Error loading dynamic models for:', providerName, error);
      }

      // Only update models for the specific provider
      setModelList((prevModels) => {
        const otherModels = prevModels.filter((model) => model.provider !== providerName);
        return [...otherModels, ...providerModels];
      });
      setIsModelLoading(undefined);
    };

    const handleSendMessage = (event: React.UIEvent, messageInput?: string) => {
      if (sendMessage) {
        sendMessage(event, messageInput);
        setSelectedElement?.(null);
      }
    };

    const handlePaste = async (_e: React.ClipboardEvent) => {
      /*
       * Handle paste functionality without file uploads
       * This can be expanded later if needed for text paste
       */
    };

    const baseChat = (
      <div
        ref={ref}
        className={classNames(styles.BaseChat, 'relative flex h-full w-full overflow-hidden')}
        data-chat-visible={showChat}
      >
        <ClientOnly>{() => <Menu />}</ClientOnly>
        <div className="flex flex-col lg:flex-row overflow-y-auto w-full h-full">
          <div className={classNames(styles.Chat, 'flex flex-col flex-grow lg:min-w-[var(--chat-min-width)] h-full')}>
            {chatStarted ? (
              <StickToBottom
                className="pt-6 px-2 sm:px-6 relative h-full flex flex-col modern-scrollbar"
                resize="smooth"
                initial="smooth"
              >
                <StickToBottom.Content className="flex flex-col gap-4 relative ">
                  <ClientOnly>
                    {() => (
                      <Messages
                        className="flex flex-col w-full flex-1 max-w-chat pb-4 mx-auto z-1"
                        messages={messages}
                        isStreaming={isStreaming}
                        append={append}
                        chatMode={chatMode}
                        setChatMode={setChatMode}
                        provider={provider}
                        model={model}
                      />
                    )}
                  </ClientOnly>
                  <ScrollToBottom />
                </StickToBottom.Content>
                <div className="sticky bottom-2 flex flex-col gap-2 w-full max-w-chat mx-auto z-prompt mb-6">
                  <div className="flex flex-col gap-2">
                    {actionAlert && (
                      <ChatAlert
                        alert={actionAlert}
                        clearAlert={() => clearAlert?.()}
                        postMessage={(message) => {
                          sendMessage?.({} as any, message);
                          clearAlert?.();
                        }}
                      />
                    )}
                  </div>
                  {progressAnnotations && <ProgressCompilation data={progressAnnotations} />}
                  <ChatBox
                    isModelSettingsCollapsed={isModelSettingsCollapsed}
                    setIsModelSettingsCollapsed={setIsModelSettingsCollapsed}
                    provider={provider}
                    setProvider={setProvider}
                    providerList={providerList || (PROVIDER_LIST as ProviderInfo[])}
                    model={model}
                    setModel={setModel}
                    modelList={modelList}
                    apiKeys={apiKeys}
                    isModelLoading={isModelLoading}
                    onApiKeysChange={onApiKeysChange}
                    textareaRef={textareaRef}
                    input={input}
                    handleInputChange={handleInputChange}
                    handlePaste={handlePaste}
                    TEXTAREA_MIN_HEIGHT={TEXTAREA_MIN_HEIGHT}
                    TEXTAREA_MAX_HEIGHT={TEXTAREA_MAX_HEIGHT}
                    isStreaming={isStreaming}
                    handleStop={handleStop}
                    handleSendMessage={handleSendMessage}
                    chatStarted={chatStarted}
                    exportChat={exportChat}
                    chatMode={chatMode}
                    setChatMode={setChatMode}
                    designScheme={designScheme}
                    setDesignScheme={setDesignScheme}
                    selectedElement={selectedElement}
                    setSelectedElement={setSelectedElement}
                  />
                </div>
              </StickToBottom>
            ) : (
              <div
                className={classNames(
                  styles.WelcomeScreen,
                  'flex bg-gradient-to-t from-green-400 via-white to-white  flex-col items-center justify-center h-full min-h-screen px-4 py-8',
                )}
              >
                {/* Welcome Section */}
                <div className="flex flex-col items-center justify-center flex-1 max-w-4xl mx-auto space-y-8">
                  {/* Title and Description */}
                  <div className={classNames(styles.WelcomeTitle, 'text-center space-y-4')}>
                    <h1 className="text-5xl md:text-6xl font-bold text-green-700">CosmIQ</h1>
                    <p className="text-xl md:text-2xl text-cosmiq-elements-textSecondary max-w-2xl">
                      The ultimate AI-powered platform for building Web3 applications. Create decentralized apps, smart
                      contracts, and blockchain solutions with intelligent assistance.
                    </p>
                  </div>

                  {/* Features */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl mt-8">
                    <div
                      className={classNames(
                        styles.WelcomeFeature,
                        'rounded-xl p-6 border bg-white border-cosmiq-elements-borderColor shadow-md hover:shadow-lg transition-shadow duration-300',
                      )}
                    >
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                        <span className="i-ph:code text-2xl text-blue-500" />
                      </div>
                      <h3 className="text-lg font-semibold text-cosmiq-elements-textPrimary mb-2">Smart Contracts</h3>
                      <p className="text-cosmiq-elements-textSecondary">
                        AI-powered smart contract development and auditing
                      </p>
                    </div>
                    <div
                      className={classNames(
                        styles.WelcomeFeature,
                        'rounded-xl p-6 border bg-white border-cosmiq-elements-borderColor shadow-md hover:shadow-lg transition-shadow duration-300',
                      )}
                    >
                      <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                        <span className="i-ph:chat-circle text-2xl text-purple-500" />
                      </div>
                      <h3 className="text-lg font-semibold text-cosmiq-elements-textPrimary mb-2">Web3 Assistant</h3>
                      <p className="text-cosmiq-elements-textSecondary">
                        Expert guidance for DeFi, NFTs, and blockchain development
                      </p>
                    </div>
                    <div
                      className={classNames(
                        styles.WelcomeFeature,
                        'rounded-xl p-6 border bg-white border-cosmiq-elements-borderColor shadow-md hover:shadow-lg transition-shadow duration-300',
                      )}
                    >
                      <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                        <span className="i-ph:rocket text-2xl text-green-500" />
                      </div>
                      <h3 className="text-lg font-semibold text-cosmiq-elements-textPrimary mb-2">DApp Deployment</h3>
                      <p className="text-cosmiq-elements-textSecondary">Deploy to multiple blockchains with ease</p>
                    </div>
                  </div>

                  {/* Chat Input Section */}
                  <div className="w-full max-w-4xl space-y-6">
                    <div className="flex flex-col gap-2">
                      {actionAlert && (
                        <ChatAlert
                          alert={actionAlert}
                          clearAlert={() => clearAlert?.()}
                          postMessage={(message) => {
                            sendMessage?.({} as any, message);
                            clearAlert?.();
                          }}
                        />
                      )}
                    </div>
                    {progressAnnotations && <ProgressCompilation data={progressAnnotations} />}
                    <ChatBox
                      isModelSettingsCollapsed={isModelSettingsCollapsed}
                      setIsModelSettingsCollapsed={setIsModelSettingsCollapsed}
                      provider={provider}
                      setProvider={setProvider}
                      providerList={providerList || (PROVIDER_LIST as ProviderInfo[])}
                      model={model}
                      setModel={setModel}
                      modelList={modelList}
                      apiKeys={apiKeys}
                      isModelLoading={isModelLoading}
                      onApiKeysChange={onApiKeysChange}
                      textareaRef={textareaRef}
                      input={input}
                      handleInputChange={handleInputChange}
                      handlePaste={handlePaste}
                      TEXTAREA_MIN_HEIGHT={TEXTAREA_MIN_HEIGHT}
                      TEXTAREA_MAX_HEIGHT={TEXTAREA_MAX_HEIGHT}
                      isStreaming={isStreaming}
                      handleStop={handleStop}
                      handleSendMessage={handleSendMessage}
                      chatStarted={chatStarted}
                      exportChat={exportChat}
                      chatMode={chatMode}
                      setChatMode={setChatMode}
                      designScheme={designScheme}
                      setDesignScheme={setDesignScheme}
                      selectedElement={selectedElement}
                      setSelectedElement={setSelectedElement}
                    />

                    {/* Import Buttons */}
                    <div className="flex justify-center gap-2">{ImportButtons(importChat)}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <ClientOnly>
            {() => (
              <Workbench
                actionRunner={actionRunner ?? ({} as ActionRunner)}
                chatStarted={chatStarted}
                isStreaming={isStreaming}
                setSelectedElement={setSelectedElement}
              />
            )}
          </ClientOnly>
        </div>
      </div>
    );

    return <Tooltip.Provider delayDuration={200}>{baseChat}</Tooltip.Provider>;
  },
);

function ScrollToBottom() {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext();

  return (
    !isAtBottom && (
      <>
        <div className="sticky bottom-0 left-0 right-0 bg-gradient-to-t from-cosmiq-elements-background-depth-1 to-transparent h-20 z-10" />
        <button
          className="sticky z-50 bottom-0 left-0 right-0 text-4xl rounded-lg px-1.5 py-0.5 flex items-center justify-center mx-auto gap-2 bg-cosmiq-elements-background-depth-2 border border-cosmiq-elements-borderColor text-cosmiq-elements-textPrimary text-sm"
          onClick={() => scrollToBottom()}
        >
          Go to last message
          <span className="i-ph:arrow-down animate-bounce" />
        </button>
      </>
    )
  );
}
