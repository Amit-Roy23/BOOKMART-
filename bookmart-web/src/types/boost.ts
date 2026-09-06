export type PlanId = "pro" | "pro-plus" | "ultimate";

export interface BoostPlan {
  id: PlanId;
  name: string;
  description: string;
  price: number;
  boostLimit: number;
  popular?: boolean;
  badge?: string;
}

export interface BoostBook {
  id: string;
  title: string;
  author: string;
  price: number;
  image: string;
  boosted: boolean;
}

export interface CurrentSubscription {
  plan: PlanId;
  planName: string;
  boostLimit: number;
}

export interface BoostData {
  plans: BoostPlan[];
  books: BoostBook[];
  currentSubscription: CurrentSubscription;
  usageToday: number;
  durationDays: number;
}
