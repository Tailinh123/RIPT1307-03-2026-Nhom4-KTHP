const ERROR_TRANSLATIONS: Record<string, string> = {
  'Login by credential': 'Đăng nhập thành công.',
  'Bad credentials': 'Tài khoản hoặc mật khẩu không chính xác.',
  'User is disabled': 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ với Quản trị viên để được hỗ trợ.',
  'Account is disabled': 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ với Quản trị viên để được hỗ trợ.',
  'User account is locked': 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ với Quản trị viên để được hỗ trợ.',
  'Access is denied': 'Bạn không có quyền thực hiện thao tác này.',
  'Forbidden': 'Bạn không có quyền truy cập chức năng này.',
  'Network Error': 'Lỗi kết nối đến máy chủ. Vui lòng kiểm tra mạng.',
  'Email already in use': 'Email này đã được sử dụng.',
  'Email already exists': 'Email này đã được đăng ký trong hệ thống.',
  'Not Found': 'Không tìm thấy dữ liệu yêu cầu.',
  'Internal Server Error': 'Lỗi hệ thống máy chủ, vui lòng thử lại sau.',
  'You have already applied to this job': 'Bạn đã nộp đơn ứng tuyển vào công việc này rồi. Không thể ứng tuyển nhiều lần cho cùng một vị trí!',
  'Skill name already exists': 'Kỹ năng này đã tồn tại.',
  'Category name already exists': 'Danh mục này đã tồn tại.',
  'You do not have permission to access this endpoint!!!': 'Chỉ có Ứng viên mới được phép nộp đơn ứng tuyển!'
};
export const getBackendMessage = (payload: any, fallback = 'Thao tác thành công.') => {
  const candidates = [
    payload?.response?.data?.message,
    payload?.response?.data?.error,
    payload?.response?.data?.data?.message,
    payload?.data?.message,
    payload?.data?.error,
    payload?.message,
    payload?.error,
  ];
  let message = candidates.find((item) => {
    if (typeof item !== 'string' || !item.trim()) return false;
    return !/^request failed with status code \d+$/i.test(item.trim());
  });
  if (typeof message === 'string' && message.trim()) {
    message = message.trim();
    if (ERROR_TRANSLATIONS[message]) {
      return ERROR_TRANSLATIONS[message];
    }
    const lowerMsg = message.toLowerCase();
    if (lowerMsg.includes('bad credential')) return 'Tài khoản hoặc mật khẩu không chính xác.';
    if (lowerMsg.includes('disabled')) return 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ với Quản trị viên để được hỗ trợ.';
    if (lowerMsg.includes('access is denied') || lowerMsg.includes('forbidden')) return 'Bạn không có quyền thực hiện thao tác này.';
    if (lowerMsg.includes('network error')) return 'Lỗi kết nối mạng, vui lòng thử lại.';
    if (lowerMsg.includes('cannot delete user because there are resumes')) return 'Lỗi: Tài khoản này đang có CV/Đơn ứng tuyển.';
    if (lowerMsg.includes('skill') && lowerMsg.includes('already exist')) return 'Kỹ năng này đã tồn tại.';
    if (lowerMsg.includes('category') && lowerMsg.includes('already exist')) return 'Danh mục này đã tồn tại.';
    if (lowerMsg.includes('constraint') || lowerMsg.includes('data integrity') || lowerMsg.includes('foreign key')) return 'Không thể xóa do đối tượng này đang có dữ liệu ràng buộc trong hệ thống.';
    return message;
  }
  return fallback;
};
export const getBackendErrorMessage = (error: any, fallback = 'Có lỗi xảy ra. Vui lòng thử lại.') =>
  getBackendMessage(error, fallback);
