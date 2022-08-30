<template>
    <div>
        <details open v-on:remove="removeFromList" v-for="todo in todos" :key="todo.id" class="microservices">
            <summary><h2>Задание {{ todo.date | date }}</h2></summary>
            <div class="manifest">
                <div class ="read">
                    <textarea v-html="todo.description " class ="readTxt" readonly autofocus maxlength="140" name="comment"></textarea>
                </div>
            </div>
            <navi v-bind:id="todo.id" v-on:remove="removeFromList" v-on:next="nextState" ></navi>
        </details>
    </div>
</template>
<script >
    /* eslint-disable indent */
    import Navi from '../../Model/Microservices/Navigation/index.vue'
    export default {
    data () {
        return {
          pagination: {},
          description: '',
          date: new Date(),
          time: new Date()
        }
    },
  components: {Navi},
    computed: {
        user () {
          // console.log('(a[(SystemG)this.$store.getters.user])', this.$store.getters.user)
          return this.$store.getters.user
        },
        todos () {
        // console.log('Global[(to-do)todos]', this.$store.getters.featuredTodosG)
        return this.$store.getters.featuredTodosG
        // return this.pagination.rowsPerPage ? Math.ceil(this.items.length / this.pagination.rowsPerPage) : 0
        },
        loading () {
          return this.$store.getters.loading
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
            description: this.description,
            date: this.submittableDateTime
          }
          this.$store.dispatch('createTodoG', todoData)
          this.description = ''
          return this.$store.getters.featuredTodosG
        },
        removeFromList (id) {
            // console.log('Global[(to-do)removeFromList]', id)
            this.$store.dispatch('removeTodoG', id)
        },
        nextState (id) {
            // console.log('Global[(to-do)nextState]', id)
            this.$store.dispatch('toProgressG', id)
        }
    }
}
</script>
<style lang="scss" scoped>
    @import '../../../../../static/css/white/index.scss';
</style>
