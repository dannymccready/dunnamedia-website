/**
 * Accounting Application
 * Financial Management System
 */

// TEST: Verify this file is loaded
console.log('=== ACCOUNTING APP.JS LOADED ===', new Date().toISOString());

// CRITICAL: Define function at the absolute top, before anything else
// This ensures it's available immediately when the page loads
window.openCashTransactionModal = function(transactionId) {
    transactionId = transactionId || null;
    alert('Function called!');
    console.log('=== openCashTransactionModal CALLED ===', transactionId);
    console.log('Document ready state:', document.readyState);
    
    try {
        const modal = document.getElementById('cashTransactionModal');
        const modalBody = document.getElementById('cashTransactionBody');
        const modalTitle = document.getElementById('cashTransactionModalTitle');
        
        if (!modal || !modalBody) {
            alert('Modal elements not found. Please refresh the page.');
            return;
        }
        
        const isEdit = transactionId !== null;
        const transaction = isEdit && typeof cashTransactions !== 'undefined' ? cashTransactions.find(t => t.id === transactionId) : null;
        
        if (modalTitle) {
            modalTitle.textContent = isEdit ? 'Edit Cash Transaction' : 'Add Cash Transaction';
        }
        
        const projects = [
            'Riverside Tower',
            'Metro Shopping Centre',
            'Harbour View Apartments',
            'City Plaza',
            'Industrial Complex',
            'None'
        ];
        
        modalBody.innerHTML = `
            <form id="cashTransactionForm" onsubmit="submitCashTransaction(event, '${transactionId || ''}')">
                <div class="form-group">
                    <label for="cashType">Transaction Type *</label>
                    <select id="cashType" name="type" required>
                        <option value="in" ${transaction && transaction.type === 'in' ? 'selected' : ''}>Cash In</option>
                        <option value="out" ${transaction && transaction.type === 'out' ? 'selected' : ''}>Cash Out</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="cashAmount">Amount *</label>
                    <input type="number" id="cashAmount" name="amount" step="0.01" min="0" required 
                           value="${transaction ? transaction.amount : ''}" 
                           placeholder="0.00">
                </div>
                <div class="form-group">
                    <label for="cashDate">Date *</label>
                    <input type="date" id="cashDate" name="date" required 
                           value="${transaction ? transaction.date : new Date().toISOString().split('T')[0]}">
                </div>
                <div class="form-group">
                    <label for="cashReason">Reason/Details *</label>
                    <textarea id="cashReason" name="reason" rows="3" required 
                              placeholder="Enter reason or details for this transaction">${transaction ? transaction.reason : ''}</textarea>
                </div>
                <div class="form-group">
                    <label for="cashProject">Project</label>
                    <select id="cashProject" name="project">
                        ${projects.map(p => `
                            <option value="${p === 'None' ? '' : p}" ${transaction && transaction.project === p ? 'selected' : ''}>
                                ${p}
                            </option>
                        `).join('')}
                    </select>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn-secondary" onclick="closeCashTransactionModal()">Cancel</button>
                    <button type="submit" class="btn-primary">${isEdit ? 'Update' : 'Add'} Transaction</button>
                </div>
            </form>
        `;
        
        modal.classList.add('active');
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        modal.style.zIndex = '1000';
        modal.style.visibility = 'visible';
        modal.style.opacity = '1';
        
        console.log('Modal activated');
    } catch (error) {
        console.error('Error opening cash transaction modal:', error);
        alert('Error opening modal: ' + error.message);
    }
};

// Verify function is assigned
console.log('Function defined at top:', typeof window.openCashTransactionModal);
if (typeof window.openCashTransactionModal !== 'function') {
    console.error('ERROR: Function not assigned! Reassigning...');
    // Force reassignment
    var fn = window.openCashTransactionModal;
    window.openCashTransactionModal = fn;
}

// Make absolutely sure it's available
if (typeof window.openCashTransactionModal === 'function') {
    console.log('SUCCESS: Function is available on window');
    // Also make it available globally
    if (typeof openCashTransactionModal === 'undefined') {
        openCashTransactionModal = window.openCashTransactionModal;
    }
} else {
    console.error('CRITICAL: Function still not available after definition!');
}

// ============================================
// CONFIGURATION & CONSTANTS
// ============================================

// Function is already defined at the top of the file (line 8)
// No need to redefine it here

// Verify function is assigned immediately after definition
console.log('Function assigned to window:', typeof window.openCashTransactionModal);
if (typeof window.openCashTransactionModal !== 'function') {
    console.error('ERROR: Function not assigned to window!');
} else {
    console.log('SUCCESS: openCashTransactionModal is available as a function');
    // Make it available in global scope too
    if (typeof openCashTransactionModal === 'undefined') {
        openCashTransactionModal = window.openCashTransactionModal;
    }
}

const APP_CONFIG = {
    companyName: 'CMS Construction',
    currency: 'GBP',
    currencySymbol: '£',
    defaultPOFormat: 'CMS<random number>',
    vatRate: 20
};

let currentView = 'summary';

// ============================================
// STATE MANAGEMENT
// ============================================

let invoices = [];
let expenses = [];
let expenseRequests = [];
let subscriptions = [];
let credits = [];
let rebates = [];
let cashTransactions = []; // Cash transactions (in/out)
let bankStatements = [];
let bankTransactions = []; // Transactions from uploaded bank statements
let suppliers = []; // Shared with procurement app
let rebateAgreements = []; // Shared with procurement app

// ============================================
// SIMULATED DATA GENERATION
// ============================================

function generateInvoices() {
    // Sample invoices: AI will pull these in from email. linkedPO = order in procurement app (CMSxxxxx).
    invoices = [
        {
            id: 'INV-2024-001',
            number: 'INV-2024-001',
            supplier: 'SteelFab Solutions',
            date: '2024-01-15',
            dueDate: '2024-02-14',
            amount: 12450.00,
            status: 'paid',
            category: 'Materials',
            project: 'Riverside Tower',
            items: [
                { description: 'Steel Beams', quantity: 10, unitPrice: 1245.00, total: 12450.00 }
            ],
            paired: true,
            pairedWithTransaction: 'TXN-001',
            linkedPO: 'CMS00123',
            source: 'email',
            receivedAt: '2024-01-15'
        },
        {
            id: 'INV-2024-002',
            number: 'INV-2024-002',
            supplier: 'BuildMate Supplies',
            date: '2024-01-20',
            dueDate: '2024-02-19',
            amount: 8750.00,
            status: 'pending',
            category: 'Materials',
            project: 'Metro Shopping Centre',
            items: [
                { description: 'Concrete Mix', quantity: 50, unitPrice: 175.00, total: 8750.00 }
            ],
            paired: false,
            source: 'upload'
        },
        {
            id: 'INV-2024-003',
            number: 'INV-2024-003',
            supplier: 'ElectraTech',
            date: '2024-01-25',
            dueDate: '2024-02-24',
            amount: 3420.00,
            status: 'pending',
            category: 'Electrical',
            project: 'Harbour View Apartments',
            items: [
                { description: 'Electrical Supplies', quantity: 1, unitPrice: 3420.00, total: 3420.00 }
            ],
            paired: false,
            linkedPO: 'CMS00456',
            source: 'email',
            receivedAt: '2024-01-25'
        },
        {
            id: 'INV-2024-004',
            number: 'INV-2024-004',
            supplier: 'PlumbPro Ltd',
            date: '2024-01-28',
            dueDate: '2024-02-27',
            amount: 2150.00,
            status: 'pending',
            category: 'Plumbing',
            project: 'Riverside Tower',
            items: [
                { description: 'Plumbing Fixtures', quantity: 1, unitPrice: 2150.00, total: 2150.00 }
            ],
            paired: false,
            source: 'email',
            receivedAt: '2024-01-28'
        },
        {
            id: 'INV-2024-005',
            number: 'INV-2024-005',
            supplier: 'RoofTech Systems',
            date: '2024-02-01',
            dueDate: '2024-03-02',
            amount: 18900.00,
            status: 'pending',
            category: 'Materials',
            project: 'Metro Shopping Centre',
            items: [
                { description: 'Roofing Materials', quantity: 1, unitPrice: 18900.00, total: 18900.00 }
            ],
            paired: false,
            linkedPO: 'CMS00789',
            source: 'email',
            receivedAt: '2024-02-01'
        },
        {
            id: 'INV-2024-006',
            number: 'INV-2024-006',
            supplier: 'Flooring Experts',
            date: '2024-02-05',
            dueDate: '2024-03-06',
            amount: 5670.00,
            status: 'pending',
            category: 'Materials',
            project: 'Harbour View Apartments',
            items: [
                { description: 'Flooring Materials', quantity: 1, unitPrice: 5670.00, total: 5670.00 }
            ],
            paired: false,
            linkedPO: 'CMS01234',
            source: 'email',
            receivedAt: '2024-02-05'
        },
        {
            id: 'INV-2024-007',
            number: 'INV-2024-007',
            supplier: 'Safety Gear Pro',
            date: '2024-02-10',
            dueDate: '2024-03-11',
            amount: 1890.00,
            status: 'overdue',
            category: 'Safety',
            project: 'City Plaza',
            items: [
                { description: 'PPE and safety equipment', quantity: 1, unitPrice: 1890.00, total: 1890.00 }
            ],
            paired: false,
            source: 'manual'
        },
        {
            id: 'INV-2024-008',
            number: 'INV-2024-008',
            supplier: 'Premier Glass Co',
            date: '2024-02-12',
            dueDate: '2024-03-13',
            amount: 8250.00,
            status: 'pending',
            category: 'Glazing',
            project: 'Metro Shopping Centre',
            items: [
                { description: 'Double-glazed units', quantity: 1, unitPrice: 8250.00, total: 8250.00 }
            ],
            paired: false,
            linkedPO: 'CMS01567',
            source: 'email',
            receivedAt: '2024-02-12'
        },
        {
            id: 'INV-2024-009',
            number: 'INV-2024-009',
            supplier: 'HVAC Direct',
            date: '2024-02-14',
            dueDate: '2024-03-15',
            amount: 11200.00,
            status: 'pending',
            category: 'HVAC',
            project: 'Harbour View Apartments',
            items: [
                { description: 'HVAC units and installation', quantity: 1, unitPrice: 11200.00, total: 11200.00 }
            ],
            paired: false,
            linkedPO: 'CMS01890',
            source: 'email',
            receivedAt: '2024-02-14'
        },
        {
            id: 'INV-2024-010',
            number: 'INV-2024-010',
            supplier: 'BuildMate Supplies',
            date: '2024-02-18',
            dueDate: '2024-03-19',
            amount: 4300.00,
            status: 'paid',
            category: 'Materials',
            project: 'Riverside Tower',
            items: [
                { description: 'Aggregate and sand', quantity: 1, unitPrice: 4300.00, total: 4300.00 }
            ],
            paired: true,
            pairedWithTransaction: 'TXN-023',
            source: 'upload'
        },
        {
            id: 'INV-2024-011',
            number: 'INV-2024-011',
            supplier: 'ElectraTech',
            date: '2024-02-20',
            dueDate: '2024-03-21',
            amount: 2680.00,
            status: 'pending',
            category: 'Electrical',
            project: 'City Plaza',
            items: [
                { description: 'Lighting and switches', quantity: 1, unitPrice: 2680.00, total: 2680.00 }
            ],
            paired: false,
            source: 'email',
            receivedAt: '2024-02-20'
        },
        {
            id: 'INV-2024-012',
            number: 'INV-2024-012',
            supplier: 'SteelFab Solutions',
            date: '2024-02-22',
            dueDate: '2024-03-23',
            amount: 15600.00,
            status: 'pending',
            category: 'Materials',
            project: 'Industrial Complex',
            items: [
                { description: 'Structural steel order', quantity: 1, unitPrice: 15600.00, total: 15600.00 }
            ],
            paired: false,
            linkedPO: 'CMS02234',
            source: 'email',
            receivedAt: '2024-02-22'
        },
        {
            id: 'INV-2024-013',
            number: 'INV-2024-013',
            supplier: 'Premier Glass Co',
            date: '2024-02-15',
            dueDate: '2024-03-16',
            amount: 8250.00,
            status: 'paid',
            category: 'Glazing',
            project: 'Metro Shopping Centre',
            items: [
                { description: 'Double-glazed units', quantity: 1, unitPrice: 8250.00, total: 8250.00 }
            ],
            paired: true,
            pairedWithTransaction: 'TXN-021',
            linkedPO: 'CMS01567',
            source: 'email',
            receivedAt: '2024-02-15'
        },
        {
            id: 'INV-2024-014',
            number: 'INV-2024-014',
            supplier: 'Scaffold Hire Ltd',
            date: '2024-02-18',
            dueDate: '2024-03-19',
            amount: 4200.00,
            status: 'pending',
            category: 'Equipment',
            project: 'Riverside Tower',
            items: [
                { description: 'Monthly scaffold hire', quantity: 1, unitPrice: 4200.00, total: 4200.00 }
            ],
            paired: false,
            source: 'email',
            receivedAt: '2024-02-18'
        },
        {
            id: 'INV-2024-015',
            number: 'INV-2024-015',
            supplier: 'SecureSite Fencing',
            date: '2024-02-19',
            dueDate: '2024-03-20',
            amount: 1850.00,
            status: 'pending',
            category: 'Safety',
            project: 'City Plaza',
            items: [
                { description: 'Site fencing and barriers', quantity: 1, unitPrice: 1850.00, total: 1850.00 }
            ],
            paired: false,
            source: 'upload'
        },
        {
            id: 'INV-2024-016',
            number: 'INV-2024-016',
            supplier: 'BuildMate Supplies',
            date: '2024-02-20',
            dueDate: '2024-03-21',
            amount: 6200.00,
            status: 'pending',
            category: 'Materials',
            project: 'Harbour View Apartments',
            items: [
                { description: 'Bricks and blocks', quantity: 1, unitPrice: 6200.00, total: 6200.00 }
            ],
            paired: false,
            linkedPO: 'CMS02456',
            source: 'email',
            receivedAt: '2024-02-20'
        },
        {
            id: 'INV-2024-017',
            number: 'INV-2024-017',
            supplier: 'Plant & Machinery Hire',
            date: '2024-02-21',
            dueDate: '2024-03-22',
            amount: 8900.00,
            status: 'pending',
            category: 'Equipment',
            project: 'Industrial Complex',
            items: [
                { description: 'Excavator hire - 2 weeks', quantity: 1, unitPrice: 8900.00, total: 8900.00 }
            ],
            paired: false,
            linkedPO: 'CMS02678',
            source: 'email',
            receivedAt: '2024-02-21'
        },
        {
            id: 'INV-2024-018',
            number: 'INV-2024-018',
            supplier: 'PlumbPro Ltd',
            date: '2024-02-23',
            dueDate: '2024-03-24',
            amount: 3800.00,
            status: 'pending',
            category: 'Plumbing',
            project: 'Metro Shopping Centre',
            items: [
                { description: 'Pipework and fittings', quantity: 1, unitPrice: 3800.00, total: 3800.00 }
            ],
            paired: false,
            source: 'email',
            receivedAt: '2024-02-23'
        },
        {
            id: 'INV-2024-019',
            number: 'INV-2024-019',
            supplier: 'InsulateRight',
            date: '2024-02-24',
            dueDate: '2024-03-25',
            amount: 5450.00,
            status: 'paid',
            category: 'Materials',
            project: 'Harbour View Apartments',
            items: [
                { description: 'Insulation materials', quantity: 1, unitPrice: 5450.00, total: 5450.00 }
            ],
            paired: true,
            pairedWithTransaction: 'TXN-022',
            source: 'upload'
        },
        {
            id: 'INV-2024-020',
            number: 'INV-2024-020',
            supplier: 'Safety Gear Pro',
            date: '2024-02-25',
            dueDate: '2024-03-26',
            amount: 1890.00,
            status: 'overdue',
            category: 'Safety',
            project: 'City Plaza',
            items: [
                { description: 'PPE and safety equipment', quantity: 1, unitPrice: 1890.00, total: 1890.00 }
            ],
            paired: false,
            source: 'manual'
        },
        {
            id: 'INV-2024-021',
            number: 'INV-2024-021',
            supplier: 'ElectraTech',
            date: '2024-02-26',
            dueDate: '2024-03-27',
            amount: 4280.00,
            status: 'pending',
            category: 'Electrical',
            project: 'Riverside Tower',
            items: [
                { description: 'Cabling and distribution', quantity: 1, unitPrice: 4280.00, total: 4280.00 }
            ],
            paired: false,
            linkedPO: 'CMS02890',
            source: 'email',
            receivedAt: '2024-02-26'
        },
        {
            id: 'INV-2024-022',
            number: 'INV-2024-022',
            supplier: 'Paint & Decor Supplies',
            date: '2024-02-27',
            dueDate: '2024-03-28',
            amount: 2100.00,
            status: 'pending',
            category: 'Materials',
            project: 'Metro Shopping Centre',
            items: [
                { description: 'Paint and sundries', quantity: 1, unitPrice: 2100.00, total: 2100.00 }
            ],
            paired: false,
            source: 'email',
            receivedAt: '2024-02-27'
        },
        {
            id: 'INV-2024-023',
            number: 'INV-2024-023',
            supplier: 'WasteAway Services',
            date: '2024-02-28',
            dueDate: '2024-03-29',
            amount: 1650.00,
            status: 'pending',
            category: 'Services',
            project: 'Industrial Complex',
            items: [
                { description: 'Skip hire and waste removal', quantity: 1, unitPrice: 1650.00, total: 1650.00 }
            ],
            paired: false,
            source: 'upload'
        },
        {
            id: 'INV-2024-024',
            number: 'INV-2024-024',
            supplier: 'HVAC Direct',
            date: '2024-02-29',
            dueDate: '2024-03-30',
            amount: 11200.00,
            status: 'pending',
            category: 'HVAC',
            project: 'Harbour View Apartments',
            items: [
                { description: 'HVAC units and installation', quantity: 1, unitPrice: 11200.00, total: 11200.00 }
            ],
            paired: false,
            linkedPO: 'CMS01890',
            source: 'email',
            receivedAt: '2024-02-29'
        }
    ];
}

function generateBankTransactions() {
    // ALWAYS generate sample transactions for demo - ignore localStorage for demo data
    // Generate simulated bank transactions for demo
    bankTransactions = [
        {
            id: 'TXN-001',
            date: '2024-01-16',
            description: 'PAYMENT - SteelFab Solutions',
            amount: -12450.00,
            reference: 'INV-2024-001',
            type: 'debit',
            paired: true,
            pairedWithInvoice: 'INV-2024-001',
            balance: 125000.00
        },
        {
            id: 'TXN-002',
            date: '2024-01-22',
            description: 'PAYMENT - BuildMate Supplies',
            amount: -8750.00,
            reference: 'INV-2024-002',
            type: 'debit',
            paired: false,
            balance: 116250.00
        },
        {
            id: 'TXN-003',
            date: '2024-01-26',
            description: 'PAYMENT - ElectraTech',
            amount: -3420.00,
            reference: 'INV-2024-003',
            type: 'debit',
            paired: false,
            balance: 112830.00
        },
        {
            id: 'TXN-004',
            date: '2024-01-29',
            description: 'PAYMENT - PlumbPro Ltd',
            amount: -2150.00,
            reference: 'INV-2024-004',
            type: 'debit',
            paired: false,
            balance: 110680.00
        },
        {
            id: 'TXN-005',
            date: '2024-02-02',
            description: 'PAYMENT - RoofTech Systems',
            amount: -18900.00,
            reference: 'INV-2024-005',
            type: 'debit',
            paired: false,
            balance: 91780.00
        },
        {
            id: 'TXN-006',
            date: '2024-02-06',
            description: 'PAYMENT - Flooring Experts',
            amount: -5670.00,
            reference: 'INV-2024-006',
            type: 'debit',
            paired: false,
            balance: 86110.00
        },
        {
            id: 'TXN-007',
            date: '2024-01-18',
            description: 'SALARY PAYROLL',
            amount: -45000.00,
            reference: 'PAY-2024-01',
            type: 'debit',
            paired: false,
            balance: 137450.00
        },
        {
            id: 'TXN-008',
            date: '2024-01-24',
            description: 'OFFICE RENT',
            amount: -3500.00,
            reference: 'RENT-2024-01',
            type: 'debit',
            paired: true,
            pairedWithExpense: 'EXP-001',
            balance: 115330.00
        },
        {
            id: 'TXN-009',
            date: '2024-01-30',
            description: 'CLIENT PAYMENT - Riverside Tower',
            amount: 50000.00,
            reference: 'INV-CLIENT-001',
            type: 'credit',
            paired: false,
            balance: 160680.00
        },
        {
            id: 'TXN-010',
            date: '2024-02-03',
            description: 'CLIENT PAYMENT - Metro Shopping',
            amount: 75000.00,
            reference: 'INV-CLIENT-002',
            type: 'credit',
            paired: false,
            balance: 235680.00
        },
        {
            id: 'TXN-011',
            date: '2024-01-19',
            description: 'EXPENSE PAYMENT - Office Supplies',
            amount: -125.50,
            reference: 'EXP-004',
            type: 'debit',
            paired: false,
            balance: 124874.50
        },
        {
            id: 'TXN-012',
            date: '2024-01-22',
            description: 'EXPENSE PAYMENT - Equipment Maintenance',
            amount: -450.00,
            reference: 'EXP-008',
            type: 'debit',
            paired: false,
            balance: 115880.00
        },
        {
            id: 'TXN-013',
            date: '2024-01-25',
            description: 'SUBSCRIPTION - Microsoft 365',
            amount: -120.00,
            reference: 'SUB-MS365',
            type: 'debit',
            paired: false,
            balance: 112710.00
        },
        {
            id: 'TXN-014',
            date: '2024-01-27',
            description: 'SUBSCRIPTION - Adobe Creative Cloud',
            amount: -55.00,
            reference: 'SUB-ADOBE',
            type: 'debit',
            paired: false,
            balance: 110655.00
        },
        {
            id: 'TXN-015',
            date: '2024-01-20',
            description: 'CREDIT NOTE - Supplier Refund',
            amount: 500.00,
            reference: 'CREDIT-001',
            type: 'credit',
            paired: false,
            balance: 111155.00
        },
        {
            id: 'TXN-016',
            date: '2024-01-28',
            description: 'CASH DEPOSIT',
            amount: 2000.00,
            reference: 'CASH-IN-001',
            type: 'credit',
            paired: false,
            balance: 113155.00
        },
        {
            id: 'TXN-017',
            date: '2024-01-31',
            description: 'CASH WITHDRAWAL',
            amount: -500.00,
            reference: 'CASH-OUT-001',
            type: 'debit',
            paired: false,
            balance: 112655.00
        },
        {
            id: 'TXN-018',
            date: '2024-02-01',
            description: 'BANK CHARGES',
            amount: -25.00,
            reference: 'CHARGES-2024-02',
            type: 'debit',
            paired: false,
            balance: 112630.00
        },
        {
            id: 'TXN-019',
            date: '2024-02-04',
            description: 'EXPENSE PAYMENT - Marketing Services',
            amount: -5000.00,
            reference: 'EXP-003',
            type: 'debit',
            paired: false,
            balance: 107630.00
        },
        {
            id: 'TXN-020',
            date: '2024-02-05',
            description: 'REBATE RECEIVED - Supplier Agreement',
            amount: 1500.00,
            reference: 'REBATE-001',
            type: 'credit',
            paired: false,
            balance: 109130.00
        },
        {
            id: 'TXN-021',
            date: '2024-02-16',
            description: 'PAYMENT - Premier Glass Co',
            amount: -8250.00,
            reference: 'INV-2024-013',
            type: 'debit',
            paired: true,
            pairedWithInvoice: 'INV-2024-013',
            balance: 100880.00
        },
        {
            id: 'TXN-022',
            date: '2024-02-25',
            description: 'PAYMENT - InsulateRight',
            amount: -5450.00,
            reference: 'INV-2024-019',
            type: 'debit',
            paired: true,
            pairedWithInvoice: 'INV-2024-019',
            balance: 95530.00
        },
        {
            id: 'TXN-023',
            date: '2024-02-18',
            description: 'PAYMENT - BuildMate Supplies',
            amount: -4300.00,
            reference: 'INV-2024-010',
            type: 'debit',
            paired: true,
            pairedWithInvoice: 'INV-2024-010',
            balance: 104780.00
        },
        {
            id: 'TXN-024',
            date: '2024-02-19',
            description: 'PAYMENT - Scaffold Hire Ltd',
            amount: -4200.00,
            reference: 'INV-2024-014',
            type: 'debit',
            paired: false,
            balance: 100580.00
        },
        {
            id: 'TXN-025',
            date: '2024-02-20',
            description: 'PAYMENT - SecureSite Fencing',
            amount: -1850.00,
            reference: 'INV-2024-015',
            type: 'debit',
            paired: false,
            balance: 98730.00
        },
        {
            id: 'TXN-026',
            date: '2024-02-22',
            description: 'SALARY PAYROLL',
            amount: -45200.00,
            reference: 'PAY-2024-02',
            type: 'debit',
            paired: false,
            balance: 53530.00
        },
        {
            id: 'TXN-027',
            date: '2024-02-24',
            description: 'OFFICE RENT',
            amount: -3500.00,
            reference: 'RENT-2024-02',
            type: 'debit',
            paired: false,
            balance: 50030.00
        },
        {
            id: 'TXN-028',
            date: '2024-02-26',
            description: 'CLIENT PAYMENT - Harbour View',
            amount: 62000.00,
            reference: 'INV-CLIENT-003',
            type: 'credit',
            paired: false,
            balance: 112030.00
        },
        {
            id: 'TXN-029',
            date: '2024-02-27',
            description: 'PAYMENT - ElectraTech',
            amount: -2680.00,
            reference: 'INV-2024-011',
            type: 'debit',
            paired: false,
            balance: 109350.00
        },
        {
            id: 'TXN-030',
            date: '2024-02-28',
            description: 'PAYMENT - Paint & Decor Supplies',
            amount: -2100.00,
            reference: 'INV-2024-022',
            type: 'debit',
            paired: false,
            balance: 107250.00
        },
        {
            id: 'TXN-031',
            date: '2024-02-29',
            description: 'SUBSCRIPTION - Project Management',
            amount: -89.00,
            reference: 'SUB-PM-2024',
            type: 'debit',
            paired: false,
            balance: 107161.00
        },
        {
            id: 'TXN-032',
            date: '2024-03-01',
            description: 'BANK CHARGES',
            amount: -25.00,
            reference: 'CHARGES-2024-03',
            type: 'debit',
            paired: false,
            balance: 107136.00
        },
        {
            id: 'TXN-033',
            date: '2024-03-02',
            description: 'PAYMENT - SteelFab Solutions',
            amount: -15600.00,
            reference: 'INV-2024-012',
            type: 'debit',
            paired: false,
            balance: 91536.00
        },
        {
            id: 'TXN-034',
            date: '2024-03-03',
            description: 'EXPENSE PAYMENT - Site Security',
            amount: -3200.00,
            reference: 'EXP-SEC-003',
            type: 'debit',
            paired: false,
            balance: 88336.00
        },
        {
            id: 'TXN-035',
            date: '2024-03-04',
            description: 'PAYMENT - PlumbPro Ltd',
            amount: -2150.00,
            reference: 'INV-2024-004',
            type: 'debit',
            paired: false,
            balance: 86186.00
        },
        {
            id: 'TXN-036',
            date: '2024-03-05',
            description: 'CASH DEPOSIT',
            amount: 3500.00,
            reference: 'CASH-IN-002',
            type: 'credit',
            paired: false,
            balance: 89686.00
        },
        {
            id: 'TXN-037',
            date: '2024-03-06',
            description: 'PAYMENT - Flooring Experts',
            amount: -5670.00,
            reference: 'INV-2024-006',
            type: 'debit',
            paired: false,
            balance: 84016.00
        },
        {
            id: 'TXN-038',
            date: '2024-03-07',
            description: 'PAYMENT - Safety Gear Pro',
            amount: -1890.00,
            reference: 'INV-2024-007',
            type: 'debit',
            paired: false,
            balance: 82126.00
        }
    ];
    
    // Merge with any uploaded transactions from localStorage (those with TXN-UPLOAD prefix)
    const saved = localStorage.getItem('bankTransactions');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
                const uploaded = parsed.filter(t => t.id && t.id.startsWith('TXN-UPLOAD'));
                bankTransactions = [...bankTransactions, ...uploaded];
            }
        } catch (e) {
            console.error('Error loading uploaded transactions from localStorage:', e);
        }
    }
    
    // Always save to localStorage for persistence
    localStorage.setItem('bankTransactions', JSON.stringify(bankTransactions));
    
    console.log('Generated', bankTransactions.length, 'bank transactions for demo');
}

function generateExpenses() {
    // Expense flow: submitted (web/mobile) -> pending approval -> approve -> approved -> post -> posted (ready for reconciliation)
    // Fields: user (submittedBy), date, reason (description), cost (amount), tax, receipt image (AI may extract from image)
    expenses = [
        {
            id: 'EXP-001',
            description: 'Office rent payment',
            reason: 'Monthly office rent - January',
            amount: 3500.00,
            tax: 0,
            date: '2024-01-01',
            category: 'Office',
            receipt: 'receipt-001.jpg',
            receiptImage: 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="120" height="80" viewBox="0 0 120 80"><rect fill="%23f0f0f0" width="120" height="80"/><text x="60" y="42" font-size="10" fill="%23999" text-anchor="middle">Receipt image</text></svg>'),
            status: 'posted',
            type: 'company',
            submittedBy: 'Finance Team',
            project: null,
            approvedBy: 'Finance Manager',
            approvedDate: '2024-01-01',
            postedDate: '2024-01-02',
            source: 'web',
            paired: true,
            pairedWithTransaction: 'TXN-008'
        },
        {
            id: 'EXP-002',
            description: 'Software license renewal',
            reason: 'Annual Microsoft 365 licence renewal',
            amount: 1200.00,
            tax: 240.00,
            date: '2024-01-15',
            category: 'Software',
            receipt: 'receipt-002.jpg',
            receiptImage: null,
            status: 'posted',
            type: 'company',
            submittedBy: 'IT Department',
            project: null,
            approvedBy: 'IT Manager',
            approvedDate: '2024-01-15',
            postedDate: '2024-01-16',
            source: 'web',
            paired: false
        },
        {
            id: 'EXP-003',
            description: 'Marketing agency services',
            reason: 'Q1 campaign design and copy',
            amount: 5000.00,
            tax: 1000.00,
            date: '2024-01-28',
            category: 'Marketing',
            receipt: 'receipt-003.jpg',
            receiptImage: null,
            status: 'pending',
            type: 'company',
            submittedBy: 'Marketing Team',
            project: null,
            approvedBy: null,
            approvedDate: null,
            source: 'web',
            paired: false
        },
        {
            id: 'EXP-004',
            description: 'Site visit travel expenses',
            reason: 'Train and taxi to Riverside Tower site',
            amount: 125.50,
            tax: 0,
            date: '2024-01-18',
            category: 'Travel',
            receipt: 'receipt-004.jpg',
            receiptImage: null,
            status: 'posted',
            type: 'employee',
            submittedBy: 'John Smith',
            project: 'Riverside Tower',
            approvedBy: 'Project Manager',
            approvedDate: '2024-01-19',
            postedDate: '2024-01-20',
            source: 'mobile',
            paired: false
        },
        {
            id: 'EXP-005',
            description: 'Meal expenses - Client meeting',
            reason: 'Lunch with client at Metro site',
            amount: 85.00,
            tax: 0,
            date: '2024-01-25',
            category: 'Meals',
            receipt: 'receipt-005.jpg',
            receiptImage: null,
            status: 'pending',
            type: 'employee',
            submittedBy: 'Sarah Johnson',
            project: 'Metro Shopping Centre',
            approvedBy: null,
            approvedDate: null,
            source: 'mobile',
            paired: false
        },
        {
            id: 'EXP-006',
            description: 'Fuel for site vehicle',
            reason: 'Petrol for site van - week 4 Jan',
            amount: 65.00,
            tax: 0,
            date: '2024-01-28',
            category: 'Travel',
            receipt: 'receipt-006.jpg',
            receiptImage: null,
            status: 'pending',
            type: 'employee',
            submittedBy: 'Mike Brown',
            project: 'Metro Shopping Centre',
            approvedBy: null,
            approvedDate: null,
            source: 'mobile',
            paired: false
        },
        {
            id: 'EXP-007',
            description: 'Consultant fees - Legal advice',
            reason: 'Contract review - Harbour View',
            amount: 2500.00,
            tax: 500.00,
            date: '2024-01-20',
            category: 'Professional Services',
            receipt: 'receipt-007.jpg',
            receiptImage: null,
            status: 'pending',
            type: 'misc',
            submittedBy: 'Legal Team',
            project: null,
            approvedBy: null,
            approvedDate: null,
            source: 'web',
            paired: false
        },
        {
            id: 'EXP-008',
            description: 'Equipment maintenance',
            reason: 'Van service and MOT',
            amount: 450.00,
            tax: 0,
            date: '2024-01-22',
            category: 'Maintenance',
            receipt: 'receipt-008.jpg',
            receiptImage: null,
            status: 'approved',
            type: 'misc',
            submittedBy: 'Operations',
            project: null,
            approvedBy: 'Operations Manager',
            approvedDate: '2024-01-22',
            source: 'web',
            paired: false
        },
        {
            id: 'EXP-009',
            description: 'Training course fees',
            reason: 'Site safety refresher course',
            amount: 750.00,
            tax: 150.00,
            date: '2024-01-30',
            category: 'Training',
            receipt: 'receipt-009.jpg',
            receiptImage: null,
            status: 'pending',
            type: 'misc',
            submittedBy: 'HR Department',
            project: null,
            approvedBy: null,
            approvedDate: null,
            source: 'web',
            paired: false
        },
        {
            id: 'EXP-010',
            description: 'Parking and congestion charge',
            reason: 'Site visit City Plaza - parking',
            amount: 28.50,
            tax: 0,
            date: '2024-02-01',
            category: 'Travel',
            receipt: null,
            receiptImage: null,
            status: 'pending',
            type: 'employee',
            submittedBy: 'Emma Wilson',
            project: 'City Plaza',
            approvedBy: null,
            approvedDate: null,
            source: 'mobile',
            paired: false
        },
        {
            id: 'EXP-011',
            description: 'Team lunch - project kick-off',
            reason: 'Lunch for 6 - Metro project start',
            amount: 142.00,
            tax: 0,
            date: '2024-02-03',
            category: 'Meals',
            receipt: 'receipt-011.jpg',
            receiptImage: null,
            status: 'approved',
            type: 'employee',
            submittedBy: 'Sarah Johnson',
            project: 'Metro Shopping Centre',
            approvedBy: 'Finance Manager',
            approvedDate: '2024-02-04',
            source: 'mobile',
            paired: false
        },
        {
            id: 'EXP-012',
            description: 'Office supplies',
            reason: 'Stationery and printer paper',
            amount: 89.99,
            tax: 18.00,
            date: '2024-02-05',
            category: 'Office',
            receipt: 'receipt-012.jpg',
            receiptImage: null,
            status: 'pending',
            type: 'company',
            submittedBy: 'Finance Team',
            project: null,
            approvedBy: null,
            approvedDate: null,
            source: 'web',
            paired: false
        }
    ];
}

function generateExpenseRequests() {
    expenseRequests = [
        {
            id: 'REQ-001',
            description: 'Fuel for site vehicle',
            amount: 65.00,
            date: '2024-01-28',
            receipt: 'receipt-req-001.jpg',
            status: 'pending',
            submittedBy: 'Mike Brown',
            project: 'Metro Shopping Centre'
        }
    ];
}

function generateSubscriptions() {
    // Subscriptions Manager: website URL, login details, notes, calculations; linked to invoices; AI suggestions from invoices/bank; reconciled
    subscriptions = [
        {
            id: 'SUB-001',
            name: 'Software License - Project Manager',
            provider: 'TechCorp Software',
            amount: 299.00,
            frequency: 'monthly',
            nextPayment: '2024-02-01',
            startDate: '2023-01-01',
            date: '2024-01-25',
            status: 'active',
            category: 'Software',
            email: 'billing@techcorp.com',
            websiteUrl: 'https://app.techcorp.com/login',
            loginDetails: 'Stored securely • Admin account',
            calculations: { annual: 3588.00, monthly: 299.00 },
            linkedInvoices: ['INV-SUB-001', 'INV-SUB-002', 'INV-SUB-003'],
            invoices: [
                { id: 'INV-SUB-001', date: '2024-01-01', amount: 299.00, status: 'paid' },
                { id: 'INV-SUB-002', date: '2023-12-01', amount: 299.00, status: 'paid' },
                { id: 'INV-SUB-003', date: '2023-11-01', amount: 299.00, status: 'paid' }
            ],
            notes: 'Annual renewal in June. Contact support for discounts. AI links invoices from email to this subscription.',
            terms: 'Monthly billing, 30-day cancellation notice required. Auto-renewal enabled.',
            contractEnd: '2024-12-31',
            source: 'manual',
            project: null,
            paired: false
        },
        {
            id: 'SUB-002',
            name: 'Cloud Storage',
            provider: 'CloudHost Ltd',
            amount: 49.99,
            frequency: 'monthly',
            nextPayment: '2024-02-05',
            startDate: '2023-06-01',
            date: '2024-01-25',
            status: 'active',
            category: 'IT Services',
            email: 'billing@cloudhost.com',
            websiteUrl: 'https://cloudhost.com/dashboard',
            loginDetails: 'Stored securely',
            calculations: { annual: 599.88, monthly: 49.99 },
            linkedInvoices: ['INV-SUB-004', 'INV-SUB-005'],
            invoices: [
                { id: 'INV-SUB-004', date: '2024-01-05', amount: 49.99, status: 'paid' },
                { id: 'INV-SUB-005', date: '2023-12-05', amount: 49.99, status: 'paid' }
            ],
            notes: 'Storage tier: 500GB. Can upgrade to 1TB for £79.99/month.',
            terms: 'Pay-as-you-go, cancel anytime. Data retention: 30 days after cancellation.',
            contractEnd: null,
            source: 'manual',
            project: null,
            paired: false
        },
        {
            id: 'SUB-003',
            name: 'Design Tools Suite',
            provider: 'DesignTools Inc',
            amount: 149.00,
            frequency: 'monthly',
            nextPayment: '2024-02-10',
            startDate: '2023-08-01',
            date: '2024-01-25',
            status: 'active',
            category: 'Software',
            email: 'invoices@designtools.com',
            websiteUrl: 'https://designtools.com/account',
            loginDetails: 'Stored securely • Team admin',
            calculations: { annual: 1788.00, monthly: 149.00 },
            linkedInvoices: ['INV-SUB-006', 'INV-SUB-007'],
            invoices: [
                { id: 'INV-SUB-006', date: '2024-01-10', amount: 149.00, status: 'paid' },
                { id: 'INV-SUB-007', date: '2023-12-10', amount: 149.00, status: 'paid' }
            ],
            notes: 'Team license for 5 users. Additional users: £25/month each.',
            terms: 'Annual contract, monthly payments. Early termination fee: 2 months.',
            contractEnd: '2024-07-31',
            source: 'ai-suggestion',
            suggestedFrom: { type: 'invoice', id: 'INV-2024-003' },
            project: null,
            paired: false
        },
        {
            id: 'SUB-004',
            name: 'Microsoft 365 Business',
            provider: 'Microsoft',
            amount: 120.00,
            frequency: 'monthly',
            nextPayment: '2024-02-01',
            startDate: '2023-01-01',
            date: '2024-01-25',
            status: 'active',
            category: 'Software',
            email: 'billing@microsoft.com',
            websiteUrl: 'https://admin.microsoft.com',
            loginDetails: 'Stored securely • Global admin',
            calculations: { annual: 1440.00, monthly: 120.00 },
            linkedInvoices: [],
            invoices: [],
            notes: 'Business Standard plan for 10 users. AI can auto-retrieve subscription details from provider website.',
            terms: 'Monthly subscription, auto-renewal',
            contractEnd: null,
            source: 'manual',
            project: null,
            paired: false
        },
        {
            id: 'SUB-005',
            name: 'Adobe Creative Cloud',
            provider: 'Adobe',
            amount: 55.00,
            frequency: 'monthly',
            nextPayment: '2024-02-01',
            startDate: '2023-06-01',
            date: '2024-01-27',
            status: 'active',
            category: 'Software',
            email: 'billing@adobe.com',
            websiteUrl: 'https://account.adobe.com',
            loginDetails: 'Stored securely',
            calculations: { annual: 660.00, monthly: 55.00 },
            linkedInvoices: [],
            invoices: [],
            notes: 'Single user license',
            terms: 'Monthly subscription',
            contractEnd: null,
            source: 'manual',
            project: null,
            paired: false
        }
    ];
}

function getSuggestedSubscriptions() {
    // AI suggestions from invoices and bank statements – one-click add to Subscriptions Manager
    return [
        {
            id: 'suggest-001',
            provider: 'CloudHost Pro',
            name: 'CloudHost Pro',
            detectedFrom: '3 invoices, 5 emails',
            amount: 99.00,
            frequency: 'monthly',
            confidence: 92,
            email: 'billing@cloudhostpro.com',
            lastInvoiceDate: '2024-01-15',
            websiteUrl: 'https://cloudhostpro.com/login',
            suggestedFrom: { type: 'invoice', id: 'INV-2024-001' },
            notes: 'AI detected recurring monthly payments of £99.00 from CloudHost Pro invoices and emails. Link invoices to this subscription once added.'
        },
        {
            id: 'suggest-002',
            provider: 'Marketing Automation Platform',
            name: 'Marketing Automation Platform',
            detectedFrom: '2 invoices, 4 emails',
            amount: 199.00,
            frequency: 'monthly',
            confidence: 78,
            email: 'noreply@marketingauto.com',
            lastInvoiceDate: '2024-01-20',
            websiteUrl: null,
            suggestedFrom: { type: 'bank', id: 'TXN-013' },
            notes: 'AI detected potential subscription from bank statement and invoice pattern. Add to manager to link future invoices.'
        },
        {
            id: 'suggest-003',
            provider: 'Security Monitoring Service',
            name: 'Security Monitoring Service',
            detectedFrom: '4 invoices, 3 emails',
            amount: 75.00,
            frequency: 'monthly',
            confidence: 85,
            email: 'billing@securitymon.com',
            lastInvoiceDate: '2024-01-25',
            websiteUrl: 'https://securitymon.com/portal',
            suggestedFrom: { type: 'invoice', id: 'INV-2024-007' },
            notes: 'Regular monthly charges detected. AI can auto-retrieve details from provider website once added.'
        }
    ];
}

function generateCredits() {
    credits = [
        {
            id: 'CRED-001',
            number: 'CR-2024-001',
            supplier: 'SteelFab Solutions',
            date: '2024-01-20',
            amount: 500.00,
            reason: 'Returned materials',
            status: 'processed',
            originalInvoice: 'INV-2024-001',
            project: 'Riverside Tower',
            source: 'email',
            paired: false
        },
        {
            id: 'CRED-002',
            number: 'CR-2024-002',
            supplier: 'BuildMate Supplies',
            date: '2024-01-25',
            amount: 250.00,
            reason: 'Damaged goods refund',
            status: 'pending',
            originalInvoice: 'INV-2024-002',
            project: 'Metro Shopping Centre',
            source: 'upload',
            paired: false
        },
        {
            id: 'CRED-003',
            number: 'CR-2024-003',
            supplier: 'ElectraTech',
            date: '2024-02-01',
            amount: 150.00,
            reason: 'Overpayment refund',
            status: 'processed',
            originalInvoice: 'INV-2024-003',
            project: 'Harbour View Apartments',
            source: 'email',
            paired: false
        },
        {
            id: 'CRED-004',
            number: 'CR-2024-004',
            supplier: 'Safety Gear Pro',
            date: '2024-01-28',
            amount: 320.00,
            reason: 'Faulty equipment return',
            status: 'pending',
            originalInvoice: 'INV-2024-007',
            project: 'City Plaza',
            source: 'manual',
            paired: false
        },
        {
            id: 'CRED-005',
            number: 'CR-2024-005',
            supplier: 'SteelFab Solutions',
            date: '2024-01-15',
            amount: 180.00,
            reason: 'Price adjustment',
            status: 'applied',
            originalInvoice: 'INV-2023-089',
            project: 'Riverside Tower',
            source: 'email',
            paired: true
        },
        {
            id: 'CRED-006',
            number: 'CR-2024-006',
            supplier: 'RoofTech Systems',
            date: '2024-02-05',
            amount: 450.00,
            reason: 'Credit against future order',
            status: 'processed',
            originalInvoice: 'INV-2024-012',
            project: 'Industrial Complex',
            source: 'email',
            paired: false
        }
    ];
}

function generateRebates() {
    rebates = [
        {
            id: 'REB-001',
            supplier: 'SteelFab Solutions',
            agreementName: 'Volume Discount Agreement',
            date: '2024-02-05',
            amount: 1500.00,
            percentage: 5,
            minOrder: 10000,
            status: 'pending',
            project: 'Riverside Tower',
            paired: false
        },
        {
            id: 'REB-002',
            supplier: 'BuildMate Supplies',
            agreementName: 'Quarterly Rebate',
            date: '2024-01-31',
            amount: 800.00,
            percentage: 3,
            minOrder: 5000,
            status: 'pending',
            project: 'Metro Shopping Centre',
            paired: false
        },
        {
            id: 'REB-003',
            supplier: 'RoofTech Systems',
            agreementName: 'Annual Volume Rebate',
            date: '2024-02-10',
            amount: 2000.00,
            percentage: 10,
            minOrder: 15000,
            status: 'pending',
            project: 'Metro Shopping Centre',
            paired: false
        }
    ];
}

function generateSuppliers() {
    // Shared with procurement app – includes all suppliers from sample invoices
    suppliers = [
        { id: 'SUP-001', name: 'SteelFab Solutions', category: 'Structural Steel' },
        { id: 'SUP-002', name: 'BuildMate Supplies', category: 'General Materials' },
        { id: 'SUP-003', name: 'ElectraTech', category: 'Electrical' },
        { id: 'SUP-004', name: 'PlumbPro Ltd', category: 'Plumbing' },
        { id: 'SUP-005', name: 'RoofTech Systems', category: 'Materials' },
        { id: 'SUP-006', name: 'Flooring Experts', category: 'Materials' },
        { id: 'SUP-007', name: 'Safety Gear Pro', category: 'Safety' },
        { id: 'SUP-008', name: 'Premier Glass Co', category: 'Glazing' },
        { id: 'SUP-009', name: 'HVAC Direct', category: 'HVAC' }
    ];
}

function generateRebateAgreements() {
    // Shared with procurement app
    rebateAgreements = [
        {
            id: 'RAG-001',
            supplier: 'SteelFab Solutions',
            name: 'Volume Discount Agreement',
            percentage: 5,
            minOrder: 10000,
            startDate: '2024-01-01',
            endDate: '2024-12-31',
            status: 'active'
        }
    ];
}

// ============================================
// INITIALIZATION
// ============================================

function initializeApp() {
    console.log('=== INITIALIZE APP CALLED ===');
    
    // Initialize PO formats first
    initializePOFormats();
    
    // Load cash transactions from localStorage
    try {
        const savedCashTransactions = localStorage.getItem('cashTransactions');
        if (savedCashTransactions) {
            cashTransactions = JSON.parse(savedCashTransactions);
            console.log('Loaded', cashTransactions.length, 'cash transactions from localStorage');
        } else {
            // Generate sample cash transactions for demo if none exist
            cashTransactions = [
                {
                    id: 'CASH-001',
                    type: 'in',
                    amount: 2000.00,
                    date: '2024-01-28',
                    reason: 'Cash deposit from client',
                    project: 'Riverside Tower',
                    pairedWithTransaction: null
                },
                {
                    id: 'CASH-002',
                    type: 'out',
                    amount: 500.00,
                    date: '2024-01-31',
                    reason: 'Petty cash withdrawal',
                    project: null,
                    pairedWithTransaction: null
                },
                {
                    id: 'CASH-003',
                    type: 'in',
                    amount: 1500.00,
                    date: '2024-02-02',
                    reason: 'Cash payment received',
                    project: 'Metro Shopping Centre',
                    pairedWithTransaction: null
                },
                {
                    id: 'CASH-004',
                    type: 'out',
                    amount: 300.00,
                    date: '2024-02-04',
                    reason: 'Site expenses',
                    project: 'Harbour View Apartments',
                    pairedWithTransaction: null
                }
            ];
            localStorage.setItem('cashTransactions', JSON.stringify(cashTransactions));
        }
    } catch (error) {
        console.error('Error loading cash transactions from localStorage:', error);
        cashTransactions = [];
    }
    
    // ALWAYS generate sample data for demo - don't check localStorage first
    console.log('Generating sample data for demo...');
    generateInvoices();
    generateBankTransactions();
    generateExpenses();
    generateExpenseRequests();
    generateSubscriptions();
    generateCredits();
    generateRebates();
    generateSuppliers();
    generateRebateAgreements();
    
    // Debug: Log data counts
    console.log('=== DATA INITIALIZED ===', {
        invoices: invoices.length,
        bankTransactions: bankTransactions.length,
        expenses: expenses.length,
        subscriptions: subscriptions.length,
        credits: credits.length,
        rebates: rebates.length,
        cashTransactions: cashTransactions.length
    });
    
    setupNavigation();
    
    // Enhance switchView with rendering after all functions are loaded
    const originalSwitchView = window.switchView;
    if (originalSwitchView) {
        window.switchView = function(viewName) {
            // Call original for view switching
            originalSwitchView(viewName);
            
            // Then add rendering
            if (!viewName) return;
            
            // Update current view
            currentView = viewName;
            
            // Render view content
            try {
                switch(viewName) {
                    case 'summary':
                        if (typeof renderSummary === 'function') renderSummary();
                        break;
                    case 'reconciliation':
                        console.log('=== SWITCHING TO RECONCILIATION VIEW ===');
                        if (typeof renderReconciliation === 'function') {
                            // Force data generation
                            if (typeof generateBankTransactions === 'function') generateBankTransactions();
                            if (typeof generateInvoices === 'function') generateInvoices();
                            if (typeof generateExpenses === 'function') generateExpenses();
                            if (typeof generateSubscriptions === 'function') generateSubscriptions();
                            if (typeof generateCredits === 'function') generateCredits();
                            if (typeof generateRebates === 'function') generateRebates();
                            renderReconciliation();
                        } else {
                            console.error('renderReconciliation function not found!');
                        }
                        break;
                    case 'invoices':
                        if (typeof generateInvoices === 'function' && (!invoices || invoices.length === 0)) generateInvoices();
                        if (typeof renderInvoices === 'function') renderInvoices();
                        break;
                    case 'expenses':
                        if (typeof renderExpenses === 'function') renderExpenses();
                        break;
                    case 'subscriptions':
                        if (typeof renderSubscriptions === 'function') renderSubscriptions();
                        break;
                    case 'credits':
                        if (typeof renderCredits === 'function') renderCredits();
                        break;
                    case 'rebates':
                        if (typeof renderRebates === 'function') renderRebates();
                        break;
                    case 'cash':
                        if (typeof renderCash === 'function') renderCash();
                        break;
                    case 'costing':
                        if (typeof renderCosting === 'function') renderCosting();
                        break;
                    case 'reports':
                        if (typeof renderReports === 'function') renderReports();
                        break;
                    case 'settings':
                        if (typeof renderSettings === 'function') renderSettings();
                        break;
                }
            } catch (error) {
                console.error('Error rendering view:', viewName, error);
            }
            
            // Update page actions
            if (typeof updatePageActions === 'function') {
                try {
                    updatePageActions();
                } catch (e) {
                    console.error('Error updating page actions:', e);
                }
            }
        };
        console.log('Enhanced switchView with rendering in initializeApp');
    }
    
    // Initialize with summary view - hide all views first, then show summary
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
    
    const summaryView = document.getElementById('summaryView');
    if (summaryView) {
        summaryView.classList.add('active');
        renderSummary();
    }
    
    // Set up event listeners for add cash transaction buttons
    setTimeout(function() {
        const addCashBtn = document.getElementById('addCashTransactionBtn');
        const addCashBtnEmpty = document.getElementById('addCashTransactionBtnEmpty');
        
        if (addCashBtn) {
            addCashBtn.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Add cash button clicked via event listener');
                if (typeof window.openCashTransactionModal === 'function') {
                    window.openCashTransactionModal();
                } else {
                    console.error('openCashTransactionModal not available');
                    alert('Error: Function not available. Please refresh the page.');
                }
            });
        }
        
        if (addCashBtnEmpty) {
            addCashBtnEmpty.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Add cash button (empty state) clicked');
                if (typeof window.openCashTransactionModal === 'function') {
                    window.openCashTransactionModal();
                } else {
                    console.error('openCashTransactionModal not available');
                    alert('Error: Function not available. Please refresh the page.');
                }
            });
        }
        
        // Also handle dynamically created buttons with event delegation
        document.addEventListener('click', function(e) {
            const btn = e.target.closest('#addCashTransactionBtn, #addCashTransactionBtnEmpty, #addCashTransactionBtnPageActions');
            if (btn) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Add cash button clicked (delegated):', btn.id);
                alert('Button clicked!'); // Temporary debug
                if (typeof window.openCashTransactionModal === 'function') {
                    window.openCashTransactionModal();
                } else {
                    alert('Function not found!');
                }
            }
        }, true);
    }, 100);
    
    renderSummary();
    updatePageActions();
    
    showToast('success', 'Welcome', 'Accounting system loaded successfully');
    
    console.log('=== INITIALIZE APP COMPLETE ===');
}

function setupNavigation() {
    console.log('=== SETUP NAVIGATION CALLED ===');
    
    // Icon sidebar navigation - just verify onclick handlers are working
    const iconNavItems = document.querySelectorAll('.icon-nav-item[data-view]');
    console.log('Found', iconNavItems.length, 'icon nav items');
    
    if (iconNavItems.length === 0) {
        console.error('No icon nav items found! Check HTML structure.');
        return;
    }
    
    // Add event listeners as backup (onclick handlers should already work)
    iconNavItems.forEach((item, index) => {
        const viewName = item.dataset.view;
        console.log(`Verifying nav item ${index}: ${viewName}`);
        
        // Check if onclick is set
        const onclickAttr = item.getAttribute('onclick');
        if (onclickAttr) {
            console.log(`✓ Menu item ${viewName} has onclick handler`);
        } else {
            console.warn(`⚠ Menu item ${viewName} missing onclick handler - adding one`);
            item.setAttribute('onclick', `event.preventDefault(); event.stopPropagation(); return window.switchView('${viewName}');`);
        }
        
        // Add event listener as backup (won't interfere with onclick)
        item.addEventListener('click', (e) => {
            // Only handle if onclick didn't work
            if (!e.defaultPrevented) {
                e.preventDefault();
                e.stopPropagation();
                console.log('=== MENU ITEM CLICKED (addEventListener backup) ===', viewName);
                if (viewName && typeof window.switchView === 'function') {
                    window.switchView(viewName);
                }
            }
        }, { once: false, passive: false });
        
        console.log(`✓ Menu item ${viewName} setup complete`);
    });
    
    // Main menu bar navigation
    const mainMenuItems = document.querySelectorAll('.main-menu-btn[data-view]');
    console.log('Found', mainMenuItems.length, 'main menu items');
    
    mainMenuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const viewName = item.dataset.view;
            console.log('Main menu clicked:', viewName);
            if (viewName && typeof window.switchView === 'function') {
                window.switchView(viewName);
            }
        });
    });
    
    console.log('=== NAVIGATION SETUP COMPLETE ===');
}

// Note: switchView is already defined inline in HTML head
// Don't redefine it here - the inline version handles view switching
// After DOM loads, we'll enhance it with rendering functionality in initializeApp

function updatePageActions() {
    const actionsContainer = document.getElementById('submenuActions');
    if (!actionsContainer) return;
    
    actionsContainer.innerHTML = '';
    
    switch(currentView) {
        case 'invoices':
            actionsContainer.innerHTML = `
                <button class="btn-primary" onclick="openUploadInvoiceModal()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    Upload Invoice
                </button>
            `;
            break;
        case 'expenses':
            actionsContainer.innerHTML = `
                <button class="btn-primary" onclick="openExpenseRequestModal()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    New Expense Request
                </button>
            `;
            break;
        case 'reconciliation':
            actionsContainer.innerHTML = `
                <button class="btn-secondary" onclick="processReconciliation()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 11l3 3L22 4"/>
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                    </svg>
                    Process Matching
                </button>
            `;
            break;
        case 'cash':
            actionsContainer.innerHTML = `
                <button class="btn-primary" id="addCashTransactionBtnPageActions" onclick="if(typeof window.openCashTransactionModal === 'function') { window.openCashTransactionModal(); } else { alert('Error: Function not available. Please refresh the page.'); }">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    Add Cash Transaction
                </button>
            `;
            break;
    }
}

// ============================================
// SUMMARY VIEW
// ============================================

function renderSummary() {
    const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0);
    const pendingInvoices = invoices.filter(i => i.status === 'pending').length;
    const overdueInvoices = invoices.filter(i => {
        const dueDate = new Date(i.dueDate);
        return i.status === 'pending' && dueDate < new Date();
    }).length;
    const totalExpenses = expenses.filter(e => e.status === 'approved' || e.status === 'posted').reduce((sum, e) => sum + e.amount, 0);
    const pendingExpenses = expenses.filter(e => e.status === 'pending').length;
    const reconciledItems = invoices.filter(i => i.paired).length + expenses.filter(e => e.paired).length;
    
    // Calculate cash totals
    const cashIn = cashTransactions.filter(c => c.type === 'in').reduce((sum, c) => sum + c.amount, 0);
    const cashOut = cashTransactions.filter(c => c.type === 'out').reduce((sum, c) => sum + c.amount, 0);
    const netCash = cashIn - cashOut;
    
    // Update stat cards
    document.getElementById('totalRevenue').textContent = APP_CONFIG.currencySymbol + totalRevenue.toLocaleString('en-GB', { minimumFractionDigits: 2 });
    document.getElementById('pendingInvoices').textContent = pendingInvoices;
    document.getElementById('totalExpenses').textContent = APP_CONFIG.currencySymbol + totalExpenses.toLocaleString('en-GB', { minimumFractionDigits: 2 });
    document.getElementById('reconciledItems').textContent = reconciledItems;
    
    // Financial Summary
    const financialSummary = document.getElementById('financialSummary');
    if (financialSummary) {
        const netIncome = totalRevenue - totalExpenses + netCash;
        const profitMargin = totalRevenue > 0 ? ((netIncome / totalRevenue) * 100).toFixed(1) : 0;
        
        financialSummary.innerHTML = `
            <div class="financial-item">
                <span class="financial-label">Total Income</span>
                <span class="financial-value positive">${APP_CONFIG.currencySymbol}${totalRevenue.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</span>
            </div>
            <div class="financial-item">
                <span class="financial-label">Total Expenses</span>
                <span class="financial-value negative">${APP_CONFIG.currencySymbol}${totalExpenses.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</span>
            </div>
            ${cashTransactions.length > 0 ? `
            <div class="financial-item">
                <span class="financial-label">Net Cash Flow</span>
                <span class="financial-value ${netCash >= 0 ? 'positive' : 'negative'}">${APP_CONFIG.currencySymbol}${Math.abs(netCash).toLocaleString('en-GB', { minimumFractionDigits: 2 })}</span>
            </div>
            ` : ''}
            <div class="financial-item financial-total">
                <span class="financial-label">Net Income</span>
                <span class="financial-value ${netIncome >= 0 ? 'positive' : 'negative'}">${APP_CONFIG.currencySymbol}${netIncome.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</span>
            </div>
            ${totalRevenue > 0 ? `
            <div class="financial-item">
                <span class="financial-label">Profit Margin</span>
                <span class="financial-value ${profitMargin >= 0 ? 'positive' : 'negative'}">${profitMargin}%</span>
            </div>
            ` : ''}
        `;
    }
    
    // Activity List - Build from actual data
    const activityList = document.getElementById('activityList');
    if (activityList) {
        const activities = [];
        
        // Recent invoices
        const recentInvoices = invoices
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 3)
            .map(inv => ({
                type: 'invoice',
                icon: '📄',
                text: `Invoice ${inv.number} ${inv.status === 'paid' ? 'paid' : 'received'}`,
                amount: inv.amount,
                time: getTimeAgo(new Date(inv.date)),
                action: () => window.switchView('invoices')
            }));
        
        // Recent expenses
        const recentExpenses = expenses
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 2)
            .map(exp => ({
                type: 'expense',
                icon: '💳',
                text: `Expense ${exp.id} ${exp.status === 'approved' ? 'approved' : 'pending approval'}`,
                amount: exp.amount,
                time: getTimeAgo(new Date(exp.date)),
                action: () => window.switchView('expenses')
            }));
        
        // Recent cash transactions
        const recentCash = cashTransactions
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 2)
            .map(cash => ({
                type: 'cash',
                icon: cash.type === 'in' ? '💰' : '💸',
                text: `Cash ${cash.type === 'in' ? 'in' : 'out'}: ${cash.reason || 'Transaction'}`,
                amount: cash.amount,
                time: getTimeAgo(new Date(cash.date)),
                action: () => window.switchView('cash')
            }));
        
        // Combine and sort by date
        const allActivities = [...recentInvoices, ...recentExpenses, ...recentCash]
            .sort((a, b) => {
                const dateA = a.time.includes('hour') ? 0 : a.time.includes('day') ? parseInt(a.time) : 999;
                const dateB = b.time.includes('hour') ? 0 : b.time.includes('day') ? parseInt(b.time) : 999;
                return dateA - dateB;
            })
            .slice(0, 8);
        
        if (allActivities.length === 0) {
            activityList.innerHTML = `
                <div class="activity-empty">
                    <p>No recent activity</p>
                </div>
            `;
        } else {
            activityList.innerHTML = allActivities.map(act => `
                <div class="activity-item" onclick="${act.action ? act.action.toString().replace('function ', '') : ''}">
                    <div class="activity-icon ${act.type}">${act.icon}</div>
                    <div class="activity-content">
                        <div class="activity-text">${act.text}</div>
                        <div class="activity-meta">
                            <span class="activity-amount">${APP_CONFIG.currencySymbol}${act.amount.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</span>
                            <span class="activity-time">${act.time}</span>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    }
}

// Helper function to get time ago
function getTimeAgo(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ============================================
// RECONCILIATION VIEW
// ============================================

function renderReconciliation() {
    console.log('=== RENDER RECONCILIATION START ===');
    
    const reconciliationView = document.getElementById('reconciliationView');
    if (!reconciliationView) {
        console.error('ERROR: reconciliationView element not found!');
        return;
    }
    
    reconciliationView.classList.add('active');
    reconciliationView.style.display = 'block';
    
    try {
        // Generate sample data
        if (typeof generateBankTransactions === 'function') generateBankTransactions();
        if (typeof generateInvoices === 'function') generateInvoices();
        if (typeof generateExpenses === 'function') generateExpenses();
        if (typeof generateSubscriptions === 'function') generateSubscriptions();
        if (typeof generateCredits === 'function') generateCredits();
        if (typeof generateRebates === 'function') generateRebates();
        
        // If still no data after generation, leave static fallback HTML in place (don't overwrite with Loading)
        if (!bankTransactions || bankTransactions.length === 0) {
            setTimeout(renderReconciliation, 300);
            return;
        }
        
        renderReconciliationSummary();
        renderBankTransactions();
        updateReconciliationItems();
        console.log('=== RENDER RECONCILIATION COMPLETE ===');
    } catch (err) {
        console.error('Reconciliation error:', err);
        const container = reconciliationView.querySelector('.reconciliation-container');
        if (container) {
            container.innerHTML = '<div class="reconciliation-empty" style="padding: 40px; text-align: center;"><h2>Bank Reconciliation</h2><p style="color: #c00;">Something went wrong loading this page.</p><p style="color: #666; font-size: 14px;">' + String(err.message || '').substring(0, 200) + '</p><button class="btn-primary" onclick="location.reload()">Reload page</button></div>';
        }
    }
}

// Render reconciliation summary dashboard
function renderReconciliationSummary() {
    const summaryElement = document.getElementById('reconciliationSummary');
    if (!summaryElement || !bankTransactions || bankTransactions.length === 0) return;
    
    const inv = Array.isArray(invoices) ? invoices : [];
    const exp = Array.isArray(expenses) ? expenses : [];
    const sub = Array.isArray(subscriptions) ? subscriptions : [];
    const cred = Array.isArray(credits) ? credits : [];
    const reb = Array.isArray(rebates) ? rebates : [];
    const cash = Array.isArray(cashTransactions) ? cashTransactions : [];
    
    // Calculate statistics
    const totalBankTransactions = bankTransactions.length;
    const pairedBankTransactions = bankTransactions.filter(t => t.paired).length;
    const unpairedBankTransactions = totalBankTransactions - pairedBankTransactions;
    
    const allInvoices = inv.length;
    const allExpenses = exp.length;
    const allSubscriptions = sub.length;
    const allCredits = cred.length;
    const allRebates = reb.length;
    const allCash = cash.length;
    const totalItems = allInvoices + allExpenses + allSubscriptions + allCredits + allRebates + allCash;
    const pairedItems = inv.filter(i => i.paired).length +
                       exp.filter(e => e.paired).length +
                       sub.filter(s => s.paired).length +
                       cred.filter(c => c.paired).length +
                       reb.filter(r => r.paired).length +
                       cash.filter(c => c.pairedWithTransaction).length;
    const unpairedItems = totalItems - pairedItems;
    
    const totalBankAmount = bankTransactions.reduce((sum, t) => sum + Math.abs(t.amount || 0), 0);
    const pairedBankAmount = bankTransactions.filter(t => t.paired).reduce((sum, t) => sum + Math.abs(t.amount || 0), 0);
    const unpairedBankAmount = totalBankAmount - pairedBankAmount;
    
    const totalItemsAmount = inv.reduce((sum, i) => sum + (i.amount || 0), 0) +
                            exp.reduce((sum, e) => sum + (e.amount || 0), 0) +
                            sub.reduce((sum, s) => sum + (s.amount || 0), 0) +
                            cred.reduce((sum, c) => sum + (c.amount || 0), 0) +
                            reb.reduce((sum, r) => sum + (r.amount || 0), 0) +
                            cash.reduce((sum, c) => sum + (c.amount || 0), 0);
    
    const pairedItemsAmount = inv.filter(i => i.paired).reduce((sum, i) => sum + (i.amount || 0), 0) +
                              exp.filter(e => e.paired).reduce((sum, e) => sum + (e.amount || 0), 0) +
                              sub.filter(s => s.paired).reduce((sum, s) => sum + (s.amount || 0), 0) +
                              cred.filter(c => c.paired).reduce((sum, c) => sum + (c.amount || 0), 0) +
                              reb.filter(r => r.paired).reduce((sum, r) => sum + (r.amount || 0), 0) +
                              cash.filter(c => c.pairedWithTransaction).reduce((sum, c) => sum + (c.amount || 0), 0);
    
    const variance = Math.abs(totalBankAmount - totalItemsAmount);
    const reconciliationPercentage = totalBankAmount > 0 ? ((pairedBankAmount / totalBankAmount) * 100).toFixed(1) : 0;
    
    console.log('Rendering summary with data:', {
        totalBankTransactions,
        pairedBankTransactions,
        unpairedBankTransactions,
        totalItems,
        pairedItems,
        unpairedItems
    });
    
    // Ensure we have valid data before rendering
    if (totalBankTransactions === 0) {
        console.error('ERROR: No bank transactions after generation!');
        summaryElement.innerHTML = `
            <div style="padding: 20px;">
                <h2>Bank Reconciliation</h2>
                <p style="color: red;">Error: No bank transactions generated. Please check console for errors.</p>
            </div>
        `;
        return;
    }
    
    console.log('Rendering summary HTML with', totalBankTransactions, 'transactions...');
    summaryElement.innerHTML = `
            <div class="reconciliation-summary-header">
                <div class="page-title-group">
                    <h2>Bank Reconciliation</h2>
                    <p>Match bank transactions with invoices, expenses, and other items for reporting and tax</p>
                </div>
                <div class="reconciliation-header-actions">
                    <button class="btn-secondary" onclick="autoMatchTransactions()">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 18px; height: 18px; margin-right: 8px;">
                            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                        </svg>
                        Auto-Match
                    </button>
                    <button class="btn-secondary" onclick="exportReconciliationReport()">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 18px; height: 18px; margin-right: 8px;">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="7 10 12 15 17 10"/>
                            <line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                        Export Report
                    </button>
                    <label for="bankStatementUpload" class="btn-primary">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 18px; height: 18px; margin-right: 8px;">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="17 8 12 3 7 8"/>
                            <line x1="12" y1="3" x2="12" y2="15"/>
                        </svg>
                        Upload Bank Statement
                    </label>
                    <input type="file" id="bankStatementUpload" style="display: none;" accept=".csv,.ofx,.qif" onchange="handleBankStatementUpload(event)">
                </div>
            </div>
            <div class="reconciliation-stats-grid">
                <div class="reconciliation-stat-card">
                    <div class="stat-card-header">
                        <span class="stat-card-label">Reconciliation Status</span>
                        <span class="stat-card-percentage ${reconciliationPercentage >= 90 ? 'success' : reconciliationPercentage >= 70 ? 'warning' : 'danger'}">${reconciliationPercentage}%</span>
                    </div>
                    <div class="stat-card-value">${pairedBankTransactions} / ${totalBankTransactions} matched</div>
                    <div class="stat-card-progress">
                        <div class="stat-card-progress-bar" style="width: ${reconciliationPercentage}%"></div>
                    </div>
                </div>
                <div class="reconciliation-stat-card">
                    <div class="stat-card-header">
                        <span class="stat-card-label">Unmatched Bank Transactions</span>
                        <span class="stat-card-badge ${unpairedBankTransactions > 0 ? 'warning' : 'success'}">${unpairedBankTransactions}</span>
                    </div>
                    <div class="stat-card-value">${APP_CONFIG.currencySymbol}${unpairedBankAmount.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</div>
                </div>
                <div class="reconciliation-stat-card">
                    <div class="stat-card-header">
                        <span class="stat-card-label">Unmatched Items</span>
                        <span class="stat-card-badge ${unpairedItems > 0 ? 'warning' : 'success'}">${unpairedItems}</span>
                    </div>
                    <div class="stat-card-value">${APP_CONFIG.currencySymbol}${(totalItemsAmount - pairedItemsAmount).toLocaleString('en-GB', { minimumFractionDigits: 2 })}</div>
                </div>
                <div class="reconciliation-stat-card">
                    <div class="stat-card-header">
                        <span class="stat-card-label">Variance</span>
                        <span class="stat-card-badge ${variance < 100 ? 'success' : variance < 1000 ? 'warning' : 'danger'}">${APP_CONFIG.currencySymbol}${variance.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div class="stat-card-value">Difference between bank & items</div>
                </div>
            </div>
            <div class="reconciliation-quick-filters">
                <button class="filter-btn active" onclick="setReconciliationFilter('all')" data-filter="all">All</button>
                <button class="filter-btn" onclick="setReconciliationFilter('unmatched')" data-filter="unmatched">Unmatched Only</button>
                <button class="filter-btn" onclick="setReconciliationFilter('matched')" data-filter="matched">Matched Only</button>
                <button class="filter-btn" onclick="setReconciliationFilter('variance')" data-filter="variance">Variances</button>
                <div class="reconciliation-advanced-filters">
                    <input type="date" id="reconciliationDateFrom" placeholder="From Date" onchange="applyReconciliationFilters()" title="From Date">
                    <input type="date" id="reconciliationDateTo" placeholder="To Date" onchange="applyReconciliationFilters()" title="To Date">
                    <input type="number" id="reconciliationAmountMin" placeholder="Min Amount" step="0.01" onchange="applyReconciliationFilters()" title="Minimum Amount">
                    <input type="number" id="reconciliationAmountMax" placeholder="Max Amount" step="0.01" onchange="applyReconciliationFilters()" title="Maximum Amount">
                    <input type="text" id="reconciliationSearch" placeholder="Search..." onkeyup="applyReconciliationFilters()" title="Search">
                </div>
            </div>
        `;
    
    console.log('Summary HTML rendered successfully');
}

// Find matching items for a transaction
function findMatchingItems(transactionAmount, transactionDate) {
    const amount = Math.abs(transactionAmount);
    const date = new Date(transactionDate);
    const matches = [];
    const invList = Array.isArray(invoices) ? invoices : [];
    const expList = Array.isArray(expenses) ? expenses : [];
    
    invList.filter(i => !i.paired).forEach(inv => {
        const amountDiff = Math.abs((inv.amount || 0) - amount);
        const dateDiff = Math.abs(new Date(inv.date || 0) - date);
        if (amountDiff < 100 && dateDiff < 30 * 24 * 60 * 60 * 1000) {
            matches.push({ type: 'invoice', id: inv.id, amount: inv.amount, date: inv.date, item: inv });
        }
    });
    
    expList.filter(e => !e.paired).forEach(exp => {
        const amountDiff = Math.abs((exp.amount || 0) - amount);
        const dateDiff = Math.abs(new Date(exp.date || 0) - date);
        if (amountDiff < 100 && dateDiff < 30 * 24 * 60 * 60 * 1000) {
            matches.push({ type: 'expense', id: exp.id, amount: exp.amount, date: exp.date, item: exp });
        }
    });
    
    return matches;
}

function renderBankTransactions() {
    console.log('renderBankTransactions called');
    
    // FORCE data generation
    generateBankTransactions();
    
    const transactionsList = document.getElementById('bankTransactionsList');
    if (!transactionsList) {
        console.error('bankTransactionsList element not found');
        return;
    }
    
    console.log('Rendering', bankTransactions.length, 'bank transactions');
    
    // Render directly
    applyReconciliationFilters();
}

// Set reconciliation filter
let currentReconciliationFilter = 'all';

function setReconciliationFilter(filter) {
    currentReconciliationFilter = filter;
    
    // Update filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === filter);
    });
    
    // Apply filters
    applyReconciliationFilters();
}

// Apply advanced reconciliation filters
function applyReconciliationFilters() {
    console.log('applyReconciliationFilters called');
    
    const transactionsList = document.getElementById('bankTransactionsList');
    if (!transactionsList) {
        console.error('bankTransactionsList element not found');
        return;
    }
    
    // FORCE data generation if needed
    if (!bankTransactions || bankTransactions.length === 0) {
        console.log('No bank transactions, generating...');
        generateBankTransactions();
    }
    
    // Double check
    if (!bankTransactions || bankTransactions.length === 0) {
        console.error('Still no bank transactions after generation!');
        transactionsList.innerHTML = `
            <div class="reconciliation-empty">
                <p style="color: red;">Error: Could not generate bank transactions. Please refresh the page.</p>
            </div>
        `;
        return;
    }
    
    console.log('Filtering', bankTransactions.length, 'transactions');
    
    const dateFrom = document.getElementById('reconciliationDateFrom')?.value || '';
    const dateTo = document.getElementById('reconciliationDateTo')?.value || '';
    const amountMin = parseFloat(document.getElementById('reconciliationAmountMin')?.value) || 0;
    const amountMax = parseFloat(document.getElementById('reconciliationAmountMax')?.value) || Infinity;
    const searchTerm = document.getElementById('reconciliationSearch')?.value.toLowerCase() || '';
    
    // Filter bank transactions
    let filteredBankTransactions = bankTransactions.filter(t => {
        // Current filter
        if (currentReconciliationFilter === 'matched' && !t.paired) return false;
        if (currentReconciliationFilter === 'unmatched' && t.paired) return false;
        
        // Date filter
        if (dateFrom) {
            const tDate = new Date(t.date);
            const fromDate = new Date(dateFrom);
            if (tDate < fromDate) return false;
        }
        if (dateTo) {
            const tDate = new Date(t.date);
            const toDate = new Date(dateTo);
            toDate.setHours(23, 59, 59, 999);
            if (tDate > toDate) return false;
        }
        
        // Amount filter
        const amount = Math.abs(t.amount);
        if (amountMin > 0 && amount < amountMin) return false;
        if (amountMax < Infinity && amount > amountMax) return false;
        
        // Search filter
        const desc = (t.description || '').toLowerCase();
        const ref = (t.reference || '').toLowerCase();
        if (searchTerm && !desc.includes(searchTerm) && !ref.includes(searchTerm)) {
            return false;
        }
        
        // Variance filter (check if amount matches any item)
        if (currentReconciliationFilter === 'variance') {
            const matchingItems = findMatchingItems(t.amount, t.date);
            if (matchingItems.length > 0) {
                // Check if there's a variance
                const hasVariance = matchingItems.some(item => Math.abs(item.amount - Math.abs(t.amount)) > 0.01);
                if (!hasVariance) return false;
            } else {
                return false;
            }
        }
        
        return true;
    });
    
    console.log('Filtered transactions:', filteredBankTransactions.length, 'out of', bankTransactions.length);
    
    // Render filtered transactions
    if (filteredBankTransactions.length === 0 && bankTransactions.length > 0) {
        // If filters resulted in no matches but we have transactions, check if filters are too restrictive
        if (dateFrom || dateTo || amountMin > 0 || amountMax < Infinity || searchTerm || currentReconciliationFilter !== 'all') {
            transactionsList.innerHTML = `
                <div class="reconciliation-empty">
                    <p>No transactions match your filters. Try adjusting your filter criteria.</p>
                    <button class="btn-secondary" onclick="setReconciliationFilter('all'); document.getElementById('reconciliationDateFrom').value=''; document.getElementById('reconciliationDateTo').value=''; document.getElementById('reconciliationAmountMin').value=''; document.getElementById('reconciliationAmountMax').value=''; document.getElementById('reconciliationSearch').value=''; applyReconciliationFilters();">Clear All Filters</button>
                </div>
            `;
        } else {
            // No filters but no matches - show all transactions anyway
            filteredBankTransactions = bankTransactions;
        }
    } else if (filteredBankTransactions.length === 0) {
        transactionsList.innerHTML = `
            <div class="reconciliation-empty">
                <p>No bank transactions found. Please upload a bank statement using the button above.</p>
            </div>
        `;
    }
    
    if (filteredBankTransactions.length > 0) {
        console.log('Rendering', filteredBankTransactions.length, 'filtered transactions');
        const currencySym = (typeof APP_CONFIG !== 'undefined' && APP_CONFIG.currencySymbol) ? APP_CONFIG.currencySymbol : '£';
        const html = filteredBankTransactions.map(transaction => {
            const isPaired = !!transaction.paired;
            const amount = Math.abs(transaction.amount || 0);
            const amountFormatted = `${currencySym}${amount.toLocaleString('en-GB', { minimumFractionDigits: 2 })}`;
            
            // Find matching items for variance detection
            const matchingItems = findMatchingItems(transaction.amount, transaction.date);
            const hasVariance = matchingItems.length > 0 && matchingItems.some(item => Math.abs(item.amount - amount) > 0.01);
            
            const desc = (transaction.description || 'No description').replace(/"/g, '&quot;');
            const ref = (transaction.reference || 'N/A').replace(/"/g, '&quot;');
            return `
            <div class="reconciliation-transaction-item ${isPaired ? 'paired' : ''} ${hasVariance ? 'variance' : ''}" 
                 data-transaction-id="${transaction.id}"
                 data-amount="${amount}"
                 onclick="selectTransactionForPairing('${transaction.id}')">
                <div class="transaction-main">
                    <div class="transaction-date">${new Date(transaction.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                    <div class="transaction-description" title="${desc}">${transaction.description || 'No description'}</div>
                    <div class="transaction-reference" title="Ref: ${ref}">Ref: ${transaction.reference || 'N/A'}</div>
                    ${hasVariance ? '<div class="variance-indicator">⚠ Amount variance detected</div>' : ''}
                </div>
                <div class="transaction-details">
                    <div class="transaction-amount ${transaction.type === 'credit' ? 'credit' : 'debit'}">
                        ${transaction.type === 'credit' ? '+' : '-'}${amountFormatted}
                    </div>
                    ${isPaired ? `
                        <div class="transaction-paired-badge">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M9 11l3 3L22 4"/>
                                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                            </svg>
                            Paired
                        </div>
                        <button class="btn-secondary btn-sm" onclick="event.stopPropagation(); unpairTransaction('${transaction.id}')">Unpair</button>
                    ` : `
                        <button class="btn-primary btn-sm" onclick="event.stopPropagation(); showPairingOptions('${transaction.id}')">
                            Pair
                        </button>
                    `}
                </div>
            </div>
        `;
        }).join('');
        
        transactionsList.innerHTML = html;
        console.log('Bank transactions HTML rendered successfully');
    }
    
    // Highlight matching amounts
    if (typeof highlightMatchingAmounts === 'function') {
        highlightMatchingAmounts();
    }
    
    // Also filter items list
    updateReconciliationItems();
}

function renderUnpairedInvoices() {
    const invoicesList = document.getElementById('unpairedInvoicesList');
    const countElement = document.getElementById('unpairedInvoicesCount');
    if (!invoicesList) return;
    
    const unpairedInvoices = invoices.filter(i => !i.paired);
    
    if (countElement) {
        countElement.textContent = `${unpairedInvoices.length} unpaired`;
    }
    
    if (unpairedInvoices.length === 0) {
        invoicesList.innerHTML = `
            <div class="reconciliation-empty">
                <p>All invoices have been paired. Great job!</p>
            </div>
        `;
        return;
    }
    
    invoicesList.innerHTML = unpairedInvoices.map(inv => `
        <div class="reconciliation-invoice-item" data-invoice-id="${inv.id}">
            <div class="invoice-main">
                <div class="invoice-header">
                    <div class="invoice-number">${inv.number}</div>
                    <div class="invoice-date">${new Date(inv.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                </div>
                <div class="invoice-supplier">${inv.supplier}</div>
                <div class="invoice-project">${inv.project || 'N/A'}</div>
            </div>
            <div class="invoice-details">
                <div class="invoice-amount">${APP_CONFIG.currencySymbol}${inv.amount.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</div>
                <div class="invoice-status">${inv.status}</div>
                <div class="invoice-actions">
                    <button class="btn-secondary btn-sm" onclick="editInvoice('${inv.id}')">Edit</button>
                    <button class="btn-primary btn-sm" onclick="pairInvoice('${inv.id}')">Pair</button>
                </div>
            </div>
        </div>
    `).join('');
}

function filterBankTransactions() {
    renderBankTransactions();
}

// Update reconciliation items based on selected checkboxes
function updateReconciliationItems() {
    const itemsList = document.getElementById('reconciliationItemsList');
    const countElement = document.getElementById('reconciliationItemsCount');
    if (!itemsList) return;
    
    try {
        if (typeof generateInvoices === 'function') generateInvoices();
        if (typeof generateExpenses === 'function') generateExpenses();
        if (typeof generateSubscriptions === 'function') generateSubscriptions();
        if (typeof generateCredits === 'function') generateCredits();
        if (typeof generateRebates === 'function') generateRebates();
    } catch (_) {}
    
    const inv = Array.isArray(invoices) ? invoices : [];
    const exp = Array.isArray(expenses) ? expenses : [];
    const sub = Array.isArray(subscriptions) ? subscriptions : [];
    const cred = Array.isArray(credits) ? credits : [];
    const reb = Array.isArray(rebates) ? rebates : [];
    const cash = Array.isArray(cashTransactions) ? cashTransactions : [];
    
    const checkedTypes = Array.from(document.querySelectorAll('input[name="reconciliationType"]:checked'))
        .map(cb => cb.value);
    
    if (checkedTypes.length === 0) {
        itemsList.innerHTML = '<div class="reconciliation-empty"><p>Select at least one type above.</p></div>';
        if (countElement) countElement.textContent = '0 items';
        return;
    }
    
    let allItems = [];
    let totalCount = 0;
    
    if (checkedTypes.includes('invoices')) {
        let unpairedInvoices = inv.filter(i => !i.paired);
        
        // Apply filters
        const dateFrom = document.getElementById('reconciliationDateFrom')?.value || '';
        const dateTo = document.getElementById('reconciliationDateTo')?.value || '';
        const amountMin = parseFloat(document.getElementById('reconciliationAmountMin')?.value) || 0;
        const amountMax = parseFloat(document.getElementById('reconciliationAmountMax')?.value) || Infinity;
        const searchTerm = document.getElementById('reconciliationSearch')?.value.toLowerCase() || '';
        
        if (dateFrom) unpairedInvoices = unpairedInvoices.filter(i => new Date(i.date) >= new Date(dateFrom));
        if (dateTo) {
            const toDate = new Date(dateTo);
            toDate.setHours(23, 59, 59, 999);
            unpairedInvoices = unpairedInvoices.filter(i => new Date(i.date) <= toDate);
        }
        if (amountMin > 0 || amountMax < Infinity) {
            unpairedInvoices = unpairedInvoices.filter(i => i.amount >= amountMin && i.amount <= amountMax);
        }
        if (searchTerm) {
            unpairedInvoices = unpairedInvoices.filter(i => 
                i.number.toLowerCase().includes(searchTerm) || 
                i.supplier.toLowerCase().includes(searchTerm) ||
                (i.project && i.project.toLowerCase().includes(searchTerm))
            );
        }
        
        totalCount += unpairedInvoices.length;
        allItems = allItems.concat(unpairedInvoices.map(inv => ({
            type: 'invoice',
            id: inv.id,
            number: inv.number,
            date: inv.date,
            supplier: inv.supplier,
            project: inv.project,
            amount: inv.amount,
            status: inv.status
        })));
    }
    
    if (checkedTypes.includes('expenses')) {
        // Only posted expenses are ready for bank reconciliation
        let unpairedExpenses = exp.filter(e => !e.paired && e.status === 'posted');
        
        // Apply filters
        const dateFrom = document.getElementById('reconciliationDateFrom')?.value || '';
        const dateTo = document.getElementById('reconciliationDateTo')?.value || '';
        const amountMin = parseFloat(document.getElementById('reconciliationAmountMin')?.value) || 0;
        const amountMax = parseFloat(document.getElementById('reconciliationAmountMax')?.value) || Infinity;
        const searchTerm = document.getElementById('reconciliationSearch')?.value.toLowerCase() || '';
        
        if (dateFrom) unpairedExpenses = unpairedExpenses.filter(e => new Date(e.date) >= new Date(dateFrom));
        if (dateTo) {
            const toDate = new Date(dateTo);
            toDate.setHours(23, 59, 59, 999);
            unpairedExpenses = unpairedExpenses.filter(e => new Date(e.date) <= toDate);
        }
        if (amountMin > 0 || amountMax < Infinity) {
            unpairedExpenses = unpairedExpenses.filter(e => e.amount >= amountMin && e.amount <= amountMax);
        }
        if (searchTerm) {
            unpairedExpenses = unpairedExpenses.filter(e => 
                e.description.toLowerCase().includes(searchTerm) || 
                (e.category && e.category.toLowerCase().includes(searchTerm))
            );
        }
        
        totalCount += unpairedExpenses.length;
        allItems = allItems.concat(unpairedExpenses.map(exp => ({
            type: 'expense',
            id: exp.id,
            number: exp.description || 'N/A',
            date: exp.date,
            supplier: exp.category || 'N/A',
            project: exp.project,
            amount: exp.amount,
            status: exp.status || 'Pending'
        })));
    }
    
    if (checkedTypes.includes('subscriptions')) {
        let unpairedSubscriptions = sub.filter(s => !s.paired);
        
        // Apply filters
        const dateFrom = document.getElementById('reconciliationDateFrom')?.value || '';
        const dateTo = document.getElementById('reconciliationDateTo')?.value || '';
        const amountMin = parseFloat(document.getElementById('reconciliationAmountMin')?.value) || 0;
        const amountMax = parseFloat(document.getElementById('reconciliationAmountMax')?.value) || Infinity;
        const searchTerm = document.getElementById('reconciliationSearch')?.value.toLowerCase() || '';
        
        if (dateFrom) unpairedSubscriptions = unpairedSubscriptions.filter(s => new Date(s.nextPayment || s.startDate) >= new Date(dateFrom));
        if (dateTo) {
            const toDate = new Date(dateTo);
            toDate.setHours(23, 59, 59, 999);
            unpairedSubscriptions = unpairedSubscriptions.filter(s => new Date(s.nextPayment || s.startDate) <= toDate);
        }
        if (amountMin > 0 || amountMax < Infinity) {
            unpairedSubscriptions = unpairedSubscriptions.filter(s => s.amount >= amountMin && s.amount <= amountMax);
        }
        if (searchTerm) {
            unpairedSubscriptions = unpairedSubscriptions.filter(s => 
                s.name.toLowerCase().includes(searchTerm) || 
                (s.provider && s.provider.toLowerCase().includes(searchTerm))
            );
        }
        
        totalCount += unpairedSubscriptions.length;
        allItems = allItems.concat(unpairedSubscriptions.map(sub => ({
            type: 'subscription',
            id: sub.id,
            number: sub.name || 'N/A',
            date: sub.nextPayment || sub.startDate,
            supplier: sub.provider || 'N/A',
            project: sub.project,
            amount: sub.amount,
            status: sub.frequency || 'Monthly'
        })));
    }
    
    if (checkedTypes.includes('credits')) {
        // Only credits marked "processed" are ready to be reconciled to bank transactions
        let unpairedCredits = cred.filter(c => !c.paired && c.status === 'processed');
        
        // Apply filters
        const dateFrom = document.getElementById('reconciliationDateFrom')?.value || '';
        const dateTo = document.getElementById('reconciliationDateTo')?.value || '';
        const amountMin = parseFloat(document.getElementById('reconciliationAmountMin')?.value) || 0;
        const amountMax = parseFloat(document.getElementById('reconciliationAmountMax')?.value) || Infinity;
        const searchTerm = document.getElementById('reconciliationSearch')?.value.toLowerCase() || '';
        
        if (dateFrom) unpairedCredits = unpairedCredits.filter(c => new Date(c.date) >= new Date(dateFrom));
        if (dateTo) {
            const toDate = new Date(dateTo);
            toDate.setHours(23, 59, 59, 999);
            unpairedCredits = unpairedCredits.filter(c => new Date(c.date) <= toDate);
        }
        if (amountMin > 0 || amountMax < Infinity) {
            unpairedCredits = unpairedCredits.filter(c => c.amount >= amountMin && c.amount <= amountMax);
        }
        if (searchTerm) {
            unpairedCredits = unpairedCredits.filter(c => 
                (c.number && c.number.toLowerCase().includes(searchTerm)) || 
                (c.supplier && c.supplier.toLowerCase().includes(searchTerm))
            );
        }
        
        totalCount += unpairedCredits.length;
        allItems = allItems.concat(unpairedCredits.map(cred => ({
            type: 'credit',
            id: cred.id,
            number: cred.number || 'N/A',
            date: cred.date,
            supplier: cred.supplier || 'N/A',
            project: cred.project,
            amount: cred.amount,
            status: cred.status || 'Pending'
        })));
    }
    
    if (checkedTypes.includes('rebates')) {
        let unpairedRebates = reb.filter(r => !r.paired);
        
        // Apply filters
        const dateFrom = document.getElementById('reconciliationDateFrom')?.value || '';
        const dateTo = document.getElementById('reconciliationDateTo')?.value || '';
        const amountMin = parseFloat(document.getElementById('reconciliationAmountMin')?.value) || 0;
        const amountMax = parseFloat(document.getElementById('reconciliationAmountMax')?.value) || Infinity;
        const searchTerm = document.getElementById('reconciliationSearch')?.value.toLowerCase() || '';
        
        if (dateFrom) unpairedRebates = unpairedRebates.filter(r => new Date(r.date) >= new Date(dateFrom));
        if (dateTo) {
            const toDate = new Date(dateTo);
            toDate.setHours(23, 59, 59, 999);
            unpairedRebates = unpairedRebates.filter(r => new Date(r.date) <= toDate);
        }
        if (amountMin > 0 || amountMax < Infinity) {
            unpairedRebates = unpairedRebates.filter(r => r.amount >= amountMin && r.amount <= amountMax);
        }
        if (searchTerm) {
            unpairedRebates = unpairedRebates.filter(r => 
                (r.supplier && r.supplier.toLowerCase().includes(searchTerm)) ||
                (r.agreementName && r.agreementName.toLowerCase().includes(searchTerm))
            );
        }
        
        totalCount += unpairedRebates.length;
        allItems = allItems.concat(unpairedRebates.map(reb => ({
            type: 'rebate',
            id: reb.id,
            number: reb.agreementName || 'N/A',
            date: reb.date,
            supplier: reb.supplier || 'N/A',
            project: reb.project,
            amount: reb.amount,
            status: reb.status || 'Pending'
        })));
    }
    
    if (checkedTypes.includes('cash')) {
        let unpairedCash = cash.filter(c => !c.pairedWithTransaction);
        
        // Apply filters
        const dateFrom = document.getElementById('reconciliationDateFrom')?.value || '';
        const dateTo = document.getElementById('reconciliationDateTo')?.value || '';
        const amountMin = parseFloat(document.getElementById('reconciliationAmountMin')?.value) || 0;
        const amountMax = parseFloat(document.getElementById('reconciliationAmountMax')?.value) || Infinity;
        const searchTerm = document.getElementById('reconciliationSearch')?.value.toLowerCase() || '';
        
        if (dateFrom) unpairedCash = unpairedCash.filter(c => new Date(c.date) >= new Date(dateFrom));
        if (dateTo) {
            const toDate = new Date(dateTo);
            toDate.setHours(23, 59, 59, 999);
            unpairedCash = unpairedCash.filter(c => new Date(c.date) <= toDate);
        }
        if (amountMin > 0 || amountMax < Infinity) {
            unpairedCash = unpairedCash.filter(c => c.amount >= amountMin && c.amount <= amountMax);
        }
        if (searchTerm) {
            unpairedCash = unpairedCash.filter(c => 
                (c.reason && c.reason.toLowerCase().includes(searchTerm)) ||
                (c.project && c.project.toLowerCase().includes(searchTerm))
            );
        }
        
        totalCount += unpairedCash.length;
        allItems = allItems.concat(unpairedCash.map(cash => ({
            type: 'cash',
            id: cash.id,
            number: cash.type === 'in' ? 'Cash In' : 'Cash Out',
            date: cash.date,
            supplier: cash.reason || 'N/A',
            project: cash.project,
            amount: cash.amount,
            status: cash.type,
            cashType: cash.type
        })));
    }
    
    // Sort by date (newest first)
    allItems.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Update count
    if (countElement) {
        countElement.textContent = `${totalCount} unpaired`;
    }
    
    // Render all items
    if (allItems.length === 0) {
        itemsList.innerHTML = `
            <div class="reconciliation-empty">
                <p>All selected items have been paired. Great job!</p>
            </div>
        `;
        return;
    }
    
    console.log('Total items to render:', allItems.length);
    console.log('Items breakdown:', {
        invoices: allItems.filter(i => i.type === 'invoice').length,
        expenses: allItems.filter(i => i.type === 'expense').length,
        subscriptions: allItems.filter(i => i.type === 'subscription').length,
        credits: allItems.filter(i => i.type === 'credit').length,
        rebates: allItems.filter(i => i.type === 'rebate').length,
        cash: allItems.filter(i => i.type === 'cash').length
    });
    
    const itemsHTML = allItems.map(item => {
        const typeLabel = item.type.charAt(0).toUpperCase() + item.type.slice(1);
        const amount = item.amount;
        const amountFormatted = `${APP_CONFIG.currencySymbol}${amount.toLocaleString('en-GB', { minimumFractionDigits: 2 })}`;
        
        const esc = (s) => (s != null ? String(s).replace(/"/g, '&quot;') : '');
        const supplierTitle = esc(item.supplier);
        const projectTitle = esc(item.project || 'N/A');
        const numberTitle = esc(item.number);

        // Special handling for cash
        if (item.type === 'cash') {
            return `
                <div class="reconciliation-item" 
                     data-${item.type}-id="${item.id}"
                     data-amount="${amount}"
                     onclick="selectItemForPairing('${item.type}', '${item.id}')">
                    <div class="item-main">
                        <div class="item-header">
                            <div class="item-number" title="${numberTitle}">
                                <span class="item-type-badge ${item.type}">${item.number}</span>
                            </div>
                            <div class="item-date">${new Date(item.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                        </div>
                        <div class="item-supplier" title="${supplierTitle}">${item.supplier}</div>
                        <div class="item-project" title="${projectTitle}">${item.project || 'N/A'}</div>
                    </div>
                    <div class="item-details">
                        <div class="item-amount ${item.cashType === 'in' ? 'positive' : 'negative'}">
                            ${item.cashType === 'in' ? '+' : '-'}${amountFormatted}
                        </div>
                        <div class="item-actions">
                            <button class="btn-primary btn-sm" onclick="event.stopPropagation(); showPairingOptionsForItem('cash', '${item.id}')">Pair</button>
                        </div>
                    </div>
                </div>
            `;
        }
        
        return `
            <div class="reconciliation-item" 
                 data-${item.type}-id="${item.id}"
                 data-amount="${amount}"
                 onclick="selectItemForPairing('${item.type}', '${item.id}')">
                <div class="item-main">
                    <div class="item-header">
                        <div class="item-number" title="${numberTitle}">
                            ${item.number}
                            <span class="item-type-badge ${item.type}">${typeLabel}</span>
                        </div>
                        <div class="item-date">${new Date(item.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                    </div>
                    <div class="item-supplier" title="${supplierTitle}">${item.supplier}</div>
                    <div class="item-project" title="${projectTitle}">${item.project || 'N/A'}</div>
                </div>
                <div class="item-details">
                    <div class="item-amount">${amountFormatted}</div>
                        <div class="item-actions">
                            <button class="btn-primary btn-sm" onclick="event.stopPropagation(); showPairingOptionsForItem('${item.type}', '${item.id}')">Pair</button>
                        </div>
                </div>
            </div>
        `;
    }).join('');
    
    itemsList.innerHTML = itemsHTML;
    console.log('Rendered', allItems.length, 'items');
    
    // Highlight matching amounts
    if (typeof highlightMatchingAmounts === 'function') {
        highlightMatchingAmounts();
    }
}


function renderUnpairedCashTransactions() {
    const cashList = document.getElementById('unpairedCashList');
    const countElement = document.getElementById('unpairedCashCount');
    if (!cashList) return;
    
    const unpairedCash = cashTransactions.filter(c => !c.pairedWithTransaction);
    
    if (countElement) {
        countElement.textContent = `${unpairedCash.length} unpaired`;
    }
    
    if (unpairedCash.length === 0) {
        cashList.innerHTML = `
            <div class="reconciliation-empty">
                <p>All cash transactions have been paired.</p>
            </div>
        `;
        return;
    }
    
    cashList.innerHTML = unpairedCash.map(cash => `
        <div class="reconciliation-cash-item" data-cash-id="${cash.id}">
            <div class="cash-main">
                <div class="cash-header">
                    <div class="cash-type-badge ${cash.type}">${cash.type === 'in' ? 'Cash In' : 'Cash Out'}</div>
                    <div class="cash-date">${new Date(cash.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                </div>
                <div class="cash-reason">${cash.reason || 'N/A'}</div>
                <div class="cash-project">${cash.project || 'N/A'}</div>
            </div>
            <div class="cash-details">
                <div class="cash-amount ${cash.type === 'in' ? 'positive' : 'negative'}">
                    ${cash.type === 'in' ? '+' : '-'}${APP_CONFIG.currencySymbol}${cash.amount.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                </div>
                <div class="cash-actions">
                    <button class="btn-primary btn-sm" onclick="pairCashWithTransaction('${cash.id}')">Pair</button>
                </div>
            </div>
        </div>
    `).join('');
}

function pairTransactionWithInvoice(transactionId) {
    // This would open a modal to select an invoice or cash transaction to pair with
    showToast('info', 'Pair Transaction', 'Select an invoice or cash transaction from the right columns to pair with this transaction');
}

function pairCashWithTransaction(cashId) {
    const cash = cashTransactions.find(c => c.id === cashId);
    if (!cash) return;
    
    // Find matching bank transaction by amount
    const matchingTransaction = bankTransactions.find(t => 
        !t.paired && 
        Math.abs(Math.abs(t.amount) - cash.amount) < 0.01
    );
    
    if (matchingTransaction) {
        cash.pairedWithTransaction = matchingTransaction.id;
        matchingTransaction.paired = true;
        matchingTransaction.pairedWithCash = cashId;
        
        showToast('success', 'Paired', `Cash transaction paired with bank transaction ${matchingTransaction.reference}`);
        updateReconciliationItems();
        renderBankTransactions();
        renderSummary();
    } else {
        showToast('info', 'Manual Pairing', 'No automatic match found. Please select a transaction from the left column.');
    }
    
    updateReconciliationItems();
    renderBankTransactions();
}

function pairBankTransactionWithCash(transactionId, cashId) {
    const transaction = bankTransactions.find(t => t.id === transactionId);
    const cash = cashTransactions.find(c => c.id === cashId);
    
    if (!transaction || !cash) return;
    
    transaction.paired = true;
    transaction.pairedWithCash = cashId;
    cash.pairedWithTransaction = transactionId;
    
    showToast('success', 'Paired', 'Bank transaction paired with cash transaction');
    updateReconciliationItems();
    renderBankTransactions();
    renderSummary();
}

function pairInvoice(invoiceId) {
    const invoice = invoices.find(i => i.id === invoiceId);
    if (!invoice) return;
    
    // Find matching transaction by amount
    const matchingTransaction = bankTransactions.find(t => 
        !t.paired && 
        Math.abs(Math.abs(t.amount) - invoice.amount) < 0.01 &&
        t.type === 'debit'
    );
    
    if (matchingTransaction) {
        invoice.paired = true;
        invoice.pairedWithTransaction = matchingTransaction.id;
        matchingTransaction.paired = true;
        matchingTransaction.pairedWithInvoice = invoiceId;
        
        showToast('success', 'Paired', `Invoice ${invoice.number} paired with transaction ${matchingTransaction.reference}`);
    } else {
        showToast('info', 'Manual Pairing', 'No automatic match found. Please select a transaction from the left column.');
    }
    
    updateReconciliationItems();
    renderBankTransactions();
    renderSummary();
}

function handleBankStatementUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    showToast('info', 'Processing', 'Bank statement uploaded. Processing transactions...');
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const text = e.target.result;
            const lines = text.split('\n').filter(line => line.trim());
            
            // Skip header if present
            const startIndex = lines[0].toLowerCase().includes('date') ? 1 : 0;
            let newTransactions = [];
            let balance = bankTransactions.length > 0 ? bankTransactions[bankTransactions.length - 1].balance : 100000;
            
            for (let i = startIndex; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;
                
                // Parse CSV line (simple CSV parser)
                const parts = line.split(',').map(p => p.trim().replace(/^"|"$/g, ''));
                
                if (parts.length >= 4) {
                    const date = parts[0];
                    const description = parts[1] || 'Transaction';
                    const amount = parseFloat(parts[2]) || 0;
                    const reference = parts[3] || `REF-${Date.now()}-${i}`;
                    
                    if (!isNaN(amount) && amount !== 0) {
                        balance += amount;
                        const transaction = {
                            id: `TXN-UPLOAD-${Date.now()}-${i}`,
                            date: date,
                            description: description,
                            amount: amount,
                            reference: reference,
                            type: amount < 0 ? 'debit' : 'credit',
                            paired: false,
                            balance: balance
                        };
                        newTransactions.push(transaction);
                    }
                }
            }
            
            // Add new transactions to existing ones
            bankTransactions = [...bankTransactions, ...newTransactions];
            
            // Save to localStorage
            localStorage.setItem('bankTransactions', JSON.stringify(bankTransactions));
            
            showToast('success', 'Complete', `Bank statement processed. ${newTransactions.length} new transaction(s) loaded.`);
            renderReconciliation();
        } catch (error) {
            console.error('Error parsing bank statement:', error);
            showToast('error', 'Error', 'Failed to parse bank statement. Please check the file format.');
        }
    };
    
    reader.onerror = function() {
        showToast('error', 'Error', 'Failed to read bank statement file.');
    };
    
    reader.readAsText(file);
    
    // Reset file input
    event.target.value = '';
}

function processReconciliation() {
    showToast('info', 'Processing', 'Matching invoices with bank statement...');
    
    setTimeout(() => {
        // Get stats before matching
        const totalTransactions = bankTransactions.length;
        const totalInvoices = invoices.length;
        const unpairedTransactions = bankTransactions.filter(t => !t.paired && t.type === 'debit');
        const unpairedInvoices = invoices.filter(i => !i.paired);
        
        // Attempt automatic matching by amount
        let matchedCount = 0;
        const unmatchedTransactions = [...unpairedTransactions];
        const unmatchedInvoices = [...unpairedInvoices];
        
        unmatchedTransactions.forEach(transaction => {
            const matchingInvoice = unmatchedInvoices.find(inv => {
                const amountMatch = Math.abs(Math.abs(transaction.amount) - inv.amount) < 0.01;
                return amountMatch && !inv.paired;
            });
            
            if (matchingInvoice) {
                transaction.paired = true;
                transaction.pairedWithInvoice = matchingInvoice.id;
                matchingInvoice.paired = true;
                matchingInvoice.pairedWithTransaction = transaction.id;
                matchedCount++;
            }
        });
        
        // Calculate final stats
        const pairedTransactions = bankTransactions.filter(t => t.paired).length;
        const pairedInvoices = invoices.filter(i => i.paired).length;
        const remainingUnpairedTransactions = bankTransactions.filter(t => !t.paired && t.type === 'debit').length;
        const remainingUnpairedInvoices = invoices.filter(i => !i.paired).length;
        
        // Show results modal
        showReconciliationResults({
            totalTransactions,
            totalInvoices,
            pairedTransactions,
            pairedInvoices,
            matchedCount,
            remainingUnpairedTransactions,
            remainingUnpairedInvoices
        });
        
        renderReconciliation();
        renderSummary();
    }, 2000);
}

function showReconciliationResults(stats) {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'reconciliationResultsModal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeReconciliationResultsModal()"></div>
        <div class="modal-content modal-large">
            <div class="modal-header">
                <h2>Reconciliation Results</h2>
                <button class="modal-close" onclick="closeReconciliationResultsModal()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                </button>
            </div>
            <div class="modal-body">
                <div class="reconciliation-stats-grid">
                    <div class="reconciliation-stat-card">
                        <div class="stat-card-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="2" y="4" width="20" height="16" rx="2"/>
                                <path d="M7 8h10M7 12h10M7 16h5"/>
                            </svg>
                        </div>
                        <div class="stat-card-content">
                            <div class="stat-card-value">${stats.totalTransactions}</div>
                            <div class="stat-card-label">Total Bank Transactions</div>
                        </div>
                    </div>
                    <div class="reconciliation-stat-card">
                        <div class="stat-card-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                <polyline points="14 2 14 8 20 8"/>
                            </svg>
                        </div>
                        <div class="stat-card-content">
                            <div class="stat-card-value">${stats.totalInvoices}</div>
                            <div class="stat-card-label">Total Invoices</div>
                        </div>
                    </div>
                    <div class="reconciliation-stat-card success">
                        <div class="stat-card-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M9 11l3 3L22 4"/>
                                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                            </svg>
                        </div>
                        <div class="stat-card-content">
                            <div class="stat-card-value">${stats.pairedTransactions}</div>
                            <div class="stat-card-label">Paired Transactions</div>
                        </div>
                    </div>
                    <div class="reconciliation-stat-card success">
                        <div class="stat-card-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M9 11l3 3L22 4"/>
                                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                            </svg>
                        </div>
                        <div class="stat-card-content">
                            <div class="stat-card-value">${stats.pairedInvoices}</div>
                            <div class="stat-card-label">Paired Invoices</div>
                        </div>
                    </div>
                    <div class="reconciliation-stat-card highlight">
                        <div class="stat-card-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                            </svg>
                        </div>
                        <div class="stat-card-content">
                            <div class="stat-card-value">${stats.matchedCount}</div>
                            <div class="stat-card-label">Newly Matched</div>
                        </div>
                    </div>
                    <div class="reconciliation-stat-card warning">
                        <div class="stat-card-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"/>
                                <line x1="12" y1="8" x2="12" y2="12"/>
                                <line x1="12" y1="16" x2="12.01" y2="16"/>
                            </svg>
                        </div>
                        <div class="stat-card-content">
                            <div class="stat-card-value">${stats.remainingUnpairedTransactions}</div>
                            <div class="stat-card-label">Unpaired Transactions</div>
                        </div>
                    </div>
                    <div class="reconciliation-stat-card warning">
                        <div class="stat-card-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"/>
                                <line x1="12" y1="8" x2="12" y2="12"/>
                                <line x1="12" y1="16" x2="12.01" y2="16"/>
                            </svg>
                        </div>
                        <div class="stat-card-content">
                            <div class="stat-card-value">${stats.remainingUnpairedInvoices}</div>
                            <div class="stat-card-label">Unpaired Invoices</div>
                        </div>
                    </div>
                </div>
                <div class="reconciliation-summary">
                    <p><strong>Summary:</strong> ${stats.matchedCount > 0 ? `Successfully matched ${stats.matchedCount} invoice${stats.matchedCount !== 1 ? 's' : ''} with bank transactions.` : 'No new matches found. Please review unpaired items manually.'}</p>
                    ${stats.remainingUnpairedTransactions > 0 || stats.remainingUnpairedInvoices > 0 ? `
                        <p class="reconciliation-note">There are still ${stats.remainingUnpairedTransactions} unpaired transaction${stats.remainingUnpairedTransactions !== 1 ? 's' : ''} and ${stats.remainingUnpairedInvoices} unpaired invoice${stats.remainingUnpairedInvoices !== 1 ? 's' : ''} that require manual review.</p>
                    ` : `
                        <p class="reconciliation-note success">All transactions and invoices have been successfully paired!</p>
                    `}
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-primary" onclick="closeReconciliationResultsModal()">Close</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function closeReconciliationResultsModal() {
    const modal = document.getElementById('reconciliationResultsModal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    }
}

function pairInvoice(invoiceId, transactionId = null) {
    const invoice = invoices.find(i => i.id === invoiceId);
    if (!invoice) return;
    
    // Find matching transaction if not provided
    if (!transactionId) {
        const matchingTransaction = bankTransactions.find(t => 
            !t.paired && 
            Math.abs(Math.abs(t.amount) - invoice.amount) < 0.01
        );
        if (matchingTransaction) {
            transactionId = matchingTransaction.id;
        }
    }
    
    if (transactionId) {
        const transaction = bankTransactions.find(t => t.id === transactionId);
        if (transaction && !transaction.paired) {
            invoice.paired = true;
            invoice.pairedWithTransaction = transactionId;
            transaction.paired = true;
            transaction.pairedWithInvoice = invoiceId;
            showToast('success', 'Paired', `Invoice ${invoice.number} paired with bank transaction ${transaction.reference || transactionId}`);
        } else {
            invoice.paired = true;
            showToast('success', 'Paired', `Invoice ${invoice.number} has been paired.`);
        }
    } else {
        invoice.paired = true;
        showToast('success', 'Paired', `Invoice ${invoice.number} has been paired.`);
    }
    
    updateReconciliationItems();
    renderBankTransactions();
    renderSummary();
}

function pairCredit(creditId, transactionId = null) {
    const credit = credits.find(c => c.id === creditId);
    if (!credit) return;

    if (transactionId) {
        const transaction = bankTransactions.find(t => t.id === transactionId);
        if (transaction && !transaction.paired) {
            credit.paired = true;
            credit.status = 'applied';
            credit.pairedWithTransaction = transactionId;
            transaction.paired = true;
            transaction.pairedWithCredit = creditId;
            if (typeof showToast === 'function') showToast('success', 'Paired', `Credit ${credit.number} paired with bank transaction ${transaction.reference || transactionId}`);
        } else {
            credit.paired = true;
            credit.status = 'applied';
            if (typeof showToast === 'function') showToast('success', 'Paired', `Credit ${credit.number} has been paired.`);
        }
    } else {
        credit.paired = true;
        credit.status = 'applied';
        if (typeof showToast === 'function') showToast('success', 'Paired', `Credit ${credit.number} has been paired.`);
    }
    if (typeof updateReconciliationItems === 'function') updateReconciliationItems();
    if (typeof renderCredits === 'function') renderCredits();
    if (typeof renderBankTransactions === 'function') renderBankTransactions();
    if (typeof renderSummary === 'function') renderSummary();
}

function editInvoice(invoiceId) {
    const invoice = invoices.find(i => i.id === invoiceId);
    if (invoice) {
        openViewInvoiceModal(invoice);
    }
}

// Placeholder edit functions for transaction types
function editExpense(expenseId) {
    showToast('info', 'Edit Expense', 'Edit functionality coming soon');
}
function editExpense(expenseId) {
    showToast('info', 'Edit Expense', 'Edit functionality coming soon');
}

function editCredit(creditId) {
    showToast('info', 'Edit Credit', 'Edit functionality coming soon');
}

function editRebate(rebateId) {
    showToast('info', 'Edit Rebate', 'Edit functionality coming soon');
}

// ============================================
// INVOICES VIEW
// ============================================

function renderInvoices() {
    // Ensure sample data for prototyping: load invoices and suppliers if empty
    if (!invoices || invoices.length === 0) {
        if (typeof generateInvoices === 'function') generateInvoices();
    }
    if ((!suppliers || suppliers.length === 0) && typeof generateSuppliers === 'function') {
        generateSuppliers();
    }
    const invList = Array.isArray(invoices) ? invoices : [];
    const supList = Array.isArray(suppliers) ? suppliers : [];
    const totalAmount = invList.reduce((s, i) => s + (Number(i.amount) || 0), 0);
    const linkedCount = invList.filter(i => i.linkedPO).length;
    const pendingCount = invList.filter(i => i.status === 'pending').length;
    const paidCount = invList.filter(i => i.status === 'paid').length;
    const overdueCount = invList.filter(i => i.status === 'overdue' || (i.status === 'pending' && new Date(i.dueDate) < new Date())).length;

    const statsBar = document.getElementById('invoicesStatsBar');
    if (statsBar) {
        statsBar.innerHTML = `
            <div class="invoice-stat-card">
                <span class="invoice-stat-value">${invList.length}</span>
                <span class="invoice-stat-label">Invoices</span>
            </div>
            <div class="invoice-stat-card highlight">
                <span class="invoice-stat-value">${linkedCount}</span>
                <span class="invoice-stat-label">Linked to PO</span>
            </div>
            <div class="invoice-stat-card">
                <span class="invoice-stat-value">${pendingCount}</span>
                <span class="invoice-stat-label">Pending</span>
            </div>
            <div class="invoice-stat-card">
                <span class="invoice-stat-value">${overdueCount}</span>
                <span class="invoice-stat-label">Overdue</span>
            </div>
            <div class="invoice-stat-card total">
                <span class="invoice-stat-value">${(typeof APP_CONFIG !== 'undefined' && APP_CONFIG.currencySymbol) || '£'}${totalAmount.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                <span class="invoice-stat-label">Total</span>
            </div>
        `;
    }

    const filtersContainer = document.getElementById('invoicesFilters');
    const gridContainer = document.getElementById('invoicesGrid');

    if (filtersContainer) {
        filtersContainer.innerHTML = `
            <div class="invoices-filter-row">
                <label class="filter-label">Filters</label>
                <select id="invoiceStatusFilter" onchange="filterInvoices()">
                    <option value="all">All status</option>
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                </select>
                <select id="invoiceLinkedFilter" onchange="filterInvoices()">
                    <option value="all">Linked to order</option>
                    <option value="linked">Linked to PO</option>
                    <option value="notlinked">Not linked</option>
                </select>
                <select id="invoiceSourceFilter" onchange="filterInvoices()">
                    <option value="all">All source</option>
                    <option value="email">From email</option>
                    <option value="upload">Upload</option>
                    <option value="manual">Manual</option>
                </select>
                <select id="invoiceSupplierFilter" onchange="filterInvoices()">
                    <option value="all">All suppliers</option>
                    ${supList.map(s => `<option value="${(s && s.id) || ''}">${(s && s.name) || ''}</option>`).join('')}
                </select>
                <select id="invoiceProjectFilter" onchange="filterInvoices()">
                    <option value="all">All projects</option>
                    <option value="Riverside Tower">Riverside Tower</option>
                    <option value="Metro Shopping Centre">Metro Shopping Centre</option>
                    <option value="Harbour View Apartments">Harbour View Apartments</option>
                    <option value="City Plaza">City Plaza</option>
                    <option value="Industrial Complex">Industrial Complex</option>
                </select>
                <input type="date" id="invoiceDateFrom" onchange="filterInvoices()" title="From date" class="filter-date">
                <input type="date" id="invoiceDateTo" onchange="filterInvoices()" title="To date" class="filter-date">
                <input type="text" id="invoiceSearch" placeholder="Search invoice, supplier, PO…" onkeyup="filterInvoices()" class="filter-search">
            </div>
            <div class="bulk-actions-bar" id="invoiceBulkActions" style="display: none;">
                <span class="bulk-selection-count" id="invoiceSelectionCount">0 selected</span>
                <button class="btn-primary btn-sm" onclick="bulkMarkInvoicesPaid()">Mark as Paid</button>
                <button class="btn-secondary btn-sm" onclick="bulkExportInvoices()">Export</button>
                <button class="btn-danger btn-sm" onclick="bulkDeleteInvoices()">Delete</button>
                <button class="btn-secondary btn-sm" onclick="clearInvoiceSelection()">Clear</button>
            </div>
        `;
    }

    if (gridContainer) {
        gridContainer.className = 'invoices-table-container';
        gridContainer.innerHTML = invList.length === 0 ? `
            <div class="invoices-empty-state">
                <p>No invoices yet. AI will pull invoices from email into this list.</p>
                <p class="invoices-empty-hint">Use demo data or add invoices via upload.</p>
            </div>
        ` : `
            <table class="invoices-table">
                <thead>
                    <tr>
                        <th class="col-check"><input type="checkbox" id="selectAllInvoices" onchange="toggleAllInvoices(this.checked)" title="Select all"></th>
                        <th>Invoice</th>
                        <th>Date</th>
                        <th>Due</th>
                        <th>Supplier</th>
                        <th>Project</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Paired</th>
                        <th>Linked PO</th>
                        <th>Source</th>
                        <th class="col-actions">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${invList.map(inv => `
                        <tr class="invoice-row ${inv.status === 'overdue' ? 'overdue' : ''} ${inv.linkedPO ? 'linked-to-po' : ''}" data-invoice-id="${inv.id}">
                            <td onclick="event.stopPropagation()">
                                <input type="checkbox" class="invoice-checkbox" value="${inv.id}" onchange="updateInvoiceSelection()">
                            </td>
                            <td class="invoice-number-cell" onclick="openViewInvoicePDF('${inv.id}')">
                                <span class="invoice-number">${inv.number}</span>
                            </td>
                            <td onclick="openViewInvoicePDF('${inv.id}')">${new Date(inv.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                            <td onclick="openViewInvoicePDF('${inv.id}')">${new Date(inv.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                            <td class="invoice-supplier-cell" onclick="openViewInvoicePDF('${inv.id}')">${inv.supplier}</td>
                            <td onclick="openViewInvoicePDF('${inv.id}')">${inv.project || 'N/A'}</td>
                            <td class="invoice-amount-cell" onclick="openViewInvoicePDF('${inv.id}')">${(typeof APP_CONFIG !== 'undefined' && APP_CONFIG.currencySymbol) || '£'}${(Number(inv.amount) || 0).toLocaleString('en-GB', { minimumFractionDigits: 2 })}</td>
                            <td onclick="openViewInvoicePDF('${inv.id}')">
                                <span class="status-badge ${inv.status}">${inv.status}</span>
                            </td>
                            <td onclick="openViewInvoicePDF('${inv.id}')">
                                ${inv.paired ? `
                                    <span class="paired-badge">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M9 11l3 3L22 4"/>
                                            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                                        </svg>
                                        Paired
                                    </span>
                                ` : '<span class="unpaired-badge">Unpaired</span>'}
                            </td>
                            <td onclick="openViewInvoicePDF('${inv.id}')">
                                ${inv.linkedPO ? `<span class="linked-po-badge" title="Linked to order in procurement app">${inv.linkedPO}</span>` : '<span class="text-muted">—</span>'}
                            </td>
                            <td onclick="openViewInvoicePDF('${inv.id}')">
                                <span class="source-badge source-${inv.source || 'manual'}">${(inv.source || 'manual').charAt(0).toUpperCase() + (inv.source || 'manual').slice(1)}</span>
                            </td>
                            <td class="invoice-actions-cell" onclick="event.stopPropagation()">
                                ${inv.status === 'pending' ? `
                                    <button class="btn-primary btn-sm" onclick="markInvoicePaid('${inv.id}')">Mark Paid</button>
                                ` : ''}
                                <button class="btn-secondary btn-sm" onclick="openViewInvoicePDF('${inv.id}')">View</button>
                                <button class="btn-secondary btn-sm" onclick="downloadInvoicePDF('${inv.id}')">Download</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }
}

// Invoice selection and bulk actions
let selectedInvoices = new Set();

function toggleAllInvoices(checked) {
    selectedInvoices.clear();
    if (checked) {
        document.querySelectorAll('.invoice-checkbox').forEach(cb => {
            cb.checked = true;
            selectedInvoices.add(cb.value);
        });
    } else {
        document.querySelectorAll('.invoice-checkbox').forEach(cb => {
            cb.checked = false;
        });
    }
    updateInvoiceSelection();
}

function updateInvoiceSelection() {
    selectedInvoices.clear();
    document.querySelectorAll('.invoice-checkbox:checked').forEach(cb => {
        selectedInvoices.add(cb.value);
    });
    
    const bulkActions = document.getElementById('invoiceBulkActions');
    const countSpan = document.getElementById('invoiceSelectionCount');
    
    if (bulkActions && countSpan) {
        if (selectedInvoices.size > 0) {
            bulkActions.style.display = 'flex';
            countSpan.textContent = `${selectedInvoices.size} selected`;
        } else {
            bulkActions.style.display = 'none';
        }
    }
    
    // Update select all checkbox
    const selectAll = document.getElementById('selectAllInvoices');
    if (selectAll) {
        const totalCheckboxes = document.querySelectorAll('.invoice-checkbox').length;
        selectAll.checked = selectedInvoices.size === totalCheckboxes && totalCheckboxes > 0;
        selectAll.indeterminate = selectedInvoices.size > 0 && selectedInvoices.size < totalCheckboxes;
    }
}

function clearInvoiceSelection() {
    selectedInvoices.clear();
    document.querySelectorAll('.invoice-checkbox').forEach(cb => cb.checked = false);
    const selectAll = document.getElementById('selectAllInvoices');
    if (selectAll) selectAll.checked = false;
    updateInvoiceSelection();
}

function bulkMarkInvoicesPaid() {
    if (selectedInvoices.size === 0) {
        showToast('warning', 'No Selection', 'Please select invoices to mark as paid');
        return;
    }
    
    if (confirm(`Mark ${selectedInvoices.size} invoice(s) as paid?`)) {
        selectedInvoices.forEach(id => {
            const invoice = invoices.find(inv => inv.id === id);
            if (invoice && invoice.status === 'pending') {
                invoice.status = 'paid';
            }
        });
        clearInvoiceSelection();
        filterInvoices();
        renderSummary();
        showToast('success', 'Updated', `${selectedInvoices.size} invoice(s) marked as paid`);
    }
}

function bulkExportInvoices() {
    if (selectedInvoices.size === 0) {
        showToast('warning', 'No Selection', 'Please select invoices to export');
        return;
    }
    
    const selected = Array.from(selectedInvoices).map(id => invoices.find(inv => inv.id === id)).filter(Boolean);
    let csvContent = 'Invoice Number,Supplier,Date,Due Date,Amount,Status,Project,Paired,Linked PO,Source\n';
    selected.forEach(inv => {
        csvContent += `${inv.number},${inv.supplier},${inv.date},${inv.dueDate},${inv.amount},${inv.status},${inv.project || 'N/A'},${inv.paired ? 'Yes' : 'No'},${inv.linkedPO || ''},${inv.source || 'manual'}\n`;
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoices_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    showToast('success', 'Exported', `${selectedInvoices.size} invoice(s) exported`);
}

function bulkDeleteInvoices() {
    if (selectedInvoices.size === 0) {
        showToast('warning', 'No Selection', 'Please select invoices to delete');
        return;
    }
    
    if (confirm(`Delete ${selectedInvoices.size} invoice(s)? This cannot be undone.`)) {
        invoices = invoices.filter(inv => !selectedInvoices.has(inv.id));
        clearInvoiceSelection();
        filterInvoices();
        renderSummary();
        showToast('success', 'Deleted', `${selectedInvoices.size} invoice(s) deleted`);
    }
}

function markInvoicePaid(invoiceId) {
    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (invoice) {
        invoice.status = 'paid';
        filterInvoices();
        renderSummary();
        showToast('success', 'Updated', `Invoice ${invoice.number} marked as paid`);
    }
}

function filterInvoices() {
    const statusFilter = document.getElementById('invoiceStatusFilter')?.value || 'all';
    const linkedFilter = document.getElementById('invoiceLinkedFilter')?.value || 'all';
    const sourceFilter = document.getElementById('invoiceSourceFilter')?.value || 'all';
    const supplierFilter = document.getElementById('invoiceSupplierFilter')?.value || 'all';
    const projectFilter = document.getElementById('invoiceProjectFilter')?.value || 'all';
    const dateFrom = document.getElementById('invoiceDateFrom')?.value || '';
    const dateTo = document.getElementById('invoiceDateTo')?.value || '';
    const searchTerm = document.getElementById('invoiceSearch')?.value.toLowerCase() || '';
    
    let filtered = invoices.filter(inv => {
        // Status filter
        if (statusFilter !== 'all') {
            if (statusFilter === 'overdue') {
                const dueDate = new Date(inv.dueDate);
                const isOverdue = inv.status === 'overdue' || (inv.status === 'pending' && dueDate < new Date());
                if (!isOverdue) return false;
            } else if (inv.status !== statusFilter) {
                return false;
            }
        }
        
        // Linked to PO filter
        if (linkedFilter === 'linked' && !inv.linkedPO) return false;
        if (linkedFilter === 'notlinked' && inv.linkedPO) return false;
        
        // Source filter
        if (sourceFilter !== 'all' && (inv.source || 'manual') !== sourceFilter) return false;
        
        // Supplier filter
        if (supplierFilter !== 'all' && inv.supplier !== suppliers.find(s => s.id === supplierFilter)?.name) return false;
        
        // Project filter
        if (projectFilter !== 'all' && inv.project !== projectFilter) return false;
        
        // Date range filter
        if (dateFrom) {
            const invDate = new Date(inv.date);
            const fromDate = new Date(dateFrom);
            if (invDate < fromDate) return false;
        }
        if (dateTo) {
            const invDate = new Date(inv.date);
            const toDate = new Date(dateTo);
            toDate.setHours(23, 59, 59, 999);
            if (invDate > toDate) return false;
        }
        
        // Search filter (invoice number, supplier, project, PO number)
        if (searchTerm) {
            const matchNumber = inv.number.toLowerCase().includes(searchTerm);
            const matchSupplier = inv.supplier.toLowerCase().includes(searchTerm);
            const matchProject = (inv.project && inv.project.toLowerCase().includes(searchTerm));
            const matchPO = (inv.linkedPO && inv.linkedPO.toLowerCase().includes(searchTerm));
            if (!matchNumber && !matchSupplier && !matchProject && !matchPO) return false;
        }
        
        return true;
    });
    
    const gridContainer = document.getElementById('invoicesGrid');
    if (gridContainer) {
        gridContainer.className = 'invoices-table-container';
        gridContainer.innerHTML = `
            <table class="invoices-table">
                <thead>
                    <tr>
                        <th style="width: 40px;">
                            <input type="checkbox" id="selectAllInvoices" onchange="toggleAllInvoices(this.checked)">
                        </th>
                        <th>Invoice Number</th>
                        <th>Date</th>
                        <th>Due Date</th>
                        <th>Supplier</th>
                        <th>Project</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Paired</th>
                        <th>Linked PO</th>
                        <th>Source</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${filtered.length > 0 ? filtered.map(inv => `
                        <tr class="invoice-row ${inv.status === 'overdue' ? 'overdue' : ''} ${inv.linkedPO ? 'linked-to-po' : ''}" data-invoice-id="${inv.id}">
                            <td onclick="event.stopPropagation()">
                                <input type="checkbox" class="invoice-checkbox" value="${inv.id}" onchange="updateInvoiceSelection()">
                            </td>
                            <td class="invoice-number-cell" onclick="openViewInvoicePDF('${inv.id}')">
                                <span class="invoice-number">${inv.number}</span>
                            </td>
                            <td onclick="openViewInvoicePDF('${inv.id}')">${new Date(inv.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                            <td onclick="openViewInvoicePDF('${inv.id}')">${new Date(inv.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                            <td class="invoice-supplier-cell" onclick="openViewInvoicePDF('${inv.id}')">${inv.supplier}</td>
                            <td onclick="openViewInvoicePDF('${inv.id}')">${inv.project || 'N/A'}</td>
                            <td class="invoice-amount-cell" onclick="openViewInvoicePDF('${inv.id}')">${(typeof APP_CONFIG !== 'undefined' && APP_CONFIG.currencySymbol) || '£'}${(Number(inv.amount) || 0).toLocaleString('en-GB', { minimumFractionDigits: 2 })}</td>
                            <td onclick="openViewInvoicePDF('${inv.id}')">
                                <span class="status-badge ${inv.status}">${inv.status}</span>
                            </td>
                            <td onclick="openViewInvoicePDF('${inv.id}')">
                                ${inv.paired ? `
                                    <span class="paired-badge">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M9 11l3 3L22 4"/>
                                            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                                        </svg>
                                        Paired
                                    </span>
                                ` : '<span class="unpaired-badge">Unpaired</span>'}
                            </td>
                            <td onclick="openViewInvoicePDF('${inv.id}')">
                                ${inv.linkedPO ? `<span class="linked-po-badge" title="Linked to order in procurement app">${inv.linkedPO}</span>` : '<span class="text-muted">—</span>'}
                            </td>
                            <td onclick="openViewInvoicePDF('${inv.id}')">
                                <span class="source-badge source-${inv.source || 'manual'}">${(inv.source || 'manual').charAt(0).toUpperCase() + (inv.source || 'manual').slice(1)}</span>
                            </td>
                            <td class="invoice-actions-cell" onclick="event.stopPropagation()">
                                ${inv.status === 'pending' ? `
                                    <button class="btn-primary btn-sm" onclick="markInvoicePaid('${inv.id}')">Mark Paid</button>
                                ` : ''}
                                <button class="btn-secondary btn-sm" onclick="openViewInvoicePDF('${inv.id}')">View</button>
                                <button class="btn-secondary btn-sm" onclick="downloadInvoicePDF('${inv.id}')">Download</button>
                            </td>
                        </tr>
                    `).join('') : `
                        <tr>
                            <td colspan="12" class="empty-row">No invoices found matching your filters</td>
                        </tr>
                    `}
                </tbody>
            </table>
        `;
    }
}

function openUploadInvoiceModal() {
    const modal = document.getElementById('uploadInvoiceModal');
    const body = document.getElementById('uploadInvoiceBody');
    
    if (body) {
        body.innerHTML = `
            <form onsubmit="submitInvoiceUpload(event)">
                <div class="form-section">
                    <h3>Upload Invoice</h3>
                    <div class="form-group">
                        <label>Invoice File</label>
                        <div class="file-upload-area" onclick="document.getElementById('invoiceFileUpload').click()">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                <polyline points="17 8 12 3 7 8"/>
                                <line x1="12" y1="3" x2="12" y2="15"/>
                            </svg>
                            <p>Click to upload invoice (PDF, JPG, PNG)</p>
                            <span id="invoiceFileName"></span>
                        </div>
                        <input type="file" id="invoiceFileUpload" style="display: none;" accept=".pdf,.jpg,.jpeg,.png" onchange="handleInvoiceFileUpload(event)">
                    </div>
                    <div class="form-group">
                        <label for="invoiceSupplier">Supplier</label>
                        <select id="invoiceSupplier" required>
                            <option value="">Select supplier</option>
                            ${suppliers.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="invoiceAmount">Amount</label>
                        <input type="number" id="invoiceAmount" step="0.01" required>
                    </div>
                    <div class="form-group">
                        <label for="invoiceDate">Date</label>
                        <input type="date" id="invoiceDate" required>
                    </div>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn-secondary" onclick="closeUploadInvoiceModal()">Cancel</button>
                    <button type="submit" class="btn-primary">Upload Invoice</button>
                </div>
            </form>
        `;
    }
    
    if (modal) {
        modal.classList.add('active');
    }
}

function handleInvoiceFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const fileName = document.getElementById('invoiceFileName');
        if (fileName) {
            fileName.textContent = file.name;
        }
    }
}

function submitInvoiceUpload(event) {
    event.preventDefault();
    
    const supplierId = document.getElementById('invoiceSupplier').value;
    const amount = parseFloat(document.getElementById('invoiceAmount').value);
    const date = document.getElementById('invoiceDate').value;
    
    const supplier = suppliers.find(s => s.id === supplierId);
    
    const newInvoice = {
        id: 'INV-' + Date.now(),
        number: 'INV-2024-' + String(invoices.length + 1).padStart(3, '0'),
        supplier: supplier.name,
        date: date,
        dueDate: new Date(new Date(date).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        amount: amount,
        status: 'pending',
        category: 'Materials',
        project: null,
        items: [{ description: 'Invoice items', quantity: 1, unitPrice: amount, total: amount }],
        paired: false
    };
    
    invoices.push(newInvoice);
    closeUploadInvoiceModal();
    renderInvoices();
    showToast('success', 'Success', 'Invoice uploaded successfully');
}

function closeUploadInvoiceModal() {
    const modal = document.getElementById('uploadInvoiceModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function openViewInvoiceModal(invoiceIdOrInvoice) {
    const invoice = typeof invoiceIdOrInvoice === 'string' 
        ? invoices.find(i => i.id === invoiceIdOrInvoice)
        : invoiceIdOrInvoice;
    
    if (!invoice) return;
    
    const modal = document.getElementById('viewInvoiceModal');
    const title = document.getElementById('viewInvoiceTitle');
    const body = document.getElementById('viewInvoiceBody');
    
    if (title) title.textContent = `Invoice ${invoice.number}`;
    
    if (body) {
        body.innerHTML = `
            <div class="invoice-details">
                <div class="detail-row">
                    <span class="detail-label">Supplier:</span>
                    <span class="detail-value">${invoice.supplier}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Date:</span>
                    <span class="detail-value">${invoice.date}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Due Date:</span>
                    <span class="detail-value">${invoice.dueDate}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Amount:</span>
                    <span class="detail-value">${APP_CONFIG.currencySymbol}${invoice.amount.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Status:</span>
                    <span class="detail-value"><span class="status-badge ${invoice.status}">${invoice.status}</span></span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Project:</span>
                    <span class="detail-value">${invoice.project || 'N/A'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Paired:</span>
                    <span class="detail-value">${invoice.paired ? 'Yes' : 'No'}</span>
                </div>
                <div class="items-section">
                    <h4>Items</h4>
                    <table class="items-table">
                        <thead>
                            <tr>
                                <th>Description</th>
                                <th>Quantity</th>
                                <th>Unit Price</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${invoice.items.map(item => `
                                <tr>
                                    <td>${item.description}</td>
                                    <td>${item.quantity}</td>
                                    <td>${APP_CONFIG.currencySymbol}${item.unitPrice.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</td>
                                    <td>${APP_CONFIG.currencySymbol}${item.total.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }
    
    if (modal) {
        modal.classList.add('active');
    }
}

function closeViewInvoiceModal() {
    const modal = document.getElementById('viewInvoiceModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function openViewInvoicePDF(invoiceId) {
    const invoice = invoices.find(i => i.id === invoiceId);
    if (!invoice) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'viewInvoicePDFModal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeViewInvoicePDFModal()"></div>
        <div class="modal-content modal-large">
            <div class="modal-header">
                <h2 id="viewInvoicePDFTitle">Invoice ${invoice.number}</h2>
                <div class="modal-header-actions">
                    <button class="btn-secondary btn-sm" onclick="downloadInvoicePDF('${invoice.id}')">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="7 10 12 15 17 10"/>
                            <line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                        Download
                    </button>
                    <button class="modal-close" onclick="closeViewInvoicePDFModal()">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </div>
            </div>
            <div class="modal-body pdf-viewer-container">
                <div class="invoice-pdf-view">
                    <div class="invoice-pdf-header">
                        <div class="invoice-pdf-company">
                            <h1>${APP_CONFIG.companyName}</h1>
                            <p>123 Business Street<br>London, UK, SW1A 1AA<br>Phone: +44 20 1234 5678</p>
                        </div>
                        <div class="invoice-pdf-title">
                            <h2>INVOICE</h2>
                            <div class="invoice-pdf-number">${invoice.number}</div>
                        </div>
                    </div>
                    <div class="invoice-pdf-details">
                        <div class="invoice-pdf-section">
                            <h3>Bill To:</h3>
                            <p><strong>${invoice.supplier}</strong></p>
                            <p>Supplier Address<br>City, Country</p>
                        </div>
                        <div class="invoice-pdf-section">
                            <h3>Invoice Details:</h3>
                            <p><strong>Date:</strong> ${new Date(invoice.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                            <p><strong>Due Date:</strong> ${new Date(invoice.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                            <p><strong>Project:</strong> ${invoice.project || 'N/A'}</p>
                            <p><strong>Status:</strong> ${invoice.status.toUpperCase()}</p>
                        </div>
                    </div>
                    <table class="invoice-pdf-items">
                        <thead>
                            <tr>
                                <th>Description</th>
                                <th>Quantity</th>
                                <th>Unit Price</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${invoice.items.map(item => `
                                <tr>
                                    <td>${item.description}</td>
                                    <td>${item.quantity} ${item.unit || 'ea'}</td>
                                    <td>${APP_CONFIG.currencySymbol}${item.unitPrice.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</td>
                                    <td>${APP_CONFIG.currencySymbol}${item.total.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                        <tfoot>
                            <tr class="invoice-pdf-subtotal">
                                <td colspan="3"><strong>Subtotal</strong></td>
                                <td>${APP_CONFIG.currencySymbol}${invoice.amount.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</td>
                            </tr>
                            <tr class="invoice-pdf-vat">
                                <td colspan="3"><strong>VAT (${APP_CONFIG.vatRate}%)</strong></td>
                                <td>${APP_CONFIG.currencySymbol}${(invoice.amount * APP_CONFIG.vatRate / 100).toLocaleString('en-GB', { minimumFractionDigits: 2 })}</td>
                            </tr>
                            <tr class="invoice-pdf-total">
                                <td colspan="3"><strong>Total</strong></td>
                                <td><strong>${APP_CONFIG.currencySymbol}${(invoice.amount * (1 + APP_CONFIG.vatRate / 100)).toLocaleString('en-GB', { minimumFractionDigits: 2 })}</strong></td>
                            </tr>
                        </tfoot>
                    </table>
                    <div class="invoice-pdf-footer">
                        <p><strong>Payment Terms:</strong> Payment is due within 30 days of invoice date.</p>
                        <p><strong>Payment Methods:</strong> Bank Transfer, Cheque, Credit Card</p>
                        <p>Thank you for your business!</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function closeViewInvoicePDFModal() {
    const modal = document.getElementById('viewInvoicePDFModal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    }
}

function downloadInvoicePDF(invoiceId) {
    const invoice = invoices.find(i => i.id === invoiceId);
    if (!invoice) return;
    
    showToast('info', 'Downloading', 'Preparing invoice PDF for download...');
    // In a real implementation, this would generate and download a PDF
    setTimeout(() => {
        showToast('success', 'Downloaded', `Invoice ${invoice.number} downloaded successfully`);
    }, 1000);
}

// ============================================
// EXPENSES VIEW - Redesigned
// ============================================

let selectedExpenses = new Set();
let currentGroupBy = 'none';

function renderExpenses() {
    try {
        if (!expenses || expenses.length === 0) {
            if (typeof generateExpenses === 'function') generateExpenses();
        }
        const mainContent = document.getElementById('expensesMainContent');
        if (!mainContent) {
            console.error('expensesMainContent element not found');
            return;
        }
        
        // Calculate stats: pending approval, approved (not yet posted), posted = ready for reconciliation
        const pendingExpenses = expenses.filter(e => e.status === 'pending');
        const approvedExpenses = expenses.filter(e => e.status === 'approved');
        const readyForReconciliation = expenses.filter(e => e.status === 'posted' && !e.paired);
        const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
        
        // Update stats bar
        updateExpenseStats({
            pending: pendingExpenses.length,
            approved: approvedExpenses.length,
            readyForReconciliation: readyForReconciliation.length,
            totalAmount: totalAmount
        });
        
        // Get filters
        const statusFilter = document.getElementById('expenseStatusFilter')?.value || 'all';
        const typeFilter = document.getElementById('expenseTypeFilter')?.value || 'all';
        
        // Filter expenses
        let filteredExpenses = [...expenses];
        
        if (statusFilter !== 'all') {
            filteredExpenses = filteredExpenses.filter(e => e.status === statusFilter);
        }
        
        if (typeFilter !== 'all') {
            filteredExpenses = filteredExpenses.filter(e => e.type === typeFilter);
        }
        
        // Group expenses
        const groupedExpenses = groupExpensesBy(filteredExpenses, currentGroupBy);
        
        // Render expenses
        if (filteredExpenses.length === 0) {
            mainContent.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M17 9V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/>
                            <path d="M13 21h6a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-6z"/>
                            <path d="M7 21v-8a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v8"/>
                        </svg>
                    </div>
                    <h3 class="empty-state-title">No Expenses Found</h3>
                    <p class="empty-state-text">Try adjusting your filters or add a new expense request.</p>
                </div>
            `;
            return;
        }
        
        // Render grouped expenses
        if (currentGroupBy !== 'none' && groupedExpenses.length > 0) {
            mainContent.innerHTML = groupedExpenses.map(group => `
                <div class="expense-group">
                    <div class="expense-group-header">
                        <h3 class="expense-group-title">${group.title}</h3>
                        <span class="expense-group-count">${group.items.length} expense${group.items.length !== 1 ? 's' : ''}</span>
                        <span class="expense-group-total">${APP_CONFIG.currencySymbol}${group.total.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div class="expense-group-items">
                        ${renderExpenseCards(group.items)}
                    </div>
                </div>
            `).join('');
        } else {
            mainContent.innerHTML = `
                <div class="expenses-grid">
                    ${renderExpenseCards(filteredExpenses)}
                </div>
            `;
        }
    } catch (error) {
        console.error('Error in renderExpenses:', error);
        const mainContent = document.getElementById('expensesMainContent');
        if (mainContent) {
            mainContent.innerHTML = `
                <div class="empty-state">
                    <h3 class="empty-state-title">Error Loading Expenses</h3>
                    <p class="empty-state-text">${error.message}</p>
                </div>
            `;
        }
    }
}

function updateExpenseStats(stats) {
    const statCards = document.querySelectorAll('.expense-stat-card');
    if (statCards.length >= 4) {
        statCards[0].querySelector('.stat-value').textContent = stats.pending;
        statCards[1].querySelector('.stat-value').textContent = stats.approved;
        statCards[2].querySelector('.stat-value').textContent = stats.readyForReconciliation;
        statCards[3].querySelector('.stat-value').textContent = `${APP_CONFIG.currencySymbol}${stats.totalAmount.toLocaleString('en-GB', { minimumFractionDigits: 2 })}`;
    }
}

function groupExpensesBy(expensesList, groupBy) {
    if (groupBy === 'none') {
        return []; // Return empty array to trigger the else branch
    }
    
    const groups = {};
    
    expensesList.forEach(exp => {
        let key;
        switch (groupBy) {
            case 'category':
                key = exp.category || 'Uncategorized';
                break;
            case 'project':
                key = exp.project || 'No Project';
                break;
            case 'date':
                const date = new Date(exp.date);
                key = date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
                break;
            case 'status':
                key = exp.status.charAt(0).toUpperCase() + exp.status.slice(1);
                break;
            default:
                key = 'Other';
        }
        
        if (!groups[key]) {
            groups[key] = [];
        }
        groups[key].push(exp);
    });
    
    // Convert to array and calculate totals
    return Object.keys(groups).map(key => ({
        title: key,
        items: groups[key],
        total: groups[key].reduce((sum, e) => sum + e.amount, 0)
    })).sort((a, b) => {
        if (groupBy === 'date') {
            return new Date(b.items[0].date) - new Date(a.items[0].date);
        }
        return a.title.localeCompare(b.title);
    });
}

function renderExpenseCards(expensesList) {
    if (expensesList.length === 0) {
        return '<div class="empty-state">No expenses in this group</div>';
    }
    
    return expensesList.map(exp => {
        const isSelected = selectedExpenses.has(exp.id);
        const isReadyForReconciliation = exp.status === 'posted' && !exp.paired;
        const isApprovedNotPosted = exp.status === 'approved';
        const isPending = exp.status === 'pending';
        const taxStr = (exp.tax != null && exp.tax > 0) ? ` (+${APP_CONFIG.currencySymbol}${exp.tax.toLocaleString('en-GB', { minimumFractionDigits: 2 })} tax)` : '';
        const sourceLabel = (exp.source || 'web') === 'mobile' ? 'Mobile' : 'Web';
        
        return `
            <div class="expense-card ${isSelected ? 'selected' : ''} ${isReadyForReconciliation ? 'ready-for-reconciliation' : ''} ${isPending ? 'pending' : ''}" 
                 data-expense-id="${exp.id}">
                <div class="expense-card-header">
                    <label class="expense-checkbox">
                        <input type="checkbox" ${isSelected ? 'checked' : ''} onchange="toggleExpenseSelection('${exp.id}')">
                        <span class="expense-id">${exp.id}</span>
                    </label>
                    <div class="expense-card-badges">
                        <span class="expense-type-badge ${exp.type}">${exp.type}</span>
                        <span class="expense-source-badge source-${exp.source || 'web'}">${sourceLabel}</span>
                        <span class="status-badge ${exp.status}">${exp.status}</span>
                        ${isReadyForReconciliation ? '<span class="reconciliation-ready-badge">Ready for Reconciliation</span>' : ''}
                        ${exp.paired ? '<span class="paired-badge">Paired</span>' : ''}
                    </div>
                </div>
                <div class="expense-card-body">
                    <div class="expense-description">${exp.description || exp.reason || 'No description'}</div>
                    <div class="expense-meta">
                        <div class="expense-meta-item">
                            <span class="meta-label">Submitted by:</span>
                            <span class="meta-value">${exp.submittedBy || 'N/A'}</span>
                        </div>
                        <div class="expense-meta-item">
                            <span class="meta-label">Date:</span>
                            <span class="meta-value">${new Date(exp.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                        </div>
                        <div class="expense-meta-item">
                            <span class="meta-label">Category:</span>
                            <span class="meta-value">${exp.category || 'N/A'}</span>
                        </div>
                        <div class="expense-meta-item">
                            <span class="meta-label">Project:</span>
                            <span class="meta-value">${exp.project || 'N/A'}</span>
                        </div>
                        ${exp.approvedBy ? `
                            <div class="expense-meta-item">
                                <span class="meta-label">Approved by:</span>
                                <span class="meta-value">${exp.approvedBy}</span>
                            </div>
                        ` : ''}
                    </div>
                </div>
                <div class="expense-card-footer">
                    <div class="expense-amount">
                        ${APP_CONFIG.currencySymbol}${exp.amount.toLocaleString('en-GB', { minimumFractionDigits: 2 })}${taxStr}
                    </div>
                    <div class="expense-card-actions">
                        ${isPending ? `
                            <button class="btn-primary btn-sm" onclick="viewExpenseDetails('${exp.id}')">View &amp; approve</button>
                            <button class="btn-danger btn-sm" onclick="rejectExpense('${exp.id}')">Reject</button>
                        ` : `
                            <button class="btn-secondary btn-sm" onclick="viewExpenseDetails('${exp.id}')">View</button>
                            ${isApprovedNotPosted ? `<button class="btn-primary btn-sm" onclick="postExpense('${exp.id}')">Post</button>` : ''}
                        `}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function toggleExpenseSelection(expenseId) {
    if (selectedExpenses.has(expenseId)) {
        selectedExpenses.delete(expenseId);
    } else {
        selectedExpenses.add(expenseId);
    }
    
    // Update card visual state
    const card = document.querySelector(`[data-expense-id="${expenseId}"]`);
    if (card) {
        if (selectedExpenses.has(expenseId)) {
            card.classList.add('selected');
        } else {
            card.classList.remove('selected');
        }
    }
}

function selectAllExpenses() {
    const visibleExpenses = document.querySelectorAll('.expense-card');
    visibleExpenses.forEach(card => {
        const expenseId = card.dataset.expenseId;
        selectedExpenses.add(expenseId);
        card.classList.add('selected');
        const checkbox = card.querySelector('input[type="checkbox"]');
        if (checkbox) checkbox.checked = true;
    });
}

function bulkApproveExpenses() {
    if (selectedExpenses.size === 0) {
        showToast('info', 'No Selection', 'Please select expenses to approve');
        return;
    }
    
    let approvedCount = 0;
    selectedExpenses.forEach(expenseId => {
        const expense = expenses.find(e => e.id === expenseId);
        if (expense && expense.status === 'pending') {
            expense.status = 'approved';
            expense.approvedBy = 'Finance Manager';
            expense.approvedDate = new Date().toISOString().split('T')[0];
            approvedCount++;
        }
    });
    
    selectedExpenses.clear();
    showToast('success', 'Approved', `${approvedCount} expense${approvedCount !== 1 ? 's' : ''} approved`);
    renderExpenses();
    renderSummary();
}

function filterExpenses() {
    renderExpenses();
}

function groupExpenses() {
    currentGroupBy = document.getElementById('expenseGroupBy')?.value || 'none';
    renderExpenses();
}

function markExpenseForReconciliation(expenseId) {
    const expense = expenses.find(e => e.id === expenseId);
    if (!expense) return;
    
    // This marks it as ready - in a real app, this might add it to a reconciliation queue
    showToast('success', 'Marked', `Expense ${expenseId} marked as ready for reconciliation`);
    renderExpenses();
}

function viewExpenseDetails(expenseId) {
    const expense = expenses.find(e => e.id === expenseId);
    if (!expense) return;
    const modal = document.getElementById('expenseDetailModal');
    const titleEl = document.getElementById('expenseDetailTitle');
    const bodyEl = document.getElementById('expenseDetailBody');
    if (!modal || !bodyEl) return;
    const currency = (typeof APP_CONFIG !== 'undefined' && APP_CONFIG.currencySymbol) || '£';
    const tax = (expense.tax != null && expense.tax !== undefined) ? expense.tax : 0;
    const totalWithTax = expense.amount + tax;
    const reason = expense.reason || expense.description || 'No reason given';
    const receiptImg = expense.receiptImage || (expense.receipt ? 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="120" viewBox="0 0 200 120"><rect fill="%23f5f5f5" width="200" height="120"/><text x="100" y="58" font-size="12" fill="%23999" text-anchor="middle">Receipt image</text><text x="100" y="75" font-size="10" fill="%23bbb" text-anchor="middle">(AI may extract data from image)</text></svg>') : null);
    titleEl.textContent = expense.id + ' – ' + (expense.description || 'Expense');
    bodyEl.innerHTML = `
        <div class="expense-detail-grid">
            <div class="expense-detail-main">
                <div class="expense-detail-field">
                    <span class="expense-detail-label">Submitted by</span>
                    <span class="expense-detail-value">${expense.submittedBy || 'N/A'}</span>
                </div>
                <div class="expense-detail-field">
                    <span class="expense-detail-label">Date</span>
                    <span class="expense-detail-value">${new Date(expense.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                </div>
                <div class="expense-detail-field">
                    <span class="expense-detail-label">Reason</span>
                    <span class="expense-detail-value">${reason}</span>
                </div>
                <div class="expense-detail-field">
                    <span class="expense-detail-label">Category</span>
                    <span class="expense-detail-value">${expense.category || 'N/A'}</span>
                </div>
                <div class="expense-detail-field">
                    <span class="expense-detail-label">Project</span>
                    <span class="expense-detail-value">${expense.project || 'N/A'}</span>
                </div>
                <div class="expense-detail-field">
                    <span class="expense-detail-label">Source</span>
                    <span class="expense-detail-value"><span class="source-badge source-${expense.source || 'web'}">${(expense.source || 'web') === 'mobile' ? 'Mobile app' : 'Web app'}</span></span>
                </div>
                <div class="expense-detail-amounts">
                    <div class="expense-detail-row">
                        <span class="expense-detail-label">Cost</span>
                        <span class="expense-detail-value">${currency}${(expense.amount || 0).toLocaleString('en-GB', { minimumFractionDigits: 2 })}</span>
                    </div>
                    ${tax > 0 ? `
                    <div class="expense-detail-row">
                        <span class="expense-detail-label">Tax</span>
                        <span class="expense-detail-value">${currency}${tax.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div class="expense-detail-row total">
                        <span class="expense-detail-label">Total</span>
                        <span class="expense-detail-value">${currency}${totalWithTax.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</span>
                    </div>
                    ` : ''}
                </div>
                <div class="expense-detail-status">
                    <span class="status-badge ${expense.status}">${expense.status}</span>
                    ${expense.approvedBy ? `<span class="expense-approved-by">Approved by ${expense.approvedBy}</span>` : ''}
                    ${expense.postedDate ? `<span class="expense-posted-date">Posted ${new Date(expense.postedDate).toLocaleDateString('en-GB')}</span>` : ''}
                </div>
                <div class="expense-detail-actions">
                    ${expense.status === 'pending' ? `
                        <button type="button" class="btn-primary" onclick="approveExpense('${expense.id}'); closeExpenseDetailModal();">Approve</button>
                        <button type="button" class="btn-danger" onclick="rejectExpense('${expense.id}'); closeExpenseDetailModal();">Reject</button>
                    ` : ''}
                    ${expense.status === 'approved' ? `
                        <button type="button" class="btn-primary" onclick="postExpense('${expense.id}'); closeExpenseDetailModal();">Post expense</button>
                        <span class="expense-detail-hint">Post to make it ready for bank reconciliation.</span>
                    ` : ''}
                    ${(expense.status === 'posted' || expense.status === 'rejected') ? `
                        <button type="button" class="btn-secondary" onclick="closeExpenseDetailModal()">Close</button>
                    ` : ''}
                </div>
            </div>
            <div class="expense-detail-receipt">
                <span class="expense-detail-label">Receipt</span>
                ${receiptImg ? `<div class="expense-receipt-image"><img src="${receiptImg}" alt="Receipt"></div><p class="expense-receipt-hint">Data may be extracted from receipt image by AI.</p>` : '<p class="expense-receipt-placeholder">No receipt image</p>'}
            </div>
        </div>
    `;
    modal.classList.add('active');
}

function closeExpenseDetailModal() {
    const modal = document.getElementById('expenseDetailModal');
    if (modal) modal.classList.remove('active');
}

function postExpense(expenseId) {
    const expense = expenses.find(e => e.id === expenseId);
    if (!expense) return;
    if (expense.status !== 'approved') {
        showToast('info', 'Cannot post', 'Only approved expenses can be posted.');
        return;
    }
    expense.status = 'posted';
    expense.postedDate = new Date().toISOString().split('T')[0];
    showToast('success', 'Posted', `Expense ${expenseId} posted and ready for reconciliation.`);
    renderExpenses();
    renderSummary();
}

function renderExpenseTable(expensesList) {
    if (expensesList.length === 0) {
        return '<div class="empty-state">No expenses found</div>';
    }
    
    return `
        <table class="expenses-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Project</th>
                    <th>Status</th>
                    <th>Submitted By</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${expensesList.map(exp => `
                    <tr class="${exp.status === 'pending' ? 'pending-approval' : ''}">
                        <td class="expense-id-cell">${exp.id}</td>
                        <td>${exp.description}</td>
                        <td>${exp.category}</td>
                        <td>${new Date(exp.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                        <td class="expense-amount-cell">${APP_CONFIG.currencySymbol}${exp.amount.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</td>
                        <td>${exp.project || 'N/A'}</td>
                        <td>
                            <span class="status-badge ${exp.status}">${exp.status}</span>
                            ${exp.status === 'pending' ? '<span class="approval-badge pending">Pending Approval</span>' : ''}
                        </td>
                        <td>${exp.submittedBy}</td>
                        <td class="expense-actions-cell">
                            ${exp.status === 'pending' ? `
                                <button class="btn-primary btn-sm" onclick="approveExpense('${exp.id}')">Approve</button>
                                <button class="btn-secondary btn-sm" onclick="rejectExpense('${exp.id}')">Reject</button>
                            ` : `
                                <span class="approved-by">Approved by ${exp.approvedBy || 'N/A'}</span>
                            `}
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function filterExpenseSection(type, filter) {
    const tableId = `${type}ExpensesTable`;
    const table = document.getElementById(tableId);
    if (!table) return;
    
    const rows = table.querySelectorAll('tbody tr');
    rows.forEach(row => {
        if (filter === 'all') {
            row.style.display = '';
        } else if (filter === 'approved') {
            row.style.display = row.classList.contains('pending-approval') ? 'none' : '';
        } else if (filter === 'pending') {
            row.style.display = row.classList.contains('pending-approval') ? '' : 'none';
        }
    });
}

function approveExpense(expenseId) {
    const expense = expenses.find(e => e.id === expenseId);
    if (!expense) return;
    
    expense.status = 'approved';
    expense.approvedBy = 'Finance Manager';
    expense.approvedDate = new Date().toISOString().split('T')[0];
    
    showToast('success', 'Approved', `Expense ${expenseId} has been approved`);
    renderExpenses();
}

function rejectExpense(expenseId) {
    const expense = expenses.find(e => e.id === expenseId);
    if (!expense) return;
    
    if (confirm(`Are you sure you want to reject expense ${expenseId}?`)) {
        expense.status = 'rejected';
        expense.rejectedBy = 'Finance Manager';
        expense.rejectedDate = new Date().toISOString().split('T')[0];
        
        // Remove from selection
        selectedExpenses.delete(expenseId);
        
        showToast('info', 'Rejected', `Expense ${expenseId} has been rejected`);
        renderExpenses();
        renderSummary();
    }
}

function openExpenseRequestModal() {
    const modal = document.getElementById('expenseRequestModal');
    const body = document.getElementById('expenseRequestBody');
    
    if (body) {
        body.innerHTML = `
            <form onsubmit="submitExpenseRequest(event)">
                <div class="form-section">
                    <h3>New Expense Request</h3>
                    <div class="form-group">
                        <label for="expenseDescription">Description</label>
                        <textarea id="expenseDescription" required rows="3"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="expenseAmount">Amount</label>
                        <input type="number" id="expenseAmount" step="0.01" required>
                    </div>
                    <div class="form-group">
                        <label>Receipt</label>
                        <div class="file-upload-area" onclick="document.getElementById('expenseReceiptUpload').click()">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                <polyline points="17 8 12 3 7 8"/>
                                <line x1="12" y1="3" x2="12" y2="15"/>
                            </svg>
                            <p>Click to upload receipt (JPG, PNG)</p>
                            <span id="expenseReceiptFileName"></span>
                        </div>
                        <input type="file" id="expenseReceiptUpload" style="display: none;" accept=".jpg,.jpeg,.png" onchange="handleExpenseReceiptUpload(event)">
                    </div>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn-secondary" onclick="closeExpenseRequestModal()">Cancel</button>
                    <button type="submit" class="btn-primary">Submit Request</button>
                </div>
            </form>
        `;
    }
    
    if (modal) {
        modal.classList.add('active');
    }
}

function handleExpenseReceiptUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const fileName = document.getElementById('expenseReceiptFileName');
        if (fileName) {
            fileName.textContent = file.name;
        }
    }
}

function submitExpenseRequest(event) {
    event.preventDefault();
    
    const description = document.getElementById('expenseDescription').value;
    const amount = parseFloat(document.getElementById('expenseAmount').value);
    const receipt = document.getElementById('expenseReceiptUpload').files[0];
    
    const newRequest = {
        id: 'REQ-' + String(expenseRequests.length + 1).padStart(3, '0'),
        description: description,
        amount: amount,
        date: new Date().toISOString().split('T')[0],
        receipt: receipt ? URL.createObjectURL(receipt) : null,
        status: 'pending',
        submittedBy: 'Current User',
        project: null
    };
    
    expenseRequests.push(newRequest);
    closeExpenseRequestModal();
    renderExpenses();
    showToast('success', 'Success', 'Expense request submitted');
}

function closeExpenseRequestModal() {
    const modal = document.getElementById('expenseRequestModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function approveExpenseRequest(requestId) {
    const request = expenseRequests.find(r => r.id === requestId);
    if (request) {
        request.status = 'approved';
        expenses.push({
            id: 'EXP-' + String(expenses.length + 1).padStart(3, '0'),
            description: request.description,
            amount: request.amount,
            type: 'employee', // Default to employee for requests
            category: request.category || 'Other',
            date: request.date,
            category: 'Other',
            receipt: request.receipt,
            status: 'approved',
            submittedBy: request.submittedBy,
            project: request.project
        });
        expenseRequests = expenseRequests.filter(r => r.id !== requestId);
        renderExpenses();
        renderSummary();
        showToast('success', 'Approved', 'Expense request approved');
    }
}

function rejectExpenseRequest(requestId) {
    expenseRequests = expenseRequests.filter(r => r.id !== requestId);
    renderExpenses();
    showToast('info', 'Rejected', 'Expense request rejected');
}

function viewReceipt(receiptUrl) {
    // Open receipt in new window/modal
    window.open(receiptUrl, '_blank');
}

// ============================================
// SUBSCRIPTIONS VIEW
// ============================================

function renderSubscriptions() {
    if (!subscriptions || subscriptions.length === 0) {
        if (typeof generateSubscriptions === 'function') generateSubscriptions();
    }
    const list = Array.isArray(subscriptions) ? subscriptions : [];
    const suggestedSubscriptions = getSuggestedSubscriptions();

    const activeCount = list.filter(s => s.status === 'active').length;
    const linkedCount = list.filter(s => (s.linkedInvoices && s.linkedInvoices.length > 0) || (s.invoices && s.invoices.length > 0)).length;
    const monthlyTotal = list.filter(s => s.status === 'active').reduce((sum, s) => sum + (s.frequency === 'monthly' ? s.amount : s.frequency === 'yearly' ? s.amount / 12 : s.amount / 3), 0);

    const statsBar = document.getElementById('subscriptionsStatsBar');
    if (statsBar) {
        statsBar.innerHTML = `
            <div class="subscription-stat-card">
                <span class="subscription-stat-value">${list.length}</span>
                <span class="subscription-stat-label">Total</span>
            </div>
            <div class="subscription-stat-card">
                <span class="subscription-stat-value">${activeCount}</span>
                <span class="subscription-stat-label">Active</span>
            </div>
            <div class="subscription-stat-card">
                <span class="subscription-stat-value">${linkedCount}</span>
                <span class="subscription-stat-label">Linked to invoices</span>
            </div>
            <div class="subscription-stat-card total">
                <span class="subscription-stat-value">${(typeof APP_CONFIG !== 'undefined' && APP_CONFIG.currencySymbol) || '£'}${monthlyTotal.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</span>
                <span class="subscription-stat-label">Monthly total</span>
            </div>
        `;
    }

    const filtersEl = document.getElementById('subscriptionsFilters');
    if (filtersEl) {
        filtersEl.innerHTML = `
            <div class="subscriptions-filter-row">
                <label class="filter-label">Category</label>
                <select id="subscriptionCategoryFilter" onchange="filterSubscriptions()">
                    <option value="all">All categories</option>
                    <option value="Software">Software</option>
                    <option value="IT Services">IT Services</option>
                    <option value="Cloud Services">Cloud Services</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Other">Other</option>
                </select>
                <label class="filter-label">Source</label>
                <select id="subscriptionSourceFilter" onchange="filterSubscriptions()">
                    <option value="all">All sources</option>
                    <option value="manual">Manual</option>
                    <option value="ai-suggestion">AI suggestion</option>
                </select>
                <label class="filter-label">Status</label>
                <select id="subscriptionStatusFilter" onchange="filterSubscriptions()">
                    <option value="all">All status</option>
                    <option value="active">Active</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="paused">Paused</option>
                </select>
            </div>
        `;
    }

    const suggestionsSection = document.getElementById('subscriptionsSuggestionsSection');
    if (suggestionsSection) {
        suggestionsSection.innerHTML = suggestedSubscriptions.length > 0 ? `
            <div class="subscriptions-section suggested">
                <div class="subscriptions-section-header">
                    <div>
                        <h3>Suggested by AI</h3>
                        <p class="section-description">Possible subscriptions from invoices and bank statements—add to manager in one click.</p>
                    </div>
                </div>
                <div class="subscriptions-table-container">
                    <table class="subscriptions-table">
                        <thead>
                            <tr>
                                <th>Provider</th>
                                <th>Detected From</th>
                                <th>Amount</th>
                                <th>Frequency</th>
                                <th>Confidence</th>
                                <th>Last Invoice</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${suggestedSubscriptions.map(sub => `
                                <tr>
                                    <td><strong>${sub.provider}</strong></td>
                                    <td>${sub.detectedFrom || '—'}</td>
                                    <td class="subscription-amount-cell">${APP_CONFIG.currencySymbol}${sub.amount.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</td>
                                    <td>${sub.frequency}</td>
                                    <td>
                                        <span class="confidence-badge ${sub.confidence > 80 ? 'high' : sub.confidence > 60 ? 'medium' : 'low'}">
                                            ${sub.confidence}%
                                        </span>
                                    </td>
                                    <td>${sub.lastInvoiceDate ? new Date(sub.lastInvoiceDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}</td>
                                    <td class="subscription-actions-cell">
                                        <button class="btn-primary btn-sm" onclick="addSuggestedSubscription('${sub.id}')">Add to manager</button>
                                        <button class="btn-secondary btn-sm" onclick="dismissSuggestion('${sub.id}')">Dismiss</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        ` : '';
    }

    const mainContent = document.getElementById('subscriptionsMainContent');
    if (!mainContent) return;

    const categoryFilter = (document.getElementById('subscriptionCategoryFilter') || {}).value || 'all';
    const sourceFilter = (document.getElementById('subscriptionSourceFilter') || {}).value || 'all';
    const statusFilter = (document.getElementById('subscriptionStatusFilter') || {}).value || 'all';
    let filtered = list.filter(s => {
        if (categoryFilter !== 'all' && s.category !== categoryFilter) return false;
        if (sourceFilter !== 'all' && (s.source || 'manual') !== sourceFilter) return false;
        if (statusFilter !== 'all' && (s.status || 'active') !== statusFilter) return false;
        return true;
    });

    const linkedCountFor = (sub) => (sub.linkedInvoices && sub.linkedInvoices.length) || (sub.invoices && sub.invoices.length) || 0;

    mainContent.innerHTML = `
        <div class="subscriptions-section">
            <div class="subscriptions-section-header">
                <div>
                    <h3>Subscriptions</h3>
                    <p class="section-description">Website URL, login details, notes and calculations stored here. Invoices from email linked and recorded; all reconciled in one place.</p>
                </div>
                <button class="btn-primary btn-sm" onclick="openAddSubscriptionModal()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;vertical-align:middle;margin-right:6px;">
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    Add Subscription
                </button>
            </div>
            <div class="subscriptions-table-container">
                <table class="subscriptions-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Provider</th>
                            <th>Category</th>
                            <th>Website</th>
                            <th>Source</th>
                            <th>Amount</th>
                            <th>Frequency</th>
                            <th>Next Payment</th>
                            <th>Status</th>
                            <th>Linked</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filtered.length > 0 ? filtered.map(sub => {
                            const sourceLabel = sub.source === 'ai-suggestion' ? 'AI suggestion' : 'Manual';
                            const linkCount = linkedCountFor(sub);
                            return `
                            <tr class="subscription-row" onclick="viewSubscriptionDetails('${sub.id}')">
                                <td><strong>${(sub.name || '').replace(/</g, '&lt;')}</strong></td>
                                <td>${(sub.provider || '').replace(/</g, '&lt;')}</td>
                                <td>${(sub.category || '').replace(/</g, '&lt;')}</td>
                                <td>${sub.websiteUrl ? `<a href="${sub.websiteUrl.replace(/"/g, '&quot;')}" target="_blank" rel="noopener" onclick="event.stopPropagation()" class="subscription-website-link">Link</a>` : '—'}</td>
                                <td><span class="source-badge ${sub.source === 'ai-suggestion' ? 'ai' : 'manual'}">${sourceLabel}</span></td>
                                <td class="subscription-amount-cell">${APP_CONFIG.currencySymbol}${(sub.amount || 0).toLocaleString('en-GB', { minimumFractionDigits: 2 })}</td>
                                <td>${(sub.frequency || '').replace(/</g, '&lt;')}</td>
                                <td>${sub.nextPayment ? new Date(sub.nextPayment).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}</td>
                                <td><span class="status-badge ${sub.status || 'active'}">${(sub.status || 'active')}</span></td>
                                <td><span class="invoice-count">${linkCount} invoice${linkCount !== 1 ? 's' : ''}</span></td>
                                <td class="subscription-actions-cell" onclick="event.stopPropagation()">
                                    <button class="btn-secondary btn-sm" onclick="viewSubscriptionDetails('${sub.id}')">View</button>
                                    <button class="btn-secondary btn-sm" onclick="editSubscription('${sub.id}')">Edit</button>
                                </td>
                            </tr>
                        `; }).join('') : '<tr><td colspan="11" class="empty-row">No subscriptions match filters. Add one or clear filters.</td></tr>'}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function filterSubscriptions() {
    renderSubscriptions();
}

function addSuggestedSubscription(suggestionId) {
    const suggestion = getSuggestedSubscriptions().find(s => s.id === suggestionId);
    if (!suggestion) return;
    
    // Open add subscription modal with pre-filled data
    openAddSubscriptionModal(suggestion);
}

function dismissSuggestion(suggestionId) {
    showToast('info', 'Dismissed', 'Suggestion dismissed');
    renderSubscriptions();
}

function openAddSubscriptionModal(suggestionOrEditSubscription = null, isEdit = false) {
    const suggestion = !isEdit && suggestionOrEditSubscription && (suggestionOrEditSubscription.suggestedFrom != null || suggestionOrEditSubscription.confidence != null) ? suggestionOrEditSubscription : null;
    const editSub = isEdit && suggestionOrEditSubscription ? suggestionOrEditSubscription : null;

    const freqMonthly = (editSub || suggestion) ? ((editSub ? editSub.frequency : suggestion?.frequency) === 'monthly' ? 'selected' : '') : 'selected';
    const freqQuarterly = (editSub || suggestion) ? ((editSub ? editSub.frequency : suggestion?.frequency) === 'quarterly' ? 'selected' : '') : '';
    const freqYearly = (editSub || suggestion) ? ((editSub ? editSub.frequency : suggestion?.frequency) === 'yearly' ? 'selected' : '') : '';

    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'addSubscriptionModal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeAddSubscriptionModal()"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h2>${editSub ? 'Edit Subscription' : suggestion ? 'Add Suggested Subscription' : 'Add New Subscription'}</h2>
                <button class="modal-close" onclick="closeAddSubscriptionModal()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                </button>
            </div>
            <div class="modal-body">
                <form onsubmit="submitSubscription(event, '${suggestion ? suggestion.id : ''}')">
                    ${editSub ? `<input type="hidden" id="editSubscriptionId" value="${editSub.id}">` : ''}
                    <div class="form-group">
                        <label for="subName">Subscription Name *</label>
                        <input type="text" id="subName" required value="${editSub ? (editSub.name || '').replace(/"/g, '&quot;') : suggestion ? (suggestion.provider || '') : ''}" placeholder="e.g., Software License - Project Manager">
                    </div>
                    <div class="form-group">
                        <label for="subProvider">Provider *</label>
                        <input type="text" id="subProvider" required value="${editSub ? (editSub.provider || '').replace(/"/g, '&quot;') : suggestion ? (suggestion.provider || '') : ''}" placeholder="e.g., TechCorp Software">
                    </div>
                    <div class="form-group">
                        <label for="subCategory">Category</label>
                        <select id="subCategory">
                            <option value="Software" ${(editSub && editSub.category === 'Software') || (suggestion && !editSub) ? 'selected' : ''}>Software</option>
                            <option value="IT Services" ${editSub && editSub.category === 'IT Services' ? 'selected' : ''}>IT Services</option>
                            <option value="Cloud Services" ${editSub && editSub.category === 'Cloud Services' ? 'selected' : ''}>Cloud Services</option>
                            <option value="Marketing" ${editSub && editSub.category === 'Marketing' ? 'selected' : ''}>Marketing</option>
                            <option value="Professional Services" ${editSub && editSub.category === 'Professional Services' ? 'selected' : ''}>Professional Services</option>
                            <option value="Other" ${editSub && editSub.category === 'Other' ? 'selected' : ''}>Other</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="subAmount">Amount *</label>
                        <input type="number" id="subAmount" required step="0.01" value="${editSub ? editSub.amount : suggestion ? suggestion.amount : ''}" placeholder="0.00">
                    </div>
                    <div class="form-group">
                        <label for="subFrequency">Frequency *</label>
                        <select id="subFrequency" required>
                            <option value="monthly" ${freqMonthly}>Monthly</option>
                            <option value="quarterly" ${freqQuarterly}>Quarterly</option>
                            <option value="yearly" ${freqYearly}>Yearly</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="subNextPayment">Next Payment Date *</label>
                        <input type="date" id="subNextPayment" required value="${editSub && editSub.nextPayment ? editSub.nextPayment : ''}">
                    </div>
                    <div class="form-group">
                        <label for="subEmail">Billing Email *</label>
                        <input type="email" id="subEmail" required value="${editSub ? (editSub.email || '').replace(/"/g, '&quot;') : suggestion ? (suggestion.email || '') : ''}" placeholder="billing@provider.com">
                        <small>AI will monitor this email for invoices and link them to this subscription</small>
                    </div>
                    <div class="form-group">
                        <label for="subWebsiteUrl">Website URL</label>
                        <input type="url" id="subWebsiteUrl" value="${(editSub && editSub.websiteUrl) || (suggestion && suggestion.websiteUrl) ? ((editSub ? editSub.websiteUrl : suggestion.websiteUrl) || '').replace(/"/g, '&quot;') : ''}" placeholder="https://provider.com/login">
                        <small>Provider portal; AI can auto-retrieve subscription details from here</small>
                    </div>
                    <div class="form-group">
                        <label for="subLoginDetails">Login details</label>
                        <input type="text" id="subLoginDetails" placeholder="Stored securely (e.g. username / account)" value="${editSub && editSub.loginDetails ? (editSub.loginDetails || '').replace(/"/g, '&quot;') : ''}">
                        <small>Stored here for quick access; keep secure</small>
                    </div>
                    <div class="form-group">
                        <label for="subNotes">Notes</label>
                        <textarea id="subNotes" rows="3" placeholder="Additional notes, renewal dates, calculations">${(editSub && editSub.notes) || (suggestion && suggestion.notes) ? ((editSub ? editSub.notes : suggestion.notes) || '').replace(/</g, '&lt;') : ''}</textarea>
                    </div>
                    <div class="form-group">
                        <label for="subTerms">Terms & Conditions</label>
                        <textarea id="subTerms" rows="2" placeholder="Contract terms, cancellation policy, etc.">${editSub && editSub.terms ? (editSub.terms || '').replace(/</g, '&lt;') : ''}</textarea>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn-secondary" onclick="closeAddSubscriptionModal()">Cancel</button>
                        <button type="submit" class="btn-primary">${editSub ? 'Save changes' : 'Add Subscription'}</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    if (!editSub && !suggestion) {
        const nextPaymentInput = document.getElementById('subNextPayment');
        if (nextPaymentInput) {
            const nextMonth = new Date();
            nextMonth.setMonth(nextMonth.getMonth() + 1);
            nextPaymentInput.value = nextMonth.toISOString().split('T')[0];
        }
    }
    if (editSub && editSub.nextPayment && !document.getElementById('subNextPayment').value) {
        document.getElementById('subNextPayment').value = editSub.nextPayment;
    }
}

function closeAddSubscriptionModal() {
    const modal = document.getElementById('addSubscriptionModal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    }
}

function submitSubscription(event, suggestionId) {
    event.preventDefault();

    const editIdEl = document.getElementById('editSubscriptionId');
    const editId = editIdEl ? editIdEl.value : null;
    const existing = editId ? subscriptions.find(s => s.id === editId) : null;

    const amount = parseFloat(document.getElementById('subAmount').value) || 0;
    const frequency = document.getElementById('subFrequency').value || 'monthly';
    const annual = frequency === 'monthly' ? amount * 12 : frequency === 'quarterly' ? amount * 4 : amount;
    const monthly = frequency === 'monthly' ? amount : frequency === 'yearly' ? amount / 12 : amount / 3;

    const suggestion = !editId && suggestionId ? getSuggestedSubscriptions().find(s => s.id === suggestionId) : null;

    const payload = {
        name: document.getElementById('subName').value.trim(),
        provider: document.getElementById('subProvider').value.trim(),
        category: document.getElementById('subCategory').value,
        amount: amount,
        frequency: frequency,
        nextPayment: document.getElementById('subNextPayment').value,
        email: document.getElementById('subEmail').value.trim(),
        status: existing ? existing.status : 'active',
        websiteUrl: (document.getElementById('subWebsiteUrl') && document.getElementById('subWebsiteUrl').value.trim()) || null,
        loginDetails: (document.getElementById('subLoginDetails') && document.getElementById('subLoginDetails').value.trim()) || null,
        calculations: { annual: Math.round(annual * 100) / 100, monthly: Math.round(monthly * 100) / 100 },
        notes: (document.getElementById('subNotes') && document.getElementById('subNotes').value.trim()) || '',
        terms: (document.getElementById('subTerms') && document.getElementById('subTerms').value.trim()) || ''
    };

    if (existing) {
        Object.assign(existing, payload);
        existing.linkedInvoices = existing.linkedInvoices || [];
        existing.invoices = existing.invoices || [];
        closeAddSubscriptionModal();
        renderSubscriptions();
        showToast('success', 'Saved', `Subscription "${existing.name}" updated.`);
    } else {
        const newSubscription = {
            id: 'SUB-' + String(subscriptions.length + 1).padStart(3, '0'),
            ...payload,
            linkedInvoices: [],
            invoices: [],
            startDate: new Date().toISOString().split('T')[0],
            contractEnd: null,
            source: suggestion ? 'ai-suggestion' : 'manual',
            suggestedFrom: suggestion ? (suggestion.suggestedFrom || { type: 'invoice', id: null }) : null,
            project: null,
            paired: false
        };
        subscriptions.push(newSubscription);
        closeAddSubscriptionModal();
        renderSubscriptions();
        showToast('success', 'Added', `Subscription "${newSubscription.name}" added. AI will link invoices from email and you can manage website & login here.`);
    }
}

function getLinkedInvoicesForSubscription(subscription) {
    const ids = subscription.linkedInvoices || [];
    const embedded = subscription.invoices || [];
    const fromGlobal = (typeof invoices !== 'undefined' && Array.isArray(invoices)) ? invoices : [];
    const resolved = ids.map(id => {
        const inv = fromGlobal.find(i => (i.id || i.number) === id);
        return inv ? { id: inv.id || inv.number, date: inv.date, amount: inv.amount, status: inv.status, inSystem: true } : { id, date: null, amount: null, status: null, inSystem: false };
    });
    const fromEmbedded = embedded.filter(e => !ids.includes(e.id)).map(e => ({ id: e.id, date: e.date, amount: e.amount, status: e.status || 'paid', inSystem: false }));
    return [...resolved, ...fromEmbedded];
}

function viewSubscriptionDetails(subscriptionId) {
    const subscription = subscriptions.find(s => s.id === subscriptionId);
    if (!subscription) return;

    const linkedList = getLinkedInvoicesForSubscription(subscription);
    const sourceLabel = subscription.source === 'ai-suggestion'
        ? (subscription.suggestedFrom ? `AI suggestion (from ${subscription.suggestedFrom.type})` : 'AI suggestion')
        : 'Manual';
    const calc = subscription.calculations || {};

    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'subscriptionDetailsModal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeSubscriptionDetailsModal()"></div>
        <div class="modal-content modal-large">
            <div class="modal-header">
                <h2>${(subscription.name || '').replace(/</g, '&lt;')}</h2>
                <button class="modal-close" onclick="closeSubscriptionDetailsModal()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                </button>
            </div>
            <div class="modal-body">
                <div class="subscription-details-grid">
                    <div class="subscription-details-section">
                        <h3>Subscription Details</h3>
                        <div class="detail-grid">
                            <div class="detail-item">
                                <span class="detail-label">Provider:</span>
                                <span class="detail-value">${(subscription.provider || '').replace(/</g, '&lt;')}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Category:</span>
                                <span class="detail-value">${(subscription.category || '').replace(/</g, '&lt;')}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Source:</span>
                                <span class="detail-value"><span class="source-badge ${subscription.source === 'ai-suggestion' ? 'ai' : 'manual'}">${sourceLabel}</span></span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Amount:</span>
                                <span class="detail-value">${APP_CONFIG.currencySymbol}${(subscription.amount || 0).toLocaleString('en-GB', { minimumFractionDigits: 2 })} / ${(subscription.frequency || '').replace(/</g, '&lt;')}</span>
                            </div>
                            ${(calc.annual != null || calc.monthly != null) ? `
                            <div class="detail-item">
                                <span class="detail-label">Calculations:</span>
                                <span class="detail-value">${calc.annual != null ? APP_CONFIG.currencySymbol + (calc.annual).toLocaleString('en-GB', { minimumFractionDigits: 2 }) + ' annual' : ''}${calc.annual != null && calc.monthly != null ? ' · ' : ''}${calc.monthly != null ? APP_CONFIG.currencySymbol + (calc.monthly).toLocaleString('en-GB', { minimumFractionDigits: 2 }) + '/month' : ''}</span>
                            </div>
                            ` : ''}
                            <div class="detail-item">
                                <span class="detail-label">Status:</span>
                                <span class="detail-value"><span class="status-badge ${subscription.status || 'active'}">${(subscription.status || 'active')}</span></span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Next Payment:</span>
                                <span class="detail-value">${subscription.nextPayment ? new Date(subscription.nextPayment).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Billing Email:</span>
                                <span class="detail-value">${(subscription.email || '').replace(/</g, '&lt;')}</span>
                            </div>
                            ${subscription.websiteUrl ? `
                            <div class="detail-item">
                                <span class="detail-label">Website:</span>
                                <span class="detail-value"><a href="${subscription.websiteUrl.replace(/"/g, '&quot;')}" target="_blank" rel="noopener" class="subscription-website-link">${(subscription.websiteUrl || '').replace(/</g, '&lt;')}</a></span>
                            </div>
                            ` : ''}
                            <div class="detail-item">
                                <span class="detail-label">Login details:</span>
                                <span class="detail-value">${subscription.loginDetails ? '•••••••• Stored securely' : '—'}</span>
                            </div>
                            ${subscription.startDate ? `
                                <div class="detail-item">
                                    <span class="detail-label">Start Date:</span>
                                    <span class="detail-value">${new Date(subscription.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                </div>
                            ` : ''}
                            ${subscription.contractEnd ? `
                                <div class="detail-item">
                                    <span class="detail-label">Contract End:</span>
                                    <span class="detail-value">${new Date(subscription.contractEnd).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                </div>
                            ` : ''}
                        </div>
                    </div>

                    ${subscription.notes ? `
                        <div class="subscription-details-section">
                            <h3>Notes</h3>
                            <div class="subscription-notes">${(subscription.notes || '').replace(/</g, '&lt;').replace(/\n/g, '<br>')}</div>
                        </div>
                    ` : ''}

                    ${subscription.terms ? `
                        <div class="subscription-details-section">
                            <h3>Terms & Conditions</h3>
                            <div class="subscription-terms">${(subscription.terms || '').replace(/</g, '&lt;').replace(/\n/g, '<br>')}</div>
                        </div>
                    ` : ''}
                </div>

                <div class="subscription-invoices-section">
                    <div class="section-header">
                        <h3>Linked invoices</h3>
                        <span class="invoice-count-badge">${linkedList.length} invoice${linkedList.length !== 1 ? 's' : ''}</span>
                    </div>
                    ${linkedList.length > 0 ? `
                        <div class="subscription-invoices-table-container">
                            <table class="subscription-invoices-table">
                                <thead>
                                    <tr>
                                        <th>Invoice ID</th>
                                        <th>Date</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${linkedList.map(inv => `
                                        <tr>
                                            <td class="invoice-id-cell">${(inv.id || '').replace(/</g, '&lt;')}</td>
                                            <td>${inv.date ? new Date(inv.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}</td>
                                            <td class="invoice-amount-cell">${inv.amount != null ? APP_CONFIG.currencySymbol + inv.amount.toLocaleString('en-GB', { minimumFractionDigits: 2 }) : '—'}</td>
                                            <td>${inv.status ? `<span class="status-badge ${inv.status}">${inv.status}</span>` : (inv.inSystem ? '—' : 'Not in system')}</td>
                                            <td>
                                                ${inv.inSystem ? `<button class="btn-secondary btn-sm" onclick="viewInvoiceById('${(inv.id || '').replace(/'/g, "\\'")}')">View invoice</button>` : '<span class="text-muted">—</span>'}
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                        <p class="subscription-invoices-note">Invoices from email are linked by AI and recorded here; reconcile in Reconciliation.</p>
                    ` : `
                        <div class="empty-state">
                            <p>No linked invoices yet. AI will link invoices from ${subscription.email} to this subscription when detected.</p>
                        </div>
                    `}
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary" onclick="editSubscription('${subscription.id}')">Edit Subscription</button>
                <button class="btn-primary" onclick="closeSubscriptionDetailsModal()">Close</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function viewInvoiceById(invoiceId) {
    if (typeof switchView === 'function') switchView('invoices');
    const inv = (typeof invoices !== 'undefined' && Array.isArray(invoices)) ? invoices.find(i => (i.id || i.number) === invoiceId) : null;
    if (inv && typeof openViewInvoiceModal === 'function') {
        closeSubscriptionDetailsModal();
        openViewInvoiceModal(inv.id || inv.number);
    } else if (inv) showToast('info', 'Invoice', `Invoice ${invoiceId}`);
}

function closeSubscriptionDetailsModal() {
    const modal = document.getElementById('subscriptionDetailsModal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    }
}

function viewSubscriptionInvoice(invoiceId, subscriptionId) {
    const subscription = subscriptions.find(s => s.id === subscriptionId);
    if (!subscription) return;
    
    const invoice = subscription.invoices.find(i => i.id === invoiceId);
    if (!invoice) return;
    
    showToast('info', 'Invoice', `Viewing invoice ${invoiceId} from ${subscription.provider}`);
    // In a real implementation, this would open the invoice PDF
}

function editSubscription(subscriptionId) {
    const subscription = subscriptions.find(s => s.id === subscriptionId);
    if (!subscription) return;
    closeSubscriptionDetailsModal();
    openAddSubscriptionModal(subscription, true);
}

// ============================================
// CREDITS VIEW
// ============================================

function renderCredits() {
    if (!credits || credits.length === 0) {
        if (typeof generateCredits === 'function') generateCredits();
    }
    const list = Array.isArray(credits) ? credits : [];

    const totalAmount = list.reduce((s, c) => s + (Number(c.amount) || 0), 0);
    const pendingCount = list.filter(c => c.status === 'pending').length;
    const readyCount = list.filter(c => c.status === 'processed' && !c.paired).length;
    const reconciledCount = list.filter(c => c.status === 'applied' || c.paired).length;

    const statsBar = document.getElementById('creditsStatsBar');
    if (statsBar) {
        statsBar.innerHTML = `
            <div class="credit-stat-card">
                <span class="credit-stat-value">${list.length}</span>
                <span class="credit-stat-label">Credit notes</span>
            </div>
            <div class="credit-stat-card">
                <span class="credit-stat-value">${pendingCount}</span>
                <span class="credit-stat-label">Pending</span>
            </div>
            <div class="credit-stat-card highlight">
                <span class="credit-stat-value">${readyCount}</span>
                <span class="credit-stat-label">Ready for reconciliation</span>
            </div>
            <div class="credit-stat-card">
                <span class="credit-stat-value">${reconciledCount}</span>
                <span class="credit-stat-label">Reconciled</span>
            </div>
            <div class="credit-stat-card total">
                <span class="credit-stat-value">${(typeof APP_CONFIG !== 'undefined' && APP_CONFIG.currencySymbol) || '£'}${totalAmount.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                <span class="credit-stat-label">Total</span>
            </div>
        `;
    }

    const suppliers = [...new Set(list.map(c => c.supplier).filter(Boolean))];
    const projects = [...new Set(list.map(c => c.project).filter(Boolean))];

    const filtersEl = document.getElementById('creditsFilters');
    if (filtersEl) {
        filtersEl.innerHTML = `
            <div class="credits-filter-row">
                <label class="filter-label">Filters</label>
                <select id="creditStatusFilter" onchange="filterCredits()">
                    <option value="all">All status</option>
                    <option value="pending">Pending</option>
                    <option value="processed">Ready for reconciliation</option>
                    <option value="applied">Reconciled</option>
                </select>
                <select id="creditSupplierFilter" onchange="filterCredits()">
                    <option value="all">All suppliers</option>
                    ${suppliers.map(s => `<option value="${(s || '').replace(/"/g, '&quot;')}">${(s || '').replace(/</g, '&lt;')}</option>`).join('')}
                </select>
                <select id="creditProjectFilter" onchange="filterCredits()">
                    <option value="all">All projects</option>
                    ${projects.map(p => `<option value="${(p || '').replace(/"/g, '&quot;')}">${(p || '').replace(/</g, '&lt;')}</option>`).join('')}
                </select>
                <select id="creditSourceFilter" onchange="filterCredits()">
                    <option value="all">All source</option>
                    <option value="email">From email</option>
                    <option value="upload">Upload</option>
                    <option value="manual">Manual</option>
                </select>
                <input type="date" id="creditDateFrom" onchange="filterCredits()" title="From date" class="filter-date">
                <input type="date" id="creditDateTo" onchange="filterCredits()" title="To date" class="filter-date">
                <input type="text" id="creditSearch" placeholder="Search credit, supplier…" onkeyup="filterCredits()" class="filter-search">
            </div>
        `;
    }

    const statusFilter = document.getElementById('creditStatusFilter')?.value || 'all';
    const supplierFilter = document.getElementById('creditSupplierFilter')?.value || 'all';
    const projectFilter = document.getElementById('creditProjectFilter')?.value || 'all';
    const sourceFilter = document.getElementById('creditSourceFilter')?.value || 'all';
    const dateFrom = document.getElementById('creditDateFrom')?.value || '';
    const dateTo = document.getElementById('creditDateTo')?.value || '';
    const searchTerm = (document.getElementById('creditSearch')?.value || '').toLowerCase();

    let filtered = list.filter(c => {
        if (statusFilter !== 'all' && (c.status || 'pending') !== statusFilter) return false;
        if (supplierFilter !== 'all' && c.supplier !== supplierFilter) return false;
        if (projectFilter !== 'all' && (c.project || '') !== projectFilter) return false;
        if (sourceFilter !== 'all' && (c.source || 'manual') !== sourceFilter) return false;
        if (dateFrom && new Date(c.date) < new Date(dateFrom)) return false;
        if (dateTo) {
            const to = new Date(dateTo);
            to.setHours(23, 59, 59, 999);
            if (new Date(c.date) > to) return false;
        }
        if (searchTerm && !(c.number || '').toLowerCase().includes(searchTerm) && !(c.supplier || '').toLowerCase().includes(searchTerm) && !(c.reason || '').toLowerCase().includes(searchTerm) && !(c.originalInvoice || '').toLowerCase().includes(searchTerm)) return false;
        return true;
    });

    const gridContainer = document.getElementById('creditsGrid');
    if (!gridContainer) return;

    gridContainer.className = 'credits-table-container';
    gridContainer.innerHTML = list.length === 0 ? `
        <div class="credits-empty-state">
            <p>No credit notes yet. Credit notes can be added from email, upload, or manually and managed here.</p>
            <p class="credits-empty-hint">Process credits to make them ready for bank reconciliation.</p>
        </div>
    ` : `
        <table class="credits-table">
            <thead>
                <tr>
                    <th class="col-check"><input type="checkbox" id="selectAllCredits" onchange="toggleAllCredits(this.checked)" title="Select all"></th>
                    <th>Credit</th>
                    <th>Date</th>
                    <th>Supplier</th>
                    <th>Original invoice</th>
                    <th>Project</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Paired</th>
                    <th>Source</th>
                    <th class="col-actions">Actions</th>
                </tr>
            </thead>
            <tbody>
                ${filtered.length > 0 ? filtered.map(cred => `
                    <tr class="credit-row ${cred.status || 'pending'} ${cred.paired ? 'paired' : ''}" data-credit-id="${cred.id}">
                        <td onclick="event.stopPropagation()">
                            <input type="checkbox" class="credit-checkbox" value="${cred.id}" onchange="updateCreditSelection()">
                        </td>
                        <td class="credit-number-cell" onclick="viewCredit('${cred.id}')">
                            <span class="credit-number">${(cred.number || '').replace(/</g, '&lt;')}</span>
                        </td>
                        <td onclick="viewCredit('${cred.id}')">${new Date(cred.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                        <td class="credit-supplier-cell" onclick="viewCredit('${cred.id}')">${(cred.supplier || '').replace(/</g, '&lt;')}</td>
                        <td onclick="viewCredit('${cred.id}')">${(cred.originalInvoice || '—').replace(/</g, '&lt;')}</td>
                        <td onclick="viewCredit('${cred.id}')">${(cred.project || '—').replace(/</g, '&lt;')}</td>
                        <td class="credit-amount-cell" onclick="viewCredit('${cred.id}')">${(typeof APP_CONFIG !== 'undefined' && APP_CONFIG.currencySymbol) || '£'}${(Number(cred.amount) || 0).toLocaleString('en-GB', { minimumFractionDigits: 2 })}</td>
                        <td onclick="viewCredit('${cred.id}')">
                            <span class="status-badge ${cred.status || 'pending'}">${cred.status === 'processed' ? 'Ready for recon' : (cred.status || 'pending')}</span>
                        </td>
                        <td onclick="viewCredit('${cred.id}')">
                            ${cred.paired ? '<span class="paired-badge">Paired</span>' : '<span class="unpaired-badge">Unpaired</span>'}
                        </td>
                        <td onclick="viewCredit('${cred.id}')">
                            <span class="source-badge source-${cred.source || 'manual'}">${((cred.source || 'manual').charAt(0).toUpperCase() + (cred.source || 'manual').slice(1)).replace(/</g, '&lt;')}</span>
                        </td>
                        <td class="credit-actions-cell" onclick="event.stopPropagation()">
                            ${(cred.status === 'pending') ? `<button class="btn-primary btn-sm" onclick="markCreditProcessed('${cred.id}')">Process</button>` : ''}
                            <button class="btn-secondary btn-sm" onclick="viewCredit('${cred.id}')">View</button>
                        </td>
                    </tr>
                `).join('') : '<tr><td colspan="11" class="empty-row">No credit notes match filters.</td></tr>'}
            </tbody>
        </table>
    `;
}

function filterCredits() {
    renderCredits();
}

function toggleAllCredits(checked) {
    document.querySelectorAll('.credit-checkbox').forEach(cb => {
        cb.checked = checked;
    });
    updateCreditSelection();
}

function updateCreditSelection() {
    const selectAll = document.getElementById('selectAllCredits');
    if (selectAll) {
        const boxes = document.querySelectorAll('.credit-checkbox');
        const checked = document.querySelectorAll('.credit-checkbox:checked').length;
        selectAll.checked = boxes.length > 0 && checked === boxes.length;
        selectAll.indeterminate = checked > 0 && checked < boxes.length;
    }
}

/** Mark credit as processed so it appears in Reconciliation for bank matching */
function markCreditProcessed(creditId) {
    const credit = credits.find(c => c.id === creditId);
    if (credit) {
        credit.status = 'processed';
        renderCredits();
        if (typeof updateReconciliationItems === 'function') updateReconciliationItems();
        if (typeof showToast === 'function') showToast('success', 'Processed', `Credit ${credit.number} is now ready for reconciliation.`);
    }
}

function applyCredit(creditId) {
    const credit = credits.find(c => c.id === creditId);
    if (credit) {
        credit.status = 'applied';
        credit.paired = true;
        renderCredits();
        if (typeof updateReconciliationItems === 'function') updateReconciliationItems();
        if (typeof showToast === 'function') showToast('success', 'Applied', `Credit ${credit.number} has been applied.`);
    }
}

function viewCredit(creditId) {
    const credit = credits.find(c => c.id === creditId);
    if (!credit) return;
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'viewCreditModal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeViewCreditModal()"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h2>Credit note ${(credit.number || '').replace(/</g, '&lt;')}</h2>
                <button class="modal-close" onclick="closeViewCreditModal()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
            </div>
            <div class="modal-body">
                <div class="credit-detail-grid">
                    <div class="detail-item"><span class="detail-label">Supplier</span><span class="detail-value">${(credit.supplier || '').replace(/</g, '&lt;')}</span></div>
                    <div class="detail-item"><span class="detail-label">Date</span><span class="detail-value">${new Date(credit.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span></div>
                    <div class="detail-item"><span class="detail-label">Amount</span><span class="detail-value">${(typeof APP_CONFIG !== 'undefined' && APP_CONFIG.currencySymbol) || '£'}${(Number(credit.amount) || 0).toLocaleString('en-GB', { minimumFractionDigits: 2 })}</span></div>
                    <div class="detail-item"><span class="detail-label">Reason</span><span class="detail-value">${(credit.reason || '—').replace(/</g, '&lt;')}</span></div>
                    <div class="detail-item"><span class="detail-label">Original invoice</span><span class="detail-value">${(credit.originalInvoice || '—').replace(/</g, '&lt;')}</span></div>
                    <div class="detail-item"><span class="detail-label">Project</span><span class="detail-value">${(credit.project || '—').replace(/</g, '&lt;')}</span></div>
                    <div class="detail-item"><span class="detail-label">Status</span><span class="detail-value"><span class="status-badge ${credit.status || 'pending'}">${credit.status === 'processed' ? 'Ready for reconciliation' : (credit.status || 'pending')}</span></span></div>
                    <div class="detail-item"><span class="detail-label">Source</span><span class="detail-value"><span class="source-badge source-${credit.source || 'manual'}">${(credit.source || 'manual').charAt(0).toUpperCase() + (credit.source || 'manual').slice(1)}</span></span></div>
                </div>
                ${credit.status === 'pending' ? `<div class="credit-detail-actions"><button class="btn-primary" onclick="markCreditProcessed('${credit.id}'); closeViewCreditModal();">Process (ready for reconciliation)</button></div>` : ''}
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function closeViewCreditModal() {
    const modal = document.getElementById('viewCreditModal');
    if (modal && modal.parentNode) {
        modal.classList.remove('active');
        setTimeout(() => modal.parentNode.removeChild(modal), 300);
    }
}

// ============================================
// REBATES VIEW
// ============================================

function renderRebates() {
    const agreementsContainer = document.getElementById('rebatesAgreements');
    const analysisContainer = document.getElementById('rebatesAnalysis');
    
    if (agreementsContainer) {
        agreementsContainer.innerHTML = `
            <div class="section-header">
                <h3>Rebate Agreements</h3>
                <button class="btn-primary btn-sm" onclick="openRebateAgreementModal()">New Agreement</button>
            </div>
            <div class="rebate-agreements-list">
                ${rebateAgreements.map(agreement => `
                    <div class="rebate-agreement-card">
                        <div class="agreement-header">
                            <div class="agreement-name">${agreement.name}</div>
                            <div class="agreement-status ${agreement.status}">${agreement.status}</div>
                        </div>
                        <div class="agreement-body">
                            <div class="agreement-supplier">${agreement.supplier}</div>
                            <div class="agreement-details">
                                <span>${agreement.percentage}% discount</span>
                                <span>Min order: ${APP_CONFIG.currencySymbol}${agreement.minOrder.toLocaleString('en-GB')}</span>
                            </div>
                            <div class="agreement-period">${agreement.startDate} to ${agreement.endDate}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    if (analysisContainer) {
        // AI analysis simulation
        analysisContainer.innerHTML = `
            <div class="section-header">
                <h3>AI Rebate Analysis</h3>
            </div>
            <div class="rebate-analysis-content">
                <div class="analysis-summary">
                    <p>Analyzed ${invoices.length} invoices and identified ${rebates.length} rebate opportunities.</p>
                    <p>Estimated rebate value: ${APP_CONFIG.currencySymbol}${rebates.reduce((sum, r) => sum + r.estimatedValue, 0).toLocaleString('en-GB', { minimumFractionDigits: 2 })}</p>
                </div>
                <div class="rebate-opportunities">
                    ${rebates.map(reb => `
                        <div class="rebate-opportunity">
                            <div class="opportunity-supplier">${reb.supplier}</div>
                            <div class="opportunity-agreement">${reb.agreement}</div>
                            <div class="opportunity-value">${APP_CONFIG.currencySymbol}${reb.estimatedValue.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
}

function openRebateAgreementModal() {
    // Modal for creating new rebate agreement
    showToast('info', 'Coming Soon', 'Rebate agreement creation will be available soon');
}

// ============================================
// CASH VIEW
// ============================================

function renderCash() {
    console.log('=== RENDERCASH FUNCTION CALLED ===');
    console.log('cashTransactions:', cashTransactions);
    
    // Don't manipulate view visibility here - that's handled by switchView()
    const cashView = document.getElementById('cashView');
    if (!cashView) {
        console.error('Cash view element not found!');
        return;
    }
    
    const transactionsContainer = document.getElementById('cashTransactions');
    if (!transactionsContainer) {
        console.error('Cash transactions container not found!');
        return;
    }
    console.log('Cash transactions container found');
    
    // Get projects list (simulated - would come from project manager app)
    const projects = [
        'Riverside Tower',
        'Metro Shopping Centre',
        'Harbour View Apartments',
        'City Plaza',
        'Industrial Complex'
    ];
    
    // Ensure cashTransactions is initialized
    if (typeof cashTransactions === 'undefined' || cashTransactions === null || !Array.isArray(cashTransactions)) {
        cashTransactions = [];
    }
    
    if (cashTransactions.length === 0) {
        const emptyStateHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                        <line x1="1" y1="10" x2="23" y2="10"/>
                        <path d="M12 1v22"/>
                    </svg>
                </div>
                <h3 class="empty-state-title">No Cash Transactions</h3>
                <p class="empty-state-text">Start by adding your first cash transaction</p>
                <button class="btn-primary" id="addCashTransactionBtnEmpty" onclick="try { window.openCashTransactionModal(); } catch(e) { alert('Error calling function: ' + e.message + ' - Type: ' + typeof window.openCashTransactionModal); }" style="margin-top: 24px;">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 18px; height: 18px; margin-right: 8px; vertical-align: middle;">
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    <span>Add Cash Transaction</span>
                </button>
            </div>
        `;
        transactionsContainer.innerHTML = emptyStateHTML;
        console.log('Empty state rendered');
        return;
    }
    
    // Calculate totals
    const totalIn = cashTransactions.filter(t => t.type === 'in').reduce((sum, t) => sum + t.amount, 0);
    const totalOut = cashTransactions.filter(t => t.type === 'out').reduce((sum, t) => sum + t.amount, 0);
    const netCash = totalIn - totalOut;
    
    transactionsContainer.innerHTML = `
        <div class="cash-summary">
            <div class="cash-summary-card">
                <div class="cash-summary-label">Total Cash In</div>
                <div class="cash-summary-value positive">${APP_CONFIG.currencySymbol}${totalIn.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</div>
            </div>
            <div class="cash-summary-card">
                <div class="cash-summary-label">Total Cash Out</div>
                <div class="cash-summary-value negative">${APP_CONFIG.currencySymbol}${totalOut.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</div>
            </div>
            <div class="cash-summary-card">
                <div class="cash-summary-label">Net Cash</div>
                <div class="cash-summary-value ${netCash >= 0 ? 'positive' : 'negative'}">${APP_CONFIG.currencySymbol}${Math.abs(netCash).toLocaleString('en-GB', { minimumFractionDigits: 2 })}</div>
            </div>
        </div>
        <div class="cash-transactions-list">
            <div class="cash-transactions-header">
                <h3>Cash Transactions</h3>
                <div class="cash-filters">
                    <select id="cashTypeFilter" onchange="filterCashTransactions()">
                        <option value="all">All Types</option>
                        <option value="in">Cash In</option>
                        <option value="out">Cash Out</option>
                    </select>
                    <select id="cashProjectFilter" onchange="filterCashTransactions()">
                        <option value="all">All Projects</option>
                        ${projects.map(p => `<option value="${p}">${p}</option>`).join('')}
                        <option value="">No Project</option>
                    </select>
                    <input type="date" id="cashDateFrom" placeholder="From Date" onchange="filterCashTransactions()" title="From Date">
                    <input type="date" id="cashDateTo" placeholder="To Date" onchange="filterCashTransactions()" title="To Date">
                    <input type="text" id="cashSearch" placeholder="Search transactions..." onkeyup="filterCashTransactions()">
                </div>
            </div>
            <div class="cash-transactions-table" id="cashTransactionsTable">
                ${renderCashTransactionsTable(cashTransactions)}
            </div>
        </div>
    `;
}

function renderCashTransactionsTable(transactions) {
    if (transactions.length === 0) {
        return `
            <div class="empty-state">
                <div class="empty-state-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                        <line x1="1" y1="10" x2="23" y2="10"/>
                        <path d="M12 1v22"/>
                    </svg>
                </div>
                <p class="empty-state-text">No transactions found</p>
            </div>
        `;
    }
    
    return `
        <table class="cash-table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Reason/Details</th>
                    <th>Project</th>
                    <th>Linked Transaction</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${transactions.map(transaction => `
                    <tr>
                        <td>${new Date(transaction.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                        <td>
                            <span class="cash-type-badge ${transaction.type}">
                                ${transaction.type === 'in' ? 'Cash In' : 'Cash Out'}
                            </span>
                        </td>
                        <td class="${transaction.type === 'in' ? 'positive' : 'negative'}">
                            ${transaction.type === 'in' ? '+' : '-'}${APP_CONFIG.currencySymbol}${transaction.amount.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                        </td>
                        <td>${transaction.reason || 'N/A'}</td>
                        <td>${transaction.project || 'N/A'}</td>
                        <td>
                            ${transaction.pairedWithTransaction ? 
                                `<span class="paired-badge">Linked to ${transaction.pairedWithTransaction}</span>` : 
                                '<span class="unpaired-badge">Not linked</span>'
                            }
                        </td>
                        <td>
                            <button class="btn-icon" onclick="editCashTransaction('${transaction.id}')" title="Edit">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                </svg>
                            </button>
                            <button class="btn-icon" onclick="deleteCashTransaction('${transaction.id}')" title="Delete">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="3 6 5 6 21 6"/>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                </svg>
                            </button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function filterCashTransactions() {
    const typeFilter = document.getElementById('cashTypeFilter')?.value || 'all';
    const projectFilter = document.getElementById('cashProjectFilter')?.value || 'all';
    const dateFrom = document.getElementById('cashDateFrom')?.value || '';
    const dateTo = document.getElementById('cashDateTo')?.value || '';
    const searchTerm = document.getElementById('cashSearch')?.value.toLowerCase() || '';
    
    let filtered = cashTransactions.filter(cash => {
        // Type filter
        if (typeFilter !== 'all' && cash.type !== typeFilter) return false;
        
        // Project filter
        if (projectFilter !== 'all') {
            if (projectFilter === '' && cash.project) return false;
            if (projectFilter !== '' && cash.project !== projectFilter) return false;
        }
        
        // Date range filter
        if (dateFrom) {
            const cashDate = new Date(cash.date);
            const fromDate = new Date(dateFrom);
            if (cashDate < fromDate) return false;
        }
        if (dateTo) {
            const cashDate = new Date(cash.date);
            const toDate = new Date(dateTo);
            toDate.setHours(23, 59, 59, 999);
            if (cashDate > toDate) return false;
        }
        
        // Search filter
        if (searchTerm && !cash.reason.toLowerCase().includes(searchTerm) && 
            !(cash.project && cash.project.toLowerCase().includes(searchTerm))) {
            return false;
        }
        
        return true;
    });
    
    // Update the table container
    const tableContainer = document.getElementById('cashTransactionsTable');
    if (tableContainer) {
        tableContainer.innerHTML = renderCashTransactionsTable(filtered);
    } else {
        // Fallback: re-render entire cash view
        renderCash();
    }
}

// This function is now defined at the top of the file (line ~17)
// Keeping this as a reference but the actual implementation is above
// function openCashTransactionModal is defined earlier in the file

function closeCashTransactionModal() {
    const modal = document.getElementById('cashTransactionModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function submitCashTransaction(event, transactionId) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    const transaction = {
        id: transactionId || 'CASH-' + Date.now(),
        type: formData.get('type'),
        amount: parseFloat(formData.get('amount')),
        date: formData.get('date'),
        reason: formData.get('reason'),
        project: formData.get('project') || null,
        pairedWithTransaction: transactionId ? cashTransactions.find(t => t.id === transactionId)?.pairedWithTransaction : null
    };
    
    if (transactionId) {
        // Update existing
        const index = cashTransactions.findIndex(t => t.id === transactionId);
        if (index !== -1) {
            cashTransactions[index] = transaction;
            showToast('success', 'Updated', 'Cash transaction updated successfully');
        }
    } else {
        // Add new
        cashTransactions.push(transaction);
        showToast('success', 'Added', 'Cash transaction added successfully');
    }
    
    // Save to localStorage
    try {
        localStorage.setItem('cashTransactions', JSON.stringify(cashTransactions));
        console.log('Cash transactions saved to localStorage');
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
    
    closeCashTransactionModal();
    
    // Stay on cash view and refresh it
    switchView('cash');
    renderCash();
    renderSummary();
    renderCosting();
}

function editCashTransaction(transactionId) {
    openCashTransactionModal(transactionId);
}

function deleteCashTransaction(transactionId) {
    if (confirm('Are you sure you want to delete this cash transaction?')) {
        cashTransactions = cashTransactions.filter(t => t.id !== transactionId);
        
        // Save to localStorage
        try {
            localStorage.setItem('cashTransactions', JSON.stringify(cashTransactions));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
        
        showToast('success', 'Deleted', 'Cash transaction deleted successfully');
        renderCash();
        renderSummary();
        renderCosting();
        renderSummary();
        renderCosting();
    }
}

// ============================================
// COSTING VIEW
// ============================================

function renderCosting() {
    const filtersContainer = document.getElementById('costingFilters');
    const projectsContainer = document.getElementById('costingProjects');
    
    // Calculate cash transactions per project
    const cashByProject = {};
    cashTransactions.forEach(cash => {
        if (cash.project && cash.project !== 'None') {
            if (!cashByProject[cash.project]) {
                cashByProject[cash.project] = { in: 0, out: 0 };
            }
            if (cash.type === 'in') {
                cashByProject[cash.project].in += cash.amount;
            } else {
                cashByProject[cash.project].out += cash.amount;
            }
        }
    });
    
    // Simulated project costing data (would come from other apps)
    const projects = [
        {
            id: 'PROJ-001',
            name: 'Riverside Tower',
            contract: 'Structural Steelwork',
            budget: 2400000,
            expected: 2350000,
            actual: {
                procurement: 1850000, // From procure app
                labour: 320000,      // From on-site app
                subcontractors: 180000, // From QA tracker
                cash: (cashByProject['Riverside Tower']?.out || 0) - (cashByProject['Riverside Tower']?.in || 0) // Net cash out
            },
            status: 'on-track'
        },
        {
            id: 'PROJ-002',
            name: 'Metro Shopping Centre',
            contract: 'Mechanical & Electrical',
            budget: 1800000,
            expected: 1780000,
            actual: {
                procurement: 1200000,
                labour: 280000,
                subcontractors: 150000,
                cash: (cashByProject['Metro Shopping Centre']?.out || 0) - (cashByProject['Metro Shopping Centre']?.in || 0)
            },
            status: 'over-budget'
        },
        {
            id: 'PROJ-003',
            name: 'Harbour View Apartments',
            contract: 'Facade & Cladding',
            budget: 950000,
            expected: 920000,
            actual: {
                procurement: 650000,
                labour: 140000,
                subcontractors: 80000,
                cash: (cashByProject['Harbour View Apartments']?.out || 0) - (cashByProject['Harbour View Apartments']?.in || 0)
            },
            status: 'on-track'
        }
    ];
    
    if (filtersContainer) {
        filtersContainer.innerHTML = `
            <div class="filter-group">
                <select id="costingProjectFilter" onchange="filterCosting()">
                    <option value="all">All Projects</option>
                    ${projects.map(p => `<option value="${p.id}">${p.name}</option>`).join('')}
                </select>
                <select id="costingStatusFilter" onchange="filterCosting()">
                    <option value="all">All Status</option>
                    <option value="on-track">On Track</option>
                    <option value="over-budget">Over Budget</option>
                    <option value="under-budget">Under Budget</option>
                </select>
                <label class="checkbox-label">
                    <input type="checkbox" id="costingIncludeCash" checked onchange="filterCosting()">
                    Include Cash Transactions
                </label>
            </div>
        `;
    }
    
    if (projectsContainer) {
        projectsContainer.innerHTML = projects.map(project => {
            const totalActual = project.actual.procurement + project.actual.labour + project.actual.subcontractors + (project.actual.cash || 0);
            const variance = totalActual - project.expected;
            const variancePercent = ((variance / project.expected) * 100).toFixed(1);
            const budgetVariance = totalActual - project.budget;
            const budgetVariancePercent = ((budgetVariance / project.budget) * 100).toFixed(1);
            
            return `
                <div class="costing-project-card">
                    <div class="costing-project-header">
                        <div>
                            <h3>${project.name}</h3>
                            <p class="costing-contract">${project.contract}</p>
                        </div>
                        <div class="costing-status ${project.status}">${project.status.replace('-', ' ')}</div>
                    </div>
                    <div class="costing-breakdown">
                        <div class="costing-category">
                            <div class="costing-category-label">Procurement</div>
                            <div class="costing-category-value">${APP_CONFIG.currencySymbol}${project.actual.procurement.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</div>
                        </div>
                        <div class="costing-category">
                            <div class="costing-category-label">Labour</div>
                            <div class="costing-category-value">${APP_CONFIG.currencySymbol}${project.actual.labour.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</div>
                        </div>
                        <div class="costing-category">
                            <div class="costing-category-label">Subcontractors</div>
                            <div class="costing-category-value">${APP_CONFIG.currencySymbol}${project.actual.subcontractors.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</div>
                        </div>
                        ${project.actual.cash !== undefined ? `
                        <div class="costing-category">
                            <div class="costing-category-label">Cash Transactions</div>
                            <div class="costing-category-value ${project.actual.cash >= 0 ? 'negative' : 'positive'}">${APP_CONFIG.currencySymbol}${Math.abs(project.actual.cash).toLocaleString('en-GB', { minimumFractionDigits: 2 })}</div>
                        </div>
                        ` : ''}
                    </div>
                    <div class="costing-summary">
                        <div class="costing-summary-item">
                            <span class="costing-label">Total Actual:</span>
                            <span class="costing-value">${APP_CONFIG.currencySymbol}${totalActual.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div class="costing-summary-item">
                            <span class="costing-label">Expected:</span>
                            <span class="costing-value">${APP_CONFIG.currencySymbol}${project.expected.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div class="costing-summary-item">
                            <span class="costing-label">Budget:</span>
                            <span class="costing-value">${APP_CONFIG.currencySymbol}${project.budget.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div class="costing-summary-item ${variance >= 0 ? 'negative' : 'positive'}">
                            <span class="costing-label">Variance (Expected):</span>
                            <span class="costing-value">${variance >= 0 ? '+' : ''}${APP_CONFIG.currencySymbol}${Math.abs(variance).toLocaleString('en-GB', { minimumFractionDigits: 2 })} (${variancePercent}%)</span>
                        </div>
                        <div class="costing-summary-item ${budgetVariance >= 0 ? 'negative' : 'positive'}">
                            <span class="costing-label">Variance (Budget):</span>
                            <span class="costing-value">${budgetVariance >= 0 ? '+' : ''}${APP_CONFIG.currencySymbol}${Math.abs(budgetVariance).toLocaleString('en-GB', { minimumFractionDigits: 2 })} (${budgetVariancePercent}%)</span>
                        </div>
                    </div>
                    <div class="costing-progress">
                        <div class="costing-progress-bar">
                            <div class="costing-progress-fill" style="width: ${(totalActual / project.budget) * 100}%"></div>
                        </div>
                        <div class="costing-progress-label">${((totalActual / project.budget) * 100).toFixed(1)}% of budget used</div>
                    </div>
                </div>
            `;
        }).join('');
    }
}

function filterCosting() {
    // Filter logic would go here
    // The cash transactions are already included in renderCosting()
    renderCosting();
}

// ============================================
// REPORTS VIEW
// ============================================

function renderReports() {
    const listContainer = document.getElementById('reportsList');
    if (!listContainer) return;
    
    const reportTypes = [
        { id: 'invoice-summary', name: 'Invoice Summary Report', description: 'Summary of all invoices', exportType: 'csv', types: ['invoices'] },
        { id: 'expense-report', name: 'Expense Report', description: 'Detailed expense breakdown', exportType: 'csv', types: ['expenses'] },
        { id: 'financial-statement', name: 'Financial Statement', description: 'Complete financial overview', exportType: 'pdf', types: ['invoices', 'expenses', 'credits', 'cash'] },
        { id: 'reconciliation-report', name: 'Reconciliation Report', description: 'Bank reconciliation details', exportType: 'csv', types: ['invoices', 'cash'] },
        { id: 'subscription-report', name: 'Subscription Report', description: 'Active subscriptions list', exportType: 'csv', types: ['subscriptions'] },
        { id: 'cash-report', name: 'Cash Transactions Report', description: 'All cash transactions', exportType: 'csv', types: ['cash'] },
        { id: 'comprehensive-report', name: 'Comprehensive Financial Report', description: 'All transaction types', exportType: 'csv', types: ['invoices', 'expenses', 'credits', 'cash'] }
    ];
    
    listContainer.innerHTML = reportTypes.map(report => `
        <div class="report-card">
            <div class="report-header">
                <div class="report-name">${report.name}</div>
                <div class="report-export">${report.exportType.toUpperCase()}</div>
            </div>
            <div class="report-body">
                <div class="report-description">${report.description}</div>
                ${report.types.length > 1 ? `
                    <div class="report-filters">
                        <label>Include:</label>
                        ${report.types.map(type => `
                            <label class="checkbox-label-small">
                                <input type="checkbox" class="report-type-filter" data-report="${report.id}" data-type="${type}" checked>
                                ${type.charAt(0).toUpperCase() + type.slice(1)}
                            </label>
                        `).join('')}
                    </div>
                ` : ''}
                <div class="report-actions">
                    <button class="btn-primary btn-sm" onclick="generateReport('${report.id}')">Generate</button>
                    <button class="btn-secondary btn-sm" onclick="exportReport('${report.id}', '${report.exportType}')">Export</button>
                </div>
            </div>
        </div>
    `).join('');
}

function generateReport(reportId) {
    showToast('info', 'Generating', 'Generating report...');
    
    setTimeout(() => {
        showToast('success', 'Complete', 'Report generated successfully');
    }, 2000);
}

function exportReport(reportId, format) {
    showToast('info', 'Exporting', `Exporting report as ${format.toUpperCase()}...`);
    
    // Get selected transaction types for this report
    const selectedTypes = [];
    document.querySelectorAll(`.report-type-filter[data-report="${reportId}"]:checked`).forEach(checkbox => {
        selectedTypes.push(checkbox.dataset.type);
    });
    
    // Simulate CSV export
    if (format === 'csv') {
        let csvContent = '';
        
        switch(reportId) {
            case 'invoice-summary':
                if (selectedTypes.includes('invoices') || selectedTypes.length === 0) {
                    csvContent = 'Invoice Number,Supplier,Date,Amount,Status,Project\n';
                    invoices.forEach(inv => {
                        csvContent += `${inv.number},${inv.supplier},${inv.date},${inv.amount},${inv.status},${inv.project || 'N/A'}\n`;
                    });
                }
                break;
            case 'expense-report':
                if (selectedTypes.includes('expenses') || selectedTypes.length === 0) {
                    csvContent = 'Expense ID,Description,Amount,Date,Category,Status\n';
                    expenses.forEach(exp => {
                        csvContent += `${exp.id},${exp.description},${exp.amount},${exp.date},${exp.category},${exp.status}\n`;
                    });
                }
                break;
            case 'cash-report':
                if (selectedTypes.includes('cash') || selectedTypes.length === 0) {
                    csvContent = 'Transaction ID,Type,Amount,Date,Reason,Project,Linked Transaction\n';
                    cashTransactions.forEach(cash => {
                        csvContent += `${cash.id},${cash.type === 'in' ? 'Cash In' : 'Cash Out'},${cash.amount},${cash.date},${cash.reason || 'N/A'},${cash.project || 'N/A'},${cash.pairedWithTransaction || 'N/A'}\n`;
                    });
                }
                break;
            case 'reconciliation-report':
                csvContent = 'Type,ID,Date,Amount,Description,Project,Status\n';
                if (selectedTypes.includes('invoices') || selectedTypes.length === 0) {
                    invoices.forEach(inv => {
                        csvContent += `Invoice,${inv.number},${inv.date},${inv.amount},${inv.supplier},${inv.project || 'N/A'},${inv.paired ? 'Paired' : 'Unpaired'}\n`;
                    });
                }
                if (selectedTypes.includes('cash') || selectedTypes.length === 0) {
                    cashTransactions.forEach(cash => {
                        csvContent += `Cash,${cash.id},${cash.date},${cash.type === 'in' ? cash.amount : -cash.amount},${cash.reason || 'N/A'},${cash.project || 'N/A'},${cash.pairedWithTransaction ? 'Paired' : 'Unpaired'}\n`;
                    });
                }
                break;
            case 'comprehensive-report':
            case 'financial-statement':
                csvContent = 'Type,ID,Date,Amount,Description,Project,Status\n';
                if (selectedTypes.includes('invoices') || selectedTypes.length === 0) {
                    invoices.forEach(inv => {
                        csvContent += `Invoice,${inv.number},${inv.date},${inv.amount},${inv.supplier},${inv.project || 'N/A'},${inv.status}\n`;
                    });
                }
                if (selectedTypes.includes('expenses') || selectedTypes.length === 0) {
                    expenses.forEach(exp => {
                        csvContent += `Expense,${exp.id},${exp.date},${exp.amount},${exp.description},${exp.project || 'N/A'},${exp.status}\n`;
                    });
                }
                if (selectedTypes.includes('credits') || selectedTypes.length === 0) {
                    credits.forEach(cred => {
                        csvContent += `Credit,${cred.number},${cred.date},${cred.amount},${cred.reason},${cred.project || 'N/A'},${cred.status}\n`;
                    });
                }
                if (selectedTypes.includes('cash') || selectedTypes.length === 0) {
                    cashTransactions.forEach(cash => {
                        csvContent += `Cash,${cash.id},${cash.date},${cash.type === 'in' ? cash.amount : -cash.amount},${cash.reason || 'N/A'},${cash.project || 'N/A'},${cash.pairedWithTransaction ? 'Paired' : 'Unpaired'}\n`;
                    });
                }
                break;
        }
        
        if (csvContent) {
            // Create download link
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${reportId}-${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
            window.URL.revokeObjectURL(url);
            
            showToast('success', 'Exported', 'Report exported successfully');
        } else {
            showToast('warning', 'No Data', 'Please select at least one transaction type to export');
        }
    }
}

// ============================================
// SETTINGS VIEW
// ============================================

function renderSettings() {
    const gridContainer = document.getElementById('settingsGrid');
    if (!gridContainer) return;
    
    // Ensure formats are initialized
    if (poFormatTemplates.length === 0) {
        initializePOFormats();
    }
    
    // Get active format for editing
    const activeFormat = getActivePOFormat();
    if (activeFormat) {
        poFormatComponents = [...activeFormat.components];
    } else {
        poFormatComponents = [{ type: 'text', value: 'CMS' }, { type: 'random', value: '' }];
    }
    
    gridContainer.innerHTML = `
        <div class="settings-section">
            <div class="settings-section-header">
                <h3>PO Format Builder</h3>
                <p class="settings-section-description">Build your custom Purchase Order format by combining different components</p>
            </div>
            <div class="po-format-builder">
                <div class="po-format-components" id="poFormatComponents">
                    ${poFormatComponents.map((comp, index) => `
                        <div class="po-component-item" data-index="${index}">
                            <div class="po-component-type-wrapper">
                                <label class="po-component-label">Component ${index + 1}</label>
                                <select class="po-component-type" onchange="updatePOComponent(${index}, 'type', this.value); updatePOFormatPreview();">
                                    <option value="text" ${comp.type === 'text' ? 'selected' : ''}>Text</option>
                                    <option value="random" ${comp.type === 'random' ? 'selected' : ''}>Random Number</option>
                                    <option value="project" ${comp.type === 'project' ? 'selected' : ''}>Project Prefix</option>
                                    <option value="contract" ${comp.type === 'contract' ? 'selected' : ''}>Contract Prefix</option>
                                </select>
                            </div>
                            ${comp.type === 'text' ? `
                                <div class="po-component-value-wrapper">
                                    <label class="po-component-label">Text Value</label>
                                    <input type="text" class="po-component-value" value="${comp.value || ''}" placeholder="Enter text (max 5 chars)" maxlength="5" oninput="updatePOComponent(${index}, 'value', this.value); updatePOFormatPreview();">
                                </div>
                            ` : `
                                <div class="po-component-info">
                                    ${comp.type === 'random' ? 'Generates a random 6-digit number' : comp.type === 'project' ? 'Uses project prefix (max 5 chars)' : 'Uses contract prefix (max 5 chars)'}
                                </div>
                            `}
                            ${poFormatComponents.length > 1 ? `
                                <button class="btn-icon-sm po-component-remove" onclick="removePOComponent(${index})" title="Remove Component">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <line x1="18" y1="6" x2="6" y2="18"/>
                                        <line x1="6" y1="6" x2="18" y2="18"/>
                                    </svg>
                                </button>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
                <button class="btn-secondary btn-sm po-add-component-btn" onclick="addPOComponent()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    Add Component
                </button>
                
                <div class="po-format-preview-section">
                    <div class="po-format-preview">
                        <label class="po-preview-label">Format Preview</label>
                        <div class="po-preview-value" id="poPreview">${generatePOFormatPreview(poFormatComponents)}</div>
                        <div class="po-preview-note">This is how your PO numbers will appear</div>
                    </div>
                </div>
                
                <div class="po-format-help">
                    <h4>Available Components</h4>
                    <div class="po-help-grid">
                        <div class="po-help-item">
                            <div class="po-help-icon">📝</div>
                            <div class="po-help-content">
                                <strong>Text</strong>
                                <p>Static text prefix (max 5 characters)</p>
                            </div>
                        </div>
                        <div class="po-help-item">
                            <div class="po-help-icon">🎲</div>
                            <div class="po-help-content">
                                <strong>Random Number</strong>
                                <p>Generates a unique 6-digit number</p>
                            </div>
                        </div>
                        <div class="po-help-item">
                            <div class="po-help-icon">📁</div>
                            <div class="po-help-content">
                                <strong>Project Prefix</strong>
                                <p>Uses the prefix from selected project</p>
                            </div>
                        </div>
                        <div class="po-help-item">
                            <div class="po-help-icon">📋</div>
                            <div class="po-help-content">
                                <strong>Contract Prefix</strong>
                                <p>Uses the prefix from selected contract</p>
                            </div>
                        </div>
                    </div>
                    <div class="po-format-note">
                        <strong>Note:</strong> When creating a PO in the Procurement app, project and contract prefixes will be automatically inserted based on your selection.
                    </div>
                </div>
                
                <div class="po-format-actions">
                    <button class="btn-primary" onclick="savePOFormat()">Save as New Format</button>
                    <button class="btn-secondary" onclick="testPOGeneration()">Test PO Generation</button>
                </div>
                
                <div class="po-saved-formats-section">
                    <div class="po-saved-formats-header">
                        <h4>Saved Formats</h4>
                        <p class="po-saved-formats-note">AI uses all formats (including inactive ones) to find POs on documents</p>
                    </div>
                    <div class="po-saved-formats-list">
                        ${poFormatTemplates.length === 0 ? `
                            <div class="po-saved-formats-empty">
                                <p>No saved formats yet. Use the builder above to create your first PO format.</p>
                            </div>
                        ` : poFormatTemplates.map(template => `
                            <div class="po-saved-format-item ${template.isActive ? 'active' : ''}">
                                <div class="po-saved-format-main">
                                    <div class="po-saved-format-info">
                                        <div class="po-saved-format-name-row">
                                            <h5>${template.name}</h5>
                                            ${template.isDefault ? '<span class="po-default-badge">Default</span>' : ''}
                                        </div>
                                        <div class="po-saved-format-preview">${generatePOFormatPreview(template.components)}</div>
                                        <div class="po-saved-format-meta">
                                            <span>Created: ${new Date(template.createdAt).toLocaleDateString()}</span>
                                            ${template.lastUsed ? `<span>• Last used: ${new Date(template.lastUsed).toLocaleDateString()}</span>` : ''}
                                        </div>
                                    </div>
                                    <div class="po-saved-format-actions">
                                        <label class="po-active-toggle">
                                            <input type="radio" name="activeFormat" value="${template.id}" ${template.isActive ? 'checked' : ''} onchange="setActivePOFormat('${template.id}')">
                                            <span class="po-active-toggle-label">${template.isActive ? '✓ Current' : 'Set as Current'}</span>
                                        </label>
                                        <button class="btn-icon-sm" onclick="editPOFormat('${template.id}')" title="Load into Builder">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                            </svg>
                                        </button>
                                        ${!template.isDefault ? `
                                            <button class="btn-icon-sm" onclick="deletePOFormat('${template.id}')" title="Delete">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                    <line x1="18" y1="6" x2="6" y2="18"/>
                                                    <line x1="6" y1="6" x2="18" y2="18"/>
                                                </svg>
                                            </button>
                                        ` : ''}
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
        
        <div class="settings-section">
            <h3>Accounting Settings</h3>
            <div class="settings-item">
                <label>Currency</label>
                <select id="currencySelect" onchange="saveSettings()">
                    <option value="GBP" ${APP_CONFIG.currency === 'GBP' ? 'selected' : ''}>GBP (£)</option>
                    <option value="USD" ${APP_CONFIG.currency === 'USD' ? 'selected' : ''}>USD ($)</option>
                    <option value="EUR" ${APP_CONFIG.currency === 'EUR' ? 'selected' : ''}>EUR (€)</option>
                </select>
            </div>
            <div class="settings-item">
                <label>VAT Rate (%)</label>
                <input type="number" id="vatRateInput" value="${APP_CONFIG.vatRate}" step="0.1" onchange="saveSettings()">
            </div>
        </div>
        
        <div class="settings-section">
            <h3>Invoice Settings</h3>
            <div class="settings-item">
                <label>Default Payment Terms (days)</label>
                <input type="number" id="paymentTermsInput" value="30" onchange="saveSettings()">
            </div>
            <div class="settings-item">
                <label>Auto-pair Invoices</label>
                <label class="switch">
                    <input type="checkbox" id="autoPairInvoices" onchange="saveSettings()">
                    <span class="slider"></span>
                </label>
            </div>
        </div>
    `;
    
    // Add event listeners for component changes
    updatePOFormatPreview();
}

// PO Format Templates (global state)
let poFormatTemplates = [];

// PO Format Components (current editing state)
let poFormatComponents = [];

// Initialize PO formats
function initializePOFormats() {
    poFormatTemplates = JSON.parse(localStorage.getItem('poFormatTemplates')) || [
        {
            id: 'default-cms',
            name: 'CMS Standard',
            components: [{ type: 'text', value: 'CMS' }, { type: 'random', value: '' }],
            isActive: true,
            createdAt: new Date().toISOString(),
            isDefault: true
        }
    ];
    
    // Ensure at least one is active
    const hasActive = poFormatTemplates.some(t => t.isActive);
    if (!hasActive && poFormatTemplates.length > 0) {
        poFormatTemplates[0].isActive = true;
    }
    
    // Load active format components for editing
    const activeFormat = getActivePOFormat();
    poFormatComponents = activeFormat ? [...activeFormat.components] : [{ type: 'text', value: 'CMS' }, { type: 'random', value: '' }];
}

// Get current active format
function getActivePOFormat() {
    if (!poFormatTemplates || poFormatTemplates.length === 0) {
        return null;
    }
    return poFormatTemplates.find(t => t.isActive) || poFormatTemplates[0];
}

function addPOComponent() {
    poFormatComponents.push({ type: 'text', value: '' });
    renderSettings();
}

function removePOComponent(index) {
    poFormatComponents.splice(index, 1);
    renderSettings();
}

function updatePOComponent(index, field, value) {
    if (poFormatComponents[index]) {
        poFormatComponents[index][field] = value;
        if (field === 'type' && value !== 'text') {
            poFormatComponents[index].value = '';
        }
        // If changing type, need to re-render to show/hide text input
        if (field === 'type') {
            renderSettings();
        } else {
            // Just update preview for value changes
            updatePOFormatPreview();
        }
    }
}

function updatePOFormatPreview() {
    const preview = document.getElementById('poPreview');
    if (preview) {
        preview.textContent = generatePOFormatPreview(poFormatComponents);
    }
}

function generatePOFormatPreview(components, projectPrefix = 'RT', contractPrefix = 'SS') {
    if (!components || components.length === 0) {
        return 'No format defined';
    }
    
    const randomNum = Math.floor(Math.random() * 1000000);
    
    return components.map(comp => {
        switch(comp.type) {
            case 'text':
                return comp.value || '';
            case 'random':
                return String(randomNum).padStart(6, '0');
            case 'project':
                return projectPrefix || '[PROJ]';
            case 'contract':
                return contractPrefix || '[CONT]';
            default:
                return '';
        }
    }).join('');
}

// Generate actual PO number based on format and selected project/contract
function generatePONumber(projectPrefix = null, contractPrefix = null) {
    // Get active format
    const activeFormat = getActivePOFormat();
    const components = activeFormat ? activeFormat.components : [{ type: 'text', value: 'CMS' }, { type: 'random', value: '' }];
    
    if (!components || components.length === 0) {
        // Fallback to default format
        const randomNum = Math.floor(Math.random() * 1000000);
        return `CMS${String(randomNum).padStart(6, '0')}`;
    }
    
    const randomNum = Math.floor(Math.random() * 1000000);
    
    // Update last used timestamp
    if (activeFormat) {
        activeFormat.lastUsed = new Date().toISOString();
        localStorage.setItem('poFormatTemplates', JSON.stringify(poFormatTemplates));
    }
    
    return components.map(comp => {
        switch(comp.type) {
            case 'text':
                return comp.value || '';
            case 'random':
                return String(randomNum).padStart(6, '0');
            case 'project':
                return projectPrefix || '';
            case 'contract':
                return contractPrefix || '';
            default:
                return '';
        }
    }).join('');
}

function testPOGeneration() {
    // Simulate different scenarios
    const testCases = [
        { project: 'RT', contract: 'SS', label: 'Riverside Tower - Structural Steelwork' },
        { project: 'MS', contract: 'ME', label: 'Metro Shopping - Mechanical & Electrical' },
        { project: 'HV', contract: 'FC', label: 'Harbour View - Facade & Cladding' }
    ];
    
    // Create test results modal
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closePOTestModal()"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h2>PO Generation Test</h2>
                <button class="modal-close" onclick="closePOTestModal()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                </button>
            </div>
            <div class="modal-body">
                <p style="margin-bottom: 16px; color: var(--text-secondary);">Testing PO generation with different project and contract combinations:</p>
                <div class="po-test-results">
                    ${testCases.map(test => {
                        const poNumber = generatePONumber(test.project, test.contract);
                        return `
                            <div class="po-test-item">
                                <div class="po-test-label">${test.label}</div>
                                <div class="po-test-value">${poNumber}</div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        </div>
    `;
    modal.id = 'poTestModal';
    document.body.appendChild(modal);
}

function closePOTestModal() {
    const modal = document.getElementById('poTestModal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    }
}

function savePOFormat() {
    // Open modal to name the new format
    openNewPOFormatModal(true);
}

function openNewPOFormatModal(isSaving = false) {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'newPOFormatModal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeNewPOFormatModal()"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h2>${isSaving ? 'Save New PO Format' : 'Create New PO Format'}</h2>
                <button class="modal-close" onclick="closeNewPOFormatModal()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                </button>
            </div>
            <div class="modal-body">
                <form onsubmit="submitNewPOFormat(event, ${isSaving})">
                    <div class="form-group">
                        <label for="poFormatName">Format Name *</label>
                        <input type="text" id="poFormatName" required placeholder="e.g., CMS Standard, Project Based" maxlength="50">
                    </div>
                    ${isSaving ? `
                        <div class="form-group">
                            <label>
                                <input type="checkbox" id="setAsActive" checked>
                                Set as active format
                            </label>
                        </div>
                    ` : ''}
                    <div class="form-actions">
                        <button type="button" class="btn-secondary" onclick="closeNewPOFormatModal()">Cancel</button>
                        <button type="submit" class="btn-primary">${isSaving ? 'Save Format' : 'Create Format'}</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function closeNewPOFormatModal() {
    const modal = document.getElementById('newPOFormatModal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    }
}

function submitNewPOFormat(event, isSaving) {
    event.preventDefault();
    
    const name = document.getElementById('poFormatName').value.trim();
    if (!name) {
        showToast('error', 'Error', 'Please enter a format name');
        return;
    }
    
    const setAsActive = document.getElementById('setAsActive')?.checked || false;
    
    // If saving current format, use current components
    const components = isSaving ? poFormatComponents : [{ type: 'text', value: 'CMS' }, { type: 'random', value: '' }];
    
    // If setting as active, deactivate all others
    if (setAsActive) {
        poFormatTemplates.forEach(t => t.isActive = false);
    }
    
    const newTemplate = {
        id: 'format-' + Date.now(),
        name: name,
        components: JSON.parse(JSON.stringify(components)), // Deep copy
        isActive: setAsActive,
        createdAt: new Date().toISOString(),
        isDefault: false
    };
    
    poFormatTemplates.push(newTemplate);
    localStorage.setItem('poFormatTemplates', JSON.stringify(poFormatTemplates));
    
    closeNewPOFormatModal();
    renderSettings();
    showToast('success', 'Saved', `PO format "${name}" saved successfully`);
}

function updateCurrentPOFormat() {
    const activeFormat = getActivePOFormat();
    if (!activeFormat) {
        showToast('error', 'Error', 'No active format found');
        return;
    }
    
    if (activeFormat.isDefault) {
        // Can't update default, need to create new one
        if (confirm('The default format cannot be modified. Would you like to save the current format as a new format?')) {
            savePOFormat();
        }
        return;
    }
    
    // Update the active format
    activeFormat.components = JSON.parse(JSON.stringify(poFormatComponents));
    activeFormat.lastModified = new Date().toISOString();
    
    localStorage.setItem('poFormatTemplates', JSON.stringify(poFormatTemplates));
    renderSettings();
    showToast('success', 'Updated', 'Current PO format updated successfully');
}

function setActivePOFormat(templateId) {
    // Deactivate all
    poFormatTemplates.forEach(t => t.isActive = false);
    
    // Activate selected
    const template = poFormatTemplates.find(t => t.id === templateId);
    if (template) {
        template.isActive = true;
        template.lastUsed = new Date().toISOString();
        localStorage.setItem('poFormatTemplates', JSON.stringify(poFormatTemplates));
        renderSettings();
        showToast('success', 'Saved', `"${template.name}" is now the current format`);
    }
}

function editPOFormat(templateId) {
    const template = poFormatTemplates.find(t => t.id === templateId);
    if (!template) return;
    
    // Load template components for editing
    poFormatComponents = JSON.parse(JSON.stringify(template.components));
    
    // Re-render settings to show the format in the builder
    renderSettings();
    
    // Scroll to builder section
    setTimeout(() => {
        const builderSection = document.querySelector('.po-format-builder');
        if (builderSection) {
            builderSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, 100);
    
    showToast('info', 'Editing', `Editing format "${template.name}". Make changes and click "Update Current Format" or "Save as New Format".`);
}

function deletePOFormat(templateId) {
    const template = poFormatTemplates.find(t => t.id === templateId);
    if (!template) return;
    
    if (template.isDefault) {
        showToast('error', 'Cannot Delete', 'Default format cannot be deleted');
        return;
    }
    
    if (template.isActive) {
        showToast('error', 'Cannot Delete', 'Cannot delete the active format. Please set another format as active first.');
        return;
    }
    
    if (confirm(`Are you sure you want to delete "${template.name}"? This format will no longer be used by AI for matching.`)) {
        poFormatTemplates = poFormatTemplates.filter(t => t.id !== templateId);
        localStorage.setItem('poFormatTemplates', JSON.stringify(poFormatTemplates));
        renderSettings();
        showToast('success', 'Deleted', `Format "${template.name}" has been deleted`);
    }
}

// Get all PO formats for AI matching (including old ones)
function getAllPOFormats() {
    return poFormatTemplates.map(t => ({
        id: t.id,
        name: t.name,
        components: t.components,
        pattern: generatePOPattern(t.components)
    }));
}

// Generate a regex pattern for AI matching
function generatePOPattern(components) {
    // This creates a pattern that AI can use to match POs in documents
    const parts = components.map(comp => {
        switch(comp.type) {
            case 'text':
                return comp.value || '';
            case 'random':
                return '\\d{6}'; // 6 digits
            case 'project':
                return '[A-Z0-9]{1,5}'; // 1-5 alphanumeric (project prefix)
            case 'contract':
                return '[A-Z0-9]{1,5}'; // 1-5 alphanumeric (contract prefix)
            default:
                return '';
        }
    });
    return parts.join('');
}

function saveSettings() {
    // Save all settings
    const currency = document.getElementById('currencySelect')?.value;
    const vatRate = document.getElementById('vatRateInput')?.value;
    const paymentTerms = document.getElementById('paymentTermsInput')?.value;
    const autoPair = document.getElementById('autoPairInvoices')?.checked;
    
    if (currency) localStorage.setItem('currency', currency);
    if (vatRate) localStorage.setItem('vatRate', vatRate);
    if (paymentTerms) localStorage.setItem('paymentTerms', paymentTerms);
    if (autoPair !== undefined) localStorage.setItem('autoPairInvoices', autoPair);
    
    showToast('success', 'Saved', 'Settings saved successfully');
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function showToast(type, title, message, duration = 3000) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (container.contains(toast)) {
                container.removeChild(toast);
            }
        }, 300);
    }, duration);
}

// Highlight matching amounts between transactions and items
function highlightMatchingAmounts() {
    const transactions = document.querySelectorAll('.reconciliation-transaction-item:not(.paired)');
    const items = document.querySelectorAll('.reconciliation-item');
    
    transactions.forEach(transaction => {
        const transactionAmount = parseFloat(transaction.dataset.amount);
        transaction.classList.remove('matching');
        
        items.forEach(item => {
            const itemAmount = parseFloat(item.dataset.amount);
            const difference = Math.abs(transactionAmount - itemAmount);
            
            // Highlight if amounts match within 0.01 (for rounding differences)
            if (difference < 0.01) {
                transaction.classList.add('matching');
                item.classList.add('matching');
            }
        });
    });
}

// Select transaction for pairing
function selectTransactionForPairing(transactionId) {
    const transaction = bankTransactions.find(t => t.id === transactionId);
    if (!transaction || transaction.paired) return;
    
    // Remove previous selections
    document.querySelectorAll('.reconciliation-transaction-item.selected').forEach(el => {
        el.classList.remove('selected');
    });
    document.querySelectorAll('.reconciliation-item.selected').forEach(el => {
        el.classList.remove('selected');
    });
    
    // Highlight selected transaction
    const transactionEl = document.querySelector(`[data-transaction-id="${transactionId}"]`);
    if (transactionEl) {
        transactionEl.classList.add('selected');
    }
    
    // Highlight matching items
    const amount = Math.abs(transaction.amount);
    document.querySelectorAll('.reconciliation-item').forEach(item => {
        const itemAmount = parseFloat(item.dataset.amount);
        if (Math.abs(amount - itemAmount) < 0.01) {
            item.classList.add('matching');
        }
    });
}

// Select item for pairing
function selectItemForPairing(itemType, itemId) {
    // Remove previous selections
    document.querySelectorAll('.reconciliation-transaction-item.selected').forEach(el => {
        el.classList.remove('selected');
    });
    document.querySelectorAll('.reconciliation-item.selected').forEach(el => {
        el.classList.remove('selected');
    });
    
    // Highlight selected item
    const itemEl = document.querySelector(`[data-${itemType}-id="${itemId}"]`);
    if (itemEl) {
        itemEl.classList.add('selected');
        
        // Highlight matching transactions
        const amount = parseFloat(itemEl.dataset.amount);
        document.querySelectorAll('.reconciliation-transaction-item:not(.paired)').forEach(transaction => {
            const transactionAmount = parseFloat(transaction.dataset.amount);
            if (Math.abs(amount - transactionAmount) < 0.01) {
                transaction.classList.add('matching');
            }
        });
    }
}

// Show pairing options modal with suggestions
function showPairingOptions(transactionId) {
    const transaction = bankTransactions.find(t => t.id === transactionId);
    if (!transaction || transaction.paired) return;
    
    const amount = Math.abs(transaction.amount);
    const transactionDate = new Date(transaction.date);
    const matchingItems = [];
    
    // Get all checked types
    const checkedTypes = Array.from(document.querySelectorAll('input[name="reconciliationType"]:checked'))
        .map(cb => cb.value);
    
    // Find matching items with confidence scores
    checkedTypes.forEach(type => {
        let items = [];
        if (type === 'invoices') {
            items = invoices.filter(i => !i.paired).map(inv => {
                const amountDiff = Math.abs(inv.amount - amount);
                const dateDiff = Math.abs(new Date(inv.date) - transactionDate);
                const daysDiff = dateDiff / (24 * 60 * 60 * 1000);
                
                let confidence = 0;
                if (amountDiff < 0.01) confidence += 50; // Exact amount match
                else if (amountDiff < 1) confidence += 30; // Very close
                else if (amountDiff < 10) confidence += 15; // Close
                
                if (daysDiff < 1) confidence += 30; // Same day
                else if (daysDiff < 7) confidence += 20; // Within week
                else if (daysDiff < 30) confidence += 10; // Within month
                
                if (transaction.type === 'debit') confidence += 10; // Correct transaction type
                
                return { type: 'invoice', ...inv, confidence, amountDiff, daysDiff };
            });
        }
        if (type === 'expenses') {
            items = expenses.filter(e => !e.paired).map(exp => {
                const amountDiff = Math.abs(exp.amount - amount);
                const dateDiff = Math.abs(new Date(exp.date) - transactionDate);
                const daysDiff = dateDiff / (24 * 60 * 60 * 1000);
                
                let confidence = 0;
                if (amountDiff < 0.01) confidence += 50;
                else if (amountDiff < 1) confidence += 30;
                else if (amountDiff < 10) confidence += 15;
                
                if (daysDiff < 1) confidence += 30;
                else if (daysDiff < 7) confidence += 20;
                else if (daysDiff < 30) confidence += 10;
                
                if (transaction.type === 'debit') confidence += 10;
                
                return { type: 'expense', ...exp, confidence, amountDiff, daysDiff };
            });
        }
        if (type === 'subscriptions') {
            items = subscriptions.filter(s => !s.paired).map(sub => {
                const amountDiff = Math.abs(sub.amount - amount);
                const dateDiff = Math.abs(new Date(sub.nextPayment || sub.startDate) - transactionDate);
                const daysDiff = dateDiff / (24 * 60 * 60 * 1000);
                
                let confidence = 0;
                if (amountDiff < 0.01) confidence += 50;
                else if (amountDiff < 1) confidence += 30;
                
                if (daysDiff < 7) confidence += 30; // Subscriptions are usually on time
                else if (daysDiff < 14) confidence += 20;
                
                if (transaction.type === 'debit') confidence += 10;
                
                return { type: 'subscription', ...sub, confidence, amountDiff, daysDiff };
            });
        }
        if (type === 'credits') {
            items = credits.filter(c => !c.paired).map(cred => {
                const amountDiff = Math.abs(cred.amount - amount);
                const dateDiff = Math.abs(new Date(cred.date) - transactionDate);
                const daysDiff = dateDiff / (24 * 60 * 60 * 1000);
                
                let confidence = 0;
                if (amountDiff < 0.01) confidence += 50;
                else if (amountDiff < 1) confidence += 30;
                
                if (daysDiff < 7) confidence += 30;
                else if (daysDiff < 30) confidence += 15;
                
                if (transaction.type === 'credit') confidence += 20; // Credits are usually credit transactions
                
                return { type: 'credit', ...cred, confidence, amountDiff, daysDiff };
            });
        }
        if (type === 'cash') {
            items = cashTransactions.filter(c => !c.pairedWithTransaction).map(cash => {
                const amountDiff = Math.abs(cash.amount - amount);
                const dateDiff = Math.abs(new Date(cash.date) - transactionDate);
                const daysDiff = dateDiff / (24 * 60 * 60 * 1000);
                
                let confidence = 0;
                if (amountDiff < 0.01) confidence += 50;
                else if (amountDiff < 1) confidence += 30;
                
                if (daysDiff < 1) confidence += 30;
                else if (daysDiff < 7) confidence += 20;
                
                const typeMatch = (cash.type === 'in' && transaction.type === 'credit') || 
                                (cash.type === 'out' && transaction.type === 'debit');
                if (typeMatch) confidence += 20;
                
                return { type: 'cash', ...cash, confidence, amountDiff, daysDiff };
            });
        }
        
        matchingItems.push(...items);
    });
    
    // Sort by confidence (highest first)
    matchingItems.sort((a, b) => b.confidence - a.confidence);
    
    // Show modal with suggestions
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'pairingOptionsModal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closePairingOptionsModal()"></div>
        <div class="modal-content modal-large">
            <div class="modal-header">
                <h2>Pair Transaction</h2>
                <button class="modal-close" onclick="closePairingOptionsModal()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                </button>
            </div>
            <div class="modal-body">
                <div class="pairing-transaction-info">
                    <h3>Bank Transaction</h3>
                    <div class="pairing-info-grid">
                        <div><strong>Date:</strong> ${new Date(transaction.date).toLocaleDateString('en-GB')}</div>
                        <div><strong>Description:</strong> ${transaction.description || 'N/A'}</div>
                        <div><strong>Reference:</strong> ${transaction.reference || 'N/A'}</div>
                        <div><strong>Amount:</strong> ${APP_CONFIG.currencySymbol}${amount.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</div>
                        <div><strong>Type:</strong> ${transaction.type === 'credit' ? 'Credit' : 'Debit'}</div>
                    </div>
                </div>
                
                <div class="pairing-suggestions">
                    <h3>Suggested Matches</h3>
                    ${matchingItems.length > 0 ? `
                        <div class="suggestions-list">
                            ${matchingItems.slice(0, 10).map(item => {
                                const confidenceColor = item.confidence >= 70 ? 'success' : item.confidence >= 50 ? 'warning' : 'danger';
                                return `
                                    <div class="suggestion-item" onclick="pairItemWithTransaction('${item.type}', '${item.id}', '${transactionId}'); closePairingOptionsModal();">
                                        <div class="suggestion-header">
                                            <span class="item-type-badge ${item.type}">${item.type}</span>
                                            <span class="confidence-badge ${confidenceColor}">${item.confidence}% match</span>
                                        </div>
                                        <div class="suggestion-details">
                                            <div><strong>${item.number || item.name || item.id || item.description}</strong></div>
                                            <div>Date: ${new Date(item.date).toLocaleDateString('en-GB')} (${Math.round(item.daysDiff)} days ${item.daysDiff > 0 ? 'after' : 'before'})</div>
                                            <div>Amount: ${APP_CONFIG.currencySymbol}${item.amount.toLocaleString('en-GB', { minimumFractionDigits: 2 })} 
                                                ${item.amountDiff > 0.01 ? `<span class="amount-diff">(${item.amountDiff > 0 ? '+' : ''}${APP_CONFIG.currencySymbol}${item.amountDiff.toFixed(2)})</span>` : ''}
                                            </div>
                                            ${item.supplier ? `<div>Supplier: ${item.supplier}</div>` : ''}
                                        </div>
                                        <button class="btn-primary btn-sm">Pair</button>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    ` : `
                        <div class="pairing-empty">
                            <p>No matching items found. You can pair manually by selecting an item from the right column.</p>
                        </div>
                    `}
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary" onclick="closePairingOptionsModal()">Cancel</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function closePairingOptionsModal() {
    const modal = document.getElementById('pairingOptionsModal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    }
}

// Pair item with transaction
function pairItemWithTransaction(itemType, itemId, transactionId = null) {
    // If transactionId not provided, find matching transaction
    if (!transactionId) {
        const itemEl = document.querySelector(`[data-${itemType}-id="${itemId}"]`);
        if (!itemEl) return;
        
        const amount = parseFloat(itemEl.dataset.amount);
        const matchingTransaction = bankTransactions.find(t => 
            !t.paired && Math.abs(Math.abs(t.amount) - amount) < 0.01
        );
        
        if (!matchingTransaction) {
            showToast('info', 'No Match', 'No matching bank transaction found. Please select one manually.');
            return;
        }
        
        transactionId = matchingTransaction.id;
    }
    
    const transaction = bankTransactions.find(t => t.id === transactionId);
    if (!transaction || transaction.paired) return;
    
    // Pair based on item type
    if (itemType === 'invoice') {
        pairInvoice(itemId, transactionId);
    } else if (itemType === 'expense') {
        pairExpense(itemId, transactionId);
    } else if (itemType === 'subscription') {
        pairSubscription(itemId, transactionId);
    } else if (itemType === 'credit') {
        pairCredit(itemId, transactionId);
    } else if (itemType === 'rebate') {
        pairRebate(itemId, transactionId);
    } else if (itemType === 'cash') {
        pairBankTransactionWithCash(transactionId, itemId);
    }
}

// Make functions globally accessible
// Don't override switchView - it's already defined inline in HTML
if (!window.switchView) {
    window.switchView = switchView;
}
window.openUploadInvoiceModal = openUploadInvoiceModal;
window.closeUploadInvoiceModal = closeUploadInvoiceModal;
window.openViewInvoiceModal = openViewInvoiceModal;
window.closeViewInvoiceModal = closeViewInvoiceModal;
window.openExpenseRequestModal = openExpenseRequestModal;
window.closeExpenseRequestModal = closeExpenseRequestModal;
window.filterInvoices = filterInvoices;
window.pairExpense = pairExpense;
window.pairSubscription = pairSubscription;
window.pairCredit = pairCredit;
window.pairRebate = pairRebate;
window.handleBankStatementUpload = handleBankStatementUpload;
window.processReconciliation = processReconciliation;
window.pairInvoice = pairInvoice;
window.editInvoice = editInvoice;
window.approveExpenseRequest = approveExpenseRequest;
window.rejectExpenseRequest = rejectExpenseRequest;
window.renderExpenses = renderExpenses;
window.filterExpenses = filterExpenses;
window.groupExpenses = groupExpenses;
window.toggleExpenseSelection = toggleExpenseSelection;
window.selectAllExpenses = selectAllExpenses;
window.bulkApproveExpenses = bulkApproveExpenses;
window.markExpenseForReconciliation = markExpenseForReconciliation;
window.viewExpenseDetails = viewExpenseDetails;
window.filterExpenseSection = filterExpenseSection;
window.approveExpense = approveExpense;
window.rejectExpense = rejectExpense;
window.addSuggestedSubscription = addSuggestedSubscription;
window.dismissSuggestion = dismissSuggestion;
window.openAddSubscriptionModal = openAddSubscriptionModal;
window.closeAddSubscriptionModal = closeAddSubscriptionModal;
window.submitSubscription = submitSubscription;
window.viewSubscriptionDetails = viewSubscriptionDetails;
window.closeSubscriptionDetailsModal = closeSubscriptionDetailsModal;
window.viewSubscriptionInvoice = viewSubscriptionInvoice;
window.editSubscription = editSubscription;
window.filterSubscriptions = filterSubscriptions;
window.viewInvoiceById = viewInvoiceById;
window.viewReceipt = viewReceipt;
window.generateReport = generateReport;
window.exportReport = exportReport;
window.savePOFormat = savePOFormat;
window.saveSettings = saveSettings;
window.addPOComponent = addPOComponent;
window.removePOComponent = removePOComponent;
window.updatePOComponent = updatePOComponent;
window.filterCashTransactions = filterCashTransactions;
window.toggleAllInvoices = toggleAllInvoices;
window.updateInvoiceSelection = updateInvoiceSelection;
window.clearInvoiceSelection = clearInvoiceSelection;
window.bulkMarkInvoicesPaid = bulkMarkInvoicesPaid;
window.bulkExportInvoices = bulkExportInvoices;
window.bulkDeleteInvoices = bulkDeleteInvoices;
window.markInvoicePaid = markInvoicePaid;
window.applyCredit = applyCredit;
window.viewCredit = viewCredit;
window.filterCredits = filterCredits;
window.markCreditProcessed = markCreditProcessed;
window.closeViewCreditModal = closeViewCreditModal;
window.toggleAllCredits = toggleAllCredits;
window.updateCreditSelection = updateCreditSelection;
window.renderCredits = renderCredits;
window.generatePONumber = generatePONumber;
window.testPOGeneration = testPOGeneration;
window.closePOTestModal = closePOTestModal;
window.openNewPOFormatModal = openNewPOFormatModal;
window.closeNewPOFormatModal = closeNewPOFormatModal;
window.submitNewPOFormat = submitNewPOFormat;
window.setActivePOFormat = setActivePOFormat;
window.editPOFormat = editPOFormat;
window.deletePOFormat = deletePOFormat;
window.updateCurrentPOFormat = updateCurrentPOFormat;
window.getAllPOFormats = getAllPOFormats;
window.highlightMatchingAmounts = highlightMatchingAmounts;
window.selectTransactionForPairing = selectTransactionForPairing;
window.selectItemForPairing = selectItemForPairing;
window.renderReconciliation = renderReconciliation;
window.renderReconciliationSummary = renderReconciliationSummary;
window.renderBankTransactions = renderBankTransactions;
window.updateReconciliationItems = updateReconciliationItems;
window.pairItemWithTransaction = pairItemWithTransaction;
window.filterBankTransactions = filterBankTransactions;
window.autoMatchTransactions = autoMatchTransactions;
window.setReconciliationFilter = setReconciliationFilter;
window.applyReconciliationFilters = applyReconciliationFilters;
window.unpairTransaction = unpairTransaction;
window.exportReconciliationReport = exportReconciliationReport;
window.findMatchingItems = findMatchingItems;
window.pairTransactionWithInvoice = pairTransactionWithInvoice;
window.pairInvoice = pairInvoice;
window.handleInvoiceFileUpload = handleInvoiceFileUpload;
window.openViewInvoicePDF = openViewInvoicePDF;
window.closeViewInvoicePDFModal = closeViewInvoicePDFModal;
window.downloadInvoicePDF = downloadInvoicePDF;
window.showReconciliationResults = showReconciliationResults;
window.closeReconciliationResultsModal = closeReconciliationResultsModal;
window.submitInvoiceUpload = submitInvoiceUpload;
window.handleExpenseReceiptUpload = handleExpenseReceiptUpload;
window.submitExpenseRequest = submitExpenseRequest;
window.openRebateAgreementModal = openRebateAgreementModal;

// Export cash transaction functions immediately (before DOMContentLoaded)
// Note: openCashTransactionModal is already defined at the top of the file (line 19)
// so it's already available. Just export the other functions.
console.log('Cash transaction functions being exported');
console.log('openCashTransactionModal type:', typeof window.openCashTransactionModal);

// Make sure all functions are available
if (typeof closeCashTransactionModal === 'function') {
    window.closeCashTransactionModal = closeCashTransactionModal;
}
if (typeof submitCashTransaction === 'function') {
    window.submitCashTransaction = submitCashTransaction;
}
if (typeof editCashTransaction === 'function') {
    window.editCashTransaction = editCashTransaction;
}
if (typeof deleteCashTransaction === 'function') {
    window.deleteCashTransaction = deleteCashTransaction;
}
// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('DOMContentLoaded - calling initializeApp');
        if (typeof initializeApp === 'function') {
            initializeApp();
        } else {
            console.error('initializeApp function not found');
        }
    });
} else {
    // DOM already loaded
    console.log('DOM already loaded - calling initializeApp immediately');
    if (typeof initializeApp === 'function') {
        initializeApp();
    } else {
        console.error('initializeApp function not found');
    }
}

// Also make renderReconciliation available immediately for testing
console.log('renderReconciliation available:', typeof renderReconciliation === 'function');
console.log('window.renderReconciliation available:', typeof window.renderReconciliation === 'function');
if (typeof pairCashWithTransaction === 'function') {
    window.pairCashWithTransaction = pairCashWithTransaction;
}
if (typeof pairBankTransactionWithCash === 'function') {
    window.pairBankTransactionWithCash = pairBankTransactionWithCash;
}

// Test that function is available
console.log('=== FINAL CHECK: openCashTransactionModal ===');
console.log('Type:', typeof window.openCashTransactionModal);
console.log('Available:', typeof window.openCashTransactionModal === 'function');
if (typeof window.openCashTransactionModal !== 'function') {
    console.error('ERROR: openCashTransactionModal is not a function!', window.openCashTransactionModal);
    // Try to reassign it
    if (typeof openCashTransactionModal === 'function') {
        window.openCashTransactionModal = openCashTransactionModal;
        console.log('Reassigned from local function');
    }
} else {
    console.log('SUCCESS: openCashTransactionModal is available as a function');
}

// Also make it available without window prefix in global scope
if (typeof openCashTransactionModal === 'undefined' && typeof window.openCashTransactionModal === 'function') {
    // Create a global reference
    try {
        this.openCashTransactionModal = window.openCashTransactionModal;
        console.log('Created global reference');
    } catch(e) {
        console.log('Could not create global reference:', e);
    }
}

// Final verification
setTimeout(function() {
    console.log('=== VERIFICATION AFTER 1 SECOND ===');
    console.log('window.openCashTransactionModal type:', typeof window.openCashTransactionModal);
    if (typeof window.openCashTransactionModal !== 'function') {
        console.error('FUNCTION LOST! Reassigning...');
        window.openCashTransactionModal = function(transactionId) {
            alert('Function called from reassignment');
            // Call the original if it exists
            if (window._openCashTransactionModalOriginal) {
                return window._openCashTransactionModalOriginal(transactionId);
            }
        };
    }
}, 1000);

// Initialize on load
document.addEventListener('DOMContentLoaded', initializeApp);

