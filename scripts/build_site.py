# -*- coding: utf-8 -*-
"""Sinh các trang chính của vshdongyduoc.org từ một khung dùng chung.

Chạy: python3 build_site.py <thư-mục-site>
Các bài trong kien-thuc/, ban-tin/, thoi-su/ giữ nguyên, chỉ các trang chính được tạo lại.
"""
import json, os, sys
from html import escape

OUT = sys.argv[1]
SITE = "https://www.vshdongyduoc.org"
NAME = "Viện Sinh Hóa Đông Y Dược"
EMAIL = "vs.hd@vshdongyduoc.org"
PHONE = "+84 938 575 161"
CONTACT_ENDPOINT = "https://script.google.com/macros/s/AKfycbwcSz9aJdd38JjbqPk7dpZu5BXObIfxYWVsQAbq5ZIPPIi4DInJw54k6nC4m8vFi17W/exec"
PHONE_TEL = "+84938575161"
ADDRESS = "Khu tái định cư, phường Quyết Thắng, tỉnh Thái Nguyên"
REG = "Số đăng ký hoạt động KH&amp;CN 14/2024/GCN-KHCN, Sở Khoa học và Công nghệ tỉnh Thái Nguyên cấp ngày 20/12/2024"
LAW = "Thực phẩm này không phải là thuốc, không có tác dụng thay thế thuốc chữa bệnh."

NAV = [
    ("/", "Trang chủ"),
    ("/gioi-thieu", "Giới thiệu"),
    ("/san-pham", "Sản phẩm"),
    ("/du-an-noi-bat", "Nghiên cứu"),
    ("/kien-thuc", "Kiến thức"),
    ("/ban-tin", "Bản tin"),
    ("/lien-he", "Liên hệ"),
]

# ---------------------------------------------------------------- dữ liệu bài viết
TOPICS = [
    ("/kien-thuc/tieu-duong", "Tiểu đường & tiền tiểu đường", "Dấu hiệu, xét nghiệm HbA1c, mục tiêu kiểm soát đường huyết, ăn uống và vận động."),
    ("/kien-thuc/gan-nhiem-mo", "Gan nhiễm mỡ (MASLD)", "Phân độ, chẩn đoán bằng FIB-4 và elastography, giảm cân bao nhiêu là đủ, dược liệu có vai trò gì."),
    ("/kien-thuc/huyet-ap", "Huyết áp", "Huyết áp bao nhiêu là cao, đo tại nhà đúng chuẩn, chế độ ăn DASH giảm muối và tuân thủ thuốc."),
    ("/kien-thuc/xuong-khop-gout", "Gout & xương khớp", "Acid uric bao nhiêu là cao, xử trí cơn gout cấp, chế độ ăn purin và phân biệt các bệnh khớp."),
    ("/kien-thuc/nguoi-cao-tuoi", "Sức khỏe người cao tuổi", "Đa thuốc, suy giảm cơ, phòng ngã và các mốc tầm soát định kỳ."),
    ("/kien-thuc/dong-trung-ha-thao", "Thư viện Đông trùng hạ thảo", "15 bài về cordycepin, liều dùng, an toàn, tương tác thuốc và mức độ bằng chứng với từng bệnh."),
]
CORDYCEPS = [
    ("dong-trung-ha-thao-la-gi", "Đông trùng hạ thảo là gì?"),
    ("cordycepin", "Cordycepin là gì và hoạt động trong cơ thể như thế nào?"),
    ("cong-dung-dong-trung-ha-thao", "Đông trùng hạ thảo có công dụng gì? Bằng chứng đến đâu?"),
    ("loi-ich-suc-khoe", "Đông trùng hạ thảo có lợi ích gì cho sức khỏe?"),
    ("an-toan-tac-dung-phu", "Có an toàn không? Tác dụng phụ và chống chỉ định"),
    ("cach-su-dung", "Cách dùng đúng liều và đúng thời điểm"),
    ("chon-dong-trung-ha-thao", "Cách chọn sản phẩm chất lượng, đọc nhãn và phiếu kiểm nghiệm"),
    ("dong-trung-ha-thao-tieu-duong", "Có tốt cho người tiểu đường không?"),
    ("dong-trung-ha-thao-gan-nhiem-mo", "Có tốt cho người gan nhiễm mỡ không?"),
    ("dong-trung-ha-thao-mien-dich", "Có giúp tăng cường miễn dịch không?"),
    ("dong-trung-ha-thao-parkinson", "Có hỗ trợ được bệnh Parkinson không?"),
    ("dong-trung-ha-thao-va-ung-thu", "Có chữa được ung thư không?"),
    ("so-sanh-thuc-pham-bo-sung", "So sánh với nhân sâm và linh chi"),
    ("cau-chuyen-nguoi-dung", "Đọc phản hồi người dùng thế nào cho đúng?"),
    ("gia-tri-van-hoa", "Giá trị văn hóa và lịch sử"),
]
NEWS = [
    ("/ban-tin/ban-tin-suc-khoe-14-08-2026-tre-em-va-nang-nong", "14/08/2026", "Giúp trẻ an toàn và ăn uống phù hợp trong những ngày nắng nóng", "Dấu hiệu mất nước, sốc nhiệt ở trẻ và cách chăm sóc, ăn uống trong đợt nắng nóng."),
    ("/ban-tin/15-phut-van-dong-nguy-co-ung-thu", "13/08/2026", "Thêm 15 phút vận động mỗi ngày và mức giảm 2% nguy cơ ung thư: hiểu con số này thế nào?", "Ý nghĩa, giới hạn của nghiên cứu và hành động phù hợp."),
    ("/ban-tin/cuong-aldosterone-nguyen-phat-tang-huyet-ap", "13/08/2026", "Một nguyên nhân nội tiết của tăng huyết áp có thể đang bị bỏ sót", "Cường aldosterone nguyên phát là gì và khi nào nên hỏi bác sĩ về sàng lọc."),
    ("/ban-tin/tien-dai-thao-duong-thuyen-giam", "13/08/2026", "Tiền đái tháo đường có thể thuyên giảm: vì sao đây nên là mục tiêu phòng bệnh?", "Thuyên giảm tiền đái tháo đường nghĩa là gì và các bước an toàn để đạt được."),
    ("/ban-tin/xet-nghiem-fit-sang-loc-ung-thu-dai-truc-trang", "13/08/2026", "Xét nghiệm FIT định kỳ giúp giảm tử vong ung thư đại trực tràng như thế nào?", "Ai nên trao đổi về sàng lọc và FIT có giới hạn gì."),
    ("/ban-tin/kiet-suc-do-nhiet-va-soc-nhiet", "13/08/2026", "Kiệt sức do nhiệt hay sốc nhiệt? Ranh giới nào cần gọi cấp cứu ngay?", "Phân biệt hai tình trạng, sơ cứu ban đầu và dấu hiệu nguy hiểm."),
    ("/ban-tin/hieu-ung-dem-dau-ngu-noi-la", "13/08/2026", "Vì sao đêm đầu ở nơi lạ thường khó ngủ dù bạn rất mệt?", "Hiệu ứng đêm đầu và cách chuẩn bị cho chuyến đi quan trọng."),
]
CURRENT = [
    ("/thoi-su/noi-bai-phan-luong-moi-huong-dan-don-tra-khach-t1-t2", "14/08/2026", "Nội Bài phân luồng mới: 5 việc nên làm trước khi đón, trả khách tại T1 và T2", "Hướng dẫn thực tế cho người đưa đón tại sân bay Nội Bài."),
]

PRODUCTS = [
    dict(name="Tiêu Mỡ Thanh", img="/images/site/tieu-mo-thanh.jpg", tag="Chuyển hóa lipid",
         use="Hỗ trợ giảm mỡ máu, hỗ trợ kiểm soát mỡ thừa.",
         ing="Ý dĩ nhân, Trần bì, Sơn tra, Uất kim/Khương hoàng, Đan sâm, Cát căn, Hoàng cầm, Hoàng liên, Phục linh…",
         pack="Hộp 60 viên nang",
         note="Không dùng cho trẻ dưới 12 tuổi, phụ nữ có thai, cho con bú, người suy gan hoặc suy thận nặng."),
    dict(name="Tiểu Đường Thanh", tag="Đường huyết",
         use="Hỗ trợ ổn định đường huyết.",
         ing="Dây thìa canh, Mướp đắng rừng, Giảo cổ lam, Đông trùng hạ thảo.",
         pack="Hộp 60 viên nang",
         note="Người đang dùng thuốc điều trị tiểu đường cần hỏi ý kiến bác sĩ trước khi dùng."),
    dict(name="Bảo Vệ Gan Thanh", tag="Chức năng gan",
         use="Hỗ trợ tăng cường chức năng gan.",
         ing="Cà gai leo, Diệp hạ châu, Actiso, Xạ đen.",
         pack="Hộp 60 viên nang",
         note="Không dùng cho phụ nữ có thai và đang cho con bú. Để xa tầm tay trẻ em."),
    dict(name="Hỗ Trợ Tim Mạch", tag="Tuần hoàn",
         use="Hỗ trợ lưu thông máu, hỗ trợ giảm cholesterol.",
         ing="Coenzyme Q10, Đan sâm, Tam thất.",
         pack="Hộp 60 viên nang",
         note="Người đang dùng thuốc chống đông máu cần hỏi ý kiến bác sĩ trước khi dùng."),
    dict(name="Cordyceps Extract", tag="Đông trùng hạ thảo",
         use="Hỗ trợ tăng cường sức đề kháng, bồi bổ cơ thể.",
         ing="Chiết xuất Đông trùng hạ thảo (Cordyceps militaris) chuẩn hóa cordycepin và adenosine.",
         pack="Hộp 30 viên nang",
         note="Thận trọng với người có rối loạn đông máu hoặc sắp phẫu thuật."),
    dict(name="Cordycepin Plus", tag="Đông trùng hạ thảo",
         use="Hỗ trợ chống oxy hóa, bồi bổ cơ thể.",
         ing="Cordycepin, L-Arginine, Kẽm gluconate.",
         pack="Hộp 60 viên nang",
         note="Không dùng cho người dưới 18 tuổi."),
]

PUBS = [
    ("Hoang CQ và cộng sự. Molecular mechanisms underlying phenotypic degeneration in Cordyceps militaris: insights from transcriptome reanalysis and osmotic stress studies. Scientific Reports, 2024.", "https://www.nature.com/articles/s41598-024-51946-3"),
    ("Azevedo-Pouly A, …, Hoang CQ và cộng sự. Key transcriptional effectors of the pancreatic acinar phenotype and oncogenic transformation. PLoS One, 2023.", "https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0291512"),
    ("Hoang CQ và cộng sự. Clinical evaluation of RB1 genetic testing reveals novel mutations in Vietnamese patients with retinoblastoma. Molecular and Clinical Oncology, 2021.", "https://www.spandidos-publications.com/10.3892/mco.2021.2344"),
    ("Hoang CQ và cộng sự. Transcriptional maintenance of pancreatic acinar identity, differentiation, and homeostasis by PTF1A. Molecular and Cellular Biology, 2016.", "https://pubmed.ncbi.nlm.nih.gov/27697859/"),
    ("Krah NM, …, Hoang CQ và cộng sự. The acinar differentiation determinant PTF1A inhibits initiation of pancreatic ductal adenocarcinoma. eLife, 2015.", "https://elifesciences.org/articles/07125"),
]

# ---------------------------------------------------------------- khung trang
ORG = {
    "@type": ["Organization", "ResearchOrganization"],
    "@id": f"{SITE}/#organization",
    "name": NAME,
    "alternateName": ["VSHĐYD", "Institute of Traditional Medicine Biochemistry", "ITMB"],
    "url": SITE + "/",
    "logo": f"{SITE}/images/logo.png",
    "email": EMAIL,
    "telephone": PHONE_TEL,
    "foundingDate": "2024-12-20",
    "founder": {"@id": f"{SITE}/gioi-thieu#founder"},
    "address": {"@type": "PostalAddress", "streetAddress": "Khu tái định cư, phường Quyết Thắng", "addressRegion": "Thái Nguyên", "addressCountry": "VN"},
}


def page(path, title, desc, body, current=None, robots="index, follow", extra_ld=None, og_image="/images/site/og-vsh.jpg"):
    url = SITE + (path if path != "/" else "/")
    ld = {"@context": "https://schema.org", "@graph": [ORG, {"@type": "WebSite", "@id": f"{SITE}/#website", "name": NAME, "url": SITE + "/", "inLanguage": "vi", "publisher": {"@id": f"{SITE}/#organization"}}] + (extra_ld or [])}
    cur = ' aria-current="page"'
    nav = "".join(f'<a href="{h}"{cur if h == current else ""}>{t}</a>' for h, t in NAV)
    return f"""<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{escape(title)}</title>
<meta name="description" content="{escape(desc)}">
<meta name="robots" content="{robots}">
<link rel="canonical" href="{url}">
<link rel="icon" href="/images/logo.png" type="image/png">
<meta property="og:type" content="website">
<meta property="og:locale" content="vi_VN">
<meta property="og:site_name" content="{NAME}">
<meta property="og:title" content="{escape(title)}">
<meta property="og:description" content="{escape(desc)}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{SITE}{og_image}">
<meta name="twitter:card" content="summary_large_image">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;600;700;800&display=swap">
<link rel="stylesheet" href="/assets/vsh.css">
<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>
<script defer src="/analytics.js"></script>
</head>
<body>
<a class="skip" href="#main">Bỏ qua điều hướng</a>
<header class="site-header"><div class="wrap">
<a class="brand" href="/"><img src="/images/logo.png" alt="Logo {NAME}" width="94" height="46"><span><strong>{NAME}</strong><small>Tinh hoa cổ truyền · Khoa học kiểm chứng</small></span></a>
<nav class="nav" aria-label="Điều hướng chính">{nav}</nav>
</div></header>
<main id="main">
{body}
</main>
<footer class="site-footer"><div class="wrap">
<div class="cols">
<div>
<h3>{NAME}</h3>
<p>Institute of Traditional Medicine Biochemistry (ITMB)</p>
<p>{ADDRESS}</p>
<p>Email: <a href="mailto:{EMAIL}">{EMAIL}</a><br>Điện thoại: <a href="tel:{PHONE_TEL}">{PHONE}</a></p>
</div>
<div>
<h3>Viện</h3>
<ul><li><a href="/gioi-thieu">Giới thiệu</a></li><li><a href="/du-an-noi-bat">Nghiên cứu</a></li><li><a href="/san-pham">Sản phẩm</a></li><li><a href="/lien-he">Liên hệ</a></li></ul>
</div>
<div>
<h3>Kiến thức</h3>
<ul><li><a href="/kien-thuc">Thư viện kiến thức</a></li><li><a href="/kien-thuc/dong-trung-ha-thao">Đông trùng hạ thảo</a></li><li><a href="/ban-tin">Bản tin sức khỏe</a></li><li><a href="/quyen-rieng-tu">Quyền riêng tư</a></li></ul>
</div>
</div>
<div class="legal">
<p>{REG}.</p>
<p>Nội dung trên website mang tính tham khảo, không thay thế chẩn đoán và điều trị của bác sĩ. Sản phẩm của Viện là thực phẩm bảo vệ sức khỏe. {LAW}</p>
<p>© <span data-year>2026</span> {NAME}.</p>
</div>
</div></footer>
<script defer src="/script.js"></script>
</body>
</html>
"""


def head(title, lede, crumbs=None, eyebrow=None):
    c = ""
    if crumbs:
        c = '<div class="crumbs">' + " / ".join(f'<a href="{h}">{t}</a>' for h, t in crumbs) + "</div>"
    e = f'<span class="eyebrow">{eyebrow}</span>' if eyebrow else ""
    return f'<section class="page-head"><div class="wrap">{c}{e}<h1>{title}</h1><p>{lede}</p></div></section>'


def breadcrumb_ld(items):
    return {"@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": i + 1, "name": n, "item": SITE + h} for i, (h, n) in enumerate(items)]}


def product_meta(p, compact=False):
    return (f'<dl class="pmeta"><dt>Công dụng</dt><dd>{p["use"]}</dd>'
            f'<dt>Thành phần</dt><dd>{p["ing"]}</dd>'
            f'<dt>Quy cách</dt><dd>{p["pack"]}</dd>'
            f'<dt>Lưu ý</dt><dd>{p["note"]}</dd></dl>')


def write(rel, html):
    fp = os.path.join(OUT, rel)
    os.makedirs(os.path.dirname(fp), exist_ok=True)
    with open(fp, "w", encoding="utf-8") as f:
        f.write(html)


# ---------------------------------------------------------------- TRANG CHỦ
topic_cards = "".join(
    f'<a class="card" href="{h}"><span class="tag">Kiến thức</span><h3>{t}</h3><p>{d}</p><span class="more">Đọc →</span></a>'
    for h, t, d in TOPICS)
news_cards = "".join(
    f'<a class="card" href="{h}"><span class="tag grey">{dt}</span><h3>{t}</h3><p>{d}</p></a>'
    for h, dt, t, d in NEWS[:3])
tmt = PRODUCTS[0]

home = f"""
<section class="hero">
<div class="hero-bg" style="background-image:url('/images/site/hero-lab.jpg')"></div>
<div class="wrap">
<span class="eyebrow">Tổ chức khoa học và công nghệ</span>
<h1>{NAME}</h1>
<p class="lede">Chuẩn hóa các bài thuốc cổ phương thành sản phẩm đông dược hiệu quả, an toàn và tiện dùng, bằng phương pháp nghiên cứu sinh học hiện đại.</p>
<div class="btns"><a class="btn btn-primary" href="/san-pham">Xem sản phẩm</a><a class="btn btn-ghost" href="/kien-thuc">Đọc kiến thức</a></div>
</div>
</section>

<section class="block"><div class="wrap">
<div class="sec-head"><span class="eyebrow">Trọng tâm</span><h2>Ba hướng Viện đang tập trung</h2>
<p>Viện ưu tiên các vấn đề sức khỏe kéo dài, cần chăm sóc hằng ngày, nơi một sản phẩm tiện dùng và an toàn tạo ra khác biệt thực sự.</p></div>
<div class="grid g3">
<div class="card"><span class="tag">Đang có sản phẩm</span><h3>Bệnh chuyển hóa mạn tính</h3><p>Rối loạn mỡ máu, đường huyết, gan nhiễm mỡ và huyết áp: nhóm bệnh không lây phổ biến nhất ở người trưởng thành Việt Nam.</p></div>
<div class="card"><span class="tag gold">Đang nghiên cứu</span><h3>Làm sạch và chăm sóc răng miệng</h3><p>Phát triển sản phẩm từ dược liệu cho vệ sinh răng miệng hằng ngày, dựa trên các bài thuốc súc miệng cổ truyền.</p></div>
<div class="card"><span class="tag gold">Đang nghiên cứu</span><h3>Chống lão hóa da</h3><p>Nghiên cứu dược liệu có hoạt tính chống oxy hóa và bảo vệ da, đánh giá trên mô hình tế bào trước khi phát triển sản phẩm.</p></div>
</div>
</div></section>

<section class="block alt"><div class="wrap">
<div class="sec-head"><span class="eyebrow">Cách chúng tôi làm việc</span><h2>Từ bài thuốc cổ phương đến sản phẩm chuẩn hóa</h2>
<p>Mỗi sản phẩm đi qua cùng một quy trình, để giữ được giá trị của bài thuốc gốc nhưng kiểm soát được chất lượng và độ an toàn.</p></div>
<div class="grid g4 steps">
<div class="card step"><h3>Chọn bài thuốc</h3><p>Chọn bài thuốc cổ phương có lịch sử sử dụng lâu dài và có dữ liệu nghiên cứu hiện đại về các vị thuốc chính.</p></div>
<div class="card step"><h3>Nghiên cứu cơ chế</h3><p>Đối chiếu lý luận Đông y với dữ liệu sinh học phân tử để xác định hoạt chất và cơ chế tác động.</p></div>
<div class="card step"><h3>Chiết xuất chuẩn hóa</h3><p>Chuẩn hóa dược liệu và hoạt chất đánh dấu để các lô sản phẩm có chất lượng đồng đều.</p></div>
<div class="card step"><h3>Đánh giá an toàn</h3><p>Đánh giá trên mô hình tế bào và động vật, phối ngũ theo nguyên lý Đông y để giảm tác dụng không mong muốn.</p></div>
</div>
</div></section>

<section class="block"><div class="wrap split">
<img src="{tmt['img']}" alt="Sản phẩm Tiêu Mỡ Thanh" width="560" height="560" loading="lazy">
<div>
<span class="eyebrow">Sản phẩm tiêu biểu</span>
<h2>{tmt['name']}</h2>
<p>Phối hợp các vị thuốc cổ truyền như Sơn tra, Trần bì, Đan sâm, Cát căn và Hoàng liên, chiết xuất và chuẩn hóa theo công nghệ sinh học.</p>
{product_meta(tmt)}
<p class="law">{LAW}</p>
<div class="btns" style="margin-top:18px"><a class="btn btn-green" href="/san-pham">Tất cả sản phẩm</a></div>
</div>
</div></section>

<section class="block alt"><div class="wrap split">
<div>
<span class="eyebrow">Nghiên cứu</span>
<h2>Đề tài VinIF về Đông trùng hạ thảo (2021–2024)</h2>
<p>TS. Hoàng Quốc Chính, người sáng lập Viện, là chủ nhiệm đề tài do Quỹ Đổi mới sáng tạo Vingroup (VinIF) tài trợ: nghiên cứu cơ chế phân tử của hiện tượng thoái hóa giống và sinh tổng hợp cordycepin ở nấm <em>Cordyceps militaris</em>. Kết quả đã được công bố trên tạp chí <em>Scientific Reports</em> (2024).</p>
<div class="btns"><a class="btn btn-outline" href="/du-an-noi-bat">Xem các hướng nghiên cứu</a></div>
</div>
<img src="/images/site/ky-ket-vinif.jpg" alt="Lễ ký kết tài trợ đề tài nghiên cứu Cordyceps militaris của Quỹ VinIF" width="640" height="427" loading="lazy">
</div></section>

<section class="block"><div class="wrap">
<div class="sec-head"><span class="eyebrow">Thư viện kiến thức</span><h2>Kiến thức về bệnh mạn tính, viết theo bằng chứng</h2>
<p>Mỗi bài nói rõ bằng chứng đang ở mức nào: thí nghiệm tế bào, động vật hay thử nghiệm lâm sàng trên người.</p></div>
<div class="grid g3">{topic_cards}</div>
</div></section>

<section class="block alt"><div class="wrap">
<div class="sec-head"><span class="eyebrow">Bản tin sức khỏe</span><h2>Mới cập nhật</h2></div>
<div class="grid g3">{news_cards}</div>
<p style="margin-top:22px"><a class="more" href="/ban-tin">Tất cả bản tin →</a></p>
</div></section>

<section class="block"><div class="wrap">
<div class="cta"><h2>Hợp tác nghiên cứu hoặc tư vấn sản phẩm</h2>
<p>Viện sẵn sàng trao đổi với các đối tác nghiên cứu, doanh nghiệp và người dùng quan tâm đến sản phẩm.</p>
<a class="btn btn-primary" href="/lien-he">Liên hệ với Viện</a></div>
</div></section>
"""
write("index.html", page("/", f"{NAME} | Đông dược chuẩn hóa từ bài thuốc cổ phương",
                         "Viện Sinh Hóa Đông Y Dược nghiên cứu, chuẩn hóa bài thuốc cổ phương thành sản phẩm đông dược an toàn, tiện dùng cho bệnh chuyển hóa mạn tính, răng miệng và da.",
                         home, current="/"))

# ---------------------------------------------------------------- GIỚI THIỆU
founder_ld = {
    "@type": "Person", "@id": f"{SITE}/gioi-thieu#founder", "name": "Hoàng Quốc Chính", "honorificPrefix": "TS.",
    "alternateName": "Chinh Quoc Hoang", "jobTitle": "Viện trưởng, người sáng lập",
    "worksFor": {"@id": f"{SITE}/#organization"},
    "alumniOf": [{"@type": "CollegeOrUniversity", "name": "New Mexico State University"},
                 {"@type": "CollegeOrUniversity", "name": "Trường Đại học Khoa học Tự nhiên, ĐHQG Hà Nội"}],
    "sameAs": ["https://www.researchgate.net/profile/Chinh-Hoang-10"],
}
about = head("Giới thiệu Viện", "Tổ chức khoa học và công nghệ nghiên cứu hiện đại hóa y học cổ truyền, chuẩn hóa bài thuốc cổ phương thành sản phẩm đông dược.",
             [("/", "Trang chủ"), ("/gioi-thieu", "Giới thiệu")]) + f"""
<section class="block"><div class="wrap prose">
<h2>Viện là ai</h2>
<p>{NAME} (tên tiếng Anh: Institute of Traditional Medicine Biochemistry, viết tắt ITMB) là tổ chức khoa học và công nghệ được Sở Khoa học và Công nghệ tỉnh Thái Nguyên cấp Giấy chứng nhận đăng ký hoạt động khoa học và công nghệ số 14/2024/GCN-KHCN, đăng ký lần đầu ngày 20/12/2024. Người đứng đầu tổ chức là TS. Hoàng Quốc Chính.</p>
<p>Lĩnh vực hoạt động đã đăng ký:</p>
<ul>
<li>Công nghệ sinh học liên quan đến y học, y tế;</li>
<li>Dược liệu học, cây thuốc, con thuốc, thuốc nam, thuốc dân tộc;</li>
<li>Hóa dược học;</li>
<li>Dược học cổ truyền;</li>
<li>Thực phẩm chức năng.</li>
</ul>

<h2>Sứ mệnh</h2>
<p>Phát triển sản phẩm đông dược từ các bài thuốc cổ phương, giữ được hiệu quả của bài thuốc gốc nhưng bảo đảm an toàn, chất lượng đồng đều và tiện dùng hằng ngày. Viện tập trung vào bệnh mạn tính không lây, trước hết là các bệnh liên quan đến chuyển hóa, cùng với chăm sóc răng miệng và chống lão hóa da.</p>

<h2>Nguyên tắc làm việc</h2>
<ul>
<li><strong>Nói rõ mức bằng chứng.</strong> Kết quả trên tế bào hoặc động vật không được trình bày như kết quả trên người.</li>
<li><strong>An toàn trước.</strong> Mỗi sản phẩm ghi rõ đối tượng không nên dùng và các tương tác thuốc cần lưu ý.</li>
<li><strong>Không thay thế điều trị.</strong> Sản phẩm là thực phẩm bảo vệ sức khỏe; người bệnh tiếp tục điều trị theo chỉ định của bác sĩ.</li>
</ul>
</div></section>

<section class="block alt" id="founder"><div class="wrap prose">
<span class="eyebrow">Người sáng lập</span>
<h2 style="margin-top:6px">TS. Hoàng Quốc Chính</h2>
<p>Tiến sĩ Sinh học phân tử (New Mexico State University, Hoa Kỳ, 2010), có gần 20 năm nghiên cứu tại Hoa Kỳ, Vương quốc Anh và Việt Nam về sinh học phân tử, di truyền, mô hình động vật và dược liệu. Ông là tác giả và đồng tác giả của 17 bài báo trên các tạp chí quốc tế.</p>
<div class="tbl-wrap"><table class="tbl">
<thead><tr><th>Thời gian</th><th>Vị trí và đơn vị</th><th>Hướng nghiên cứu</th></tr></thead>
<tbody>
<tr><td>2024–nay</td><td>Người sáng lập, Viện trưởng, {NAME}</td><td>Chuẩn hóa bài thuốc cổ phương cho bệnh chuyển hóa mạn tính</td></tr>
<tr><td>2021–2024</td><td>Chủ nhiệm đề tài, Viện Ứng dụng Công nghệ (Bộ KH&amp;CN)</td><td>Thoái hóa giống và sinh tổng hợp cordycepin ở <em>Cordyceps militaris</em> (Quỹ VinIF tài trợ)</td></tr>
<tr><td>2017–2021</td><td>Trưởng dự án, Viện Nghiên cứu Tế bào gốc và Công nghệ Gen Vinmec</td><td>Sản xuất tế bào CAR-T; xét nghiệm gen ung thư di truyền</td></tr>
<tr><td>2016–2017</td><td>Nghiên cứu viên, King's College London, Vương quốc Anh</td><td>Tìm đích thuốc cho ung thư máu</td></tr>
<tr><td>2015–2016</td><td>Nghiên cứu viên, Viện Dược liệu</td><td>Tác dụng của cao lá Trinh nữ hoàng cung trên mô hình phì đại tuyến tiền liệt</td></tr>
<tr><td>2014–2015</td><td>Nghiên cứu viên, Indiana State University, Hoa Kỳ</td><td>Cơ chế suy tim trên mô hình chuột</td></tr>
<tr><td>2011–2014</td><td>Nghiên cứu sau tiến sĩ, UT Southwestern Medical Center, Hoa Kỳ</td><td>Điều hòa gen ở tế bào tụy ngoại tiết; tin sinh học</td></tr>
<tr><td>2006–2010</td><td>Nghiên cứu sinh, New Mexico State University, Hoa Kỳ</td><td>Di truyền học phát triển</td></tr>
</tbody></table></div>
<p><strong>Học vấn:</strong> Tiến sĩ Sinh học phân tử (2010) và Thạc sĩ Sinh học phân tử (2007), New Mexico State University, Hoa Kỳ; Cử nhân Sinh học, chuyên ngành Vi sinh, Trường Đại học Khoa học Tự nhiên, ĐHQG Hà Nội (1999).</p>
<p><strong>Giảng dạy:</strong> Phương pháp nghiên cứu khoa học và bệnh học phân tử tại Trường Đại học Đông Đô.</p>
<p><a href="https://www.researchgate.net/profile/Chinh-Hoang-10" rel="noopener">Hồ sơ ResearchGate</a> · <a href="/du-an-noi-bat#cong-bo">Công bố tiêu biểu</a></p>
</div></section>

<section class="block"><div class="wrap">
<div class="cta"><h2>Làm việc cùng Viện</h2><p>Hợp tác nghiên cứu, chuyển giao hoặc tư vấn sản phẩm.</p><a class="btn btn-primary" href="/lien-he">Liên hệ</a></div>
</div></section>
"""
write("gioi-thieu.html", page("/gioi-thieu", f"Giới thiệu | {NAME}",
                              "Viện Sinh Hóa Đông Y Dược: tổ chức KH&CN số 14/2024/GCN-KHCN (Thái Nguyên), do TS. Hoàng Quốc Chính sáng lập, chuẩn hóa bài thuốc cổ phương.",
                              about, current="/gioi-thieu",
                              extra_ld=[founder_ld, breadcrumb_ld([("/", "Trang chủ"), ("/gioi-thieu", "Giới thiệu")])]))

# ---------------------------------------------------------------- SẢN PHẨM
cards = ""
for p in PRODUCTS[1:]:
    cards += f'<div class="card"><span class="tag">{p["tag"]}</span><h3>{p["name"]}</h3>{product_meta(p)}<p class="law">{LAW}</p></div>'
prod = head("Sản phẩm", "Thực phẩm bảo vệ sức khỏe từ dược liệu, chuẩn hóa theo công nghệ sinh học. Đọc kỹ đối tượng không nên dùng trước khi sử dụng.",
            [("/", "Trang chủ"), ("/san-pham", "Sản phẩm")]) + f"""
<section class="block"><div class="wrap">
<div class="notice"><strong>Lưu ý quan trọng.</strong> {LAW} Người đang điều trị bệnh, phụ nữ có thai hoặc cho con bú nên hỏi ý kiến bác sĩ trước khi dùng.</div>
<div class="product" id="tieu-mo-thanh">
<img src="{tmt['img']}" alt="Sản phẩm Tiêu Mỡ Thanh" width="560" height="560">
<div><span class="eyebrow">Sản phẩm tiêu biểu</span><h2 style="margin:4px 0 8px;color:var(--green-dark);font-size:32px">{tmt['name']}</h2>
<p>Phối hợp các vị thuốc cổ truyền như Sơn tra, Trần bì, Đan sâm, Cát căn và Hoàng liên, chiết xuất và chuẩn hóa theo công nghệ sinh học.</p>
{product_meta(tmt)}<p class="law">{LAW}</p></div>
</div>
</div></section>
<section class="block alt"><div class="wrap">
<div class="sec-head"><h2>Các sản phẩm khác</h2></div>
<div class="grid g3 plist">{cards}</div>
</div></section>
<section class="block"><div class="wrap">
<div class="cta"><h2>Cần tư vấn về sản phẩm?</h2><p>Gửi câu hỏi về thành phần, cách dùng hoặc đối tượng phù hợp. Viện phản hồi trong giờ hành chính.</p>
<a class="btn btn-primary" href="/lien-he">Liên hệ tư vấn</a></div>
</div></section>
"""
write("san-pham.html", page("/san-pham", f"Sản phẩm | {NAME}",
                            "Sản phẩm thực phẩm bảo vệ sức khỏe từ dược liệu chuẩn hóa của Viện Sinh Hóa Đông Y Dược: thành phần, công dụng, quy cách và lưu ý khi dùng.",
                            prod, current="/san-pham", extra_ld=[breadcrumb_ld([("/", "Trang chủ"), ("/san-pham", "Sản phẩm")])]))

# ---------------------------------------------------------------- NGHIÊN CỨU
pubs = "".join(f'<li><a href="{u}" rel="noopener">{escape(c)}</a></li>' for c, u in PUBS)
research = head("Nghiên cứu", "Các hướng nghiên cứu, đề tài và công bố khoa học của Viện và người sáng lập.",
                [("/", "Trang chủ"), ("/du-an-noi-bat", "Nghiên cứu")]) + f"""
<section class="block"><div class="wrap">
<div class="sec-head"><h2>Hướng nghiên cứu chính</h2></div>
<div class="grid g3">
<div class="card"><h3>Chuẩn hóa dược liệu</h3><p>Chiết xuất và chuẩn hóa hoạt chất từ dược liệu, ứng dụng công nghệ sinh học trong kiểm nghiệm.</p></div>
<div class="card"><h3>Đánh giá tác dụng</h3><p>Đánh giá tác dụng dược lý và độ an toàn trên mô hình tế bào và động vật.</p></div>
<div class="card"><h3>Cơ chế bệnh và dữ liệu lớn</h3><p>Ứng dụng multi-omics và phân tích dữ liệu để tìm cơ chế bệnh và đích tác động của bài thuốc.</p></div>
</div>
</div></section>

<section class="block alt"><div class="wrap split">
<div>
<span class="eyebrow">Đề tài đã thực hiện</span>
<h2>Cordyceps militaris: thoái hóa giống và sinh tổng hợp cordycepin</h2>
<p><strong>Tài trợ:</strong> Quỹ Đổi mới sáng tạo Vingroup (VinIF), 2021–2024.<br><strong>Chủ nhiệm:</strong> TS. Hoàng Quốc Chính.<br><strong>Tổ chức chủ trì:</strong> Viện Ứng dụng Công nghệ, Bộ Khoa học và Công nghệ.</p>
<p>Đề tài tìm hiểu vì sao các chủng nấm <em>Cordyceps militaris</em> nuôi cấy mất dần khả năng tạo quả thể và cordycepin sau nhiều thế hệ, với định hướng ứng dụng hoạt chất cordycepin trong hỗ trợ phục hồi sau đột quỵ. Kết quả được công bố trên <em>Scientific Reports</em> năm 2024.</p>
</div>
<img src="/images/site/ky-ket-vinif.jpg" alt="Lễ ký kết tài trợ đề tài của Quỹ VinIF" width="640" height="427" loading="lazy">
</div></section>

<section class="block"><div class="wrap">
<div class="sec-head"><h2>Đề xuất đang xây dựng</h2><p>Các đề tài dưới đây đang ở giai đoạn đề xuất, chưa được phê duyệt tài trợ.</p></div>
<div class="grid g2">
<div class="card"><span class="tag grey">Đề xuất</span><h3>Viên nang Cordyceps militaris giàu cordycepin và polysaccharide</h3><p>Định hướng hỗ trợ bệnh cơ tim do tiểu đường.</p></div>
<div class="card"><span class="tag grey">Đề xuất</span><h3>Phối hợp Cordyceps militaris và Lục vị địa hoàng hoàn</h3><p>Định hướng hỗ trợ người tiểu đường tuýp 2.</p></div>
<div class="card"><span class="tag grey">Đề xuất</span><h3>Đông trùng hạ thảo hoạt tính cao cho gan nhiễm mỡ</h3><p>Nghiên cứu cơ chế và hiệu quả trên mô hình tiền lâm sàng.</p></div>
<div class="card"><span class="tag grey">Đề xuất</span><h3>Tế bào gốc trung mô trong xơ gan</h3><p>Nâng cao hiệu quả liệu pháp tế bào tự thân.</p></div>
</div>
</div></section>

<section class="block alt" id="cong-bo"><div class="wrap prose">
<h2 style="margin-top:0">Công bố khoa học</h2>
<p>Người sáng lập Viện là tác giả và đồng tác giả của 17 bài báo trên các tạp chí quốc tế và 1 bằng độc quyền giải pháp hữu ích liên quan đến sản xuất cordycepin. Một số công bố tiêu biểu:</p>
<ol>{pubs}</ol>
<p>Các công bố cho thấy năng lực nghiên cứu của đội ngũ, không phải bằng chứng về hiệu quả của một sản phẩm cụ thể.</p>
</div></section>

<section class="block"><div class="wrap">
<div class="cta"><h2>Hợp tác nghiên cứu và chuyển giao</h2><p>Viện mở rộng hợp tác với viện nghiên cứu, trường đại học và doanh nghiệp trong và ngoài nước.</p><a class="btn btn-primary" href="/lien-he">Liên hệ hợp tác</a></div>
</div></section>
"""
write("du-an-noi-bat.html", page("/du-an-noi-bat", f"Nghiên cứu và đề tài | {NAME}",
                                 "Hướng nghiên cứu, đề tài VinIF về Cordyceps militaris và cordycepin, các đề xuất đang xây dựng và công bố khoa học của Viện Sinh Hóa Đông Y Dược.",
                                 research, current="/du-an-noi-bat", extra_ld=[breadcrumb_ld([("/", "Trang chủ"), ("/du-an-noi-bat", "Nghiên cứu")])]))

# ---------------------------------------------------------------- KIẾN THỨC
cordy = "".join(f'<li><a href="/kien-thuc/dong-trung-ha-thao/{s}"><strong>{t}</strong></a></li>' for s, t in CORDYCEPS)
kt = head("Thư viện kiến thức", "Kiến thức về bệnh mạn tính và dược liệu, viết theo bằng chứng và nói rõ bằng chứng đang ở mức nào.",
          [("/", "Trang chủ"), ("/kien-thuc", "Kiến thức")]) + f"""
<section class="block"><div class="wrap">
<div class="notice green"><strong>Cách đọc mức bằng chứng.</strong> Mỗi bài phân biệt ba mức: thí nghiệm trên tế bào (in vitro), trên động vật, và thử nghiệm lâm sàng trên người. Chỉ mức thứ ba cho biết một chất có tác dụng ở người hay không.</div>
<div class="sec-head"><h2>Chủ đề chính</h2></div>
<div class="grid g3">{topic_cards}</div>
</div></section>
<section class="block alt"><div class="wrap">
<div class="sec-head"><h2>Thư viện Đông trùng hạ thảo</h2><p>15 bài về bản chất, hoạt chất cordycepin, cách dùng, an toàn và mức bằng chứng với từng bệnh. <a href="/kien-thuc/dong-trung-ha-thao">Trang tổng hợp →</a></p></div>
<ul class="list">{cordy}</ul>
</div></section>
<section class="block"><div class="wrap prose">
<p>Nội dung mang tính tham khảo và giáo dục sức khỏe, không thay thế chẩn đoán, điều trị hoặc lời khuyên của bác sĩ.</p>
</div></section>
"""
write("kien-thuc.html", page("/kien-thuc", f"Kiến thức bệnh mạn tính và dược liệu | {NAME}",
                             "Thư viện kiến thức về tiểu đường, gan nhiễm mỡ, huyết áp, gout, sức khỏe người cao tuổi và đông trùng hạ thảo, phân tầng rõ mức bằng chứng.",
                             kt, current="/kien-thuc", extra_ld=[breadcrumb_ld([("/", "Trang chủ"), ("/kien-thuc", "Kiến thức")])]))

# ---------------------------------------------------------------- BẢN TIN / THỜI SỰ
def news_list(items):
    return "".join(f'<li><a href="{h}"><strong>{t}</strong><span>{dt} · {d}</span></a></li>' for h, dt, t, d in items)

bt = head("Bản tin sức khỏe", "Tin nghiên cứu y học mới, giải thích ngắn gọn: kết quả nói gì, giới hạn ở đâu và nên làm gì.",
          [("/", "Trang chủ"), ("/ban-tin", "Bản tin")]) + f"""
<section class="block"><div class="wrap">
<ul class="list">{news_list(NEWS)}</ul>
<div class="sec-head" style="margin-top:48px"><h2>Thời sự</h2></div>
<ul class="list">{news_list(CURRENT)}</ul>
</div></section>
"""
write("ban-tin.html", page("/ban-tin", f"Bản tin sức khỏe | {NAME}",
                           "Bản tin sức khỏe của Viện Sinh Hóa Đông Y Dược: giải thích các nghiên cứu y học mới, giới hạn của kết quả và hành động phù hợp.",
                           bt, current="/ban-tin", extra_ld=[breadcrumb_ld([("/", "Trang chủ"), ("/ban-tin", "Bản tin")])]))
ts = head("Bản tin thời sự", "Thông tin thời sự có ích cho đời sống hằng ngày.", [("/", "Trang chủ"), ("/ban-tin", "Bản tin"), ("/thoi-su", "Thời sự")]) + f"""
<section class="block"><div class="wrap"><ul class="list">{news_list(CURRENT)}</ul>
<p style="margin-top:24px"><a class="more" href="/ban-tin">← Bản tin sức khỏe</a></p></div></section>
"""
write("thoi-su.html", page("/thoi-su", f"Bản tin thời sự | {NAME}", "Bản tin thời sự của Viện Sinh Hóa Đông Y Dược.", ts, current="/ban-tin"))

# ---------------------------------------------------------------- LIÊN HỆ
contact = head("Liên hệ", "Gửi câu hỏi về sản phẩm, đề nghị hợp tác nghiên cứu hoặc góp ý nội dung. Viện phản hồi trong giờ hành chính.",
               [("/", "Trang chủ"), ("/lien-he", "Liên hệ")]) + f"""
<section class="block"><div class="wrap split" style="align-items:start">
<div>
<h2>Thông tin liên hệ</h2>
<p><strong>Địa chỉ:</strong> {ADDRESS}</p>
<p><strong>Email:</strong> <a href="mailto:{EMAIL}">{EMAIL}</a></p>
<p><strong>Điện thoại:</strong> <a href="tel:{PHONE_TEL}">{PHONE}</a></p>
<p><strong>Giờ làm việc:</strong> Thứ Hai đến Thứ Sáu, 8:00–17:00</p>
<div class="notice">Viện không tư vấn chẩn đoán hoặc điều trị cho từng người bệnh qua website. Nếu có dấu hiệu cấp cứu, hãy gọi 115 hoặc đến cơ sở y tế gần nhất.</div>
</div>
<div class="card">
<form class="contact" id="contact-form" action="{CONTACT_ENDPOINT}" method="post">
<input type="hidden" name="source_url" value="">
<input type="hidden" name="site" value="vshdongyduoc.org">
<div hidden aria-hidden="true"><label for="contact-website">Để trống ô này</label><input id="contact-website" name="website" type="text" tabindex="-1" autocomplete="off"></div>
<div><label for="inquiry-type">Chủ đề</label><select id="inquiry-type" name="inquiry_type" required><option value="GENERAL">Tư vấn sản phẩm</option><option value="BUSINESS_AFFILIATE">Hợp tác nghiên cứu, kinh doanh</option><option value="SCIENTIFIC_EDITORIAL_CORRECTION">Góp ý nội dung khoa học</option><option value="GENERAL">Khác</option></select></div>
<div><label for="name">Họ và tên</label><input id="name" name="name" required autocomplete="name"></div>
<div class="row2">
<div><label for="email">Email</label><input id="email" name="email" type="email" required autocomplete="email"></div>
<div><label for="phone">Số điện thoại <span class="opt">(không bắt buộc)</span></label><input id="phone" name="phone" type="tel" autocomplete="tel"></div>
</div>
<div><label for="message">Nội dung</label><textarea id="message" name="message" rows="6" required></textarea></div>
<p style="font-size:14px;color:var(--muted);margin:0">Thông tin chỉ dùng để phản hồi yêu cầu của bạn. Xem <a href="/quyen-rieng-tu">chính sách quyền riêng tư</a>.</p>
<button class="btn btn-green" type="submit">Gửi liên hệ</button>
<p id="form-status" role="status" aria-live="polite" style="margin:0;font-weight:600"></p>
</form>
<script>
(function () {{
  var form = document.getElementById("contact-form");
  var status = document.getElementById("form-status");
  try {{
    var ref = new URL(document.referrer || location.href, location.href);
    form.elements.source_url.value = (ref.origin + ref.pathname).slice(0, 2048);
  }} catch (e) {{}}
  form.addEventListener("submit", function (event) {{
    event.preventDefault();
    if (!form.reportValidity()) return;
    var btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    status.style.color = "";
    status.textContent = "Đang gửi…";
    fetch(form.action, {{ method: "POST", body: new FormData(form) }})
      .then(function (r) {{ return r.json().then(function (j) {{ if (!r.ok || j.success !== true) throw new Error("rejected"); }}); }})
      .then(function () {{
        status.textContent = "Đã gửi thành công.";
        setTimeout(function () {{ location.assign("/thank-you"); }}, 500);
      }})
      .catch(function () {{
        status.style.color = "#9b3517";
        status.textContent = "Chưa gửi được. Vui lòng thử lại hoặc email {EMAIL}.";
        btn.disabled = false;
      }});
  }});
}})();
</script>
</div>
</div></section>
"""
write("lien-he.html", page("/lien-he", f"Liên hệ | {NAME}",
                           "Liên hệ Viện Sinh Hóa Đông Y Dược: tư vấn sản phẩm, hợp tác nghiên cứu, góp ý nội dung. Email vs.hd@vshdongyduoc.org, điện thoại +84 938 575 161.",
                           contact, current="/lien-he", extra_ld=[breadcrumb_ld([("/", "Trang chủ"), ("/lien-he", "Liên hệ")])]))

# ---------------------------------------------------------------- QUYỀN RIÊNG TƯ
priv = head("Quyền riêng tư", "Viện chỉ thu thập những dữ liệu cần thiết để vận hành website và phản hồi liên hệ.",
            [("/", "Trang chủ"), ("/quyen-rieng-tu", "Quyền riêng tư")]) + f"""
<section class="block"><div class="wrap prose">
<h2 style="margin-top:0">Dữ liệu đo lường truy cập</h2>
<p>Website dùng Vercel Web Analytics để tổng hợp lượt xem trang, thời điểm truy cập, nguồn giới thiệu, loại thiết bị, trình duyệt và vị trí địa lý gần đúng. Công cụ này không đặt cookie và dữ liệu chỉ được dùng ở dạng tổng hợp để đánh giá nội dung.</p>
<h2>Dữ liệu từ biểu mẫu liên hệ</h2>
<p>Khi bạn gửi biểu mẫu, Viện nhận chủ đề, họ tên, email, nội dung và số điện thoại nếu bạn cung cấp. Biểu mẫu được xử lý qua Google Apps Script và lưu vào một bảng tính Google Sheets thuộc tài khoản của Viện. Thông tin chỉ dùng để phản hồi yêu cầu của bạn, không dùng cho quảng cáo và không bán cho bên thứ ba.</p>
<h2>Dữ liệu không thu thập</h2>
<p>Viện không thu thập hồ sơ bệnh án, không suy đoán tuổi hoặc giới tính của người đọc và không tạo hồ sơ cá nhân.</p>
<h2>Yêu cầu của bạn</h2>
<p>Bạn có thể yêu cầu xem, sửa hoặc xóa thông tin đã gửi bằng cách email tới <a href="mailto:{EMAIL}">{EMAIL}</a>.</p>
<p><em>Cập nhật: 29/09/2026.</em></p>
</div></section>
"""
write("quyen-rieng-tu.html", page("/quyen-rieng-tu", f"Quyền riêng tư | {NAME}",
                                  "Chính sách quyền riêng tư của Viện Sinh Hóa Đông Y Dược: dữ liệu đo lường truy cập và dữ liệu từ biểu mẫu liên hệ.",
                                  priv, current=None))

# ---------------------------------------------------------------- CẢM ƠN, 404
ty = head("Đã gửi thành công", "Cảm ơn bạn đã liên hệ. Viện sẽ phản hồi qua email trong giờ hành chính.") + """
<section class="block"><div class="wrap"><div class="btns"><a class="btn btn-green" href="/">Về trang chủ</a><a class="btn btn-outline" href="/kien-thuc">Đọc kiến thức</a></div></div></section>
"""
write("thank-you.html", page("/thank-you", f"Đã gửi thành công | {NAME}", "Cảm ơn bạn đã liên hệ Viện Sinh Hóa Đông Y Dược.", ty, robots="noindex, follow"))
nf = head("Không tìm thấy trang", "Trang bạn tìm có thể đã được chuyển hoặc không còn tồn tại.") + f"""
<section class="block"><div class="wrap"><div class="grid g3">
<a class="card" href="/"><h3>Trang chủ</h3><p>Giới thiệu Viện và các hướng nghiên cứu.</p></a>
<a class="card" href="/san-pham"><h3>Sản phẩm</h3><p>Thực phẩm bảo vệ sức khỏe từ dược liệu chuẩn hóa.</p></a>
<a class="card" href="/kien-thuc"><h3>Kiến thức</h3><p>Bệnh mạn tính và dược liệu, viết theo bằng chứng.</p></a>
</div></div></section>
"""
write("404.html", page("/404", f"Không tìm thấy trang | {NAME}", "Trang không tồn tại.", nf, robots="noindex, follow"))

# ---------------------------------------------------------------- sitemap
urls = ["/", "/gioi-thieu", "/san-pham", "/du-an-noi-bat", "/kien-thuc", "/ban-tin", "/thoi-su", "/lien-he", "/quyen-rieng-tu"]
urls += [h for h, _, _ in TOPICS]
urls += [f"/kien-thuc/dong-trung-ha-thao/{s}" for s, _ in CORDYCEPS]
urls += [h for h, *_ in NEWS] + [h for h, *_ in CURRENT]
with open(os.path.join(OUT, "sitemap.xml"), "w", encoding="utf-8") as f:
    f.write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n')
    for u in urls:
        f.write(f"  <url><loc>{SITE}{u if u != '/' else '/'}</loc><lastmod>2026-09-29</lastmod></url>\n")
    f.write("</urlset>\n")
print("OK", len(urls), "URL trong sitemap")
