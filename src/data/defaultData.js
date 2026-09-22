export const DEFAULT_PORTFOLIO_DATA = {
  profile: {
    fullName: "KMA Media & Wedding Production",
    shortName: "KMA",
    title: "Premier Cinematography & Luxury Wedding Media Production",
    tagline: "Capturing your timeless moments and premier events with high-end digital cinema and visual artistry.",
    bio: "KMA is a premier media production company specializing in luxury wedding cinematography, visual storytelling, and major corporate event coverage. Equipped with high-end cinema cameras, optical lenses, and licensed aerial drones, our team of directors and cinematographers craft cinematic experiences that last forever.",
    location: "Cairo, Egypt • Available for Destination Weddings & Worldwide Travel",
    email: "contact@kmawedding.com",
    phone: "+20 100 000 0000",
    phoneSecondary: "+20 120 000 0000",
    avatarUrl: "/logo.png",
    logoUrl: "/logo.png",
    openToWork: true,
    showBookingFormPublic: false,
    socials: {
      instagram: "https://instagram.com/kma_wedding",
      facebook: "https://facebook.com/kmawedding",
      youtube: "https://youtube.com/@kmawedding",
      tiktok: "https://tiktok.com/@kmawedding"
    },
    stats: [
      {
        value: "+950",
        label: "Weddings & Events Documented",
        desc: "Celebrated across Egypt & Middle East"
      },
      {
        value: "+10",
        label: "Years of Creative Excellence",
        desc: "Pioneering visual storytelling"
      },
      {
        value: "25+",
        label: "Professional Cinema Crew",
        desc: "Specialized directors & cinematographers"
      },
      {
        value: "99.8%",
        label: "Client Satisfaction Rate",
        desc: "Unmatched reviews & recommendations"
      }
    ]
  },

  certificates: [
    {
      id: "cert-1",
      title: "Commercial Media Production & Cinematography License",
      issuer: "National Media Authority & Cinema Chamber",
      issueDate: "2016",
      expiryDate: "Active Official License",
      credentialId: "KMA-MEDIA-LIC-9410",
      credentialUrl: "https://kmawedding.com/license",
      imageUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800",
      description: "Official accredited permit for commercial media production, cinematic broadcasting, outdoor filming, and luxury wedding documentation.",
      skills: ["Media Production", "Cinematography", "Event Documentation", "Official Permits"],
      category: "Official Permits & Licenses",
      featured: true
    },
    {
      id: "cert-2",
      title: "Sony Cine Pro Certified Cinematographer",
      issuer: "Sony Professional Solutions & CineAlta",
      issueDate: "2020",
      expiryDate: "Lifetime Certification",
      credentialId: "SONY-CINE-PRO-8812",
      credentialUrl: "https://pro.sony/verify",
      imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800",
      description: "International accreditation certifying mastery in digital cinema camera operation, advanced color science, low-light imaging, and cinematic prime optics.",
      skills: ["Sony FX Series", "Color Grading", "Cine Primes", "Advanced Lighting"],
      category: "Technical Certifications",
      featured: true
    },
    {
      id: "cert-3",
      title: "Commercial Aerial Drone Operator Permit",
      issuer: "Civil Aviation Authority & Aerial Permits",
      issueDate: "2021",
      expiryDate: "Renewed & Active",
      credentialId: "UAV-DRONE-LIC-3301",
      credentialUrl: "https://kmawedding.com/drone-permit",
      imageUrl: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=800",
      description: "Official flight license to operate professional aerial drones for panoramic cinematic filming of weddings, open-air venues, and summits under safety protocols.",
      skills: ["DJI Inspire 3", "4K Aerial Cinematography", "Panoramic Angles", "Flight Safety"],
      category: "Official Permits & Licenses",
      featured: true
    },
    {
      id: "cert-4",
      title: "Best Wedding Film & Media Production Award",
      issuer: "Middle East Wedding & Media Awards",
      issueDate: "2023",
      expiryDate: "Annual Excellence Honor",
      credentialId: "ME-WED-AWARD-2023",
      credentialUrl: "https://kmawedding.com/awards",
      imageUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800",
      description: "Awarded top honor for outstanding cinematography and visual storytelling in luxury weddings across the Middle East.",
      skills: ["Wedding Films", "Cinematic Direction", "Master Editing", "VIP Client Care"],
      category: "Awards & Honors",
      featured: false
    }
  ],

  projects: [
    {
      id: "proj-1",
      title: "Royal Palace Wedding Highlights • Baron Palace",
      category: "weddings",
      categoryLabel: "Cinematic Weddings",
      value: "Full VIP Cinema Package",
      year: "2024",
      tribunal: "5-Camera Cinema Crew & Drone",
      clientType: "Luxury Royal Wedding",
      description: "Comprehensive multi-camera cinema production for a lavish palace wedding, featuring 4K aerial drone sweeps, live crystal audio recording, and same-day highlights delivered to the couple that evening.",
      outcome: "Delivered an 8-minute 4K cinematic film, handcrafted Italian leather album, and full archival raw footage with glowing client acclaim.",
      techStack: ["Sony FX6 / FX3", "DJI Cinema Drone", "Custom Color Grading", "Same Day Edit"],
      liveUrl: "https://kmawedding.com/portfolio/royal-wedding",
      githubUrl: "https://instagram.com/kma_wedding",
      imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800",
      featured: true
    },
    {
      id: "proj-2",
      title: "Destination Beach Wedding • El Gouna Red Sea",
      category: "destination",
      categoryLabel: "Destination Weddings",
      value: "Full Destination Package",
      year: "2024",
      tribunal: "Outdoor Seaside & Yacht Sessions",
      clientType: "International Destination Couple",
      description: "Romantic wedding documentary capturing coastal sunset light, beachfront vows, and candid unscripted moments by the golden sea in El Gouna.",
      outcome: "Delivered a cinematic teaser film and 450+ fine-art retouched high-resolution photographs in a digital gallery.",
      techStack: ["Outdoor Cinematography", "Golden Hour Lighting", "Coastal Palette", "Fine Art Gallery"],
      liveUrl: "https://kmawedding.com/portfolio/gouna-wedding",
      githubUrl: "https://instagram.com/kma_wedding",
      imageUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800",
      featured: true
    },
    {
      id: "proj-3",
      title: "Annual Global Summit & Corporate Gala Coverage",
      category: "events",
      categoryLabel: "Corporate Events",
      value: "Official Media Production",
      year: "2024",
      tribunal: "Cairo International Conference Center",
      clientType: "Premier Corporate Enterprise",
      description: "Complete visual management for an annual summit of 1,500+ attendees, featuring multi-cam live broadcast to venue LED displays, VIP interview production, and instant social reels.",
      outcome: "Continuous 8-hour live broadcast, accompanied by 20+ viral short-form videos delivered for real-time digital release.",
      techStack: ["Multi-Cam Live Switch", "Broadcast Direction", "Social Media Reels", "VIP Interviews"],
      liveUrl: "https://kmawedding.com/portfolio/annual-summit",
      githubUrl: "https://kmawedding.com/events",
      imageUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800",
      featured: true
    },
    {
      id: "proj-4",
      title: "Bridal Editorial Photo Session & Italian Album",
      category: "photography",
      categoryLabel: "Bridal Photography",
      value: "Luxury Fine-Art Album",
      year: "2023",
      tribunal: "KMA Studio & Private Estate",
      clientType: "Private Wedding Portraiture",
      description: "High-fashion editorial session showcasing bridal couture, fine jewelry, and intimate couple portraits captured with dramatic studio lighting.",
      outcome: "Designed and produced a bespoke handcrafted Italian leather album with lifetime color and paper archival guarantee.",
      techStack: ["Editorial Studio Lighting", "Natural Skin Retouching", "Italian Printmaking", "Custom Album Layout"],
      liveUrl: "https://kmawedding.com/portfolio/bridal-session",
      githubUrl: "https://instagram.com/kma_wedding",
      imageUrl: "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&q=80&w=800",
      featured: false
    },
    {
      id: "proj-5",
      title: "Luxury Open-Air Garden Wedding & Fireworks",
      category: "weddings",
      categoryLabel: "Cinematic Weddings",
      value: "Outdoor Cinema Pack",
      year: "2023",
      tribunal: "Sheikh Zayed Luxury Resort",
      clientType: "Celebrity Wedding",
      description: "Nighttime open-air cinematography capturing ambient garden fairy lights, floral installations, and spectacular fireworks with ultra-fast cine lenses.",
      outcome: "Produced a dynamic teaser film and full-length feature movie that garnered widespread appreciation from the couple and guests.",
      techStack: ["Low-Light Sensor Tech", "Cine Prime Optics", "120fps Slow-Motion", "Dynamic Sound Design"],
      liveUrl: "https://kmawedding.com/portfolio/outdoor-wedding",
      githubUrl: "https://instagram.com/kma_wedding",
      imageUrl: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=800",
      featured: false
    },
    {
      id: "proj-6",
      title: "High-Fashion Brand Commercial & Video Campaign",
      category: "commercial",
      categoryLabel: "Commercial Media",
      value: "National Campaign",
      year: "2024",
      tribunal: "KMA Soundstages & On-Location",
      clientType: "Luxury Apparel Brand",
      description: "Scriptwriting, creative directing, and cinematic production for a premium promotional campaign tailored for 4K streaming and social digital channels.",
      outcome: "Generated over 2M organic impressions across digital platforms, successfully establishing brand visual identity.",
      techStack: ["Commercial Direction", "Visual Effects", "Master Audio Mastering", "Omni-Platform Delivery"],
      liveUrl: "https://kmawedding.com/portfolio/commercial-campaign",
      githubUrl: "https://kmawedding.com/media",
      imageUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800",
      featured: true
    }
  ],

  practiceAreas: [
    {
      id: "service-1",
      category: "weddings",
      title: "Cinematic Wedding Films",
      description: "We tell your love story through cinematic imagery that combines heartfelt emotion with cutting-edge cinema technology and direction.",
      items: [
        "4K / 6K Digital Cinema Cameras",
        "Custom Score & Sound Design",
        "Same-Day Edit Highlights",
        "Crisp Multi-Mic Audio Capture",
        "Luxury Wooden USB Box Delivery"
      ]
    },
    {
      id: "service-2",
      category: "photography",
      title: "Artistic Bridal & Editorial Photography",
      description: "Exquisite portraits and spontaneous candids capturing every smile and joyous tear, paired with handcrafted Italian fine-art albums.",
      items: [
        "Outdoor Destination Sessions",
        "Bridal Details & Jewelry Focus",
        "Italian Digital Flush-Mount Albums",
        "High-End Fashion Skin Retouching",
        "Fully-Equipped Lighting Studio"
      ]
    },
    {
      id: "service-3",
      category: "drone",
      title: "Aerial Drone Cinematography",
      description: "Breathtaking panoramic aerial sweeps that lend your event a grand, regal perspective unobtainable by conventional cameras.",
      items: [
        "Licensed Professional Drone Fleet",
        "Panoramic Venue & Decor Aerials",
        "Certified Commercial Pilots",
        "Ultra-HD 4K Resolution",
        "Strict Venue Safety Compliance"
      ]
    },
    {
      id: "service-4",
      category: "media",
      title: "Corporate Media & Event Production",
      description: "End-to-end visual coverage for conferences, summits, and brand galas, featuring live multi-cam streaming and immediate short reels.",
      items: [
        "Multi-Camera Live Streaming",
        "Same-Day Social Media Reels",
        "Live On-Screen Video Switching",
        "Comprehensive Press & Media Coverage",
        "Corporate Brand Documentaries"
      ]
    }
  ],

  milestones: [
    {
      year: "2024",
      title: "Surpassed 950 Celebrated Weddings & Events",
      description: "Expanded our cinema camera fleet and upgraded aerial drone systems to the latest generation of digital cinematography."
    },
    {
      year: "2023",
      title: "Awarded Best Middle East Wedding Film Production",
      description: "Claimed 1st place in regional industry accolades for cinematic excellence and emotional storytelling."
    },
    {
      year: "2020",
      title: "Flagship Studio Launch & Color Suite Opening",
      description: "Opened our modern production facility with dedicated mastering suites and multi-camera live broadcast infrastructure."
    },
    {
      year: "2015",
      title: "Founding of KMA with a Cinematic Vision",
      description: "Launched with a singular passion: turning weddings and milestones into timeless visual masterpieces."
    }
  ],

  skills: [
    {
      category: "Cinematography & Camera Systems",
      items: [
        "Sony FX6 / FX3 Cinema Line",
        "Cine Prime Optics",
        "4K / 6K Resolution",
        "120fps Slow Motion",
        "DJI Ronin Gimbal Stabilization"
      ]
    },
    {
      category: "Post-Production & Sound Design",
      items: [
        "Davinci Resolve Color Science",
        "Same-Day Edit Highlights",
        "Cinematic Sound Mastering",
        "High-End Skin Retouching",
        "Archival Master Storage"
      ]
    },
    {
      category: "Aerial & Lighting Technology",
      items: [
        "DJI Aerial Drones",
        "Commercial Flight Permits",
        "Aputure Studio Lighting",
        "Multi-Camera Live Broadcast",
        "Wireless Video Transmission"
      ]
    }
  ]
};
