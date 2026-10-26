/**
 * TechSavvy articles for the GitHub review site.
 * Original article URLs, titles, authors and publication instants are preserved.
 * Refreshed articles use an explicit October 26, 2026 update date.
 * The Windows 11 article remains available as an archive but is not featured.
 * Reading estimates reflect the current text at approximately 200 words/minute.
 * Factual references were checked against the linked primary sources on 2026-10-26.
 */
export interface BlogSection {
  heading?: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface BlogSource {
  label: string;
  url: string;
}

export interface BlogPost {
  path: string;
  title: string;
  excerpt: string;
  date: string;
  displayDate: string;
  updatedDate?: string;
  displayUpdatedDate?: string;
  author: string;
  image: string;
  imageAlt: string;
  category: string;
  readMinutes: number;
  archived?: boolean;
  sources?: BlogSource[];
  sections: BlogSection[];
}

export const posts: BlogPost[] = [
  {
    path: '/post/practical-ai-workflows-growing-business',
    title: '5 Practical AI Workflows for a Growing Business',
    excerpt: 'Turn repeated emails, meeting notes and everyday handoffs into useful workflows built around your business.',
    date: '2026-10-26',
    displayDate: 'October 26, 2026',
    author: 'Kyle Hearn',
    image: '/images/blog-ai-workflows.webp',
    imageAlt: 'Illustrative office scene of business professionals exploring an AI-assisted workflow together.',
    category: 'Practical AI',
    readMinutes: 3,
    sources: [
      { label: 'Microsoft: Overview of Power Automate cloud flows', url: 'https://learn.microsoft.com/en-us/power-automate/overview-cloud' },
      { label: 'Microsoft: Catch up on meetings with Copilot in Teams', url: 'https://support.microsoft.com/en-us/teams/copilot/catch-up-on-meetings-with-microsoft-365-copilot-in-teams' },
      { label: 'Microsoft: Copilot capabilities in business applications', url: 'https://www.microsoft.com/en-us/copilot/solutions/enterprise' },
    ],
    sections: [
      {
        paragraphs: [
          'A useful AI project often starts with an ordinary question: why are we doing this same task again? For a growing Tulsa business, the opportunity may be hiding in repeated emails, meeting notes, scattered requests or the spreadsheet someone rebuilds every Friday.',
          'You do not need to replace your business software to get started. Look for one familiar workflow that could work better. AI can organize and draft information; automation can move it between steps. These five examples are starting points to adapt, not promises that every tool or subscription supports every connection.',
        ],
      },
      {
        heading: '1. Turn a conversation into a useful follow-up',
        paragraphs: [
          'After a customer call, your staff may rewrite notes into an email and then copy the next steps into a task list. A focused workflow can turn approved notes into a consistent follow-up draft with the relevant details and outstanding questions.',
          'Start with your existing email and customer-management tools. Define where the information comes from, what a finished follow-up should include and who receives it. The goal is a smoother handoff, not another place to enter the same information.',
        ],
      },
      {
        heading: '2. Make meeting notes easier to use',
        paragraphs: [
          'A meeting is more useful when the next steps are easy to find. Microsoft documents that Copilot in Teams can summarize discussion and suggest action items. Availability depends on licensing, meeting settings and the content captured.',
          'A practical starting point is a short recap organized into decisions, responsibilities and next steps. Agree on recording or transcription arrangements before using meeting content, and keep the recap in a place the right people can access.',
        ],
      },
      {
        heading: '3. Give incoming requests a clear destination',
        paragraphs: [
          'Consider an internal request for equipment, a new customer inquiry or a routine service question. A form can gather the important details, create a record and notify the person responsible. AI can help organize free-text requests when that adds value.',
          'Not every step needs AI. Tools such as Power Automate support event-triggered, button-driven and scheduled workflows. Straightforward rules may be the simplest way to route a request or send a reminder.',
        ],
      },
      {
        heading: '4. Make company knowledge easier to find',
        paragraphs: [
          'Employees often know an answer exists but cannot remember which document contains it. A carefully configured assistant can help people locate information in an approved set of procedures, product notes or internal resources.',
          'Start with a small, well-maintained collection. Identify who keeps it current, preserve existing access boundaries and make source documents easy to open. Better-organized information benefits the business even before an AI tool is connected.',
        ],
      },
      {
        heading: '5. Build the small tool your process is missing',
        paragraphs: [
          'Sometimes the best improvement is a simple business app: a job-status dashboard, an onboarding checklist or a form that feeds a shared work queue. AI can assist with summaries or document preparation where useful; ordinary software can handle the structure.',
          'Choose one outcome you can evaluate, such as fewer duplicate entries or a clearer view of outstanding work. Test it with the people who will use it, compare the result with the old process and refine from there.',
        ],
      },
      {
        heading: 'Bring us the task you wish worked better',
        paragraphs: [
          'TechSavvy helps Tulsa County businesses choose AI tools, guide their users and develop practical automation or custom software. We start with how your people work and look for an improvement worth making. AI and development projects are separately scoped and priced, with any subscriptions and ongoing support explained before work begins.',
        ],
      },
    ],
  },
  {
    path: '/post/it-plan-business-growth',
    title: 'Growing Your Business? Build an IT Plan for What’s Next',
    excerpt: 'Connect hiring, equipment, cloud tools and technology vendors in a practical plan for your next stage of growth.',
    date: '2026-10-26',
    displayDate: 'October 26, 2026',
    author: 'Kyle Hearn',
    image: '/images/blog-it-growth-plan.webp',
    imageAlt: 'Illustrative office scene of business professionals planning technology improvements around a table.',
    category: 'IT Planning',
    readMinutes: 3,
    sources: [
      { label: 'NIST: Cybersecurity Framework 2.0 Small Business Quick-Start Guide', url: 'https://doi.org/10.6028/NIST.SP.1300' },
      { label: 'NIST: Building your small business cybersecurity team', url: 'https://www.nist.gov/itl/smallbusinesscyber/guidance-topic/building-your-team' },
    ],
    sections: [
      {
        paragraphs: [
          'Growth brings good questions. Can we welcome five new employees smoothly? Will our applications work well in a second location? Could we make a busy department’s day easier without replacing everything?',
          'An IT plan connects those business goals with the people, systems and vendors needed to deliver them. It does not need to be a large technical document. For a Tulsa County organization with 10–100 users, a clear set of priorities, owners and dates is a useful place to begin.',
        ],
      },
      {
        heading: 'Start with the next business milestone',
        paragraphs: [
          'Talk about what your business wants to accomplish over the next six to twelve months. Hiring, opening a location, introducing a service and adopting a new application each create different technology needs.',
          'Pick the milestone that matters most and work backward. If a new office opens in spring, internet service, equipment, application access and staff preparation belong on the schedule well before opening day. Bring IT into the conversation while there is still time to compare options.',
        ],
      },
      {
        heading: 'Know what you already have',
        paragraphs: [
          'Keep a current picture of your devices, business applications, cloud subscriptions and important services. NIST’s small-business guidance recommends maintaining an inventory of the technology a business relies on. This also provides a practical foundation for planning changes.',
          'Add business context: who uses each system, who manages it, when contracts renew and which other services it depends on. You can then discuss whether existing tools already support the next step or whether an upgrade would be worthwhile.',
        ],
      },
      {
        heading: 'Coordinate vendors around one plan',
        paragraphs: [
          'Your internet provider, business-software company and other technology vendors each handle a piece of the operation. A shared plan connects their work so your employees do not have to carry technical messages between them.',
          'For example, a new application may require vendor setup, account permissions, compatible devices and staff training. Give each part an owner and an agreed sequence. Your IT partner can coordinate the technical details, explain choices and keep the work moving toward the business goal.',
        ],
      },
      {
        heading: 'Make spending decisions easier to understand',
        paragraphs: [
          'Separate routine operating costs from planned improvements. List upcoming renewals, equipment replacements and project work, then explain the business reason for each item. Include training and ongoing software costs when comparing options.',
          'A useful roadmap distinguishes what is needed for the next milestone from improvements that can wait. Revisit it as plans change. The purpose is not to buy more technology; it is to make deliberate choices that fit your people, budget and direction.',
        ],
      },
      {
        heading: 'Keep dependable service part of the growth plan',
        paragraphs: [
          'As the business adds people and systems, review access, security responsibilities and backup arrangements alongside those changes. NIST recommends connecting cybersecurity planning with business objectives and documenting responsibilities when outside providers are involved.',
          'Think through which services staff need first to keep serving customers. Ask your IT partner to align backup and recovery planning with those priorities, and include time to prepare employees for new tools. Growth works better when everyday support remains connected to the larger plan.',
        ],
      },
      {
        heading: 'Leave the conversation with a clear next step',
        paragraphs: [
          'A useful planning meeting ends with a short list: the next milestone, the work needed, who owns it and when to check progress. TechSavvy brings IT leadership, everyday support and vendor coordination together for Tulsa County businesses. Tell us where you want to grow, and we can build the technology plan with you.',
        ],
      },
    ],
  },
  {
    "path": "/post/protect-business-email-microsoft-365-google-workspace",
    "title": "Protect Your Business Email: 5 Checks for Microsoft 365 and Google Workspace",
    "excerpt": "Five practical checks for stronger sign-ins, safer admin access, account recovery, and phishing awareness.",
    "date": "2026-10-26",
    "displayDate": "October 26, 2026",
    "author": "Kyle Hearn",
    "image": "/images/blog-email-security.svg",
    "imageAlt": "An email envelope and security shield illustrate protecting business email.",
    "category": "Cybersecurity",
    "readMinutes": 3,
    "sources": [
      {
        "label": "Microsoft: Set up multifactor authentication",
        "url": "https://learn.microsoft.com/en-us/microsoft-365/admin/security-and-compliance/set-up-multi-factor-authentication?view=o365-worldwide"
      },
      {
        "label": "CISA: Require multifactor authentication",
        "url": "https://www.cisa.gov/audiences/small-and-medium-businesses/secure-your-business/require-multifactor-authentication"
      },
      {
        "label": "Microsoft: Protect administrator accounts",
        "url": "https://learn.microsoft.com/en-us/microsoft-365/admin/security-and-compliance/m365b-account-security-admins?view=o365-worldwide"
      },
      {
        "label": "Google Workspace: Security checklist for small businesses",
        "url": "https://knowledge.workspace.google.com/admin/security/security-checklist-for-small-businesses-1-100-users"
      },
      {
        "label": "CISA: Recognize and report phishing",
        "url": "https://www.cisa.gov/secure-our-world/recognize-and-report-phishing"
      }
    ],
    "sections": [
      {
        "paragraphs": [
          "Business email connects your people, customers, invoices, and shared files. That makes it a useful place to start when reviewing security. Whether your Tulsa business uses Microsoft 365 or Google Workspace, a few focused checks can reveal gaps before they become a difficult interruption.",
          "Use these five questions in your next conversation with your IT provider. They are practical starting points for a review, with changes planned around the way your staff works."
        ]
      },
      {
        "heading": "1. Is stronger sign-in protection actually required?",
        "paragraphs": [
          "Multifactor authentication, or MFA, adds verification beyond a password. Ask your provider to check that it is required for the right accounts and that users have completed enrollment. An available setting and an enforced policy are different things.",
          "Where your systems support them, consider phishing-resistant methods such as FIDO2 security keys or passkeys. Choose an approach that fits your applications and devices, then help employees enroll. Roll it out with recovery arrangements in place so a lost phone does not leave someone without a way to work."
        ]
      },
      {
        "heading": "2. Who has administrator access?",
        "paragraphs": [
          "Administrator accounts can change settings and grant access across the business. Review who holds those permissions and whether each person still needs them. Give people the permissions their responsibilities require.",
          "Use a separate ordinary account for everyday email and browsing. Microsoft specifically recommends keeping routine work separate from administrator activity. Include your outside IT provider in this review so you understand how administrative access is assigned and protected."
        ]
      },
      {
        "heading": "3. Could you recover an account without improvising?",
        "paragraphs": [
          "A replacement phone or lost security key should have a clear recovery process. Confirm that authorized staff know whom to contact, how their identity will be checked, and where approved recovery information is stored.",
          "Google recommends maintaining administrator recovery information and securely storing backup codes where applicable. Keep recovery material protected, and review it when staff or devices change. Ask your provider how the business would regain administrative access if its usual administrator were unavailable."
        ]
      },
      {
        "heading": "4. Do people know how to verify a suspicious request?",
        "paragraphs": [
          "An urgent message asking for a payment, password, or account change deserves a pause—even when the name looks familiar. Contact the person through a number or channel you already trust, rather than the contact details inside the message.",
          "Make reporting simple. Tell employees where to send concerns and whom to call if they clicked a link, entered credentials, or approved an unexpected sign-in. Encourage quick reporting so your IT provider can investigate. Clear writing and familiar branding alone do not establish that a message is legitimate."
        ]
      },
      {
        "heading": "5. Who keeps the protection current?",
        "paragraphs": [
          "Security needs ongoing attention as employees, software, and work habits change. Assign an owner for reviewing sign-in protection, administrator access, recovery arrangements, and available email protections.",
          "Keep browsers and applications updated, review file-sharing settings, and check the protections available in your Microsoft or Google subscription. Discuss the useful improvements for your business and put them into a manageable plan."
        ]
      },
      {
        "heading": "Start with one clear next step",
        "paragraphs": [
          "Ask for a short account-security review and leave with named actions and owners. TechSavvy can help connect these checks with your everyday IT support, employee needs, and plans for growth. The goal is practical protection your business can maintain."
        ]
      }
    ]
  },
  {
    "path": "/post/managed-it-service-switching",
    "date": "2025-08-07T20:54:14.637Z",
    "displayDate": "August 7, 2025",
    "image": "/images/blog-switching.webp",
    "category": "Managed IT",
    "readMinutes": 3,
    "excerpt": "What changes when everyday support, proactive care, and technology planning work together for your business.",
    "title": "Why Tulsa Businesses Are Switching to Managed IT Services",
    "author": "Kyle Hearn",
    "sections": [
      {
        "paragraphs": [
          "When technology becomes a daily distraction, the cost reaches beyond the repair bill. Employees wait for access, owners chase vendors, and recurring problems consume time that could go toward customers. Managed IT brings those responsibilities into an ongoing relationship.",
          "For a Tulsa County business with roughly 10–100 users, that relationship can provide everyday support and a clearer plan for the systems the company depends on. The right fit starts with understanding how your people work and where the business is going."
        ]
      },
      {
        "heading": "Move from scattered fixes to consistent care",
        "paragraphs": [
          "A managed IT provider helps employees with computers, mobile devices, email, access, and business applications. Behind that support, regular monitoring, maintenance, security checks, and backup reviews help keep attention on the health of the environment.",
          "The difference is continuity. Your provider builds familiarity with your systems, documents recurring issues, and connects today’s support requests with improvements that could make tomorrow easier. You gain someone to help follow the issue through, including coordinating with software and technology vendors."
        ]
      },
      {
        "heading": "Make proactive work part of everyday service",
        "paragraphs": [
          "Updates, device health, cybersecurity, and backups are connected responsibilities. Ask how they are reviewed, how issues are acted on, and how you will hear about the work that matters to your business.",
          "At TechSavvy, Proactive IT is part of both Remote Managed IT and Full Managed IT support. We test updates in-house before customer deployment and plan their rollout around the systems involved. We also review security and backup health so developing concerns have a path to action."
        ]
      },
      {
        "heading": "Choose the relationship that fits your operation",
        "paragraphs": [
          "Some businesses need an outside IT department, including hands-on support. Others already have someone onsite who knows the equipment and people but needs a consistent remote support operation behind them.",
          "In a co-managed relationship, TechSavvy can provide remote help desk support, monitoring, updates, security care, backup checks, and server maintenance while your onsite resource handles local troubleshooting and hands-on tasks. Agree on how those roles work together so employees know where to get help."
        ]
      },
      {
        "heading": "Plan for growth instead of catching up with it",
        "paragraphs": [
          "A new employee, application, or location affects accounts, devices, connectivity, security, and spending. Regular planning conversations help you see those connections before the change arrives.",
          "Look for a provider who explains priorities in business terms. What should happen now? What can wait? What will need budget next quarter? A useful IT partner helps you make those decisions and coordinates the vendors involved."
        ]
      },
      {
        "heading": "Ask these questions before making a change",
        "paragraphs": [
          "Compare providers on the work and communication your business will receive:"
        ],
        "bullets": [
          "How will employees request help, and how are urgent issues handled?",
          "Who manages updates, security checks, backups, and follow-up work?",
          "How will remote and onsite responsibilities fit together?",
          "What is included in the recurring price, and how are additional costs approved?",
          "What happens during onboarding, and how will our systems and accounts be documented?"
        ]
      },
      {
        "heading": "Start with your business, then build the IT plan",
        "paragraphs": [
          "Bring your current frustrations, important applications, and growth plans to the first conversation. You do not need a finished technical specification. TechSavvy’s role is to understand the business, bring the pieces together, and help your technology support what comes next."
        ]
      }
    ],
    "updatedDate": "2026-10-26",
    "displayUpdatedDate": "October 26, 2026",
    "imageAlt": "Digital transformation concepts illustrated above a handheld tablet.",
    "sources": [
      {
        "label": "NIST: Building your small business cybersecurity team",
        "url": "https://www.nist.gov/itl/smallbusinesscyber/guidance-topic/building-your-team"
      },
      {
        "label": "NCSC: Choosing a managed service provider",
        "url": "https://www.ncsc.gov.uk/guidance/choosing-a-managed-service-provider-msp"
      }
    ]
  },
  {
    "path": "/post/choose-managed-it-provider-ok",
    "date": "2025-08-07T20:51:59.746Z",
    "displayDate": "August 7, 2025",
    "image": "/images/blog-provider.webp",
    "category": "IT Planning",
    "readMinutes": 3,
    "excerpt": "Six useful questions to find an IT partner who understands your business and follows through.",
    "title": "How to Choose the Right Managed IT Provider in Oklahoma",
    "author": "Kyle Hearn",
    "sections": [
      {
        "paragraphs": [
          "Choosing an IT provider is choosing a relationship with people who will support your staff and help care for important systems. A proposal should tell you how that relationship will work, not leave you comparing a page of product names.",
          "For businesses in Tulsa County, the best starting point is a conversation about your operation: who depends on technology, which interruptions hurt most, and what you want to accomplish next. Use these six questions to make that conversation useful."
        ]
      },
      {
        "heading": "1. Do they understand how your business works?",
        "paragraphs": [
          "A provider should ask about your people, important applications, vendors, busy periods, and plans for growth. Ask how they would learn your environment during onboarding and keep that knowledge current.",
          "Look for explanations you can use. You should leave a discussion understanding the priority, why it matters, and what the next step involves. A good relationship makes it easier to raise questions early."
        ]
      },
      {
        "heading": "2. Who handles support, and how do you reach them?",
        "paragraphs": [
          "Walk through a realistic example: an employee cannot sign in, a business application stops working, or a server is unavailable. Ask who receives the request, how urgency is assessed, and how you will get updates.",
          "Confirm support hours, emergency arrangements, and onsite coverage. If you have someone onsite already, discuss how remote help desk support and maintenance will connect with that person’s hands-on work."
        ]
      },
      {
        "heading": "3. What happens between support calls?",
        "paragraphs": [
          "Ask how the provider monitors devices, deploys updates, checks security, and reviews backup results. An alert is useful when someone investigates it and follows through.",
          "Request an example of the reporting or review conversation you would receive. It should help you understand meaningful issues and decisions. Ask how updates are tested and scheduled, and how recovery testing fits into the backup plan."
        ]
      },
      {
        "heading": "4. How do they protect access to your systems?",
        "paragraphs": [
          "Your IT provider may need powerful access, so ask how administrative accounts are protected, assigned, reviewed, and removed when no longer needed. Discuss how security incidents are communicated and who coordinates a response.",
          "Check relevant experience and individual credentials. If your organization handles sensitive information, discuss those requirements directly and ask how responsibilities will be documented. A credential is useful context; the day-to-day practices matter too."
        ]
      },
      {
        "heading": "5. Will they help you plan and coordinate?",
        "paragraphs": [
          "An IT partner should help connect everyday support with decisions about equipment, applications, vendors, and growth. Ask how often you will review priorities and plan upcoming spending.",
          "Vendor coordination matters when a problem touches several companies. Clarify who will work with your internet, software, and other technology providers so your staff is not left relaying technical messages back and forth."
        ]
      },
      {
        "heading": "6. Are the proposal and transition clear?",
        "paragraphs": [
          "Compare equivalent coverage rather than the monthly total alone. Review included services, licensing, equipment, project work, after-hours terms, and how additional work is approved.",
          "Ask for the onboarding steps, account and documentation arrangements, and a reference from a relevant customer. You should also understand how access and documentation would be handed over if the relationship eventually changes."
        ]
      },
      {
        "heading": "Choose a partner you can grow with",
        "paragraphs": [
          "TechSavvy brings everyday support, proactive IT care, vendor coordination, and technology planning into a relationship built around your business. We serve Tulsa County organizations that want clear answers and a partner who cares about their people and their progress.",
          "Start with a conversation about what is working, what needs attention, and where you want to go."
        ]
      }
    ],
    "updatedDate": "2026-10-26",
    "displayUpdatedDate": "October 26, 2026",
    "imageAlt": "Hands using a laptop with technology and business service illustrations.",
    "sources": [
      {
        "label": "NIST: Building your small business cybersecurity team",
        "url": "https://www.nist.gov/itl/smallbusinesscyber/guidance-topic/building-your-team"
      },
      {
        "label": "NCSC: Choosing a managed service provider",
        "url": "https://www.ncsc.gov.uk/guidance/choosing-a-managed-service-provider-msp"
      }
    ]
  },
  {
    "path": "/post/windows11-upgrade-essential",
    "date": "2025-08-13T01:45:47.451Z",
    "displayDate": "August 12, 2025",
    "image": "/images/blog-windows11.webp",
    "category": "Business Technology",
    "readMinutes": 3,
    "excerpt": "What Windows 11 changes mean for security, compatibility, and your business upgrade plan. Originally published in 2025.",
    "title": "Why Upgrading to Windows 11 from Windows 10 Is Essential for Security and Beyond",
    "author": "Kyle Hearn",
    "sections": [
      {
        "paragraphs": [
          "Originally published August 12, 2025. This article is retained as an archive, not a new announcement. Standard Windows 10 support ended on October 14, 2025. Check your edition’s lifecycle and any extended-update coverage when planning a migration.",
          "Upgrading from Windows 10 to Windows 11 is an important part of planning for a supported, modern computing environment. As cyber threats evolve and technology advances, security, application compatibility, and the needs of your business should guide the decision."
        ]
      },
      {
        "heading": "1. Fortified Security for a Safer Digital World",
        "paragraphs": [
          "Windows 11’s hardware requirements include Trusted Platform Module (TPM) 2.0 and UEFI firmware that is Secure Boot capable. TPM helps safeguard sensitive information such as encryption keys and credentials. Secure Boot helps protect the startup process.",
          "Windows Hello offers biometric authentication on compatible devices, while supported encryption features help protect files from unauthorized access. Availability and configuration depend on the device and Windows edition; an operating system upgrade does not replace the rest of your security plan."
        ]
      },
      {
        "heading": "2. Advanced Protection with Virtualization-Based Security (VBS)",
        "paragraphs": [
          "Virtualization-Based Security (VBS) isolates security-sensitive processes in a separate virtual environment. Memory integrity, also called Hypervisor-Protected Code Integrity (HVCI), uses VBS to help protect code integrity.",
          "These capabilities are not exclusive to Windows 11. Check hardware, driver compatibility, and the device’s actual settings rather than assuming a feature is enabled simply because the operating system has been upgraded."
        ]
      },
      {
        "heading": "3. A Modern, User-Friendly Interface",
        "paragraphs": [
          "Beyond security, Windows 11 offers a refreshed interface. The centered Start menu and taskbar provide a different layout, while rounded corners and updated animations change the visual experience. Allow time for employees to become familiar with the new interface."
        ]
      },
      {
        "heading": "4. Productivity Features to Stay Efficient",
        "paragraphs": [
          "Windows 11 offers tools like Snap Layouts and Snap Groups to help organize windows for multitasking. Virtual desktops allow separate workspaces for different tasks. Evaluate these features alongside the applications your employees actually use."
        ]
      },
      {
        "heading": "5. Plan for a Supported Operating System",
        "paragraphs": [
          "When this article was first published, Windows 10’s October 2025 end-of-support date was approaching. That date has now passed. Keeping devices on a supported operating system is part of reducing exposure to newly discovered threats.",
          "Confirm the lifecycle of your installed edition and version, available updates, and application requirements. Build a realistic migration plan rather than treating an upgrade as a guarantee of security."
        ]
      },
      {
        "heading": "Before You Upgrade",
        "paragraphs": [
          "Use Microsoft’s PC Health Check tool to verify Windows 11 eligibility. Requirements include a compatible processor, TPM 2.0, UEFI Secure Boot capability, and at least 4 GB of RAM; check Microsoft’s full requirements rather than relying on this summary.",
          "Back up your data before the upgrade, and check business applications, printers, drivers, and other hardware for compatibility. For organizations, consult your IT team to align the change with security policies and operational needs."
        ]
      }
    ],
    "archived": true,
    "imageAlt": "A business workstation with multiple displays."
  }
];

// Stable publication-date ordering keeps same-day articles in editorial order.
// Updated dates describe revisions and do not turn older articles into new posts.
export const allPosts = posts
  .map((post, sourceOrder) => ({ post, sourceOrder }))
  .sort((a, b) => Date.parse(b.post.date) - Date.parse(a.post.date) || a.sourceOrder - b.sourceOrder)
  .map(({ post }) => post);

export const featuredPosts = allPosts.slice(0, 3);

