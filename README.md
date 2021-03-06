# tiny-vue

Hi, there! 👋

As you can see, I'm a frontend developer.

该项目是我基于崔大的 [mini-vue](https://github.com/cuixiaorui/mini-vue) 的个人实现

[这个是配套的笔记](https://github.com/wu-linghui/tiny-vue-docs) 搭配起来食用更佳哟

目前已实现模块：

### reactivity

- reactive
  - [x] [happy path](https://github.com/wu-linghui/tiny-vue-docs/blob/main/docs/1.%E5%AE%9E%E7%8E%B0%20effect%20%26%20reactive%20%26%20%E4%BE%9D%E8%B5%96%E6%94%B6%E9%9B%86%20%26%20%E8%A7%A6%E5%8F%91%E4%BE%9D%E8%B5%96.md#21-%E7%BC%96%E5%86%99%E4%B8%80%E4%B8%AA%E5%8D%95%E5%85%83%E6%B5%8B%E8%AF%95)
  - [x] [isReactive](https://github.com/wu-linghui/tiny-vue-docs/blob/main/docs/6.%20%E5%AE%9E%E7%8E%B0%20isReactive%20%E5%92%8C%20isReadonly.md#1-isreactive-%E6%B5%8B%E8%AF%95%E6%A0%B7%E4%BE%8B)
  - [x] [reactive 嵌套转换](https://github.com/wu-linghui/tiny-vue-docs/blob/main/docs/7.%20%E5%AE%9E%E7%8E%B0%20reactive%20%E5%92%8C%20readonly%20%E7%9A%84%E5%B5%8C%E5%A5%97%E8%BD%AC%E6%8D%A2.md#1-reactive-%E5%B5%8C%E5%A5%97%E8%BD%AC%E6%8D%A2%E5%8D%95%E5%85%83%E6%B5%8B%E8%AF%95)
- effect
  - [x] [happy path](https://github.com/wu-linghui/tiny-vue-docs/blob/main/docs/1.%E5%AE%9E%E7%8E%B0%20effect%20%26%20reactive%20%26%20%E4%BE%9D%E8%B5%96%E6%94%B6%E9%9B%86%20%26%20%E8%A7%A6%E5%8F%91%E4%BE%9D%E8%B5%96.md#1-%E7%BC%96%E5%86%99%E5%8D%95%E5%85%83%E6%B5%8B%E8%AF%95)
  - [x] [return runner](https://github.com/wu-linghui/tiny-vue-docs/blob/main/docs/2.%20%E5%AE%9E%E7%8E%B0%20effect%20%E8%BF%94%E5%9B%9E%20runner.md#1-%E6%B5%8B%E8%AF%95%E6%A0%B7%E4%BE%8B)
  - [x] [scheduler](https://github.com/wu-linghui/tiny-vue-docs/blob/main/docs/3.%20%E5%AE%9E%E7%8E%B0%20effect%20%E7%9A%84%20scheduler%20%E5%8A%9F%E8%83%BD.md#1-%E6%B5%8B%E8%AF%95%E6%A0%B7%E4%BE%8B)
  - [x] [stop & onStop](https://github.com/wu-linghui/tiny-vue-docs/blob/main/docs/4.%20%E5%AE%9E%E7%8E%B0%20effect%20%E7%9A%84%20stop%20%E5%8A%9F%E8%83%BD.md#1-stop-%E7%9A%84%E6%B5%8B%E8%AF%95%E6%A0%B7%E4%BE%8B)
- readonly
  - [x] [happy path](https://github.com/wu-linghui/tiny-vue-docs/blob/main/docs/5.%20%E5%AE%9E%E7%8E%B0%20readonly%20%E5%8A%9F%E8%83%BD.md#1-happy-path-%E5%8D%95%E5%85%83%E6%B5%8B%E8%AF%95)
  - [x] [isReadonly](https://github.com/wu-linghui/tiny-vue-docs/blob/main/docs/6.%20%E5%AE%9E%E7%8E%B0%20isReactive%20%E5%92%8C%20isReadonly.md#3-isreadonly-%E6%B5%8B%E8%AF%95%E6%A0%B7%E4%BE%8B)
  - [x] [readonly 嵌套转换](https://github.com/wu-linghui/tiny-vue-docs/blob/main/docs/7.%20%E5%AE%9E%E7%8E%B0%20reactive%20%E5%92%8C%20readonly%20%E7%9A%84%E5%B5%8C%E5%A5%97%E8%BD%AC%E6%8D%A2.md#3-readonly-%E5%B5%8C%E5%A5%97%E6%B5%8B%E8%AF%95%E6%A0%B7%E4%BE%8B)
- [x] [shallowReadonly](https://github.com/wu-linghui/tiny-vue-docs/blob/main/docs/8.%20%E5%AE%9E%E7%8E%B0%20shallowReadonly.md)
- [x] [isProxy](https://github.com/wu-linghui/tiny-vue-docs/blob/main/docs/9.%20%E5%AE%9E%E7%8E%B0%20isProxy.md)
- [x] [shallowReactive](https://github.com/wu-linghui/tiny-vue-docs/blob/main/docs/10.%20%E5%AE%9E%E7%8E%B0%20shallowReactive.md)
- ref
  - [x] [happy path](https://github.com/wu-linghui/tiny-vue-docs/blob/main/docs/11.%20%E5%AE%9E%E7%8E%B0%20ref.md#1-happy-path)
  - [x] [ref 应该是响应式的](https://github.com/wu-linghui/tiny-vue-docs/blob/main/docs/11.%20%E5%AE%9E%E7%8E%B0%20ref.md#2-ref-%E5%BA%94%E8%AF%A5%E6%98%AF%E5%93%8D%E5%BA%94%E5%BC%8F)
  - [x] [ref 的值如果是一个对象那么就是 reactive](https://github.com/wu-linghui/tiny-vue-docs/blob/main/docs/11.%20%E5%AE%9E%E7%8E%B0%20ref.md#3-%E5%B5%8C%E5%A5%97-prop-%E5%BA%94%E8%AF%A5%E6%98%AF-reactive-%E7%9A%84)
  - [x] [isRef](https://github.com/wu-linghui/tiny-vue-docs/blob/main/docs/13.%20%E5%AE%9E%E7%8E%B0%20isRef%20%E5%92%8C%20unRef.md#1-isref)
  - [x] [unRef](https://github.com/wu-linghui/tiny-vue-docs/blob/main/docs/13.%20%E5%AE%9E%E7%8E%B0%20isRef%20%E5%92%8C%20unRef.md#2-unref)
  - [x] [proxyRefs](https://github.com/wu-linghui/tiny-vue-docs/blob/main/docs/14.%20%E5%AE%9E%E7%8E%B0%20proxyRefs.md)
- [x] [toRaw](https://github.com/wu-linghui/tiny-vue-docs/blob/main/docs/12.%20%E5%AE%9E%E7%8E%B0%20toRaw.md)
- [x] [computed](https://github.com/wu-linghui/tiny-vue-docs/blob/main/docs/15.%20%E5%AE%9E%E7%8E%B0%20computed.md)

### runtime-core

- 组件
  - [x] [组件的初始化流程](https://github.com/wu-linghui/tiny-vue-docs/blob/main/docs/16.%20%E7%BB%84%E4%BB%B6%E7%9A%84%E5%88%9D%E5%A7%8B%E5%8C%96%E6%B5%81%E7%A8%8B.md)
  - [x] [组件代理对象/render 中可以访问 setup 返回/\$el](https://github.com/wu-linghui/tiny-vue-docs/blob/main/docs/18.%20%E7%BB%84%E4%BB%B6%E7%9A%84%E4%BB%A3%E7%90%86%E5%AF%B9%E8%B1%A1.md)
  - [x] [shapeFlags 对组件进行判断](https://github.com/wu-linghui/tiny-vue-docs/blob/main/docs/19.%20%E5%AE%9E%E7%8E%B0%20shapeFlags.md)
  - [x] [注册事件](https://github.com/wu-linghui/tiny-vue-docs/blob/main/docs/20.%20%E5%AE%9E%E7%8E%B0%E6%B3%A8%E5%86%8C%E4%BA%8B%E4%BB%B6%E5%8A%9F%E8%83%BD.md)
  - [x] [注册 Props](https://github.com/wu-linghui/tiny-vue-docs/blob/main/docs/21.%20%E5%AE%9E%E7%8E%B0%E7%BB%84%E4%BB%B6%E7%9A%84%20props%20%E5%8A%9F%E8%83%BD.md)
  - [x] [emit](https://github.com/wu-linghui/tiny-vue-docs/blob/main/docs/22.%20%E5%AE%9E%E7%8E%B0%E7%BB%84%E4%BB%B6%E7%9A%84%20emit%20%E5%8A%9F%E8%83%BD.md)
  - [x] [slots](https://github.com/wu-linghui/tiny-vue-docs/blob/main/docs/23.%20%E5%AE%9E%E7%8E%B0%E7%BB%84%E4%BB%B6%E7%9A%84%20slot%20%E5%8A%9F%E8%83%BD.md)
  - [x] [Fragment 和 TextNode](https://github.com/wu-linghui/tiny-vue-docs/blob/main/docs/24.%20%E5%AE%9E%E7%8E%B0%20Fragment%20%E5%92%8C%20Text%20%E8%8A%82%E7%82%B9.md)
  - [x] [getCurrentInstance](https://github.com/wu-linghui/tiny-vue-docs/blob/main/docs/25.%20%E5%AE%9E%E7%8E%B0%20getCurrentInstance.md)
  - [x] [provide/inject](https://github.com/wu-linghui/tiny-vue-docs/blob/main/docs/26.%20%E5%AE%9E%E7%8E%B0%20provide%20%E5%92%8C%20inject.md)
  - [x] [customRenderer](https://github.com/wu-linghui/tiny-vue-docs/blob/main/docs/27.%20%E5%AE%9E%E7%8E%B0%20customRenderer.md)
- 打包
  - [x] [配置 rollup](https://github.com/wu-linghui/tiny-vue-docs/blob/main/docs/17.%20%E9%85%8D%E7%BD%AE%20rollup.md)
- 更新逻辑
  - [x] [初始化更新 element 逻辑](https://github.com/wu-linghui/tiny-vue-docs/blob/main/docs/28.%20%E5%88%9D%E5%A7%8B%E5%8C%96%20element%20%E6%9B%B4%E6%96%B0%E6%B5%81%E7%A8%8B.md)
  - [x] [更新 props](https://github.com/wu-linghui/tiny-vue-docs/blob/main/docs/29.%20%E6%9B%B4%E6%96%B0%20props.md)
  - [x] 更新 children
    - [x] [array -> text](https://github.com/wu-linghui/tiny-vue-docs/blob/main/docs/30.%20%E6%9B%B4%E6%96%B0%20children%EF%BC%88%E4%B8%80%EF%BC%89.md#21-array--text)
    - [x] [text -> text](https://github.com/wu-linghui/tiny-vue-docs/blob/main/docs/30.%20%E6%9B%B4%E6%96%B0%20children%EF%BC%88%E4%B8%80%EF%BC%89.md#22-text--newtext)
    - [x] [text -> array](https://github.com/wu-linghui/tiny-vue-docs/blob/main/docs/30.%20%E6%9B%B4%E6%96%B0%20children%EF%BC%88%E4%B8%80%EF%BC%89.md#23-text--array)
    - [x] array -> array
      - [x] [首尾对比](https://github.com/wu-linghui/tiny-vue-docs/blob/main/docs/31.%20%E6%9B%B4%E6%96%B0%20children%EF%BC%88%E4%BA%8C%EF%BC%89.md)
      - [x] [中间对比（一）删除多的旧节点](https://github.com/wu-linghui/tiny-vue-docs/blob/main/docs/32.%20%E6%9B%B4%E6%96%B0%20children%EF%BC%88%E4%B8%89%EF%BC%89.md)
      - [x] [中间对比（二）移动和创建少的节点](https://github.com/wu-linghui/tiny-vue-docs/blob/main/docs/33.%20%E6%9B%B4%E6%96%B0%20children%EF%BC%88%E5%9B%9B%EF%BC%89.md)
  - [x] [更新 component](https://github.com/wu-linghui/tiny-vue-docs/blob/main/docs/34.%20%E6%9B%B4%E6%96%B0%20component.md)
  - [x] [异步更新视图和 `nextTick` API](https://github.com/wu-linghui/tiny-vue-docs/blob/main/docs/35.%20%E8%A7%86%E5%9B%BE%E5%BC%82%E6%AD%A5%E6%9B%B4%E6%96%B0%20%26%26%20nextTick%20API.md)

### compiler-core

- [x] [compiler 模块概述](https://github.com/wu-linghui/tiny-vue-docs/blob/main/docs/36.%20%E7%BC%96%E8%AF%91%E6%A8%A1%E5%9D%97%E6%A6%82%E8%BF%B0.md)
- [x] [parse 插值表达式](https://github.com/wu-linghui/tiny-vue-docs/blob/main/docs/37.%20%E5%AE%9E%E7%8E%B0%E8%A7%A3%E6%9E%90%E6%8F%92%E5%80%BC%E8%A1%A8%E8%BE%BE%E5%BC%8F.md)
- [x] [parse element](https://github.com/wu-linghui/tiny-vue-docs/blob/main/docs/38.%20%E5%AE%9E%E7%8E%B0%E8%A7%A3%E6%9E%90%20element%20%E6%A0%87%E7%AD%BE.md)
- [x] [parse text](https://github.com/wu-linghui/tiny-vue-docs/blob/main/docs/39.%20%E5%AE%9E%E7%8E%B0%E8%A7%A3%E6%9E%90%20text.md)
- [x] [parse 联合三种类型](https://github.com/wu-linghui/tiny-vue-docs/blob/main/docs/40.%20%E4%B8%89%E7%A7%8D%E7%B1%BB%E5%9E%8B%E8%81%94%E5%90%88%E8%A7%A3%E6%9E%90.md)
- [x] [transform 模块](https://github.com/wu-linghui/tiny-vue-docs/blob/main/docs/42.%20transform%20%E6%A8%A1%E5%9D%97.md)
- [x] [codegen 生成 text](https://github.com/wu-linghui/tiny-vue-docs/blob/main/docs/43.%20codegen%20%E7%94%9F%E6%88%90%20text.md)
- [x] [codegen 生成插值](https://github.com/wu-linghui/tiny-vue-docs/blob/main/docs/44.%20codegen%20%E7%94%9F%E6%88%90%E6%8F%92%E5%80%BC%E7%B1%BB%E5%9E%8B.md)
- [x] [codegen 生成 element](https://github.com/wu-linghui/tiny-vue-docs/blob/main/docs/45.%20codegen%20%E7%94%9F%E6%88%90%20element.md)
- [x] [template 编译为 render](https://github.com/wu-linghui/tiny-vue-docs/blob/main/docs/47.%20%E5%AE%9E%E7%8E%B0%20template%20%E7%BC%96%E8%AF%91%E4%B8%BA%20render.md)
