// Mock data for the demo version
export const mockUser = {
  id: 1,
  username: 'demo_user',
  email: 'demo@example.com',
  roles: ['ROLE_USER', 'ROLE_ADMIN']
};

export const mockTags = [
  { id: 1, name: 'Technology', description: 'Tech-related articles', color: '#3498db', createdAt: '2023-01-15T10:00:00Z' },
  { id: 2, name: 'Business', description: 'Business insights', color: '#e74c3c', createdAt: '2023-01-16T10:00:00Z' },
  { id: 3, name: 'Science', description: 'Scientific discoveries', color: '#2ecc71', createdAt: '2023-01-17T10:00:00Z' },
  { id: 4, name: 'Health', description: 'Health and wellness', color: '#f39c12', createdAt: '2023-01-18T10:00:00Z' },
  { id: 5, name: 'Travel', description: 'Travel guides and tips', color: '#9b59b6', createdAt: '2023-01-19T10:00:00Z' },
  { id: 6, name: 'Food', description: 'Recipes and food culture', color: '#e67e22', createdAt: '2023-01-20T10:00:00Z' },
  { id: 7, name: 'Education', description: 'Learning and education', color: '#1abc9c', createdAt: '2023-01-21T10:00:00Z' },
  { id: 8, name: 'Sports', description: 'Sports news and analysis', color: '#34495e', createdAt: '2023-01-22T10:00:00Z' }
];

export const mockArticles = [
  {
    id: 1,
    title: 'The Future of Artificial Intelligence',
    summary: 'Exploring the latest trends and developments in AI technology and its impact on society.',
    content: `Artificial Intelligence has rapidly evolved from a concept in science fiction to a transformative force reshaping industries worldwide. This comprehensive overview examines the current state of AI technology and its promising future applications.

In recent years, we've witnessed remarkable breakthroughs in machine learning, natural language processing, and computer vision. These advances have enabled AI systems to perform tasks that were once thought to be exclusively human capabilities.

The healthcare industry has been particularly receptive to AI innovations. Machine learning algorithms now assist doctors in diagnosing diseases, predicting patient outcomes, and personalizing treatment plans. Medical imaging has been revolutionized by AI systems that can detect anomalies with unprecedented accuracy.

The automotive sector is experiencing a paradigm shift with the development of autonomous vehicles. Self-driving cars leverage sophisticated AI algorithms to navigate complex traffic scenarios and make split-second decisions that prioritize safety.

Financial services have embraced AI for fraud detection, algorithmic trading, and customer service automation. These applications have improved efficiency while reducing operational costs significantly.

However, the rapid advancement of AI also raises important ethical considerations. Questions about job displacement, privacy, and algorithmic bias require careful consideration as we move forward.

The future of AI holds immense promise, but it also demands responsible development and implementation to ensure that these powerful technologies benefit humanity as a whole.`,
    status: 'PUBLISHED',
    tags: [mockTags[0], mockTags[2]],
    viewCount: 1247,
    createdAt: '2023-11-15T09:30:00Z',
    updatedAt: '2023-11-16T14:20:00Z',
    publishedAt: '2023-11-16T14:20:00Z'
  },
  {
    id: 2,
    title: 'Building Sustainable Business Practices',
    summary: 'A guide to implementing eco-friendly strategies that benefit both the environment and your bottom line.',
    content: `Sustainability is no longer just a buzzword; it's a business imperative. Companies across industries are discovering that sustainable practices not only help protect the environment but also drive profitability and enhance brand reputation.

The concept of the triple bottom line—people, planet, and profit—has gained significant traction among forward-thinking organizations. This approach recognizes that long-term business success depends on balancing financial performance with social and environmental responsibility.

Energy efficiency represents one of the most accessible entry points for businesses embarking on their sustainability journey. Simple measures such as LED lighting upgrades, smart HVAC systems, and energy-efficient equipment can yield immediate cost savings while reducing carbon footprint.

Supply chain optimization offers another avenue for sustainable improvement. By working with suppliers who share similar environmental values, companies can reduce transportation emissions, minimize waste, and ensure ethical sourcing practices.

Waste reduction programs have proven particularly effective in manufacturing environments. Implementing circular economy principles, where waste from one process becomes input for another, can significantly reduce disposal costs and environmental impact.

Employee engagement plays a crucial role in sustainability initiatives. When staff members understand and support environmental goals, they become advocates for change and contribute innovative ideas for improvement.

The financial benefits of sustainability extend beyond cost reduction. Many consumers actively seek out environmentally responsible brands, creating opportunities for premium pricing and increased market share.

Investors are increasingly considering environmental, social, and governance (ESG) factors in their decision-making processes. Companies with strong sustainability credentials often enjoy better access to capital and lower borrowing costs.`,
    status: 'PUBLISHED',
    tags: [mockTags[1], mockTags[2]],
    viewCount: 892,
    createdAt: '2023-11-10T11:15:00Z',
    updatedAt: '2023-11-11T16:45:00Z',
    publishedAt: '2023-11-11T16:45:00Z'
  },
  {
    id: 3,
    title: 'Mediterranean Diet: A Path to Better Health',
    summary: 'Discover the science-backed benefits of the Mediterranean diet and practical tips for adoption.',
    content: `The Mediterranean diet has gained widespread recognition from nutritionists and health professionals worldwide for its remarkable health benefits and sustainable approach to eating.

This dietary pattern, inspired by the traditional eating habits of countries bordering the Mediterranean Sea, emphasizes whole foods, healthy fats, and minimal processing. Research has consistently shown its effectiveness in promoting cardiovascular health, cognitive function, and longevity.

Olive oil serves as the cornerstone of the Mediterranean diet, providing monounsaturated fats that help reduce inflammation and support heart health. Extra virgin olive oil, with its rich antioxidant profile, offers additional protective benefits.

Fresh fruits and vegetables feature prominently in Mediterranean cuisine, providing essential vitamins, minerals, and phytonutrients. The emphasis on seasonal, locally-sourced produce ensures maximum nutritional value and flavor.

Whole grains, legumes, nuts, and seeds contribute fiber, protein, and complex carbohydrates that help maintain stable blood sugar levels and promote digestive health.

Fish and seafood, consumed regularly but in moderate portions, supply omega-3 fatty acids crucial for brain function and cardiovascular health. The diet recommends limiting red meat consumption while including poultry and eggs in moderation.

The Mediterranean lifestyle extends beyond food choices to include regular physical activity, adequate sleep, and strong social connections—all factors that contribute to overall well-being.

Adopting a Mediterranean diet doesn't require drastic changes. Start by incorporating more olive oil, increasing vegetable consumption, choosing whole grains over refined options, and enjoying meals with family and friends.`,
    status: 'DRAFT',
    tags: [mockTags[3], mockTags[5]],
    viewCount: 234,
    createdAt: '2023-11-20T08:20:00Z',
    updatedAt: '2023-11-20T08:20:00Z',
    publishedAt: null
  },
  {
    id: 4,
    title: 'Remote Work Revolution: Lessons from 2023',
    summary: 'Analyzing the evolution of remote work culture and its long-term implications for businesses.',
    content: `The remote work revolution has fundamentally transformed the modern workplace, accelerating trends that might have taken decades to unfold. As we reflect on the developments of 2023, several key patterns emerge that will shape the future of work.

Hybrid work models have emerged as the preferred solution for many organizations, combining the flexibility of remote work with the collaboration benefits of in-person interaction. This approach allows companies to tap into global talent pools while maintaining team cohesion.

Technology infrastructure has become the backbone of successful remote work implementation. Cloud computing, collaboration platforms, and cybersecurity measures have evolved rapidly to support distributed teams effectively.

Employee well-being has gained prominence as organizations recognize the importance of work-life balance in maintaining productivity and retention. Mental health support, flexible schedules, and wellness programs have become standard offerings.

Communication strategies have adapted to accommodate different time zones and working styles. Asynchronous communication has gained acceptance, allowing team members to contribute meaningfully regardless of their location or schedule.

Performance measurement has shifted from time-based metrics to outcome-focused evaluations. This change has encouraged employees to focus on results rather than hours worked, often leading to increased productivity and job satisfaction.

The real estate landscape has been significantly impacted, with many companies reducing their physical footprint or reimagining office spaces as collaboration hubs rather than daily workstations.

Challenges remain in areas such as company culture maintenance, career development, and knowledge transfer. Organizations are experimenting with virtual team-building activities, digital mentorship programs, and innovative onboarding processes.

The future of work will likely feature even greater flexibility, with employees having more control over when, where, and how they contribute to their organizations' success.`,
    status: 'PUBLISHED',
    tags: [mockTags[1], mockTags[0]],
    viewCount: 1456,
    createdAt: '2023-11-08T13:45:00Z',
    updatedAt: '2023-11-09T10:30:00Z',
    publishedAt: '2023-11-09T10:30:00Z'
  },
  {
    id: 5,
    title: 'Exploring Hidden Gems of Southeast Asia',
    summary: 'Off-the-beaten-path destinations that offer authentic cultural experiences and natural beauty.',
    content: `Southeast Asia continues to captivate travelers with its diverse landscapes, rich cultures, and welcoming communities. While popular destinations like Bangkok and Bali attract millions of visitors, the region harbors countless hidden gems waiting to be discovered.

Luang Prabang, Laos, represents one such treasure. This UNESCO World Heritage site seamlessly blends French colonial architecture with traditional Lao culture. The morning alms ceremony, where saffron-robed monks collect offerings from locals, provides an authentic glimpse into Buddhist traditions.

The Mentawai Islands of Indonesia offer pristine surfing conditions and unique cultural encounters with indigenous communities. These remote islands provide opportunities for sustainable tourism that benefits local populations while preserving traditional ways of life.

In Vietnam, the Ha Giang Loop takes adventurous travelers through spectacular mountain scenery inhabited by ethnic minorities. Motorbike journeys through terraced rice fields and traditional villages create unforgettable memories.

Myanmar's Hpa-An region showcases dramatic karst landscapes dotted with ancient caves and pagodas. Hot air balloon rides over the countryside reveal a timeless landscape largely unchanged by modern development.

The Perhentian Islands of Malaysia combine crystal-clear waters with vibrant coral reefs, offering world-class snorkeling and diving experiences without the crowds of more famous destinations.

Responsible travel practices become especially important when visiting these sensitive destinations. Choosing local guides, staying in community-owned accommodations, and respecting cultural norms help ensure that tourism benefits local communities.

Preparation for off-the-beaten-path travel requires additional planning, including health precautions, flexible itineraries, and cultural sensitivity training. However, the rewards of authentic experiences and meaningful connections make the extra effort worthwhile.`,
    status: 'PUBLISHED',
    tags: [mockTags[4]],
    viewCount: 567,
    createdAt: '2023-11-05T16:20:00Z',
    updatedAt: '2023-11-06T09:15:00Z',
    publishedAt: '2023-11-06T09:15:00Z'
  },
  {
    id: 6,
    title: 'The Rise of Quantum Computing',
    summary: 'Understanding quantum computing principles and their potential to revolutionize various industries.',
    content: `Quantum computing represents one of the most significant technological advances of our time, promising to solve problems that are currently intractable for classical computers.

Unlike traditional computers that use bits representing either 0 or 1, quantum computers utilize quantum bits (qubits) that can exist in multiple states simultaneously through a phenomenon called superposition.

This unique property, combined with quantum entanglement and interference, enables quantum computers to perform certain calculations exponentially faster than their classical counterparts.

The potential applications span numerous fields, from cryptography and drug discovery to financial modeling and artificial intelligence optimization.

Major technology companies and research institutions worldwide are investing billions of dollars in quantum computing research and development.

Current quantum computers remain experimental and limited by factors such as decoherence and error rates, but significant progress is being made in addressing these challenges.

The implications for cybersecurity are particularly noteworthy, as quantum computers could potentially break current encryption methods while also enabling new forms of quantum cryptography.`,
    status: 'DRAFT',
    tags: [mockTags[0], mockTags[2]],
    viewCount: 123,
    createdAt: '2023-11-22T10:30:00Z',
    updatedAt: '2023-11-22T10:30:00Z',
    publishedAt: null
  }
];

export const mockSchedules = [
  {
    id: 1,
    articleId: 3,
    article: mockArticles[2],
    scheduledDate: '2023-11-25T10:00:00Z',
    status: 'PENDING',
    createdAt: '2023-11-20T08:30:00Z'
  },
  {
    id: 2,
    articleId: 6,
    article: mockArticles[5],
    scheduledDate: '2023-11-28T14:00:00Z',
    status: 'PENDING',
    createdAt: '2023-11-22T11:00:00Z'
  },
  {
    id: 3,
    articleId: 1,
    article: mockArticles[0],
    scheduledDate: '2023-11-16T14:20:00Z',
    status: 'COMPLETED',
    createdAt: '2023-11-15T09:45:00Z'
  },
  {
    id: 4,
    articleId: 2,
    article: mockArticles[1],
    scheduledDate: '2023-11-11T16:45:00Z',
    status: 'COMPLETED',
    createdAt: '2023-11-10T11:30:00Z'
  }
];

export const mockStats = {
  totalArticles: mockArticles.length,
  publishedArticles: mockArticles.filter(a => a.status === 'PUBLISHED').length,
  draftArticles: mockArticles.filter(a => a.status === 'DRAFT').length,
  totalTags: mockTags.length,
  pendingSchedules: mockSchedules.filter(s => s.status === 'PENDING').length
};

export const getMostViewedArticles = () => {
  return [...mockArticles]
    .filter(article => article.status === 'PUBLISHED')
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 5);
};

export const getRecentArticles = () => {
  return [...mockArticles]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);
};

export const getPopularTags = () => {
  const tagUsage = {};
  mockArticles.forEach(article => {
    article.tags.forEach(tag => {
      tagUsage[tag.id] = (tagUsage[tag.id] || 0) + 1;
    });
  });

  return mockTags
    .map(tag => ({
      ...tag,
      articleCount: tagUsage[tag.id] || 0
    }))
    .sort((a, b) => b.articleCount - a.articleCount)
    .slice(0, 5);
}; 