(() => {
  const { createApp, ref, reactive, onMounted, computed, watch, nextTick } = Vue;

  /* ============ CONFIGURATION ============ */
  const SHIRT_COLORS = [
    { hex: '#fbf9f9', name: 'Crafted Ivory' },
    { hex: '#1c1b1b', name: 'Atelier Onyx' },
    { hex: '#8b8378', name: 'Safari Khaki' },
    { hex: '#4a5342', name: 'Sage Olive' },
    { hex: '#314455', name: 'Nordic Indigo' }
  ];

  const TEXT_COLORS = [
    '#ffffff', '#000000', '#c4c7c7', '#D4AF37', '#ba1a1a', '#314455', '#4a5342'
  ];

  const FONTS = [
    { name: 'Classic Serif', family: 'Playfair Display' },
    { name: 'Modern Sans', family: 'Hanken Grotesk' },
    { name: 'Monospace', family: 'Courier New' }
  ];

  const STYLES = {
    tee: {
      name: 'Unisex Atelier Tee',
    },
    hoodie: {
      name: 'Signature Luxe Hoodie',
    },
    sweatshirt: {
      name: 'Premium Crew Sweatshirt',
    }
  };

  const VIEW_LAYOUTS = {
    front: { top: '23%', left: '26%', width: '48%', height: '54%', pxW: 190, pxH: 220 },
    back: { top: '23%', left: '26%', width: '48%', height: '54%', pxW: 190, pxH: 220 },
    left: { top: '26%', left: '4%', width: '15%', height: '22%', pxW: 60, pxH: 90 },
    right: { top: '26%', left: '81%', width: '15%', height: '22%', pxW: 60, pxH: 90 }
  };

  const UNIT_PRICE = 120;

  createApp({
    template: `
       <div class="min-h-screen flex flex-col justify-between">
           <!-- TopNavBar -->
           <header class="bg-surface border-b border-outline-variant/10 w-full top-0 z-50">
               <nav class="flex justify-between items-center w-full px-margin-desktop py-6 max-w-container-max mx-auto">
                   <div class="font-display-lg text-display-lg font-bold text-primary cursor-pointer" onclick="location.href='index.html'">VICTO</div>
                   <div class="hidden md:flex gap-12 font-body-md text-body-md uppercase tracking-widest">
                       <a class="text-on-surface-variant hover:text-secondary transition-colors duration-300" href="index.html#categories">Collections</a>
                       <a class="text-primary border-b border-secondary hover:text-secondary transition-colors duration-300 font-semibold" href="custom-shirt.html">Customizer</a>
                       <a class="text-on-surface-variant hover:text-secondary transition-colors duration-300" href="templates.html">My Templates</a>
                       <a class="text-on-surface-variant hover:text-secondary transition-colors duration-300" href="index.html">The Atelier</a>
                   </div>
                   <div class="flex items-center gap-6 font-body-md text-body-md uppercase tracking-widest" id="nav-auth-container">
                       <button class="text-on-surface-variant hover:text-primary transition-colors duration-300" onclick="location.href='login.html'">Sign In</button>
                       <button class="bg-primary text-on-primary px-8 py-3 font-semibold hover:opacity-90 transition-opacity" onclick="location.href='login.html?tab=signup'">Join VICTO</button>
                   </div>
               </nav>
           </header>

           <!-- Main Workspace Container -->
           <main class="max-w-container-max mx-auto px-margin-desktop py-12 flex flex-col md:flex-row gap-12 items-start w-full flex-grow">
               
               <!-- Left Sidebar -->
               <aside class="w-full md:w-[30%] flex flex-col bg-surface border border-outline-variant/20 p-8 shadow-sm">
                   <div class="tabs">
                       <button :class="['tab', activeTab === 'garment' ? 'active' : '']" @click="activeTab = 'garment'">Product</button>
                       <button :class="['tab', activeTab === 'design' ? 'active' : '']" @click="activeTab = 'design'">Design</button>
                       <button :class="['tab', activeTab === 'text' ? 'active' : '']" @click="activeTab = 'text'">Typography</button>
                   </div>

                   <!-- TAB: Product Configuration -->
                   <section v-show="activeTab === 'garment'" class="flex flex-col gap-8">
                       <div>
                           <label class="font-label-sm text-label-sm uppercase mb-3 block text-on-surface-variant">Garment Base</label>
                           <select v-model="style" @change="onStyleChange" class="w-full bg-transparent border-outline-variant p-3 font-body-md focus:border-secondary focus:ring-0 transition-colors text-sm uppercase tracking-wider">
                               <option value="tee">Unisex Atelier Tee</option>
                               <option value="hoodie">Signature Luxe Hoodie</option>
                               <option value="sweatshirt">Crewneck Sweatshirt</option>
                           </select>
                       </div>
                       <div>
                           <label class="font-label-sm text-label-sm uppercase mb-3 block text-on-surface-variant">Atelier Colorway</label>
                           <div class="flex flex-wrap gap-3">
                               <button v-for="c in SHIRT_COLORS" 
                                       :key="c.name"
                                       :class="['swatch', color.hex === c.hex ? 'active' : '']"
                                       :style="{ background: c.hex }"
                                       :title="c.name"
                                       @click="setColor(c)">
                               </button>
                           </div>
                       </div>
                   </section>

                   <!-- TAB: Design Artwork Upload -->
                   <section v-show="activeTab === 'design'" class="flex flex-col gap-6">
                       <div>
                           <label class="font-label-sm text-label-sm uppercase mb-3 block text-on-surface-variant">Upload Custom Artwork</label>
                           <div id="uploadZone" class="border-2 border-dashed border-outline-variant hover:border-secondary transition-colors p-8 text-center cursor-pointer flex flex-col items-center justify-center gap-3 bg-surface-container-low">
                               <span class="material-symbols-outlined text-4xl text-outline">cloud_upload</span>
                               <span class="font-label-sm text-[11px] uppercase tracking-widest text-on-surface-variant">Drop files or click here</span>
                               <span class="text-[9px] text-outline uppercase">PNG, JPG up to 10MB</span>
                               <input type="file" id="artworkUpload" class="hidden" accept="image/*" />
                           </div>
                       </div>
                       
                       <!-- Layers list inside active side workspace -->
                       <div>
                           <label class="font-label-sm text-label-sm uppercase mb-3 block text-on-surface-variant">Active Layers ({{ side }})</label>
                           <div class="flex flex-col gap-2">
                               <div v-if="layers.length === 0" class="layer-empty text-[13px] text-on-surface-variant/80 p-4 border border-dashed border-outline-variant/30 text-center">
                                  No active layers on this side. Add artwork or text.
                               </div>
                               <div v-else v-for="L in layers" 
                                    :class="['layer-row', selectedId === L.id ? 'selected' : '']" 
                                    :key="L.id"
                                    draggable="true"
                                    @dragstart="onLayerDragStart($event, L.id)"
                                    @dragover.prevent
                                    @drop="onLayerDrop($event, L.id)"
                                    @click="selectLayer(L.id)">
                                <div class="layer-thumb">
                                  <img v-if="L.layerType === 'img'" :src="L.src" />
                                  <span v-else class="material-symbols-outlined text-sm">text_fields</span>
                                </div>
                                <div class="layer-name">{{ L.layerType === 'text' ? L.text : 'Artwork' }}</div>
                                <button class="layer-del" @click.stop="deleteLayer(L.id)">
                                  <span class="material-symbols-outlined text-sm">delete</span>
                                </button>
                              </div>
                           </div>
                       </div>
                   </section>

                   <!-- TAB: Typography Text -->
                   <section v-show="activeTab === 'text'" class="flex flex-col gap-6">
                       <div>
                           <label class="font-label-sm text-label-sm uppercase mb-3 block text-on-surface-variant">Text String</label>
                           <input v-model="textInput" @keypress.enter="addText" class="w-full bg-transparent border-0 border-b border-primary p-2 font-body-md focus:ring-0 focus:border-secondary transition-colors mb-4" placeholder="Enter custom text..." type="text"/>
                       </div>
                       <div>
                           <label class="font-label-sm text-label-sm uppercase mb-3 block text-on-surface-variant">Font Design Selection</label>
                           <div class="font-grid">
                               <button v-for="f in FONTS" 
                                       :key="f.family"
                                       :class="['font-card', textFont === f.family ? 'active' : '']"
                                       :style="{ fontFamily: f.family }"
                                       @click="setTextFont(f.family)">
                                   {{ f.name }}
                               </button>
                           </div>
                       </div>
                       <div>
                           <label class="font-label-sm text-label-sm uppercase mb-3 block text-on-surface-variant">Text Shade</label>
                           <div class="flex flex-wrap gap-2 text-colors-grid">
                               <button v-for="hex in TEXT_COLORS"
                                       :key="hex"
                                       :class="['swatch', textColor === hex ? 'active' : '']"
                                       :style="{ background: hex }"
                                       @click="setTextColor(hex)">
                               </button>
                           </div>
                       </div>
                       <button @click="addText" class="w-full bg-primary text-on-primary py-3 font-semibold hover:opacity-90 transition-opacity text-sm uppercase tracking-widest">
                           Add Text Layer
                       </button>
                   </section>
               </aside>

               <!-- Center: Interactive Preview Stage -->
               <section class="flex-grow flex flex-col items-center justify-center bg-surface-container relative overflow-hidden p-12 min-h-[520px] w-full" id="previewStage">
                   <!-- Isolated Printable View Toggle Tabs -->
                   <div class="absolute top-8 left-1/2 -translate-x-1/2 flex gap-2 z-20 flex-wrap justify-center max-w-full">
                       <button v-for="s in ['front', 'back', 'left', 'right']" 
                               :key="s"
                               :class="['side-btn', side === s ? 'active bg-primary text-on-primary shadow-sm' : 'bg-surface text-on-surface-variant hover:bg-surface-container-highest']" 
                               @click="setSide(s)" 
                               class="font-label-md px-4 py-2 uppercase tracking-widest text-xs transition-all border border-outline-variant/10">
                           {{ s === 'left' ? 'Left Sleeve' : s === 'right' ? 'Right Sleeve' : s }}
                       </button>
                   </div>

                    <!-- Main Mockup Container -->
                    <div class="relative w-full aspect-[4/5] flex items-center justify-center max-w-2xl">
                        <!-- SVG ClipPaths Definition -->
                        <svg width="0" height="0" class="absolute">
                          <defs>
                            <clipPath id="shirtCliptee" clipPathUnits="objectBoundingBox">
                              <path d="M 0.35,0.136 L 0.25,0.181 L 0.15,0.34 L 0.25,0.386 L 0.25,0.863 L 0.75,0.863 L 0.75,0.386 L 0.85,0.34 L 0.75,0.181 L 0.65,0.136 L 0.6,0.204 C 0.55,0.245 0.45,0.245 0.4,0.204 Z" />
                            </clipPath>
                            <clipPath id="shirtCliphoodie" clipPathUnits="objectBoundingBox">
                              <path d="M 0.325,0.114 L 0.225,0.159 L 0.125,0.318 L 0.225,0.364 L 0.225,0.864 L 0.775,0.864 L 0.775,0.364 L 0.875,0.318 L 0.775,0.159 L 0.675,0.114 Z" />
                            </clipPath>
                            <clipPath id="shirtClipsweatshirt" clipPathUnits="objectBoundingBox">
                              <path d="M 0.35,0.125 L 0.238,0.17 L 0.15,0.33 L 0.238,0.375 L 0.238,0.864 L 0.763,0.864 L 0.763,0.375 L 0.85,0.33 L 0.763,0.17 L 0.675,0.125 Z" />
                            </clipPath>
                          </defs>
                        </svg>

                        <div class="shirt-mockup-container relative w-[85%] max-w-[420px] aspect-square flex items-center justify-center bg-white" 
                             style="filter: drop-shadow(0 14px 28px rgba(0,0,0,0.18)); border-radius: 12px; overflow: visible;">
                            
                            <!-- 1. Color layer (clipped) -->
                            <div class="absolute inset-0 transition-all duration-300"
                                 :style="{ backgroundColor: color.hex, clipPath: 'url(#shirtClip' + style + ')' }">
                            </div>

                            <!-- 2. Texture layer (clipped & blended) -->
                            <img id="shirtMockupImg" 
                                 :src="'assets/mockup-' + style + '.jpg'" 
                                 class="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-90 transition-all duration-300"
                                 :style="{ clipPath: 'url(#shirtClip' + style + ')' }"
                                 style="pointer-events: none; user-select: none;" />

                            <!-- 3. Unclipped Printable Area overlay -->
                            <div class="print-area absolute border border-dashed border-[#D4AF37]/50 canvas-area flex flex-col items-center justify-center" 
                                 id="printArea" 
                                 aria-label="Printable Area">
                                <div class="print-hint font-label-sm text-[#D4AF37]/60 uppercase tracking-[0.2em] opacity-40 select-none flex flex-col items-center justify-center gap-1 pointer-events-none" id="printHint" style="z-index: 0;">
                                  <span class="material-symbols-outlined text-xl">add_photo_alternate</span>
                                  <span class="text-[9px]">Print Zone</span>
                                </div>
                                <canvas id="customCanvas" class="absolute inset-0 z-10"></canvas>
                                <div id="snapGuideV" class="snap-guide absolute top-0 bottom-0 w-[1px]" style="left: 50%;"></div>
                                <div id="snapGuideH" class="snap-guide absolute left-0 right-0 h-[1px]" style="top: 50%;"></div>
                            </div>
                        </div>
                    </div>

                   <!-- Zoom and Rotation tools layout overlay -->
                   <div class="absolute bottom-8 right-8 flex flex-col gap-2 z-10">
                       <button class="p-3 bg-surface border border-outline-variant/20 hover:text-secondary transition-colors" id="btnUndo" title="Undo (Ctrl+Z)"><span class="material-symbols-outlined text-base">undo</span></button>
                       <button class="p-3 bg-surface border border-outline-variant/20 hover:text-secondary transition-colors" id="btnRedo" title="Redo (Ctrl+Y)"><span class="material-symbols-outlined text-base">redo</span></button>
                       <button class="p-3 bg-surface border border-outline-variant/20 hover:text-secondary transition-colors" onclick="tweak(L => L.scale = Math.min(4, L.scale + 0.1))"><span class="material-symbols-outlined text-base">zoom_in</span></button>
                       <button class="p-3 bg-surface border border-outline-variant/20 hover:text-secondary transition-colors" onclick="tweak(L => L.scale = Math.max(0.3, L.scale - 0.1))"><span class="material-symbols-outlined text-base">zoom_out</span></button>
                       <button class="p-3 bg-surface border border-outline-variant/20 hover:text-secondary transition-colors" onclick="tweak(L => L.rotation += 15)"><span class="material-symbols-outlined text-base">rotate_right</span></button>
                   </div>
               </section>

               <!-- Right Side Panel -->
               <aside class="w-full flex flex-col gap-8 md:w-[24%]">
                   <section class="bg-surface p-6 border border-outline-variant/20 shadow-sm">
                       <h3 class="font-label-sm text-label-sm uppercase mb-6 tracking-widest text-on-surface-variant">Design Manifest</h3>
                       
                       <div class="mb-8">
                           <label class="font-label-sm text-label-sm uppercase mb-3 block text-on-surface-variant">Sizing Selection</label>
                           <div class="size-grid">
                               <button v-for="sz in ['S', 'M', 'L', 'XL', '2XL']"
                                       :key="sz"
                                       :class="['size-chip', sizes[sz] ? 'active' : '']"
                                       @click="toggleSize(sz)">
                                   {{ sz }}
                               </button>
                           </div>
                       </div>

                       <div class="flex flex-col gap-6 pt-6 border-t border-outline-variant/20">
                           <div class="flex justify-between items-center">
                               <span class="font-label-md text-sm uppercase tracking-wider text-on-surface-variant">Qty / Size</span>
                               <div class="flex items-center border border-outline-variant">
                                   <button @click="changeQty(-1)" class="px-3 py-1 hover:bg-surface-container-low transition-colors">−</button>
                                   <input v-model.number="qty" type="number" class="w-12 text-center border-0 border-x border-outline-variant bg-transparent py-1 font-body-md focus:ring-0" min="1" max="9999"/>
                                   <button @click="changeQty(1)" class="px-3 py-1 hover:bg-surface-container-low transition-colors">+</button>
                               </div>
                           </div>

                           <div class="flex flex-col gap-1 text-right border-y border-outline-variant/10 py-4">
                               <div class="flex justify-between text-xs text-on-surface-variant">
                                   <span>Unit Price:</span>
                                   <span>฿{{ UNIT_PRICE }}</span>
                               </div>
                               <div class="flex justify-between text-xs text-on-surface-variant">
                                   <span>Fulfillment Qty:</span>
                                   <span>{{ totalQty }} pcs</span>
                               </div>
                               <div class="flex justify-between items-baseline mt-2">
                                   <span class="font-label-md text-[14px]">Total Price</span>
                                   <span class="font-headline-sm text-headline-sm text-primary">฿{{ totalPrice.toLocaleString() }}</span>
                               </div>
                               <span class="text-[9px] uppercase tracking-widest text-secondary font-bold">Premium Atelier dropship pricing</span>
                           </div>

                           <div class="flex flex-col gap-3">
                               <button class="gold-btn w-full py-4 text-primary font-label-md uppercase tracking-[0.2em] flex items-center justify-center gap-3 font-semibold" id="saveTemplateBtn" @click="openTemplateSaveModal">
                                   Save as Template
                                   <span class="material-symbols-outlined">save</span>
                               </button>
                               <button class="obsidian-btn w-full py-4 text-white font-label-md uppercase tracking-[0.2em] flex items-center justify-center gap-3" id="orderBtn" @click="checkout">
                                   Order This Design
                                   <span class="material-symbols-outlined">arrow_forward</span>
                               </button>
                           </div>
                       </div>
                   </section>
               </aside>
           </main>

           <!-- Checkout Modal Dialog -->
           <div id="checkoutModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center hidden">
             <div class="bg-surface border border-outline-variant/30 p-8 max-w-lg w-full flex flex-col gap-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
               <div class="flex justify-between items-center border-b border-outline-variant/10 pb-4">
                 <h3 class="font-display-lg text-headline-sm text-primary uppercase tracking-widest">Shipping & Checkout</h3>
                 <button class="text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center" type="button" onclick="document.getElementById('checkoutModal').classList.add('hidden')">
                   <span class="material-symbols-outlined">close</span>
                 </button>
               </div>
               
               <form @submit.prevent="submitCheckout" class="flex flex-col gap-4">
                 <div class="grid grid-cols-2 gap-4">
                   <div>
                     <label class="font-label-sm text-label-sm uppercase mb-1 block text-on-surface-variant">Recipient Name</label>
                     <input type="text" id="shipName" required class="w-full bg-surface-container-low border border-outline-variant p-3 font-body-md focus:border-secondary focus:ring-0 transition-colors text-sm"/>
                   </div>
                   <div>
                     <label class="font-label-sm text-label-sm uppercase mb-1 block text-on-surface-variant">Phone Number</label>
                     <input type="tel" id="shipPhone" required class="w-full bg-surface-container-low border border-outline-variant p-3 font-body-md focus:border-secondary focus:ring-0 transition-colors text-sm"/>
                   </div>
                 </div>
                 
                 <div>
                   <label class="font-label-sm text-label-sm uppercase mb-1 block text-on-surface-variant">Address Line 1</label>
                   <input type="text" id="shipAddress1" required placeholder="Street address, P.O. box" class="w-full bg-surface-container-low border border-outline-variant p-3 font-body-md focus:border-secondary focus:ring-0 transition-colors text-sm"/>
                 </div>
                 
                 <div class="grid grid-cols-2 gap-4">
                   <div>
                     <label class="font-label-sm text-label-sm uppercase mb-1 block text-on-surface-variant">Sub-District (ตำบล/แขวง)</label>
                     <input type="text" id="shipSubDistrict" required class="w-full bg-surface-container-low border border-outline-variant p-3 font-body-md focus:border-secondary focus:ring-0 transition-colors text-sm"/>
                   </div>
                   <div>
                     <label class="font-label-sm text-label-sm uppercase mb-1 block text-on-surface-variant">District (อำเภอ/เขต)</label>
                     <input type="text" id="shipDistrict" required class="w-full bg-surface-container-low border border-outline-variant p-3 font-body-md focus:border-secondary focus:ring-0 transition-colors text-sm"/>
                   </div>
                 </div>
                 
                 <div class="grid grid-cols-2 gap-4">
                   <div>
                     <label class="font-label-sm text-label-sm uppercase mb-1 block text-on-surface-variant">Province (จังหวัด)</label>
                     <input type="text" id="shipProvince" required class="w-full bg-surface-container-low border border-outline-variant p-3 font-body-md focus:border-secondary focus:ring-0 transition-colors text-sm"/>
                   </div>
                   <div>
                     <label class="font-label-sm text-label-sm uppercase mb-1 block text-on-surface-variant">Postal Code</label>
                     <input type="text" id="shipPostal" required class="w-full bg-surface-container-low border border-outline-variant p-3 font-body-md focus:border-secondary focus:ring-0 transition-colors text-sm"/>
                   </div>
                 </div>

                 <div class="bg-surface-container-low p-4 border border-outline-variant/10 flex flex-col gap-2 mt-4">
                   <h4 class="font-label-sm text-label-sm uppercase tracking-wider text-secondary">Checkout Financials</h4>
                   <div class="flex justify-between text-xs text-on-surface-variant">
                     <span>Items Subtotal:</span>
                     <span>฿{{ totalPrice.toLocaleString() }}</span>
                   </div>
                   <div class="flex justify-between text-xs text-on-surface-variant">
                     <span>Shipping Fee:</span>
                     <span>฿{{ checkoutShipping.toLocaleString() }}</span>
                   </div>
                   <div class="flex justify-between text-sm text-primary font-bold pt-2 border-t border-outline-variant/10">
                     <span>Net Amount Due:</span>
                     <span>฿{{ checkoutNet.toLocaleString() }}</span>
                   </div>
                 </div>

                 <div class="flex gap-4 mt-4">
                   <button type="button" class="w-1/2 border border-primary text-primary py-3 uppercase tracking-widest font-label-sm hover:bg-surface-container-low transition-colors" onclick="document.getElementById('checkoutModal').classList.add('hidden')">Cancel</button>
                   <button type="submit" class="w-1/2 bg-primary text-on-primary py-3 uppercase tracking-widest font-label-sm hover:opacity-90 transition-opacity">Confirm & Order</button>
                 </div>
               </form>
             </div>
           </div>

           <!-- Template Save Modal -->
           <div id="templateNameModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center hidden">
             <div class="bg-surface border border-outline-variant/30 p-8 max-w-md w-full flex flex-col gap-6 shadow-2xl relative">
               <div class="flex justify-between items-center border-b border-outline-variant/10 pb-4">
                 <h3 class="font-display-lg text-headline-sm text-primary uppercase tracking-widest">Save Design Template</h3>
                 <button class="text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center" type="button" onclick="document.getElementById('templateNameModal').classList.add('hidden')">
                   <span class="material-symbols-outlined">close</span>
                 </button>
               </div>
               
               <div>
                 <label class="font-label-sm text-label-sm uppercase mb-2 block text-on-surface-variant">Template Name</label>
                 <input type="text" id="templateNameInput" placeholder="e.g. My Signature Summer Tee" class="w-full bg-surface-container-low border border-outline-variant p-3 font-body-md focus:border-secondary focus:ring-0 transition-colors text-sm"/>
               </div>
               
               <div class="flex gap-4">
                 <button class="w-1/2 border border-primary text-primary py-3 uppercase tracking-widest font-label-sm hover:bg-surface-container-low transition-colors" onclick="document.getElementById('templateNameModal').classList.add('hidden')">Cancel</button>
                 <button class="w-1/2 bg-primary text-on-primary py-3 uppercase tracking-widest font-label-sm hover:opacity-90 transition-opacity" @click="saveTemplateSubmit">Save Template</button>
               </div>
             </div>
           </div>

           <!-- Order Success Modal -->
           <div id="successModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center hidden">
             <div class="bg-surface border border-outline-variant/30 p-10 max-w-md w-full flex flex-col items-center text-center gap-6 shadow-2xl">
               <span class="material-symbols-outlined text-6xl text-secondary">task_alt</span>
               <h3 class="font-display-lg text-headline-sm text-primary uppercase tracking-widest">Order Placed!</h3>
               <p class="font-body-md text-sm text-on-surface-variant">
                 Your custom design order has been submitted to the atelier for printing review.
               </p>
               <div class="bg-surface-container-low border border-outline-variant/10 px-6 py-3 font-mono text-sm text-primary" id="successOrderNumber">
                 ORD-XXXX-XXXX
               </div>
               <button class="bg-primary text-on-primary w-full py-4 uppercase tracking-[0.2em] font-label-sm hover:opacity-90 transition-opacity mt-4" onclick="location.href='index.html'">
                 Return to Atelier
               </button>
             </div>
           </div>

           <!-- Footer -->
           <footer class="bg-surface border-t border-outline-variant/10 py-12 mt-12 w-full">
               <div class="flex flex-col items-center justify-center gap-6 w-full px-margin-desktop max-w-container-max mx-auto text-center">
                   <div class="font-display-lg text-display-lg text-primary cursor-pointer" onclick="location.href='index.html'">VICTO</div>
                   <div class="flex gap-8 font-body-md text-xs uppercase tracking-widest">
                       <a class="text-on-surface-variant hover:text-secondary transition-colors duration-300" href="#">Privacy Policy</a>
                       <a class="text-on-surface-variant hover:text-secondary transition-colors duration-300" href="#">Terms of Service</a>
                       <a class="text-on-surface-variant hover:text-secondary transition-colors duration-300" href="#">Shipping</a>
                       <a class="text-on-surface-variant hover:text-secondary transition-colors duration-300" href="#">Returns</a>
                   </div>
                   <p class="font-body-md text-body-md text-on-surface-variant opacity-60">© 2026 VICTO. All rights Reserved.</p>
               </div>
           </footer>
       </div>
    `,
    setup() {
      // Reactive state variables
      const style = ref('tee');
      const color = ref(SHIRT_COLORS[0]);
      const side = ref('front'); // front | back | left | right
      const activeTab = ref('garment');

      const textInput = ref('');
      const textFont = ref(FONTS[0].family);
      const textColor = ref('#ffffff');

      const sizes = reactive({ S: false, M: true, L: true, XL: false, '2XL': false });
      const qty = ref(10);
      const layers = ref([]);
      const selectedId = ref(null);

      // Template context
      const editingTemplateId = ref(null);
      const templateName = ref('');

      // isolated side workspaces states (Printful style)
      const canvasState = reactive({
        front: '',
        back: '',
        left: '',
        right: ''
      });

      // Checkout financials
      const checkoutShipping = ref(50);
      const checkoutNet = ref(0);

      // Fabric canvas context
      let canvas = null;
      let isRestoringState = false;
      let zCounter = 1;

      // History states
      const history = [];
      let historyIndex = -1;

      // Computed properties
      const totalQty = computed(() => {
        const sizeList = Object.keys(sizes).filter((s) => sizes[s]);
        return sizeList.length * qty.value;
      });

      const totalPrice = computed(() => {
        return totalQty.value * UNIT_PRICE;
      });

      const activeSideLayers = computed(() => {
        return layers.value;
      });

      // Watchers for selections and layers list sync
      function syncLayers() {
        if (!canvas) return;
        layers.value = canvas.getObjects().map(obj => ({
          id: obj.id,
          layerType: obj.layerType,
          text: obj.text || '',
          src: obj.src || (obj._element ? obj._element.src : '')
        }));
      }

      /* ============ FABRIC CANVAS SETUP ============ */
      function initCanvas() {
        canvas = new fabric.Canvas('customCanvas', {
          width: VIEW_LAYOUTS.front.pxW,
          height: VIEW_LAYOUTS.front.pxH,
          backgroundColor: 'transparent',
          selection: true
        });

        // Set custom styling for active selection box and corner handles
        fabric.Object.prototype.transparentCorners = false;
        fabric.Object.prototype.cornerColor = '#D4AF37';
        fabric.Object.prototype.cornerStrokeColor = '#1c1b1b';
        fabric.Object.prototype.borderColor = '#D4AF37';
        fabric.Object.prototype.cornerSize = 8;
        fabric.Object.prototype.padding = 4;

        canvas.on('selection:created', () => {
          const active = canvas.getActiveObject();
          if (active) selectedId.value = active.id;
        });

        canvas.on('selection:updated', () => {
          const active = canvas.getActiveObject();
          if (active) selectedId.value = active.id;
        });

        canvas.on('selection:cleared', () => {
          selectedId.value = null;
        });

        canvas.on('object:modified', () => {
          saveHistory();
        });

        canvas.on('object:added', () => {
          if (!isRestoringState) {
            saveHistory();
            syncLayers();
          }
        });

        canvas.on('object:removed', () => {
          if (!isRestoringState) {
            saveHistory();
            syncLayers();
          }
        });

        initSnapping();
      }

      function initSnapping() {
        canvas.on('object:moving', (e) => {
          const obj = e.target;
          const snapThreshold = 6;
          const canvasCenterX = canvas.width / 2;
          const canvasCenterY = canvas.height / 2;

          // Vertical Snap
          if (Math.abs(obj.left - canvasCenterX) < snapThreshold) {
            obj.left = canvasCenterX;
            const vGuide = document.getElementById('snapGuideV');
            if (vGuide) vGuide.style.opacity = '1';
          } else {
            const vGuide = document.getElementById('snapGuideV');
            if (vGuide) vGuide.style.opacity = '0';
          }

          // Horizontal Snap
          if (Math.abs(obj.top - canvasCenterY) < snapThreshold) {
            obj.top = canvasCenterY;
            const hGuide = document.getElementById('snapGuideH');
            if (hGuide) hGuide.style.opacity = '1';
          } else {
            const hGuide = document.getElementById('snapGuideH');
            if (hGuide) hGuide.style.opacity = '0';
          }
        });

        canvas.on('object:modified', () => {
          const vGuide = document.getElementById('snapGuideV');
          const hGuide = document.getElementById('snapGuideH');
          if (vGuide) vGuide.style.opacity = '0';
          if (hGuide) hGuide.style.opacity = '0';
        });
      }

      /* ============ HISTORY STATE STACK ============ */
      function saveHistory() {
        if (isRestoringState) return;
        if (historyIndex < history.length - 1) {
          history.splice(historyIndex + 1);
        }
        history.push(JSON.stringify(canvas.toJSON(['id', 'layerType', 'src', 'flipX'])));
        historyIndex = history.length - 1;
        updateUndoRedoButtons();
      }

      function undo() {
        if (historyIndex > 0) {
          isRestoringState = true;
          historyIndex--;
          canvas.loadFromJSON(history[historyIndex], () => {
            canvas.requestRenderAll();
            isRestoringState = false;
            syncLayers();
            updateUndoRedoButtons();
          });
        }
      }

      function redo() {
        if (historyIndex < history.length - 1) {
          isRestoringState = true;
          historyIndex++;
          canvas.loadFromJSON(history[historyIndex], () => {
            canvas.requestRenderAll();
            isRestoringState = false;
            syncLayers();
            updateUndoRedoButtons();
          });
        }
      }

      function updateUndoRedoButtons() {
        const undoBtn = document.getElementById('btnUndo');
        const redoBtn = document.getElementById('btnRedo');
        if (undoBtn) undoBtn.style.opacity = historyIndex > 0 ? '1' : '0.4';
        if (redoBtn) redoBtn.style.opacity = historyIndex < history.length - 1 ? '1' : '0.4';
      }

      /* ============ LAYER ACTIONS ============ */
      function selectLayer(id) {
        const obj = canvas.getObjects().find(o => o.id === id);
        if (obj) {
          canvas.setActiveObject(obj);
          canvas.requestRenderAll();
        }
      }

      // Globally wire inline tools overlay clicks
      window.tweak = function(callback) {
        const active = canvas.getActiveObject();
        if (active) {
          const L = {
            scale: active.scaleX,
            rotation: active.angle
          };
          callback(L);
          active.set({
            scaleX: L.scale,
            scaleY: L.scale,
            angle: L.rotation
          });
          active.setCoords();
          canvas.requestRenderAll();
          saveHistory();
        }
      };

      function deleteLayer(id) {
        const obj = canvas.getObjects().find(o => o.id === id);
        if (obj) {
          canvas.remove(obj);
          canvas.requestRenderAll();
        }
      }

      function reorderLayers(sourceId, targetId) {
        const objects = canvas.getObjects();
        const sourceObj = objects.find(o => o.id === sourceId);
        const targetObj = objects.find(o => o.id === targetId);
        if (sourceObj && targetObj) {
          const targetIdx = objects.indexOf(targetObj);
          canvas.remove(sourceObj);
          canvas.insertAt(sourceObj, targetIdx);
          canvas.requestRenderAll();
          saveHistory();
          syncLayers();
        }
      }

      function onLayerDragStart(e, id) {
        e.dataTransfer.setData('text/plain', id);
      }

      function onLayerDrop(e, targetId) {
        const sourceId = e.dataTransfer.getData('text/plain');
        if (sourceId && sourceId !== targetId) {
          reorderLayers(sourceId, targetId);
        }
      }

      function addText() {
        if (!textInput.value || !textInput.value.trim()) return;
        const textObj = new fabric.IText(textInput.value.trim(), {
          left: canvas.width / 2,
          top: canvas.height / 2,
          fontFamily: textFont.value,
          fill: textColor.value,
          fontSize: 20,
          originX: 'center',
          originY: 'center',
          id: 'L' + (++zCounter) + '_' + Math.random().toString(36).substring(2, 6),
          layerType: 'text'
        });
        canvas.add(textObj);
        canvas.setActiveObject(textObj);
        canvas.requestRenderAll();
        textInput.value = '';
      }

      function setTextColor(hex) {
        textColor.value = hex;
        const active = canvas.getActiveObject();
        if (active && active.layerType === 'text') {
          active.set('fill', hex);
          canvas.requestRenderAll();
          saveHistory();
        }
      }

      function setTextFont(family) {
        textFont.value = family;
        const active = canvas.getActiveObject();
        if (active && active.layerType === 'text') {
          active.set('fontFamily', family);
          canvas.requestRenderAll();
          saveHistory();
        }
      }

      function addImage(src) {
        fabric.Image.fromURL(src, (img) => {
          const maxW = canvas.width * 0.8;
          const maxH = canvas.height * 0.8;
          let sc = 1;
          if (img.width > maxW || img.height > maxH) {
            sc = Math.min(maxW / img.width, maxH / img.height);
          }
          img.set({
            left: canvas.width / 2,
            top: canvas.height / 2,
            originX: 'center',
            originY: 'center',
            scaleX: sc,
            scaleY: sc,
            id: 'L' + (++zCounter) + '_' + Math.random().toString(36).substring(2, 6),
            layerType: 'img'
          });
          canvas.add(img);
          canvas.setActiveObject(img);
          canvas.requestRenderAll();
        }, { crossOrigin: 'anonymous' });
      }

      /* ============ ISOLATED CANVAS SIDE WORKSPACES ============ */
      function setSide(newSide) {
        if (!canvas || isRestoringState) return;

        // 1. Serialize active side to canvasState
        canvasState[side.value] = JSON.stringify(canvas.toJSON(['id', 'layerType', 'src', 'flipX']));

        // 2. Transition visual side
        side.value = newSide;
        
        // Update Mockup image horizontal flip on back/right sides
        const imgEl = document.getElementById('shirtMockupImg');
        if (imgEl) {
          imgEl.style.transform = (newSide === 'back' || newSide === 'right') ? 'scaleX(-1)' : '';
        }

        // 3. Move and Resize Printable Zone box layout using responsive percentages
        const lay = VIEW_LAYOUTS[newSide];
        const pa = document.getElementById('printArea');
        if (pa) {
          pa.style.top = lay.top;
          pa.style.left = lay.left;
          pa.style.width = lay.width;
          pa.style.height = lay.height;
        }

        // 4. Update Canvas workspace dimensions
        isRestoringState = true;
        canvas.clear();
        canvas.setDimensions({ width: lay.pxW, height: lay.pxH });

        // 5. Restore target canvas state
        const savedData = canvasState[newSide];
        if (savedData && savedData !== '{"version":"5.3.0","objects":[]}' && savedData.trim() !== '') {
          canvas.loadFromJSON(savedData, () => {
            canvas.requestRenderAll();
            isRestoringState = false;
            syncLayers();
          });
        } else {
          canvas.requestRenderAll();
          isRestoringState = false;
          syncLayers();
        }
      }

      /* ============ ATELIER PRODUCT SWITCH ============ */
      function onStyleChange() {
        const def = STYLES[style.value];
        document.getElementById('infoStyle').textContent = def.name;
      }

      function setColor(c) {
        color.value = c;
        document.getElementById('infoSwatch').style.background = c.hex;
      }

      function toggleSize(sz) {
        sizes[sz] = !sizes[sz];
        updatePrice();
      }

      function changeQty(diff) {
        qty.value = Math.max(1, qty.value + diff);
        updatePrice();
      }

      /* ============ SAVE TEMPLATE & ORDER SUBMISSION ============ */
      function openTemplateSaveModal() {
        const userJson = localStorage.getItem('erp_user') || localStorage.getItem('currentUser');
        if (!userJson) {
          alert('กรุณาเข้าสู่ระบบก่อนบันทึกเทมเพลต / Please sign in to save templates.');
          window.location.href = 'login.html?redirect=custom-shirt.html';
          return;
        }
        document.getElementById('templateNameInput').value = templateName.value || `${STYLES[style.value].name} Template`;
        document.getElementById('templateNameModal').classList.remove('hidden');
      }

      async function saveTemplateSubmit() {
        const userJson = localStorage.getItem('erp_user') || localStorage.getItem('currentUser');
        const user = JSON.parse(userJson);
        const nameVal = document.getElementById('templateNameInput').value.trim();
        if (!nameVal) {
          alert('กรุณาใส่ชื่อเทมเพลต / Please enter template name.');
          return;
        }

        document.getElementById('templateNameModal').classList.add('hidden');

        // Capture current design canvas states
        canvasState[side.value] = JSON.stringify(canvas.toJSON(['id', 'layerType', 'src', 'flipX']));

        // Export current side preview thumbnail
        canvas.discardActiveObject();
        canvas.requestRenderAll();
        const base64Preview = canvas.toDataURL({ format: 'png', quality: 0.8 });

        const payload = {
          id: editingTemplateId.value,
          name: nameVal,
          user_id: user._id || user.id,
          style: style.value,
          color: {
            hex: color.value.hex,
            name: color.value.name
          },
          views: {
            front: canvasState.front,
            back: canvasState.back,
            left: canvasState.left,
            right: canvasState.right
          },
          preview_image: base64Preview
        };

        try {
          const res = await fetch('/api/product-templates', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });

          if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.error || 'Failed to save template');
          }

          alert('บันทึกเทมเพลตสำเร็จ! / Template saved successfully.');
          window.location.href = 'templates.html';

        } catch (err) {
          console.error(err);
          alert('เกิดข้อผิดพลาดในการบันทึกเทมเพลต: ' + err.message);
        }
      }

      function checkout() {
        const userJson = localStorage.getItem('erp_user') || localStorage.getItem('currentUser');
        if (!userJson) {
          alert('กรุณาเข้าสู่ระบบก่อนสั่งซื้อสินค้า / Please sign in to order.');
          window.location.href = 'login.html?redirect=custom-shirt.html';
          return;
        }

        const selectedSizes = Object.keys(sizes).filter(s => sizes[s]);
        if (!selectedSizes.length) {
          alert('กรุณาเลือกขนาดเสื้ออย่างน้อย 1 ขนาด / Please select at least one size.');
          return;
        }

        const user = JSON.parse(userJson);
        document.getElementById('shipName').value = user.username || '';
        document.getElementById('shipPhone').value = user.phone_number || '';

        const subtotal = totalPrice.value;
        const shipping = subtotal > 2000 ? 0 : 50;
        const netAmount = subtotal + shipping;

        checkoutShipping.value = shipping;
        checkoutNet.value = netAmount;

        document.getElementById('checkoutModal').classList.remove('hidden');
      }

      async function submitCheckout() {
        document.getElementById('checkoutModal').classList.add('hidden');
        const userJson = localStorage.getItem('erp_user') || localStorage.getItem('currentUser');
        const user = JSON.parse(userJson);

        canvas.discardActiveObject();
        canvas.requestRenderAll();
        
        // Grab preview
        const base64DesignImage = canvas.toDataURL({ format: 'png', quality: 0.95 });

        // Save current active side state
        canvasState[side.value] = JSON.stringify(canvas.toJSON(['id', 'layerType', 'src', 'flipX']));

        const selectedSizes = Object.keys(sizes).filter(s => sizes[s]);

        // Combined labels of text layers inside all canvas views
        let customTextSummary = '';
        ['front', 'back', 'left', 'right'].forEach((s) => {
          const raw = canvasState[s];
          if (raw) {
            try {
              const stateObj = JSON.parse(raw);
              const texts = stateObj.objects.filter(o => o.layerType === 'text').map(o => o.text);
              if (texts.length) customTextSummary += `[${s}]: ${texts.join(', ')} `;
            } catch(e){}
          }
        });

        const orderPayload = {
          customer_snapshot: {
            user_id: user._id || user.id || null,
            username: user.username,
            email: user.email,
            phone_number: document.getElementById('shipPhone').value
          },
          shipping_address_snapshot: {
            recipient_name: document.getElementById('shipName').value,
            recipient_phone: document.getElementById('shipPhone').value,
            address_line1: document.getElementById('shipAddress1').value,
            address_line2: '',
            sub_district: document.getElementById('shipSubDistrict').value,
            district: document.getElementById('shipDistrict').value,
            province: document.getElementById('shipProvince').value,
            postal_code: document.getElementById('shipPostal').value
          },
          financials: {
            total_amount: totalPrice.value,
            shipping_fee: checkoutShipping.value,
            net_amount: checkoutNet.value,
            payment_status: 'pending',
            payment_method: 'Credit Card',
            paid_at: null
          },
          items: [
            {
              product_name: STYLES[style.value].name || 'Custom Apparel',
              category: 'apparel',
              quantity: totalQty.value,
              unit_price: UNIT_PRICE,
              verify_status: 'pending',
              customization: {
                selected_size: selectedSizes.join(', '),
                uploaded_image_url: base64DesignImage,
                custom_text: customTextSummary.trim() || 'None',
                additional_note: `Base Color: ${color.value.name}. Design saved on all 4 workspaces.`
              },
              verify_history: []
            }
          ]
        };

        try {
          const res = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderPayload)
          });

          if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.error || 'Failed to place order');
          }

          const newOrder = await res.json();
          document.getElementById('successOrderNumber').textContent = newOrder.order_number;
          document.getElementById('successModal').classList.remove('hidden');

        } catch (error) {
          console.error(error);
          alert('เกิดข้อผิดพลาดในการส่งคำสั่งซื้อ: ' + error.message);
        }
      }

      /* ============ LOAD SAVED PRODUCT TEMPLATE ============ */
      async function loadSavedTemplate(templateId) {
        try {
          const res = await fetch(`/api/product-templates/${templateId}`);
          if (!res.ok) throw new Error('Template not found');
          const template = await res.json();

          editingTemplateId.value = template._id;
          templateName.value = template.name;
          style.value = template.style;
          onStyleChange();

          const col = SHIRT_COLORS.find(c => c.hex === template.color.hex);
          if (col) setColor(col);

          // Restore workspaces
          if (template.views) {
            canvasState.front = template.views.front || '';
            canvasState.back = template.views.back || '';
            canvasState.left = template.views.left || '';
            canvasState.right = template.views.right || '';

            // Load initial front canvas state
            if (canvasState.front) {
              isRestoringState = true;
              canvas.loadFromJSON(canvasState.front, () => {
                canvas.requestRenderAll();
                isRestoringState = false;
                syncLayers();
              });
            }
          }
        } catch (err) {
          console.error(err);
          alert('โหลดข้อมูลเทมเพลตไม่สำเร็จ: ' + err.message);
        }
      }

      /* ============ INITIALIZE ============ */
      onMounted(async () => {
        initCanvas();

        // Check if editing a template
        const params = new URLSearchParams(window.location.search);
        const templateId = params.get('templateId');
        const styleParam = params.get('style');
        
        if (templateId) {
          await loadSavedTemplate(templateId);
        } else if (styleParam && STYLES[styleParam]) {
          style.value = styleParam;
          onStyleChange();
        }


        
        // Handle file drop zones
        initUpload();

        // Bind global undo/redo triggers
        const undoBtn = document.getElementById('btnUndo');
        const redoBtn = document.getElementById('btnRedo');
        if (undoBtn) undoBtn.addEventListener('click', undo);
        if (redoBtn) redoBtn.addEventListener('click', redo);

        saveHistory();
      });

      function initUpload() {
        const fileIn = document.getElementById('artworkUpload');
        const zone = document.getElementById('uploadZone');
        if (!zone || !fileIn) return;

        zone.addEventListener('click', () => fileIn.click());
        zone.addEventListener('dragover', (e) => {
          e.preventDefault();
          zone.classList.add('border-primary');
        });
        zone.addEventListener('dragleave', () => zone.classList.remove('border-primary'));
        zone.addEventListener('drop', (e) => {
          e.preventDefault();
          zone.classList.remove('border-primary');
          if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
        });

        fileIn.addEventListener('change', (e) => {
          if (e.target.files.length) handleFile(e.target.files[0]);
        });

        function handleFile(file) {
          if (!file.type.startsWith('image/')) return;
          const reader = new FileReader();
          reader.onload = (ev) => {
            addImage(ev.target.result);
          };
          reader.readAsDataURL(file);
        }
      }

      return {
        style,
        color,
        side,
        activeTab,
        textInput,
        textFont,
        textColor,
        sizes,
        qty,
        layers,
        selectedId,
        activeSideLayers,
        totalQty,
        totalPrice,
        checkoutShipping,
        checkoutNet,
        SHIRT_COLORS,
        TEXT_COLORS,
        FONTS,
        UNIT_PRICE,
        setSide,
        setColor,
        toggleSize,
        changeQty,
        addText,
        setTextColor,
        setTextFont,
        onLayerDragStart,
        onLayerDrop,
        selectLayer,
        deleteLayer,
        onStyleChange,
        openTemplateSaveModal,
        saveTemplateSubmit,
        checkout,
        submitCheckout
      };
    }
  }).mount('#app');
})();
