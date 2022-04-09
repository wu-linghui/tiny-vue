import { h, getCurrentInstance } from '../../lib/guide-wlh-vue.es.js';
import { Foo } from './Foo.js';
window.$self = null;

export const App = {
    name: "App",
    render() {
        window.$self = this;
        return h("div", {}, [h("p", {}, "currentInstance demo"), h(Foo)]);
    },

    setup () {
        // return {
            const instance = getCurrentInstance();
            console.log("App", instance)
        //     msg: "yhxmnz2"
        // }
    }
}