/**
 * GAONA CONSULTORES TI - CRM & ADMIN PORTAL ENGINE
 * Modern vanilla JavaScript for enterprise Kanban Board and Lead Management
 */

// Global State
let proposalsState = [];
let currentUser = null;
let currentView = 'kanban'; // 'kanban' or 'table'
let draggedCardId = null;

const STAGES = [
  { id: 'prospect', name: 'Prospectos / Leads', colorClass: 'col-prospect' },
  { id: 'diagnosis', name: 'Diagnóstico Agendado', colorClass: 'col-diagnosis' },
  { id: 'proposal', name: 'Propuesta Enviada', colorClass: 'col-proposal' },
  { id: 'negotiation', name: 'En Negociación', colorClass: 'col-negotiation' },
  { id: 'won', name: 'Ganadas / Cerradas ✅', colorClass: 'col-won' },
  { id: 'lost', name: 'Perdidas / Archivadas ❌', colorClass: 'col-lost' }
];

document.addEventListener('DOMContentLoaded', () => {
  initAuth();
});

/* ==========================================================================
   1. AUTHENTICATION CONTROLLER
   ========================================================================== */
function initAuth() {
  const loginView = document.getElementById('loginView');
  const adminAppView = document.getElementById('adminAppView');
  const loginForm = document.getElementById('loginForm');
  const loginEmail = document.getElementById('loginEmail');
  const loginPassword = document.getElementById('loginPassword');
  const loginAlert = document.getElementById('loginAlert');
  const togglePasswordBtn = document.getElementById('togglePasswordBtn');
  const logoutBtn = document.getElementById('logoutBtn');

  // Check existing session
  const storedSession = sessionStorage.getItem('gaona_admin_session') || localStorage.getItem('gaona_admin_session');
  if (storedSession) {
    try {
      currentUser = JSON.parse(storedSession);
      showAdminApp();
      return;
    } catch (e) {
      sessionStorage.removeItem('gaona_admin_session');
    }
  }

  // Toggle Password Visibility
  if (togglePasswordBtn && loginPassword) {
    togglePasswordBtn.addEventListener('click', () => {
      const type = loginPassword.getAttribute('type') === 'password' ? 'text' : 'password';
      loginPassword.setAttribute('type', type);
      togglePasswordBtn.textContent = type === 'password' ? '👁️' : '🔒';
    });
  }

  // Login Submit
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = loginEmail.value.trim().toLowerCase();
      const pass = loginPassword.value.trim();
      const remember = document.getElementById('rememberMe')?.checked;

      loginAlert.style.display = 'none';

      // Credential validation (Demo Admin accounts)
      if (
        (email === 'admin@gaonaconsultores.com' && pass === 'GaonaAdmin2026!') ||
        (email === 'consultor@gaonaconsultores.com' && pass === 'GaonaTI2026!') ||
        (email === 'admin' && pass === 'admin')
      ) {
        currentUser = {
          name: email.includes('consultor') ? 'Consultor Senior TI' : 'Ing. Gaona (Admin)',
          email: email,
          role: 'Administrador Principal'
        };

        if (remember) {
          localStorage.setItem('gaona_admin_session', JSON.stringify(currentUser));
        } else {
          sessionStorage.setItem('gaona_admin_session', JSON.stringify(currentUser));
        }

        showAdminApp();
      } else {
        loginAlert.textContent = 'Credenciales inválidas. Compruebe correo y contraseña.';
        loginAlert.style.display = 'flex';
      }
    });
  }

  // Logout
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      if (confirm('¿Desea cerrar la sesión del panel administrativo?')) {
        sessionStorage.removeItem('gaona_admin_session');
        localStorage.removeItem('gaona_admin_session');
        currentUser = null;
        loginView.style.display = 'flex';
        adminAppView.style.display = 'none';
        loginForm.reset();
      }
    });
  }
}

function showAdminApp() {
  const loginView = document.getElementById('loginView');
  const adminAppView = document.getElementById('adminAppView');
  const userDisplayName = document.getElementById('userDisplayName');
  const userDisplayEmail = document.getElementById('userDisplayEmail');

  if (loginView) loginView.style.display = 'none';
  if (adminAppView) adminAppView.style.display = 'flex';

  if (userDisplayName && currentUser) userDisplayName.textContent = currentUser.name;
  if (userDisplayEmail && currentUser) userDisplayEmail.textContent = currentUser.email;

  initCRMData();
  initBoardEvents();
}

/* ==========================================================================
   2. CRM DATA MANAGEMENT & SEEDING
   ========================================================================== */
function initCRMData() {
  const stored = localStorage.getItem('gaona_crm_proposals');
  if (stored) {
    try {
      proposalsState = JSON.parse(stored);
    } catch (e) {
      seedDefaultProposals();
    }
  } else {
    seedDefaultProposals();
  }

  renderApp();
}

function seedDefaultProposals() {
  proposalsState = [
    {
      id: 'PROP-1001',
      client: 'Lic. Claudia Lozano',
      company: 'PayFintech México',
      email: 'claudia.lozano@payfintech.mx',
      phone: '+52 55 4920 1122',
      service: 'Arquitectura Cloud & DevOps',
      value: 145000,
      priority: 'alta',
      stage: 'proposal',
      date: '2026-08-14',
      appointmentDate: '2026-08-16',
      notes: 'Requieren migración de base de datos a AWS con replicación Multi-AZ y alta disponibilidad 99.99%.'
    },
    {
      id: 'PROP-1002',
      client: 'Ing. Roberto Morales',
      company: 'LogiRetail Corp',
      email: 'roberto.m@logiretail.com',
      phone: '+52 55 8831 9900',
      service: 'Desarrollo de Software a Medida',
      value: 180000,
      priority: 'alta',
      stage: 'negotiation',
      date: '2026-08-10',
      appointmentDate: '2026-08-12',
      notes: 'Plataforma empresarial de trazabilidad logística conectada con SAP ERP y telemetría en tiempo real.'
    },
    {
      id: 'PROP-1003',
      client: 'Dra. Elena Vargas',
      company: 'Hospital San Rafael',
      email: 'direccionti@sanrafael.med.mx',
      phone: '+52 55 7711 4455',
      service: 'Ciberseguridad & SOC 24/7',
      value: 95000,
      priority: 'alta',
      stage: 'won',
      date: '2026-08-01',
      appointmentDate: '2026-08-03',
      notes: 'Contrato firmado. Monitoreo SOC 24/7 activo y blindaje perimetral para protección de expedientes médicos.'
    },
    {
      id: 'PROP-1004',
      client: 'Mtro. Alejandro Gutiérrez',
      company: 'Grupo Nexus Inmobiliaria',
      email: 'agutierrez@nexusinm.com',
      phone: '+52 55 1290 8877',
      service: 'Desarrollo de Software a Medida',
      value: 52000,
      priority: 'media',
      stage: 'prospect',
      date: '2026-08-18',
      appointmentDate: '2026-08-20',
      notes: 'Interesados en cotizador y portal de clientes para desarrollo residencial.'
    },
    {
      id: 'PROP-1005',
      client: 'Ing. Carlos Mendoza',
      company: 'Distribuidora del Norte',
      email: 'cmendoza@distnorte.com',
      phone: '+52 81 8390 1200',
      service: 'Infraestructura & Redes',
      value: 68000,
      priority: 'media',
      stage: 'diagnosis',
      date: '2026-08-17',
      appointmentDate: '2026-08-19',
      notes: 'Sesión agendada para evaluar migración a SD-WAN Cisco y renovación de cableado estructurado.'
    }
  ];

  saveProposals();
}

function saveProposals() {
  localStorage.setItem('gaona_crm_proposals', JSON.stringify(proposalsState));
  renderApp();
}

/* ==========================================================================
   3. RENDERING & KPIS CALCULATION
   ========================================================================== */
function renderApp() {
  updateKPIs();
  if (currentView === 'kanban') {
    renderKanbanBoard();
  } else {
    renderTableView();
  }
}

function updateKPIs() {
  const totalPipelineEl = document.getElementById('kpiTotalPipeline');
  const activeLeadsEl = document.getElementById('kpiActiveLeads');
  const wonValueEl = document.getElementById('kpiWonValue');
  const conversionRateEl = document.getElementById('kpiConversionRate');

  let totalPipeline = 0;
  let activeCount = 0;
  let wonCount = 0;
  let wonValue = 0;

  proposalsState.forEach(p => {
    if (p.stage !== 'lost') {
      totalPipeline += Number(p.value) || 0;
    }
    if (p.stage !== 'won' && p.stage !== 'lost') {
      activeCount++;
    }
    if (p.stage === 'won') {
      wonCount++;
      wonValue += Number(p.value) || 0;
    }
  });

  const totalClosed = wonCount + proposalsState.filter(p => p.stage === 'lost').length;
  const rate = totalClosed > 0 ? ((wonCount / totalClosed) * 100).toFixed(1) : '100';

  const formatMXN = (v) => '$' + v.toLocaleString('es-MX') + ' MXN';

  if (totalPipelineEl) totalPipelineEl.textContent = formatMXN(totalPipeline);
  if (activeLeadsEl) activeLeadsEl.textContent = activeCount;
  if (wonValueEl) wonValueEl.textContent = formatMXN(wonValue);
  if (conversionRateEl) conversionRateEl.textContent = `${rate}%`;
}

/* ==========================================================================
   4. KANBAN BOARD CONTROLLER
   ========================================================================== */
function renderKanbanBoard() {
  const boardEl = document.getElementById('kanbanBoard');
  const tableEl = document.getElementById('tableViewContainer');
  if (!boardEl) return;

  boardEl.style.display = 'flex';
  if (tableEl) tableEl.style.display = 'none';

  // Filter criteria
  const searchQuery = document.getElementById('crmSearchInput')?.value.toLowerCase().trim() || '';
  const filterService = document.getElementById('crmServiceFilter')?.value || 'all';
  const filterPriority = document.getElementById('crmPriorityFilter')?.value || 'all';

  const filtered = proposalsState.filter(p => {
    const matchSearch = !searchQuery || 
      p.company.toLowerCase().includes(searchQuery) ||
      p.client.toLowerCase().includes(searchQuery) ||
      p.id.toLowerCase().includes(searchQuery) ||
      p.email.toLowerCase().includes(searchQuery);

    const matchService = filterService === 'all' || p.service === filterService;
    const matchPriority = filterPriority === 'all' || p.priority === filterPriority;

    return matchSearch && matchService && matchPriority;
  });

  // Render Columns
  boardEl.innerHTML = STAGES.map(stage => {
    const stageProposals = filtered.filter(p => p.stage === stage.id);
    const stageTotal = stageProposals.reduce((sum, p) => sum + (Number(p.value) || 0), 0);

    return `
      <div class="kanban-column ${stage.colorClass}" data-stage-id="${stage.id}">
        <div class="column-header">
          <div class="column-title-box">
            <span class="column-color-indicator"></span>
            <span class="column-title">${stage.name}</span>
          </div>
          <span class="column-badge">${stageProposals.length}</span>
        </div>

        <div class="column-cards-container" data-stage-id="${stage.id}">
          ${stageProposals.map(p => createCardHTML(p)).join('')}
          ${stageProposals.length === 0 ? '<div style="color:var(--text-muted); font-size:0.75rem; text-align:center; padding:1rem;">Sin propuestas en esta etapa</div>' : ''}
        </div>
      </div>
    `;
  }).join('');

  attachDragAndDropHandlers();
}

function createCardHTML(p) {
  const formatVal = '$' + Number(p.value).toLocaleString('es-MX') + ' MXN';
  const cleanPhone = (p.phone || '').replace(/[^0-9]/g, '');

  return `
    <div class="proposal-card" draggable="true" data-id="${p.id}">
      <div class="card-top">
        <div>
          <div class="card-company">${escapeHtml(p.company)}</div>
          <div class="card-client">${escapeHtml(p.client)}</div>
        </div>
        <span class="priority-badge priority-${p.priority}">${p.priority}</span>
      </div>

      <div class="card-service-tag">${escapeHtml(p.service)}</div>

      <div class="card-value">${formatVal}</div>

      <div class="card-footer">
        <span>📅 ${p.date}</span>
        <div class="card-actions">
          ${cleanPhone ? `<a href="https://wa.me/${cleanPhone}" target="_blank" class="action-icon-btn" title="Chat WhatsApp">💬</a>` : ''}
          <button class="action-icon-btn" onclick="openEditProposalModal('${p.id}')" title="Editar Propuesta">✏️</button>
          <button class="action-icon-btn" onclick="deleteProposal('${p.id}')" title="Eliminar">🗑️</button>
        </div>
      </div>
    </div>
  `;
}

function attachDragAndDropHandlers() {
  const cards = document.querySelectorAll('.proposal-card');
  const dropContainers = document.querySelectorAll('.column-cards-container, .kanban-column');

  cards.forEach(card => {
    card.addEventListener('dragstart', (e) => {
      draggedCardId = card.getAttribute('data-id');
      card.classList.add('dragging');
      e.dataTransfer.setData('text/plain', draggedCardId);
      e.dataTransfer.effectAllowed = 'move';
    });

    card.addEventListener('dragend', () => {
      card.classList.remove('dragging');
      document.querySelectorAll('.kanban-column').forEach(c => c.classList.remove('drag-over'));
    });
  });

  dropContainers.forEach(container => {
    container.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      const col = container.closest('.kanban-column');
      if (col) col.classList.add('drag-over');
    });

    container.addEventListener('dragleave', (e) => {
      const col = container.closest('.kanban-column');
      if (col && !col.contains(e.relatedTarget)) {
        col.classList.remove('drag-over');
      }
    });

    container.addEventListener('drop', (e) => {
      e.preventDefault();
      const targetStage = container.getAttribute('data-stage-id') || container.closest('.kanban-column')?.getAttribute('data-stage-id');
      document.querySelectorAll('.kanban-column').forEach(c => c.classList.remove('drag-over'));

      if (draggedCardId && targetStage) {
        moveProposalStage(draggedCardId, targetStage);
        draggedCardId = null;
      }
    });
  });
}

function moveProposalStage(propId, newStage) {
  const prop = proposalsState.find(p => p.id === propId);
  if (prop && prop.stage !== newStage) {
    prop.stage = newStage;
    saveProposals();
    showAdminToast(`Propuesta ${prop.company} movida a "${getStageName(newStage)}"`);
  }
}

function getStageName(stageId) {
  const s = STAGES.find(x => x.id === stageId);
  return s ? s.name : stageId;
}

/* ==========================================================================
   5. TABLE VIEW CONTROLLER
   ========================================================================== */
function renderTableView() {
  const boardEl = document.getElementById('kanbanBoard');
  const tableEl = document.getElementById('tableViewContainer');
  const tbody = document.getElementById('tableBody');
  if (!tableEl || !tbody) return;

  if (boardEl) boardEl.style.display = 'none';
  tableEl.style.display = 'block';

  // Filter criteria
  const searchQuery = document.getElementById('crmSearchInput')?.value.toLowerCase().trim() || '';
  const filterService = document.getElementById('crmServiceFilter')?.value || 'all';
  const filterPriority = document.getElementById('crmPriorityFilter')?.value || 'all';

  const filtered = proposalsState.filter(p => {
    const matchSearch = !searchQuery || 
      p.company.toLowerCase().includes(searchQuery) ||
      p.client.toLowerCase().includes(searchQuery) ||
      p.id.toLowerCase().includes(searchQuery);

    const matchService = filterService === 'all' || p.service === filterService;
    const matchPriority = filterPriority === 'all' || p.priority === filterPriority;

    return matchSearch && matchService && matchPriority;
  });

  tbody.innerHTML = filtered.map(p => {
    return `
      <tr>
        <td><strong style="color:var(--accent-cyan); font-family:var(--font-mono);">${p.id}</strong></td>
        <td><strong>${escapeHtml(p.company)}</strong></td>
        <td>${escapeHtml(p.client)}</td>
        <td><span class="card-service-tag" style="margin:0;">${escapeHtml(p.service)}</span></td>
        <td><strong>$${Number(p.value).toLocaleString('es-MX')} MXN</strong></td>
        <td>
          <select onchange="moveProposalStage('${p.id}', this.value)" style="background:var(--admin-sidebar-bg); color:#fff; border:1px solid var(--admin-border); border-radius:4px; padding:2px 4px; font-size:0.75rem;">
            ${STAGES.map(s => `<option value="${s.id}" ${p.stage === s.id ? 'selected' : ''}>${s.name}</option>`).join('')}
          </select>
        </td>
        <td><span class="priority-badge priority-${p.priority}">${p.priority}</span></td>
        <td>${p.date}</td>
        <td>
          <div style="display:flex; gap:0.25rem;">
            <button class="action-icon-btn" onclick="openEditProposalModal('${p.id}')">✏️</button>
            <button class="action-icon-btn" onclick="deleteProposal('${p.id}')">🗑️</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

/* ==========================================================================
   6. PROPOSAL CRUD MODALS
   ========================================================================== */
function openNewProposalModal() {
  const modal = document.getElementById('proposalModal');
  const form = document.getElementById('proposalForm');
  const modalTitle = document.getElementById('modalFormTitle');
  if (!modal || !form) return;

  form.reset();
  document.getElementById('propIdField').value = '';
  document.getElementById('propDateField').value = new Date().toISOString().split('T')[0];
  modalTitle.textContent = '➕ Registrar Nueva Propuesta / Lead';

  modal.classList.add('open');
}

function openEditProposalModal(propId) {
  const modal = document.getElementById('proposalModal');
  const form = document.getElementById('proposalForm');
  const modalTitle = document.getElementById('modalFormTitle');
  if (!modal || !form) return;

  const prop = proposalsState.find(p => p.id === propId);
  if (!prop) return;

  document.getElementById('propIdField').value = prop.id;
  document.getElementById('propCompanyField').value = prop.company;
  document.getElementById('propClientField').value = prop.client;
  document.getElementById('propEmailField').value = prop.email || '';
  document.getElementById('propPhoneField').value = prop.phone || '';
  document.getElementById('propServiceField').value = prop.service;
  document.getElementById('propValueField').value = prop.value;
  document.getElementById('propStageField').value = prop.stage;
  document.getElementById('propPriorityField').value = prop.priority;
  document.getElementById('propDateField').value = prop.date || '';
  document.getElementById('propNotesField').value = prop.notes || '';

  modalTitle.textContent = `✏️ Editar Propuesta (${prop.id})`;
  modal.classList.add('open');
}

function closeProposalModal() {
  const modal = document.getElementById('proposalModal');
  if (modal) modal.classList.remove('open');
}

function deleteProposal(propId) {
  const prop = proposalsState.find(p => p.id === propId);
  if (!prop) return;

  if (confirm(`¿Eliminar la propuesta de ${prop.company} (${prop.id})?`)) {
    proposalsState = proposalsState.filter(p => p.id !== propId);
    saveProposals();
    showAdminToast(`Propuesta ${prop.id} eliminada.`);
  }
}

// Form Submit for Create & Edit
function handleProposalFormSubmit(e) {
  e.preventDefault();
  const id = document.getElementById('propIdField').value;
  const company = document.getElementById('propCompanyField').value.trim();
  const client = document.getElementById('propClientField').value.trim();
  const email = document.getElementById('propEmailField').value.trim();
  const phone = document.getElementById('propPhoneField').value.trim();
  const service = document.getElementById('propServiceField').value;
  const value = Number(document.getElementById('propValueField').value) || 0;
  const stage = document.getElementById('propStageField').value;
  const priority = document.getElementById('propPriorityField').value;
  const date = document.getElementById('propDateField').value;
  const notes = document.getElementById('propNotesField').value.trim();

  if (id) {
    // Edit existing
    const index = proposalsState.findIndex(p => p.id === id);
    if (index !== -1) {
      proposalsState[index] = {
        ...proposalsState[index],
        company, client, email, phone, service, value, stage, priority, date, notes
      };
      showAdminToast('Propuesta actualizada correctamente.');
    }
  } else {
    // Create new
    const newId = 'PROP-' + Math.floor(1000 + Math.random() * 9000);
    proposalsState.unshift({
      id: newId,
      company, client, email, phone, service, value, stage, priority, date, notes
    });
    showAdminToast(`Nueva propuesta ${newId} registrada.`);
  }

  saveProposals();
  closeProposalModal();
}

/* ==========================================================================
   7. BOARD EVENTS & TOOLBAR
   ========================================================================== */
function initBoardEvents() {
  const searchInput = document.getElementById('crmSearchInput');
  const serviceFilter = document.getElementById('crmServiceFilter');
  const priorityFilter = document.getElementById('crmPriorityFilter');
  const viewKanbanBtn = document.getElementById('viewKanbanBtn');
  const viewTableBtn = document.getElementById('viewTableBtn');
  const newPropBtn = document.getElementById('newProposalBtn');
  const exportBtn = document.getElementById('exportDataBtn');
  const resetDemoBtn = document.getElementById('resetDemoDataBtn');
  const proposalForm = document.getElementById('proposalForm');
  const modalCloseBtns = document.querySelectorAll('.close-admin-modal-btn');

  if (searchInput) searchInput.addEventListener('input', renderApp);
  if (serviceFilter) serviceFilter.addEventListener('change', renderApp);
  if (priorityFilter) priorityFilter.addEventListener('change', renderApp);

  if (viewKanbanBtn && viewTableBtn) {
    viewKanbanBtn.addEventListener('click', () => {
      currentView = 'kanban';
      viewKanbanBtn.classList.add('active');
      viewTableBtn.classList.remove('active');
      renderApp();
    });

    viewTableBtn.addEventListener('click', () => {
      currentView = 'table';
      viewTableBtn.classList.add('active');
      viewKanbanBtn.classList.remove('active');
      renderApp();
    });
  }

  if (newPropBtn) newPropBtn.addEventListener('click', openNewProposalModal);
  if (proposalForm) proposalForm.addEventListener('submit', handleProposalFormSubmit);

  modalCloseBtns.forEach(btn => {
    btn.addEventListener('click', closeProposalModal);
  });

  // Export CSV
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      let csvContent = "data:text/csv;charset=utf-8,ID,Empresa,Cliente,Correo,Telefono,Servicio,Valor_MXN,Etapa,Prioridad,Fecha,Notas\n";
      proposalsState.forEach(p => {
        const row = [
          p.id,
          `"${p.company}"`,
          `"${p.client}"`,
          `"${p.email}"`,
          `"${p.phone}"`,
          `"${p.service}"`,
          p.value,
          p.stage,
          p.priority,
          p.date,
          `"${(p.notes || '').replace(/"/g, '""')}"`
        ].join(",");
        csvContent += row + "\n";
      });

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `Gaona_CRM_Propuestas_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      showAdminToast('Archivo CSV exportado con éxito.');
    });
  }

  // Reset demo
  if (resetDemoBtn) {
    resetDemoBtn.addEventListener('click', () => {
      if (confirm('¿Restablecer el tablero con los datos demo predeterminados?')) {
        seedDefaultProposals();
        showAdminToast('Datos demo restaurados.');
      }
    });
  }
}

/* ==========================================================================
   8. UTILITIES
   ========================================================================== */
function showAdminToast(msg) {
  const toast = document.createElement('div');
  toast.style.position = 'fixed';
  toast.style.bottom = '2rem';
  toast.style.left = '2rem';
  toast.style.background = 'rgba(13, 21, 39, 0.95)';
  toast.style.border = '1px solid var(--accent-cyan)';
  toast.style.borderRadius = '8px';
  toast.style.padding = '0.75rem 1.25rem';
  toast.style.color = '#fff';
  toast.style.fontSize = '0.85rem';
  toast.style.fontWeight = '600';
  toast.style.boxShadow = '0 10px 30px rgba(0,0,0,0.6)';
  toast.style.zIndex = '3000';
  toast.textContent = '✓ ' + msg;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
