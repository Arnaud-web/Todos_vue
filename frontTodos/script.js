Vue.use(VueResource)
Vue.http.options.root = 'http://localhost/todos/backTodos/'
let todo = {
	props : {
		value : {type: Array, default(){ return [] }}
	},	
	data: function(){
		return {
			todos:this.value,
			newTodo: '',
			filter : 'all',
			editing : null,
			oldTodo: '',
			i : 0,
			idTemp : 0,
			del : false
		}
	},
	methods : {
		
		save(){
			this.$lien = this.$resource('insertTodos.php?nom='+this.newTodo)
			this.$lien.save().then((response) => {
				console.log('success',response.data)
            }, (response) => {
            console.log( 'erreur', response )
			})
			// save(){
			// 	this.$save = this.$resource('insertTodos.php')
			// 	this.$http.put("http://localhost/todos/backTodos/insertTodos.php?nom="+ this.newTodo,{
			// 		name : this.newTodo
			// 	}).then((response) => {
			// 		console.log('success',response.data)
			// 	}, (response) => {
			// 	console.log( 'erreur', response )
			// 	})
		},
		delete(todo){
			this.$lien = this.$resource('deleteTodos.php?id='+ todo.id)
			this.$lien.remove().then((response) => {
				console.log('delete',response.data)
            }, (response) => {
            console.log( 'erreur', response )
            })
		},
		completedTodo(todo){
			this.$lien = this.$resource('completedTodos.php?id='+ todo.id+"&completed="+ !todo.completed)
			this.$lien.update().then((response) => {
				console.log('completed',response.data)
            }, (response) => {
            console.log( 'erreur', response )
            })
		},
		updateName(todo){
			this.$lien = this.$resource('completedTodos.php?id='+ todo.id+"&name="+todo.name)
			this.$lien.update().then((response) => {
				console.log('updateName',response.data)
            }, (response) => {
            console.log( 'erreur', response )
            })
		},
		addTodo (){
			
			this.todos.push({
				id : this.id,
				completed : false,
				name : this.newTodo
			})
			this.save()
			this.newTodo = ''
			// console.log(this.todos)
		},
		affiche(){
				console.log(this.$data.todos)
		},
		deleteTodo(todo){
			this.idTemp = Number(this.todos[this.todos.length -1 ].id) 
			this.todos = this.todos.filter(todo_i => todo_i !== todo)
			this.$emit('input', this.todos)
			console.log(this.idTemp)	
			this.del= true
			this.delete(todo)
		},
		deleteCompleted(){
			let todos = this.todos.filter(todo => todo.completed)			
			this.todos = this.todos.filter(todo => !todo.completed)
			for (let i = 0; i < todos.length; i++) {
				const todo = todos[i];
				this.delete(todo)
				// console.log(i)	
			}
			this.$emit('input', this.todos)
		},
		editTodo(todo){
			this.editing = todo
			this.oldTodo = todo.name	
		},
		doneEdit(){
			if(this.editing){
				if(this.oldTodo !== this.editing.name){
					console.log('editing')
					this.updateName(this.editing)
				}
			}
			this.editing = null
		},
		cancelEdit (){
			this.editing.name = this.oldTodo
			this.doneEdit()
		}
		
	},
	
	computed : {
		id(){
			if (this.todos.length > 1){
				this.idTemp = Number(this.todos[this.todos.length  -1 ].last_id) + 1
				return this.idTemp
			}
			
			return  1
		},
		remainig (){
			return this.todos.filter(function(todo) { return !todo.completed}).length
		},
		remainigs () {
			return this.todos.filter(todo => !todo.completed).length
		},
		completed () {
			return this.todos.filter(todo => todo.completed).length
		},
		filteredTodos (){
			if (this.filter === 'todo'){
				return this.todos.filter(todo => !todo.completed)
			} else if (this.filter === 'done'){
				return this.todos.filter(todo => todo.completed)
			}
			return this.todos
		},
		allDone : {
			get(){
				return this.remainig === 0
			},
			set(value){	
				this.todos.forEach(todo => {
					this.completedTodo(todo)
					todo.completed = value
				})
				console.log('value : ', value)
			}
		},
		hasTodos(){
			return this.todos.length > 0
		},
		allTodos (){
			return this.todos.length
		}
		
	},
	watch : {
		value (value){
			this.todos = value
		},
		
	},

	directives:{
		focus (el ,value){
			if (value){
				Vue.nextTick(_ => {
					el.focus()
				})
			}
		}
	},
	template : 
	`<div class = 'todo_body' >
		<header>
			<h1>
				ToDOS
			</h1>
			<div class ="" v-show = "hasTodos" >
			<strong>
				{{ remainig }}  
			</strong>
			<span class = "todo-count">tâches à faire </span><br>
			<div class = " btn-group-horizontal " >
				<a href = "#" class = " btn btn-light " :class = "{active: filter === 'all'}" @click.prevent = "filter = 'all'"> Toutes <span class = "btn-success notification" > {{allTodos}} </span> </a> 
				<a href = "#"  class = "btn btn-light " :class = "{active: filter === 'todo'}" @click.prevent = "filter = 'todo'" > A faire  <span class = "btn-success notification" > {{remainig}} </span> </a> 
				<a href = "#" class = "btn btn-light " :class = "{active: filter === 'done'}" @click.prevent = "filter = 'done'" >  Faites <span class = "btn-success notification" > {{completed}} </span> </a>
			</div>
		</div>
			<input  class = "form-control" type = 'text' placeholder = ' ajouter une tache' v-model = "newTodo" @keyup.enter = "addTodo" >
		</header>
		<div class = "main">
			<ul class = "list-group" >
				<label id = "select_all" class="form-check-label"> 
					<input type = 'checkbox' class = "toggle-all form-check-input"  v-model = "allDone"> select all 
				</label>
				<li  class = "todo list-group-item " v-for = "todo in filteredTodos " :class = "{ 'completed disabled' : todo.completed , editing: todo === editing } " >
					<div class = "row todo_liste"  >
						<span class = "col-sm-10" >
							<input type = "checkbox" v-model = "todo.completed" class= " toggle" @click ="completedTodo(todo)"  >{{todo.id}}
							<label @dblclick = "editTodo(todo)" > {{todo.name}}</label>
						</span>
						<span @click.prevent = "deleteTodo(todo)" class = " del col btn btn-dark btn-sm  " > supp </span>
					</div>
					<input type = "text" class = "edit form-control" v-model = "todo.name" @keyup.esc = "cancelEdit" @keyup.enter = "doneEdit" v-focus = "todo === editing" @blur = " doneEdit ">
				</li>
			</ul>
		</div>
		<footer class ="footer" v-show = "hasTodos" >
			<strong>
				{{ remainig }}  
			</strong>
			<span class = "todo-count">tâches à faire </span><br>
			<div class = " btn-group-horizontal " >
				<a href = "#" class = " btn btn-light " :class = "{active: filter === 'all'}" @click.prevent = "filter = 'all'"> Toutes <span class = "btn-success notification" > {{allTodos}} </span> </a> 
				<a href = "#"  class = "btn btn-light " :class = "{active: filter === 'todo'}" @click.prevent = "filter = 'todo'" > A faire  <span class = "btn-success notification" > {{remainig}} </span> </a> 
				<a href = "#" class = "btn btn-light " :class = "{active: filter === 'done'}" @click.prevent = "filter = 'done'" >  Faites <span class = "btn-success notification" > {{completed}} </span> </a>
			</div>
			<button v-show = "completed"  @click.prevent = "deleteCompleted" class = "btn"> Suprimer les tâhe finies </button>
		</footer>
		<button @click="affiche" >.</button>
		
	</div> `
}

let showNewTodo = {
	props : {
		value :  {default(){ return [] }}
	},
	template : ` 
		<div class = "alert alert-success"   >
			<p>New Todo : <b>{{this.value.name}}</b>  </p> 
		</div>
	`
}

let vm = new Vue ({
	el : '#app',
	data : function (){
		return {
			todos :[],
			newT : [],
			ifNewTodo : false
		}
	},
	methods : {
		formateValueTodos(todos){
			todos.forEach(todo => {
				if (todo.completed == 1){
					todo.completed = true
				} else {
					todo.completed = false					
				}
			});
			return todos
		},
		
	},	
    mounted () {
		this.$lien = this.$resource('listesTodos.php')
		setInterval(()=>{
			this.$lien.query().then((response) => 
            {
				console.log('data', response.data)
				let data = this.formateValueTodos(response.data.allData)
				if(this.todos.length < data.length ){
					this.todos =  data
					this.newT  = this.todos[Number(this.todos.length)-1]
					this.ifNewTodo = true
					console.log ('new todo ',this.newT)	
				}
				if(this.todos.length > data.length ){
					this.todos =  data
					console.log ('new todo ',this.todos)	
				}
				console.log('Actualisation')
            }, (response) => {
            console.log( 'erreur', response )
			})
		},3000)
		this.$lien.query().then((response) => 
            {
				let temp_todos =  response.data.allData
				this.todos =  this.formateValueTodos(temp_todos)
				console.log(this.$lien)
            }, (response) => {
            console.log( 'erreur', response )
			})
	},
	watch :{
		'all': {
		handler: function (val, oldVal) { 
			console.log("old and oldVal data is the same ? why?")
			console.log(val)
			console.log(oldVal)
			// this.todos = this.getDatas
		},
		deep: true
		}
	},
	components : {todo,showNewTodo},
	template : 
	`<div class = " container " >
		<show-new-todo v-model = "newT"  v-show = "ifNewTodo"></show-new-todo>
		<todo v-model = "todos" ></todo>
		<todo  v-model = "todos" ></todo>
	</div>`
})

