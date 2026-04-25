<template>
  <div class="w-full flex flex-col items-center">
    <div class="w-full max-w-[55rem] flex flex-col items-center gap-16">
      <WizardMain />
      <SubmissionList />
    </div>
  </div>
</template>
<script lang="ts" setup>
import SubmissionList from "@/components/submissions/SubmissionList.vue";
</script>
