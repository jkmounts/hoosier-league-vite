<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import HelloWorld from './components/HelloWorld.vue';
import RankingsTable from './components/RankingsTable.vue';
import { onMounted, reactive } from 'vue';

const leagueStore = reactive({
  records: []
});

onMounted(async () => {
  leagueStore.records = await fetch('/.netlify/functions/espn').then(response => response.json());
  console.log(leagueStore);
});

</script>

<template>
  <div>
    <h1>Hoosier League</h1>
    <RankingsTable :records="leagueStore.records"/>
  </div>
</template>

<style>
:root {
  --light: #E8EAE3;
  --dark: #373833;
  --accent: #FA2742;
}
#app {
  font-family: 'Ubuntu', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
