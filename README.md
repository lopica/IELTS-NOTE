# IELTS Note

Web app quản lý và lưu trữ bài làm IELTS mock test, tích hợp Google Drive/Sheets.

## Tính năng

- 🏠 **Trang chủ** — Giới thiệu và đăng nhập Google
- 📋 **Danh sách answer sheet** — Xem tất cả bài làm IELTS
- ✏️ **Tạo bài làm mới** — Tạo và điền answer sheet
- 📄 **Chi tiết bài làm** — Xem chi tiết từng bài theo ID
- 🔐 **Đăng nhập Google** — Dùng Google Sign-In và đồng bộ với Drive/Sheets
- ⏱️ **Timer** — Hỗ trợ canh giờ làm bài
- 🎨 **Tailwind CSS** — Giao diện responsive

## Công nghệ

- **React 19** + **React Router 7**
- **TypeScript**
- **Tailwind CSS**
- **Zustand** (state), **TanStack Query**, **React Hook Form**, **Zod**
- **Google APIs** (Drive, Sheets) — GAPI, GSI
- **Radix UI**, **Lucide Icons**, **Sonner**

## Yêu cầu

- Node.js (khuyến nghị phiên bản LTS)
- Tài khoản Google (cho đăng nhập và lưu trữ)

## Cài đặt

```bash
npm install
```

## Chạy development

```bash
npm run dev
```

Ứng dụng chạy tại `http://localhost:5173`.

## Build production

```bash
npm run build
```

## Chạy production (sau khi build)

```bash
npm start
```

## Kiểm tra type

```bash
npm run typecheck
```

## Cấu trúc routes

- `/` — Trang chủ (landing)
- `/list` — Danh sách IELTS sheets
- `/list/create` — Tạo sheet mới
- `/list/:id` — Chi tiết sheet theo ID

## Docker

Build và chạy bằng Docker:

```bash
docker build -t ielts-note .
docker run -p 3000:3000 ielts-note
```

---

Built with React Router & TypeScript.
