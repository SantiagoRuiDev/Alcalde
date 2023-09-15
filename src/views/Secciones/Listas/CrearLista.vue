<script>
export default {
    data() {
        return {
            resultado: false,
            search: [],
            resenas: [],
            data: new FormData(),
            selectedFile: null,
            param: "",
            lista: {},
            URL_BUSCAR: "http://localhost:3000/api/resenas/buscar/",
        }
    },


    methods: {
        changeHandler (event){
            this.selectedFile = event.target.files[0];
        },
        buscarResena (){
            this.resultado = false
            if(this.param.trim() == '') return this.$swal.fire('Error', 'Ingrese un parametro de busqueda', 'error');
            this.axios.get(this.URL_BUSCAR + this.param, {
                headers: {
                    'x-access-token': this.$store.getters.getUserToken
                }
            }).then(response => {
                this.search = response.data;
                this.resultado = true;
            })
              .catch(error => this.$swal.fire('Error', error.response.data.error, 'error'));
        },
        createLista(){
            this.data.append('titulo', this.lista.titulo);
            this.data.append('subtitulo', this.lista.subtitulo);
            this.data.append('image', this.selectedFile);
            let resenas = JSON.stringify(this.resenas);
            this.data.append('resenas', resenas);

            if(this.lista.titulo.trim() == '' || this.lista.subtitulo.trim() == ''|| this.selectedFile == null || this.resenas == []) return this.$swal.fire('Error', 'Ingrese todos los campos', 'error');
           
            this.axios.post('http://localhost:3000/api/listas/crear', this.data, {
                headers: {
                    'x-access-token': this.$store.getters.getUserToken
                }
            }).then(response => {
                          this.$swal.fire('Exito', response.data.message, 'success');
            }).catch(error => {
                this.$swal.fire('Error', error.response.data.error, 'error');
            });
        },
        addToList(id){
            this.resenas.push(id);
            this.resultado = false;
            this.param = "";

            const Toast = this.$swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.addEventListener('mouseenter', Swal.stopTimer)
                  toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
              })

              Toast.fire({
                icon: 'success',
                title: 'Coche añadido a la lista'
              })
        }
    }
}
</script>

<template>
    <div class="container">
        <div class="row justify-content-center align-items-center">
          <div class="col-md-6">
            <div class="card">
              <div class="card-header text-center">
                <h3>Crea una lista</h3>
              </div>
              <div class="card-body">
                <form @submit.prevent="createLista">
                  <div class="mb-3">
                    <label for="" class="form-label">Titulo</label>
                    <input type="text"
                      class="form-control" v-model="lista.titulo">
                  </div>
                  <div class="mb-3">
                    <label for="" class="form-label">Subtitulo</label>
                    <input type="text"
                      class="form-control" v-model="lista.subtitulo">
                  </div>
                  <div class="mb-3">
                    <label for="" class="form-label">Coches</label>
                    <div class="input-group">
                        <input type="text" class="form-control" v-model="param" placeholder="Busca coches para la lista">
                        <div class="input-group-append">
                        <button class="btn btn-secondary" type="button" v-on:click="buscarResena()">
                            <i class="fa fa-search"></i>
                        </button>
                        </div>
                    </div>

                    <div v-if="resultado">
                        <div class="card mt-2" v-for="resena in search" :key="resena.id">
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-md-4 d-grid align-items-center">
                                        <img :src="resena.imagen" alt="" class="img-fluid">
                                    </div>
                                    <div class="col-md-8 text-center mx-auto">
                                        <h5>{{ resena.titulo }}</h5>
                                        <p>Rating: {{ resena.calificaciones }}</p>
                                        <button class="btn btn-primary w-100" type="button" v-on:click="addToList(resena.id)">Agregar</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                  </div>
                  <div class="mb-3">
                    <label for="image" class="form-label">Sube una imagen</label>
                    <input type="file" class="form-control" name="image" id="image" v-on:change="changeHandler">
                  </div>
                  <button type="submit" class="btn btn-primary btn-block w-100 mt-2">Crear lista</button>
                  <RouterLink to="/listas" class="btn btn-danger btn-block w-100 mt-2">Regresar</RouterLink>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
</template>