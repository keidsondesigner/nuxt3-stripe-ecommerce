<template>
  <div class="container mx-auto px-4 py-8">
    <Card class="mb-8">
      <CardHeader>
        <CardTitle>Meu E-commerce</CardTitle>
      </CardHeader>
      <CardContent>
        <Button @click="addSampleProducts" class="mb-4">
          Adicionar Produtos de Exemplo
        </Button>
      </CardContent>
    </Card>

    <div class="flex flex-col md:flex-row gap-8">
      <ProductCatalog ref="productCatalog" />
    </div>
  </div>
</template>

<script setup lang="ts">
import ProductCatalog from '~/components/ProductCatalog.vue'

const productCatalog = ref<InstanceType<typeof ProductCatalog> | null>(null)

const addSampleProducts = async () => {
  try {
    console.log('Iniciando adição de produtos de exemplo...')
    const response = await fetch('/api/add-sample-products')
    const result = await response.json()
    console.log('Resultado da adição de produtos:', result)
    if (result.message) {
      console.log(result.message)
      // Atualiza a lista de produtos após adicionar os produtos de exemplo
      if (productCatalog.value) {
        console.log('Atualizando catálogo de produtos...')
        await productCatalog.value.fetchProducts()
      } else {
        console.error('Referência do catálogo de produtos não encontrada')
      }
    } else if (result.error) {
      console.error('Erro ao adicionar produtos:', result.error)
    }
  } catch (error) {
    console.error('Erro ao adicionar produtos de exemplo:', error)
  }
}
</script>
