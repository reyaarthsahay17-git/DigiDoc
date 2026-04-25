const Components = {
    Home: () => `
        <div class="hero-section fade-in">
            <div class="hero-content">
                <h1 class="hero-title">Your AI-Powered <br>Health Companion</h1>
                <p class="hero-subtitle">
                    DigiDoc provides intelligent symptom checking based on world-class medical knowledge bases (NHS, CareHospitals), and helps you find the best local healthcare professionals.
                </p>
                <div class="hero-actions">
                    <button class="btn btn-primary" onclick="app.navigate('symptom-checker')">
                        <i class="ph-bold ph-stethoscope"></i> Check Symptoms
                    </button>
                    <button class="btn btn-secondary" onclick="app.navigate('find-medicines')">
                        <i class="ph-bold ph-pill"></i> Find Medicines
                    </button>
                    <button class="btn btn-secondary" onclick="app.navigate('find-doctors')">
                        <i class="ph-bold ph-map-pin"></i> Find Doctors
                    </button>
                </div>
            </div>
            <div class="hero-image">
                <i class="ph-fill ph-heartbeat"></i>
            </div>
        </div>
    `,

    SymptomChecker: () => `
        <div class="fade-in" style="max-width: 800px; margin: 0 auto;">
            <div class="context-notice">
                <i class="ph-fill ph-info"></i> <strong>AI Health Checker:</strong> Trained on data from NHS, HealthyWA, DPH Illinois, CareHospitals and Seattle Children's Hospital. This is not a substitute for professional medical advice.
            </div>
            
            <div class="glass-panel chat-container" id="health-bot-container">
                <div class="chat-messages" id="health-chat-messages">
                    <div class="message bot">
                        Hello! I'm the <strong>DigiDoc AI Health Checker</strong>. I'm trained on comprehensive medical data to help assess your symptoms.<br><br>
                        To give you the most accurate assessment, I'll ask you a few quick questions first.<br><br>
                        Let's start: Could you please tell me your <strong>Age</strong> and <strong>Gender</strong>?<br>
                        <em style="color:var(--text-secondary); font-size:0.9rem">(You can leave any question blank if you prefer not to share — I'll make assumptions where needed.)</em>
                    </div>
                </div>
                <div class="chat-input-area">
                    <input type="text" id="health-chat-input" placeholder="e.g. 35, Female — or press Enter to skip" onkeypress="healthBot.handleInput(event)">
                    <button onclick="healthBot.sendMsg()">
                        <i class="ph-fill ph-paper-plane-right"></i>
                    </button>
                </div>
            </div>
        </div>
    `,

    FindDoctors: () => `
        <div class="fade-in">
            <div class="doctor-finder-header">
                <h2 style="font-size: 2.5rem; margin-bottom: 1rem;">Find Local Healthcare</h2>
                <p style="color: var(--text-secondary); margin-bottom: 2rem;">Enter your location to find doctors, hospitals, and clinics near you.</p>
                
                <div class="search-bar-container">
                    <input type="text" id="location-input" placeholder="Enter your city or zip code..." style="margin-bottom: 0;">
                    <button class="btn btn-primary" onclick="doctorFinder.search()">
                        <i class="ph-bold ph-magnifying-glass"></i> Search
                    </button>
                </div>
            </div>

            <div id="doctor-results" class="doctor-grid">
                <!-- Doctor cards injected here -->
            </div>
        </div>
    `,

    DoctorCard: (doc) => `
        <div class="glass-panel doctor-card" onclick="doctorFinder.viewDoctor('${doc.id}')">
            <div class="doctor-header">
                <div class="doctor-avatar">
                    <i class="ph-fill ph-user-md"></i>
                </div>
                <div class="doctor-info">
                    <h3>${doc.name}</h3>
                    <div class="doctor-specialty">${doc.specialty}</div>
                </div>
            </div>
            <div class="doctor-meta">
                <span><i class="ph-bold ph-map-pin"></i> ${doc.location}</span>
                <span class="rating"><i class="ph-fill ph-star"></i> ${doc.rating} (${doc.reviews} reviews)</span>
            </div>
            <button class="btn btn-secondary" style="width: 100%; margin-top: 1rem; padding: 0.5rem;">
                View Details
            </button>
        </div>
    `,

    ClinicCard: (clinic) => `
        <div class="glass-panel doctor-card" onclick="doctorFinder.viewClinic('${clinic.id}')" style="cursor: pointer; transition: transform 0.2s ease;">
            <div class="doctor-header" style="margin-bottom: 0.5rem;">
                <div class="doctor-avatar" style="background: rgba(14,165,233,0.1); color: var(--primary);">
                    <i class="ph-fill ph-hospital"></i>
                </div>
                <div class="doctor-info">
                    <h3 style="font-size: 1.1rem; margin-bottom: 0.2rem;">${clinic.name}</h3>
                    <div class="doctor-specialty" style="font-size: 0.85rem;">${clinic.specialty}</div>
                </div>
            </div>
            <div class="doctor-meta" style="flex-direction: column; align-items: flex-start; gap: 0.4rem;">
                <span style="font-size: 0.8rem;"><i class="ph-bold ph-map-pin"></i> ${clinic.location}</span>
                <span style="font-size: 0.8rem;"><i class="ph-bold ph-phone"></i> ${clinic.phone}</span>
            </div>
            <button class="btn btn-primary" style="width: 100%; margin-top: 1rem; padding: 0.5rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                <i class="ph-bold ph-robot"></i> Research with AI
            </button>
        </div>
    `,

    FindMedicines: () => `
        <div class="fade-in">
            <div class="doctor-finder-header">
                <h2 style="font-size: 2.5rem; margin-bottom: 1rem;">Medicines A-Z</h2>
                <p style="color: var(--text-secondary); margin-bottom: 2rem;">Search for a medicine or condition to learn about its uses and side effects, referenced from the NHS.</p>
                
                <div class="search-bar-container">
                    <input type="text" id="medicine-input" placeholder="Search by medicine name or condition (e.g., Ibuprofen, Pain)..." style="margin-bottom: 0;" onkeypress="if(event.key === 'Enter') medicineFinder.search()">
                    <button class="btn btn-primary" onclick="medicineFinder.search()">
                        <i class="ph-bold ph-magnifying-glass"></i> Search
                    </button>
                </div>
            </div>

            <div id="medicine-results" class="doctor-grid">
                <!-- Medicine cards injected here -->
            </div>
        </div>
    `,

    MedicineCard: (med) => {
        const encodedName = encodeURIComponent(med.name.split(' (')[0]);
        const pharmEasyLink = `https://pharmeasy.in/search/all?name=${encodedName}`;
        const oneMgLink = `https://www.1mg.com/search/all?name=${encodedName}`;
        
        return `
        <div class="glass-panel doctor-card" style="align-items: flex-start; text-align: left;">
            <div class="doctor-header" style="margin-bottom: 0.5rem; display: flex; align-items: center; gap: 1rem;">
                <div class="doctor-avatar" style="background: rgba(16, 185, 129, 0.1); color: #10b981; border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                    <i class="ph-fill ph-pill"></i>
                </div>
                <div>
                    <h3 style="font-size: 1.2rem; margin-bottom: 0.2rem;">${med.name}</h3>
                    <div class="doctor-specialty" style="font-size: 0.85rem; color: var(--text-secondary);">${med.type}</div>
                </div>
            </div>
            
            <div style="margin-top: 1rem; width: 100%;">
                <p style="font-size: 0.9rem; margin-bottom: 0.5rem;"><strong>Used for:</strong> ${med.uses}</p>
                <p style="font-size: 0.9rem; margin-bottom: 0.8rem; color: var(--text-secondary);"><strong>Side effects:</strong> ${med.sideEffects}</p>
                
                <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 1rem;">
                    <a href="${med.nhsLink}" target="_blank" class="btn btn-secondary" style="font-size:0.8rem; padding: 0.4rem 0.8rem; text-decoration:none; flex: 1; text-align: center; border-radius: 6px;">
                        <i class="ph-bold ph-book-open"></i> Read on NHS
                    </a>
                </div>
                
                <div style="margin-top: 0.8rem; padding-top: 0.8rem; border-top: 1px solid rgba(255,255,255,0.05); display: flex; gap: 8px;">
                    <a href="${pharmEasyLink}" target="_blank" class="btn btn-primary" style="font-size:0.75rem; padding: 0.3rem 0.6rem; text-decoration:none; flex: 1; text-align: center; border-radius: 6px;">
                        <i class="ph-bold ph-shopping-cart"></i> PharmEasy
                    </a>
                    <a href="${oneMgLink}" target="_blank" class="btn btn-secondary" style="font-size:0.75rem; padding: 0.3rem 0.6rem; text-decoration:none; flex: 1; text-align: center; border-radius: 6px;">
                        <i class="ph-bold ph-shopping-bag"></i> Tata 1mg
                    </a>
                </div>
            </div>
        </div>
        `;
    }
};
