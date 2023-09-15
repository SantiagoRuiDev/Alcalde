<script>
import Spinner from '../../../components/Spinner.vue'
export default {
    components: {Spinner},
    data(){
        return {
            listas: [],
            URL: 'http://localhost:3000/api/listas/ver',
            loading: false
        }
    },
    created: function () { this.getListas() },
    methods: {
        getListas () {
            this.loading = true;
            this.axios.get(this.URL, {
            headers: {
                'x-access-token': this.$store.getters.getUserToken
            }
            }).then(response => {
                this.listas = response.data;
                this.loading = response.data.length > 0 ? false : true;
            }).catch(error => {
                console.log(error);
            })
        }
    }
}

</script>



<template>
    
    <Spinner v-if="loading"/>

    <div class="articulos w-75 mx-auto gap-3">
        <div class="card" v-for="lista in listas" :key="lista.id">
                <img :src="lista.imagen" class="card-img-top" alt="...">
                <div class="card-body">
                    <h6 class="card-title mb-3">{{ lista.titulo }}</h6>
                    <p class="card-subtitle mb-2 text-muted">{{ lista.subtitulo }}</p>
                    <RouterLink :to="{name: 'listaver', params: {id: lista.id}}" class="btn btn-block btn-danger w-100 mt-3">Revisar lista</RouterLink>
                </div>
        </div>
    </div>

</template>


<style scoped>
.articulos{
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
}


</style>