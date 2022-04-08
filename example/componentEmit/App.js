import { h } from '../../lib/guide-wlh-vue.es.js';
import { Foo } from './Foo.js';
window.$self = null;

export const App = {
    render() {
        window.$self = this;
        return h(
            "div",
            {},
            // "hi" + this.msg,
            [h("p", {class: "red"}, "hi"), h(Foo, {
                onAddTest: () => {
                    console.log("onAdd")
                }
            })]
        );
    },

    setup () {
        return {
            msg: "yhxmnz2"
        }
    }
}