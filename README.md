# uncoolm

> 不酷猫

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).



相关目录介绍
build：vue脚手架自动生成，是webpack打包配置相关的一些文件；
config：环境配置文件；
dist：打包后生成的文件；
node_module:存放下载来的依赖包；
pic：相关图标；

src:！重点，assets ：一些静态文件，图片和ico；
      components：组件，App.vue根组件，search.vue搜索页面组件， details详情页组件（这次没用），listen听页面相关组件，navbar导航栏相关组件 ，subcomponent：子组件 ；
      lib：引入 mui组件库的样式；
      router：定义了路由，就是页面如何跳转；
      main.js：主js，引入了mint-ui组件库，设置了整个项目发请求的根路径，定义了一些过滤器

static：没啥软用
.babelrc：babel的配置，配合es6
app.js：写一个最简单的服务器，设置监听的端口，
index.html：打包后插入js的模板；
package.json：用来定义依赖的nodejs模块