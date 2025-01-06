import { type LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  number: string;
  label: string;
}

export function StatCard({ icon: Icon, number, label }: StatCardProps) {
  return (
    <div className="group bg-card hover:bg-accent transition-all duration-300 p-8 rounded-lg shadow-sm hover:shadow-md">
      <Icon className="w-10 h-10 text-primary mb-4 group-hover:scale-110 transition-transform" />
      <h3 className="text-4xl font-bold text-card-foreground mb-2">{number}</h3>
      <p className="text-muted-foreground">{label}</p>
    </div>
  );
}