"use client";

import { Plus, Trash2, ExternalLink } from "lucide-react";

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

const PLATFORMS = [
  "GitHub",
  "LinkedIn",
  "Website / Portfolio",
  "Twitter / X",
  "Instagram",
  "YouTube",
  "Facebook",
  "Other",
];

interface Props {
  links: SocialLink[];
  isEditing: boolean;
  onChange: (links: SocialLink[]) => void;
}

export default function DynamicSocialLinks({
  links,
  isEditing,
  onChange,
}: Props) {
  const addLink = () => {
    onChange([
      ...links,
      { id: Date.now().toString(), platform: "Website / Portfolio", url: "" },
    ]);
  };

  const removeLink = (id: string) => {
    onChange(links.filter((l) => l.id !== id));
  };

  const updateLink = (id: string, field: keyof SocialLink, val: string) => {
    onChange(links.map((l) => (l.id === id ? { ...l, [field]: val } : l)));
  };

  if (!isEditing) {
    return (
      <div className="space-y-2.5">
        <span className="text-[10px] font-mono uppercase text-neutral-400 block">
          Social Links ({links.length})
        </span>
        {links.length === 0 ? (
          <p className="text-xs font-mono text-neutral-400 italic">
            No social links added yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {links.map((link) => (
              <div
                key={link.id}
                className="p-2.5 sm:p-3 bg-neutral-50/70 border border-neutral-200/80 rounded-xs flex items-center justify-between gap-2 min-w-0"
              >
                <div className="min-w-0 flex-1">
                  <span className="text-[9px] font-mono uppercase text-neutral-400 block font-semibold">
                    {link.platform}
                  </span>
                  <a
                    href={
                      link.url.startsWith("http")
                        ? link.url
                        : `https://${link.url}`
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-mono text-neutral-900 hover:underline truncate block"
                  >
                    {link.url || "No link"}
                  </a>
                </div>
                <ExternalLink className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="border-t border-neutral-100 pt-4 space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div>
          <label className="text-[11px] font-mono uppercase text-neutral-600 font-bold block">
            Social Media Links
          </label>
          <span className="text-[10px] font-mono text-neutral-400">
            Add links to your profiles or website.
          </span>
        </div>
        <button
          type="button"
          onClick={addLink}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 text-white text-xs font-mono uppercase rounded-xs cursor-pointer hover:bg-neutral-800 transition-colors shrink-0"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Link</span>
        </button>
      </div>

      <div className="space-y-2.5">
        {links.length === 0 ? (
          <p className="text-xs font-mono text-neutral-400 italic py-1">
            No links added. Click &quot;Add Link&quot; above to add your social
            profiles.
          </p>
        ) : (
          links.map((link) => (
            <div
              key={link.id}
              className="p-2.5 bg-neutral-50/50 border border-neutral-200 rounded-xs flex flex-col sm:flex-row gap-2 items-stretch sm:items-center"
            >
              <select
                value={link.platform}
                onChange={(e) =>
                  updateLink(link.id, "platform", e.target.value)
                }
                className="w-full sm:w-44 border border-neutral-200 bg-white px-2.5 py-2 sm:py-1.5 text-xs font-mono text-neutral-900 outline-none focus:border-neutral-950 cursor-pointer rounded-xs"
              >
                {PLATFORMS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>

              <div className="flex items-center gap-2 flex-1 min-w-0">
                <input
                  type="text"
                  placeholder="https://..."
                  value={link.url}
                  onChange={(e) => updateLink(link.id, "url", e.target.value)}
                  className="flex-1 min-w-0 border border-neutral-200 bg-white px-3 py-2 sm:py-1.5 text-xs font-mono text-neutral-900 outline-none focus:border-neutral-950 rounded-xs"
                />
                <button
                  type="button"
                  onClick={() => removeLink(link.id)}
                  className="p-2 sm:p-1.5 text-neutral-400 hover:text-red-600 cursor-pointer transition-colors shrink-0 border border-neutral-200 sm:border-0 bg-white sm:bg-transparent rounded-xs"
                  title="Remove"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
