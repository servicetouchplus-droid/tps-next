// Utilise une classe "App" pour organiser le code
class App {
    constructor() {
        this.deferredPrompt = null;
        this.init();
    }

    // Initialisation du site
    init() {
        console.log('Initialisation du site Touch+ Services');
        this.initMobileMenu();
        this.initThemeToggle();
        this.initSmoothScrolling();
        this.initPreloader();
        this.initScrollAnimations();
        this.initServiceFilters();
        this.initFAQ();
        this.initOrderTracking();
        this.initTestimonialsSlider();
        this.initRealisationsGallery();
        this.initBlogSlider();
        this.initTestimonialSlider();
        this.initBackToTop();
        this.initContactForm();
        this.initCookieConsent();
        this.initPWAFeatures();
        this.initMobileOptimizations();
        this.initServiceWorker();
        this.initLazyLoadMap();
        this.initQuoteCalculator();
        this.initChatBot();
        this.initAuthNavbar();
        
        // Initialiser le curseur personnalisé avec un léger délai
        setTimeout(() => {
            this.initCustomCursor();
        }, 100);
    }

    // NOUVEAU: Mettre à jour la barre de navigation selon la connexion
    initAuthNavbar() {
        const user = window.TouchDb ? window.TouchDb.getCurrentUser() : null;
        if (!user) return;
        
        const navs = document.querySelectorAll('nav');
        navs.forEach(nav => {
            const loginLink = nav.querySelector('a[href*="login.html"]');
            const registerLink = nav.querySelector('a[href*="register.html"]');
            
            if (loginLink) {
                const targetPage = user.role === 'admin' ? 'dashboard-admin.html' : 'dashboard-client.html';
                loginLink.textContent = "Mon Espace";
                loginLink.href = targetPage;
            }
            if (registerLink) {
                registerLink.textContent = "Déconnexion";
                registerLink.href = "#";
                registerLink.style.backgroundColor = "#ef4444";
                registerLink.style.borderColor = "#ef4444";
                registerLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    window.TouchDb.logout();
                });
            }
        });
        
        // Menu mobile
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu) {
            const loginLink = mobileMenu.querySelector('a[href*="login.html"]');
            const registerLink = mobileMenu.querySelector('a[href*="register.html"]');
            
            if (loginLink) {
                const targetPage = user.role === 'admin' ? 'dashboard-admin.html' : 'dashboard-client.html';
                loginLink.textContent = "Mon Espace";
                loginLink.href = targetPage;
            }
            // Retirer ou adapter le bouton d'inscription s'il est là
        }
    }

    // NOUVEAU: Initialiser les fonctionnalités PWA
    initPWAFeatures() {
        // Gérer l'événement beforeinstallprompt
        window.addEventListener('beforeinstallprompt', (e) => {
            // Prévenir Chrome d'afficher le mini-infobar
            e.preventDefault();
            // Stocker l'événement pour pouvoir le déclencher plus tard
            this.deferredPrompt = e;
            // Afficher un bouton d'installation personnalisé si nécessaire
            this.showInstallPromotion();
        });

        // Gérer l'événement appinstalled
        window.addEventListener('appinstalled', () => {
            // Cacher le bouton d'installation
            this.hideInstallPromotion();
            // Effacer l'événement différé
            this.deferredPrompt = null;
            // Optionnel: envoyer des données d'analyse
            console.log('PWA installée avec succès');
        });

        // Gérer le premier chargement en tant qu'application autonome
        if (window.matchMedia('(display-mode: standalone)').matches) {
            console.log('PWA lancée en mode autonome');
        }
    }

    // Afficher une promotion d'installation (exemple)
    showInstallPromotion() {
        // Cette fonction peut être implémentée pour afficher un bouton d'installation personnalisé
        // Par exemple: document.getElementById('install-button').style.display = 'block';
    }

    // Cacher la promotion d'installation
    hideInstallPromotion() {
        // Cette fonction peut être implémentée pour cacher le bouton d'installation
        // Par exemple: document.getElementById('install-button').style.display = 'none';
    }

    // NOUVEAU: Optimisations pour mobile
    initMobileOptimizations() {
        // Détecter si l'utilisateur est sur un appareil mobile
        const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (isMobile) {
            // Désactiver les animations lourdes sur mobile
            this.disableHeavyAnimations();
            
            // Optimiser le chargement des images
            this.optimizeImageLoading();
            
            // Ajuster la navigation pour mobile
            this.adjustMobileNavigation();
        }
        
        // Ajouter un gestionnaire pour l'orientation de l'écran
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                // Réajuster les éléments après changement d'orientation
                this.adjustForOrientation();
            }, 100);
        });
    }

    // Désactiver les animations lourdes sur mobile
    disableHeavyAnimations() {
        const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (reducedMotionQuery.matches) {
            // Supprimer les animations si l'utilisateur préfère moins de mouvement
            const animatedElements = document.querySelectorAll('.animate-on-scroll');
            animatedElements.forEach(el => {
                el.classList.add('is-visible');
                el.style.animation = 'none';
            });
        } else if (window.innerWidth <= 768) {
            // Sur mobile, limiter les animations
            const animatedElements = document.querySelectorAll('.animate-on-scroll');
            animatedElements.forEach((el, index) => {
                // Ne conserver que quelques animations sur mobile
                if (index % 3 !== 0) {
                    el.classList.add('is-visible');
                    el.style.animation = 'none';
                }
            });
        }
    }

    // Optimiser le chargement des images sur mobile
    optimizeImageLoading() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    // Pour mobile, charger une version réduite si disponible
                    const src = window.innerWidth <= 768 && img.dataset.srcMobile 
                        ? img.dataset.srcMobile 
                        : img.dataset.src;
                    
                    img.src = src;
                    img.classList.remove('lazy');
                    img.onload = () => {
                        img.removeAttribute('data-src');
                        img.removeAttribute('data-src-mobile');
                    };
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    // Ajuster la navigation pour mobile
    adjustMobileNavigation() {
        const navbar = document.getElementById('navbar');
        const mobileMenu = document.getElementById('mobile-menu');
        
        // Réduire la hauteur du navbar sur mobile
        if (window.innerWidth <= 768) {
            navbar.style.paddingTop = '0.5rem';
            navbar.style.paddingBottom = '0.5rem';
        }
        
        // Fermer le menu mobile lors du clic sur un lien
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                document.body.classList.remove('overflow-hidden');
            });
        });
    }

    // Ajuster les éléments après changement d'orientation
    adjustForOrientation() {
        // Réinitialiser les hauteurs et largeurs calculées
        const elements = document.querySelectorAll('[data-responsive]');
        elements.forEach(el => {
            el.style.height = '';
            el.style.maxHeight = '';
        });
        
        // Recharger les animations si nécessaire
        this.initScrollAnimations();
    }

    // NOUVEAU: Service Worker
    initServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js').then(registration => {
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                }, err => {
                    console.log('ServiceWorker registration failed: ', err);
                });
            });
        }
    }

    // NOUVEAU: Gestion du préloader
    initPreloader() {
        const preloader = document.getElementById('preloader');
        if (!preloader) return;

        // Réduire le temps d'affichage minimum du préloader
        const minimumDisplayTime = 300; // Réduction de 500ms à 300ms
        let loadStartTime = Date.now();

        const hidePreloader = () => {
            let elapsedTime = Date.now() - loadStartTime;
            let remainingTime = Math.max(0, minimumDisplayTime - elapsedTime);

            setTimeout(() => {
                preloader.classList.add('hidden');
                document.body.classList.remove('overflow-hidden');
                console.log('Préloader masqué');
            }, remainingTime);
        };

        // Pour les ressources critiques
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', hidePreloader);
        } else if (document.readyState === 'interactive') {
            // DOM chargé mais ressources en cours de chargement
            document.addEventListener('DOMContentLoaded', hidePreloader);
        } else {
            // Page complètement chargée
            hidePreloader();
        }
        
        // Ajout d'un timeout de secours pour éviter que le préloader ne reste bloqué
        setTimeout(() => {
            if (preloader && !preloader.classList.contains('hidden')) {
                preloader.classList.add('hidden');
                document.body.classList.remove('overflow-hidden');
                console.log('Préloader masqué (secours)');
            }
        }, 3000); // Timeout après 3 secondes
        
        // Écouter l'événement load pour s'assurer que tout est chargé
        window.addEventListener('load', hidePreloader);
    }

    // NOUVEAU: Lazy Load Google Map
    initLazyLoadMap() {
        const mapIframe = document.getElementById('google-maps-iframe');
        if (!mapIframe) return;

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const iframe = entry.target;
                    iframe.src = iframe.dataset.src;
                    observer.unobserve(iframe);
                }
            });
        });

        observer.observe(mapIframe);
    }

    // NOUVEAU: Calculateur de devis
    initQuoteCalculator() {
        const calculator = document.getElementById('quote-calculator');
        if (!calculator) return;

        const serviceSelect = document.getElementById('quote-service');
        const quantityInput = document.getElementById('quote-quantity');
        const qualityRange = document.getElementById('quote-range');
        const resultEl = document.getElementById('quote-result');

        const rates = {
            tshirt: { base: 3500, qualityMultiplier: [0.8, 1, 1.5] },
            flyer: { base: 100, qualityMultiplier: [0.9, 1, 1.2] },
            carte: { base: 50, qualityMultiplier: [0.9, 1, 1.3] }
        };

        const calculate = () => {
            const service = serviceSelect.value;
            const quantity = parseInt(quantityInput.value) || 0;
            const quality = parseInt(qualityRange.value) - 1; // 0, 1, or 2

            if (!service || quantity <= 0) {
                resultEl.textContent = "0 F CFA";
                return;
            }

            const rate = rates[service];
            const multiplier = rate.qualityMultiplier[quality];
            const total = quantity * rate.base * multiplier;

            resultEl.textContent = `${total.toLocaleString()} F CFA`;
        };

        // Attacher les écouteurs d'événements
        serviceSelect.addEventListener('change', calculate);
        quantityInput.addEventListener('input', calculate);
        qualityRange.addEventListener('input', calculate);

        // Calcul initial
        calculate();
    }

    // NOUVEAU: Chat Simulé
    initChatBot() {
        const chatToggle = document.getElementById('chat-toggle');
        const chatWindow = document.getElementById('chat-window');
        const chatBody = document.getElementById('chat-body');
        const chatOptions = document.getElementById('chat-options');
        const chatClose = document.getElementById('chat-close');
        if (!chatToggle || !chatWindow) return;

        let chatInitialized = false;

        const conversation = {
            start: {
                message: "Bonjour ! Je suis votre assistant virtuel. Comment puis-je vous aider ?",
                options: [
                    { text: "Services", next: "services" },
                    { text: "Devis", next: "devis" },
                    { text: "Suivi de commande", next: "suivi" }
                ]
            },
            devis: {
                message: "Super ! Pour quel type de service souhaitez-vous un devis ?",
                options: [
                    { text: "Impression", next: "contact" },
                    { text: "Textile", next: "contact" },
                    { text: "Packaging", next: "contact" },
                    { text: "Autre", next: "contact" }
                ]
            },
            services: {
                message: "Nous offrons des services d'impression, de confection textile, de packaging et d'objets publicitaires. De quoi avez-vous besoin ?",
                options: [
                    { text: "Je veux un devis", next: "devis" },
                    { text: "Parler à un humain", next: "humain" }
                ]
            },
            suivi: {
                message: "Pour le suivi de commande, le plus simple est de nous contacter directement. Nos agents ont l'information en temps réel.",
                options: [
                    { text: "Contacter par WhatsApp", action: "whatsapp" },
                    { text: "Aller au formulaire", action: "contact_form" }
                ]
            },
            contact: {
                message: "Excellent choix. Le plus simple est de remplir notre formulaire de devis détaillé ou de nous appeler.",
                options: [
                    { text: "Remplir le formulaire", action: "contact_form" },
                    { text: "Contacter par WhatsApp", action: "whatsapp" }
                ]
            },
            humain: {
                message: "Bien sûr. Le moyen le plus rapide est via WhatsApp ou notre formulaire de contact.",
                options: [
                    { text: "Contacter par WhatsApp", action: "whatsapp" },
                    { text: "Remplir le formulaire", action: "contact_form" }
                ]
            }
        };

        const toggleChat = (visible) => {
            if (visible) {
                chatWindow.classList.add('visible');
                if (!chatInitialized) {
                    startConversation();
                    chatInitialized = true;
                }
            } else {
                chatWindow.classList.remove('visible');
            }
        };

        const addMessage = (text, sender) => {
            const messageEl = document.createElement('div');
            messageEl.classList.add('chat-message', sender);
            messageEl.textContent = text;
            chatBody.appendChild(messageEl);
            chatBody.scrollTop = chatBody.scrollHeight;
        };

        const showOptions = (options) => {
            chatOptions.innerHTML = '';
            options.forEach(option => {
                const button = document.createElement('button');
                button.classList.add('chat-option-btn');
                button.textContent = option.text;
                button.addEventListener('click', () => handleOptionClick(option));
                chatOptions.appendChild(button);
            });
        };

        const handleOptionClick = (option) => {
            addMessage(option.text, 'user');
            chatOptions.innerHTML = '';

            setTimeout(() => {
                if (option.next) {
                    const nextStep = conversation[option.next];
                    addMessage(nextStep.message, 'bot');
                    if (nextStep.options) {
                        showOptions(nextStep.options);
                    }
                } else if (option.action) {
                    handleAction(option.action);
                }
            }, 500);
        };

        const handleAction = (action) => {
            toggleChat(false);
            if (action === 'whatsapp') {
                window.open('https://wa.me/2250700000000', '_blank');
            } else if (action === 'contact_form') {
                document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
            }
        };

        const startConversation = () => {
            setTimeout(() => {
                const startStep = conversation.start;
                addMessage(startStep.message, 'bot');
                showOptions(startStep.options);
            }, 500);
        };

        chatToggle.addEventListener('click', () => toggleChat(!chatWindow.classList.contains('visible')));
        chatClose.addEventListener('click', () => toggleChat(false));
    }

    // NOUVEAU: Curseur Personnalisé (version optimisée)
    initCustomCursor() {
        // Vérifier si on est sur un appareil tactile
        if (window.matchMedia("(pointer: coarse)").matches) {
            // Supprimer les éléments de curseur sur les appareils tactiles
            const cursorDot = document.querySelector('.custom-cursor-dot');
            const cursorCircle = document.querySelector('.custom-cursor-circle');
            if (cursorDot) cursorDot.remove();
            if (cursorCircle) cursorCircle.remove();
            return;
        }

        const dot = document.querySelector('.custom-cursor-dot');
        const circle = document.querySelector('.custom-cursor-circle');
        if (!dot || !circle) return;

        // Ajout de la classe pour activer le curseur personnalisé
        document.body.classList.add('custom-cursor-active');

        let mouseX = 0;
        let mouseY = 0;
        let circleX = 0;
        let circleY = 0;
        let isMoving = false;

        // Suivi de la souris avec requestAnimationFrame pour de meilleures performances
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            if (!isMoving) {
                isMoving = true;
                animateCursor();
            }
        });

        const animateCursor = () => {
            // Position du point (suivi direct)
            dot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
            
            // Mouvement fluide du cercle
            circleX += (mouseX - circleX) / 8;
            circleY += (mouseY - circleY) / 8;
            
            circle.style.transform = `translate(${circleX - 20}px, ${circleY - 20}px)`;
            
            // Continuer l'animation si nécessaire
            if (Math.abs(mouseX - circleX) > 0.5 || Math.abs(mouseY - circleY) > 0.5) {
                requestAnimationFrame(animateCursor);
            } else {
                isMoving = false;
            }
        };

        // Écouteurs d'événements pour tous les éléments interactifs
        const hoverElements = document.querySelectorAll('a, button, .service-card, .filter-btn, .realisation-card, .faq-item summary, input, select, textarea, .btn-primary, .btn-secondary');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => circle.classList.add('grow'));
            el.addEventListener('mouseleave', () => circle.classList.remove('grow'));
        });
    }

    // 1. Navbar Scrolling Effect
    initNavbarScrollEffect() {
        const navbar = document.getElementById('navbar');
        if (!navbar) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('navbar-scrolled');
            } else {
                navbar.classList.remove('navbar-scrolled');
            }
        });
    }

    // 2. Mobile Menu Toggle
    initMobileMenu() {
        const toggleBtn = document.getElementById('mobile-menu-toggle');
        const menu = document.getElementById('mobile-menu');
        if (!toggleBtn || !menu) return;

        const toggleMenu = () => menu.classList.toggle('active');

        toggleBtn.addEventListener('click', toggleMenu);
        
        // Ferme le menu en cliquant sur un lien
        menu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (menu.classList.contains('active')) {
                    toggleMenu();
                }
            });
        });
    }

    // 3. Theme Toggle (Dark/Light Mode)
    initThemeToggle() {
        const toggleBtn = document.getElementById('dark-mode-toggle');
        if (!toggleBtn) return;

        // Vérifier le thème stocké
        const storedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = storedTheme || (prefersDark ? 'dark' : 'light');
        const isInitialDark = initialTheme === 'dark';
        
        document.documentElement.classList.toggle('dark', isInitialDark);
        
        const updateIcons = (darkActive) => {
            const sunIcon = toggleBtn.querySelector('#theme-icon-sun, .sun-icon');
            const moonIcon = toggleBtn.querySelector('#theme-icon-moon, .moon-icon');
            if (sunIcon && moonIcon) {
                sunIcon.classList.toggle('hidden', !darkActive);
                moonIcon.classList.toggle('hidden', darkActive);
            }
        };
        
        // Initial state
        updateIcons(isInitialDark);
        
        toggleBtn.addEventListener('click', () => {
            const isDark = document.documentElement.classList.toggle('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            updateIcons(isDark);
        });
    }

    // 4. Smooth Scrolling pour les liens d'ancrage
    initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // NOUVEAU: Animations au scroll (version optimisée)
    initScrollAnimations() {
        // Utiliser l'intersection observer pour de meilleures performances
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -100px 0px', // Réduction de la marge
            threshold: 0.1 // Déclenchement plus tôt
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in-up');
                    observer.unobserve(entry.target); // Ne plus observer une fois animé
                }
            });
        }, observerOptions);

        // Observer les éléments animés
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        animatedElements.forEach(el => observer.observe(el));
    }

    // 5. Filtres des services
    initServiceFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const serviceCards = document.querySelectorAll('.service-card');
        if (filterButtons.length === 0 || serviceCards.length === 0) return;

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Retirer la classe active de tous les boutons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Ajouter la classe active au bouton cliqué
                button.classList.add('active');

                const filter = button.getAttribute('data-filter');

                serviceCards.forEach(card => {
                    if (filter === 'all' || card.getAttribute('data-category') === filter) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // 6. FAQ Toggle
    initFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');
        if (faqItems.length === 0) return;

        faqItems.forEach(item => {
            const summary = item.querySelector('summary');
            summary.addEventListener('click', (e) => {
                e.preventDefault();
                item.classList.toggle('open');
            });
        });
    }

    // 7. Suivi de Commande (BUG 3 FIX - connecté à TouchDb)
    initOrderTracking() {
        const trackingForm = document.getElementById('tracking-form');
        const trackingResult = document.getElementById('tracking-result');
        if (!trackingForm || !trackingResult) return;

        const statusLabels = {
            'Confirmée': { label: 'Commande reçue', color: 'blue', icon: '📋' },
            'Maquette': { label: 'Maquette en cours', color: 'yellow', icon: '🎨' },
            'BAT': { label: 'En attente de validation', color: 'purple', icon: '👁️' },
            'Production': { label: 'En production', color: 'orange', icon: '⚙️' },
            'Livraison': { label: 'En cours de livraison', color: 'teal', icon: '🚚' },
            'Terminée': { label: 'Livrée avec succès', color: 'green', icon: '✅' }
        };

        const colorMap = {
            blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200',
            yellow: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200',
            purple: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 text-purple-800 dark:text-purple-200',
            orange: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 text-orange-800 dark:text-orange-200',
            teal: 'bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-200',
            green: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200',
        };

        trackingForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const orderNumber = document.getElementById('order-number').value.trim();
            if (!orderNumber) return;

            // Afficher un état de chargement
            trackingResult.innerHTML = `
                <div class="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <svg class="w-5 h-5 text-orange-500 animate-spin" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                    </svg>
                    <span class="text-gray-600 dark:text-gray-400 font-medium">Recherche en cours...</span>
                </div>`;

            // Recherche réelle dans la base
            if (window.TouchDb) {
                const result = await window.TouchDb.getOrderById(orderNumber);

                if (!result.success) {
                    trackingResult.innerHTML = `
                        <div class="p-5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                            <div class="flex items-center gap-3 mb-2">
                                <span class="text-2xl">\u274c</span>
                                <h3 class="font-bold text-red-700 dark:text-red-300">Commande non trouvée</h3>
                            </div>
                            <p class="text-sm text-red-600 dark:text-red-400">${result.error}</p>
                            <p class="text-xs text-red-400 mt-2">Vérifiez le numéro et réessayez. Format exemple: TS2026XXXXXX</p>
                        </div>`;
                    return;
                }

                const order = result.order;
                const statusInfo = statusLabels[order.status] || { label: order.status, color: 'blue', icon: '\u2139\ufe0f' };
                const colorClass = colorMap[statusInfo.color] || colorMap.blue;
                const formattedDate = new Date(order.date).toLocaleDateString('fr-FR', {
                    day: 'numeric', month: 'long', year: 'numeric'
                });

                const steps = ['Confirmée', 'Maquette', 'BAT', 'Production', 'Livraison', 'Terminée'];
                const curIdx = steps.indexOf(order.status);

                const stepsHTML = steps.map((s, i) => {
                    const done = i <= curIdx;
                    const current = i === curIdx;
                    return `
                        <div class="flex flex-col items-center">
                            <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                                done ? 'bg-gradient-to-br from-orange-500 to-yellow-400 text-white shadow-md' : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                            } ${current ? 'ring-4 ring-orange-300/40' : ''}">
                                ${done && !current ? '\u2713' : (i + 1)}
                            </div>
                            <p class="text-[9px] text-center mt-1 font-semibold uppercase ${done ? 'text-orange-500' : 'text-gray-400'}">${s}</p>
                        </div>
                        ${i < steps.length - 1 ? `<div class="flex-1 h-0.5 mb-4 ${i < curIdx ? 'bg-orange-400' : 'bg-gray-200 dark:bg-gray-700'}"></div>` : ''}
                    `;
                }).join('');

                let shippingHTML = '';
                if (order.shipping_carrier && order.shipping_tracking) {
                    shippingHTML = `
                        <div class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                            <p class="text-xs font-bold text-gray-400 uppercase mb-2">Informations d'expédition</p>
                            <div class="flex items-center gap-2">
                                <span class="text-sm">🚚</span>
                                <span class="text-sm font-semibold">${order.shipping_carrier}</span>
                                <span class="font-mono text-sm text-blue-500">${order.shipping_tracking}</span>
                            </div>
                        </div>`;
                }

                trackingResult.innerHTML = `
                    <div class="border ${colorClass} rounded-xl p-5">
                        <div class="flex items-center gap-3 mb-4">
                            <span class="text-2xl">${statusInfo.icon}</span>
                            <div>
                                <h3 class="text-lg font-bold">Commande #${order.id}</h3>
                                <p class="text-xs opacity-70">Passée le ${formattedDate} • ${order.quantity} unité(s)</p>
                            </div>
                        </div>
                        <div class="bg-white/50 dark:bg-black/20 rounded-xl p-3 mb-4">
                            <p class="text-sm font-bold mb-1">Statut actuel</p>
                            <p class="text-lg font-black">${statusInfo.label}</p>
                        </div>
                        <div class="flex items-center gap-0 mt-4">${stepsHTML}</div>
                        ${shippingHTML}
                    </div>`;
            } else {
                trackingResult.innerHTML = `<p class="text-sm text-orange-500 font-bold">Service temporairement indisponible. Veuillez réessayer.</p>`;
            }
        });
    }

    // 5. Slider de Témoignages Swiper.js
    initTestimonialSlider() {
        // Vérifier que Swiper est chargé
        if (typeof Swiper === 'undefined') {
            console.warn('Swiper non disponible, slider de témoignages désactivé');
            return;
        }

        new Swiper('.testimonial-slider', {
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            slidesPerView: 1,
            spaceBetween: 30,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 }
            }
        });
    }

    // 6. Slider de témoignages (version optimisée)
    initTestimonialsSlider() {
        // Vérifier que Swiper est chargé
        if (typeof Swiper === 'undefined') {
            console.warn('Swiper non disponible, slider de témoignages désactivé');
            return;
        }
        
        const swiper = new Swiper('.testimonials-swiper', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            autoplay: {
                delay: 4000, // Réduction du délai
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            // Ajout d'effets pour de meilleures performances
            effect: 'slide',
            speed: 600, // Réduction de la vitesse d'animation
        });
    }

    // 7. Filtre Portfolio
    initPortfolioFilter() {
        const filterButtons = document.querySelectorAll('#filter-buttons .filter-btn');
        const portfolioItems = document.querySelectorAll('#portfolio-grid .portfolio-item');
        if (filterButtons.length === 0 || portfolioItems.length === 0) return;

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                const filter = button.getAttribute('data-filter');

                portfolioItems.forEach(item => {
                    if (filter === 'all' || item.getAttribute('data-category') === filter) {
                        item.classList.remove('hidden-item');
                    } else {
                        item.classList.add('hidden-item');
                    }
                });
            });
        });
    }

    // 8. Bouton "Back to Top"
    initBackToTop() {
        const backToTopButton = document.getElementById('back-to-top');
        if (!backToTopButton) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        });
    }

    // 9. Galerie de Réalisations avec Lightbox
    initRealisationsGallery() {
        // Vérifier que lightbox est chargé
        if (typeof lightbox === 'undefined') {
            console.warn('Lightbox non disponible, galerie de réalisations désactivée');
            return;
        }
        
        lightbox.option({
            'resizeDuration': 200,
            'wrapAround': true,
            'disableScrolling': true,
            'fadeDuration': 300,
            'imageFadeDuration': 300,
            'positionFromTop': 50
        });
    }

    // 10. Formulaire de Contact
    initContactForm() {
        const form = document.getElementById('contact-form');
        if (!form) return;

        const inputs = form.querySelectorAll('input, textarea, select');
        const submitBtn = form.querySelector('button[type="submit"]') || document.getElementById('form-submit-btn');
        const successMessage = document.getElementById('form-success');
        const errorMessage = document.getElementById('form-error');

        const validateField = (field) => {
            const value = field.value.trim();
            let isValid = true;

            // Réinitialiser les erreurs
            field.classList.remove('form-input-invalid');
            
            // Validation selon le type de champ
            if (field.hasAttribute('required') && !value) {
                isValid = false;
            } else if (field.type === 'email' && value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) isValid = false;
            } else if (field.id === 'phone' && value) {
                // Validation du numéro de téléphone (Côte d'Ivoire)
                const phoneRegex = /(\+225\s?)?(\d{2}\s?){4,5}\d{2}$/;
                if (!phoneRegex.test(value)) isValid = false;
            }

            if (!isValid) {
                field.classList.add('form-input-invalid');
            }
            
            return isValid;
        };

        const validateForm = () => {
            let isFormValid = true;
            inputs.forEach(input => {
                if (!validateField(input)) {
                    isFormValid = false;
                }
            });
            return isFormValid;
        };

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (!validateForm()) {
                if (errorMessage) errorMessage.classList.remove('hidden');
                return;
            }

            // Désactiver le bouton pendant l'envoi
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Envoi en cours...';
            }

            // Récupérer les valeurs du formulaire (supporte plusieurs nommages d'ID)
            const name = (form.querySelector('#name, #contact-name, [name="name"]')?.value || '').trim();
            const email = (form.querySelector('#email, #contact-email, [type="email"]')?.value || '').trim();
            const phone = (form.querySelector('#phone, #contact-phone, [name="phone"]')?.value || '').trim();
            const service = (form.querySelector('#service, [name="service"]')?.value || '').trim();
            const msg = (form.querySelector('#message, textarea, [name="message"]')?.value || '').trim();

            // Envoyer via TouchDb (connecté à la vraie base)
            if (window.TouchDb) {
                const result = await window.TouchDb.submitContactMessage(name, email, phone, service, msg);
                
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Envoyer le message';
                }

                if (result.success) {
                    // Envoyer un événement à Google Analytics
                    if (typeof gtag === 'function') {
                        gtag('event', 'generate_lead', {
                            'event_category': 'contact',
                            'event_label': service
                        });
                    }
                    if (successMessage) successMessage.classList.remove('hidden');
                    if (errorMessage) errorMessage.classList.add('hidden');
                    form.reset();
                    inputs.forEach(input => input.classList.remove('form-input-invalid'));
                    // Cacher le message de succès après 6 secondes
                    setTimeout(() => {
                        if (successMessage) successMessage.classList.add('hidden');
                    }, 6000);
                } else {
                    if (errorMessage) {
                        errorMessage.textContent = result.error || 'Une erreur est survenue. Réessayez.';
                        errorMessage.classList.remove('hidden');
                    }
                }
            } else {
                // Fallback si TouchDb pas encore chargé
                console.warn('TouchDb non disponible - formulaire contact');
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Envoyer le message';
                }
            }
        });

        inputs.forEach(input => {
            input.addEventListener('input', () => {
                if (input.classList.contains('form-input-invalid')) {
                    validateField(input);
                }
            });
        });
    }
    
    // 11. NOUVEAU: Cookie Consent
    initCookieConsent() {
        const banner = document.getElementById('cookie-consent-banner');
        const acceptBtn = document.getElementById('cookie-accept-btn');
        const declineBtn = document.getElementById('cookie-decline-btn');
        if (!banner || !acceptBtn || !declineBtn) return;

        const consent = localStorage.getItem('cookie_consent');

        if (!consent) {
            setTimeout(() => {
                banner.classList.add('show');
            }, 500);
        }

        const hideBanner = () => banner.classList.remove('show');

        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookie_consent', 'accepted');
            hideBanner();
            // Tu peux initialiser Google Analytics ici
        });

        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookie_consent', 'declined');
            hideBanner();
        });
    }
    
    // 12. NOUVEAU: Slider du blog (version optimisée)
    initBlogSlider() {
        // Vérifier que Swiper est chargé
        if (typeof Swiper === 'undefined') {
            console.warn('Swiper non disponible, slider du blog désactivé');
            return;
        }
        
        const swiper = new Swiper('.blog-swiper', {
            slidesPerView: 1,
            spaceBetween: 20,
            loop: true,
            autoplay: {
                delay: 5000, // Réduction du délai
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                640: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                },
                1024: {
                    slidesPerView: 3,
                    spaceBetween: 30,
                },
            },
            // Ajout d'effets pour de meilleures performances
            effect: 'slide',
            speed: 600, // Réduction de la vitesse d'animation
        });
    }
}

// Lance l'application une fois le DOM chargé
const initApp = () => {
    // S'assurer que l'application se charge même en cas d'erreur
    try {
        new App();
    } catch (error) {
        console.error('Erreur lors de l\'initialisation de l\'application:', error);
        // Masquer le préloader en cas d'erreur
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
        }
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}