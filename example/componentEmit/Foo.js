import { h } from "../../lib/guide-wlh-vue.es.js"

export const Foo = {
    setup (props, { emit }) {
        const emitAdd = () => {
            console.log("event emit");
            emit("add-test");
        };
        return {
            emitAdd
        }
    },
    render () {
        const btn = h("button", {
            onClick: this.emitAdd
        }, "emit-add");
        const foo = h("p", {}, "foo");
        return h("div", {}, [foo, btn]);
    }
}