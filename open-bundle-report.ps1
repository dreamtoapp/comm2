# Open the client bundle analyzer report
Start-Process "file:///$((Get-Location).Path)/.next/analyze/client.html"

# Uncomment these lines if you want to open the other reports as well
# Start-Process "file:///$((Get-Location).Path)/.next/analyze/edge.html"
# Start-Process "file:///$((Get-Location).Path)/.next/analyze/nodejs.html"
