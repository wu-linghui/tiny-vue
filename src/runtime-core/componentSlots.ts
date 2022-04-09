export function initSlots (instance, rawSlots) {
    normalizeObjectSlots(instance.slots, rawSlots);
}

function normalizeObjectSlots (componentSlots: any, rawSlots: any) {
    for (const key in rawSlots) {
        if (Object.prototype.hasOwnProperty.call(rawSlots, key)) {
            const slot = rawSlots[key];
            componentSlots[key] = (props) => normalizeSlotValue(slot(props));
            // componentSlots[key] = (props) => normalizeSlotValue(slot);
        }
    }
}

function normalizeSlotValue (val) {
    return Array.isArray(val) ? val : [val];
}