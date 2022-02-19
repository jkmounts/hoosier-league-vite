<template>
  <div id="rankings-table">
    <div class="table">
      <div class="table-column">
        <div class="column-header">
          <div class="main-header"><h2>&nbsp;</h2></div>
          <div class="sub-header"><h3>&nbsp;</h3></div>
        </div>
        <div v-for="team in sortedRecords" :key="`teamId${team.teamId}`" class="cell team-name">
          <p>{{ team.teamDetails.fullName }}</p>
        </div>
      </div>
      <div class="table-column" id="overall-column">
        <div class="column-header">
          <div class="main-header"><h2>Overall</h2></div>
          <div class="sub-headers"><h3>W</h3><h3>L</h3></div>
        </div>
        <div v-for="team in sortedRecords" :key="`teamId${team.teamId}`" class="cell">
          <p>{{ team.overall.wins }}</p>
          <p>{{ team.overall.losses }}</p>
        </div>
      </div>
      <div class="table-column" id="matchup-column">
        <div class="column-header">
          <div class="main-header"><h2>Matchup</h2></div>
          <div class="sub-headers"><h3>W</h3><h3>L</h3></div>
        </div>
        <div v-for="team in sortedRecords" :key="`teamId${team.teamId}`" class="cell">
          <p>{{ team.h2h.wins }}</p>
          <p>{{ team.h2h.losses }}</p>
        </div>
      </div>
      <div class="table-column" id="top-half-column">
        <div class="column-header">
          <div class="main-header"><h2>Top-Half</h2></div>
          <div class="sub-headers"><h3>W</h3><h3>L</h3></div>
        </div>
        <div v-for="team in sortedRecords" :key="`teamId${team.teamId}`" class="cell">
          <p>{{ team.h2h.wins }}</p>
          <p>{{ team.h2h.losses }}</p>
        </div>
      </div>
    </div>
    <!-- <table>
      <thead>
        <tr class="primary-headers">
          <td></td>
          <th colspan="2">Overall</th>
          <th colspan="2">Head-to-Head</th>
          <th colspan="2">Top-Half</th>
        </tr>
        <tr class="secondary-headers">
          <td></td>
          <th>Wins</th>
          <th>Losses</th>
          <th>Wins</th>
          <th>Losses</th>
          <th>Wins</th>
          <th>Losses</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="team in sortedRecords" :key="`team-${team.id}`">
          <td>{{ team.teamDetails.fullName }}</td>
          <td>{{ team.overall.wins }}</td>
          <td>{{ team.overall.losses }}</td>
          <td>{{ team.h2h.wins }}</td>
          <td>{{ team.h2h.losses  }}</td>
          <td>{{ team.topHalf.wins }}</td>
          <td>{{ team.topHalf.losses }}</td>
        </tr>
      </tbody>
    </table> -->
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue';

const props = defineProps({
  records: {
    type: Array,
  }
});

const sortedRecords = computed(() => {
  return props.records.slice().sort((a, b) => {
    return b.overall.wins - a.overall.wins;
  });
});

</script>

<style lang="css" scoped>

  .table {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-around;
    padding: 10px;
    background-color: var(--dark);
    border: 2px solid var(--accent);
    border-radius: 10px;
    color: var(--light);
    box-shadow: 5px 5px 5px var(--dark);
  }
  .table-column {
    display: flex;
    flex-flow: column nowrap;
    padding: 10px;
  }
  .column-header {
    display: flex;
    flex-flow: column nowrap;
    font-weight: 700;
  }
  .sub-headers {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-around;
  }
  .cell {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-around;
  }
  h3 {
    padding: 5px;
  }
  #overall-column {
    color: var(--light);
    text-shadow: 1px 1px 2px var(--accent);
  }
  #matchup-column, #top-half-column {
    display: none;
  }
  .team-name {
    text-decoration: underline;
  }

  @media screen and (min-width: 650px) {
    #matchup-column, #top-half-column {
      display: flex;
    }
    
  }

</style>