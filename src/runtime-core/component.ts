import { shallowReadonly } from "../reactivity/reactive";
import { initProps } from "./componentProps";
import { PublicInstanceProxyHandlers } from "./componentPublicInstance";

export function createComponentInstance (initVNode) {
    const component = {
        vnode: initVNode,
        type: initVNode.type,
        setupState: {}
    };
    return component;
};

export function setupComponent (instance) {
    initProps(instance, instance.vnode.props);
    setupStatefulComponent(instance);
}

function setupStatefulComponent (instance: any) {
    const Component = instance.vnode.type;

    instance.proxy = new Proxy ({_: instance}, PublicInstanceProxyHandlers)

    const {setup} = Component;
    if (setup) {
        const setupResult = setup(shallowReadonly(instance.props));
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