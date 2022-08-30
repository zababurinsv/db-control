const diff = (a, b) => {
  return a.filter(function(i){return b.indexOf(i) < 0;});
};

export const node = (() => {
  let self = undefined
  let hooks = [], currentHook = 0 // array of hooks, and an iterator!
  return {
    render(Component, mount) {
      if(mount) self = mount
      const Comp = Component(self) // run effects
      Comp.render()
      currentHook = 0 // reset for next render
      return Comp
    },
    useEffect(callback, depArray) {
      const hasNoDeps = !Array.isArray(depArray)
      const deps = hooks[currentHook] // type: array | undefined

      const hasChangedDeps = deps ? !depArray.every((el, i) => {
        return (Array.isArray(el) && Array.isArray(deps[i]))
          ? diff(el, deps[i]).length === 0
          : el === deps[i]
        }
      ) : depArray.length === 0

      if (hasNoDeps || hasChangedDeps) {
        callback()
      }
      hooks[currentHook] = depArray
      currentHook++
    },
    useState(initialValue) {
      hooks[currentHook] = hooks[currentHook] || initialValue // type: any
      const setStateHookIndex = currentHook // for setState's closure!
      const setState = newState => (hooks[setStateHookIndex] = newState)
      return [hooks[currentHook++], setState]
    }
  }
})()