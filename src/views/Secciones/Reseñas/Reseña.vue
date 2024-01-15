<script>
export default {
  data() {
    return {
      resenas: [],
      URL: "http://localhost:3000/api/resenas/",
      URL_COMENTAR: "http://localhost:3000/api/resenas/comentario/",
      URL_SUBFORO: "http://localhost:3000/api/subforo/",
      URL_CALIFICAR: "http://localhost:3000/api/calificaciones",
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
      motor: [],
      chasis: [],
      perfomance: [],
      medidas: [],
      seguridad: [],
      entretenimiento: [],
      confort: [],
      calificaciones: {
        gasolina: 0,
        confiabilidad: 0,
        confort: 0,
        diseno: 0,
        manejo: 0,
        total: 0,
      },
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

          this.motor = response.data.motor;
          this.chasis = response.data.chasis;
          this.perfomance = response.data.perfomance;
          this.medidas = response.data.capacidades;
          this.seguridad = response.data.seguridad;
          this.entretenimiento = response.data.entretenimiento;
          this.confort = response.data.confort;

          this.calcularCalificaciones(response.data.calif);
        })
        .catch((err) => {
          console.log(err);
        });
    },

    calcularCalificaciones(x) {
      // Realizar el cálculo de 5 estrellas en base a cada calificación dentro del arreglo

      let gasolina = 0;
      let confiabilidad = 0;
      let confort = 0;
      let diseno = 0;
      let manejo = 0;

      x.forEach((calificacion) => {
        gasolina += calificacion.gasolina;
        confiabilidad += calificacion.confiabilidad;
        confort += calificacion.confort;
        diseno += calificacion.diseno;
        manejo += calificacion.manejo;
      });

      // Calcular promedio
      this.calificaciones.gasolina = Math.min(5, gasolina / x.length);
      this.calificaciones.confiabilidad = Math.min(5, confiabilidad / x.length);
      this.calificaciones.confort = Math.min(5, confort / x.length);
      this.calificaciones.diseno = Math.min(5, diseno / x.length);
      this.calificaciones.manejo = Math.min(5, manejo / x.length);

      this.calificaciones.total = this.calificaciones.gasolina + this.calificaciones.confiabilidad + this.calificaciones.confort + this.calificaciones.diseno + this.calificaciones.manejo;

      this.calificaciones.total = Math.min(5, this.calificaciones.total / 5);
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

    calificarResena(puntaje, tipo) {
      let data = {
        id_resena: this.$route.params.id,
        puntaje: puntaje,
        tipo: tipo,
      };
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
          this.getResena();
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
          <div
            class="carousel-item"
            v-for="carrete in carreteImages"
            :key="carrete.id"
          >
            <img :src="carrete.imagen" class="car-image" />
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
    </div>

    <div class="card-body pt-0 px-0">
      <div
        class="d-flex flex-column text-center justify-content-center mt-3 px-3"
      >
        <small class="mt-1 fs-6 fw-bold text-center">{{ resena.titulo }}</small>
        <p>{{ resena.descripcion }}</p>

        <div class="d-flex gap-2 w-3/4 mx-auto items-center text-center mb-2">
          <span class="material-symbols-outlined text-center"> star </span>
          <p class="fw-bold">{{ calificaciones.total }}</p>
        </div>
          <p class="fw-bold">{{ cantidadVotos }} Personas calificaron el vehiculo</p>

        <div class="d-flex gap-2 w-3/4 mx-auto items-center flex-row mb-5">
          <div class="rate mb-4">
            <div
              class="d-flex justify-content-center gap-2 w-3/4 mx-auto items-center text-center"
            >
              <span class="material-symbols-outlined text-center"> star </span>
              <p class="fw-bold">{{ calificaciones.gasolina }}</p>
            </div>
            <p>Gasolina</p>
            <input
              type="radio"
              id="star5"
              name="rate"
              value="5"
              v-on:click="calificarResena(5, 1)"
            />
            <label for="star5" title="text">5 stars</label>
            <input
              type="radio"
              id="star4"
              name="rate"
              value="4"
              v-on:click="calificarResena(4, 1)"
            />
            <label for="star4" title="text">4 stars</label>
            <input
              type="radio"
              id="star3"
              name="rate"
              value="3"
              v-on:click="calificarResena(3, 1)"
            />
            <label for="star3" title="text">3 stars</label>
            <input
              type="radio"
              id="star2"
              name="rate"
              value="2"
              v-on:click="calificarResena(2, 1)"
            />
            <label for="star2" title="text">2 stars</label>
            <input
              type="radio"
              id="star1"
              name="rate"
              value="1"
              v-on:click="calificarResena(1, 1)"
            />
            <label for="star1" title="text">1 star</label>
          </div>
          <div class="rate mb-4">
            <div
              class="d-flex justify-content-center gap-2 w-3/4 mx-auto items-center text-center"
            >
              <span class="material-symbols-outlined text-center"> star </span>
              <p class="fw-bold">{{ calificaciones.confiabilidad }}</p>
            </div>
            <p>Confiabilidad</p>
            <input
              type="radio"
              id="starConfibialidad5"
              name="rate"
              value="5"
              v-on:click="calificarResena(5, 2)"
            />
            <label for="starConfibialidad5" title="text">5 stars</label>
            <input
              type="radio"
              id="starConfibialidad4"
              name="rate"
              value="4"
              v-on:click="calificarResena(4, 2)"
            />
            <label for="starConfibialidad4" title="text">4 stars</label>
            <input
              type="radio"
              id="starConfibialidad3"
              name="rate"
              value="3"
              v-on:click="calificarResena(3, 2)"
            />
            <label for="starConfibialidad3" title="text">3 stars</label>
            <input
              type="radio"
              id="starConfibialidad2"
              name="rate"
              value="2"
              v-on:click="calificarResena(2, 2)"
            />
            <label for="starConfibialidad2" title="text">2 stars</label>
            <input
              type="radio"
              id="starConfibialidad1"
              name="rate"
              value="1"
              v-on:click="calificarResena(1, 2)"
            />
            <label for="starConfibialidad1" title="text">1 star</label>
          </div>
          <div class="rate mb-4">
            <div
              class="d-flex justify-content-center gap-2 w-3/4 mx-auto items-center text-center"
            >
              <span class="material-symbols-outlined text-center"> star </span>
              <p class="fw-bold">{{ calificaciones.confort }}</p>
            </div>
            <p>Confort</p>
            <input
              type="radio"
              id="starConfort5"
              name="rate"
              value="5"
              v-on:click="calificarResena(5, 3)"
            />
            <label for="starConfort5" title="text">5 stars</label>
            <input
              type="radio"
              id="starConfort4"
              name="rate"
              value="4"
              v-on:click="calificarResena(4, 3)"
            />
            <label for="starConfort4" title="text">4 stars</label>
            <input
              type="radio"
              id="starConfort3"
              name="rate"
              value="3"
              v-on:click="calificarResena(3, 3)"
            />
            <label for="starConfort3" title="text">3 stars</label>
            <input
              type="radio"
              id="starConfort2"
              name="rate"
              value="2"
              v-on:click="calificarResena(2, 3)"
            />
            <label for="starConfort2" title="text">2 stars</label>
            <input
              type="radio"
              id="starConfort1"
              name="rate"
              value="1"
              v-on:click="calificarResena(1, 3)"
            />
            <label for="starConfort1" title="text">1 star</label>
          </div>
          <div class="rate mb-4">
            <div
              class="d-flex justify-content-center gap-2 w-3/4 mx-auto items-center text-center"
            >
              <span class="material-symbols-outlined text-center"> star </span>
              <p class="fw-bold">{{ calificaciones.diseno }}</p>
            </div>
            <p>Diseño</p>
            <input
              type="radio"
              id="starDiseno5"
              name="rate"
              value="5"
              v-on:click="calificarResena(5, 4)"
            />
            <label for="starDiseno5" title="text">5 stars</label>
            <input
              type="radio"
              id="starDiseno4"
              name="rate"
              value="4"
              v-on:click="calificarResena(4, 4)"
            />
            <label for="starDiseno4" title="text">4 stars</label>
            <input
              type="radio"
              id="starDiseno3"
              name="rate"
              value="3"
              v-on:click="calificarResena(3, 4)"
            />
            <label for="starDiseno3" title="text">3 stars</label>
            <input
              type="radio"
              id="starDiseno2"
              name="rate"
              value="2"
              v-on:click="calificarResena(2, 4)"
            />
            <label for="starDiseno2" title="text">2 stars</label>
            <input
              type="radio"
              id="starDiseno1"
              name="rate"
              value="1"
              v-on:click="calificarResena(1, 4)"
            />
            <label for="starDiseno1" title="text">1 star</label>
          </div>
          <div class="rate mb-4">
            <div
              class="d-flex justify-content-center gap-2 w-3/4 mx-auto items-center text-center"
            >
              <span class="material-symbols-outlined text-center"> star </span>
              <p class="fw-bold">{{ calificaciones.manejo }}</p>
            </div>
            <p>Manejo</p>
            <input
              type="radio"
              id="starManejo5"
              name="rate"
              value="5"
              v-on:click="calificarResena(5, 5)"
            />
            <label for="starManejo5" title="text">5 stars</label>
            <input
              type="radio"
              id="starManejo4"
              name="rate"
              value="4"
              v-on:click="calificarResena(4, 5)"
            />
            <label for="starManejo4" title="text">4 stars</label>
            <input
              type="radio"
              id="starManejo3"
              name="rate"
              value="3"
              v-on:click="calificarResena(3, 5)"
            />
            <label for="starManejo3" title="text">3 stars</label>
            <input
              type="radio"
              id="starManejo2"
              name="rate"
              value="2"
              v-on:click="calificarResena(2, 5)"
            />
            <label for="starManejo2" title="text">2 stars</label>
            <input
              type="radio"
              id="starManejo1"
              name="rate"
              value="1"
              v-on:click="calificarResena(1, 5)"
            />
            <label for="starManejo1" title="text">1 star</label>
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
            ><small class="text-muted fs-6">{{ motor[0].combustible }}</small>
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
            ><small class="text-muted fs-6">{{ chasis[0].tranmision }}</small>
          </div>
        </div>
        <div class="d-flex flex-row justify-content-between px-3 pb-4">
          <div class="d-flex flex-column">
            <span class="text-muted">Motor</span
            ><small class="text-muted fs-6">{{ motor[0].cilindros }}</small>
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
              v-for="motor in motor"
              :key="motor.id"
              data-bs-parent="#accordionFlushExample"
            >
              <div class="accordion-body">
                <!-- Some borders are removed -->
                <ul class="list-group list-group-flush">
                  <li class="list-group-item">Combustible: {{ motor.combustible }}</li>
                  <li class="list-group-item">Potencia: {{ motor.potencia }}</li>
                  <li class="list-group-item">Torque: {{ motor.torque }}</li>
                  <li class="list-group-item">Cilindros: {{ motor.cilindros }}</li>
                  <li class="list-group-item">Valvulas: {{ motor.valvulas }}</li>
                  <li class="list-group-item">Alimentacion: {{ motor.alimentacion }}</li>
                  <li class="list-group-item">Sistema start/stop: {{ motor.sistema }}</li>
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
              v-for="perfomance in perfomance"
              :key="perfomance.id"
            >
              <div class="accordion-body">
                <!-- Some borders are removed -->
                <ul class="list-group list-group-flush">
                  <li class="list-group-item">Aceleracion 0-100km: {{ perfomance.aceleracion }}</li>
                  <li class="list-group-item">Velocidad Maxima: {{ perfomance.velocidad }}</li>
                  <li class="list-group-item">Rendimiento en ciudad: {{ perfomance.rendimientociudad }}</li>
                  <li class="list-group-item">Rendimiento en ruta: {{ perfomance.rendimientoruta }}</li>
                  <li class="list-group-item">Rendimiento mixto: {{ perfomance.rendimientomixto }}</li>
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
              v-for="chasis in chasis"
              :key="chasis.id"
            >
              <div class="accordion-body">
                <!-- Some borders are removed -->
                <ul class="list-group list-group-flush">
                  <li class="list-group-item">Motor (posición): {{ chasis.motor }}</li>
                  <li class="list-group-item">Traccion: {{ chasis.traccion }}</li>
                  <li class="list-group-item">Transmisión: {{ chasis.tranmision }}</li>
                  <li class="list-group-item">
                    Frenos (Delanteros y traseros):  {{ chasis.frenos }}
                  </li>
                  <li class="list-group-item">Neumáticos:  {{ chasis.neumaticos }}</li>
                  <li class="list-group-item">Suspensión delantera:  {{ chasis.suspdelantero }}</li>
                  <li class="list-group-item">Suspensión trasera:  {{ chasis.susptrasera }}</li>
                  <li class="list-group-item">Dirección asistida:  {{ chasis.direccion }}</li>
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
            <h2 class="accordion-header" id="flush-headingFour">
              <button
                class="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#flush-collapseFour"
                aria-expanded="true"
                aria-controls="flush-collapseFour"
              >
                Medidas y capacidades
              </button>
            </h2>
            <div
              id="flush-collapseFour"
              class="accordion-collapse collapse"
              aria-labelledby="flush-headingFour"
              data-bs-parent="#accordionFlushExample"
              v-for="medidas in medidas"
              :key="medidas.id"
            >
              <div class="accordion-body">
                <!-- Some borders are removed -->
                <ul class="list-group list-group-flush">
                  <li class="list-group-item">Largo: {{ medidas.largo }}</li>
                  <li class="list-group-item">Alto: {{ medidas.alto }}</li>
                  <li class="list-group-item">Ancho: {{ medidas.ancho }}</li>
                  <li class="list-group-item">
                    Distancia entre ejes: {{ medidas.distanciaejes }}
                  </li>
                  <li class="list-group-item">Cajuela: {{ medidas.cajuela }}</li>
                  <li class="list-group-item">Tanque de combustible: {{ medidas.tanque }}</li>
                  <li class="list-group-item">Peso: {{ medidas.peso }}</li>
                  <li class="list-group-item">Capacidad de carga: {{ medidas.capacidadcarga }}</li>
                  <li class="list-group-item">Altura de piso: {{ medidas.alturapiso }}</li>
                  <li class="list-group-item">Capacidad de vadeo: {{ medidas.capacidadvadeo }}</li>
                  <li class="list-group-item">Ángulo de ataque: {{ medidas.anguloataque }}</li>
                  <li class="list-group-item">Ángulo de partida: {{ medidas.angulopartida }}</li>
                  <li class="list-group-item">Ángulo ventral: {{ medidas.anguloventral }}</li>
                  <li class="list-group-item">Remolque con frenos: {{ medidas.remolque }}</li>
                  <li class="list-group-item">Escalonamiento vertical: {{ medidas.escalonamiento }}</li>
                  <li class="list-group-item">Inclinacion lateral: {{ medidas.inclinacion }}</li>
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
            <h2 class="accordion-header" id="flush-headingFour">
              <button
                class="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#flush-collapseFive"
                aria-expanded="true"
                aria-controls="flush-collapseFive"
              >
                Seguridad
              </button>
            </h2>
            <div
              id="flush-collapseFive"
              class="accordion-collapse collapse"
              aria-labelledby="flush-headingFive"
              data-bs-parent="#accordionFlushExample"
              v-for="seguridad in seguridad"
              :key="seguridad.id"
            >
              <div class="accordion-body">
                <!-- Some borders are removed -->
                <ul class="list-group list-group-flush">
                  <li class="list-group-item">Airbag: {{ seguridad.airbag }}</li>
                  <li class="list-group-item">ABS: {{ seguridad.abs }}</li>
                  <li class="list-group-item">Distribucion Electronica de Frenado: {{ seguridad.distfrenado }}</li>
                  <li class="list-group-item">
                    Asistencia en frenada de emergencia: {{ seguridad.asistfrenado }}
                  </li>
                  <li class="list-group-item">Alarma e inmovilizador de motor: {{ seguridad.alarma }}</li>
                  <li class="list-group-item">Anclaje para asientos infantiles: {{ seguridad.anclaje }}</li>
                  <li class="list-group-item">Cinturones de seguridad: {{ seguridad.cinturones }}</li>
                  <li class="list-group-item">Otros (especificar): {{ seguridad.otros }}</li>
                  <li class="list-group-item">Sensor de lluvia: {{ seguridad.sensor }}</li>
                  <li class="list-group-item">Tercera luz de stop: {{ seguridad.terceraluz }}</li>
                  <li class="list-group-item">Autobloqueo de puertas con velocidad: {{ seguridad.autobloqueo }}</li>
                  <li class="list-group-item">Control de estabilidad: {{ seguridad.controlestabilidad }}</li>
                  <li class="list-group-item">Control de tracción:  {{ seguridad.controltraccion }}</li>
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
            <h2 class="accordion-header" id="flush-headingFour">
              <button
                class="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#flush-collapseSix"
                aria-expanded="true"
                aria-controls="flush-collapseSix"
              >
                Comunicacion y entretenimiento
              </button>
            </h2>
            <div
              id="flush-collapseSix"
              class="accordion-collapse collapse"
              aria-labelledby="flush-headingSix"
              data-bs-parent="#accordionFlushExample"
              v-for="entretenimiento in entretenimiento"
              :key="entretenimiento.id"
            >
              <div class="accordion-body">
                <!-- Some borders are removed -->
                <ul class="list-group list-group-flush">
                  <li class="list-group-item">Equipo de música: {{ entretenimiento.musica }}</li>
                  <li class="list-group-item">Bocinas: {{ entretenimiento.bocinas }}</li>
                  <li class="list-group-item">Conexión auxiliar: {{ entretenimiento.conex }}</li>
                  <li class="list-group-item">
                    Interfaz bluetooth: {{ entretenimiento.bluetooth }}
                  </li>
                  <li class="list-group-item">Pantalla en tablero: {{ entretenimiento.tablero }}</li>
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
            <h2 class="accordion-header" id="flush-headingFour">
              <button
                class="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#flush-collapseSeven"
                aria-expanded="true"
                aria-controls="flush-collapseSeven"
              >
                Confort
              </button>
            </h2>
            <div
              id="flush-collapseSeven"
              class="accordion-collapse collapse"
              aria-labelledby="flush-headingSeven"
              data-bs-parent="#accordionFlushExample"
              v-for="confort in confort"
              :key="confort.id"
            >
              <div class="accordion-body">
                <!-- Some borders are removed -->
                <ul class="list-group list-group-flush">
                  <li class="list-group-item">Aire acondicionado: {{ confort.aire }}</li>
                  <li class="list-group-item">Asientos delanteros: {{ confort.asientosd }}</li>
                  <li class="list-group-item">Asientos traseros: {{ confort.asientost }}</li>
                  <li class="list-group-item">
                    Cierre de puertas: {{ confort.cierre }}
                  </li>
                  <li class="list-group-item">Computadora de a bordo: {{ confort.computadora }}</li>
                  <li class="list-group-item">Espejo interior: {{ confort.espejoi }}</li>
                  <li class="list-group-item">Espejos exteriores: {{ confort.espejoe }}</li>
                  <li class="list-group-item">Faros antiniebla: {{ confort.farosniebla }}</li>
                  <li class="list-group-item">Faros delanteros: {{ confort.farosdelanteros }}</li>
                  <li class="list-group-item">Palanca de cambios: {{ confort.palanca }}</li>
                  <li class="list-group-item">Quemacocos: {{ confort.quemacocos }}</li>
                  <li class="list-group-item">Rines: {{ confort.rines }}</li>
                  <li class="list-group-item">Vestiduras: {{ confort.vestiduras }}</li>
                  <li class="list-group-item">Control de velocidad crucero: {{ confort.crucero }}</li>
                  <li class="list-group-item">Vidrios (delanteros y traseros): {{ confort.vidrios }}</li>
                  <li class="list-group-item">Volante: {{ confort.volante }}</li>
                  <li class="list-group-item">Apertura cajuela y tapa combustible: {{ confort.cajuela }}</li>
                  <li class="list-group-item">Sensor de estacionamiento: {{ confort.sensor }}</li>
                  <li class="list-group-item">Cámara de visión trasera: {{ confort.camara }}</li>
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
                <p class="text-small mb-0 text-muted">
                  {{ comentario.mensaje }}
                </p>
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
  overflow-y: scroll;
  justify-content: center;
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
  width: 12%;
  opacity: 1;
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

.car-image {
  height: 100%;
  width: 100%;
}
</style>
