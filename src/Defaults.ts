export function applyDefaults<T>(obj: T, defaults: T) {
    for (const key in obj) {
        if (obj[key] === undefined)
            obj[key] = defaults[key]
    }
}