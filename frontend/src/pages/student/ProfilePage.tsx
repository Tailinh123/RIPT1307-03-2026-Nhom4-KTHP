import React, { useEffect, useState, useRef } from "react";
import {
  Card,
  Typography,
  Button,
  Form,
  Input,
  Select,
  Tag,
  Avatar,
  Row,
  Col,
  Spin,
  Alert,
  message,
  Descriptions,
  DatePicker,
  Tabs,
  Space,
  Modal,
  Pagination,
} from "antd";
import {
  UserOutlined,
  EditOutlined,
  SaveOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  WarningOutlined,
  CameraOutlined,
  FileTextOutlined,
  LinkOutlined,
  LockOutlined,
} from "@ant-design/icons";
import ChangePasswordModal from "@/components/common/ChangePasswordModal";
import SuccessModal from "@/components/common/SuccessModal";
import dayjs from "dayjs";
import { useProfile } from "@/hooks/useProfile";
import { useSkills } from "@/hooks/useSkills";
import { useAuthImage } from "@/hooks/useAuthImage";
import axiosClient from "@/api/axiosClient";
import {
  getBackendErrorMessage,
  getBackendMessage,
} from "@/utils/backendMessage";
import EmptyState from "@/components/common/EmptyState";
import { useSearchParams } from "react-router-dom";
const { Title, Text } = Typography;
const GENDER_LABEL: Record<string, { label: string; color: string }> = {
  MALE: { label: "Nam", color: "#1677ff" },
  FEMALE: { label: "Nữ", color: "#eb2f96" },
  OTHER: { label: "Khác", color: "#722ed1" },
};
const SkillChip: React.FC<{ name: string; onClose?: () => void }> = ({
  name,
  onClose,
}) => (
  <Tag
    closable={!!onClose}
    onClose={onClose}
    style={{
      background: "#e6f4ff",
      color: "#1677ff",
      border: "1px solid #91caff",
      borderRadius: 6,
      padding: "4px 12px",
      fontSize: 13,
      fontWeight: 500,
    }}
  >
    {name}
  </Tag>
);
function buildResumeDisplayUrl(
  rawResumeUrl: string | undefined | null,
): string | undefined {
  if (!rawResumeUrl) return undefined;
  if (isExternalResumeUrl(rawResumeUrl)) {
    return rawResumeUrl;
  }
  const fileNameOnly = extractResumeFileName(rawResumeUrl);
  if (!fileNameOnly) return undefined;
  return `/api/v1/files?fileName=${encodeURIComponent(fileNameOnly)}&folder=resume`;
}
function isExternalResumeUrl(rawResumeUrl: string): boolean {
  return /^https?:\/\//i.test(rawResumeUrl)
    && !rawResumeUrl.includes("/api/v1/files")
    && !rawResumeUrl.includes("/storage/");
}
function extractResumeFileName(rawResumeUrl: string | undefined | null): string | undefined {
  if (!rawResumeUrl) return undefined;
  try {
    const url = new URL(rawResumeUrl, window.location.origin);
    const fileName = url.searchParams.get("fileName");
    if (fileName) return fileName;
  } catch {
  }
  const fileNameOnly = rawResumeUrl
    .replace(/\\/g, "/")
    .split("?")[0]
    .replace(/^https?:\/\/[^/]+/i, "")
    .replace(/^.*[/\\]/, "")
    .replace(/^storage\//, "")
    .replace(/^uploads\/resume\//, "")
    .replace(/^resume\//, "")
    .replace(/^cv\//, "")
  return fileNameOnly || undefined;
}
const ProfilePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "profile";
  const { profile, loading, connectionError, fetchProfile, updateProfile } =
    useProfile();
  const { skills: allSkills } = useSkills();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [resumes, setResumes] = useState<any[]>([]);
  const [resumePage, setResumePage] = useState(1);
  const [resumesLoading, setResumesLoading] = useState(false);
  const [changePwdOpen, setChangePwdOpen] = useState(false);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const rawAvatarName = (profile as any)?.avatarUrl;
  const apiAvatarUrl = rawAvatarName
    ? `/api/v1/files?fileName=${encodeURIComponent(
        rawAvatarName.replace(/^storage\//, "").replace(/^avatar\//, "")
      )}&folder=avatar`
    : undefined;
  const fetchedAvatarUrl = useAuthImage(apiAvatarUrl);
  const finalAvatarToDisplay = avatarPreview ?? fetchedAvatarUrl;
  useEffect(() => {
    fetchProfile();
    const loadResumes = async () => {
      setResumesLoading(true);
      try {
        const res = await axiosClient.get("/api/v1/resumes/by-user", {
          params: { page: 1, size: 100 },
        });
        const data = res.data?.data?.result || res.data?.data || [];
        setResumes(Array.isArray(data) ? data : []);
      } catch {
        setResumes([]);
      } finally {
        setResumesLoading(false);
      }
    };
    loadResumes();
  }, [fetchProfile]);
  const handleViewCV = async (rawCv: string) => {
    try {
      if (!rawCv) return;
      if (isExternalResumeUrl(rawCv)) {
        window.open(rawCv, "_blank", "noopener,noreferrer");
        return;
      }
      const fileName = extractResumeFileName(rawCv);
      if (!fileName) {
        throw new Error("Không xác định được tên file CV.");
      }
      const win = window.open("", "_blank");
      if (win) {
        win.document.write("<html><head><title>Đang tải CV...</title></head><body style='font-family: sans-serif; padding: 20px; text-align: center;'>Đang tải dữ liệu CV... Vui lòng đợi.</body></html>");
      }
      messageApi.loading({ content: "Đang tải CV...", key: "cv-load" });
      try {
        const res = await axiosClient.get("/api/v1/files", {
          params: { fileName, folder: "resume" },
          responseType: "blob",
        });
        const ext = fileName.split(".").pop()?.toLowerCase();
        const mimeType = ext === "pdf" ? "application/pdf" : ext === "doc" ? "application/msword" : ext === "docx" ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document" : "application/octet-stream";
        const viewBlob = new Blob([res.data as Blob], { type: mimeType });
        const objectUrl = URL.createObjectURL(viewBlob);
        if (win) {
          win.location.href = objectUrl;
        } else {
          const link = document.createElement("a");
          link.href = objectUrl;
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
        setTimeout(() => URL.revokeObjectURL(objectUrl), 30000);
        messageApi.success({ content: "Đã mở CV", key: "cv-load", duration: 1.5 });
      } catch (err: any) {
        const status = err?.response?.status;
        const errorMessage = status === 404
          ? "Không tìm thấy file CV trên server."
          : status === 403
            ? "Bạn không có quyền truy cập file CV này."
            : getBackendErrorMessage(err, "Không thể tải CV. Vui lòng thử lại.");
        if (win) {
          win.document.body.innerHTML = "";
          const errorBox = win.document.createElement("div");
          errorBox.style.fontFamily = "sans-serif";
          errorBox.style.padding = "24px";
          errorBox.style.textAlign = "center";
          errorBox.style.color = "#b42318";
          errorBox.textContent = errorMessage;
          win.document.body.appendChild(errorBox);
        }
        messageApi.error({ content: errorMessage, key: "cv-load" });
      }
    } catch (err: any) {
      messageApi.error(getBackendErrorMessage(err, "Không thể mở CV."));
    }
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
    e.target.value = "";
  };
  const handleEdit = () => {
    setEditing(true);
    form.setFieldsValue({
      fullName: profile?.name || profile?.fullName || "",
      phone: profile?.phone || "",
      gender: profile?.gender || undefined,
      address: profile?.address,
      dob: profile?.dateOfBirth ? dayjs(profile?.dateOfBirth) : null,
      skills: profile?.skills?.map((s: any) => s.id) || [],
    });
  };
  const handleCancel = () => {
    setEditing(false);
    setAvatarFile(null);
    setAvatarPreview(null);
    form.resetFields();
  };
  const handleSave = async () => {
    try {
      await form.validateFields();
    } catch {
      return;
    }
    setSaving(true);
    if (!profile?.id) {
      messageApi.error("Không tìm thấy ID người dùng!");
      setSaving(false);
      return;
    }
    let uploadedAvatarName: string | undefined = (profile as any)?.avatarUrl;
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
        const extractedName =
          uploadRes.data?.data?.fileName ||
          uploadRes.data?.fileName ||
          (typeof uploadRes.data?.data === "string" ? uploadRes.data.data : undefined) ||
          (typeof uploadRes.data === "string" ? uploadRes.data : undefined);
        if (!extractedName) {
          throw new Error("Server không trả về tên file sau khi upload.");
        }
        uploadedAvatarName = extractedName;
        didUploadAvatar = true;
        messageApi.open({
          type: "success",
          content: "Tải ảnh lên thành công.",
          key: "upload",
          duration: 1,
        });
      } catch (uploadErr: any) {
        messageApi.error({
          content: getBackendErrorMessage(
            uploadErr,
            "Tải ảnh thất bại! Hãy kiểm tra lại API upload.",
          ),
          key: "upload",
        });
        setSaving(false);
        return;
      }
    }
    const values = form.getFieldsValue();
    const payload = {
      id: profile.id,
      name: values.fullName || profile?.name || profile?.fullName,
      phone: values.phone?.trim() ? values.phone.trim().replace(/[\s\-()]/g, "") : undefined,
      avatarUrl: uploadedAvatarName,
      skills: (values.skills || []).map((id: number) => ({ id })),
      dateOfBirth: values.dob ? values.dob.format("YYYY-MM-DD") : null,
      address: values.address || undefined,
      gender: values.gender || undefined,
    };
    try {
      const updateResult = await updateProfile(payload as any);
      const freshProfile = await fetchProfile();
      const currentUserStr = localStorage.getItem("user");
      if (currentUserStr) {
        const currentUser = JSON.parse(currentUserStr);
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...currentUser,
            name: freshProfile?.name || freshProfile?.fullName || payload.name,
            fullName: freshProfile?.fullName || freshProfile?.name || payload.name,
            avatarUrl: freshProfile?.avatarUrl ?? uploadedAvatarName,
          }),
        );
      }
      setEditing(false);
      setAvatarFile(null);
      setAvatarPreview(null);
      if (didUploadAvatar && uploadedAvatarName) {
        const persisted = freshProfile?.avatarUrl;
        if (!persisted || (persisted !== uploadedAvatarName && !persisted.includes(uploadedAvatarName))) {
          messageApi.warning(
            "Ảnh đã tải lên nhưng chưa được ghi vào hồ sơ. Vui lòng thử lại.",
            5,
          );
          return;
        }
      }
      window.dispatchEvent(new CustomEvent("profile-updated"));
      setSuccessVisible(true);
    } catch (err: any) {
      messageApi.error(
        getBackendErrorMessage(err, "Lỗi khi lưu dữ liệu lên máy chủ!"),
      );
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
        <Spin size="large" tip="Đang lấy dữ liệu từ Database..." />
      </div>
    );
  }
  const displayGender = profile?.gender;
  const gender = displayGender ? GENDER_LABEL[displayGender] : null;
  const displayName = profile?.name || profile?.fullName || "Chưa cập nhật";
  const displayEmail = profile?.email || "—";
  const displayPhone = profile?.phone || "—";
  const displayDob = profile?.dateOfBirth;
  let formattedDob = "Chưa cập nhật";
  if (displayDob) {
    formattedDob = dayjs(displayDob).format("DD/MM/YYYY");
  }
  const displayAddress = profile?.address || "—";
  const displaySkills = profile?.skills || [];

  const resumePageSize = 5;
  const sortedResumes = [...resumes].sort((a, b) => {
    const timeA = a.createdAt ? dayjs(a.createdAt).valueOf() : 0;
    const timeB = b.createdAt ? dayjs(b.createdAt).valueOf() : 0;
    return timeB - timeA; // Mới nhất lên đầu
  });
  const paginatedResumes = sortedResumes.slice((resumePage - 1) * resumePageSize, resumePage * resumePageSize);
  return (
    <div
      className="page-enter"
      style={{ maxWidth: 1180, margin: "0 auto", padding: "24px" }}
    >
      {contextHolder}
      <SuccessModal
        open={successVisible}
        onClose={() => setSuccessVisible(false)}
        title="Cập nhật thành công!"
        description="Thông tin cá nhân của bạn đã được lưu lại."
      />
      {connectionError && (
        <Alert
          type="warning"
          showIcon
          icon={<WarningOutlined />}
          message="Không kết nối được Backend"
          description={connectionError}
          style={{ marginBottom: 20, borderRadius: 8 }}
        />
      )}
      <Tabs 
        activeKey={activeTab} 
        onChange={(key) => setSearchParams({ tab: key })}
      >
        <Tabs.TabPane tab="Thông tin cá nhân" key="profile">
          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
              <Card
                bordered={false}
                style={{
                  borderRadius: 16,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                  textAlign: "center",
                  padding: "30px 10px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: "0 24px 12px",
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
                      size={140}
                      src={finalAvatarToDisplay}
                      icon={!finalAvatarToDisplay ? <UserOutlined /> : undefined}
                      style={{
                        background: finalAvatarToDisplay
                          ? undefined
                          : "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                        fontSize: 48,
                        fontWeight: 700,
                        boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                        border: "5px solid #fff",
                      }}
                    >
                      {!finalAvatarToDisplay &&
                        displayName.charAt(0).toUpperCase()}
                    </Avatar>
                    {editing && (
                      <>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          style={{
                            position: "absolute",
                            bottom: 0,
                            right: 0,
                            width: 32,
                            height: 32,
                            opacity: 0,
                            cursor: "pointer",
                            zIndex: 2,
                          }}
                        />
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          title="Đổi ảnh đại diện"
                          style={{
                            position: "absolute",
                            bottom: 0,
                            right: 0,
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            background: "linear-gradient(135deg, #1677ff, #4096ff)",
                            border: "2px solid #fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            boxShadow: "0 2px 8px rgba(22,119,255,0.35)",
                            transition: "transform 0.2s ease",
                          }}
                          onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.1)")}
                          onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                        >
                          <CameraOutlined style={{ color: "#fff", fontSize: 14 }} />
                        </div>
                      </>
                    )}
                  </div>
                  <Title level={4} style={{ margin: 0, color: "#111827", fontSize: 22 }}>
                    {displayName}
                  </Title>
                  <Text
                    style={{
                      color: "#6b7280",
                      display: "block",
                      marginBottom: 16,
                      fontSize: 15,
                    }}
                  >
                    {displayEmail}
                  </Text>
                  <Tag
                    color="blue"
                    style={{
                      borderRadius: 20,
                      padding: "4px 14px",
                      fontWeight: 600,
                      fontSize: 12,
                    }}
                  >
                    ✓ Ứng viên
                  </Tag>
                  <Button
                    icon={<LockOutlined />}
                    onClick={() => setChangePwdOpen(true)}
                    size="large"
                    style={{
                      marginTop: 24,
                      borderRadius: 10,
                      fontWeight: 600,
                      width: "85%",
                      border: "1.5px solid #e5e7eb",
                    }}
                  >
                    Đổi mật khẩu
                  </Button>
                </div>
              </Card>
              <ChangePasswordModal
                open={changePwdOpen}
                onClose={() => setChangePwdOpen(false)}
              />
            </Col>
            <Col xs={24} md={16}>
              <Card
                title={
                  <span style={{ fontWeight: 700, fontSize: 16, color: "#111827" }}>
                    {editing ? "Chỉnh sửa thông tin" : "Thông tin cá nhân"}
                  </span>
                }
                extra={
                  !editing && (
                    <Button
                      type="primary"
                      icon={<EditOutlined />}
                      onClick={handleEdit}
                      style={{
                        borderRadius: 8,
                        fontWeight: 600,
                        background: "linear-gradient(135deg, #1677ff 0%, #4096ff 100%)",
                        border: "none",
                        boxShadow: "0 2px 8px rgba(22,119,255,0.25)",
                      }}
                    >
                      Chỉnh sửa
                    </Button>
                  )
                }
                style={{
                  borderRadius: 16,
                  border: "none",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
                }}
                bodyStyle={{ padding: "32px 40px" }}
              >
                {!editing ? (
                  <Descriptions
                    column={1}
                    labelStyle={{
                      width: 160,
                      color: "#6b7280",
                      fontWeight: 500,
                      fontSize: 15,
                    }}
                    contentStyle={{ color: "#111827", fontWeight: 600, fontSize: 15 }}
                  >
                    <Descriptions.Item label="Họ và tên">
                      {displayName}
                    </Descriptions.Item>
                    <Descriptions.Item label="Số điện thoại">
                      {displayPhone}
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
                      {displayDob
                        ? dayjs(displayDob).format("DD/MM/YYYY")
                        : "—"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Địa chỉ">
                      {displayAddress}
                    </Descriptions.Item>
                    <Descriptions.Item label="Kỹ năng">
                      {displaySkills.length > 0 ? (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                          {displaySkills.map((s: any) => (
                            <SkillChip key={s.id} name={s.name} />
                          ))}
                        </div>
                      ) : (
                        <Text type="secondary">Chưa cập nhật</Text>
                      )}
                    </Descriptions.Item>
                  </Descriptions>
                ) : (
                  <Form form={form} layout="vertical" onFinish={handleSave}>
                    <Row gutter={[20, 0]}>
                      <Col xs={24} md={12}>
                        <Form.Item
                          name="fullName"
                          label={
                            <span style={{ fontWeight: 600, color: "#374151" }}>
                              Họ và tên <span style={{ color: "#ff4d4f" }}>*</span>
                            </span>
                          }
                          rules={[
                            { required: true, message: "Vui lòng nhập họ và tên" },
                          ]}
                        >
                          <Input
                            prefix={<UserOutlined style={{ color: "#9ca3af" }} />}
                            size="large"
                            placeholder="Nhập họ và tên"
                            style={{ borderRadius: 8 }}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item
                          name="phone"
                          label={
                            <span style={{ fontWeight: 600, color: "#374151" }}>
                              Số điện thoại
                            </span>
                          }
                          rules={[
                            {
                              pattern: /^((0|\+84)[0-9]{9})?$/,
                              message: "Số điện thoại không hợp lệ",
                            },
                          ]}
                        >
                          <Input
                            prefix={<PhoneOutlined style={{ color: "#9ca3af" }} />}
                            size="large"
                            placeholder="VD: 0912 345 678"
                            style={{ borderRadius: 8 }}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item
                          name="gender"
                          label={
                            <span style={{ fontWeight: 600, color: "#374151" }}>
                              Giới tính
                            </span>
                          }
                        >
                          <Select
                            size="large"
                            placeholder="Chọn giới tính"
                            style={{ borderRadius: 8 }}
                            options={[
                              { value: "MALE", label: "Nam" },
                              { value: "FEMALE", label: "Nữ" },
                              { value: "OTHER", label: "Khác" },
                            ]}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item
                          name="dob"
                          label={
                            <span style={{ fontWeight: 600, color: "#374151" }}>
                              Ngày sinh
                            </span>
                          }
                        >
                          <DatePicker
                            format="DD/MM/YYYY"
                            size="large"
                            style={{ width: "100%", borderRadius: 8 }}
                            placeholder="Chọn ngày sinh"
                            disabledDate={(current) =>
                              current && current.valueOf() > Date.now()
                            }
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24}>
                        <Form.Item
                          name="address"
                          label={
                            <span style={{ fontWeight: 600, color: "#374151" }}>
                              Địa chỉ
                            </span>
                          }
                        >
                          <Input
                            prefix={
                              <EnvironmentOutlined style={{ color: "#9ca3af" }} />
                            }
                            size="large"
                            placeholder="VD: Hà Nội"
                            style={{ borderRadius: 8 }}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24}>
                        <Form.Item
                          name="skills"
                          label={
                            <span style={{ fontWeight: 600, color: "#374151" }}>
                              Kỹ năng
                            </span>
                          }
                        >
                          <Select
                            mode="multiple"
                            placeholder="Tìm và chọn kỹ năng..."
                            allowClear
                            size="large"
                            style={{ borderRadius: 8 }}
                            options={allSkills.map((s) => ({
                              label: s.name,
                              value: s.id,
                            }))}
                            filterOption={(input, option) =>
                              String(option?.label ?? "")
                                .toLowerCase()
                                .includes(input.toLowerCase())
                            }
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <div
                      style={{
                        display: "flex",
                        gap: 12,
                        justifyContent: "flex-end",
                        marginTop: 8,
                        paddingTop: 20,
                        borderTop: "1px solid #f0f0f0",
                      }}
                    >
                      <Button
                        size="large"
                        onClick={handleCancel}
                        style={{
                          borderRadius: 10,
                          fontWeight: 600,
                          height: 44,
                          paddingInline: 24,
                          border: "1.5px solid #e5e7eb",
                          color: "#6b7280",
                          background: "#f9fafb",
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLButtonElement).style.borderColor = "#d1d5db";
                          (e.currentTarget as HTMLButtonElement).style.color = "#374151";
                          (e.currentTarget as HTMLButtonElement).style.background = "#f3f4f6";
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLButtonElement).style.borderColor = "#e5e7eb";
                          (e.currentTarget as HTMLButtonElement).style.color = "#6b7280";
                          (e.currentTarget as HTMLButtonElement).style.background = "#f9fafb";
                        }}
                      >
                        Hủy bỏ
                      </Button>
                      <Button
                        type="primary"
                        size="large"
                        icon={<SaveOutlined />}
                        loading={saving}
                        htmlType="submit"
                        style={{
                          borderRadius: 10,
                          fontWeight: 700,
                          height: 44,
                          paddingInline: 28,
                          background: saving
                            ? undefined
                            : "linear-gradient(135deg, #1677ff 0%, #4096ff 100%)",
                          border: "none",
                          color: "#fff",
                          boxShadow: saving
                            ? "none"
                            : "0 4px 16px rgba(22,119,255,0.35)",
                          transition: "all 0.25s ease",
                        }}
                        onMouseEnter={e => {
                          if (!saving) {
                            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
                            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 24px rgba(22,119,255,0.45)";
                          }
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                          (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 16px rgba(22,119,255,0.35)";
                        }}
                      >
                        Lưu thay đổi
                      </Button>
                    </div>
                  </Form>
                )}
              </Card>
            </Col>
          </Row>
        </Tabs.TabPane>
        <Tabs.TabPane tab="CV đã tải lên" key="resumes">
          <Card
            style={{
              borderRadius: 12,
              border: "1px solid #eef0f5",
              boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
              minHeight: 'calc(100vh - 220px)',
              display: 'flex',
              flexDirection: 'column'
            }}
            bodyStyle={{ padding: 24, flex: 1, display: 'flex', flexDirection: 'column' }}
            loading={resumesLoading}
          >
            {resumes.length === 0 ? (
              <EmptyState
                illustration="document-upload"
                title="Chưa có CV nào được ghi nhận"
                description="Bạn có thể tải CV lên khi ứng tuyển các vị trí thực tập yêu thích."
                actionText="Tìm việc ngay"
                onAction={() => (window.location.href = "/jobs")}
              />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <Space direction="vertical" size={12} style={{ width: "100%" }}>
                  {paginatedResumes.map((resume) => {
                    const resumeUrl = buildResumeDisplayUrl(
                      resume.url || resume.fileUrl || resume.path,
                    );
                    return (
                      <div
                        key={resume.id || resume.url || resume.title}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 16,
                          padding: "14px 16px",
                          border: "1px solid #eef0f5",
                          borderRadius: 10,
                          background: "#fff",
                        }}
                      >
                        <Space align="start">
                          <div
                            style={{
                              width: 40,
                              height: 40,
                              borderRadius: 8,
                              background: "#e6f4ff",
                              color: "#1677ff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            <FileTextOutlined />
                          </div>
                          <div>
                            <Text strong style={{ display: "block", color: "#111827" }}>
                              {resume.title || resume.name || "CV ứng tuyển"}
                            </Text>
                            <Text style={{ color: "#64748b", fontSize: 12 }}>
                              {resume.createdAt
                                ? `Tạo ngày ${dayjs(resume.createdAt).format("DD/MM/YYYY")}`
                                : "Đã lưu trên hệ thống"}
                            </Text>
                          </div>
                        </Space>
                        {resumeUrl ? (
                          <Button
                            icon={<LinkOutlined />}
                            onClick={() => handleViewCV(resume.url || resume.fileUrl || resume.path)}
                          >
                            Xem CV
                          </Button>
                        ) : (
                          <Button icon={<LinkOutlined />} disabled>
                            Xem CV
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </Space>
                <div style={{ marginTop: 'auto', paddingTop: 24, display: 'flex', justifyContent: 'center' }}>
                  <Pagination
                    current={resumePage}
                    pageSize={resumePageSize}
                    total={sortedResumes.length}
                    onChange={(page) => setResumePage(page)}
                    showSizeChanger={false}
                  />
                </div>
              </div>
            )}
          </Card>
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};
export default ProfilePage;
