<script>
import axios  from 'axios';
export default {
    data(){
        return {
            reportes: [],
            URL_STRIKES: "http://localhost:3000/api/strikes/sancionar/",
            URL_BAN: "http://localhost:3000/api/usuario/ban/",
            URL_CERRAR: "http://localhost:3000/api/reportes/eliminar/"
        }
    },
    created: function () {
        this.getReportes();
    },
    methods:{
        getReportes () {
            axios.get('http://localhost:3000/api/reportes', {
            headers: {
                'x-access-token': this.$store.getters.getUserToken
            }
            }).then(response => {
                this.reportes = response.data;
            }).catch(error => {
                console.log(error);
            })
        },

        sancionarUsuario(id){
            this.$swal.fire({
                icon: 'warning',
                title: '¿Quieres sancionar este usuario?',
                text: 'Este tiene un maximo de 3 sanciones',
                confirmButtonText: 'Sancionar',
                confirmButtonColor: '#f1bc90',
                }).then((result) => {
                if (result.isConfirmed) {
                    axios.post(this.URL_STRIKES + id, {}, {
                        headers: {
                            'x-access-token': this.$store.getters.getUserToken,
                        }
                     }).then(response => {
                        this.$swal.fire(
                        'Sancionado',
                        response.data.message,
                        'success'
                        )
                        location.reload();
                    }).catch(error => {
                        console.log(error);
                    })

                }
                })
            },

            banearUsuario(id){
                this.$swal.fire({
                    icon: 'error',
                    title: '¿Quieres banear a este usuario?',
                    text: 'Este podra ser desbaneado',
                    confirmButtonText: 'Banear',
                    confirmButtonColor: '#FF380E',
                    }).then((result) => {
                    if (result.isConfirmed) {
                        axios.post(this.URL_BAN + id, {}, {
                            headers: {
                                'x-access-token': this.$store.getters.getUserToken,
                            }
                        }).then(response => {
                            this.$swal.fire(
                            'Sancionado',
                            response.data.message,
                            'success'
                            )
                            location.reload();
                        }).catch(error => {
                            console.log(error);
                        })

                    }
                    })
                },


                cerrarReporte(id){
                    this.$swal.fire({
                        icon: 'question',
                        title: '¿Quieres cerrar este reporte?',
                        text: 'No podras deshacer tus acciones',
                        confirmButtonText: 'Cerrar',
                        confirmButtonColor: '#0ECCFF',
                        }).then((result) => {
                        if (result.isConfirmed) {
                                axios.post(this.URL_CERRAR + id, {}, {
                                    headers: {
                                        'x-access-token': this.$store.getters.getUserToken,
                                    }
                                }).then(response => {
                                    this.$swal.fire(
                                    'Eliminado',
                                    response.data.message,
                                    'success'
                                    )
                                    location.reload();
                                }).catch(error => {
                                    console.log(error);
                                })

                            }
                        })
                    }

        }
    }
</script>

<template>
    
    <div class="table-responsive">
        <table class="table table-light">
            <thead>
                <tr class="text-center">
                    <th scope="col">Usuario</th>
                    <th scope="col">Foro ID</th>
                    <th scope="col">Articulo ID</th>
                    <th scope="col">Reseña ID</th>
                    <th scope="col">Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr class="text-center" v-for="reporte in reportes" :key="reporte.id">
                    <td>{{reporte.id_usuario}}</td>
                    <td>{{reporte.id_foro}}</td>
                    <td>{{reporte.id_articulo}}</td>
                    <td>{{reporte.id_resena}}</td>
                    <td class="d-flex flex-row gap-1 justify-content-center">
                        <span class="material-symbols-outlined btn btn-warning p-1" v-on:click="sancionarUsuario(reporte.id_usuario)">
                        warning
                        </span>

                        <span class="material-symbols-outlined btn btn-danger p-1" v-on:click="banearUsuario(reporte.id_usuario)">
                        dangerous
                        </span>

                        <span class="material-symbols-outlined btn btn-primary p-1" v-on:click="cerrarReporte(reporte.id)">
                        shield_lock
                        </span>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    


</template>