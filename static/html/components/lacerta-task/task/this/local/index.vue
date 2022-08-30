<template>
  <div>
    <details open class="microservices">
      <summary><h2>Добавить задание</h2></summary>
      <div class="manifest">
        <form @submit.prevent="onCreateTodo">
              <textarea
                      v-model="description"
                      class="toDo"
                      autofocus maxlength="140"
                      placeholder="Добавить дазание"
                      name="comment"
                      cols="40"
                      rows="3">
              </textarea>
          <v-btn
                  class="primary"
                  :disabled="!formIsValid"
                  type="submit">Создать задание</v-btn>
        </form>
      </div>
    </details>
    <div class="todo">
      <v-flex xs6="xs6" sm4="sm4" md4="md4">
        <v-card tile="tile">
          <v-card-title>Задание</v-card-title>
          <to-do></to-do>
        </v-card>
      </v-flex>
      <v-flex xs6="xs6" sm4="sm4" md4="md4">
        <v-card tile="tile">
          <v-card-title>Процесс</v-card-title>
          <InProgress></InProgress>
        </v-card>
      </v-flex>
      <v-flex xs6="xs6" sm4="sm4" md4="md4">
        <v-card tile="tile">
          <v-card-title>Выполненно</v-card-title>
          <done></done>
        </v-card>
      </v-flex>
    </div>
  </div>
</template>
<script >
  /* eslint-disable no-undef,indent,no-trailing-spaces */
  import ToDo from './to-do.vue'
  import InProgress from './inProgress.vue'
  import Done from './done.vue'
  import CreateTask from '../Model/Microservices/CreateTask/index.vue'

  export default {
    data () {
      return {
        // title: '',
        // location: '',
        // imageUrl: '',
        // image: null
        description: '',
        date: new Date(),
        time: new Date()
      }
      },
      components: {
        ToDo,
        InProgress,
        Done,
        CreateTask
      },
    computed: {
      user () {
        console.log('(a[(SystemG)this.$store.getters.user])', this.$store.getters.user)
        return this.$store.getters.user
      },
      loading () {
        return this.$store.getters.loading
      },
      todos () {
          console.log('(a[(SystemG)this.$store.getters.featuredTodosG])', this.$store.getters.featuredTodosG)
        return this.$store.getters.featuredTodosG
      },
      formIsValid () {
        return this.description !== ''
      },
      submittableDateTime () {
        const date = new Date(this.date)
        if (typeof this.time === 'string') {
          let hours = this.time.match(/^(\d+)/)[1]
          const minutes = this.time.match(/:(\d+)/)[1]
          date.setHours(hours)
          date.setMinutes(minutes)
        } else {
          date.setHours(this.time.getHours())
          date.setMinutes(this.time.getMinutes())
        }
        return date
      }
    },
    methods: {
      onCreateTodo () {
        if (!this.formIsValid) {
          return
        }
        const todoData = {
          // title: this.title,
          // location: this.location,
          // image: this.image,
          description: this.description,
          date: this.submittableDateTime
        }
        this.$store.dispatch('createTodo', todoData)
        this.description = ''
        return this.$store.getters.featuredTodosG
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import '../../../../../../static/css/white/index';
.todo
{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 96%;
  div
  {
    align-self: start;
  }
}

</style>
