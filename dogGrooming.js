const mongoose= require ('mongoose')
const Product= require ('./types/products')
mongoose.connect('mongodb://localhost:27017/grooming')
    .then(()=>{
        console.log('Mongo connected')
    })
    .catch(err=>{
        console.log('oh,no mongo!')
        console.log(err)
    })

    const dogGrooming=[
        {
            name:'shampoo',
            price:15,
            category:'shower'
        },
        {
            name:'toothbush',
            price: 10,
            category:'dental'
        },
        {
            name:'toothpaste',
            price: 9.99,
            category:'dental'
        }
    ]
    for(let product of dogGrooming){
        
    }
    Product.insertMany(dogGrooming)