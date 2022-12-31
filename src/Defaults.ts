export function applyDefaults<T>(obj: T, defaults: T) {
    Object.keys(defaults).forEach((key) => {
        if (obj[key] === undefined)
            Object.defineProperty(obj, key, { value: defaults[key] })
    });
}