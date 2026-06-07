import React, { useEffect } from "react";
import { Modal } from "antd";
interface SuccessModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  autoCloseMs?: number;
}
const SuccessModal: React.FC<SuccessModalProps> = ({
  open,
  onClose,
  title = "Cập nhật thành công!",
  description = "Thông tin của bạn đã được lưu lại.",
  autoCloseMs = 2800,
}) => {
  useEffect(() => {
    if (!open || !autoCloseMs) return;
    const timer = setTimeout(onClose, autoCloseMs);
    return () => clearTimeout(timer);
  }, [open, autoCloseMs, onClose]);
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={380}
      closable={false}
      maskClosable
      bodyStyle={{ padding: 0 }}
      className="success-modal-root"
    >
      <div className="success-modal-body">
        <div className="success-modal-icon">
          <svg viewBox="0 0 52 52" className="success-checkmark">
            <circle
              className="success-checkmark__circle"
              cx="26"
              cy="26"
              r="24"
              fill="none"
            />
            <path
              className="success-checkmark__check"
              fill="none"
              d="M14.1 27.2l7.1 7.2 16.7-16.8"
            />
          </svg>
        </div>
        <h3 className="success-modal-title">{title}</h3>
        <p className="success-modal-desc">{description}</p>
        <button className="success-modal-btn" onClick={onClose}>
          Tuyệt vời!
        </button>
      </div>
      <style>{`
        /* ── Modal overrides ── */
        .success-modal-root .ant-modal-content {
          border-radius: 20px !important;
          overflow: hidden;
          box-shadow: 0 24px 64px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06);
        }
        /* ── Body ── */
        .success-modal-body {
          padding: 44px 36px 36px;
          text-align: center;
          background: linear-gradient(180deg, #f0fdf4 0%, #ffffff 60%);
          animation: smFadeIn 0.35s ease both;
        }
        /* ── Animated SVG Check ── */
        .success-modal-icon {
          width: 72px;
          height: 72px;
          margin: 0 auto 22px;
          border-radius: 50%;
        }
        .success-checkmark {
          width: 72px;
          height: 72px;
          display: block;
        }
        .success-checkmark__circle {
          stroke-dasharray: 166;
          stroke-dashoffset: 166;
          stroke-width: 2.4;
          stroke-miterlimit: 10;
          stroke: #22c55e;
          fill: none;
          animation: smStroke 0.55s cubic-bezier(0.65,0,0.45,1) forwards;
        }
        .success-checkmark__check {
          transform-origin: 50% 50%;
          stroke-dasharray: 48;
          stroke-dashoffset: 48;
          stroke: #22c55e;
          stroke-width: 3;
          stroke-linecap: round;
          stroke-linejoin: round;
          animation: smStroke 0.3s cubic-bezier(0.65,0,0.45,1) 0.4s forwards;
        }
        /* ── Title ── */
        .success-modal-title {
          margin: 0 0 6px;
          font-size: 20px;
          font-weight: 700;
          color: #111827;
          letter-spacing: -0.01em;
        }
        /* ── Description ── */
        .success-modal-desc {
          margin: 0 0 28px;
          font-size: 14px;
          color: #6b7280;
          line-height: 1.5;
        }
        /* ── Button ── */
        .success-modal-btn {
          display: block;
          width: 100%;
          height: 46px;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 700;
          color: #fff;
          cursor: pointer;
          background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
          box-shadow: 0 4px 16px rgba(34,197,94,0.3);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .success-modal-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 24px rgba(34,197,94,0.4);
        }
        .success-modal-btn:active {
          transform: translateY(0);
          box-shadow: 0 2px 8px rgba(34,197,94,0.25);
        }
        /* ── Animations ── */
        @keyframes smStroke {
          100% { stroke-dashoffset: 0; }
        }
        @keyframes smFadeIn {
          from { opacity: 0; transform: scale(0.92); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </Modal>
  );
};
export default SuccessModal;
