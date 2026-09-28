/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.{html,js}",
    "./**/*.{html,js}"  // để scan toàn bộ folder
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3b82f6',  // blue-500, bạn có thể thay bằng màu khác ví dụ #2563eb
        },
        secondary: '#10b981',  // green-500, nếu bạn dùng text-secondary sau này
      }
    }
  },
  plugins: [],
}

