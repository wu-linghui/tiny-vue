import { computed } from "../computed";
import { effect } from "../effect";
import { isReactive, reactive } from "../reactive"

describe("computed", () => {
    it("happy path", () => {
        const user = reactive({
            age: 1,
        });
        const age = computed(() => {
            return user.age;
        });

        expect(age.value).toBe(1);
    });

    it("should compute lazily", () => {
        const value = reactive({
          foo: 1,
        });
        const getter = jest.fn(() => {
          return value.foo;
        });
        const cValue = computed(getter);
        
        expect(isReactive(cValue)).toBe(false);

        // lazy
        expect(getter).not.toHaveBeenCalled();
    
        expect(cValue.value).toBe(1);
        expect(getter).toHaveBeenCalledTimes(1);
    
        // // should not compute again
        cValue.value;
        expect(getter).toHaveBeenCalledTimes(1);
    
        // // should not compute until needed
        value.foo = 2;
        expect(getter).toHaveBeenCalledTimes(1);
    
        // // now it should compute
        expect(cValue.value).toBe(2);
        expect(getter).toHaveBeenCalledTimes(2);
    
        // // should not compute again
        cValue.value;
        expect(getter).toHaveBeenCalledTimes(2);
    });

    it('should trigger effect', () => {
        const value = reactive({})
        const cValue = computed(() => value.foo)
        let dummy
        effect(() => {
          dummy = cValue.value
        })
        expect(dummy).toBe(undefined)
        value.foo = 1
        expect(dummy).toBe(1)
    })
    
    it('should work when chained', () => {
        const value = reactive({ foo: 0 })
        const c1 = computed(() => value.foo)
        const c2 = computed(() => c1.value + 1)
        expect(c2.value).toBe(1)
        expect(c1.value).toBe(0)
        value.foo++
        expect(c2.value).toBe(2)
        expect(c1.value).toBe(1)
    })
})