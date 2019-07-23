import shop from '@/api/shop'

export default {
  namespaced: true,
  state: {
    items: []
  },
  getters: {
    availableProducts(state){
      return state.items.filter(product => product.inventory > 0)
    },

    productIsInStock(){
      return (product) => {
        return product.inventory > 0
      }
    }
  },
  actions: {
    fetchProducts: function ({commit}) {
      // Note ES6 destructuring of the context parameter in the function declarations
      // Be careful that what you're destructing is not a primitive type.
      // If it is primitive type, all you're doing is making a local copy and amending that
      // Hence why you can't destructure the mutation declarations
      return new Promise((resolve, reject) => {
        shop.getProducts(products => {
          commit('setProducts', products)
          resolve()
        })
      })
    }
  },
  mutations: {
    setProducts (state, products){
      state.items = products
    },
    decrementProductInventory(state, product){
      product.inventory--
    }
  }
}
