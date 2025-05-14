<template>
  <base-dialog :show="!!error" title="An error occurred!" @close="handleError">
    <p>{{ error }}</p>
  </base-dialog>
  <section>
    <base-card>
      <div class="controls">
        <base-button mode="outline" @click="fetchRequests(true)"
          >Refresh</base-button
        >
        <h2>Requests Received</h2>
      </div>
      <div v-if="isLoading">
        <base-spinner></base-spinner>
      </div>
      <ul v-else-if="hasRequests && !isLoading">
        <request-item
          v-for="req in requests"
          :key="req.id"
          :email="req.userEmail"
          :message="req.message"
        ></request-item>
      </ul>
      <h3 v-else>You haven't received any requests yet!</h3>
    </base-card>
  </section>
</template>

<script>
import { mapGetters } from "vuex";
import RequestItem from "@/components/requests/RequestItem.vue";
import BaseSpinner from "@/components/ui/BaseSpinner.vue";

export default {
  components: {
    RequestItem,
    BaseSpinner,
  },
  data() {
    return {
      isLoading: false,
      error: null,
    };
  },
  computed: {
    ...mapGetters("requests", ["requests"]),
    ...mapGetters("requests", ["hasRequests"]),
  },
  created() {
    this.fetchRequests();
  },
  methods: {
    async fetchRequests(refresh = false) {
      this.isLoading = true;
      try {
        await this.$store.dispatch("requests/fetchRequests", {
          forceRefresh: refresh,
        });
      } catch (error) {
        this.error = error.message || "Something went wrong!";
        console.log(error);
      }
      this.isLoading = false;
    },
    handleError() {
      this.error = null;
    },
  },
};
</script>

<style scoped>
ul {
  list-style: none;
  margin: 2rem auto;
  padding: 0;
  max-width: 30rem;
}

h3 {
  text-align: center;
}

.controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  position: relative;
}

.controls h2 {
  margin: 0;
  text-align: center;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  pointer-events: none;
}
</style>
