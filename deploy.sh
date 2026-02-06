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

# Step 6: Site verification
echo ""
echo -e "${BLUE}🔍 Step 6: Running site verification...${NC}"
SITE_URL="https://aws-services.synepho.com"
VERIFY_FAILED=0

# Check main page
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL")
RESPONSE_TIME=$(curl -s -o /dev/null -w "%{time_total}" "$SITE_URL")
if [ "$HTTP_STATUS" = "200" ]; then
  echo -e "  ${GREEN}✅ Main page: HTTP $HTTP_STATUS (${RESPONSE_TIME}s)${NC}"
else
  echo -e "  ${YELLOW}⚠️  Main page: HTTP $HTTP_STATUS (${RESPONSE_TIME}s)${NC}"
  VERIFY_FAILED=1
fi

# Check SPA routes
for ROUTE in "/regions" "/services" "/coverage" "/whats-new" "/about"; do
  ROUTE_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL$ROUTE")
  ROUTE_TIME=$(curl -s -o /dev/null -w "%{time_total}" "$SITE_URL$ROUTE")
  if [ "$ROUTE_STATUS" = "200" ]; then
    echo -e "  ${GREEN}✅ $ROUTE: HTTP $ROUTE_STATUS (${ROUTE_TIME}s)${NC}"
  else
    echo -e "  ${YELLOW}⚠️  $ROUTE: HTTP $ROUTE_STATUS (${ROUTE_TIME}s)${NC}"
    VERIFY_FAILED=1
  fi
done

# Check data API endpoint
DATA_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL/data/complete-data.json")
DATA_TIME=$(curl -s -o /dev/null -w "%{time_total}" "$SITE_URL/data/complete-data.json")
if [ "$DATA_STATUS" = "200" ]; then
  echo -e "  ${GREEN}✅ Data API: HTTP $DATA_STATUS (${DATA_TIME}s)${NC}"
else
  echo -e "  ${YELLOW}⚠️  Data API: HTTP $DATA_STATUS (${DATA_TIME}s)${NC}"
  VERIFY_FAILED=1
fi

# Check static assets (CSS/JS from built bundle)
ASSET_CHECK=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL" | head -1)
INDEX_CONTENT=$(curl -s "$SITE_URL")
CSS_FILE=$(echo "$INDEX_CONTENT" | grep -o 'href="/assets/[^"]*\.css"' | head -1 | sed 's/href="//;s/"//')
JS_FILE=$(echo "$INDEX_CONTENT" | grep -o 'src="/assets/[^"]*\.js"' | head -1 | sed 's/src="//;s/"//')

if [ -n "$CSS_FILE" ]; then
  CSS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL$CSS_FILE")
  CSS_TIME=$(curl -s -o /dev/null -w "%{time_total}" "$SITE_URL$CSS_FILE")
  echo -e "  ${GREEN}✅ CSS bundle: HTTP $CSS_STATUS (${CSS_TIME}s)${NC}"
fi

if [ -n "$JS_FILE" ]; then
  JS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL$JS_FILE")
  JS_TIME=$(curl -s -o /dev/null -w "%{time_total}" "$SITE_URL$JS_FILE")
  echo -e "  ${GREEN}✅ JS bundle: HTTP $JS_STATUS (${JS_TIME}s)${NC}"
fi

echo ""

# Final summary
if [ "$VERIFY_FAILED" = "0" ]; then
  echo -e "${GREEN}========================================${NC}"
  echo -e "${GREEN}🎉 Deployment Complete - All checks passed!${NC}"
  echo -e "${GREEN}========================================${NC}"
else
  echo -e "${YELLOW}========================================${NC}"
  echo -e "${YELLOW}⚠️  Deployment Complete - Some checks failed${NC}"
  echo -e "${YELLOW}========================================${NC}"
fi

echo ""
echo -e "🌐 Your site is live at: ${BLUE}$SITE_URL${NC}"
echo ""
echo -e "${YELLOW}🔙 Rollback (if needed):${NC}"
echo "  aws s3 cp $BACKUP_FILE s3://$S3_BUCKET/index.html"
echo ""
