Quick Docker + Azure guide for URLShortener

Build and run locally:

# build
docker build -t urlshortener:local .
# run (provide .env values as env vars)
docker run --rm -p 3000:3000 -e SMTP_USER=you@gmail.com -e GOOGLE_CLIENT_ID=... -e GOOGLE_CLIENT_SECRET=... -e GOOGLE_REFRESH_TOKEN=... urlshortener:local

Deploy to Azure App Service (Docker container)

1) Create a Resource Group and Container Registry (ACR) or use Docker Hub.

# Login to Azure
az login
# Create resource group
az group create -n my-rg -l eastus
# Create ACR
az acr create -n myacrname -g my-rg --sku Basic

2) Build and push image to ACR

az acr build --registry myacrname --image urlshortener:latest .

3) Create App Service using the image

az webapp create -g my-rg -p "Linux" -n myappname --deployment-container-image-name myacrname.azurecr.io/urlshortener:latest

4) Configure environment variables in the App Service (APPLICATION SETTINGS)

# Set app settings (example)
az webapp config appsettings set -g my-rg -n myappname --settings PORT=3000 SMTP_USER=you@gmail.com GOOGLE_CLIENT_ID=... GOOGLE_CLIENT_SECRET=... GOOGLE_REFRESH_TOKEN=...

Notes
- Don't commit `.env` to git. Use App Settings in Azure to supply secrets.
- Ensure your MongoDB is accessible from Azure (use Azure CosmosDB with Mongo API or supply a Mongo connection string via env var and allow public IP if using local Mongo).
- For Gmail OAuth2, ensure your redirect URIs allowed in the Google Cloud Console; if using the get_refresh_token helper locally, keep refresh token secret.
