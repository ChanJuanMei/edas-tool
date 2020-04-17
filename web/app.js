const Koa = require('koa')
const views = require('koa-views')
const koaBody = require('koa-body')
const serve = require('koa-static');
const Webpackhook = require('./config/webpackhook.js')
const router = require('./router');
const app = new Koa()

global.LIFT_TIME = Date.now();

// 加载模板引擎
app.use(views(__dirname + '/views', {
    extension: 'ejs'
}))

// 加载静态资源
app.use(serve('.tmp/dist/'));

// 用来从 POST 请求的数据体里面提取键值对 和 文件上传
app.use(koaBody({ multipart: true }));

const compileWebpack = new Webpackhook();

app.use(router.routes()).use(router.allowedMethods())

const result = app.listen(3000 , () => {
    compileWebpack.enableWebpack(require('./config/webpack.dev.js'))
    const add = result.address();
    console.log(`server running on ${add.address}:${add.port}`);
  });
