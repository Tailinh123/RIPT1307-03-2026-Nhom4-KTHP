import React, { useEffect, useState, useRef } from 'react';
import {
  Card, Typography, Button, Form, Input, Select, Tag, Avatar, Row, Col, Spin, Alert, message, Descriptions, DatePicker,
} from 'antd';
import {
  UserOutlined, EditOutlined, SaveOutlined, PhoneOutlined, EnvironmentOutlined, WarningOutlined, CameraOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useProfile } from '@/hooks/useProfile';
import { useSkills } from '@/hooks/useSkills';
import { useAuthImage } from '@/hooks/useAuthImage';
import axiosClient from '@/api/axiosClient';

const { Title, Text } = Typography;

const GENDER_LABEL: Record<string, { label: string; color: string }> = {
  MALE: { label: 'Nam', color: '#1677ff' },
  FEMALE: { label: 'Nữ', color: '#eb2f96' },
  OTHER: { label: 'Khác', color: '#722ed1' },
};

const SkillChip: React.FC<{ name: string; onClose?: () => void }> = ({ name, onClose }) => (
  <Tag closable={!!onClose} onClose={onClose} style={{ background: '#e6f4ff', color: '#1677ff', border: '1px solid #91caff', borderRadius: 6, padding: '4px 12px', fontSize: 13, fontWeight: 500 }}>
    {name}
  </Tag>
);

function buildAvatarDisplayUrl(rawAvatarName: string | undefined | null): string | undefined {
  if (!rawAvatarName) return undefined;
  const fileNameOnly = rawAvatarName
    .replace(/^storage\//, '')
    .replace(/^avatar\//, '');
  
  return `/api/v1/files?fileName=${encodeURIComponent(fileNameOnly)}&folder=avatar`;
}

const ProfilePage: React.FC = () => {
  const { profile, loading, connectionError, fetchProfile, updateProfile } = useProfile();
  const { skills: allSkills } = useSkills();
  
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null); 
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const rawAvatarName = (profile as any)?.avatarUrl;
  const apiAvatarUrl = rawAvatarName
    ? `/api/v1/files?fileName=${encodeURIComponent(
        rawAvatarName.replace(/^storage\//, '').replace(/^avatar\//, '')
      )}&folder=avatar`
    : undefined;
  const fetchedAvatarUrl = useAuthImage(apiAvatarUrl);
  const finalAvatarToDisplay = avatarPreview ?? fetchedAvatarUrl;

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return messageApi.error('Vui lòng chọn file hình ảnh!');
    if (file.size > 5 * 1024 * 1024) return messageApi.error('Kích thước ảnh tối đa là 5MB');
    
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    messageApi.success('Đã chọn ảnh! Vui lòng bấm Lưu thay đổi để hoàn tất.');
    e.target.value = '';
  };

  const handleEdit = () => {
    setEditing(true);
    form.setFieldsValue({
      fullName: profile?.name || profile?.fullName || '',
      phone: profile?.phone || '',
      gender: profile?.gender || 'MALE',
      dob: profile?.dateOfBirth ? dayjs(profile?.dateOfBirth) : null,
      address: profile?.address || '',
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
      const values = await form.validateFields();
      setSaving(true);
      
      if (!profile?.id) {
        messageApi.error("Không tìm thấy ID người dùng!");
        setSaving(false);
        return;
      }

      let uploadedAvatarName = (profile as any)?.avatarUrl;

      if (avatarFile) {
        try {
          messageApi.open({ type: 'loading', content: 'Đang tải ảnh lên...', key: 'upload' });
          const formData = new FormData();
          formData.append('file', avatarFile);
          
          const uploadRes = await axiosClient.post('/api/v1/files', formData, {
            params: { folder: 'avatar' },
            headers: { 'Content-Type': 'multipart/form-data' } 
          });
          
          uploadedAvatarName = uploadRes.data?.data?.fileName || uploadRes.data?.fileName || uploadRes.data;
          messageApi.success({ content: 'Tải ảnh xong!', key: 'upload' });

        } catch (uploadErr) {
          console.error("❌ LỖI UPLOAD ẢNH:", uploadErr);
          messageApi.error({ content: 'Tải ảnh thất bại! Hãy kiểm tra lại API upload.', key: 'upload' });
          setSaving(false);
          return; 
        }
      }

      const payload = {
        id: profile.id,          
        name: values.fullName,
        phone: values.phone,
        avatarUrl: uploadedAvatarName,
        skills: values.skills ? values.skills.map((id: number) => {
          const skillName = allSkills.find(s => s.id === id)?.name;
          return { id, name: skillName };
        }) : [],
        dateOfBirth: values.dob ? values.dob.format('YYYY-MM-DD') : null,
        address: values.address,
        gender: values.gender,
      };

      try {
        await updateProfile(payload as any);

        const currentUserStr = localStorage.getItem('user');
        if (currentUserStr) {
          const currentUser = JSON.parse(currentUserStr);
          localStorage.setItem('user', JSON.stringify({
            ...currentUser,
            name: payload.name,
            fullName: payload.name,
            avatarUrl: payload.avatarUrl,
          }));
        }
        messageApi.success('Cập nhật hồ sơ thành công!');
        setEditing(false);
        setAvatarFile(null);
        setAvatarPreview(null);
      } catch (err: any) {
        messageApi.error(err?.response?.data?.message || 'Lỗi khi lưu dữ liệu lên máy chủ!');
      } finally {
        setSaving(false);
      }
    } catch {
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 320 }}>
        <Spin size="large" tip="Đang lấy dữ liệu từ Database..." />
      </div>
    );
  }

  const displayGender = profile?.gender;
  const gender = displayGender ? GENDER_LABEL[displayGender] : null;
  const displayName = profile?.name || profile?.fullName || 'Chưa cập nhật';
  const displayEmail = profile?.email || '—';
  const displayPhone = profile?.phone || '—';
  const displayDob = profile?.dateOfBirth || profile?.dob;
  const displayAddress = profile?.address || '—';
  const displaySkills = profile?.skills || [];

  return (
    <>
      {contextHolder}
      {connectionError && (
        <Alert type="warning" showIcon icon={<WarningOutlined />} message="Không kết nối được Backend" description={connectionError} style={{ marginBottom: 20, borderRadius: 8 }} />
      )}
      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <Card style={{ borderRadius: 12, border: '1px solid #eef0f5', textAlign: 'center' }} styles={{ body: { padding: '32px 24px' } }}>
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: 16 }}>
              <Avatar
                size={120}
                src={finalAvatarToDisplay}
                style={{
                  background: finalAvatarToDisplay ? undefined : 'linear-gradient(135deg, #1677ff 0%, #69b1ff 100%)',
                  fontSize: 48, fontWeight: 700, boxShadow: '0 4px 12px rgba(22,119,255,0.2)',
                }}
              >
                {!finalAvatarToDisplay && (displayName.charAt(0).toUpperCase())}
              </Avatar>
              
              {editing && (
                <>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    style={{ position: 'absolute', bottom: 0, right: 0, width: 36, height: 36, borderRadius: '50%', background: '#fff', border: '1px solid #eef0f5', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                  >
                    <CameraOutlined style={{ color: '#1677ff', fontSize: 16 }} />
                  </div>
                </>
              )}
            </div>

            <Title level={4} style={{ margin: 0, color: '#111827' }}>{displayName}</Title>
            <Text style={{ color: '#6b7280', display: 'block', marginBottom: 16 }}>{displayEmail}</Text>
            <Tag color="blue" style={{ borderRadius: 4, padding: '4px 12px', fontWeight: 600 }}>Sinh Viên Thực Tập</Tag>
          </Card>
        </Col>

        <Col xs={24} md={16}>
          <Card
            title={editing ? "Chỉnh sửa thông tin" : "Thông tin cá nhân"}
            extra={!editing && (<Button type="primary" icon={<EditOutlined />} onClick={handleEdit} style={{ borderRadius: 6 }}>Chỉnh sửa</Button>)}
            style={{ borderRadius: 12, border: '1px solid #eef0f5' }}
            styles={{ body: { padding: '24px 32px' } }}
          >
            {!editing ? (
              <Descriptions column={1} labelStyle={{ width: 150, color: '#6b7280', fontWeight: 500 }} contentStyle={{ color: '#111827', fontWeight: 500 }}>
                <Descriptions.Item label="Họ và tên">{displayName}</Descriptions.Item>
                <Descriptions.Item label="Số điện thoại">{displayPhone}</Descriptions.Item>
                <Descriptions.Item label="Giới tính">{gender ? <span style={{ color: gender.color }}>{gender.label}</span> : '—'}</Descriptions.Item>
                <Descriptions.Item label="Ngày sinh">{displayDob ? dayjs(displayDob).format('DD/MM/YYYY') : '—'}</Descriptions.Item>
                <Descriptions.Item label="Địa chỉ">{displayAddress}</Descriptions.Item>
                <Descriptions.Item label="Kỹ năng">
                  {displaySkills.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {displaySkills.map((s: any) => <SkillChip key={s.id} name={s.name} />)}
                    </div>
                  ) : <Text type="secondary">Chưa cập nhật</Text>}
                </Descriptions.Item>
              </Descriptions>
            ) : (
              <Form form={form} layout="vertical">
                <Row gutter={24}>
                  <Col xs={24} md={12}>
                    <Form.Item name="fullName" label="Họ và tên" rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}>
                      <Input prefix={<UserOutlined style={{ color: '#bfbfbf' }} />} size="large" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="phone"
                      label="Số điện thoại"
                      rules={[
                        { required: true, message: 'Vui lòng nhập số điện thoại' },
                        { pattern: /^[0-9\s+\-()]{8,15}$/, message: 'Số điện thoại không hợp lệ' },
                      ]}
                    >
                      <Input prefix={<PhoneOutlined style={{ color: '#bfbfbf' }} />} size="large" placeholder="VD: 0912 345 678" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item name="gender" label="Giới tính" rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}>
                      <Select size="large" placeholder="Chọn giới tính" options={[{ value: 'MALE', label: 'Nam' }, { value: 'FEMALE', label: 'Nữ' }, { value: 'OTHER', label: 'Khác' }]} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item name="dob" label="Ngày sinh" rules={[{ required: true, message: 'Vui lòng chọn ngày sinh' }]}>
                      <DatePicker format="DD/MM/YYYY" size="large" style={{ width: '100%' }} placeholder="Chọn ngày sinh" disabledDate={(current) => current && current > dayjs().endOf('day')} />
                    </Form.Item>
                  </Col>
                  <Col xs={24}>
                    <Form.Item name="address" label="Địa chỉ" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}>
                      <Input prefix={<EnvironmentOutlined style={{ color: '#bfbfbf' }} />} size="large" placeholder="VD: Hà Nội" />
                    </Form.Item>
                  </Col>
                  <Col xs={24}>
                    <Form.Item name="skills" label="Kỹ năng">
                      <Select mode="multiple" placeholder="Tìm và chọn kỹ năng..." allowClear size="large" options={allSkills.map((s) => ({ label: s.name, value: s.id }))} filterOption={(input, option) => String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())} />
                    </Form.Item>
                  </Col>
                </Row>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 16 }}>
                  <Button size="large" onClick={handleCancel}>Hủy bỏ</Button>
                  <Button type="primary" size="large" icon={<SaveOutlined />} loading={saving} onClick={handleSave}>Lưu thay đổi</Button>
                </div>
              </Form>
            )}
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ProfilePage;