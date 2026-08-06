import { useTheme } from "../../contexts/ThemeContext";

function Logo({ className = "h-8 w-auto", alt = "Synepho" }) {
  const { theme } = useTheme();
  const src = theme === "dark" ? "/logo-dark.png" : "/logo-light.png";

  return <img src={src} alt={alt} width={141} height={32} className={className} />;
}

export default Logo;
