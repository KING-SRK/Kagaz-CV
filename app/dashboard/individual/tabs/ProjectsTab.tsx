"use client";

import { FolderGit2, ExternalLink, Plus, Trash2, Code2 } from "lucide-react";

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  technologies: string;
  projectUrl: string;
  imageUrl?: string;
}

interface Props {
  isEditing: boolean;
  projectsList: ProjectItem[];
  onChange: (list: ProjectItem[]) => void;
}

export default function ProjectsTab({
  isEditing,
  projectsList = [],
  onChange,
}: Props) {
  const handleAdd = () => {
    const newProj: ProjectItem = {
      id: Date.now().toString(),
      title: "",
      description: "",
      technologies: "",
      projectUrl: "",
      imageUrl: "",
    };
    onChange([...projectsList, newProj]);
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

  // ==================== VIEW MODE ====================
  if (!isEditing) {
    if (projectsList.length === 0) {
      return (
        <div className="p-8 border border-dashed border-neutral-200 rounded-xs text-center space-y-1">
          <FolderGit2 className="h-6 w-6 text-neutral-300 mx-auto" />
          <p className="text-xs font-mono text-neutral-500">
            No projects showcased yet.
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {projectsList.map((proj) => (
          <div
            key={proj.id}
            className="p-4 bg-neutral-50/70 border border-neutral-200/80 rounded-xs flex flex-col justify-between space-y-3"
          >
            <div className="space-y-1.5">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-serif font-bold text-neutral-950">
                  {proj.title || "Untitled Project"}
                </h3>
                {proj.projectUrl && (
                  <a
                    href={proj.projectUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-neutral-500 hover:text-neutral-950 p-1 bg-white border border-neutral-200 rounded-xs"
                    title="Visit Live Project"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>

              <p className="text-xs text-neutral-600 line-clamp-3 leading-relaxed">
                {proj.description || "No description provided."}
              </p>
            </div>

            {proj.technologies && (
              <div className="flex flex-wrap gap-1 pt-2 border-t border-neutral-200/60">
                {proj.technologies.split(",").map((tech, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 bg-white border border-neutral-200 text-[10px] font-mono text-neutral-700 rounded-xs"
                  >
                    {tech.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  // ==================== EDIT MODE ====================
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono uppercase text-neutral-500 font-bold">
          Projects & Portfolio ({projectsList.length})
        </span>
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 text-white px-3 py-1.5 text-[11px] font-mono uppercase rounded-xs cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Project</span>
        </button>
      </div>

      {projectsList.map((proj, idx) => (
        <div
          key={proj.id}
          className="p-4 bg-neutral-50/50 border border-neutral-200 rounded-xs space-y-3"
        >
          <div className="flex items-center justify-between border-b border-neutral-200/70 pb-2">
            <span className="text-[10px] font-mono uppercase text-neutral-400 font-bold flex items-center gap-1">
              <Code2 className="h-3 w-3" /> Project #{idx + 1}
            </span>
            <button
              type="button"
              onClick={() => handleRemove(proj.id)}
              className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
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
                placeholder="e.g. KagazCV Digital Identity"
                className="w-full border border-neutral-200 bg-white px-3 py-2 text-xs font-mono outline-none focus:border-neutral-950"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase text-neutral-500 mb-1">
                Live URL / GitHub Link
              </label>
              <input
                type="url"
                value={proj.projectUrl}
                onChange={(e) =>
                  handleUpdate(proj.id, "projectUrl", e.target.value)
                }
                placeholder="https://..."
                className="w-full border border-neutral-200 bg-white px-3 py-2 text-xs font-mono outline-none focus:border-neutral-950"
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
              placeholder="e.g. Next.js, Tailwind CSS, Supabase"
              className="w-full border border-neutral-200 bg-white px-3 py-2 text-xs font-mono outline-none focus:border-neutral-950"
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
              placeholder="Briefly explain what this project does and your role..."
              className="w-full border border-neutral-200 bg-white p-2.5 text-xs font-mono outline-none focus:border-neutral-950 resize-none"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
