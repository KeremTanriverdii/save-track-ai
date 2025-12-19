import * as React from "react";
import { Book, Bus, Car, Film, Heart, House, LucideIcon, RectangleEllipsis, Soup, Store, Utensils, Zap } from "lucide-react";

type CategoryConfig = {
    icon: LucideIcon;
    color: string;
    background?: string;
}
export const CATEGORY_MAP: Record<string, CategoryConfig> = {
    'Food & Dining': { icon: Utensils, color: "#16A34A", background: "#DCFCE7" },
    'Transportation': { icon: Bus, color: "#2563EB", background: "#DBEAFE" },
    'Housing': { icon: Zap, color: "#CA8A04", background: "#FEF9C3" },
    'Utilities': { icon: Store, color: "#EA580C", background: "#FFEDD5" },
    'Entertainment': { icon: Film, color: "#EA580C", background: "#F3E8FF" },
    'Shopping': { icon: Store, color: "#EA580C", background: "#FFEDD5" },
    'Healt': { icon: Heart, color: "#EA580C", background: "#FFEDD5" },
    'Education': { icon: Book, color: "#EA580C", background: "#FFEDD5" },
    'Travel': { icon: Car, color: "#EA580C", background: "#FFEDD5" },
    'Other': { icon: RectangleEllipsis, color: "#EA580C", background: "#FFEDD5" },
}