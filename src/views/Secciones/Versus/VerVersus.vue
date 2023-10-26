<script>
import Spinner from '../../../components/Spinner.vue'
export default {
    components: {Spinner},
    data() {
        return {
            versus: [],
            votosInfo: [],
            porcentajeCoche1: [],
            porcentajeCoche2: [],
            URL: "http://localhost:3000/api/versus/",
            URL_VOTE: "http://localhost:3000/api/versus/votar/",
            URL_SEE: "http://localhost:3000/api/versus/votos/"
        }
    },
    created: function () { 
        this.callApiVersus(); 
    },
    methods: {

        calculateVotes(){
            const sumaTotalPuntos = this.votosInfo.reduce((total, objeto) => total + Number(objeto.PuntosTotales), 0);

            // Paso 2: Calcula el porcentaje de puntos para cada posición
            this.porcentajeCoche1 = [{
                puntos: this.votosInfo[0].PuntosTotales,
                coche: this.votosInfo[0].id_coche,
                porcentaje: parseFloat((this.votosInfo[0].PuntosTotales / sumaTotalPuntos) * 100).toFixed(2)
            }];
            this.porcentajeCoche2 = [{
                puntos: this.votosInfo[1].PuntosTotales,
                coche: this.votosInfo[1].id_coche,
                porcentaje: parseFloat((this.votosInfo[1].PuntosTotales / sumaTotalPuntos) * 100).toFixed(2)
            }];
        },

        async callApiVersus(){
            this.axios.get(this.URL + this.$route.params.id, {
                headers: {
                    'x-access-token': this.$store.getters.getUserToken
                }
            })
            .then((response) => {
                this.versus = response.data;
            })
            .catch(error => {
                console.log(error)
            })

            this.axios.get(this.URL_SEE + this.$route.params.id, {
                headers: {
                    'x-access-token': this.$store.getters.getUserToken
                }
            })
                .then((response) => {
                    this.votosInfo = response.data;
                    this.calculateVotes();
                    console.log(this.votosInfo)
                })
                .catch(error => {
                    console.log(error)
                });
        },
        votar(id_coche){
            this.axios.post(this.URL_VOTE + this.$route.params.id, {id_coche: id_coche},{
                headers: {
                    'x-access-token': this.$store.getters.getUserToken
                }
            })
            .then((response) => {
                if(response.status == 200){
                    this.$swal.fire({
                        title: 'Voto realizado',
                        text: response.data.message,
                        icon: 'success',
                        confirmButtonText: 'Aceptar'
                    })
                }
            })
            .catch(error => {
                
                    this.$swal.fire({
                        title: 'Error',
                        text: error.response.data.error,
                        icon: 'error',
                        confirmButtonText: 'Aceptar'
                    })
                
            })
        }
    }
}
</script>


<template>

    <div class="card" v-for="versus in versus" :key="versus.versus_id">
        <div class="card-body d-grid">
            <div class="row justify-content-center">
                <div class="col-md-4 align-items-center justify-content-center d-grid gap-2">
                    <img :src="versus.coche1_imagen" alt="Imagen vehiculo" style="height: 150px;">
                    <a :href="'/res/ver/' + versus.coche1_id" class="card-title fs-2 text-decoration-none">{{ versus.coche1_titulo }}</a>
                    <p class="card-text">Calificaciones: {{ versus.coche1_calificaciones }}</p>
                    <p class="card-text" v-for="porcentaje in porcentajeCoche1"  :key="porcentaje.coche">
                        Votos Obtenidos: {{ porcentaje.puntos }}<br>
                        <br>
                        Porcentaje Obtenido: {{ porcentaje.porcentaje }}%</p>
                    <button class="btn-block btn btn-primary" v-on:click="votar(versus.coche1_id)">Votar</button>
                </div>
                <div class="col-4 d-grid align-items-center text-center justify-content-center">
                    <h2 class="fs-1 fw-bold col">VS</h2>
                </div>
                <div class="col-md-4 align-items-center justify-content-center d-grid gap-2">
                    <img :src="versus.coche2_imagen" alt="Imagen vehiculo" style="height: 150px;">
                    <a :href="'/res/ver/' + versus.coche2_id" class="card-title fs-2 text-decoration-none">{{ versus.coche2_titulo }}</a>
                    <p class="card-text">Calificaciones: {{ versus.coche2_calificaciones }}</p>
                    <p class="card-text" v-for="porcentaje in porcentajeCoche2"  :key="porcentaje.coche">
                        Votos Obtenidos: {{ porcentaje.puntos }}<br>
                        <br>
                        Porcentaje Obtenido: {{ porcentaje.porcentaje }}%</p>
                    <button class="btn-block btn btn-secondary" v-on:click="votar(versus.coche2_id)">Votar</button>
                </div>
            </div>
            <row>

                <div class="progress col mt-5 mx-auto">
                    <div class="progress-bar bg-primary" v-for="porcentaje in porcentajeCoche1" :key="porcentaje.coche" role="progressbar" :style="{width: porcentaje.porcentaje + '%'}" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
                    <div class="progress-bar bg-secondary" v-for="porcentaje in porcentajeCoche2" :key="porcentaje.coche" role="progressbar" :style="{width: porcentaje.porcentaje + '%'}" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
                </div>

            </row>
        </div>
    </div>



</template>