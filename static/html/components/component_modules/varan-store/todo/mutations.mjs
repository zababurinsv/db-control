export const setLoadedTodos = (state, payload) => {
  state.loadedTodos = payload
  // console.log('(todo[(action)loadTodos ===])todo[(mutations)payload]', payload)
}
export const setLoadedInProgress = (state, payload) => {
  // console.log('(toDoG[(mutation*)setLoadedInProgressG])', payload)
  state.loadedInProgress = payload
}
export const setLoadedInDone = (state, payload) => {
  state.loadedInDone = payload
  // console.log('(setLoadedProgress[(mutation*)trello])', state.loadedInDone)
}
export const createTodo = (state, payload) => {
  state.loadedTodos.push(payload)
}
export const createProgress = (state, payload) => {
  state.loadedInProgress.push(payload)
}
export const createDone = (state, payload) => {
  state.loadedInDone.push(payload)
}
export const updateTodo = (state, payload) => {
  const todo = state.loadedTodos.find(todo => {
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
export const updateProgress = (state, payload) => {
  const todo = state.loadedInProgress.find(todo => {
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
export const updateDone = (state, payload) => {
  const todo = state.loadedInDone.find(todo => {
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
export const deleteTodo = (state, payload) => {
  // console.log('todoG(mutations)deleteTodoG', state, payload)
  const record = state.loadedTodos.find(element => element.id === payload.id)
  state.loadedTodos.splice(state.loadedTodos.indexOf(record), 1)
}
export const deleteProgress = (state, payload) => {
  // console.log('todoG(mutations)deleteProgressG', state, payload)
  const record = state.loadedInProgress.find(element => element.id === payload.id)
  // console.log('todoG(mutations)deleteProgressG', record)
  state.loadedInProgress.splice(state.loadedInProgress.indexOf(record), 1)
}
export const deleteDone = (state, payload) => {
  // console.log('deleteDone(state)payload', state, payload)
  const record = state.loadedInDone.find(element => element.id === payload.id)
  state.loadedInDone.splice(state.loadedInDone.indexOf(record), 1)
}
