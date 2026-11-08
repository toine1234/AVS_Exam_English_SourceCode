# Python PyMuPDF PDF Textbook Extractor & Template Generator

Dịch vụ backend Python (FastAPI) chuyên dụng cho website ôn luyện tiếng Anh **Global Success**:
- Tự động đọc và bóc tách sách giáo khoa tiếng Anh định dạng PDF (Global Success 6, 7, Cambridge PET, IELTS Foundation...).
- Sử dụng thư viện **PyMuPDF (`fitz`)** để trích xuất văn bản và tự động cắt các hình ảnh minh họa (minh họa phòng học, bản đồ, đồ vật...) từ trang sách vào thư mục công khai `/public/uploads/media/`.
- Tự động sinh file Excel chuẩn 11 cột (`template_import.xlsx`) theo đúng cấu trúc hệ thống:
  `STT`, `Ma_Phan_Tap`, `Noi_Dung_Cau_Hoi`, `Dap_An_A`, `Dap_An_B`, `Dap_An_C`, `Dap_An_D`, `Dap_An_Dung`, `Giai_Thich`, `Media_Type`, `Media_File`.
- Cho phép xem trước (Preview) và nạp trực tiếp vào Ngân hàng câu hỏi (Question Bank) hoặc tạo bài kiểm tra định kỳ (Periodic Exam).

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Dịch Vụ Python

### Bước 1: Chuẩn bị môi trường Python (Python 3.9+)
```bash
cd python_service
python3 -m venv venv
source venv/bin/activate  # Trên Linux / macOS
# hoặc venv\Scripts\activate trên Windows
```

### Bước 2: Cài đặt các thư viện cần thiết
```bash
pip install -r requirements.txt
```

### Bước 3: Khởi động API Server
```bash
python app.py
# hoặc:
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

Sau khi khởi động:
- **API Documentation (Swagger UI)**: `http://localhost:8000/docs`
- **Health Check**: `http://localhost:8000/health`
- **PDF Extraction Endpoint**: `POST http://localhost:8000/api/extract-pdf`
- **Download Excel Template**: `GET http://localhost:8000/api/download-template`

---

## 📡 Tích Hợp Với Ứng Dụng Web React
Website Express server tại cổng `3000` được cấu hình endpoint proxy `/api/python-service/process-pdf`:
- Nếu service Python đang chạy trên cổng `8000`, request sẽ được chuyển tiếp trực tiếp sang FastAPI để PyMuPDF xử lý tốc độ cao và trích xuất hình ảnh.
- Nếu service Python chưa được bật, server Express sẽ kích hoạt bộ xử lý thông minh để giáo viên vẫn xem trước được 10 câu hỏi chuẩn 11 cột, tải file `template_import.xlsx` và nhập liệu vào Question Bank mà không bị gián đoạn.
