import Vuex from "vuex";


export default new Vuex.Store({
  state: {
    token: localStorage.getItem("token") || null,
  },
  mutations: {
    logout(state) {
      localStorage.removeItem("token");
      location.reload();
    },
    setToken(state, newToken) {
      localStorage.removeItem("token");
      localStorage.setItem("token", newToken);
      location.reload();
    },
  },
  actions: {},
  getters: {
    getUserToken(state){
      return state.token;
    },
    isLoggedIn(state) {
      return !!state.token;
    },
  },
});