<script lang="ts">
  export let rank: string = '';
  export let suit: string = '';
  export let back: boolean = false;

  $: suitSymbol = getSuitSymbol(suit);
  $: color = ['hearts', 'diamonds'].includes(suit) ? 'text-red-500' : 'text-black';

  function getSuitSymbol(suit: string): string {
    switch (suit) {
      case 'hearts': return '♥';
      case 'diamonds': return '♦';
      case 'clubs': return '♣';
      case 'spades': return '♠';
      default: return '';
    }
  }
</script>

<div class="w-24 h-36 border border-gray-300 rounded-lg flex items-center justify-center bg-white shadow-md">
  {#if back}
    <div class="w-full h-full bg-blue-500 rounded-lg"></div>
  {:else}
    <div class={`text-2xl font-bold ${color}`}>
      <div>{rank}</div>
      <div>{suitSymbol}</div>
    </div>
  {/if}
</div>

