import Vuex from 'vuex'
import Vue from 'vue'
import shop from '@/api/shop'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    products: []
  },
  getters: {
    availableProducts(state){
      return state.products.filter(product => product.inventory > 0)
    }
  },
  actions: {
    fetchProducts ({commit}) {
      return new Promise((resolve, reject) => {
        shop.getProducts(products => {
          commit('setProducts', products)
          resolve()
        })
        // Don't need to worry about rejection for this
      })


    }
  },
  mutations: {
    setProducts (state, products){
      state.products = products
    }
  }
})
