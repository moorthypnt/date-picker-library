# -----------------------------
# Simple Release Script for PowerShell
# Usage:
#   .\release.ps1 <branch> <version> "commit message"
# Example:
#   .\release.ps1 main v1.0.3 "Layout changed"
# -----------------------------

param(
    [string]$branch,
    [string]$version,
    [string]$message
)

# Validate inputs
if (-not $branch -or -not $version -or -not $message) {
    Write-Host "❌ Usage: .\release.ps1 <branch> <version> 'commit message'"
    exit 1
}

Write-Host "🚀 Releasing on branch: $branch"
Write-Host "📝 Commit message: $message"
Write-Host "🏷 Version tag: $version"

# 1️⃣ Check if tag exists locally
$localTagExists = git tag --list $version
# 2️⃣ Check if tag exists remotely
$remoteTagExists = git ls-remote --tags origin | Select-String "refs/tags/$version"

if ($localTagExists -or $remoteTagExists) {
    Write-Host "❌ Version conflict: tag $version already exists!"
    exit 1
}

# 3️⃣ Add all changes
git add .

# 4️⃣ Commit
git commit -m "$message"

# 5️⃣ Push the branch
git push origin $branch

# 6️⃣ Create tag
git tag $version

# 7️⃣ Push the tag
git push origin $version

# 8️⃣ Print CDN link
$repoName = Split-Path -Leaf $PWD
Write-Host "✅ Release $version pushed successfully!"
Write-Host "🔗 CDN link:"
Write-Host "https://cdn.jsdelivr.net/gh/moorthypnt/$repoName@$version/"
