import { shallowReadonly } from "../reactivity/reactive";
import { initProps } from "./componentProps";
import { PublicInstanceProxyHandlers } from "./componentPublicInstance";
import { initSlots } from "./componentSlots";
import { emit } from "./emit";

export function createComponentInstance (initVNode, parent) {
    const component = {
        vnode: initVNode,
        type: initVNode.type,
        setupState: {},
        slots: {},
        provides: parent? parent.provides : {},
        parent,
        emit: () => {}
    };

    component.emit = emit.bind(null, component) as any;

    return component;
};

export function setupComponent (instance) {
    initProps(instance, instance.vnode.props);
    initSlots(instance, instance.vnode.children);
    setupStatefulComponent(instance);
}

function setupStatefulComponent (instance: any) {
    const Component = instance.vnode.type;

    instance.proxy = new Proxy ({_: instance}, PublicInstanceProxyHandlers)

    const {setup} = Component;
    if (setup) {
        setCurrentInstance(instance);
        const setupResult = setup(shallowReadonly(instance.props), {
            emit: instance.emit
        });
        setCurrentInstance(null);
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

let CurrentInstance = null;

export function getCurrentInstance () {
    return CurrentInstance;
}

function setCurrentInstance (val: null) {
    CurrentInstance = val;
}