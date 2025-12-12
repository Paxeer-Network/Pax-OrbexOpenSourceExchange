# Script to rename PNG files by removing underscore and changing extension to webp
# This script will rename files from "name_.png" to "name.webp"

Write-Host "Starting icon renaming process..." -ForegroundColor Green

# Get all PNG files in the current directory
$pngFiles = Get-ChildItem -Filter "*.png"

Write-Host "Found $($pngFiles.Count) PNG files to rename" -ForegroundColor Yellow

$renamedCount = 0
$errorCount = 0

foreach ($file in $pngFiles) {
    try {
        # Check if the filename ends with _.png
        if ($file.Name -match "^(.+)_\.png$") {
            $newName = $matches[1] + ".webp"
            $newPath = Join-Path $file.DirectoryName $newName
            
            # Check if the target file already exists
            if (Test-Path $newPath) {
                Write-Host "Warning: $newName already exists, skipping $($file.Name)" -ForegroundColor Yellow
                $errorCount++
                continue
            }
            
            # Rename the file
            Rename-Item -Path $file.FullName -NewName $newName
            Write-Host "Renamed: $($file.Name) -> $newName" -ForegroundColor Green
            $renamedCount++
        } else {
            Write-Host "Skipping $($file.Name) - doesn't match expected pattern (name_.png)" -ForegroundColor Yellow
            $errorCount++
        }
    }
    catch {
        Write-Host "Error renaming $($file.Name): $($_.Exception.Message)" -ForegroundColor Red
        $errorCount++
    }
}

Write-Host "`nRenaming complete!" -ForegroundColor Green
Write-Host "Successfully renamed: $renamedCount files" -ForegroundColor Green
Write-Host "Errors/Skipped: $errorCount files" -ForegroundColor Yellow

if ($errorCount -gt 0) {
    Write-Host "`nSome files were not renamed. Check the output above for details." -ForegroundColor Yellow
} 