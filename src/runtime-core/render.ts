import { effect } from "../reactivity/effect";
import { EMPTY_OBJ, hasChange } from "../shared";
import { ShapeFlags } from "../shared/ShapeFlage";
import { createComponentInstance, setupComponent } from "./component";
import { createAppAPI } from "./createApp";
import { Fragment, Text } from "./vnode";

export function createRender (options) {
    const { createElement, patchProp, insert, remove, setElementText } = options;
    function render (vnode: any, container: any) {
        patch(null, vnode, container, null, null);
    }

    function patch (oldVNode:any , newVNode: any , container: any, parentComponent: any, anchor: any) {
        const { shapeFlag, type } = newVNode;

        /* 根据type来调用不同的函数处理不同的虚拟DOM节点 */
        switch (type) {
            case Fragment:
                processFragment(oldVNode, newVNode.children, container, parentComponent, anchor);
                break;
            case Text:
                processText(oldVNode, newVNode, container);
                break;
            default:
                if (shapeFlag & ShapeFlags.ELEMENT) processElement(oldVNode, newVNode, container, parentComponent, anchor);
                if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) processComponent(oldVNode, newVNode, container, parentComponent, anchor);
                break;
        }
    }

    function processElement (oldVNode: any, newVNode: any, container: any, parentComponent: any, anchor: any) {
        oldVNode ? patchElement(oldVNode, newVNode, container, parentComponent, anchor) : mountElement(newVNode, container, parentComponent, anchor);
        
    }

    function patchElement (oldVNode, newVNode, container, parentComponent, anchor) {
        const oldProps = oldVNode.props || EMPTY_OBJ;
        const newProps = newVNode.props || EMPTY_OBJ;
        const el = (newVNode.el = oldVNode.el);
        patchChildren(oldVNode, newVNode, el, parentComponent, anchor);
        patchProps(el, oldProps, newProps);
    }

    function patchChildren (oldVNode, newVNode, container, parentComponent, anchor) {
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
                mountChildren(c2, container, parentComponent, anchor);
                return;
            }

            patchKeyedChildren(c1, c2, container, parentComponent, anchor);
        }
    }

    function patchKeyedChildren (c1, c2, container, parentComponent, parentAnchor) {
        let i = 0;
        const l2 = c2.length;
        let e1 = c1.length - 1;
        let e2 = l2 - 1;

        function isSameVNodeType (n1, n2): boolean {
            return n1.type === n2.type && n1.key === n2.key;
        }
        // 左侧对比
        while (i <= e1 && i <= e2) {
            const n1 = c1[i];
            const n2 = c2[i];

            if (isSameVNodeType(n1, n2)) {
                patch(n1, n2, container, parentComponent, parentAnchor);
            } else {
                break;
            }
            i++;
        }

        // 右侧对比
        while (i <= e1 && i <= e2) {
            const n1 = c1[e1];
            const n2 = c2[e2];

            if (isSameVNodeType(n1, n2)) {
                patch(n1, n2, container, parentComponent, parentAnchor);
            } else {
                break;
            }

            e1--;
            e2--;
        }

        // 新的chilren大于老的->创建新的
        if (i > e1) {
            if (i <= e2) {
                debugger
                const nextPos = e2 + 1;
                const anchor = nextPos < l2 ? c2[nextPos].el : null;
                while (i <= e2) {
                    patch(null, c2[i], container, parentComponent, anchor);
                    i++;                
                }
            }
        }
        if (i > e2) {
            while (i <= e1) {
                remove(c1[i].el);
                i++;
            }
        }

        // 中间对比
        let s1 = i;
        let s2 = i;
        const toBePatched = e2 - s2 + 1;
        let patched = 0;        
        const keyToNewIndexMap = new Map();
        for (let index = s2; index <= e2; index++) {
            const nextChild = c2[index];
            keyToNewIndexMap.set(nextChild.key, index);
        }

        for (let index = s1; index <= e1; index++) {
            const prevChild = c1[index];

            if (patched >= toBePatched) {
                remove(prevChild.el);
                continue;
            }

            let newIndex;
            if (prevChild.key != null) {
                newIndex = keyToNewIndexMap.get(prevChild.key);
            } else {
                for (let index2 = s2; index2 < e2; index2++) {
                    if (isSameVNodeType(prevChild, c2[index2])) {
                        newIndex = index2;
                        break;
                    }
                 
                }
            }

            if (newIndex === undefined) {
                remove(prevChild.el);
            } else {
                patch(prevChild, c2[newIndex], container, parentComponent, null);
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

    function processFragment (oldVNode: any, newVNode: any, container: any, parentComponent: any, anchor: any) {
        mountChildren(newVNode, container, parentComponent, anchor);
    }

    function processText (oldVNode: any, newVNode: any, container: any) {
        const { children } = newVNode;
        const textNode = (newVNode.el = document.createTextNode(children));
        container.append(textNode);
    }

    function mountElement (vnode: any, container: any, parentComponent: any, anchor: any) {
        const el = (vnode.el = createElement(vnode.type));
        const { children, shapeFlag } = vnode;

        if (shapeFlag & ShapeFlags.TEXT_CHILDREN) el.textContent = children;
        if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {        
            mountChildren(children, el, parentComponent, anchor);
        };
        const { props } = vnode;
        for (const key in props) {
            if (Object.prototype.hasOwnProperty.call(props, key)) {
                const val = props[key];
                patchProp(el, key, null, val);
            }
        }

        // container.append(el);
        insert(el, container, anchor);
    }

    function mountChildren (children, container, parentComponent, anchor) {
        children.forEach((h) => {
            patch(null, h, container, parentComponent, anchor);
        })
    }

    function processComponent (oldVNode: any, newVNode: any, container: any, parentComponent: any, anchor: any) {
        mountComponent(newVNode, container, parentComponent, anchor);
    }

    function  mountComponent (initVNode: any, container: any, parentComponent: any, anchor: any) {
        const instance = createComponentInstance(initVNode, parentComponent);
        setupComponent(instance);
        setupRenderEffect(instance, initVNode, container, anchor);
    }

    function setupRenderEffect (instance: any, initVNode: any, container: any, anchor: any) {
        effect(() => {
            if (!instance.isMounted) {
                const { proxy } = instance;
                const subTree = (instance.subTree = instance.render.call(proxy));
                console.log(subTree)
                patch(null, subTree, container, instance, anchor);
                // element -> 全部挂载后将element的真实DOM指向到component的el上
                initVNode.el = subTree.el;
                instance.isMounted = true;
            } else {
                const { proxy } = instance;
                const subTree = instance.render.call(proxy);
                const prevSubTree = instance.subTree;
                instance.subTree = subTree;
                patch(prevSubTree, subTree, container, instance, anchor);
            }
        });
    }

    return {
        createApp: createAppAPI(render)
    }
}
