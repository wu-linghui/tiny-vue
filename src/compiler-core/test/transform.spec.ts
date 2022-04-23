import { NodeType } from "../src/ast";
import { baseParse } from "../src/parse";
import { transform } from "../src/transform";

describe("transform", () => {
    test("happy path", () => {
        const ast = baseParse("<div>hi,{{msg}}</div>");
        const plugin = (node) => {
            if (node.type === NodeType.TEXT) node.content = node.content + "tiny-vue";
        };        
        transform(ast, {
            nodeTransform: [plugin],
        });
        const nodeText = ast.children[0].children[0];
        expect(nodeText.content).toBe("hi,tiny-vue");
    })
});