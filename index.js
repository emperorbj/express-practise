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

    userModel.findOne({email:validUser.email})
    .then((user)=>{
        if(user!==null)
        {
            bcrypt.compare(validUser.password,user.password,(err,result)=>{
                if(result===true)
                {
                    // response.send({message:'password valid'})

                    // GENERATE A TOKEN AND SEND IT TO THE CLIENT SIDE
                    jwt.sign({email:validUser.emali},'privateKey',(err,token)=>{
                        if(!err)
                        {
                            response.send({webToken:token})
                        }
                        else
                        {
                            response.send({message:'problem creating token'})
                        }
                    })
                }
                else
                {
                    response.send({message:'password invalid'})
                }
            })
        }
        else{
            response.send({message:'user not found'})
        }
    })
    .catch((err)=>{
    console.log(err)
    })
})


// USING A MIDDLEWARE TO VERIFY IF USER HAS A WEBTOKEN BEFORE ACCESS CAN BE GIVEN TO THEM
// TOKEN ARE SENT VIA HEADERS

app.get('/getdata',verifyToken,(request,response)=>{

    response.send({message:'access granted because of token'})
})
function verifyToken(request,response,next){
    // split(" ") split the value by space and creates an array where "Bearer" and "token value are members"
    // adding the [1] extracts the token key from th array
    console.log(request.headers.authorization.split(" ")[1])
    let Token = request.headers.authorization.split(" ")[1];
    jwt.verify(Token,'privateKey',(err,data)=>{
        if(!err)
        {
            console.log(data)
            next()
        }

        else
        {
            response.status(401).send({message:'valid token required'})
        }
    })
    // response.send({message:'middleware working'})
}






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
