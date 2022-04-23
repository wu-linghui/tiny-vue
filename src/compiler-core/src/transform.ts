export function transform (root, options) {
    const context = createTransformContext(root, options);
    // 1.遍历-深度优先搜索
    traverseNode(root, context);
    // 2.修改 text content

}

function traverseNode (node, context) {
    const nodeTransform = context.nodeTransform;
    for (let index = 0; index < nodeTransform.length; index++) {
        const transform = nodeTransform[index];
        transform(node);
    }

    traversChildren(node, context);
}

function createTransformContext (root: any, options: any) {
    const context = {
        root,
        nodeTransform: options.nodeTransform || []
    }
    return context;
}

function traversChildren (node: any, context: any) {
    const children = node.children;
    if (children) {
        for (let index = 0; index < children.length; index++) {
            const node = children[index];
            traverseNode(node, context);
        }
    }
}

