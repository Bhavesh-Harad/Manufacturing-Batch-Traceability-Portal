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
            <td>
                <a href="#" class="text-primary text-decoration-none fw-bold" onclick="viewAuditLog('${batch.id}')">
                    <i class="fas fa-qrcode me-1"></i>${batch.id}
                </a>
            </td>
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

let statusChartInstance = null;

function updateDashboard(batches) {
    let totals = { created: 0, production: 0, qa: 0, approved: 0, rejected: 0 };
    
    batches.forEach(batch => {
        if (batch.status === 'CREATED') totals.created++;
        else if (batch.status === 'IN_PRODUCTION') totals.production++;
        else if (batch.status === 'QA_REVIEW') totals.qa++;
        else if (batch.status === 'APPROVED') totals.approved++;
        else if (batch.status === 'REJECTED') totals.rejected++;
    });

    document.getElementById('total-count').innerText = batches.length;
    document.getElementById('production-count').innerText = totals.production;
    document.getElementById('qa-count').innerText = totals.qa;
    document.getElementById('approved-count').innerText = totals.approved;

    renderChart(totals);
}

function renderChart(totals) {
    const ctx = document.getElementById('statusChart').getContext('2d');
    
    if (statusChartInstance) {
        statusChartInstance.destroy();
    }

    statusChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Created', 'In Production', 'QA Review', 'Approved', 'Rejected'],
            datasets: [{
                data: [totals.created, totals.production, totals.qa, totals.approved, totals.rejected],
                backgroundColor: ['#6c757d', '#ffc107', '#0dcaf0', '#198754', '#dc3545']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'right' }
            }
        }
    });
}

async function viewAuditLog(id) {
    try {
        const response = await fetch(`${API_BASE}/${id}`);
        const batch = await response.json();
        
        document.getElementById('auditBatchTitle').innerText = `Batch ID: ${batch.id} - ${batch.productName}`;
        
        const timeline = document.getElementById('auditTimeline');
        timeline.innerHTML = '';
        
        if (batch.auditLogs && batch.auditLogs.length > 0) {
            batch.auditLogs.forEach(log => {
                timeline.innerHTML += `
                    <div class="mb-3 position-relative">
                        <i class="fas fa-circle text-primary position-absolute" style="left: -21px; top: 4px; background: white;"></i>
                        <p class="mb-0 text-muted small">${log}</p>
                    </div>
                `;
            });
        } else {
            timeline.innerHTML = '<p class="text-muted">No audit logs found.</p>';
        }
        
        const modal = new bootstrap.Modal(document.getElementById('auditLogModal'));
        modal.show();
    } catch (error) {
        console.error('Error fetching audit log:', error);
    }
}

function exportToCSV() {
    fetch(API_BASE)
        .then(res => res.json())
        .then(batches => {
            if (batches.length === 0) return alert('No data to export!');
            
            let csvContent = "Batch ID,Product Name,Quantity,Status\n";
            
            batches.forEach(b => {
                // Wrap in quotes to handle commas or spaces in names safely
                csvContent += `"${b.id}","${b.productName}",${b.quantity},"${b.status}"\n`;
            });
            
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", "batch_export.csv");
            link.style.display = "none";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        })
        .catch(err => console.error("Export failed: ", err));
}

function handleCSVUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async function(e) {
        const text = e.target.result;
        const lines = text.split('\n');
        
        const batchesToCreate = [];
        // Support importing either the exported CSV or a simple "ProductName, Quantity" CSV
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            // Basic CSV split ignoring commas inside quotes
            const cols = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
            if (cols.length >= 2) {
                // If it looks like an export file (4 cols), Name is col 1, Qty is col 2
                // If it's a simple import file (2 cols), Name is col 0, Qty is col 1
                let nameIndex = cols.length >= 4 ? 1 : 0;
                let qtyIndex = cols.length >= 4 ? 2 : 1;

                let productName = cols[nameIndex].replace(/"/g, '').trim();
                let quantity = parseInt(cols[qtyIndex].replace(/"/g, '').trim());
                
                if (productName && !isNaN(quantity)) {
                    batchesToCreate.push({ productName: productName, quantity: quantity });
                }
            }
        }

        if (batchesToCreate.length > 0) {
            try {
                const response = await fetch(`${API_BASE}/bulk`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(batchesToCreate)
                });
                if (response.ok) {
                    alert(`Successfully imported ${batchesToCreate.length} batches!`);
                    loadBatches();
                } else {
                    alert("Failed to import batches.");
                }
            } catch (error) {
                console.error("Error bulk importing: ", error);
            }
        } else {
            alert("No valid data found in CSV. Ensure format is: Product Name, Quantity");
        }
        // Reset file input so same file can be uploaded again if needed
        event.target.value = '';
    };
    reader.readAsText(file);
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
