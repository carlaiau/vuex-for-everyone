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
            <button @click="addProductToCart(product)">Add to Cart</button>
        </li>
    </div>


</template>

<script>
    export default {
        data(){
          return {
            loading: true,
            added : false,
          }
        },
        computed: {
          products () {
            return this.$store.getters.availableProducts
          }
        },

        methods: {
          addProductToCart(product){
            this.$store.dispatch('addProductToCart', product)
          }
        },
        created () {
          this.$store.dispatch('fetchProducts')
            .then(() => {
              this.loading = false
            })
        }

    }
</script>
