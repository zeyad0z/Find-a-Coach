import requestsMutations from "./mutations.js";
import requestsActions from "./actions.js";
import requestsGetters from "./getters.js";

export default {
  namespaced: true,
  state() {
    return {
      lastFetch: null,
      requests: [],
    };
  },
  mutations: requestsMutations,
  actions: requestsActions,
  getters: requestsGetters,
};
