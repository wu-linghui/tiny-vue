import { h } from "../../lib/guide-wlh-vue.es.js";
export default {
  name: "Child",
  setup() {
    return {};
  },
  render(proxy) {
    return h("div", {}, [h("div", {}, "child - props - msg: " + this.$props.msg)]);
  },
};
