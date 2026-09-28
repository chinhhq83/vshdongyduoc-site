$BaseFolder = "C:\Users\ADMIN\Desktop\vshdongyduoc-site\vsh-landing-site\song-ngu-cho-be\words"

# Thêm jfif vào list
$ImageExtensions = @("png","jpg","jpeg","gif","bmp","tiff","webp","jfif")

# Lấy tất cả folder con
$Folders = Get-ChildItem -Path $BaseFolder -Directory

foreach ($folder in $Folders) {
    Write-Host "Đang xử lý: $($folder.FullName)" -ForegroundColor Cyan

    # Lọc file ảnh đúng đuôi
    $images = Get-ChildItem -Path $folder.FullName -File | 
              Where-Object { $ImageExtensions -contains ($_.Extension.TrimStart(".").ToLower()) }

    foreach ($img in $images) {
        $output = [System.IO.Path]::ChangeExtension($img.FullName, ".webp")

        # Convert bằng ImageMagick
        magick "$($img.FullName)" -quality 80 "$output"

        if (Test-Path $output) {
            Remove-Item $img.FullName -Force
            Write-Host "Đã chuyển + xoá: $($img.Name)" -ForegroundColor Green
        } else {
            Write-Host "Lỗi: $($img.Name)" -ForegroundColor Red
        }
    }
}

Write-Host "Hoàn tất chuyển đổi tất cả ảnh!" -ForegroundColor Yellow
