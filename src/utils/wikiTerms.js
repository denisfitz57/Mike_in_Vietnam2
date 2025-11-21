// Wikipedia-worthy terms found in Mike's Vietnam remembrances
// This list can be expanded as needed

export const wikiTerms = {
    // Weapons
    'AK-47': 'AK-47',
    'AK-47s': 'AK-47',
    'F-4': 'McDonnell Douglas F-4 Phantom II',
    'F-4s': 'McDonnell Douglas F-4 Phantom II',
    'F-4 Phantoms': 'McDonnell Douglas F-4 Phantom II',
    'F-4\'s': 'McDonnell Douglas F-4 Phantom II',
    '105mm howitzer': 'M101 howitzer',
    'Huey gunships': 'Bell UH-1 Iroquois',
    'Napalm': 'Napalm',
    'grenade': 'Hand grenade',

    // Military units & locations
    'DMZ': 'Vietnamese Demilitarized Zone',
    'NVA': 'People\'s Army of Vietnam',
    '3rd Marine Division': '3rd Marine Division',
    '101st Air Cavalry': '101st Airborne Division',
    'Charlie Troop': '1st Cavalry Division (United States)',
    'U.S.O.': 'United Service Organizations',
    'USO': 'United Service Organizations',
    'Air Force': 'United States Air Force',
    'Marines': 'United States Marine Corps',
    'Marine Corps': 'United States Marine Corps',
    'Army': 'United States Army',

    // Places
    'Vietnam': 'Vietnam',
    'Viet Nam': 'Vietnam',
    'North Vietnam': 'North Vietnam',
    'Quang Tri': 'Quảng Trị',
    'Quang Tri city': 'Quảng Trị',
    'Camp Pendelton': 'Marine Corps Base Camp Pendleton',
    'Camp Lejeune': 'Marine Corps Base Camp Lejeune',
    'Da Nang': 'Da Nang',
    'Australia': 'Australia',

    // Ships
    'hospital ship': 'Hospital ship',
    'carrier Okinawa': 'USS Okinawa (LPH-3)',
    'Okinawa': 'USS Okinawa (LPH-3)',
    'USS Bon Homme Richard': 'USS Bon Homme Richard (CV-31)',

    // Events & Operations
    'Tet Offensive': 'Tet Offensive',
    'Tet Offensive of \'68': 'Tet Offensive',

    // Military terms & positions
    'C-rations': 'C-ration',
    'LZ': 'Landing zone',
    'landing zone': 'Landing zone',
    'H & I fire': 'Harassing fire',
    'harassment and interdiction': 'Harassing fire',
    'body bags': 'Body bag',
    'foxhole': 'Defensive fighting position',
    'outpost': 'Outpost (military)',
    'patrol': 'Patrol',
    'ambush': 'Ambush',
    'bunker': 'Bunker',
    'fire team leader': 'Fireteam',
    'Squad Leader': 'Squad',
    'platoon': 'Platoon',
    'regiment': 'Regiment',
    'second lieutenant': 'Second lieutenant',
    'Lance Corporal': 'Lance corporal',
    'Corporal': 'Corporal',
    'ace': 'Flying ace',

    // Combat practices and tensions
    'I told him that I don\'t salute officers': 'Fragging',
    'I don\'t salute officers': 'Fragging',
    'don\'t salute officers': 'Fragging',
    'officers can be': 'Fragging',
    'really dumb': 'Military courtesy',

    // Other
    'Demerol': 'Pethidine',
    'Kool-Aid': 'Kool-Aid',
    'Apocalypse Now': 'Apocalypse Now',
    'rice paddies': 'Paddy field'
};

// Create a regex pattern that matches all terms (longest first to avoid partial matches)
export const createWikiPattern = () => {
    const sortedTerms = Object.keys(wikiTerms).sort((a, b) => b.length - a.length);
    // Escape special regex characters and create pattern
    const escapedTerms = sortedTerms.map(term =>
        term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    );
    return new RegExp(`\\b(${escapedTerms.join('|')})\\b`, 'gi');
};
