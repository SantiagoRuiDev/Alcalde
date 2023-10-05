<script>
import Spinner from '../../../components/Spinner.vue'
export default {
    components: {Spinner},
    data(){
        return {
            articulos: [],
            URL: 'http://localhost:3000/api/articulos/',
            loading: false
        }
    },
    created: function () { this.getArticulos() },
    methods: {
        getArticulos () {
            this.loading = true;
            this.axios.get(this.URL, {
            headers: {
                'x-access-token': this.$store.getters.getUserToken
            }
            }).then(response => {
                this.articulos = response.data;
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
        <div class="card" v-for="articulo in articulos" :key="articulo.id">
                <img :src="articulo.portada" class="card-img-top" alt="...">
                <div class="card-body">
                    <h6 class="card-title mb-3">{{ articulo.titulo }}</h6>
                    <p class="card-subtitle mb-2 text-muted">{{ articulo.subtitulo }}</p>
                    <RouterLink :to="{name: 'articulo', params: {id: articulo.id}}" class="btn btn-block btn-danger w-100 mt-3">Revisar noticia</RouterLink>
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