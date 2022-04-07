import { render } from "./render";
import { createVNode } from "./vnode";

export function createApp (rootComponent) {
    return {
        mount(rootContainer) {
            /* 
                1.vnode
                2.component -> vnode
                3.所有的逻辑操作都会基于vnode做处理
             */

            const vnode = createVNode(rootComponent);
            render(vnode, rootContainer)
        }
    }
};

