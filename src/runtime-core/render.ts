import { effect } from "../reactivity/effect";
import { EMPTY_OBJ, hasChange } from "../shared";
import { ShapeFlags } from "../shared/ShapeFlage";
import { createComponentInstance, setupComponent } from "./component";
import { createAppAPI } from "./createApp";
import { Fragment, Text } from "./vnode";

export function createRender (options) {
    const { createElement, patchProp, insert } = options;
    function render (vnode: any, container: any) {
        patch(null, vnode, container, null);
    }

    function patch (n1:any , n2: any , container: any, parentComponent: any) {
        const { shapeFlags, type } = n2;

        /* 根据type来调用不同的函数处理不同的虚拟DOM节点 */
        switch (type) {
            case Fragment:
                processFragment(n1, n2.children, container, parentComponent);
                break;
            case Text:
                processText(n1, n2, container);
                break;
            default:
                if (shapeFlags & ShapeFlags.ELEMENT) processElement(n1, n2, container, parentComponent);
                if (shapeFlags & ShapeFlags.STATEFUL_COMPONENT) processComponent(n1, n2, container, parentComponent);
                break;
        }
    }

    function processElement (n1: any, n2: any, container: any, parentComponent: any) {
        n1 ? patchElement(n1, n2, container) : mountElement(n2, container, parentComponent);
        
    }

    function patchElement (n1, n2, container) {
        const oldProps = n1.props || EMPTY_OBJ;
        const newProps = n2.props || EMPTY_OBJ;
        const el = (n2.el = n1.el);
        patchProps(el, oldProps, newProps);
    }

    function patchProps (el, oldProps, newProps) {
        if (!hasChange(newProps, oldProps)) return;
        for (const key in newProps) {
            if (Object.prototype.hasOwnProperty.call(newProps, key)) {
                const prevProp = oldProps[key];
                const nextProp = newProps[key];
                if (prevProp !== nextProp) patchProp(el, key, prevProp, nextProp);
            }
        }
        if (!hasChange(oldProps, EMPTY_OBJ)) return;
        for (const key in oldProps) {
            if (!Object.prototype.hasOwnProperty.call(newProps, key)) {
                patchProp(el, key, oldProps[key], null);
            }
        }
    }

    function processFragment (n1: any, n2: any, container: any, parentComponent: any) {
        mountChildren(n2, container, parentComponent);
    }

    function processText (n1: any, n2: any, container: any) {
        const { children } = n2;
        const textNode = (n2.el = document.createTextNode(children));
        container.append(textNode);
    }

    function mountElement (vnode: any, container: any, parentComponent: any) {
        const el = (vnode.el = createElement(vnode.type));
        const { children, shapeFlags } = vnode;

        if (shapeFlags & ShapeFlags.TEXT_CHILDREN) el.textContent = children;
        if (shapeFlags & ShapeFlags.ARRAY_CHILDREN) {        
            mountChildren(children, el, parentComponent);
        };
        const { props } = vnode;
        for (const key in props) {
            if (Object.prototype.hasOwnProperty.call(props, key)) {
                const val = props[key];
                patchProp(el, key, null, val);
            }
        }

        // container.append(el);
        insert(el, container);
    }

    function mountChildren (children, container, parentComponent) {
        children.forEach((h) => {
            patch(null, h, container, parentComponent);
        })
    }

    function processComponent (n1:any, n2:any, container: any, parentComponent: any) {
        mountComponent(n2, container, parentComponent);
    }

    function  mountComponent (initVNode: any, container: any, parentComponent: any) {
        const instance = createComponentInstance(initVNode, parentComponent);
        setupComponent(instance);
        setupRenderEffect(instance, initVNode, container);
    }

    function setupRenderEffect (instance: any, initVNode: any, container: any) {
        effect(() => {
            if (!instance.isMounted) {
                const { proxy } = instance;
                const subTree = (instance.subTree = instance.render.call(proxy));
                console.log(subTree)
                patch(null, subTree, container, instance);
                // element -> 全部挂载后将element的真实DOM指向到component的el上
                initVNode.el = subTree.el;
                instance.isMounted = true;
            } else {
                const { proxy } = instance;
                const subTree = instance.render.call(proxy);
                const prevSubTree = instance.subTree;
                // console.log(subTree)
                patch(prevSubTree, subTree, container, instance);
            }
        });
    }

    return {
        createApp: createAppAPI(render)
    }
}
