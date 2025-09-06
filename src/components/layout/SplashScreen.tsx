
import { cn } from '@/lib/utils';

const FlowAILogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 256 256"
    width={props.width || 32}
    height={props.height || 32}
    {...props}
  >
    <defs>
      <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: 'hsl(var(--accent))', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <path
      fill="url(#logo-gradient)"
      d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24Zm-8 168a72 72 0 0 1-72-72c0-32.33 21.41-60.44 51.36-68.89a8 8 0 0 1 9.53 4.11 8 8 0 0 1-4.11 9.53C80.3 103.22 64 128.33 64 156a64 64 0 0 0 128 0c0-29-17.8-54.88-43.25-62.75a8 8 0 0 1 5.5-15.05A88.22 88.22 0 0 1 208 156a88 88 0 0 1-88 88Z"
    />
  </svg>
);


export function SplashScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background animated-gradient-bg animate-fade-out" style={{animationDelay: '1s'}}>
      <div className="animate-splash-pop-in">
        <div className="flex items-center justify-center gap-4">
          <FlowAILogo width={80} height={80} />
        </div>
        <div className="mt-4 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-white">
                FlowAI Studio
            </h1>
        </div>
      </div>
    </div>
  );
}
