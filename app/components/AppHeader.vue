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
          ? 'w-[90%] max-w-5xl bg-[#DCE0E6]/80 backdrop-blur-xl border border-[#606D80]/20 rounded-full h-14 shadow-md'
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
        class="hidden md:flex items-center gap-8 text-sm font-semibold transition-colors duration-300 text-[#1F1F20]"
      >
        <NuxtLink
          v-for="item in items"
          :key="item.to"
          :to="item.to"
          class="transition hover:text-[#567EBB]"
          active-class="!text-[#2B4C7E]"
        >
          {{ item.label }}
        </NuxtLink>
      </div>

      <div class="flex items-center gap-4">
        <UButton
          label="Sign in"
          color="gray"
          variant="ghost"
          to="/login"
          :class="isScrolled ? 'hidden sm:flex hover:bg-[#606D80]/10 !text-[#1F1F20]' : 'flex !text-[#1F1F20] hover:bg-[#606D80]/10'"
        />
        <UButton
          label="Sign up"
          class="!bg-[#2B4C7E] hover:!bg-[#567EBB] !text-[#DCE0E6] rounded-full transition-all duration-300 font-bold"
          variant="solid"
          to="/signup"
        />
      </div>
    </nav>
  </header>
</template>
