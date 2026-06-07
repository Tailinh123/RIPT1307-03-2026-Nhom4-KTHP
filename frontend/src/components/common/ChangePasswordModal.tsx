import React, { useState } from "react";
import { Modal, Form, Input, Button, message, Typography } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { userApi } from "@/api/userApi";
import { getBackendErrorMessage, getBackendMessage } from "@/utils/backendMessage";
import SuccessModal from "@/components/common/SuccessModal";
const { Title, Text } = Typography;
interface ChangePasswordModalProps {
  open: boolean;
  onClose: () => void;
}
const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  open,
  onClose,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("Mật khẩu của bạn đã được cập nhật.");
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      const res = await userApi.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      });
      setSuccessMessage(getBackendMessage(res, "Mật khẩu của bạn đã được cập nhật."));
      setSuccess(true);
      form.resetFields();
    } catch (err: any) {
      if (err?.errorFields) return;
      message.error(
        getBackendErrorMessage(err, "Đổi mật khẩu thất bại! Vui lòng kiểm tra lại.")
      );
    } finally {
      setLoading(false);
    }
  };
  const handleClose = () => {
    setSuccess(false);
    setSuccessMessage("Mật khẩu của bạn đã được cập nhật.");
    form.resetFields();
    onClose();
  };
  if (success) {
    return (
      <SuccessModal
        open={open}
        onClose={handleClose}
        title="Đổi mật khẩu thành công!"
        description={successMessage}
      />
    );
  }
  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={null}
      centered
      width={440}
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "linear-gradient(135deg, #1677ff 0%, #4096ff 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LockOutlined style={{ color: "#fff", fontSize: 18 }} />
          </div>
          <span style={{ fontWeight: 700, fontSize: 16, color: "#111827" }}>
            Đổi mật khẩu
          </span>
        </div>
      }
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        style={{ marginTop: 16 }}
        onFinish={handleSubmit}
      >
        <Form.Item
          name="currentPassword"
          label={
            <span style={{ fontWeight: 600, color: "#374151" }}>
              Mật khẩu hiện tại
            </span>
          }
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu hiện tại" }]}
        >
          <Input.Password
            prefix={<LockOutlined style={{ color: "#9ca3af" }} />}
            size="large"
            placeholder="Nhập mật khẩu hiện tại"
            style={{ borderRadius: 8 }}
          />
        </Form.Item>
        <Form.Item
          name="newPassword"
          label={
            <span style={{ fontWeight: 600, color: "#374151" }}>
              Mật khẩu mới
            </span>
          }
          dependencies={["currentPassword"]}
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu mới" },
            { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("currentPassword") !== value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Mật khẩu mới không được trùng với mật khẩu hiện tại"));
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined style={{ color: "#9ca3af" }} />}
            size="large"
            placeholder="Nhập mật khẩu mới"
            style={{ borderRadius: 8 }}
          />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          label={
            <span style={{ fontWeight: 600, color: "#374151" }}>
              Xác nhận mật khẩu mới
            </span>
          }
          dependencies={["newPassword"]}
          rules={[
            { required: true, message: "Vui lòng xác nhận mật khẩu mới" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Mật khẩu xác nhận không khớp!"));
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined style={{ color: "#9ca3af" }} />}
            size="large"
            placeholder="Nhập lại mật khẩu mới"
            style={{ borderRadius: 8 }}
          />
        </Form.Item>
        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "flex-end",
            marginTop: 8,
            paddingTop: 16,
            borderTop: "1px solid #f0f0f0",
          }}
        >
          <Button size="large" onClick={handleClose} style={{ borderRadius: 8 }}>
            Hủy bỏ
          </Button>
          <Button
            type="primary"
            size="large"
            htmlType="submit"
            loading={loading}
            style={{
              borderRadius: 8,
              fontWeight: 700,
              background: "linear-gradient(135deg, #1677ff 0%, #4096ff 100%)",
              border: "none",
              boxShadow: "0 4px 16px rgba(22,119,255,0.35)",
            }}
          >
            Xác nhận đổi mật khẩu
          </Button>
        </div>
      </Form>
    </Modal>
  );
};
export default ChangePasswordModal;
