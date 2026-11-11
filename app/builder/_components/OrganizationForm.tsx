// app/dashboard/builder/_components/OrganizationForm.tsx
"use client";

export interface OrgData {
  orgName: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  description: string;
  services: string;
  workingHours: string;
}

interface OrgFormProps {
  data: OrgData;
  setData: React.Dispatch<React.SetStateAction<OrgData>>;
}

export default function OrganizationForm({ data, setData }: OrgFormProps) {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="border-b border-neutral-300 pb-3">
        <h3 className="text-sm font-mono uppercase tracking-wider text-neutral-950 font-bold">
          Organization Profile
        </h3>
        <p className="text-xs text-neutral-600 font-normal">
          Business details for official catalog & notice.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-neutral-800 font-medium mb-1.5">
            Organization / Business Name
          </label>
          <input
            type="text"
            name="orgName"
            value={data.orgName}
            onChange={handleChange}
            placeholder="e.g. Apex Digital Services"
            className="w-full border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-950 outline-none focus:border-neutral-950 placeholder:text-neutral-400"
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-neutral-800 font-medium mb-1.5">
            Business Tagline / Category
          </label>
          <input
            type="text"
            name="tagline"
            value={data.tagline}
            onChange={handleChange}
            placeholder="e.g. Cyber Cafe & Document Processing"
            className="w-full border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-950 outline-none focus:border-neutral-950 placeholder:text-neutral-400"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-800 font-medium mb-1.5">
              Official Email
            </label>
            <input
              type="email"
              name="email"
              value={data.email}
              onChange={handleChange}
              placeholder="contact@business.com"
              className="w-full border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-950 outline-none focus:border-neutral-950 placeholder:text-neutral-400"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-800 font-medium mb-1.5">
              Support / Desk Phone
            </label>
            <input
              type="text"
              name="phone"
              value={data.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              className="w-full border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-950 outline-none focus:border-neutral-950 placeholder:text-neutral-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-neutral-800 font-medium mb-1.5">
            Physical Store / Office Address
          </label>
          <input
            type="text"
            name="address"
            value={data.address}
            onChange={handleChange}
            placeholder="Shop No. 4, Station Road, City"
            className="w-full border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-950 outline-none focus:border-neutral-950 placeholder:text-neutral-400"
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-neutral-800 font-medium mb-1.5">
            Operating Hours
          </label>
          <input
            type="text"
            name="workingHours"
            value={data.workingHours}
            onChange={handleChange}
            placeholder="Mon - Sat: 10:00 AM - 09:00 PM"
            className="w-full border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-950 outline-none focus:border-neutral-950 placeholder:text-neutral-400"
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-neutral-800 font-medium mb-1.5">
            Services & Products Offered (Comma separated)
          </label>
          <textarea
            rows={2}
            name="services"
            value={data.services}
            onChange={handleChange}
            placeholder="Color Printing, Online Forms, Passport Application, Lamination"
            className="w-full border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-950 outline-none focus:border-neutral-950 placeholder:text-neutral-400 resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-neutral-800 font-medium mb-1.5">
            About Organization / Terms
          </label>
          <textarea
            rows={3}
            name="description"
            value={data.description}
            onChange={handleChange}
            placeholder="Brief overview of services provided, institutional values, or client guidelines..."
            className="w-full border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-950 outline-none focus:border-neutral-950 placeholder:text-neutral-400 resize-none"
          />
        </div>
      </div>
    </div>
  );
}
