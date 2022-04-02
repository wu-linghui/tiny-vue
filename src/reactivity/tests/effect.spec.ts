import { effect, stop } from "../effect";
import { reactive } from "../reactive"

describe("effect", () => {
    it("happy path", () => {
        const user = reactive({
            age: 10
        })

        let nextAge;
        effect(() => {
            nextAge = user.age + 1;
        })

        expect(nextAge).toBe(11);

        user.age++;
        expect(nextAge).toBe(12);
    })
    /* 在触发effect时应该return runner */
    it("在触发effect时应该return runner", () => {
        /* 1.effect(fn) -> function(runmer) -> fn -> return */
        let foo = 10;
        const runner = effect(() => {
            foo++;
            return "foo";
        });
        expect(foo).toBe(11);
        const r = runner();
        expect(foo).toBe(12);
        expect(r).toBe("foo");
    })
    /* 
        1.通过effect的第二个参数给定一个scheduler的fn
        2.effect第一次执行的时候还会运行第一个参数的fn
        3.当响应式对象set update时不会执行effect第一个参数的fn而是执行scheduler
        4.如果说当执行runner的时候，会再次执行effect第一个参数的fn
     */

    it("scheduler", () => {
        let dummy;
        let run: any;
        const scheduler = jest.fn(() => {
            run = runner;
        });
        const obj = reactive({foo: 1});
        const runner = effect(
            () => {
                dummy = obj.foo;
            },
            {scheduler}
        );
        expect(scheduler).not.toHaveBeenCalled();
        expect(dummy).toBe(1);
        obj.foo++;
        expect(scheduler).toHaveBeenCalledTimes(1);
        expect(dummy).toBe(1);
        run();
        expect(dummy).toBe(2);
    })

    it("stop", () => {
        let dummy;
        const obj = reactive({prop: 1});
        const runner = effect(() => {
            dummy = obj.prop;
        });
        obj.prop = 2;
        expect(dummy).toBe(2);
        stop(runner);
        obj.prop = 3;
        expect(dummy).toBe(2);
        runner();
        expect(dummy).toBe(3);
    })

    it("onStop", () => {
        const obj = reactive({
            foo: 1
        });
        const onStop = jest.fn();
        let dummy;
        const runner = effect(
            () => {
                dummy = obj.foo;
            },
            {
                onStop
            }
        );
        stop(runner);
        expect(onStop).toBeCalledTimes(1);
    })
})