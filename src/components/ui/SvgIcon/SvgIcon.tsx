import React from "react";

/**
 * Renders an SVG from /public/icons as a CSS mask so it inherits `currentColor`
 * (the source SVGs are single-colour). Props mirror the subset of lucide-react
 * props used across the site so it can be used as a drop-in replacement.
 */
export interface SvgIconProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "color"> {
  size?: number | string;
  color?: string;
  strokeWidth?: number | string; // accepted for lucide compatibility, ignored
}

interface BaseProps extends SvgIconProps {
  src: string;
}

function SvgIcon({ src, size = 24, color, strokeWidth: _strokeWidth, className, style, ...rest }: BaseProps) {
  const url = `url("/icons/${src}.svg")`;
  const hidden = rest["aria-label"] ? undefined : true;
  return (
    <span
      aria-hidden={hidden}
      {...rest}
      className={className}
      style={{
        display: "inline-block",
        flexShrink: 0,
        width: size,
        height: size,
        backgroundColor: color ?? "currentColor",
        WebkitMaskImage: url,
        maskImage: url,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskSize: "contain",
        maskSize: "contain",
        verticalAlign: "middle",
        ...style,
      }}
    />
  );
}

const make = (src: string) => {
  const Icon = (props: SvgIconProps) => <SvgIcon src={src} {...props} />;
  Icon.displayName = `SvgIcon(${src})`;
  return Icon;
};

// Names intentionally match the lucide-react icons they replace.
export const MapPin = make("mess-location-pin");
export const Compass = make("route");
export const House = make("home");
export const Home = House;
export const Utensils = make("dining");
export const UtensilsCrossed = make("serving-dish");
export const ClipboardList = make("task-list");
export const CalendarCheck = make("verified-cart");
export const Phone = make("customer-support");
export const Mail = make("messages");
export const ShieldCheck = make("verified");
export const BadgeCheck = make("verified");
export const CheckCircle = make("verified");
export const User = make("profile");
export const UserCircle = make("profile");
export const Users = make("user-details");
export const Store = make("mess");
export const Building2 = make("mess");
export const Settings = make("settings");
export const Search = make("search-mess");
export const LogOut = make("logout");
export const AlertTriangle = make("warning");
export const ShieldAlert = make("warning");
export const Bell = make("notifications");
export const Ban = make("prohibited");
export const SlidersHorizontal = make("food-preferences");
export const Box = make("box");
export const Coffee = make("coffee");
export const FeaturedChecklist = make("featured-checklist");
export const Salad = make("salad");
export const Drumstick = make("chicken-drumstick");
export const Leaf = make("vegetables");
