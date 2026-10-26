export const servicePages = [
  {
    path: '/outsourced-managed-it',
    title: 'Managed IT Services',
    eyebrow: 'Your IT department. Your growth partner.',
    headline: 'Managed IT, built around your business.',
    summary: 'Keep your people productive and your technology moving forward. Get everyday support, proactive care and IT leadership in one working relationship.',
    icon: 'monitor',
    benefits: [
      'Weekday help desk, 8am–5pm',
      'Full or Remote Managed IT plans',
      '24/7 emergency support according to your service plan',
    ],
    cards: [
      {
        id: 'support',
        title: 'Support that keeps work moving',
        text: 'Help with computers, mobile devices, email, access and business applications, with clear next steps when an issue needs more attention.',
        icon: 'chat',
      },
      {
        id: 'devices',
        title: 'Computers, servers and networks',
        text: 'Care for Windows, macOS, servers and network equipment. Mobile device management can be scoped to your business and security needs.',
        icon: 'network',
      },
      {
        id: 'cloud',
        title: 'Cloud tools that work together',
        text: 'Support for Microsoft 365, Google Workspace, AI tools and business cloud services—from email and collaboration to secure access and practical everyday workflows.',
        icon: 'cloud',
      },
      {
        id: 'security',
        title: 'Security and recovery',
        text: 'Cybersecurity, backup oversight and recovery planning, with assistance supporting HIPAA or PCI compliance efforts where relevant.',
        icon: 'shield',
      },
      {
        id: 'vendors',
        title: 'One partner across your technology',
        text: 'Coordinate internet, phone, software and business-system vendors. Get technical issues moving without becoming the go-between.',
        icon: 'people',
      },
      {
        id: 'leadership',
        title: 'IT leadership for your next step',
        text: 'An IT director or virtual CIO perspective: roadmaps, budgets, equipment planning and employee onboarding that support your business goals.',
        icon: 'layers',
      },
    ],
    faq: [
      {
        question: 'Which managed IT plan is right for us?',
        answer: 'Both plans include Proactive IT: monitoring, maintenance, tested updates, security checks and backup oversight. Full Managed IT adds our onsite support. Remote Managed IT pairs our remote support with your local technician for hands-on work. We define covered systems, responsibilities and pricing together.',
      },
      {
        question: 'When can we get help?',
        answer: 'Help desk support is available weekdays, 8am–5pm. After-hours, weekend and holiday emergency support is available 24/7 according to your service plan and its escalation process.',
      },
      {
        question: 'Can you act as our IT department or work with our existing team?',
        answer: 'Yes. We can take an IT department role or complement your internal team. Together, we define support, maintenance, security and planning responsibilities around your business.',
      },
    ],
    plans: [
      {
        title: 'Full Managed IT',
        text: 'Your complete IT solution with onsite and remote support: help desk, computers and servers, cybersecurity, backups and cloud services. Proactive IT keeps systems monitored, maintained and updated, while planning and vendor coordination connect everyday care with your business goals.',
        icon: 'people',
      },
      {
        title: 'Remote Managed IT',
        text: 'Your remote IT department: help desk, computers and servers, cybersecurity, backups, cloud services, planning and vendor coordination, with Proactive IT included. We provide ongoing remote care and coordinate with your local technician for physical access, equipment connections and other hands-on work.',
        icon: 'monitor',
      },
    ],
  },
  {
    path: '/proactive-it',
    title: 'Proactive IT Services',
    eyebrow: 'Included with Full and Remote Managed IT',
    headline: 'Proactive care. Stronger protection.',
    summary: 'Your technology gets attention before someone has to ask. We monitor, maintain and update your systems, strengthen their defenses and check your backups so your business is better prepared for what comes next.',
    icon: 'settings',
    benefits: [
      'Updates tested in-house before rollout',
      'Ongoing system and backup monitoring',
      'Security-minded care for your infrastructure',
    ],
    cards: [
      {
        title: 'Server and device care',
        text: 'Keep computers, servers and network equipment healthy with regular maintenance, storage and performance checks, and attention to the warning signs that can interrupt work.',
        icon: 'server',
      },
      {
        title: 'Quarterly IT checkups',
        text: 'Look beyond individual alerts. We review system health, capacity and recurring issues, then explain what is working well and which improvements will help your business next.',
        icon: 'clock',
      },
      {
        title: 'Updates tested before rollout',
        text: 'We test updates in-house before deploying them to customers. Planned rollouts and follow-up checks help keep operating systems and applications current, secure and ready for work.',
        icon: 'settings',
      },
      {
        title: 'Monitoring and follow-through',
        text: 'Watch for device, server and backup issues, investigate alerts and follow through on repairs. You have an IT partner paying attention between support calls.',
        icon: 'monitor',
      },
      {
        title: 'Security built into everyday care',
        text: 'Endpoint protection, patching and security checks strengthen your defenses. Kyle E. Hearn holds the Fortinet NSE 1 Certified in Cybersecurity credential and brings that security perspective to our ongoing care.',
        icon: 'shield',
      },
      {
        title: 'Backups with recovery in mind',
        text: 'Check backup results, investigate failures and test selected restores. We help protect the work your business depends on and keep recovery priorities connected to your needs.',
        icon: 'cloud',
      },
    ],
    faq: [
      {
        question: 'Is Proactive IT included in our managed support?',
        answer: 'Yes. Both Full Managed IT and Remote Managed IT include proactive monitoring, maintenance, updates, security checks and backup oversight. We establish the systems and backup coverage when we build your service plan.',
      },
      {
        question: 'How do you help updates go smoothly?',
        answer: 'We test updates in-house first, plan customer rollouts around the systems involved and check the results. When an update needs more testing or a coordinated maintenance window, we work through that before moving ahead.',
      },
      {
        question: 'What happens when monitoring or a checkup finds a problem?',
        answer: 'We investigate, address issues within your managed service and keep you informed about anything that affects your work. If a larger change or replacement is needed, we explain why and help you plan the next step.',
      },
    ],
  },
  {
    path: '/it-collaboration',
    title: 'Co-managed IT',
    eyebrow: 'Remote IT care. Connected onsite support.',
    headline: 'Your remote managed IT team.',
    summary: 'We handle the help desk and ongoing remote care of your computers, servers and business systems. Your internal staff or local technician handles onsite troubleshooting and hands-on work. Together, we keep your business moving.',
    icon: 'people',
    benefits: [
      'Remote Managed IT with Proactive IT included',
      'Help desk, maintenance, security and backups',
      'Connected with your onsite technician',
    ],
    cards: [
      {
        title: 'Your remote help desk',
        text: 'Your people call us for help with computers, mobile devices, email, access and applications. We handle remote troubleshooting and coordinate hands-on support when it is needed.',
        icon: 'chat',
      },
      {
        title: 'Computers and servers, maintained',
        text: 'Monitoring, maintenance and updates are part of the relationship. We test updates in-house, manage remote deployment and keep an eye on system health and performance.',
        icon: 'settings',
      },
      {
        title: 'Security and backup oversight',
        text: 'We manage endpoint protection, patching and backup monitoring, investigate warnings and help maintain recovery readiness. Your local technician helps with any work that needs physical access.',
        icon: 'shield',
      },
      {
        title: 'IT direction comes with the relationship',
        text: 'Get IT director and virtual CIO guidance for budgets, vendors, projects and growth. Planning and day-to-day support stay connected as your business changes.',
        icon: 'arrow',
      },
      {
        title: 'One connected workflow',
        text: 'We prepare accounts, support cloud services and coordinate onboarding and system changes. Your onsite contact handles physical setup, cabling and other tasks that need local hands.',
        icon: 'network',
      },
      {
        title: 'Clear handoffs and shared visibility',
        text: 'Keep your local technician informed about findings, changes and next steps. Everyone knows who is handling the work and how to move an issue forward.',
        icon: 'check',
      },
    ],
    faq: [
      {
        question: 'Who handles remote support and who comes onsite?',
        answer: 'TechSavvy handles the help desk, remote troubleshooting, monitoring, maintenance, patching, security and backup oversight. Your internal staff or local technician handles physical access and onsite troubleshooting. We coordinate the work and keep responsibilities clear.',
      },
      {
        question: 'Is this an ongoing managed service?',
        answer: 'Yes. Co-managed IT uses our Remote Managed IT package, including Proactive IT and ongoing help desk support. Planning, vendor coordination and IT guidance are part of the relationship, with responsibilities established around your environment.',
      },
      {
        question: 'Does our internal IT team stay involved?',
        answer: 'Yes. We work with your team on priorities, standards and changes. They remain connected to the business and onsite needs while we take care of the remote support and ongoing system care. Help desk hours are weekdays, 8am–5pm, with 24/7 emergency support according to your service plan.',
      },
    ],
  },
  {
    path: '/offsite-backup-recovery',
    title: 'Backup & Recovery',
    eyebrow: 'Protect the work your business depends on',
    headline: 'Build your plan around recovery.',
    summary: 'Protect important data, keep an eye on backup health and test how you would restore it. Recovery planning starts with your business priorities.',
    icon: 'cloud',
    benefits: [
      'Local and offsite protection options',
      'Backup monitoring and restore testing',
      'Business-led recovery priorities',
    ],
    cards: [
      {
        title: 'Start with critical data',
        text: 'Identify the systems and data you need, then set backup schedules, retention and responsibilities.',
        icon: 'layers',
      },
      {
        title: 'Local and offsite copies',
        text: 'Balance recovery speed, storage locations, bandwidth and existing equipment in your backup design.',
        icon: 'cloud',
      },
      {
        title: 'Backup monitoring',
        text: 'Review results and investigate warnings or failures for covered backup jobs. Follow through on issues that need attention.',
        icon: 'monitor',
      },
      {
        title: 'Restore testing',
        text: 'Test selected backups and recovery procedures, document the results and address gaps before an incident.',
        icon: 'check',
      },
      {
        title: 'Recovery priorities',
        text: 'Decide what comes back first, how much data loss is tolerable and what recovery time your business needs.',
        icon: 'clock',
      },
      {
        title: 'Security and retention',
        text: 'Plan appropriate access, encryption, storage separation and retention for your data and compliance needs.',
        icon: 'shield',
      },
    ],
    faq: [
      {
        question: 'Is cloud sync the same as a backup?',
        answer: 'No. Sync can spread unwanted changes or deletions. A backup plan also considers recoverable versions, retention, access controls and tested restores.',
      },
      {
        question: 'How quickly could we recover?',
        answer: 'Recovery depends on the incident, backup availability, data volume, connectivity and replacement systems. We set objectives around your priorities and test selected scenarios.',
      },
      {
        question: 'Can you review the backups we already use?',
        answer: 'Yes. We can review coverage, recent results, retention and restore-test history, then recommend a practical next step.',
      },
    ],
  },
  {
    path: '/it-support-business-tulsa',
    title: 'Why TechSavvy',
    eyebrow: 'Your business comes first',
    headline: 'An IT partner invested in your next step.',
    summary: 'We take time to understand your business, earn your trust and build a relationship that grows with you. Your people, priorities and success shape the way we support your technology.',
    icon: 'people',
    benefits: [
      'One relationship across your technology',
      'Clear communication and shared priorities',
      'IT leadership connected to your goals',
    ],
    cards: [
      {
        title: 'Understand your business',
        text: 'We listen before recommending. How your people work, what your customers need and where you want to grow give us the context to make better technology decisions with you.',
        icon: 'people',
      },
      {
        title: 'Build a lasting relationship',
        text: 'We want to know your business over time, earn your confidence and be a partner you can call. Consistent care and follow-through matter as much as technical answers.',
        icon: 'layers',
      },
      {
        title: 'Get clear answers',
        text: 'We explain what is happening, how it affects your business and which options make sense. You get honest recommendations, understandable choices and a clear next step.',
        icon: 'chat',
      },
      {
        title: 'Care for the people behind the ticket',
        text: 'An IT problem interrupts someone’s day. We listen, treat people with patience and respect, and work toward a useful resolution with communication they can understand.',
        icon: 'monitor',
      },
      {
        title: 'Connect the whole picture',
        text: 'We take an interest in the whole environment—your systems, vendors and workflows—so recommendations work together and you have someone helping connect the dots.',
        icon: 'network',
      },
      {
        title: 'Grow together',
        text: 'Your success matters to us. As your business adds people, changes systems or reaches for a new goal, we help your technology prepare for that next chapter.',
        icon: 'arrow',
      },
    ],
    faq: [
      {
        question: 'What types of businesses do you work with?',
        answer: 'We primarily serve Tulsa-area organizations with 10–100 computer or device users. The right relationship depends on your systems, priorities and the help you need.',
      },
      {
        question: 'Do we need to replace our current IT team?',
        answer: 'No. We can work alongside your people or act as your IT department. We agree on ownership, responsibilities and communication together.',
      },
      {
        question: 'What happens when we contact you?',
        answer: 'We discuss your business, current technology and priorities, then recommend a next step with clear scope and expectations.',
      },
    ],
  },
] as const;

export type ServicePage = (typeof servicePages)[number];
