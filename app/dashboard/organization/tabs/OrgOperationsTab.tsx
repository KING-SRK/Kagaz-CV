// app/dashboard/organization/tabs/OrgOperationsTab.tsx
"use client";

import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Truck,
  ShoppingBag,
  CreditCard,
  Headphones,
  MapPin,
  CalendarOff,
} from "lucide-react";
import { OrgOperations } from "@/lib/organizationService";
import { FormInput, FormSelectWithOther } from "@/components/ui/FormFields";
import {
  OPENING_DAYS_OPTIONS,
  BUSINESS_STATUS_OPTIONS,
  CUSTOMER_SERVICE_OPTIONS,
  PAYMENT_METHOD_OPTIONS,
  formatOtherDisplay,
} from "@/constants/orgOptions";

interface Props {
  isEditing: boolean;
  operations: OrgOperations;
  onChange: (updated: OrgOperations) => void;
}

const formatTime12Hr = (time24?: string) => {
  if (!time24) return "Not Set";
  const [hourStr, minStr] = time24.split(":");
  const hour = parseInt(hourStr, 10);
  if (isNaN(hour)) return time24;
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12.toString().padStart(2, "0")}:${minStr || "00"} ${ampm}`;
};

export default function OrgOperationsTab({
  isEditing,
  operations,
  onChange,
}: Props) {
  const ops: OrgOperations = {
    openingDays: operations?.openingDays || "",
    openingTime: operations?.openingTime || "",
    closingTime: operations?.closingTime || "",
    status: operations?.status || "Open",
    customerService: operations?.customerService || "Available",
    homeDelivery: Boolean(operations?.homeDelivery),
    onlineOrders: Boolean(operations?.onlineOrders),
    paymentMethods: operations?.paymentMethods || [],
    serviceArea: operations?.serviceArea || "",
    holidaySchedule: operations?.holidaySchedule || "",
    temporaryClosureNote: operations?.temporaryClosureNote || "",
  };

  const updateField = <K extends keyof OrgOperations>(
    field: K,
    value: OrgOperations[K],
  ) => {
    onChange({
      ...ops,
      [field]: value,
    });
  };

  const togglePaymentMethod = (method: string) => {
    const exists = ops.paymentMethods.includes(method);
    const updated = exists
      ? ops.paymentMethods.filter((m) => m !== method)
      : [...ops.paymentMethods, method];
    updateField("paymentMethods", updated);
  };

  // ==================== VIEW MODE ====================
  if (!isEditing) {
    const openingDaysLabel = formatOtherDisplay(ops.openingDays);

    return (
      <div className="space-y-4 sm:space-y-5 animate-in fade-in-50 duration-200">
        {/* হেডার ও লাইভ বিজনেস স্ট্যাটাস */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-[11px] sm:text-xs font-mono uppercase font-bold text-neutral-700 flex items-center gap-1.5 min-w-0">
            <Clock className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">Business Operations & Availability</span>
          </span>

          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] sm:text-[10.5px] font-mono uppercase rounded-xs border shrink-0 ${
              ops.status === "Open"
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : ops.status === "Temporarily Closed"
                  ? "bg-amber-50 text-amber-700 border-amber-200"
                  : "bg-red-50 text-red-700 border-red-200"
            }`}
          >
            {ops.status === "Open" ? (
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
            ) : ops.status === "Temporarily Closed" ? (
              <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
            ) : (
              <XCircle className="h-3.5 w-3.5 shrink-0" />
            )}
            <span>{ops.status}</span>
          </span>
        </div>

        {/* সাময়িক বন্ধ বা বিশেষ নোটিশ */}
        {ops.temporaryClosureNote && (
          <div className="p-3 sm:p-3.5 bg-amber-50/80 border border-amber-200 rounded-xs flex items-start gap-2.5 text-xs text-amber-950">
            <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <span className="font-mono text-[10px] uppercase font-bold text-amber-700 block">
                Operational / Closure Notice
              </span>
              <p className="mt-0.5 leading-relaxed wrap-break-word">
                {ops.temporaryClosureNote}
              </p>
            </div>
          </div>
        )}

        {/* ১. সময়সূচি ও কাস্টমার সার্ভিস কার্ড */}
        <div className="p-3 sm:p-4 bg-neutral-50/60 border border-neutral-200 rounded-xs space-y-3 sm:space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2.5 text-xs font-mono">
            <div className="p-2.5 bg-white border border-neutral-200/80 rounded-xs min-w-0">
              <span className="text-[9.5px] uppercase text-neutral-400 block mb-0.5">
                Opening Days
              </span>
              <p
                className={`font-medium truncate ${
                  openingDaysLabel ? "text-neutral-900" : "text-neutral-400"
                }`}
              >
                {openingDaysLabel || "Not Set"}
              </p>
            </div>

            <div className="p-2.5 bg-white border border-neutral-200/80 rounded-xs min-w-0">
              <span className="text-[9.5px] uppercase text-neutral-400 block mb-0.5">
                Opening Time
              </span>
              <p
                className={`font-medium truncate ${
                  ops.openingTime ? "text-neutral-900" : "text-neutral-400"
                }`}
              >
                {formatTime12Hr(ops.openingTime)}
              </p>
            </div>

            <div className="p-2.5 bg-white border border-neutral-200/80 rounded-xs min-w-0">
              <span className="text-[9.5px] uppercase text-neutral-400 block mb-0.5">
                Closing Time
              </span>
              <p
                className={`font-medium truncate ${
                  ops.closingTime ? "text-neutral-900" : "text-neutral-400"
                }`}
              >
                {formatTime12Hr(ops.closingTime)}
              </p>
            </div>

            <div className="p-2.5 bg-white border border-neutral-200/80 rounded-xs min-w-0">
              <span className="text-[9.5px] uppercase text-neutral-400 flex items-center gap-1 mb-0.5">
                <Headphones className="h-3 w-3 shrink-0" /> Customer Service
              </span>
              <p className="font-medium text-neutral-900 truncate">
                {ops.customerService || "Available"}
              </p>
            </div>
          </div>

          {/* ২. ডেলিভারি, অনলাইন অর্ডার ও সার্ভিস এরিয়া */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2.5 text-xs font-mono">
            <div className="p-2.5 bg-white border border-neutral-200/80 rounded-xs min-w-0">
              <span className="text-[9.5px] uppercase text-neutral-400 flex items-center gap-1 mb-0.5">
                <Truck className="h-3 w-3 shrink-0" /> Home Delivery
              </span>
              <p
                className={`font-medium ${
                  ops.homeDelivery ? "text-emerald-700" : "text-neutral-600"
                }`}
              >
                {ops.homeDelivery ? "Yes (Available)" : "No"}
              </p>
            </div>

            <div className="p-2.5 bg-white border border-neutral-200/80 rounded-xs min-w-0">
              <span className="text-[9.5px] uppercase text-neutral-400 flex items-center gap-1 mb-0.5">
                <ShoppingBag className="h-3 w-3 shrink-0" /> Online Orders
              </span>
              <p
                className={`font-medium ${
                  ops.onlineOrders ? "text-emerald-700" : "text-neutral-600"
                }`}
              >
                {ops.onlineOrders ? "Yes (Accepted)" : "No"}
              </p>
            </div>

            <div className="p-2.5 bg-white border border-neutral-200/80 rounded-xs min-w-0">
              <span className="text-[9.5px] uppercase text-neutral-400 flex items-center gap-1 mb-0.5">
                <MapPin className="h-3 w-3 shrink-0" /> Service Area
              </span>
              <p
                className={`font-medium truncate ${
                  ops.serviceArea ? "text-neutral-900" : "text-neutral-400"
                }`}
              >
                {ops.serviceArea || "Not Set"}
              </p>
            </div>
          </div>

          {/* ৩. Accepted Payment Methods */}
          <div className="p-2.5 sm:p-3 bg-white border border-neutral-200/80 rounded-xs space-y-1.5">
            <span className="text-[9.5px] font-mono uppercase text-neutral-400 flex items-center gap-1">
              <CreditCard className="h-3 w-3 shrink-0" /> Accepted Payment
              Methods
            </span>
            {ops.paymentMethods.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {ops.paymentMethods.map((method) => (
                  <span
                    key={method}
                    className="px-2.5 py-0.5 bg-neutral-100 border border-neutral-200 text-[10.5px] font-mono text-neutral-800 rounded-xs"
                  >
                    {method}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs font-mono text-neutral-400">Not Set</p>
            )}
          </div>

          {/* ৪. Holiday Schedule */}
          <div className="p-2.5 bg-white border border-neutral-200/80 rounded-xs text-xs font-mono">
            <span className="text-[9.5px] uppercase text-neutral-400 flex items-center gap-1 mb-0.5">
              <CalendarOff className="h-3 w-3 shrink-0" /> Holiday & Weekly Off
              Schedule
            </span>
            <p
              className={`wrap-break-word ${
                ops.holidaySchedule ? "text-neutral-800" : "text-neutral-400"
              }`}
            >
              {ops.holidaySchedule || "Not Set"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ==================== EDIT MODE ====================
  return (
    <div className="space-y-4 sm:space-y-5 animate-in fade-in-50 duration-200">
      <div>
        <span className="text-xs font-mono uppercase font-bold text-neutral-800 block">
          Business Operations, Timings & Services
        </span>
        <span className="text-[11px] font-sans text-neutral-500">
          Help customers know when you are open, delivery availability, and
          supported payment modes.
        </span>
      </div>

      <div className="p-3 sm:p-4 bg-neutral-50/60 border border-neutral-200 rounded-xs space-y-4">
        {/* রো ১: Business Status, Opening Days, Opening Time, Closing Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-start">
          <div>
            <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
              Business Status
            </label>
            <select
              value={ops.status}
              onChange={(e) =>
                updateField("status", e.target.value as OrgOperations["status"])
              }
              className="w-full border border-neutral-200 bg-white px-3 py-2 text-xs font-mono outline-none focus:border-neutral-950 rounded-xs cursor-pointer"
            >
              {BUSINESS_STATUS_OPTIONS.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <FormSelectWithOther
            label="Opening Days"
            value={ops.openingDays}
            options={OPENING_DAYS_OPTIONS}
            placeholder="Select opening days"
            otherPlaceholder="Enter custom opening days"
            onChange={(val) => updateField("openingDays", val)}
          />

          <FormInput
            label="Opening Time"
            type="time"
            value={ops.openingTime}
            onChange={(val) => updateField("openingTime", val)}
          />

          <FormInput
            label="Closing Time"
            type="time"
            value={ops.closingTime}
            onChange={(val) => updateField("closingTime", val)}
          />
        </div>

        {/* রো ২: Customer Service, Home Delivery, Online Orders */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
              Customer Service
            </label>
            <select
              value={ops.customerService || "Available"}
              onChange={(e) => updateField("customerService", e.target.value)}
              className="w-full border border-neutral-200 bg-white px-3 py-2 text-xs font-mono outline-none focus:border-neutral-950 rounded-xs cursor-pointer"
            >
              {CUSTOMER_SERVICE_OPTIONS.map((cs) => (
                <option key={cs} value={cs}>
                  {cs}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
              Home Delivery
            </label>
            <select
              value={ops.homeDelivery ? "Yes" : "No"}
              onChange={(e) =>
                updateField("homeDelivery", e.target.value === "Yes")
              }
              className="w-full border border-neutral-200 bg-white px-3 py-2 text-xs font-mono outline-none focus:border-neutral-950 rounded-xs cursor-pointer"
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
              Online Orders
            </label>
            <select
              value={ops.onlineOrders ? "Yes" : "No"}
              onChange={(e) =>
                updateField("onlineOrders", e.target.value === "Yes")
              }
              className="w-full border border-neutral-200 bg-white px-3 py-2 text-xs font-mono outline-none focus:border-neutral-950 rounded-xs cursor-pointer"
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>
        </div>

        {/* রো ৩: Payment Methods */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-mono uppercase text-neutral-500">
            Accepted Payment Methods (Click to toggle)
          </label>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {PAYMENT_METHOD_OPTIONS.map((method) => {
              const isSelected = ops.paymentMethods.includes(method);
              return (
                <button
                  key={method}
                  type="button"
                  onClick={() => togglePaymentMethod(method)}
                  className={`px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-mono rounded-xs border transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-neutral-950 text-white border-neutral-950"
                      : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400"
                  }`}
                >
                  {isSelected ? `✓ ${method}` : method}
                </button>
              );
            })}
          </div>
        </div>

        {/* রো ৪: Service Area & Holiday Schedule */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormInput
            label="Service Area (Local areas served)"
            value={ops.serviceArea}
            onChange={(val) => updateField("serviceArea", val)}
            placeholder="Enter local areas or cities served"
          />

          <FormInput
            label="Holiday & Weekly Off Schedule (Optional)"
            value={ops.holidaySchedule || ""}
            onChange={(val) => updateField("holidaySchedule", val)}
            placeholder="Enter weekly off days or holiday schedule"
          />
        </div>

        {/* রো ৫: Temporary Closure / Special Notice */}
        <div>
          <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
            Temporary Closure or Special Operational Note (Optional)
          </label>
          <textarea
            rows={2}
            value={ops.temporaryClosureNote || ""}
            onChange={(e) =>
              updateField("temporaryClosureNote", e.target.value)
            }
            placeholder="Enter any temporary closure dates or special timing notice"
            className="w-full border border-neutral-200 bg-white p-2.5 text-xs font-mono outline-none focus:border-neutral-950 resize-none rounded-xs"
          />
        </div>
      </div>
    </div>
  );
}
