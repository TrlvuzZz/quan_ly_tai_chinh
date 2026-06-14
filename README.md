# ỨNG DỤNG QUẢN LÝ TÀI CHÍNH CÁ NHÂN (KẾT NỐI API TỶ GIÁ NGOẠI TỆ/GIÁ VÀNG THEO THỜI GIAN THỰC VÀ XUẤT BÁO CÁO EXCEL).
---
## Thông tin sinh viên:
+ **Họ và tên:** Trần Lâm Vũ
+ **Lớp:** K59KMT.K01
+ **Mã số sinh viên:** K235510205299
+ **Trường:** Đại học Kỹ thuật Công nghiệp Thái Nguyên
---
### Bước 1: Cài đặt môi trường Python
Cài đặt Python phiên bản 3.10 trở lên trên máy tính. Trong quá trình cài đặt cần tích chọn tùy chọn Add Python to PATH để hệ thống có thể nhận diện và thực thi các lệnh Python từ Terminal.

---
### Bước 2: Tải mã nguồn chương trình
Tải mã nguồn ứng dụng từ kho lưu trữ GitHub được cung cấp. Sau khi tải về, giải nén (nếu có) và lưu dự án vào thư mục phù hợp trên máy tính.
Cấu trúc thư mục dự án sau khi giải nén bao gồm các tệp chính như:
```
app.py
database.py
requirements.txt
finance.db
templates/
static/
```
Đây là các thành phần cần thiết để chương trình hoạt động.

---
### Bước 3: Mở và cấu hình dự án trong PyCharm

Khởi động phần mềm PyCharm, chọn Open và duyệt đến thư mục chứa mã nguồn dự án. Sau khi mở thành công, PyCharm sẽ hiển thị toàn bộ cấu trúc thư mục của chương trình ở cửa sổ Project.

Tiếp theo, mở cửa sổ Terminal trong PyCharm bằng cách chọn:

View → Tool Windows → Terminal

hoặc nhấn:

Alt + F12

Tại cửa sổ Terminal, tiến hành cài đặt các thư viện cần thiết bằng lệnh:

`pip install -r requirements.txt`

PyCharm sẽ tự động tải và cài đặt các thư viện được liệt kê trong tệp requirements.txt.

Sau khi cài đặt hoàn tất, kiểm tra không xuất hiện thông báo lỗi. Tiếp tục khởi động chương trình bằng lệnh:

`python app.py`

Nếu màn hình Terminal xuất hiện thông báo tương tự:

`* Running on http://127.0.0.1:5000`

thì chương trình đã khởi động thành công. Người dùng chỉ cần mở trình duyệt web và truy cập địa chỉ:
`http://127.0.0.1:5000`
để sử dụng hệ thống quản lý tài chính cá nhân.

---
### Kết quả đạt được
+ Xây dựng thành công ứng dụng web quản lý tài chính cá nhân.
+ Thực hiện đầy đủ chức năng thêm, sửa, xóa và tìm kiếm giao dịch.
+ Thống kê tổng thu, tổng chi và số dư theo dữ liệu thực tế.
+ Lưu trữ dữ liệu bền vững bằng cơ sở dữ liệu SQLite.
+ Tích hợp API cập nhật tỷ giá ngoại tệ.
+ Tích hợp API cập nhật giá vàng.
+ Hỗ trợ xuất báo cáo tài chính dưới định dạng Excel.
+ Tổ chức mã nguồn theo kiến trúc phân tách giao diện, xử lý và dữ liệu.
+ Hoàn thành các mục tiêu và yêu cầu của đề tài.
