import { h } from '../../lib/guide-wlh-vue.es.js';
import { Foo } from './Foo.js';
window.$self = null;

export const App = {
    render() {
        window.$self = this;
        const app = h("div", {}, "App");
        const foo = h(Foo, {}, {
            top: ({age}) => h("p", {}, "123" + age), 
            bottom: () => h("p", {}, "321")
        });
        // const foo = h(Foo, {}, h("p", {}, "123"));
        return h(
            "div",
            {},
            [app, foo]
        );
    },

    setup () {
        return {
            msg: "yhxmnz2"
        }
    }
}