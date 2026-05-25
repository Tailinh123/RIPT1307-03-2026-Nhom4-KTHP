import React, { useState, useEffect, useMemo } from "react";
import { Card, Form, Input, Button, Upload, Row, Col, Avatar, message, Typography, Tag, Select, DatePicker } from "antd";
import { UserOutlined, UploadOutlined, MailOutlined, PhoneOutlined, SafetyCertificateOutlined, HomeOutlined, BankOutlined } from "@ant-design/icons";
import apiClient from "@/api/api";
import dayjs from "dayjs";

const { Title, Text } = Typography;

export const genderLabels: Record<string, string> = {
  MALE: "Nam",
  FEMALE: "Nữ",
  OTHER: "Khác",
};

export default function HrProfile() {
  const [form] = Form.useForm();
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [companies, setCompanies] = useState<any[]>([]); 

  // ===========================================================================
  // 1. CALL API: LẤY DANH SÁCH CÔNG TY TỪ DATABASE
  // ===========================================================================
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await apiClient.get('/api/v1/companies');
        const data = response.data.data?.result || response.data.data || response.data;
        setCompanies(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Không thể lấy danh sách công ty từ DB", error);
      }
    };
    fetchCompanies();
  }, []);

  const companyOptions = useMemo(() => {
    return companies.map((c: any) => ({
      value: c.id,
      label: c.name,
    }));
  }, [companies]);

  // ===========================================================================
  // 2. LIFE CYCLE: NẠP DỮ LIỆU ĐỒNG BỘ
  // ===========================================================================
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const defaultHR = {
      name: "Lữ Trọng Đại",
      email: "hr@gmail.com",
      phone: "0393888218",
      address: "Hà Nội",
      gender: "MALE",
      dateOfBirth: "2000-01-01",
      companyId: 1, 
      role: "COMPANY"
    };

    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        const cleanData = {
          name: parsed.name || parsed.fullName || defaultHR.name,
          email: parsed.email || defaultHR.email,
          phone: parsed.phone || defaultHR.phone,
          address: parsed.address || defaultHR.address,
          gender: parsed.gender || defaultHR.gender,
          dateOfBirth: parsed.dateOfBirth || parsed.date_of_birth 
            ? dayjs(parsed.dateOfBirth || parsed.date_of_birth) 
            : dayjs(defaultHR.dateOfBirth),
          companyId: parsed.company?.id || parsed.companyId || defaultHR.companyId,
        };
        form.setFieldsValue(cleanData);
        if (parsed.avatarUrl || parsed.avatar) setAvatarUrl(parsed.avatarUrl || parsed.avatar);
      } catch (e) {
        form.setFieldsValue(defaultHR);
      }
    } else {
      form.setFieldsValue({
        ...defaultHR,
        dateOfBirth: dayjs(defaultHR.dateOfBirth)
      });
      localStorage.setItem("user", JSON.stringify(defaultHR));
    }
  }, [form]);

  // ===========================================================================
  // 3. HANDLER: ĐỌC ẢNH TỪ MÁY TÍNH
  // ===========================================================================
  const handleBeforeUpload = (file: File) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('Bạn chỉ có thể tải lên định dạng file JPG hoặc PNG!');
      return Upload.LIST_IGNORE;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Kích thước file ảnh đại diện phải nhỏ hơn 2MB!');
      return Upload.LIST_IGNORE;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatarUrl(e.target?.result as string);
      message.success("Đã nạp ảnh đại diện từ máy tính!");
    };
    reader.readAsDataURL(file);
    return false;
  };

  // ===========================================================================
  // 4. HANDLER: SUBMIT FORM GỬI XUỐNG DB
  // ===========================================================================
  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const storedUserStr = localStorage.getItem("user");
      const currentUserObj = storedUserStr ? JSON.parse(storedUserStr) : {};
      const userId = currentUserObj.id || 2; 

      const apiPayload = {
        id: userId,
        name: values.name,
        email: values.email,
        phone: values.phone,
        address: values.address,
        gender: values.gender,
        dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format("YYYY-MM-DD") : null,
        avatarUrl: avatarUrl, 
        company: values.companyId ? { id: Number(values.companyId) } : null,
      };

      try {
        await apiClient.put(`/api/v1/users/${userId}`, apiPayload);
        message.success("Đồng bộ dữ liệu Hồ sơ và Công ty với Database thành công!");
      } catch (apiError) {
        console.warn("Đang lưu tại Local Storage do Backend chưa mở cổng API.");
      }

      const localUserData = { ...currentUserObj, ...apiPayload };
      localStorage.setItem("user", JSON.stringify(localUserData));
      setTimeout(() => window.location.reload(), 500);

    } catch (error) {
      message.error("Có lỗi xảy ra khi lưu thông tin!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "24px 40px", background: "#f8fafc", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1300px", margin: "0 auto" }}>
        
        {/* Page Header */}
        <div style={{ marginBottom: "24px" }}>
          <Title level={3} style={{ margin: 0, fontWeight: 600, color: "#0f172a" }}>
            Hồ sơ cá nhân Nhà tuyển dụng
          </Title>
        </div>

        <Row gutter={24}>
          {/* CỘT TRÁI: KHU VỰC AVATAR + SIÊU NÚT BẤM ĐỘNG NATIVE CSS */}
          <Col xs={24} md={8}>
            <Card
              bordered={false}
              style={{
                borderRadius: "12px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.02), 0 4px 12px rgba(0,0,0,0.03)",
                textAlign: "center",
                padding: "20px 0"
              }}
            >
              <div style={{ marginBottom: "20px", display: "inline-block" }}>
                <Avatar
                  size={120}
                  src={avatarUrl}
                  icon={<UserOutlined />}
                  style={{
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    border: "4px solid #fff",
                    background: "linear-gradient(135deg, #1677ff 0%, #69b1ff 100%)"
                  }}
                />
              </div>
              
              <div style={{ marginBottom: "20px" }}>
                <Title level={4} style={{ margin: "0 0 4px 0", fontSize: "18px" }}>
                  {form.getFieldValue("name") || "HR Manager"}
                </Title>
                <Tag color="blue" icon={<SafetyCertificateOutlined />}>HR Doanh Nghiệp</Tag>
              </div>

              {/* KHU VỰC NÚT BẤM ĐÃ ĐƯỢC CHUYỂN ĐỔI SANG CSS THUẦN KHÔNG LỆCH HÀNG */}
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Upload accept="image/*" showUploadList={false} beforeUpload={handleBeforeUpload}>
                  
                  {/* SIÊU NÚT BẤM GLITTER & WAVE PHIÊN BẢN KHÔNG DÙNG TAILWIND */}
                  <div className="custom-glitter-btn">
                    
                    {/* Dải màu chuyển động Gradient động hệ màu InternMatch */}
                    <div className="btn-bg-gradient" />
                    <div className="btn-bg-blur" />
                    
                    {/* Lớp hạt sáng lấp lánh (Glitter Container) */}
                    <div className="glitter-container">
                      <div className="glitter g1" />
                      <div className="glitter g2" />
                      <div className="glitter g3" />
                    </div>
                    
                    {/* Viền sáng bao quanh */}
                    <div className="btn-border-overlay" />
                    
                    {/* Hiệu ứng sóng ngầm chạy xuyên suốt */}
                    <div className="btn-wave-effect" />
                    
                    {/* Nội dung chữ và icon */}
                    <span className="btn-content-text">
                      <UploadOutlined style={{ fontSize: "14px" }} />
                      <span style={{ letterSpacing: "0.5px" }}>Tải ảnh lên</span>
                    </span>
                  </div>

                </Upload>
              </div>
            </Card>
          </Col>

          {/* CỘT PHẢI: FORM ĐIỀN THÔNG TIN CHI TIẾT */}
          <Col xs={24} md={16}>
            <Card
              bordered={false}
              style={{
                borderRadius: "12px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.02), 0 4px 12px rgba(0,0,0,0.03)",
              }}
              title={<span style={{ fontWeight: 600, fontSize: "15px" }}>Thông tin chi tiết</span>}
            >
              <Form form={form} layout="vertical" onFinish={onFinish}>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="name"
                      label={<span style={{ fontWeight: 500 }}>Họ và tên</span>}
                      rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
                    >
                      <Input prefix={<UserOutlined style={{ color: "#bfbfbf" }} />} placeholder="Lữ Trọng Đại" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="email"
                      label={<span style={{ fontWeight: 500 }}>Email liên hệ</span>}
                      rules={[{ required: true, message: "Vui lòng nhập email" }]}
                    >
                      <Input prefix={<MailOutlined style={{ color: "#bfbfbf" }} />} placeholder="hr@gmail.com" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="phone"
                      label={<span style={{ fontWeight: 500 }}>Số điện thoại</span>}
                      rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
                    >
                      <Input prefix={<PhoneOutlined style={{ color: "#bfbfbf" }} />} placeholder="0393888218" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="address"
                      label={<span style={{ fontWeight: 500 }}>Địa chỉ</span>}
                      rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
                    >
                      <Input prefix={<HomeOutlined style={{ color: "#bfbfbf" }} />} placeholder="Hà Nội" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="gender"
                      label={<span style={{ fontWeight: 500 }}>Giới tính</span>}
                      rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}
                    >
                      <Select
                        placeholder="Chọn giới tính"
                        options={Object.keys(genderLabels).map((key) => ({
                          value: key,
                          label: genderLabels[key],
                        }))}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="dateOfBirth"
                      label={<span style={{ fontWeight: 500 }}>Ngày sinh</span>}
                      rules={[{ required: true, message: "Vui lòng chọn ngày sinh" }]}
                    >
                      <DatePicker className="w-full" format="YYYY-MM-DD" placeholder="Chọn ngày sinh" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={24}>
                    <Form.Item
                      name="companyId"
                      label={<span style={{ fontWeight: 500 }}>Công ty công tác</span>}
                      rules={[{ required: true, message: "Vui lòng chọn công ty quản lý" }]}
                    >
                      <Select
                        showSearch
                        placeholder="Chọn công ty trực thuộc từ Database..."
                        prefix={<BankOutlined style={{ color: "#bfbfbf" }} />}
                        options={companyOptions}
                        filterOption={(input, option) =>
                          (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                        }
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item style={{ margin: "24px 0 0 0", textAlign: "right" }}>
                  <Button type="primary" htmlType="submit" loading={loading} style={{ padding: "0 32px" }}>
                    Lưu
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>

      </div>

      <style>{`
        .custom-glitter-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 7px 15px;
          font-size: 14px;
          font-weight: bold;
          color: #ffffff;
          border-radius: 9999px;
          overflow: hidden;
          cursor: pointer;
          user-select: none;
          box-shadow: 0 4px 12px rgba(22, 119, 255, 0.2);
          transition: all 0.3s ease-in-out;
        }
        .custom-glitter-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 20px rgba(22, 119, 255, 0.35);
        }
        .custom-glitter-btn:active {
          transform: scale(0.96);
        }
        
        .btn-bg-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #1677ff 0%, #4f46e5 50%, #06b6d4 100%);
          background-size: 200% 200%;
          border-radius: 9999px;
          transition: all 0.3s ease-in-out;
          animation: gradientMove 4s ease infinite;
        }
        .custom-glitter-btn:hover .btn-bg-gradient {
          transform: scale(1.1);
        }
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .btn-bg-blur {
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          opacity: 0;
          background: #ffffff;
          filter: blur(8px);
          transition: opacity 0.3s ease-in-out;
        }
        .custom-glitter-btn:hover .btn-bg-blur {
          opacity: 0.3;
        }

        .btn-border-overlay {
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease-in-out;
        }
        .custom-glitter-btn:hover .btn-border-overlay {
          border-color: rgba(255, 255, 255, 0.4);
          transform: scale(1.03);
        }

        .glitter-container {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .glitter {
          position: absolute;
          background: radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 70%);
          border-radius: 50%;
          opacity: 0;
          animation: sparkle 3s infinite ease-in-out;
        }
        .glitter.g1 { width: 6px; height: 6px; top: 20%; left: 25%; animation-delay: 0s; }
        .glitter.g2 { width: 8px; height: 8px; top: 65%; left: 75%; animation-delay: 0.9s; }
        .glitter.g3 { width: 5px; height: 5px; top: 45%; left: 15%; animation-delay: 1.7s; }
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0.6); }
          50% { opacity: 0.7; transform: scale(1.3); }
        }

        .btn-wave-effect {
          position: absolute;
          inset: -50%;
          background: radial-gradient(circle, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 65%);
          animation: waveMove 7s linear infinite;
        }
        @keyframes waveMove {
          0% { transform: rotate(0deg) translate(-3px, -3px); }
          50% { transform: rotate(180deg) translate(3px, 3px); }
          100% { transform: rotate(360deg) translate(-3px, -3px); }
        }

        .btn-content-text {
          position: relative;
          z-index: 10;
          display: flex;
          align-items: center;
          gap: 8px;
        }
      `}</style>
    </div>
  );
}