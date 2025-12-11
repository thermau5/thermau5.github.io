# PowerShell script to download LinkedIn company logos
# Run this script to download and save the logos locally

$basePath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $basePath

# Define logo URLs and filenames
$logos = @(
    @{
        Url = "https://media.licdn.com/dms/image/v2/C510BAQFCGqEmSwrc4w/company-logo_100_100/company-logo_100_100/0/1631338994369?e=1767225600&v=beta&t=jFzx7PWKGuI35R4ntsdcxLIozGENnOwTNF4_P3JB1QA"
        Filename = "caltech_logo.png"
    },
    @{
        Url = "https://media.licdn.com/dms/image/v2/C4E0BAQH-sXOOSUF3aA/company-logo_100_100/company-logo_100_100/0/1631319371681?e=1767225600&v=beta&t=3wWunjJgU2Nin4whX5I-J5YFYxMLjxXrTvFV5xKtquc"
        Filename = "northwestern_logo.png"
    },
    @{
        Url = "https://media.licdn.com/dms/image/v2/C4D0BAQEfIYMsq0Jgjg/company-logo_100_100/company-logo_100_100/0/1653123622160/gamma_paradigm_research_logo?e=1767225600&v=beta&t=Fe9kX0abGP5FmUhZIeX8lcPyWaLbamwWFgHL1mMw1m4"
        Filename = "gamma_paradigm_logo.png"
    },
    @{
        Url = "https://media.licdn.com/dms/image/v2/C4D0BAQEMmhF9TqUCgA/company-logo_100_100/company-logo_100_100/0/1630545704089/university_of_washington_logo?e=1767225600&v=beta&t=CsuSTIqEb0rt7BwJNYzrKpExW8sq5T-wfWuW9IKr9-U"
        Filename = "uw_logo.png"
    },
    @{
        Url = "https://media.licdn.com/dms/image/v2/C560BAQGAh08jkWo23Q/company-logo_100_100/company-logo_100_100/0/1679904708552/national_taiwan_university_logo?e=1767225600&v=beta&t=qsit03kDMX6aVDtEPQz3U2Ef8-Y2wV_R45Kckzvf560"
        Filename = "ntu_logo.png"
    }
)

Write-Host "Downloading company logos..." -ForegroundColor Cyan

foreach ($logo in $logos) {
    try {
        Write-Host "Downloading $($logo.Filename)..." -ForegroundColor Yellow
        Invoke-WebRequest -Uri $logo.Url -OutFile $logo.Filename -UseBasicParsing
        Write-Host "✓ Successfully downloaded $($logo.Filename)" -ForegroundColor Green
    }
    catch {
        Write-Host "✗ Failed to download $($logo.Filename): $_" -ForegroundColor Red
    }
}

Write-Host "`nAll downloads completed!" -ForegroundColor Cyan
Write-Host "Now update index.html to use local image paths." -ForegroundColor Yellow


