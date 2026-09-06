interface FormSectionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBgColor: string;
  children: React.ReactNode;
}

export default function FormSection({ title, description, icon, iconBgColor, children }: FormSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-4">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: iconBgColor }}
        >
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          <p className="text-sm text-slate-500 mt-1">{description}</p>
        </div>
      </div>
      <div className="ml-0 md:ml-16">{children}</div>
    </div>
  );
}
