import { h, getCurrentInstance } from "../../lib/guide-wlh-vue.es.js"

export const Foo = {
    setup (props) {
        const instance = getCurrentInstance();
        console.log("App", instance);
        return {};
    },
    render () {
        return h("div", {}, "foo");
    }
}