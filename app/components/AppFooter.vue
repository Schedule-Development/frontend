<script setup lang="ts">
</script>

<template>
  <div>
    <USeparator
      icon="i-simple-icons-nuxtdotjs"
      class="h-px"
    />

    <UFooter>
      <template #left>
        <p class="text-muted text-sm">
          Built with Nuxt UI • © {{ new Date().getFullYear() }}
        </p>
      </template>
    </UFooter>
  </div>
</template>
