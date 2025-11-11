<template>
  <header
    :class="cn(
      'flex items-center justify-between',
      $attrs.class
    )"
  >
    <div class="flex flex-col">
      <h2 v-if="title || $slots.title">
        <slot name="title">
          {{ title }}
        </slot>
      </h2>
      <p v-if="subtitle || $slots.description">
        <slot name="description">
          {{ subtitle }}
        </slot>
      </p>
    </div>

    <div v-if="$slots.actions">
      <slot name="actions" />
    </div>
  </header>
</template>

<script setup>
import { cn } from '../utils/cn.js'

defineOptions({ inheritAttrs: false })

defineProps({
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  }
})
</script>
