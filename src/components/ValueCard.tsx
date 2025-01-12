import { type LucideIcon } from 'lucide-react';

interface ValueCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function ValueCard({ icon: Icon, title, description }: ValueCardProps) {
  return (
    <div className="group relative overflow-hidden bg-card p-8 rounded-lg shadow-sm hover:shadow-md transition-all">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <Icon className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
      <h3 className="text-xl font-semibold text-card-foreground mb-3">{title}</h3>
      <p className="text-muted-foreground relative z-10">{description}</p>
    </div>
  );
}