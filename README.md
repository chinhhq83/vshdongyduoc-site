# vshdongyduoc.org

Website tĩnh của Viện Sinh Hóa Đông Y Dược, deploy lên Vercel.

- Các trang chính (trang chủ, giới thiệu, sản phẩm, nghiên cứu, kiến thức, bản tin, liên hệ, quyền riêng tư, 404, sitemap) được sinh bởi `scripts/build_site.py`. Sửa nội dung trong file này rồi chạy: `python scripts/build_site.py .`
- Giao diện dùng chung: `assets/vsh.css`. Bài kiến thức dùng `kien-thuc/kb.css`, bài bản tin dùng `ban-tin/article.css`.
- `vercel.json`: chuyển hướng 301 các đường dẫn pet cũ sang dogsupplementfacts.com.
