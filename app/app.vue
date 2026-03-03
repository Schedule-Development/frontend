<script setup lang="ts">
const colorMode = useColorMode()

// Forçar SEMPRE para o modo light, independentemente do sistema
useHead({
  htmlAttrs: {
    class: 'light',
    style: 'color-scheme: light;',
    lang: 'en'
  }
})

// Certificar de que o Nuxt / estado sempre seja "light" na montagem
if (import.meta.client) {
  colorMode.preference = 'light'
  colorMode.value = 'light'
}

const color = computed(() => '#DCE0E6')

useHead({
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: color }
  ],
  link: [{ rel: 'icon', href: '/favicon.ico' }]
})

useSeoMeta({
  titleTemplate: '%s - Nuxt SaaS template',
  ogImage: 'https://ui.nuxt.com/assets/templates/nuxt/saas-light.png',
  twitterImage: 'https://ui.nuxt.com/assets/templates/nuxt/saas-light.png',
  twitterCard: 'summary_large_image'
})

const { data: navigation } = await useAsyncData(
  'navigation',
  () => queryCollectionNavigation('docs'),
  {
    transform: data =>
      data.find(item => item.path === '/docs')?.children || []
  }
)
const { data: files } = useLazyAsyncData(
  'search',
  () => queryCollectionSearchSections('docs'),
  {
    server: false
  }
)

const links = [
  {
    label: 'Home',
    icon: 'i-lucide-home',
    to: '/'
  },
  {
    label: 'Pricing',
    icon: 'i-lucide-credit-card',
    to: '/pricing'
  },
  {
    label: 'Changelog',
    icon: 'i-lucide-history',
    to: '/changelog'
  }
]

provide('navigation', navigation)
</script>

<template>
  <UApp>
    <NuxtLoadingIndicator />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <ClientOnly>
      <LazyUContentSearch
        :files="files"
        shortcut="meta_k"
        :navigation="navigation"
        :links="links"
        :fuse="{ resultLimit: 42 }"
      />
    </ClientOnly>
  </UApp>
</template>
