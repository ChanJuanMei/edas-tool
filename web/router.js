
const fs = require('fs')
const path = require('path')
const Router = require('koa-router')
const koaBody = require('koa-body') 

var debug = require('debug')('kk')

var router = new Router()


router.all('*',async (ctx,next)=>{
    console.log('request',ctx.url)
    await next()
})

//auto setup routes from controller
let dir = path.join(__dirname, 'src/controllers')
if(fs.existsSync(dir)){
    let files = fs.readdirSync(dir)

    for(let file of files){
        let name = path.join(dir,file)
        let service = require(name)
        let meta = service.meta || {}
        for(let k in service){
            if(k == 'meta'){
                continue
            }
            let methods = ['get']
            let middlewares = []
            let url = `/${file.split('.')[0]}/${k}`
            if(meta[k]){
                if(meta[k].methods){
                    methods = meta[k].methods.map(r=>r.toLowerCase())
                }
                if(meta[k].bodyParser){
                    let opt = meta[k].bodyParser === true?{}:meta[k].bodyParser
                    middlewares.push(koaBody(opt))
                }
                if(meta[k].url){
                    url = meta[k].url
                }
            }
            let urls = []
            if(Array.isArray(url)){
                urls = url
            }else{
                urls = [url]
            }
            urls.forEach(u=>{
                methods.forEach(method=>{
                    debug('add route %s: %s',method,u)
                    let serves = []
                    let serve = service[k]
                    if(Array.isArray(serve)){
                        serves = serve
                    }else{
                        serves.push(serve)
                    }
                    router[method](u,...middlewares, ...serves)
                })
            })
        }
    }
}


// let routePath = path.join(__dirname,'config/routes.js')
// if(!fs.existsSync(routePath)){
//     routePath = null
// }

// //setup routes from config file
// if(routePath){
//     let cfg = require(routePath)
//     for(let k in cfg){
//         let [method,url] = k.split(' ')
//         if(!router[method.toLowerCase()]){
//             console.error('unsupported method:',method)
//             continue
//         }

//         let [name,fname] = cfg[k].split('.')
        
//         let fn = require(path.join(dir,name))[fname]

//         if(!fn){
//             console.error('route method not found',cfg[k])
//         }

//         debug('add route %s: %s',method,url)
//         router[method.toLowerCase()](url,koaBody(),fn)

//     }
// }

module.exports = router