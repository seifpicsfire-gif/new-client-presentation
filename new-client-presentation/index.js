// Main Presentation Controller
document.addEventListener("DOMContentLoaded", () => {
  let currentSlideId = 1;
  const totalSlides = presentationSlides.length;
  let autoplayInterval = null;
  let isAutoplayActive = false;
  const autoplayDuration = 6000; // 6 seconds per slide

  // DOM Elements
  const slideViewport = document.getElementById("slideViewport");
  const slideIndicator = document.getElementById("slideIndicator");
  const btnPrev = document.getElementById("btnPrev");
  const btnNext = document.getElementById("btnNext");
  const sidebarMenu = document.getElementById("sidebarMenu");
  const sidebarNav = document.getElementById("sidebarNav");
  const sidebarToggle = document.getElementById("sidebarToggle");
  const breadcrumbSection = document.getElementById("breadcrumbSection");
  const btnHelp = document.getElementById("btnHelp");
  const btnAutoplay = document.getElementById("btnAutoplay");
  const btnFullscreen = document.getElementById("btnFullscreen");
  const autoplayIcon = document.getElementById("autoplayIcon");
  const fullscreenIcon = document.getElementById("fullscreenIcon");
  const autoplayStatus = document.getElementById("autoplayStatus");
  const helpModalOverlay = document.getElementById("helpModalOverlay");
  const btnCloseHelp = document.getElementById("btnCloseHelp");
  const fullscreenToast = document.getElementById("fullscreenToast");

  // Initialize presentation
  init();

  function init() {
    renderSidebar();
    goToSlide(1);
    setupEventListeners();
  }

  // 1. Render Sidebar Navigation
  function renderSidebar() {
    sidebarMenu.innerHTML = "";
    presentationSections.forEach((sec) => {
      // Find the first slide for this section to navigate to
      const firstSlide = presentationSlides.find((s) => s.sectionId === sec.id);
      const slideCount = presentationSlides.filter((s) => s.sectionId === sec.id).length;

      const li = document.createElement("li");
      li.className = "menu-section";
      
      const a = document.createElement("a");
      a.className = "menu-item";
      a.id = `sidebar-sec-${sec.id}`;
      a.innerHTML = `
        <span class="menu-item-text">${sec.title}</span>
        <span class="menu-item-badge">${slideCount}</span>
      `;

      a.addEventListener("click", () => {
        if (firstSlide) {
          goToSlide(firstSlide.id);
          sidebarNav.classList.remove("open");
        }
      });

      li.appendChild(a);
      sidebarMenu.appendChild(li);
    });
  }

  // 2. Main Slide Navigation Function
  function goToSlide(slideId) {
    if (slideId < 1 || slideId > totalSlides) return;
    
    currentSlideId = slideId;
    const slide = presentationSlides.find((s) => s.id === slideId);
    if (!slide) return;

    slideViewport.style.opacity = 0;
    
    setTimeout(() => {
      renderSlide(slide);
      updateControls(slide);
      slideViewport.style.opacity = 1;
    }, 200);
  }

  // 3. Render HTML structure for the selected slide
  function renderSlide(slide) {
    slideViewport.innerHTML = "";

    const wrapper = document.createElement("div");
    wrapper.className = `slide-wrapper active visual-${slide.visualType}`;

    const data = slide.visualData || {};

    // Template A: Cover Layout
    if (slide.visualType === "cover") {
      wrapper.innerHTML = `
        <div class="cover-layout-grid">
          <!-- Right side content -->
          <div class="cover-content">
            <div class="cover-header-badge">
              <span class="badge-dot"></span>
              <span class="badge-text">Digital Solutions</span>
            </div>
            <h1 class="cover-main-title">${slide.title}</h1>
            <p class="cover-main-subtitle">${slide.subtitle}</p>
            <ul class="cover-features-list">
              ${slide.points.map(p => `
                <li class="cover-feature-item">
                  <i class="fas fa-check-circle feature-check-icon"></i>
                  <span>${p}</span>
                </li>
              `).join("")}
            </ul>
            <div class="cover-footer-badges">
              <div class="footer-badge">
                <i class="fas fa-layer-group"></i>
                <span>20 شريحة تفصيلية</span>
              </div>
              <div class="footer-badge">
                <i class="fas fa-project-diagram"></i>
                <span>6 أقسام رئيسية</span>
              </div>
              <div class="footer-badge">
                <i class="fas fa-handshake"></i>
                <span>خطة شراكة نمو</span>
              </div>
            </div>
          </div>
          
          <!-- Left side photo card -->
          <div class="cover-photo-container">
            <div class="medical-photo-card">
              <div class="photo-card-header">
                <span class="photo-logo">Digital <span>Solutions</span></span>
                <span class="photo-badge">شراكة نمو 2026</span>
              </div>
              <div class="photo-card-img" style="background-image: url('${data.image || "assets/604628362_835585052576697_7636865557497907385_n.jpg"}');"></div>
              <div class="photo-card-footer">
                <p class="photo-footer-text">رعاية صحية وتطوير رقمي متكامل</p>
              </div>
            </div>
          </div>
        </div>
      `;
    }
    // Template B: Section Divider Layout
    else if (slide.visualType === "divider") {
      wrapper.innerHTML = `
        <div class="divider-layout">
          <div class="divider-badge">قسم رئيسي من العرض التقديمي</div>
          <h1 class="divider-title">${slide.title}</h1>
          <p class="divider-subtitle">${slide.subtitle}</p>
          <div class="divider-icon-bg">
            <i class="fas fa-heart-pulse"></i>
          </div>
        </div>
      `;
    }
    // Template D: Full Width Comparison Layout (Slide 4 and 5)
    else if (slide.visualType === "comparison") {
      wrapper.innerHTML = `
        <div class="full-comparison-layout">
          <div class="slide-title-area">
            <h2 class="slide-title">${slide.title}</h2>
            <div class="slide-subtitle">${slide.subtitle}</div>
          </div>
          
          <div class="comparison-columns-grid">
            <!-- Column Right (Ours) -->
            <div class="comparison-column-card primary-theme">
              <h3 class="column-card-title">
                <i class="fas fa-star-of-life"></i>
                <span>${data.left.title}</span>
              </h3>
              <ul class="column-items-list">
                ${data.left.items.map(item => `
                  <li class="column-item">
                    <span class="item-check"><i class="fas fa-check"></i></span>
                    <span class="item-text">${item}</span>
                  </li>
                `).join("")}
              </ul>
            </div>
            
            <!-- Column Left (Al-Mokhtabar) -->
            <div class="comparison-column-card accent-theme">
              <h3 class="column-card-title">
                <i class="fas fa-landmark"></i>
                <span>${data.right.title}</span>
              </h3>
              <ul class="column-items-list">
                ${data.right.items.map(item => `
                  <li class="column-item">
                    <span class="item-check"><i class="fas fa-check"></i></span>
                    <span class="item-text">${item}</span>
                  </li>
                `).join("")}
              </ul>
            </div>
          </div>
          
          <!-- Summary/Takeaway bar at the bottom -->
          <div class="comparison-takeaway-card">
            <div class="takeaway-badge">الخلاصة الاستراتيجية</div>
            <div class="takeaway-text">${data.footer}</div>
          </div>
        </div>
      `;
    }
    // Template H: Full Width Horizontal Timeline (Slide 10)
    else if (slide.visualType === "timeline") {
      wrapper.innerHTML = `
        <div class="full-timeline-layout">
          <div class="slide-title-area">
            <h2 class="slide-title">${slide.title}</h2>
            <div class="slide-subtitle">${slide.subtitle}</div>
          </div>
          
          <div class="timeline-horizontal-flow">
            <div class="timeline-bar-line"></div>
            ${(data.steps || []).map((step, idx) => `
              <div class="timeline-horizontal-step">
                <div class="step-circle-badge" style="background-color: ${idx === 0 ? "var(--color-primary)" : idx === 1 ? "var(--color-accent)" : idx === 2 ? "var(--pastel-purple)" : "var(--pastel-blue)"};">
                  ${idx + 1}
                </div>
                <h4 class="step-title">${step.title}</h4>
                <p class="step-desc">${step.desc}</p>
              </div>
            `).join("")}
          </div>
          
          <div class="timeline-footer-points">
            <div class="points-grid-2x2">
              ${slide.points.map((p, idx) => `
                <div class="timeline-point-card">
                  <span class="point-num-label">${idx + 1}</span>
                  <p class="point-text">${p}</p>
                </div>
              `).join("")}
            </div>
          </div>
        </div>
      `;
    }
    // Template G: Advertising Idea Custom Split Layout (Slides 14 to 18)
    else if (slide.visualType === "ad-card") {
      wrapper.innerHTML = `
        <div class="ad-card-layout-grid">
          <!-- Left side photo/illustration card -->
          <div class="ad-photo-container">
            <div class="medical-photo-card height-100">
              <div class="photo-card-header">
                <span class="photo-logo">Digital <span>Solutions</span></span>
                <span class="photo-badge">فكرة إعلانية مبتكرة</span>
              </div>
              <div class="photo-card-img" style="background-image: url('${data.image || "assets/604628362_835585052576697_7636865557497907385_n.jpg"}');"></div>
              <div class="photo-card-footer gradient-overlay">
                <h4 class="photo-title">${slide.title}</h4>
              </div>
            </div>
          </div>
          
          <!-- Right side content (Blocks: Problem, Ad Idea, CTA) -->
          <div class="ad-blocks-container">
            <div class="slide-title-area compact">
              <h2 class="slide-title">${slide.title}</h2>
              <div class="slide-subtitle">${slide.subtitle}</div>
            </div>
            
            <div class="ad-blocks-list">
              <!-- Block 1: Problem -->
              <div class="ad-block-card border-purple">
                <div class="ad-block-badge purple-bg">
                  <i class="fas fa-circle-question"></i>
                  <span>المشكلة</span>
                </div>
                <div class="ad-block-content">
                  <p>${data.problem}</p>
                </div>
              </div>
              
              <!-- Block 2: Ad Idea -->
              <div class="ad-block-card border-green">
                <div class="ad-block-badge green-bg">
                  <i class="fas fa-lightbulb"></i>
                  <span>الفكرة الإعلانية</span>
                </div>
                <div class="ad-block-content">
                  <p>${data.idea}</p>
                </div>
              </div>
              
              <!-- Block 3: CTA -->
              <div class="ad-block-card border-blue">
                <div class="ad-block-badge blue-bg">
                  <i class="fas fa-bullhorn"></i>
                  <span>الـ CTA المقترح</span>
                </div>
                <div class="ad-block-content">
                  <p class="cta-highlight-text">${data.cta}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }
    // Template J: Closing/Contact Layout (Slide 20)
    else if (slide.visualType === "closing") {
      wrapper.innerHTML = `
        <div class="closing-layout-grid">
          <!-- Right side contact details & points -->
          <div class="closing-content">
            <div class="slide-title-area">
              <h2 class="slide-title">${slide.title}</h2>
              <div class="slide-subtitle">${slide.subtitle}</div>
            </div>
            
            <ul class="closing-points-list">
              ${slide.points.map((p, idx) => `
                <li class="closing-point-item">
                  <span class="closing-point-marker">${idx + 1}</span>
                  <span>${p}</span>
                </li>
              `).join("")}
            </ul>
            
            <div class="contact-card-box">
              <h4 class="contact-card-title">تواصل مباشر لبدء الشراكة</h4>
              <div class="contact-details-grid">
                <div class="contact-detail-row">
                  <div class="contact-icon"><i class="fas fa-building"></i></div>
                  <div class="contact-info-text">
                    <span class="info-label">الشركة المنفذة</span>
                    <span class="info-val">${data.contact.company}</span>
                  </div>
                </div>
                
                <div class="contact-detail-row">
                  <div class="contact-icon"><i class="fas fa-envelope"></i></div>
                  <div class="contact-info-text">
                    <span class="info-label">البريد الإلكتروني</span>
                    <span class="info-val">${data.contact.email}</span>
                  </div>
                </div>
                
                <div class="contact-detail-row">
                  <div class="contact-icon"><i class="fas fa-phone"></i></div>
                  <div class="contact-info-text">
                    <span class="info-label">رقم الهاتف</span>
                    <span class="info-val">${data.contact.phone}</span>
                  </div>
                </div>
                
                <div class="contact-detail-row">
                  <div class="contact-icon"><i class="fas fa-map-marker-alt"></i></div>
                  <div class="contact-info-text">
                    <span class="info-label">المقر الرئيسي</span>
                    <span class="info-val">${data.contact.address}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Left side large photo card -->
          <div class="closing-photo-container">
            <div class="medical-photo-card height-100">
              <div class="photo-card-header">
                <span class="photo-logo">Digital <span>Solutions</span></span>
                <span class="photo-badge">الخطوة القادمة</span>
              </div>
              <div class="photo-card-img" style="background-image: url('${data.image || "assets/604628362_835585052576697_7636865557497907385_n.jpg"}');"></div>
              <div class="photo-card-footer">
                <p class="photo-footer-text">جاهزون لبدء القياس وبناء خط الأساس</p>
              </div>
            </div>
          </div>
        </div>
      `;
    }
    // Standard Split Screen Layout (For cards, metrics, hub, ad-intro, standard)
    else {
      const grid = document.createElement("div");
      grid.className = "slide-grid";

      // Right column: Points
      const textCol = document.createElement("div");
      textCol.className = "points-container";
      
      const titleArea = document.createElement("div");
      titleArea.className = "slide-title-area";
      titleArea.innerHTML = `
        <h2 class="slide-title">${slide.title}</h2>
        <div class="slide-subtitle">${slide.subtitle}</div>
      `;
      textCol.appendChild(titleArea);

      if (slide.points && slide.points.length > 0) {
        const list = document.createElement("ul");
        list.className = "points-list";
        slide.points.forEach((p, idx) => {
          const li = document.createElement("li");
          li.className = "point-item";
          li.innerHTML = `
            <span class="point-marker">${idx + 1}</span>
            <span>${p}</span>
          `;
          list.appendChild(li);
        });
        textCol.appendChild(list);
      }
      grid.appendChild(textCol);

      // Left column: Visual Panel
      const visualCol = document.createElement("div");
      visualCol.className = "visual-panel";
      visualCol.innerHTML = renderVisualComponent(slide);
      grid.appendChild(visualCol);

      wrapper.appendChild(grid);
    }

    slideViewport.appendChild(wrapper);
  }

  // 4. Render visual widget inside standard visual panel
  function renderVisualComponent(slide) {
    const type = slide.visualType;
    const data = slide.visualData || {};

    switch (type) {
      // Template C: Icon Cards Grid (3 or 4 cards)
      case "cards":
        let cardsHTML = `<div class="cards-grid vertical-stack">`;
        (data.cards || []).forEach((c, idx) => {
          let faIcon = mapIcon(c.icon);
          let colorClass = idx === 0 ? "pastel-blue-bg" : idx === 1 ? "pastel-green-bg" : idx === 2 ? "pastel-purple-bg" : "pastel-rose-bg";
          cardsHTML += `
            <div class="card-item hover-effect">
              <div class="card-icon-circle ${colorClass}"><i class="${faIcon}"></i></div>
              <div class="card-content-text">
                <h4 class="card-title">${c.title}</h4>
                <p class="card-desc">${c.desc}</p>
              </div>
            </div>
          `;
        });
        cardsHTML += `</div>`;
        return cardsHTML;

      // Template F: Big Number Circles (Renders 3 vertical lists/badges)
      case "metrics":
        let metricsHTML = `<div class="metrics-vertical-list">`;
        (data.metrics || []).forEach((m, idx) => {
          let colorClass = idx === 0 ? "pastel-purple-bg" : idx === 1 ? "pastel-green-bg" : "pastel-blue-bg";
          metricsHTML += `
            <div class="metric-row-card">
              <div class="metric-circle ${colorClass}">${m.val}</div>
              <div class="metric-details">
                <h4 class="metric-title">${m.title}</h4>
                <p class="metric-desc">${m.desc}</p>
              </div>
            </div>
          `;
        });
        metricsHTML += `</div>`;
        return metricsHTML;

      // Template E: Hub & Spoke Diagram
      case "hub":
        let hubHTML = `
          <div class="hub-diagram-container">
            <div class="hub-center-node">
              <div class="hub-center-circle">
                <i class="fas ${data.center.icon}"></i>
                <span>${data.center.text}</span>
              </div>
            </div>
            <div class="hub-spokes-list">
        `;
        (data.spokes || []).forEach((s, idx) => {
          let colorClass = idx === 0 ? "pastel-blue-bg" : idx === 1 ? "pastel-green-bg" : "pastel-purple-bg";
          hubHTML += `
            <div class="hub-spoke-row">
              <div class="hub-spoke-line"></div>
              <div class="hub-spoke-badge ${colorClass}">${idx + 1}</div>
              <div class="hub-spoke-content">
                <h4 class="hub-spoke-title">${s.title}</h4>
                <p class="hub-spoke-desc">${s.desc}</p>
              </div>
            </div>
          `;
        });
        hubHTML += `</div></div>`;
        return hubHTML;

      // Ad Intro Banner Layout (Slide 13)
      case "ad-intro":
        let adIcon = mapIcon(data.icon);
        return `
          <div class="ad-intro-card">
            <div class="ad-intro-icon-circle"><i class="${adIcon}"></i></div>
            <h3 class="ad-intro-title">${data.title}</h3>
            <p class="ad-intro-desc">${data.desc}</p>
            <div class="ad-intro-footer">
              <span class="footer-badge-item"><i class="fas fa-heart"></i> نهج إنساني</span>
              <span class="footer-badge-item"><i class="fas fa-chart-line"></i> نتائج مقاسة</span>
            </div>
          </div>
        `;

      case "standard":
      default:
        let svgIcon = "project-diagram";
        if (slide.title.includes("المميزات")) svgIcon = "star";
        if (slide.title.includes("محتوى")) svgIcon = "file-video";
        if (slide.title.includes("خطة")) svgIcon = "calendar-alt";
        if (slide.title.includes("الهدف")) svgIcon = "crosshairs";
        
        return `
          <div class="standard-visual-box">
            <div class="standard-visual-icon"><i class="fas fa-${svgIcon}"></i></div>
            <h3 class="standard-visual-title">${slide.title}</h3>
            <p class="standard-visual-desc">شراكة نمو متكاملة تهدف لإبراز التميز الطبي وتحويله لنجاح تسويقي ملموس ومقاس.</p>
          </div>
        `;
    }
  }

  // 5. Map abstract icon name to FontAwesome 6 classes
  function mapIcon(iconName) {
    const icons = {
      "clock": "far fa-clock",
      "home": "fas fa-house-chimney",
      "whatsapp": "fab fa-whatsapp",
      "user-md": "fas fa-user-md",
      "microscope": "fas fa-microscope",
      "search": "fas fa-magnifying-glass",
      "users": "fas fa-users",
      "map-marker": "fas fa-map-location-dot",
      "shopping-cart": "fas fa-cart-shopping",
      "table": "fas fa-table-list",
      "filter": "fas fa-filter",
      "cogs": "fas fa-gears",
      "briefcase": "fas fa-briefcase",
      "bullhorn": "fas fa-bullhorn",
      "trophy": "fas fa-trophy",
      "arrow-down": "fas fa-arrow-down-long",
      "money": "fas fa-hand-holding-dollar",
      "eye": "far fa-eye",
      "comment-medical": "fas fa-comment-medical",
      "check-circle": "fas fa-circle-check",
      "project-diagram": "fas fa-diagram-project",
      "mobile-alt": "fas fa-mobile-screen-button",
      "magic": "fas fa-wand-magic-sparkles",
      "handshake": "fas fa-handshake",
      "coins": "fas fa-coins",
      "building": "fas fa-building",
      "file-alt": "fas fa-file-invoice",
      "user-tie": "fas fa-user-tie",
      "analytics": "fas fa-chart-simple",
      "lightbulb": "far fa-lightbulb",
      "landmark": "fas fa-building-columns",
      "photo-video": "fas fa-photo-film",
      "award": "fas fa-award",
      "shipping-fast": "fas fa-truck-fast",
      "file-pdf": "far fa-file-pdf",
      "calendar-alt": "far fa-calendar-alt",
      "balance-scale": "fas fa-scale-balanced"
    };
    return icons[iconName] || "fas fa-circle-question";
  }

  // 6. Update presentation controls, indicators, and active classes
  function updateControls(slide) {
    btnPrev.disabled = currentSlideId === 1;
    btnNext.disabled = currentSlideId === totalSlides;

    slideIndicator.textContent = `شريحة ${currentSlideId} من ${totalSlides}`;

    const currentSection = presentationSections.find((s) => s.id === slide.sectionId);
    if (currentSection) {
      breadcrumbSection.textContent = currentSection.title;
    }

    document.querySelectorAll(".menu-item").forEach((item) => {
      item.classList.remove("active");
    });
    const activeSidebarLink = document.getElementById(`sidebar-sec-${slide.sectionId}`);
    if (activeSidebarLink) {
      activeSidebarLink.classList.add("active");
      activeSidebarLink.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }

  // 7. Event Listeners Setup
  function setupEventListeners() {
    btnPrev.addEventListener("click", prevSlide);
    btnNext.addEventListener("click", nextSlide);

    sidebarToggle.addEventListener("click", () => {
      sidebarNav.classList.toggle("open");
    });

    document.addEventListener("keydown", handleKeyDown);

    btnHelp.addEventListener("click", () => {
      helpModalOverlay.classList.add("show");
    });
    btnCloseHelp.addEventListener("click", () => {
      helpModalOverlay.classList.remove("show");
    });
    helpModalOverlay.addEventListener("click", (e) => {
      if (e.target === helpModalOverlay) {
        helpModalOverlay.classList.remove("show");
      }
    });

    btnAutoplay.addEventListener("click", toggleAutoplay);
    btnFullscreen.addEventListener("click", toggleFullscreen);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    // Swipe support for touch screens
    let touchStartX = 0;
    let touchEndX = 0;
    slideViewport.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });
    slideViewport.addEventListener("touchend", (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    });

    function handleSwipe() {
      const threshold = 50;
      if (touchStartX - touchEndX > threshold) {
        nextSlide(); // RTL: Swipe left -> Next
      } else if (touchEndX - touchStartX > threshold) {
        prevSlide(); // RTL: Swipe right -> Prev
      }
    }
  }

  function nextSlide() {
    if (currentSlideId < totalSlides) {
      goToSlide(currentSlideId + 1);
    } else {
      if (isAutoplayActive) {
        stopAutoplay();
      }
    }
  }

  function prevSlide() {
    if (currentSlideId > 1) {
      goToSlide(currentSlideId - 1);
    }
  }

  function handleKeyDown(e) {
    if (["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) return;

    switch (e.code) {
      case "ArrowLeft": // RTL Forward
      case "Space":
      case "PageDown":
        e.preventDefault();
        nextSlide();
        break;
      case "ArrowRight": // RTL Backward
      case "PageUp":
        e.preventDefault();
        prevSlide();
        break;
      case "KeyF":
        e.preventDefault();
        toggleFullscreen();
        break;
      case "KeyA":
        e.preventDefault();
        toggleAutoplay();
        break;
      case "Escape":
        helpModalOverlay.classList.remove("show");
        break;
    }
  }

  function toggleFullscreen() {
    const container = document.documentElement;

    if (!document.fullscreenElement) {
      container.requestFullscreen()
        .then(() => {
          showToast("تم تفعيل وضع ملء الشاشة. اضغط ESC للخروج.");
        })
        .catch((err) => {
          console.error("Error enabling fullscreen:", err);
        });
    } else {
      document.exitFullscreen();
    }
  }

  function handleFullscreenChange() {
    if (document.fullscreenElement) {
      fullscreenIcon.className = "fas fa-compress";
      btnFullscreen.setAttribute("title", "إنهاء ملء الشاشة");
    } else {
      fullscreenIcon.className = "fas fa-expand";
      btnFullscreen.setAttribute("title", "ملء الشاشة");
      showToast("تم إلغاء وضع ملء الشاشة.");
    }
  }

  function toggleAutoplay() {
    if (isAutoplayActive) {
      stopAutoplay();
    } else {
      startAutoplay();
    }
  }

  function startAutoplay() {
    isAutoplayActive = true;
    autoplayIcon.className = "fas fa-pause";
    btnAutoplay.setAttribute("title", "إيقاف مؤقت للتشغيل التلقائي");
    autoplayStatus.textContent = "تلقائي: فعال (6 ثوان)";
    autoplayStatus.style.color = "var(--color-primary)";
    showToast("تم تفعيل التشغيل التلقائي للعرض.");

    autoplayInterval = setInterval(() => {
      nextSlide();
    }, autoplayDuration);
  }

  function stopAutoplay() {
    isAutoplayActive = false;
    autoplayIcon.className = "fas fa-play";
    btnAutoplay.setAttribute("title", "تشغيل تلقائي");
    autoplayStatus.textContent = "تلقائي: متوقف";
    autoplayStatus.style.color = "var(--color-text-secondary)";
    showToast("تم إيقاف التشغيل التلقائي.");

    if (autoplayInterval) {
      clearInterval(autoplayInterval);
      autoplayInterval = null;
    }
  }

  function showToast(message) {
    const toastText = document.getElementById("toastText");
    toastText.textContent = message;
    
    fullscreenToast.classList.add("show");
    
    setTimeout(() => {
      fullscreenToast.classList.remove("show");
    }, 3000);
  }
});
