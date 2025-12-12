import React from "react";
import Card from "@/components/elements/base/card/Card";
import Portal from "@/components/elements/portal";

interface ExpiryModalProps {
  expirations: Array<{
    minutes: number;
    expirationTime: Date;
  }>;
  expiry: {
    minutes: number;
    expirationTime: Date;
  };
  setExpiry: (exp: { minutes: number; expirationTime: Date }) => void;
  setIsModalOpen: (open: boolean) => void;
  formatTime: (timeLeft: number) => string;
  t: (key: string) => string;
}

const ExpiryModal: React.FC<ExpiryModalProps> = ({
  expirations,
  expiry,
  setExpiry,
  setIsModalOpen,
  formatTime,
  t,
}) => {
  return (
    <Portal onClose={() => setIsModalOpen(false)}>
      <Card className="max-w-md p-5">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-lg font-bold text-muted-700 dark:text-muted-300">
            {t("Expiry Time")}
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {expirations.map((exp) => {
            const timeLeft = Math.round(
              (exp.expirationTime.getTime() - Date.now()) / 1000
            );
            const isDisabled = timeLeft < 50;

            return (
              <button
                key={exp.minutes}
                type="button"
                className={`w-full flex justify-between min-w-64 text-left p-2 mb-2 text-md border rounded transition-colors ${
                  isDisabled
                    ? "text-danger-500 border-danger-500 cursor-not-allowed dark:text-danger-500 dark:border-danger-500"
                    : "hover:bg-muted-100 dark:hover:bg-muted-700 text-muted-700 dark:text-muted-200 border-muted-200 dark:border-muted-700"
                } ${
                  expiry.minutes === exp.minutes
                    ? "bg-muted-200 dark:bg-muted-700"
                    : ""
                }`}
                onClick={() => {
                  if (!isDisabled) {
                    setExpiry(exp);
                    setIsModalOpen(false);
                  }
                }}
                disabled={isDisabled}
              >
                <span>
                  {exp.minutes} {t("min")}
                </span>
                <span>({formatTime(timeLeft)})</span>
              </button>
            );
          })}
        </div>
      </Card>
    </Portal>
  );
};

export default ExpiryModal;
