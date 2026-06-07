import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Row,
  Col,
  Avatar,
  message,
  Typography,
  Select,
  DatePicker,
  Descriptions,
  Tag,
  Spin,
  Modal,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  BankOutlined,
  CameraOutlined,
  EditOutlined,
  SaveOutlined,
  LockOutlined,
} from "@ant-design/icons";
import ChangePasswordModal from "@/components/common/ChangePasswordModal";
import SuccessModal from "@/components/common/SuccessModal";
import axiosClient from "@/api/axiosClient";
import { useAuthImage } from "@/hooks/useAuthImage";
import dayjs from "dayjs";
import {
  getBackendErrorMessage,
  getBackendMessage,
} from "@/utils/backendMessage";
const { Title, Text } = Typography;
const GENDER_LABEL: Record<string, { label: string; color: string }> = {
  MALE: { label: "Nam", color: "#1677ff" },
  FEMALE: { label: "Nữ", color: "#eb2f96" },
  OTHER: { label: "Khác", color: "#722ed1" },
};
const normalizeAvatarFileName = (value?: string | null) =>
  value
    ?.replace(/^.*[/\\]/, "")
    .replace(/^storage\//, "")
    .replace(/^uploads\/avatar\//, "")
    .replace(/^avatar\//, "")
const getUploadedFileName = (payload: any) => {
  const value =
    payload?.data?.fileName ||
    payload?.fileName ||
    (typeof payload?.data === "string" ? payload.data : undefined) ||
    (typeof payload === "string" ? payload : undefined);
  return typeof value === "string" && value.trim()
    ? normalizeAvatarFileName(value.trim())
    : undefined;
};
export default function HrProfile() {
  const [form] = Form.useForm();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [successOpen, setSuccessOpen] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [changePwdOpen, setChangePwdOpen] = useState(false);
  const rawAvatarName = profile?.avatarUrl;
  const avatarFileName = normalizeAvatarFileName(rawAvatarName);
  const apiAvatarUrl = rawAvatarName
    ? `/api/v1/files?fileName=${encodeURIComponent(avatarFileName || rawAvatarName)}&folder=avatar`
    : undefined;
  const fetchedAvatarUrl = useAuthImage(apiAvatarUrl);
  const finalAvatar = avatarPreview ?? fetchedAvatarUrl;
  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const userStr = localStorage.getItem("user");
        const userObj = userStr ? JSON.parse(userStr) : null;
        if (!userObj?.id) throw new Error("Chưa đăng nhập");
        const res = await axiosClient.get(`/api/v1/auth/profile`);
        const data = res.data?.data || res.data;
        if (!data.phone) {
          const phoneCache = JSON.parse(
            localStorage.getItem("user_cache_phone") || "{}",
          );
          if (phoneCache[userObj.id]) data.phone = phoneCache[userObj.id];
        }
        setProfile(data);
      } catch {
        const userStr = localStorage.getItem("user");
        if (userStr) {
          const u = JSON.parse(userStr);
          const phoneCache = JSON.parse(
            localStorage.getItem("user_cache_phone") || "{}",
          );
          if (!u.phone && phoneCache[u.id]) u.phone = phoneCache[u.id];
          setProfile(u);
        }
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);
  const handleEdit = () => {
    setEditing(true);
    form.setFieldsValue({
      name: profile?.name || profile?.fullName || "",
      email: profile?.email || "",
      phone: profile?.phone || "",
      address: profile?.address || "",
      gender: profile?.gender || "MALE",
      dateOfBirth: profile?.dateOfBirth ? dayjs(profile.dateOfBirth) : null,
    });
  };
  const handleCancel = () => {
    setEditing(false);
    setAvatarFile(null);
    setAvatarPreview(null);
    form.resetFields();
  };
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/"))
      return messageApi.error("Vui lòng chọn file hình ảnh!");
    if (file.size > 5 * 1024 * 1024)
      return messageApi.error("Kích thước ảnh tối đa là 5MB");
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    messageApi.success("Đã chọn ảnh! Bấm Lưu để hoàn tất.");
    e.target.value = "";
  };
  const handleSave = async (submittedValues?: any) => {
    try {
      let values: any;
      try {
        values = submittedValues || await form.validateFields();
      } catch (validationErr: any) {
        if (avatarFile || form.isFieldsTouched()) {
          values = {
            name: form.getFieldValue('name') || profile?.name || profile?.fullName || '',
            email: form.getFieldValue('email') || profile?.email || '',
            phone: form.getFieldValue('phone') || profile?.phone || '',
            address: form.getFieldValue('address') || profile?.address || '',
            gender: form.getFieldValue('gender') || profile?.gender || 'MALE',
            dateOfBirth: form.getFieldValue('dateOfBirth') || (profile?.dateOfBirth ? dayjs(profile.dateOfBirth) : null),
          };
        } else {
          throw validationErr;
        }
      }
      setSaving(true);
      const userStr = localStorage.getItem("user");
      const userObj = userStr ? JSON.parse(userStr) : null;
      if (!userObj?.id) {
        messageApi.error("Không tìm thấy ID người dùng!");
        setSaving(false);
        return;
      }
      let uploadedAvatarName = profile?.avatarUrl;
      let didUploadAvatar = false;
      if (avatarFile) {
        try {
          messageApi.open({
            type: "loading",
            content: "Đang tải ảnh lên...",
            key: "upload",
          });
          const formData = new FormData();
          formData.append("file", avatarFile);
          const uploadRes = await axiosClient.post("/api/v1/files", formData, {
            params: { folder: "avatar" },
          });
          const nextAvatarName = getUploadedFileName(uploadRes.data);
          if (!nextAvatarName) {
            throw new Error("Server không trả về tên file sau khi upload.");
          }
          uploadedAvatarName = nextAvatarName;
          didUploadAvatar = true;
          messageApi.success({
            content: getBackendMessage(uploadRes.data, "Tải ảnh xong!"),
            key: "upload",
          });
        } catch (uploadErr: any) {
          console.error("[HR Avatar Upload] Upload failed:", uploadErr);
          messageApi.error({
            content: getBackendErrorMessage(uploadErr, "Tải ảnh thất bại!"),
            key: "upload",
          });
          setSaving(false);
          return;
        }
      }
      const payload = {
        name: values.name,
        phone: values.phone ? values.phone.replace(/[\s\-()]/g, "") : undefined,
        address: values.address,
        gender: values.gender,
        dateOfBirth: values.dateOfBirth
          ? values.dateOfBirth.format("YYYY-MM-DD")
          : null,
        avatarUrl: uploadedAvatarName,
        company: profile?.company ? { id: profile.company.id } : null,
      };
      await axiosClient.put(`/api/v1/auth/profile`, payload);
      const phoneCache = JSON.parse(
        localStorage.getItem("user_cache_phone") || "{}",
      );
      phoneCache[userObj.id] = values.phone;
      localStorage.setItem("user_cache_phone", JSON.stringify(phoneCache));
      const optimisticProfile = {
        ...profile,
        ...payload,
        email: profile?.email || userObj.email,
        role: profile?.role || userObj.role,
        company: profile?.company || userObj.company,
      };
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...userObj,
          name: values.name,
          phone: values.phone,
          address: values.address,
          gender: values.gender,
          dateOfBirth: payload.dateOfBirth,
          avatarUrl: uploadedAvatarName,
        }),
      );
      setProfile(optimisticProfile);
      setEditing(false);
      setAvatarFile(null);
      setAvatarPreview(null);
      window.dispatchEvent(new CustomEvent('profile-updated'));
      try {
        const refreshRes = await axiosClient.get(`/api/v1/auth/profile`);
        const freshData = refreshRes.data?.data || refreshRes.data;
        const mergedFreshData = {
          ...optimisticProfile,
          ...freshData,
          phone: freshData.phone || values.phone,
          avatarUrl: freshData.avatarUrl ?? uploadedAvatarName,
        };
        setProfile(mergedFreshData);
        localStorage.setItem("user", JSON.stringify({ ...userObj, ...mergedFreshData }));
        window.dispatchEvent(new CustomEvent('profile-updated'));
        if (didUploadAvatar && uploadedAvatarName) {
          const persisted = freshData.avatarUrl;
          if (!persisted || (persisted !== uploadedAvatarName && !persisted.includes(uploadedAvatarName))) {
            messageApi.warning(
              "Ảnh đã tải lên nhưng chưa được ghi vào hồ sơ. Vui lòng thử lại.",
              5,
            );
            return;
          }
        }
      } catch {
      }
      setSuccessOpen(true);
    } catch (err: any) {
      console.error("[HR Profile Update] Error:", err?.response?.data || err);
      messageApi.error({
        content: getBackendErrorMessage(
          err,
          "Vui lòng kiểm tra lại thông tin nhập vào!",
        ),
        duration: 4,
      });
    } finally {
      setSaving(false);
    }
  };
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 320,
        }}
      >
        <Spin size="large" tip="Đang tải hồ sơ..." />
      </div>
    );
  }
  const gender = profile?.gender ? GENDER_LABEL[profile.gender] : null;
  const companyName = profile?.company?.name || "—";
  return (
    <div className="page-enter">
      {contextHolder}
      <SuccessModal
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
        title="Cập nhật thành công!"
        description="Thông tin hồ sơ HR đã được lưu lại."
      />
      <div style={{ maxWidth: 1300, margin: "0 auto" }}>
        <div style={{ marginBottom: 24 }}>
          <Title
            level={3}
            style={{ margin: 0, fontWeight: 600, color: "#0f172a" }}
          >
            Hồ sơ cá nhân Nhà tuyển dụng
          </Title>
        </div>
        <Row gutter={24}>
          <Col xs={24} md={8}>
            <Card
              bordered={false}
              style={{
                borderRadius: 8,
                boxShadow:
                  "0 1px 3px rgba(0,0,0,0.02), 0 4px 12px rgba(0,0,0,0.03)",
                textAlign: "center",
                padding: "20px 0",
              }}
            >
              <div
                style={{
                  position: "relative",
                  display: "inline-block",
                  marginBottom: 16,
                }}
              >
                <Avatar
                  size={120}
                  src={finalAvatar}
                  icon={<UserOutlined />}
                  style={{
                    background: finalAvatar
                      ? undefined
                      : "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    border: "4px solid #fff",
                    fontSize: 40,
                    fontWeight: 700,
                  }}
                >
                  {!finalAvatar &&
                    (profile?.name?.charAt(0)?.toUpperCase() || "HR")}
                </Avatar>
                {editing && (
                  <>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      style={{ display: "none" }}
                    />
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        background: "#fff",
                        border: "1px solid #eef0f5",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      }}
                    >
                      <CameraOutlined
                        style={{ color: "#1677ff", fontSize: 16 }}
                      />
                    </div>
                  </>
                )}
              </div>
              <Title level={4} style={{ margin: "0 0 4px", fontSize: 18 }}>
                {profile?.name || profile?.fullName || "HR Manager"}
              </Title>
              <Tag
                color="blue"
                icon={<BankOutlined />}
                style={{ marginBottom: 8 }}
              >
                {companyName}
              </Tag>
              <Button
                icon={<LockOutlined />}
                onClick={() => setChangePwdOpen(true)}
                style={{
                  marginTop: 16,
                  borderRadius: 6,
                  fontWeight: 600,
                  width: "80%",
                  border: "1.5px solid #e5e7eb",
                }}
              >
                Đổi mật khẩu
              </Button>
            </Card>
            <ChangePasswordModal
              open={changePwdOpen}
              onClose={() => setChangePwdOpen(false)}
            />
          </Col>
          <Col xs={24} md={16}>
            <Card
              bordered={false}
              title={
                <span style={{ fontWeight: 600, fontSize: 15 }}>
                  {editing ? "Chỉnh sửa thông tin" : "Thông tin chi tiết"}
                </span>
              }
              extra={
                !editing && (
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={handleEdit}
                    style={{ borderRadius: 6 }}
                  >
                    Chỉnh sửa
                  </Button>
                )
              }
              style={{
                borderRadius: 8,
                boxShadow:
                  "0 1px 3px rgba(0,0,0,0.02), 0 4px 12px rgba(0,0,0,0.03)",
              }}
              bodyStyle={{ padding: "24px 32px" }}
            >
              {!editing ? (
                <Descriptions
                  column={1}
                  labelStyle={{ width: 150, color: "#6b7280", fontWeight: 500 }}
                  contentStyle={{ color: "#111827", fontWeight: 500 }}
                >
                  <Descriptions.Item label="Họ và tên">
                    {profile?.name || profile?.fullName || "—"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Email">
                    {profile?.email || "—"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Số điện thoại">
                    {profile?.phone || "—"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Giới tính">
                    {gender ? (
                      <span style={{ color: gender.color }}>
                        {gender.label}
                      </span>
                    ) : (
                      "—"
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="Ngày sinh">
                    {profile?.dateOfBirth
                      ? dayjs(profile.dateOfBirth).format("DD/MM/YYYY")
                      : "—"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Địa chỉ">
                    {profile?.address || "—"}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={
                      <span>
                        <BankOutlined /> Công ty
                      </span>
                    }
                  >
                    <Tag color="blue">{companyName}</Tag>
                  </Descriptions.Item>
                </Descriptions>
              ) : (
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleSave}
                  onFinishFailed={() => messageApi.error("Vui lòng kiểm tra lại thông tin nhập vào.")}
                >
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="name"
                        label="Họ và tên"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập họ và tên",
                          },
                        ]}
                      >
                        <Input
                          prefix={<UserOutlined style={{ color: "#bfbfbf" }} />}
                          size="large"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="email" label="Email">
                        <Input
                          prefix={<MailOutlined style={{ color: "#bfbfbf" }} />}
                          size="large"
                          disabled
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="phone"
                        label="Số điện thoại"
                        rules={[
                          {
                            pattern: /^((0|\+84)[0-9]{9})?$/,
                            message: "Số điện thoại không hợp lệ",
                          },
                        ]}
                      >
                        <Input
                          prefix={
                            <PhoneOutlined style={{ color: "#bfbfbf" }} />
                          }
                          size="large"
                          placeholder="0xxx xxx xxx"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="address"
                        label="Địa chỉ"
                        rules={[
                          { required: true, message: "Vui lòng nhập địa chỉ" },
                        ]}
                      >
                        <Input
                          prefix={<HomeOutlined style={{ color: "#bfbfbf" }} />}
                          size="large"
                          placeholder="Hà Nội"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="gender"
                        label="Giới tính"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng chọn giới tính",
                          },
                        ]}
                      >
                        <Select
                          size="large"
                          options={[
                            { value: "MALE", label: "Nam" },
                            { value: "FEMALE", label: "Nữ" },
                            { value: "OTHER", label: "Khác" },
                          ]}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="dateOfBirth"
                        label="Ngày sinh"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng chọn ngày sinh",
                          },
                        ]}
                      >
                        <DatePicker
                          format="DD/MM/YYYY"
                          size="large"
                          style={{ width: "100%" }}
                          placeholder="Chọn ngày sinh"
                          disabledDate={(d) => d && d.valueOf() > Date.now()}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={24}>
                      <Form.Item
                        label={
                          <span>
                            <BankOutlined /> Công ty công tác
                          </span>
                        }
                      >
                        <Input
                          value={companyName === "—" ? "" : companyName}
                          disabled
                          size="large"
                          placeholder="Chưa có công ty"
                          style={{
                            background: "#f9fafb",
                            cursor: "not-allowed",
                          }}
                          prefix={<BankOutlined style={{ color: "#bfbfbf" }} />}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <div
                    style={{
                      display: "flex",
                      gap: 12,
                      justifyContent: "flex-end",
                      marginTop: 16,
                    }}
                  >
                    <Button size="large" onClick={handleCancel}>
                      Hủy bỏ
                    </Button>
                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      icon={<SaveOutlined />}
                      loading={saving}
                    >
                      Lưu thay đổi
                    </Button>
                  </div>
                </Form>
              )}
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
