<script>
export default {
  data() {
    return {
      resena: {},
      selectedFile: null,
      URL: 'http://localhost:3000/api/resenas/crear',
      alertaMessage: ''
    }
  },
  methods: {
    changeHandler (event){
      this.selectedFile = event.target.files[0];
    },
    createResena () {
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
      
      this.axios.post(this.URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-access-token': this.$store.getters.getUserToken
        }
      }).then(response => {
        this.alertaMessage = response.data.message
        this.$swal.fire(
                      'Exito',
                      this.alertaMessage,
                     'success'
                    ).then((result) => {
                      if (result.isConfirmed) {
                          location.reload();
                      }
                      })
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
                    <label for="image" class="form-label">Sube una imagen</label>
                    <input type="file" class="form-control" name="image" id="image" @change="changeHandler">
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