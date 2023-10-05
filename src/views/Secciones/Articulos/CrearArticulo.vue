<script>
export default {
  data() {
    return {
      articulo: {},
      selectedFile: null,
      URL: 'http://localhost:3000/api/articulos/crear',
      alertaMessage: '',
      alerta: false
    }
  },
  methods: {
    changeHandler(event) {
      // Verifica si event.target.files es una instancia de FileList
      if (event.target.files instanceof FileList) {
        this.selectedFile = Array.from(event.target.files); // Convierte FileList en un array
      }
    },

    createArticulo() {
      let formData = new FormData();
      if (Array.isArray(this.selectedFile)) {
        this.selectedFile.forEach(file => {
          formData.append('images', file);
        })
      formData.append('titulo', this.articulo.titulo);
      formData.append('subtitulo', this.articulo.subtitulo);
      formData.append('descripcion', this.articulo.descripcion);
      
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
}


</script>


<template>
    <div class="container">
        <div class="row justify-content-center align-items-center">
          <div class="col-md-6">
            <div class="card">
              <div class="card-header text-center">
                <h3>Redacta un articulo</h3>
              </div>
              <div class="card-body">
                <form @submit.prevent="createArticulo">
                  <div class="mb-3">
                    <label for="" class="form-label">Titulo</label>
                    <input type="text"
                      class="form-control" v-model="articulo.titulo">
                  </div>
                  <div class="mb-3">
                    <label for="" class="form-label">Subtitulo</label>
                    <input type="text"
                      class="form-control" v-model="articulo.subtitulo">
                  </div>
                  <div class="mb-3">
                    <label for="" class="form-label">Descripcion</label>
                    <textarea class="form-control" name="" id="" rows="3" v-model="articulo.descripcion"></textarea>
                  </div>
                  <div class="mb-3">
                    <label for="image" class="form-label">Sube imagenes</label>
                    <input type="file" multiple class="form-control" name="image" id="image" @change="changeHandler">
                  </div>
                  <small>Nota: La ultima imagen seleccionada sera la portada, recuerda tienes un maximo de 5 imagenes</small>
                  <button type="submit" class="btn btn-primary btn-block w-100 mt-2">Crear articulo</button>
                  <RouterLink to="/articulos" class="btn btn-danger btn-block w-100 mt-2">Regresar</RouterLink>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
</template>