$assetsDir = Join-Path $PSScriptRoot "public/assets"
$htmlFile = Join-Path $PSScriptRoot "src/pages/CelebrationPage.jsx"

if (-not (Test-Path $assetsDir)) {
    Write-Host "Error: 'public/assets' folder not found." -ForegroundColor Red
    exit
}

if (-not (Test-Path $htmlFile)) {
    Write-Host "Error: 'src/pages/CelebrationPage.jsx' not found." -ForegroundColor Red
    exit
}

# Scan for all images
$images = Get-ChildItem -Path $assetsDir -File | Where-Object { $_.Extension -match '\.(jpg|jpeg|png|webp|gif)$' }

if ($images.Count -eq 0) {
    Write-Host "No images found in 'assets' folder." -ForegroundColor Yellow
    exit
}

# Generate JS array string
$jsArray = "const slidesData = [`r`n"
foreach ($img in $images) {
    $path = "assets/" + $img.Name
    $jsArray += "                '$path',`r`n"
}
# Trim trailing comma
$jsArray = $jsArray.Substring(0, $jsArray.Length - 3) + "`r`n            ];"

Write-Host "Found $($images.Count) images in 'assets' folder." -ForegroundColor Green

# Read HTML file content
$content = [System.IO.File]::ReadAllText($htmlFile)

# Replace block between markers
$pattern = '(?s)/\* --- Slideshow Data Start --- \*/.*?\/\* --- Slideshow Data End --- \*/'
$replacement = "/* --- Slideshow Data Start --- */`r`n            $jsArray`r`n            /* --- Slideshow Data End --- */"

if ($content -match $pattern) {
    $newContent = [System.Text.RegularExpressions.Regex]::Replace($content, $pattern, $replacement)
    [System.IO.File]::WriteAllText($htmlFile, $newContent)
    Write-Host "Successfully updated slideshow images in 'CelebrationPage.jsx'!" -ForegroundColor Green
} else {
    Write-Host "Error: Could not find slideshow markers in 'CelebrationPage.jsx'." -ForegroundColor Red
}
