        function setupTrial() {
        // Cek jika sudah ada data trial dan statusnya belum aktif
        if (!localStorage.getItem('trialStartDate')) {
            // Set tanggal mulai trial
            const startDate = new Date().toISOString();
            localStorage.setItem('trialStartDate', startDate);
            localStorage.setItem('trialStatus', 'active');
            
            // Tampilkan modal trial
            setTimeout(() => {
                document.getElementById('trialModal').classList.add('active');
            }, 1000);
        } else {
            checkTrialStatus();
        }
        
        // Update countdown setiap detik
        updateTrialCountdown();
        setInterval(updateTrialCountdown, 1000);
        
        // Perbarui tampilan trial saat data di-refresh
        document.getElementById('refreshDataBtn').addEventListener('click', function() {
            // Perbarui countdown setelah refresh selesai
            setTimeout(updateTrialCountdown, 800);
        });

        document.querySelector('.mobile-trial-info').addEventListener('click', function() {
            document.getElementById('trialModal').classList.add('active');
        });
    }

        function checkTrialStatus() {
            const startDate = new Date(localStorage.getItem('trialStartDate'));
            const now = new Date();
            const trialDays = 3;
            
            // Hitung selisih hari
            const diffTime = now - startDate;
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays >= trialDays) {
                localStorage.setItem('trialStatus', 'expired');
                document.getElementById('trialExpiredModal').classList.add('active');
                disableApplication();
            }
        }

        function updateTrialCountdown() {
    if (localStorage.getItem('trialStatus') === 'expired') return;
    
    const startDate = new Date(localStorage.getItem('trialStartDate'));
    const now = new Date();
    const trialDays = 3;
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + trialDays);
    
    // Hitung waktu tersisa
    const diffTime = endDate - now;
    
    if (diffTime <= 0) {
        checkTrialStatus();
        return;
    }
    
    // Hitung hari, jam, menit, detik
    const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffTime % (1000 * 60)) / 1000);
    
    // Format waktu untuk ditampilkan
    const timeString = `${days} Hari ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    const shortTimeString = `${days} Hari ${hours.toString().padStart(2, '0')}j`;
    
    // Update tampilan di sidebar (desktop)
    const countdownEl = document.getElementById('sidebarTrialCountdown');
    if (countdownEl) {
        countdownEl.querySelector('.trial-time').textContent = timeString;
    }
    
    // Update tampilan di mobile
    const mobileCountdown = document.getElementById('mobileTrialCountdown');
    if (mobileCountdown) {
        mobileCountdown.querySelector('span').textContent = shortTimeString;
        
        // Ubah warna jika trial hampir habis
        const progressPercent = ((trialDays * 24 * 60 * 60 * 1000 - diffTime) / (trialDays * 24 * 60 * 60 * 1000)) * 100;
        if (progressPercent > 80) {
            mobileCountdown.style.color = '#ffcc00';
        }
        if (progressPercent > 90) {
            mobileCountdown.style.color = '#ff6666';
        }
    }
    
    // Update progress bar (desktop)
    const totalTrialTime = trialDays * 24 * 60 * 60 * 1000;
    const elapsedTime = totalTrialTime - diffTime;
    const progressPercent = (elapsedTime / totalTrialTime) * 100;
    
    const progressBar = document.getElementById('trialProgressBar');
    if (progressBar) {
        progressBar.style.width = `${progressPercent}%`;
        
        // Ubah warna berdasarkan sisa waktu
        if (progressPercent > 80) {
            progressBar.style.background = 'linear-gradient(90deg, var(--warning), var(--danger))';
        } else if (progressPercent > 50) {
            progressBar.style.background = 'linear-gradient(90deg, var(--warning), var(--accent))';
        }
    }
    
    // Update modal countdown (jika ada)
    const modalCountdown = document.getElementById('trialCountdown');
    if (modalCountdown) {
        modalCountdown.innerHTML = `
            <div style="font-size: 1.5rem; font-weight: bold; margin-bottom: 0.5rem;">${timeString}</div>
            <div style="font-size: 0.9rem; color: var(--gray);">Sisa waktu trial Anda</div>
        `;
    }
    
    // Notifikasi saat trial hampir habis
    if (progressPercent > 90 && !localStorage.getItem('trialWarningShown')) {
        showToast('Masa trial Anda hampir habis!', 'warning');
        localStorage.setItem('trialWarningShown', 'true');
    }
}
        function disableApplication() {
    // Nonaktifkan semua fungsi utama
    document.querySelectorAll('button, input, select, textarea, a').forEach(el => {
        if (el.id !== 'contactUsBtn' && !el.classList.contains('trial-info') && !el.classList.contains('mobile-trial-info')) {
            el.style.pointerEvents = 'none';
            el.style.opacity = '0.5';
        }
    });
    
    // Update tampilan trial di sidebar (desktop)
    const trialInfo = document.querySelector('.trial-info');
    if (trialInfo) {
        trialInfo.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
        trialInfo.style.borderColor = 'var(--danger)';
        trialInfo.querySelector('.trial-time').textContent = '00 Hari 00:00:00';
        trialInfo.querySelector('.trial-label').textContent = 'Trial Telah Berakhir';
        document.getElementById('trialProgressBar').style.width = '100%';
        document.getElementById('trialProgressBar').style.background = 'var(--danger)';
    }
    
    // Update tampilan trial di mobile
    const mobileTrial = document.querySelector('.mobile-trial-info');
    if (mobileTrial) {
        mobileTrial.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
        mobileTrial.style.border = '1px dashed var(--danger)';
        const countdown = mobileTrial.querySelector('#mobileTrialCountdown');
        countdown.innerHTML = '<i class="fas fa-clock"></i><span>Trial Berakhir</span>';
        countdown.style.color = 'white';
    }
    
    // Tampilkan pesan trial expired
    const appContainer = document.querySelector('.app-container');
    if (appContainer) {
        appContainer.style.position = 'relative';
        appContainer.style.filter = 'blur(2px)';
        
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.right = '0';
        overlay.style.bottom = '0';
        overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
        overlay.style.zIndex = '9999';
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.style.color = 'white';
        overlay.style.fontSize = '1.5rem';
        overlay.style.textAlign = 'center';
        overlay.innerHTML = `
            <div>
                <p style="font-size: 2rem; font-weight: bold; margin-bottom: 1rem;">Masa Trial Telah Berakhir</p>
                <p style="margin-bottom: 1.5rem;">Untuk terus menggunakan ZenMix Finance, silakan hubungi kami.</p>
                <button class="btn btn-primary" id="contactOverlayBtn" style="pointer-events: auto;">Hubungi Kami</button>
            </div>
        `;
        document.body.appendChild(overlay);
        
        document.getElementById('contactOverlayBtn').addEventListener('click', () => {
            window.location.href = 'mailto:support@zenmixfinance.com';
        });
    }
}
        // Panggil setupTrial di DOMContentLoaded
        document.addEventListener('DOMContentLoaded', function() {
            // Jika sudah login (ada nama pengguna) tapi belum setup trial
        if (localStorage.getItem('userName') && !localStorage.getItem('trialStartDate')) {
            setupTrial();
        }
            // Event listener untuk tombol modal trial
            document.getElementById('understandTrial').addEventListener('click', function() {
                document.getElementById('trialModal').classList.remove('active');
            });
            
            document.getElementById('contactUsBtn').addEventListener('click', function() {
                window.location.href = 'mailto:support@zenmixfinance.com';
            });
            
            // Blokir klik kanan dan pintasan keyboard
            document.addEventListener('contextmenu', function(e) {
                e.preventDefault();
                showToast('Akses ini dibatasi', 'error');
            });
            
            document.addEventListener('keydown', function(e) {
                // Blokir Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U, F12
                if ((e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) || 
                    (e.ctrlKey && e.key === 'u') || 
                    e.key === 'F12') {
                    e.preventDefault();
                    showToast('Akses developer tools dibatasi', 'error');
                }
            });
        });

        // Blokir akses ke developer tools
        document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
        });
        
        document.onkeydown = function(e) {
            // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
            if (e.key === "F12" || 
                (e.ctrlKey && e.shiftKey && e.key === "I") || 
                (e.ctrlKey && e.shiftKey && e.key === "J") || 
                (e.ctrlKey && e.key === "U")) {
                return false;
            }
        };
        
        // Initialize the application when DOM is loaded
        document.addEventListener('DOMContentLoaded', function() {
            if (localStorage.getItem('userName')) {
                document.getElementById('loginModal').classList.remove('active');
                const userName = localStorage.getItem('userName');
                const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase();
                document.querySelector('.user-avatar').textContent = initials.slice(0, 2);
            }
            // Initialize database
            initDatabase();
            
            // Load all data
            loadData();
            
            // Setup event listeners
            setupEventListeners();
            
            // Set today's date as default
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('transactionDate').value = today;
            document.getElementById('editDate').value = today;
            document.getElementById('exportEndDate').value = today;
            
            // Set first day of current month as default start date
            const firstDay = new Date();
            firstDay.setDate(1);
            document.getElementById('exportStartDate').value = firstDay.toISOString().split('T')[0];

            document.getElementById('confirmLogin').addEventListener('click', function() {
            const userName = document.getElementById('userNameInput').value.trim();
            if (!userName) {
                showToast('Harap masukkan nama Anda', 'error');
                return;
            }
            
            // Save user name to localStorage
            localStorage.setItem('userName', userName);
            
            // Hide login modal
            document.getElementById('loginModal').classList.remove('active');
            
            // Update user avatar in header
            const userAvatar = document.querySelector('.user-avatar');
            const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase();
            userAvatar.textContent = initials.slice(0, 2);
            
            // Mulai masa trial setelah login
            setupTrial();
        });
        });

        // Database functions
        function initDatabase() {
            if (!localStorage.getItem('transactions')) {
                localStorage.setItem('transactions', JSON.stringify([]));
            }
            
            if (!localStorage.getItem('categories')) {
                const defaultCategories = {
                    income: ['gaji', 'bonus', 'investasi', 'hadiah', 'freelance', 'lainnya'],
                    expense: ['makanan', 'transportasi', 'hiburan', 'kesehatan', 'pendidikan', 'tagihan', 'belanja', 'lainnya']
                };
                localStorage.setItem('categories', JSON.stringify(defaultCategories));
            }
        }

        function getTransactions() {
            return JSON.parse(localStorage.getItem('transactions')) || [];
        }

        function saveTransactions(transactions) {
            localStorage.setItem('transactions', JSON.stringify(transactions));
        }

        function getCategories() {
            return JSON.parse(localStorage.getItem('categories'));
        }

        // Data loading functions
        function loadData() {
            updateDashboard();
            loadRecentTransactions();
            loadAllTransactions();
            populateCategorySelects();
            populateTransactionSelect();
        }

        function updateDashboard() {
            const transactions = getTransactions();
            
            let totalIncome = 0;
            let totalExpense = 0;
            
            transactions.forEach(transaction => {
                if (transaction.type === 'income') {
                    totalIncome += transaction.amount;
                } else {
                    totalExpense += transaction.amount;
                }
            });
            
            const totalBalance = totalIncome - totalExpense;
            
            document.getElementById('totalBalance').textContent = formatCurrency(totalBalance);
            document.getElementById('totalIncome').textContent = formatCurrency(totalIncome);
            document.getElementById('totalExpense').textContent = formatCurrency(totalExpense);
        }

        function loadRecentTransactions() {
            const transactions = getTransactions();
            const recentTransactions = transactions
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 5);
                
            const container = document.getElementById('recentTransactions');
            container.innerHTML = '';
            
            if (recentTransactions.length === 0) {
                container.innerHTML = '<div style="padding: 1rem; text-align: center; color: var(--gray);">Tidak ada transaksi</div>';
                return;
            }
            
            recentTransactions.forEach(transaction => {
                container.appendChild(createTransactionElement(transaction));
            });
        }

        function loadAllTransactions() {
            const transactions = getTransactions();
            const container = document.getElementById('allTransactions');
            container.innerHTML = '';
            
            if (transactions.length === 0) {
                container.innerHTML = '<div style="padding: 1rem; text-align: center; color: var(--gray);">Tidak ada transaksi</div>';
                return;
            }
            
            transactions
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .forEach(transaction => {
                    container.appendChild(createTransactionElement(transaction, true));
                });
        }

        function createTransactionElement(transaction, showId = false) {
            const element = document.createElement('div');
            element.className = 'transaction-item';
            
            const iconClass = transaction.type === 'income' ? 'income' : 'expense';
            const icon = transaction.type === 'income' ? 'fa-arrow-down' : 'fa-arrow-up';
            
            element.innerHTML = `
                <div class="transaction-icon ${iconClass}">
                    <i class="fas ${icon}"></i>
                </div>
                <div class="transaction-details">
                    <div class="transaction-title">${transaction.description || 'Tidak ada deskripsi'}</div>
                    <div class="transaction-meta">
                        <span class="transaction-category">${formatCategory(transaction.category)}</span>
                        <span class="transaction-date">${formatDate(transaction.date)}</span>
                        ${showId ? `<span class="transaction-id">#${transaction.id}</span>` : ''}
                    </div>
                </div>
                <div class="transaction-amount ${iconClass}">
                    ${transaction.type === 'income' ? '+' : '-'}${formatCurrency(transaction.amount)}
                </div>
            `;
            
            return element;
        }

        function populateCategorySelects() {
            const categories = getCategories();
            
            // Add transaction form
            const categorySelect = document.getElementById('transactionCategory');
            categorySelect.innerHTML = '<option value="">Pilih Kategori</option>';
            
            // Edit transaction form
            const editCategorySelect = document.getElementById('editCategory');
            editCategorySelect.innerHTML = '<option value="">Pilih Kategori</option>';
            
            // History filter
            const filterCategorySelect = document.getElementById('filterCategory');
            filterCategorySelect.innerHTML = '<option value="all">Semua</option>';
            
            // Add all income categories
            categories.income.forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = formatCategory(category);
                categorySelect.appendChild(option.cloneNode(true));
                editCategorySelect.appendChild(option.cloneNode(true));
                
                const filterOption = option.cloneNode(true);
                filterCategorySelect.appendChild(filterOption);
            });
            
            // Add all expense categories
            categories.expense.forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = formatCategory(category);
                categorySelect.appendChild(option.cloneNode(true));
                editCategorySelect.appendChild(option.cloneNode(true));
                
                const filterOption = option.cloneNode(true);
                filterCategorySelect.appendChild(filterOption);
            });
        }

        function populateTransactionSelect() {
            const transactions = getTransactions();
            const select = document.getElementById('selectTransaction');
            
            select.innerHTML = '<option value="">Cari transaksi...</option>';
            
            transactions
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .forEach(transaction => {
                    const option = document.createElement('option');
                    option.value = transaction.id;
                    option.textContent = `#${transaction.id} - ${formatDate(transaction.date)} - ${formatCurrency(transaction.amount)} (${formatCategory(transaction.category)})`;
                    select.appendChild(option);
                });
        }

        // Form handling functions
        function handleAddTransaction(e) {
            e.preventDefault();
            
            const type = document.getElementById('transactionType').value;
            const amount = parseFloat(document.getElementById('transactionAmount').value);
            const category = document.getElementById('transactionCategory').value;
            const date = document.getElementById('transactionDate').value;
            const description = document.getElementById('transactionDescription').value;
            
            // Validate form
            if (!type || !amount || amount <= 0 || !category || !date) {
                showToast('Harap isi semua field yang diperlukan', 'error');
                return;
            }
            
            // Create transaction object
            const transaction = {
                id: generateId(),
                type,
                amount,
                category,
                date,
                description,
                createdAt: new Date().toISOString()
            };
            
            // Save to localStorage
            const transactions = getTransactions();
            transactions.unshift(transaction);
            saveTransactions(transactions);
            
            // Reset form
            e.target.reset();
            document.getElementById('transactionDate').value = new Date().toISOString().split('T')[0];
            
            // Show success message
            showToast('Transaksi berhasil ditambahkan', 'success');
            
            // Reload data
            loadData();
            
            // Switch to dashboard view
            switchToSection('dashboard');
        }

        function handleEditTransaction(e) {
            e.preventDefault();
            
            const transactionId = document.getElementById('selectTransaction').value;
            const amount = parseFloat(document.getElementById('editAmount').value);
            const category = document.getElementById('editCategory').value;
            const date = document.getElementById('editDate').value;
            const type = document.getElementById('editType').value;
            const description = document.getElementById('editDescription').value;
            
            // Validate form
            if (!transactionId || !amount || amount <= 0 || !category || !date || !type) {
                showToast('Harap isi semua field yang diperlukan', 'error');
                return;
            }
            
            // Update transaction in localStorage
            const transactions = getTransactions();
            const index = transactions.findIndex(t => t.id === transactionId);
            
            if (index === -1) {
                showToast('Transaksi tidak ditemukan', 'error');
                return;
            }
            
            transactions[index] = {
                ...transactions[index],
                type,
                amount,
                category,
                date,
                description
            };
            
            saveTransactions(transactions);
            
            // Show success message
            showToast('Transaksi berhasil diperbarui', 'success');
            
            // Reload data
            loadData();
            
            // Reset form
            document.getElementById('selectTransaction').value = '';
            e.target.reset();
            document.getElementById('editDate').value = new Date().toISOString().split('T')[0];
            
            // Switch to dashboard view
            switchToSection('dashboard');
        }

        function handleDeleteTransaction() {
            const transactionId = document.getElementById('selectTransaction').value;
            
            if (!transactionId) {
                showToast('Pilih transaksi terlebih dahulu', 'error');
                return;
            }
            
            if (!confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) {
                return;
            }
            
            // Delete transaction from localStorage
            const transactions = getTransactions();
            const filtered = transactions.filter(t => t.id !== transactionId);
            saveTransactions(filtered);
            
            // Show success message
            showToast('Transaksi berhasil dihapus', 'success');
            
            // Reload data
            loadData();
            
            // Reset form
            document.getElementById('editTransactionForm').reset();
            document.getElementById('selectTransaction').value = '';
            document.getElementById('editDate').value = new Date().toISOString().split('T')[0];
            
            // Switch to dashboard view
            switchToSection('dashboard');
        }

        function handleTransactionSelect() {
            const transactionId = this.value;
            
            if (!transactionId) {
                document.getElementById('editTransactionForm').reset();
                document.getElementById('editDate').value = new Date().toISOString().split('T')[0];
                return;
            }
            
            const transactions = getTransactions();
            const transaction = transactions.find(t => t.id === transactionId);
            
            if (!transaction) {
                showToast('Transaksi tidak ditemukan', 'error');
                return;
            }
            
            // Fill form with transaction data
            document.getElementById('editAmount').value = transaction.amount;
            document.getElementById('editCategory').value = transaction.category;
            document.getElementById('editDate').value = transaction.date;
            document.getElementById('editType').value = transaction.type;
            document.getElementById('editDescription').value = transaction.description || '';
        }

        // Export functions
        function exportData() {
            const format = document.getElementById('exportFormat').value;
            const period = document.getElementById('exportPeriod').value;
            let transactions = getTransactions();
            
            // Filter by period if needed
            if (period !== 'all') {
                const today = new Date();
                let startDate, endDate = new Date();
                
                if (period === 'month') {
                    startDate = new Date(today.getFullYear(), today.getMonth(), 1);
                } else if (period === 'year') {
                    startDate = new Date(today.getFullYear(), 0, 1);
                } else if (period === 'custom') {
                    startDate = new Date(document.getElementById('exportStartDate').value);
                    endDate = new Date(document.getElementById('exportEndDate').value);
                }
                
                transactions = transactions.filter(t => {
                    const transDate = new Date(t.date);
                    return transDate >= startDate && transDate <= endDate;
                });
            }
            
            if (transactions.length === 0) {
                showToast('Tidak ada data untuk diexport', 'warning');
                return;
            }
            
            if (format === 'json') {
                exportToJson(transactions);
            } else if (format === 'csv') {
                exportToCsv(transactions);
            } else {
                exportToPdf(transactions);
            }
            
            // Close modal
            document.getElementById('exportModal').classList.remove('active');
        }

        function exportToJson(data) {
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `finflow-transactions-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            
            URL.revokeObjectURL(url);
        }

        function exportToCsv(data) {
            const headers = ['ID', 'Jenis', 'Jumlah', 'Kategori', 'Tanggal', 'Deskripsi'];
            const rows = data.map(t => [
                t.id,
                t.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
                t.amount,
                formatCategory(t.category),
                t.date,
                t.description || ''
            ]);
            
            let csv = headers.join(',') + '\n';
            rows.forEach(row => {
                csv += row.map(field => `"${field}"`).join(',') + '\n';
            });
            
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `finflow-transactions-${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
            
            URL.revokeObjectURL(url);
        }

        // PDF export function
        function exportToPdf(data) {
            try {
                const { jsPDF } = window.jspdf;
                const doc = new jsPDF({
                    orientation: "portrait",
                    unit: "mm",
                    format: "a4"
                });

                // Document settings
                const pageWidth = doc.internal.pageSize.getWidth();
                const margin = 15;
                const userName = localStorage.getItem('userName') || 'Pengguna';
                const now = new Date();

                // Calculate period from data
                let minDate = now;
                let maxDate = now;
                if (data.length > 0) {
                    const dates = data.map(t => new Date(t.date).getTime());
                    minDate = new Date(Math.min(...dates));
                    maxDate = new Date(Math.max(...dates));
                }

                // Header
                doc.setFont("helvetica", "bold");
                doc.setFontSize(16);
                doc.setTextColor(40, 40, 40);
                doc.text("LAPORAN TRANSAKSI KEUANGAN", pageWidth / 2, 20, { align: "center" });
                
                doc.setFontSize(10);
                doc.text(`Periode: ${formatPdfDate(minDate)} - ${formatPdfDate(maxDate)}`, 
                        pageWidth / 2, 27, { align: "center" });
                
                doc.setFont("helvetica", "normal");
                doc.text(`Nama: ${userName}`, margin, 35);
                doc.text(`Rekapan: ${getPdfMonthName(minDate)} ${minDate.getFullYear()}`, margin, 40);

                // Separator line
                doc.setDrawColor(200, 200, 200);
                doc.line(margin, 45, pageWidth - margin, 45);

                // Prepare table data
                let balance = 0;
                const tableData = [];
                
                // Sort by date
                const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
                
                sortedData.forEach(transaction => {
                    const isIncome = transaction.type === 'income';
                    if (isIncome) {
                        balance += transaction.amount;
                    } else {
                        balance -= transaction.amount;
                    }
                    
                    tableData.push([
                        formatPdfDate(transaction.date),
                        transaction.description || formatCategory(transaction.category),
                        isIncome ? formatPdfCurrency(transaction.amount) : '',
                        !isIncome ? formatPdfCurrency(transaction.amount) : '',
                        formatPdfCurrency(balance)
                    ]);
                });

                // Calculate totals
                const totalIncome = sortedData.filter(t => t.type === 'income')
                    .reduce((sum, t) => sum + t.amount, 0);
                const totalExpense = sortedData.filter(t => t.type === 'expense')
                    .reduce((sum, t) => sum + t.amount, 0);
                const finalBalance = totalIncome - totalExpense;

                // Add summary rows
                if (tableData.length > 0) {
                    tableData.push(['', '', '', '', '']);
                    
                    // Total Income
                    tableData.push([
                        { content: 'TOTAL PEMASUKAN', colSpan: 2, styles: { fontStyle: 'bold' } },
                        { content: formatPdfCurrency(totalIncome), styles: { fontStyle: 'bold', textColor: [0, 100, 0] } },
                        '',
                        ''
                    ]);
                    
                    // Total Expense
                    tableData.push([
                        { content: 'TOTAL PENGELUARAN', colSpan: 2, styles: { fontStyle: 'bold' } },
                        '',
                        { content: formatPdfCurrency(totalExpense), styles: { fontStyle: 'bold', textColor: [200, 0, 0] } },
                        ''
                    ]);
                    
                    // Final Balance
                    tableData.push([
                        { content: 'SALDO AKHIR', colSpan: 4, styles: { fontStyle: 'bold' } },
                        { content: formatPdfCurrency(finalBalance), styles: { 
                            fontStyle: 'bold',
                            textColor: finalBalance >= 0 ? [0, 100, 0] : [200, 0, 0]
                        }}
                    ]);
                } else {
                    tableData.push(['', 'Tidak ada transaksi', '', '', '']);
                }

                // Create table
                doc.autoTable({
                    startY: 50,
                    head: [
                        [
                            { content: 'Tanggal', styles: { fontStyle: 'bold' } },
                            { content: 'Keterangan', styles: { fontStyle: 'bold' } },
                            { content: 'Pemasukan', styles: { fontStyle: 'bold', halign: 'right' } },
                            { content: 'Pengeluaran', styles: { fontStyle: 'bold', halign: 'right' } },
                            { content: 'Saldo', styles: { fontStyle: 'bold', halign: 'right' } }
                        ]
                    ],
                    body: tableData,
                    headStyles: {
                        fillColor: [51, 51, 51],
                        textColor: [255, 255, 255],
                        cellPadding: 4,
                        fontSize: 10
                    },
                    bodyStyles: {
                        cellPadding: 3,
                        fontSize: 9,
                        overflow: 'linebreak'
                    },
                    alternateRowStyles: {
                        fillColor: [245, 245, 245]
                    },
                    margin: { left: margin, right: margin },
                    columnStyles: {
                        0: { cellWidth: 22 },
                        1: { cellWidth: 'auto' },
                        2: { cellWidth: 30, halign: 'right' },
                        3: { cellWidth: 30, halign: 'right' },
                        4: { cellWidth: 30, halign: 'right' }
                    },
                    didDrawPage: function(data) {
                        // Footer
                        doc.setFontSize(8);
                        doc.setTextColor(100, 100, 100);
                        
                        doc.text(`Tanggal Cetak: ${formatPdfDateTime(now)}`, margin,    270);

                        // Left footer
                        doc.text(`Nama: ${userName}`, margin,   285);
                        doc.text(`Periode: ${getPdfMonthName(minDate)} ${minDate.getFullYear()}`, margin, 290);
                        
                        // Right footer
                        doc.text("ZenMix Finance", pageWidth - margin, 285, { align: "right" });
                        doc.text("Catat, Rapih, Tenang", pageWidth - margin, 290, { align: "right" });
                        
                        // Page number
                        const pageCount = doc.internal.getNumberOfPages();
                        doc.text(`Halaman ${data.pageNumber} dari ${pageCount}`, pageWidth / 2, 290, { align: "center" });
                    }
                });

                // Save PDF
                doc.save(`Laporan_Keuangan_${userName.replace(/\s+/g, '_')}_${formatPdfDate(now)}.pdf`);

            } catch (error) {
                console.error("PDF Export Error:", error);
                showToast('Gagal membuat laporan PDF', 'error');
            }
        }

        // Helper functions for PDF export
        function formatPdfDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString('id-ID', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        }

        function formatPdfDateTime(date) {
            return date.toLocaleString('id-ID', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }

        function formatPdfCurrency(amount) {
            return 'Rp' + amount.toLocaleString('id-ID');
        }

        function getPdfMonthName(date) {
            const months = [
                'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
            ];
            return months[date.getMonth()];
        }
        // Utility functions
        function generateId() {
            return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
        }

        function formatCurrency(amount) {
            return new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0
            }).format(amount);
        }

        function formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }

        function formatCategory(category) {
            const categories = {
                'gaji': 'Gaji',
                'bonus': 'Bonus',
                'investasi': 'Investasi',
                'hadiah': 'Hadiah',
                'freelance': 'Freelance',
                'makanan': 'Makanan',
                'transportasi': 'Transportasi',
                'hiburan': 'Hiburan',
                'kesehatan': 'Kesehatan',
                'pendidikan': 'Pendidikan',
                'tagihan': 'Tagihan',
                'belanja': 'Belanja',
                'lainnya': 'Lainnya'
            };
            
            return categories[category] || category;
        }

        function showToast(message, type = 'success') {
            const toast = document.getElementById('toastNotification');
            const icon = toast.querySelector('.toast-icon');
            const msg = toast.querySelector('.toast-message');
            
            // Update toast content
            msg.textContent = message;
            
            // Update icon based on type
            if (type === 'success') {
                icon.className = 'fas fa-check-circle toast-icon';
                toast.className = 'toast success';
            } else if (type === 'error') {
                icon.className = 'fas fa-times-circle toast-icon';
                toast.className = 'toast error';
            } else if (type === 'warning') {
                icon.className = 'fas fa-exclamation-circle toast-icon';
                toast.className = 'toast warning';
            }
            
            toast.classList.add('show');
            
            // Hide after 3 seconds
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }

        function switchToSection(sectionId) {
            // Hide all sections
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.remove('active');
            });
            
            // Show target section
            document.getElementById(sectionId).classList.add('active');
            
            // Update active nav link (desktop)
            document.querySelectorAll('.nav-link').forEach(navLink => {
                navLink.classList.remove('active');
            });
            document.querySelector(`.nav-link[data-target="${sectionId}"]`).classList.add('active');
            
            // Update active nav link (mobile)
            document.querySelectorAll('.mobile-nav-link').forEach(navLink => {
                navLink.classList.remove('active');
            });
            document.querySelector(`.mobile-nav-link[data-target="${sectionId}"]`).classList.add('active');
        }

        // Event listeners setup
        function setupEventListeners() {

            document.getElementById('userNameDisplay').addEventListener('click', function() {
                const remaining = getRemainingNameEdits();
                if (remaining <= 0) {
                    showToast('Anda sudah mencapai batas pengeditan nama bulan ini', 'error');
                    return;
                }
                
                document.getElementById('newUserNameInput').value = localStorage.getItem('userName') || '';
                updateNameEditCounter();
                document.getElementById('editNameModal').classList.add('active');
            });

            document.getElementById('saveUserName').addEventListener('click', function() {
                if (handleNameEdit()) {
                    document.getElementById('editNameModal').classList.remove('active');
                }
            });

            document.getElementById('cancelEditName').addEventListener('click', function() {
                document.getElementById('editNameModal').classList.remove('active');
            });

            document.getElementById('editNameModal').addEventListener('click', function(e) {
                if (e.target === this) {
                    this.classList.remove('active');
                }
            });

            // Initialize name display and tracking
            updateUserNameDisplay();
            setupNameEditTracking();

            document.getElementById('confirmLogin').addEventListener('click', function() {
                const userName = document.getElementById('userNameInput').value.trim();
                if (!userName) {
                    showToast('Harap masukkan nama Anda', 'error');
                    return;
                }
                
                // Save user name to localStorage
                localStorage.setItem('userName', userName);
                
                // Hide login modal
                document.getElementById('loginModal').classList.remove('active');
                
                // Update user avatar in header
                const userAvatar = document.querySelector('.user-avatar');
                const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase();
                userAvatar.textContent = initials.slice(0, 2);
            });
            // Navigation links (desktop)
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const target = this.getAttribute('data-target');
                    switchToSection(target);
                });
            });

            // Navigation links (mobile)
            document.querySelectorAll('.mobile-nav-link').forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const target = this.getAttribute('data-target');
                    switchToSection(target);
                });
            });

            // Form submissions
            document.getElementById('addTransactionForm').addEventListener('submit', handleAddTransaction);
            document.getElementById('editTransactionForm').addEventListener('submit', handleEditTransaction);
            
            // Transaction select change
            document.getElementById('selectTransaction').addEventListener('change', handleTransactionSelect);
            
            // Delete button
            document.getElementById('deleteTransaction').addEventListener('click', handleDeleteTransaction);
            
            // Cancel edit button
            document.getElementById('cancelEdit').addEventListener('click', function() {
                document.getElementById('editTransactionForm').reset();
                document.getElementById('selectTransaction').value = '';
                document.getElementById('editDate').value = new Date().toISOString().split('T')[0];
                switchToSection('dashboard');
            });
            
            // Export buttons
            document.getElementById('exportDataBtn').addEventListener('click', function() {
                document.getElementById('exportModal').classList.add('active');
            });
            
            document.getElementById('cancelExport').addEventListener('click', function() {
                document.getElementById('exportModal').classList.remove('active');
            });
            
            document.getElementById('confirmExport').addEventListener('click', exportData);
            
            // Click outside modal to close
            document.getElementById('exportModal').addEventListener('click', function(e) {
                if (e.target === this) {
                    this.classList.remove('active');
                }
            });
            
            // Close modal button
            document.querySelector('.close-modal').addEventListener('click', function() {
                document.getElementById('exportModal').classList.remove('active');
            });
            
            // Transaction type change - update categories
            document.getElementById('transactionType').addEventListener('change', function() {
                const type = this.value;
                const categories = getCategories();
                const select = document.getElementById('transactionCategory');
                
                select.innerHTML = '<option value="">Pilih Kategori</option>';
                
                if (type === 'income') {
                    categories.income.forEach(category => {
                        const option = document.createElement('option');
                        option.value = category;
                        option.textContent = formatCategory(category);
                        select.appendChild(option);
                    });
                } else if (type === 'expense') {
                    categories.expense.forEach(category => {
                        const option = document.createElement('option');
                        option.value = category;
                        option.textContent = formatCategory(category);
                        select.appendChild(option);
                    });
                }
            });
            
            // Show/hide custom date range
            document.getElementById('exportPeriod').addEventListener('change', function() {
                const customRange = document.getElementById('customDateRange');
                customRange.style.display = this.value === 'custom' ? 'block' : 'none';
            });
            
            // History filters
            document.getElementById('filterType').addEventListener('change', filterTransactions);
            document.getElementById('filterCategory').addEventListener('change', filterTransactions);
            document.getElementById('filterPeriod').addEventListener('change', filterTransactions);
            document.getElementById('searchBtn').addEventListener('click', filterTransactions);
            document.getElementById('searchHistory').addEventListener('keyup', function(e) {
                if (e.key === 'Enter') {
                    filterTransactions();
                }
            });
            document.getElementById('exportAllDataBtn').addEventListener('click', exportAllData);
            document.getElementById('selectImportFileBtn').addEventListener('click', () => {
                document.getElementById('importFileInput').click();
            });
            document.getElementById('importFileInput').addEventListener('change', handleFileSelect);
            document.getElementById('importDataBtn').addEventListener('click', importData);
            document.getElementById('resetDataBtn').addEventListener('click', () => {
                document.getElementById('resetConfirmModal').classList.add('active');
            });
            document.getElementById('cancelReset').addEventListener('click', () => {
                document.getElementById('resetConfirmModal').classList.remove('active');
            });
            document.getElementById('resetConfirmationInput').addEventListener('input', function() {
                document.getElementById('confirmReset').disabled = this.value.toUpperCase() !== 'HAPUS';
            });
            document.getElementById('confirmReset').addEventListener('click', resetAllData);
            document.getElementById('resetConfirmModal').addEventListener('click', function(e) {
                if (e.target === this) {
                    this.classList.remove('active');
                }
            });
        }

        function filterTransactions() {
            const typeFilter = document.getElementById('filterType').value;
            const categoryFilter = document.getElementById('filterCategory').value;
            const periodFilter = document.getElementById('filterPeriod').value;
            const searchTerm = document.getElementById('searchHistory').value.toLowerCase();
            
            const transactions = getTransactions();
            const container = document.getElementById('allTransactions');
            container.innerHTML = '';
            
            // Get date range based on period filter
            let startDate, endDate;
            const today = new Date();
            
            if (periodFilter === 'week') {
                const day = today.getDay();
                const diff = today.getDate() - day + (day === 0 ? -6 : 1);
                startDate = new Date(today.setDate(diff));
                startDate.setHours(0, 0, 0, 0);
                endDate = new Date();
            } else if (periodFilter === 'month') {
                startDate = new Date(today.getFullYear(), today.getMonth(), 1);
                endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            } else if (periodFilter === 'year') {
                startDate = new Date(today.getFullYear(), 0, 1);
                endDate = new Date(today.getFullYear(), 11, 31);
            }
            
            // Filter transactions
            const filtered = transactions.filter(t => {
                // Type filter
                if (typeFilter !== 'all' && t.type !== typeFilter) {
                    return false;
                }
                
                // Category filter
                if (categoryFilter !== 'all' && t.category !== categoryFilter) {
                    return false;
                }
                
                // Period filter
                if (periodFilter !== 'all') {
                    const transDate = new Date(t.date);
                    if (transDate < startDate || transDate > endDate) {
                        return false;
                    }
                }
                
                // Search term
                if (searchTerm) {
                    const searchFields = [
                        t.id,
                        t.type,
                        t.amount.toString(),
                        t.category,
                        t.date,
                        t.description || ''
                    ];
                    
                    if (!searchFields.some(field => field.toLowerCase().includes(searchTerm))) {
                        return false;
                    }
                }
                
                return true;
            });
            
            if (filtered.length === 0) {
                container.innerHTML = '<div style="padding: 1rem; text-align: center; color: var(--gray);">Tidak ada transaksi yang sesuai</div>';
                return;
            }
            
            filtered
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .forEach(t => {
                    container.appendChild(createTransactionElement(t, true));
                });
        }
        // Add these functions to your script
        function updateUserNameDisplay() {
            const userName = localStorage.getItem('userName') || 'Pengguna';
            document.getElementById('userNameDisplay').textContent = userName;
            
            // Update avatar initials
            const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase();
            document.querySelector('.user-avatar').textContent = initials.slice(0, 2);
        }

        function setupNameEditTracking() {
            if (!localStorage.getItem('nameEditHistory')) {
                localStorage.setItem('nameEditHistory', JSON.stringify({
                    count: 0,
                    lastReset: new Date().getTime()
                }));
            }
            
            // Reset counter if new month
            const now = new Date();
            const history = JSON.parse(localStorage.getItem('nameEditHistory'));
            const lastReset = new Date(history.lastReset);
            
            if (now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear()) {
                localStorage.setItem('nameEditHistory', JSON.stringify({
                    count: 0,
                    lastReset: now.getTime()
                }));
            }
        }

        function getRemainingNameEdits() {
            const history = JSON.parse(localStorage.getItem('nameEditHistory'));
            return Math.max(0, 5 - history.count);
        }

        function updateNameEditCounter() {
            const remaining = getRemainingNameEdits();
            document.getElementById('remainingEdits').textContent = remaining;
        }

        function handleNameEdit() {
            const history = JSON.parse(localStorage.getItem('nameEditHistory'));
            const remaining = getRemainingNameEdits();
            
            if (remaining <= 0) {
                showToast('Anda sudah mencapai batas pengeditan nama bulan ini', 'error');
                return false;
            }
            
            const newName = document.getElementById('newUserNameInput').value.trim();
            if (!newName) {
                showToast('Nama tidak boleh kosong', 'error');
                return false;
            }
            
            // Update name
            localStorage.setItem('userName', newName);
            
            // Update edit count
            localStorage.setItem('nameEditHistory', JSON.stringify({
                count: history.count + 1,
                lastReset: history.lastReset
            }));
            
            updateUserNameDisplay();
            updateNameEditCounter();
            showToast('Nama berhasil diperbarui', 'success');
            return true;
        }
        // Fungsi utama untuk refresh data
        function refreshData() {
            // Tampilkan animasi loading pada tombol refresh
            const refreshBtn = document.getElementById('refreshDataBtn');
            const refreshIcon = refreshBtn.querySelector('i');
            refreshIcon.classList.add('fa-spin');
            
            // Simulasikan loading (pada aplikasi real, ini bisa request ke server)
            setTimeout(() => {
                // Load ulang semua data
                loadData();
                
                // Hentikan animasi loading
                refreshIcon.classList.remove('fa-spin');
                
                // Tampilkan notifikasi
                showToast('Data berhasil diperbarui', 'success');
            }, 800); // Waktu loading bisa disesuaikan
        }

        // Implementasi pull-to-refresh untuk mobile
        let touchStartY = 0;
        let touchEndY = 0;

        document.addEventListener('touchstart', e => {
            touchStartY = e.touches[0].clientY;
        }, { passive: true });

        document.addEventListener('touchmove', e => {
            touchEndY = e.touches[0].clientY;
        }, { passive: true });

        document.addEventListener('touchend', e => {
            // Cek jika user melakukan swipe down dari bagian paling atas
            if (window.scrollY === 0 && touchStartY > touchEndY && (touchStartY - touchEndY) > 100) {
                refreshData();
            }
        }, { passive: true });

        // Event listener untuk tombol refresh
        document.getElementById('refreshDataBtn').addEventListener('click', refreshData);

        function exportAllData() {
            const data = {
                transactions: getTransactions(),
                categories: getCategories(),
                userName: localStorage.getItem('userName'),
                nameEditHistory: JSON.parse(localStorage.getItem('nameEditHistory') || '{}'),
                exportedAt: new Date().toISOString()
            };
            
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `ZenMix-Backup-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            
            URL.revokeObjectURL(url);
            
            showToast('Backup data berhasil dibuat', 'success');
        }

        // Fungsi untuk menangani pemilihan file
        function handleFileSelect(e) {
            const file = e.target.files[0];
            if (!file) return;
            
            document.getElementById('selectedFileName').textContent = file.name;
            document.getElementById('importDataBtn').disabled = false;
        }

        // Fungsi untuk mengimpor data
        function importData() {
            const fileInput = document.getElementById('importFileInput');
            if (!fileInput.files.length) {
                showToast('Pilih file backup terlebih dahulu', 'error');
                return;
            }
            
            const file = fileInput.files[0];
            const reader = new FileReader();
            
            reader.onload = function(e) {
                try {
                    const data = JSON.parse(e.target.result);
                    
                    // Validasi data
                    if (!data.transactions || !data.categories || !data.userName) {
                        throw new Error('Format file backup tidak valid');
                    }
                    
                    if (!confirm('Apakah Anda yakin ingin mengimpor data ini? Semua data saat ini akan ditimpa.')) {
                        return;
                    }
                    
                    // Simpan data
                    localStorage.setItem('transactions', JSON.stringify(data.transactions));
                    localStorage.setItem('categories', JSON.stringify(data.categories));
                    localStorage.setItem('userName', data.userName);
                    localStorage.setItem('nameEditHistory', JSON.stringify(data.nameEditHistory || { count: 0, lastReset: new Date().getTime() }));
                    
                    // Reset file input
                    fileInput.value = '';
                    document.getElementById('selectedFileName').textContent = 'Belum ada file dipilih';
                    document.getElementById('importDataBtn').disabled = true;
                    
                    // Perbarui UI
                    updateUserNameDisplay();
                    loadData();
                    
                    showToast('Data berhasil diimpor', 'success');
                } catch (error) {
                    console.error('Import error:', error);
                    showToast('Gagal mengimpor data: ' + error.message, 'error');
                }
            };
            
            reader.onerror = function() {
                showToast('Gagal membaca file', 'error');
            };
            
            reader.readAsText(file);
        }

        // Fungsi untuk mereset semua data
        function resetAllData() {
            // Hapus semua data dari localStorage
            localStorage.removeItem('transactions');
            localStorage.removeItem('categories');
            localStorage.removeItem('userName');
            localStorage.removeItem('nameEditHistory');
            
            // Inisialisasi ulang database
            initDatabase();
            
            // Perbarui UI
            updateUserNameDisplay();
            loadData();
            
            // Tutup modal
            document.getElementById('resetConfirmModal').classList.remove('active');
            
            showToast('Semua data telah direset', 'success');
        }