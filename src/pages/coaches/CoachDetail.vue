<template>
  <div>
    <div v-if="isLoading">
      <base-spinner></base-spinner>
    </div>
    <base-card v-else-if="error">
      <div>
        <h2>Coach not Found!</h2>
        <h4>
          Maybe check out all our
          <router-link to="/coaches">coaches</router-link>.
        </h4>
      </div>
    </base-card>
    <div v-else>
      <section>
        <base-card>
          <h2>{{ fullName }}</h2>
          <h3>${{ rate }}/hour</h3>
        </base-card>
      </section>
      <section>
        <base-card>
          <header>
            <h2>Interested? Reach out now!</h2>
            <base-button link :to="contactLink">Contact</base-button>
          </header>
          <router-view></router-view>
        </base-card>
      </section>
      <section>
        <base-card>
          <base-badge
            v-for="area in areas"
            :key="area"
            :type="area"
            :title="area"
          ></base-badge>
          <p>{{ description }}</p>
        </base-card>
      </section>
    </div>
  </div>
</template>

<script>
import router from "@/router";

export default {
  props: ["id"],
  data() {
    return {
      selectedCoach: null,
      isLoading: false,
      error: null,
    };
  },
  created() {
    this.loadCoach();
  },
  methods: {
    async loadCoach() {
      this.isLoading = true;
      try {
        // First try to get from current store state
        this.selectedCoach = this.$store.getters["coaches/coaches"].find(
          (coach) => coach.id === this.id
        );

        // If not found, try to load coaches from server
        if (!this.selectedCoach) {
          await this.$store.dispatch("coaches/loadCoaches");
          this.selectedCoach = this.$store.getters["coaches/coaches"].find(
            (coach) => coach.id === this.id
          );

          if (!this.selectedCoach) {
            this.error = "Coach not found!";
          }
        }
      } catch (error) {
        this.error = error.message || "Something went wrong!";
      }
      this.isLoading = false;
    },
  },
  computed: {
    fullName() {
      if (!this.selectedCoach) return "Coach not found";
      return this.selectedCoach.firstName + " " + this.selectedCoach.lastName;
    },
    contactLink() {
      return this.$route.path + "/contact";
    },
    rate() {
      if (!this.selectedCoach) return 0;
      return this.selectedCoach.hourlyRate;
    },
    areas() {
      if (!this.selectedCoach) return [];
      return this.selectedCoach.areas;
    },
    description() {
      if (!this.selectedCoach) return "No description available";
      return this.selectedCoach.description;
    },
  },
};
</script>
