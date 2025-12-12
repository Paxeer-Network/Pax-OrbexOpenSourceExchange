@echo off
echo Starting icon renaming process...

set renamed=0
set errors=0

for %%f in (*_.png) do (
    set "filename=%%~nf"
    set "newname=!filename:~0,-1!.webp"
    
    if exist "!newname!" (
        echo Warning: !newname! already exists, skipping %%f
        set /a errors+=1
    ) else (
        ren "%%f" "!newname!"
        echo Renamed: %%f -^> !newname!
        set /a renamed+=1
    )
)

echo.
echo Renaming complete!
echo Successfully renamed: %renamed% files
echo Errors/Skipped: %errors% files

if %errors% gtr 0 (
    echo.
    echo Some files were not renamed. Check the output above for details.
)

pause 