document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('templatesContainer');
  const userJson = localStorage.getItem('erp_user') || localStorage.getItem('currentUser');
  
  if (!userJson) {
    // Show premium blank state prompting to sign in
    container.innerHTML = `
      <div class="flex flex-col items-center justify-center text-center py-20 bg-surface-container-low border border-outline-variant/15 p-8 max-w-xl mx-auto shadow-sm">
        <span class="material-symbols-outlined text-6xl text-outline mb-4">account_circle</span>
        <h3 class="font-display-lg text-xl text-primary uppercase tracking-widest mb-3">Sign In Required</h3>
        <p class="font-body-md text-sm text-on-surface-variant mb-8 max-w-sm">
          Please sign in to view, create, and manage your bespoke custom product templates.
        </p>
        <button class="bg-primary text-on-primary px-8 py-3 uppercase tracking-widest font-label-sm hover:opacity-90 transition-opacity" onclick="location.href='login.html?redirect=templates.html'">
          Sign In
        </button>
      </div>`;
    return;
  }

  const user = JSON.parse(userJson);
  const userId = user._id || user.id;

  async function loadTemplates() {
    try {
      const res = await fetch(`/api/product-templates?user_id=${userId}`);
      if (!res.ok) throw new Error('Failed to load templates');
      const templates = await res.json();
      renderTemplates(templates);
    } catch (err) {
      console.error(err);
      container.innerHTML = `
        <div class="text-center py-10 text-red-600 font-semibold uppercase tracking-wider">
          Error loading templates. Please try again.
        </div>`;
    }
  }

  function renderTemplates(list) {
    if (!list.length) {
      container.innerHTML = `
        <div class="flex flex-col items-center justify-center text-center py-20 bg-surface-container-low border border-outline-variant/15 p-8 max-w-xl mx-auto shadow-sm">
          <span class="material-symbols-outlined text-6xl text-outline mb-4">inventory_2</span>
          <h3 class="font-display-lg text-xl text-primary uppercase tracking-widest mb-3">No Templates Yet</h3>
          <p class="font-body-md text-sm text-on-surface-variant mb-8 max-w-sm">
            Start designing and save your customized creations as templates to order or reuse later.
          </p>
          <button class="bg-primary text-on-primary px-8 py-3 uppercase tracking-widest font-label-sm hover:opacity-90 transition-opacity" onclick="location.href='custom-shirt.html'">
            Create First Template
          </button>
        </div>`;
      return;
    }

    const styleLabels = {
      tee: 'Unisex Atelier Tee',
      hoodie: 'Signature Luxe Hoodie',
      sweatshirt: 'Premium Crew Sweatshirt'
    };

    container.innerHTML = `
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        ${list.map(t => `
          <div class="bg-surface border border-outline-variant/15 hover:border-secondary transition-all duration-300 shadow-sm flex flex-col justify-between" id="template-${t._id}">
            <!-- Mockup Stage Thumbnail -->
            <div class="relative w-full aspect-[4/5] bg-surface-container-low border-b border-outline-variant/10 flex items-center justify-center p-8 overflow-hidden group">
              <!-- Overlay grid detail for luxury touch -->
              <div class="absolute inset-4 border border-outline-variant/10 pointer-events-none"></div>
              
              <!-- Captured Base64 Graphic Design canvas thumbnail -->
              ${t.preview_image ? `
                <img src="${t.preview_image}" class="max-h-[85%] max-w-[85%] object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-500 z-10" />
              ` : `
                <span class="material-symbols-outlined text-6xl text-outline/50">apparel</span>
              `}

              <!-- Small swatch pill -->
              <div class="absolute bottom-4 right-4 flex items-center gap-2 bg-surface/90 px-3 py-1 border border-outline-variant/20 rounded-full shadow-sm text-[10px] font-bold text-primary uppercase tracking-widest">
                <span class="w-3.5 h-3.5 rounded-full border border-black/10" style="background: ${t.color.hex}"></span>
                ${t.color.name}
              </div>
            </div>

            <!-- Meta details description -->
            <div class="p-6 flex flex-col gap-4">
              <div>
                <h4 class="font-display-lg text-lg text-primary mb-1 uppercase tracking-tight truncate">${t.name}</h4>
                <p class="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
                  ${styleLabels[t.style] || t.style}
                </p>
                <p class="text-[10px] text-outline uppercase mt-1">
                  Saved ${new Date(t.create_at).toLocaleDateString('th-TH')}
                </p>
              </div>

              <!-- Action buttons grid -->
              <div class="grid grid-cols-3 gap-2 border-t border-outline-variant/10 pt-4 mt-2">
                <button class="bg-primary text-on-primary py-2.5 text-xs font-semibold uppercase tracking-wider hover:opacity-90 transition-opacity col-span-2" onclick="location.href='custom-shirt.html?templateId=${t._id}'">
                  Edit Design
                </button>
                <button class="border border-red-800 text-red-800 py-2.5 text-xs font-semibold uppercase tracking-wider hover:bg-red-50 transition-colors flex items-center justify-center" onclick="deleteTemplate('${t._id}')">
                  <span class="material-symbols-outlined text-sm">delete</span>
                </button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>`;
  }

  // Set global delete function
  window.deleteTemplate = async (id) => {
    if (!confirm('คุณแน่ใจว่าต้องการลบเทมเพลตนี้? / Are you sure you want to delete this template?')) return;
    try {
      const res = await fetch(`/api/product-templates/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete template');
      
      // Animate out card
      const card = document.getElementById(`template-${id}`);
      if (card) {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
          loadTemplates();
        }, 300);
      } else {
        loadTemplates();
      }
    } catch (err) {
      console.error(err);
      alert('เกิดข้อผิดพลาดในการลบเทมเพลต: ' + err.message);
    }
  };

  loadTemplates();
});
