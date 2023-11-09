<script>
export default {
  data() {
    return {
      resenas: [],
      URL: "http://localhost:3000/api/resenas/",
      URL_CALIFICAR: "http://localhost:3000/api/calificaciones/crear",
      loading: true,
      cantidadVotos: 0,
      detalles: [],
      carreteImages: [],
    };
  },

  created: function () {
    this.getResena();
  },

  methods: {
    getResena() {
      this.axios
        .get(this.URL + this.$route.params.id, {
          headers: {
            "x-access-token": this.$store.getters.getUserToken,
          },
        })
        .then((response) => {
          this.resenas.push(response.data.resena[0]);
          this.detalles.push(response.data.resena[1]);
          this.cantidadVotos = response.data.calif.length;
          this.carreteImages = response.data.resena[2];
        })
        .catch((err) => {
          console.log(err);
        });
    },

    calificarResena(id, caf) {
      let data = { id_resena: id, calificacion: caf };
      this.axios
        .post(this.URL_CALIFICAR, data, {
          headers: {
            "x-access-token": this.$store.getters.getUserToken,
          },
        })
        .then((response) => {
          this.$swal.fire({
            icon: "success",
            title: response.data.message,
            showConfirmButton: false,
            timer: 1500,
          });
        })
        .catch((err) => {
          this.$swal.fire({
            icon: "error",
            title: err.response.data.error,
            showConfirmButton: false,
            timer: 1500,
          });
        });
    },
  },
};
</script>

<template>
  <div class="card mx-auto" v-for="resena in resenas" :key="resena.id">
    <div class="imagenes">
      <div id="carouselId" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-inner" role="listbox">
          <div class="carousel-item active">
            <img
              :src="resena.imagen"
              class="imagen-principal First slide w-100"
            />
          </div>
          <div class="carousel-item">
            <iframe
              height="500"
              width="700"
              :src="'https://www.youtube.com/embed/' + resena.video"
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
            ></iframe>
          </div>
        </div>
        <button
          class="carousel-control-prev"
          type="button"
          data-bs-target="#carouselId"
          data-bs-slide="prev"
        >
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button
          class="carousel-control-next"
          type="button"
          data-bs-target="#carouselId"
          data-bs-slide="next"
        >
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
      </div>
      <div class="carrete" >
        <img v-for="carrete in carreteImages" :key="carrete.id" :src="carrete.imagen" class="imagen-carrete" />
      </div>
    </div>

    <div class="card-body pt-0 px-0">
      <div
        class="d-flex flex-column text-center justify-content-center mt-3 px-3"
      >
        <small class="mt-1 fs-6 fw-bold text-center">{{ resena.titulo }}</small>
        <p>{{ resena.descripcion }}</p>

        <div class="rate">
          <input
            type="radio"
            id="star5"
            name="rate"
            value="5"
            v-on:click="calificarResena(resena.id, 5)"
          />
          <label for="star5" title="text">5 stars</label>
          <input
            type="radio"
            id="star4"
            name="rate"
            value="4"
            v-on:click="calificarResena(resena.id, 4)"
          />
          <label for="star4" title="text">4 stars</label>
          <input
            type="radio"
            id="star3"
            name="rate"
            value="3"
            v-on:click="calificarResena(resena.id, 3)"
          />
          <label for="star3" title="text">3 stars</label>
          <input
            type="radio"
            id="star2"
            name="rate"
            value="2"
            v-on:click="calificarResena(resena.id, 2)"
          />
          <label for="star2" title="text">2 stars</label>
          <input
            type="radio"
            id="star1"
            name="rate"
            value="1"
            v-on:click="calificarResena(resena.id, 1)"
          />
          <label for="star1" title="text">1 star</label>
        </div>

        <div class="flex gap-2 w-3/4 mx-auto items-center text-center">
          <span class="material-symbols-outlined fs-1 text-center"> star </span>
          <p class="fw-bold">Calificaciones Otorgadas: {{ cantidadVotos }}</p>
        </div>
      </div>
      <hr class="mt-2 mx-3" />

      <div
        class="caracteristicas"
        v-for="detalle in detalles"
        :key="detalle.id"
      >
        <div class="d-flex flex-row justify-content-between px-3 pb-4">
          <div class="d-flex flex-column">
            <span class="text-muted">Marca</span
            ><small class="text-muted fs-6">{{ detalle.marca }}</small>
          </div>
        </div>
        <div class="d-flex flex-row justify-content-between px-3 pb-4">
          <div class="d-flex flex-column">
            <span class="text-muted">Modelo</span
            ><small class="text-muted fs-6">{{ detalle.modelo }}</small>
          </div>
        </div>
        <div class="d-flex flex-row justify-content-between px-3 pb-4">
          <div class="d-flex flex-column">
            <span class="text-muted">Año</span
            ><small class="text-muted fs-6">{{ detalle.ano }}</small>
          </div>
        </div>
        <div class="d-flex flex-row justify-content-between px-3 pb-4">
          <div class="d-flex flex-column">
            <span class="text-muted">HP</span
            ><small class="text-muted fs-6">{{ detalle.hp }}</small>
          </div>
        </div>
        <div class="d-flex flex-row justify-content-between px-3 pb-4">
          <div class="d-flex flex-column">
            <span class="text-muted">Combustible</span
            ><small class="text-muted fs-6">{{ detalle.combustible }}</small>
          </div>
        </div>
        <div class="d-flex flex-row justify-content-between px-3 pb-4">
          <div class="d-flex flex-column">
            <span class="text-muted">Puertas</span
            ><small class="text-muted fs-6">{{ detalle.puertas }}</small>
          </div>
        </div>
        <div class="d-flex flex-row justify-content-between px-3 pb-4">
          <div class="d-flex flex-column">
            <span class="text-muted">Transmision</span
            ><small class="text-muted fs-6">{{ detalle.transmision }}</small>
          </div>
        </div>
        <div class="d-flex flex-row justify-content-between px-3 pb-4">
          <div class="d-flex flex-column">
            <span class="text-muted">Motor</span
            ><small class="text-muted fs-6">{{ detalle.motor }}</small>
          </div>
        </div>
      </div>

      <div class="subforos">
        <div class="d-grid justify-content-center mx-auto gap-3">
          <span class="material-symbols-outlined fs-1 text-center">
            construction
          </span>
          <button class="btn btn-danger btn-block">Fallos y mecanica</button>
        </div>
        <div class="d-grid justify-content-center mx-auto gap-3">
          <span class="material-symbols-outlined fs-1 text-center">
            mystery
          </span>
          <button class="btn btn-danger btn-block">Consejos y dudas</button>
        </div>
        <div class="d-grid justify-content-center mx-auto gap-3">
          <span class="material-symbols-outlined fs-1 text-center">
            imagesmode
          </span>
          <button class="btn btn-danger btn-block">Imagenes</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.rate {
  float: left;
  height: 46px;
  padding: 0 10px;
}
.rate:not(:checked) > input {
  position: absolute;
  top: -9999px;
}
.rate:not(:checked) > label {
  width: 1em;
  overflow: hidden;
  white-space: nowrap;
  cursor: pointer;
  font-size: 30px;
  color: #ccc;
}
.rate:not(:checked) > label:before {
  content: "★ ";
}
.rate > input:checked ~ label {
  color: #ffc700;
}
.rate:not(:checked) > label:hover,
.rate:not(:checked) > label:hover ~ label {
  color: #deb217;
}
.rate > input:checked + label:hover,
.rate > input:checked + label:hover ~ label,
.rate > input:checked ~ label:hover,
.rate > input:checked ~ label:hover ~ label,
.rate > label:hover ~ input:checked ~ label {
  color: #c59b08;
}

iframe {
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
}
.imagenes {
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 15px;
  height: 500px;
  justify-content: space-between;
}

.imagen-principal {
  height: 500px;
  width: 70%;
  border-top-left-radius: 5px;
  border-top-right-radius: 25px;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 25px;
}

.carrete {
  display: grid;
  gap: 5px;
  padding: 5px;
  overflow-y: scroll;
}

.imagen-carrete {
  height: 200px;
  width: 100%;
  border: none;
  border-radius: 25px;
}

@media only screen and (max-width: 600px) {

  iframe {
    width: 100%;
    height: 300px;
  }
  .imagenes {
    display: grid;
    height: 100%;
  }

  .imagen-principal {
    width: 100%;
    height: 300px;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
  }

  .carrete {
    display: flex;
    flex-direction: row;
    overflow-y: hidden;
    overflow-x: scroll;
  }
}

.card {
  width: 80%;
  border-radius: 10px;
}

.subforos {
  display: flex;
  width: 60%;
  margin: 0px auto;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  gap: 5px;
}
.caracteristicas {
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
}

@media only screen and (min-width: 800px) {
  .caracteristicas {
    flex-direction: row;
  }
  .card {
    width: 90%;
  }
}

.card-img-top {
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
}
span.text-muted {
  font-size: 12px;
}
small.text-muted {
  font-size: 8px;
}
h5.mb-0 {
  font-size: 1rem;
}
small.ghj {
  font-size: 9px;
}
.mid {
  background: #ecedf1;
}
h6.ml-1 {
  font-size: 13px;
}
small.key {
  text-decoration: underline;
  font-size: 9px;
  cursor: pointer;
}
.btn-danger {
  color: #ffcbd2;
}
.btn-danger:focus {
  box-shadow: none;
}
small.justify-content-center {
  font-size: 9px;
  cursor: pointer;
  text-decoration: underline;
}

@media screen and (max-width: 600px) {
  .col-sm-4 {
    margin-bottom: 50px;
  }
}
</style>
