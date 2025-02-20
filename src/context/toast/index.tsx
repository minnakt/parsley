import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import styled from "@emotion/styled";
import Toast, { Variant } from "@leafygreen-ui/toast";
import { zIndex } from "constants/tokens";
import {
  TOAST_TIMEOUT,
  mapToastToLeafyGreenVariant,
  mapVariantToTitle,
} from "./constants";
import {
  DispatchToast,
  DispatchToastWithProgress,
  VisibleToast,
} from "./types";

export interface ToastContextState {
  success: DispatchToast;
  warning: DispatchToast;
  error: DispatchToast;
  info: DispatchToast;
  progress: DispatchToastWithProgress;
  hide: () => void;
}

export const ToastContext = createContext<ToastContextState | null>(null);

const useToastContext = (): ToastContextState => {
  const context = useContext(ToastContext);
  if (context === null || context === undefined) {
    throw new Error("useToastContext must be used within a ToastProvider");
  }
  return context;
};

const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toastOpen, setToastOpen] = useState(false);
  const [visibleToast, setVisibleToast] = useState<VisibleToast>({
    variant: Variant.Note,
    title: "",
    message: "",
    closable: true,
    onClose: () => {},
    shouldTimeout: true,
    progress: undefined,
  });

  useEffect(() => {
    if (!visibleToast.shouldTimeout) {
      return;
    }
    const timeout = setTimeout(() => {
      hideToast();
    }, TOAST_TIMEOUT);
    return () => clearTimeout(timeout);
  });

  const dispatchToast = useCallback(
    (toast: VisibleToast) => {
      setVisibleToast(toast);
      setToastOpen(true);
    },
    [setVisibleToast, setToastOpen]
  );

  const hideToast = useCallback(() => {
    setToastOpen(false);
  }, [setToastOpen]);

  const memoizedContext = useMemo(() => {
    const defaultOptions = {
      onClose: () => {},
      shouldTimeout: true,
      title: "",
    };

    return {
      success: (message = "", closable = true, options = {}) =>
        dispatchToast({
          variant: mapToastToLeafyGreenVariant.success,
          message,
          closable,
          ...defaultOptions,
          ...options,
        }),
      warning: (message = "", closable = true, options = {}) =>
        dispatchToast({
          variant: mapToastToLeafyGreenVariant.warning,
          message,
          closable,
          ...defaultOptions,
          ...options,
        }),
      error: (message = "", closable = true, options = {}) =>
        dispatchToast({
          variant: mapToastToLeafyGreenVariant.error,
          message,
          closable,
          ...defaultOptions,
          ...options,
        }),
      info: (message = "", closable = true, options = {}) =>
        dispatchToast({
          variant: mapToastToLeafyGreenVariant.info,
          message,
          closable,
          ...defaultOptions,
          ...options,
        }),
      progress: (message = "", progress = 0.5, closable = true, options = {}) =>
        dispatchToast({
          variant: mapToastToLeafyGreenVariant.progress,
          message,
          progress,
          closable,
          ...defaultOptions,
          ...options,
        }),
      hide: hideToast,
    };
  }, [dispatchToast, hideToast]);

  return (
    <ToastContext.Provider value={memoizedContext}>
      {children}
      <StyledToast
        body={<Message>{visibleToast.message}</Message>}
        close={
          visibleToast.closable
            ? () => {
                visibleToast.onClose();
                setToastOpen(false);
              }
            : undefined
        }
        data-cy="toast"
        data-variant={visibleToast.variant}
        open={toastOpen}
        progress={visibleToast.progress}
        title={visibleToast.title || mapVariantToTitle[visibleToast.variant]}
        variant={visibleToast.variant}
      />
    </ToastContext.Provider>
  );
};

const StyledToast = styled(Toast)`
  z-index: ${zIndex.toast};
`;

const Message = styled.span`
  word-break: break-word;
`;

export { ToastProvider, useToastContext };
