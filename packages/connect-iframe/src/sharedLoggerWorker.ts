/// <reference lib="webworker" />

const ports = [];
const messages = [];

// Debug it:
// chrome://inspect/#workers

// TODOs:
// - Make loader work with TS syntax, for some reason it does not now.
// - Create type logEvent

// interface MessageEvent<T = any> {
//     data: T;
// }

// Function to handle incoming messages from the main thread
function handleMessage(event, port) {
    const { type, data } = event;
    switch (type) {
        case 'add-log':
            messages.push(data);
            break;
        case 'get-logs':
            port.postMessage(messages);
            break;
        default:
    }
}

// Handle connection from the main thread
self.addEventListener('connect', event => {
    const port = event.ports[0];

    ports.push(port);

    port.addEventListener('message', event => {
        handleMessage(event.data, port);
    });

    port.start();
});
