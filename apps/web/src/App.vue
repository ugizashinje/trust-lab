<script setup lang="ts">
import AppHeader from './components/AppHeader.vue'
import ChapterNav from './components/ChapterNav.vue'
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <AppHeader />
    <main class="mx-auto w-[min(960px,100%-2rem)] flex-1 pt-8 pb-24">
      <RouterView />
    </main>
    <ChapterNav />
  </div>
</template>
