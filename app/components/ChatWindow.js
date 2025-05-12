'use client';

import { useState, useEffect } from 'react';
import {
  Chat,
  Channel,
  Window,
  ChannelHeader,
  MessageList,
  MessageInput,
} from 'stream-chat-react';
import { StreamChat } from 'stream-chat';
import 'stream-chat-react/dist/css/v2/index.css';

function generateCustomerId() {
  if (typeof window === 'undefined') return '';
  return crypto.randomUUID();
}

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;

export default function ChatWindow({ isOpen, onClose, product, customerName }) {
  const [client, setClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [customerId, setCustomerId] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    // Generate a new customerId for each chat session
    const id = generateCustomerId();
    setCustomerId(id);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !customerId) return;
    let chatClient;
    let channelInstance;
    let isMounted = true;

    async function setup() {
      // 1. Get token from API
      const res = await fetch('/api/stream-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: customerId }),
      });
      const data = await res.json();
      if (!data.token) return;

      // 2. Create Stream client and set user
      chatClient = StreamChat.getInstance(apiKey);
      await chatClient.connectUser({ id: customerId, name: customerName || 'Guest' }, data.token);

      // 3. Create channel
      const channelId = `support-${customerId}`;
      channelInstance = chatClient.channel('messaging', channelId, {
        name: 'Sales Support',
        members: [customerId, 'sales-agent'],
        url: window.location.href,
        sku: product.sku,
        product: {
          name: product.name,
          price: product.price,
        },
        customer_name: customerName,
        customer_id: customerId,
        closed: false,
      });
      await channelInstance.watch();
      if (isMounted) {
        setClient(chatClient);
        setChannel(channelInstance);
      }
    }
    setup();
    return () => {
      isMounted = false;
      if (chatClient) chatClient.disconnectUser();
    };
  }, [isOpen, customerId, product, customerName]);

  if (!isOpen || !client || !channel) return null;

  const isClosed = channel?.data?.closed;

  return (
    <div className="fixed bottom-20 right-6 w-96 h-[600px] bg-white rounded-lg shadow-xl z-50">
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="font-medium">Chat with Sales</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-hidden">
          <Chat client={client}>
            <Channel channel={channel}>
              <Window>
                <ChannelHeader />
                <MessageList />
                {!isClosed ? (
                  <MessageInput />
                ) : (
                  <div className="p-4 text-center text-red-600 font-semibold">
                    This chat has been closed by the sales associate.
                  </div>
                )}
              </Window>
            </Channel>
          </Chat>
        </div>
      </div>
    </div>
  );
} 