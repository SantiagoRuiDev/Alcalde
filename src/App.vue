<script>
import Navbar from "./components/Navbar.vue";
import LoggedBar from "./components/LoggedBar.vue";
import AdminBar from "./components/AdminBar.vue";
import Footer from './components/Footer.vue';
import axios from 'axios';
import * as Tools from './env.js'
const SERVER = Tools.STATUS ? Tools.API : Tools.DEV;
export default {
    components: {
        Navbar,
        LoggedBar,
        AdminBar,
        Footer
    },
    data() {
        return {
            auth: false,
            userToken: this.$store.getters.getUserToken,
            rol: this.$store.getters.getUserRol,
            admin: false
        }
    },
    created() {{
            if(this.userToken){
                const url = SERVER + '/api/usuario/sesion';
                const headers = { 'x-access-token': this.userToken }
                axios.post(url, {}, { headers })
                    .then(response => {
                        if(response.data.status){
                            this.auth = true;
                            this.getAdminSesion();
                        }
                    })
                    .catch(err => {
                        if(!err.response.data.status){
                            this.auth = false;
                            this.$store.commit('logout');
                        }
                    });
            }
            this.isBanned();
    }},
    methods: {
        isBanned(){
            if(!this.userToken) return;
            const url = SERVER + '/api/usuario/banned';
            const headers = { 'x-access-token': this.userToken }
            axios.get(url, { headers })
                .then(response => {
                    if(response.data.banned){
                        const Toast = this.$swal.mixin({
                            toast: true,
                            position: "top-end",
                            showConfirmButton: false,
                            timerProgressBar: true,
                            didOpen: (toast) => {
                                toast.onmouseenter = this.$swal.stopTimer;
                                toast.onmouseleave = this.$swal.resumeTimer;
                            }
                            });
                            Toast.fire({
                            icon: "info",
                            title: "Tu cuenta esta baneada, no puedes realizar acciones."
                            });
                    }
                })
                .catch(err => {
                    console.log(err.response.data)
                });
        },
        getAdminSesion(){
            this.admin = this.rol == 'admin' || this.rol == 'superadmin' ? true : false;
        }
    }
}



</script>

<template>
  <Navbar v-if="!auth"/>
  <LoggedBar v-if="auth && !admin"/>
  <AdminBar v-if="admin && auth"/>

  
  <div class="container my-2 min-vh-100">
      <div class="row">
          <div class="col-lg-12">
              <RouterView />
          </div>
      </div>
  </div>

  <Footer></Footer>
</template>
