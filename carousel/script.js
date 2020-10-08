
let carousel = {

	data() {
		return {
			index : 0,
			slides : [],
			diretion : 'right'
		}
	},
	mounted() {
		this.slides = this.$children
		// this.slides.forEach((slide, i) => {
		// 	slide.index = i
		// })
	},
	computed : {
		slidesCount () { return this.slides.length }
	},
	methods: {
		next(){
			this.index++
			this.diretion = 'right'
			if (this.index >= this.slidesCount ){
				this.index = 0
			}
		},
		prev(){
			this.index--
			console.log('prev', this.index)
			this.diretion = 'left'
			if (this.index == (-1) ){
				this.index = this.slidesCount -1
			}
		},

		goto(index){
			this.diretion = index > this.index ? 'right' : 'left'
			this.index = index
		}

	},
	template : `
		<div class = " carouesl "  >
			<slot></slot>
			<button class = "carousel__nav carousel__next" @click.prevent = "next"  > Suivante </button>
			<button class = "carousel__nav carousel__prev" @click.prevent = "prev" > prev </button>
			<div class = " carousel__pagination " >
				<button v-for = "n in slidesCount" 
				@click = "goto(n-1)"  :class = "{ active: n-1 === index }"		
				> 
					{{ n }} 
				</button>
			</div>
			
		</div>
	
	`
}




let carouselSlide = {

	// data (){
	// 	return {
	// 		index : 0
	// 	}
	// },
	props : {
		index : {type : Number , default : 0},
	},
	computed: {
		visible (){
			return this.index === this.$parent.index
		},
		transition () {
			return 'slide-'+this.$parent.diretion
		}
	},

	template : `
	<transition :name = "transition" >
		<div v-show = "visible" >
		index : {{ index }}
		<slot></slot>
		</div>
	</transition>
	`
} 
let vm1 = new Vue({
	el : '#app',
	data (){
		return {
			slides: 4
		}
	},
	components : {carousel,carouselSlide},
	template : `
		<div>
			<carousel>
				<carousel-slide v-for="n in slides " :index = "n - 1" >
					Salut les gens {{ n }}
					<img width = "100%" :src = "'http://localhost/todos/carousel/images/image' +n+ '.png'" >
				</carousel-slide>
			</carousel>
		</div>
	`
	
})
