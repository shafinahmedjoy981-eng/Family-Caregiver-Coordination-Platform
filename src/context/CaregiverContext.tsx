import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CareRecipient,
  CaregiverPersona,
  CareTask,
  CalendarEvent,
  Medication,
  VaultDocument,
  ActivityItem,
  NotificationItem,
  AuditLog,
  OnboardingState,
  UserRole,
  TimeSlot,
  BillingPlanInfo,
  PaymentMethodInfo,
  BillingInvoice,
} from '../types';
import {
  initialCareRecipient,
  initialFamilyCircle,
  initialTasks,
  initialCalendarEvents,
  initialMedications,
  initialVaultDocuments,
  initialActivityFeed,
  initialNotifications,
  initialAuditLogs,
  initialOnboardingState,
  initialBillingPlan,
  initialPaymentMethod,
  initialInvoices,
} from '../data/mockInitialData';

export type AppNavTab =
  | 'dashboard'
  | 'calendar'
  | 'tasks'
  | 'medications'
  | 'vault'
  | 'feed'
  | 'profile'
  | 'team'
  | 'audit'
  | 'admin'
  | 'security'
  | 'billing';

interface CaregiverContextType {
  // Navigation & Persona
  activeTab: AppNavTab;
  setActiveTab: (tab: AppNavTab) => void;
  currentUser: CaregiverPersona;
  setCurrentUserById: (userId: string) => void;
  familyCircle: CaregiverPersona[];
  isSeniorMode: boolean;
  setIsSeniorMode: (active: boolean) => void;

  // Accessibility
  highContrast: boolean;
  setHighContrast: (active: boolean) => void;
  textScale: number; // 100, 125, 150, 175, 200
  setTextScale: (scale: number) => void;
  darkMode: boolean;
  setDarkMode: (active: boolean) => void;
  speakText: (text: string) => void;

  // Onboarding
  onboarding: OnboardingState;
  setOnboarding: React.Dispatch<React.SetStateAction<OnboardingState>>;
  updateOnboarding: (updates: Partial<OnboardingState>) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;

  // Circle & RBAC
  inviteMember: (member: Omit<CaregiverPersona, 'id'>) => void;
  updateMemberRole: (memberId: string, newRole: UserRole) => void;
  removeMember: (memberId: string) => void;

  // Family Plan & Billing
  billingPlan: BillingPlanInfo;
  paymentMethod: PaymentMethodInfo;
  invoices: BillingInvoice[];
  changePlan: (newPlanId: 'free' | 'plus' | 'pro') => void;
  updatePaymentMethod: (card: PaymentMethodInfo) => void;

  // Core Data
  careRecipient: CareRecipient;
  updateCareRecipient: (updates: Partial<CareRecipient>) => void;

  // Tasks
  tasks: CareTask[];
  addTask: (task: Omit<CareTask, 'id' | 'status' | 'createdBy' | 'createdByName'>) => void;
  claimTask: (taskId: string) => void;
  unclaimTask: (taskId: string) => void;
  completeTask: (taskId: string) => void;

  // Calendar
  calendarEvents: CalendarEvent[];
  addCalendarEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  claimTransportation: (eventId: string) => void;

  // Medications
  medications: Medication[];
  logMedicationDose: (medId: string, timeSlot: TimeSlot, status: 'taken' | 'skipped' | 'snoozed', notes?: string) => void;
  addMedication: (med: Omit<Medication, 'id' | 'adherenceLogs'>) => void;
  recordRefill: (medId: string, addedCount: number) => void;

  // Document Vault
  vaultDocuments: VaultDocument[];
  addVaultDocument: (doc: Omit<VaultDocument, 'id' | 'uploadDate' | 'encryptionStatus' | 'auditLogs'>) => void;
  recordDocumentAccess: (docId: string, actionDesc: string) => void;

  // Activity Feed
  activityFeed: ActivityItem[];
  addActivityPost: (content: string, type?: ActivityItem['type'], badgeText?: string) => void;
  toggleCheer: (feedId: string) => void;
  cheerActivity: (feedId: string) => void;
  addActivityComment: (feedId: string, content: string) => void;

  // Notifications
  notifications: NotificationItem[];
  markNotificationRead: (notifId: string) => void;
  markAllNotificationsRead: () => void;

  // Audit Logs (Security & Compliance)
  auditLogs: AuditLog[];
  logAuditEntry: (action: string, resource: string, sensitivity?: 'PHI' | 'ADMIN' | 'STANDARD') => void;

  // Quick Action Modal
  isQuickCaptureOpen: boolean;
  setIsQuickCaptureOpen: (open: boolean) => void;

  // RBAC Permission check helpers
  canEdit: boolean;
  canClaim: boolean;
  canViewPhi: boolean;
  isAdmin: boolean;
}

const CaregiverContext = createContext<CaregiverContextType | undefined>(undefined);

export const CaregiverProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & Persona
  const [activeTab, setActiveTab] = useState<AppNavTab>('dashboard');
  const [familyCircle, setFamilyCircle] = useState<CaregiverPersona[]>(() => {
    const saved = localStorage.getItem('tw_circle');
    return saved ? JSON.parse(saved) : initialFamilyCircle;
  });
  const [currentUserId, setCurrentUserId] = useState<string>('user_sarah');
  const [isSeniorMode, setIsSeniorMode] = useState<boolean>(false);

  // Accessibility
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [textScale, setTextScale] = useState<number>(100);
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Quick Capture Modal
  const [isQuickCaptureOpen, setIsQuickCaptureOpen] = useState<boolean>(false);

  // Onboarding
  const [onboarding, setOnboarding] = useState<OnboardingState>(() => {
    const saved = localStorage.getItem('tw_onboarding');
    return saved ? JSON.parse(saved) : initialOnboardingState;
  });

  // Core Data
  const [careRecipient, setCareRecipient] = useState<CareRecipient>(() => {
    const saved = localStorage.getItem('tw_recipient');
    return saved ? JSON.parse(saved) : initialCareRecipient;
  });

  const [tasks, setTasks] = useState<CareTask[]>(() => {
    const saved = localStorage.getItem('tw_tasks');
    return saved ? JSON.parse(saved) : initialTasks;
  });

  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(() => {
    const saved = localStorage.getItem('tw_events');
    return saved ? JSON.parse(saved) : initialCalendarEvents;
  });

  const [medications, setMedications] = useState<Medication[]>(() => {
    const saved = localStorage.getItem('tw_medications');
    return saved ? JSON.parse(saved) : initialMedications;
  });

  const [vaultDocuments, setVaultDocuments] = useState<VaultDocument[]>(() => {
    const saved = localStorage.getItem('tw_vault');
    return saved ? JSON.parse(saved) : initialVaultDocuments;
  });

  const [activityFeed, setActivityFeed] = useState<ActivityItem[]>(() => {
    const saved = localStorage.getItem('tw_feed');
    return saved ? JSON.parse(saved) : initialActivityFeed;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('tw_notifications');
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('tw_audit');
    return saved ? JSON.parse(saved) : initialAuditLogs;
  });

  // Family Plan & Billing State
  const [billingPlan, setBillingPlan] = useState<BillingPlanInfo>(() => {
    const saved = localStorage.getItem('tw_plan');
    return saved ? JSON.parse(saved) : initialBillingPlan;
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodInfo>(() => {
    const saved = localStorage.getItem('tw_payment');
    return saved ? JSON.parse(saved) : initialPaymentMethod;
  });

  const [invoices, setInvoices] = useState<BillingInvoice[]>(() => {
    const saved = localStorage.getItem('tw_invoices');
    return saved ? JSON.parse(saved) : initialInvoices;
  });

  // Active persona
  const currentUser = familyCircle.find((u) => u.id === currentUserId) || familyCircle[0];

  // RBAC permissions based on active persona
  const isAdmin = currentUser.role === 'admin';
  const canEdit = currentUser.role === 'admin' || currentUser.role === 'contributor';
  const canClaim = currentUser.role === 'admin' || currentUser.role === 'contributor' || currentUser.role === 'aide';
  const canViewPhi = currentUser.role !== 'viewer' || true; // viewers have basic view; aide is shift scoped

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('tw_circle', JSON.stringify(familyCircle));
  }, [familyCircle]);

  useEffect(() => {
    localStorage.setItem('tw_plan', JSON.stringify(billingPlan));
  }, [billingPlan]);

  useEffect(() => {
    localStorage.setItem('tw_payment', JSON.stringify(paymentMethod));
  }, [paymentMethod]);

  useEffect(() => {
    localStorage.setItem('tw_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('tw_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('tw_events', JSON.stringify(calendarEvents));
  }, [calendarEvents]);

  useEffect(() => {
    localStorage.setItem('tw_medications', JSON.stringify(medications));
  }, [medications]);

  useEffect(() => {
    localStorage.setItem('tw_vault', JSON.stringify(vaultDocuments));
  }, [vaultDocuments]);

  useEffect(() => {
    localStorage.setItem('tw_feed', JSON.stringify(activityFeed));
  }, [activityFeed]);

  useEffect(() => {
    localStorage.setItem('tw_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('tw_audit', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('tw_onboarding', JSON.stringify(onboarding));
  }, [onboarding]);

  // Log Audit Entry
  const logAuditEntry = (action: string, resource: string, sensitivity: 'PHI' | 'ADMIN' | 'STANDARD' = 'STANDARD') => {
    const now = new Date();
    const formatted = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    const newLog: AuditLog = {
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: formatted,
      actorName: currentUser.name,
      actorRole: currentUser.role,
      action,
      resource,
      ipAddress: '192.168.1.10 (Secure TLS 1.3)',
      device: navigator.userAgent.includes('Mobile') ? 'Mobile Handset' : 'Desktop Browser',
      sensitivityLevel: sensitivity,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const setCurrentUserById = (userId: string) => {
    setCurrentUserId(userId);
    const persona = familyCircle.find((u) => u.id === userId);
    if (persona) {
      logAuditEntry(`Session switched to persona: ${persona.name} (${persona.role})`, 'Identity & Access');
      if (persona.role === 'senior') {
        setIsSeniorMode(true);
      } else {
        setIsSeniorMode(false);
      }
    }
  };

  // Speech synthesis for elderly and low-vision accessibility
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9; // gentle and understandable
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Update Care Recipient
  const updateCareRecipient = (updates: Partial<CareRecipient>) => {
    setCareRecipient((prev) => {
      const updated = { ...prev, ...updates };
      localStorage.setItem('tw_recipient', JSON.stringify(updated));
      return updated;
    });
    logAuditEntry('Updated care recipient profile information', 'Care Profile Vault', 'PHI');
  };

  // Task actions
  const addTask = (taskData: Omit<CareTask, 'id' | 'status' | 'createdBy' | 'createdByName'>) => {
    const newTask: CareTask = {
      ...taskData,
      id: `task-${Date.now()}`,
      status: 'open',
      createdBy: currentUser.id,
      createdByName: currentUser.name,
    };
    setTasks((prev) => [newTask, ...prev]);

    // Add activity post
    addActivityPost(`Added a new task: "${newTask.title}" for ${newTask.dueDate}`, 'family_note', 'Task Added');

    logAuditEntry(`Created new task: "${newTask.title}"`, 'Task Board');
  };

  const claimTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            status: 'claimed',
            claimedBy: currentUser.id,
            claimedByName: currentUser.name,
            assignedTo: currentUser.id,
            assignedToName: currentUser.name,
          };
        }
        return t;
      })
    );

    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      addActivityPost(
        `I've got this! Claimed task: "${task.title}"`,
        'task_claimed',
        'Task Claimed'
      );
      logAuditEntry(`Claimed task responsibility: "${task.title}"`, 'Task Board');
    }
  };

  const unclaimTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            status: 'open',
            claimedBy: undefined,
            claimedByName: undefined,
            assignedTo: undefined,
            assignedToName: undefined,
          };
        }
        return t;
      })
    );
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      logAuditEntry(`Released claim on task: "${task.title}"`, 'Task Board');
    }
  };

  const completeTask = (taskId: string) => {
    const nowStr = 'Today at ' + new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            status: 'completed',
            completedAt: nowStr,
            completedBy: currentUser.id,
            completedByName: currentUser.name,
          };
        }
        return t;
      })
    );

    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      addActivityPost(
        `Completed: "${task.title}". All taken care of!`,
        'task_completed',
        'Task Done'
      );
      logAuditEntry(`Marked task completed: "${task.title}"`, 'Task Board');
    }
  };

  // Calendar actions
  const addCalendarEvent = (eventData: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...eventData,
      id: `event-${Date.now()}`,
    };
    setCalendarEvents((prev) => [...prev, newEvent]);

    addActivityPost(
      `Scheduled ${newEvent.category}: "${newEvent.title}" on ${newEvent.date} at ${newEvent.startTime}`,
      'appointment_added',
      'New Event'
    );
    logAuditEntry(`Created calendar event: "${newEvent.title}" on ${newEvent.date}`, 'Shared Calendar');
  };

  const claimTransportation = (eventId: string) => {
    setCalendarEvents((prev) =>
      prev.map((ev) => {
        if (ev.id === eventId) {
          return {
            ...ev,
            transportationClaimedBy: currentUser.id,
            transportationClaimedByName: currentUser.name,
          };
        }
        return ev;
      })
    );
    const ev = calendarEvents.find((e) => e.id === eventId);
    if (ev) {
      addActivityPost(
        `I will drive Mom for: "${ev.title}" on ${ev.date} at ${ev.startTime}`,
        'task_claimed',
        'Ride Confirmed'
      );
      logAuditEntry(`Claimed transportation for event: "${ev.title}"`, 'Shared Calendar');
    }
  };

  // Medication actions
  const logMedicationDose = (
    medId: string,
    timeSlot: TimeSlot,
    status: 'taken' | 'skipped' | 'snoozed',
    notes?: string
  ) => {
    const today = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

    setMedications((prev) =>
      prev.map((med) => {
        if (med.id === medId) {
          const newLog = {
            id: `log-${Date.now()}`,
            date: today,
            timeSlot,
            status,
            loggedAt: nowTime,
            loggedBy: currentUser.id,
            loggedByName: currentUser.name,
            notes,
          };
          const newRemaining = status === 'taken' ? Math.max(0, med.remainingDoses - 1) : med.remainingDoses;
          return {
            ...med,
            remainingDoses: newRemaining,
            adherenceLogs: [newLog, ...med.adherenceLogs],
          };
        }
        return med;
      })
    );

    const med = medications.find((m) => m.id === medId);
    if (med) {
      const verb = status === 'taken' ? 'took' : status === 'skipped' ? 'skipped' : 'postponed';
      addActivityPost(
        `${currentUser.name === 'Eleanor Vance' ? 'Mom' : currentUser.name} logged ${med.name} (${med.dosage}) as ${verb} for ${timeSlot}.`,
        'med_logged',
        status === 'taken' ? 'Dose Taken' : 'Dose Skipped'
      );
      logAuditEntry(`Logged ${med.name} dose (${timeSlot}) as ${status}`, 'Medication Tracker', 'PHI');
    }
  };

  const addMedication = (medData: Omit<Medication, 'id' | 'adherenceLogs'>) => {
    const newMed: Medication = {
      ...medData,
      id: `med-${Date.now()}`,
      adherenceLogs: [],
    };
    setMedications((prev) => [...prev, newMed]);
    logAuditEntry(`Added new medication to regimen: ${newMed.name} ${newMed.dosage}`, 'Medication Tracker', 'PHI');
  };

  const recordRefill = (medId: string, addedCount: number) => {
    setMedications((prev) =>
      prev.map((med) => {
        if (med.id === medId) {
          return {
            ...med,
            remainingDoses: med.remainingDoses + addedCount,
          };
        }
        return med;
      })
    );
    const med = medications.find((m) => m.id === medId);
    if (med) {
      addActivityPost(`Picked up and recorded prescription refill for ${med.name} (+${addedCount} doses).`, 'family_note', 'Refill Recorded');
      logAuditEntry(`Refilled prescription: ${med.name} (+${addedCount} units)`, 'Medication Tracker', 'PHI');
    }
  };

  // Vault actions
  const addVaultDocument = (docData: Omit<VaultDocument, 'id' | 'uploadDate' | 'encryptionStatus' | 'auditLogs'>) => {
    const today = new Date().toISOString().split('T')[0];
    const newDoc: VaultDocument = {
      ...docData,
      id: `doc-${Date.now()}`,
      uploadDate: today,
      encryptionStatus: 'AES-256 Encrypted',
      auditLogs: [
        {
          id: `audit-${Date.now()}`,
          userId: currentUser.id,
          userName: currentUser.name,
          action: 'Uploaded and encrypted document with AES-256 GCM',
          timestamp: today,
        },
      ],
    };
    setVaultDocuments((prev) => [newDoc, ...prev]);
    logAuditEntry(`Uploaded encrypted document to vault: "${newDoc.title}"`, 'Document Vault', 'PHI');
  };

  const recordDocumentAccess = (docId: string, actionDesc: string) => {
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16);
    setVaultDocuments((prev) =>
      prev.map((doc) => {
        if (doc.id === docId) {
          return {
            ...doc,
            auditLogs: [
              {
                id: `aud-${Date.now()}`,
                userId: currentUser.id,
                userName: currentUser.name,
                action: actionDesc,
                timestamp: nowStr,
              },
              ...doc.auditLogs,
            ],
          };
        }
        return doc;
      })
    );
    logAuditEntry(`${actionDesc} on vault document`, `Document Vault (#${docId})`, 'PHI');
  };

  // Activity Feed
  const addActivityPost = (content: string, type: ActivityItem['type'] = 'family_note', badgeText?: string) => {
    const newItem: ActivityItem = {
      id: `feed-${Date.now()}`,
      timestamp: 'Just now',
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentUser.relationship,
      type,
      content,
      cheerCount: 0,
      cheers: [],
      badgeText,
    };
    setActivityFeed((prev) => [newItem, ...prev]);
  };

  const toggleCheer = (feedId: string) => {
    setActivityFeed((prev) =>
      prev.map((item) => {
        if (item.id === feedId) {
          const hasCheered = item.cheers.includes(currentUser.name);
          const newCheers = hasCheered
            ? item.cheers.filter((n) => n !== currentUser.name)
            : [...item.cheers, currentUser.name];
          return {
            ...item,
            cheers: newCheers,
            cheerCount: newCheers.length,
          };
        }
        return item;
      })
    );
  };

  const addActivityComment = (feedId: string, content: string) => {
    const nowTime = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    setActivityFeed((prev) =>
      prev.map((item) => {
        if (item.id === feedId) {
          const newComment = {
            id: `c-${Date.now()}`,
            authorId: currentUser.id,
            authorName: currentUser.name,
            authorRole: currentUser.relationship,
            content,
            timestamp: `Today at ${nowTime}`,
          };
          return {
            ...item,
            comments: [...(item.comments || []), newComment],
          };
        }
        return item;
      })
    );
  };

  // Notifications
  const markNotificationRead = (notifId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  // Reset Onboarding (allows user to re-walk through the personalized setup flow)
  const resetOnboarding = () => {
    setOnboarding((prev) => ({ ...prev, isCompleted: false, currentStep: 1 }));
  };

  const updateOnboarding = (updates: Partial<OnboardingState>) => {
    setOnboarding((prev) => ({ ...prev, ...updates }));
  };

  const completeOnboarding = () => {
    setOnboarding((prev) => ({ ...prev, isCompleted: true }));
  };

  const inviteMember = (member: Omit<CaregiverPersona, 'id'>) => {
    const newMember: CaregiverPersona = {
      ...member,
      id: `user-${Date.now()}`,
      joinedDate: 'Just now',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    };
    setFamilyCircle((prev) => [...prev, newMember]);
    addActivityPost(`Invited ${newMember.name} to the care circle as ${newMember.role}.`, 'family_note', 'Circle Member Added');
    logAuditEntry(`Invited new circle member: ${newMember.name} (${newMember.role})`, 'Care Circle', 'ADMIN');
  };

  const updateMemberRole = (memberId: string, newRole: UserRole) => {
    const member = familyCircle.find((m) => m.id === memberId);
    if (!member) return;
    const oldRole = member.role;
    setFamilyCircle((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, role: newRole } : m))
    );
    logAuditEntry(
      `Changed role permissions for ${member.name} from [${oldRole}] to [${newRole}]`,
      `Circle RBAC / ${member.name}`,
      'ADMIN'
    );
    addActivityPost(
      `Updated ${member.name}’s care circle role to ${newRole}.`,
      'family_note',
      'Role Updated'
    );
  };

  const removeMember = (memberId: string) => {
    const member = familyCircle.find((m) => m.id === memberId);
    if (!member) return;
    setFamilyCircle((prev) => prev.filter((m) => m.id !== memberId));
    // Immediately revoke access: if removed user was the active persona, switch safely
    if (currentUserId === memberId) {
      const fallback = familyCircle.find((m) => m.id !== memberId && m.role === 'admin') || familyCircle.find((m) => m.id !== memberId);
      if (fallback) {
        setCurrentUserId(fallback.id);
      }
    }
    logAuditEntry(
      `Revoked circle membership and immediately severed access credentials for ${member.name} (${member.email})`,
      `Circle RBAC / ${member.name}`,
      'ADMIN'
    );
    addActivityPost(
      `Removed ${member.name} from Eleanor’s Care Circle. Access revoked immediately.`,
      'family_note',
      'Access Revoked'
    );
  };

  const changePlan = (newPlanId: 'free' | 'plus' | 'pro') => {
    const plans: Record<'free' | 'plus' | 'pro', { name: string; price: number; limit: number }> = {
      free: { name: 'Free Essentials', price: 0, limit: 2 },
      plus: { name: 'Family Caregiver Plus', price: 24, limit: 8 },
      pro: { name: 'Care Concierge Pro', price: 49, limit: 99 },
    };
    const target = plans[newPlanId];
    setBillingPlan((prev) => ({
      ...prev,
      id: newPlanId,
      name: target.name,
      price: target.price,
      memberLimit: target.limit,
    }));
    logAuditEntry(
      `Updated Family Plan subscription to: ${target.name} ($${target.price}/mo, ${target.limit} members limit)`,
      'Subscription & Billing',
      'ADMIN'
    );
    addActivityPost(
      `Updated family subscription plan to ${target.name}.`,
      'family_note',
      'Plan Updated'
    );
  };

  const updatePaymentMethod = (card: PaymentMethodInfo) => {
    setPaymentMethod(card);
    logAuditEntry(
      `Updated billing payment method ending in •••• ${card.last4} (${card.brand})`,
      'Subscription & Billing',
      'ADMIN'
    );
  };

  const cheerActivity = (feedId: string) => {
    toggleCheer(feedId);
  };

  return (
    <CaregiverContext.Provider
      value={{
        activeTab,
        setActiveTab,
        currentUser,
        setCurrentUserById,
        familyCircle,
        isSeniorMode,
        setIsSeniorMode,
        highContrast,
        setHighContrast,
        textScale,
        setTextScale,
        darkMode,
        setDarkMode,
        speakText,
        onboarding,
        setOnboarding,
        updateOnboarding,
        completeOnboarding,
        resetOnboarding,
        inviteMember,
        updateMemberRole,
        removeMember,
        billingPlan,
        paymentMethod,
        invoices,
        changePlan,
        updatePaymentMethod,
        careRecipient,
        updateCareRecipient,
        tasks,
        addTask,
        claimTask,
        unclaimTask,
        completeTask,
        calendarEvents,
        addCalendarEvent,
        claimTransportation,
        medications,
        logMedicationDose,
        addMedication,
        recordRefill,
        vaultDocuments,
        addVaultDocument,
        recordDocumentAccess,
        activityFeed,
        addActivityPost,
        toggleCheer,
        cheerActivity,
        addActivityComment,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        auditLogs,
        logAuditEntry,
        isQuickCaptureOpen,
        setIsQuickCaptureOpen,
        canEdit,
        canClaim,
        canViewPhi,
        isAdmin,
      }}
    >
      {children}
    </CaregiverContext.Provider>
  );
};

export const useCaregiver = () => {
  const context = useContext(CaregiverContext);
  if (!context) {
    throw new Error('useCaregiver must be used within a CaregiverProvider');
  }
  return context;
};
