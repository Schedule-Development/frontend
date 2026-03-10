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
const isMounted = ref(false)
onMounted(() => { isMounted.value = true })
const isScrolled = computed(() => isMounted.value && y.value > 20)
</script>

<template>
  <header
    :class="[
      'fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-[var(--duration-fast)] ease-[var(--ease-indie)]',
      isScrolled ? 'pt-4' : 'pt-0'
    ]"
  >
    <nav
      :class="[
        'transition-all duration-[var(--duration-fast)] ease-[var(--ease-indie)] flex items-center justify-between px-6',
        isScrolled
          ? 'w-[90%] max-w-5xl bg-white/70 backdrop-blur-md border border-gray-200/50 rounded-full h-14 shadow-sm'
          : 'w-full bg-transparent h-20'
      ]"
    >
      <div
        class="flex items-center gap-4 transition-colors duration-300 text-[#1F1F20]"
      >
        <NuxtLink
          to="/"
          class="flex items-center gap-2"
        >
          <AppLogo class="w-auto h-8 shrink-0" />
        </NuxtLink>
      </div>

      <div
        class="hidden md:flex items-center gap-8 text-sm font-medium transition-colors text-gray-500"
      >
        <NuxtLink
          v-for="item in items"
          :key="item.to"
          :to="item.to"
          class="transition hover:text-gray-900"
          active-class="!text-gray-900 font-semibold"
        >
          {{ item.label }}
        </NuxtLink>
      </div>

      <div class="flex items-center gap-4">
        <UButton
          label="Sign in"
          color="neutral"
          variant="ghost"
          to="/login"
          :class="isScrolled ? 'hidden sm:flex hover:bg-gray-50 !text-gray-500 font-medium' : 'flex !text-gray-500 font-medium hover:bg-gray-50'"
        />
        <UButton
          label="Sign up"
          class="!bg-[#111827] hover:!bg-black !text-white rounded-full transition-all duration-400 font-medium shadow-sm hover:-translate-y-0.5"
          variant="solid"
          to="/signup"
        />
      </div>
    </nav>
  </header>
</template>
