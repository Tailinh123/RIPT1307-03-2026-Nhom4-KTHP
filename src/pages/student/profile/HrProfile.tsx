import React, { useState, useEffect, useRef } from 'react';
import {
  Card, Form, Input, Button, Row, Col, Avatar, message, Typography, Select, DatePicker, Descriptions, Tag, Spin,
} from 'antd';
import {
  UserOutlined, MailOutlined, PhoneOutlined, HomeOutlined, BankOutlined,
  CameraOutlined, EditOutlined, SaveOutlined,
} from '@ant-design/icons';
import axiosClient from '@/api/axiosClient';
import { useAuthImage } from '@/hooks/useAuthImage';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const GENDER_LABEL: Record<string, { label: string; color: string }> = {
  MALE: { label: 'Nam', color: '#1677ff' },
  FEMALE: { label: 'Nữ', color: '#eb2f96' },
  OTHER: { label: 'Khác', color: '#722ed1' },
};

export default function HrProfile() {
  const [form] = Form.useForm();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [messageApi, contextHolder] = message.useMessage();

  // Fetch avatar với auth
  const rawAvatarName = profile?.avatarUrl;
  const apiAvatarUrl = rawAvatarName
    ? `/api/v1/files?fileName=${encodeURIComponent(rawAvatarName.replace(/^storage\//, '').replace(/^avatar\//, ''))}&folder=avatar`
    : undefined;
  const fetchedAvatarUrl = useAuthImage(apiAvatarUrl);
  const finalAvatar = avatarPreview ?? fetchedAvatarUrl;

  // Load profile từ API
  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const userStr = localStorage.getItem('user');
        const userObj = userStr ? JSON.parse(userStr) : null;
        if (!userObj?.id) throw new Error('Chưa đăng nhập');
        const res = await axiosClient.get(`/api/v1/users/${userObj.id}`);
        const data = res.data?.data || res.data;
        // Bổ sung phone từ cache nếu backend chưa trả về
        const phoneCache = JSON.parse(localStorage.getItem('user_cache_phone') || '{}');
        if (!data.phone && phoneCache[userObj.id]) data.phone = phoneCache[userObj.id];
        setProfile(data);
      } catch {
        // Fallback localStorage
        const userStr = localStorage.getItem('user');
        if (userStr) setProfile(JSON.parse(userStr));
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleEdit = () => {
    setEditing(true);
    form.setFieldsValue({
      name: profile?.name || profile?.fullName || '',
      email: profile?.email || '',
      phone: profile?.phone || '',
      address: profile?.address || '',
      gender: profile?.gender || 'MALE',
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
    if (!file.type.startsWith('image/')) return messageApi.error('Vui lòng chọn file hình ảnh!');
    if (file.size > 5 * 1024 * 1024) return messageApi.error('Kích thước ảnh tối đa là 5MB');
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    messageApi.success('Đã chọn ảnh! Bấm Lưu để hoàn tất.');
    e.target.value = '';
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);

      const userStr = localStorage.getItem('user');
      const userObj = userStr ? JSON.parse(userStr) : null;
      if (!userObj?.id) { messageApi.error('Không tìm thấy ID người dùng!'); setSaving(false); return; }

      let uploadedAvatarName = profile?.avatarUrl;

      // Upload ảnh nếu có
      if (avatarFile) {
        try {
          messageApi.open({ type: 'loading', content: 'Đang tải ảnh lên...', key: 'upload' });
          const formData = new FormData();
          formData.append('file', avatarFile);
          const uploadRes = await axiosClient.post('/api/v1/files', formData, {
            params: { folder: 'avatar' },
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          uploadedAvatarName = uploadRes.data?.data?.fileName || uploadRes.data?.fileName;
          messageApi.success({ content: 'Tải ảnh xong!', key: 'upload' });
        } catch {
          messageApi.error({ content: 'Tải ảnh thất bại!', key: 'upload' });
          setSaving(false);
          return;
        }
      }

      const payload = {
        id: userObj.id,
        name: values.name,
        phone: values.phone,
        address: values.address,
        gender: values.gender,
        dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format('YYYY-MM-DD') : null,
        avatarUrl: uploadedAvatarName,
        // Giữ nguyên company của tài khoản
        company: profile?.company ? { id: profile.company.id } : null,
      };

      await axiosClient.put(`/api/v1/users/${userObj.id}`, payload);

      // Lưu phone cache
      if (values.phone) {
        const phoneCache = JSON.parse(localStorage.getItem('user_cache_phone') || '{}');
        phoneCache[userObj.id] = values.phone;
        localStorage.setItem('user_cache_phone', JSON.stringify(phoneCache));
      }

      // Cập nhật localStorage header
      localStorage.setItem('user', JSON.stringify({
        ...userObj,
        name: values.name,
        avatarUrl: uploadedAvatarName,
      }));

      setProfile({ ...profile, ...payload });
      setEditing(false);
      setAvatarFile(null);
      setAvatarPreview(null);
      messageApi.success('Cập nhật hồ sơ thành công!');
    } catch (err: any) {
      messageApi.error(err?.response?.data?.message || 'Lỗi khi lưu!');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 320 }}>
        <Spin size="large" tip="Đang tải hồ sơ..." />
      </div>
    );
  }

  const gender = profile?.gender ? GENDER_LABEL[profile.gender] : null;
  const companyName = profile?.company?.name || '—';

  return (
    <div style={{ padding: '24px 40px', background: '#f8fafc', minHeight: '100vh' }}>
      {contextHolder}
      <div style={{ maxWidth: 1300, margin: '0 auto' }}>
        <div style={{ marginBottom: 24 }}>
          <Title level={3} style={{ margin: 0, fontWeight: 600, color: '#0f172a' }}>
            Hồ sơ cá nhân Nhà tuyển dụng
          </Title>
        </div>

        <Row gutter={24}>
          {/* Cột trái: Avatar */}
          <Col xs={24} md={8}>
            <Card
              bordered={false}
              style={{ borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.02), 0 4px 12px rgba(0,0,0,0.03)', textAlign: 'center', padding: '20px 0' }}
            >
              <div style={{ position: 'relative', display: 'inline-block', marginBottom: 16 }}>
                <Avatar
                  size={120}
                  src={finalAvatar}
                  icon={<UserOutlined />}
                  style={{
                    background: finalAvatar ? undefined : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    border: '4px solid #fff',
                    fontSize: 40, fontWeight: 700,
                  }}
                >
                  {!finalAvatar && (profile?.name?.charAt(0)?.toUpperCase() || 'HR')}
                </Avatar>
                {editing && (
                  <>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        position: 'absolute', bottom: 0, right: 0,
                        width: 36, height: 36, borderRadius: '50%',
                        background: '#fff', border: '1px solid #eef0f5',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      }}
                    >
                      <CameraOutlined style={{ color: '#1677ff', fontSize: 16 }} />
                    </div>
                  </>
                )}
              </div>

              <Title level={4} style={{ margin: '0 0 4px', fontSize: 18 }}>
                {profile?.name || profile?.fullName || 'HR Manager'}
              </Title>
              <Tag color="blue" icon={<BankOutlined />} style={{ marginBottom: 8 }}>HR Doanh Nghiệp</Tag>
              <br />
              <Text type="secondary" style={{ fontSize: 13 }}>{companyName}</Text>
            </Card>
          </Col>

          {/* Cột phải: Form thông tin */}
          <Col xs={24} md={16}>
            <Card
              bordered={false}
              title={<span style={{ fontWeight: 600, fontSize: 15 }}>{editing ? 'Chỉnh sửa thông tin' : 'Thông tin chi tiết'}</span>}
              extra={!editing && (
                <Button type="primary" icon={<EditOutlined />} onClick={handleEdit} style={{ borderRadius: 6 }}>
                  Chỉnh sửa
                </Button>
              )}
              style={{ borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.02), 0 4px 12px rgba(0,0,0,0.03)' }}
              styles={{ body: { padding: '24px 32px' } }}
            >
              {!editing ? (
                <Descriptions column={1} labelStyle={{ width: 150, color: '#6b7280', fontWeight: 500 }} contentStyle={{ color: '#111827', fontWeight: 500 }}>
                  <Descriptions.Item label="Họ và tên">{profile?.name || profile?.fullName || '—'}</Descriptions.Item>
                  <Descriptions.Item label="Email">{profile?.email || '—'}</Descriptions.Item>
                  <Descriptions.Item label="Số điện thoại">{profile?.phone || '—'}</Descriptions.Item>
                  <Descriptions.Item label="Giới tính">
                    {gender ? <span style={{ color: gender.color }}>{gender.label}</span> : '—'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Ngày sinh">
                    {profile?.dateOfBirth ? dayjs(profile.dateOfBirth).format('DD/MM/YYYY') : '—'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Địa chỉ">{profile?.address || '—'}</Descriptions.Item>
                  <Descriptions.Item label={<span><BankOutlined /> Công ty</span>}>
                    <Tag color="blue">{companyName}</Tag>
                  </Descriptions.Item>
                </Descriptions>
              ) : (
                <Form form={form} layout="vertical">
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item name="name" label="Họ và tên" rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}>
                        <Input prefix={<UserOutlined style={{ color: '#bfbfbf' }} />} size="large" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="email" label="Email">
                        <Input prefix={<MailOutlined style={{ color: '#bfbfbf' }} />} size="large" disabled />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item name="phone" label="Số điện thoại"
                        rules={[
                          { required: true, message: 'Vui lòng nhập số điện thoại' },
                          { pattern: /^[0-9\s+\-()]{8,15}$/, message: 'SĐT không hợp lệ' },
                        ]}
                      >
                        <Input prefix={<PhoneOutlined style={{ color: '#bfbfbf' }} />} size="large" placeholder="0912 345 678" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="address" label="Địa chỉ" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}>
                        <Input prefix={<HomeOutlined style={{ color: '#bfbfbf' }} />} size="large" placeholder="Hà Nội" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item name="gender" label="Giới tính" rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}>
                        <Select size="large" options={[{ value: 'MALE', label: 'Nam' }, { value: 'FEMALE', label: 'Nữ' }, { value: 'OTHER', label: 'Khác' }]} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="dateOfBirth" label="Ngày sinh" rules={[{ required: true, message: 'Vui lòng chọn ngày sinh' }]}>
                        <DatePicker format="DD/MM/YYYY" size="large" style={{ width: '100%' }} placeholder="Chọn ngày sinh" disabledDate={(d) => d && d > dayjs().endOf('day')} />
                      </Form.Item>
                    </Col>
                  </Row>

                  {/* Hiển thị công ty (read-only) */}
                  <Row gutter={16}>
                    <Col span={24}>
                      <Form.Item label={<span><BankOutlined /> Công ty công tác</span>}>
                        <Input value={companyName} disabled size="large" style={{ background: '#f9fafb' }} />
                      </Form.Item>
                    </Col>
                  </Row>

                  <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 16 }}>
                    <Button size="large" onClick={handleCancel}>Hủy bỏ</Button>
                    <Button type="primary" size="large" icon={<SaveOutlined />} loading={saving} onClick={handleSave}>
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