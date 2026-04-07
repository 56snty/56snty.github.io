document.addEventListener('DOMContentLoaded', () => {
  // --- Wallet & Modal Logic ---
  const balanceDisplay = document.querySelector('.balance');
  const depositBtns = document.querySelectorAll('.btn-primary'); // Works for all deposit buttons
  const modalOverlay = document.querySelector('.modal-overlay');
  const closeModalBtn = document.querySelector('.close-btn');
  const confirmDepositBtn = document.getElementById('confirm-deposit');
  const amountInput = document.getElementById('deposit-amount');
  
  let userBalance = 2450.50;

  const formatCrypto = (amount) => {
    return '$' + amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  balanceDisplay.textContent = formatCrypto(userBalance);

  // Open Modal
  depositBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modalOverlay.classList.add('active');
      amountInput.focus();
    });
  });

  // Close Modal
  const closeModal = () => {
    modalOverlay.classList.remove('active');
    amountInput.value = ''; // Reset input
  };

  closeModalBtn.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if(e.target === modalOverlay) closeModal();
  });

  // Process Mock Deposit
  confirmDepositBtn.addEventListener('click', () => {
    const amount = parseFloat(amountInput.value);
    if (!isNaN(amount) && amount > 0) {
      confirmDepositBtn.textContent = 'Processing...';
      
      setTimeout(() => {
        userBalance += amount;
        balanceDisplay.textContent = formatCrypto(userBalance);
        confirmDepositBtn.textContent = 'Pay via Apple Pay';
        closeModal();
      }, 800);
    }
  });

  // --- Game Card Micro-Interactions ---
  const gameCards = document.querySelectorAll('.game-card');
  gameCards.forEach(card => {
    card.addEventListener('click', () => {
      // Simulate a loading state or route change
      card.style.transform = 'scale(0.95)';
      setTimeout(() => {
        card.style.transform = '';
        console.log('Loading game interface...');
      }, 150);
    });
  });
});
