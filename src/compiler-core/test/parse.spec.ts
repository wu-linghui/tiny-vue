import { NodeType } from "../src/ast";
import { baseParse } from "../src/parse";

describe("Parse", () => {
    describe("interpolation", () => {
        test("simple interpolation", () => {
            const ast = baseParse("{{ msg }}");
            expect(ast.children[0]).toStrictEqual({
                type: NodeType.INTERPOLATION,
                content: {
                    type: NodeType.SIMPLE_EXPRESSION,
                    content: "msg"
                }
            })
        })
    })

    describe("element", () => {
        test("simple element div", () => {
            const ast = baseParse("<div></div>");
            expect(ast.children[0]).toStrictEqual({
                type: NodeType.ELEMENT,
                tag: "div"
            })
        })
    })

    describe("text", () => {
        test("simple text", () => {
            const ast = baseParse("some text");
            expect(ast.children[0]).toStrictEqual({
                type: NodeType.TEXT,
                content: "some text"
            })
        })
    })
})