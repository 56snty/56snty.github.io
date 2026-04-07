document.addEventListener('DOMContentLoaded', () => {
  // Wallet Logic
  const balanceDisplay = document.querySelector('.balance');
  const depositBtn = document.querySelector('.btn-deposit');
  let userBalance = 2450.50;

  const formatCrypto = (amount) => {
    return '$' + amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  balanceDisplay.textContent = formatCrypto(userBalance);

  depositBtn.addEventListener('click', () => {
    depositBtn.textContent = 'Opening...';
    setTimeout(() => {
      userBalance += 100;
      balanceDisplay.textContent = formatCrypto(userBalance);
      depositBtn.textContent = 'Deposit';
    }, 600);
  });

  // Live Bets Generator Logic
  const betsContainer = document.getElementById('bets-body');
  const games = ['Plinko', 'Mines', 'Gates of Olympus', 'Crash', 'Sweet Bonanza', 'Wanted Dead or a Wild'];
  const users = ['Hidden', 'Alex99', 'CryptoKing', 'Hidden', 'DegenX', 'HighRoller'];

  const generateRandomBet = () => {
    const game = games[Math.floor(Math.random() * games.length)];
    const user = users[Math.floor(Math.random() * users.length)];
    const betAmount = (Math.random() * 50).toFixed(2);
    
    // 30% chance to win big, 70% chance to lose/break even
    const isWin = Math.random() > 0.7; 
    let multiplier = isWin ? (Math.random() * 10 + 1.1).toFixed(2) : 0.00;
    let payout = (betAmount * multiplier).toFixed(2);

    const row = document.createElement('div');
    row.className = 'bet-row';
    
    // Animation for new row
    row.style.opacity = '0';
    row.style.transform = 'translateY(-10px)';
    row.style.transition = 'all 0.4s ease';

    row.innerHTML = `
      <div class="bet-game">🎮 ${game}</div>
      <div class="bet-user">👤 ${user}</div>
      <div class="bet-amount">$${betAmount}</div>
      <div class="bet-payout ${isWin ? 'win' : ''}">$${payout}</div>
    `;

    // Prepend and animate
    betsContainer.prepend(row);
    
    // Trigger reflow for animation
    setTimeout(() => {
      row.style.opacity = '1';
      row.style.transform = 'translateY(0)';
    }, 10);

    // Keep only last 5 bets to prevent DOM bloat
    if (betsContainer.children.length > 5) {
      betsContainer.removeChild(betsContainer.lastChild);
    }
  };

  // Generate initial rows
  for(let i=0; i<4; i++) generateRandomBet();

  // Add a new bet every 2 to 4 seconds
  setInterval(generateRandomBet, Math.random() * 2000 + 2000);
});
