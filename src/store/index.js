import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'

Vue.use(Vuex)

// https://webpack.js.org/guides/dependency-management/#requirecontext
// 从 ./modules 目录及其子目录下加载所有.js后缓的组件
const modulesFiles = require.context('./modules', true, /\.js$/)

// 你不需要使用 `import app from './modules/app'` 来导入模块
// 下面的代码将自动从 modules 目录及其子目录下导入所有 vuex 模块
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  // 将 './app.js' 格式化成 'app'
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})

const store = new Vuex.Store({
  modules,
  getters
})

export default store
