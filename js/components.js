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
    `
};
