import { PublicInstanceProxyHandlers } from "./componentPublicInstance";

export function createComponentInstance (vnode) {
    const component = {
        vnode,
        type: vnode.type,
        setupState: {}
    };
    return component;
};

export function setupComponent (instace) {
    setupStatefulComponent(instace);
}

function setupStatefulComponent (instance: any) {
    const Component = instance.vnode.type;

    instance.proxy = new Proxy ({_: instance}, PublicInstanceProxyHandlers)

    const {setup} = Component;
    if (setup) {
        const setupResult = setup();
        handleSetupResult(instance, setupResult);
    }
}

function handleSetupResult (instance, setupResult: any) {
    if (typeof setupResult === "object") {
        instance.setupState = setupResult;
    }

    finishComponentState(instance);
}

function finishComponentState (instance: any) {
    const Component = instance.vnode.type;
    // if (Component.render) {
        instance.render = Component.render;
    // }
}