export type UserRole = 'admin' | 'contributor' | 'viewer' | 'aide' | 'senior';

export interface CaregiverPersona {
  id: string;
  name: string;
  relationship: string;
  role: UserRole;
  avatar: string;
  email: string;
  phone: string;
  isCurrentUser?: boolean;
  shiftHours?: string;
  onDuty?: boolean;
  joinedDate?: string;
}

export type CircleMember = CaregiverPersona;

export interface Condition {
  id: string;
  name: string;
  diagnosedYear?: number;
  diagnosedDate?: string;
  notes: string;
  severe?: boolean;
}

export interface Allergy {
  id: string;
  allergen: string;
  reaction: string;
  severity: 'mild' | 'moderate' | 'severe';
}

export interface Provider {
  id: string;
  name: string;
  specialty: string;
  clinic: string;
  clinicName?: string;
  phone: string;
  address: string;
  notes?: string;
  portalUrl?: string;
}

export type HealthcareProvider = Provider;

export interface EmergencyContact {
  id?: string;
  name: string;
  phone: string;
  relationship: string;
  priority?: number;
  isPOA?: boolean;
}

export interface InsuranceInfo {
  provider?: string;
  primaryProvider: string;
  policyNumber: string;
  groupNumber: string;
  medicareId: string;
  supplementalPlan?: string;
  rxBin: string;
  rxPcn: string;
  rxGroup: string;
}

export interface CareRecipient {
  name: string;
  preferredName: string;
  age: number;
  dob: string;
  address: string;
  livingArrangement: string;
  bloodType?: string;
  photoUrl?: string;
  mobilityNotes?: string;
  dietaryRestrictions?: string[];
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  emergencyContacts?: EmergencyContact[];
  conditions: Condition[];
  allergies: Allergy[];
  providers: Provider[];
  insurance: InsuranceInfo;
  pharmacy: {
    name: string;
    phone: string;
    address: string;
    hours: string;
  };
  dietaryNotes: string[];
}

export type TaskCategory = 'medical' | 'errand' | 'household' | 'social' | 'meals';
export type TaskPriority = 'normal' | 'time_sensitive';
export type TaskStatus = 'open' | 'claimed' | 'completed';

export interface CareTask {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  priority: TaskPriority;
  dueDate: string;
  dueTime?: string;
  status: TaskStatus;
  assignedTo?: string;
  assignedToName?: string;
  claimedBy?: string;
  claimedByName?: string;
  completedAt?: string;
  completedBy?: string;
  completedByName?: string;
  createdBy: string;
  createdByName: string;
}

export type EventCategory = 'appointment' | 'medication' | 'visit' | 'therapy' | 'social';

export interface CalendarEvent {
  id: string;
  title: string;
  category: EventCategory;
  date: string;
  startTime: string;
  endTime: string;
  location?: string;
  providerName?: string;
  notes?: string;
  attendees: string[];
  transportationNeeded?: boolean;
  transportationClaimedBy?: string;
  transportationClaimedByName?: string;
}

export type TimeSlot = 'morning' | 'afternoon' | 'evening' | 'bedtime';

export interface AdherenceLog {
  id: string;
  date: string; // YYYY-MM-DD
  timeSlot: TimeSlot;
  status: 'taken' | 'skipped' | 'snoozed';
  loggedAt: string;
  loggedBy: string;
  loggedByName: string;
  notes?: string;
}

export interface Medication {
  id: string;
  name: string;
  genericName?: string;
  dosage: string;
  instructions: string;
  frequency: string;
  timeSlots: TimeSlot[];
  pillColor: string;
  pillShape: 'round' | 'oval' | 'capsule';
  remainingDoses: number;
  totalDoses: number;
  refillDueThreshold: number;
  prescriber: string;
  rxNumber: string;
  adherenceLogs: AdherenceLog[];
  purpose: string;
}

export type DocumentCategory = 'poa' | 'insurance' | 'medical_record' | 'id_card' | 'advance_directive' | 'discharge_notes';

export interface VaultDocument {
  id: string;
  title: string;
  category: DocumentCategory;
  fileType: string;
  fileSize: string;
  uploadDate: string;
  expirationDate?: string;
  encryptionStatus: 'AES-256 Encrypted';
  restrictedRoles?: UserRole[];
  isVerified: boolean;
  notes?: string;
  fileUrl?: string;
  auditLogs: {
    id: string;
    userId: string;
    userName: string;
    action: string;
    timestamp: string;
  }[];
}

export interface ActivityComment {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  content: string;
  timestamp: string;
}

export type ActivityType =
  | 'task_claimed'
  | 'task_completed'
  | 'med_logged'
  | 'appointment_added'
  | 'family_note'
  | 'voice_update'
  | 'shift_note'
  | 'medical_update';

export interface ActivityItem {
  id: string;
  timestamp: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  type: ActivityType;
  content: string;
  cheerCount: number;
  cheers: string[];
  comments?: ActivityComment[];
  badgeText?: string;
}

export interface NotificationItem {
  id: string;
  triage: 'urgent' | 'today' | 'later';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionLabel?: string;
  relatedModule?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorName: string;
  userName?: string;
  actorRole: UserRole;
  action: string;
  resource: string;
  resourceType?: string;
  ipAddress: string;
  device: string;
  sensitivityLevel: 'PHI' | 'ADMIN' | 'STANDARD';
}

export type CaregiverSituation = 'post_hospital' | 'sudden_diagnosis' | 'long_term' | 'preventive';

export interface OnboardingState {
  isCompleted: boolean;
  currentStep?: number;
  situation?: CaregiverSituation;
  stageOfCare: 'transitioning' | 'routine' | 'post_discharge' | 'intensive';
  relationship: 'adult_child' | 'spouse' | 'sibling' | 'relative' | 'friend' | string;
  recipientName: string;
  recipientNickname?: string;
  primaryGoals?: string[];
  primaryCondition?: string;
  firstInviteEmail?: string;
  invitedMembers: Array<{ name: string; email: string; role: UserRole }>;
}

export interface BillingPlanInfo {
  id: 'free' | 'plus' | 'pro';
  name: string;
  price: number;
  billingCycle: 'monthly' | 'annual';
  memberLimit: number;
  nextBillingDate: string;
  status: 'active' | 'trialing' | 'past_due';
}

export interface PaymentMethodInfo {
  brand: 'Visa' | 'Mastercard' | 'Amex';
  last4: string;
  expMonth: string;
  expYear: string;
  cardholderName: string;
}

export interface BillingInvoice {
  id: string;
  invoiceNumber: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending';
  downloadUrl?: string;
}
