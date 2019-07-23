<template>
    <div>
        <h1>Product List</h1>
        <p v-if="added">Product Added!</p>
        <img
          v-if="loading"
          src="https://i.imgur.com/JfPpwOA.gif"
          >
        <li v-else v-for="product in products">
            {{product.title}} = {{ product.price | currency}} - {{product.inventory}}
            <button
              :disabled="!productIsInStock(product)"
              @click="addProductToCart(product)">Add to Cart</button>
        </li>
    </div>


</template>

<script>
  import {mapState, mapGetters, mapActions} from 'vuex'
    export default {
        data(){
          return {
            loading: true,
            added : false,
          }
        },

        computed: {
          ...mapState('products', {
            products: state => state.items,
          }),
          ...mapGetters('products', {
            productIsInStock: 'productIsInStock'
          })
        },
        methods: {
          ...mapActions('products', {
            fetchProducts: 'fetchProducts',
          }),
          ...mapActions('cart', {
            addProductToCart: 'addProductToCart'
          })

        },
        created () {
          this.fetchProducts()
            .then(() => {
              this.loading = false
            })
        }

    }
</script>
