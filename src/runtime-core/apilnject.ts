import { getCurrentInstance } from "./component";

export function provide (key, val) {
    /* save data */
    const CurrentInstance: any = getCurrentInstance();
    if (CurrentInstance) {
        let { provides } = CurrentInstance;
        const parentProvides = CurrentInstance.parent.provides;
        if (provides === parentProvides) {
            provides = CurrentInstance.provides = Object.create(parentProvides);
        }
        provides[key] = val;
    }
}

export function inject (key, defaultVal) {
    /* access data */
    const CurrentInstance: any = getCurrentInstance();
    if (CurrentInstance) {
        const parentProvides = CurrentInstance.parent.provides;
        if (typeof defaultVal === "function") return defaultVal();
        return (key in parentProvides) ? parentProvides[key] : defaultVal;
    }
}