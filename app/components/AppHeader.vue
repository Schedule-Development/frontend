<script setup lang="ts">
const items = computed(() => [
  {
    label: 'Home',
    to: '/'
  },
  {
    label: 'Pricing',
    to: '/pricing'
  },
  {
    label: 'Changelog',
    to: '/changelog'
  }
])
</script>

<template>
  <UHeader>
    <template #left>
      <NuxtLink to="/">
        <AppLogo class="w-auto h-6 shrink-0" />
      </NuxtLink>
    </template>

    <UNavigationMenu
      :items="items"
      variant="link"
    />

    <template #right>
      <UButton
        label="Sign in"
        color="neutral"
        variant="outline"
        to="/login"
      />
    </template>

    <template #body>
      <UNavigationMenu
        :items="items"
        orientation="vertical"
        class="-mx-2.5"
      />

      <USeparator class="my-6" />

      <UButton
        label="Sign in"
        color="neutral"
        variant="subtle"
        to="/login"
        block
      />
    </template>
  </UHeader>
</template>
