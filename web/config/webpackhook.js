/**
     * @private
     */
    class webpackhook{
        constructor(){
        }
        enableWebpack(cfg){
          this.compileWebpack(cfg)
        }
        compileWebpack(cfg) {
          if(cfg){
            let webpack = require('webpack')
            let compiler = webpack(cfg)
            compiler.watch({}, (err, stats) => {
                if (err) {
                    console.error(err.stack || err)
                    if (err.details) {
                        console.error(err.details)
                    }
                    return
                }
        
                let flag = true
        
                const info = stats.toJson()
        
                if (stats.hasErrors()) {
                    console.log(stats.toString({
                        chunks: false, // Makes the build much quieter
                        colors: true // Shows colors in the console
                    }))
                    flag = false
                }
        
                if (stats.hasWarnings()) {
                    console.warn(info.warnings)
                }
                if (flag) {
                    console.log('compile success')
                }
        
            })
          }
        }
      
        }
        module.exports = webpackhook