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
             <div class="media-body ml-3 mt-2 d-flex gap-2 align-items-center">
               <div class="bg-light rounded py-2 px-3 mb-2" v-if="mensaje.mensaje != ''">
                 <p class="text-small mb-0 text-muted">{{mensaje.mensaje}}</p>
               </div>
                <button @click="deleteMessage(mensaje.id)" type="button" class="border-0 bg-transparent">
                  <span class="material-symbols-outlined" @click="deleteMessage(mensaje.id)"> delete </span>
                </button>
             </div>
            <div v-if="mensaje.imagen != ''">
              <img :src="mensaje.imagen" alt="Chat Message Image"/>
            </div>
           </div>


         </div>
         <!-- Typing area -->
         <form action="#" class="bg-light">
           <div class="px-2 pt-2 items-center d-grid text-secondary" v-if="selectedFile != null">Imagen Seleccionada: {{ selectedFile.name }}</div>
           <div class="input-group">
             <input type="text" v-model="mensaje" placeholder="Escribe un nuevo mensaje" aria-describedby="button-addon2" class="form-control rounded-0 border-0 py-4 bg-light">
             <div class="input-group-append d-grid">
               <button id="button-addon2" type="button" class="btn btn-link" v-on:click="crearMensaje"> <i class="fa fa-paper-plane"></i></button>
               <label for="image" id="button-addon2" class="btn btn-link" > <i class="fa fa-camera"></i></label>
               <input type="file" name="image" id="image" class="d-none" @change="changeFile">
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
            data: new FormData(),
            selectedFile: null,
            URL_LISTAR: "http://localhost:3000/api/foros/",
            URL_CREAR: "http://localhost:3000/api/foros/crear/mensaje/",
            URL_ELIMINAR: "http://localhost:3000/api/foros/delete/mensaje/",
        }
    },
    created: function () {
        this.cargarMensajes();
    },
    methods: {
        changeFile(event){
            this.selectedFile = event.target.files[0]
        },

        cargarMensajes(){
            this.axios.get(this.URL_LISTAR + this.$route.params.id, {
                headers: {
                    'x-access-token': this.$store.getters.getUserToken
                }
            })
            .then(response => {
                this.mensajes = response.data;
            })
        },

        deleteMessage(id){
          this.axios.post(this.URL_ELIMINAR + id, {}, {
                    headers: {
                        'x-access-token': this.$store.getters.getUserToken
                    }
                })
                .then(response => {
                    this.cargarMensajes();
                })
        },

        crearMensaje(){
            this.data.delete('mensaje')
            this.data.delete('imagen')
            this.data.append('mensaje', this.mensaje)
            this.data.append('imagen', this.selectedFile)
            if(this.mensaje.trim() != "" || this.selectedFile != null){
                this.axios.post(this.URL_CREAR + this.$route.params.id, this.data, {
                    headers: {
                        'x-access-token': this.$store.getters.getUserToken
                    }
                })
                .then(response => {
                    this.mensaje = "";
                    this.cargarMensajes();
                })
                .catch(error => {
                  this.$swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: error.response.data.message || 'Error al crear el mensaje',
                  })
                });
            }
        }
    }
}


</script>