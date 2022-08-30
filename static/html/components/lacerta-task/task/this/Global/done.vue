<template>
  <div>
    <details open v-for="Done in inDone" :key="Done.id" class="microservices">
      <summary><h2>Выполнено {{ Done.date | date }}</h2></summary>
      <div class="manifest">
        <div class ="read">
          <textarea v-html="Done.description " class ="readTxt" readonly autofocus maxlength="140" name="comment"></textarea>
        </div>
      </div>
      <navi v-bind:id="Done.id" v-on:remove="removeFromList" v-on:next="nextState" ></navi>
    </details>
  </div>
</template>
<script >
  /* eslint-disable no-trailing-spaces */
  import Navi from '../../Model/Microservices/Navigation/index.vue'
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
    components: {Navi},
    computed: {
      user () {
        // console.log('(a[(SystemG)this.$store.getters.user])', this.$store.getters.user)
        return this.$store.getters.user
      },
      inDone () {
        // console.log('(a[(SystemG)this.$store.getters.featuredInDoneG])', this.$store.getters.featuredInDoneG)
        return this.$store.getters.featuredInDoneG
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
      removeFromList (id) {
        // console.log('Global[(done)removeFromList]', id)
        this.$store.dispatch('removeDoneG', id)
      },
      nextState (id) {
        // console.log('Global[(done)nextState]', id)
        this.$store.dispatch('toHistoryG', id)
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import '../../../../../static/css/white/index.scss';
</style>

