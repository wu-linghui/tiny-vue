import { h, renderSlots } from "../../lib/guide-wlh-vue.es.js"

export const Foo = {
    setup () {
        return {};
    },
    render () {
        const foo = h("p", {}, "foo");
        /* Foo -> vnode -> children */
        console.log(this.$slots)
        const age = 10;
        return h("div", {}, [renderSlots(this.$slots, "top", {age}), foo, renderSlots(this.$slots, "bottom")]);
    }
}