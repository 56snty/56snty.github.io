document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const depositBtn = document.querySelector('.btn-deposit');
  const balanceDisplay = document.querySelector('.balance');
  
  // Mock User State
  let userBalance = 12450.75;

  // Format currency beautifully (e.g., $12,450.75)
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Initialize Balance
  balanceDisplay.textContent = formatCurrency(userBalance);

  // Micro-interaction: Deposit Button Click
  depositBtn.addEventListener('click', () => {
    // In a real app, this would trigger device vibration: navigator.vibrate(50);
    // and open a bottom sheet modal for the payment flow.
    console.log('Deposit modal triggered. Haptic feedback fired.');
    
    // Simulate balance update for testing UI
    depositBtn.textContent = 'Processing...';
    setTimeout(() => {
      userBalance += 100;
      balanceDisplay.textContent = formatCurrency(userBalance);
      depositBtn.textContent = 'Deposit';
    }, 800);
  });

  // Game Card Interactions
  const gameCards = document.querySelectorAll('.game-card');
  gameCards.forEach(card => {
    card.addEventListener('click', (e) => {
      const gameName = e.currentTarget.querySelector('h3').textContent;
      console.log(`Routing to game: ${gameName}`);
    });
  });
});
