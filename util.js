module.exports = {
    timestamp: {
        create: () => new Date().toLocaleString(undefined, {
            dateStyle: "medium",
            timeStyle: "long"
        }),
        error(message) {
            this.log(message, console.error);
        },
        log(message, loggerFunc = console.log) {
            loggerFunc(`[${this.create()}] ${message}`);
        },
        warn(message) {
            this.log(message, console.warn);
        }
    }
};
