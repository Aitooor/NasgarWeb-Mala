// @ts-ignore
if (!window.custom_cached)
    // @ts-ignore
    window.custom_cached = {};
// @ts-ignore
const custom_cached = window.custom_cached;
export function setCache(name, obj) {
    return custom_cached[name] = obj;
}
export function getCache(name, _default) {
    if (custom_cached[name])
        return custom_cached[name];
    return custom_cached[name] = _default;
}
//# sourceMappingURL=cache.js.map