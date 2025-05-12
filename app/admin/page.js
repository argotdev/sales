'use client';

import { useState, useEffect } from 'react';
import {
  Chat,
  Channel,
  ChannelList,
  Window,
  ChannelHeader,
  MessageList,
  MessageInput,
  useCreateChatClient,
} from 'stream-chat-react';
import 'stream-chat-react/dist/css/v2/index.css';

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const userToken = process.env.NEXT_PUBLIC_STREAM_ADMIN_TOKEN; // Token for sales associate

export default function AdminPage() {
  const [activeChannel, setActiveChannel] = useState(null);
  const client = useCreateChatClient({
    apiKey,
    tokenOrProvider: userToken,
    userData: { id: 'sales-agent' },
  });

  // Custom filter: channels where sales-agent is a member, type messaging, and not closed
  const filters = { 
    members: { $in: ['sales-agent'] }, 
    type: 'messaging',
    closed: false
  };
  const sort = { last_message_at: -1 };
  const options = { presence: true, state: true };

  // Extract product/customer info from channel data
  const ProductInfoPane = ({ channel }) => {
    if (!channel) return null;
    const { url, sku, product } = channel.data || {};
    return (
      <div className="p-4 border-b bg-gray-50">
        <h3 className="font-semibold mb-2">Customer/Product Info</h3>
        <div className="text-sm text-gray-700">
          <div><span className="font-medium">URL:</span> {url || 'N/A'}</div>
          <div><span className="font-medium">SKU:</span> {sku || 'N/A'}</div>
          <div><span className="font-medium">Product:</span> {product ? product.name : 'N/A'}</div>
        </div>
      </div>
    );
  };

  // Add close chat handler
  const handleCloseChat = async () => {
    if (activeChannel) {
      await activeChannel.update({ closed: true });
      await activeChannel.sendMessage({
        text: 'This chat has been closed by the sales associate.',
        type: 'system',
      });
      setActiveChannel(null);
    }
  };

  if (!client) return <div>Loading...</div>;

  return (
    <Chat client={client}>
      <div className="flex h-screen">
        {/* Customer List Pane */}
        <div className="w-1/4 border-r bg-white">
          <h2 className="p-4 font-bold border-b">Waiting Customers</h2>
          <ChannelList
            filters={filters}
            sort={sort}
            options={options}
            Preview={(props) => (
              <div
                className={`p-4 cursor-pointer hover:bg-blue-50 ${activeChannel && props.channel.id === activeChannel.id ? 'bg-blue-100' : ''}`}
                onClick={() => setActiveChannel(props.channel)}
              >
                <div className="font-medium">{props.channel.data?.customer_name || 'Customer'}</div>
                <div className="text-xs text-gray-500 truncate">{props.channel.data?.url || ''}</div>
              </div>
            )}
          />
        </div>
        {/* Chat and Info Pane */}
        <div className="flex-1 flex flex-col">
          <ProductInfoPane channel={activeChannel} />
          <div className="flex-1">
            {activeChannel ? (
              <Channel channel={activeChannel}>
                <Window>
                  <ChannelHeader />
                  <MessageList />
                  <MessageInput />
                </Window>
                <div className="p-4 border-t bg-gray-50 flex justify-end">
                  <button
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                    onClick={handleCloseChat}
                  >
                    Close Chat
                  </button>
                </div>
              </Channel>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">Select a customer to start chatting</div>
            )}
          </div>
        </div>
      </div>
    </Chat>
  );
} 