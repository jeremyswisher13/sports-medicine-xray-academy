import type { ModuleContent } from '../types';

export interface ClinicCheatSheetSpec {
  requiredViews: string[];
  addOnViews: string[];
  viewAdequacyWarning: string;
  negativeXrayEscalation: string[];
  signs: string[];
  patterns: string[];
  doNotMiss: string[];
  pitfalls: string[];
  pearl: string;
  quickTips: string[];
}

const specs: Record<string, ClinicCheatSheetSpec> = {
  'xray-foundations': {
    requiredViews: [
      'Trauma default: at least 2 orthogonal views.',
      'Joints often deserve 3 views unless there is a reason not to.',
      'Document whether the study is weightbearing when alignment or joint space is the question.',
    ],
    addOnViews: [
      'Weightbearing views for instability, joint-space loss, midfoot alignment, and some ankle/knee questions.',
      'Selective comparison views when pediatric normal variants or dynamic instability are plausible.',
    ],
    viewAdequacyWarning:
      'A study can be technically completed but clinically inadequate if it does not answer fracture, instability, growth-plate, or degeneration questions.',
    negativeXrayEscalation: [
      'Repeat or add missing views first when the series is inadequate.',
      'Use CT for occult cortical or intra-articular fracture questions.',
      'Use MRI for stress, marrow, osteochondral, physeal, ligament, tendon, or persistent unexplained symptoms.',
    ],
    signs: [
      'Confirm: patient, side, date, view, rotation, exposure, clipping.',
      'ABCS plus physes: alignment, bone, cartilage, soft tissues, growth centers.',
      'Salter-Harris: I physis; II metaphysis; III epiphysis; IV through all; V crush.',
    ],
    patterns: [
      'Fracture vs accessory ossicle or unfused apophysis.',
      'Avulsion vs chronic traction apophysitis.',
      'Dislocation/subluxation vs positional artifact.',
    ],
    doNotMiss: [
      'Dislocation, unstable fracture, open injury, neurovascular deficit, compartment syndrome.',
      'Gas, pathologic/aggressive lesion, infection concern, or inability to obtain an adequate series.',
    ],
    pitfalls: [
      'Accepting an inadequate series.',
      'Stopping after the first abnormality.',
      'Assuming normal early x-ray excludes stress, scaphoid, femoral neck, pars, or physeal injury.',
    ],
    pearl:
      'The easiest way to miss a fracture is to accept an inadequate series or stop after the first abnormality.',
    quickTips: [
      'Say adequate or inadequate before interpretation.',
      'Ask what clinical question the x-ray must answer.',
      'If the region is a joint, think 3 views.',
      'Negative film plus high suspicion means escalate, not reassure.',
    ],
  },
  shoulder: {
    requiredViews: [
      'AP internal rotation.',
      'AP external rotation.',
      'Axillary or scapular Y; use Velpeau/modified axillary if abduction is not possible.',
    ],
    addOnViews: [
      'Zanca view for AC joint injury.',
      'CT when glenoid bone loss, fracture planes, or complex proximal humerus injury need definition.',
      'MRI for persistent weakness/pain with suspected cuff, labral, or occult fracture injury.',
    ],
    viewAdequacyWarning:
      'No axillary/axial relationship means the study is incomplete for instability.',
    negativeXrayEscalation: [
      'Add the missing axial/Y relationship before excluding dislocation.',
      'CT for fracture-dislocation, glenoid rim fracture, or surgical planning.',
      'MRI for occult fracture, cuff, or labral injury when symptoms persist.',
    ],
    signs: [
      'Humeral head centered on glenoid.',
      'Light-bulb, trough line, or abnormal overlap suggests posterior dislocation but does not prove it.',
      'Acromiohumeral interval <7 mm suggests chronic rotator cuff insufficiency.',
      'Zanca positioning uses 10-15 degrees cephalic tilt.',
    ],
    patterns: [
      'Anterior dislocation with Hill-Sachs or Bankart.',
      'Posterior dislocation after seizure, electrical injury, or direct blow.',
      'AC separation vs adolescent distal clavicle physeal injury.',
    ],
    doNotMiss: [
      'Posterior dislocation.',
      'Fracture-dislocation.',
      'Glenoid rim fracture.',
      'Neurovascular compromise.',
      'Occult greater tuberosity fracture.',
    ],
    pitfalls: [
      'AP-only shoulder trauma series.',
      'Missing subtle greater tuberosity avulsion or scapular fracture.',
      'Applying adult AC-separation labels to adolescent distal clavicle physeal injury.',
    ],
    pearl:
      'If the shoulder series has no axillary/axial relationship, it is incomplete for instability.',
    quickTips: [
      'Ask centered or not centered first.',
      'Trace the glenoid rim and greater tuberosity every time.',
      'Use Zanca when the clinical story is AC.',
      'Round humeral head on AP is a clue, not a diagnosis.',
    ],
  },
  elbow: {
    requiredViews: [
      'AP elbow.',
      'True lateral elbow.',
      'Add oblique views when fracture detail is needed.',
    ],
    addOnViews: [
      'Radial head-capitellum/Coyle view for radial head, capitellum, or coronoid questions.',
      'Selective comparison views for pediatric ossification-center uncertainty.',
      'MRI for OCD, instability, or soft tissue injury when needed.',
    ],
    viewAdequacyWarning:
      'Fat pads and alignment lines are only trustworthy on a true lateral.',
    negativeXrayEscalation: [
      'Treat posterior fat pad as occult fracture until proven otherwise.',
      'Repeat films in 10-14 days or CT when occult fracture remains likely.',
      'MRI for capitellar OCD or instability concern.',
    ],
    signs: [
      'Anterior humeral line should bisect the capitellum on lateral.',
      'Radiocapitellar line should intersect the capitellum on every view.',
      'Posterior fat pad is abnormal.',
      'CRITOE helps distinguish ossification centers from fragments.',
    ],
    patterns: [
      'Radial head/neck fracture.',
      'Supracondylar fracture.',
      'Elbow dislocation.',
      'Capitellar OCD.',
      'Medial epicondyle apophysitis or avulsion in throwers.',
    ],
    doNotMiss: [
      'Occult fracture with posterior fat pad.',
      'Pediatric supracondylar fracture.',
      'Elbow dislocation with entrapped medial epicondyle.',
      'Capitellar OCD in throwers/gymnasts.',
    ],
    pitfalls: [
      'Non-true lateral film hiding effusion.',
      'Mistaking ossification centers for fracture.',
      'Forgetting radiocapitellar alignment after seeing a small fragment.',
    ],
    pearl:
      'A posterior fat pad is not a diagnosis, but it is enough evidence to manage as occult fracture.',
    quickTips: [
      'Draw AHL and RCL mentally on every film.',
      'Name the ossification centers in children.',
      'Obliques can rescue radial head/coronoid detail.',
      'Do not call a posterior fat pad normal.',
    ],
  },
  'wrist-hand': {
    requiredViews: [
      'Dedicated PA/AP wrist or hand.',
      'Oblique view.',
      'True lateral view.',
    ],
    addOnViews: [
      'Scaphoid view for suspected scaphoid fracture.',
      'Clenched-fist/stress view for scapholunate instability.',
      'Carpal tunnel or semi-supinated oblique view for hook of hamate.',
    ],
    viewAdequacyWarning:
      'A non-true lateral can hide perilunate/lunate malalignment.',
    negativeXrayEscalation: [
      'Thumb spica plus repeat films in 10-14 days or MRI for suspected scaphoid fracture.',
      'CT for occult cortical carpal/metacarpal fracture detail.',
      'MRI for ligament injury or persistent high suspicion.',
    ],
    signs: [
      'Gilula arcs should be smooth on PA.',
      'Radius, lunate, and capitate should stack on lateral.',
      'Scapholunate interval >3 mm suggests SL injury.',
      'Normal scapholunate angle is roughly 30-60 degrees.',
    ],
    patterns: [
      'Distal radius fracture.',
      'Scaphoid fracture.',
      'Metacarpal neck fracture.',
      'Bennett/Rolando fracture.',
      'Scapholunate widening/DISI.',
      'Perilunate or lunate dislocation.',
    ],
    doNotMiss: [
      'Occult scaphoid fracture.',
      'Perilunate/lunate dislocation.',
      'Dynamic scapholunate instability.',
      'Hook of hamate fracture in bat/racquet athletes.',
    ],
    pitfalls: [
      'Stopping at the obvious distal radius fracture.',
      'Not checking carpal arcs and lateral stacking.',
      'Reassuring snuffbox tenderness after normal initial films.',
    ],
    pearl:
      'A wrist sprain with broken carpal alignment is not a sprain until perilunate injury is excluded.',
    quickTips: [
      'Trace Gilula arcs before leaving the PA.',
      'Stack radius-lunate-capitate on the lateral.',
      'Immobilize suspected scaphoid even when early films are normal.',
      'Use stress views for dynamic SL widening.',
    ],
  },
  'pelvis-hip': {
    requiredViews: [
      'AP pelvis.',
      'For trauma: AP hip plus cross-table lateral.',
      'For non-fracture hip pain: frog-leg lateral when safe.',
    ],
    addOnViews: [
      'Dunn view for cam morphology.',
      'False-profile view for hip preservation/coverage questions.',
      'Bilateral AP plus frog-leg lateral for stable SCFE; cross-table lateral for unstable SCFE.',
    ],
    viewAdequacyWarning:
      'Do not force frog-leg positioning when acute femoral neck fracture or unstable SCFE is suspected.',
    negativeXrayEscalation: [
      'MRI for suspected femoral neck stress fracture or occult hip fracture.',
      'Urgent ortho referral for SCFE.',
      'CT when fracture characterization changes management.',
    ],
    signs: [
      "Shenton's line should be smooth.",
      'Femoral head coverage and acetabular lines should be symmetric.',
      "Klein's/Trethowan's line should intersect the lateral femoral epiphysis.",
      'Femoral neck stress injury may be radiographically occult.',
    ],
    patterns: [
      'Cam or pincer FAI.',
      'Dysplasia clues.',
      'Femoral neck stress fracture.',
      'Pelvic apophyseal avulsion.',
      'SCFE or Perthes in adolescents.',
    ],
    doNotMiss: [
      'SCFE presenting as hip, groin, thigh, or knee pain.',
      'Femoral neck stress fracture.',
      'Occult hip fracture with negative x-rays.',
      'Unstable apophyseal avulsion with functional deficit.',
    ],
    pitfalls: [
      'Imaging only the knee when pain is referred from the hip.',
      'Letting a negative x-ray reassure high-risk groin pain.',
      'Using frog-leg lateral in acute fracture concern.',
    ],
    pearl:
      'Hip disease can masquerade as knee pain, especially in adolescents.',
    quickTips: [
      'Start with AP pelvis.',
      'Choose the lateral view based on fracture risk.',
      'Think SCFE in adolescent hip/thigh/knee pain.',
      'MRI beats reassurance for high-risk femoral neck pain.',
    ],
  },
  knee: {
    requiredViews: [
      'AP and lateral minimum for acute trauma.',
      'Standing weightbearing views for chronic OA/joint-space questions.',
    ],
    addOnViews: [
      'Sunrise/Merchant for patellar fracture, subluxation, or dislocation.',
      'Tunnel/notch when OCD or intercondylar pathology is suspected.',
      'CT for tibial plateau or intra-articular fracture characterization.',
    ],
    viewAdequacyWarning:
      'Patellofemoral instability is easy to undercall without a skyline/Merchant-type view.',
    negativeXrayEscalation: [
      'CT for suspected tibial plateau or intra-articular fracture.',
      'MRI for ACL-associated avulsion, OCD, extensor mechanism injury, or occult internal derangement.',
      'Treat lipohemarthrosis as intra-articular fracture until proven otherwise.',
    ],
    signs: [
      'Suprapatellar effusion on lateral.',
      'Fat-fluid level/lipohemarthrosis implies intra-articular fracture.',
      'Segond fracture implies ACL/internal derangement risk.',
      'Patella height and skyline alignment matter for instability.',
    ],
    patterns: [
      'Patellar dislocation clues.',
      'Patellar fracture.',
      'Tibial plateau fracture.',
      'Tibial spine avulsion.',
      'Segond fracture.',
      'OCD lesion.',
    ],
    doNotMiss: [
      'Segond fracture.',
      'Tibial plateau depression.',
      'Lipohemarthrosis.',
      'Patellar sleeve fracture in children.',
      'Extensor mechanism disruption.',
    ],
    pitfalls: [
      'Calling a tiny lateral tibial avulsion benign.',
      'Missing fat-fluid level on lateral.',
      'Omitting patellofemoral view when instability is the question.',
    ],
    pearl:
      'Tiny avulsion fragments are not tiny diagnoses when they signal major internal derangement.',
    quickTips: [
      'Inspect the suprapatellar recess.',
      'Trace tibial spines and plateau contours.',
      'Add Merchant/sunrise for patellar questions.',
      'Use weightbearing views for OA.',
    ],
  },
  'ankle-foot': {
    requiredViews: [
      'Ankle AP, mortise, and lateral.',
      'Foot AP, oblique, and lateral.',
      'Apply Ottawa rules before ordering when appropriate.',
    ],
    addOnViews: [
      'Weightbearing foot films for suspected Lisfranc injury when tolerated.',
      'Full-length tibia/fibula or proximal fibula views when syndesmosis/Maisonneuve is suspected.',
      'Harris axial for calcaneus when needed.',
    ],
    viewAdequacyWarning:
      'Normal non-weightbearing foot films do not exclude Lisfranc instability.',
    negativeXrayEscalation: [
      'CT or MRI for Lisfranc, occult talar dome, navicular, calcaneal, or stress injury.',
      'Repeat imaging or MRI when persistent pain follows a negative initial study.',
      'Escalate unstable mortise/syndesmosis patterns.',
    ],
    signs: [
      'Mortise congruity and medial clear space.',
      'Medial clear space >4 mm or tibiofibular clear space >6 mm raises syndesmosis concern.',
      'Tarsometatarsal alignment and >2 mm Lisfranc diastasis are alarms.',
      'Fifth metatarsal fracture zone drives management.',
    ],
    patterns: [
      'Weber ankle fracture patterns.',
      'Syndesmotic widening.',
      'Talar dome osteochondral lesion.',
      'Jones/proximal fifth metatarsal fracture.',
      'Lisfranc injury.',
    ],
    doNotMiss: [
      'Lisfranc injury.',
      'Maisonneuve fracture.',
      'Unstable syndesmotic injury.',
      'Talar dome lesion after sprain.',
      'Navicular stress fracture.',
    ],
    pitfalls: [
      'Treating non-weightbearing midfoot films as definitive.',
      'Forgetting proximal fibula tenderness.',
      'Calling persistent post-sprain pain routine without considering talar dome/OCD.',
    ],
    pearl:
      'If midfoot instability is the question, weightbearing is often part of the diagnosis.',
    quickTips: [
      'Read the mortise before the malleoli.',
      'Check the base of the fifth metatarsal.',
      'Look at Lisfranc lines on weightbearing films.',
      'Persistent pain after sprain deserves a pathway.',
    ],
  },
  spine: {
    requiredViews: [
      'Office sports medicine: lumbar AP and lateral when imaging is indicated.',
      'Cervical AP, lateral, and odontoid only in low-risk settings where plain films are appropriate.',
      'High-risk blunt trauma is CT-first, not plain-film clearance.',
    ],
    addOnViews: [
      'Swimmer view if C7-T1 is not seen on lateral cervical film.',
      'Complete-spine radiographs for scoliosis evaluation.',
      'MRI for neurologic deficit, infection/tumor concern, or persistent pars stress suspicion.',
    ],
    viewAdequacyWarning:
      'Do not accept a lateral cervical film that fails to show C7-T1.',
    negativeXrayEscalation: [
      'CT for high-risk trauma or occult fracture concern.',
      'MRI for neurologic deficit, infection, tumor, marrow/stress injury, or persistent pars suspicion.',
      'Do not rely on plain films for cord or disc pathology.',
    ],
    signs: [
      'Cervical alignment lines should be smooth.',
      'Vertebral body height and disc spaces should be preserved for context.',
      'Pars region matters in adolescent extension-based athletes.',
      'Scheuermann: anterior wedging of 3 consecutive vertebrae with endplate irregularity.',
    ],
    patterns: [
      'Spondylolysis and low-grade spondylolisthesis.',
      'Idiopathic scoliosis.',
      'Compression fracture.',
      'Scheuermann kyphosis.',
      'Red-flag pathology requiring advanced imaging.',
    ],
    doNotMiss: [
      'Progressive neurologic deficit.',
      'Cauda equina symptoms.',
      'Cancer/infection concern.',
      'Significant trauma.',
      'Pediatric night pain, systemic symptoms, bowel/bladder dysfunction, or neurologic findings.',
    ],
    pitfalls: [
      'Using office x-rays to clear high-risk trauma.',
      'Missing C7-T1 inadequacy.',
      'Relying on normal x-rays to exclude early pars stress injury.',
    ],
    pearl:
      'A normal AP/lateral lumbar series does not rule out early pars stress injury in a symptomatic adolescent athlete.',
    quickTips: [
      'Separate office sports films from trauma clearance.',
      'Adequacy before anatomy.',
      'If C7-T1 is missing, the study is incomplete.',
      'Red flags beat the x-ray.',
    ],
  },
  'pediatric-adolescent': {
    requiredViews: [
      'Dedicated AP and lateral orthogonal views of the symptomatic region.',
      'Region-specific special views only when they answer the question.',
      'Selected bilateral comparison for SCFE, Little League shoulder, or gymnast wrist.',
    ],
    addOnViews: [
      'Stable SCFE: bilateral AP and frog-leg lateral hips.',
      'Unstable SCFE: AP plus cross-table lateral strategy.',
      'CT for transitional ankle fractures when displacement is uncertain.',
    ],
    viewAdequacyWarning:
      'In growing athletes, the physis is often the weak link; cortical normality can be falsely reassuring.',
    negativeXrayEscalation: [
      'MRI or CT when physeal injury is suspected but plain films are normal/equivocal.',
      'Urgent referral for SH III-V, SCFE, Tillaux/triplane, sleeve fracture, or septic joint concern.',
      'Escalate persistent focal symptoms even with normal films.',
    ],
    signs: [
      'Salter-Harris I-V framework.',
      'CRITOE order for pediatric elbow.',
      "Klein's line should intersect the epiphysis in SCFE.",
      'Tillaux is SH III; triplane is transitional SH IV-type.',
      'Articular displacement >2 mm often changes surgical planning.',
    ],
    patterns: [
      'Little League shoulder/elbow.',
      'Gymnast wrist.',
      'SCFE.',
      'OCD.',
      'Tibial spine avulsion.',
      'Apophyseal avulsion vs traction apophysitis.',
    ],
    doNotMiss: [
      'SCFE.',
      'Septic arthritis in the limping child.',
      'SH III-V injuries.',
      'Tillaux/triplane fractures.',
      'Patellar sleeve fracture.',
      'Incarcerated medial epicondyle.',
    ],
    pitfalls: [
      'Confusing ossification centers with fractures.',
      'Assuming normal films exclude SH I or overuse physeal injury.',
      'Forgetting hip disease can present as knee pain.',
    ],
    pearl:
      'In growing athletes, asymmetric physeal widening matters even when the cortex looks normal.',
    quickTips: [
      'Use age plus ossification pattern before labeling a fragment.',
      'Print CRITOE mentally on every pediatric elbow.',
      'Hip pain can masquerade as knee pain.',
      'Tiny patellar fragments with big symptoms are dangerous.',
    ],
  },
  'do-not-miss': {
    requiredViews: [
      'Use the special view that prevents the miss.',
      'Axillary/Velpeau for painful shoulder.',
      'True lateral elbow and wrist.',
      'Weightbearing foot films for Lisfranc.',
      'Mortise ankle plus proximal fibula view for syndesmosis/Maisonneuve.',
    ],
    addOnViews: [
      'Scaphoid or clenched-fist views for wrist concerns.',
      'Bilateral AP plus lateral hip for SCFE pathway.',
      'Horizontal-beam lateral knee for lipohemarthrosis.',
      'Complete cervical visualization to C7-T1.',
    ],
    viewAdequacyWarning:
      'Ask whether the series is adequate for the dangerous diagnosis, not merely complete.',
    negativeXrayEscalation: [
      'High-risk history plus normal film may be occult injury.',
      'CT for cortical/intra-articular fracture concerns.',
      'MRI for stress, marrow, physeal, OCD, tendon, ligament, or infection concerns.',
    ],
    signs: [
      'Posterior shoulder: axillary view best.',
      'Posterior fat pad = occult elbow fracture.',
      'SL gap >3 mm or broken Gilula arcs = carpal instability.',
      "Klein's line failure = SCFE.",
      'Segond = ACL/internal derangement.',
      'Lisfranc >2 mm diastasis; MCS >4 mm or TFCS >6 mm = ankle alarm.',
    ],
    patterns: [
      'Posterior shoulder dislocation vs fixed internal rotation.',
      'Perilunate/lunate dislocation vs wrist sprain.',
      'Femoral neck stress fracture vs groin strain.',
      'Lisfranc vs simple midfoot sprain.',
      'Syndesmotic injury vs lateral ankle sprain.',
    ],
    doNotMiss: [
      'Dislocation.',
      'Neurovascular deficit.',
      'Open fracture or compartment syndrome.',
      'SCFE.',
      'Femoral neck stress fracture.',
      'Perilunate/lunate dislocation.',
      'Lisfranc instability.',
      'Septic joint or bone infection.',
    ],
    pitfalls: [
      'Tiny clue with major implication: avulsion, widening, physis, or incomplete view.',
      'AP-only shoulder films.',
      'Non-weightbearing foot films.',
      'Normal early stress-fracture films.',
      'Overreliance on a single pediatric alignment line.',
    ],
    pearl:
      'If the history is high risk and the film is normal, you may be looking at an occult injury rather than a normal exam.',
    quickTips: [
      'Tiny avulsion fragments are not tiny diagnoses.',
      'A special view can matter more than another read of the same AP.',
      'Weightbearing matters in midfoot and some ankle/knee problems.',
      'Pediatric films require growth-center literacy.',
    ],
  },
};

export function getClinicCheatSheetSpec(module: ModuleContent): ClinicCheatSheetSpec {
  return specs[module.id] ?? fallbackSpec(module);
}

function fallbackSpec(module: ModuleContent): ClinicCheatSheetSpec {
  return {
    requiredViews:
      module.views.length > 0
        ? module.views.slice(0, 3).map((view) => `${view.name}: ${view.whenToOrder}`)
        : ['At least 2 orthogonal views for trauma.', 'Add region-specific views when instability or joint congruity is the question.'],
    addOnViews:
      module.views.length > 3
        ? module.views.slice(3, 6).map((view) => `${view.name}: ${view.why}`)
        : ['Weightbearing or special views when the clinical question requires them.'],
    viewAdequacyWarning:
      'If the series does not answer the clinical question, repeat or add the missing view before reassuring.',
    negativeXrayEscalation:
      module.whenToEscalate.length > 0
        ? module.whenToEscalate.slice(0, 3)
        : ['CT for occult cortical/intra-articular fracture questions.', 'MRI for stress, physeal, marrow, osteochondral, tendon, or ligament questions.'],
    signs:
      module.anatomy.length > 0
        ? module.anatomy.slice(0, 4).map((item) => `${item.label}: ${item.description}`)
        : module.systematicChecklist.slice(0, 4).map((item) => `${item.step}: ${item.prompts.slice(0, 3).join(', ')}`),
    patterns:
      module.pathology.length > 0
        ? module.pathology.slice(0, 5).map((item) => `${item.finding}: ${item.keyClue}`)
        : module.emphasis,
    doNotMiss:
      module.doNotMiss.length > 0
        ? module.doNotMiss.slice(0, 5).map((item) => `${item.title}: ${item.imagingNext}`)
        : module.whenToEscalate.slice(0, 5),
    pitfalls:
      module.pitfalls.length > 0
        ? module.pitfalls.slice(0, 4).map((item) => `${item.title}: ${item.body}`)
        : ['Inadequate series.', 'Stopping after the first abnormality.', 'Over-reassuring a normal x-ray when suspicion remains high.'],
    pearl:
      module.pearls[0]?.body ??
      'Adequacy and escalation are part of the x-ray read, not afterthoughts.',
    quickTips:
      module.keyTakeaways.length > 0
        ? module.keyTakeaways.slice(0, 4)
        : ['Confirm view adequacy first.', 'Use the same read sequence.', 'Escalate when x-ray and clinical story disagree.'],
  };
}
