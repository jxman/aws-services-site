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
NC='\033[0m' # No Color

# Configuration
S3_BUCKET="www.aws-services.synepho.com"
CLOUDFRONT_DIST_ID="EBTYLWOK3WVOK"
BACKUP_DIR="/tmp/aws-dashboard-backups"

# Step 1: Build
echo -e "${BLUE}Step 1: Building production bundle...${NC}"
npm run build

# Step 1.5: Create 404.html for SPA routing
echo -e "${BLUE}Step 1.5: Creating 404.html for SPA routing...${NC}"
cp dist/index.html dist/404.html
echo -e "${GREEN}✓ 404.html created${NC}"

# Step 2: Backup
echo -e "${BLUE}Step 2: Creating backup...${NC}"
mkdir -p "$BACKUP_DIR"
BACKUP_FILE="$BACKUP_DIR/backup-$(date +%Y%m%d-%H%M%S).html"
aws s3 cp "s3://$S3_BUCKET/index.html" "$BACKUP_FILE" || echo "No existing index.html to backup"
echo -e "${GREEN}✓ Backup saved: $BACKUP_FILE${NC}"

# Step 3: Upload to S3
echo -e "${BLUE}Step 3: Uploading to S3...${NC}"
aws s3 sync dist/ "s3://$S3_BUCKET/" \
  --exclude "data/*" \
  --exclude "reports/*" \
  --delete

# Step 4: Set cache headers for HTML
echo -e "${BLUE}Step 4: Setting cache headers...${NC}"
aws s3 cp "s3://$S3_BUCKET/index.html" "s3://$S3_BUCKET/index.html" \
  --cache-control "no-cache,no-store,must-revalidate" \
  --content-type "text/html" \
  --metadata-directive REPLACE

aws s3 cp "s3://$S3_BUCKET/404.html" "s3://$S3_BUCKET/404.html" \
  --cache-control "no-cache,no-store,must-revalidate" \
  --content-type "text/html" \
  --metadata-directive REPLACE

echo -e "${GREEN}✓ Cache headers set for index.html and 404.html${NC}"

# Step 5: Invalidate CloudFront
echo -e "${BLUE}Step 5: Invalidating CloudFront cache...${NC}"
INVALIDATION_ID=$(aws cloudfront create-invalidation \
  --distribution-id "$CLOUDFRONT_DIST_ID" \
  --paths "/*" \
  --query 'Invalidation.Id' \
  --output text)

echo -e "${GREEN}✓ Invalidation created: $INVALIDATION_ID${NC}"

# Wait for invalidation (optional)
echo -e "${BLUE}Waiting for invalidation to complete...${NC}"
aws cloudfront wait invalidation-completed \
  --distribution-id "$CLOUDFRONT_DIST_ID" \
  --id "$INVALIDATION_ID" && \
  echo -e "${GREEN}✓ Invalidation completed${NC}"

# Step 6: Verify deployment
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ Deployment Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "🌐 Your site is live at: https://aws-services.synepho.com"
echo ""
echo "Verify deployment:"
echo "  curl -I https://aws-services.synepho.com"
echo ""
echo "Rollback (if needed):"
echo "  aws s3 cp $BACKUP_FILE s3://$S3_BUCKET/index.html"
echo ""
