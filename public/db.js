/**
 * TOUCH+ SERVICES - Base de Données & Authentification (db.js)
 * 
 * Ce script gère de manière transparente la persistance des données.
 * - Mode Local : Utilise localStorage (actif par défaut, idéal pour tester).
 * - Mode Cloud : Se connecte à Supabase si window.SUPABASE_CONFIG est rempli.
 */

(function () {
    // Initialisation et vérification de la présence de Supabase
    let isCloudMode = false;
    let supabaseClient = null;

    if (window.SUPABASE_CONFIG && window.SUPABASE_CONFIG.url && window.SUPABASE_CONFIG.anonKey) {
        if (typeof supabase !== 'undefined') {
            try {
                supabaseClient = supabase.createClient(window.SUPABASE_CONFIG.url, window.SUPABASE_CONFIG.anonKey);
                isCloudMode = true;
                console.log("Touch+ DB: Mode Cloud connecté avec Supabase.");
            } catch (err) {
                console.error("Touch+ DB: Erreur d'initialisation de Supabase. Repli sur localStorage.", err);
            }
        } else {
            console.warn("Touch+ DB: Script Supabase non chargé dans l'HTML. Repli sur localStorage.");
        }
    } else {
        console.log("Touch+ DB: Mode Local activé (localStorage).");
    }

    // =========================================================================
    // SEEDING LOCALSTORAGE (Données de test initiales)
    // =========================================================================
    const seedLocalData = () => {
        // Force database seeding update to 12 realisations
        let existingReals = [];
        try {
            existingReals = JSON.parse(localStorage.getItem('touchplus_realisations') || '[]');
        } catch (e) { }
        if (existingReals.length < 12) {
            localStorage.removeItem('touchplus_realisations');
            console.log("Touch+ DB: Updated database to 12 default realisations.");
        }

        if (!localStorage.getItem('touchplus_users')) {
            const defaultUsers = [
                {
                    id: "usr-admin",
                    name: "Admin Touch+ Services",
                    email: "admin@touchplus.ci",
                    phone: "+225 07 00 00 00 00",
                    password: "admin123",
                    role: "admin"
                },
                {
                    id: "usr-client",
                    name: "Koffi Adjoumani",
                    email: "client@test.com",
                    phone: "+225 07 08 09 10 11",
                    password: "client123",
                    role: "client"
                }
            ];
            localStorage.setItem('touchplus_users', JSON.stringify(defaultUsers));
        }

        if (!localStorage.getItem('touchplus_orders')) {
            const defaultOrders = [
                {
                    id: "TS20261109001",
                    client_id: "usr-client",
                    client_name: "Koffi Adjoumani",
                    client_phone: "+225 07 08 09 10 11",
                    product: "tshirt",
                    quantity: 150,
                    notes: "T-shirts pour la campagne marketing. Sérigraphie logo face & dos.",
                    date: "2026-06-25T10:30:00.000Z",
                    status: "Production",
                    mockup_url: "https://via.placeholder.com/800x600/f97316/FFFFFF?text=BAT+Tshirt+MTN+CI",
                    client_comments: "BAT Validé le 26 Juin - Lancement en production.",
                    options: {
                        color: "#f97316",
                        preview_image: "https://via.placeholder.com/400x400/f97316/FFFFFF?text=Tshirt+MTN"
                    }
                },
                {
                    id: "TS20261109002",
                    client_id: "usr-client",
                    client_name: "Koffi Adjoumani",
                    client_phone: "+225 07 08 09 10 11",
                    product: "kakemono",
                    quantity: 5,
                    notes: "Bâche extérieure pour le salon des télécoms.",
                    date: "2026-06-26T14:15:00.000Z",
                    status: "Maquette",
                    mockup_url: null,
                    client_comments: null,
                    options: {
                        color: "#ffffff",
                        preview_image: null
                    }
                }
            ];
            localStorage.setItem('touchplus_orders', JSON.stringify(defaultOrders));
        }

        // NOTE: Les articles blog sont seedés par seedExtendedData() avec le format complet (slug inclus).
        // Suppression du seed ici pour éviter le doublon et utiliser les articles enrichis.
        // Si des anciens articles sans slug existent, on les efface pour forcer le re-seed.
        try {
            const existingArticles = JSON.parse(localStorage.getItem('touchplus_articles') || '[]');
            if (existingArticles.length > 0 && !existingArticles[0].slug) {
                localStorage.removeItem('touchplus_articles');
                console.log('Touch+ DB: Migration articles → format avec slug.');
            }
        } catch(e) {}

        // Seed portfolio realisations
        if (!localStorage.getItem('touchplus_realisations')) {
            const defaultRealisations = [
                {
                    "id": "real-001",
                    "title": "Uniformes Corporate MTN CI",
                    "category": "textile",
                    "client": "MTN Côte d'Ivoire",
                    "image": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
                    "description": "3 000 t-shirts sérigraphiés pour la force de vente nationale, avec impressions haute résolution face & dos.",
                    "featured": true,
                    "date": "2026-05-15",
                    "likes": 42
                },
                {
                    "id": "real-002",
                    "title": "Stands Kakémono SIFCA Group",
                    "category": "grand-format",
                    "client": "SIFCA Group",
                    "image": "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
                    "description": "50 kakémonos et roll-ups pour la participation au SARA 2026, Salon de l'Agriculture.",
                    "featured": true,
                    "date": "2026-04-20",
                    "likes": 31
                },
                {
                    "id": "real-003",
                    "title": "Packaging Premium NOVASTAR",
                    "category": "packaging",
                    "client": "Novastar Foods CI",
                    "image": "https://images.unsplash.com/photo-1586864387789-628af9feed72?w=800&q=80",
                    "description": "Refonte totale du packaging alimentaire : boîtes, sachets et étiquettes avec finition dorure à chaud.",
                    "featured": false,
                    "date": "2026-03-10",
                    "likes": 58
                },
                {
                    "id": "real-004",
                    "title": "Impression Flyers SGBCI Campagne",
                    "category": "impression",
                    "client": "SGBCI",
                    "image": "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80",
                    "description": "50 000 flyers 350g pelliculage brillant pour la campagne de lancement de l'application mobile.",
                    "featured": true,
                    "date": "2026-02-28",
                    "likes": 19
                },
                {
                    "id": "real-005",
                    "title": "Casquettes Brodées SOLIBRA",
                    "category": "textile",
                    "client": "SOLIBRA",
                    "image": "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=800&q=80",
                    "description": "500 casquettes premium avec broderie numérique du logo pour l'équipe événementielle.",
                    "featured": false,
                    "date": "2026-01-15",
                    "likes": 27
                },
                {
                    "id": "real-006",
                    "title": "Signalétique Orange CI Store",
                    "category": "signaletique",
                    "client": "Orange Côte d'Ivoire",
                    "image": "https://images.unsplash.com/photo-1603251579431-8041402bdeda?w=800&q=80",
                    "description": "Habillage complet d'un nouveau point de vente Orange : totem, panneaux directionnels et vitrophanie.",
                    "featured": false,
                    "date": "2025-12-01",
                    "likes": 64
                },
                {
                    "id": "real-007",
                    "title": "Identité Visuelle BOA",
                    "category": "impression",
                    "client": "Bank of Africa",
                    "image": "https://images.unsplash.com/photo-1586281380117-5a60ae2050cc?w=800&q=80",
                    "description": "Impression grand format affiches A0 & cartes de visite premium pour le réseau.",
                    "featured": true,
                    "date": "2026-04-22",
                    "likes": 35
                },
                {
                    "id": "real-008",
                    "title": "Goodies SIAO 2024",
                    "category": "publicitaire",
                    "client": "SIAO",
                    "image": "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&q=80",
                    "description": "Stylos, mugs et sacs personnalisés pour le Salon International de l'Artisanat.",
                    "featured": true,
                    "date": "2026-02-28",
                    "likes": 62
                },
                {
                    "id": "real-009",
                    "title": "Polos Brodés NSIA Banque",
                    "category": "textile",
                    "client": "NSIA Banque",
                    "image": "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80",
                    "description": "200 polos brodés logo et prénom pour l'équipe commerciale terrain.",
                    "featured": false,
                    "date": "2026-01-18",
                    "likes": 24
                },
                {
                    "id": "real-010",
                    "title": "Enseignes Réseau Total",
                    "category": "signaletique",
                    "client": "Total Énergies CI",
                    "image": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
                    "description": "Fabrication et pose de 12 enseignes lumineuses pour stations-service.",
                    "featured": false,
                    "date": "2025-12-05",
                    "likes": 31
                },
                {
                    "id": "real-011",
                    "title": "Kit Évènementiel SIAO VIP",
                    "category": "impression",
                    "client": "SIAO",
                    "image": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
                    "description": "Programmes, badges, bâches et signalétique complète pour la zone VIP.",
                    "featured": false,
                    "date": "2025-11-20",
                    "likes": 14
                },
                {
                    "id": "real-012",
                    "title": "Boîtes de Livraison Jumia",
                    "category": "packaging",
                    "client": "Jumia Côte d'Ivoire",
                    "image": "https://images.unsplash.com/photo-1595079676339-1534801ad6cf?w=800&q=80",
                    "description": "Conception et impression de 10 000 boîtes en carton ondulé biodégradable pour les livraisons à domicile.",
                    "featured": true,
                    "date": "2025-10-15",
                    "likes": 73
                }
            ];
            localStorage.setItem('touchplus_realisations', JSON.stringify(defaultRealisations));
        }
    };

    if (!isCloudMode) {
        seedLocalData();
    }

    // =========================================================================
    // METHODES DE L'API TouchDb
    // =========================================================================
    const TouchDb = {
        isCloud: () => isCloudMode,

        // 1. Inscription
        register: async function (name, email, phone, password, role = 'client') {
            if (isCloudMode) {
                try {
                    // Auth Supabase
                    const { data, error } = await supabaseClient.auth.signUp({
                        email: email,
                        password: password,
                        options: {
                            data: { name: name, phone: phone, role: role }
                        }
                    });
                    if (error) throw error;

                    // Créer le profil dans la table 'profiles'
                    const { error: profileError } = await supabaseClient
                        .from('profiles')
                        .insert([
                            { id: data.user.id, name, email, phone, role }
                        ]);
                    if (profileError) console.error("Erreur profil Supabase:", profileError);

                    return { success: true, user: { id: data.user.id, name, email, phone, role } };
                } catch (err) {
                    return { success: false, error: err.message };
                }
            } else {
                // LocalStorage
                const users = JSON.parse(localStorage.getItem('touchplus_users') || '[]');
                if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
                    return { success: false, error: "Cet email est déjà utilisé." };
                }
                const newUser = {
                    id: "usr-" + Date.now(),
                    name,
                    email,
                    phone,
                    password,
                    role
                };
                users.push(newUser);
                localStorage.setItem('touchplus_users', JSON.stringify(users));
                return { success: true, user: newUser };
            }
        },

        // 2. Connexion
        login: async function (email, password) {
            if (isCloudMode) {
                try {
                    const { data, error } = await supabaseClient.auth.signInWithPassword({
                        email: email,
                        password: password
                    });
                    if (error) throw error;

                    // Récupérer le profil
                    const { data: profile, error: pError } = await supabaseClient
                        .from('profiles')
                        .select('*')
                        .eq('id', data.user.id)
                        .single();

                    let userSession = null;
                    if (pError || !profile) {
                        // Utiliser les métadonnées si la table profil a échoué
                        userSession = {
                            id: data.user.id,
                            name: data.user.user_metadata.name || email,
                            email: email,
                            phone: data.user.user_metadata.phone || "",
                            role: data.user.user_metadata.role || "client"
                        };
                    } else {
                        userSession = profile;
                    }

                    localStorage.setItem('touchplus_session', JSON.stringify(userSession));
                    return { success: true, user: userSession };
                } catch (err) {
                    return { success: false, error: err.message };
                }
            } else {
                // LocalStorage
                const users = JSON.parse(localStorage.getItem('touchplus_users') || '[]');
                const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
                if (!user) {
                    return { success: false, error: "Identifiants incorrects." };
                }
                const userSession = {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    role: user.role
                };
                localStorage.setItem('touchplus_session', JSON.stringify(userSession));
                return { success: true, user: userSession };
            }
        },

        // 3. Déconnexion
        logout: function () {
            localStorage.removeItem('touchplus_session');
            if (isCloudMode) {
                supabaseClient.auth.signOut();
            }
            // Utiliser un chemin absolu pour éviter les redirections relatives
            // depuis /dashboard/client/ ou /dashboard/admin/
            window.location.replace("/login");
        },

        // 4. Utilisateur actuellement connecté
        getCurrentUser: function () {
            const session = localStorage.getItem('touchplus_session');
            return session ? JSON.parse(session) : null;
        },

        // 5. Créer une Commande
        createOrder: async function (product, quantity, notes, options = {}, fileData = null) {
            const user = this.getCurrentUser();
            if (!user) return { success: false, error: "Vous devez être connecté." };

            const orderId = "TS" + Date.now().toString().slice(-10); // Génère un ID unique court

            const newOrder = {
                id: orderId,
                client_id: user.id,
                client_name: user.name,
                client_phone: user.phone,
                product: product,
                quantity: parseInt(quantity) || 1,
                notes: notes,
                date: new Date().toISOString(),
                status: "Confirmée",
                mockup_url: null,
                client_comments: null,
                options: options, // Peut contenir la couleur, l'image du t-shirt personnalisé (base64)
                shipping_carrier: null,
                shipping_tracking: null,
                payment_status: "En attente"
            };

            if (isCloudMode) {
                try {
                    let fileUrl = null;
                    if (fileData && fileData.base64) {
                        // Téléverser le fichier dans Supabase Storage
                        const fileBlob = await (await fetch(fileData.base64)).blob();
                        const filePath = `documents/${orderId}-${fileData.name}`;

                        const { error: uploadError } = await supabaseClient.storage
                            .from('orders')
                            .upload(filePath, fileBlob, { contentType: fileBlob.type });
                        if (uploadError) throw uploadError;

                        const { data } = supabaseClient.storage.from('orders').getPublicUrl(filePath);
                        fileUrl = data.publicUrl;
                        newOrder.options.attached_file = fileUrl;
                    }

                    const { error } = await supabaseClient
                        .from('orders')
                        .insert([newOrder]);
                    if (error) throw error;

                    return { success: true, order: newOrder };
                } catch (err) {
                    return { success: false, error: err.message };
                }
            } else {
                // LocalStorage
                if (fileData && fileData.base64) {
                    newOrder.options.attached_file = fileData.base64; // Sauvegarde directe en local
                    newOrder.options.attached_file_name = fileData.name;
                }
                const orders = JSON.parse(localStorage.getItem('touchplus_orders') || '[]');
                orders.unshift(newOrder);
                localStorage.setItem('touchplus_orders', JSON.stringify(orders));
                return { success: true, order: newOrder };
            }
        },

        // 6. Récupérer les commandes d'un client
        getClientOrders: async function (clientId) {
            if (isCloudMode) {
                try {
                    const { data, error } = await supabaseClient
                        .from('orders')
                        .select('*')
                        .eq('client_id', clientId)
                        .order('date', { ascending: false });
                    if (error) throw error;
                    return { success: true, orders: data };
                } catch (err) {
                    return { success: false, error: err.message, orders: [] };
                }
            } else {
                const orders = JSON.parse(localStorage.getItem('touchplus_orders') || '[]');
                const clientOrders = orders.filter(o => o.client_id === clientId);
                return { success: true, orders: clientOrders };
            }
        },

        // 7. Récupérer TOUTES les commandes (admin)
        getAllOrders: async function () {
            if (isCloudMode) {
                try {
                    const { data, error } = await supabaseClient
                        .from('orders')
                        .select('*')
                        .order('date', { ascending: false });
                    if (error) throw error;
                    return { success: true, orders: data };
                } catch (err) {
                    return { success: false, error: err.message, orders: [] };
                }
            } else {
                const orders = JSON.parse(localStorage.getItem('touchplus_orders') || '[]');
                return { success: true, orders: orders };
            }
        },

        // 8. Modifier le statut d'une commande
        updateOrderStatus: async function (orderId, newStatus) {
            if (isCloudMode) {
                try {
                    const { error } = await supabaseClient
                        .from('orders')
                        .update({ status: newStatus })
                        .eq('id', orderId);
                    if (error) throw error;
                    return { success: true };
                } catch (err) {
                    return { success: false, error: err.message };
                }
            } else {
                const orders = JSON.parse(localStorage.getItem('touchplus_orders') || '[]');
                const idx = orders.findIndex(o => o.id === orderId);
                if (idx !== -1) {
                    orders[idx].status = newStatus;
                    localStorage.setItem('touchplus_orders', JSON.stringify(orders));
                    return { success: true };
                }
                return { success: false, error: "Commande introuvable." };
            }
        },

        // 9. Uploader la maquette BAT (Admin)
        uploadMockupBAT: async function (orderId, fileData) {
            if (isCloudMode) {
                try {
                    // Envoi vers le Storage Supabase
                    const fileBlob = await (await fetch(fileData.base64)).blob();
                    const filePath = `mockups/${orderId}-bat-${Date.now()}`;

                    const { error: uploadError } = await supabaseClient.storage
                        .from('orders')
                        .upload(filePath, fileBlob, { contentType: fileBlob.type });
                    if (uploadError) throw uploadError;

                    const { data } = supabaseClient.storage.from('orders').getPublicUrl(filePath);
                    const mockupUrl = data.publicUrl;

                    // Mise à jour de la table commandes
                    const { error } = await supabaseClient
                        .from('orders')
                        .update({
                            mockup_url: mockupUrl,
                            status: "BAT" // Passe en validation client
                        })
                        .eq('id', orderId);
                    if (error) throw error;

                    return { success: true, mockup_url: mockupUrl };
                } catch (err) {
                    return { success: false, error: err.message };
                }
            } else {
                // LocalStorage
                const orders = JSON.parse(localStorage.getItem('touchplus_orders') || '[]');
                const idx = orders.findIndex(o => o.id === orderId);
                if (idx !== -1) {
                    orders[idx].mockup_url = fileData.base64;
                    orders[idx].status = "BAT"; // En attente validation
                    localStorage.setItem('touchplus_orders', JSON.stringify(orders));
                    return { success: true, mockup_url: fileData.base64 };
                }
                return { success: false, error: "Commande introuvable." };
            }
        },

        // 10. Valider / Refuser le BAT (Client)
        validateBAT: async function (orderId, approved, comments = "") {
            const status = approved ? "Production" : "Maquette";
            const clientComments = approved
                ? `BAT Validé par le client. Commentaire : ${comments}`
                : `BAT Refusé par le client. Corrections demandées : ${comments}`;

            if (isCloudMode) {
                try {
                    const { error } = await supabaseClient
                        .from('orders')
                        .update({
                            status: status,
                            client_comments: clientComments
                        })
                        .eq('id', orderId);
                    if (error) throw error;
                    return { success: true };
                } catch (err) {
                    return { success: false, error: err.message };
                }
            } else {
                // LocalStorage
                const orders = JSON.parse(localStorage.getItem('touchplus_orders') || '[]');
                const idx = orders.findIndex(o => o.id === orderId);
                if (idx !== -1) {
                    orders[idx].status = status;
                    orders[idx].client_comments = clientComments;
                    localStorage.setItem('touchplus_orders', JSON.stringify(orders));
                    return { success: true };
                }
                return { success: false, error: "Commande introuvable." };
            }
        },

        // 11. Mettre à jour les informations d'expédition (Admin)
        updateOrderShipping: async function (orderId, carrier, trackingNumber) {
            if (isCloudMode) {
                try {
                    const { error } = await supabaseClient
                        .from('orders')
                        .update({
                            status: "Livraison",
                            shipping_carrier: carrier,
                            shipping_tracking: trackingNumber
                        })
                        .eq('id', orderId);
                    if (error) throw error;
                    return { success: true };
                } catch (err) {
                    return { success: false, error: err.message };
                }
            } else {
                const orders = JSON.parse(localStorage.getItem('touchplus_orders') || '[]');
                const idx = orders.findIndex(o => o.id === orderId);
                if (idx !== -1) {
                    orders[idx].status = "Livraison";
                    orders[idx].shipping_carrier = carrier;
                    orders[idx].shipping_tracking = trackingNumber;
                    localStorage.setItem('touchplus_orders', JSON.stringify(orders));
                    return { success: true };
                }
                return { success: false, error: "Commande introuvable." };
            }
        },

        // 12. Mettre à jour le statut de paiement (Admin)
        updateOrderPaymentStatus: async function (orderId, paid) {
            const payStatus = paid ? "Payé" : "En attente";
            if (isCloudMode) {
                try {
                    const { error } = await supabaseClient
                        .from('orders')
                        .update({ payment_status: payStatus })
                        .eq('id', orderId);
                    if (error) throw error;
                    return { success: true };
                } catch (err) {
                    return { success: false, error: err.message };
                }
            } else {
                const orders = JSON.parse(localStorage.getItem('touchplus_orders') || '[]');
                const idx = orders.findIndex(o => o.id === orderId);
                if (idx !== -1) {
                    orders[idx].payment_status = payStatus;
                    localStorage.setItem('touchplus_orders', JSON.stringify(orders));
                    return { success: true };
                }
                return { success: false, error: "Commande introuvable." };
            }
        }
    };

    // =========================================================================
    // MÉTHODES ÉTENDUES — Réalisations, Blog, Contact, Newsletter, Stats
    // =========================================================================

    // --- SEED DATA pour les nouvelles tables ---
    const seedExtendedData = () => {

        // RÉALISATIONS (Portfolio)
        if (!localStorage.getItem('touchplus_realisations')) {
            const reals = [
                {
                    "id": "real-001",
                    "title": "Uniformes Corporate MTN CI",
                    "category": "textile",
                    "client": "MTN Côte d'Ivoire",
                    "image": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
                    "description": "3 000 t-shirts sérigraphiés pour la force de vente nationale, avec impressions haute résolution face & dos.",
                    "featured": true,
                    "date": "2026-05-15",
                    "likes": 42
                },
                {
                    "id": "real-002",
                    "title": "Stands Kakémono SIFCA Group",
                    "category": "grand-format",
                    "client": "SIFCA Group",
                    "image": "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
                    "description": "50 kakémonos et roll-ups pour la participation au SARA 2026, Salon de l'Agriculture.",
                    "featured": true,
                    "date": "2026-04-20",
                    "likes": 31
                },
                {
                    "id": "real-003",
                    "title": "Packaging Premium NOVASTAR",
                    "category": "packaging",
                    "client": "Novastar Foods CI",
                    "image": "https://images.unsplash.com/photo-1586864387789-628af9feed72?w=800&q=80",
                    "description": "Refonte totale du packaging alimentaire : boîtes, sachets et étiquettes avec finition dorure à chaud.",
                    "featured": false,
                    "date": "2026-03-10",
                    "likes": 58
                },
                {
                    "id": "real-004",
                    "title": "Impression Flyers SGBCI Campagne",
                    "category": "impression",
                    "client": "SGBCI",
                    "image": "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80",
                    "description": "50 000 flyers 350g pelliculage brillant pour la campagne de lancement de l'application mobile.",
                    "featured": true,
                    "date": "2026-02-28",
                    "likes": 19
                },
                {
                    "id": "real-005",
                    "title": "Casquettes Brodées SOLIBRA",
                    "category": "textile",
                    "client": "SOLIBRA",
                    "image": "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=800&q=80",
                    "description": "500 casquettes premium avec broderie numérique du logo pour l'équipe événementielle.",
                    "featured": false,
                    "date": "2026-01-15",
                    "likes": 27
                },
                {
                    "id": "real-006",
                    "title": "Signalétique Orange CI Store",
                    "category": "signaletique",
                    "client": "Orange Côte d'Ivoire",
                    "image": "https://images.unsplash.com/photo-1603251579431-8041402bdeda?w=800&q=80",
                    "description": "Habillage complet d'un nouveau point de vente Orange : totem, panneaux directionnels et vitrophanie.",
                    "featured": false,
                    "date": "2025-12-01",
                    "likes": 64
                },
                {
                    "id": "real-007",
                    "title": "Identité Visuelle BOA",
                    "category": "impression",
                    "client": "Bank of Africa",
                    "image": "https://images.unsplash.com/photo-1586281380117-5a60ae2050cc?w=800&q=80",
                    "description": "Impression grand format affiches A0 & cartes de visite premium pour le réseau.",
                    "featured": true,
                    "date": "2026-04-22",
                    "likes": 35
                },
                {
                    "id": "real-008",
                    "title": "Goodies SIAO 2024",
                    "category": "publicitaire",
                    "client": "SIAO",
                    "image": "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&q=80",
                    "description": "Stylos, mugs et sacs personnalisés pour le Salon International de l'Artisanat.",
                    "featured": true,
                    "date": "2026-02-28",
                    "likes": 62
                },
                {
                    "id": "real-009",
                    "title": "Polos Brodés NSIA Banque",
                    "category": "textile",
                    "client": "NSIA Banque",
                    "image": "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80",
                    "description": "200 polos brodés logo et prénom pour l'équipe commerciale terrain.",
                    "featured": false,
                    "date": "2026-01-18",
                    "likes": 24
                },
                {
                    "id": "real-010",
                    "title": "Enseignes Réseau Total",
                    "category": "signaletique",
                    "client": "Total Énergies CI",
                    "image": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
                    "description": "Fabrication et pose de 12 enseignes lumineuses pour stations-service.",
                    "featured": false,
                    "date": "2025-12-05",
                    "likes": 31
                },
                {
                    "id": "real-011",
                    "title": "Kit Évènementiel SIAO VIP",
                    "category": "impression",
                    "client": "SIAO",
                    "image": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
                    "description": "Programmes, badges, bâches et signalétique complète pour la zone VIP.",
                    "featured": false,
                    "date": "2025-11-20",
                    "likes": 14
                },
                {
                    "id": "real-012",
                    "title": "Boîtes de Livraison Jumia",
                    "category": "packaging",
                    "client": "Jumia Côte d'Ivoire",
                    "image": "https://images.unsplash.com/photo-1595079676339-1534801ad6cf?w=800&q=80",
                    "description": "Conception et impression de 10 000 boîtes en carton ondulé biodégradable pour les livraisons à domicile.",
                    "featured": true,
                    "date": "2025-10-15",
                    "likes": 73
                }
            ];
            localStorage.setItem('touchplus_realisations', JSON.stringify(reals));
        }

        // ARTICLES BLOG
        if (!localStorage.getItem('touchplus_articles') || JSON.parse(localStorage.getItem('touchplus_articles') || '[]').length === 0) {
            const articles = [
                { id: 'art-001', title: 'Pourquoi une identité visuelle forte est cruciale pour votre PME à Abidjan', slug: 'identite-visuelle-pme-abidjan', category: 'Branding', excerpt: 'Découvrez comment un logo et une charte graphique professionnels peuvent transformer la perception de votre marque.', content: '<p>Le marché abidjanais est de plus en plus compétitif...</p>', image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=500&fit=crop', author: 'Équipe Touch+', date: '2026-06-15', read_time: 5, views: 1243, published: true },
                { id: 'art-002', title: 'Cartes de visite, Flyers, Bâches : Quel support choisir pour quel objectif ?', slug: 'choisir-support-impression', category: 'Impression', excerpt: 'Un guide pratique pour sélectionner les meilleurs supports d\'impression pour vos campagnes.', content: '<p>Chaque support de communication a ses avantages...</p>', image: 'https://images.unsplash.com/photo-1586281380117-5a60ae2050cc?w=800&h=500&fit=crop', author: 'Équipe Touch+', date: '2026-06-01', read_time: 7, views: 892, published: true },
                { id: 'art-003', title: 'Les 5 indispensables pour une communication événementielle réussie à Abidjan', slug: 'communication-evenementielle-abidjan', category: 'Événementiel', excerpt: 'De la banderole au t-shirt personnalisé, les éléments clés pour faire de votre événement un succès.', content: '<p>Organiser un événement mémorable demande une préparation minutieuse...</p>', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=500&fit=crop', author: 'Équipe Touch+', date: '2026-05-18', read_time: 6, views: 678, published: true }
            ];
            localStorage.setItem('touchplus_articles', JSON.stringify(articles));
        }

        // MESSAGES CONTACT
        if (!localStorage.getItem('touchplus_messages') || JSON.parse(localStorage.getItem('touchplus_messages') || '[]').length === 0) {
            const msgs = [
                { id: 'msg-001', name: 'Aya Touré', email: 'aya.toure@boa.ci', phone: '+225 07 11 22 33', service: 'impression', message: 'Bonjour, je souhaite obtenir un devis pour 500 affiches A2.', date: '2026-06-26T09:15:00Z', read: false, replied: false },
                { id: 'msg-002', name: 'Kouassi Franck', email: 'franck.k@gmail.com', phone: '+225 05 66 77 88', service: 'textile', message: 'Nous avons besoin de 100 t-shirts personnalisés pour notre événement d\'entreprise.', date: '2026-06-25T14:30:00Z', read: true, replied: true }
            ];
            localStorage.setItem('touchplus_messages', JSON.stringify(msgs));
        }

        // NEWSLETTER SUBSCRIBERS
        if (!localStorage.getItem('touchplus_newsletter') || JSON.parse(localStorage.getItem('touchplus_newsletter') || '[]').length === 0) {
            localStorage.setItem('touchplus_newsletter', JSON.stringify([
                { id: 'nl-001', email: 'subscriber1@test.com', date: '2026-06-20T10:00:00Z' }
            ]));
        }

        // TESTIMONIALS
        if (!localStorage.getItem('touchplus_testimonials') || JSON.parse(localStorage.getItem('touchplus_testimonials') || '[]').length === 0) {
            const testi = [
                { id: 'testi-001', name: 'Koffi Adjoumani', role: 'Dir. Marketing', company: 'MTN CI', text: 'Service exceptionnel ! Touch+ a livré nos 3000 t-shirts en temps record avec une qualité irréprochable.', rating: 5, avatar: 'https://ui-avatars.com/api/?name=Koffi+Adjoumani&background=f97316&color=fff', approved: true },
                { id: 'testi-002', name: 'Aya Touré', role: 'Resp. Communication', company: 'BOA', text: 'Professionnalisme et créativité au rendez-vous. Nos supports sont magnifiques et toujours livrés à temps.', rating: 5, avatar: 'https://ui-avatars.com/api/?name=Aya+Toure&background=3b82f6&color=fff', approved: true },
                { id: 'testi-003', name: 'Jean-Marc Kouassi', role: 'CEO', company: 'Bel\'Afrik Cosmétiques', text: 'Partenaire de confiance pour tous nos besoins en packaging. Ils comprennent nos enjeux.', rating: 5, avatar: 'https://ui-avatars.com/api/?name=Jean+Kouassi&background=ec4899&color=fff', approved: true },
                { id: 'testi-004', name: 'Mariam Diabaté', role: 'Coordinatrice', company: 'SIAO', text: 'Touch+ a géré tous nos supports pour le SIAO 2024. Résultat exceptionnel et respect des délais serrés.', rating: 5, avatar: 'https://ui-avatars.com/api/?name=Mariam+Diabate&background=8b5cf6&color=fff', approved: true }
            ];
            localStorage.setItem('touchplus_testimonials', JSON.stringify(testi));
        }
    };

    // Always seed local storage so that offline/local fallbacks are populated
    seedExtendedData();

    // =========================================================================
    // MÉTHODES ÉTENDUES sur TouchDb
    // =========================================================================
    Object.assign(TouchDb, {

        // === RÉALISATIONS ===
        getRealisations: async function (category = 'all') {
            if (isCloudMode) {
                try {
                    let query = supabaseClient.from('realisations').select('*').order('date', { ascending: false });
                    if (category !== 'all') query = query.eq('category', category);
                    const { data, error } = await query;
                    if (error) throw error;
                    if (!data || data.length === 0) {
                        let items = JSON.parse(localStorage.getItem('touchplus_realisations') || '[]');
                        if (category !== 'all') items = items.filter(r => r.category === category);
                        return { success: true, items };
                    }
                    return { success: true, items: data };
                } catch (err) {
                    let items = JSON.parse(localStorage.getItem('touchplus_realisations') || '[]');
                    if (category !== 'all') items = items.filter(r => r.category === category);
                    return { success: true, items };
                }
            } else {
                let items = JSON.parse(localStorage.getItem('touchplus_realisations') || '[]');
                if (category !== 'all') items = items.filter(r => r.category === category);
                return { success: true, items };
            }
        },

        addRealisation: async function (data) {
            const item = { id: 'real-' + Date.now(), ...data, date: new Date().toISOString().split('T')[0], likes: 0 };
            if (isCloudMode) {
                try {
                    const { error } = await supabaseClient.from('realisations').insert([item]);
                    if (error) throw error;
                    return { success: true, item };
                } catch (err) { return { success: false, error: err.message }; }
            } else {
                const items = JSON.parse(localStorage.getItem('touchplus_realisations') || '[]');
                items.unshift(item);
                localStorage.setItem('touchplus_realisations', JSON.stringify(items));
                return { success: true, item };
            }
        },

        deleteRealisation: async function (id) {
            if (isCloudMode) {
                try {
                    const { error } = await supabaseClient.from('realisations').delete().eq('id', id);
                    if (error) throw error;
                    return { success: true };
                } catch (err) { return { success: false, error: err.message }; }
            } else {
                let items = JSON.parse(localStorage.getItem('touchplus_realisations') || '[]');
                items = items.filter(r => r.id !== id);
                localStorage.setItem('touchplus_realisations', JSON.stringify(items));
                return { success: true };
            }
        },

        // === BLOG ARTICLES ===
        getArticles: async function (publishedOnly = true) {
            if (isCloudMode) {
                try {
                    let query = supabaseClient.from('articles').select('*').order('date', { ascending: false });
                    if (publishedOnly) query = query.eq('published', true);
                    const { data, error } = await query;
                    if (error) throw error;
                    if (!data || data.length === 0) {
                        const articles = JSON.parse(localStorage.getItem('touchplus_articles') || '[]');
                        return { success: true, articles: publishedOnly ? articles.filter(a => a.published) : articles };
                    }
                    return { success: true, articles: data };
                } catch (err) {
                    const articles = JSON.parse(localStorage.getItem('touchplus_articles') || '[]');
                    return { success: true, articles: publishedOnly ? articles.filter(a => a.published) : articles };
                }
            } else {
                let articles = JSON.parse(localStorage.getItem('touchplus_articles') || '[]');
                if (publishedOnly) articles = articles.filter(a => a.published);
                return { success: true, articles };
            }
        },

        addArticle: async function (data) {
            const article = { id: 'art-' + Date.now(), ...data, date: new Date().toISOString().split('T')[0], views: 0, published: data.published ?? true };
            if (isCloudMode) {
                try {
                    const { error } = await supabaseClient.from('articles').insert([article]);
                    if (error) throw error;
                    return { success: true, article };
                } catch (err) { return { success: false, error: err.message }; }
            } else {
                const articles = JSON.parse(localStorage.getItem('touchplus_articles') || '[]');
                articles.unshift(article);
                localStorage.setItem('touchplus_articles', JSON.stringify(articles));
                return { success: true, article };
            }
        },

        toggleArticlePublished: async function (id, published) {
            if (isCloudMode) {
                try {
                    const { error } = await supabaseClient.from('articles').update({ published }).eq('id', id);
                    if (error) throw error;
                    return { success: true };
                } catch (err) { return { success: false, error: err.message }; }
            } else {
                const articles = JSON.parse(localStorage.getItem('touchplus_articles') || '[]');
                const idx = articles.findIndex(a => a.id === id);
                if (idx !== -1) { articles[idx].published = published; localStorage.setItem('touchplus_articles', JSON.stringify(articles)); }
                return { success: true };
            }
        },

        deleteArticle: async function (id) {
            if (isCloudMode) {
                try {
                    const { error } = await supabaseClient.from('articles').delete().eq('id', id);
                    if (error) throw error;
                    return { success: true };
                } catch (err) { return { success: false, error: err.message }; }
            } else {
                let articles = JSON.parse(localStorage.getItem('touchplus_articles') || '[]');
                articles = articles.filter(a => a.id !== id);
                localStorage.setItem('touchplus_articles', JSON.stringify(articles));
                return { success: true };
            }
        },

        // === MESSAGES CONTACT ===
        submitContactMessage: async function (name, email, phone, service, message) {
            const msg = { id: 'msg-' + Date.now(), name, email, phone, service, message, date: new Date().toISOString(), read: false, replied: false };
            if (isCloudMode) {
                try {
                    const { error } = await supabaseClient.from('messages').insert([msg]);
                    if (error) throw error;
                    return { success: true };
                } catch (err) { return { success: false, error: err.message }; }
            } else {
                const msgs = JSON.parse(localStorage.getItem('touchplus_messages') || '[]');
                msgs.unshift(msg);
                localStorage.setItem('touchplus_messages', JSON.stringify(msgs));
                return { success: true };
            }
        },

        getMessages: async function () {
            if (isCloudMode) {
                try {
                    const { data, error } = await supabaseClient.from('messages').select('*').order('date', { ascending: false });
                    if (error) throw error;
                    return { success: true, messages: data };
                } catch (err) { return { success: false, error: err.message, messages: [] }; }
            } else {
                const messages = JSON.parse(localStorage.getItem('touchplus_messages') || '[]');
                return { success: true, messages };
            }
        },

        markMessageRead: async function (id) {
            if (isCloudMode) {
                try {
                    const { error } = await supabaseClient.from('messages').update({ read: true }).eq('id', id);
                    if (error) throw error;
                    return { success: true };
                } catch (err) { return { success: false, error: err.message }; }
            } else {
                const msgs = JSON.parse(localStorage.getItem('touchplus_messages') || '[]');
                const idx = msgs.findIndex(m => m.id === id);
                if (idx !== -1) { msgs[idx].read = true; localStorage.setItem('touchplus_messages', JSON.stringify(msgs)); }
                return { success: true };
            }
        },

        markMessageReplied: async function (id) {
            if (isCloudMode) {
                try {
                    const { error } = await supabaseClient.from('messages').update({ read: true, replied: true }).eq('id', id);
                    if (error) throw error;
                    return { success: true };
                } catch (err) { return { success: false, error: err.message }; }
            } else {
                const msgs = JSON.parse(localStorage.getItem('touchplus_messages') || '[]');
                const idx = msgs.findIndex(m => m.id === id);
                if (idx !== -1) { msgs[idx].read = true; msgs[idx].replied = true; localStorage.setItem('touchplus_messages', JSON.stringify(msgs)); }
                return { success: true };
            }
        },

        deleteMessage: async function (id) {
            if (isCloudMode) {
                try {
                    const { error } = await supabaseClient.from('messages').delete().eq('id', id);
                    if (error) throw error;
                    return { success: true };
                } catch (err) { return { success: false, error: err.message }; }
            } else {
                let msgs = JSON.parse(localStorage.getItem('touchplus_messages') || '[]');
                msgs = msgs.filter(m => m.id !== id);
                localStorage.setItem('touchplus_messages', JSON.stringify(msgs));
                return { success: true };
            }
        },

        // === NEWSLETTER ===
        subscribeNewsletter: async function (email) {
            if (isCloudMode) {
                try {
                    const { error } = await supabaseClient.from('newsletter').insert([{ email, date: new Date().toISOString() }]);
                    if (error) throw error;
                    return { success: true };
                } catch (err) { return { success: false, error: err.message }; }
            } else {
                const subs = JSON.parse(localStorage.getItem('touchplus_newsletter') || '[]');
                if (subs.find(s => s.email === email)) return { success: false, error: 'Déjà inscrit.' };
                subs.push({ id: 'nl-' + Date.now(), email, date: new Date().toISOString() });
                localStorage.setItem('touchplus_newsletter', JSON.stringify(subs));
                return { success: true };
            }
        },

        getNewsletterSubscribers: async function () {
            if (isCloudMode) {
                try {
                    const { data, error } = await supabaseClient.from('newsletter').select('*').order('date', { ascending: false });
                    if (error) throw error;
                    return { success: true, subscribers: data };
                } catch (err) { return { success: false, error: err.message, subscribers: [] }; }
            } else {
                return { success: true, subscribers: JSON.parse(localStorage.getItem('touchplus_newsletter') || '[]') };
            }
        },

        // === TESTIMONIALS ===
        getTestimonials: async function (approvedOnly = true) {
            if (isCloudMode) {
                try {
                    let query = supabaseClient.from('testimonials').select('*');
                    if (approvedOnly) query = query.eq('approved', true);
                    const { data, error } = await query;
                    if (error) throw error;
                    if (!data || data.length === 0) {
                        const testimonials = JSON.parse(localStorage.getItem('touchplus_testimonials') || '[]');
                        return { success: true, testimonials: approvedOnly ? testimonials.filter(t => t.approved) : testimonials };
                    }
                    return { success: true, testimonials: data };
                } catch (err) {
                    const testimonials = JSON.parse(localStorage.getItem('touchplus_testimonials') || '[]');
                    return { success: true, testimonials: approvedOnly ? testimonials.filter(t => t.approved) : testimonials };
                }
            } else {
                let testimonials = JSON.parse(localStorage.getItem('touchplus_testimonials') || '[]');
                if (approvedOnly) testimonials = testimonials.filter(t => t.approved);
                return { success: true, testimonials };
            }
        },

        approveTestimonial: async function (id, approved) {
            if (isCloudMode) {
                try {
                    const { error } = await supabaseClient.from('testimonials').update({ approved }).eq('id', id);
                    if (error) throw error;
                    return { success: true };
                } catch (err) { return { success: false, error: err.message }; }
            } else {
                const items = JSON.parse(localStorage.getItem('touchplus_testimonials') || '[]');
                const idx = items.findIndex(t => t.id === id);
                if (idx !== -1) { items[idx].approved = approved; localStorage.setItem('touchplus_testimonials', JSON.stringify(items)); }
                return { success: true };
            }
        },

        // === STATS GLOBALES (pour admin dashboard) ===
        // BUG 4 FIX : supporte le mode cloud Supabase
        getGlobalStats: async function () {
            if (isCloudMode) {
                try {
                    const [ordersRes, messagesRes, usersRes, newsletterRes] = await Promise.all([
                        supabaseClient.from('orders').select('id, status'),
                        supabaseClient.from('messages').select('id, read'),
                        supabaseClient.from('profiles').select('id, role'),
                        supabaseClient.from('newsletter').select('id')
                    ]);
                    const orders = ordersRes.data || [];
                    const messages = messagesRes.data || [];
                    const users = usersRes.data || [];
                    const newsletter = newsletterRes.data || [];
                    return {
                        totalOrders: orders.length,
                        pendingOrders: orders.filter(o => ['Confirmée', 'Maquette', 'BAT'].includes(o.status)).length,
                        activeOrders: orders.filter(o => o.status === 'Production').length,
                        deliveredOrders: orders.filter(o => o.status === 'Livrée').length,
                        unreadMessages: messages.filter(m => !m.read).length,
                        totalClients: users.filter(u => u.role === 'client').length,
                        newsletterCount: newsletter.length
                    };
                } catch (err) {
                    console.error('getGlobalStats cloud error, fallback localStorage:', err);
                }
            }
            // Mode local (ou fallback)
            const orders = JSON.parse(localStorage.getItem('touchplus_orders') || '[]');
            const messages = JSON.parse(localStorage.getItem('touchplus_messages') || '[]');
            const users = JSON.parse(localStorage.getItem('touchplus_users') || '[]');
            const newsletter = JSON.parse(localStorage.getItem('touchplus_newsletter') || '[]');
            return {
                totalOrders: orders.length,
                pendingOrders: orders.filter(o => ['Confirmée', 'Maquette', 'BAT'].includes(o.status)).length,
                activeOrders: orders.filter(o => o.status === 'Production').length,
                deliveredOrders: orders.filter(o => o.status === 'Livrée').length,
                unreadMessages: messages.filter(m => !m.read).length,
                totalClients: users.filter(u => u.role === 'client').length,
                newsletterCount: newsletter.length
            };
        },

        // === RECHERCHE COMMANDE PAR ID (public, sans auth) ===
        // BUG 3 FIX : permet le tracking public d'une commande
        getOrderById: async function (orderId) {
            const id = (orderId || '').trim().toUpperCase();
            if (!id) return { success: false, error: 'Numéro de commande requis.' };

            if (isCloudMode) {
                try {
                    const { data, error } = await supabaseClient
                        .from('orders')
                        .select('id, product, quantity, status, date, shipping_carrier, shipping_tracking, client_name')
                        .eq('id', id)
                        .single();
                    if (error || !data) return { success: false, error: 'Commande introuvable.' };
                    return { success: true, order: data };
                } catch (err) {
                    return { success: false, error: err.message };
                }
            } else {
                const orders = JSON.parse(localStorage.getItem('touchplus_orders') || '[]');
                const order = orders.find(o => o.id.toUpperCase() === id);
                if (!order) return { success: false, error: 'Commande introuvable. Vérifiez le numéro saisi.' };
                return { success: true, order };
            }
        },

        // === MISE À JOUR RÉALISATION (BUG 5 FIX) ===
        updateRealisation: async function (id, data) {
            if (isCloudMode) {
                try {
                    const { error } = await supabaseClient.from('realisations').update(data).eq('id', id);
                    if (error) throw error;
                    return { success: true };
                } catch (err) { return { success: false, error: err.message }; }
            } else {
                let items = JSON.parse(localStorage.getItem('touchplus_realisations') || '[]');
                const idx = items.findIndex(r => r.id === id);
                if (idx !== -1) {
                    items[idx] = { ...items[idx], ...data };
                    localStorage.setItem('touchplus_realisations', JSON.stringify(items));
                    return { success: true };
                }
                return { success: false, error: 'Réalisation introuvable.' };
            }
        },

        // === MISE À JOUR ARTICLE (complément) ===
        updateArticle: async function (id, data) {
            if (isCloudMode) {
                try {
                    const { error } = await supabaseClient.from('articles').update(data).eq('id', id);
                    if (error) throw error;
                    return { success: true };
                } catch (err) { return { success: false, error: err.message }; }
            } else {
                const articles = JSON.parse(localStorage.getItem('touchplus_articles') || '[]');
                const idx = articles.findIndex(a => a.id === id);
                if (idx !== -1) {
                    articles[idx] = { ...articles[idx], ...data };
                    localStorage.setItem('touchplus_articles', JSON.stringify(articles));
                    return { success: true };
                }
                return { success: false, error: 'Article introuvable.' };
            }
        },

        // === GESTION ÉQUIPE (Onglet Équipe Admin - manquait) ===
        getTeamMembers: async function () {
            if (isCloudMode) {
                try {
                    const { data, error } = await supabaseClient.from('team').select('*').order('order', { ascending: true });
                    if (error) throw error;
                    if (!data || data.length === 0) {
                        return { success: true, members: JSON.parse(localStorage.getItem('touchplus_team') || '[]') };
                    }
                    return { success: true, members: data };
                } catch (err) {
                    return { success: true, members: JSON.parse(localStorage.getItem('touchplus_team') || '[]') };
                }
            } else {
                return { success: true, members: JSON.parse(localStorage.getItem('touchplus_team') || '[]') };
            }
        },

        addTeamMember: async function (data) {
            const member = { id: 'team-' + Date.now(), ...data };
            if (isCloudMode) {
                try {
                    const { error } = await supabaseClient.from('team').insert([member]);
                    if (error) throw error;
                    return { success: true, member };
                } catch (err) { return { success: false, error: err.message }; }
            } else {
                const members = JSON.parse(localStorage.getItem('touchplus_team') || '[]');
                members.push(member);
                localStorage.setItem('touchplus_team', JSON.stringify(members));
                return { success: true, member };
            }
        },

        updateTeamMember: async function (id, data) {
            if (isCloudMode) {
                try {
                    const { error } = await supabaseClient.from('team').update(data).eq('id', id);
                    if (error) throw error;
                    return { success: true };
                } catch (err) { return { success: false, error: err.message }; }
            } else {
                let members = JSON.parse(localStorage.getItem('touchplus_team') || '[]');
                const idx = members.findIndex(m => m.id === id);
                if (idx !== -1) {
                    members[idx] = { ...members[idx], ...data };
                    localStorage.setItem('touchplus_team', JSON.stringify(members));
                    return { success: true };
                }
                return { success: false, error: 'Membre introuvable.' };
            }
        },

        deleteTeamMember: async function (id) {
            if (isCloudMode) {
                try {
                    const { error } = await supabaseClient.from('team').delete().eq('id', id);
                    if (error) throw error;
                    return { success: true };
                } catch (err) { return { success: false, error: err.message }; }
            } else {
                let members = JSON.parse(localStorage.getItem('touchplus_team') || '[]');
                members = members.filter(m => m.id !== id);
                localStorage.setItem('touchplus_team', JSON.stringify(members));
                return { success: true };
            }
        },

        // === MISE À JOUR PROFIL UTILISATEUR (manquait) ===
        updateProfile: async function (userId, data) {
            if (isCloudMode) {
                try {
                    const { error } = await supabaseClient.from('profiles').update(data).eq('id', userId);
                    if (error) throw error;
                    // Mettre à jour la session locale
                    const session = this.getCurrentUser();
                    if (session && session.id === userId) {
                        const updated = { ...session, ...data };
                        localStorage.setItem('touchplus_session', JSON.stringify(updated));
                    }
                    return { success: true };
                } catch (err) { return { success: false, error: err.message }; }
            } else {
                const users = JSON.parse(localStorage.getItem('touchplus_users') || '[]');
                const idx = users.findIndex(u => u.id === userId);
                if (idx !== -1) {
                    users[idx] = { ...users[idx], ...data };
                    localStorage.setItem('touchplus_users', JSON.stringify(users));
                    // Mettre à jour la session
                    const session = this.getCurrentUser();
                    if (session && session.id === userId) {
                        const updated = { ...session, ...data };
                        localStorage.setItem('touchplus_session', JSON.stringify(updated));
                    }
                    return { success: true };
                }
                return { success: false, error: 'Utilisateur introuvable.' };
            }
        }
    });

    window.TouchDb = TouchDb;
})();

