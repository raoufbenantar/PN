/**
 * Registry of every fixed (hardcoded) picture on the public website.
 *
 * Each slot has a stable `key` used by the `pn_site_images` table. The
 * `default` value is the original asset so the site keeps working before
 * any admin upload exists.
 */

const img = (url) => url;

export const SITE_IMAGE_SECTIONS = [
  {
    id: 'home',
    title: 'Home / Landing',
    description: 'Hero banner and the services and profiles blocks.',
    images: [
      {
        key: 'hero.background',
        label: 'Hero background',
        hint: 'Full-bleed image behind "Project Nature"',
        default: img('https://lh3.googleusercontent.com/aida-public/AB6AXuA_3UMZoA6EZgR-Y3jnJbBBL2Sg5Miyl4gD6C77cLdpBu40XMFJYIv533XhOX85AEEUDgxoTKbsFSXO4YpdLJlITGiExFfw1s-YJmK7xH6O6GhWVB0pVlL3FME7tM-WYc3KbJagxnC2La18ctFOkUD94o0zti2CBOqoRo47wSxQoOTXnPbidrGuhG5d58OAZvrNlDk3lNS8MHI_1wMlBxLZWOljOL2eXS-BOuTyqbqY0ELYSaanvHTDIlRGhPqJ-EUUvrF6MqcgFJk'),
      },
      {
        key: 'services.hikes',
        label: 'Services — Hikes photo',
        hint: 'Polaroid image in the "Our Services" section',
        default: img('https://lh3.googleusercontent.com/aida-public/AB6AXuA7nxhAOiHeW2WXuHwO-24jmqtrNfxy22xwA94dzOhyl6O90l-SJ9rWm0tuOL7PjisPnEkk3XkYo6Rvwme4lQ2FP34uPgg6LmT67I0t-FD8yAb80eV6IzF43JHRiCB_fHfqaqJB123Na0yF8dbyrEq7dPEQNJVjDB3Tv_TqFpnUNTGqC-WUwkjEpbF8tsNgHP423KwsNV5Nv_5N7145URzeUREA6Ym--teRKPsA-CWQ-_id3wzJprUzrGeOhxaJeFlHpiiL_vYZH08'),
      },
      {
        key: 'categories.youth',
        label: 'Find Your Trip — Youth',
        hint: 'Polaroid card for the "Youth" profile',
        default: img('https://lh3.googleusercontent.com/aida-public/AB6AXuCxYS9U9_hRyyqbePwqEXfAFnGxbSc1hiEYJTDqjOvSfGCstYVwTfFuLt7phMTqHJDHvA7fweUSjQqAJdN7spbdRkvIo6uUeChbtD_sssdOm-wLRPH4fBJwuqWoq1uWQCORRgf1WuBfmVLYaM-QSL53BvBKU52QYJdxWgJaZ1HwSeKTPJcYe3lj5AfoZGmuYrxOZqDQqoVyb8z61Dd4DO2HWXQTsfe4WDJjQbMG9c5iMW9aVgET5luvbgfXB3CPaEsqEwI1qWWqWVk'),
      },
      {
        key: 'categories.athletes',
        label: 'Find Your Trip — Athletes',
        hint: 'Polaroid card for the "Athletes" profile',
        default: img('https://lh3.googleusercontent.com/aida-public/AB6AXuDKUM7kvjJdyRpGeUzJzUCLw4i4PSD8aRIKTlwF948s4ppyeRrGTV7m6OBTubAOWYP4yM0wpYjTr6B7vuNZxuearxt9Fjy4qBfqxBzYtkk16Q5sUC9zbcUOcWwUuTP42SO6xdNFgdMWGPKHy1Pglny0WxYqmRI5C1QCZDdtkhzr_J2Q8uy9H36y3enKKUZ26IZfRAhGdPUEfpgC8QNHzLqOnPNtx4iA_60aEZPq_YsmLCeLF2SSr9iIUKafkB5J0NnsINSPtdMSP4k'),
      },
      {
        key: 'categories.students',
        label: 'Find Your Trip — Students',
        hint: 'Polaroid card for the "Students" profile',
        default: img('https://lh3.googleusercontent.com/aida-public/AB6AXuAKy1GC84YvTvHR1yo8yOCa_zr3OkD7jSwg-F2r2gO6OrB_V1ogrDwnX9AHVLUc9Z_0ZEk6pYTGpjtq5CZ28fIq5H4Mk_YeE4gIa_1MrXzIwQveQ4dK9toP4bv-QEvkChxmJU1Zl8W74DR8CruZwLShcWbTxnae7DpNabXFITUphTuMVb9h-ZIJnkOz0aFOU0HX6upK4_X4X4AtJZ6auuFX8s-8OtmR9mabwzBgleaRIlu8-vGcFCkXKg1fsM5KnWee216SgbLntfA'),
      },
    ],
  },
  {
    id: 'kherjat',
    title: 'Kherjat / Trips',
    description: 'Images on the trips listing page.',
    images: [
      {
        key: 'kherjat.philosophy',
        label: 'Philosophy section photo',
        hint: '"More than just an outing, an immersion." block',
        default: img('https://lh3.googleusercontent.com/aida-public/AB6AXuCibTEd5I-KSowPb_fIJWZlWnlJXjLghZ8qQXew7MDT-qcsm6nDL9QSgvhpHksML5q-Arw-wbFDFV0KQ75ch89xC7qhHK0BQOI6nkDkBVB-bNB5P2mjJKnim2YlCjWFMydVTjfayiSTthzEV81NSBb-U6IZ7s_091_31tewrune4_2KVs344VpZTTSuWeTHJJ1v1p2RmocCYPmD09PUe5Q3ypPwyR2qbAaws_3YDG7C6VrwA9YdKyT85GlK6eeBLGI13S20EFfk2qc'),
      },
    ],
  },
  {
    id: 'souvenirs',
    title: 'Souvenirs / Logbook',
    description: 'The scrapbook gallery on the Souvenirs page.',
    images: [
      {
        key: 'souvenirs.ridge',
        label: 'Main image — "The Call of the Ridge"',
        hint: 'Large image, left column',
        default: img('https://lh3.googleusercontent.com/aida-public/AB6AXuDNJ6MthZV3LUC_FRUFQB1hYBzRZyykaGAHG0YydAG4-u6g88t1RZ6VOfsvsC5-iFzBx1yycxzjhU0il7NRjeoJ9kAiugENxsSjpLq51WQMg4O-A95-N4plyun3GEhALoC6xNTvZ_GmYxi0YwLxxkzhNlmRH3KLF8fiyP1Xdsec2oFQrZkDhji138zdU7W2AumJNXbZUUjqn7jDGqaQDn8KF5K-3hV_wpCxRTyUIBlZGyfEEamMxEU2iy0ymjtF2DRargDsMXap9Cw'),
      },
      {
        key: 'souvenirs.video',
        label: 'Video thumbnail — "IN MOTION"',
        hint: 'Background/cover of the video player card',
        default: img('https://lh3.googleusercontent.com/aida-public/AB6AXuDyNf55M1qfo_5nfXnDnIx4D5-2kRtOCWdaIAev2J0WYY6CELnwtB5qQHrNprkJYTccl06UBYmIQJb48pXiMNEuZ4j_9d__YOecvFGd0H9w2Ci9I3vNNlkId4Qudhxa7Ic7UTGullXCtitnCTHivigtRSBrGiV6NHnTYLXMi8FgS_R6a-K2WRefUsxKhaWEECFY2ruAmvpvLjhmOfi_kKEGKm6FUIBlLGdkIt0mLGuvKgoOveJLIvcFeVJzdVBeIRiHRyq1G8Jzbo0'),
      },
      {
        key: 'souvenirs.polaroid',
        label: 'Polaroid — "Altitude Smiles"',
        hint: 'Smiling explorer polaroid card',
        default: img('https://lh3.googleusercontent.com/aida-public/AB6AXuAOohTC0kfJuk7rKUMapilcSMUt5vq5KbAGUO4gGUk56YTjJkLyQKaAM06nHdg83ueAHrY56sACofIU83fIzxRIDzBpDbP-ootq5pGZnTNX4Gt8Oc5cV93bo22Zp4ZgNEQ9myGfhTsEk94zarXDCc_dFCLwb-TqG63xVrhIyGsPL3MohkZEsgvFMZtE8J1CWpeEEGNkWSIPoyT6HM9K7PKipaJGCBAunrsth3B29LvryZ0zm1fzQrkdzpOe8N6QUY8FUWKWtBrV9Ls'),
      },
      {
        key: 'souvenirs.campfire',
        label: 'Campfire photo — "Bivouac Evening"',
        hint: 'Bottom image in the right column',
        default: img('https://lh3.googleusercontent.com/aida-public/AB6AXuDa17PPlXhB7xwgOKujX8dE3KJcIpGOvtBSfZLSc1VvztLeuy3t4aQUg4fqftLsDGKwiVwFmor6yFkmMNb5g7BuwoSaKBXCYDOKVb0mzWZgB7oyaSNG2lXeqRTWPVtithlkm9ki2unqNa8v-X_puuMxdjE5OXLKL4S0aSdMT1e_kunebs3MOww_XXwImlVEohD6_-up6g5C_-VEHxD6FbKvbBrmIts2oImVsHrN_eky7yhjtLefaVNt9qKU3ndl_JXUY2M1kpQCgAk'),
      },
    ],
  },
  {
    id: 'about',
    title: 'About / Our Story',
    description: 'Story illustration and team member portraits.',
    images: [
      {
        key: 'about.hero',
        label: 'Story illustration',
        hint: 'Main image in the "Our Story" section',
        default: img('https://lh3.googleusercontent.com/aida-public/AB6AXuCFab2nh9VRs0VbD0H1zwtFc6LRcgDIxHySdLTxN5UPMXmamTmISDYqew8iumyu7zbXYgydY9IOAUlMXwho1ofNRdaqZsL3IiBOYQ_KL2iZxDzPaP4aghhhXb9LXnlFAU1i6JBjykb_Pl0FF4iTdu0QhdH5nEFX0Z_TxdafA2Aw1kvTH7KLa68WAg2hJ4lq8OSG0DhFAseeUr1neL_eZ9x7O7w_kzB44XPkCRxIfSsLgD7mxTOtosZVI0lQi18sD7x6OXOEBWcl0ac'),
      },
      {
        key: 'about.team.haithem',
        label: 'Team — Haithem',
        hint: 'Founder & Lead Guide portrait',
        default: img('https://lh3.googleusercontent.com/aida-public/AB6AXuDAa6kaBxLx-qP2MRrqjAVGU1luaJoKUPJaOHNhyvpaiythKFCNSRuFUrKri4kjwDcGoDkZKfEuaHj1ZKMKgy5JARHv3QpTiUGyoLDwgBBnvK_uu1NGyODhnEgx2C-qYiBl-RkWx19nehB47oHv4_tneOlWjjLNpTwKkZKks8iUP6-EVCQ7BHlHh8Ui7tJnjnWTDeyynsGPD2tdW3Y6K7I7az_BoLDGUQph1Eojdo_gJVuEbsMRqCuw_ub0g2f2eABEcuAy_c3uz2o'),
      },
      {
        key: 'about.team.rahim',
        label: 'Team — Rahim',
        hint: 'Co-Founder & Logistics portrait',
        default: img('https://lh3.googleusercontent.com/aida-public/AB6AXuBSyOEPIzr2_2--9wEutu0ggObOJQR0iUGw7ZdHmfRPOjKGkwXFqpv_9sReNJC82qSurjQCqHg5H3rYoJ8GMP4qX1m8KEG6ZLmNepa1IWRMjQviWHkY_WnxOHbxtcl21ToSnq6h5Q2KIfAglD82v5rhMMeR0jf-Kedgv75W7pohFrOXOg8ZrIfdpEKzoRxgqSqyMQSyvMtxXJFL_RU09QYtNdsAuXOZmdCKIjODVN81SR1RHs9db_ofLOJyMhgRG-cXUpQYjwZzh70'),
      },
      {
        key: 'about.team.amine',
        label: 'Team — Amine',
        hint: 'Senior Mountaineering Guide portrait',
        default: img('https://lh3.googleusercontent.com/aida-public/AB6AXuCzA_OgoKJjABjlEmgp-m4fRKidFCo5Atowcp2_nc8n6CA5_wJfOU9lEo5C-fpyTArB05yiSzEtPGXohDUwzS2rPX0nQj48mzz-_i3PR1urXms24Hcu1mlJldvO5PEWRarP87m9zYSOWs55DYvQYHY6C2ZqxuQBbCZS8jWBZbTVuF5ERg0lJSJg1rTiIiu5MPxqRDB0xaOMo5CyXkuAGJzTnNSUg7aHanQBkTqZYJoWqmK4Fwch9Ud9qWLhfA-MD2vdR_LIALaGmxk'),
      },
      {
        key: 'about.team.sarah',
        label: 'Team — Sarah',
        hint: 'Expedition Photographer portrait',
        default: img('https://lh3.googleusercontent.com/aida-public/AB6AXuDRXJPyP3gNdz2iTuFXaNbDLxE-qdX3f1ufSmaDgx1_mJOUjseHtA3HkgEt2HGRjGS49KVPNvSD4ietq1jAuVCtOZPFewN85cp-TbNEXa55fGj2Ihr4ztTw3khFPLPtL-EGwcNPObrDBe53-Ba_Qo5zGS4x1V2q6-zfWm22G_WaB4LNqo5KIJP8e9HdaKIRy91CGKTDfRJ8JmAHNh2l-jROo4ep7Nn_y6WS2eYaINaR0Bak4Pg6W0AKIfT2to6QKySqdBzTpg4GGX4'),
      },
    ],
  },
  {
    id: 'auth',
    title: 'Login / Register',
    description: 'Side panel backgrounds on the account pages.',
    images: [
      {
        key: 'auth.login',
        label: 'Login page background',
        hint: 'Left split panel on the login screen',
        default: img('https://lh3.googleusercontent.com/aida-public/AB6AXuCljJvyaGkf1y2WXHrK93oDCMDZa-dvb6_qOgVZBoWlfKzz6WsI1Qz8CjxFwWAuxhB2lKbQe2d-NohY804mEsiusrygo-sidVE8xf-iq_WTcz54PuGsF13rAumRCYz1rXMdvNFcp3M7m6FyMrLOVCSJ1avl7kjZx-AR1zCUDVcnnhxEmrR7Rq9TdtGlcoxFp0LY49qRlvn8FnvHkOaAeO0SdZCpJyD1VVWG5ypqMmmo_xMG7BnDmv4L'),
      },
      {
        key: 'auth.register',
        label: 'Register page background',
        hint: 'Left split panel on the sign-up screen',
        default: img('https://lh3.googleusercontent.com/aida-public/AB6AXuANn4rhTzScBo3-lYlSShRYS5u7oJNZgB8_4AMmUm0T3_iNb40n0tZphNoSHyLK5yFs2ITGWVBnQ_fB4dpTwPKwos9ErrQdtgWP8xgbxD3oAud7FEuKKXDdqWB16EMajd0X6InBc30x-hf7SYV9A-S2g8Pt668wWFPNKIrXvP_PaEvi9Xb8Tqci0RLV6uHrqWK_Pjb-yNpMEkOjORfgc1InrZzle3q9OMOVDL6voYEh3mBGb3UPCNV9'),
      },
      {
        key: 'auth.changePassword',
        label: 'Change password background',
        hint: 'Left split panel on the change password screen',
        default: img('https://lh3.googleusercontent.com/aida-public/AB6AXuClg8-WJqIO1eN5vpejsvboHOpxFpdY90yTYsBhE_vTb6hNmxdiqgV2qzJPa96PA-_3M-xsJWnKbyUXn7GTTrX3uWcZ4bh7jMlwaEAtg-UHc-V-7_UGp2FSf1MCGhWRY0envMCOwPKhQmoghUycNxMugCjRBffWDdI2gfOyp9-1m8W9JljijhZ23KZSaEx1ZtLoDMmZIrkT7rDcGbnx6yyuRy_4xReEg3jQrqxmbTOFYOWi9Arabxc6'),
      },
    ],
  },
];

export const SITE_IMAGES = SITE_IMAGE_SECTIONS.flatMap((section) =>
  section.images.map((image) => ({ ...image, sectionId: section.id, sectionTitle: section.title })),
);

export const SITE_IMAGE_DEFAULTS = SITE_IMAGES.reduce((acc, image) => {
  acc[image.key] = image.default;
  return acc;
}, {});

export function getSiteImageDefault(key) {
  return SITE_IMAGE_DEFAULTS[key] || null;
}

export function findSiteImage(key) {
  return SITE_IMAGES.find((image) => image.key === key) || null;
}
