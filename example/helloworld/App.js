import { h } from '../../lib/guide-wlh-vue.es.js';
window.$self = null;
export const App = {
    render() {
        window.$self = this;
        return h(
            "div",
            {
                id: "root",
                class: ["red", "hard"],
                onClick () {
                    console.log("click");
                }
            },
            "hi" + this.msg,
            // [h("p", {class: "red"}, "hi"), h("p", {class: "blue"}, "yhxmnz")]
        );
    },

    setup () {
        return {
            msg: "yhxmnz2"
        }
    }
}