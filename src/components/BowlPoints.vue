<template>
  <div id="bowl-points-table">
    Bowl Points
    <div v-for="teamPoint in sortedBowlPoints" :key="teamPoint.teamId">
      {{ props.teams.find((team) => team.id === teamPoint.teamId).fullName }} {{ Math.round(teamPoint.bowlPoints) }}
    </div>

  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue';

const props = defineProps({
  bowlPoints: {
    type: Array,
  },
  teams: {
    type: Array,
  },
});

const sortedBowlPoints = computed(() => {
  return props.bowlPoints.slice().sort((a, b) => {
    return b.bowlPoints - a.bowlPoints;
  });
});


</script>

<style lang="scss" scoped>

</style>