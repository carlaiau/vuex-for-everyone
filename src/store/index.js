import Vuex from 'vuex'
import Vue from 'vue'
import shop from '@/api/shop'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    products: [],
    cart: [], // This will hold {id, quantity}
    checkoutStatus: null
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
    },
    productIsInStock(){
      return (product) => {
        return product.inventory > 0
      }
    }
  },
  actions: {
    // Note ES6 destructuring of the context parameter in the function declarations
    // Be careful that what you're destructing is not a primitive type.
    // If it is primitive type, all you're doing is making a local copy and amending that
    // Hence why you can't destructure the mutation declarations
    fetchProducts: function ({commit}) {
      return new Promise((resolve, reject) => {
        shop.getProducts(products => {
          commit('setProducts', products)
          resolve()
        })
      })
    },
    addProductToCart({state, getters, commit}, product){
      if(getters.productIsInStock(product)) {
        const cartItem = state.cart.find(item => item.id === product.id)
        if(!cartItem){
          commit('pushProductToCart', product.id)
        } else{
          commit('incrementItemQuantity', cartItem)
        }
        commit('decrementProductInventory', product)
      }
    },
    checkout({state, commit}){
      // Here destructuring is fine because we never actually want to mutate state
      // That is what mutations are for :)
      const { cart } = state;
      if(cart.length === 0) {
        alert("no products in cart")
        return
      }
      shop.buyProducts(
        cart,
        () => {
          commit('emptyCart');
          commit('setCheckoutStatus', 'success')
        },
        () => {
          commit('setCheckoutStatus', 'fail')
        })
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
    },
    setCheckoutStatus(state, status){
      state.checkoutStatus = status
    },
    emptyCart(state){
      state.cart = []
    }

  }
})
