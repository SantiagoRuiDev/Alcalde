<script>
export default {
    data(){
        return {
            resenas: [],
            URL: "http://localhost:3000/api/resenas/",
            loading: true,
            detalles: []
        }
    },

    created: function () { this.getResena() },

    methods: {
        getResena(){
            this.axios.get(this.URL + this.$route.params.id, {
                headers: {
                    'x-access-token': this.$store.getters.getUserToken
                }
            }).then(response => {
                this.resenas.push(response.data[0]);
                this.detalles.push(response.data[1]);
            }).catch(err => {
                console.log(err)
            }) 
        }
    }
}

</script>










<template>
                <div class="card mx-auto" v-for="resena in resenas" :key="resena.id">
                    <img :src="resena.imagen">
                    <div class="card-body pt-0 px-0">
                        <div class="d-flex flex-row justify-content-center mt-3 px-3">
                            <small class="mt-1 fs-6 fw-bold text-center">{{resena.titulo}}</small>
                        </div>
                        <hr class="mt-2 mx-3">
                        
                        <div class="caracteristicas" v-for="detalle in detalles" :key="detalle.id">
                            <div class="d-flex flex-row justify-content-between px-3 pb-4">
                            <div class="d-flex flex-column"><span class="text-muted">Marca</span><small class="text-muted fs-6">{{detalle.marca}}</small></div>
                            </div>
                            <div class="d-flex flex-row justify-content-between px-3 pb-4">
                                <div class="d-flex flex-column"><span class="text-muted">Modelo</span><small class="text-muted fs-6">{{detalle.modelo}}</small></div>
                            </div>
                            <div class="d-flex flex-row justify-content-between px-3 pb-4">
                                <div class="d-flex flex-column"><span class="text-muted">Año</span><small class="text-muted fs-6">{{detalle.ano}}</small></div>
                            </div>
                            <div class="d-flex flex-row justify-content-between px-3 pb-4">
                                <div class="d-flex flex-column"><span class="text-muted">HP</span><small class="text-muted fs-6">{{detalle.hp}}</small></div>
                            </div>
                            <div class="d-flex flex-row justify-content-between px-3 pb-4">
                                <div class="d-flex flex-column"><span class="text-muted">Combustible</span><small class="text-muted fs-6">{{detalle.combustible}}</small></div>
                            </div>
                            <div class="d-flex flex-row justify-content-between px-3 pb-4">
                                <div class="d-flex flex-column"><span class="text-muted">Puertas</span><small class="text-muted fs-6">{{detalle.puertas}}</small></div>
                            </div>
                            <div class="d-flex flex-row justify-content-between px-3 pb-4">
                                <div class="d-flex flex-column"><span class="text-muted">Transmision</span><small class="text-muted fs-6">{{detalle.transmision}}</small></div>
                            </div>
                            <div class="d-flex flex-row justify-content-between px-3 pb-4">
                                <div class="d-flex flex-column"><span class="text-muted">Motor</span><small class="text-muted fs-6">{{detalle.motor}}</small></div>
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
.card{
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

@media only screen and (min-width: 800px){
    .caracteristicas{
        flex-direction: row;
    }
    .card {
        width: 90%;
    }
}

.card-img-top{
	border-top-right-radius: 10px;
	border-top-left-radius: 10px;
}
span.text-muted{
	font-size: 12px;
}
small.text-muted{
	font-size: 8px;
}
h5.mb-0{
	font-size: 1rem;
}
small.ghj{
	font-size: 9px;
}
.mid{
	background: #ECEDF1;
}
h6.ml-1{
	font-size: 13px;
}
small.key{
	text-decoration: underline;
	font-size: 9px;
	cursor: pointer;
}
.btn-danger{
	color: #FFCBD2;
}
.btn-danger:focus{
	box-shadow: none;
}
small.justify-content-center{
	font-size: 9px;
	cursor: pointer;
	text-decoration: underline;
}

@media screen and (max-width:600px){
    .col-sm-4{
        margin-bottom: 50px;
    }
}
</style>