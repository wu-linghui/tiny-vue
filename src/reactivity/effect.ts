import { extend, isArray } from "../shared";

export let activeEffect;
export let shouldTrack = false; 
export class ReactiveEffect {
    private _fn: any;
    public deps = [];
    active = true;
    onStop?: () => void;
    public scheduler: Function | undefined;
    constructor (fn, scheduler?: Function) {
        this._fn = fn;        
        this.scheduler = scheduler;
    }

    run () {
        if (!this.active) return this._fn();

        shouldTrack = true;
        activeEffect = this;
        const result = this._fn();
        shouldTrack = false;
        return result;
    }

    stop () {
        if (!this.active) return;
        clearUpDeps(this);
        if (this.onStop) this.onStop();
        this.active = false;
    }
}

function clearUpDeps (effect) {    
    effect.deps.forEach((dep: any) => {
        dep.delete(effect);
    });
    effect.deps.length = 0;
}

export function isTracking () {
    return shouldTrack && activeEffect !== undefined;
}

const targetMap = new Map();
export function track (target, key) {
    if (!isTracking()) return;
    /* target -> key -> dep */
    let depsMap = targetMap.get(target);
    if (!depsMap) {
        depsMap = new Map();
        targetMap.set(target, depsMap);
    }

    let dep = depsMap.get(key);
    if (!dep) {
        dep = new Set();
        depsMap.set(key, dep)
    }
    trackEffects(dep);
}

export function trackEffects (dep) {
    if (dep.has(activeEffect) || !activeEffect) return;
    dep.add(activeEffect)
    activeEffect.deps.push(dep);
}

export function trigger (target, key) {
    let depsMap = targetMap.get(target);
    if (!depsMap) return;
    let dep = depsMap.get(key);
    triggerEffects(dep);
}

export function triggerEffects (dep) {
    // debugger
    if (!dep) return;
    const effects = isArray(dep) ? dep : [...dep];
    for (const effect of effects) {
        effect.scheduler ? effect.scheduler() : effect.run();
    }
    // dep.forEach(effect => {
    //     effect.scheduler ? effect.scheduler() : effect.run();        
    // })
}

export function effect (fn, options: any = {})  {
    const _effect = new ReactiveEffect(fn, options.scheduler);
    // _effect.onStop = options.onStop;
    // Object.assign(_effect, options);
    extend(_effect, options);
    _effect.run();
    const runner: any = _effect.run.bind(_effect);
    runner.effect = _effect;
    return runner;
}

export function stop (runner) {
    runner.effect.stop();
}