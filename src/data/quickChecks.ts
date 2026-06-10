/**
 * Short, single-question knowledge checks dropped inline between lesson sections
 * to keep the module interactive. High-yield and simple by design — grounded in
 * each module's curated views / systematic read / do-not-miss / pathology data.
 *
 * Questions are AI-authored and independently medical-verified; keep them factual
 * and unambiguous.
 */

export interface QuickCheckQ {
  id: string;
  question: string;
  options: string[];
  answer: number; // 0-based index of the correct option
  explanation: string;
}

export const quickChecks: Record<string, QuickCheckQ[]> = {
  "xray-foundations": [
    {
      "id": "xray-foundations-qc-1",
      "question": "A patient with midfoot pain can bear weight, and the non-weightbearing AP foot looks normal. Which view best unmasks a subtle Lisfranc injury (disruption of the joint between the first/second metatarsals and the midfoot)?",
      "options": [
        "Weightbearing AP foot",
        "Lateral foot, non-weightbearing",
        "Calcaneal axial view",
        "Skyline (sunrise) view"
      ],
      "answer": 0,
      "explanation": "Weightbearing loads the midfoot and reveals widening (diastasis) between the first and second metatarsals that is often invisible on non-weightbearing films."
    },
    {
      "id": "xray-foundations-qc-2",
      "question": "A patient falls on an outstretched hand and has tenderness in the anatomic snuffbox, but the wrist x-rays are read as normal. What is the best next step?",
      "options": [
        "Thumb spica splint with repeat x-ray in 10-14 days or MRI",
        "Reassure and return only if pain persists",
        "NSAIDs and physical therapy referral",
        "Order CT with contrast today"
      ],
      "answer": 0,
      "explanation": "Snuffbox tenderness after a fall on an outstretched hand is the classic occult scaphoid fracture scenario, so a normal x-ray does not exclude it and the wrist should be immobilized with delayed imaging or MRI."
    }
  ],
  "shoulder": [
    {
      "id": "shoulder-qc-1",
      "question": "A patient is suspected of having a posterior shoulder dislocation after a seizure, but the AP view looks nearly normal. Which view is most essential to confirm whether the humeral head sits properly in the glenoid?",
      "options": [
        "AP internal rotation view",
        "Axillary view (or an adequate scapular Y)",
        "AC joint view",
        "AP external rotation (Grashey) view"
      ],
      "answer": 1,
      "explanation": "The AP can look deceptively normal in posterior dislocation, so a true axillary view (or adequate scapular Y) is required to assess glenohumeral alignment."
    },
    {
      "id": "shoulder-qc-2",
      "question": "On an AP shoulder film, the humeral head is fixed in internal rotation and looks smooth and rounded like a light bulb (the \"light bulb sign\"). Which can't-miss diagnosis should this make you suspect?",
      "options": [
        "Anterior shoulder dislocation",
        "Posterior shoulder dislocation",
        "AC joint separation",
        "Calcific tendinopathy"
      ],
      "answer": 1,
      "explanation": "The light bulb sign on the AP view reflects a humeral head locked in internal rotation and is a classic clue to an easily missed posterior shoulder dislocation."
    }
  ],
  "elbow": [
    {
      "id": "elbow-qc-1",
      "question": "Which single view is best for evaluating the elbow fat pads and the anterior humeral line (the line drawn down the front of the humerus on a true lateral)?",
      "options": [
        "The lateral elbow view",
        "The AP elbow view",
        "The oblique view",
        "No single view shows these reliably"
      ],
      "answer": 0,
      "explanation": "The true lateral elbow is the key view for the fat pad signs and the anterior humeral line, which is why you must confirm a true lateral before trusting those findings."
    },
    {
      "id": "elbow-qc-2",
      "question": "On a lateral elbow after trauma, you should never normally see a posterior fat pad. What does a visible posterior fat pad most often indicate?",
      "options": [
        "A normal anatomic variant",
        "An occult intra-articular fracture (radial head in adults)",
        "Olecranon bursitis (inflammation of the superficial bursa over the olecranon)",
        "Medial epicondylitis (golfer's elbow)"
      ],
      "answer": 1,
      "explanation": "A posterior fat pad is never normal after trauma and should be treated as an occult intra-articular fracture, most commonly a radial head fracture in adults."
    }
  ],
  "wrist-hand": [
    {
      "id": "wrist-hand-qc-1",
      "question": "A patient has radial-sided wrist pain and tenderness in the anatomic snuffbox after a fall on an outstretched hand. Which view is specifically designed to elongate the scaphoid and improve detection of a waist fracture?",
      "options": [
        "Scaphoid view",
        "Posteroanterior (PA) hand view",
        "Oblique hand view",
        "Carpal tunnel view"
      ],
      "answer": 0,
      "explanation": "The dedicated scaphoid view elongates the scaphoid and improves detection of waist fractures, making it the view to add for snuffbox tenderness."
    },
    {
      "id": "wrist-hand-qc-2",
      "question": "A snowboarder has snuffbox tenderness after a fall on an outstretched hand, but the initial wrist x-rays look normal. What is the safest next step?",
      "options": [
        "Thumb spica splint with repeat imaging in 10-14 days or MRI",
        "Clear the wrist as a sprain and allow return to play",
        "Reassure and arrange routine follow-up with no further imaging",
        "Treat the symptoms as carpal tunnel syndrome"
      ],
      "answer": 0,
      "explanation": "An occult scaphoid fracture (a break not yet visible on early films) carries a high risk of nonunion and avascular necrosis, so a convincing exam warrants immobilization and repeat or advanced imaging rather than clearance."
    }
  ],
  "pelvis-hip": [
    {
      "id": "pelvis-hip-qc-1",
      "question": "On an AP pelvis radiograph, a line drawn along the superior border of the femoral neck (the Klein line) should normally do what?",
      "options": [
        "Intersect a portion of the lateral femoral epiphysis (the bony cap of the femoral head)",
        "Pass completely below the femoral head without touching it",
        "Run parallel to the Shenton line on the opposite hip",
        "Bisect the obturator foramen"
      ],
      "answer": 0,
      "explanation": "A normal Klein line along the superior femoral neck intersects the lateral femoral epiphysis; failure to do so is a classic clue to a slipped capital femoral epiphysis (SCFE)."
    },
    {
      "id": "pelvis-hip-qc-2",
      "question": "A 28-year-old distance runner has progressive groin pain with impact, and the AP pelvis looks normal. Why must a femoral neck stress fracture not be dismissed on a normal film?",
      "options": [
        "A tension-side femoral neck stress fracture can complete catastrophically, so a normal x-ray does not rule it out",
        "Stress fractures of the femoral neck always heal without restriction, so no follow-up is needed",
        "Groin pain in runners is almost always referred from the lumbar spine",
        "A normal radiograph reliably excludes a femoral neck stress fracture"
      ],
      "answer": 0,
      "explanation": "Femoral neck stress fractures can be radiographically occult and tension-side injuries may complete catastrophically, so persistent runner groin pain warrants protected weightbearing and urgent MRI despite a normal x-ray."
    }
  ],
  "knee": [
    {
      "id": "knee-qc-1",
      "question": "A patient has anterior knee pain and a feeling that the kneecap slips out of place. Which view best shows patellofemoral alignment and patellar tilt?",
      "options": [
        "Sunrise / Merchant view",
        "Weightbearing PA flexion (Rosenberg) view",
        "AP knee view",
        "Tunnel / notch view"
      ],
      "answer": 0,
      "explanation": "The Sunrise/Merchant view looks down the patellofemoral joint and is the go-to for assessing patellar alignment, tilt, and trochlear shape in anterior knee pain or patellar instability."
    },
    {
      "id": "knee-qc-2",
      "question": "On an AP knee film after a pivoting injury, you see a small avulsion fragment off the lateral tibial plateau (a Segond fracture, a lateral tibial-rim avulsion). What associated injury should this make you most concerned about?",
      "options": [
        "Anterior cruciate ligament (ACL) tear",
        "Patellar tendon rupture",
        "Tibial tubercle apophysitis (Osgood-Schlatter)",
        "Simple bone bruise with no ligament injury"
      ],
      "answer": 0,
      "explanation": "A Segond fracture is highly associated with an ACL tear, so this small avulsion should prompt an MRI rather than being dismissed as a minor finding."
    }
  ],
  "ankle-foot": [
    {
      "id": "ankle-foot-qc-1",
      "question": "For a patient with an acute ankle injury, which single view best shows talar dome, the syndesmosis, and overall joint congruity (the medial and superior clear spaces)?",
      "options": [
        "Mortise view (taken with about 15 degrees of internal leg rotation)",
        "AP ankle view",
        "Lateral ankle view",
        "Weightbearing oblique foot view"
      ],
      "answer": 0,
      "explanation": "The mortise view (15 degrees of internal rotation) is the answer view for acute ankle injuries because it profiles the talar dome, syndesmosis, and joint-space symmetry better than the standard AP or lateral."
    },
    {
      "id": "ankle-foot-qc-2",
      "question": "A patient has midfoot pain after a fall with plantar (sole-of-foot) bruising, but the non-weightbearing AP foot film looks normal. What is the best next step to avoid missing a Lisfranc injury (disruption at the tarsometatarsal joints)?",
      "options": [
        "Get weightbearing foot films or a CT",
        "Reassure and discharge with NSAIDs",
        "Order an MRI of the lumbar spine",
        "Repeat the same non-weightbearing film in 2 weeks"
      ],
      "answer": 0,
      "explanation": "Lisfranc injuries are often invisible on non-weightbearing films, so plantar ecchymosis with midfoot pain warrants weightbearing views or CT before excluding the diagnosis."
    }
  ],
  "spine": [
    {
      "id": "spine-qc-1",
      "question": "On a lateral cervical spine radiograph, what must be visible for the study to be considered adequate?",
      "options": [
        "The cervical spine down through the C7-T1 junction",
        "Only the C1-C2 (atlas-axis) region",
        "The base of the skull only",
        "Both shoulder joints in full"
      ],
      "answer": 0,
      "explanation": "A lateral cervical film is only adequate if it shows down through the C7-T1 junction; otherwise the lower cervical spine has not been cleared."
    },
    {
      "id": "spine-qc-2",
      "question": "An adolescent gymnast has focal low back pain that is worse with back extension. Which do-not-miss diagnosis should be highest on your list?",
      "options": [
        "Spondylolysis (a stress injury of the pars interarticularis, the bony bridge in the posterior vertebra)",
        "Vertebral compression fracture from osteoporosis",
        "Cervical instability",
        "Scaphoid (wrist bone) fracture"
      ],
      "answer": 0,
      "explanation": "Focal extension-related low back pain in an adolescent athlete points to spondylolysis (a pars stress injury), which can be subtle or invisible on early radiographs."
    }
  ],
  "pediatric-adolescent": [
    {
      "id": "pediatric-adolescent-qc-1",
      "question": "In an adolescent with hip, thigh, or knee pain and a limp, which extra view best improves detection of a slipped capital femoral epiphysis (SCFE, the growth plate of the femoral head slipping off the neck)?",
      "options": [
        "A frog-leg lateral of the pelvis/hips",
        "A standing AP of both knees",
        "An oblique view of the affected foot",
        "A comparison view of the contralateral elbow"
      ],
      "answer": 0,
      "explanation": "The frog-leg lateral profiles the proximal femoral physis and improves detection of SCFE, whose Klein-line abnormality on the plain AP can be subtle."
    },
    {
      "id": "pediatric-adolescent-qc-2",
      "question": "A child has point tenderness directly over an open growth plate after an injury, but the x-ray looks normal. What is the safest interpretation?",
      "options": [
        "A possible Salter-Harris I injury (a fracture through the growth plate that can be invisible on x-ray)",
        "A normal exam that can be cleared, since the x-ray is negative",
        "An overuse apophysitis at a tendon attachment",
        "An accessory ossification center that mimics a fracture"
      ],
      "answer": 0,
      "explanation": "Salter-Harris I injuries can be radiographically occult, so focal tenderness over an open physis should be treated as a possible growth-plate fracture with immobilization and follow-up rather than cleared."
    }
  ],
  "do-not-miss": [
    {
      "id": "do-not-miss-qc-1",
      "question": "A patient who had a seizure now holds the arm internally rotated and cannot externally rotate it, but the standard AP shoulder film looks near-normal. Which view best confirms a suspected posterior shoulder dislocation?",
      "options": [
        "Axillary view",
        "Weightbearing view",
        "Standard AP view alone",
        "Frog-leg lateral view"
      ],
      "answer": 0,
      "explanation": "Posterior shoulder dislocation is easy to miss on the AP film, so an axillary (or Velpeau) view is needed to prove the joint relationship."
    },
    {
      "id": "do-not-miss-qc-2",
      "question": "On a knee x-ray after a pivoting injury, you spot a small bone fragment avulsed off the lateral edge of the tibia (a Segond fracture, a lateral tibial-rim avulsion). What associated injury should this make you suspect?",
      "options": [
        "ACL (anterior cruciate ligament) tear",
        "Patellar tendon rupture",
        "Tibial tubercle apophysitis",
        "Isolated calf muscle strain"
      ],
      "answer": 0,
      "explanation": "A Segond fracture is strongly associated with an ACL tear, so it should prompt a knee MRI even though the bony fragment itself is small."
    }
  ]
};

export function getQuickChecks(moduleId: string): QuickCheckQ[] {
  return quickChecks[moduleId] ?? [];
}
