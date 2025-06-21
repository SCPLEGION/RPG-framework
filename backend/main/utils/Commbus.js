// commBus.js
export class CommunicationBus {
    constructor() {
        this.listeners = {};
        this.history = {}; // Store event history
    }

    /**
     * Subscribe to an event.
     * @param {string} eventName 
     * @param {Function} callback 
     * @param {boolean} [replay=false] - If true, immediately call with last emitted data if available.
     */
    on(eventName, callback, replay = false) {
        if (!this.listeners[eventName]) {
            this.listeners[eventName] = new Set();
        }
        this.listeners[eventName].add(callback);

        // If replay is requested and history exists, call immediately
        if (replay && this.history.hasOwnProperty(eventName)) {
            callback(this.history[eventName]);
        }
    }

    /**
     * Unsubscribe from an event.
     * @param {string} eventName 
     * @param {Function} callback 
     */
    off(eventName, callback) {
        if (this.listeners[eventName]) {
            this.listeners[eventName].delete(callback);
        }
    }

    /**
     * Publish an event with data.
     * @param {string} eventName 
     * @param {any} data 
     */
    emit(eventName, data) {
        // Save to history
        this.history[eventName] = data;

        if (this.listeners[eventName]) {
            for (const callback of this.listeners[eventName]) {
                callback(data);
            }
        }
    }
    /**
     * Emit a request and wait for a response.
     * @param {string} eventName - Event name to emit.
     * @param {any} data - Data to send.
     * @param {number} [timeout=10000] - Timeout in ms.
     * @returns {Promise<any>} Resolves with response data or rejects on error/timeout.
     */
    request(eventName, data, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const id = crypto.randomUUID?.() || Math.random().toString(36).substring(2);
            const responseEvent = `${eventName}:response:${id}`;
            const errorEvent = `${eventName}:error:${id}`;

            const cleanup = () => {
                this.off(responseEvent, onResponse);
                this.off(errorEvent, onError);
            };

            const onResponse = (resData) => {
                cleanup();
                resolve(resData);
            };

            const onError = (errData) => {
                cleanup();
                reject(errData);
            };

            this.on(responseEvent, onResponse);
            this.on(errorEvent, onError);

            // Timeout logic
            const timer = setTimeout(() => {
                cleanup();
                reject(new Error(`Request timed out for event ${eventName}`));
            }, timeout);

            // Emit the request
            this.emit(eventName, {
                ...data,
                id
            })
        });
    }

}

export const bus = new CommunicationBus();
