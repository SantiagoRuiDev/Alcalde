<template>
  <div class="card">
    <div class="card-body">
      <form @submit.prevent="createRegla">
        <div class="mb-3">
          <label for="titulo" class="form-label">Nombre</label>
          <input
            type="text"
            class="form-control"
            name="titulo"
            aria-describedby="helpId"
            placeholder="Ej: Reglas Generales de los Foros"
            v-model="nombre"
          />
          <small id="helpId" class="form-text text-muted"
            >Explica cual sera la regla de los foros añadida.</small
          >
        </div>

        <div class="mb-3 d-grid">
          <label for="">Ingresa una descripcion/mensaje</label>
          <textarea
            id="autoColsTextarea"
            class="auto-cols"
            v-model="contenido"
          ></textarea>
        </div>

        <button class="btn btn-primary w-100" type="submit">Crear regla</button>
      </form>
    </div>

    <div class="mt-5 w-75 mx-auto m-3">


      <div class="card p-2 mt-3 shadow-sm d-flex flex-row" v-for="regla in reglas" :key="regla.id">
        <div class="d-grid gap-2">
          <p class="card-title fw-bold">
            {{ regla.nombre }}<span>: #{{ regla.id }}</span>
          </p>
          <p class="card-text">{{ regla.contenido }}</p>
        </div>

        <button
          @click="deleteRegla(regla.id)"
          type="button"
          class="border-0 bg-transparent mx-auto"
        >
          <span
            class="material-symbols-outlined"
          >
            delete
          </span>
        </button>
      </div>


    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      nombre: "",
      contenido: "",
      reglas: [],
      URL: "http://localhost:3000/api/foros/regla/crear",
      URL_ELIMINAR: "http://localhost:3000/api/foros/regla/eliminar/",
      URL_VER: "http://localhost:3000/api/foros/regla",
      loading: false,
    };
  },

  created: function () {
    this.getReglas();
  },

  methods: {
    getReglas() {
      this.axios
        .get(this.URL_VER, {
          headers: {
            "x-access-token": this.$store.getters.getUserToken,
          },
        })
        .then((response) => {
          this.reglas = response.data;
        })
        .catch((err) => {
          return this.$swal.fire('Error', err.response.data.message, 'error');
        });
    },

    deleteRegla(id){
        this.axios
            .post(this.URL_ELIMINAR + id, {}, {
                headers: {
                    "x-access-token": this.$store.getters.getUserToken,
                },
            })
            .then((response) => {
                this.getReglas();
                return this.$swal.fire('Exito', response.data.message, 'success');
            })
            .catch((err) => {
                return this.$swal.fire('Error', err.response.data.message, 'error');
            });
    },

    createRegla() {
      this.loading = true;
      if (this.nombre.trim() == "" || this.contenido.trim() == "")
        return this.$swal.fire(
          "Error",
          "Debes llenar todos los campos",
          "error"
        );

      const data = {
        nombre: this.nombre,
        contenido: this.contenido,
      };

      this.axios
        .post(this.URL, data, {
          headers: {
            "x-access-token": this.$store.getters.getUserToken,
          },
        })
        .then((response) => {
          if (response.data.message)
            this.getReglas();
            return this.$swal.fire("Exito", response.data.message, "success");
        })
        .catch((err) => {
          if (err.response.data.error)
            return this.$swal.fire("Error", err.response.data.error, "error");
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style scoped>
#autoColsTextarea {
  resize: none;
  overflow: hidden;
  width: 100%;
  max-width: 100%;
  height: 100px;
}

@media screen and (max-width: 768px) {
  #autoColsTextarea {
    width: auto;
    white-space: nowrap;
    overflow-x: scroll;
  }
}
</style>
