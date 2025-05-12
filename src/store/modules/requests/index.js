import requestsMutations from "./mutations.js";
import requestsActions from "./actions.js";
import requestsGetters from "./getters.js";

export default {
  namespaced: true,
  state() {},
  mutations: requestsMutations,
  actions: requestsActions,
  getters: requestsGetters,
};
