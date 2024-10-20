<script lang="ts">
import Card from '$lib/components/Card.svelte';
import { cn } from '$lib/utils';
import { Button } from '$lib/components/ui/button';
import { Input } from '$lib/components/ui/input';
import { t } from '$lib/i18n';
import { GameState } from './game-state.svelte';

const game = new GameState();

function handleGuess(isHigher: boolean) {
  game.makeGuess(isHigher);
}

function handleBetChange(event: Event) {
  const input = event.target as HTMLInputElement;
  game.setBet(Number(input.value));
}
</script>

<div class="container mx-auto p-4">
  <h1 class="text-2xl font-bold mb-4">{$t('higher_or_lower')}</h1>
  
  <div class="flex justify-center space-x-4 mb-4">
    <Card rank={game.currentCard.rank} suit={game.currentCard.suit} />
    {#if game.nextCardRevealed}
      <Card rank={game.nextCard.rank} suit={game.nextCard.suit} />
    {:else}
      <Card back={true} />
    {/if}
  </div>
  
  <div class="mb-4">
    <p>{$t('balance')}: ${game.balance}</p>
    <div class="flex items-center space-x-2">
      <Input
        type="number"
        min="1"
        max={game.balance}
        value={game.currentBet}
        on:input={handleBetChange}
        disabled={game.nextCardRevealed}
      />
      <p>{$t('current_bet')}: ${game.currentBet}</p>
    </div>
  </div>
  
  <div class="flex justify-center space-x-4">
    <Button
      on:click={() => handleGuess(true)}
      disabled={game.nextCardRevealed}
      class={cn(
        "bg-green-500 hover:bg-green-600",
        game.nextCardRevealed && "opacity-50 cursor-not-allowed"
      )}
    >
      {$t('higher')}
    </Button>
    <Button
      on:click={() => handleGuess(false)}
      disabled={game.nextCardRevealed}
      class={cn(
        "bg-red-500 hover:bg-red-600",
        game.nextCardRevealed && "opacity-50 cursor-not-allowed"
      )}
    >
      {$t('lower')}
    </Button>
  </div>
  
  {#if game.nextCardRevealed}
    <div class="mt-4 text-center">
      <p>{game.resultMessage}</p>
      <Button on:click={() => game.nextRound()} class="mt-2">
        {$t('next_round')}
      </Button>
    </div>
  {/if}
</div>
