<script>
import Spinner from "../../../components/Spinner.vue";
export default {
  components: { Spinner },
  data() {
    return {
      param: "",
      resenas: [],
      rawResenas: [],
      rawDetalles: [],
      rawChasis: [],
      filtros: {
        precio: "",
        etiqueta: "",
        altura_piso: "",
        ancho: "",
        largo: "",
      },
      URL: "http://localhost:3000/api/resenas/",
      URL_BUSCAR: "http://localhost:3000/api/resenas/buscar/",
      loading: true,
    };
  },
  created: function () {
    this.cargarResenas();
  },
  methods: {


    filtrar(){
      let resenas = this.resenas;

      // Filtrar por precio
      if(this.filtros.precio != ""){
        resenas = resenas.filter(resena => {
          return resena.detalles[0].precioIni <= this.filtros.precio && resena.detalles[0].precioFin >= this.filtros.precio;
        });
      }

      // Filtrar por etiqueta // Las etiquetas estan divididas por comas, por lo que se debe buscar si el string contiene la etiqueta
      if(this.filtros.etiqueta != ""){
        resenas = resenas.filter(resena => {
          return resena.detalles[0].etiqueta.toLowerCase().includes(this.filtros.etiqueta.toLowerCase());
        });
      }

      // Filtrar por altura del piso
      if(this.filtros.altura_piso != ""){
        resenas = resenas.filter(resena => {
          return resena.chasis[0].altura_piso == this.filtros.altura_piso;
        });
      }

      // Filtrar por ancho
      if(this.filtros.ancho != ""){
        resenas = resenas.filter(resena => {
          return resena.chasis[0].ancho == this.filtros.ancho;
        });
      }

      // Filtrar por largo
      if(this.filtros.largo != ""){
        resenas = resenas.filter(resena => {
          return resena.chasis[0].largo == this.filtros.largo;
        });
      }

      this.resenas = resenas;

      if(this.resenas.length == 0){
        this.$swal.fire("Error", "No se encontraron resultados", "error").then(() => {
          this.orderResenas();
        });
      }
    },


  

    cargarResenas() {
      this.axios
        .get(this.URL, {
          headers: {
            "x-access-token": this.$store.getters.getUserToken,
          },
        })
        .then((response) => {
          // Ordenar reseñas y estructurar
          this.rawResenas = response.data[0];
          this.rawDetalles = response.data[1];
          this.rawChasis = response.data[2];

          this.orderResenas();

          this.loading = response.data.length > 0 ? false : true;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    orderResenas(){
      // Hay 3 arreglos raws, el de resenas, el de detalles y el de chasis.
      // El de resena, contiene la informacion principal, el de detalles los detalles y el de chasis sus medidas.
      /* El chasis tiene como referencia una clave resena_id, para saber a que resena pertenece,
        La resena tiene un id_detalles para saber que detalles pertenencen.
        Es necesario conectar todos los arreglos y crear un arreglo con objetos que contengan toda la informacion.
      */

      // Crear arreglo de objetos con toda la informacion
      let resenas = [];

      // Recorrer arreglo de resenas

      this.rawResenas.forEach((resena) => {
        // Crear objeto de resena
        let resenaObj = {
          id: resena.id,
          titulo: resena.titulo,
          descripcion: resena.descripcion,
          imagen: resena.imagen,
          id_usuario: resena.id_usuario,
          detalles: [],
          chasis: []
        };

        // Recorrer arreglo de detalles
        this.rawDetalles.forEach((detalle) => {
          // Si el id de detalles es igual al id de detalles de la resena
          if (detalle.id == resena.id_detalles) {
            // Crear objeto de detalles
            let detalleObj = {
              id: detalle.id,
              precioIni: detalle.precio_inicial,
              precioFin: detalle.precio_final,
              etiqueta: detalle.etiquetas,
            };

            // Recorrer arreglo de chasis
            this.rawChasis.forEach((chasis) => {
              // Si el id de chasis es igual al id de chasis de detalles
              if (chasis.resena_id == resena.id) {
                // Crear objeto de chasis
                let chasisObj = {
                  id: chasis.id,
                  altura_piso: chasis.alturapiso,
                  ancho: chasis.ancho,
                  largo: chasis.largo,
                };

                // Agregar chasis al arreglo de chasis
                resenaObj.chasis.push(chasisObj);
              }
            });

            // Agregar detalles al arreglo de detalles
            resenaObj.detalles.push(detalleObj);
          }
        });

        // Agregar resena al arreglo de resenas
        resenas.push(resenaObj);

        this.resenas = resenas;
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
    <div class="input-group mt-2 p-2 d-flex gap-2">
      <div class="input-group-text d-flex gap-3">
        <label for="filtro">Filtrar por Precio</label>
        <input
          class="form-control input mt-0"
          type="number"
          id="filtro"
          v-model="filtros.precio"
        />
      </div>
      <div class="input-group-text d-flex gap-3">
        <label for="filtro">Filtrar por Etiqueta</label>
        <input
          class="form-control input mt-0"
          type="text"
          id="filtro"
          v-model="filtros.etiqueta"
        />
      </div>
      <div class="input-group-text d-flex gap-3">
        <label for="filtro">Filtrar por Altura del Piso</label>
        <input
          class="form-control input mt-0"
          type="number"
          id="filtro"
          v-model="filtros.altura_piso"
        />
      </div>
      <div class="input-group-text d-flex gap-3">
        <label for="filtro">Filtrar por Ancho</label>
        <input
          class="form-control input mt-0"
          type="number"
          id="filtro"
          v-model="filtros.ancho"
        />
      </div>
      <div class="input-group-text d-flex gap-3">
        <label for="filtro">Filtrar por Largo</label>
        <input
          class="form-control input mt-0"
          type="number"
          id="filtro"
          v-model="filtros.largo"
        />
      </div>

      <button class="btn btn-success text-center w-100 rounded" @click="filtrar">Filtrar Resultados</button>
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
