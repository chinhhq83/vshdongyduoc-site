# Đường dẫn đến file words.json
$JsonFile = "C:\Users\ADMIN\Desktop\vshdongyduoc-site\vsh-landing-site\song-ngu-cho-be\words.json"

# Đọc nội dung JSON như text
$content = Get-Content $JsonFile -Raw

# Các đuôi ảnh cần đổi sang webp
$extensions = @("jpg", "jpeg", "png", "jfif")

foreach ($ext in $extensions) {
    # Tìm tất cả .ext trong trường "image": "... .ext"
    $pattern = "\." + $ext
    $content = $content -replace $pattern, ".webp"
}

# Ghi đè lại file JSON
Set-Content -Path $JsonFile -Value $content -Encoding UTF8

Write-Host "Đã cập nhật xong tất cả đuôi ảnh sang .webp!" -ForegroundColor Green
