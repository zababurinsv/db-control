export const setLoadedTodosG = (state, payload) => {
  state.loadedTodosG = payload
  // console.log('(todo[(action)loadTodos ===])todo[(mutations)payload]', payload)
}
export const setLoadedInProgressG = (state, payload) => {
  // console.log('(toDoG[(mutation*)setLoadedInProgressG])', payload)
  state.loadedInProgressG = payload
}
export const setLoadedInDoneG = (state, payload) => {
  state.loadedInDoneG = payload
  // console.log('(setLoadedProgress[(mutation*)trello])', state.loadedInDone)
}
export const createTodoG = (state, payload) => {
  state.loadedTodosG.push(payload)
}
export const createProgressG = (state, payload) => {
  state.loadedInProgressG.push(payload)
}
export const createDoneG = (state, payload) => {
  state.loadedInDoneG.push(payload)
}
export const updateTodoG = (state, payload) => {
  const todo = state.loadedTodosG.find(todo => {
    return todo.id === payload.id
  })
  if (payload.title) {
    todo.title = payload.title
  }
  if (payload.description) {
    todo.description = payload.description
  }
  if (payload.date) {
    todo.date = payload.date
  }
}
export const updateProgressG = (state, payload) => {
  const todo = state.loadedInProgressG.find(todo => {
    return todo.id === payload.id
  })
  if (payload.title) {
    todo.title = payload.title
  }
  if (payload.description) {
    todo.description = payload.description
  }
  if (payload.date) {
    todo.date = payload.date
  }
}
export const updateDoneG = (state, payload) => {
  const todo = state.loadedInDoneG.find(todo => {
    return todo.id === payload.id
  })
  if (payload.title) {
    todo.title = payload.title
  }
  if (payload.description) {
    todo.description = payload.description
  }
  if (payload.date) {
    todo.date = payload.date
  }
}
export const deleteTodoG = (state, payload) => {
  // console.log('todoG(mutations)deleteTodoG', state, payload)
  const record = state.loadedTodosG.find(element => element.id === payload.id)
  state.loadedTodosG.splice(state.loadedTodosG.indexOf(record), 1)
}
export const deleteProgressG = (state, payload) => {
  // console.log('todoG(mutations)deleteProgressG', state, payload)
  const record = state.loadedInProgressG.find(element => element.id === payload.id)
  // console.log('todoG(mutations)deleteProgressG', record)
  state.loadedInProgressG.splice(state.loadedInProgressG.indexOf(record), 1)
}
export const deleteDoneG = (state, payload) => {
  // console.log('deleteDone(state)payload', state, payload)
  const record = state.loadedInDoneG.find(element => element.id === payload.id)
  state.loadedInDoneG.splice(state.loadedInDoneG.indexOf(record), 1)
}
