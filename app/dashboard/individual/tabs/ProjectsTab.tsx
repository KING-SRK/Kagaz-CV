// app/dashboard/individual/tabs/ProjectsTab.tsx
"use client";

import { useEffect } from "react";
import { FolderGit2, ExternalLink, Plus, Trash2, Code2 } from "lucide-react";

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  technologies: string;
  projectUrl: string;
  githubUrl?: string;
  demoUrl?: string;
  imageUrl?: string;
}

interface Props {
  isEditing: boolean;
  projectsList: ProjectItem[];
  onChange: (list: ProjectItem[]) => void;
}

const createDefaultProject = (): ProjectItem => ({
  id: Date.now().toString(),
  title: "",
  description: "",
  technologies: "",
  projectUrl: "",
  githubUrl: "",
  demoUrl: "",
  imageUrl: "",
});

export default function ProjectsTab({
  isEditing,
  projectsList = [],
  onChange,
}: Props) {
  useEffect(() => {
    if (isEditing && projectsList.length === 0) {
      onChange([createDefaultProject()]);
    }
  }, [isEditing, projectsList.length, onChange]);

  const handleAdd = () => {
    onChange([...projectsList, createDefaultProject()]);
  };

  const handleUpdate = (
    id: string,
    field: keyof ProjectItem,
    value: string,
  ) => {
    onChange(
      projectsList.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    );
  };

  const handleRemove = (id: string) => {
    onChange(projectsList.filter((p) => p.id !== id));
  };

  const displayList =
    projectsList.length > 0 ? projectsList : [createDefaultProject()];

  // ==================== VIEW MODE ====================
  if (!isEditing) {
    return (
      <div className="space-y-4 animate-in fade-in-50 duration-200">
        <div className="flex items-center justify-between">
          <span className="text-[11px] sm:text-xs font-mono uppercase font-bold text-neutral-700 flex items-center gap-1.5 min-w-0">
            <FolderGit2 className="h-3.5 w-3.5 text-blue-600 shrink-0" />
            <span className="truncate">
              Projects & Portfolio Showcase ({displayList.length})
            </span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
          {displayList.map((proj, idx) => (
            <div
              key={proj.id}
              className="p-3 sm:p-4 bg-neutral-50/60 border border-neutral-200 rounded-xs flex flex-col justify-between space-y-3 sm:space-y-3.5 min-w-0"
            >
              <div className="space-y-2.5">
                {/* কার্ড হেডার ও লিংক */}
                <div className="flex items-start justify-between gap-2 border-b border-neutral-200/80 pb-2.5">
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-mono uppercase text-neutral-400 font-bold block">
                      Project #{idx + 1}
                    </span>
                    <h3
                      className={`text-sm font-serif font-bold truncate mt-0.5 ${
                        proj.title ? "text-neutral-950" : "text-neutral-400"
                      }`}
                    >
                      {proj.title || "Untitled Project"}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {proj.projectUrl && (
                      <a
                        href={proj.projectUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2 py-1 bg-white border border-neutral-300 hover:bg-neutral-100 text-[10px] font-mono uppercase text-neutral-900 rounded-xs inline-flex items-center gap-1"
                        title="Live Preview"
                      >
                        <span>Live</span>
                        <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    )}
                    {proj.githubUrl && (
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2 py-1 bg-white border border-neutral-300 hover:bg-neutral-100 text-[10px] font-mono uppercase text-neutral-900 rounded-xs inline-flex items-center gap-1"
                        title="GitHub Repository"
                      >
                        <span>Code</span>
                        <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    )}
                  </div>
                </div>

                {/* বিবরণ */}
                <div className="p-2.5 bg-white border border-neutral-200/80 rounded-xs text-xs">
                  <span className="text-[9.5px] font-mono uppercase text-neutral-400 block mb-0.5">
                    Description
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

              {/* টেক স্ট্যাক বা ট্যাগসমূহ */}
              <div className="p-2.5 bg-white border border-neutral-200/80 rounded-xs space-y-1.5">
                <span className="text-[9.5px] font-mono uppercase text-neutral-400 block">
                  Technologies Used
                </span>
                {proj.technologies ? (
                  <div className="flex flex-wrap gap-1.5">
                    {proj.technologies.split(",").map((tech, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-neutral-100 border border-neutral-200 text-[10px] font-mono text-neutral-800 rounded-xs"
                      >
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs font-mono text-neutral-400">Not Set</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ==================== EDIT MODE ====================
  return (
    <div className="space-y-4 animate-in fade-in-50 duration-200">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[11px] sm:text-xs font-mono uppercase text-neutral-500 font-bold min-w-0 truncate">
          Projects & Portfolio Showcase ({displayList.length})
        </span>
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 text-white px-3 sm:px-3.5 py-1.5 text-[11px] font-mono uppercase rounded-xs cursor-pointer shrink-0 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Project</span>
        </button>
      </div>

      {displayList.map((proj, idx) => (
        <div
          key={proj.id}
          className="p-3 sm:p-4 bg-neutral-50/50 border border-neutral-200 rounded-xs space-y-3"
        >
          <div className="flex items-center justify-between border-b border-neutral-200/70 pb-2">
            <span className="text-[10px] font-mono uppercase text-neutral-400 font-bold flex items-center gap-1">
              <Code2 className="h-3 w-3 shrink-0" /> Project #{idx + 1}
            </span>
            {displayList.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemove(proj.id)}
                className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                title="Remove"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-mono uppercase text-neutral-500 mb-1">
                Project Title
              </label>
              <input
                type="text"
                value={proj.title}
                onChange={(e) => handleUpdate(proj.id, "title", e.target.value)}
                placeholder="Enter your project title"
                className="w-full border border-neutral-200 bg-white px-3 py-2 text-xs font-mono outline-none focus:border-neutral-950 rounded-xs"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase text-neutral-500 mb-1">
                Live URL (Optional)
              </label>
              <input
                type="url"
                value={proj.projectUrl}
                onChange={(e) =>
                  handleUpdate(proj.id, "projectUrl", e.target.value)
                }
                placeholder="Enter live website URL"
                className="w-full border border-neutral-200 bg-white px-3 py-2 text-xs font-mono outline-none focus:border-neutral-950 rounded-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-mono uppercase text-neutral-500 mb-1">
                GitHub Repository URL (Optional)
              </label>
              <input
                type="url"
                value={proj.githubUrl || ""}
                onChange={(e) =>
                  handleUpdate(proj.id, "githubUrl", e.target.value)
                }
                placeholder="Enter GitHub repository URL"
                className="w-full border border-neutral-200 bg-white px-3 py-2 text-xs font-mono outline-none focus:border-neutral-950 rounded-xs"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase text-neutral-500 mb-1">
                Video Demo / Showcase URL (Optional)
              </label>
              <input
                type="url"
                value={proj.demoUrl || ""}
                onChange={(e) =>
                  handleUpdate(proj.id, "demoUrl", e.target.value)
                }
                placeholder="Enter video demo URL (YouTube / Drive)"
                className="w-full border border-neutral-200 bg-white px-3 py-2 text-xs font-mono outline-none focus:border-neutral-950 rounded-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-neutral-500 mb-1">
              Technologies Used (Comma Separated)
            </label>
            <input
              type="text"
              value={proj.technologies}
              onChange={(e) =>
                handleUpdate(proj.id, "technologies", e.target.value)
              }
              placeholder="Enter technologies (e.g. Next.js, Tailwind CSS, Supabase)"
              className="w-full border border-neutral-200 bg-white px-3 py-2 text-xs font-mono outline-none focus:border-neutral-950 rounded-xs"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-neutral-500 mb-1">
              Project Description
            </label>
            <textarea
              rows={2}
              value={proj.description}
              onChange={(e) =>
                handleUpdate(proj.id, "description", e.target.value)
              }
              placeholder="Enter your project description, key features and your role"
              className="w-full border border-neutral-200 bg-white p-2.5 text-xs font-mono outline-none focus:border-neutral-950 resize-none rounded-xs"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
