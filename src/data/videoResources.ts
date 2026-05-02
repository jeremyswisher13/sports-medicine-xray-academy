import type { VideoResource } from '../types';

// Curated AMSSM YouTube videos used as supplemental external resources.
// Original Jeremy Swisher / UCLA teaching content lives in modules.ts.
export const videoResources: VideoResource[] = [
  {
    id: 'amssm-msk-radiology-intro',
    moduleId: 'xray-foundations',
    title:
      'Series Introduction | MSK Radiology: X-Ray Educational Modules for Primary Care Residents',
    source: 'AMSSM YouTube',
    youtubeId: 'dlZEHbCNXWE',
    learnerLevel: 'Resident',
    summary:
      'Introduces a structured approach to musculoskeletal radiograph education for primary care learners.',
    clinicalWhy:
      'Useful starting point for residents learning how to approach MSK x-rays systematically.',
    reflectionPrompt:
      'What part of a systematic x-ray read do you most often forget when reviewing films quickly?',
  },
  {
    id: 'amssm-radiographic-terms',
    moduleId: 'xray-foundations',
    title:
      'Radiographic Terms | MSK Radiology: X-Ray Educational Modules for Primary Care Residents',
    source: 'AMSSM YouTube',
    youtubeId: 'Bo1ro6B6KN8',
    learnerLevel: 'Resident',
    summary:
      'Supplemental review of common radiographic terms used in MSK x-ray interpretation.',
    clinicalWhy:
      'Helps residents and fellows use consistent language when describing x-ray findings.',
    reflectionPrompt:
      'Which radiographic term do you most want to become more precise with in clinic?',
  },
  {
    id: 'amssm-high-yield-shoulder-clavicle-elbow',
    moduleId: 'shoulder',
    title: 'High-Yield X-Ray Series: Shoulder, Clavicle and Elbow',
    source: 'AMSSM YouTube',
    youtubeId: 'SCJkbHht-wg',
    learnerLevel: 'Fellow',
    summary:
      'Supplemental fellow-level review of high-yield shoulder, clavicle, and elbow radiograph findings.',
    clinicalWhy:
      'Helpful for recognizing common and subtle upper-extremity x-ray findings relevant to sports medicine clinic.',
    reflectionPrompt:
      'What shoulder or clavicle x-ray finding from this video would change your next management step?',
  },
  {
    id: 'amssm-shoulder-radiology',
    moduleId: 'shoulder',
    title:
      'Shoulder | MSK Radiology: X-Ray Educational Modules for Primary Care Residents',
    source: 'AMSSM YouTube',
    youtubeId: 'tIz43v5vvf8',
    learnerLevel: 'Resident',
    summary:
      'Supplemental review of shoulder x-ray interpretation for primary care sports medicine learners.',
    clinicalWhy:
      'Useful for building a systematic approach to shoulder x-rays before advancing to instability and subtle injury patterns.',
    reflectionPrompt:
      'What shoulder view or alignment check do you want to be more consistent about ordering?',
  },
  {
    id: 'amssm-elbow-radiology',
    moduleId: 'elbow',
    title:
      'Elbow | High-Yield X-Ray Series: Shoulder, Clavicle and Elbow',
    source: 'AMSSM YouTube',
    youtubeId: 'SCJkbHht-wg',
    learnerLevel: 'Fellow',
    summary:
      'Supplemental fellow-level review of elbow x-ray patterns including fat pad signs and radial head fractures.',
    clinicalWhy:
      'Helpful for primary care sports medicine clinicians evaluating acute elbow trauma and pediatric elbow injuries.',
    reflectionPrompt:
      'Which elbow line (anterior humeral, radiocapitellar) do you most want to be more reliable about checking?',
  },
  {
    id: 'amssm-hand-radiology',
    moduleId: 'wrist-hand',
    title: 'Hand | MSK Radiology: X-Ray Educational Modules for Primary Care Residents',
    source: 'AMSSM YouTube',
    youtubeId: '2eAhGU8TrNw',
    learnerLevel: 'Resident',
    summary:
      'Supplemental hand x-ray module emphasizing a systematic review of hand radiographs.',
    clinicalWhy:
      'Helpful for common sports medicine hand injuries including phalanx, metacarpal, and avulsion patterns.',
    reflectionPrompt:
      'What hand injury pattern do you find easiest to miss on initial review?',
  },
  {
    id: 'amssm-high-yield-hip-knee',
    moduleId: 'knee',
    title: 'High-Yield X-Ray Series: Hip and Knee',
    source: 'AMSSM YouTube',
    youtubeId: 'G3hvxA45mTo',
    learnerLevel: 'Fellow',
    summary:
      'Supplemental fellow-level review of high-yield hip and knee radiograph interpretation.',
    clinicalWhy:
      'Useful for sports medicine learners reviewing hip and knee x-ray findings that influence advanced imaging and referral decisions.',
    reflectionPrompt:
      'What hip or knee x-ray finding would prompt you to order advanced imaging despite an otherwise reassuring exam?',
  },
  {
    id: 'amssm-hip-radiology',
    moduleId: 'pelvis-hip',
    title: 'The Hip | MSK Radiology: X-Ray Educational Modules for Primary Care Residents',
    source: 'AMSSM YouTube',
    youtubeId: 'F-VGeHI2U3w',
    learnerLevel: 'Resident',
    summary: 'Supplemental resident-level review of hip radiograph interpretation.',
    clinicalWhy:
      'Helpful for recognizing common hip x-ray findings and deciding when MRI is needed despite normal radiographs.',
    reflectionPrompt:
      'What hip x-ray red flag would make you stop activity and escalate imaging urgently?',
  },
  {
    id: 'amssm-knee-radiology',
    moduleId: 'knee',
    title: 'Knee | MSK Radiology: X-Ray Educational Modules for Primary Care Residents',
    source: 'AMSSM YouTube',
    youtubeId: 'di63ofJq7XU',
    learnerLevel: 'Resident',
    summary: 'Supplemental resident-level review of knee radiograph interpretation.',
    clinicalWhy:
      'Useful for building a systematic approach to knee x-rays and common sports medicine knee presentations.',
    reflectionPrompt:
      'What knee x-ray clue would make you think about internal derangement or occult fracture?',
  },
  {
    id: 'amssm-high-yield-foot-ankle',
    moduleId: 'ankle-foot',
    title: 'High-Yield X-Ray Series: Foot and Ankle',
    source: 'AMSSM YouTube',
    youtubeId: 'k6TbZMuv4Kw',
    learnerLevel: 'Fellow',
    summary:
      'Supplemental fellow-level review of high-yield foot and ankle radiograph interpretation.',
    clinicalWhy:
      'Useful for not-miss injuries such as Lisfranc injury, talar dome lesions, Jones fracture, and syndesmotic injury.',
    reflectionPrompt:
      'What foot or ankle x-ray finding would change your weightbearing or imaging plan?',
  },
  {
    id: 'amssm-ankle-radiology',
    moduleId: 'ankle-foot',
    title: 'Ankle | MSK Radiology: X-Ray Educational Modules for Primary Care Residents',
    source: 'AMSSM YouTube',
    youtubeId: 'Oz_uw0QR_eo',
    learnerLevel: 'Resident',
    summary: 'Supplemental resident-level review of ankle radiograph interpretation.',
    clinicalWhy:
      'Helpful for recognizing fracture patterns, alignment abnormalities, and ankle mortise concerns.',
    reflectionPrompt:
      'What ankle mortise finding would make you worry about instability?',
  },
  {
    id: 'amssm-growth-plate-injuries',
    moduleId: 'pediatric-adolescent',
    title: 'Growth Plate Injuries | Fellow Online Lecture Series',
    source: 'AMSSM YouTube',
    youtubeId: 'woiAUVXQmaw',
    learnerLevel: 'Fellow',
    summary: 'Supplemental fellow-level lecture on growth plate injuries in young athletes.',
    clinicalWhy:
      'Helpful for pediatric and adolescent sports medicine x-ray interpretation and management decisions.',
    reflectionPrompt:
      'What pediatric x-ray finding would change your threshold for immobilization or referral?',
  },
  {
    id: 'amssm-ocd-lesions',
    moduleId: 'pediatric-adolescent',
    title:
      'OCD Lesions | MSK Radiology: X-Ray Educational Modules for Primary Care Residents',
    source: 'AMSSM YouTube',
    youtubeId: 'PMAfHlew-j4',
    learnerLevel: 'Resident',
    summary:
      'Supplemental review of common radiographic appearances of osteochondritis dissecans lesions.',
    clinicalWhy:
      'Useful for recognizing OCD lesions in adolescent athletes and knowing when MRI is needed.',
    reflectionPrompt:
      'What OCD location or x-ray appearance would make you escalate to MRI?',
  },
  {
    id: 'amssm-bone-stress-injuries',
    moduleId: 'do-not-miss',
    title: 'Bone Stress Injuries | Fellow Online Lecture Series',
    source: 'AMSSM YouTube',
    youtubeId: '5RBzXV2RS8Y',
    learnerLevel: 'Fellow',
    summary: 'Supplemental fellow-level lecture on bone stress injuries in athletes.',
    clinicalWhy:
      'Useful for understanding why early stress injuries can be radiographically occult and require advanced imaging when suspicion remains high.',
    reflectionPrompt:
      'What clinical scenario would make you order MRI even with normal x-rays?',
  },
];

export function getVideosForModule(moduleId: string): VideoResource[] {
  return videoResources.filter((v) => v.moduleId === moduleId);
}
