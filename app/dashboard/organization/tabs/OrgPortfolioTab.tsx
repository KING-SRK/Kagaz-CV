// app/dashboard/organization/tabs/OrgPortfolioTab.tsx
"use client";

import { useEffect } from "react";
import {
  FolderKanban,
  Plus,
  Trash2,
  ExternalLink,
  Calendar,
  UserCheck,
  CheckCircle2,
} from "lucide-react";
import { OrgPortfolioItem } from "@/lib/organizationService";
import { FormInput, FormSelectWithOther } from "@/components/ui/FormFields";
import {
  PORTFOLIO_CATEGORIES,
  formatOtherDisplay,
} from "@/constants/orgOptions";

interface Props {
  isEditing: boolean;
  portfolio: OrgPortfolioItem[];
  onChange: (newPortfolio: OrgPortfolioItem[]) => void;
}

const createDefaultProject = (): OrgPortfolioItem => ({
  id: Date.now().toString(),
  title: "",
  category: "",
  description: "",
  completionDate: "",
  url: "",
  clientName: "",
  clientPermission: false,
});

export default function OrgPortfolioTab({
  isEditing,
  portfolio = [],
  onChange,
}: Props) {
  useEffect(() => {
    if (isEditing && portfolio.length === 0) {
      onChange([createDefaultProject()]);
    }
  }, [isEditing, portfolio.length, onChange]);

  const addProject = () => {
    onChange([...portfolio, createDefaultProject()]);
  };

  const updateProject = (
    id: string,
    field: keyof OrgPortfolioItem,
    val: string | boolean,
  ) => {
    onChange(
      portfolio.map((item) =>
        item.id === id ? { ...item, [field]: val } : item,
      ),
    );
  };

  const removeProject = (id: string) => {
    onChange(portfolio.filter((item) => item.id !== id));
  };

  const displayProjects =
    portfolio.length > 0 ? portfolio : [createDefaultProject()];

  // ==================== VIEW MODE ====================
  if (!isEditing) {
    return (
      <div className="space-y-4 animate-in fade-in-50 duration-200">
        <div className="flex items-center justify-between">
          <span className="text-[11px] sm:text-xs font-mono uppercase font-bold text-neutral-700 flex items-center gap-1.5 min-w-0">
            <FolderKanban className="h-3.5 w-3.5 text-blue-600 shrink-0" />
            <span className="truncate">
              Company Portfolio & Completed Work ({displayProjects.length})
            </span>
          </span>
        </div>

        <div className="space-y-3.5 sm:space-y-4">
          {displayProjects.map((proj, idx) => {
            const catLabel = formatOtherDisplay(proj.category);

            return (
              <div
                key={proj.id}
                className="p-3 sm:p-4 bg-neutral-50/60 border border-neutral-200 rounded-xs space-y-3 sm:space-y-3.5"
              >
                {/* কার্ড হেডার */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200/80 pb-2 sm:pb-2.5">
                  <span className="text-[11px] font-mono uppercase font-bold text-neutral-700">
                    Project #{idx + 1}
                  </span>

                  {proj.url ? (
                    <a
                      href={proj.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-neutral-300 hover:bg-neutral-100 text-[10px] sm:text-[10.5px] font-mono uppercase text-neutral-900 rounded-xs shrink-0 transition-colors"
                    >
                      <span>View Project</span>
                      <ExternalLink className="h-2.5 w-2.5 shrink-0" />
                    </a>
                  ) : (
                    <span className="text-[10px] font-mono text-neutral-400 shrink-0">
                      Project URL: Not Set
                    </span>
                  )}
                </div>

                {/* রো ১: Project Name, Category, Completion Date & Client Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2.5 text-xs font-mono">
                  <div className="p-2.5 bg-white border border-neutral-200/80 rounded-xs min-w-0">
                    <span className="text-[9.5px] uppercase text-neutral-400 block mb-0.5">
                      Project Name
                    </span>
                    <p
                      className={`font-medium truncate ${
                        proj.title ? "text-neutral-900" : "text-neutral-400"
                      }`}
                    >
                      {proj.title || "Not Set"}
                    </p>
                  </div>

                  <div className="p-2.5 bg-white border border-neutral-200/80 rounded-xs min-w-0">
                    <span className="text-[9.5px] uppercase text-neutral-400 block mb-0.5">
                      Project Category
                    </span>
                    <p
                      className={`font-medium truncate ${
                        catLabel ? "text-neutral-900" : "text-neutral-400"
                      }`}
                    >
                      {catLabel || "Not Set"}
                    </p>
                  </div>

                  <div className="p-2.5 bg-white border border-neutral-200/80 rounded-xs min-w-0">
                    <span className="text-[9.5px] uppercase text-neutral-400 flex items-center gap-1 mb-0.5">
                      <Calendar className="h-3 w-3 shrink-0" /> Completion Date
                    </span>
                    <p
                      className={`font-medium truncate ${
                        proj.completionDate
                          ? "text-neutral-900"
                          : "text-neutral-400"
                      }`}
                    >
                      {proj.completionDate || "Not Set"}
                    </p>
                  </div>

                  <div className="p-2.5 bg-white border border-neutral-200/80 rounded-xs min-w-0">
                    <span className="text-[9.5px] uppercase text-neutral-400 flex items-center gap-1 mb-0.5">
                      <UserCheck className="h-3 w-3 shrink-0" /> Client /
                      Partner
                    </span>
                    <p
                      className={`font-medium truncate ${
                        proj.clientName && proj.clientPermission
                          ? "text-neutral-900"
                          : "text-neutral-400"
                      }`}
                    >
                      {proj.clientName && proj.clientPermission
                        ? proj.clientName
                        : proj.clientName
                          ? "Hidden (No Permission)"
                          : "Not Set"}
                    </p>
                  </div>
                </div>

                {/* রো ২: Project Description */}
                <div className="p-2.5 bg-white border border-neutral-200/80 rounded-xs text-xs">
                  <span className="text-[9.5px] font-mono uppercase text-neutral-400 block mb-0.5">
                    Project Description
                  </span>
                  <p
                    className={`leading-relaxed wrap-break-word ${
                      proj.description
                        ? "text-neutral-700"
                        : "text-neutral-400 font-mono"
                    }`}
                  >
                    {proj.description || "Not Set"}
                  </p>
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
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="min-w-0">
          <span className="text-xs font-mono uppercase font-bold text-neutral-800 block">
            Company Portfolio & Work Showcase ({displayProjects.length})
          </span>
          <span className="text-[11px] font-sans text-neutral-500">
            Highlight completed software projects, builds, installations, or
            client case studies.
          </span>
        </div>
        <button
          type="button"
          onClick={addProject}
          className="inline-flex items-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 text-white px-3.5 py-2 text-[11px] font-mono uppercase rounded-xs cursor-pointer shrink-0 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" /> Add Project
        </button>
      </div>

      <div className="space-y-3.5 sm:space-y-4">
        {displayProjects.map((proj, idx) => (
          <div
            key={proj.id}
            className="p-3 sm:p-4 bg-neutral-50/60 border border-neutral-200 rounded-xs space-y-3.5"
          >
            <div className="flex items-center justify-between border-b border-neutral-200/80 pb-2.5">
              <span className="text-[11px] font-mono uppercase font-bold text-neutral-700">
                Project #{idx + 1}
              </span>

              {displayProjects.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeProject(proj.id)}
                  title="Remove Project"
                  className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* রো ১: Project Name, Category, Completion Date */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-start">
              <FormInput
                label="Project Name"
                value={proj.title}
                onChange={(val) => updateProject(proj.id, "title", val)}
                placeholder="Enter your project name"
              />

              <FormSelectWithOther
                label="Project Category"
                value={proj.category}
                options={PORTFOLIO_CATEGORIES}
                placeholder="Select project category"
                otherPlaceholder="Enter custom project category"
                onChange={(val) => updateProject(proj.id, "category", val)}
              />

              <FormInput
                label="Project Completion Date"
                type="date"
                value={proj.completionDate || ""}
                onChange={(val) =>
                  updateProject(proj.id, "completionDate", val)
                }
              />
            </div>

            {/* রো ২: Project URL & Client / Partner Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
              <FormInput
                label="Project URL (Optional)"
                type="url"
                value={proj.url || ""}
                onChange={(val) => updateProject(proj.id, "url", val)}
                placeholder="Enter live project or showcase URL"
              />

              <div className="space-y-2">
                <FormInput
                  label="Client / Partner Name (Optional)"
                  value={proj.clientName || ""}
                  onChange={(val) => updateProject(proj.id, "clientName", val)}
                  placeholder="Enter client or partner name"
                />
                {proj.clientName && (
                  <label className="flex items-start sm:items-center gap-2 text-[11px] font-mono text-neutral-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(proj.clientPermission)}
                      onChange={(e) =>
                        updateProject(
                          proj.id,
                          "clientPermission",
                          e.target.checked,
                        )
                      }
                      className="mt-0.5 sm:mt-0 shrink-0"
                    />
                    <span className="inline-flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" />
                      Client permission obtained to display publicly
                    </span>
                  </label>
                )}
              </div>
            </div>

            {/* রো ৩: Project Description */}
            <div>
              <label className="block text-[11px] font-mono uppercase text-neutral-500 mb-1">
                Project Description
              </label>
              <textarea
                rows={2}
                value={proj.description}
                onChange={(e) =>
                  updateProject(proj.id, "description", e.target.value)
                }
                placeholder="Enter detailed project overview, scope, and outcome"
                className="w-full border border-neutral-200 bg-white p-2.5 text-xs font-mono outline-none focus:border-neutral-950 resize-none rounded-xs"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
