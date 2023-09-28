<template>
    <div class="container py-5 px-4">
     <div class="row rounded-lg overflow-hidden shadow">
       <!-- Users box-->
       <!-- Chat Box-->
       <div class="col px-0">
         <div class="px-4 py-5 chat-box bg-white">
           <!-- Sender Message-->

           <div class="media w-50 mb-3" v-for="mensaje in mensajes" :key="mensaje.id">
            <img src="https://therichpost.com/wp-content/uploads/2020/06/avatar2.png" alt="user" width="50" class="rounded-circle">
            <small class="text-muted mx-3">{{ mensaje.nombre }}</small>
             <div class="media-body ml-3 mt-2">
               <div class="bg-light rounded py-2 px-3 mb-2">
                 <p class="text-small mb-0 text-muted">{{mensaje.mensaje}}</p>
               </div>
             </div>
           </div>


         </div>
         <!-- Typing area -->
         <form action="#" class="bg-light">
           <div class="input-group">
             <input type="text" v-model="mensaje" placeholder="Escribe un nuevo mensaje" aria-describedby="button-addon2" class="form-control rounded-0 border-0 py-4 bg-light">
             <div class="input-group-append">
               <button id="button-addon2" type="button" class="btn btn-link" v-on:click="crearMensaje"> <i class="fa fa-paper-plane"></i></button>
             </div>
           </div>
         </form>
       </div>
     </div>
   </div>
</template>


<script>
export default {
    data() {
        return {
            mensajes: [],
            mensaje: "",
            URL_LISTAR: "http://localhost:3000/api/foros/",
            URL_CREAR: "http://localhost:3000/api/foros/crear/mensaje/",
        }
    },
    created: function () {
        this.cargarMensajes();
    },
    methods: {
        cargarMensajes(){
            this.axios.get(this.URL_LISTAR + this.$route.params.id, {
                headers: {
                    'x-access-token': this.$store.getters.getUserToken
                }
            })
            .then(response => {
                this.mensajes = response.data;
                console.log(this.mensajes)
            })
        },
        crearMensaje(){
            if(this.mensaje.trim() != ""){
                this.axios.post(this.URL_CREAR + this.$route.params.id, {
                mensaje: this.mensaje
                }, {
                    headers: {
                        'x-access-token': this.$store.getters.getUserToken
                    }
                })
                .then(response => {
                    this.mensaje = "";
                    this.cargarMensajes();
                })
            }
        }
    }
}


</script>