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
          ? 'w-[90%] max-w-5xl bg-[#0B1F3A]/80 backdrop-blur-md border border-white/10 rounded-full h-14 shadow-sm'
          : 'w-full bg-transparent h-20'
      ]"
    >
      <div
        class="flex items-center gap-4 transition-colors duration-300 text-white"
      >
        <NuxtLink
          to="/"
          class="flex items-center gap-2 group outline-none"
        >
          <div class="relative flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
            <img src="/logo-nodix.png" alt="Nodix" class="h-7 md:h-8 w-auto drop-shadow-sm" />
          </div>
        </NuxtLink>
      </div>

      <div
        class="hidden md:flex items-center gap-8 text-sm font-medium transition-colors text-gray-300"
      >
        <NuxtLink
          v-for="item in items"
          :key="item.to"
          :to="item.to"
          class="transition hover:text-white"
          active-class="!text-white font-semibold flex flex-col after:content-[''] after:w-full after:h-0.5 after:bg-[#FF6A00] after:mt-1 after:-mb-1.5"
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
          :class="isScrolled ? 'hidden sm:flex hover:bg-white/10 !text-gray-300 font-medium' : 'flex !text-gray-300 font-medium hover:bg-white/10'"
        />
        <UButton
          label="Sign up"
          class="!bg-[#FF6A00] hover:!bg-[#FF8533] !text-white rounded-full transition-all duration-400 font-bold shadow-md hover:-translate-y-0.5 px-6 border-none"
          variant="solid"
          to="/signup"
        />
      </div>
    </nav>
  </header>
</template>
