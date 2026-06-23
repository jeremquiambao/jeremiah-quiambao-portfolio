/*==================== HOME SPLIT TEXT ====================*/
if (typeof anime !== 'undefined') {
  const professionOne = document.querySelector('.home__profession-1')
  const professionTwo = document.querySelector('.home__profession-2')

  if (professionOne && professionTwo) {
    const { animate, splitText, stagger } = anime
    const { chars: chars1 } = splitText('.home__profession-1', { chars: true })
    const { chars: chars2 } = splitText('.home__profession-2', { chars: true })

    animate(chars1, {
      y: [
        { to: ['100%', '0%'] },
        { to: '-100%', delay: 4000, ease: 'in(3)' }
      ],
      duration: 900,
      ease: 'out(3)',
      delay: stagger(80),
      loop: true,
    })

    animate(chars2, {
      y: [
        { to: ['100%', '0%'] },
        { to: '-100%', delay: 4000, ease: 'in(3)' }
      ],
      duration: 900,
      ease: 'out(3)',
      delay: stagger(80),
      loop: true,
    })
  }
}

/*==================== SWIPER PROJECTS ====================*/
let projectsSwiper = null

/*==================== MOBILE NAVIGATION ====================*/
const initMobileNav = () => {
  const navMenu = document.getElementById('nav-menu')
  const navToggle = document.querySelector('.nav__toggle')
  const navToggleIcon = navToggle?.querySelector('i')

  if (!navMenu || !navToggle) return

  const navLinks = navMenu.querySelectorAll('.nav__link')
  const mobileQuery = window.matchMedia('(max-width: 767px)')

  const setMenuState = (isOpen) => {
    const shouldOpen = Boolean(isOpen && mobileQuery.matches)

    navMenu.classList.toggle('is-open', shouldOpen)
    navToggle.classList.toggle('is-active', shouldOpen)
    navToggle.setAttribute('aria-expanded', String(shouldOpen))
    navToggle.setAttribute(
      'aria-label',
      shouldOpen ? 'Close navigation menu' : 'Open navigation menu'
    )
    document.body.classList.toggle('nav-open', shouldOpen)

    if (navToggleIcon) {
      navToggleIcon.className = shouldOpen ? 'ri-close-line' : 'ri-menu-3-line'
    }
  }

  const closeMenu = (restoreFocus = false) => {
    setMenuState(false)

    if (restoreFocus) {
      navToggle.focus()
    }
  }

  const openMenu = () => {
    setMenuState(true)
  }

  const syncMenuState = () => {
    if (!mobileQuery.matches) {
      closeMenu(false)
      return
    }

    setMenuState(navMenu.classList.contains('is-open'))
  }

  navToggle.addEventListener('click', (event) => {
    event.stopPropagation()

    if (navMenu.classList.contains('is-open')) {
      closeMenu(true)
      return
    }

    openMenu()
  })

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeMenu(false)
    })
  })

  navMenu.addEventListener('click', (event) => {
    if (event.target === navMenu) {
      closeMenu(false)
    }
  })

  document.addEventListener('click', (event) => {
    if (!navMenu.classList.contains('is-open')) return
    if (navMenu.contains(event.target) || navToggle.contains(event.target)) return

    closeMenu(false)
  })

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navMenu.classList.contains('is-open')) {
      closeMenu(true)
    }
  })

  if (typeof mobileQuery.addEventListener === 'function') {
    mobileQuery.addEventListener('change', syncMenuState)
  } else {
    mobileQuery.addListener(syncMenuState)
  }

  window.addEventListener('resize', syncMenuState)
  window.addEventListener('pageshow', () => {
    closeMenu(false)
  })

  setMenuState(false)
  syncMenuState()
}

initMobileNav()

const initSwiper = (selector, options = {}) => {
  if (typeof Swiper === 'undefined') return null

  const swiperElement =
    typeof selector === 'string' ? document.querySelector(selector) : selector

  if (!swiperElement) return null

  const paginationElement = swiperElement.parentElement?.querySelector('.swiper-pagination')
  const {
    autoplay = {
      delay: 3000,
      disableOnInteraction: false,
    },
    ...restOptions
  } = options

  return new Swiper(swiperElement, {
    loop: true,
    spaceBetween: 24,
    slidesPerView: 'auto',
    grabCursor: true,
    speed: 600,

    pagination: {
      el: paginationElement,
      clickable: true,
    },

    autoplay,
    ...restOptions,
  })
}

const mountProjectsSwiper = (slidesCount) => {
  if (projectsSwiper) {
    projectsSwiper.destroy(true, true)
  }

  projectsSwiper = initSwiper('.projects__swiper', {
    loop: slidesCount > 1,
    autoplay:
      slidesCount > 1
        ? {
            delay: 3000,
            disableOnInteraction: false,
          }
        : false,
  })
}

const initProjectFilters = () => {
  const swiperElement = document.querySelector('.projects__swiper')
  const wrapper = swiperElement?.querySelector('.swiper-wrapper')
  const filterButtons = document.querySelectorAll('[data-project-filter]')

  if (!swiperElement || !wrapper) return

  const originalSlides = Array.from(wrapper.children).map((slide) =>
    slide.cloneNode(true)
  )

  const renderSlides = (filter) => {
    const filteredSlides =
      filter === 'all'
        ? originalSlides
        : originalSlides.filter((slide) => slide.dataset.category === filter)

    wrapper.innerHTML = ''

    filteredSlides.forEach((slide) => {
      wrapper.appendChild(slide.cloneNode(true))
    })

    mountProjectsSwiper(filteredSlides.length)
  }

  renderSlides('all')

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.projectFilter

      filterButtons.forEach((item) => {
        const isActive = item === button
        item.classList.toggle('projects__filter--active', isActive)
        item.setAttribute('aria-pressed', String(isActive))
      })

      renderSlides(filter)
    })
  })
}

initProjectFilters()

/*==================== WORK TABS ====================*/
const tabs = document.querySelectorAll('[data-target]')
const tabContents = document.querySelectorAll('[data-content]')

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const targetSelector = tab.dataset.target
    const targetContent = document.querySelector(targetSelector)

    if (!targetContent) return

    tabContents.forEach((content) => content.classList.remove('work-active'))
    tabs.forEach((item) => item.classList.remove('work-active'))

    tab.classList.add('work-active')
    targetContent.classList.add('work-active')
  })
})

/*==================== SERVICES ACCORDION ====================*/
const servicesButtons = document.querySelectorAll('.services__button')
const servicesCards = document.querySelectorAll('.services__card')

servicesButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const currentCard = button.parentNode
    const currentInfo = currentCard.querySelector('.services__info')
    const isCardOpen = currentCard.classList.contains('services-open')

    servicesCards.forEach((card) => {
      card.classList.replace('services-open', 'services-close')

      const info = card.querySelector('.services__info')
      if (info) info.style.height = '0'
    })

    if (!isCardOpen && currentInfo) {
      currentCard.classList.replace('services-close', 'services-open')
      currentInfo.style.height = currentInfo.scrollHeight + 'px'
    }
  })
})

/*==================== TESTIMONIALS OF DUPLICATE CARDS ====================*/
const tracks = document.querySelectorAll('.testimonials__content')

tracks.forEach((track) => {
  if (track.dataset.duplicated === 'true') return

  const cards = [...track.children]

  for (const card of cards) {
    track.appendChild(card.cloneNode(true))
  }

  track.dataset.duplicated = 'true'
})

/*==================== CONTACT FORM ====================*/
const contactForm = document.getElementById('contact-form')
const contactStatus = document.getElementById('contact-status')
const contactSubmit = document.getElementById('contact-submit')

if (contactForm && contactStatus && contactSubmit) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const readContactResponse = async (response) => {
    const raw = await response.text()

    if (!raw) {
      return {
        ok: false,
        message: 'The contact service returned an empty response. Please try again.',
      }
    }

    try {
      return JSON.parse(raw)
    } catch (error) {
      return {
        ok: false,
        message: response.ok
          ? 'The contact service returned an unexpected response.'
          : 'Unable to send your message right now.',
      }
    }
  }

  const setContactStatus = (message, type = '') => {
    contactStatus.textContent = message
    contactStatus.classList.remove('is-success', 'is-error')

    if (type) {
      contactStatus.classList.add(type)
    }
  }

  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault()

    const formData = new FormData(contactForm)
    const payload = {
      name: formData.get('name')?.toString().trim() || '',
      email: formData.get('email')?.toString().trim() || '',
      subject: formData.get('subject')?.toString().trim() || '',
      message: formData.get('message')?.toString().trim() || '',
      company_website: formData.get('company_website')?.toString().trim() || '',
    }

    if (!payload.name || !payload.email || !payload.subject || !payload.message) {
      setContactStatus('Please complete all required fields.', 'is-error')
      return
    }

    if (!emailPattern.test(payload.email)) {
      setContactStatus('Please enter a valid email address.', 'is-error')
      return
    }

    contactSubmit.disabled = true
    contactSubmit.setAttribute('aria-busy', 'true')
    setContactStatus('Sending your message...')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const result = await readContactResponse(response)

      if (!response.ok || !result.ok) {
        throw new Error(result.message || 'Something went wrong. Please try again.')
      }

      contactForm.reset()
      setContactStatus(result.message || 'Your message has been sent successfully.', 'is-success')
    } catch (error) {
      setContactStatus(error.message || 'Unable to send your message right now.', 'is-error')
    } finally {
      contactSubmit.disabled = false
      contactSubmit.removeAttribute('aria-busy')
    }
  })
}

/*==================== CURRENT YEAR OF THE FOOTER ====================*/
const textYear = document.getElementById('footer-year')

if (textYear) {
  textYear.textContent = new Date().getFullYear()
}

/*==================== SCROLL SECTIONS ACTIVE LINK ====================*/
const sections = document.querySelectorAll('section[id]')

const scrollActive = () => {
  const scrollY = window.scrollY

  sections.forEach((section) => {
    const id = section.id
    const top = section.offsetTop - 50
    const height = section.offsetHeight
    const link = document.querySelector('.nav__menu a[href*=' + id + ']')

    if (!link) return

    link.classList.toggle('active-link', scrollY > top && scrollY <= top + height)
  })
}

window.addEventListener('scroll', scrollActive)

/*==================== CASE STUDY ENHANCEMENTS ====================*/
const initCaseStudyEnhancements = () => {
  document.querySelectorAll('.case-study__list li').forEach((item) => {
    item.textContent = item.textContent.replace(/^[^A-Za-z0-9]+/, '').trim()
  })

  const imageTriggers = document.querySelectorAll('.case-study__image-button')

  if (!imageTriggers.length) return

  const lightbox = document.createElement('div')
  lightbox.className = 'case-study-lightbox'
  lightbox.setAttribute('aria-hidden', 'true')
  lightbox.innerHTML = `
    <div class="case-study-lightbox__dialog" role="dialog" aria-modal="true" aria-label="Screenshot viewer">
      <button type="button" class="case-study-lightbox__close" aria-label="Close screenshot viewer">
        <i class="ri-close-line"></i>
      </button>
      <div class="case-study-lightbox__viewport">
        <p class="case-study-lightbox__note">Tap or click the image to zoom in and out.</p>
        <img src="" alt="" class="case-study-lightbox__image">
      </div>
    </div>
  `

  document.body.appendChild(lightbox)

  const lightboxImage = lightbox.querySelector('.case-study-lightbox__image')
  const closeButton = lightbox.querySelector('.case-study-lightbox__close')
  let activeTrigger = null

  const closeLightbox = () => {
    if (!lightbox.classList.contains('is-open')) return

    lightbox.classList.remove('is-open', 'is-zoomed')
    lightbox.setAttribute('aria-hidden', 'true')
    document.body.classList.remove('lightbox-open')
    lightboxImage.removeAttribute('src')

    if (activeTrigger) {
      activeTrigger.focus()
    }
  }

  const openLightbox = (trigger, sourceImage) => {
    activeTrigger = trigger
    lightboxImage.src = sourceImage.currentSrc || sourceImage.src
    lightboxImage.alt = sourceImage.alt
    lightbox.classList.remove('is-zoomed')
    lightbox.classList.add('is-open')
    lightbox.setAttribute('aria-hidden', 'false')
    document.body.classList.add('lightbox-open')
    closeButton.focus()
  }

  imageTriggers.forEach((trigger) => {
    const image = trigger.querySelector('.case-study__image')

    if (!image) return

    trigger.addEventListener('click', () => {
      openLightbox(trigger, image)
    })
  })

  closeButton.addEventListener('click', closeLightbox)

  lightboxImage.addEventListener('click', (event) => {
    event.stopPropagation()
    lightbox.classList.toggle('is-zoomed')
  })

  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) {
      closeLightbox()
    }
  })

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeLightbox()
    }
  })
}

initCaseStudyEnhancements()

/*==================== CUSTOM CURSOR ====================*/
const cursor = document.querySelector('.cursor')
let mouseX = 0
let mouseY = 0

if (cursor) {
  const cursorMove = () => {
    cursor.style.left = `${mouseX}px`
    cursor.style.top = `${mouseY}px`
    cursor.style.transform = 'translate(-50%, -50%)'

    requestAnimationFrame(cursorMove)
  }

  document.addEventListener('mousemove', (event) => {
    mouseX = event.clientX
    mouseY = event.clientY
  })

  cursorMove()

  const links = document.querySelectorAll('a, button')

  links.forEach((item) => {
    item.addEventListener('mouseover', () => {
      cursor.classList.add('hide-cursor')
    })

    item.addEventListener('mouseleave', () => {
      cursor.classList.remove('hide-cursor')
    })
  })
}

/*==================== SCROLL REVEAL ANIMATION ====================*/
if (typeof ScrollReveal !== 'undefined') {
  const sr = ScrollReveal({
    origin: 'top',
    distance: '60px',
    duration: 2000,
    delay: 300,
  })

  sr.reveal('.home__image, .projects__container, .work__container, .testimonials__container, .contact__container')
  sr.reveal('.home__data', { delay: 900, origin: 'bottom' })
  sr.reveal('.home__info', { delay: 1200, origin: 'bottom' })
  sr.reveal('.home__social, .home__cv', { delay: 1500 })
  sr.reveal('.about__data', { origin: 'left' })
  sr.reveal('.about__image', { origin: 'right' })
  sr.reveal('.services__card', { interval: 100 })
  sr.reveal('.case-study__hero, .case-study__section, .case-study__image-wrap', { interval: 100 })
}
