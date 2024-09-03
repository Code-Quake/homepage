C:/Users/Jljor/.bun/bin/bun.exe run build
Copy-Item public -Destination .next\standalone -Recurse
Copy-Item .next\static -Destination .next\standalone\.next -Recurse
docker build -t codequake .
Set-Location -Path p:\docker\codequake
docker compose up -d
Set-Location -Path P:\homepage
