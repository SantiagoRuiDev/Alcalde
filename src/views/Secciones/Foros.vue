<template>
  
  <div class="ibox-content forum-container" id="forumContainer">
    <div class="forum-title">
      <h3>Foros</h3>
    </div>

    <div class="forum-item active">
      <div class="row">
        <div class="col-md-9">
          <div class="forum-icon">
            <i class="fa fa-shield"></i>
          </div>
          <RouterLink to="/" class="forum-item-title forumLink"
            >Eurotruck Simulator 2022</RouterLink
          >
          <div class="forum-sub-title">Autor: Jorge Mendez</div>
        </div>
        <div class="col-md-1 forum-info" v-on:click="reportarForo()">
          <span class="material-symbols-outlined"> warning </span>
          <div>
            <small>Reportar</small>
          </div>
        </div>
        <div class="col-md-2 forum-info" v-on:click="eliminarForo()">
          <span class="material-symbols-outlined"> delete </span>
          <div>
            <small>Eliminar</small>
          </div>
        </div>
      </div>
    </div>
    

    <div class="forum-title text-end">
      <a
        class="btn btn-success d-inline-flex align-items-center"
        href="#"
        role="button" data-bs-toggle="modal" data-bs-target="#modalId"
      >
        <span class="material-symbols-outlined me-2"> add </span>
        Nuevo Foro
      </a>
    </div>
  </div>

  
  <div class="modal fade" id="modalId" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false" role="dialog" aria-labelledby="modalTitleId" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-md" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="modalTitleId">¿Quieres crear un nuevo foro?</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="my-3 w-100 p-3 mx-auto">
          <label for="" class="form-label">Tematica del Foro</label>
          <input type="text"
            class="form-control" name="" id="" aria-describedby="helpId" placeholder="Ej: Motos ultimo modelo">
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
          <button type="button" class="btn btn-primary">Crear</button>
        </div>
      </div>
    </div>
  </div>

</template>


<script>
  export default {
    data(){
      return {
        foros: []
      }
    },
    methods: {
      reportarForo(){
        this.$swal.fire({
          icon: 'warning',
          title: '¿Quieres reportar este foro?',
          text: 'Reporta el foro, si tiene contenido indebido o malicioso',
          confirmButtonText: 'Reportar',
          confirmButtonColor: '#f1bc90',
        })
      },
      eliminarForo(){
        this.$swal.fire({
          icon: 'warning',
          title: '¿Quieres eliminar este foro?',
          text: 'Solo podras eliminar este foro si eres moderador o admin, no podras rehacer cambios',
          confirmButtonText: 'Eliminar',
          confirmButtonColor: '#f1bc90',
        })
      }
    }
  }

</script>