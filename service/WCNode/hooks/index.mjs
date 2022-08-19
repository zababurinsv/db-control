const diff = (a, b) => {
    return a.filter(function(i){return b.indexOf(i) < 0;});
};

export const hooks = (() => {
    let hooks = [], currentHook = 0, isNextTick = false// array of hooks, and an iterator!
    return {
        async init(Component, self = false) {
            const Comp = await Component(self)
            currentHook = 0
            return Comp
        },
        async render(Component) {
            const Comp = {
                state: await Component()
            };
            currentHook = 0;
            return isNextTick ? (isNextTick = false, (await Comp.state.update())) : Comp;
        },
        async useEffect(callback, depArray) {
            const hasNoDeps = !Array.isArray(depArray)
            const deps = hooks[currentHook] // type: array | undefined
            const hasChangedDeps = deps ? !depArray.every((el, i) => {
                    return (Array.isArray(el) && Array.isArray(deps[i]))
                        ? diff(el, deps[i]).length === 0
                        : el === deps[i]
                }
            ) : depArray.length === 0

            if (hasNoDeps || hasChangedDeps) {
                isNextTick = true
                await callback()
            }
            hooks[currentHook] = depArray
            currentHook++
        },
        useState(initialValue) {
            hooks[currentHook] = hooks[currentHook] || initialValue // type: any
            const setStateHookIndex = currentHook // for setState's closure!
            const setState = newState => (hooks[setStateHookIndex] = newState)
            return [hooks[currentHook++], setState]
        },
        useRef(initialValue) {
            if(hooks[currentHook] === undefined) {
                hooks[currentHook] = document.querySelector(`[data-ref=${initialValue}]`)
            }
            const setStateHookIndex = currentHook
            currentHook++
            return hooks[setStateHookIndex]
        }
    }
})()
