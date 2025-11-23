import { toast } from 'sonner@2.0.3';
import { CheckCircle, XCircle, Info, AlertTriangle } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastOptions {
  title: string;
  description?: string;
  duration?: number;
}

const toastStyles: Record<ToastType, { bg: string; icon: React.ReactNode }> = {
  success: {
    bg: 'var(--green-alert-300)',
    icon: <CheckCircle className="size-5 text-white" />,
  },
  error: {
    bg: 'var(--red-alert-300)',
    icon: <XCircle className="size-5 text-white" />,
  },
  info: {
    bg: 'var(--turquoise-alert-300)',
    icon: <Info className="size-5 text-white" />,
  },
  warning: {
    bg: 'var(--orange-alert-400)',
    icon: <AlertTriangle className="size-5 text-white" />,
  },
};

function createToast(type: ToastType, { title, description, duration = 3000 }: ToastOptions) {
  const style = toastStyles[type];
  
  toast.custom(
    (t) => (
      <div
        className="flex items-center gap-4 px-4 py-3 rounded-lg shadow-lg min-w-[362px]"
        style={{ backgroundColor: style.bg }}
      >
        <div className="shrink-0">{style.icon}</div>
        <div className="flex-1 flex items-center gap-2">
          <div className="h-5 w-px bg-[var(--white-100)]" />
          <div className="flex-1">
            <p className="text-white" style={{ fontSize: '14px', fontWeight: 400, lineHeight: 1.4 }}>
              {title}
            </p>
            {description && (
              <p className="text-white/90 mt-1" style={{ fontSize: '12px', fontWeight: 400, lineHeight: 1.4 }}>
                {description}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={() => toast.dismiss(t)}
          className="shrink-0 text-white hover:opacity-80 transition-opacity"
        >
          <svg className="size-3" fill="none" viewBox="0 0 9 9">
            <path
              d="M4.41407 5.07875L0.821816 8.6835C0.721816 8.7835 0.611566 8.83033 0.491066 8.824C0.370566 8.8175 0.260316 8.76425 0.160316 8.66425C0.0603162 8.56425 0.0103162 8.45083 0.0103162 8.324C0.0103162 8.197 0.0603162 8.0835 0.160316 7.9835L3.74582 4.4105L0.141066 0.83075C0.0410657 0.73075 -0.0057675 0.618833 0.000565832 0.495C0.00706583 0.371333 0.0603162 0.256333 0.160316 0.15C0.260316 0.05 0.373732 0 0.500566 0C0.627566 0 0.741066 0.05 0.841066 0.15L4.41407 3.75475L7.99382 0.15C8.09382 0.05 8.20248 0 8.31982 0C8.43715 0 8.54898 0.05 8.65532 0.15C8.75082 0.251833 8.79857 0.36575 8.79857 0.49175C8.79857 0.61775 8.75082 0.73075 8.65532 0.83075L5.06982 4.4105L8.67457 8.00275C8.77457 8.10275 8.82457 8.213 8.82457 8.3335C8.82457 8.454 8.77457 8.56425 8.67457 8.66425C8.57273 8.76625 8.45882 8.81725 8.33282 8.81725C8.20682 8.81725 8.09382 8.76625 7.99382 8.66425L4.41407 5.07875Z"
              fill="white"
            />
          </svg>
        </button>
      </div>
    ),
    { duration }
  );
}

export const showToast = {
  success: (options: ToastOptions) => createToast('success', options),
  error: (options: ToastOptions) => createToast('error', options),
  info: (options: ToastOptions) => createToast('info', options),
  warning: (options: ToastOptions) => createToast('warning', options),
};
