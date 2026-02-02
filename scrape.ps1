$html = (Invoke-WebRequest -Uri 'https://voip.knust.edu.gh/' -UseBasicParsing).Content

# Regex to capture the deptid from href and the name from the anchor text
# Matches: href="./extensions?deptid=34" class="name-lbl"> Mastercard </a>
$regex = 'href="\.\/extensions\?deptid=(\d+)"[^>]*>\s*([\s\S]*?)\s*<\/a>'
$matches = [regex]::Matches($html, $regex)
$units = @()

foreach ($match in $matches) {
    if ($match.Groups[2].Value -notmatch '^\s*»\s*$') {
        $name = $match.Groups[2].Value.Trim()
        $id = $match.Groups[1].Value
        
        # Avoid empty names or icons
        if ($name.Length -gt 1) {
            $unit = @{
                name     = $name
                id       = $id
                url      = "https://voip.knust.edu.gh/extensions?deptid=$id"
                category = "Official Unit"
            }
            # Avoid duplicates
            if (-not ($units | Where-Object { $_.id -eq $id })) {
                $units += $unit
            }
        }
    }
}

$json = $units | ConvertTo-Json -Depth 4
"const directoryData = $json;" | Out-File -Encoding UTF8 directory_data.js
Write-Host "Scraped $($units.Count) units."
