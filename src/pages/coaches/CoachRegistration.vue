<template>
  <div>
    <section>
      <base-card>
        <h2>Registr as a coach now!</h2>
        <coach-form @save-data="saveData"></coach-form>
      </base-card>
    </section>
  </div>
</template>

<script>
import CoachForm from "@/components/coaches/CoachForm.vue";

export default {
  components: {
    CoachForm,
  },
  methods: {
    async saveData(data) {
      try {
        await this.$store.dispatch("coaches/registerCoach", data);
        this.$router.replace("/coaches");
      } catch (error) {
        // Error is already handled in the form component
      }
    },
  },
};
</script>
