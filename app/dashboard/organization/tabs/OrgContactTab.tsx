// app/dashboard/organization/tabs/OrgContactTab.tsx
"use client";

import { useEffect } from "react";
import { PhoneCall, Plus, Trash2, Eye, EyeOff, Globe } from "lucide-react";
import { OrgContactItem } from "@/lib/organizationService";
import { FormInput, FormSelectWithOther } from "@/components/ui/FormFields";
import { formatOtherDisplay } from "@/constants/orgOptions";

interface Props {
  isEditing: boolean;
  contacts: OrgContactItem[];
  website?: string;
  onChange: (updated: {
    contacts?: OrgContactItem[];
    website?: string;
  }) => void;
}

const CONTACT_DEPARTMENTS = [
  "General Enquiries",
  "Sales Department",
  "HR Department",
  "Customer Support",
  "Management / Founders",
  "Billing & Accounts",
  "Other",
];

const createDefaultContact = (): OrgContactItem => ({
  id: Date.now().toString(),
  department: "General Enquiries",
  personName: "",
  designation: "",
  phone: "",
  secondaryPhone: "",
  whatsapp: "",
  supportPhone: "",
  email: "",
  enquiryEmail: "",
  isPublic: true,
});

export default function OrgContactTab({
  isEditing,
  contacts = [],
  website = "",
  onChange,
}: Props) {
  useEffect(() => {
    if (isEditing && contacts.length === 0) {
      onChange({ contacts: [createDefaultContact()] });
    }
  }, [isEditing, contacts.length, onChange]);

  const addContact = () => {
    onChange({
      contacts: [...contacts, createDefaultContact()],
    });
  };

  const updateContact = (
    id: string,
    field: keyof OrgContactItem,
    val: string | boolean,
  ) => {
    onChange({
      contacts: contacts.map((c) => (c.id === id ? { ...c, [field]: val } : c)),
    });
  };

  const removeContact = (id: string) => {
    onChange({ contacts: contacts.filter((c) => c.id !== id) });
  };

  const displayContacts =
    contacts.length > 0 ? contacts : [createDefaultContact()];

  // ==================== VIEW MODE ====================
  if (!isEditing) {
    return (
      <div className="space-y-4 sm:space-y-5 animate-in fade-in-50 duration-200">
        {/* ১. অফিসিয়াল ওয়েবসাইট */}
        <div className="p-3 sm:p-3.5 bg-neutral-50/70 border border-neutral-200/80 rounded-xs">
          <span className="text-[10px] font-mono uppercase text-neutral-400 flex items-center gap-1.5 mb-1">
            <Globe className="h-3 w-3 shrink-0" /> Official Website URL
          </span>
          {website ? (
            <a
              href={website}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-mono font-medium text-blue-600 hover:underline break-all"
            >
              {website}
            </a>
          ) : (
            <p className="text-xs font-mono text-neutral-400">Not Set</p>
          )}
        </div>

        {/* ২. কন্টাক্ট চ্যানেলসমূহ */}
        <div className="space-y-3.5 sm:space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-mono uppercase font-bold text-neutral-700 flex items-center gap-1.5 min-w-0">
              <PhoneCall className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">
                Department & Contact Directory ({displayContacts.length})
              </span>
            </span>
          </div>

          {displayContacts.map((c, idx) => {
            const deptLabel = formatOtherDisplay(c.department);
            return (
              <div
                key={c.id}
                className="p-3 sm:p-4 bg-neutral-50/60 border border-neutral-200 rounded-xs space-y-3 sm:space-y-3.5"
              >
                {/* কার্ড হেডার */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200/80 pb-2 sm:pb-2.5">
                  <span className="text-[11px] font-mono uppercase font-bold text-neutral-700">
                    Contact Channel #{idx + 1}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-mono uppercase rounded-xs border shrink-0 ${
                      c.isPublic
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                  >
                    {c.isPublic ? (
                      <>
                        <Eye className="h-3 w-3 shrink-0" /> Public
                      </>
                    ) : (
                      <>
                        <EyeOff className="h-3 w-3 shrink-0" /> Private
                      </>
                    )}
                  </span>
                </div>

                {/* রো ১: Department, Contact Person, Designation */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2.5 text-xs font-mono">
                  <div className="p-2.5 bg-white border border-neutral-200/80 rounded-xs min-w-0">
                    <span className="text-[9.5px] uppercase text-neutral-400 block mb-0.5">
                      Department / Purpose
                    </span>
                    <p className="font-medium text-neutral-900 truncate">
                      {deptLabel || "General Enquiries"}
                    </p>
                  </div>

                  <div className="p-2.5 bg-white border border-neutral-200/80 rounded-xs min-w-0">
                    <span className="text-[9.5px] uppercase text-neutral-400 block mb-0.5">
                      Contact Person
                    </span>
                    <p
                      className={`font-medium truncate ${
                        c.personName ? "text-neutral-900" : "text-neutral-400"
                      }`}
                    >
                      {c.personName || "Not Set"}
                    </p>
                  </div>

                  <div className="p-2.5 bg-white border border-neutral-200/80 rounded-xs min-w-0">
                    <span className="text-[9.5px] uppercase text-neutral-400 block mb-0.5">
                      Designation
                    </span>
                    <p
                      className={`font-medium truncate ${
                        c.designation ? "text-neutral-900" : "text-neutral-400"
                      }`}
                    >
                      {c.designation || "Not Set"}
                    </p>
                  </div>
                </div>

                {/* রো ২: Official Email & Business Enquiry Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5 text-xs font-mono">
                  <div className="p-2.5 bg-white border border-neutral-200/80 rounded-xs min-w-0">
                    <span className="text-[9.5px] uppercase text-neutral-400 block mb-0.5">
                      Official Email
                    </span>
                    <p
                      className={`font-medium truncate ${
                        c.email ? "text-neutral-900" : "text-neutral-400"
                      }`}
                    >
                      {c.email || "Not Set"}
                    </p>
                  </div>

                  <div className="p-2.5 bg-white border border-neutral-200/80 rounded-xs min-w-0">
                    <span className="text-[9.5px] uppercase text-neutral-400 block mb-0.5">
                      Business Enquiry Email
                    </span>
                    <p
                      className={`font-medium truncate ${
                        c.enquiryEmail ? "text-neutral-900" : "text-neutral-400"
                      }`}
                    >
                      {c.enquiryEmail || "Not Set"}
                    </p>
                  </div>
                </div>

                {/* রো ৩: Primary, Secondary, WhatsApp & Customer Support Numbers */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2.5 text-xs font-mono">
                  <div className="p-2.5 bg-white border border-neutral-200/80 rounded-xs min-w-0">
                    <span className="text-[9.5px] uppercase text-neutral-400 block mb-0.5">
                      Primary Mobile
                    </span>
                    <p
                      className={`font-medium truncate ${
                        c.phone ? "text-neutral-900" : "text-neutral-400"
                      }`}
                    >
                      {c.phone || "Not Set"}
                    </p>
                  </div>

                  <div className="p-2.5 bg-white border border-neutral-200/80 rounded-xs min-w-0">
                    <span className="text-[9.5px] uppercase text-neutral-400 block mb-0.5">
                      Secondary Mobile
                    </span>
                    <p
                      className={`font-medium truncate ${
                        c.secondaryPhone
                          ? "text-neutral-900"
                          : "text-neutral-400"
                      }`}
                    >
                      {c.secondaryPhone || "Not Set"}
                    </p>
                  </div>

                  <div className="p-2.5 bg-white border border-neutral-200/80 rounded-xs min-w-0">
                    <span className="text-[9.5px] uppercase text-neutral-400 block mb-0.5">
                      WhatsApp Number
                    </span>
                    <p
                      className={`font-medium truncate ${
                        c.whatsapp ? "text-emerald-700" : "text-neutral-400"
                      }`}
                    >
                      {c.whatsapp || "Not Set"}
                    </p>
                  </div>

                  <div className="p-2.5 bg-white border border-neutral-200/80 rounded-xs min-w-0">
                    <span className="text-[9.5px] uppercase text-neutral-400 block mb-0.5">
                      Customer Support
                    </span>
                    <p
                      className={`font-medium truncate ${
                        c.supportPhone ? "text-blue-700" : "text-neutral-400"
                      }`}
                    >
                      {c.supportPhone || "Not Set"}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ==================== EDIT MODE ====================
  return (
    <div className="space-y-4 sm:space-y-5 animate-in fade-in-50 duration-200">
      {/* ১. অফিসিয়াল ওয়েবসাইট */}
      <div className="p-3 sm:p-3.5 bg-neutral-50/60 border border-neutral-200/80 rounded-xs">
        <FormInput
          label="Official Website URL"
          type="url"
          value={website}
          onChange={(val) => onChange({ website: val })}
          placeholder="Enter your official website URL"
        />
      </div>

      {/* ২. একাধিক কন্টাক্ট পার্সন ও ডিপার্টমেন্ট হেডার */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="min-w-0">
          <span className="text-xs font-mono uppercase font-bold text-neutral-800 block">
            Department & Contact Persons ({displayContacts.length})
          </span>
          <span className="text-[11px] font-sans text-neutral-500">
            Configure department-wise communication channels and control public
            visibility.
          </span>
        </div>
        <button
          type="button"
          onClick={addContact}
          className="inline-flex items-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 text-white px-3.5 py-2 text-[11px] font-mono uppercase rounded-xs cursor-pointer shrink-0 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" /> Add More
        </button>
      </div>

      {/* প্রতিটি কন্টাক্ট কার্ড */}
      <div className="space-y-3.5 sm:space-y-4">
        {displayContacts.map((c, idx) => (
          <div
            key={c.id}
            className="p-3 sm:p-4 bg-neutral-50/60 border border-neutral-200 rounded-xs space-y-3.5"
          >
            {/* কার্ড হেডার */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200/80 pb-2.5">
              <span className="text-[11px] font-mono uppercase font-bold text-neutral-700">
                Contact Channel #{idx + 1}
              </span>

              <div className="flex items-center gap-2 sm:gap-4">
                <button
                  type="button"
                  onClick={() => updateContact(c.id, "isPublic", !c.isPublic)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] sm:text-[10.5px] font-mono uppercase rounded-xs border cursor-pointer transition-colors ${
                    c.isPublic
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  }`}
                >
                  {c.isPublic ? (
                    <>
                      <Eye className="h-3 w-3 shrink-0" /> Publicly Visible
                    </>
                  ) : (
                    <>
                      <EyeOff className="h-3 w-3 shrink-0" /> Private Only
                    </>
                  )}
                </button>

                {displayContacts.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeContact(c.id)}
                    title="Remove Contact"
                    className="text-red-500 hover:text-red-700 p-1 cursor-pointer shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* রো ১: Department, Contact Person, Designation */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-start">
              <FormSelectWithOther
                label="Department / Purpose"
                value={c.department}
                options={CONTACT_DEPARTMENTS}
                placeholder="Select department"
                otherPlaceholder="Enter department name"
                onChange={(val) => updateContact(c.id, "department", val)}
              />

              <FormInput
                label="Contact Person"
                value={c.personName}
                onChange={(val) => updateContact(c.id, "personName", val)}
                placeholder="Enter contact person full name"
              />

              <FormInput
                label="Contact Person Designation"
                value={c.designation}
                onChange={(val) => updateContact(c.id, "designation", val)}
                placeholder="Enter contact person designation"
              />
            </div>

            {/* রো ২: Official Email & Business Enquiry Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormInput
                label="Official Email"
                type="email"
                value={c.email}
                onChange={(val) => updateContact(c.id, "email", val)}
                placeholder="Enter your official email"
              />

              <FormInput
                label="Business Enquiry Email"
                type="email"
                value={c.enquiryEmail || ""}
                onChange={(val) => updateContact(c.id, "enquiryEmail", val)}
                placeholder="Enter your business enquiry email"
              />
            </div>

            {/* রো ৩: Primary, Secondary, WhatsApp & Customer Support Numbers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <FormInput
                label="Primary Mobile Number"
                type="tel"
                value={c.phone}
                onChange={(val) => updateContact(c.id, "phone", val)}
                placeholder="Enter your primary mobile number"
              />

              <FormInput
                label="Secondary Mobile Number"
                type="tel"
                value={c.secondaryPhone || ""}
                onChange={(val) => updateContact(c.id, "secondaryPhone", val)}
                placeholder="Enter your secondary mobile number"
              />

              <FormInput
                label="WhatsApp Number"
                type="tel"
                value={c.whatsapp}
                onChange={(val) => updateContact(c.id, "whatsapp", val)}
                placeholder="Enter your WhatsApp number"
              />

              <FormInput
                label="Customer Support Number"
                type="tel"
                value={c.supportPhone || ""}
                onChange={(val) => updateContact(c.id, "supportPhone", val)}
                placeholder="Enter your customer support number"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
