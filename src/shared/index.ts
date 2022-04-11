export const extend = Object.assign;

export const isObject = (val) => {
    return val !== null && typeof val === "object";
};

export const hasChange = (newValue, oldValue) => {
    return !Object.is(newValue, oldValue);
}

export const EMPTY_OBJ = {};

export const hasOwn = (target, key) => Object.prototype.hasOwnProperty.call(target, key);
