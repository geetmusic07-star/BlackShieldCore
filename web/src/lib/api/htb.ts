export interface HTBProfile {
  profile: {
    id: number;
    sso_id: number;
    name: string;
    system_owns: number;
    user_owns: number;
    user_bloods: number;
    system_bloods: number;
    team: {
      id: number;
      name: string;
    } | null;
    respects: number;
    rank: string;
    rank_id: number;
    current_rank_progress: number;
    next_rank: string;
    next_rank_points: number;
    rank_ownership: string;
    rank_requirement: number;
    ranking: number;
    avatar: string;
  };
}

// Fallback mock data matching IppSec / Elite rank
const MOCK_HTB_DATA: HTBProfile = {
  profile: {
    id: 77144,
    sso_id: 123456,
    name: "ippsec",
    system_owns: 234,
    user_owns: 251,
    user_bloods: 12,
    system_bloods: 8,
    team: {
      id: 42,
      name: "Synack Red Team",
    },
    respects: 4192,
    rank: "Omniscient",
    rank_id: 6,
    current_rank_progress: 100,
    next_rank: "None",
    next_rank_points: 0,
    rank_ownership: "100%",
    rank_requirement: 100,
    ranking: 15,
    avatar: "https://www.hackthebox.com/storage/avatars/77144.png"
  }
};

export async function getHTBProfile(userId: number = 77144): Promise<HTBProfile> {
  // Try fetching from the official HTB API first.
  // Next.js will cache this aggressively.
  try {
    const res = await fetch(`https://www.hackthebox.com/api/v4/user/profile/basic/${userId}`, {
      next: { revalidate: 3600 },
      headers: {
        'User-Agent': 'BlackShieldCore-LiveMetrics/1.0',
        'Accept': 'application/json'
      }
    });

    if (!res.ok) {
      console.warn(`HTB API returned ${res.status}, falling back to mock data.`);
      return MOCK_HTB_DATA;
    }

    const data = await res.json();
    
    // In v4 HTB API, data is wrapped in a `profile` object
    if (!data.profile) {
      return { profile: data }; // Normalize if HTB changes wrapper
    }

    return data as HTBProfile;
  } catch (error) {
    console.error("HTB Fetch Error:", error);
    return MOCK_HTB_DATA;
  }
}
