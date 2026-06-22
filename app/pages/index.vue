<template>
  <div class="jw-vw-page">
    <div class="jw-vw-page-content">
      <WizardMain />
      <SubmissionList />
    </div>
  </div>
</template>
<script lang="ts" setup>
import WizardMain from "@/components/wizard/WizardMain.vue";
import SubmissionList from "@/components/submissions/SubmissionList.vue";
</script>
<style lang="scss" scoped>
.jw-vw-page {
  @apply w-full flex flex-col items-center;
  .jw-vw-page-content {
    @apply w-full max-w-[55rem] flex flex-col items-center gap-16;
  }
}
</style>
