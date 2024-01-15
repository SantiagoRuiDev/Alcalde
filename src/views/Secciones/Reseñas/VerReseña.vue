<script>
import Spinner from "../../../components/Spinner.vue";
export default {
  components: { Spinner },
  data() {
    return {
      param: "",
      resenas: [],
      URL: "http://localhost:3000/api/resenas/",
      URL_BUSCAR: "http://localhost:3000/api/resenas/buscar/",
      loading: true,
    };
  },
  created: function () {
    this.cargarResenas();
  },
  methods: {
    cargarResenas() {
      this.axios
        .get(this.URL, {
          headers: {
            "x-access-token": this.$store.getters.getUserToken,
          },
        })
        .then((response) => {
          this.resenas = response.data;

          this.loading = response.data.length > 0 ? false : true;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    buscarResena() {
      if (this.param.trim() == "")
        return this.$swal.fire(
          "Error",
          "Ingrese un parametro de busqueda",
          "error"
        );
      this.axios
        .get(this.URL_BUSCAR + this.param, {
          headers: {
            "x-access-token": this.$store.getters.getUserToken,
          },
        })
        .then((response) => {
          this.resenas = response.data;
        })
        .catch((error) => {
          this.$swal.fire("Error", error.response.data.error, "error");
        });
    },
  },
};
</script>

<template>
  <div class="input-group my-3 w-75 mx-auto">
    <input
      type="text"
      class="form-control"
      v-model="param"
      placeholder="Busca una reseña"
    />
    <div class="input-group-append">
      <button
        class="btn btn-secondary"
        type="button"
        v-on:click="buscarResena()"
      >
        <i class="fa fa-search"></i>
      </button>
    </div>
  </div>

  <div class="card-sl my-3 w-75 mx-auto">
    <p class="card-heading">Filtros</p>

    <!-- checkbox -->
    <div class="input-group mt-2 p-2">
      <div class="input-group-text d-flex gap-3">
        <input
          class="form-check-input mt-0"
          type="checkbox"
          id="filtro"
          value=""
          aria-label="Checkbox for following text input"
        />
        <label for="filtro">Filtro de:</label>
      </div>
    </div>
  </div>

  <Spinner v-if="loading" />

  <div class="container">
    <div v-for="resena in resenas" :key="resena.id">
      <div class="card-sl">
        <div class="card-image">
          <img :src="resena.imagen" />
        </div>

        <div class="card-heading">
          {{ resena.titulo }}
        </div>
        <div class="card-text">
          {{ resena.descripcion }}
        </div>
        <div class="card-text">Redactada por: {{ resena.id_usuario }}</div>
        <RouterLink
          :to="{ name: 'reseñaarticulo', params: { id: resena.id } }"
          class="card-button"
          >Revisar reseña</RouterLink
        >
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  width: 85%;
  margin: 0px auto;
  gap: 25px;
}

@media only screen and (max-width: 768px) {
  .container {
    grid-template-columns: 1fr;
  }
}

.card-sl {
  border-radius: 8px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

.card-image img {
  max-height: 100%;
  height: 13rem;
  width: 100%;
  border-radius: 8px 8px 0px 0;
}

.card-action {
  position: relative;
  float: right;
  margin-top: -25px;
  margin-right: 20px;
  z-index: 2;
  color: #e26d5c;
  background: #fff;
  border-radius: 100%;
  padding: 15px;
  font-size: 15px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.2), 0 1px 2px 0 rgba(0, 0, 0, 0.19);
}

.card-action:hover {
  color: #fff;
  background: #e26d5c;
}

.card-heading {
  font-size: 18px;
  font-weight: bold;
  background: #fff;
  padding: 10px 15px;
}

.card-text {
  padding: 10px 15px;
  background: #fff;
  font-size: 14px;
  color: #636262;
}

.card-button {
  display: flex;
  justify-content: center;
  padding: 10px 0;
  width: 100%;
  background-color: #1f487e;
  color: #fff;
  text-decoration: none;
  border-radius: 0 0 8px 8px;
}

.card-button:hover {
  text-decoration: none;
  background-color: #1d3461;
  color: #fff;
}
</style>
