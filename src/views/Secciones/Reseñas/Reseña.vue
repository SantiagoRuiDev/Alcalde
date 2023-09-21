<script>
export default {
    data(){
        return {
            resenas: [],
            URL: "http://localhost:3000/api/resenas/",
            URL_CALIFICAR: "http://localhost:3000/api/calificaciones/crear",
            loading: true,
            detalles: []
        }
    },

    created: function () { this.getResena() },

    methods: {
        getResena () {
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
        },
        
        calificarResena (id, caf) {
            let data = {id_resena: id, calificacion: caf};
            this.axios.post(this.URL_CALIFICAR, data, {
                headers: {
                    'x-access-token': this.$store.getters.getUserToken
                }
            }).then(response => {
                this.$swal.fire({
                    icon: 'success',
                    title: response.data.message,
                    showConfirmButton: false,
                    timer: 1500
                })
            }).catch(err => {
                this.$swal.fire({
                    icon: 'error',
                    title: err.response.data.error,
                    showConfirmButton: false,
                    timer: 1500
                })
            })
        }
    }
}

</script>










<template>
                <div class="card mx-auto" v-for="resena in resenas" :key="resena.id">
                    <img :src="resena.imagen">
                    <div class="card-body pt-0 px-0">
                        <div class="d-flex flex-column text-center justify-content-center mt-3 px-3">
                            <small class="mt-1 fs-6 fw-bold text-center">{{resena.titulo}}</small>
                            <p>{{ resena.descripcion }}</p>

                            <div class="rate">
                                <input type="radio" id="star5" name="rate" value="5" v-on:click="calificarResena(resena.id, 5)" />
                                <label for="star5" title="text">5 stars</label>
                                <input type="radio" id="star4" name="rate" value="4" v-on:click="calificarResena(resena.id, 4)" />
                                <label for="star4" title="text">4 stars</label>
                                <input type="radio" id="star3" name="rate" value="3" v-on:click="calificarResena(resena.id, 3)" />
                                <label for="star3" title="text">3 stars</label>
                                <input type="radio" id="star2" name="rate" value="2" v-on:click="calificarResena(resena.id, 2)" />
                                <label for="star2" title="text">2 stars</label>
                                <input type="radio" id="star1" name="rate" value="1" v-on:click="calificarResena(resena.id, 1)" />
                                <label for="star1" title="text">1 star</label>
                            </div>
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

.rate {
    float: left;
    height: 46px;
    padding: 0 10px;
}
.rate:not(:checked) > input {
    position:absolute;
    top:-9999px;
}
.rate:not(:checked) > label {
    width:1em;
    overflow:hidden;
    white-space:nowrap;
    cursor:pointer;
    font-size:30px;
    color:#ccc;
}
.rate:not(:checked) > label:before {
    content: '★ ';
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