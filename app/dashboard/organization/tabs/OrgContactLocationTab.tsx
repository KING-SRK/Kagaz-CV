// app/dashboard/organization/tabs/OrgContactLocationTab.tsx
"use client";

import {
  PhoneCall,
  MapPin,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  ExternalLink,
  Mail,
} from "lucide-react";
import { OrgContactItem, OrgBranchItem } from "@/lib/organizationService";

interface Props {
  isEditing: boolean;
  contacts: OrgContactItem[];
  branches: OrgBranchItem[];
  onChange: (updated: {
    contacts?: OrgContactItem[];
    branches?: OrgBranchItem[];
  }) => void;
}

const LOCATION_TYPES = [
  "Head Office",
  "Branch Office",
  "Registered Office",
  "Retail Store / Shop",
  "Warehouse",
  "Factory",
  "Other",
];

export default function OrgContactLocationTab({
  isEditing,
  contacts = [],
  branches = [],
  onChange,
}: Props) {
  // --- Contact Handlers ---
  const addContact = () => {
    onChange({
      contacts: [
        ...contacts,
        {
          id: Date.now().toString(),
          department: "General Enquiries",
          personName: "",
          designation: "",
          phone: "",
          whatsapp: "",
          email: "",
          isPublic: true,
        },
      ],
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

  // --- Branch / Location Handlers ---
  const addBranch = () => {
    onChange({
      branches: [
        ...branches,
        {
          id: Date.now().toString(),
          locationType: branches.length === 0 ? "Head Office" : "Branch Office",
          buildingNo: "",
          street: "",
          area: "",
          city: "",
          district: "",
          state: "",
          pincode: "",
          country: "India",
          mapUrl: "",
        },
      ],
    });
  };

  const updateBranch = (
    id: string,
    field: keyof OrgBranchItem,
    val: string,
  ) => {
    onChange({
      branches: branches.map((b) => (b.id === id ? { ...b, [field]: val } : b)),
    });
  };

  const removeBranch = (id: string) => {
    onChange({ branches: branches.filter((b) => b.id !== id) });
  };

  // ==================== VIEW MODE ====================
  if (!isEditing) {
    return (
      <div className="space-y-6">
        {/* ১. কন্টাক্ট লিস্ট */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono uppercase font-bold text-neutral-500 flex items-center gap-1.5">
            <PhoneCall className="h-3.5 w-3.5 text-emerald-600" /> Business
            Contacts ({contacts.length})
          </h3>

          {contacts.length === 0 ? (
            <p className="text-xs font-mono text-neutral-400 italic">
              No contact details added yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {contacts.map((c) => (
                <div
                  key={c.id}
                  className="p-3.5 bg-neutral-50/70 border border-neutral-200/80 rounded-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 bg-neutral-900 text-white text-[10px] font-mono uppercase rounded-xs">
                      {c.department}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-500 flex items-center gap-1">
                      {c.isPublic ? (
                        <>
                          <Eye className="h-3 w-3 text-emerald-600" /> Public
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-3 w-3 text-amber-600" /> Private
                        </>
                      )}
                    </span>
                  </div>

                  {c.personName && (
                    <p className="text-xs font-bold text-neutral-900 pt-1">
                      {c.personName}{" "}
                      {c.designation && (
                        <span className="font-normal text-neutral-500">
                          ({c.designation})
                        </span>
                      )}
                    </p>
                  )}

                  <div className="text-xs font-mono text-neutral-700 space-y-0.5 pt-1">
                    {c.phone && <p>📞 {c.phone}</p>}
                    {c.whatsapp && <p>💬 WA: {c.whatsapp}</p>}
                    {c.email && (
                      <p className="flex items-center gap-1 truncate">
                        <Mail className="h-3 w-3 text-neutral-400 shrink-0" />{" "}
                        {c.email}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ২. অফিস ও ব্রাঞ্চ ঠিকানা */}
        <div className="space-y-3 border-t border-neutral-100 pt-5">
          <h3 className="text-xs font-mono uppercase font-bold text-neutral-500 flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-blue-600" /> Business Locations
            & Branches ({branches.length})
          </h3>

          {branches.length === 0 ? (
            <p className="text-xs font-mono text-neutral-400 italic">
              No business address added yet.
            </p>
          ) : (
            <div className="space-y-2.5">
              {branches.map((b) => (
                <div
                  key={b.id}
                  className="p-3.5 bg-neutral-50/70 border border-neutral-200/80 rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <span className="px-2 py-0.5 bg-white border border-neutral-200 text-[10px] font-mono font-bold uppercase text-neutral-800 rounded-xs inline-block">
                      {b.locationType}
                    </span>
                    <p className="text-xs text-neutral-800 font-sans">
                      {[
                        b.buildingNo,
                        b.street,
                        b.area,
                        b.city,
                        b.district,
                        b.state,
                        b.pincode,
                      ]
                        .filter(Boolean)
                        .join(", ") || "Address details incomplete"}
                    </p>
                  </div>

                  {b.mapUrl && (
                    <a
                      href={b.mapUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-neutral-300 hover:bg-neutral-100 text-[11px] font-mono text-neutral-900 rounded-xs shrink-0 self-start sm:self-center"
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span>Open Map</span>
                    </a>
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
      {/* ১. কন্টাক্ট এডিট সেকশন */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase font-bold text-neutral-700">
            1. Department & Contact Persons
          </span>
          <button
            type="button"
            onClick={addContact}
            className="inline-flex items-center gap-1 bg-neutral-900 text-white px-3 py-1 text-[10.5px] font-mono uppercase rounded-xs cursor-pointer"
          >
            <Plus className="h-3 w-3" /> Add Contact
          </button>
        </div>

        {contacts.map((c, idx) => (
          <div
            key={c.id}
            className="p-3.5 bg-neutral-50/60 border border-neutral-200 rounded-xs space-y-2.5"
          >
            <div className="flex items-center justify-between border-b border-neutral-200/70 pb-1.5">
              <span className="text-[10px] font-mono uppercase font-bold text-neutral-500">
                Contact #{idx + 1}
              </span>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1 text-[11px] font-mono text-neutral-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={c.isPublic}
                    onChange={(e) =>
                      updateContact(c.id, "isPublic", e.target.checked)
                    }
                  />
                  <span>Show Publicly</span>
                </label>
                <button
                  type="button"
                  onClick={() => removeContact(c.id)}
                  className="text-red-500 hover:text-red-700 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <select
                value={c.department}
                onChange={(e) =>
                  updateContact(c.id, "department", e.target.value)
                }
                className="border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-mono"
              >
                <option value="General Enquiries">General Enquiries</option>
                <option value="Sales Department">Sales Department</option>
                <option value="HR & Recruitment">HR & Recruitment</option>
                <option value="Customer Support">Customer Support</option>
                <option value="Management / Owner">Management / Owner</option>
              </select>

              <input
                type="text"
                placeholder="Contact Person Name"
                value={c.personName}
                onChange={(e) =>
                  updateContact(c.id, "personName", e.target.value)
                }
                className="border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-mono"
              />

              <input
                type="text"
                placeholder="Designation (e.g. Manager)"
                value={c.designation}
                onChange={(e) =>
                  updateContact(c.id, "designation", e.target.value)
                }
                className="border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-mono"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <input
                type="tel"
                placeholder="Mobile / Phone Number"
                value={c.phone}
                onChange={(e) => updateContact(c.id, "phone", e.target.value)}
                className="border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-mono"
              />
              <input
                type="tel"
                placeholder="WhatsApp Number"
                value={c.whatsapp}
                onChange={(e) =>
                  updateContact(c.id, "whatsapp", e.target.value)
                }
                className="border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-mono"
              />
              <input
                type="email"
                placeholder="Official Email"
                value={c.email}
                onChange={(e) => updateContact(c.id, "email", e.target.value)}
                className="border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-mono"
              />
            </div>
          </div>
        ))}
      </div>

      {/* ২. অফিস ও ব্রাঞ্চ এডিট সেকশন */}
      <div className="space-y-3 border-t border-neutral-200 pt-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase font-bold text-neutral-700">
            2. Business Addresses & Branches
          </span>
          <button
            type="button"
            onClick={addBranch}
            className="inline-flex items-center gap-1 bg-neutral-900 text-white px-3 py-1 text-[10.5px] font-mono uppercase rounded-xs cursor-pointer"
          >
            <Plus className="h-3 w-3" /> Add Location
          </button>
        </div>

        {branches.map((b, idx) => (
          <div
            key={b.id}
            className="p-3.5 bg-neutral-50/60 border border-neutral-200 rounded-xs space-y-2.5"
          >
            <div className="flex items-center justify-between border-b border-neutral-200/70 pb-1.5">
              <span className="text-[10px] font-mono uppercase font-bold text-neutral-500">
                Location #{idx + 1}
              </span>
              <button
                type="button"
                onClick={() => removeBranch(b.id)}
                className="text-red-500 hover:text-red-700 cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <select
                value={b.locationType}
                onChange={(e) =>
                  updateBranch(b.id, "locationType", e.target.value)
                }
                className="border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-mono"
              >
                {LOCATION_TYPES.map((lt) => (
                  <option key={lt} value={lt}>
                    {lt}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Shop / Building No."
                value={b.buildingNo}
                onChange={(e) =>
                  updateBranch(b.id, "buildingNo", e.target.value)
                }
                className="border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-mono"
              />

              <input
                type="text"
                placeholder="Street / Road Name"
                value={b.street}
                onChange={(e) => updateBranch(b.id, "street", e.target.value)}
                className="border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-mono"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <input
                type="text"
                placeholder="Area / Locality"
                value={b.area}
                onChange={(e) => updateBranch(b.id, "area", e.target.value)}
                className="border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-mono"
              />
              <input
                type="text"
                placeholder="City"
                value={b.city}
                onChange={(e) => updateBranch(b.id, "city", e.target.value)}
                className="border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-mono"
              />
              <input
                type="text"
                placeholder="State"
                value={b.state}
                onChange={(e) => updateBranch(b.id, "state", e.target.value)}
                className="border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-mono"
              />
              <input
                type="text"
                placeholder="PIN Code"
                value={b.pincode}
                onChange={(e) => updateBranch(b.id, "pincode", e.target.value)}
                className="border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-mono"
              />
            </div>

            <input
              type="url"
              placeholder="Google Maps Link (https://maps.google.com/...)"
              value={b.mapUrl}
              onChange={(e) => updateBranch(b.id, "mapUrl", e.target.value)}
              className="w-full border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-mono"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
