export const featuredTodos = (state, getters) => {
  // console.log('(todoG[(getters*)featuredTodos])', state, getters)
  return getters.loadedTodos
}
export const loadedTodos = (state) => {
  return state.loadedTodos.sort((todoA, todoB) => {
    // console.log('(todoG[(getters*)loadedTodos])', todoA.date)
    return todoA.date > todoB.date
  })
}
export const featuredInProgress = (state, getters) => {
  // console.log('(featuredInProgress[(getters*)Trello])', state, getters)
  return getters.loadedInProgress
}
export const featuredInDone = (state, getters) => {
  // console.log('(featuredInDone[(getters*)Trello])', state, getters)
  return getters.loadedInDone
}

export const loadedInProgress = (state) => {
  return state.loadedInProgress.sort((todoA, todoB) => {
    return todoA.date > todoB.date
  })
}
export const loadedInDone = (state) => {
  return state.loadedInDone.sort((todoA, todoB) => {
    return todoA.date > todoB.date
  })
}

export const loadedTodo = (state) => {
  return (todoId) => {
    return state.loadedTodos.find((todo) => {
      return todo.id === todoId
    })
  }
}
export const loadedProgress = (state) => {
  return (todoId) => {
    return state.loadedInProgress.find((todo) => {
      return todo.id === todoId
    })
  }
}
export const loadedDone = (state) => {
  return (todoId) => {
    return state.loadedInDone.find((todo) => {
      return todo.id === todoId
    })
  }
}
export const stateTodo = (state) => {
  return state
}
