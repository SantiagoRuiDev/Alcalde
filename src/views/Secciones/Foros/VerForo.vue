<template>
  <div class="container py-5 px-4">
    <div class="row rounded-lg overflow-hidden shadow">
      <!-- Users box-->
      <!-- Chat Box-->
      <div class="col px-0">
        <div class="px-4 py-5 chat-box bg-white">
          <!-- Sender Message-->

          <div
            class="media w-50 mb-3"
            v-for="mensaje in mensajes"
            :key="mensaje.id"
          >
            <img
              src="https://therichpost.com/wp-content/uploads/2020/06/avatar2.png"
              alt="user"
              width="50"
              class="rounded-circle"
            />
            <small class="text-muted mx-3">{{ mensaje.nombre }}</small>
            <div class="media-body ml-3 mt-2 d-flex gap-2 align-items-center">
              <div
                class="bg-light rounded py-2 px-3 mb-2"
                v-if="mensaje.mensaje != ''"
              >
                <p class="text-small mb-0 text-muted">{{ mensaje.mensaje }}</p>
              </div>
              <button
                @click="replyMessage(mensaje.id)"
                type="button"
                class="border-0 bg-transparent"
              >
                <span
                  class="material-symbols-outlined"
                  @click="replyMessage(mensaje.id)"
                >
                  reply
                </span>
              </button>
              <button
                type="button"
                class="border-0 bg-transparent d-flex items-center mb-1 gap-2"
                v-if="mensaje.likes.length > 0"
              >
                {{ mensaje.likes.length }}
                <span
                  class="material-symbols-outlined"
                  @click="likeMessage(mensaje.id)"
                >
                  thumb_up
                </span>
              </button>
              <button type="button" class="border-0 bg-transparent" v-else>
                <span
                  class="material-symbols-outlined"
                  @click="likeMessage(mensaje.id)"
                >
                  thumb_up
                </span>
              </button>
              <button
                @click="deleteMessage(mensaje.id)"
                type="button"
                class="border-0 bg-transparent"
              >
                <span
                  class="material-symbols-outlined"
                  @click="deleteMessage(mensaje.id)"
                >
                  delete
                </span>
              </button>
              <button
                @click="strikeUsuario(mensaje.id_usuario)"
                type="button"
                class="border-0 bg-transparent"
              >
                <span
                  class="material-symbols-outlined"
                  @click="strikeUsuario(mensaje.id_usuario)"
                >
                  warning
                </span>
              </button>
            </div>
            <div v-if="mensaje.imagen != ''">
              <img :src="mensaje.imagen" alt="Chat Message Image" />
            </div>

            <div class="" v-if="mensaje.replicas.length > 0">
              <div
                class=""
                v-for="replica in mensaje.replicas"
                :key="replica.id"
              >
                <div class="replica-box">
                  <img
                    src="https://therichpost.com/wp-content/uploads/2020/06/avatar3.png"
                    alt="user"
                    width="30"
                    class="rounded-circle"
                  />
                  <small class="text-muted mx-3"
                    >{{ replica.nombre }} : Replica a
                    {{ mensaje.nombre }}</small
                  >
                  <div
                    class="media-body ml-3 mt-2 d-flex gap-2 align-items-center"
                  >
                    <div
                      class="bg-light rounded py-2 px-3 mb-2"
                      v-if="replica.mensaje != ''"
                    >
                      <p class="text-small mb-0 text-muted">
                        {{ replica.mensaje }}
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
        <!-- Typing area -->
        <form action="#" class="bg-light" v-if="reply">
          <button type="button" class="border-0 bg-transparent my-2">
            <span class="material-symbols-outlined" @click="closeReply()">
              close
            </span>
          </button>
          <div
            class="px-2 pt-2 items-center d-grid text-secondary"
            v-if="selectedFile != null"
          >
            Imagen Seleccionada: {{ selectedFile.name }}
          </div>
          <div class="input-group">
            <input
              type="text"
              v-model="mensaje"
              placeholder="Replica a este mensaje"
              aria-describedby="button-addon2"
              class="form-control rounded-0 border-0 py-4 bg-light"
            />
            <div class="input-group-append d-grid">
              <button
                id="button-addon2"
                type="button"
                class="btn btn-link"
                v-on:click="crearMensaje"
              >
                <i class="fa fa-paper-plane"></i>
              </button>
              <label for="image" id="button-addon2" class="btn btn-link">
                <i class="fa fa-camera"></i
              ></label>
              <input
                type="file"
                name="image"
                id="image"
                class="d-none"
                @change="changeFile"
              />
            </div>
          </div>
        </form>

        <form action="#" class="bg-light" v-else>
          <div
            class="px-2 pt-2 items-center d-grid text-secondary"
            v-if="selectedFile != null"
          >
            Imagen Seleccionada: {{ selectedFile.name }}
          </div>
          <div class="input-group">
            <input
              type="text"
              v-model="mensaje"
              placeholder="Escribe un nuevo mensaje"
              aria-describedby="button-addon2"
              class="form-control rounded-0 border-0 py-4 bg-light"
            />
            <div class="input-group-append d-grid">
              <button
                id="button-addon2"
                type="button"
                class="btn btn-link"
                v-on:click="crearMensaje"
              >
                <i class="fa fa-paper-plane"></i>
              </button>
              <label for="image" id="button-addon2" class="btn btn-link">
                <i class="fa fa-camera"></i
              ></label>
              <input
                type="file"
                name="image"
                id="image"
                class="d-none"
                @change="changeFile"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
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

<script>
export default {
  data() {
    return {
      mensajes: [],
      mensaje: "",
      reply: false,
      replyId: null,
      replicas: [],
      data: new FormData(),
      selectedFile: null,
      likes: [],
      URL_STRIKES: "http://localhost:3000/api/strikes/sancionar/",
      URL_LISTAR: "http://localhost:3000/api/foros/",
      URL_CREAR: "http://localhost:3000/api/foros/crear/mensaje/",
      URL_REPLY: "http://localhost:3000/api/foros/crear/reply/",
      URL_LIKE: "http://localhost:3000/api/foros/crear/like/",
      URL_ELIMINAR: "http://localhost:3000/api/foros/delete/mensaje/",
      URL_ELIMINAR_REPLY: "http://localhost:3000/api/foros/delete/reply/",
    };
  },
  created: function () {
    this.cargarMensajes();
  },
  methods: {
    changeFile(event) {
      this.selectedFile = event.target.files[0];
    },

    cargarMensajes() {
      this.axios
        .get(this.URL_LISTAR + this.$route.params.id, {
          headers: {
            "x-access-token": this.$store.getters.getUserToken,
          },
        })
        .then((response) => {
          this.mensajes = response.data[0];
          this.replicas = response.data[1];
          this.likes = response.data[2];
          this.ordenarMensajes();
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

    deleteMessage(id) {
      this.axios
        .post(
          this.URL_ELIMINAR + id,
          {},
          {
            headers: {
              "x-access-token": this.$store.getters.getUserToken,
            },
          }
        )
        .then((response) => {
          this.cargarMensajes();
        });
    },

    likeMessage(mensaje) {
      this.axios
        .post(
          this.URL_LIKE + this.$route.params.id,
          { id_mensaje: mensaje },
          {
            headers: {
              "x-access-token": this.$store.getters.getUserToken,
            },
          }
        )
        .then((response) => {
          this.cargarMensajes();
        });
    },

    deleteReply(id) {
      this.axios
        .post(
          this.URL_ELIMINAR_REPLY + id,
          {},
          {
            headers: {
              "x-access-token": this.$store.getters.getUserToken,
            },
          }
        )
        .then((response) => {
          this.cargarMensajes();
        });
    },

    replyMessage(id) {
      this.reply = true;
      this.replyId = id;
    },

    closeReply() {
      this.reply = false;
      this.replyId = null;
    },

    ordenarMensajes() {
      // La funcionalidad seria crear un objeto por cada mensaje y sus replicas
      // {mensaje: mensaje, replicas: [replicas]} En el arreglo this.mensajes;

      let mapNewMensajes = [];

      this.mensajes.forEach((mensaje) => {
        mapNewMensajes.push({
          id: mensaje.id,
          id_usuario: mensaje.id_usuario,
          nombre: mensaje.nombre,
          imagen: mensaje.imagen,
          mensaje: mensaje.mensaje,
          likes: this.likes.filter((like) => like.id_mensaje == mensaje.id),
          replicas: this.replicas.filter(
            (replica) => replica.id_mensaje == mensaje.id
          ),
        });
      });

      this.mensajes = mapNewMensajes;
    },

    crearMensaje() {
      if (this.reply) {
        this.data.delete("mensaje");
        this.data.delete("imagen");
        this.data.delete("id_mensaje");
        this.data.append("mensaje", this.mensaje);
        this.data.append("id_mensaje", this.replyId);
        this.data.append("imagen", this.selectedFile);
        if (this.mensaje.trim() != "" || this.selectedFile != null) {
          this.axios
            .post(this.URL_REPLY + this.$route.params.id, this.data, {
              headers: {
                "x-access-token": this.$store.getters.getUserToken,
              },
            })
            .then((response) => {
              this.mensaje = "";
              this.cargarMensajes();
            })
            .catch((error) => {
              this.$swal.fire({
                icon: "error",
                title: "Oops...",
                text:
                  error.response.data.message || "Error al crear el mensaje",
              });
            });
        }
      } else {
        this.data.delete("mensaje");
        this.data.delete("imagen");
        this.data.append("mensaje", this.mensaje);
        this.data.append("imagen", this.selectedFile);
        if (this.mensaje.trim() != "" || this.selectedFile != null) {
          this.axios
            .post(this.URL_CREAR + this.$route.params.id, this.data, {
              headers: {
                "x-access-token": this.$store.getters.getUserToken,
              },
            })
            .then((response) => {
              this.mensaje = "";
              this.cargarMensajes();
            })
            .catch((error) => {
              this.$swal.fire({
                icon: "error",
                title: "Oops...",
                text:
                  error.response.data.message || "Error al crear el mensaje",
              });
            });
        }
      }
    },
  },
};
</script>
