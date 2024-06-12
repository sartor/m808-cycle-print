import { ref } from 'vue'

export default {
  setup() {
    const count = ref(5)
    return { count }
  },
  methods: {
    process() {
        this.count = 20
    }
  }
}