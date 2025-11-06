#!/bin/bash

# AWS Services Dashboard - Deployment Script
# Usage: ./deploy.sh

set -e  # Exit on error

echo "🚀 AWS Services Dashboard - Deployment"
echo "========================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
S3_BUCKET="www.aws-services.synepho.com"
CLOUDFRONT_DIST_ID="EBTYLWOK3WVOK"
BACKUP_DIR="/tmp/aws-dashboard-backups"

# Step 1: Build
echo -e "${BLUE}📦 Step 1: Building production bundle...${NC}"
npm run build
echo -e "${GREEN}✅ Build completed successfully${NC}"
echo ""

# Step 1.5: Create 404.html for SPA routing
echo -e "${BLUE}📄 Step 1.5: Creating 404.html for SPA routing...${NC}"
cp dist/index.html dist/404.html
echo -e "${GREEN}✅ 404.html created${NC}"
echo ""

# Step 2: Backup
echo -e "${BLUE}💾 Step 2: Creating backup...${NC}"
mkdir -p "$BACKUP_DIR"
BACKUP_FILE="$BACKUP_DIR/backup-$(date +%Y%m%d-%H%M%S).html"
aws s3 cp "s3://$S3_BUCKET/index.html" "$BACKUP_FILE" || echo -e "${YELLOW}⚠️  No existing index.html to backup${NC}"
echo -e "${GREEN}✅ Backup saved: $BACKUP_FILE${NC}"
echo ""

# Step 3: Upload to S3
echo -e "${BLUE}☁️  Step 3: Uploading to S3...${NC}"
aws s3 sync dist/ "s3://$S3_BUCKET/" \
  --exclude "data/*" \
  --exclude "reports/*" \
  --delete
echo -e "${GREEN}✅ Files uploaded to S3${NC}"
echo ""

# Step 4: Set cache headers for HTML
echo -e "${BLUE}⚙️  Step 4: Setting cache headers...${NC}"
aws s3 cp "s3://$S3_BUCKET/index.html" "s3://$S3_BUCKET/index.html" \
  --cache-control "no-cache,no-store,must-revalidate" \
  --content-type "text/html" \
  --metadata-directive REPLACE

aws s3 cp "s3://$S3_BUCKET/404.html" "s3://$S3_BUCKET/404.html" \
  --cache-control "no-cache,no-store,must-revalidate" \
  --content-type "text/html" \
  --metadata-directive REPLACE

echo -e "${GREEN}✅ Cache headers configured${NC}"
echo ""

# Step 5: Invalidate CloudFront
echo -e "${BLUE}🔄 Step 5: Invalidating CloudFront cache...${NC}"
INVALIDATION_ID=$(aws cloudfront create-invalidation \
  --distribution-id "$CLOUDFRONT_DIST_ID" \
  --paths "/*" \
  --query 'Invalidation.Id' \
  --output text)

echo -e "${GREEN}✅ Invalidation created: $INVALIDATION_ID${NC}"
echo ""

# Wait for invalidation (optional)
echo -e "${BLUE}⏳ Waiting for invalidation to complete...${NC}"
aws cloudfront wait invalidation-completed \
  --distribution-id "$CLOUDFRONT_DIST_ID" \
  --id "$INVALIDATION_ID" && \
  echo -e "${GREEN}✅ Invalidation completed${NC}"

# Step 6: Verify deployment
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "🌐 Your site is live at: ${BLUE}https://aws-services.synepho.com${NC}"
echo ""
echo -e "${YELLOW}📋 Verify deployment:${NC}"
echo "  curl -I https://aws-services.synepho.com"
echo ""
echo -e "${YELLOW}🔙 Rollback (if needed):${NC}"
echo "  aws s3 cp $BACKUP_FILE s3://$S3_BUCKET/index.html"
echo ""
