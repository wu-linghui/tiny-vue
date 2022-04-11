import { effect } from "../reactivity/effect";
import { EMPTY_OBJ, hasChange } from "../shared";
import { ShapeFlags } from "../shared/ShapeFlage";
import { createComponentInstance, setupComponent } from "./component";
import { createAppAPI } from "./createApp";
import { Fragment, Text } from "./vnode";

export function createRender (options) {
    const { createElement, patchProp, insert, remove, setElementText } = options;
    function render (vnode: any, container: any) {
        patch(null, vnode, container, null);
    }

    function patch (oldVNode:any , newVNode: any , container: any, parentComponent: any) {
        const { shapeFlag, type } = newVNode;

        /* 根据type来调用不同的函数处理不同的虚拟DOM节点 */
        switch (type) {
            case Fragment:
                processFragment(oldVNode, newVNode.children, container, parentComponent);
                break;
            case Text:
                processText(oldVNode, newVNode, container);
                break;
            default:
                if (shapeFlag & ShapeFlags.ELEMENT) processElement(oldVNode, newVNode, container, parentComponent);
                if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) processComponent(oldVNode, newVNode, container, parentComponent);
                break;
        }
    }

    function processElement (oldVNode: any, newVNode: any, container: any, parentComponent: any) {
        oldVNode ? patchElement(oldVNode, newVNode, container, parentComponent) : mountElement(newVNode, container, parentComponent);
        
    }

    function patchElement (oldVNode, newVNode, container, parentComponent) {
        const oldProps = oldVNode.props || EMPTY_OBJ;
        const newProps = newVNode.props || EMPTY_OBJ;
        const el = (newVNode.el = oldVNode.el);
        patchChildren(oldVNode, newVNode, el, parentComponent);
        patchProps(el, oldProps, newProps);
    }

    function patchChildren (oldVNode, newVNode, container, parentComponent) {
        const prevShapeFlag = oldVNode.shapeFlag;
        const { shapeFlag } = newVNode;
        const c1 = oldVNode.children;
        const c2 = newVNode.children;
        if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
            if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) unmountChildren(c1);
            if (hasChange(c1, c2)) setElementText(container, c2);
        } else {
            if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
                setElementText(container, "");
                mountChildren(c2, container, parentComponent);
            }
        }
    }

    function unmountChildren (children) {
        for (let index = 0; index < children.length; index++) {
            const element = children[index].el;
            remove(element);
        }
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

    function processFragment (oldVNode: any, newVNode: any, container: any, parentComponent: any) {
        mountChildren(newVNode, container, parentComponent);
    }

    function processText (oldVNode: any, newVNode: any, container: any) {
        const { children } = newVNode;
        const textNode = (newVNode.el = document.createTextNode(children));
        container.append(textNode);
    }

    function mountElement (vnode: any, container: any, parentComponent: any) {
        const el = (vnode.el = createElement(vnode.type));
        const { children, shapeFlag } = vnode;

        if (shapeFlag & ShapeFlags.TEXT_CHILDREN) el.textContent = children;
        if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {        
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

    function processComponent (oldVNode:any, newVNode:any, container: any, parentComponent: any) {
        mountComponent(newVNode, container, parentComponent);
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
                instance.subTree = subTree;
                patch(prevSubTree, subTree, container, instance);
            }
        });
    }

    return {
        createApp: createAppAPI(render)
    }
}
