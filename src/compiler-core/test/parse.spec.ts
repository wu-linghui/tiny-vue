import { NodeType } from "../src/ast";
import { baseParse } from "../src/parse";

describe("Parse", () => {
    describe("interpolation", () => {
        test("simple interpolation", () => {
            const ast = baseParse("{{ msg }}");
            console.log(ast.children[0])
            expect(ast.children[0]).toStrictEqual({
                type: NodeType.INTERPOLATION,
                content: {
                    type: NodeType.SIMPLE_EXPRESSION,
                    content: "msg"
                }
            })
        })
    })
})