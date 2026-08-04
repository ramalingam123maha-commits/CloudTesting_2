// ---------- State ----------
const CATEGORIES = {
  income: ['Salary', 'Freelance', 'Investments', 'Gifts', 'Other Income'],
  expense: ['Housing', 'Groceries', 'Transportation', 'Utilities', 'Entertainment', 'Healthcare', 'Dining Out', 'Shopping', 'Savings', 'Other Expense'],
};

const CATEGORY_COLORS = [
  '#4f5eff', '#1fb185', '#f5a524', '#e2554f', '#2d6ce0',
  '#9c6ade', '#e0559f', '#3ab7c8', '#8a9a5b', '#c98a3c',
];

const STORAGE_KEY = 'budgetPlannerData';

let db = loadDb();
let currentMonth = getCurrentMonthKey();
let chartInstance = null;

function getCurrentMonthKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function loadDb() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { months: {} };
  } catch (e) {
    return { months: {} };
  }
}

function saveDb() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

function getMonthData(monthKey) {
  if (!db.months[monthKey]) {
    db.months[monthKey] = { transactions: [], savingsGoal: 0 };
  }
  return db.months[monthKey];
}

// ---------- DOM refs ----------
const monthSelect = document.getElementById('monthSelect');
const txForm = document.getElementById('transactionForm');
const txType = document.getElementById('txType');
const txCategory = document.getElementById('txCategory');
const txAmount = document.getElementById('txAmount');
const txDate = document.getElementById('txDate');
const txDescription = document.getElementById('txDescription');
const txTableBody = document.getElementById('txTableBody');
const txCount = document.getElementById('txCount');
const tableEmptyState = document.getElementById('tableEmptyState');
const chartEmptyState = document.getElementById('chartEmptyState');
const totalIncomeEl = document.getElementById('totalIncome');
const totalExpenseEl = document.getElementById('totalExpense');
const netSavingsEl = document.getElementById('netSavings');
const goalProgressFill = document.getElementById('goalProgressFill');
const goalProgressText = document.getElementById('goalProgressText');
const editGoalBtn = document.getElementById('editGoalBtn');
const goalModal = document.getElementById('goalModal');
const goalInput = document.getElementById('goalInput');
const saveGoalBtn = document.getElementById('saveGoalBtn');
const cancelGoalBtn = document.getElementById('cancelGoalBtn');
const exportPdfBtn = document.getElementById('exportPdfBtn');
const toast = document.getElementById('toast');

// ---------- Init ----------
function init() {
  monthSelect.value = currentMonth;
  txDate.value = new Date().toISOString().slice(0, 10);
  populateCategories();
  render();
}

function populateCategories() {
  const list = CATEGORIES[txType.value];
  txCategory.innerHTML = list.map((c) => `<option value="${c}">${c}</option>`).join('');
}

txType.addEventListener('change', populateCategories);

monthSelect.addEventListener('change', () => {
  currentMonth = monthSelect.value || getCurrentMonthKey();
  render();
});

// ---------- Transactions ----------
txForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const amount = parseFloat(txAmount.value);
  if (!amount || amount <= 0) return;

  const month = getMonthData(currentMonth);
  month.transactions.push({
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    type: txType.value,
    category: txCategory.value,
    amount,
    date: txDate.value,
    description: txDescription.value.trim(),
  });
  saveDb();
  txForm.reset();
  populateCategories();
  txDate.value = new Date().toISOString().slice(0, 10);
  showToast('Transaction added');
  render();
});

function deleteTransaction(id) {
  const month = getMonthData(currentMonth);
  month.transactions = month.transactions.filter((t) => t.id !== id);
  saveDb();
  showToast('Transaction removed');
  render();
}

// ---------- Rendering ----------
function render() {
  const month = getMonthData(currentMonth);
  const { transactions } = month;

  const totalIncome = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const net = totalIncome - totalExpense;

  totalIncomeEl.textContent = formatCurrency(totalIncome);
  totalExpenseEl.textContent = formatCurrency(totalExpense);
  netSavingsEl.textContent = formatCurrency(net);
  netSavingsEl.style.color = net >= 0 ? 'var(--income)' : 'var(--expense)';

  renderGoalProgress(month.savingsGoal, net);
  renderTable(transactions);
  renderChart(transactions);
}

function renderGoalProgress(goal, net) {
  goal = goal || 0;
  const pct = goal > 0 ? Math.min(100, Math.max(0, (net / goal) * 100)) : 0;
  goalProgressFill.style.width = `${pct}%`;
  goalProgressFill.classList.toggle('complete', pct >= 100);
  goalProgressText.textContent = `${formatCurrency(Math.max(net, 0))} / ${formatCurrency(goal)} (${Math.round(pct)}%)`;
}

function renderTable(transactions) {
  const sorted = [...transactions].sort((a, b) => (a.date < b.date ? 1 : -1));
  txCount.textContent = `${transactions.length} transaction${transactions.length === 1 ? '' : 's'}`;

  if (sorted.length === 0) {
    txTableBody.innerHTML = '';
    tableEmptyState.style.display = 'block';
    return;
  }
  tableEmptyState.style.display = 'none';

  txTableBody.innerHTML = sorted.map((t) => `
    <tr>
      <td>${formatDate(t.date)}</td>
      <td><span class="type-badge ${t.type}">${t.type}</span></td>
      <td>${t.category}</td>
      <td>${escapeHtml(t.description) || '&mdash;'}</td>
      <td class="align-right amount-cell ${t.type}">${t.type === 'expense' ? '-' : '+'}${formatCurrency(t.amount)}</td>
      <td class="align-center"><button class="delete-btn" data-id="${t.id}" title="Delete">🗑</button></td>
    </tr>
  `).join('');

  txTableBody.querySelectorAll('.delete-btn').forEach((btn) => {
    btn.addEventListener('click', () => deleteTransaction(btn.dataset.id));
  });
}

function renderChart(transactions) {
  const expenses = transactions.filter((t) => t.type === 'expense');
  const canvas = document.getElementById('categoryChart');

  if (expenses.length === 0) {
    if (chartInstance) { chartInstance.destroy(); chartInstance = null; }
    canvas.style.display = 'none';
    chartEmptyState.style.display = 'block';
    return;
  }
  canvas.style.display = 'block';
  chartEmptyState.style.display = 'none';

  const totals = {};
  expenses.forEach((t) => { totals[t.category] = (totals[t.category] || 0) + t.amount; });
  const labels = Object.keys(totals);
  const data = labels.map((l) => totals[l]);
  const colors = labels.map((_, i) => CATEGORY_COLORS[i % CATEGORY_COLORS.length]);

  if (chartInstance) {
    chartInstance.data.labels = labels;
    chartInstance.data.datasets[0].data = data;
    chartInstance.data.datasets[0].backgroundColor = colors;
    chartInstance.update();
    return;
  }

  chartInstance = new Chart(canvas.getContext('2d'), {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{ data, backgroundColor: colors, borderWidth: 2, borderColor: '#fff' }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } },
        tooltip: {
          callbacks: {
            label: (ctx) => ` ${ctx.label}: ${formatCurrency(ctx.parsed)}`,
          },
        },
      },
      cutout: '62%',
    },
  });
}

// ---------- Savings goal modal ----------
editGoalBtn.addEventListener('click', () => {
  const month = getMonthData(currentMonth);
  goalInput.value = month.savingsGoal || '';
  goalModal.classList.remove('hidden');
});

cancelGoalBtn.addEventListener('click', () => goalModal.classList.add('hidden'));

saveGoalBtn.addEventListener('click', () => {
  const month = getMonthData(currentMonth);
  month.savingsGoal = parseFloat(goalInput.value) || 0;
  saveDb();
  goalModal.classList.add('hidden');
  showToast('Savings goal updated');
  render();
});

goalModal.addEventListener('click', (e) => {
  if (e.target === goalModal) goalModal.classList.add('hidden');
});

// ---------- PDF export ----------
exportPdfBtn.addEventListener('click', async () => {
  exportPdfBtn.disabled = true;
  const originalLabel = exportPdfBtn.innerHTML;
  exportPdfBtn.innerHTML = '<span class="btn-icon">⏳</span> Exporting...';
  try {
    const reportRoot = document.getElementById('reportRoot');
    const canvas = await html2canvas(reportRoot, { scale: 2, backgroundColor: '#f4f6fb' });
    const imgData = canvas.toDataURL('image/jpeg', 0.92);

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 24;
    const usableWidth = pageWidth - margin * 2;
    const imgHeight = (canvas.height * usableWidth) / canvas.width;

    pdf.setFontSize(16);
    pdf.text(`Monthly Budget Report - ${formatMonthLabel(currentMonth)}`, margin, margin);

    let position = margin + 16;
    let heightLeft = imgHeight;
    let sY = 0;

    // Slice image across pages if it doesn't fit on one page
    const pageContentHeight = pageHeight - margin * 2 - 16;
    if (imgHeight <= pageContentHeight) {
      pdf.addImage(imgData, 'JPEG', margin, position, usableWidth, imgHeight);
    } else {
      const scale = canvas.width / usableWidth;
      const sliceHeightPx = pageContentHeight * scale;
      let renderedHeightPt = 0;
      while (renderedHeightPt < imgHeight) {
        const remainingPx = canvas.height - sY;
        const currentSlicePx = Math.min(sliceHeightPx, remainingPx);
        const sliceCanvas = document.createElement('canvas');
        sliceCanvas.width = canvas.width;
        sliceCanvas.height = currentSlicePx;
        const ctx = sliceCanvas.getContext('2d');
        ctx.drawImage(canvas, 0, sY, canvas.width, currentSlicePx, 0, 0, canvas.width, currentSlicePx);
        const sliceData = sliceCanvas.toDataURL('image/jpeg', 0.92);
        const sliceHeightPt = (currentSlicePx * usableWidth) / canvas.width;
        pdf.addImage(sliceData, 'JPEG', margin, margin, usableWidth, sliceHeightPt);
        sY += currentSlicePx;
        renderedHeightPt += sliceHeightPt;
        if (sY < canvas.height) pdf.addPage();
      }
    }

    pdf.save(`budget-report-${currentMonth}.pdf`);
    showToast('PDF exported');
  } catch (err) {
    console.error(err);
    showToast('Failed to export PDF');
  } finally {
    exportPdfBtn.disabled = false;
    exportPdfBtn.innerHTML = originalLabel;
  }
});

// ---------- Helpers ----------
function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value || 0);
}

function formatDate(dateStr) {
  if (!dateStr) return '&mdash;';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatMonthLabel(monthKey) {
  const [y, m] = monthKey.split('-');
  const d = new Date(Number(y), Number(m) - 1, 1);
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}

let toastTimer = null;
function showToast(message) {
  toast.textContent = message;
  toast.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.add('hidden'), 2200);
}

init();
