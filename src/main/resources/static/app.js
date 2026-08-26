document.addEventListener("DOMContentLoaded", () => {
    loadBatches();
});

const API_BASE = '/api/batches';

async function loadBatches() {
    try {
        const response = await fetch(API_BASE);
        const batches = await response.json();
        renderTable(batches);
        updateDashboard(batches);
    } catch (error) {
        console.error('Error loading batches:', error);
    }
}

async function searchBatches() {
    const keyword = document.getElementById('searchInput').value.trim();
    if (!keyword) {
        loadBatches();
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/search?keyword=${encodeURIComponent(keyword)}`);
        const batches = await response.json();
        renderTable(batches);
    } catch (error) {
        console.error('Error searching batches:', error);
    }
}

async function createBatch() {
    const productName = document.getElementById('productName').value;
    const quantity = document.getElementById('quantity').value;

    if (!productName || !quantity) return;

    const batchData = {
        productName: productName,
        quantity: parseInt(quantity)
    };

    try {
        const response = await fetch(API_BASE, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(batchData)
        });

        if (response.ok) {
            document.getElementById('createBatchForm').reset();
            const modal = bootstrap.Modal.getInstance(document.getElementById('createBatchModal'));
            modal.hide();
            loadBatches();
        }
    } catch (error) {
        console.error('Error creating batch:', error);
    }
}

async function updateStatus(id, status) {
    try {
        const response = await fetch(`${API_BASE}/${id}/status?status=${encodeURIComponent(status)}`, {
            method: 'PUT'
        });
        
        if (response.ok) {
            loadBatches();
        }
    } catch (error) {
        console.error('Error updating status:', error);
    }
}

function renderTable(batches) {
    const tbody = document.getElementById('batches-tbody');
    tbody.innerHTML = '';

    if (batches.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No batches found</td></tr>';
        return;
    }

    batches.forEach(batch => {
        const badgeClass = getStatusBadge(batch.status);
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td><small class="text-muted">${batch.id}</small></td>
            <td class="fw-bold">${batch.productName}</td>
            <td>${batch.quantity}</td>
            <td><span class="badge ${badgeClass}">${batch.status}</span></td>
            <td>
                <div class="dropdown">
                    <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                        Update Status
                    </button>
                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="#" onclick="updateStatus('${batch.id}', 'CREATED')">Created</a></li>
                        <li><a class="dropdown-item" href="#" onclick="updateStatus('${batch.id}', 'IN_PRODUCTION')">In Production</a></li>
                        <li><a class="dropdown-item" href="#" onclick="updateStatus('${batch.id}', 'QA_REVIEW')">QA Review</a></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item text-success" href="#" onclick="updateStatus('${batch.id}', 'APPROVED')">Approved</a></li>
                        <li><a class="dropdown-item text-danger" href="#" onclick="updateStatus('${batch.id}', 'REJECTED')">Rejected</a></li>
                    </ul>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function updateDashboard(batches) {
    let totals = { total: 0, production: 0, qa: 0, approved: 0 };
    
    batches.forEach(batch => {
        totals.total++;
        if (batch.status === 'IN_PRODUCTION') totals.production++;
        else if (batch.status === 'QA_REVIEW') totals.qa++;
        else if (batch.status === 'APPROVED') totals.approved++;
    });

    document.getElementById('total-count').innerText = totals.total;
    document.getElementById('production-count').innerText = totals.production;
    document.getElementById('qa-count').innerText = totals.qa;
    document.getElementById('approved-count').innerText = totals.approved;
}

function getStatusBadge(status) {
    switch (status) {
        case 'CREATED': return 'bg-secondary';
        case 'IN_PRODUCTION': return 'bg-warning text-dark';
        case 'QA_REVIEW': return 'bg-info text-dark';
        case 'APPROVED': return 'bg-success';
        case 'REJECTED': return 'bg-danger';
        default: return 'bg-secondary';
    }
}
