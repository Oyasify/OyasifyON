export type PlanName = 'free' | 'Oyasify Light' | 'Oyasify Plus' | 'Oyasify Ultra';

export interface User {
    id: string;
    email: string;
    nickname: string;
    passwordHash: string;
    profile: Profile;
    access: AccessStatus;
    generationCredits: Record<string, number>;
    couponsUsed?: string[];
    walletBalance?: number;
}

export interface Profile {
    nickname: string;
    profilePicture: string; // Will store base64 string
    banner: string; // Will store base64 string
    bio: string;
    badges: string[];
    theme: ThemeName;
}

export interface AccessStatus {
    plan: PlanName;
    expiresAt: number | null; // Timestamp for subscription expiry
}

export type PaymentStatus = 'pending' | 'approved' | 'rejected';

export type PaymentType = 'plan' | 'generation';

export interface PaymentRequest {
    id: string;
    userId: string;
    userEmail: string;
    userNickname: string;
    type: PaymentType;
    itemName: string; // Plan name or Generator name
    pixCode: string;
    status: PaymentStatus;
    createdAt: number;
}

export type ThemeName = 'Cosmic Candy' | 'Forest Spirit' | 'Ocean Dreams' | 'Sakura Festival';

export interface Theme {
    name: ThemeName;
    background: string;
    textClass: string;
    primary: string;
    secondary: string;
    glowColor1: string;
    glowColor2: string;
    shadow: string;
}

export interface Generator {
    id: string;
    name: string;
    icon: string;
    description: string;
    category: string;
    price: number;
    pixCode: string;
}

export interface Plan {
    name: PlanName;
    price: number;
    pixCode: string;
    benefits: string[];
    isLifetime?: boolean;
}

export interface ProductRequest {
  id: string;
  userId: string;
  userNickname: string;
  requestText: string;
  status: 'pending' | 'answered';
  createdAt: number;
  productLinks?: string[]; // Array of up to 5 links
}