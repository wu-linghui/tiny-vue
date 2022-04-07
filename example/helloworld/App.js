import { h } from '../../lib/guide-wlh-vue.es.js';
export const App = {
    render() {
        return h(
            "div",
            {
                id: "root",
                class: ["red", "hard"]
            },
            // "hi",
            [h("p", {class: "red"}, "hi"), h("p", {class: "blue"}, "yhxmnz")]
        );
    },

    setup () {
        return {
            msg: "yhxmnz"
        }
    }
}