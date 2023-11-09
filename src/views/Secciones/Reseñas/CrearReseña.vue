<script>
export default {
  data() {
    return {
      resena: {},
      selectedFile: null,
      URL: 'http://localhost:3000/api/resenas/crear',
      alertaMessage: '',
      carrete: [],
      id: ""
    }
  },
  methods: {
    handleCarrete (event){
      this.carrete = event.target.files;
    },
    changeHandler (event){
      this.selectedFile = event.target.files[0];
    },
    async createResena () {
      let formData = new FormData();
      formData.append('image', this.selectedFile);
      formData.append('marca', this.resena.marca);
      formData.append('modelo', this.resena.modelo);
      formData.append('titulo', this.resena.titulo);
      formData.append('motor', this.resena.motor);
      formData.append('ano', this.resena.ano);
      formData.append('hp', this.resena.hp);
      formData.append('combustible', this.resena.combustible);
      formData.append('transmision', this.resena.transmision);
      formData.append('puertas', this.resena.puertas);
      formData.append('descripcion', this.resena.descripcion);
      formData.append('video', this.resena.video);
      
      await this.axios.post(this.URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-access-token': this.$store.getters.getUserToken
        }
      }).then(response => {
        this.alertaMessage = response.data.message
        this.id = response.data.id
      }).catch(error => {
        this.alertaMessage = error.response.data.error;
        this.$swal.fire(
                      'Error',
                      this.alertaMessage,
                     'error'
                    ).then((result) => {
                      if (result.isConfirmed) {
                          location.reload();
                      }
                      })
      })


      let imageData = new FormData();
      let counter = 0;
      for (let i = 0; i < this.carrete.length; i++) {
        imageData.delete('image');
        imageData.append('image', this.carrete[i]);

        await this.axios.post(`http://localhost:3000/api/resenas/add/image/${this.id}`, imageData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'x-access-token': this.$store.getters.getUserToken
          }
        }).then(response => {
          counter++;
        }).catch(error => {
          this.alertaMessage = error.response.data.error;
        })
      }

      if(counter == this.carrete.length){
        this.$swal.fire(
                      'Exito',
                      this.alertaMessage,
                     'success'
                    ).then((result) => {
                      if (result.isConfirmed) {
                          location.reload();
                      }
                      })
      }
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
                <h3>Registra una reseña</h3>
              </div>
              <div class="card-body">
                <form class="" id="loginForm" @submit.prevent="createResena">
                  <div class="mb-3">
                    <label for="" class="form-label">Titulo</label>
                    <input type="text"
                      class="form-control" aria-describedby="helpId" placeholder="" v-model="resena.titulo">
                  </div>
                  <div class="mb-3">
                    <label for="" class="form-label">Descripcion</label>
                    <input type="text"
                      class="form-control" aria-describedby="helpId" placeholder="" v-model="resena.descripcion">
                  </div>
                  <div class="mb-3">
                    <label for="" class="form-label">Marca</label>
                    <input type="text"
                      class="form-control" aria-describedby="helpId" placeholder="" v-model="resena.marca">
                  </div>
                  <div class="mb-3">
                    <label for="" class="form-label">Modelo</label>
                    <input type="text"
                      class="form-control" aria-describedby="helpId" placeholder="" v-model="resena.modelo">
                  </div>
                  <div class="mb-3">
                    <label for="" class="form-label">Año</label>
                    <input type="text"
                      class="form-control" aria-describedby="helpId" placeholder="" v-model="resena.ano">
                  </div>
                  <div class="mb-3">
                    <label for="" class="form-label">HP</label>
                    <input type="text"
                      class="form-control" aria-describedby="helpId" placeholder="" v-model="resena.hp">
                  </div>
                  <div class="mb-3">
                    <label for="" class="form-label">Tipo de Combustible</label>
                    <input type="text"
                      class="form-control" aria-describedby="helpId" placeholder="" v-model="resena.combustible">
                  </div>
                  <div class="mb-3">
                    <label for="" class="form-label">Puertas</label>
                    <input type="text"
                      class="form-control" aria-describedby="helpId" placeholder="" v-model="resena.puertas">
                  </div>
                  <div class="mb-3">
                    <label for="" class="form-label">Transmision</label>
                    <input type="text"
                      class="form-control" aria-describedby="helpId" placeholder="" v-model="resena.transmision">
                  </div>
                  <div class="mb-3">
                    <label for="" class="form-label">Motor</label>
                    <input type="text"
                      class="form-control" aria-describedby="helpId" placeholder="" v-model="resena.motor">
                  </div>
                  <div class="mb-3">
                    <label for="" class="form-label">Video de Youtube</label>
                    <input type="text"
                      class="form-control" aria-describedby="helpId" placeholder="Incrusta la ID de tu video por ejemplo: U0ZVo4kK3VM" v-model="resena.video">
                  </div>
                  <div class="mb-3">
                    <label for="image" class="form-label">Sube una imagen</label>
                    <input type="file" class="form-control" id="image" @change="changeHandler">
                  </div>
                  <div class="mb-3">
                    <label for="images" class="form-label">Sube imagenes al carrete</label>
                    <input type="file" class="form-control" id="images" multiple @change="handleCarrete">
                  </div>
                  <button type="submit" class="btn btn-primary btn-block w-100 mt-2">Crear reseña</button>
                  <RouterLink to="/res" class="btn btn-danger btn-block w-100 mt-2">Regresar</RouterLink>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
</template>