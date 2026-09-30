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
    ("/cong-cu", "Công cụ"),
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
    "identifier": {"@type": "PropertyValue", "propertyID": "Giấy chứng nhận đăng ký hoạt động KH&CN", "value": "14/2024/GCN-KHCN"},
    "contactPoint": {"@type": "ContactPoint", "contactType": "customer service", "email": EMAIL, "telephone": PHONE_TEL, "url": SITE + "/lien-he", "availableLanguage": "vi"},
    "founder": {"@id": f"{SITE}/gioi-thieu#founder"},
    "address": {"@type": "PostalAddress", "streetAddress": "Khu tái định cư, phường Quyết Thắng", "addressRegion": "Thái Nguyên", "addressCountry": "VN"},
}


def page(path, title, desc, body, current=None, robots="index, follow", extra_ld=None, og_image="/images/site/og-vsh.jpg", tool=False, extra_head="", body_attr=""):
    # tool=True: trang công cụ tự đánh giá — không có link /san-pham và không có câu về sản phẩm.
    url = SITE + (path if path != "/" else "/")
    ld = {"@context": "https://schema.org", "@graph": [ORG, {"@type": "WebSite", "@id": f"{SITE}/#website", "name": NAME, "url": SITE + "/", "inLanguage": "vi", "publisher": {"@id": f"{SITE}/#organization"}}] + (extra_ld or [])}
    cur = ' aria-current="page"'
    nav = "".join(f'<a href="{h}"{cur if h == current else ""}>{t}</a>' for h, t in NAV if not (tool and h == "/san-pham"))
    vien_links = '<li><a href="/gioi-thieu">Giới thiệu</a></li><li><a href="/du-an-noi-bat">Nghiên cứu</a></li>' + ("" if tool else '<li><a href="/san-pham">Sản phẩm</a></li>') + '<li><a href="/lien-he">Liên hệ</a></li>'
    legal = "Nội dung trên website mang tính tham khảo, không thay thế chẩn đoán và điều trị của bác sĩ." + ("" if tool else f" Sản phẩm của Viện là thực phẩm bảo vệ sức khỏe. {LAW}")
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
<meta name="twitter:title" content="{escape(title)}">
<meta name="twitter:description" content="{escape(desc)}">
<meta name="twitter:image" content="{SITE}{og_image}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;600;700;800&display=swap">
<link rel="stylesheet" href="/assets/vsh.css">
<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>
<script defer src="/analytics.js"></script>
{extra_head}</head>
<body{body_attr}>
<a class="skip" href="#main">Bỏ qua điều hướng</a>
<header class="site-header"><div class="wrap">
<a class="brand" href="/"><img src="/images/logo.png" alt="Logo {NAME}" width="94" height="46"><span><strong>{NAME}</strong><small>Tinh hoa cổ truyền · Nghiên cứu khoa học</small></span></a>
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
<ul>{vien_links}</ul>
</div>
<div>
<h3>Kiến thức</h3>
<ul><li><a href="/kien-thuc">Thư viện kiến thức</a></li><li><a href="/cong-cu">Công cụ tự đánh giá</a></li><li><a href="/kien-thuc/dong-trung-ha-thao">Đông trùng hạ thảo</a></li><li><a href="/ban-tin">Bản tin sức khỏe</a></li><li><a href="/quyen-rieng-tu">Quyền riêng tư</a></li></ul>
</div>
</div>
<div class="legal">
<p>{REG}.</p>
<p>{legal}</p>
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
<p class="lede">Nghiên cứu các bài thuốc cổ phương và chuẩn hóa thành sản phẩm hỗ trợ sức khỏe an toàn, chất lượng ổn định và tiện dùng, bằng phương pháp nghiên cứu sinh học hiện đại.</p>
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
write("index.html", page("/", f"{NAME} | Nghiên cứu, chuẩn hóa bài thuốc cổ phương",
                         "Viện Sinh Hóa Đông Y Dược nghiên cứu, chuẩn hóa bài thuốc cổ phương thành sản phẩm từ dược liệu an toàn, tiện dùng, hỗ trợ sức khỏe chuyển hóa, răng miệng và da.",
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
about = head("Giới thiệu Viện", "Tổ chức khoa học và công nghệ nghiên cứu hiện đại hóa y học cổ truyền, chuẩn hóa bài thuốc cổ phương thành sản phẩm từ dược liệu.",
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
<figure style="margin:24px 0">
<img src="/images/site/giay-chung-nhan-khcn.jpg" alt="Giấy chứng nhận đăng ký hoạt động khoa học và công nghệ số 14/2024/GCN-KHCN của Viện Sinh Hóa Đông Y Dược" width="1280" height="720" loading="lazy" style="border:1px solid var(--line);border-radius:10px">
<figcaption style="font-size:14px;color:var(--muted);margin-top:8px">Giấy chứng nhận đăng ký hoạt động khoa học và công nghệ số 14/2024/GCN-KHCN, Sở Khoa học và Công nghệ tỉnh Thái Nguyên cấp ngày 20/12/2024. Thông tin định danh cá nhân đã được che.</figcaption>
</figure>

<h2>Sứ mệnh</h2>
<p>Phát triển sản phẩm từ dược liệu dựa trên các bài thuốc cổ phương, giữ được giá trị của bài thuốc gốc nhưng bảo đảm an toàn, chất lượng đồng đều và tiện dùng hằng ngày. Viện tập trung vào bệnh mạn tính không lây, trước hết là các bệnh liên quan đến chuyển hóa, cùng với chăm sóc răng miệng và chống lão hóa da.</p>

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
write("san-pham.html", page("/san-pham", "Tiêu Mỡ Thanh, Tiểu Đường Thanh và các sản phẩm | VSHĐYD",
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
</div></section>
"""
write("ban-tin.html", page("/ban-tin", f"Bản tin sức khỏe | {NAME}",
                           "Bản tin sức khỏe của Viện Sinh Hóa Đông Y Dược: giải thích các nghiên cứu y học mới, giới hạn của kết quả và hành động phù hợp.",
                           bt, current="/ban-tin", extra_ld=[breadcrumb_ld([("/", "Trang chủ"), ("/ban-tin", "Bản tin")])]))
ts = head("Bản tin thời sự", "Thông tin thời sự có ích cho đời sống hằng ngày.", [("/", "Trang chủ"), ("/ban-tin", "Bản tin"), ("/thoi-su", "Thời sự")]) + f"""
<section class="block"><div class="wrap"><ul class="list">{news_list(CURRENT)}</ul>
<p style="margin-top:24px"><a class="more" href="/ban-tin">← Bản tin sức khỏe</a></p></div></section>
"""
write("thoi-su.html", page("/thoi-su", f"Bản tin thời sự | {NAME}", "Bản tin thời sự của Viện Sinh Hóa Đông Y Dược.", ts, current="/ban-tin", robots="noindex, follow"))

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


# ---------------------------------------------------------------- CÔNG CỤ TỰ ĐÁNH GIÁ (/cong-cu)
# Nội dung y khoa của công cụ 03 và 02 đã được khóa (xem cong-cu/TEST-*.md). Không diễn giải lại.
# Trang công cụ dùng page(tool=True): không có link /san-pham, không có câu về sản phẩm.
TOOL_UPDATED = "30/09/2026"
TOOL_HEAD = '<link rel="stylesheet" href="/cong-cu/assets/tools.css">\n'
NOSCRIPT = '<noscript><p class="stop">Công cụ cần bật JavaScript để tính. Khi JavaScript tắt, biểu mẫu không gửi dữ liệu đi đâu.</p></noscript>'


def faq_ld(items):
    return {"@type": "FAQPage", "mainEntity": [
        {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a, _ in items]}


def faq_html(items):
    return '<section class="block alt tool"><div class="wrap" id="faq"><h2>Câu hỏi thường gặp</h2>' + "".join(
        f'<details class="faq"{f" id={chr(34)}{i}{chr(34)}" if i else ""}><summary>{escape(q)}</summary><p>{escape(a)}</p></details>' for q, a, i in items) + "</div></section>"


def summary_block(code, tool_name):
    return f"""<div id="print-summary" aria-label="Bản tóm tắt mang đến bác sĩ">
<h2 data-line>Tóm tắt tự đánh giá — không phải phiếu chẩn đoán</h2>
<p data-line>{NAME} · vshdongyduoc.org · {code} · {tool_name}</p>
<p data-line id="s-date"></p>
<p data-line id="s-input"></p>
<p data-line id="s-result"></p>
<p data-line>Người dùng tự nhập. Cơ sở khám cần đo lại / khai thác lại. Công cụ không thay thế khám bệnh, không kê đơn.</p>
<p data-line>Ghi chú của bác sĩ / điều dưỡng:</p>
<div class="notes"><div></div><div></div><div></div><div></div></div>
</div>
<textarea id="summary-fallback" hidden readonly aria-label="Văn bản tóm tắt để sao chép"></textarea>"""


def actions_row(primary=""):
    return f"""<div class="btn-row no-print">{primary}
<button type="button" class="btn-t ghost" id="copy-summary">Sao chép tóm tắt</button>
<button type="button" class="btn-t ghost" id="print-btn">In</button>
<button type="button" class="btn-t ghost" id="download-btn">Tải bản HTML</button>
</div>
<p class="r-small no-print">Muốn có PDF: bấm In rồi chọn “Lưu thành PDF”.</p>"""


def history_block(cols):
    th = "".join(f"<th>{c}</th>" for c in ["Ngày"] + cols)
    return f"""<p class="btn-row no-print"><button type="button" class="btn-t ghost" id="save-btn">Lưu kết quả trên máy này</button> <span id="save-note" class="r-small" aria-live="polite"></span></p>
<section class="tool-card history no-print" id="history" hidden>
<h2>Kết quả đã lưu trên máy này</h2>
<p class="r-small">Chỉ lưu trong trình duyệt của bạn (tối đa 12 lần). Viện không nhận được dữ liệu này.</p>
<table><thead><tr>{th}</tr></thead><tbody></tbody></table>
<button type="button" class="link-t" id="clear-history">Xóa lịch sử</button>
</section>"""


def radios(name, opts, required=True, col=False):
    return f'<div class="opts{" col" if col else ""}">' + "".join(
        f'<label class="opt"><input type="radio" name="{name}" value="{v}"{" required" if required and i == 0 else ""}> {t}</label>' for i, (v, t) in enumerate(opts)) + "</div>"


SEX = [("nam", "Nam"), ("nu", "Nữ")]

# ---- Công cụ 03: BMI và vòng eo chuẩn châu Á
BMI_PATH = "/cong-cu/bmi-vong-eo-chau-a"
BMI_FAQ = [
    ("BMI 23 khác BMI 25 chỗ nào?", "Theo bảng phân loại cho người châu Á trong Quyết định 2892/QĐ-BYT, BMI từ 23 đã thuộc nhóm thừa cân và từ 25 thuộc nhóm béo phì độ I. Nhiều máy tính quốc tế dùng mốc 25 cho thừa cân và 30 cho béo phì. Người châu Á có thể tăng nguy cơ rối loạn chuyển hóa ở mức BMI thấp hơn (WHO Expert Consultation, Lancet 2004).", "faq-bmi23"),
    ("Đo vòng eo thế nào mới đúng?", "Đứng thẳng, hai chân rộng khoảng 10 cm. Dùng thước dây mềm, không kéo căng, đặt ngang qua điểm giữa bờ trên xương chậu và bờ dưới xương sườn cuối (thường gần rốn). Đọc số lúc thở ra nhẹ, không co bụng. Đo hai lần; nếu lệch quá 1 cm thì lấy trung bình.", None),
    ("Công cụ này có phải khám bệnh không?", "Không. Công cụ chỉ đối chiếu số đo bạn tự nhập với bảng phân loại đã công bố. Nó không chẩn đoán, không kê đơn và không thay thế khám bệnh.", None),
]
bmi_body = head("BMI và vòng eo theo chuẩn người châu Á",
    "Người châu Á, kể cả người Việt, có thể tăng nguy cơ rối loạn chuyển hóa từ BMI 23 — sớm hơn mốc 25 trên nhiều máy tính quốc tế. Công cụ này đối chiếu số đo của bạn với bảng trong Quyết định 2892/QĐ-BYT; đây không phải chẩn đoán bệnh.",
    [("/", "Trang chủ"), ("/cong-cu", "Công cụ")], "Công cụ 03") + f"""
<section class="block tool"><div class="wrap">
{NOSCRIPT}
<div class="tool-grid two">
<div class="tool-card">
<form id="tool-form" hidden novalidate>
<fieldset><legend>Giới tính</legend>{radios("sex", SEX)}</fieldset>
<label class="f">Chiều cao (cm) <input type="number" name="height" inputmode="decimal" min="120" max="220" step="0.5" required></label>
<label class="f">Cân nặng (kg) <input type="number" name="weight" inputmode="decimal" min="30" max="200" step="0.1" required></label>
<label class="f">Vòng eo (cm) <span class="hint">Không bắt buộc, nhưng nên có. Xem cách đo bên cạnh.</span><input type="number" name="waist" inputmode="decimal" min="50" max="160" step="0.1"></label>
<label class="f">Tuổi <span class="hint">Không bắt buộc. Công cụ dành cho người từ 18 tuổi.</span><input type="number" name="age" inputmode="numeric" min="1" max="90" step="1"></label>
<label class="check"><input type="checkbox" name="pregnant"> Tôi đang mang thai</label>
<div class="btn-row"><button type="submit" class="btn-t">Tính BMI và đối chiếu vòng eo</button></div>
</form>
<p class="stop" id="stop-msg" role="alert" tabindex="-1" hidden></p>
</div>
<aside class="tool-card howto" id="cach-do-vong-eo">
<h2>Cách đo vòng eo</h2>
<ol>
<li>Đứng thẳng, hai chân rộng khoảng 10 cm, sức nặng đều hai chân.</li>
<li>Dùng thước dây mềm, không kéo căng.</li>
<li>Đặt thước ngang qua điểm giữa bờ trên xương chậu và bờ dưới xương sườn cuối (thường gần rốn, không phải chỗ nhỏ nhất của quần).</li>
<li>Thở đều, đọc số lúc thở ra nhẹ, không co bụng.</li>
<li>Đo hai lần; nếu lệch quá 1 cm thì lấy trung bình.</li>
</ol>
</aside>
</div>

<section class="tool-card result" id="result" aria-live="polite" tabindex="-1" hidden>
<h2>Kết quả</h2>
<div class="r-block"><p class="r-label">Chỉ số của bạn</p><p id="r-main"></p></div>
<div class="r-block"><p class="r-label">Việc nên làm tiếp</p><div id="r-next"></div></div>
<div class="r-block"><p class="r-label">Vòng eo</p><p id="r-waist"></p><p class="r-small" id="r-muscle" hidden></p></div>
<p class="r-small" id="r-range"></p>
{actions_row('<a class="btn-t" id="to-findrisc" href="/cong-cu/nguy-co-dai-thao-duong-findrisc">Tính nguy cơ đái tháo đường 10 năm (ModAsian FINDRISC)</a>')}
{summary_block("VSH-03", "BMI và vòng eo chuẩn châu Á")}
<div class="sources">
<p><strong>Nguồn</strong> (ngưỡng áp dụng theo văn bản ban hành ngày 22/10/2022; nội dung công cụ cập nhật {TOOL_UPDATED}):</p>
<ol>
<li>Bộ Y tế. Quyết định 2892/QĐ-BYT ngày 22/10/2022. Bảng 4.1 và mục 4.2 vòng bụng.</li>
<li>WHO Expert Consultation. Appropriate body-mass index for Asian populations. Lancet. 2004;363:157–163.</li>
<li>WHO/IASO/IOTF. The Asia-Pacific Perspective: Redefining Obesity and its Treatment. 2000.</li>
<li>International Diabetes Federation. Worldwide definition of the metabolic syndrome — vòng eo Nam Á/Trung Quốc: nam 90 cm, nữ 80 cm.</li>
</ol>
<p class="disclaimer">Kết quả chỉ phản ánh số đo bạn tự nhập, đối chiếu với bảng phân loại công bố. Đây không phải chẩn đoán, không phải lời khuyên điều trị, không thay thế khám bệnh. Nếu BMI ≥ 25 theo ngưỡng châu Á, vòng eo vượt mốc, hoặc bạn đang có triệu chứng, hãy đến cơ sở y tế.</p>
</div>
<div class="r-block no-print"><p class="r-label">Đọc thêm</p>
<p><a href="#faq-bmi23">Vì sao BMI 23 đã cần lưu ý ở người Việt</a><br><a href="#cach-do-vong-eo">Cách đo vòng eo đúng</a><br><a href="/kien-thuc/tieu-duong">Đường huyết đói và HbA1c khác nhau chỗ nào</a></p></div>
</section>
{history_block(["BMI", "Nhóm", "Vòng eo"])}
</div></section>
{faq_html(BMI_FAQ)}"""
TOOL_SCRIPTS_BMI = TOOL_HEAD + '<script defer src="/cong-cu/assets/bmi.js"></script>\n<script defer src="/cong-cu/assets/tools.js"></script>\n'
write("cong-cu/bmi-vong-eo-chau-a.html", page(BMI_PATH, f"BMI và vòng eo chuẩn châu Á cho người Việt | {NAME}",
    "Tính BMI theo ngưỡng Bộ Y tế cho người châu Á (từ 23 đã là thừa cân) và đối chiếu vòng eo 90/80. Không chẩn đoán, có bản mang đi khám.",
    bmi_body, current="/cong-cu", tool=True, extra_head=TOOL_SCRIPTS_BMI, body_attr=' data-tool="bmi"',
    extra_ld=[faq_ld(BMI_FAQ), breadcrumb_ld([("/", "Trang chủ"), ("/cong-cu", "Công cụ"), (BMI_PATH, "BMI và vòng eo chuẩn châu Á")])]))

# ---- Công cụ 02: ModAsian FINDRISC
FR_PATH = "/cong-cu/nguy-co-dai-thao-duong-findrisc"
FR_FAQ = [
    ("Công cụ này có chẩn đoán đái tháo đường không?", "Không. Đây chỉ là thang câu hỏi sàng lọc (ModAsian FINDRISC), không phải xét nghiệm máu và không phải chẩn đoán đái tháo đường.", None),
    ("Vì sao không dùng mốc BMI 25 và vòng eo 94/102?", "Bản này điều chỉnh BMI và vòng eo theo người châu Á (Quyết định 2892/QĐ-BYT và ngưỡng IDF: vòng eo nam 90 cm, nữ 80 cm), gọi là ModAsian FINDRISC.", None),
    ("Thiếu vòng eo thì sao?", "Vẫn ra điểm, nhưng thiếu tối đa 4 điểm — kết quả có thể thấp hơn thực tế.", None),
]
fr_body = head("Tự ước lượng nguy cơ đái tháo đường type 2 trong 10 năm",
    "Thang FINDRISC điều chỉnh BMI và vòng eo theo người châu Á. Điểm số giúp định hướng việc nên làm tiếp, không phải xét nghiệm và không phải chẩn đoán đái tháo đường. Đã được dùng trong nghiên cứu cộng đồng tại Việt Nam (ModAsian FINDRISC).",
    [("/", "Trang chủ"), ("/cong-cu", "Công cụ")], "Công cụ 02") + f"""
<section class="block tool"><div class="wrap">
{NOSCRIPT}
<p class="stop" id="bridge-note" hidden>Đã điền sẵn số đo từ công cụ BMI và vòng eo. Bạn có thể sửa trước khi tính. <a href="{BMI_PATH}">← Quay lại BMI và vòng eo</a></p>
<div class="tool-card">
<form id="tool-form" hidden novalidate>
<label class="check"><input type="checkbox" name="diagnosed"> Tôi đã được bác sĩ chẩn đoán đái tháo đường</label>
<fieldset><legend>Giới tính</legend>{radios("sex", SEX)}</fieldset>
<label class="f">1. Bạn bao nhiêu tuổi? <input type="number" name="age" inputmode="numeric" min="1" max="110" step="1" required></label>
<fieldset><legend>2. BMI</legend><p class="hint">BMI được tính từ chiều cao và cân nặng bạn nhập.</p>
<label class="f">Chiều cao (cm) <input type="number" name="height" inputmode="decimal" min="120" max="220" step="0.5" required></label>
<label class="f">Cân nặng (kg) <input type="number" name="weight" inputmode="decimal" min="30" max="200" step="0.1" required></label></fieldset>
<label class="f">3. Vòng eo (cm), đo dưới xương sườn / ngang rốn <span class="hint">Nam: &lt; 90 hoặc ≥ 90 cm; nữ: &lt; 80 hoặc ≥ 80 cm. Bản châu Âu có 3 mốc (94/102); bản ModAsian trên trang này chỉ dùng 2 mốc châu Á. Không bắt buộc — bỏ trống thì kết quả có thể thấp hơn thực tế. <a href="{BMI_PATH}#cach-do-vong-eo">Cách đo</a></span><input type="number" name="waist" inputmode="decimal" min="50" max="160" step="0.1"></label>
<fieldset><legend>4. Thông thường mỗi ngày bạn có ít nhất 30 phút vận động khi làm việc và/hoặc lúc rảnh (kể cả việc nhà, đi bộ)?</legend>{radios("active", [("co", "Có"), ("khong", "Không")])}</fieldset>
<fieldset><legend>5. Bạn ăn rau, quả hoặc quả mọng thường xuyên thế nào?</legend>{radios("veg", [("co", "Mỗi ngày"), ("khong", "Không phải mỗi ngày")])}</fieldset>
<fieldset><legend>6. Bạn đã từng uống thuốc huyết áp thường xuyên chưa?</legend>{radios("bp", [("khong", "Chưa"), ("co", "Rồi")])}</fieldset>
<fieldset><legend>7. Bạn đã từng được phát hiện đường huyết cao chưa (khi khám, lúc ốm, hoặc khi mang thai)?</legend>{radios("glucose", [("khong", "Chưa"), ("co", "Rồi")])}</fieldset>
<fieldset><legend>8. Trong gia đình, đã có người được chẩn đoán đái tháo đường (type 1 hoặc type 2) chưa?</legend>{radios("family", [("khong", "Không"), ("xa", "Chỉ ông bà, cô dì chú bác, hoặc anh chị em họ"), ("gan", "Có bố mẹ, anh chị em ruột, hoặc con")], col=True)}</fieldset>
<div class="btn-row"><button type="submit" class="btn-t">Tính điểm</button></div>
</form>
<p class="stop" id="stop-msg" role="alert" tabindex="-1" hidden></p>
</div>

<section class="tool-card result" id="result" aria-live="polite" tabindex="-1" hidden>
<h2>Kết quả</h2>
<div class="r-block"><p class="r-label">Điểm của bạn</p><p class="r-score" id="r-score"></p><p><strong id="r-label"></strong></p><p class="r-small" id="r-ref"></p><p class="r-small" id="r-waistnote" hidden></p></div>
<div class="r-block"><p class="r-label">Việc nên làm tiếp</p><div id="r-next"></div></div>
<p id="r-always"></p>
{actions_row(f'<a class="btn-t ghost" href="{BMI_PATH}">← Quay lại BMI và vòng eo</a>')}
{summary_block("VSH-02", "ModAsian FINDRISC — nguy cơ đái tháo đường type 2 trong 10 năm")}
<div class="sources">
<p><strong>Nguồn</strong> (thang điểm công bố năm 2003; ngưỡng BMI/vòng eo theo văn bản ngày 22/10/2022; nội dung công cụ cập nhật {TOOL_UPDATED}):</p>
<ol>
<li>Lindström J, Tuomilehto J. The diabetes risk score. Diabetes Care. 2003;26:725–731.</li>
<li>Doan L, Nguyen HT, Nguyen TTP, Phan TTL, Huy LD, Nguyen TTH, Doan TP. ModAsian FINDRISC as a Screening Tool for People with Undiagnosed Type 2 Diabetes Mellitus in Vietnam: A Community-Based Cross-Sectional Study. <i>J Multidiscip Healthc</i>. 2023;16:439–449. doi:10.2147/JMDH.S398455.</li>
<li>Ngưỡng BMI/vòng eo thống nhất Quyết định 2892/QĐ-BYT và IDF châu Á — xem <a href="{BMI_PATH}">công cụ BMI và vòng eo</a>.</li>
</ol>
<p class="disclaimer">Kết quả là điểm sàng lọc theo thang ModAsian FINDRISC, dựa trên câu bạn tự trả lời. Đây không phải xét nghiệm máu và không phải chẩn đoán đái tháo đường. Tỷ lệ % 10 năm trên trang là số liệu của tài liệu gốc, không phải xác suất riêng của bạn. Từ 12 điểm: nên đến cơ sở y tế để được chỉ định xét nghiệm. Từ 15 điểm, hoặc có khát nhiều / đái nhiều / sụt cân: nên khám sớm. Không tự mua thuốc hạ đường huyết.</p>
</div>
</section>
{history_block(["Điểm", "Nhóm"])}
</div></section>
{faq_html(FR_FAQ)}"""
TOOL_SCRIPTS_FR = TOOL_HEAD + '<script defer src="/cong-cu/assets/findrisc.js"></script>\n<script defer src="/cong-cu/assets/tools.js"></script>\n'
write("cong-cu/nguy-co-dai-thao-duong-findrisc.html", page(FR_PATH, f"Nguy cơ đái tháo đường type 2 trong 10 năm (ModAsian FINDRISC) | {NAME}",
    "8 câu hỏi FINDRISC điều chỉnh BMI và vòng eo cho người châu Á, đã dùng trong nghiên cứu tại Việt Nam. Không phải xét nghiệm, không chẩn đoán, có bản mang đi khám.",
    fr_body, current="/cong-cu", tool=True, extra_head=TOOL_SCRIPTS_FR, body_attr=' data-tool="findrisc"',
    extra_ld=[faq_ld(FR_FAQ), breadcrumb_ld([("/", "Trang chủ"), ("/cong-cu", "Công cụ"), (FR_PATH, "Nguy cơ đái tháo đường 10 năm")])]))

# ---- Công cụ 01: Tự đánh giá thể chất Đông y. CỔNG PHÁP LÝ + Y KHOA nằm trong cong-cu/assets/tool01/config.js.
# Trang này KHÔNG chứa câu hỏi CCMQ nào. Phần giải thích để tĩnh (đọc được khi không có JS, cho máy tìm kiếm).
T01_PATH = "/cong-cu/tu-danh-gia-the-chat-dong-y"
T01_DISCLAIMER = "Công cụ này cung cấp thông tin tự đánh giá phục vụ giáo dục sức khỏe. Kết quả không phải là chẩn đoán bệnh, không thay thế khám, chẩn đoán hoặc điều trị bởi nhân viên y tế."
T01_CARE = "Nếu bạn có triệu chứng bất thường, kéo dài hoặc đang điều trị bệnh, hãy trao đổi với nhân viên y tế phù hợp."
T01_PREG = "Công cụ này chưa được thiết kế để đưa ra khuyến nghị riêng cho phụ nữ mang thai. Nếu đang mang thai và có vấn đề sức khỏe, hãy trao đổi với nhân viên y tế."
T01_NINE = [("Bình hòa", "trạng thái được mô tả là cân bằng"), ("Khí hư", "xu hướng thiếu hụt về “khí”"), ("Dương hư", "xu hướng thiếu hụt về phần dương"),
    ("Âm hư", "xu hướng thiếu hụt về phần âm"), ("Đàm thấp", "xu hướng liên quan đến “đàm” và “thấp”"), ("Thấp nhiệt", "xu hướng kết hợp “thấp” và “nhiệt”"),
    ("Huyết ứ", "xu hướng liên quan đến lưu thông của “huyết”"), ("Khí uất", "xu hướng liên quan đến lưu thông của “khí”"), ("Đặc bẩm", "xu hướng thể chất đặc thù, liên quan yếu tố bẩm sinh")]
T01_FAQ = [
    ("Công cụ này là gì?", "Một công cụ tự đánh giá thể chất theo 9 nhóm thể chất của y học cổ truyền, phục vụ tham khảo và giáo dục sức khỏe. Không phải công cụ chẩn đoán bệnh và không thay thế tư vấn của nhân viên y tế.", None),
    ("Công cụ này không làm gì?", "Không chẩn đoán bệnh, không kê đơn, không gợi ý thảo dược, bài thuốc, thực phẩm bảo vệ sức khỏe hay sản phẩm nào, và không thay thế khám bệnh.", None),
    ("Thông tin có được lưu không?", "Không. Câu trả lời và kết quả chỉ nằm trong trình duyệt của bạn trong lúc làm bài, không gửi về máy chủ, không lưu vào trình duyệt, không đưa vào công cụ thống kê. Tải lại trang là mất.", None),
    ("Ai nên sử dụng?", "Người từ 18 tuổi trở lên. Công cụ không dành cho trẻ em và chưa đưa ra khuyến nghị riêng cho phụ nữ mang thai.", None),
]
t01_body = head("Tự đánh giá thể chất Đông y (9 thể)",
    "Công cụ tự đánh giá thể chất để tham khảo và giáo dục sức khỏe. Không phải công cụ chẩn đoán bệnh và không thay thế tư vấn của nhân viên y tế.",
    [("/", "Trang chủ"), ("/cong-cu", "Công cụ")], "Công cụ 01") + f"""
<section class="block tool"><div class="wrap">
<p class="disclaimer">{T01_DISCLAIMER} {T01_CARE}</p>

<div class="tool-card" id="t01-locked">
<p class="stop">Bộ câu hỏi chuẩn đang được hoàn thiện thủ tục quyền sử dụng. Công cụ hiện chưa mở cho người dùng.</p>
<p class="btn-row"><a class="btn-t ghost" href="mailto:{EMAIL}?subject=Nh%E1%BA%AFn%20t%C3%B4i%20khi%20c%C3%B4ng%20c%E1%BB%A5%20th%E1%BB%83%20ch%E1%BA%A5t%20%C4%90%C3%B4ng%20y%20m%E1%BB%9F">Nhắn Viện khi công cụ mở (qua email)</a></p>
<p class="r-small">Email được mở bằng ứng dụng thư của bạn; trang này không thu thập dữ liệu. <a href="/cong-cu">Xem các công cụ đang mở</a>.</p>
</div>
{NOSCRIPT}

<div id="t01-app" hidden>
<p class="stop" id="t01-demo-banner" hidden>BẢN THỬ NGHIỆM trên máy lập trình viên: câu hỏi là câu giả (Q01…Q60), không phải câu hỏi CCMQ.</p>
<p class="stop" id="t01-review-banner" hidden>Nội dung kết quả đang chờ người duyệt y khoa.</p>

<section class="tool-card" id="t01-elig" aria-labelledby="t01-elig-title">
<h2 id="t01-elig-title">Trước khi bắt đầu</h2>
<p>{T01_PREG}</p>
<label class="check"><input type="checkbox" id="t01-age"> Tôi từ 18 tuổi trở lên.</label>
<label class="check"><input type="checkbox" id="t01-ack"> Tôi hiểu kết quả chỉ để tham khảo, không phải chẩn đoán bệnh.</label>
<p class="stop" id="t01-elig-err" role="alert" hidden></p>
<div class="btn-row"><button type="button" class="btn-t" id="t01-begin">Bắt đầu</button></div>
</section>

<section class="tool-card" id="t01-assess" hidden aria-labelledby="t01-assess-title">
<h2 id="t01-assess-title" tabindex="-1">Câu hỏi</h2>
<p class="r-small" id="t01-progress-text" aria-live="polite"></p>
<progress id="t01-progress" value="0" max="1" style="width:100%;height:10px"></progress>
<div id="t01-questions"></div>
<p class="stop" id="t01-q-err" role="alert" hidden></p>
<div class="btn-row"><button type="button" class="btn-t ghost" id="t01-back" hidden>← Quay lại</button><button type="button" class="btn-t" id="t01-next">Tiếp</button></div>
</section>

<section class="tool-card result" id="t01-result" hidden tabindex="-1" aria-live="polite" aria-labelledby="t01-result-title">
<h2 id="t01-result-title">Kết quả</h2>
<p><strong id="t01-headline"></strong></p>
<p id="t01-others" hidden></p>
<p>Thể chất là một khái niệm phân loại sức khỏe truyền thống. Thể chất không phải là chẩn đoán bệnh.</p>
<p id="t01-about"></p>
<div class="r-block"><p class="r-label">Gợi ý lối sống chung</p><ul id="t01-guidance"></ul></div>
<div class="r-block"><p class="r-label">Điểm từng nhóm (thang 0–100)</p>
<table class="t01-scores"><thead><tr><th>Nhóm</th><th>Điểm</th><th>Mức</th></tr></thead><tbody id="t01-scores"></tbody></table></div>
<p class="disclaimer">{T01_DISCLAIMER} {T01_CARE}</p>
<div class="btn-row no-print"><button type="button" class="btn-t" id="t01-print">In hoặc lưu PDF</button><button type="button" class="btn-t ghost" id="t01-restart">Làm lại</button></div>
<div id="print-summary" aria-label="Bản tóm tắt để in">
<h2>Bản tóm tắt tự đánh giá thể chất Đông y</h2>
<p>{NAME} · vshdongyduoc.org · VSH-01</p>
<p id="t01-s-date"></p>
<p id="t01-s-result"></p>
<p id="t01-s-scores"></p>
<p id="t01-s-about"></p>
<p>Thể chất không phải là chẩn đoán bệnh. {T01_DISCLAIMER}</p>
<p>Có thể mang bản này khi trao đổi với bác sĩ hoặc nhân viên y tế nếu thấy hữu ích.</p>
</div>
</section>
</div>
</div></section>

<section class="block alt tool"><div class="wrap t01-info">
<h2>Công cụ này là gì?</h2>
<p>Một công cụ tự đánh giá thể chất theo 9 nhóm thể chất của y học cổ truyền, dựa trên khung phân loại của bảng hỏi thể chất Trung y (CCMQ). Mục đích là tham khảo và giáo dục sức khỏe.</p>
<h2>9 thể chất là gì?</h2>
<p>Thể chất là khái niệm của y học cổ truyền dùng để mô tả xu hướng tương đối ổn định của cơ thể. Khung phân loại gồm 9 nhóm:</p>
<ol>{"".join(f"<li><strong>{n}</strong>: {d}.</li>" for n, d in T01_NINE)}</ol>
<p>Thể chất không phải là chẩn đoán bệnh.</p>
<h2>Công cụ này không làm gì?</h2>
<p>Không chẩn đoán bệnh, không kê đơn, không gợi ý thảo dược, bài thuốc, thực phẩm bảo vệ sức khỏe hay sản phẩm nào, và không thay thế khám bệnh. Gợi ý trong kết quả chỉ gồm thói quen sinh hoạt chung: ăn uống điều độ, vận động, giấc ngủ, uống đủ nước, quản lý căng thẳng.</p>
<h2>Kết quả được tính như thế nào?</h2>
<p>Mỗi câu trả lời được chấm từ 1 đến 5; một số câu tính điểm đảo. Với mỗi nhóm có n câu, điểm chuyển đổi = (tổng điểm − n) ÷ (n × 4) × 100, trên thang 0–100. Nhóm Bình hòa được xác định khi điểm Bình hòa từ 60 trở lên và điểm các nhóm còn lại dưới 30 (hoặc dưới 40 cho mức “cơ bản”). Nhóm khác được xác định khi điểm từ 40 trở lên, và “có xu hướng” khi từ 30 đến dưới 40. Các ngưỡng sẽ được đối chiếu lần cuối với phiên bản bảng hỏi được cấp phép trước khi mở công cụ.</p>
<h2>Ai nên sử dụng?</h2>
<p>Người từ 18 tuổi trở lên. Công cụ không dành cho trẻ em. {T01_PREG}</p>
<h2>Thông tin có được lưu không?</h2>
<p>Không. Câu trả lời và kết quả chỉ nằm trong trình duyệt của bạn trong lúc làm bài: không gửi về máy chủ, không lưu vào trình duyệt, không đưa vào đường dẫn, không đưa vào công cụ thống kê. Tải lại trang là mất. Bạn có thể tự in hoặc lưu bản tóm tắt.</p>
<h2>Nguồn khoa học</h2>
<h3>Bảng hỏi / tiêu chuẩn gốc</h3>
<ul><li>Bảng hỏi thể chất Trung y (Constitution in Chinese Medicine Questionnaire, CCMQ), nhóm Vương Kỳ; tiêu chuẩn phân loại và xác định thể chất Trung y của Hội Trung y dược Trung Quốc (2009). <em>Thông tin trích dẫn đầy đủ và phiên bản cụ thể: đang chờ xác minh.</em></li></ul>
<h3>Nghiên cứu thẩm định bản tiếng Việt</h3>
<ul><li>Nghiên cứu thẩm định bản tiếng Việt (2022). <em>Thông tin trích dẫn đầy đủ: đang chờ xác minh và chờ xác nhận quyền sử dụng.</em></li></ul>
<h3>Tài liệu y khoa và lối sống</h3>
<ul><li><em>Sẽ bổ sung sau khi người duyệt y khoa hoàn tất.</em></li></ul>
</div></section>"""
write("cong-cu/tu-danh-gia-the-chat-dong-y.html", page(T01_PATH, f"Tự đánh giá thể chất Đông y (9 thể) | {NAME}",
    "Tìm hiểu 9 thể chất Đông y và công cụ tự đánh giá thể chất theo khung CCMQ. Để tham khảo và giáo dục sức khỏe, không chẩn đoán bệnh, không lưu dữ liệu.",
    t01_body, current="/cong-cu", tool=True,
    extra_head=TOOL_HEAD + "".join(f'<script defer src="/cong-cu/assets/tool01/{f}"></script>\n' for f in ["config.js", "scoring.js", "questionnaire.js", "results.js", "ui.js"]),
    extra_ld=[faq_ld(T01_FAQ), breadcrumb_ld([("/", "Trang chủ"), ("/cong-cu", "Công cụ"), (T01_PATH, "Tự đánh giá thể chất Đông y")])]))
# Địa chỉ chờ cũ: chuyển sang địa chỉ mới bằng thẻ meta (không đổi cấu hình deploy).
write("cong-cu/the-chat-dong-y.html", f"""<!DOCTYPE html>
<html lang="vi"><head><meta charset="UTF-8"><meta name="robots" content="noindex, follow">
<link rel="canonical" href="{SITE}{T01_PATH}"><meta http-equiv="refresh" content="0; url={T01_PATH}">
<title>Tự đánh giá thể chất Đông y | {NAME}</title></head>
<body><p><a href="{T01_PATH}">Trang đã chuyển: Tự đánh giá thể chất Đông y</a></p></body></html>
""")

# ---- Công cụ 04–07: khung chung. Chữ y khoa chờ người duyệt ký (xem cong-cu/HO-SO-DUYET.md).
def generic_tool(slug, code, tool_name, data_tool, script, title, meta, h1, lead, form_inner, sources, disclaimer, faq, hist_cols, eyebrow, before_form=""):
    path = f"/cong-cu/{slug}"
    body = head(h1, lead, [("/", "Trang chủ"), ("/cong-cu", "Công cụ")], eyebrow) + f"""
<section class="block tool"><div class="wrap">
{NOSCRIPT}
{before_form}
<div class="tool-card">
<form id="tool-form" hidden novalidate>
{form_inner}
<div class="btn-row"><button type="submit" class="btn-t">Xem kết quả</button></div>
</form>
<p class="stop" id="stop-msg" role="alert" tabindex="-1" hidden></p>
</div>
<section class="tool-card result" id="result" aria-live="polite" tabindex="-1" hidden>
<h2>Kết quả</h2>
<div class="r-block"><p class="r-label">Kết quả của bạn</p><p class="r-score" id="r-score"></p><p><strong id="r-label"></strong></p><p id="r-main"></p></div>
<div class="r-block"><p class="r-label">Việc nên làm tiếp</p><div id="r-next"></div></div>
<div class="r-block r-small" id="r-notes"></div>
<p id="r-always" hidden></p>
{actions_row(f'<a class="btn-t ghost" href="/cong-cu">← Các công cụ khác</a>')}
{summary_block(code, tool_name)}
<div class="sources">
<p><strong>Nguồn</strong> (nội dung công cụ cập nhật {TOOL_UPDATED}):</p>
<ol>{"".join(f"<li>{s}</li>" for s in sources)}</ol>
<p class="disclaimer">{disclaimer}</p>
</div>
</section>
{history_block(hist_cols)}
</div></section>
{faq_html(faq)}"""
    write(f"cong-cu/{slug}.html", page(path, f"{title} | {NAME}", meta, body, current="/cong-cu", tool=True,
        extra_head=TOOL_HEAD + f'<script defer src="/cong-cu/assets/{script}"></script>\n<script defer src="/cong-cu/assets/tools.js"></script>\n',
        body_attr=f' data-tool="{data_tool}"',
        extra_ld=[faq_ld(faq), breadcrumb_ld([("/", "Trang chủ"), ("/cong-cu", "Công cụ"), (path, tool_name)])]))
    return path


YNK = [("khong", "Không"), ("co", "Có")]

# 04 — Hội chứng chuyển hóa (đối chiếu 5 tiêu chí)
METS_PATH = generic_tool("hoi-chung-chuyen-hoa", "VSH-04", "Đối chiếu 5 tiêu chí chuyển hóa", "mets", "mets.js",
    "Đối chiếu 5 tiêu chí hội chứng chuyển hóa (chuẩn châu Á)",
    "Nhập vòng eo, huyết áp, triglycerid, HDL-C và đường huyết đói để đối chiếu với 5 tiêu chí của định nghĩa hài hòa 2009, vòng eo châu Á 90/80. Không chẩn đoán.",
    "Đối chiếu 5 tiêu chí chuyển hóa từ phiếu xét nghiệm",
    "Nhập các số trên phiếu khám và xét nghiệm gần nhất. Công cụ đếm xem bao nhiêu chỉ số đạt mốc của định nghĩa hài hòa năm 2009 (vòng eo theo ngưỡng châu Á). Đây không phải chẩn đoán bệnh.",
    f"""<fieldset><legend>Giới tính</legend>{radios("sex", SEX)}</fieldset>
<label class="f">Tuổi <span class="hint">Không bắt buộc. Công cụ dành cho người từ 18 tuổi.</span><input type="number" name="age" inputmode="numeric" min="1" max="110" step="1"></label>
<label class="check"><input type="checkbox" name="pregnant"> Tôi đang mang thai</label>
<label class="f">Vòng eo (cm) <span class="hint"><a href="{BMI_PATH}#cach-do-vong-eo">Cách đo</a></span><input type="number" name="waist" inputmode="decimal" min="50" max="160" step="0.1"></label>
<fieldset><legend>Huyết áp (mmHg)</legend>
<label class="f">Tâm thu (số trên) <input type="number" name="sbp" inputmode="numeric" min="70" max="260" step="1"></label>
<label class="f">Tâm trương (số dưới) <input type="number" name="dbp" inputmode="numeric" min="40" max="160" step="1"></label></fieldset>
<fieldset><legend>Đơn vị trên phiếu xét nghiệm</legend>{radios("unit", [("mmol", "mmol/L"), ("mg", "mg/dL")]).replace('value="mmol" required', 'value="mmol" required checked')}<p class="hint">Phiếu ở Việt Nam thường ghi mmol/L. Chọn đúng đơn vị trước khi nhập.</p></fieldset>
<label class="f">Triglycerid (lúc đói) <input type="number" name="tg" inputmode="decimal" step="0.01"></label>
<label class="f">HDL-C <input type="number" name="hdl" inputmode="decimal" step="0.01"></label>
<label class="f">Glucose (đường huyết) lúc đói <input type="number" name="glu" inputmode="decimal" step="0.01"></label>
<fieldset><legend>Thuốc bác sĩ đang kê cho bạn</legend><p class="hint">Theo định nghĩa gốc, đang dùng thuốc cho chỉ số nào thì tính là đạt tiêu chí đó.</p>
<label class="check"><input type="checkbox" name="medBp"> Thuốc huyết áp</label>
<label class="check"><input type="checkbox" name="medGlu"> Thuốc hạ đường huyết</label>
<label class="check"><input type="checkbox" name="medTg"> Thuốc hạ triglycerid (thường là fibrat hoặc niacin)</label>
<label class="check"><input type="checkbox" name="medHdl"> Thuốc để tăng HDL-C (thường là fibrat hoặc niacin)</label></fieldset>
<p class="hint">Bỏ trống chỉ số chưa có. Công cụ vẫn đếm các chỉ số đã nhập và ghi rõ còn thiếu bao nhiêu.</p>""",
    ["Alberti KGMM, Eckel RH, Grundy SM, et al. Harmonizing the Metabolic Syndrome. <i>Circulation</i>. 2009;120:1640–1645.",
     "Bộ Y tế. Quyết định 2892/QĐ-BYT ngày 22/10/2022, mục 4.2 vòng bụng (nam ≥ 90 cm, nữ ≥ 80 cm)."],
    "Kết quả chỉ đếm số tiêu chí từ số liệu bạn tự nhập, đối chiếu với định nghĩa đã công bố. Đây không phải chẩn đoán, không phải lời khuyên điều trị, không thay thế khám bệnh. Nếu đạt từ 3/5 tiêu chí, hoặc bạn đang có triệu chứng, hãy đến cơ sở y tế.",
    [("Công cụ này có chẩn đoán hội chứng chuyển hóa không?", "Không. Công cụ chỉ đếm xem bao nhiêu chỉ số bạn nhập đạt mốc của định nghĩa hài hòa 2009. Việc xác định bệnh do bác sĩ làm sau khi khám và xem xét nghiệm.", None),
     ("Vì sao vòng eo là 90/80 mà không phải 94/80 hay 102/88?", "Định nghĩa hài hòa 2009 cho phép dùng mốc vòng eo theo từng dân tộc. Với người châu Á, trang này dùng nam ≥ 90 cm, nữ ≥ 80 cm, thống nhất với Quyết định 2892/QĐ-BYT.", None),
     ("Tôi chưa có đủ 5 chỉ số thì sao?", "Vẫn xem được kết quả với các chỉ số đã có. Công cụ ghi rõ còn thiếu bao nhiêu chỉ số và khi nào kết quả có thể thay đổi.", None)],
    ["Tiêu chí", "Nhóm"], "Công cụ 04")

# 05 — FIB-4
FIB_PATH = generic_tool("fib-4", "VSH-05", "Chỉ số FIB-4", "fib4", "fib4.js",
    "Tính chỉ số FIB-4 từ phiếu xét nghiệm (xơ hóa gan)",
    "Tính FIB-4 từ tuổi, AST (GOT), ALT (GPT) và tiểu cầu. Mốc 1,30 / 2,67, từ 65 tuổi mốc dưới 2,0. Phép tính phân loại ban đầu, không chẩn đoán.",
    "Tính chỉ số FIB-4 từ phiếu xét nghiệm",
    "FIB-4 là phép tính từ tuổi, AST, ALT và tiểu cầu, được dùng để phân loại ban đầu khả năng xơ hóa gan ở người có gan nhiễm mỡ hoặc có nguy cơ. Đây không phải chẩn đoán bệnh gan.",
    """<label class="f">Tuổi <input type="number" name="age" inputmode="numeric" min="1" max="110" step="1" required></label>
<label class="f">AST (GOT), U/L <input type="number" name="ast" inputmode="decimal" min="1" max="5000" step="0.1" required></label>
<label class="f">ALT (GPT), U/L <input type="number" name="alt" inputmode="decimal" min="1" max="5000" step="0.1" required></label>
<label class="f">Tiểu cầu (PLT), G/L <span class="hint">G/L = ×10⁹/L = K/µL. Nếu phiếu ghi 250.000/mm³ thì nhập 250.</span><input type="number" name="plt" inputmode="decimal" min="5" max="1500" step="1" required></label>
<p class="hint">Dùng các số trên cùng một lần xét nghiệm.</p>""",
    ["Sterling RK, Lissen E, Clumeck N, et al. Development of a simple noninvasive index to predict significant fibrosis in patients with HIV/HCV coinfection. <i>Hepatology</i>. 2006;43:1317–1325.",
     "Shah AG, Lydecker A, Murray K, et al. Comparison of noninvasive markers of fibrosis in patients with nonalcoholic fatty liver disease. <i>Clin Gastroenterol Hepatol</i>. 2009;7:1104–1112.",
     "McPherson S, Hardy T, Dufour JF, et al. Age as a confounding factor for the accurate non-invasive diagnosis of advanced NAFLD fibrosis. <i>Am J Gastroenterol</i>. 2017;112:740–751.",
     "Rinella ME, Neuschwander-Tetri BA, Siddiqui MS, et al. AASLD Practice Guidance on the clinical assessment and management of nonalcoholic fatty liver disease. <i>Hepatology</i>. 2023;77:1797–1835."],
    "Kết quả chỉ là phép tính từ số bạn tự nhập, đối chiếu với mốc đã công bố. Đây không phải chẩn đoán, không phải lời khuyên điều trị, không thay thế khám bệnh. Nếu FIB-4 trên 2,67, ở vùng chưa xác định, hoặc bạn đang có triệu chứng như vàng da, bụng to lên, phân đen, hãy đến cơ sở y tế.",
    [("FIB-4 có chẩn đoán xơ gan không?", "Không. FIB-4 chỉ phân loại ban đầu: thấp, chưa xác định, hoặc cao. Khi không ở nhóm thấp, bác sĩ thường chỉ định thêm xét nghiệm như đo độ đàn hồi gan.", None),
     ("Vì sao từ 65 tuổi mốc dưới là 2,0?", "Tuổi nằm trong công thức nên FIB-4 tự tăng theo tuổi. Nghiên cứu McPherson 2017 đề xuất mốc dưới 2,0 cho người từ 65 tuổi để giảm kết quả dương tính giả.", None),
     ("Tôi lấy số AST, ALT, tiểu cầu ở đâu?", "Trên phiếu xét nghiệm máu: AST thường ghi là GOT, ALT ghi là GPT (đơn vị U/L), tiểu cầu trong phần công thức máu (PLT, đơn vị G/L).", None)],
    ["FIB-4", "Nhóm"], "Công cụ 05")

# 06 — Sức khỏe nướu
q = lambda name, opts: radios(name, opts)
NUOU_PATH = generic_tool("suc-khoe-nuou", "VSH-06", "Tự kiểm tra sức khỏe nướu", "nuou", "nuou.js",
    "Tự kiểm tra sức khỏe nướu (bộ câu hỏi CDC/AAP)",
    "8 câu hỏi tự trả lời về răng và nướu theo bộ câu hỏi của CDC/AAP, cộng 2 câu dấu hiệu. Không tính điểm, không chẩn đoán, có bản mang đến nha sĩ.",
    "Tự kiểm tra sức khỏe nướu",
    "Tám câu hỏi đầu theo bộ câu hỏi tự trả lời mà CDC và Hội Nha chu Hoa Kỳ (AAP) dùng trong giám sát bệnh nha chu. Công cụ không tính điểm; kết quả là các dấu hiệu nên để nha sĩ xem. Đây không phải chẩn đoán.",
    f"""<fieldset><legend>1. Bạn có nghĩ mình có thể đang có bệnh nướu (bệnh quanh răng) không?</legend>{q("q1", [("khong", "Không"), ("co", "Có"), ("khongro", "Không rõ")])}</fieldset>
<fieldset><legend>2. Nhìn chung, bạn đánh giá sức khỏe răng và nướu của mình thế nào?</legend>{radios("q2", [("tuyetvoi", "Tuyệt vời"), ("ratot", "Rất tốt"), ("tot", "Tốt"), ("tamduoc", "Tạm được"), ("kem", "Kém")])}</fieldset>
<fieldset><legend>3. Bạn đã từng được điều trị bệnh nướu, ví dụ cạo vôi và làm sạch sâu mặt chân răng?</legend>{q("q3", YNK)}</fieldset>
<fieldset><legend>4. Bạn đã từng có răng tự lung lay mà không do chấn thương?</legend>{q("q4", YNK)}</fieldset>
<fieldset><legend>5. Nha sĩ đã từng cho bạn biết có tiêu xương quanh răng?</legend>{q("q5", YNK)}</fieldset>
<fieldset><legend>6. Trong 3 tháng qua, bạn có thấy chiếc răng nào trông không bình thường?</legend>{q("q6", YNK)}</fieldset>
<label class="f">7. Trong 7 ngày qua, ngoài bàn chải, bạn dùng chỉ nha khoa hoặc dụng cụ làm sạch kẽ răng bao nhiêu lần? <input type="number" name="q7" inputmode="numeric" min="0" max="50" step="1"></label>
<label class="f">8. Trong 7 ngày qua, bạn dùng nước súc miệng bao nhiêu lần? <input type="number" name="q8" inputmode="numeric" min="0" max="50" step="1"></label>
<p class="hint">Hai câu dưới do Viện bổ sung để nhận ra dấu hiệu nên khám sớm; không thuộc bộ câu hỏi gốc.</p>
<fieldset><legend>9. Nướu bạn có chảy máu khi chải răng hoặc làm sạch kẽ răng không?</legend>{q("v1", YNK)}</fieldset>
<fieldset><legend>10. Hiện bạn có sưng đau nướu, có mủ, hoặc răng lung lay tăng dần không?</legend>{q("v2", YNK)}</fieldset>""",
    ["Eke PI, Dye BA, Wei L, et al. Self-reported measures for surveillance of periodontitis. <i>J Dent Res</i>. 2013;92(11):1041–1047.",
     "Eke PI, Dye B. Assessment of self-report measures for predicting population prevalence of periodontitis. <i>J Periodontol</i>. 2009;80(9):1371–1379."],
    "Kết quả chỉ phản ánh câu bạn tự trả lời. Đây không phải chẩn đoán, không phải lời khuyên điều trị, không thay thế khám nha khoa. Nếu có sưng đau, có mủ, răng lung lay, hoặc chảy máu nướu kéo dài, hãy đến cơ sở nha khoa.",
    [("Vì sao công cụ không cho điểm?", "Bộ câu hỏi gốc của CDC/AAP được xây dựng để ước tính tỷ lệ bệnh nha chu trong cộng đồng, không phải để kết luận cho từng người. Vì vậy công cụ chỉ liệt kê các dấu hiệu nên để nha sĩ xem.", None),
     ("Chảy máu nướu khi chải răng có đáng lo không?", "Chảy máu nướu là dấu hiệu nướu đang bị kích thích hoặc viêm và nên để nha sĩ xem. Nó không tự nói lên mức độ bệnh; nha sĩ cần khám và đo túi nướu.", None),
     ("Công cụ này có thay khám nha khoa không?", "Không. Công cụ giúp bạn chuẩn bị câu trả lời để mang đến nha sĩ.", None)],
    ["Dấu hiệu", "Nhóm"], "Công cụ 06")

# 07 — Fitzpatrick
FITZ_PATH = generic_tool("fitzpatrick", "VSH-07", "Loại da theo phản ứng với nắng (Fitzpatrick)", "fitz", "fitz.js",
    "Loại da và mức nhạy nắng theo thang Fitzpatrick",
    "Chọn mô tả gần nhất với phản ứng của da bạn khi ra nắng để biết loại da Fitzpatrick I–VI và cách che chắn nắng phù hợp. Không chẩn đoán bệnh da.",
    "Loại da và mức nhạy nắng (thang Fitzpatrick)",
    "Thang Fitzpatrick chia da thành 6 loại theo cách da phản ứng với nắng: dễ bỏng hay dễ rám. Biết loại da giúp chọn cách che chắn nắng phù hợp. Đây không phải chẩn đoán bệnh da.",
    f"""<fieldset><legend>Khi da chưa rám (ví dụ sau một thời gian ít ra nắng), nếu phơi nắng trưa khoảng 30–45 phút mà không che chắn, da bạn thường thế nào?</legend>
{radios("type", [("I", "Luôn bị bỏng nắng (đỏ, rát), không bao giờ rám"), ("II", "Thường bị bỏng nắng, rám rất ít"), ("III", "Đôi khi bỏng nắng nhẹ, rám dần và đều"), ("IV", "Ít khi bỏng nắng, luôn rám dễ"), ("V", "Rất hiếm khi bỏng nắng, rám rất nhanh và sẫm"), ("VI", "Không bao giờ bỏng nắng; da sẫm màu tự nhiên")], col=True)}</fieldset>
<fieldset><legend>Bạn có nốt ruồi mới, nốt ruồi đổi màu hoặc đổi kích thước, chảy máu, hoặc vết loét lâu không lành trên da?</legend>{q("flag", YNK)}</fieldset>""",
    ["Fitzpatrick TB. The validity and practicality of sun-reactive skin types I through VI. <i>Arch Dermatol</i>. 1988;124(6):869–871.",
     "World Health Organization. Global Solar UV Index: A Practical Guide. 2002 (che chắn khi chỉ số UV từ 3 trở lên).",
     "American Academy of Dermatology. Sunscreen FAQs (kem chống nắng phổ rộng SPF 30 trở lên, bôi lại khoảng mỗi 2 giờ)."],
    "Kết quả chỉ phản ánh mô tả bạn tự chọn. Đây không phải chẩn đoán, không phải lời khuyên điều trị, không thay thế khám da liễu. Nếu có nốt ruồi thay đổi, chảy máu, hoặc vết loét lâu lành, hãy đến cơ sở y tế.",
    [("Loại da Fitzpatrick có phải là màu da không?", "Không hẳn. Thang được xây dựng theo cách da phản ứng với nắng (dễ bỏng hay dễ rám). Hai người cùng màu da có thể thuộc hai loại khác nhau.", None),
     ("Da tôi loại IV–VI thì có cần chống nắng không?", "Có. Da sẫm màu ít bỏng nắng hơn nhưng tia UV vẫn góp phần làm da lão hóa sớm và tăng sắc tố. Nên che chắn khi chỉ số UV từ 3 trở lên.", None),
     ("Công cụ này có đánh giá ung thư da không?", "Không. Công cụ chỉ xác định loại da theo phản ứng với nắng. Mọi nốt ruồi thay đổi hoặc vết loét lâu lành cần được bác sĩ da liễu khám.", None)],
    ["Loại", "Dấu hiệu da"], "Công cụ 07")

# ---- Hub
HUB_TOOLS = [
    ("03", "BMI và vòng eo chuẩn châu Á", "bmi-vong-eo-chau-a", True, "Đối chiếu BMI và vòng eo với ngưỡng cho người châu Á của Bộ Y tế."),
    ("02", "Nguy cơ đái tháo đường 10 năm", "nguy-co-dai-thao-duong-findrisc", True, "8 câu hỏi ModAsian FINDRISC, đã dùng trong nghiên cứu tại Việt Nam."),
    ("04", "Hội chứng chuyển hóa", "hoi-chung-chuyen-hoa", True, "Đối chiếu vòng eo, huyết áp, mỡ máu, đường huyết với 5 tiêu chí công bố."),
    ("05", "Điểm FIB-4 (gan nhiễm mỡ)", "fib-4", True, "Tính từ tuổi, AST, ALT và tiểu cầu trên phiếu xét nghiệm."),
    ("06", "Tự kiểm tra sức khỏe nướu", "suc-khoe-nuou", True, "Bộ câu hỏi tự trả lời của CDC/AAP, có bản mang đến nha sĩ."),
    ("07", "Loại da và mức nhạy nắng", "fitzpatrick", True, "Thang Fitzpatrick I–VI và cách che chắn nắng phù hợp."),
    ("01", "Thể chất Đông y (9 thể)", "tu-danh-gia-the-chat-dong-y", False, "Tìm hiểu 9 thể chất. Bài tự đánh giá mở khi hoàn tất quyền sử dụng bảng hỏi."),
]
cards = ""
for num_, name_, slug_, open_, desc_ in HUB_TOOLS:
    badge = '<span class="badge open">Đang mở</span>' if open_ else '<span class="badge soon">Sắp mở</span>'
    inner = f'{badge}<span class="num">Công cụ {num_}</span><h3>{name_}</h3><p>{desc_}</p>'
    if open_:
        cards += f'<a class="hub-card" href="/cong-cu/{slug_}">{inner}</a>'
    elif slug_ == "tu-danh-gia-the-chat-dong-y":
        cards += f'<a class="hub-card soon" href="/cong-cu/{slug_}">{inner}</a>'
    else:
        cards += f'<div class="hub-card soon">{inner}</div>'
hub_body = head("Công cụ tự đánh giá sức khỏe",
    "Các công cụ dựa trên thang đo đã công bố. Kết quả là việc nên làm tiếp và một bản tóm tắt để mang đến bác sĩ. Công cụ không chẩn đoán và không bán sản phẩm.",
    [("/", "Trang chủ")], "Công cụ") + f"""
<section class="block tool hub"><div class="wrap">
<div class="hub-grid">{cards}</div>
<p class="r-small" style="margin-top:18px">Số đo bạn nhập chỉ nằm trên máy của bạn; Viện không nhận được dữ liệu này. Nội dung trên trang không thay thế khám bệnh.</p>
</div></section>"""
write("cong-cu.html", page("/cong-cu", f"Công cụ tự đánh giá sức khỏe | {NAME}",
    "BMI và vòng eo chuẩn châu Á, nguy cơ đái tháo đường 10 năm (ModAsian FINDRISC) và các công cụ sắp mở. Dựa trên thang đo công bố, không chẩn đoán, không bán sản phẩm.",
    hub_body, current="/cong-cu", tool=True, extra_head=TOOL_HEAD,
    extra_ld=[breadcrumb_ld([("/", "Trang chủ"), ("/cong-cu", "Công cụ")])]))

# ---------------------------------------------------------------- sitemap
urls = ["/", "/gioi-thieu", "/san-pham", "/du-an-noi-bat", "/kien-thuc", "/ban-tin", "/lien-he", "/quyen-rieng-tu"]
urls += ["/cong-cu", BMI_PATH, FR_PATH, METS_PATH, FIB_PATH, NUOU_PATH, FITZ_PATH, T01_PATH]  # trang giới thiệu công cụ 01 được index; bài hỏi vẫn khóa  # trang chờ công cụ 01 để noindex, không đưa vào sitemap
urls += [h for h, _, _ in TOPICS]
urls += [f"/kien-thuc/dong-trung-ha-thao/{s}" for s, _ in CORDYCEPS]
urls += [h for h, *_ in NEWS]  # thời sự (CURRENT) is kept off the sitemap and noindexed
with open(os.path.join(OUT, "sitemap.xml"), "w", encoding="utf-8") as f:
    f.write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n')
    for u in urls:
        f.write(f"  <url><loc>{SITE}{u if u != '/' else '/'}</loc><lastmod>2026-09-29</lastmod></url>\n")
    f.write("</urlset>\n")
print("OK", len(urls), "URL trong sitemap")
