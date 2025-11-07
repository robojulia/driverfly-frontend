const io = require("socket.io-client");
import { Socket } from "socket.io-client";
import { ConversationMessageEntity } from "../../models/conversation/conversation-message.entity";
import { UserEntity } from "../../models/user/user.entity";

export const socket: Socket = io(`${process.env.BASE_URL}`, {
    transports: ["websocket"],
    // rejectUnauthorized: false,
    // path: "/socket.io",
    // protocols: ["ws:// ", "wss://"],
});

/**
 * function that initializes a socket connection to the server, and when the server sends a
 * message to the client, it finds the conversation that the message belongs to and opens it
 */
export const messengerSocketInitializer = async (
    user: UserEntity,
    handleInboundMessage?: (message: ConversationMessageEntity) => void,
    handleOutboundMessageStatus?: (message: ConversationMessageEntity) => void
): Promise<void> => {
    // Add a connect listener
    /* This code is setting up a listener for the 'connection' event on the socket object. When a client
                connects to the server, this event will be triggered and the function passed as the second argument
                will be executed. In this case, it simply logs a message to the console indicating that a client has
                connected. */
    socket.on("connect", () => {
        console.log("Socket :: Client connect.", socket?.id);
    });

    // Disconnect listener
    /* This code sets up a listener for the 'disconnect' event on the socket object. When a client
                disconnects from the server, this event will be triggered and the function passed as the second
                argument will be executed. In this case, it simply logs a message to the console indicating that a
                client has disconnected. */
    socket.on("disconnect", () => {
        console.log("Socket :: Client disconnected.");
    });

    // Error listener
    /* This code sets up a listener for the "connect_error" event on the socket object. When there is an
                error connecting to the server, this event will be triggered and the function passed as the second
                argument will be executed. In this case, it simply logs a message to the console indicating that
                there was a connection error and the reason for the error. */
    socket.on("connect_error", (err) => {
        console.error(`Socket :: connect_error due to ${err.message}`, err.stack);
        setTimeout(() => {
            socket.connect();
        }, 1000);
    });

    /* Listening for a message from the server, and when it receives a message, it finds the conversation
                that the message belongs to and opens it. */
    socket.on(`reply-to-user-${user?.id}`, handleInboundMessage);

    /*  listening for a socket event called `outbound-sms-status-for-user-${user?.id}`.
            When this event is triggered, it receives a `message` object of type `ConversationMessageEntity`. */
    socket.on(
        `outbound-sms-status-for-user-${user?.id}`,
        handleOutboundMessageStatus
    );
}; /* Initializing a socket connection to the server. */
