const express = require('express')

const app = express()

app.use(express.json())

const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/new')
.then((data)=>{
    console.log('succesfully connected')
})
.catch((err)=>{
    console.log(err)
})


//  / / / /USERS / / / / / / / / / /USERS / / / / / / / / // / / / / / / / / /  / / / / / / // / / /  //  /

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:[true,'name is required']
    },
    email:{
        type:String,
        required:[true,'email is required']
    },
    password:{
        type:String,
        required:[true,'password is required']
    }
},{timestamps:true})

const userModel = mongoose.model('users',userSchema)

app.post('/register',(request,response)=>{
    let user = request.body

    bcrypt.genSalt(10,(err,salt)=>{
        if(!err)
        {
            bcrypt.hash(user.password,salt,(err,hpass)=>{
                if(!err)
                {
                    user.password = hpass
                    userModel.create(user)
                    .then(()=>{
                        response.send({message:'user post was sent'})
                    })
                    .catch((err)=>{
                        console.log(err)
                    })
                }
            })
        }
    })
    
})

// END POINT FOR LOGIN
app.post('/login',(request,response)=>{
    let validUser = request.body
})
    






let profileSchema = mongoose.Schema({
    name:{
        type:String,
        required:[true,'name is required']
    },

    age:{
        type:Number,
        required:[true,'age is a requirement']
    },

    jobTitle:{
        type:String,
        enums:['manager','developer','tester']
    }

},{timestamps:true})



const profileModel = mongoose.model('profiles',profileSchema)


let newProfiles =[
{
    name:'Bernard',
    age:25,
    jobTitle:'manager'
},
{
    name:'Lawrence',
    age:25,
    jobTitle:'developer'
},
{
    name:'Grant',
    age:26,
    jobTitle:'tester',
},
{
    name:'mistake',
    age:25,
    jobTitle:'Dev Ops',
},
{
    name:'Bad mistake',
    age:25,
    salary:65883
},

]

profileModel.create(newProfiles)
.then(()=>{
    console.log('successfully inserted')
})
.catch((err)=>{
    console.log(err)
})

// profileModel.find({jobTitle:'developer'})
// .then((data)=>{
//     console.log(data)
// })
// .catch((err)=>{
//     console.log(err)
// })



app.post('/products',(request,response)=>{
    console.log(request.body)
    profileModel.create(request.body)
    .then((document)=>{
        response.send({data:document})
    })
    .catch((err)=>{
        console.log(err)
    })
    
})
// Making a get request with no query parameters
app.get('/products',(request,response)=>{
    console.log('get request incoming')
    response.send({message:'get request is a huge success'})
})
// Making a get request based on an id
app.get('/products/:id',(request,response)=>{
    console.log(request.params.id)
    response.send({message:'successfully used id to fetch data'})
})

// ADDING MIDDLEWARE WITH ENDPOINTS
function middleware(request,response,next){
    // const id = parseInt(request.params.id, 10)
    if(request.params.id<10)
    {
        response.send({message:'you cannot access this API'})
    }

    else{
        next()
    }
}

app.get('/testing/:id',middleware,(request,response)=>{
    response.send({message:'successfully fetched through middleware'})
})






app.listen(8000,()=>{
    console.log('server running')
})
