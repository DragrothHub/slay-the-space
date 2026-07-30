# Projektpfad
$projectPath = "C:\Users\carst\Desktop\space-game\slay-the-space"

# In Projektordner wechseln
Set-Location $projectPath

# Projektordner im Explorer öffnen
Start-Process explorer.exe $projectPath

# npm run dev in neuem Terminal starten
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd `"$projectPath`"; npm run dev"

# Kurz warten, damit der Dev-Server hochfÃ¤hrt
Start-Sleep -Seconds 3

# Firefox mit URL starten
Start-Process "C:\Program Files (x86)\Mozilla Firefox\firefox.exe" "http://localhost:5173"

# VS Code im Projektordner öffnen
code $projectPath