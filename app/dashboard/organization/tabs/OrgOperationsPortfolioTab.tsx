// app/dashboard/organization/tabs/OrgOperationsPortfolioTab.tsx
"use client";

import {
  Clock,
  FolderKanban,
  Award,
  Plus,
  Trash2,
  ExternalLink,
  CreditCard,
  Truck,
} from "lucide-react";
import { OrgOperations } from "@/lib/organizationService";

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  description: string;
  url: string;
}

interface AchievementItem {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
}

interface Props {
  isEditing: boolean;
  operations: OrgOperations;
  portfolio: PortfolioItem[];
  achievements: AchievementItem[];
  onChange: (updated: {
    operations?: OrgOperations;
    portfolio?: PortfolioItem[];
    achievements?: AchievementItem[];
  }) => void;
}

const PAYMENT_OPTIONS = [
  "Cash",
  "UPI / QR",
  "Debit/Credit Card",
  "Bank Transfer / NEFT",
];

export default function OrgOperationsPortfolioTab({
  isEditing,
  operations,
  portfolio = [],
  achievements = [],
  onChange,
}: Props) {
  const ops: OrgOperations = operations || {
    openingDays: "Monday - Saturday",
    openingTime: "10:00",
    closingTime: "20:00",
    status: "Open",
    homeDelivery: false,
    onlineOrders: false,
    paymentMethods: ["UPI / QR", "Cash"],
    serviceArea: "",
  };

  // --- Operations Handlers ---
  const updateOps = <K extends keyof OrgOperations>(
    field: K,
    val: OrgOperations[K],
  ) => {
    onChange({
      operations: { ...ops, [field]: val },
    });
  };

  const togglePaymentMethod = (method: string) => {
    const current = ops.paymentMethods || [];
    const updated = current.includes(method)
      ? current.filter((m) => m !== method)
      : [...current, method];
    updateOps("paymentMethods", updated);
  };

  // --- Portfolio Handlers ---
  const addPortfolio = () => {
    onChange({
      portfolio: [
        ...portfolio,
        {
          id: Date.now().toString(),
          title: "",
          category: "",
          description: "",
          url: "",
        },
      ],
    });
  };

  const updatePortfolio = (
    id: string,
    field: keyof PortfolioItem,
    val: string,
  ) => {
    onChange({
      portfolio: portfolio.map((p) =>
        p.id === id ? { ...p, [field]: val } : p,
      ),
    });
  };

  const removePortfolio = (id: string) => {
    onChange({ portfolio: portfolio.filter((p) => p.id !== id) });
  };

  // --- Achievement Handlers ---
  const addAchievement = () => {
    onChange({
      achievements: [
        ...achievements,
        {
          id: Date.now().toString(),
          title: "",
          issuer: "",
          date: "",
          description: "",
        },
      ],
    });
  };

  const updateAchievement = (
    id: string,
    field: keyof AchievementItem,
    val: string,
  ) => {
    onChange({
      achievements: achievements.map((a) =>
        a.id === id ? { ...a, [field]: val } : a,
      ),
    });
  };

  const removeAchievement = (id: string) => {
    onChange({ achievements: achievements.filter((a) => a.id !== id) });
  };

  // ==================== VIEW MODE ====================
  if (!isEditing) {
    return (
      <div className="space-y-6">
        {/* ১. বিজনেস অপারেশন ও সময়সূচী */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono uppercase font-bold text-neutral-500 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-emerald-600" /> Business
              Operations & Hours
            </h3>
            <span
              className={`px-2 py-0.5 text-[10px] font-mono uppercase rounded-xs border ${
                ops.status === "Open"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-red-50 text-red-600 border-red-200"
              }`}
            >
              {ops.status}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-mono">
            <div className="p-3 bg-neutral-50/70 border border-neutral-200/80 rounded-xs">
              <span className="text-[9.5px] uppercase text-neutral-400 block">
                Working Days
              </span>
              <p className="font-semibold text-neutral-900 mt-0.5">
                {ops.openingDays || "Monday - Saturday"}
              </p>
            </div>

            <div className="p-3 bg-neutral-50/70 border border-neutral-200/80 rounded-xs">
              <span className="text-[9.5px] uppercase text-neutral-400 block">
                Timings
              </span>
              <p className="font-semibold text-neutral-900 mt-0.5">
                {ops.openingTime || "10:00"} — {ops.closingTime || "20:00"}
              </p>
            </div>

            <div className="p-3 bg-neutral-50/70 border border-neutral-200/80 rounded-xs">
              <span className="text-[9.5px] uppercase text-neutral-400 block">
                Service Area
              </span>
              <p className="font-semibold text-neutral-900 mt-0.5 truncate">
                {ops.serviceArea || "Local & Online"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-mono">
            {ops.homeDelivery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-xs">
                <Truck className="h-3 w-3" /> Home Delivery Available
              </span>
            )}
            {ops.onlineOrders && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-xs">
                🌐 Online Orders Accepted
              </span>
            )}
            {(ops.paymentMethods || []).map((pm) => (
              <span
                key={pm}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-neutral-200 text-neutral-700 rounded-xs"
              >
                <CreditCard className="h-3 w-3 text-neutral-400" /> {pm}
              </span>
            ))}
          </div>
        </div>

        {/* ২. কোম্পানি পোর্টফোলিও / প্রজেক্টস */}
        <div className="space-y-3 border-t border-neutral-100 pt-5">
          <h3 className="text-xs font-mono uppercase font-bold text-neutral-500 flex items-center gap-1.5">
            <FolderKanban className="h-3.5 w-3.5 text-blue-600" /> Work
            Portfolio & Case Studies ({portfolio.length})
          </h3>

          {portfolio.length === 0 ? (
            <p className="text-xs font-mono text-neutral-400 italic">
              No portfolio projects showcased yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {portfolio.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 bg-neutral-50/70 border border-neutral-200/80 rounded-xs space-y-1.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-neutral-400 block">
                        {item.category || "Project"}
                      </span>
                      <h4 className="text-sm font-serif font-bold text-neutral-950">
                        {item.title}
                      </h4>
                    </div>
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1 bg-white border border-neutral-200 rounded-xs text-neutral-600 hover:text-neutral-950"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                  {item.description && (
                    <p className="text-xs text-neutral-600 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ৩. কোম্পানির অ্যাওয়ার্ড ও সার্টিফিকেশন */}
        <div className="space-y-3 border-t border-neutral-100 pt-5">
          <h3 className="text-xs font-mono uppercase font-bold text-neutral-500 flex items-center gap-1.5">
            <Award className="h-3.5 w-3.5 text-amber-500" /> Certifications &
            Awards ({achievements.length})
          </h3>

          {achievements.length === 0 ? (
            <p className="text-xs font-mono text-neutral-400 italic">
              No awards or certifications added yet.
            </p>
          ) : (
            <div className="space-y-2">
              {achievements.map((ach) => (
                <div
                  key={ach.id}
                  className="p-3 bg-neutral-50/70 border border-neutral-200/80 rounded-xs"
                >
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-neutral-900">
                      {ach.title}
                    </span>
                    <span className="font-mono text-neutral-500">
                      {ach.date}
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-neutral-600">
                    {ach.issuer}
                  </p>
                  {ach.description && (
                    <p className="text-xs text-neutral-700 mt-1">
                      {ach.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==================== EDIT MODE ====================
  return (
    <div className="space-y-6">
      {/* ১. অপারেশন এডিট */}
      <div className="space-y-3">
        <span className="text-xs font-mono uppercase font-bold text-neutral-700 block">
          1. Business Hours & Operations
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
          <div>
            <label className="block text-[10px] font-mono uppercase text-neutral-500 mb-1">
              Current Status
            </label>
            <select
              value={ops.status}
              onChange={(e) =>
                updateOps("status", e.target.value as OrgOperations["status"])
              }
              className="w-full border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-mono"
            >
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
              <option value="Temporarily Closed">Temporarily Closed</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-neutral-500 mb-1">
              Opening Days
            </label>
            <input
              type="text"
              value={ops.openingDays}
              onChange={(e) => updateOps("openingDays", e.target.value)}
              placeholder="e.g. Mon - Sat"
              className="w-full border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-neutral-500 mb-1">
              Opening Time
            </label>
            <input
              type="time"
              value={ops.openingTime}
              onChange={(e) => updateOps("openingTime", e.target.value)}
              className="w-full border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-neutral-500 mb-1">
              Closing Time
            </label>
            <input
              type="time"
              value={ops.closingTime}
              onChange={(e) => updateOps("closingTime", e.target.value)}
              className="w-full border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div>
            <label className="block text-[10px] font-mono uppercase text-neutral-500 mb-1">
              Service Coverage Area
            </label>
            <input
              type="text"
              value={ops.serviceArea}
              onChange={(e) => updateOps("serviceArea", e.target.value)}
              placeholder="e.g. Kolkata, West Bengal / Pan India"
              className="w-full border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-mono"
            />
          </div>

          <div className="flex items-center gap-4 pt-4 text-xs font-mono text-neutral-700">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={ops.homeDelivery}
                onChange={(e) => updateOps("homeDelivery", e.target.checked)}
              />
              <span>Home Delivery</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={ops.onlineOrders}
                onChange={(e) => updateOps("onlineOrders", e.target.checked)}
              />
              <span>Online Orders</span>
            </label>
          </div>
        </div>

        <div className="pt-1">
          <span className="block text-[10px] font-mono uppercase text-neutral-500 mb-1.5">
            Accepted Payment Methods
          </span>
          <div className="flex flex-wrap gap-2">
            {PAYMENT_OPTIONS.map((pm) => {
              const active = (ops.paymentMethods || []).includes(pm);
              return (
                <button
                  key={pm}
                  type="button"
                  onClick={() => togglePaymentMethod(pm)}
                  className={`px-3 py-1 text-xs font-mono rounded-xs border cursor-pointer transition-colors ${
                    active
                      ? "bg-neutral-900 text-white border-neutral-900"
                      : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400"
                  }`}
                >
                  {pm}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ২. কোম্পানি পোর্টফোলিও এডিট */}
      <div className="space-y-3 border-t border-neutral-200 pt-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase font-bold text-neutral-700">
            2. Company Work Portfolio / Projects
          </span>
          <button
            type="button"
            onClick={addPortfolio}
            className="inline-flex items-center gap-1 bg-neutral-900 text-white px-3 py-1 text-[10.5px] font-mono uppercase rounded-xs cursor-pointer"
          >
            <Plus className="h-3 w-3" /> Add Project
          </button>
        </div>

        {portfolio.map((proj) => (
          <div
            key={proj.id}
            className="p-3 bg-neutral-50 border border-neutral-200 rounded-xs space-y-2"
          >
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => removePortfolio(proj.id)}
                className="text-red-500 cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="Project Name"
                value={proj.title}
                onChange={(e) =>
                  updatePortfolio(proj.id, "title", e.target.value)
                }
                className="border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-mono"
              />
              <input
                type="text"
                placeholder="Category (e.g. Web App)"
                value={proj.category}
                onChange={(e) =>
                  updatePortfolio(proj.id, "category", e.target.value)
                }
                className="border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-mono"
              />
              <input
                type="url"
                placeholder="Project URL (Optional)"
                value={proj.url}
                onChange={(e) =>
                  updatePortfolio(proj.id, "url", e.target.value)
                }
                className="border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-mono"
              />
            </div>
            <input
              type="text"
              placeholder="Short project description..."
              value={proj.description}
              onChange={(e) =>
                updatePortfolio(proj.id, "description", e.target.value)
              }
              className="w-full border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-mono"
            />
          </div>
        ))}
      </div>

      {/* ৩. সার্টিফিকেশন ও অ্যাওয়ার্ড এডিট */}
      <div className="space-y-3 border-t border-neutral-200 pt-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase font-bold text-neutral-700">
            3. Company Certifications & Awards
          </span>
          <button
            type="button"
            onClick={addAchievement}
            className="inline-flex items-center gap-1 bg-neutral-900 text-white px-3 py-1 text-[10.5px] font-mono uppercase rounded-xs cursor-pointer"
          >
            <Plus className="h-3 w-3" /> Add Award / Cert
          </button>
        </div>

        {achievements.map((ach) => (
          <div
            key={ach.id}
            className="p-3 bg-neutral-50 border border-neutral-200 rounded-xs space-y-2"
          >
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => removeAchievement(ach.id)}
                className="text-red-500 cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="Award / ISO Cert Name"
                value={ach.title}
                onChange={(e) =>
                  updateAchievement(ach.id, "title", e.target.value)
                }
                className="border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-mono"
              />
              <input
                type="text"
                placeholder="Issuing Organization"
                value={ach.issuer}
                onChange={(e) =>
                  updateAchievement(ach.id, "issuer", e.target.value)
                }
                className="border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-mono"
              />
              <input
                type="month"
                value={ach.date}
                onChange={(e) =>
                  updateAchievement(ach.id, "date", e.target.value)
                }
                className="border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-mono"
              />
            </div>
            <input
              type="text"
              placeholder="Short description..."
              value={ach.description}
              onChange={(e) =>
                updateAchievement(ach.id, "description", e.target.value)
              }
              className="w-full border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-mono"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
