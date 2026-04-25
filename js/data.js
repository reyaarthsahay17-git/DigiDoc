// ─────────────────────────────────────────────────────────────────────────────
// DigiDoc — Data
// Disease KB sourced from: NHS, HealthyWA, DPH Illinois,
//   NHS Inform Scotland, CareHospitals, Seattle Children's Hospital
// ─────────────────────────────────────────────────────────────────────────────

const DOCTORS = [
    {
        id: 'doc1',
        name: 'Dr. Sarah Jenkins',
        specialty: 'General Practitioner',
        location: 'Downtown Medical Center (1.2 miles)',
        rating: 4.8,
        reviews: 124,
        pros: ['Very empathetic with older patients', 'Short wait times', 'Highly rated for accurate diagnosis'],
        cons: ['Limited availability on weekends', 'Clinic parking can be difficult']
    },
    {
        id: 'doc2',
        name: 'Dr. Marcus Chen',
        specialty: 'Cardiologist',
        location: 'Westside Heart Clinic (3.5 miles)',
        rating: 4.9,
        reviews: 89,
        pros: ['Top specialist in the region', 'State-of-the-art facility', 'Accepts most major insurances'],
        cons: ['Long waiting list for new patients', 'Can seem rushed during consultations']
    },
    {
        id: 'doc3',
        name: 'Dr. Emily Patel',
        specialty: 'Internal Medicine',
        location: 'Sunrise Health Group (2.0 miles)',
        rating: 4.6,
        reviews: 210,
        pros: ['Excellent at explaining complex conditions', 'Offers telehealth appointments', 'Friendly staff'],
        cons: ['Sometimes runs behind schedule', 'Hard to reach directly by phone']
    },
    {
        id: 'doc4',
        name: 'Dr. Robert Sullivan',
        specialty: 'Neurologist',
        location: 'Central Neurological (4.1 miles)',
        rating: 4.7,
        reviews: 56,
        pros: ['Extremely thorough examinations', 'Great at managing chronic conditions', 'Quick test results'],
        cons: ['Strict cancellation policy', 'Office is slightly outdated']
    },
    {
        id: 'doc5',
        name: 'Dr. Priya Nair',
        specialty: 'Pulmonologist',
        location: 'City Lung & Respiratory Clinic (2.8 miles)',
        rating: 4.8,
        reviews: 73,
        pros: ['Specialist in respiratory and breathing disorders', 'Uses latest diagnostic equipment', 'Patient-friendly approach'],
        cons: ['Longer appointment slots needed', 'Limited walk-in availability']
    },
    {
        id: 'doc6',
        name: 'Dr. Alan Mehta',
        specialty: 'Gastroenterologist',
        location: 'Metro Digestive Health Center (3.1 miles)',
        rating: 4.5,
        reviews: 98,
        pros: ['Specialist in stomach, gut and liver issues', 'Detailed dietary guidance provided', 'Quick referrals for endoscopy'],
        cons: ['Busy schedule, book in advance', 'Parking fees at the clinic']
    },
    {
        id: 'doc7',
        name: 'Dr. Fatima Okonkwo',
        specialty: 'Dermatologist',
        location: 'Skin & Wellness Clinic (1.9 miles)',
        rating: 4.7,
        reviews: 155,
        pros: ['Expert in skin rashes, infections, and chronic conditions', 'Non-judgmental and thorough', 'Early-morning appointments available'],
        cons: ['High consultation fee', 'Sometimes hard to get an early slot']
    },
    {
        id: 'doc8',
        name: 'Dr. James Park',
        specialty: 'Endocrinologist',
        location: 'Harmony Diabetes & Hormone Center (4.5 miles)',
        rating: 4.6,
        reviews: 62,
        pros: ['Specialist in diabetes, thyroid, and hormonal disorders', 'Holistic lifestyle advice', 'Works closely with nutritionists'],
        cons: ['Long waiting time for first appointment', 'Clinic is further from city center']
    }
];

const CLINICS = [
    {
        id: 'clinic1',
        name: 'Downtown Medical Center',
        specialty: 'Multispecialty & General Practice',
        location: 'Downtown, 1.2 miles away',
        phone: '+1 (555) 123-4567',
        about: 'A leading facility in downtown offering primary care, preventive medicine, and comprehensive diagnostics.',
        doctors: ['Dr. Sarah Jenkins (General Practitioner)']
    },
    {
        id: 'clinic2',
        name: 'Westside Heart Clinic',
        specialty: 'Cardiology & Vascular Health',
        location: 'Westside, 3.5 miles away',
        phone: '+1 (555) 987-6543',
        about: 'Specialized clinic focused on cardiovascular diseases, hypertension management, and heart health.',
        doctors: ['Dr. Marcus Chen (Cardiologist)']
    },
    {
        id: 'clinic3',
        name: 'Sunrise Health Group',
        specialty: 'Internal Medicine & Telehealth',
        location: 'Sunrise District, 2.0 miles away',
        phone: '+1 (555) 456-7890',
        about: 'A patient-centric group offering telehealth and in-person consultations for complex adult diseases.',
        doctors: ['Dr. Emily Patel (Internal Medicine)']
    },
    {
        id: 'clinic4',
        name: 'Central Neurological',
        specialty: 'Neurology',
        location: 'Central, 4.1 miles away',
        phone: '+1 (555) 321-0987',
        about: 'Advanced neurological center equipped with modern diagnostic imaging and chronic condition management.',
        doctors: ['Dr. Robert Sullivan (Neurologist)']
    },
    {
        id: 'clinic5',
        name: 'Metro Digestive Health Center',
        specialty: 'Gastroenterology',
        location: 'Metro Area, 3.1 miles away',
        phone: '+1 (555) 654-3210',
        about: 'Expert care for digestive system disorders, offering rapid endoscopy referrals and dietary guidance.',
        doctors: ['Dr. Alan Mehta (Gastroenterologist)']
    }
];

// ─────────────────────────────────────────────────────────────────────────────
// DISEASE KNOWLEDGE BASE
//
// Keyword design rules:
//  - Multi-word PHRASES preferred (e.g. "chest pain" not "pain" or "chest")
//  - Single words only used when highly disease-specific (e.g. "migraine", "wheezing")
//  - No standalone generic words: "pain", "ache", "tired", "nausea", "fever" alone
//  - Include colloquial phrasing people actually use
//  - Include common spelling variants
// ─────────────────────────────────────────────────────────────────────────────
const DISEASE_KB = [
    {
        name: 'Migraine',
        // REQUIRES: headache + at least one distinguishing symptom (throbbing, one side, light/sound sensitivity)
        keywords: [
            'migraine',
            'throbbing headache', 'pounding headache', 'throbbing head',
            'one-sided headache', 'headache on one side', 'half head',
            'sensitive to light', 'light hurts my eyes', 'light sensitivity',
            'sensitive to sound', 'sound sensitivity',
            'nausea with headache', 'sick with headache', 'vomiting with headache',
            'aura', 'visual aura', 'zigzag vision', 'spots in vision before headache',
            'head is pounding', 'temples throbbing', 'temple pain',
            'headache for hours', 'headache for days', 'recurring headache'
        ],
        description: 'Migraines are intense, often one-sided headaches frequently accompanied by nausea, vomiting, and sensitivity to light or sound. They can last hours to days and are triggered by stress, hormonal changes, or certain foods.',
        urgency: 'moderate',
        specialty: 'Neurologist',
        doctorIds: ['doc4'],
        riskFactors: { femaleHigher: true, ageRisk: null },
        redFlags: ['sudden worst headache of your life', 'stiff neck with headache', 'headache after head injury', 'confusion with headache', 'fever with severe headache'],
        selfCare: 'Rest in a quiet, dark room. Stay hydrated. Over-the-counter pain relief (ibuprofen or paracetamol) may help if taken early.',
        source: 'NHS Conditions — Migraine',
        medicines: [
            { name: 'Ibuprofen', sideEffects: 'Upset stomach, mild heartburn, nausea, vomiting.', buyLink: 'https://pharmeasy.in/search/all?name=Ibuprofen' },
            { name: 'Sumatriptan', sideEffects: 'Flushing, tingling, feeling warm or cold, dizziness.', buyLink: 'https://pharmeasy.in/search/all?name=Sumatriptan' }
        ]
    },
    {
        name: 'Hypertension (High Blood Pressure)',
        keywords: [
            'high blood pressure', 'hypertension',
            'dizzy spells', 'feeling dizzy', 'dizziness',
            'lightheaded', 'light headed', 'feel faint',
            'nosebleed', 'nose bleed', 'nose bleeding',
            'pounding in ears', 'ringing in ears', 'tinnitus',
            'vision blurred', 'blurry vision', 'blurred vision',
            'racing heartbeat', 'pounding heartbeat', 'heart is pounding',
            'flushed face', 'face feels hot', 'blood pressure',
            'shortness of breath with dizziness', 'chest tightness with dizziness'
        ],
        description: 'Hypertension is persistently high blood pressure in the arteries. It often has no obvious symptoms but is a major risk factor for heart disease and stroke.',
        urgency: 'high',
        specialty: 'Cardiologist',
        doctorIds: ['doc2'],
        riskFactors: { femaleHigher: false, ageRisk: 40 },
        redFlags: ['chest pain', 'sudden severe headache', 'difficulty speaking', 'numbness in face or limbs', 'sudden vision loss'],
        selfCare: 'Reduce salt and alcohol intake. Exercise regularly. Monitor blood pressure at home if possible.',
        source: 'NHS Conditions — High Blood Pressure',
        medicines: [
            { name: 'Amlodipine', sideEffects: 'Swelling of legs/ankles, tiredness, dizziness, palpitations.', buyLink: 'https://pharmeasy.in/search/all?name=Amlodipine' }
        ]
    },
    {
        name: 'Type 2 Diabetes',
        keywords: [
            'diabetes', 'diabetic',
            'extremely thirsty', 'always thirsty', 'constant thirst', 'thirsty all the time', 'very thirsty',
            'peeing a lot', 'urinating often', 'urinating frequently', 'passing urine often', 'going to toilet often',
            'wounds not healing', 'cuts not healing', 'slow wound healing', 'wounds heal slowly',
            'tingling in feet', 'tingling feet', 'numb feet', 'numbness in feet', 'feet tingling',
            'always hungry', 'hungry all the time', 'hungry despite eating',
            'unexplained weight loss', 'losing weight without trying',
            'blurry vision', 'vision blurred',
            'exhausted all the time', 'extreme tiredness', 'very tired all day',
            'dry mouth all the time', 'fruity breath'
        ],
        description: 'Type 2 Diabetes is a chronic condition where the body does not use insulin properly, causing blood sugar to rise. Risk increases with age, obesity, and family history.',
        urgency: 'high',
        specialty: 'Endocrinologist',
        doctorIds: ['doc8'],
        riskFactors: { femaleHigher: false, ageRisk: 45 },
        redFlags: ['extreme thirst and urination', 'sudden unexplained weight loss', 'fruity-smelling breath', 'confusion or drowsiness'],
        selfCare: 'Reduce sugary and processed foods. Exercise regularly. Schedule a fasting blood glucose test with your GP.',
        source: 'NHS Conditions — Type 2 Diabetes',
        medicines: [
            { name: 'Metformin', sideEffects: 'Nausea, vomiting, stomach upset, diarrhea, weakness.', buyLink: 'https://pharmeasy.in/search/all?name=Metformin' }
        ]
    },
    {
        name: 'Asthma',
        keywords: [
            'asthma', 'inhaler',
            'wheezing', 'wheeze', 'whistling when breathing', 'whistling sound in chest',
            'difficulty breathing', 'hard to breathe', 'trouble breathing', 'cannot breathe properly',
            'breathless', 'out of breath', 'short of breath', 'get breathless easily',
            'tight chest', 'chest feels tight', 'chest tightness', 'pressure on chest',
            'coughing at night', 'night time cough', 'cough wakes me up',
            'cough after exercise', 'breathing worsens with exercise', 'exercise makes breathing worse',
            'lungs feel tight', 'chest feels heavy'
        ],
        description: 'Asthma is a condition where the airways narrow and swell, producing extra mucus. This makes breathing difficult and triggers coughing, wheezing, and shortness of breath.',
        urgency: 'moderate',
        specialty: 'Pulmonologist',
        doctorIds: ['doc5'],
        riskFactors: { femaleHigher: false, ageRisk: null },
        redFlags: ['severe breathlessness preventing speech', 'lips or fingertips turning blue', 'not responding to inhaler'],
        selfCare: 'Use your rescue inhaler as prescribed. Avoid known triggers (smoke, pets, pollen). Keep follow-up appointments.',
        source: 'NHS Conditions — Asthma',
        medicines: [
            { name: 'Salbutamol (Albuterol)', sideEffects: 'Nervousness, shaking, headache, mouth/throat dryness.', buyLink: 'https://pharmeasy.in/search/all?name=Salbutamol' }
        ]
    },
    {
        name: 'Gastroenteritis (Stomach Flu)',
        keywords: [
            'vomiting', 'been vomiting', 'throwing up', 'keep being sick', 'cannot keep food down',
            'diarrhea', 'diarrhoea', 'loose stools', 'watery stools', 'runny stools',
            'stomach ache', 'stomach pain', 'tummy ache', 'tummy pain', 'belly ache', 'belly pain',
            'stomach cramps', 'stomach cramping', 'abdominal cramps', 'abdominal pain',
            'feeling sick', 'nauseous', 'constant nausea',
            'stomach bug', 'stomach flu', 'food poisoning', 'stomach upset', 'bad stomach',
            'gut pain', 'cannot eat anything'
        ],
        description: 'Gastroenteritis is inflammation of the stomach and intestines, typically caused by a viral or bacterial infection. Symptoms include vomiting, diarrhoea, stomach cramps, and nausea.',
        urgency: 'low',
        specialty: 'Gastroenterologist',
        doctorIds: ['doc6'],
        riskFactors: { femaleHigher: false, ageRisk: null },
        redFlags: ['blood in vomit or stool', 'signs of dehydration (no urination for 8+ hrs)', 'symptoms lasting more than 5 days', 'high fever above 38.5°C'],
        selfCare: 'Rest and drink plenty of fluids (water, oral rehydration salts). Eat bland foods when able. Avoid dairy and spicy food.',
        source: 'NHS Inform Scotland — Gastroenteritis',
        medicines: [
            { name: 'Loperamide', sideEffects: 'Constipation, dizziness, drowsiness, dry mouth.', buyLink: 'https://pharmeasy.in/search/all?name=Loperamide' }
        ]
    },
    {
        name: 'Pneumonia',
        keywords: [
            'pneumonia', 'chest infection',
            'coughing up phlegm', 'coughing up mucus', 'green phlegm', 'yellow phlegm', 'thick phlegm',
            'high temperature with cough', 'fever and cough', 'temperature and cough',
            'shivering with cough', 'chills and cough', 'shaking with fever',
            'chest pain when breathing', 'chest hurts when i breathe', 'pain breathing in',
            'breathing rapidly', 'breathing very fast', 'rapid breathing',
            'feel very unwell', 'extremely unwell', 'very ill suddenly'
        ],
        description: 'Pneumonia is an infection that inflames the air sacs in one or both lungs. It causes cough with phlegm, fever, chills, and difficulty breathing.',
        urgency: 'high',
        specialty: 'Pulmonologist',
        doctorIds: ['doc5'],
        riskFactors: { femaleHigher: false, ageRisk: 65 },
        redFlags: ['blue lips or fingertips', 'confusion', 'breathing more than 30 times per minute', 'very high fever above 39°C'],
        selfCare: 'This condition requires medical treatment. Rest and hydration alone are insufficient. See a doctor promptly.',
        source: 'HealthyWA — Pneumonia',
        medicines: [
            { name: 'Amoxicillin', sideEffects: 'Nausea, vomiting, diarrhea, mild skin rash.', buyLink: 'https://pharmeasy.in/search/all?name=Amoxicillin' }
        ]
    },
    {
        name: 'Urinary Tract Infection (UTI)',
        keywords: [
            'uti', 'urinary tract infection',
            'burning when peeing', 'burning when urinating', 'stinging when i pee', 'pain when peeing', 'painful urination',
            'need to pee urgently', 'desperate to urinate', 'keep needing the toilet',
            'peeing very often', 'going to toilet all the time', 'urinating all the time',
            'cloudy urine', 'smelly urine', 'dark urine', 'blood in urine', 'pink urine',
            'lower belly pain', 'lower abdominal pain', 'pelvic pain', 'bladder pain',
            'pressure in bladder', 'burning sensation down below'
        ],
        description: 'A UTI is an infection in any part of the urinary system. Symptoms include a burning feeling when urinating, frequent urges to urinate, cloudy or strong-smelling urine, and pelvic pain.',
        urgency: 'moderate',
        specialty: 'General Practitioner',
        doctorIds: ['doc1'],
        riskFactors: { femaleHigher: true, ageRisk: null },
        redFlags: ['fever and back pain together', 'blood in urine', 'symptoms in men or children', 'symptoms not improving after 48 hrs'],
        selfCare: 'Drink plenty of water. Urinate frequently. See a GP — antibiotics are usually needed.',
        source: 'NHS Conditions — Urinary Tract Infections',
        medicines: [
            { name: 'Nitrofurantoin', sideEffects: 'Headache, dizziness, gas, upset stomach, diarrhea.', buyLink: 'https://pharmeasy.in/search/all?name=Nitrofurantoin' }
        ]
    },
    {
        name: 'Irritable Bowel Syndrome (IBS)',
        keywords: [
            'ibs', 'irritable bowel',
            'bloated stomach', 'stomach bloating', 'stomach feels bloated', 'very bloated',
            'stomach cramps after eating', 'pain after eating', 'cramps after meals',
            'alternating diarrhea and constipation', 'sometimes constipated sometimes diarrhea',
            'mucus in stool', 'mucus in poo', 'slimy stool',
            'excessive wind', 'lots of gas', 'flatulence', 'cannot stop farting',
            'bowel changes', 'irregular bowel movements', 'bowel problems',
            'feel better after going to toilet', 'stomach pain relieved by bowel movement'
        ],
        description: 'IBS is a common, long-term condition of the digestive system. It causes stomach cramps, bloating, diarrhoea and/or constipation, often linked to stress and diet.',
        urgency: 'low',
        specialty: 'Gastroenterologist',
        doctorIds: ['doc6'],
        riskFactors: { femaleHigher: true, ageRisk: null },
        redFlags: ['blood in stool', 'unintentional weight loss', 'onset after age 60', 'family history of bowel cancer'],
        selfCare: 'Keep a food diary to identify triggers. Eat smaller, regular meals. Reduce stress. Exercise regularly.',
        source: 'NHS Conditions — IBS',
        medicines: [
            { name: 'Mebeverine', sideEffects: 'Skin rash, dry mouth, heartburn, dizziness.', buyLink: 'https://pharmeasy.in/search/all?name=Mebeverine' }
        ]
    },
    {
        name: 'Eczema (Atopic Dermatitis)',
        keywords: [
            'eczema', 'dermatitis', 'atopic',
            'itchy skin', 'skin is itchy', 'skin keeps itching', 'uncontrollable skin itch',
            'dry skin patches', 'very dry skin', 'skin is very dry',
            'red patches on skin', 'red skin', 'skin is red and itchy',
            'flaky skin', 'skin peeling', 'scaly skin', 'rough dry skin',
            'skin cracking', 'cracked skin', 'skin splits',
            'rash on arms', 'rash on legs', 'rash on face', 'skin rash'
        ],
        description: 'Eczema is a condition that causes the skin to become itchy, red, dry, and cracked. It is a long-term condition in most people, although it can improve over time.',
        urgency: 'low',
        specialty: 'Dermatologist',
        doctorIds: ['doc7'],
        riskFactors: { femaleHigher: false, ageRisk: null },
        redFlags: ['skin weeping or oozing (possible infection)', 'fever alongside a rash', 'rapidly spreading rash'],
        selfCare: 'Moisturise regularly with unperfumed cream. Avoid soaps and harsh detergents. Use lukewarm water for washing.',
        source: 'NHS Conditions — Atopic Eczema',
        medicines: [
            { name: 'Hydrocortisone Cream', sideEffects: 'Stinging, burning, irritation, dryness or redness at the application site.', buyLink: 'https://pharmeasy.in/search/all?name=Hydrocortisone' }
        ]
    },
    {
        name: 'Angina (Chest Pain)',
        keywords: [
            'angina',
            'chest pain', 'pain in chest', 'chest hurts', 'chest is painful',
            'pressure on my chest', 'squeezing in chest', 'chest feels squeezed',
            'tightness in chest', 'chest feels tight',
            'pain in left arm', 'left arm pain', 'left arm hurts',
            'jaw pain', 'jaw hurts', 'pain spreading to jaw',
            'neck pain with chest tightness',
            'heart palpitations', 'heart skipping beats', 'irregular heartbeat',
            'sweating with chest pain', 'sweaty with chest pain',
            'chest pain on exertion', 'chest pain when walking', 'chest pain during exercise'
        ],
        description: 'Angina is chest pain caused by reduced blood flow to the heart muscles. It is often a sign of coronary heart disease. Symptoms include pressure, squeezing, or tightness in the chest.',
        urgency: 'urgent',
        specialty: 'Cardiologist',
        doctorIds: ['doc2'],
        riskFactors: { femaleHigher: false, ageRisk: 50 },
        redFlags: ['chest pain at rest', 'pain spreading to left arm or jaw', 'sweating with chest pain', 'pain lasting more than 15 minutes — CALL EMERGENCY SERVICES IMMEDIATELY'],
        selfCare: 'This may be a medical emergency. Call emergency services immediately for new or severe symptoms. Do not drive yourself.',
        source: 'NHS Conditions — Angina',
        medicines: [
            { name: 'Glyceryl Trinitrate (GTN)', sideEffects: 'Headache, dizziness, lightheadedness, nausea, flushing.', buyLink: 'https://pharmeasy.in/search/all?name=Glyceryl+Trinitrate' }
        ]
    },
    {
        name: 'Depression',
        keywords: [
            'depression', 'depressed',
            'feeling very sad', 'feeling really low', 'very low mood', 'low mood all the time',
            'feeling hopeless', 'no hope', 'feel like nothing matters',
            'no motivation', 'lost motivation', 'cannot motivate myself',
            'lost interest in things', 'no longer enjoy things i used to', 'nothing interests me',
            'cannot sleep', 'sleeping too much', 'sleep is terrible',
            'feeling worthless', 'feel worthless', 'feel like a burden',
            'always crying', 'cry for no reason', 'tearful all the time',
            'feel empty inside', 'emotionally numb', 'feel nothing',
            'cannot concentrate', 'brain feels foggy', 'cannot focus',
            'thoughts of self harm', 'thinking about hurting myself'
        ],
        description: 'Depression is a mood disorder causing a persistent feeling of sadness and loss of interest. It affects how you feel, think, and handle daily activities.',
        urgency: 'moderate',
        specialty: 'General Practitioner',
        doctorIds: ['doc1'],
        riskFactors: { femaleHigher: true, ageRisk: null },
        redFlags: ['thoughts of self-harm or suicide — seek immediate help', 'complete inability to function day-to-day'],
        selfCare: 'Speak to someone you trust. Stay physically active. Maintain a regular sleep routine. See a GP for assessment and referral.',
        source: 'NHS Conditions — Clinical Depression',
        medicines: [
            { name: 'Sertraline', sideEffects: 'Nausea, diarrhea, sleep problems, dry mouth, dizziness.', buyLink: 'https://pharmeasy.in/search/all?name=Sertraline' }
        ]
    },
    {
        name: 'Hypothyroidism (Underactive Thyroid)',
        keywords: [
            'hypothyroidism', 'underactive thyroid', 'thyroid problem',
            'unexplained weight gain', 'gaining weight for no reason', 'putting on weight without eating more',
            'always feel cold', 'cold all the time', 'feel cold even indoors', 'cannot tolerate cold',
            'hair falling out', 'hair is thinning', 'losing lots of hair',
            'skin is very dry', 'very dry skin',
            'always constipated', 'chronic constipation',
            'memory getting worse', 'keep forgetting things', 'brain fog', 'feel mentally slow',
            'feel sluggish', 'no energy at all', 'exhausted despite sleeping',
            'puffy face', 'face looks puffy', 'swollen around eyes'
        ],
        description: 'Hypothyroidism is a condition where the thyroid gland does not produce enough thyroid hormone. It slows the body\'s metabolism, causing fatigue, weight gain, and feeling cold.',
        urgency: 'low',
        specialty: 'Endocrinologist',
        doctorIds: ['doc8'],
        riskFactors: { femaleHigher: true, ageRisk: 60 },
        redFlags: ['extreme fatigue preventing daily tasks', 'significant unexplained weight gain', 'puffy face with cold intolerance'],
        selfCare: 'Schedule a thyroid function blood test with your GP. This is easily managed with daily medication once diagnosed.',
        source: 'NHS Conditions — Underactive Thyroid',
        medicines: [
            { name: 'Levothyroxine', sideEffects: 'Weight changes, headache, vomiting, diarrhea, changes in appetite.', buyLink: 'https://pharmeasy.in/search/all?name=Levothyroxine' }
        ]
    },
    {
        name: 'Arthritis (Osteoarthritis)',
        keywords: [
            'arthritis', 'osteoarthritis',
            'joint pain', 'joints are painful', 'my joints hurt', 'painful joints',
            'joint ache', 'joints ache', 'achy joints',
            'stiff joints', 'joints feel stiff', 'joint stiffness',
            'stiff in the morning', 'joints stiff when i wake up', 'morning stiffness',
            'knee pain', 'knee hurts', 'pain in my knee', 'knees are swollen',
            'hip pain', 'pain in hip', 'hip hurts',
            'hand pain', 'finger joints pain', 'knuckle pain', 'wrist pain',
            'creaking joints', 'joints click', 'joints creak',
            'swollen knee', 'swollen joints', 'inflamed joints',
            'back pain', 'lower back pain', 'back is killing me', 'chronic back pain'
        ],
        description: 'Osteoarthritis is the most common type of arthritis, causing joints to become painful and stiff. It most commonly affects the knees, hips, and small joints of the hands.',
        urgency: 'low',
        specialty: 'General Practitioner',
        doctorIds: ['doc1', 'doc3'],
        riskFactors: { femaleHigher: true, ageRisk: 50 },
        redFlags: ['sudden severe joint swelling or redness', 'joint pain after an injury', 'fever with joint pain (possible infection)'],
        selfCare: 'Regular gentle exercise helps maintain mobility. Maintain a healthy weight. Over-the-counter pain relief may help for flare-ups.',
        source: 'NHS Conditions — Osteoarthritis',
        medicines: [
            { name: 'Naproxen', sideEffects: 'Indigestion, heartburn, stomach pain, nausea, headache.', buyLink: 'https://pharmeasy.in/search/all?name=Naproxen' }
        ]
    },
    {
        name: 'Common Cold',
        keywords: [
            'runny nose', 'nose is running', 'nose keeps running',
            'blocked nose', 'stuffy nose', 'nose is blocked', 'cannot breathe through nose',
            'sore throat', 'throat is sore', 'throat hurts', 'painful throat', 'scratchy throat',
            'sneezing', 'keep sneezing', 'cannot stop sneezing',
            'mild cough', 'slight cough', 'dry cough',
            'nasal congestion', 'congested nose', 'head congestion',
            'feeling under the weather', 'feel run down', 'bit under the weather',
            'mild temperature', 'slightly raised temperature', 'feel a bit warm',
            'earache', 'ear pain', 'ears are hurting',
            'cold symptoms', 'think i have a cold', 'coming down with a cold'
        ],
        description: 'The common cold is a viral infection of the upper respiratory tract. It causes a runny or blocked nose, sore throat, and mild cough. It usually resolves within 7–10 days.',
        urgency: 'low',
        specialty: 'General Practitioner',
        doctorIds: ['doc1'],
        riskFactors: { femaleHigher: false, ageRisk: null },
        redFlags: ['symptoms lasting more than 10 days', 'high fever above 39°C', 'difficulty breathing', 'severe headache or ear pain'],
        selfCare: 'Rest, drink plenty of fluids, and use over-the-counter remedies for symptom relief. Wash hands regularly.',
        source: 'NHS Conditions — Common Cold',
        medicines: [
            { name: 'Paracetamol', sideEffects: 'Nausea, stomach pain, loss of appetite, headache.', buyLink: 'https://pharmeasy.in/search/all?name=Paracetamol' },
            { name: 'Cetirizine', sideEffects: 'Drowsiness, dry mouth, tiredness, stomach pain.', buyLink: 'https://pharmeasy.in/search/all?name=Cetirizine' }
        ]
    }
];
