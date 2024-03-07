const express = require('express')

const app = express()

app.get('/products',(request,response)=>{
    console.log('get request incoming')
    response.send({message:'get request is a huge success'})
})

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