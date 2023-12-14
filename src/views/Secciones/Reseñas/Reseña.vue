<script>
export default {
  data() {
    return {
      resenas: [],
      URL: "http://localhost:3000/api/resenas/",
      URL_COMENTAR: "http://localhost:3000/api/resenas/comentario/",
      URL_SUBFORO: "http://localhost:3000/api/subforo/",
      URL_CALIFICAR: "http://localhost:3000/api/calificaciones/crear",
      URL_STRIKES: "http://localhost:3000/api/strikes/sancionar/",
      loading: true,
      cantidadVotos: 0,
      detalles: [],
      carreteImages: [],
      comentarios: [],
      likes: [],
      replicas: [],
      subforoSelected: -1,
      messageFile: null,
      replyMode: false,
      repliedMessage: null,
      message: "",
      comentariosResena: [],
      comentario: "",
    };
  },

  created: function () {
    this.getResena();
  },

  methods: {
    handleFile(e) {
      this.messageFile = e.target.files[0];
    },

    sendComentario() {
      this.axios
        .post(
          this.URL_COMENTAR + this.$route.params.id,
          {
            comentario: this.comentario,
          },
          {
            headers: {
              "x-access-token": this.$store.getters.getUserToken,
            },
          }
        )
        .then((response) => {
          this.$swal.fire({
            icon: "success",
            title: response.data.message,
            showConfirmButton: false,
            timer: 1500,
          });
          this.comentario = "";
          this.getResena();
        })
        .catch((error) => {
          this.$swal.fire({
            icon: "error",
            title: error.response.data.error,
            showConfirmButton: false,
            timer: 1500,
          });
        });
    },

    closeReply() {
      this.replyMode = false;
    },

    muteSubforo() {
      this.axios
        .post(
          this.URL_SUBFORO +
            "mute/" +
            this.$route.params.id +
            "/" +
            this.subforoSelected,
          {},
          {
            headers: {
              "x-access-token": this.$store.getters.getUserToken,
            },
          }
        )
        .then((response) => {
          this.$swal.fire({
            icon: "success",
            title: response.data.message,
            showConfirmButton: false,
            timer: 1500,
          });
        })
        .catch((error) => {
          this.$swal.fire({
            icon: "error",
            title: error.response.data.error,
            showConfirmButton: false,
            timer: 1500,
          });
        });
    },

    replyMessage(id) {
      this.repliedMessage = id;
      this.replyMode = true;
    },

    getResena() {
      this.axios
        .get(this.URL + this.$route.params.id, {
          headers: {
            "x-access-token": this.$store.getters.getUserToken,
          },
        })
        .then((response) => {
          this.resenas = [];
          this.detalles = [];
          this.carreteImages = [];
          this.comentariosResena = [];

          this.resenas.push(response.data.resena[0]);
          this.detalles.push(response.data.resena[1]);
          this.cantidadVotos = response.data.calif.length;
          this.carreteImages = response.data.resena[2];
          this.comentariosResena = response.data.comentarios;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    deleteMessage(id) {
      this.axios
        .post(
          this.URL_SUBFORO + "delete/" + id,
          {},
          {
            headers: {
              "x-access-token": this.$store.getters.getUserToken,
            },
          }
        )
        .then((response) => {
          this.$swal.fire({
            icon: "success",
            title: response.data.message,
            showConfirmButton: false,
            timer: 1500,
          });
          this.seeSubforo(this.$route.params.id, this.subforoSelected);
        })
        .catch((error) => {
          this.$swal.fire({
            icon: "error",
            title: error.response.data.error,
            showConfirmButton: false,
            timer: 1500,
          });
        });
    },

    ordenarComentarios() {
      // Debe verse asi
      // {texto:, imagen:, usuario:, likes: [], reply: []}

      let comentariosStructure = [];

      this.comentarios.forEach((comentario) => {
        comentariosStructure.push({
          id: comentario.id,
          id_usuario: comentario.id_usuario,
          texto: comentario.texto,
          imagen: comentario.imagen,
          nombre: comentario.nombre,
          subforo: comentario.id_subforo,
          likes: this.likes.filter(
            (like) => like.id_comentario == comentario.id
          ),
          replicas: this.replicas.filter(
            (replica) => replica.id_comentario == comentario.id
          ),
        });
      });

      this.comentarios = comentariosStructure;
    },

    sendMessage() {
      if (this.message.trim() == "") {
        this.$swal.fire({
          icon: "error",
          title: "No puedes enviar un mensaje vacio",
          showConfirmButton: false,
          timer: 1000,
        });
        return;
      }

      if (this.replyMode == false) {
        let formData = new FormData();
        formData.append("comentario", this.message);
        formData.append("imagen", this.messageFile);

        this.axios
          .post(
            this.URL_SUBFORO +
              this.$route.params.id +
              "/" +
              this.subforoSelected,
            formData,
            {
              headers: {
                "x-access-token": this.$store.getters.getUserToken,
              },
            }
          )
          .then((response) => {
            this.$swal.fire({
              icon: "success",
              title: response.data.message,
              showConfirmButton: false,
              timer: 1500,
            });
            this.message = "";
            this.messageFile = null;
            this.seeSubforo(this.$route.params.id, this.subforoSelected);
          })
          .catch((error) => {
            this.$swal.fire({
              icon: "error",
              title: error.response.data.error,
              showConfirmButton: false,
              timer: 1500,
            });
          });
      } else {
        let formData = new FormData();
        formData.append("texto", this.message);
        formData.append("imagen", this.messageFile);

        this.axios
          .post(
            this.URL_SUBFORO +
              "reply/" +
              this.$route.params.id +
              "/" +
              this.subforoSelected +
              "/" +
              this.repliedMessage,
            formData,
            {
              headers: {
                "x-access-token": this.$store.getters.getUserToken,
              },
            }
          )
          .then((response) => {
            this.$swal.fire({
              icon: "success",
              title: response.data.message,
              showConfirmButton: false,
              timer: 1500,
            });
            this.message = "";
            this.messageFile = null;
            this.seeSubforo(this.$route.params.id, this.subforoSelected);
          })
          .catch((error) => {
            this.$swal.fire({
              icon: "error",
              title: error.response.data.error,
              showConfirmButton: false,
              timer: 1500,
            });
          });
      }
    },

    seeSubforo(resena, id) {
      this.axios
        .get(this.URL_SUBFORO + resena + "/" + id, {
          headers: {
            "x-access-token": this.$store.getters.getUserToken,
          },
        })
        .then((response) => {
          this.comentarios = response.data[0];
          this.likes = response.data[1];
          this.replicas = response.data[2];
          this.subforoSelected = id;
          this.ordenarComentarios();
        })
        .catch((error) => {
          this.$swal.fire({
            icon: "error",
            title: error.response.data.error,
            showConfirmButton: false,
            timer: 1500,
          });
        });
    },

    likeMessage(id, comentario) {
      this.axios
        .post(
          this.URL_SUBFORO + "like/" + comentario + "/" + id,
          {},
          {
            headers: {
              "x-access-token": this.$store.getters.getUserToken,
            },
          }
        )
        .then((response) => {
          this.$swal.fire({
            icon: "success",
            title: response.data.message,
            showConfirmButton: false,
            timer: 1500,
          });
          this.seeSubforo(this.$route.params.id, this.subforoSelected);
        })
        .catch((error) => {
          this.$swal.fire({
            icon: "error",
            title: error.response.data.error,
            showConfirmButton: false,
            timer: 1500,
          });
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

    deleteReply(id) {
      this.axios
        .post(
          this.URL_SUBFORO + "delete/reply/" + id,
          {},
          {
            headers: {
              "x-access-token": this.$store.getters.getUserToken,
            },
          }
        )
        .then((response) => {
          this.$swal.fire({
            icon: "success",
            title: response.data.message,
            showConfirmButton: false,
            timer: 1500,
          });
          this.seeSubforo(this.$route.params.id, this.subforoSelected);
        })
        .catch((error) => {
          this.$swal.fire({
            icon: "error",
            title: error.response.data.error,
            showConfirmButton: false,
            timer: 1500,
          });
        });
    },

    async strikeUsuario(id) {
      const { value: text } = await this.$swal.fire({
        title: "¿Quieres sancionar a este usuario?",
        text: "Este tiene un maximo de 3 sanciones",
        input: "text",
        inputLabel: "Ingresa una razon",
        inputPlaceholder: "¿Porque sancionas?",
        confirmButtonText: "Sancionar",
        confirmButtonColor: "#f1bc90",
      });

      if (text) {
        this.axios
          .post(
            this.URL_STRIKES + id,
            { razon: text },
            {
              headers: {
                "x-access-token": this.$store.getters.getUserToken,
              },
            }
          )
          .then((response) => {
            this.$swal.fire("Sancionado", response.data.message, "success");
            location.reload();
          })
          .catch((error) => {
            console.log(error);
          });
      }
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
      <div class="carrete">
        <img
          v-for="carrete in carreteImages"
          :key="carrete.id"
          :src="carrete.imagen"
          class="imagen-carrete"
        />
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

        <div class="d-flex gap-2 w-3/4 mx-auto items-center flex-row mb-5">
          <div class="rate">
            <p>Gasolina</p>
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
          <div class="rate">
            <p>Confiabilidad</p>
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
          <div class="rate">
            <p>Confort</p>
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
          <div class="rate">
            <p>Diseño</p>
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
          <div class="rate">
            <p>Manejo</p>
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

      <div class="detalles">
        <div
          class="accordion accordion-flush w-75 mx-auto"
          id="accordionFlushExample"
        >
          <div class="accordion-item">
            <h2 class="accordion-header" id="flush-headingOne">
              <button
                class="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#flush-collapseOne"
                aria-expanded="true"
                aria-controls="flush-collapseOne"
              >
                Motor
              </button>
            </h2>
            <div
              id="flush-collapseOne"
              class="accordion-collapse collapse"
              aria-labelledby="flush-headingOne"
              data-bs-parent="#accordionFlushExample"
            >
              <div class="accordion-body">
                <!-- Some borders are removed -->
                <ul class="list-group list-group-flush">
                  <li class="list-group-item">Combustible:</li>
                  <li class="list-group-item">Potencia:</li>
                  <li class="list-group-item">Torque:</li>
                  <li class="list-group-item">Cilindros:</li>
                  <li class="list-group-item">Valvulas:</li>
                  <li class="list-group-item">Alimentacion:</li>
                  <li class="list-group-item">Sistema start/stop:</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div
          class="accordion accordion-flush w-75 mx-auto"
          id="accordionFlushExample"
        >
          <div class="accordion-item">
            <h2 class="accordion-header" id="flush-headingTwo">
              <button
                class="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#flush-collapseTwo"
                aria-expanded="true"
                aria-controls="flush-collapseTwo"
              >
                Performance
              </button>
            </h2>
            <div
              id="flush-collapseTwo"
              class="accordion-collapse collapse"
              aria-labelledby="flush-headingTwo"
              data-bs-parent="#accordionFlushExample"
            >
              <div class="accordion-body">
                <!-- Some borders are removed -->
                <ul class="list-group list-group-flush">
                  <li class="list-group-item">Aceleracion 0-100km:</li>
                  <li class="list-group-item">Velocidad Maxima:</li>
                  <li class="list-group-item">Rendimiento en ciudad:</li>
                  <li class="list-group-item">Rendimiento en ruta:</li>
                  <li class="list-group-item">Rendimiento mixto:</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div
          class="accordion accordion-flush w-75 mx-auto"
          id="accordionFlushExample"
        >
          <div class="accordion-item">
            <h2 class="accordion-header" id="flush-headingThree">
              <button
                class="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#flush-collapseThree"
                aria-expanded="true"
                aria-controls="flush-collapseThree"
              >
                Transmision y Chasis
              </button>
            </h2>
            <div
              id="flush-collapseThree"
              class="accordion-collapse collapse"
              aria-labelledby="flush-headingThree"
              data-bs-parent="#accordionFlushExample"
            >
              <div class="accordion-body">
                <!-- Some borders are removed -->
                <ul class="list-group list-group-flush">
                  <li class="list-group-item">Motor (posición):</li>
                  <li class="list-group-item">Traccion:</li>
                  <li class="list-group-item">Transmisión:</li>
                  <li class="list-group-item">
                    Frenos (Delanteros y traseros):
                  </li>
                  <li class="list-group-item">Neumáticos:</li>
                  <li class="list-group-item">Suspensión delantera:</li>
                  <li class="list-group-item">Suspensión trasera:</li>
                  <li class="list-group-item">Dirección asistida:</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr class="mt-2 mx-3" />

      <div class="mx-auto w-75 d-flex justify-items-center py-3 flex-column">
        <h1 class="fs-5">Comentarios</h1>

        <div>
          <div
            class="media w-50 mb-3"
            v-for="comentario in comentariosResena"
            :key="comentario.id"
          >
            <img
              src="https://therichpost.com/wp-content/uploads/2020/06/avatar2.png"
              alt="user"
              width="50"
              class="rounded-circle"
            />
            <small class="text-muted text fs-6 mx-3">{{
              comentario.nombre
            }}</small>
            <div class="media-body ml-3 mt-2 d-flex gap-2 align-items-center">
              <div
                class="bg-light rounded py-2 px-3 mb-2"
                v-if="comentario.mensaje != ''"
              >
                <p class="text-small mb-0 text-muted">{{ comentario.mensaje }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="d-flex flex-row gap-2 mt-3">
          <input
            type="text"
            class="form-control"
            placeholder="Escribe un comentario"
            v-model="comentario"
          />
          <button class="btn btn-danger" type="button" @click="sendComentario">
            Enviar
          </button>
        </div>
      </div>

      <hr class="mt-2 mx-3" />

      <div class="subforos">
        <div class="d-grid justify-content-center mx-auto gap-3">
          <span class="material-symbols-outlined fs-1 text-center">
            construction
          </span>
          <button
            class="btn btn-danger btn-block"
            @click="seeSubforo(resena.id, 0)"
          >
            Fallos y mecanica
          </button>
        </div>
        <div class="d-grid justify-content-center mx-auto gap-3">
          <span class="material-symbols-outlined fs-1 text-center">
            mystery
          </span>
          <button
            class="btn btn-danger btn-block"
            @click="seeSubforo(resena.id, 1)"
          >
            Consejos y dudas
          </button>
        </div>
        <div class="d-grid justify-content-center mx-auto gap-3">
          <span class="material-symbols-outlined fs-1 text-center">
            imagesmode
          </span>
          <button
            class="btn btn-danger btn-block"
            @click="seeSubforo(resena.id, 2)"
          >
            Imagenes
          </button>
        </div>
      </div>

      <div class="comentarios mt-5" v-if="subforoSelected != -1">
        <div class="d-grid justify-content-center mx-auto gap-3 mb-5">
          <span class="material-symbols-outlined fs-1 text-center">
            volume_mute
          </span>
          <button class="btn btn-danger btn-block" @click="muteSubforo">
            Silenciar este subforo
          </button>
        </div>
        <div class="" v-if="comentarios.length == 0">
          <p>No hay comentarios en este subforo!</p>
        </div>

        <div class="" v-else>
          <div
            class="media w-50 mb-3"
            v-for="comentario in comentarios"
            :key="comentario.id"
          >
            <img
              src="https://therichpost.com/wp-content/uploads/2020/06/avatar2.png"
              alt="user"
              width="50"
              class="rounded-circle"
            />
            <small class="text-muted text fs-6 mx-3">{{
              comentario.nombre
            }}</small>
            <div class="media-body ml-3 mt-2 d-flex gap-2 align-items-center">
              <div
                class="bg-light rounded py-2 px-3 mb-2"
                v-if="comentario.texto != ''"
              >
                <p class="text-small mb-0 text-muted">{{ comentario.texto }}</p>
              </div>
              <button
                @click="replyMessage(comentario.id)"
                type="button"
                class="border-0 bg-transparent"
              >
                <span
                  class="material-symbols-outlined"
                  @click="replyMessage(comentario.id)"
                >
                  reply
                </span>
              </button>
              <button
                type="button"
                class="border-0 bg-transparent d-flex items-center mb-1 gap-2"
                v-if="likes.length > 0"
              >
                {{ likes.length }}
                <span
                  class="material-symbols-outlined"
                  @click="likeMessage(comentario.subforo, comentario.id)"
                >
                  thumb_up
                </span>
              </button>
              <button type="button" class="border-0 bg-transparent" v-else>
                <span
                  class="material-symbols-outlined"
                  @click="likeMessage(comentario.subforo, comentario.id)"
                >
                  thumb_up
                </span>
              </button>
              <button
                @click="deleteMessage(comentario.id)"
                type="button"
                class="border-0 bg-transparent"
              >
                <span class="material-symbols-outlined"> delete </span>
              </button>
              <button
                @click="strikeUsuario(comentario.id_usuario)"
                type="button"
                class="border-0 bg-transparent"
              >
                <span class="material-symbols-outlined"> warning </span>
              </button>
            </div>
            <div v-if="comentario.imagen != ''">
              <img :src="comentario.imagen" alt="Chat Message Image" />
            </div>

            <div class="" v-if="comentario.replicas.length > 0">
              <div
                class=""
                v-for="replica in comentario.replicas"
                :key="replica.id"
              >
                <div class="replica-box">
                  <img
                    src="https://therichpost.com/wp-content/uploads/2020/06/avatar3.png"
                    alt="user"
                    width="30"
                    class="rounded-circle"
                  />
                  <small class="text-muted mx-3 fs-6"
                    >{{ replica.nombre }} : Replica a
                    {{ comentario.nombre }}</small
                  >
                  <div
                    class="media-body ml-3 mt-2 d-flex gap-2 align-items-center"
                  >
                    <div
                      class="bg-light rounded py-2 px-3 mb-2"
                      v-if="replica.texto != ''"
                    >
                      <p class="text-small mb-0 text-muted">
                        {{ replica.texto }}
                      </p>
                    </div>
                    <button
                      @click="deleteReply(replica.id)"
                      type="button"
                      class="border-0 bg-transparent"
                    >
                      <span
                        class="material-symbols-outlined"
                        @click="deleteReply(replica.id)"
                      >
                        delete
                      </span>
                    </button>
                    <button
                      @click="strikeUsuario(replica.id_usuario)"
                      type="button"
                      class="border-0 bg-transparent"
                    >
                      <span
                        class="material-symbols-outlined"
                        @click="strikeUsuario(replica.id_usuario)"
                      >
                        warning
                      </span>
                    </button>
                  </div>

                  <div v-if="replica.imagen != ''">
                    <img
                      :src="replica.imagen"
                      alt="Chat Message Image"
                      class="reply-image"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          class="d-flex justify-content-center mx-auto gap-3 w-full"
          v-if="!replyMode"
        >
          <div class="mb-3">
            <label for="" class="form-label">Comentario</label>
            <input
              type="text"
              class="form-control"
              v-model="message"
              placeholder="Añade un mensaje a la reseña"
            />
          </div>
          <input
            type="file"
            id="file-message"
            class="d-none"
            @change="handleFile"
          />
          <label type="button" for="file-message" class="btn btn-primary">
            <span class="material-symbols-outlined text-center">
              imagesmode
            </span>
          </label>
          <button type="button" @click="sendMessage" class="btn btn-danger">
            Enviar
          </button>
        </div>
        <div class="d-flex justify-content-center mx-auto gap-3 w-full" v-else>
          <button
            @click="closeReply"
            type="button"
            class="border-0 bg-transparent"
          >
            <span class="material-symbols-outlined"> close </span>
          </button>
          <div class="mb-3">
            <label for="" class="form-label">Replica</label>
            <input
              type="text"
              class="form-control"
              v-model="message"
              placeholder="Escribe una replica al comentario"
            />
          </div>
          <input
            type="file"
            id="file-message"
            class="d-none"
            @change="handleFile"
          />
          <label type="button" for="file-message" class="btn btn-primary">
            <span class="material-symbols-outlined text-center">
              imagesmode
            </span>
          </label>
          <button type="button" @click="sendMessage" class="btn btn-danger">
            Enviar
          </button>
        </div>

        <div class="p-2 imagenseleccionada" v-if="messageFile != null">
          <span class="material-symbols-outlined"> imagesmode </span>
          <p>
            Imagen seleccionada:
            {{ messageFile.name }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.imagenseleccionada {
  display: grid;
  grid-template-columns: 1fr;
  text-align: center;
  align-items: center;
}

.comentarios {
  width: 90%;
  margin: 0px auto;
}

.comentarios div {
  width: 100%;
  align-items: center;
}

.comentarios div button {
  height: 48px;
}

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

.carousel-control-next,
.carousel-control-prev {
  width: 2%;
}

.replica-box {
  margin-left: 50px;
  margin-top: 10px;
  margin-bottom: 10px;
  width: 240px;
}

.reply-image {
  height: 200px;
}
</style>
