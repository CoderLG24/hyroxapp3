import type { Reward } from "@/lib/types";

export const rewards: Reward[] = [
  { id: "katy-favorite-treat", name: "Favorite Treat", cost: 250, athleteId: "katy", scope: "personal" },
  { id: "katy-beauty-item", name: "Beauty Item", cost: 450, athleteId: "katy", scope: "personal" },
  { id: "katy-skincare-wellness", name: "Skincare / Wellness Item", cost: 600, athleteId: "katy", scope: "personal" },
  { id: "katy-massage", name: "Massage", cost: 850, athleteId: "katy", scope: "personal" },
  { id: "katy-premium-dinner", name: "Premium Dinner Out", cost: 1200, athleteId: "katy", scope: "personal" },
  { id: "katy-spa", name: "Spa", cost: 1600, athleteId: "katy", scope: "personal" },
  { id: "katy-workout-outfit", name: "New Workout Outfit", cost: 2200, athleteId: "katy", scope: "personal" },
  { id: "katy-maid", name: "Maid", cost: 2600, athleteId: "katy", scope: "personal" },
  { id: "katy-staycation", name: "Staycation / Hotel Night", cost: 3200, athleteId: "katy", scope: "personal" },
  { id: "lawton-favorite-treat", name: "Favorite Treat", cost: 250, athleteId: "lawton", scope: "personal" },
  { id: "lawton-gym-accessory", name: "Small Gym Accessory", cost: 450, athleteId: "lawton", scope: "personal" },
  { id: "lawton-recovery-tool", name: "Recovery Tool / Hobby Item", cost: 700, athleteId: "lawton", scope: "personal" },
  { id: "lawton-gear-credit", name: "Gear Credit", cost: 1000, athleteId: "lawton", scope: "personal" },
  { id: "lawton-premium-dinner", name: "Premium Dinner Out", cost: 1400, athleteId: "lawton", scope: "personal" },
  { id: "lawton-new-shoes", name: "New Shoes", cost: 2000, athleteId: "lawton", scope: "personal" },
  { id: "lawton-big-gear", name: "Big Gear Purchase / Event", cost: 3200, athleteId: "lawton", scope: "personal" },
  { id: "shared-premium-dinner", name: "Premium Dinner Out", cost: 1200, scope: "shared" },
  { id: "shared-deep-clean", name: "House Deep Clean", cost: 1800, scope: "shared" },
  { id: "shared-maid", name: "Maid", cost: 2600, scope: "shared" },
  { id: "shared-staycation", name: "Staycation / Hotel Night", cost: 3200, scope: "shared" },
  { id: "shared-event-tickets", name: "Event Tickets / Weekend Experience", cost: 3600, scope: "shared" }
];
