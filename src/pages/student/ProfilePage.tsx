import React, { useEffect, useState, useRef } from 'react';
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
  Divider,
  message,
} from 'antd';
import {
  UserOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  ManOutlined,
  WomanOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  CameraOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useProfile } from '@/hooks/useProfile';
import { useSkills } from '@/hooks/useSkills';
import type { UpdateProfilePayload } from '@/types/user';

const { Title, Text } = Typography;

const GENDER_LABEL: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  MALE:   { label: 'Nam',   icon: <ManOutlined />,    color: '#1677ff' },
  FEMALE: { label: 'Nữ',    icon: <WomanOutlined />,  color: '#eb2f96' },
  OTHER:  { label: 'Khác',  icon: <UserOutlined />,   color: '#722ed1' },
};

// calcAge removed — field no longer displayed

// ── Reusable info row ──────────────────────────────────────────────────────
const InfoItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  value?: React.ReactNode;
}> = ({ icon, label, value }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
    <Text style={{ fontSize: 11, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.4px', fontWeight: 600 }}>
      {icon} &nbsp;{label}
    </Text>
    <Text style={{ fontSize: 15, color: value ? '#111827' : '#d1d5db', fontWeight: 500 }}>
      {value ?? '—'}
    </Text>
  </div>
);

// ── Skill tag chip ─────────────────────────────────────────────────────────
const SkillChip: React.FC<{ name: string; onClose?: () => void }> = ({ name, onClose }) => (
  <Tag
    closable={!!onClose}
    onClose={onClose}
    style={{
      background: '#e6f4ff',
      color: '#1677ff',
      border: '1px solid #91caff',
      borderRadius: 20,
      padding: '3px 12px',
      fontSize: 13,
      fontWeight: 500,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
    }}
  >
    {name}
  </Tag>
);

const ProfilePage: React.FC = () => {
  const { profile, loading, saving, connectionError, fetchProfile, updateProfile } = useProfile();
  const { skills: allSkills } = useSkills();
  const [editing, setEditing] = useState(false);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Validate file type
    if (!file.type.startsWith('image/')) {
      messageApi.error('Vui lòng chọn file hình ảnh (PNG, JPG, GIF, ...)');
      return;
    }
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      messageApi.error('Kích thước ảnh tối đa là 5MB');
      return;
    }
    const url = URL.createObjectURL(file);
    setAvatarUrl(url);
    messageApi.success('Đã cập nhật ảnh đại diện!');
    // Reset input so same file can be re-selected
    e.target.value = '';
  };

  // Initial fetch
  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  // Sync form when profile changes
  useEffect(() => {
    if (profile && editing) {
      form.setFieldsValue({
        name: profile.fullName,
        phone: profile.phone ?? '',
        gender: profile.gender ?? 'MALE',
        dob: profile.dob ? dayjs(profile.dob).format('DD/MM/YYYY') : '',
        address: profile.address ?? '',
        skills: profile.skills.map((s) => s.id),
      });
    }
  }, [profile, editing, form]);

  const handleEdit = () => {
    setEditing(true);
    if (profile) {
      form.setFieldsValue({
        name: profile.fullName,
        phone: profile.phone ?? '',
        gender: profile.gender ?? 'MALE',
        dob: profile.dob ? dayjs(profile.dob).format('DD/MM/YYYY') : '',
        address: profile.address ?? '',
        skills: profile.skills.map((s) => s.id),
      });
    }
  };

  const handleCancel = () => {
    setEditing(false);
    form.resetFields();
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const payload: UpdateProfilePayload = {
        name: values.name,
        phone: values.phone,
        dob: (() => {
          const raw: string = values.dob ?? '';
          // Convert from DD/MM/YYYY → YYYY-MM-DD for API
          if (/^\d{2}\/\d{2}\/\d{4}$/.test(raw)) {
            const [d, m, y] = raw.split('/');
            return `${y}-${m}-${d}`;
          }
          return raw; // already YYYY-MM-DD or empty
        })(),
        address: values.address,
        gender: values.gender,
        skills: values.skills ?? [],
      };
      try {
        await updateProfile(payload);
        messageApi.success({
          content: 'Cập nhật hồ sơ thành công!',
          icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
        });
      } catch {
        messageApi.warning('Không kết nối được server — đã lưu trên máy tạm thời.');
      }
      setEditing(false);
    } catch {
      // form validation failed
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 320 }}>
        <Spin size="large" tip="Đang tải hồ sơ..." />
      </div>
    );
  }

  const gender = profile?.gender ? GENDER_LABEL[profile.gender] : undefined;

  return (
    <>
      {contextHolder}

      {/* ── Connection Banner ───────────────────────────────────────── */}
      {connectionError && (
        <Alert
          type="warning"
          showIcon
          icon={<WarningOutlined />}
          message="Không kết nối được Backend"
          description={connectionError}
          style={{ marginBottom: 20, borderRadius: 10 }}
          closable
        />
      )}
      {!connectionError && profile && (
        <Alert
          type="success"
          showIcon
          icon={<CheckCircleOutlined />}
          message="Đã kết nối Database"
          description="Dữ liệu hồ sơ được tải trực tiếp từ server."
          style={{ marginBottom: 20, borderRadius: 10 }}
          closable
        />
      )}

      {/* ── Profile Header Card ─────────────────────────────────────── */}
      <Card
        style={{
          borderRadius: 16,
          border: '1px solid #eef0f5',
          boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
          marginBottom: 20,
          overflow: 'hidden',
        }}
        styles={{ body: { padding: 0 } }}
      >
        {/* Top gradient banner */}
        <div
          style={{
            height: 80,
            background: 'linear-gradient(135deg, #1677ff 0%, #69b1ff 60%, #a5c8ff 100%)',
          }}
        />

        <div style={{ padding: '0 32px 28px' }}>
          {/* Avatar — kéo lên đè banner */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 12,
              marginTop: -44,
            }}
          >
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <Avatar
                size={88}
                src={avatarUrl ?? undefined}
                style={{
                  background: avatarUrl ? undefined : 'linear-gradient(135deg, #1677ff 0%, #69b1ff 100%)',
                  fontSize: 32,
                  fontWeight: 700,
                  border: '4px solid #fff',
                  boxShadow: '0 4px 16px rgba(22,119,255,0.28)',
                }}
              >
                {!avatarUrl && (profile?.fullName?.charAt(0)?.toUpperCase() ?? 'S')}
              </Avatar>
              {editing && (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/gif,image/webp,image/svg+xml,image/bmp"
                    onChange={handleAvatarChange}
                    style={{ display: 'none' }}
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      width: 30,
                      height: 30,
                      borderRadius: '50%',
                      background: '#1677ff',
                      border: '2px solid #fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(22,119,255,0.4)',
                      transition: 'transform 0.2s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    title="Thay đổi ảnh đại diện"
                  >
                    <CameraOutlined style={{ color: '#fff', fontSize: 14 }} />
                  </div>
                </>
              )}
            </div>

            {!editing && (
              <Button
                icon={<EditOutlined />}
                onClick={handleEdit}
                style={{
                  borderRadius: 8,
                  border: '1px solid #d1d5db',
                  color: '#374151',
                  fontWeight: 500,
                  height: 36,
                  marginTop: 52,   /* đẩy nút xuống dưới banner */
                }}
              >
                Chỉnh sửa
              </Button>
            )}
          </div>

          {/* Tên + role — hoàn toàn bên dưới banner */}
          <div style={{ marginTop: 12, marginBottom: 20 }}>
            <Title level={4} style={{ margin: 0, fontSize: 20, color: '#111827', lineHeight: '1.3' }}>
              {profile?.fullName ?? '—'}
            </Title>
            <Text style={{ fontSize: 13, color: '#6b7280' }}>Sinh viên</Text>
          </div>

          {/* Info grid */}
          <Row gutter={[24, 20]}>
            <Col xs={24} sm={12} md={8}>
              <InfoItem
                icon={<MailOutlined />}
                label="Email"
                value={profile?.email}
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <InfoItem
                icon={<PhoneOutlined />}
                label="Số điện thoại"
                value={profile?.phone}
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <InfoItem
                icon={gender?.icon ?? <UserOutlined />}
                label="Giới tính"
                value={
                  gender ? (
                    <span style={{ color: gender.color }}>
                      {gender.icon} {gender.label}
                    </span>
                  ) : undefined
                }
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <InfoItem
                icon={<EnvironmentOutlined />}
                label="Địa chỉ"
                value={profile?.address}
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <InfoItem
                icon={<CalendarOutlined />}
                label="Ngày sinh"
                value={
                  profile?.dob
                    ? dayjs(profile.dob).format('DD/MM/YYYY')
                    : undefined
                }
              />
            </Col>
          </Row>

          {/* Skills display */}
          {profile?.skills && profile.skills.length > 0 && (
            <>
              <Divider style={{ margin: '20px 0 16px' }} />
              <Text
                style={{
                  fontSize: 11,
                  color: '#9ca3af',
                  textTransform: 'uppercase',
                  letterSpacing: '0.4px',
                  fontWeight: 600,
                  display: 'block',
                  marginBottom: 10,
                }}
              >
                Kỹ năng
              </Text>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {profile.skills.map((s) => (
                  <SkillChip key={s.id} name={s.name} />
                ))}
              </div>
            </>
          )}
        </div>
      </Card>

      {/* ── Edit Form Card ──────────────────────────────────────────── */}
      {editing && (
        <Card
          style={{
            borderRadius: 16,
            border: '1px solid #eef0f5',
            boxShadow: '0 4px 20px rgba(22,119,255,0.08)',
          }}
          styles={{ body: { padding: '28px 32px' } }}
        >
          {/* Card header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 24,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 9,
                  background: '#e6f4ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#1677ff',
                }}
              >
                <EditOutlined />
              </div>
              <Title level={5} style={{ margin: 0, fontSize: 16 }}>
                Chỉnh sửa hồ sơ
              </Title>
            </div>
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={handleCancel}
              style={{ color: '#9ca3af' }}
            />
          </div>

          <Form form={form} layout="vertical">
            <Row gutter={[20, 0]}>
              {/* Họ và tên */}
              <Col xs={24} md={12}>
                <Form.Item
                  name="name"
                  label="Họ và tên"
                  rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
                >
                  <Input
                    prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
                    placeholder="Nguyễn Văn A"
                    style={{ borderRadius: 8 }}
                  />
                </Form.Item>
              </Col>

              {/* Email — read only */}
              <Col xs={24} md={12}>
                <Form.Item label="Email">
                  <Input
                    prefix={<MailOutlined style={{ color: '#bfbfbf' }} />}
                    value={profile?.email}
                    disabled
                    style={{ borderRadius: 8, background: '#f9fafb', color: '#6b7280' }}
                  />
                </Form.Item>
              </Col>

              {/* Số điện thoại */}
              <Col xs={24} md={12}>
                <Form.Item
                  name="phone"
                  label="Số điện thoại"
                  rules={[
                    { pattern: /^[0-9\s+\-()]{8,15}$/, message: 'Số điện thoại không hợp lệ' },
                  ]}
                >
                  <Input
                    prefix={<PhoneOutlined style={{ color: '#bfbfbf' }} />}
                    placeholder="0912 345 678"
                    style={{ borderRadius: 8 }}
                  />
                </Form.Item>
              </Col>

              {/* Giới tính */}
              <Col xs={24} md={12}>
                <Form.Item name="gender" label="Giới tính">
                  <Select
                    style={{ borderRadius: 8 }}
                    options={[
                      { value: 'MALE',   label: '♂ Nam' },
                      { value: 'FEMALE', label: '♀ Nữ' },
                      { value: 'OTHER',  label: '⊙ Khác' },
                    ]}
                  />
                </Form.Item>
              </Col>

              {/* Ngày sinh */}
              <Col xs={24} md={12}>
                <Form.Item
                  name="dob"
                  label="Ngày sinh"
                  rules={[
                    {
                      pattern: /^(\d{2}\/\d{2}\/\d{4})?$/,
                      message: 'Nhập đúng định dạng DD/MM/YYYY',
                    },
                    {
                      validator: (_, val: string) => {
                        if (!val) return Promise.resolve();
                        const [d, m, y] = val.split('/').map(Number);
                        const dt = dayjs(`${y}-${m}-${d}`);
                        if (!dt.isValid()) return Promise.reject('Ngày không hợp lệ');
                        if (dt.isAfter(dayjs(), 'day')) return Promise.reject('Ngày sinh không thể là tương lai');
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <Input
                    prefix={<CalendarOutlined style={{ color: '#bfbfbf' }} />}
                    placeholder="VD: 15/05/2002"
                    maxLength={10}
                    style={{ borderRadius: 8 }}
                    onChange={(e) => {
                      // Auto-insert slashes for convenience
                      let v = e.target.value.replace(/[^\d/]/g, '');
                      if (v.length === 2 && !v.includes('/')) v = v + '/';
                      if (v.length === 5 && v.split('/').length === 2) v = v + '/';
                      // Don't exceed DD/MM/YYYY
                      if (v.length > 10) v = v.slice(0, 10);
                      form.setFieldValue('dob', v);
                    }}
                  />
                </Form.Item>
              </Col>

              {/* Địa chỉ */}
              <Col xs={24} md={12}>
                <Form.Item name="address" label="Địa chỉ">
                  <Input
                    prefix={<EnvironmentOutlined style={{ color: '#bfbfbf' }} />}
                    placeholder="Hà Nội, Việt Nam"
                    style={{ borderRadius: 8 }}
                  />
                </Form.Item>
              </Col>

              {/* Skills Picker */}
              <Col xs={24}>
                <Form.Item
                  name="skills"
                  label={
                    <span>
                      Kỹ năng&nbsp;
                      <Text type="secondary" style={{ fontSize: 12, fontWeight: 400 }}>
                        (gõ để tìm kiếm)
                      </Text>
                    </span>
                  }
                >
                  <Select
                    mode="multiple"
                    placeholder="Tìm và chọn kỹ năng..."
                    allowClear
                    maxTagCount="responsive"
                    style={{ borderRadius: 8 }}
                    options={allSkills.map((s) => ({ label: s.name, value: s.id }))}
                    filterOption={(input, option) =>
                      String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    tagRender={({ label, onClose }) => (
                      <Tag
                        closable
                        onClose={onClose}
                        style={{
                          background: '#e6f4ff',
                          color: '#1677ff',
                          border: '1px solid #91caff',
                          borderRadius: 20,
                          padding: '2px 10px',
                          fontSize: 12,
                          fontWeight: 500,
                          margin: '2px 4px 2px 0',
                        }}
                      >
                        {label}
                      </Tag>
                    )}
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* Action buttons */}
            <Divider style={{ margin: '8px 0 20px' }} />
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <Button
                onClick={handleCancel}
                style={{ borderRadius: 8, height: 40, padding: '0 20px' }}
              >
                Hủy bỏ
              </Button>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                loading={saving}
                onClick={handleSave}
                style={{
                  borderRadius: 8,
                  height: 40,
                  padding: '0 28px',
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #1677ff 0%, #4096ff 100%)',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(22,119,255,0.35)',
                }}
              >
                Lưu thay đổi
              </Button>
            </div>
          </Form>
        </Card>
      )}
    </>
  );
};

export default ProfilePage;
