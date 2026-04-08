function useDebug() {
    return process.env.DEBUG && process.env.DEBUG === 'true'
}

export function log(log) {
    console.log(log)
}

export function logInfo(log) {
    if(useDebug()) {
        console.log(log)
    }
}

export function logError(action, payload) {
    if(useDebug()) {
        console.error(action, payload)
    }
}