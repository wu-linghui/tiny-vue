import { isReadonly, shallowReadonly } from "../reactive";

describe("shallowReadonly", () => {
    test("should not make non-reactive properies reactiv", () => {
        const props = shallowReadonly({n: {foo: 1}});
        expect(isReadonly(props)).toBe(true);
        expect(isReadonly(props.n)).toBe(false);
        expect(props.n).toStrictEqual({"foo": 1});
    })
})