# This script generates a PDF version of the resume from the HTML file using headless Microsoft Edge.
# It saves the output PDF directly in the public/ folder for download, and copies a backup to the legacy/ folder.

$edgePath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if (-not (Test-Path $edgePath)) {
    Write-Error "Microsoft Edge was not found at $edgePath. Please update the path to Edge or Chrome."
    exit 1
}

$sourceHtml = "file:///$PSScriptRoot/../public/Amit_Padhan_Resume.html"
$targetPdf = "$PSScriptRoot/../public/Amit_Padhan_Resume.pdf"
$legacyPdf = "$PSScriptRoot/../legacy/Amit_Padhan_Resume.pdf"

Write-Host "Generating PDF using headless Microsoft Edge..." -ForegroundColor Cyan
Write-Host "Source: $sourceHtml"
Write-Host "Target: $targetPdf"

Start-Process $edgePath -ArgumentList "--headless", "--disable-gpu", "--print-to-pdf=$targetPdf", "--no-pdf-header-footer", $sourceHtml -Wait -NoNewWindow

if (Test-Path $targetPdf) {
    Write-Host "PDF generated successfully!" -ForegroundColor Green
    Copy-Item -Path $targetPdf -Destination $legacyPdf -Force
    Write-Host "Copied backup to: $legacyPdf" -ForegroundColor Green
} else {
    Write-Error "Failed to generate PDF."
    exit 1
}
