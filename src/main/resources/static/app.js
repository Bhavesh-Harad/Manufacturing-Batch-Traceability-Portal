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
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center py-5">
                    <div class="text-muted">
                        <i class="fas fa-boxes-packing fa-3x mb-3 text-secondary opacity-50"></i>
                        <h6 class="fw-bold text-secondary">No manufacturing batches found</h6>
                        <p class="small text-muted mb-0">Create a new batch or import a CSV file to begin tracking.</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    batches.forEach(batch => {
        const badgeClass = getStatusBadge(batch.status);
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td>
                <span class="batch-id-pill" onclick="viewAuditLog('${batch.id}')" title="Click to view full traceability timeline">
                    <i class="fas fa-qrcode"></i> ${batch.id}
                </span>
            </td>
            <td>
                <div class="fw-bold text-dark">${batch.productName}</div>
                <div class="small text-muted">ID: #${batch.id}</div>
            </td>
            <td>
                <span class="fw-semibold text-secondary">${batch.quantity.toLocaleString()}</span>
                <span class="small text-muted ms-1">units</span>
            </td>
            <td>
                <span class="badge ${badgeClass}">${batch.status}</span>
            </td>
            <td style="text-align: right;">
                <div class="dropdown d-inline-block">
                    <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Update Status
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end shadow-sm border-0 rounded-3">
                        <li><h6 class="dropdown-header text-uppercase small fw-bold">Set Lifecycle Status</h6></li>
                        <li><a class="dropdown-item py-2" href="#" onclick="updateStatus('${batch.id}', 'CREATED')"><i class="fas fa-circle text-secondary me-2 small"></i>Created</a></li>
                        <li><a class="dropdown-item py-2" href="#" onclick="updateStatus('${batch.id}', 'IN_PRODUCTION')"><i class="fas fa-gears text-warning me-2 small"></i>In Production</a></li>
                        <li><a class="dropdown-item py-2" href="#" onclick="updateStatus('${batch.id}', 'QA_REVIEW')"><i class="fas fa-microscope text-info me-2 small"></i>QA Review</a></li>
                        <li><hr class="dropdown-divider my-1"></li>
                        <li><a class="dropdown-item py-2 text-success fw-semibold" href="#" onclick="updateStatus('${batch.id}', 'APPROVED')"><i class="fas fa-circle-check me-2"></i>Approved</a></li>
                        <li><a class="dropdown-item py-2 text-danger fw-semibold" href="#" onclick="updateStatus('${batch.id}', 'REJECTED')"><i class="fas fa-circle-xmark me-2"></i>Rejected</a></li>
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

    document.getElementById('total-count').innerText = batches.length.toLocaleString();
    document.getElementById('production-count').innerText = totals.production.toLocaleString();
    document.getElementById('qa-count').innerText = totals.qa.toLocaleString();
    document.getElementById('approved-count').innerText = totals.approved.toLocaleString();

    renderChart(totals);
}

function renderChart(totals) {
    const ctx = document.getElementById('statusChart').getContext('2d');
    
    if (statusChartInstance) {
        statusChartInstance.destroy();
    }

    const totalValues = totals.created + totals.production + totals.qa + totals.approved + totals.rejected;

    statusChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Created', 'In Production', 'QA Review', 'Approved', 'Rejected'],
            datasets: [{
                data: totalValues === 0 ? [1] : [totals.created, totals.production, totals.qa, totals.approved, totals.rejected],
                backgroundColor: totalValues === 0 
                    ? ['#e2e8f0'] 
                    : ['#94a3b8', '#f59e0b', '#06b6d4', '#10b981', '#ef4444'],
                borderWidth: 2,
                borderColor: '#ffffff',
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '72%',
            plugins: {
                legend: {
                    display: true,
                    position: 'right',
                    labels: {
                        boxWidth: 10,
                        boxHeight: 10,
                        usePointStyle: true,
                        pointStyle: 'circle',
                        font: {
                            family: "'Plus Jakarta Sans', sans-serif",
                            size: 11,
                            weight: '500'
                        },
                        padding: 10
                    }
                },
                tooltip: {
                    enabled: totalValues > 0,
                    backgroundColor: '#0f172a',
                    titleFont: { family: "'Plus Jakarta Sans', sans-serif", size: 12 },
                    bodyFont: { family: "'Plus Jakarta Sans', sans-serif", size: 12 },
                    padding: 10,
                    cornerRadius: 8
                }
            }
        }
    });
}

async function viewAuditLog(id) {
    try {
        const response = await fetch(`${API_BASE}/${id}`);
        const batch = await response.json();
        
        document.getElementById('auditBatchTitle').innerText = `${batch.id} — ${batch.productName}`;
        
        const timeline = document.getElementById('auditTimeline');
        timeline.innerHTML = '';
        
        if (batch.auditLogs && batch.auditLogs.length > 0) {
            batch.auditLogs.forEach(log => {
                timeline.innerHTML += `
                    <div class="timeline-item">
                        <div class="timeline-dot"></div>
                        <div class="timeline-content shadow-sm">
                            <div class="d-flex align-items-center gap-2">
                                <i class="fas fa-clock text-primary small"></i>
                                <span>${log}</span>
                            </div>
                        </div>
                    </div>
                `;
            });
        } else {
            timeline.innerHTML = '<p class="text-muted my-3">No audit activity recorded yet for this batch.</p>';
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

function parseCSVLine(text, delimiter = ',') {
    const pattern = new RegExp(
        (
            // Delimiters.
            "(\\" + delimiter + "|\\r?\\n|\\r|^)" +
            // Quoted fields.
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
            // Standard fields.
            "([^\"\\" + delimiter + "\\r\\n]*))"
        ),
        "gi"
    );

    const result = [[]];
    let matches = null;

    while (matches = pattern.exec(text)) {
        const matchedDelimiter = matches[1];
        if (matchedDelimiter.length && matchedDelimiter !== delimiter) {
            result.push([]);
        }

        let matchedValue;
        if (matches[2]) {
            matchedValue = matches[2].replace(new RegExp("\"\"", "g"), "\"");
        } else {
            matchedValue = matches[3];
        }

        result[result.length - 1].push(matchedValue !== undefined ? matchedValue.trim() : '');
    }

    return result.filter(row => row.length > 0 && row.some(cell => cell.length > 0));
}

let parsedBatchesToImport = [];

function parseBatchesFromText(text) {
    if (!text || !text.trim()) return [];

    // Strip BOM
    text = text.replace(/^\uFEFF/, '').trim();

    // Auto-detect delimiter
    const firstLine = text.split(/\r\n|\n|\r/)[0];
    const delimiter = (firstLine.includes(';') && !firstLine.includes(',')) ? ';' : ',';

    const rows = parseCSVLine(text, delimiter);
    if (!rows || rows.length === 0) return [];

    const firstRow = rows[0].map(c => c.toLowerCase());
    let nameCol = -1;
    let qtyCol = -1;

    firstRow.forEach((col, index) => {
        if (col.includes('product') || col.includes('name') || col.includes('item') || col.includes('title')) {
            nameCol = index;
        }
        if (col.includes('qty') || col.includes('quantity') || col.includes('units') || col.includes('count')) {
            qtyCol = index;
        }
    });

    let startIndex = 1;

    // Fallback if header wasn't found
    if (nameCol === -1 || qtyCol === -1) {
        const isFirstRowData = rows[0].some(cell => !isNaN(parseInt(cell.replace(/,/g, ''))));
        if (isFirstRowData) {
            startIndex = 0;
        }

        if (rows[0].length === 2) {
            const col0IsNum = !isNaN(parseInt(rows[startIndex][0].replace(/,/g, '')));
            qtyCol = col0IsNum ? 0 : 1;
            nameCol = col0IsNum ? 1 : 0;
        } else if (rows[0].length >= 4) {
            nameCol = 1;
            qtyCol = 2;
        } else {
            nameCol = 0;
            qtyCol = 1;
        }
    }

    const batches = [];
    for (let i = startIndex; i < rows.length; i++) {
        const row = rows[i];
        if (!row || row.length <= Math.max(nameCol, qtyCol)) continue;

        const rawName = row[nameCol] ? row[nameCol].replace(/^["']|["']$/g, '').trim() : '';
        const rawQty = row[qtyCol] ? row[qtyCol].replace(/,/g, '').trim() : '';
        const quantity = parseInt(rawQty);

        if (rawName && !isNaN(quantity) && quantity > 0) {
            batches.push({
                productName: rawName,
                quantity: quantity
            });
        }
    }

    return batches;
}

function updateImportPreview(batches) {
    parsedBatchesToImport = batches;
    const previewContainer = document.getElementById('csvPreviewContainer');
    const previewBody = document.getElementById('csvPreviewBody');
    const previewCount = document.getElementById('csvPreviewCount');
    const confirmBtn = document.getElementById('confirmImportBtn');
    const alertBox = document.getElementById('csvStatusAlert');

    alertBox.classList.add('d-none');
    previewBody.innerHTML = '';

    if (batches.length > 0) {
        batches.slice(0, 10).forEach((b, idx) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="text-muted">${idx + 1}</td>
                <td class="fw-semibold text-dark">${b.productName}</td>
                <td><span class="badge bg-secondary">${b.quantity.toLocaleString()} units</span></td>
            `;
            previewBody.appendChild(tr);
        });

        if (batches.length > 10) {
            const moreTr = document.createElement('tr');
            moreTr.innerHTML = `<td colspan="3" class="text-center text-muted small py-1">... and ${batches.length - 10} more rows</td>`;
            previewBody.appendChild(moreTr);
        }

        previewCount.innerText = `${batches.length} batch(es) detected`;
        previewContainer.classList.remove('d-none');
        confirmBtn.removeAttribute('disabled');
    } else {
        previewContainer.classList.add('d-none');
        confirmBtn.setAttribute('disabled', 'true');
    }
}

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const text = e.target.result;
        document.getElementById('csvTextInput').value = text;
        const batches = parseBatchesFromText(text);
        updateImportPreview(batches);
    };
    reader.readAsText(file);
}

function handleTextPreview() {
    const text = document.getElementById('csvTextInput').value;
    const batches = parseBatchesFromText(text);
    updateImportPreview(batches);
}

async function executeBatchImport() {
    if (!parsedBatchesToImport || parsedBatchesToImport.length === 0) return;

    const confirmBtn = document.getElementById('confirmImportBtn');
    const originalText = confirmBtn.innerHTML;
    confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i> Importing...';
    confirmBtn.setAttribute('disabled', 'true');

    let importSuccess = false;

    try {
        const bulkRes = await fetch(`${API_BASE}/bulk`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(parsedBatchesToImport)
        });
        if (bulkRes.ok) {
            importSuccess = true;
        }
    } catch (err) {
        console.warn("Bulk endpoint call failed, falling back to sequential batch creation...", err);
    }

    if (!importSuccess) {
        try {
            await Promise.all(parsedBatchesToImport.map(batch => 
                fetch(API_BASE, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(batch)
                })
            ));
            importSuccess = true;
        } catch (err) {
            console.error("Individual batch fallback creation failed:", err);
        }
    }

    confirmBtn.innerHTML = originalText;

    if (importSuccess) {
        alert(`Successfully imported ${parsedBatchesToImport.length} batch(es) into the portal!`);
        
        // Reset form & modal
        document.getElementById('csvFileInput').value = '';
        document.getElementById('csvTextInput').value = '';
        updateImportPreview([]);
        
        const modalEl = document.getElementById('importCsvModal');
        const modalInstance = bootstrap.Modal.getInstance(modalEl);
        if (modalInstance) {
            modalInstance.hide();
        }

        await loadBatches();
    } else {
        const alertBox = document.getElementById('csvStatusAlert');
        alertBox.innerText = "Failed to import batches. Make sure your Spring Boot server is running.";
        alertBox.classList.remove('d-none');
        confirmBtn.removeAttribute('disabled');
    }
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
