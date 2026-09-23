import React, { useState } from 'react';
import { useCaregiver } from '../../context/CaregiverContext';
import {
  CreditCard,
  CheckCircle2,
  Download,
  ShieldCheck,
  Users,
  Calendar,
  Lock,
  ArrowUpRight,
  Plus,
  Edit2,
  X,
  FileText,
  Clock,
  HelpCircle,
  AlertCircle,
} from 'lucide-react';
import { BillingPlanInfo, PaymentMethodInfo, BillingInvoice } from '../../types';

export const FamilyPlanPage: React.FC = () => {
  const {
    familyCircle,
    billingPlan,
    paymentMethod,
    invoices,
    changePlan,
    updatePaymentMethod,
    logAuditEntry,
  } = useCaregiver();

  // Modals state
  const [isChangePlanOpen, setIsChangePlanOpen] = useState(false);
  const [isUpdateCardOpen, setIsUpdateCardOpen] = useState(false);

  // Card update form state
  const [cardholderName, setCardholderName] = useState(paymentMethod.cardholderName);
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [expMonth, setExpMonth] = useState(paymentMethod.expMonth);
  const [expYear, setExpYear] = useState(paymentMethod.expYear);
  const [cvc, setCvc] = useState('912');
  const [zipCode, setZipCode] = useState('01742');

  // Feedback Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const activeMembersCount = familyCircle.length;
  const usagePercentage = Math.min(
    100,
    Math.round((activeMembersCount / billingPlan.memberLimit) * 100)
  );

  const availablePlans = [
    {
      id: 'free' as const,
      name: 'Free Essentials',
      price: 0,
      period: 'free forever',
      limit: 2,
      description: 'Simple shared coordination for one primary caregiver and back-up.',
      features: [
        'Up to 2 circle members',
        'Basic shared calendar & task board',
        '30-day activity feed history',
        'Standard email notifications',
      ],
    },
    {
      id: 'plus' as const,
      name: 'Family Caregiver Plus',
      price: 24,
      period: 'per month',
      limit: 8,
      recommended: true,
      description: 'Comprehensive coordination and HIPAA-grade security for the whole family.',
      features: [
        'Up to 8 circle members & professional aides',
        'Unlimited AES-256 encrypted health document vault',
        'Real-time prescription tracking & refill alerts',
        'Voice-first dignified Senior Mode interface',
        '7-year immutable HIPAA compliance audit ledger',
        'Shift-scoped access rules for visiting aides',
      ],
    },
    {
      id: 'pro' as const,
      name: 'Care Concierge Pro',
      price: 49,
      period: 'per month',
      limit: 99,
      description: 'White-glove clinical support with dedicated nurse navigation and agency syncing.',
      features: [
        'Unlimited circle members & agency caregivers',
        '24/7 Registered Nurse care concierge messaging',
        'Automated pharmacy sync & courier dispatch',
        'Direct EHR & Medicare claims document import',
        'Dedicated family onboarding specialist',
      ],
    },
  ];

  const handleSavePaymentMethod = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanLast4 = cardNumber.replace(/\D/g, '').slice(-4) || '4242';
    const newCard: PaymentMethodInfo = {
      brand: 'Visa',
      last4: cleanLast4,
      expMonth: expMonth.padStart(2, '0'),
      expYear: expYear.length === 2 ? expYear : expYear.slice(-2),
      cardholderName: cardholderName.trim(),
    };

    updatePaymentMethod(newCard);
    setIsUpdateCardOpen(false);
    showToast(`Payment method updated: Visa ending in •••• ${cleanLast4}.`);
  };

  const handleSelectPlan = (planId: 'free' | 'plus' | 'pro') => {
    if (planId === billingPlan.id) return;
    changePlan(planId);
    setIsChangePlanOpen(false);
    const chosen = availablePlans.find((p) => p.id === planId);
    showToast(`Subscription updated to ${chosen?.name}. New limits are now active.`);
  };

  const handleDownloadInvoice = (invoice: BillingInvoice) => {
    // Generate text/csv receipt for immediate download
    const receiptContent = `THREADWELL FAMILY CAREGIVING — RECEIPT
===============================================
Invoice Number: ${invoice.invoiceNumber}
Date of Issue:  ${invoice.date}
Payment Status: ${invoice.status.toUpperCase()}
Amount Billed:  $${invoice.amount.toFixed(2)} USD

Recipient:      Eleanor Vance Care Circle
Billed To:      ${paymentMethod.cardholderName}
Payment Method: ${paymentMethod.brand} ending in •••• ${paymentMethod.last4}
Current Plan:   ${billingPlan.name} ($${billingPlan.price}/mo)

Security:       PCI-DSS Level 1 Compliant • TLS 1.3
Regulatory:     HIPAA §164.312 Compliant Audit Trail
===============================================
Thank you for supporting Eleanor's care team.
`;
    const blob = new Blob([receiptContent], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `receipt-${invoice.invoiceNumber}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    logAuditEntry(
      `Downloaded receipt for invoice #${invoice.invoiceNumber}`,
      'Billing / Invoices',
      'ADMIN'
    );
    showToast(`Receipt for ${invoice.invoiceNumber} downloaded.`);
  };

  return (
    <div id="family-plan-page" className="mx-auto max-w-6xl space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          className="fixed bottom-6 right-6 z-50 flex items-center space-x-3 rounded-2xl border border-teal-200 bg-white p-4 text-sm font-semibold text-[#0F766E] shadow-xl dark:border-teal-800 dark:bg-gray-800 dark:text-[#2DD4BF] transition-all"
        >
          <CheckCircle2 className="h-5 w-5 text-[#0F766E] dark:text-[#2DD4BF] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-[#E2E8F0] bg-white p-6 sm:p-7 shadow-xs dark:border-gray-700 dark:bg-gray-800">
        <div>
          <div className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5 text-[#0F766E] dark:text-[#2DD4BF]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#0F766E] dark:text-[#2DD4BF]">
              Subscription & Caregiver Seats
            </span>
          </div>
          <h1 className="mt-1.5 text-2xl sm:text-3xl font-bold font-inter text-[#1F2937] dark:text-white">
            Family Care Plan & Billing
          </h1>
          <p className="mt-1 text-sm text-[#4B5563] dark:text-gray-300 max-w-2xl">
            Manage your family circle subscription, active caregiver limits, payment details, and tax-ready caregiving expense receipts.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            id="change-plan-header-btn"
            onClick={() => setIsChangePlanOpen(true)}
            className="touch-target flex items-center justify-center rounded-2xl bg-[#0F766E] px-5 py-3 text-sm font-bold text-white shadow-md hover:bg-[#0c5f59] transition-all focus-visible:ring-4 focus-visible:ring-[#CCFBF1] dark:bg-[#0F766E] dark:hover:bg-[#134E4A]"
          >
            <span>Change Plan</span>
          </button>
        </div>
      </div>

      {/* Current Plan Card & Usage Bento */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Plan Card (2 cols) */}
        <div className="lg:col-span-2 rounded-3xl border border-[#E2E8F0] bg-white p-6 sm:p-7 shadow-xs dark:border-gray-700 dark:bg-gray-800 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#0F766E] dark:text-[#2DD4BF]">
                  Current Plan
                </span>
                <h2 className="text-xl sm:text-2xl font-bold font-inter text-[#1F2937] dark:text-white">
                  {billingPlan.name}
                </h2>
              </div>

              <span className="inline-flex items-center space-x-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800">
                <CheckCircle2 className="h-4 w-4" />
                <span>Active Subscription</span>
              </span>
            </div>

            <div className="mt-5 flex items-baseline space-x-2">
              <span className="text-3xl sm:text-4xl font-extrabold font-inter text-[#1F2937] dark:text-white">
                ${billingPlan.price}
              </span>
              <span className="text-sm font-semibold text-[#4B5563] dark:text-gray-400">
                / month (billed monthly)
              </span>
            </div>

            <p className="mt-2 text-xs sm:text-sm text-[#4B5563] dark:text-gray-300">
              Next scheduled charge of <strong>${billingPlan.price}.00</strong> will process on{' '}
              <strong>{billingPlan.nextBillingDate}</strong> using your card on file.
            </p>

            {/* Member Usage Progress Bar */}
            <div className="mt-6 rounded-2xl border border-[#E2E8F0] bg-[#FAF8F5] p-4 sm:p-5 dark:border-gray-700 dark:bg-gray-900/40">
              <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
                <span className="text-[#1F2937] dark:text-white flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-[#0F766E] dark:text-[#2DD4BF]" />
                  Circle Member Usage
                </span>
                <span className="text-[#0F766E] dark:text-[#2DD4BF]">
                  {activeMembersCount} of {billingPlan.memberLimit} seats used
                </span>
              </div>

              <div className="mt-2.5 h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className="h-full rounded-full bg-[#0F766E] transition-all duration-500"
                  style={{ width: `${usagePercentage}%` }}
                />
              </div>

              <div className="mt-2 flex items-center justify-between text-[11px] text-[#4B5563] dark:text-gray-400">
                <span>
                  {billingPlan.memberLimit - activeMembersCount > 0
                    ? `${billingPlan.memberLimit - activeMembersCount} seats remaining for siblings or visiting aides`
                    : 'Seat limit reached'}
                </span>
                <span>{usagePercentage}% Capacity</span>
              </div>
            </div>

            {/* Included Plan Perks */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#4B5563] dark:text-gray-300">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-[#0F766E] dark:text-[#2DD4BF] shrink-0" />
                <span>Unlimited PHI Vault (AES-256)</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-[#0F766E] dark:text-[#2DD4BF] shrink-0" />
                <span>Real-Time Shift Hand-offs</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-[#0F766E] dark:text-[#2DD4BF] shrink-0" />
                <span>7-Year HIPAA Audit Retention</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-[#0F766E] dark:text-[#2DD4BF] shrink-0" />
                <span>Voice-First Senior Mode Interface</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <span className="text-xs text-[#4B5563] dark:text-gray-400">
              Need to add more than {billingPlan.memberLimit} circle members?
            </span>
            <button
              onClick={() => setIsChangePlanOpen(true)}
              className="touch-target text-xs font-bold text-[#0F766E] hover:underline dark:text-[#2DD4BF] flex items-center gap-1"
            >
              Upgrade / Downgrade Plan
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Payment Method Card (1 col) */}
        <div className="rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-xs dark:border-gray-700 dark:bg-gray-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5 text-[#0F766E] dark:text-[#2DD4BF]" />
                <h2 className="text-base font-bold font-inter text-[#1F2937] dark:text-white">
                  Payment Method
                </h2>
              </div>
              <button
                onClick={() => setIsUpdateCardOpen(true)}
                className="touch-target rounded-xl border border-[#E2E8F0] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#0F766E] hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-[#2DD4BF] flex items-center gap-1"
                aria-label="Update payment card details"
              >
                <Edit2 className="h-3.5 w-3.5" />
                <span>Update Card</span>
              </button>
            </div>

            {/* Visual Credit Card Preview */}
            <div className="rounded-2xl border border-teal-800/40 bg-gradient-to-br from-[#0F766E] to-[#134E4A] p-5 text-white shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold tracking-wider uppercase opacity-80">
                  Caregiver Card
                </span>
                <span className="font-extrabold text-sm tracking-wider font-mono">
                  {paymentMethod.brand}
                </span>
              </div>

              <div className="mt-5 font-mono text-base tracking-widest text-white/90">
                •••• •••• •••• {paymentMethod.last4}
              </div>

              <div className="mt-4 flex items-center justify-between text-[11px] text-white/80">
                <div>
                  <span className="block text-[9px] uppercase opacity-70">Cardholder</span>
                  <span className="font-semibold">{paymentMethod.cardholderName}</span>
                </div>
                <div className="text-right">
                  <span className="block text-[9px] uppercase opacity-70">Expires</span>
                  <span className="font-semibold">
                    {paymentMethod.expMonth}/{paymentMethod.expYear}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-gray-100 bg-[#FAF8F5] p-3 text-xs text-[#4B5563] dark:border-gray-700 dark:bg-gray-900/50 dark:text-gray-300 flex items-start space-x-2">
              <ShieldCheck className="h-4 w-4 text-[#0F766E] dark:text-[#2DD4BF] shrink-0 mt-0.5" />
              <span>
                Card data is securely tokenized via Stripe. Threadwell servers never store full card numbers or security CVVs.
              </span>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-gray-100 dark:border-gray-700/60">
            <button
              onClick={() => setIsUpdateCardOpen(true)}
              className="touch-target w-full rounded-2xl border border-[#E2E8F0] bg-white py-2.5 text-xs font-bold text-[#1F2937] hover:border-[#0F766E] hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 transition-colors"
            >
              Add or Replace Card
            </button>
          </div>
        </div>
      </div>

      {/* Invoice History Section */}
      <div className="rounded-3xl border border-[#E2E8F0] bg-white shadow-xs dark:border-gray-700 dark:bg-gray-800 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold font-inter text-[#1F2937] dark:text-white flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#0F766E] dark:text-[#2DD4BF]" />
              Invoice & Payment History
            </h2>
            <p className="mt-1 text-xs text-[#4B5563] dark:text-gray-300">
              Download itemized receipts for tax deductions, HSA/FSA caregiving reimbursement, or estate accounting.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-50 text-[#0F766E] border border-teal-200 dark:bg-teal-950/40 dark:text-[#2DD4BF] dark:border-teal-800 shrink-0">
            All Invoices Paid
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] border-b border-[#E2E8F0] dark:bg-gray-900/60 dark:border-gray-700">
              <tr>
                <th className="py-3.5 px-6 font-bold uppercase tracking-wider text-[#4B5563] dark:text-gray-300">
                  Invoice Date
                </th>
                <th className="py-3.5 px-6 font-bold uppercase tracking-wider text-[#4B5563] dark:text-gray-300">
                  Invoice Number
                </th>
                <th className="py-3.5 px-6 font-bold uppercase tracking-wider text-[#4B5563] dark:text-gray-300">
                  Amount
                </th>
                <th className="py-3.5 px-6 font-bold uppercase tracking-wider text-[#4B5563] dark:text-gray-300">
                  Status
                </th>
                <th className="py-3.5 px-6 font-bold uppercase tracking-wider text-[#4B5563] dark:text-gray-300 text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] dark:divide-gray-700 font-sans">
              {invoices.map((inv) => (
                <tr
                  key={inv.id}
                  className="hover:bg-gray-50/80 dark:hover:bg-gray-700/40 transition-colors"
                >
                  <td className="py-4 px-6 font-medium text-[#1F2937] dark:text-white whitespace-nowrap">
                    {inv.date}
                  </td>
                  <td className="py-4 px-6 font-mono text-[11px] text-[#4B5563] dark:text-gray-300 whitespace-nowrap">
                    {inv.invoiceNumber}
                  </td>
                  <td className="py-4 px-6 font-bold text-[#1F2937] dark:text-white whitespace-nowrap">
                    ${inv.amount.toFixed(2)} USD
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <span className="inline-flex items-center space-x-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>Paid</span>
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right whitespace-nowrap">
                    <button
                      onClick={() => handleDownloadInvoice(inv)}
                      className="touch-target inline-flex items-center space-x-1.5 rounded-xl border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs font-bold text-[#0F766E] hover:bg-gray-50 hover:border-[#0F766E] dark:border-gray-700 dark:bg-gray-900 dark:text-[#2DD4BF]"
                      aria-label={`Download invoice ${inv.invoiceNumber}`}
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Download Receipt</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upgrade / Downgrade Plan Modal */}
      {isChangePlanOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="plan-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto"
        >
          <div className="relative w-full max-w-4xl rounded-3xl border border-[#E2E8F0] bg-white p-6 sm:p-8 shadow-2xl dark:border-gray-700 dark:bg-gray-900 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
              <div>
                <h2 id="plan-modal-title" className="text-xl sm:text-2xl font-bold font-inter text-[#1F2937] dark:text-white">
                  Choose Your Family Plan
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-[#4B5563] dark:text-gray-300">
                  Switch anytime. Upgrades apply immediately; downgrades take effect at the end of the current billing period.
                </p>
              </div>
              <button
                onClick={() => setIsChangePlanOpen(false)}
                className="touch-target rounded-full p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Close plan selection modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
              {availablePlans.map((plan) => {
                const isCurrent = plan.id === billingPlan.id;

                return (
                  <div
                    key={plan.id}
                    className={`relative rounded-3xl border p-6 flex flex-col justify-between transition-all ${
                      isCurrent
                        ? 'border-[#0F766E] bg-teal-50/40 ring-2 ring-[#0F766E] dark:border-teal-500 dark:bg-teal-950/30'
                        : 'border-[#E2E8F0] bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800'
                    }`}
                  >
                    {plan.recommended && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#0F766E] px-3 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider shadow-sm">
                        Most Popular for Families
                      </span>
                    )}

                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-bold font-inter text-[#1F2937] dark:text-white">
                          {plan.name}
                        </h3>
                        {isCurrent && (
                          <span className="rounded-full bg-[#0F766E] px-2 py-0.5 text-[10px] font-bold text-white">
                            Current
                          </span>
                        )}
                      </div>

                      <div className="mt-3 flex items-baseline space-x-1">
                        <span className="text-3xl font-extrabold font-inter text-[#1F2937] dark:text-white">
                          ${plan.price}
                        </span>
                        <span className="text-xs text-[#4B5563] dark:text-gray-400">
                          {plan.period}
                        </span>
                      </div>

                      <p className="mt-2.5 text-xs text-[#4B5563] dark:text-gray-300">
                        {plan.description}
                      </p>

                      <div className="mt-5 space-y-2 border-t border-gray-100 dark:border-gray-700 pt-4 text-xs text-[#1F2937] dark:text-gray-200">
                        {plan.features.map((feat, i) => (
                          <div key={i} className="flex items-start space-x-2">
                            <CheckCircle2 className="h-4 w-4 text-[#0F766E] dark:text-[#2DD4BF] shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 pt-4">
                      <button
                        onClick={() => handleSelectPlan(plan.id)}
                        disabled={isCurrent}
                        className={`touch-target w-full rounded-2xl py-2.5 text-xs font-bold transition-all ${
                          isCurrent
                            ? 'bg-gray-100 text-gray-400 cursor-default dark:bg-gray-700 dark:text-gray-500'
                            : 'bg-[#0F766E] text-white shadow-sm hover:bg-[#0c5f59] dark:bg-[#0F766E] dark:hover:bg-[#134E4A]'
                        }`}
                      >
                        {isCurrent ? 'Current Active Plan' : `Switch to ${plan.name}`}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Update Card Modal */}
      {isUpdateCardOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="card-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4"
        >
          <div className="relative w-full max-w-md rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-2xl dark:border-gray-700 dark:bg-gray-900">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5 text-[#0F766E] dark:text-[#2DD4BF]" />
                <h2 id="card-modal-title" className="text-lg font-bold font-inter text-[#1F2937] dark:text-white">
                  Update Payment Card
                </h2>
              </div>
              <button
                onClick={() => setIsUpdateCardOpen(false)}
                className="touch-target rounded-full p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSavePaymentMethod} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4B5563] dark:text-gray-300">
                  Cardholder Name *
                </label>
                <input
                  type="text"
                  required
                  value={cardholderName}
                  onChange={(e) => setCardholderName(e.target.value)}
                  placeholder="Sarah Vance"
                  className="mt-1.5 w-full rounded-2xl border border-[#E2E8F0] px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:border-[#0F766E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4B5563] dark:text-gray-300">
                  Card Number *
                </label>
                <input
                  type="text"
                  required
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="4242 4242 4242 4242"
                  className="mt-1.5 w-full rounded-2xl border border-[#E2E8F0] px-4 py-2.5 text-sm font-mono dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:border-[#0F766E]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4B5563] dark:text-gray-300">
                    Month *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={2}
                    value={expMonth}
                    onChange={(e) => setExpMonth(e.target.value)}
                    placeholder="08"
                    className="mt-1.5 w-full rounded-2xl border border-[#E2E8F0] px-3 py-2 text-sm text-center font-mono dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4B5563] dark:text-gray-300">
                    Year *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    value={expYear}
                    onChange={(e) => setExpYear(e.target.value)}
                    placeholder="28"
                    className="mt-1.5 w-full rounded-2xl border border-[#E2E8F0] px-3 py-2 text-sm text-center font-mono dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4B5563] dark:text-gray-300">
                    CVC *
                  </label>
                  <input
                    type="password"
                    required
                    maxLength={4}
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                    placeholder="•••"
                    className="mt-1.5 w-full rounded-2xl border border-[#E2E8F0] px-3 py-2 text-sm text-center font-mono dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4B5563] dark:text-gray-300">
                  Billing Postal Code
                </label>
                <input
                  type="text"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  placeholder="01742"
                  className="mt-1.5 w-full rounded-2xl border border-[#E2E8F0] px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div className="rounded-xl bg-gray-50 dark:bg-gray-800/80 p-3 text-[11px] text-[#4B5563] dark:text-gray-300 flex items-center space-x-2">
                <Lock className="h-3.5 w-3.5 text-[#0F766E] dark:text-[#2DD4BF] shrink-0" />
                <span>PCI-DSS Level 1 Encrypted via 256-bit TLS connection.</span>
              </div>

              <div className="mt-5 flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUpdateCardOpen(false)}
                  className="touch-target rounded-2xl px-4 py-2 text-xs font-semibold text-[#4B5563] hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="touch-target rounded-2xl bg-[#0F766E] px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#0c5f59]"
                >
                  Save Payment Method
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
