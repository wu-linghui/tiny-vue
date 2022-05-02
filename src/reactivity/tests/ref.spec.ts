import { effect } from "../effect";
import { reactive } from "../reactive";
import { isRef, proxyRefs, ref, unRef } from "../ref";

describe("ref", () => {
    it("happy path", () => {
        const a = ref(1);
        expect(a.value).toBe(1);
    });

    it("should be reactive", () =>{
        const a = ref(1);
        let dummy;
        let calls = 0;
        effect(() => {
            calls++;
            dummy = a.value;
        });
        expect(calls).toBe(1);
        expect(dummy).toBe(1);
        a.value = 2;
        expect(calls).toBe(2);
        expect(dummy).toBe(2);
        /* 相同value重复赋值时effect忽略 */
        a.value = 2;
        expect(calls).toBe(2);
        expect(dummy).toBe(2);
    })

    it("ref包裹的值为嵌套数据时触发reactive", () => {
        const a = ref({
            count: 1
        });
        let dummy;
        effect(() => {
            dummy = a.value.count;
        });
        expect(dummy).toBe(1);
        a.value.count = 2;
        expect(dummy).toBe(2);
    });

    it('should work without initial value', () => {
        const a = ref()
        let dummy
        effect(() => {
          dummy = a.value
        })
        expect(dummy).toBe(undefined)
        a.value = 2
        expect(dummy).toBe(2)
    })

    it('should unwrap nested ref in types', () => {
      const a = ref(0)
      const b = ref(a)
      expect(typeof (b.value + 1)).toBe('number')
    })

    it('should NOT unwrap ref types nested inside arrays', () => {
        const arr = ref([1, ref(3)]).value
        expect(isRef(arr[0])).toBe(false)
        expect(isRef(arr[1])).toBe(true)
        expect(arr[1].value).toBe(3)
    })

    it("isRef", () => {
        const a = ref(1);
        const user = reactive({
            age: 24,
        });
        expect(isRef(a)).toBe(true);
        expect(isRef(1)).toBe(false);
        expect(isRef(user)).toBe(false);
    });

    it("unRef", () => {
        const a = ref(1);
        expect(unRef(a)).toBe(1);
        expect(unRef(2)).toBe(2);
    });

    it("proxyRefs", () => {
        const user = {
            age: ref(10),
            name: "yhxmnz"
        };

        const proxyUser = proxyRefs(user);
        expect(user.age.value).toBe(10);
        expect(proxyUser.age).toBe(10);
        expect(proxyUser.name).toBe("yhxmnz");
        proxyUser.age = 25;
        expect(proxyUser.age).toBe(25);
        expect(user.age.value).toBe(25);

        proxyUser.age = ref(10);
        expect(proxyUser.age).toBe(10);
        expect(user.age.value).toBe(10);
    })

    test('should not trigger when setting value to same proxy', () => {
        const obj = reactive({ count: 0 })
    
        const a = ref(obj)
        const spy1 = jest.fn(() => a.value)
    
        effect(spy1)
    
        a.value = obj
        expect(spy1).toBeCalledTimes(1)
    
        // const b = shallowRef(obj)
        // const spy2 = jest.fn(() => b.value)
    
        // effect(spy2)
    
        // b.value = obj
        // expect(spy2).toBeCalledTimes(1)
      })
})