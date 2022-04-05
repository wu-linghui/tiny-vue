import { isReactive, isReadonly, readonly } from "../reactive";

describe("readonly", () => {
    /* 解决嵌套对象 */
    it("should make nested values readonly", () => {
        const original = {foo: 1, bar: {baz: 2}};
        const wrapped = readonly(original);
        expect(wrapped).not.toBe(original);
        expect(isReadonly(wrapped)).toBe(true);
        expect(isReadonly(original)).toBe(false);
        expect(isReadonly(wrapped.bar)).toBe(true);
        expect(isReadonly(original.bar)).toBe(false);
        expect(wrapped.foo).toBe(1);
    });

    it("readonly时修改值触发报错", () => {
        console.warn = jest.fn();
        
        const user = readonly({
            foo: 1
        });
        user.foo = 2;
        expect(console.warn).toBeCalled();
    })
})