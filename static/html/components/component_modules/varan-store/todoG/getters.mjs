export const featuredTodosG = (state, getters) => {
  // console.log('(todoG[(getters*)featuredTodosG])', state, getters)
  return getters.loadedTodosG
}
export const loadedTodosG = (state) => {
  return state.loadedTodosG.sort((todoA, todoB) => {
    // console.log('(todoG[(getters*)loadedTodosG])', todoA.date)
    return todoA.date > todoB.date
  })
}
export const featuredInProgressG = (state, getters) => {
  // console.log('(featuredInProgress[(getters*)Trello])', state, getters)
  return getters.loadedInProgressG
}
export const featuredInDoneG = (state, getters) => {
  // console.log('(featuredInDone[(getters*)Trello])', state, getters)
  return getters.loadedInDoneG
}

export const loadedInProgressG = (state) => {
  return state.loadedInProgressG.sort((todoA, todoB) => {
    return todoA.date > todoB.date
  })
}
export const loadedInDoneG = (state) => {
  return state.loadedInDoneG.sort((todoA, todoB) => {
    return todoA.date > todoB.date
  })
}

export const loadedTodoG = (state) => {
  return (todoId) => {
    return state.loadedTodosG.find((todo) => {
      return todo.id === todoId
    })
  }
}
export const loadedProgressG = (state) => {
  return (todoId) => {
    return state.loadedInProgressG.find((todo) => {
      return todo.id === todoId
    })
  }
}
export const loadedDoneG = (state) => {
  return (todoId) => {
    return state.loadedInDoneG.find((todo) => {
      return todo.id === todoId
    })
  }
}
export const stateTodoG = (state) => {
  return state
}
