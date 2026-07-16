type SupabaseErrorLike = {
  message?: string;
  code?: string;
};

function toErrorLike(error: unknown): SupabaseErrorLike {
  if (!error) return {};
  if (typeof error === "string") return { message: error };
  if (error instanceof Error) return { message: error.message };
  if (typeof error === "object") return error as SupabaseErrorLike;
  return {};
}

export function mapAuthError(error: unknown): string {
  const { message = "", code = "" } = toErrorLike(error);
  const m = message.toLowerCase();
  const c = code.toLowerCase();
  const has = (needle: string) => m.includes(needle) || c.includes(needle);

  if (has("over_email_send_rate_limit") || has("email rate limit exceeded") || has("rate limit")) {
    return "Bạn thao tác quá nhiều lần, vui lòng thử lại sau vài phút.";
  }
  if (has("invalid_credentials") || has("invalid login credentials")) {
    return "Email hoặc mật khẩu không đúng.";
  }
  if (has("user_already_exists") || has("user already registered")) {
    return "Email này đã được đăng ký, thử đăng nhập thay vì đăng ký.";
  }
  if (has("email_exists") || has("email address is already registered")) {
    return "Email này đã được sử dụng cho tài khoản khác.";
  }
  if (has("email_not_confirmed") || has("email not confirmed")) {
    return "Vui lòng xác nhận email trước khi đăng nhập. Kiểm tra hộp thư của bạn.";
  }
  if (has("weak_password") || has("password should be at least")) {
    return "Mật khẩu phải có ít nhất 6 ký tự.";
  }
  if (has("same_password") || has("should be different from the old password")) {
    return "Mật khẩu mới phải khác mật khẩu hiện tại.";
  }
  if (has("user_not_found")) {
    return "Không tìm thấy tài khoản.";
  }
  if (has("email_address_invalid") || (has("email") && has("invalid"))) {
    return "Địa chỉ email không hợp lệ.";
  }
  if (
    has("network") ||
    has("failed to fetch") ||
    has("fetch failed") ||
    has("timeout") ||
    has("timed out")
  ) {
    return "Không thể kết nối, kiểm tra lại internet và thử lại.";
  }
  if (has("popup") && (has("blocked") || has("failed to open"))) {
    return "Trình duyệt đã chặn cửa sổ đăng nhập Google. Vui lòng cho phép popup và thử lại.";
  }
  if (has("dismiss") || has("cancel")) {
    return "Bạn đã hủy đăng nhập Google.";
  }

  return "Có lỗi xảy ra, vui lòng thử lại sau.";
}
