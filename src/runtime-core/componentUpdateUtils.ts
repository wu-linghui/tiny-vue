export function shouldUpdateComponent (oldVNode: any, newVNode: any) {
    const { props: oldProps } = oldVNode;
    const { props: newProps } = newVNode;
    for (const key in newProps) {
        if (newProps[key] !== oldProps[key]) {
            return true;            
        }
    }
    return false;
}