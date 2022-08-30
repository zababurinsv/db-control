/* eslint-disable no-unused-vars */
// import * as firebase from 'firebase'
import store from '../index'
import req from '../../../system/request/index'
import object from '../../../system/Events/module/promise'
let uniqid = require('uniqid')

export const loadTodos = ({commit}) => {
  commit('setLoading', true)
  console.log('todo[(actions)loadTodos]', store.getters.user)
  req.req[0].setUrl('node0').setTask('getTodosG').setUser(store.getters.user)
  object[0].xArt[0].mySql(req.req[0]).push(req.req[0])
    .then((obj) => {
      console.log('todoG[(actions)]loadTodosG', obj.data)
      commit('setLoadedTodosG', obj.data)
      commit('setLoading', false)
    })
    .catch((error) => {
      console.log(error)
    })
}
export const removeTodo = ({commit}, payload) => {
  commit('setLoading', true)
  console.log('todoG(actions)removeTodoG', payload)
  const remove = {
    key: uniqid(),
    id: payload
  }
  // console.log('todoG[(actions)removeTodoG]', remove)
  req.req[0].setUrl('node0').setTask('removeTodoG').setData(remove)
  object[0].xArt[0].mySql(req.req[0]).push(req.req[0])
    .then((obj) => {
      console.log('todoG[(actions)]removeTodoG', obj.data)
      commit('deleteTodoG', obj.data)
      commit('setLoading', false)
    })
    .catch((error) => {
      console.log(error)
    })
}
export const loadInProgress = ({commit}) => {
  commit('setLoading', true)

  console.log('(Storage[(white)dispatch])todo[(action)loadTodosG]')
  req.req[0].setUrl('node0').setTask('getProgressG').setUser(store.getters.user)
  object[0].xArt[0].mySql(req.req[0]).push(req.req[0])
    .then((obj) => {
      console.log('todoG[(actions)]loadTodosG', obj.data)
      commit('setLoadedInProgressG', obj.data)
      commit('setLoading', false)
    })
    .catch((error) => {
      console.log(error)
    })
}
export const loadInDone = ({commit}) => {
  commit('setLoading', true)
  req.req[0].setUrl('node0').setTask('getDoneG').setUser(store.getters.user)
  object[0].xArt[0].mySql(req.req[0]).push(req.req[0])
    .then((obj) => {
      console.log('todoG[(actions)]loadTodosG', obj.data)
      commit('setLoadedInDoneG', obj.data)
      commit('setLoading', false)
    })
    .catch((error) => {
      console.log(error)
    })
}

export const createTodo = ({commit, getters}, payload) => {
  commit('setLoading', true)
  const todo = {
    key: uniqid(),
    description: payload.description,
    date: payload.date.toISOString(),
    creatorId: getters.user.id
  }
  req.req[0].setUrl('node0').setTask('createTodo').setData(todo).setUser(getters.user)
  object[0].xArt[0].mySql(req.req[0]).push(req.req[0])
    .then((obj) => {
      console.log('todo[(actions)]createTodo', obj.data)
      commit('createTodo', obj.data)
      commit('setLoading', false)
    })
    .catch((error) => {
      console.log(error)
    })
}

export const updateTodoData = ({commit}, payload) => {
  commit('setLoading', true)
  // console.log('updateTodoData(Action)trello', payload)
  // const updateObj = {}
  // if (payload.title) {
  //   updateObj.title = payload.title
  // }
  // if (payload.description) {
  //   updateObj.description = payload.description
  // }
  // if (payload.date) {
  //   updateObj.date = payload.date
  // }
  // firebase.database().ref('todos-g').child(payload.id).update(updateObj)
  //   .then(() => {
  //     commit('setLoading', false)
  //     commit('updateTodoG', payload)
  //   })
  //   .catch(error => {
  //     console.log(error)
  //     commit('setLoading', false)
  //   })
  commit('setLoading', false)
}
export const updateProgressData = ({commit}, payload) => {
  commit('setLoading', true)
  // console.log('updateProgressData(Action)trello', payload)
  const updateObj = {}
  // if (payload.title) {
  //   updateObj.title = payload.title
  // }
  if (payload.description) {
    updateObj.description = payload.description
  }
  if (payload.date) {
    updateObj.date = payload.date
  }
  // firebase.database().ref('inProgress-g').child(payload.id).update(updateObj)
  //   .then(() => {
  //     commit('setLoading', false)
  //     commit('updateProgress', payload)
  //   })
  //   .catch(error => {
  //     console.log(error)
  //     commit('setLoading', false)
  //   })
}
export const updateDoneData = ({commit}, payload) => {
  commit('setLoading', true)
  // console.log('updateDoneData(Action)trello', payload)
  const updateObj = {}
  // if (payload.title) {
  //   updateObj.title = payload.title
  // }
  if (payload.description) {
    updateObj.description = payload.description
  }
  if (payload.date) {
    updateObj.date = payload.date
  }
  // firebase.database().ref('inDone-g').child(payload.id).update(updateObj)
  //   .then(() => {
  //     commit('setLoading', false)
  //     commit('updateDoneG', payload)
  //   })
  //   .catch(error => {
  //     console.log(error)
  //     commit('setLoading', false)
  //   })
}

export const removeProgress = ({commit}, payload) => {
  commit('setLoading', true)
  console.log('todoG(Actions)removeProgressG', payload)
  const remove = {
    key: uniqid(),
    id: payload
  }
  // console.log('todoG[(actions)removeTodoG]', remove)
  req.req[0].setUrl('node0').setTask('removeProgressG').setData(remove)
  object[0].xArt[0].mySql(req.req[0]).push(req.req[0])
    .then((obj) => {
      console.log('todoG[(actions)]removeProgressG', obj.data)
      commit('deleteProgressG', obj.data)
      commit('setLoading', false)
    })
    .catch((error) => {
      console.log(error)
    })
}
export const removeDone = ({commit}, payload) => {
  commit('setLoading', true)
  console.log('todoG(Actions)removeProgressG', payload)
  const remove = {
    key: uniqid(),
    id: payload
  }
  // console.log('todoG[(actions)removeTodoG]', remove)
  req.req[0].setUrl('node0').setTask('removeDoneG').setData(remove)
  object[0].xArt[0].mySql(req.req[0]).push(req.req[0])
    .then((obj) => {
      console.log('todoG[(actions)]removeDoneG', obj.data)
      commit('deleteDoneG', obj.data)
      commit('setLoading', false)
    })
    .catch((error) => {
      console.log(error)
    })
}

export const toProgress = ({commit}, payload) => {
  commit('setLoading', true)
  console.log('todoG[(actions)]toProgressG', payload)
  const progress = {
    key: uniqid(),
    id: payload
  }

  req.req[0].setUrl('node0').setTask('toProgressG').setData(progress)
  object[0].xArt[0].mySql(req.req[0]).push(req.req[0])
    .then((obj) => {
      console.log('todoG[(actions)]toProgressGPromise', obj.data)
      commit('createProgressG', obj.data)
      commit('deleteTodoG', obj.data)
      commit('setLoading', false)
    })
    .catch((error) => {
      console.log(error)
    })
}

export const toDone = ({commit}, payload) => {
  commit('setLoading', true)
  console.log('todoG[(actions)]toProgressG', payload)
  const progress = {
    key: uniqid(),
    id: payload
  }
  req.req[0].setUrl('node0').setTask('toDoneG').setData(progress)
  object[0].xArt[0].mySql(req.req[0]).push(req.req[0])
    .then((obj) => {
      console.log('todoG[(actions)]toDoneG Promise', obj.data)
      commit('createDoneG', obj.data)
      commit('deleteProgressG', obj.data)
      commit('setLoading', false)
    })
    .catch((error) => {
      console.log(error)
    })
}

export const toHistory = ({commit}, payload) => {
  commit('setLoading', true)
  console.log('todoG[(actions)]toHistoryG', payload)
  const progress = {
    key: uniqid(),
    id: payload
  }
  req.req[0].setUrl('node0').setTask('toHistoryG').setData(progress)
  object[0].xArt[0].mySql(req.req[0]).push(req.req[0])
    .then((obj) => {
      console.log('todoG[(actions)]toHistoryG Promise', obj.data)
      // commit('createHistiryG', obj.data)
      commit('deleteDoneG', obj.data)
      commit('setLoading', false)
    })
    .catch((error) => {
      console.log(error)
    })
}
