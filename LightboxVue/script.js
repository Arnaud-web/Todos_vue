// 30 30
Vue.directive('lightbox',{
	bind (el,binding){
		let index = store.addImage(el.getAttribute('href'))
		el.addEventListener ('click', function (e) {
			e.preventDefault();
			//store.state.image = el.getAttribute('href')
			store.open(index)
			//open (el.getAttribute('href'))
		})
	}
})


let lightboxImage = {
	props : {
		image : String
	},
	data (){
		return {
			loading: true,
			src: false,
			style : []
		}
	},
	methods: {
		resizeImage (image){
			let width = image.width
			let height = image.height
			if (width > window.innerWidth || height > window.innerHeight){
				let ratio = width /height
				let windowRatio = window.innerWidth / window.innerHeight

				if (ratio > windowRatio){
					width = window.innerWidth
					height = width/ratio
				} else {
					height = window.innerHeight
					width = height * ratio
				}
			}
			// console.log(image.width, image.height)
			this.style = {
				width: width + 'px',
				height : height + 'px',
				top : ((window.innerHeight - height) * 0.5) + 'px',
				left : ((window.innerWidth - width) * 0.5) + 'px',


			}
		}
	},
	mounted() {
		let image = new window.Image() 
		image.onload = _ => {
			this.loading = false
			this.src = this.image
			this.resizeImage(image)
		
		}
		image.src = this.image
		this.resizeEvent = () => {
			console.log('resize')
			this.resizeImage(image)
		}
		window.addEventListener('resize', this.resizeEvent  )
	},
	destroyed() {
		window.removeEventListener('resize',this.resizeEvent)
	},
	template : ` 
		<div @click.stop>
			<div  class = "lightbox__loading" v-if = "loading">
				<div  class = "lightbox__loading x" ></div>
			</div>
			<transition name = "lightbox-fade" >
				<img :src= "src" class = "lightbox__image" :style = "style" >
			</transition>

		</div>
	`
}



let lightbox = {

	data (){
		return {
			state : store.state,
			direction : 'next'
		}
	},
	components : {lightboxImage},
	methods: {
		close (){
			store.close()
		},
		next(){
			console.log('next')
			this.direction = 'next'
			store.next()
		},
		prev(){
			console.log('prev')
			this.direction = 'prev'
			store.prev()
		}
		

	},
	
	computed: {
		image() {
			if (this.state.index !== false){
				return this.state.images[this.state.index ]
			}
		},
		transition(){
			return 'lightbox-' + this.direction 
		}
	},
	
	template : ` 
		<div class = "lightbox"  v-if="image" @click = "close" >
			<transition :name = "transition" >
				<lightbox-image :image = "image" :key="image" ></lightbox-image>				
			</transition>
			<div class="lightbox__close" @click = "close" >close</div>
			<div class="but lightbox__next" @click.stop = "next" >next</div>
			<div class="but lightbox__prev" @click.stop = "prev" >prev</div>

		</div>
	`
} 













let vm1 = new Vue({
	el : "#app",
	data : {
		style : {
			width : 200 + 'px',
			higth : 'auto'
		}
	},
	components : { lightbox },

	template : ` 
		<div>
			<a :href =  "'images/image' +n+ '.png '"  v-lightbox v-for = " n in 5 " >
				<img :src = "'images/image' +n+ '.png '" :style = "style" >
			</a>
			<lightbox></lightbox>
		</div>
	`
})