
# Pull the latest changes from remote main
git fetch origin
git pull --ff-only origin main

if ($?) {
    Write-Host "Successfully pulled the latest changes."
    
    # Add changes to commit
    git add .

    # Prompt for commit message
    $commitMsg = Read-Host "Enter commit message"

    # Commit with the provided message
    git commit -m $commitMsg

    # Push the changes to GitHub
    git push origin main

    Write-Host "Changes successfully pushed to GitHub."
} else {
    Write-Host "Failed to pull changes. Please resolve any conflicts."
}
