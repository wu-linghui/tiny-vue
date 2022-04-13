import { effect } from "../reactivity/effect";
import { EMPTY_OBJ, getSequence, hasChange } from "../shared";
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

        // 新的children大于老的->创建新的
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

        // 新的children大于老的->创建新的
        if (i > e2) {
            while (i <= e1) {
                remove(c1[i].el);
                i++;
            }
        }

        // 中间对比
        let s2 = i;
        let s1 = i; // 赋值新老vnode左侧边界指针
        const toBePatched = e2 - s2 + 1; // 新vnode中间部分总共需要patch节点数
        let patched = 0; // 已经完成patched数
        const keyToNewIndexMap = new Map(); // c2-新vnode中间混乱部分映射表
        // 储存旧节点混乱元素的索引，创建定长数组，性能更好
        const newIndexToOldIndexMap = new Array(toBePatched);
        // chil比对新老vnode后应该移动
        let moved = false;
        // 目前最大的索引值
        let maxNewIndexSoFar = 0;
        // 循环初始化每一项索引，0 表示未建立映射关系
        for (let i = 0; i < toBePatched; i++) newIndexToOldIndexMap[i] = 0;
        // c2-新vnode中间混乱部分映射表添加
        for (let index = s2; index <= e2; index++) {
            const nextChild = c2[index];
            keyToNewIndexMap.set(nextChild.key, index);
        }
        // 根据老vnode左侧s1边检开始循环
        for (let index = s1; index <= e1; index++) {
            const prevChild = c1[index];

            // 优化对比老节点时——老vnode中间部分大于新vnode中间部分
            // 在新vnode中间部分patched完成时直接remove掉多余的老节点的child
            if (patched >= toBePatched) {
                remove(prevChild.el);
                continue;
            }

            let newIndex;
            // 根据chil的key到keyToNewIndexMap映射表获取到新vnode中间部分对应chil的index
            if (prevChild.key !== null) {
                newIndex = keyToNewIndexMap.get(prevChild.key);
            } else {
                // 如果没有key的话，就循环新vnode找出老child在新vnode对应的index
                for (let index2 = s2; index2 <= e2; index2++) {
                    if (isSameVNodeType(prevChild, c2[index2])) {
                        newIndex = index2;
                        break;
                    }                 
                }
            }
            // 如果newIndex为空则以为老child在新vnode中不存在remove掉
            if (newIndex === undefined) {
                remove(prevChild.el);
            } else { // 如果存在，就进入到 patch 阶段，继续递归对比

                // 确定新节点存在，储存索引映射关系
                // newIndex 获取到当前老节点在新节点中的元素，减去 s2 是要将整个混乱的部分拆开，索引归于 0
                // 为什么是 i + 1 是因为需要考虑 i 是 0 的情况，因为我们的索引映射表中 0 表示的是初始化状态
                // 所以不能是 0，因此需要用到 i + 1

                /* 在储存索引的时候
                判断是否需要移动
                如果说当前的索引 >= 记录的最大索引
                就把当前的索引给到最大的索引
                否则就不是一直递增，那么就是需要移动的
                */
                newIndex >= maxNewIndexSoFar ? maxNewIndexSoFar = newIndex : moved = true;
                newIndexToOldIndexMap[newIndex - s2] = index + 1;
                patch(prevChild, c2[newIndex], container, parentComponent, null);
                patched++;
            }
        }
        
        // 获取最长递增子序列索引
        const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : [];

        // 需要两个指针 i,j
        // j 指向获取出来的最长递增子序列的索引
        // index 指向我们新节点
        let j = increasingNewIndexSequence.length - 1;

        for (let index = toBePatched -1; index >= 0; index--) {
            // 获取新vnode里chil的下标索引
            const nextIndex = index + s2;
            // 获取到需要插入的元素chil的vnode
            const nextChild = c2[nextIndex];
            // 计算锚点
            const anchor = nextIndex + 1 < l2 ? c2[nextIndex + 1].el : null;

            // 通过储存旧节点混乱元素的映射表，
            // 用新的vnode的chil下标访问如果为初始化的0则意味着该位置的chil是新的需要重新创建
            if (newIndexToOldIndexMap[index] === 0) patch(null, nextChild, container, parentComponent, anchor);

            if (moved) {
                if (j < 0 || index !== increasingNewIndexSequence[j]) {
                    // 移动位置
                    insert(nextChild.el, container, anchor);
                } else {
                    // 不移动
                    j--;
                }                    
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
