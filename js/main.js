// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  // Close navbar when clicking outside
  document.addEventListener("click", function (e) {
    const navbarCollapse = document.querySelector(".navbar-collapse");
    const navbarToggler = document.querySelector(".navbar-toggler");

    if (
      navbarCollapse.classList.contains("show") &&
      !navbarCollapse.contains(e.target) &&
      !navbarToggler.contains(e.target)
    ) {
      // Bootstrap's collapse API'sini kullan
      const bsCollapse = new bootstrap.Collapse(navbarCollapse);
      bsCollapse.hide();
    }
  });

  // Typing Animation
  const titles = [
    "AI Engineer | Computer Vision & MLOps",
    "Full-Stack ML Developer – TensorFlow & FastAPI",
    "Python Enthusiast Solving Real-World Problems",
    "React / React-Native Dev Bridging UX & AI",
  ];

  const typingText = document.querySelector(".typing-text");
  let titleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingDelay = 70;
  let erasingDelay = 35;
  let newTextDelay = 1500;

  function typeText() {
    const currentTitle = titles[titleIndex];

    if (isDeleting) {
      typingText.textContent = currentTitle.substring(0, charIndex - 1);
      charIndex--;
      typingDelay = erasingDelay;
    } else {
      typingText.textContent = currentTitle.substring(0, charIndex + 1);
      charIndex++;
      typingDelay = 70;
    }

    if (!isDeleting && charIndex === currentTitle.length) {
      typingDelay = newTextDelay;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      titleIndex = (titleIndex + 1) % titles.length;
      typingDelay = 300;
    }

    setTimeout(typeText, typingDelay);
  }

  typeText();

  // Initialize AOS
  AOS.init();

  // Theme Toggle Functionality
  const themeToggle = document.getElementById("theme-toggle");
  const themeIcon = document.getElementById("theme-icon");

  // Check for saved theme preference or default to 'dark'
  const savedTheme = localStorage.getItem("theme") || "dark";
  document.documentElement.setAttribute("data-theme", savedTheme);
  updateThemeIcon(savedTheme);

  themeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    updateThemeIcon(newTheme);
  });

  // Navbar scroll behavior
  const navbar = document.querySelector(".navbar");
  const heroSection = document.querySelector(".hero-section");

  function updateNavbar() {
    if (window.scrollY > heroSection.offsetHeight * 0.2) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }

  // Initial check
  updateNavbar();

  // Add scroll event listener
  window.addEventListener("scroll", updateNavbar);

  // Highlight active nav item
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav-link");

  function highlightNavItem() {
    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      if (window.scrollY >= sectionTop - 100) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", highlightNavItem);
  highlightNavItem(); // Initial check

  // Close navbar collapse when window is resized
  window.addEventListener("resize", function () {
    const navbarCollapse = document.querySelector(".navbar-collapse");
    if (window.innerWidth > 991 && navbarCollapse.classList.contains("show")) {
      navbarCollapse.classList.remove("show");
    }
  });

  // Carousel functionality
  function initCarousel(containerClass) {
    const container = document.querySelector(`.${containerClass}`);
    if (!container) return;

    const wrapper = container.querySelector(".carousel-wrapper");
    const prevBtn = container.querySelector(".carousel-button.prev");
    const nextBtn = container.querySelector(".carousel-button.next");
    let position = 0;
    let autoSlideInterval;
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    let isMouseDown = false;

    const slide = (direction) => {
      const itemWidth = wrapper.children[0].offsetWidth + 32; // width + gap
      const visibleItems = Math.floor(container.offsetWidth / itemWidth);
      const maxPosition = -(wrapper.children.length - visibleItems) * itemWidth;

      position += direction * itemWidth;
      position = Math.min(0, Math.max(position, maxPosition));

      wrapper.style.transform = `translateX(${position}px)`;
    };

    const startAutoSlide = () => {
      autoSlideInterval = setInterval(() => {
        const itemWidth = wrapper.children[0].offsetWidth + 32;
        const visibleItems = Math.floor(container.offsetWidth / itemWidth);
        const maxPosition =
          -(wrapper.children.length - visibleItems) * itemWidth;

        if (position <= maxPosition) {
          position = 0;
        } else {
          position -= itemWidth;
        }

        wrapper.style.transform = `translateX(${position}px)`;
      }, 3000); // Slide every 3 seconds
    };

    const stopAutoSlide = () => {
      clearInterval(autoSlideInterval);
    };

    prevBtn.addEventListener("click", () => {
      stopAutoSlide();
      slide(1);
      startAutoSlide();
    });

    nextBtn.addEventListener("click", () => {
      stopAutoSlide();
      slide(-1);
      startAutoSlide();
    });

    // Add hover handlers for all carousel items
    const carouselItems = wrapper.querySelectorAll(
      ".project-card, .skill-category, .blog-card"
    );
    carouselItems.forEach((item) => {
      item.addEventListener("mouseenter", stopAutoSlide);
      item.addEventListener("mouseleave", startAutoSlide);
    });

    // Add mouse drag functionality
    wrapper.addEventListener("mousedown", (e) => {
      isMouseDown = true;
      startX = e.pageX - wrapper.offsetLeft;
    });

    wrapper.addEventListener("mousemove", (e) => {
      if (!isMouseDown) return;
      e.preventDefault();
      currentX = e.pageX - wrapper.offsetLeft;
      const diff = currentX - startX;
      if (Math.abs(diff) > 50) {
        slide(diff > 0 ? 1 : -1);
        isMouseDown = false;
        startX = e.pageX - wrapper.offsetLeft;
      }
    });

    wrapper.addEventListener("mouseup", () => {
      isMouseDown = false;
    });

    wrapper.addEventListener("mouseleave", () => {
      isMouseDown = false;
    });

    // Touch events
    wrapper.addEventListener(
      "touchstart",
      (e) => {
        isDragging = true;
        startX = e.touches[0].clientX - wrapper.offsetLeft;
        stopAutoSlide();
      },
      { passive: true }
    );

    wrapper.addEventListener("touchmove", (e) => {
      if (!isDragging) return;
      e.preventDefault();
      currentX = e.touches[0].clientX - wrapper.offsetLeft;
      const diff = currentX - startX;
      if (Math.abs(diff) > 50) {
        slide(diff > 0 ? 1 : -1);
        isDragging = false;
      }
    });

    wrapper.addEventListener("touchend", () => {
      isDragging = false;
      startAutoSlide();
    });

    // Start auto-sliding
    startAutoSlide();
  }

  // Initialize carousels
  initCarousel("carousel-projects");
  initCarousel("carousel-blogs");

  // Project filtering functionality
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projectItems = document.querySelectorAll(".project-item");

  // Filter projects based on category
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      // Remove active class from all buttons
      filterBtns.forEach((b) => b.classList.remove("active"));

      // Add active class to clicked button
      this.classList.add("active");

      // Get filter value
      const filterValue = this.getAttribute("data-filter");

      // Filter projects
      projectItems.forEach((item) => {
        if (
          filterValue === "all" ||
          item.getAttribute("data-category") === filterValue
        ) {
          item.classList.remove("hidden");
          setTimeout(() => {
            item.style.display = "block";
          }, 300);
        } else {
          item.classList.add("hidden");
          setTimeout(() => {
            item.style.display = "none";
          }, 300);
        }
      });

      // Reset carousel position
      const carousel = document.querySelector(".carousel-wrapper");
      carousel.style.transform = "translateX(0px)";
    });
  });
});

function updateThemeIcon(theme) {
  const themeIcon = document.getElementById("theme-icon");
  if (theme === "dark") {
    themeIcon.classList.remove("fa-moon");
    themeIcon.classList.add("fa-sun");
  } else {
    themeIcon.classList.remove("fa-sun");
    themeIcon.classList.add("fa-moon");
  }
}

// Skill Progress Bar

document.addEventListener("DOMContentLoaded", function () {
  const skillProgressBars = document.querySelectorAll(".skill-progress");

  // Intersection Observer callback function
  const observerCallback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const progressBar = entry.target;
        const targetWidth = progressBar.getAttribute("data-skill");
        progressBar.style.width = `${targetWidth}%`;
        observer.unobserve(progressBar);
      }
    });
  };

  // Intersection Observer options
  const observerOptions = {
    threshold: 0.5,
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);

  skillProgressBars.forEach((progressBar) => {
    observer.observe(progressBar);
  });
});
