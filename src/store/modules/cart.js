
import shop from "@/api/shop"

export default {
  namespaced: true,

  state: {
    items: [],
    checkoutStatus: null
  },

  getters: {
    cartProducts(state, getters, rootState, rootGetters){
      return state.items.map(cartItem => {
        const product = rootState.products.items.find(product => product.id === cartItem.id)
        return {
          title: product.title,
          price: product.price,
          quantity: cartItem.quantity
        }
      })
    },
    cartTotal(state, getters){
      return getters.cartProducts.reduce((total, product) =>
        total + product.price * product.quantity, 0
      )
    }
  },
  actions: {
    addProductToCart({state, getters, commit, rootState, rootGetters}, product){
      // Notice how in actions, the rootState and rootGetters are passed in as parameters on the
      // context object, which has been destructured. As opposed to getters where it is just
      // a function argument.
      if(rootGetters['products/productIsInStock'](product)) {
        const cartItem = state.items.find(item => item.id === product.id)
        if(!cartItem){
          commit('pushProductToCart', product.id)
        } else{
          commit('incrementItemQuantity', cartItem)
        }
        commit('products/decrementProductInventory', product, {root: true})
      }
    },
    checkout({state, commit}){
      // Here destructuring is fine because we never actually want to mutate state
      // That is what mutations are for :)
      const {items} = state
      if(items.length === 0) {
        alert("no products in cart")
        return
      }
      shop.buyProducts(
        items,
        () => {
          commit('emptyCart');
          commit('setCheckoutStatus', 'success')
        },
        () => {
          commit('setCheckoutStatus', 'fail')
        })
    },
  },
  mutations: {
    pushProductToCart(state, productId){
      state.items.push({
        id: productId,
        quantity: 1
      })
    },
    incrementItemQuantity(state, cartItem){
      cartItem.quantity++
    },
    setCheckoutStatus(state, status){
      state.checkoutStatus = status
    },
    emptyCart(state){
      state.items = []
    }
  }

}
