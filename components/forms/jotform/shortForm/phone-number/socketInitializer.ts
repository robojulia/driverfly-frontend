const io = require("socket.io-client");
import { Socket } from "socket.io-client";

export const socket: Socket = io(`${process.env.NEXT_PUBLIC_BASE_URL}`, {
    transports: ["websocket"],
    reconnectionAttempts: 5, // Limit reconnections
    reconnectionDelay: 2000, // Wait 2 seconds before retrying
    timeout: 5000, // Connection timeout of 5 seconds
    autoConnect: false // We'll manually connect after setting up listeners
    // rejectUnauthorized: false,
    // path: "/socket.io",
    // protocols: ["ws:// ", "wss://"],
});

/**
 * The `socketInitializer` function initializes a socket connection and sets up listeners for various
 * events such as connect, disconnect, and connect_error.
 * @param {ApplicantEntity} applicant - The `applicant` parameter is an instance of the
 * `ApplicantEntity` class. It represents an applicant and contains information about the applicant,
 * such as their ID, name, contact details, etc.
 * @param {string} otp_expiry - The `otp_expiry` parameter is a string that represents the expiry time
 * of an OTP (One-Time Password). It is used in the socket event name to uniquely identify the event
 * related to the OTP status for a specific applicant and OTP expiry time.
 * @param [handleOutboundMessageStatus] - handleOutboundMessageStatus is a callback function that will
 * be called when the "outbound-otp-status-for-applicant-${applicant?.id}-" event is
 * triggered on the socket. It takes an optional parameter "e" which represents any error that occurred
 * during the event handling.
 */
export const socketInitializer = async (
    applicantId: string | number,
    handleOutboundMessageStatus?: (e?: any) => void
): Promise<void> => {
    const MAX_TRIES = 1;
    let tries = 0;
    if (tries > MAX_TRIES) {
        return;
    }

    // Add a connect listener
    /* This code is setting up a listener for the 'connection' event on the socket object. When a client
                connects to the server, this event will be triggered and the function passed as the second argument
                will be executed. In this case, it simply logs a message to the console indicating that a client has
                connected. */
    socket.on("connect", () => {
        console.log("✅ Socket :: Client connect.", socket?.id);
    });

    // Disconnect listener
    /* This code sets up a listener for the 'disconnect' event on the socket object. When a client
                disconnects from the server, this event will be triggered and the function passed as the second
                argument will be executed. In this case, it simply logs a message to the console indicating that a
                client has disconnected. */
    socket.on("disconnect", () => {
        console.warn("Socket :: Client disconnected.");
        socket.close();
    });

    // Error listener
    /* This code sets up a listener for the "connect_error" event on the socket object. When there is an
                error connecting to the server, this event will be triggered and the function passed as the second
                argument will be executed. In this case, it simply logs a message to the console indicating that
                there was a connection error and the reason for the error. */
    socket.on("connect_error", (err) => {
        console.error(`❌ Socket :: connect_error due to ${err.message}`, err.stack);
        socket.close();

        if (tries >= MAX_TRIES) {
            console.warn("🛑 Max connection retries reached, stopping reconnection.");
            return;
        }

        tries++;
        setTimeout(() => {
            tries++;
            socket.connect();
        }, 2000);
    });


    /*  listening for a socket event called `outbound-otp-status-for-applicant-${applicant?.id}-${otp_expiry}`.
            When this event is triggered, it receives a `sms status`. */
    socket.on(
        `outbound-otp-status-for-applicant-${applicantId}`,
        handleOutboundMessageStatus
    );
}; /* Initializing a socket connection to the server. */
