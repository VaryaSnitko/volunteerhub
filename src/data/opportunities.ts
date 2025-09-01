export interface Opportunity {
  id: string;
  title: string;
  image: string;
  type: string;
  location: string;
  address: string;
  description: string;
  organization: string;
  duration: string;
  commitment: string;
  fullDescription: string;
  requirements: string[];
  benefits: string[];
  contactEmail: string;
  contactPhone: string;
  organizationEmail: string;
  date: string;
  time: string;
  capacity: number;
  currentSignups: number;
}

const localImages = ['/volunteering.jpg', '/hand.jpg', '/people.jpg'];

export const opportunities: Opportunity[] = [
  {
    id: '1',
    title: 'Beach Cleanup Volunteer',
    image: localImages[0],
    type: 'environment',
    location: 'in-person',
    address: 'Dubai, Jumeirah Beach',
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
    date: '2024-02-15',
    time: '09:00 AM - 12:00 PM',
    capacity: 25,
    currentSignups: 12
  },
  {
    id: '2',
    title: 'Senior Center Reading Program',
    image: localImages[1],
    type: 'elderly',
    location: 'in-person',
    address: 'Dubai, DIFC',
    description: 'Share the joy of reading with seniors at our local community center. Help improve their cognitive health and provide companionship.',
    organization: 'Community Care Center',
    duration: '1-2 hours',
    commitment: 'Weekly',
    fullDescription: 'Our reading program helps seniors maintain cognitive function and provides much-needed social interaction. Volunteers read aloud from books, newspapers, or magazines, and engage in meaningful conversations with participants. This is a wonderful opportunity to make a difference in the lives of our elderly community members.',
    requirements: [
      'Patience and empathy',
      'Clear speaking voice',
      'Reliability and punctuality',
      'Background check required'
    ],
    benefits: [
      'Build meaningful relationships',
      'Learn from life experiences',
      'Improve communication skills',
      'Make a positive impact on mental health'
    ],
    contactEmail: 'volunteer@communitycare.org',
    contactPhone: '(555) 234-5678',
    organizationEmail: '',
    date: '2024-02-20',
    time: '02:00 PM - 04:00 PM',
    capacity: 8,
    currentSignups: 5
  },
  {
    id: '3',
    title: 'Online Tutoring for Students',
    image: localImages[2],
    type: 'education',
    location: 'online',
    address: 'Virtual - Zoom',
    description: 'Provide academic support to students in need through our virtual tutoring program. Help them succeed in their educational journey.',
    organization: 'Digital Learning Initiative',
    duration: '1-1.5 hours',
    commitment: 'Flexible',
    fullDescription: 'Join our online tutoring program to help students who need academic support. Subjects include math, science, English, and history. Volunteers work one-on-one with students through video conferencing platforms, providing personalized instruction and encouragement. This is a great way to share your knowledge and help students reach their potential.',
    requirements: [
      'Strong academic background',
      'Reliable internet connection',
      'Patience and teaching ability',
      'Background check required'
    ],
    benefits: [
      'Flexible scheduling',
      'Develop teaching skills',
      'Make a difference in education',
      'Work from anywhere'
    ],
    contactEmail: 'tutors@digitallearning.org',
    contactPhone: '(555) 345-6789',
    organizationEmail: '',
    date: '2024-02-18',
    time: '06:00 PM - 08:00 PM',
    capacity: 15,
    currentSignups: 8
  },
  {
    id: '4',
    title: 'Animal Shelter Care Assistant',
    image: localImages[0],
    type: 'animals',
    location: 'in-person',
    address: 'Dubai, Al Barsha',
    description: 'Help care for animals at our local shelter. Assist with feeding, cleaning, and providing love and attention to animals in need.',
    organization: 'Happy Paws Animal Shelter',
    duration: '2-3 hours',
    commitment: 'Weekly',
    fullDescription: 'Our animal shelter relies on dedicated volunteers to help care for dogs, cats, and other animals waiting for their forever homes. Volunteers assist with feeding, cleaning kennels, walking dogs, socializing animals, and helping with adoption events. This is a rewarding opportunity for animal lovers to make a direct impact on animal welfare.',
    requirements: [
      'Love for animals',
      'Physical ability to handle animals',
      'Reliability and punctuality',
      'Willingness to get dirty'
    ],
    benefits: [
      'Work with animals',
      'Learn animal care skills',
      'Help animals find homes',
      'Join a caring community'
    ],
    contactEmail: 'volunteer@happypaws.org',
    contactPhone: '(555) 456-7890',
    organizationEmail: '',
    date: '2024-02-22',
    time: '10:00 AM - 01:00 PM',
    capacity: 12,
    currentSignups: 7
  },
  {
    id: '5',
    title: 'Community Garden Maintenance',
    image: localImages[1],
    type: 'community',
    location: 'in-person',
    address: 'Dubai, Al Qusais',
    description: 'Help maintain our community garden and teach others about sustainable gardening practices.',
    organization: 'Green Thumb Community',
    duration: '2-4 hours',
    commitment: 'Bi-weekly',
    fullDescription: 'Our community garden provides fresh produce for local families and serves as an educational space for sustainable gardening. Volunteers help with planting, weeding, harvesting, and maintaining garden infrastructure. We also host workshops and educational events for community members of all ages.',
    requirements: [
      'Interest in gardening',
      'Ability to work outdoors',
      'Willingness to learn',
      'Physical stamina'
    ],
    benefits: [
      'Learn gardening skills',
      'Connect with community',
      'Enjoy fresh air and exercise',
      'Contribute to food security'
    ],
    contactEmail: 'garden@greenthumb.org',
    contactPhone: '(555) 567-8901',
    organizationEmail: '',
    date: '2024-02-25',
    time: '08:00 AM - 11:00 AM',
    capacity: 20,
    currentSignups: 14
  },
  {
    id: '6',
    title: 'Youth Mentoring Program',
    image: localImages[2],
    type: 'youth',
    location: 'hybrid',
    address: 'Dubai, Downtown',
    description: 'Mentor young people and help them develop life skills, confidence, and positive relationships.',
    organization: 'Future Leaders Foundation',
    duration: '1-2 hours',
    commitment: 'Weekly',
    fullDescription: 'Our mentoring program pairs adult volunteers with young people who could benefit from guidance and support. Mentors help mentees develop life skills, build confidence, set goals, and make positive choices. This program includes both in-person meetings and virtual check-ins, providing flexibility for both mentors and mentees.',
    requirements: [
      'Commitment to youth development',
      'Good communication skills',
      'Reliability and consistency',
      'Background check required'
    ],
    benefits: [
      'Make a lasting impact',
      'Develop leadership skills',
      'Learn from young perspectives',
      'Join a supportive community'
    ],
    contactEmail: 'mentor@futureleaders.org',
    contactPhone: '(555) 678-9012',
    organizationEmail: '',
    date: '2024-02-28',
    time: '04:00 PM - 06:00 PM',
    capacity: 10,
    currentSignups: 6
  }
]; 