import { h } from "../../lib/guide-wlh-vue.es.js"

export const Foo = {
    setup (props) {
        console.log(props);
        props.count++
    },
    render () {
        return h("div", {}, "foo:" + this.count);
    }
}