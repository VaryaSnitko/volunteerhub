export interface Opportunity {
  id: string;
  title: string;
  image: string;
  type: string;
  location: string;
  description: string;
  organization: string;
  duration: string;
  commitment: string;
  fullDescription: string;
  requirements: string[];
  benefits: string[];
  contactEmail: string;
  contactPhone: string;
  organizationEmail: string; // new field
}

const localImages = ['/volunteering.jpg', '/hand.jpg', '/people.jpg'];

export const opportunities: Opportunity[] = [
  {
    id: '1',
    title: 'Beach Cleanup Volunteer',
    image: localImages[0],
    type: 'environment',
    location: 'in-person',
    description: 'Help keep our beaches clean and protect marine life by participating in our monthly beach cleanup events.',
    organization: 'Ocean Conservation Society',
    duration: '3-4 hours',
    commitment: 'Monthly',
    fullDescription: 'Join our dedicated team of volunteers in keeping our local beaches clean and safe for both visitors and marine life. This hands-on opportunity involves collecting litter, sorting recyclables, and educating beachgoers about ocean conservation. No experience required - we provide all necessary equipment and training.',
    requirements: [
      'Comfortable working outdoors',
      'Ability to walk on sand for extended periods',
      'Commitment to environmental protection'
    ],
    benefits: [
      'Make a direct impact on ocean health',
      'Meet like-minded environmentalists',
      'Learn about marine conservation',
      'Receive volunteer recognition'
    ],
    contactEmail: 'volunteer@oceanconservation.org',
    contactPhone: '(555) 123-4567',
    organizationEmail: '',
  },
  {
    id: '2',
    title: 'Online Math Tutor',
    image: localImages[1],
    type: 'education',
    location: 'online',
    description: 'Provide one-on-one math tutoring to students who need extra support with their studies.',
    organization: 'Education First Initiative',
    duration: '1-2 hours',
    commitment: 'Weekly',
    fullDescription: 'Help students build confidence and improve their math skills through personalized online tutoring sessions. You\'ll work with students from elementary to high school levels, providing homework help, test preparation, and concept reinforcement. Flexible scheduling available.',
    requirements: [
      'Strong math skills (algebra, geometry, calculus)',
      'Patience and good communication skills',
      'Reliable internet connection',
      'Background check required'
    ],
    benefits: [
      'Flexible remote work schedule',
      'Make a difference in students\' lives',
      'Gain teaching experience',
      'Professional development opportunities'
    ],
    contactEmail: 'tutoring@educationfirst.org',
    contactPhone: '(555) 234-5678',
    organizationEmail: '',
  },
  {
    id: '3',
    title: 'Senior Companion',
    image: localImages[2],
    type: 'elderly',
    location: 'in-person',
    description: 'Provide companionship and support to elderly residents in our community care facilities.',
    organization: 'Golden Years Care Center',
    duration: '2-3 hours',
    commitment: 'Weekly',
    fullDescription: 'Brighten the day of our senior residents by providing friendly companionship, engaging in activities, and offering emotional support. Activities may include reading, playing games, taking walks, or simply having meaningful conversations.',
    requirements: [
      'Compassionate and patient demeanor',
      'Good listening skills',
      'Reliability and punctuality',
      'Background check required'
    ],
    benefits: [
      'Build meaningful relationships',
      'Learn from life experiences',
      'Make a positive impact on seniors\' lives',
      'Gain healthcare experience'
    ],
    contactEmail: 'volunteer@goldenyears.org',
    contactPhone: '(555) 345-6789',
    organizationEmail: '',
  },
  {
    id: '4',
    title: 'Animal Shelter Helper',
    image: localImages[0],
    type: 'animals',
    location: 'in-person',
    description: 'Help care for animals at our local shelter by feeding, walking, and socializing with them.',
    organization: 'Paws & Hearts Animal Shelter',
    duration: '2-4 hours',
    commitment: 'Weekly',
    fullDescription: 'Join our team of animal lovers in providing care and attention to dogs, cats, and other animals awaiting adoption. Duties include feeding, cleaning kennels, walking dogs, socializing with animals, and helping with adoption events.',
    requirements: [
      'Love for animals',
      'Physical ability to walk dogs',
      'Comfortable with cleaning tasks',
      'Age 16+ (with parental consent if under 18)'
    ],
    benefits: [
      'Spend time with adorable animals',
      'Help animals find forever homes',
      'Learn about animal care',
      'Join a community of animal lovers'
    ],
    contactEmail: 'volunteer@pawsandhearts.org',
    contactPhone: '(555) 456-7890',
    organizationEmail: '',
  },
  {
    id: '5',
    title: 'Food Bank Distribution',
    image: localImages[1],
    type: 'food',
    location: 'in-person',
    description: 'Help distribute food to families in need at our local food bank and community centers.',
    organization: 'Community Food Bank',
    duration: '3-5 hours',
    commitment: 'Weekly',
    fullDescription: 'Support our mission to fight hunger in the community by helping with food distribution, sorting donations, and assisting clients. This role involves physical activity and direct interaction with community members.',
    requirements: [
      'Physical ability to lift boxes (up to 25 lbs)',
      'Friendly and non-judgmental attitude',
      'Reliability and punctuality',
      'Bilingual skills helpful but not required'
    ],
    benefits: [
      'Directly help families in need',
      'Learn about food security issues',
      'Build community connections',
      'Gain nonprofit experience'
    ],
    contactEmail: 'volunteer@communityfoodbank.org',
    contactPhone: '(555) 567-8901',
    organizationEmail: '',
  },
  {
    id: '6',
    title: 'Youth Mentor',
    image: localImages[2],
    type: 'youth',
    location: 'hybrid',
    description: 'Mentor at-risk youth through our after-school program, providing guidance and support.',
    organization: 'Youth Empowerment Network',
    duration: '2-3 hours',
    commitment: 'Weekly',
    fullDescription: 'Make a lasting impact on young lives by serving as a positive role model and mentor. Help youth develop life skills, academic confidence, and career aspirations through one-on-one mentoring and group activities.',
    requirements: [
      'Commitment to youth development',
      'Good communication and listening skills',
      'Reliability and consistency',
      'Background check and training required'
    ],
    benefits: [
      'Make a lasting impact on youth',
      'Develop leadership skills',
      'Gain mentoring experience',
      'Join a supportive community'
    ],
    contactEmail: 'mentor@youthempowerment.org',
    contactPhone: '(555) 678-9012',
    organizationEmail: '',
  },
  {
    id: '7',
    title: 'Hospital Volunteer',
    image: localImages[0],
    type: 'healthcare',
    location: 'in-person',
    description: 'Provide support to patients and staff at our local hospital through various volunteer roles.',
    organization: 'City General Hospital',
    duration: '4-6 hours',
    commitment: 'Weekly',
    fullDescription: 'Support our healthcare team by assisting with patient comfort, administrative tasks, and visitor services. Roles include patient escort, information desk assistance, and clerical support.',
    requirements: [
      'Compassionate and professional demeanor',
      'Ability to follow hospital protocols',
      'Reliability and punctuality',
      'Health screening and training required'
    ],
    benefits: [
      'Gain healthcare experience',
      'Help patients and families',
      'Learn about hospital operations',
      'Professional networking opportunities'
    ],
    contactEmail: 'volunteer@citygeneral.org',
    contactPhone: '(555) 789-0123',
    organizationEmail: '',
  },
  {
    id: '8',
    title: 'Community Garden Coordinator',
    image: localImages[1],
    type: 'community',
    location: 'in-person',
    description: 'Help maintain our community garden and teach others about sustainable gardening practices.',
    organization: 'Green Thumb Community',
    duration: '2-4 hours',
    commitment: 'Weekly',
    fullDescription: 'Lead gardening activities, maintain garden plots, and educate community members about sustainable agriculture. Help grow fresh produce for local food banks and community members.',
    requirements: [
      'Basic gardening knowledge',
      'Physical ability to garden',
      'Teaching or leadership experience helpful',
      'Commitment to sustainability'
    ],
    benefits: [
      'Connect with nature',
      'Teach sustainable practices',
      'Build community relationships',
      'Enjoy fresh produce'
    ],
    contactEmail: 'garden@greenthumb.org',
    contactPhone: '(555) 890-1234',
    organizationEmail: '',
  }
]; 