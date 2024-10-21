<script lang="ts">
import Card from '$lib/components/Card.svelte';
import { cn } from '$lib/utils';
import { Button } from '$lib/components/ui/button';
import { Input } from '$lib/components/ui/input';
import { t } from '$lib/i18n';
import { GameState } from './game-state.svelte';
import { tweened } from 'svelte/motion';
import { cubicOut } from 'svelte/easing';

const game = new GameState();
let showResult = false;
let resultColor = '';
let slidePosition = tweened(0, {
    duration: 2000,
    easing: cubicOut
});

function handleGuess(isHigher: boolean) {
  game.makeGuess(isHigher);
  showResult = true;
  
  if (game.lastResult === 'win') {
    resultColor = 'bg-green-200';
  } else if (game.lastResult === 'lose') {
    resultColor = 'bg-red-200';
  } else {
    resultColor = 'bg-gray-200';
  }
  
  setTimeout(() => {
    slidePosition.set(1).then(() => {
      game.nextRound();
      showResult = false;
      resultColor = '';
      slidePosition.set(0, { duration: 0 });
    });
  }, 1000); // Delay before sliding starts
}

function handleBetChange(event: Event) {
  const input = event.target as HTMLInputElement;
  game.setBet(Number(input.value));
}
</script>

<div class="container mx-auto p-4">
  <h1 class="text-2xl font-bold mb-4 text-center">{$t('higher_or_lower')}</h1>
  
  <div class="flex justify-center mb-4 relative h-[200px] w-[300px] mx-auto">
    <div class="absolute left-0">
      <Card rank={game.currentCard.rank} suit={game.currentCard.suit} />
    </div>
    <div 
      class="absolute"
      style="transform: translateX(calc({100 - $slidePosition * 100}% - {$slidePosition * 100}%));"
    >
      {#if showResult}
        <div class={cn("p-1 rounded", resultColor)}>
          <Card rank={game.nextCard.rank} suit={game.nextCard.suit} />
        </div>
      {:else}
        <Card faceDown={true} />
      {/if}
    </div>
  </div>
  
  <div class="mb-4 text-center">
    <p class="mb-2">{$t('balance')}: ${game.balance}</p>
    <div class="flex justify-center items-center space-x-2">
      <Input
        type="number"
        min="1"
        max={game.balance}
        value={game.currentBet}
        on:input={handleBetChange}
        disabled={showResult || $slidePosition > 0}
        class="w-24"
      />
      <p>{$t('current_bet')}: ${game.currentBet}</p>
    </div>
  </div>
  
  <div class="flex justify-center space-x-4">
    <Button
      on:click={() => handleGuess(true)}
      disabled={showResult || $slidePosition > 0}
      class={cn(
        "bg-green-500 hover:bg-green-600",
        (showResult || $slidePosition > 0) && "opacity-50 cursor-not-allowed"
      )}
    >
      {$t('higher')}
    </Button>
    <Button
      on:click={() => handleGuess(false)}
      disabled={showResult || $slidePosition > 0}
      class={cn(
        "bg-red-500 hover:bg-red-600",
        (showResult || $slidePosition > 0) && "opacity-50 cursor-not-allowed"
      )}
    >
      {$t('lower')}
    </Button>
  </div>
</div>
