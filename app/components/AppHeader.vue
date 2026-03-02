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

const { y } = useWindowScroll()
const isScrolled = computed(() => y.value > 20)
</script>

<template>
  <header
    :class="[
      'fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)]',
      isScrolled ? 'pt-4' : 'pt-0'
    ]"
  >
    <nav
      :class="[
        'transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)] flex items-center justify-between px-6',
        isScrolled
          ? 'w-[90%] max-w-5xl bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-full h-14 shadow-2xl'
          : 'w-full bg-transparent h-20'
      ]"
    >
      <div class="flex items-center gap-4 transition-colors duration-300" :class="isScrolled ? 'text-white' : 'text-gray-900 dark:text-white'">
        <NuxtLink to="/" class="flex items-center gap-2">
          <AppLogo class="w-auto h-8 shrink-0" />
        </NuxtLink>
      </div>

      <div class="hidden md:flex items-center gap-8 text-sm font-semibold transition-colors duration-300" :class="isScrolled ? 'text-gray-200' : 'text-gray-900 dark:text-gray-200'">
        <NuxtLink
          v-for="item in items"
          :key="item.to"
          :to="item.to"
          class="transition hover:text-primary-500 dark:hover:text-primary-400"
          active-class="text-primary-600 dark:text-primary-400"
        >
          {{ item.label }}
        </NuxtLink>
      </div>

      <div class="flex items-center gap-4">
        <UButton
          label="Sign in"
          :color="isScrolled ? 'white' : 'gray'"
          variant="ghost"
          to="/login"
          :class="isScrolled ? 'hidden sm:flex hover:bg-white/10 text-white' : 'flex'"
        />
        <UButton
          label="Sign up"
          :color="isScrolled ? 'primary' : 'black'"
          variant="solid"
          to="/signup"
          class="rounded-full transition-all duration-300 font-bold"
        />
      </div>
    </nav>
  </header>
</template>
