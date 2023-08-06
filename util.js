module.exports = {
    bitwise: {
        orArray: arr => arr.reduce((a, b) => a | b)
    },
    perms: {
        has: (member, perm) => member.permissions.has(perm),
        hasAll: (member, permsArr) => permsArr.every(perm => member.permissions.has(perm))
    },
    random: {
        choice: arr => arr[Math.floor(Math.random() * arr.length)],
        int: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
    },
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
