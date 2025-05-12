# Stream Chat React SDK Documentation

## Table of Contents

## Overview

Building on top of the Stream Chat API, the Stream Chat React component library includes everything you need to build feature-rich and high-functioning chat user experiences out of the box. The library includes an extensive set of performant and customizable React components which allow you to get started quickly with little to no plumbing required. Use cases include team and social messaging, virtual events, livestream gaming, and customer support. The library supports:

  * Rich media messages
  * Reactions
  * Threads and quoted replies
  * Text input commands (ex: Giphy and @mentions)
  * Image and file uploads
  * Video playback
  * Audio recording
  * Read state and typing indicators
  * Channel and message lists

If you are new to our SDK it is best to go through our [tutorial](https://getstream.io/chat/react-chat/tutorial/).

After that, our [getting started page](/chat/docs/sdk/react/basics/getting_started/) is a great next step.

If you are integrating our SDK, please pay attention to our [Theming](/chat/docs/sdk/react/theming/themingv2/) and [Customizing Components](/chat/docs/sdk/react/guides/customization/) sections in our guides. We see that most of our users can get very far by utilizing the flexibility of our SDKs.

A common pattern in the library is the use of context provider hooks. These custom hooks allow for effective value sharing between parent components and their children. This makes customization straightforward, as you can use our exported hooks in your custom components to receive the exact values needed, while also subscribing to context changes.

The left navigation will guide you to the various documentation sections for information on everything regarding our robust component library. Check out the instructions for adding the library to your React project.

[PreviousResources](/chat/docs/sdk/react/v12/resources/)[NextInstallation](/chat/docs/sdk/react/basics/installation/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

## Basics

This section provides a high level overview of the library setup, core components, and how they fit together. Itâs a great starting point and you can follow along in your code editor. For a complete, step-by-step guide in terms setting up a React project or instructions on creating specific files, see our [React Chat tutorial](https://getstream.io/chat/react-chat/tutorial/).

Before starting, make sure you have installed `stream-chat-react` (and `stream-chat`), as directed in the [Installation](/chat/docs/sdk/react/basics/installation/) section.

Youâll also need to [register](https://getstream.io/chat/trial/) and create a free tier (for up to 25 MAU) Stream application to access credentials from which youâll be able to [generate a token](/chat/docs/react/token_generator/) for a user which can access your chat application.

The example below is all the code youâll need to launch a fully functioning chat experience. The [`Chat`](/chat/docs/sdk/react/components/core-components/chat/) and [`Channel`](/chat/docs/sdk/react/components/core-components/channel/) components are React context providers that pass a variety of values to their children, including UI components, stateful data, and action handler functions.


    import {
      Chat,
      Channel,
      ChannelList,
      Window,
      ChannelHeader,
      MessageList,
      MessageInput,
      Thread,
      useCreateChatClient,
    } from "stream-chat-react";
    import "stream-chat-react/dist/css/v2/index.css";

    const apiKey = "your-api-key";
    const userId = "user-id";
    const token = "authentication-token";

    const filters = { members: { $in: [userId] }, type: "messaging" };
    const options = { presence: true, state: true };
    const sort = { last_message_at: -1 };

    const App = () => {
      const client = useCreateChatClient({
        apiKey,
        tokenOrProvider: token,
        userData: { id: userId },
      });

      if (!client) return <div>Loading...</div>;

      return (
        <Chat client={client}>
          <ChannelList sort={sort} filters={filters} options={options} />
          <Channel>
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput />
            </Window>
            <Thread />
          </Channel>
        </Chat>
      );
    };

To organize the components in a chat messenger layout, we provide the following CSS:


    html,
    body,
    #root {
      margin: unset;
      padding: unset;
      height: 100%;
    }

    #root {
      display: flex;
      height: 100%;

      .str-chat__channel-list {
        position: fixed;
        z-index: 1;
        height: 100%;
        width: 0;
        flex-shrink: 0;
        box-shadow: 0 0 8px rgba(0, 0, 0, 0.15);

        &--open {
          width: 30%;
          position: fixed;
        }
        transition: width 0.3s ease-out;
      }

      .str-chat__channel {
        flex: 1;
        min-width: 0;
      }

      .str-chat__main-panel {
        min-width: 0;
        flex: 1;

        &--thread-open {
          display: none;
        }
      }

      .str-chat__thread {
        flex: 1;
        height: 100%;
        position: fixed;
        z-index: 1;
      }

      .str-chat__channel-header .str-chat__header-hamburger {
        width: 30px;
        height: 38px;
        padding: var(--xxs-p);
        margin-right: var(--xs-m);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border: none;
        background: transparent;

        &:hover {
          svg path {
            fill: var(--primary-color);
          }
        }
      }

      @media screen and (min-width: 768px) {
        .str-chat__channel-list {
          width: 30%;
          position: initial;
          z-index: 0;
        }

        .str-chat__thread {
          position: initial;
          z-index: 0;
        }

        .str-chat__channel-header .str-chat__header-hamburger {
          display: none;
        }
      }

      @media screen and (min-width: 1024px) {
        .str-chat__main-panel {
          min-width: 0;

          &--thread-open {
            max-width: 55%;
            display: flex;
          }
        }

        .str-chat__thread {
          max-width: 45%;
        }

        .str-chat__channel-header .str-chat__header-hamburger {
          display: none;
        }
      }
    }

To communicate with the Stream Chat API the SDK requires a client with an established connection. The hook mentioned in the code above (`useCreateChatClient`) handles client instantiation, establishes proper connection and handles cleanups and disconnects for you. If you wish to have more control over how all the previously mentioned is being handled see [Client and User](/chat/docs/sdk/react/guides/client-and-user/) guide.

The hook `useCreateChatClient` accepts parameter `options`. This is an object forwarded to the `StreamChat` constructor. When the client is created, the first passed `options` value is used, and the client is **not** recreated when the `options` value updates. In most cases itâs not a problem, however, if you really need to recreate the client with the latest options and reconnect, you can set a `key` on the component that invokes `useCreateChatClient`:


    import {
      Chat,
      StreamChatOptions,
      useCreateChatClient,
    } from "stream-chat-react";

    const App = () => {
      const [timeout, setTimeout] = useState(6000);
      const key = `timeout_${timeout}`;
      return <ChatWithOptions key={key} timeout={timeout} />;
    };

    const ChatWithOptions = ({ timeout }: StreamChatOptions) => {
      const client = useCreateChatClient({
        apiKey,
        options: { timeout },
        tokenOrProvider: token,
        userData: { id: userId },
      });

      if (!client) return <div>Loading...</div>;
      return <Chat client={client}></Chat>;
    };

Usually applications use expiring user tokens. That implies that the application has to request a new token, once the current token expires. For this to happen, we need to provide a function (`tokenProvider`) that would retrieve a new token from a server and return it for the `StreamChat` client. In the below example we define and **memoize** the `tokenProvider` function and pass it to the `useCreateChatClient` hook.


    import {
      Chat,
      StreamChatOptions,
      useCreateChatClient,
    } from "stream-chat-react";
    import type { TokenOrProvider, OwnUserResponse } from "stream-chat";

    // probably import jwt from 'jsonwebtoken' and do jwt.decode looking into exp claim
    import { isExpired } from "./utils";

    const refreshToken = async () => {
      const response = await fetch(env.CREDENTIALS_URL);
      const { token } = await response.json();
      return token;
    };

    type AuthPayload = { apiKey: string; token: string; user: OwnUserResponse };

    // auth payload usually obtained on user login
    const ChatWidget = ({ apiKey, token, user }: AuthPayload) => {
      // need to memoize the function to prevent running useCreateChatClient
      // caused by recreation of non-memoized function on every render
      const tokenProvider = useCallback(async () => {
        if (!isExpired(initialToken)) return token;
        return await refreshToken();
      }, [token]);

      const client = useCreateChatClient({
        apiKey,
        tokenOrProvider: tokenProvider,
        userData: user,
      });

      if (!client) return <div>Loading...</div>;

      return <Chat client={client}></Chat>;
    };

When passing objects (including arrays and functions) as props or hook parameters in React, you should memoize them to prevent unnecessary re-renders. This is because React uses reference equality (`===`) to determine if a prop has changed.


    // â Bad - new object created on every render
    <Component data={{ id: 1, name: 'John' }} />

    // â Good - memoized object
    const data = useMemo(() => ({ id: 1, name: 'John' }), []);
    <Component data={data} />

    // â Bad - new function created on every render
    <Component onEvent={() => console.log('clicked')} />

    // â Good - memoized function
    const onEvent = useCallback(() => console.log('clicked'), []);
    <Component onEvent={onEvent} />

    // ================================================================== //

    // Example of a custom hook with memoized functions
    const useData = ({ onUpdate }: { onUpdate: () => void }) => {
      useEffect(() => {
        // Hook implementation
      }, [onUpdate]);
    };

    // Usage
    const DataComponent = () => {
      const onUpdate = useCallback(() => {
        // Update logic
      }, []);

      const handlers = useMemo(() => ({ onUpdate }), [onUpdate]);
      useData(handlers);
    };

This is especially important when:

  * Using `React.memo()` on child components - pass memoized values
  * Passing callbacks to hooks like `useEffect` \- pass memoized objects to dependencies
  * Using custom hooks that depend on object props - pass memoized objects

Remember to:

  * Include all dependencies in the dependency array of `useMemo` and `useCallback` etc.
  * Do not memoize if the values are not going to determine re-render
  * Consider using `useRef` for values that shouldnât trigger re-renders

Channels are at the core of Stream Chat. Within a channel you send/receive messages and interact with other users. Once a channel object has been initialized, the `Channel` component consumes the object and renders your chat appâs functionality.

By default, the Stream Chat API provides support for five different [channel types](/chat/docs/react/channel_features/) of varying use cases. A channel type is required when creating a channel and dictates the available features and permissions. The defaults include:

  * `messaging`
  * `livestream`
  * `team`
  * `gaming`
  * `commerce`

You can also create [custom channel types](/chat/docs/react/channel_features/#creating-a-channel-type/) and define your own permission sets.

To create an instance of a channel, call the `channel` method on your client instance. This method takes the following parameters:

  * channel type
  * channel ID (optional, will be auto-generated by the backend if not supplied)
  * channel data



    const channel = client.channel("messaging", {
      image: "https://cdn.com/image.png",
      name: "Just Chatting",
      members: ["dave-matthews", "trey-anastasio"],
      // option to add custom fields
    });

Now that we have a client instance, a connected user, and a channel, itâs time to look at the core components involved in building a fully functioning chat application.

The [`Chat`](/chat/docs/sdk/react/components/core-components/chat/) component is a React Context provider that wraps the entire Stream Chat application. It provides the [`ChatContext`](/chat/docs/sdk/react/components/contexts/chat_context/) to its children, which includes the `StreamChat` client instance. All other components within the library must be nested as children of `Chat` to maintain proper functionality.

The client instance can be accessed with our custom context hook:


    import { useChatContext } from "stream-chat-react";

    // ...

    const { client } = useChatContext();

The [`Channel`](/chat/docs/sdk/react/components/core-components/channel/) component is a React Context provider that wraps all of the logic, functionality, and UI for an individual chat channel. It provides five separate contexts to its children:

  * [`ChannelStateContext`](/chat/docs/sdk/react/components/contexts/channel_state_context/) \- stateful data (ex: `messages` or `members`)
  * [`ChannelActionContext`](/chat/docs/sdk/react/components/contexts/channel_action_context/) \- action handlers (ex: `sendMessage` or `openThread`)
  * [`ComponentContext`](/chat/docs/sdk/react/components/contexts/component_context/) \- custom component UI overrides (ex: `Avatar` or `Message`)
  * [`TypingContext`](/chat/docs/sdk/react/components/contexts/typing_context/) \- object of currently typing users (i.e., `typing`)

The [`ChannelList`](/chat/docs/sdk/react/components/core-components/channel_list/) component renders a list of channels and provides a preview for each. Though the `ChannelList` is essential in many chat apps, it isnât a required piece of the library. If a `ChannelList` component is used, a channel object should not be placed as a prop on the `Channel` component, as the `ChannelList` handles channel setting internally.

The [`Window`](/chat/docs/sdk/react/components/utility-components/window/) component handles width changes in the main channel to ensure a seamless user experience when opening and closing a `Thread`.

The [`ChannelHeader`](/chat/docs/sdk/react/components/utility-components/channel_header/) displays pertinent information regarding the currently active channel, including image and title.

The [`MessageList`](/chat/docs/sdk/react/components/core-components/message_list/) component renders a list of messages and consumes the various contexts setup from `Channel`. This component accepts a wide variety of optional props for customization needs.

The [`MessageInput`](/chat/docs/sdk/react/components/message-input-components/message_input/) component is a React Context provider that wraps all of the logic, functionality, and UI for the message input displayed in a channel. It provides the [`MessageInputContext`](/chat/docs/sdk/react/components/contexts/message_input_context/) to its children.

The [`Thread`](/chat/docs/sdk/react/components/core-components/thread/) component renders a list of replies tied to a single parent message in a channelâs main message list. A `Thread` maintains its own state and renders its own `MessageList` and `MessageInput` components.

The SDK is equipped with features designed to facilitate seamless integration, enabling developers to effortlessly incorporate [emoji picker](/chat/docs/sdk/react/guides/customization/emoji_picker/) and emoji autocomplete (built on top of [`emoji-mart`](https://github.com/missive/emoji-mart)) functionalities for a comprehensive chat experience.

Make sure to read [_Dropping support for built-in`EmojiPicker`_](/chat/docs/sdk/react/release-guides/upgrade-to-v11#dropping-support-for-built-in-emojipicker/) and [_Dropping support for built-in`EmojiIndex`_](/chat/docs/sdk/react/release-guides/upgrade-to-v11#dropping-support-for-built-in-emojiindex/) release guides for more information.

Read more about customization in our [Theming](/chat/docs/sdk/react/theming/themingv2/) and [Customizing Components](/chat/docs/sdk/react/guides/customization/) guides.

[PreviousInstallation](/chat/docs/sdk/react/basics/installation/)[NextIntroduction](/chat/docs/sdk/react/theming/themingv2/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

We recommended using the component library through a package manager. Stream Chat React is based on top of Streamâs [JavaScript Client](/chat/docs/javascript/).

npm install stream-chat stream-chat-react

yarn add stream-chat stream-chat-react

In case you are not using a package manager, or you wish to build a simple proof of concept in CodePen for example, you can load the library through a direct script link. If you choose to do this, make sure you explicitly specify the version of the library to prevent breaking releases from affecting your app.



    <script src="https://cdn.jsdelivr.net/npm/stream-chat@VERSION"></script>
    <script src="https://cdn.jsdelivr.net/npm/stream-chat-react@VERSION"></script>

With the installation out of the way, letâs get started exploring the basics of the library.

[PreviousOverview](/chat/docs/sdk/react/)[NextGetting Started](/chat/docs/sdk/react/basics/getting_started/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

## Components

MessageComposer middleware purpose is to allow for full control over the data processing in different composition scenarios.

Some managers (TextComposer, PollComposer, MessageComposer) use middleware to process state changes and compose data. These managers have one or more middleware executors that execute handler chains.

The middleware execution is performed via `MiddlewareExecutor`. It allows:

  * Registering middleware with specific handlers
  * Controlling handler execution order
  * Deciding when to terminate the middleware chaing execution

Middleware is an object with an `id` and a `handlers` object containing specific event handlers:


    type Middleware<TValue, THandlers extends string> = {
      id: string;
      handlers: {
        [K in THandlers]: MiddlewareHandler<TValue>;
      };
    };

The `MiddlewareExecutor` registers the middleware:


    // Define middleware with handlers for different events
    const textValidationMiddleware = {
      id: "textValidation",
      handlers: {
        // Handler for text changes
        onChange: async ({ state, next, discard }) => {
          if (state.text.length > 100) {
            return discard();
          }
          return next(state);
        },

        // Handler for suggestion selection
        onSuggestionItemSelect: async ({ state, next, complete }) => {
          // Process suggestion...
          return next(state);
        },
      },
    };

    // Register middleware with executor
    middlewareExecutor.use(textValidationMiddleware);

The executor executes a chain of handlers by name. For example, when `onChange` is called, it runs all handlers registered for the `onChange` event. The state type varies based on specific `MiddlewareExecutor`. And each handler is given the control functions (`next`, `discard`, etc.).


    // Executor runs the onChange handler chain
    middlewareExecutor.execute({eventName: 'onChange', initialValue: { text: 'Hello', selection: {start: 1, end:} } });

Each **handler** in the chain receives the current state and **control functions** to manage the execution flow:

  * `next(state)`: Continue the execution with the next handler in the chain and with the given state
  * `complete(state)`: Stop the execution with and commit the given state
  * `discard()`: Stop execution and discard changes
  * `forward()`: Skip processing and continue with the next handler

Middleware can be registered in several ways:


    // Add middleware
    middlewareExecutor.use({
      id: "customMiddleware",
      handlers: {
        onChange: async ({ state, next, complete }) => {
          // Process state
          if (state.text === "done") {
            return complete(state);
          }
          return next(state);
        },
      },
    });

    // Insert middleware at specific position
    middlewareExecutor.insert({
      middleware: [customMiddleware],
      position: { after: "existingMiddlewareId" },
    });

    // Replace existing middleware
    middlewareExecutor.replace([newMiddleware]);

    // Set middleware order
    middlewareExecutor.setOrder([
      "middleware-1-id",
      "middleware-2-id",
      "middleware-3-id",
    ]);

To create a custom execution chain with custom state (all the handlers work with the same executor state) we can extend `MiddlewareExecutor` class to build a custom executor. There we can customize how the chain is executed or how the middleware is added, sorted or removed.

Custom handler execution can be also done via factory functions. This is actually approach used to generate pre-build middleware. Factory functions keep a common context for all the handlers.

**Disabling Middleware**

If the goal is to disable the middleware (and thus for example the corresponding trigger), we can simply override the registerred middleware (and disable mentions for example):


    textComposer.middlewareExecutor.use([
      createCommandsMiddleware(textComposer.channel),
    ]);

The same applies to re-arranging the middleware.

**Overriding a Middleware Handler**

If we wanted to override what happens when a target is selected, we would be overriding the selection handler for all the types of suggestions:


    import { createCommandsMiddleware, createMentionsMiddleware } from 'stream-chat';
    import type {CommandsMiddleware, CommandSearchSource, TextComposerMiddlewareOptions, MentionsMiddleware, MentionsSearchSource} from 'stream-chat';

    const customCreateCommandsMiddleware =  (
      channel: Channel,
      options?: Partial<TextComposerMiddlewareOptions> & {
        searchSource?: CommandSearchSource;
      },
    ): CommandsMiddleware => {
        const default = createCommandsMiddleware(channel);
        return {
            ...default,
            handlers: {
                ...default.handlers,
                onSuggestionItemSelect: () => {
                    // Custom selection logic
                },
            }
        }
    }

    const customCreateMentionsMiddleware =  (
      channel: Channel,
      options?: Partial<TextComposerMiddlewareOptions> & {
        searchSource?: MentionsSearchSource;
      },
    ): MentionsMiddleware => {
        const default = createMentionsMiddleware(channel);
        return {
            ...default,
            handlers: {
                ...default.handlers,
                onSuggestionItemSelect: () => {
                    // Custom selection logic
                },
            }
        }
    }

Each manager defines its own handler events and state types. In general there are two types of executors:

  1. Executors for state change - handlers mutate the original middleware state value into a new value
  2. Composition executors - handlers generate a new value

**TextComposer** The executor for state change recognized the following handlers:

  * `onChange`: Handles text changes
  * `onSuggestionItemSelect`: Handles suggestion selection

**PollComposer** The executor for state change recognizes the following handlers:

  * `handleFieldChange`: Processes poll form field updates
  * `handleFieldBlur`: Handles poll form field blur events

The executor for composition regocnized the following handlers:

  * `compose`: Composes poll data before the poll is created server-side

**MessageComposer**

The executor for message composition recognizes the following handlers

  * `compose`: Composes final message data

The executor for draft composition recognizes the following handlers

  * `compose`: Composes final message draft data

`TextComposer` state changes based on text change or suggestion selection are processed via middleware execution. The responsible executor is available as `TextComposer.middlewareExecutor`.

The executor registers the default middleware with the following middleware factories:

  1. createTextComposerPreValidationMiddleware
  2. createMentionsMiddleware
  3. createCommandsMiddleware

The mentions and commands middleware determines when to trigger suggestions offering and how to retrieve the suggestions items. This is done via `MentionsSearchSource` for mentions middleware and `CommandSearchSource` for commands middleware.

The mentions middleware and commands middleware handles data pagination and query loading state management out of the box. Both implement the `BaseSearchSource` API and allow for customization of debounce interval and page size.


    const commandSearchSource = new CommandSearchSource(channel, {
      debounceMs,
      pageSize,
    });
    const commandSearchSource = new MentionsSearchSource(channel, {
      debounceMs,
      pageSize,
    });

**Custom Pagination Logic**

We can custommize how the searched items are retrieved by overriding the `MentionsSearchSource` or `CommandSearchSource` method `query`. If the pagination supports cursor, the `next` value (cursor) should also be returned. We expect it to be a string:


    import {MentionsSearchSource} from 'stream-chat;

    class CustomMentionsSearchSource extends MentionsSearchSource {
      // ...
      query = async (searchQuery: string) => {
        let result;
        // custom logic...

        return {
          items: result.items,
          next: result.cursor,
        };
      }
    }

Besides the basic configuration `MentionsSearchSource` allows to configure the following:

  * mentionAllAppUsers - forces the `MentionsSearchSource` instance to always trigger users query instead of just channel members query
  * textComposerText - allows to keep the whole text composer text, not only the search query extracted from the trigger
  * transliterate - allows to transliterate the mention names



    import { default: transliterate } from '@stream-io/transliterate';

    const commandSearchSource = new MentionsSearchSource(channel, {
      debounceMs,
      mentionAllAppUsers,
      pageSize,
      textComposerText,
      transliterate,
    });

Further we can customize how the data is retrieved, filtered, transformed and maintained.

**Query Parameters Customization**

The generation of search parameters can be customized by overriding the generation logic based on the search query value:


    import { MentionsSearchSource } from "stream-chat";
    import type {
      UserFilters,
      UserSort,
      UserOptions,
      MemberFilters,
      MemberSort,
      UserOptions,
    } from "stream-chat";

    class CustomMentionsSearchSource extends MentionsSearchSource {
      // ...
      prepareQueryUsersParams = (
        searchQuery: string,
      ): { filters: UserFilters; sort: UserSort; options: UserOptions } => {
        //... generate filters, sort, options
        return { filers, sort, options };
      };
      prepareQueryUsersParams = (
        searchQuery: string,
      ): { filters: MemberFilters; sort: MemberSort; options: UserOptions } => {
        //... generate filters, sort, options
        return { filers, sort, options };
      };
    }

Or we can overwrite the parameters if they do not depend on the search query value (normally does not apply to filters):


    mentionsSearchSource.userSort = { name: -1 };
    mentionsSearchSource.memberSort = { name: -1 };
    mentionsSearchSource.searchOptions = { include_deactivated_users: true };

**Custom Results Filtering**

Apply custom filtering logic to the query results before they are committed to the search source state.


    import {MentionsSearchSource} from 'stream-chat;
    import type {UserSuggestion} from 'stream-chat;

    const mentionsFilter (item: UserSuggestion) => {
      //... custom filtering logic
    }

    class CustomMentionsSearchSource extends MentionsSearchSource {
      // ...
      filterQueryResults = (items: UserSuggestion[]) => {
        return items.filter(mentionsFilter)
      }
    }

**State Retention Between Searches** With a new search query the search state is reset to the initial form except for items, which are kept from the last search result until query results are committed to the state. This is meant to prevent UI flickering between empty state and the first page results on every text change. This behavior can be, hovewever, changed by overriding `getStateBeforeFirstQuery` method:


    import {MentionsSearchSource} from 'stream-chat;

    class CustomMentionsSearchSource extends MentionsSearchSource {
      // ...
      getStateBeforeFirstQuery = (newSearchString: string) => {
        return {
          ...super.getStateBeforeFirstQuery(newSearchString),
          items: [],
        };
      }
    }

There are various level of detail in which text composition can be customized. We will demonstrate these use cases from the most general to the most specific.

**Change Trigger or Minimum Trigger Characters**


     textComposer.middlewareExecutor.use([
      createMentionsMiddleware(textComposer.channel, {
        minChars: 3,
        trigger: "__",
      }),
      createCommandsMiddleware(textComposer.channel, { minChars: 3, trigger: "Â§" }),
    ]);

**Provide Custom Search Source**

If there is a need to redefine how the suggestion items are retrieved, we can provide a custom search source:


    const searchSource = new CustomSearchSource();

    textComposer.middlewareExecutor.use([
      createCommandsMiddleware(textComposer.channel, { searchSource }),
    ]);

**Custom Suggestion and Trigger**

To add a new suggestion type and associate it with a trigger, we need to create a brand new middleware and insert it at a convenient position in the execution flow.


    import { ChannelSearchSource } from 'stream-chat';
    import type {Channel, MessageComposer, TextComposerMiddlewareExecutorState} from 'stream-chat';

    type ChannelWithId = Channel & {id: string};

    type ChannelMentionsMiddleware = Middleware<
      TextComposerMiddlewareExecutorState<ChannelWithId>,
      'onChange' | 'onSuggestionItemSelect'
    >;
    // Custom middleware for emoji suggestions
    const createTextComposerChannelMiddleware: TextComposerMiddleware = (composer: MessageComposer) =>  {
      const trigger = '#';
      const channelSearchSource = new ChannelSearchSource(composer.client)
      return {
        id: 'text-composer/channels-middleware',
        handlers: {
          onChange: async ({ state, forward, next }) => {
            const { text } = state;
            if (!text) return forward();
            const newState = {};

            // identifying the trigger, removing existin suggestions ...

            return next(newState);
          },
        onSuggestionItemSelect: async ({ state, forward, next }) => {
          const { selectedSuggestion: channel } = state.change;

          return next({
            ...state,
            text: insertTextAtSelection(state.text, channel, state.selection),
            suggestions: undefined
          });
        }
      });
    };

    // Register the middleware
    textComposer.middlewareExecutor.insert({
      middleware: [emojiMiddleware],
      position: { before: 'stream-io/text-composer/mentions-middleware' }
    });

`PollComposer` state changes and composition are processed via middleware execution. The responsible executors are available as `PollComposer.compositionMiddlewareExecutor` and `PollComposer.stateMiddlewareExecutor`.

The executors register the default middleware with the following middleware factories:

  1. createPollComposerStateMiddleware
  2. createPollCompositionValidationMiddleware

The state middleware reflects the poll creation form fields validation and updates, while the composition middleware validates the final poll composition before creation.

You can customize the middleware behavior at various levels:

**Basic Configuration**


     const stateMiddleware = createPollComposerStateMiddleware({
      processors: customProcessors,
      validators: customValidators,
    });

**Custom Validation Rules**


     const customValidators = {
      handleFieldChange: {
        name: ({ value }) => {
          if (value.length < 3)
            return { name: "Name must be at least 3 characters" };
          return { name: undefined };
        },
      },
    };

**Custom State Processing**


     const customProcessors = {
      handleFieldChange: {
        options: ({ value, data }) => {
          // Custom option processing logic
          return {
            options: value.map((option) => ({
              ...option,
              text: option.text.toUpperCase(),
            })),
          };
        },
      },
    };

Continue reading for a detailed explanation on PollComposer middleware.

The `PollComposerStateChangeMiddlewareValue` represents the state passed through the middleware execution chain. It contains:

  * `previousState`: The state before the current change
  * `nextState`: The next PollComposer state to be committed after successful middleware execution
  * `targetFields`: The fields being updated in the current change

The `PollComposerState` type includes:


    type PollComposerState = {
      data: {
        allow_answers: boolean;
        allow_user_suggested_options: boolean;
        description: string;
        enforce_unique_vote: boolean;
        id: string;
        max_votes_allowed: string;
        name: string;
        options: Array<{ id: string; text: string }>;
        user_id?: string;
        voting_visibility: VotingVisibility;
      };
      errors: Record<string, string>;
    };

The state middleware handles field changes and blur events, providing validation and state processing capabilities. It supports customization through processors and validators.

The following keys from `PollComposerState['data']` can be used for custom processors and validators:


    type PollComposerDataKeys = {
      allow_answers: boolean;
      allow_user_suggested_options: boolean;
      description: string;
      enforce_unique_vote: boolean;
      id: string;
      max_votes_allowed: string;
      name: string;
      options: Array<{ id: string; text: string }>;
      user_id?: string;
      voting_visibility: VotingVisibility;
    };


    const stateMiddleware = createPollComposerStateMiddleware({
      processors: {
        handleFieldChange: {
          // Custom processors for field changes
          // Available keys: allow_answers, allow_user_suggested_options, description,
          // enforce_unique_vote, id, max_votes_allowed, name, options, user_id, voting_visibility
        },
        handleFieldBlur: {
          // Custom processors for field blur events
          // Available keys: allow_answers, allow_user_suggested_options, description,
          // enforce_unique_vote, id, max_votes_allowed, name, options, user_id, voting_visibility
        },
      },
      validators: {
        handleFieldChange: {
          // Custom validators for field changes
          // Available keys: allow_answers, allow_user_suggested_options, description,
          // enforce_unique_vote, id, max_votes_allowed, name, options, user_id, voting_visibility
        },
        handleFieldBlur: {
          // Custom validators for field blur events
          // Available keys: allow_answers, allow_user_suggested_options, description,
          // enforce_unique_vote, id, max_votes_allowed, name, options, user_id, voting_visibility
        },
      },
    });

The middleware comes with built-in validators for common poll fields applied as follows:

**handleFieldChange**

  * `pollStateChangeValidators`
  * `defaultPollFieldChangeEventValidators`
  * `customValidators.handleFieldChange

**handleFieldBlur**

  * `pollStateChangeValidators`
  * `defaultPollFieldBlurEventValidators`
  * `customValidators.handleFieldBlur`

The middleware includes processors for mutating the new state:

**handleFieldChange**

  * `pollCompositionStateProcessors`
  * `customProcessors.handleFieldChange`

**handleFieldBlur**

  * there are no default state processors
  * `customProcessors.handleFieldBlur`

The composition middleware validates the final poll state before creation (existing errors, at least on option, etc.):


    const compositionMiddleware =
      createPollCompositionValidationMiddleware(composer);

| `handleSubmit` | It is possible to customize the message composition via `MessageComposer.compositionMiddlewareExecutor` and draft composition via `MessageComposer.draftCompositionMiddlewareExecutor`. Also, the sending of the message is customizable via `Channel` prop `doSendMessageRequest`. |

The custom message data can be injected via custom middleware handlers or by setting the data directly:

`MessageComposer` uses middleware executors to handle message composition and draft composition. The executors are available as:

  * `MessageComposer.compositionMiddlewareExecutor` \- for message composition
  * `MessageComposer.draftCompositionMiddlewareExecutor` \- for draft composition

The `MessageComposerMiddlewareState` is the core state object that middleware operates on. It has three main fields:


    export type MessageComposerMiddlewareState = {
      message: Message | UpdatedMessage;
      localMessage: LocalMessage;
      sendOptions: SendMessageOptions;
    };

1. **localMessage** : `MessageResponse`

     * Used for local channel state updates
     * Contains the message data that will be shown in the UI immediately
     * Can include temporary data or UI-specific properties
     * Example: Adding temporary IDs, local timestamps, or UI-specific flags
  2. **message** : `MessageResponse`

     * Contains the data that will be sent to the backend
     * Should match the expected backend message structure - `Message` type
     * Used for actual message creation/update
     * Example: Final message content, attachments, metadata
  3. **sentOptions** : `SendMessageOptions | UpdateMessageOptions`

     * Contains options for sending/updating the message
     * Must match either `SendMessageOptions` or `UpdateMessageOptions` type

The composition middleware executor registers the following middleware in order:

  1. `stream-io/message-composer-middleware/text-composition` (`createTextComposerCompositionMiddleware`)

     * Adds text to the composition
     * Adjusts mentioned users array based on the current text
  2. `stream-io/message-composer-middleware/attachments` (`createAttachmentsCompositionMiddleware`)

     * Add the `AttachmentManager.attachments` into the `attachments` array of both `localMessage` and `message`
     * Discards the composition process if there are any unfinished uploads in progress
  3. `stream-io/message-composer-middleware/link-previews` (`createLinkPreviewsCompositionMiddleware`)

     * Includes loaded link previews in the attachments array
     * Determines whether link enrichment should be skipped server-side
  4. `stream-io/message-composer-middleware/own-state` (`createMessageComposerStateCompositionMiddleware`)

     * Enriches `localMessage` and `message` with relevant `MessageComposer` state values (poll id, quoted message id)
  5. `stream-io/message-composer-middleware/custom-data` (`createCustomDataCompositionMiddleware`)

     * Enriches the composition with `CustomDataManager.customMessageData`
  6. `stream-io/message-composer-middleware/data-validation (`createCustomDataCompositionMiddleware`)

     * Enforces text config parameter `maxLengthOnSend`
     * Discards composition if it can be considered empty or the data has not been changed locally (meaning the update took place based on `message.updated` and `draft.updated` WS events)
  7. `stream-io/message-composer-middleware/data-cleanup` (`createCompositionDataCleanupMiddleware`)

     * Converts the `message` payload from `Message` to `UpdatedMessage`
     * converst the `sendOptions` from `SendMessageOptions` to `UpdateMessageOptions`

The draft composition middleware executor registers:

  1. `stream-io/message-composer-middleware/draft-text-composition` (`createDraftTextComposerCompositionMiddleware`)

     * Adds text to the composition
     * Adjusts mentioned users array based on the current tex
  2. `stream-io/message-composer-middleware/draft-attachments` (`createDraftAttachmentsCompositionMiddleware`)

     * Add the `AttachmentManager.attachments` into the `attachments` array of both `localMessage` and `message`
     * Does not discard the composition process if there are any uploads in progress - just uncludes the successful uploads
  3. `stream-io/message-composer-middleware/draft-link-previews` (`createDraftLinkPreviewsCompositionMiddleware`)

     * Includes loaded link previews in the attachments array
  4. `stream-io/message-composer-middleware/draft-own-state` (`createDraftMessageComposerStateCompositionMiddleware`)

     * Enriches `localMessage` and `message` with relevant `MessageComposer` state values (poll id, quoted message id)
  5. `stream-io/message-composer-middleware/draft-custom-data` (`createDraftCustomDataCompositionMiddleware`)

     * Enriches the composition with `CustomDataManager.customMessageData`
  6. `stream-io/message-composer-middleware/draft-data-validation` (`createDraftCompositionDataCleanupMiddleware`)

     * Verifies whether draft can be created and discards the process if the draft cannot be created (is empty)

We can add custom transformation logic by adding a new composition the middleware ( contains `compose` handler):


    import type {
      MessageCompositionMiddleware,
      MessageComposerMiddlewareValueState,
      MiddlewareHandlerParams,
    } from "stream-chat";

    const customCompositionMiddleware = (
      composer: MessageComposer,
    ): MessageCompositionMiddleware => ({
      id: "message-composer/message-composer/custom-message-data",
      handlers: {
        compose: async ({
          state,
          next,
          forward,
        }: MiddlewareHandlerParams<MessageComposerMiddlewareValueState>) => {
          if (!composer.textComposer) return forward();

          const { mentionedUsers, text } = composer.textComposer;

          // Create new state objects
          const newLocalMessage = {
            ...state.localMessage,
            custom_ui_flag: true,
          };

          const newMessage = {
            ...state.message,
            custom_field: "value",
            mentioned_users: mentionedUsers.map((u) => u.id),
            text: text.toUpperCase(),
          };

          // Pass updated state to next middleware
          return next({
            ...state,
            localMessage: newLocalMessage,
            message: newMessage,
          });
        },
      },
    });

Similarly, we can customize draft composition:


    import type {
      MessageDraftCompositionMiddleware,
      MessageDraftComposerMiddlewareValueState,
      MiddlewareHandlerParams,
    } from "stream-chat";

    const customDraftMiddleware = (
      composer: MessageComposer,
    ): MessageDraftCompositionMiddleware => ({
      id: "message-composer/message-composer/custom-draft",
      handlers: {
        compose: async ({
          state,
          next,
          forward,
        }: MiddlewareHandlerParams<MessageDraftComposerMiddlewareValueState>) => {
          if (!composer.textComposer) return forward();

          const { text } = composer.textComposer;

          // Create new draft state
          const newDraft = {
            ...state.draft,
            custom_field: "draft_value",
            text: text.toLowerCase(),
          };

          // Pass updated state to next middleware
          return next({
            ...state,
            draft: newDraft,
          });
        },
      },
    });

When adding custom middleware, you can insert it at specific positions using the middleware IDs:


    // Add middleware after text composition
    messageComposer.compositionMiddlewareExecutor.insert({
      middleware: [customCompositionMiddleware],
      position: { after: "stream-io/message-composer-middleware/text-composition" },
    });

    // Add middleware before draft composition
    messageComposer.draftCompositionMiddlewareExecutor.insert({
      middleware: [customDraftMiddleware],
      position: {
        before: "stream-io/message-composer-middleware/draft-text-composition",
      },
    });

    // Replace existing middleware
    messageComposer.compositionMiddlewareExecutor.replace([newMiddleware]);

    // Set middleware order
    messageComposer.compositionMiddlewareExecutor.setOrder([
      "stream-io/message-composer-middleware/text-composition",
      "custom-composition",
      "stream-io/message-composer-middleware/attachments",
      "stream-io/message-composer-middleware/link-previews",
      "stream-io/message-composer-middleware/custom-data",
      "stream-io/message-composer-middleware/data-validation",
      "stream-io/message-composer-middleware/data-cleanup",
    ]);

To disable middleware functionality, you can replace it with a no-op version:


    import type { MessageCompositionMiddleware } from "stream-chat";

    // Create a no-op middleware
    const disabledMiddleware: MessageCompositionMiddleware = {
      id: "message-composer/message-composer/text-composition",
      handlers: {
        compose: async ({ state, forward }) => {
          // Skip processing and forward to next middleware with unchanged state
          return forward();
        },
      },
    };

    // Replace the original middleware with the disabled version
    messageComposer.compositionMiddlewareExecutor.replace([disabledMiddleware]);

Triggering emoji suggestion while typing is handled by `TextComposer` middleware. The middleware is not enabled by default. To enable it we have to import it from `stream-chat-react/emojis` plugin and register as follows:


    import { createTextComposerEmojiMiddleware } from "stream-chat-react/emojis";
    import type { TextComposerMiddleware } from "stream-chat";

    import { init, SearchIndex } from "emoji-mart";
    import data from "@emoji-mart/data";

    init({ data });

    const Component = () => {
      useEffect(() => {
        if (!chatClient) return;

        chatClient.setMessageComposerSetupFunction(({ composer }) => {
          composer.textComposer.middlewareExecutor.insert({
            middleware: [
              createTextComposerEmojiMiddleware(
                SearchIndex,
              ) as TextComposerMiddleware,
            ],
            position: { before: "stream-io/text-composer/mentions-middleware" },
            unique: true,
          });
        });
      }, [chatClient]);
    };

We can customize the middleware in the following ways:

**Change Trigger or Minimum Trigger Characters**


     textComposer.middlewareExecutor.use([
      createTextComposerEmojiMiddleware(SearchIndex, {
        minChars: 3,
        trigger: "__",
      }),
    ]);

**Provide Custom Search Source**

If there is a need to redefine how the suggestion items are retrieved, we can provide a custom search source:


    const searchSource = new CustomSearchSource();

    textComposer.middlewareExecutor.use([
      createTextComposerEmojiMiddleware(searchSource),
    ]);

[PreviousMessageComposer API](/chat/docs/sdk/react/components/message-input-components/message-composer-api/)[NextOverview](/chat/docs/sdk/react/components/ai/overview/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

`ThreadList` is a component that displays a list of threads where the current user is a participant (this user either started a thread, replied to a thread or was tagged in a thread). It handles pagination and virtualization through the help of the [virtualized list component](https://virtuoso.dev). The rest of the business logic (data manipulation) lives within [`ThreadManager`](https://github.com/GetStream/stream-chat-js/blob/master/src/thread.ts) and [`Thread`](https://github.com/GetStream/stream-chat-js/blob/master/src/thread_manager.ts) classes. Data represented through `ThreadList` are accessible from client instance (`client.threads.state`).

The `ThreadList` component requires to be rendered within `Chat` component but apart from that does not require any other context to work.


    import { Chat, ThreadList } from "stream-chat-react";

    <Chat client={client}>
      {/*...*/}
      <ThreadList />
    </Chat>;

For extended âout of the boxâ functionality `ThreadList` can be rendered within [`ChatView.Threads`](/chat/docs/sdk/react/components/utility-components/chat-view/) component where individual items within the list become âselectableâ through the `ThreadViewContext`. Selected/active thread can be then accessed from this context as well. See [`ChatView` documentation](/chat/docs/sdk/react/components/utility-components/chat-view/) for extended functionality.


    import {
      Chat,
      ChatView,
      ThreadList,
      useThreadsViewContext,
    } from "stream-chat-react";

    const SelectedThread = () => {
      const { activeThread } = useThreadsViewContext();

      return null;
    };

    <Chat client={client}>
      <ChatView>
        <ChatView.Selector />
        {/*...*/}
        <ChatView.Threads>
          <ThreadList />
          <SelectedThread />
        </ChatView.Threads>
      </ChatView>
    </Chat>;

Props to be passed to the underlying [`react-virtuoso` virtualized list dependency](https://virtuoso.dev/virtuoso-api/interfaces/VirtuosoProps).

Type
---
object

[PreviousMultiple Lists](/chat/docs/sdk/react/guides/multiple_channel_lists/)[NextThreadListItem](/chat/docs/sdk/react/components/core-components/thread-list-item/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

The `MessageComposer` serves as a central orchestrator for message creation and editing. It:

  * Manages the state of message composition
  * Handles different types of content (text, attachments, polls, etc.)
  * Provides draft functionality for saving message progress
  * Supports message editing and quoting
  * Integrates with the Stream Chat API for message operations

We can initiate the composer instance as follows:


    new MessageComposer({
      client, // StreamChat client instance
      compositionContext, // it is necessary to provide a Channel or Thread instance or LocalMessage object
      composition, // optional initial state like draft message or edited message
      config, // optional custom configuration
    });

Each `Channel` and `Thread` instance has its own `messageComposer` attribute assigned on instantiation. In case we need to edit a message, we pass the `LocalMessage` object to `compositionContext` and `composition` constructor parameters.

`MessageComposer` is built using a modular architecture with specialized managers for different aspects of message composition:

  * **TextComposer** : Handles text input, mentions, and text-related operations
  * **AttachmentManager** : Keeps message attachments state and manages file attachments uploads
  * **LinkPreviewsManager** : Processes and manages link previews in messages
  * **PollComposer** : Handles poll composition and creation
  * **CustomDataManager** : Allows for custom message and non-message related data

Each manager operates independently and keeps its own dedicated state. `MessageComposer` orchestrates their interactions.

The following are the general `MessageComposer` features:

  * **State Management** : Uses a reactive state management system to track changes
  * **Middleware Support** : Allows for custom processing of messages through middleware
  * **Draft System** : Supports saving and restoring message drafts
  * **Rich Content** : Handles various types of content including text, attachments, polls, and link previews
  * **Event System** : Provides event subscriptions for real-time updates
  * **Configurable** : Highly configurable through the MessageComposerConfig interface

One `MessageComposer` setup function per client, ideally youâd setup this function only once (or each time a specific dependency changes).


    import { defaultTextComposerMiddlewares } from "stream-chat";

    const chatClient = useCreateChatClient({
      apiKey,
      tokenOrProvider: userToken,
      userData: { id: userId, language: "en" },
    });

    const [emojisEnabled, setEmojisEnabled] = useState(false);

    useEffect(() => {
      chatClient.setMessageComposerSetupFunction(({ composer }) => {
        if (composer.contextType === "channel") {
          composer.textComposer.upsertMiddleware(
            defaultTextComposerMiddlewares.map(composer.channel),
          );

          if (emojisEnabled) {
            composer.textComposer.upsertMiddleware([
              createEmojiMiddleware(SearchIndex),
            ]);
          }

          return () => {
            composer.textComposer.removeMiddleware("emoji");
          };
        }
      });
    }, [chatClient, emojisEnabled]);

The `MessageComposer` can be configured at different levels, from global client-wide settings to individual manager configurations.

The configuration is defined by the `MessageComposerConfig` interface:


    type MessageComposerConfig = {
      drafts: {
        enabled: boolean; // Enables server-side draft functionality. Disabled by default.
      };
      attachments: {
        /**
         * Function to filter out files before being uploaded. The default forwards without filtering.
         */
        fileUploadFilter: (file: FileLike) => boolean;
        /**
         * Maximum file upload attachments per message. Default is 10.
         */
        maxNumberOfFilesPerMessage: number;
        /**
         * Allowed file types.
         * Expected are unique file type specifiers
         * (https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/accept#unique_file_type_specifiers).
         * The default is an empty array - all files accepted.
         */
        acceptedFiles: string[];
        /**
         * Custom upload request (and possibly logic). For example upload to custom CDN.
         */
        doUploadRequest?: (
          file: FileLike,
        ) => Promise<{ file: string; thumb_url?: string }>;
      };
      linkPreviews: {
        /**
         * Enables link previews. Disabled by default.
         */
        enabled: boolean;
        /**
         * Debounce time for URL detection and enrichment. By default 1500ms.
         */
        debounceURLEnrichmentMs: number;
        /**
         * Custom URL detection function. The default is linkifyjs.find.
         */
        findURLFn: (text: string) => string[];
        /**
         * Custom logic to be invoked when a specific link preview is dismissed
         */
        onLinkPreviewDismissed?: (linkPreview: LinkPreview) => void;
      };
      text: {
        /**
         * Enables text input. Enabled by default.
         */
        enabled: boolean;
        /**
         * Enable sending typing events which are used to display typing indicators. Enabled by default.
         */
        publishTypingEvents: boolean;
        /**
         * Initial text value if draft or existing message is not available.
         */
        defaultValue?: string;
        /**
         * The message text will be trimmed to maxLengthOnEdit on text change or suggestion selection.
         */
        maxLengthOnEdit?: number;
        /**
         * The message text will be trimmed to maxLengthOnSend during the final message composition before being sent.
         */
        maxLengthOnSend?: number;
      };
    };

**1\. Global Configuration**

Use `client.setMessageComposerSetupFunction` to configure all `MessageComposer` instances:


    client.setMessageComposerSetupFunction(({ composer }) => {
      composer.updateConfig({
        drafts: { enabled: true },
        attachments: {
          maxNumberOfFilesPerMessage: 5,
          acceptedFiles: ["image/*", "video/*"],
        },
      });
    });

This configuration will be applied also to all new `MessageComposer` instances (for example created for editing a message).

**2\. Instance-Specific Configuration**

Configure a specific `MessageComposer` instance using `updateConfig`:


    messageComposer.updateConfig({
      text: {
        enabled: true,
        publishTypingEvents: false,
      },
    });

**3\. Manager-Level Configuration**

Each manager can be configured individually through its properties:


    // Configure TextComposer
    messageComposer.textComposer.defaultValue = "Dear Customer Service";

    // Configure AttachmentManager
    messageComposer.attachmentManager.acceptedFiles(["image/*", "video/*"]);

    // Configure LinkPreviewsManager
    messageComposer.linkPreviewsManager.enabled = true;

    // General message composition parameters. Applies to drafts.
    messageComposer.updateConfig({ drafts: enabled });

We can provide a custom message id generator function by overriding the `MessageComposer.generateId` static method:


    messageComposer.generateId = customGenerator;

Each `MessageComposer` has a `contextType` getter which gets evaluated from the `compositionContext` value provided at construction time. A composer can have a context type of `channel`, `thread`, `legacy_thread` or `message`.

You might not need this information but itâs there when you need it; for example when youâre deciding what middlewares to apply to only channel-based or thread-based composers.

:::note Type `legacy_thread` is a simple message object extended with `legacyThreadId` property whose value equals to that messageâs `id`. :::

The `useMessageComposer` hook provides access to the appropriate `MessageComposer` instance based on the current context (channel, thread, message). It automatically handles different composition scenarios:

  * Composing a new message in a channel
  * Replying in a thread
  * Editing an existing message
  * Replying in a legacy thread that does not rely on Thread instance

The usage:


    import { useMessageComposer } from "stream-chat-react";

    const MyComponent = () => {
      const messageComposer = useMessageComposer();
      const handleSend = async () => {
        // Access composer features
        const { localMessage, message, sendOptions } =
          await messageComposer.compose();
        // Handle the composed message
        // ...
      };

      return <button onClick={handleSend}>Send</button>;
    };

The hook automatically resolves the correct `MessageComposer` instance based on the following hierarchy:

  1. **Editing a message** : If a message is being edited, a new composer instance is created for that specific message
  2. **Thread reply** : If in a thread context, it uses the threadâs composer instance
  3. **Legacy thread reply** : If replying to a message in a context that does not rely on `Thread` instance that already contains its `MessageComposer` instance.
  4. **Channel message** : Falls back to the channelâs composer instance

It automatically does the following:

  * Registers the necessary subscriptions when the composer is mounted
  * Cleans up subscriptions when the component unmounts

The hook implements caching for composer instances in certain contexts:

  * Editing a message
  * Replying in a legacy thread

This ensures that the same composer instance is reused when returning to these contexts, preserving the composition state.

const {
      attachments,
      availableUploadSlots,
      blockedUploadsCount,
      failedUploadsCount,
      isUploadEnabled,
      pendingUploadsCount,
      successfulUploadsCount,
      uploadsInProgressCount,
    } = useAttachmentManagerState();

Use this hook when you need to:

  * Access the attachment data
  * Track attachment upload progress and status
  * Show upload progress indicators
  * Enable/disable UI elements based on upload state
  * Display attachment counts and limits

const canCreatePoll = useCanCreatePoll();

Use this hook to:

  * Determine if a poll can be created with the current state
  * Enable/disable the send button

const hasSendableData = useMessageComposerHasSendableData();

Use this hook to:

  * Enable/disable the send button

[PreviousTypingContext](/chat/docs/sdk/react/components/contexts/typing_context/)[NextMessageComposer API](/chat/docs/sdk/react/components/message-input-components/message-composer-api/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

The `MessageInputContext` is established within the [`MessageInput`](/chat/docs/sdk/react/components/message-input-components/message_input/) component. The value is the combination of the `MessageInputProps`, `MessageInputState` (returned by the `useMessageInputState` hook), and `cooldownTimerState` (returned by the `useCooldownTimer hook`). It provides data to the [Input UI](/chat/docs/sdk/react/components/message-input-components/input_ui/) component and its children. Use the values stored within this context to build a custom Input UI component. You can access the context values by calling the `useMessageInputContext` custom hook.

Pull values from context with our custom hook:


    const { autocompleteTriggers, handleSubmit } = useMessageInputContext();

Additional props to be consumed by the underlying `TextareaComposer` component.


    type additionalTextareaProps = Omit<
      React.TextareaHTMLAttributes<HTMLTextAreaElement>,
      "defaultValue" | "style" | "disabled" | "value"
    >;

Function to clear the editing state while editing a message.

Type
---
() => void

Function to manually close the list of supported slash commands.

Type
---
() => void

Function to manually close the list of potential users to mention.

Type
---
() => void

If slow mode is enabled, the required wait time between messages for each user.

Type
---
number

If slow mode is enabled, the amount of time remaining before the connected user can send another message.

Type
---
number

If true, disables the text input.

Type| Default
---|---
boolean| false

Function called when a single link preview is dismissed.

Type
---
(linkPreview: LinkPreview) => void

Custom class constructor to override default `NimbleEmojiIndex` from [âemoji-martâ](https://www.npmjs.com/package/emoji-mart).

Type| Default
---|---
constructor| [ComponentContext[âEmojiIndexâ]](/chat/docs/sdk/react/components/contexts/component_context#emojiindex)

If true, focuses the text input on component mount.

Type| Default
---|---
boolean| false

Function that runs onSubmit to the underlying `textarea` component.

Type
---
(event: React.BaseSyntheticEvent) => void

Allows to hide MessageInputâs send button. Used by `MessageSimple` to hide the send button in `EditMessageForm`. Received from `MessageInputProps`.

Type| Default
---|---
boolean| false

Signals that the MessageInput is rendered in a message thread (Thread component).

Type
---
boolean

Currently, `Enter` is the default submission key and `Shift`+`Enter` is the default combination for the new line. If specified, this function overrides the default behavior specified previously.

Type
---
(event: KeyboardEvent) => boolean

Max number of rows the underlying `textarea` component is allowed to grow.

Type| Default
---|---
number| 10

Min number of rows the underlying `textarea` will start with.

Type| Default
---|---
number| 1

Function that runs onPaste to the underlying `textarea` component.

Type
---
(event: React.ClipboardEvent<HTMLTextAreaElement>) => void

Function to override the default submit handler.


    type overrideSubmitHandler = (params: {
      cid: string; // target channel CID
      localMessage: LocalMessage; // object representing the local message data used for UI update
      message: Message; // object representing the payload sent to the server for message creation / update
      sendOptions: SendMessageOptions;
    }) => Promise<void> | void;


    import { MessageInput } from "stream-chat-react";
    import type { MessageInputProps } from "stream-chat-react";

    const CustomMessageInput = (props: MessageInputProps) => {
      const submitHandler: MessageInputProps["overrideSubmitHandler"] = useCallback(
        async (params: {
          cid: string;
          localMessage: LocalMessage;
          message: Message;
          sendOptions: SendMessageOptions;
        }) => {
          // custom logic goes here

          await sendMessage({ localMessage, message, options: sendOptions });
        },
        [sendMessage],
      );

      return (
        <StreamMessageInput {...props} overrideSubmitHandler={submitHandler} />
      );
    };

When replying in a thread, the parent message object.

Type
---
object

React state hook function that sets the `cooldownRemaining` value.

Type
---
React.Dispatch<React.SetStateAction<number>>

React mutable ref placed on the underlying `textarea` component.

Type
---
React.MutableRefObject<HTMLTextAreaElement>

[PreviousMessageInput](/chat/docs/sdk/react/components/message-input-components/message_input/)[NextMessageInput Hooks](/chat/docs/sdk/react/hooks/message_input_hooks/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

The `MessageContext` is established within the [`Message`](/chat/docs/sdk/react/components/message-components/message/) component. It provides data to the [Message UI](/chat/docs/sdk/react/components/message-components/message_ui/) component and its children. Use the values stored within this context to build a custom Message UI component. You can access the context values by calling the `useMessageContext` custom hook.

Pull values from context with our custom hook:


    const { message, threadList } = useMessageContext();

If true, actions such as edit, delete, flag, etc. are enabled on the message.

Type| Default
---|---
boolean| true

Additional props to be passed to the underlying [`MessageInput`](/chat/docs/sdk/react/components/message-input-components/message_input/) component thatâs rendered while editing.

Type
---
object

Call this function to keep message list scrolled to the bottom when the message list container scroll height increases (only available in the `VirtualizedMessageList`). An example use case is that upon userâs interaction with the application, a new element appears below the last message. In order to keep the newly rendered content visible, the `autoscrollToBottom` function can be called. The container, however, is not scrolled to the bottom, if already scrolled up more than 4px from the bottom.

Type
---
() => void

When called, this function will exit the editing state on the message.

Type
---
(event?: React.BaseSyntheticEvent) => void

An object containing custom message actions (key) and function handlers (value). The key is used as a display text inside the button. Therefore, it should not be cryptic but rather bear the end user in mind when formulating it.


    const customActions = {
      "Copy text": (message) => {
        navigator.clipboard.writeText(message.text || "");
      },
    };

    <MessageList customMessageActions={customActions} />;

Custom action item âCopy textâ in the message actions box:

![Image of a custom action item ](/_astro/message-actions-box-custom-actions.DTA9dLMh_Z1IKuL8.webp)

Type
---
object

If true, the message toggles to an editing state.

Type| Default
---|---
boolean| false

When true, the message is the last one in a group sent by a specific user (only used in the `VirtualizedMessageList`).

Type
---
boolean

When true, the message is the first one in a group sent by a specific user (only used in the `VirtualizedMessageList`).

Type
---
boolean

Overrides the default date formatting logic, has access to the original date object.

Type
---
(date: Date) => string

Function that returns an array of the allowed actions on a message by the currently connected user.

Type
---
() => MessageActionsArray

If true, group messages sent by each user (only used in the `VirtualizedMessageList`).

Type| Default
---|---
boolean| false

An array of potential styles to apply to a grouped message (ex: top, bottom, single).

Type| Options
---|---
string[]| â | âmiddleâ | âtopâ | âbottomâ | âsingleâ

Function that calls an action on a message.

Type
---
(dataOrName?: string | FormData, value?: string, event?: React.BaseSyntheticEvent) => Promise<void>

Function that removes a message from the current channel.

Type
---
(event: React.BaseSyntheticEvent) => Promise<void> | void

Function that edits a message.

Type
---
(event: React.BaseSyntheticEvent) => Promise<void> | void

Function that loads the reactions for a message.

Type
---
() => Promise<ReactionResponse[]> \

This function limits the number of loaded reactions to 1200. To customize this behavior, you can pass [a custom `ReactionsList` component](/chat/docs/sdk/react/components/message-components/reactions#handlefetchreactions/).

Function that flags a message.

Type
---
(event: React.BaseSyntheticEvent) => Promise<void> | void

Function that marks the message and all the following messages as unread in a channel.

Type
---
(event: React.BaseSyntheticEvent) => Promise<void> | void

Function that mutes the sender of a message.

Type
---
(event: React.BaseSyntheticEvent) => Promise<void> | void

Function that opens a [`Thread`](/chat/docs/sdk/react/components/core-components/thread/) on a message.

Type
---
(event: React.BaseSyntheticEvent) => Promise<void> | void

Function that pins a message in the current channel.

Type
---
(event: React.BaseSyntheticEvent) => Promise<void> | void

Function that adds/removes a reaction on a message.

Type
---
(reactionType: string, event: React.BaseSyntheticEvent) => Promise<void>

Function that retries sending a message after a failed request (overrides the function stored in `ChannelActionContext`).

Type
---
(message: LocalMessage) => Promise<void>

Whether to highlight and focus the message on load.

Type
---
boolean

When true, signifies the message is the parent message in a thread list.

Type| Default
---|---
boolean| false

Function that returns whether or not a message belongs to the current user.

Type
---
() => boolean

If true, sending reactions is enabled in the currently active channel.

Type| Default
---|---
boolean| true

The latest message ID in the current channel.

Type
---
string

The `StreamChat` message object, which provides necessary data to the underlying UI components.

Type
---
object

DOMRect object linked to the parent `MessageList` component.

Type
---
DOMRect

An array of users that have been muted by the connected user.

Type| Default
---|---
Mute[]| [ChannelStateContext[âmutesâ]](/chat/docs/sdk/react/components/contexts/channel_state_context)

Function that runs on click of an @mention in a message.

Type
---
(event: React.BaseSyntheticEvent) => Promise<void> | void

Function that runs on hover of an @mention in a message.

Type
---
(event: React.BaseSyntheticEvent) => Promise<void> | void

Function that runs on click of a user avatar.

Type
---
(event: React.BaseSyntheticEvent) => Promise<void> | void

Function that runs on hover of a user avatar.

Type
---
(event: React.BaseSyntheticEvent) => Promise<void> | void

The user roles allowed to pin messages in various channel types (deprecated in favor of `channelCapabilities`).

Type| Default
---|---
object| [defaultPinPermissions](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Message/utils.tsx)

An array of users that have read the current message.

Type
---
array

Custom function to render message text content.

Type| Default
---|---
function| [renderText](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Message/renderText/renderText.tsx)

Function to toggle the editing state on a message.

Type
---
(event: React.BaseSyntheticEvent) => Promise<void> | void

Sort options to provide to a reactions query. Affects the order of reacted users in the default reactions modal.

Type| Default
---|---
{ created_at: number }| reverse chronological order

Comparator function to sort reactions. Should have the same signature as an arrayâs `sort` method.

Type| Default
---|---
(this: ReactionSummary, that: ReactionSummary) => number| chronological order

If true, indicates that the current `MessageList` component is part of a `Thread`.

Type| Default
---|---
boolean| false

If true, renders HTML instead of markdown. Posting HTML is only supported server-side.

Type| Default
---|---
boolean| false

[PreviousMessage](/chat/docs/sdk/react/components/message-components/message/)[NextMessageBounceContext](/chat/docs/sdk/react/components/contexts/message_bounce_context/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

The `BaseImage` componentâs purpose is to display an image or a fallback if loading the resource has failed. The component is used internally by:

  * `Image` component - used to display image attachments in `Message`
  * `Gallery` component - used to display image gallery among `Message` attachments
  * `AttachmentPreviewList` component - used to display attachment previews in `MessageInput`

The default image fallbacks are rendered as follows:

![BaseImage in image attachment](/_astro/base-image-fallback-in-image-attachment.BJOk_kG__11vs6F.webp)

![BaseImage in image attachment gallery](/_astro/base-image-fallback-in-attachment-gallery.DfP9x-x1_dB5ad.webp)

![BaseImage in attachment preview](/_astro/base-image-fallback-in-attachment-preview.2xIWNCVn_Z2ucMyY.webp)

The default image fallback can be changed by applying a new CSS data image to the fallback mask in the `BaseImage`âs `<img/>` element. The data image has to be assigned to a CSS variable `--str-chat__image-fallback-icon` within the scope of `.str-chat` class. An example follows:


    .str-chat {
      --str-chat__image-fallback-icon: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iOSIgdmlld0JveD0iMCAwIDEwIDkiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgICA8cGF0aCBkPSJNOS4xOTk0OSAwLjMwNTY3MUM4LjkzOTQ5IDAuMDQ1NjcwNyA4LjUxOTQ5IDAuMDQ1NjcwNyA4LjI1OTQ5IDAuMzA1NjcxTDQuOTk5NDkgMy41NTlMMS43Mzk0OSAwLjI5OTAwNEMxLjQ3OTQ5IDAuMDM5MDAzOSAxLjA1OTQ5IDAuMDM5MDAzOSAwLjc5OTQ5MiAwLjI5OTAwNEMwLjUzOTQ5MiAwLjU1OTAwNCAwLjUzOTQ5MiAwLjk3OTAwNCAwLjc5OTQ5MiAxLjIzOUw0LjA1OTQ5IDQuNDk5TDAuNzk5NDkyIDcuNzU5QzAuNTM5NDkyIDguMDE5IDAuNTM5NDkyIDguNDM5IDAuNzk5NDkyIDguNjk5QzEuMDU5NDkgOC45NTkgMS40Nzk0OSA4Ljk1OSAxLjczOTQ5IDguNjk5TDQuOTk5NDkgNS40MzlMOC4yNTk0OSA4LjY5OUM4LjUxOTQ5IDguOTU5IDguOTM5NDkgOC45NTkgOS4xOTk0OSA4LjY5OUM5LjQ1OTQ5IDguNDM5IDkuNDU5NDkgOC4wMTkgOS4xOTk0OSA3Ljc1OUw1LjkzOTQ5IDQuNDk5TDkuMTk5NDkgMS4yMzlDOS40NTI4MyAwLjk4NTY3MSA5LjQ1MjgzIDAuNTU5MDA0IDkuMTk5NDkgMC4zMDU2NzFaIiBmaWxsPSIjNzI3NjdFIi8+Cjwvc3ZnPgo=");
    }

We can change the mask dimensions or color by applying the following rules to the imageâs class `.str-chat__base-image--load-failed`, that signals the image load has failed:


    :root {
      --custom-icon-fill-color: #223344;
      --custom-icon-width-and-height: 4rem 4rem;
    }

    .str-chat__base-image--load-failed {
      mask-size: var(--custom-icon-width-and-height);
      -webkit-mask-size: var(--custom-icon-width-and-height);
      background-color: var(--custom-icon-fill-color);
    }

The default `BaseImage` can be overridden by passing a custom component to `Channel` props:


    import { ComponentProps } from "react";
    import { Channel } from "stream-chat-react";

    const CustomBaseImage = (props: ComponentProps<"img">) => {
      // your implementation...
    };

    export const MyUI = () => {
      return (
        <Channel BaseImage={CustomBaseImage}>
          {
            {
              /* more components */
            }
          }
        </Channel>
      );
    };

The component accepts the `img` component props.

[PreviousAvatar](/chat/docs/sdk/react/components/utility-components/avatar/)[NextPoll](/chat/docs/sdk/react/components/message-components/poll/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

Recording voice messages is possible by enabling audio recording on `MessageInput` component.


    <MessageInput audioRecordingEnabled />

Once enabled, the `MessageInput` UI will render a `StartRecordingAudioButton`.

![Message composer with the recording button](/_astro/audio-recorder-start-recording-button.DKjucAMj_ZVLhvE.webp)

The default implementation of `StartRecordingAudioButton` button can be replaced with custom implementation through the `Channel` component context:


    <Channel StartRecordingAudioButton={CustomComponent}>

Click on the recording button will replace the message composer UI with `AudioRecorder` component UI.

![AudioRecorder UI with recording in progress](/_astro/audio-recorder-recording.DC3Ll8O7_JSkya.webp)

The default `AudioRecorder` component can be replaced by a custom implementation through the `Channel` component context:


    <Channel AudioRecorder={CustomComponent}>

Updates in `'microphone'` browser permission are observed and handled. If a user clicks the start recording button and the `'microphone'` permission state is `'denied'`, then a notification dialog `RecordingPermissionDeniedNotification` is rendered.

![RecordingPermissionDeniedNotification rendered when microphone permission is denied](/_astro/audio-recorder-permission-denied-notification.neBW7bkv_yH9ds.webp)

The dialog can be customized by passing own component to `Channel` component context:


    <Channel RecordingPermissionDeniedNotification={CustomComponent}>

By default, the recording is encoded into `audio/wav` format. In order to reduce the size you can use MP3 encoder that is based on [`lamejs` implementation](https://github.com/gideonstele/lamejs). Follow these steps to achieve the MP3 encoding capability.

  1. The library `@breezystack/lamejs` has to be installed as this is a peer dependency to `stream-chat-react`.



    npm install @breezystack/lamejs


    yarn add @breezystack/lamejs

  2. The MP3 encoder has to be imported separately as a plugin:



    import { MessageInput } from "stream-chat-react";
    import { encodeToMp3 } from "stream-chat-react/mp3-encoder";

    <MessageInput
      focus
      audioRecordingConfig={{ transcoderConfig: { encoder: encodeToMp3 } }}
    />;

The `AudioRecorder` UI switches between the following states

**1\. Recording state**

The recording can be paused or stopped.

![AudioRecorder UI in recording state](/_astro/audio-recorder-recording.DC3Ll8O7_JSkya.webp)

**2\. Paused state**

The recording can be stopped or resumed.

![AudioRecorder UI paused state](/_astro/audio-recorder-paused.C4j8zdAb_1HSe4g.webp)

**3\. Stopped state**

The recording can be played back before it is sent.

![AudioRecorder UI stopped state](/_astro/audio-recorder-stopped.CGAvNaZ8_Z1fEbEw.webp)

At any time, the recorder allows to cancel the recording and return to message composer UI by clicking the button with the bin icon.

The resulting recording is always uploaded on the recording completion. The recording is completed when user stops the recording and confirms the completion with a send button.

The behavior, when a message with the given recording attachment is sent, however, can be controlled through the `asyncMessagesMultiSendEnabled` configuration prop on `MessageInput`.


    <MessageInput asyncMessagesMultiSendEnabled audioRecordingEnabled />

And so the message is sent depending on `asyncMessagesMultiSendEnabled` value as follows:

`asyncMessagesMultiSendEnabled` value| Impact
---|---
`false` (default behavior)| immediately after a successful upload at one step on completion. In that case as a single attachment (voice recording only), no-text message is submitted
`true`| upon clicking the `SendMessage` button if `asyncMessagesMultiSendEnabled` is enabled

Enabling `asyncMessagesMultiSendEnabled` would allow users to record multiple voice messages or accompany the voice recording with text or other types of attachments.

The components consuming the `MessageInputContext` can access the recording state through the `recordingController`:


    import { useMessageInputContext } from "stream-chat-react";

    const Component = () => {
      const {
        recordingController: {
          completeRecording,
          permissionState,
          recorder,
          recording,
          recordingState,
        },
      } = useMessageInputContext();
    };

The controller exposes the following API:

Property| Description
---|---
`completeRecording`| A function that allows to stop the recording and upload it the back-end and submit the message if `asyncMessagesMultiSendEnabled` is disabled
`permissionState`| One of the values for microphone permission: `'granted'`, `'prompt'`, `'denied'`
`recorder`| Instance of `MediaRecorderController` that exposes the API to control the recording states (`start`, `pause`, `resume`, `stop`, `cancel`)
`recording`| Generated attachment of type `voiceRecording`. This is available once the recording is stopped.
`recordingState`| One of the values `'recording'`, `'paused'`, `'stopped'`. Useful to reflect the changes in `recorder` state in the UI.

[PreviousEmoji Picker](/chat/docs/sdk/react/components/message-input-components/emoji-picker/)[NextAttachment Selector](/chat/docs/sdk/react/components/message-input-components/attachment-selector/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

The `MessageList` component renders a scrollable list of messages. The UI for each individual message is rendered conditionally based on its `message.type` value. The list renders date separators, message reactions, new message notifications, system messages, deleted messages, and standard messages containing text and/or attachments.

By default, the `MessageList` loads the most recent 25 messages held in the `channel.state`. More messages are fetched from the Stream Chat API and loaded into the DOM on scrolling up the list. The currently loaded messages are held in the `ChannelStateContext` and can be referenced with our custom hook.


    const { messages } = useChannelStateContext();

The `MessageList` has no required props and by default pulls overridable data from the various contexts established in the [`Channel`](/chat/docs/sdk/react/components/core-components/channel/) component. Customization of the messages rendered within the list is handled by the [Message UI](/chat/docs/sdk/react/components/message-components/message_ui/) component.

As a context consumer, the `MessageList` component must be rendered as a child of the `Channel` component. It can be rendered with or without a provided `messages` prop. Providing your own `messages` value will override the default value drawn from the `ChannelStateContext`.

**Example 1** \- without `messages` prop


    <Chat client={client}>
      <ChannelList />
      <Channel>
        <MessageList />
        <MessageInput />
      </Channel>
    </Chat>

**Example 2** \- with `messages` prop


    const customMessages = [
      // array of messages
    ];

    <Chat client={client}>
      <ChannelList />
      <Channel>
        <MessageList messages={customMessages} />
        <MessageInput />
      </Channel>
    </Chat>;

The `MessageList` internally creates a mapping of message id to a style group. There are 4 style groups - `'middle' | 'top' | 'bottom' | 'single'`. Later these group style tags are incorporated into the class of the `<li/>` element that wraps the `Message` component. This allows us to style messages by their position in the message group. An example of such class is `str-chat__li str-chat__li--bottom`.

You can completely change the way the message list is rendered by providing a custom `renderMessages` function. This function takes all the messages fetched so far (along with some additional data) and returns an array of React elements to render. By overriding the default behavior, you can add custom elements to the message list, change the way messages are grouped, add custom separators between messages, etc.

If you provide a custom `renderMessages` function, itâs your responsibility to render each message type correctly. You can use the [default implementation](https://github.com/GetStream/stream-chat-react/blob/master/src/components/MessageList/renderMessages.tsx) as a reference. Or, if you just want to tweak a few things here and there, you can call `defaultRenderMessages` from your custom `renderMessages` function and build from there.

In this example, we use the default implementation for rendering a message list, and we add a custom element at the bottom of the list:


    const customRenderMessages: MessageRenderer = (options) => {
      const elements = defaultRenderMessages(options);

      elements.push(<li key="caught-up">You're all caught up!</li>);

      return elements;
    };

    const CustomMessageList = () => (
      <MessageList renderMessages={customRenderMessages} />
    );

Make sure that the elements you return have `key`, as they will be rendered as an array. Itâs also a good idea to wrap each element with `<li>` to keep your markup semantically correct.

`MessageList` will re-render every time `renderMessages` function changes. For best performance, make sure that you donât recreate `renderMessages` function on every render: either move it to the global or module scope, or wrap it with `useCallback`.

Custom message list rendering is only supported in `MessageList` and is currently not supported in `VirtualizedMessageList`.

Additional props to be passed to the `MessageInput` component, [available props](/chat/docs/sdk/react/components/message-input-components/message_input/#props/). It is rendered when editing a message.

Type
---
object

If true, picking a reaction from the `ReactionSelector` component will close the selector.

Type| Default
---|---
boolean| false

An object containing custom message actions (key) and function handlers (value). For each custom action a dedicated item (button) in [`MessageActionsBox`](/chat/docs/sdk/react/components/message-components/message_ui/) is rendered. The key is used as a display text inside the button. Therefore, it should not be cryptic but rather bear the end user in mind when formulating it.


    const customActions = {
      "Copy text": (message) => {
        navigator.clipboard.writeText(message.text || "");
      },
    };

    <MessageList customMessageActions={customActions} />;

Custom action item âCopy textâ in the message actions box:

![Image of a custom action item ](/_astro/message-actions-box-custom-actions.DTA9dLMh_Z1IKuL8.webp)

Type
---
object

If true, disables the injection of date separator UI components in the `Channel` `MessageList` component.

Type| Default
---|---
boolean| false

If true, disables the ability for users to quote messages.

Type| Default
---|---
boolean| false

Function that returns the notification text to be displayed when the delete message request fails. This function receives the deleted [message object](/chat/docs/javascript/message_format/) as its argument.

Type
---
(message: LocalMessage) => string

Function that returns the notification text to be displayed when loading message reactions fails. This function receives the current [message object](/chat/docs/javascript/message_format/) as its argument.

Type
---
(message: LocalMessage) => string

Function that returns the notification text to be displayed when a flag message request fails. This function receives the flagged [message object](/chat/docs/javascript/message_format/) as its argument.

Type
---
(message: LocalMessage) => string

Function that returns the notification text to be displayed when a flag message request succeeds. This function receives the flagged [message object](/chat/docs/javascript/message_format/) as its argument.

Type
---
(message: LocalMessage) => string

Function that returns the notification text to be displayed when a mark message unread request fails. This function receives the marked [message object](/chat/docs/javascript/message_format/) as its argument.

Type
---
(message: LocalMessage) => string

Function that returns the notification text to be displayed when a mark message unread request succeeds. This function receives the marked [message object](/chat/docs/javascript/message_format/) as its argument.

Type
---
(message: LocalMessage) => string

Function that returns the notification text to be displayed when a mute user request fails. This function receives the muted [user object](/chat/docs/javascript/update_users/) as its argument.

Type
---
(user: UserResponse) => string

Function that returns the notification text to be displayed when a mute user request succeeds. This function receives the muted [user object](/chat/docs/javascript/update_users/) as its argument.

Type
---
(user: UserResponse) => string

Function that returns the notification text to be displayed when a pin message request fails. This function receives the pinned [message object](/chat/docs/javascript/message_format/) as its argument.

Type
---
(message: LocalMessage) => string

Callback function to map each message in the list to a group style (`'middle' | 'top' | 'bottom' | 'single'`).

Type
---
(message: RenderedMessage, previousMessage: RenderedMessage, nextMessage: RenderedMessage, noGroupByUser: boolean, maxTimeBetweenGroupedMessages?: number) => GroupStyle

Whether the list has more items to load.

Type| Default
---|---
boolean| [ChannelStateContextValue[âhasMoreâ]](/chat/docs/sdk/react/components/contexts/channel_state_context#hasmore)

Position to render the `HeaderComponent` in the list.

Type
---
number

If true, removes the `MessageDeleted` components from the list.

Type| Default
---|---
boolean| false

If true, hides the `DateSeparator` component that renders when new messages are received in a channel thatâs watched but not active.

Type| Default
---|---
boolean| false

Additional props for the underlying [InfiniteScroll](https://github.com/GetStream/stream-chat-react/blob/master/src/components/InfiniteScrollPaginator/InfiniteScroll.tsx) component.

Type
---
object

Whether the list is currently loading more items.

Type| Default
---|---
boolean| [ChannelStateContextValue[âloadingMoreâ]](/chat/docs/sdk/react/components/contexts/channel_state_context#loadingmore)

Function called when more messages are to be loaded, provide your own function to override the handler stored in context.

Type| Default
---|---
function| [ChannelActionContextValue[âloadMoreâ]](/chat/docs/sdk/react/components/contexts/channel_action_context#loadmore)

Maximum time in milliseconds that should occur between messages to still consider them grouped together.

Type
---
number

Custom UI component to display an individual message.

Type| Default
---|---
component| [MessageSimple](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Message/MessageSimple.tsx)

Array of allowed message actions (ex: âeditâ, âdeleteâ, âreplyâ). To disable all actions, provide an empty array.

Type| Default
---|---
array| [âeditâ, âdeleteâ, âflagâ, âmuteâ, âpinâ, âquoteâ, âreactâ, âreplyâ]

The limit to use when paginating new messages (the page size).

After mounting, the `MessageList` component checks if the list is completely filled with messages. If there is some space left in the list, `MessageList` will load the next page of messages, but it will do so _only once_. This means that if your `messageLimit` is too low, or if your viewport is very large, the list will not be completely filled. Set the limit with this in mind.

Type| Default
---|---
number| 100

The messages to render in the list. Provide your own array to override the data stored in context.

Type| Default
---|---
array| [ChannelStateContextValue[âmessagesâ]](/chat/docs/sdk/react/components/contexts/channel_state_context#messages)

If true, turns off message UI grouping by user.

Type| Default
---|---
boolean| false

If true, only the sender of the message has editing privileges. If `false` also channel capability `update-any-message` has to be enabled in order a user can edit other usersâ messages.

Type| Default
---|---
boolean| false

Custom action handler function to run on click on a @mention in a message.

Type| Default
---|---
function| [ChannelActionContextValue[âonMentionsClickâ]](/chat/docs/sdk/react/components/contexts/channel_action_context#onmentionsclick)

Custom action handler function to run on hover over a @mention in a message.

Type| Default
---|---
function| [ChannelActionContextValue[âonMentionsHoverâ]](/chat/docs/sdk/react/components/contexts/channel_action_context#onmentionshover)

Custom action handler function to run on click of user avatar.

Type
---
(event: React.BaseSyntheticEvent, user: User) => void

Custom action handler function to run on hover of user avatar.

Type
---
(event: React.BaseSyntheticEvent, user: User) => void

Custom handler invoked when the button in the `Message` component that opens [`Thread`](/chat/docs/sdk/react/components/core-components/thread/) component is clicked. To be able to define custom logic to `openThread`, we need to have a wrapper around `MessageList` component and reach out to `ChannelActionContext` for the default `openThread` function.


    import { useCallback } from "react";
    import { MessageList, useChannelActionContext } from "stream-chat-react";
    import type { LocalMessage } from "stream-chat";

    const MessageListWrapper = () => {
      const { openThread: contextOpenThread } = useChannelActionContext();

      const openThread = useCallback(
        (message: LocalMessage, event?: React.BaseSyntheticEvent) => {
          // custom logic
          contextOpenThread(message, event);
        },
        [contextOpenThread],
      );

      return <MessageList openThread={openThread} />;
    };

Type| Default
---|---
`(message: LocalMessage, event?: React.BaseSyntheticEvent) => void`| [ChannelActionContextValue[âopenThreadâ]](/chat/docs/sdk/react/components/contexts/channel_action_context#openthread)

Custom function to render message text content.

Type| Default
---|---
function| [defaultRenderMessages](https://github.com/GetStream/stream-chat-react/blob/master/src/components/MessageList/renderMessages.tsx)

The function receives a single object with the following properties:

Name| Type| Description
---|---|---
components| [ComponentContextValue](/chat/docs/sdk/react/components/contexts/component_context/)| UI components, including possible overrides
customClasses| object| Object containing [custom CSS classnames](/chat/docs/sdk/react/components/core-components/chat#customclasses/) to override the libraryâs default container CSS
lastReceivedMessageId| string| The latest message ID in the current channel
messageGroupStyles| string[]| An array of potential styles to apply to a grouped message (ex: top, bottom, single)
messages| Array<[ChannelStateContextValue[âmessagesâ]](/chat/docs/sdk/react/components/contexts/channel_state_context#messages)>| The messages to render in the list
readData| object| The read state for for messages submitted by the user themselves
sharedMessageProps| object| Object containing props that can be directly passed to the `Message` component

The function is expected to return an array of valid React nodes: `Array<ReactNode>`. For best performance, each node should have a `key`.

Custom action handler to retry sending a message after a failed request.

Type| Default
---|---
function| [ChannelActionContextValue[âretrySendMessageâ]](/chat/docs/sdk/react/components/contexts/channel_action_context#retrysendmessage)

If true, `readBy` data supplied to the `Message` components will include all user read states per sent message. By default, only `readBy` data for a userâs most recently sent message is returned.

Type| Default
---|---
boolean| false

Allows to review changes introduced to messages array on per message basis (for example date separator injection before a message). The array returned from the function is appended to the array of messages that are later rendered into React elements in the `MessageList`.

The function expects a single parameter, which is an object containing the following attributes:

  * `changes` \- array of messages representing the changes applied around a given processed message
  * `context` \- configuration params and information forwarded from `processMessages`
  * `index` \- index of the processed message in the original messages array
  * `messages` \- array of messages retrieved from the back-end
  * `processedMessages` \- newly built array of messages to be later rendered

The `context` has the following parameters:

  * `userId` \- the connected user ID;
  * `enableDateSeparator` \- flag determining whether the date separators will be injected Enable date separator
  * `hideDeletedMessages` \- flag determining whether deleted messages would be filtered out during the processing
  * `hideNewMessageSeparator` \- disables date separator display for unread incoming messages
  * `lastRead`: Date when the channel has been last read. Sets the threshold after everything is considered unread

The example below demonstrates how the custom logic can decide, whether deleted messages should be rendered on a given date. In this example, the deleted messages neither the date separator would be rendered if all the messages on a given date are deleted.


    const getMsgDate = (msg) =>
      (msg &&
        msg.created_at &&
        isDate(msg.created_at) &&
        msg.created_at.toDateString()) ||
      "";

    const dateSeparatorFilter = (msg) => msg.customType !== "message.date";

    const msgIsDeleted = (msg) => msg.type === "deleted";

    const reviewProcessedMessage = ({
      changes,
      context,
      index,
      messages,
      processedMessages,
    }) => {
      if (!context.enableDateSeparator) return changes;

      const changesWithoutSeparator = changes.filter(dateSeparatorFilter);
      const dateSeparatorInjected =
        changesWithoutSeparator.length !== changes.length;
      const previousProcessedMessage =
        processedMessages[processedMessages.length - 1];
      const processedMessage = messages[index];
      const processedMessageDate = getMsgDate(processedMessage);

      if (dateSeparatorInjected) {
        if (!processedMessageDate) return changes;
        const followingMessages = messages.slice(index + 1);
        let allFollowingMessagesOnDateDeleted = false;

        for (const followingMsg of followingMessages) {
          const followingMsgDate = getMsgDate(followingMsg);
          if (followingMsgDate !== processedMessageDate) break;
          allFollowingMessagesOnDateDeleted = followingMsg.type === "deleted";
        }

        return allFollowingMessagesOnDateDeleted ? [] : changes;
      } else if (
        msgIsDeleted(processedMessage) &&
        getMsgDate(previousProcessedMessage) !== getMsgDate(processedMessage)
      ) {
        return [];
      } else {
        return changes;
      }
    };

The pixel threshold to determine whether the user is scrolled up in the list. When scrolled up in the active channel, the `MessageNotification` component displays when new messages arrive.

Type| Default
---|---
number| 200

The floating notification informing about unread messages will be shown when the `UnreadMessagesSeparator` is not visible. The default is false, that means the notification is shown only when viewing unread messages.

Type| Default
---|---
boolean| false

Comparator function to sort reactions. Should have the same signature as the `sort` method for a string array.

Type| Default
---|---
(this: ReactionSummary, that: ReactionSummary) => number| chronological order

If true, renders HTML instead of markdown. Posting HTML is only supported server-side.

Type| Default
---|---
boolean| false

[PreviousThreadListItem](/chat/docs/sdk/react/components/core-components/thread-list-item/)[NextVirtualizedMessageList](/chat/docs/sdk/react/components/core-components/virtualized_list/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

The SDK comes with built-in support for adding reactions to messages. The component library provides three default components to enable reaction selection and display:

  * [`ReactionSelector`](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Reactions/ReactionSelector.tsx) \- allows the connected user to select a reaction on a message
  * [`ReactionsList`](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Reactions/ReactionsList.tsx) (and [`ReactionsListModal`](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Reactions/ReactionsListModal.tsx)) - displays the reactions added to a message
  * [`SimpleReactionsList`](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Reactions/SimpleReactionsList.tsx) \- displays a minimal list of the reactions added to a message

![Default UI of ReactionsList and ReactionSelector](/_astro/reactions-list-and-reaction-selector.cyob46g5_Z1MgN19.webp)

![Default UI of ReactionsListModal](/_astro/reactions-list-modal.B-0MoFnN_Z1cbtju.webp)

By default, reactions are sorted chronologically by the first time reaction type was used. You can change this behavior by passing the `sortReactions` prop to the `MessageList` (or `VirtualizedMessageList`).

In this example, we sort the reactions in the descending order by the number of users:


    function sortByReactionCount(a, b) {
      return b.reactionCount - a.reactionCount;
    }

    <Chat client={client}>
      <Channel
        channel={channel}
        ReactionSelector={CustomReactionSelector}
        ReactionsList={CustomReactionsList}
      >
        <MessageList sortReactions={sortByReactionCount} />
        <MessageInput />
      </Channel>
    </Chat>;

For better performance, keep the sorting function memoized with `useCallback`, or declare it in either global or module scope.

Similarly, the `reactionDetailsSort` object can be passed to the `MessageList` (or `VirtualizedMessageList`) to sort the list of reacted users. The default implementation used by the reactions list modal dialog sorts users in the reverse chronological order of their reactions.

See [Reactions Customization](/chat/docs/sdk/react/guides/theming/reactions/) guide on how to change default reactions or how to replace default `ReactionsList` and `ReactionSelector` components.

Custom UI component to display a userâs avatar.

Type| Default
---|---
component| [Avatar](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Avatar/Avatar.tsx)

If true, shows the userâs avatar with the reaction.

Type| Default
---|---
boolean| true

Function that adds/removes a reaction on a message (overrides the function coming from `MessageContext`).

Type| Default
---|---
(reactionType: string, event: React.BaseSyntheticEvent) => Promise<void>| [MessageContextValue[âhandleReactionâ]](/chat/docs/sdk/react/components/contexts/message_context#handlereaction)

An array of the reaction objects to display in the list (overrides `message.latest_reactions` from `MessageContext`).

Type
---
array

An array of own reaction objects to display in the list (overrides `message.own_reactions` from `MessageContext`).

Type
---
array

An object that keeps track of the reactions on a message (overrides `message.reaction_groups` from `MessageContext`).

Type
---
{ [key: reactionType]: ReactionGroupResponse }

A list of the currently supported reactions on a message.

Type| Default
---|---
array| [defaultReactionOptions](https://github.com/GetStream/stream-chat-react/blob/v11.0.0/src/components/Reactions/reactionOptions.tsx)

If true, adds a CSS class that reverses the horizontal positioning of the selector.

Type| Default
---|---
boolean| false

Function that loads the message reactions (overrides the function coming from `MessageContext`).

Type| Default
---|---
() => Promise<void>| [MessageContextValue[âhandleFetchReactionsâ]](/chat/docs/sdk/react/components/contexts/message_context#handlefetchreactions)

The default implementation of `handleFetchReactions`, provided via the [`MessageContext`](/chat/docs/sdk/react/components/contexts/message_context#handlefetchreactions/), limits the number of loaded reactions to 1200. Use this prop to provide your own loading implementation:


    const MyCustomReactionsList = (props) => {
      const { channel } = useChannelStateContext();
      const { message } = useMessageContext();

      function fetchReactions() {
        return channel.getReactions(message.id, { limit: 42 });
      }

      return <ReactionsList handleFetchReactions={fetchReactions} />;
    };

An array of the own reaction objects to distinguish own reactions visually (overrides `message.own_reactions` from `MessageContext`).

Type
---
array

Sort options to provide to a reactions query. Affects the order of reacted users in the default reactions modal. This prop overrides the function stored in `MessageContext`.

Type| Default
---|---
{ created_at: number }| reverse chronological order

Comparator function to sort reactions. Should have the same signature as an arrayâs `sort` method. This prop overrides the function stored in `MessageContext`.

Type| Default
---|---
(this: ReactionSummary, that: ReactionSummary) => number| chronological order

Function that loads the message reactions (overrides the function coming from `MessageContext`).

Type| Default
---|---
() => Promise<void>| [MessageContextValue[âhandleFetchReactionsâ]](/chat/docs/sdk/react/components/contexts/message_context#handlefetchreactions)

A list of the currently supported reactions on a message.

Type| Default
---|---
array| [defaultReactionOptions](https://github.com/GetStream/stream-chat-react/blob/feat/reactions/src/components/Reactions/reactionOptions.tsx)

An array of the reaction objects to display in the list (overrides `message.latest_reactions` from `MessageContext`).

Type
---
array

[PreviousVoice Recording Attachment](/chat/docs/sdk/react/components/message-components/attachment/voice-recording/)[NextDateSeparator](/chat/docs/sdk/react/components/utility-components/date_separator/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

As of the version `12.7.1`, the SDK exposes a variety of AI-related components and props. Their aim is to allow for seamless integration with AI-powered services, for example, the rendering of AI responses in a chat-bot like style.

Please, refer to [our React Assistant tutorial](https://getstream.io/blog/react-assistant/) for more in-depth guidance. It is highly encouraged to read the tutorial before integrating AI in your application.

As per our current specification, the AI is allowed several states that are related to its current progress in producing a response. You may find the currently available states here: <https://github.com/GetStream/stream-chat-react/blob/0577ffdbd2abf11b6b99a2e70caa938ea19635e9/src/components/AIStateIndicator/hooks/useAIState.ts#L7>.

Provided below is a brief explanation of what each state means:

  * `AI_STATE_THINKING` \- the AI is thinking and trying to internally craft an answer to your query
  * `AI_STATE_GENERATING` \- the actual response to your query is being generated
  * `AI_STATE_EXTERNAL_SOURCES` \- the AI is checking external resources for information
  * `AI_STATE_ERROR` \- the AI has reached an error state while trying to answer your query
  * `AI_STATE_IDLE` \- the AI is in an idle state and is not doing anything

If you are using your own implementation and have different states than these, you can feel free to override our default components as well as their behaviour.

[PreviousMessageComposer Middleware](/chat/docs/sdk/react/components/message-input-components/message-composer-middleware/)[NextUI Components](/chat/docs/sdk/react/components/ai/ui-components/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

The context value is provided by `ChannelListContextProvider` which wraps the contents rendered by [`ChannelList`](/chat/docs/sdk/react/components/core-components/channel_list/). It exposes API that the default and custom components rendered by `ChannelList` can take advantage of. The components that can consume the context are customizable via `ChannelListProps`:

  * `Avatar` \- component used to display channel image
  * `ChannelSearch` \- renders channel search input and results
  * `EmptyStateIndicator` \- rendered when the channels query returns and empty array
  * `LoadingErrorIndicator` \- rendered when the channels query fails
  * `LoadingIndicator`\- rendered during the channels query
  * `List` \- component rendering `LoadingErrorIndicator`, `LoadingIndicator`, `EmptyStateIndicator`, `Paginator` and the list of channel `Preview` components
  * `Paginator` \- takes care of requesting to load more channels into the list (pagination)
  * `Preview` \- renders the information of a channel in the channel list

Access the API from context with our custom hook:


    import { useChannelListContext } from "stream-chat-react";

    export const CustomComponent = () => {
      const { channels, setChannels } = useChannelListContext();
      // component logic ...
      return {
        /* rendered elements */
      };
    };

State representing the array of loaded channels. Channels query is executed by default only within the [`ChannelList` component](/chat/docs/sdk/react/components/core-components/channel_list/) in the SDK.

Type
---
`Channel[]`

Sets the list of `Channel` objects to be rendered by `ChannelList` component. One have to be careful, when to call `setChannels` as the first channels query executed by the `ChannelList` overrides the whole `channels` state. In that case it is better to subscribe to `client` event `channels.queried` and only then set the channels. In the following example, we have a component that sets the active channel based on the id in the URL. It waits until the first channels page is loaded, and then it sets the active channel. If the channel is not present on the first page, it performs additional API request with `getChannel()`:


    import { useEffect } from 'react';
    import { useNavigate, useParams } from 'react-router-dom';
    import { ChannelList, ChannelListMessenger, ChannelListMessengerProps, getChannel, useChannelListContext, useChatContext } from 'stream-chat-react';

    const DEFAULT_CHANNEL_ID = 'general';
    const DEFAULT_CHANNEL_TYPE = 'messaging';

    const List = (props: ChannelListMessengerProps) => {
      const { channelId } = useParams();
      const navigate = useNavigate();
      const { client, channel, setActiveChannel } = useChatContext();
      const { setChannels } = useChannelListContext();

      useEffect(() => {
        if (!channelId) return navigate(`/${DEFAULT_CHANNEL_ID}`);

        if (channel?.id === channelId || !client) return;

        let subscription: { unsubscribe: () => void } | undefined;
        if(!channel?.id || channel?.id !== channelId) {
          subscription = client.on('channels.queried', (event: Event) => {
            const loadedChannelData = event.queriedChannels?.channels.find((response) => response.channel.id === channelId);

            if (loadedChannelData) {
              setActiveChannel(client.channel( DEFAULT_CHANNEL_TYPE, channelId));
              subscription?.unsubscribe();
              return;
            }

            return getChannel({client, id: channelId, type: DEFAULT_CHANNEL_TYPE}).then((newActiveChannel) => {
              setActiveChannel(newActiveChannel);
              setChannels((channels) => {
                return ([newActiveChannel, ...channels.filter((ch) => ch.data?.cid !== newActiveChannel.data?.cid)]);
              });
            });
          });
        }

        return () => {
          subscription?.unsubscribe();
        };
      }, [channel?.id, channelId, setChannels, client, navigate, setActiveChannel]);

      return <ChannelListMessenger {...props}/>;
    };

    const Sidebar = () => {
      return (
        // ...
          <ChannelList
            {/* some props   */}
            {/* setting active channel will be performed inside the custom List component */}
            setActiveChannelOnMount={false}
            List={List}
            {/* some props   */}
          />
        // ...
    }

Type
---
`Dispatch<SetStateAction<Channel[]>>`

[PreviousChannelList](/chat/docs/sdk/react/components/core-components/channel_list/)[NextChannelList Hooks](/chat/docs/sdk/react/hooks/channel_list_hooks/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

The `Message` component is a React Context provider that wraps all the logic, functionality, and UI for the individual messages displayed in a message list. It provides the [`MessageContext`](/chat/docs/sdk/react/components/contexts/message_context/) to its children. All the message UI components consume the `MessageContext` and rely on the stored data for their display and interaction.

The majority of Stream Chat use cases will not need to use the `Message` component directly. Weâve documented it here for reference, but itâs primarily used internally to build up the `MessageContext`. A custom message UI component, added onto `Channel` or `MessageList` via the `Message` prop, will consume this context, so `Message` likely doesnât need to be imported into your app.

The `Message` component is used internally as part of the logic of the `MessageList`. The `MessageList` renders a list of messages and passes each individual `message` object into a `Message` component. Since the component is used internally by default, it only needs to be explicitly imported from the library and used in unique use cases.

The `Message` component does not inject any UI, so all message customization is handled by the [Message UI](/chat/docs/sdk/react/components/message-components/message_ui/) component. The Message UI component is passed as the `Message` prop into either the `Channel` or `MessageList` component.

Additional props to be passed to the underlying `MessageInput` component, [available props](/chat/docs/sdk/react/components/message-input-components/message_input/#props/). It is rendered when editing a message.

Type
---
object

Call this function to keep message list scrolled to the bottom when the message list container scroll height increases (only available in the `VirtualizedMessageList`). An example use case is that upon userâs interaction with the application, a new element appears below the last message. In order to keep the newly rendered content visible, the `autoscrollToBottom` function can be called. The container, however, is not scrolled to the bottom, if already scrolled up more than 4px from the bottom. The function is provided by the SDK and is not inteded for customization.

Type
---
() => void

An object containing custom message actions (key) and function handlers (value). For each custom action a dedicated item (button) in [`MessageActionsBox`](/chat/docs/sdk/react/components/message-components/message_ui/) is rendered. The key is used as a display text inside the button. Therefore, it should not be cryptic but rather bear the end user in mind when formulating it.


    const customActions = {
      "Copy text": (message) => {
        navigator.clipboard.writeText(message.text || "");
      },
    };

    <MessageList customMessageActions={customActions} />;

Custom action item âCopy textâ in the message actions box:

![Image of a custom action item ](/_astro/message-actions-box-custom-actions.DTA9dLMh_Z1IKuL8.webp)


    const customActions = {
      "Copy text": (message) => {
        navigator.clipboard.writeText(message.text || "");
      },
    };

    <MessageList customMessageActions={customActions} />;

Custom action item âCopy textâ in the message actions box:

![Image of a custom action item ](/_astro/message-actions-box-custom-actions.DTA9dLMh_Z1IKuL8.webp)

Type
---
object

Function that returns the notification text to be displayed when a delete message request fails. This function receives the deleted [message object](/chat/docs/javascript/message_format/) as its argument.

Type
---
(message: LocalMessage) => string

Whether to highlight and focus the message on load. Used internally in the process of [jumping to a message](/chat/docs/sdk/react/components/contexts/channel_action_context#jumptomessage/).

Type
---
boolean

Custom UI component to display a message.

Type| Default
---|---
component| [MessageSimple](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Message/MessageSimple.tsx)

DOMRect object linked to the parent wrapper div around the `InfiniteScroll` component.

Type
---
DOMRect

Custom action handler function to run on click of a @mention in a message.

Type| Default
---|---
function| [ChannelActionContextValue[âonMentionsClickâ]](/chat/docs/sdk/react/components/contexts/channel_action_context#onmentionsclick)

Custom action handler to open a [`Thread`](/chat/docs/sdk/react/components/core-components/thread/) component.

Type| Default
---|---
function| [ChannelActionContextValue[âopenThreadâ]](/chat/docs/sdk/react/components/contexts/channel_action_context#openthread)

If true, renders HTML instead of markdown. Posting HTML is only supported server-side.

Type| Default
---|---
boolean| false

[PreviousThreadContext](/chat/docs/sdk/react/components/contexts/thread-context/)[NextMessageContext](/chat/docs/sdk/react/components/contexts/message_context/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

The context value is provided by `MessageListContextProvider` which wraps the contents rendered by [`MessageList`](/chat/docs/sdk/react/components/core-components/message_list/). It exposes API that the default and custom components rendered by `MessageList` can take advantage of. The components that can consume the context are:

  * `EmptyStateIndicator` \- rendered when there are no messages in the channel. The [`component can be customized`](/chat/docs/sdk/react/components/contexts/component_context#emptystateindicator/).
  * `LoadingIndicator` \- rendered while loading more messages to the channel. The [`component can be customized`](/chat/docs/sdk/react/components/contexts/component_context#loadingindicator/).
  * `MessageListNotifications` \- component rendering application notifications. The [`component can be customized`](/chat/docs/sdk/react/components/contexts/component_context#messagelistnotifications/).
  * `MessageNotification` \- component used to display a single notification message in `MessageListNotifications`. The [`component can be customized`](/chat/docs/sdk/react/components/contexts/component_context#messagenotification/).
  * `TypingIndicator` \- component indicating that another user is typing a message in a given channel. The [`component can be customized`](/chat/docs/sdk/react/components/contexts/component_context#typingindicator/).
  * `Message` and its children - component to render a message. The [`component can be customized`](/chat/docs/sdk/react/components/contexts/component_context#message/).
  * `DateSeparator` \- component rendered to separate messages posted on different dates. The [`component can be customized`](/chat/docs/sdk/react/components/contexts/component_context#dateseparator/).
  * `MessageSystem` \- component to display system messages in the message list. The [`component can be customized`](/chat/docs/sdk/react/components/contexts/component_context#messagesystem/).
  * `HeaderComponent` \- component to be displayed before the oldest message in the message list. The [`component can be customized`](/chat/docs/sdk/react/components/contexts/component_context#headercomponent/).
  * `UnreadMessagesNotification` \- custom UI component that indicates a user is viewing unread messages. It disappears once the user scrolls to `UnreadMessagesSeparator`. The [`component can be customized`](/chat/docs/sdk/react/components/contexts/component_context#unreadmessagesnotification/).
  * `UnreadMessagesSeparator` \- component to be displayed before the oldest message in the message list. The [`component can be customized`](/chat/docs/sdk/react/components/contexts/component_context#unreadmessagesseparator/).

Pull the value from context with our custom hook:


    import { useMessageListContext } from "stream-chat-react";

    export const CustomComponent = () => {
      const { listElement, scrollToBottom } = useMessageListContext();
      // component logic ...
      return {
        /* rendered elements */
      };
    };

The scroll container within which the messages and typing indicator are rendered. You may want to perform scroll-to-bottom operations based on the `listElement`âs scroll state.

Type
---
`HTMLDivElement | null`

Function that scrolls the `listElement` to the bottom.

Type
---
`() => void`

[PreviousVirtualizedMessageList](/chat/docs/sdk/react/components/core-components/virtualized_list/)[NextVirtualizedMessageListContext](/chat/docs/sdk/react/components/contexts/virtualized-message-list-context/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

A simple date separator UI component for between messages. This component is rendered via the `VirtualizedMessageList` and `MessageList` components. See the render method [processMessages](https://github.com/GetStream/stream-chat-react/blob/master/src/components/MessageList/utils.ts) for more info on the conditions for when the component is injected into the UI.

Since this component is added to the message lists within those components by default, you typically wonât need to import and use this component individually unless itâs in a date separator custom component. If you would like to disable the `DateSeparator` from appearing in the UI, utilize the `disableDateSeparator` prop on either the `VirtualizedMessageList` or `MessageList` components. You can also hide the component when new messages are received via the `hideNewMessageSeparator` prop on the same two list components.

**Example 1** \- Hereâs what it looks like for todayâs date:


    const date = new Date();

    <DateSeparator date={date} />;

**Example 2** \- A date in the past:


    const date = new Date("December 17, 1995 03:24:00");

    <React.Fragment>
      <DateSeparator date={date} />
      <DateSeparator date={date} position="center" />
      <DateSeparator date={date} position="left" />
    </React.Fragment>;

This component may be overridden via the `DateSeparator` prop on `Channel`, which injects the new value into the `ComponentContext`. This value is then pulled for use in the rendering method in the list components.

**Example 1** \- An example of a custom date separator:


    export const YourCustomDateSeparator = (props: DateSeparatorProps) => {
        const { date } = props

        function formatDate(d: Date) {
            return `The message date is: ${d.toDateString()}`;
        }

        return (
            <DateSeparator
                formatDate={formatDate}
                date={date}
                position={'center'}
            />
        )
    };

    <Channel DateSeparator={YourCustomDateSeparator}>
        // the Channel children components
    />

The date to format, required.

Type
---
Date

Function to override the default formatting of the date. Has access to the original date object.

Type
---
(date: Date) => string

Set the position of the date in the separator, options are âleftâ, âcenterâ, ârightâ.

Type| Default
---|---
âleftâ | âcenterâ | âright'| 'rightâ

Boolean for if the following messages are not new.

Type
---
boolean

[PreviousReactions](/chat/docs/sdk/react/components/message-components/reactions/)[NextMessageInput](/chat/docs/sdk/react/components/message-input-components/message_input/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

As described in the [Message UI](/chat/docs/sdk/react/components/message-components/message_ui/) section, our default [MessageSimple](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Message/MessageSimple.tsx) component is a combination of various UI subcomponents. We export all the building blocks of `MessageSimple`, so a custom Message UI component can be built in a similar way. Check out the [Message UI Customization](/chat/docs/sdk/react/guides/theming/message_ui/) section for an example.

The following UI components are available for use:

  * [`MessageActions`](https://github.com/GetStream/stream-chat-react/blob/master/src/components/MessageActions/MessageActions.tsx) \- displays the available actions on a message (ex: edit, flag, pin)

  * [`MessageDeleted`](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Message/MessageDeleted.tsx) \- renders when `message.type` is `deleted`

  * [`MessageOptions`](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Message/MessageOptions.tsx) \- on hover, shows the available options on a message (i.e., react, reply, actions)

  * [`MessageRepliesCountButton`](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Message/MessageRepliesCountButton.tsx) \- displays the number of threaded replies on a message

  * [`MessageStatus`](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Message/MessageStatus.tsx) \- displays message delivery status and the users who have read the message

  * [`MessageText`](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Message/MessageText.tsx) \- formats and renders the message text in markdown using [react-markdown](https://www.npmjs.com/package/react-markdown)

  * [`MessageTimestamp`](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Message/MessageTimestamp.tsx) \- shows the sent time of a message

  * [`MML`](https://github.com/GetStream/stream-chat-react/blob/master/src/components/MML/MML.tsx) \- a wrapper component around the [MML React](https://www.npmjs.com/package/mml-react) library

  * [`QuotedMessage`](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Message/QuotedMessage.tsx) \- shows a quoted message UI wrapper when the sent message quotes a previous message

  * [`Timestamp`](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Message/Timestamp.tsx) \- formats and displays a date, used by `MessageTimestamp` and for edited message timestamps.

  * [`MessageBouncePrompt`](https://github.com/GetStream/stream-chat-react/blob/master/src/components/MessageBounce/MessageBouncePrompt.tsx) \- presents options to deal with a message that got bounced by the moderation rules.

Besides the above there are also components that render reaction list and reaction selector. You can find more about them in [dedicated chapter](/chat/docs/sdk/react/components/message-components/reactions/).

Custom component rendering the icon used in message actions button. This button invokes the message actions menu.

Type| Default
---|---
`React.ComponentType`| [ActionsIcon](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Message/icons.tsx)

Custom CSS class to be added to the `div` wrapping the component.

Type
---
string

Function that returns an array of the allowed actions on a message by the currently connected user (overrides the value from `MessageContext`).

Type
---
() => MessageActionsArray

Function that removes a message from the current channel (overrides the value from `MessageContext`).

Type
---
(event: React.BaseSyntheticEvent) => Promise<void> | void

Function that flags a message (overrides the value from `MessageContext`).

Type
---
(event: React.BaseSyntheticEvent) => Promise<void> | void

Function that mutes the sender of a message (overrides the value from `MessageContext`).

Type
---
(event: React.BaseSyntheticEvent) => Promise<void> | void

Function that pins a message in the current channel (overrides the value from `MessageContext`).

Type
---
(event: React.BaseSyntheticEvent) => Promise<void> | void

If true, renders the wrapper component as a `span`, not a `div`.

Type| Default
---|---
string| false

The `StreamChat` message object, which provides necessary data to the underlying UI components (overrides the value from `MessageContext`).

Type
---
object

Function that returns whether the message was sent by the connected user.

Type
---
() => boolean

If true, show the `ThreadIcon` and enable navigation into a `Thread` component.

Type| Default
---|---
boolean| true

Function that opens a [`Thread`](/chat/docs/sdk/react/components/core-components/thread/) on a message (overrides the value from `MessageContext`).

Type
---
(event: React.BaseSyntheticEvent) => Promise<void> | void

Custom component rendering the icon used in a message options button invoking reactions selector for a given message.

Type| Default
---|---
`React.ComponentType`| [ReactionIcon](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Message/icons.tsx)

Theme string to be added to CSS class names.


    <div className={`str-chat__message-${theme}__actions`} />

Type| Default
---|---
string| âsimpleâ

Custom component rendering the icon used in a message options button opening thread.

Type| Default
---|---
`React.ComponentType`| [ThreadIcon](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Message/icons.tsx)

If supplied, adds custom text to the end of a multiple replies message.


    const pluralReplyText = `${reply_count} ${labelPlural}`;

Type
---
string

If supplied, adds custom text to the end of a single reply message.


    const singleReplyText = `1 ${labelSingle}`;

Type
---
string

Function to navigate into an existing thread on a message.

Type
---
React.MouseEventHandler

The amount of replies (i.e., threaded messages) on a message.

Type
---
number

Custom UI component to display a userâs avatar (overrides the value from `ComponentContext`).

Type| Default
---|---
component| [Avatar](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Avatar/Avatar.tsx)

Custom component to render when message is considered delivered, not read. The default UI renders MessageDeliveredIcon and a tooltip with string âDeliveredâ.

Type
---
component

Custom component to render when message is considered delivered and read. The default UI renders the last readerâs Avatar and a tooltip with string readersâ names.

Type
---
component

Custom component to render when message is considered as being the in the process of delivery. The default UI renders LoadingIndicator and a tooltip with string âSendingâ.

Type
---
component

Message type string to be added to CSS class names.


    <span className={`str-chat__message-${messageType}-status`} />

Type| Default
---|---
string| âsimpleâ

Allows to customize the username(s) that appear on the message status tooltip.

| Type | Default | | ------------------------------ | ------------------- | --- | ------- | | (user: UserResponse) => string | (user) => user.name | | user.id |

This propâs implementation is not provided out of the box by the SDK. See below for a customization example:


    const CustomMessageStatus = (props: MessageStatusProps) => {
      const allCapsUserName = useCallback<TooltipUsernameMapper>(
        (user) => (user.name || user.id).toUpperCase(),
        [],
      );
      return <MessageStatus {...props} tooltipUserNameMapper={allCapsUserName} />;
    };

    // Sort in reverse order to avoid auto-selecting unread channel
    const sort: ChannelSort = { last_updated: 1 };
    const WrappedConnectedUser = ({
      token,
      userId,
    }: Omit<ConnectedUserProps, "children">) => (
      <ConnectedUser token={token} userId={userId}>
        <ChannelList
          filters={{ id: { $eq: "add-message" }, members: { $in: [userId] } }}
          sort={sort}
        />
        <Channel MessageStatus={CustomMessageStatus}>
          <Window>
            <ChannelHeader />
            <MessageList />
          </Window>
          <Thread />
        </Channel>
      </ConnectedUser>
    );

If provided, replaces the CSS class name placed on the componentâs inner `div` container.

Type
---
string

If provided, adds a CSS class name to the componentâs outer `div` container.

Type
---
string

The `StreamChat` message object, which provides necessary data to the underlying UI components (overrides the value stored in `MessageContext`).

Type
---
object

Theme string to be added to CSS class names.


    <div className={`str-chat__message-${theme}-text-inner`} />

Type| Default
---|---
string| âsimpleâ

This component has all of the same props as the underlying `Timestamp`, except that instead of `timestamp` it uses `message.created_at` value from the `MessageContext`.

If true, call the `Day.js` calendar function to get the date string to display.

Type| Default
---|---
boolean| false

If provided, adds a CSS class name to the componentâs outer `time` container.


    <time className={customClass} />

Type
---
string

If provided, overrides the default timestamp format.

Type| Default
---|---
string| âh:mmAâ

The MML source string to be rendered by the `mml-react` library.

Type
---
string

The submit handler function for MML actions.

Type
---
(data: Record<string, unknown>) => unknown

The side of the message list to render MML components.

Type| Default
---|---
âleftâ | âright'| 'rightâ

`QuotedMessage` only consumes context and does not accept any optional props.

This component is rendered in a modal dialog for messages that got bounced by the moderation rules.

Type| Default
---|---
ReactNode| Localized string for âThis message did not meet our content guidelinesâ

Use this prop to easily override the text displayed in the modal dialog for the bounced messages, without fully implementing a custom `MessageBouncePrompt` component:


    import { MessageBouncePrompt } from "stream-react-chat";

    function MyCustomMessageBouncePrompt(props) {
      return <MessageBouncePrompt {...props}>My custom text</MessageBouncePrompt>;
    }

Then override the default `MessageBouncePrompt` component with your custom one:


    <Channel MessageBouncePrompt={MyCustomMessageBouncePrompt}>
      <Window>
        <ChannelHeader />
        <MessageList />
        <MessageInput />
      </Window>
      <Thread />
    </Channel>

If you need deeper customization, refer to the [`MessageBounceContext`](/chat/docs/sdk/react/components/contexts/message_bounce_context/) documentation.

The Message UI component will pass this callback to close the modal dialog `MessageBouncePrompt` are rendered in.

Type
---
ReactEventHandler

Either an ISO string with a date, or a Date object with a date to display.

Type
---
Date | string

[PreviousrenderText function](/chat/docs/sdk/react/components/message-components/render-text/)[NextAvatar](/chat/docs/sdk/react/components/utility-components/avatar/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

The `ChatContext` is exposed by the [`Chat`](/chat/docs/sdk/react/components/core-components/chat/) component. Since `Chat` wraps the entire chat application, all other components in the library have access to the values stored in this context. You can access the context values by calling the `useChatContext` custom hook.

Pull values from context with our custom hook:


    const { client, setActiveChannel } = useChatContext();

The value is forwarded to the context from the `Chat` component [prop `client`](/chat/docs/sdk/react/components/core-components/chat#client/).

Type
---
object

The currently active channel, which populates the [`Channel`](/chat/docs/sdk/react/components/core-components/channel/) component.

Type
---
Channel

Exposes API that:

  * indicates, whether and what channels query has been triggered within [`ChannelList` component](/chat/docs/sdk/react/components/core-components/channel_list/) by its channels pagination controller - `queryInProgress` of type `ChannelQueryState`
  * allows to set the `queryInProgress` state with `setQueryInProgress` state setter
  * keeps track of error response from the channels query - `error`
  * allows to set the `error` state with `setError`

The `queryInProgress` values are:

  * `uninitialized` \- the initial state before the first channels query is triggered
  * `reload` \- the initial channels query (loading the first page) is in progress
  * `load-more` \- loading the next page of channels
  * `null` \- at least one channels page has been loaded and there is no query in progress at the moment

Type
---
`ChannelsQueryState`

The function to close mobile navigation.

Type
---
function

The value is forwarded to the context from the `Chat` component [prop `customClasses`](/chat/docs/sdk/react/components/core-components/chat#customclasses/)

Type
---
object

The callback function used to get available client-side app settings, includes image and file upload config.

Type
---
function

Object containing the date of the latest message sent by the current user by channels (this is used to detect if slow mode countdown should be started)

Type
---
{ [key: string]: Date }

An array of users that have been muted by the connected user.

Type
---
Mute[]

When the screen width is at a mobile breakpoint, whether the mobile navigation menu is open.

Type| Default
---|---
boolean| true

The function to open mobile navigation.

Type
---
function

A function to set the currently active channel. This is used in the `ChannelList` component to navigate between channels. You can override the default behavior by pulling it from context and then utilizing the function.

Type
---
function

The value is forwarded to the context from the `Chat` component [prop `theme`](/chat/docs/sdk/react/components/core-components/chat#theme/)

Type
---
string

The value is forwarded to the context from the `Chat` component [prop `useImageFlagEmojisOnWindow`](/chat/docs/sdk/react/components/core-components/chat#useimageflagemojisonwindow/).

Type| Default
---|---
boolean| false

[PreviousChat](/chat/docs/sdk/react/components/core-components/chat/)[NextChannel](/chat/docs/sdk/react/components/core-components/channel/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

The `Thread` component renders a list of replies tied to a single parent message in a channelâs main message list. A `Thread` maintains its own state and renders its own `MessageList` and `MessageInput` components. Each piece of rendered UI can be overridden with custom components either drawn from the `ComponentContext` or supplied via props.

The `Thread` component consumes the contexts established in [`Channel`](/chat/docs/sdk/react/components/core-components/channel/) and does not have any required props.

As a context consumer, the `Thread` component must be rendered as a child of the `Channel` component. To enable smooth `Thread` mount and unmount behavior, wrap the main channel components in the [`Window`](/chat/docs/sdk/react/components/utility-components/window/) component. `Window` handles width changes in the main channel to ensure a seamless user experience when opening and closing a `Thread`.


    <Chat client={client}>
      <ChannelList />
      <Channel>
        <Window>
          <MessageList />
          <MessageInput />
        </Window>
        <Thread />
      </Channel>
    </Chat>

Since a `Thread` contains most of the pieces of a `Channel` component, just in an encapsulated form, many aspects and components can be customized in a similar way. The UI components for both [`Message`](/chat/docs/sdk/react/components/message-components/message/) and [`MessageInput`](/chat/docs/sdk/react/components/message-input-components/message_input/) can be overridden via props if you desire different UI from the styles rendered in the main `Channel`. `ThreadHeader` and `ThreadStart` are two overridable UI components unique to `Thread` that can be drawn from the `ComponentContext`.

**Example 1** \- The below example shows how to render different UI for messages and the input within a `Thread`, versus those rendered in the main `Channel`.

A common pattern we use in the library is to first check props to see if a value/component exists, and if not, pull from context.


    const MainInput = (props) => {
      // render main `MessageInput` UI component here
    };

    const MainMessage = (props) => {
      // render main `Message` UI component here
    };

    const ThreadInput = (props) => {
      // render thread `MessageInput` UI component here
    };

    const ThreadMessage = (props) => {
      // render thread `Message` UI component here
    };

    <Chat client={client}>
      <ChannelList />
      <Channel Input={MainInput} Message={MainMessage}>
        <Window>
          <MessageList />
          <MessageInput />
        </Window>
        <Thread Input={ThreadInput} Message={ThreadMessage} />
      </Channel>
    </Chat>;

**Example 2** \- The below example shows how to provide custom UI for the `ThreadHeader` and `ThreadStart` components. `ThreadHeader` is rendered above the UI for the threadâs parent `Message` component and at the top of the `Thread`. `ThreadStart` serves as a separator between the parent message and the `MessageList` of replies.


    const CustomThreadHeader = (props) => {
      // render thread header UI component here
    };

    const CustomThreadStart = (props) => {
      // render thread start UI component here
    };

    <Chat client={client}>
      <ChannelList />
      <Channel ThreadHeader={CustomThreadHeader} ThreadStart={CustomThreadStart}>
        <Window>
          <MessageList />
          <MessageInput />
        </Window>
        <Thread />
      </Channel>
    </Chat>;

**Example 3** \- To customize the combo of the threadâs parent message and the `ThreadStart` separator, you can create a custom `ThreadHead` component and pass it to the `Channel` props. It then will be stored in the [`ComponentContext['ThreadHead']`](/chat/docs/sdk/react/components/contexts/component_context#threadhead)


    const CustomThreadHead = (props) => {
      // render thread header UI component here
    };

    <Chat client={client}>
      <ChannelList />
      <Channel ThreadHead={CustomThreadHead} ThreadStart={CustomThreadStart}>
        <Window>
          <MessageList />
          <MessageInput />
        </Window>
        <Thread />
      </Channel>
    </Chat>;

Additional props to be passed to the underlying [`MessageInput`](/chat/docs/sdk/react/components/message-input-components/message_input/) component.

Type
---
object

Additional props to be passed to the underlying [`MessageList`](/chat/docs/sdk/react/components/core-components/message_list/) component.

Type
---
object

Additional props to be passed to the underlying [`Message`](/chat/docs/sdk/react/components/message-components/message/) component, which represents the threadâs parent message.

Type
---
object

Additional [props for `VirtualizedMessageList`](/chat/docs/sdk/react/components/core-components/virtualized_list/#props/) component.

Type
---
object

If true, focuses the `MessageInput` component on opening a thread.

Type| Default
---|---
boolean| true

Controls injection of [DateSeparator](https://github.com/GetStream/stream-chat-react/blob/master/src/components/DateSeparator/DateSeparator.tsx) UI component into underlying `MessageList` or `VirtualizedMessageList`.

Type| Default
---|---
boolean| false

Custom UI component to replace the `MessageInput` of a `Thread`. The component uses `MessageInputFlat` by default.

Type| Default
---|---
component| [MessageInputFlat](https://github.com/GetStream/stream-chat-react/blob/master/src/components/MessageInput/MessageInputFlat.tsx)

Custom thread message UI component used to override the default `Message` value stored in `ComponentContext`.

Type| Default
---|---
component| [ComponentContext[âMessageâ]](/chat/docs/sdk/react/components/contexts/component_context#message)

If true, render the `VirtualizedMessageList` instead of the standard `MessageList` component.

Type
---
boolean

[PreviousVirtualizedMessageListContext](/chat/docs/sdk/react/components/contexts/virtualized-message-list-context/)[NextThreadContext](/chat/docs/sdk/react/components/contexts/thread-context/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

The `Channel` component is a React Context provider that wraps all the logic, functionality, and UI for an individual chat channel. It provides four separate contexts to its children:

  * [`ChannelStateContext`](/chat/docs/sdk/react/components/contexts/channel_state_context/) \- stateful data (ex: `messages` or `members`)
  * [`ChannelActionContext`](/chat/docs/sdk/react/components/contexts/channel_action_context/) \- action handlers (ex: `sendMessage` or `openThread`)
  * [`ComponentContext`](/chat/docs/sdk/react/components/contexts/component_context/) \- custom component UI overrides (ex: `Avatar` or `Message`)
  * [`TypingContext`](/chat/docs/sdk/react/components/contexts/typing_context/) \- object of currently typing users (i.e., `typing`)

The `Channel` component renders an individual `channel` object. For detailed information regarding `channel` objects and their functionality, check out the [JavaScript docs](/chat/docs/javascript/creating_channels/) on our website.

The `Channel` component does not inject any UI, so its implementation is fairly simple and can be handled in one of two ways, both with and without a `ChannelList` component. If you are using a `ChannelList`, do not add a `channel` object as a prop on `Channel`. However, in the absence of a `ChannelList`, the `channel` prop is required. By default, the `ChannelList` sets the active `channel` object, which is then injected it into the `ChannelStateContext`, so manual prop passing is not required.

**Example 1** \- without `ChannelList`


    <Chat client={client}>
      <Channel channel={channel}>
        <MessageList />
        <MessageInput />
      </Channel>
    </Chat>

**Example 2** \- with `ChannelList`


    <Chat client={client}>
      <ChannelList />
      <Channel>
        <MessageList />
        <MessageInput />
      </Channel>
    </Chat>

Any child of the `Channel` component has access to the contexts referenced above. Each context can be accessed with one of our custom hooks, which must be imported individually.


    const { messages } = useChannelStateContext();
    const { sendMessage } = useChannelActionContext();
    const { Avatar } = useComponentContext();
    const { typing } = useTypingContext();

In case you would like to customize parts of your chat application, you can do that by passing custom components to `Channel` component props. All the title-cased props are reserved for the custom components overriding the SDK defaults. The list of all customizable components - the component context - can be found in the [`ComponentContext` documentation](/chat/docs/sdk/react/components/contexts/component_context/).

**Example of registering custom Avatar component**


     import {
      Channel,
      ChannelList,
      Chat,
      MessageInput,
      MessageList,
    } from "stream-chat-react";
    import { CustomTooltip } from "../Tooltip/CustomTooltip";

    const Avatar = ({ image, title }) => {
      return (
        <>
          <CustomTooltip>{title}</CustomTooltip>
          <div className="avatar-image">
            <img src={image} alt={title} />
          </div>
        </>
      );
    };

    export const App = (
      <Chat client={client}>
        <ChannelList />
        <Channel Avatar={Avatar}>
          <MessageList />
          <MessageInput />
        </Channel>
      </Chat>
    );

The currently active `StreamChat` `channel` instance to be loaded into the `Channel` component and referenced by its children.


    const channel = client.channel("messaging", {
      members: ["nate", "roy"],
    });

Do not provide this prop if you are using the `ChannelList` component, as it handles `channel` setting logic.

Type
---
object

Custom handler function that runs when the active channel has unread messages and the app is running on a separate browser tab.

Type
---
(unread: number, documentTitle: string) => void

Custom UI component to display a message attachment.

Type| Default
---|---
component| [Attachment](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Attachment/Attachment.tsx)

Custom UI component to display an attachment previews in `MessageInput`.

Type| Default
---|---
component| [AttachmentPreviewList](https://github.com/GetStream/stream-chat-react/blob/master/src/components/MessageInput/AttachmentPreviewList.tsx)

Custom UI component to control adding attachments to MessageInput, defaults to and accepts same props as:

Type| Default
---|---
component| [AttachmentSelector](https://github.com/GetStream/stream-chat-react/blob/master/src/components/MessageInput/AttachmentSelector.tsx)

Custom UI component for contents of attachment selector initiation button.

Type
---
component

Custom UI component to display AudioRecorder in `MessageInput`.

Type| Default
---|---
component| [AudioRecorder](https://github.com/GetStream/stream-chat-react/blob/master/src/components/MessageInput/AudioRecorder.tsx)

Custom UI component to override the default suggestion Item component.

Type| Default
---|---
component| [SuggestionListItem](https://github.com/GetStream/stream-chat-react/blob/master/src/components/TextareaComposer/SuggestionList/SuggestionListItem.tsx)

Custom UI component to override the default List component that displays suggestions.

Type| Default
---|---
component| [SuggestionList](https://github.com/GetStream/stream-chat-react/blob/master/src/components/TextareaComposer/SuggestionList/SuggestionList.tsx)

Optional configuration parameters used for the initial channel query. Applied only if the value of `channel.initialized` is false. If the channel instance has already been initialized (channel has been queried), then the channel query will be skipped and channelQueryOptions will not be applied.

In the example below, we specify, that the first page of messages when a channel is queried should have 20 messages (the default is 100). Note that the `channel` prop has to be passed along `channelQueryOptions`.


    import { ChannelQueryOptions } from "stream-chat";
    import { Channel, useChatContext } from "stream-chat-react";

    const channelQueryOptions: ChannelQueryOptions = {
      messages: { limit: 20 },
    };

    type ChannelRendererProps = {
      id: string;
      type: string;
    };

    const ChannelRenderer = ({ id, type }: ChannelRendererProps) => {
      const { client } = useChatContext();
      return (
        <Channel
          channel={client.channel(type, id)}
          channelQueryOptions={channelQueryOptions}
        >
          {/* Channel children */}
        </Channel>
      );
    };

Type
---
`ChannelQueryOptions`

Custom UI component to display the slow mode cooldown timer.

Type| Default
---|---
component| [CooldownTimer](https://github.com/GetStream/stream-chat-react/blob/master/src/components/MessageInput/CooldownTimer.tsx)

Custom UI component for date separators.

Type| Default
---|---
component| [DateSeparator](https://github.com/GetStream/stream-chat-react/blob/master/src/components/DateSeparator/DateSeparator.tsx)

Custom action handler to override the default `client.deleteMessage(message.id)` function.

Type
---
`(message: LocalMessage) => Promise<MessageResponse>`

The function can execute different logic for message replies compared to messages in the main message list based on the `parent_id` property of `LocalMessage` object:


    import { Channel } from 'stream-chat-react';
    import type { LocalMessage } from 'stream-chat';

    const doDeleteMessageRequest = async (message: LocalMessage) => {
        if (message.parent_id) {
            // do something before / after deleting a message reply
        } else {
            // do something before / after deleting a message
        }
    }

    const App = () => (
      {/* more components */}
        <Channel doDeleteMessageRequest={ doDeleteMessageRequest }>
            {/* more components */}
        </Channel>
      {/* more components */}
    );

Custom action handler to override the default `channel.markRead` request function (advanced usage only). The function takes two arguments:

Argument| Type| Description
---|---|---
`channel`| `Channel`| The current channel object instance
`setChannelUnreadUiState`| `(state: ChannelUnreadUiState) => void`| Function that allows us to set the unread state for the components reflecting the unread message state.

Type
---
function

Custom action handler to override the default `channel.sendMessage` request function (advanced usage only).

Type
---
function

Custom action handler to override the default `client.updateMessage` request function (advanced usage only).

Type
---
function

Custom UI component to override default edit message input.

Type| Default
---|---
component| [EditMessageForm](https://github.com/GetStream/stream-chat-react/blob/master/src/components/MessageInput/EditMessageForm.tsx)

Custom search mechanism instance or object to enable emoji autocomplete.

Type| Default
---|---
object| undefined

Custom UI component to be rendered in the `MessageInput` component, see [Emoji Picker guide](/chat/docs/sdk/react/guides/customization/emoji_picker/) for more information.

Type| Default
---|---
component| undefined

Custom UI component to be shown if no active `channel` is set, defaults to `null` and skips rendering the `Channel` component.

Type| Default
---|---
component| null

Custom UI component to be displayed when the `MessageList` or `VirtualizedMessageList` is empty.

Type| Default
---|---
component| [EmptyStateIndicator](https://github.com/GetStream/stream-chat-react/blob/master/src/components/EmptyStateIndicator/EmptyStateIndicator.tsx)

Custom UI component for file upload icon.

Type| Default
---|---
component| [FileUploadIcon](https://github.com/GetStream/stream-chat-react/blob/master/src/components/MessageInput/icons.tsx)

Custom UI component to render a Giphy preview in the `VirtualizedMessageList`.

Type| Default
---|---
component| [GiphyPreviewMessage](https://github.com/GetStream/stream-chat-react/blob/master/src/components/MessageList/GiphyPreviewMessage.tsx)

The Giphy version to render - check the keys of the [Image Object](https://developers.giphy.com/docs/api/schema#image-object) for possible values.

Type| Default
---|---
string| âfixed_heightâ

Custom UI component to render at the top of the `MessageList`.

Type| Default
---|---
component| none

A custom function to provide size configuration for image attachments

Type
---
`(a: Attachment, e: HTMLElement) => ImageAttachmentConfiguration`

Allows to prevent triggering the `channel.watch()` (triggers channel query HTTP request) call when mounting the `Channel` component (the default behavior) with uninitialized (`channel.initialized`) `Channel` instance. That means that no channel data from the back-end will be received neither channel WS events will be delivered to the client. Preventing to initialize the channel on mount allows us to postpone the channel creation in the Streamâs DB to a later point in time, for example, when a first message is sent:


    import { useCallback } from 'react';
    import {
      getChannel,
      MessageInput as StreamMessageInput,
      MessageInputProps,
      useChannelActionContext,
      useChatContext,
    } from 'stream-chat-react';
    import type { Message, LocalMessage, SendMessageOptions } from 'stream-chat';

    import { useChannelInitContext } from '../../context/ChannelInitProvider';

    export const MessageInput = (props: MessageInputProps) => {
      const { client } = useChatContext();
      const { sendMessage } = useChannelActionContext();
      const { setInitializedChannelOnMount } = useChannelInitContext();

      const submitHandler: MessageInputProps['overrideSubmitHandler'] = useCallback(
        async (params: {
          cid: string;
          localMessage: LocalMessage;
          message: Message;
          sendOptions: SendMessageOptions;
        }) => {
          const [channelType, channelId] = cid.split(':');
          const channel = client.channel(channelType, channelId);
          if (!channel.initialized) {
            await getChannel({ channel, client });
            setInitializedChannelOnMount(true);
          }

          await sendMessage({localMessage, message, options: sendOptions});
        },
        [client, sendMessage, setInitializedChannelOnMount],
      );

      return <StreamMessageInput {...props} overrideSubmitHandler={submitHandler} />;
    };

Type| Default
---|---
boolean| true

Custom UI component handling how the message input is rendered.

Type| Default
---|---
component| [MessageInputFlat](https://github.com/GetStream/stream-chat-react/blob/master/src/components/MessageInput/MessageInputFlat.tsx)

Custom component to render link previews in `MessageInput`.

Type| Default
---|---
component| [LinkPreviewList](https://github.com/GetStream/stream-chat-react/blob/master/src/components/MessageInput/LinkPreviewList.tsx)

Custom UI component to be shown if the channel query fails.

Type| Default
---|---
component| [LoadingErrorIndicator](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Loading/LoadingErrorIndicator.tsx)

Custom UI component to render while the `MessageList` is loading new messages.

Type| Default
---|---
component| [LoadingIndicator](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Loading/LoadingIndicator.tsx)

Configuration parameter to mark the active channel as read when mounted (opened). By default, the channel is marked read on mount.

Type| Default
---|---
boolean| true

Custom UI component to display a message in the standard `MessageList`.

Type| Default
---|---
component| [MessageSimple](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Message/MessageSimple.tsx)

Custom UI component for a deleted message.

Type| Default
---|---
component| [MessageDeleted](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Message/MessageDeleted.tsx)

Custom UI component that displays message and connection status notifications in the `MessageList`.

Type| Default
---|---
component| [DefaultMessageListNotifications](https://github.com/GetStream/stream-chat-react/blob/master/src/components/MessageList/MessageListNotifications.tsx)

Custom UI component to display a notification when scrolled up the list and new messages arrive.

Type| Default
---|---
component| [MessageNotification](https://github.com/GetStream/stream-chat-react/blob/master/src/components/MessageList/MessageNotification.tsx)

Custom UI component for message options popup.

Type| Default
---|---
component| [MessageOptions](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Message/MessageOptions.tsx)

Custom UI component to display message replies.

Type| Default
---|---
component| [MessageRepliesCountButton](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Message/MessageRepliesCountButton.tsx)

Custom UI component to display message delivery status.

Type| Default
---|---
component| [MessageStatus](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Message/MessageStatus.tsx)

Custom UI component to display system messages.

Type| Default
---|---
component| [EventComponent](https://github.com/GetStream/stream-chat-react/blob/master/src/components/EventComponent/EventComponent.tsx)

Custom UI component to display a timestamp on a message. This does not include a timestamp for edited messages.

Type| Default
---|---
component| [MessageTimestamp](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Message/MessageTimestamp.tsx)

See also `Timestamp`.

Custom UI component for the content of the modal dialog for messages that got bounced by the moderation rules.

Type| Default
---|---
component| [MessageBouncePrompt](https://github.com/GetStream/stream-chat-react/blob/master/src/components/MessageBounce/MessageBouncePrompt.tsx)

Custom UI component for viewing messageâs image attachments.

Type| Default
---|---
component| [ModalGallery](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Gallery/ModalGallery.tsx)

Custom action handler function to run on click of an @mention in a message.

Type
---
function

Custom action handler function to run on hover of an @mention in a message.

Type
---
function

Custom UI component to override default pinned message indicator.

Type| Default
---|---
component| [PinIndicator](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Message/icons.tsx)

Custom UI component to override default poll actions rendering in a message.

Type| Default
---|---
component| [PollActions](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Poll/PollActions/PollActions.tsx)

Custom UI component to override default poll rendering in a message.

Type| Default
---|---
component| [PollContent](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Poll/PollContent.tsx)

Custom UI component to override default poll creation dialog contents.

Type| Default
---|---
component| [PollCreationDialog](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Poll/PollCreationDialog/PollCreationDialog.tsx)

Custom UI component to override default poll header in a message.

Type| Default
---|---
component| [PollHeader](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Poll/PollHeader.tsx)

Custom UI component to override default poll option selector.

Type| Default
---|---
component| [PollOptionSelector](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Poll/PollOptionSelector.tsx)

Custom UI component to override quoted message UI on a sent message.

Type| Default
---|---
component| [QuotedMessage](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Message/QuotedMessage.tsx)

Custom UI component to override the message inputâs quoted message preview.

Type| Default
---|---
component| [QuotedMessagePreview](https://github.com/GetStream/stream-chat-react/blob/master/src/components/MessageInput/QuotedMessagePreview.tsx)

Custom UI component to override the rendering of quoted poll.

Type| Default
---|---
component| [QuotedPoll](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Poll/QuotedPoll.tsx)

Custom UI component to display the reaction selector.

Type| Default
---|---
component| [ReactionSelector](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Reactions/ReactionSelector.tsx)

Custom UI component to display the list of reactions on a message.

Type| Default
---|---
component| [ReactionsList](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Reactions/ReactionsList.tsx)

Custom UI component to display the modal with detailed listing of reactions. The modal is rendered upon clicking on the `ReactionsList`.

Type| Default
---|---
component| [ReactionsList](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Reactions/ReactionsListModal.tsx)

Custom UI component for send button.

Type| Default
---|---
component| [SendButton](https://github.com/GetStream/stream-chat-react/blob/master/src/components/MessageInput/icons.tsx)

You can turn on/off thumbnail generation for video attachments

Type
---
boolean

If true, skips the message data string comparison used to memoize the current channel messages (helpful for channels with 1000s of messages).

Type| Default
---|---
boolean| false

Custom UI component to handle message text input

Type| Default
---|---
component| [TextareaComposer](https://github.com/GetStream/stream-chat-react/blob/master/src/components/TextareaComposer/TextareaComposer.tsx)

Custom UI component to be displayed at the beginning of a thread. By default, it is the thread parent message. It is composed of [Message](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Message/Message.tsx) context provider component and [ThreadStart](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Thread/ThreadStart.tsx) component. The latter can be customized by passing custom component to `Channel` props. The `ThreadHead` component defaults to and accepts the same props as [MessageSimple](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Message/MessageSimple.tsx).

Type| Default
---|---
component| [ThreadHead](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Thread/ThreadHead.tsx)

Custom UI component to display the header of a `Thread`.

Type| Default
---|---
component| [DefaultThreadHeader](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Thread/Thread.tsx)

Custom UI component to display the start of a threaded `MessageList`.

Type| Default
---|---
component| [DefaultThreadStart](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Thread/Thread.tsx)

Custom UI component to display a date used in timestamps. Itâs used internally by the default `MessageTimestamp`, and to display a timestamp for edited messages.

Type| Default
---|---
component| [Timestamp](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Message/Timestamp.tsx)

Custom UI component for the typing indicator.

Type| Default
---|---
component| [TypingIndicator](https://github.com/GetStream/stream-chat-react/blob/master/src/components/TypingIndicator/TypingIndicator.tsx)

Custom UI component that indicates a user is viewing unread messages. It disappears once the user scrolls to `UnreadMessagesSeparator`.

Type| Default
---|---
component| [UnreadMessagesNotification](https://github.com/GetStream/stream-chat-react/blob/master/src/components/MessageList/UnreadMessagesNotification.tsx)

Custom UI component inserted before the first message marked unread.

Type| Default
---|---
component| [UnreadMessagesSeparator](https://github.com/GetStream/stream-chat-react/blob/master/src/components/MessageList/UnreadMessagesSeparator.tsx)

A custom function to provide size configuration for video attachments

Type
---
`(a: Attachment, e: HTMLElement) => VideoAttachmentConfiguration`

Custom UI component to display a message in the `VirtualizedMessageList`.

Type| Default
---|---
component| [MessageSimple](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Message/MessageSimple.tsx)

Custom UI component to display an AI generated message.

Type| Default
---|---
component| [StreamedMessageText](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Message/StreamedMessageText.tsx)

Custom UI component to display the button to stop AI generation instead of the `SendButton` one in `MessageInput`.

Type| Default
---|---
component| [StopAIGenerationButton](https://github.com/GetStream/stream-chat-react/blob/master/src/components/MessageInput/StopAIGenerationButton.tsx)

[PreviousChatContext](/chat/docs/sdk/react/components/contexts/chat_context/)[NextChannelHeader](/chat/docs/sdk/react/components/utility-components/channel_header/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

The `Attachment` component takes a list of message attachments and conditionally renders the UI of each individual attachment based upon its type. The following table shows the attachment UI components that will be rendered for various attachment types:

Attachment Type| UI Component| File type(s) (non-exhaustive)
---|---|---
`audio`| [Audio](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Attachment/Audio.tsx)| MP3, WAV, M4A, FLAC, AAC
`file`| [File](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Attachment/FileAttachment.tsx)| DOC, DOCX, PDF, PPT, PPTX, TXT, XLS, XLSX
`gallery`| [Gallery](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Gallery/Gallery.tsx)| when a message has more than 1 âimageâ type attachment
`image`| [Image](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Gallery/Image.tsx)| HEIC, GIF, JPEG, JPG, PNG, TIFF, BMP
`video`| [ReactPlayer](https://github.com/cookpete/react-player/blob/master/src/ReactPlayer.js)| MP4, OGG, WEBM, Quicktime(QTFF, QT, or MOV)

Message attachment objects that do not conform to one of the above types are considered to contain scraped content and should contain at least `og_scrape_url` or `title_link` to be rendered with the [Card](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Attachment/Card.tsx) component. Otherwise, the attachment is not rendered.

By default, the `Attachment` component is included within `MessageSimple`. To render message attachment UI within a custom [Message UI](/chat/docs/sdk/react/components/message-components/message_ui/) component, import the `Attachment` component and render it conditionally based upon the presence of message attachments.


    const CustomMessage = () => {
      // consume `MessageContext`
      const { message } = useMessageContext();

      const hasAttachments = message.attachments && message.attachments.length > 0;

      return (
        <div>
          {hasAttachments && <Attachment attachments={message.attachments} />}
          // render remaining custom Message UI
        </div>
      );
    };

    <Chat client={client}>
      <Channel channel={channel} Message={CustomMessage}>
        <MessageList />
        <MessageInput />
      </Channel>
    </Chat>;

`Attachment` accepts component override props for each attachment UI component. Building upon the previous example, the below snippets show how to customize one of the individual attachment UI components with either custom Message UI component:


    const CustomImage = (props) => {
      // render custom image component here
    };

    const CustomMessage = () => {
      // consume `MessageContext`
      const { message } = useMessageContext();

      const hasAttachments = message.attachments && message.attachments.length > 0;

      return (
        <div>
          {hasAttachments && (
            <Attachment attachments={message.attachments} Image={CustomImage} />
          )}
          {/* render remaining custom Message UI */}
        </div>
      );
    };

    <Chat client={client}>
      <Channel channel={channel} Message={CustomMessage}>
        <MessageList />
        <MessageInput />
      </Channel>
    </Chat>;

or using wrapped `Attachment` component:


    const CustomAudioAttachment = (props) => {
      // you can add any custom data (such as "customType" in this case)
      if (props.og?.customType === "voice-memo")
        return <div>my custom voice-memo component</div>;
      return <Audio {...props} />;
    };

    const CustomAttachment = (props) => {
      return <Attachment {...props} Audio={CustomAudioAttachment} />;
    };

    <Chat client={client}>
      <Channel channel={channel} Attachment={CustomAttachment}>
        <MessageList />
        <MessageInput />
      </Channel>
    </Chat>;

The following section details how the width and height of images and videos uploaded from files are computed.

You can control the maximum width and height of images and videos with the [`--str-chat__attachment-max-width`](/chat/docs/sdk/react/theming/component-variables/) CSS variable. The value of this variable must be a value that can be computed to a valid pixel value using the [`getComputedStyle`](https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle) method (for example: `300px`, `10rem`, `calc(300px - var(--margin))`, but not `100%`). If you provide an invalid value, the image and video sizing can break, which can lead to scrolling issues inside the message list (for example the message list isnât scrolled to the bottom when you open a channel).

If you set an invalid value to the variable, youâll see a warning on the browserâs console:

![AttachmentSizeWarning](/_astro/AttachmentSizeWarning.B9vIgGRY_Z1TIbdv.webp)

Based on the CSS settings provided for images and videos (see Maximum size section), the SDK will load an image (or thumbnail image in case of a video file) with a reduced file size while still providing sufficient image quality for the given dimensions. This will result in less network traffic and faster image load for users.

For example if an image has `max-width` and `max-height` set to `300px` and the original image has the following dimensions: `965 Ã 1280` itâs enough to load an image with a reduced file size, file size reduction is done by Streamâs CDN.

The SDK will try to display images and videos with their original aspect ratio, however this isnât always guaranteed (in those cases a cropped image will be displayed). Three notable exceptions are:

  1. if a message contains multiple lines of texts and/or multiple attachments, the image/video might be stretched to its `max-width`

**Example 1** \- message with one line of text - image is displayed with original aspect ratio

![ImageSizing1](/_astro/ImageSizing1.DHmj7zxt_Z1I7j9k.webp)

**Example 2** \- message with multiple lines of text - image is cropped

![ImageSizing2](/_astro/ImageSizing2.D2oc9zZZ_Z1kAoLW.webp)

  2. in Safari, images/videos with portrait orientation are stretched to `max-width`

**Example 3** \- portrait images in Safari - image is cropped

![ImageSizing3](/_astro/ImageSizing3.DOYgmypX_Z1cf0gF.webp)

  3. if the image/video canât be rendered with the original aspect ratio given the `max-width` and `max-height` constraints of the host HTML element

**File size optimization** and maintaining **aspect ratio** uses features provided by Streamâs CDN. If youâre using your **own CDN** youâll likely have to provide your own implementation for this. You can do this using the [`imageAttachmentSizeHandler`](/chat/docs/sdk/react/components/core-components/channel#imageattachmentsizehandler/) and [`videoAttachmentSizeHandler`](/chat/docs/sdk/react/components/core-components/channel#videoattachmentsizehandler/) props.

**If youâre planning to rewrite attachment sizing with your own CSS code** itâs important to note that:

The sizing logic for images and videos (the [`imageAttachmentSizeHandler`](/chat/docs/sdk/react/components/core-components/channel#imageattachmentsizehandler/) and [`videoAttachmentSizeHandler`](/chat/docs/sdk/react/components/core-components/channel#videoattachmentsizehandler/)) requires that host elements of images and videos (ususally `img` and `video` elements) have `max-height`/`height` and `max-width` properties defined and that these values can be computed to a valid pixel value using the [`getComputedStyle`](https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle) (for more information refer to the Maximum size section).

The message attachments to render, see [Attachment Format](/chat/docs/javascript/message_format/) in the general JavaScript docs.

Type
---
array

The handler function to call when an action is performed on an attachment, examples include canceling a /giphy command or shuffling the results.

Type
---
(dataOrName?: string | FormData, value?: string, event?: React.BaseSyntheticEvent) => Promise<void>

Custom UI component for displaying attachment actions.

Type| Default
---|---
component| [AttachmentActions](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Attachment/AttachmentActions.tsx)

Custom UI component for displaying an audio type attachment.

Type| Default
---|---
component| [Audio](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Attachment/Audio.tsx)

Custom UI component for displaying a card type attachment.

Type| Default
---|---
component| [Card](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Attachment/Card.tsx)

Custom UI component for displaying a file type attachment.

Type| Default
---|---
component| [File](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Attachment/FileAttachment.tsx)

Custom UI component for displaying a gallery of image type attachments.

Type| Default
---|---
component| [Gallery](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Gallery/Gallery.tsx)

Custom UI component for displaying an image type attachment.

Type| Default
---|---
component| [Image](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Gallery/Image.tsx)

Custom UI component for displaying a video type attachment, defaults to use the [`react-player`](https://github.com/cookpete/react-player) dependency.

Type| Default
---|---
component| [`ReactPlayer`](https://github.com/cookpete/react-player/blob/master/src/ReactPlayer.js)

[PreviousPoll](/chat/docs/sdk/react/components/message-components/poll/)[NextVoice Recording Attachment](/chat/docs/sdk/react/components/message-components/attachment/voice-recording/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

As described in the [Input UI](/chat/docs/sdk/react/components/message-input-components/input_ui/) section, our default [`MessageInputFlat`](https://github.com/GetStream/stream-chat-react/blob/master/src/components/MessageInput/MessageInputFlat.tsx) component is a combination of various UI subcomponents. We export all the building blocks of `MessageInputFlat`, so a custom Input UI component can be built in a similar way. Check out the [Input UI Customization](/chat/docs/sdk/react/guides/theming/input_ui/) section for an example.

The following UI components are available for use:

  * [`TextareaComposer`](https://github.com/GetStream/stream-chat-react/blob/master/src/components/TextareaComposer/TextareaComposer.tsx) \- wrapper component that provides data and functionality to the underlying `textarea` component imported from [react-textarea-autosize](https://www.npmjs.com/package/react-textarea-autosize)

  * [`EmojiPicker`](https://github.com/GetStream/stream-chat-react/blob/master/src/components/MessageInput/EmojiPicker.tsx) \- picker component for selecting an emoji

  * [`LinkPreviewList`](https://github.com/GetStream/stream-chat-react/blob/master/src/components/MessageInput/LinkPreviewList.tsx) \- component rendering scraped link data in a preview cards

  * [`QuotedMessagePreview`](https://github.com/GetStream/stream-chat-react/blob/master/src/components/MessageInput/QuotedMessagePreview.tsx) \- displays a UI wrapper around the `MessageInput` when an existing message is being quoted

  * [`SendButton`](https://github.com/GetStream/stream-chat-react/blob/master/src/components/MessageInput/icons.tsx) \- on click, sends a message to the currently active channel

  * [`AttachmentPreviewList`](https://github.com/GetStream/stream-chat-react/blob/master/src/components/MessageInput/AttachmentPreviewList/AttachmentPreviewList.tsx) \- displays a list of message attachments

Props forwarded to `textarea` element. Note that `defaultValue`, `style`, `value` and `disabled` are omitted.


    type additionalTextareaProps = Omit<
      React.TextareaHTMLAttributes<HTMLTextAreaElement>,
      "defaultValue" | "style" | "disabled" | "value"
    >;

You can configure the default value and disabled state via [`MessageComposer` configuration](/chat/docs/sdk/react/components/message-input-components/message-composer#message-composer-configuration). The value is handled by the `MessageComposer.textComposer` state. The style should be attached via CSS.

If enabled, the suggestion list is hidden when clicked outside the `MessageInput`.

Type
---
boolean

HTML class applied to the `div` wrapping the `textarea`.

Type
---
string

HTML class applied to the `ul` element wrapping suggestion items in `SuggestionList`.

Type
---
string

Maximum number of rows the `teaxtarea` allowed to grow.

Type| Default
---|---
number| 1

Maximum number of rows the `teaxtarea` allowed to shrink.

Type| Default
---|---
number| 1

Function result will decide whether the combination of keys pressed should be evaluated as signal for message submission.

Type
---
`(event: React.KeyboardEvent<HTMLTextAreaElement>) => boolean`

If true, updates the CSS class name of the `div` container and renders a smaller version of the picker.

Type| Default
---|---
boolean| false

The component does not have any props.

Function to render message text content


    type renderText = (
      text?: string,
      mentioned_users?: UserResponse[],
      options?: RenderTextOptions,
    ) => ReactNode;

Function to send a message to the currently active channel.

Type
---
`(event: React.BaseSyntheticEvent, customMessageData?: Omit<UpdatedMessage, 'mentioned_users'>) => void`

Renders message attachments in preview. The default (supported) message attachment types are:

  * `audio`
  * `video`
  * `image`
  * `voiceRecording`
  * `file`

If the attachment object has property `og_scrape_url` or `title_link`, then it is rendered by `LinkPreviewList` component and not `AttachmentPreviewList`.

Custom component to be rendered for attachments of types `'file'`, `'video'`, `'audio'`.

Type
---
`ComponentType<FileAttachmentPreviewProps>`

Custom component to be rendered for uploaded `'image'` attachment.

Type
---
`ComponentType<ImageAttachmentPreviewProps>`

Custom component to be rendered for attachment that is not recognized as any of the default types.

Type
---
`ComponentType<UnsupportedAttachmentPreviewProps>`

Custom component to preview audio recorded using [`AudioRecorder` component](/chat/docs/sdk/react/components/message-input-components/audio_recorder/).

Type
---
`ComponentType<VoiceRecordingPreviewProps>`

[PreviousInput UI](/chat/docs/sdk/react/components/message-input-components/input_ui/)[NextEmoji Picker](/chat/docs/sdk/react/components/message-input-components/emoji-picker/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

The context value is provided by `VirtualizedMessageListContextProvider` which wraps the contents rendered by [`VirtualizedMessageList`](/chat/docs/sdk/react/components/core-components/message_list/). It exposes API that the default and custom components rendered by `VirtualizedMessageList` can take advantage of. The components that can consume the context are:

  * `EmptyStateIndicator` \- rendered when there are no messages in the channel. The [`component can be customized`](/chat/docs/sdk/react/components/contexts/component_context#emptystateindicator/).
  * `LoadingIndicator` \- rendered while loading more messages to the channel. The [`component can be customized`](/chat/docs/sdk/react/components/contexts/component_context#loadingindicator/).
  * `MessageListNotifications` \- component rendering application notifications. The [`component can be customized`](/chat/docs/sdk/react/components/contexts/component_context#messagelistnotifications/).
  * `MessageNotification` \- component used to display a single notification message in `MessageListNotifications`. The [`component can be customized`](/chat/docs/sdk/react/components/contexts/component_context#messagenotification/).
  * `TypingIndicator` \- component indicating that another user is typing a message in a given channel. The [`component can be customized`](/chat/docs/sdk/react/components/contexts/component_context#typingindicator/).
  * `Message` and its children - component to render a message. The [`component can be customized`](/chat/docs/sdk/react/components/contexts/component_context#message/).
  * `DateSeparator` \- component rendered to separate messages posted on different dates. The [`component can be customized`](/chat/docs/sdk/react/components/contexts/component_context#dateseparator/).
  * `MessageSystem` \- component to display system messages in the message list. The [`component can be customized`](/chat/docs/sdk/react/components/contexts/component_context#messagesystem/).
  * `HeaderComponent` \- component to be displayed before the oldest message in the message list. The [`component can be customized`](/chat/docs/sdk/react/components/contexts/component_context#headercomponent/).
  * `UnreadMessagesNotification` \- custom UI component that indicates a user is viewing unread messages. It disappears once the user scrolls to `UnreadMessagesSeparator`. The [`component can be customized`](/chat/docs/sdk/react/components/contexts/component_context#unreadmessagesnotification/).
  * `UnreadMessagesSeparator` \- component to be displayed before the oldest message in the message list. The [`component can be customized`](/chat/docs/sdk/react/components/contexts/component_context#unreadmessagesseparator/).

Pull the value from context with our custom hook:


    import { useVirtualizedMessageListContext } from "stream-chat-react";

    export const CustomComponent = () => {
      const { scrollToBottom } = useVirtualizedMessageListContext();
      // component logic ...
      return {
        /* rendered elements */
      };
    };

Function that scrolls the list to the bottom.

Type
---
`() => void`

[PreviousMessageListContext](/chat/docs/sdk/react/components/contexts/message_list_context/)[NextThread](/chat/docs/sdk/react/components/core-components/thread/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

The `ChannelStateContext` is a one of the context providers exposed in the [`Channel`](/chat/docs/sdk/react/components/core-components/channel/) component and is consumable by all of the `Channel` children components. The context provides all the state properties and logic for a `channel`, and you can access these by calling the `useChannelStateContext` custom hook.

Pull values from context with our custom hook:


    const { channel, watchers } = useChannelStateContext();

The currently active `StreamChat` `channel` instance to be loaded into the `Channel` component and referenced by its children.

Type
---
object

The allowed channel permissions for the currently connected user.

Type
---
object

The configurations object for the currently active channel.

Type
---
object

The read state maintained for use by components representing channel unread state (for example `UnreadMessagesSeparator`, `UnreadMessagesNotification`).

Property| Type| Description
---|---|---
**last_read**| `Date`| Date when the channel was marked read the last time.
**unread_messages**| `number`| The count of unread messages in a given channel. Unread count refers only to foreign (not own) unread messages.
**first_unread_message_id**| `string` or `undefined`| The ID of the message that was marked unread (`notification.mark_unread` event). The value is available only when a message is marked unread. Therefore, cannot be relied on to place unread messages UI.
**last_read_message_id**| `string` or `undefined`| The ID of the message preceding the first unread message.

Type
---
`ChannelUnreadUiState`

Error object (if any) in loading the `channel`, otherwise null.

Type
---
object

Custom function to identify URLs in a string for later generation of link previews. See the guide [Link Previews in Message Input](/chat/docs/sdk/react/guides/customization/link-previews/) for more.

Type
---
`(text: string) => string[]`

The value is forwarded to the context from the `Channel` component [prop `giphyVersion`](/chat/docs/sdk/react/components/core-components/channel#giphyversion/).

Type| Default
---|---
string| âfixed_heightâ

The value is forwarded to the context from the `Channel` component [prop `imageAttachmentSizeHandler`](/chat/docs/sdk/react/components/core-components/channel#imageattachmentsizehandler/).

Type
---
`(a: Attachment, e: HTMLElement) => ImageAttachmentConfiguration`

If the channel has more, older, messages to paginate through.

Type
---
boolean

If the channel has more, newer, messages to paginate through.

Type
---
boolean

Value is used internally for jump-to-message logic. Once the user âjumpedâ to the message, the message with the given ID is highlighted by manipulating its styles attribute.

Type
---
string

Boolean for the `channel` loading state.

Type
---
boolean

Boolean for the `channel` loading more messages.

Type
---
boolean

Flag signalling whether newer messages are being loaded as the user scrolls down in the message list. Used internally by `VirtualizedMessageList`.

Type
---
boolean

Members of this `channel` (members are permanent, watchers are users who are online right now).

Type
---
object[]

Array of [message objects](/chat/docs/javascript/message_format/).

Type
---
object[]

An array of muted users for a `channel`.

Type
---
object[]

Temporary notifications added to the `MessageList` on specific user/message actions.

Type
---
{id: string, text: string, type: âsuccessâ | âerrorâ}[]

Custom function to react to link preview dismissal. See the guide [Link Previews in Message Input](/chat/docs/sdk/react/guides/customization/link-previews/) for more.

Type
---
`(linkPreview: LinkPreview) => void`

The messages that are pinned in the `channel`.

Type
---
object[]

The read state for each `channel` member.

Type
---
object

Flag signalling whether the scroll to the bottom is prevented. Used internally by `MessageList` and `VirtualizedMessageList` components.

Type
---
boolean

The value is forwarded to the context from the `Channel` component [prop `shouldGenerateVideoThumbnail`](/chat/docs/sdk/react/components/core-components/channel#shouldgeneratevideothumbnail/).

Type
---
`boolean`

The parent message for a `thread`, if there is one, otherwise null.

Type
---
object

Boolean showing if there are more messages available in current active `thread`, set to false when the end of pagination is reached.

Type
---
boolean

If the thread is currently loading more messages.

Type
---
boolean

Array of messages within a `thread`.

Type
---
object[]

Flag signalling whether the scroll to the bottom is prevented in thread. Used internally by `MessageList` and `VirtualizedMessageList` components.

Type
---
boolean

The value is forwarded to the context from the `Channel` component [prop `videoAttachmentSizeHandler`](/chat/docs/sdk/react/components/core-components/channel#videoattachmentsizehandler/).

Type
---
`(a: Attachment, e: HTMLElement) => VideoAttachmentConfiguration`

The number of watchers on the `channel`.

Type
---
number

An array of users who are currently watching the `channel`.

Type
---
object[]

The number of watchers on the `channel`.

Type
---
number

[PreviousChannelActionContext](/chat/docs/sdk/react/components/contexts/channel_action_context/)[NextComponentContext](/chat/docs/sdk/react/components/contexts/component_context/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

The [`ChannelList`](/chat/docs/sdk/react/components/core-components/channel_list/) prop `Preview` allows you to override the preview component which is rendered for each channel in the list (think of it as the UI of a `ChannelList` item). The component passed as the `Preview` will receive props from the `ChannelList` and the `ChannelPreview` wrapper (which extends these props with additional UI-specific items and renders it). Apart from the UI the `Preview` component is also responsible for channel selection (click handler).

The `Preview` property defaults to [`ChannelPreviewMessenger`](https://github.com/GetStream/stream-chat-react/blob/master/src/components/ChannelPreview/ChannelPreviewMessenger.tsx) component if no custom component is provided.

For even deeper customization of the channel list and channel previews, use the [`renderChannels`](/chat/docs/sdk/react/components/core-components/channel_list#renderchannels/) prop of the `ChannelList` component. Note, however, that using a custom channel list renderer requires more work than overriding the preview UI.

To customize the `ChannelList` item UI simply pass your custom `Preview` component to the `ChannelList`. See [The Preview Prop Component](/chat/docs/sdk/react/guides/customization/channel_list_preview#the-preview-prop-component/) for the extended guide.


    const CustomChannelPreviewUI = ({ latestMessagePreview, lastMessage }) => {
      // "lastMessage" property is for the last
      // message that has been interacted with (pinned/edited/deleted)

      // to display last message of the channel use "latestMessagePreview" property
      return <span>{latestMessagePreview}</span>;
    };

    <ChannelList Preview={CustomChannelPreviewUI} />;

This required prop is the channel to be previewed; comes from either the `channelRenderFilterFn` or `usePaginatedChannels` call from [ChannelList](https://github.com/GetStream/stream-chat-react/blob/master/src/components/ChannelList/ChannelList.tsx) and does not need to be set manually.

Type
---
`Channel`

If the componentâs channel is the active (selected) channel.

Type
---
`boolean`

The currently selected channel object.

Type
---
`Channel`

The custom UI component to display the avatar for the channel.

Type| Default
---|---
`component`| [Avatar](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Avatar/Avatar.tsx)

A number that forces the update of the preview component on channel update.

Type
---
`number`

Custom class for the channel preview root

Type
---
`string`

Image of channel to display.

Type
---
`string`

Title of channel to display.

Type
---
`string`

Custom function that generates the message preview in ChannelPreview component.

Type
---
`(channel: Channel, t: TranslationContextValue['t'], userLanguage: TranslationContextValue['userLanguage']) => string | JSX.Element`

The last message received in a channel.

Type
---
`LocalMessage`

Deprecated, use `latestMessagePreview` instead.

Type
---
`string | JSX.Element`

Latest message preview to display. Will be either a string or a JSX.Element rendering markdown.

Type
---
`string | JSX.Element`

Status describing whether own message has been delivered or read by another. If the last message is not an own message, then the status is undefined. The value is calculated from `channel.read` data on mount and updated on every `message.new` resp. `message.read` WS event.

Type
---
`MessageDeliveryStatus`

Use `MessageDeliveryStatus` enum to determine the current delivery status, for example:


    import type { MessageDeliveryStatus } from "stream-chat-react";
    import { DoubleCheckMarkIcon, SingleCheckMarkIcon } from "../icons";

    type MessageDeliveryStatusIndicator = {
      messageDeliveryStatus: MessageDeliveryStatus;
    };

    export const MessageDeliveryStatusIndicator = ({
      messageDeliveryStatus,
    }: MessageDeliveryStatusIndicator) => {
      // the last message is not an own message in the channel
      if (!messageDeliveryStatus) return null;

      return (
        <div>
          {messageDeliveryStatus === MessageDeliveryStatus.DELIVERED && (
            <SingleCheckMarkIcon />
          )}
          {messageDeliveryStatus === MessageDeliveryStatus.READ && (
            <DoubleCheckMarkIcon />
          )}
        </div>
      );
    };

Custom handler invoked when the `ChannelPreview` is clicked. The SDK uses `ChannelPreview` to display items of channel search results. There, behind the scenes, the new active channel is set.

Type
---
`(event: React.MouseEvent) => void`

The UI component to use for display.

Type| Default
---|---
`component`| [ChannelPreviewMessenger](https://github.com/GetStream/stream-chat-react/blob/master/src/components/ChannelPreview/ChannelPreviewMessenger.tsx)

The setter function for a selected `channel`.

Type
---
`ChatContextValue['setActiveChannel']`

The number of unread Messages.

Type
---
`number`

The object containing watcher parameters. See the [Pagination documentation](/chat/docs/react/channel_pagination/) for a list of available fields for sort.

Type
---
`{ limit?: number; offset?: number }`

[PreviousChannelList Hooks](/chat/docs/sdk/react/hooks/channel_list_hooks/)[NextChannelSearch](/chat/docs/sdk/react/components/utility-components/channel_search/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

`ChannelSearch` is a UI component that searches for chat users and displays the results in a list. It can be used standalone or in the `ChannelList` via the `showChannelSearch` prop (default is false). The input searches for users by default, but you can utilize the `searchForChannels` prop to also search for `channels`. Completely override the querying via the `searchFunction` prop. Selection of a search result will set the active channel with the selected user, or if a channel is an option and is selected, set the active channel with the existing channel.

**Example 1** \- used via the `showChannelSearch` prop.


    <Chat client={client}>
      <ChannelList
        filters={filters}
        sort={sort}
        options={options}
        showChannelSearch
      />
      <Channel>
        <Window>
          <ChannelHeader />
          <MessageList />
          <MessageInput />
        </Window>
        <Thread />
      </Channel>
    </Chat>

The `ChannelSearch` component renders 2 components:

  1. the search input
  2. the search results list

The input naturally transitions between 3 states:

Input state| Input| Search results
---|---|---
inactive| not focused| not rendered
focused| focused and empty| not rendered
active search| contains non-empty search string| rendered

It is possible to jump directly from active search state to inactive by pressing the Esc key or by erasing the search input value. The search results container is shown only if the search input contains non-empty string.

Once the search results container is rendered it transitions between the following states:

Search results state| Search results
---|---
loading| the search API call is in progress
empty search (result)| the search API call returned an empty array
non-empty search (result)| the search API call returned an array of channel and user objects

The [SearchInput source code](https://github.com/GetStream/stream-chat-react/blob/master/src/components/ChannelSearch/SearchInput.tsx) shows that the component renders a single text input element. User can provide a custom [`SearchInput`](/chat/docs/sdk/react/components/utility-components/channel_search/#searchinput/) component implementation though.

The `SearchBar` contains multiple elements - buttons and text input. The buttons are conditionally rendered based on user interaction with the `ChannelSearch` components. All the button icons displayed in the `SearchBar` are customizable. User can provide a custom [`SearchBar`](/chat/docs/sdk/react/components/utility-components/channel_search/#searchbar/) component implementation.

The `SearchBar` transitions between the same states as the `SearchInput`, but renders more elements.

The `SearchBar` is rendered with [app menu icon](/chat/docs/sdk/react/components/utility-components/channel_search/#menuicon/) if a custom [`AppMenu` component](/chat/docs/sdk/react/components/utility-components/channel_search/#appmenu/) is provided to the `ChannelSearch`. Otherwise, only search input is visible.

![Image of an inactive search bar state with an app menu](/_astro/inactive-searchbar-no-app-menu.DdXg8oMd_AcMoa.webp)

![Image of an inactive search bar state without an app menu](/_astro/inactive-searchbar-with-app-menu.DMmN7Cuh_153BxW.webp)

Once the input is focused, a return-arrow button occurs with [`ExitSearchIcon`](/chat/docs/sdk/react/components/utility-components/channel_search/#exitsearchicon/) to exit the active state. Note the app menu icon is actually replaced by the return arrow button. After typing the search query a clear-input button with [`ClearInputIcon`](/chat/docs/sdk/react/components/utility-components/channel_search/#clearinputicon/) appears inside the search input.

![Image of an active search bar state with empty input](/_astro/active-searchbar-no-text.aln4p0Xk_1tiumu.webp)

![Image of an active search bar with search query](/_astro/active-searchbar-with-text.CwuXtvtk_Z1I2JPI.webp)

By clicking the return-arrow button, the user returns to the inactive search state. By clicking the clear-input button the input is cleared but kept focused with return-arrow still displayed (with possibility to exit the search altogether).

The active search UI state can be exited by pressing the `Escape` key as well.

The following states are reflected in the `SearchResults`:

  1. The search query being in progress (can be customized with [`SearchLoading`](/chat/docs/sdk/react/components/utility-components/channel_search/#searchloading/) )
  2. The empty search result (can be customized with [`SearchEmpty`](/chat/docs/sdk/react/components/utility-components/channel_search/#searchempty/))
  3. The listing of found channels (if [`searchForChannels`](/chat/docs/sdk/react/components/utility-components/channel_search/#searchforchannels/) is set to `true`) and users

The look of the latter can be customized by providing [`SearchResultsHeader`](/chat/docs/sdk/react/components/utility-components/channel_search/#searchresultsheader/), [`SearchResultItem`](/chat/docs/sdk/react/components/utility-components/channel_search/#searchresultitem/), [`SearchResultsList`](/chat/docs/sdk/react/components/utility-components/channel_search/#searchresultslist/)) (renders the list of `SearchResultItem`).

The default styling of the first two states are as follows:

![Image of search results list content when loading](/_astro/search-results-loading-theme.CMVNBLpQ_PdO0P.webp)

![Image of empty search results](/_astro/search-results-empty-theme.Chv_FqPg_Z2giqXE.webp)

The search results can be rendered in place of the channel list or above the channel list in a floating container. This behavior is toggled by [`popupResults`](/chat/docs/sdk/react/components/utility-components/channel_search/#popupResults/) prop.

![Image of search results displayed inline](/_astro/search-results-inline-theme.Da0NDxeh_Zawhyu.webp)

![Image of search results displayed floating above the channel list](/_astro/search-results-popup-theme.DbMq4DU__FOMX.webp)

The `ChannelSearch` offers possibility to keep the search results open meanwhile the user clicks between the search results. This behavior is controlled by [`clearSearchOnClickOutside`](/chat/docs/sdk/react/components/utility-components/channel_search/#clearsearchonclickoutside/) flag. The selected channel is added to the channel list if it was not present there before the search.

By default, the `ChannelSearch` component searches just for users. Use the `searchForChannels` prop to also search for channels.

To override the search method completely, use the `searchFunction` prop. This prop is useful, say, when you want to search only for channels that the current logged in user is a member of. See the example below for this.


    const customSearchFunction = async (
      props: ChannelSearchFunctionParams,
      event: { target: { value: SetStateAction<string> } },
      client: StreamChat,
    ) => {
      const { setResults, setSearching, setQuery } = props;
      const value = event.target.value;

      const filters = {
        name: { $autocomplete: value },
        members: { $in: client.userID },
      };

      setSearching(true);
      setQuery(value);
      const channels = await client.queryChannels(filters);
      setResults(channels);
      setSearching(false);
    };


    const { client } = useChatContext();

    <ChannelList
      additionalChannelSearchProps={{
        searchFunction: (params, event) => {
          return customSearchFunction(params, event, client);
        },
      }}
      showChannelSearch
    />;

Application menu / drop-down to be displayed when clicked on [`MenuIcon`](/chat/docs/sdk/react/components/utility-components/channel_search/#menuicon/). Prop is consumed only by the [`SearchBar` component](/chat/docs/sdk/react/components/utility-components/channel_search/#searchbar/). No default component is provided by the SDK. The library does not provide any CSS for `AppMenu`. Consult the customization tutorial on how to [add AppMenu to your application](/chat/docs/sdk/react/guides/customization/channel_search#adding-menu/). The component is passed a prop `close`, which is a function that can be called to hide the app menu (e.g. on menu item selection).

Type| Default
---|---
`React.ComponentType`| `undefined`

The type of `channel` to create on user result selection.

Type| Default
---|---
`livestream` | `messaging` | `team` | `gaming` | `commerce`| `messaging`

Custom icon component used as a content of the button used to clear the search input. Prop is consumed only by the [`SearchBar` component](/chat/docs/sdk/react/components/utility-components/channel_search/#searchbar/).

Type| Default
---|---
`React.ComponentType`| [XIcon](https://github.com/GetStream/stream-chat-react/blob/master/src/components/ChannelSearch/icons.tsx)

Signals that the search state / results should be cleared on every click outside the search input (e.g. selecting a search result or exiting the search UI), defaults to `true`. If set to `false`, the search results are kept in the UI meanwhile the user changes between the channels.

Type| Default
---|---
`boolean`| `true`

Disables execution of the search queries and makes the search text input element disabled. Defaults to `false`.

Type| Default
---|---
`boolean`| `false`

Custom icon component used as a content of the button used to exit the search UI. Prop is consumed only by the [`SearchBar` component](/chat/docs/sdk/react/components/utility-components/channel_search/#searchbar/).

Type| Default
---|---
`React.ComponentType`| [ReturnIcon](https://github.com/GetStream/stream-chat-react/blob/master/src/components/ChannelSearch/icons.tsx)

Custom icon component used as a content of the button used to invoke the [`AppMenu`](/chat/docs/sdk/react/components/utility-components/channel_search/#appmenu/). Prop is consumed only by the [`SearchBar` component](/chat/docs/sdk/react/components/utility-components/channel_search/#searchbar/). The menu icon button is displayed only if `AppMenu` component has been passed to `ChannelSearch` props.

Type| Default
---|---
`React.ComponentType`| [MenuIcon](https://github.com/GetStream/stream-chat-react/blob/master/src/components/ChannelSearch/icons.tsx)

Callback invoked with every search input change handler. SDK user can provide own implementation. The prop is used by the `ChannelList` component to set a flag determining that the search has been initiated. If the search has been initiated and search result are to be displayed instead of the list of loaded channels ([`popupResults` flag](/chat/docs/sdk/react/components/utility-components/channel_search/#popupresults/) is set to `false`), then the list of loaded channels is not rendered. This logic is executed despite passing custom implementation of `onSearch` function to `ChanneList` props.

Type
---
`React.ChangeEventHandler<HTMLInputElement\>`

Callback invoked when the search UI is deactivated. The `ChannelList` component uses it to set a flag that the search has been terminated and search results are not expected to be displayed in place of the list of loaded channels. And so the `ChannelList` renders the list of loaded channels. This logic is executed despite passing custom implementation of `onSearchExit` function to `ChanneList` props.

Type
---
`() => void`

Custom handler function to run on search result item selection. If not provided then the default selection handler takes care of:

  1. loading the active channel
  2. adding the selected channel to the channel list
  3. clearing the search results, if [`clearSearchOnClickOutside` flag](/chat/docs/sdk/react/components/utility-components/channel_search/#clearsearchonclickoutside/) is set to true (default)

Type
---
(
`params: ChannelSearchFunctionParams,`
`result: ChannelOrUserResponse`
) => Promise<void> | void

Custom placeholder text to be displayed in the search input. Can be passed down from `ChannelList` via its `additionalChannelSearchProps`. If using custom i18n translations, it is preferable to change the placeholder value in your translations files under the key `'Search'`.

Type| Default
---|---
`string`| `'Search'`

Display search results as an absolutely positioned popup, defaults to false and shows inline.

Type| Default
---|---
`boolean`| `false`

Custom component to be rendered instead of the default [SearchBar](https://github.com/GetStream/stream-chat-react/blob/master/src/components/ChannelSearch/SearchBar.tsx). The default `SearchBar` component is a composite of multiple buttons and a search input. You can find more information about its features in an [above section](/chat/docs/sdk/react/components/utility-components/channel_search/#searchbar-component/).

Type| Default
---|---
`React.ComponentType<SearchBarProps\>`| [SearchBar](https://github.com/GetStream/stream-chat-react/blob/master/src/components/ChannelSearch/SearchBar.tsx)

Custom UI component to display empty search results.

Type| Default
---|---
`React.ComponentType`| [DefaultSearchEmpty](https://github.com/GetStream/stream-chat-react/blob/master/src/components/ChannelSearch/SearchResults.tsx)

Boolean to search for channels as well as users in the server query, default is `false` and just searches for users.

Type| Default
---|---
`boolean`| `false`

Custom search function to override default. The first argument should expect an object of type `ChannelSearchFunctionParams`. It carries references to the `Dispatch<SetStateAction>` functions that allow to control the search state:

  * `setQuery` \- sets the search input value, the default value is an empty string
  * `setResults` \- sets the array of search results, the default value is an empty array
  * `setSearching` \- signals that the HTTP search request is in progress

Type
---
(`params: ChannelSearchFunctionParams, event: React.BaseSyntheticEvent` ) => Promise<void> | void

See also Customizing the search method.

The number of milliseconds to debounce the search query.

Type| Default
---|---
`number`| 300

Custom UI component to display the search text input.

Type| Default
---|---
`React.ComponentType<SearchInputProps>`| [SearchInput](https://github.com/GetStream/stream-chat-react/blob/master/src/components/ChannelSearch/SearchInput.tsx)

Custom UI component to display the search loading state. Rendered within the `SearchResults` component.

Type| Default
---|---
`React.ComponentType`| a div with: âSearchingâ¦â

Object containing filters/sort/options overrides for user / channel search.

The `filters` attribute (`SearchQueryParams.userFilters.filters`) can be either `UserFilters` object describing the filter query or a function with a single argument of the search / filter (query) string. The function is then expected to derive and return the `UserFilters` from the provided query string.

Type
---
`SearchQueryParams`

Custom UI component to display the search results header.

Type| Default
---|---
`React.ComponentType`| [DefaultSearchResultsHeader](https://github.com/GetStream/stream-chat-react/blob/master/src/components/ChannelSearch/SearchResults.tsx)

Custom UI component to display a search result list item.

Type| Default
---|---
`React.ComponentType<SearchResultItemProps>`| [DefaultSearchResultItem](https://github.com/GetStream/stream-chat-react/blob/master/src/components/ChannelSearch/SearchResults.tsx)

Custom UI component to display all the search results.

Type| Default
---|---
`React.ComponentType<SearchResultsListProps>`| [DefaultSearchResultsList](https://github.com/GetStream/stream-chat-react/blob/master/src/components/ChannelSearch/SearchResults.tsx)

[PreviousChannel Preview](/chat/docs/sdk/react/components/utility-components/channel_preview_ui/)[NextInfinite Scroll](/chat/docs/sdk/react/guides/channel-list-infinite-scroll/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

The `ChannelList` component queries an array of `channel` objects from the Stream Chat API and displays as a customizable list in the UI. It accepts props for `filters`, `sort` and `options`, which allows you to tailor your request to the [Query Channels](/chat/docs/javascript/query_channels/) API. The response array from this API is then rendered in a list and loaded into the DOM.


    const channels = await client.queryChannels(filters, sort, options);

The `ChannelList` component also comes pre-built with navigation functionality. The click of a list item sets the active `channel` object and loads the [`Channel`](/chat/docs/sdk/react/components/core-components/channel/) component.

The `ChannelList` does not have any required props, but in order to refine channel query results we recommend providing values for `filters`, `sort` and `options`.

By default when channels query does not have any filter it will match all the channels in your application. While this might be convenient during the development, you most likely want to have at least some basic filtering.

**At a minimum, the filter should include`{members: { $in: [userID] }}`.**


    const filters = { members: { $in: [ 'jimmy', 'buffet' ] } }
    const sort = { last_message_at: -1 };
    const options = { limit: 10 }

    <Chat client={client}>
      <ChannelList filters={filters} sort={sort} options={options} />
      <Channel>
        <MessageList />
        <MessageInput />
      </Channel>
    </Chat>

`ChannelList` UI is determined by two of its props, `List` and `Preview`. The `List` prop allows you to customize the container in which the array of channels is rendered. The `Preview` prop dictates the design and click functionality of an individual channel in the list. If not provided via props, these UI components default to [`ChannelListMessenger`](https://github.com/GetStream/stream-chat-react/blob/master/src/components/ChannelList/ChannelListMessenger.tsx) and [`ChannelPreviewMessenger`](https://github.com/GetStream/stream-chat-react/blob/master/src/components/ChannelPreview/ChannelPreviewMessenger.tsx).

To customize the container and list item UI for your `ChannelList`, provide custom component overrides. Your custom components will receive the same props as the defaults.


    const CustomListContainer = (props) => {
      // render custom list container here
    };

    const CustomListItem = (props) => {
      // render custom list item here
    };

    <Chat client={client}>
      <ChannelList List={CustomListContainer} Preview={CustomListItem} />
      <Channel>
        <MessageList />
        <MessageInput />
      </Channel>
    </Chat>;

In cases where the customizations provided by `Preview` are not enough, e.g. grouping channels under sections based on some dynamic channel data, the `renderChannels` may be a good fit as all loaded channels are passed as an argument to the function.


    const renderChannels = (loadedChannels, ChannelPreview) => {
      const groups = groupBy(loadedChannels, 'some_custom_channel_data');
      return renderGroups(groups); // inside renderGroups you have have headings, etc...
    }

    <Chat client={client}>
      <ChannelList {/* other props */} renderChannels={renderChannels} />
      <Channel>
        <MessageList />
        <MessageInput />
      </Channel>
    </Chat>;

In order to handle the requisite, dynamic nature of the `ChannelList`, a variety of [event listeners](/chat/docs/javascript/event_listening/) are added on component mount. Many of these event listeners accept custom handler functions, allowing you to override the libraryâs default event response behavior.

Each custom handler accepts the same function arguments. Through a combination of pulling updated data off the event object and re-setting the list state, you can customize behavior and UI.

  * `setChannels` \- state setter for the `channels` value which populates the list in the DOM
  * `event` \- event object returned from each corresponding event listener

[Event Type](/chat/docs/javascript/event_object/)| Default Behavior| Custom Handler
---|---|---
`channel.deleted`| Removes channel from list| onChannelDeleted
`channel.hidden`| Removes channel from list| onChannelHidden
`channel.truncated`| Updates the channel| onChannelTruncated
`channel.updated`| Updates the channel| onChannelUpdated
`channel.visible`| Adds channel to list| onChannelVisible
`connection.recovered`| Forces a component render| N/A
`message.new`| Moves channel to top of list| onMessageNewHandler
`notification.added_to_channel`| Moves channel to top of list and starts watching| onAddedToChannel
`notification.message_new`| Moves channel to top of list and starts watching| onMessageNew
`notification.removed_from_channel`| Removes channel from list| onRemovedFromChannel
`user.presence.changed`| Updates the channel| N/A

The event type the `ChannelList` reacts to and its corresponding behavior can be overridden using the appropriate prop. Letâs look at an example of customizing the ChannelList component to only display [frozen channels](/chat/docs/javascript/disabling_channels/).


    const filters = {
      members: { $in: ['dan'] },
      frozen: true
    }

    <ChannelList filters={filters} />

The `notification.message_new` event occurs when a message is received on a channel that is not loaded but the current user is a member of. The default behavior when this event occurs is to query the channel the message is received on, then add the channel to the top of the list, irrespective of `filters`. Thus, if a new message appears in an unfrozen channel of which the current user is a member, it will be added to the list. This may not be the desired behavior since the list is only supposed to show frozen channels.

In this case, you can replace the default functionality by providing a custom `onMessageNew` function as a prop to the `ChannelList` component. `onMessageNew` receives two parameters when called, `setChannels`, a setter function for the internal `channels` state, and `event`, the `Event` object received for the `notification.message_new` event. These parameters can be used to create a function that achieves the desired custom behavior.


    const filters = {
      members: { $in: ["dan"] },
      frozen: true,
    };

    const customOnMessageNew = async (setChannels, event) => {
      const eventChannel = event.channel;

      // If the channel isn't frozen, then don't add it to the list.
      if (!eventChannel?.id || !eventChannel.frozen) return;

      try {
        const newChannel = client.channel(eventChannel.type, eventChannel.id);
        await newChannel.watch();
        setChannels((channels) => [newChannel, ...channels]);
      } catch (error) {
        console.log(error);
      }
    };

    <ChannelList filters={filters} onMessageNew={customOnMessageNew} />;

Similarly, events other than `notification.message_new` can be handled as per application requirements.

Additional props to be passed to the underlying [`ChannelSearch`](/chat/docs/sdk/react/components/utility-components/channel_search/) component.

Type
---
object

When the client receives `message.new`, `notification.message_new`, and `notification.added_to_channel` events, we automatically push that channel to the top of the list. If the channel doesnât currently exist in the list, we grab the channel from `client.activeChannels` and push it to the top of the list. You can disable this behavior by setting this prop to false, which will prevent channels not in the list from incrementing the list.

Type| Default
---|---
boolean| true

Custom UI component to display the userâs avatar.

Type| Default
---|---
component| [Avatar](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Avatar/Avatar.tsx)

Optional function to filter channels prior to loading in the DOM. Do not use any complex or async logic that would delay the loading of the `ChannelList`. We recommend using a pure function with array methods like filter/sort/reduce.

Type
---
(channels: Channel[]) => Channel[]

Custom UI component to display search results.

Type| Default
---|---
component| [ChannelSearch](https://github.com/GetStream/stream-chat-react/blob/master/src/components/ChannelSearch/ChannelSearch.tsx)

Set a channel (with this ID) to active and force it to move to the top of the list.

Type
---
string

Custom function that handles the channel pagination.

Takes parameters:

Parameter| Description
---|---
`currentChannels`| The state of loaded `Channel` objects queried thus far. Has to be set with `setChannels` (see below).
`queryType`| A string indicating, whether the channels state has to be reset to the first page (âreloadâ) or newly queried channels should be appended to the `currentChannels`.
`setChannels`| Function that allows us to set the channels state reflected in `currentChannels`.
`setHasNextPage`| Flag indicating whether there are more items to be loaded from the API. Should be infered from the comparison of the query result length and the query options limit.

The function has to:

  1. build / provide own query filters, sort and options parameters
  2. query and append channels to the current channels state
  3. update the `hasNext` pagination flag after each query with `setChannels` function

An example below implements a custom query function that uses different filters sequentially once a preceding filter is exhausted:


    import uniqBy from "lodash.uniqby";
    import throttle from "lodash.throttle";
    import { useCallback, useRef } from "react";
    import {
      ChannelFilters,
      ChannelOptions,
      ChannelSort,
      StreamChat,
    } from "stream-chat";
    import { CustomQueryChannelParams, useChatContext } from "stream-chat-react";

    const DEFAULT_PAGE_SIZE = 30 as const;

    export const useCustomQueryChannels = () => {
      const { client } = useChatContext();
      const filters1: ChannelFilters = {
        member_count: { $gt: 10 },
        members: { $in: [client.user?.id || ""] },
        type: "messaging",
      };
      const filters2: ChannelFilters = {
        members: { $in: [client.user?.id || ""] },
        type: "messaging",
      };
      const options: ChannelOptions = { limit: 10, presence: true, state: true };
      const sort: ChannelSort = { last_message_at: -1, updated_at: -1 };

      const filtersArray = [filters1, filters2];
      const appliedFilterIndex = useRef(0);

      const customQueryChannels = useCallback(
        throttle(
          async ({
            currentChannels,
            queryType,
            setChannels,
            setHasNextPage,
          }: CustomQueryChannelParams) => {
            const offset = queryType === "reload" ? 0 : currentChannels.length;

            const newOptions = {
              limit: options.limit ?? DEFAULT_PAGE_SIZE,
              offset,
              ...options,
            };

            const filters = filtersArray[appliedFilterIndex.current];
            const channelQueryResponse = await client.queryChannels(
              filters,
              sort || {},
              newOptions,
            );

            const newChannels =
              queryType === "reload"
                ? channelQueryResponse
                : uniqBy([...currentChannels, ...channelQueryResponse], "cid");

            setChannels(newChannels);

            const lastPageForCurrentFilter =
              channelQueryResponse.length < newOptions.limit;
            const isLastPageForAllFilters =
              lastPageForCurrentFilter &&
              appliedFilterIndex.current === filtersArray.length - 1;

            setHasNextPage(!isLastPageForAllFilters);
            if (lastPageForCurrentFilter) {
              appliedFilterIndex.current += 1;
            }
          },
          500,
          { leading: true, trailing: false },
        ),
        [client, filtersArray],
      );

      return customQueryChannels;
    };

It is recommended to control for duplicate requests by throttling the custom function calls.

Type
---
[CustomQueryChannelsFn](https://github.com/GetStream/stream-chat-react/blob/master/src/components/ChannelList/hooks/usePaginatedChannels.ts)

Custom UI component for rendering an empty list.

Type| Default
---|---
component| [EmptyStateIndicator](https://github.com/GetStream/stream-chat-react/blob/master/src/components/EmptyStateIndicator/EmptyStateIndicator.tsx)

An object containing channel query filters, check our [query parameters docs](/chat/docs/javascript/query_channels/#query-parameters/) for more information.

Type
---
object

Custom UI component to display the container for the queried channels.

Type| Default
---|---
component| [ChannelListMessenger](https://github.com/GetStream/stream-chat-react/blob/master/src/components/ChannelList/ChannelListMessenger.tsx)

Custom UI component to display the loading error indicator.

Type| Default
---|---
component| [ChatDown](https://github.com/GetStream/stream-chat-react/blob/master/src/components/ChatDown/ChatDown.tsx)

Custom UI component to display the loading state.

Type| Default
---|---
component| [LoadingChannels](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Loading/LoadingChannels.tsx)

When true, channels wonât dynamically sort by most recent message.

Type| Default
---|---
boolean| false

Function to override the default behavior when a user is added to a channel.

Type
---
function

Function to override the default behavior when a channel is deleted.

Type
---
function

Function to override the default behavior when a channel is hidden.

Type
---
function

Function to override the default behavior when a channel is truncated.

Type
---
function

Function to override the default behavior when a channel is updated.

Type
---
function

Function to override the default channel visible behavior.

Type
---
function

Function to override the default behavior when a message is received on a channel not being watched.

Type
---
function

Function to override the default behavior when a message is received on a channel being watched. Handles `message.new` event.

Type
---
`(setChannels: React.Dispatch<React.SetStateAction<Array<Channel>>>, event: Event) => void`

Function to override the default behavior when a user gets removed from a channel.

Type
---
function

An object containing channel query options, check our [query parameters docs](/chat/docs/javascript/query_channels/#query-parameters/) for more information.

Type
---
object

Custom UI component to handle channel pagination logic.

Type| Default
---|---
component| [LoadMorePaginator](https://github.com/GetStream/stream-chat-react/blob/master/src/components/LoadMore/LoadMorePaginator.tsx)

Custom UI component to display the channel preview in the list.

Type| Default
---|---
component| [ChannelPreviewMessenger](https://github.com/GetStream/stream-chat-react/blob/master/src/components/ChannelPreview/ChannelPreviewMessenger.tsx)

Custom interval during which the recovery channel list queries will be prevented. This is to avoid firing unnecessary queries during internet connection fluctuation. Recovery channel query is triggered upon internet connection recovery and leads to complete channel list reload with pagination offset 0. The minimum throttle interval is 2000ms. The default throttle interval is 5000ms.

The channel list recovery mechanism described here (applying `recoveryThrottleIntervalMs`) **is activated only if the`StreamChat` clientâs channel list recovery mechanism is disabled**. The `StreamChat` recovery mechanism can be disabled when initiating the client instance through the `options` parameter:


    import { StreamChat } from 'stream-chat';
    import { ChannelList, Chat } from 'stream-chat-react';

    // ... get apiKey, filters, sort, options

    const client = new StreamChat(apiKey, {recoverStateOnReconnect: false});
    const App = () => (
        <Chat client={client} >
         {/** ... */}
            <ChannelList
            filters={filters}
            sort={sort}
            options={options}
            recoveryThrottleIntervalMs={3000}
            {/** other props... */}
          />
         {/** ... */}
        </Chat>
    );


Type| Default
---|---
number| 5000

Function to override the default behavior when rendering channels, so this function is called instead of rendering the Preview directly.

Type
---
function

If true, sends the listâs currently loaded channels to the `List` component as the `loadedChannels` prop.

Type| Default
---|---
boolean| false

If true, sets the most recent channel received from the query as active on component mount. If set to `false` no channel is set as active on mount.

Type| Default
---|---
boolean| true

If true, renders the [`ChannelSearch`](/chat/docs/sdk/react/components/core-components/channel_list/#channelsearch/) component above the [`List`](/chat/docs/sdk/react/components/core-components/channel_list/#list/) component.

Type| Default
---|---
boolean| false

An object containing channel query sort parameters. Check our [query parameters docs](/chat/docs/javascript/query_channels/#query-parameters/) for more information.

Type
---
object

An object containing query parameters for fetching channel watchers.

Type
---
`{ limit?: number; offset?: number }`

[PreviousComponentContext](/chat/docs/sdk/react/components/contexts/component_context/)[NextChannelListContext](/chat/docs/sdk/react/components/contexts/channel_list_context/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

The component library uses the [`i18next`](https://www.npmjs.com/package/i18next) dependency to create a `Streami18n` class constructor that handles language translation. The `TranslationContext` stores the resulting values and allows children of the `Chat` component to auto translate library text based on the connected userâs set languages. You can access the context values by calling the `useTranslationContext` custom hook.

Pull values from context with our custom hook:


    const { t } = useTranslationContext();

    <div className="message">{t("This message will be translated.")}</div>;

Function that translates text into the connected userâs set language.

Type
---
function

Function that parses date times.

Type| Default
---|---
function| Day.js

Value to set the connected userâs language (ex: âenâ, âfrâ, âruâ, etc), which auto translates text fields in the library.

Type| Default
---|---
string| âenâ

[PreviousWindow](/chat/docs/sdk/react/components/utility-components/window/)[NextWithDragAndDropUpload](/chat/docs/sdk/react/components/utility-components/with-drag-and-drop-upload/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

If you want to allow your users to upload files by dragging the selected files and dropping them onto the general chat window, youâll need to wrap your UI elements with this component. Each [`MessageInputFlat`](https://github.com/GetStream/stream-chat-react/blob/master/src/components/MessageInput/MessageInputFlat.tsx) (default UI component of the [`MessageInput`](/chat/docs/sdk/react/components/message-input-components/message_input/) component) comes wrapped with `WithDragAndDropUpload` component by default. This component works by rendering a parent element which wraps your UI elements with pre-registered event handlers for drag & drop file upload functionality.

<Channel>
      <Window>
        <WithDragAndDropUpload
          style={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            position: "relative",
          }}
        >
          <ChannelHeader />
          <MessageList />
          <AIStateIndicator />
          <MessageInput focus />
        </WithDragAndDropUpload>
      </Window>
      <WithDragAndDropUpload>
        <Thread />
      </WithDragAndDropUpload>
    </Channel>

Note that each [`MessageInput`](/chat/docs/sdk/react/components/message-input-components/message_input/) component (the second one is rendered by the [`Thread`](/chat/docs/sdk/react/components/core-components/thread/) component in this example) should be wrapped individually - if rendered under one `WithDragAndDropUpload` component, both of the inputs will receive the same event and thus will start uploading the same set of files. Also note that the topmost element (wrapper) of the `WithDragAndDropUpload` component comes out of the box with no styling - apply necessary styling (or classes) accordingly*.

*Internal UI of the `WithDragAndDropUpload` component is rendered with `absolute` positioning and expects either the topmost element (wrapper) or the element containing this component to have its position set to `relative`. If not respected, the UI can overflow which can lead to unexpected results.

Nested `WithDragAndDropUpload` components will render just the topmost element (wrapper) without any event handlers and the topmost `WithDragAndDropUpload` component will take precedence.


    // renders <div style="position: relative;">...</div> with handlers and internal UI
    <WithDragAndDropUpload style={{ position: "relative" }}>
      {/* renders <section class="w-dnd-1">...</section> without handlers */}
      <WithDragAndDropUpload component="section" className="w-dnd-1">
        <MessageInput />
      </WithDragAndDropUpload>
    </WithDragAndDropUpload>

Custom class for the topmost element (wrapper)

Type
---
string

Other option to apply styling (or CSS variables) to the topmost element (wrapper)

Type
---
`React.CSSProperties`

Element type to render instead of the default

Type| Default
---|---
`React.ElementType`| `div`

[PreviousTranslationContext](/chat/docs/sdk/react/components/contexts/translation_context/)[NextOverview](/chat/docs/sdk/react/guides/customization/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

The `VirtualizedMessageList` component renders a scrollable list of messages. It differs from the standard `MessageList` in that it handles UI virtualization by default. Virtualization is a technique used to emulate large lists of elements by rendering as few items as possible to maintain performance and decrease the load on the DOM, while preserving the user experience. These qualities make the `VirtualizedMessageList` ideal for livestream use cases, where a single channel may have thousands of currently active users.

Similar to the `MessageList`, the UI for each individual message is rendered conditionally based on its `message.type` value. The list renders date separators, message reactions, new message notifications, system messages, deleted messages, and standard messages containing text and/or attachments.

By default, the `VirtualizedMessageList` loads the most recent 25 messages held in the `channel.state`. More messages are fetched from the Stream Chat API and loaded into the DOM on scrolling up the list. The currently loaded messages are held in the `ChannelStateContext` and can be referenced with our custom hook.


    const { messages } = useChannelStateContext();

The `VirtualizedMessageList` has no required props and by default pulls overridable data from the various contexts established in the [`Channel`](/chat/docs/sdk/react/components/core-components/channel/) component. Customization of the messages rendered within the list is handled by the [Message UI](/chat/docs/sdk/react/components/message-components/message_ui/) component.

As a context consumer, the `VirtualizedMessageList` component must be rendered as a child of the `Channel` component. It can be rendered with or without a provided `messages` prop. Providing your own `messages` value will override the default value drawn from the `ChannelStateContext`.

**Example 1** \- without `messages` prop


    <Chat client={client}>
      <ChannelList />
      <Channel>
        <VirtualizedMessageList />
        <MessageInput />
      </Channel>
    </Chat>

**Example 2** \- with `messages` prop


    const customMessages = [
      // array of messages
    ];

    <Chat client={client}>
      <ChannelList />
      <Channel>
        <VirtualizedMessageList messages={customMessages} />
        <MessageInput />
      </Channel>
    </Chat>;

By default, the virtualized message list uses the latest message (which gets rendered first) in the list as the default item size. This can lead to inaccurate scroll thumb size or scroll jumps if the last item is unusually tall (for example, an attachment). To improve this behavior, set the `defaultItemHeight` property to a value close (or equal to) the height of the usual messages.


    <VirtualizedMessageList messages={customMessages} defaultItemHeight={76} />

The `VirtualizedMessageList` internally creates a mapping of message id to a style group. There are 4 style groups - `'middle' | 'top' | 'bottom' | 'single'`. Later these group style tags are incorporated into the class of the `<li/>` element that wraps the `Message` component. This allows us to style messages by their position in the message group. An example of such class is `str-chat__li str-chat__li--bottom`.

Additional props to be passed the underlying [`react-virtuoso` virtualized list dependency](https://virtuoso.dev/virtuoso-api-reference/).

Type
---
object

Custom message render function, overrides the default `messageRenderer` function defined in the component.

Type
---
( messages: RenderedMessage[], index: number ) => React.ReactElement

If set, the default item height is used for the calculation of the total list height. Use if you expect messages with a lot of height variance.

Type
---
number

If true, disables the injection of date separator UI components.

Type| Default
---|---
boolean| true

Callback function to set group styles for each message.

Type
---
(message: RenderedMessage, previousMessage: RenderedMessage, nextMessage: RenderedMessage, noGroupByUser: boolean, maxTimeBetweenGroupedMessages?: number) => GroupStyle

The limit to use when paginating messages (the page size).

After mounting, the `VirtualizedMessageList` component checks if the list is completely filled with messages. If there is some space left in the list, `VirtualizedMessageList` will load the next page of messages, but it will do so _only once_. This means that if your `messageLimit` is too low, or if your viewport is very large, the list will not be completely filled. Set the limit with this in mind.

Type| Default
---|---
number| 100

The messages to render in the list, provide your own array to override the data stored in context.

Type| Default
---|---
array| [ChannelStateContextValue[âmessagesâ]](/chat/docs/sdk/react/components/contexts/channel_state_context#messages)

Custom handler invoked when the button in the `Message` component that opens [`Thread`](/chat/docs/sdk/react/components/core-components/thread/) component is clicked. To be able to define custom logic to `openThread`, we need to have a wrapper around `VirtualizedMessageList` component and reach out to `ChannelActionContext` for the default `openThread` function.


    import { useCallback } from "react";
    import {
      VirtualizedMessageList,
      useChannelActionContext,
    } from "stream-chat-react";
    import type { LocalMessage } from "stream-chat";

    const MessageListWrapper = () => {
      const { openThread: contextOpenThread } = useChannelActionContext();

      const openThread = useCallback(
        (message: LocalMessage, event?: React.BaseSyntheticEvent) => {
          // custom logic
          contextOpenThread(message, event);
        },
        [contextOpenThread],
      );

      return <VirtualizedMessageList openThread={openThread} />;
    };

Type| Default
---|---
`(message: LocalMessage, event?: React.BaseSyntheticEvent) => void`| [ChannelActionContextValue[âopenThreadâ]](/chat/docs/sdk/react/components/contexts/channel_action_context#openthread)

The amount of extra content the list should render in addition to whatâs necessary to fill in the viewport.

Type| Default
---|---
number| 0

Keep track of read receipts for each message sent by the user. When disabled, only the last own message delivery / read status is rendered.

Type| Default
---|---
boolean| false

Allows to review changes introduced to messages array on per message basis (for example date separator injection before a message). The array returned from the function is appended to the array of messages that are later rendered into React elements in the `VirtualizedMessageList`.

The function expects a single parameter, which is an object containing the following attributes:

  * `changes` \- array of messages representing the changes applied around a given processed message
  * `context` \- configuration params and information forwarded from `processMessages`
  * `index` \- index of the processed message in the original messages array
  * `messages` \- array of messages retrieved from the back-end
  * `processedMessages` \- newly built array of messages to be later rendered

The `context` has the following parameters:

  * `userId` \- the connected user ID;
  * `enableDateSeparator` \- flag determining whether the date separators will be injected Enable date separator
  * `hideDeletedMessages` \- flag determining whether deleted messages would be filtered out during the processing
  * `hideNewMessageSeparator` \- disables date separator display for unread incoming messages
  * `lastRead`: Date when the channel has been last read. Sets the threshold after everything is considered unread

The example below demonstrates how the custom logic can decide, whether deleted messages should be rendered on a given date. In this example, the deleted messages neither the date separator would be rendered if all the messages on a given date are deleted.


    const getMsgDate = (msg) =>
      (msg &&
        msg.created_at &&
        isDate(msg.created_at) &&
        msg.created_at.toDateString()) ||
      "";

    const dateSeparatorFilter = (msg) => msg.customType !== "message.date";

    const msgIsDeleted = (msg) => msg.type === "deleted";

    const reviewProcessedMessage = ({
      changes,
      index,
      messages,
      processedMessages,
    }) => {
      const changesWithoutSeparator = changes.filter(dateSeparatorFilter);
      const dateSeparatorInjected =
        changesWithoutSeparator.length !== changes.length;
      const previousProcessedMessage =
        processedMessages[processedMessages.length - 1];
      const processedMessage = messages[index];
      const processedMessageDate = getMsgDate(processedMessage);

      if (dateSeparatorInjected) {
        if (!processedMessageDate) return changes;
        const followingMessages = messages.slice(index + 1);
        let allFollowingMessagesOnDateDeleted = false;

        for (const followingMsg of followingMessages) {
          const followingMsgDate = getMsgDate(followingMsg);
          if (followingMsgDate !== processedMessageDate) break;
          allFollowingMessagesOnDateDeleted = followingMsg.type === "deleted";
        }

        return allFollowingMessagesOnDateDeleted ? [] : changes;
      } else if (
        msgIsDeleted(processedMessage) &&
        getMsgDate(previousProcessedMessage) !== getMsgDate(processedMessage)
      ) {
        return [];
      } else {
        return changes;
      }
    };

Custom data passed to the list that determines when message placeholders should be shown during fast scrolling.

Type
---
object

If true, the list will scroll to the latest message when the window regains focus.

Type| Default
---|---
boolean| false

If true, group messages belonging to the same user, otherwise show each message individually.

Type| Default
---|---
boolean| false

If true, the Giphy preview will render as a separate component above the `MessageInput`, rather than inline with the other messages in the list.

Type| Default
---|---
boolean| false

The scroll-to behavior when new messages appear. Use `'smooth'` for regular chat channels and `'auto'` (which results in instant scroll to bottom) if you expect high throughput.

Type| Default
---|---
âsmoothâ | âauto'| 'smoothâ

If true, indicates that the current `VirtualizedMessageList` component is part of a `Thread`.

Type| Default
---|---
boolean| false

[PreviousMessageList](/chat/docs/sdk/react/components/core-components/message_list/)[NextMessageListContext](/chat/docs/sdk/react/components/contexts/message_list_context/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

The `TypingContext` is established by the `Channel` component and exposes the `useTypingContext` hook. The stored value is an object of users currently typing in a single channel, with key as the user ID and value as the user details object.

Pull the value from context with our custom hook:


    const { typing } = useTypingContext();

The users currently typing in a single channel, with key as the user ID and value as the user details object.

Type
---
object

[PreviousAttachment Selector](/chat/docs/sdk/react/components/message-input-components/attachment-selector/)[NextMessageComposer Class](/chat/docs/sdk/react/components/message-input-components/message-composer/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

An item component rendered within [`ThreadList` component](/chat/docs/sdk/react/components/core-components/thread-list/). The item is divided into two components:

`ThreadListItem` \- a component and provider which renders `ThreadListItemUi` `ThreadListItemUi` \- a component which renders the actual UI elements

The goal is that as integrator you can provide a different look to your component while preserving the behavior or you can replace the behavior while keeping the default UI or you can change both if you require so.

A thread instance provided by the [`ThreadList`](/chat/docs/sdk/react/components/core-components/thread-list/).

Type
---
Thread

[PreviousThreadList](/chat/docs/sdk/react/components/core-components/thread-list/)[NextMessageList](/chat/docs/sdk/react/components/core-components/message_list/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

The `Window` component handles width changes in the main channel to ensure a seamless user experience when opening and closing a `Thread` component.

The `Window` component must wrap the main channel components to enable smooth mount and unmount behavior. It must be rendered at the same level as the `Thread`. This ensures correct width changes in the main channel when opening and closing a `Thread`.


    <Chat client={client}>
      <Channel channel={channel}>
        <Window>
          <MessageList />
          <MessageInput />
        </Window>
        <Thread />
      </Channel>
    </Chat>

An optional prop to manually trigger the opening of a thread.

Type
---
object

[PreviousIndicators](/chat/docs/sdk/react/components/utility-components/indicators/)[NextTranslationContext](/chat/docs/sdk/react/components/contexts/translation_context/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

The `ComponentContext` is a one of the context providers exposed by the [`Channel`](/chat/docs/sdk/react/components/core-components/channel/) component and is consumable by all the children of `Channel`. This context provides UI component override options for maximum customization. All UI overrides that target children of the `Channel` component should be placed as `Channel` component props in order to be injected into the `ComponentContext`. The `ComponentContext` also exposes the hook `useComponentContext`.

Pull values from context with our custom hook:


    const { Attachment, Avatar, Message } = useComponentContext();

A component override functionality which utilises `ComponentContext` under the hood. This is direct replacement for a prop-based component overrides which are now slowly being deprecated.

In this case, top-level [`MessageInput`](/chat/docs/sdk/react/components/message-input-components/message_input/) component reaches for the closest override and applies `CustomMessageInputUi1`, the [`Thread`](/chat/docs/sdk/react/components/core-components/thread/) component uses [`MessageInput`](/chat/docs/sdk/react/components/message-input-components/message_input/) internally and which could be also overriden - in this case, the closest override is `CustomMessageInputUi2`. If we were to remove `WithComponents` wrapper rendered over the [`Thread`](/chat/docs/sdk/react/components/core-components/thread/) component, the closest override for [`Thread`](/chat/docs/sdk/react/components/core-components/thread/)âs [`MessageInput`](/chat/docs/sdk/react/components/message-input-components/message_input/) component would be `CustomMessageInputUi1`. No `WithComponents` wrapper means that both components use their defaults defined internally.


    const CustomMessageInputUi1 = () => {
      /*...*/
    };
    const CustomMessageInputUi2 = () => {
      /*...*/
    };

    <Channel>
      <WithComponents overrides={{ Input: CustomMessageInputUi1 }}>
        <Window>
          <MessageList />
          <MessageInput focus />
        </Window>
        <WithComponents overrides={{ Input: CustomMessageInputUi2 }}>
          <Thread />
        </WithComponents>
      </WithComponents>
    </Channel>;

Or you can use it like this where [`MessageInput`](/chat/docs/sdk/react/components/message-input-components/message_input/) rendered within [`Window`](/chat/docs/sdk/react/components/utility-components/window/) will use `CustomMessageInputUi2` override, [`ThreadList`](/chat/docs/sdk/react/components/core-components/thread-list/) rendered within [`ChatView.Threads`](/chat/docs/sdk/react/components/utility-components/chat-view/) will use `CustomThreadListItem` override and both [`Thread`](/chat/docs/sdk/react/components/core-components/thread/) components will use `CustomMessageInputUi1` override for their internal [`MessageInput`](/chat/docs/sdk/react/components/message-input-components/message_input/) components.


    const CustomThreadListItem = () => {
      /*...*/
    };

    <Chat>
      <WithComponents
        overrides={{
          ThreadListItem: CustomThreadListItem,
          Input: CustomMessageInputUi1,
        }}
      >
        <ChatView>
          <ChatView.Selector />
          <ChatView.Channels>
            <ChannelList />
            <Channel>
              <WithComponents
                overrides={{
                  Input: CustomMessageInputUi2,
                }}
              >
                <Window>
                  {/*...*/}
                  <MessageInput focus />
                </Window>
              </WithComponents>
              <Thread />
            </Channel>
          </ChatView.Channels>
          <ChatView.Threads>
            <ThreadList />
            <ChatView.ThreadAdapter>
              <Thread />
            </ChatView.ThreadAdapter>
          </ChatView.Threads>
        </ChatView>
      </WithComponents>
    </Chat>;

Custom UI component to display attachment in an individual message.

Type| Default
---|---
component| [Attachment](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Attachment/Attachment.tsx)

Custom UI component to display a attachment previews in `MessageInput`.

Type| Default
---|---
component| [AttachmentPreviewList](https://github.com/GetStream/stream-chat-react/blob/master/src/components/MessageInput/AttachmentPreviewList.tsx)

Custom UI component to display image resp. a fallback in case of load error, in `<img/>` element. The default resp. custom (from `ComponentContext`) `BaseImage` component is rendered by:

  * [Image](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Gallery/Image.tsx) \- single image attachment in message list
  * [Gallery](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Gallery/Gallery.tsx) \- group of image attachments in message list
  * [AttachmentPreviewList](https://github.com/GetStream/stream-chat-react/blob/master/src/components/MessageInput/AttachmentPreviewList.tsx) \- image uploads preview in message input (composer)

The `BaseImage` component accepts the same props as `<img/>` element.

The [default `BaseImage` component](/chat/docs/sdk/react/components/utility-components/base-image/) tries to load and display an image and if the load fails, then an SVG image fallback is applied to the `<img/>` element as a CSS mask targeting attached `str-chat__base-image--load-failed` class.

Type| Default
---|---
component| [BaseImage](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Gallery/BaseImage.tsx)

Custom UI component to render set of buttons to be displayed in the [MessageActionsBox](https://github.com/GetStream/stream-chat-react/blob/master/src/components/MessageActions/MessageActionsBox.tsx).

Type| Default
---|---
component| [CustomMessageActionsList](https://github.com/GetStream/stream-chat-react/blob/master/src/components/MessageActions/CustomMessageActionsList.tsx)

Custom UI component for emoji button in input.

Type| Default
---|---
component| [EmojiIconSmall](https://github.com/GetStream/stream-chat-react/blob/master/src/components/MessageInput/icons.tsx)

Custom UI component to be displayed when the `MessageList` is empty.

Type| Default
---|---
component| [EmptyStateIndicator](https://github.com/GetStream/stream-chat-react/blob/master/src/components/EmptyStateIndicator/EmptyStateIndicator.tsx)

Custom UI component for file upload icon. The component is now deprecated. Use `AttachmentSelectorInitiationButtonContents` instead.

Type| Default
---|---
component| [FileUploadIcon](https://github.com/GetStream/stream-chat-react/blob/master/src/components/MessageInput/icons.tsx)

Custom component to render link previews in `MessageInput`.

Type| Default
---|---
component| [MessageInputFlat](https://github.com/GetStream/stream-chat-react/blob/master/src/components/MessageInput/LinkPreviewList.tsx)

Custom UI component to display a message in the `VirtualizedMessageList`.

Type| Default
---|---
component| [MessageSimple](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Message/MessageSimple.tsx)

[PreviousChannelStateContext](/chat/docs/sdk/react/components/contexts/channel_state_context/)[NextChannelList](/chat/docs/sdk/react/components/core-components/channel_list/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

Our SDK provides 2 new hooks that can be used as utilities to allow us to more easily create customizations of components.

This hook returns the current AI State for a given `channel`.

const isMessageAIGenerated = (message) => !!message.ai_generated;

    const MyAIStateIndicator = () => {
      const { aiState } = useAIState();
      return aiState === AIStates.Thinking ? (
        <div>
          <p>The chat-bot is currently thinking...</p>
        </div>
      ) : null;
    };

    const App = () => (
      <Chat client={client} isMessageAIGenerated={isMessageAIGenerated}>
        <Channel channel={channel}>
          <MessageList />
          <AIStateIndicator />
          <MessageInput />
        </Channel>
      </Chat>
    );

In the example above, we create a custom `AIStateIndicator`, which is only triggered while the AI is in a `AI_STATE_THINKING` state.

A hook that returns text in a streamed, typewriter fashion. The speed of streaming is configurable through the `streamingLetterIntervalMs` and `renderingLetterCount` properties.

const isMessageAIGenerated = (message) => !!message.ai_generated;

    const MyStreamedMessageText = ({ message: messageFromProps, renderText }) => {
      const { message: messageFromContext } = useMessageContext(
        'StreamedMessageText',
      );
      const { text = '' } = messageFromProps || messageFromContext
      const { streamedMessageText } = useMessageTextStreaming({
        renderingLetterCount: 1,
        streamingLetterIntervalMs: 10,
        text,
      });

      return (
        <MessageText message={{ ...message, text: streamedMessageText }} renderText={renderText} />
      );
    }

    const App = () => (
      <Chat client={client} isMessageAIGenerated={isMessageAIGenerated}>
        <Channel channel={channel} StreamedMessageText={MyStreamedMessageText}>
          <MessageList />
          <MessageInput />
        </Channel>
      </Chat>
    );

The example above overrides the default `StreamedMessageText` component and utilizes the `useMessageTextStreaming` hook to make the typewriter animation of the text much faster.

[PreviousUI Components](/chat/docs/sdk/react/components/ai/ui-components/)[NextChatView](/chat/docs/sdk/react/components/utility-components/chat-view/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

Messages can contain polls. Polls are by default created using `PollCreationDialog` that is invoked from [`AttachmentSelector`](/chat/docs/sdk/react/components/message-input-components/attachment-selector/). Messages that render polls are not editable. Polls can be only closed by the poll creator. The top-level component to render the message poll data is `Poll` and it renders a header followed by option list and poll actions section.

![](/_astro/message-with-poll.gLRC9Smt_ZlBzE0.webp)

The following part of the poll UI can be customized:

  * `QuotedPoll` \- UI rendered if the poll is rendered in a quoted message
  * `PollContent` \- component that renders the whole non-quoted poll UI
  * `PollHeader` \- customizes the topmost part of the poll UI
  * `PollOptionSelector` \- customizes the individual clickable option selectors
  * `PollActions` \- customizes the bottom part of the poll UI that consists of buttons that invoke action dialogs

import { ReactNode } from "react";
    import { Channel } from "stream-chat-react";

    const PollHeader = () => <div>Custom Header</div>;

    const ChannelWrapper = ({ children }: { children: ReactNode }) => (
      <Channel PollHeader={PollHeader}>{children}</Channel>
    );

If we wanted to customize only the option selector we can do it with custom `PollOptionSelector` component.


    import { ReactNode } from "react";
    import { Channel } from "stream-chat-react";

    const PollOptionSelector = () => <div>Custom Option Selector</div>;

    const ChannelWrapper = ({ children }: { children: ReactNode }) => (
      <Channel PollOptionSelector={PollOptionSelector}>{children}</Channel>
    );

The component `PollActions` controls the display of dialogs or modals that allow user to further interact with the poll data. There are the following poll actions supported by the component that invoke corresponding dialogs resp. modals:

Action button| Visible condition| Invokes
---|---|---
See all options| option count > 10| `PollOptionsFullList`
Suggest an option| poll is not closed and `poll.allow_user_suggested_options === true`| `SuggestPollOptionForm`
Add or update own comment| poll is not closed and `poll.allow_answers === true`| `AddCommentForm`
View comments| `channel.own_capabilities` array contains `'query-poll-votes'` & `poll.answers_count > 0`| `PollAnswerList`
View results| always visible| `PollResults`
End vote| owner of the poll| `EndPollDialog`

**Default PollOptionsFullList**

![](/_astro/poll-option-full-list.Dz1ZbUIQ_H3hcN.webp)

**Default SuggestPollOptionForm**

![](/_astro/suggest-poll-option-form.C1qJTDq-_fb0u6.webp)

**Default AddCommentForm**

![](/_astro/add-poll-comment-form.BUnklzFJ_Z1dn2cX.webp)

**Default PollAnswerList**

![](/_astro/poll-comment-list.CJjHPxEz_2j3tFq.webp)

**Default PollResults**

![](/_astro/poll-results.bg3VN95F_Z2dBibt.webp)

**Default EndPollDialog**

![](/_astro/end-poll-dialog.cn6e2Teo_Z27SYGB.webp)

Individual dialogs and thus the whole `PollActions` component can be overridden via `PollActions` component props as follows:


    import { ReactNode } from "react";
    import { Channel, PollActions } from "stream-chat-react";
    import {
      CustomAddCommentForm,
      CustomEndPollDialog,
      CustomPollAnswerList,
      CustomPollOptionsFullList,
      CustomPollResults,
      CustomSuggestPollOptionForm,
    } from "./PollActions";

    const CustomPollActions = () => (
      <PollActions
        AddCommentForm={CustomAddCommentForm}
        EndPollDialog={CustomEndPollDialog}
        PollAnswerList={CustomPollAnswerList}
        PollOptionsFullList={CustomPollOptionsFullList}
        PollResults={CustomPollResults}
        SuggestPollOptionForm={CustomSuggestPollOptionForm}
      />
    );

    const ChannelWrapper = ({ children }: { children: ReactNode }) => (
      <Channel PollActions={CustomPollActions}>{children}</Channel>
    );

This approach is useful when we want to change the organization of the poll UI. For the purpose we can provide custom `PollContent` component to `Channel`.


    import { ReactNode } from "react";
    import { Channel } from "stream-chat-react";
    import { CustomPollHeader, CustomPollOptionList } from "./Poll";

    const PollContents = () => (
      <div>
        <CustomPollHeader />
        <CustomPollOptionList />
      </div>
    );

    const ChannelWrapper = ({ children }: { children: ReactNode }) => (
      <Channel PollContents={PollContents}>{children}</Channel>
    );

In order to be fully capable to customize the poll UI, we need to learn how to utilize Poll API and later access the reactive poll state.

First of all, the Poll API is exposed via a `Poll` instance. This instance is provided via React context to all the children of the `Poll` component that is rendered internally by `Message` component. The context can be consumed using `usePollContext` hook:


    import { usePollContext } from "stream-chat-react";

    const Component = () => {
      const { poll } = usePollContext();
    };

The `Poll` instance exposes the following methods:

  * `query` \- queries the data for a given poll (permission to query polls is required)
  * `update` \- overwrites the poll data
  * `partialUpdate` \- overwrites only the given poll data
  * `close` \- marks the poll as closed (useful for custom `EndPollDialog`)
  * `delete` \- deletes the poll
  * `createOption` \- creates a new option for given poll (useful for custom `SuggestPollOptionForm`)
  * `updateOption` \- updates an option
  * `deleteOption` \- removes the option from a poll
  * `castVote` \- casts a vote to a given option (useful for custom `PollOptionSelector`)
  * `removeVote` \- removes a vote from a given option (useful for custom `PollOptionSelector`)
  * `addAnswer` \- adds an answer (comment)
  * `removeAnswer` \- removes an answer (comment)
  * `queryAnswers` \- queries and paginates answers (useful for custom `PollAnswerList`)
  * `queryOptionVotes` \- queries and paginates votes for a given option (useful for option detail)

The poll state can be accessed inside the custom React components using the following pattern


    import { usePollContext, useStateStore } from "stream-chat-react";

    import type { PollState, PollVote } from "stream-chat";

    type PollStateSelectorReturnValue = {
      latest_votes_by_option: Record<string, PollVote[]>;
    };

    // 1. Define the selector function that receives the fresh value every time the observed property changes
    const pollStateSelector = (
      nextValue: PollState,
    ): PollStateSelectorReturnValue => ({
      latest_votes_by_option: nextValue.latest_votes_by_option,
    });

    const CustomComponent = () => {
      // 2. Retrieve the poll instance from the context
      const { poll } = usePollContext();
      // 3. Use the useStateStore hook to subscribe to updates in the poll state with selector picking out only properties we are interested in
      const { latest_votes_by_option } = useStateStore(
        poll.state,
        pollStateSelector,
      );
    };

Do not try to access the `poll` data via `message` object available from `MessageContext`. This data is not updated and serve only as a seed, for the `poll` state.

The context is available to all the children of the `Poll` component. Currently, it exposes the following properties:

The instance of a `Poll` class provided by the low-level client. The instance is retrieved from `PollManager` via `client.polls.fromState(pollId)`


    import { Poll, useChatContext, useMessageContext } from "stream-chat-react";

    const Component = () => {
      const { client } = useChatContext();
      const { message } = useMessageContext();
      const poll = message.poll_id && client.polls.fromState(message.poll_id);

      if (!poll) return null;
      return <Poll poll={poll} />;
    };

This extraction is done internally by the `MessageSimple` component.

[PreviousBaseImage](/chat/docs/sdk/react/components/utility-components/base-image/)[NextAttachments](/chat/docs/sdk/react/components/message-components/attachment/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

The `MessageBounceContext` is available inside the modal rendered by the default message component for messages that got bounced by the moderation rules. This context provides callbacks that can be used to deal with the bounced message.

In most cases when using the default Message UI component implementation you are not going to deal with the `MessageBounceContext` directly. However if you are customizing the Message UI component, or providing a custom `MessageBouncePrompt`, the callbacks provided by this context come in handy.

Get values from context with our custom hook:


    const { message, handleEdit, handleSend, handleDelete } =
      useMessageBounceContext();

Use these callbacks to implement your custom `MessageBouncePrompt`. Normally this component displays three options: edit the message before sending it again, send the message again without changes (this can be useful if you are using the âBounce then flagâ moderation flow), and delete the message.


    import { useMessageBounceContext } from "stream-chat-react";

    function MyCustomMessageBouncePrompt({ onClose }) {
      const { message, handleEdit, handleSend, handleDelete } =
        useMessageBounceContext();
      return (
        <>
          <p>Your message is in violation of our community rules.</p>
          <p>Message id: "{message.id}"</p>
          <button
            type="button"
            onClick={() => {
              handleEdit();
              onClose();
            }}
          >
            Edit message
          </button>
          {/* ... */}
        </>
      );
    }

Then override the default `MessageBouncePrompt` component with your custom one:


    <Channel MessageBouncePrompt={MyCustomMessageBouncePrompt}>
      <Window>
        <ChannelHeader />
        <MessageList />
        <MessageInput />
      </Window>
      <Thread />
    </Channel>

When implementing your own Message component from scratch, you should consider implementing UI for bounced messages, especially if you are using one of the moderation flows with message bouncing (âBounceâ, âBounce then flagâ, or âBounce then blockâ).

To do that, first check if the message is bounced:


    import { useMessageContext, isMessageBounced } from "stream-chat-react";

    function CustomMessage() {
      const { message } = useMessageContext();
      const isBounced = isMessageBounced(message);
      // ...
    }

Then, display custom UI in case the message is bounced. Donât forget to wrap the UI with the `MessageBounceProvider`, so that it has access to the callbacks used to deal with the bounced message:


    import {
      useMessageContext,
      isMessageBounced,
      MessageBounceProvider,
    } from "stream-chat-react";

    function MyCustomMessage() {
      const { message } = useMessageContext();
      const isBounced = isMessageBounced(message);

      return (
        <div className="message-wrapper">
          {/* ... */}
          <MessageText />
          <MessageStatus />
          {isBounced && (
            <MessageBounceProvider>
              <MyCustomMessageBouncePrompt />
            </MessageBounceProvider>
          )}
        </div>
      );
    }

    function MyCustomMessageBouncePrompt({ onClose }) {
      const { message, handleEdit, handleSend, handleDelete } =
        useMessageBounceContext();
      return (
        <>
          <button
            type="button"
            onClick={(e) => {
              handleEdit(e);
              onClose(e);
            }}
          >
            Edit message
          </button>
          {/* ... */}
        </>
      );
    }

It only makes sense to render `MessageBounceProvider` in the context of a bounced message, so youâll see a warning in the browser console if you try to render it for any other type of message.

Implementing a custom Message UI component from scratch is a larger topic, covered by the [Message UI Customization](/chat/docs/sdk/react/guides/theming/message_ui/) guide.

The object representing the message that got bounced.

Type
---
LocalMessage

Call this function to switch the bounced message into editing mode.

Type
---
ReactEventHandler

Call this function to try sending the bounced message again without changes.

Type
---
ReactEventHandler

Call this function to remove the bounced message from the message list.

Type
---
ReactEventHandler

[PreviousMessageContext](/chat/docs/sdk/react/components/contexts/message_context/)[NextMessage Hooks](/chat/docs/sdk/react/hooks/message_hooks/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

The `Chat` component is a React Context provider that wraps the entire Stream Chat application. It provides the [`ChatContext`](/chat/docs/sdk/react/components/contexts/chat_context/) to its children, which includes the `StreamChat` client instance. All other components within the library must be nested as children of `Chat` to maintain proper functionality.

The `Chat` component does not inject any UI, so its implementation is fairly simple. Once an instance of the `StreamChat` client has been created, you pass the client object as a prop to add it to the `ChatContext`.


    <Chat client={client}>
      <Channel channel={channel}>
        <MessageList />
        <MessageInput />
      </Channel>
    </Chat>

Any child of the `Chat` component has access to the `ChatContext`. Each React Context in the component library can be accessed with one of our custom hooks, which must be imported individually. The `ChatContext` values are accessed with `useChatContext` hook.


    const { client } = useChatContext();

The `StreamChat` client instance. Any methods from the `stream-chat-js` API interface can be run off this object.


    const channel = client.channel("messaging", {
      members: ["nate", "roy"],
    });

Type
---
object

Object containing custom CSS classnames to override the libraryâs default container CSS. Many of the high level React components in the library come with predefined CSS container classes that inject basic display styling. To remove or replace these wrapper classes entirely, the `Chat` component takes a `customClasses` prop. This prop accepts a mapping of overridable container classnames.

In the below example we will replace two of the default container classes, `str-chat` (maps to the `chat` key) and `str-chat-channel` (maps to the `channel`) key. Once replaced, add whatever styles you want in your own stylesheets.


    const customClasses: CustomClasses = {
      chat: "custom-chat-class",
      channel: "custom-channel-class",
    };

    const App = () => (
      <Chat client={client} customClasses={customClasses}>
        <ChannelList />
        <Channel>
          <Window>
            <ChannelHeader />
            <MessageList />
            <MessageInput />
          </Window>
          <Thread />
        </Channel>
      </Chat>
    );

The accepted object keys and the default classnames they override are as follows:

  * chat - `str-chat`
  * chatContainer - `str-chat__container`
  * channel - `str-chat-channel`
  * channelList - `str-chat-channel-list`
  * message - `str-chat__li str-chat__li--${groupStyles}`
  * messageList - `str-chat__list`
  * thread - `str-chat__thread`
  * threadList - `str-chat__list--thread`
  * virtualMessage - `str-chat__virtual-list-message-wrapper`
  * virtualizedMessageList - `str-chat__virtual-list`

Be careful overriding the default styles on the `VirtualizedMessageList` component, as our defaults handle much of the logic that makes the list UI perform optimally.

Type
---
object

Sets the default fallback language for UI component translation, defaults to âenâ for English.

Type| Default
---|---
string| âenâ

The `Streami18n` translation instance. Create an instance of this class when you wish to change the connected userâs default language or override default text in the library.


    const i18nInstance = new Streami18n({
      language: "es",
      translationsForLanguage: {
        "Nothing yet...": "Nada",
      },
    });

    <Chat client={client} i18nInstance={i18nInstance}>
      {/* children of Chat component */}
    </Chat>;

Type
---
object

The prop controls setting of the class `str-chat-channel-list--open` on the `ChannelList` root `div`. It is up to the integrator to decide, what styles should be assigned to this class to control the app layout. An example could be as follows:


    @media screen and (min-width: 768px) {
      .str-chat-channel-list--open {
        width: 100%;
      }

      .str-chat-channel-list {
        position: fixed;
        z-index: 1;
        width: 0;
      }
    }

Here, the list will take the whole width of the screen on small devices once the class `str-chat-channel-list--open` is assigned to the root div. Otherwise, the list is not visible as it has zero width.

Type| Default
---|---
boolean| true

Used for injecting className/s to the `Channel` and `ChannelList` components.

Type
---
string

Windows 10 does not support country flag emojis out of the box. It chooses to render these emojis as characters instead. Stream Chat can override this behavior by loading a custom web font that will render images instead (PNGs or SVGs depending on the platform). Set this prop to true if you want to use these custom emojis for Windows users.

If youâre moving from older versions to `11.0.0` then make sure to import related stylesheet from `stream-chat-react/css/emoji-replacement.css` as it has been removed from our main stylesheet to reduce final bundle size for integrators who do not wish to use this feature.

Type| Default
---|---
boolean| false

A callback function responsible for determining whether a `message` was AI generated. Default function implementation just returns boolean value `false`.

Type| Default
---|---
(message: LocalMessage) => boolean| () => false

[PreviousGlobal variables](/chat/docs/sdk/react/theming/global-variables/)[NextChatContext](/chat/docs/sdk/react/components/contexts/chat_context/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

The `StreamedMessageText` component comes already integrated within the SDK. It is rendered instead of the `MessageText` component if the [`isMessageAIGenerated` function](/chat/docs/sdk/react/components/core-components/chat/#ismessageaigenerated) recognizes provided message object as AI generated.

It will display the message using a typewriter animation (similar to how ChatGPT does it) and it will automatically manage the rendering of the UI for you.

The component is overridable through the `StreamedMessageText` prop on the `Channel` component.

const isMessageAIGenerated = (message) => !!message.ai_generated;

    const App = ({ children }) => (
      <Chat client={client} isMessageAIGenerated={isMessageAIGenerated}>
        {children}
      </Chat>
    );

The above example will make sure that all the messages with a custom field `ai_generated` equal to `true` will be rendered with `StreamedMessageText`.

The component is not rendered by any other SDK component and thus needs to be imported and rendered by the integrators as a direct or indirect child of the `Channel` component. It is responsible for adding an indicator of the current AI state, and it will display if it is one of the following:

  * `AI_STATE_GENERATING`
  * `AI_STATE_THINKING`

const isMessageAIGenerated = (message) => !!message.ai_generated;

    const App = () => (
      <Chat client={client} isMessageAIGenerated={isMessageAIGenerated}>
        <Channel channel={channel}>
          <MessageList />
          <AIStateIndicator />
          <MessageInput />
        </Channel>
      </Chat>
    );

The above example will make the indicator show right above the `MessageInput` component when the AI state matches one of the stated above.

![AI Indicator Example](/_astro/ai-indicator-example.Cz4sWVrx_Z1oXBVy.webp)

The purpose of the component is to allow a user to stop the AI response generation prematurely. It is rendered instead of `SendMessage` button if the AI state is one of the following:

  * `AI_STATE_GENERATING`
  * `AI_STATE_THINKING`

The component is overridable through the `StopAIGenerationButton` prop on the `Channel` component.

If you want to prevent rendering of the component altogether you can set the `StopAIGenerationButton` to `null`.

[PreviousOverview](/chat/docs/sdk/react/components/ai/overview/)[NextHooks](/chat/docs/sdk/react/components/ai/hooks/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

The `MessageInput` component is a React Context provider that wraps all the logic, functionality, and UI for the message input displayed in a channel. It provides the [`MessageInputContext`](/chat/docs/sdk/react/components/contexts/message_input_context/) to its children. All of the input UI components consume the `MessageInputContext` and rely on the stored data for their display and interaction.

As a context consumer, the `MessageInput` component must be rendered as a child of the `Channel` component. `MessageInput` has no required props and calls custom hooks to assemble the context values loaded into the `MessageInputContext` and provided to its children.

If a custom input is not provided via the `Input` prop, [`MessageInputFlat`](https://github.com/GetStream/stream-chat-react/blob/master/src/components/MessageInput/MessageInputFlat.tsx) will be used by default.


    <Chat client={client}>
      <ChannelList />
      <Channel>
        <MessageList />
        <MessageInput />
      </Channel>
    </Chat>

The `MessageInput` component does not inject any UI, so all input customization is handled by the [Input UI](/chat/docs/sdk/react/components/message-input-components/input_ui/) component. The Input UI component is passed as the `Input` prop into either the `Channel` or `MessageInput` component.

Allows to hide MessageInputâs send button. Used by `MessageSimple` to hide the send button in `EditMessageForm`.

Type| Default
---|---
boolean| false

Function to override the default submit handler. This function is not intended for message composition purposes. In those cases, define custom composition middleware for message and draft composition (guide here)[/chat/docs/sdk/react/components/message-input-components/message-composer-middleware#message-composer-middleware-overview].


    type overrideSubmitHandler = (params: {
      cid: string; // target channel CID
      localMessage: LocalMessage; // object representing the local message data used for UI update
      message: Message; // object representing the payload sent to the server for message creation / update
      sendOptions: SendMessageOptions;
    }) => Promise<void> | void;


    import { MessageInput } from "stream-chat-react";
    import type { MessageInputProps } from "stream-chat-react";

    const CustomMessageInput = (props: MessageInputProps) => {
      const submitHandler: MessageInputProps["overrideSubmitHandler"] = useCallback(
        async (params: {
          cid: string;
          localMessage: LocalMessage;
          message: Message;
          sendOptions: SendMessageOptions;
        }) => {
          // custom logic goes here

          await sendMessage({ localMessage, message, options: sendOptions });
        },
        [sendMessage],
      );

      return (
        <StreamMessageInput {...props} overrideSubmitHandler={submitHandler} />
      );
    };

Property **keycodeSubmitKeys** has been replaced by **shouldSubmit** and thus is no longer supported. If you had custom key codes specified like so:


    keyCodeSubmitKeys={[[16,13], [57], [48]]} // submission keys are Shift+Enter, 9, and 0

then that would newly translate to:


    const shouldSubmit = (event) =>
      (event.key === 'Enter' && event.shiftKey) || event.key === '9' || event.key === '0';

    ...

    shouldSubmit={shouldSubmit}

[PreviousDateSeparator](/chat/docs/sdk/react/components/utility-components/date_separator/)[NextMessageInputContext](/chat/docs/sdk/react/components/contexts/message_input_context/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

Audio attachments recorded directly from the chat UI are called voice recordings. The SDK provides a default implementation called [VoiceRecording](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Attachment/VoiceRecording.tsx). The default component renders or [VoiceRecordingPlayer component](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Attachment/VoiceRecording.tsx) or [QuotedVoiceRecording](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Attachment/VoiceRecording.tsx).

The `VoiceRecordingPlayer` component is displayed in the message attachment list and is used to reproduce the audio.

![Image of the VoiceRecordingPlayer component](/_astro/voice-recording-player.Cu9Meg6m_BJl8u.webp)

Whereas `QuotedVoiceRecording` is used to display basic information about the voice recording in quoted message reply.

![Image of the QuotedVoiceRecording component](/_astro/voice-recording-quoted.oAi_hBd__2h33an.webp)

The response payload for the voice recording attachment comes with the following properties:

![Image of the voice recording payload](/_astro/voice-recording-response-payload.DA01IEW9_2s1gTb.webp)

These properties serve the following purpose:

Property| Description
---|---
**asset_url**|  the URL where the voice recording is downloaded from
**duration**|  the audio duration in seconds
**file_size**|  the file size in bytes (displayed as fallback to duration if duration is not available)
**mime_type**|  the file type that is later reflected in the icon displayed in the voice recording attachment widget
**title**|  the audio title
**type**|  the value will always be `"voiceRecording"`
**waveform_data**|  the array of fractional number values between 0 and 1. These values represent the amplitudes later reflected in the [WaveProgressBar](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Attachment/components/WaveProgressBar.tsx)

By clicking in the space of waveform or by dragging the progress indicator a user can navigate to a specific place in the audio track. The progress indicator is placed at the point of the click or drag end and the preceding amplitude bars are highlighted to manifest the progress.

![Image of the VoiceRecordingPlayer stopped in the middle of the reproduction](/_astro/voice-recording-player-stopped-repro.DhtbCm0P_Z1hPDRI.webp)

The playback speed can be changed by clicking the [PlaybackRateButton](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Attachment/components/PlaybackRateButton.tsx). The button is visible only during the audio reproduction. The rate is changed by repeatedly clicking the [PlaybackRateButton](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Attachment/components/PlaybackRateButton.tsx). Once the highest rate speed is achieved, the next click resets the speed to the initial value.

![Image of the VoiceRecordingPlayer playing the audio](/_astro/voice-recording-player-in-progress.BtUgFs_3_ZN4J5c.webp)

If the duration is not available in the [attachment object payload](/chat/docs/sdk/react/components/message-components/attachment/voice-recording/#attachment-payload/), `VoiceRecordingPlayer` as well as `QuotedVoiceRecording` component will display the attachment size instead.

![Image of the VoiceRecordingPlayer displaying file size instead of audio duration](/_astro/voice-recording-player-file-size-fallback.DO5INoMU_Z1GvaIq.webp)

![Image of the QuotedVoiceRecording displaying file size instead of audio duration](/_astro/voice-recording-quoted-file-size-fallback.Cp5fJjYx_Z1F4J90.webp)

If the voice recording does not come with title, a fallback title is provided.

![Image of the VoiceRecordingPlayer displaying the fallback title](/_astro/voice-recording-fallback-title.DkriDVIf_Z9RKYv.webp)

![Image of the QuotedVoiceRecording displaying the fallback title](/_astro/voice-recording-quoted-fallback-title.oGHBAn3H_EewcX.webp)

If the `waveform_data` is an empty array, then no progress bar is rendered.

![Image of the VoiceRecordingPlayer missing progress bar](/_astro/voice-recording-empty-waveform-data.XObM6-zF_TUSpk.webp)

The pattern of customization applied to the default `VoiceRecording` component will be the same:

  1. Create a custom voice recording component (e.g. `CustomVoiceRecording`). It will serve as a wrapper component that renders `VoiceRecordingPlayer` resp. `QuotedVoiceRecording`. Pass props to these components.

  2. Create a custom attachment component (e.g. `CustomAttachment`), that will be again a wrapper around the SDKâs `Attachment` component. Pass the custom voice recording component to the `Attachment` component via prop `VoiceRecording`.

You can override the default list of playback rates by overriding the [VoiceRecording](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Attachment/VoiceRecording.tsx) component.

Example:


    import {
      Attachment,
      AttachmentProps,
      VoiceRecordingPlayer,
      VoiceRecordingProps,
      Channel,
      QuotedVoiceRecording,
    } from 'stream-chat-react';

    import { ChannelInner } from './ChannelInner';

    const CustomVoiceRecording = ({ attachment, isQuoted }: VoiceRecordingProps) =>
      isQuoted ? (
        <QuotedVoiceRecording attachment={attachment} />
      ) : (
        <VoiceRecordingPlayer attachment={attachment} playbackRates={[2.0, 3.0]} />
      );

    const CustomAttachment = (props: AttachmentProps) => (
      <Attachment {...props} VoiceRecording={CustomVoiceRecording} />
    );

    const App = () => (
      <Channel Attachment={CustomAttachment}>
        <ChannelInner />
      </Channel>
    );

    export default App;

This could be solved by customizing the styles. You can stop displaying the recording title by tweaking the CSS:


    .str-chat__message-attachment__voice-recording-widget__title {
      display: none;
    }

If you do not like our fallback title, you can change it by changing the translation key `"Voice message"`.

If you would like to perform the following customizations:

  * change the progress bar
  * change the file icon SVG

We recommend you to assemble your own components, that serve to display voice recording data and allow for reproduction. Then you can pass those components to the custom attachment component as described above.

The reason is, that `VoiceRecordingPlayer` and `QuotedVoiceRecording` are considerably small components. The inspiration can be taken from the default components implementations.

[PreviousAttachments](/chat/docs/sdk/react/components/message-components/attachment/)[NextReactions](/chat/docs/sdk/react/components/message-components/reactions/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

The following sections will be dedicated to the description of the API that `MessageComposer` and its sub-managers expose and how it can be used.

The `MessageComposer` class provides a comprehensive API for managing message composition, including text, attachments, polls, and custom data. It is a coordinator that manages and orchestrates various specialized submanagers, each responsible for a specific aspect of message composition.

MessageComposer follows a coordinator pattern where it delegates specific responsibilities to specialized submanagers:


    graph TD
        MC[MessageComposer] --> TC[TextComposer]
        MC --> PC[PollComposer]
        MC --> AM[AttachmentManager]
        MC --> LPM[LinkPreviewsManager]
        MC --> CDM[CustomDataManager]

1. **TextComposer**

     * Handles text input and editing
     * Manages text state and validation
     * Processes text-related events
  2. **PollComposer**

     * Manages poll creation and editing
     * Handles poll state and validation
  3. **AttachmentManager**

     * Manages attachments other than link previews
     * Handles uploads and downloads
  4. **LinkPreviewsManager**

     * Manages link previews
     * Handles URL detection and preview generation
  5. **CustomDataManager**

     * Manages custom message data
     * Manages custom composer data (bucket to store any temporary data that will not be submitted with the message)

MessageComposer can operate in different composition scenarios, each with specific initialization and behavior:

When editing an existing message, MessageComposer initializes with the messageâs current state:


    const composer = new MessageComposer({
      composition: existingMessage, // LocalMessage
      compositionContext: channel,
      client,
    });

Key characteristics:

  * Initializes with messageâs current state (text, attachments, etc.)
  * Tracks editing timestamps via `editingAuditState`
  * Prevents draft creation (drafts are disabled)
  * Maintains original message ID
  * Updates are applied to the existing message

Drafts can be enabled via the `MessageComposer` configuration:


    const composer = new MessageComposer({
      composition: draftResponse, // DraftResponse
      compositionContext: channel,
      client,
      config: { drafts: { enabled: true } },
    });

    composer.updateConfig({ drafts: { enabled: false } });

The composer exposes the draft management API:


    await composer.createDraft();

    await composer.deleteDraft();

No parameters are needed as the composer extracts all the necessary data from its state nad draft composition middleware.

The composer takes care of local state updates based on `draft.updated` and `draft.deleted` events automatically.

When creating a new message, MessageComposer starts with an empty state:


    const composer = new MessageComposer({
      compositionContext: channel,
      client,
    });

Key characteristics:

  * Starts with empty state
  * Generates new message ID
  * No draft tracking by default
  * Clean slate for all submanagers

constructor({
      composition,
      config,
      compositionContext,
      client,
    }: MessageComposerOptions)

Where `MessageComposerOptions` is:


    type MessageComposerOptions = {
      client: StreamChat;
      compositionContext: CompositionContext; // Channel | Thread | LocalMessageWithLegacyThreadId
      composition?: DraftResponse | MessageResponse | LocalMessage;
      config?: DeepPartial<MessageComposerConfig>;
    };

// Initialize or reset composer state
    initState({ composition }: { composition?: DraftResponse | MessageResponse | LocalMessage } = {}): void

    // Clear all composer state
    clear(): void

    // Restore state from edited message or clear
    restore(): void

    // Update composer configuration
    updateConfig(config: DeepPartial<MessageComposerConfig>): void

    // Set quoted message
    setQuotedMessage(quotedMessage: LocalMessage | null): void

// Compose a message
    compose(): Promise<MessageComposerMiddlewareValue['state'] | undefined>

    // Compose a draft message
    composeDraft(): Promise<MessageComposerMiddlewareValue['state'] | undefined>

    // Create a draft message
    createDraft(): Promise<void>

    // Delete a draft message
    deleteDraft(): Promise<void>

    // Create a poll
    createPoll(): Promise<void>

// Get context type (channel, thread, legacy_thread, or message)
    get contextType(): string

    // Get composer tag
    get tag(): string

    // Get thread ID
    get threadId(): string | null

// Get message ID
    get id(): string

    // Get draft ID
    get draftId(): string | null

    // Get last change timestamp
    get lastChange(): LastComposerChange

    // Get quoted message
    get quotedMessage(): LocalMessage | null

    // Get poll ID
    get pollId(): string | null

// Check if composer has sendable data
    get hasSendableData(): boolean

    // Check if composition is empty
    get compositionIsEmpty(): boolean

    // Check if last change was local
    get lastChangeOriginIsLocal(): boolean

// Generate a unique ID
    static generateId(): string

The `AttachmentManager` class handles file attachments in message composition. It provides methods for managing attachments and their upload states.

// Get current attachments
    const attachments = attachmentManager.attachments;

    // Add or update attachments
    attachmentManager.upsertAttachments([newAttachment]);

    // Remove attachments
    attachmentManager.removeAttachments([attachmentId]);

When using `uploadAttachment`, ensure correct attachment object structure:


    // Convert file to proper attachment object
    const localAttachment =
      await attachmentManager.fileToLocalUploadAttachment(file);

    // Upload the attachment
    const uploadedAttachment =
      await attachmentManager.uploadAttachment(localAttachment);

Uploaded attachment objects carry `localMetadata`, that are discarded before a message is sent to the server. The `localMetadata` of an uploaded attachment contain:

  * `file` \- the file reference
  * `uploadState` \- the values are `'uploading'`, `'finished'`, `'failed'`, `'blocked'`, `'pending'` (to be uploaded)
  * `uploadPermissionCheck` \- contains the upload permission check result to the CDN and explains the reason if blocked

When editing a draft or an existing message, the already uploaded attachments are automatically marked with `uploadState: "finished"` and have no file reference neither `uploadPermissionCheck`.

**File Filtering**

Use `fileUploadFilter` to add custom filtering logic beyond `acceptedFiles`:


    attachmentManager.fileUploadFilter = (file) => {
      // Custom filter logic
      return file.size < 10 * 1024 * 1024; // Example: 10MB limit
    };

**Custom Upload Destination**

Use `doUploadRequest` to customize where files are uploaded:


    attachmentManager.setCustomUploadFn(async (file) => {
      // Upload to custom CDN
      const result = await customCDN.upload(file);
      return { file: result.url };
    });

For custom CDN uploads, you may need to override `getUploadConfigCheck`:


    class CustomAttachmentManager extends AttachmentManager {
      getUploadConfigCheck = async (file) => {
        // Skip default upload checks for custom CDN
        return { uploadBlocked: false };
      };
    }

The `AttachmentManager` uses internally attachment identity functions to determine operation appropriate to the attachment type. We recommend using attachment identity functions for type safety:


    import { isLocalImageAttachment } from "stream-chat";

    if (isLocalImageAttachment(attachment)) {
      // Type-safe access to image-specific properties
      console.log(attachment.original_height);
    }

Note, the attachments to be considered âlocalâ they need to have `localMetadata` key.

Function| Description
---|---
`isLocalAttachment`| Checks if attachment has local metadata
`isLocalUploadAttachment`| Checks if attachment has upload state metadata
`isFileAttachment`| Checks if attachment is a file attachment
`isLocalFileAttachment`| Checks if attachment is a local file attachment
`isImageAttachment`| Checks if attachment is an image attachment
`isLocalImageAttachment`| Checks if attachment is a local image attachment
`isAudioAttachment`| Checks if attachment is an audio attachment
`isLocalAudioAttachment`| Checks if attachment is a local audio attachment
`isVoiceRecordingAttachment`| Checks if attachment is a voice recording attachment
`isLocalVoiceRecordingAttachment`| Checks if attachment is a local voice recording attachment
`isVideoAttachment`| Checks if attachment is a video attachment
`isLocalVideoAttachment`| Checks if attachment is a local video attachment
`isUploadedAttachment`| Checks if attachment is an uploaded attachment (audio, file, image, video, or voice recording)
`isScrapedContent`| Checks if attachment is scraped content (has og_scrape_url or title_link)

The `LinkPreviewsManager` class handles link preview generation and management in message composition. It provides methods for finding, enriching, and managing link previews. The link previews are converted to attachments before sending the message to the server.

The manager maintains a state with the following properties:


    type LinkPreviewsManagerState = {
      previews: Map<string, LinkPreview>; // URL -> Preview mapping
    };

Each preview has a status:

  * `LOADING`: Preview is being fetched
  * `LOADED`: Preview successfully loaded
  * `FAILED`: Preview loading failed
  * `DISMISSED`: Preview was dismissed by user
  * `PENDING`: Preview is waiting to be processed

The enrichment request execution is debounced by 1.5 seconds by default.


    // Find and enrich URLs in text (debounced)
    linkPreviewsManager.findAndEnrichUrls(text);

    // Cancel ongoing enrichment
    linkPreviewsManager.cancelURLEnrichment();

// Clear non-dismissed previews
    linkPreviewsManager.clearPreviews();

    // Update a specific preview
    linkPreviewsManager.updatePreview(url, {
      title: "New Title",
      description: "New Description",
      status: LinkPreviewStatus.LOADED,
    });

    // Dismiss a preview
    linkPreviewsManager.dismissPreview(url);

Dismissed previews are not re-enriched when the same URL appears again in the text. The `clearPreviews` method preserves dismissed previews while removing others.

`LinkPreviewManager` exposes static API to determine the preview state:


    // Check preview status
    LinkPreviewsManager.previewIsLoading(preview);
    LinkPreviewsManager.previewIsLoaded(preview);
    LinkPreviewsManager.previewIsDismissed(preview);
    LinkPreviewsManager.previewIsFailed(preview);
    LinkPreviewsManager.previewIsPending(preview);

The `getPreviewData` static method extracts the preview data that will be converted to a scraped attachment when the message is sent to the server.


    // Get preview data without status
    LinkPreviewsManager.getPreviewData(preview);

The `PollComposer` class handles poll composition and creation. It provides methods for composing poll data that will be attached to a message.

The poll state consists of poll data and validation errors:


    type PollComposerState = {
      data: {
        id: string;
        name: string;
        description: string;
        options: Array<{ id: string; text: string }>;
        max_votes_allowed: string;
        enforce_unique_vote: boolean;
        allow_answers: boolean;
        allow_user_suggested_options: boolean;
        voting_visibility: VotingVisibility;
        user_id: string;
      };
      errors: Record<string, string>;
    };

Validation is important as it prevents failed creation requests on the server side.

The state is initiated or can be reset:


    // Reset to initial state
    pollComposer.initState();

As poll composition consists of multiple fields, these can be updated. Navigation between fields leads to them being blurred. It is possible to react to both types of events. The `updateFields` method accepts partial objects:


    // Update poll fields
    pollComposer.updateFields({
      name: "Favorite Color?",
      description: "Choose your favorite color",
      options: [
        { id: "1", text: "Red" },
        { id: "2", text: "Blue" },
      ],
      max_votes_allowed: "1",
      enforce_unique_vote: true,
    });


    // Handle field blur validation
    pollComposer.handleFieldBlur("name");

On each update or blur event the data validation and processing take place. Both can be customized via PollComposer middleware (see the PollComposer middleware guide for detailed information).

messageComposer.createPoll();

Behind the scenes, the poll is composed and created on the server. Watch for failed creation request by suscribing to `StreamChat.notifications.state` (see the client notifications service guide).

// Check if poll can be created
    const canCreate = pollComposer.canCreatePoll;

    // Access poll fields
    const name = pollComposer.name;
    const description = pollComposer.description;
    const options = pollComposer.options;
    const maxVotes = pollComposer.max_votes_allowed;
    const enforceUniqueVote = pollComposer.enforce_unique_vote;
    const allowAnswers = pollComposer.allow_answers;
    const allowUserOptions = pollComposer.allow_user_suggested_options;
    const votingVisibility = pollComposer.voting_visibility;

The `canCreatePoll` property checks the minimum requiremets for a poll to be created:

  * At least one non-empty option exists
  * Poll name is not empty
  * `max_votes_allowed` is either empty or a valid number between 2 and 10
  * No validation errors are present

The `CustomDataManager` class handles custom data for both messages and the composer itself. It provides methods for managing two types of custom data:

  1. Message custom data - data that will be sent with the message
  2. Composer custom data - data that stays in the composer and is not sent with the message

The custom data state consists of two separate objects:


    type CustomDataManagerState = {
      message: CustomMessageData; // Data sent with the message
      custom: CustomMessageComposerData; // Data for custom integration needs, not sent with the message
    };

The `custom` property holds any data that an integrator may need for their custom integration that should not be sent with the message. This is useful for storing UI state, temporary data, or any other integration-specific information that needs to persist during message composition.

// Get current state values
    const messageData = customDataManager.customMessageData;
    const composerData = customDataManager.customComposerData;

    // Update message custom data
    customDataManager.setMessageData({
      customField: "value",
    });

    // Update composer custom data
    customDataManager.setCustomData({
      composerField: "value",
    });

    // Initialize state
    customDataManager.initState({ message: existingMessage });

The `isMessageDataEqual` method determines if the message custom data has changed. By default, it performs a JSON string comparison of the message data:


    isMessageDataEqual = (
      nextState: CustomDataManagerState,
      previousState?: CustomDataManagerState,
    ) =>
      JSON.stringify(nextState.message) === JSON.stringify(previousState?.message);

Integrators can override this method to implement custom comparison logic based on their specific needs. For example:


    class CustomDataManager {
      isMessageDataEqual = (
        nextState: CustomDataManagerState,
        previousState?: CustomDataManagerState,
      ) => {
        // Custom comparison logic
        return nextState.message.customField === previousState?.message.customField;
      };
    }

This is particularly useful when:

  * Only specific fields need to be compared
  * Complex data structures require special comparison logic
  * Certain fields should be ignored in the comparison

[PreviousMessageComposer Class](/chat/docs/sdk/react/components/message-input-components/message-composer/)[NextMessageComposer Middleware](/chat/docs/sdk/react/components/message-input-components/message-composer-middleware/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

The Input UI component consumes the [`MessageInputContext`](/chat/docs/sdk/react/components/contexts/message_input_context/) and handles the display and functionality for the message input in a channel. The Input UI component is typically a combination of subcomponents that each consume context and are responsible for one aspect of the message input (ex: text input or emoji picker).

To use your own custom Input UI component, utilize the `Input` prop on either the `Channel` or `MessageInput` component. Adding the prop to `Channel` will inject your component into the `ComponentContext` and adding to `MessageInput` will override any value stored in context. So if both props are added, the value delivered to `MessageInput` will take precedence.


    const CustomInput = () => {
      // consume `MessageInputContext` and render custom component here
    };

    <Chat client={client}>
      <Channel channel={channel} Input={CustomInput}>
        <MessageList />
        <MessageInput />
      </Channel>
    </Chat>;

If an `Input` prop is not provided, the `MessageInput` component will render [`MessageInputFlat`](https://github.com/GetStream/stream-chat-react/blob/master/src/components/MessageInput/MessageInputFlat.tsx) as its Input UI component by default.

`MessageInputFlat` is designed to serve as a guide in helping build a custom Input UI component. At a high level, this pre-built, default component wraps a subset of composable components that each serve specific logic and design-based purposes.

For example, if we strip `MessageInputFlat` down to its core pieces and simplify it a bit, the component return resembles the following snippet:


    <WithDragAndDropUpload>
      <QuotedMessagePreview />
      <UploadsPreview />
      <FileUploadButton />
      <TextareaComposer />
      <SendButton />
    </WithDragAndDropUpload>

We recommend building an Input UI component in a similar way. You can mix and match any of the UI subcomponents and arrange in a layout that meets your design specifications. All of these UI subcomponents are exported by the library and may be used within your custom Input UI component. Each subcomponent consumes the `MessageInputContext` and requires no/minimal props to run.

For a detailed example, review the [Input UI Customization](/chat/docs/sdk/react/guides/theming/input_ui/) example.

The Input UI component only consumes context and does not accept any optional props.

[PreviousMessageInput Hooks](/chat/docs/sdk/react/hooks/message_input_hooks/)[NextUI Components](/chat/docs/sdk/react/components/message-input-components/ui_components/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

The `Avatar` component displays an image, with fallback to the first letter of the optional name prop.

A typical use case for the `Avatar` component would be to import and use in your custom components that will completely override a header component, preview component, or similar.

Hereâs an example of using the `Avatar` component within a custom preview component:


    import { Avatar } from "stream-chat-react";

    const YourCustomChannelPreview = (props) => {
      return (
        <div>
          <Avatar name={props.displayTitle} image={props.displayImage} />
          <div> Other channel info needed in the preview </div>
        </div>
      );
    };

    <ChannelList Preview={YourCustomChannelPreview} />;

You can also take advantage of the `Avatar` prop on the `ChannelHeader` and `ChannelList` components to override just that aspect of these components specifically, see the example below.

An example of overriding just the `Avatar` component in the default `ChannelPreviewMessenger` component.


    const CustomAvatar = (props) => {
      return <Avatar image={props.image} />;
    };

    <ChannelList
      Preview={(props) => (
        <ChannelPreviewMessenger {...props} Avatar={CustomAvatar} />
      )}
    />;

Custom class that will be merged with the default class.

Type
---
string | undefined

The image URL. If the image fails to load the default is an image of the first initial of the name if there is one.

Type| Default
---|---
string | null| first initial of the name

Used to extract a first letter to create the image fallback.

Type
---
string | null

The click event handler applied to the root `div` of the component.

Type
---
(event: React.BaseSyntheticEvent) => void

The mouseOver event handler applied to the root `div` of the component.

Type
---
(event: React.BaseSyntheticEvent) => void

The entire user object for the chat user represented by the Avatar component. This props is not used by the default `Avatar` component.

Type
---
Object

[PreviousUI Components](/chat/docs/sdk/react/components/message-components/ui-components/)[NextBaseImage](/chat/docs/sdk/react/components/utility-components/base-image/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

The Message UI component consumes the [`MessageContext`](/chat/docs/sdk/react/components/contexts/message_context/) and handles the display and functionality for an individual message in a message list. The Message UI component is typically a combination of subcomponents that each consume context and are responsible for one aspect of a message (ex: text or reactions).

Each message list component renders with a default Message UI component. If you donât supply a custom component, component [MessageSimple](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Message/MessageSimple.tsx) will be used by default.

**Example 1** \- Add Message UI component to `MessageList`.

To use your own Message UI component in the standard `MessageList`, utilize the `Message` prop on either the `Channel`, `MessageList` or `Thread` component. Adding the prop to `Channel` will inject your component into the `ComponentContext` and adding to `MessageList` or `Thread` will override any value stored in context. So if both props are added, the value delivered to `MessageList` will take precedence.


    const CustomMessage = () => {
      // consume `MessageContext` and render custom component here
    };

    <Chat client={client}>
      <Channel channel={channel} Message={CustomMessage}>
        <MessageList />
        <MessageInput />
      </Channel>
    </Chat>;

**Example 2** \- Add Message UI component to `VirtualizedMessageList`.

To use your own Message UI component in the `VirtualizedMessageList`, utilize either the `VirtualMessage` prop on `Channel` or the `Message` prop on `VirtualizedMessageList`. Up to the SDK version v10.0.0, `FixedHeightMessage` was the default message component in `Thread`. The component is still available in the SDK, but is not used as a default anymore. Adding the prop to `Channel` will inject your component into the `ComponentContext` and adding to `VirtualizedMessageList` will override any value stored in context. So if both props are added, the value delivered to `VirtualizedMessageList` will take precedence.


    const CustomMessage = () => {
      // consume `MessageContext` and render custom component here
    };

    <Chat client={client}>
      <Channel channel={channel} VirtualMessage={CustomMessage}>
        <VirtualizedMessageList />
        <MessageInput />
      </Channel>
    </Chat>;

`MessageSimple` and `FixedHeightMessage` are both designed to be guides to help build a custom Message UI component. At a high level, these pre-built, default components wrap a subset of composable components that each serve specific logic and design-based purposes.

If we strip `MessageSimple` down to its core pieces, the component resembles the following snippet:


    <div>
      <MessageStatus />
      <Avatar />
      <div>
        <MessageOptions />
        <div>
          <ReactionsList />
          <ReactionSelector />
        </div>
        <div>
          <Attachment />
          <MessageText />
          <MML />
          <MessageErrorIcon />
        </div>
      </div>
      <MessageRepliesCountButton />
      <div>
        <MessageTimestamp />
      </div>
    </div>

We recommend building a Message UI component in a similar way. You can mix and match any of the UI subcomponents and arrange in a layout that meets your design specifications. All of these UI subcomponents are exported by the library and may be used within your custom Message UI component. Each subcomponent consumes the `MessageContext` and requires no/minimal props to run.

For a detailed example, review the [Message UI Customization](/chat/docs/sdk/react/guides/theming/message_ui/) example.

The default message UI component renders 3 option buttons next to the message content in the main message list:

  1. button to open message actions drop-down menu - message actions box
  2. button to open thread
  3. button to open reaction selector

In thread button opening thread is omitted.

The drop-down menu contains a default list of actions that are enabled for a message. These are determined by the permissions the user has. On the other hand, it is also possible to specify [own custom actions](/chat/docs/sdk/react/components/message-components/message_ui/#custommessageactions/). This will lead to adding more items into the drop-down menu.

All Message UI props are optional overrides of the values stored in the [`MessageContext`](/chat/docs/sdk/react/components/contexts/message_context/). As you build your own custom component, we recommend pulling the necessary data from context using the `useMessageContext` custom hook. However, if you choose to develop upon our pre-built, default `MessageSimple` component, you may encounter a situation where you wish to override a single prop, so all options are detailed below.

If true, actions such as edit, delete, flag, etc. are enabled on the message (overrides the value stored in `MessageContext`).

Type| Default
---|---
boolean| true

Additional props to be passed to the underlying [`MessageInput`](/chat/docs/sdk/react/components/message-input-components/message_input/) component thatâs rendered while editing (overrides the value stored in `MessageContext`).

Type
---
object

Call this function to keep message list scrolled to the bottom when the message list container scroll height increases (only available in the `VirtualizedMessageList`). An example use case: upon userâs interaction with the application, a new element appears below the last message. In order to keep the newly rendered content visible, the `autoscrollToBottom` function can be called. The container, however, is not scrolled to the bottom, if already scrolled up more than 4px from the bottom.

You can even use the function to keep the container scrolled to the bottom while images are loading:


    const Image = (props: ImageProps) => {
      ...
      const { autoscrollToBottom } = useMessageContext();
      ...

      return (
        <img
          ...
          onLoad={autoscrollToBottom}
          ...
        />
      );
    };

Type
---
() => void

When called, this function will exit the editing state on the message (overrides the function stored in `MessageContext`).

Type
---
(event?: React.BaseSyntheticEvent) => void

An object containing custom message actions (key) and function handlers (value) (overrides the value stored in `MessageContext`). The key is used as a display text inside the button. Therefore, it should not be cryptic but rather bear the end user in mind when formulating it.


    const customActions = {
      "Copy text": (message) => {
        navigator.clipboard.writeText(message.text || "");
      },
    };

    <MessageList customMessageActions={customActions} />;

Custom action item âCopy textâ in the message actions box:

![Image of a custom action item ](/_astro/message-actions-box-custom-actions.DTA9dLMh_Z1IKuL8.webp)

Type
---
object

If true, the message toggles to an editing state (overrides the value stored in `MessageContext`).

Type| Default
---|---
boolean| false

Overrides the default date formatting logic, has access to the original date object (overrides the function stored in `MessageContext`).

Type
---
(date: Date) => string

Function that returns an array of the allowed actions on a message by the currently connected user (overrides the function stored in `MessageContext`).

Type
---
() => MessageActionsArray

An array of potential styles to apply to a grouped message (ex: top, bottom, single) (overrides the value stored in `MessageContext`).

Type| Options
---|---
string[]| â | âmiddleâ | âtopâ | âbottomâ | âsingleâ

Function that calls an action on a message (overrides the function stored in `MessageContext`).

Type| Default
---|---
(dataOrName?: string | FormData, value?: string, event?: React.BaseSyntheticEvent) => Promise<void>| [MessageContextValue[âhandleActionâ]](/chat/docs/sdk/react/components/contexts/message_context#handleaction)

Function that removes a message from the current channel (overrides the function stored in `MessageContext`).

Type| Default
---|---
(event: React.BaseSyntheticEvent) => Promise<void> | void| [MessageContextValue[âhandleDeleteâ]](/chat/docs/sdk/react/components/contexts/message_context#handledelete)

Function that edits a message (overrides the function stored in `MessageContext`).

Type| Default
---|---
(event: React.BaseSyntheticEvent) => Promise<void> | void| [MessageContextValue[âhandleEditâ]](/chat/docs/sdk/react/components/contexts/message_context#handleedit)

Function that loads the reactions for a message (overrides the function stored in `MessageContext`).

Type| Default
---|---
(event: React.BaseSyntheticEvent) => Promise<void> | void| [MessageContextValue[âhandleFetchReactionsâ]](/chat/docs/sdk/react/components/contexts/message_context#handlhandlefetchreactions)

This function limits the number of loaded reactions to 1200. To customize this behavior, you can pass [a custom `ReactionsList` component](/chat/docs/sdk/react/components/message-components/reactions#handlefetchreactions/).

Function that flags a message (overrides the function stored in `MessageContext`).

Type| Default
---|---
(event: React.BaseSyntheticEvent) => Promise<void> | void| [MessageContextValue[âhandleFlagâ]](/chat/docs/sdk/react/components/contexts/message_context#handleflag)

Function that marks the message and all the following messages as unread in a channel. (overrides the function stored in `MessageContext`).

Type| Default
---|---
(event: React.BaseSyntheticEvent) => Promise<void> | void| [MessageContextValue[âhandleMarkUnreadâ]](/chat/docs/sdk/react/components/contexts/message_context#handleMarkUnread)

Function that mutes the sender of a message (overrides the function stored in `MessageContext`).

Type| Default
---|---
(event: React.BaseSyntheticEvent) => Promise<void> | void| [MessageContextValue[âhandleMuteâ]](/chat/docs/sdk/react/components/contexts/message_context#handlemute)

Function that opens a [`Thread`](/chat/docs/sdk/react/components/core-components/thread/) on a message (overrides the function stored in `MessageContext`).

Type| Default
---|---
(event: React.BaseSyntheticEvent) => Promise<void> | void| [MessageContextValue[âhandleOpenThreadâ]](/chat/docs/sdk/react/components/contexts/message_context#handleopenthread)

Function that pins a message in the current channel (overrides the function stored in `MessageContext`).

Type| Default
---|---
(event: React.BaseSyntheticEvent) => Promise<void> | void| [MessageContextValue[âhandlePinâ]](/chat/docs/sdk/react/components/contexts/message_context#handlepin)

Function that adds a reaction on a message (overrides the function stored in `MessageContext`).

Type| Default
---|---
(event: React.BaseSyntheticEvent) => Promise<void> | void| [MessageContextValue[âhandleReactionâ]](/chat/docs/sdk/react/components/contexts/message_context#handlereaction)

Function that retries sending a message after a failed request (overrides the function stored in `ChannelActionContext`).

Type| Default
---|---
(message: LocalMessage) => Promise<void>| [ChannelActionContextValue[âretrySendMessageâ]](/chat/docs/sdk/react/components/contexts/channel_action_context#retrysendmessage)

When true, signifies the message is the parent message in a thread list (overrides the value stored in `MessageContext`).

Type| Default
---|---
boolean| false

Function that returns whether a message belongs to the current user (overrides the function stored in `MessageContext`).

Type
---
() => boolean

If true, sending reactions is enabled in the currently active channel (overrides the value stored in `MessageContext`).

Type| Default
---|---
boolean| true

The latest message ID in the current channel (overrides the value stored in `MessageContext`).

Type
---
string

DOMRect object linked to the parent `MessageList` component (overrides the value stored in `MessageContext`).

Type
---
DOMRect

An array of users that have been muted by the connected user (overrides the value stored in `MessageContext`).

Type| Default
---|---
Mute[]| [ChannelStateContext[âmutesâ]](/chat/docs/sdk/react/components/contexts/channel_state_context)

Function that runs on click of an @mention in a message (overrides the function stored in `MessageContext`).

Type| Default
---|---
(event: React.BaseSyntheticEvent) => Promise<void> | void| [MessageContextValue[âonMentionsClickMessageâ]](/chat/docs/sdk/react/components/contexts/channel_action_context#onmentionsclickmessage)

Function that runs on hover of an @mention in a message (overrides the function stored in `MessageContext`).

Type| Default
---|---
(event: React.BaseSyntheticEvent) => Promise<void> | void| [MessageContextValue[âonMentionsHoverMessageâ]](/chat/docs/sdk/react/components/contexts/channel_action_context#onmentionshovermessage)

Function that runs on click of a user avatar (overrides the function stored in `MessageContext`).

Type| Default
---|---
(event: React.BaseSyntheticEvent) => Promise<void> | void| [MessageContextValue[âonUserClickâ]](/chat/docs/sdk/react/components/contexts/channel_action_context#onuserclick)

Function that runs on hover of a user avatar (overrides the function stored in `MessageContext`).

Type| Default
---|---
(event: React.BaseSyntheticEvent) => Promise<void> | void| [MessageContextValue[âonUserHoverâ]](/chat/docs/sdk/react/components/contexts/channel_action_context#onuserhover)

An array of users that have read the current message (overrides the value stored in `MessageContext`).

Type
---
array

Custom function to render message text content (overrides the function stored in `MessageContext`).

Type| Default
---|---
function| [renderText](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Message/renderText/renderText.tsx)

Function to toggle the editing state on a message (overrides the function stored in `MessageContext`).

Type
---
(event: React.BaseSyntheticEvent) => Promise<void> | void

If true, indicates that the current `MessageList` component is part of a `Thread` (overrides the value stored in `MessageContext`).

Type| Default
---|---
boolean| false

If true, renders HTML instead of markdown. Posting HTML is only supported server-side (overrides the value stored in `MessageContext`).

Type| Default
---|---
boolean| false

[PreviousMessage Hooks](/chat/docs/sdk/react/hooks/message_hooks/)[NextrenderText function](/chat/docs/sdk/react/components/message-components/render-text/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

`ThreadContext` \- just like any other React context - is used for dependency injection. What makes it different in this case is `ThreadProvider`.

Is a provider which wraps [`Channel`](/chat/docs/sdk/react/components/core-components/channel/) component and takes [`Thread` instance](https://github.com/GetStream/stream-chat-js/blob/master/src/thread.ts) as a value. The [`Channel`](/chat/docs/sdk/react/components/core-components/channel/) wrapper acts as a temporary measure to make [`Thread` component](/chat/docs/sdk/react/components/core-components/thread/) compatible with the new architecture which relies on [`Thread` instance](https://github.com/GetStream/stream-chat-js/blob/master/src/thread.ts). The reliance on channel is _temporary_ and will become deprecated in the future.

Thread component newly prioritizes [`Thread` instance](https://github.com/GetStream/stream-chat-js/blob/master/src/thread.ts) if rendered under `ThreadProvider` otherwise falls back to accessing thread from [`Channel` state](/chat/docs/sdk/react/components/contexts/channel_state_context/).

import { Thread, ThreadProvider } from "stream-chat-react";

    <ThreadProvider thread={/*...*/}>
      <Thread />
    </ThreadProvider>;

[PreviousThread](/chat/docs/sdk/react/components/core-components/thread/)[NextMessage](/chat/docs/sdk/react/components/message-components/message/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

`ChatView` is component itself and a set of components which allow for a drop-in implementation of different chat views - the channel view and thread view. This drop-in solution allows your users to easily switch between said views without having to implement such mechanism yourself. It consists of:

  * `ChatView` \- a provider that holds information about the selected view
  * `ChatView.Selector` \- selector which allows to set the required view
  * `ChatView.Channels` \- a wrapper that renders its children when `ChatView` value is equal to `channels`
  * `ChatView.Threads` \- a provider and a wrapper that renders its children when `ChatView` value is equal to `threads`, exposes `ThreadsViewContext` under which `ThreadList` can set an active thread
  * `ChatView.ThreadAdapter` \- a wrapper which can access an active thread from the `ThreadsViewContext` and forwards it to the [`ThreadProvider`](/chat/docs/sdk/react/components/contexts/thread-context/)

import {
      Chat,
      ChatView,
      ChannelList,
      Channel,
      ThreadList,
      Thread,
      useCreateChatClient,
    } from "stream-chat-react";

    const App = () => {
      const chatClient = useCreateChatClient(/*...*/);

      if (!chatClient) return null;

      return (
        <Chat client={chatClient}>
          <ChatView>
            <ChatView.Selector />
            {/* Channel View */}
            <ChatView.Channels>
              <ChannelList />
              <Channel>{/*...*/}</Channel>
            </ChatView.Channels>
            {/* Thread View */}
            <ChatView.Threads>
              <ThreadList />
              <ChatView.ThreadAdapter>
                <Thread />
              </ChatView.ThreadAdapter>
            </ChatView.Threads>
          </ChatView>
        </Chat>
      );
    };

[PreviousHooks](/chat/docs/sdk/react/components/ai/hooks/)[NextIndicators](/chat/docs/sdk/react/components/utility-components/indicators/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

The `ChannelActionContext` is one of the context providers exposed in the [`Channel`](/chat/docs/sdk/react/components/core-components/channel/) component and is consumable by all of the `Channel` children components. The context provides all of the action properties and handlers for a `channel`, and you can access these by calling the `useChannelActionContext` custom hook.

Pull values from context with our custom hook:


    const { closeThread, loadMoreThread } = useChannelActionContext();

Function to add a temporary notification to `MessageList`, and it will be removed after 5 seconds.

Type
---
function

The function to close the currently open `Thread`.

Type
---
function

The dispatch function for the [`ChannelStateReducer`](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Channel/channelState.ts).

Type
---
ChannelStateReducerAction

A function that takes a message to be edited, returns a Promise.

Type
---
function

Jumps to the first unread message in the channel, if such message exists. If the message is not found, jumps to last read message. Does not jump if the last read message is not defined. The parameter `queryMessageLimit` specifies the message page size around the first unread message in case it is not found in the local app state and has to be retrieved through and API call.

Type
---
`(queryMessageLimit?: number) => Promise<void>`

Used in conjunction with `jumpToMessage`. Restores the position of the message list back to the most recent messages.

Type
---
`() => Promise<void>`

When called, `jumpToMessage` causes the current message list to jump to the message with the id specified in the `messageId` parameter. Hereâs an example of a button, which, when clicked, searches for a given message and navigates to it:


    const JumpToMessage = () => {
      const { jumpToMessage } = useChannelActionContext();

      return (
        <button
          data-testid="jump-to-message"
          onClick={async () => {
            // the filtering based on channelId is just for example purposes.
            const results = await chatClient.search(
              {
                id: { $eq: channelId },
              },
              "Message 29",
              { limit: 1, offset: 0 },
            );

            jumpToMessage(results.results[0].message.id);
          }}
        >
          Jump to message 29
        </button>
      );
    };

    // further down the line, add the JumpToMessage to the component tree as a child of `Channel`
    // ...
    return (
      <Channel channel={channel}>
        <JumpToMessage />
        <Window>
          <MessageList />
        </Window>
      </Channel>
    );

Type
---
`(messageId: string) => Promise<void>`

The function to load next page/batch of `messages` (used for pagination).

Type
---
function

The function to load next page/batch of `messages` (used for pagination).

Type
---
(limit?: number) => Promise<number>

The function to load next page/batch of `messages` in a currently active/open `Thread` (used for pagination).

Type
---
function

Throttled function that executes the API request and updates the local channel read state for own user. The behavior can be configured via the single `options` parameter of type `MarkReadWrapperOptions`. The `options` parameter has the following structure:

Field| Type| Optional| Description
---|---|---|---
`updateChannelUiUnreadState`| `boolean`| yes| Signal, whether the `channelUnreadUiState` should be updated. The local state update is prevented when the Channel component is mounted. This is in order to keep the UI indicating the original unread state, when the user opens a channel. If the value for `updateChannelUiUnreadState` is not provided, the state is updated.

Type
---
`(options?: MarkReadWrapperOptions) => void`

Custom action handler function to execute when @mention is clicked, takes a DOM click event object and an array of mentioned users.

Type
---
function

The function to execute when @mention is hovered in a `message`, takes a DOM click event object and an array of mentioned users.

Type
---
function

The function to execute when replies count button is clicked, takes the parent message of the `Thread` to be opened and optionally a DOM click event.

Type
---
function

The function to remove a `message` from `MessageList`, handled by the `Channel` component. Takes a `message` object.

Type
---
function

The function to resend a `message`, handled by the `Channel` component.

Type
---
function

The function to send a `message` on `Channel`. Takes a `message` object with the basic message information as the first argument, and custom data as the second argument.

Type
---
function

The function to update a `message` on `Channel`, takes a `message` object.

Type
---
function

[PreviousChannelHeader](/chat/docs/sdk/react/components/utility-components/channel_header/)[NextChannelStateContext](/chat/docs/sdk/react/components/contexts/channel_state_context/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

The `ChannelHeader` component displays pertinent information regarding the currently active channel, including image and title.

Use this component by adding it as a child of the `Channel` component. If you want to âoverrideâ this component, you simply use your custom component instead.

**Example 1**


     <Channel channel={channel}>
      <ChannelHeader live={true} title={"General"} />
    </Channel>

**Example 2** \- using a custom heading component.


    <Channel channel={channel}>
      <YourCustomChannelHeader />
    </Channel>

A custom UI component to display the avatar image.

Type| Default
---|---
component| [Avatar](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Avatar/Avatar.tsx)

The displayed image URL for the header, defaults to the `channel` image if there is one.

Type| Default
---|---
string| the `channel` image

A boolean for showing a little indicator below the title if the `channel` is live right now.

Type
---
boolean

A custom UI component to display menu icon.

Type| Default
---|---
component| [MenuIcon](https://github.com/GetStream/stream-chat-react/blob/master/src/components/ChannelHeader/icons.tsx)

A string to set the title manually, defaults to the `channel` name if there is one.

Type| Default
---|---
string| the `channel` name

[PreviousChannel](/chat/docs/sdk/react/components/core-components/channel/)[NextChannelActionContext](/chat/docs/sdk/react/components/contexts/channel_action_context/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

Messages can be enriched with attachments or polls by default. The `AttachmentSelector` component is a component that allows to select what information is to be attached to a message. The attachment objects are included in `message.attachments` property and represent various file uploads. The poll representation is available via `message.poll` property.

The configuration is possible via Stream dashboard. File uploads and poll creation can be controlled via

  1. role permissions

![](/_astro/dashboard-roles-permissions-ui.D_3rpjjw_Z189N1v.webp)

  2. channel type configuration

![](/_astro/dashboard-channel-type-feature-configuration-ui.BnLEcxvr_15cDHK.webp)

Uploads are possible only if both Upload Attachment permission is granted to the user role and channel type Uploads configuration is enabled.

Polls feature is available in the React SDK as of version 12.5.0

Poll creation is enabled only if both Create Poll permission is granted to the user role and channel type Polls configuration is enabled. Poll creation is not possible withing threads.

The component in charge of rendering [the poll creation UI is `PollCreationDialog`](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Poll/PollCreationDialog/PollCreationDialog.tsx). The component is rendered in a modal and therefore accepts a prop `close`.

![](/_astro/poll-creation-dialog.EUL0XSmn_Z2v2TOo.webp)

Custom `PollCreationDialog` can be provided via `Channel` prop `PollCreationDialog`:


    import { ReactNode } from "react";
    import { Channel } from "stream-chat-react";
    import type { PollCreationDialogProps } from "stream-chat-react";

    const CustomPollCreationDialog = ({ close }: PollCreationDialogProps) => (
      <div onClick={close}>Custom Poll Creation Dialog</div>
    );

    const ChannelWrapper = ({ children }: { children: ReactNode }) => (
      <Channel PollCreationDialog={CustomPollCreationDialog}>{children}</Channel>
    );

Created poll is then rendered within a message list by [`Poll` component](/chat/docs/sdk/react/components/message-components/poll/).

Items in the `AttachementSelector` menu can be customized via its `attachmentSelectorActionSet` prop:


    import { ReactNode } from "react";
    import {
      AttachmentSelector,
      Channel,
      defaultAttachmentSelectorActionSet,
    } from "stream-chat-react";
    import type {
      AttachmentSelectorAction,
      AttachmentSelectorActionProps,
      AttachmentSelectorModalContentProps,
    } from "stream-chat-react";

    // Define the menu button
    const AddLocationAttachmentAction = ({
      closeMenu,
      openModalForAction,
    }: AttachmentSelectorActionProps) => (
      <button
        onClick={() => {
          openModalForAction("addLocation");
          closeMenu();
        }}
      >
        Location
      </button>
    );

    // Define the modal contents to be rendered if AddLocationAttachmentAction button is clicked
    const AddLocationModalContent = ({
      close,
    }: AttachmentSelectorModalContentProps) => {
      return <div onClick={close}>abc</div>;
    };

    // the custom action will be at the top of the menu
    const attachmentSelectorActionSet: AttachmentSelectorAction[] = [
      {
        ActionButton: AddLocationAttachmentAction,
        ModalContent: AddLocationModalContent,
        type: "addLocation",
      },
      ...defaultAttachmentSelectorActionSet,
    ];

    const CustomAttachmentSelector = () => (
      <AttachmentSelector
        attachmentSelectorActionSet={attachmentSelectorActionSet}
      />
    );

    const ChannelWrapper = ({ children }: { children: ReactNode }) => (
      <Channel AttachmentSelector={CustomAttachmentSelector}>{children}</Channel>
    );

By default, the modals invoked by clicking on AttachmentSelector menu buttons are anchored to the channel container `div` element. The destination element can be changed by providing `getModalPortalDestination` prop to `AttachmentSelector`. This would be function that would return a reference to the target element that would serve as a parent for the modal.


    const getModalPortalDestination = () =>
      document.querySelector<HTMLDivElement>("#my-element-id");

    const CustomAttachmentSelector = () => (
      <AttachmentSelector getModalPortalDestination={getModalPortalDestination} />
    );

Components rendered as children of `AttachmentSelector` can access `AttachmentSelectorContext`. The context exposes the following properties:

Reference to `input` element of type `file` used to select files to upload. The reference is `null` if the user does not have a permission to upload files.

Type| Default
---|---
`HTMLInputElement`| `null`

[PreviousAudio Recorder](/chat/docs/sdk/react/components/message-input-components/audio_recorder/)[NextTypingContext](/chat/docs/sdk/react/components/contexts/typing_context/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

The SDK comes with the `EmojiPicker` component which is built on top of the [`emoji-mart`](https://github.com/missive/emoji-mart) and is disabled by default but can be easily enabled by installing [`emoji-mart` related packages](https://github.com/GetStream/stream-chat-react/blob/master/package.json#L100-L102), importing the component from `stream-chat-react/emojis` and forwarding it to the [`Channel`](/chat/docs/sdk/react/components/core-components/channel/) component, see the [_Basic Usage_ section](/chat/docs/sdk/react/guides/customization/emoji_picker#basic-usage/) of the customization guide for more information.

![Default Emoji Picker](/_astro/default-emoji-picker.DdYTzhgM_13MvjA.webp)

The icon component to be rendered within open/close button.

Type| Default
---|---
React.ComponentType| [`EmojiPickerIcon`](https://github.com/GetStream/stream-chat-react/blob/master/src/components/MessageInput/icons.tsx#L38-L49)

The `className` to be used in the open/close button instead of the default one.

Type| Default
---|---
string| âstr-chat__emoji-picker-buttonâ

The `className` to be used in the picker container element instead of the default one.

Type| Default
---|---
string| âstr-chat__message-textarea-emoji-picker-containerâ

The `className` to be used in the wrapper element of the whole component instead of the default one.

Type| Default
---|---
string| âstr-chat__message-textarea-emoji-pickerâ

The flag which specifies whether the emoji picker component should close after an emoji has been selected.

Type| Default
---|---
boolean| false

Untyped [properties](https://github.com/missive/emoji-mart/tree/v5.5.2#options--props) to be passed down to the [emoji-mart `Picker`](https://github.com/missive/emoji-mart/tree/v5.5.2#-picker) component.

Type
---
Partial<{ theme: âautoâ | âlightâ | âdarkâ } & Record<string, unknown>>

[React Popper options](https://popper.js.org/docs/v2/constructors/#options) to be passed down to the [react-popper `usePopper`](https://popper.js.org/react-popper/v2/hook/) hook.

Type
---
Partial<Options>

[PreviousUI Components](/chat/docs/sdk/react/components/message-input-components/ui_components/)[NextAudio Recorder](/chat/docs/sdk/react/components/message-input-components/audio_recorder/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

The Stream Chat React component library provides a variety components that show the status of items loading, queries from the API, network issues, and also a typing indicator:

  * [`ChatDown`](https://github.com/GetStream/stream-chat-react/blob/master/src/components/ChatDown/ChatDown.tsx) \- established in the `ChannelList`, the default indicator that shows when chat functionality isnât available, triggered when the Chat API is unavailable or your network isnât working.

  * [`EmptyStateIndicator`](https://github.com/GetStream/stream-chat-react/blob/master/src/components/EmptyStateIndicator/EmptyStateIndicator.tsx) \- this component is established in the `MessageList`, `VirtualizedList`, and `ChannelList` components and is rendered when there are no items to display.

  * [`LoadingChannels`](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Loading/LoadingChannels.tsx) \- a fancy loading placeholder for the `ChannelList` that looks like a nice outline of a few preview components.

  * [`LoadingErrorIndicator`](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Loading/LoadingErrorIndicator.tsx) \- the default UI component that displays an error message when the channel query fails in `Channel`.

  * [`LoadingIndicator`](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Loading/LoadingIndicator.tsx) \- a simple loading spinner component. This component is used in various places in the SDK library when waiting for a response from the Stream Chat API. It can also be imported individually into a project for use in custom components.

  * [`LoadMoreButton`](https://github.com/GetStream/stream-chat-react/blob/master/src/components/LoadMore/LoadMoreButton.tsx) \- a simple button component that handles pagination logic when loading more items after querying the API. Established via the `LoadMorePaginator` component and can be used standalone in a custom component.

  * [`LoadMorePaginator`](https://github.com/GetStream/stream-chat-react/blob/master/src/components/LoadMore/LoadMorePaginator.tsx) \- a paginator component that renders channels in the `ChannelList`.

  * [`TypingIndicator`](https://github.com/GetStream/stream-chat-react/blob/master/src/components/TypingIndicator/TypingIndicator.tsx) \- a UI component that lists users currently typing and rendered via the `MessageList` and `VirtualizedList` components

You can override this indicator by utilizing the `LoadingErrorIndicator` prop on `ChannelList`.

You can override this indicator in the `ChannelList` via the `EmptyStateIndicator` prop. Use the `EmptyStateIndicator` prop on `Channel` to override in the `MessageList` and `VirtualizedList` components.

Override this component to display an error message in a way that fits your requirements via the `LoadingErrorIndicator` prop on `Channel`.

Override this component in the `MessageList` and `VirtualizedList` components by using the `LoadingIndicator` prop on `Channel`. This injects the new value into the `ComponentContext` which is then pulled for use in the lists.

Override this component in the `ChannelList` by using the `Paginator` prop on `ChannelList`. This is also the place where you can customize the `LoadMoreButton` by taking advantage of the prop of the same name on your new paginator component.

Override this component via the `TypingIndicator` prop on `Channel`, which injects the new value into the `ComponentContext` which is then pulled for use in the lists.

The image url for this error or a ReactElement.

Type
---
string | React.ReactElement

The error message to show.

Type
---
string

The type of error.

Type
---
string

The type of list that will display this indicator, and this type will conditionally render a message.

Type
---
âchannelâ | âmessageâ | âthreadâ

The error object that is displayed.

Type
---
Error

Set the color of the loading icon.

Type| Default
---|---
string| #006CFF

The size of the loading icon.

Type| Default
---|---
number| 15px

The onClick handler. Pagination logic should be executed in this handler.

Type
---
React.MouseEventHandler<HTMLButtonElement>

If true, the `LoadingIndicator` is displayed instead of button.

Type
---
boolean

Callback to load the next page, required.

Type
---
() => void

Boolean for if there is a next page to load.

Type
---
boolean

A UI button component that handles pagination logic.

Type| Default
---|---
component| [LoadMoreButton](https://github.com/GetStream/stream-chat-react/blob/master/src/components/LoadMore/LoadMoreButton.tsx)

A boolean to indicate if there is currently any refreshing taking place.

Type
---
boolean

A boolean that indicates if the `LoadMoreButton` should be displayed at the top of the list of channels instead of the bottom of the list (the default).

Type
---
boolean

Custom UI component to display userâs avatar.

Type| Default
---|---
component| [Avatar](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Avatar/Avatar.tsx)

Boolean that signals whether the typing indicator is in a `Thread`.

Type
---
boolean

[PreviousChatView](/chat/docs/sdk/react/components/utility-components/chat-view/)[NextWindow](/chat/docs/sdk/react/components/utility-components/window/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

The `renderText` function is a core piece of functionality, which handles how the text of our message is going to be formatted/look like. The default `renderText` function parses a markdown string and outputs a `ReactElement`. Under the hood, the output is generated by the `ReactMarkdown` component from [react-markdown library](https://github.com/remarkjs/react-markdown). The component transforms the markdown to `ReactElement` by using [`remark` parser](https://github.com/remarkjs/remark/tree/main) and [`remark`](https://github.com/remarkjs/remark/blob/main/doc/plugins.md) and [`rehype`](https://github.com/rehypejs/rehype/blob/main/doc/plugins.md) plugins.

The default `remark` plugins used by SDK are:

  1. [`remark-gfm`](https://github.com/remarkjs/remark-gfm) \- a third party plugin to add GitHub-like markdown support

The default `rehype` plugins (both specific to this SDK) are:

  1. plugin to render user mentions
  2. plugin to render emojis

If you donât want your chat implementation to support markdown syntax by default you can override the default behaviour by creating a custom `renderText` function which returns a React node and passing it down to the [`MessageList`](/chat/docs/sdk/react/components/core-components/message_list/) or [`MessageSimple`](/chat/docs/sdk/react/components/message-components/message_ui/) component via `renderText` property.

For this particular example weâll create a very primitive one which takes the message text passed down to it as a first argument and returns it wrapped in `span` element:


    import { MessageList } from "stream-chat-react";

    const customRenderText = (text) => {
      return <span>{text}</span>;
    };

    export const WrappedMessageList = () => (
      <MessageList renderText={customRenderText} />
    );

Hereâs also an example with [`VirtualizedMessageList`](/chat/docs/sdk/react/components/core-components/virtualized_list/) which currently does not accept `renderText` directly:


    import { VirtualizedMessageList, MessageSimple } from "stream-chat-react";

    const customRenderText = (text) => {
      return <span>{text}</span>;
    };

    const CustomMessage = (props) => (
      <MessageSimple {...props} renderText={customRenderText} />
    );

    export const WrappedVirtualizedMessageList = () => (
      <VirtualizedMessageList Message={CustomMessage} />
    );

If you feel like the default output is sufficient, but youâd like to adjust how certain [ReactMarkdown components](https://github.com/remarkjs/react-markdown#appendix-b-components) look like (like `strong` element generated by typing **strong**) you can do so by passing down options to a third argument of the default `renderText` function:

Types `mention` and `emoji` are special case component types generated by our SDKâs custom rehype plugins.


    import { renderText } from "stream-chat-react";

    const CustomStrongComponent = ({ children }) => (
      <b className="custom-strong-class-name">{children}</b>
    );

    const CustomMentionComponent = ({ children, node: { mentionedUser } }) => (
      <a data-user-id={mentionedUser.id} href={`/user-profile/${mentionedUser.id}`}>
        {children}
      </a>
    );

    export const WrappedMessageList = () => (
      <MessageList
        renderText={(text, mentionedUsers) =>
          renderText(text, mentionedUsers, {
            customMarkDownRenderers: {
              strong: CustomStrongComponent,
              mention: CustomMentionComponent,
            },
          })
        }
      />
    );

If you would like to extend the array of plugins used to parse the markdown, you can provide your own lists of remark resp. rehype plugins. The logic that determines what plugins are used and in which order can be specified in custom `getRehypePlugins` and `getRemarkPlugins` functions. These receive the default array of rehype and remark plugins for further customization. Both custom functions ought to be passed to the third `renderText` parameter. An example follows:

It is important to understand what constitutes a rehype or remark plugin. A good start is to learn about the library called [`react-remark`](https://github.com/remarkjs/react-remark) which is used under the hood in our `renderText` function.


    import { renderText, RenderTextPluginConfigurator } from "stream-chat-react";
    import { customRehypePlugin } from "./rehypePlugins";
    import { customRemarkPlugin } from "./remarkPlugins";

    const getRehypePlugins: RenderTextPluginConfigurator = (plugins) => {
      return [customRehypePlugin, ...plugins];
    };
    const getRemarkPlugins: RenderTextPluginConfigurator = (plugins) => {
      return [customRemarkPlugin, ...plugins];
    };

    const customRenderText = (text, mentionedUsers) =>
      renderText(text, mentionedUsers, {
        getRehypePlugins,
        getRemarkPlugins,
      });

    const WrappedMessageList = () => <MessageList renderText={customRenderText} />;

It is also possible to define your custom set of allowed tag names for the elements rendered from the parsed markdown. To perform the tree transformations, you will need to use libraries like [`unist-builder`](https://github.com/syntax-tree/unist-builder) to build the trees and [`unist-util-visit`](https://github.com/syntax-tree/unist-util-visit-parents) or [`hast-util-find-and-replace`](https://github.com/syntax-tree/hast-util-find-and-replace) to traverse the tree:


    import { findAndReplace } from "hast-util-find-and-replace";
    import { u } from "unist-builder";
    import {
      defaultAllowedTagNames,
      renderText,
      RenderTextPluginConfigurator,
    } from "stream-chat-react";

    // wraps every letter b in <xxx></xxx> tags
    const customTagName = "xxx";
    const replace = (match) =>
      u("element", { tagName: customTagName }, [u("text", match)]);
    const customRehypePlugin = () => (tree) => findAndReplace(tree, /b/, replace);

    const getRehypePlugins: RenderTextPluginConfigurator = (plugins) => {
      return [customRehypePlugin, ...plugins];
    };

    const customRenderText = (text, mentionedUsers) =>
      renderText(text, mentionedUsers, {
        allowedTagNames: [...defaultAllowedTagNames, customTagName],
        getRehypePlugins,
      });

    const WrappedMessageList = () => <MessageList renderText={customRenderText} />;

[PreviousMessage UI](/chat/docs/sdk/react/components/message-components/message_ui/)[NextUI Components](/chat/docs/sdk/react/components/message-components/ui-components/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

## Guides

Blocking users is an essential feature in a chat application because it enhances user safety and experience. It allows individuals to protect themselves from harassment, spam, and unwanted interactions. By giving users control over their interactions, it helps maintain privacy, reduces the risk of cyber-bullying, and promotes a respectful community atmosphere.

The Stream Chat SDK provides a way for blocking and unblocking users, as well as listing all of the blocked users.

When you block a user, you wonât receive any direct messages from that user anymore. However, if you share a group with other participants, you will still receive messages from the blocked user.

In this cookbook, we will see how to implement this feature in your chat application, using the Stream Chat SDK.

The low-level client provides the following methods related to user blocking.

In order to block a user, you need to use the `blockUser` method of the client instance. This method takes the user id of the user you wish to block.


    import { StreamChat } from "stream-chat";
    const chatClient = StreamChat.getInstance("<API_KEY>");

    const blockUser = async (userId: string) => {
      try {
        await chatClient.blockUser(userId);
      } catch (error) {
        console.log("Error blocking user:", error);
      }
    };

Similarly, to unblock a blocked user, you need to use the `unBlockUser` method of the client instance. This method takes the user id of the user you wish to unblock.


    import { StreamChat } from "stream-chat";
    const chatClient = StreamChat.getInstance("<API_KEY>");

    const unBlockUser = async (userId: string) => {
      try {
        await chatClient.unBlockUser(userId);
      } catch (error) {
        console.log("Error UnBlocking user:", error);
      }
    };

To list all the blocked users, you can use the `getBlockedUsers` method of the client instance.


    const chatClient = StreamChat.getInstance("<API_KEY>");

    const getBlockedUsers = async () => {
      try {
        const users = await chatClient.getBlockedUsers();
        setBlockedUsers(users.blocks);
      } catch (error) {
        console.log("Error getting blocked users:", error);
      }
    };

All of these actions can be triggered _after_ the client connection (`client.connectUser`) is established.

You can use the logic above to create your own custom message actions that will involve user blocking.

This can be done by using the `CustomMessageActionsList` prop of the `Channel` component. You can follow the guide [here](/chat/docs/sdk/react/guides/theming/actions/message_actions#using-custommessageactionlist-component/).


    import { Channel, messageActions } from "stream-chat-react-native";

    const CustomMessageActionList = () => {
      const { client } = useChatContext();
      const { message } = useMessageContext();

      return (
        <>
          <button
            className="str-chat__message-actions-list-item-button"
            onClick={() => client.blockUser(message.user_id!)}
          >
            Block <strong>{message.user?.name ?? message.user?.id}</strong>
          </button>

          {/** ...other action buttons... */}
        </>
      );
    };

    <Channel CustomMessageActionList={CustomMessageActionList}>...</Channel>;

[PreviousDialog Management](/chat/docs/sdk/react/guides/dialog-management/)[NextMessage Actions](/chat/docs/sdk/react/experimental/message-actions/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

This example demonstrates how to build a custom component to override the default `GiphyPreviewMessage` component that is rendered optionally in the `VirtualizedMessageList`.

When the `separateGiphyPreview` prop on the list is set to true, the Giphy preview is rendered in a separate component above the `MessageInput` rather than inline with the other messages in the list. This separate component makes it so the preview doesnât scroll away in the large channel.


    <VirtualizedMessageList separateGiphyPreview />

Our custom preview component will render an `Attachment` component with a custom `AttachmentActions` UI component, which handles the onClick functionality. This functionality is handled with the `handleAction` method via the `Message` componentâs `useActionHandler` hook.


    const CustomAttachmentActions: React.FC<AttachmentActionsProps> = (props) => {
      const { actionHandler, actions } = props;

      const handleClick = async (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        value?: string,
        name?: string,
      ) => {
        try {
          if (actionHandler) await actionHandler(name, value, event);
        } catch (err) {
          console.log(err);
        }
      };

      return (
        <>
          {actions.map((action) => (
            <button onClick={(event) => handleClick(event, action.value, action.name)}>
              {action.value}
            </button>
          ))}
        </>
      );
    };

    const CustomGiphyPreview: React.FC<GiphyPreviewMessageProps> = (props) => {
      const { message } = props;

      const handleAction = useActionHandler(message);

      if (!message.attachments) return null;

      return (
        <Attachment
          actionHandler={handleAction}
          AttachmentActions={CustomAttachmentActions}
          attachments={message.attachments}
        />
      );
    };

    <Chat client={chatClient}>
      <Channel GiphyPreviewMessage={CustomGiphyPreview}>
        <ChannelHeader />
        <VirtualizedMessageList separateGiphyPreview />
        <MessageInput />
      </Channel>
    </Chat>;

![Custom GiphyPreview component for Chat](/_astro/GiphyPreview.D_FE8aIc_Ziv0kJ.webp)

[PreviousGeolocation Attachment & Live Location Sharing](/chat/docs/sdk/react/guides/theming/actions/geolocation_attachment/)[NextOrder and Payment Attachment](/chat/docs/sdk/react/guides/theming/actions/payment_attachment/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

The recommended way of connecting your chat application to the Stream Chat API is through the use of `useCreateChatClient` hook.

You can create an instance with the `new` keyword or through the use of static method `getInstance` \- the latter will create and store your instance and subsequent `getInstance` calls will return what has been stored.


    import { Chat } from "stream-chat-react";
    import { StreamChat } from "stream-chat";

    const client = new StreamChat(apiKey);

    // or

    const client = StreamChat.getInstance(apiKey);

To authenticate a user youâll need a token. Typically, you send this token from your backend to your frontend when the user logs in. See the [Tokens & Authentication](/chat/docs/javascript/tokens_and_authentication/) documentation to learn more about creating tokens. For our purposes here, we will assume you have created and retrieved a `token`.

To connect a user, call the `connectUser` method on your client instance with the user object and `token` provided as arguments. Connect the user directly after instantiating the client to establish a websocket connection with the Stream Chat API. Once the connection has been opened, your client instance will begin receiving events from the API.


    const connectionPromise = client.connectUser(
      {
        id: "dave-matthews",
        name: "Dave Matthews",
      },
      token,
    );

To dispose of the active connection (upon component cleanup, for example) youâd call `disconnectUser` method. Itâs generally recommended to wait for the connection promise to resolve before disconnecting.


    await connectionPromise;
    client.disconnectUser();

[PreviousThread Header](/chat/docs/sdk/react/guides/customization/thread_header/)[NextLivestream Best Practices](/chat/docs/sdk/react/guides/livestream-setup/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

This example will focus on the specific use case where there are two `ChannelList` components in the same application.

The event listeners of both lists, letâs say A and B, will pick up all `new.message` events for every `channel`, regardless of which list the `message` is sent in. If a message is sent in list B, the event listener in list A will also pick up the new `message` and bump the impacted `channel` to the top of the list. This is not the desired result for multiples lists, but there is a correct way to handle the routing of these messages.

The reason that a `channel` will automatically be bumped to the top of a list even though itâs not actually part of the list is due to the default behavior. The `ChannelList` components will retrieve a `channel` from `client.activeChannels` if the `channel` doesnât already exist.

By using the `channelRenderFilterFn` prop we can apply custom filtering logic to the list of `channels` that are rendered. Since we have access to the entire `channel` object, we can filter on type, custom fields, or other.


    const customChannelFilterFunction = (channels: Channel[]) => {
      return channels.filter(/** your custom filter logic */);
    };

    <ChannelList
      channelRenderFilterFn={customChannelFilterFunction}
      filters={filters}
      sort={sort}
      options={options}
    />;

[PreviousInfinite Scroll](/chat/docs/sdk/react/guides/channel-list-infinite-scroll/)[NextThreadList](/chat/docs/sdk/react/components/core-components/thread-list/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

The purpose of link previews in the MessageInput`is to provide visual guides of what a user may expect to be rendered later in the`MessageList`by [`Card` component](/chat/docs/sdk/react/components/message-components/attachment#card/) among message attachments.

Link previews are rendered once enabled via `MessageComposer`:


    import { useCreateChatClient } from " stream-chat";

    const App = () => {
      const chatClient = useCreateChatClient({
        apiKey,
        tokenOrProvider: userToken,
        userData: { id: userId },
      });

      useEffect(() => {
        if (!chatClient) return;

        chatClient.setMessageComposerSetupFunction(({ composer }) => {
          composer.linkPreviewsManager.enabled = true;
        });
      }, [chatClient]);
    };

The link previews are rendered using `LinkPreviewList`. The component subscribes to changes in `MessageComposer.linkPreviewsManager` state to render the list of link previews.

The default `LinkPreviewList` component lists all the successfully loaded and loading previews.

The default link preview UI is implemented for:

**Message input**

![Link Preview Message Input](/_astro/link-preview-message-input.BgQa24bQ_oDFbF.webp)

* * *

**Edit message form**

![Link Preview Edit Message Form](/_astro/link-preview-edit-message-form.BkeUPlKI_1YzzAL.webp)

If the default link previews UI does not meet our expectations, we can provide a custom component. To render our own `LinkPreviewList`, we just need to pass it to `Channel` prop `LinkPreviewList. The custom component should internally subscribe to changes in message composerâs link preview manager.


    import {
      Channel,
      LinkPreviewListProps,
      LinkPreviewCard,
      useMessageComposer,
    } from "stream-chat-react";
    import { LinkPreviewsManagerState } from "stream-chat";

    // on every link preview manager state extract these link previews
    const linkPreviewsManagerStateSelector = (state: LinkPreviewsManagerState) => ({
      linkPreviews: Array.from(state.previews.values()).filter(
        (preview) =>
          LinkPreviewsManager.previewIsLoaded(preview) ||
          LinkPreviewsManager.previewIsLoading(preview),
      ),
    });

    const CustomLinkPreviewList = ({ linkPreviews }: LinkPreviewListProps) => {
      const { linkPreviewsManager } = useMessageComposer();

      // subscribe to link preview manager's state change
      const { linkPreviews } = useStateStore(
        linkPreviewsManager.state,
        linkPreviewsManagerStateSelector,
      );

      const showLinkPreviews = linkPreviews.length > 0;

      if (!showLinkPreviews) return null;

      return (
        <div className="str-chat__link-preview-list">
          {linkPreviews.map((linkPreview) => (
            <LinkPreviewCard
              key={linkPreview.og_scrape_url}
              linkPreview={linkPreview}
            />
          ))}
        </div>
      );
    };

    const App = () => (
      <Channel LinkPreviewList={CustomLinkPreviewList}>{/* ...  */}</Channel>
    );

In the above example we can notice, that the `LinkPreview` object comes with property `state`. This property can be used to determine, how the preview for a given link should be rendered. These are the possible states a link preview can acquire:


    enum LinkPreviewState {
      /** Link preview has been dismissed using MessageInputContextValue.dismissLinkPreview **/
      DISMISSED = "dismissed",
      /** Link preview could not be loaded, the enrichment request has failed. **/
      FAILED = "failed",
      /** Link preview has been successfully loaded. **/
      LOADED = "loaded",
      /** The enrichment query is in progress for a given link. **/
      LOADING = "loading",
      /** The preview reference enrichment has not begun. Default status if not set. */
      PENDING = "pending",
    }

The following aspect of link preview management in `MessageInput` can be customized:

  * The debounce interval for the URL discovery and enrichment requests.
  * URL discovery
  * Link preview dismissal

All is done via `MessageComposer` configuration API:


    import { useCreateChatClient } from "stream-chat";
    import type { LinkPreview } from "stream-chat";
    import { customUrlDetector } from "./urlDetection";

    const App = () => {
      const chatClient = useCreateChatClient({
        apiKey,
        tokenOrProvider: userToken,
        userData: { id: userId },
      });

      useEffect(() => {
        if (!chatClient) return;

        chatClient.setMessageComposerSetupFunction(({ composer }) => {
          composer.updateConfig({
            linkPreviews: {
              debounceURLEnrichmentMs: 2000,
              enabled: true,
              findURLFn: customUrlDetector,
              onLinkPreviewDismissed: (linkPreview: LinkPreview) => {
                chatClient.notifications.addInfo({
                  message: "Link prevew dismissed",
                  origin: { emitter: composer.linkPreviewsManager },
                });
              },
            },
          });
        });
      }, [chatClient]);
    };

[PreviousMessage Input UI](/chat/docs/sdk/react/guides/theming/input_ui/)[NextAttachment Previews in Message Input](/chat/docs/sdk/react/guides/message-input/attachment_previews/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

Our SDK comes with [`ChatView`](/chat/docs/sdk/react/components/utility-components/chat-view/) which allows for an easy integration of different views. In this guide weâll show how to implement custom threads view while utilising core components and hooks.

These components and hooks are required for your own implementation to work properly:

  * `ThreadList`
  * `ThreadListItem` \- a provider for `ThreadListItemUi` with thread information, will be used to forward custom click event to the `ThreadListItemUi` button
  * `ThreadProvider` \- âadapterâ for Thread component to work properly with [`Thread` instance](https://github.com/GetStream/stream-chat-js/blob/master/src/thread.ts)
  * `Thread` \- provides [`MessageList`](/chat/docs/sdk/react/components/core-components/message_list/) with [`MessageInput`](/chat/docs/sdk/react/components/message-input-components/message_input/) adjusted for threads
  * `useActiveThread` \- takes your selected thread instance and handles its activity state (`Thread.activate()` & `Thread.deactivate()`) based on document focus and visibility

import {
      ThreadList,
      ThreadListItem,
      ThreadProvider,
      Thread,
      WithComponents,
      useActiveThread,
    } from "stream-chat-react";

    export const CustomThreadsView = () => {
      const [activeThread, setActiveThread] = useState(undefined);

      useActiveThread({ activeThread });

      return (
        <div className="custom-threads-view">
          <ThreadList
            virtuosoProps={{
              itemContent: (_, thread) => (
                <ThreadListItem
                  thread={thread}
                  threadListItemUiProps={{
                    "aria-selected": thread === activeThread,
                    onClick: () => {
                      setActiveThread(thread);
                    },
                  }}
                />
              ),
            }}
          />

          {activeThread && (
            <ThreadProvider thread={activeThread}>
              <Thread />
            </ThreadProvider>
          )}
        </div>
      );
    };

[PreviousDate and time formatting](/chat/docs/sdk/react/guides/date-time-formatting/)[NextDialog Management](/chat/docs/sdk/react/guides/dialog-management/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

In this example, we will demonstrate how to render the current channel members and their online status.

Letâs start the example by creating a simple members list component. To access the members list of the current channel, we will get the current channel using `useChannelStateContext` hook. The example is a bit more convoluted, since we will add online presence updates at the next step.

In order for the client to receive updates for user presence, ensure that you are watching the channel with `channel.watch({ presence: true })`. More details can be found in the [â LLC documentation](/chat/docs/javascript/watch_channel/).


    const Users = () => {
      const { channel } = useChannelStateContext();
      const [channelUsers, setChannelUsers] = useState<
        Array<{ name: string; online: boolean }>
      >([]);

      useEffect(() => {
        const updateChannelUsers = () => {
          setChannelUsers(
            Object.values(channel.state.members).map((user) => ({
              name: user.user_id!,
              online: !!user.user!.online,
            })),
          );
        };

        updateChannelUsers();
      }, [client, channel]);

      return (
        <ul className="users-list">
          {channelUsers.map((member) => (
            <li key={member.name}>
              {member.name} - {member.online ? "online" : "offline"}
            </li>
          ))}
        </ul>
      );
    };

We can place the component as a child of the `Channel` component:


    <Channel>
      <Window>
        <Users />
        <ChannelHeader />
        <MessageList />
        <MessageInput focus />
      </Window>
      <Thread />
    </Channel>

So far, our list looks good, but thereâs a catch: for performance purposes, the `useChannelStateContext` does not refresh when user presence changes. To make the list update accordingly, we need to attach an additional listener to the `user.presence.changed` event of the chat client. Letâs also add some basic CSS to complete the look of the list. The class is already applied to the JSX, just add a CSS file and be sure to import into your file.


    .users-list {
      background: #ffffff;
      padding: 20px;
      padding-left: 30px;
      border-radius: calc(16px / 2) 16px 0 0;
      border: 1px solid #ecebeb;
    }


    const Users = () => {
      const { client } = useChatContext();
      const { channel } = useChannelStateContext();
      const [channelUsers, setChannelUsers] = useState<
        Array<{ name: string; online: boolean }>
      >([]);
      useEffect(() => {
        const updateChannelUsers = (event?: Event) => {
          // test if the updated user is a member of this channel
          if (!event || channel.state.members[event.user!.id] !== undefined) {
            setChannelUsers(
              Object.values(channel.state.members).map((user) => ({
                name: user.user_id!,
                online: !!user.user!.online,
              })),
            );
          }
        };

        updateChannelUsers();

        //
        client.on("user.presence.changed", updateChannelUsers);

        return () => {
          client.off("user.presence.changed", updateChannelUsers);
        };
      }, [client, channel]);

      return (
        <ul className="users-list">
          {channelUsers.map((member) => (
            <li key={member.name}>
              {member.name} - {member.online ? "online" : "offline"}
            </li>
          ))}
        </ul>
      );
    };

With the above addition, `channelUsers` will be updated each time user comes online or goes offline.

[PreviousChannel Search](/chat/docs/sdk/react/guides/customization/channel_search/)[NextMessage List Notifications](/chat/docs/sdk/react/guides/customization/adding_messagelist_notification/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

In this example, we demonstrate how to replace our default image [`Gallery`](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Gallery/Gallery.tsx) component with a custom implementation. The `Gallery` component is a child of `Attachment`, so weâll need to create a custom `Attachment` component as well.

In this example, we are going to use the [`react-image-gallery`](https://www.npmjs.com/package/react-image-gallery) dependency. Many pre-built React image galleries exists, so this demo just shows one possible way to replace the libraryâs default `Gallery` component.

Weâll need to import a few additional modules into our app to access the main component, an item type, and the distributed CSS:


    import ImageGallery, { ReactImageGalleryItem } from "react-image-gallery";
    import "react-image-gallery/styles/css/image-gallery.css";

A custom component will always receive the same props as the libraryâs default. In the case of `Gallery`, the custom component receives an array of image objects to be loaded. Each image object contains an `image_url` key, which references the CDN-hosted URL of the image.

The `ImageGallery` component weâve imported requires an `items` prop. The `items` prop accepts a similar array of image objects, with the `original` key as the only required type. The `original` key references the image URL, similar to the `image_url` key coming into the component via props.

To make the types line up, we manipulate the props array of images slightly, and pass into the `ImageGallery` component.


    const CustomGallery: React.FC<GalleryProps> = (props) => {
      const { images } = props;

      const updatedImages: ReactImageGalleryItem[] = [];

      Object.values(images).forEach((image) => {
        if (image.image_url) {
          updatedImages.push({ original: image.image_url });
        }
      });

      return <ImageGallery items={updatedImages} />;
    };

In order to render our `CustomGallery` component, we need to supply it as a prop to the [`Attachment`](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Attachment/Attachment.tsx) component. The resulting `CustomAttachment` component is then added to `Channel`, so it can be injected into the `ComponentContext` and consumed within the [Message UI](/chat/docs/sdk/react/components/message-components/message_ui/) component.


    const CustomAttachment: React.FC<AttachmentProps> = (props) => (
      <Attachment {...props} Gallery={CustomGallery} />
    );

    <Channel Attachment={CustomAttachment}>
      {/* children of Channel component */}
    </Channel>;

Now that each individual piece has been constructed, we can assemble all of the snippets into the final code example.

import ImageGallery, { ReactImageGalleryItem } from "react-image-gallery";
    import "react-image-gallery/styles/css/image-gallery.css";

    const CustomGallery: React.FC<GalleryProps> = (props) => {
      const { images } = props;

      const updatedImages: ReactImageGalleryItem[] = [];

      Object.values(images).forEach((image) => {
        if (image.image_url) {
          updatedImages.push({ original: image.image_url });
        }
      });

      return <ImageGallery items={updatedImages} />;
    };

    const CustomAttachment: React.FC<AttachmentProps> = (props) => {
      return <Attachment {...props} Gallery={CustomGallery} />;
    };

    const App = () => (
      <Chat client={client}>
        <ChannelList />
        <Channel Attachment={CustomAttachment}>
          <Window>
            <ChannelHeader />
            <MessageList />
            <MessageInput />
          </Window>
          <Thread />
        </Channel>
      </Chat>
    );

![Gallery](/_astro/Gallery.uRzuSRJ9_1CG2T8.webp)

[PreviousAttachment Actions](/chat/docs/sdk/react/guides/theming/actions/attachment_actions/)[NextGeolocation Attachment & Live Location Sharing](/chat/docs/sdk/react/guides/theming/actions/geolocation_attachment/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

In this example, we demonstrate how to use the method `addNotification` pulled from the [`ChannelActionContext`](/chat/docs/sdk/react/components/contexts/channel_action_context#addNotification/) in order to add a custom notification message to the `MessageList` at our desired time specification.

This method receives two arguments: text and type. The text parameter is the notification text, and the type argument is of type string and is either âsuccessâ or âerrorâ. The type determines the style added. These messages are temporary in the list and are removed after five seconds.

This method is used extensively in the library by handler functions to notify of success or failure and are usually used in conjunction with JavaScript event listeners or API event listeners.


    const addNotification = (text: string, type: 'success' | 'error') => {
      /// the rest of the method established in `Channel`
    };

In this quick implementation we will listen for the âmessage.updatedâ client event and add our custom notification when this happens. Editing or pinning a message will cause this event to occur.

Since `addNotification` is drawn from the `ChannelActionContext`, we must create an inner component that is a child of `Channel` and call the `useChannelActionContext` custom hook.

const ChannelInner = () => {
      const { addNotification } = useChannelActionContext();
      const { channel } = useChannelStateContext();

      useEffect(() => {
        const clickToAddNotification = () => {
          addNotification("A message has been edited!", "success");
        };

        channel.on("message.updated", clickToAddNotification);

        return () => {
          channel.off("message.updated", clickToAddNotification);
        };
      }, [addNotification, channel]);

      return (
        <>
          <Window>
            <ChannelHeader />
            <MessageList />
            <MessageInput />
          </Window>
          <Thread />
        </>
      );
    };

    const App = () => (
      <Chat client={chatClient}>
        <ChannelList />
        <Channel>
          <ChannelInner />
        </Channel>
      </Chat>
    );

![Custom Notification in the Message List](/_astro/CustomNotification.DzZhcQH7_Z1zRLQr.webp)

[PreviousChannel Members and Online Status](/chat/docs/sdk/react/guides/channel-user-lists/)[NextConnection Status](/chat/docs/sdk/react/guides/theming/connection_status/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

As of the version 10.0.0, users can add app menu into the `SearchBar`. In case you would like to display menu button next to the search input, you can do that by adding [`AppMenu` component](/chat/docs/sdk/react/components/utility-components/channel_search#appmenu/) to the `ChannelSearch` props. The display of `AppMenu` is then toggled by clicking on the menu button. `AppMenu` can be rendered as a drop-down or even a modal. In our example we will render a drop-down menu.

The SDK does not provide any default `AppMenu` component and so you will have to write your CSS for it to be styled correctly.


    import React, { useCallback } from "react";
    import type { AppMenuProps } from "stream-chat-react";

    import "./AppMenu.scss";

    export const AppMenu = ({ close }: AppMenuProps) => {
      const handleSelect = useCallback(() => {
        // custom logic...
        close?.();
      }, [close]);

      return (
        <div className="app-menu__container">
          <ul className="app-menu__item-list">
            <li className="app-menu__item" onClick={handleSelect}>
              Profile
            </li>
            <li className="app-menu__item" onClick={handleSelect}>
              New Group
            </li>
            <li className="app-menu__item" onClick={handleSelect}>
              Sign Out
            </li>
          </ul>
        </div>
      );
    };


    .str-chat__channel-search-bar-button.str-chat__channel-search-bar-button--menu {
      position: relative;
    }

    .app-menu {
      &__container {
        position: absolute;
        top: 50px;
        left: 10px;
        background-color: white;
        border-radius: 5px;
        box-shadow: 0 0 8px var(--str-chat__box-shadow-color);
      }

      &__item-list {
        list-style: none;
        margin: 0;
        padding: 0;
      }

      &__item {
        list-style: none;
        margin: 0;
        padding: 0.5rem 1rem;

        &:hover {
          background-color: lightgrey;
          cursor: pointer;
        }
      }
    }


    import { AppMenu } from "./components/AppMenu";

    const App = () => (
      <Chat client={chatClient}>
        <ChannelList additionalChannelSearchProps={{ AppMenu }} showChannelSearch />
        <Channel>
          <Window>
            <ChannelHeader />
            <MessageList />
            <MessageInput />
          </Window>
          <Thread />
        </Channel>
      </Chat>
    );

[PreviousEmoji Picker](/chat/docs/sdk/react/guides/customization/emoji_picker/)[NextChannel Header](/chat/docs/sdk/react/guides/customization/channel_header/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

This article presents the API the integrators can use to toggle display dialogs in their UIs. The default components that are displayed as dialogs are:

  * `ReactionSelector` \- allows users to post reactions / emojis to a message
  * `MessageActionsBox` \- allows user to select from a list of permitted message actions

The dialog management following this guide is enabled within `MessageList` and `VirtualizedMessageList`.

There are two actors in the play. The first one is the component that requests the dialog to be closed or open and the other is the component that renders the dialog. We will start with demonstrating how to properly render a component in a dialog.

Component we want to be rendered as a floating dialog should be wrapped inside `DialogAnchor`:


    import React, { ElementRef, useRef } from "react";
    import { DialogAnchor } from "stream-chat-react";

    import { ComponentToDisplayOnDialog } from "./ComponentToDisplayOnDialog";
    import { generateUniqueId } from "./generateUniqueId";

    const Container = () => {
      // DialogAnchor needs a reference to the element that will toggle the open state. Based on this reference the dialog positioning is calculated
      const buttonRef = useRef<ElementRef<"button">>(null);
      // providing the dialog is necessary for the dialog to be retrieved from anywhere in the DialogManagerProviderContext
      const dialogId = generateUniqueId();

      return (
        <>
          <DialogAnchor
            id={dialogId}
            placement="top"
            referenceElement={buttonRef.current}
            trapFocus
          >
            <ComponentToDisplayOnDialog />
          </DialogAnchor>
        </>
      );
    };

The dialog display is controlled via Dialog API. You can access the API via `useDialog()` hook.


    import React, { ElementRef, useRef } from "react";
    import { DialogAnchor, useDialog, useDialogIsOpen } from "stream-chat-react";

    import { ComponentToDisplayOnDialog } from "./ComponentToDisplayOnDialog";
    import { generateUniqueId } from "./generateUniqueId";

    const Container = () => {
      const buttonRef = useRef<ElementRef<"button">>(null);
      const dialogId = generateUniqueId();
      // access the dialog controller which provides the dialog API
      const dialog = useDialog({ id: dialogId });
      // subscribe to dialog open state changes
      const dialogIsOpen = useDialogIsOpen(dialogId);

      return (
        <>
          <DialogAnchor
            id={dialogId}
            placement="top"
            referenceElement={buttonRef.current}
            trapFocus
          >
            <ComponentToDisplayOnDialog />
          </DialogAnchor>
          <button
            aria-expanded={dialogIsOpen}
            onClick={() => dialog.toggle()}
            ref={buttonRef}
          >
            Toggle
          </button>
        </>
      );
    };

Dialog can be controlled via `Dialog` object retrieved using `useDialog()` hook. The hook returns an object with the following API:

  * `dialog.open()` \- opens the dialog
  * `dialog.close()` \- closes the dialog
  * `dialog.toggle()` \- toggles the dialog open state. Accepts boolean argument `closeAll`. If enabled closes any other dialog that would be open.
  * `dialog.remove()` \- removes the dialog object reference from the state (primarily for cleanup purposes)

Every `Dialog` object carries its own `id` and `isOpen` flag.

There are the following utility hooks that can be used to subscribe to state changes or access a given dialog:

  * `useDialogIsOpen(id: string)` \- allows to observe the open state of a particular `Dialog` instance
  * `useDialog({ id }: GetOrCreateDialogParams)` \- retrieves a dialog object that exposes API to manage it
  * `useOpenedDialogCount()` \- allows to observe changes in the open dialog count

Those who would like to render dialogs outside the `MessageList` and `VirtualizedMessageList`, will need to create a dialog management context using `DialogManagerProvider`.


    import { DialogManagerProvider } from "stream-chat-react";

    const Container = () => {
      return (
        <DialogManagerProvider id="custom-dialog-manager-id"></DialogManagerProvider>
      );
    };

Now the children of `DialogAnchor` will be anchored to the parent `DialogManagerProvider`.

[PreviousCustom Threads View](/chat/docs/sdk/react/guides/custom-threads-view/)[NextBlocking Users](/chat/docs/sdk/react/guides/blocking-users/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

In this section we will focus on how to customize attachment previews display in `MessageInput` component. The attachment previews are rendered by [`AttachmentPreviewList` component](/chat/docs/sdk/react/components/message-input-components/ui_components#attachmentpreviewlist/).

The default attachment types recognized by `AttachmentPreviewList` are:

  * `audio`
  * `video`
  * `image`
  * `voiceRecording`
  * `file`

If the attachment object has property `og_scrape_url` or `title_link`, then it is rendered by `LinkPreviewList` component and not `AttachmentPreviewList`.

To customize attachment previews we need to override `AttachmentsPreviewList` component.


    import { VideoAttachmentPreview } from "./AttachmentPreviews";

    const CustomAttachmentPreviewList = () => (
      <AttachmentPreviewList VideoAttachmentPreview={VideoAttachmentPreview} />
    );

And pass it to `Channel` component.


    <Channel AttachmentPreviewList={CustomAttachmentPreviewList} />

We can customize the following preview components:

  * `AudioAttachmentPreview`
  * `FileAttachmentPreview`
  * `ImageAttachmentPreview`
  * `UnsupportedAttachmentPreview`
  * `VideoAttachmentPreview`
  * `VoiceRecordingPreview`

It is possible to add custom attachments (objects) to composed messages via [`upsertAttachments` function](/chat/docs/sdk/react/components/contexts/message_input_context/#upsertattachments/) provided by `MessageInputContext`.

The custom attachments are not recognized by `AttachmentPreviewList` component and therefore rendered via `UnsupportedAttachmentPreview` component within `AttachmentPreviewList`. The component `UnsupportedAttachmentPreview` can be customized and handle all the custom attachment objects added to the message attachments.


    import { GeolocationPreview } from "./GeolocationAttachmentPreview";
    import type { UnsupportedAttachmentPreviewProps } from "stream-chat-react";

    const CustomAttachmentsPreview = (props: UnsupportedAttachmentPreviewProps) => {
      const { attachment } = props;
      if (attachment.type === "geolocation") {
        return <GeolocationPreview {...props} />;
      }
      // more conditions follow...
    };

The custom component is then passed to custom `AttachmentsPreviewList` component which purpose is just to specify the custom `UnsupportedAttachmentPreview` component.


    import { CustomAttachmentsPreview } from "./AttachmentPreviewList";
    const CustomAttachmentPreviewList = () => (
      <AttachmentPreviewList
        UnsupportedAttachmentPreview={CustomAttachmentsPreview}
      />
    );


    <Channel AttachmentPreviewList={CustomAttachmentPreviewList} />

[PreviousLink Previews in Message Input](/chat/docs/sdk/react/guides/customization/link-previews/)[NextAutocomplete Suggestions](/chat/docs/sdk/react/guides/customization/suggestion_list/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

The Stream Chat React component library uses the [`i18next`](https://www.npmjs.com/package/i18next) dependency to create a [`Streami18n`](https://github.com/GetStream/stream-chat-react/blob/master/src/i18n/Streami18n.ts) class constructor that handles language translation of our UI components. The Stream Chat API also supports automatic translation of chat messages, [learn more](/chat/docs/react/translation/).

The library provides built-in translations for the following languages:

  1. [English](https://github.com/GetStream/stream-chat-react/blob/master/src/i18n/en.json) (en) - default
  2. [Dutch](https://github.com/GetStream/stream-chat-react/blob/master/src/i18n/nl.json) (nl)
  3. [French](https://github.com/GetStream/stream-chat-react/blob/master/src/i18n/fr.json) (fr)
  4. [German](https://github.com/GetStream/stream-chat-react/blob/master/src/i18n/de.json) (de)
  5. [Hindi](https://github.com/GetStream/stream-chat-react/blob/master/src/i18n/hi.json) (hi)
  6. [Italian](https://github.com/GetStream/stream-chat-react/blob/master/src/i18n/it.json) (it)
  7. [Japanese](https://github.com/GetStream/stream-chat-react/blob/master/src/i18n/ja.json) (ja)
  8. [Korean](https://github.com/GetStream/stream-chat-react/blob/master/src/i18n/ko.json) (ko)
  9. [Portuguese](https://github.com/GetStream/stream-chat-react/blob/master/src/i18n/pt.json) (pt)
  10. [Russian](https://github.com/GetStream/stream-chat-react/blob/master/src/i18n/ru.json) (ru)
  11. [Spanish](https://github.com/GetStream/stream-chat-react/blob/master/src/i18n/es.json) (es)
  12. [Turkish](https://github.com/GetStream/stream-chat-react/blob/master/src/i18n/tr.json) (tr)

If you wish to change the default language in your app without initiating an instance of `Streami18n`, pass the `defaultLanguage` prop to the `Chat` component on load of your application. The below code snippet will change the default language from English to Italian.


    const defaultLanguage = "it";

    <Chat client={client} defaultLanguage={defaultLanguage}>
      ...
    </Chat>;

The following screenshots show the state of the UI components in the app before and after setting the `defaultLanguage` to Italian.

**Default language not specified:**

![Localization1](/_astro/Localization1.DFa-TLki_1kJjg3.webp)

**Default language set to Italian:**

![Localization2](/_astro/Localization2.BG6Vok4y_Brclq.webp)

The `defaultLanguage` prop is only applicable as a fallback language. If the connected userâs preferred browser language is supported for translation, the component library will preferentially render the browser language. Meaning, if `defaultLanguage` was set to Italian but the userâs preferred browser language was Spanish, the component library would render Spanish.

The library supports two different methods for manually setting the language of the connected user and automatically translates all text built into the UI components. The simpler and less customizable way is to set the `language` value in the `connectUser` method on mount of the chat application.


    client.connectUser({ id: userId, language: "es" }, userToken);

If [auto translation](/chat/docs/react/translation/#automatic-translation/) of messages is enabled in the application, setting the `language` value on `connectUser` will result in the auto translation of all message text. If this behavior is undesired, follow the steps below to create a translation instance.

Additionally, you can create a class instance of `Streami18n` and pass as a prop into the `Chat` component. The below example changes the current userâs language to Spanish.


    const i18nInstance = new Streami18n({ language: "es" });

    <Chat client={client} i18nInstance={i18nInstance}>
      ...
    </Chat>;

Taking it one step further, the below example shows how to override the default text values built into the components.


    const i18nInstance = new Streami18n({
      language: "es",
      translationsForLanguage: {
        "Nothing yet...": "Nada!", // default is 'Nada aun...'
      },
    });

    <Chat client={client} i18nInstance={i18nInstance}>
      ...
    </Chat>;

If you wish to completely override one of our language files, provide your custom translations via the `translationsForLanguage` key. Your custom language file must include all of the keys of the [default file](https://github.com/GetStream/stream-chat-react/blob/master/src/i18n/es.json).


    import esUpdated from "path/to/esUpdated.json";

    const i18nInstance = new Streami18n({
      language: "es",
      translationsForLanguage: esUpdated,
    });

    <Chat client={client} i18nInstance={i18nInstance}>
      ...
    </Chat>;

If the language for the connected user is not manually set by passing a `Streami18n` object to the `Chat` component, the component library detects the userâs default browser language. If the component library has translation support for the detected browser language, either through the languages provided or by a custom added language (described below), the connected userâs language is automatically set to this value. If the browser language is not supported for translation, the library defaults to English.

All [available translations](https://github.com/GetStream/stream-chat-react/tree/master/src/i18n) are found on GitHub and the JSON objects can be imported from the library.

`import { esTranslations } from 'stream-chat-react';`

ARIA labels that are used for interactive elements are also subject to localization. Translation keys for ARIA labels are prefixed by `aria/`:


    import { useTranslationContext } from "stream-chat-react";

    const Component = () => {
      const { t } = useTranslationContext();
      return (
        <button type="button" aria-label={t("aria/Send")}>
          ð¨
        </button>
      );
    };

To override the default translations, add an `aria`-prefixed key to the `translationsForLanguage` object:


    const i18nInstance = new Streami18n({
      language: "en",
      translationsForLanguage: {
        "aria/Send": "Send Message",
      },
    });

    <Chat client={client} i18nInstance={i18nInstance}>
      {/* ... */}
    </Chat>;

In the following example, we will demonstrate how to add translation support for an additional language not currently supported by the component library. We will add translations for Simplified Chinese, which uses language code `zh`, by following these steps:

  1. Create a JSON file in your project (ex: `zh.json` if creating a translation file for Simplified Chinese)
  2. Copy the content of an existing [translation file](https://github.com/GetStream/stream-chat-react/blob/master/src/i18n/en.json)
  3. Change the values to your desired translations
  4. Register the translation file and set the new language
  5. Pass as a prop to the `Chat` component

The `setLanguage` method on the class instance of `Streami18n` is asynchronous, so itâs response needs to be awaited before the language translations can be updated.

We can initialize the instance dynamically:


    import zhTranslation from "path/to/zh.json";

    const i18nInstance = new Streami18n();

    const App = () => {
      const [languageLoaded, setLanguageLoaded] = useState(false);

      useEffect(() => {
        const loadLanguage = async () => {
          i18nInstance.registerTranslation("zh", zhTranslations);
          await i18nInstance.setLanguage("zh");
          setLanguageLoaded(true);
        };

        loadLanguage();
      }, []);

      if (!languageLoaded) return null;

      return (
        <Chat client={client} i18nInstance={i18nInstance}>
          ...
        </Chat>
      );
    };

Or we can have a pre-configured `Streami18n` instance:


    import zhTranslation from 'path/to/zh.json';

    const i18nInstance = new Streami18n({
      language: 'zh',
      translationsForLanguage: zhTranslations,
      dayjsLocaleConfigForLanguage: {
        // see the next section about Datetime translations
        months: [...],
        monthsShort: [...],
        calendar: {
          sameDay: ...'
        }
      }
    });

    const App = () => {
      return (
        <Chat client={client} i18nInstance={i18nInstance}>
          ...
        </Chat>
      );
    };

The SDK components use [`Dayjs`](https://day.js.org/en/) internally by default to format dates and times. It has [locale support](https://day.js.org/docs/en/i18n/i18n) being a lightweight alternative to `Momentjs` with the same modern API. `Dayjs` provides [locale config for plenty of languages](https://github.com/iamkun/dayjs/tree/dev/src/locale).

You can either provide the `Dayjs` locale config while registering language with `Streami18n` (either via constructor or `registerTranslation()`) or you can provide your own `Dayjs` or `Momentjs` instance to `Streami18n` constructor, which will be then used internally (using the language locale) in components.

The `dayjsLocaleConfigForLanguage` object is a union of configuration objects for [`Dayjs` calendar plugin](https://day.js.org/docs/en/plugin/calendar) and `Dayjs` locale configuration(examples are available in [`Dayjs` default locale configurations](https://github.com/iamkun/dayjs/tree/dev/src/locale))

  1. Via language registration



    const i18n = new Streami18n({
     language: 'nl',
     dayjsLocaleConfigForLanguage: {
       months: [...],
       monthsShort: [...],
       calendar: {
         sameDay: ...'
       }
     }
    });

Similarly, you can add locale config for `Momentjs` while registering translation via `registerTranslation` function.


    const i18n = new Streami18n();

    i18n.registerTranslation(
     'mr',
     {
       'Nothing yet...': 'à¤à¤¾à¤¹à¥à¤¹à¥ à¤¨à¤¾à¤¹à¥  ...',
       '{{ firstUser }} and {{ secondUser }} are typing...': '{{ firstUser }} à¤à¤£à¤¿ {{ secondUser }} à¤à¥à¤ªà¥ à¤à¤°à¤¤ à¤à¤¹à¥à¤¤ ',
     },
     {
       months: [...],
       monthsShort: [...],
       calendar: {
         sameDay: ...'
       }
     }
    );

  2. Provide your own `Momentjs` object



    import 'moment/locale/nl';
    import 'moment/locale/it';
    // or if you want to include all locales
    import 'moment/min/locales';

    import Moment from moment

    const i18n = new Streami18n({
     language: 'nl',
     DateTimeParser: Moment
    })

  3. Provide your own Dayjs object



    import Dayjs from "dayjs";

    import "dayjs/locale/nl";
    import "dayjs/locale/it";
    // or if you want to include all locales
    import "dayjs/min/locales";

    const i18n = new Streami18n({
      language: "nl",
      DateTimeParser: Dayjs,
    });

If you would like to stick with english language for dates and times in Stream components, you can set `disableDateTimeTranslations` to true.

To display date and time in different than machineâs local timezone, provide the `timezone` parameter to the `Streami18n` constructor. The `timezone` value has to be a [valid timezone identifier string](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones). If no `timezone` parameter is provided, then the machineâs local timezone is applied.


    import { Streami18n } from "stream-chat-react";

    const streamI18n = new Streami18n({ timezone: "Europe/Prague" });

If you are using `moment` as your datetime parser engine and want to start using timezone-located datetime strings, then we recommend to use `moment-timezone` instead of `moment` package. Moment Timezone will automatically load and extend the moment module, then return the modified instance. This will also prevent multiple versions of `moment` being installed in a project.


    import type momentTimezone from "moment-timezone";
    import { Streami18n } from "stream-chat-react";

    const i18n = new Streami18n({
      DateTimeParser: momentTimezone,
      timezone: "Europe/Prague",
    });

Stream Chat provide the ability to run usersâ messages through automatic translation. While machine translation is never perfect it can enable two users to communicate with each other without speaking the same language. For more information, see the full guide to [adding automatic translation](/chat/docs/react/translation/).

Searching for users when utilizing the â@â mentions command supports diacritics and, optionally, transliteration using [Transliterate](https://github.com/sindresorhus/transliterate). To add transliteration to your search functionality with the external Transliterate library, use the `useMentionsTransliteration` prop in the `MessageInput`. This library is dynamically imported if the prop is true. Diacritics support is available by default.

![Diacritics](/_astro/Diacritics.1NSbfHL-_ZN3Cfj.webp)

![Transliteration](/_astro/Transliteration.h7oQZlx0_1IMgls.webp)

The `Streami18n` class wraps [`i18next`](https://www.npmjs.com/package/i18next) and provides a set of values and methods.

Option| Description| Type| Default
---|---|---|---
DateTimeParser| custom date time parser| function| Day.js
dayjsLocaleConfigForLanguage| internal Day.js [config object](https://github.com/iamkun/dayjs/tree/dev/src/locale) and [calendar locale config object](https://day.js.org/docs/en/plugin/calendar)| object| âenConfigâ
debug| enables i18n debug mode| boolean| false
disableDateTimeTranslations| disables translation of date times| boolean| false
language| connected userâs language| string| âenâ
logger| logs warnings/errors| function| () => {}
parseMissingKeyHandler| function executed, when a key is not found among the translations| function| (key: string, defaultValue?: string) => string;
translationsForLanguage| overrides existing component text| object| {}
timezone| valid timezone identifier string (<https://en.wikipedia.org/wiki/List_of_tz_database_time_zones>)| function| Day.js

The default implementation returns the default value provided to the translator function, for example the component below will display string `'hello'` if the key `'some-key'` is not found among the translations for a given language:


    import { useTranslationContext } from "stream-chat-react";

    const Component = () => {
      const { t } = useTranslationContext("useCommandTrigger");

      return <div>{t("some-key", { defaultValue: "hello" })}</div>;
    };

The custom handler may log missing key warnings to the console in the development environment:


    import { Streami18n, Streami18nOptions } from "stream-chat-react";

    const parseMissingKeyHandler: Streami18nOptions["parseMissingKeyHandler"] = (
      key: string,
      defaultValue?: string,
    ) => {
      console.warn(`Streami18n: Missing translation for key: ${key}`);
      return defaultValue ?? key;
    };

    const i18nInstance = new Streami18n({ parseMissingKeyHandler });

Returns an array of language code strings corresponding to available languages.


    const availableLanguages = streami18n.getAvailableLanguages();

Returns the instance of `i18next` used within the `Streami18n` instance.


    const i18nInstance = streami18n.geti18Instance();

Returns the current translation dictionaries for all languages.


    const translations = streami18n.getTranslations();

Asynchronous function that returns the current translator functions.


    const { t, tDateTimeParser } = await streami18n.getTranslators();

Allows you to register a custom translation, which overrides an existing translation for the given language. The third parameter, which is an optional Day.js locale, is structured the same as [dayjsLocaleConfigForLanguage](https://github.com/iamkun/dayjs/tree/dev/src/locale).

Review the [`enTranslations`](https://github.com/GetStream/stream-chat-react/blob/master/src/i18n/en.json) JSON file exported from `stream-chat-react` for a current list of translation keys.


    streami18n.registerTranslation("es", {
      "Nothing yet...": "Nada!",
    });

Name| Type| Required
---|---|---
language| string| âï¸
translation| object| âï¸
customDayjsLocale| object|

Asynchronous function that changes the current language and returns a new translation function. If not initialized, `undefined` will be returned. If the language fails to update, the current translation function will be returned.


    const t = await streami18n.setLanguage("nl");

Name| Type| Required
---|---|---
language| string| âï¸

[PreviousLivestream Best Practices](/chat/docs/sdk/react/guides/livestream-setup/)[NextTypeScript & Custom Data Types](/chat/docs/sdk/react/guides/typescript_and_custom_data_types/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

The release v10 brings some new features as well as some breaking changes to the users. The main focus was to support [the next version of theming V2](/chat/docs/sdk/react/theming/themingv2/) brought with `@stream-io/stream-chat-css@3.0.0`. It lead to addition resp. removal of some HTML elements in few components. This may invalidate some of your CSS selectors. Also, some components marked as deprecated for a longer period of time have been removed.

We have tried to introduce as few breaking changes as possible. We have not removed classes but rather added new ones that are exclusively used with the theming V2 stylesheet. Also, where possible, V1 and V2 components have been introduced for backwards compatibility (the V1 components are used unless opted into theme version 2).

Your upgrade strategy may differ based on whether you would like to make use of the new theming V2 or just do the necessary adjustments.

The following components have been removed from our code base:

  1. MessageCommerce
  2. MessageLivestream
  3. MessageTeam

We have renamed the prop `DropdownContainer` to `SearchResultsList` to better reflect the purpose of the component. The search results do not have to be shown in a drop-down container.

Also, redundant `setResultsOpen` is not part of the type `ChannelSearchFunctionParams` anymore. This has impact on `onSelectResult` and `searchFunction` props

The `ChannelPreviewMessenger` component has received adjustments in markup - a new element to display the unread count has been added. You can target it with the class `str-chat__channel-preview-unread-badge` for further styling.

The message list loading indicator is now wrapped in a div with class `str-chat__list__loading` so that you can target it better in your stylesheets.

You can now customize `LoadingIndicator` component through the `Channel` props.

There is a new prop `head` that allows you to render a custom React Element at top of the list. In the SDK it is used by the `Thread` component to display parent message.

The default message component in virtualized Thread is now `MessageSimple` and not `FixedHeightMessage`. The `FixedHeightMessage` component has been deprecated and will be removed in the next release v11.

Moreover, we have added a new prop `groupStyles` with the same purpose as in [non-virtualized `MessageList`](/chat/docs/sdk/react/components/core-components/message_list#groupstyles/).

Thread is actually a message list, but it has its own specifics. It always displays at least one message and that is the original parent message. With the release of the SDK v10, the parent message scroll behavior was unified. Now the parent message is part of the scroll container in both `MessageList` as well as `VirtualizedMessageList`. The part rendering the parent message and its separator from the rest of the replies is contained in a new component [ThreadHead](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Thread/ThreadHead.tsx). You can provide your own custom implementation through a `Channel` prop `ThreadHead`. You can even override the separator by passing its substitute to the `Channel` prop `ThreadStart`.

On the other hand, the [ThreadHeader](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Thread/ThreadHeader.tsx) component has experience markup changes. The `div` elements with classes `str-chat__thread-header-title` and `str-chat__thread-header-subtitle` have replaced elements `strong` and `small` in the header details. Thread now accepts two new props `overrideImage` (expects the image URL) and `overrideTitle` (expects custom title). Otherwise, the image and title are be extracted from the active channel object.

The other change (fix) brought with the release is that the thread is scrolled to the bottom when open.

The default component used to represent empty state in message list or channel list as been enriched with an SVG image:

![Image of empty channel list](/_astro/theme-v2-empty-channel-list.CKD4N96d_ZOG8hl.webp)

![Image of empty message list](/_astro/theme-v2-empty-message-list.DaUS82qc_ZmlIIL.webp)

We have added a new component [ScrollToBottomButton](https://github.com/GetStream/stream-chat-react/blob/master/src/components/MessageList/ScrollToBottomButton.tsx). It allows you to notify users about new messages by displaying the unread count of messages in the active message list. Besides that it also serves as a scroll-to-bottom button when a user scrolls up. The threshold that determines, whether the button should be displayed can be set via `MessageList` (prop `scrolledUpThreshold`). Default value is 200px. The `VirtualizedMessageList` works with the same threshold, but not configurable. You can start using this component instead of the older version by passing it to `Channel` prop `MessageNotification`.

![Image of a new component ScrollToBottomButton](/_astro/theme-v2-scroll-to-bottom-button-theme-v1.DewwHAwO_Z2cqTWa.webp)

Even if you do not upgrade to theme V2, you should be aware that the message text is now grouped with message attachments into one `div` with class `str-chat__message-bubble`.

Attachments are now rendered in a fixed order from top to bottom:

  1. card,
  2. gallery
  3. image
  4. media
  5. audio
  6. file

Another potentially breaking change is that the `Card` is not the default component to be rendered. If the provided `attachment` object is not identified as any of the above listed attachment types, its content is not rendered. The `Card` component is intended for display of scraped content. Remember that the attachment is now considered to carry scraped content only if it has `og_scrape_url` or `title_link` attributes. This is in order to comply with the chat API requirements.

The attachment list is newly rendered within a `div` with class `str-chat__attachment-list`.

Previous to v10 of the SDK, we used render functions to return React Elements. The render functions are now deprecated and [AttachmentContainer](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Attachment/AttachmentContainer.tsx) components are used instead. This allows you to make use of all the React features while rendering different attachment types.

All the image and video attachments are now expandable to the full-screen mode. This applies to scraped media as well.

**Image attachments**

Besides that, you can expect the SVG images to be rendered on the chessboard background now:

![SVG attachment rendering](/_astro/theme-v2-svg-attachment.BVT7xxmN_Z1FQ8wN.webp)

The `Image` component now accepts new `dimensions` prop - object containing the image `height` and `width`.

Multiple images uploaded in a message are rendered within a gallery. You can newly provide your custom `ModalGallery` component through a prop to `Channel` component. `ModalGallery` is passed the image array and the index of the image to be displayed.

The `Emoji` in the `ReactionSelector` has been wrapped in a `span` element with class `str-chat__message-reaction-emoji`. It allows us to control the height and alignment of the icon. To highlight the already selected emojis you can use newly added class `str-chat__message-reactions-option-selected`.

The `ReactionList` now populates emoji tooltips with aggregated list of usernames who have already reacted with the given reaction.

We have introduced a new prop `own_reactions` to both `ReactionSelector` and `ReactionList` that allows us to determine, whether the user has already reacted with a given reaction.

The `MessageInputSmall` component has been now been made redundant and was deprecated. We encourage the use of `MessageInputFlat` UI component only.

The majority of new features introduced with this release is bound to the use of the new theming V2. The list is as follows:

The theme should be set via `Chat` component prop `theme`. Internally it is placed on

  1. the container wrapping the channel search and channel list and
  2. the container wrapping the active channel UI

The new theming V2 provides default styles if no theme class is set. These styles are equivalent to those if class `str-chat__theme-light` is passed to the `theme` prop. If you would like to get the dark theme, you should pass `str-chat__theme-dark` instead.

The `ChannelSearch` component has been revamped and upgraded. It now provides richer functionality and wider possibilities of customization for those, who opt into use of theme V2. The component capabilities are described in [ChannelSearch documentation](/chat/docs/sdk/react/components/utility-components/channel_search/) in more depth

We started to use component `ChannelPreview` to display search results. That is why the new prop `onSelect` has been added to its API. You can customize what happens, when the search result is selected.

We have wrapped it in a new div with class `str-chat__main-panel-inner` for those using theme version 2.

The markup of component rendering the message with its attachments, reactions, avatar etc. has been changed specifically for theme V2. The message metadata (author, timestamp), reply button, have been moved from `str-chat__message-inner` one level higher to the message root div.

The API of the `Attachment` component or components that render a specific content type has not changed, you should be able to upgrade seamlessly. What you have to however expect is changed markup.

**File attachments**

The file attachment component used for theming V2 has changed markup compared to the V2. Also, a new set of file attachment icons has been applied:

![Image of standard file attachment icon set](/_astro/file-attachment-icon-set-v2-standard.BQdybHxn_S9stO.webp)

![Image of alternative file attachment icon set](/_astro/file-attachment-icon-set-v2-alt.BwB88Gu7_CaQQA.webp)

Our `FileAttachment` component for theming V2 uses the standard icon set. You can however use the alternative set in your custom components:

So instead of:


    <FileIcon
      className="str-chat__file-icon"
      mimeType={attachment.mime_type}
      version={"2"}
    />

You can do:


    <FileIcon
      className="str-chat__file-icon"
      mimeType={attachment.mime_type}
      version={"2"}
      type={"alt"}
    />

Besides that, the file attachment widgets newly display a download button (a download link).

**Audio attachments**

Audio attachments are rendered with a new component (with different markup) adapted to the theming V2 styles.

**Scraped attachments (Card)**

Cards now display scraped audio, video or image content:

![Image of audio card with theme V2](/_astro/theme-v2-card-audio.C6DF3jKo_1gY23C.webp)

![Image of the video attachment card for the theme V2](/_astro/theme-v2-card-video.CJaW1q9d_Z1NKh20.webp)

![Image of the default attachment card for theme V2](/_astro/theme-v2-card-image.D5LT-zes_1XjwaG.webp)

`Tooltip` is now being rendered with the help of the [`PopperJS`](https://popper.js.org/) to keep the content of the tooltip in the viewport longer when the tooltip origin (could be a button) is scrolled out of the viewport bounds.

When opting to theme V2, the integrator gets revamped message input UI component where the markup differs completely from the original.

`QuotedMessagePreviewHeader` has been extracted from the `QuotedMessagePreview` component and moved directly to the `MessageInputFlat` due to positioning reasons. Users will have the ability to replace this component with custom component in the future (see [#1764](https://github.com/GetStream/stream-chat-react/issues/1764)).

`EmojiPicker` is now being rendered with the help of the [`PopperJS`](https://popper.js.org/) to keep the picker in the viewport longer when the picker origin (button) is scrolled out of the viewport bounds.

`SendButton` is now disabled by default if there isnât any content to be submitted, i.e. there are no attachments or no text content.

Default `UploadsPreview` has been renamed to [AttachmentPreviewList](https://github.com/GetStream/stream-chat-react/blob/master/src/components/MessageInput/AttachmentPreviewList.tsx) and is no longer imported from the package `react-file-utils` but instead now lives within `stream-chat-react` code-base. Users will have the ability to replace this component with custom component in the future (see [#1299](https://github.com/GetStream/stream-chat-react/issues/1299)).

[PreviousUpgrade to v11](/chat/docs/sdk/react/release-guides/upgrade-to-v11/)[NextTroubleshooting](/chat/docs/sdk/react/troubleshooting/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

Message UI is one of the main building blocks of the chat application. Designing proper message UI is no easy feat and thatâs why our SDK comes with a pre-built component ([`MessageSimple`](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Message/MessageSimple.tsx)) which is packed with functionality and is easy to customize through [our CSS variables](/chat/docs/sdk/react/theming/component-variables/) or component overrides ([`ComponentContext`](/chat/docs/sdk/react/components/contexts/component_context#message/)).

In this guide, weâll build a simplified custom message UI component combining pre-built and other completely custom components.

Letâs begin with the simplest form the message UI can take: rendering the raw message text.


    import { useMessageContext, Channel } from "stream-chat-react";

    const CustomMessageUi = () => {
      const { message } = useMessageContext();

      return <div data-message-id={message.id}>{message.text}</div>;
    };

Message UI and all of its children can access [`MessageContext`](/chat/docs/sdk/react/components/contexts/message_context/) in which itâs wrapped and therefore can call the `useMessageContext` hook accessing all of the message-related information and functions alike.

To see our changes weâll need to pass this component down to either `Channel` or `MessageList` (`VirtualizedMessageList`) components as a `Message` prop.


    <Channel Message={CustomMessageUi}>...</Channel>

![](/_astro/custom-message-ui-0.DknhcWms_VMikv.webp)

You can see that all the messages are now on one side and we have no idea whoâs the message coming from, letâs adjust that with the help of some CSS, and to render the name of the sender weâll need to access `user` property of the `message` object.

Our message will be on the right and the message of the other senders will be on the left side of the screen.

ReactCSS


    import { useMessageContext, Channel } from "stream-chat-react";

    const CustomMessageUi = () => {
      const { isMyMessage, message } = useMessageContext();

      const messageUiClassNames = ["custom-message-ui"];

      if (isMyMessage()) {
        messageUiClassNames.push("custom-message-ui--mine");
      } else {
        messageUiClassNames.push("custom-message-ui--other");
      }

      return (
        <div className={messageUiClassNames.join(" ")} data-message-id={message.id}>
          <strong className="custom-message-ui__name">
            {message.user?.name || message.user?.id}
          </strong>
          <span>{message.text}</span>
        </div>
      );
    };


    .custom-message-ui {
      --cmui-gap-size: 0.5rem;
      --cmui-inline-spacing: 2rem;
      --cmui-block-spacing: 0.5rem;

      display: flex;
      gap: var(--cmui-gap-size);
      padding-inline: var(--cmui-inline-spacing);
      padding-block: var(--cmui-block-spacing);
    }

    .custom-message-ui__name {
      display: flex;
      gap: var(--cmui-gap-size);
    }

    .custom-message-ui--mine .custom-message-ui__name::before {
      content: "<";
    }

    .custom-message-ui--other .custom-message-ui__name::after {
      content: ">";
    }

    .custom-message-ui--mine {
      flex-direction: row-reverse;
      text-align: right;
    }

![](/_astro/custom-message-ui-1.-jcNneKM_Z2miiUV.webp)

Now this already looks way better than the initial version but we can do better - letâs switch from names to avatars using a pre-built [`Avatar`](/chat/docs/sdk/react/components/utility-components/avatar/) component to make the UI slightly friendlier.

ReactCSS


    import { Avatar, useMessageContext, Channel } from "stream-chat-react";

    const CustomMessageUi = () => {
      const { isMyMessage, message } = useMessageContext();

      const messageUiClassNames = ["custom-message-ui"];

      if (isMyMessage()) {
        messageUiClassNames.push("custom-message-ui--mine");
      } else {
        messageUiClassNames.push("custom-message-ui--other");
      }

      return (
        <div className={messageUiClassNames.join(" ")} data-message-id={message.id}>
          <Avatar
            image={message.user?.image}
            name={message.user?.name || message.user?.id}
          />
          <span className="custom-message-ui__text">{message.text}</span>
        </div>
      );
    };


    .custom-message-ui {
      --cmui-gap-size: 0.5rem;
      --cmui-inline-spacing: 2rem;
      --cmui-block-spacing: 0.5rem;

      display: flex;
      gap: var(--cmui-gap-size);
      padding-inline: var(--cmui-inline-spacing);
      padding-block: var(--cmui-block-spacing);
    }

    .custom-message-ui__text {
      display: flex;
      flex-direction: column;
      align-self: center;
    }

    .custom-message-ui--mine {
      flex-direction: row-reverse;
      text-align: right;
    }

![](/_astro/custom-message-ui-2.Lwgrag3y_Z5xuL2.webp)

Our message UI looks pretty good now but what if the text of a message becomes more complex? Letâs say someone sends a link to a site or mentions some other user. In the current state, our UI would display this in plaintext and none of it would be interactive.

![](/_astro/custom-message-ui-3a.C6VhnC6X_Z2tjkwv.webp)

Letâs enhance this behavior by using pre-built [`MessageText`](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Message/MessageText.tsx) which uses [`renderText`](/chat/docs/sdk/react/components/message-components/render-text/) internally and thatâll transform all of our links, mention, and certain Markdown syntax to interactive and neat-looking elements.

Reactcss


    import {
      Avatar,
      MessageText,
      useMessageContext,
      Channel,
    } from "stream-chat-react";

    const CustomMessageUi = () => {
      const { isMyMessage, message } = useMessageContext();

      const messageUiClassNames = ["custom-message-ui"];

      if (isMyMessage()) {
        messageUiClassNames.push("custom-message-ui--mine");
      } else {
        messageUiClassNames.push("custom-message-ui--other");
      }

      return (
        <div className={messageUiClassNames.join(" ")} data-message-id={message.id}>
          <Avatar
            image={message.user?.image}
            name={message.user?.name || message.user?.id}
          />
          <MessageText />
        </div>
      );
    };


    .custom-message-ui {
      --cmui-gap-size: 0.5rem;
      --cmui-inline-spacing: 2rem;
      --cmui-block-spacing: 0.5rem;

      display: flex;
      gap: var(--cmui-gap-size);
      padding-inline: var(--cmui-inline-spacing);
      padding-block: var(--cmui-block-spacing);
    }

    .custom-message-ui--mine {
      flex-direction: row-reverse;
      text-align: right;
    }

    .custom-message-ui .str-chat__message-text p {
      all: unset;
    }

    .custom-message-ui .str-chat__message-text {
      display: flex;
      flex-direction: column;
      align-self: center;
    }

    .custom-message-ui .str-chat__message-mention {
      font-weight: bold;
      color: palevioletred;
      cursor: pointer;
    }

![](/_astro/custom-message-ui-3b.DK7qQD80_nYFaW.webp)

While the mentioned user is being highlighted thereâs no default pointer event attached to the highlighted element, see the [Mentions Actions guide](/chat/docs/sdk/react/guides/theming/actions/mentions_actions/) for more information.

So far weâve covered avatars and proper text rendering but the UI still feels a bit empty. Each message has a lot of extra information which can be beneficial to the end users. Letâs add the creation date, âeditedâ flag, and delivery/read status information to our message UI.

Reactcss


    import {
      Avatar,
      MessageText,
      useMessageContext,
      useChatContext,
      Channel,
    } from "stream-chat-react";

    const statusIconMap = {
      received: "â",
      receivedAndRead: "ðï¸",
      sending: "ð«",
      unknown: "â",
    };

    const CustomMessageUiMetadata = () => {
      const {
        message: {
          created_at: createdAt,
          message_text_updated_at: messageTextUpdatedAt,
          status = "unknown",
        },
        readBy = [],
      } = useMessageContext();
      const { client } = useChatContext();

      const [firstUser] = readBy;

      const receivedAndRead =
        readBy.length > 1 || (firstUser && firstUser.id !== client.user?.id);

      return (
        <div className="custom-message-ui__metadata">
          <div className="custom-message-ui__metadata-created-at">
            {createdAt?.toLocaleString()}
          </div>
          <div className="custom-message-ui__metadata-read-status">
            {receivedAndRead
              ? statusIconMap.receivedAndRead
              : (statusIconMap[status as keyof typeof statusIconMap] ??
                statusIconMap.unknown)}
          </div>
          {messageTextUpdatedAt && (
            <div
              className="custom-message-ui__metadata-edited-status"
              title={messageTextUpdatedAt}
            >
              Edited
            </div>
          )}
        </div>
      );
    };

    const CustomMessageUi = () => {
      const { isMyMessage, message } = useMessageContext();

      const messageUiClassNames = ["custom-message-ui"];

      if (isMyMessage()) {
        messageUiClassNames.push("custom-message-ui--mine");
      } else {
        messageUiClassNames.push("custom-message-ui--other");
      }

      return (
        <div className={messageUiClassNames.join(" ")} data-message-id={message.id}>
          <div className="custom-message-ui__body">
            <Avatar
              image={message.user?.image}
              name={message.user?.name || message.user?.id}
            />
            <MessageText />
          </div>
          <CustomMessageUiMetadata />
        </div>
      );
    };


    .custom-message-ui {
      --cmui-gap-size-md: 0.5rem;
      --cmui-gap-size-sm: 0.2rem;
      --cmui-inline-spacing: 2rem;
      --cmui-block-spacing: 0.5rem;

      display: flex;
      flex-direction: column;
      gap: var(--cmui-gap-size-md);
      padding-inline: var(--cmui-inline-spacing);
      padding-block: var(--cmui-block-spacing);
    }

    .custom-message-ui__body {
      gap: var(--cmui-gap-size-md);
      display: flex;
    }

    .custom-message-ui--mine .custom-message-ui__body {
      flex-direction: row-reverse;
      text-align: right;
    }

    .custom-message-ui__metadata {
      display: flex;
      font-size: x-small;
      align-items: baseline;
    }

    .custom-message-ui__metadata > *:nth-child(even)::after,
    .custom-message-ui__metadata > *:nth-child(even)::before {
      content: "â¢";
      padding-inline: var(--cmui-gap-size-sm);
    }

    .custom-message-ui__metadata > *:last-child::after {
      display: none;
    }

    .custom-message-ui--mine .custom-message-ui__metadata {
      align-self: flex-end;
    }

    .custom-message-ui .str-chat__message-text p {
      all: unset;
    }

    .custom-message-ui .str-chat__message-text {
      display: flex;
      flex-direction: column;
      align-self: center;
    }

    .custom-message-ui .str-chat__message-mention {
      font-weight: bold;
      color: palevioletred;
      cursor: pointer;
    }

![](/_astro/custom-message-ui-4.Cs2MIuzj_DOKLq.webp)

Message grouping is being managed automatically by the SDK and each parent element (which holds our message UI) receives an appropriate class name based on which we can adjust our rules to display metadata elements only when itâs appropriate to make our UI look less busy.


    .custom-message-ui__metadata {
      /* removed-line */
      display: flex;
      /* added-line */
      display: none;
      font-size: x-small;
      align-items: baseline;
    }

    /* added-block-start */
    .str-chat__li--bottom .custom-message-ui__metadata,
    .str-chat__li--single .custom-message-ui__metadata {
      display: flex;
    }
    /* added-block-end */

![](/_astro/custom-message-ui-5.CFXYoN5F_bkKR.webp)

You can utilize [`MessageContext`](/chat/docs/sdk/react/components/contexts/message_context/) properties [`firstOfGroup`](/chat/docs/sdk/react/components/contexts/message_context#firstofgroup/), [`endOfGroup`](/chat/docs/sdk/react/components/contexts/message_context#endofgroup/), and [`groupedByUser`](/chat/docs/sdk/react/components/contexts/message_context#groupedbyuser/) if you use [`VirtualizedMessageList`](/chat/docs/sdk/react/components/core-components/virtualized_list/) for conditional metadata rendering. These properties **are not available** in regular [`MessageList`](/chat/docs/sdk/react/components/core-components/message_list/).

The SDK also comes with [`MessageStatus`](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Message/MessageStatus.tsx) and [`MessageTimestamp`](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Message/MessageTimestamp.tsx) components which you can use to replace our custom-made ones. These components come with some extra logic but essentially provide an almost identical amount of utility for the end users so we wonât be covering the replacement in this guide.

Up to this point weâve covered mostly the presentational part of our message UI and apart from the mentions and links, thereâs not much the end users can interact with. Obviously - the SDK offers so much more so in this section of the guide weâll explain how to add and enable message actions (deleting, replies, pinning, etc.) and reactions.

At the very beginning of this guide, weâve mentioned that [`MessageContext`](/chat/docs/sdk/react/components/contexts/message_context/) provides information **and** functions related to a specific message. So to implement a subset of message actions weâll need to access `handleDelete`, `handlePin`, `handleFlag`, and `handleThread` functions which we can attach to the action buttons of our `CustomMessageUiActions` component.

ReactCSS


    const statusIconMap = {
      received: "â",
      receivedAndRead: "ðï¸",
      sending: "ð«",
      unknown: "â",
    };

    const CustomMessageUiActions = () => {
      const {
        handleDelete,
        handleFlag,
        handleOpenThread,
        handlePin,
        message,
        threadList,
      } = useMessageContext();

      if (threadList) return null;

      return (
        <div className="custom-message-ui__actions">
          <div className="custom-message-ui__actions-group">
            <button onClick={handlePin} title={message.pinned ? "Unpin" : "Pin"}>
              {message.pinned ? "ð" : "ð"}
            </button>
            <button onClick={handleDelete} title="Delete">
              ðï¸
            </button>
            <button onClick={handleOpenThread} title="Open thread">
              â©ï¸
            </button>
            <button onClick={handleFlag} title="Flag message">
              ð©
            </button>
          </div>
        </div>
      );
    };

    const CustomMessageUiMetadata = () => {
      const {
        message: {
          created_at: createdAt,
          message_text_updated_at: messageTextUpdatedAt,
          status = "unknown",
        },
        readBy = [],
      } = useMessageContext();
      const { client } = useChatContext();

      const [firstUser] = readBy;

      const receivedAndRead =
        readBy.length > 1 || (firstUser && firstUser.id !== client.user?.id);

      return (
        <div className="custom-message-ui__metadata">
          <div className="custom-message-ui__metadata-created-at">
            {createdAt?.toLocaleString()}
          </div>
          <div className="custom-message-ui__metadata-read-status">
            {receivedAndRead
              ? statusIconMap.receivedAndRead
              : (statusIconMap[status as keyof typeof statusIconMap] ??
                statusIconMap.unknown)}
          </div>
          {messageTextUpdatedAt && (
            <div
              className="custom-message-ui__metadata-edited-status"
              title={messageTextUpdatedAt}
            >
              Edited
            </div>
          )}
        </div>
      );
    };

    const CustomMessageUi = () => {
      const { isMyMessage, message } = useMessageContext();

      const messageUiClassNames = ["custom-message-ui"];

      if (isMyMessage()) {
        messageUiClassNames.push("custom-message-ui--mine");
      } else {
        messageUiClassNames.push("custom-message-ui--other");
      }

      return (
        <div className={messageUiClassNames.join(" ")} data-message-id={message.id}>
          <div className="custom-message-ui__body">
            <Avatar
              image={message.user?.image}
              name={message.user?.name || message.user?.id}
            />
            <MessageText />
          </div>
          <CustomMessageUiMetadata />
          <CustomMessageUiActions />
        </div>
      );
    };


    .custom-message-ui {
      --cmui-gap-size-md: 0.5rem;
      --cmui-gap-size-sm: 0.2rem;
      --cmui-inline-spacing: 2rem;
      --cmui-block-spacing: 0.5rem;
      --cmui-bg-color: #efefef;
      --cmui-border-color: #ddd;
      --cmui-border-radius: 0.2rem;

      position: relative;
      display: flex;
      flex-direction: column;
      gap: var(--cmui-gap-size-md);
      padding-inline: var(--cmui-inline-spacing);
      padding-block: var(--cmui-block-spacing);
    }

    .custom-message-ui:hover,
    .custom-message-ui:has(.str-chat__message-text:focus) {
      background: var(--cmui-bg-color);
    }

    .custom-message-ui__body {
      gap: var(--cmui-gap-size-md);
      display: flex;
    }

    .custom-message-ui--mine .custom-message-ui__body {
      flex-direction: row-reverse;
      text-align: right;
    }

    .custom-message-ui__actions {
      display: none;
      position: absolute;
      gap: var(--cmui-gap-size-md);
      top: -20px;
    }

    .custom-message-ui:hover .custom-message-ui__actions {
      display: flex;
    }

    .custom-message-ui__actions-group {
      display: flex;
      background-color: var(--cmui-border-color);
      border-radius: var(--cmui-border-radius);
      gap: 1px;
      padding: 1px;
    }

    .custom-message-ui__actions-group button {
      all: unset;
      background: white;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      padding: 5px;
      line-height: 1rem;
    }

    .custom-message-ui__actions-group button:first-child {
      border-bottom-left-radius: calc(var(--cmui-border-radius) - 1px);
      border-top-left-radius: calc(var(--cmui-border-radius) - 1px);
    }

    .custom-message-ui__actions-group button:last-child {
      border-bottom-right-radius: calc(var(--cmui-border-radius) - 1px);
      border-top-right-radius: calc(var(--cmui-border-radius) - 1px);
    }

    .custom-message-ui__actions-group button:hover {
      background: var(--cmui-bg-color);
    }

    .custom-message-ui__metadata {
      display: none;
      font-size: x-small;
      align-items: baseline;
    }

    .str-chat__li--bottom .custom-message-ui__metadata,
    .str-chat__li--single .custom-message-ui__metadata {
      display: flex;
    }

    .custom-message-ui__metadata > *:nth-child(even)::after,
    .custom-message-ui__metadata > *:nth-child(even)::before {
      content: "â¢";
      padding-inline: var(--cmui-gap-size-sm);
    }

    .custom-message-ui__metadata > *:last-child::after {
      display: none;
    }

    .custom-message-ui--mine .custom-message-ui__metadata {
      align-self: flex-end;
    }

    .custom-message-ui--mine .custom-message-ui__actions {
      left: var(--cmui-inline-spacing);
    }

    .custom-message-ui--other .custom-message-ui__actions {
      right: var(--cmui-inline-spacing);
    }

    .custom-message-ui .str-chat__message-text p {
      all: unset;
    }

    .custom-message-ui .str-chat__message-text {
      display: flex;
      flex-direction: column;
      align-self: center;
    }

    .custom-message-ui .str-chat__message-mention {
      font-weight: bold;
      color: palevioletred;
      cursor: pointer;
    }

![](/_astro/custom-message-ui-6.DapB7y-P_Z1CKApx.webp)

Now that weâve enabled some actions weâll also need to cover certain UI parts that should reflect the latest message state which werenât relevant before. You can see that weâve already covered the messageâs âpinnedâ state by accessing the `pinned` property of the `message` object and rendering the appropriate icon when this property is set to `true`. See the [Pin Indicator](/chat/docs/sdk/react/guides/customization/pin_indicator/) guide for more customization options. Letâs explore other customizations needed for a complete message UI.

The following code samples contain only the code related to the appropriate components, if youâre following along you can copy and add the following examples to whatever you have created up until now. The whole example is [at the bottom](/chat/docs/sdk/react/guides/theming/message_ui#complete-example/) of this guide.

First - upon opening a thread and replying to a message, the messageâs property `reply_count` changes; letâs add the count indicator button beside the rest of the metadata elements so the end users can access the thread from two places.

ReactCSS


    const CustomMessageUiMetadata = () => {
      const {
        message: {
          created_at: createdAt,
          message_text_updated_at: messageTextUpdatedAt,
          // added-line
          reply_count: replyCount = 0,
          status = "unknown",
        },
        readBy = [],
        handleOpenThread,
      } = useMessageContext();
      const { client } = useChatContext();

      const [firstUser] = readBy;

      const receivedAndRead =
        readBy.length > 1 || (firstUser && firstUser.id !== client.user?.id);

      return (
        <div className="custom-message-ui__metadata">
          <div className="custom-message-ui__metadata-created-at">
            {createdAt?.toLocaleString()}
          </div>
          <div className="custom-message-ui__metadata-read-status">
            {receivedAndRead
              ? statusIconMap.receivedAndRead
              : (statusIconMap[status as keyof typeof statusIconMap] ??
                statusIconMap.unknown)}
          </div>
          {messageTextUpdatedAt && (
            <div
              className="custom-message-ui__metadata-edited-status"
              title={messageTextUpdatedAt}
            >
              Edited
            </div>
          )}
          // added-block-start
          {replyCount > 0 && (
            <button
              className="custom-message-ui__metadata-reply-count"
              onClick={handleOpenThread}
            >
              <span>
                {replyCount} {replyCount > 1 ? "replies" : "reply"}
              </span>
            </button>
          )}
          // added-block-end
        </div>
      );
    };


    .custom-message-ui__metadata-reply-count {
      all: unset;
    }

    .custom-message-ui__metadata-reply-count > span {
      color: blue;
      text-decoration: underline;
      cursor: pointer;
    }

Since now weâre also able to soft delete our own messages weâll need to render a slightly different UI to handle such a case. Letâs add a condition where we check whether the `deleted_at` property of the `message` object exists and if it does weâll simply fall back to âmessage deletedâ text.


    const CustomMessageUi = () => {
      const { isMyMessage, message } = useMessageContext();

      const messageUiClassNames = ["custom-message-ui"];

      if (isMyMessage()) {
        messageUiClassNames.push("custom-message-ui--mine");
      } else {
        messageUiClassNames.push("custom-message-ui--other");
      }

      return (
        <div className={messageUiClassNames.join(" ")} data-message-id={message.id}>
          // added-block-start
          {message.deleted_at && (
            <div className="custom-message-ui__body">
              This message has been deleted...
            </div>
          )}
          {!message.deleted_at && (
            <>
              <div className="custom-message-ui__body">
                <Avatar
                  image={message.user?.image}
                  name={message.user?.name || message.user?.id}
                />
                <MessageText />
              </div>
              <CustomMessageUiMetadata />
              <CustomMessageUiActions />
            </>
          )}
          // added-block-end
        </div>
      );
    };

![](/_astro/custom-message-ui-7.B7uxWg2H_Z2ql0KN.webp)

With message actions in place weâve made our message UI slightly more interactive but thereâs still a place for improvement. In this section of the guide weâll create a simple selector consisting of two reactions (thumbs up and down) and to display them weâll reuse and slightly modify the [`ReactionsList`](/chat/docs/sdk/react/components/message-components/reactions#reactionslist-props/) component provided by the SDK. Letâs begin by defining `customReactionOptions` (see more in the [Reactions Customization](/chat/docs/sdk/react/guides/theming/reactions/) guide) and by passing them down to a `reactionOptions` prop of a [`Channel`](/chat/docs/sdk/react/components/core-components/channel/) component.


    const customReactionOptions = [
      { name: "Thumbs up", type: "+1", Component: () => <>ð</> },
      { name: "Thumbs down", type: "-1", Component: () => <>ð</> },
    ];

    <Channel Message={CustomMessageUi} reactionOptions={customReactionOptions}>
      ...
    </Channel>;

And now thatâs done we can continue by extending our `CustomMessageUiActions` component using these newly defined options.


    const CustomMessageUiActions = () => {
      const {
        handleDelete,
        handleFlag,
        handleOpenThread,
        handlePin,
        // added-line
        handleReaction,
        message,
        threadList,
      } = useMessageContext();

      // added-line
      const { reactionOptions } = useComponentContext();

      if (threadList) return null;

      return (
        <div className="custom-message-ui__actions">
          <div className="custom-message-ui__actions-group">
            <button onClick={handlePin} title={message.pinned ? "Unpin" : "Pin"}>
              {message.pinned ? "ð" : "ð"}
            </button>
            <button onClick={handleDelete} title="Delete">
              ðï¸
            </button>
            <button onClick={handleOpenThread} title="Open thread">
              â©ï¸
            </button>
            <button onClick={handleFlag} title="Flag message">
              ð©
            </button>
          </div>
          // added-block-start
          <div className="custom-message-ui__actions-group">
            {reactionOptions.map(({ Component, name, type }) => (
              <button
                key={type}
                onClick={(e) => handleReaction(type, e)}
                title={`React with: ${name}`}
              >
                <Component />
              </button>
            ))}
          </div>
          // added-block-end
        </div>
      );
    };

Finally, we can add the `ReactionsList` component to our `CustomMessageUi` component and adjust the styles accordingly.

ReactCSS


    import {
      Avatar,
      MessageText,
      ReactionsList,
      useMessageContext,
      useChatContext,
      Channel,
    } from "stream-chat-react";

    const customReactionOptions = [
      { name: "Thumbs up", type: "+1", Component: () => <>ð</> },
      { name: "Thumbs down", type: "-1", Component: () => <>ð</> },
    ];

    const statusIconMap = {
      received: "â",
      receivedAndRead: "ðï¸",
      sending: "ð«",
      unknown: "â",
    };

    const CustomMessageUiActions = () => {
      const {
        handleDelete,
        handleFlag,
        handleOpenThread,
        handlePin,
        handleReaction,
        message,
        threadList,
      } = useMessageContext();

      const { reactionOptions } = useComponentContext();

      if (threadList) return null;

      return (
        <div className="custom-message-ui__actions">
          <div className="custom-message-ui__actions-group">
            <button onClick={handlePin} title={message.pinned ? "Unpin" : "Pin"}>
              {message.pinned ? "ð" : "ð"}
            </button>
            <button onClick={handleDelete} title="Delete">
              ðï¸
            </button>
            <button onClick={handleOpenThread} title="Open thread">
              â©ï¸
            </button>
            <button onClick={handleFlag} title="Flag message">
              ð©
            </button>
          </div>
          <div className="custom-message-ui__actions-group">
            {reactionOptions.map(({ Component, name, type }) => (
              <button
                key={type}
                onClick={(e) => handleReaction(type, e)}
                title={`React with: ${name}`}
              >
                <Component />
              </button>
            ))}
          </div>
        </div>
      );
    };

    const CustomMessageUiMetadata = () => {
      const {
        message: {
          created_at: createdAt,
          message_text_updated_at: messageTextUpdatedAt,
          reply_count: replyCount = 0,
          status = "unknown",
        },
        readBy = [],
        handleOpenThread,
      } = useMessageContext();
      const { client } = useChatContext();

      const [firstUser] = readBy;

      const receivedAndRead =
        readBy.length > 1 || (firstUser && firstUser.id !== client.user?.id);

      return (
        <div className="custom-message-ui__metadata">
          <div className="custom-message-ui__metadata-created-at">
            {createdAt?.toLocaleString()}
          </div>
          <div className="custom-message-ui__metadata-read-status">
            {receivedAndRead
              ? statusIconMap.receivedAndRead
              : (statusIconMap[status as keyof typeof statusIconMap] ??
                statusIconMap.unknown)}
          </div>
          {messageTextUpdatedAt && (
            <div
              className="custom-message-ui__metadata-edited-status"
              title={messageTextUpdatedAt}
            >
              Edited
            </div>
          )}
          {replyCount > 0 && (
            <button
              className="custom-message-ui__metadata-reply-count"
              onClick={handleOpenThread}
            >
              <span>
                {replyCount} {replyCount > 1 ? "replies" : "reply"}
              </span>
            </button>
          )}
        </div>
      );
    };

    const CustomMessageUi = () => {
      const { isMyMessage, message } = useMessageContext();

      const messageUiClassNames = ["custom-message-ui"];

      if (isMyMessage()) {
        messageUiClassNames.push("custom-message-ui--mine");
      } else {
        messageUiClassNames.push("custom-message-ui--other");
      }

      return (
        <div className={messageUiClassNames.join(" ")} data-message-id={message.id}>
          {message.deleted_at && (
            <div className="custom-message-ui__body">
              This message has been deleted...
            </div>
          )}
          {!message.deleted_at && (
            <>
              <div className="custom-message-ui__body">
                <Avatar
                  image={message.user?.image}
                  name={message.user?.name || message.user?.id}
                />
                <MessageText />
              </div>
              <CustomMessageUiMetadata />
              <CustomMessageUiActions />
              // added-line
              <ReactionsList />
            </>
          )}
        </div>
      );
    };


    .custom-message-ui {
      --cmui-gap-size-md: 0.5rem;
      --cmui-gap-size-sm: 0.2rem;
      --cmui-inline-spacing: 2rem;
      --cmui-block-spacing: 0.5rem;
      --cmui-bg-color: #efefef;
      --cmui-border-color: #ddd;
      --cmui-border-radius: 0.2rem;
      --str-chat__own-message-reaction-background-color: var(--cmui-bg-color);
      --str-chat__message-reaction-background-color: white;
      --str-chat__message-reaction-border-radius: var(--cmui-border-radius);

      position: relative;
      display: flex;
      flex-direction: column;
      gap: var(--cmui-gap-size-md);
      padding-inline: var(--cmui-inline-spacing);
      padding-block: var(--cmui-block-spacing);
    }

    .custom-message-ui:hover,
    .custom-message-ui:has(.str-chat__message-text:focus) {
      background: var(--cmui-bg-color);
    }

    .custom-message-ui__body {
      gap: var(--cmui-gap-size-md);
      display: flex;
    }

    .custom-message-ui--mine .custom-message-ui__body {
      flex-direction: row-reverse;
      text-align: right;
    }

    .custom-message-ui__actions {
      display: none;
      position: absolute;
      gap: var(--cmui-gap-size-md);
      top: -20px;
    }

    .custom-message-ui:hover .custom-message-ui__actions {
      display: flex;
    }

    .custom-message-ui__actions-group {
      display: flex;
      background-color: var(--cmui-border-color);
      border-radius: var(--cmui-border-radius);
      gap: 1px;
      padding: 1px;
    }

    .custom-message-ui__actions-group button {
      all: unset;
      background: white;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      padding: 5px;
      line-height: 1rem;
    }

    .custom-message-ui__actions-group button:first-child {
      border-bottom-left-radius: calc(var(--cmui-border-radius) - 1px);
      border-top-left-radius: calc(var(--cmui-border-radius) - 1px);
    }

    .custom-message-ui__actions-group button:last-child {
      border-bottom-right-radius: calc(var(--cmui-border-radius) - 1px);
      border-top-right-radius: calc(var(--cmui-border-radius) - 1px);
    }

    .custom-message-ui__actions-group button:hover {
      background: var(--cmui-bg-color);
    }

    .custom-message-ui__metadata {
      display: none;
      font-size: x-small;
      align-items: baseline;
    }

    .str-chat__li--bottom .custom-message-ui__metadata,
    .str-chat__li--single .custom-message-ui__metadata {
      display: flex;
    }

    .custom-message-ui__metadata > *:nth-child(even)::after,
    .custom-message-ui__metadata > *:nth-child(even)::before {
      content: "â¢";
      padding-inline: var(--cmui-gap-size-sm);
    }

    .custom-message-ui__metadata > *:last-child::after {
      display: none;
    }

    .custom-message-ui__metadata-reply-count {
      all: unset;
    }

    .custom-message-ui__metadata-reply-count > span {
      color: blue;
      text-decoration: underline;
      cursor: pointer;
    }

    .custom-message-ui--mine .str-chat__reaction-list {
      align-self: flex-end;
    }

    .custom-message-ui--mine .custom-message-ui__metadata {
      align-self: flex-end;
    }

    .custom-message-ui--mine .custom-message-ui__actions {
      left: var(--cmui-inline-spacing);
    }

    .custom-message-ui--other .custom-message-ui__actions {
      right: var(--cmui-inline-spacing);
    }

    .custom-message-ui .str-chat__message-text p {
      all: unset;
    }

    .custom-message-ui .str-chat__message-text {
      display: flex;
      flex-direction: column;
      align-self: center;
    }

    .custom-message-ui .str-chat__message-mention {
      font-weight: bold;
      color: palevioletred;
      cursor: pointer;
    }

    .custom-message-ui .str-chat__message-reaction {
      border: 1px solid var(--cmui-border-color);
      padding: 5px;
    }

![](/_astro/custom-message-ui-8.Ckw2BjZ3_2gx9zk.webp)

The topic of attachments is pretty substantial by itself, so we wonât be covering it in this guide. Please, refer to the source code of our default [`MessageSimple`](https://github.com/GetStream/stream-chat-react/blob/fdd021880d783af39e46e1327f2eb47c19199f09/src/components/Message/MessageSimple.tsx#L196-L198) for details on implementation and see the [Custom Attachment](/chat/docs/sdk/react/guides/theming/actions/attachment_actions#custom-attachment/) guide for more customization options.

Functionalities relevant to the Message UI that are also not covered in this guide:

  * [Edit Message](https://github.com/GetStream/stream-chat-react/blob/fdd021880d783af39e46e1327f2eb47c19199f09/src/components/Message/MessageSimple.tsx#L150-L161) functionality
  * [Message Bounced](https://github.com/GetStream/stream-chat-react/blob/fdd021880d783af39e46e1327f2eb47c19199f09/src/components/Message/MessageSimple.tsx#L162-L168) functionality
  * [Permissions](/chat/docs/sdk/react/components/contexts/channel_state_context#channelcapabilities/) of the message actions

[PreviousConnection Status](/chat/docs/sdk/react/guides/theming/connection_status/)[NextReactions Customization](/chat/docs/sdk/react/guides/theming/reactions/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

![](/_astro/channel-list.DM4TMjaj_Z1jaMpG.webp)

[`ChannelList`](/chat/docs/sdk/react/components/core-components/channel_list/) is a primary navigation component of a chat, used to display and switch between available channels. Due to the dynamic, real-time nature of chat, the [`ChannelList`](/chat/docs/sdk/react/components/core-components/channel_list/) component needs to subscribe to and handle many different types of events to keep the list state up to date. This includes handling new message events and updates to the existing ones, channel update events, channel member presence events, and so on.

Thatâs a lot of work, and if done incorrectly, itâs easy to miss an important event. That is why we always recommend building on top of the [`ChannelList`](/chat/docs/sdk/react/components/core-components/channel_list/) component provided by the SDK, even if you need to do some major customization. Fortunately, the component itself is very flexible, and basically everything about it can be customized. It supports

  1. Custom channel preview
  2. Custom channel list wrapper
  3. Custom channel list renderer
  4. [Custom paginator](/chat/docs/sdk/react/guides/channel-list-infinite-scroll/)

This guide takes a deep dive into these customization options.

You can think of a channel preview as a single item of the channel list. The preview should accurately display the current channel state and handle user interactions to switch to the selected channel.

![](/_astro/channel-list-preview.zDLzq3Sp_1D18mf.webp)

You can customize the look and behavior of the channel previews by providing a custom component in the [`Preview`](/chat/docs/sdk/react/components/core-components/channel_list#preview/) prop of the `ChannelList` component. When rendering previews, `ChannelList` wraps each item with a `ChannelPreview` wrapper that handles channel events such as new, updated and deleted messages. This way, you donât have to subscribe to these events yourself, and you can just grab the latest state from the props instead.


    <ChannelList Preview={CustomChannelPreview} />
    // Don't forget to provide filter and sort options as well!

Letâs implement a simple custom preview:

ReactCSS


    const CustomChannelPreview = ({
      displayImage,
      displayTitle,
      latestMessagePreview,
    }) => (
      <div className="channel-preview">
        <img className="channel-preview__avatar" src={displayImage} alt="" />
        <div className="channel-preview__main">
          <div className="channel-preview__header">{displayTitle}</div>
          <div className="channel-preview__message">{latestMessagePreview}</div>
        </div>
      </div>
    );


    .channel-preview {
      display: flex;
      gap: 16px;
      align-items: center;
      font-size: 0.9em;
      line-height: 1.2em;
    }

    .channel-preview__avatar {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      object-fit: cover;
    }

    .channel-preview__main {
      flex-grow: 1;
    }

    .channel-preview__header {
      font-weight: bold;
      margin-bottom: 4px;
    }

    .channel-preview__message {
      max-height: 2.4em;
      overflow: hidden;
      color: #858688;
    }

    .channel-preview__message p {
      margin: 0;
    }

(See also the complete reference of [the available preview component props](/chat/docs/sdk/react/components/utility-components/channel_preview_ui/).)

![](/_astro/channel-list-preview-custom.B63f0U17_ZqLrlm.webp)

The props provided to the preview component are usually sufficient to render the preview. However, if you need additional data, you can always get it from the channel state. In this next example, we will add the timestamp of the latest message in the channel:

ReactCSS


    const CustomChannelPreview = (props) => {
      const { channel, displayImage, displayTitle, latestMessagePreview } = props;
      const { userLanguage } = useTranslationContext();
      const latestMessageAt = channel.state.last_message_at;

      const timestamp = useMemo(() => {
        if (!latestMessageAt) {
          return "";
        }
        const formatter = new Intl.DateTimeFormat(userLanguage, {
          timeStyle: "short",
        });
        return formatter.format(latestMessageAt);
      }, [latestMessageAt, userLanguage]);

      return (
        <div className="channel-preview">
          <img className="channel-preview__avatar" src={displayImage} alt="" />
          <div className="channel-preview__main">
            <div className="channel-preview__header">
              {displayTitle}
              <time
                dateTime={latestMessageAt?.toISOString()}
                className="channel-preview__timestamp"
              >
                {timestamp}
              </time>
            </div>
            <div className="channel-preview__message">{latestMessagePreview}</div>
          </div>
        </div>
      );
    };


    .channel-preview {
      display: flex;
      gap: 16px;
      align-items: center;
      font-size: 0.9em;
      line-height: 1.2em;
    }

    .channel-preview__avatar {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      object-fit: cover;
    }

    .channel-preview__main {
      flex-grow: 1;
    }

    .channel-preview__header {
      display: flex;
      justify-content: space-between;
      font-weight: bold;
      margin-bottom: 4px;
    }

    .channel-preview__timestamp {
      font-weight: normal;
      color: #858688;
    }

    .channel-preview__message {
      max-height: 2.4em;
      overflow: hidden;
      color: #858688;
    }

    .channel-preview__message p {
      margin: 0;
    }

![](/_astro/channel-list-preview-timestamp.DlEqq_r6_ZiKgFH.webp)

One more thing we should add is the click event handler, which should change the currently active channel. Thatâs easy enough to do:

ReactCSS


    const CustomChannelPreview = (props) => {
      const {
        channel,
        activeChannel,
        displayImage,
        displayTitle,
        latestMessagePreview,
        setActiveChannel,
      } = props;
      const latestMessageAt = channel.state.last_message_at;
      const isSelected = channel.id === activeChannel?.id;
      const { userLanguage } = useTranslationContext();

      const timestamp = useMemo(() => {
        if (!latestMessageAt) {
          return "";
        }
        const formatter = new Intl.DateTimeFormat(userLanguage, {
          timeStyle: "short",
        });
        return formatter.format(latestMessageAt);
      }, [latestMessageAt, userLanguage]);

      const handleClick = () => {
        setActiveChannel?.(channel);
      };

      return (
        <button
          className={`channel-preview ${isSelected ? "channel-preview_selected" : ""}`}
          disabled={isSelected}
          onClick={handleClick}
        >
          <img className="channel-preview__avatar" src={displayImage} alt="" />
          <div className="channel-preview__main">
            <div className="channel-preview__header">
              {displayTitle}
              <time
                dateTime={latestMessageAt?.toISOString()}
                className="channel-preview__timestamp"
              >
                {timestamp}
              </time>
            </div>
            <div className="channel-preview__message">{latestMessagePreview}</div>
          </div>
        </button>
      );
    };


    .channel-preview {
      font: inherit;
      border: 2px solid transparent;
      border-radius: 8px;
      background: none;
      text-align: left;
      padding: 8px;
      display: flex;
      gap: 16px;
      align-items: center;
      font-size: 0.9em;
      line-height: 1.2em;
      cursor: pointer;
    }

    .channel-preview_selected {
      background: #fff;
      border-color: #005fff;
      cursor: auto;
    }

    .channel-preview__avatar {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      object-fit: cover;
    }

    .channel-preview__main {
      flex-grow: 1;
    }

    .channel-preview__header {
      display: flex;
      justify-content: space-between;
      font-weight: bold;
      margin-bottom: 4px;
    }

    .channel-preview_selected .channel-preview__header {
      color: #005fff;
    }

    .channel-preview__timestamp {
      font-weight: normal;
      color: #858688;
    }

    .channel-preview__message {
      max-height: 2.4em;
      overflow: hidden;
      color: #858688;
    }

    .channel-preview__message p {
      margin: 0;
    }

![](/_astro/channel-list-preview-selected.D1wpf9gF_Z1YlyDA.webp)

Note that weâve also added an additional class to the preview element if its channel is currently active (we check this by comparing the id of the active channel to the id of the current channel.)

Channel list wrapper is responsible for rendering the actual items of the channel list, as well as handling the loading and error states. This is a great place to plug in your custom component if you want to have a custom loader, or to add some additional content (like header and footer) to the channel list.

You can do this by providing a custom custom component in the [`List`](/chat/docs/sdk/react/components/core-components/channel_list#list/) prop of the `ChannelList` component. It will get a bunch of props from the parent `ChannelList`, including a list of loaded channels, a loading flag, and an error object (if any).


    <ChannelList List={CustomChannelList} />
    // Don't forget to provide filter and sort options as well!

The simplest implementation of the custom channel list wrapper looks like this:

ReactCSS


    const CustomChannelList = ({ children, loading, error }) => {
      if (loading) {
        return <div className="channel-list__placeholder">â³ Loading...</div>;
      }

      if (error) {
        return (
          <div className="channel-list__placeholder">
            ð£ Error loading channels
            <br />
            <button
              className="channel-list__button"
              onClick={() => window.location.reload()}
            >
              Reload page
            </button>
          </div>
        );
      }

      return (
        <div className="channel-list">
          {loadedChannels && (
            <div className="channel-list__counter">
              {loadedChannels.length} channels:
            </div>
          )}
          {children}
        </div>
      );
    };


    .channel-list__placeholder {
      padding: 120px 20px;
      text-align: center;
    }

    .channel-list__button {
      border: 1px solid #00000014;
      outline: 0;
      background: #fafafa;
      font: inherit;
      border-radius: 4px;
      margin: 8px;
      padding: 8px;
      cursor: pointer;
    }

    .channel-list__button:focus {
      border-color: #005fff;
    }

![Loading state](/_astro/channel-list-loading.lCYrZkkm_Z1J89tS.webp)

![Error state](/_astro/channel-list-error.BYSLU_BA_Z1znRzT.webp)

![Normal state](/_astro/channel-list-preview-selected.D1wpf9gF_Z1YlyDA.webp)

If you need access to the array of channel objects, you can use the `loadedChannels` prop. Keep in mind, however, that it can update frequently, resulting in excessive rendering. For this reason, you have to explicitly opt-in by setting the [`sendChannelsToList`](/chat/docs/sdk/react/components/core-components/channel_list#sendchannelstolist/) prop on the `ChannelList`:

ReactCSS


    <ChannelList List={CustomChannelList} sendChannelsToList />;
    // Don't forget to provide filter and sort options as well!

    const CustomChannelList = ({
      loadedChannels,
      children,
      loading,
      error,
    }: React.PropsWithChildren<ChannelListMessengerProps>) => {
      if (loading) {
        return <div className='channel-list__placeholder'>â³ Loading...</div>;
      }

      if (error) {
        return (
          <div className='channel-list__placeholder'>
            ð£ Error loading channels
            <br />
            <button className='channel-list__button' onClick={() => window.location.reload()}>
              Reload page
            </button>
          </div>
        );
      }

      if (loadedChannels?.length === 0) {
        return <div className='channel-list__placeholder'>ð¤· You have no channels... yet</div>;
      }

      return (
        <div className='channel-list'>
          {loadedChannels && (
            <div className='channel-list__counter'>{loadedChannels.length} channels:</div>
          )}
          {children}
        </div>
      );
    };


    .channel-list__placeholder {
      padding: 120px 20px;
      text-align: center;
    }

    .channel-list__button {
      border: 1px solid #00000014;
      outline: 0;
      background: #fafafa;
      font: inherit;
      border-radius: 4px;
      margin: 8px;
      padding: 8px;
      cursor: pointer;
    }

    .channel-list__button:focus {
      border-color: #005fff;
    }

    .channel-list__counter {
      color: #858688;
      margin: 0 10px 8px;
    }

![](/_astro/channel-list-counter.BhGTIcqM_2hkA4d.webp)

By default, the [`ChannelList`](/chat/docs/sdk/react/components/core-components/channel_list/) component provided by the SDK renders channel previews in the same order as the channels were queried. If you want to hook into the list rendering process, e.g. to add subheadings, group channels, etc., you can provide a custom list renderer in the [`renderChannels`](/chat/docs/sdk/react/components/core-components/channel_list#renderchannels/) prop of the `ChannelList` component.

The function passed in this prop takes a list of loaded channels and a channel preview component. Note that it is not exactly the component passed in the [`Preview`](/chat/docs/sdk/react/components/core-components/channel_list#preview/) prop, but rather a version of that component wrapped with the `ChannelPreview` helper to ensure that all channel event listeners are set up properly. The `renderChannels` function is only called if the channel list was successfully loaded and is not empty.

This example adds a separator between read and unread channels:

ReactCSS


    const renderChannels = (channels, getChannelPreview) => {
      const unreadChannels = [];
      const readChannels = [];

      for (const channel of channels) {
        const hasUnread = channel.countUnread();
        (hasUnread ? unreadChannels : readChannels).push(channel);
      }

      return [unreadChannels, readChannels]
        .filter((group) => group.length > 0)
        .map((group, index) => (
          <div key={index} className="channel-group">
            {group.map((channel) => (
              <div key={channel.id}>{getChannelPreview(channel)}</div>
            ))}
          </div>
        ));
    };


    .channel-group + .channel-group {
      padding-top: 40px;
      margin-top: 40px;
      border-top: 2px solid #00000014;
    }

![](/_astro/channel-list-separator.D1l30bKR_Z25SYbj.webp)

[PreviousOverview](/chat/docs/sdk/react/guides/customization/)[NextChannel Search](/chat/docs/sdk/react/guides/customization/channel_search/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

In this example we will demonstrate how to make a custom `ThreadHeader` component utilizing the props that are passed to an open `Thread`.

The default `ThreadHeader` shows the number of replies alongside a button to close the thread. In our example we will use the `Avatar` component to render pictures of the current participants in the thread. We will also change the look of the button and show the number of replies. All of this data and more can be easily pulled from the `thread` prop, which represents the parent message. The last thing we will utilize is the `closeThread` function, which is also passed to `Thread` as a prop.


    export const CustomThreadHeader = ({ closeThread, thread }) => {
      const replyCount = thread.reply_count;
      const threadParticipants = thread.thread_participants;

      return (
        <div className="wrapper">
          <div className="participants-wrapper">
            {threadParticipants.map((participant) => (
              <div className="participant">
                <Avatar image={participant.image} name={participant.name} />
              </div>
            ))}
            <div className="reply-count">{replyCount} Replies</div>
          </div>
          <div onClick={closeThread} className="close-button">
            <div className="left">
              <div className="right"></div>
            </div>
          </div>
        </div>
      );
    };


    .wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      padding: var(--sm-p);
      background: var(--white);
      box-shadow:
        0 7px 9px 0 var(--border),
        0 1px 0 0 var(--border);
    }

    .participants-wrapper {
      display: flex;
      align-items: center;
    }

    .participant:first-child {
      margin: 0;
    }

    .participant {
      margin-left: calc(var(--md-m) * -1);
      border-radius: var(--border-radius-round);
      border: 2px solid var(--white);
      padding-right: 0;
    }

    .reply-count {
      margin-left: var(--sm-m);
      font-weight: var(--font-weight-semi-bold);
    }

    .close-button {
      width: 24px;
      height: 24px;
    }

    .left {
      height: 24px;
      width: 3px;
      border-radius: var(--border-radius-sm);
      margin-left: 12px;
      background-color: var(--primary-color);
      transform: rotate(45deg);
      z-index: 1;
    }

    .right {
      height: 24px;
      width: 3px;
      border-radius: var(--border-radius-sm);
      background-color: var(--primary-color);
      transform: rotate(90deg);
      z-index: 2;
    }

From here all we need to do is override the default component in `Channel` at the `App.tsx` level:


    <Channel ThreadHeader={CustomThreadHeader}>
      {/* children of Channel component */}
    </Channel>

![Custom Thread Header UI Component for Chat](/_astro/CustomThreadHeader.C6vumKxE_Z27ftB9.webp)

[PreviousChannel Header](/chat/docs/sdk/react/guides/customization/channel_header/)[NextClient and User](/chat/docs/sdk/react/guides/client-and-user/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

When it came to developer experience regarding customization of the reaction components our team noticed that our integrators generally struggled to make more advanced adjustments to reactions without having to rebuild the whole [component set](/chat/docs/sdk/react/components/message-components/reactions/). The whole process has been quite unintuitive and thatâs why this update aims at making adjusting your reactions much easier.

* inability to reuse default (Stream supplied reactions) with your custom ones
  * strong reliance on [`emoji-mart`](https://github.com/missive/emoji-mart) and inability to use completely custom reactions out of the box
  * certain `additionalEmojiProps` did not work with Stream-supplied reactions



    // not exported directly (hidden, leading to poor DX)
    import { defaultMinimalEmojis } from "stream-chat-react/dist/components/Channel/emojiData";

    export const customReactions = [
      {
        // relies on EmojiMart-supplied sprite sheet, "native" option does not work for Stream-supplied reactions
        // you'd need to look up supported id's in stream-emoji.json under "emojis" key
        id: "bulb",
      },
      // unsupported
      {
        id: "rick_roll",
      },
      // this wouldn't work
      ...defaultMinimalEmojis,
    ];

SDK by default comes with five pre-defined reaction types (`haha`, `like`, `love`, `sad` and `wow`) which are newly rendered by [StreamEmoji](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Reactions/StreamEmoji.tsx) component which utilises sprite sheet system and renders images for each reaction to make sure it works flawlessly on every system. Default reaction options are defined in [defaultReactionOptions](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Reactions/reactionOptions.tsx) and these options are reused for both [`ReactionSelector`](/chat/docs/sdk/react/components/message-components/reactions#reactionselector-props/) and [`ReactionsList`](/chat/docs/sdk/react/components/message-components/reactions#reactionslist-props/) (as well as [`SimpleReactionsList`](/chat/docs/sdk/react/components/message-components/reactions#simplereactionslist-props/)). These options come by default from the ComponentContext but local component property will be prioritised if defined. This is how it works under the hood:


    contextReactionOptions = defaultReactionOptions;
    // ...
    const reactionOptions = propsReactionOptions ?? contextReactionOptions;

Beware that sixth reaction type `angry` has been removed in this update, if you need to re-enable it, follow this guide.

The default [StreamEmoji](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Reactions/StreamEmoji.tsx) component is rendered with the fixed size. You can change the size of the rendered emoji using `--str-chat__stream-emoji-size` CSS variable:


    <div style={{ "--str-chat__stream-emoji-size": "2em" }}>
      <StreamEmoji fallback="ð" type="haha" />
    </div>

Itâs possible to supply your own reaction types and components to represent such reactions - letâs implement reaction of type `rick_roll` to render a Rick Roll GIF and define override for default type `love`:


    import { Channel } from "stream-chat-react";

    const RickRollReaction = () => (
      <img
        src="https://media.tenor.com/x8v1oNUOmg4AAAAM/rickroll-roll.gif"
        style={{ height: 20 }}
      />
    );

    const customReactionOptions = [
      {
        Component: RickRollReaction,
        type: "rick_roll",
        name: "Rick Roll",
      },
      {
        Component: () => <>â¤ï¸</>,
        type: "love",
        name: "Heart",
      },
    ];

And then you can pass these newly created options to [`Channel`](/chat/docs/sdk/react/components/core-components/channel/) component which will be then propagated to `ReactionSelector` and `ReactionsList`:


    <Channel reactionOptions={customReactionOptions}>{/*...*/}</Channel>

If youâre used to work with [EmojiMart emojis](https://github.com/missive/emoji-mart#-emoji-component) then integrating with new reaction system shouldnât be a big trouble as you can define how your components look and reach for context if you need to:


    // arbitrary EmojiMartContext (does not come with the SDK)
    import { useEmojiMartContext } from "../contexts";

    const CustomLikeComponent = () => {
      const { selectedSkinTones, selectedSet } = useEmojiMartContext();

      // to use EmojiMart web components you'll need to go through initiation steps, see EmojiMart documentation
      return <em-emoji id="+1" set={selectedSet} skin={selectedSkinTones["+1"]} />;
    };

    const reactionOptions = [
      {
        type: "like",
        component: CustomLikeComponent,
        name: "EmojiMart like",
      },
    ];

    // pass reaction options to component context (Channel) or to ReactionSelector and ReactionsList

If you need more fine-grain tuning and want to - for example - enable only a certain subset of clickable reactions but want to display the full set then youâd do something like this:


    const JoyReaction = () => <>ð</>;
    const CatReaction = () => <>ð</>;
    const ThumbsUpReaction = () => <>ð</>;
    const SmileReaction = () => <>ð</>;

    // subset of clickable options available to the user
    const selectedReactionOptions = [
      { type: "haha", Component: JoyReaction },
      { type: "cat", Component: CatReaction },
    ];

    // set of all available options to be rendered
    const completeReactionOptions = [
      { type: "haha", Component: JoyReaction },
      { type: "cat", Component: CatReaction },
      { type: "+1", Component: ThumbsUpReaction },
      { type: "smile", Component: SmileReaction },
    ];

Or if you just want bigger icons for `ReactionsList` while `ReactionSelector` uses regular:


    // arbitrary import (does not come with the SDK)
    import { ReactionComponent } from "./CustomReactions";

    const selectorReactionOptions = [
      {
        type: "like",
        component: ReactionComponent.Like,
        name: "Like",
      },
    ];

    const listReactionOptions = [
      {
        type: "like",
        // in this example it's just different size of the emoji
        component: ReactionComponent.LikeMedium,
        name: "Like medium",
      },
    ];

You can then apply these new options to `ReactionSelector` and `ReactionsList` directly:


    import { ReactionSelector, ReactionsList, Channel } from "stream-chat-react";

    // ReactionSelector component requires forwarded reference
    const CustomReactionSelector = forwardRef((props, ref) => (
      <ReactionSelector
        {...props}
        ref={ref}
        reactionOptions={selectorReactionOptions}
      />
    ));

    const CustomReactionsList = (props) => (
      <ReactionsList {...props} reactionOptions={listReactionOptions} />
    );

And then pass them down to component context (`Channel`) component:


    <Channel
      ReactionSelector={CustomReactionSelector}
      ReactionsList={CustomReactionsList}
    >
      {/*...*/}
    </Channel>

We suggest using individual images per reaction type as multiple smaller requests is more bandwidth-friendly. Use this component only if you have no other choice.

If you have a sprite sheet of emojis and thereâs no other way for you to implement your reactions, you can utilise [SpriteImage](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Reactions/SpriteImage.tsx) utility component which comes with the SDK:


    import { SpriteImage } from "stream-chat-react";

    const SPRITE_URL = "https://getstream.imgix.net/images/emoji-sprite.png";

    const reactionOptions = [
      {
        type: "joy",
        component: () => (
          // renders fallback initially and then image when it successfully loads
          <SpriteImage
            columns={2} // number of spritesheet columns
            rows={3} // number of spritesheet rows
            spriteUrl={SPRITE_URL} // source URL of the spritesheet
            position={[0, 1]} // x and y axis positions, zero indexed
            fallback="ð" // native emoji (or any string) to render while the sprite image is loading
          />
        ),
        name: "ROFL",
      },
    ];

    // pass reaction options to component context (Channel) or to ReactionSelector and ReactionsList

The transition is super easy:


    import { defaultReactionOptions } from "stream-chat-react";

    // old custom options
    const reactionOptions = [
      { id: "bulb" /* ...extra properties... */ },
      { id: "+1" },
      { id: "joy" },
    ];

    // would newly become
    const newReactionOptions = [
      { type: "bulb", Component: () => <>ð¡</>, name: "Bulb reaction" },
      { type: "+1", Component: () => <>ð</> },
      { type: "joy", Component: () => <>ð¤£</>, name: "ROFL" },
      // reuse default ones if you want to
      ...defaultReactionOptions,
    ];

All of the extra options previously applied to `EmojiMart` emojis can now be directly applied to your custom components either manually or through your custom context. For more information see EmojiMart integration.

For better compatibility with other SDKs we decided to consolidate default available types and remove `angry` type which was previously available only in the React SDK. Hereâs how youâd go about re-enabling it:


    import { StreamEmoji, defaultReactionOptions } from "stream-chat-react";

    const reactionOptions = [
      ...defaultReactionOptions,
      {
        type: "angry",
        Component: () => <StreamEmoji fallback="ð " type="angry" />,
        name: "Angry",
      },
    ];

    // pass reaction options to component context (Channel) or to ReactionSelector and ReactionsList

By default, our SDK comes bundled with the `emoji-mart`âs [`emojiIndex`](https://github.com/missive/emoji-mart/tree/v3.0.1#headless-search), more specifically - `NimbleEmojiIndex` class which is then instantiated with custom `emojiData` by our SDK. This index serves as a tool for efficiently searching through the emoji list and returning a subset that matches the search criteria (query). Within our SDK, this functionality is utilized by our autocomplete component, triggered by entering `:<query>` to the meessage input. This functionality will continue to be integrated within our SDK. However, due to our decision to discontinue the use of `emoji-mart` within the SDK, this feature will now be available on an opt-in basis. With the updated types and interface this will also allow integrators to supply their own `emojiSearchIndex` instead of relying exclusively on the one supplied by `emoji-mart`.

Add `emoji-mart` to your packages and make sure the package versions fit our peer-dependency requirements:


    yarn add emoji-mart @emoji-mart/data

Import `SearchIndex` and `data` from `emoji-mart`, initiate these data and then and pass `SearchIndex` to our `MessageInput` component:


    import { MessageInput } from "stream-chat-react";
    import { init, SearchIndex } from "emoji-mart";
    import data from "@emoji-mart/data";

    init({ data });

    export const WrappedMessageInput = () => {
      return <MessageInput emojiSearchIndex={SearchIndex} focus />;
    };

Your data returned from the `search` method should have _at least_ these three properies which our SDK relies on:

  * name - display name for the emoji, ie: `"Smile"`
  * id - unique emoji identificator
  * skins - an array of emojis with different skins (our SDK uses only the first one in this array), ie: `[{ native: "ð" }]`

Optional properties:

  * emoticons - an array of strings to match substitutions with, ie: `[":D", ":-D", ":d"]`
  * native - native emoji string (old `emoji-mart` API), ie: `"ð"` \- will be prioritized if specified

import { type EmojiSearchIndex } from "stream-chat-react";
    import search from "@jukben/emoji-search";

    const emoticonMap: Record<string, string[]> = {
      "ð": [":D", ":-D"],
      "ð": ["-_-"],
      "ð¢": [":'("],
    };

    const emojiSearchIndex: EmojiSearchIndex = {
      search: (query) => {
        const results = search(query);

        return results.slice(0, 15).map((data) => ({
          emoticons: emoticonMap[data.name],
          id: data.name,
          name: data.keywords.slice(1, data.keywords.length).join(", "),
          native: data.name,
          skins: [],
        }));
      },
    };

    export const WrappedChannel = ({ children }) => (
      <Channel emojiSearchIndex={emojiSearchIndex}>{children}</Channel>
    );

`EmojiIndex` has previously lived in the `EmojiContext` passed to through `Channel` component. But since `EmojiContext` no longer exists in our SDK, the property has been moved to our `ComponentContext` (still passed through `Channel`) and changed its name to `emojiSearchIndex` to properly repesent its funtionality. If your custom `EmojiIndex` worked with our default components in `v10` then it should still work in `v11` without any changes to its `search` method output:

Your old code:


    import { Channel, MessageInput } from "stream-chat-react";
    // arbitrary import
    import { CustomEmojiIndex, customData } from "./CustomEmojiIndex";

    const App = () => {
      return (
        <Channel emojiData={customData} EmojiIndex={CustomEmojiIndex}>
          {/* other components */}
          <MessageInput />
        </Channel>
      );
    };

Should newly look like this:


    import { Channel, MessageInput } from "stream-chat-react";
    // arbitrary import
    import { CustomEmojiIndex, customData } from "./CustomEmojiIndex";
    // instantiate the search index
    const customEmojiSearchIndex = new CustomEmojiIndex(customData);

    const App = () => {
      return (
        <Channel emojiSearchIndex={customEmojiSearchIndex}>
          {/* other components */}
          <MessageInput />
        </Channel>
      );
    };

Or enable it in either of the `MessageInput` components individually:


    import { Channel, MessageInput } from "stream-chat-react";
    // arbitrary import
    import { CustomEmojiIndex, customData } from "./CustomEmojiIndex";
    // instantiate the search index
    const customEmojiSearchIndex = new CustomEmojiIndex(customData);

    const App = () => {
      return (
        <Channel>
          {/* other components */}
          <MessageInput emojiSearchIndex={customEmojiSearchIndex} />
          <Thread
            additionalMessageInputProps={{
              emojiSearchIndex: customEmojiSearchIndex,
            }}
          />
        </Channel>
      );
    };

By default - our SDK would ship with `emoji-mart` dependency on top of which our `EmojiPicker` component is built. And since the SDK is using `emoji-mart` for this component - it was also reused for reactions (`ReactionsList` and `ReactionSelector`) and suggestion list (`MessageInput`). This solution proved to be very uncomfortable to work with when it came to replacing either of the mentioned components (or disabling them completely) and the final applications using our SDK would still bundle certain `emoji-mart` parts which werenât needed (or seemingly âdisabledâ) resulting in sub-optimal load times. Maintaining such architecture became a burden so weâre switching things a bit.

SDKâs `EmojiPicker` component now comes as two-part âbundleâ - a button and an actual picker element. The component now holds its own `open` state which is handled by clicking the button (or anywhere else to close it).

We made `emoji-mart` package in our SDK completely optional which means that `EmojiPicker` component is now disabled by default.

To reinstate the previous behavior youâll have to add `emoji-mart` to your packages and make sure the packages come with versions that fit our peer-dependency requirements:


    yarn add emoji-mart @emoji-mart/data @emoji-mart/react

Import `EmojiPicker` component from the `stream-chat-react` package:


    import { Channel } from "stream-chat-react";
    import { EmojiPicker } from "stream-chat-react/emojis";

    // and apply it to the Channel (component context)

    const WrappedChannel = ({ children }) => {
      return <Channel EmojiPicker={EmojiPicker}>{children}</Channel>;
    };

If `emoji-mart` is too heavy for your use-case and youâd like to build your own you can certainly do so, hereâs a very simple `EmojiPicker` example built using `emoji-picker-react` package:


    import EmojiPicker from "emoji-picker-react";
    import { useMessageInputContext } from "stream-chat-react";

    export const CustomEmojiPicker = () => {
      const [open, setOpen] = useState(false);

      const { insertText, textareaRef } = useMessageInputContext();

      return (
        <>
          <button onClick={() => setOpen((isOpen) => !isOpen)}>
            Open EmojiPicker
          </button>

          {open && (
            <EmojiPicker
              onEmojiClick={(emoji, event) => {
                insertText(emoji.native);
                textareaRef.current?.focus(); // returns focus back to the message input element
              }}
            />
          )}
        </>
      );
    };

    // and pass it down to the `Channel` component

You can make the component slightly better using [`FloatingUI`](https://floating-ui.com/) by wrapping the actual picker element to make it float perfectly positioned above the button. See the source of the [EmojiPicker](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Emojis/EmojiPicker.tsx) component which comes with the SDK for inspiration.

Even though itâs not explicitly provided by our SDK anymore, itâs still possible for our integrators to use older version of the `emoji-mart` \- specifically version `3.0.1` on top of which our old components were built. We donât recommend using old version of the `emoji-mart` but if you really need to, follow the [`3.0.1` documentation](https://github.com/missive/emoji-mart/tree/v3.0.1#picker) in combination with the previous guide to build your own `EmojiPicker` component with the old `emoji-mart` API. Beware though, if you wish to use slightly modified `emoji-mart` CSS previously supplied by our SDK by default in the main `index.css` file, youâll now have to explicitly import it:


    import "stream-chat-react/css/v2/index.css";
    import "stream-chat-react/css/v2/emoji-mart.css";

The `doSendMessageRequest` will from now on be passed the `Channel` instance instead of its CID to avoid forcing the developers to recreate a reference to the `Channel` instance inside the `doSendMessageRequest` function. The developers should adjust their implementation of `doSendMessageRequest` to call directly `await channel.sendMessage(messageData, options)`:


    import { ChannelProps } from "stream-chat-react";

    const doSendMessageRequest: ChannelProps["doSendMessageRequest"] = async (
      channel,
      messageData,
      options,
    ) => {
      // optional custom logic
      await channel.sendMessage(messageData, options);
      // optional custom logic
    };

Optional remark plugins `htmlToTextPlugin`, `keepLineBreaksPlugin` introduced with [stream-chat-react@v10.19.0](https://github.com/GetStream/stream-chat-react/releases/tag/v10.19.0) are now included among the default remark plugins. That means that in the messages that originally contained a sequence of multiple newline characters `\n`, these will be replaced with line break elements `<br/>`. The number of line breaks equals count of newline characters minus 1. The dependencies used to parse the markdown with [`renderText` function](/chat/docs/sdk/react/components/message-components/render-text/) have been upgraded as a result of that, the following changes had to be performed in stream-chat-react library:

`RenderTextOptions.customMarkDownRenderers`\- a mapping of element name and corresponding React component to be rendered. The components are no longer accepting `ReactMarkdownProps`

The `RenderTextOptions.customMarkDownRenderers.mention` props have been reduced. From now on, only `children` and `node` are passed to the component. And so now `mention` renderer props look as follows:


    import { PropsWithChildren } from "react";
    import type { UserResponse } from "stream-chat";
    import type { DefaultStreamChatGenerics } from "stream-chat-react";

    type MentionProps<
      StreamChatGenerics extends
        DefaultStreamChatGenerics = DefaultStreamChatGenerics,
    > = PropsWithChildren<{
      node: {
        mentionedUser: UserResponse<StreamChatGenerics>;
      };
    }>;

If you have implemented your own rehype or remark plugin using `visit` function from the library `unist-util-visit` beware that the `index` and `parent` arguments of the `Visitor` function cannot be `null` but `undefined` instead. You should be notified by Typescript about this and should adjust the type checks accordingly.

If you would like to prevent applying plugins `htmlToTextPlugin`, `keepLineBreaksPlugin`, you can customize your `renderText()` by overriding the remark plugins. The example below will keep the plugin `remarkGfm` and exclude the rest:


    import remarkGfm from "remark-gfm";
    import { renderText, RenderTextPluginConfigurator } from "stream-chat-react";

    const getRemarkPlugins: RenderTextPluginConfigurator = () => {
      return [[remarkGfm, { singleTilde: false }]];
    };

    const customRenderText = (text, mentionedUsers) =>
      renderText(text, mentionedUsers, {
        getRemarkPlugins,
      });

    const CustomMessageList = () => <MessageList renderText={customRenderText} />;

Since this release youâll need to explicitly import extra stylesheet from `stream-chat-react/css/v2/emoji-replacement.css` as it has been removed from our main stylesheet to reduce final bundle size for integrators who do not wish to use this feature.


    import { Chat } from "stream-chat-react";

    import "stream-chat-react/css/v2/index.css";
    import "stream-chat-react/css/v2/emoji-replacement.css";

    export const WrappedChat = ({ children, client }) => (
      <Chat useImageFlagEmojisOnWindows client={client}>
        {children}
      </Chat>
    );

[PreviousUpgrade to v12](/chat/docs/sdk/react/release-guides/upgrade-to-v12/)[NextUpgrade to v10 (theming V2)](/chat/docs/sdk/react/release-guides/upgrade-to-v10/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

In this example, we will demonstrate how to create a custom pin indicator for pinned messages. [Pinned messages](/chat/docs/javascript/pinned_messages/) allow users to highlight important messages, make announcements, or temporarily promote content.

Letâs start with the less invasive and fairly simple CSS based solution. All the class names you need to build this feature are in place and toggled appropriately. Weâll add `::before` pseudo-class to our message bubble element with a pin (ð) icon to display whenever message has been pinned.


    .str-chat__message--pinned .str-chat__message-bubble::before {
      content: "ð";
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      background-color: papayawhip;
      font-size: 0.6rem;
      width: 1.4rem;
      height: 1.4rem;
      border-radius: 9999px;
      z-index: 1;
      top: -10px;
    }

    .str-chat__message--other.str-chat__message--pinned
      .str-chat__message-bubble::before {
      right: -10px;
    }

    .str-chat__message--me.str-chat__message--pinned
      .str-chat__message-bubble::before {
      left: -10px;
    }

![Custom Pin Indicator - CSS Based Solution](/_astro/custom-pin-indicator-css.DDWv4FOq_Z2aOVAX.webp)

While CSS solution is certainly less invasive itâs also less malleable when it comes to hooking some JavaScript to it. For that case the component based solution is also an option. In this example weâll build an indicator which displays the name of the user who pinned the message. Weâll pass our custom component to the [`Channel`](/chat/docs/sdk/react/components/core-components/channel/) prop `PinIndicator` which forwards it to [`ComponentContext`](/chat/docs/sdk/react/components/contexts/component_context/) from which itâll be picked up by the [`MessageSimple`](/chat/docs/sdk/react/components/message-components/message_ui/) component to render.

ReactCSS


    import { Channel } from "stream-chat-react";

    const CustomPinIndicator = () => {
      const { message } = useMessageContext("CustomPinIndicator");

      const pinnedBy = message.pinned_by?.name || message.pinned_by?.id;

      if (!pinnedBy) return null;

      return <div className="pin-indicator">ð Pinned by {pinnedBy}</div>;
    };

    //...

    <Channel PinIndicator={CustomPinIndicator}>...</Channel>;


    .pin-indicator {
      grid-area: pin;
    }

    .str-chat__message.str-chat__message--other,
    .str-chat__message.str-chat__quoted-message-preview {
      grid-template-areas:
        ". pin"
        "avatar message"
        ". replies"
        ". translation-notice"
        ". custom-metadata"
        ". metadata";
    }

    .str-chat__message.str-chat__message--me {
      grid-template-areas:
        "pin"
        "message"
        "replies"
        "translation-notice"
        "custom-metadata"
        "metadata";
    }

![Custom Pin Indicator](/_astro/custom-pin-indicator.D5CRFZS7_MTCaA.webp)

See more on permissions regarding message pinning in [_Permissions v2_](/chat/docs/react/user_permissions/) section of our JS documentation.

[PreviousMessage Actions](/chat/docs/sdk/react/guides/theming/actions/message_actions/)[NextSystem Message](/chat/docs/sdk/react/guides/customization/system_message/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

In this example, we will demonstrate how to add a custom message action. By default, the component library supports the following message actions:

  * `delete`
  * `edit`
  * `flag`
  * `mute`
  * `pin`
  * `quote`
  * `react`
  * `reply`

The `MessageList` component accepts a prop called [`customMessageActions`](/chat/docs/sdk/react/components/core-components/message_list#custommessageactions/). This prop is an object type, with the key serving as the name (and the title) of the action and the value as the handler function to be run on click.

In the examples below, weâll add a custom option `Yell`, which will call a window alert on click.

The custom action handler receives both the `message` object and on click `event` as function arguments.


    import { MessageList } from "stream-chat-react";
    import type { CustomMessageActions } from "stream-chat-react";

    const customMessageActions: CustomMessageActions = {
      Yell: (message, event) => {
        window.alert(`Yell action clicked on message: ${message.id}!`);
      },
    };

    export const WrappedMessageList = () => {
      return <MessageList customMessageActions={customMessageActions} />;
    };

If you need more flexibility - for example; adding translations to your action titles - you can utilise `CustomMessageActionList` component instead.

Unless you replicate the internal functionality of the default [`CustomMessageActionList`](https://github.com/GetStream/stream-chat-react/blob/master/src/components/MessageActions/CustomMessageActionsList.tsx) youâll be only able to use one of the customization options mentioned in this guide.


    import { Channel } from "stream-chat-react";

    const CustomMessageActionList = () => {
      const { message } = useMessageContext("CustomMessageActionList");
      const { t } = useTranslationContext("CustomMessageActionList");

      return (
        <>
          <button
            className="str-chat__message-actions-list-item-button"
            onClick={(event) => {
              window.alert(`Yell action clicked on message: ${message.id}!`);
            }}
          >
            {t("yell")}
          </button>

          {/** ...other action buttons... */}
        </>
      );
    };

    export const WrappedChannel = ({ children }) => (
      <Channel CustomMessageActionList={CustomMessageActionList}>
        {children}
      </Channel>
    );

The custom actions will be displayed on top of the defaults in the message actions list.

![Preview of the Custom Message Action](/_astro/custom-message-action.BOHG7N2z_Z14CghN.webp)

[PreviousMentions Actions](/chat/docs/sdk/react/guides/theming/actions/mentions_actions/)[NextPin Indicator](/chat/docs/sdk/react/guides/customization/pin_indicator/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

When [Theming](/chat/docs/sdk/react/theming/themingv2/) is not enough for how you want our chat SDK to look and behave, customization is the next step. By customizing specific components you can make precise adjustments to the look and feel of our SDK exactly where you need them.

![Default MessageList](/_astro/default-message-list.BRKdgVLU_jp2PO.webp)

![Default ChannelList](/_astro/default-channel-list.CsQ4Mr_v_ZpiYXl.webp)

![Default MessageInput](/_astro/default-message-input.zHjJut-B_2gDGEN.webp)

![Default ChannelHeader](/_astro/default-channel-header.DDHQWsGC_ZXE3IU.webp)

![Default Thread](/_astro/default-thread.B9_KYfGR_o3IkI.webp)

[PreviousWithDragAndDropUpload](/chat/docs/sdk/react/components/utility-components/with-drag-and-drop-upload/)[NextChannel List UI](/chat/docs/sdk/react/guides/customization/channel_list_preview/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

Channel search is used to find channels based on a query that includes user input. Depending on your needs, it can be used to either find existing conversations, start new ones, or do both.

There are two ways to use the built-in search functionality:

  1. by enabling search in the `ChannelList` component with the [`showChannelSearch`](/chat/docs/sdk/react/components/core-components/channel_list#showchannelsearch/) prop,
  2. or by using the [`ChannelSearch`](/chat/docs/sdk/react/components/utility-components/channel_search/) component directly.

Whichever works better for you, the [`ChannelSearch`](/chat/docs/sdk/react/components/utility-components/channel_search/) component is the one that handles the UI logic.

In the first case, if youâre using the search functionality of the `ChannelList` component, the `ChannelSearch` is rendered by the `ChannelList`. You can still pass props to the underlying `ChannelSearch` through the [`additionalChannelSearchProps`](/chat/docs/sdk/react/components/core-components/channel_list#showchannelsearch/).

For example, you could enable search in the `ChannelList` (with the [`showChannelSearch`](/chat/docs/sdk/react/components/core-components/channel_list#showchannelsearch/) prop), and configure the search results to include both channels and users by passing settings in the [`additionalChannelSearchProps`](/chat/docs/sdk/react/components/core-components/channel_list#showchannelsearch/):


    <ChannelList
      filters={filters}
      sort={sort}
      options={options}
      showChannelSearch
      additionalChannelSearchProps={{ searchForChannels: true }}
    />

In the second case, if youâre using the [`ChannelSearch`](/chat/docs/sdk/react/components/utility-components/channel_search/) component directly, you can pass settings directly as props of the `ChannelSearch` component:


    <ChannelSearch searchForChannels />

The [`ChannelSearch`](/chat/docs/sdk/react/components/utility-components/channel_search/) component consists of the search bar (including the search input), the results header, and the results list (consisting of individual search results items).

![](/_astro/channel-search-anatomy.CQ0o3KxX_KRkAU.webp)

Each of these components can be overridden by passing custom components in the [`ChannelSearch` props](/chat/docs/sdk/react/components/utility-components/channel_search#Props/):


    <ChannelSearch
      SearchBar={CustomSearchBar}
      SearchInput={CustomInput}
      SearchResultsHeader={CustomHeader}
      SearchResultsList={CustomList}
      SearchResultItem={CustomItem}
    />

If youâre using the search functionality of the `ChannelList` components, you can pass the same custom components to the [`additionalChannelSearchProps`](/chat/docs/sdk/react/components/core-components/channel_list#showchannelsearch/):


    <ChannelList
      filters={filters}
      sort={sort}
      options={options}
      showChannelSearch
      additionalChannelSearchProps={{
        SearchBar: CustomSearchBar,
        SearchInput: CustomInput,
        SearchResultsHeader: CustomHeader,
        SearchResultsList: CustomList,
        SearchResultItem: CustomItem,
      }}
    />

Next, weâll take a closer look at some of these customization options. But first, we encourage you to explore the many out-of-the-box [customization options](/chat/docs/sdk/react/components/utility-components/channel_search/) that do not require you to provide custom components.

You can override the way each search result item is presented by providing a custom `SearchResultItem`.


    <ChannelSearch SearchResultItem={CustomSearchResultItem} />

Or:


    <ChannelList
      additionalChannelSearchProps={{
        SearchResultItem: CustomSearchResultItem,
      }}
    />
    // Don't forget to provide filter and sort options as well!

This component receives a search result item as a prop, which can be either a `UserResponse` or a `Channel` (if the [`searchForChannels`](/chat/docs/sdk/react/components/utility-components/channel_search#searchforchannels/) option is enabled).

Your custom implementation should be able to:

  1. Display both channel and user search result items.
  2. Provide visual feedback for an item focused with the arrow keys. We can do this by looking at the `focusUser` prop which contains the index of the currently selected item.
  3. When clicked, it should invoke the `selectResult` callback.

ReactCSS


    const CustomSearchResultItem = ({
      result,
      index,
      focusedUser,
      selectResult,
    }) => {
      const isChannel = result.cid;

      return (
        <button
          className={`search-result-item ${index === focusedUser ? "search-result-item_focused" : ""}`}
          onClick={() => selectResult(result)}
        >
          {isChannel ? (
            <>
              <span className="search-result-item__icon">#ï¸â£</span>
              {result.data?.name}
            </>
          ) : (
            <>
              <span className="search-result-item__icon">ð¤</span>
              {result.name ?? result.id}
            </>
          )}
        </button>
      );
    };


    .search-result-item {
      font: inherit;
      border: 0;
      background: none;
      padding: 10px 20px 10px 50px;
      text-align: left;
    }

    .search-result-item:not(:last-child) {
      border-bottom: 1px solid #dbdde1;
    }

    .search-result-item_focused {
      background: #dbdde1;
    }

    .search-result-item__icon {
      display: inline-block;
      width: 30px;
      margin-left: -30px;
    }

![](/_astro/channel-search-item.DQIWALX5_Z1AEKV9.webp)

You donât have to rely on the components provided in the SDK to implement search. For ultimate customization, itâs not too difficult to implement search from scratch. Youâll have to manage the state yourself, and use our low-level client methods to query for results, but the upside is that you can manipulate the results however you like.

See our client documentation to learn how to query for [channels](/chat/docs/react/query_channels/), [users](/chat/docs/react/query_users/), or [messages](/chat/docs/react/search/). As a quick reference, here are the queries we will be using:


    // Query at most 5 messaging channels where current user is a member,
    // by channel name:
    const channels = await client.queryChannels(
      {
        type: "messaging",
        name: { $autocomplete: query },
        members: { $in: [userId] },
      },
      { last_message_at: -1, updated_at: -1 },
      { limit: 5 },
    );


    // Query at most 5 users (except the current one), by user name or id:
    const { users } = await client.queryUsers(
      {
        $or: [{ id: { $autocomplete: query } }, { name: { $autocomplete: query } }],
        id: { $ne: userId },
      },
      { id: 1, name: 1 },
      { limit: 5 },
    );


    // Query at most 5 messages from the messaging channels where current user
    // is a member, by message text:
    const { results } = await client.search(
      { type: "messaging", members: { $in: [userId] } },
      query,
      {
        limit: 5,
      },
    );
    const messages = results.map((item) => item.message);

Next, letâs add some simple text input and some buttons to search for channels, users, or messages:

ReactCSS


    const CustomSearch = () => {
      const [query, setQuery] = useState("");

      return (
        <div className="search">
          <input
            type="search"
            className="search-input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          {query && (
            <div className="search-actions">
              <button type="button" className="search-button">
                #ï¸â£ Find "{query}" channels
              </button>
              <button type="button" className="search-button">
                ð¤ Find "{query}" users
              </button>
              <button type="button" className="search-button">
                ð¬ Look up "{query}" in messages
              </button>
            </div>
          )}
        </div>
      );
    };


    .search-input {
      width: 100%;
      border: 0;
      border-radius: 10px;
      background: #00000014;
      font: inherit;
      padding: 10px 15px;
    }

    .search-input::-webkit-search-cancel-button {
      appearance: none;
    }

    .search-actions {
      display: flex;
      flex-direction: column;
      margin: 10px 0 20px;
    }

    .search-button {
      background: #00000014;
      border: 0;
      border-bottom: 1px solid #dbdde1;
      padding: 10px 15px;
      cursor: pointer;
    }

    .search-button:first-child {
      border-radius: 10px 10px 0 0;
    }

    .search-button:last-child {
      border-radius: 0 0 10px 10px;
      border-bottom: 0;
    }

    .search-button:hover {
      background: #dbdde1;
    }

![](/_astro/channel-search.CBlbQHP6_1HayUO.webp)

So far, our `CustomSearch` component doesnât do anything. Letâs wire things up by adding click event listeners to the search buttons.

**A note about race conditions**

One thing we should be aware of is race conditions: we should either abort or discard the results of the previous request when making a new one, or prevent a user from making multiple requests at once. Better yet, use a query library like [TanStack Query](https://tanstack.com/query/latest) or [SWR](https://swr.vercel.app/) to make requests.

In this example, we will use a helper function that will protect us from race conditions:


    function useSearchQuery() {
      const [results, setResults] = useState(null);
      const [pending, setPending] = useState(false);
      const pendingRequestAbortController = useRef(null);

      const startNextRequestWithSignal = () => {
        pendingRequestAbortController.current?.abort();
        pendingRequestAbortController.current = new AbortController();
        return pendingRequestAbortController.current.signal;
      };

      const querySearchResults = async (fether) => {
        setPending(true);
        const signal = startNextRequestWithSignal();
        const results = await fether();

        if (!signal.aborted) {
          setResults(results);
          setPending(false);
        }
      };

      return { results, pending, querySearchResults };
    }

If youâre implementing the âsearch as you typeâ user experience, donât forget to debounce or throttle your search requests. Otherwise, you can quickly hit rate limits.


    import { useChatContext } from "stream-chat-react";

    const CustomSearch = () => {
      const { client } = useChatContext();
      const [query, setQuery] = useState("");
      const { results, pending, querySearchResults } = useSearchQuery();

      const handleChannelSearchClick = () => {
        querySearchResults(async () => {
          const channels = await client.queryChannels(
            {
              type: "messaging",
              name: { $autocomplete: query },
              members: { $in: [userId] },
            },
            { last_message_at: -1, updated_at: -1 },
            { limit: 5 },
          );

          return {
            entity: "channel",
            items: channels,
          };
        });
      };

      const handleUserSearchClick = () => {
        querySearchResults(async () => {
          const { users } = await client.queryUsers(
            {
              $or: [
                { id: { $autocomplete: query } },
                { name: { $autocomplete: query } },
              ],
              id: { $ne: userId },
            },
            { id: 1, name: 1 },
            { limit: 5 },
          );

          return {
            entity: "user",
            items: users,
          };
        });
      };

      const handleMessageSearchClick = () => {
        querySearchResults(async () => {
          const { results } = await client.search(
            { type: "messaging", members: { $in: [userId] } },
            query,
            { limit: 5 },
          );

          return {
            entity: "message",
            items: results.map((item) => item.message),
          };
        });
      };

      return (
        <div className="search">
          <input
            type="search"
            className="search-input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          {query && (
            <div className="search-actions">
              <button
                type="button"
                className="search-button"
                onClick={handleChannelSearchClick}
              >
                #ï¸â£ Find <strong>"{query}"</strong> channels
              </button>
              <button
                type="button"
                className="search-button"
                onClick={handleUserSearchClick}
              >
                ð¤ Find <strong>"{query}"</strong> users
              </button>
              <button
                type="button"
                className="search-button"
                onClick={handleMessageSearchClick}
              >
                ð¬ Look up <strong>"{query}"</strong> in messages
              </button>
            </div>
          )}
        </div>
      );
    };

Finally, we need to display the search results to the user. You can use components like `ChannelPreview` that come with the SDK, or you can create your own. Letâs create very simple preview components for channels, users, and messages:

ReactCSS


    const ChannelSearchResultPreview = ({ channel }) => (
      <li className="search-results__item">
        <div className="search-results__icon">#ï¸â£</div>
        {channel.data?.name}
      </li>
    );

    const UserSearchResultPreview = ({ user }) => (
      <li className="search-results__item">
        <div className="search-results__icon">ð¤</div>
        {user.name ?? user.id}
      </li>
    );

    const MessageSearchResultPreview = ({ message }) => (
      <li className="search-results__item">
        <div className="search-results__icon">ð¬</div>
        {message.text}
      </li>
    );

    const SearchResultsPreview = ({ results }) => {
      if (results.items.length === 0) {
        return <div class="search-results">ð¤·ââï¸ No results</div>;
      }

      return (
        <ul className="search-results">
          {results.entity === "channel" &&
            results.items.map((item) => (
              <ChannelSearchResultPreview key={item.cid} channel={item} />
            ))}
          {results.entity === "user" &&
            results.items.map((item) => (
              <UserSearchResultPreview key={item.id} user={item} />
            ))}
          {results.entity === "message" &&
            results.items.map((item) => (
              <MessageSearchResultPreview key={item.id} message={item} />
            ))}
        </ul>
      );
    };


    .search-results {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .search-results__item {
      padding-left: 30px;
    }

    .search-results__item:not(:last-child) {
      margin-bottom: 10px;
      padding-bottom: 10px;
      border-bottom: 1px solid #dbdde1;
    }

    .search-results__icon {
      display: inline-block;
      width: 30px;
      margin-left: -30px;
    }

![](/_astro/channel-search-channels.DpnES0qE_1r8dk6.webp)

![](/_astro/channel-search-users.BKMGobJ9_Za2FQB.webp)

![](/_astro/channel-search-messages.C4aMLLyF_ui6wB.webp)

What happens when you click on a search result depends on your desired user experience. If you click on a channel, it makes sense to set the channel as active. When clicking on a user, you may want to create or open a channel with a one-on-one conversation with the user. When clicking on a message, itâs probably expected that a relevant channel will be set as active and scrolled to the message.

Channel PreviewUser PreviewMessage Preview


    import { useChatContext } from "stream-chat-react";

    const ChannelSearchResultPreview = ({ channel }) => {
      const { setActiveChannel } = useChatContext();

      return (
        <li
          className="search-results__item"
          onClick={() => setActiveChannel(channel)}
        >
          <div className="search-results__icon">#ï¸â£</div>
          {channel.data?.name}
        </li>
      );
    };


    import { useChatContext } from "stream-chat-react";

    const UserSearchResultPreview = ({ user }) => {
      const { client, setActiveChannel } = useChatContext();

      const handleClick = async () => {
        const channel = client.channel("messaging", { members: [userId, user.id] });
        await channel.watch();
        setActiveChannel(channel);
      };

      return (
        <li className="search-results__item" onClick={handleClick}>
          <div className="search-results__icon">ð¤</div>
          {user.name ?? user.id}
        </li>
      );
    };


    import { useChatContext } from "stream-chat-react";

    const MessageSearchResultPreview = ({ message }) => {
      const history = useHistory(); // bring your own router of choice
      const { client, setActiveChannel } = useChatContext();

      const handleClick = async () => {
        if (message.channel) {
          const channel = client.channel(message.channel.type, message.channel.id);
          setActiveChannel(channel);
          await channel.state.loadMessageIntoState(message.id);
          history.replace(`${window.location.pathname}#${message.id}`);
        }
      };

      return (
        <li className="search-results__item" onClick={handleClick}>
          <div className="search-results__icon">ð¬</div>
          {message.text}
        </li>
      );
    };

    // Somewhere in your application code:
    const location = useLocation();
    const messageId = useMemo(() => new URL(location).hash.slice(1), [location]);
    <MessageList highlightedMessageId={messageId} />;

And thatâs it! Hereâs the complete code:

ReactCSS


    import { useChatContext } from "stream-chat-react";

    const CustomSearch = () => {
      const { client } = useChatContext();
      const [query, setQuery] = useState("");
      const { results, pending, querySearchResults } = useSearchQuery();
      // Use your favorite query library here ð

      const handleChannelSearchClick = async () => {
        querySearchResults(async () => {
          const channels = await client.queryChannels(
            {
              type: "messaging",
              name: { $autocomplete: query },
              members: { $in: [userId] },
            },
            { last_message_at: -1, updated_at: -1 },
            { limit: 5 },
          );

          return {
            entity: "channel",
            items: channels,
          };
        });
      };

      const handleUserSearchClick = async () => {
        querySearchResults(async () => {
          const { users } = await client.queryUsers(
            {
              $or: [
                { id: { $autocomplete: query } },
                { name: { $autocomplete: query } },
              ],
              id: { $ne: userId },
            },
            { id: 1, name: 1 },
            { limit: 5 },
          );

          return {
            entity: "user",
            items: users,
          };
        });
      };

      const handleMessageSearchClick = async () => {
        querySearchResults(async () => {
          const { results } = await client.search(
            { type: "messaging", members: { $in: [userId] } },
            query,
            { limit: 5 },
          );

          return {
            entity: "message",
            items: results.map((item) => item.message),
          };
        });
      };

      return (
        <div className="search">
          <input
            type="search"
            className="search-input"
            value={query}
            placeholder="Search"
            onChange={(event) => setQuery(event.target.value)}
          />
          {query && (
            <div className="search-actions">
              <button
                type="button"
                className="search-button"
                onClick={handleChannelSearchClick}
              >
                #ï¸â£ Find <strong>"{query}"</strong> channels
              </button>
              <button
                type="button"
                className="search-button"
                onClick={handleUserSearchClick}
              >
                ð¤ Find <strong>"{query}"</strong> users
              </button>
              <button
                type="button"
                className="search-button"
                onClick={handleMessageSearchClick}
              >
                ð¬ Look up <strong>"{query}"</strong> in messages
              </button>
            </div>
          )}

          {pending && <>Searching...</>}
          {results && <SearchResultsPreview results={results} />}
        </div>
      );
    };

    const ChannelSearchResultPreview = ({ channel }) => {
      const { setActiveChannel } = useChatContext();

      return (
        <li
          className="search-results__item"
          onClick={() => setActiveChannel(channel)}
        >
          <div className="search-results__icon">#ï¸â£</div>
          {channel.data?.name}
        </li>
      );
    };

    const UserSearchResultPreview = ({ user }) => {
      const { client, setActiveChannel } = useChatContext();

      const handleClick = async () => {
        const channel = client.channel("messaging", { members: [userId, user.id] });
        await channel.watch();
        setActiveChannel(channel);
      };

      return (
        <li className="search-results__item" onClick={handleClick}>
          <div className="search-results__icon">ð¤</div>
          {user.name ?? user.id}
        </li>
      );
    };

    const MessageSearchResultPreview = ({ message }) => {
      const history = useHistory(); // bring your own router of choice
      const { client, setActiveChannel } = useChatContext();

      const handleClick = async () => {
        if (message.channel) {
          const channel = client.channel(message.channel.type, message.channel.id);
          setActiveChannel(channel);
          await channel.state.loadMessageIntoState(message.id);
          history.replace(`${window.location.pathname}#${message.id}`);
        }
      };

      return (
        <li className="search-results__item" onClick={handleClick}>
          <div className="search-results__icon">ð¬</div>
          {message.text}
        </li>
      );
    };

    const SearchResultsPreview = ({ results }) => {
      if (results.items.length === 0) {
        return <>No results</>;
      }

      return (
        <ul className="search-results">
          {results.entity === "channel" &&
            results.items.map((item) => (
              <ChannelSearchResultPreview key={item.cid} channel={item} />
            ))}
          {results.entity === "user" &&
            results.items.map((item) => (
              <UserSearchResultPreview key={item.id} user={item} />
            ))}
          {results.entity === "message" &&
            results.items.map((item) => (
              <MessageSearchResultPreview key={item.id} message={item} />
            ))}
        </ul>
      );
    };


    .search-input {
      width: 100%;
      border: 0;
      border-radius: 10px;
      background: #00000014;
      font: inherit;
      padding: 10px 15px;
    }

    .search-input::-webkit-search-cancel-button {
      appearance: none;
    }

    .search-actions {
      display: flex;
      flex-direction: column;
      margin: 10px 0 20px;
    }

    .search-button {
      background: #00000014;
      border: 0;
      border-bottom: 1px solid #dbdde1;
      padding: 10px 15px;
      cursor: pointer;
    }

    .search-button:first-child {
      border-radius: 10px 10px 0 0;
    }

    .search-button:last-child {
      border-radius: 0 0 10px 10px;
      border-bottom: 0;
    }

    .search-button:hover {
      background: #dbdde1;
    }

    .search-results {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .search-results__item {
      padding-left: 30px;
    }

    .search-results__item:not(:last-child) {
      margin-bottom: 10px;
      padding-bottom: 10px;
      border-bottom: 1px solid #dbdde1;
    }

    .search-results__icon {
      display: inline-block;
      width: 30px;
      margin-left: -30px;
    }

[PreviousChannel List UI](/chat/docs/sdk/react/guides/customization/channel_list_preview/)[NextChannel Members and Online Status](/chat/docs/sdk/react/guides/channel-user-lists/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

Custom attachment types are a great way to extend chat functionality. Any component can be rendered to represent your custom attachment, so you can provide rich user experiences right in the chat.

In this example, we will create a custom attachment type to allow users to confirm and pay for their order without leaving the chat.

We assume that you have already created an application in the dashboard, and have an API key and secret ready. You should also have a messaging channel ready (ours is called `messaging:test-channel`), and two users as members of the channel. This is easy to set up using the Explorer in your dashboard.

In the code samples below the user with the ID `john-doe` plays the role of a sales representative, and `jane-doe` plays the role of a customer.

First, letâs send a message with a custom attachment type. An attachment can have any JSON payload. In our case, the payload contains the order number:


    {
      "type": "order",
      "orderId": 1337
    }

We can send a message using our Node.js client with a simple script. In real use cases, itâs either your backend or admin/agent frontend that will send a message with a custom attachment.


    // send-order.mjs:
    import { StreamChat } from "stream-chat";

    const serverClient = StreamChat.getInstance(API_KEY, API_SECRET);
    const channel = serverClient.channel("messaging", "test-channel");
    await channel.sendMessage({
      text: "Your order",
      attachments: [
        {
          type: "order",
          orderId: 1337,
        },
      ],
      user_id: "john-doe",
    });

Youâll need to provide your own API key and secret, and replace the channel and user id if necessary. Then youâll be able to run the script:


    node send-order.mjs

As a result, you should see the message saying âYour orderâ in the channel:

![](/_astro/payment-attachment-no-preview.BHLU2jlC_2kayIJ.webp)

However, youâll notice that the attachment itself is not rendered. This is because the SDK doesnât yet know how to display this custom attachment type. Weâll fix that next.

To support rendering custom attachment types, weâll create a small wrapper around the default `Attachment` component. The wrapper will only be responsible for rendering our custom attachment type, the rest weâll just pass on to the default implementation:

ReactCSS


    import { Attachment } from "stream-chat-react";

    const CustomAttachment = (props) => {
      if (props.attachments[0].type === "order") {
        return <OrderAttachment orderId={props.attachments[0].orderId} />;
      }

      return <Attachment {...props} />;
    };

    const OrderAttachment = (props) => {
      return <div className="order">ð Order #{props.orderId}</div>;
    };


    .order {
      padding: 8px 16px 16px;
      border-bottom: 1px solid #00000016;
    }

As usual, to override the default `Attachment` component with our wrapper, we pass it as a prop to the `Channel` component:


    import { Channel } from "stream-chat-react";

    <Channel Attachment={CustomAttachment}>{/* ... */}</Channel>;

![](/_astro/payment-attachment-start.DX3rNYV8_ZHOyqg.webp)

At this point, youâll want to add your custom logic to your component. You will probably want to fetch the order data, and integrate payment system components (like [React Stripe.js](https://docs.stripe.com/stripe-js/react)). In our example, weâll make some (fake) requests to mimic the order data fetching:

ReactCSS


    import { useQuery } from "@tanstack/react-query";

    const OrderAttachment = (props) => {
      const { data, isPending: isOrderLoading } = useQuery({
        queryKey: ["order", props.orderId],
        queryFn: async () => {
          const res = await fetch(`/api/order/${props.orderId}`);
          return await res.json();
        },
      });

      return (
        <div className="order">
          <h3 className="order-header">ð Order #{props.orderId}</h3>
          {isOrderLoading ? (
            <div className="order-placeholder">Loading...</div>
          ) : (
            <ul className="order-product-list">
              {data.products.map((product) => (
                <li key={product.id} className="order-product">
                  {product.name}
                  <span className="order-amount">&times; {product.amount}</span>
                </li>
              ))}
            </ul>
          )}
          <button type="button" className="order-confirm">
            Looks good!
          </button>
        </div>
      );
    };


    .order {
      padding: 8px 16px 16px;
      border-bottom: 1px solid #00000016;
    }

    .order-header {
      font-size: 1em;
      font-weight: normal;
      margin: 0;
    }

    .order-product-list {
      list-style: none;
      margin: 16px 0;
      padding: 0;
    }

    .order-product {
      font-weight: bold;
    }

    .order-product:not(:last-child) {
      margin-bottom: 4px;
    }

    .order-amount {
      float: right;
      margin-left: 2ex;
      font-weight: normal;
      opacity: 0.5;
    }

    .order-confirm {
      background: #005fff;
      color: #fff;
      font-weight: bold;
      padding: 8px 16px;
      border: 0;
      border-radius: 8px;
      cursor: pointer;
      width: 100%;
    }

    .order-placeholder {
      margin: 16px 0 32px;
      font-weight: bold;
    }

![](/_astro/payment-attachment-order.DCAtK5kr_Z1m3BA9.webp)

Once the order is complete, our custom component can display a special UI to prevent double payments. Or, your backend can update the message to replace the attachment with another one:


    import { useQuery, useMutation } from "@tanstack/react-query";
    import { useMessageContext } from "stream-chat-react";

    const OrderAttachment = (props) => {
      const { message } = useMessageContext();

      const { data, isPending: isOrderLoading } = useQuery({
        queryKey: ["order", props.orderId],
        queryFn: async () => {
          const res = await fetch(`/api/order/${props.orderId}`);
          return await res.json();
        },
      });

      const { mutate: confirmOrder, isPending: isOrderConfirming } = useMutation({
        mutateFn: async () => {
          await fetch(`/api/order/${props.orderId}/confirm`, {
            method: "POST",
            body: JSON.stringify({ messageId: message.id }),
          });
        },
      });

      return (
        <div className="order">
          <h3 className="order-header">ð Order #{props.orderId}</h3>
          {isOrderLoading ? (
            <div className="order-placeholder">Loading...</div>
          ) : (
            <ul className="order-product-list">
              {data.products.map((product) => (
                <li key={product.id} className="order-product">
                  {product.name}
                  <span className="order-amount">&times; {product.amount}</span>
                </li>
              ))}
            </ul>
          )}
          <button
            type="button"
            className="order-confirm"
            disabled={isOrderConfirming}
            onClick={() => confirmOrder()}
          >
            Looks good!
          </button>
        </div>
      );
    };


    // on your backend, once the order is finished:
    await serverClient.updateMessage(
      {
        id: req.body.messageId,
        attachments: [
          {
            type: "order-completed",
            orderId: 1337,
          },
        ],
        text: "Hurray! Your order is completed",
      },
      "john-doe",
    );

![](/_astro/payment-attachment-updated.BIiufq6s_1SbWMf.webp)

Finally, weâll add another custom attachment type to display completed orders:


    const CustomAttachment = (props) => {
      if (props.attachments[0].type === "order") {
        return <OrderAttachment orderId={props.attachments[0].orderId} />;
      }

      if (props.attachments[0].type === "order-completed") {
        return <OrderCompletedAttachment orderId={props.attachments[0].orderId} />;
      }

      return <Attachment {...props} />;
    };

    const OrderCompletedAttachment = (props) => {
      return (
        <div className="order">
          <h3 className="order-header">ð Order #{props.orderId}</h3>
          <div className="order-placeholder">Thank you for your order!</div>
        </div>
      );
    };

![](/_astro/payment-attachment-completed.DU20yXK2_TLTmm.webp)

And there it is! Use this example as a starting point for your own interactive user experiences right in the chat.

[PreviousGiphy Preview](/chat/docs/sdk/react/guides/customization/giphy_preview/)[NextEmoji Picker](/chat/docs/sdk/react/guides/customization/emoji_picker/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

With the release of v12 of our SDK weâre also releasing new thread functionality - specifically âthread viewâ, which consists of [`ThreadList`](/chat/docs/sdk/react/components/core-components/thread-list/) and [`Thread`](/chat/docs/sdk/react/components/core-components/thread/) components allowing your users to quickly go over threaded conversations theyâre part of. To implement this simple view see [thread and channel view guide](/chat/docs/sdk/react/components/utility-components/chat-view/).

Both [`Thread`](https://github.com/GetStream/stream-chat-js/blob/master/src/thread.ts) and [`ThreadManager`](https://github.com/GetStream/stream-chat-js/blob/master/src/thread_manager.ts) are new classes within [`stream-chat` package](https://www.npmjs.com/package/stream-chat) with own logic which updates their respective state objects to which integrators can subscribe to and render their UI accordingly. These classes (or rather instances of these classes) are utilised within React SDK. Read more about accessing state of these classes in our [SDK State Management documentation](/chat/docs/sdk/react/guides/sdk-state-management#thread-and-threadmanager/).

[`ThreadList`](/chat/docs/sdk/react/components/core-components/thread-list/) component represents a [`ThreadManager`](https://github.com/GetStream/stream-chat-js/blob/master/src/thread_manager.ts) instance while [`ThreadListItem`](/chat/docs/sdk/react/components/core-components/thread-list-item/) represents individual [`Thread`](https://github.com/GetStream/stream-chat-js/blob/master/src/thread.ts) instances. UI of both of these components reflects latest state of their appropriate âcontrollersâ but apart from communicating with their controllers via available methods these components do not manage any extra logic.

[`ThreadProvider`](/chat/docs/sdk/react/components/contexts/thread-context#threadprovider/) is an âadapterâ which allows existing [`Thread`](/chat/docs/sdk/react/components/core-components/thread/) component to consume methods and state of the [`Thread`](https://github.com/GetStream/stream-chat-js/blob/master/src/thread.ts) instance.


    <ThreadProvider thread={thread}>
      <Thread />
    </ThreadProvider>

`ChatView` is component itself and a set of components which allow for a drop-in implementation of different chat views - the channel view and thread view. This drop-in solution allows your users to easily switch between said views without having to implement such mechanism yourself. Read more about it in our [`ChatView` documentation](/chat/docs/sdk/react/components/utility-components/chat-view/).

We know that component overrides are 90% of our SDK and providing these overrides only through [`Channel`](/chat/docs/sdk/react/components/core-components/channel/) component isnât optimal. In the upcoming minor releases weâll be deprecating component overrides through individual component props and rather provide these overrides through `WithComponents`, you can read more about this component in our [`WithComponents` documentation](/chat/docs/sdk/react/components/contexts/component_context#withcomponents).

These components are no longer provided through the [`ComponentContext`](/chat/docs/sdk/react/components/contexts/component_context/) as default values but have moved to their respective components:

  * `Attachment`
  * `DateSeparator`
  * `Message`
  * `MessageSystem`
  * `reactionOptions`
  * `UnreadMessagesSeparator`

Previous solution for component overrides:


    const MessageInputUi1 = () => {
      /*...*/
    };
    const MessageInputUi2 = () => {
      /*...*/
    };

    <Channel Input={MessageInputUi1}>
      <Window>
        <MessageList />
        <MessageInput focus />
      </Window>
      <Thread Input={MessageInputUi2} virtualized />
    </Channel>;

Current solution utilising `WithComponents`:


    const MessageInputUi1 = () => {
      /*...*/
    };
    const MessageInputUi2 = () => {
      /*...*/
    };

    <Channel>
      <WithComponents overrides={{ Input: MessageInputUi1 }}>
        <Window>
          <MessageList />
          <MessageInput focus />
        </Window>
        <WithComponents overrides={{ Input: MessageInputUi2 }}>
          <Thread virtualized />
        </WithComponents>
      </WithComponents>
    </Channel>;

Until now the audio recordings were transcoded to audio/mp3. As of v12, the MIME-type audio/wav will be the default. You can still opt-in to MP3 and benefit from the reduced file size and bandwidth usage:

**Action required**
To opt into MP3 transcoding follow these steps:

  1. The library `@breezystack/lamejs` has to be installed as this is a peer dependency to `stream-chat-react`.



    npm install @breezystack/lamejs


    yarn add @breezystack/lamejs

  2. The MP3 encoder has to be imported separately as a plugin:



    import { MessageInput } from "stream-chat-react";
    import { encodeToMp3 } from "stream-chat-react/mp3-encoder";

    <MessageInput
      focus
      audioRecordingConfig={{ transcoderConfig: { encoder: encodeToMp3 } }}
    />;

Dialogs will be managed centrally. At the moment, this applies to display of `ReactionSelector` and `MessageActionsBox`. They will be displayed on a transparent overlay that prevents users from opening other dialogs in the message list. Once an option from a dialog is selected or the overlay is clicked, the dialog will disappear. This adjust brings new API and removes some properties from `MessageContextValue`.

* `isReactionEnabled` \- served to signal the permission to send reactions by the current user in a given channel. With the current permissions implementation, the permission can be determined by doing the following:



    import { useMessageContext } from "stream-chat-react";

    const { getMessageActions } = useMessageContext();
    const messageActions = getMessageActions();
    const canReact = messageActions.includes(MESSAGE_ACTIONS.react);

  * `onReactionListClick` \- handler function that toggled the open state of `ReactionSelector` represented by another removed value - `showDetailedReactions`
  * `showDetailedReactions` \- flag used to decide, whether the reaction selector should be shown or not
  * `reactionSelectorRef` \- ref to the root of the reaction selector component (served to control the display of the component)

Also prop `messageWrapperRef` was removed as part of the change from `MessageOptions` and `MessageActions` props.

On the other hand, the `Message` prop (configuration parameter) `closeReactionSelectorOnClick` is now available in the `MessageContextValue`.

If you used any of these values in your customizations, please make sure to adjust your implementation according to the newly recommended use of Dialog API in [Dialog management guide](/chat/docs/sdk/react/guides/dialog-management/).

To learn about the new API, please, take a look at our [Dialog management guide](/chat/docs/sdk/react/guides/dialog-management/).

The default `EmojiPickerIcon` has been moved to emojis plugin from which we already import `EmojiPicker` component.

**Action required**
In case you are importing `EmojiPickerIcon` in your code, make sure to adjust the import as follows:


    import { EmojiPickerIcon } from "stream-chat-react/emojis";

As of the version 12 of `stream-chat-react` the `MessageInputContext` will not expose the following state variables:

  * `fileOrder` \- An array of IDs for non-image uploaded attachments. Its purpose was just to keep order in which the attachments were added.
  * `imageOrder` \- An array of IDs for image uploaded attachments. Its purpose was just to keep order in which the attachments were added.
  * `fileUploads` \- A mapping of ID to attachment representing the uploaded non-image file.
  * `imageUploads` \- A mapping of ID to attachment representing the uploaded image file.

These four variablesâ purpose was to render the attachment previews in a given order. All the non-image attachments were assigned type `"file"` until the message was sent at which point the audio files were assigned type `"audio"` and video file type `"video"`. Also, the attachment objects structure used to change upon submission. Some keys were renamed and other just removed.

The shortcomings of the above approach have been adjusted as follows:

  1. All the attachments except the link preview attachments (objects that contain `og_scrape_url` attribute) are now stored in `attachments` array of `MessageInputContext`. Array keeps order and the attachment type can be determined by the `attachment.type` property.

  2. The previously removed âlocalâ data is now stored on each attachment object under `localMetadata` key. This key is removed upon submission. Every `localMetadata` object has to at least contain the `id` attribute that allows us to update or remove the given attachment from the state. The attachments that represent an uploaded file has to also include the `localMetadata.file` reference.

  3. Attachments representing uploaded files will be identified by the `file` attribute as `attachment.localMetadata.file`. Default attachment types recognized by the SDK are:

  * `audio`
  * `file`
  * `image`
  * `video`
  * `voiceRecording`

  4. The attachment `type` is assigned upon the upload and not upon the submission. Also, there is no renaming of attachment attributes upon submission, but the attachment objects are assigned the attributes that are kept from the upload until the submission. These attributes are:

  5. We have removed the following API tied to uploads state from the MessageInput state

  * `uploadFile` -> from now on, use `uploadAttachment`
  * `uploadImage` -> from now on, use `uploadAttachment`
  * `removeFile` -> from now on, use `removeAttachments`
  * `removeImage` -> from now on, use `removeAttachments`

The function `uploadNewFiles` has been kept.

To sum up, the attachments management API in MessageInput is from now on only:

  * `attachments` \- An array that keeps all the message attachment objects except for link previews that should be accessed via [`linkPreviews`](/chat/docs/sdk/react/components/contexts/message_input_context#linkpreviews/) (see the [guide on how to use `linkPreviews`](/chat/docs/sdk/react/guides/customization/link-previews/)).
  * `uploadAttachment` \- Uploads a single attachment. The provided attachment should contain a `localMetadata` object with `file` (references a `File` instance to be uploaded) and `id` properties.
  * `uploadNewFiles` \- Expects an array of `File` or `Blob` objects, generates an array of well-formed attachments and uploads the files with `uploadAttachment` function
  * `upsertAttachments` \- Expects an array of attachment object where each of those should contain `localMetadata.id`. Creates or updates the attachment attributes based on the given id in the `attachments` array of `MessageInputContext`.
  * `removeAttachments` \- Expects and array of strings representing attachment IDs and removes those attachment objects from the state.

**Action required**
Make sure you are not using any of the removed API elements (for example you have implemented a custom `AttachmentPreviewList`):

  * `fileOrder`
  * `imageOrder`
  * `fileUploads`
  * `imageUploads`
  * `uploadFile`
  * `uploadImage`
  * `removeFile`
  * `removeImage`

The components that display date and time are:

  * `DateSeparator` \- separates message groups in message lists
  * `EventComponent` \- displays system messages
  * `MessageTimestamp` \- displays the creation timestamp for a message in a message list

These components had previously default values for props like `format` or `calendar`. This setup required for a custom formatting to be set up via i18n service, the default values had to be nullified. For a better developer experience we decided to remove the default prop values and rely on default configuration provided via i18n translations. The value `null` is not a valid value for `format`, `calendar` or `calendarFormats` props.

**Action required**
If you are not using the default translations provided with the SDK, make sure to follow the [date & time formatting guide](/chat/docs/sdk/react/guides/date-time-formatting/) to verify that your dates are formatted according to your needs.

The `Avatar` styles are applied through CSS from the version 12 upwards. Therefore, the following changes were applied:

  1. Props `shape` and `size` were removed. Subsequently, the class `str-chat__avatar--${shape}` was removed.

  2. Another class we removed is `str-chat__avatar-image--loaded` that was applied to `img` element in the `Avatar` component.

  3. New prop `className` has been added to `Avatar`. Integrators can now optionally apply custom styles to custom classes.

  4. There have also been added new classes to `Avatar` root `div` in different components:

Component| `Avatar` root CSS class
---|---
`ChannelHeader`| `str-chat__avatar--channel-header`
`ChannelPreviewMessenger`| `str-chat__avatar--channel-preview`
`MessageStatus`| `str-chat__avatar--message-status`
`ReactionsList`| `stream-chat__avatar--reaction`
`QuotedMessage`| `str-chat__avatar--quoted-message-sender`
`SearchResultItem`| `str-chat__avatar--channel-preview`
`UserItem` rendered by `SuggestionListItem`| `str-chat__avatar--autocomplete-item`

  5. As a consequence of the `Avatar` props changes, the `TypingIndicator` prop `avatarSize` have been removed as well.

**Action required**
1\. Migrate CSS applied to `.str-chat__avatar--${shape}` or re-apply the class through `Avatar` `className` prop.
2\. Migrate CSS applied to `.str-chat__avatar-image--loaded` to `.str-chat__avatar-image` class.
3\. If needed, apply custom styles to newly added classes based on the component that renders the `Avatar`.

The prop boolean `hideOnThread` enabled us to control, whether class `str-chat__main-panel--hideOnThread` was attached to `Window` componentâs root `<div/>`. By assigning this class a CSS rule `display: none` in the default SDKâs stylesheet we hid the contents of `Window`. We decided to simplify the logic in this case:

  1. class `str-chat__main-panel--hideOnThread` was replaced by class `str-chat__main-panel--thread-open`
  2. the class `str-chat__main-panel--thread-open` is attached to the root `<div/>` always, when thread is open
  3. the default value of `hideOnThread` prop was `false` (`Window` contents was not hidden upon opening a thread) and so integrators still have to opt in to hiding the contents upon opening a thread by adding rule `display: none` to `str-chat__main-panel--thread-open` class

**Action required** If your application renders `Window` with `hideOnThread` enabled, and you want to keep this behavior add the following rule to your CSS:


    .str-chat__main-panel--thread-open {
      display: none;
    }

    .str-chat__main-panel--thread-open + .str-chat__thread {
      // occupy the whole space previously occupied by the main message list container
      flex: 1;
    }

Setting the `fullWidth` value to `true` let to assignment of class `str-chat__thread--full` to the `Thread` componentâs root `<div/>`. This class had support in the SDKâs legacy stylesheet only. With the approach of avoiding styling React components via props, the prop has been removed along with the legacy stylesheet. Read more about the the stylesheet removal in the section **Removal of deprecated components**.

The attachment rendering functions were replaced with their component equivalents:

**Action required**
Replace the render functions in your custom components with container components alternatives.

Rendering function| Component equivalent
---|---
`renderAttachmentWithinContainer`| `AttachmentWithinContainer`
`renderAttachmentActions`| `AttachmentActionsContainer`
`renderGallery`| `GalleryContainer`
`renderImage`| `ImageContainer`
`renderCard`| `CardContainer`
`renderAudio`| `AudioContainer`
`renderMedia`| `MediaContainer`

Until now, it was possible to import two stylesheets as follows:


    import "stream-chat-react/dist/css/v1/index.css";

Or


    import "stream-chat-react/dist/css/v2/index.css";

The legacy stylesheet has been removed from the SDK bundle, and therefore it is only possible to import one stylesheet from now on:


    import "stream-chat-react/dist/css/v2/index.css";

**Action required**
Make sure you are importing the default styles correctly as `import 'stream-chat-react/dist/css/v2/index.css';`

With the version 10 of `stream-chat-react` new stylesheet has been introduced. The stylesheet used previously became a legacy stylesheet. Legacy stylesheet had often times CSS classes and SDK components, that were not supported with the new stylesheet. Now, the legacy stylesheet and corresponding CSS classes and SDK component are being removed.

These changes will impact you only if you have imported the CSS as one of the following (you have used the legacy styles):


    import "stream-chat-react/css/index.css";


    import "@stream-io/stream-chat-css/dist/css/index.css";

Supporting two stylesheet lead to introduction of a flag `themeVersion` into the `ChatContext`. This flag is no more necessary and has been removed from the context value.

**Action required**
Make sure you are not using `themeVersion` in your custom components.

With legacy stylesheet we have removed legacy approach to applying styles via component props. Two `Chat` component props were removed as a consequence:

  * `customStyles`
  * `darkMode`

Also associated parts of code were removed:

  * `Theme` type
  * `useCustomStyles` hook

**Action required**
1\. The styles applied through `customStyles` should be applied through custom CSS.
2\. Theme (not only dark theme) can be through `Chat` prop `theme` instead of `darkMode`

* `AutocompleteSuggestionHeader` \- the up-to-date SDK markup does not count with a header in the `ChatAutoComplete` suggestion list

**Action required**
Make sure you are passing these custom components to the `Channel` component.

The following components are not available anymore as they were related to legacy stylesheet and are not used by the latest SDK components.

**Action required**
1\. Remove imports of these components from `stream-chat-react` in your custom components.
2\. If importing `SendIconV2` rename it to `SendIcon`.
3\. Remove the listed classes if used in your CSS.

Component| Details| Removed CSS classes
---|---|---
`ChatDown`| used to be rendered as the default for `LoadingErrorIndicator` by `ChannelListMessenger` (the default `ChannelList` UI component). The default is now a null component (renders `null`)| `str-chat__down` and `str-chat__down-main`
`DefaultSuggestionListHeader`| rendered only with legacy stylesheet in the `ChatAutoComplete`. As a consequence the `AutocompleteSuggestionHeader` prop has been removed from `Channel` props|
Icons rendered `Message` component when legacy styles applied| `ReplyIcon`, `DeliveredCheckIcon`, `ErrorIcon`|
Icons rendered `MessageInput` component when legacy styles applied| `EmojiIconLarge`, `EmojiIconSmall`, `FileUploadIcon`, `FileUploadIconFlat`, `SendIconV1` (`SendIconV2` renamed to `SendIcon`)|
`MessageInputSmall`| Used to be rendered in `Thread`, but was deprecated since v10 and replaced by `MessageInputFlat`| all the classes starting with `str-chat__small-message-input`
`UploadsPreview`| Used to be rendered in `MessageInput` but was deprecated since v10 and replaced with `AttachmentPreviewList`|
`FilePreviewer` was rendered by `UploadsPreview`| Used by component removed from the SDK|
`ImagePreviewer` was rendered by `UploadsPreview`| Used by component removed from the SDK|
`AttachmentIcon`| Not used by the SDK|
`PictureIcon`| Not used by the SDK|
`FileUploadButton`| Not used by the SDK|
`ImageUploadButton`| Not used by the SDK|
`ThumbnailPlaceholder`| Not used by the SDK|
`Thumbnail`| Not used by the SDK|

The `FileIcon` component does not accept argument `version` anymore. This parameter used to determine the file icon set. There were two sets - version `'1'` and `'2'`. The icons of version `'1'` have been rendered with legacy stylesheets in the SDK components. The icons displayed under the version `'1'` have been removed now.

**Action required**
Remove prop `version` if the `FileIcon` is used in your custom components.

We have removed classes that were used in the legacy CSS stylesheet only and thus are redundant. We recommend to use classes that were already available previously and are used by the SDK stylesheet:

**Action required**
Replace the removed classes with their alternatives in the custom CSS.

Component| Class removed| Class to be used instead
---|---|---
`MediaContainer`| `str-chat__attachment-media`| `str-chat__attachment`
suggestion list in `ReactTextAreaAutocomplete`| `rta__autocomplete`| `str-chat__suggestion-list-container`
`Avatar` root `<div/>`| `str-chat__avatar--circle`, `str-chat__avatar--square`, `str-chat__avatar--rounded`| `str-chat__avatar` possibly combined with custom class
`Avatar` element `<img/>`| `str-chat__avatar-image--loaded`|
`Channel` root `<div/>`| `str-chat-channel`| `str-chat__channel`
`ChannelHeader` root `<div/>`| `str-chat__header-livestream`| `str-chat__channel-header`
`ChannelHeader` root `<div/>` children| `str-chat__header-livestream-left`| `str-chat__channel-header-end`
`ChannelHeader` root `<div/>` children| `str-chat__header-livestream-left--title`| `str-chat__channel-header-title`
`ChannelHeader` root `<div/>` children| `str-chat__header-livestream-left--subtitle`| `str-chat__channel-header-subtitle`
`ChannelHeader` root `<div/>` children| `str-chat__header-livestream-left--members`| `str-chat__channel-header-info`
`ChannelList` root `<div/>`| `str-chat-channel-list`| `str-chat__channel-list`
`ChannelPreviewMessenger` root `<div/>` children| `str-chat__channel-preview-messenger--right`| `str-chat__channel-preview-end`
`SearchResults` root `<div/>` children| `str-chat__channel-search-container`| `str-chat__channel-search-result-list`
`SuggestionList` (rendered by `ChatAutoComplete`) container `<div/>`| `str-chat__emojisearch`| `str-chat__suggestion-list-container`
`SuggestionList` (rendered by `ChatAutoComplete`) root `<div/>`| `str-chat__emojisearch__list`| `str-chat__suggestion-list`
`SuggestionListItem` (rendered by `SuggestionList`) root `<div/>`| `str-chat__emojisearch__item`| `str-chat__suggestion-list-item`
`EmojiPicker` root `<div/>`| `str-chat__emojiselect-wrapper` (only applied with legacy styles)| `str-chat__message-textarea-emoji-picker`
`EmojiPicker` button| `str-chat__input-flat-emojiselect` (only applied with legacy styles)| `str-chat__emoji-picker-button`
`Emoji` (rendered by `Message`)| `inline-text-emoji`| the `<p/>` element has been removed, no substitute class
`MessageRepliesCountButton` (rendered by `Message`) root `<div/>`| `str-chat__message-simple-reply-button`| `str-chat__message-replies-count-button-wrapper`
`Message` wrapper `<div/>` around `MessageStatus` & `MessageTimestamp`| `str-chat__message-data`, `str-chat__message-simple-data`| `str-chat__message-metadata`
`QuotedMessage` root `<div/>`| `quoted-message`| `str-chat__quoted-message-preview`
`QuotedMessage` bubble| `quoted-message-inner`| `str-chat__quoted-message-bubble`
`EditMessageForm`| `str-chat__edit-message-form-options`| no alternative
`EditMessageForm`| `str-chat__fileupload-wrapper`| no alternative
`EditMessageForm`| `str-chat__input-fileupload`| no alternative
`MessageInputFlat` root `<div/>`| all classes starting with `str-chat__input-flat`| see the current implementation of `MessageInputFlat`
`QuotedMessagePreviewHeader` (rendered by `QuotedMessagePreviewHeader`) root `<div/>`| `quoted-message-preview-header`| `str-chat__quoted-message-preview-header`
`QuotedMessagePreviewHeader` (rendered by `QuotedMessagePreviewHeader`) child `<button/>`| `str-chat__square-button`| `str-chat__quoted-message-remove`
`QuotedMessagePreview` root `<div/>`| `quoted-message-preview`| no alternative
`QuotedMessagePreview`| `quoted-message-preview-content`| `str-chat__quoted-message-preview`
`QuotedMessagePreview`| `quoted-message-preview-content-inner`| `str-chat__quoted-message-bubble`
`MessageList`| `str-chat__thread--full`| no alternative
`InfiniteScroll` rendered by `MessageList`| `str-chat__reverse-infinite-scroll`| `str-chat__message-list-scroll`
`ScrollToBottomButton`| `str-chat__message-notification-right`| `str-chat__message-notification-scroll-to-latest`
`ScrollToBottomButton`| `str-chat__message-notification-scroll-to-latest-unread-count`| `str-chat__jump-to-latest-unread-count`
`ReactionsListModal`| `emoji`| `str-chat__message-reaction-emoji` or `str-chat__message-reaction-emoji--with-fallback`
`SimpleReactionList`| `str-chat__simple-reactions-list-tooltip`| no alternative - markup removal
`Thread`| `str-chat__list--thread`| `str-chat__thread-list`
`ThreadHeader`| `str-chat__square-button`| `str-chat__close-thread-button`
`TypingIndicator`| `str-chat__typing-indicator__avatars`| no alternative - markup removal

Migration to non-legacy styles leads to rendering of markup with the following classes:

**Action required**
Verify your app layout is not broken and adjust the CSS if necessary.

Class| Details
---|---
`str-chat__main-panel-inner`| A `<div/>` with this class wraps `MessageList` and `VirtualizedMessageList`

**Action required**
Import type alternatives if necessary.

Removed type| Details| To be used instead
---|---|---
`CustomMessageActionsType`| Props for component `CustomMessageActionsList`, that renders custom messages actions in `MessageActionsBox`| `CustomMessageActionsListProps`

The `TypingIndicator` component does not render avatars as it used to with legacy stylesheet. Therefore, its prop `Avatar` has been removed.

**Action optional**
Provide custom `TypingIndicator` through the `Channel` prop.

Version 12 targets browsers that support ES2020. In particular, the code includes `async` functions, optional chaining (`?.`), and nullish coalescing (`??`). These features have been supported by all major desktop and mobile browsers for years, so it made sense for us to raise the baseline.

The following browsers [support ES2020](https://caniuse.com/?feats=mdn-javascript_operators_optional_chaining,mdn-javascript_operators_nullish_coalescing,mdn-javascript_builtins_globalthis,es6-module-dynamic-import,bigint,mdn-javascript_builtins_promise_allsettled,mdn-javascript_builtins_string_matchall,mdn-javascript_statements_export_namespace,mdn-javascript_operators_import_meta) and should be able to run the SDK as-is:

  * Chrome 80 and later
  * Safari 14.1 and later on desktops, 14.5 and later on iOS
  * Edge 80 and later
  * Firefox 80 and later

If you need to support older browsers, you should transpile your bundle using `babel` or a similar tool.

**Action optional**
If youâre targeting browsers that donât support ES2020, use a transpilation tool like `babel` to process your bundle.

Prior to version 12, we included the browser bundle in the package, which could be added to the page using the `<script>` tag. We no longer ship the browser bundle.

Using the browser bundle was never recommended, and it was mostly for testing purposes. If you still want to quickly add the SDK using the `<script>` tag, you can use services such as <https://esm.sh/> or [https://www.unpkg.com/](https://unpkg.com/).

Installing the package from NPM and then bundling it with your application is still the best way to use the SDK.

[PreviousUpgrade to v13](/chat/docs/sdk/react/release-guides/upgrade-to-v13/)[NextUpgrade to v11](/chat/docs/sdk/react/release-guides/upgrade-to-v11/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

In this example, we will demonstrate how to utilize custom functions that run on hover and click events of a mentioned user in a message. We pass `onMentionsHover` and `onMentionsClick` functions as props to either the [`Channel`](/chat/docs/sdk/react/components/core-components/channel/), [`MessageList`](/chat/docs/sdk/react/components/core-components/message_list/) or [`VirtualizedMessagelist`](/chat/docs/sdk/react/components/core-components/virtualized_list/) components to achieve the desired result.

Both of the event handler functions receive apropriate event object as their first argument and an array of users mentioned within targeted message as their second argument. To target specific user we will need to acess [`event.target.dataset`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset) and look for `userId`.

In this example, weâll show how to properly target clicked user and display their name through `window.alert` dialog. Click handler can be helpful for when you need to navigate to userâs profile.


    import { Channel } from "stream-chat-react";
    import type { CustomMentionHandler } from "stream-chat-react";

    const handleMentionsClick: CustomMentionHandler = (event, mentionedUsers) => {
      const userId = event.target.dataset.userId;
      if (!userId) return;

      const user = mentionedUsers.find((user) => user.id === userId);

      window.alert(`Mentioned user: ${user.name || user.id}`);
    };

    export const WrappedChannel = ({ children }) => {
      return <Channel onMentionsClick={handleMentionsClick}>{children}</Channel>;
    };

For a simple hover example, we will randomly change the color of the mentioned user text. Through DOM manipulation, we can use the `target` field on the `event` to change the color.


    import { Channel } from "stream-chat-react";
    import type { CustomMentionHandler } from "stream-chat-react";

    const handleMentionsHover: CustomMentionHandler = (event) => {
      if (!event.target.dataset.userId) return;

      const randomColor = Math.floor(Math.random() * 16777215).toString(16);
      event.target.style.color = `#${randomColor}`;
    };

    export const WrappedChannel = ({ children }) => {
      return <Channel onMentionsHover={handleMentionsHover}>{children}</Channel>;
    };

If you wish to access certain contexts (like [`MessageContext`](/chat/docs/sdk/react/components/contexts/message_context/)) and have more control over what is being rendered and what other events youâd want to attach to specific mention elements then youâd use a custom [`Mention`](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Message/renderText/componentRenderers/Mention.tsx) component, see [_Custom Element Rendering_](/chat/docs/sdk/react/components/message-components/render-text#custom-element-rendering/) for more information.

[PreviousReactions Customization](/chat/docs/sdk/react/guides/theming/reactions/)[NextMessage Actions](/chat/docs/sdk/react/guides/theming/actions/message_actions/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

In this comprehensive example, we demonstrate how to build a live location sharing feature. Chat users will have the ability to send their location to a channel and display it through a custom `Attachment` component that displays coordinates using the [Google Maps API](https://developers.google.com/maps/documentation/javascript/overview).

The feature flow has three distinct steps:

  * Click `Share Location` button with confirmation dialog
  * Confirm, send and register a message for live location updates
  * Render coordinates on a Google Maps overlay sent as a message attachment

Weâve prepared an example geolocation context/controller that weâll be referencing throughout the guide. This controller takes care of registering and updating messages with the current location. Note that this is an _example_ controller that should be expanded on based on your needs and requirements. This controller is missing logic such as end-of-life of the messages with live location updates, manually stopping location updates, limiting the amount of messages with live location updates or proper error handling. Treat it as a baseline to get you started.

If you wish to use only one-time location sharing functionality, you donât need `GeoLocContext` controller/context and can safely omit it.

The first step in our location sharing flow is to add a custom button beside message input that on click allows a chat user to begin the process of sending their coordinates to the channel.

In this example, our custom handler function will utilise `window.confirm` dialog to get the user confirmation before requesting location data.

Weâll be using `registerMessageIds` function from our pre-defined `GeoLocContext` to save messages to a `localStorage` to be later loaded in case of a page reload so that we can keep sharing our location.

ReactCSS

custom-components.tsx


    import { MessageInput, useChannelStateContext } from "stream-chat-react";

    import { useGeoLocContext } from "./geo-loc-context";

    import "./message-input-with-location-button.css";

    export const MessageInputWithLocationButton = () => {
      const { channel } = useChannelStateContext();
      const { registerMessageIds } = useGeoLocContext();

      return (
        <div className="message-input-container">
          <MessageInput focus />
          <button
            onClick={() => {
              const shouldShareLocation = window.confirm(
                "Would you like to share your location?",
              );

              if (!shouldShareLocation) return;

              navigator.geolocation.getCurrentPosition(
                ({ coords: { latitude, longitude } }) => {
                  channel
                    .sendMessage({
                      attachments: [
                        {
                          type: "location",
                          latitude,
                          longitude,
                        },
                      ],
                    })
                    .then((response) => {
                      registerMessageIds([response.message.id]);
                    });
                },
                console.log,
                { maximumAge: 0, timeout: 500 },
              );
            }}
            className="location-share-button"
          >
            ðºï¸
          </button>
        </div>
      );
    };

message-input-with-location-button.css


    .message-input-container {
      display: flex;
    }

    .location-share-button {
      border-radius: 9999px;
      margin: 5px 5px 5px 0px;
      line-height: 1;
      padding: 5px 10px;
    }

![](/_astro/geolocation-attachment-0.CTqfBgqN_Z1gYvM5.webp)

![](/_astro/geolocation-attachment-1.DM8Cu025_1o30qC.webp)

Now that weâre able to send a message with an attachment of type `location`, we need to build a custom `Attachment` component that can this new type. If a message attachment is not of type `location`, meaning itâs a standard library type, we return the default `Attachment` component.

When our custom component receives an attachment of type `location`, we pass the geolocation coordinates to the `Map` and `Marker` components from [`@vis.gl/react-google-maps`](https://www.npmjs.com/package/@vis.gl/react-google-maps). This library is a React-based wrapper around the Google Maps API and displays a map and geolocation as a React component. See the [`@vis.gl/react-google-maps`](https://www.npmjs.com/package/@vis.gl/react-google-maps) documentation for more information.

In order to interact with the Google Maps API, you must [set up an account](https://developers.google.com/maps/documentation/javascript/cloud-setup) and generate an API key.

custom-components.tsx


    import { Attachment } from "stream-chat-react";
    import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";

    import type { AttachmentProps } from "stream-chat-react";

    const GOOGLE_MAPS_API_KEY = "key";

    export const AttachmentWithMap = (props: AttachmentProps) => {
      const [locationAttachment] = props.attachments;

      if (locationAttachment.type === "location") {
        const { latitude, longitude } = locationAttachment;

        return (
          <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
            <Map
              style={{ width: "300px", height: "300px" }}
              defaultCenter={{ lat: latitude, lng: longitude }}
              defaultZoom={16}
              disableDefaultUI={true}
              gestureHandling="greedy"
            >
              <Marker position={{ lat: latitude, lng: longitude }} />
            </Map>
          </APIProvider>
        );
      }

      return <Attachment {...props} />;
    };

Now that each individual piece has been constructed, we can assemble all of the snippets into the final code example.

app.tsx


    import { Chat, ChannelList, Channel, Window, Thread } from "stream-chat-react";

    import {
      AttachmentWithMap,
      MessageInputWithLocationButton,
    } from "./custom-components";
    import { GeoLocContextProvider } from "./geo-loc-context";

    const App = () => {
      const chatClient = useCreateChatClient(/*...*/);

      if (!chatClient) return <div>Loading...</div>;

      return (
        <Chat client={chatClient}>
          <ChannelList />
          <Channel Attachment={AttachmentWithMap}>
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInputWithLocationButton />
            </Window>
            <Thread />
          </Channel>
        </Chat>
      );
    };

![](/_astro/geolocation-attachment-2.0fMlNyRy_VF6BL.webp)

geo-loc-context.tsx


    import React, {
      useState,
      useEffect,
      useCallback,
      useRef,
      useContext,
    } from "react";
    import { useChatContext } from "stream-chat-react";

    import type { PropsWithChildren } from "react";

    type GeoLocContextValue = {
      registeredMessageIds: string[];
      registerMessageIds: (messageIds: string[]) => void;
      unregisterMessageIds: (messageIds: string[]) => void;
    };

    const GeoLocContext = React.createContext<GeoLocContextValue>({
      registeredMessageIds: [],
      registerMessageIds: () => {},
      unregisterMessageIds: () => {},
    });

    export const useGeoLocContext = () => useContext(GeoLocContext);

    const constructStorageKey = (userId: string) => {
      return `$geoloc.registeredMessageIds-${userId}`;
    };

    export const GeoLocContextProvider = ({ children }: PropsWithChildren) => {
      const { client } = useChatContext();

      const [registeredMessageIds, setRegisteredMessageIds] = useState(() => {
        const registeredMessageIdsString = window.localStorage.getItem(
          constructStorageKey(client.userID!),
        );

        if (!registeredMessageIdsString) return [];

        try {
          const messageIds = JSON.parse(atob(registeredMessageIdsString));

          return messageIds as unknown as string[];
        } catch (error) {
          console.log(error);
          return [];
        }
      });

      const registerMessageIds = useCallback((messageIds: string[]) => {
        setRegisteredMessageIds((currentMessageIds) =>
          currentMessageIds.concat(messageIds),
        );
      }, []);

      const unregisterMessageIds = useCallback((messageIds: string[]) => {
        setRegisteredMessageIds((currentMessageIds) =>
          currentMessageIds.filter((messageId) => !messageIds.includes(messageId)),
        );
      }, []);

      const handlePositionChangeRef =
        useRef<(position: GeolocationPosition) => Promise<void>>();

      handlePositionChangeRef.current = async (position) => {
        const settled = await Promise.allSettled(
          registeredMessageIds.map((messageId) =>
            client.partialUpdateMessage(messageId, {
              set: {
                attachments: [
                  {
                    type: "location",
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                  },
                ],
              },
            }),
          ),
        );

        const idsToDelete = [];
        for (let index = 0; index < settled.length; index++) {
          if (settled[index].status !== "rejected") continue;
          idsToDelete.push(registeredMessageIds[index]);
        }

        unregisterMessageIds(idsToDelete);
      };

      useEffect(() => {
        // sync storage
        const oldValue = window.localStorage.getItem(
          constructStorageKey(client.userID!),
        );
        const newValue = btoa(JSON.stringify(registeredMessageIds));

        if (newValue === oldValue) return;

        window.localStorage.setItem(constructStorageKey(client.userID!), newValue);
      }, [client, registeredMessageIds]);

      const shouldWatch = registeredMessageIds.length !== 0;

      useEffect(() => {
        let promise: Promise<void> | null = null;

        if (!shouldWatch) return;

        const position = navigator.geolocation.watchPosition(
          (newPosition) => {
            if (promise) return;

            promise = handlePositionChangeRef.current!(newPosition).finally(() => {
              promise = null;
            });
          },
          console.log,
          { enableHighAccuracy: true },
        );

        return () => {
          navigator.geolocation.clearWatch(position);
        };
      }, [shouldWatch]);

      return (
        <GeoLocContext.Provider
          value={{ registeredMessageIds, registerMessageIds, unregisterMessageIds }}
        >
          {children}
        </GeoLocContext.Provider>
      );
    };

[PreviousImage Gallery](/chat/docs/sdk/react/guides/customization/image_gallery/)[NextGiphy Preview](/chat/docs/sdk/react/guides/customization/giphy_preview/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

In this example, we will demonstrate how to build a custom `TypingIndicator` using the default component as a guide.

Using the `typing` object provided by the `TypingContext`, we can access the `name` and `role` of users currently typing in a channel. The `threadList` prop will allow us to conditionally render the typing indicator in the main message list, or at the bottom of a thread.


    export const CustomTypingIndicator = (props: TypingIndicatorProps) => {
      const { threadList } = props;

      const { channelConfig, thread } = useChannelStateContext();
      const { client } = useChatContext();
      const { typing = {} } = useTypingContext();

      if (channelConfig?.typing_events === false) {
        return null;
      }

      const typingInChannel = !threadList
        ? Object.values(typing).filter(
            ({ parent_id, user }) => user?.id !== client.user?.id && !parent_id,
          )
        : [];

      const typingInThread = threadList
        ? Object.values(typing).filter(
            ({ parent_id, user }) =>
              user?.id !== client.user?.id && parent_id === thread?.id,
          )
        : [];

      return (
        <div
          className={`str-chat__typing-indicator ${
            (threadList && typingInThread.length) ||
            (!threadList && typingInChannel.length)
              ? "str-chat__typing-indicator--typing"
              : ""
          }`}
        >
          <div className="str-chat__typing-indicator__avatars">
            {(threadList ? typingInThread : typingInChannel).map(({ user }, i) => (
              <div className="username">
                <div className="typing-indicator-name">{user?.name}</div>
                <div className="typing-indicator-role ">{user?.role}</div>
              </div>
            ))}
          </div>
          <div className="str-chat__typing-indicator__dots">
            <div className="str-chat__typing-indicator__dot" />
            <div className="str-chat__typing-indicator__dot" />
            <div className="str-chat__typing-indicator__dot" />
          </div>
        </div>
      );
    };


    .str-chat__typing-indicator__dots {
      border: none;
      display: flex;
      margin-left: 0;
      width: fit-content;
    }

    .str-chat__typing-indicator__dot {
      background: var(--grey);
      opacity: 1;
      height: 4px;
      width: 4px;
      border-radius: var(--border-radius-round);
      display: flex;
    }

    .str-chat__typing-indicator__dot:nth-child(3) {
      opacity: 1;
    }

    .str-chat__typing-indicator__dot:nth-child(2) {
      opacity: 1;
    }

    .typing-indicator-name {
      font-weight: var(--font-weight-bold);
      color: var(--grey);
    }
    .typing-indicator-role {
      font-weight: var(--font-weight-regular);
      color: var(--grey-whisper);
      margin-left: var(--xxs-m);
    }

    .username {
      display: flex;
    }

From here, all we need to do is override the default component in `Channel`:


    <Channel TypingIndicator={CustomTypingIndicator}>
      {/* children of Channel component */}
    </Channel>

![Custom Typing Indicator UI Component for Chat](/_astro/TypingIndicator.DD3-z7uQ_Z1BQlyu.webp)

[PreviousAutocomplete Suggestions](/chat/docs/sdk/react/guides/customization/suggestion_list/)[NextAttachment Actions](/chat/docs/sdk/react/guides/theming/actions/attachment_actions/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

In this example, we connect several different parts of the library to create a user experience where we add custom attachment actions to uploaded images. Images will render with âLoveâ and âLoatheâ buttons, which on click will post reactions on the message. While this example might not represent a common use case, this demo is meant to highlight the flexibility of the library and show how custom features can be built on top of the existing code.

The first step is to create an array of custom actions that will populate the [`AttachmentActions`](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Attachment/AttachmentActions.tsx) component when sending an image attachment. The `Action` type comes from the `stream-chat` JavaScript client and conforms to the following:


    export type Action = {
      name?: string;
      style?: string;
      text?: string;
      type?: string;
      value?: string;
    };

As you can tell, the `Action` type has no required values. We are going to simulate a voting feature and trigger the UI on âLoveâ and âLoatheâ potential actions. Our custom actions array becomes the following:


    const attachmentActions: Action[] = [
      { name: "vote", value: "Love" },
      { name: "vote", value: "Loathe" },
    ];

Next, we create a custom [`AttachmentActions`](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Attachment/AttachmentActions.tsx) component to render and display our custom actions. If a chat user uploads an image file, weâll trigger custom logic. Otherwise, weâll render the default library component.

Our custom component will receive the attachment `type` and the `actions` (if any) via props. Weâll manually add the actions later in the demo, but for now, know their value will reference our custom array defined above.

If an image attachment is uploaded, we map over the custom actions array and return HTML `button` elements with `action.value` as the text. Click events on these buttons will post reactions to the message, using the `handleReaction` function drawn from the `useMessageContext` custom hook.


    import React from "react";
    import { AttachmentActions } from "stream-chat-react";
    import type { AttachmentActionsProps } from "stream-chat-react";

    const CustomAttachmentActions = (props: AttachmentActionsProps) => {
      const { actions, type } = props;

      const { handleReaction } = useMessageContext();

      const handleClick = async (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        value?: string,
      ) => {
        try {
          if (value === "Love") await handleReaction("love", event);
          if (value === "Loathe") await handleReaction("angry", event);
        } catch (err) {
          console.log(err);
        }
      };

      if (type === "image") {
        return (
          <>
            {actions.map((action) => (
              <button
                className={`action-button ${action.value === "Love" ? "love" : ""}`}
                onClick={(event) => handleClick(event, action.value)}
              >
                {action.value}
              </button>
            ))}
          </>
        );
      }

      return <AttachmentActions {...props} />;
    };

In order to render our `CustomAttachmentActions` component, we need to supply it as a prop to the [`Attachment`](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Attachment/Attachment.tsx) component. The resulting `CustomAttachment` component is then added to `Channel`, so it can be injected into the `ComponentContext` and consumed within the [Message UI](/chat/docs/sdk/react/components/message-components/message_ui/) component.


    const CustomAttachment: React.FC<AttachmentProps> = (props) => (
      <Attachment {...props} AttachmentActions={CustomAttachmentActions} />
    );

    <Channel Attachment={CustomAttachment}>
      {/* children of Channel component */}
    </Channel>;

To add our `attachmentActions` to an uploaded image and trigger the render of the `CustomAttachmentActions` component, we provide custom logic to message composition before the message is sent to the server:


    import { isImageAttachment } from "stream-chat";
    import type {
      Action,
      Attachment,
      MessageComposerMiddlewareState,
      MessageDraftComposerMiddlewareValueState,
      MiddlewareHandlerParams,
    } from "stream-chat";

    const attachmentActions: Action[] = [
      { name: "vote", value: "Love" },
      { name: "vote", value: "Loathe" },
    ];

    const enrichAttachmentsWithActions = (attachments: Attachment[]) =>
      attachments.map((att) =>
        isImageAttachment(att) ? { ...att, actions: attachmentActions } : att,
      );

    const attachmentEnrichmentMiddleware = {
      id: "custom/message-composer-middleware/attachments-enrichment",
      handlers: {
        compose: ({
          state,
          next,
          forward,
        }: MiddlewareHandlerParams<MessageComposerMiddlewareState>) => {
          const { attachmentManager } = composer;
          if (!attachmentManager) return forward();
          const attachments = enrichAttachmentsWithActions(state.attachments ?? []);

          return next({
            ...state,
            localMessage: {
              ...state.localMessage,
              attachments,
            },
            message: {
              ...state.message,
              attachments,
            },
          });
        },
      },
    };

    const draftAttachmentEnrichmentMiddleware = {
      id: "custom/message-composer-middleware/draft-attachments-enrichment",
      handlers: {
        compose: ({
          state,
          next,
          forward,
        }: MiddlewareHandlerParams<MessageDraftComposerMiddlewareValueState>) => {
          const { attachmentManager } = composer;
          if (!attachmentManager) return forward();

          return next({
            ...state,
            draft: {
              ...state.draft,
              attachments: enrichAttachmentsWithActions(state.attachments ?? []),
            },
          });
        },
      },
    };

    const App = () => {
      const client = useCreateChatClient({
        apiKey,
        tokenOrProvider: userToken,
        userData: { id: userId },
      });

      useEffect(() => {
        if (!client) return;

        client.setMessageComposerSetupFunction(({ composer }) => {
          composer.compositionMiddlewareExecutor.insert({
            middleware: [attachmentEnrichmentMiddleware],
            position: {
              after: "stream-io/message-composer-middleware/attachments",
            },
          });
          composer.draftCompositionMiddlewareExecutor.insert({
            middleware: [draftAttachmentEnrichmentMiddleware],
            position: {
              after: "stream-io/message-composer-middleware/draft-attachments",
            },
          });
        });
      }, [client]);

      if (!client) return <>Loading...</>;

      return (
        <Chat client={client}>
          <ChannelList />
          <Channel Attachment={CustomAttachment}>
            {/* children of Channel component */}
          </Channel>
        </Chat>
      );
    };

.action-button {
      height: 40px;
      width: 100px;
      border-radius: 16px;
      color: #ffffff;
      background: red;
      font-weight: 700;
      font-size: 1.2rem;
    }

    .action-button.love {
      background-color: green;
    }


    import React from "react";
    import { isImageAttachment } from "stream-chat";
    import {
      AttachmentActions,
      Attachment as AttachmentComponent,
    } from "stream-chat-react";
    import type {
      Action,
      Attachment,
      MessageComposerMiddlewareState,
      MessageDraftComposerMiddlewareValueState,
      MiddlewareHandlerParams,
    } from "stream-chat";
    import type { AttachmentActionsProps, AttachmentProps } from "stream-chat";

    const CustomAttachmentActions = (props: AttachmentActionsProps) => {
      const { actions, type } = props;

      const { handleReaction } = useMessageContext();

      const handleClick = async (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        value?: string,
      ) => {
        try {
          if (value === "Love") await handleReaction("love", event);
          if (value === "Loathe") await handleReaction("angry", event);
        } catch (err) {
          console.log(err);
        }
      };

      if (type === "image") {
        return (
          <>
            {actions.map((action) => (
              <button
                className={`action-button ${action.value === "Love" ? "love" : ""}`}
                onClick={(event) => handleClick(event, action.value)}
              >
                {action.value}
              </button>
            ))}
          </>
        );
      }

      return <AttachmentActions {...props} />;
    };

    const CustomAttachment = (props: AttachmentProps) => (
      <AttachmentComponent {...props} AttachmentActions={CustomAttachmentActions} />
    );

    const attachmentActions: Action[] = [
      { name: "vote", value: "Love" },
      { name: "vote", value: "Loathe" },
    ];

    const enrichAttachmentsWithActions = (attachments: Attachment[]) =>
      attachments.map((att) =>
        isImageAttachment(att) ? { ...att, actions: attachmentActions } : att,
      );

    const attachmentEnrichmentMiddleware = {
      id: "custom/message-composer-middleware/attachments-enrichment",
      handlers: {
        compose: ({
          state,
          next,
          forward,
        }: MiddlewareHandlerParams<MessageComposerMiddlewareState>) => {
          const { attachmentManager } = composer;
          if (!attachmentManager) return forward();
          const attachments = enrichAttachmentsWithActions(state.attachments ?? []);

          return next({
            ...state,
            localMessage: {
              ...state.localMessage,
              attachments,
            },
            message: {
              ...state.message,
              attachments,
            },
          });
        },
      },
    };

    const draftAttachmentEnrichmentMiddleware = {
      id: "custom/message-composer-middleware/draft-attachments-enrichment",
      handlers: {
        compose: ({
          state,
          next,
          forward,
        }: MiddlewareHandlerParams<MessageDraftComposerMiddlewareValueState>) => {
          const { attachmentManager } = composer;
          if (!attachmentManager) return forward();

          return next({
            ...state,
            draft: {
              ...state.draft,
              attachments: enrichAttachmentsWithActions(state.attachments ?? []),
            },
          });
        },
      },
    };

    const App = () => {
      useEffect(() => {
        if (!client) return;

        client.setMessageComposerSetupFunction(({ composer }) => {
          composer.compositionMiddlewareExecutor.insert({
            middleware: [attachmentEnrichmentMiddleware],
            position: {
              after: "stream-io/message-composer-middleware/attachments",
            },
          });
          composer.draftCompositionMiddlewareExecutor.insert({
            middleware: [draftAttachmentEnrichmentMiddleware],
            position: {
              after: "stream-io/message-composer-middleware/draft-attachments",
            },
          });
        });
      }, [client]);

      return (
        <Chat client={client}>
          <ChannelList />
          <Channel Attachment={CustomAttachment}>
            {/* children of Channel component */}
          </Channel>
        </Chat>
      );
    };

**The rendered message before action click:**

![Attachment Actions 1](/_astro/AttachmentActions1.DukuciMT_2ed4Lj.webp)

**The rendered message after action click:**

![Attachment Actions 2](/_astro/AttachmentActions2.B2FQCsGk_Z1pc7GC.webp)

[PreviousTyping Indicator](/chat/docs/sdk/react/guides/customization/typing_indicator/)[NextImage Gallery](/chat/docs/sdk/react/guides/customization/image_gallery/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

In this guide weâll show you how to add `EmojiPicker` component to your chat application as no chat experience is complete without emojis.

Our `EmojiPicker` is built on top of `emoji-mart` so letâs begin with installing `emoji-mart`-related packages (make sure they meet our [peer-dependency requirements](https://github.com/GetStream/stream-chat-react/blob/v11.0.0/package.json#L97-L99)):


    yarn add emoji-mart @emoji-mart/data @emoji-mart/react

The SDK `EmojiPicker` carries both button and the actual picker components and owns its âopenâ state.


    import { Channel } from "stream-chat-react";
    import { EmojiPicker } from "stream-chat-react/emojis";

    const WrappedChannel = ({ children }) => {
      return <Channel EmojiPicker={EmojiPicker}>{children}</Channel>;
    };

![Default EmojiPicker Component](/_astro/default-emoji-picker.DdYTzhgM_13MvjA.webp)

If `emoji-mart` is too heavy for your use-case and youâd like to build your own you can certainly do so, hereâs a very simple `EmojiPicker` example built using native emojis:


    import { useMessageInputContext } from "stream-chat-react";

    const emojis = ["ð³", "ð¥", "ð¥", "ð§", "ð¥", "ð©"];

    export const CustomEmojiPicker = () => {
      const [open, setOpen] = useState(false);

      const { insertText, textareaRef } =
        useMessageInputContext("CustomEmojiPicker");

      return (
        <div
          id="emoji-picker"
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "flex-end",
          }}
        >
          {open && (
            <div
              style={{
                position: "absolute",
                top: "-20px",
                background: "orangered",
                padding: "2px",
              }}
            >
              {emojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    insertText(emoji);
                    textareaRef.current?.focus(); // returns focus back to the message input element
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          <button onClick={() => setOpen((isOpen) => !isOpen)}>ð´</button>
        </div>
      );
    };

![Preview of the custom EmojiPicker component](/_astro/custom-emoji-picker.C-PRz3gu_Z1m3YeU.webp)

[PreviousOrder and Payment Attachment](/chat/docs/sdk/react/guides/theming/actions/payment_attachment/)[NextApp Menu](/chat/docs/sdk/react/guides/customization/app_menu/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

In this guide we will learn how date and time formatting can be customized within SDKâs components.

The following components provided by the SDK display datetime:

  * `DateSeparator`\- component separating groups of messages in message lists
  * `EventComponent` \- component that renders system messages (`message.type === 'system'`)
  * `Timestamp` \- component to display non-system message timestamp

The datetime format customization can be done on multiple levels:

  1. Component prop values
  2. Supply custom formatting function
  3. Format date via i18n

All the mentioned components accept timestamp formatter props:


    export type TimestampFormatterOptions = {
      /* If true, call the `Day.js` calendar function to get the date string to display (e.g. "Yesterday at 3:58 PM"). */
      calendar?: boolean;
      /* Object specifying date display formats for dates formatted with calendar extension. Active only if calendar prop enabled. */
      calendarFormats?: Record<string, string>;
      /* Overrides the default timestamp format if calendar is disabled. */
      format?: string;
    };

If calendar formatting is enabled, the dates are formatted with time-relative words (âyesterday at â¦â, âlast â¦â). The calendar strings can be further customized with `calendarFormats` object. The `calendarFormats` object has to cover all the formatting cases as shows the example below:


    {
      "lastDay": "[gestern um] LT",
      "lastWeek": "[letzten] dddd [um] LT",
      "nextDay": "[morgen um] LT",
      "nextWeek": "dddd [um] LT",
      "sameDay": "[heute um] LT",
      "sameElse": "L"
    }

If any of the `calendarFormats` keys are missing, then the underlying library will fall back to hard-coded english equivalents

If `calendar` formatting is enabled, the `format` prop would be ignored. So to apply the `format` string, the `calendar` has to be disabled (applies to `DateSeparator` and `MessageTimestamp`).

All the components can be overridden through `Channel` component context:


    import {
      Channel,
      DateSeparatorProps,
      DateSeparator,
      EventComponentProps,
      EventComponent,
      MessageTimestampProps,
      MessageTimestamp,
    } from "stream-chat-react";

    const CustomDateSeparator = (props: DateSeparatorProps) => (
      <DateSeparator {...props} calendar={false} format={"YYYY"} /> // calendar is enabled by default
    );

    const CustomSystemMessage = (props: EventComponentProps) => (
      <EventComponent {...props} format={"YYYY"} /> // calendar is disabled by default
    );

    const CustomMessageTimestamp = (props: MessageTimestampProps) => (
      <MessageTimestamp
        {...props}
        calendar={false}
        format={"YYYY-MM-DDTHH:mm:ss"}
      /> // calendar is enabled by default
    );

    <Channel
      DateSeparator={CustomDateSeparator}
      MessageSystem={SystemMessage}
      MessageTimestamp={CustomMessageTimestamp}
    >
      ...
    </Channel>;

Custom formatting function can be passed to `MessageList` or `VirtualizedMessageList` via prop `formatDate` (`(date: Date) => string;`). The `Message` component passes down the function to be consumed by the children via `MessageComponentContext`:


    import { useMessageContext } from "stream-chat-react";
    const CustomComponent = () => {
      const { formatDate } = useMessageContext();
    };

By default, the function is consumed by the `MessageTimestamp` component. This means the formatting via `formatDate` is reduced only to timestamp shown by a message in the message list. Components `DateSeparator`, `EventComponent` would ignore the custom formatting.

Until now, the datetime values could be customized within the `Channel` component at best. Formatting via i18n service allows for SDK wide configuration. The configuration is stored with other translations in JSON files. Formatting with i18n service has the following advantages:

  * it is centralized
  * it takes into consideration the locale out of the box
  * allows for high granularity - formatting per string, not component (opposed to props approach)
  * allows for high re-usability - apply the same configuration in multiple places via the same translation key
  * allows for custom formatting logic

The default datetime formatting configuration is stored in the JSON translation files. The default translation keys are namespaced with prefix `timestamp/` followed by the component name. For example, the message date formatting can be targeted via `timestamp/MessageTimestamp`, because the underlying component is called `MessageTimestamp`.

You can change the default configuration by passing an object to `translationsForLanguage` `Streami18n` option with all or some of the relevant translation keys:


    import { Chat, Streami18n } from "stream-chat-react";

    const i18n = new Streami18n({
      language: "de",
      translationsForLanguage: {
        "timestamp/DateSeparator":
          "{{ timestamp | timestampFormatter(calendar: false) }}",
        "timestamp/MessageTimestamp":
          '{{ timestamp | timestampFormatter(calendar: true; calendarFormats: {"lastDay": "[gestern um] LT", "lastWeek": "[letzten] dddd [um] LT", "nextDay": "[morgen um] LT", "nextWeek": "dddd [um] LT", "sameDay": "[heute um] LT", "sameElse": "L"}) }}',
      },
    });

    const ChatApp = ({ chatClient, children }) => {
      return (
        <Chat client={chatClient} i18nInstance={i18n}>
          {children}
        </Chat>
      );
    };

Once the default prop values are nullified, we override the default formatting rules. We can take a look at an example of German translation for SystemMessage (below a JSON example - note the escaped quotes):


    "timestamp/SystemMessage": "{{ timestamp | timestampFormatter(calendar: true; calendarFormats: {\"lastDay\": \"[gestern um] LT\", \"lastWeek\": \"[letzten] dddd [um] LT\", \"nextDay\": \"[morgen um] LT\", \"nextWeek\": \"dddd [um] LT\", \"sameDay\": \"[heute um] LT\", \"sameElse\": \"L\"}) }}",

Letâs dissect the example:

  * The curly brackets (`{{`, `}}`) indicate the place where a value will be interpolated (inserted) into the string.
  * variable `timestamp` is the name of variable which value will be inserted into the string
  * value separator `|` signals the separation between the interpolated value and the formatting function name
  * `timestampFormatter` is the name of the formatting function that is used to convert the `timestamp` value into desired format
  * the `timestampFormatter` can be passed the same parameters as the React components (`calendar`, `calendarFormats`, `format`) as if the function was called with these values. The values can be simple scalar values as well as objects (note `calendarFormats` should be an object). The params should be separated by semicolon `;`.

The described rules follow the formatting rules required by the i18n library used under the hood - `i18next`. You can learn more about the rules in [the formatting section of the `i18next` documentation](https://www.i18next.com/translation-function/formatting#basic-usage).

Besides overriding the configuration parameters, we can override the default `timestampFormatter` function by providing custom `Streami18n` instance:


    import { Chat, Streami18n, useCreateChatClient } from "stream-chat-react";

    const i18n = new Streami18n({
      formatters: {
        timestampFormatter: () => (val: string | Date) => {
          return new Date(val).getTime() + "";
        },
      },
    });

    export const ChatApp = ({ apiKey, userId, userToken }) => {
      const chatClient = useCreateChatClient({
        apiKey,
        tokenOrProvider: userToken,
        userData: { id: userId },
      });
      return <Chat client={chatClient} i18nInstance={i18n}></Chat>;
    };

[PreviousSDK State Management](/chat/docs/sdk/react/guides/sdk-state-management/)[NextCustom Threads View](/chat/docs/sdk/react/guides/custom-threads-view/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

This example will show you how to change the message text in the `ConnectionStatus` component. This status appears when there is a connection issue with the Stream Chat API.

This component is established within the `MessageList` via the `DefaultMessageListNotifications` component in the same file. For a complete override of all of these notifications, see this [detailed example](/chat/docs/sdk/react/guides/customization/adding_messagelist_notification/), but in this smaller guide we will replace just the text of one of the components using the Stream [`i18n instance`](/chat/docs/sdk/react/guides/theming/translations/).

The first step is to create an instance of `Streami18n` and pass it into the `Chat` component.


    const i18nInstance = new Streami18n();

    <Chat client={client} i18nInstance={i18nInstance}>
      ...
    </Chat>;

Next, we can define what text appears during connection issues by overriding the default message via the key value pairing. Check out the full list of [values you can override](https://github.com/GetStream/stream-chat-react/blob/master/src/i18n/en.json).


    const i18nInstance = new Streami18n({
      language: "en",
      translationsForLanguage: {
        "Connection failure, reconnecting now...":
          "Alert, connection issue happening",
      },
    });

![Custom Connection Status Message for Chat](/_astro/ConnectionStatus.BvxI72OZ_Z12NBCK.webp)

[PreviousMessage List Notifications](/chat/docs/sdk/react/guides/customization/adding_messagelist_notification/)[NextMessage UI](/chat/docs/sdk/react/guides/theming/message_ui/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

This example demonstrates how to implement infinite scroll with existing SDK components. By default, the SDKâs `ChannelList` component uses `LoadMorePaginator` to load more channels into the list. More channels are loaded every time the `LoadMoreButton` is clicked. The infinite scroll instead loads more channels based on the channel list containerâs scroll position. The request to load more channels is automatically triggered, once the scroller approaches the bottom scroll threshold of the container.

The SDK provides own [`InfiniteScroll`](https://github.com/GetStream/stream-chat-react/blob/master/src/components/InfiniteScrollPaginator/InfiniteScroll.tsx) component. This component implements the [`PaginatorProps`](https://github.com/GetStream/stream-chat-react/blob/master/src/types/types.ts) interface. As this interface is implemented by the [`LoadMorePaginator`](https://github.com/GetStream/stream-chat-react/blob/master/src/components/LoadMore/LoadMorePaginator.ts) too, we can just pass the `InfiniteScroll` into the `ChannelList` prop `Paginator`.


    import { ChannelList, InfiniteScroll } from "stream-chat-react";

    <ChannelList
      filters={filters}
      sort={sort}
      options={options}
      Paginator={InfiniteScroll}
      showChannelSearch
    />;

If you would like to adjust the configuration parameters like `threshold`, `reverse` (`PaginatorProps`) or `useCapture`, etc. (`InfiniteScrollProps`), you can create a wrapper component where these props can be set:


    import {
      ChannelList,
      InfiniteScroll,
      InfiniteScrollProps,
    } from "stream-chat-react";

    const Paginator = (props: InfiniteScrollProps) => (
      <InfiniteScroll {...props} threshold={50} />
    );

    // ...

    <ChannelList
      filters={filters}
      sort={sort}
      options={options}
      Paginator={Paginator}
      showChannelSearch
    />;

Especially the `threshold` prop may need to be set as the default is 250px. That may be too soon to load more channels.

For the infinite scroll to work, the element containing the `ChannelPreview` list has to be forced to display the scroll bar with the initial channel list load. This is achieved by:

**1\. adjusting the initial number of loaded channels**

Set a reasonable number of channels to be initially loaded. If loading 10 channels leads to them being visible without having to scroll, then increase the number to e.g. 15:


    import type { ChannelOptions } from "stream-chat";
    const options: ChannelOptions = { state: true, presence: true, limit: 15 };

**2\. adjusting the container height**

You can change the container height so that not all channels are visible at once. You should target the container with class `.str-chat__channel-list-messenger-react__main`


    .str-chat__channel-list-messenger-react__main {
      max-height: 50%;
    }

[PreviousChannelSearch](/chat/docs/sdk/react/components/utility-components/channel_search/)[NextMultiple Lists](/chat/docs/sdk/react/guides/multiple_channel_lists/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

See the [release guide of `stream-chat`](/chat/docs/javascript/upgrade-stream-chat-to-v9/) and [TypeScript & Custom Data Types](/chat/docs/sdk/react/guides/typescript_and_custom_data_types/) article.

Types `MessageToSend`, `StreamMessage`, `UpdatedMessage` have been removed and replaced by `LocalMessage`. The type `LocalMessage` is a message representation stored in a local state. The message data is retrieved from the server as `MessageResponse` and immediately converted to `LocalMessage`.

The type `RenderedMessage` is comprised of `LocalMessage` as well as ephemeral messages generated client side - `DateSeparatorMessage`, `IntroMessage`.

Message composition is now managed by `MessageComposer` class instances. Every composition context has its own composer. There are the following composition contexts:

  * `channel` \- for main channel list message composition
  * `thread` \- for message composition in Thread view
  * `legacy_thread` \- for message composition in thread open next to the main channel list
  * `message` \- for editing a message in any message list

The composer instances can be retrieved via `useMessageComposer` hook.

Introduction of `MessageComposer` leads to breaking changes described in the following sections.

Some components were dropped to be refreshed with new behavior and easier functionality:

Removed| Replaced by
---|---
AutoCompleteTextarea| TextAreaComposer
ChatAutoComplete| TextAreaComposer
DefaultSuggestionList| SuggestionList
DefaultSuggestionListItem| SuggestionListItem

Components `ChatAutoComplete` that used to render `AutoCompleteTextarea` were replaced by a single component `TextAreaComposer`.

The following props that were previously exposed for `ChatAutoComplete` and `AutoCompleteTextarea` are not available anymore.

**AutoCompleteTextarea**

Prop| Replacement
---|---
`containerStyle`| Apply custom styles using CSS
`defaultValue`| The default value is set via `MessageComposer` configuration (`text.defaultValue`) ([see the composer configuration guide](/chat/docs/sdk/react/components/message-input-components/message-composer#message-composer-configuration)) or set reactively via `TextComposer.defaultValue` setter
`disabled`| The default value is set via `MessageComposer` configuration (`text.enabled`) ([see the composer configuration guide](/chat/docs/sdk/react/components/message-input-components/message-composer#message-composer-configuration))
`disableMentions`| Remove mentions middleware from the `TextComposer.middlewareExecutor` ([see the composer middleware guide](/chat/docs/sdk/react/components/message-input-components/message-composer-middleware/))
`dropdownClassName`| Override prop `containerClassName` directly on `SuggestionList` and pass the list component as `AutocompleteSuggestionList` to `Channel`
`dropdownStyle`| Apply custom styles using CSS
`itemClassName`| Override prop `className` directly on `SuggestionListItem` and pass the item component as `AutocompleteSuggestionItem` to `Channel`
`itemStyle`| Apply custom styles using CSS
`listClassName`| Override prop `className` directly on `SuggestionList` and pass the list component as `AutocompleteSuggestionList` to `Channel`
`listStyle`| Apply custom styles using CSS
`loaderClassName`| The prop was not used. No replacement provided.
`loaderStyle`| The prop was not used. No replacement provided.
`loadingComponent`| The prop was not used. No replacement provided.
`grow`| Redundant prop. Use prop `maxRows` to indicate up to what number of rows the textarea can grow.
`onCaretPositionChange`| Subscribe to `TextComposer.state` to observe the changes of property `selection` ([see the state store guide](/chat/docs/sdk/react/guides/sdk-state-management/))
`onSelect`| Add custom middleware to `TextComposer.middlewareExecutor` to handle `onSuggestionItemSelect` event ([see the composer middleware guide](/chat/docs/sdk/react/components/message-input-components/message-composer-middleware/))
`style`| Apply custom styles using CSS
`trigger`| The current trigger value is signaled via `TextComposer.state.suggestions`
`value`| The current (text) value is signaled via `TextComposer.state.text`

**ChatAutoComplete**

The component used to forward props to `AutoCompleteTextarea`. As those are already described in the previous section, we will omit them in the below table.

Prop| Replacement
---|---
`handleSubmit`| It is possible to customize the message composition via `MessageComposer.compositionMiddlewareExecutor` and draft composition via `MessageComposer.draftCompositionMiddlewareExecutor` ([see the composer middleware guide](/chat/docs/sdk/react/components/message-input-components/message-composer-middleware/)). Also the sending of the message is customizable via `Channel` prop `doSendMessageRequest`.
`wordReplace`| Replacement of text to native emoji entity is now performed via `TextComposer` middleware via `onChange` handler. Handled out-of-the-box with pre-built emoji middleware [see the composer middleware guide](/chat/docs/sdk/react/components/message-input-components/message-composer-middleware/)

**MessageInput**

Prop| Replacement
---|---
`doFileUploadRequest`| Custom upload function can be configured via `MessageComposer` configuration (`attachments.doUploadRequest`) or `MessageComposer.attachmentManager.setCustomUploadFn` method.
`doImageUploadRequest`| Custom upload function can be configured via `MessageComposer` configuration (`attachments.doUploadRequest`) or `MessageComposer.attachmentManager.setCustomUploadFn` method.
`errorHandler`| To handle errors thrown during the file upload, subscribe to `client.notifications.state` and react to `notification.message` âError uploading attachmentâ.
`getDefaultValue`| The default value is set via `MessageComposer` configuration (`text.defaultValue`) ([see the composer configuration guide](/chat/docs/sdk/react/components/message-input-components/message-composer#message-composer-configuration)) or set reactively via `TextComposer.defaultValue` setter
`mentionAllAppUsers`| Mentions configuration can be done via `TextComposer` mentions middleware ( `createMentionsMiddleware(channel, {searchSource: new MentionsSearchSource(channel, {mentionAllAppUsers: true}) })`
`mentionQueryParams`| Override methods `MentionsSearchSource.prepareQueryUsersParams` or `MentionsSearchSource.prepareQueryMembersParams` respectively to generate filter, sort and options objects to perform user and member requests based on search text.
`message`| The `MessageComposer` is automatically provide with the editted a message. No replacement.
`noFiles`| Custom logic to filter files can be specified via `MessageComposer` configuration (`attachments.fileUploadFilter`) or `MessageComposer.attachmentManager.fileUploadFilter` setter.
`parent`| The parent message is automatically provided to the `MessageComposer`. No replacement.
`publishTypingEvent`| Configure with `MessageComposer.textComposer.publishTypingEvents`
`urlEnrichmentConfig`| The link preview config can be specified via `MessageCoposer.linkPreviews` configuration or `MessageComposer.linkPreviewsManager` setters
`useMentionsTransliteration`| Mentions configuration can be done via `TextComposer` mentions middleware ( `createMentionsMiddleware(channel, {searchSource: new MentionsSearchSource(channel, {transliterate: (textToTransliterate: string) => string}) })`

Further, the signature of function passed to `overrideSubmitHandler` has changed. It now accepts a single object parameter:


    type overrideSubmitHandler = (params: {
      cid: string;
      localMessage: LocalMessage;
      message: Message;
      sendOptions: SendMessageOptions;
    }) => Promise<void> | void;

maxNumberOfFiles, multipleUploads, TriggerProvider

Prop| Replacement
---|---
`acceptedFiles`| The array of strings can be specified via `MessageComposer` configuration (`attachments.acceptedFiles`) or `MessageComposer.attachmentManager.acceptedFiles` setter.
`enrichURLForPreview`, `enrichURLForPreviewConfig`| The link preview config can be specified via `MessageCoposer.linkPreviews` configuration or `MessageComposer.linkPreviewsManager` setters.
`maxNumberOfFiles`| Can be specified via `MessageComposer` configuration (`attachments.maxNumberOfFilesPerMessage`) or `MessageComposer.attachmentManager.maxNumberOfFilesPerMessage` setter.
`multipleUploads`| Does not have replacement. Multiple uploads are inferred from configuration parameter `maxNumberOfFilesPerMessage` value greater than 1.
`TriggerProvider`| Triggers are characters in composed message text that cause suggestions to be rendered (emoji, mentions, commands). This component served to propagate potentially custom trigger logic. This is however now done via `TextComposer.middlewareExecutor` by providing custom middleware functions ([see the composer middleware guide](/chat/docs/sdk/react/components/message-input-components/message-composer-middleware/)).

The autocomplete trigger for text composition is now handled by `TextComposer` middleware located in `stream-chat`. The following types were therefore removed from`stream-chat-react`:

  * `SuggestionHeaderProps`
  * `ChatAutoCompleteProps`
  * `AutocompleteMinimalData`
  * `CommandTriggerSetting`
  * `EmojiTriggerSetting`
  * `UserTriggerSetting`
  * `TriggerSetting`
  * `TriggerSettings`

The migration of trigger logic also lead to removal of trigger generic parameter in `stream-chat-react` components. The generic type is not needed anymore as typed text is processed by a customizable chain of middleware functions before it is committed to the `MessageComposer` state.

Beside the introduction of `LocalMessage` to `editMessage`, `openThread`, `removeMessage`, `updateMessage` parameters representing a message, the following changes have been introduced:

The `sendMessage` function signature has changed. Now it accepts a single object parameter:


    type sendMessage = (params: {
      localMessage: LocalMessage;
      message: Message;
      options?: SendMessageOptions;
    }) => Promise<void>;

Function `setQuotedMessage` has been removed. Quoted message state is now handled by `MessageComposer`. It can be set via `MessageComposer.setQuotedMessage(quotedMessage: LocalMessage | null)` method.

Removed `Channel` props are now absent from the `ChannelStateContext` too. These are: `acceptedFiles`, `enrichURLForPreview`, parts of the `enrichURLForPreviewConfig` ( `debounceURLEnrichmentMs`, `findURLFn`, `onLinkPreviewDismissed`), `multipleUploads`.

Prop| Replacement
---|---
`quotedMessage`| Value changes can now be observed by subscribing to `MessageComposer.state` changes.


    const messageComposerStateSelector = (state: MessageComposerState) => ({
      quotedMessage: state.quotedMessage,
    });
    const messageComposer = useMessageComposer();
    const { quotedMessage } = useStateStore(
      messageComposer.state,
      messageComposerStateSelector,
    );

We have moved all the message composition state management from `stream-chat-react` to `stream-chat` and the new `MessageComposer`. Therefore the hook `useMessageInputState` has been renamed to `useMessageInputControls` as it does not handle the composition state anymore and provides only the following API that is accessible via `MessageInputContext`:

  * `handleSubmit` \- Also received an overhaul resulting in signature change (see below).
  * `onPaste`
  * `recordingController`
  * `textareaRef`

Message input state as well as the majority of the API is now kept within MessageComposer instead of MessageInputContext.

Due to the transformation of `useMessageInputState` of

**1\. Context Values Removed**

Prop| Replacement
---|---
`insertText`| Use `MessageComposer.textComposer.insertText` method
`handleChange`| Use `MessageComposer.textComposer.handleChange` method
`isUploadEnabled`| Use `useAttachmentManagerState` hook to subscribe to `isUploadEnabled` value changes
`maxFilesLeft`| Use `useAttachmentManagerState` hook to subscribe to `availableUploadSlots` value changes
`numberOfUploads`| Use `useAttachmentManagerState` hook to subscribe to `successfulUploadsCount` and `uploadsInProgressCount` value changes
`onSelectUser`| Use `MessageComposer.textComposer.handleSelect` method to announce a suggestion item has been selected. It is possible to register custom TextComposer middleware ([see the middleware guide](/chat/docs/sdk/react/components/message-input-components/message-composer-middleware/)).
`removeAttachments`| Use `MessageComposer.attachmentManager.removeAttachments` method
`uploadAttachment`| Use `MessageComposer.attachmentManager.uploadAttachment` method
`uploadNewFiles`| Use `MessageComposer.attachmentManager.uploadFiles` method
`upsertAttachments`| Use `MessageComposer.attachmentManager.upsertAttachments` method
`closeCommandsList`| Use `MessageComposer.textComposer.closeSuggestions` method
`openCommandsList`| Done automatically upon trigger identification. We can register a custom `TextComposer` middleware for `onChange` event to introduce custom logic, or override the command trigger character(s) ([see the middleware guide](/chat/docs/sdk/react/components/message-input-components/message-composer-middleware/)).
`showCommandsList`| Determine command suggestion list to be open by `TextComposer.suggestions?.trigger === commandTrigger`
`closeMentionsList`| Use `MessageComposer.textComposer.closeSuggestions` method
`openMentionsList`| Done automatically upon trigger identification. We can register a custom `TextComposer` middleware for `onChange` event to introduce custom logic, or override the mentions trigger character(s) ([see the middleware guide](/chat/docs/sdk/react/components/message-input-components/message-composer-middleware/)).
`showMentionsList`| Determine command suggestion list to be open by `TextComposer.suggestions?.trigger === mentionTrigger`

The removed values forwarded from `MessageInputProps` to `MessageInputContext` have been documented above.

**2\. handleSubmit Signature Change**

We changed the signature of function `handleSubmit` which now optionally accepts only `event` object. The other two parameters `customMessageData` and `options` have been removed.

Before:


    type handleSubmit = (
      event?: React.BaseSyntheticEvent,
      customMessageData?: Partial<Message<StreamChatGenerics>>,
      options?: SendMessageOptions,
    ) => Promise<void>;

Now:


    type handleSubmit = (event?: React.BaseSyntheticEvent) => Promise<void>;

The custom message data can be injected via custom middleware handlers ([see the middleware guide](/chat/docs/sdk/react/components/message-input-components/message-composer-middleware/)) or by setting the data directly:


    messageComposer.customDataManager.setMessageData({ a: "b" });

The following identity functions were moved to `stream-chat`:

Original Name| New Name
---|---
`isLocalAttachment`| `isLocalAttachment`
`isScrapedContent`| `isScrapedContent`
none| `isLocalUploadAttachment`
`isFileAttachment`| `isFileAttachment`
`isLocalFileAttachment`| `isLocalFileAttachment`
`isUploadedImage`| `isImageAttachment`
none| `isLocalImageAttachment`
`isAudioAttachment`| `isAudioAttachment`
`isLocalAudioAttachment`| `isLocalAudioAttachment`
`isVoiceRecordingAttachment`| `isVoiceRecordingAttachment`
`isLocalVoiceRecordingAttachment`| `isLocalVoiceRecordingAttachment`
`isMediaAttachment`| `isVideoAttachment`
`isLocalMediaAttachment`| `isLocalVideoAttachment`
none| `isUploadedAttachment`

The `isGalleryAttachmentType` still has to be imported from `stream-chat-react` as it is specific to the repository.

The message composition is now handled by `MessageComposer` class. The class instance should be retrieved using `useMessageComposer` hook. The hook provides the correct instance according to the context in which the hook was invoked.

All the API that was moved to `MessageComposer` had to be removed from the relevant React contexts and component props in `stream-chat-react`.

[`Channel`](/chat/docs/sdk/react/components/core-components/channel/) prop [`dragAndDropWindow`](/chat/docs/sdk/react/v12/components/core-components/channel/#draganddropwindow) and associated [`optionalMessageInputProps`](/chat/docs/sdk/react/v12/components/core-components/channel/#optionalmessageinputprops) have been removed, use [`WithDragAndDropUpload`](/chat/docs/sdk/react/components/utility-components/with-drag-and-drop-upload/#basic-usage) component instead.

[PreviousSearch](/chat/docs/sdk/react/experimental/search/)[NextUpgrade to v12](/chat/docs/sdk/react/release-guides/upgrade-to-v12/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

As of version `5.0.0`, `stream-chat-react` has been converted to TypeScript. The `stream-chat` library was converted to TypeScript in version `2.0.0`. These upgrades not only improve the type safety, but also allow integrator-defined typings to be taken into consideration when working with Stream entities such as `message` or `channel` through the use of [module augmentation (declaration merging)](https://www.typescriptlang.org/docs/handbook/declaration-merging.html), which is a direct replacement for the previous type augmentation mechanism (generics) since `stream-chat` version `9.0.0` and `stream-chat-react` version `13.0.0`.

There are [eleven](https://github.com/GetStream/stream-chat-js/blob/fix/remove-stream-chat-generics/src/custom_types.ts) extendable interfaces within `stream-chat`, which are merged with the base types of Stream entities:

  1. `CustomAttachmentData`
  2. `CustomChannelData`
  3. `CustomCommandData`
  4. `CustomEventData`
  5. `CustomMemberData`
  6. `CustomMessageData`
  7. `CustomPollOptionData`
  8. `CustomPollData`
  9. `CustomReactionData`
  10. `CustomUserData`
  11. `CustomThreadData`
  12. `CustomMessageComposerData`

Note that `CustomChannelData` are extended within `stream-chat-react` SDK with commonly used custom data (`subtitle`, `image` and `name` living in a reusable interface `DefaultChannelData`), these declarations do not interfere with integrator-defined declarations and extending your declarations with the SDK-supplied defaults (see bellow) **is not necessary** but note that certain default components expect these to be of specific type and different types (and actual values) may lead to unexpected behavior. If you decide to use different types for this data, make sure you replace affected default components as well.

To extend these custom interfaces youâll have to create a declaration file within your codebase and make sure itâs loaded by the TypeScript. Within this file weâll import `stream-chat` and specific defaults from `stream-chat-react` and then define the interface augmentations:

stream-custom-data.d.ts


    import "stream-chat";
    import type { DefaultChannelData } from "stream-chat-react";

    declare module "stream-chat" {
      interface CustomChannelData extends DefaultChannelData {}

      interface CustomMessageData {
        custom_property?: string;
      }

      interface CustomUserData {
        profile_picture?: string;
      }

      interface CustomCommandData {
        "custom-command": unknown;
        "other-custom-command": unknown;
      }
    }

Note that `CustomCommandData` interface is a special case from which only the keys would be used, the value type _is not important_ and `unknown` would suffice.

Thatâs it, you can check if your augmentations work with similar code:


    import { StreamChat } from "stream-chat";

    const client = new StreamChat("any-key");

    const response = await client.getMessage("id");

    const customProperty = response.message.custom_property; // should be `string | undefined` as per our declaration

[PreviousTranslation and i18n](/chat/docs/sdk/react/guides/theming/translations/)[NextChannel Read State](/chat/docs/sdk/react/guides/channel_read_state/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

This guide intends to provide an overview how channel read state is handled by default in the SDK and how to customize this behavior to our liking.

The React SDK maintains channel read state for UI components inside `Channel` component in a separate variable `channelUnreadUiState`. This state is dedicated to show unread count on components `UnreadMessagesSeparator` and `UnreadMessagesNotification` (or other custom components that need its behavior). The `channelUnreadUiState` is special in that when a channel is opened and marked read, the `channelUnreadUiState` does not reflect this initial update. This is in order the user can see, how many unread messages there have been left since the previous session.

Channel read state reflecting the current back-end state can be accessed via `channel.state.read` mapping.

The state is maintained by `Channel` component and shared with its children via `ChannelStateContext` as `channelUnreadUiState`. The state format is as follows:

Property| Type| Description
---|---|---
**last_read**| `Date`| Date when the channel was marked read the last time.
**unread_messages**| `number`| The count of unread messages in a given channel. Unread count refers only to foreign (not own) unread messages.
**first_unread_message_id**| `string` or `undefined`| The ID of the message that was marked unread (`notification.mark_unread` event). The value is available only when a message is marked unread. Therefore, cannot be relied on to place unread messages UI.
**last_read_message_id**| `string` or `undefined`| The ID of the message preceding the first unread message.

The read state is extracted from the channel query response, specifically from each `ChannelResponse` objectâs `read` attribute. This is internally transformed from an array of usersâ read statuses into and object indexed by user id. The read state is updated upon receiving WS events like `message.read`, `notification.mark_unread`, `message.new`. Each value of the `read` state object has then the following structure:

Property| Type| Description
---|---|---
**last_read**| `Date`| Date when the channel was marked read the last time. The value is provided with `ChannelResponse` when querying channels or on `notification.mark_unread` event.
**unread_messages**| `number`| The count of unread messages in a given channel for a given user. Unread count refers only to foreign (not own) unread messages. The value is provided with `ChannelResponse` when querying channels or on `notification.mark_unread` event.
**user**| `user`| Data of a user, whose read state is described in this object. The value is provided with `ChannelResponse` when querying channels or on `notification.mark_unread` event.
**first_unread_message_id**| `string` or `undefined`| The ID of the message that was marked unread (`notification.mark_unread` event). The value is available only when a message is marked unread. Therefore, cannot be relied on to place unread messages UI.
**last_read_message_id**| `string` or `undefined`| The ID of the message preceding the first unread message. The value is provided with `ChannelResponse` when querying channels or on `notification.mark_unread` event.

Be aware that only the last 100 newest messages can be marked unread. If older messages are marked unread, an error notification is shown informing about this limitation.

In the SDK, the `read` and `channelUnreadUiState` can be accessed via [`useChannelStateContext` consumer](/chat/docs/sdk/react/components/contexts/channel_state_context#read/):


    import { useChannelStateContext, useChatContext } from "stream-chat-react";

    const Component = (props) => {
      const { client } = useChatContext();
      const { read, channel, channelUnreadUiState } = useChannelStateContext();

      // channel read state for some user
      const channelReadStateForAUser = read[props.user.id];

      // channel read state for own user
      const channelReadStateForMyUser = client.user && read[client.user.id];

      // easier way to access own user's unread count for a given channel
      const unreadCount = channel.unreadCount();

      //... code
    };

Channel can be marked read using the `markRead()` function provided via `ChannelActionContext`:


    import { useChannelActionContext } from "stream-chat-react";

    const MarkReadButton = (props) => {
      const { markRead } = useChannelActionContext();

      return (
        <button {...props} onClick={() => markRead()}>
          Mark read
        </button>
      );
    };

The function accepts a single `options` parameter of the following format:

Field| Type| Optional| Description
---|---|---|---
`updateChannelUiUnreadState`| `boolean`| yes| Signal, whether the `channelUnreadUiState` should be updated. The local state update is prevented when the Channel component is mounted. This is in order to keep the UI indicating the original unread state, when the user opens a channel. If the value for `updateChannelUiUnreadState` is not provided, the state is updated.

Please, prefer using the `markRead()` function everywhere in the `Channel` context as this function throttles the API calls thus preventing you from hitting the API limit of mark-read calls.

The default components included in **marking a channel read** :

Component| Description
---|---
[`Channel`](/chat/docs/sdk/react/components/core-components/channel/)| Can be configured to mark active channel read when mounted. This can be done through its prop `markReadOnMount`. By default enabled.
[`MessageList`](/chat/docs/sdk/react/components/core-components/message_list/), [`VirtualizedMessageList`](/chat/docs/sdk/react/components/core-components/virtualized_list/)| Marks channel read when message list is scrolled to the bottom.
[`UnreadMessagesNotification`](/chat/docs/sdk/react/components/contexts/component_context#unreadmessagesnotification/)| Floating notification rendered in the message list. Contains a button, which when clicked, marks the channel read.

The default components included in **marking a channel unread** :

Component| Description
---|---
[`MessageActionsBox`](/chat/docs/sdk/react/components/message-components/message_ui#message-actions-box/)| Action `Mark as Unread` is displayed if a user has `read-events` permission and the actions are displayed for a non-thread message posted by another user. Message which id matches that of the current userâs read stateâs `first_unread_message_id` is not shown option `Mark as Unread`.

The default components reflecting channel unread count:

Component
---
[`ChannelPreviewMessenger`](/chat/docs/sdk/react/components/utility-components/channel_preview_ui/)
[`UnreadMessagesSeparator`](/chat/docs/sdk/react/components/contexts/component_context#unreadmessagesseparator/)
[`UnreadMessagesNotification`](/chat/docs/sdk/react/components/contexts/component_context#unreadmessagesnotification/)
[`ScrollToBottomButton`](https://github.com/GetStream/stream-chat-react/blob/master/src/components/MessageList/ScrollToBottomButton.tsx)

Message threads do not participate in handling read state of a channel. Thread replies are not observed for unread count. Therefore, none of the UI components related to read state are rendered in threads.

The channel is marked read in the following scenarios:

  1. User enters a channel with unread messages if `Channel` prop `markReadOnMount` is enabled (default behavior).
  2. User scrolls up and back down to the latest message.
  3. User clicks the button on the default `UnreadMessagesNotification` component to mark channel read.

The channel is marked unread in the following scenarios:

  1. User with `read-events` permission selects `Mark as unread` option from the `MessageActionsBox`.

The component `UnreadMessagesSeparator` is shown immediately below the last read message. It can be followed by own message or a message posted by another user. It does not show unread count if:

  * `showCount` prop is enabled and among the unread messages are only own messages (own message can be marked unread).
  * `showCount` prop is disabled (default)

There is a possibility to configure when a channel is marked read by tweaking these default componentsâ props:

Component| Prop
---|---
[`Channel`](/chat/docs/sdk/react/components/core-components/channel/)| `markReadOnMount` (by default enabled)

We can override the following components via `Channel`âs component context:

Will be rendered before the first unread message.


    import { Channel, UnreadMessagesSeparatorProps } from "stream-chat-react";

    const UnreadMessagesSeparator = (props: UnreadMessagesSeparatorProps) => {
      //... custom implementation
    };
    const Component = ({ children }) => (
      <Channel UnreadMessagesSeparator={UnreadMessagesSeparator}>
        {children}
      </Channel>
    );

The component can be configured through the following props:

Prop| Description| Type| Default
---|---|---|---
`showCount`| Configuration parameter to determine, whether the unread count is to be shown on the component.| `boolean`| `false`


    import {
      UnreadMessagesSeparator as StreamUnreadMessagesSeparator,
      UnreadMessagesSeparatorProps,
    } from "stream-chat-react";

    const UnreadMessagesSeparator = (props: UnreadMessagesSeparatorProps) => {
      return <StreamUnreadMessagesSeparator {...props} showCount />;
    };

Will be rendered only when `UnreadMessagesSeparator` is not visible in message list. The default implementation positions the notification as a floating element above the messages in a message list. It shows the number of unread messages since the user has scrolled away from the latest message (bottom of the message list).


    import { Channel, UnreadMessagesNotificationProps } from "stream-chat-react";

    const UnreadMessagesNotification = (props: UnreadMessagesNotificationProps) => {
      //... custom implementation
    };
    const Component = ({ children }) => (
      <Channel UnreadMessagesNotification={UnreadMessagesNotification}>
        {children}
      </Channel>
    );

The component can be configured through the following props:

Prop| Description| Type| Default
---|---|---|---
`showCount`| Configuration parameter to determine, whether the unread count is to be shown on the component.| `boolean`| `false`
`queryMessageLimit`| Configuration parameter to determine the message page size, when jumping to the first unread message.| `number`| `100`


    import {
      UnreadMessagesNotification as StreamUnreadMessagesNotification,
      UnreadMessagesNotificationProps,
    } from "stream-chat-react";

    const UnreadMessagesNotification = (props: UnreadMessagesNotificationProps) => {
      return (
        <StreamUnreadMessagesNotification
          {...props}
          queryMessageLimit={50}
          showCount
        />
      );
    };

The SDK exports [`ScrollToBottomButton`](https://github.com/GetStream/stream-chat-react/blob/master/src/components/MessageList/ScrollToBottomButton.tsx) that shows the unread count since the point the user has scrolled away from the newest messages in the list.

We can implement our own message notification component.


    import { MessageNotificationProps, Channel } from "stream-chat-react";

    const MessageNotification = (props: MessageNotificationProps) => {
      //... custom implementation
    };

    const Component = ({ children }) => (
      <Channel MessageNotification={MessageNotification}>{children}</Channel>
    );

The SDK provides a component `UnreadMessagesNotification`, that when clicked on the part `Unread messages`, the message list scrolls to the first unread message. If the first unread message is not loaded in the local channel state, the message is retrieved from the API.

Use `jumpToFirstUnreadMessage()` function to implement custom UI to jump to the first unread message. The function takes one parameter `queryMessageLimit` that specifies the message page size if the message has to be loaded from the back-end API.

[PreviousTypeScript & Custom Data Types](/chat/docs/sdk/react/guides/typescript_and_custom_data_types/)[NextVideo & Audio by Stream](/chat/docs/sdk/react/guides/video-integration/video-integration-stream/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

Stream now enables you to seamlessly integrate our [Video + Audio experience](https://getstream.io/video/) within your chat applications in days. The users can now enjoy a more enriched experience with the real-time video and audio communication in the familiar chat environment. This integration not only fosters stronger relationships but also empowers businesses to streamline collaboration and customer support, making it a pivotal feature in the next generation of communication applications.

Try our [in-depth integration guide](/video/docs/react/advanced/chat-with-video/) and have the Video and Audio experience in your app in no time.

This guide is a part of our [Video and Audio experience documentation](/video/docs/react/). The documentation is extensive and covers everything from core concepts (authentication, handling of media devices, permissions and lot more), the use of pre-built UI components to UI cookbook and app tutorials. Providing you with everything necessary to ensure a smooth and confident development journey.

![Stream Video & Audio Experience](/_astro/stream-video-graphic.jSkdlWLe_P4qic.webp)

[PreviousChannel Read State](/chat/docs/sdk/react/guides/channel_read_state/)[NextSDK State Management](/chat/docs/sdk/react/guides/sdk-state-management/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

A system message is a message generated by a system event, such as banning or muting a user. These are sent from the backend and displayed via the [`VirtualizedMessageList`](/chat/docs/sdk/react/components/core-components/virtualized_list/) and [`MessageList`](/chat/docs/sdk/react/components/core-components/message_list/) components automatically. In this guide, we will demonstrate how to create and override the default component.

For reference, the default system message component, [`EventComponent`](https://github.com/GetStream/stream-chat-react/blob/master/src/components/EventComponent/EventComponent.tsx) (image below) displays all pertinent information about the event that occurred. The two list components display these messages only if message is of type `system` (`message.type === "system"`).

![Default System Message](/_astro/default-system-message.C9ykjkDz_1pQkAo.webp)

Our custom component will display the message text, date, and the actor (user who triggered the event) with added styling. For this complete override of the default component, we will utilize the [`MessageSystem`](/chat/docs/sdk/react/components/core-components/channel#messagesystem/) prop on [`Channel`](/chat/docs/sdk/react/components/core-components/channel/) through which itâs being passed to [`ComponentContext`](/chat/docs/sdk/react/components/contexts/component_context/) which allows you to hook into the component override mechanism used throughout the SDK.

To see your custom component in action, try muting a user by using the `/` command. For example, type `/mute` followed by a user mention, `@`. These commands must be enabled in the [Dashboard](https://dashboard.getstream.io/).

ReactCSS


    import { Avatar as DefaultAvatar, Channel } from 'stream-chat-react';
    import type { EventComponentProps } from 'stream-chat-react';

    const CustomSystemMessage = (props: EventComponentProps) => {
      const { Avatar = DefaultAvatar, message } = props;

      const { created_at = '', text, user } = message;
      const date = created_at.toString();

      return (
        <div className='custom-system-message'>
          <div>
            Event: <strong>{text?.trim()}</strong> at {date}
          </div>
          <div className='custom-system-message__actor'>
            Actor:
            <Avatar image={user?.image} />
            {user?.name}
          </div>
        </div>
      );
    };

    //...

    <Channel MessageSystem={CustomSystemMessage}>...</Channel>;


    .custom-system-message__actor {
      display: flex;
      gap: 0.5rem;
    }

    .custom-system-message {
      padding: 1rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      border-radius: var(--str-chat__border-radius-md);
      background: red; /* For browsers that do not support gradients */
      background: -webkit-linear-gradient(
        left,
        orange,
        yellow,
        green,
        cyan,
        blue,
        violet
      ); /* For Safari 5.1 to 6.0 */
      background: -o-linear-gradient(
        right,
        orange,
        yellow,
        green,
        cyan,
        blue,
        violet
      ); /* For Opera 11.1 to 12.0 */
      background: -moz-linear-gradient(
        right,
        orange,
        yellow,
        green,
        cyan,
        blue,
        violet
      ); /* For Firefox 3.6 to 15 */
      background: linear-gradient(
        to right,
        orange,
        yellow,
        green,
        cyan,
        blue,
        violet
      ); /* Standard syntax (must be last) */
    }

![Custom System Message](/_astro/custom-system-message.BwdmLSBZ_Z6M42s.webp)

[PreviousPin Indicator](/chat/docs/sdk/react/guides/customization/pin_indicator/)[NextMessage Input UI](/chat/docs/sdk/react/guides/theming/input_ui/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

In this example, weâll demonstrate how to override the SDKâs default reaction set, which is exported as [`defaultReactionOptions`](https://github.com/GetStream/stream-chat-react/blob/v11.0.0/src/components/Reactions/reactionOptions.tsx) variable. Weâll replace the default set with up and down arrows, simulating an up/down voting feature.

Under the hood, our [`ReactionSelector`](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Reactions/ReactionSelector.tsx), [`ReactionsList`](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Reactions/ReactionsList.tsx), [`SimpleReactionsList`](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Reactions/SimpleReactionsList.tsx) and [`ReactionsListModal`](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Reactions/ReactionsListModal.tsx) components render individual emoji components defined in the `reactionOptions`. Therefore, the array with your custom reactions needs to conform to `ReactionOptions` type:


    type ReactionOptions = Array<{
      type: string;
      Component: React.ComponentType;
      name?: string;
    }>;

Letâs construct a simple option list consisting of `'arrow-up'` and `'arrow-down'` native emojis. To override the default set weâll need to pass this option list to the component context through `Channel` component so that our default components can pick it up:


    import { Channel } from "stream-chat-react";

    const customReactionOptions = [
      {
        type: "arrow_up",
        Component: () => <>â¬ï¸</>,
        name: "Upwards Black Arrow",
      },
      {
        type: "arrow_down",
        Component: () => <>â¬ï¸</>,
        name: "Downwards Black Arrow",
      },
    ];

    export const WrappedChannel = ({ children }) => (
      <Channel reactionOptions={customReactionOptions}>{children}</Channel>
    );

Please note that types missing from the option list wonât be registered and might lead to sub-optimal user experience.

If you need to, you can pass these options to each of the default components individually (component props are prioritized even when the `reactionOptions` are routed through the `Channel`):


    import { Channel, ReactionsList, ReactionSelector } from "stream-chat-react";

    const CustomReactionsList = (props) => (
      <ReactionsList {...props} reactionOptions={customReactionOptions} />
    );

    // ReactionSelector component requires forwarded reference
    const CustomReactionSelector = forwardRef((props, ref) => (
      <ReactionSelector
        {...props}
        ref={ref}
        reactionOptions={selectorReactionOptions}
      />
    ));

    export const WrappedChannel = ({ children }) => (
      <Channel
        ReactionsList={CustomReactionsList}
        ReactionSelector={CustomReactionSelector}
      >
        {children}
      </Channel>
    );

While `ReactionSelector` can display a subset of available reactions (to limit what certain users can react with), the `ReactionsList` should have the whole list available if applicable.

![Custom reactionOptions rendered through ReactionSelector](/_astro/reaction-selector-w-custom-options.CW0E7XB2_Z2m5STw.webp)

![Custom reactionOptions rendered through ReactionsList](/_astro/reactions-list-w-custom-options.B3bQEZuy_1cuSiW.webp)

If you need to adjust the default behavior you can certainly do so by replacing reaction handler while keeping the default component intact:


    import { Channel, ReactionSelector } from "stream-chat-react";

    const CustomReactionSelector = React.forwardRef((props, ref) => {
      const {
        message: { own_reactions: ownReactions = [], id: messageId },
      } = useMessageContext("CustomReactionSelector");
      const { channel } = useChannelStateContext("CustomReactionSelector");

      const handleReaction = useCallback(
        async (reactionType, event) => {
          // your custom logic with default behavior (minus optimistic updates)

          console.log({ event });

          const hasReactedWithType =
            (ownReactions ?? []).some(
              (reaction) => reaction.type === reactionType,
            ) ?? false;

          if (hasReactedWithType) {
            await channel.deleteReaction(messageId, reactionType);
            return;
          }

          await channel.sendReaction(messageId, { type: reactionType });
        },
        [channel, ownReactions, messageId],
      );

      return (
        <ReactionSelector {...props} handleReaction={handleReaction} ref={ref} />
      );
    });

    // and then just add it to the component context
    export const WrappedChannel = ({ children }) => (
      <Channel ReactionSelector={CustomReactionSelector}>{children}</Channel>
    );

See more on customization options in [_Introducing new reactions_](/chat/docs/sdk/react/release-guides/upgrade-to-v11#introducing-new-reactions/) section of our _Upgrade to v11_ guide.

[PreviousMessage UI](/chat/docs/sdk/react/guides/theming/message_ui/)[NextMentions Actions](/chat/docs/sdk/react/guides/theming/actions/mentions_actions/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

One of the advanced features of the message input is autocompletion support. By default, it autocompletes mentions, commands and emojis.

Autocomplete suggestions are triggered by typing the special characters:

Trigger| Action| Example
---|---|---
`@`| mention| @user
`/`| command| /giphy
`:`| emoji| :smiling

The default message input component provided by the SDK supports this out of the box. When a trigger character is typed into the message input, a list of suggested options appears:

![](/_astro/message-input-ui-suggestions.BlgoZCCs_Z29A58W.webp)

If you want to customize the look and behavior of the suggestions list, you have two options:

  1. Use the default message input provided by the SDK, and override the following components to customize the look and feel of the suggestion list:

     * [`AutocompleteSuggestionItem`](/chat/docs/sdk/react/components/contexts/component_context#autocompletesuggestionitem/)
     * [`AutocompleteSuggestionList`](/chat/docs/sdk/react/components/contexts/component_context#autocompletesuggestionlist/)
  2. Implement the message input component from scratch, and add autocomplete functionality to it yourself.

Letâs explore both options.

Letâs start by creating a custom suggestion item component.

As usual, to override a component used by the SDK, you should pass a custom component as a prop to the [`Channel`](/chat/docs/sdk/react/components/core-components/channel/) component in your application code. In this case we are overriding [`AutocompleteSuggestionItem`](/chat/docs/sdk/react/components/contexts/component_context#autocompletesuggestionitem/):


    import {
      Chat,
      Channel,
      ChannelHeader,
      ChannelList,
      MessageList,
      Thread,
      Window,
      MessageInput,
    } from "stream-chat-react";
    import { SearchIndex } from "emoji-mart";

    export const App = () => (
      <Chat client={chatClient}>
        <ChannelList filters={filters} sort={sort} options={options} />
        <Channel
          AutocompleteSuggestionItem={CustomSuggestionItem}
          emojiSearchIndex={SearchIndex}
        >
          <Window>
            <ChannelHeader />
            <MessageList />
            <MessageInput />
          </Window>
          <Thread />
        </Channel>
      </Chat>
    );

Since we are not overriding the entire suggestion list yet, just an item component, our custom item component will get all the necessary data and callbacks in props - the default `AutocompleteSuggestionList` will take care of that.

This makes the basic implementation pretty straightforward. Two things to note, though:

  1. To show different previews for different item types (e.g. we want to show avatars for users and emoji previews for emojis) we need to put in type guards for each item type.
  2. The default `AutocompleteSuggestionList` requires you to call the `onSelectHandler` callback when an item is focused or hovered. This is to ensure that items in the list are keyboard accessible.

ReactCSS


    const CustomSuggestionItem = (props) => {
      const { item } = props;
      let children = null;

      // Item is an emoji suggestion
      if ("native" in item && typeof item.native === "string") {
        children = (
          <>
            <span>{item.native}</span>
            {item.name}
          </>
        );
      }

      // Item is a user to be mentioned
      if (!("native" in item) && "id" in item) {
        children = (
          <>
            <Avatar image={item.image} />
            {item.name ?? item.id}
          </>
        );
      }

      // Item is a command configured for the current channel
      if ("name" in item && "description" in item) {
        children = (
          <>
            <strong>/{item.name}</strong>
            {item.description}
          </>
        );
      }

      return (
        <button
          type="button"
          className={`suggestion-list__item ${props.selected ? "suggestion-list__item_selected" : ""}`}
          onFocus={() => props.onSelectHandler(item)}
          onMouseEnter={() => props.onSelectHandler(item)}
          onClick={(event) => props.onClickHandler(event, item)}
        >
          {children}
        </button>
      );
    };


    .suggestion-list__item {
      display: flex;
      align-items: center;
      gap: 10px;
      font: inherit;
      border: 0;
      background: none;
      padding: 20px 10px;
    }

    .suggestion-list__item_selected {
      background: #00000014;
    }

![](/_astro/message-input-ui-emoji-suggestions.D_ok1cyk_ZKOjJB.webp)

![](/_astro/message-input-ui-user-suggestions.jblmMgbK_Z20mdrJ.webp)

![](/_astro/message-input-ui-command-suggestions.BtA64oXh_ZFRjEi.webp)

If you are building an internationalized application, you will need to translate command descriptions and arguments. Translations for all of the supported languages are provided with the SDK. You can access them by using the translation helper function provided in the [`TranslationContext`](/chat/docs/sdk/react/guides/theming/translations/). All you need to do is to query the translation with the right key: `<command-name>-command-description` for the description, and `<command-name>-command-args` for the arguments (you can always refer to our [translation files](https://github.com/GetStream/stream-chat-react/blob/master/src/i18n/es.json) to check if the key is correct).


    // In CustomSuggestionItem component:
    const { t } = useTranslationContext();

    // Item is a command configured for the current channel
    if ("name" in item && "description" in item) {
      children = (
        <>
          <strong>/{item.name}</strong>
          {t(`${item.name}-command-description`, {
            defaultValue: item.description,
          })}
        </>
      );
    }

![](/_astro/message-input-ui-suggestions-localized.BLbVVGv8_1ezRS9.webp)

The English (US) translation is loaded from the Stream backend as part of the channel config object, and is not part of the translation resources, so we explicitly set it as the fallback value.

If you want to further customize the default behavior of the suggestion list, you can override the entire list component.

This is an easy way to add a header or footer to the list. You donât have to reimplement the whole list component, just create a small wrapper:

ReactCSS


    import { SuggestionList } from "stream-chat-react";

    const SuggestionListWithHeader = (props) => {
      let header = "";

      if (props.currentTrigger === "@") {
        header = "Users";
      }

      if (props.currentTrigger === "/") {
        header = "Commands";
      }

      if (props.currentTrigger === ":") {
        header = "Emoji";
      }

      if (props.value && props.value.length > 1) {
        header += ` matching "${props.value.slice(1)}"`;
      }

      return (
        <>
          <div className="suggestion-list__header">{header}</div>
          <SuggestionList {...props} />
        </>
      );
    };


    .suggestion-list__header {
      padding: 10px;
      font-size: 0.9em;
    }

This wrapper uses two props (provided to your component by the default message input component) to construct a header: `currentTrigger` contains the special character that triggered autocomplete, and `value` contains the query the user has typed so far.

Then override the [`AutocompleteSuggestionList`](/chat/docs/sdk/react/components/contexts/component_context#autocompletesuggestionlist/) list at the [`Channel`](/chat/docs/sdk/react/components/core-components/channel/) level, and youâre done:


    import {
      Chat,
      Channel,
      ChannelHeader,
      ChannelList,
      MessageList,
      Thread,
      Window,
      MessageInput,
    } from "stream-chat-react";
    import { SearchIndex } from "emoji-mart";

    export const App = () => (
      <Chat client={chatClient}>
        <ChannelList filters={filters} sort={sort} options={options} />
        <Channel
          AutocompleteSuggestionList={SuggestionListWithHeader}
          emojiSearchIndex={SearchIndex}
        >
          <Window>
            <ChannelHeader />
            <MessageList />
            <MessageInput />
          </Window>
          <Thread />
        </Channel>
      </Chat>
    );

![](/_astro/message-input-ui-suggestions-header.BIR1mahR_Z1bGFjr.webp)

Or you can go deeper and reimplement the entire list component from scratch. Note that in this case itâs up to you to handle the interactions and accessibility. This example implementation is a good starting point, but it doesnât handle any keyboard interactions:

ReactCSS


    const CustomSuggestionList = (props) => {
      const [selectedIndex, setSelectedIndex] = useState(0);

      if (selectedIndex >= props.values.length && selectedIndex !== 0) {
        setSelectedIndex(0);
      }

      const handleClick = (item) => {
        props.onSelect(props.getTextToReplace(item));
      };

      return (
        <ul className="suggestion-list">
          {props.values.map((item, index) => (
            <li key={index} className="suggestion-list__item-container">
              <CustomSuggestionItem
                item={item}
                selected={index === selectedIndex}
                onSelectHandler={() => setSelectedIndex(index)}
                onClickHandler={() => handleClick(item)}
              />
            </li>
          ))}
        </ul>
      );
    };


    .suggestion-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .suggestion-list__item {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
      font: inherit;
      border: 0;
      background: none;
      padding: 20px 10px;
    }

    .suggestion-list__item_selected {
      background: #00000014;
    }

Finally, if you are implementing the entire message input component [from scratch](/chat/docs/sdk/react/guides/theming/input_ui/), itâs up to you to build the autocomplete functionality. The good news is that the [`autocompleteTriggers`](/chat/docs/sdk/react/components/contexts/message_input_context#autocompletetriggers/) value in the `MessageInputContext` provides a lot of reusable functionality. The bad news is that properly implementing autocomplete is still a lot of work.

Letâs try to tackle that. Weâll start with the simple message input implementation from the [Message Input UI cookbook](/chat/docs/sdk/react/guides/theming/input_ui/):


    import { useMessageInputContext } from "stream-chat-react";

    const CustomMessageInput = () => {
      const { text, handleChange, handleSubmit } = useMessageInputContext();

      return (
        <div className="message-input">
          <textarea
            value={text}
            className="message-input__input"
            onChange={handleChange}
          />
          <button
            type="button"
            className="message-input__button"
            onClick={handleSubmit}
          >
            â¬ï¸
          </button>
        </div>
      );
    };

The [`autocompleteTriggers`](/chat/docs/sdk/react/components/contexts/message_input_context#autocompletetriggers/) object is a map between special characters that trigger autocompletion suggestions and some useful functions:

  * `dataProvider` returns (via a callback) the list of suggestions, given the current query (the text after the trigger)
  * `callback` is the action that should be called when a suggestion is selected (e.g. when a user mention is selected, it modifies the message payload to include the mention)
  * `output` function returns the replacement text, given one of the items returned by the `dataProvider`

The keys of the `autocompleteTriggers` are the characters that should trigger autocomplete suggestions.

Weâll start by using the `dataProvider` to display the list of suggestions once the trigger character is entered by the user. We use a (memoized) regular expression to find trigger characters, and then we query the `dataProvider` for suggestions.

When the suggestions are ready, the `dataProvider` invokes a callback, where we update the current suggestion list. We must be careful not to run into a race condition here, so before the update, we check to see if the input has changed since we queried the suggestions.

Finally, we render the suggestion list:

ReactCSS


    import { useMessageInputContext } from "stream-chat-react";

    function CustomMessageInput() {
      const {
        text,
        autocompleteTriggers,
        handleChange: onChange,
        handleSubmit,
      } = useMessageInputContext();

      const inputRef = useRef < HTMLTextAreaElement > null;
      const [trigger, setTrigger] = (useState < string) | (null > null);
      const [suggestions, setSuggestions] = useState([]);

      const triggerQueryRegex = useMemo(() => {
        if (!autocompleteTriggers) {
          return null;
        }

        const triggerCharacters = Object.keys(autocompleteTriggers);
        // One of the trigger characters, followed by one or more non-space characters
        return new RegExp(String.raw`([${triggerCharacters}])(\S+)`);
      }, [autocompleteTriggers]);

      const handleChange = (event) => {
        onChange(event);

        if (autocompleteTriggers && triggerQueryRegex) {
          const input = event.currentTarget;
          const updatedText = input.value;
          const textBeforeCursor = updatedText.slice(0, input.selectionEnd);
          const match = textBeforeCursor.match(triggerQueryRegex);

          if (!match) {
            setTrigger(null);
            setSuggestions([]);
            return;
          }

          const trigger = match[1];
          const query = match[2];

          // Query the dataProvider for the suggestions
          autocompleteTriggers[trigger].dataProvider(
            query,
            updatedText,
            (suggestions) => {
              // Unless the input has changed, update the suggestion list
              if (input.value === updatedText) {
                setTrigger(match[0]);
                setSuggestions(suggestions);
              }
            },
          );
        }
      };

      return (
        <div className="message-input">
          {suggestions.length > 0 && (
            <div className="suggestions">
              {suggestions.map((item) => (
                <button className="suggestions__item">
                  {"native" in item &&
                    typeof item.native === "string" &&
                    item.native}
                  <strong>{item.name}</strong>
                  {"description" in item &&
                    typeof item.description === "string" &&
                    item.description}
                </button>
              ))}
            </div>
          )}
          <div className="message-input__composer">
            <textarea
              ref={inputRef}
              className="message-input__input"
              value={text}
              onChange={handleChange}
            />
            <button
              type="button"
              className="message-input__button"
              onClick={handleSubmit}
            >
              â¬ï¸
            </button>
          </div>
        </div>
      );
    }


    .message-input {
      margin: 16px;
    }

    .message-input__composer {
      display: flex;
      align-items: center;
      border: 2px solid #00000029;
      border-radius: 8px;
    }

    .message-input__composer:has(.message-input__input:focus) {
      border-color: #005fff;
    }

    .message-input__input {
      flex-grow: 1;
      border: 0;
      outline: 0;
      background: none;
      font: inherit;
      padding: 8px;
      resize: none;
    }

    .message-input__button {
      border: 1px solid transparent;
      outline: 0;
      background: none;
      font: inherit;
      border-radius: 4px;
      margin: 8px;
      padding: 8px;
      cursor: pointer;
    }

    .message-input__button:hover {
      background: #fafafa;
      border-color: #00000014;
    }

    .message-input__button:focus,
    .message-input__button:focus-within {
      border-color: #005fff;
    }

    .suggestions {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      margin-bottom: 10px;
      font-size: 0.9em;
    }

    .suggestions__item {
      font: inherit;
      display: flex;
      gap: 5px;
      padding: 5px 10px;
      border-radius: 20px;
      border: 0;
      background: #e9eaed;
      cursor: pointer;
    }

![](/_astro/message-input-ui-emoji-autocomplete.B0resFcD_1hHF0o.webp)

![](/_astro/message-input-ui-user-autocomplete.qXbkN2pJ_1lKB7.webp)

![](/_astro/message-input-ui-command-autocomplete.BhdPhLiy_tTydT.webp)

But we are not done yet. Displaying suggestions is only half of the puzzle. The second half is reacting when the user selects one of the suggestions.

When the user selects a suggestion, we should do two things:

  1. Call the `callback` for the current trigger. This will, for example, update the message payload with a user mention.
  2. Examine the return value of the `output` for the selected suggestion, and update the message input text accordingly.

The `output` returns an object that looks something like this:


    {
      "text": "replacement text",
      "caretPosition": "next"
    }

The `text` property tells us what to replace the current trigger with, and the `caretPosition` property tells us where the cursor should end up after the update: either before or after the inserted replacement.

Letâs add a handler for the click event on the suggestion:


    const handleSuggestionClick = (item) => {
      if (autocompleteTriggers && trigger) {
        const { callback, output } = autocompleteTriggers[trigger[0]];
        callback?.(item);
        const replacement = output(item);

        if (replacement) {
          const start = text.indexOf(trigger);
          const end = start + trigger.length;
          const caretPosition =
            replacement.caretPosition === "start"
              ? start
              : start + replacement.text.length;

          const updatedText =
            text.slice(0, start) + replacement.text + text.slice(end);
          flushSync(() => setText(updatedText));
          inputRef.current?.focus();
          inputRef.current?.setSelectionRange(caretPosition, caretPosition);
        }
      }
    };

And there you have it, the complete example that you can use as a starting point for your own autocomplete implementation:

ReactCSS


    import { useMessageInputContext } from "stream-chat-react";

    function CustomMessageInput() {
      const {
        text,
        autocompleteTriggers,
        handleChange: onChange,
        handleSubmit,
      } = useMessageInputContext();

      const inputRef = useRef < HTMLTextAreaElement > null;
      const [trigger, setTrigger] = (useState < string) | (null > null);
      const [suggestions, setSuggestions] = useState([]);

      const triggerQueryRegex = useMemo(() => {
        if (!autocompleteTriggers) {
          return null;
        }

        const triggerCharacters = Object.keys(autocompleteTriggers);
        return new RegExp(String.raw`([${triggerCharacters}])(\S+)`);
      }, [autocompleteTriggers]);

      const handleChange = (event) => {
        onChange(event);

        if (autocompleteTriggers && triggerQueryRegex) {
          const input = event.currentTarget;
          const updatedText = input.value;
          const textBeforeCursor = updatedText.slice(0, input.selectionEnd);
          const match = textBeforeCursor.match(triggerQueryRegex);

          if (!match) {
            setTrigger(null);
            setSuggestions([]);
            return;
          }

          const trigger = match[1];
          const query = match[2];

          autocompleteTriggers[trigger].dataProvider(
            query,
            updatedText,
            (suggestions) => {
              if (input.value === updatedText) {
                setTrigger(match[0]);
                setSuggestions(suggestions);
              }
            },
          );
        }
      };

      const handleSuggestionClick = (item) => {
        if (autocompleteTriggers && trigger) {
          const { callback, output } = autocompleteTriggers[trigger[0]];
          callback?.(item);
          const replacement = output(item);

          if (replacement) {
            const start = text.indexOf(trigger);
            const end = start + trigger.length;
            const caretPosition =
              replacement.caretPosition === "start"
                ? start
                : start + replacement.text.length;

            const updatedText =
              text.slice(0, start) + replacement.text + text.slice(end);
            flushSync(() => setText(updatedText));
            inputRef.current?.focus();
            inputRef.current?.setSelectionRange(caretPosition, caretPosition);
          }
        }
      };

      return (
        <div className="message-input">
          {suggestions.length > 0 && (
            <div className="suggestions">
              {suggestions.map((item) => (
                <button
                  className="suggestions__item"
                  onClick={() => handleSuggestionClick(item)}
                >
                  {"native" in item &&
                    typeof item.native === "string" &&
                    item.native}
                  <strong>{item.name}</strong>
                  {"description" in item &&
                    typeof item.description === "string" &&
                    item.description}
                </button>
              ))}
            </div>
          )}
          <div className="message-input__composer">
            <textarea
              ref={inputRef}
              className="message-input__input"
              value={text}
              onChange={handleChange}
            />
            <button
              type="button"
              className="message-input__button"
              onClick={handleSubmit}
            >
              â¬ï¸
            </button>
          </div>
        </div>
      );
    }


    .message-input {
      margin: 16px;
    }

    .message-input__composer {
      display: flex;
      align-items: center;
      border: 2px solid #00000029;
      border-radius: 8px;
    }

    .message-input__composer:has(.message-input__input:focus) {
      border-color: #005fff;
    }

    .message-input__input {
      flex-grow: 1;
      border: 0;
      outline: 0;
      background: none;
      font: inherit;
      padding: 8px;
      resize: none;
    }

    .message-input__button {
      border: 1px solid transparent;
      outline: 0;
      background: none;
      font: inherit;
      border-radius: 4px;
      margin: 8px;
      padding: 8px;
      cursor: pointer;
    }

    .message-input__button:hover {
      background: #fafafa;
      border-color: #00000014;
    }

    .message-input__button:focus,
    .message-input__button:focus-within {
      border-color: #005fff;
    }

    .suggestions {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      margin-bottom: 10px;
      font-size: 0.9em;
    }

    .suggestions__item {
      font: inherit;
      display: flex;
      gap: 5px;
      padding: 5px 10px;
      border-radius: 20px;
      border: 0;
      background: #e9eaed;
      cursor: pointer;
    }

[PreviousAttachment Previews in Message Input](/chat/docs/sdk/react/guides/message-input/attachment_previews/)[NextTyping Indicator](/chat/docs/sdk/react/guides/customization/typing_indicator/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

In this example, we will demonstrate how to use a custom `ChannelHeader` component instead of the default. Unlike most of the other library components where a prop on a parent component will override the default, for this component all you need to do is use your custom component in place of the libraryâs header option.

The default header displays the name of the channel, the number of members, and the number of members online. In our example, we will display the name and add the typing indicator below. We need to pull the `channel` information from context. Pulling from this context is possible in our custom component because itâs a child of `Channel`.


    const CustomChannelHeader = (props: ChannelHeaderProps) => {
      const { title } = props;

      const { channel } = useChannelStateContext();
      const { name } = channel.data || {};

      return <div>{title || name}</div>;
    };

Letâs add the typing indicator to our header component and remove the indicator where it appears by default in the `MessageList`. We can accomplish the removal by overriding the default with a null value.


    const CustomChannelHeader = (props: ChannelHeaderProps) => {
        const { title } = props;

        const { channel } = useChannelStateContext();
        const { name } = channel.data || {};

        return (
            <>
                <div>{title || name}</div>
                <TypingIndicator />
            </>
        )
    }

    <Channel TypingIndicator={() => null}>

The options are endless for displaying additional items in the header since so much more information is available to us if we were to continue destructuring from the `channel` object. For this demo, though, letâs add both library styling and local CSS and call it a day.


    .header-title {
      padding: 5px 7px;
    }

    .header-pound {
      color: #006cff;
      font-weight: 800;
      padding-right: 2px;
    }


    const CustomChannelHeader = (props: ChannelHeaderProps) => {
      const { title } = props;

      const { channel } = useChannelStateContext();
      const { name } = channel.data || {};

      return (
        <div className="str-chat__header-livestream">
          <div>
            <div className="header-item">
              <span className="header-pound">#</span>
              {title || name}
            </div>
            <TypingIndicator />
          </div>
        </div>
      );
    };

Finally and most importantly, letâs add in our custom component in the place where the default would have been.


    .header-title {
      padding: 5px 7px;
    }

    .header-pound {
      color: #006cff;
      font-weight: 800;
      padding-right: 2px;
    }


    const CustomChannelHeader = (props: ChannelHeaderProps) => {
      const { title } = props;

      const { channel } = useChannelStateContext();
      const { name } = channel.data || {};

      return (
        <div className="str-chat__header-livestream">
          <div>
            <div className="header-item">
              <span className="header-pound">#</span>
              {title || name}
            </div>
            <TypingIndicator />
          </div>
        </div>
      );
    };


    const App = () => (
      <Chat client={chatClient}>
        <ChannelList />
        <Channel TypingIndicator={() => null}>
          <Window>
            <CustomChannelHeader />
            <MessageList />
            <MessageInput />
          </Window>
          <Thread />
        </Channel>
      </Chat>
    );

![Custom ChannelHeader in Chat](/_astro/CustomChannelHeader.CcNAH1m2_Z24CBsR.webp)

[PreviousApp Menu](/chat/docs/sdk/react/guides/customization/app_menu/)[NextThread Header](/chat/docs/sdk/react/guides/customization/thread_header/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

Most of the application state which is the main driver behind the UI changes of our chat SDK lives within our low-level client (LLC) - [`StreamChat`](https://github.com/GetStream/stream-chat-js) \- more specifically client and channel instances and is **NOT REACTIVE** \- our React SDK makes these state stores reactive by listening to the same events client does and copies it with the help of `useState` API after it has been changed. Optimistic updates - if applicable - are handled by and are local only to React SDK.

This is how the SDK state pipeline looks like behind the scenes:


    sequenceDiagram
      box Stream Chat Client
        participant Client State
        participant WebSocket Client
      end

      box Stream React SDK
        participant UI Components
      end

      Client State->>WebSocket Client: attach listeners to keep the state up-to-date
      UI Components->>WebSocket Client: attach listeners to keep UI up-to-date
      WebSocket Client->>Client State: receive a WebSocket message and trigger listeners
      Client State->>Client State: update client state
      WebSocket Client->>UI Components: receive a WebSocket message and trigger listeners
      UI Components->>Client State: reach for updated client state
      UI Components->>UI Components: update UI

The SDK comes with [`ChatContext`](/chat/docs/sdk/react/components/contexts/chat_context/) which holds (among other things) currently active channel instance and forwards LLC instance passed to the [`Chat`](/chat/docs/sdk/react/components/core-components/chat/) component. Before you can access the _reactive_ channel state youâll need to set the channel instance as active. The channel becomes active when:

  * itâs user-selected in the [`ChannelList`](/chat/docs/sdk/react/components/core-components/channel_list/) component (if youâre using our ([default setup](/chat/docs/sdk/react/basics/getting_started#your-first-app-with-stream-chat-react/)), you probably already have `ChannelList` in your application)

  * itâs passed to the `channel` prop of the [`Channel`](/chat/docs/sdk/react/components/core-components/channel/) component

        import { useState, useEffect } from "react";
        import { Channel, useChatContext } from "stream-chat-react";

        export const ChannelWrapper = ({
          channelId,
          channelType = "messaging",
          children,
        }) => {
          const [activeChannel, setActiveChannel] = useState(undefined);
          const { client } = useChatContext();

          useEffect(() => {
            if (!channelId) return;

            const channel = client.channel(channelType, channelId);

            setActiveChannel(channel);
          }, [channelId, channelType]);

          return <Channel channel={activeChannel}>{children}</Channel>;
        };

  * itâs set as active by calling the [`setActiveChannel`](/chat/docs/sdk/react/components/contexts/chat_context#setactivechannel/) function coming from the [`ChatContext`](/chat/docs/sdk/react/components/contexts/chat_context/) (this function is used by [`ChannelList`](/chat/docs/sdk/react/components/core-components/channel_list/) behind the scenes)

        import { useEffect } from "react";
        import {
          useCreateChatClient,
          useChatContext,
          Chat,
          Channel,
        } from "stream-chat-react";

        const ActiveChannelSetter = ({ channelId, channelType }) => {
          const { client, setActiveChannel } = useChatContext();

          useEffect(() => {
            const channel = client.channel(channelType, channelId);
            setActiveChannel(channel);
          }, [channelType, channelId]);

          return null;
        };

        const App = () => {
          const client = useCreateChatClient(userData);

          if (!client) return <div>Loading...</div>;

          return (
            <Chat client={client}>
              <ActiveChannelSetter channelId="random" channelType="messaging" />
              <Channel>{"...other components..."}</Channel>
            </Chat>
          );
        };

You can use either `channel` prop on the [`Channel`](/chat/docs/sdk/react/components/core-components/channel/) component or [`setActiveChannel`](/chat/docs/sdk/react/components/contexts/chat_context#setactivechannel/) function. You cannot use both at the same time.

Currently active [channel state](https://github.com/GetStream/stream-chat-react/blob/master/src/context/ChannelStateContext.tsx#L36-L56) and channel instance can be accessed through the [`ChannelStateContext`](/chat/docs/sdk/react/components/contexts/channel_state_context/) with the help of the [`useChannelStateContext`](/chat/docs/sdk/react/components/contexts/channel_state_context#basic-usage/) hook - meaning any component which is either direct or indirect child of the [`Channel`](/chat/docs/sdk/react/components/core-components/channel/) component can access such state.

The example bellow shows how to reach `members` and `channel` property coming from the channel state:


    import { useEffect } from "react";
    import { Channel, useChannelStateContext } from "stream-chat-react";

    const MembersCount = () => {
      const { members, channel } = useChannelStateContext();

      useEffect(() => {
        console.log(`Currently active channel changed, channelId: ${channel.id}`);
      }, [channel]);

      return <div>{Object.keys(members).length}</div>;
    };

    const ChannelWrapper = () => (
      <Channel>
        <MembersCount />
      </Channel>
    );

[`ChannelList`](/chat/docs/sdk/react/components/core-components/channel_list/) component is a standalone component which (unsurprisingly) holds and manages list of channels. You can access loaded `channels` from [`ChannelListContext`](/chat/docs/sdk/react/components/contexts/channel_list_context/) with the help of `useChannelListContext` hook. Any component which is either direct or indirect child of the [`ChannelList`](/chat/docs/sdk/react/components/core-components/channel_list/) component can access such state ([Channel Preview](/chat/docs/sdk/react/components/utility-components/channel_preview_ui/) for example).


    import { ChannelList, ChannelPreviewMessenger } from "stream-chat-react";
    import type { ChannelListProps } from "stream-chat-react";

    const CustomPreviewUI = (props) => {
      const { channels } = useChannelListContext();

      return <ChannelPreviewMessenger {...props} />;
    };

    export const CustomChannelList = (props: ChannelListProps) => {
      return <ChannelList Preview={CustomPreviewUI} {...props} />;
    };

With the new [threads feature](/chat/docs/sdk/react/release-guides/upgrade-to-v12#introducing-threads-20/) weâve decided to refresh our state management and moved to a subscribable POJO with selector based system to make developer experience better when it came to rendering information provided by our `StreamChat` client.

This change is currently only available within `StreamChat.threads` but will be reused across the whole SDK later on.

Our SDK holds and provides A LOT of information to our integrators and each of those integrators sometimes require different data or forms of data to display to their users. All of this important data now lives within something we call state object and through custom-tailored selectors our integrators can access the combination of data they require without any extra overhead and performance to match.

Selectors are functions provided by integrators that run whenever state object changes. These selectors should return piece of that state that is important for the appropriate component that renders that piece of information. Selectors itself should not do any heavy data computations that could resolve in generating new data each time the selector runs (arrays and objects), use pre-built hooks with computed state values or build your own if your codebase requires it.

1. Selectors should return a named object.



    const selector = (nextValue: ThreadManagerState) => ({
      unreadThreadsCount: nextValue.unreadThreadsCount,
      active: nextValue.active,
      lastConnectionDownAt: nextvalue.lastConnectionDownAt,
    });

  2. Selectors should live outside components scope or should be memoized if it requires âoutsideâ information (`userId` for `read` object for example). Not memoizing selectors (or not stabilizing them) will lead to bad performance as each time your component re-renders, the selector function is created anew and `useStateStore` goes through unsubscribe and resubscribe process unnecessarily.



    // â not okay
    const Component1 = () => {
      const { latestReply } = useThreadState((nextValue: ThreadState) => ({
        latestReply: nextValue.latestReplies.at(-1),
      }));

      return <div>{latestReply.text}</div>;
    };

    // â okay
    const selector = (nextValue: ThreadState) => ({
      latestReply: nextValue.latestReplies.at(-1),
    });

    const Component2 = () => {
      const { latestReply } = useThreadState(selector);

      return <div>{latestReply.text}</div>;
    };

    // â also okay
    const Component3 = ({ userId }: { userId: string }) => {
      const selector = useCallback(
        (nextValue: ThreadState) => ({
          unreadMessagesCount: nextValue.read[userId].unread_messages,
        }),
        [userId],
      );

      const { unreadMessagesCount } = useThreadState(selector);

      return <div>{unreadMessagesCount}</div>;
    };

  3. Break your components down to the smallest reasonable parts that each take care of the apropriate piece of state if it makes sense to do so.

Our SDK currently allows to access two of these state structures - in [`Thread`](https://github.com/GetStream/stream-chat-js/blob/master/src/thread.ts) and [`ThreadManager`](https://github.com/GetStream/stream-chat-js/blob/master/src/thread_manager.ts) instances under `state` property.

import { StreamChat } from "stream-chat";

    const client = new StreamChat(/*...*/);

    // calls console.log with the whole state object whenever it changes
    client.threads.state.subscribe(console.log);

    let latestThreads;
    client.threads.state.subscribeWithSelector(
      // called each time theres a change in the state object
      (nextValue) => ({ threads: nextValue.threads }),
      // called only when threads change (selected value)
      ({ threads }) => {
        latestThreads = threads;
      },
    );

    // returns lastest state object
    const state = client.threads.state.getLatestValue();

    const [thread] = latestThreads;

    // thread instances come with the same functionality
    thread?.state.subscribe(/*...*/);
    thread?.state.subscribeWithSelector(/*...*/);
    thread?.state.getLatestValue(/*...*/);

For the ease of use - the React SDK comes with the appropriate state acesss hook which wraps `StateStore.subscribeWithSelector` API for the React-based applications.


    import { useStateStore } from "stream-chat-react";
    import type { ThreadManagerState } from "stream-chat";

    const selector = (nextValue: ThreadManagerState) => ({
      threads: nextValue.threads,
    });

    const CustomThreadList = () => {
      const { client } = useChatContext();
      const { threads } = useStateStore(client.threads.state, selector);

      return (
        <ul>
          {threads.map((thread) => (
            <li key={thread.id}>{thread.id}</li>
          ))}
        </ul>
      );
    };

Both of these hooks use `useStateStore` under the hood but access their respective states through appropriate contexts; for `ThreadManagerState` itâs `ChatContext` (accessing `client.threads.state`) and for `ThreadState` itâs `ThreadListItemContext` first and `ThreadContext` second meaning that the former is prioritized. While these hooks make it sligthly easier for our integrators to reach reactive state


    // memoized or living outside component's scope
    const threadStateSelector = (nextValue: ThreadState) => ({
      replyCount: nextValue.replyCount,
    });
    const threadManagerStateSelector = (nextValue: ThreadState) => ({
      threadsCount: nextValue.threads.length,
    });

    const MyComponent = () => {
      const { replyCount } = useThreadState(threadStateSelector);
      const { threadsCount } = useThreadManagerState(threadManagerStateSelector);

      return null;
    };

This guide covers the biggest and most important state stores, see other React stateful contexts exported by our SDK for more information.

Mentioned in this article:

  * [`ChannelStateContext`](/chat/docs/sdk/react/components/contexts/channel_state_context/)
  * [`ChatContext`](/chat/docs/sdk/react/components/contexts/chat_context/)
  * [`ChannelListContext`](/chat/docs/sdk/react/components/contexts/channel_list_context/)

Other data/action providers:

  * [`ComponentContext`](/chat/docs/sdk/react/components/contexts/component_context/)
  * [`ChannelActionContext`](/chat/docs/sdk/react/components/contexts/channel_action_context/)
  * [`MessageContext`](/chat/docs/sdk/react/components/contexts/message_context/)
  * [`MessageInputContext`](/chat/docs/sdk/react/components/contexts/message_input_context/)
  * [`MessageListContext`](/chat/docs/sdk/react/components/contexts/message_list_context/)

[PreviousVideo & Audio by Stream](/chat/docs/sdk/react/guides/video-integration/video-integration-stream/)[NextDate and time formatting](/chat/docs/sdk/react/guides/date-time-formatting/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

Livestream chat UI poses several hard technological challenges since users can spend a few hours watching a certain event. For that period, the chat UI should be able to handle a constant stream of messages, reactions, and media attachments.

The React SDK offers a special component for that purpose - the `VirtualizedMessageList`. The component renders only the messages visible in the viewport and dynamically updates its contents as the user scrolls. This decreases browser memory usage and does not degrade the performance of the page even if the user receives thousands of messages in a single session.

In this article, we will go through the best practices and tweaks for configuring the `VirtualizedMessageList` to ensure a smooth user experience during a high message traffic.

The `VirtualizedMessageList` is mostly compatible with the non-virtualized `MessageList`, although not all properties are the same. The simplest configuration and placement are the same:


    <Chat client={client}>
      <ChannelList />
      <Channel>
        <VirtualizedMessageList />
        <MessageInput />
      </Channel>
    </Chat>

With this configuration, the virtualized list will look identical to the non-virtualized version. With the next few steps, we can configure the component for maximum performance.

By default, the `VirtualizedMessageList` will scroll down to display new messages using the `"smooth"` scroll behavior ([MDN link](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollTo#examples)). This works well for moderately busy chat rooms but can be unwieldy in chats with more than 2-3 incoming messages per second. A safer, snappier option is `"auto"`. With that setting, the list scrolls to the latest received message instantly.


    <VirtualizedMessageList stickToBottomScrollBehavior="auto" />

The `VirtualizedMessageList` supports items with varying heights and automatically keeps track of the rendered item sizes, while estimating the not-yet-rendered sizes based on latest message during load. To optimize this further and minimize potential recalculations, set the `defaultItemHeight` to the height of your usual one-line message (If in doubt, use the developer tools inspector to determine the sizing).

![Message Height](/_astro/message-height.o8MUNlLA_ogkVi.webp)

The element above is `58px` tall, so letâs put that at the `defaultItemHeight` prop value:


    <VirtualizedMessageList defaultItemHeight={58} />

If the custom Message component has vertical margins that affect its height, the message list might behave erratically (blinking, rendering white areas, etc).

This could be a potential pitfall if youâre using a custom message component. The `VirtualizedMessageList` uses `getBoundingClientRect` ([MDN](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect)) on the outermost message element. This method does not measure CSS margins, which are tricky to measure in the first place [due to collapsing](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Box_Model/Mastering_margin_collapsing). If the custom Message component has vertical margins that affect its height, the message list might behave erratically (blinking, rendering white areas, etc).

Use your DOM inspector and look for any orange gaps between the message elements. See the screenshot below for example of headings with margins:

![Margin Inspector](/_astro/margin-inspector.B2LFjcFa_Z1yPKHP.webp)

This practice is not unique to the virtualized message list but might help you build a more compact chat timeline and reduce the overall traffic for your users. By default, the Giphy attachments [use the original Giphy version image](https://developers.giphy.com/docs/api/schema#image-object). You can override that by setting the `giphyVersion` property of the `Channel` Component to a smaller one - use the keys [from the Giphy documentation](https://developers.giphy.com/docs/api/schema#image-object).


    <Chat client={client}>
      <ChannelList />
      <Channel giphyVersion="fixed_height_small">
        <VirtualizedMessageList />
        <MessageInput />
      </Channel>
    </Chat>

One final best practice: make sure that adding reactions to the message does not increase the message height if youâre using a custom `Message` component. Good examples for such design would be the chat boxes of Twitch and Telegram. Avoiding that will make the message list appear more stable and less jumpy during high traffic.

[PreviousClient and User](/chat/docs/sdk/react/guides/client-and-user/)[NextTranslation and i18n](/chat/docs/sdk/react/guides/theming/translations/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

Message input is used for composing and editing messages. In this sense, itâs a primary component that users interact with in a chat, so itâs important to get it right.

Message input is a bit more complex than it might seem at first glance. Not just a text box with a âsendâ button, it has a lot of hidden features:

  1. Updating the typing status
  2. Uploading and previewing attachments
  3. Displaying link previews
  4. Auto-completing mentions, commands, emojiâ¦

We can compose our message input UI from the pre-built components:


    import {
      AttachmentPreviewList,
      LinkPreviewList,
      QuotedMessagePreview,
      SimpleAttachmentSelector,
      useComponentContext,
      useMessageInputContext,
    } from "stream-chat-react";

    const SendButtonWithCooldown = () => {
      const { handleSubmit, cooldownRemaining, setCooldownRemaining } =
        useMessageInputContext();

      return cooldownRemaining ? (
        <CooldownTimer
          cooldownInterval={cooldownRemaining}
          setCooldownRemaining={setCooldownRemaining}
        />
      ) : (
        <SendButton sendMessage={handleSubmit} />
      );
    };

    const CustomMessageInput = () => (
      <div className="message-input">
        <div className={"left-container"}>
          <SimpleAttachmentSelector />
        </div>
        <div className={"central-container"}>
          <QuotedMessagePreview />
          <LinkPreviewList />
          <AttachmentPreviewList />
          <TextareaComposer />
        </div>
        <div className={"right-container"}>
          <SendButtonWithCooldown />
        </div>
      </div>
    );

Note that you should not render your custom message input directly, but instead pass it as a prop to either [`Channel`](/chat/docs/sdk/react/components/core-components/channel/) or [`MessageInput`](/chat/docs/sdk/react/components/message-input-components/message_input/) component. That way, you can be sure that your input is wrapped with the necessary context providers, most importantly the [`MessageInputContext`](/chat/docs/sdk/react/components/contexts/message_input_context/).


    import {
      Chat,
      Channel,
      ChannelHeader,
      ChannelList,
      MessageList,
      Thread,
      Window,
      MessageInput,
    } from "stream-chat-react";
    import { CustomMessageInput } from "./CustomMessageInput";

    export const App = () => (
      <Chat client={chatClient}>
        <ChannelList filters={filters} sort={sort} options={options} />
        <Channel>
          <Window>
            <ChannelHeader />
            <MessageList />
            <MessageInput Input={CustomMessageInput} />
          </Window>
          <Thread />
        </Channel>
      </Chat>
    );

[PreviousSystem Message](/chat/docs/sdk/react/guides/customization/system_message/)[NextLink Previews in Message Input](/chat/docs/sdk/react/guides/customization/link-previews/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

## Theming

CSS variables are the easiest way to customize the theme. The variables are organized into two layers:

  * Global
  * Component

Global variables change the layout/look-and-feel of the whole chat UI, meanwhile component variables change only a part of it (for example message component).

Component variables can be further grouped in the following ways:

  * **Theme variables** for changing text and background colors, borders and shadows
  * **Layout variables** defined for some components (but not all) to change the size of a specific part of a component

You can find the list of components below:

Component name| Variables
---|---
`AttachmentList`| [theme variables](https://github.com/GetStream/stream-chat-css/tree/v5.2.0/src/v2/styles/AttachmentList/AttachmentList-theme.scss), [layout variables](https://github.com/GetStream/stream-chat-css/tree/v5.2.0/src/v2/styles/AttachmentList/AttachmentList-layout.scss)
`AttachmentPreviewList`| [theme variables](https://github.com/GetStream/stream-chat-css/tree/v5.2.0/src/v2/styles/AttachmentPreviewList/AttachmentPreviewList-theme.scss), [layout variables](https://github.com/GetStream/stream-chat-css/tree/v5.2.0/src/v2/styles/AttachmentPreviewList/AttachmentPreviewList-layout.scss)
`AudioRecorder`| [theme variables](https://github.com/GetStream/stream-chat-css/tree/v5.2.0/src/v2/styles/AudioRecorder/AudioRecorder-theme.scss), [layout variables](https://github.com/GetStream/stream-chat-css/tree/v5.2.0/src/v2/styles/AudioRecorder/AudioRecorder-layout.scss)
`Autocomplete`| [theme variables](https://github.com/GetStream/stream-chat-css/tree/v5.2.0/src/v2/styles/Autocomplete/Autocomplete-theme.scss)
`Avatar`| [theme variables](https://github.com/GetStream/stream-chat-css/tree/v5.2.0/src/v2/styles/Avatar/Avatar-theme.scss), [layout variables](https://github.com/GetStream/stream-chat-css/tree/v5.2.0/src/v2/styles/Avatar/Avatar-layout.scss)
`Channel`| [theme variables](https://github.com/GetStream/stream-chat-css/tree/v5.2.0/src/v2/styles/Channel/Channel-theme.scss), [layout variables](https://github.com/GetStream/stream-chat-css/tree/v5.2.0/src/v2/styles/Channel/Channel-layout.scss)
`ChannelHeader`| [theme variables](https://github.com/GetStream/stream-chat-css/tree/v5.2.0/src/v2/styles/ChannelHeader/ChannelHeader-theme.scss)
`ChannelList`| [theme variables](https://github.com/GetStream/stream-chat-css/tree/v5.2.0/src/v2/styles/ChannelList/ChannelList-theme.scss), [layout variables](https://github.com/GetStream/stream-chat-css/tree/v5.2.0/src/v2/styles/ChannelList/ChannelList-layout.scss)
`ChannelPreview`| [theme variables](https://github.com/GetStream/stream-chat-css/tree/v5.2.0/src/v2/styles/ChannelPreview/ChannelPreview-theme.scss), [layout variables](https://github.com/GetStream/stream-chat-css/tree/v5.2.0/src/v2/styles/ChannelPreview/ChannelPreview-layout.scss)
`ChannelSearch` (React SDK only)| [theme variables](https://github.com/GetStream/stream-chat-css/tree/v5.2.0/src/v2/styles/ChannelSearch/ChannelSearch-theme.scss)
`ChatView` (React SDK only)| [theme variables](https://github.com/GetStream/stream-chat-css/tree/v5.2.0/src/v2/styles/ChatView/ChatView-theme.scss), [layout variables](https://github.com/GetStream/stream-chat-css/tree/v5.2.0/src/v2/styles/ChatView/ChatView-layout.scss)
`CircleFAButton`| [theme variables](https://github.com/GetStream/stream-chat-css/tree/v5.2.0/src/v2/styles/CircleFAButton/CircleFAButton-theme.scss)
`CTAButton`| [theme variables](https://github.com/GetStream/stream-chat-css/tree/v5.2.0/src/v2/styles/CTAButton/CTAButton-theme.scss)
`Dialog`| [theme variables](https://github.com/GetStream/stream-chat-css/tree/v5.2.0/src/v2/styles/Dialog/Dialog-theme.scss)
`DragAndDropContainer`| [theme variables](https://github.com/GetStream/stream-chat-css/tree/v5.2.0/src/v2/styles/DragAndDropContainer/DragAndDropContainer-theme.scss)
`EditMessageForm`| [theme variables](https://github.com/GetStream/stream-chat-css/tree/v5.2.0/src/v2/styles/EditMessageForm/EditMessageForm-theme.scss)
`Icon` (Angular SDK only)| [theme variables](https://github.com/GetStream/stream-chat-css/tree/v5.2.0/src/v2/styles/Icon/Icon-theme.scss), [layout variables](https://github.com/GetStream/stream-chat-css/tree/v5.2.0/src/v2/styles/Icon/Icon-layout.scss)
`ImageCarousel` (Angular SDK only)| [theme variables](https://github.com/GetStream/stream-chat-css/tree/v5.2.0/src/v2/styles/ImageCarousel/ImageCarousel-theme.scss), [layout variables](https://github.com/GetStream/stream-chat-css/tree/v5.2.0/src/v2/styles/ImageCarousel/ImageCarousel-layout.scss)
`LoadingIndicator`| [theme variables](https://github.com/GetStream/stream-chat-css/tree/v5.2.0/src/v2/styles/LoadingIndicator/LoadingIndicator-theme.scss), [layout variables](https://github.com/GetStream/stream-chat-css/tree/v5.2.0/src/v2/styles/LoadingIndicator/LoadingIndicator-layout.scss)
`Message`| [theme variables](https://github.com/GetStream/stream-chat-css/tree/v5.2.0/src/v2/styles/Message/Message-theme.scss), [layout variables](https://github.com/GetStream/stream-chat-css/tree/v5.2.0/src/v2/styles/Message/Message-layout.scss)
`MessageActionsBox`| [theme variables](https://github.com/GetStream/stream-chat-css/tree/v5.2.0/src/v2/styles/MessageActionsBox/MessageActionsBox-theme.scss)
`MessageBouncePrompt`| [theme variables](https://github.com/GetStream/stream-chat-css/tree/v5.2.0/src/v2/styles/MessageBouncePrompt/MessageBouncePrompt-theme.scss)
`MessageInput`| [theme variables](https://github.com/GetStream/stream-chat-css/tree/v5.2.0/src/v2/styles/MessageInput/MessageInput-theme.scss), [layout variables](https://github.com/GetStream/stream-chat-css/tree/v5.2.0/src/v2/styles/MessageInput/MessageInput-layout.scss)
`MessageList`| [theme variables](https://github.com/GetStream/stream-chat-css/tree/v5.2.0/src/v2/styles/MessageList/MessageList-theme.scss)
`MessageNotification` (React SDK only)| [theme variables](https://github.com/GetStream/stream-chat-css/tree/v5.2.0/src/v2/styles/MessageNotification/MessageNotification-theme.scss)
`MessageReactions`| [theme variables](https://github.com/GetStream/stream-chat-css/tree/v5.2.0/src/v2/styles/MessageReactions/MessageReactions-theme.scss), [layout variables](https://github.com/GetStream/stream-chat-css/tree/v5.2.0/src/v2/styles/MessageReactions/MessageReactions-layout.scss)
`MessageReactionsSelector`| [theme variables](https://github.com/GetStream/stream-chat-css/tree/v5.2.0/src/v2/styles/MessageReactionsSelector/MessageReactionsSelector-theme.scss)
`Modal`| [theme variables](https://github.com/GetStream/stream-chat-css/tree/v5.2.0/src/v2/styles/Modal/Modal-theme.scss), [layout variables](https://github.com/GetStream/stream-chat-css/tree/v5.2.0/src/v2/styles/Modal/Modal-layout.scss)
`Notification`| [theme variables](https://github.com/GetStream/stream-chat-css/tree/v5.2.0/src/v2/styles/Notification/Notification-theme.scss)
`NotificationList`| [theme variables](https://github.com/GetStream/stream-chat-css/tree/v5.2.0/src/v2/styles/NotificationList/NotificationList-theme.scss)
`Poll`| [layout variables](https://github.com/GetStream/stream-chat-css/tree/v5.2.0/src/v2/styles/Poll/Poll-layout.scss)
`Thread`| [theme variables](https://github.com/GetStream/stream-chat-css/tree/v5.2.0/src/v2/styles/Thread/Thread-theme.scss)
`ThreadList` (React SDK only)| [theme variables](https://github.com/GetStream/stream-chat-css/tree/v5.2.0/src/v2/styles/ThreadList/ThreadList-theme.scss), [layout variables](https://github.com/GetStream/stream-chat-css/tree/v5.2.0/src/v2/styles/ThreadList/ThreadList-layout.scss)
`Tooltip`| [theme variables](https://github.com/GetStream/stream-chat-css/tree/v5.2.0/src/v2/styles/Tooltip/Tooltip-theme.scss)
`TypingIndicator`| [theme variables](https://github.com/GetStream/stream-chat-css/tree/v5.2.0/src/v2/styles/TypingIndicator/TypingIndicator-theme.scss)
`UnreadCountBadge` (React SDK only)| [theme variables](https://github.com/GetStream/stream-chat-css/tree/v5.2.0/src/v2/styles/UnreadCountBadge/UnreadCountBadge-theme.scss), [layout variables](https://github.com/GetStream/stream-chat-css/tree/v5.2.0/src/v2/styles/UnreadCountBadge/UnreadCountBadge-layout.scss)
`VirtualizedMessageList` (React SDK only)| [theme variables](https://github.com/GetStream/stream-chat-css/tree/v5.2.0/src/v2/styles/VirtualizedMessageList/VirtualizedMessageList-theme.scss)

[PreviousPalette variables](/chat/docs/sdk/react/theming/palette-variables/)[NextGlobal variables](/chat/docs/sdk/react/theming/global-variables/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

The SDK provides default CSS, which can be overridden by the integrators.

If youâre using SCSS:


    @import "~stream-chat-react/dist/scss/v2/index.scss";

If youâre using CSS:


    @import "~stream-chat-react/dist/css/v2/index.css";

Our theming system has various customization options allowing for both smaller and large-scale UI changes. This document guides you through the different customization options.

CSS variables are the easiest way to customize the theme. The variables are organized into two layers:

  * global
  * component

You can use global variables to apply changes to the whole chat UI (as opposed to changing the design of individual components).

The [full list of global variables](/chat/docs/sdk/react/theming/global-variables/) can be found in our global variables guide.

Here is the default chat UI:

![Stream Chat Css Chat Ui Screenshot](/_astro/chat-ui-layout-screenshot.Be2DEs1Z_Z2lO5Lw.webp)

Here is how you can customize global variables:


    @import "~stream-chat-react/dist/scss/v2/index.scss";


    .str-chat {
      --str-chat__primary-color: #009688;
      --str-chat__active-primary-color: #004d40;
      --str-chat__surface-color: #f5f5f5;
      --str-chat__secondary-surface-color: #fafafa;
      --str-chat__primary-surface-color: #e0f2f1;
      --str-chat__primary-surface-color-low-emphasis: #edf7f7;
      --str-chat__border-radius-circle: 6px;
    }

Here is the result:

![Stream Chat Css Chat Ui Theme Customization Screenshot](/_astro/stream-chat-css-chat-ui-theme-customization-screenshot.zbYvviTT_Z8omaO.webp)

The `str-chat` class is applied to the [`ChannelList`](/chat/docs/sdk/react/components/core-components/channel_list/) and [`Channel`](/chat/docs/sdk/react/components/core-components/channel/) components, all CSS variables are declared on this level.

You can use component layer variables to change the design of individual components. The [full list of component variables](/chat/docs/sdk/react/theming/component-variables/) can be found in our component variables guide.

In the above example we set the avatar background color by setting the `--str-chat__primary-color` variable which also sets the color of other UI elements. If we want to change the background color only for the avatar component we can use the `--str-chat__avatar-background-color` variable:


    .str-chat {
      --str-chat__primary-color: #009688;
      --str-chat__active-primary-color: #004d40;
      --str-chat__surface-color: #f5f5f5;
      --str-chat__secondary-surface-color: #fafafa;
      --str-chat__primary-surface-color: #e0f2f1;
      --str-chat__primary-surface-color-low-emphasis: #edf7f7;
      --str-chat__border-radius-circle: 6px;
      --str-chat__avatar-background-color: #bf360c; // Only changes the background color of the avatar component
    }

Here is the result:

![Stream Chat Css Custom Avatar Color Screenshot](/_astro/stream-chat-css-custom-avatar-color-screenshot.D6hmQ828_1fNY7O.webp)

Component variables donât inherit. Letâs see an example of this.

Here is the message component without custom color:

![Stream Chat Css Message Color Screenshot](/_astro/stream-chat-css-message-color-screenshot.Q-KE46F1_1nEIF2.webp)

Setting custom text color inside message bubble:


    .str-chat {
      --str-chat__primary-color: #009688;
      --str-chat__active-primary-color: #004d40;
      --str-chat__surface-color: #f5f5f5;
      --str-chat__secondary-surface-color: #fafafa;
      --str-chat__primary-surface-color: #e0f2f1;
      --str-chat__primary-surface-color-low-emphasis: #edf7f7;
      --str-chat__border-radius-circle: 6px;
      --str-chat__avatar-background-color: #bf360c;
      --str-chat__message-bubble-color: #00695c; // Custom text color only for the message bubble
    }

![Stream Chat Css Message Color Customization Screenshot](/_astro/stream-chat-css-message-color-customization-screenshot.CDLnSQU9_hHDC2.webp)

We can see that setting the text color of the message bubble wonât change the color of the link attachments.

To solve this we also have to set the text color for the link attachment component:


    .str-chat {
      --str-chat__primary-color: #009688;
      --str-chat__active-primary-color: #004d40;
      --str-chat__surface-color: #f5f5f5;
      --str-chat__secondary-surface-color: #fafafa;
      --str-chat__primary-surface-color: #e0f2f1;
      --str-chat__primary-surface-color-low-emphasis: #edf7f7;
      --str-chat__border-radius-circle: 6px;
      --str-chat__avatar-background-color: #bf360c;
      --str-chat__message-bubble-color: #00695c;
      --str-chat__card-attachment-color: #00695c; // Setting text color of link attachments
    }

![Stream Chat Css Message Color Customization2 Screenshot](/_astro/stream-chat-css-message-color-customization2-screenshot.CTepey_J_3UsMC.webp)

If youâd like to add customizations that are not supported by CSS variables, you can override parts of the default CSS:


    @import "~stream-chat-react/dist/scss/v2/index.scss";


    // Provide your overrides after the stream-chat-angular stylesheet imports
    .str-chat__channel-preview-messenger--last-message {
      font-weight: 500;
    }

Just make sure that you add the customization rules after the stylesheet import.

If youâre using SCSS itâs also possible to import component stylesheets separately (instead of our bundled stylesheet):


    // Use default theme for channel list and channel preview components
    @import "~stream-chat-react/dist/scss/v2/ChannelList/ChannelList-layout.scss";
    @import "~stream-chat-react/dist/scss/v2/ChannelList/ChannelList-theme.scss";
    @import "~stream-chat-react/dist/scss/v2/ChannelPreview/ChannelPreview-layout.scss";
    @import "~stream-chat-react/dist/scss/v2/ChannelPreview/ChannelPreview-theme.scss";


    .str-chat__avatar {
      // Custom CSS for avatar component
    }

If you want to create a truly custom look and feel, it can be exhausting to override the default styling. In that case, itâs possible only to apply layout rules from the default theme.

Here is how you can import the layout stylesheet:


    @import "~stream-chat-react/dist/scss/v2/index.layout.scss";

or if youâre using CSS:


    @import "~stream-chat-react/dist/css/v2/index.layout.css";

![Stream Chat Css Chat Ui Layout Screenshot](/_astro/stream-chat-css-chat-ui-layout-screenshot.DqegYlLg_Z2n9Yyo.webp)

The result will be a minimalistic UI without

  * coloring
  * fonts
  * borders
  * shadows

Please note that if youâre only using the layout rules, you can only use the layout CSS variables.

The default theme has dark and light variants. Here is how you can switch between the different themes:


    <Chat client={client} theme="str-chat__theme-dark">
      {/* ... */}
    </Chat>

or only to a specific component (`Channel` or/and `ChannelList`):

Using the `customClasses` approach for either of the components will override default class names. Donât forget to add those to your theme class names (as defined in the snippet) for the styling to work properly.


    <Chat
      client={client}
      customClasses={{
        channelList: "str-chat__theme-dark str-chat__channel-list",
        channel: "str-chat__theme-light str-chat__channel",
      }}
    >
      {/* ... */}
    </Chat>

Here is what the dark theme looks like:

![Stream Chat Css Dark Ui Screenshot](/_astro/stream-chat-css-dark-ui-screenshot.DAB5SWXE_Z2qE2BA.webp)

The `str-chat__theme-dark`/`str-chat__theme-light` class is applied to the [ChannelList](/chat/docs/sdk/react/components/core-components/channel_list/) and [Channel](/chat/docs/sdk/react/components/core-components/channel/) components, these classes are responsible for switching between the dark and light theme color combinations.

Here is how you can provide different color configurations for the dark and light themes:


    @import "~stream-chat-react/dist/scss/v2/index.scss";


    .str-chat {
      --str-chat__border-radius-circle: 6px;
    }

    .str-chat__theme-light {
      --str-chat__primary-color: #009688;
      --str-chat__active-primary-color: #004d40;
      --str-chat__surface-color: #f5f5f5;
      --str-chat__secondary-surface-color: #fafafa;
      --str-chat__primary-surface-color: #e0f2f1;
      --str-chat__primary-surface-color-low-emphasis: #edf7f7;
      --str-chat__avatar-background-color: #bf360c;
    }

    .str-chat__theme-dark {
      --str-chat__primary-color: #26a69a;
      --str-chat__active-primary-color: #00796b;
      --str-chat__surface-color: #424242;
      --str-chat__secondary-surface-color: #212121;
      --str-chat__primary-surface-color: #00695c;
      --str-chat__primary-surface-color-low-emphasis: #004d40;
      --str-chat__avatar-background-color: #ff7043;
    }

Here is the custom dark theme:

![Stream Chat Css Custom Dark Theme Screenshot](/_astro/stream-chat-css-custom-dark-theme-screenshot.BwA3DZ26_Z2fYcGP.webp)

Itâs possible to extend the existing themes with your own themes.

Here is an example creating âroundâ and âsquareâ themes:


    @import "~stream-chat-react/dist/scss/v2/index.scss";


    // Make sure to use the proper naming convention: str-chat__theme-<your theme>
    .str-chat__theme-round {
      // You can use the predefined theme and component layer variables
      --str-chat__border-radius-circle: 999px;
    }

    .str-chat__theme-square {
      --str-chat__border-radius-circle: 6px;
    }


    <Chat client={client} theme="str-chat__theme-square">
      {/* ... */}
    </Chat>

or only to a specific component (`Channel` or/and `ChannelList`):

Using the `customClasses` approach for either of the components will override default class names. Donât forget to add those to your theme class names (as defined in the snippet) for the styling to work properly.


    <Chat
      client={client}
      customClasses={{
        channelList: "str-chat__theme-square str-chat__channel-list",
        channel: "str-chat__theme-round str-chat__channel",
      }}
    >
      {/* ... */}
    </Chat>

![Stream Chat Css Square Theme Screenshot](/_astro/stream-chat-css-square-theme-screenshot.mVU5KpZh_ZaS0Hf.webp)

The layout was built with RTL support in mind. You can use the RTL layout by providing the `dir` attribute in your HTML:


    <html dir="rtl">

    </html>

Here is the result:

![Stream Chat Css Rtl Layout Screenshot](/_astro/stream-chat-css-rtl-layout-screenshot.DTJ0fDyc_Z1cqNSG.webp)

[PreviousGetting Started](/chat/docs/sdk/react/basics/getting_started/)[NextPalette variables](/chat/docs/sdk/react/theming/palette-variables/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

A color palette is defined inside the library that used to define default values for the [global theme variables](/chat/docs/sdk/react/theming/global-variables/). If you want to work with the default theme but want to adjust the shades (for example, change `blue500` to a lighter color), you can update the palette variables. However, if you want to change the color scheme of the theme (for example, change the primary color from blue to green), you should take a look at [global theme variables](/chat/docs/sdk/react/theming/global-variables/).

You can find the [list of palette variables on GitHub](https://github.com/GetStream/stream-chat-css/blob/main/src-v2/styles/_palette-variables.scss).

[PreviousIntroduction](/chat/docs/sdk/react/theming/themingv2/)[NextComponent variables](/chat/docs/sdk/react/theming/component-variables/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

CSS variables are the easiest way to customize the theme. The variables are organized into two layers:

  * Global
  * Component

Global variables change the layout/look-and-feel of the whole chat UI, meanwhile component variables change only a part of it (for example message component).

Global variables can be grouped into the following categories:

  * **Theme** : colors, typography and border radiuses ([list of global theme variables](https://github.com/GetStream/stream-chat-css/tree/v5.2.0/src/v2/styles/_global-theme-variables.scss))

  * **Layout** : spacing (padding and margin) and sizing ([list of global layout variables](https://github.com/GetStream/stream-chat-css/tree/v5.2.0/src/v2/styles/_global-layout-variables.scss))

If you find that these variables are too high-level and you need more granular control, you also have the option to provide [component layer overrides](/chat/docs/sdk/react/theming/component-variables/).

[PreviousComponent variables](/chat/docs/sdk/react/theming/component-variables/)[NextChat](/chat/docs/sdk/react/components/core-components/chat/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

## Hooks

The `ChannelList` displays a list of `channels` via a state variable of the same name. The SDK provides a variety of hooks that are used within the component to handle events related to updates for a `channel`. The listâs state variable is then updated accordingly via the hooks.

Rather than exporting these individual hooks for customization purposes, many of these event listeners accept custom handler functions, which allows you to override the libraryâs default event response behavior.

To view the list of these custom handler functions to override (if there is one), see the `ChannelList` [documentation](/chat/docs/sdk/react/components/core-components/channel_list#event-listeners/).

A [custom hook](https://github.com/GetStream/stream-chat-react/blob/master/src/components/ChannelList/hooks/useChannelDeletedListener.ts) that handles the deletion of a channel from the list.

A [custom hook](https://github.com/GetStream/stream-chat-react/blob/master/src/components/ChannelList/hooks/useChannelHiddenListener.ts) that handles the hiding of a channel from the list.

A [custom hook](https://github.com/GetStream/stream-chat-react/blob/master/src/components/ChannelList/hooks/useChannelTruncatedListener.ts) that handles when a channelâs history is truncated.

A [custom hook](https://github.com/GetStream/stream-chat-react/blob/master/src/components/ChannelList/hooks/useChannelUpdatedListener.ts) that handles when a channel is updated.

A [custom hook](https://github.com/GetStream/stream-chat-react/blob/master/src/components/ChannelList/hooks/useChannelVisibleListener.ts) that handles when a channel is made visible and added to the list.

A [custom hook](https://github.com/GetStream/stream-chat-react/blob/master/src/components/ChannelList/hooks/useConnectionRecoveredListener.ts) that handles when connection is recovered and forces an update of the list.

A [custom hook](https://github.com/GetStream/stream-chat-react/blob/master/src/components/ChannelList/hooks/useMessageNewListener.ts) that handles when connection is recovered and forces an update of the list.

A [custom hook](https://github.com/GetStream/stream-chat-react/blob/master/src/components/ChannelList/hooks/useNotificationAddedToChannelListener.ts) that handles when a user is added to the list of channel members; moves channel to top of list and starts watching.

A [custom hook](https://github.com/GetStream/stream-chat-react/blob/master/src/components/ChannelList/hooks/useNotificationMessageNewListener.ts) that handles when a new message is added to a channel; moves channel to top of list and starts watching.

A [custom hook](https://github.com/GetStream/stream-chat-react/blob/master/src/components/ChannelList/hooks/useNotificationRemovedFromChannelListener.ts) that handles when a user is removed from the list of channel members; removes channel from list.

A [custom hook](https://github.com/GetStream/stream-chat-react/blob/master/src/components/ChannelList/hooks/usePaginatedChannels.ts) that handles pagination and the querying of the channels for the list.

A [custom hook](https://github.com/GetStream/stream-chat-react/blob/master/src/components/ChannelList/hooks/useUserPresenceChangedListener.ts) that handles when a userâs status changes (ex: online, offline, etc.).

A [custom hook](https://github.com/GetStream/stream-chat-react/blob/master/src/components/ChannelList/hooks/useMobileNavigation.ts) that handles the opening and closing of a mobile navigation via Javascript click event listeners, not Stream events.

[PreviousChannelListContext](/chat/docs/sdk/react/components/contexts/channel_list_context/)[NextChannel Preview](/chat/docs/sdk/react/components/utility-components/channel_preview_ui/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

Publicly available The `MessageInput` component hooks are the following:

Retrieve the corresponding `MessageComposer` instance.

Returns a boolean value signaling whether a message can be composed and sent. The value is automatically updated. Useful for send button enablement.

Returns an object with relevant data concerning attachments. The data carried by the object are:

  * `attachments`
  * `availableUploadSlots`
  * `blockedUploadsCount`
  * `failedUploadsCount`
  * `isUploadEnabled`
  * `pendingUploadsCount`
  * `successfulUploadsCount`
  * `uploadsInProgressCount`

Returns a boolean value signaling whether a message can be composed and created. Useful for poll creation forms.

A hook that contributes to the `MessageInputContextValue` with the following:

  * `handleSubmit`
  * `onPaste`
  * `recordingController`
  * `textareaRef`

A [custom hook](https://github.com/GetStream/stream-chat-react/blob/master/src/components/MessageInput/hooks/useCooldownTimer.tsx) where the `CooldownTimer` component is established. Handles the state logic for the timer and returns this data and the related handler.

[PreviousMessageInputContext](/chat/docs/sdk/react/components/contexts/message_input_context/)[NextInput UI](/chat/docs/sdk/react/components/message-input-components/input_ui/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

The Stream Chat React library provides a variety of useful hooks for use in your custom `Message` component.

A [custom hook](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Message/hooks/useActionHandler.ts) to handler function to handle when an action is sent in a `Channel`.

A [custom hook](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Message/hooks/useDeleteHandler.ts) to handle message deletion.


    const MyCustomMessageComponent = () => {
      const { message } = useMessageContext();
      const handleDelete = useDeleteHandler(message);

      if (message.type === "deleted") {
        return <p>Nothing to see here.</p>;
      }

      return (
        <div>
          {message.text}
          <button onClick={handleDelete}>Delete, please</button>
        </div>
      );
    };

A [custom hook](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Message/hooks/useEditHandler.ts) to handle message editing. Returns an object with an editing state boolean and handlers for setting and clearing edit mode.


    const MyCustomMessageComponent = () => {
      const { message } = useMessageContext();
      const { editing, setEdit, clearEdit } = useEditHandler();

      if (editing) {
        return (
          <div>
            Editing: {message.text}
            <button onClick={clearEdit}>Cancel</button>
          </div>
        );
      }

      return (
        <div>
          {message.text}
          <button onClick={setEdit}>Edit</button>
        </div>
      );
    };

A [custom hook](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Message/hooks/useFlagHandler.ts) to handle flagging messages. Returns an event handler that processes message flagging.


    const MyCustomMessageComponent = () => {
      const { message } = useMessageContext();
      const { addNotification } = useChannelActionContext();
      const handleFlagging = useFlagHandler(message, { notify: addNotification });

      return (
        <div>
          {message.text}
          <button onClick={handleFlagging}>Flag this message</button>
        </div>
      );
    };

A [custom hook](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Message/hooks/useMentionsHandler.ts) to give you access to message mentions and returns handlers for mentions click and hover events.


    const MyCustomMessageComponent = () => {
      const { message } = useMessageContext();
      const { onMentionsClick, onMentionsHover } = useMentionsHandler(message);

      return (
        <div onClick={onMentionsClick} onHover={onMentionsHover}>
          {message.text}
        </div>
      );
    };

A [custom hook](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Message/hooks/useMuteHandler.ts) to handle muting users. Returns an event handler that processes user muting.


    const MyCustomMessageComponent = () => {
      const { message } = useMessageContext();
      const { addNotification } = useChannelActionContext();
      const handleMute = useMuteHandler(message, { notify: addNotification });

      return (
        <div>
          {message.text}
          <button onClick={handleMute}>Mute the user that sent this!</button>
        </div>
      );
    };

A [custom hook](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Message/hooks/useOpenThreadHandler.ts) to handle the opening of a `thread` in the current `channel`. Returns an event handler to open a thread.


    const MyCustomMessageComponent = () => {
      const { message } = useMessageContext();
      const onThreadClick = useOpenThreadHandler(message);

      return (
        <div>
          {message.text}
          <button onClick={onThreadClick}>Reply</button>
        </div>
      );
    };

A [custom hook](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Message/hooks/usePinHandler.ts) to handle message pinning. It provides the permission status of the connected user and a function to toggle pinned status of of a `message`.


    const MyCustomMessageComponent = () => {
      const { message, pinPermissions } = useMessageContext();
      const { addNotification } = useChannelActionContext();

      const { canPin, handlePin } = usePinHandler(message, pinPermissions, {
        notify: addNotification
      });

      const handleClick = () => {
        if (canPin) handlePin(message);
      }

      return (
        <div className={message.pinned ? 'pinned' : ''} onClick={handleClick}>
          <p>{message.text}</p>
        </div>
      );
    };
    />

A [custom hook](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Message/hooks/useReactionHandler.ts) to handle message reactions.


    const MyCustomMessageComponent = () => {
      const { message } = useMessageContext();
      const onReactionClick = useReactionHandler(message);

      return (
        <div>
          {message.text}
          <button onClick={(e) => onReactionClick("nice", e)}>Nice!</button>
          <button onClick={(e) => onReactionClick("not-nice", e)}>
            I don't like it!
          </button>
        </div>
      );
    };

A [custom hook](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Message/hooks/useReactionsFetcher.ts) to handle loading message reactions. Returns an async function that loads and returns message reactions.


    import { useQuery } from "react-query";

    const MyCustomReactionsList = () => {
      const { message } = useMessageContext();
      const { addNotification } = useChannelActionContext();
      const handleFetchReactions = useReactionsFetcher(message, {
        notify: addNotification,
      });
      // This example relies on react-query - but you can use you preferred method
      // of fetching data instead
      const { data } = useQuery(
        ["message", message.id, "reactions"],
        handleFetchReactions,
      );

      if (!data) {
        return null;
      }

      return (
        <>
          {data.map((reaction) => (
            <span key={reaction.type}>reaction.type</span>
          ))}
        </>
      );
    };

This function limits the number of loaded reactions to 1200. To customize this behavior, provide [your own loader function](/chat/docs/sdk/react/components/message-components/reactions#handlefetchreactions/) instead.

A [custom hook](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Message/hooks/useRetryHandler.ts) to handle the retry of sending a message.


    const MyCustomMessageComponent = () => {
      const { message } = useMessageContext();
      const retrySend = useRetryHandler();

      if (message.status === "failed") {
        const onRetry = () => retrySend(message);

        return (
          <div>
            Failed to send: {message.text}
            <button onClick={onRetry}>Retry</button>
          </div>
        );
      }

      return <div>{message.text}</div>;
    };

A [custom hook](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Message/hooks/useUserHandler.ts) that exposes the info for a messageâs user. Returns event handlers for click and hover events for the user.


    const MyCustomMessageComponent = () => {
      const { message } = useMessageContext();
      const { onUserClick, onUserHover } = useUserHandler(message, {
        onUserClickHandler: (e, user) => console.log(`Message from ${user}`),
        onUserHoverHandler: (e, user) => console.log(`Message from ${user}`),
      });

      return (
        <div onClick={onUserClick} onHover={onUserHover}>
          {message.text}
        </div>
      );
    };

A [custom hook](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Message/hooks/useUserRole.ts) that exposes the info for a userâs role for a certain message. Returns an object with the userâs role information.


    const MyCustomMessageComponent = () => {
      const { message } = useMessageContext();
      const {
        canDelete,
        canEdit,
        canFlag,
        canMute,
        canQuote,
        canReact,
        canReply,
        isAdmin,
        isModerator,
        isMyMessage,
        isOwner,
      } = useUserRole(message);

      if (isMyMessage || isAdmin) {
        ...
      }
    };

[PreviousMessageBounceContext](/chat/docs/sdk/react/components/contexts/message_bounce_context/)[NextMessage UI](/chat/docs/sdk/react/components/message-components/message_ui/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

## Other

Hereâs a list of external and internal resource links that could be helpful during development while using the Stream Chat React SDK library.

* Be sure to check out the source code for each demo application in the above link.

> ### React Documentation

  * [React - Getting Started](https://reactjs.org/docs/getting-started.html)

  * [React - Context](https://reactjs.org/docs/context.html)

> ### Internal Articles

  * [Stream Chat Glossary](https://getstream.zendesk.com/hc/en-us/articles/1500007212082-Stream-Chat-Glossary)

  * [Stream Chat Success Checklist](https://getstream.zendesk.com/hc/en-us/articles/1500007673721-Stream-Chat-Success-Checklist)

  * [React - Customizing Message Actions](https://getstream.zendesk.com/hc/en-us/articles/1500008025241--Customizing-Message-Actions-in-React-Chat)

  * [Stream Webhooks](https://getstream.zendesk.com/hc/en-us/articles/1500006478421-How-can-I-use-the-Stream-Webhook-to-send-customers-emails-based-on-Chat-events-)

  * [Stream Rate limits](https://getstream.zendesk.com/hc/en-us/articles/360056792833-Rate-limits-and-HTTP-429-Errors)

  * [Stream API â Client â Server](https://getstream.zendesk.com/hc/en-us/articles/360061669873-How-do-the-Chat-Client-Server-Stream-API-communicate-with-each-other-)

  * [Stream Chat Moderation](https://getstream.zendesk.com/hc/en-us/articles/360041455753)

  * [Stream User Roles and Permissions](https://getstream.zendesk.com/hc/en-us/articles/360053064274-User-Roles-and-Permission-Policies-Chat)

  * [Stream queryChannels filters](https://getstream.zendesk.com/hc/en-us/articles/360057461213-Filters-for-queryChannels-Chat)

  * [Stream Unread Messages](https://getstream.zendesk.com/hc/en-us/articles/360042753154-How-do-I-retrieve-unread-messages-Chat)

[PreviousTroubleshooting](/chat/docs/sdk/react/v12/troubleshooting/)[NextOverview](/chat/docs/sdk/react/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

> ### React Documentation

  * [React - Getting Started](https://reactjs.org/docs/getting-started.html)

  * [React - Context](https://reactjs.org/docs/context.html)

> ### Internal Articles

  * [Stream Chat Glossary](https://getstream.zendesk.com/hc/en-us/articles/1500007212082-Stream-Chat-Glossary)

  * [Stream Chat Success Checklist](https://getstream.zendesk.com/hc/en-us/articles/1500007673721-Stream-Chat-Success-Checklist)

  * [React - Customizing Message Actions](https://getstream.zendesk.com/hc/en-us/articles/1500008025241--Customizing-Message-Actions-in-React-Chat)

  * [Stream Webhooks](https://getstream.zendesk.com/hc/en-us/articles/1500006478421-How-can-I-use-the-Stream-Webhook-to-send-customers-emails-based-on-Chat-events-)

  * [Stream Rate limits](https://getstream.zendesk.com/hc/en-us/articles/360056792833-Rate-limits-and-HTTP-429-Errors)

  * [Stream API â Client â Server](https://getstream.zendesk.com/hc/en-us/articles/360061669873-How-do-the-Chat-Client-Server-Stream-API-communicate-with-each-other-)

  * [Stream Chat Moderation](https://getstream.zendesk.com/hc/en-us/articles/360041455753)

  * [Stream User Roles and Permissions](https://getstream.zendesk.com/hc/en-us/articles/360053064274-User-Roles-and-Permission-Policies-Chat)

  * [Stream queryChannels filters](https://getstream.zendesk.com/hc/en-us/articles/360057461213-Filters-for-queryChannels-Chat)

  * [Stream Unread Messages](https://getstream.zendesk.com/hc/en-us/articles/360042753154-How-do-I-retrieve-unread-messages-Chat)

[PreviousTroubleshooting](/chat/docs/sdk/react/troubleshooting/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

The React SDK has a default search functionality handled by [`ChannelSearch` component](/chat/docs/sdk/react/components/utility-components/channel_search/). The `ChannelSearch` component, however, has some limitations:

  * It is not customizable in terms of what is searched respectively what API endpoints are hit to retrieve the search results. The search logic is contained in a hook that is not customizable otherwise than with prop-drilled callbacks
  * The search UI components cannot be customized otherwise than overriding the whole ChannelSearch component

The experimental Search component aims to address these limitations by the following means:

  * Allows for limitless customization by relying on `SearchController` class that manages the search logic
  * The search UI components can be customized via `ComponentContext` created with the `WithComponents` component

![image](/_astro/experimental-search-ui.BJB5NQQH_Zcr1Wt.webp)

To replace the rendering of `ChannelSearch` by `Search` component, we need to import it from the experimental package and create a component context around the `ChannelList` that will render the `Search`:


    import { StreamChat } from "stream-chat";
    import { Chat, ChannelList, WithComponents } from "stream-chat-react";
    import { Search } from "stream-chat-react/experimental";

    const Component = () => (
      <Chat client={client}>
        <WithComponents overrides={{ Search }}>
          <ChannelList
            // Enable search in ChannelList
            showChannelSearch={true}
            // Optional: Additional search props
            additionalChannelSearchProps={{
              // Clear search on click outside
              clearSearchOnClickOutside: true,
              // Custom placeholder
              placeholder: "Search channels, messages and users...",
              // Custom debounce time for search
              debounceMs: 500,
            }}
          />
        </WithComponents>
      </Chat>
    );

The search state is managed by `SearchController` class and reactive. It is exported by the `stream-chat` library. The class relies on so-called search sources to retrieve the data and take care of the pagination. There are three search sources available in `stream-chat` library:

  * `ChannelSearchSource` \- queries channels by `name` partially matching the search query
  * `UserSearchSource` \- queries users by `name` or `id` partially matching the search query
  * `MessageSearchSource` \- queries messages and corresponding channels by message `text` partially matching the search query

We can customize the retrieval parameters of the existing search sources as well as add new search sources that would retrieve custom data entities (other than channels, users or messages).

In the example below we demonstrate how to add a new custom search source. The pattern is however applicable to overriding the default search sources. Specifically, each new search source class has to implement abstract methods `query` and `filterQueryResults`. Also, the class should declare `type` attribute so that the `SearchController` can keep the source mapping.


    import { useMemo } from "react";
    import {
      BaseSearchSource,
      ChannelSearchSource,
      MessageSearchSource,
      SearchController,
      SearchSourceOptions,
      UserSearchSource,
    } from "stream-chat";
    import { Chat, useCreateChatClient, WithComponents } from "stream-chat-react";
    import {
      DefaultSearchResultItems,
      Search,
      SearchSourceResultList,
    } from "stream-chat-react/experimental";

    // declare the type of item that is stored in the array by the search source
    type X = { x: string };

    // declare the custom search source
    class XSearchSource extends BaseSearchSource<X> {
      // search source type is necessary
      readonly type = "X";

      constructor(options?: SearchSourceOptions) {
        super(options);
      }

      // the query method will always receive the searched string
      protected async query(searchQuery: string) {
        return searchQuery.length > 1
          ? { items: [{ x: "hi" }] }
          : { items: [{ x: "no" }] };
      }

      // we can optionally manipulate the retrieved page of items
      protected filterQueryResults(items: X[]): X[] {
        return items;
      }
    }

    // we need a custom component to display the search source items
    const XSearchResultItem = ({ item }: { item: X }) => <div>{item.x}</div>;

    // and we tell the component that renders the resulting list, what components it can use to display the items
    const customSearchResultItems = {
      ...DefaultSearchResultItems,
      X: XSearchResultItem,
    };

    const CustomSearchResultList = () => (
      <SearchSourceResultList SearchResultItems={customSearchResultItems} />
    );

    const App = () => {
      const chatClient = useCreateChatClient({
        apiKey,
        tokenOrProvider: userToken,
        userData: { id: userId },
      });

      // create a memoized instance of SearchController
      const searchController = useMemo(
        () =>
          chatClient
            ? new SearchController({
                sources: [
                  new XSearchSource(),
                  new ChannelSearchSource(chatClient),
                  new UserSearchSource(chatClient),
                  new MessageSearchSource(chatClient),
                ],
              })
            : undefined,
        [chatClient],
      );

      if (!chatClient) return <>Loading...</>;

      return (
        <Chat client={chatClient} searchController={searchController}>
          <WithComponents
            overrides={{
              Search,
              SearchSourceResultList: CustomSearchResultList,
            }}
          >
            {/*  ....*/}
          </WithComponents>
        </Chat>
      );
    };

The search source query parameters like `filters`, `sort` or `searchOptions` are overridable by a simple assignment:


    const { searchController } = useChatContext();

    const usersSearchSource = searchController.getSource("users");
    usersSearchSource.filters = {
      ...usersSearchSource.filters,
      myCustomField: "some-value",
    };

The default search UI components can be overridden through the component context, using the default component names. There are branch components that render other components and leaf components that render the markup.

The top-level component for rendering `SearchBar` and `SearchResults`

A leaf component that handles the message input value

The top-level component for displaying search results for one or more search sources.

The default component rendered by `SearchResults` when input value is an empty string - the pre-search state.

Rendered by `SearchResults`.The default component renders tags that determine what search source results will be displayed.

Rendered by `SearchResults`. The component renders the UI components for specific search source listing:

  * `SearchSourceResultsHeader` \- the default component does not render any markup. Can be used to add information about the source which items are being rendered in the listing below.
  * `SearchSourceResultsEmpty` \- rendered instead of `SearchSourceResultList`
  * `SearchSourceResultList` \- renders items for a given search source

This is a child component of `SearchSourceResults` component. Renders a list of items in an `InfiniteScrollPaginator` component. Allows to specify React components for rendering search source items of a given type.

  * `SearchSourceResultListFooter` \- component rendered at the bottom of `SearchSourceResultList`. The default component informs user that more items are being loaded (`SearchSourceResultsLoadingIndicator`) or that there are no more items to be loaded.
  * `SearchSourceResultsLoadingIndicator` \- rendered by `SearchSourceResultListFooter`

The main container component - `Search` \- provides search context to child components.

The type of channel to create on user result select, defaults to `messaging`. This is just a forwarded value of `Search` componentâs `directMessagingChannelType` prop.

Type| Default
---|---
string| âmessagingâ

Sets the input element into disabled state. This is just a forwarded value of `Search` componentâs `disabled` prop.

Type
---
boolean

Clear search state / search results on every click outside the search input. By default, the search UI is not removed on input blur. This is just a forwarded value of `Search` componentâs `exitSearchOnInputBlur` prop.

Type
---
boolean

Custom placeholder text to be displayed in the search input. This is just a forwarded value of `Search` componentâs `placeholder` prop.

Type
---
string

Instance of the SearchController class that handles the data management. This is just a forwarded value of `Chat` componentâs `searchController` prop. The child components can access the `searchController` state in a reactive manner.


    import {
      SearchSourceResults,
      SearchResultsHeader,
      SearchResultsPresearch,
      useSearchContext,
      useStateStore,
    } from "stream-chat-react";
    import type { SearchControllerState } from "stream-chat";

    const searchControllerStateSelector = (nextValue: SearchControllerState) => ({
      activeSources: nextValue.sources.filter((s) => s.isActive),
      isActive: nextValue.isActive,
      searchQuery: nextValue.searchQuery,
    });

    export const SearchResults = () => {
      const { searchController } = useSearchContext();
      const { activeSources, isActive, searchQuery } = useStateStore(
        searchController.state,
        searchControllerStateSelector,
      );

      return isActive ? (
        <div>
          <SearchResultsHeader />
          {!searchQuery ? (
            <SearchResultsPresearch activeSources={activeSources} />
          ) : (
            activeSources.map((source) => (
              <SearchSourceResults key={source.type} searchSource={source} />
            ))
          )}
        </div>
      ) : null;
    };

The context is rendered by `SearchSourceResults` component. It provides the instance of search source class corresponding to the specified type. The child components can access the instanceâs reactive state to render the data:


    import {
      useSearchSourceResultsContext,
      useStateStore,
    } from "stream-chat-react";
    import type { SearchSourceState } from "stream-chat";

    const searchSourceStateSelector = (value: SearchSourceState) => ({
      hasMore: value.hasMore,
      isLoading: value.isLoading,
    });

    const Component = () => {
      const { searchSource } = useSearchSourceResultsContext();
      const { hasMore, isLoading } = useStateStore(
        searchSource.state,
        searchSourceStateSelector,
      );

      return (
        <div>
          {isLoading ? (
            <div>Is loading</div>
          ) : !hasMore ? (
            <div>All results loaded</div>
          ) : null}
        </div>
      );
    };

[PreviousMessage Actions](/chat/docs/sdk/react/experimental/message-actions/)[NextUpgrade to v13](/chat/docs/sdk/react/release-guides/upgrade-to-v13/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

For information regarding some common troubleshooting and support issues, please see below.

The Stream Chat React SDK uses a variety of [Context Providers](/chat/docs/sdk/react/components/contexts/chat_context/) that share values and data to all their children. This is instead of prop drilling through many levels of components. If youâre creating a custom component, utilizing our contexts via our custom hooks makes this process very straightforward.

A common issue is when one of the exposed hooks from a context provider is being utilized, but not within the related Context. Each value you pull will be undefined. A good resource for knowing which of our components are Context Providers is within [Core Components](/chat/docs/sdk/react/components/core-components/chat/).

If you are seeing access to functionality for user that seems incorrect, or conversely, functionality that could be missing for a user, then this might be related to a user role or permissions.

Channels are organized into groups with a set channel type (ex: livestream, messaging, team, gaming or commerce), and these are set when creating a channel. Each channel type comes with a default permission policy pre-configured. These can then be modified as needed to fit different use cases. A policy is structured by a user role being allowed or denied access to a resource (ex: user with admin role is allowed to create a channel and ban a user).

Documentation on [User Permissions](/chat/docs/react/chat_permission_policies/). Documentation on [Channel Permissions](/chat/docs/react/chat_permission_policies/). Documentation on [User Roles](/chat/docs/react/chat_permission_policies/)

You can change/create permission policies applied to a channel type at any time through the Dashboard. You can also change a user role to admin or moderator using the API, however this must be done server side.

The method channel.watch() is intended for client-side use, and creates a channel if it does not already exist. If the channel already exists, it will return a more detailed version of the channel instance (including messages, watchers, and âreadâ). In addition, using this method will âwatchâ the channel, that is, the currently connected user will be subscribed to event updates (new message, new member, etcâ¦).

This is different than the methods channel.create() (creates a channel but does not subscribe to events) and channel.query() (returns certain parameters of the channel but does not subscribe to events).

A watcher is a user who is subscribed to updates on a channel (new messages, etc). This actually doesnât imply membership, for example a non-member can watch a Livestream channel-type.

A member is a user role associated with a specific channel, typically granted more permissions than a non-member user. For example, default permissions on our âmessagingâ type channel allow a user to read and write to the channel, as well as receive push notifications.

[PreviousUpgrade to v10 (theming V2)](/chat/docs/sdk/react/release-guides/upgrade-to-v10/)[NextResources](/chat/docs/sdk/react/resources/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

Building on top of the Stream Chat API, the Stream Chat React component library includes everything you need to build feature-rich and high-functioning chat user experiences out of the box. The library includes an extensive set of performant and customizable React components which allow you to get started quickly with little to no plumbing required. Use cases include team and social messaging, virtual events, livestream gaming, and customer support. The library supports:

  * Rich media messages
  * Reactions
  * Threads and quoted replies
  * Text input commands (ex: Giphy and @mentions)
  * Image and file uploads
  * Video playback
  * Audio recording
  * Read state and typing indicators
  * Channel and message lists

If you are new to our SDK it is best to go through our [tutorial](https://getstream.io/chat/react-chat/tutorial/).

After that, our [getting started page](/chat/docs/sdk/react/v12/basics/getting_started/) is a great next step.

If you are integrating our SDK, please pay attention to our [Theming](/chat/docs/sdk/react/v12/theming/themingv2/) and [Customizing Components](/chat/docs/sdk/react/v12/guides/customization/) sections in our guides. We see that most of our users can get very far by utilizing the flexibility of our SDKs.

A common pattern in the library is the use of context provider hooks. These custom hooks allow for effective value sharing between parent components and their children. This makes customization straightforward, as you can use our exported hooks in your custom components to receive the exact values needed, while also subscribing to context changes.

The left navigation will guide you to the various documentation sections for information on everything regarding our robust component library. Check out the instructions for adding the library to your React project.

[PreviousResources](/chat/docs/sdk/react/v11/resources/)[NextInstallation](/chat/docs/sdk/react/v12/basics/installation/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

Building on top of the Stream Chat API, the Stream Chat React component library includes everything you need to build feature-rich and high-functioning chat user experiences out of the box. The library includes an extensive set of performant and customizable React components which allow you to get started quickly with little to no plumbing required. Use cases include team and social messaging, virtual events, livestream gaming, and customer support. The library supports:

  * Rich media messages
  * Reactions
  * Threads and quoted replies
  * Text input commands (ex: Giphy and @mentions)
  * Image and file uploads
  * Video playback
  * Read state and typing indicators
  * Channel and message lists

If you are new to our SDK it is best to go through a of our [tutorial](https://getstream.io/chat/react-chat/tutorial/).

After that, our [getting started page](/chat/docs/sdk/react/v11/basics/getting_started/) is a great next step.

If you are integrating our SDK, please pay attention to our [Theming](/chat/docs/sdk/react/v11/theming/themingv2/) and [Customizing Components](/chat/docs/sdk/react/v11/guides/customization/) sections in our guides. We see that most of our users can get very far by utilizing the flexibility of our SDKs.

A common pattern in the library is the use of context provider hooks. These custom hooks allow for effective value sharing between parent components and their children. This makes customization straightforward, as you can use our exported hooks in your custom components to receive the exact values needed, while also subscribing to context changes.

The left navigation will guide you to the various documentation sections for information on everything regarding our robust component library. Check out the instructions below for adding the library to your React project.

[NextInstallation](/chat/docs/sdk/react/v11/basics/installation/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

Display of message actions is taken care of by the `MessageOptions` component and its child components `MessageActions` and `MessageActionsBox`. The message actions are represented by buttons displayed in a dropdown and are related to a specific message or its author.

![MessageOptions structure](/_astro/message-options-structure.9qU-wMJ1_J7vFT.webp)

The previously mentioned components, however, make it complicated for the integrators to customize the action buttons (text, translation etc.). A solution to patch these shortcomings was to introduce `CustomMessageActionsList` component to override the default `MessageActions` over component context. This allows to render custom buttons within actions dropdown but does not allow to control the conditions, when and how the message options buttons (button to open the actions dropdown, `reply` or `react` button) would be displayed.

To solve the mentioned shortcomings we introduce experimental `MessageActions` component that allows:

  1. to define the components (and thus the contents of the buttons) that will be rendered in the actions dropdown
  2. to specify the placement of the action button either in the dropdown or among the quick actions
  3. to define filtering logic for what actions will be displayed in the dropdown or among the quick actions

The experimental nature of the feature makes it subject to change. It is possible that with the next major version, the `MessageOptions` component will not be used as a parent to render `MessageActions` leading to changes in the resulting markup. This is due to the fact that experimental `MessageActions` component distinguishes between the `dropdown` and `quick` actions placement.

1. define the set of actions with buttons as components with own logic and click handlers, marked with `quick` and `dropdown` placement
  2. decide on merging the custom actions with the default actions provided by the SDK
  3. define the filter which takes into consideration the user permissions or go with the default filtering logic

The customization example follows:


    import { useMemo } from "react";
    import { Channel } from "stream-chat-react";
    import {
      MessageActions,
      defaultMessageActionSet,
      DefaultDropdownActionButton,
    } from "stream-chat-react/experimental";

    import { useCustomMessageActionRules } from "./useCustomMessageActionRules";

    const CustomMessageActions = () => {
      const customRules = useCustomMessageActionRules(); // your implementation

      const customMessageActionSet = useMemo(() => {
        return [
          // reuse the default set if you need
          ...defaultMessageActionSet,
          {
            type: "myCustomTypeDropdown",
            placement: "dropdown",
            // we recommend defining components outside the scope of
            // the CustomMessageActions component to keep them stable
            Component: () => (
              <DefaultDropdownActionButton>ð Custom</DefaultDropdownActionButton>
            ),
          },
          {
            type: "myCustomTypeQuick",
            placement: "quick",
            Component: () => <button>a</button>,
          },
        ].filter(
          // apply custom filter with access to values of contexts and other hooks
          (action) => {
            return !customRules.disallow.includes(action.type);
          },
        );
      }, [customRules]);

      return (
        <MessageActions
          // though not recommended, it's possible to completely disable the default filter
          disableBaseMessageActionSetFilter
          messageActionSet={customMessageActionSet}
        />
      );
    };

    <Channel MessageActions={CustomMessageActions}>...</Channel>;

![image](/_astro/custom-message-actions-experimental.mDsiETdV_1AE4Ut.webp)

[PreviousBlocking Users](/chat/docs/sdk/react/guides/blocking-users/)[NextSearch](/chat/docs/sdk/react/experimental/search/)

Â© Getstream.io, Inc. All Rights Reserved.

[Contact](/contact/support/)

