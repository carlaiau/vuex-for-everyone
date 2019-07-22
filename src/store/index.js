import Vuex from 'vuex'
import Vue from 'vue'
import shop from '@/api/shop'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    products: [],
    cart: [] // This will hold {id, quantity}
  },
  getters: {
    availableProducts(state){
      return state.products.filter(product => product.inventory > 0)
    },
    cartProducts(state){
      return state.cart.map(cartItem => {
        const product = state.products.find(product => product.id === cartItem.id)
        return {
          title: product.title,
          price: product.price,
          quantity: cartItem.quantity
        }
      })
    },
    cartTotal(state, getters){
      /*
      Replaced below logic with reduce
      let total = 0
      getters.cartProducts.foreach(product =>{
        total += product.price * product.quantity
      })
      return total
       */
      return getters.cartProducts.reduce((total, product) =>
        total + product.price * product.quantity, 0
      )
    }
  },
  actions: {
    fetchProducts: function ({commit}) {
      return new Promise((resolve, reject) => {
        shop.getProducts(products => {
          commit('setProducts', products)
          resolve()
        })
      })
    },
    addProductToCart(context, product){
      // Find cartItem
      if( product.inventory > 0) {
        const cartItem = context.state.cart.find(item => item.id === product.id)
        if(!cartItem){
          context.commit('pushProductToCart', product.id)
        } else{
          context.commit('incrementItemQuantity', cartItem)
        }
        context.commit('decrementProductInventory', product)
      }

    }
  },
  mutations: {
    setProducts (state, products){
      state.products = products
    },
    pushProductToCart(state, productId){
      state.cart.push({
        id: productId,
        quantity: 1
      })
    },
    incrementItemQuantity(state, cartItem){
      cartItem.quantity++
    },
    decrementProductInventory(state, product){
      product.inventory--
    }
  }
})
