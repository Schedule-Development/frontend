<script setup lang="ts">
const items = computed(() => [
  { label: 'Home', to: '/' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'Changelog', to: '/changelog' }
])

const { y } = useWindowScroll()
const isMounted = ref(false)
onMounted(() => { isMounted.value = true })
const isScrolled = computed(() => isMounted.value && y.value > 20)
</script>

<template>
  <header
    :style="{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      display: 'flex',
      justifyContent: 'center',
      paddingTop: isScrolled ? '16px' : '0px',
      transition: 'padding-top 600ms cubic-bezier(0.22, 1, 0.36, 1)'
    }"
  >
    <nav
      :style="{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: '24px',
        paddingRight: '24px',
        width: isScrolled ? '88%' : '100%',
        maxWidth: isScrolled ? '1024px' : '100%',
        height: isScrolled ? '56px' : '80px',
        background: isScrolled ? 'rgba(11, 31, 58, 0.85)' : 'transparent',
        backdropFilter: isScrolled ? 'blur(20px) saturate(180%)' : 'none',
        WebkitBackdropFilter: isScrolled ? 'blur(20px) saturate(180%)' : 'none',
        border: isScrolled ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
        borderRadius: isScrolled ? '9999px' : '0px',
        boxShadow: isScrolled
          ? '0 8px 32px -8px rgba(0,0,0,0.4), 0 2px 8px -2px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)'
          : 'none',
        transition: [
          'width 600ms cubic-bezier(0.22, 1, 0.36, 1)',
          'max-width 600ms cubic-bezier(0.22, 1, 0.36, 1)',
          'height 600ms cubic-bezier(0.22, 1, 0.36, 1)',
          'background 500ms cubic-bezier(0.22, 1, 0.36, 1)',
          'backdrop-filter 500ms cubic-bezier(0.22, 1, 0.36, 1)',
          'border 500ms cubic-bezier(0.22, 1, 0.36, 1)',
          'border-radius 600ms cubic-bezier(0.22, 1, 0.36, 1)',
          'box-shadow 600ms cubic-bezier(0.22, 1, 0.36, 1)',
          'padding 600ms cubic-bezier(0.22, 1, 0.36, 1)'
        ].join(', ')
      }"
    >
      <!-- Logo -->
      <div class="flex items-center gap-4 text-white">
        <NuxtLink to="/" class="flex items-center gap-2 group outline-none">
          <div
            :style="{
              transition: 'transform 400ms cubic-bezier(0.22, 1, 0.36, 1)'
            }"
            class="relative flex items-center justify-center group-hover:scale-105"
          >
            <img
              src="/logo-nodix.png"
              alt="Nodix"
              :style="{
                height: isScrolled ? '28px' : '32px',
                transition: 'height 600ms cubic-bezier(0.22, 1, 0.36, 1)'
              }"
              class="w-auto drop-shadow-sm"
            />
          </div>
        </NuxtLink>
      </div>

      <!-- Nav links — absolutamente centralizados -->
      <div
        class="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300"
        style="position: absolute; left: 50%; transform: translateX(-50%);"
      >
        <NuxtLink
          v-for="item in items"
          :key="item.to"
          :to="item.to"
          :style="{ transition: 'color 250ms ease, opacity 250ms ease' }"
          class="hover:text-white"
          active-class="!text-white font-semibold flex flex-col after:content-[''] after:w-full after:h-0.5 after:bg-[#FF6A00] after:mt-1 after:-mb-1.5"
        >
          {{ item.label }}
        </NuxtLink>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-3">
        <UButton
          label="Sign in"
          color="neutral"
          variant="ghost"
          to="https://google.com"
          target="_blank"
          :style="{ transition: 'opacity 400ms ease, transform 400ms cubic-bezier(0.22, 1, 0.36, 1)' }"
          class="!text-gray-300 font-medium hover:bg-white/10 hover:!text-white"
        />
        <UButton
          label="Sign up"
          :style="{
            background: '#FF6A00',
            borderRadius: '9999px',
            fontWeight: 700,
            border: 'none',
            paddingLeft: isScrolled ? '20px' : '24px',
            paddingRight: isScrolled ? '20px' : '24px',
            transition: [
              'padding 600ms cubic-bezier(0.22, 1, 0.36, 1)',
              'box-shadow 300ms ease',
              'transform 200ms ease',
              'background 200ms ease'
            ].join(', ')
          }"
          class="!text-white hover:!bg-[#FF8533] hover:-translate-y-0.5 shadow-md"
          variant="solid"
          to="https://google.com"
          target="_blank"
        />
      </div>
    </nav>
  </header>
</template>
