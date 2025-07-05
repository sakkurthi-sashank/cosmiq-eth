import { AnimatePresence, cubicBezier, motion } from 'framer-motion';

interface SendButtonProps {
  show: boolean;
  isStreaming?: boolean;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onImagesSelected?: (images: File[]) => void;
}

const customEasingFn = cubicBezier(0.4, 0, 0.2, 1);

export const SendButton = ({ show, isStreaming, disabled, onClick }: SendButtonProps) => {
  return (
    <AnimatePresence>
      {show ? (
        <motion.button
          className="relative flex justify-center items-center p-3 bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white rounded-2xl w-12 h-12 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:shadow-green-500/25 hover:scale-105 active:scale-95 group"
          transition={{ ease: customEasingFn, duration: 0.25 }}
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          disabled={disabled}
          onClick={(event) => {
            event.preventDefault();

            if (!disabled) {
              onClick?.(event);
            }
          }}
        >
          {/* Animated background effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-500 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm"></div>

          {/* Icon container */}
          <div className="relative text-xl font-bold">
            {!isStreaming ? (
              <div className="i-ph:arrow-right group-hover:translate-x-0.5 transition-transform duration-200"></div>
            ) : (
              <div className="i-ph:stop-circle-bold animate-pulse"></div>
            )}
          </div>

          {/* Ripple effect */}
          <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-active:opacity-100 transition-opacity duration-150"></div>
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
};
