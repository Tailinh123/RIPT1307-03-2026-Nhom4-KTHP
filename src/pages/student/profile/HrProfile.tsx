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
  const [companies, setCompanies] = useState<any[]>([]); // Khai báo State lưu danh sách công ty từ DB

  // ===========================================================================
  // 1. CALL API: LẤY DANH SÁCH CÔNG TY TỪ DATABASE (GIỐNG MANAGE JOBS)
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

  // Chuyển đổi mảng công ty thành định dạng Option cho thẻ Select
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
      companyId: 1, // Mặc định gán ID công ty ban đầu nếu trống
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
          // ĐỌC ID CÔNG TY: Hỗ trợ đọc cả đối tượng nested object company.id từ API thật của Linh gửi về
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
      const localUserData = {
        ...currentUserObj,
        ...apiPayload,
      };
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
          {/* CỘT TRÁI: AVATAR MÁY TÍNH */}
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
              
              <div style={{ marginBottom: "16px" }}>
                <Title level={4} style={{ margin: "0 0 4px 0", fontSize: "18px" }}>
                  {form.getFieldValue("name") || "HR Manager"}
                </Title>
                <Tag color="blue" icon={<SafetyCertificateOutlined />}>HR Doanh Nghiệp</Tag>
              </div>

              <Upload accept="image/*" showUploadList={false} beforeUpload={handleBeforeUpload}>
                <Button icon={<UploadOutlined />} type="dashed">
                  Chọn ảnh từ máy tính
                </Button>
              </Upload>
            </Card>
          </Col>

          {/* CỘT PHẢI: FORM CHUẨN ĐỒNG BỘ 100% */}
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

                {/* ROW THÊM MỚI: ĐỒNG BỘ CÔNG TY QUẢN LÝ CỦA TÀI KHOẢN HR */}
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
    </div>
  );
}