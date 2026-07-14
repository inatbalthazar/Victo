(() => {
  const { createApp, ref, reactive, onMounted, computed, watch, nextTick } = Vue;

  /* ============ CONFIGURATION ============ */
  const SHIRT_COLORS = [
    { hex: '#fbf9f9', name: 'Crafted Ivory' },
    { hex: '#121212', name: 'Atelier Onyx' },
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
    { name: 'Atelier Roman', family: 'Cinzel' },
    { name: 'Minimalist Inter', family: 'Inter' },
    { name: 'Bespoke Script', family: 'Alex Brush' },
    { name: 'Monospace', family: 'Courier Prime' }
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
    front: { top: '23%', left: '26%', width: '48%', height: '54%', pxW: 380, pxH: 440 },
    back: { top: '23%', left: '26%', width: '48%', height: '54%', pxW: 380, pxH: 440 }
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
                   <div class="flex items-center gap-6 font-body-md text-[13px] uppercase tracking-widest">
                       <div v-if="currentUser" class="flex items-center gap-4">
                           <span class="text-on-surface-variant font-normal">Hello, <strong class="text-primary">{{ currentUser.username }}</strong></span>
                           <a v-if="currentUser.roles && (currentUser.roles.includes('admin') || currentUser.roles.includes('super_admin'))" href="erp.html" class="text-secondary hover:text-primary transition-colors duration-300 font-semibold tracking-widest text-[13px] uppercase">ERP Dashboard</a>
                           <button @click="logout" class="bg-primary text-on-primary px-6 py-2 font-semibold hover:opacity-90 transition-opacity text-[13px] uppercase">Sign Out</button>
                       </div>
                       <div v-else class="flex items-center gap-6">
                           <button class="text-on-surface-variant hover:text-primary transition-colors duration-300" onclick="location.href='login.html'">Sign In</button>
                           <button class="bg-primary text-on-primary px-8 py-3 font-semibold hover:opacity-90 transition-opacity" onclick="location.href='login.html?tab=signup'">Join VICTO</button>
                       </div>
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
                       <button @click="addText" class="w-full bg-primary text-on-primary py-3 font-semibold hover:opacity-90 transition-opacity text-sm uppercase tracking-widest border border-primary hover:bg-transparent hover:text-primary">
                           {{ selectedId && layers.find(L => L.id === selectedId && L.layerType === 'text') ? 'Deselect / Done' : 'Add Text Layer' }}
                       </button>
                   </section>
               </aside>

               <!-- Center: Interactive Preview Stage -->
               <section class="flex-grow flex flex-col items-center justify-center bg-surface-container relative overflow-hidden p-12 min-h-[520px] w-full" id="previewStage">
                   <!-- Print area warning banner -->
                   <div v-show="isOutsidePrintArea" class="absolute top-[80px] left-1/2 -translate-x-1/2 bg-rose-600/90 text-white font-label-md px-6 py-2.5 rounded-full shadow-lg z-20 flex items-center gap-2 text-xs uppercase tracking-wider animate-pulse border border-rose-400">
                       <span class="material-symbols-outlined text-base">warning</span>
                       <span>Design exceeds printable area boundary!</span>
                   </div>

                   <!-- Isolated Printable View Toggle Tabs -->
                   <div class="absolute top-8 left-1/2 -translate-x-1/2 flex gap-4 z-20">
                       <button v-for="s in ['front', 'back']" 
                               :key="s"
                               :class="['relative overflow-hidden group flex items-center gap-3 px-6 py-2.5 uppercase tracking-widest text-xs transition-all border font-semibold rounded-md shadow-sm', side === s ? 'bg-primary text-on-primary border-primary' : 'bg-surface text-on-surface-variant hover:bg-surface-container-highest border-outline-variant/30']" 
                               @click="setSide(s)">
                           
                           <!-- Thumbnail Preview Mini Circle -->
                           <div class="w-8 h-8 rounded-full border border-outline-variant/50 bg-white/80 overflow-hidden flex items-center justify-center flex-shrink-0 shadow-inner">
                               <img v-if="thumbnailState[s]" :src="thumbnailState[s]" class="w-full h-full object-contain" />
                               <span v-else class="material-symbols-outlined text-xs text-outline opacity-40">image</span>
                           </div>
                           
                           <span>{{ s }}</span>
                       </button>
                   </div>

                    <!-- Main Mockup Container -->
                     <div class="relative w-full aspect-[4/5] flex items-center justify-center max-w-2xl">
                          <!-- Masked color base & image blend wrapper using solid silhouette mask -->
                          <div class="absolute inset-0 transition-all duration-300"
                               :style="'mask-image: url(\\'' + activeMaskUrl + '\\'); -webkit-mask-image: url(\\'' + activeMaskUrl + '\\'); mask-size: cover; -webkit-mask-size: cover; mask-position: center; -webkit-mask-position: center; mask-repeat: no-repeat; -webkit-mask-repeat: no-repeat; background-color: ' + color.hex + ';'">
                              
                              <!-- Real mockup image with native multiply blend -->
                              <img id="shirtMockupImg" 
                                   :src="activeMockupUrl" 
                                   class="absolute inset-0 w-full h-full object-cover mix-blend-multiply transition-all duration-300"
                                   style="pointer-events: none; user-select: none;" />
                          </div></div>

                         <!-- Unclipped Printable Area overlay -->
                         <div :class="['print-area absolute border border-dashed border-[#D4AF37]/50 canvas-area flex flex-col items-center justify-center', layers.length === 0 ? 'is-empty' : '']"
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

                    <!-- Element Controls Toolbar -->
                    <div v-show="selectedId" class="absolute bottom-6 left-1/2 -translate-x-1/2 bg-surface/90 backdrop-blur-md px-6 py-2.5 border border-secondary/30 rounded-full shadow-lg flex items-center gap-3.5 z-20 transition-all duration-300">
                        <span class="text-[10px] uppercase font-bold tracking-widest text-secondary border-r border-outline-variant/30 pr-3.5 select-none">Layer Tools</span>
                        
                        <!-- Align Horizontally -->
                        <button @click="alignCenterH" class="hover:text-secondary text-primary transition-colors flex items-center justify-center p-1.5 rounded hover:bg-surface-container-high" title="Center Horizontally">
                            <span class="material-symbols-outlined text-lg">align_horizontal_center</span>
                        </button>
                        
                        <!-- Align Vertically -->
                        <button @click="alignCenterV" class="hover:text-secondary text-primary transition-colors flex items-center justify-center p-1.5 rounded hover:bg-surface-container-high" title="Center Vertically">
                            <span class="material-symbols-outlined text-lg">align_vertical_center</span>
                        </button>
                        
                        <!-- Flip Horizontally -->
                        <button @click="flipObjectH" class="hover:text-secondary text-primary transition-colors flex items-center justify-center p-1.5 rounded hover:bg-surface-container-high" title="Flip Horizontally">
                            <span class="material-symbols-outlined text-lg">flip</span>
                        </button>
                        
                        <!-- Flip Vertically -->
                        <button @click="flipObjectV" class="hover:text-secondary text-primary transition-colors flex items-center justify-center p-1.5 rounded hover:bg-surface-container-high" title="Flip Vertically">
                            <span class="material-symbols-outlined text-lg">flip_to_back</span>
                        </button>
                        
                        <!-- Duplicate -->
                        <button @click="duplicateLayer" class="hover:text-secondary text-primary transition-colors flex items-center justify-center p-1.5 rounded hover:bg-surface-container-high" title="Duplicate Layer">
                            <span class="material-symbols-outlined text-lg">content_copy</span>
                        </button>

                        <!-- Z-Index: Bring Forward -->
                        <button @click="bringForward" class="hover:text-secondary text-primary transition-colors flex items-center justify-center p-1.5 rounded hover:bg-surface-container-high" title="Bring Forward">
                            <span class="material-symbols-outlined text-lg">flip_to_front</span>
                        </button>

                        <!-- Z-Index: Send Backward -->
                        <button @click="sendBackward" class="hover:text-secondary text-primary transition-colors flex items-center justify-center p-1.5 rounded hover:bg-surface-container-high" title="Send Backward">
                            <span class="material-symbols-outlined text-lg">select_all</span>
                        </button>

                        <!-- Delete -->
                        <button @click="deleteLayer(selectedId)" class="text-rose-600 hover:bg-rose-50 transition-colors flex items-center justify-center p-1.5 rounded ml-2" title="Delete Layer">
                            <span class="material-symbols-outlined text-lg">delete</span>
                        </button>
                    </div>

                    <!-- Zoom and Rotation tools layout overlay -->
                    <div class="absolute bottom-8 right-8 flex flex-col gap-2 z-10">
                        <button @click="undo" :style="{ opacity: canUndo ? 1 : 0.4 }" class="p-3 bg-surface border border-outline-variant/20 hover:text-secondary transition-colors" id="btnUndo" title="Undo (Ctrl+Z)"><span class="material-symbols-outlined text-base">undo</span></button>
                        <button @click="redo" :style="{ opacity: canRedo ? 1 : 0.4 }" class="p-3 bg-surface border border-outline-variant/20 hover:text-secondary transition-colors" id="btnRedo" title="Redo (Ctrl+Y)"><span class="material-symbols-outlined text-base">redo</span></button>
                        <button @click="zoomIn" class="p-3 bg-surface border border-outline-variant/20 hover:text-secondary transition-colors"><span class="material-symbols-outlined text-base">zoom_in</span></button>
                        <button @click="zoomOut" class="p-3 bg-surface border border-outline-variant/20 hover:text-secondary transition-colors"><span class="material-symbols-outlined text-base">zoom_out</span></button>
                        <button @click="rotateRight" class="p-3 bg-surface border border-outline-variant/20 hover:text-secondary transition-colors"><span class="material-symbols-outlined text-base">rotate_right</span></button>
                    </div>
               </section>

               <!-- Right Side Panel -->
               <aside class="w-full flex flex-col gap-8 md:w-[24%]">
                   <section class="bg-surface p-6 border border-outline-variant/20 shadow-sm">
                       <div class="mb-4">
                           <h3 class="font-label-sm text-label-sm uppercase mb-1 tracking-widest text-on-surface-variant">Design Manifest</h3>
                           <span class="text-[11px] text-outline uppercase font-semibold">Active Base: <span id="infoStyle" class="text-primary font-bold">Unisex Atelier Tee</span></span>
                       </div>
                       
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
      // User auth session
      const currentUser = ref(null);

      // Reactive state variables
      const style = ref('tee');
      const color = ref(SHIRT_COLORS[0]);
      const side = ref('front'); // front | back
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

      // Miniature visual previews next to the front/back switchers
      const thumbnailState = reactive({
        front: '',
        back: ''
      });

      // Print area exceeded check flag
      const isOutsidePrintArea = ref(false);

      // Checkout financials
      const checkoutShipping = ref(50);
      const checkoutNet = ref(0);

      // Fabric canvas context
      let canvas = null;
      let isRestoringState = false;
      let zCounter = 1;

      // History states (reactive refs to sync undo/redo buttons live)
      const history = ref([]);
      const historyIndex = ref(-1);

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

      const activeMockupUrl = computed(() => {
        let sideKey = side.value === 'back' ? 'back' : 'front';
        const styleKey = style.value;
        if (styleKey === 'tee') {
          return `assets/mockup-tee_${sideKey}.png?v=2`;
        } else if (styleKey === 'hoodie') {
          return `assets/mockup-hoodie-${sideKey}.png?v=2`;
        } else if (styleKey === 'sweatshirt') {
          return `assets/mockup-sweatshirt-${sideKey}.png?v=2`;
        }
        return `assets/mockup-tee_${sideKey}.png?v=2`; // fallback
      });

      const activeMaskUrl = computed(() => {
        let sideKey = side.value === 'back' ? 'back' : 'front';
        const styleKey = style.value;
        if (styleKey === 'tee') {
          return `assets/mockup-tee_${sideKey}_mask.png?v=2`;
        } else if (styleKey === 'hoodie') {
          return `assets/mockup-hoodie-${sideKey}_mask.png?v=2`;
        } else if (styleKey === 'sweatshirt') {
          return `assets/mockup-sweatshirt-${sideKey}_mask.png?v=2`;
        }
        return `assets/mockup-tee_${sideKey}_mask.png?v=2`; // fallback
      });

      const canUndo = computed(() => historyIndex.value > 0);
      const canRedo = computed(() => historyIndex.value < history.value.length - 1);

      // Watchers for typography properties editing in real time
      watch(textInput, (newVal) => {
        const active = canvas.getActiveObject();
        if (active && active.layerType === 'text' && !isRestoringState) {
          active.set('text', newVal);
          canvas.requestRenderAll();
          syncLayers();
        }
      });

      watch(textFont, (newVal) => {
        const active = canvas.getActiveObject();
        if (active && active.layerType === 'text' && !isRestoringState) {
          active.set('fontFamily', newVal);
          canvas.requestRenderAll();
          saveHistory();
          syncLayers();
        }
      });

      watch(textColor, (newVal) => {
        const active = canvas.getActiveObject();
        if (active && active.layerType === 'text' && !isRestoringState) {
          active.set('fill', newVal);
          canvas.requestRenderAll();
          saveHistory();
          syncLayers();
        }
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
        updateCurrentThumbnail();
      }

      function updateCurrentThumbnail() {
        if (!canvas || isRestoringState) return;
        
        // Temporarily clear selection box to take clean screenshot
        const activeObj = canvas.getActiveObject();
        if (activeObj) {
          canvas.discardActiveObject();
          canvas.requestRenderAll();
        }
        
        const base64 = canvas.toDataURL({
          format: 'png',
          quality: 0.5,
          multiplier: 0.2
        });
        
        thumbnailState[side.value] = base64;
        
        if (activeObj) {
          canvas.setActiveObject(activeObj);
          canvas.requestRenderAll();
        }
      }

      function generateAllThumbnails() {
        if (!canvas) return;
        const originalSide = side.value;
        isRestoringState = true;
        
        // Render front thumbnail
        const frontJSON = canvasState.front;
        if (frontJSON && frontJSON.trim() !== '') {
          canvas.loadFromJSON(frontJSON, () => {
            canvas.discardActiveObject();
            canvas.requestRenderAll();
            thumbnailState.front = canvas.toDataURL({ format: 'png', quality: 0.5, multiplier: 0.2 });
            
            // Render back thumbnail
            const backJSON = canvasState.back;
            if (backJSON && backJSON.trim() !== '') {
              canvas.loadFromJSON(backJSON, () => {
                canvas.discardActiveObject();
                canvas.requestRenderAll();
                thumbnailState.back = canvas.toDataURL({ format: 'png', quality: 0.5, multiplier: 0.2 });
                restoreSide(originalSide);
              });
            } else {
              thumbnailState.back = '';
              restoreSide(originalSide);
            }
          });
        } else {
          thumbnailState.front = '';
          const backJSON = canvasState.back;
          if (backJSON && backJSON.trim() !== '') {
            canvas.loadFromJSON(backJSON, () => {
              canvas.discardActiveObject();
              canvas.requestRenderAll();
              thumbnailState.back = canvas.toDataURL({ format: 'png', quality: 0.5, multiplier: 0.2 });
              restoreSide(originalSide);
            });
          } else {
            thumbnailState.back = '';
            restoreSide(originalSide);
          }
        }
      }

      function restoreSide(targetSide) {
        const lay = VIEW_LAYOUTS[targetSide];
        canvas.clear();
        canvas.setDimensions({ width: lay.pxW, height: lay.pxH });
        const saved = canvasState[targetSide];
        if (saved && saved.trim() !== '') {
          canvas.loadFromJSON(saved, () => {
            canvas.requestRenderAll();
            isRestoringState = false;
            syncLayers();
            checkPrintAreaBoundaries();
          });
        } else {
          canvas.requestRenderAll();
          isRestoringState = false;
          syncLayers();
          checkPrintAreaBoundaries();
        }
      }

      function checkPrintAreaBoundaries() {
        if (!canvas) return;
        let outside = false;
        canvas.getObjects().forEach((obj) => {
          const rect = obj.getBoundingRect(true, true);
          if (
            rect.left < 0 ||
            rect.top < 0 ||
            rect.left + rect.width > canvas.width ||
            rect.top + rect.height > canvas.height
          ) {
            outside = true;
          }
        });
        isOutsidePrintArea.value = outside;
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
        fabric.Object.prototype.cornerSize = 10;
        fabric.Object.prototype.padding = 6;

        canvas.on('selection:created', () => {
          const active = canvas.getActiveObject();
          if (active) {
            selectedId.value = active.id;
            if (active.layerType === 'text') {
              isRestoringState = true;
              textInput.value = active.text || '';
              textFont.value = active.fontFamily || FONTS[0].family;
              textColor.value = active.fill || '#ffffff';
              isRestoringState = false;
              activeTab.value = 'text';
            } else {
              activeTab.value = 'design';
            }
          }
        });

        canvas.on('selection:updated', () => {
          const active = canvas.getActiveObject();
          if (active) {
            selectedId.value = active.id;
            if (active.layerType === 'text') {
              isRestoringState = true;
              textInput.value = active.text || '';
              textFont.value = active.fontFamily || FONTS[0].family;
              textColor.value = active.fill || '#ffffff';
              isRestoringState = false;
              activeTab.value = 'text';
            } else {
              activeTab.value = 'design';
            }
          }
        });

        canvas.on('selection:cleared', () => {
          selectedId.value = null;
        });

        canvas.on('object:modified', () => {
          saveHistory();
          syncLayers();
          checkPrintAreaBoundaries();
        });

        canvas.on('object:added', () => {
          if (!isRestoringState) {
            saveHistory();
            syncLayers();
            checkPrintAreaBoundaries();
          }
        });

        canvas.on('object:removed', () => {
          if (!isRestoringState) {
            saveHistory();
            syncLayers();
            checkPrintAreaBoundaries();
          }
        });

        canvas.on('text:changed', (e) => {
          const obj = e.target;
          if (obj && obj.id === selectedId.value) {
            textInput.value = obj.text;
            syncLayers();
          }
        });

        initSnapping();
      }

      function initSnapping() {
        canvas.on('object:moving', (e) => {
          const obj = e.target;
          const snapThreshold = 10;
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
          checkPrintAreaBoundaries();
        });

        canvas.on('object:moving', () => {
          checkPrintAreaBoundaries();
        });
        canvas.on('object:scaling', () => {
          checkPrintAreaBoundaries();
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
        if (historyIndex.value < history.value.length - 1) {
          history.value.splice(historyIndex.value + 1);
        }
        history.value.push(JSON.stringify(canvas.toJSON(['id', 'layerType', 'src', 'flipX', 'flipY'])));
        historyIndex.value = history.value.length - 1;
      }

      function undo() {
        if (canUndo.value) {
          isRestoringState = true;
          historyIndex.value--;
          canvas.loadFromJSON(history.value[historyIndex.value], () => {
            canvas.requestRenderAll();
            isRestoringState = false;
            syncLayers();
            checkPrintAreaBoundaries();
          });
        }
      }

      function redo() {
        if (canRedo.value) {
          isRestoringState = true;
          historyIndex.value++;
          canvas.loadFromJSON(history.value[historyIndex.value], () => {
            canvas.requestRenderAll();
            isRestoringState = false;
            syncLayers();
            checkPrintAreaBoundaries();
          });
        }
      }

      /* ============ LAYER ACTIONS ============ */
      function selectLayer(id) {
        const obj = canvas.getObjects().find(o => o.id === id);
        if (obj) {
          canvas.setActiveObject(obj);
          canvas.requestRenderAll();
          
          if (obj.layerType === 'text') {
            activeTab.value = 'text';
          } else {
            activeTab.value = 'design';
          }
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
          canvas.discardActiveObject();
          canvas.requestRenderAll();
          selectedId.value = null;
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

      /* ============ CANVAS FLOATING TOOL ACTION ALIGNMENTS ============ */
      function alignCenterH() {
        const active = canvas.getActiveObject();
        if (active) {
          canvas.centerObjectH(active);
          active.setCoords();
          canvas.requestRenderAll();
          saveHistory();
          checkPrintAreaBoundaries();
        }
      }

      function alignCenterV() {
        const active = canvas.getActiveObject();
        if (active) {
          canvas.centerObjectV(active);
          active.setCoords();
          canvas.requestRenderAll();
          saveHistory();
          checkPrintAreaBoundaries();
        }
      }

      function flipObjectH() {
        const active = canvas.getActiveObject();
        if (active) {
          active.set('flipX', !active.flipX);
          canvas.requestRenderAll();
          saveHistory();
        }
      }

      function flipObjectV() {
        const active = canvas.getActiveObject();
        if (active) {
          active.set('flipY', !active.flipY);
          canvas.requestRenderAll();
          saveHistory();
        }
      }

      function bringForward() {
        const active = canvas.getActiveObject();
        if (active) {
          canvas.bringForward(active);
          canvas.requestRenderAll();
          saveHistory();
          syncLayers();
        }
      }

      function sendBackward() {
        const active = canvas.getActiveObject();
        if (active) {
          canvas.sendBackwards(active);
          canvas.requestRenderAll();
          saveHistory();
          syncLayers();
        }
      }

      function duplicateLayer() {
        const active = canvas.getActiveObject();
        if (active) {
          active.clone((cloned) => {
            canvas.discardActiveObject();
            cloned.set({
              left: cloned.left + 20,
              top: cloned.top + 20,
              id: 'L' + (++zCounter) + '_' + Math.random().toString(36).substring(2, 6),
              evented: true,
            });
            canvas.add(cloned);
            canvas.setActiveObject(cloned);
            canvas.requestRenderAll();
            saveHistory();
            syncLayers();
          }, ['id', 'layerType', 'src']);
        }
      }

      function zoomIn() {
        const active = canvas.getActiveObject();
        if (active) {
          const sc = Math.min(4, active.scaleX + 0.1);
          active.set({ scaleX: sc, scaleY: sc });
          active.setCoords();
          canvas.requestRenderAll();
          saveHistory();
          checkPrintAreaBoundaries();
        }
      }

      function zoomOut() {
        const active = canvas.getActiveObject();
        if (active) {
          const sc = Math.max(0.3, active.scaleX - 0.1);
          active.set({ scaleX: sc, scaleY: sc });
          active.setCoords();
          canvas.requestRenderAll();
          saveHistory();
          checkPrintAreaBoundaries();
        }
      }

      function rotateRight() {
        const active = canvas.getActiveObject();
        if (active) {
          const rot = (active.angle + 15) % 360;
          active.set('angle', rot);
          active.setCoords();
          canvas.requestRenderAll();
          saveHistory();
          checkPrintAreaBoundaries();
        }
      }

      function addText() {
        const activeTextObj = canvas.getActiveObject();
        if (activeTextObj && activeTextObj.layerType === 'text') {
          canvas.discardActiveObject();
          canvas.requestRenderAll();
          textInput.value = '';
          return;
        }

        if (!textInput.value || !textInput.value.trim()) return;
        const textObj = new fabric.IText(textInput.value.trim(), {
          left: canvas.width / 2,
          top: canvas.height / 2,
          fontFamily: textFont.value,
          fill: textColor.value,
          fontSize: 36, // double default to match high-res
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
        canvasState[side.value] = JSON.stringify(canvas.toJSON(['id', 'layerType', 'src', 'flipX', 'flipY']));

        // 2. Transition visual side
        side.value = newSide;
        
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
            checkPrintAreaBoundaries();
          });
        } else {
          canvas.requestRenderAll();
          isRestoringState = false;
          syncLayers();
          checkPrintAreaBoundaries();
        }
      }

      /* ============ ATELIER PRODUCT SWITCH ============ */
      function onStyleChange() {
        const def = STYLES[style.value];
        document.getElementById('infoStyle').textContent = def.name;
        // Regenerate canvas thumbnails for new style
        generateAllThumbnails();
      }

      function setColor(c) {
        color.value = c;
      }

      function toggleSize(sz) {
        sizes[sz] = !sizes[sz];
      }

      function changeQty(diff) {
        qty.value = Math.max(1, qty.value + diff);
      }

      /* ============ SAVE TEMPLATE & ORDER SUBMISSION ============ */
      function openTemplateSaveModal() {
        if (!currentUser.value) {
          alert('กรุณาเข้าสู่ระบบก่อนบันทึกเทมเพลต / Please sign in to save templates.');
          window.location.href = 'login.html?redirect=custom-shirt.html';
          return;
        }
        document.getElementById('templateNameInput').value = templateName.value || `${STYLES[style.value].name} Template`;
        document.getElementById('templateNameModal').classList.remove('hidden');
      }

      async function saveTemplateSubmit() {
        if (!currentUser.value) return;
        const nameVal = document.getElementById('templateNameInput').value.trim();
        if (!nameVal) {
          alert('กรุณาใส่ชื่อเทมเพลต / Please enter template name.');
          return;
        }

        document.getElementById('templateNameModal').classList.add('hidden');

        // Capture current design canvas states
        canvasState[side.value] = JSON.stringify(canvas.toJSON(['id', 'layerType', 'src', 'flipX', 'flipY']));

        // Export current side preview thumbnail
        canvas.discardActiveObject();
        canvas.requestRenderAll();
        const base64Preview = canvas.toDataURL({ format: 'png', quality: 0.8 });

        const payload = {
          id: editingTemplateId.value,
          name: nameVal,
          user_id: currentUser.value._id || currentUser.value.id,
          style: style.value,
          color: {
            hex: color.value.hex,
            name: color.value.name
          },
          views: {
            front: canvasState.front,
            back: canvasState.back,
            left: '',
            right: ''
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
        if (!currentUser.value) {
          alert('กรุณาเข้าสู่ระบบก่อนสั่งซื้อสินค้า / Please sign in to order.');
          window.location.href = 'login.html?redirect=custom-shirt.html';
          return;
        }

        const selectedSizes = Object.keys(sizes).filter(s => sizes[s]);
        if (!selectedSizes.length) {
          alert('กรุณาเลือกขนาดเสื้ออย่างน้อย 1 ขนาด / Please select at least one size.');
          return;
        }

        document.getElementById('shipName').value = currentUser.value.username || '';
        document.getElementById('shipPhone').value = currentUser.value.phone_number || '';

        const subtotal = totalPrice.value;
        const shipping = subtotal > 2000 ? 0 : 50;
        const netAmount = subtotal + shipping;

        checkoutShipping.value = shipping;
        checkoutNet.value = netAmount;

        document.getElementById('checkoutModal').classList.remove('hidden');
      }

      async function submitCheckout() {
        document.getElementById('checkoutModal').classList.add('hidden');
        if (!currentUser.value) return;

        canvas.discardActiveObject();
        canvas.requestRenderAll();
        
        // Grab preview
        const base64DesignImage = canvas.toDataURL({ format: 'png', quality: 0.95 });

        // Save current active side state
        canvasState[side.value] = JSON.stringify(canvas.toJSON(['id', 'layerType', 'src', 'flipX', 'flipY']));

        const selectedSizes = Object.keys(sizes).filter(s => sizes[s]);

        // Combined labels of text layers inside all canvas views
        let customTextSummary = '';
        ['front', 'back'].forEach((s) => {
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
            user_id: currentUser.value._id || currentUser.value.id || null,
            username: currentUser.value.username,
            email: currentUser.value.email,
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
                additional_note: `Base Color: ${color.value.name}. Design saved on front & back views.`
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
          
          let mappedStyle = template.style;
          if (mappedStyle === 'long') mappedStyle = 'hoodie';
          else if (mappedStyle === 'polo' || mappedStyle === 'tank') mappedStyle = 'tee';
          
          style.value = mappedStyle;
          onStyleChange();

          const col = SHIRT_COLORS.find(c => c.hex === template.color.hex);
          if (col) setColor(col);

          // Restore workspaces
          if (template.views) {
            canvasState.front = template.views.front || '';
            canvasState.back = template.views.back || '';
            canvasState.left = '';
            canvasState.right = '';

            // Load initial front canvas state
            if (canvasState.front) {
              isRestoringState = true;
              canvas.loadFromJSON(canvasState.front, () => {
                canvas.requestRenderAll();
                isRestoringState = false;
                syncLayers();
                checkPrintAreaBoundaries();
                generateAllThumbnails();
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
        // Run auth status check
        checkUser();

        initCanvas();

        // Check if editing a template
        const params = new URLSearchParams(window.location.search);
        const templateId = params.get('templateId');
        const styleParam = params.get('style');
        
        if (templateId) {
          await loadSavedTemplate(templateId);
        } else if (styleParam) {
          let mappedStyle = styleParam;
          if (styleParam === 'long') {
            mappedStyle = 'hoodie';
          } else if (styleParam === 'polo' || styleParam === 'tank') {
            mappedStyle = 'tee';
            alert(`The selected collection style is designed using Unisex Atelier Tee template.`);
          }
          
          if (STYLES[mappedStyle]) {
            style.value = mappedStyle;
            onStyleChange();
          }
        }

        // Handle file drop zones
        initUpload();

        saveHistory();
        generateAllThumbnails();
      });

      function checkUser() {
        const userJson = localStorage.getItem('erp_user') || localStorage.getItem('currentUser');
        if (userJson) {
          try {
            currentUser.value = JSON.parse(userJson);
          } catch (e) {
            console.error(e);
          }
        }
      }

      function logout() {
        localStorage.removeItem('erp_user');
        localStorage.removeItem('currentUser');
        currentUser.value = null;
        window.location.reload();
      }

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
        currentUser,
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
        activeMockupUrl,
        activeMaskUrl,
        thumbnailState,
        isOutsidePrintArea,
        history,
        historyIndex,
        canUndo,
        canRedo,
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
        submitCheckout,
        logout,
        alignCenterH,
        alignCenterV,
        flipObjectH,
        flipObjectV,
        bringForward,
        sendBackward,
        duplicateLayer,
        zoomIn,
        zoomOut,
        rotateRight,
        undo,
        redo
      };
    }
  }).mount('#app');
})();
